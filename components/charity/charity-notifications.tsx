import { createClient } from "@/lib/supabase/server";
import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CharityNotificationsProps {
  organizationId?: string;
}

export async function CharityNotifications({ organizationId }: CharityNotificationsProps) {
  if (!organizationId) return null;

  const supabase = await createClient();

  const { data: notifications } = await supabase
    .from("charity_notifications")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(10);

  const notificationTypes = [
    { type: "new", color: "border-l-[var(--brand-accent-orange)]", title: "New Donation Alert!", message: "New donation request." },
    { type: "completed", color: "border-l-[var(--brand-success)]", title: "Need Completed!", message: "Need requested item has been received." },
    { type: "rescheduled", color: "border-l-blue-500", title: "Rescheduled Pickup Alert!", message: "New date/time for pickup." },
    { type: "closed", color: "border-l-[var(--brand-error)]", title: "Need Request Closed!", message: "Past deadline for this requested item." },
  ];

  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardHeader className="bg-[var(--brand-primary)] pb-4 pt-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
          Notifications
          <Bell className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 bg-white p-4">
        {notificationTypes.map((notif, index) => (
          <div
            key={index}
            className={`border-l-4 ${notif.color} rounded-r-lg bg-gray-50 p-3`}
          >
            <p className="text-sm font-semibold" style={{ color: notif.color.includes('orange') ? 'var(--brand-accent-orange)' : notif.color.includes('success') ? 'var(--brand-success)' : notif.color.includes('blue') ? '#3b82f6' : 'var(--brand-error)' }}>
              {notif.title}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">{notif.message}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
