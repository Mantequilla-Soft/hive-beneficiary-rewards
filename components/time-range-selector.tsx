"use client"

import { Button } from "@/components/ui/button"

interface TimeRangeSelectorProps {
  value: "today" | "7days" | "30days"
  onChange: (value: "today" | "7days" | "30days") => void
}

const options = [
  { value: "today" as const, label: "Today" },
  { value: "7days" as const, label: "7 Days" },
  { value: "30days" as const, label: "30 Days" },
]

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="inline-flex w-full sm:w-auto rounded-lg border border-border bg-muted p-1">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(option.value)}
          className="flex-1 sm:flex-none px-2 sm:px-3 text-xs sm:text-sm"
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
