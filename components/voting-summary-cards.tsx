import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, Users, DollarSign, Percent } from "lucide-react"

interface VotingSummaryCardsProps {
  summary: {
    votes?: number
    uniqueAccounts?: number
    estimatedValue?: number
    avgWeight?: number
  }
}

export function VotingSummaryCards({ summary }: VotingSummaryCardsProps) {
  const cards = [
    {
      title: "Total Votes",
      value: (summary.votes ?? 0).toString(),
      suffix: "votes",
      icon: ThumbsUp,
      highlight: false,
    },
    {
      title: "Unique Accounts",
      value: (summary.uniqueAccounts ?? 0).toString(),
      suffix: "accounts",
      icon: Users,
      highlight: false,
    },
    {
      title: "Estimated Value",
      value: (summary.estimatedValue ?? 0).toFixed(2),
      prefix: "$",
      suffix: "USD",
      icon: DollarSign,
      highlight: true,
    },
    {
      title: "Avg Vote Weight",
      value: (summary.avgWeight ?? 0).toFixed(2),
      suffix: "%",
      icon: Percent,
      highlight: false,
    },
  ]

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
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
