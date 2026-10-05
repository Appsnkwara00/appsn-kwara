import React, { useMemo } from 'react';
import { Executive } from '../types';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import ExecutiveCard from './ExecutiveCard';

interface ExecutiveCouncilProps {
  executives: Executive[];
  onPreviewImage?: (imageUrl: string, title: string, subtitle?: string) => void;
  onViewAll?: () => void;
}

export default function ExecutiveCouncil({ executives, onPreviewImage, onViewAll }: ExecutiveCouncilProps) {
  // Homepage displays only the 3 major executives: Chairman, Vice Chairman, Secretary
  const majorExecutives = useMemo(() => {
    // Filter active executives
    const active = executives.filter(e => e.is_active !== false && e.active !== false);
    const sorted = [...active].sort((a, b) => a.display_order - b.display_order);

    // Identify Chairman / President
    const chairman = sorted.find(e => /chairman|president/i.test(e.position) && !/vice/i.test(e.position)) || sorted[0];
    // Identify Vice Chairman / Vice President
    const vice = sorted.find(e => /vice/i.test(e.position)) || sorted.find(e => e.id !== chairman?.id);
    // Identify Secretary
    const secretary = sorted.find(e => /secretary/i.test(e.position)) || sorted.find(e => e.id !== chairman?.id && e.id !== vice?.id);

    const picked: Executive[] = [];
    if (chairman) picked.push(chairman);
    if (vice && !picked.some(e => e.id === vice.id)) picked.push(vice);
    if (secretary && !picked.some(e => e.id === secretary.id)) picked.push(secretary);

    // If fewer than 3 found, backfill from remaining sorted executives up to 3
    for (const item of sorted) {
      if (picked.length >= 3) break;
      if (!picked.some(e => e.id === item.id)) picked.push(item);
    }

    return picked.sort((a, b) => a.display_order - b.display_order);
  }, [executives]);

  return (
    <section className="py-20 sm:py-24 bg-[#FAF9F5] border-t border-slate-200/60" id="executive-council">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            APPSN Kwara Executive Council
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The distinguished leadership driving professional ethics, cadastral excellence, and public interest protection across Kwara State.
          </p>
        </div>

        {/* Executive Cards Grid (3 Major Executives on Homepage) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-8">
          {majorExecutives.map((exec, idx) => (
            <ExecutiveCard
              key={exec.id}
              executive={exec}
              index={idx}
              onPreviewImage={onPreviewImage}
            />
          ))}
        </div>

        {/* View All Executives Button */}
        {onViewAll && (
          <div className="mt-12 sm:mt-14 text-center">
            <a
              href="/executives"
              onClick={(e) => {
                e.preventDefault();
                onViewAll();
              }}
              className="inline-flex items-center justify-center gap-2.5 bg-[#0D3829] hover:bg-[#08281D] text-white text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group w-full sm:w-auto"
              id="btn-view-all-executives"
            >
              <span>View All Executives</span>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}

      </div>
    </section>
  );
}
