import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DonationForm } from "@/components/forms/donation-form";

export default async function DonatePage({ searchParams }: { searchParams: Promise<{ itemId?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/auth/login");
  }

  let foodItem = null;
  if (params.itemId) {
    const { data } = await supabase
      .from("food_items")
      .select("*")
      .eq("id", params.itemId)
      .eq("user_id", userData.user.id)
      .single();
    
    foodItem = data;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={userData.user} />
      <main className="flex-1 bg-muted/30 p-6">
        <div className="container mx-auto max-w-2xl">
          <DonationForm foodItem={foodItem} />
        </div>
      </main>
    </div>
  );
}
