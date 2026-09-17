export interface Surveyor {
  id: string;
  fullName: string;
  registrationNumber: string; // e.g. SURCON BJ/4591 or SURV/2015/098
  phoneNumber: string;
  email: string;
  officeAddress: string;
  lga: string; // Kwara LGAs (e.g. Ilorin West, Offa, etc.) or 'LGA not specified'
  specialization: string;
  yearsOfExperience?: number; // Kept optional for DB backward-compatibility, never displayed
  profilePhoto: string; // URL or base64
  isActive: boolean;
  createdAt: string;
  aboutMe?: string;
  bio?: string;

  // Supabase Database Specific Fields
  title?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  surcon_registration_number?: string;
  surcon_prefix?: string;
  whatsapp_number?: string;
  company_name?: string;
  company_address?: string;
  residency?: string;
  profile_image_url?: string;
  date_of_birth?: string;
  qualification?: string;
  areasServed?: string[];
}

export interface Executive {
  id: string;
  full_name: string;
  position: string;
  profile_image: string;
  bio?: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface AimObjective {
  id: string;
  title: string;
  description: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AdminAccount {
  id: string;
  username: string;
  email: string;
  role: 'Super Admin' | 'Branch Admin';
  lastLogin?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'replied' | 'archived';
  createdAt: string;
}

export interface BranchStat {
  totalSurveyors: number;
  activeMembers: number;
  lgasRepresented: number;
  yearsExperienceCombined: number;
  recentAdditionsCount: number;
  specializationBreakdown: Record<string, number>;
  lgaBreakdown: Record<string, number>;
}

