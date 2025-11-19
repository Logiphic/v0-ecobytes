"use client";

import { MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
  requestInfo?: {status: string, type: string};
  isSelected?: boolean;
  showCheckbox?: boolean;
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

export function FoodListItem({ item, status, onClick, onUpdate, requestInfo, isSelected, showCheckbox }: FoodListItemProps) {
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
    <div className={`flex items-center gap-3 p-3 hover:bg-[var(--bg-light)] transition-colors touch-manipulation ${isSelected ? 'bg-blue-50' : ''}`}>
      {showCheckbox && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onClick}
          className="shrink-0 h-5 w-5"
        />
      )}
      
      <button
        onClick={onClick}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-2xl shrink-0 shadow-sm">
          {emoji}
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2.5 mb-1">
            <h3 className="font-semibold text-sm text-[var(--text-primary)] truncate">
              {item.name}
            </h3>
            <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]} shrink-0`} />
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Expiry: {formatDate(item.expiry_date)}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[var(--text-muted)] font-medium">
              {statusLabels[status]}
            </span>
            {requestInfo && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 ${
                requestInfo.status === 'pending' 
                  ? 'bg-yellow-200 text-yellow-900' 
                  : requestInfo.status === 'accepted'
                  ? 'bg-green-200 text-green-900'
                  : 'bg-gray-200 text-gray-900'
              }`}>
                {requestInfo.status === 'pending' ? '🔄' : '✓'} 
                <span className="capitalize">{requestInfo.status}</span> {requestInfo.type === 'donation' ? 'Donation' : 'Composting'}
              </span>
            )}
          </div>
        </div>
      </button>

      {!showCheckbox && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreVertical className="h-5 w-5 text-[var(--icon-muted)]" />
        </Button>
      )}
    </div>
  );
}
