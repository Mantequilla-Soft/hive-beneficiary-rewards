import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RewardEntry {
  date: string
  hbd: number
  hp: number
  totalHbd: number
  payouts: number
}

interface RewardsTableProps {
  data: RewardEntry[]
}

export function RewardsTable({ data }: RewardsTableProps) {
  if (data.length === 0) {
    return null
  }

  return (
    <Card className="mt-8 animate-[slide-up_0.4s_ease-out_0.2s_both]">
      <CardHeader>
        <CardTitle className="text-lg">Reward History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">HBD</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">HP</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">Total (USD)</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">Payouts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={row.date}
                  className="border-border/30 transition-colors duration-200 hover:bg-muted/30"
                  style={{
                    animation: `fade-in 0.3s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <TableCell className="font-medium text-foreground/90">{row.date}</TableCell>
                  <TableCell className="text-right text-foreground/80 tabular-nums">
                    {(row.hbd ?? 0).toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right text-foreground/80 tabular-nums">
                    {(row.hp ?? 0).toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary tabular-nums">
                    ${(row.totalHbd ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-foreground/70 tabular-nums">{row.payouts ?? 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
