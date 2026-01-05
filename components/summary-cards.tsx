import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Coins, Zap, Hash } from "lucide-react"

interface SummaryCardsProps {
  summary: {
    totalHbd?: number
    totalHp?: number
    totalValue?: number
    payoutCount?: number
  }
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total HBD",
      value: (summary.totalHbd ?? 0).toFixed(3),
      suffix: "HBD",
      icon: Coins,
      highlight: false,
    },
    {
      title: "Total Hive Power",
      value: (summary.totalHp ?? 0).toFixed(3),
      suffix: "HP",
      icon: Zap,
      highlight: false,
    },
    {
      title: "Total Value",
      value: (summary.totalValue ?? 0).toFixed(2),
      prefix: "$",
      suffix: "USD",
      icon: DollarSign,
      highlight: true,
    },
    {
      title: "Payouts",
      value: (summary.payoutCount ?? 0).toString(),
      suffix: "",
      icon: Hash,
      highlight: false,
    },
  ]

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card
            key={card.title}
            className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
              card.highlight
                ? "border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/10"
                : "hover:border-muted-foreground/20"
            }`}
            style={{
              animation: `scale-in 0.3s ease-out ${index * 0.1}s both`,
            }}
          >
            {card.highlight && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            )}
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.highlight ? "text-primary" : "text-muted-foreground/60"}`} />
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold tracking-tight ${card.highlight ? "text-primary" : "text-foreground"}`}>
                {card.prefix && <span className="text-xl">{card.prefix}</span>}
                {card.value}
              </p>
              {card.suffix && <p className="text-xs text-muted-foreground mt-1">{card.suffix}</p>}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
