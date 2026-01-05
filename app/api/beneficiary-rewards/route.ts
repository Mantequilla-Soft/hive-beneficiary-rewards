import { type NextRequest, NextResponse } from "next/server"

interface DailyRow {
  date: string
  hbd: number
  hive: number
  vests: number
  count: number
}

function parseAsset(asset?: string | { amount: string; nai: string; precision: number }): number {
  if (!asset) return 0

  // Handle object format: { amount: "1234", nai: "@@000000013", precision: 3 }
  if (typeof asset === "object" && asset.amount !== undefined) {
    const amount = Number(asset.amount)
    const precision = asset.precision || 0
    return Number.isFinite(amount) ? amount / Math.pow(10, precision) : 0
  }

  // Handle string format: "1.234 HBD"
  if (typeof asset === "string") {
    const n = Number.parseFloat(asset.split(" ")[0])
    return Number.isFinite(n) ? n : 0
  }

  return 0
}

function dayKey(ts: string): string {
  return ts.split("T")[0]
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

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const account = params.get("account") || "spk.beneficiary"
  const days = [1, 7, 30].includes(Number(params.get("days"))) ? Number(params.get("days")) : 7

  const cutoff = cutoffDate(days)

  const daily = new Map<string, DailyRow>()
  const totals = { hbd: 0, hive: 0, vests: 0, count: 0 }

  try {
    // Use condenser_api.get_account_history
    // params: [account, start (-1 = most recent), limit (max 1000)]
    let start = -1
    let keepGoing = true
    const batchSize = 1000
    const seen = new Set<number>()

    while (keepGoing) {
      // Fetch account history batch
      const history: [number, { timestamp: string; op: [string, Record<string, unknown>] }][] = await hiveRpc(
        "condenser_api.get_account_history",
        [account, start, batchSize],
      )

      console.log("[v0] Fetched history batch, start:", start, "count:", history?.length)

      if (!history || history.length === 0) {
        break
      }

      let oldestSeq = Number.POSITIVE_INFINITY

      for (const [seq, tx] of history) {
        // Skip if already processed (pagination overlap)
        if (seen.has(seq)) continue
        seen.add(seq)

        if (seq < oldestSeq) oldestSeq = seq

        const [opType, opValue] = tx.op

        // Only process comment_benefactor_reward operations
        if (opType !== "comment_benefactor_reward") continue

        const timestamp = tx.timestamp || ""
        const ts = new Date(timestamp.endsWith("Z") ? timestamp : timestamp + "Z")

        // Stop if we've gone past our date range
        if (ts < cutoff) {
          keepGoing = false
          continue
        }

        console.log("[v0] Found benefactor reward:", timestamp, opValue)

        const hbd = parseAsset(opValue.hbd_payout as string)
        const hive = parseAsset(opValue.hive_payout as string)
        const vests = parseAsset(opValue.vesting_payout as string)

        const day = dayKey(timestamp)

        if (!daily.has(day)) {
          daily.set(day, {
            date: day,
            hbd: 0,
            hive: 0,
            vests: 0,
            count: 0,
          })
        }

        const d = daily.get(day)!
        d.hbd += hbd
        d.hive += hive
        d.vests += vests
        d.count += 1

        totals.hbd += hbd
        totals.hive += hive
        totals.vests += vests
        totals.count += 1
      }

      // Move to older history
      if (oldestSeq <= 1 || history.length < batchSize) {
        break
      }
      start = oldestSeq - 1
    }

    const by_day = Array.from(daily.values()).sort((a, b) => (a.date < b.date ? 1 : -1))

    return NextResponse.json({
      account,
      range_days: days,
      totals: {
        hbd: Number(totals.hbd.toFixed(3)),
        hive: Number(totals.hive.toFixed(3)),
        vests: Number(totals.vests.toFixed(6)),
        count: totals.count,
      },
      by_day,
    })
  } catch (err) {
    console.error("Account history error:", err)
    return NextResponse.json({ error: "Failed to fetch beneficiary rewards" }, { status: 500 })
  }
}
