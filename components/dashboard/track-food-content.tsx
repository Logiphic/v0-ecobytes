"use client";

import { useState } from "react";
import { FoodInventory } from "./food-inventory";
import { QrScanner } from "./qr-scanner";
import { Button } from "@/components/ui/button";
import { QrCode, Plus } from 'lucide-react';
import Link from "next/link";

export function TrackFoodContent() {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          onClick={() => setShowScanner(true)}
          className="h-12 w-full bg-[#7BAE7F] hover:bg-[#6AA86E] text-white text-base sm:w-auto"
        >
          <QrCode className="mr-2 h-5 w-5" />
          Scan QR Code
        </Button>
        <Button 
          asChild 
          variant="outline" 
          className="h-12 w-full border-2 border-[#7BAE7F] text-[#7BAE7F] hover:bg-[#7BAE7F] hover:text-white text-base sm:w-auto"
        >
          <Link href="/dashboard/add-item">
            <Plus className="mr-2 h-5 w-5" />
            Add Manually
          </Link>
        </Button>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QrScanner 
          onClose={() => setShowScanner(false)} 
          onSuccess={() => {
            setShowScanner(false);
          }}
        />
      )}

      {/* Food Inventory List */}
      <FoodInventory />
    </div>
  );
}
