import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { QualityCheckView } from "@/components/charity/quality-check-view";

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", data.user.id)
    .single();

  if (profile?.role !== 'charity') {
    redirect("/dashboard");
  }

  // Get donation request details
  const { data: donation } = await supabase
    .from("donations")
    .select(`
      *,
      profiles:user_id (full_name),
      organization_slots (date, time, type)
    `)
    .eq("id", params.id)
    .single();

  if (!donation) {
    redirect("/charity/requests");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-main)]">
      <header className="flex items-center justify-between border-b bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/charity/requests" className="rounded-full p-2 hover:bg-gray-100 active:scale-95">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <img src="/logo.png" alt="EcoBytes" className="h-8" />
        </div>
        <button className="rounded-lg p-2 hover:bg-gray-100">
          <div className="flex flex-col gap-1">
            <div className="h-0.5 w-5 bg-gray-600"></div>
            <div className="h-0.5 w-5 bg-gray-600"></div>
            <div className="h-0.5 w-5 bg-gray-600"></div>
          </div>
        </button>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="mx-auto w-full max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold text-[var(--text-primary)]">
            View Requests
          </h1>

          <QualityCheckView donation={donation} />
        </div>
      </main>
    </div>
  );
}
