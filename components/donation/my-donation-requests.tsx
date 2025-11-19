"use client"

import { useEffect, useState } from "react"
import { Search, ArrowLeft, MoreVertical, Phone, Mail, Calendar } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import Link from "next/link"
import Image from "next/image"

interface DonationRequest {
  id: string
  created_at: string
  status: string
  type: string
  items: any[]
  notes: string
  organization: {
    name: string
    phone: string
    email: string
    address: string
  }
  slot: {
    date: string
    time: string
  }
}

export function MyDonationRequests() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<DonationRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<DonationRequest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = requests.filter((req) =>
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.items.some((item: any) => item.food_name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredRequests(filtered)
    } else {
      setFilteredRequests(requests)
    }
  }, [searchQuery, requests])

  const fetchRequests = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          organization:organizations(name, phone, email, address),
          slot:organization_slots(date, time)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRequests(data || [])
      setFilteredRequests(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-500 text-white'
      case 'rejected':
        return 'bg-red-500 text-white'
      case 'pending':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const handleCancel = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('donations')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Request cancelled successfully",
      })
      fetchRequests()
      setDetailsOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cancel request",
        variant: "destructive",
      })
    }
  }

  const handleContact = (request: DonationRequest, method: 'phone' | 'email') => {
    if (method === 'phone') {
      window.open(`tel:${request.organization.phone}`)
    } else {
      window.open(`mailto:${request.organization.email}`)
    }
  }

  const openDetails = (request: DonationRequest) => {
    setSelectedRequest(request)
    setDetailsOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[var(--text-muted)]">Loading requests...</div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-[var(--text-primary)] absolute left-1/2 -translate-x-1/2">Donate</h1>
          <div className="w-10" />
        </div>
      </div>
      {/* </CHANGE> */}

      <div className="bg-[var(--brand-primary)] text-white p-4 flex items-center justify-between rounded-3xl mx-4 mt-4">
        <h2 className="text-lg font-semibold">My Requests</h2>
        <Button variant="ghost" size="icon" className="text-white">
          
        </Button>
      </div>
      {/* </CHANGE> */}

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full border-[var(--input-border)] bg-white h-12"
          />
        </div>
      </div>

      <div className="px-4 pb-24 space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)]">
            No donation requests found
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-2xl p-4 border border-[var(--input-border)] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openDetails(request)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                    Request ID: #{request.id.slice(0, 8)}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] mb-1">
                    <span className="font-medium">Food Item:</span>{' '}
                    {request.items.map((item: any) => item.food_name).join(', ')}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    <span className="font-medium">Date:</span>{' '}
                    {request.slot ? format(new Date(request.slot.date), 'dd/MM/yyyy') : 'N/A'}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openDetails(request); }}>
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge className={getStatusColor(request.status)}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
                {request.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full text-xs h-7 px-3 border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                      onClick={(e) => { e.stopPropagation(); openDetails(request); }}
                    >
                      Reschedule
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full text-xs h-7 px-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={(e) => { e.stopPropagation(); handleCancel(request.id); }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl bg-white">
          <SheetHeader className="border-b border-gray-200 pb-4">
            <SheetTitle className="text-lg font-bold text-[var(--text-primary)]">Request Details</SheetTitle>
          </SheetHeader>
          {selectedRequest && (
            <div className="mt-6 space-y-6 pb-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="space-y-4 bg-white rounded-2xl p-4 border border-gray-200">
                <div>
                  <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Request ID</span>
                  <p className="text-base font-semibold text-[var(--text-primary)] mt-1">#{selectedRequest.id.slice(0, 8)}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Charity</span>
                  <p className="text-base font-semibold text-[var(--text-primary)] mt-1">{selectedRequest.organization.name}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Items</span>
                  <ul className="mt-1 space-y-1">
                    {selectedRequest.items.map((item: any, idx: number) => (
                      <li key={idx} className="text-sm text-[var(--text-primary)]">
                        • {item.food_name} - {item.quantity} {item.unit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Date & Time</span>
                  <p className="text-base font-semibold text-[var(--text-primary)] mt-1">
                    {selectedRequest.slot ? `${format(new Date(selectedRequest.slot.date), 'dd/MM/yyyy')} at ${selectedRequest.slot.time}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Status</span>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedRequest.status)}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                {selectedRequest.notes && (
                  <div>
                    <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Notes</span>
                    <p className="text-sm text-[var(--text-primary)] mt-1">{selectedRequest.notes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 px-2">
                <Button
                  className="w-full h-12 rounded-2xl bg-lime-600 hover:bg-lime-700 text-white font-semibold"
                  onClick={() => handleContact(selectedRequest, 'phone')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Charity
                </Button>
                {selectedRequest.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-2xl border-[var(--input-border)] font-semibold"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Change Date & Time
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-2xl border-red-300 text-red-600 hover:bg-red-50 font-semibold"
                      onClick={() => handleCancel(selectedRequest.id)}
                    >
                      Cancel Request
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
