"use client"

import { useState } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { MyDonationRequests } from "@/components/donation/my-donation-requests"
import { DonateForm } from "@/components/forms/donate-form"
import Link from "next/link"

export default function DonatePage() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    // Trigger refresh of requests list
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Main Content - Requests List */}
      <MyDonationRequests />

      {/* Floating Add Button */}
      <div className="fixed bottom-6 left-0 right-0 px-4">
        <Button
          asChild
          className="w-full h-14 rounded-2xl bg-white hover:bg-gray-50 text-lime-600 border-2 border-lime-600 shadow-lg font-semibold text-base"
        >
          <Link href="/dashboard/donate/new">
            <Plus className="h-5 w-5 mr-2" />
            Add New Donation Request
          </Link>
        </Button>
      </div>

      {/* Donation Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-xl font-bold text-[var(--text-primary)]">
              Add New Donation Request
            </SheetTitle>
          </SheetHeader>
          <DonateForm onSuccess={handleFormSuccess} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
