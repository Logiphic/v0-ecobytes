-- Create organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create organization_slots table
CREATE TABLE IF NOT EXISTS public.organization_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pickup', 'delivery')),
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create charity_notifications table
CREATE TABLE IF NOT EXISTS public.charity_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  donation_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for organizations (public read access)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "organizations_select_all"
  ON public.organizations FOR SELECT
  USING (true);

-- Enable RLS for organization_slots (public read access)
ALTER TABLE public.organization_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "slots_select_all"
  ON public.organization_slots FOR SELECT
  USING (true);

-- Enable RLS for charity_notifications (organization access only)
ALTER TABLE public.charity_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own"
  ON public.charity_notifications FOR SELECT
  USING (true);

-- Insert some sample organizations
INSERT INTO public.organizations (name, address, description, phone, email, logo_url) VALUES
  ('Emirates Red Crescent', 'Dubai, UAE', 'Humanitarian organization helping those in need', '+971-4-234-5678', 'contact@redcrescent.ae', null),
  ('Dubai Cares', 'Dubai, UAE', 'Providing nutritious meals to underprivileged communities', '+971-4-567-8901', 'info@dubaicares.ae', null),
  ('Bell Al Khair Society', 'Dubai, UAE', 'Supporting families and individuals in need', '+971-4-890-1234', 'hello@bellalkhair.ae', null),
  ('Emirates Foundation', 'Abu Dhabi, UAE', 'Empowering youth and communities', '+971-2-345-6789', 'contact@emiratesfoundation.ae', null);

-- Insert sample slots for each organization
INSERT INTO public.organization_slots (organization_id, date, time, type, is_available)
SELECT 
  o.id,
  CURRENT_DATE + (d || ' days')::interval,
  t.time,
  t.type,
  true
FROM public.organizations o
CROSS JOIN (VALUES (1), (2), (3), (4), (5), (6), (7)) AS days(d)
CROSS JOIN (
  VALUES 
    ('09:00 AM', 'pickup'),
    ('11:00 AM', 'pickup'),
    ('02:00 PM', 'pickup'),
    ('04:00 PM', 'pickup'),
    ('10:00 AM', 'delivery'),
    ('03:00 PM', 'delivery')
) AS t(time, type);
