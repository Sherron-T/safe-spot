// detail.jsx — full location detail, learn, buddy, saved, emergency

// ────────────────────────────────────────────────────────────
// LOCATION DETAIL (full-screen sheet)
// ────────────────────────────────────────────────────────────
function DetailScreen({ t, s, L, loc, onBack, saved, toggleSave, onDirections }) {
  if (!loc) return null;
  return (
    <div style={{
      position:'absolute', inset:0, background:t.bg, color:t.ink,
      overflowY:'auto', display:'flex', flexDirection:'column',
    }}>
      {/* header band */}
      <div style={{
        position:'relative', height:128, flexShrink:0,
        background:`linear-gradient(180deg, ${t.accentSoft} 0%, ${t.bg} 100%)`,
      }}>
        {/* watermark icon for the site's primary service */}
        <div style={{
          position:'absolute', right:24, bottom:-2, color:t.accent, opacity:0.16,
        }}>
          {(() => {
            const meta = SERVICE_META[loc.services[0]];
            return meta ? Icon[meta.icon]({ width: 96, height: 96 }) : null;
          })()}
        </div>

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

        {/* youth banner */}
        {loc.services.includes('Youth') && (
          <div style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'12px 14px', borderRadius:14, marginBottom:14,
            background:t.openSoft, color:t.ink, fontSize:s.small+2,
          }}>
            <span style={{color:t.open, display:'inline-flex', flexShrink:0}}>
              <Icon.heart width="18" height="18"/>
            </span>
            <span><strong>Made for young people.</strong> No ID, insurance, or parental consent needed.</span>
          </div>
        )}

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
          <button onClick={() => onDirections && onDirections(loc)} style={{
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
// STEP ILLUSTRATIONS — inline SVG for each naloxone step
// ────────────────────────────────────────────────────────────
function StepIllustration({ index, t }) {
  const c = t.ink, a = t.accent, su = t.surface, ab = t.accentSoft;

  const svgs = [
    // 1 — Check for signs: unresponsive face + alert
    <svg key={0} viewBox="0 0 280 120" fill="none" width="100%" height="100%">
      <circle cx="104" cy="60" r="38" fill={ab} stroke={c} strokeWidth="2.5"/>
      <path d="M86 54 q7 6 14 0" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M108 54 q7 6 14 0" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <line x1="96" y1="76" x2="112" y2="76" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M196 32 L224 80 H168 Z" fill={su} stroke={a} strokeWidth="2.5" strokeLinejoin="round"/>
      <line x1="196" y1="48" x2="196" y2="62" stroke={a} strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="196" cy="71" r="2.5" fill={a}/>
    </svg>,

    // 2 — Call 911: phone + ring waves
    <svg key={1} viewBox="0 0 280 120" fill="none" width="100%" height="100%">
      <rect x="112" y="10" width="56" height="100" rx="14" fill={su} stroke={c} strokeWidth="2.5"/>
      <rect x="121" y="24" width="38" height="58" rx="5" fill={ab}/>
      <text x="140" y="59" textAnchor="middle" fontSize="16" fontWeight="800" fill={a} fontFamily="ui-monospace, monospace">911</text>
      <line x1="132" y1="98" x2="148" y2="98" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M184 44 Q198 60 184 76" stroke={a} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M196 35 Q216 60 196 85" stroke={a} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.45"/>
    </svg>,

    // 3 — Give naloxone: spray device aimed at nostril, head tilted back
    <svg key={2} viewBox="0 0 280 120" fill="none" width="100%" height="100%">
      <circle cx="174" cy="44" r="30" fill={ab} stroke={c} strokeWidth="2.5"/>
      <circle cx="168" cy="56" r="2.2" fill={c}/>
      <circle cx="180" cy="56" r="2.2" fill={c}/>
      <path d="M160 36 q6 -5 12 0" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <g transform="rotate(-24 116 90)">
        <rect x="108" y="84" width="16" height="24" rx="6" fill={su} stroke={a} strokeWidth="2.5"/>
        <rect x="112" y="68" width="8" height="16" rx="4" fill={ab} stroke={a} strokeWidth="2"/>
      </g>
      <path d="M130 66 Q148 56 162 52" stroke={a} strokeWidth="2.5" strokeDasharray="2 6" strokeLinecap="round" fill="none"/>
    </svg>,

    // 4 — Rescue breaths: breath flowing into open mouth
    <svg key={3} viewBox="0 0 280 120" fill="none" width="100%" height="100%">
      <circle cx="184" cy="60" r="32" fill={ab} stroke={c} strokeWidth="2.5"/>
      <path d="M176 48 q6 -5 12 0" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="156" cy="66" r="5" fill={su} stroke={c} strokeWidth="2.5"/>
      <path d="M62 66 H136" stroke={a} strokeWidth="3" strokeLinecap="round"/>
      <path d="M128 56 L144 66 L128 76" stroke={a} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="86" cy="56" r="5" fill={a} opacity="0.25"/>
      <circle cx="108" cy="76" r="7" fill={a} opacity="0.15"/>
    </svg>,

    // 5 — Wait & watch: clock with a 2–3 minute wedge
    <svg key={4} viewBox="0 0 280 120" fill="none" width="100%" height="100%">
      <circle cx="108" cy="60" r="44" fill={su} stroke={c} strokeWidth="2.5"/>
      <path d="M108 60 L108 22 A38 38 0 0 1 141 41 Z" fill={ab}/>
      <line x1="108" y1="60" x2="108" y2="28" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      <line x1="108" y1="60" x2="134" y2="46" stroke={a} strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="108" cy="60" r="3.5" fill={c}/>
      <line x1="108" y1="20" x2="108" y2="26" stroke={c} strokeWidth="2" opacity="0.4"/>
      <line x1="148" y1="60" x2="142" y2="60" stroke={c} strokeWidth="2" opacity="0.4"/>
      <line x1="108" y1="100" x2="108" y2="94" stroke={c} strokeWidth="2" opacity="0.4"/>
      <line x1="68" y1="60" x2="74" y2="60" stroke={c} strokeWidth="2" opacity="0.4"/>
      <text x="206" y="56" textAnchor="middle" fontSize="20" fontWeight="800" fill={a} fontFamily="ui-monospace, monospace">2–3</text>
      <text x="206" y="74" textAnchor="middle" fontSize="11" fontWeight="600" fill={c} opacity="0.6" fontFamily="ui-monospace, monospace">MINUTES</text>
    </svg>,

    // 6 — Recovery position: figure on side, top knee bent
    <svg key={5} viewBox="0 0 280 120" fill="none" width="100%" height="100%">
      <line x1="28" y1="100" x2="252" y2="100" stroke={c} strokeWidth="2" opacity="0.2" strokeLinecap="round"/>
      <circle cx="72" cy="76" r="18" fill={ab} stroke={c} strokeWidth="2.5"/>
      <path d="M66 76 q5 4 10 0" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M90 84 L168 88" stroke={c} strokeWidth="5" strokeLinecap="round"/>
      <path d="M168 88 L232 95" stroke={c} strokeWidth="5" strokeLinecap="round"/>
      <path d="M160 86 L194 60 L234 70" stroke={a} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M94 86 Q80 96 62 96" stroke={c} strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>,
  ];

  return svgs[index] || null;
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

function LearnScreenLegacy({ t, s, L }) {
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
        }}>NALOXONE BASICS</div>
        <div style={{
          fontFamily:'"Instrument Serif", ui-serif, Georgia, serif',
          fontSize:s.h1+4, lineHeight:1.0, letterSpacing:-0.8,
        }}>How to reverse<br/>an overdose.</div>
        <div style={{fontSize:s.body, color:t.mute, marginTop:10, lineHeight:1.5}}>
          Six steps with naloxone, about two minutes.
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

          {/* step illustration */}
          <div style={{
            marginTop:20, height:140, borderRadius:16,
            background:t.faint, overflow:'hidden',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <StepIllustration index={step} t={t}/>
          </div>
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

        {/* For young people */}
        <div style={{marginTop:28}}>
          <SectionLabel t={t} s={s}>For young people (16–24)</SectionLabel>
          <div style={{
            background:t.openSoft, borderRadius:16, padding:'16px',
            border:`1px solid ${t.open}22`, marginBottom:10,
          }}>
            <div style={{fontSize:s.body, fontWeight:700, color:t.open, marginBottom:8}}>
              You don't need a parent's permission.
            </div>
            {[
              'Naloxone is available to you at any age — no ID, no prescription, no questions.',
              'In New York, you can consent to your own substance use care without a parent.',
              'Youth drop-in centers offer meals, showers, lockers, and someone to talk to — free.',
              'Use the "Youth 16–24" filter on the map to find sites made for you.',
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
          <div style={{
            background:t.surface, borderRadius:16, border:`1px solid ${t.border}`,
            padding:'4px 16px',
          }}>
            {[
              { name: 'Crisis Text Line', detail: 'Text HOME to 741741 · Free, 24/7', href: 'sms:741741?body=HOME' },
              { name: 'The Trevor Project (LGBTQ+)', detail: '1-866-488-7386 · Free, 24/7', href: 'tel:18664887386' },
              { name: '988 Mental Health Line', detail: 'Call or text 988 · Free, 24/7', href: 'tel:988' },
              { name: 'National Runaway Safeline', detail: '1-800-786-2929 · Free, 24/7', href: 'tel:18007862929' },
            ].map((h, i, arr) => (
              <button key={i} onClick={() => window.location.href = h.href} style={{
                width:'100%', display:'flex', alignItems:'center', gap:12,
                padding:'13px 0', background:'transparent', border:'none',
                borderBottom: i < arr.length-1 ? `1px solid ${t.faint}` : 'none',
                textAlign:'left', cursor:'pointer', color:t.ink, fontFamily:'inherit',
              }}>
                <div style={{
                  width:34, height:34, borderRadius:17, background:t.accentSoft,
                  color:t.accent, display:'grid', placeItems:'center', flexShrink:0,
                }}><Icon.phone width="16" height="16"/></div>
                <div style={{flex:1}}>
                  <div style={{fontSize:s.body, fontWeight:600}}>{h.name}</div>
                  <div style={{fontSize:s.small+1, color:t.mute, marginTop:1}}>{h.detail}</div>
                </div>
                <Icon.chevron width="16" height="16" style={{color:t.mute}}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LearnScreen({ t, s, L }) {
  const [step, setStep] = React.useState(0);
  const current = NARCAN_STEPS[step];
  const facts = [
    ['It cannot hurt to give naloxone', 'If you are not sure, give it anyway. Naloxone will not harm someone who is not overdosing.'],
    ["New York's 911 protects you", 'Tell the dispatcher it may be an overdose. The Good Samaritan Law protects the caller and the person who needs help.'],
    ['Carry two doses when you can', 'Some overdoses need a second dose. Keep both doses somewhere easy to reach.'],
    ['Stay with them', 'Put the person on their side and stay until help arrives.'],
  ];
  const testSteps = [
    ['Mix a small residue', 'Add water to the bag or surface the drug was on.'],
    ['Dip the strip', 'Put the wavy end in the water for 15 seconds.'],
    ['Wait 2 to 5 minutes', 'Lay the strip flat and do not touch the result window.'],
    ['Read the result', 'One line means fentanyl was detected. Two lines means it was not detected. Never assume use is fully safe.'],
  ];
  const buttonStyle = (primary = false) => ({
    flex: primary ? 1.35 : 1, height:s.tap, borderRadius:15,
    background: primary ? t.accent : t.surface, color: primary ? t.surface : t.ink,
    border: primary ? 'none' : `1px solid ${t.border}`,
    fontFamily:'inherit', fontSize:s.h3, fontWeight:700, cursor:'pointer',
    boxShadow: primary ? `0 8px 18px ${t.accent}33` : 'none',
  });
  const checklist = (items, color = t.open) => items.map((line, i) => (
    <div key={i} style={{display:'flex', gap:8, alignItems:'flex-start', fontSize:s.small+1, color:t.ink, lineHeight:1.5, marginBottom:i < items.length - 1 ? 8 : 0}}>
      <Icon.check width="13" height="13" style={{color, flexShrink:0, marginTop:2}}/>{line}
    </div>
  ));
  return (
    <div style={{position:'absolute', inset:0, background:t.bg, overflowY:'auto', color:t.ink, padding:'70px 0 110px'}}>
      <div style={{padding:'0 20px 20px'}}>
        <div style={{fontFamily:'ui-monospace, monospace', fontSize:s.small, color:t.accent, letterSpacing:1.8, marginBottom:10, fontWeight:700}}>LEARN AT YOUR PACE</div>
        <div style={{fontFamily:'"Instrument Serif", ui-serif, Georgia, serif', fontSize:s.h1+4, lineHeight:1.0, letterSpacing:-0.8}}>Know what to do<br/>when it matters.</div>
        <div style={{fontSize:s.body, color:t.mute, marginTop:10, lineHeight:1.5}}>A calm, plain-language guide to naloxone, test strips, and staying safer.</div>
      </div>

      <div style={{display:'flex', gap:5, padding:'0 20px 18px'}}>
        {NARCAN_STEPS.map((st, i) => <button aria-label={`Step ${i + 1}: ${st.title}`} key={i} onClick={() => setStep(i)} style={{flex:1, height:6, borderRadius:5, padding:0, background:i <= step ? t.accent : t.faint, border:'none', cursor:'pointer'}}/>)}
      </div>

      <div style={{padding:'0 20px'}}>
        <div style={{background:t.accent, borderRadius:25, padding:'22px 20px 18px', color:t.surface, boxShadow:`0 15px 28px ${t.accent}30`}}>
          <div style={{fontSize:s.small, letterSpacing:1.7, marginBottom:12, fontWeight:700, opacity:.75}}>STEP {current.n} OF 06</div>
          <div style={{fontFamily:'"Instrument Serif", ui-serif, Georgia, serif', fontSize:s.h1, lineHeight:1.05, letterSpacing:-0.4, marginBottom:12}}>{current.title}</div>
          <div style={{fontSize:s.body+1, lineHeight:1.5, opacity:.9}}>{current.body}</div>
          <div style={{marginTop:18, height:118, borderRadius:17, background:'rgba(255,255,255,.12)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}><StepIllustration index={step} t={t}/></div>
        </div>
        <div style={{display:'flex', gap:8, marginTop:12}}>
          <button onClick={() => setStep(Math.max(0, step - 1))} style={{...buttonStyle(), opacity:step === 0 ? .45 : 1}} disabled={step === 0}>Back</button>
          <button onClick={() => setStep((step + 1) % NARCAN_STEPS.length)} style={buttonStyle(true)}>{step === NARCAN_STEPS.length - 1 ? 'Review again' : 'Next step'}</button>
        </div>

        <div style={{marginTop:28}}>
          <SectionLabel t={t} s={s}>Good to know</SectionLabel>
          <div style={{display:'grid', gap:9}}>{facts.map(([q, a], i) => <div key={i} style={{background:t.surface, borderRadius:17, border:`1px solid ${t.border}`, padding:'14px 15px'}}><div style={{fontSize:s.body, fontWeight:600, marginBottom:4}}>{q}</div><div style={{fontSize:s.small+1, color:t.mute, lineHeight:1.4}}>{a}</div></div>)}</div>
        </div>

        <div style={{marginTop:28}}>
          <SectionLabel t={t} s={s}>Your rights in NYC</SectionLabel>
          <div style={{background:t.openSoft, borderRadius:20, padding:'17px', border:`1px solid ${t.open}22`}}>
            <div style={{fontSize:s.body, fontWeight:700, color:t.open, marginBottom:8}}>Calling for help is the right move.</div>
            {checklist(['The Good Samaritan Law protects people who call 911 for an overdose.', 'Tell the dispatcher it may be an overdose so the right help arrives.', 'Stay with the person and follow the dispatcher’s instructions.'])}
          </div>
        </div>

        <div style={{marginTop:28}}>
          <SectionLabel t={t} s={s}>How to use test strips</SectionLabel>
          <div style={{background:t.surface, borderRadius:20, border:`1px solid ${t.border}`, padding:'6px 16px'}}>
            {testSteps.map(([title, desc], i) => <div key={i} style={{padding:'12px 0', borderBottom:i < testSteps.length - 1 ? `1px solid ${t.faint}` : 'none'}}><div style={{display:'flex', gap:10, alignItems:'flex-start'}}><div style={{width:22, height:22, borderRadius:11, background:t.accentSoft, color:t.accent, display:'grid', placeItems:'center', flexShrink:0, fontFamily:'ui-monospace, monospace', fontSize:s.small, fontWeight:700}}>{i + 1}</div><div><div style={{fontSize:s.body, fontWeight:600, marginBottom:2}}>{title}</div><div style={{fontSize:s.small+1, color:t.mute, lineHeight:1.4}}>{desc}</div></div></div></div>)}
          </div>
          <div style={{marginTop:10, padding:'10px 14px', borderRadius:10, background:t.urgentSoft, fontSize:s.small+1, color:t.ink, lineHeight:1.5}}><strong>A negative result is not a guarantee.</strong> Fentanyl can be unevenly distributed. Never use alone.</div>
        </div>

        <div style={{marginTop:28, marginBottom:8}}>
          <SectionLabel t={t} s={s}>For young people (16–24)</SectionLabel>
          <div style={{background:t.openSoft, borderRadius:20, padding:'17px', border:`1px solid ${t.open}22`, marginBottom:10}}>
            <div style={{fontSize:s.body, fontWeight:700, color:t.open, marginBottom:8}}>You can ask for help on your own.</div>
            {checklist(['Naloxone is available at any age. No ID or prescription is needed.', 'In New York, you can consent to your own substance use care without a parent.', 'Youth drop-in centers offer meals, showers, lockers, and someone to talk to, free.', 'Use the Youth 16–24 filter on the map to find sites made for you.'])}
          </div>
          <div style={{background:t.surface, borderRadius:20, border:`1px solid ${t.border}`, padding:'4px 16px'}}>
            {[{name:'Crisis Text Line', detail:'Text HOME to 741741 · Free, 24/7', href:'sms:741741?body=HOME'}, {name:'The Trevor Project', detail:'1-866-488-7386 · Free, 24/7', href:'tel:18664887386'}, {name:'988 Mental Health Line', detail:'Call or text 988 · Free, 24/7', href:'tel:988'}, {name:'National Runaway Safeline', detail:'1-800-786-2929 · Free, 24/7', href:'tel:18007862929'}].map((h, i, arr) => <button key={i} onClick={() => window.location.href = h.href} style={{width:'100%', display:'flex', alignItems:'center', gap:12, padding:'13px 0', background:'transparent', border:'none', borderBottom:i < arr.length - 1 ? `1px solid ${t.faint}` : 'none', textAlign:'left', cursor:'pointer', color:t.ink, fontFamily:'inherit'}}><div style={{width:34, height:34, borderRadius:17, background:t.accentSoft, color:t.accent, display:'grid', placeItems:'center', flexShrink:0}}><Icon.phone width="16" height="16"/></div><div style={{flex:1}}><div style={{fontSize:s.body, fontWeight:600}}>{h.name}</div><div style={{fontSize:s.small+1, color:t.mute, marginTop:1}}>{h.detail}</div></div><Icon.chevron width="16" height="16" style={{color:t.mute}}/></button>)}
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
              { name: 'Never Use Alone hotline', num: '1-800-484-3731', active: true },
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
      }}>{active ? 'I\'m okay: stop timer' : L.startBuddy}</button>

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
      }}>Get help<br/>right now.</div>

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

      {/* Crisis Text Line — text-first option */}
      <button onClick={() => window.location.href='sms:741741?body=HOME'} style={{
        width:'100%', padding:'20px', marginBottom:10, borderRadius:20,
        background:t.surface, color:t.ink, border:`1px solid ${t.border}`,
        textAlign:'left', cursor:'pointer',
        display:'flex', alignItems:'center', gap:16,
      }}>
        <div style={{
          width:48, height:48, borderRadius:24, background:t.accentSoft,
          color:t.accent, display:'grid', placeItems:'center', flexShrink:0,
        }}>
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
            <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-5 4V6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            <circle cx="9" cy="10.5" r="1" fill="currentColor"/>
            <circle cx="12" cy="10.5" r="1" fill="currentColor"/>
            <circle cx="15" cy="10.5" r="1" fill="currentColor"/>
          </svg>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:s.h3, fontWeight:600}}>Rather text than talk?</div>
          <div style={{fontSize:s.small+1, color:t.mute, marginTop:2}}>
            Text HOME to 741741 · Crisis Text Line, free, 24/7
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
