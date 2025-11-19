"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface Organization {
  id: string
  name: string
  address: string
  description: string
  phone: string
  email: string
  logo_url: string | null
}

interface OrganizationSelectorProps {
  selectedOrganization: string | null
  onSelect: (orgId: string) => void
}

export function OrganizationSelector({ selectedOrganization, onSelect }: OrganizationSelectorProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    setLoading(true)
    const response = await fetch('/api/organizations')
    if (response.ok) {
      const data = await response.json()
      setOrganizations(data)
    }
    setLoading(false)
  }

  const selectedOrg = organizations.find(org => org.id === selectedOrganization)

  if (loading) {
    return <div className="text-center py-4 text-[var(--text-muted)]">Loading organizations...</div>
  }

  return (
    <div className="space-y-4">
      <Select value={selectedOrganization || undefined} onValueChange={onSelect}>
        <SelectTrigger className="h-12 rounded-2xl border-[var(--input-border)] bg-white">
          <SelectValue placeholder="Select charity organization" />
        </SelectTrigger>
        <SelectContent className="bg-white border-[var(--input-border)] shadow-lg">
          {organizations.map((org) => (
            <SelectItem key={org.id} value={org.id} className="py-3">
              {org.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedOrg && (
        <Card className="border-[var(--input-border)]">
          <CardContent className="p-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">{selectedOrg.name}</h3>
            <p className="text-sm text-[var(--text-muted)] mb-3">{selectedOrg.description}</p>
            <div className="space-y-1 text-sm">
              <p className="text-[var(--text-secondary)]">📍 {selectedOrg.address}</p>
              <p className="text-[var(--text-secondary)]">📞 {selectedOrg.phone}</p>
              <p className="text-[var(--text-secondary)]">✉️ {selectedOrg.email}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
