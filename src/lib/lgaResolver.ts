import { KWARA_LGAS } from '../data';

// Detailed Kwara State LGA mapping dictionary with landmarks, districts, towns, streets, and areas
export const KWARA_LGA_DATASET: Record<string, string[]> = {
  "Ilorin South": [
    "ilorin south",
    "gra",
    "g.r.a",
    "fate",
    "fate road",
    "basin",
    "basin road",
    "tanke",
    "pipeline",
    "pipeline road",
    "unilorin",
    "university of ilorin",
    "fufu",
    "gaa akanbi",
    "tipper garage",
    "kulende gra",
    "mandate estate",
    "omosebi",
    "micheal imoudu",
    "minils",
    "stella obasanjo",
    "reservation road",
    "the place",
    "senior staff",
    "federal secretariat",
    "ahman patigi",
    "agba dam",
    "tanke oke odo"
  ],
  "Ilorin East": [
    "ilorin east",
    "sango",
    "maraba",
    "gambari",
    "zango",
    "sulu gambari",
    "sabo-oke",
    "sabo oke",
    "sokoto road",
    "oke-oyi",
    "oke oyi",
    "ipata",
    "amilengbe",
    "kulende",
    "akerebiata",
    "maya",
    "agbeyangi",
    "iponrin",
    "marafa",
    "oke ose",
    "oke-ose",
    "uith",
    "teaching hospital"
  ],
  "Ilorin West": [
    "ilorin west",
    "taiwo",
    "ibrahim taiwo",
    "surulere",
    "baboko",
    "adewole",
    "adewole estate",
    "sawmill",
    "okekura",
    "oloje",
    "ogidi",
    "pakata",
    "omoda",
    "alore",
    "ajikobi",
    "ubandawaki",
    "ita-amodu",
    "agbo-oba",
    "ita-elepa",
    "geri alimi",
    "oja oba",
    "general hospital",
    "post office",
    "airport road",
    "asa dam",
    "asa dam road",
    "mandate market",
    "kuntu",
    "abata asunkere",
    "abule nla",
    "ita kudimo",
    "sobi road",
    "budo-nuhu",
    "lajorin",
    "madeleke",
    "irewolede",
    "muslim cemetery",
    "police a division",
    "aromokeye",
    "egbejila",
    "emirs road",
    "emir road",
    "abdulazeez attah",
    "abdulazeeata",
    "murtala",
    "unity road",
    "gegele",
    "eruda",
    "alanamu"
  ],
  "Offa": [
    "offa",
    "adeleke",
    "owode",
    "popo",
    "olofa way",
    "iyeru okin",
    "federal polytechnic offa",
    "fedpoffa",
    "adesoye",
    "arawore"
  ],
  "Ifelodun": [
    "ifelodun",
    "share",
    "ganmo",
    "amoyo",
    "idofian",
    "omupo",
    "igbaja",
    "agbonda",
    "babanloma",
    "baban loma",
    "oro-ago",
    "oro ago",
    "oke-ode",
    "oke ode",
    "gbagede",
    "ajegunle community",
    "ilire"
  ],
  "Oyun": [
    "oyun",
    "erin-ile",
    "erin ile",
    "ilemona",
    "igosun",
    "ipee",
    "ijoffa",
    "ira",
    "ojoku",
    "inaja"
  ],
  "Irepodun": [
    "irepodun",
    "omu-aran",
    "omu aran",
    "ajase-ipo",
    "ajase ipo",
    "ajase",
    "oro",
    "esie",
    "iludun",
    "arandun",
    "agbamu",
    "rore"
  ],
  "Isin": [
    "isin",
    "owu-isin",
    "owu isin",
    "isanlu-isin",
    "isanlu isin",
    "iwo",
    "ijara-isin",
    "ijara isin",
    "oke-onigbin",
    "oke onigbin",
    "edidi",
    "alla",
    "pamo"
  ],
  "Moro": [
    "moro",
    "bode saadu",
    "bode-saadu",
    "jebba",
    "shao",
    "malete",
    "kwasu",
    "lanwa",
    "ejidongari",
    "megida"
  ],
  "Edu": [
    "edu",
    "lafiagi",
    "tsonga",
    "shonga",
    "tsaragi",
    "bacita"
  ],
  "Pategi": [
    "pategi",
    "patigi",
    "lade",
    "kpada",
    "rogun"
  ],
  "Asa": [
    "asa",
    "afon",
    "alapa",
    "otte",
    "laduba",
    "budo egba",
    "ogbondoroko",
    "lasoju",
    "ballah",
    "eiyenkorin",
    "aboto"
  ],
  "Kaiama": [
    "kaiama",
    "gwaria",
    "wojibe",
    "kemanji",
    "kuro"
  ],
  "Baruten": [
    "baruten",
    "kosubosu",
    "okuta",
    "ilesha-baruba",
    "ilesha baruba",
    "yashikira",
    "chikanda",
    "gwanara"
  ],
  "Ekiti": [
    "ekiti",
    "araromi-opin",
    "araromi opin",
    "osi",
    "isapa",
    "koro",
    "obbo-aiyegunle",
    "obbo aiyegunle",
    "obbo-ile",
    "obbo ile",
    "epe-opin"
  ],
  "Oke Ero": [
    "oke ero",
    "oke-ero",
    "iloffa",
    "odo-owa",
    "odo owa",
    "ayedun",
    "iluke",
    "idofin"
  ]
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Automatically determine the Kwara State Local Government Area (LGA) from the supplied location/address.
 * If cannot be confidently determined, returns "LGA not specified".
 */
export function resolveLgaFromLocation(address?: string | null): string {
  if (!address) return "LGA not specified";
  const normalized = address.toLowerCase().trim();
  if (normalized.length < 3) return "LGA not specified";

  // 1. First priority: Check exact LGA names in text (excluding just "Ilorin" because Ilorin is split into West, East, South)
  for (const lga of KWARA_LGAS) {
    const lgaLower = lga.toLowerCase();
    const regex = new RegExp(`\\b${escapeRegex(lgaLower)}\\b`, 'i');
    if (regex.test(normalized)) {
      return lga;
    }
  }

  // 2. Second priority: Match specific landmarks, areas, towns, and streets using word boundaries
  // Check multi-word keywords first (e.g. "basin road", "sulu gambari", "fate road")
  let bestMatch: { lga: string; kwLength: number } | null = null;

  for (const [lga, keywords] of Object.entries(KWARA_LGA_DATASET)) {
    for (const kw of keywords) {
      // Don't match generic words alone like "state", "road", "ilorin"
      if (kw === 'ilorin' || kw === 'kwara' || kw === 'nigeria') continue;
      
      const escaped = escapeRegex(kw);
      const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
      if (regex.test(normalized)) {
        if (!bestMatch || kw.length > bestMatch.kwLength) {
          bestMatch = { lga, kwLength: kw.length };
        }
      }
    }
  }

  if (bestMatch) {
    return bestMatch.lga;
  }

  return "LGA not specified";
}
