import React, { useState } from 'react';
import { 
  FileCheck, 
  HelpCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ExternalLink,
  Download,
  BookOpen,
  Compass
} from 'lucide-react';

export default function ResourcesSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I know if a surveyor is registered with SURCON?",
      a: "Every genuine private practicing surveyor possesses an official SURCON registration number (e.g. SURCON BJ/1234 or SURV/...) and is registered under the Kwara State branch of APPSN. You can search by name or registration number directly in this directory or verify at the APPSN Secretariat, Along Ikoyi Avenue, Off New Yidi Rd, Ilorin, Kwara."
    },
    {
      q: "What is the importance of the Surcon Seal on a survey plan?",
      a: "The Surcon seal is the mandatory statutory stamp impressed on an authentic survey plan. It certifies that the boundary demarcation was conducted under the direct supervision of a licensed registered surveyor who assumes legal liability for the coordinates and measurements. A plan without a valid Surcon seal and live signature is illegal and cannot be used for a Certificate of Occupancy (C of O)."
    },
    {
      q: "Can I use an unregistered surveyor or draftsman for my land?",
      a: "No. Employing an uncertified individual (quack) is dangerous and illegal. Plans prepared by non-licensed individuals cannot be registered with the Kwara State Geographic Information Service (KW-GIS), can lead to severe boundary litigation, and may result in the forfeiture of your real estate investments."
    },
    {
      q: "What are Beacon Pillars and why must they be protected?",
      a: "Beacon pillars are concrete markers embedded at the corner points of your boundary with unique identification numbers registered with the Surveyor General. Defacing, shifting, or removing boundary beacons is a criminal offense under Nigerian surveying law."
    },
    {
      q: "What is the procedure for surveying land in Kwara State?",
      a: "1. Engage a certified APPSN registered surveyor. 2. Conduct a field reconnaissance and coordinate perimeter pickup. 3. Chart coordinates to verify non-encroachment on government acquisition. 4. Plant official beacon pillars. 5. Produce, seal, and lodge the survey plan with the Surveyor General's office."
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF9F5]" id="appsn-resources">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#0D3829] font-mono block">
            — PUBLIC ADVISORY &amp; GUIDES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#0B251D] tracking-tight leading-tight">
            Surveying Resources &amp; Citizen Guide
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Essential information, statutory checklists, and legal guidance for land buyers, property developers, and real estate investors in Kwara State.
          </p>
        </div>

        {/* 3 Practical Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: 4 Steps to Secure Land */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4 animate-card-entrance" style={{ animationDelay: '0ms' }}>
            <div className="w-11 h-11 rounded-xl bg-[#EBF4F0] text-[#0D3829] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Land Due Diligence Checklist
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Verify practitioner in the APPSN Kwara registered directory.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Request on-site coordinate pickup using GNSS instruments.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Confirm land is free from Kwara State agricultural &amp; corridor reservations.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ensure beacon numbers match the coordinates on your certified plan.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Anatomy of Genuine Survey Plan */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4 animate-card-entrance" style={{ animationDelay: '100ms' }}>
            <div className="w-11 h-11 rounded-xl bg-[#EBF4F0] text-[#0D3829] flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Anatomy of an Authentic Plan
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Surcon Seal:</strong> Raised official seal and imprint of the registered surveyor.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>SURCON Number:</strong> Official license code of the surveyor.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Beacon Numbers:</strong> Standard alphanumeric Kwara beacon codes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>KW-GIS Record:</strong> Lodgement record in state cadastral database.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Warning Against Quackery */}
          <div className="bg-white rounded-2xl p-7 border border-amber-200/80 bg-gradient-to-b from-amber-50/20 to-white shadow-xs space-y-4 animate-card-entrance" style={{ animationDelay: '200ms' }}>
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Avoid Illegal Surveyors
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anyone without a genuine SURCON license who prepares layout plans, conducts perimeter surveys, or issues survey documents commits a criminal act punishable by law.
            </p>
            <div className="pt-2 text-xs font-semibold text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
              Report suspicious activities to the APPSN Hotline: <strong>+2349137550602</strong>
            </div>
          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs max-w-4xl mx-auto space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif font-bold text-slate-900">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-500">
              Quick answers about private land surveying in Kwara State.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex justify-between items-center gap-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-slate-900 leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0D3829]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-[#FAF9F5]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
