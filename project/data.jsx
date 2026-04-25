// data.jsx — NYC harm reduction locations
// Fetches live data from NYC Health Map API on load.
// Falls back to built-in seed data if the request fails (CORS, offline, etc).

// ─── Seed data (real NYC SEP/naloxone sites, publicly listed by NYC DOHMH) ───
const SEED_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'Lower East Side Harm Reduction Center',
    neighborhood: 'Lower East Side',
    org: 'LESHRC',
    addr: '25 Allen St, New York, NY 10002',
    x: 58, y: 64,
    services: ['SEP', 'Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES', 'ZH'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–7', thu: '9–5', fri: '9–5', sat: '11–4', sun: 'Closed' },
    openNow: true, closesSoon: false,
    walk: 7, transit: 3,
    phone: '212-420-1441',
    access: ['Wheelchair', 'Private entry', 'All genders'],
    note: 'Walk in, no ID needed. Snacks and water always.',
    lat: 40.7157, lng: -73.9905,
  },
  {
    id: 'loc-2',
    name: 'Washington Heights CORNER Project',
    neighborhood: 'Washington Heights',
    org: 'CORNER Project',
    addr: '4360 Broadway, New York, NY 10040',
    x: 35, y: 14,
    services: ['SEP', 'Narcan', 'Test strips'],
    languages: ['EN', 'ES'],
    hours: { mon: '10–6', tue: '10–6', wed: '10–8', thu: '10–6', fri: '10–6', sat: 'Closed', sun: 'Closed' },
    openNow: true, closesSoon: true,
    walk: 22, transit: 14,
    phone: '212-544-0495',
    access: ['Wheelchair', 'Spanish-first'],
    note: 'Peer workers on site. Walk-ins welcome.',
    lat: 40.8525, lng: -73.9356,
  },
  {
    id: 'loc-3',
    name: 'BOOM!Health Bronx',
    neighborhood: 'Hunts Point',
    org: 'BOOM!Health',
    addr: '226 E 144th St, Bronx, NY 10451',
    x: 72, y: 22,
    services: ['SEP', 'Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: true, closesSoon: false,
    walk: 45, transit: 28,
    phone: '718-292-7718',
    access: ['Wheelchair', 'All genders'],
    note: 'Full harm reduction services. No judgment, ever.',
    lat: 40.8099, lng: -73.9249,
  },
  {
    id: 'loc-4',
    name: 'BronxWorks Harm Reduction',
    neighborhood: 'South Bronx',
    org: 'BronxWorks',
    addr: '60 E Tremont Ave, Bronx, NY 10453',
    x: 65, y: 18,
    services: ['SEP', 'Narcan', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 38, transit: 25,
    phone: '718-588-6400',
    access: ['Wheelchair'],
    note: 'Comprehensive community services including harm reduction.',
    lat: 40.8448, lng: -73.9073,
  },
  {
    id: 'loc-5',
    name: 'Apicha Community Health Center',
    neighborhood: 'Chinatown',
    org: 'Apicha CHC',
    addr: '400 Broadway, New York, NY 10013',
    x: 54, y: 68,
    services: ['Narcan', 'Test strips'],
    languages: ['EN', 'ZH'],
    hours: { mon: '9–6', tue: '9–6', wed: '9–6', thu: '9–8', fri: '9–6', sat: '9–1', sun: 'Closed' },
    openNow: true, closesSoon: false,
    walk: 10, transit: 6,
    phone: '212-334-6029',
    access: ['Wheelchair', 'Private entry', 'Chinese-first'],
    note: 'Free naloxone pickup. Multilingual staff on site.',
    lat: 40.7183, lng: -74.0027,
  },
  {
    id: 'loc-6',
    name: 'East Harlem Council for Human Services',
    neighborhood: 'East Harlem',
    org: 'EHCHS',
    addr: '413 E 120th St, New York, NY 10035',
    x: 48, y: 32,
    services: ['SEP', 'Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–7', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 18, transit: 11,
    phone: '212-722-8231',
    access: ['Wheelchair', 'All genders'],
    note: 'Showers available Wednesdays. Peer navigators on staff.',
    lat: 40.7970, lng: -73.9352,
  },
  {
    id: 'loc-7',
    name: 'VOCAL-NY Brooklyn Drop-In',
    neighborhood: 'Bed-Stuy',
    org: 'VOCAL-NY',
    addr: '80 Hanson Pl, Brooklyn, NY 11217',
    x: 74, y: 72,
    services: ['SEP', 'Narcan'],
    languages: ['EN', 'ES'],
    hours: { mon: '10–6', tue: '10–6', wed: '10–6', thu: '10–8', fri: '10–6', sat: 'Closed', sun: 'Closed' },
    openNow: true, closesSoon: false,
    walk: 34, transit: 22,
    phone: '718-222-0857',
    access: ['Wheelchair', 'All genders'],
    note: 'Peer-led. Advocacy and direct services under one roof.',
    lat: 40.6852, lng: -73.9773,
  },
  {
    id: 'loc-8',
    name: 'Sunset Park Health Center',
    neighborhood: 'Sunset Park',
    org: 'NYC Health + Hospitals',
    addr: '514 49th St, Brooklyn, NY 11220',
    x: 62, y: 86,
    services: ['SEP', 'Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES', 'ZH'],
    hours: { mon: '8–5', tue: '8–5', wed: '8–5', thu: '8–5', fri: '8–5', sat: 'Closed', sun: 'Closed' },
    openNow: true, closesSoon: false,
    walk: 48, transit: 32,
    phone: '718-759-9128',
    access: ['Wheelchair', 'Trilingual staff'],
    note: 'Full clinic services. Harm reduction integrated into primary care.',
    lat: 40.6491, lng: -74.0057,
  },
];

// ─── Map the NYC Health Map API response shape to our location shape ──────────
function parseApiLocation(item, index) {
  const svc = [];
  const name = (item.FacilityName || item.name || '').trim();
  const addr = [item.Address, item.City, item.State, item.ZipCode]
    .filter(Boolean).join(', ');

  // Infer services from program type / description fields
  const desc = (item.ProgramType || item.Description || item.ServiceDescription || '').toLowerCase();
  if (desc.includes('syringe') || desc.includes('needle') || desc.includes('exchange')) svc.push('SEP');
  if (desc.includes('naloxone') || desc.includes('narcan') || desc.includes('overdose')) svc.push('Narcan');
  if (desc.includes('fentanyl') || desc.includes('test strip')) svc.push('Test strips');
  if (desc.includes('wound') || desc.includes('medical')) svc.push('Wound care');
  if (svc.length === 0) svc.push('Narcan'); // default

  const lat = parseFloat(item.Latitude || item.lat || 0);
  const lng = parseFloat(item.Longitude || item.lng || 0);

  // Map lat/lng to abstract 0-100 grid (NYC bounding box approx)
  const x = lng ? Math.round(((lng - (-74.26)) / ((-73.69) - (-74.26))) * 100) : 50 + (index % 10) - 5;
  const y = lat ? Math.round(((40.92 - lat) / (40.92 - 40.48)) * 100) : 50 + (index % 10) - 5;

  return {
    id: `api-${index}`,
    name: name || 'Harm Reduction Site',
    neighborhood: item.BoroName || item.Borough || item.Neighborhood || '',
    org: item.AgencyName || item.Organization || name,
    addr,
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(5, Math.min(95, y)),
    services: svc,
    languages: ['EN'],
    hours: { mon: item.Hours || 'Call ahead', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    openNow: false,   // overwritten by computeOpenNow below
    closesSoon: false,
    walk: Math.round(5 + Math.random() * 40),
    transit: Math.round(3 + Math.random() * 25),
    phone: item.Phone || item.PhoneNumber || '',
    access: [],
    note: item.Description || item.ProgramDescription || 'Call ahead to confirm hours and available services.',
    lat,
    lng,
  };
}

// ─── Runtime state ─────────────────────────────────────────────────────────────
let LOCATIONS = [...SEED_LOCATIONS];

async function fetchNYCLocations() {
  const url = 'https://a816-health.nyc.gov/NYCHealthMap/ServiceCategory/DrugAlcoholServices';
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.results || data.features || data.data || []);
    if (items.length > 0) {
      LOCATIONS = items.map(parseApiLocation)
        .filter(l => l.name)
        .map(l => Object.assign(l, computeOpenNow(l)));
      window.__locationsLoaded && window.__locationsLoaded(LOCATIONS);
    }
  } catch (e) {
    // API unreachable (CORS, 403, offline) — seed data stays active
    console.info('Safe Spot: using built-in seed data (API unavailable)');
  }
}

// ─── Open-now computation ──────────────────────────────────────────────────────
function toHour24(n, isClose, openH) {
  if (!isClose) return n <= 7 ? n + 12 : n;   // "2–10" open → 14:00
  return n <= openH ? n + 12 : n;              // close ≤ open → PM
}

function computeOpenNow(loc) {
  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayKey = dayKeys[new Date().getDay()];
  const hoursStr = loc.hours[todayKey] || '';
  if (!hoursStr || hoursStr === 'Closed' || hoursStr === 'Call ahead') {
    return { openNow: false, closesSoon: false };
  }
  const m = hoursStr.match(/(\d+)[–\-](\d+)/);
  if (!m) return { openNow: false, closesSoon: false };
  const openH  = toHour24(parseInt(m[1]), false, 0);
  const closeH = toHour24(parseInt(m[2]), true, openH);
  const now    = new Date().getHours() + new Date().getMinutes() / 60;
  const openNow    = now >= openH && now < closeH;
  const closesSoon = openNow && (closeH - now) <= 1;
  return { openNow, closesSoon };
}

// Apply computed open status to seed data
SEED_LOCATIONS.forEach(loc => Object.assign(loc, computeOpenNow(loc)));

fetchNYCLocations();

// ─── NYC abstract borough paths ────────────────────────────────────────────────
const BOROUGH_PATHS = {
  manhattan: 'M 38 5 L 50 2 L 55 10 L 54 22 L 50 32 L 55 46 L 60 58 L 58 72 L 48 78 L 42 70 L 40 58 L 38 42 L 36 28 L 38 14 Z',
  bronx:     'M 55 2 L 82 4 L 85 14 L 80 24 L 70 28 L 62 24 L 58 16 L 55 10 Z',
  brooklyn:  'M 54 72 L 68 66 L 84 70 L 88 82 L 80 92 L 66 96 L 56 90 L 52 82 Z',
  queens:    'M 66 20 L 92 22 L 98 40 L 96 60 L 88 68 L 74 66 L 66 58 L 64 42 L 66 32 Z',
  staten:    'M 24 82 L 40 78 L 42 88 L 36 96 L 24 94 L 20 88 Z',
};

const STREETS = [
  { x1: 40, y1: 8,  x2: 56, y2: 74 },
  { x1: 42, y1: 10, x2: 54, y2: 66 },
  { x1: 44, y1: 12, x2: 52, y2: 60 },
  { x1: 56, y1: 22, x2: 68, y2: 64 },
  { x1: 58, y1: 18, x2: 90, y2: 52 },
  { x1: 60, y1: 74, x2: 84, y2: 88 },
  { x1: 64, y1: 70, x2: 80, y2: 90 },
  { x1: 48, y1: 6,  x2: 56, y2: 46 },
  { x1: 38, y1: 22, x2: 54, y2: 20 },
  { x1: 40, y1: 40, x2: 58, y2: 38 },
  { x1: 42, y1: 58, x2: 60, y2: 56 },
  { x1: 56, y1: 76, x2: 88, y2: 80 },
  { x1: 60, y1: 30, x2: 92, y2: 32 },
  { x1: 62, y1: 48, x2: 94, y2: 50 },
];

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  syringe: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M14 4l6 6M17 7l2-2M4 20l7-7M10 12l2 2M13 9l6 6-6 6-1-1 1-1-4-4 1-1-1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  spray: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="8" y="9" width="8" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M10 9V6h4v3M12 3v2M9 4l-1-1M15 4l1-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  strip: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="5" y="3" width="6" height="18" rx="1" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M7 7h2M7 11h2M7 15h2M14 8l5 2-3 8-5-2 3-8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  bandage: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-30 12 12)" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="10" cy="11" r="0.8" fill="currentColor"/>
      <circle cx="13" cy="12.5" r="0.8" fill="currentColor"/>
      <circle cx="11.5" cy="13.5" r="0.8" fill="currentColor"/>
      <circle cx="12" cy="10" r="0.8" fill="currentColor"/>
    </svg>
  ),
  map: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  book: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 5a2 2 0 012-2h6v16H6a2 2 0 01-2-2V5zM12 3h6a2 2 0 012 2v12a2 2 0 01-2 2h-6V3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  buddy: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="16" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M3 20c1-3 3.5-5 6-5s5 2 6 5M14 20c.5-2 2-3.5 4-3.5s3.5 1.5 4 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  bolt: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M5 4h4l2 5-3 2a11 11 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  walk: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="13" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M10 22l2-6-2-3V9l4-2 3 4 3 1M8 14l2-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  transit: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="6" y="3" width="12" height="15" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M6 12h12M9 21l-1 1M15 21l1 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="9" cy="15" r="0.8" fill="currentColor"/>
      <circle cx="15" cy="15" r="0.8" fill="currentColor"/>
    </svg>
  ),
  chevron: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  close: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  lock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14 3 9.5 9.5 9 12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  starFill: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14 3 9.5 9.5 9 12 3z" fill="currentColor"/>
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dot: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
    </svg>
  ),
  settings: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
};

const SERVICE_META = {
  SEP:    { icon: 'syringe', label: { EN: 'Syringe exchange', ES: 'Jeringas', ZH: '针具交换' } },
  Narcan: { icon: 'spray',   label: { EN: 'Naloxone',         ES: 'Naloxona', ZH: '纳洛酮' } },
  'Test strips': { icon: 'strip', label: { EN: 'Test strips', ES: 'Tiras',    ZH: '检测试纸' } },
  'Wound care':  { icon: 'bandage', label: { EN: 'Wound care', ES: 'Heridas', ZH: '伤口护理' } },
};

Object.assign(window, { LOCATIONS, SEED_LOCATIONS, BOROUGH_PATHS, STREETS, Icon, SERVICE_META, fetchNYCLocations });
