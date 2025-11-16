import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CompostingHistory } from "@/components/dashboard/composting-history";

export default async function CompostingPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={data.user} />
      <main className="flex-1 bg-muted/30 p-6">
        <div className="container mx-auto max-w-7xl">
          <CompostingHistory />
        </div>
      </main>
    </div>
  );
}
