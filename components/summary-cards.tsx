import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Coins, Zap, Hash } from "lucide-react"

interface SummaryCardsProps {
  summary: {
    totalHbd?: number
    totalHive?: number
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
      title: "Total HIVE",
      value: (summary.totalHive ?? 0).toFixed(3),
      suffix: "HIVE",
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
    <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-5">
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
            <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">{card.title}</CardTitle>
              <Icon
                className={`h-3 w-3 sm:h-4 sm:w-4 ${card.highlight ? "text-primary" : "text-muted-foreground/60"}`}
              />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <p
                className={`text-lg font-bold tracking-tight sm:text-2xl ${card.highlight ? "text-primary" : "text-foreground"}`}
              >
                {card.prefix && <span className="text-base sm:text-xl">{card.prefix}</span>}
                {card.value}
              </p>
              {card.suffix && (
                <p className="text-[10px] text-muted-foreground mt-0.5 sm:text-xs sm:mt-1">{card.suffix}</p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
