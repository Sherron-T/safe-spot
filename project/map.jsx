// map.jsx — Leaflet map

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

function pinIcon(loc, t) {
  if (loc.openNow) {
    return L.divIcon({
      className: '',
      iconSize: [22, 22], iconAnchor: [11, 11],
      html: `<div style="position:relative;width:22px;height:22px">
        <div class="pin-pulse" style="position:absolute;inset:0;border-radius:50%;background:${t.accent};pointer-events:none"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:${t.accent};border:2.5px solid ${t.dark?'#1a1a1a':'#fff'};box-shadow:0 1px 4px rgba(0,0,0,.25)"></div>
      </div>`,
    });
  }
  return L.divIcon({
    className: '',
    iconSize: [14, 14], iconAnchor: [7, 7],
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${t.mute};border:2px solid ${t.dark?'#1a1a1a':'#fff'};box-shadow:0 1px 3px rgba(0,0,0,.2)"></div>`,
  });
}

function hereIcon(t) {
  return L.divIcon({
    className: '',
    iconSize: [18, 18], iconAnchor: [9, 9],
    html: `<div style="position:relative;width:18px;height:18px">
      <div style="position:absolute;inset:0;border-radius:50%;background:${t.open};opacity:.25"></div>
      <div style="position:absolute;inset:3px;border-radius:50%;background:${t.open};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>
    </div>`,
  });
}

function clusterIcon(count, t) {
  return L.divIcon({
    className: '',
    iconSize: [36, 36], iconAnchor: [18, 18],
    html: `<div style="width:36px;height:36px;border-radius:18px;background:${t.accent};color:white;display:grid;place-items:center;font-size:13px;font-weight:700;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,.25)">${count}</div>`,
  });
}

// ─────────────────────────────────────────────────────────────────────────────

function MapView({ t, tweaks, locations, filter, onPin, userLocation, activeRoute }) {
  const elRef     = React.useRef(null);
  const mapRef    = React.useRef(null);
  const layerRef  = React.useRef({ tile: null, here: null, pins: null, route: null });
  const onPinRef  = React.useRef(onPin);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => { onPinRef.current = onPin; }, [onPin]);

  // ── Init map ─────────────────────────────────────────────────────────────────
  // useEffect runs in declaration order within a render, so mapRef.current is
  // already set by the time the tile/pin/route effects below fire.
  React.useEffect(() => {
    if (!elRef.current || !window.L) return;

    const map = L.map(elRef.current, {
      center: [40.730, -73.940],
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
    });
    map.attributionControl.setPrefix('');
    mapRef.current = map;
    setReady(true);
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = { tile: null, here: null, pins: null, route: null };
      setReady(false);
    };
  }, []); // eslint-disable-line

  // ── Tile layer ───────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const lr = layerRef.current;
    if (lr.tile) map.removeLayer(lr.tile);
    lr.tile = L.tileLayer(tileUrlForTweaks(tweaks), { attribution: ATTRIBUTION, maxZoom: 19 });
    lr.tile.addTo(map);
  }, [tweaks.mode, tweaks.theme]); // eslint-disable-line

  // ── "You are here" pin ───────────────────────────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const lr = layerRef.current;
    if (lr.here) map.removeLayer(lr.here);
    const lat = userLocation?.lat ?? 40.7157;
    const lng = userLocation?.lng ?? -73.9905;
    lr.here = L.marker([lat, lng], { icon: hereIcon(t), zIndexOffset: 1000 }).addTo(map);
  }, [userLocation, t.open, t.dark]); // eslint-disable-line

  // ── Location pins (clustered) ────────────────────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const lr = layerRef.current;
    if (lr.pins) map.removeLayer(lr.pins);

    const visible = (locations || []).filter(l => filter === 'All' || l.services.includes(filter));

    const group = window.L.markerClusterGroup
      ? L.markerClusterGroup({
          maxClusterRadius: 48,
          iconCreateFunction: (c) => clusterIcon(c.getChildCount(), t),
        })
      : L.layerGroup();

    visible.forEach(loc => {
      if (!loc.lat || !loc.lng) return;
      L.marker([loc.lat, loc.lng], { icon: pinIcon(loc, t) })
        .on('click', () => onPinRef.current?.(loc))
        .addTo(group);
    });

    group.addTo(map);
    lr.pins = group;
  }, [ // eslint-disable-line
    (locations || []).filter(l => filter === 'All' || l.services.includes(filter)).map(l => l.id + l.openNow).join(','),
    t.accent, t.mute, t.dark,
  ]);

  // ── Route polyline ───────────────────────────────────────────────────────────
  // `ready` in deps ensures this re-fires once the map initializes even if
  // activeRoute was already set (e.g. coming back from a detail screen).
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const lr = layerRef.current;
    if (lr.route) { map.removeLayer(lr.route); lr.route = null; }
    if (!activeRoute?.coords?.length) return;
    lr.route = L.polyline(activeRoute.coords, {
      color: '#3b82f6', weight: 5, opacity: 0.9,
    }).addTo(map);
    map.fitBounds(lr.route.getBounds(), { padding: [60, 60], maxZoom: 16, animate: true, duration: 0.8 });
  }, [activeRoute, ready]); // eslint-disable-line

  // ── Fly to user when GPS arrives ─────────────────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;
    map.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1.4 });
  }, [userLocation]); // eslint-disable-line

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div ref={elRef} style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}

Object.assign(window, { MapView });
