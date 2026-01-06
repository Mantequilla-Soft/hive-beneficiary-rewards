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
        className="fixed bottom-4 right-4 gap-2 bg-card/80 backdrop-blur-sm"
      >
        <HelpCircle className="h-4 w-4" />
        Help
      </Button>
    )
  }

  return (
    <Card className="mt-6 border-muted/50 bg-card/50 animate-[fade-in_0.3s_ease-out]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <HelpCircle className="h-4 w-4 text-emerald-400" />
            How to use
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">1. Enter account</p>
              <p className="text-xs text-muted-foreground">Type any Hive username that receives beneficiary rewards</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">2. Select time range</p>
              <p className="text-xs text-muted-foreground">Choose Today, 7 Days, or 30 Days to filter results</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">3. View rewards</p>
              <p className="text-xs text-muted-foreground">See HBD, HP, and total value (HBD is pegged to ~$1 USD)</p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-md bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <strong className="text-foreground">What are beneficiary rewards?</strong>
          <span className="ml-1">
            When content creators set beneficiaries on their posts, a portion of the post rewards is automatically sent
            to those accounts. This tool tracks those incoming rewards.
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
