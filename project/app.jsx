// app.jsx — root App + Tweaks panel + tabs + nav chrome

const DEFAULTS = {
  mode: 'light',
  theme: 'warm',
  mapStyle: 'realistic',
  lang: 'EN',
  bigText: false,
  density: 'comfortable',
};

function App() {
  const [tweaks, setTweaks] = React.useState(DEFAULTS);

  const [tab, setTab] = React.useState('map');
  const [showPrivacy, setShowPrivacy] = React.useState(true);
  const [filter, setFilter] = React.useState('All');
  const [sheetLoc, setSheetLoc] = React.useState(null);
  const [detail, setDetail] = React.useState(null);
  const [saved, setSaved] = React.useState([]);
  const [locations, setLocations] = React.useState(LOCATIONS);
  const [dataSource, setDataSource] = React.useState('Built-in NYC directory');
  const [directoryCheckedAt, setDirectoryCheckedAt] = React.useState(() => new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }));
  const [userLocation, setUserLocation] = React.useState(null);
  const [locating, setLocating] = React.useState(false);
  const [locationMessage, setLocationMessage] = React.useState('');
  const [activeRoute, setActiveRoute] = React.useState(null); // {coords,distLabel,timeLabel,mapsUrl,locName}
  const [routeStripVisible, setRouteStripVisible] = React.useState(false);

  const requestLocation = React.useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationMessage('Showing services closest to you.');
        setLocating(false);
      },
      () => {
        setLocationMessage('Location is unavailable. You can still browse the map.');
        setLocating(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  React.useEffect(() => {
    try {
      const prior = JSON.parse(window.localStorage.getItem('safe-spot-saved') || '[]');
      if (Array.isArray(prior)) setSaved(prior);
    } catch {}
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem('safe-spot-saved', JSON.stringify(saved));
  }, [saved]);

  // Pick up live data if the API fetch succeeds after mount
  React.useEffect(() => {
    window.__locationsLoaded = (locs, source = 'NYC public directory') => {
      setLocations(locs);
      setDataSource(source);
      setDirectoryCheckedAt(new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }));
    };
    return () => { delete window.__locationsLoaded; };
  }, []);

  const toggleSave = (id) => setSaved(s =>
    s.includes(id) ? s.filter(x => x !== id) : [...s, id]
  );

  const handleDirections = React.useCallback(async (loc) => {
    if (!loc.lat || !loc.lng) return;
    const fromLat = userLocation?.lat ?? 40.7157;
    const fromLng = userLocation?.lng ?? -73.9905;
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const mapsUrl = isIOS
      ? `https://maps.apple.com/?saddr=${fromLat},${fromLng}&daddr=${loc.lat},${loc.lng}&dirflg=w`
      : `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${loc.lat},${loc.lng}&travelmode=walking`;

    // Close detail + peek, go to map immediately; route loads async
    setDetail(null);
    setSheetLoc(null);
    setTab('map');

    // Straight-line fallback (used if OSRM fails)
    const straightLine = () => {
      const dLat = (loc.lat - fromLat) * Math.PI / 180;
      const dLng = (loc.lng - fromLng) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(fromLat*Math.PI/180) * Math.cos(loc.lat*Math.PI/180) * Math.sin(dLng/2)**2;
      const distMi = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 3958.8;
      const distLabel = distMi < 0.1 ? `${Math.round(distMi * 5280)} ft` : `${distMi.toFixed(1)} mi`;
      const timeLabel = `~${Math.max(1, Math.round(distMi * 20))} min walk`;
      return { coords: [[fromLat, fromLng], [loc.lat, loc.lng]], distLabel, timeLabel };
    };

    try {
      const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${fromLng},${fromLat};${loc.lng},${loc.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      const data = await res.json();
      const route = data.routes?.[0];
      if (!route) throw new Error('no route');
      const distM = route.distance;
      const durS  = route.duration;
      const distLabel = distM < 1609
        ? `${Math.round(distM)} m`
        : `${(distM / 1609.34).toFixed(1)} mi`;
      const timeLabel = durS < 60 ? `<1 min` : `${Math.round(durS / 60)} min walk`;
      const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setActiveRoute({ coords, distLabel, timeLabel, mapsUrl, locName: loc.name });
      setRouteStripVisible(true);
    } catch {
      const fb = straightLine();
      setActiveRoute({ ...fb, mapsUrl, locName: loc.name });
      setRouteStripVisible(true);
    }
  }, [userLocation]);

  const t = useTokens(tweaks);
  const s = useScale(tweaks);
  const L = STRINGS[tweaks.lang] || STRINGS.EN;

  const updateTweak = (k, v) => setTweaks(prev => ({ ...prev, [k]: v }));
  const openMap = () => {
    setDetail(null);
    setSheetLoc(null);
    setTab('map');
    setShowPrivacy(false);
  };

  const pageBg = t.dark
    ? 'radial-gradient(ellipse at top, oklch(0.22 0.02 40) 0%, oklch(0.14 0.01 40) 80%)'
    : 'radial-gradient(ellipse at top, oklch(0.94 0.02 60) 0%, oklch(0.88 0.015 50) 90%)';

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: pageBg,
      fontFamily: '"Inter", -apple-system, system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box', overflowY: 'auto',
    }}>
      {/* ── Header ── */}
      <header className="showcase-header" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '28px 40px 12px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="brand-mark">S</span>
          <span style={{
            fontFamily: '"Inter", -apple-system, system-ui, sans-serif',
            fontSize: 21, color: t.ink, letterSpacing: -0.7, fontWeight: 700,
          }}>Safe Spot</span>
        </div>
        <span style={{
          fontSize: 11, padding: '8px 12px', borderRadius: 20,
          background: t.accentSoft, color: t.accent, fontWeight: 700, letterSpacing: 0.4,
          border: `1px solid ${t.border}`,
        }}>YALE HACKATHON</span>
      </header>

      {/* ── Main row: about + phone + tweaks ── */}
      <div className="showcase-row" style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 64, padding: '24px 40px 44px', flexWrap: 'wrap',
      }}>
        {/* About panel */}
        <div className="showcase-copy" style={{ maxWidth: 390, flexShrink: 0 }}>
          <div style={{
            fontSize: 11, color: t.accent, letterSpacing: 2.2,
            fontWeight: 700, marginBottom: 14,
          }}>SAFE SPOT APP</div>
          <div style={{
            fontFamily: '"Instrument Serif", ui-serif, Georgia, serif',
            fontSize: 64, lineHeight: .98, letterSpacing: -2.6,
            color: t.ink, marginBottom: 22,
          }}>A web demo<br/>of the Safe Spot<br/>iOS app.</div>
          <div style={{ fontSize: 17, color: t.mute, lineHeight: 1.6, marginBottom: 22, maxWidth: 360 }}>
            Safe Spot helps young New Yorkers find free naloxone, syringe exchange,
            test strips, wound care, and drop-in support across the city.
          </div>
          <div className="showcase-actions" style={{display:'flex', gap:10, flexWrap:'wrap', marginBottom:26}}>
            <button onClick={openMap} style={{
              minHeight:46, padding:'0 17px', borderRadius:14, border:'none',
              background:t.ink, color:t.surface, fontFamily:'inherit', fontSize:14,
              fontWeight:700, cursor:'pointer', boxShadow:`0 10px 20px ${t.ink}22`,
            }}>Try the interactive demo</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {[
              ['heart', 'Youth-friendly sites with no judgment'],
              ['map', 'Free services across all five boroughs'],
              ['bolt', 'Open and closed status at a glance'],
              ['lock', 'Private by design'],
            ].map(([icon, text]) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 14, color: t.ink,
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: t.accentSoft, color: t.accent,
                  display: 'grid', placeItems: 'center',
                }}>{Icon[icon]({ width: 15, height: 15 })}</span>{text}
              </div>
            ))}
          </div>
          <div style={{
            fontSize: 11, color: t.mute, lineHeight: 1.6,
            fontFamily: 'ui-monospace, monospace',
            padding: '12px 14px', borderRadius: 10,
            background: t.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
          }}>
            <strong style={{display:'block', color:t.ink, fontSize:12, marginBottom:4}}>Designed for real life</strong>
            {dataSource} · checked {directoryCheckedAt}<br/>
            {locations.length} listed locations<br/>
            Confirm hours before visiting. No account required.
          </div>
        </div>

      {/* Phone frame */}
      <IOSDevice dark={t.dark} width={390} height={844}>
        <div style={{
          position: 'absolute', inset: 0, background: t.bg,
          color: t.ink, overflow: 'hidden',
        }}>
          {detail ? (
            <DetailScreen key={detail.id} className="screen-enter" t={t} s={s} L={L} loc={detail}
              onBack={() => setDetail(null)}
              saved={saved.includes(detail.id)}
              toggleSave={() => toggleSave(detail.id)}
              onDirections={handleDirections} />
          ) : tab === 'map' ? (
            <MapScreen t={t} s={s} L={L} tweaks={tweaks}
              filter={filter} setFilter={setFilter}
              onOpen={setDetail}
              saved={saved} toggleSave={toggleSave}
              sheetLoc={sheetLoc} setSheetLoc={setSheetLoc}
              locations={locations}
              userLocation={userLocation}
              locating={locating}
              locationMessage={locationMessage}
              requestLocation={requestLocation}
              activeRoute={activeRoute}
              clearRoute={() => setActiveRoute(null)}
              onDirections={handleDirections} />
          ) : tab === 'saved' ? (
            <SavedScreen t={t} s={s} L={L} saved={saved}
              onOpen={setDetail} toggleSave={toggleSave}
              locations={locations} onBrowse={openMap} />
          ) : tab === 'learn' ? (
          <LearnScreen t={t} s={s} L={L} onFindNearby={openMap} />
          ) : tab === 'buddy' ? (
            <BuddyScreen t={t} s={s} L={L} />
          ) : tab === 'now' ? (
            <NowScreen t={t} s={s} L={L} onGoTo={(x) => setTab(x)} />
          ) : null}

          {tab === 'map' && !detail && !sheetLoc && activeRoute && routeStripVisible && (
            <div style={{
              position:'absolute', bottom: 88, left:12, right:12, zIndex:40,
              background: t.dark ? 'rgba(28,24,20,0.96)' : 'rgba(255,255,255,0.97)',
              backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
              borderRadius:18, padding:'12px 14px',
              boxShadow:'0 8px 28px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
              display:'flex', alignItems:'center', gap:10,
              animation:'screenIn 0.2s ease-out',
            }}>
              <div style={{
                width:36, height:36, borderRadius:18,
                background:t.accentSoft, color:t.accent,
                display:'grid', placeItems:'center', flexShrink:0,
              }}>
                <Icon.walk width="18" height="18"/>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{
                  fontSize:s.small+2, fontWeight:700, color:t.ink,
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                }}>
                  {activeRoute.locName}
                </div>
                {activeRoute.distLabel && (
                  <div style={{fontSize:s.small, color:t.mute, marginTop:1}}>
                    {activeRoute.distLabel} · {activeRoute.timeLabel}
                  </div>
                )}
              </div>
              <button onClick={() => window.open(activeRoute.mapsUrl, '_blank')} style={{
                height:32, padding:'0 12px', background:t.accent, color:'#fff',
                border:'none', borderRadius:10, fontSize:s.small+1, fontWeight:600,
                fontFamily:'inherit', cursor:'pointer', flexShrink:0, whiteSpace:'nowrap',
              }}>Open Maps</button>
              <button onClick={() => { setActiveRoute(null); setRouteStripVisible(false); }} style={{
                width:28, height:28, borderRadius:14, background:t.surface,
                border:`1px solid ${t.border}`, color:t.mute,
                display:'grid', placeItems:'center', cursor:'pointer', flexShrink:0,
              }}>✕</button>
            </div>
          )}

          {!detail && <TabBar t={t} s={s} L={L} tab={tab} setTab={setTab} />}

          {showPrivacy && (
            <PrivacyBadge t={t} s={s} L={L} onDismiss={() => setShowPrivacy(false)} />
          )}
        </div>
      </IOSDevice>

      <DisplayPanel tweaks={tweaks} update={updateTweak} />

      </div>{/* end main row */}

      {/* ── Footer ── */}
      <footer style={{
        textAlign: 'center', padding: '16px 40px',
        fontSize: 12, color: t.mute, lineHeight: 1.6,
        borderTop: `1px solid ${t.border}`,
      }}>
        Private by design · NYC harm reduction resources · Demo data stays in this browser
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');
        * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        .brand-mark { display:grid; place-items:center; width:34px; height:34px; background:${t.ink}; color:${t.surface}; border-radius:11px; font-family:"Instrument Serif", Georgia, serif; font-size:24px; }
        button { transition: transform .18s ease, box-shadow .18s ease, background .18s ease; }
        button:hover:not(:disabled) { transform: translateY(-1px); }
        button:focus-visible { outline: 3px solid ${t.accent}; outline-offset: 3px; }
        @media (max-width: 900px) { .showcase-row { gap: 34px !important; } .showcase-copy { max-width: 560px !important; text-align: center; } .showcase-actions { justify-content:center; } }
        @media (max-width: 560px) { .showcase-header { padding: 20px 20px 8px !important; } .showcase-header > span { font-size: 9px !important; padding: 7px 8px !important; } .showcase-row { padding: 20px 20px 32px !important; } .showcase-copy > div:nth-child(2) { font-size: 48px !important; } .showcase-actions { display:grid !important; grid-template-columns:1fr; } .showcase-actions button { width:100%; } .ios-device { width:calc(100vw - 32px) !important; height:calc((100vw - 32px) * 2.164) !important; } }
        @keyframes screenIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .screen-enter { animation: screenIn 0.22s ease-out forwards; }
      `}</style>
    </div>
  );
}

// ─── TAB BAR ──────────────────────────────────────────────────────────────────
function TabBar({ t, s, L, tab, setTab }) {
  const tabs = [
    { k: 'map',   label: L.tabMap,   icon: 'map' },
    { k: 'saved', label: L.tabSaved, icon: 'star' },
    { k: 'learn', label: L.tabLearn, icon: 'book' },
    { k: 'buddy', label: L.tabBuddy, icon: 'buddy' },
    { k: 'now',   label: L.tabNow,   icon: 'bolt', urgent: true },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '8px 8px 24px', zIndex: 50,
      background: t.dark
        ? 'linear-gradient(180deg, transparent 0%, oklch(0.16 0.015 50) 40%)'
        : 'linear-gradient(180deg, transparent 0%, oklch(0.98 0.008 70 / 0.95) 40%)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-around',
        background: t.dark ? 'rgba(30,25,22,0.88)' : 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 28, padding: '8px 4px',
        boxShadow: t.dark
          ? '0 8px 24px rgba(0,0,0,0.4), inset 0 0 0 0.5px rgba(255,255,255,0.08)'
          : '0 8px 24px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(0,0,0,0.04)',
      }}>
        {tabs.map(tb => {
          const active = tab === tb.k;
          const color = tb.urgent ? t.urgent : (active ? t.ink : t.mute);
          return (
            <button key={tb.k} onClick={() => setTab(tb.k)} style={{
              flex: 1, padding: '8px 2px', border: 'none', background: 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              cursor: 'pointer', color, fontFamily: 'inherit',
              opacity: tb.urgent ? (active ? 1 : 0.85) : 1,
            }}>
              <div style={{
                position: 'relative', width: 28, height: 28,
                display: 'grid', placeItems: 'center',
              }}>
                {active && !tb.urgent && (
                  <div style={{
                    position: 'absolute', inset: -2, borderRadius: 10,
                    background: t.accentSoft,
                  }} />
                )}
                {tb.urgent && active && (
                  <div style={{
                    position: 'absolute', inset: -2, borderRadius: 10,
                    background: t.urgentSoft,
                  }} />
                )}
                <div style={{ position: 'relative', color: active && !tb.urgent ? t.accent : color }}>
                  {Icon[tb.icon]({ width: 20, height: 20 })}
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.2 }}>{tb.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── DISPLAY SETTINGS ────────────────────────────────────────────────────────
function DisplayPanel({ tweaks, update }) {
  const Row = ({ label, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase',
        letterSpacing: 1.5, marginBottom: 8,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      }}>{label}</div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
  const Chip = ({ active, onClick, children, swatch }) => (
    <button onClick={onClick} style={{
      padding: '7px 10px', borderRadius: 10,
      background: active ? '#1a1a1a' : '#f5f5f4',
      color: active ? '#fff' : '#1a1a1a',
      border: 'none', fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {swatch && <div style={{ width: 10, height: 10, borderRadius: 5, background: swatch }} />}
      {children}
    </button>
  );
  return (
    <aside className="display-panel" style={{
      width: 260, maxWidth:'100%', background: '#fff', borderRadius: 22, padding: 20,
      boxShadow: '0 24px 80px rgba(0,0,0,0.24), 0 0 0 1px rgba(0,0,0,0.05)',
      fontFamily: '"Inter", system-ui, sans-serif', color: '#1a1a1a', alignSelf:'center', flexShrink:0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div style={{
          fontFamily: '"Instrument Serif", ui-serif, Georgia, serif',
          fontSize: 22, letterSpacing: -0.3,
        }}>Display & language</div>
        <div style={{
          fontSize: 10, color: '#888', letterSpacing: 1.2,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}>SAFE SPOT</div>
      </div>

      <Row label="Mode">
        <Chip active={tweaks.mode === 'light'} onClick={() => update('mode', 'light')}>Light</Chip>
        <Chip active={tweaks.mode === 'dark'} onClick={() => update('mode', 'dark')}>Dark</Chip>
      </Row>

      <Row label="Language">
        <Chip active={tweaks.lang === 'EN'} onClick={() => update('lang', 'EN')}>EN</Chip>
        <Chip active={tweaks.lang === 'ES'} onClick={() => update('lang', 'ES')}>ES</Chip>
        <Chip active={tweaks.lang === 'ZH'} onClick={() => update('lang', 'ZH')}>中文</Chip>
      </Row>

      <Row label="Text size">
        <Chip active={!tweaks.bigText} onClick={() => update('bigText', false)}>Normal</Chip>
        <Chip active={tweaks.bigText} onClick={() => update('bigText', true)}>Large</Chip>
      </Row>
    </aside>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
