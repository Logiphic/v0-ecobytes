import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { NotificationCard } from "@/components/dashboard/notification-card";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const notifications = [
    {
      title: "Food Expiry Alert!",
      message: "Two items expired, check food list.",
      type: "alert" as const,
    },
    {
      title: "Compost Pickup Alert!",
      message: "Have your items prepared for pickup.",
      type: "success" as const,
    },
    {
      title: "Donation Availability!",
      message: "Check donation needs list.",
      type: "info" as const,
    },
    {
      title: "Reminder!",
      message: "Near-expiry food found, choose to donate as soon as possible.",
      type: "warning" as const,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={data.user} />
      
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="h-12 rounded-full border-gray-300 bg-white pl-12 text-base"
            />
          </div>

          <MobileNav />

          <NotificationCard notifications={notifications} />
        </div>
      </main>
    </div>
  );
}
