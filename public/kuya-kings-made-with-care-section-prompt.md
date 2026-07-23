# Kuya King’s Beef Tapa — Made with Care / Packaging Process Section

## REDESIGN SECTION: MADE WITH CARE / PACKAGING PROCESS

Redesign the **“Made with Care. Sealed for Freshness.”** section for Kuya King’s Beef Tapa.

Use the existing Kuya King’s branding:
- Warm red / deep red accents
- Cream / off-white background
- Black or dark charcoal typography
- Elegant serif headings
- Clean sans-serif body text
- Premium homemade Filipino food aesthetic

The section should feel like a **premium food magazine/editorial layout**, not a generic process-card section.

---

# SECTION STRUCTURE

Create the section using:

### Desktop:
A **2-column layout**

- **1st Column:** Large preparation / packaging image
- **2nd Column:** Editorial-style content + horizontal 4-step process timeline

The image and text columns should feel visually balanced.

Suggested ratio:

- Image: approximately 45–50%
- Content: approximately 50–55%

---

# LEFT COLUMN — PROCESS IMAGE

Use one large, high-quality lifestyle/process photo showing the actual preparation or packaging of Kuya King’s Beef Tapa.

Possible image content:

- Preparing Beef Tapa
- Marinating the beef
- Filling or sealing jars/packaging
- Packing finished products
- Hands actively preparing the product

The image should feel:

- Authentic
- Handmade
- Premium
- Clean
- Warm
- Documentary/editorial

Avoid overly staged stock-photo styling.

Use:
- Large image
- Minimal border radius
- Clean cropping
- No unnecessary overlays
- No heavy shadow

The photo should occupy most of the left column height.

---

# RIGHT COLUMN — MAGAZINE-STYLE CONTENT

Place the main section content on the right.

### Eyebrow

**FROM OUR KITCHEN TO YOUR TABLE**

Use small uppercase lettering with subtle letter spacing and the Kuya King’s red accent color.

### Main Heading

# Made with Care.  
# Sealed for Freshness.

Use a large elegant serif font.

The heading should feel editorial and premium.

### Description

Every pack of Kuya King’s goes through a carefully handled process—from preparation to packaging—to preserve the homemade flavor, quality, and freshness you love.

Keep the paragraph width controlled for easier reading.

Do not make the text span the entire column width.

---

# PROCESS TIMELINE

Under the introduction, create a **horizontal 4-step process timeline**.

The layout should look approximately like:

`01 ───────── 02 ───────── 03 ───────── 04`

Each number should be connected by a thin horizontal line.

Use Kuya King’s red as the accent for:
- Step numbers
- Small timeline indicators
- Active visual details

Keep the connecting line subtle and neutral.

---

## STEP 01

### Prepared

We start with carefully selected quality beef, prepared with attention to tenderness, consistency, and flavor.

---

## STEP 02

### Marinated

Each batch is marinated using Kuya King’s signature homemade recipe to develop its rich and savory flavor.

---

## STEP 03

### Packed

Every product is carefully packed to help preserve its quality, flavor, and freshness.

---

## STEP 04

### Ready

Sealed, prepared, and ready to enjoy whenever your next Kuya King’s craving hits.

---

# TIMELINE VISUAL STRUCTURE

Follow this layout:

`01 ---------------- 02 ---------------- 03 ---------------- 04`

`Prepared             Marinated            Packed               Ready`

`Short description    Short description    Short description    Short description`

Do not place each step inside a large card.

The steps should feel integrated into the editorial layout.

Use:
- Clean typography
- Thin divider lines
- Generous spacing
- Minimal icons, or no icons at all

The numbered timeline should be the primary visual element.

---

# MAGAZINE / EDITORIAL STYLE

The entire section should feel similar to a premium food magazine feature.

Use:
- Large photography
- Strong headline hierarchy
- Small uppercase eyebrow text
- Short editorial paragraphs
- Generous negative space
- Fine divider lines
- Small red details
- Clean asymmetric composition

Avoid:
- Generic 4-card grid
- Large rounded cards
- Heavy box shadows
- Excessive icons
- Gradient backgrounds
- Overly colorful elements
- SaaS-style UI components

The image and content should feel like **one cohesive editorial composition**.

---

# DESKTOP LAYOUT EXAMPLE

```text
|                                      | FROM OUR KITCHEN TO YOUR TABLE       |
|                                      |                                      |
|     LARGE PREPARATION /              | Made with Care.                      |
|     PACKAGING PHOTO                  | Sealed for Freshness.                |
|                                      |                                      |
|                                      | Short introduction paragraph.        |
|                                      |                                      |
|                                      | 01 -------- 02 -------- 03 ---- 04  |
|                                      |                                      |
|                                      | Prepared   Marinated   Packed  Ready |
|                                      | Short      Short        Short  Short |
|                                      | copy       copy         copy   copy  |
```

Keep both columns aligned vertically.

---

# TABLET RESPONSIVE DESIGN

For screens from **421px to 1024px**:

The section may remain 2 columns on larger tablets if space allows.

For narrower tablets:
- Image should appear first
- Content underneath
- Keep timeline horizontal when readable
- Otherwise convert the timeline into a clean 2x2 layout

Maintain the editorial appearance.

---

# MOBILE RESPONSIVE DESIGN

For screens **420px and below**:

Stack the content vertically:

1. Eyebrow
2. Heading
3. Description
4. Large preparation image
5. Process timeline

Convert the 4-step horizontal timeline into a **vertical process timeline**:

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

Use a thin vertical line connecting the numbers.

Do not squeeze all four process steps horizontally on small screens.

---

# DEVELOPMENT REQUIREMENTS

- Use a unique section-specific wrapper classname.
- Example: `kk-process-section`

Use scoped class naming such as:
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

Do not use generic class names such as:
- `.container`
- `.title`
- `.image`
- `.card`
- `.button`

Avoid universal CSS selectors that may conflict with other sections.

Do not redesign or modify other homepage sections.

Only create/redesign the **Made with Care / Packaging Process section**.

The final result should feel:

**Premium + Homemade + Editorial + Authentic + Minimalist**
