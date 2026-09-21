/**
 * Known geographic coordinates for communes in Haiti and default fallbacks.
 */
export const COMMUNE_COORDINATES: Record<string, [number, number]> = {
  // Ouest
  "port-au-prince": [18.5392, -72.3350],
  "delmas": [18.5447, -72.3028],
  "petion-ville": [18.5125, -72.2853],
  "pétion-ville": [18.5125, -72.2853],
  "carrefour": [18.5411, -72.3992],
  "cite soleil": [18.5833, -72.3333],
  "cité soleil": [18.5833, -72.3333],
  "tabarre": [18.5833, -72.2667],
  "croix-des-bouquets": [18.5778, -72.2289],
  "kenscoff": [18.4500, -72.2833],
  "gressier": [18.5400, -72.5200],
  "leogane": [18.5111, -72.6333],
  "léogâne": [18.5111, -72.6333],
  "petit-goave": [18.4314, -72.8683],
  "petit-goâve": [18.4314, -72.8683],
  "grand-goave": [18.4278, -72.7686],
  "grand-goâve": [18.4278, -72.7686],
  "arcahaie": [18.7667, -72.5167],
  "cabaret": [18.7333, -72.4167],
  "cornillon": [18.6744, -71.9519],
  "ansea-galets": [18.8333, -72.8667],
  "anse-a-galets": [18.8333, -72.8667],
  "pointe-a-raquette": [18.7833, -73.0667],

  // Nord
  "cap-haitien": [19.7578, -72.2044],
  "cap-haïtien": [19.7578, -72.2044],
  "limonade": [19.6833, -72.1333],
  "quartier-morin": [19.6975, -72.1581],
  "plaine-du-nord": [19.6833, -72.2667],
  "milot": [19.6083, -72.2167],
  "acuil-du-nord": [19.6667, -72.4167],
  "acul-du-nord": [19.6667, -72.4167],
  "grande-riviere-du-nord": [19.5833, -72.1667],
  "dondon": [19.5333, -72.2333],
  "saint-raphael": [19.4333, -72.2000],
  "saint-raphaël": [19.4333, -72.2000],
  "bahon": [19.4667, -72.1167],
  "rannquitte": [19.4167, -72.0833],
  "pignon": [19.3333, -72.1167],
  "limbe": [19.7042, -72.4014],
  "limbée": [19.7042, -72.4014],
  "bas-limbe": [19.8000, -72.3500],
  "port-margot": [19.7500, -72.4333],
  "borgne": [19.8500, -72.5333],

  // Artibonite
  "gonaives": [19.4500, -72.6833],
  "gonaïves": [19.4500, -72.6833],
  "saint-marc": [19.1082, -72.6938],
  "verrettes": [19.0500, -72.4667],
  "petite-riviere-de-l-artibonite": [19.1333, -72.4833],
  "petite-rivière-de-l'artibonite": [19.1333, -72.4833],
  "dessalines": [19.2667, -72.5167],
  "marchand-dessalines": [19.2667, -72.5167],
  "saint-michel-de-l-attalaye": [19.3833, -72.3333],
  "ennery": [19.4833, -72.4833],
  "l-estere": [19.3333, -72.6667],
  "l'estère": [19.3333, -72.6667],
  "desdunes": [19.2833, -72.6500],
  "grande-saline": [19.2667, -72.7667],
  "montrouis": [18.9500, -72.7167],
  "la-chapelle": [18.9167, -72.3333],

  // Sud
  "les cayes": [18.1933, -73.7460],
  "cayes": [18.1933, -73.7460],
  "torbeck": [18.1667, -73.8167],
  "chantal": [18.2000, -73.8833],
  "camp-perrin": [18.3167, -73.8167],
  "cavaillon": [18.3000, -73.6500],
  "saint-louis-du-sud": [18.2667, -73.5500],
  "aquin": [18.2833, -73.4000],
  "port-salut": [18.0667, -73.9167],
  "saint-jean-du-sud": [18.0833, -73.8500],
  "roche-a-bateau": [18.1833, -74.0000],
  "coteaux": [18.2167, -74.0333],
  "port-a-piment": [18.2500, -74.1000],
  "tiburon": [18.3333, -74.4000],
  "les-anglais": [18.3000, -74.2167],

  // Sud-Est
  "jacmel": [18.2342, -72.5347],
  "marigot": [18.2333, -72.3167],
  "cayes-jacmel": [18.2167, -72.4000],
  "la-vallee-de-jacmel": [18.2833, -72.6667],
  "bainet": [18.1833, -72.7500],
  "grand-gosier": [18.2167, -71.9333],
  "thiotte": [18.2500, -71.8500],
  "belle-anse": [18.2333, -72.0667],
  "anse-a-pitres": [18.0500, -71.7500],

  // Nord-Ouest
  "port-de-paix": [19.9389, -72.8306],
  "saint-louis-du-nord": [19.9333, -72.7167],
  "anse-a-foleur": [19.9000, -72.6167],
  "jean-rabel": [19.8500, -73.1833],
  "mole-saint-nicolas": [19.8000, -73.3667],
  "bombardopolis": [19.6833, -73.3333],
  "baie-de-henne": [19.6667, -73.2000],

  // Nord-Est
  "fort-liberte": [19.6644, -71.8389],
  "fort-liberté": [19.6644, -71.8389],
  "ouanaminthe": [19.5481, -71.7239],
  "trou-du-nord": [19.6167, -72.0167],
  "ferrier": [19.6333, -71.7833],
  "perches": [19.5167, -71.9167],
  "terrier-rouge": [19.6000, -71.9333],
  "caracol": [19.7000, -72.0167],
  "sainte-suzanne": [19.5167, -72.0833],

  // Centre
  "hinche": [19.1447, -72.0086],
  "mirebalais": [18.8333, -72.1000],
  "lascahobas": [18.8300, -71.9300],
  "belladere": [18.8667, -71.7833],
  "belladère": [18.8667, -71.7833],
  "savanette": [18.7833, -71.8333],
  "thomonde": [19.0167, -71.9667],
  "maissade": [19.1667, -72.1333],
  "cerca-la-source": [19.1667, -71.7833],
  "boucan-carre": [18.9667, -72.2000],

  // Grand'Anse
  "jeremie": [18.6417, -74.1167],
  "jérémie": [18.6417, -74.1167],
  "abricots": [18.6333, -74.3000],
  "bonbon": [18.6833, -74.2500],
  "trou-bonbon": [18.6833, -74.2500],
  "moron": [18.5500, -74.2500],
  "chambellan": [18.5667, -74.3167],
  "dame-marie": [18.5667, -74.4167],
  "anse-d-hainault": [18.4833, -74.4500],
  "les-irois": [18.4000, -74.4500],
  "corail": [18.5667, -73.8833],
  "pestel": [18.5333, -73.8000],
  "roseaux": [18.6000, -73.9833],
  "beaumont": [18.4833, -73.9667],

  // Nippes
  "miragoane": [18.4422, -73.0878],
  "miragoâne": [18.4422, -73.0878],
  "petite-riviere-de-nippes": [18.4833, -73.2333],
  "anse-a-veau": [18.5000, -73.3500],
  "l-asile": [18.3333, -73.4167],
  "l'asile": [18.3333, -73.4167],
  "fond-des-negres": [18.3667, -73.2167],
  "paillant": [18.4167, -73.1500],
  "baraderes": [18.4833, -73.6333],
  "baradères": [18.4833, -73.6333],
  "grand-boucan": [18.5500, -73.6167],
  "plaisance-du-sud": [18.4000, -73.5333],
  "arnaud": [18.4667, -73.3000]
};

const DEFAULT_HAITI_CENTER: [number, number] = [18.5392, -72.3350];

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Checks whether coordinates are valid realistic coordinates for Haiti or global map.
 */
export function isValidCoordinate(lat?: number | null, lon?: number | null): boolean {
  if (lat === null || lat === undefined || lon === null || lon === undefined) return false;
  const numLat = Number(lat);
  const numLon = Number(lon);
  if (isNaN(numLat) || isNaN(numLon)) return false;
  // Discard 0,0 and dummy 10,10
  if (numLat === 0 && numLon === 0) return false;
  if (Math.abs(numLat - 10.0) < 0.001 && Math.abs(numLon - 10.0) < 0.001) return false;
  return numLat >= -90 && numLat <= 90 && numLon >= -180 && numLon <= 180;
}

/**
 * Resolves coordinates for an address with deterministic jitter if falling back to city coordinates.
 */
export function resolveAddressCoordinates(
  adresse: {
    id_adresses?: number;
    latitude?: number | null;
    longitude?: number | null;
    libelle_adresse?: string;
    section_communale?: string;
    commune?: { libelle_commune?: string };
    id_commune?: number;
  },
  communeName?: string,
  index = 0
): { lat: number; lon: number; isEstimated: boolean } {
  // 1. If explicit valid coordinates exist, return them
  if (isValidCoordinate(adresse.latitude, adresse.longitude)) {
    return {
      lat: Number(adresse.latitude),
      lon: Number(adresse.longitude),
      isEstimated: false,
    };
  }

  // 2. Try to find coordinates from commune / city name
  const rawCityName =
    communeName ||
    adresse.commune?.libelle_commune ||
    adresse.section_communale ||
    "Port-au-Prince";

  const normalizedCity = normalizeString(rawCityName);
  let baseCoords = COMMUNE_COORDINATES[normalizedCity];

  if (!baseCoords) {
    // Try partial match
    for (const key of Object.keys(COMMUNE_COORDINATES)) {
      if (normalizedCity.includes(key) || key.includes(normalizedCity)) {
        baseCoords = COMMUNE_COORDINATES[key];
        break;
      }
    }
  }

  if (!baseCoords) {
    baseCoords = DEFAULT_HAITI_CENTER;
  }

  // 3. Apply small deterministic golden spiral offset so multiple addresses in the same city are all individually visible
  const addressSeed = (adresse.id_adresses || (index + 1) * 7);
  const angle = (addressSeed * 137.5) * (Math.PI / 180);
  const radius = 0.0035 + (addressSeed % 10) * 0.0015;

  const latOffset = Math.cos(angle) * radius;
  const lonOffset = Math.sin(angle) * radius;

  return {
    lat: baseCoords[0] + latOffset,
    lon: baseCoords[1] + lonOffset,
    isEstimated: true,
  };
}
