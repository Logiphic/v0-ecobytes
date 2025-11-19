-- Create farms table (similar to organizations)
CREATE TABLE IF NOT EXISTS public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create farm_slots table (similar to organization_slots)
CREATE TABLE IF NOT EXISTS public.farm_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pickup', 'delivery')),
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create farm_notifications table (similar to charity_notifications)
CREATE TABLE IF NOT EXISTS public.farm_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  composting_log_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update composting_logs table to support multi-item composting with farms
ALTER TABLE public.composting_logs 
  DROP COLUMN IF EXISTS food_item_id,
  DROP COLUMN IF EXISTS food_name,
  DROP COLUMN IF EXISTS unit;

ALTER TABLE public.composting_logs
  ADD COLUMN IF NOT EXISTS farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS slot_id UUID REFERENCES public.farm_slots(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('pickup', 'delivery')),
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Enable RLS for farms (public read access)
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "farms_select_all"
  ON public.farms FOR SELECT
  USING (true);

-- Enable RLS for farm_slots (public read access)
ALTER TABLE public.farm_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "farm_slots_select_all"
  ON public.farm_slots FOR SELECT
  USING (true);

-- Enable RLS for farm_notifications
ALTER TABLE public.farm_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "farm_notifications_select_all"
  ON public.farm_notifications FOR SELECT
  USING (true);

CREATE POLICY "farm_notifications_insert_system"
  ON public.farm_notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "farm_notifications_update_own"
  ON public.farm_notifications FOR UPDATE
  USING (true);

-- Create trigger function to notify farms when composting request is created
CREATE OR REPLACE FUNCTION public.notify_farm()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.farm_notifications (farm_id, composting_log_id, message)
  VALUES (
    NEW.farm_id,
    NEW.id,
    'New composting request received'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_composting_created ON public.composting_logs;

CREATE TRIGGER on_composting_created
  AFTER INSERT ON public.composting_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_farm();

-- Create trigger function to mark farm slots as unavailable
CREATE OR REPLACE FUNCTION public.mark_farm_slot_unavailable()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.slot_id IS NOT NULL THEN
    UPDATE public.farm_slots
    SET is_available = false
    WHERE id = NEW.slot_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_composting_slot_booked ON public.composting_logs;

CREATE TRIGGER on_composting_slot_booked
  AFTER INSERT ON public.composting_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.mark_farm_slot_unavailable();

-- Insert sample farms
INSERT INTO public.farms (name, address, description, phone, email, logo_url) VALUES
  ('Green Valley Farm', 'Al Ain, UAE', 'Sustainable organic farm practicing composting', '+971-3-765-4321', 'contact@greenvalley.ae', null),
  ('Desert Bloom Agriculture', 'Dubai, UAE', 'Converting food waste into nutrient-rich compost', '+971-4-234-5678', 'info@desertbloom.ae', null),
  ('Al Khaleej Organic', 'Sharjah, UAE', 'Community composting and organic farming', '+971-6-567-8901', 'hello@alkhaleejorganic.ae', null),
  ('Emirates EcoFarm', 'Ras Al Khaimah, UAE', 'Leading the way in sustainable agriculture', '+971-7-890-1234', 'contact@emiratesecofarm.ae', null);

-- Insert sample slots for each farm
INSERT INTO public.farm_slots (farm_id, date, time, type, is_available)
SELECT 
  f.id,
  CURRENT_DATE + (d || ' days')::interval,
  t.time,
  t.type,
  true
FROM public.farms f
CROSS JOIN (VALUES (1), (2), (3), (4), (5), (6), (7)) AS days(d)
CROSS JOIN (
  VALUES 
    ('08:00 AM', 'pickup'),
    ('10:00 AM', 'pickup'),
    ('01:00 PM', 'pickup'),
    ('03:00 PM', 'pickup'),
    ('09:00 AM', 'delivery'),
    ('02:00 PM', 'delivery')
) AS t(time, type);
