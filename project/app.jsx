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
  const [showTweaks, setShowTweaks] = React.useState(false);

  const [tab, setTab] = React.useState('map');
  const [showPrivacy, setShowPrivacy] = React.useState(true);
  const [filter, setFilter] = React.useState('All');
  const [sheetLoc, setSheetLoc] = React.useState(null);
  const [detail, setDetail] = React.useState(null);
  const [saved, setSaved] = React.useState([]);
  const [locations, setLocations] = React.useState(LOCATIONS);
  const [userLocation, setUserLocation] = React.useState(null);
  const [locating, setLocating] = React.useState(false);

  const requestLocation = React.useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Pick up live data if the API fetch succeeds after mount
  React.useEffect(() => {
    window.__locationsLoaded = (locs) => setLocations(locs);
    return () => { delete window.__locationsLoaded; };
  }, []);

  const toggleSave = (id) => setSaved(s =>
    s.includes(id) ? s.filter(x => x !== id) : [...s, id]
  );

  const t = useTokens(tweaks);
  const s = useScale(tweaks);
  const L = STRINGS[tweaks.lang] || STRINGS.EN;

  const updateTweak = (k, v) => setTweaks(prev => ({ ...prev, [k]: v }));

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
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{
            fontFamily: '"Instrument Serif", ui-serif, Georgia, serif',
            fontSize: 26, color: t.ink, letterSpacing: -0.5,
          }}>Safe Spot</span>
          <span style={{
            fontSize: 11, color: t.mute, letterSpacing: 1.5,
            fontFamily: 'ui-monospace, monospace',
          }}>NYC</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{
            fontSize: 11, padding: '5px 12px', borderRadius: 20,
            background: t.accentSoft, color: t.accent, fontWeight: 600, letterSpacing: 0.5,
          }}>HACKATHON BUILD</span>
          <a href="https://github.com/Sherron-T/safe-spot" target="_blank"
            style={{ fontSize: 13, color: t.mute, textDecoration: 'none' }}>
            GitHub ↗
          </a>
        </div>
      </header>

      {/* ── Main row: about + phone + tweaks ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 48, padding: '0 40px 32px', flexWrap: 'wrap',
      }}>
        {/* About panel */}
        <div style={{ maxWidth: 300, flexShrink: 0 }}>
          <div style={{
            fontFamily: '"Instrument Serif", ui-serif, Georgia, serif',
            fontSize: 42, lineHeight: 1.05, letterSpacing: -1,
            color: t.ink, marginBottom: 18,
          }}>Find help,<br/>not judgment.</div>
          <div style={{ fontSize: 15, color: t.mute, lineHeight: 1.7, marginBottom: 28 }}>
            Safe Spot maps free harm reduction services across NYC — syringe exchanges, naloxone,
            fentanyl test strips, and wound care. No account. No tracking. Just help.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {[
              ['🗺', '20+ verified NYC sites'],
              ['🕐', 'Live open / closed status'],
              ['📍', 'Sort by distance from you'],
              ['🔒', 'No account. No tracking.'],
            ].map(([icon, text]) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 14, color: t.ink,
              }}>
                <span style={{ fontSize: 18 }}>{icon}</span>{text}
              </div>
            ))}
          </div>
          <div style={{
            fontSize: 11, color: t.mute, lineHeight: 1.6,
            fontFamily: 'ui-monospace, monospace',
            padding: '12px 14px', borderRadius: 10,
            background: t.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
          }}>
            DATA SOURCE<br/>
            NYC DOHMH Syringe Service Programs<br/>
            NYC Health + Hospitals
          </div>
        </div>

      {/* Phone frame */}
      <IOSDevice dark={t.dark} width={390} height={844}>
        <div style={{
          position: 'absolute', inset: 0, background: t.bg,
          color: t.ink, overflow: 'hidden',
        }}>
          {detail ? (
            <DetailScreen t={t} s={s} L={L} loc={detail}
              onBack={() => setDetail(null)}
              saved={saved.includes(detail.id)}
              toggleSave={() => toggleSave(detail.id)} />
          ) : tab === 'map' ? (
            <MapScreen t={t} s={s} L={L} tweaks={tweaks}
              filter={filter} setFilter={setFilter}
              onOpen={setDetail}
              saved={saved} toggleSave={toggleSave}
              sheetLoc={sheetLoc} setSheetLoc={setSheetLoc}
              locations={locations}
              userLocation={userLocation}
              locating={locating}
              requestLocation={requestLocation} />
          ) : tab === 'saved' ? (
            <SavedScreen t={t} s={s} L={L} saved={saved}
              onOpen={setDetail} toggleSave={toggleSave}
              locations={locations} />
          ) : tab === 'learn' ? (
            <LearnScreen t={t} s={s} L={L} />
          ) : tab === 'buddy' ? (
            <BuddyScreen t={t} s={s} L={L} />
          ) : tab === 'now' ? (
            <NowScreen t={t} s={s} L={L} onGoTo={(x) => setTab(x)} />
          ) : null}

          {tab === 'map' && !detail && (
            <div style={{
              position: 'absolute', top: 14, left: 0, right: 0,
              display: 'flex', justifyContent: 'center', pointerEvents: 'none',
              zIndex: 15,
            }}>
              <div style={{
                padding: '3px 10px', borderRadius: 999,
                background: t.dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                fontSize: 10, color: t.mute, letterSpacing: 1.5,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}>SAFE · SPOT</div>
            </div>
          )}

          {!detail && <TabBar t={t} s={s} L={L} tab={tab} setTab={setTab} />}

          {showPrivacy && (
            <PrivacyBadge t={t} s={s} L={L} onDismiss={() => setShowPrivacy(false)} />
          )}
        </div>
      </IOSDevice>

      {/* Tweaks panel */}
      <TweaksPanel tweaks={tweaks} update={updateTweak} />

      </div>{/* end main row */}

      {/* ── Footer ── */}
      <footer style={{
        textAlign: 'center', padding: '16px 40px',
        fontSize: 12, color: t.mute, lineHeight: 1.6,
        borderTop: `1px solid ${t.border}`,
      }}>
        Built for NYC Hackathon · Data: NYC DOHMH · No location data is stored or shared ·{' '}
        <a href="https://github.com/Sherron-T/safe-spot" target="_blank"
          style={{ color: t.accent, textDecoration: 'none' }}>Open source on GitHub</a>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');
        * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
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

// ─── TWEAKS PANEL ─────────────────────────────────────────────────────────────
function TweaksPanel({ tweaks, update }) {
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
    <div style={{
      width: 260, background: '#fff', borderRadius: 20, padding: 18,
      boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)',
      fontFamily: '"Inter", system-ui, sans-serif', color: '#1a1a1a',
      alignSelf: 'center', flexShrink: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div style={{
          fontFamily: '"Instrument Serif", ui-serif, Georgia, serif',
          fontSize: 22, letterSpacing: -0.3,
        }}>Tweaks</div>
        <div style={{
          fontSize: 10, color: '#888', letterSpacing: 1.2,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}>SAFE SPOT</div>
      </div>

      <Row label="Mode">
        <Chip active={tweaks.mode === 'light'} onClick={() => update('mode', 'light')}>Light</Chip>
        <Chip active={tweaks.mode === 'dark'} onClick={() => update('mode', 'dark')}>Dark</Chip>
      </Row>

      <Row label="Color theme">
        <Chip active={tweaks.theme === 'warm'} onClick={() => update('theme', 'warm')}
          swatch="oklch(0.62 0.14 40)">Warm</Chip>
        <Chip active={tweaks.theme === 'clinical'} onClick={() => update('theme', 'clinical')}
          swatch="oklch(0.55 0.14 245)">Clinical</Chip>
        <Chip active={tweaks.theme === 'activist'} onClick={() => update('theme', 'activist')}
          swatch="oklch(0.80 0.16 75)">Activist</Chip>
      </Row>

      <Row label="Map style">
        <Chip active={tweaks.mapStyle === 'realistic'} onClick={() => update('mapStyle', 'realistic')}>Realistic</Chip>
        <Chip active={tweaks.mapStyle === 'abstract'} onClick={() => update('mapStyle', 'abstract')}>Abstract</Chip>
        <Chip active={tweaks.mapStyle === 'schematic'} onClick={() => update('mapStyle', 'schematic')}>Schematic</Chip>
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

      <Row label="Density">
        <Chip active={tweaks.density === 'comfortable'} onClick={() => update('density', 'comfortable')}>Comfortable</Chip>
        <Chip active={tweaks.density === 'compact'} onClick={() => update('density', 'compact')}>Compact</Chip>
      </Row>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
