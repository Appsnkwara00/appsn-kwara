import React, { useState } from 'react';
import { Executive } from '../types';
import { ShieldCheck, ZoomIn } from 'lucide-react';

interface ExecutiveCouncilProps {
  executives: Executive[];
  onPreviewImage?: (imageUrl: string, title: string, subtitle?: string) => void;
}

export default function ExecutiveCouncil({ executives, onPreviewImage }: ExecutiveCouncilProps) {
  // Sort executives: Chairman/President (1), Vice Chairman (2), Secretary (3)
  const sortedExecutives = [...executives].sort((a, b) => a.display_order - b.display_order);

  return (
    <section className="py-20 sm:py-24 bg-[#FAF9F5] border-t border-slate-200/60" id="executive-council">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#0D3829] text-xs font-mono font-bold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Branch Leadership</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            APPSN Kwara Executive Council
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The distinguished leadership driving professional ethics, cadastral excellence, and public interest protection across Kwara State.
          </p>
        </div>

        {/* Executive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-8">
          {sortedExecutives.map((exec, idx) => {
            const initial = exec.full_name
              ? exec.full_name.replace(/^(Surv\.|Engr\.|Mrs\.|Mr\.|Dr\.|Alhaji|\(Alh\))\s*/i, '').trim().charAt(0) || 'E'
              : 'E';

            return (
              <div
                key={exec.id}
                id={`executive-card-${exec.id}`}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-800/30 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group animate-card-entrance"
                style={{
                  animationDelay: `${idx * 120}ms`
                }}
              >
                {/* Photo frame with click-to-preview */}
                <div className="p-4 pb-0">
                  <div 
                    onClick={() => {
                      if (exec.profile_image && onPreviewImage) {
                        onPreviewImage(exec.profile_image, exec.full_name, `${exec.position} • APPSN Kwara`);
                      }
                    }}
                    className="relative aspect-[4/3.5] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 cursor-zoom-in group/photo"
                    title="Click to enlarge photo"
                  >
                    {exec.profile_image ? (
                      <>
                        <img
                          src={exec.profile_image}
                          alt={exec.full_name}
                          className="w-full h-full object-cover object-center group-hover/photo:scale-105 transition-transform duration-500 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-black/60 backdrop-blur-xs text-white p-2.5 rounded-full transform scale-90 group-hover/photo:scale-100 transition-transform">
                            <ZoomIn className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#EBF4F0] to-[#d8ece2] text-[#0D3829]">
                        <div className="w-16 h-16 rounded-full bg-[#0D3829] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
                          {initial}
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#0D3829]/80 font-bold mt-2">
                          APPSN KWARA
                        </span>
                      </div>
                    )}

                    {/* Position Pill */}
                    <div className="absolute top-3 left-3 bg-[#0D3829]/90 backdrop-blur-md text-emerald-300 text-[11px] font-mono uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-sm">
                      {exec.position}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 group-hover:text-[#0D3829] transition-colors leading-snug">
                      {exec.full_name}
                    </h3>
                    
                    <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wide">
                      {exec.position} • Executive Council
                    </div>

                    {exec.bio && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                        {exec.bio}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      SURCON Verified
                    </span>
                    <span>APPSN Kwara State</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
