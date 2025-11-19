"use client"

import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { MyCompostRequests } from "@/components/compost/my-compost-requests"
import Link from "next/link"

export default function CompostPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Main Content - Requests List */}
      <MyCompostRequests />

      {/* Floating Add Button */}
      <div className="fixed bottom-6 left-0 right-0 px-4">
        <Button
          asChild
          className="w-full h-14 rounded-2xl bg-white hover:bg-gray-50 text-lime-600 border-2 border-lime-600 shadow-lg font-semibold text-base"
        >
          <Link href="/dashboard/compost/new">
            <Plus className="h-5 w-5 mr-2" />
            Add New Compost Request
          </Link>
        </Button>
      </div>
    </div>
  )
}
