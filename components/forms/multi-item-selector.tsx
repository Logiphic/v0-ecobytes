"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface FoodItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  expiry_date: string
  status: string
}

interface MultiItemSelectorProps {
  selectedItems: string[]
  onSelectionChange: (items: string[]) => void
}

export function MultiItemSelector({ selectedItems, onSelectionChange }: MultiItemSelectorProps) {
  const [items, setItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("food_items")
      .select("*")
      .eq("status", "near-expiry")
      .order("expiry_date", { ascending: true })

    if (!error && data) {
      setItems(data)
      // Initialize quantities
      const initialQuantities: Record<string, number> = {}
      data.forEach(item => {
        initialQuantities[item.id] = item.quantity
      })
      setQuantities(initialQuantities)
    }
    setLoading(false)
  }

  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter(id => id !== itemId))
    } else {
      onSelectionChange([...selectedItems, itemId])
    }
  }

  const updateQuantity = (itemId: string, value: number) => {
    const item = items.find(i => i.id === itemId)
    if (item && value > 0 && value <= item.quantity) {
      setQuantities(prev => ({ ...prev, [itemId]: value }))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fresh': return 'bg-green-500'
      case 'near-expiry': return 'bg-yellow-500'
      case 'expired': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getItemEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'Vegetables': '🥬',
      'Fruits': '🍎',
      'Dairy': '🥛',
      'Meat': '🥩',
      'Grains': '🌾',
      'Bread': '🍞',
      'Other': '📦'
    }
    return emojiMap[category] || '📦'
  }

  if (loading) {
    return <div className="text-center py-8 text-[var(--text-muted)]">Loading items...</div>
  }

  if (items.length === 0) {
    return <div className="text-center py-8 text-[var(--text-muted)]">No near-expiry items available for donation</div>
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[var(--input-border)]"
        >
          <Checkbox
            checked={selectedItems.includes(item.id)}
            onCheckedChange={() => toggleItem(item.id)}
            className="h-5 w-5 flex-shrink-0"
          />
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="text-2xl flex-shrink-0">{getItemEmoji(item.category)}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] truncate">{item.name}</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Expires: {new Date(item.expiry_date).toLocaleDateString()}
              </p>
            </div>
            
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusColor(item.status)}`} />
          </div>

          {selectedItems.includes(item.id) && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Input
                type="number"
                min="1"
                max={item.quantity}
                value={quantities[item.id] || item.quantity}
                onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
                className="w-16 h-9 text-sm"
              />
              <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{item.unit}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function getSelectedItemsData(selectedIds: string[], items: FoodItem[], quantities: Record<string, number>) {
  return selectedIds.map(id => {
    const item = items.find(i => i.id === id)
    if (!item) return null
    return {
      food_item_id: item.id,
      food_name: item.name,
      quantity: quantities[id] || item.quantity,
      unit: item.unit
    }
  }).filter(Boolean)
}
