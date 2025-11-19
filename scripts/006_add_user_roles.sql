-- Add role field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'consumer' CHECK (role IN ('consumer', 'charity', 'retailer', 'farm'));

-- Add organization_id for charity users
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

-- Update RLS policies to allow charities to view their organization's donations
CREATE POLICY "donations_charity_view"
  ON public.donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'charity'
      AND profiles.organization_id = donations.organization_id
    )
  );

-- Allow charities to update donation status
CREATE POLICY "donations_charity_update"
  ON public.donations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'charity'
      AND profiles.organization_id = donations.organization_id
    )
  );
