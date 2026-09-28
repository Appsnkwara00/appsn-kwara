import React, { useState } from 'react';
import { Menu, X, Search, SlidersHorizontal, Compass, ArrowRight } from 'lucide-react';
import { getPathForView } from '../lib/routes';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  onQuickSearchClick?: () => void;
}

export default function Navbar({ 
  currentView, 
  setView, 
  onQuickSearchClick 
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'directory', label: 'Find a Surveyor' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About Us' },
    { id: 'resources', label: 'Resources' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (viewId: string) => {
    setIsOpen(false);
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
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-50 transition-all shadow-xs" id="appsn-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo & Brand Identity */}
          <a 
            href="/home"
            className="flex items-center gap-3 cursor-pointer group select-none" 
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            id="nav-logo-brand"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-emerald-950/15 bg-white p-0.5 shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/logo.png" 
                alt="APPSN Kwara State Official Seal" 
                className="object-contain w-full h-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-lg font-extrabold text-[#0D3829] tracking-tight block leading-tight font-serif">
                APPSN Kwara
              </span>
              <span className="text-[8.5px] uppercase tracking-wider text-slate-500 font-semibold block leading-tight mt-0.5">
                ASSOCIATION OF PRIVATE PRACTICING SURVEYORS OF NIGERIA, KWARA STATE
              </span>
            </div>
          </a>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'directory' && currentView === 'directory');
              return (
                <a
                  key={item.id}
                  id={`nav-${item.id}`}
                  href={getPathForView(item.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`transition-colors py-2 px-1 relative cursor-pointer text-[13.5px] inline-block ${
                    isActive
                      ? 'text-[#0D3829] font-bold'
                      : 'text-slate-600 hover:text-[#0D3829]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-[#0D3829] rounded-full animate-in fade-in duration-200" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Search */}
            <button
              id="nav-search-btn"
              onClick={() => {
                if (onQuickSearchClick) onQuickSearchClick();
                else handleNavClick('directory');
              }}
              title="Search Directory"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-[#0D3829] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Filter */}
            <button
              id="nav-filter-btn"
              onClick={() => handleNavClick('directory')}
              title="Filter Surveyors by LGA & Specialization"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-[#0D3829] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Find Surveyor Direct Action Button */}
            <a
              id="nav-find-surveyor-btn"
              href="/find-a-surveyor"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('directory');
              }}
              className="flex items-center gap-2 bg-[#0B251D] hover:bg-[#071913] active:scale-95 text-white text-xs font-semibold px-4.5 py-2.5 rounded-full shadow-xs hover:shadow-md hover:shadow-emerald-950/20 transition-all duration-300 cursor-pointer group relative overflow-hidden"
            >
              <span className="relative z-10">Find Surveyor</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 via-emerald-400/20 to-emerald-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            </a>
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-[#0D3829] hover:bg-slate-100 transition-all cursor-pointer"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top-3 duration-200">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (item.id === 'directory' && currentView === 'directory');
            return (
              <a
                key={item.id}
                id={`mobile-nav-${item.id}`}
                href={getPathForView(item.id)}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-[#0D3829] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          
          <div className="h-[1px] bg-slate-100 my-3"></div>
          
          <a
            id="mobile-nav-directory"
            href="/find-a-surveyor"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('directory');
            }}
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#0D3829] text-white font-semibold rounded-xl text-sm shadow-xs hover:bg-[#09281D]"
          >
            <Search className="w-4 h-4 text-emerald-300" />
            <span>Find &amp; Verify a Surveyor</span>
          </a>
        </div>
      )}
    </nav>
  );
}
