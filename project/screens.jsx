// screens.jsx — individual screens

// ────────────────────────────────────────────────────────────
// PRIVACY BADGE (shown on first open)
// ────────────────────────────────────────────────────────────
function PrivacyBadge({ t, s, L, onDismiss }) {
  return (
    <div style={{
      position:'absolute', inset:0, zIndex:200,
      background: t.dark ? 'rgba(0,0,0,0.55)' : 'rgba(30,20,15,0.35)',
      backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
      display:'flex', alignItems:'flex-end', justifyContent:'center',
      padding:'0 16px 34px',
    }}>
      <div style={{
        width:'100%', background:t.surface, borderRadius:28,
        padding:'28px 24px 20px', color:t.ink,
        boxShadow:'0 20px 60px rgba(0,0,0,0.25)',
      }}>
        <div style={{
          width:52, height:52, borderRadius:26, background:t.accentSoft,
          color:t.accent, display:'grid', placeItems:'center', marginBottom:16,
        }}>
          <Icon.lock width="24" height="24"/>
        </div>
        <div style={{
          fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
          fontSize:s.h1, lineHeight:1.05, letterSpacing:-0.5, marginBottom:10,
        }}>{L.privacyTitle}</div>
        <div style={{fontSize:s.body, lineHeight:1.45, color:t.mute, marginBottom:20}}>
          {L.privacyBody}
        </div>
        <div style={{
          display:'flex', gap:8, flexWrap:'wrap', marginBottom:20,
          fontSize:s.small, color:t.mute,
        }}>
          {[
            'No sign-in',
            'No location history',
            'No analytics',
            'Works offline',
          ].map(p => (
            <div key={p} style={{
              padding:'6px 10px', borderRadius:999,
              background:t.faint, color:t.ink,
              display:'flex', alignItems:'center', gap:6,
              fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize:s.small-1,
            }}>
              <Icon.check width="12" height="12"/>{p}
            </div>
          ))}
        </div>
        <button onClick={onDismiss} style={{
          width:'100%', height:s.tap+4, border:'none',
          background:t.ink, color:t.surface, borderRadius:16,
          fontFamily:'inherit', fontSize:s.h3, fontWeight:600,
          letterSpacing:-0.2, cursor:'pointer',
        }}>{L.privacyCta}</button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// MAP SCREEN
// ────────────────────────────────────────────────────────────
const FILTERS = ['All', 'SEP', 'Narcan', 'Test strips', 'Wound care'];

function MapScreen({ t, s, L, tweaks, filter, setFilter, onOpen, saved, toggleSave, sheetLoc, setSheetLoc, locations }) {
  const locs = locations || LOCATIONS;
  const [query, setQuery] = React.useState('');
  const [searchFocused, setSearchFocused] = React.useState(false);

  const filterLabel = (f) => {
    if (f === 'All') return L.filterAll;
    if (f === 'SEP') return L.filterSEP;
    if (f === 'Narcan') return L.filterNarcan;
    if (f === 'Test strips') return L.filterTest;
    if (f === 'Wound care') return L.filterWound;
  };

  const q = query.toLowerCase().trim();
  const visible = locs.filter(l => {
    const matchesFilter = filter === 'All' || l.services.includes(filter);
    const matchesQuery  = !q
      || l.name.toLowerCase().includes(q)
      || l.neighborhood.toLowerCase().includes(q)
      || l.addr.toLowerCase().includes(q)
      || l.services.some(sv => sv.toLowerCase().includes(q));
    return matchesFilter && matchesQuery;
  });

  return (
    <div style={{position:'absolute', inset:0}}>
      <MapView t={t} tweaks={tweaks} style={tweaks.mapStyle} locations={locs}
        filter={filter} onPin={setSheetLoc}/>

      {/* top bar */}
      <div style={{
        position:'absolute', top:54, left:12, right:12,
        display:'flex', flexDirection:'column', gap:10,
      }}>
        {/* search */}
        <div style={{
          background:t.surface, borderRadius:18, height:s.tap,
          display:'flex', alignItems:'center', padding:'0 14px', gap:10,
          boxShadow:'0 8px 24px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.04)',
          color:t.mute,
          outline: searchFocused ? `2px solid ${t.accent}` : 'none',
          outlineOffset: 1,
          transition: 'outline 0.15s',
        }}>
          <Icon.search width="18" height="18"/>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search by name, neighborhood…"
            style={{
              flex:1, border:'none', background:'transparent', outline:'none',
              fontSize:s.body, color:t.ink, fontFamily:'inherit',
            }}
          />
          {query ? (
            <button onClick={() => setQuery('')} style={{
              background:'transparent', border:'none', color:t.mute,
              cursor:'pointer', display:'grid', placeItems:'center', padding:2,
            }}><Icon.close width="14" height="14"/></button>
          ) : (
            <div style={{
              padding:'4px 8px', background:t.accentSoft, color:t.accent,
              borderRadius:8, fontSize:s.small,
              fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}>{visible.length}</div>
          )}
        </div>

        {/* filter chips */}
        <div style={{
          display:'flex', gap:6, overflowX:'auto', paddingBottom:2,
          scrollbarWidth:'none',
        }}>
          {FILTERS.map(f => {
            const active = filter === f;
            const meta = SERVICE_META[f];
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                flex:'0 0 auto', height:36, padding:'0 14px', borderRadius:18,
                border:active ? 'none' : `1px solid ${t.border}`,
                background: active ? t.ink : t.surface,
                color: active ? t.surface : t.ink,
                display:'flex', alignItems:'center', gap:6,
                fontSize:s.small+1, fontFamily:'inherit', fontWeight:500,
                cursor:'pointer', whiteSpace:'nowrap',
              }}>
                {meta && <div style={{width:14, height:14}}>{Icon[meta.icon]({width:14,height:14})}</div>}
                {filterLabel(f)}
              </button>
            );
          })}
        </div>
      </div>

      {/* bottom sheet: either a hint or a location preview */}
      {sheetLoc ? (
        <LocationPeek t={t} s={s} L={L} loc={sheetLoc}
          onOpen={() => onOpen(sheetLoc)}
          onClose={() => setSheetLoc(null)}
          saved={saved.includes(sheetLoc.id)}
          toggleSave={() => toggleSave(sheetLoc.id)} />
      ) : (
        <NearbySheet t={t} s={s} L={L} locations={visible} onOpen={setSheetLoc}/>
      )}
    </div>
  );
}

function NearbySheet({ t, s, L, locations, onOpen }) {
  return (
    <div style={{
      position:'absolute', left:0, right:0, bottom:0,
      background:t.surface, borderTopLeftRadius:28, borderTopRightRadius:28,
      boxShadow:'0 -12px 40px rgba(0,0,0,0.12)',
      padding:'10px 0 96px',
      maxHeight:'52%', display:'flex', flexDirection:'column',
    }}>
      <div style={{
        width:36, height:5, background:t.border, borderRadius:3,
        margin:'0 auto 10px',
      }}/>
      <div style={{padding:'0 20px 12px', display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
        <div style={{
          fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
          fontSize:s.h2+4, letterSpacing:-0.3, color:t.ink,
        }}>{L.hereNow}</div>
      </div>
      <div style={{overflowY:'auto', padding:'0 16px'}}>
        {locations.slice(0, 6).map((l, i) => (
          <LocationRow key={l.id} t={t} s={s} L={L} loc={l} onClick={() => onOpen(l)} last={i===locations.slice(0,6).length-1}/>
        ))}
      </div>
    </div>
  );
}

function LocationRow({ t, s, L, loc, onClick, last }) {
  return (
    <button onClick={onClick} style={{
      width:'100%', display:'flex', alignItems:'center', gap:12,
      padding:'12px 4px', background:'transparent', border:'none',
      borderBottom: last ? 'none' : `1px solid ${t.faint}`,
      textAlign:'left', cursor:'pointer', color:t.ink, fontFamily:'inherit',
    }}>
      <OpenDot t={t} open={loc.openNow} closesSoon={loc.closesSoon}/>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:s.h3, fontWeight:600, letterSpacing:-0.2, marginBottom:2}}>
          {loc.name}
        </div>
        <div style={{fontSize:s.small+1, color:t.mute, display:'flex', gap:8, alignItems:'center'}}>
          <span>{loc.neighborhood}</span>
          <span style={{opacity:0.5}}>·</span>
          <span style={{display:'inline-flex', alignItems:'center', gap:3}}>
            <Icon.walk width="12" height="12"/>{loc.walk}m
          </span>
        </div>
      </div>
      <ServiceDots t={t} services={loc.services}/>
    </button>
  );
}

function ServiceDots({ t, services }) {
  return (
    <div style={{display:'flex', gap:4}}>
      {services.map(sv => {
        const meta = SERVICE_META[sv]; if (!meta) return null;
        return (
          <div key={sv} style={{
            width:22, height:22, borderRadius:6, background:t.faint,
            color:t.mute, display:'grid', placeItems:'center',
          }}>{Icon[meta.icon]({width:12, height:12})}</div>
        );
      })}
    </div>
  );
}

function OpenDot({ t, open, closesSoon }) {
  if (!open) return (
    <div style={{width:10, height:10, borderRadius:5, background:t.border, flexShrink:0}}/>
  );
  return (
    <div style={{position:'relative', width:10, height:10, flexShrink:0}}>
      <div style={{
        position:'absolute', inset:0, borderRadius:5,
        background: closesSoon ? t.accent : t.open,
      }}/>
      <div style={{
        position:'absolute', inset:-3, borderRadius:8,
        background: closesSoon ? t.accent : t.open, opacity:0.25,
      }}/>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// PEEK (mini card above bottom tabs when a pin is tapped)
// ────────────────────────────────────────────────────────────
function LocationPeek({ t, s, L, loc, onOpen, onClose, saved, toggleSave }) {
  return (
    <div style={{
      position:'absolute', left:12, right:12, bottom:92,
      background:t.surface, borderRadius:24,
      boxShadow:'0 20px 50px rgba(0,0,0,0.22)',
      padding:'16px 16px 14px',
    }}>
      <div style={{display:'flex', alignItems:'flex-start', gap:12, marginBottom:12}}>
        <OpenDot t={t} open={loc.openNow} closesSoon={loc.closesSoon}/>
        <div style={{flex:1, minWidth:0}}>
          <div style={{
            fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
            fontSize:s.h2, letterSpacing:-0.3, color:t.ink, lineHeight:1.1,
          }}>{loc.name}</div>
          <div style={{fontSize:s.small+1, color:t.mute, marginTop:4}}>
            {loc.addr} · {loc.neighborhood}
          </div>
        </div>
        <button onClick={onClose} style={{
          background:'transparent', border:'none', color:t.mute,
          padding:4, cursor:'pointer',
        }}><Icon.close width="18" height="18"/></button>
      </div>

      <div style={{display:'flex', gap:6, marginBottom:12, flexWrap:'wrap'}}>
        {loc.services.map(sv => {
          const meta = SERVICE_META[sv]; if (!meta) return null;
          return (
            <div key={sv} style={{
              padding:'5px 9px', borderRadius:8, background:t.faint, color:t.ink,
              display:'flex', alignItems:'center', gap:5, fontSize:s.small+1,
            }}>
              {Icon[meta.icon]({width:13, height:13})}
              {meta.label.EN}
            </div>
          );
        })}
      </div>

      <div style={{
        fontSize:s.small+1, color:t.mute, marginBottom:12,
        display:'flex', gap:10, alignItems:'center',
      }}>
        {loc.openNow ? (
          <span style={{color:loc.closesSoon ? t.accent : t.open, fontWeight:600}}>
            {loc.closesSoon ? L.closesSoon : L.openNow}
          </span>
        ) : <span>{L.closed}</span>}
        <span style={{opacity:0.5}}>·</span>
        <span style={{display:'inline-flex', alignItems:'center', gap:4}}>
          <Icon.walk width="13" height="13"/>{loc.walk} {L.walking}
        </span>
        <span style={{opacity:0.5}}>·</span>
        <span style={{display:'inline-flex', alignItems:'center', gap:4}}>
          <Icon.transit width="13" height="13"/>{loc.transit} {L.transit}
        </span>
      </div>

      <div style={{display:'flex', gap:8}}>
        <button onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(loc.addr), '_blank')} style={{
          flex:1, height:s.tap, background:t.ink, color:t.surface,
          border:'none', borderRadius:14, fontFamily:'inherit',
          fontSize:s.h3, fontWeight:600, letterSpacing:-0.2, cursor:'pointer',
        }}>{L.openMaps}</button>
        <button onClick={toggleSave} aria-label={L.save} style={{
          width:s.tap, height:s.tap, background:t.faint,
          color: saved ? t.accent : t.mute, border:'none', borderRadius:14,
          display:'grid', placeItems:'center', cursor:'pointer',
        }}>{saved ? <Icon.starFill width="20" height="20"/> : <Icon.star width="20" height="20"/>}</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  PrivacyBadge, MapScreen, NearbySheet, LocationRow, ServiceDots, OpenDot, LocationPeek, FILTERS,
});
