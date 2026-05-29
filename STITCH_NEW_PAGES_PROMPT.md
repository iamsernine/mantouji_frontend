# Google Stitch — Mantouji New Pages Prompt

Copy everything below into Stitch when generating **new** screens only.

---

IMPORTANT:
This is NOT a redesign from scratch.

We are CONTINUING an existing Mantouji design system already partially implemented in Cursor.

Your role:
Design ONLY the new pages/components while STRICTLY respecting the existing visual language and component consistency.

Do NOT reinvent styles between pages.

PROJECT:
Mantouji — Moroccan terroir products showcase platform.
Not e-commerce.
Main CTA = WhatsApp contact.

Current style already exists:
- premium Moroccan
- warm
- elegant
- editorial
- mobile-first
- soft rounded cards
- premium product imagery
- subtle Moroccan identity
- clean whitespace
- modern typography

COLORS already established:
- burgundy #5d2a26
- sage green #50652a
- warm off-white #fbf9f8
- sand beige #f0eded
- terracotta accents #9a401f
- charcoal text #1b1c1c
- gold accent #c5a048 (badges/highlights)

TYPOGRAPHY already established:
- Noto Serif for headings
- Inter for body/UI

VERY IMPORTANT CONSISTENCY RULES:
If a component already exists in another page:
- KEEP the same style
- KEEP the same spacing
- KEEP the same radius (cards: 16px / rounded-2xl, buttons: pill/full rounded)
- KEEP the same shadow (soft, light)
- KEEP the same typography
- KEEP the same button height (min 44px on mobile)
- KEEP the same badge design (rounded-full pills)
- KEEP the same card structure

DO NOT:
- slightly modify buttons between pages
- slightly change shadows
- slightly change border radius
- slightly change spacing
- create a different filter style
- create a different card style

The UI must feel like ONE unified product system.

MOBILE-FIRST:
Design first for 375px mobile.
Desktop comes second (max-width container, optional 2–3 column grids).

---

## REFERENCE — Already designed & implemented (MATCH THESE EXACTLY)

Use these existing Stitch screens as the visual source of truth. New pages must look like they belong to the same app:

| Screen | Route | Key patterns to reuse |
|--------|-------|------------------------|
| Landing Page (Mobile) | `/` | White navbar (menu + MANTOUJI serif center + search), full-bleed hero image, white rounded search pill, burgundy **Explorer** button, 2×2 category image grid, editorial sections, white footer columns, bottom nav, green WhatsApp FAB |
| Product Catalog (Mobile) | `/produits` | Eyebrow “Nos Produits”, title **Curated Terroir Wonders**, sage **pill filters**, vertical **image-first product cards** (photo → title serif → price • category → region pin → WhatsApp link), filter sheet on mobile |
| Product Detail (Mobile) | `/produits/[id]` | Image gallery, terroir/cert pill badges, serif product title, cooperative link, **Commander via WhatsApp** sticky CTA, artisan story with burgundy left border, composition checklist, origin/map block |
| Cooperative Profile (Mobile) | `/cooperatives/[id]` | Hero image + gradient overlay + badge, 3-icon value row (Fair Trade / Bio / Handmade), warm story block, sage **Connect Directly** WhatsApp card, horizontal product cards |

**Do NOT redesign the pages above.** Only extend the system.

---

## NEW PAGES TO DESIGN

Generate **one mobile screen per page** (plus optional desktop variant if Stitch supports it).

### 1. Cooperatives Directory (Mobile) — `/cooperatives`
**Priority: HIGH** (missing index; only detail page exists today)

Content:
- Page title: **Nos Coopératives** (Noto Serif)
- Short intro paragraph (terroir, femmes, transparence)
- Vertical list OR 2-column grid of **cooperative cards** (same card language as landing/coop profile thumbnails):
  - photo/logo
  - cooperative name
  - region (MapPin)
  - 1-line description
  - optional certification chips
- No cart, no “follow” commerce patterns
- Tap card → cooperative profile (existing screen)
- Reuse: navbar, bottom nav, WhatsApp FAB, footer

Mock examples to show in design:
- Coopérative Aziza de Figuig — Drâa-Tafilalet
- Targantine du Souss — Souss-Massa
- Ruchers de Talsint — Oriental

---

### 2. Regions Explorer (Mobile) — `/regions`
**Priority: HIGH**

Content:
- Eyebrow: **Terroirs du Maroc**
- Title: **Explorer par région**
- 5 region cards (image + region name + 1-line description):
  - Oriental, Souss-Massa, Drâa-Tafilalet, Fès-Meknès, Marrakech-Safi
- Each card links to filtered catalog (conceptual)
- Optional: product count per region (e.g. “12 produits”)
- Same card radius/shadow as category grid on landing
- Reuse navbar, bottom nav, FAB

---

### 3. Certifications & Trust Hub (Mobile) — `/certifications`
**Priority: MEDIUM**

Content:
- Title: **Confiance & certifications**
- Explain traceability (ONSSA, IGP, Bio, Produit de Figuig)
- 4 certification cards with icon/badge + title + short description
- Section: “Comment lire une fiche produit” (3 simple steps, editorial)
- CTA: **Explorer le catalogue** (burgundy primary)
- Visual tone: trust, institutional but warm — not bureaucratic
- Reuse trust section style from landing

---

### 4. Favorites / Saved Products (Mobile) — `/favoris`
**Priority: MEDIUM** (bottom nav already has “Favoris”)

Content:
- Title: **Mes favoris**
- Empty state: elegant illustration area + “Aucun produit enregistré” + button to catalogue
- Filled state: reuse **Product Catalog Card** layout (same as `/produits`)
- 2–3 sample favorited products in filled mockup
- No login required in UI copy (mock showcase)
- No cart

---

### 5. About / Our Story (Mobile) — `/a-propos`
**Priority: MEDIUM**

Content:
- Title: **Notre histoire**
- Editorial long-form: Mantouji mission, coopératives, terroir marocain
- Pull quote block (serif italic, burgundy border)
- Photo block (artisan/cooperative — premium photography)
- Stats row (optional): cooperatives count, regions, products
- CTA: **Découvrir le catalogue** + secondary **Voir les coopératives**
- Match **Notre Histoire** section from landing but full page

---

### 6. Client Account Hub (Mobile) — `/compte`
**Priority: LOW** (auth is mock only)

Content:
- Profile header: avatar placeholder, name, email
- Menu list rows (same row height/spacing as settings apps):
  - Mes favoris
  - Mes avis (mock)
  - Préférences
  - Aide & contact WhatsApp
  - Déconnexion (mock)
- Badge: “Compte démo — aucune authentification réelle”
- No password reset flows
- Reuse login/register visual language

---

### 7. Cooperative Dashboard (Mobile) — `/dashboard/cooperative`
**Priority: MEDIUM** (exists in code but needs Stitch-quality mobile screen)

Content:
- Header: **Tableau de bord — Coopérative**
- 4 stat cards in 2×2 grid (reuse dashboard stat card style): Produits actifs, Certifications, Avis, Note moyenne
- Section **Mes produits**: stacked cards on mobile (NOT dense table) — product name, price MAD, status badge **Validé** / **En attente**
- Section **Certifications**: status badges
- Section **Avis récents**: 2 review cards
- No e-commerce analytics, no revenue charts

---

### 8. Admin Dashboard (Mobile) — `/dashboard/admin`
**Priority: MEDIUM**

Content:
- Header: **Administration Mantouji**
- KPI row: Coopératives, Produits, Utilisateurs, En attente, Signalements
- Section: **Coopératives — aperçu** (small cards)
- Section: **Produits en attente de validation** (pending badge)
- Section: **Certifications en attente**
- Section: **Contenus signalés**
- Stacked cards only on mobile; avoid wide tables

---

### 9. Search Results (Mobile) — `/recherche`
**Priority: LOW** (optional; search currently goes to `/produits`)

Content:
- Sticky search input (same as landing hero search pill)
- Query display: “Résultats pour : dattes”
- Result count
- Reuse catalog **product cards** vertically
- Empty state if no results
- Pill filters optional (same as catalog)

---

## NEW COMPONENTS TO DESIGN

Design these as **consistent building blocks** (can be shown in context on a page):

| Component | Usage | Must match |
|-----------|--------|------------|
| **Cooperative list card** | `/cooperatives` directory | Cooperative profile thumbnail cards / landing coop scroll |
| **Region card** | `/regions` | Landing 2×2 category grid (image + label) |
| **Certification explainer card** | `/certifications` | Certification badge + gold/sage pill style |
| **Empty state block** | `/favoris`, `/recherche` | Centered, serif title, muted body, one primary button |
| **Editorial quote block** | `/a-propos`, coop story | Burgundy left border, serif italic |
| **Account menu row** | `/compte` | Full-width tappable row, 56px min height, subtle divider |
| **Dashboard product row card** | Cooperative dashboard | White card, rounded-2xl, status badge right |
| **Pending validation row** | Admin dashboard | Title + subtitle + **En attente** gold badge |
| **Reported content row** | Admin dashboard | **Signalé** outline badge |

---

## EXISTING REUSABLE COMPONENTS (DO NOT REDESIGN)

Reuse visually in all new screens:
- Navbar (white, MANTOUJI burgundy serif center, menu + search)
- Primary button (burgundy, pill, 44px min height)
- Secondary button (sage green, pill)
- WhatsApp CTA (green #25D366, full width or FAB)
- Product catalog card (image 4:3 → serif title → price • category → region → WhatsApp)
- Certification badge (rounded-full, gold/sage variants)
- Search bar (white rounded pill inside hero or sticky top)
- Dashboard stat card (icon top-right, big number, subtitle)
- Mobile bottom nav (Accueil, Explorer, Favoris, Compte — burgundy active state)
- Footer (white, multi-column links, MANTOUJI wordmark)

---

## CONTENT & BEHAVIOR RULES

Language: **French** (UI labels, buttons, placeholders)

Primary CTA copy:
- **Contacter via WhatsApp**
- **Commander via WhatsApp**
- **Explorer** / **Explorer le catalogue**

Forbidden UI:
- Cart icon, checkout, payment, delivery tracker, “Add to cart”, price checkout flow

Product examples (use real names in mocks):
- Dattes Aziza de Figuig
- Huile d'Argan du Souss
- Miel de Talsint
- Couscous artisanal de Figuig
- Cumin de l'Oriental
- Eau de rose de Kelaat M'Gouna
- Huile d'olive Beni Tadjit

Certifications to show: **ONSSA**, **IGP**, **Bio**, **Produit de Figuig**

---

## DELIVERABLES EXPECTED FROM STITCH

For each new page listed above:
1. **Mobile screen** (375px) — primary deliverable
2. Consistent with existing 4 reference screens
3. Include navbar + bottom nav + WhatsApp FAB where applicable
4. Use mock content in French, realistic Moroccan terroir photography

Optional: desktop layout (1280px) for `/cooperatives` and `/regions` only.

---

## GENERATION ORDER (recommended)

1. `/cooperatives` — Cooperatives Directory
2. `/regions` — Regions Explorer
3. `/certifications` — Trust Hub
4. `/favoris` — Favorites
5. `/a-propos` — About
6. `/dashboard/cooperative` — Cooperative Dashboard mobile
7. `/dashboard/admin` — Admin Dashboard mobile
8. `/compte` — Account Hub
9. `/recherche` — Search Results (optional)
