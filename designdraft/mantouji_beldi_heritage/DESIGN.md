# Design System: Heritage Excellence

## 1. Overview & Creative North Star
**The Creative North Star: "The Artisanal Curator"**

This design system is built to transcend the "digital template" aesthetic. It moves away from the cold, clinical nature of standard e-commerce and toward the tactile, storied experience of a high-end Moroccan boutique. We do not just sell products; we archive heritage.

To achieve this, the system rejects rigid, symmetrical grids in favor of **Intentional Editorial Asymmetry**. We utilize overlapping elements—such as a product image slightly breaking the bounds of its container—and high-contrast typography scales to create a sense of human touch. This is "Beldi" reimagined: raw authenticity polished through a lens of premium, modern elegance.

---

## 2. Colors & Surface Philosophy

The palette is rooted in the Moroccan landscape—forests, clays, and zellige tilework—reinterpreted through Material Design tokens for functional depth.

### Color Palette (Core Tokens)
- **Primary (`#00513f`):** Forest Green. Use for the highest brand authority.
- **Secondary (`#b02d21`):** Moroccan Red. Reserved for vital actions and heritage callouts.
- **Tertiary (`#735c00`):** Zellige Gold. Used for accents, stamps, and "Premium" signifiers.
- **Neutral Background (`#fcf9f8`):** A warm, breathing cream that prevents eye fatigue and mimics high-quality paper.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background creates a soft, sophisticated transition that feels architectural rather than "boxed in."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use surface-container tiers (`Lowest` to `Highest`) to create depth:
- **Surface (Base):** The main canvas.
- **Surface-Container-Low:** Subtle content groupings.
- **Surface-Container-Lowest:** Used for product cards to create a "lifted" effect against a low-tier background.
- **Glassmorphism:** For floating navigation or modal overlays, use `surface` at 80% opacity with a `20px` backdrop blur. This allows the vibrant colors of terroir photography to bleed through, softening the interface.

---

## 3. Typography: The Editorial Voice

Our typography is a bilingual conversation between timeless serifs and functional sans-serifs.

| Level | Font Family | Size | Intent |
| :--- | :--- | :--- | :--- |
| **Display-LG** | Noto Serif / Amiri | 3.5rem | High-impact hero statements; bilingual elegance. |
| **Headline-MD** | Noto Serif / Amiri | 1.75rem | Section titles; evokes a sense of "The Artisan’s Journal." |
| **Title-SM** | Inter / Noto Sans Arabic | 1rem | Functional navigation and sub-headers. |
| **Body-MD** | Inter / Noto Sans Arabic | 0.875rem | Core product descriptions and storytelling. |
| **Label-MD** | Inter / Noto Sans Arabic | 0.75rem | Meta-data, stamps, and micro-copy. |

**Hierarchy Principle:** Always pair a `Display` serif with a `Body` sans-serif. The serif provides the soul and "heritage" feel, while the sans-serif ensures high legibility for transactional data (prices, weights, origins).

---

## 4. Elevation & Depth

We avoid the "floating in space" look of traditional material design. Instead, we use **Tonal Layering**.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift without the need for heavy shadows.
- **Ambient Shadows:** Shadows are reserved for high-interaction elements (e.g., a "Buy" button or an active Cart drawer). Use extra-diffused shadows: `0px 12px 32px rgba(27, 27, 27, 0.06)`. The tint should be a warm grey, never pure black.
- **The "Ghost Border" Fallback:** If containment is required for accessibility, use the `outline-variant` token at 15% opacity. Standard 100% opaque borders are strictly forbidden.

---

## 5. Components

### Buttons
- **Primary:** Solid `primary` (#00513f). 4px-8px radius. Text in `on-primary`. Use for the final "Checkout" or "Add to Basket."
- **Secondary:** Outlined using `primary` at 20% opacity. For secondary navigation.
- **Accent (Terracotta):** Use `secondary-container` for specific artisanal promotions or "New Arrival" tags.
- **Ghost:** No background, `primary` text. Used for "See More" or low-priority utility links.

### The "Zellige" Stamp (Badge)
Rather than standard rectangles, use the 8-pointed zellige star motif for "Organic" or "IGP" certifications. These should appear as "ink-stamps"—slightly rotated (1-2 degrees) to feel hand-pressed.

### Cards & Lists
- **Rule:** Forbid the use of horizontal divider lines. 
- **Execution:** Separate list items using `1.4rem` (Spacing 4) of vertical white space or by alternating between `surface` and `surface-container-low` backgrounds. 
- **Skeleton Loaders:** Use a "Warm Skeleton"—a pulsing gradient from `surface-container-highest` to `surface-variant`.

### Inputs
- **Style:** Minimalist. No bottom line only; use a full container with `surface-container-highest` and a `4px` radius. Focus states should transition the background to `white` with a `2px` primary ghost border.

---

## 6. Do’s and Don’ts

### Do:
- **Use "Paper" Textures:** Apply a subtle 2% grain overlay to the `surface` background to give it a tactile, artisanal quality.
- **Respect the Script:** Ensure Arabic (Amiri) is 20% larger than the corresponding French (Serif) to maintain visual weight parity.
- **Embrace White Space:** High-end brands breathe. Use the Spacing Scale (specifically `8` and `12`) to separate major editorial sections.

### Don’t:
- **Don’t use "Pure" Colors:** Avoid #000000 or #FFFFFF. Use `Near Black` (#1C1C1C) and `Warm Cream` (#FAF6EE) to maintain the organic feel.
- **Don’t use sharp corners:** Nothing in the terroir is perfectly sharp. Stick to the `4px-8px` (sm to lg) roundedness scale.
- **Don’t use standard iconography:** Use thin-stroke, custom-styled icons that feel hand-drawn or etched, rather than thick, bubbly system icons.

### Accessibility Note:
While we prioritize aesthetics, the contrast between `on-surface` (#1B1B1B) and the `Warm Cream` background must always meet WCAG AA standards. Never sacrifice the legibility of artisanal stories for visual "mood."