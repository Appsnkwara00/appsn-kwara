import React from 'react';
import { Executive } from '../types';
import { ShieldCheck, ZoomIn } from 'lucide-react';

interface ExecutiveCardProps {
  key?: React.Key;
  executive: Executive;
  index?: number;
  onPreviewImage?: (imageUrl: string, title: string, subtitle?: string) => void;
}

export default function ExecutiveCard({ executive, index = 0, onPreviewImage }: ExecutiveCardProps) {
  const initial = executive.full_name
    ? executive.full_name.replace(/^(Surv\.|Engr\.|Mrs\.|Mr\.|Dr\.|Alhaji|\(Alh\))\s*/i, '').trim().charAt(0) || 'E'
    : 'E';

  return (
    <div
      id={`executive-card-${executive.id}`}
      className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-800/30 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group animate-card-entrance h-full"
      style={{
        animationDelay: `${Math.min(index * 90, 600)}ms`
      }}
    >
      {/* Photo frame with click-to-preview */}
      <div className="p-4 pb-0">
        <div 
          onClick={() => {
            if (executive.profile_image && onPreviewImage) {
              onPreviewImage(executive.profile_image, executive.full_name, `${executive.position} • APPSN Kwara`);
            }
          }}
          className="relative aspect-[4/3.5] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 cursor-zoom-in group/photo"
          title="Click to enlarge photo"
        >
          {executive.profile_image ? (
            <>
              <img
                src={executive.profile_image}
                alt={executive.full_name}
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
            {executive.position}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 group-hover:text-[#0D3829] transition-colors leading-snug">
            {executive.full_name}
          </h3>
          
          <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wide">
            {executive.position} • Executive Council
          </div>

          {executive.bio && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {executive.bio}
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
}
