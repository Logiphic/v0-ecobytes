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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profile?.role === 'charity') {
    redirect("/charity");
  }

  const displayName = data.user.user_metadata?.full_name?.split(' ')[0] || data.user.email?.split('@')[0] || 'User';

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
    <div className="flex min-h-screen flex-col bg-[#EEF5E9]">
      <DashboardHeader user={data.user} />
      
      <main className="flex-1 px-4 py-4">
        <div className="mx-auto w-full max-w-lg space-y-4">
          <div className="space-y-0">
            <h1 className="text-2xl font-bold leading-tight text-[#2F3A2F]">Hello,</h1>
            <h1 className="text-2xl font-bold leading-tight text-[#2F3A2F]">{displayName}</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search"
              className="h-12 rounded-full border-[#C8D8C3] bg-white pl-12 text-base shadow-sm focus:border-[#7BAE7F] focus:ring-[#7BAE7F]"
            />
          </div>

          <MobileNav />

          <NotificationCard notifications={notifications} />
        </div>
      </main>
    </div>
  );
}
