'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Leaf, Recycle } from 'lucide-react'

interface DonationOptionsProps {
  itemId: string
  itemName: string
  quantity: number
  weight: string
  onDonate?: (selectedOrg: string) => void
  onCompost?: () => void
  availableOrganizations?: Array<{
    id: string
    name: string
    type: 'farm' | 'charity'
    location: string
  }>
}

export function DonationOptions({
  itemId,
  itemName,
  quantity,
  weight,
  onDonate,
  onCompost,
  availableOrganizations = [
    { id: 'farm-1', name: 'Green Valley Farm', type: 'farm', location: 'San Francisco, CA' },
    { id: 'charity-1', name: 'City Food Bank', type: 'charity', location: 'San Francisco, CA' },
    { id: 'farm-2', name: 'Sunset Organic Farm', type: 'farm', location: 'Oakland, CA' },
  ],
}: DonationOptionsProps) {
  const [selectedOrg, setSelectedOrg] = React.useState<string | null>(null)
  const [notificationSent, setNotificationSent] = React.useState(false)

  const handleDonate = () => {
    if (selectedOrg) {
      setNotificationSent(true)
      onDonate?.(selectedOrg)
      setTimeout(() => setNotificationSent(false), 3000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Choose Donation Option</CardTitle>
        <CardDescription>
          {itemName} - {quantity} items ({weight})
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Donate Option */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Donate to Organization</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Send to a farm or charity that can use these items
          </p>

          <div className="space-y-2">
            {availableOrganizations.map((org) => (
              <button
                key={org.id}
                onClick={() => setSelectedOrg(org.id)}
                className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                  selectedOrg === org.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{org.name}</p>
                    <p className="text-sm text-muted-foreground">{org.location}</p>
                  </div>
                  <Badge variant="outline">
                    {org.type === 'farm' ? '🌾 Farm' : '🤝 Charity'}
                  </Badge>
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={handleDonate}
            disabled={!selectedOrg || notificationSent}
            className="w-full"
          >
            {notificationSent ? '✓ Notification Sent!' : 'Send Donation Notification'}
          </Button>
        </div>

        <div className="border-t" />

        {/* Compost Option */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Recycle className="h-5 w-5 text-accent-foreground" />
            <h3 className="font-semibold">Send to Composting Facility</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Eco-friendly composting for organic waste
          </p>

          <Button
            onClick={onCompost}
            variant="outline"
            className="w-full"
          >
            Schedule Compost Pickup
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
