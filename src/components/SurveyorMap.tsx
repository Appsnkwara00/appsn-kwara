import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin } from 'lucide-react';

export interface SurveyorMapProps {
  // Required props as requested
  lat?: number | null;
  lng?: number | null;
  popup?: React.ReactNode | string;

  // Backward-compatible props for existing consumers
  latitude?: number | null;
  longitude?: number | null;
  popupMessage?: React.ReactNode | string;
  surveyorName?: string;
  officeAddress?: string;
  lga?: string;
  companyName?: string;
  className?: string;
  height?: string | number;
  zoom?: number;
  showDirectionsButton?: boolean;
}

// Custom APPSN Leaflet Pin Icon (avoids missing Vite marker icon assets)
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

// Controller component to invalidate size and smoothly pan on coordinate changes
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [center, zoom, map]);

  return null;
}

export function SurveyorMap({
  lat,
  lng,
  popup,
  latitude,
  longitude,
  popupMessage,
  surveyorName = 'Registered Surveyor',
  officeAddress,
  lga,
  companyName,
  className = '',
  height = '280px',
  zoom = 16,
  showDirectionsButton = true,
}: SurveyorMapProps) {
  // Resolve coordinates from either `lat`/`lng` or `latitude`/`longitude`
  const resolvedLat = lat ?? latitude;
  const resolvedLng = lng ?? longitude;
  const resolvedPopup = popup ?? popupMessage;

  // Ensure the map ONLY renders if the provided coordinates are valid numbers
  const isValidCoordinates =
    typeof resolvedLat === 'number' &&
    typeof resolvedLng === 'number' &&
    !isNaN(resolvedLat) &&
    !isNaN(resolvedLng) &&
    resolvedLat >= -90 &&
    resolvedLat <= 90 &&
    resolvedLng >= -180 &&
    resolvedLng <= 180 &&
    !(resolvedLat === 0 && resolvedLng === 0);

  // If coordinates are invalid, do NOT render the map
  if (!isValidCoordinates || resolvedLat == null || resolvedLng == null) {
    const cleanAddress = (officeAddress || '').replace(/\s*\[geo:[^\]]+\]\s*/g, '').trim();
    if (cleanAddress || lga) {
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
    return null;
  }

  const center: [number, number] = [resolvedLat, resolvedLng];
  const containerHeight = typeof height === 'number' ? `${height}px` : height;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${resolvedLat},${resolvedLng}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${resolvedLat}&mlon=${resolvedLng}#map=17/${resolvedLat}/${resolvedLng}`;
  const cleanOfficeAddress = (officeAddress || '').replace(/\s*\[geo:[^\]]+\]\s*/g, '').trim();

  return (
    <div className={`space-y-3 ${className}`} id="surveyor-osm-map-component">
      {/* Map Tile Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-inner bg-[#FAF9F5]">
        <div style={{ height: containerHeight, minHeight: '220px', width: '100%' }}>
          <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            {/* OpenStreetMap Tile Layer with Required Attribution */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
              maxZoom={19}
            />

            <MapViewController center={center} zoom={zoom} />

            <Marker position={center} icon={createSurveyorPin()} title={`${surveyorName} - Office Location`}>
              {(resolvedPopup || surveyorName) && (
                <Popup>
                  {resolvedPopup ? (
                    typeof resolvedPopup === 'string' ? (
                      <div className="text-xs text-slate-800 font-sans max-w-[220px]">
                        {resolvedPopup}
                      </div>
                    ) : (
                      resolvedPopup
                    )
                  ) : (
                    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', lineHeight: '1.4', color: '#1e293b', maxWidth: '220px', padding: '2px' }}>
                      <div style={{ fontWeight: 700, color: '#0D3829', fontSize: '13px', marginBottom: '2px' }}>{surveyorName}</div>
                      {companyName && <div style={{ fontSize: '11px', color: '#475569', marginBottom: '4px' }}>{companyName}</div>}
                      {cleanOfficeAddress && <div style={{ color: '#334155', fontSize: '11px', marginBottom: '4px' }}>{cleanOfficeAddress}</div>}
                      {lga && lga !== 'LGA not specified' && (
                        <span style={{ display: 'inline-block', background: '#EBF4F0', color: '#0D3829', fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: '4px', marginBottom: '6px' }}>
                          {lga} LGA
                        </span>
                      )}
                      <div>
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#0D3829', color: '#ffffff', fontSize: '10px', fontWeight: 600, padding: '4px 9px', borderRadius: '6px', textDecoration: 'none' }}
                        >
                          Get Directions &rarr;
                        </a>
                      </div>
                    </div>
                  )}
                </Popup>
              )}
            </Marker>
          </MapContainer>
        </div>

        {/* Top-Right Coordinates Tag */}
        <div className="absolute top-2.5 right-2.5 z-[400] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs pointer-events-none hidden sm:block">
          <span className="font-mono text-[10px] text-slate-600 font-semibold">
            {resolvedLat.toFixed(5)}° N, {resolvedLng.toFixed(5)}° E
          </span>
        </div>
      </div>

      {/* Directions and Address Footer */}
      {showDirectionsButton && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-medium truncate">{cleanOfficeAddress || `${lga || 'Kwara'} State`}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D3829] hover:bg-[#08281D] active:scale-98 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer group shrink-0 no-underline"
              id="btn-surveyor-map-directions"
              title="Open directions to office from your current location"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-300 group-hover:scale-110 transition-transform" />
              <span>Get Directions</span>
            </a>

            <a
              href={osmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-mono font-medium transition-colors cursor-pointer no-underline"
              title="View on OpenStreetMap"
            >
              OSM
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default SurveyorMap;
