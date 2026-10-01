import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings } from '../../types';
import { 
  Sparkles, 
  Upload, 
  Globe, 
  Check, 
  Save, 
  RefreshCw, 
  Image as ImageIcon, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface BrandingSettingsTabProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings?: (settings: SiteSettings) => void;
}

export default function BrandingSettingsTab({
  siteSettings,
  onSaveSiteSettings
}: BrandingSettingsTabProps) {
  const [logoUrl, setLogoUrl] = useState(siteSettings.logoUrl);
  const [faviconUrl, setFaviconUrl] = useState(siteSettings.faviconUrl);
  const [siteTitle, setSiteTitle] = useState(siteSettings.siteTitle);
  const [tagline, setTagline] = useState(siteSettings.tagline);
  const [branchName, setBranchName] = useState(siteSettings.branchName);
  const [heroHeadline, setHeroHeadline] = useState(siteSettings.heroHeadline);
  const [heroSubtitle, setHeroSubtitle] = useState(siteSettings.heroSubtitle);
  const [phone, setPhone] = useState(siteSettings.phone);
  const [email, setEmail] = useState(siteSettings.email);
  const [address, setAddress] = useState(siteSettings.address);

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const logoFileRef = useRef<HTMLInputElement>(null);
  const faviconFileRef = useRef<HTMLInputElement>(null);

  // Sync if prop updates
  useEffect(() => {
    setLogoUrl(siteSettings.logoUrl);
    setFaviconUrl(siteSettings.faviconUrl);
    setSiteTitle(siteSettings.siteTitle);
    setTagline(siteSettings.tagline);
    setBranchName(siteSettings.branchName);
    setHeroHeadline(siteSettings.heroHeadline);
    setHeroSubtitle(siteSettings.heroSubtitle);
    setPhone(siteSettings.phone);
    setEmail(siteSettings.email);
    setAddress(siteSettings.address);
  }, [siteSettings]);

  // Handle Logo file upload
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Favicon file upload
  const handleFaviconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFaviconUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveSiteSettings) return;

    setIsSaving(true);
    const updated: SiteSettings = {
      logoUrl,
      faviconUrl,
      siteTitle,
      tagline,
      branchName,
      heroHeadline,
      heroSubtitle,
      phone,
      email,
      address
    };

    try {
      await onSaveSiteSettings(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Tab Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-[11px] font-mono font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>REAL-TIME SITE IDENTITY &amp; BRANDING</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Logo, Favicon &amp; Site Controls
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Control the official seal logo, browser tab favicon, site title, tagline, and hero messaging dynamically across the entire website.
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Changes Live &amp; Saved to Database!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: LOGO & FAVICON VISUAL CONFIGURATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LOGO CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif">APPSN Official Logo</h4>
                  <p className="text-[11px] text-slate-500">Displayed in Navbar, Mobile menu &amp; Footer</p>
                </div>
              </div>
            </div>

            {/* Live Dual Preview */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200/70 text-center space-y-2">
                <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">Navbar Preview</span>
                <div className="w-16 h-16 mx-auto rounded-full bg-white border border-emerald-950/20 p-1 shadow-xs flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoUrl || "/logo.png"} 
                    alt="Logo Preview Light" 
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">On Light Header</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B251D] border border-emerald-950 text-center space-y-2">
                <span className="text-[10px] font-mono text-emerald-400/80 block font-bold uppercase">Footer Preview</span>
                <div className="w-16 h-16 mx-auto rounded-full bg-white border border-emerald-800 p-1 shadow-xs flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoUrl || "/logo.png"} 
                    alt="Logo Preview Dark" 
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                  />
                </div>
                <span className="text-[10px] text-emerald-200/80 font-medium">On Dark Footer</span>
              </div>
            </div>

            {/* Logo Inputs */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Logo Image URL
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/logo.png or https://..."
                  className="w-full text-xs font-medium p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={logoFileRef} 
                  onChange={handleLogoFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => logoFileRef.current?.click()}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo from Device</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLogoUrl('/logo.png')}
                  className="py-2.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs rounded-xl font-mono cursor-pointer shrink-0"
                  title="Reset to default official logo"
                >
                  Reset
                </button>
              </div>
            </div>

          </div>

          {/* FAVICON CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif">Browser Favicon</h4>
                  <p className="text-[11px] text-slate-500">Appears on browser tabs, bookmarks &amp; PWA shortcut</p>
                </div>
              </div>
            </div>

            {/* Realistic Browser Tab Simulation */}
            <div className="pt-1">
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shadow-xs">
                {/* Mock browser tab bar */}
                <div className="bg-slate-200 px-3 pt-2.5 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-t-xl max-w-xs shadow-xs border-t border-l border-r border-slate-300">
                    <img 
                      src={faviconUrl || "/favicon.png"} 
                      alt="Favicon preview" 
                      className="w-4 h-4 rounded-xs shrink-0 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/favicon.png'; }}
                    />
                    <span className="text-[11px] text-slate-700 font-medium truncate">
                      {siteTitle || "APPSN Kwara State"}
                    </span>
                  </div>
                </div>
                <div className="bg-white p-4 text-center">
                  <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Live Browser Tab Emulation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Favicon Inputs */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Favicon Image URL
                </label>
                <input
                  type="text"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="/favicon.png or https://..."
                  className="w-full text-xs font-medium p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={faviconFileRef} 
                  onChange={handleFaviconFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => faviconFileRef.current?.click()}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Favicon</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFaviconUrl('/favicon.png')}
                  className="py-2.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs rounded-xl font-mono cursor-pointer shrink-0"
                  title="Reset to default favicon"
                >
                  Reset
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* SECTION 2: SITE TITLE & BRAND NAMES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-slate-900 font-serif">Brand Text &amp; Page Titles</h4>
            <p className="text-xs text-slate-500">Reflected in browser title bar, SEO cards, and header brand typography.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                Full Site Title * (Browser Tab &amp; Search Engines)
              </label>
              <input
                type="text"
                required
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                placeholder="APPSN Kwara State - Official Directory of Registered Surveyors"
                className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                Branch Display Name * (Navbar Brand Header)
              </label>
              <input
                type="text"
                required
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="APPSN Kwara"
                className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
              Brand Motto / Tagline (e.g. TRUSTED / VERIFIED / PROFESSIONAL)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="TRUSTED / VERIFIED / PROFESSIONAL"
              className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* SECTION 3: HERO SECTION MESSAGING */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-slate-900 font-serif">Hero Section Copywriting</h4>
            <p className="text-xs text-slate-500">The main headline and subtitle visitors see immediately when landing on the website.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                Hero Main Headline *
              </label>
              <input
                type="text"
                required
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                placeholder="Find a Registered Surveyor in Kwara"
                className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                Hero Supporting Subtitle *
              </label>
              <textarea
                rows={3}
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Connect with verified and registered practising surveyors across Kwara State..."
                className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: BRANCH SECRETARIAT CONTACT DETAILS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-slate-900 font-serif">Official Secretariat Contact Info</h4>
            <p className="text-xs text-slate-500">Displayed in the footer, contact section, and public citizen notices.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                Secretariat Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 803 502 5960"
                  className="w-full pl-9 pr-3 py-3 text-xs font-semibold border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="appsnkwara0@gmail.com"
                  className="w-full pl-9 pr-3 py-3 text-xs font-semibold border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
              Physical Secretariat Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Along Ikoyi Avenue, Off New Yidi Rd, Ilorin, Kwara State, Nigeria"
                className="w-full pl-9 pr-3 py-3 text-xs font-semibold border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/90 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#0D3829]" />
            <span className="hidden sm:inline">Settings save directly to database &amp; immediately update the live website.</span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#0D3829] hover:bg-[#08281D] text-white font-bold py-3 px-8 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Branding &amp; Settings</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
