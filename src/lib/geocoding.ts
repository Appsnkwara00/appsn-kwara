// OpenStreetMap Nominatim Geocoding Client for APPSN Kwara Directory
// Strictly adheres to Nominatim usage policies and enforces high-accuracy location validation.
// Rejects broad state, county, LGA, or city polygon results to prevent inaccurate pin placement.

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
  placeRank: number;
  addressType: string;
  isHighAccuracy: boolean;
}

const CACHE_KEY = 'appsn_osm_geocode_cache_v2';
let lastRequestTimestamp = 0;

function getCachedGeocode(queryKey: string): GeocodeResult | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const cacheStr = localStorage.getItem(CACHE_KEY);
    if (!cacheStr) return null;
    const cache = JSON.parse(cacheStr);
    const key = queryKey.toLowerCase().trim();
    if (cache[key] && typeof cache[key].latitude === 'number' && typeof cache[key].longitude === 'number') {
      return cache[key];
    }
  } catch (e) {
    // ignore cache read failure
  }
  return null;
}

function setCachedGeocode(queryKey: string, result: GeocodeResult): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const cacheStr = localStorage.getItem(CACHE_KEY);
    const cache = cacheStr ? JSON.parse(cacheStr) : {};
    const key = queryKey.toLowerCase().trim();
    cache[key] = result;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    // ignore cache write failure
  }
}

/**
 * Validates whether a Nominatim result is a high-accuracy, specific street or landmark location,
 * rather than a generic city, LGA, or state-level administrative boundary polygon.
 */
export function isAccurateNominatimResult(item: any): boolean {
  if (!item) return false;
  const rank = typeof item.place_rank === 'number' ? item.place_rank : parseInt(item.place_rank || '0', 10);
  const addresstype = (item.addresstype || '').toLowerCase();
  const cls = (item.class || '').toLowerCase();
  const type = (item.type || '').toLowerCase();
  const name = (item.name || '').trim().toLowerCase();

  // 1. Strictly reject broad administrative boundaries (State, Country, County, LGA, Province)
  if (cls === 'boundary' && type === 'administrative') return false;
  if (['state', 'country', 'county', 'region', 'state_district', 'province', 'archipelago'].includes(addresstype)) {
    return false;
  }

  // 2. Strictly reject entire city, town, village or municipality centers/polygons
  // (We require street, building, amenity, junction, or neighbourhood granularity)
  if (['city', 'town', 'village', 'municipality'].includes(addresstype)) {
    return false;
  }
  if (['city', 'town', 'village', 'administrative'].includes(type)) {
    return false;
  }

  // 3. Reject results whose name is just a state, city, or generic region name
  if (['kwara', 'kwara state', 'ilorin', 'nigeria', 'ilorin west', 'ilorin east', 'ilorin south', 'offa'].includes(name)) {
    return false;
  }

  // 4. Reject large bounding boxes spanning broad geographic areas (> ~5km)
  if (Array.isArray(item.boundingbox) && item.boundingbox.length === 4) {
    const latSpan = Math.abs(parseFloat(item.boundingbox[1]) - parseFloat(item.boundingbox[0]));
    const lonSpan = Math.abs(parseFloat(item.boundingbox[3]) - parseFloat(item.boundingbox[2]));
    if (latSpan > 0.05 || lonSpan > 0.05) {
      return false;
    }
  }

  // 5. Must have place_rank >= 18 (Nominatim place_rank 18-30 corresponds to roads, streets, venues, amenities, buildings)
  // Or high-granularity neighbourhood/suburb (place_rank >= 18)
  return rank >= 18;
}

/**
 * Formats and cleans a Nigerian address to construct targeted search queries for Nominatim.
 * Incorporates specific Nigerian/Kwara context without assuming every address is in Ilorin.
 */
function buildNominatimQueries(rawAddress: string, lga?: string): string[] {
  let clean = (rawAddress || '').replace(/\s*\[geo:[^\]]+\]\s*/g, '').trim();

  // Strip room, suite, floor, shop, plot numbers, P.O. Box to avoid confusing Nominatim
  clean = clean.replace(/^(no\.?\s*\d+[a-z]?[\s,/-]*)/i, '');
  clean = clean.replace(/(plot\s*[0-9a-z]+[\s,/-]*)/gi, '');
  clean = clean.replace(/(shop\s*[0-9a-z]+[\s,/-]*)/gi, '');
  clean = clean.replace(/(room\s*[0-9a-z]+[\s,/-]*)/gi, '');
  clean = clean.replace(/(suite\s*[0-9a-z]+[\s,/-]*)/gi, '');
  clean = clean.replace(/(flat\s*[0-9a-z]+[\s,/-]*)/gi, '');
  clean = clean.replace(/(first|second|ground|top)\s*floor[\s,/-]*/gi, '');
  clean = clean.replace(/p\.?\s*o\.?\s*box\s*\d+[\s,/-]*/gi, '');
  clean = clean.replace(/\s+/g, ' ').trim();

  // Detect town / city context from address if present
  let detectedTown = '';
  if (/offa\b/i.test(clean) && !/offa\s*road/i.test(clean)) {
    detectedTown = 'Offa';
  } else if (/omu[\s-]*aran/i.test(clean)) {
    detectedTown = 'Omu-Aran';
  } else if (/patigi|pategi/i.test(clean)) {
    detectedTown = 'Patigi';
  } else if (/lafiagi/i.test(clean)) {
    detectedTown = 'Lafiagi';
  } else if (/kaiama/i.test(clean)) {
    detectedTown = 'Kaiama';
  } else if (/jebba/i.test(clean)) {
    detectedTown = 'Jebba';
  } else if (/erin[\s-]*ile/i.test(clean)) {
    detectedTown = 'Erin-Ile';
  } else if (/oro\b/i.test(clean) && !/oro\s*ago/i.test(clean)) {
    detectedTown = 'Oro';
  } else if (/malete/i.test(clean)) {
    detectedTown = 'Malete';
  } else if (/bode[\s-]*saadu/i.test(clean)) {
    detectedTown = 'Bode Saadu';
  } else if (/share\b/i.test(clean)) {
    detectedTown = 'Share';
  } else if (/bacita/i.test(clean)) {
    detectedTown = 'Bacita';
  } else if (/ilorin/i.test(clean)) {
    detectedTown = 'Ilorin';
  } else if (lga && lga !== 'LGA not specified') {
    detectedTown = lga;
  }

  const queries: string[] = [];

  // Query 1: Clean address with town (if known), Kwara State, Nigeria
  let q1 = clean;
  if (detectedTown && !new RegExp(detectedTown, 'i').test(q1)) {
    q1 = `${q1}, ${detectedTown}`;
  }
  if (!/kwara/i.test(q1)) q1 = `${q1}, Kwara State`;
  if (!/nigeria/i.test(q1)) q1 = `${q1}, Nigeria`;
  queries.push(q1);

  // Query 2: Extract major street / road / avenue name
  const streetMatches = clean.matchAll(/([a-zA-Z0-9\s-]+(?:road|street|avenue|way|crescent|boulevard|close|junction|express|expressway|estate|layout|gra))/gi);
  for (const m of streetMatches) {
    const sName = m[1].replace(/^(along|beside|opposite|behind|inside|off|no\.?\s*\d+[a-z]?)\s+/i, '').trim();
    if (sName.length > 3) {
      if (detectedTown) {
        queries.push(`${sName}, ${detectedTown}, Kwara State, Nigeria`);
      }
      queries.push(`${sName}, Kwara State, Nigeria`);
    }
  }

  // Query 3: Extract "Off <Road>" or "Beside <Place>" if present
  const offMatch = clean.match(/off\s+([a-zA-Z\s-]+(?:road|street|way|avenue|express|expressway|estate|layout|close|gra))/i);
  if (offMatch && offMatch[1]) {
    const offStreet = offMatch[1].trim();
    if (detectedTown) {
      queries.push(`${offStreet}, ${detectedTown}, Kwara State, Nigeria`);
    }
    queries.push(`${offStreet}, Kwara State, Nigeria`);
  }

  // Query 4: Extract well-known Kwara neighbourhoods (Tanke, Sabo Oke, Fate, GRA, Gaa Akanbi, etc.)
  const neighbourhoods = ['Sabo Oke', 'Sabo-Oke', 'Gaa Akanbi', 'Tanke', 'GRA', 'Fate', 'Adewole', 'Kulende', 'Amoyo', 'Irewolede', 'Agric', 'Sango', 'Amilegbe', 'Taiwo'];
  for (const n of neighbourhoods) {
    if (new RegExp(`\\b${n}\\b`, 'i').test(clean)) {
      if (detectedTown) {
        queries.push(`${n}, ${detectedTown}, Kwara State, Nigeria`);
      }
      queries.push(`${n}, Kwara State, Nigeria`);
    }
  }

  // Query 5: If detectedTown is Ilorin or not detected, clean address with Kwara State, Nigeria
  queries.push(`${clean}, Kwara State, Nigeria`);

  return [...new Set(queries)];
}

/**
 * Geocodes an address string to precise latitude/longitude using OpenStreetMap Nominatim.
 * Strictly verifies that the returned result is high-accuracy (street or landmark level).
 * Rejects broad city/state/LGA polygons.
 */
export async function geocodeAddress(rawAddress: string, lga?: string): Promise<GeocodeResult> {
  const cleanAddress = (rawAddress || '').replace(/\s*\[geo:[^\]]+\]\s*/g, '').trim();

  if (!cleanAddress || cleanAddress.length < 3) {
    throw new Error('Please enter a valid office or location address before locating on map.');
  }

  // 1. Check local cache first
  const cacheKey = `${cleanAddress}::${lga || ''}`;
  const cached = getCachedGeocode(cacheKey);
  if (cached) {
    return cached;
  }

  const candidateQueries = buildNominatimQueries(cleanAddress, lga);

  for (const query of candidateQueries) {
    // Respect Nominatim rate limit: at least 1000ms between calls
    const now = Date.now();
    const timeSinceLast = now - lastRequestTimestamp;
    if (timeSinceLast < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 1000 - timeSinceLast));
    }
    lastRequestTimestamp = Date.now();

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ng&limit=3&addressdetails=1`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        continue;
      }

      // Filter results to only high-accuracy, street-level or building-level matches
      const accurateItem = data.find(isAccurateNominatimResult);

      if (accurateItem) {
        const lat = parseFloat(accurateItem.lat);
        const lng = parseFloat(accurateItem.lon);

        if (!isNaN(lat) && !isNaN(lng)) {
          const result: GeocodeResult = {
            latitude: lat,
            longitude: lng,
            displayName: accurateItem.display_name || cleanAddress,
            placeRank: accurateItem.place_rank || 20,
            addressType: accurateItem.addresstype || 'road',
            isHighAccuracy: true
          };

          setCachedGeocode(cacheKey, result);
          return result;
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Geocoding request timed out. Please check your internet connection or place the marker manually on the map.');
      }
    }
  }

  // If no high-accuracy street-level result could be verified:
  // Reject low-accuracy / broad results to prevent inaccurate pin placement.
  throw new Error(
    `Specific street address "${cleanAddress}" could not be pinpointed with high accuracy on OpenStreetMap. ` +
    `To ensure exact location accuracy, click or drag the marker on the map to set the surveyor's office entrance manually.`
  );
}
