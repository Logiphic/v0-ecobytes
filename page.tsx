'use client'

import { useState } from 'react'
import { DonationOptions } from '@/components/donation-options'
import { OrganizationNotification } from '@/components/organization-notification'
import { DonationTracking } from '@/components/donation-tracking'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Home() {
  const [donations, setDonations] = useState([
    {
      donationId: 'DON-001',
      itemName: 'Organic Vegetables',
      quantity: 50,
      weight: '25 kg',
      organizationName: 'Green Valley Farm',
      organizationLocation: 'San Francisco, CA',
      status: 'in-transit' as const,
      deliveryMethod: 'delivery' as const,
      currentLocation: 'En route to SF',
      estimatedDate: 'Nov 19, 2024',
      progressPercentage: 65,
    },
  ])

  const [notifications] = useState([
    {
      notificationId: 'NOTIF-001',
      donorId: 'donor-1',
      itemName: 'Fresh Produce Bundle',
      quantity: 30,
      weight: '15 kg',
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    },
    {
      notificationId: 'NOTIF-002',
      donorId: 'donor-2',
      itemName: 'Canned Goods',
      quantity: 100,
      weight: '50 kg',
      status: 'accepted' as const,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ])

  const handleDonate = (selectedOrg: string) => {
    console.log('[v0] Donation initiated to org:', selectedOrg)
  }

  const handleAccept = (notificationId: string, deliveryMethod: 'delivery' | 'pickup') => {
    console.log('[v0] Donation accepted:', { notificationId, deliveryMethod })
    const newDonation = {
      donationId: `DON-${Date.now()}`,
      itemName: 'Accepted Donation',
      quantity: 25,
      weight: '12 kg',
      organizationName: 'City Food Bank',
      organizationLocation: 'San Francisco, CA',
      status: 'scheduled-delivery' as const,
      deliveryMethod,
      progressPercentage: 0,
    }
    setDonations([...donations, newDonation])
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Eco Donation System</h1>
          <p className="text-lg text-muted-foreground">
            Donate or compost items, get notified organizations to accept
          </p>
        </div>

        <Tabs defaultValue="donate" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="donate">Donate Items</TabsTrigger>
            <TabsTrigger value="organizations">Organization Dashboard</TabsTrigger>
            <TabsTrigger value="tracking">Track Donations</TabsTrigger>
          </TabsList>

          {/* Donor Tab */}
          <TabsContent value="donate" className="space-y-4">
            <DonationOptions
              itemId="item-001"
              itemName="Fresh Organic Produce"
              quantity={45}
              weight="22.5 kg"
              onDonate={handleDonate}
            />
          </TabsContent>

          {/* Organization Tab */}
          <TabsContent value="organizations" className="space-y-4">
            <OrganizationNotification
              organizationId="farm-1"
              organizationName="Green Valley Farm"
              notifications={notifications}
              onAccept={handleAccept}
            />
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4">
            <DonationTracking donations={donations} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
