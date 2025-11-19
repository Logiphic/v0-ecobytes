"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Slot {
  id: string
  date: string
  time: string
  type: string
}

interface SlotSelectorProps {
  organizationId: string | null
  type: 'pickup' | 'delivery' | null
  selectedSlot: string | null
  onSelect: (slotId: string) => void
}

export function SlotSelector({ organizationId, type, selectedSlot, onSelect }: SlotSelectorProps) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (organizationId && type) {
      loadSlots()
    } else {
      setSlots([])
    }
  }, [organizationId, type])

  const loadSlots = async () => {
    if (!organizationId || !type) return
    
    setLoading(true)
    const response = await fetch(`/api/organizations/${organizationId}/slots?type=${type}`)
    if (response.ok) {
      const data = await response.json()
      setSlots(data)
    }
    setLoading(false)
  }

  if (!organizationId || !type) {
    return (
      <div className="text-center py-4 text-[var(--text-muted)]">
        Please select an organization and {type ? 'pickup/delivery' : 'type'} first
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-4 text-[var(--text-muted)]">Loading available slots...</div>
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-4 text-[var(--text-muted)]">
        No available slots for this organization and type
      </div>
    )
  }

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const date = slot.date
    if (!acc[date]) acc[date] = []
    acc[date].push(slot)
    return acc
  }, {} as Record<string, Slot[]>)

  return (
    <Select value={selectedSlot || undefined} onValueChange={onSelect}>
      <SelectTrigger className="h-12 rounded-2xl border-[var(--input-border)] bg-white">
        <SelectValue placeholder="Select date and time" />
      </SelectTrigger>
      <SelectContent className="bg-white border-[var(--input-border)] shadow-lg max-h-[300px]">
        {Object.entries(slotsByDate).map(([date, dateSlots]) => (
          <div key={date}>
            <div className="px-2 py-2 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-light)]">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            {dateSlots.map((slot) => (
              <SelectItem key={slot.id} value={slot.id} className="py-3">
                🕐 {slot.time}
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  )
}
