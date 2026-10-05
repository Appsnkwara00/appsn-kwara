import React from 'react';
import { Surveyor } from '../types';
import { Phone, Mail, MapPin, ArrowRight, ZoomIn } from 'lucide-react';
import { buildWhatsAppLink } from '../lib/whatsapp';

interface SurveyorCardProps {
  key?: React.Key;
  surveyor: Surveyor;
  onViewProfile: (surveyor: Surveyor) => void;
  onPreviewImage?: (imageUrl: string, title: string, subtitle?: string) => void;
}

export default function SurveyorCard({ surveyor, onViewProfile, onPreviewImage }: SurveyorCardProps) {
  const [imgError, setImgError] = React.useState(false);

  const initialLetter = surveyor.fullName
    ? surveyor.fullName.replace(/^(Surv\.|Engr\.|Mrs\.|Mr\.|Dr\.|Alhaji)\s*/i, '').trim().charAt(0) || 'S'
    : 'S';

  const rawPhone = surveyor.whatsapp_number || surveyor.phoneNumber;
  const whatsappUrl = buildWhatsAppLink(rawPhone, surveyor.fullName);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imgError && surveyor.profilePhoto && onPreviewImage) {
      onPreviewImage(
        surveyor.profilePhoto,
        surveyor.fullName,
        `${surveyor.registrationNumber} • ${surveyor.lga}`
      );
    }
  };

  const lgaDisplay = surveyor.lga === 'LGA not specified'
    ? 'LGA not specified'
    : `${surveyor.lga}, Kwara`;

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-900/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group"
      id={`surveyor-card-${surveyor.id}`}
    >
      {/* Top Image Container with zoom preview trigger */}
      <div className="p-3 pb-0">
        <div 
          onClick={handleImageClick}
          className={`relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100 ${
            !imgError && surveyor.profilePhoto ? 'cursor-zoom-in group/img' : ''
          }`}
          title={!imgError && surveyor.profilePhoto ? "Click to enlarge photo" : undefined}
        >
          {!imgError && surveyor.profilePhoto ? (
            <>
              <img
                src={surveyor.profilePhoto}
                alt={surveyor.fullName}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />
              {/* Subtle zoom indicator on hover */}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-black/60 backdrop-blur-xs text-white p-2 rounded-full transform scale-90 group-hover/img:scale-100 transition-transform">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#EBF4F0] to-[#d8ece2] text-[#0D3829]">
              <div className="w-14 h-14 rounded-full bg-[#0D3829] text-white flex items-center justify-center font-serif text-xl font-bold shadow-xs">
                {initialLetter}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#0D3829]/80 font-bold mt-2">
                APPSN REGISTERED
              </span>
            </div>
          )}

          {/* Verified Badge in top right corner */}
          <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            <span>Verified</span>
          </div>
        </div>
      </div>

      {/* Card Content - essential info only (No specialization badge, No years of experience) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Name */}
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-[#0D3829] transition-colors">
            {surveyor.fullName}
          </h3>

          {/* Registration Number */}
          <div className="text-xs text-slate-400 font-medium">
            Reg. No: <span className="text-slate-700 font-mono font-semibold">{surveyor.registrationNumber}</span>
          </div>

          {/* LGA Location (derived from office address) */}
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-0.5">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className={`truncate ${surveyor.lga === 'LGA not specified' ? 'italic text-slate-400' : 'text-slate-700 font-medium'}`}>
                {lgaDisplay}
              </span>
            </div>
            {typeof surveyor.latitude === 'number' && typeof surveyor.longitude === 'number' && (
              <span 
                className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 shrink-0 flex items-center gap-1"
                title="Office mapped on OpenStreetMap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Map
              </span>
            )}
          </div>
        </div>

        {/* Card Actions: View Profile, WhatsApp, Call, Mail */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5">
          <button
            id={`card-view-profile-${surveyor.id}`}
            onClick={() => onViewProfile(surveyor)}
            className="flex-1 bg-[#0D3829] hover:bg-[#08281D] active:scale-95 text-white py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group/btn"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </button>

          {/* WhatsApp click-to-chat button */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id={`card-whatsapp-${surveyor.id}`}
              title={`Chat with ${surveyor.fullName} on WhatsApp`}
              aria-label={`Chat with ${surveyor.fullName} on WhatsApp`}
              className="w-9 h-9 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-[#25D366] text-[#0D3829] hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shrink-0 cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.53 1.776.814 2.796.814 3.18 0 5.766-2.586 5.767-5.766.001-3.182-2.585-5.768-5.767-5.768zm3.385 8.163c-.145.407-.741.77-1.037.818-.28.046-.641.077-1.921-.453-1.636-.677-2.695-2.34-2.776-2.45-.08-.109-.661-.879-.661-1.674 0-.796.417-1.189.566-1.35.148-.161.325-.202.434-.202.108 0 .217.001.312.006.1.006.234-.038.366.279.136.327.464 1.132.505 1.214.041.082.068.178.014.286-.055.109-.082.177-.163.272-.082.096-.172.214-.246.287-.082.081-.168.169-.072.333.095.165.424.7.91 1.134.625.557 1.152.73 1.316.812.164.081.26.068.357-.041.096-.109.414-.482.525-.646.109-.164.218-.136.368-.082.15.054.952.449 1.115.531.163.082.272.122.312.19.041.068.041.394-.104.801zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.98-1.306C8.423 21.536 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
            </a>
          )}

          {/* Call button */}
          {surveyor.phoneNumber && (
            <a
              href={`tel:${surveyor.phoneNumber.replace(/\s+/g, '')}`}
              id={`card-call-${surveyor.id}`}
              title={`Call ${surveyor.fullName}`}
              aria-label={`Call ${surveyor.fullName}`}
              className="w-9 h-9 rounded-xl border border-slate-200 hover:border-[#0D3829] hover:bg-[#EBF4F0] text-slate-600 hover:text-[#0D3829] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Mail button */}
          {surveyor.email && (
            <a
              href={`mailto:${surveyor.email}?subject=Surveying Inquiry - APPSN Kwara`}
              id={`card-mail-${surveyor.id}`}
              title={`Email ${surveyor.fullName}`}
              aria-label={`Email ${surveyor.fullName}`}
              className="w-9 h-9 rounded-xl border border-slate-200 hover:border-[#0D3829] hover:bg-[#EBF4F0] text-slate-600 hover:text-[#0D3829] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
