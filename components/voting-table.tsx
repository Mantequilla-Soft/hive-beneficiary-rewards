"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface VoteAccount {
  account: string
  votes: number
  avgWeight: number
  estimatedValue: number
  percentage: number
}

interface VotingTableProps {
  data: VoteAccount[]
  direction: "given" | "received"
}

const ITEMS_PER_PAGE = 50

export function VotingTable({ data, direction }: VotingTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  if (data.length === 0) {
    return null
  }

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentData = data.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  const title = direction === "given" ? "Accounts Voted For" : "Voters"

  return (
    <Card className="mt-6 sm:mt-8 animate-[slide-up_0.4s_ease-out_0.2s_both]">
      <CardHeader className="p-3 sm:p-6 flex flex-row items-center justify-between">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <div className="text-xs text-muted-foreground sm:text-sm">
          Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length}
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <div className="overflow-x-auto -mx-0 sm:mx-0 touch-pan-x">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium text-xs sm:text-sm px-3 sm:px-4">
                  Account
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-medium text-xs sm:text-sm px-2 sm:px-4">
                  Votes
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-medium text-xs sm:text-sm px-2 sm:px-4">
                  % Value
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-medium text-xs sm:text-sm px-2 sm:px-4">
                  Avg Weight
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-medium text-xs sm:text-sm px-3 sm:px-4">
                  Est. Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row, index) => (
                <TableRow
                  key={row.account}
                  className="border-border/30 transition-colors duration-200 hover:bg-muted/30"
                  style={{
                    animation: `fade-in 0.3s ease-out ${index * 0.02}s both`,
                  }}
                >
                  <TableCell className="font-medium text-foreground/90 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-4">
                    <a
                      href={`https://peakd.com/@${row.account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline transition-colors"
                    >
                      @{row.account}
                    </a>
                  </TableCell>
                  <TableCell className="text-right text-foreground/80 tabular-nums text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-4">
                    {row.votes}
                  </TableCell>
                  <TableCell className="text-right text-foreground/80 tabular-nums text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-4">
                    {row.percentage.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right text-foreground/80 tabular-nums text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-4">
                    {row.avgWeight.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary tabular-nums text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-4">
                    ${row.estimatedValue.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/50 px-3 py-3 sm:px-4 sm:py-4 mt-2">
            <div className="text-xs text-muted-foreground sm:text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="text-xs sm:text-sm"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="text-xs sm:text-sm"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
