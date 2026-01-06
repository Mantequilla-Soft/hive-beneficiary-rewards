"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { AccountInput } from "@/components/account-input"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { SummaryCards } from "@/components/summary-cards"
import { RewardsTable } from "@/components/rewards-table"
import { HelpSection } from "@/components/help-section"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

type TimeRange = "today" | "7days" | "30days"

export default function Page() {
  const [account, setAccount] = useState("")
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
    if (!account.trim()) {
      setError("Please enter a Hive account name")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const days = daysMap[timeRange]

      const res = await fetch(`/api/beneficiary-rewards?account=${account.trim()}&days=${days}`)

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
    <main className="flex min-h-screen flex-col bg-background animate-[fade-in_0.5s_ease-out]">
      <div className="mx-auto w-full max-w-5xl flex-1 px-3 py-6 sm:px-4 sm:py-8">
        <DashboardHeader />

        <HelpSection />

        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-4 md:flex-row md:items-end md:justify-between animate-[slide-up_0.4s_ease-out_0.1s_both]">
          <AccountInput value={account} onChange={setAccount} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            <Button
              onClick={handleFetch}
              className="w-full sm:w-auto transition-transform duration-200 hover:scale-105 active:scale-95"
              disabled={loading || !account.trim()}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Loading...
                </span>
              ) : (
                "Fetch rewards"
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 sm:mt-6 sm:px-4 sm:py-3 animate-[scale-in_0.3s_ease-out]">
            {error}
          </div>
        )}

        {data && (
          <div className="animate-[slide-up_0.4s_ease-out]">
            <SummaryCards
              summary={{
                totalHbd: data.totals.hbd,
                totalHp: data.totals.hp,
                totalValue: data.totals.totalValue,
                payoutCount: data.totals.payouts,
              }}
            />

            {data.by_day.length === 0 ? (
              <div className="mt-6 rounded-md border border-muted bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground sm:mt-8 sm:px-4 sm:py-8 animate-[fade-in_0.5s_ease-out]">
                No beneficiary rewards found for this account in the selected time range.
              </div>
            ) : (
              <RewardsTable data={data.by_day} />
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
