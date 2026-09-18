import React from 'react';
import { EXECUTIVE_COMMITTEE } from '../data';
import { 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  Target, 
  Eye, 
  Compass, 
  CheckCircle2, 
  BookOpen, 
  Building2, 
  FileCheck
} from 'lucide-react';

interface AboutSectionProps {
  isHomePreview?: boolean;
  onLearnMore?: () => void;
  onContactClick?: () => void;
}

export default function AboutSection({ isHomePreview = false, onLearnMore, onContactClick }: AboutSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/70" id="appsn-about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-24">
        
        {/* Main 2-Column About Feature (Matches Reference Image Exactly) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Image with Floating Dark Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Surveyor Photo */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50 aspect-[4/3.8] bg-slate-100 group">
                <img
                  src="/src/assets/images/surveyor_hero_photo_1789567929216.jpg"
                  alt="APPSN Kwara professional surveyor"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />
              </div>

              {/* Floating Dark Green Badge matching design */}
              <div className="absolute -bottom-6 -left-3 sm:-left-6 bg-[#0D3829] text-white p-5 sm:p-6 rounded-2xl shadow-xl border border-white/10 max-w-xs space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/60 border border-emerald-700/50 flex items-center justify-center text-emerald-300 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold font-serif leading-tight">40+ Years</div>
                    <div className="text-xs text-emerald-200/80 font-medium">of Dedicated Service</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-900/60 text-[11px] text-emerald-100/90 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Certified SURCON Practitioners</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#0D3829] font-mono block">
                — ABOUT APPSN KWARA
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-serif font-bold text-[#0B251D] tracking-tight leading-[1.18]">
                Promoting Professionalism in the Surveying Profession
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              The Association of Private Practicing Surveyors of Nigeria (APPSN) Kwara State Branch is the premier professional body committed to upholding high ethical benchmarks, precision surveying, and public title security in private practice.
            </p>

            {/* 3 Value Rows matching the reference design */}
            <div className="space-y-4 pt-2">
              {/* Feature 1 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF9F5] border border-slate-200/60">
                <div className="w-8 h-8 rounded-xl bg-[#EBF4F0] text-[#0D3829] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Professional Integrity &amp; Standards</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Strict adherence to the Surveyors Council of Nigeria (SURCON) code of conduct and statutory cadastral mandates.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF9F5] border border-slate-200/60">
                <div className="w-8 h-8 rounded-xl bg-[#EBF4F0] text-[#0D3829] flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Capacity Development &amp; Modern Technology</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Continuous professional development in GNSS RTK positioning, GIS analytics, and photogrammetric drone survey.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF9F5] border border-slate-200/60">
                <div className="w-8 h-8 rounded-xl bg-[#EBF4F0] text-[#0D3829] flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Statewide Coverage &amp; Public Protection</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Direct access to licensed practitioners across all 16 Local Government Areas to prevent boundary disputes and fraud.
                  </p>
                </div>
              </div>
            </div>

            {/* Action button */}
            {isHomePreview && onLearnMore && (
              <div className="pt-3">
                <button
                  onClick={onLearnMore}
                  id="about-learn-more-btn"
                  className="inline-flex items-center gap-2 bg-[#0D3829] hover:bg-[#08281D] text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Extended Section (When viewed on the full About Us page) */}
        {!isHomePreview && (
          <div className="space-y-20 pt-8 border-t border-slate-100">
            
            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#FAF9F5] rounded-2xl p-7 border border-slate-200/70 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF4F0] text-[#0D3829] flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">Our Vision</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To build an orderly, legally secure, and technology-driven geospatial environment in Kwara State where land boundaries are indisputable, real estate investments thrive, and private surveying remains a trusted bedrock of societal planning.
                </p>
              </div>

              <div className="bg-[#FAF9F5] rounded-2xl p-7 border border-slate-200/70 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF4F0] text-[#0D3829] flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">Our Mission</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To unite registered private practicing surveyors, foster peer collaboration, eliminate quackery through stringent public awareness, and guarantee that every survey document originating from our members meets the highest statutory requirements.
                </p>
              </div>

              <div className="bg-[#FAF9F5] rounded-2xl p-7 border border-slate-200/70 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF4F0] text-[#0D3829] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">Core Values</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <strong>Accuracy:</strong> We believe millimeter precision matters. <br />
                  <strong>Integrity:</strong> Honest boundary demarcation without compromise. <br />
                  <strong>Ethics:</strong> Full compliance with SURCON scale of fees and professional ethics.
                </p>
              </div>
            </div>

            {/* Executive Committee Section */}
            <div className="space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[11px] font-bold text-[#0D3829] uppercase tracking-[0.2em] font-mono block">
                  LEADERSHIP &amp; GOVERNANCE
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  Branch Executive Committee
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Steering the affairs of the Association of Private Practicing Surveyors in Kwara State.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {EXECUTIVE_COMMITTEE.map((exec, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col items-center text-center space-y-4 hover:shadow-md hover:border-emerald-900/30 transition-all">
                    <div className="relative">
                      <img
                        src={exec.image}
                        alt={exec.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-[#0D3829] text-white rounded-full p-1 border border-white">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#0D3829] bg-[#EBF4F0] px-3 py-1 rounded-full uppercase font-mono tracking-wider">
                        {exec.role}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-2.5 leading-snug">
                        {exec.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 italic leading-relaxed bg-[#FAF9F5] rounded-xl p-3 border border-slate-100 w-full">
                      "{exec.msg}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Secretariat Information Banner */}
            <div className="bg-[#0D3829] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-300 font-bold">
                    Official Branch Secretariat
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    Need Guidance on Land Surveying in Kwara State?
                  </h3>
                  <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                    Our Secretariat is open to the public Monday through Friday. Whether you are dealing with a complex boundary clarification, looking to verify an existing survey plan, or reporting illegal surveying, our executive officers are here to support you.
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                  {onContactClick && (
                    <button
                      onClick={onContactClick}
                      className="bg-white text-[#0D3829] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-sm hover:bg-emerald-50 transition-colors text-center cursor-pointer"
                    >
                      Contact Secretariat
                    </button>
                  )}
                  <div className="text-xs text-emerald-200/90 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/60">
                    <p className="font-semibold text-white">Along Ikoyi Avenue, Off New Yidi Rd, Ilorin, Kwara.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
