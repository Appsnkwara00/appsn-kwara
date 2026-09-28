import React from 'react';
import { AimObjective } from '../types';
import { 
  Users, ShieldCheck, Landmark, Award, GraduationCap, 
  Globe, Scale, BookOpen, FileCheck, CheckCircle2, 
  Compass, ChevronRight 
} from 'lucide-react';

interface AimsObjectivesProps {
  aims: AimObjective[];
}

// Icon mapper for aim objectives
function getAimIcon(iconName: string) {
  switch (iconName) {
    case 'Users':
      return <Users className="w-5 h-5 text-emerald-800" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-5 h-5 text-emerald-800" />;
    case 'Landmark':
      return <Landmark className="w-5 h-5 text-emerald-800" />;
    case 'Award':
      return <Award className="w-5 h-5 text-emerald-800" />;
    case 'GraduationCap':
      return <GraduationCap className="w-5 h-5 text-emerald-800" />;
    case 'Globe':
      return <Globe className="w-5 h-5 text-emerald-800" />;
    case 'Scale':
      return <Scale className="w-5 h-5 text-emerald-800" />;
    case 'BookOpen':
      return <BookOpen className="w-5 h-5 text-emerald-800" />;
    case 'FileCheck':
      return <FileCheck className="w-5 h-5 text-emerald-800" />;
    case 'CheckCircle2':
    default:
      return <CheckCircle2 className="w-5 h-5 text-emerald-800" />;
  }
}

export default function AimsObjectives({ aims }: AimsObjectivesProps) {
  const sortedAims = [...aims].sort((a, b) => a.display_order - b.display_order);

  return (
    <section className="py-20 sm:py-24 bg-white border-t border-slate-200/60" id="aims-and-objectives">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            APPSN Kwara Aims & Objectives
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            The Association is committed to promoting excellence in the surveying and geoinformatics profession while representing and protecting the interests of private practicing surveyors in Nigeria. Its aims and objectives are to:
          </p>
        </div>

        {/* 10 Objectives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAims.map((aim, idx) => (
            <div
              key={aim.id}
              id={`aim-item-${aim.display_order}`}
              className="bg-[#FAF9F5] rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-800/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between group animate-card-entrance"
              style={{
                animationDelay: `${Math.min(idx * 70, 500)}ms`
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {getAimIcon(aim.icon)}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {String(aim.display_order).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-base font-serif font-bold text-slate-900 group-hover:text-[#0D3829] transition-colors leading-snug">
                  {aim.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {aim.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-1 text-[11px] font-mono text-emerald-800 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Official Mandate</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#0B251D] to-[#0D3829] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-serif font-bold text-white">
              Upholding Survey Integrity Across Kwara State
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
              Always verify your surveyor before commissioning boundary demarcations, topographical surveys, or layout subdivision charting.
            </p>
          </div>
          <a
            href="#directory"
            className="shrink-0 bg-white hover:bg-slate-100 text-[#0D3829] font-bold text-xs uppercase font-mono tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-98"
          >
            Find Registered Surveyor
          </a>
        </div>

      </div>
    </section>
  );
}
