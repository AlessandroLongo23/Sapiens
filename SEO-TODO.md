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
- [x] Task 7 — `/materiale/<livello>/<materia>/<capitolo>/<lezione>`, every segment from the node title (see Round 2); sub-views `esercizi`, `formulario`, `flashcards`. One utility (`$lib/seo/slug.ts`) generates and resolves every URL for the router, the sitemap, the cards, the menu and the redirects. Every `/wiki/...` path 301s to its new equivalent (`hooks.server.js`); unknown ones 404. Non-canonical spellings (database slugs, upper case) 301 to the canonical path.
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
- [x] Crawl from `/` (linkinator, recursive, re-run after round 2): 850 distinct pages, 0 broken links: 90 index pages (1 + 3 + 10 + 76), 188 lessons, 188 × esercizi/formulario/flashcards, 8 marketing and legal pages.
- [x] No `<button>` or `<div onclick>` navigation between content pages.
- [x] `/wiki`, `/wiki/high_school`, `/wiki/high_school/math`, `/wiki/.../theory`, `/wiki/.../exercises`, `/wiki/university/analisi-2/serie-di-Taylor` all answer 301 to the Italian URL; `/wiki/nope/nope` answers 404.
- [x] No `sapiens-xi` string in source or build.
- [x] `rel="canonical"` absolute and self-referencing on every route (from `SITE_URL`).
- [x] `/robots.txt` 200 `text/plain`; `/sitemap.xml` 200 `application/xml` with 129 URLs (8 static + 3 levels + 10 subjects + 76 chapters + 18 lessons with theory + 13 esercizi + 1 formulario). The crawl reaches 850 pages because the 170 lessons without theory and their empty sub-views are linked but `noindex`, and therefore left out of the sitemap on purpose.
- [x] `/this-does-not-exist` returns a real 404 with the error page.
- [x] `grep -r 'src="http://'`: 0 hits.
- [x] Zero KaTeX/TikZ JavaScript or CSS in the route-node closure of `/pricing`, `/faq`, `/contacts`, `/`.
- [x] Googlebot user agent and anonymous browser receive byte-identical lesson HTML.
- [x] Every JSON-LD block parses; types and required fields checked by script. Google's Rich Results Test needs a public URL and was not run: run it on the preview deployment before merging (see Owner actions).
- [x] Light OS theme → light UI; dark OS theme → dark UI (both the inline script and `ThemeProvider` query `dark`).
- [x] Lighthouse mobile (local preview, simulated throttling): SEO 100 on every page; Accessibility 100 on `/`, subject, lesson, `/pricing`, `/faq`; Performance 94 (`/`), 92 (`/pricing`), 94 (`/faq`), 81 (subject page, LCP 4.2 s), 65 (lesson page, LCP 6.1 s). CLS 0 and TBT ≤ 140 ms everywhere. The two content pages miss the ≥ 90 target locally: the remaining cost is KaTeX (258 KB JS on index pages, plus its fonts on lessons) and the 40 KB global stylesheet. Numbers on Vercel with edge caching, HTTP/2 and compression will differ; re-measure on the deployment.

## Decisions for the owner (round 1, now resolved)

The owner answered on 2026-09-03; the outcome of each point is in "Round 2" below.

- DECISION 1 (paywall): enforce it, with an in-place upgrade card instead of a redirect. Done.
- DECISION 2 (slugs): one readable convention for every node type. Done: every segment derives from the title.
- Lessons without theory: keep them visible. They were never hidden; they stay linked, reachable and `noindex` until text exists.
- `/terms` and `/privacy`: rewritten after reading the Lume implementation and the rules for minors. Indexable now; the legal identity fields still need the owner (see Owner actions).
- "300 Studenti Iscritti": replaced by content counts from the database. Switch to student numbers later (see `ROADMAP.md`).
- Mobile-first, gamification, short videos, native apps: logged in `ROADMAP.md`.

## Round 2 (2026-09-03): owner decisions applied

### Slugs: one convention for everything

- Every URL segment is the node's title, slugified (`src/lib/seo/slug.ts`): `/materiale/scuola-superiore/matematica/insiemi-e-logica/prime-definizioni`, `/materiale/universita/analisi-matematica-1/limiti/definizione-di-limite-di-funzione`. Rules: LaTeX resolved to text, parentheticals dropped (`Triangoli (classificazione e proprietà)` → `triangoli`), apostrophes become hyphens (`struttura-dell-atomo`), a trailing roman numeral becomes a digit (`analisi-matematica-1`, `fisica-2`), and a blackboard-bold set letter is kept only when the title does not already name the set (`operazioni-in-n`, but `numeri-naturali`). Checked against all 277 nodes: no two siblings share a slug; the longest path is 102 characters.
- The database `slug` column is now an internal key only (exercise configs, redirects). A URL typed with database slugs still resolves and answers 301 to the canonical one; every `/wiki/...` path still redirects.
- Renaming a title moves the page. `PATH_ALIASES` in `slug.ts` takes `old path → new path` entries and the hook answers 301 for them (and for their sub-views), so old links keep working after a rename.
- `medie` / `superiori` / `universita` are gone from URLs (they were never deployed); `levelShort` in `meta.ts` still uses the short forms inside `<title>` only.

### Paywall, enforced

- Auth moved to cookie sessions (`@supabase/ssr`): `hooks.server.js` builds one Supabase client per request and validates the session with Supabase Auth, so server loads and API routes finally see who is asking. Before, the server used one shared client with no cookie access and `locals.user` was always null in production (which is also why `/admin` bounced every login).
- The subscription lives in `auth.users.app_metadata.subscription` (`plan`, `status`, Stripe ids, `trialUsedAt`), written only by the Stripe webhook with the service role. The old `user_metadata.subscription_plan` was editable by the user through the Supabase client, so it could not gate anything. `$lib/auth/entitlements.ts` is the only place that decides who gets what; `app_metadata.role = 'admin'` bypasses every gate and is required for `/admin`.
- Exercises (`.../esercizi`): rendered per request (no ISR: `config.isr = false` on that page only), generated only when the plan includes them. Otherwise the page shows the upgrade card over a blurred, inert preview of the start screen. The page stays indexable when a generator exists, with `isAccessibleForFree: false` and `hasPart` on `#esercizi` as before, and Googlebot sees the same HTML as any anonymous visitor.
- Sapiens AI: `/api/chat` answers 401 without a login and 403 without the Base plan; the sidebar shows the compact upgrade card in both cases. Flashcards have no content yet, so they keep the "in arrivo" screen; the gate is a two-line addition when they exist.
- The upgrade card (`Paywall.svelte`): the plan that includes the feature, one true sentence about what it does, the other features of that plan, price, "7 giorni gratis, senza carta", one button. Anonymous visitors get the login/registration modal first and the checkout continues on its own; the Stripe success page polls `/api/me` until the webhook has written the plan, refreshes the session and sends the student back to the page they came from. No timers, no fake counters, a plain "Torna alla teoria" link.
- Checkout fixes on the way: the pricing page sent `plan` while the API read `planId`; success and cancel URLs pointed to `/student/...`, which never existed; the price ids came from `import.meta.env` and were always undefined (now `$env/dynamic/public`); the 7-day trial "senza carta" promised on the pricing page was not configured in Stripe (now `trial_period_days` + `payment_method_collection: 'if_required'`, once per account); the semester toggle charged the monthly price (now optional `PUBLIC_STRIPE_PRICE_*_SEMESTER` ids; the toggle appears only when they exist); `/api/stripe/portal` did not exist (it does now). Duplicate `(student)/subscription/success|cancel` routes were removed.
- Residual: the exercise generators are client-side JavaScript chunks, so a determined person can fetch and run them with developer tools. Moving generation to an API is the next step if that ever matters.

### Landing counters

- "300 Studenti Iscritti" is gone. The hero shows Materie, Capitoli and Lezioni pubblicate, all from the database; the last one counts lessons with theory text, so it never overstates what exists and grows on every save.

### Legal pages and cookies (from the Lume implementation, adapted to a consumer service used by minors)

- `src/lib/config/legal.ts`: legal identity (name from `PUBLIC_LEGAL_NAME`, address, VAT and privacy email from env, empty fields not rendered), document versions (`LEGAL_VERSIONS`), the list of processors. Lume kept the same things in `src/lib/const/legal.ts` and `legalVersions.ts`.
- `/privacy`: controller, no-DPO statement with the art. 37 reasoning, a table of data / purpose / legal basis / retention for every processing the code performs, a section on minors (14 years, art. 2-quinquies Codice privacy: a parent creates the account below that age), processors table with transfer safeguards, security, rights with the one-month deadline and the Garante, no automated decisions, versioning.
- `/terms`: written for consumers, many of them minors, which Lume's B2B terms could not be: age rule at signup, free content without an account, prices and premium features read from the plan config, trial once per account and what happens when it ends, automatic renewal with 30 days' notice on price changes, 14-day right of withdrawal with full refund of the first charge (Lume excluded it, which is lawful only for VAT-registered customers), cancellation from the Stripe portal, content licence, Sapiens AI disclaimer, Pro tutoring hour, availability, liability within art. 1229 c.c., Italian law and the consumer's own court. No EU ODR link: the platform was shut down in July 2025.
- `/cookie`: the actual cookies and storage (`sb-…-auth-token`, `sapiens-cookie-consent`, `theme` in localStorage), Vercel Analytics without cookies, Stripe on its own domain, a "Gestisci cookie" button.
- Signup asks for two explicit confirmations (terms and privacy read; at least 14 years old or a parent creating the account) and records the document versions and a timestamp in `user_metadata.legal`. Lume records acceptances in a dedicated table with IP and user agent; that upgrade is in `ROADMAP.md`.
- Cookie banner (`CookieBanner.svelte`, same shape as Lume's): a floating card at the bottom, Personalizza / Rifiuta / Accetta with equal weight, analytics off by default in the custom view, the choice stored six months in a first-party cookie with the policy version (a refusal too), re-asked on version bump, reopened from the footer link on every page. Improved over Lume: focus moves into the card and back, Escape closes it once a choice exists, `prefers-reduced-motion` is respected, and, the part Lume got wrong, Vercel Analytics and Speed Insights are imported only after consent (`$lib/consent/analytics.ts`); nothing analytics-related is in the HTML before that.

### End-to-end tests (`npm run test:e2e`, added 2026-09-06)

- Playwright against the production build, the Stripe sandbox and the real Supabase project with throwaway users (`tests/e2e/`). Ten tests, about a minute: public pages, redirects, sitemap, robots, auth bounces, cookie banner with analytics gated; then the whole Premium path with a fresh account: upgrade card, login, Checkout with the trial, webhook, `plan: lite, status: trialing` in `app_metadata`, exercises unlocked and answered to the summary, Sapiens AI refused for Lite (403), cancellation at period end from the portal. The suite refuses a live Stripe key.
- Two bugs it found on the first run, both fixed: four older exercise generators produced questions with no answer buttons on the public page (they never filled `options`), and at laptop widths the row of four answers slid under the lesson sidebar and could not be clicked.
- The manual run by the owner on 2026-09-06 (registration with email confirmation, Checkout, activation) also passed; the local server needs `NODE_OPTIONS=--max-http-header-size=131072` because localhost cookies from every local project add up past Node's 16 KB default.

### Verification (production build, `npm run build && npm run preview`)

- [x] Build and the placeholder check pass (277 nodes). svelte-check: 223 errors / 12 warnings, all in pre-existing files (254 at the start of the round; the touched files are clean).
- [x] New URLs answer 200; database-slug, upper-case and `/wiki` spellings answer 301 to the title-derived path; an unknown segment answers 404.
- [x] Crawl: 850 pages, 0 broken links.
- [x] Anonymous request to an esercizi page: one upgrade card, "piano Lite", "7 giorni gratis, senza carta", `inert` preview, `index, follow`, `isAccessibleForFree: false`, `cssSelector: #esercizi`. Theory pages carry no card. `/subscription`, `/home`, `/admin` answer 303 to `/` without a session; `/api/me` returns `{user: null}`; `/api/chat` answers 401; `/api/stripe/checkout` answers 401 with `login_required`.
- [x] Vercel output: the esercizi route is a plain function; theory, formulario, flashcards and index pages keep the ISR function.
- [x] `/privacy`, `/terms`, `/cookie`: one `<h1>`, indexable, in the sitemap (129 URLs). No banner markup and no analytics script in the server HTML.
- [ ] Not verifiable here: a real Stripe checkout and webhook round trip, and Supabase Auth email confirmation. Both need the keys and a deployment (see Owner actions).

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
- [ ] Enable Web Analytics and Speed Insights in the Vercel project. They load only after a visitor accepts statistics in the cookie banner, so expect lower counts than page views.
- [ ] Legal identity: set `PUBLIC_LEGAL_NAME` (defaults to "Alessandro Longo"), `PUBLIC_LEGAL_ADDRESS`, `PUBLIC_LEGAL_VAT` and `PUBLIC_PRIVACY_EMAIL` in Vercel, and confirm the legal form. Read `/privacy` and `/terms` once: they state the refund and withdrawal rules the code and the law imply; change the copy if you want different ones.
- [x] Supabase (done 2026-09-04 through the Management API): `app_metadata.role = "admin"` set on `longoa02@gmail.com`; auth `site_url` changed from `http://localhost:3000` to `https://sapiens-edu.vercel.app` (confirmation emails linked to localhost before) and the redirect allow list set to the production host plus `localhost:4173/5173`; the legacy `service_role` key is in Vercel for all environments. Email confirmation stays on (`mailer_autoconfirm: false`); the signup modal handles it.
- [x] Stripe live, account "Sapiens" (`acct_1UBjw0Gz1GL8Gd5e`, Denmark, individual, MCC 8299, created 2026-09-04 during activation): products Sapiens Lite / Base / Pro with monthly prices (4,99 / 19,99 / 59,99 €) and six-month prices at five monthly amounts (24,95 / 99,95 / 299,95 €), tax-inclusive, tax code `txcd_10000000`, lookup keys `sapiens_<plan>_monthly|semester`. Ids are in Vercel Production as `PUBLIC_STRIPE_PRICE_*` and `PUBLIC_STRIPE_PRICE_*_SEMESTER`, so the semester toggle is live. The same products, prices and a webhook were first created in the older account "New business" (`acct_1QWnOJBX6jVQ5bX2`) before the new account existed; they are orphaned there and can be archived or the account closed.
- [x] Stripe live webhook `we_1UCdnmGz1GL8Gd5e79jlqEed` on `https://sapiens-edu.vercel.app/api/stripe/webhook`, API version 2026-08-26.dahlia, nine events; its secret is in Vercel Production as `STRIPE_WEBHOOK_SECRET` (sensitive).
- [ ] Finish "Activate Payments" for the Sapiens account: on 2026-09-04 Stripe still listed as due the legal name, date of birth, home address, phone, a bank account and the terms acceptance (`charges_enabled: false`). The default currency is DKK; add a EUR bank account if you have one, since every price is in EUR. Until this is complete, Checkout returns an error in live mode.
- [x] Stripe sandbox for Preview and Development (`acct_1UBX5sPzIzktCGlH`, same products and prices): its publishable key, secret key, price ids and CLI webhook secret are in Vercel for `preview` and `development`. The webhook round trip was run locally against it on 2026-09-04 (subscription created → `plan: lite, status: trialing` in `app_metadata` within a second; canceled → `plan: free, status: canceled`). The sandbox is unclaimed and expires on 2026-09-10 unless claimed from the Dashboard (`stripe sandbox claim`); its secret key was printed once in the setup session, so roll it after claiming.
- [ ] Stripe live key for Production, from the Sapiens account: create a restricted key in the Dashboard (Developers → API keys, live mode, Create restricted key) with Checkout Sessions, Customers, Subscriptions and Customer portal set to Write and everything else None; put it in the local `.env` as `STRIPE_SECRET_KEY_LIVE` and it gets pushed to Vercel as a sensitive variable. The existing Production `STRIPE_SECRET_KEY` in Vercel belongs to an older account and is replaced. `PUBLIC_STRIPE_PUBLISHABLE_KEY` is not read by any code any more; the stale production entry was removed.
- [x] `PUBLIC_STRIPE_PRICE_*` were undefined on the live site since the beginning (`import.meta.env`); fixed in code and the values now exist in Vercel. The old `STRIPE_PRICE_*` variables (no `PUBLIC_` prefix) are unused and can be deleted from the Vercel project.
- [ ] Merge `seo-overhaul` into `master` to deploy: the Vercel project builds `master` from the GitHub repo `AlessandroLongo23/Sapiens`. Then one real checkout with your own card (the trial charges nothing) to confirm the live webhook.
- [ ] Review the ten subject texts in `src/lib/content/subject-copy.ts` and the ten FAQ answers in `src/routes/(marketing)/faq/+page.svelte`.
- [ ] Optionally set `PUBLIC_CONTACT_EMAIL` to show an address on `/contacts` (the form works without it and emails the address configured in `api/emails/first-contact`).
- [x] Security: the signed-in areas are now behind `handleAuth` (`requiresLogin` in `site.ts`), and auth uses a per-request cookie client. The shared anonymous client in `src/lib/supabase.js` is still used for public content reads, which is what it is for.
- [ ] Watch the Vercel function count: esercizi pages run per request now (one function, cheap), everything else under `/materiale` stays on ISR.
- [ ] Write the 170 missing lessons (all chapters except six in Scuola superiore / Matematica) and the descriptions below; each becomes indexable automatically.
