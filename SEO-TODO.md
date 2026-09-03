# SEO-TODO — Sapiens

Running record of the SEO / crawlability / content overhaul. Ticked items are done in code on this branch.
Everything under "Owner actions" and "Missing copy" needs a human.

Recon findings (2026-09-03):

- Content tree lives in the Supabase table `content_nodes` (277 nodes: 3 levels, 10 subjects, 76 chapters, 188 lessons). The in-code copy in `src/lib/data/content-tree.ts` is stale and only used by the admin area, the search overlay and the landing counter.
- No node has a `description`. 18 lessons have theory text (all in Scuola superiore / Matematica); 1 has a formulary (a test stub).
- Every page shipped the whole table, theory text included, in its HTML (about 300 KB per page).
- `/wiki/high_school/math` had 9 links; all cards were `<button>` + `goto()`.
- `/faq`, `/contacts`, `/about`, `/catalog`, `/legal` were 0-byte route files rendering blank pages with HTTP 200; `/terms` and `/privacy` did not exist; `+error.svelte` was empty.
- `sapiens-xi.vercel.app` already 307-redirects to `sapiens-edu.vercel.app`, but `app.html` still pointed `og:url` / `og:image` at it.
- `robots.txt` and `sitemap.xml` returned 404.

## Phase 1 — Credibility blockers

- [ ] Task 1 — Remove every Lorem ipsum; render nothing when a description is empty; build-time guard
- [ ] Task 2 — `/faq`, `/contacts`, `/terms`, `/privacy`, `/pricing`: one `<h1>`, unique title and description, Italian
- [ ] Task 3 — Replace the `Nodo - Sapiens` title with per-node-type templates
- [ ] Task 4 — Per-node-type meta descriptions (no copied boilerplate)
- [ ] Task 5 — Fix the inverted `prefers-color-scheme` query

## Phase 2 — Crawlability

- [ ] Task 6 — Every navigating card is a real `<a href>` in the server-rendered HTML
- [ ] Task 7 — Italian URL scheme under `/materiale`, centralized slug utility, 301s from `/wiki/...`
- [ ] Task 8 — No `sapiens-xi` reference in the codebase
- [ ] Task 9 — Linked breadcrumbs + `BreadcrumbList` JSON-LD
- [ ] Task 10 — `robots.txt` and content-driven `sitemap.xml`

## Phase 3 — Metadata and structured data

- [ ] Task 11 — `src/lib/config/site.ts`, `SITE_URL` from `PUBLIC_SITE_URL`, `.env.example`
- [ ] Task 12 — Single `<title>`; reusable `<Seo>` with canonical, robots, Open Graph, Twitter card
- [ ] Task 13 — JSON-LD: Organization + WebSite, Course, LearningResource, FAQPage, Offer, BreadcrumbList
- [ ] Task 14 — Paywall marking (`isAccessibleForFree` / `hasPart`), Googlebot sees what anonymous users see
- [ ] Task 15 — `noindex` (meta + `X-Robots-Tag`) on authenticated, checkout and API routes
- [ ] Task 16 — `PUBLIC_GSC_VERIFICATION` meta, Vercel Analytics, Speed Insights

## Phase 4 — Performance and assets

- [ ] Task 17 — Drop global TikZJax / KaTeX CDN tags; self-host KaTeX; lazy TikZ component
- [ ] Task 18 — Plain-text titles for `<title>`, descriptions, sitemap, breadcrumbs, JSON-LD; `aria-label` on rendered math
- [ ] Task 19 — Favicon set, `og-image.jpg`, responsive hero image, per-node data loading
- [ ] Task 20 — Static/edge rendering for public content, self-hosted fonts

## Phase 5 — Content and conversion

- [ ] Task 21 — Subject-page copy and contextual internal links
- [ ] Task 22 — Accessibility pass

## Phase 6 — Verification

- [ ] Verified against the built output (see the checklist in the final report)

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

- [ ] Delete the `sapiens-xi` Vercel project, or keep it only as a permanent (308/301) redirect to the canonical host. It currently answers with a temporary 307.
- [ ] Register the custom domain (likely `sapiensedu.it`), attach it in Vercel, and set `PUBLIC_SITE_URL=https://<domain>` in the Vercel environment. Nothing else in the code needs to change.
- [ ] Set `PUBLIC_GSC_VERIFICATION` (Google Search Console HTML-tag verification) in Vercel, or drop the verification file into `static/`.
- [ ] Verify the property in Search Console, submit `/sitemap.xml`, request indexing for `/materiale` and the subject pages.
- [ ] Enable Vercel Web Analytics and Speed Insights in the Vercel project (the code already injects both).
