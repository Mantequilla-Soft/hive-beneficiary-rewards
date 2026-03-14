import { type NextRequest, NextResponse } from "next/server"

interface VoteData {
  account: string
  voteCount: number
  totalWeight: number
  avgWeight: number
  estimatedValue: number
  percentage: number
}

interface VoterVestsCache {
  [account: string]: number
}

function cutoffDate(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(0, 0, 0, 0)
  return d
}

async function hiveRpc(method: string, params: unknown[]) {
  const res = await fetch("https://api.hive.blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
    next: { revalidate: 60 },
  })

  const json = await res.json()
  if (json.error) {
    throw new Error(json.error.message)
  }
  return json.result
}

async function getRewardFund() {
  const fund = await hiveRpc("condenser_api.get_reward_fund", ["post"])
  return fund
}

async function getHivePrice(): Promise<number> {
  const ticker = await hiveRpc("condenser_api.get_ticker", [])
  const price = Number.parseFloat(ticker.latest)
  return Number.isFinite(price) ? price : 0
}

async function getAccountVests(account: string): Promise<number> {
  try {
    const accounts = await hiveRpc("condenser_api.get_accounts", [[account]])
    if (!accounts || accounts.length === 0) return 0

    const acc = accounts[0]
    const vestingShares = parseAsset(acc.vesting_shares)
    const receivedVestingShares = parseAsset(acc.received_vesting_shares)
    const delegatedVestingShares = parseAsset(acc.delegated_vesting_shares)

    // Effective vesting shares = own + received - delegated
    const effectiveVests = vestingShares + receivedVestingShares - delegatedVestingShares
    return effectiveVests
  } catch (err) {
    console.error(`Failed to fetch vests for ${account}:`, err)
    return 0
  }
}

async function batchGetAccountVests(accountNames: string[]): Promise<Map<string, number>> {
  const vestsMap = new Map<string, number>()

  if (accountNames.length === 0) return vestsMap

  // Hive API can handle up to 1000 accounts at once, but we'll batch in groups of 100 for safety
  const batchSize = 100
  const batches: string[][] = []

  for (let i = 0; i < accountNames.length; i += batchSize) {
    batches.push(accountNames.slice(i, i + batchSize))
  }

  for (const batch of batches) {
    try {
      const accounts = await hiveRpc("condenser_api.get_accounts", [batch])
      if (!accounts) continue

      for (const acc of accounts) {
        const vestingShares = parseAsset(acc.vesting_shares)
        const receivedVestingShares = parseAsset(acc.received_vesting_shares)
        const delegatedVestingShares = parseAsset(acc.delegated_vesting_shares)
        const effectiveVests = vestingShares + receivedVestingShares - delegatedVestingShares
        vestsMap.set(acc.name, effectiveVests)
      }
    } catch (err) {
      console.error(`Failed to fetch vests for batch:`, err)
    }
  }

  return vestsMap
}

function parseAsset(asset?: string): number {
  if (!asset || typeof asset !== "string") return 0
  const n = Number.parseFloat(asset.split(" ")[0])
  return Number.isFinite(n) ? n : 0
}

async function getDynamicGlobalProperties() {
  return await hiveRpc("condenser_api.get_dynamic_global_properties", [])
}

function calculateVoteValue(
  vests: number,
  weight: number,
  rewardBalance: number,
  recentClaims: string,
  totalVestingShares: number,
  totalVestingFund: number,
): number {
  if (vests === 0 || weight === 0 || totalVestingShares === 0) return 0

  const HIVE_100_PERCENT = 10000
  const absWeight = Math.abs(weight)

  // Calculate the voting power as a percentage
  const votePowerPercent = absWeight / HIVE_100_PERCENT

  // Calculate what fraction of total vesting shares this represents
  const vestShareFraction = vests / totalVestingShares

  // The reward pool is distributed proportionally to vesting share weight
  // A vote's value depends on the account's share of total vesting and the vote weight used
  // This is an estimation that accounts for:
  // - Reward pool distribution over time
  // - Multiple votes from the same account
  // - Curation vs author rewards split
  const dailyRewardPool = rewardBalance / 7 // Reward pool lasts roughly 7 days
  const voteShare = vestShareFraction * votePowerPercent

  // Scaling factor: accounts for multiple votes per day and reward distribution
  // This is a rough approximation - actual values depend on many factors
  const estimatedValue = voteShare * dailyRewardPool / 50

  return estimatedValue
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const account = params.get("account") || ""
  const days = [1, 7, 30].includes(Number(params.get("days"))) ? Number(params.get("days")) : 7
  const direction = params.get("direction") === "received" ? "received" : "given"

  if (!account) {
    return NextResponse.json({ error: "Account parameter is required" }, { status: 400 })
  }

  const cutoff = cutoffDate(days)
  const accountVotes = new Map<string, VoteData>()

  let totalVotes = 0
  let totalWeight = 0
  let totalEstimatedValue = 0

  try {
    const [rewardFund, hivePrice, dgp] = await Promise.all([
      getRewardFund(),
      getHivePrice(),
      getDynamicGlobalProperties(),
    ])

    // Parse reward fund data
    const rewardBalance = parseAsset(rewardFund.reward_balance)
    const recentClaims = rewardFund.recent_claims || "0"

    // Parse dynamic global properties for vesting calculations
    const totalVestingFund = parseAsset(dgp.total_vesting_fund_hive)
    const totalVestingShares = parseAsset(dgp.total_vesting_shares)

    // First pass: collect all votes and voter accounts
    const voteRecords: Array<{ relevantAccount: string; voteVoter: string; weight: number }> = []
    const votersToFetch = new Set<string>()

    // Fetch account history
    let start = -1
    let keepGoing = true
    const batchSize = 1000
    const seen = new Set<number>()

    while (keepGoing) {
      const history: [number, { timestamp: string; op: [string, any] }][] = await hiveRpc(
        "condenser_api.get_account_history",
        [account, start, batchSize],
      )

      if (!history || history.length === 0) break

      let oldestSeq = Number.POSITIVE_INFINITY

      for (const [seq, tx] of history) {
        if (seen.has(seq)) continue
        seen.add(seq)

        if (seq < oldestSeq) oldestSeq = seq

        const [opType, opValue] = tx.op

        if (opType !== "vote") continue

        const timestamp = tx.timestamp || ""
        const ts = new Date(timestamp.endsWith("Z") ? timestamp : timestamp + "Z")

        if (ts < cutoff) {
          keepGoing = false
          continue
        }

        // Vote operation fields: voter, author, permlink, weight
        const voter = opValue.voter as string
        const author = opValue.author as string
        const weight = Number(opValue.weight) || 0

        // Skip zero-weight votes (vote removal)
        if (weight === 0) continue

        // Determine the relevant account and voter based on direction
        let relevantAccount: string
        let voteVoter: string

        if (direction === "given") {
          // We want votes that this account gave to others
          if (voter !== account) continue
          relevantAccount = author // The account that received the vote
          voteVoter = voter // The voter is the main account
        } else {
          // We want votes that others gave to this account
          if (author !== account) continue
          relevantAccount = voter // The account that gave the vote
          voteVoter = voter // The voter is the relevant account
        }

        // Collect vote data
        voteRecords.push({ relevantAccount, voteVoter, weight })
        votersToFetch.add(voteVoter)

        totalVotes += 1
        totalWeight += Math.abs(weight)
      }

      if (oldestSeq <= 1 || history.length < batchSize) break
      start = oldestSeq - 1
    }

    // Batch fetch all voter vesting shares
    console.log(`Fetching vesting shares for ${votersToFetch.size} unique voters...`)
    const voterVestsMap = await batchGetAccountVests(Array.from(votersToFetch))
    console.log(`Fetched ${voterVestsMap.size} account vesting shares`)

    // Process all vote records with cached vesting data
    for (const record of voteRecords) {
      const { relevantAccount, voteVoter, weight } = record

      // Get or create vote data for this account
      if (!accountVotes.has(relevantAccount)) {
        accountVotes.set(relevantAccount, {
          account: relevantAccount,
          voteCount: 0,
          totalWeight: 0,
          avgWeight: 0,
          estimatedValue: 0,
          percentage: 0,
        })
      }

      const data = accountVotes.get(relevantAccount)!
      data.voteCount += 1
      data.totalWeight += Math.abs(weight)

      // Calculate vote value using cached vesting data
      const voterVests = voterVestsMap.get(voteVoter) || 0
      const voteValue = calculateVoteValue(
        voterVests,
        weight,
        rewardBalance,
        recentClaims,
        totalVestingShares,
        totalVestingFund,
      )

      data.estimatedValue += voteValue
      totalEstimatedValue += voteValue
    }

    // Calculate averages and percentages
    const accountList = Array.from(accountVotes.values()).map((data) => {
      data.avgWeight = data.voteCount > 0 ? data.totalWeight / data.voteCount / 100 : 0 // Convert to percentage
      // Percentage based on VALUE share, not vote count (reflects Hive's stake-weighted system)
      data.percentage = totalEstimatedValue > 0 ? (data.estimatedValue / totalEstimatedValue) * 100 : 0
      return data
    })

    // Sort by estimated value (descending)
    accountList.sort((a, b) => b.estimatedValue - a.estimatedValue)

    const avgWeight = totalVotes > 0 ? totalWeight / totalVotes / 100 : 0

    return NextResponse.json({
      account,
      direction,
      range_days: days,
      hivePrice: Number(hivePrice.toFixed(3)),
      totals: {
        votes: totalVotes,
        uniqueAccounts: accountVotes.size,
        avgWeight: Number(avgWeight.toFixed(2)),
        estimatedValue: Number(totalEstimatedValue.toFixed(2)),
      },
      accounts: accountList.map((a) => ({
        account: a.account,
        votes: a.voteCount,
        avgWeight: Number(a.avgWeight.toFixed(2)),
        estimatedValue: Number(a.estimatedValue.toFixed(2)),
        percentage: Number(a.percentage.toFixed(2)),
      })),
    })
  } catch (err) {
    console.error("Voting activity error:", err)
    return NextResponse.json({ error: "Failed to fetch voting activity" }, { status: 500 })
  }
}
