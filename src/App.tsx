import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SurveyorCard from './components/SurveyorCard';
import ProfileModal from './components/ProfileModal';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import ResourcesSection from './components/ResourcesSection';
import ContactSection from './components/ContactSection';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import ExecutiveCouncil from './components/ExecutiveCouncil';
import AimsObjectives from './components/AimsObjectives';
import VerificationGuide from './components/VerificationGuide';
import ImagePreviewModal from './components/ImagePreviewModal';
import AdminPortal from './components/AdminPortal';

import { Surveyor, AdminAccount, ContactMessage, Executive, AimObjective } from './types';
import { DEFAULT_ADMINS, INITIAL_MESSAGES, KWARA_LGAS, SPECIALIZATIONS, INITIAL_EXECUTIVES, INITIAL_AIMS_OBJECTIVES } from './data';
import { 
  fetchSurveyors, 
  subscribeToSurveyorChanges, 
  fetchExecutives, 
  subscribeToExecutiveChanges,
  fetchAimsObjectives,
  subscribeToAimsChanges,
  saveExecutiveToSupabase,
  deleteExecutiveFromSupabase,
  saveAimToSupabase,
  deleteAimFromSupabase
} from './lib/supabase';
import { 
  getViewFromLocation, 
  getPathForView, 
  updatePageMeta, 
  AppView 
} from './lib/routes';
import { 
  Compass, 
  Users, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';

// Utility function to randomize array order (Fisher-Yates shuffle)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function App() {
  // Navigation State initialized directly from browser URL
  const [view, setView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getViewFromLocation(window.location.pathname, window.location.search);
    }
    return 'home';
  });

  // Centralized URL-synced navigation method
  const navigateTo = (newView: string, pushHistory = true) => {
    setView(newView);
    const targetPath = getPathForView(newView);
    updatePageMeta(newView as AppView);

    if (pushHistory && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== targetPath) {
        window.history.pushState({ view: newView }, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Surveyors live state from Supabase
  const [surveyors, setSurveyors] = useState<Surveyor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Executives & Aims live state from Supabase
  const [executives, setExecutives] = useState<Executive[]>(INITIAL_EXECUTIVES);
  const [aims, setAims] = useState<AimObjective[]>(INITIAL_AIMS_OBJECTIVES);

  // Admins & Messages local states
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loggedInAdmin, setLoggedInAdmin] = useState<AdminAccount | null>(null);

  // Filter States for Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLga, setSelectedLga] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [shuffleKey, setShuffleKey] = useState<number>(0);

  // Selected Surveyor Modal State with URL synchronization
  const [selectedSurveyor, setSelectedSurveyor] = useState<Surveyor | null>(null);

  const handleSelectSurveyor = (surveyor: Surveyor | null) => {
    setSelectedSurveyor(surveyor);
    if (typeof window !== 'undefined') {
      const targetPath = getPathForView(view);
      if (surveyor) {
        const regOrId = surveyor.registrationNumber || surveyor.surcon_registration_number || surveyor.id;
        const encodedReg = encodeURIComponent(regOrId);
        window.history.replaceState({ view, surveyor: surveyor.id }, '', `${targetPath}?surveyor=${encodedReg}`);
      } else {
        window.history.replaceState({ view }, '', targetPath);
      }
    }
  };

  // Image Preview Modal State
  const [previewImage, setPreviewImage] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    subtitle?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    subtitle: ''
  });

  const handleOpenPreview = (imageUrl: string, title: string, subtitle?: string) => {
    setPreviewImage({
      isOpen: true,
      imageUrl,
      title,
      subtitle
    });
  };

  // 1. Fetch real surveyors from Supabase and randomize order
  const loadSupabaseSurveyors = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await fetchSurveyors();
      setSurveyors(shuffleArray<Surveyor>(data));
    } catch (err: any) {
      console.error('Failed to load surveyors from Supabase:', err);
      setLoadError(err.message || 'Could not load surveyor registry from database.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch real executives from Supabase
  const loadSupabaseExecutives = async () => {
    try {
      const execs = await fetchExecutives();
      if (execs && execs.length > 0) {
        setExecutives(execs);
      }
    } catch (err) {
      console.error('Failed to load executives:', err);
    }
  };

  // 3. Fetch real aims and objectives from Supabase
  const loadSupabaseAims = async () => {
    try {
      const aimsList = await fetchAimsObjectives();
      if (aimsList && aimsList.length > 0) {
        setAims(aimsList);
      }
    } catch (err) {
      console.error('Failed to load aims & objectives:', err);
    }
  };

  useEffect(() => {
    // Initial fetch from live Supabase database
    loadSupabaseSurveyors();
    loadSupabaseExecutives();
    loadSupabaseAims();

    // Subscribe to real-time changes
    const surveyorSub = subscribeToSurveyorChanges((payload) => {
      console.log('Realtime change in surveyors:', payload);
      loadSupabaseSurveyors();
    });

    const execSub = subscribeToExecutiveChanges((payload) => {
      console.log('Realtime change in executives:', payload);
      loadSupabaseExecutives();
    });

    const aimsSub = subscribeToAimsChanges((payload) => {
      console.log('Realtime change in aims:', payload);
      loadSupabaseAims();
    });

    // Load admin accounts
    try {
      const savedAdmins = localStorage.getItem('appsn_admins');
      if (savedAdmins) {
        setAdmins(JSON.parse(savedAdmins));
      } else {
        setAdmins(DEFAULT_ADMINS);
        localStorage.setItem('appsn_admins', JSON.stringify(DEFAULT_ADMINS));
      }
    } catch (e) {
      setAdmins(DEFAULT_ADMINS);
    }

    // Load messages
    try {
      const savedMessages = localStorage.getItem('appsn_messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages(INITIAL_MESSAGES);
        localStorage.setItem('appsn_messages', JSON.stringify(INITIAL_MESSAGES));
      }
    } catch (e) {
      setMessages(INITIAL_MESSAGES);
    }

    // Load logged in admin session
    try {
      const savedSession = sessionStorage.getItem('appsn_admin_session');
      if (savedSession) {
        setLoggedInAdmin(JSON.parse(savedSession));
      }
    } catch (e) {}

    return () => {
      surveyorSub.unsubscribe();
      execSub.unsubscribe();
      aimsSub.unsubscribe();
    };
  }, []);

  // Handle browser Back/Forward navigation (popstate) and URL query synchronization
  useEffect(() => {
    const handlePopState = () => {
      const detectedView = getViewFromLocation(window.location.pathname, window.location.search);
      setView(detectedView);
      updatePageMeta(detectedView);

      const params = new URLSearchParams(window.location.search);
      const surveyorParam = params.get('surveyor');
      if (surveyorParam && surveyors.length > 0) {
        const match = surveyors.find(
          s => (s.registrationNumber && s.registrationNumber.toLowerCase() === surveyorParam.toLowerCase()) ||
               (s.surcon_registration_number && s.surcon_registration_number.toLowerCase() === surveyorParam.toLowerCase()) ||
               s.id.toLowerCase() === surveyorParam.toLowerCase()
        );
        if (match) {
          setSelectedSurveyor(match);
        } else {
          setSelectedSurveyor(null);
        }
      } else {
        setSelectedSurveyor(null);
      }
    };

    // Initialize meta tags and check URL params on mount
    const initialView = getViewFromLocation(window.location.pathname, window.location.search);
    updatePageMeta(initialView);

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [surveyors]);

  // Synchronize surveyor profile modal if page is refreshed or opened with ?surveyor=
  useEffect(() => {
    if (surveyors.length > 0 && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const surveyorParam = params.get('surveyor');
      if (surveyorParam && !selectedSurveyor) {
        const match = surveyors.find(
          s => (s.registrationNumber && s.registrationNumber.toLowerCase() === surveyorParam.toLowerCase()) ||
               (s.surcon_registration_number && s.surcon_registration_number.toLowerCase() === surveyorParam.toLowerCase()) ||
               s.id.toLowerCase() === surveyorParam.toLowerCase()
        );
        if (match) {
          setSelectedSurveyor(match);
        }
      }
    }
  }, [surveyors]);

  // Randomize directory order whenever navigating to the directory view
  useEffect(() => {
    if (view === 'directory') {
      setShuffleKey((prev) => prev + 1);
    }
  }, [view]);

  // --- DATABASE / ADMIN ACTIONS ---
  const handleAddSurveyor = (newS: Omit<Surveyor, 'id' | 'createdAt'>) => {
    const freshSurveyor: Surveyor = {
      ...newS,
      id: `surv-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [freshSurveyor, ...surveyors];
    setSurveyors(updated);
  };

  const handleUpdateSurveyor = (updatedS: Surveyor) => {
    const updated = surveyors.map(s => s.id === updatedS.id ? updatedS : s);
    setSurveyors(updated);
  };

  const handleDeleteSurveyor = (id: string) => {
    const updated = surveyors.filter(s => s.id !== id);
    setSurveyors(updated);
  };

  // Executive Council Handlers
  const handleSaveExecutive = async (exec: Executive) => {
    const exists = executives.some(e => e.id === exec.id);
    let updated: Executive[];
    if (exists) {
      updated = executives.map(e => e.id === exec.id ? exec : e);
    } else {
      updated = [...executives, exec];
    }
    updated.sort((a, b) => a.display_order - b.display_order);
    setExecutives(updated);

    try {
      localStorage.setItem('appsn_executives_cache', JSON.stringify(updated));
    } catch (e) {}

    await saveExecutiveToSupabase(exec);
  };

  const handleDeleteExecutive = async (id: string) => {
    const updated = executives.filter(e => e.id !== id);
    setExecutives(updated);
    try {
      localStorage.setItem('appsn_executives_cache', JSON.stringify(updated));
    } catch (e) {}
    await deleteExecutiveFromSupabase(id);
  };

  // Aims & Objectives Handlers
  const handleSaveAim = async (aim: AimObjective) => {
    const exists = aims.some(a => a.id === aim.id);
    let updated: AimObjective[];
    if (exists) {
      updated = aims.map(a => a.id === aim.id ? aim : a);
    } else {
      updated = [...aims, aim];
    }
    updated.sort((a, b) => a.display_order - b.display_order);
    setAims(updated);

    try {
      localStorage.setItem('appsn_aims_cache', JSON.stringify(updated));
    } catch (e) {}

    await saveAimToSupabase(aim);
  };

  const handleDeleteAim = async (id: string) => {
    const updated = aims.filter(a => a.id !== id);
    setAims(updated);
    try {
      localStorage.setItem('appsn_aims_cache', JSON.stringify(updated));
    } catch (e) {}
    await deleteAimFromSupabase(id);
  };

  const handleAddAdmin = (username: string, email: string, role: 'Super Admin' | 'Branch Admin') => {
    const newAdmin: AdminAccount = {
      id: `admin-${Date.now()}`,
      username,
      email,
      role
    };
    const updated = [...admins, newAdmin];
    setAdmins(updated);
    try {
      localStorage.setItem('appsn_admins', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDeleteAdmin = (id: string) => {
    const updated = admins.filter(a => a.id !== id);
    setAdmins(updated);
    try {
      localStorage.setItem('appsn_admins', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleAddContactMessage = (name: string, email: string, phone: string, subject: string, message: string) => {
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      phone,
      subject,
      message,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    try {
      localStorage.setItem('appsn_messages', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleUpdateMessageStatus = (id: string, status: 'unread' | 'replied' | 'archived') => {
    const updated = messages.map(m => m.id === id ? { ...m, status } : m);
    setMessages(updated);
    try {
      localStorage.setItem('appsn_messages', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    try {
      localStorage.setItem('appsn_messages', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleAdminLogin = (admin: AdminAccount) => {
    const updatedAdmins = admins.map(a => a.id === admin.id ? { ...a, lastLogin: new Date().toISOString() } : a);
    setAdmins(updatedAdmins);
    try {
      localStorage.setItem('appsn_admins', JSON.stringify(updatedAdmins));
      sessionStorage.setItem('appsn_admin_session', JSON.stringify(admin));
    } catch (e) {}

    setLoggedInAdmin(admin);
    navigateTo('admin');
  };

  const handleAdminLogout = () => {
    setLoggedInAdmin(null);
    try {
      sessionStorage.removeItem('appsn_admin_session');
    } catch (e) {}
    navigateTo('home');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLga('');
    setSelectedSpecialization('');
  };

  // Filtered Surveyors list (randomized order upon reload, navigation, or shuffle trigger)
  const filteredSurveyors = useMemo(() => {
    // Randomize the order of the surveyors array
    const randomizedSurveyors: Surveyor[] = shuffleArray<Surveyor>(surveyors);

    return randomizedSurveyors.filter(s => {
      if (!s.isActive) return false;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        s.fullName.toLowerCase().includes(q) ||
        s.registrationNumber.toLowerCase().includes(q) ||
        s.specialization.toLowerCase().includes(q) ||
        s.officeAddress.toLowerCase().includes(q) ||
        (s.company_name && s.company_name.toLowerCase().includes(q)) ||
        s.lga.toLowerCase().includes(q);

      const matchesLga = selectedLga ? s.lga.toLowerCase() === selectedLga.toLowerCase() : true;
      const matchesSpecialization = selectedSpecialization ? s.specialization.toLowerCase() === selectedSpecialization.toLowerCase() : true;

      return matchesSearch && matchesLga && matchesSpecialization;
    });
  }, [surveyors, searchQuery, selectedLga, selectedSpecialization, shuffleKey]);

  // Stats calculation
  const totalSurveyorCount = surveyors.length;
  const lgaCoverageCount = useMemo(() => {
    const lgas = new Set(surveyors.map(s => s.lga).filter(Boolean));
    return lgas.size || 16;
  }, [surveyors]);

  // Scroll to directory controls
  const scrollToDirectory = () => {
    const el = document.getElementById('homepage-directory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col text-slate-800 antialiased font-sans" id="appsn-root">
      
      {/* 1. TOP NAVIGATION HEADER */}
      <Navbar 
        currentView={view} 
        setView={(newView) => navigateTo(newView)} 
        onQuickSearchClick={() => navigateTo('directory')}
      />

      {/* 2. MAIN APPLICATION CONTENT */}
      <main className="flex-1">
        
        {/* ========================================================= */}
        {/* VIEW: HOME / LANDING PAGE                                  */}
        {/* Clean, uncrowded layout:                                   */}
        {/* 1. Hero Section (with Direct Search/Find action)           */}
        {/* 2. APPSN Kwara Executive Council                          */}
        {/* 3. APPSN Kwara Aims & Objectives                          */}
        {/* 4. Why Hire an APPSN Surveyor / Verification Guide        */}
        {/* 5. Footer (at bottom of page)                             */}
        {/* ========================================================= */}
        {view === 'home' && (
          <div id="view-home" className="space-y-0">
            
            {/* 1. HERO SECTION */}
            <Hero 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedLga={selectedLga}
              setSelectedLga={setSelectedLga}
              selectedSpecialization={selectedSpecialization}
              setSelectedSpecialization={setSelectedSpecialization}
              onReset={handleResetFilters}
              totalCount={filteredSurveyors.length}
              stats={{
                totalSurveyors: 60,
                lgasCovered: 16,
                verifiedPercentage: 100,
              }}
              onSearch={() => navigateTo('directory')}
            />

            {/* 2. APPSN KWARA EXECUTIVE COUNCIL */}
            <ExecutiveCouncil 
              executives={executives}
              onPreviewImage={handleOpenPreview}
            />

            {/* 3. APPSN KWARA AIMS & OBJECTIVES */}
            <AimsObjectives 
              aims={aims} 
            />

            {/* 4. WHY HIRE AN APPSN SURVEYOR / VERIFICATION GUIDE */}
            <VerificationGuide 
              onSearchSurveyor={() => navigateTo('directory')}
            />

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW: FULL DIRECTORY (When clicked from Navbar or Hero)     */}
        {/* ========================================================= */}
        {view === 'directory' && (
          <div id="view-directory" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200/80 pb-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#0D3829] font-mono block mb-2">
                  — OFFICIAL PUBLIC REGISTRY
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#0B251D] tracking-tight leading-tight">
                  Kwara State Registered Surveyors
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
                  Search, verify credentials, and directly contact SURCON-certified private practicing surveyors in Kwara State.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-mono font-bold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>60+ Certified Practitioners</span>
                </span>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
                
                {/* Search query input (8 cols) */}
                <div className="md:col-span-8 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by surveyor name, SURCON reg number, company, or street..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D3829] focus:bg-white text-slate-900 transition-all font-medium"
                  />
                </div>

                {/* LGA Dropdown (4 cols) */}
                <div className="md:col-span-4">
                  <select
                    value={selectedLga}
                    onChange={(e) => setSelectedLga(e.target.value)}
                    className="w-full py-2.5 px-3 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D3829] focus:bg-white text-slate-700 cursor-pointer font-medium"
                  >
                    <option value="">All 16 Kwara LGAs</option>
                    {KWARA_LGAS.map((lga) => (
                      <option key={lga} value={lga}>{lga} LGA</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter indicators & reset */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0D3829]">{filteredSurveyors.length}</span>
                  <span>certified surveyors matching criteria</span>
                  {(searchQuery || selectedLga) && (
                    <span className="text-slate-400">· filtered from {totalSurveyorCount} total</span>
                  )}
                </div>

                {(searchQuery || selectedLga) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[#0D3829] hover:underline font-bold text-xs cursor-pointer font-sans"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </div>

            {/* Surveyors Grid */}
            {isLoading ? (
              <div className="py-24 text-center space-y-4">
                <div className="w-10 h-10 border-3 border-[#0D3829] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-mono font-medium">
                  Connecting to Supabase registry...
                </p>
              </div>
            ) : filteredSurveyors.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 py-16 px-4 text-center max-w-md mx-auto shadow-xs space-y-4">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-slate-900">No Surveyor Found</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No registered surveyor matched "{searchQuery}" with the chosen filters. Try clearing your search or selecting another LGA.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#0D3829] hover:bg-[#08281D] text-white font-bold py-2.5 px-5 rounded-full text-xs transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {filteredSurveyors.map((surveyor) => (
                  <SurveyorCard 
                    key={surveyor.id}
                    surveyor={surveyor}
                    onViewProfile={handleSelectSurveyor}
                    onPreviewImage={handleOpenPreview}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW: SERVICES                                             */}
        {/* ========================================================= */}
        {view === 'services' && (
          <div id="view-services">
            <ServicesSection 
              onExploreAll={() => navigateTo('directory')}
            />
            <CtaBanner 
              onBrowseSurveyors={() => navigateTo('directory')}
              onLearnServices={() => navigateTo('contact')}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW: ABOUT                                                */}
        {/* ========================================================= */}
        {view === 'about' && (
          <div id="view-about">
            <AboutSection 
              isHomePreview={false}
              onLearnMore={() => navigateTo('directory')}
              onContactClick={() => navigateTo('contact')}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW: RESOURCES & CITIZEN GUIDE                            */}
        {/* ========================================================= */}
        {view === 'resources' && (
          <div id="view-resources">
            <ResourcesSection />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW: CONTACT                                              */}
        {/* ========================================================= */}
        {view === 'contact' && (
          <div id="view-contact">
            <ContactSection 
              onSendMessage={(name, email, phone, subject, message) => {
                handleAddContactMessage(name, email, phone, subject, message);
              }}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW: ADMIN PORTAL                                         */}
        {/* ========================================================= */}
        {view === 'admin' && (
          <div id="view-admin">
            <AdminPortal 
              surveyors={surveyors}
              admins={admins}
              messages={messages}
              executives={executives}
              aims={aims}
              onAddSurveyor={handleAddSurveyor}
              onUpdateSurveyor={handleUpdateSurveyor}
              onDeleteSurveyor={handleDeleteSurveyor}
              onSaveExecutive={handleSaveExecutive}
              onDeleteExecutive={handleDeleteExecutive}
              onSaveAim={handleSaveAim}
              onDeleteAim={handleDeleteAim}
              onAddAdmin={handleAddAdmin}
              onDeleteAdmin={handleDeleteAdmin}
              onUpdateMessageStatus={handleUpdateMessageStatus}
              onDeleteMessage={handleDeleteMessage}
              onLoginSuccess={handleAdminLogin}
              loggedInAdmin={loggedInAdmin}
              onPreviewImage={handleOpenPreview}
            />
          </div>
        )}

      </main>

      {/* 3. PROFILE MODAL */}
      <ProfileModal
        surveyor={selectedSurveyor}
        onClose={() => handleSelectSurveyor(null)}
        onPreviewImage={handleOpenPreview}
      />

      {/* 4. IMAGE PREVIEW MODAL */}
      <ImagePreviewModal
        isOpen={previewImage.isOpen}
        onClose={() => setPreviewImage(prev => ({ ...prev, isOpen: false }))}
        imageUrl={previewImage.imageUrl}
        title={previewImage.title}
        subtitle={previewImage.subtitle}
      />

      {/* 5. FOOTER */}
      <Footer setView={(newView) => navigateTo(newView)} currentView={view} />

    </div>
  );
}
