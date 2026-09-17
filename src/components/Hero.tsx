import React from 'react';
import { Search, MapPin, LayoutGrid, ArrowRight, ShieldCheck, Users, Globe, Star } from 'lucide-react';
import { KWARA_LGAS, SPECIALIZATIONS } from '../data';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLga: string;
  setSelectedLga: (lga: string) => void;
  selectedSpecialization: string;
  setSelectedSpecialization: (spec: string) => void;
  onSearch: () => void;
  onReset?: () => void;
  totalCount: number;
  stats?: {
    totalSurveyors: number;
    lgasCovered: number;
    verifiedPercentage: number;
    totalExperienceYears: number;
  };
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedLga,
  setSelectedLga,
  selectedSpecialization,
  setSelectedSpecialization,
  onSearch,
  totalCount,
  stats = {
    totalSurveyors: 60,
    lgasCovered: 16,
    verifiedPercentage: 100,
    totalExperienceYears: 50
  }
}: HeroProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="relative bg-[#FAF9F5] border-b border-emerald-950/5 pt-10 sm:pt-14 pb-16 sm:pb-20 overflow-hidden" id="appsn-hero">
      
      {/* Background Subtle Gradient Mesh */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-100/30 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-emerald-100/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Search & Trust Badges (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            
            {/* Tag / Category Line */}
            <div className="inline-flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#0D3829] font-mono">
                TRUSTED &nbsp;/&nbsp; VERIFIED &nbsp;/&nbsp; PROFESSIONAL
              </span>
            </div>

            {/* Main Title in Elegant Serif */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-[#0B251D] tracking-tight leading-[1.12]">
              Find a Registered <br className="hidden sm:inline" />
              Surveyor in Kwara
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Connect with verified and registered practicing surveyors across Kwara State. Get professional support for your land, property and construction needs.
            </p>

            {/* Prominent Search & Filter Interface */}
            <form 
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/80 p-2.5 sm:p-3 transition-all duration-200 hover:border-emerald-900/30"
              id="hero-search-form"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-2.5 items-center">
                
                {/* Search Text Input (5 cols) */}
                <div className="sm:col-span-5 relative flex items-center">
                  <Search className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    id="hero-search-input"
                    type="text"
                    placeholder="Search by name, reg number or..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9.5 pr-3 py-3 rounded-xl bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-xs sm:text-sm font-medium"
                  />
                </div>

                {/* LGA Dropdown (3 cols) */}
                <div className="sm:col-span-3 relative flex items-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 pl-1 sm:pl-2">
                  <MapPin className="absolute left-3 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                  <select
                    id="hero-lga-select"
                    value={selectedLga}
                    onChange={(e) => setSelectedLga(e.target.value)}
                    className="w-full pl-8 pr-7 py-3 bg-transparent text-slate-700 text-xs sm:text-[13px] font-medium focus:outline-none appearance-none cursor-pointer truncate"
                  >
                    <option value="">All LGAs</option>
                    {KWARA_LGAS.map((lga) => (
                      <option key={lga} value={lga}>{lga}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-2 text-slate-400 text-xs">▼</div>
                </div>

                {/* Specialization Dropdown (2 cols) */}
                <div className="sm:col-span-2 relative flex items-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 pl-1 sm:pl-2">
                  <LayoutGrid className="absolute left-3 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                  <select
                    id="hero-spec-select"
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full pl-8 pr-6 py-3 bg-transparent text-slate-700 text-xs sm:text-[13px] font-medium focus:outline-none appearance-none cursor-pointer truncate"
                  >
                    <option value="">All Specializations</option>
                    {SPECIALIZATIONS.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-1 text-slate-400 text-xs">▼</div>
                </div>

                {/* Submit Search Button (2 cols) */}
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    id="hero-search-submit"
                    className="w-full bg-[#0D3829] hover:bg-[#08281D] active:scale-98 text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </form>

            {/* Trust Indicators Row below search */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-2 text-slate-600 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#0D3829] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Verified Professionals</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#0D3829] shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span>Trusted by Individuals &amp; Organizations</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#0D3829] shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <span>Statewide Coverage</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Image with Floating Glass Statistics (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Photo: Surveyor with Total Station and Helmet */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/4.2] group">
                <img
                  src="/src/assets/images/surveyor_hero_photo_1789567929216.jpg"
                  alt="Certified land surveyor operating total station in Kwara State"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                
                {/* APPSN vest label indicator */}
                <div className="absolute bottom-4 right-4 bg-emerald-950/75 backdrop-blur-md text-white text-[10px] uppercase font-mono px-3 py-1 rounded-full border border-white/20 tracking-widest font-bold">
                  APPSN FIELD OPERATIONS
                </div>
              </div>

              {/* Floating Stat Card matching reference design */}
              <div 
                className="absolute top-6 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200/90 w-52 sm:w-60 space-y-4 animate-in fade-in slide-in-from-right-4 duration-500"
                id="hero-stats-card"
              >
                {/* Stat 1: Registered Surveyors */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-[#0D3829] shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                      {stats.totalSurveyors > 0 ? `${stats.totalSurveyors}+` : '0'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Registered Surveyors
                    </div>
                  </div>
                </div>

                {/* Stat 2: LGAs Covered */}
                <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-[#0D3829] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                      {stats.lgasCovered}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      LGAs Covered
                    </div>
                  </div>
                </div>

                {/* Stat 3: Verified Professionals */}
                <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-[#0D3829] shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                      {stats.verifiedPercentage}%
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Verified Professionals
                    </div>
                  </div>
                </div>

                {/* Stat 4: Years of Combined Experience */}
                <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-[#0D3829] shrink-0">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                      {stats.totalExperienceYears}+
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Years of Combined Exp.
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
