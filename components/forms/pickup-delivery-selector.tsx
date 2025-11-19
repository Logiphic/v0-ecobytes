"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PickupDeliverySelectorProps {
  value: 'pickup' | 'delivery' | null
  onChange: (value: 'pickup' | 'delivery') => void
}

export function PickupDeliverySelector({ value, onChange }: PickupDeliverySelectorProps) {
  return (
    <RadioGroup value={value || undefined} onValueChange={(v) => onChange(v as 'pickup' | 'delivery')}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className={`flex items-center space-x-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            value === 'pickup' 
              ? 'border-[var(--button-primary)] bg-[var(--bg-card)]' 
              : 'border-[var(--input-border)] bg-white'
          }`}>
            <RadioGroupItem value="pickup" id="pickup" className="h-5 w-5" />
            <Label htmlFor="pickup" className="flex-1 cursor-pointer font-medium text-[var(--text-primary)]">
              📦 Pickup
            </Label>
          </div>
        </div>
        
        <div>
          <div className={`flex items-center space-x-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            value === 'delivery' 
              ? 'border-[var(--button-primary)] bg-[var(--bg-card)]' 
              : 'border-[var(--input-border)] bg-white'
          }`}>
            <RadioGroupItem value="delivery" id="delivery" className="h-5 w-5" />
            <Label htmlFor="delivery" className="flex-1 cursor-pointer font-medium text-[var(--text-primary)]">
              🚚 Delivery
            </Label>
          </div>
        </div>
      </div>
    </RadioGroup>
  )
}
