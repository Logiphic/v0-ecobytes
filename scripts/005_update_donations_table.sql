-- Drop the old donations table and recreate with new structure
DROP TABLE IF EXISTS public.donations CASCADE;

-- Create new donations table with multi-item support
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  items JSONB NOT NULL, -- Array of {food_item_id, food_name, quantity, unit}
  type TEXT NOT NULL CHECK (type IN ('pickup', 'delivery')),
  slot_id UUID NOT NULL REFERENCES public.organization_slots(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "donations_select_own"
  ON public.donations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "donations_insert_own"
  ON public.donations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "donations_update_own"
  ON public.donations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "donations_delete_own"
  ON public.donations FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to mark slot as unavailable after donation
CREATE OR REPLACE FUNCTION mark_slot_unavailable()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.organization_slots
  SET is_available = false
  WHERE id = NEW.slot_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically mark slot as unavailable
DROP TRIGGER IF EXISTS donation_created_trigger ON public.donations;
CREATE TRIGGER donation_created_trigger
  AFTER INSERT ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION mark_slot_unavailable();

-- Create function to send notification to charity
CREATE OR REPLACE FUNCTION notify_charity()
RETURNS TRIGGER AS $$
DECLARE
  org_name TEXT;
  item_count INTEGER;
BEGIN
  SELECT name INTO org_name FROM public.organizations WHERE id = NEW.organization_id;
  SELECT jsonb_array_length(NEW.items) INTO item_count;
  
  -- Use SECURITY DEFINER to bypass RLS for system inserts
  INSERT INTO public.charity_notifications (organization_id, donation_id, message)
  VALUES (
    NEW.organization_id,
    NEW.id,
    format('New donation request: %s items for %s', item_count, NEW.type)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to notify charity on donation
DROP TRIGGER IF EXISTS notify_charity_trigger ON public.donations;
CREATE TRIGGER notify_charity_trigger
  AFTER INSERT ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION notify_charity();
