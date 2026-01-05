import { type NextRequest, NextResponse } from "next/server"

/**
 * enum_virtual_ops returns:
 * ops: { [key: string]: { block, timestamp, op: [number, object] } }
 */
type VirtualOp = {
  block: number
  timestamp: string
  op: [
    number,
    {
      benefactor: string
      hbd_payout?: string | { amount: string; nai: string; precision: number }
      hive_payout?: string | { amount: string; nai: string; precision: number }
      vesting_payout?: string | { amount: string; nai: string; precision: number }
    },
  ]
}

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

async function hiveRpc(method: string, params: any) {
  const res = await fetch("https://api.hive.blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
    next: { revalidate: 300 },
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
    // 1) Head block
    const props = await hiveRpc("database_api.get_dynamic_global_properties", {})

    let block = props.head_block_number

    const BLOCKS_PER_DAY = 28800
    const MAX_BLOCKS = BLOCKS_PER_DAY * days

    let scanned = 0
    let keepGoing = true

    // 2) Scan virtual ops
    while (keepGoing && scanned < MAX_BLOCKS) {
      const result = await hiveRpc("account_history_api.enum_virtual_ops", {
        block_range_begin: Math.max(block - 1000, 0),
        block_range_end: block,
        include_reversible: false,
      })

      if (scanned === 0) {
        console.log("[v0] enum_virtual_ops result keys:", Object.keys(result))
        console.log("[v0] result.ops type:", typeof result.ops, Array.isArray(result.ops))
        if (result.ops && result.ops.length > 0) {
          console.log("[v0] First op structure:", JSON.stringify(result.ops[0], null, 2))
        }
      }

      const ops = result.ops || []

      if (!Array.isArray(ops)) {
        console.log("[v0] ops is not an array, type:", typeof ops)
        block -= 1000
        scanned += 1000
        continue
      }

      for (const item of ops) {
        const opData = item.op
        if (!opData) continue

        // Check if it's the array format [type_num, value] or object format { type, value }
        let opType: string | number
        let opValue: any

        if (Array.isArray(opData)) {
          opType = opData[0]
          opValue = opData[1]
        } else if (typeof opData === "object") {
          opType = opData.type
          opValue = opData.value
        } else {
          continue
        }

        // Accept both numeric 39 and string "comment_benefactor_reward_operation"
        const isTargetOp =
          opType === 39 ||
          opType === "comment_benefactor_reward_operation" ||
          (typeof opType === "string" && opType.includes("benefactor"))

        if (!isTargetOp) continue
        if (opValue.benefactor !== account) continue

        const timestamp = item.timestamp || ""
        const ts = new Date(timestamp.endsWith("Z") ? timestamp : timestamp + "Z")
        if (ts < cutoff) {
          keepGoing = false
          break
        }

        const hbd = parseAsset(opValue.hbd_payout)
        const hive = parseAsset(opValue.hive_payout)
        const vests = parseAsset(opValue.vesting_payout)

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

      block -= 1000
      scanned += 1000
      if (block <= 0) break
    }

    const by_day = Array.from(daily.values()).sort((a, b) => (a.date < b.date ? 1 : -1))

    return NextResponse.json({
      account,
      range_days: days,
      source: "rpc_enum_virtual_ops",
      totals: {
        hbd: Number(totals.hbd.toFixed(3)),
        hive: Number(totals.hive.toFixed(3)),
        vests: Number(totals.vests.toFixed(6)),
        count: totals.count,
      },
      by_day,
    })
  } catch (err) {
    console.error("Virtual ops error:", err)
    return NextResponse.json({ error: "Failed to fetch beneficiary rewards" }, { status: 500 })
  }
}
