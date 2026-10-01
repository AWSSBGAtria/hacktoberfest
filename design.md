# Design — Hacktoberfest Hack Day Bengaluru 2026

Design reference for this site: what it is, the rules it follows, and where each
decision lives in the code. Change the system here first, then the code.

---

## 1. The product

One-page-per-topic marketing site for **Hacktoberfest Hack Day Bengaluru**, an
in-person hack day run by the AWS Student Builder Group at Atria Institute of
Technology.

| Fact | Value |
| --- | --- |
| Date | Friday, October 23, 2026 |
| Time | 8:30 AM – 8:00 PM IST |
| Venue | Atria Institute of Technology, Hebbal, Bengaluru |
| Organizer | AWS Student Builder Group at Atria Institute of Technology |
| Host | Darshan B |
| Registration | MLH event page |
| Extra channel | WhatsApp group |

Single source of truth for all copy and facts: `src/data/eventData.js`
(`EVENT_DETAILS`, `HIGHLIGHTS`, `TRACKS`, `REWARDS`, `SCHEDULE`, `FAQS`,
`PARTNERS`). Components render data; they do not hardcode event facts.

---

## 2. Stance

Five rules the whole system is built on.

1. **Stamp, don't float.** Depth is a hard, zero-blur offset shadow behind a
   2px ink border — a printed sticker, never a soft material elevation.
2. **Square everything.** `border-radius: 0` across the site. The only curves
   are deliberate: pill tags, the hexagon trail, the badge seal.
3. **Mono is the voice.** IBM Plex Mono uppercase with wide tracking carries
   eyebrows, metadata, labels, times, and buttons. Prose is Manrope.
4. **One job per accent.** Indigo/periwinkle = the primary action. Coral = the
   live/brand marker (nav underline, selection, FAQ rule). Yellow/orange =
   energy and reward. Nothing else borrows them.
5. **Motion explains, never decorates.** Every animation uses the shared
   easing curve and one of three duration tiers. If it can't be justified as
   feedback or hierarchy, it's removed.

---

## 3. Color

Tokens live in `:root` in `src/index.css`. Use the token, not a hex literal.

### Surfaces

| Token | Hex | Role |
| --- | --- | --- |
| `--color-cream` | `#f2f2eb` | Default page surface |
| `--color-paper` | `#f7f7f2` | Raised surface — cards, plates, panels |
| `--color-paper-alt` | `#e4e5da` | Recessed surface — card footers, rails |
| `--color-forest` | `#20253f` | Deep hero base |
| `--color-sage` | `#343b69` | Secondary dark field |
| `--color-maroon` | `#25204b` | Dark tint |
| `--chrome-base` | `#211f47` | Dark section field (About, Rewards, header/footer chrome) |
| `--chrome-deep` | `#1a1839` | Chrome gradient start, mobile menu |

### Ink & line

| Token | Hex | Role |
| --- | --- | --- |
| `--color-ink` / `--stamp-ink` | `#10201d` | All type on light, all borders, all shadows |
| `--color-cream` / `--color-paper` | `#f2f2eb` / `#f7f7f2` | Type on dark |

### Accents

| Token | Hex | Role |
| --- | --- | --- |
| `--color-indigo` | `#5146d9` | Primary action shadow (the one indigo job) |
| `--color-sky` | `#8bb2de` | Primary button fill, info tags, sponsor labels |
| `--color-red` | `#e53927` | Eyebrows, section accents, MLH-style emphasis |
| `--color-yellow` | `#f5b726` | Reward, deadline emphasis, underline highlight |
| `--color-coral` | `#ee8b83` | Dark-surface accent |
| `--color-indigo-soft` | `#e7e5ff` | Light indigo tint |
| coral-pink `#e97b77` | — | `::selection`, nav underline |
| trail orange `#ff7a1a` | — | Retired with the JS cursor; no live uses remain |

### Shadow tokens

`--stamp: #671912` (maroon stamp on light), `--stamp-amber: #8a5d13`,
`--stamp-ink: #10201d`. Never a `rgba()` blur.

**Contrast:** body type is `#10201d` on `#f2f2eb` / `#f7f7f2`; inverted type is
`#f7f7f2` on `#211f47` / `#20253f`. Both clear 4.5:1. Eyebrow red `#e53927` is
used at mono-bold sizes only, never as small body text.

---

## 4. Typography

Loaded in `index.html`: **Manrope** 400–800 and **IBM Plex Mono** 400–700 from
Google Fonts, with `preconnect`, plus **Bricolage Grotesque** variable
(`opsz 12–96, wght 200–800`) for the hero title only.

| Role | Family | Notes |
| --- | --- | --- |
| Hero title | Bricolage Grotesk 800, Manrope fallback (`.hero-title`) | Showcase voice; condensed grotesque carries the event name |
| Display / headings / body | Manrope (`--font-heading`, `--font-sans`) | `.font-display` for the heavy display cut |
| Eyebrows, labels, times, buttons, tags | IBM Plex Mono (`--font-mono`) | `text-transform: uppercase`, tracking `0.08em`–`0.26em` |

Scale anchors:

- Hero title: Bricolage 800, `clamp(3.35rem, 7.4vw, 7.1rem)`, line-height `.92`,
  tracking `-0.045em`, `.hero-title-line` masked reveal per line. Event colour
  squares ride on the eyebrow line; manifesto tracking `.1em`.
- Section title: `.section-title`, with `em` as the accent phrase.
- Deck / answer measure: capped near **65–75ch** (`.section-deck`,
  `.faq-answer`), never wider.
- Body: `1rem` / `line-height: 1.55`.
- Mono label: `0.6rem`–`0.72rem`.

`.section-eyebrow` is red mono uppercase; `.section-deck` is the muted lead.

---

## 5. Layout

- **Container:** `.shell` — `max-width: 1280px`, centered, `padding-inline`
  `1rem` → `2rem` from 640px → wider at large screens (`src/index.css:260`).
- **Section rhythm:** `py-20 sm:py-28` on every `.theme-section`, separated by a
  full-bleed `border-b-2 border-[#10201d]`. Dark sections opt in with
  `.theme-dark` (flips eyebrow/title/deck colors only).
- **Section header:** `.section-head` — eyebrow, title, deck on the left; a
  right column (`.section-head-side`) stacks the compact Pac-Man spot box over
  the deck at `md+`, and the row is vertically centred so the title spans
  their combined height. `margin-bottom: clamp(1.75rem, 3vw, 2.75rem)`.
  Implemented by `src/components/SectionHead.jsx` (`pacColor` prop).
- **Header:** `.site-header`, sticky, `h-20` (80px) + 2px border = **82px**
  of chrome. Mobile menu is an inline panel, not an overlay.
- **Hero:** `.hero-shell` is `min-height: max(620px, calc(100svh - 82px))`,
  content centred with block auto margins. Two full-height ambient Pac-Man
  side mazes (`.pac-side`, desktop only) run behind the copy; the two pixel
  staircases are decorative (`aria-hidden`) and parallax away from the
  pointer.
- **Footer:** dark chrome band, sitemap + MLH/code-of-conduct links + CTA.
- **Body:** `overflow-x: clip` (not `hidden` — `hidden` turns `<body>` into a
  scroll container and leaves a phantom screenful below the footer).

---

## 6. Shape & depth

```css
border: 2px solid #10201d;
border-radius: 0;
box-shadow: 5px 5px 0 #671912;   /* stamp */
/* hover: */
transform: translate(3px, 3px);
box-shadow: 2px 2px 0 #671912;
```

- Interactive `.theme-card` lifts by translating *into* its shadow, which
  shrinks by the same amount — the card sits down onto the page.
- `.brutal-static` is the same language without lift, for containers holding
  their own click targets (FAQ accordion).
- Global `body::after` lays a fixed dot-matrix texture at `opacity: 0.075`
  with `mix-blend-mode: multiply` — print grain, not a UI surface.

---

## 7. Components

All in `src/components/`; shared styles in `src/index.css`.

| Component | Notes |
| --- | --- |
| `Navbar.jsx` | Sticky header, mono nav, coral underline sweep, mobile panel, WhatsApp + MLH CTAs, `aria-current="page"` |
| `Footer.jsx` | Dark sitemap, external links, final CTA |
| `Hero.jsx` | Eyebrow (event colours inline), masked Bricolage title, manifesto, deck, `.hero-facts` pills, CTA pair, sponsor lockup, side mazes |
| `SectionHead.jsx` | Eyebrow + title + accent + deck + optional Pac-Man spot box, staggered reveal |
| `SplitWords.jsx` | Per-word mask reveal for section titles |
| `Highlights.jsx` | 4 stat cards (HIGHLIGHTS) |
| `Tracks.jsx` | 3 tracks: SVG medallion, stepper, recognition strip, neutral star seal, `.track-foot` meta line |
| `Rewards.jsx` | Dark reward tiers + `BadgeArt.jsx` seal; vague recognition copy only |
| `BadgeArt.jsx` | Procedural SVG octagonal badge/seal |
| `Schedule.jsx` | Timeline, **no filters**, per-event color via `TYPE_COLORS` → `--event` / `--event-ink` CSS vars |
| `FAQ.jsx` | Search + topic chips + single-open rows with accent-bar answers + support card; closed answers measure 0px |
| `Venue.jsx` | Details card + Leaflet map (`VenueMap.jsx`) + researched travel cards |
| `VenueMap.jsx` | Leaflet 1.9.4 (CDN) on OSM tiles, custom red divIcon pin, scroll-wheel zoom off |
| `PacStrip.jsx` | Ambient chase canvas (`mini` header spots, `side` hero panels), self-healing rAF guard |
| `PacPlay.jsx` | Modal single-run game: guide/playing/result/done, async submit, private scores |
| `About.jsx`, `Partners.jsx` | Story + partner wall |
| `Countdown.jsx` | Live countdown to `EVENT_DETAILS.eventTargetDate` |
| `Reveal.jsx`, `useReveal.js` | One-shot IntersectionObserver entrance (threshold `.18`, fires once) |
| `ScrollProgress.jsx` | 3px orange→yellow hairline pinned above the header |
| `Cursor.jsx` | Custom arrow + hexagon fairy-dust trail (see §8) |

Primitives (all CSS in `src/index.css`):

- `.ht-btn-primary` — periwinkle `#aebaff` fill, `0 8px 0 #5146d9` shadow,
  mono uppercase, magnetic `--mx/--my` offset on hover. The only primary CTA.
- `.ht-btn-secondary` — transparent, 2px ink border, same metrics.
- `.ht-tag` — pill, mono, `#292b65` default; schedule tags override the fill
  from `--event`.
- `.theme-card` — the standard bordered surface with stamp shadow.

---

## 8. Motion

Tokens: `--ease-brand: cubic-bezier(.16, 1, .3, 1)`,
`--dur-fast: 220ms`, `--dur-base: 420ms`, `--dur-slow: 680ms`.

| Effect | Where | Behavior |
| --- | --- | --- |
| Reveal | `.reveal` + `useReveal` | `opacity 0 → 1`, `translate 22px → 0`, `scale .97 → 1`, once per element |
| Split words | `SplitWords.jsx` | Per-word mask, left→right |
| Section head | `.section-head.is-visible` | Eyebrow at 40ms, deck at 380ms |
| Hero deck | `.hero-content > *` | Staggered `hero-deck-reveal`; sponsor lockup at 640ms |
| Route change | `App.jsx` | `document.startViewTransition()` cross-fade; header/footer pinned via `view-transition-name`. **This is the only route animation** — no CSS class animation on `.route-view` |
| Nav underline | `.site-header nav a::after` | `scaleX` sweep, `transform-origin: 100% 50%` |
| Button press | `.ht-btn-primary:active` | Shadow collapses, card translates |
| Confetti | `utils/confetti.js` | On register click only |
| Cursor | Site-wide CSS cursors | GTA-style white arrow, event-yellow over interactive elements, I-beam in text fields, native cursors in the map |

**Reduced motion:** everything above collapses to static — `.reveal` becomes
visible immediately, transforms are neutralized, ambient strips render one
static frame.

---

## 9. Routes

Hand-rolled router in `src/App.jsx` (no router library): pathname → component,
intercepted anchor clicks, `popstate`, `TITLES` for `document.title`.

| Path | Page | Title |
| --- | --- | --- |
| `/` | `HomePage` | Hacktoberfest Hack Day Bengaluru 2026 |
| `/about` | `AboutPage` | About — Hack Day Bengaluru |
| `/build` | `BuildPage` | Tracks — Hack Day Bengaluru |
| `/day` | `DayPage` | Schedule — Hack Day Bengaluru |
| `/venue` | `VenuePage` | Venue & Map — Hack Day Bengaluru |
| `/faq`, `/community` | `FaqPage` | FAQ — Hack Day Bengaluru |
| `/volunteer` | redirect | Volunteer — Hack Day Bengaluru → binary.so/EnumX2Q |
| `/mentor` | redirect | Mentor — Hack Day Bengaluru → binary.so/eGuTA0x |

Nav order: About · Build · Day plan · Venue · FAQ.

---

## 10. Voice & content

- Direct, warm, community-first. Second person. Short sentences.
- Facts always from `eventData.js` — dates, times, venue, links never
  duplicated into components.
- Dates read **October 23, 2026**; times are IST with the full range
  `8:30 AM – 8:00 PM IST`.
- Marketing copy does not restate operational deadlines as hype; the schedule
  is the single place timing lives.
- Eyebrows are 2–3 words, uppercase, mono: `ABOUT THE DAY`, `CHALLENGE TRACKS`.
- No keyword-stuffed titles — page titles are "what it is, then event name".

---

## 11. Accessibility

- Landmarks: `header` / `main` / `footer`, one `h1` per route, sections with ids.
- FAQ: search input with label, topic chips as `aria-pressed` buttons, real
  `<button>` question triggers, `aria-expanded` / `aria-controls` /
  `aria-labelledby` on each answer region; live count via `role="status"`.
- Focus is always visible; `.ht-btn-*` and nav links have focus states matching
  hover.
- `aria-hidden="true"` on every decorative SVG, the hero staircases, and the
  Pac-Man canvases.
- Images carry real `alt` (`Major League Hacking`, `DEV`, `DigitalOcean`).
- The venue map is a labelled Leaflet region with OSM attribution; the pin is
  decorative (`interactive: false`).
- Contrast ≥ 4.5:1 for text; measured body measure 65–75ch.
- `prefers-reduced-motion` respected at every entry point (see §8).

---

## 12. Architecture

```
index.html            fonts, meta, Leaflet CDN, <body> classes
src/main.jsx          React root
src/App.jsx           router, titles, redirects, View Transitions, scroll progress
src/index.css         Tailwind v4 import + all design tokens & components
src/pages/*           route shells (compose sections)
src/components/*      sections and primitives
src/data/eventData.js all content
src/hooks/useReveal.js
src/utils/confetti.js
src/utils/pacmaze.js  ambient maze engine
src/utils/awspac.js   playable AWS SBG maze engine
src/utils/scoredb.js  score store (local or /api)
server/index.js       event-day backend: dist + scores API on MySQL
scripts/screenshot.mjs  Playwright review shots (SHOTS_DIR, preview on :4173)
```

- **Stack:** Vite 6, React 19, Tailwind v4 (`@tailwindcss/vite`), `lucide-react`,
  `canvas-confetti`, `clsx`/`tailwind-merge`, Express + `mysql2` (server only),
  Leaflet 1.9.4 via CDN (venue map only), `playwright-core` dev tooling. No
  router, no component library, no animation library.
- **Styling:** Tailwind for layout/utility, hand-written CSS in `src/index.css`
  for the design system. Tokens first; literals only inside a token definition.
- **Commands:** `npm run dev` (proxies `/api` to `:3001`) · `npm run build` ·
  `npm run preview` (serves `dist` on `:4173`; run `build` before any visual
  check) · `npm run server` / `npm run serve` (event-day backend on `:3001`).

---

## 13. Do / Don't

**Do**

- Pull color from `:root` tokens; add a token rather than a new literal.
- Keep corners square and shadows hard.
- Reuse `.shell` + `.section-head` + `.theme-section` for every new section.
- Drive repeated content from `eventData.js`.
- Use `--dur-*` and `--ease-brand` for any new transition.
- Verify changes with `npm run build` → `preview` → `scripts/screenshot.mjs`.

**Don't**

- Don't add `border-radius`, blurred shadows, or gradient elevation.
- Don't introduce a second accent for the primary action (indigo owns it).
- Don't add a route animation alongside View Transitions.
- Don't hardcode event facts, dates, or URLs in components.
- Don't widen prose past ~75ch or drop below 4.5:1 contrast.
- Don't animate anything without a `prefers-reduced-motion` fallback.
- Don't commit `.env` or any credentials (see `.env.example`).
- Don't show other players' scores anywhere; duplicate entries are rejected
  by email OR name-plus-institution.

---

## 14. Open items

- Footer-blank report could not be reproduced (gap = 0 on all 6 routes across
  four viewports); the `overflow-x: clip` guard on `<body>` is preventive.

## 15. Pac-Challenge game + compact header spots

- Route headers: `main section h2` is `clamp(2rem, 3.8vw, 3.2rem)`; hero title untouched.
- Full-width mini ribbons removed from all five sub-route pages. The ambient
  chase now lives in a 230px `.pac-spot` box pinned to the right of each
  `SectionHead` (`pacColor` prop; About coral, Build light-indigo, Day red,
  Venue orange, FAQ sky). The home hero band stays.
- `PacPlay` (mounted once in `App`): bottom-right FAB ("Play me for a
  surprise!") opens a modal single-run challenge on a doodle-style `AWS SBG`
  map (`src/utils/awspac.js`: 57x13 hand-authored ASCII, 1-cell wall outlines
  for A W S S B G with ring openings, open travel bands top/bottom, ghost
  house in the word gap; BFS pass strips pellets from any sealed counter so
  every maze is clearable). 1 run, 3 lives, clock keeps ticking through
  deaths. Scoring: 10/pellet, 50/energizer, 200 then 400 per blue ghost;
  results store score + time, highest score wins with fastest time breaking
  ties. Guide screen states the goodies rule; entry form (name/email/
  institution) enforces one entry per email. Storage seam is
  `src/utils/scoredb.js`: localStorage-backed local DB today (`REMOTE_URL =
  null`); point it at the MySQL-backed scores endpoint when the URL arrives
  and implement the two remote functions - the component needs no changes.
  Results screen shows a top-5 local leaderboard (device-local until remote
  lands).

## 16. Hero side mazes, wrap fix, map marker, CSS cursor

- Hero carries two full-height ambient mazes (`.pac-side`, desktop only) with
  a `PacStrip` `side` variant (width-fit tiles, up to 61 rows, 3 ghosts,
  `salt` prop so left/right differ). Hidden < lg. The old full-width bottom
  band is gone; header spots use the `mini` variant.
- Wrap-desync bugfix (`pacmaze.js`): crossing the torus edge used to strand
  the float position a full map away from the logical tile, so the next leg
  rode back through every wall to a random death. Arrival now normalises
  `x = mod(tx, cols)`; headless sims across six sizes x four seeds report 0
  wall locks (was up to 273/180s).
- Route headers: `section-head` row is vertically centred so the title spans
  the deck + spot stack; `main section h2` now `clamp(2rem, 3.8vw, 3.2rem)`.
- Game copy: the board "closes when the Hack Day starts" (guide, results,
  done screens).
- Venue map: OSM `&marker=` param instead of the centred overlay pin, so the
  pin pans with the map. Tradeoff: the site tint filter recolours it from red
  to chrome-blue.
- Custom JS cursor deleted (`Cursor.jsx` + CSS + `App` mount). Pointer is now
  pure CSS: GTA-style white arrow with ink outline, event-yellow over
  interactive elements, I-beam in text fields, native cursors in iframes.

## 17. FAQ revamp, /build prize scrub, B glyph

- FAQ rebuilt as search + topic chips (Attending/Teams/First-timers/
  Registration/Rewards) with live counts, single-open rows (category eyebrow,
  chevron, accent-bar answers), an empty state, and a "Still stuck?" support
  card. Old `.accordion-panel` CSS removed. Closed answers measure true 0px.
- /build promises nothing specific anymore: track prize strips read
  "Recognition" + "announced on stage; prizes confirmed closer to the day",
  seals are neutral (01/02/03, KIT), the Rewards vault is "Track winners" /
  "Attendee Kit" with the same vague line, CTA is "Ready to build on Oct 23?",
  tab title is "Tracks". FAQ/schedule/home prize copy untouched (out of scope).
- Map B redrawn as a closed ring with mid/top/bottom bars (was open-sided and
  read as H); sealed interiors are pellet-free via the BFS pass, 0 unreachable.

## 18. MySQL scoreboard + async leaderboard fix

- `hacktober2026.scores` in local MySQL (root/Darshan1122): id, name,
  email UNIQUE, institution, score, time, created_at. `server/index.js`
  (Express + mysql2) serves dist + GET/POST /api/scores (409 on duplicate)
  and /api/health; `npm run server`, `./vite.config` proxies /api in dev. Production uses one variable: `DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/hacktober2026` (discrete DB_HOST/DB_USER/DB_PASSWORD/DB_NAME remain as local fallback).
  `scoredb.js` points at /api with a null fallback to the local store.
- Fixed a real bug the first MySQL test exposed: `loadEntries()` is async in
  remote mode but the component consumed it sync, so the shared leaderboard
  never rendered and reopening with a lock threw. All three call sites
  (open, result screen, post-submit) are promise-aware now; verified: fresh
  browser shows the shared row, no page errors.
- FAQ rewards entry removed (6 rows, 5 chips).

## 19. Off-site redirects

- `/volunteer` -> https://binary.so/EnumX2Q and `/mentor` ->
  https://binary.so/eGuTA0x, handled in the client router (`REDIRECTS` map +
  effect in `App.jsx`) so in-app links and pasted URLs both work; the Express
  SPA fallback serves index.html for direct hits. Verified end-to-end.

## 20. Venue travel section, map wash, strip self-heal

- Side strips: 90s browser soak was clean (no freezes/errors, flat heap), so
  the reported crash was most likely the pre-fix wrap desync. Added a
  self-healing rAF guard in `PacStrip`: a fault rebuilds the maze, persistent
  faults park the loop instead of spamming errors.
- Map: heavy re-hue filter replaced by near-natural tiles plus a light indigo
  wash overlay (pointer-transparent), so OSM's own red pin survives and pans
  with the map. "Open in OpenStreetMap" button and its CSS removed.
- Attendee checklist pro-tip removed. New "Coming from across the city"
  block: nearest metro (honest October-2026 answer - no open metro in Hebbal,
  Yeshwanthpur Green Line ~7 km), Majestic, KR Puram side, Yelahanka side,
  BEL Circle, each with a time chip.

## 21. Playable-game bugfix pass, private scores, red pin, ambient spawns

- Found by audit: `submitEntry` never awaited the async save, so the UI showed
  success even when the save failed or the email was a duplicate. Submit is
  now async with a saving state and a disabled button.
- No public leaderboard anymore: results/done screens show only the player's
  own score; the shared-board fetch and its CSS are gone.
- Duplicates: same email OR same name-plus-institution (case-insensitive),
  enforced server-side (409 email/person) with matching messages, mirrored in
  the offline store.
- Engine feel fixes: steering held through the death blink is kept (was
  wiped), eyes get a 10s failsafe home (greedy pathing could orbit loops),
  ghosts spawn facing open corridor, frightened ghosts got their arcade face.
  Verified: fright chain, death/reset, win, eyes, stuck-recovery, zero wall
  violations; autoplay bots play full games without errors.
- Ambient strips: ghost dens are now spread far apart across the board
  (was: pile-up on one fallback tile next to Pac on narrow mazes = instant
  death loop). Early-death rate 1/24 runs, zero wall locks.
- Venue map moved to a Google embed: OSM's own marker renders green, Google's
  is red and pans with the map.

## 22. Leaflet venue map, researched buses, unnumbered tracks

- Venue map is Leaflet 1.9.4 (CDN, pinned) on OSM raster tiles with a custom
  red divIcon pin (the site's own ink-stroked marker) - pans/zooms natively,
  no keys or consent walls. Google embed dropped (blank in the field),
  OSM-marker green avoided. Scroll-wheel zoom off so the page keeps scrolling.
- Travel cards carry researched BMTC numbers: metro 401-NY/287/279E/402,
  Majestic 287/279E/402, KR Puram 500QP, Yelahanka 402, BEL Circle 501-BH.
- Track cards dropped the 01/02/03 watermarks (SVG medallions only); track
  and reward seals are now a neutral star.

## 23. Production DB, ghost waves, hero rhythm

- Production MySQL is TiDB Cloud (`hacktober2026` created, `scores` schema
  synced, write roundtrip verified, probe rows removed). Connection string
  lives in gitignored `.env` as `DATABASE_URL`; `.env.example` documents the
  shape. The server only uses `.env` when `DATABASE_URL` is explicitly
  exported - local runs keep hitting local MySQL, so test entries can never
  leak into production. Verified end-to-end over TLS (health + insert + list).
- Playable ghosts run arcade scatter/chase waves with reversals, plus a
  confinement breaker (16-arrival window, 8-tile spread) that steps onto the
  least-visited neighbour including reverse. Measured: all pocket traps
  (S/G/A interiors, house, corners) escape in 8-16s; tighter triggers were
  tried and reverted (they fought exits). Fright/death/win/eyes regressions
  still pass.
- Hero rhythm (taste + impeccable typeset): the four colour squares now ride
  on the eyebrow line instead of stacking above it; manifesto tracking
  .12em to .1em with matching keyframes. Title metrics untouched (brand
  moment). Type-scope detector clean.

## 24. Bricolage display voice, schedule retime, score privacy UI

- Hero title uses Bricolage Grotesque 800 (hero-only voice; measured 11%
  narrower than Manrope at the same size); everything else stays Manrope.
- Schedule: Quiz 1 11:30–11:45 AM, Lunch 12:45–1:30 PM, Quiz 2 3:00–3:15 PM,
  evening slot is "Snacks, Refreshments & Networking".
- Done screen uses a dedicated light-panel `.pac-btn-secondary` (the shared
  secondary button is cream-on-transparent and vanished on paper).

## 25. Ticket badge rework, bento page, LinkedIn-ready share

- Badge is a 2:1 landscape ticket (1600x800) with perforation divider: photo
  plate, wrapped name and chip left; title, sponsor plates (MLH x DEV,
  DigitalOcean, same partners as the hero) and the white AWS SBG program mark
  (`public/aws-sbg-mark.png`) right. Footer line dropped after it collided
  with the mark in screenshots.
- Names wrap to two balanced lines (word-split minimizing max width, floor
  30px); input caps at 30 chars with a live counter.
- Badge page is a 2x2 bento (make-it-yours, preview, take-it-with-you,
  caption) instead of the lopsided two-column split.
- LinkedIn share: share-offsite URL (LinkedIn accepts only a URL - text
  cannot be prefilled) plus auto-copied caption and a static 1200x630 OG
  image (`public/og-share.png`) with full OG/Twitter meta so the composer
  unfurls richly. Caption carries #StudentsAtAWS.

## 26. Ticket rhythm, hero badge entry, venue strip

- Ticket spreads vertically: photo upper-left, wrapped name, chip; brandmark,
  title, subtitle, sponsors, then the venue pin row full-width along the
  bottom. Bottom-right club mark removed (it collided with the footer line).
- Hero CTA row carries a third button, "Get your badge" -> /badge.

## 27. Goodies worth callout

- The real-world goody haul is worth over ₹1.4 Lakh, so it gets one loud
  treatment instead of being buried in copy: a yellow neo-brutalist stamp
  (black border, hard shadow, mono uppercase) sits between the hero deck and
  the logistics facts - the only saturated block in a cream-on-navy hero, so
  the number reads before the date does.
- Single source of truth in `EVENT_DETAILS.goodiesWorth` / `goodiesNote`;
  the same figure reaches the Highlights card (value "₹1.4 Lakh+"), the
  About "Free Food, Swag & Kits" card, the Rewards deck on /build, the badge
  share caption, and OG/Twitter descriptions.
- Stamp is deliberately non-interactive (sells, does not ask for a click);
  the tees/stickers/swag-bags note hides under 520px so the line stays one
  row on phones.
