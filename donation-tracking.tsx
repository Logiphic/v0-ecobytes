'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogisticsCard } from '@/components/logistics-card'

interface DonationTrack {
  donationId: string
  itemName: string
  quantity: number
  weight: string
  organizationName: string
  organizationLocation: string
  status: 'pending-acceptance' | 'scheduled-delivery' | 'in-transit' | 'completed' | 'picked-up'
  deliveryMethod: 'delivery' | 'pickup'
  currentLocation?: string
  estimatedDate?: string
  progressPercentage?: number
}

interface DonationTrackingProps {
  donations: DonationTrack[]
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    'pending-acceptance': 'Awaiting Response',
    'scheduled-delivery': 'Scheduled for Delivery',
    'in-transit': 'In Transit',
    'completed': 'Delivered',
    'picked-up': 'Picked Up',
  }
  return labels[status] || status
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'pending-acceptance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'scheduled-delivery':
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'in-transit':
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'picked-up': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  }
  return colors[status] || ''
}

export function DonationTracking({ donations }: DonationTrackingProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Donation Tracking</h2>
        <p className="text-muted-foreground">Monitor your donations and charitable contributions</p>
      </div>

      {donations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No donations tracked yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <Card key={donation.donationId}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-balance">
                      {donation.itemName} → {donation.organizationName}
                    </CardTitle>
                    <CardDescription>
                      {donation.quantity} items • {donation.weight}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(donation.status)}>
                    {getStatusLabel(donation.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Recipient Location</p>
                    <p className="font-medium">{donation.organizationLocation}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery Method</p>
                    <p className="font-medium capitalize">
                      {donation.deliveryMethod === 'delivery'
                        ? 'We Deliver'
                        : 'They Pick Up'}
                    </p>
                  </div>
                </div>

                {donation.status === 'in-transit' && donation.currentLocation && (
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-sm text-muted-foreground">Current Location</p>
                    <p className="font-semibold">{donation.currentLocation}</p>
                    {donation.estimatedDate && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Est. Delivery: {donation.estimatedDate}
                      </p>
                    )}
                  </div>
                )}

                {donation.progressPercentage !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{donation.progressPercentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-600 transition-all duration-300"
                        style={{ width: `${donation.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
