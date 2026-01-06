"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, X, Search, Calendar, DollarSign } from "lucide-react"

export function HelpSection() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 gap-2 bg-card/90 backdrop-blur-sm shadow-lg"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Help</span>
      </Button>
    )
  }

  return (
    <Card className="mt-4 sm:mt-6 border-muted/50 bg-card/50 animate-[fade-in_0.3s_ease-out]">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
            <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            How to use
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 sm:grid-cols-3">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-foreground">1. Enter account</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Type any Hive username</p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-foreground">2. Select time range</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Choose Today, 7 Days, or 30 Days</p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-foreground">3. View rewards</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">HBD is pegged to ~$1 USD</p>
            </div>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 rounded-md bg-muted/30 px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs text-muted-foreground">
          <strong className="text-foreground">What are beneficiary rewards?</strong>
          <span className="ml-1">
            Beneficiary rewards on the Hive Blockchain are a built-in way to share a portion of a post's payout with
            other accounts automatically. Instead of the author receiving 100% of the rewards, the author can assign
            percentages to one or more beneficiaries.
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
