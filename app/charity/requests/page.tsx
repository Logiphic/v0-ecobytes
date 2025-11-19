import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Search } from 'lucide-react';
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { RequestCard } from "@/components/charity/request-card";

export default async function CharityRequestsPage() {
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

  // Get all pending donation requests for this organization
  const { data: requests } = await supabase
    .from("donations")
    .select(`
      *,
      profiles:user_id (full_name)
    `)
    .eq("organization_id", profile.organization_id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-main)]">
      <header className="flex items-center justify-between border-b bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/charity" className="rounded-full p-2 hover:bg-gray-100 active:scale-95">
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
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            View Requests
          </h1>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="h-12 rounded-full border-[var(--input-border)] bg-white pl-12"
            />
          </div>

          <div className="space-y-4">
            {requests?.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
