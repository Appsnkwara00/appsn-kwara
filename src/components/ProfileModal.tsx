import React, { useState } from 'react';
import { Surveyor } from '../types';
import { 
  X, Phone, Mail, MapPin, Award, ShieldCheck, 
  Building2, ArrowRight, ZoomIn, CheckCircle2
} from 'lucide-react';
import { buildWhatsAppLink } from '../lib/whatsapp';
import SurveyorMap from './SurveyorMap';

interface ProfileModalProps {
  surveyor: Surveyor | null;
  onClose: () => void;
  onPreviewImage?: (imageUrl: string, title: string, subtitle?: string) => void;
}

export default function ProfileModal({ surveyor, onClose, onPreviewImage }: ProfileModalProps) {
  const [imgError, setImgError] = useState(false);

  if (!surveyor) return null;

  const initialLetter = surveyor.fullName
    ? surveyor.fullName.replace(/^(Surv\.|Engr\.|Mrs\.|Mr\.|Dr\.|Alhaji)\s*/i, '').trim().charAt(0) || 'S'
    : 'S';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div 
        className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        id="profile-details-modal"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-[#FAF9F5]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#0D3829] tracking-wider uppercase font-mono">
              APPSN Kwara Certified Practitioner
            </span>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          
          {/* Top Surveyor Profile Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Col: Photo & Verified Badge (4 cols) */}
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
              <div 
                onClick={() => {
                  if (!imgError && surveyor.profilePhoto && onPreviewImage) {
                    onPreviewImage(surveyor.profilePhoto, surveyor.fullName, `${surveyor.registrationNumber} • ${surveyor.lga}`);
                  }
                }}
                className={`relative w-44 h-44 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-4 border-[#FAF9F5] shadow-md bg-slate-100 ${
                  !imgError && surveyor.profilePhoto ? 'cursor-zoom-in group/photo' : ''
                }`}
                title={!imgError && surveyor.profilePhoto ? "Click to enlarge photo" : undefined}
              >
                {!imgError && surveyor.profilePhoto ? (
                  <>
                    <img
                      src={surveyor.profilePhoto}
                      alt={surveyor.fullName}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover object-center group-hover/photo:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-black/60 backdrop-blur-xs text-white p-2.5 rounded-full">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#EBF4F0] to-[#d8ece2] text-[#0D3829]">
                    <div className="w-16 h-16 rounded-full bg-[#0D3829] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
                      {initialLetter}
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#0D3829]/80 font-bold mt-2">
                      APPSN MEMBER
                    </span>
                  </div>
                )}

                {/* Verified Badge */}
                <div className="absolute bottom-2 right-2 bg-[#0D3829] text-white rounded-full px-2.5 py-1 text-[10px] font-bold shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>SURCON ACTIVE</span>
                </div>
              </div>

              {/* Registration Number box */}
              <div className="w-full bg-[#FAF9F5] rounded-xl p-3 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  SURCON License
                </span>
                <span className="text-sm font-bold text-[#0D3829] font-mono">
                  {surveyor.registrationNumber}
                </span>
              </div>
            </div>

            {/* Right Col: Details (8 cols) */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-[#0D3829] text-[11px] font-bold font-mono">
                    {surveyor.lga === 'LGA not specified' ? 'Kwara State' : `${surveyor.lga} LGA`}
                  </span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
                  {surveyor.fullName}
                </h3>
                
                {surveyor.company_name && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{surveyor.company_name}</span>
                  </div>
                )}
              </div>

              {/* Metadata Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#FAF9F5] rounded-xl p-3 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block font-bold">Experience</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{surveyor.yearsOfExperience} Years Practice</span>
                </div>
                <div className="bg-[#FAF9F5] rounded-xl p-3 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block font-bold">Jurisdiction</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 font-mono">Kwara State</span>
                </div>
                <div className="bg-[#FAF9F5] rounded-xl p-3 border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block font-bold">Good Standing</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified 2025/2026
                  </span>
                </div>
              </div>

              {/* Office Address */}
              <div className="flex items-start gap-3 bg-[#FAF9F5] rounded-xl p-3.5 border border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block font-bold">Registered Office</span>
                  <span className="text-xs font-medium text-slate-700 leading-relaxed block mt-0.5">
                    {surveyor.officeAddress}
                  </span>
                </div>
              </div>

              {/* Bio summary */}
              {(surveyor.bio || surveyor.aboutMe) && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  {(surveyor.bio || surveyor.aboutMe || '').replace(
                    /Authorized for cadastral boundary determination, title charting, and official survey lodgements\.?/gi,
                    'Authorized for every type of survey work.'
                  )}
                </p>
              )}
            </div>

          </div>

          {/* Location & OpenStreetMap Section */}
          <div className="pt-6 border-t border-slate-100 space-y-3.5" id="profile-location-section">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Office Location &amp; Headquarters
              </span>
              <h4 className="text-base font-bold text-slate-900 font-serif">
                {surveyor.lga && surveyor.lga !== 'LGA not specified' ? `${surveyor.lga}, Kwara State` : 'Kwara State, Nigeria'}
              </h4>
            </div>

            <SurveyorMap
              latitude={surveyor.latitude}
              longitude={surveyor.longitude}
              surveyorName={surveyor.fullName}
              officeAddress={surveyor.officeAddress}
              lga={surveyor.lga}
              companyName={surveyor.company_name}
            />
          </div>

          {/* Direct Contact Channels Section (Clean, streamlined without direct message form) */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 font-serif">
                Direct Contact &amp; Engagement
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Reach out directly to {surveyor.fullName} for boundary confirmation, survey execution, layout design, or professional consultation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* WhatsApp button */}
              {buildWhatsAppLink(surveyor.whatsapp_number || surveyor.phoneNumber, surveyor.fullName) && (
                <a
                  href={buildWhatsAppLink(surveyor.whatsapp_number || surveyor.phoneNumber, surveyor.fullName)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Chat with ${surveyor.fullName} on WhatsApp`}
                  aria-label={`Chat with ${surveyor.fullName} on WhatsApp`}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-300/80 bg-emerald-50 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#25D366] group-hover:bg-white text-white group-hover:text-[#25D366] flex items-center justify-center shrink-0 shadow-2xs transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.53 1.776.814 2.796.814 3.18 0 5.766-2.586 5.767-5.766.001-3.182-2.585-5.768-5.767-5.768zm3.385 8.163c-.145.407-.741.77-1.037.818-.28.046-.641.077-1.921-.453-1.636-.677-2.695-2.34-2.776-2.45-.08-.109-.661-.879-.661-1.674 0-.796.417-1.189.566-1.35.148-.161.325-.202.434-.202.108 0 .217.001.312.006.1.006.234-.038.366.279.136.327.464 1.132.505 1.214.041.082.068.178.014.286-.055.109-.082.177-.163.272-.082.096-.172.214-.246.287-.082.081-.168.169-.072.333.095.165.424.7.91 1.134.625.557 1.152.73 1.316.812.164.081.26.068.357-.041.096-.109.414-.482.525-.646.109-.164.218-.136.368-.082.15.054.952.449 1.115.531.163.082.272.122.312.19.041.068.041.394-.104.801zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.98-1.306C8.423 21.536 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider block font-mono font-bold text-emerald-900 group-hover:text-white">
                        WhatsApp Chat
                      </span>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-white font-mono">
                        Instant Connect
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </a>
              )}

              {/* Phone call button */}
              {surveyor.phoneNumber && (
                <a
                  href={`tel:${surveyor.phoneNumber.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-[#0D3829] hover:bg-[#FAF9F5] transition-all group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#EBF4F0] text-[#0D3829] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase font-bold">Direct Phone</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{surveyor.phoneNumber}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D3829] group-hover:translate-x-0.5 transition-all" />
                </a>
              )}

              {/* Email button */}
              {surveyor.email && (
                <a
                  href={`mailto:${surveyor.email}?subject=Survey Inquiry - APPSN Kwara Directory`}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-[#0D3829] hover:bg-[#FAF9F5] transition-all group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#EBF4F0] text-[#0D3829] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-400 block font-mono uppercase font-bold">Email Inquiry</span>
                      <span className="text-xs font-bold text-slate-800 font-mono truncate max-w-[130px] block">{surveyor.email}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D3829] group-hover:translate-x-0.5 transition-all" />
                </a>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
