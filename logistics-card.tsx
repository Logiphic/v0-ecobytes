'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Location {
  name: string
  timestamp?: string
  completed?: boolean
}

interface LogisticsCardProps {
  shipmentId: string
  status: 'in-transit' | 'delivered' | 'pending' | 'delayed'
  origin: string
  destination: string
  currentLocation: string
  estimatedDelivery: string
  progressPercentage: number
  locations?: Location[]
  carrier?: string
  weight?: string
  className?: string
}

function getStatusColor(status: LogisticsCardProps['status']) {
  const statusColors = {
    'in-transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'delivered': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'delayed': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }
  return statusColors[status]
}

function getStatusLabel(status: LogisticsCardProps['status']) {
  const labels = {
    'in-transit': 'In Transit',
    'delivered': 'Delivered',
    'pending': 'Pending',
    'delayed': 'Delayed',
  }
  return labels[status]
}

export function LogisticsCard({
  shipmentId,
  status,
  origin,
  destination,
  currentLocation,
  estimatedDelivery,
  progressPercentage,
  locations = [],
  carrier,
  weight,
  className,
}: LogisticsCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-text-balance">Shipment {shipmentId}</CardTitle>
            <CardDescription>Tracking logistics and delivery status</CardDescription>
          </div>
          <Badge className={getStatusColor(status)}>
            {getStatusLabel(status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Route Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">From:</span>
            <span className="font-medium">{origin}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">To:</span>
            <span className="font-medium">{destination}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Location:</span>
            <span className="font-medium">{currentLocation}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-sm text-muted-foreground">Estimated Delivery</p>
          <p className="text-lg font-semibold">{estimatedDelivery}</p>
        </div>

        {/* Additional Details */}
        {(carrier || weight) && (
          <div className="grid grid-cols-2 gap-3 border-t pt-4">
            {carrier && (
              <div>
                <p className="text-xs text-muted-foreground">Carrier</p>
                <p className="text-sm font-medium">{carrier}</p>
              </div>
            )}
            {weight && (
              <div>
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="text-sm font-medium">{weight}</p>
              </div>
            )}
          </div>
        )}

        {/* Location Timeline */}
        {locations.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <p className="text-sm font-semibold">Tracking Timeline</p>
            <div className="space-y-2">
              {locations.map((location, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'size-2.5 rounded-full border-2',
                        location.completed
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground bg-background',
                      )}
                    />
                    {index < locations.length - 1 && (
                      <div className="h-6 w-0.5 bg-border" />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-medium">{location.name}</p>
                    {location.timestamp && (
                      <p className="text-xs text-muted-foreground">{location.timestamp}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { LogisticsCardProps }
