# Kuya King’s Beef Tapa — Header / Navigation Prompt

## REDESIGN SECTION: HEADER / NAVIGATION BAR

Create a clean, premium, lightweight navigation bar that matches the Kuya King’s Beef Tapa branding and directly reflects the actual homepage content.


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


---

## NAVIGATION CONTENT

Use this exact navigation structure:

- Home
- Our Story
- Perfect Pair
- Best Sellers
- Our Process
- Order Now

### Mapping
- **Home** → Hero Section
- **Our Story** → Homemade Goodness / Product Introduction
- **Perfect Pair** → Perfect Pair for Tapa
- **Best Sellers** → Product Menu
- **Our Process** → Made with Care / Packaging Process
- **Order Now** → Main ordering or checkout destination

Do not include unrelated menu items such as About Us, Reviews, Contact, or Why Choose Us unless those sections are actually added later.

---

## DESKTOP LAYOUT

Use this structure:

`[ KUYA KING’S LOGO ]   Home | Our Story | Perfect Pair | Best Sellers | Our Process   [ ORDER NOW ]`

Requirements:
- Logo aligned left
- Navigation centered or visually balanced
- Order Now CTA aligned right
- Keep the header compact and elegant
- Use subtle spacing and thin separators only if needed
- Avoid oversized buttons or thick shadows

### Active State
Use a subtle active state:
- Red text accent
- Thin underline
- Small line indicator

Do not use large filled pills for active links.

---

## STICKY BEHAVIOR

Make the header sticky while scrolling.

When the user leaves the hero:
- Add a clean solid or slightly translucent background
- Add a subtle bottom border or very soft shadow
- Keep the height compact
- Maintain readability and contrast

---

## MOBILE / TABLET NAVIGATION

For smaller screens:
- Keep the logo visible
- Use a hamburger menu
- Keep Order Now accessible
- Menu items should stack vertically
- Clicking a link should smoothly scroll to the target section
- Automatically close the mobile menu after selection

Menu order:

Home  
Our Story  
Perfect Pair  
Best Sellers  
Our Process  
Order Now

---

## SUGGESTED CLASS NAMES

- `kk-header`
- `kk-header-inner`
- `kk-header-logo`
- `kk-header-nav`
- `kk-header-link`
- `kk-header-cta`
- `kk-header-toggle`
- `kk-header-mobile-menu`


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
