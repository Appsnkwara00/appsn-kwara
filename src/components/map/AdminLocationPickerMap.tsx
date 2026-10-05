import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Search, MapPin, AlertCircle, CheckCircle2, RotateCcw, Crosshair } from 'lucide-react';
import { geocodeAddress } from '../../lib/geocoding';

interface AdminLocationPickerMapProps {
  address: string;
  lga?: string;
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  onChangeCoordinates: (lat: number | null, lng: number | null) => void;
}

// Default center for Kwara State / Ilorin administrative capital
const DEFAULT_KWARA_CENTER: [number, number] = [8.4966, 4.5421];

function createAdminDraggablePin() {
  return L.divIcon({
    className: 'admin-map-pin',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 44px;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35));
        cursor: grab;
      ">
        <svg viewBox="0 0 36 44" width="36" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 0C8.05887 0 0 8.05887 0 18C0 28.5 15.5 42.5 17.15 43.85C17.65 44.25 18.35 44.25 18.85 43.85C20.5 42.5 36 28.5 36 18C36 8.05887 27.9411 0 18 0Z" fill="#0D3829"/>
          <path d="M18 2C9.16344 2 2 9.16344 2 18C2 27.2 15.6 39.8 18 41.7C20.4 39.8 34 27.2 34 18C34 9.16344 26.8366 2 18 2Z" stroke="#C5A059" stroke-width="1.8"/>
          <circle cx="18" cy="17" r="7.5" fill="#FFFFFF"/>
          <circle cx="18" cy="17" r="4" fill="#0D3829"/>
        </svg>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40],
  });
}

export default function AdminLocationPickerMap({
  address,
  lga,
  latitude,
  longitude,
  onChangeCoordinates,
}: AdminLocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeMessage, setGeocodeMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const hasCoordinates = typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialCenter: [number, number] = hasCoordinates
      ? [latitude as number, longitude as number]
      : DEFAULT_KWARA_CENTER;

    const initialZoom = hasCoordinates ? 16 : 12;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Official OpenStreetMap HTTPS tiles with required attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    // If initial coordinates exist, place the marker
    if (hasCoordinates) {
      const marker = L.marker(initialCenter, {
        icon: createAdminDraggablePin(),
        draggable: true,
        title: 'Drag to adjust exact surveyor office location',
      }).addTo(map);

      marker.bindPopup('<div style="font-size: 11px; font-weight: 600;">Office Location<br><span style="color:#64748b; font-weight: 400;">Drag or click map to move</span></div>');

      marker.on('dragend', (e) => {
        const markerPos = e.target.getLatLng();
        onChangeCoordinates(
          parseFloat(markerPos.lat.toFixed(6)),
          parseFloat(markerPos.lng.toFixed(6))
        );
        setGeocodeMessage({
          type: 'info',
          text: `Position manually updated to ${markerPos.lat.toFixed(6)}, ${markerPos.lng.toFixed(6)}`
        });
      });

      markerRef.current = marker;
    }

    // Allow clicking anywhere on the map to place or reposition the marker
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      const roundedLat = parseFloat(lat.toFixed(6));
      const roundedLng = parseFloat(lng.toFixed(6));

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const marker = L.marker([lat, lng], {
          icon: createAdminDraggablePin(),
          draggable: true,
          title: 'Drag to adjust exact surveyor office location',
        }).addTo(map);

        marker.on('dragend', (evt) => {
          const pos = evt.target.getLatLng();
          onChangeCoordinates(
            parseFloat(pos.lat.toFixed(6)),
            parseFloat(pos.lng.toFixed(6))
          );
        });

        markerRef.current = marker;
      }

      onChangeCoordinates(roundedLat, roundedLng);
      setGeocodeMessage({
        type: 'info',
        text: `Marker placed at ${roundedLat}, ${roundedLng}`
      });
    });

    mapInstanceRef.current = map;

    // Invalidate size to guarantee crisp rendering in modal
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker position if coordinates change externally
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (hasCoordinates) {
      const pos: [number, number] = [latitude as number, longitude as number];
      if (markerRef.current) {
        markerRef.current.setLatLng(pos);
      } else {
        const marker = L.marker(pos, {
          icon: createAdminDraggablePin(),
          draggable: true,
          title: 'Drag to adjust exact surveyor office location',
        }).addTo(map);

        marker.on('dragend', (evt) => {
          const p = evt.target.getLatLng();
          onChangeCoordinates(
            parseFloat(p.lat.toFixed(6)),
            parseFloat(p.lng.toFixed(6))
          );
        });

        markerRef.current = marker;
      }
    } else if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [latitude, longitude, hasCoordinates]);

  // Explicit User Action: "Find Location" via OpenStreetMap Nominatim
  const handleFindLocation = async () => {
    if (!address || address.trim().length < 3) {
      setGeocodeMessage({
        type: 'error',
        text: 'Please enter a valid office address above first.'
      });
      return;
    }

    setIsGeocoding(true);
    setGeocodeMessage(null);

    try {
      const result = await geocodeAddress(address, lga);
      onChangeCoordinates(result.latitude, result.longitude);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([result.latitude, result.longitude], 16, {
          animate: true,
          duration: 1.2,
        });

        if (markerRef.current) {
          markerRef.current.setLatLng([result.latitude, result.longitude]);
          markerRef.current.openPopup();
        }
      }

      setGeocodeMessage({
        type: 'success',
        text: `Location resolved! Drag the marker if necessary to set the exact office entrance.`
      });
    } catch (err: any) {
      setGeocodeMessage({
        type: 'error',
        text: err.message || 'Could not locate address automatically. Click anywhere on the map to place the marker manually.'
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  // Reset/Clear coordinates
  const handleClearCoordinates = () => {
    onChangeCoordinates(null, null);
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    setGeocodeMessage({
      type: 'info',
      text: 'Coordinates cleared. You can use Find Location or click the map to re-assign.'
    });
  };

  // Center to Kwara state
  const handleCenterKwara = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(DEFAULT_KWARA_CENTER, 12);
    }
  };

  return (
    <div className="space-y-3 bg-[#FAF9F5] p-4 sm:p-5 rounded-2xl border border-slate-200/80">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-[#0D3829] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>OpenStreetMap Office Location &amp; Coordinates</span>
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Resolve address to coordinates or click and drag the marker to the surveyor's office.
          </p>
        </div>

        {/* Find Location Button (Explicit User Action Only) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleFindLocation}
            disabled={isGeocoding}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D3829] hover:bg-[#08281D] active:scale-98 disabled:opacity-50 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            id="btn-find-location-osm"
            title="Locate the entered address on OpenStreetMap"
          >
            {isGeocoding ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Locating...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5 text-emerald-300" />
                <span>Find Location</span>
              </>
            )}
          </button>

          {hasCoordinates && (
            <button
              type="button"
              onClick={handleClearCoordinates}
              className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              title="Clear coordinates"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCenterKwara}
            className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-500 hover:text-[#0D3829] transition-colors cursor-pointer"
            title="Recenter on Ilorin/Kwara"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Geocode Status Message Banner */}
      {geocodeMessage && (
        <div 
          className={`p-3 rounded-xl text-xs flex items-start gap-2 animate-in fade-in duration-150 ${
            geocodeMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
              : geocodeMessage.type === 'error'
              ? 'bg-amber-50 text-amber-900 border border-amber-200'
              : 'bg-blue-50 text-blue-900 border border-blue-200'
          }`}
        >
          {geocodeMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{geocodeMessage.text}</span>
        </div>
      )}

      {/* Interactive Leaflet Map for Admin */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
        <div 
          ref={mapContainerRef} 
          className="w-full h-56 sm:h-64 z-0 cursor-crosshair"
          style={{ minHeight: '230px' }}
        />
        <div className="absolute bottom-2 left-2 z-[400] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-slate-600 font-medium border border-slate-200 pointer-events-none hidden sm:block">
          💡 Click anywhere on map or drag marker to adjust exact position
        </div>
      </div>

      {/* Numerical Coordinate Inputs (Editable & Persisted) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
            Latitude (°N)
          </label>
          <input
            type="number"
            step="any"
            value={hasCoordinates ? (latitude as number) : ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : parseFloat(e.target.value);
              onChangeCoordinates(val, typeof longitude === 'number' ? longitude : null);
            }}
            placeholder="e.g. 8.496642"
            className="w-full text-xs font-mono font-semibold p-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
            Longitude (°E)
          </label>
          <input
            type="number"
            step="any"
            value={hasCoordinates ? (longitude as number) : ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : parseFloat(e.target.value);
              onChangeCoordinates(typeof latitude === 'number' ? latitude : null, val);
            }}
            placeholder="e.g. 4.542144"
            className="w-full text-xs font-mono font-semibold p-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#0D3829] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
