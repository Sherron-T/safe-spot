# Chat

_Started 2026-04-20 23:43 UTC_

---

## User

can you design a mobile map app that connects to NYC medical resources and help maps out syringe exchanges and naloxone programs

## Assistant

I'll design a mobile map app for NYC harm reduction resources — syringe exchanges and naloxone programs. Let me ask a few quick questions so we land on the right direction, then build.

_[tool: questions_v2]_

## User

Questions answered:
- audience: People who use drugs (self-serve, low barrier)
- tone: Warm, human, destigmatizing
- core_features: Map with filters (SEP, naloxone, fentanyl test strips, wound care), Walking/transit directions, Hours + 'open now' indicator, How to use naloxone (step-by-step), Language toggle (EN/ES/ZH), Save favorites, Overdose alert / buddy mode
- variations: Decide for me
- map_style: Decide for me
- entry_screen: Decide for me
- emergency_cta: Dedicated red emergency tab
- privacy: Medium — a badge on first open
- data_depth: Decide for me
- tweaks: Light/dark mode, Color theme (clinical/warm/activist), Map style (realistic/abstract/schematic), Language, Big-text mode, Density (compact/comfortable)

## Assistant

I've got a clear direction. Let me plan and build.

**Design system I'll use** (declaring up front since no external system was provided):
- **Tone**: warm, human, destigmatizing — not clinical, not activist-loud. Zero stigma language.
- **Type**: "Instrument Serif" for emotional headers + "Inter" for UI (paired with a mono for data labels).
- **Color**: warm off-white base (oklch 0.97 0.01 70), deep warm ink for text, a single terracotta accent, a calm green for "open now", and a confident but non-alarming red reserved only for the emergency tab.
- **Map**: stylized NYC — real-ish streets but softened, with neighborhood fills. Realistic/abstract/schematic exposed as Tweak.
- **Shape language**: generous radii (16–24px), soft shadows, 44px min hit targets, big readable type.
- **Frame**: iOS frame (this is a self-serve tool; most likely phone).

**Screens I'll prototype (interactive, real state):**
1. First-open privacy badge
2. Map (home) with filters, cards, "open now"
3. Location detail — services, hours, languages, directions
4. How-to: Use naloxone (step-by-step)
5. Buddy mode / overdose alert
6. Saved / Favorites
7. Emergency tab (naloxone now, 911, breathing timer)

**Tweaks**: theme mode, color theme, map style, language (EN/ES/ZH), big-text, density.

Building now.

_[tool: update_todos]_

_[tool: copy_starter_component]_

Now I'll build the app. I'll split across several JSX files for manageability.

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

Now the screens:

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

**Safe Spot** — NYC harm reduction map prototype, live.

**What's there**
- **Map home** — warm, destigmatizing tone; realistic NYC borough shapes; pulsing pins for open locations; filter chips for SEP / Naloxone / Test strips / Wound care; "you are here" indicator; bottom sheet of nearby locations with open-now dots.
- **Tap a pin** → peek card with services, walk/transit times, directions, save.
- **Detail screen** — full hours, services, languages, accessibility badges, a human note from the site ("Walk in, no ID needed. Snacks and water always.").
- **Learn** — six-step naloxone guide, one step at a time, with good-to-know facts.
- **Buddy mode** — countdown dial (5/10/15/30/60 min), buddy selector incl. Never Use Alone hotline, "I'm okay — stop timer" language.
- **Now** (the red emergency tab) — 911 CTA with Good Samaritan reassurance, shortcut to naloxone map + how-to, and a 4-4-4 breathing circle.
- **Privacy badge** on first open: "No account. No tracking." with mono-chip callouts.

**Tweaks** (toggle on to explore):
- Light / Dark
- Theme: Warm (terracotta) · Clinical (blue) · Activist (amber on dark)
- Map style: Realistic · Abstract · Schematic (subway-map style)
- Language: EN / ES / 中文
- Big text · Compact/Comfortable density

**Caveats & possible next steps**
- All locations are fictional placeholders on a stylized NYC. Real data would come from NYC DOHMH's SEP list + the state naloxone directory.
- Storefront/step illustrations are hatched placeholders — real photography or custom illustration would replace them.
- Directions and phone call are visual only; wire to native intents in a real build.
- Could add: delivery request for mail-order naloxone, fentanyl test strip how-to, offline tile caching, Never Use Alone one-tap call.

