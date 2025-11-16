"use client";

import { QrCode, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface AddFoodModalProps {
  onClose: () => void;
  onScanQR: () => void;
}

export function AddFoodModal({ onClose, onScanQR }: AddFoodModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-overlay)] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] text-center mb-4">Add Food Item</h2>
        
        <Button
          onClick={onScanQR}
          className="w-full h-14 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-base"
        >
          <QrCode className="mr-3 h-5 w-5" />
          Scan QR Code
        </Button>

        <Button
          onClick={() => {
            onClose();
            router.push("/dashboard/add-item");
          }}
          variant="outline"
          className="w-full h-14 border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--bg-card)] text-base"
        >
          <PlusCircle className="mr-3 h-5 w-5" />
          Add Manually
        </Button>

        <Button
          onClick={onClose}
          variant="ghost"
          className="w-full h-12 text-[var(--text-secondary)]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
