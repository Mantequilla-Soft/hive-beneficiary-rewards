"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { AccountInput } from "@/components/account-input"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { VotingDirectionSelector } from "@/components/voting-direction-selector"
import { VotingSummaryCards } from "@/components/voting-summary-cards"
import { VotingPieChart } from "@/components/voting-pie-chart"
import { VotingTable } from "@/components/voting-table"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type TimeRange = "today" | "7days" | "30days"
type Direction = "given" | "received"

export default function VotingPage() {
  const [account, setAccount] = useState("")
  const [timeRange, setTimeRange] = useState<TimeRange>("7days")
  const [direction, setDirection] = useState<Direction>("given")

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

      const res = await fetch(`/api/voting-activity?account=${account.trim()}&days=${days}&direction=${direction}`)

      if (!res.ok) {
        throw new Error("Failed to fetch voting activity")
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
        <div className="mb-4 sm:mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Beneficiary Rewards
            </Button>
          </Link>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">Hive Voting Activity</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Track voting patterns for any Hive account - see who they vote for or who votes for them
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <AccountInput value={account} onChange={setAccount} />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
                <VotingDirectionSelector value={direction} onChange={setDirection} />
              </div>

              <Button
                onClick={handleFetch}
                className="w-full sm:w-auto transition-transform duration-200 hover:scale-105 active:scale-95"
                disabled={loading || !account.trim()}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Votes"
                )}
              </Button>
            </div>

            {(timeRange === "30days" || timeRange === "7days") && direction === "received" && !loading && (
              <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-600 dark:text-yellow-400 sm:px-4 sm:py-3">
                <p className="font-medium">⏱️ This may take a few minutes</p>
                <p className="text-xs mt-1">
                  Popular accounts with many voters require fetching data for each voter. Please be patient while we
                  process the results.
                </p>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="mt-4 rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-3 text-sm text-blue-600 dark:text-blue-400 sm:mt-6 sm:px-4 sm:py-4 animate-[scale-in_0.3s_ease-out]">
            <div className="flex items-start gap-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Processing voting data...</p>
                <p className="text-xs mt-1 opacity-90">
                  {direction === "received"
                    ? "Fetching vote history and calculating values for each voter. This may take a few minutes for popular accounts."
                    : "Analyzing voting patterns and calculating estimated values..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 sm:mt-6 sm:px-4 sm:py-3 animate-[scale-in_0.3s_ease-out]">
            {error}
          </div>
        )}

        {data && (
          <div className="animate-[slide-up_0.4s_ease-out]">
            <VotingSummaryCards
              summary={{
                votes: data.totals.votes,
                uniqueAccounts: data.totals.uniqueAccounts,
                estimatedValue: data.totals.estimatedValue,
                avgWeight: data.totals.avgWeight,
              }}
            />

            {data.accounts.length === 0 ? (
              <div className="mt-6 rounded-md border border-muted bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground sm:mt-8 sm:px-4 sm:py-8 animate-[fade-in_0.5s_ease-out]">
                No voting activity found for this account in the selected time range.
              </div>
            ) : (
              <>
                <VotingPieChart data={data.accounts} direction={direction} />
                <VotingTable data={data.accounts} direction={direction} />
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
