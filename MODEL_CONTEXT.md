# Mantouji Frontend — Context for AI Models

Use this file when continuing work on the Mantouji project. It describes what is **implemented today**, what is **mock-only**, and how the UI maps to the future API.

---

## Project summary

**Mantouji** is a Moroccan **terroir-products showcase** platform (not e-commerce).

- **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn-style UI (`src/components/ui/`)
- **Data:** Local mock only — no real backend, no real auth
- **Design:** Aligned with Google Stitch project *"Mantouji: Authentic Moroccan Showcase"* (burgundy `#5d2a26`, sage `#50652a`, Noto Serif + Inter)
- **Primary CTA:** `Contacter via WhatsApp` / `Commander via WhatsApp` — see `src/lib/whatsapp.ts`

---

## What is NOT implemented (do not add unless asked)

| Feature | Status |
|---------|--------|
| Cart / panier | ❌ Not implemented |
| Checkout | ❌ Not implemented |
| Online payment | ❌ Not implemented |
| Delivery / shipping flow | ❌ Not implemented |
| Order tracking | ❌ Not implemented |
| Real backend HTTP calls | ❌ Not implemented |
| Real authentication (JWT, sessions) | ❌ Visual mock only on `/login` and `/register` |

---

## Future API base URL (contract only — not wired yet)

```
https://api.mantouji.com/api/v1
```

### Standard response shapes

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

### Roles (domain model)

- `CLIENT`
- `COOPERATIVE`
- `ADMIN`

### Entities (domain model)

`utilisateurs`, `profil_cooperatives`, `regions`, `categories`, `produits`, `certifications`, `certification_produits`, `avis`, `medias`

---

## Mock API — implemented in `src/lib/api-mock.ts`

These mirror the planned REST endpoints. All return `ApiSuccess<T>` (async helpers) or sync helpers used directly in pages.

| Planned endpoint | Mock function | Returns |
|------------------|---------------|---------|
| `GET /regions` | `getRegions()` | `Region[]` |
| `GET /categories` | `getCategories()` | `Categorie[]` |
| `GET /certifications` | `getCertifications()` | `Certification[]` |
| `GET /cooperatives` | `getCooperatives()` | `Cooperative[]` |
| `GET /cooperatives/{id}` | `getCooperativeById(id)` | `Cooperative` or `null` |
| `GET /cooperatives/{id}` (sync) | `getCooperative(id)` | `Cooperative \| undefined` |
| `GET /produits` | `getProducts()` | `Produit[]` |
| `GET /produits/{id}` | `getProductById(id)` | `Produit` or `null` |
| `GET /produits/{id}` (sync) | `getProduct(id)` | `Produit \| undefined` |
| `GET /produits/{id}/avis` | `getProductReviews(id)` | `Avis[]` |
| — | `getProductsByCooperative(coopId)` | `Produit[]` |
| — | `getFeaturedProducts(limit?)` | `Produit[]` |
| — | `getFeaturedCooperatives(limit?)` | `Cooperative[]` |

**Mock data files:** `src/data/mock-*.ts`

---

## Pages — implemented routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/app/page.tsx` | Landing: hero, categories, story, featured products/coops, trust, locations |
| `/produits` | `src/app/produits/page.tsx` | Catalog: search, pill filters, sidebar/sheet filters, vertical product list |
| `/produits/[id]` | `src/app/produits/[id]/page.tsx` | Product detail: gallery, certs, story, composition, origin, reviews, WhatsApp CTA |
| `/cooperatives` | `src/app/cooperatives/page.tsx` | Cooperatives directory |
| `/cooperatives/[id]` | `src/app/cooperatives/[id]/page.tsx` | Cooperative profile: hero, story, WhatsApp, products list |
| `/regions` | `src/app/regions/page.tsx` | Regions explorer (interactive map) |
| `/regions/[slug]` | `src/app/regions/[slug]/page.tsx` | Region detail by name slug (e.g. `oriental`) |
| `/certifications` | `src/app/certifications/page.tsx` | Trust & certifications hub |
| `/favoris` | `src/app/favoris/page.tsx` | Saved products (mock IDs) |
| `/a-propos` | `src/app/a-propos/page.tsx` | About / Notre histoire |
| `/compte` | `src/app/compte/page.tsx` | Account hub (mock) |
| `/recherche` | `src/app/recherche/page.tsx` | Search results |
| `/dashboard/cooperative` | `src/app/dashboard/cooperative/page.tsx` | Cooperative dashboard mock (coop `coop1`) |
| `/dashboard/admin` | `src/app/dashboard/admin/page.tsx` | Admin dashboard mock (KPIs, pending items) |
| `/login` | `src/app/login/page.tsx` | Login UI mock (no real auth) |
| `/register` | `src/app/register/page.tsx` | Register UI mock (no real auth) |

**Layout (all pages except auth):** `Navbar`, `Footer`, `MobileNav`, `FloatingWhatsApp` in `src/app/layout.tsx`

---

## Sample IDs for testing

### Products (`/produits/{id}`)

| ID | Name |
|----|------|
| `p1` | Dattes Aziza de Figuig |
| `p2` | Huile d'Argan du Souss |
| `p3` | Miel de Talsint |
| `p4` | Couscous artisanal de Figuig |
| `p5` | Cumin de l'Oriental |
| `p6` | Eau de rose de Kelaat M'Gouna |
| `p7` | Huile d'olive Beni Tadjit |

### Cooperatives (`/cooperatives/{id}`)

| ID | Name |
|----|------|
| `coop1` | Coopérative Aziza de Figuig |
| `coop2` | Targantine du Souss |
| `coop3` | Ruchers de Talsint |
| `coop4` | Épices de l'Oriental |
| `coop5` | Roses de Kelaat M'Gouna |
| `coop6` | Oléa Beni Tadjit |

### Regions

`r1` Oriental · `r2` Souss-Massa · `r3` Drâa-Tafilalet · `r4` Fès-Meknès · `r5` Marrakech-Safi

### Certifications

`cert1` ONSSA · `cert2` IGP · `cert3` Bio · `cert4` Produit de Figuig

---

## Key types (`src/types/`)

- `api.ts` — `ApiSuccess`, `ApiError`, `Role`, `Disponibilite`
- `product.ts` — `Produit`, `Region`, `Categorie`, `Certification`, `Media`, `Avis`
- `cooperative.ts` — `Cooperative`, `CooperativeSummary`
- `user.ts` — `Utilisateur`

### `Produit` required fields

`id`, `nom`, `description`, `origine`, `composition`, `prix`, `disponibilite`, `categorie`, `cooperative`, `medias`, `certifications`, `avis` (+ `regionId`, `histoire?` in mock)

### `Cooperative` required fields

`id`, `nomCooperative`, `description`, `histoire`, `telephone`, `whatsapp`, `siteWeb?`, `logoUrl`, `region`

---

## Important components

| Component | Path |
|-----------|------|
| Navbar | `src/components/layout/Navbar.tsx` |
| MobileNav | `src/components/layout/MobileNav.tsx` |
| Footer | `src/components/layout/Footer.tsx` |
| Hero (landing) | `src/components/home/Hero.tsx` |
| Catalog card (Stitch style) | `src/components/products/ProductCatalogCard.tsx` |
| Grid card (legacy) | `src/components/products/ProductCard.tsx` |
| Filters | `src/components/products/ProductFilters.tsx` |
| Category pills | `src/components/products/CategoryPills.tsx` |
| Gallery | `src/components/products/ProductGallery.tsx` |
| Reviews | `src/components/products/ProductReviews.tsx` |
| WhatsApp CTA | `src/components/products/WhatsAppCTA.tsx` |
| Floating WhatsApp FAB | `src/components/products/FloatingWhatsApp.tsx` |
| Certification badge | `src/components/products/CertificationBadge.tsx` |
| Cooperative hero | `src/components/cooperatives/CooperativeHero.tsx` |
| Dashboard stat card | `src/components/dashboard/StatCard.tsx` |

---

## WhatsApp helper

```ts
// src/lib/whatsapp.ts
generateWhatsAppLink(phone, productName?)
// Message: "Bonjour, je suis intéressé par le produit: {productName} sur Mantouji."
```

---

## Stitch design reference

- **Exported designs (preferred):** `designdraft/` — see `designdraft/README.md`
- Legacy previews: `public/stitch-previews/`
- Brand logos: `public/images/logo.png`, `logo-dark.png`
- Cursor rule for Stitch workflow: `.cursor/rules/stitch-designs.mdc`

---

## Run locally

```bash
npm run dev
# http://localhost:3000
```

```bash
npm run build
```

---

## Related docs in repo

- `PAGES.md` — checklist of pages/components (all items checked)
- `MODEL_CONTEXT.md` — this file (handoff for AI models)

---

## Suggested next steps (not done yet)

- Wire `api-mock.ts` to real `fetch()` against `https://api.mantouji.com/api/v1`
- Connect real auth on `/login` and `/register`
- Persist favorites (currently mock IDs in `src/lib/favorites.ts`)
- Favicon from Mantouji star icon
