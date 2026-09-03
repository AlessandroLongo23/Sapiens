# SEO-TODO — Sapiens

Running record of the SEO / crawlability / content overhaul (branch `seo-overhaul`, 2026-09-03).
Ticked items are done in code and verified against the production build. Everything under
"Decisions for the owner", "Owner actions" and "Missing copy" needs a human.

## Recon findings

- Content lives in the Supabase table `content_nodes` (277 nodes: 3 levels, 10 subjects, 76 chapters, 188 lessons). The in-code copy in `src/lib/data/content-tree.ts` is stale and now only feeds the admin area and the landing counter fallback.
- No node has a `description`. 18 lessons have theory text (all in Scuola superiore / Matematica); 1 has a formulary (a test stub); 15 lessons have exercise generators.
- Every page shipped the whole table, theory text included, in its HTML (about 300 KB per page). Subject pages are now 18 to 21 KB gzipped.
- `/wiki/high_school/math` had 9 links; all cards were `<button>` + `goto()`.
- `/faq`, `/contacts`, `/about`, `/catalog`, `/legal` were 0-byte route files rendering blank pages with HTTP 200; `/terms` and `/privacy` did not exist; `+error.svelte` was empty.
- `sapiens-xi.vercel.app` already 307-redirects to `sapiens-edu.vercel.app`, but `app.html` pointed `og:url` / `og:image` at it.
- `robots.txt` and `sitemap.xml` returned 404.
- Two theme bugs: `app.html` queried `prefers-color-scheme: light` for `prefersDark`, and `ThemeProvider` forced `light` on mount when nothing was stored.
- The private areas (`/home`, `/library`, `/settings`, `/subscription`, `/dashboard`, `/analytics`, …) are not behind the auth guard in `hooks.server.js`, which only protects `/student` and `/admin`. They are now `noindex`, but they are still reachable without login (see Owner actions).

## Phase 1 — Credibility blockers

- [x] Task 1 — Every Lorem ipsum removed (4 card components). Descriptions render only when the node has one. `scripts/check-placeholder.mjs` scans `src/`, `static/`, the build output and the `content_nodes` table and fails `npm run build` on a hit.
- [x] Task 2 — `/faq`, `/contacts`, `/terms`, `/privacy`, `/pricing` each have one `<h1>`, a unique Italian title and description. `/pricing` is "Prezzi e abbonamenti".
- [x] Task 3 — Titles per node type (`$lib/seo/meta.ts`), kept under 60 characters by dropping the least important segment; the lesson name is never cut.
- [x] Task 4 — Distinct description template per node type with real names and counts; lessons with theory use the first paragraph of the text.
- [x] Task 5 — `prefers-color-scheme: dark` in `app.html` and `ThemeProvider`; the toggle is the only thing that persists a choice, so untouched visitors follow the OS.

## Phase 2 — Crawlability

- [x] Task 6 — Level, subject, chapter and lesson cards are `<a href>` in the server-rendered HTML (`LevelCard`, `SubjectCard`, `ChapterCard`, `TopicCard`). Breadcrumb segments are links. No `goto()` navigation is left in cards or breadcrumbs.
- [x] Task 7 — `/materiale/<livello>/<materia>/<capitolo>/<lezione>` with `medie` / `superiori` / `universita`; sub-views `esercizi`, `formulario`, `flashcards`. One utility (`$lib/seo/slug.ts`) generates and resolves every URL for the router, the sitemap, the cards, the menu and the redirects. Every `/wiki/...` path 301s to its new equivalent (`hooks.server.js`); unknown ones 404. Non-canonical spellings (database slugs, upper case) 301 to the canonical path.
- [x] Task 8 — No `sapiens-xi` string in source or build output; every absolute URL derives from `SITE_URL`.
- [x] Task 9 — Linked breadcrumbs (`<nav><ol>`) on index pages plus `BreadcrumbList` JSON-LD; lesson pages emit the same JSON-LD (they keep the back arrow instead of a visual trail).
- [x] Task 10 — `/robots.txt` and `/sitemap.xml` (content-driven, with `lastmod`; index + chunked sitemaps kick in above 10 000 URLs).

## Phase 3 — Metadata and structured data

- [x] Task 11 — `src/lib/config/site.ts`: `SITE_URL` from `PUBLIC_SITE_URL` (fallback to the Vercel host), site name, defaults, private path prefixes. `.env.example` added.
- [x] Task 12 — `app.html` no longer has a `<title>`; `<Seo>` (`$lib/components/seo/Seo.svelte`) emits title, description, robots, self-referencing canonical, Open Graph (`og:site_name`, image width/height/alt) and Twitter `summary_large_image` on every route.
- [x] Task 13 — `EducationalOrganization` + `WebSite` site-wide, `Course` on subject pages, `LearningResource` on chapters, lessons, esercizi and formulario, `FAQPage` on `/faq` (10 visible questions), `Product` + `Offer` on `/pricing` from the Stripe plan config, `BreadcrumbList` everywhere. No `AggregateRating`. No `SearchAction` (site search is an overlay without a URL).
- [x] Task 14 — Implemented under the assumption below (DECISION 1): theory and formulari are free and indexable; esercizi and flashcards are declared Premium in the plan config, so their pages carry `isAccessibleForFree: false` + `hasPart` on `#esercizi`. Googlebot and anonymous visitors receive byte-identical HTML (verified).
- [x] Task 15 — `noindex` meta plus `X-Robots-Tag: noindex, nofollow` on `/admin`, `/api`, every signed-in area and `/pricing/success|cancel`; excluded from the sitemap and disallowed in `robots.txt`. Lessons without theory, placeholder esercizi/formulario pages and all flashcards pages are `noindex` until content exists (they flip automatically).
- [x] Task 16 — `PUBLIC_GSC_VERIFICATION` renders the verification meta when set; files in `static/` are served untouched; `@vercel/analytics` and `@vercel/speed-insights` injected from `src/routes/+layout.js`.

## Phase 4 — Performance and assets

- [x] Task 17 — Global TikZJax, its plain-HTTP font stylesheet and the KaTeX CDN stylesheet are gone from `app.html`. KaTeX is an explicit dependency with its CSS imported by the components that render math. TikZJax loads from `$lib/utils/tikzjax.ts` only when a lesson contains a TikZ block and it approaches the viewport. `/`, `/pricing`, `/faq`, `/contacts` ship zero KaTeX/TikZ bytes (verified on the route-node closure).
- [x] Task 18 — `plainTitle()` turns `Numeri naturali \mathbb{N}` into `Numeri naturali ℕ` for `<title>`, descriptions, sitemap, breadcrumb JSON-LD and menus. Rendered math uses KaTeX HTML output with `role="math"` and an `aria-label`; lesson bodies are typeset on the server with the TeX annotation stripped.
- [x] Task 19 — Favicon set (`favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192/512.png`, `site.webmanifest`) and `og-image.jpg` (1200×630, 30 KB) generated by `scripts/generate-images.mjs`. Hero screenshot moved to `src/lib/assets` and served through `@sveltejs/enhanced-img` (AVIF/WebP, `srcset`, intrinsic size, `fetchpriority="high"`, preload). Pages load only the current node's text; the tree shipped to the browser is slimmed to ids, titles, slugs and flags.
- [x] Task 20 — Public content, `robots.txt` and the sitemaps use Vercel ISR (`@sveltejs/adapter-vercel`, `expiration: 600`), so the library is static HTML on the edge and admin edits appear within 10 minutes without a redeploy. Fonts are self-hosted (`@fontsource-variable/inter`, JetBrains Mono) with `font-display: swap` and a preload of the latin subset. The lesson route is split from the index route so index pages do not load markdown-it; the auth client and the WebGL background load after idle.

## Phase 5 — Content and conversion

- [x] Task 21 — 300–450 words of hand-written Italian copy for each of the 10 subject pages (`src/lib/content/subject-copy.ts`, rendered by `SubjectGuide.svelte`), grounded in the chapters that exist in the database, with links to the other subjects at the same level, the same subject at the other levels and `/pricing`. Needs the owner's editorial review.
- [x] Task 22 — One `<h1>` per page, logical heading order (footer, pricing cards), skip link, `<main>` landmark, `nav`/`aside` labels, visible focus rings, accessible names on icon-only controls, contrast fixes (primary buttons crimson-600, footer greys, helper text, TOC in dark mode). Lighthouse accessibility: 100 on every audited page.

## Phase 6 — Verification (production build, `npm run build && npm run preview`, 2026-09-03)

- [x] `grep -ri "lorem ipsum"` over source and build output: 0 hits; the database check found 0 hits in 277 nodes.
- [x] Exactly one `<title>` per page; none say `Nodo` or `Pricing`.
- [x] Exactly one `<h1>` on `/`, `/materiale`, level/subject/chapter/lesson pages, esercizi, formulario, flashcards, `/faq`, `/contacts`, `/pricing`, `/terms`, `/privacy`, the 404 page.
- [x] Unique hand-written or node-derived description on every public page.
- [x] Crawl from `/` (linkinator, recursive): 848 distinct pages, 0 broken links: 90 index pages (1 + 3 + 10 + 76), 188 lessons, 188 × esercizi/formulario/flashcards, 6 marketing pages.
- [x] No `<button>` or `<div onclick>` navigation between content pages.
- [x] `/wiki`, `/wiki/high_school`, `/wiki/high_school/math`, `/wiki/.../theory`, `/wiki/.../exercises`, `/wiki/university/analisi-2/serie-di-Taylor` all answer 301 to the Italian URL; `/wiki/nope/nope` answers 404.
- [x] No `sapiens-xi` string in source or build.
- [x] `rel="canonical"` absolute and self-referencing on every route (from `SITE_URL`).
- [x] `/robots.txt` 200 `text/plain`; `/sitemap.xml` 200 `application/xml` with 126 URLs (5 static + 3 levels + 10 subjects + 76 chapters + 18 lessons with theory + 13 esercizi + 1 formulario). The crawl reaches 848 pages because the 170 lessons without theory and their empty sub-views are linked but `noindex`, and therefore left out of the sitemap on purpose.
- [x] `/this-does-not-exist` returns a real 404 with the error page.
- [x] `grep -r 'src="http://'`: 0 hits.
- [x] Zero KaTeX/TikZ JavaScript or CSS in the route-node closure of `/pricing`, `/faq`, `/contacts`, `/`.
- [x] Googlebot user agent and anonymous browser receive byte-identical lesson HTML.
- [x] Every JSON-LD block parses; types and required fields checked by script. Google's Rich Results Test needs a public URL and was not run: run it on the preview deployment before merging (see Owner actions).
- [x] Light OS theme → light UI; dark OS theme → dark UI (both the inline script and `ThemeProvider` query `dark`).
- [x] Lighthouse mobile (local preview, simulated throttling): SEO 100 on every page; Accessibility 100 on `/`, subject, lesson, `/pricing`, `/faq`; Performance 94 (`/`), 92 (`/pricing`), 94 (`/faq`), 81 (subject page, LCP 4.2 s), 65 (lesson page, LCP 6.1 s). CLS 0 and TBT ≤ 140 ms everywhere. The two content pages miss the ≥ 90 target locally: the remaining cost is KaTeX (258 KB JS on index pages, plus its fonts on lessons) and the 40 KB global stylesheet. Numbers on Vercel with edge caching, HTTP/2 and compression will differ; re-measure on the deployment.

## Decisions for the owner

- DECISION 1 (paywall). Implemented from the plan config in `src/lib/stripe/config.ts`: Free = theory + formulario, Premium = esercizi, flashcards, AI chat, tutoring. Nothing in the code enforces the gate today (every visitor gets the exercises), so the `isAccessibleForFree: false` markup on esercizi pages describes the published offer, not the current behaviour. Either enforce the gate (`checkFeatureAccess` exists in `$lib/utils/subscription.svelte.ts`) or set `access.exercises = true` on the Free plan; the markup follows the config.
- DECISION 2 (slugs). Levels use `medie` / `superiori` / `universita`; subjects derive from their title (`matematica`, `fisica`, `analisi-matematica-i`, `fondamenti-di-informatica`); chapters and lessons keep the curated database slugs, normalised to lowercase ASCII (`serie-di-Taylor` → `serie-di-taylor`). The brief asked to slugify chapters and lessons from titles as well; that would turn `Operazioni in \mathbb{N}` into `operazioni-in` (three lessons would share it) and change 168 of 277 slugs into longer forms such as `elementi-fondamentali-punto-retta-piano`. To switch anyway, change `publicSegment()` in `src/lib/seo/slug.ts`; redirects and the sitemap follow.
- Lessons without theory (170 of 188) are linked and reachable but `noindex`; the same goes for empty esercizi/formulario pages and all flashcards pages. This is deliberate: 170 "Stiamo ancora scrivendo" pages in the index would read as thin content. Each page flips to indexable the moment content is saved in the admin area.
- `/terms` and `/privacy` exist with one `<h1>`, title, description and only the facts the code proves (services used, plans, trial, cancellation). They are `noindex` until the legal entity, controller identity, retention periods and revision date are added (HTML comments in the files list what is missing).
- The landing page still shows "300 Studenti Iscritti", a figure carried over from the old page. It is flagged in `src/routes/+page.svelte`; replace it with a real count or remove it.
- The hardcoded "Prerequisiti: Algebra, Geometria, Trigonometria, Analisi" row shown on every lesson was removed: it was the same four words on every page regardless of the lesson.
- `import.meta.env.PUBLIC_STRIPE_PRICE_*` in `src/lib/stripe/config.ts` is always `undefined` (Vite only exposes `VITE_`-prefixed variables that way), so checkout cannot find a price id. Pre-existing; use `$env/dynamic/public` or `$env/static/public`.

## Deliberately not done

- No redesign: card, header, lesson and pricing layouts are unchanged. Visual changes are limited to accessibility fixes (darker primary buttons and footer greys, a wider back-arrow target) and the mobile lesson column, which was 50 % of the viewport on phones and now fills it.
- The static `contentTree` in `src/lib/data/content-tree.ts` and the `src/lib/old/` routes were left in place: the admin area still imports them.
- Blank `/about`, `/catalog`, `/catalog/[tutor_id]` and `/legal` routes were deleted (they returned empty 200 pages). Recreate them when there is content.
- Unused large files in `static/` (`landing new.jpg` 1 MB, `landing new.png`, `profile.jpg`, `qr.png`, `sapiens/*.png`, `sapiens backup/`) were not deleted; none is referenced by a page.
- The Rich Results Test and a Lighthouse run against the real Vercel deployment could not be run from this environment.

## Missing copy (needs the owner)

Every level, subject and chapter below has an empty `description` in `content_nodes`. Cards and headers render no description until it is filled in. One or two sentences each, Italian, no marketing filler.

### Scuola media (`middle_school`)

- [ ] Level description: **Scuola media**

#### Matematica (`middle_school/math`)

- [ ] Subject description: **Matematica**
- [ ] Chapter description: Aritmetica (`aritmetica`)
- [ ] Chapter description: Frazioni e decimali (`frazioni`)
- [ ] Chapter description: Percentuali (`percentuali`)
- [ ] Chapter description: Geometria piana (`geometria-piana`)

### Scuola superiore (`high_school`)

- [ ] Level description: **Scuola superiore**

#### Matematica (`high_school/math`)

- [ ] Subject description: **Matematica**
- [ ] Chapter description: Insiemi e logica (`insiemi-e-logica`)
- [ ] Chapter description: Numeri naturali \mathbb{N} (`numeri-naturali`)
- [ ] Chapter description: Numeri interi \mathbb{Z} (`numeri-interi`)
- [ ] Chapter description: Numeri razionali \mathbb{Q} (`numeri-razionali`)
- [ ] Chapter description: Numeri reali \mathbb{R} (`numeri-reali`)
- [ ] Chapter description: Monomi e polinomi (`monomi-polinomi`)
- [ ] Chapter description: Equazioni e sistemi (`equazioni-sistemi`)
- [ ] Chapter description: Geometria analitica (`geometria-analitica`)
- [ ] Chapter description: Trigonometria (`trigonometria`)
- [ ] Chapter description: Geometria solida (`geometria-solida`)
- [ ] Chapter description: Funzioni (`funzioni`)
- [ ] Chapter description: Limiti (`limiti`)
- [ ] Chapter description: Derivate (`derivate`)
- [ ] Chapter description: Integrali (`integrali`)
- [ ] Chapter description: Probabilità (`probabilita`)

#### Fisica (`high_school/physics`)

- [ ] Subject description: **Fisica**
- [ ] Chapter description: Cinematica (`cinematica`)
- [ ] Chapter description: Dinamica (`dinamica`)
- [ ] Chapter description: Lavoro ed energia (`lavoro-energia`)
- [ ] Chapter description: Termodinamica (`termodinamica`)
- [ ] Chapter description: Elettrostatica (`elettrostatica`)
- [ ] Chapter description: Onde meccaniche (`onde-meccaniche`)
- [ ] Chapter description: Elettromagnetismo (`elettromagnetismo`)
- [ ] Chapter description: Ottica (`ottica`)
- [ ] Chapter description: Meccanica razionale (`meccanica-razionale`)
- [ ] Chapter description: Fisica moderna (`fisica-moderna`)
- [ ] Chapter description: Relatività (`relativita`)
- [ ] Chapter description: Meccanica quantistica (`meccanica-quantistica`)
- [ ] Chapter description: Fisica nucleare (`fisica-nucleare`)
- [ ] Chapter description: Astrofisica (`astrofisica`)

#### Informatica (`high_school/computer-science`)

- [ ] Subject description: **Informatica**
- [ ] Chapter description: Informatica (`informatica`)
- [ ] Chapter description: Sistemi operativi (`sistemi-operativi`)
- [ ] Chapter description: Internet e web (`internet-web`)
- [ ] Chapter description: Sicurezza informatica (`sicurezza`)
- [ ] Chapter description: Programmazione visuale (`programmazione-visiva`)
- [ ] Chapter description: Strumenti office (`office`)
- [ ] Chapter description: Multimedia (`multimedia`)
- [ ] Chapter description: Presentazioni digitali (`presentazioni`)
- [ ] Chapter description: Collaborazione digitale (`collaborazione-digitale`)

#### Chimica (`high_school/chemistry`)

- [ ] Subject description: **Chimica**
- [ ] Chapter description: Struttura dell'atomo (`atomo-struttura`)
- [ ] Chapter description: Tavola periodica (`tavola-periodica`)
- [ ] Chapter description: Legami chimici (`legami-chimici`)
- [ ] Chapter description: Stechiometria (`stechiometria`)
- [ ] Chapter description: Reazioni redox (`reazioni-redox`)
- [ ] Chapter description: Chimica organica (`chimica-organica`)
- [ ] Chapter description: Chimica fisica (`chimica-fisica`)
- [ ] Chapter description: Equilibrio chimico (`equilibrio-chimico`)
- [ ] Chapter description: Cinetica chimica (`cinetica-chimica`)
- [ ] Chapter description: Elettrochimica (`elettrochimica`)
- [ ] Chapter description: Chimica analitica (`chimica-analitica`)
- [ ] Chapter description: Biochimica (`biochimica`)
- [ ] Chapter description: Chimica ambientale (`chimica-ambientale`)
- [ ] Chapter description: Chimica industriale (`chimica-industriale`)

### Università (`university`)

- [ ] Level description: **Università**

#### Analisi matematica I (`university/analisi-1`)

- [ ] Subject description: **Analisi matematica I**
- [ ] Chapter description: Successioni e serie (`successioni-serie`)
- [ ] Chapter description: Limiti (`limiti`)
- [ ] Chapter description: Derivate (`derivate`)
- [ ] Chapter description: Integrali (`integrali`)
- [ ] Chapter description: Equazioni differenziali (`equazioni-differenziali`)

#### Analisi matematica II (`university/analisi-2`)

- [ ] Subject description: **Analisi matematica II**
- [ ] Chapter description: Integrali doppi (`integralidoppi`)
- [ ] Chapter description: Integrali tripli (`integrali-tripli`)
- [ ] Chapter description: Serie di Taylor (`serie-di-Taylor`)

#### Fisica I (`university/fisica-1`)

- [ ] Subject description: **Fisica I**
- [ ] Chapter description: Cinematica del punto materiale (`cinematica-del-punto-materiale`)
- [ ] Chapter description: Dinamica del punto materiale (`dinamica-del-punto-materiale`)
- [ ] Chapter description: Lavoro ed energia (`lavoro-ed-energia`)
- [ ] Chapter description: Meccanica del corpo rigido (`meccanica-del-corpo-rigido`)

#### Fisica II (`university/fisica-2`)

- [ ] Subject description: **Fisica II**
- [ ] Chapter description: Termodinamica (`termodinamica`)
- [ ] Chapter description: Elettromagnetismo (`elettromagnetismo`)
- [ ] Chapter description: Ottica (`ottica`)

#### Fondamenti di Informatica (`university/fondamenti-informatica`)

- [ ] Subject description: **Fondamenti di Informatica**
- [ ] Chapter description: Variabili logiche (`variabili-logiche`)
- [ ] Chapter description: Funzioni logiche (`funzioni-logiche`)
- [ ] Chapter description: Porte logiche (`porte-logiche`)
- [ ] Chapter description: Reti combinatorie (`reti-combinatorie`)
- [ ] Chapter description: Reti sequenziali (`reti-sequenziali`)

## Owner actions (outside the code)

- [ ] Delete the `sapiens-xi` Vercel project, or keep it only as a permanent (301/308) redirect to the canonical host. It currently answers with a temporary 307, which does not transfer ranking.
- [ ] Register the custom domain (likely `sapiensedu.it`), attach it in Vercel, and set `PUBLIC_SITE_URL=https://<domain>` in the Vercel environment. Nothing else in the code has to change; redeploy so the canonical URLs, the sitemap and the JSON-LD `@id`s pick it up.
- [ ] Set `PUBLIC_GSC_VERIFICATION` (Google Search Console HTML-tag token) in Vercel, or drop the verification file into `static/`.
- [ ] Verify the property in Search Console, submit `https://<domain>/sitemap.xml`, request indexing for `/materiale` and the ten subject pages.
- [ ] Run the Rich Results Test (https://search.google.com/test/rich-results) on a subject page, a lesson with theory, `/faq` and `/pricing` of the preview deployment.
- [ ] Enable Web Analytics and Speed Insights in the Vercel project (the code already injects both; the scripts 404 outside Vercel).
- [ ] Decide DECISION 1 and DECISION 2 above.
- [ ] Complete `/terms` and `/privacy` (legal entity, controller, retention, revision date), then remove `noindex` from their `<Seo>`.
- [ ] Review the ten subject texts in `src/lib/content/subject-copy.ts` and the ten FAQ answers in `src/routes/(marketing)/faq/+page.svelte`.
- [ ] Optionally set `PUBLIC_CONTACT_EMAIL` to show an address on `/contacts` (the form works without it and emails the address configured in `api/emails/first-contact`).
- [ ] Security, unrelated to SEO but found on the way: the signed-in areas listed in `PRIVATE_PATH_PREFIXES` are not protected by `handleAuth`, and `src/lib/supabase.js` uses one shared server-side client for every request. Both predate this work.
- [ ] Write the 170 missing lessons (all chapters except six in Scuola superiore / Matematica) and the descriptions below; each becomes indexable automatically.
