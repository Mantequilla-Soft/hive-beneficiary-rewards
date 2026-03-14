"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface VoteAccount {
  account: string
  votes: number
  avgWeight: number
  estimatedValue: number
  percentage: number
}

interface VotingPieChartProps {
  data: VoteAccount[]
  direction: "given" | "received"
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B9D",
  "#8DD1E1",
  "#D0ED57",
  "#A4DE6C",
]

export function VotingPieChart({ data, direction }: VotingPieChartProps) {
  if (data.length === 0) {
    return null
  }

  // Get top 7 accounts and group the rest as "Others"
  const top7 = data.slice(0, 7)
  const others = data.slice(7)

  const chartData = top7.map((account) => ({
    name: account.account,
    value: account.estimatedValue,
    percentage: account.percentage,
    votes: account.votes,
  }))

  // Add "Others" if there are more than 7 accounts
  if (others.length > 0) {
    const othersValue = others.reduce((sum, acc) => sum + acc.estimatedValue, 0)
    const othersPercentage = others.reduce((sum, acc) => sum + acc.percentage, 0)
    const othersVotes = others.reduce((sum, acc) => sum + acc.votes, 0)

    chartData.push({
      name: "Others",
      value: othersValue,
      percentage: othersPercentage,
      votes: othersVotes,
    })
  }

  const title = direction === "given" ? "Vote Distribution by Account" : "Voter Distribution"

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
          <p className="font-semibold text-foreground">@{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Value: <span className="font-medium text-primary">${data.value.toFixed(2)}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Votes: <span className="font-medium">{data.votes}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Value Share: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  const renderLabel = (entry: any) => {
    return `${entry.percentage.toFixed(1)}%`
  }

  return (
    <Card className="mt-6 sm:mt-8 animate-[slide-up_0.4s_ease-out_0.1s_both]">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <p className="text-xs text-muted-foreground sm:text-sm mt-1">
          Top 7 accounts by estimated value
        </p>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 sm:pt-0">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => `@${value}`}
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
