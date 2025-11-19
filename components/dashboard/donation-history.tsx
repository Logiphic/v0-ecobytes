"use client";

import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, PlusIcon,Gift } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState } from "react";

interface Donation {
  id: string;
  food_name: string;
  quantity: number;
  unit: string;
  organization: string;
  donation_date: string;
  status: string;
  notes: string | null;
}

export function DonationHistory() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("user_id", user.id)
        .order("donation_date", { ascending: false });

      if (!error && data) {
        setDonations(data);
      }
      setLoading(false);
    };

    fetchDonations();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>Loading your donations...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="shrink-0">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <CardTitle className="text-lg sm:text-xl">Donation Requests</CardTitle>
              <CardDescription className="text-sm">Track your contributions to the community</CardDescription>
            </div>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/donate">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Donation
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {donations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Gift className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No donations yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Start making a difference by donating your excess food
            </p>
            <Button asChild>
              <Link href="/dashboard/donate">Record Your First Donation</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-6 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Date</TableHead>
                    <TableHead className="min-w-[120px]">Food Item</TableHead>
                    <TableHead className="min-w-[80px]">Quantity</TableHead>
                    <TableHead className="min-w-[140px]">Organization</TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">
                        {formatDate(donation.donation_date)}
                      </TableCell>
                      <TableCell>{donation.food_name}</TableCell>
                      <TableCell>
                        {donation.quantity} {donation.unit}
                      </TableCell>
                      <TableCell>{donation.organization}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {donation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {donation.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
