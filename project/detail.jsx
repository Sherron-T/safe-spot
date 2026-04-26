// detail.jsx — full location detail, learn, buddy, saved, emergency

// ────────────────────────────────────────────────────────────
// LOCATION DETAIL (full-screen sheet)
// ────────────────────────────────────────────────────────────
function DetailScreen({ t, s, L, loc, onBack, saved, toggleSave }) {
  if (!loc) return null;
  return (
    <div style={{
      position:'absolute', inset:0, background:t.bg, color:t.ink,
      overflowY:'auto', display:'flex', flexDirection:'column',
    }}>
      {/* header image (placeholder stripe) */}
      <div style={{
        position:'relative', height:200, flexShrink:0,
        background:`repeating-linear-gradient(135deg, ${t.accentSoft} 0 18px, ${t.surface} 18px 36px)`,
        borderBottom:`1px solid ${t.border}`,
      }}>
        <div style={{
          position:'absolute', inset:0, display:'grid', placeItems:'center',
          fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize:s.small, color:t.mute, letterSpacing:1,
        }}>[ storefront photo ]</div>

        {/* back + save */}
        <div style={{
          position:'absolute', top:54, left:12, right:12,
          display:'flex', justifyContent:'space-between',
        }}>
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:20, background:t.surface,
            border:'none', display:'grid', placeItems:'center',
            boxShadow:'0 4px 14px rgba(0,0,0,0.14)', cursor:'pointer',
            color:t.ink,
          }}><Icon.chevron width="18" height="18" style={{transform:'rotate(180deg)'}}/></button>
          <button onClick={toggleSave} style={{
            width:40, height:40, borderRadius:20, background:t.surface,
            border:'none', display:'grid', placeItems:'center',
            boxShadow:'0 4px 14px rgba(0,0,0,0.14)', cursor:'pointer',
            color: saved ? t.accent : t.ink,
          }}>{saved ? <Icon.starFill width="18" height="18"/> : <Icon.star width="18" height="18"/>}</button>
        </div>
      </div>

      <div style={{padding:'20px 20px 120px'}}>
        {/* name + open state */}
        <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:6}}>
          <OpenDot t={t} open={loc.openNow} closesSoon={loc.closesSoon}/>
          <span style={{
            fontSize:s.small+1, fontWeight:600,
            color: loc.openNow ? (loc.closesSoon ? t.accent : t.open) : t.mute,
          }}>
            {loc.openNow ? (loc.closesSoon ? L.closesSoon : L.openNow) : L.closed}
          </span>
          <span style={{color:t.mute, fontSize:s.small+1}}>· {loc.org}</span>
        </div>
        <div style={{
          fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
          fontSize:s.h1+2, lineHeight:1.05, letterSpacing:-0.5, marginBottom:6,
        }}>{loc.name}</div>
        <div style={{fontSize:s.body, color:t.mute, marginBottom:18}}>
          {loc.addr}, {loc.neighborhood}
        </div>

        {/* note — human voice */}
        <div style={{
          padding:'14px 16px', borderRadius:16, background:t.accentSoft,
          color:t.ink, fontSize:s.body, lineHeight:1.4, marginBottom:20,
          fontStyle:'italic',
        }}>
          "{loc.note}"
        </div>

        {/* primary actions */}
        <div style={{display:'flex', gap:8, marginBottom:24}}>
          <button onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(loc.addr), '_blank')} style={{
            flex:2, height:s.tap+4, background:t.ink, color:t.surface,
            border:'none', borderRadius:14, display:'flex', alignItems:'center',
            justifyContent:'center', gap:8, fontFamily:'inherit',
            fontSize:s.h3, fontWeight:600, cursor:'pointer',
          }}><Icon.walk width="18" height="18"/>{L.openMaps} · {loc.walk}m</button>
          <button onClick={() => loc.phone && (window.location.href = 'tel:' + loc.phone.replace(/\D/g,''))} style={{
            flex:1, height:s.tap+4, background:t.surface, color:t.ink,
            border:`1px solid ${t.border}`, borderRadius:14, display:'flex',
            alignItems:'center', justifyContent:'center', gap:6,
            fontFamily:'inherit', fontSize:s.h3, fontWeight:600, cursor:'pointer',
            opacity: loc.phone ? 1 : 0.4,
          }}><Icon.phone width="16" height="16"/>{L.call}</button>
        </div>

        {/* services */}
        <SectionLabel t={t} s={s}>{L.services}</SectionLabel>
        <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:24}}>
          {loc.services.map(sv => {
            const meta = SERVICE_META[sv]; if (!meta) return null;
            return (
              <div key={sv} style={{
                padding:'10px 12px', borderRadius:12, background:t.surface,
                border:`1px solid ${t.border}`,
                display:'flex', alignItems:'center', gap:8, fontSize:s.body,
              }}>
                <div style={{color:t.accent}}>{Icon[meta.icon]({width:18, height:18})}</div>
                {meta.label.EN}
              </div>
            );
          })}
        </div>

        {/* hours */}
        <SectionLabel t={t} s={s}>{L.hours}</SectionLabel>
        <div style={{
          background:t.surface, borderRadius:16, border:`1px solid ${t.border}`,
          padding:'4px 14px', marginBottom:24,
        }}>
          {Object.entries(loc.hours).map(([day, h], i, arr) => (
            <div key={day} style={{
              display:'flex', justifyContent:'space-between', padding:'10px 0',
              borderBottom: i < arr.length - 1 ? `1px solid ${t.faint}` : 'none',
              fontSize:s.body,
            }}>
              <span style={{
                color: day === todayKey() ? t.ink : t.mute,
                fontWeight: day === todayKey() ? 600 : 400,
                textTransform:'capitalize',
              }}>{dayLabel(day)}</span>
              <span style={{
                color: h === 'Closed' ? t.mute : t.ink,
                fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: s.body-1,
              }}>{h}</span>
            </div>
          ))}
        </div>

        {/* languages + access */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24}}>
          <div>
            <SectionLabel t={t} s={s}>{L.languages}</SectionLabel>
            <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
              {loc.languages.map(lg => (
                <div key={lg} style={{
                  padding:'6px 10px', borderRadius:8, background:t.faint,
                  fontSize:s.small+1, fontWeight:600, color:t.ink,
                  fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
                }}>{lg}</div>
              ))}
            </div>
          </div>
          <div>
            <SectionLabel t={t} s={s}>{L.access}</SectionLabel>
            <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
              {loc.access.map(a => (
                <div key={a} style={{
                  padding:'6px 10px', borderRadius:8,
                  background:t.openSoft, color:t.ink,
                  fontSize:s.small+1, display:'flex', gap:4, alignItems:'center',
                }}><Icon.check width="11" height="11"/>{a}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ t, s, children }) {
  return (
    <div style={{
      fontSize:s.small, fontWeight:600, color:t.mute,
      textTransform:'uppercase', letterSpacing:1.5, marginBottom:10,
      fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
    }}>{children}</div>
  );
}
function todayKey() {
  const d = ['sun','mon','tue','wed','thu','fri','sat'];
  return d[new Date().getDay()];
}
function dayLabel(k) {
  return ({mon:'Monday',tue:'Tuesday',wed:'Wednesday',thu:'Thursday',fri:'Friday',sat:'Saturday',sun:'Sunday'})[k];
}

// ────────────────────────────────────────────────────────────
// LEARN — How to use naloxone
// ────────────────────────────────────────────────────────────
const NARCAN_STEPS = [
  { n: '01', title: 'Check for signs', body: "Not breathing. Blue or grey lips. Won't wake when you shake them. Making gurgling sounds." },
  { n: '02', title: 'Call 911', body: "Say 'possible overdose'. NYC's 911 won't ask about drugs. The Good Samaritan Law protects you." },
  { n: '03', title: 'Give naloxone', body: "Tilt head back. Put the tip in one nostril. Press the plunger firmly. It's one dose." },
  { n: '04', title: 'Rescue breaths', body: "Pinch nose. Seal your mouth over theirs. One breath every 5 seconds until they wake." },
  { n: '05', title: 'Wait & watch', body: "Naloxone works in 2–3 minutes. If no change, give a second dose in the other nostril." },
  { n: '06', title: 'Recovery position', body: "On their side, top knee bent, hand under head. Stay with them until help arrives." },
];

function LearnScreen({ t, s, L }) {
  const [step, setStep] = React.useState(0);
  return (
    <div style={{
      position:'absolute', inset:0, background:t.bg,
      overflowY:'auto', color:t.ink, padding:'70px 0 110px',
    }}>
      <div style={{padding:'0 20px 16px'}}>
        <div style={{
          fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize:s.small, color:t.mute, letterSpacing:1.5, marginBottom:10,
        }}>REVERSING AN OVERDOSE</div>
        <div style={{
          fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
          fontSize:s.h1+4, lineHeight:1.0, letterSpacing:-0.8,
        }}>Six steps.<br/>Two minutes.<br/>
          <span style={{color:t.accent, fontStyle:'italic'}}>One life.</span>
        </div>
      </div>

      {/* step nav */}
      <div style={{
        display:'flex', gap:4, padding:'16px 20px 20px',
        overflowX:'auto', scrollbarWidth:'none',
      }}>
        {NARCAN_STEPS.map((st, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex:'0 0 auto', width:36, height:36, borderRadius:18,
            background: step === i ? t.ink : t.faint,
            color: step === i ? t.surface : t.mute,
            border:'none', fontFamily:'ui-monospace, monospace',
            fontSize:s.small+1, fontWeight:600, cursor:'pointer',
          }}>{i+1}</button>
        ))}
      </div>

      {/* active step card */}
      <div style={{padding:'0 20px'}}>
        <div style={{
          background:t.surface, borderRadius:24, padding:'24px 22px',
          border:`1px solid ${t.border}`,
        }}>
          <div style={{
            fontFamily:'ui-monospace, monospace', fontSize:s.small,
            color:t.accent, letterSpacing:3, marginBottom:14,
          }}>STEP {NARCAN_STEPS[step].n}</div>
          <div style={{
            fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
            fontSize:s.h1, lineHeight:1.05, letterSpacing:-0.4, marginBottom:14,
          }}>{NARCAN_STEPS[step].title}</div>
          <div style={{fontSize:s.body+1, lineHeight:1.5, color:t.ink}}>
            {NARCAN_STEPS[step].body}
          </div>

          {/* illustration placeholder */}
          <div style={{
            marginTop:20, height:140, borderRadius:16,
            background:`repeating-linear-gradient(45deg, ${t.faint} 0 10px, ${t.surface} 10px 20px)`,
            border:`1px dashed ${t.border}`,
            display:'grid', placeItems:'center',
            fontFamily:'ui-monospace, monospace', fontSize:s.small,
            color:t.mute, letterSpacing:1,
          }}>[ illustration: step {step+1} ]</div>
        </div>

        {/* navigation */}
        <div style={{display:'flex', gap:8, marginTop:16}}>
          <button onClick={() => setStep(Math.max(0, step-1))} disabled={step===0}
            style={{
              flex:1, height:s.tap, borderRadius:14,
              background:t.surface, color:t.ink, border:`1px solid ${t.border}`,
              fontFamily:'inherit', fontSize:s.h3, fontWeight:500,
              cursor: step===0 ? 'default' : 'pointer',
              opacity: step===0 ? 0.4 : 1,
            }}>Back</button>
          <button onClick={() => setStep(Math.min(NARCAN_STEPS.length-1, step+1))}
            disabled={step===NARCAN_STEPS.length-1}
            style={{
              flex:2, height:s.tap, borderRadius:14,
              background:t.ink, color:t.surface, border:'none',
              fontFamily:'inherit', fontSize:s.h3, fontWeight:600,
              cursor: step===NARCAN_STEPS.length-1 ? 'default' : 'pointer',
              opacity: step===NARCAN_STEPS.length-1 ? 0.4 : 1,
            }}>{step===NARCAN_STEPS.length-1 ? 'Done' : 'Next step'}</button>
        </div>

        {/* quick facts */}
        <div style={{marginTop:28}}>
          <SectionLabel t={t} s={s}>Good to know</SectionLabel>
          <div style={{
            background:t.surface, borderRadius:16, border:`1px solid ${t.border}`,
            padding:'4px 16px',
          }}>
            {[
              ["It can't hurt to give it.", "Even if you're not sure it's an overdose, naloxone won't cause harm."],
              ["NYC's 911 won't ask about drugs.", 'Good Samaritan Law protects you and the person you help.'],
              ['Carry two doses.', 'Fentanyl is stronger. A second dose in the other nostril may be needed after 3 min.'],
              ['Put them in the recovery position.', 'On their side, top knee bent. Prevents choking if they vomit.'],
            ].map(([q, a], i, arr) => (
              <div key={i} style={{
                padding:'14px 0',
                borderBottom: i < arr.length-1 ? `1px solid ${t.faint}` : 'none',
              }}>
                <div style={{fontSize:s.body, fontWeight:600, marginBottom:4}}>{q}</div>
                <div style={{fontSize:s.small+1, color:t.mute, lineHeight:1.4}}>{a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Good Samaritan Law */}
        <div style={{marginTop:28}}>
          <SectionLabel t={t} s={s}>Good Samaritan Law</SectionLabel>
          <div style={{
            background:t.openSoft, borderRadius:16, padding:'16px',
            border:`1px solid ${t.open}22`,
          }}>
            <div style={{fontSize:s.body, fontWeight:700, color:t.open, marginBottom:8}}>
              You are protected in NYC.
            </div>
            {[
              'NY Public Health Law §3000-a covers anyone who calls 911 for an overdose.',
              'Protects the caller and the person experiencing the overdose.',
              'Covers possession of small amounts of drugs and paraphernalia.',
              'You cannot be charged with or convicted of certain drug offenses.',
            ].map((line, i) => (
              <div key={i} style={{
                display:'flex', gap:8, alignItems:'flex-start',
                fontSize:s.small+1, color:t.ink, lineHeight:1.5,
                marginBottom: i < 3 ? 8 : 0,
              }}>
                <Icon.check width="13" height="13" style={{color:t.open, flexShrink:0, marginTop:2}}/>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Fentanyl test strips */}
        <div style={{marginTop:28, marginBottom:8}}>
          <SectionLabel t={t} s={s}>How to use fentanyl test strips</SectionLabel>
          <div style={{
            background:t.surface, borderRadius:16, border:`1px solid ${t.border}`,
            padding:'4px 16px',
          }}>
            {[
              ['Mix a small residue', 'Add a teaspoon of water to the bag or surface the drug was on.'],
              ['Dip the strip', 'Put the wavy end in the water for 15 seconds.'],
              ['Wait 2–5 minutes', 'Lay flat on a surface. Do not touch the result window.'],
              ['Read the result', '1 line = fentanyl detected. 2 lines = not detected. Never fully safe.'],
            ].map(([step, desc], i, arr) => (
              <div key={i} style={{
                padding:'12px 0',
                borderBottom: i < arr.length-1 ? `1px solid ${t.faint}` : 'none',
              }}>
                <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                  <div style={{
                    width:22, height:22, borderRadius:11, background:t.accentSoft,
                    color:t.accent, display:'grid', placeItems:'center', flexShrink:0,
                    fontFamily:'ui-monospace, monospace', fontSize:s.small, fontWeight:700,
                  }}>{i+1}</div>
                  <div>
                    <div style={{fontSize:s.body, fontWeight:600, marginBottom:2}}>{step}</div>
                    <div style={{fontSize:s.small+1, color:t.mute, lineHeight:1.4}}>{desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop:10, padding:'10px 14px', borderRadius:10,
            background:t.urgentSoft, fontSize:s.small+1, color:t.ink, lineHeight:1.5,
          }}>
            <strong>Even if the strip shows negative</strong>, fentanyl can be unevenly distributed. Never use alone.
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// BUDDY
// ────────────────────────────────────────────────────────────
function BuddyScreen({ t, s, L }) {
  const [min, setMin] = React.useState(15);
  const [active, setActive] = React.useState(false);
  const [remaining, setRemaining] = React.useState(null);

  React.useEffect(() => {
    if (!active) return;
    setRemaining(min * 60);
    const iv = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(iv); setActive(false); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [active]);

  const pct = active && remaining != null ? remaining / (min*60) : 1;
  const mm = active ? Math.floor(remaining/60) : min;
  const ss = active ? remaining % 60 : 0;

  return (
    <div style={{
      position:'absolute', inset:0, background:t.bg, overflowY:'auto',
      color:t.ink, padding:'70px 20px 110px',
    }}>
      <div style={{
        fontFamily:'ui-monospace, monospace', fontSize:s.small,
        color:t.mute, letterSpacing:1.5, marginBottom:10,
      }}>USING ALONE</div>
      <div style={{
        fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
        fontSize:s.h1+2, lineHeight:1.05, letterSpacing:-0.5, marginBottom:10,
      }}>{L.buddyTitle}</div>
      <div style={{fontSize:s.body, color:t.mute, marginBottom:24, lineHeight:1.5}}>
        {L.buddyBody}
      </div>

      {/* dial */}
      <div style={{
        aspectRatio:'1 / 1', margin:'0 auto 24px', maxWidth:260,
        position:'relative',
      }}>
        <svg viewBox="0 0 100 100" style={{width:'100%', height:'100%', transform:'rotate(-90deg)'}}>
          <circle cx="50" cy="50" r="44" fill="none" stroke={t.faint} strokeWidth="6"/>
          <circle cx="50" cy="50" r="44" fill="none" stroke={t.accent} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2*Math.PI*44}
            strokeDashoffset={2*Math.PI*44*(1-pct)}
            style={{transition:'stroke-dashoffset 1s linear'}}/>
        </svg>
        <div style={{
          position:'absolute', inset:0, display:'flex',
          flexDirection:'column', alignItems:'center', justifyContent:'center',
        }}>
          <div style={{
            fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
            fontSize:72, letterSpacing:-2, color:t.ink, lineHeight:1,
          }}>{active
            ? `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
            : `${min}`}</div>
          <div style={{
            fontSize:s.small+1, color:t.mute, marginTop:4,
            fontFamily:'ui-monospace, monospace', letterSpacing:1,
          }}>{active ? 'COUNTING DOWN' : L.minutes.toUpperCase()}</div>
        </div>
      </div>

      {!active && (
        <>
          <div style={{
            display:'flex', gap:6, justifyContent:'center', marginBottom:24,
          }}>
            {[5, 10, 15, 30, 60].map(m => (
              <button key={m} onClick={() => setMin(m)} style={{
                padding:'8px 14px', borderRadius:10,
                background: min === m ? t.ink : t.surface,
                color: min === m ? t.surface : t.ink,
                border: min === m ? 'none' : `1px solid ${t.border}`,
                fontFamily:'inherit', fontSize:s.body, cursor:'pointer',
                fontWeight: 500,
              }}>{m}</button>
            ))}
          </div>

          {/* buddy selector */}
          <SectionLabel t={t} s={s}>Who's watching?</SectionLabel>
          <div style={{
            background:t.surface, border:`1px solid ${t.border}`,
            borderRadius:16, padding:'4px 16px', marginBottom:20,
          }}>
            {[
              { name: 'Maya (my sister)', num: '··· ··· 4821', active: true },
              { name: 'Never Use Alone hotline', num: '1-800-484-3731', active: false },
              { name: 'Add someone…', num: null, active: false, add:true },
            ].map((p, i, arr) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:12, padding:'14px 0',
                borderBottom: i < arr.length-1 ? `1px solid ${t.faint}` : 'none',
              }}>
                <div style={{
                  width:22, height:22, borderRadius:11,
                  border:`2px solid ${p.active ? t.accent : t.border}`,
                  background: p.active ? t.accent : 'transparent',
                  display:'grid', placeItems:'center', color:t.surface,
                }}>{p.active && <Icon.check width="12" height="12"/>}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:s.body, fontWeight:500, color: p.add ? t.mute : t.ink}}>{p.name}</div>
                  {p.num && <div style={{fontSize:s.small+1, color:t.mute,
                    fontFamily:'ui-monospace, monospace', marginTop:2}}>{p.num}</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <button onClick={() => setActive(!active)} style={{
        width:'100%', height:s.tap+8, borderRadius:16,
        background: active ? t.urgentSoft : t.accent,
        color: active ? t.urgent : t.surface,
        border:'none', fontFamily:'inherit', fontSize:s.h2, fontWeight:600,
        letterSpacing:-0.3, cursor:'pointer',
      }}>{active ? 'I\'m okay — stop timer' : L.startBuddy}</button>

      {!active && (
        <div style={{
          marginTop:14, fontSize:s.small+1, color:t.mute, textAlign:'center',
          lineHeight:1.5, padding:'0 20px',
        }}>
          If the timer runs out, your buddy gets a text with your neighborhood (not exact location) and a way to call 911.
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// SAVED
// ────────────────────────────────────────────────────────────
function SavedScreen({ t, s, L, saved, onOpen, toggleSave, locations }) {
  const list = (locations || LOCATIONS).filter(l => saved.includes(l.id));
  return (
    <div style={{
      position:'absolute', inset:0, background:t.bg, color:t.ink,
      overflowY:'auto', padding:'70px 0 110px',
    }}>
      <div style={{padding:'0 20px 18px'}}>
        <div style={{
          fontFamily:'ui-monospace, monospace', fontSize:s.small,
          color:t.mute, letterSpacing:1.5, marginBottom:10,
        }}>YOUR SPOTS</div>
        <div style={{
          fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
          fontSize:s.h1+2, letterSpacing:-0.5,
        }}>Saved</div>
      </div>

      {list.length === 0 ? (
        <div style={{padding:'40px 24px', textAlign:'center'}}>
          <div style={{
            width:64, height:64, borderRadius:32, background:t.accentSoft,
            color:t.accent, display:'grid', placeItems:'center',
            margin:'0 auto 14px',
          }}><Icon.star width="28" height="28"/></div>
          <div style={{fontSize:s.body, color:t.mute, lineHeight:1.5}}>
            Tap the star on any location to keep it here for later.
          </div>
        </div>
      ) : (
        <div style={{padding:'0 16px'}}>
          {list.map((l, i) => (
            <div key={l.id} style={{
              background:t.surface, borderRadius:16, marginBottom:10,
              border:`1px solid ${t.border}`, padding:'14px 16px',
              display:'flex', gap:12, alignItems:'center',
            }}>
              <div style={{flex:1}} onClick={() => onOpen(l)}>
                <div style={{fontSize:s.h3, fontWeight:600, marginBottom:2}}>{l.name}</div>
                <div style={{fontSize:s.small+1, color:t.mute, display:'flex', gap:8}}>
                  <span>{l.neighborhood}</span>
                  <span>·</span>
                  <span>{l.walk} min walk</span>
                </div>
              </div>
              <button onClick={() => toggleSave(l.id)} style={{
                width:36, height:36, borderRadius:18, background:t.faint,
                color:t.accent, border:'none', display:'grid', placeItems:'center',
                cursor:'pointer',
              }}><Icon.starFill width="16" height="16"/></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// NOW (EMERGENCY) — the red tab
// ────────────────────────────────────────────────────────────
function NowScreen({ t, s, L, onGoTo }) {
  const [breath, setBreath] = React.useState('in');
  React.useEffect(() => {
    const iv = setInterval(() => {
      setBreath(b => b === 'in' ? 'hold' : b === 'hold' ? 'out' : 'in');
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const urgent = t.urgent;
  const urgentBg = t.urgentSoft;

  return (
    <div style={{
      position:'absolute', inset:0,
      background:`linear-gradient(180deg, ${urgentBg} 0%, ${t.bg} 60%)`,
      overflowY:'auto', padding:'70px 20px 110px', color:t.ink,
    }}>
      <div style={{
        fontFamily:'ui-monospace, monospace', fontSize:s.small,
        color:urgent, letterSpacing:2, marginBottom:10, fontWeight:600,
      }}>IF SOMETHING'S WRONG</div>

      <div style={{
        fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
        fontSize:s.h1+4, lineHeight:1.05, letterSpacing:-0.6, marginBottom:20,
      }}>Breathe.<br/>You're not alone.</div>

      {/* 911 */}
      <button onClick={() => window.location.href='tel:911'} style={{
        width:'100%', padding:'22px 20px', marginBottom:10,
        borderRadius:20, background:urgent, color:'#fff',
        border:'none', textAlign:'left', cursor:'pointer',
        display:'flex', alignItems:'center', gap:16,
      }}>
        <div style={{
          width:52, height:52, borderRadius:26,
          background:'rgba(255,255,255,0.18)',
          display:'grid', placeItems:'center', flexShrink:0,
        }}><Icon.phone width="24" height="24"/></div>
        <div style={{flex:1}}>
          <div style={{fontSize:s.h2, fontWeight:700, letterSpacing:-0.3}}>Call 911</div>
          <div style={{fontSize:s.small+1, opacity:0.85, marginTop:2}}>
            Good Samaritan Law protects you
          </div>
        </div>
        <Icon.chevron width="18" height="18"/>
      </button>

      {/* Never Use Alone hotline */}
      <button onClick={() => window.location.href='tel:18004843731'} style={{
        width:'100%', padding:'20px', marginBottom:10, borderRadius:20,
        background:t.surface, color:t.ink, border:`2px solid ${t.open}`,
        textAlign:'left', cursor:'pointer',
        display:'flex', alignItems:'center', gap:16,
      }}>
        <div style={{
          width:48, height:48, borderRadius:24, background:t.openSoft,
          color:t.open, display:'grid', placeItems:'center', flexShrink:0,
        }}><Icon.phone width="22" height="22"/></div>
        <div style={{flex:1}}>
          <div style={{fontSize:s.h3, fontWeight:700, color:t.open}}>Never Use Alone</div>
          <div style={{fontSize:s.small+1, color:t.mute, marginTop:2}}>
            1-800-484-3731 · Free, 24/7, judgment-free
          </div>
        </div>
        <Icon.chevron width="18" height="18" style={{color:t.mute}}/>
      </button>

      {/* Get naloxone now */}
      <button onClick={onGoTo?.bind(null,'map')} style={{
        width:'100%', padding:'20px', marginBottom:10, borderRadius:20,
        background:t.surface, color:t.ink, border:`1px solid ${t.border}`,
        textAlign:'left', cursor:'pointer',
        display:'flex', alignItems:'center', gap:16,
      }}>
        <div style={{
          width:48, height:48, borderRadius:24, background:t.accentSoft,
          color:t.accent, display:'grid', placeItems:'center', flexShrink:0,
        }}><Icon.spray width="22" height="22"/></div>
        <div style={{flex:1}}>
          <div style={{fontSize:s.h3, fontWeight:600}}>{L.getNarcan}</div>
          <div style={{fontSize:s.small+1, color:t.mute, marginTop:2}}>
            Find the closest open site near you
          </div>
        </div>
        <Icon.chevron width="18" height="18" style={{color:t.mute}}/>
      </button>

      {/* How to use */}
      <button onClick={onGoTo?.bind(null,'learn')} style={{
        width:'100%', padding:'20px', marginBottom:16, borderRadius:20,
        background:t.surface, color:t.ink, border:`1px solid ${t.border}`,
        textAlign:'left', cursor:'pointer',
        display:'flex', alignItems:'center', gap:16,
      }}>
        <div style={{
          width:48, height:48, borderRadius:24, background:t.accentSoft,
          color:t.accent, display:'grid', placeItems:'center', flexShrink:0,
        }}><Icon.book width="22" height="22"/></div>
        <div style={{flex:1}}>
          <div style={{fontSize:s.h3, fontWeight:600}}>{L.howToUse}</div>
          <div style={{fontSize:s.small+1, color:t.mute, marginTop:2}}>
            Six steps, two minutes
          </div>
        </div>
        <Icon.chevron width="18" height="18" style={{color:t.mute}}/>
      </button>

      {/* Breathing exercise */}
      <div style={{
        background:t.surface, borderRadius:24, padding:'24px 20px',
        border:`1px solid ${t.border}`, textAlign:'center',
      }}>
        <div style={{
          fontFamily:'ui-monospace, monospace', fontSize:s.small,
          color:t.mute, letterSpacing:2, marginBottom:14,
        }}>WHILE YOU WAIT</div>
        <div style={{
          width:140, height:140, margin:'0 auto 14px', position:'relative',
        }}>
          <div style={{
            position:'absolute', inset:0, borderRadius:70,
            background:t.accent, opacity:0.15,
            transform: breath === 'in' ? 'scale(1)' : breath === 'out' ? 'scale(0.55)' : 'scale(1)',
            transition:'transform 4s ease-in-out',
          }}/>
          <div style={{
            position:'absolute', inset:20, borderRadius:60, background:t.accent,
            transform: breath === 'in' ? 'scale(1)' : breath === 'out' ? 'scale(0.55)' : 'scale(1)',
            transition:'transform 4s ease-in-out',
          }}/>
          <div style={{
            position:'absolute', inset:0, display:'grid', placeItems:'center',
            fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
            fontSize:22, color:'#fff', textShadow:'0 1px 2px rgba(0,0,0,0.2)',
          }}>{breath === 'in' ? 'Breathe in' : breath === 'hold' ? 'Hold' : 'Breathe out'}</div>
        </div>
        <div style={{fontSize:s.small+1, color:t.mute, lineHeight:1.5}}>
          Four seconds in. Four hold. Four out.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  DetailScreen, LearnScreen, BuddyScreen, SavedScreen, NowScreen,
});
