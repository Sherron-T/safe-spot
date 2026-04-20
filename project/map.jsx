// map.jsx — NYC map view (realistic / abstract / schematic)

function MapView({ t, tweaks, style, locations, filter, onPin }) {
  // style: 'realistic' | 'abstract' | 'schematic'
  const W = 100, H = 100;
  const visible = locations.filter(l => filter === 'All' || l.services.includes(filter));

  const boroughFill = t.mapLand;
  const waterFill = t.mapWater;

  return (
    <div style={{
      position: 'absolute', inset: 0, background: waterFill, overflow: 'hidden',
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{display:'block'}}>
        {/* water texture (subtle stripes) */}
        {style !== 'schematic' && (
          <defs>
            <pattern id="water" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M0 2 Q1 1 2 2 T4 2" stroke={t.dark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.04)'} fill="none" strokeWidth="0.3"/>
            </pattern>
          </defs>
        )}
        {style !== 'schematic' && <rect x="0" y="0" width={W} height={H} fill="url(#water)"/>}

        {/* boroughs */}
        {Object.entries(BOROUGH_PATHS).map(([k, d]) => (
          <path key={k} d={d} fill={boroughFill}
            stroke={t.border} strokeWidth={style==='schematic'?0.6:0.2}
            strokeLinejoin="round"
          />
        ))}

        {/* parks */}
        {style !== 'schematic' && (
          <>
            <rect x="44" y="20" width="6" height="22" rx="1" fill={t.mapPark}/>
            <rect x="70" y="40" width="8" height="6" rx="1" fill={t.mapPark}/>
            <rect x="74" y="76" width="6" height="8" rx="1" fill={t.mapPark}/>
          </>
        )}

        {/* streets */}
        {style === 'realistic' && STREETS.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke={t.mapStreet} strokeWidth="0.6" strokeLinecap="round"/>
        ))}
        {style === 'abstract' && STREETS.slice(0, 6).map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke={t.border} strokeWidth="0.25" strokeLinecap="round" opacity="0.6"/>
        ))}

        {/* schematic subway-style lines */}
        {style === 'schematic' && (
          <>
            <path d="M 40 8 C 42 30, 46 50, 54 70 L 60 86" stroke={t.accent} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <path d="M 78 14 C 72 30, 64 48, 60 70 L 60 86" stroke={t.open} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <path d="M 42 20 L 92 30 L 84 70 L 66 92" stroke={t.urgent} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8"/>
          </>
        )}

        {/* borough labels */}
        {style !== 'schematic' && (
          <g style={{fontFamily:'ui-serif, "Iowan Old Style", Georgia, serif', fontStyle:'italic'}} fill={t.mute} opacity="0.55">
            <text x="46" y="40" fontSize="2.6">Manhattan</text>
            <text x="68" y="18" fontSize="2.6">Bronx</text>
            <text x="82" y="40" fontSize="2.6">Queens</text>
            <text x="70" y="84" fontSize="2.6">Brooklyn</text>
            <text x="28" y="89" fontSize="2.4">Staten I.</text>
          </g>
        )}

        {/* location pins */}
        {visible.map((l) => (
          <g key={l.id} onClick={() => onPin(l)} style={{cursor:'pointer'}}>
            {l.openNow && (
              <circle cx={l.x} cy={l.y} r="3.6" fill={t.accent} opacity="0.16">
                <animate attributeName="r" values="3.6;5;3.6" dur="2.4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.16;0;0.16" dur="2.4s" repeatCount="indefinite"/>
              </circle>
            )}
            <circle cx={l.x} cy={l.y} r="2.2" fill={l.openNow ? t.accent : t.mute}/>
            <circle cx={l.x} cy={l.y} r="0.9" fill={t.surface}/>
          </g>
        ))}

        {/* "you are here" */}
        <g>
          <circle cx="52" cy="58" r="4" fill={t.open} opacity="0.18"/>
          <circle cx="52" cy="58" r="1.6" fill={t.open}/>
          <circle cx="52" cy="58" r="1.6" fill="none" stroke={t.surface} strokeWidth="0.4"/>
        </g>
      </svg>
    </div>
  );
}

Object.assign(window, { MapView });
