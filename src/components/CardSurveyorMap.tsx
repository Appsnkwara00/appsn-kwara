import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin } from 'lucide-react';

interface CardSurveyorMapProps {
  latitude: number;
  longitude: number;
  surveyorName: string;
  officeAddress?: string;
  lga?: string;
  companyName?: string;
  height?: string | number;
  interactive?: boolean;
}

// Custom APPSN Forest Green Pin Marker
function createCardPin() {
  return L.divIcon({
    className: 'card-map-pin',
    html: `
      <div style="
        position: relative;
        width: 30px;
        height: 38px;
        filter: drop-shadow(0 3px 5px rgba(0,0,0,0.35));
        transition: transform 0.2s ease;
      ">
        <svg viewBox="0 0 34 42" width="30" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.5 14.5 40.5 16.15 41.85C16.65 42.25 17.35 42.25 17.85 41.85C19.5 40.5 34 27.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="#0D3829"/>
          <path d="M17 1.5C8.43959 1.5 1.5 8.43959 1.5 17C1.5 25.8 14.5 38 17 40C19.5 38 32.5 25.8 32.5 17C32.5 8.43959 25.5604 1.5 17 1.5Z" stroke="#C5A059" stroke-width="1.5" stroke-opacity="0.9"/>
          <circle cx="17" cy="16" r="7.5" fill="#FFFFFF"/>
          <circle cx="17" cy="16" r="4" fill="#1B824B"/>
        </svg>
      </div>
    `,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34],
  });
}

export default function CardSurveyorMap({
  latitude,
  longitude,
  surveyorName,
  officeAddress,
  lga,
  companyName,
  height = '100%',
  interactive = true
}: CardSurveyorMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const cleanAddress = (officeAddress || '').replace(/\s*\[geo:[^\]]+\]\s*/g, '').trim();

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') return;
    if (isNaN(latitude) || isNaN(longitude)) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet map with OpenStreetMap tiles
    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 16,
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: false,
      doubleClickZoom: interactive,
      touchZoom: interactive,
      attributionControl: true,
    });

    // Official OpenStreetMap tile layer with required visible attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',
    }).addTo(map);

    // Marker positioned at the surveyor's office coordinates
    const marker = L.marker([latitude, longitude], {
      icon: createCardPin(),
      title: `${surveyorName} - Office Location`
    }).addTo(map);

    const popupHtml = `
      <div style="font-family: system-ui, sans-serif; font-size: 11px; line-height: 1.35; color: #1e293b; max-width: 200px;">
        <strong style="color: #0D3829; font-size: 12px; display: block; margin-bottom: 2px;">${surveyorName}</strong>
        ${companyName ? `<div style="font-size: 10px; color: #475569; margin-bottom: 3px;">${companyName}</div>` : ''}
        ${cleanAddress ? `<div style="color: #334155; font-size: 10px; margin-bottom: 3px;">${cleanAddress}</div>` : ''}
        ${lga && lga !== 'LGA not specified' ? `<span style="background: #EBF4F0; color: #0D3829; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 3px;">${lga} LGA</span>` : ''}
      </div>
    `;
    marker.bindPopup(popupHtml);

    mapInstanceRef.current = map;

    // Invalidate size to ensure tiles render crisp in container
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, surveyorName, cleanAddress, lga, companyName, interactive]);

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#FAF9F5] border border-slate-200">
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0" 
        style={{ minHeight: typeof height === 'number' ? `${height}px` : height }}
      />

      {/* Top Directions Button */}
      <button
        type="button"
        onClick={handleDirections}
        className="absolute top-2 right-2 z-[400] bg-white/95 hover:bg-white text-[#0D3829] shadow-md border border-slate-200 px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all hover:scale-105 cursor-pointer"
        title="Get directions to office"
      >
        <Navigation className="w-3 h-3 text-emerald-600" />
        <span>Directions</span>
      </button>

      {/* Bottom Coordinates tag */}
      <div className="absolute bottom-1 left-2 z-[400] bg-white/90 backdrop-blur-2xs px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-600 border border-slate-200 pointer-events-none hidden sm:block">
        {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
      </div>
    </div>
  );
}
