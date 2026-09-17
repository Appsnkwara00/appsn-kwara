import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  setView: (view: string) => void;
  currentView: string;
}

export default function Footer({ setView, currentView }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'directory', label: 'Find a Surveyor' },
    { id: 'aims', label: 'Aims & Objectives' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About Us' },
    { id: 'resources', label: 'Resources' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (viewId: string) => {
    if (viewId === 'aims') {
      if (currentView !== 'home') {
        setView('home');
        setTimeout(() => {
          const el = document.getElementById('aims-and-objectives');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.getElementById('aims-and-objectives');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B251D] text-slate-300 text-xs sm:text-sm border-t border-emerald-950" id="appsn-footer">
      
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Brand & Organization Column (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-full overflow-hidden border border-emerald-800/80 bg-white p-0.5 shrink-0 shadow-sm">
                <img 
                  src="/logo.png" 
                  alt="APPSN Kwara Official Seal" 
                  className="object-contain w-full h-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-white font-serif font-bold text-xl tracking-tight block leading-tight">
                  APPSN Kwara
                </span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-300 font-semibold block leading-tight mt-0.5">
                  ASSOCIATION OF PRIVATE PRACTICING SURVEYORS OF NIGERIA
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md pt-1">
              The official professional body representing registered, licensed, and private practicing surveyors across Kwara State under the aegis of the Nigerian Institution of Surveyors (NIS) and Surveyors Council of Nigeria (SURCON).
            </p>
          </div>

          {/* Quick Navigation Links (3 Cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`transition-colors cursor-pointer text-left hover:text-white ${
                      currentView === link.id ? 'text-emerald-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Secretariat Contact (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              State Secretariat
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-300">
                  Along Ikoyi Avenue, Off New Yidi Rd, Ilorin, Kwara.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+2349137550602" className="font-mono text-slate-300 hover:text-emerald-300 transition-colors">
                  +2349137550602
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:appsnkwara@gmail.com" className="text-slate-300 hover:text-emerald-300 transition-colors">
                  appsnkwara@gmail.com
                </a>
              </div>
            </div>

            {/* Script Slogan */}
            <div className="pt-2">
              <span className="font-script text-2xl text-emerald-200/90 block leading-tight">
                Accurate Surveys. Better Decisions.
              </span>
            </div>
          </div>

        </div>

        {/* Bottom divider & copyright bar */}
        <div className="mt-12 pt-8 border-t border-emerald-900/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            © {currentYear} APPSN Kwara State Branch. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-300 font-mono">SURCON Regulated</span>
            <span>•</span>
            <span className="text-slate-400">Kwara State GIS Compliant</span>
            <span>•</span>
            <a 
              href="/sitemap.xml" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-emerald-300 transition-colors underline decoration-emerald-900/50"
            >
              XML Sitemap
            </a>
            <span>•</span>
            <a 
              href="https://kwara.gov.ng" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Kwara.gov.ng
            </a>
          </div>
        </div>

      </div>

    </footer>
  );
}
