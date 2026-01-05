"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AccountInputProps {
  value: string
  onChange: (value: string) => void
}

export function AccountInput({ value, onChange }: AccountInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="account" className="text-sm font-medium">
        Account name
      </Label>
      <Input
        id="account"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter account name"
        className="w-full sm:w-64"
      />
    </div>
  )
}
