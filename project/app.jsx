// app.jsx — root App + Tweaks panel + tabs + nav chrome

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "light",
  "theme": "warm",
  "mapStyle": "realistic",
  "lang": "EN",
  "bigText": false,
  "density": "comfortable"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = React.useState(DEFAULTS);
  const [editMode, setEditMode] = React.useState(false);

  const [tab, setTab] = React.useState('map');
  const [showPrivacy, setShowPrivacy] = React.useState(true);
  const [filter, setFilter] = React.useState('All');
  const [sheetLoc, setSheetLoc] = React.useState(null);
  const [detail, setDetail] = React.useState(null);
  const [saved, setSaved] = React.useState(['loc-1', 'loc-5']);

  const toggleSave = (id) => setSaved(s =>
    s.includes(id) ? s.filter(x => x !== id) : [...s, id]
  );

  const t = useTokens(tweaks);
  const s = useScale(tweaks);
  const L = STRINGS[tweaks.lang] || STRINGS.EN;

  // Edit mode wiring
  React.useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({type:'__edit_mode_available'}, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const updateTweak = (k, v) => {
    setTweaks(prev => ({...prev, [k]: v}));
    window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[k]: v}}, '*');
  };

  return (
    <div style={{
      width:'100vw', height:'100vh',
      display:'grid', placeItems:'center',
      background: t.dark
        ? 'radial-gradient(ellipse at top, oklch(0.22 0.02 40) 0%, oklch(0.14 0.01 40) 80%)'
        : 'radial-gradient(ellipse at top, oklch(0.94 0.02 60) 0%, oklch(0.88 0.015 50) 90%)',
      fontFamily:'"Inter", -apple-system, system-ui, sans-serif',
    }}>
      <IOSDevice dark={t.dark} width={390} height={844}>
        <div style={{
          position:'absolute', inset:0, background:t.bg,
          color: t.ink, overflow:'hidden',
        }}>
          {/* ACTIVE SCREEN */}
          {detail ? (
            <DetailScreen t={t} s={s} L={L} loc={detail}
              onBack={() => setDetail(null)}
              saved={saved.includes(detail.id)}
              toggleSave={() => toggleSave(detail.id)}/>
          ) : tab === 'map' ? (
            <MapScreen t={t} s={s} L={L} tweaks={tweaks}
              filter={filter} setFilter={setFilter}
              onOpen={setDetail}
              saved={saved} toggleSave={toggleSave}
              sheetLoc={sheetLoc} setSheetLoc={setSheetLoc}/>
          ) : tab === 'saved' ? (
            <SavedScreen t={t} s={s} L={L} saved={saved}
              onOpen={setDetail} toggleSave={toggleSave}/>
          ) : tab === 'learn' ? (
            <LearnScreen t={t} s={s} L={L}/>
          ) : tab === 'buddy' ? (
            <BuddyScreen t={t} s={s} L={L}/>
          ) : tab === 'now' ? (
            <NowScreen t={t} s={s} L={L}
              onGoTo={(x) => setTab(x)}/>
          ) : null}

          {/* TOP STATUS CHIP (app name, only on map) */}
          {tab === 'map' && !detail && (
            <div style={{
              position:'absolute', top:14, left:0, right:0,
              display:'flex', justifyContent:'center', pointerEvents:'none',
              zIndex:15,
            }}>
              <div style={{
                padding:'3px 10px', borderRadius:999,
                background: t.dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.75)',
                backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
                fontSize:10, color:t.mute, letterSpacing:1.5,
                fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}>SAFE · SPOT</div>
            </div>
          )}

          {/* TAB BAR */}
          {!detail && <TabBar t={t} s={s} L={L} tab={tab} setTab={setTab}/>}

          {/* PRIVACY BADGE (first open) */}
          {showPrivacy && (
            <PrivacyBadge t={t} s={s} L={L} onDismiss={() => setShowPrivacy(false)}/>
          )}
        </div>
      </IOSDevice>

      {/* TWEAKS PANEL */}
      {editMode && (
        <TweaksPanel tweaks={tweaks} update={updateTweak}/>
      )}

      {/* fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');
        * { -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// TAB BAR
// ────────────────────────────────────────────────────────────
function TabBar({ t, s, L, tab, setTab }) {
  const tabs = [
    { k:'map',   label:L.tabMap,   icon:'map' },
    { k:'saved', label:L.tabSaved, icon:'star' },
    { k:'learn', label:L.tabLearn, icon:'book' },
    { k:'buddy', label:L.tabBuddy, icon:'buddy' },
    { k:'now',   label:L.tabNow,   icon:'bolt', urgent:true },
  ];
  return (
    <div style={{
      position:'absolute', bottom:0, left:0, right:0,
      padding:'8px 8px 24px', zIndex:50,
      background: t.dark
        ? 'linear-gradient(180deg, transparent 0%, oklch(0.16 0.015 50) 40%)'
        : 'linear-gradient(180deg, transparent 0%, oklch(0.98 0.008 70 / 0.95) 40%)',
    }}>
      <div style={{
        display:'flex', justifyContent:'space-around',
        background: t.dark ? 'rgba(30,25,22,0.88)' : 'rgba(255,255,255,0.88)',
        backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        borderRadius:28, padding:'8px 4px',
        boxShadow: t.dark
          ? '0 8px 24px rgba(0,0,0,0.4), inset 0 0 0 0.5px rgba(255,255,255,0.08)'
          : '0 8px 24px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(0,0,0,0.04)',
      }}>
        {tabs.map(tb => {
          const active = tab === tb.k;
          const color = tb.urgent
            ? (active ? t.urgent : t.urgent)
            : (active ? t.ink : t.mute);
          return (
            <button key={tb.k} onClick={() => setTab(tb.k)} style={{
              flex:1, padding:'8px 2px', border:'none', background:'transparent',
              display:'flex', flexDirection:'column', alignItems:'center', gap:3,
              cursor:'pointer', color, fontFamily:'inherit',
              opacity: tb.urgent ? (active ? 1 : 0.85) : 1,
            }}>
              <div style={{
                position:'relative', width:28, height:28,
                display:'grid', placeItems:'center',
              }}>
                {active && !tb.urgent && (
                  <div style={{
                    position:'absolute', inset:-2, borderRadius:10,
                    background:t.accentSoft,
                  }}/>
                )}
                {tb.urgent && active && (
                  <div style={{
                    position:'absolute', inset:-2, borderRadius:10,
                    background:t.urgentSoft,
                  }}/>
                )}
                <div style={{position:'relative', color: active && !tb.urgent ? t.accent : color}}>
                  {Icon[tb.icon]({width:20, height:20})}
                </div>
              </div>
              <div style={{
                fontSize:10, fontWeight:600, letterSpacing:0.2,
              }}>{tb.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// TWEAKS PANEL
// ────────────────────────────────────────────────────────────
function TweaksPanel({ tweaks, update }) {
  const Row = ({ label, children }) => (
    <div style={{marginBottom:14}}>
      <div style={{
        fontSize:10, fontWeight:600, color:'#888', textTransform:'uppercase',
        letterSpacing:1.5, marginBottom:8,
        fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
      }}>{label}</div>
      <div style={{display:'flex', gap:4, flexWrap:'wrap'}}>{children}</div>
    </div>
  );
  const Chip = ({ active, onClick, children, swatch }) => (
    <button onClick={onClick} style={{
      padding:'7px 10px', borderRadius:10,
      background: active ? '#1a1a1a' : '#f5f5f4',
      color: active ? '#fff' : '#1a1a1a',
      border:'none', fontFamily:'inherit', fontSize:12, fontWeight:500,
      cursor:'pointer', display:'flex', alignItems:'center', gap:6,
    }}>
      {swatch && <div style={{width:10, height:10, borderRadius:5, background:swatch}}/>}
      {children}
    </button>
  );
  return (
    <div style={{
      position:'fixed', bottom:20, right:20, width:280,
      background:'#fff', borderRadius:20, padding:18,
      boxShadow:'0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
      fontFamily:'"Inter", system-ui, sans-serif', color:'#1a1a1a',
      zIndex:1000,
    }}>
      <div style={{
        display:'flex', alignItems:'baseline', justifyContent:'space-between',
        marginBottom:14,
      }}>
        <div style={{
          fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
          fontSize:22, letterSpacing:-0.3,
        }}>Tweaks</div>
        <div style={{
          fontSize:10, color:'#888', letterSpacing:1.2,
          fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}>SAFE SPOT</div>
      </div>

      <Row label="Mode">
        <Chip active={tweaks.mode==='light'} onClick={() => update('mode','light')}>Light</Chip>
        <Chip active={tweaks.mode==='dark'} onClick={() => update('mode','dark')}>Dark</Chip>
      </Row>

      <Row label="Color theme">
        <Chip active={tweaks.theme==='warm'} onClick={() => update('theme','warm')}
          swatch="oklch(0.62 0.14 40)">Warm</Chip>
        <Chip active={tweaks.theme==='clinical'} onClick={() => update('theme','clinical')}
          swatch="oklch(0.55 0.14 245)">Clinical</Chip>
        <Chip active={tweaks.theme==='activist'} onClick={() => update('theme','activist')}
          swatch="oklch(0.80 0.16 75)">Activist</Chip>
      </Row>

      <Row label="Map style">
        <Chip active={tweaks.mapStyle==='realistic'} onClick={() => update('mapStyle','realistic')}>Realistic</Chip>
        <Chip active={tweaks.mapStyle==='abstract'} onClick={() => update('mapStyle','abstract')}>Abstract</Chip>
        <Chip active={tweaks.mapStyle==='schematic'} onClick={() => update('mapStyle','schematic')}>Schematic</Chip>
      </Row>

      <Row label="Language">
        <Chip active={tweaks.lang==='EN'} onClick={() => update('lang','EN')}>EN</Chip>
        <Chip active={tweaks.lang==='ES'} onClick={() => update('lang','ES')}>ES</Chip>
        <Chip active={tweaks.lang==='ZH'} onClick={() => update('lang','ZH')}>中文</Chip>
      </Row>

      <Row label="Big text">
        <Chip active={!tweaks.bigText} onClick={() => update('bigText',false)}>Normal</Chip>
        <Chip active={tweaks.bigText} onClick={() => update('bigText',true)}>Large</Chip>
      </Row>

      <Row label="Density">
        <Chip active={tweaks.density==='comfortable'} onClick={() => update('density','comfortable')}>Comfortable</Chip>
        <Chip active={tweaks.density==='compact'} onClick={() => update('density','compact')}>Compact</Chip>
      </Row>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
