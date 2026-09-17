import React from 'react';
import { 
  ShieldCheck, FileCheck, AlertTriangle, Stamp, 
  MapPin, CheckCircle2, Search, ArrowRight, Lock
} from 'lucide-react';

interface VerificationGuideProps {
  onSearchSurveyor?: () => void;
}

export default function VerificationGuide({ onSearchSurveyor }: VerificationGuideProps) {
  return (
    <section className="py-20 sm:py-24 bg-white border-t border-slate-200/60" id="verification-guide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Why Hire an APPSN Surveyor & Verification Guide
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Securing genuine survey documentation is the most important legal defense for your real estate investments in Kwara State. Understand your rights and how to verify legitimate practitioners.
          </p>
        </div>

        {/* 4 Core Pillars of Statutory Protection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#FAF9F5] rounded-2xl p-6 border border-slate-200/80 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-[#0D3829]" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              Legal Court Admissibility
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Only survey plans prepared, signed, and sealed by SURCON-registered surveyors are recognized as legal evidence in Nigerian courts and Kwara State registries.
            </p>
          </div>

          <div className="bg-[#FAF9F5] rounded-2xl p-6 border border-slate-200/80 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <Stamp className="w-6 h-6 text-[#0D3829]" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              Authentic Red Seal & Beacons
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every genuine boundary demarcation is monumented with traceable survey beacons bearing registered surveyor identification and strict geodetic coordinates.
            </p>
          </div>

          <div className="bg-[#FAF9F5] rounded-2xl p-6 border border-slate-200/80 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6 text-[#0D3829]" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              Zero Tolerance for Quackery
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlicensed practitioners cause destructive land disputes, boundary overlaps, and loss of property. APPSN membership guarantees authenticated professional accountability.
            </p>
          </div>

          <div className="bg-[#FAF9F5] rounded-2xl p-6 border border-slate-200/80 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <FileCheck className="w-6 h-6 text-[#0D3829]" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              Official Survey Lodgement
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Survey records are officially lodged with the Kwara State Office of the Surveyor-General, safeguarding your land title in government cadastral archives permanently.
            </p>
          </div>

        </div>

        {/* Verification Steps Card */}
        <div className="bg-gradient-to-br from-[#0B251D] via-[#0D3829] to-[#124b37] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            
            <div className="text-center space-y-2">
              <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">
                Citizen Checklist
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                How to Verify a Surveyor in 3 Simple Steps
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400 text-[#0B251D] font-bold font-mono text-sm flex items-center justify-center">
                  1
                </div>
                <h4 className="font-serif font-bold text-base text-white">
                  Request Full Name & SURCON Reg.
                </h4>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Ask the surveyor for their full name and statutory SURCON license registration number.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400 text-[#0B251D] font-bold font-mono text-sm flex items-center justify-center">
                  2
                </div>
                <h4 className="font-serif font-bold text-base text-white">
                  Search the APPSN Kwara Directory
                </h4>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Use the directory search on this portal to cross-reference their credentials, company name, and LGA practice location.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400 text-[#0B251D] font-bold font-mono text-sm flex items-center justify-center">
                  3
                </div>
                <h4 className="font-serif font-bold text-base text-white">
                  Inspect Red Seal & Pillars
                </h4>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Confirm the official red seal on the survey document and ensure beacon numbers match the surveyed plot before final land payments.
                </p>
              </div>

            </div>

            {/* Quick Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onSearchSurveyor}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-[#0B251D] font-bold text-xs sm:text-sm py-3.5 px-8 rounded-full transition-colors cursor-pointer shadow-lg active:scale-98"
              >
                <Search className="w-4 h-4" />
                <span>Verify a Surveyor on this Portal</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
