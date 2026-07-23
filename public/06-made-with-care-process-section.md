# Kuya King’s Beef Tapa — Made with Care / Packaging Process Prompt

## REDESIGN SECTION: MADE WITH CARE / PACKAGING PROCESS

Redesign the **“Made with Care. Sealed for Freshness.”** section for Kuya King’s Beef Tapa.


## BRANDING DIRECTION

Use the attached/reference Kuya King’s Beef Tapa design as the main visual direction.

Maintain:
- Warm red / deep red as the primary brand color
- Cream / off-white backgrounds
- Black or dark charcoal typography
- Elegant serif headings paired with clean sans-serif body text
- Premium homemade Filipino food aesthetic
- Strong product and food photography
- Minimal but intentional use of red accents
- Generous white space
- Clean editorial composition

The overall visual direction should feel:

**Homemade + Premium + Authentic + Modern + Appetizing**

Avoid:
- Generic template styling
- SaaS-looking cards
- Excessive gradients
- Heavy shadows
- Oversized rounded corners everywhere
- Too many icons
- Overcrowded layouts


The section should feel like a **premium food magazine/editorial layout**, not a generic process-card section.

---

## SECTION STRUCTURE

Create a **2-column layout**.

- **1st Column:** Large preparation / packaging image
- **2nd Column:** Editorial-style content + horizontal 4-step process timeline

Suggested ratio:
- Image: 45–50%
- Content: 50–55%

---

## LEFT COLUMN — PROCESS IMAGE

Use one large high-quality lifestyle/process image showing:
- Preparing Beef Tapa
- Marinating
- Filling or sealing packaging
- Packing finished products
- Hands actively preparing the product

The image should feel:
- Authentic
- Handmade
- Premium
- Clean
- Warm
- Documentary/editorial

Avoid obvious stock-photo styling.

---

## RIGHT COLUMN — CONTENT

### Eyebrow
**FROM OUR KITCHEN TO YOUR TABLE**

### Main Heading
# Made with Care.  
# Sealed for Freshness.

### Description
Every pack of Kuya King’s goes through a carefully handled process—from preparation to packaging—to preserve the homemade flavor, quality, and freshness you love.

---

## PROCESS TIMELINE

Create a horizontal 4-step timeline:

`01 ───────── 02 ───────── 03 ───────── 04`

### 01 — Prepared
We start with carefully selected quality beef, prepared with attention to tenderness, consistency, and flavor.

### 02 — Marinated
Each batch is marinated using Kuya King’s signature homemade recipe to develop its rich and savory flavor.

### 03 — Packed
Every product is carefully packed to help preserve its quality, flavor, and freshness.

### 04 — Ready
Sealed, prepared, and ready to enjoy whenever your next Kuya King’s craving hits.

Do not place each step inside a large card.

Use thin connecting lines, red step numbers, compact titles, and short descriptions.

---

## DESKTOP STRUCTURE

```text
| LARGE PREPARATION /       | FROM OUR KITCHEN TO YOUR TABLE |
| PACKAGING PHOTO           | Made with Care.                |
|                           | Sealed for Freshness.           |
|                           | Short description               |
|                           |                                 |
|                           | 01 ─── 02 ─── 03 ─── 04         |
|                           | Prep  Marinate Pack  Ready      |
```

---

## MOBILE

Stack:
1. Eyebrow
2. Heading
3. Description
4. Large process image
5. Vertical process timeline

Vertical timeline:

```text
01
│
Prepared
Description

02
│
Marinated
Description

03
│
Packed
Description

04
│
Ready
Description
```

---

## SUGGESTED CLASS NAMES

- `kk-process-section`
- `kk-process-layout`
- `kk-process-media`
- `kk-process-content`
- `kk-process-eyebrow`
- `kk-process-heading`
- `kk-process-intro`
- `kk-process-timeline`
- `kk-process-step`
- `kk-process-step-number`
- `kk-process-step-title`
- `kk-process-step-description`


## DEVELOPMENT REQUIREMENTS

- Use unique, section-specific class names.
- Do not use generic class names such as `.container`, `.title`, `.card`, `.button`, `.image`, or `.section`.
- Avoid universal CSS selectors that may conflict with other parts of the website.
- Keep HTML, CSS, and JavaScript scoped and modular.
- Do not use emojis as icons.
- Use SVG icons only when icons are necessary.
- Keep transitions subtle and purposeful.
- Optimize all images for web performance.
- Use semantic HTML and accessible contrast.
- Make all interactive elements keyboard-friendly.
- Do not redesign other sections unless explicitly requested.

### Responsive Breakpoints
- Desktop: **1025px and above**
- Tablet: **421px to 1024px**
- Mobile: **420px and below**
