import React from 'react';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

interface CtaBannerProps {
  onBrowseSurveyors: () => void;
  onLearnServices: () => void;
}

export default function CtaBanner({ onBrowseSurveyors, onLearnServices }: CtaBannerProps) {
  return (
    <section className="py-14 sm:py-20 bg-[#FAF9F5]" id="appsn-cta-banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container matching reference design */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0D3829] text-white shadow-2xl border border-emerald-950/20">
          
          {/* Panoramic Aerial Background Photo with dark green overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/src/assets/images/kwara_landscape_cta_1789567908819.jpg"
              alt="Aerial land surveying view of Kwara State"
              className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B251D] via-[#0D3829]/95 to-[#0B251D]/90" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 p-8 sm:p-14 lg:p-16 text-center max-w-3xl mx-auto space-y-6">
            
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-emerald-300 font-extrabold">
                GET STARTED TODAY
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              Find the Right Surveyor <br className="hidden sm:inline" />
              for Your Project
            </h2>

            {/* Subtitle */}
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
              Whether it's land acquisition, construction setting out, or property development — get connected with verified and registered practicing surveyors in Kwara State.
            </p>

            {/* Action Buttons matching design */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Primary White Button */}
              <button
                onClick={onBrowseSurveyors}
                id="cta-browse-surveyors-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 active:scale-98 text-[#0D3829] font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <span>Browse Surveyors</span>
                <ArrowRight className="w-4 h-4 text-[#0D3829] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Translucent Button */}
              <button
                onClick={onLearnServices}
                id="cta-learn-services-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white hover:bg-white/10 active:scale-98 text-white font-semibold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all duration-200 cursor-pointer"
              >
                <span>Learn About Our Services</span>
              </button>
            </div>

            {/* Micro Trust footnote */}
            <div className="pt-4 flex items-center justify-center gap-2 text-[11px] text-emerald-200/80 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>All listed practitioners are verified with the Surveyors Council of Nigeria (SURCON)</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
