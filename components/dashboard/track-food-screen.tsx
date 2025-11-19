"use client";

import { useState } from "react";
import { ArrowLeft, Menu, Plus, Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FoodList } from "./food-list";
import { QrScanner } from "./qr-scanner";
import { AddFoodModal } from "./add-food-modal";
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterType = 'all' | 'expired' | 'near-expiry' | 'fresh';
type ViewMode = 'all' | 'pending' | 'accepted';

export function TrackFoodScreen() {
  const [showScanner, setShowScanner] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const router = useRouter();

  const handleAddClick = () => {
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
          
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-[var(--brand-primary)] rounded-t-2xl px-5 py-4 flex items-center justify-between shadow-sm rounded-xl">
          <h2 className="text-xl font-semibold text-white">Food List</h2>
        </div>

        <div className="border-x border-[var(--input-border)] px-4 py-4 flex items-center gap-3 bg-transparent shadow-none border-none">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--icon-muted)]" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-[var(--input-border)] h-11 rounded-xl"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0 border-[var(--input-border)] rounded-xl"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Items
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('fresh')}>
                Fresh
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('near-expiry')}>
                Near Expired
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('expired')}>
                Expired
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={handleAddClick}
            size="icon"
            className="h-11 w-11 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white shrink-0 rounded-xl shadow-sm"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="border-x border-[var(--input-border)] px-2 flex gap-1 py-1 bg-transparent border-none shadow-none">
          <Button
            variant={viewMode === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('all')}
            className={`h-7 flex-1 text-xs px-1.5 rounded-full ${viewMode === 'all' ? 'bg-lime-600 hover:bg-lime-700 shadow-md' : 'border-gray-300'}`}
          >
            All
          </Button>
          <Button
            variant={viewMode === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('pending')}
            className={`h-7 flex-1 text-xs px-1.5 rounded-full ${viewMode === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700 shadow-md' : 'border-gray-300'}`}
          >
            Pending
          </Button>
          <Button
            variant={viewMode === 'accepted' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('accepted')}
            className={`h-7 flex-1 text-xs px-1.5 rounded-full ${viewMode === 'accepted' ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' : 'border-gray-300'}`}
          >
            Removed
          </Button>
        </div>

        <FoodList 
          searchQuery={searchQuery} 
          statusFilter={statusFilter}
          viewMode={viewMode}
        />
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
