# Hungry Tiger — style reference

Turmeric-bright graffiti on a tandoor wall. A single gold-on-rust palette with display type so
large it reads as a spice market sign, not a webpage.

**Theme:** dark

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists
are independent, not paired by position. HTML examples are reconstructions, not source components.

Hungry Tiger is a fire-roasted condiment brand rendered as a maximalist typographic poster: a deep
rust-brown canvas, a single searing Tiger Gold accent, and an absurdly oversized custom display
face that swallows the viewport. The system behaves like a spice label — confident, warm, slightly
aggressive — with pill-shaped controls, dotted horizontal rules, and dense botanical watermarks
that suggest Indian heat without literal illustration. Text is the hero; product photography is
small and isolated against the dark. Every surface shares the same warm brown family, and contrast
is driven by the gold against charred browns, not by adding new hues.

## Tokens — Colors

| Name            | Value     | Token                     | Role                                                                                                                                                    |
| --------------- | --------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tiger Gold      | `#faae33` | `--color-tiger-gold`      | Primary action, filled buttons, active nav, heading strokes, key icon accents — the only chromatic color permitted to leave the warm-brown monochrome          |
| Ember Rust      | `#823513` | `--color-ember-rust`      | Dominant page canvas and hero backdrop — the color that defines every viewport                                                                          |
| Saffron Glow    | `#9f531b` | `--color-saffron-glow`    | Secondary heading accent, decorative borders, mid-tone text                                                                                               |
| Dark Spice      | `#402011` | `--color-dark-spice`      | Card surfaces, input fields, badge fills, button ghost backgrounds                                                                                       |
| Charred Clove   | `#281006` | `--color-charred-clove`   | Deepest surface — innermost cards, modal scrim, background behind the deepest contrast pairs                                                              |
| Cardamom Brown  | `#6b2e12` | `--color-cardamom-brown`  | Input borders, subtle dividers, muted inline elements                                                                                                    |
| Chili Red        | `#d1255c` | `--color-chili-red`       | Saturated accent reserved for badge fills and alert-level highlights — appears sparingly to signal heat                                                  |

## Tokens — Typography

### Salmond — universal typeface

Display headlines at 130–213px weight 700 with line-height clamped to 0.80–0.90 create the
poster-scale hero, while the same family drops to 11–18px for nav, badges, and body. Negative
tracking (-0.02em to -0.005em) tightens headlines; positive tracking (0.01–0.02em) opens small
caps-style labels. This single-font-everywhere choice is the brand's strongest signature.

- **Substitute:** Druk Wide, Antonio, **Bebas Neue** (selected — see Deviations)
- **Weights:** 400, 500, 700

### Graphikx — functional micro-copy

Restricted to 13px weight 500 for body micro-copy, button labels, and inline meta where Salmond
would feel too loud. Acts as a quiet functional voice against Salmond's shout.

- **Substitute:** Inter, Geist, Untitled Sans

### Type scale

| Role        | Size (source) | Line height | Letter spacing |
| ----------- | ------------- | ----------- | --------------- |
| caption     | 11px          | 1.2         | 0.02em          |
| subheading  | 18px          | 1.2         | 0.01em          |
| heading-sm  | 29px          | 1.1         | -0.005em        |
| heading     | 65px          | 0.95        | -0.01em         |
| heading-lg  | 101px         | 0.9         | -0.016em        |
| display     | 195px         | 0.8         | -0.02em         |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing scale

4, 6, 8, 9, 10, 12, 14, 16, 17, 20, 24, 26, 28, 32, 42, 192 px

### Border radius

| Element | Value  |
| ------- | ------ |
| cards   | 6px    |
| badges  | 9999px |
| inputs  | 9999px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80–120px
- **Card padding:** 12–16px
- **Element gap:** 10px

## Components

### Ghost outline button

Default interactive control (SAUCE, ABOUT, RECIPES, GAME, CONTACT, BUY NOW). 13px weight 500,
0.01em tracking, text `#faae33`, 1px border in `#faae33`, fully rounded, padding 8px 17px,
transparent fill so the Ember Rust canvas reads through.

### Filled primary button

Hero call to action. 13px weight 500, `#281006` text on `#faae33` fill, 1px `#faae33` border,
padding 10px 20px. The only filled button in the system.

### Pill badge

Tag, label, category marker. 11–12px weight 500 uppercase, 0.02em tracking, pill radius,
padding 4–8px vertical, 12–16px horizontal. Primary: `#faae33` fill with `#281006` text.
Secondary: `#402011` fill with `#faae33` text.

### Alert badge

Heat-level indicator. Pill radius, `#d1255c` fill, 11px weight 500, padding 4px 12px. Reserved
for the rare spicy/heat callouts.

### Pill input field

Fully rounded input, 1px `#6b2e12` border on transparent fill, 13px weight 500 placeholder,
12–16px vertical padding, 16–20px horizontal padding. No visible focus ring — interaction states
use a border-color shift to `#faae33`.

### Surface card

Product, recipe, or content tile. 6px radius, fill `#402011`, padding 12–16px, **no shadow** —
depth comes from the 2-step color shift against the Ember Rust canvas, not from elevation.

### Product showcase

Raw product art on a transparent canvas: no card frame, no background plate. Sits directly on the
canvas with a subtle warm rim highlight suggesting backlight.

### Botanical watermark layer

Faded fern/leaf/flower forms behind content sections. Near-invisible at rest — they only become
readable when the eye settles.

### Dotted divider

1px dotted `#faae33` rule spanning full width between major viewport sections. Replaces
whitespace-only separation.

### Iconography

Thin-stroke 1.5px line icons in `#faae33`, 16–20px, circular containers at full radius. Always
gold, never filled, never multi-colour.

## Do's and Don'ts

### Do

- Use display type at 130–213px weight 700 with line-height 0.80–0.90 for all hero and section
  headlines — never downsized into body territory
- Set buttons, badges, inputs, and icon containers to full pill radius; sharp corners break the
  spice-label personality
- Use only `#faae33` as the chromatic accent; never introduce bright colours except the reserved
  `#d1255c` for heat badges
- Step surface depth through three browns: `#823513` (page) → `#402011` (card) → `#281006`
  (deepest) — never use box-shadow to imply elevation
- Apply dotted `#faae33` rules as section dividers instead of relying on whitespace alone
- Tighten letter-spacing inversely to size
- Crown every viewport with massive type first, then position product art as a small anchored
  element below — the page is a poster, not a storefront

### Don't

- Do not introduce a secondary display typeface
- Do not use box-shadow, drop-shadow, or glow effects on any component
- Do not place product art in large rectangular frames, cards, or with rounded edges
- Do not use the 6px radius for anything other than cards
- Do not dilute the palette with white, blue, green, or cool neutrals
- Do not let body copy exceed 18px or sit at more than 1.4 line-height
- Do not use solid colour blocks for section backgrounds — every section is Ember Rust

## Surfaces

| Level | Name          | Value     | Purpose                                              |
| ----- | ------------- | --------- | ---------------------------------------------------- |
| 0     | Tandoor Canvas| `#823513` | Full-viewport page background, hero, all primary     |
| 1     | Spice Card    | `#402011` | Card surfaces, ghost button fills, inputs, badges    |
| 2     | Charred Core  | `#281006` | Deepest recessed surface, inner modals               |

## Elevation

**No elevated components.** The system intentionally avoids box-shadows.

## Imagery

Product art is tightly cropped, studio-lit jars centered against the Ember Rust canvas — no
lifestyle context, no hands, no kitchen. The jar IS the hero. Background atmosphere comes from
low-opacity botanical watermarks. Imagery density is intentionally low — the page is 90% type, 10%
product.

## Layout

Full-bleed dark page; content laid out in asymmetric two-column compositions where a massive
display headline occupies one side and a small product image anchors the other. The hero is a
full-viewport poster: eyebrow text, then 200px+ display type, then a centered product below.
Subsequent sections alternate between left-anchored headline + right-side product and the mirror.
Dotted gold dividers separate every major band. Navigation is a minimal top bar with ghost pill
buttons and a centered brand mark. Floating circular icon buttons dock in the bottom-right corner.
Vertical rhythm is spacious — 80–120px between sections.

---

## Deviations in the blocks gallery implementation

This reference describes the brand as it would exist as its own site. The `HungryTigerLanding`
block renders it inside a gallery whose convention caps stage height at `min(74vh, 640px)`, so
three deliberate departures apply. Recorded as
[ADR-0001](../../../docs/adr/0001-display-type-scaled-for-stage-convention.md).

1. **Display type is scaled down; small type is not.** Display sizes drop by roughly 0.62
   (195 → 120, 101 → 62, 65 → 40, 29 → 22) to stay poster-scale against a 640px stage. Small UI
   sizes stay at their source values of 11–18px, because scaling them uniformly would render
   button labels at ~8px and violate the spec's own 11–18px legibility floor.

2. **Typeface substitution.** Salmond is licensed and unavailable, so Bebas Neue stands in — the
   specified condensed all-caps substitute that holds at 120px without overflowing the stage.
   Inter stands in for Graphikx at 13px. Both load self-contained inside the block.

3. **Product art is inline vector, not photography.** Blocks must stay self-contained and
   copy-pasteable, and no jar photography exists to reference. The jar is hand-drawn SVG that
   honours the framing rule: raw on the canvas, no card, no plate, warm rim highlight only.