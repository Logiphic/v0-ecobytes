"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MultiItemSelector } from "@/components/forms/multi-item-selector"
import { OrganizationSelector } from "@/components/forms/organization-selector"
import { PickupDeliverySelector } from "@/components/forms/pickup-delivery-selector"
import { SlotSelector } from "@/components/forms/slot-selector"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

interface DonateFormProps {
  onSuccess?: () => void
}

export function DonateForm({ onSuccess }: DonateFormProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null)
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery' | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
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

      const response = await fetch('/api/donations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: selectedOrganization,
          items,
          type: deliveryType,
          slot_id: selectedSlot,
          notes
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create donation')
      }

      toast({
        title: "Success!",
        description: "Your donation has been scheduled successfully",
      })

      setStep(1)
      setSelectedItems([])
      setSelectedOrganization(null)
      setDeliveryType(null)
      setSelectedSlot(null)
      setNotes("")
      
      if (onSuccess) {
        onSuccess()
      }
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
    <div className="pb-6">
      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step >= s ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-lime-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Select Near-Expiry Items</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">Choose one or more items to donate</p>
            </div>
            <MultiItemSelector
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
            />
            <Button
              onClick={() => setStep(2)}
              disabled={selectedItems.length === 0}
              className="w-full h-12 rounded-2xl bg-lime-600 hover:bg-lime-700 text-white font-semibold"
            >
              Continue ({selectedItems.length} items selected)
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Choose Charity Organization</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">Select where you'd like to donate</p>
            </div>
            <OrganizationSelector
              selectedOrganization={selectedOrganization}
              onSelect={setSelectedOrganization}
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 h-12 rounded-2xl border-[var(--input-border)]"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedOrganization}
                className="flex-1 h-12 rounded-2xl bg-lime-600 hover:bg-lime-700 text-white font-semibold"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Schedule Pickup/Delivery</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">Choose how you'd like to donate</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">Type</Label>
                <PickupDeliverySelector value={deliveryType} onChange={setDeliveryType} />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">Select Date and Time</Label>
                <SlotSelector
                  organizationId={selectedOrganization}
                  type={deliveryType}
                  selectedSlot={selectedSlot}
                  onSelect={setSelectedSlot}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 h-12 rounded-2xl border-[var(--input-border)]"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!deliveryType || !selectedSlot}
                className="flex-1 h-12 rounded-2xl bg-lime-600 hover:bg-lime-700 text-white font-semibold"
              >
                Continue
              </Button>
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
                <span className="text-sm text-[var(--text-primary)] ml-2">{selectedItems.length} items</span>
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

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="flex-1 h-12 rounded-2xl border-[var(--input-border)]"
                disabled={submitting}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 h-12 rounded-2xl bg-lime-600 hover:bg-lime-700 text-white font-semibold"
              >
                {submitting ? "Submitting..." : "Send For Donation"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
