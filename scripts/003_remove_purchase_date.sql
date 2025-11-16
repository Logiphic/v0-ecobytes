-- Remove purchase_date column from food_items table
ALTER TABLE public.food_items 
DROP COLUMN IF EXISTS purchase_date;
