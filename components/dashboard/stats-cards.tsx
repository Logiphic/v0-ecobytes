"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, Archive, Leaf, Package } from 'lucide-react';
import { useEffect, useState } from "react";

interface Stats {
  total: number;
  expiringSoon: number;
  donated: number;
  composted: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    expiringSoon: 0,
    donated: 0,
    composted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [foodItems, donations, composting] = await Promise.all([
        supabase.from("food_items").select("*", { count: "exact" }).eq("user_id", user.id),
        supabase.from("donations").select("*", { count: "exact" }).eq("user_id", user.id),
        supabase.from("composting_logs").select("*", { count: "exact" }).eq("user_id", user.id),
      ]);

      const expiringSoon = foodItems.data?.filter(
        item => item.expiry_date >= today && item.expiry_date <= sevenDaysFromNow
      ).length || 0;

      setStats({
        total: foodItems.count || 0,
        expiringSoon,
        donated: donations.count || 0,
        composted: composting.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            In your inventory
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.expiringSoon}</div>
          <p className="text-xs text-muted-foreground">
            Within 7 days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Items Donated</CardTitle>
          <Archive className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.donated}</div>
          <p className="text-xs text-muted-foreground">
            Total donations
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Composted</CardTitle>
          <Leaf className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.composted}</div>
          <p className="text-xs text-muted-foreground">
            Environmental impact
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
