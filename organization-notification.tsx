'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'

interface DonationNotification {
  notificationId: string
  donorId: string
  itemName: string
  quantity: number
  weight: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

interface OrganizationNotificationProps {
  organizationId: string
  organizationName: string
  notifications: DonationNotification[]
  onAccept?: (notificationId: string, deliveryMethod: 'delivery' | 'pickup') => void
  onReject?: (notificationId: string) => void
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />
    case 'accepted':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case 'rejected':
      return <AlertCircle className="h-4 w-4 text-red-600" />
    default:
      return null
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'accepted':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    default:
      return ''
  }
}

export function OrganizationNotification({
  organizationId,
  organizationName,
  notifications,
  onAccept,
  onReject,
}: OrganizationNotificationProps) {
  const [selectedNotification, setSelectedNotification] = React.useState<string | null>(null)
  const [showDeliveryChoice, setShowDeliveryChoice] = React.useState(false)

  const handleAccept = (notificationId: string, method: 'delivery' | 'pickup') => {
    onAccept?.(notificationId, method)
    setSelectedNotification(null)
    setShowDeliveryChoice(false)
  }

  const pendingNotifications = notifications.filter((n) => n.status === 'pending')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">{organizationName}</CardTitle>
        <CardDescription>Donation Notifications</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {pendingNotifications.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            No pending donation notifications
          </p>
        ) : (
          <div className="space-y-3">
            {pendingNotifications.map((notification) => (
              <div key={notification.notificationId} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold">{notification.itemName}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {notification.quantity} items • Weight: {notification.weight}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(notification.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(notification.status)}
                      {notification.status.charAt(0).toUpperCase() +
                        notification.status.slice(1)}
                    </span>
                  </Badge>
                </div>

                {selectedNotification === notification.notificationId &&
                showDeliveryChoice ? (
                  <div className="mt-4 space-y-2 pt-4 border-t">
                    <p className="text-sm font-medium">How would you like to receive this?</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() =>
                          handleAccept(notification.notificationId, 'delivery')
                        }
                        className="flex-1"
                      >
                        Schedule Delivery
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleAccept(notification.notificationId, 'pickup')
                        }
                        className="flex-1"
                      >
                        We'll Pick It Up
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        setSelectedNotification(notification.notificationId)
                        setShowDeliveryChoice(true)
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReject?.(notification.notificationId)}
                      className="flex-1"
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
