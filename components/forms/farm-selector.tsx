"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, MapPin, Phone, Mail } from 'lucide-react'

interface FarmSelectorProps {
  selectedFarm: string | null
  onSelect: (farmId: string) => void
}

export function FarmSelector({ selectedFarm, onSelect }: FarmSelectorProps) {
  const [farms, setFarms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFarms()
  }, [])

  const loadFarms = async () => {
    try {
      const response = await fetch('/api/farms')
      const data = await response.json()
      setFarms(data)
    } catch (error) {
      console.error('Error loading farms:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {farms.map((farm) => (
        <Card
          key={farm.id}
          onClick={() => onSelect(farm.id)}
          className={`p-4 cursor-pointer transition-all rounded-2xl ${
            selectedFarm === farm.id
              ? 'border-2 border-[var(--brand-primary)] bg-[var(--bg-card)]'
              : 'border-2 border-[var(--input-border)] bg-white hover:border-[var(--brand-primary-light)]'
          }`}
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">{farm.name}</h3>
          {farm.description && (
            <p className="text-sm text-[var(--text-muted)] mb-3">{farm.description}</p>
          )}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <MapPin className="h-4 w-4" />
              <span>{farm.address}</span>
            </div>
            {farm.phone && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Phone className="h-4 w-4" />
                <span>{farm.phone}</span>
              </div>
            )}
            {farm.email && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Mail className="h-4 w-4" />
                <span>{farm.email}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
