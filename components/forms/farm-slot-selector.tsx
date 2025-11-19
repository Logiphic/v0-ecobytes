"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, Calendar } from 'lucide-react'

interface FarmSlotSelectorProps {
  farmId: string | null
  type: 'pickup' | 'delivery' | null
  selectedSlot: string | null
  onSelect: (slotId: string) => void
}

export function FarmSlotSelector({ farmId, type, selectedSlot, onSelect }: FarmSlotSelectorProps) {
  const [slots, setSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (farmId && type) {
      loadSlots()
    }
  }, [farmId, type])

  const loadSlots = async () => {
    if (!farmId || !type) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/farms/${farmId}/slots?type=${type}`)
      const data = await response.json()
      setSlots(data)
    } catch (error) {
      console.error('Error loading slots:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!farmId || !type) {
    return (
      <div className="text-center py-8 bg-white rounded-2xl border border-[var(--input-border)]">
        <p className="text-[var(--text-muted)] text-sm">Please select a type first</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-2xl border border-[var(--input-border)]">
        <p className="text-[var(--text-muted)] text-sm">No available slots</p>
      </div>
    )
  }

  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = []
    acc[slot.date].push(slot)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {Object.entries(groupedSlots).map(([date, dateSlots]) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-[var(--brand-primary)]" />
            <h4 className="font-semibold text-[var(--text-primary)]">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {dateSlots.map((slot) => (
              <Card
                key={slot.id}
                onClick={() => onSelect(slot.id)}
                className={`p-3 cursor-pointer transition-all text-center rounded-xl ${
                  selectedSlot === slot.id
                    ? 'border-2 border-[var(--brand-primary)] bg-[var(--bg-card)]'
                    : 'border border-[var(--input-border)] bg-white hover:border-[var(--brand-primary-light)]'
                }`}
              >
                <p className="text-sm font-medium text-[var(--text-primary)]">{slot.time}</p>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
