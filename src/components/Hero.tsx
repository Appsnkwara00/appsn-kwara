import React from 'react';
import { Search, MapPin, ArrowRight, ShieldCheck, Users, Globe, Building2 } from 'lucide-react';
import { KWARA_LGAS } from '../data';
import heroSurveyorImage from '../assets/images/surveyor_hero_photo_1789567929216.jpg';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLga: string;
  setSelectedLga: (lga: string) => void;
  selectedSpecialization?: string;
  setSelectedSpecialization?: (spec: string) => void;
  onSearch: () => void;
  onReset?: () => void;
  totalCount?: number;
  stats?: {
    totalSurveyors: number;
    lgasCovered: number;
    verifiedPercentage: number;
  };
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedLga,
  setSelectedLga,
  onSearch,
  stats = {
    totalSurveyors: 60,
    lgasCovered: 16,
    verifiedPercentage: 100
  }
}: HeroProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section className="relative bg-[#FAF9F5] text-slate-800 overflow-hidden" id="appsn-hero">
      
      {/* Top Hero Area with Full-Screen Landscape Image Backdrop */}
      <div className="relative overflow-hidden">
        {/* Full-bleed Landscape Hero Image spanning across the screen with organic dissolve */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          {/* Full-width landscape container anchored to the right side */}
          <div 
            className="absolute inset-y-0 right-0 w-full md:w-[75%] lg:w-[68%] xl:w-[62%] 2xl:w-[58%] h-full"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 95% 90% at 75% 50%, black 40%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0.05) 90%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 95% 90% at 75% 50%, black 40%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0.05) 90%, transparent 100%)'
            }}
          >
            <img
              src={heroSurveyorImage}
              alt="APPSN Kwara registered land surveyor conducting field survey with total station"
              className="w-full h-full object-cover object-[78%_center] lg:object-[72%_center]"
              referrerPolicy="no-referrer"
            />

            {/* Organic Cream Overlays for Natural Feathered Dissolve into #FAF9F5 */}
            {/* 1. Curved radial blend from center-left towards the photograph */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 70% 85% at 5% 50%, #FAF9F5 25%, rgba(250, 249, 245, 0.92) 50%, rgba(250, 249, 245, 0.45) 72%, transparent 100%)'
              }}
            />

            {/* 2. Soft horizontal dissolve into the cream background */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, #FAF9F5 0%, rgba(250, 249, 245, 0.98) 18%, rgba(250, 249, 245, 0.65) 38%, rgba(250, 249, 245, 0.15) 58%, transparent 78%)'
              }}
            />

            {/* 3. Soft bottom feathering into solid cream above OUR IMPACT */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, #FAF9F5 0%, rgba(250, 249, 245, 0.6) 6%, transparent 18%, transparent 75%, rgba(250, 249, 245, 0.85) 90%, #FAF9F5 100%)'
              }}
            />

            {/* Mobile subtle overlay to guarantee pristine readability on small screens */}
            <div className="absolute inset-0 bg-[#FAF9F5]/75 md:hidden" />
          </div>
        </div>

        {/* Topographic Survey Contour Lines Background */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-40 z-0">
          <svg 
            className="absolute top-0 right-0 w-[1100px] h-[720px] text-[#0D3829] opacity-[0.06] stroke-current fill-none transform translate-x-1/4 -translate-y-12"
            viewBox="0 0 1000 700" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M50,150 C250,50 450,220 700,100 C880,10 950,90 1050,40" strokeWidth="1.5" />
            <path d="M0,220 C200,120 400,280 650,180 C850,90 920,160 1050,110" strokeWidth="1.5" />
            <path d="M0,300 C180,200 380,360 620,260 C800,180 880,240 1050,190" strokeWidth="1.5" />
            <path d="M-50,380 C150,280 350,440 590,340 C770,260 850,320 1050,270" strokeWidth="1.5" />
            <path d="M-50,460 C120,360 320,520 560,420 C740,340 820,400 1050,350" strokeWidth="1.5" />
            <path d="M-80,540 C90,440 290,600 530,500 C710,420 790,480 1050,430" strokeWidth="1.5" />
            <path d="M-80,620 C60,520 260,680 500,580 C680,500 760,560 1050,510" strokeWidth="1.5" />
            <circle cx="750" cy="180" r="140" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <circle cx="750" cy="180" r="220" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          </svg>
        </div>

        {/* Main Hero Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Subtitle, Search Bar, Trust Badges (7 cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7 z-10">
              
              {/* Tagline / Eyebrow */}
              <div className="inline-flex items-center">
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#0A261D] uppercase">
                  TRUSTED &nbsp;/&nbsp; VERIFIED &nbsp;/&nbsp; PROFESSIONAL
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-serif font-bold text-[#0A261D] tracking-tight leading-[1.08]">
                Find a Registered <br />
                Surveyor in Kwara
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-sm sm:text-[15px] lg:text-base leading-relaxed max-w-xl font-normal">
                Connect with verified and registered practising surveyors across Kwara State. Get professional support for your land, property and construction needs.
              </p>

              {/* Floating Search & Filter Bar */}
              <form 
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/90 p-2 sm:p-2.5 max-w-2xl transition-all hover:border-slate-300"
                id="hero-search-form"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  
                  {/* Search Text Input */}
                  <div className="relative flex-1 flex items-center min-w-0">
                    <Search className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none shrink-0" />
                    <input
                      id="hero-search-input"
                      type="text"
                      placeholder="Search by name, SURCON reg number or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-xs sm:text-[13px] font-medium"
                    />
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden sm:block w-px h-8 bg-slate-200 shrink-0" />

                  {/* LGA Dropdown */}
                  <div className="relative sm:w-44 flex items-center shrink-0 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 pl-1 sm:pl-1">
                    <MapPin className="absolute left-3 text-slate-400 w-4 h-4 pointer-events-none shrink-0" />
                    <select
                      id="hero-lga-select"
                      value={selectedLga}
                      onChange={(e) => setSelectedLga(e.target.value)}
                      className="w-full pl-9 pr-7 py-3 bg-transparent text-slate-700 text-xs sm:text-[13px] font-medium focus:outline-none appearance-none cursor-pointer truncate"
                    >
                      <option value="">All LGAs</option>
                      {KWARA_LGAS.map((lga) => (
                        <option key={lga} value={lga}>{lga}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 text-slate-400 text-xs">▼</div>
                  </div>

                  {/* Search Action Button */}
                  <button
                    type="submit"
                    id="hero-search-submit"
                    className="bg-[#0B251D] hover:bg-[#061913] active:scale-98 text-white font-medium py-3 px-6 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-emerald-950/20 transition-all duration-300 cursor-pointer shrink-0 group relative overflow-hidden"
                  >
                    <span className="relative z-10 font-semibold tracking-wide">Search</span>
                    <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 via-emerald-400/20 to-emerald-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                  </button>

                </div>
              </form>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-2 text-slate-700 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0A261D]" />
                  <span>Verified Professionals</span>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0A261D]" />
                  <span>Trusted by Individuals &amp; Organizations</span>
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0A261D]" />
                  <span>Statewide Coverage</span>
                </div>
              </div>

            </div>

            {/* Right Column: Handwritten Script & Location Tag (5 cols) */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex flex-col items-center lg:items-end justify-between min-h-[160px] sm:min-h-[220px] lg:min-h-[420px] pointer-events-none">
              
              {/* Cursive Handwriting Script: "Accurate Surveys. Better Decisions." */}
              {/* Shifted towards top right with high contrast & visibility against image backdrop */}
              <div className="w-full text-center lg:text-right pr-0 lg:pr-2 xl:pr-4 -mt-2 lg:-mt-10 select-none animate-float-delayed">
                <div className="inline-block relative">
                  {/* Subtle soft backdrop glow for crisp legibility over sky/trees */}
                  <div className="absolute -inset-2 bg-white/40 backdrop-blur-[2px] rounded-2xl -rotate-1 pointer-events-none -z-10 shadow-xs" />
                  
                  <span 
                    className="font-['Caveat',cursive] text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] text-slate-900 tracking-tight block leading-[1.1] -rotate-2 transform font-extrabold"
                    style={{
                      textShadow: '0 1px 3px rgba(255,255,255,0.9), 0 2px 10px rgba(255,255,255,0.7), 0 0 1px rgba(0,0,0,0.4)'
                    }}
                  >
                    Accurate Surveys.<br />
                    <span className="text-[#0B251D]">Better Decisions.</span>
                  </span>
                </div>
              </div>

              {/* Floating Location Tag (Pill) anchored elegantly with gentle float animation */}
              <div className="mt-auto pointer-events-auto animate-float">
                <div 
                  className="bg-slate-900/65 hover:bg-slate-900/80 backdrop-blur-md border border-white/20 hover:border-emerald-400/40 text-white text-[11.5px] font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                  <span>Kwara State, Nigeria</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Dark Forest Green Ribbon: OUR IMPACT (Professional Surveyors. Real Impact.) */}
      {/* Kept 100% intact, crisp, distinct, and completely free from any background image bleed */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 pt-2">
        <div className="bg-[#0B251D] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            
            {/* Left Header in Impact Box (4 cols) */}
            <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-emerald-800/40 pb-6 lg:pb-0 lg:pr-6">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px] uppercase tracking-widest">
                <span className="w-5 h-0.5 bg-amber-400 rounded-full inline-block"></span>
                <span>OUR IMPACT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-serif font-bold text-white tracking-tight leading-snug">
                Professional Surveyors. <br />
                Real Impact.
              </h2>
            </div>

            {/* 3 Stat Columns in Impact Box (8 cols) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 lg:pl-6">
              
              {/* Stat 1: Registered Surveyors */}
              <div className="flex items-start gap-3 group transition-transform duration-300 hover:translate-x-1 cursor-default">
                <div className="w-10 h-10 rounded-full border border-emerald-600/40 bg-emerald-900/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5 group-hover:scale-110 group-hover:border-emerald-400/60 transition-all duration-300">
                  <Users className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {stats.totalSurveyors > 0 ? `${stats.totalSurveyors}+` : '60+'}
                  </div>
                  <div className="text-xs font-semibold text-white mt-1 leading-snug">
                    Registered Surveyors
                  </div>
                  <div className="text-[11px] text-emerald-300/70 font-normal leading-tight mt-0.5">
                    Across Kwara State
                  </div>
                </div>
              </div>

              {/* Stat 2: Local Government Areas */}
              <div className="flex items-start gap-3 group transition-transform duration-300 hover:translate-x-1 cursor-default">
                <div className="w-10 h-10 rounded-full border border-emerald-600/40 bg-emerald-900/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5 group-hover:scale-110 group-hover:border-emerald-400/60 transition-all duration-300">
                  <MapPin className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {stats.lgasCovered || 16}
                  </div>
                  <div className="text-xs font-semibold text-white mt-1 leading-snug">
                    Local Government Areas
                  </div>
                  <div className="text-[11px] text-emerald-300/70 font-normal leading-tight mt-0.5">
                    Full State Coverage
                  </div>
                </div>
              </div>

              {/* Stat 3: Verified Professionals */}
              <div className="flex items-start gap-3 group transition-transform duration-300 hover:translate-x-1 cursor-default">
                <div className="w-10 h-10 rounded-full border border-emerald-600/40 bg-emerald-900/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5 group-hover:scale-110 group-hover:border-emerald-400/60 transition-all duration-300">
                  <ShieldCheck className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {stats.verifiedPercentage}%
                  </div>
                  <div className="text-xs font-semibold text-white mt-1 leading-snug">
                    Verified Professionals
                  </div>
                  <div className="text-[11px] text-emerald-300/70 font-normal leading-tight mt-0.5">
                    Registered &amp; Accredited
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
