"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'

interface ExpiredItemSelectorProps {
  selectedItems: string[]
  onSelectionChange: (items: string[]) => void
}

export function ExpiredItemSelector({ selectedItems, onSelectionChange }: ExpiredItemSelectorProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExpiredItems()
  }, [])

  const loadExpiredItems = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'expired')
        .gt('quantity', 0)
        .order('expiry_date', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error loading expired items:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter(id => id !== itemId))
    } else {
      onSelectionChange([...selectedItems, itemId])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-[var(--input-border)]">
        <p className="text-[var(--text-muted)]">No expired items available for composting</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isSelected = selectedItems.includes(item.id)
        const daysExpired = Math.floor(
          (new Date().getTime() - new Date(item.expiry_date).getTime()) / (1000 * 60 * 60 * 24)
        )

        return (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              isSelected
                ? 'border-[var(--brand-primary)] bg-[var(--bg-card)]'
                : 'border-[var(--input-border)] bg-white hover:border-[var(--brand-primary-light)]'
            }`}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleItem(item.id)}
              className="h-5 w-5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
                <div className="flex-1">
                  <p className="font-semibold text-[var(--text-primary)]">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-[var(--text-muted)]">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="text-xs text-red-600">
                      Expired {daysExpired} {daysExpired === 1 ? 'day' : 'days'} ago
                    </span>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-red-500" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'Fruits': '🍎',
    'Vegetables': '🥕',
    'Dairy': '🥛',
    'Meat': '🍖',
    'Grains': '🌾',
    'Bakery': '🍞',
    'Other': '📦'
  }
  return emojiMap[category] || '📦'
}
