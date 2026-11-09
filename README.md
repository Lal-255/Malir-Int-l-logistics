# Malir Int’l Logistics — Website

Production website for **MALIR INT’L LOGISTICS**, a China-registered FCL ocean freight company serving the China → Middle East & Red Sea corridor.

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS 4**. Pages are pre-rendered for speed and SEO. The only server code is the inquiry API.

---

## 1. What’s included

| Page | URL | Highlights |
|---|---|---|
| Home | `/` | Full-width vessel hero, headline and two CTAs, interactive route map, services, destinations, containers, industries, why Malir, importer/exporter solutions, partnership band, process, FAQs, quote form |
| About Us | `/about` | Company positioning and a China registration panel (placeholders) |
| Our Services | `/services` | 7 service sections with anchor navigation and a clear FCL-only statement |
| Routes & Destinations | `/routes` | Map, Chinese origin gateways, Gulf and Red Sea country cards with UN/LOCODEs |
| Country pages | `/routes/saudi-arabia`, `/routes/uae`, … (11 pages) | SEO landing pages ("China to X Shipping"), highlighted map, ports, quote links that pre-fill the destination |
| Container Solutions | `/containers` | 6 container types with technical drawings, typical ISO specs, and notes on what depends on the carrier |
| Industries | `/industries` | 8 sectors, with a clear "logistics only, no sourcing" statement |
| Partner With Us | `/partner` | "BUILD STRONGER LOGISTICS PARTNERSHIPS WITH CHINA", audiences, offer, partnership inquiry form |
| Request a Quote | `/quote` | All 14 requested fields with validation. Accepts `?destination=jeddah` and `?container=Reefer` |
| Contact Us | `/contact` | Company intro, registration info, business inquiry form, email/WhatsApp. The map appears only once an address is set |

**Working features:** responsive layout (tested at 390, 768 and 1440 px), mobile menu, client- and server-side form validation, honeypot spam trap, rate limiting, inquiry reference numbers, floating WhatsApp button (appears only after a number is set), reveal animations that respect reduced-motion, skip link, accessible labels and errors, and a 404 page.

**SEO:** unique titles and descriptions, canonical URLs, one H1 per page, Open Graph image, `sitemap.xml`, `robots.txt`, and JSON-LD for Organization, Service, FAQPage and BreadcrumbList.

> **Indexing safeguard:** until `NEXT_PUBLIC_SITE_URL` is set, the site sends `noindex` and `robots.txt` blocks all crawlers, so placeholder content can’t be indexed. Search indexing turns on automatically once the domain is configured.

---

## 2. Languages

The site is available in **English, Arabic (العربية), Persian (فارسی) and Chinese (中文)**.

| Language | URL | Direction |
|---|---|---|
| English | `/`, `/about`, … | left-to-right |
| Arabic | `/ar`, `/ar/about`, … | right-to-left |
| Persian | `/fa`, `/fa/about`, … | right-to-left |
| Chinese (Simplified) | `/zh`, `/zh/about`, … | left-to-right |

- A language switcher (🌐) in the header keeps visitors on the same page when they change language.
- Each language has its own page titles, descriptions and `hreflang` links, so Google can show the right version to people in each country.
- Arabic and Persian use the Vazirmatn font. Chinese uses the visitor's system Chinese font, so nothing heavy is downloaded.
- Forms are fully translated. Inquiries always arrive in **English** for your team, with the visitor's website language noted.
- **All text lives in `src/i18n/`**: `en.ts`, `ar.ts`, `fa.ts`, `zh.ts`. Each file has exactly the same structure, and the build fails if a translation is missing.
- ⚠️ The translations were written by AI. **Please have a native speaker check the Arabic, Persian and Chinese before publishing**, especially the service and legal wording.

## 3. Company details

| Detail | Status | Where to change |
|---|---|---|
| Domain | ✅ `https://malirlogistics.com` (search indexing is ON) | `NEXT_PUBLIC_SITE_URL` or `src/config/site.ts` |
| WhatsApp | ✅ +86 153 2348 2585 — floating button, contact cards and forms all use it | `NEXT_PUBLIC_WHATSAPP` or `src/config/site.ts` |
| Logo | ✅ In `public/brand/` (header, footer, browser icon, share image) | replace `public/brand/logo-*.png` and `src/app/[lang]/icon.png` / `apple-icon.png` |
| Official email | ⏳ not available yet — shown as "pending verification" | `NEXT_PUBLIC_CONTACT_EMAIL` |
| China office address | ⏳ not provided — shown as "pending verification"; the map appears once set | `NEXT_PUBLIC_OFFICE_ADDRESS` |
| Native-speaker review of AR / FA / ZH | ⏳ not available | `src/i18n/ar.ts`, `fa.ts`, `zh.ts` |

Also review before launch:
- **Destination list.** All 11 countries are shown as "quoted case by case". Remove any you don’t actually serve in `src/data/routes.ts`.
- **Iran.** The brief mentions Iranian forwarders and "China to Iran shipping". Iran is **not** included yet. Sanctions exposure (for example US, EU or UN rules, and the terms of hosting, payment and email providers) should be reviewed with a qualified advisor first. If cleared, add it to `src/data/routes.ts` and the partner page.
- **Red Sea routing.** The copy states that Red Sea routings depend on security and carrier conditions. Keep this wording while the situation remains volatile.

---

## 4. Run locally

Requires Node.js 18.18 or later (20+ recommended).

```bash
npm install
cp .env.example .env.local     # fill in what you have
npm run dev                    # http://localhost:3000
npm run build && npm start     # production mode
```

---

## 5. Inquiry forms — connect delivery

The forms post to `/api/inquiry`. Configure at least one delivery channel in your hosting environment:

**A. Email via Resend (recommended)**
1. Create an account at resend.com, then add and verify your domain.
2. Set `RESEND_API_KEY`, `INQUIRY_TO_EMAIL` (comma-separate multiple inboxes) and `INQUIRY_FROM_EMAIL` (e.g. `Malir Website <web@yourdomain.com>`).
3. Replying to the notification email goes straight to the customer.

**B. Webhook** — set `INQUIRY_WEBHOOK_URL` to send JSON to Zapier, Make, n8n, a CRM, Slack and so on.

If neither is configured, the API returns 503 and the visitor sees a clear **“not sent”** message with buttons to email the pre-filled inquiry, send it on WhatsApp, or copy the text. Submissions are never silently lost or faked as sent.

---

## 6. Photography

The image files live in `/public/images` (see `src/data/images.ts`). `npm run build` first runs `npm run images`, which downloads six free-licence Unsplash photos (container vessels, terminal, container yard and cranes) if they aren’t already there. On Vercel this happens automatically. If a download fails, a navy placeholder is shown instead of a broken image.

To use your own or licensed photos, drop a file with the **same filename** into `public/images/`. No code change is needed. Your own vessel and terminal photos will build more trust than stock images.

---

## 7. Deploy (Vercel recommended)

1. Push this folder to a GitHub repository.
2. On vercel.com, choose **Add New → Project** and import the repository. The framework is auto-detected.
3. Under **Settings → Environment Variables**, add the variables from `.env.example`, then redeploy.
4. Under **Settings → Domains**, add your domain and create the DNS records Vercel shows you (usually an `A` record to `76.76.21.21` for the root and a `CNAME` to `cname.vercel-dns.com` for `www`).
5. The domain `malirlogistics.com` is already set as the site address. At your domain registrar, point `malirlogistics.com` (A record `76.76.21.21`) and `www` (CNAME `cname.vercel-dns.com`) to Vercel; Vercel will redirect `www` to the main domain.
6. Submit `https://yourdomain/sitemap.xml` in Google Search Console.

> **Audience in mainland China:** Vercel works for Middle East visitors, but access from mainland China can be slow. If Chinese exporters are a key audience, consider also hosting on Alibaba Cloud or Tencent Cloud (`npm run build && npm start` runs on any Node host). ICP filing is required for hosting inside mainland China.

Any Node host works: `npm ci && npm run build && npm start` (default port 3000; set `PORT` to change it).

---

## 8. Updating content

| To change… | Edit |
|---|---|
| Company details and contact | `src/config/site.ts` / environment variables |
| Countries, ports, Chinese origin ports | `src/data/routes.ts` (country pages, sitemap, map and form options update automatically; for a new port, add its coordinates to `scripts/port-coords.json` and run `npm run build:map`) |
| Any website text (all pages, services, FAQs, ports, forms) | `src/i18n/en.ts` and the matching `ar.ts`, `fa.ts`, `zh.ts` |
| Container types / ports structure | `src/data/containers.ts`, `src/data/routes.ts` |
| Form fields and validation | `src/lib/inquiry.ts` (shared by the browser and the server) |
| Colours and fonts | `src/app/globals.css` (`@theme` block) |

**Content rules (from the brief):** FCL only. No LCL or partial loads. No sourcing or purchasing services. No invented transit times, sailing schedules, rates, certifications, testimonials, statistics or carrier partnerships.

---

## 9. Project structure

```
src/
  app/[lang]/     all pages (one set, rendered in 4 languages)
  app/api/        inquiry API
  i18n/           translations (en, ar, fa, zh) and language helpers
  middleware.ts   serves English at / and other languages under /ar, /fa, /zh
  components/     Header, Footer, RouteMap, ContainerDiagram, forms, UI primitives
  config/site.ts  company details (placeholders until verified)
  data/           routes, containers, content, images, generated map
  lib/            SEO helpers, shared form schema + validation
scripts/          image downloader, map generator (Natural Earth data)
```

Map data © Natural Earth (public domain). Photos are under the Unsplash License.
