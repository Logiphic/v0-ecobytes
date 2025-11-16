-- Add new fields for harvest information and sensor data
ALTER TABLE public.food_items
ADD COLUMN IF NOT EXISTS harvest_info TEXT,
ADD COLUMN IF NOT EXISTS authenticity TEXT,
ADD COLUMN IF NOT EXISTS origin TEXT,
ADD COLUMN IF NOT EXISTS farm TEXT,
ADD COLUMN IF NOT EXISTS harvest_id TEXT,
ADD COLUMN IF NOT EXISTS sensor_data JSONB;

-- Add index for faster harvest_id lookups
CREATE INDEX IF NOT EXISTS idx_food_items_harvest_id ON public.food_items(harvest_id);
