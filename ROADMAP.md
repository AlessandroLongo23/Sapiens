# Sapiens roadmap

Ideas and decisions that should outlive a single chat. Written 2026-09-03, on branch `seo-overhaul`,
from the owner's notes on mobile-first, gamification, short videos and native apps. Nothing here is
built yet unless it says so. `SEO-TODO.md` tracks what was done in the SEO overhaul.

## Direction

Sapiens should work best on the device the student has in hand. Today that is a phone: the app is
opened between lessons, on the bus, five minutes before a test. The desktop web app stays the place
for long study sessions, like Notion on a laptop. Both read the same content, the same account and
the same progress, so switching devices costs nothing.

The order that keeps the codebase small: make the web app mobile-first, ship it as an installable PWA,
then wrap the same code with Capacitor for the stores. Capacitor for Android is already in
`package.json` (`npm run build:mobile`); a native rewrite would mean a second content pipeline and a
second paywall, and is not worth it before the product has proven retention.

## Now (this branch)

- Public library at `/materiale/...` with title-derived URLs, sitemap, structured data.
- Cookie-based auth, subscription claim written by Stripe into `app_metadata`, exercises and Sapiens AI
  gated server-side, one-click upgrade from the locked view (login, trial without card, back to the page).
- Cookie banner with consent-gated analytics, privacy and terms written for a consumer service used by
  minors.

## Next: mobile-first layout

The current layout was designed on a laptop. Before any new feature, a pass over the phone experience:

1. Lesson page: the fixed 25% side columns are hidden below `lg`, so the table of contents and Sapiens AI
   do not exist on a phone. Move them into a bottom sheet (contents) and a floating button (AI).
2. Bottom navigation on phones: Materiale, Cerca, Allenati (exercises), Account. The header mega menu
   is a desktop pattern.
3. Exercise screen: answers are already a 2-column grid on small screens; check tap targets (44 px)
   and one-hand reach for the answer buttons.
4. Reading: 16 px minimum body text, formulas that scroll horizontally inside their own box, no
   layout shift when KaTeX fonts land.
5. Measure with Lighthouse mobile on the deployment and with real devices (an old Android is the
   reference, not an iPhone 16).

## Next: installable PWA

`static/site.webmanifest` and the icon set exist. Missing: a service worker that caches the app shell
and the last lessons read, so a lesson opens with no signal; an "Installa Sapiens" prompt shown after
the second visit, not the first. SvelteKit's `$service-worker` module is enough; no library needed.

## Gamification (Duolingo-style practice)

What exists: fifteen exercise generators that produce a different exercise every time, with
immediate correction, and a progress bar per session. That is already the core of a daily practice
loop. To turn it into a habit:

- Daily session: five questions drawn across the chapters the student has opened, two minutes, one
  tap to start from the home screen.
- Streaks and XP stored per user (a `practice_sessions` table: user, lesson, correct, total, date).
  Streak logic runs on the server so it cannot be faked.
- Reminders: web push (needs the service worker above) and native push through Capacitor. Ask for
  permission only after the first completed session, with a clear reason ("Ti ricordo la sessione di
  domani alle 18?").
- Spaced repetition for flashcards once they exist: the lesson content model needs a `flashcards`
  field (question, answer) next to `theory` and `formulary`.
- Keep it honest: no fake leaderboards, no "3 friends are ahead of you" when there are no friends.
  Leagues only when there are enough active users to fill one.

## Micro-learning videos

Vertical, 30 seconds to 2 minutes, one concept each, linked to the lesson they explain.

- Content: start from the 18 published lessons, one video per key idea, script first (the script is
  also the transcript, good for search and accessibility).
- Hosting: not Supabase storage. Use a video CDN with adaptive streaming and a vertical player
  (Mux, Bunny Stream or Cloudflare Stream all work with a signed URL, which is how the Premium gate
  would apply if videos become a paid feature).
- Product: a "Ripassa in 60 secondi" feed on the phone, swipe up for the next concept, a button that
  opens the full lesson. Videos on the lesson page on desktop.
- Measure completion rate per video; a concept nobody finishes needs a new script, not a longer video.

## Native apps

When retention on the PWA justifies it: Capacitor builds for Android (configured) and iOS (to add),
same SvelteKit bundle, plus native push, app-store billing rules (Apple requires in-app purchase for
digital subscriptions sold inside the iOS app; the web checkout cannot be linked from the iOS app),
and deep links from `sapiens.../materiale/...` into the app.

## Legal and account features still open

- Parental consent flow for students under 14: today the parent creates the account and confirms it
  at signup. A stronger flow sends the parent an email with a confirmation link before the account is
  usable. Needed before any feature that collects more than email and name from students.
- Self-service data export and account deletion (GDPR arts. 15, 17, 20). Today both go through the
  contact page; an "I tuoi dati" section in the account page with two buttons is a day of work.
- A `legal_acceptances` table (user, document, version, timestamp, IP) written server-side at signup,
  replacing the record kept in `user_metadata`.
- Re-prompt terms acceptance when `LEGAL_VERSIONS.terms` changes.

## Content and search

- 170 lessons without theory. The chapter and lesson pages are live and flip to indexable on save.
- Search should be a page (`/cerca?q=`) with a URL, so it can be shared, indexed and used as a
  `SearchAction` in the site's structured data.
- Descriptions for the 89 nodes without one (listed in `SEO-TODO.md`).

## Business

- Business setup checklist (details and reasoning in the 2026-09-04 chat with the owner): CVR as a
  personally owned business on virk.dk, Danish VAT registration (buying Vercel, Supabase or OpenAI
  services from abroad requires it from the first invoice, reverse charge), then the EU small-enterprise
  VAT exemption for Italian sales (EX number from SKAT) or, failing that, OSS with Stripe Tax at the
  Italian rate; EUR settlement in Stripe with a EUR bank account so payouts skip conversion; one session
  with a revisor about virksomhedsordningen before the first payout.
- Semester prices in Stripe (`PUBLIC_STRIPE_PRICE_*_SEMESTER`); the toggle appears on its own once set.
- The Pro plan's weekly tutoring hour needs a booking flow (calendar, Meet link); `api/create-meet`
  exists as a starting point.
- Student numbers on the landing page: switch the third counter from "Lezioni pubblicate" to
  "Studenti iscritti" when the real count (from `auth.users`) is a number worth showing.
