"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";

interface QualityCheckViewProps {
  donation: any;
}

export function QualityCheckView({ donation }: QualityCheckViewProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const items = JSON.parse(donation.items || '[]');
  const firstItem = items[0] || {};

  const handleAccept = async () => {
    setIsSubmitting(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from("donations")
      .update({ status: "accepted" })
      .eq("id", donation.id);

    if (!error) {
      router.push("/charity/requests");
    }
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from("donations")
      .update({ status: "rejected" })
      .eq("id", donation.id);

    if (!error) {
      router.push("/charity/requests");
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="overflow-hidden border-none bg-white shadow-md">
      <CardHeader className="bg-[var(--bg-card)] py-4">
        <CardTitle className="text-center text-lg font-bold text-[var(--text-primary)]">
          Quality Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-semibold">Request ID:</span> #{donation.id.slice(0, 8)}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-semibold">Food Item:</span> {firstItem.food_name || 'Carrots'}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-semibold">Quantity:</span> {firstItem.quantity || 1} {firstItem.unit || 'kg'}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-semibold">Expiry Date:</span> {donation.organization_slots?.date || '3/11/2025'} - 3 hours remaining
          </p>
        </div>

        <div className="space-y-2 rounded-lg bg-[var(--bg-card)] p-4">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Quality Status:</p>
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-medium">- Temperature:</span> 5°C (Safe Range: 0°C - 7°C)
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-medium">- pH Level:</span> 6.0 (Safe Range: 6.0 - 7.0)
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-medium">- Humidity:</span> 80% (Safe Range: 70% - 85%)
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleAccept}
            disabled={isSubmitting}
            className="flex-1 rounded-full bg-[var(--brand-success)] hover:bg-[var(--brand-primary-dark)] text-white font-semibold"
          >
            Accept
          </Button>
          <Button 
            onClick={handleReject}
            disabled={isSubmitting}
            variant="destructive"
            className="flex-1 rounded-full bg-[var(--brand-error)] hover:bg-red-600 font-semibold"
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
