"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import { useEffect, useState } from "react";
import Link from "next/link";
import { FoodItemCard } from "./food-item-card";

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
}

export function FoodInventory() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "fresh" | "expiring" | "expired">("all");

  const fetchFoodItems = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("food_items")
      .select("*")
      .eq("user_id", user.id)
      .order("expiry_date", { ascending: true });

    if (!error && data) {
      setFoodItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const getStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 3) return "expiring";
    return "fresh";
  };

  const filteredItems = foodItems.filter(item => {
    if (filter === "all") return true;
    const status = getStatus(item.expiry_date);
    return status === filter;
  });

  if (loading) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader className="px-4 py-4">
          <CardTitle>Food Inventory</CardTitle>
          <CardDescription>Loading your items...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-4 py-4 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg sm:text-xl">Food Inventory</CardTitle>
            <CardDescription className="text-sm">Manage your household food items</CardDescription>
          </div>
          <Button asChild className="w-full sm:w-auto h-11 text-base font-medium" size="default">
            <Link href="/dashboard/add-item">
              <Plus className="mr-2 h-5 w-5" />
              Add Item
            </Link>
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="default"
            onClick={() => setFilter("all")}
            className="flex-shrink-0 h-10 px-4 text-sm font-medium"
          >
            All ({foodItems.length})
          </Button>
          <Button
            variant={filter === "fresh" ? "default" : "outline"}
            size="default"
            onClick={() => setFilter("fresh")}
            className="flex-shrink-0 h-10 px-4 text-sm font-medium"
          >
            Fresh ({foodItems.filter(i => getStatus(i.expiry_date) === "fresh").length})
          </Button>
          <Button
            variant={filter === "expiring" ? "default" : "outline"}
            size="default"
            onClick={() => setFilter("expiring")}
            className="flex-shrink-0 h-10 px-4 text-sm font-medium"
          >
            Expiring ({foodItems.filter(i => getStatus(i.expiry_date) === "expiring").length})
          </Button>
          <Button
            variant={filter === "expired" ? "default" : "outline"}
            size="default"
            onClick={() => setFilter("expired")}
            className="flex-shrink-0 h-10 px-4 text-sm font-medium"
          >
            Expired ({foodItems.filter(i => getStatus(i.expiry_date) === "expired").length})
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <h3 className="mb-2 text-base sm:text-lg font-semibold">No items found</h3>
            <p className="mb-6 text-sm text-muted-foreground max-w-sm">
              {filter === "all" 
                ? "Start tracking your food by adding your first item"
                : `No ${filter} items in your inventory`}
            </p>
            <Button asChild className="w-full sm:w-auto h-11 text-base">
              <Link href="/dashboard/add-item">Add Your First Item</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <FoodItemCard 
                key={item.id} 
                item={item} 
                status={getStatus(item.expiry_date)}
                onUpdate={fetchFoodItems}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
