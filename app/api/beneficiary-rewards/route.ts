import { NextRequest, NextResponse } from "next/server"

interface HafAHItem {
  timestamp: string
  op: {
    type: number
    value: {
      hbd_payout?: string
      hive_payout?: string
      vesting_payout?: string
    }
  }
}

interface HafAHResponse {
  operations?: {
    items?: HafAHItem[]
  }
  _links?: {
    next?: string
  }
}

interface DailyRow {
  date: string
  hbd: number
  hive: number
  vests: number
  count: number
}

function parseAsset(asset?: string): number {
  if (!asset) return 0
  const n = Number.parseFloat(asset.split(" ")[0])
  return Number.isFinite(n) ? n : 0
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

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const account = params.get("account") || "spk.beneficiary"
  const days = [1, 7, 30].includes(Number(params.get("days")))
    ? Number(params.get("days"))
    : 7

  const cutoff = cutoffDate(days)

  const daily = new Map<string, DailyRow>()
  let totals = { hbd: 0, hive: 0, vests: 0, count: 0 }

  try {
    let nextUrl: string | null =
      `https://api.syncad.com/hafah-api/accounts/${account}/operations` +
      `?operation-types=39&page-size=100`

    while (nextUrl) {
      const res = await fetch(nextUrl, {
        next: { revalidate: 60 },
      })

      if (!res.ok) {
        throw new Error(`Syncad API error ${res.status}`)
      }

      const data: HafAHResponse = await res.json()
      const items = data.operations?.items ?? []

      let stop = false

      for (const item of items) {
        if (item.op?.type !== 39) continue

        const ts = new Date(item.timestamp)
        if (ts < cutoff) {
          stop = true
          break
        }

        const hbd = parseAsset(item.op.value.hbd_payout)
        const hive = parseAsset(item.op.value.hive_payout)
        const vests = parseAsset(item.op.value.vesting_payout)

        const day = dayKey(item.timestamp)

        if (!daily.has(day)) {
          daily.set(day, { date: day, hbd: 0, hive: 0, vests: 0, count: 0 })
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

      if (stop) break

      nextUrl = data._links?.next
        ? `https://api.syncad.com${data._links.next}`
        : null
    }

    const by_day = Array.from(daily.values()).sort(
      (a, b) => (a.date < b.date ? 1 : -1)
    )

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
    console.error("Error fetching beneficiary rewards:", err)
    return NextResponse.json(
      { error: "Failed to fetch beneficiary rewards" },
      { status: 500 }
    )
  }
}
