import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RewardEntry {
  date: string
  hbd: number
  hive: number
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
    <Card className="mt-6 sm:mt-8 animate-[slide-up_0.4s_ease-out_0.2s_both]">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Reward History</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <div className="overflow-x-auto -mx-0 sm:mx-0 touch-pan-x">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium text-xs sm:text-sm px-3 sm:px-4">
                  Date
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-medium text-xs sm:text-sm px-2 sm:px-4">
                  HBD
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-medium text-xs sm:text-sm px-2 sm:px-4">
                  HIVE
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-medium text-xs sm:text-sm px-2 sm:px-4">
                  HP
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-medium text-xs sm:text-sm px-2 sm:px-4">
                  Total
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-medium text-xs sm:text-sm px-3 sm:px-4">
                  #
                </TableHead>
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
                  <TableCell className="font-medium text-foreground/90 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-4">
                    <span className="hidden sm:inline">{row.date}</span>
                    <span className="sm:hidden">{row.date.slice(5)}</span>
                  </TableCell>
                  <TableCell className="text-right text-foreground/80 tabular-nums text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-4">
                    {(row.hbd ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-foreground/80 tabular-nums text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-4">
                    {(row.hive ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-foreground/80 tabular-nums text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-4">
                    {(row.hp ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary tabular-nums text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-4">
                    ${(row.totalHbd ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-foreground/70 tabular-nums text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-4">
                    {row.payouts ?? 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
