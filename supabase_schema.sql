-- ============================================================================
-- APPSN Kwara State Branch: Database Schema & Security Policies
-- Run this in your Supabase SQL Editor to provision the tables and columns
-- ============================================================================

-- 0. SURVEYORS TABLE: ADD LATITUDE & LONGITUDE COLUMNS (NUMERIC/DECIMAL)
-- Adds persistent columns for high-accuracy OpenStreetMap location coordinates
ALTER TABLE public.surveyors 
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 7);

CREATE INDEX IF NOT EXISTS idx_surveyors_coordinates 
ON public.surveyors (latitude, longitude);

-- 1. EXECUTIVES TABLE
CREATE TABLE IF NOT EXISTS public.executives (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    full_name TEXT NOT NULL,
    position TEXT NOT NULL,
    profile_image TEXT,
    bio TEXT,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.executives ENABLE ROW LEVEL SECURITY;

-- Public can read all executive council profiles
CREATE POLICY "Allow public read access on executives"
    ON public.executives
    FOR SELECT
    USING (true);

-- Authenticated / anon admins can insert, update, or delete executives
CREATE POLICY "Allow write access on executives"
    ON public.executives
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 2. AIMS & OBJECTIVES TABLE
CREATE TABLE IF NOT EXISTS public.aims_objectives (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'ShieldCheck',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.aims_objectives ENABLE ROW LEVEL SECURITY;

-- Public can read all active aims and objectives
CREATE POLICY "Allow public read access on aims_objectives"
    ON public.aims_objectives
    FOR SELECT
    USING (true);

-- Authenticated / anon admins can manage aims and objectives
CREATE POLICY "Allow write access on aims_objectives"
    ON public.aims_objectives
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 3. ENABLE REALTIME ON ALL THREE TABLES
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.surveyors;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.executives;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.aims_objectives;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END $$;

-- 4. INITIAL SEED FOR EXECUTIVES
INSERT INTO public.executives (id, full_name, position, profile_image, bio, display_order)
VALUES 
    ('exec-1', 'Surv. Funsho-Salawu Ayodeji, mnis', 'Branch Chairman', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400', 'Chairman, Association of Private Practicing Surveyors of Nigeria (APPSN), Kwara State Branch. Leading ethical private practice and cadastral integrity across Kwara State.', 1),
    ('exec-2', 'Surv. (Dr.) Abdullahi B. Kayode, mnis', 'Vice Chairman', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400', 'Vice Chairman, APPSN Kwara State Branch. Coordinating capacity building, geodetic precision, and continuous professional development for private practitioners.', 2),
    ('exec-3', 'Surv. Olabisi M. Toyin, mnis', 'Branch Secretary', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400', 'Branch Secretary, APPSN Kwara State Branch. Overseeing branch administrative communications, official records, and member registry verification.', 3)
ON CONFLICT (id) DO NOTHING;

-- 5. INITIAL SEED FOR AIMS & OBJECTIVES
INSERT INTO public.aims_objectives (id, title, description, icon, display_order, is_active)
VALUES 
    ('aim-1', 'Uphold Professional Ethics & SURCON Standards', 'To uphold, foster, and enforce the highest ethical benchmarks, technical competence, and statutory compliance among all private practicing surveyors in Kwara State in accordance with SURCON regulations.', 'ShieldCheck', 1, true),
    ('aim-2', 'Protect Public Land Titles & Invalidate Quackery', 'To safeguard property buyers, investors, and community landholders against fraudulent land transactions, boundary disputes, fake survey beacons, and unauthorized quack practitioners.', 'FileCheck', 2, true),
    ('aim-3', 'Harmonize Boundary Delineation & Cadastral Mapping', 'To promote uniform, high-accuracy cadastral survey practices and ensure seamless lodgement of survey records with the Kwara State Office of the Surveyor-General.', 'Compass', 3, true),
    ('aim-4', 'Foster Peer Collaboration & Practitioner Welfare', 'To build solidarity, fraternal cooperation, and professional support networks among private surveyors across all 16 Local Government Areas of Kwara State.', 'Users', 4, true),
    ('aim-5', 'Continuous Professional Development (CPD)', 'To organize technical workshops, seminars, and hands-on training in GNSS RTK positioning, drone photogrammetry, GIS analytics, and modern geomatics instrumentation.', 'BookOpen', 5, true),
    ('aim-6', 'Statutory Scale of Fees Adherence', 'To advocate for and maintain fair, transparent, and standardized professional remuneration that reflects the technical complexity and legal gravity of surveying work.', 'Scale', 6, true),
    ('aim-7', 'Public Enlightenment & Land Law Awareness', 'To educate the general public, property developers, and traditional authorities on the statutory importance of authentic survey plans, registered beacon coordinates, and title perfection.', 'Eye', 7, true),
    ('aim-8', 'Government & Stakeholder Liaison', 'To serve as an official consultative partner to the Kwara State Government, Ministry of Housing and Urban Development, Bureau of Lands, and judiciary on cadastral matters.', 'Building2', 8, true),
    ('aim-9', 'Dispute Resolution & Boundary Arbitration', 'To offer expert technical arbitration and independent cadastral re-establishment to amicably resolve land and boundary conflicts within Kwara communities.', 'Target', 9, true),
    ('aim-10', 'Modern Geodetic Infrastructure Advocacy', 'To support the continuous densification of Kwara State geodetic control networks, CORS reference stations, and digitized geospatial data repositories.', 'Landmark', 10, true)
ON CONFLICT (id) DO NOTHING;
