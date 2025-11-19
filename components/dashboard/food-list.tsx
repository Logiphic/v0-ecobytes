"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FoodListItem } from "./food-list-item";
import { FoodDetailCard } from "./food-detail-card";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  storage_location: string | null;
  notes: string | null;
  status: string;
  harvest_id: string | null;
  harvest_info: string | null;
  authenticity: string | null;
  origin: string | null;
  farm: string | null;
  sensor_data: any;
}

interface FoodListProps {
  searchQuery: string;
  statusFilter: 'all' | 'expired' | 'near-expiry' | 'fresh';
  viewMode: 'all' | 'pending' | 'accepted';
}

export function FoodList({ searchQuery, statusFilter, viewMode }: FoodListProps) {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [itemsInRequests, setItemsInRequests] = useState<{[key: string]: {status: string, type: string}}>({});
  const [selectedForRemoval, setSelectedForRemoval] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
    loadRequestStatus();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("food_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const loadRequestStatus = async () => {
    const supabase = createClient();
    
    console.log("[v0] Loading request status for all items");
    
    const { data: donations, error: donationsError } = await supabase
      .from("donations")
      .select("items, status");
    
    console.log("[v0] Donations data:", donations);
    if (donationsError) console.log("[v0] Donations error:", donationsError);
    
    const { data: compostLogs, error: compostError } = await supabase
      .from("composting_logs")
      .select("items, status");
    
    console.log("[v0] Compost logs data:", compostLogs);
    if (compostError) console.log("[v0] Compost error:", compostError);
    
    const statusMap: {[key: string]: {status: string, type: string}} = {};
    
    if (donations) {
      donations.forEach(donation => {
        if (donation.items && Array.isArray(donation.items)) {
          donation.items.forEach((item: any) => {
            if (item.food_item_id) {
              // If item already has a status, only override if current is more important
              // Priority: accepted > pending > rejected
              const currentStatus = statusMap[item.food_item_id]?.status;
              const newStatus = donation.status || 'pending';
              
              if (!currentStatus || 
                  (newStatus === 'accepted') ||
                  (newStatus === 'pending' && currentStatus === 'rejected')) {
                statusMap[item.food_item_id] = {
                  status: newStatus,
                  type: 'donation'
                };
              }
            }
          });
        }
      });
    }
    
    if (compostLogs) {
      compostLogs.forEach(log => {
        if (log.items && Array.isArray(log.items)) {
          log.items.forEach((item: any) => {
            if (item.food_item_id) {
              const currentStatus = statusMap[item.food_item_id]?.status;
              const newStatus = log.status || 'pending';
              
              if (!currentStatus || 
                  (newStatus === 'accepted') ||
                  (newStatus === 'pending' && currentStatus === 'rejected')) {
                statusMap[item.food_item_id] = {
                  status: newStatus,
                  type: 'composting'
                };
              }
            }
          });
        }
      });
    }
    
    console.log("[v0] Final status map:", statusMap);
    setItemsInRequests(statusMap);
  };

  const getStatus = (expiryDate: string): "fresh" | "near-expiry" | "expired" => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 3) return "near-expiry";
    return "fresh";
  };

  const filteredItems = items.filter(item => {
    // Search query filter
    if (!item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status filter (expired/near-expiry/fresh)
    if (statusFilter !== 'all') {
      const itemStatus = getStatus(item.expiry_date);
      if (itemStatus !== statusFilter) {
        return false;
      }
    }
    
    const requestInfo = itemsInRequests[item.id];
    
    // View mode filter
    if (viewMode === 'pending') {
      // Only show items with pending requests
      return requestInfo && requestInfo.status === 'pending';
    } else if (viewMode === 'accepted') {
      // Only show items with accepted requests
      return requestInfo && requestInfo.status === 'accepted';
    } else {
      // Show ALL items regardless of request status
      return true;
    }
  });

  const handleRemoveFromInventory = async () => {
    if (selectedForRemoval.length === 0) return;
    
    const supabase = createClient();
    const { error } = await supabase
      .from("food_items")
      .delete()
      .in('id', selectedForRemoval);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove items from inventory",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Removed ${selectedForRemoval.length} item(s) from inventory`,
      });
      setSelectedForRemoval([]);
      loadItems();
      loadRequestStatus();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--input-border)] p-12 text-center">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    let emptyMessage = "No food items found";
    let emptyHint = "Try changing filters or add new items";
    
    if (viewMode === 'pending') {
      emptyMessage = "No items in pending requests";
      emptyHint = "Items with pending donation or composting requests will appear here";
    } else if (viewMode === 'accepted') {
      emptyMessage = "No donated or composted items";
      emptyHint = "Accepted donations and composting requests will appear here";
    } else if (searchQuery) {
      emptyMessage = "No matching items found";
      emptyHint = "Try a different search term";
    }
    
    return (
      <div className="bg-white rounded-2xl border border-[var(--input-border)] p-12 text-center">
        <p className="text-[var(--text-primary)] font-medium mb-2">{emptyMessage}</p>
        <p className="text-sm text-[var(--text-muted)]">{emptyHint}</p>
      </div>
    );
  }

  return (
    <>
      {viewMode === 'accepted' && selectedForRemoval.length > 0 && (
        <div className="bg-white border-x border-[var(--input-border)] px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">
            {selectedForRemoval.length} item(s) selected
          </span>
          <Button
            onClick={handleRemoveFromInventory}
            variant="destructive"
            size="sm"
            className="h-9"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove From Inventory
          </Button>
        </div>
      )}
      
      <div className="bg-white rounded-2xl border border-[var(--input-border)] divide-y divide-[var(--input-border)]">
        {filteredItems.map((item) => {
          const requestInfo = itemsInRequests[item.id];
          const isSelected = selectedForRemoval.includes(item.id);
          
          return (
            <FoodListItem
              key={item.id}
              item={item}
              status={getStatus(item.expiry_date)}
              onClick={() => {
                if (viewMode === 'accepted') {
                  if (isSelected) {
                    setSelectedForRemoval(prev => prev.filter(id => id !== item.id));
                  } else {
                    setSelectedForRemoval(prev => [...prev, item.id]);
                  }
                } else {
                  setSelectedItem(item);
                }
              }}
              onUpdate={() => {
                loadItems();
                loadRequestStatus();
              }}
              requestInfo={requestInfo}
              isSelected={isSelected}
              showCheckbox={viewMode === 'accepted'}
            />
          );
        })}
      </div>

      {selectedItem && (
        <FoodDetailCard
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
