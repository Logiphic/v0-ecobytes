import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { AddFoodForm } from "@/components/forms/add-food-form";

export default async function AddItemPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#ECF4E7]">
      <main className="flex-1 p-6">
        <div className="container mx-auto max-w-lg">
          <AddFoodForm />
        </div>
      </main>
    </div>
  );
}
