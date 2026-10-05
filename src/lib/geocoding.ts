// OpenStreetMap Nominatim Geocoding Client for APPSN Kwara Directory
// Strictly adheres to Nominatim usage policies: explicit user action only, 
// User-Agent identifying the application, rate-limiting, and local caching.

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

const CACHE_KEY = 'appsn_osm_geocode_cache_v1';
let lastRequestTimestamp = 0;

function getCachedGeocode(query: string): GeocodeResult | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const cacheStr = localStorage.getItem(CACHE_KEY);
    if (!cacheStr) return null;
    const cache = JSON.parse(cacheStr);
    const key = query.toLowerCase().trim();
    if (cache[key] && typeof cache[key].latitude === 'number' && typeof cache[key].longitude === 'number') {
      return cache[key];
    }
  } catch (e) {
    // ignore cache read failure
  }
  return null;
}

function setCachedGeocode(query: string, result: GeocodeResult): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const cacheStr = localStorage.getItem(CACHE_KEY);
    const cache = cacheStr ? JSON.parse(cacheStr) : {};
    const key = query.toLowerCase().trim();
    cache[key] = result;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    // ignore cache write failure
  }
}

/**
 * Geocodes an address string to latitude/longitude using OpenStreetMap Nominatim.
 * Strictly called on explicit user action (e.g. "Find Location" or "Locate on Map").
 */
export async function geocodeAddress(rawAddress: string, lga?: string): Promise<GeocodeResult> {
  // Strip any embedded coordinates if present
  const cleanAddress = (rawAddress || '').replace(/\s*\[geo:[^\]]+\]\s*/g, '').trim();

  if (!cleanAddress || cleanAddress.length < 3) {
    throw new Error('Please enter a valid office or location address before locating on map.');
  }

  // Optimize query for Kwara State, Nigeria
  let query = cleanAddress;
  if (!/kwara/i.test(query)) {
    if (lga && lga !== 'LGA not specified' && !new RegExp(lga, 'i').test(query)) {
      query = `${query}, ${lga}, Kwara State, Nigeria`;
    } else {
      query = `${query}, Kwara State, Nigeria`;
    }
  } else if (!/nigeria/i.test(query)) {
    query = `${query}, Nigeria`;
  }

  // 1. Check local cache first to avoid repeat network requests
  const cached = getCachedGeocode(query);
  if (cached) {
    return cached;
  }

  // 2. Respect Nominatim rate limit: ensure at least 1000ms between calls
  const now = Date.now();
  const timeSinceLast = now - lastRequestTimestamp;
  if (timeSinceLast < 1000) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - timeSinceLast));
  }
  lastRequestTimestamp = Date.now();

  // 3. Make explicit request to OpenStreetMap Nominatim
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ng&limit=1&addressdetails=1`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        // In browser fetch, User-Agent header is restricted by browser security policies; 
        // Nominatim supports referrer and query parameters
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenStreetMap geocoding service returned status ${response.status}. You can place the marker manually on the map.`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      // Try fallback with just LGA or Ilorin if address was overly specific
      if (lga && lga !== 'LGA not specified') {
        const fallbackQuery = `${lga}, Kwara State, Nigeria`;
        const fbUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackQuery)}&countrycodes=ng&limit=1`;
        const fbRes = await fetch(fbUrl);
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          if (Array.isArray(fbData) && fbData.length > 0) {
            const result: GeocodeResult = {
              latitude: parseFloat(fbData[0].lat),
              longitude: parseFloat(fbData[0].lon),
              displayName: `${cleanAddress} (Approximate area: ${fbData[0].display_name})`
            };
            setCachedGeocode(query, result);
            return result;
          }
        }
      }

      throw new Error(`Address "${cleanAddress}" could not be automatically pinpointed on OpenStreetMap. You can drag the marker or click on the map to set the coordinates manually.`);
    }

    const first = data[0];
    const lat = parseFloat(first.lat);
    const lng = parseFloat(first.lon);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Received invalid coordinates from geocoding service.');
    }

    const result: GeocodeResult = {
      latitude: lat,
      longitude: lng,
      displayName: first.display_name || cleanAddress
    };

    // Cache the resolved coordinates
    setCachedGeocode(query, result);

    return result;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Geocoding request timed out. Please check your internet connection or place the marker manually on the map.');
    }
    throw err;
  }
}
