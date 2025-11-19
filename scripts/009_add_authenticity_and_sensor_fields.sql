-- Add new columns for detailed authenticity and expiry prediction
ALTER TABLE public.food_items
ADD COLUMN IF NOT EXISTS authenticity_brand TEXT,
ADD COLUMN IF NOT EXISTS authenticity_manufacturer TEXT,
ADD COLUMN IF NOT EXISTS authenticity_origin TEXT,
ADD COLUMN IF NOT EXISTS authenticity_batch TEXT,
ADD COLUMN IF NOT EXISTS authenticity_certification TEXT,
ADD COLUMN IF NOT EXISTS authenticity_status TEXT,
ADD COLUMN IF NOT EXISTS declared_expiry_date DATE,
ADD COLUMN IF NOT EXISTS predicted_expiry_date DATE;

-- Update existing rows to set declared_expiry_date from expiry_date
UPDATE public.food_items
SET declared_expiry_date = expiry_date
WHERE declared_expiry_date IS NULL;

-- Add index for faster date lookups
CREATE INDEX IF NOT EXISTS idx_food_items_predicted_expiry ON public.food_items(predicted_expiry_date);
CREATE INDEX IF NOT EXISTS idx_food_items_declared_expiry ON public.food_items(declared_expiry_date);

-- Add comment for sensor_data structure
COMMENT ON COLUMN public.food_items.sensor_data IS 'JSONB storing pH, temperature, humidity: {"ph": 6.5, "temperature": 12.3, "humidity": 78}';
