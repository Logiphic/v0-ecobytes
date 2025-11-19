import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CharityMobileNav } from "@/components/charity/charity-mobile-nav";
import { CharityNotifications } from "@/components/charity/charity-notifications";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

export default async function CharityDashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", data.user.id)
    .single();

  if (profile?.role !== 'charity') {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-main)]">
      <DashboardHeader user={data.user} />
      
      <main className="flex-1 px-4 py-6">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Charity Organization<br />Dashboard
          </h1>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="h-12 rounded-full border-[var(--input-border)] bg-white pl-12 text-base"
            />
          </div>

          <CharityMobileNav />

          <CharityNotifications organizationId={profile?.organization_id} />
        </div>
      </main>
    </div>
  );
}
