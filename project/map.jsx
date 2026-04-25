// map.jsx — Leaflet map with real NYC OpenStreetMap tiles

const TILE_URLS = {
  voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  light:   'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark:    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};

const ATTRIBUTION = '&copy; <a href="https://openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function tileUrlForTweaks(tweaks) {
  if (tweaks.mode === 'dark' || tweaks.theme === 'activist') return TILE_URLS.dark;
  if (tweaks.theme === 'clinical') return TILE_URLS.light;
  return TILE_URLS.voyager;
}

function makeIcon(loc, t) {
  const color = loc.openNow
    ? (loc.closesSoon ? t.accent : t.accent)
    : t.mute;
  const border = t.dark ? '#1a1a1a' : '#fff';

  if (loc.openNow) {
    return L.divIcon({
      className: '',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      html: `
        <div style="position:relative;width:22px;height:22px;">
          <div class="pin-pulse" style="
            position:absolute;inset:0;border-radius:50%;
            background:${color};pointer-events:none;
          "></div>
          <div style="
            position:absolute;inset:4px;border-radius:50%;
            background:${color};border:2.5px solid ${border};
            box-shadow:0 1px 4px rgba(0,0,0,0.25);
          "></div>
        </div>`,
    });
  }
  return L.divIcon({
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${color};border:2px solid ${border};
      box-shadow:0 1px 3px rgba(0,0,0,0.2);
    "></div>`,
  });
}

function youAreHereIcon(t) {
  return L.divIcon({
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `
      <div style="position:relative;width:18px;height:18px;">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:${t.open};opacity:0.25;
        "></div>
        <div style="
          position:absolute;inset:3px;border-radius:50%;
          background:${t.open};border:2px solid white;
          box-shadow:0 1px 4px rgba(0,0,0,0.3);
        "></div>
      </div>`,
  });
}

function MapView({ t, tweaks, locations, filter, onPin }) {
  const containerRef = React.useRef(null);
  const mapRef      = React.useRef(null);
  const tileRef     = React.useRef(null);
  const markersRef  = React.useRef([]);
  const onPinRef    = React.useRef(onPin);

  React.useEffect(() => { onPinRef.current = onPin; }, [onPin]);

  const visible = (locations || []).filter(
    l => filter === 'All' || l.services.includes(filter)
  );

  // Init map once on mount
  React.useEffect(() => {
    if (!containerRef.current || !window.L) return;

    const map = L.map(containerRef.current, {
      center: [40.730, -73.940],
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
    });

    map.attributionControl.setPrefix('');

    const tileUrl = tileUrlForTweaks(tweaks);
    tileRef.current = L.tileLayer(tileUrl, { attribution: ATTRIBUTION, maxZoom: 19 });
    tileRef.current.addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      tileRef.current = null;
      markersRef.current = [];
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Swap tile layer when theme/mode changes
  React.useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const tileUrl = tileUrlForTweaks(tweaks);
    if (tileRef.current) mapRef.current.removeLayer(tileRef.current);
    tileRef.current = L.tileLayer(tileUrl, { attribution: ATTRIBUTION, maxZoom: 19 });
    tileRef.current.addTo(mapRef.current);
  }, [tweaks.mode, tweaks.theme]);

  // Update markers when locations/filter/theme changes
  React.useEffect(() => {
    if (!mapRef.current || !window.L) return;

    markersRef.current.forEach(m => mapRef.current.removeLayer(m));
    markersRef.current = [];

    // "You are here" — fixed LES anchor for demo
    const here = L.marker([40.7157, -73.9905], { icon: youAreHereIcon(t), zIndexOffset: 1000 });
    here.addTo(mapRef.current);
    markersRef.current.push(here);

    visible.forEach(loc => {
      if (!loc.lat || !loc.lng) return;
      const m = L.marker([loc.lat, loc.lng], { icon: makeIcon(loc, t) });
      m.on('click', () => onPinRef.current(loc));
      m.addTo(mapRef.current);
      markersRef.current.push(m);
    });
  }, [visible.map(l => l.id + l.openNow).join(','), t.accent, t.mute, t.open, t.dark]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
  );
}

Object.assign(window, { MapView });
