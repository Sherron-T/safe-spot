// data.jsx — mock NYC harm reduction locations + icons
// Locations are fictional but placed at real-ish NYC coordinates on our abstract grid.

const LOCATIONS = [
  {
    id: 'loc-1',
    name: 'Lower East Side Drop-In',
    neighborhood: 'Lower East Side',
    org: 'Community Wellness Collective',
    addr: '112 Allen St',
    // grid coords in our 0-100 abstract NYC canvas
    x: 58, y: 64,
    services: ['SEP', 'Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES', 'ZH'],
    hours: { mon: '9–7', tue: '9–7', wed: '9–9', thu: '9–7', fri: '9–7', sat: '11–4', sun: 'Closed' },
    openNow: true, closesSoon: false,
    walk: 7, transit: 3,
    phone: '212-555-0140',
    access: ['Wheelchair', 'Private entry', 'All genders'],
    note: 'Walk in, no ID needed. Snacks and water always.',
  },
  {
    id: 'loc-2',
    name: 'Washington Heights Outreach',
    neighborhood: 'Washington Heights',
    org: 'Alto Salud',
    addr: '3940 Broadway',
    x: 35, y: 14,
    services: ['SEP', 'Narcan', 'Test strips'],
    languages: ['EN', 'ES'],
    hours: { mon: '10–6', tue: '10–6', wed: '10–8', thu: '10–6', fri: '10–6', sat: 'Closed', sun: 'Closed' },
    openNow: true, closesSoon: true,
    walk: 22, transit: 14,
    phone: '212-555-0121',
    access: ['Wheelchair', 'Spanish-first'],
    note: 'Peer workers on site. Walk-ins welcome.',
  },
  {
    id: 'loc-3',
    name: 'Bed-Stuy Safer Use',
    neighborhood: 'Bedford-Stuyvesant',
    org: 'Brooklyn Harm Reduction Network',
    addr: '1180 Fulton St',
    x: 74, y: 72,
    services: ['SEP', 'Narcan', 'Wound care'],
    languages: ['EN'],
    hours: { mon: 'Closed', tue: '12–8', wed: '12–8', thu: '12–8', fri: '12–8', sat: '12–6', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 34, transit: 22,
    phone: '718-555-0177',
    access: ['Private entry', 'All genders'],
    note: 'Mobile van Thursdays at Nostrand & Fulton.',
  },
  {
    id: 'loc-4',
    name: 'Hunts Point Mobile Unit',
    neighborhood: 'Hunts Point',
    org: 'BOOM!Health',
    addr: 'Hunts Point Ave & Bruckner',
    x: 72, y: 22,
    services: ['SEP', 'Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '2–10', tue: '2–10', wed: '2–10', thu: '2–10', fri: '2–10', sat: 'Closed', sun: 'Closed' },
    openNow: true, closesSoon: false,
    walk: 45, transit: 28,
    phone: '718-555-0102',
    access: ['Wheelchair', 'Overnight'],
    note: 'Van on the corner. Look for the blue lights.',
  },
  {
    id: 'loc-5',
    name: 'Chinatown Community Health',
    neighborhood: 'Chinatown',
    org: 'Downtown Mutual Aid',
    addr: '34 Bowery',
    x: 54, y: 68,
    services: ['Narcan', 'Test strips'],
    languages: ['EN', 'ZH'],
    hours: { mon: '11–6', tue: '11–6', wed: '11–6', thu: '11–8', fri: '11–6', sat: '11–4', sun: 'Closed' },
    openNow: true, closesSoon: false,
    walk: 10, transit: 6,
    phone: '212-555-0188',
    access: ['Private entry', 'Chinese-first'],
    note: 'Free naloxone pickup. No questions asked.',
  },
  {
    id: 'loc-6',
    name: 'East Harlem Wellness',
    neighborhood: 'East Harlem',
    org: 'NY Harm Reduction Educators',
    addr: '113 E 106th St',
    x: 48, y: 32,
    services: ['SEP', 'Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–7', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 18, transit: 11,
    phone: '212-555-0169',
    access: ['Wheelchair', 'All genders'],
    note: 'Showers available Wednesdays.',
  },
  {
    id: 'loc-7',
    name: 'Sunset Park Drop-In',
    neighborhood: 'Sunset Park',
    org: 'VOCAL-NY',
    addr: '4201 4th Ave',
    x: 62, y: 86,
    services: ['SEP', 'Narcan'],
    languages: ['EN', 'ES', 'ZH'],
    hours: { mon: '10–6', tue: '10–6', wed: '10–6', thu: '10–8', fri: '10–6', sat: 'Closed', sun: 'Closed' },
    openNow: true, closesSoon: false,
    walk: 48, transit: 32,
    phone: '718-555-0144',
    access: ['Wheelchair', 'Trilingual staff'],
    note: 'Peer-led groups Tuesday nights.',
  },
];

// NYC-ish abstract borough paths on a 100×100 canvas
const BOROUGH_PATHS = {
  manhattan: 'M 38 5 L 50 2 L 55 10 L 54 22 L 50 32 L 55 46 L 60 58 L 58 72 L 48 78 L 42 70 L 40 58 L 38 42 L 36 28 L 38 14 Z',
  bronx:     'M 55 2 L 82 4 L 85 14 L 80 24 L 70 28 L 62 24 L 58 16 L 55 10 Z',
  brooklyn:  'M 54 72 L 68 66 L 84 70 L 88 82 L 80 92 L 66 96 L 56 90 L 52 82 Z',
  queens:    'M 66 20 L 92 22 L 98 40 L 96 60 L 88 68 L 74 66 L 66 58 L 64 42 L 66 32 Z',
  staten:    'M 24 82 L 40 78 L 42 88 L 36 96 L 24 94 L 20 88 Z',
};

// example streets (major grid)
const STREETS = [
  { x1: 40, y1: 8,  x2: 56, y2: 74 },  // 1st Ave-ish
  { x1: 42, y1: 10, x2: 54, y2: 66 },
  { x1: 44, y1: 12, x2: 52, y2: 60 },
  { x1: 56, y1: 22, x2: 68, y2: 64 },
  { x1: 58, y1: 18, x2: 90, y2: 52 },
  { x1: 60, y1: 74, x2: 84, y2: 88 },
  { x1: 64, y1: 70, x2: 80, y2: 90 },
  { x1: 48, y1: 6,  x2: 56, y2: 46 },
  // crosstown
  { x1: 38, y1: 22, x2: 54, y2: 20 },
  { x1: 40, y1: 40, x2: 58, y2: 38 },
  { x1: 42, y1: 58, x2: 60, y2: 56 },
  { x1: 56, y1: 76, x2: 88, y2: 80 },
  { x1: 60, y1: 30, x2: 92, y2: 32 },
  { x1: 62, y1: 48, x2: 94, y2: 50 },
];

// icons — use outlines, line:1.6, round caps. No brand icons.
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
};

// service key → icon + label
const SERVICE_META = {
  SEP:    { icon: 'syringe', label: { EN: 'Syringe exchange', ES: 'Jeringas', ZH: '针具交换' } },
  Narcan: { icon: 'spray',   label: { EN: 'Naloxone',         ES: 'Naloxona', ZH: '纳洛酮' } },
  'Test strips': { icon: 'strip', label: { EN: 'Test strips', ES: 'Tiras',    ZH: '检测试纸' } },
  'Wound care':  { icon: 'bandage', label: { EN: 'Wound care', ES: 'Heridas', ZH: '伤口护理' } },
};

Object.assign(window, { LOCATIONS, BOROUGH_PATHS, STREETS, Icon, SERVICE_META });
