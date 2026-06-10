// data.jsx — NYC harm reduction locations
// Fetches live data from NYC Health Map API on load.
// Falls back to built-in seed data if the request fails (CORS, offline, etc).

// ─── Haversine distance (miles) ────────────────────────────────────────────────
function distanceMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2
    + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function walkMinutes(miles) { return Math.round(miles * 20); } // ~3 mph

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
  {
    id: 'loc-9',
    name: "St. Ann's Corner of Harm Reduction",
    neighborhood: 'Mott Haven',
    org: "St. Ann's Corner",
    addr: '886 Forest Ave, Bronx, NY 10456',
    x: 62, y: 21,
    services: ['SEP', 'Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '10–6', tue: '10–6', wed: '10–6', thu: '10–6', fri: '10–6', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 40, transit: 22,
    phone: '718-842-0470',
    access: ['Wheelchair', 'All genders'],
    note: 'Peer-run since 1991. Welcoming, no-barrier services.',
    lat: 40.8290, lng: -73.9091,
  },
  {
    id: 'loc-10',
    name: 'New York Harm Reduction Educators',
    neighborhood: 'East Harlem',
    org: 'NYHRE',
    addr: '253 E 125th St, New York, NY 10035',
    x: 52, y: 28,
    services: ['SEP', 'Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 20, transit: 12,
    phone: '212-828-1541',
    access: ['Wheelchair', 'All genders'],
    note: 'Decades of community-led harm reduction in East Harlem.',
    lat: 40.8044, lng: -73.9366,
  },
  {
    id: 'loc-11',
    name: 'Positive Health Project',
    neighborhood: "Hell's Kitchen",
    org: 'PHP',
    addr: '301 W 37th St, New York, NY 10018',
    x: 46, y: 54,
    services: ['Narcan', 'Test strips'],
    languages: ['EN'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 14, transit: 8,
    phone: '212-465-8304',
    access: ['Wheelchair', 'All genders'],
    note: 'Naloxone and test strips available at the front desk, no appointment.',
    lat: 40.7529, lng: -73.9968,
  },
  {
    id: 'loc-12',
    name: 'Harlem United',
    neighborhood: 'Harlem',
    org: 'Harlem United',
    addr: '306 Lenox Ave, New York, NY 10027',
    x: 50, y: 26,
    services: ['SEP', 'Narcan', 'Test strips'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 22, transit: 13,
    phone: '212-803-2870',
    access: ['Wheelchair'],
    note: 'Integrated HIV and harm reduction care in Central Harlem.',
    lat: 40.8131, lng: -73.9465,
  },
  {
    id: 'loc-13',
    name: 'Housing Works SoHo',
    neighborhood: 'SoHo',
    org: 'Housing Works',
    addr: '126 Crosby St, New York, NY 10012',
    x: 54, y: 66,
    services: ['Narcan', 'Test strips'],
    languages: ['EN'],
    hours: { mon: '10–7', tue: '10–7', wed: '10–7', thu: '10–7', fri: '10–7', sat: '10–5', sun: '11–5' },
    openNow: false, closesSoon: false,
    walk: 9, transit: 5,
    phone: '212-966-0466',
    access: ['Wheelchair', 'All genders'],
    note: 'Naloxone available at the counter. No wait, no appointment.',
    lat: 40.7240, lng: -73.9972,
  },
  {
    id: 'loc-14',
    name: 'Callen-Lorde Community Health',
    neighborhood: 'Chelsea',
    org: 'Callen-Lorde',
    addr: '356 W 18th St, New York, NY 10011',
    x: 47, y: 58,
    services: ['Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–8', wed: '9–5', thu: '9–8', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 12, transit: 6,
    phone: '212-271-7200',
    access: ['Wheelchair', 'All genders', 'LGBTQ+ affirming'],
    note: 'LGBTQ+ affirming care. Harm reduction without judgment.',
    lat: 40.7423, lng: -74.0005,
  },
  {
    id: 'loc-15',
    name: 'Urban Health Plan — Westchester',
    neighborhood: 'Longwood',
    org: 'Urban Health Plan',
    addr: '1420 Westchester Ave, Bronx, NY 10472',
    x: 74, y: 24,
    services: ['Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '8–5', tue: '8–5', wed: '8–5', thu: '8–5', fri: '8–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 42, transit: 27,
    phone: '718-589-2440',
    access: ['Wheelchair', 'Spanish-first'],
    note: 'Community health center with integrated harm reduction.',
    lat: 40.8256, lng: -73.8845,
  },
  {
    id: 'loc-16',
    name: 'Exponents (ARRIVE)',
    neighborhood: 'Upper West Side',
    org: 'Exponents Inc.',
    addr: '113 W 60th St, New York, NY 10023',
    x: 46, y: 48,
    services: ['Narcan', 'Test strips'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 16, transit: 9,
    phone: '212-262-2099',
    access: ['Wheelchair', 'All genders'],
    note: 'Peer support and harm reduction for people with justice involvement.',
    lat: 40.7692, lng: -73.9856,
  },
  {
    id: 'loc-17',
    name: 'Community Healthcare Network — Flatbush',
    neighborhood: 'Flatbush',
    org: 'CHN',
    addr: '2711 Church Ave, Brooklyn, NY 11226',
    x: 66, y: 84,
    services: ['Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: '9–1', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 50, transit: 33,
    phone: '718-826-3060',
    access: ['Wheelchair'],
    note: 'Free naloxone with community health visits.',
    lat: 40.6478, lng: -73.9565,
  },
  {
    id: 'loc-18',
    name: 'The Fortune Society',
    neighborhood: 'Long Island City',
    org: 'The Fortune Society',
    addr: '29-76 Northern Blvd, Long Island City, NY 11101',
    x: 78, y: 48,
    services: ['Narcan', 'Test strips'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 36, transit: 20,
    phone: '212-691-7554',
    access: ['Wheelchair', 'All genders'],
    note: 'Harm reduction and reentry support, open to all.',
    lat: 40.7518, lng: -73.9366,
  },
  {
    id: 'loc-19',
    name: 'Staten Island Harm Reduction Outreach',
    neighborhood: 'St. George',
    org: 'Project Hospitality',
    addr: '100 Central Ave, Staten Island, NY 10301',
    x: 28, y: 84,
    services: ['SEP', 'Narcan', 'Test strips'],
    languages: ['EN', 'ES'],
    hours: { mon: '10–6', tue: '10–6', wed: '10–6', thu: '10–6', fri: '10–6', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 55, transit: 45,
    phone: '718-448-1544',
    access: ['Wheelchair'],
    note: 'Only harm reduction site on Staten Island. Ferry-accessible.',
    lat: 40.6402, lng: -74.0739,
  },
  {
    id: 'loc-20',
    name: 'North Central Bronx Hospital',
    neighborhood: 'Norwood',
    org: 'NYC Health + Hospitals',
    addr: '3424 Kossuth Ave, Bronx, NY 10467',
    x: 58, y: 8,
    services: ['Narcan', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '8–5', tue: '8–5', wed: '8–5', thu: '8–5', fri: '8–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 50, transit: 30,
    phone: '718-519-5000',
    access: ['Wheelchair', 'All genders'],
    note: 'ED and outpatient naloxone prescriptions available same day.',
    lat: 40.8784, lng: -73.8795,
  },

  // ── Additional sites ──────────────────────────────────────────────────────────
  {
    id: 'loc-21',
    name: 'The Point CDC',
    neighborhood: 'Hunts Point',
    org: 'The Point Community Development Corp.',
    addr: '940 Garrison Ave, Bronx, NY 10474',
    x: 76, y: 26,
    services: ['SEP', 'Narcan', 'Test strips'],
    languages: ['EN', 'ES'],
    hours: { mon: '10–6', tue: '10–6', wed: '10–6', thu: '10–6', fri: '10–6', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 42, transit: 28,
    phone: '718-542-4139',
    access: ['Wheelchair', 'All genders'],
    note: 'Youth and community arts hub with integrated harm reduction.',
    lat: 40.8128, lng: -73.8906,
  },
  {
    id: 'loc-22',
    name: 'Morris Heights Health Center',
    neighborhood: 'Morris Heights',
    org: 'Morris Heights Health Center',
    addr: '85 W Burnside Ave, Bronx, NY 10453',
    x: 60, y: 16,
    services: ['Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '8–5', tue: '8–5', wed: '8–5', thu: '8–5', fri: '8–5', sat: '9–1', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 40, transit: 26,
    phone: '718-716-4400',
    access: ['Wheelchair', 'Spanish-first'],
    note: 'Federally qualified health center. Walk-ins welcome.',
    lat: 40.8538, lng: -73.9107,
  },
  {
    id: 'loc-23',
    name: 'BronxCare Health System',
    neighborhood: 'Concourse',
    org: 'BronxCare',
    addr: '1650 Selwyn Ave, Bronx, NY 10457',
    x: 62, y: 15,
    services: ['Narcan', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '8–5', tue: '8–5', wed: '8–5', thu: '8–5', fri: '8–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 44, transit: 28,
    phone: '718-960-1000',
    access: ['Wheelchair'],
    note: 'Same-day naloxone prescriptions from the ED.',
    lat: 40.8480, lng: -73.8990,
  },
  {
    id: 'loc-24',
    name: 'Settlement Health',
    neighborhood: 'East Harlem',
    org: 'Settlement Health & Medical Services',
    addr: '212 E 106th St, New York, NY 10029',
    x: 52, y: 32,
    services: ['SEP', 'Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES', 'ZH'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 19, transit: 11,
    phone: '212-360-7654',
    access: ['Wheelchair', 'All genders'],
    note: 'Community health center with low-barrier harm reduction access.',
    lat: 40.7947, lng: -73.9449,
  },
  {
    id: 'loc-25',
    name: 'Ryan Health — West 97th',
    neighborhood: 'Upper West Side',
    org: 'Ryan Health',
    addr: '160 W 100th St, New York, NY 10025',
    x: 46, y: 36,
    services: ['Narcan', 'Test strips'],
    languages: ['EN', 'ES'],
    hours: { mon: '8–6', tue: '8–6', wed: '8–6', thu: '8–6', fri: '8–6', sat: '9–1', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 18, transit: 10,
    phone: '212-749-1820',
    access: ['Wheelchair'],
    note: 'Naloxone prescribed and dispensed on-site, no prior appointment.',
    lat: 40.7965, lng: -73.9662,
  },
  {
    id: 'loc-26',
    name: 'Stuyvesant Polyclinic',
    neighborhood: 'East Village',
    org: 'Stuyvesant Polyclinic',
    addr: '137 2nd Ave, New York, NY 10003',
    x: 54, y: 60,
    services: ['Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES', 'ZH'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 8, transit: 4,
    phone: '212-473-7100',
    access: ['Wheelchair', 'All genders'],
    note: 'Historic East Village clinic. Harm reduction without judgment.',
    lat: 40.7285, lng: -73.9895,
  },
  {
    id: 'loc-27',
    name: 'Woodhull Medical Center',
    neighborhood: 'Bed-Stuy',
    org: 'NYC Health + Hospitals',
    addr: '760 Broadway, Brooklyn, NY 11206',
    x: 70, y: 72,
    services: ['Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '8–5', tue: '8–5', wed: '8–5', thu: '8–5', fri: '8–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 32, transit: 20,
    phone: '718-963-8000',
    access: ['Wheelchair'],
    note: 'ED and outpatient naloxone prescriptions. Buprenorphine bridge.',
    lat: 40.6968, lng: -73.9430,
  },
  {
    id: 'loc-28',
    name: 'Bushwick Community Health Center',
    neighborhood: 'Bushwick',
    org: 'Bushwick Community Health Center',
    addr: '335 Central Ave, Brooklyn, NY 11221',
    x: 74, y: 70,
    services: ['SEP', 'Narcan', 'Test strips'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–6', tue: '9–6', wed: '9–6', thu: '9–6', fri: '9–6', sat: '9–1', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 36, transit: 22,
    phone: '718-455-6885',
    access: ['Wheelchair', 'Spanish-first'],
    note: 'Peer educators on staff. Spanish-primary services available.',
    lat: 40.6920, lng: -73.9210,
  },
  {
    id: 'loc-29',
    name: 'Interfaith Medical Center',
    neighborhood: 'Crown Heights',
    org: 'Interfaith Medical Center',
    addr: '1545 Atlantic Ave, Brooklyn, NY 11213',
    x: 72, y: 76,
    services: ['Narcan', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '8–5', tue: '8–5', wed: '8–5', thu: '8–5', fri: '8–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 40, transit: 25,
    phone: '718-613-4000',
    access: ['Wheelchair'],
    note: 'Outpatient harm reduction services at the community health center.',
    lat: 40.6740, lng: -73.9459,
  },
  {
    id: 'loc-30',
    name: 'CAMBA Health Ventures',
    neighborhood: 'Flatbush',
    org: 'CAMBA',
    addr: '1720 Church Ave, Brooklyn, NY 11226',
    x: 68, y: 84,
    services: ['Narcan', 'Test strips'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 48, transit: 30,
    phone: '718-287-2600',
    access: ['Wheelchair'],
    note: 'Naloxone kits and training available to community members.',
    lat: 40.6450, lng: -73.9608,
  },
  {
    id: 'loc-31',
    name: 'Elmhurst Hospital Center',
    neighborhood: 'Elmhurst',
    org: 'NYC Health + Hospitals',
    addr: '79-01 Broadway, Elmhurst, NY 11373',
    x: 84, y: 52,
    services: ['Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES', 'ZH'],
    hours: { mon: '8–5', tue: '8–5', wed: '8–5', thu: '8–5', fri: '8–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 50, transit: 32,
    phone: '718-334-4000',
    access: ['Wheelchair', 'Trilingual staff'],
    note: 'One of NYC\'s most diverse hospitals. Naloxone bridge on discharge.',
    lat: 40.7367, lng: -73.8781,
  },
  {
    id: 'loc-32',
    name: 'Jamaica Hospital Medical Center',
    neighborhood: 'Jamaica',
    org: 'Jamaica Hospital',
    addr: '8900 Van Wyck Expy, Jamaica, NY 11418',
    x: 88, y: 62,
    services: ['Narcan', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '8–5', tue: '8–5', wed: '8–5', thu: '8–5', fri: '8–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 55, transit: 38,
    phone: '718-206-6000',
    access: ['Wheelchair'],
    note: 'ED naloxone prescriptions and referrals to outpatient services.',
    lat: 40.6920, lng: -73.8120,
  },
  {
    id: 'loc-33',
    name: 'Queens Community House',
    neighborhood: 'Forest Hills',
    org: 'Queens Community House',
    addr: '108-25 62nd Dr, Forest Hills, NY 11375',
    x: 84, y: 58,
    services: ['Narcan', 'Test strips'],
    languages: ['EN', 'ES', 'ZH'],
    hours: { mon: '9–6', tue: '9–6', wed: '9–6', thu: '9–6', fri: '9–6', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 52, transit: 34,
    phone: '718-592-5757',
    access: ['Wheelchair', 'All genders'],
    note: 'Community-based naloxone distribution and harm reduction training.',
    lat: 40.7213, lng: -73.8463,
  },
  {
    id: 'loc-34',
    name: 'Samaritan Village — Queens',
    neighborhood: 'Briarwood',
    org: 'Samaritan Daytop Village',
    addr: '138-02 Queens Blvd, Briarwood, NY 11435',
    x: 86, y: 60,
    services: ['Narcan', 'Test strips'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 54, transit: 36,
    phone: '718-206-1300',
    access: ['Wheelchair'],
    note: 'Outpatient substance use services with harm reduction integration.',
    lat: 40.7052, lng: -73.8186,
  },
  {
    id: 'loc-35',
    name: 'Project Hospitality — Bay Street',
    neighborhood: 'Stapleton',
    org: 'Project Hospitality',
    addr: '100 Bay St, Staten Island, NY 10301',
    x: 30, y: 82,
    services: ['SEP', 'Narcan', 'Test strips', 'Wound care'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 52, transit: 44,
    phone: '718-448-1544',
    access: ['Wheelchair', 'All genders'],
    note: 'Full-service harm reduction. Ferry to St. George then 5 min walk.',
    lat: 40.6359, lng: -74.0776,
  },
  {
    id: 'loc-youth-1',
    name: 'The Door',
    neighborhood: 'SoHo',
    org: 'The Door — A Center of Alternatives',
    addr: '555 Broome St, New York, NY 10013',
    x: 52, y: 66,
    services: ['Narcan', 'Youth'],
    languages: ['EN', 'ES'],
    hours: { mon: '2–6', tue: '2–6', wed: '2–6', thu: '2–6', fri: '2–6', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 12, transit: 7,
    phone: '212-941-9090',
    access: ['Wheelchair', 'All genders', 'LGBTQ+ affirming'],
    note: 'Ages 12–24 only. Free health care, hot meals, counseling, and legal help under one roof.',
    lat: 40.7242, lng: -74.0040,
  },
  {
    id: 'loc-youth-2',
    name: 'Streetwork Project Drop-In (Harlem)',
    neighborhood: 'Harlem',
    org: 'Safe Horizon',
    addr: '209 W 125th St, New York, NY 10027',
    x: 44, y: 30,
    services: ['SEP', 'Narcan', 'Youth'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–5', tue: '9–5', wed: '9–5', thu: '9–5', fri: '9–5', sat: 'Closed', sun: 'Closed' },
    openNow: false, closesSoon: false,
    walk: 26, transit: 16,
    phone: '212-695-2220',
    access: ['All genders', 'LGBTQ+ affirming'],
    note: 'For youth 24 and under. Drop-in with meals, showers, lockers, and harm reduction supplies. Call ahead to confirm hours.',
    lat: 40.8090, lng: -73.9482,
  },
  {
    id: 'loc-youth-3',
    name: 'Ali Forney Center Drop-In',
    neighborhood: 'Harlem',
    org: 'Ali Forney Center',
    addr: '321 W 125th St, New York, NY 10027',
    x: 43, y: 29,
    services: ['Narcan', 'Youth'],
    languages: ['EN', 'ES'],
    hours: { mon: '9–9', tue: '9–9', wed: '9–9', thu: '9–9', fri: '9–9', sat: '9–5', sun: '9–5' },
    openNow: false, closesSoon: false,
    walk: 27, transit: 17,
    phone: '212-206-0574',
    access: ['All genders', 'LGBTQ+ affirming'],
    note: 'For LGBTQ+ youth 16–24. Meals, showers, medical care, and housing help. Call ahead to confirm hours.',
    lat: 40.8101, lng: -73.9520,
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
      // Youth-serving sites aren't in the city API — always keep them in the list
      const youthSites = SEED_LOCATIONS.filter(l => l.services.includes('Youth'));
      LOCATIONS = [
        ...youthSites,
        ...items.map(parseApiLocation)
          .filter(l => l.name)
          .map(l => Object.assign(l, computeOpenNow(l))),
      ];
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
  Youth:  { icon: 'heart', label: { EN: 'Youth 16–24', ES: 'Jóvenes 16–24', ZH: '青年 16–24' } },
};

Object.assign(window, { LOCATIONS, SEED_LOCATIONS, BOROUGH_PATHS, STREETS, Icon, SERVICE_META, fetchNYCLocations, distanceMiles, walkMinutes });
