"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ExpiredItemSelector } from "@/components/forms/expired-item-selector"
import { FarmSelector } from "@/components/forms/farm-selector"
import { PickupDeliverySelector } from "@/components/forms/pickup-delivery-selector"
import { FarmSlotSelector } from "@/components/forms/farm-slot-selector"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

export default function NewCompostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null)
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery' | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedFarm || !deliveryType || !selectedSlot || selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please complete all required fields",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data: itemsData } = await supabase
        .from('food_items')
        .select('*')
        .in('id', selectedItems)

      if (!itemsData) throw new Error('Failed to fetch items')

      const items = itemsData.map(item => ({
        food_item_id: item.id,
        food_name: item.name,
        quantity: item.quantity,
        unit: item.unit
      }))

      const response = await fetch('/api/composting/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farm_id: selectedFarm,
          items,
          type: deliveryType,
          slot_id: selectedSlot,
          notes
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create composting request')
      }

      toast({
        title: "Success!",
        description: "Your composting request has been scheduled successfully",
      })

      router.push('/dashboard/compost')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <div className="bg-white border-b border-[var(--input-border)] p-4 flex items-center gap-3">
        <button onClick={() => router.push('/dashboard/compost')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Add New Compost Request</h1>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-[var(--input-border)] px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= s ? 'bg-[var(--button-primary)] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`w-12 h-1 mx-2 ${step > s ? 'bg-[var(--button-primary)]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6 pb-24 space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Select Expired Items</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">Choose one or more expired items for composting</p>
            </div>
            <ExpiredItemSelector
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Choose Farm</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">Select where you'd like to send for composting</p>
            </div>
            <FarmSelector
              selectedFarm={selectedFarm}
              onSelect={setSelectedFarm}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Schedule Pickup/Delivery</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">Choose how you'd like to send items</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-[var(--text-primary)] mb-3 block">Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className={`flex-1 h-11 rounded-xl text-sm border-[var(--input-border)] ${
                      deliveryType === 'pickup' 
                        ? 'bg-[#7BAE7F] text-white border-[#7BAE7F] hover:bg-[#6a9d6e]' 
                        : 'bg-white text-[var(--text-primary)] hover:bg-gray-50'
                    }`}
                    onClick={() => setDeliveryType('pickup')}
                  >
                    Pickup
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={`flex-1 h-11 rounded-xl text-sm border-[var(--input-border)] ${
                      deliveryType === 'delivery' 
                        ? 'bg-[#7BAE7F] text-white border-[#7BAE7F] hover:bg-[#6a9d6e]' 
                        : 'bg-white text-[var(--text-primary)] hover:bg-gray-50'
                    }`}
                    onClick={() => setDeliveryType('delivery')}
                  >
                    Delivery
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">Select Date and Time</Label>
                <FarmSlotSelector
                  farmId={selectedFarm}
                  type={deliveryType}
                  selectedSlot={selectedSlot}
                  onSelect={setSelectedSlot}
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Review & Confirm</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">Add any additional notes</p>
            </div>
            
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[var(--input-border)]">
              <div>
                <span className="text-sm font-medium text-[var(--text-muted)]">Items:</span>
                <span className="text-sm text-[var(--text-primary)] ml-2">{selectedItems.length} expired items</span>
              </div>
              <div>
                <span className="text-sm font-medium text-[var(--text-muted)]">Type:</span>
                <span className="text-sm text-[var(--text-primary)] ml-2 capitalize">{deliveryType}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions or notes..."
                className="min-h-[100px] rounded-2xl border-[var(--input-border)] bg-white"
              />
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--input-border)] p-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 1 && (
            <Button
              onClick={() => setStep(step - 1)}
              variant="outline"
              className="flex-1 h-12 rounded-2xl border-[var(--input-border)]"
              disabled={submitting}
            >
              Back
            </Button>
          )}
          <Button
            onClick={step === 4 ? handleSubmit : () => setStep(step + 1)}
            disabled={
              (step === 1 && selectedItems.length === 0) ||
              (step === 2 && !selectedFarm) ||
              (step === 3 && (!deliveryType || !selectedSlot)) ||
              submitting
            }
            className="flex-1 h-12 rounded-2xl bg-lime-600 hover:bg-lime-700 text-white font-semibold"
          >
            {submitting ? "Submitting..." : step === 4 ? "Send For Composting" : `Continue${step === 1 ? ` (${selectedItems.length} items)` : ''}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
