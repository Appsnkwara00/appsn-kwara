import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin } from 'lucide-react';

export interface SurveyorMapProps {
  latitude?: number | null;
  longitude?: number | null;
  surveyorName?: string;
  officeAddress?: string;
  lga?: string;
  companyName?: string;
  className?: string;
  height?: string | number;
  zoom?: number;
  showDirectionsButton?: boolean;
}

// Custom APPSN Kwara Map Marker styled with forest green and gold accent
function createSurveyorPin() {
  return L.divIcon({
    className: 'surveyor-map-marker-pin',
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

export function SurveyorMap({
  latitude,
  longitude,
  surveyorName = 'Registered Surveyor',
  officeAddress,
  lga,
  companyName,
  className = '',
  height = '280px',
  zoom = 16,
  showDirectionsButton = true,
}: SurveyorMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Validate coordinates strictly before map initialization
  const isValidCoordinates =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  const cleanAddress = (officeAddress || '').replace(/\s*\[geo:[^\]]+\]\s*/g, '').trim();

  useEffect(() => {
    // Ensure the map ONLY initializes when valid latitude and longitude exist
    if (!isValidCoordinates || !mapContainerRef.current) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    const lat = latitude as number;
    const lng = longitude as number;

    // Clean up any existing map instance on container re-render
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet map centered at surveyor coordinates
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // OpenStreetMap tile layer (https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png)
    // with required attribution '© OpenStreetMap contributors'
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',
    }).addTo(map);

    // Place marker showing surveyor location
    const marker = L.marker([lat, lng], {
      icon: createSurveyorPin(),
      title: `${surveyorName} - Office Location`,
    }).addTo(map);

    // Bind descriptive popup
    const popupContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.4; color: #1e293b; max-width: 220px; padding: 2px;">
        <div style="font-weight: 700; color: #0D3829; font-size: 13px; margin-bottom: 2px;">${surveyorName}</div>
        ${companyName ? `<div style="font-size: 11px; color: #475569; margin-bottom: 4px;">${companyName}</div>` : ''}
        ${cleanAddress ? `<div style="color: #334155; font-size: 11px; margin-bottom: 4px;">${cleanAddress}</div>` : ''}
        ${lga ? `<span style="display: inline-block; background: #EBF4F0; color: #0D3829; font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 4px;">${lga} LGA</span>` : ''}
      </div>
    `;
    marker.bindPopup(popupContent);

    mapInstanceRef.current = map;

    // Handle container resize when embedded in tabs or modals
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(resizeTimer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isValidCoordinates, latitude, longitude, zoom, surveyorName, cleanAddress, lga, companyName]);

  // Gracefully handle surveyors who do not have coordinates
  if (!isValidCoordinates) {
    return (
      <div className={`bg-[#FAF9F5] rounded-2xl p-4 border border-slate-200/80 flex items-start gap-3 ${className}`}>
        <MapPin className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-slate-800 block">
            {cleanAddress || 'Office Address in Kwara State'}
          </span>
          <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
            {lga && lga !== 'LGA not specified' ? `${lga} LGA, Kwara State` : 'Kwara State, Nigeria'}
          </span>
        </div>
      </div>
    );
  }

  // Get Directions handler using coordinates
  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const containerHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className={`space-y-3 ${className}`} id="surveyor-osm-map-component">
      {/* Map Tile Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-inner bg-[#FAF9F5]">
        <div
          ref={mapContainerRef}
          className="w-full z-0"
          style={{ height: containerHeight, minHeight: '220px' }}
        />

        {/* Top-Right Precise Coordinates Tag */}
        <div className="absolute top-2.5 right-2.5 z-[400] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs pointer-events-none hidden sm:block">
          <span className="font-mono text-[10px] text-slate-600 font-semibold">
            {(latitude as number).toFixed(5)}° N, {(longitude as number).toFixed(5)}° E
          </span>
        </div>
      </div>

      {/* Directions and Address Footer */}
      {showDirectionsButton && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-medium truncate">{cleanAddress || `${lga || 'Kwara'} State`}</span>
          </div>

          <button
            type="button"
            onClick={handleGetDirections}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D3829] hover:bg-[#08281D] active:scale-98 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer group shrink-0"
            id="btn-surveyor-map-directions"
            title="Open directions in navigation application"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-300 group-hover:scale-110 transition-transform" />
            <span>Get Directions</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default SurveyorMap;
