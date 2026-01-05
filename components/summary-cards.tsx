import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SummaryCardsProps {
  summary: {
    totalHbd?: number
    totalHive?: number
    totalVests?: number
    payoutCount?: number
  }
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total HBD",
      value: (summary.totalHbd ?? 0).toFixed(3),
      suffix: "HBD",
    },
    {
      title: "Total HIVE",
      value: (summary.totalHive ?? 0).toFixed(3),
      suffix: "HIVE",
    },
    {
      title: "Total VESTS",
      value: (summary.totalVests ?? 0).toFixed(6),
      suffix: "VESTS",
    },
    {
      title: "Payouts",
      value: (summary.payoutCount ?? 0).toString(),
      suffix: "",
    },
  ]

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {card.value}
              {card.suffix && <span className="ml-1 text-sm font-normal text-muted-foreground">{card.suffix}</span>}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
