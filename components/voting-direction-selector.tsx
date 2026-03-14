"use client"

import { Button } from "@/components/ui/button"

interface VotingDirectionSelectorProps {
  value: "given" | "received"
  onChange: (value: "given" | "received") => void
}

const options = [
  { value: "given" as const, label: "Votes Given" },
  { value: "received" as const, label: "Votes Received" },
]

export function VotingDirectionSelector({ value, onChange }: VotingDirectionSelectorProps) {
  return (
    <div className="inline-flex w-full sm:w-auto rounded-lg border border-border bg-muted p-1">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(option.value)}
          className="flex-1 sm:flex-none px-3 sm:px-4 text-xs sm:text-sm"
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
