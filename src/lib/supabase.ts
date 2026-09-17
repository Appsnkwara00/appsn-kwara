import { createClient } from '@supabase/supabase-js';
import { Surveyor, Executive, AimObjective } from '../types';
import { KWARA_LGAS, INITIAL_EXECUTIVES, INITIAL_AIMS_OBJECTIVES } from '../data';
import { resolveLgaFromLocation } from './lgaResolver';

const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || "https://jldxqbjdsaneejvqtcra.supabase.co";
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  env.VITE_SUPABASE_ANON_KEY || 
  "sb_publishable_RzU4ZZ1mA0fVIioHM1JuoQ_s36icGIg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseSurveyorRow {
  id: string;
  title?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  surcon_registration_number?: string | null;
  surcon_prefix?: string | null;
  date_of_birth?: string | null;
  email?: string | null;
  phone_number?: string | null;
  whatsapp_number?: string | null;
  company_name?: string | null;
  company_address?: string | null;
  residency?: string | null;
  profile_image_url?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

// Derive Specialization from company name or standard survey profile
export function deriveSpecialization(companyName?: string | null): string {
  if (!companyName) return "Cadastral & Boundary Surveying";
  const lower = companyName.toLowerCase();

  if (lower.includes("gis") || lower.includes("geoinformatics") || lower.includes("spatial")) {
    return "GIS, Digital Mapping & Spatial Analysis";
  }
  if (lower.includes("mapping") || lower.includes("geoworld") || lower.includes("cartography")) {
    return "GIS & Mapping";
  }
  if (lower.includes("drone") || lower.includes("aerial") || lower.includes("remote sensing") || lower.includes("uav")) {
    return "Aerial Survey & Drone Mapping";
  }
  if (lower.includes("engineering") || lower.includes("construction") || lower.includes("consultant")) {
    return "Engineering & Construction Surveying";
  }
  if (lower.includes("geodetic") || lower.includes("geomatics") || lower.includes("spot")) {
    return "Topographical Survey";
  }
  if (lower.includes("marine") || lower.includes("hydro") || lower.includes("water")) {
    return "Hydrographic Survey";
  }
  return "Cadastral & Boundary Surveying";
}

// Map raw Supabase record to unified application Surveyor model
export function mapSupabaseRowToSurveyor(row: SupabaseSurveyorRow): Surveyor {
  const titlePart = row.title ? row.title.trim() : 'Surv.';
  const nameParts = [
    row.first_name,
    row.middle_name,
    row.last_name
  ].filter(Boolean).map(s => String(s).trim()).filter(s => s.length > 0);

  const fullName = nameParts.length > 0
    ? `${titlePart} ${nameParts.join(' ')}`
    : row.full_name || 'Registered Surveyor';

  let registrationNumber = '';
  if (row.surcon_registration_number) {
    const prefix = row.surcon_prefix ? `${row.surcon_prefix}/` : '';
    registrationNumber = `SURCON ${prefix}${row.surcon_registration_number}`;
  } else if (row.registrationNumber) {
    registrationNumber = row.registrationNumber;
  } else {
    registrationNumber = 'SURCON CERTIFIED';
  }

  const officeAddress = row.company_address || row.officeAddress || '';
  
  // Automatic LGA assignment derived strictly from office address/location
  let lga = resolveLgaFromLocation(officeAddress);
  if (lga === "LGA not specified" && row.residency) {
    lga = resolveLgaFromLocation(row.residency);
  }
  if (lga === "LGA not specified" && row.lga && KWARA_LGAS.includes(row.lga)) {
    lga = row.lga;
  }

  const specialization = row.specialization || deriveSpecialization(row.company_name);
  const profilePhoto = row.profile_image_url || row.profilePhoto || '';

  let aboutMe = row.aboutMe || (
    `${fullName} is a licensed and certified private practicing surveyor with SURCON registration ${registrationNumber}, practicing with ${row.company_name || 'an approved private surveying practice'} in ${lga !== 'LGA not specified' ? lga + ' LGA' : 'Kwara State'}. Authorized for every type of survey work.`
  );

  if (aboutMe.includes('Authorized for cadastral boundary determination, title charting, and official survey lodgements.')) {
    aboutMe = aboutMe.replace(
      'Authorized for cadastral boundary determination, title charting, and official survey lodgements.',
      'Authorized for every type of survey work.'
    );
  } else if (aboutMe.includes('Authorized for cadastral boundary determination, title charting, and official survey lodgements')) {
    aboutMe = aboutMe.replace(
      'Authorized for cadastral boundary determination, title charting, and official survey lodgements',
      'Authorized for every type of survey work.'
    );
  }

  return {
    id: row.id,
    fullName,
    registrationNumber,
    phoneNumber: row.phone_number || row.phoneNumber || '',
    email: row.email || '',
    officeAddress: officeAddress || 'Kwara State, Nigeria',
    lga,
    specialization,
    profilePhoto,
    isActive: row.is_active ?? true,
    createdAt: row.created_at || new Date().toISOString(),
    aboutMe,

    // Supabase Specific
    title: row.title || undefined,
    first_name: row.first_name || undefined,
    middle_name: row.middle_name || undefined,
    last_name: row.last_name || undefined,
    surcon_registration_number: row.surcon_registration_number || undefined,
    surcon_prefix: row.surcon_prefix || undefined,
    whatsapp_number: row.whatsapp_number || row.phone_number || undefined,
    company_name: row.company_name || undefined,
    company_address: row.company_address || undefined,
    residency: row.residency || undefined,
    profile_image_url: row.profile_image_url || undefined,
    date_of_birth: row.date_of_birth || undefined,
    qualification: row.qualification || 'SURCON Licensed Private Practicing Surveyor',
  };
}

// Fetch all surveyors from Supabase
export async function fetchSurveyors(): Promise<Surveyor[]> {
  const { data, error } = await supabase
    .from('surveyors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching surveyors from Supabase:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map(mapSupabaseRowToSurveyor);
}

// Fetch Executive Council from Supabase
export async function fetchExecutives(): Promise<Executive[]> {
  try {
    const { data, error } = await supabase
      .from('executives')
      .select('*');

    if (error) {
      console.warn('Supabase executives query info:', error.message);
      const cached = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('appsn_executives_cache') : null;
      return cached ? JSON.parse(cached) : INITIAL_EXECUTIVES;
    }

    if (data && data.length > 0) {
      const mapped: Executive[] = data.map((row: any, idx: number) => {
        const position = (row.position || '').trim();
        let display_order = row.display_order;
        if (!display_order) {
          if (/president|chairman/i.test(position) && !/vice/i.test(position)) {
            display_order = 1;
          } else if (/vice/i.test(position)) {
            display_order = 2;
          } else if (/secretary/i.test(position)) {
            display_order = 3;
          } else {
            display_order = idx + 4;
          }
        }

        return {
          id: row.id || `exec-${idx}`,
          full_name: (row.full_name || row.name || 'Executive Officer').trim(),
          position: position || 'Executive Member',
          profile_image: row.profile_image || row.image || '',
          bio: row.bio || row.description || (
            display_order === 1 
              ? "Leading APPSN Kwara State Branch to maintain professional surveying excellence, promote ethical land administration, and eradicate quackery across all 16 Local Government Areas."
              : display_order === 2
              ? "Committed to fostering professional unity, member development, and transparent cadastral quality standards throughout Kwara State."
              : "Coordinating branch secretariat operations, official registry records, and citizen inquiries to ensure verified surveying practice."
          ),
          display_order,
          created_at: row.created_at,
          updated_at: row.updated_at
        };
      });

      // Sort strictly: 1. President/Chairman, 2. Vice President, 3. Secretary
      mapped.sort((a, b) => a.display_order - b.display_order);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('appsn_executives_cache', JSON.stringify(mapped));
        }
      } catch (e) {}
      return mapped;
    }

    return INITIAL_EXECUTIVES;
  } catch (err) {
    console.error('Failed to fetch executives:', err);
    return INITIAL_EXECUTIVES;
  }
}

// Fetch Aims & Objectives from Supabase
export async function fetchAimsObjectives(): Promise<AimObjective[]> {
  try {
    const { data, error } = await supabase
      .from('aims_objectives')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      const cached = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('appsn_aims_cache') : null;
      return cached ? JSON.parse(cached) : INITIAL_AIMS_OBJECTIVES;
    }

    if (data && data.length > 0) {
      const mapped: AimObjective[] = data.map((row: any, idx: number) => ({
        id: String(row.id || `aim-${idx + 1}`),
        title: row.title || `Aim & Objective ${idx + 1}`,
        description: row.description || '',
        icon: row.icon || 'ShieldCheck',
        display_order: Number(row.display_order ?? idx + 1),
        is_active: row.is_active ?? true,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
      mapped.sort((a, b) => a.display_order - b.display_order);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('appsn_aims_cache', JSON.stringify(mapped));
        }
      } catch (e) {}
      return mapped;
    }

    return INITIAL_AIMS_OBJECTIVES;
  } catch (err) {
    console.error('Failed to fetch aims_objectives:', err);
    return INITIAL_AIMS_OBJECTIVES;
  }
}

// Upload surveyor profile image to Supabase Storage
export async function uploadSurveyorImage(file: File, regNo: string): Promise<string> {
  const cleanRegNo = regNo.replace(/[^a-zA-Z0-9]/g, '_');
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${cleanRegNo}_${Date.now()}_profile.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('profiles')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Error uploading image to Supabase storage:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('profiles')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

// Subscribe to real-time changes on the surveyors table
export function subscribeToSurveyorChanges(callback: (payload: any) => void) {
  const channel = supabase
    .channel('public:surveyors')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'surveyors' }, callback)
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
}

// Subscribe to real-time changes on the executives table
export function subscribeToExecutiveChanges(callback: (payload: any) => void) {
  const channel = supabase
    .channel('public:executives')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'executives' }, callback)
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
}

// Subscribe to real-time changes on the aims_objectives table
export function subscribeToAimsChanges(callback: (payload: any) => void) {
  const channel = supabase
    .channel('public:aims_objectives')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'aims_objectives' }, callback)
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
}

// Upsert executive to Supabase
export async function saveExecutiveToSupabase(exec: Executive): Promise<void> {
  try {
    const { error } = await supabase
      .from('executives')
      .upsert({
        id: exec.id,
        full_name: exec.full_name,
        position: exec.position,
        profile_image: exec.profile_image,
        bio: exec.bio,
        display_order: exec.display_order,
        updated_at: new Date().toISOString()
      });
    if (error) {
      console.warn('Could not upsert into Supabase executives table:', error.message);
    }
  } catch (e) {
    console.warn('Error saving executive:', e);
  }
}

// Delete executive from Supabase
export async function deleteExecutiveFromSupabase(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('executives')
      .delete()
      .eq('id', id);
    if (error) {
      console.warn('Could not delete from Supabase executives table:', error.message);
    }
  } catch (e) {
    console.warn('Error deleting executive:', e);
  }
}

// Upsert aim to Supabase
export async function saveAimToSupabase(aim: AimObjective): Promise<void> {
  try {
    const { error } = await supabase
      .from('aims_objectives')
      .upsert({
        id: aim.id,
        title: aim.title,
        description: aim.description,
        icon: aim.icon,
        display_order: aim.display_order,
        is_active: aim.is_active ?? true,
        updated_at: new Date().toISOString()
      });
    if (error) {
      console.warn('Could not upsert into Supabase aims_objectives table:', error.message);
    }
  } catch (e) {
    console.warn('Error saving aim:', e);
  }
}
