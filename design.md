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
| coral-pink `#e97b77` | — | Hero 4th square, `::selection`, nav underline |
| trail orange `#ff7a1a` | — | Cursor trail + hot cursor state only |

### Shadow tokens

`--stamp: #671912` (maroon stamp on light), `--stamp-amber: #8a5d13`,
`--stamp-ink: #10201d`. Never a `rgba()` blur.

**Contrast:** body type is `#10201d` on `#f2f2eb` / `#f7f7f2`; inverted type is
`#f7f7f2` on `#211f47` / `#20253f`. Both clear 4.5:1. Eyebrow red `#e53927` is
used at mono-bold sizes only, never as small body text.

---

## 4. Typography

Loaded in `index.html`: **Manrope** 400–800 and **IBM Plex Mono** 400–700 from
Google Fonts, with `preconnect`.

| Role | Family | Notes |
| --- | --- | --- |
| Display / headings / body | Manrope (`--font-heading`, `--font-sans`) | `.font-display` for the heavy display cut |
| Eyebrows, labels, times, buttons, tags | IBM Plex Mono (`--font-mono`) | `text-transform: uppercase`, tracking `0.08em`–`0.26em` |

Scale anchors:

- Hero title: `clamp(3.35rem, 7.4vw, 7.1rem)`, line-height `.92`,
  tracking `-0.045em`, `.hero-title-line` masked reveal per line.
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
- **Section header:** `.section-head` — eyebrow, title, deck on the left, meta
  on the right at `md+`; `margin-bottom: clamp(2.5rem, 4vw, 4rem)`.
  Implemented by `src/components/SectionHead.jsx`.
- **Header:** `.site-header`, sticky, `h-20` (80px) + 2px border = **82px**
  of chrome. Mobile menu is an inline panel, not an overlay.
- **Hero:** `.hero-shell` is `min-height: max(620px, calc(100svh - 82px))` so it
  fills the first viewport exactly below the header (mobile variant lowers the
  floor). Content is centered; the two pixel staircases are decorative
  (`aria-hidden`) and parallax away from the pointer.
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
| `Hero.jsx` | Eyebrow, masked title, manifesto, deck, `.hero-facts` pills, CTA pair, sponsor lockup |
| `SectionHead.jsx` | Eyebrow + title + accent + deck, staggered reveal |
| `SplitWords.jsx` | Per-word mask reveal for section titles |
| `Highlights.jsx` | 4 stat cards (HIGHLIGHTS) |
| `Tracks.jsx` | 3 tracks: SVG glyph, stepper, prizes, `.track-foot` meta line |
| `Rewards.jsx` | Dark reward tiers + `BadgeArt.jsx` seal |
| `BadgeArt.jsx` | Procedural SVG octagonal badge/seal |
| `Schedule.jsx` | Timeline, **no filters**, per-event color via `TYPE_COLORS` → `--event` / `--event-ink` CSS vars |
| `FAQ.jsx` | Single-open accordion, per-item ids, `aria-expanded` / `aria-controls` / `aria-labelledby`, red rule as answer divider |
| `Venue.jsx` | Details card + OpenStreetMap iframe in a clipped frame + OSM credit |
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
| Cursor | `Cursor.jsx` | rAF-smoothed arrow (τ ≈ 80ms) + hexagon fairy-dust canvas |

**Cursor details.** Arrow is a four-point chunky pointer (`viewBox 0 0 28 30`,
28×30px box) whose tip sits at the SVG origin — which is also where the 1.8px
cream keyline stops — so `transform-origin: 0 0` and the JS transform is just
`translate3d(x, y, 0) scale()`: smoothing and hover scaling can never pull the
tip off the pointer.

The trail is a **fairy-dust** recipe drawn as hexagons: spawn at the pointer,
give each particle a small random kick (±0.45–1.5 px/frame, upward-biased),
pull it down with `GRAVITY 0.022`, shrink and fade it (`FADE 0.965` per frame,
`LIFE0 100`, removed below 6% scale). Spawn distance is randomised
(`GAP_MIN 3` → `GAP_MAX 12`), so density varies with pointer speed. Look:
`HEX_R 8` (±30% per particle), `PARTICLE_COUNT 2` per event, `ALPHA 0.85`,
1px ink stroke, colours `#ff7a1a` / `#f5b726` / `#e97b77`, capped at
`MAX_PARTICLES 360`. Click throws an 8-hex burst.

Over an iframe the arrow hides, the document gains `.cursor-native` (restores
the OS cursor), and the first real `pointermove` afterwards snaps it back.
Disabled entirely for coarse pointers and `prefers-reduced-motion`.

**Reduced motion:** everything above collapses to static — `.reveal` becomes
visible immediately, transforms are neutralized, the cursor and trail do not
mount.

---

## 9. Routes

Hand-rolled router in `src/App.jsx` (no router library): pathname → component,
intercepted anchor clicks, `popstate`, `TITLES` for `document.title`.

| Path | Page | Title |
| --- | --- | --- |
| `/` | `HomePage` | Hacktoberfest Hack Day Bengaluru 2026 |
| `/about` | `AboutPage` | About — Hack Day Bengaluru |
| `/build` | `BuildPage` | Tracks & Prizes — Hack Day Bengaluru |
| `/day` | `DayPage` | Schedule — Hack Day Bengaluru |
| `/venue` | `VenuePage` | Venue & Map — Hack Day Bengaluru |
| `/faq`, `/community` | `FaqPage` | FAQ — Hack Day Bengaluru |

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
- Eyebrows are 2–3 words, uppercase, mono: `ABOUT THE DAY`, `TRACKS & PRIZES`.
- No keyword-stuffed titles — page titles are "what it is, then event name".

---

## 11. Accessibility

- Landmarks: `header` / `main` / `footer`, one `h1` per route, sections with ids.
- FAQ: real `<button>` triggers, `aria-expanded`, `aria-controls`,
  `aria-labelledby` on the panel; index chips are decorative.
- Focus is always visible; `.ht-btn-*` and nav links have focus states matching
  hover.
- `aria-hidden="true"` on every decorative SVG, the hero staircases, the red
  answer rule, and both cursor layers.
- Images carry real `alt` (`Major League Hacking`, `DEV`, `DigitalOcean`).
- The map iframe has a descriptive `title` and a visible OSM credit link.
- Contrast ≥ 4.5:1 for text; measured body measure 65–75ch.
- `prefers-reduced-motion` respected at every entry point (see §8).

---

## 12. Architecture

```
index.html            fonts, meta, <body> classes
src/main.jsx          React root
src/App.jsx           router, titles, View Transitions, scroll progress, cursor
src/index.css         Tailwind v4 import + all design tokens & components
src/pages/*           route shells (compose sections)
src/components/*      sections and primitives
src/data/eventData.js all content
src/hooks/useReveal.js
src/utils/confetti.js
scripts/screenshot.mjs  Playwright review shots (SHOTS_DIR, preview on :4173)
```

- **Stack:** Vite 6, React 19, Tailwind v4 (`@tailwindcss/vite`), `lucide-react`,
  `canvas-confetti`, `clsx`/`tailwind-merge`. No router, no component library,
  no animation library.
- **Styling:** Tailwind for layout/utility, hand-written CSS in `src/index.css`
  for the design system. Tokens first; literals only inside a token definition.
- **Commands:** `npm run dev` · `npm run build` · `npm run preview` (serves
  `dist` on `:4173`; run `build` before any visual check).

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

---

## 14. Open items

- Footer-blank report could not be reproduced (gap = 0 on all 6 routes across
  four viewports); the `overflow-x: clip` guard on `<body>` is preventive.
- The schedule still carries the factual `05:15 PM – 06:45 PM` "Final Hacking &
  PR Submission Deadline" row — the only remaining 6:45 reference on the site.
