import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RewardEntry {
  date: string
  hbd: number
  hive: number
  vests: number
}

interface RewardsTableProps {
  data: RewardEntry[]
}

export function RewardsTable({ data }: RewardsTableProps) {
  if (data.length === 0) {
    return null
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg">Reward History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">HBD</TableHead>
                <TableHead className="text-right">HIVE</TableHead>
                <TableHead className="text-right">VESTS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.date}>
                  <TableCell className="font-medium">{row.date}</TableCell>
                  <TableCell className="text-right">{row.hbd.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{row.hive.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{row.vests.toFixed(6)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
