-- Fix RLS policies for charity_notifications to allow trigger inserts

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "notifications_select_own" ON public.charity_notifications;

-- Allow anyone to select (charities will filter their own)
CREATE POLICY "notifications_select_all"
  ON public.charity_notifications FOR SELECT
  USING (true);

-- Allow system/triggers to insert notifications (critical for donation flow)
CREATE POLICY "notifications_insert_system"
  ON public.charity_notifications FOR INSERT
  WITH CHECK (true);

-- Allow charity organizations to update their own notifications (mark as read)
CREATE POLICY "notifications_update_own"
  ON public.charity_notifications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'charity'
      AND profiles.organization_id = charity_notifications.organization_id
    )
  );
