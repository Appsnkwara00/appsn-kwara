import React from 'react';
import { Executive } from '../types';
import ExecutiveCard from './ExecutiveCard';
import { 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Users 
} from 'lucide-react';

interface ExecutivesPageProps {
  executives: Executive[];
  onPreviewImage?: (imageUrl: string, title: string, subtitle?: string) => void;
  onNavigateHome?: () => void;
  onFindSurveyor?: () => void;
  onContact?: () => void;
}

export default function ExecutivesPage({
  executives,
  onPreviewImage,
  onNavigateHome,
  onFindSurveyor,
  onContact
}: ExecutivesPageProps) {
  // Pull all active executives dynamically, sorted by display_order
  const activeExecutives = [...executives]
    .filter(e => e.is_active !== false && e.active !== false)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10 sm:py-16" id="view-executives-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500" aria-label="Breadcrumb">
          <a
            href="/home"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateHome) onNavigateHome();
            }}
            className="hover:text-[#0D3829] transition-colors cursor-pointer"
          >
            Home
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#0D3829] font-bold">Executive Council</span>
        </nav>

        {/* Clean Page Header */}
        <div className="border-b border-slate-200/80 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#0D3829] text-xs font-mono font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Leadership &amp; Governance</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#0B251D] tracking-tight leading-tight">
              APPSN Executive Council
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Meet the executive council responsible for representing and advancing the interests of private practicing surveyors across Kwara State.
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-2xs text-[#0D3829] text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeExecutives.length} Active Council {activeExecutives.length === 1 ? 'Officer' : 'Officers'}</span>
            </span>
          </div>
        </div>

        {/* Dynamic Executives Grid (Accommodates 3, 6, 10, or more executives seamlessly) */}
        {activeExecutives.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-xs space-y-4">
            <Users className="w-12 h-12 text-emerald-800 mx-auto opacity-70" />
            <h3 className="text-lg font-serif font-bold text-slate-900">Executive Directory Loading</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Retrieving the latest executive council records from the APPSN Kwara State database...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {activeExecutives.map((exec, idx) => (
              <ExecutiveCard
                key={exec.id}
                executive={exec}
                index={idx}
                onPreviewImage={onPreviewImage}
              />
            ))}
          </div>
        )}

        {/* Secretariat Advisory Banner */}
        <div className="bg-[#0D3829] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden mt-12 sm:mt-16">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300 font-bold">
                APPSN Kwara State Branch Secretariat
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Need Official Assistance or Inquiries?
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                The APPSN Kwara Executive Council works directly with the public, government authorities, and registered practitioners to ensure that all boundary demarcations, cadastral surveys, and beacon placements in Kwara State conform with SURCON statutory benchmarks.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              {onFindSurveyor && (
                <button
                  type="button"
                  onClick={onFindSurveyor}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-[#08281D] font-bold text-xs sm:text-sm py-3.5 px-6 rounded-full shadow-md transition-all cursor-pointer group"
                >
                  <Search className="w-4 h-4" />
                  <span>Find a Registered Surveyor</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {onContact && (
                <button
                  type="button"
                  onClick={onContact}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs sm:text-sm py-3.5 px-6 rounded-full transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-emerald-300" />
                  <span>Contact Secretariat</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
