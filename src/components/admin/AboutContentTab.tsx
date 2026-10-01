import React, { useState, useEffect, useRef } from 'react';
import { AboutContent } from '../../types';
import { 
  Building2, 
  Upload, 
  Save, 
  Check, 
  RefreshCw, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Target, 
  Phone, 
  Mail, 
  MapPin,
  Image as ImageIcon
} from 'lucide-react';

interface AboutContentTabProps {
  aboutContent: AboutContent;
  onSaveAboutContent?: (content: AboutContent) => void;
  onPreviewImage?: (imageUrl: string, title: string, subtitle?: string) => void;
}

export default function AboutContentTab({
  aboutContent,
  onSaveAboutContent,
  onPreviewImage
}: AboutContentTabProps) {
  const [headlineBadge, setHeadlineBadge] = useState(aboutContent.headlineBadge);
  const [heroHeading, setHeroHeading] = useState(aboutContent.heroHeading);
  const [leadParagraph, setLeadParagraph] = useState(aboutContent.leadParagraph);
  const [visionTitle, setVisionTitle] = useState(aboutContent.visionTitle);
  const [visionText, setVisionText] = useState(aboutContent.visionText);
  const [missionTitle, setMissionTitle] = useState(aboutContent.missionTitle);
  const [missionText, setMissionText] = useState(aboutContent.missionText);
  const [coreValuesTitle, setCoreValuesTitle] = useState(aboutContent.coreValuesTitle);
  const [coreValuesText, setCoreValuesText] = useState(aboutContent.coreValuesText);
  const [heroPhoto, setHeroPhoto] = useState(aboutContent.heroPhoto);
  const [yearsExperience, setYearsExperience] = useState(aboutContent.yearsExperience);
  const [yearsSubtitle, setYearsSubtitle] = useState(aboutContent.yearsSubtitle);
  const [secretariatAddress, setSecretariatAddress] = useState(aboutContent.secretariatAddress);
  const [secretariatPhone, setSecretariatPhone] = useState(aboutContent.secretariatPhone);
  const [secretariatEmail, setSecretariatEmail] = useState(aboutContent.secretariatEmail);

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHeadlineBadge(aboutContent.headlineBadge);
    setHeroHeading(aboutContent.heroHeading);
    setLeadParagraph(aboutContent.leadParagraph);
    setVisionTitle(aboutContent.visionTitle);
    setVisionText(aboutContent.visionText);
    setMissionTitle(aboutContent.missionTitle);
    setMissionText(aboutContent.missionText);
    setCoreValuesTitle(aboutContent.coreValuesTitle);
    setCoreValuesText(aboutContent.coreValuesText);
    setHeroPhoto(aboutContent.heroPhoto);
    setYearsExperience(aboutContent.yearsExperience);
    setYearsSubtitle(aboutContent.yearsSubtitle);
    setSecretariatAddress(aboutContent.secretariatAddress);
    setSecretariatPhone(aboutContent.secretariatPhone);
    setSecretariatEmail(aboutContent.secretariatEmail);
  }, [aboutContent]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setHeroPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveAboutContent) return;

    setIsSaving(true);
    const updated: AboutContent = {
      headlineBadge,
      heroHeading,
      leadParagraph,
      visionTitle,
      visionText,
      missionTitle,
      missionText,
      coreValuesTitle,
      coreValuesText,
      heroPhoto,
      yearsExperience,
      yearsSubtitle,
      secretariatAddress,
      secretariatPhone,
      secretariatEmail
    };

    try {
      await onSaveAboutContent(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err) {
      console.error('Failed to save about content:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-[11px] font-mono font-bold mb-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ORGANIZATIONAL STORY &amp; MANDATE</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            About APPSN Kwara Content
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Edit the branch history, vision, mission statement, core values, hero showcase photo, and official secretariat details displayed across the About Us view.
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Saved &amp; Updated Live!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: HERO PHOTO & LEAD INTRODUCTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Photo Preview & Upload (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 font-serif">Feature Photograph</h4>
              <span className="text-[10px] font-mono text-slate-400">About Feature</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 group">
              <img 
                src={heroPhoto} 
                alt="About Hero Preview" 
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
              />
              {onPreviewImage && (
                <button
                  type="button"
                  onClick={() => onPreviewImage(heroPhoto, 'About APPSN Feature Photo')}
                  className="absolute bottom-3 right-3 bg-black/70 hover:bg-black text-white p-2 rounded-xl backdrop-blur-xs text-xs font-semibold flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={heroPhoto}
                  onChange={(e) => setHeroPhoto(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                />
              </div>

              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload New Photo from Device</span>
                </button>
              </div>
            </div>

            {/* Experience Floating Badge Inputs */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                  Years Badge (e.g. 40+ Years)
                </label>
                <input
                  type="text"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                  Years Subtitle
                </label>
                <input
                  type="text"
                  value={yearsSubtitle}
                  onChange={(e) => setYearsSubtitle(e.target.value)}
                  placeholder="of Dedicated Service"
                  className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                Badge Footnote
              </label>
              <input
                type="text"
                value={headlineBadge}
                onChange={(e) => setHeadlineBadge(e.target.value)}
                placeholder="Certified SURCON Practitioners"
                className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
              />
            </div>

          </div>

          {/* Heading & Lead Narrative (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900 font-serif">About Header &amp; Story</h4>
              <p className="text-xs text-slate-500">The core introduction presented to citizens and visitors.</p>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                About Heading *
              </label>
              <input
                type="text"
                required
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                placeholder="Association of Private Practicing Surveyors of Nigeria (APPSN)"
                className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none font-serif text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                Executive Lead Paragraph *
              </label>
              <textarea
                rows={5}
                required
                value={leadParagraph}
                onChange={(e) => setLeadParagraph(e.target.value)}
                placeholder="APPSN Kwara State Branch is the premier professional body of licensed, SURCON-accredited private practicing surveyors in Kwara State..."
                className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200/70 space-y-2">
              <div className="text-xs font-bold text-[#0D3829] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tip: High Ethical Integrity</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Highlighting our members' affiliation with SURCON and strict adherence to the 16 Local Government Areas builds high public trust and prevents boundary quackery.
              </p>
            </div>
          </div>

        </div>

        {/* SECTION 2: VISION, MISSION & CORE VALUES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-slate-900 font-serif">Vision, Mission &amp; Core Values</h4>
            <p className="text-xs text-slate-500">The 3 core institutional cards on the full About Us page.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Vision */}
            <div className="space-y-3 p-5 rounded-2xl bg-[#FAF9F5] border border-slate-200/80">
              <div className="flex items-center gap-2 text-slate-900 font-bold font-serif">
                <Eye className="w-4 h-4 text-[#0D3829]" />
                <input
                  type="text"
                  value={visionTitle}
                  onChange={(e) => setVisionTitle(e.target.value)}
                  className="w-full text-sm font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#0D3829] focus:outline-none"
                />
              </div>
              <textarea
                rows={5}
                value={visionText}
                onChange={(e) => setVisionText(e.target.value)}
                placeholder="To build an orderly, legally secure..."
                className="w-full text-xs font-semibold p-3 bg-white border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Mission */}
            <div className="space-y-3 p-5 rounded-2xl bg-[#FAF9F5] border border-slate-200/80">
              <div className="flex items-center gap-2 text-slate-900 font-bold font-serif">
                <Target className="w-4 h-4 text-[#0D3829]" />
                <input
                  type="text"
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  className="w-full text-sm font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#0D3829] focus:outline-none"
                />
              </div>
              <textarea
                rows={5}
                value={missionText}
                onChange={(e) => setMissionText(e.target.value)}
                placeholder="To unite registered private practicing surveyors..."
                className="w-full text-xs font-semibold p-3 bg-white border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Core Values */}
            <div className="space-y-3 p-5 rounded-2xl bg-[#FAF9F5] border border-slate-200/80">
              <div className="flex items-center gap-2 text-slate-900 font-bold font-serif">
                <ShieldCheck className="w-4 h-4 text-[#0D3829]" />
                <input
                  type="text"
                  value={coreValuesTitle}
                  onChange={(e) => setCoreValuesTitle(e.target.value)}
                  className="w-full text-sm font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#0D3829] focus:outline-none"
                />
              </div>
              <textarea
                rows={5}
                value={coreValuesText}
                onChange={(e) => setCoreValuesText(e.target.value)}
                placeholder="Accuracy: Millimeter precision in every measurement.&#10;Integrity: Honest, dispute-free boundary demarcation."
                className="w-full text-xs font-semibold p-3 bg-white border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none resize-none leading-relaxed"
              />
            </div>

          </div>
        </div>

        {/* SECTION 3: SECRETARIAT CONTACT BANNER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-slate-900 font-serif">Secretariat Details (About Page Banner)</h4>
            <p className="text-xs text-slate-500">Contact information displayed inside the dark green Secretariat invitation banner on the About page.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                Secretariat Address
              </label>
              <input
                type="text"
                value={secretariatAddress}
                onChange={(e) => setSecretariatAddress(e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                Secretariat Phone
              </label>
              <input
                type="text"
                value={secretariatPhone}
                onChange={(e) => setSecretariatPhone(e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">
                Secretariat Email
              </label>
              <input
                type="email"
                value={secretariatEmail}
                onChange={(e) => setSecretariatEmail(e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Sticky Action Save Bar */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/90 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#0D3829]" />
            <span className="hidden sm:inline">Modifications to the About section reflect instantly on the public website.</span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#0D3829] hover:bg-[#08281D] text-white font-bold py-3 px-8 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving About Section...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save About APPSN</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
