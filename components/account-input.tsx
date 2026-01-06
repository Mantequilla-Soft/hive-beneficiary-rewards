"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AccountInputProps {
  value: string
  onChange: (value: string) => void
}

export function AccountInput({ value, onChange }: AccountInputProps) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 w-full md:w-auto">
      <Label htmlFor="account" className="text-xs sm:text-sm font-medium">
        Account name
      </Label>
      <Input
        id="account"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. hbdstabilizer"
        className="w-full md:w-64 text-sm"
      />
    </div>
  )
}
