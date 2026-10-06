-- ============================================================================
-- Supabase SQL Editor: Add Latitude & Longitude to Surveyors Table
-- Run this in the Supabase Dashboard -> SQL Editor
-- ============================================================================

ALTER TABLE public.surveyors 
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 7);

-- Create index for geospatial coordinate lookups
CREATE INDEX IF NOT EXISTS idx_surveyors_coordinates 
ON public.surveyors (latitude, longitude);
