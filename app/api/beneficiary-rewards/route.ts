import { type NextRequest, NextResponse } from "next/server"

interface DailyRow {
  date: string
  hbd: number
  hp: number
  payouts: number
}

function parseAsset(
  asset?: string | { amount: string; nai: string; precision: number }
): number {
  if (!asset) return 0

  // Object format: { amount: "1234", nai: "@@000000013", precision: 3 }
  if (typeof asset === "object" && asset.amount !== undefined) {
    const amount = Number(asset.amount)
    const precision = asset.precision || 0
    return Number.isFinite(amount) ? amount / Math.pow(10, precision) : 0
  }

  // String format: "1.234 HBD"
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
    // cache corto, suficiente para dashboard
    next: { revalidate: 60 },
  })

  const json = await res.json()
  if (json.error) {
    throw new Error(json.error.message)
  }
  return json.result
}

async function getHpPerVestsRatio(): Promise<number> {
  // dynamic global props (condenser)
  const props = await hiveRpc("condenser_api.get_dynamic_global_properties", [])

  // Typical strings:
  // total_vesting_fund_hive: "123456.789 HIVE"
  // total_vesting_shares: "987654321.123456 VESTS"
  const fundHive = parseAsset(props.total_vesting_fund_hive as string) // HIVE
  const totalVests = parseAsset(props.total_vesting_shares as string)  // VESTS

  if (!fundHive || !totalVests) return 0

  // HP per 1 VESTS (HIVE per VESTS)
  return fundHive / totalVests
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const account = params.get("account") || "spk.beneficiary"
  const days = [1, 7, 30].includes(Number(params.get("days"))) ? Number(params.get("days")) : 7

  const cutoff = cutoffDate(days)

  const daily = new Map<string, DailyRow>()

  // Totals
  let totalHbd = 0
  let totalHp = 0
  let totalPayouts = 0

  try {
    // 1) Get conversion ratio once (HP per VEST)
    const hpPerVests = await getHpPerVestsRatio()

    // 2) Account history pagination
    let start = -1
    let keepGoing = true
    const batchSize = 1000
    const seen = new Set<number>()

    while (keepGoing) {
      const history: [number, { timestamp: string; op: [string, Record<string, unknown>] }][] =
        await hiveRpc("condenser_api.get_account_history", [account, start, batchSize])

      if (!history || history.length === 0) break

      let oldestSeq = Number.POSITIVE_INFINITY

      for (const [seq, tx] of history) {
        if (seen.has(seq)) continue
        seen.add(seq)

        if (seq < oldestSeq) oldestSeq = seq

        const [opType, opValue] = tx.op

        if (opType !== "comment_benefactor_reward") continue

        const timestamp = tx.timestamp || ""
        const ts = new Date(timestamp.endsWith("Z") ? timestamp : timestamp + "Z")

        if (ts < cutoff) {
          keepGoing = false
          continue
        }

        const hbd = parseAsset(opValue.hbd_payout as any)
        const vests = parseAsset(opValue.vesting_payout as any)

        // Convert VESTS -> HP
        const hp = hpPerVests > 0 ? vests * hpPerVests : 0

        const day = dayKey(timestamp)

        if (!daily.has(day)) {
          daily.set(day, {
            date: day,
            hbd: 0,
            hp: 0,
            payouts: 0,
          })
        }

        const d = daily.get(day)!
        d.hbd += hbd
        d.hp += hp
        d.payouts += 1

        totalHbd += hbd
        totalHp += hp
        totalPayouts += 1
      }

      if (oldestSeq <= 1 || history.length < batchSize) break
      start = oldestSeq - 1
    }

    const by_day = Array.from(daily.values()).sort((a, b) => (a.date < b.date ? 1 : -1))

    // Total combined (nota: mezcla unidades, pero lo quieres así por ahora)
    const totalCombined = totalHbd + totalHp

    return NextResponse.json({
      account,
      range_days: days,
      totals: {
        hbd: Number(totalHbd.toFixed(3)),
        hp: Number(totalHp.toFixed(3)),
        combined: Number(totalCombined.toFixed(3)),
        payouts: totalPayouts,
      },
      by_day: by_day.map((r) => ({
        date: r.date,
        hbd: Number(r.hbd.toFixed(3)),
        hp: Number(r.hp.toFixed(3)),
        payouts: r.payouts,
      })),
    })
  } catch (err) {
    console.error("Account history error:", err)
    return NextResponse.json({ error: "Failed to fetch beneficiary rewards" }, { status: 500 })
  }
}
