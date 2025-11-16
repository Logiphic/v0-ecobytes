import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EditFoodForm } from "@/components/forms/edit-food-form";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/auth/login");
  }

  const { data: foodItem, error: itemError } = await supabase
    .from("food_items")
    .select("*")
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .single();

  if (itemError || !foodItem) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={userData.user} />
      <main className="flex-1 bg-muted/30 p-6">
        <div className="container mx-auto max-w-2xl">
          <EditFoodForm foodItem={foodItem} />
        </div>
      </main>
    </div>
  );
}
