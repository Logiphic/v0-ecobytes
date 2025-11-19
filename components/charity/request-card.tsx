"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from 'lucide-react';

interface RequestCardProps {
  request: any;
}

export function RequestCard({ request }: RequestCardProps) {
  const items = JSON.parse(request.items || '[]');
  const firstItem = items[0] || {};
  
  // Calculate total quantity
  const totalQuantity = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);

  return (
    <Card className="overflow-hidden border-none bg-[var(--bg-card)] shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                Request ID: #{request.id.slice(0, 8)}
              </span>
              <button className="ml-auto">
                <MoreVertical className="h-4 w-4 text-[var(--text-secondary)]" />
              </button>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              • <span className="font-medium">Food Item:</span> {firstItem.food_name || 'N/A'} 
              {items.length > 1 && ` (+${items.length - 1} more)`}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              • <span className="font-medium">Expiry Date:</span> Varied
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              • <span className="font-medium">Quantity:</span> {totalQuantity} units (Varied)
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Link href={`/charity/requests/${request.id}`} className="flex-1">
            <Button 
              size="sm" 
              className="w-full rounded-full bg-[var(--brand-success)] hover:bg-[var(--brand-primary-dark)] text-white"
            >
              Accept
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="destructive"
            className="flex-1 rounded-full bg-[var(--brand-error)] hover:bg-red-600"
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
