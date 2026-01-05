"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { AccountInput } from "@/components/account-input"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { SummaryCards } from "@/components/summary-cards"
import { RewardsTable } from "@/components/rewards-table"
import { Button } from "@/components/ui/button"

type TimeRange = "today" | "7days" | "30days"

export default function Page() {
  const [account, setAccount] = useState("spk.beneficiary")
  const [timeRange, setTimeRange] = useState<TimeRange>("7days")

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const daysMap: Record<TimeRange, number> = {
    today: 1,
    "7days": 7,
    "30days": 30,
  }

  async function handleFetch() {
    try {
      setLoading(true)
      setError(null)

      const days = daysMap[timeRange]

      const res = await fetch(`/api/beneficiary-rewards?account=${account}&days=${days}`)

      if (!res.ok) {
        throw new Error("Failed to fetch beneficiary rewards")
      }

      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message || "Unknown error")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <DashboardHeader />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <AccountInput value={account} onChange={setAccount} />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            <Button onClick={handleFetch} className="w-full sm:w-auto">
              {loading ? "Loading..." : "Fetch rewards"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {data && (
          <>
            <SummaryCards
              summary={{
                totalHbd: data.totals.hbd,
                totalHive: data.totals.hive,
                totalVests: data.totals.vests,
                payoutCount: data.totals.count,
              }}
            />

            {data.by_day.length === 0 ? (
              <div className="mt-8 rounded-md border border-muted bg-muted/30 px-4 py-8 text-center text-muted-foreground">
                No beneficiary rewards found for this account in the selected time range.
              </div>
            ) : (
              <RewardsTable data={data.by_day} />
            )}
          </>
        )}
      </div>
    </main>
  )
}
