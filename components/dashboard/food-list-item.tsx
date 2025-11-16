"use client";

import { MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  expiry_date: string;
  status: string;
}

interface FoodListItemProps {
  item: FoodItem;
  status: "fresh" | "near-expiry" | "expired";
  onClick: () => void;
  onUpdate: () => void;
}

const foodEmojis: Record<string, string> = {
  "Fruit": "🍎",
  "Vegetable": "🥕",
  "Dairy": "🥛",
  "Meat": "🍖",
  "Poultry": "🍗",
  "Bread": "🍞",
  "Other": "🍱",
};

export function FoodListItem({ item, status, onClick, onUpdate }: FoodListItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  };

  const statusColors = {
    "fresh": "bg-[var(--status-fresh)]",
    "near-expiry": "bg-[var(--status-near-expiry)]",
    "expired": "bg-[var(--status-expired)]",
  };

  const statusLabels = {
    "fresh": "Fresh",
    "near-expiry": "Near Expiry",
    "expired": "Expired",
  };

  const emoji = foodEmojis[item.category] || foodEmojis["Other"];

  return (
    <div className="flex items-center gap-3 p-4 hover:bg-[var(--bg-light)] transition-colors touch-manipulation">
      <button
        onClick={onClick}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-2xl shrink-0">
          {emoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">
              {item.name}
            </h3>
            <div className={`w-2 h-2 rounded-full ${statusColors[status]} shrink-0`} />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Expiry Date: {formatDate(item.expiry_date)}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Status: {statusLabels[status]}
          </p>
        </div>
      </button>

      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          // Could open menu here
        }}
      >
        <MoreVertical className="h-5 w-5 text-[var(--icon-muted)]" />
      </Button>
    </div>
  );
}
