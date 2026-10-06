import { createClient } from '@supabase/supabase-js';
import { 
  Surveyor, Executive, AimObjective, ServiceItem, 
  VerificationPillar, AboutContent, SiteSettings 
} from '../types';
import { 
  KWARA_LGAS, INITIAL_EXECUTIVES, INITIAL_AIMS_OBJECTIVES,
  INITIAL_SERVICES, INITIAL_VERIFICATION_PILLARS, 
  INITIAL_ABOUT_CONTENT, INITIAL_SITE_SETTINGS
} from '../data';
import { resolveLgaFromLocation } from './lgaResolver';
import { KNOWN_SURVEYOR_COORDINATES } from './locationCoordinates';

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
  latitude?: number | null;
  longitude?: number | null;
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

  const rawAddress = row.company_address || row.officeAddress || '';

  // Extract coordinates from row.latitude/row.longitude OR embedded [geo:lat,lng] in address OR verified KNOWN_SURVEYOR_COORDINATES
  let latitude: number | null = null;
  let longitude: number | null = null;

  const rawLat = row.latitude != null ? parseFloat(String(row.latitude)) : null;
  const rawLng = row.longitude != null ? parseFloat(String(row.longitude)) : null;

  if (rawLat !== null && rawLng !== null && !isNaN(rawLat) && !isNaN(rawLng) && rawLat !== 0 && rawLng !== 0) {
    latitude = rawLat;
    longitude = rawLng;
  } else {
    // Check embedded [geo:lat,lng] in raw address
    const geoMatch = rawAddress.match(/\[geo:([0-9.-]+),([0-9.-]+)\]/);
    if (geoMatch) {
      const parsedLat = parseFloat(geoMatch[1]);
      const parsedLng = parseFloat(geoMatch[2]);
      if (!isNaN(parsedLat) && !isNaN(parsedLng) && parsedLat !== 0 && parsedLng !== 0) {
        latitude = parsedLat;
        longitude = parsedLng;
      }
    } else if (row.id && KNOWN_SURVEYOR_COORDINATES[row.id]) {
      // Lookup verified coordinates strictly by surveyor ID
      const [knownLat, knownLng] = KNOWN_SURVEYOR_COORDINATES[row.id];
      latitude = knownLat;
      longitude = knownLng;
    }
  }

  // Strip embedded geo string from clean display address
  const cleanOfficeAddress = rawAddress.replace(/\s*\[geo:[^\]]+\]\s*/g, '').trim();
  
  // Automatic LGA assignment derived strictly from office address/location
  let lga = resolveLgaFromLocation(cleanOfficeAddress);
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
    officeAddress: cleanOfficeAddress || 'Kwara State, Nigeria',
    lga,
    specialization,
    profilePhoto,
    isActive: row.is_active ?? true,
    createdAt: row.created_at || new Date().toISOString(),
    aboutMe,
    latitude,
    longitude,

    // Supabase Specific
    title: row.title || undefined,
    first_name: row.first_name || undefined,
    middle_name: row.middle_name || undefined,
    last_name: row.last_name || undefined,
    surcon_registration_number: row.surcon_registration_number || undefined,
    surcon_prefix: row.surcon_prefix || undefined,
    whatsapp_number: row.whatsapp_number || row.phone_number || undefined,
    company_name: row.company_name || undefined,
    company_address: cleanOfficeAddress || undefined,
    residency: row.residency || undefined,
    profile_image_url: row.profile_image_url || undefined,
    date_of_birth: row.date_of_birth || undefined,
    qualification: row.qualification || 'SURCON Licensed Private Practicing Surveyor',
  };
}

// Persist surveyor details and coordinates to Supabase
export async function saveSurveyorToSupabase(surveyor: Surveyor): Promise<void> {
  const cleanAddr = (surveyor.officeAddress || '').replace(/\s*\[geo:[^\]]+\]\s*/g, '').trim();
  const addressWithGeo = (typeof surveyor.latitude === 'number' && typeof surveyor.longitude === 'number' && !isNaN(surveyor.latitude) && !isNaN(surveyor.longitude))
    ? `${cleanAddr} [geo:${Number(surveyor.latitude).toFixed(6)},${Number(surveyor.longitude).toFixed(6)}]`
    : cleanAddr;

  // 1. Always update local storage cache immediately
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cache = JSON.parse(localStorage.getItem('appsn_surveyor_coords') || '{}');
      if (typeof surveyor.latitude === 'number' && typeof surveyor.longitude === 'number') {
        cache[surveyor.id] = { latitude: surveyor.latitude, longitude: surveyor.longitude };
      } else {
        delete cache[surveyor.id];
      }
      localStorage.setItem('appsn_surveyor_coords', JSON.stringify(cache));
    }
  } catch (e) {}

  // 2. Persist to Supabase
  try {
    const payloadWithCols: any = {
      company_address: addressWithGeo,
      latitude: surveyor.latitude ?? null,
      longitude: surveyor.longitude ?? null,
      updated_at: new Date().toISOString()
    };

    if (surveyor.fullName) payloadWithCols.full_name = surveyor.fullName;
    if (surveyor.email) payloadWithCols.email = surveyor.email;
    if (surveyor.phoneNumber) payloadWithCols.phone_number = surveyor.phoneNumber;

    const { error } = await supabase
      .from('surveyors')
      .update(payloadWithCols)
      .eq('id', surveyor.id);

    if (error) {
      // If error was missing latitude/longitude columns, update company_address with embedded geo
      if (error.message && (error.message.includes('latitude') || error.message.includes('longitude') || error.code === '42703')) {
        await supabase
          .from('surveyors')
          .update({
            company_address: addressWithGeo,
            updated_at: new Date().toISOString()
          })
          .eq('id', surveyor.id);
      } else {
        console.warn('Supabase surveyor update notice:', error.message);
      }
    }
  } catch (err) {
    console.warn('Error saving surveyor to Supabase:', err);
  }
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

// Fetch a single surveyor by their unique ID from Supabase
export async function fetchSurveyorById(id: string): Promise<Surveyor | null> {
  try {
    const { data, error } = await supabase
      .from('surveyors')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapSupabaseRowToSurveyor(data);
  } catch (err) {
    console.warn('Error fetching surveyor by id:', err);
    return null;
  }
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

        const isActive = row.is_active !== undefined 
          ? Boolean(row.is_active) 
          : (row.active !== undefined ? Boolean(row.active) : true);

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
          is_active: isActive,
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
    const payload: any = {
      id: exec.id,
      full_name: exec.full_name,
      position: exec.position,
      profile_image: exec.profile_image,
      bio: exec.bio,
      display_order: exec.display_order,
      is_active: exec.is_active ?? true,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('executives')
      .upsert(payload);

    if (error) {
      if (error.message && (error.message.includes('is_active') || error.message.includes('column'))) {
        // Fall back without is_active if column is not yet present on table
        delete payload.is_active;
        const { error: retryError } = await supabase.from('executives').upsert(payload);
        if (retryError) {
          console.warn('Could not upsert into Supabase executives table:', retryError.message);
        }
      } else {
        console.warn('Could not upsert into Supabase executives table:', error.message);
      }
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

// Delete aim from Supabase
export async function deleteAimFromSupabase(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('aims_objectives')
      .delete()
      .eq('id', id);
    if (error) {
      console.warn('Could not delete from Supabase aims_objectives table:', error.message);
    }
  } catch (e) {
    console.warn('Error deleting aim:', e);
  }
}

// -------------------------------------------------------------
// DYNAMIC SITE SETTINGS (Logo, Favicon, Title, Contacts, Hero)
// -------------------------------------------------------------
export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1);

    if (!error && data && data.length > 0) {
      const s = data[0];
      const merged: SiteSettings = {
        logoUrl: s.logo_url || s.logoUrl || INITIAL_SITE_SETTINGS.logoUrl,
        faviconUrl: s.favicon_url || s.faviconUrl || INITIAL_SITE_SETTINGS.faviconUrl,
        siteTitle: s.site_title || s.siteTitle || INITIAL_SITE_SETTINGS.siteTitle,
        tagline: s.tagline || INITIAL_SITE_SETTINGS.tagline,
        branchName: s.branch_name || s.branchName || INITIAL_SITE_SETTINGS.branchName,
        heroHeadline: s.hero_headline || s.heroHeadline || INITIAL_SITE_SETTINGS.heroHeadline,
        heroSubtitle: s.hero_subtitle || s.heroSubtitle || INITIAL_SITE_SETTINGS.heroSubtitle,
        phone: s.phone || INITIAL_SITE_SETTINGS.phone,
        email: s.email || INITIAL_SITE_SETTINGS.email,
        address: s.address || INITIAL_SITE_SETTINGS.address
      };
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('appsn_site_settings', JSON.stringify(merged));
      }
      return merged;
    }
  } catch (e) {
    console.warn('Supabase site_settings fallback:', e);
  }

  // Local storage fallback
  try {
    const cached = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('appsn_site_settings') : null;
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        ...INITIAL_SITE_SETTINGS,
        ...parsed,
        logoUrl: parsed.logoUrl?.startsWith('data:') ? parsed.logoUrl : '/logo.png',
        faviconUrl: parsed.faviconUrl?.startsWith('data:') ? parsed.faviconUrl : '/favicon.png'
      };
    }
  } catch (e) {}

  return INITIAL_SITE_SETTINGS;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  // Always persist to local cache immediately
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('appsn_site_settings', JSON.stringify(settings));
    }
  } catch (e) {}

  // Update DOM favicon and title dynamically
  try {
    if (typeof document !== 'undefined') {
      if (settings.siteTitle) document.title = settings.siteTitle;
      if (settings.faviconUrl) {
        let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = settings.faviconUrl;
      }
    }
  } catch (e) {}

  // Attempt Supabase upsert
  try {
    await supabase
      .from('site_settings')
      .upsert({
        id: 'default',
        logo_url: settings.logoUrl,
        favicon_url: settings.faviconUrl,
        site_title: settings.siteTitle,
        tagline: settings.tagline,
        branch_name: settings.branchName,
        hero_headline: settings.heroHeadline,
        hero_subtitle: settings.heroSubtitle,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        updated_at: new Date().toISOString()
      });
  } catch (e) {
    console.warn('Could not save to Supabase site_settings:', e);
  }
}

// -------------------------------------------------------------
// DYNAMIC SERVICES (Survey Practice Services)
// -------------------------------------------------------------
export async function fetchServices(): Promise<ServiceItem[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      const mapped: ServiceItem[] = data.map((row: any, idx: number) => ({
        id: String(row.id || `service-${idx + 1}`),
        name: row.name || `Service ${idx + 1}`,
        shortDesc: row.short_desc || row.shortDesc || '',
        fullDesc: row.full_desc || row.fullDesc || '',
        useCase: row.use_case || row.useCase || '',
        iconName: row.icon_name || row.iconName || 'Compass',
        display_order: Number(row.display_order ?? idx + 1),
        is_active: row.is_active ?? true
      }));
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('appsn_services_cache', JSON.stringify(mapped));
      }
      return mapped;
    }
  } catch (e) {
    console.warn('Supabase services fallback:', e);
  }

  try {
    const cached = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('appsn_services_cache') : null;
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  return INITIAL_SERVICES;
}

export async function saveServiceToDb(service: ServiceItem): Promise<void> {
  try {
    const cached = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('appsn_services_cache') : null;
    let list: ServiceItem[] = cached ? JSON.parse(cached) : INITIAL_SERVICES;
    const existingIndex = list.findIndex(s => s.id === service.id);
    if (existingIndex >= 0) {
      list[existingIndex] = service;
    } else {
      list.push(service);
    }
    list.sort((a, b) => a.display_order - b.display_order);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('appsn_services_cache', JSON.stringify(list));
    }
  } catch (e) {}

  try {
    await supabase
      .from('services')
      .upsert({
        id: service.id,
        name: service.name,
        short_desc: service.shortDesc,
        full_desc: service.fullDesc,
        use_case: service.useCase,
        icon_name: service.iconName,
        display_order: service.display_order,
        is_active: service.is_active ?? true,
        updated_at: new Date().toISOString()
      });
  } catch (e) {
    console.warn('Could not save service to Supabase:', e);
  }
}

export async function deleteServiceFromDb(id: string): Promise<void> {
  try {
    const cached = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('appsn_services_cache') : null;
    let list: ServiceItem[] = cached ? JSON.parse(cached) : INITIAL_SERVICES;
    list = list.filter(s => s.id !== id);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('appsn_services_cache', JSON.stringify(list));
    }
  } catch (e) {}

  try {
    await supabase.from('services').delete().eq('id', id);
  } catch (e) {
    console.warn('Could not delete service from Supabase:', e);
  }
}

// -------------------------------------------------------------
// DYNAMIC VALIDATION GUIDE (Verification Pillars)
// -------------------------------------------------------------
export async function fetchVerificationPillars(): Promise<VerificationPillar[]> {
  try {
    const { data, error } = await supabase
      .from('verification_guide')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      const mapped: VerificationPillar[] = data.map((row: any, idx: number) => ({
        id: String(row.id || `pillar-${idx + 1}`),
        title: row.title || `Pillar ${idx + 1}`,
        description: row.description || '',
        iconName: row.icon_name || row.iconName || 'ShieldCheck',
        display_order: Number(row.display_order ?? idx + 1)
      }));
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('appsn_pillars_cache', JSON.stringify(mapped));
      }
      return mapped;
    }
  } catch (e) {
    console.warn('Supabase verification_guide fallback:', e);
  }

  try {
    const cached = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('appsn_pillars_cache') : null;
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  return INITIAL_VERIFICATION_PILLARS;
}

export async function saveVerificationPillarToDb(pillar: VerificationPillar): Promise<void> {
  try {
    const cached = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('appsn_pillars_cache') : null;
    let list: VerificationPillar[] = cached ? JSON.parse(cached) : INITIAL_VERIFICATION_PILLARS;
    const existingIndex = list.findIndex(p => p.id === pillar.id);
    if (existingIndex >= 0) {
      list[existingIndex] = pillar;
    } else {
      list.push(pillar);
    }
    list.sort((a, b) => a.display_order - b.display_order);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('appsn_pillars_cache', JSON.stringify(list));
    }
  } catch (e) {}

  try {
    await supabase
      .from('verification_guide')
      .upsert({
        id: pillar.id,
        title: pillar.title,
        description: pillar.description,
        icon_name: pillar.iconName,
        display_order: pillar.display_order,
        updated_at: new Date().toISOString()
      });
  } catch (e) {
    console.warn('Could not save pillar to Supabase:', e);
  }
}

export async function deleteVerificationPillarFromDb(id: string): Promise<void> {
  try {
    const cached = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('appsn_pillars_cache') : null;
    let list: VerificationPillar[] = cached ? JSON.parse(cached) : INITIAL_VERIFICATION_PILLARS;
    list = list.filter(p => p.id !== id);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('appsn_pillars_cache', JSON.stringify(list));
    }
  } catch (e) {}

  try {
    await supabase.from('verification_guide').delete().eq('id', id);
  } catch (e) {
    console.warn('Could not delete pillar from Supabase:', e);
  }
}

// -------------------------------------------------------------
// DYNAMIC ABOUT APPSN CONTENT
// -------------------------------------------------------------
export async function fetchAboutContent(): Promise<AboutContent> {
  try {
    const { data, error } = await supabase
      .from('about_appsn')
      .select('*')
      .limit(1);

    if (!error && data && data.length > 0) {
      const a = data[0];
      const merged: AboutContent = {
        headlineBadge: a.headline_badge || a.headlineBadge || INITIAL_ABOUT_CONTENT.headlineBadge,
        heroHeading: a.hero_heading || a.heroHeading || INITIAL_ABOUT_CONTENT.heroHeading,
        leadParagraph: a.lead_paragraph || a.leadParagraph || INITIAL_ABOUT_CONTENT.leadParagraph,
        visionTitle: a.vision_title || a.visionTitle || INITIAL_ABOUT_CONTENT.visionTitle,
        visionText: a.vision_text || a.visionText || INITIAL_ABOUT_CONTENT.visionText,
        missionTitle: a.mission_title || a.missionTitle || INITIAL_ABOUT_CONTENT.missionTitle,
        missionText: a.mission_text || a.missionText || INITIAL_ABOUT_CONTENT.missionText,
        coreValuesTitle: a.core_values_title || a.coreValuesTitle || INITIAL_ABOUT_CONTENT.coreValuesTitle,
        coreValuesText: a.core_values_text || a.coreValuesText || INITIAL_ABOUT_CONTENT.coreValuesText,
        heroPhoto: (a.hero_photo || a.heroPhoto) && !(a.hero_photo || a.heroPhoto).startsWith('/assets/images/')
          ? (a.hero_photo || a.heroPhoto)
          : '/about_surveyor.jpg',
        yearsExperience: a.years_experience || a.yearsExperience || INITIAL_ABOUT_CONTENT.yearsExperience,
        yearsSubtitle: a.years_subtitle || a.yearsSubtitle || INITIAL_ABOUT_CONTENT.yearsSubtitle,
        secretariatAddress: a.secretariat_address || a.secretariatAddress || INITIAL_ABOUT_CONTENT.secretariatAddress,
        secretariatPhone: a.secretariat_phone || a.secretariatPhone || INITIAL_ABOUT_CONTENT.secretariatPhone,
        secretariatEmail: a.secretariat_email || a.secretariatEmail || INITIAL_ABOUT_CONTENT.secretariatEmail
      };
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('appsn_about_cache', JSON.stringify(merged));
      }
      return merged;
    }
  } catch (e) {
    console.warn('Supabase about_appsn fallback:', e);
  }

  try {
    const cached = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('appsn_about_cache') : null;
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  return INITIAL_ABOUT_CONTENT;
}

export async function saveAboutContentToDb(content: AboutContent): Promise<void> {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('appsn_about_cache', JSON.stringify(content));
    }
  } catch (e) {}

  try {
    await supabase
      .from('about_appsn')
      .upsert({
        id: 'default',
        headline_badge: content.headlineBadge,
        hero_heading: content.heroHeading,
        lead_paragraph: content.leadParagraph,
        vision_title: content.visionTitle,
        vision_text: content.visionText,
        mission_title: content.missionTitle,
        mission_text: content.missionText,
        core_values_title: content.coreValuesTitle,
        core_values_text: content.coreValuesText,
        hero_photo: content.heroPhoto,
        years_experience: content.yearsExperience,
        years_subtitle: content.yearsSubtitle,
        secretariat_address: content.secretariatAddress,
        secretariat_phone: content.secretariatPhone,
        secretariat_email: content.secretariatEmail,
        updated_at: new Date().toISOString()
      });
  } catch (e) {
    console.warn('Could not save about content to Supabase:', e);
  }
}

// Subscriptions for dynamic site elements
export function subscribeToServicesChanges(callback: (payload: any) => void) {
  const channel = supabase
    .channel('public:services')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, callback)
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
}

export function subscribeToSettingsChanges(callback: (payload: any) => void) {
  const channel = supabase
    .channel('public:site_settings')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, callback)
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
}

export const subscribeToSiteSettingsChanges = subscribeToSettingsChanges;

