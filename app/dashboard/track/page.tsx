import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { TrackFoodScreen } from "@/components/dashboard/track-food-screen";

export default async function TrackPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return <TrackFoodScreen />;
}
