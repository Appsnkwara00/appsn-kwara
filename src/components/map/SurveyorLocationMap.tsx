import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation, MapPin } from 'lucide-react';

interface SurveyorLocationMapProps {
  latitude: number;
  longitude: number;
  surveyorName: string;
  officeAddress: string;
  lga?: string;
  companyName?: string;
}

// Custom APPSN Kwara Marker styled with forest green and gold accent
function createSurveyorPin() {
  return L.divIcon({
    className: 'appsn-map-pin',
    html: `
      <div style="
        position: relative;
        width: 34px;
        height: 42px;
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <svg viewBox="0 0 34 42" width="34" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.5 14.5 40.5 16.15 41.85C16.65 42.25 17.35 42.25 17.85 41.85C19.5 40.5 34 27.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="#0D3829"/>
          <path d="M17 1.5C8.43959 1.5 1.5 8.43959 1.5 17C1.5 25.8 14.5 38 17 40C19.5 38 32.5 25.8 32.5 17C32.5 8.43959 25.5604 1.5 17 1.5Z" stroke="#C5A059" stroke-width="1.5" stroke-opacity="0.9"/>
          <circle cx="17" cy="16" r="7.5" fill="#FFFFFF"/>
          <circle cx="17" cy="16" r="4" fill="#1B824B"/>
        </svg>
      </div>
    `,
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -38],
  });
}

export default function SurveyorLocationMap({
  latitude,
  longitude,
  surveyorName,
  officeAddress,
  lga,
  companyName
}: SurveyorLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const cleanAddress = (officeAddress || '').replace(/\s*\[geo:[^\]]+\]\s*/g, '').trim();

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') return;
    if (isNaN(latitude) || isNaN(longitude)) return;

    // Destroy any existing instance before initializing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false, // Prevent page scrolling hijacking
    });

    // Official OpenStreetMap HTTPS tiles with required visible attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker([latitude, longitude], {
      icon: createSurveyorPin(),
      title: `${surveyorName} - Office Location`
    }).addTo(map);

    const popupContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.4; color: #1e293b; max-width: 220px; padding: 2px;">
        <div style="font-weight: 700; color: #0D3829; font-size: 13px; margin-bottom: 2px;">${surveyorName}</div>
        ${companyName ? `<div style="font-size: 11px; color: #475569; margin-bottom: 4px;">${companyName}</div>` : ''}
        <div style="color: #334155; font-size: 11px; margin-bottom: 4px;">${cleanAddress}</div>
        ${lga ? `<span style="display: inline-block; background: #EBF4F0; color: #0D3829; font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 4px;">${lga} LGA</span>` : ''}
      </div>
    `;
    marker.bindPopup(popupContent);

    mapInstanceRef.current = map;

    // Invalidate size after modal render animation completes
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, surveyorName, cleanAddress, lga, companyName]);

  // Open directions in universal navigation URL (Google Maps / Apple Maps / default map app)
  const handleGetDirections = () => {
    // Universal maps directions URL using precise coordinates
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3" id="surveyor-location-map-section">
      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-inner bg-[#FAF9F5]">
        <div 
          ref={mapContainerRef} 
          className="w-full h-64 sm:h-72 z-0"
          style={{ minHeight: '260px' }}
        />
        
        {/* Subtle Top-Right Coordinates Tag */}
        <div className="absolute top-2.5 right-2.5 z-[400] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs pointer-events-none hidden sm:block">
          <span className="font-mono text-[10px] text-slate-600 font-semibold">
            {latitude.toFixed(5)}° N, {longitude.toFixed(5)}° E
          </span>
        </div>
      </div>

      {/* Action: Get Directions Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="font-medium truncate">{cleanAddress}</span>
        </div>

        <button
          type="button"
          onClick={handleGetDirections}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D3829] hover:bg-[#08281D] active:scale-98 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer group shrink-0"
          id="btn-get-directions"
          title="Open directions to surveyor's office in your navigation app"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-300 group-hover:scale-110 transition-transform" />
          <span>Get Directions</span>
        </button>
      </div>
    </div>
  );
}
