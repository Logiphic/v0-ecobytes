"use client";

import { useState } from "react";
import { ArrowLeft, Menu, Plus, Search, QrCode } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FoodList } from "./food-list";
import { QrScanner } from "./qr-scanner";
import { AddFoodModal } from "./add-food-modal";
import { useRouter } from 'next/navigation';

export function TrackFoodScreen() {
  const [showScanner, setShowScanner] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleAddClick = () => {
    // Show options: Scan QR or Add Manually
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <header className="sticky top-0 z-10 bg-white border-b border-[var(--input-border)] px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Track Food</h1>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Food List Header */}
        <div className="bg-[var(--brand-primary)] rounded-t-2xl px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Food List</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="bg-white border-x border-[var(--input-border)] px-4 py-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--icon-muted)]" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-[var(--input-border)] h-10"
            />
          </div>
          <Button
            onClick={handleAddClick}
            size="icon"
            className="h-10 w-10 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white shrink-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Food List */}
        <FoodList searchQuery={searchQuery} />
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddFoodModal
          onClose={() => setShowAddModal(false)}
          onScanQR={() => {
            setShowAddModal(false);
            setShowScanner(true);
          }}
        />
      )}

      {showScanner && (
        <QrScanner 
          onClose={() => setShowScanner(false)} 
          onSuccess={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
