"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Leaf, TrendingUp } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState } from "react";

interface CompostLog {
  id: string;
  food_name: string;
  quantity: number;
  unit: string;
  composting_date: string;
  notes: string | null;
}

export function CompostingHistory() {
  const [logs, setLogs] = useState<CompostLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("composting_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("composting_date", { ascending: false });

      if (!error && data) {
        setLogs(data);
      }
      setLoading(false);
    };

    fetchLogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const totalItems = logs.length;
  const totalWeight = logs.reduce((sum, log) => {
    if (log.unit === "kg") return sum + log.quantity;
    if (log.unit === "g") return sum + log.quantity / 1000;
    if (log.unit === "lbs") return sum + log.quantity * 0.453592;
    return sum;
  }, 0);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Composting History</CardTitle>
          <CardDescription>Loading your composting logs...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items Composted</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Keeping waste out of landfills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Environmental Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeight.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">
              Total weight composted
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <CardTitle>Composting History</CardTitle>
                <CardDescription>Track your environmental contributions</CardDescription>
              </div>
            </div>
            <Button asChild>
              <Link href="/dashboard/compost">
                <Leaf className="mr-2 h-4 w-4" />
                Log Composting
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Leaf className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No composting logs yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Start tracking your environmental impact by logging composted items
              </p>
              <Button asChild>
                <Link href="/dashboard/compost">Log Your First Item</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Food Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {formatDate(log.composting_date)}
                    </TableCell>
                    <TableCell>{log.food_name}</TableCell>
                    <TableCell>
                      {log.quantity} {log.unit}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
