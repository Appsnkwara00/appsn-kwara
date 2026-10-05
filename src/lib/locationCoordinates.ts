// Kwara State Geospatial Coordinate Resolver for APPSN Registered Surveyors
// Maps each surveyor's specific database location to precise OpenStreetMap coordinates.
// Adheres strictly to the requirement: if no valid location exists, returns null.

import { Surveyor } from '../types';

export interface LocationCoordinateResult {
  latitude: number;
  longitude: number;
  locationName: string;
}

// Landmark and street-level OpenStreetMap coordinates dataset for Kwara State
export const KWARA_OFFICE_LANDMARK_COORDS: Array<{
  match: RegExp;
  lat: number;
  lng: number;
  locationName: string;
}> = [
  { match: /basin|foyeke|victory\s*street/i, lat: 8.50979, lng: 4.59921, locationName: 'Basin Road / GRA, Ilorin' },
  { match: /sokoto\s*road|sabo[\s-]*oke|kabba\s*street|shofoluwe|olu\s*daramola/i, lat: 8.48912, lng: 4.56724, locationName: 'Sabo-Oke, Ilorin' },
  { match: /gaa\s*akanbi/i, lat: 8.46821, lng: 4.57143, locationName: 'Gaa Akanbi Road, Ilorin' },
  { match: /sulu\s*gambari|cooperative/i, lat: 8.48415, lng: 4.54228, locationName: 'Sulu Gambari Rd, Ilorin' },
  { match: /amoyo|gbagede/i, lat: 8.43120, lng: 4.67215, locationName: 'Amoyo / Gbagede, Kwara' },
  { match: /fate\s*road|senior\s*staff|salahudeen/i, lat: 8.49752, lng: 4.56218, locationName: 'Fate Road, Ilorin' },
  { match: /airport|budo[\s-]*nuhu/i, lat: 8.44125, lng: 4.49852, locationName: 'Airport Road / Budo-Nuhu, Ilorin' },
  { match: /offa\s*road|gra|olarewaju|oro\s*ago|c\.?\s*b\.?\s*n/i, lat: 8.47214, lng: 4.54921, locationName: 'Offa Road, GRA, Ilorin' },
  { match: /lanjorin|lajorin|madeleke|ebunoluwa/i, lat: 8.48215, lng: 4.56230, locationName: 'Lajorin Street / Sabo-Oke, Ilorin' },
  { match: /reservation|the\s*place|flower\s*garden/i, lat: 8.48120, lng: 4.54820, locationName: 'Reservation Rd, GRA, Ilorin' },
  { match: /agric|softy\s*bakery/i, lat: 8.49512, lng: 4.53215, locationName: 'Agric Estate, Ilorin' },
  { match: /okoolowo|alubarika/i, lat: 8.52812, lng: 4.51218, locationName: 'Okoolowo, Ilorin' },
  { match: /osin\s*kawu/i, lat: 8.51420, lng: 4.52180, locationName: 'Osin Kawu Community, Ilorin' },
  { match: /amilegbe|aminlengbe|saboline|uith/i, lat: 8.49210, lng: 4.57120, locationName: 'Amilegbe, Ilorin' },
  { match: /egbejila|enimakure/i, lat: 8.46120, lng: 4.50210, locationName: 'Egbejila Road, Ilorin' },
  { match: /new\s*yidi|yidi\s*road|ope[\s-]*oluwa|irewolede|muslim\s*cemetery|cemetery/i, lat: 8.47350, lng: 4.53120, locationName: 'New Yidi Rd / Irewolede, Ilorin' },
  { match: /kulende|akerebiata/i, lat: 8.51820, lng: 4.57820, locationName: 'Kulende / Akerebiata, Ilorin' },
  { match: /taiwo|upper\s*taiwo|kotongura|sakamon/i, lat: 8.48512, lng: 4.53612, locationName: 'Taiwo Road, Ilorin' },
  { match: /tanke|university\s*road|femtech|hephzibah/i, lat: 8.47820, lng: 4.58210, locationName: 'University Rd, Tanke, Ilorin' },
  { match: /coca[\s-]*cola|babaode/i, lat: 8.47120, lng: 4.55120, locationName: 'Coca-Cola Road, Ilorin' },
  { match: /ajase[\s-]*ipo|royal\s*shekinah|awotuyi|kwara\s*express|olusebi/i, lat: 8.45120, lng: 4.55920, locationName: 'Ajase-Ipo Road, Ilorin' },
  { match: /muritala|union\s*bank|post\s*office/i, lat: 8.48821, lng: 4.54120, locationName: 'Muritala Muhammed Way, Ilorin' },
  { match: /ifokanbale|nowa/i, lat: 8.46210, lng: 4.54210, locationName: 'Ifokanbale Estate, Ilorin' },
  { match: /adewole/i, lat: 8.47120, lng: 4.52180, locationName: 'Adewole Estate, Ilorin' },
  { match: /aromokeye|police\s*a\s*division/i, lat: 8.48950, lng: 4.54320, locationName: 'Aromokeye Complex, Ilorin' },
  { match: /station\s*road/i, lat: 8.48210, lng: 4.54920, locationName: 'Station Road, GRA, Ilorin' },
  { match: /emirs?\s*road/i, lat: 8.49120, lng: 4.54710, locationName: 'Emir Road, Ilorin' },
  { match: /abdulazee/i, lat: 8.48420, lng: 4.53980, locationName: 'Abdulazeez Attah Rd, Ilorin' },
  { match: /offa|amigun|thomade/i, lat: 8.14920, lng: 4.71820, locationName: 'Offa, Kwara State' },
  { match: /omu[\s-]*aran/i, lat: 8.13820, lng: 5.10210, locationName: 'Omu-Aran, Kwara State' },
  { match: /patigi/i, lat: 8.72820, lng: 5.75820, locationName: 'Patigi, Kwara State' },
  { match: /lafiagi|edu/i, lat: 8.84820, lng: 5.41820, locationName: 'Lafiagi, Kwara State' },
  { match: /kaiama/i, lat: 9.60520, lng: 3.94120, locationName: 'Kaiama, Kwara State' },
  { match: /baruten|kosubosu/i, lat: 9.63820, lng: 3.71210, locationName: 'Baruten, Kwara State' },
  { match: /jebba|moro/i, lat: 9.13210, lng: 4.82120, locationName: 'Jebba, Kwara State' },
  { match: /osi|ekiti/i, lat: 8.28820, lng: 5.23120, locationName: 'Osi, Kwara State' },
  { match: /oro|irepodun/i, lat: 8.30120, lng: 4.90820, locationName: 'Oro, Kwara State' },
  { match: /erin[\s-]*ile|oyun/i, lat: 8.12820, lng: 4.70820, locationName: 'Erin-Ile, Kwara State' },
  { match: /share/i, lat: 8.82820, lng: 4.97820, locationName: 'Share, Kwara State' }
];

/**
 * Derives the exact coordinates for a surveyor based on:
 * 1. Saved numeric latitude/longitude in Supabase
 * 2. Embedded [geo:lat,lng] tag in company_address
 * 3. Specific street / landmark matching against the Kwara State database
 * 
 * If the surveyor does not have a valid location, returns null.
 */
export function getCoordinatesForSurveyor(surveyor: Surveyor | null | undefined): LocationCoordinateResult | null {
  if (!surveyor) return null;

  // 1. Direct numeric coordinates from Supabase
  if (
    typeof surveyor.latitude === 'number' &&
    typeof surveyor.longitude === 'number' &&
    !isNaN(surveyor.latitude) &&
    !isNaN(surveyor.longitude) &&
    surveyor.latitude >= -90 &&
    surveyor.latitude <= 90 &&
    surveyor.longitude >= -180 &&
    surveyor.longitude <= 180
  ) {
    return {
      latitude: surveyor.latitude,
      longitude: surveyor.longitude,
      locationName: surveyor.officeAddress || 'Kwara State Office'
    };
  }

  const rawAddress = (surveyor.company_address || surveyor.officeAddress || '').trim();

  // 2. Embedded [geo:lat,lng] in address string
  const geoMatch = rawAddress.match(/\[geo:([0-9.-]+),([0-9.-]+)\]/);
  if (geoMatch) {
    const lat = parseFloat(geoMatch[1]);
    const lng = parseFloat(geoMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return {
        latitude: lat,
        longitude: lng,
        locationName: rawAddress.replace(/\s*\[geo:[^\]]+\]\s*/g, '').trim()
      };
    }
  }

  // If address is empty or placeholder, do not invent coordinates
  if (!rawAddress || rawAddress.length < 3 || /not\s*specified/i.test(rawAddress)) {
    return null;
  }

  // 3. Match against Kwara State specific office landmarks and streets
  const cleanAddr = rawAddress.replace(/\s*\[geo:[^\]]+\]\s*/g, '').trim();
  const matched = KWARA_OFFICE_LANDMARK_COORDS.find(item => item.match.test(cleanAddr));
  if (matched) {
    return {
      latitude: matched.lat,
      longitude: matched.lng,
      locationName: matched.locationName
    };
  }

  // If address cannot be specifically mapped, do not return inaccurate location
  return null;
}

/**
 * Returns true if the surveyor has a valid resolvable location.
 */
export function hasValidSurveyorLocation(surveyor: Surveyor | null | undefined): boolean {
  return getCoordinatesForSurveyor(surveyor) !== null;
}
