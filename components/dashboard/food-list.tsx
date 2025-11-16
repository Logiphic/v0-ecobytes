"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FoodListItem } from "./food-list-item";
import { FoodDetailCard } from "./food-detail-card";

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
}

export function FoodList({ searchQuery }: FoodListProps) {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);

  useEffect(() => {
    loadItems();
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

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatus = (expiryDate: string): "fresh" | "near-expiry" | "expired" => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 3) return "near-expiry";
    return "fresh";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-b-2xl border-x border-b border-[var(--input-border)] p-8 text-center">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="bg-white rounded-b-2xl border-x border-b border-[var(--input-border)] p-8 text-center">
        <p className="text-[var(--text-muted)]">No food items found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-b-2xl border-x border-b border-[var(--input-border)] divide-y divide-[var(--input-border)]">
        {filteredItems.map((item) => (
          <FoodListItem
            key={item.id}
            item={item}
            status={getStatus(item.expiry_date)}
            onClick={() => setSelectedItem(item)}
            onUpdate={loadItems}
          />
        ))}
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
