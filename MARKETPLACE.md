# Tutoring marketplace: research and decisions

Written 2026-09-06, on branch `seo-overhaul`, from the owner's notes and a research session on the
same day. Nothing here is built. `ROADMAP.md` holds the product order; this file holds the reasoning
behind the tutoring marketplace so it does not have to be redone. Every fact below was read from the
platform's own pages or contracts on 2026-09-06 unless marked as a review or press source.

## The question

Sapiens has three customers. Students pay a monthly subscription for exercises, formularies and
Sapiens AI (in place). Tutors, mostly university students and graduates, want students to teach.
Families want a tutor. The owner has used Ripetizioni.it as a tutor and found the mechanism rotten:
the platform kept all the money on short relationships to stop tutors from taking students
off-platform after the first paid lesson, so every tutor either gave up the first lesson or gamed the
averages.

The proposal: a pay-per-lead marketplace. Contact details stay hidden; a tutor pays about 5 euro to
receive a student's contact; after that the two organise and pay lessons directly and the platform
takes nothing. Three questions were asked: is it legal, is it convenient for Sapiens, and is there a
design that keeps both sides happy without pushing them to work around the platform.

## Decisions

These are the conclusions of the session. Prices are proposals; the owner has not fixed them yet.

1. Charge for the introduction, never for the lessons. No escrow, no commission, no
   anti-circumvention clause, no penalty. Off-platform lessons are the product, not a leak.
2. Charge at the moment of the match, on both sides, lightly. The student picks one tutor and
   writes a message; the tutor accepts; contact is revealed both ways and the fees fire then.
3. Student side is a subscription feature: Base and Pro include a few contact requests a month;
   Free and Lite pay a one-off fee (proposal 4.99 euro) per accepted request, with no renewal.
4. Tutor side pays at acceptance (proposal 5 euro, 8 euro for university subjects), refunded as
   credit if the number is invalid or the student has not replied within 7 days.
5. One lead goes to one tutor. A student can have at most three open requests, and the tutor is
   told whether the student has other requests open.
6. A tutor subscription ("Tutor Pro", proposal 9.99 euro a month or 79 euro a year) with included
   leads, a verified badge, a ranking boost with published criteria and a dashboard that reads the
   student's Sapiens progress with consent.
7. Leads are generated in context: a "Chiedi aiuto a un tutor" button on the lesson or exercise
   page where the student is stuck, so the tutor receives the subject, level, city and the topics
   the student gets wrong. This is the differentiator no competitor can copy.
8. Do not build lesson payments. If tutors later ask for payment protection, add an optional
   Stripe Connect rail at 5 to 10% like Superprof's, knowing it brings DAC7 reporting for the tutors
   who use it.
9. Legal setup before launch: withdrawal-right waiver at checkout, Italian VAT on the lead (OSS or
   the EU small-enterprise scheme), P2B-compatible tutor terms, parent-only contact for minors, a
   DPIA, DSA contact points, and wording that never describes the service as selecting or placing
   tutors. Details in the legal section and the checklist.

## What exists in the code (2026-09-07)

Built on branch `seo-overhaul`. Every flow below is covered by Playwright in
`tests/e2e/tutoring.spec.ts` and `tests/e2e/tutor-side.spec.ts`.

- Database: `tutors` (profile; surname, phone and email private), the `tutors_public` view (published
  profiles, first name and last initial, no contacts), `tutor_requests` with a 48-hour `expires_at`
  and row level security for the student's own rows. Migrations in `supabase/migrations/`, applied.
- Student side: `/ripetizioni` (list, search, filters in the URL, sort with the published ranking
  note), `/ripetizioni/[slug]` (profile with the request form), "Chiedi aiuto" dialog on the cards,
  `/richieste` (own requests, tutor contacts once accepted, cancel while pending), the "Chiedi aiuto a
  un tutor" block at the end of every lesson (subject and level preselected), a marketplace icon in
  the phone header.
- Tutor side: `/ripetizioni/diventa-tutor` (public landing, signup on the button), `/profile-editor`
  (create: goes to review; edit: live within minutes), `/dashboard` (status, counts), `/leads` (inbox:
  message without contacts, accept or decline with confirmation, contacts after acceptance, archive
  with expired, declined and cancelled requests). A tutor area layout with its own navigation.
- Staff: `/admin/tutors` (publish, suspend, back to review, verified badge) and an `/admin` index.
- Server: `src/lib/server/tutoring-admin.ts` (service role, ownership checks, validation, slugs,
  lazy expiry) and `src/lib/server/tutoring-mail.ts` (request received without contacts; acceptance
  to both sides with contacts; refusal to the student). APIs under `/api/tutoring/*` and
  `/api/admin/tutors/[id]`.
- `scripts/seed-tutors.mjs` inserts eight demo tutors (slugs `demo-*`; `--delete` removes them).

Not built yet: the fees on both sides and their checkout wording (acceptance is free; the hook is
the respond endpoint), phone verification by OTP (needs an SMS provider), tutor-specific terms (the
editor records acceptance of the general terms), email notification to the tutor when staff publish
the profile, a scheduled expiry job (expiry runs when a list is opened; a Vercel cron could call it),
and the roadmap's bottom navigation on phones.

## How the Italian market handles the money

### Ripetizioni.it (Skuola.net): the commission model, now being shut down

Skuola Network sold Ripetizioni.it to Superprof on 7 May 2026 (CFNEWS, 20 May 2026; Maddyness, 12 May
2026, "sera progressivement fermé au profit de Superprof.it"; revenue about 4 million euro a year).
ripetizioni.it and ripetizioni.skuola.net redirect to superprof.it; the legacy platform keeps running
at lezioni.skuola.net until 6 May 2027. Contracts: https://lezioni.skuola.net/legalterms-utente.pdf
(user contract 26 May 2025, tutor contract "procacciamento d'affari occasionale" 9 April 2025). Help
centre: https://supporto-ripetizioni.skuola.net/hc/it/.

How it worked. The tutor set the hourly rate (minimum 8 euro, caps by level). Students bought credits
(1 credit = 1 euro, expiring after 12 months), booked, and after the lesson handed the tutor a
"Codice Prenotazione"; the tutor entered it to be paid to PayPal. No code, no money (tutor contract
art. 7.5). Periodic plans took 5, 10 or 15% off the rate; "Ripetizioni Prime" cost 5.99 euro a month.
Contact details reached the tutor only in the booking request (art. 8.2); messages containing a phone
number, email, address or an appointment before booking were deleted and the profile blocked.

The commission (help article 5309121056913, 12 Feb 2025; contract Allegato C), charged on payout with
22% VAT on top of the commission:

| Hours with the single student | Schema 1: 2 or fewer students, or 3+ with average of 3 h or more | Schema 2: 3+ students and average under 3 h |
|---|---|---|
| Up to 1.5 h | 40% + VAT (tutor nets 51.2%) | 82% + VAT (tutor nets 0%) |
| 1.5 to 5 h | 30% + VAT | 30% + VAT |
| 5 to 10 h | 25% + VAT | 25% + VAT |
| Over 10 h | 20% + VAT | 20% + VAT |

The contract's own example: 5 hours at 20 euro gave the tutor 59.74 euro under Schema 1 and 44.37
under Schema 2. The counter restarts with every new student, so each new student began at the 40% or
82% tier. The 82% rule dates from March 2020 (Wayback snapshot of the 2020 help article); the mid
tiers were then 20, 15 and 10% and were raised to 30, 25 and 20% by 2025. There was no free trial;
the first lesson carried a "soddisfatto o rimborsato" guarantee in credits.

Anti-circumvention: tutor contract art. 21.2 (no payments outside the site), art. 22.6 (no direct
contact with users met through the site), art. 22.7 (termination and forfeiture of the accrued
balance "a titolo di penale", damages reserved); user contract art. 27.2 and 29.1 mirror it. The
ranking scored codes entered and hours per student; the Supertutor badge required an average of 10
hours per student. Skuola's own Trustpilot replies explain the rule: "evitare lezioni una tantum" and
"in genere bastano in media 2 lezioni per studente" to reach the 3-hour average. Tutor reviews
(Trustpilot, 2020 to 2024) describe receiving nothing for 15, 37.50 or 67.50 euro lessons.

No AGCM or Garante action concerned the tutoring product (the Garante's 2022 order against Skuola
Network was about news articles).

### Superprof: student pass, no commission

Sources: https://www.superprof.it/blog/la-guida-completa-per-gli-insegnanti-privati/,
https://www.superprof.it/blog/costo-ripetizioni-a-domicilio/,
https://www.superprof.com/blog/charges-payments-superprof/ (the condizioni generali page returns 403
to non-browser clients).

- Student: "Pass Alunno" 29 euro a month, charged only when a tutor accepts the first lesson,
  auto-renews until suspended, unlimited contacts. The blog says it is refunded if no tutor is found.
- Tutor: free listing; 0% commission; 10% only if the student pays through the platform; Premium
  99 euro a year (69 in 2023 sources) removes the fee and boosts visibility; automatic payout above
  30 euro. A free first lesson is forced for "nuovo" and "confermato" levels.
- Lesson money: direct between the parties by default; the tutor guide says so explicitly.
- Anti-circumvention: none. The US blog says a student can cancel the pass and keep working with the
  tutors met.
- Complaints (Trustpilot superprof.it 4.3/5 on 5,128; Altroconsumo complaint board 2020, 2025): almost
  all about the auto-renewing pass ("una lezione di 1 ora è costata più di 60 euro"; refunds "a titolo
  di gesto commerciale").
- No AGCM proceeding found in Italy; the only regulator trace is French DGCCRF complaints, no fine.

### Letuelezioni (Tus Media S.L., GoStudent group since February 2022)

Sources: https://www.letuelezioni.it/aiuto/, https://www.letuelezioni.it/info/condizioniuso-alunni.aspx,
https://www.letuelezioni.it/blog/letuelezioni-superprof-qual-e-opzione-migliore.

- Student: "Student Pass" 19 euro a month, auto-renewing, charged 5 days before renewal (terms and
  2025 blog; the FAQ page still says contacting is free, so the two contradict each other).
- Tutor: 3 free ads, 9.95 euro a year from the fourth; "Insegnante Top" monthly subscription (about
  7 euro in reviews) which is the only way to show a phone number; "Annuncio Premium" 30 days;
  "Prima posizione" boost about 1.90 euro. 0% commission; "Non interveniamo nel pagamento delle
  lezioni".
- Anti-circumvention: none.
- Complaints (Trustpilot 4.1/5 on 1,619): tutors paying for contacts that never reply.

### OkRipetizioni, Docenti.it, CheckTutor: the cheap contact-gate long tail

- OkRipetizioni (https://www.okripetizioni.it/, Mercurius Network SRL, operator since 1991): student
  pass 9 euro for a month, 19 for six months, 29 for a year; data revealed after in-app trust;
  lessons paid directly; claims 495,836 registered users.
- Docenti.it (https://www.docenti.it/ripetizioni.html, Start To Fly S.r.l., San Marino): free for
  families, tutors pay 36 euro a year, contacts visible, no payment processing; claims 3,000 tutors.
- CheckTutor (https://www.checktutor.it/, HUMANTE srls, Turin): free for students, tutor Premium 4.90
  euro a month or 29.90 a year for ranking and an AI assistant, no commission.
- TrovaTutor (https://trovatutor.it/) and the "Tutoring" app: free, no revenue model yet.

### Preply, Classgap, Tutorly, Apprentus: the commission and escrow model

- Preply (https://help.preply.com/en/articles/4171383-preply-commission-model; terms of service 25 Nov
  2025 at https://termsofuse.preply.com/terms_of_use/en_TermsOfService.pdf): 100% of the trial lesson;
  then 33% for new tutors, 28% after 20 hours, 25% after 50, 22% after 200, 18% from 400 (the middle
  tiers are in an image and confirmed by third parties); student pays a processing fee and a 28-day
  auto-renewing subscription. Terms 3.4(f) forbid teaching or receiving payment outside the platform;
  section 14 allows termination with the remaining balance withheld as liquidated damages. Contact
  details may not be exchanged before the first paid lesson.
- Classgap (https://www.classgap.com/it/info/terms, Tus Media): 32% under 25 hours, 27% to 59, 23% to
  299, 18% to 499, 16% above 500; 50% or 100% of the first lesson with each student depending on the
  visibility level chosen; monthly payout; termination without notice for off-platform booking.
- Tutorly (https://www.tutorly.it/, Italian, P.IVA 14611510968): 15% under 20 lessons, then 12, 10 and
  8%; payments and classroom in-platform.
- Apprentus (https://www.apprentus.com/en-us/teacher-payment-terms): the commission is added on the
  student side (about 20% in reviews, decreasing with hours with the same tutor) plus a membership
  fee of 34 to 50 euro at first checkout (reviews); tutors pay 0% through the platform. If a tutor
  collects directly, Apprentus invoices the commission monthly and suspends after two reminders. The
  owner's memory ("fee on the first booking, then direct") does not match the terms.
- UniProf (https://www.uni-prof.it/): prepaid credits, 1,500 euro penalty for taking students
  off-platform.

### Tutornow and GoStudent: agencies that own the whole transaction

- Tutornow (Tutornow S.r.l., Lomazzo; terms 13 July 2026 at https://tutornow.it/termini-e-condizioni
  and /termini-e-condizioni-tutor): a consultant sells packages or 28-day subscriptions from 15 euro
  an hour; Tutornow sets the tutor's rate and does not publish it; all communication runs in a
  WhatsApp group that includes Tutornow; both sides sign a 12-month non-contact tail (tutor art.
  6.2.b, user art. 5.3.1.4), breach is grave, fees are withheld and damages reserved. Trustpilot 4.7
  on 602.
- GoStudent (https://www.gostudent.org/it-it/cgc/, /prezzi/, /codice-condotta-tutor/): 19.49 to 32.90
  euro per 50-minute lesson in 4 to 12 lessons a month, minimum terms, auto-renewal unless cancelled
  7 days before, unused credits lapse; tutors are freelance at about 13 euro a lesson (from the
  earnings examples on the recruiting page); expired student credits are kept as commission (tutor
  terms 5.8). The code of conduct bans off-platform lessons with students met through GoStudent.
  The Oberlandesgericht Wien (30 June 2023, 5 R 70/23k, after a VKI action) struck 20.5 of 22
  consumer clauses including auto-renewal and credit expiry; Landgericht Köln ruled against it on
  17 of 20 points on 15 Feb 2023. Italian one-star reviews in 2026 are about renewals and
  cancellation.

### Yoopies, Sitly: family subscriptions

- Yoopies (terms 29 Dec 2023, https://static.yoopies.com/legal/IT/Yoopies-Terms_and_Conditions.pdf):
  families pay 24.90 euro a month, 39 for three months or 108 a year to message beyond the first 3;
  tutors pay 4 euro for verification and 5 euro a month Premium after a free week; booking commission
  0.20 euro an hour if the booking tool is used; a pledge not to pay outside, no penalty. Trustpilot
  2.8 on 207, mostly renewals.
- Sitly (https://www.sitly.it/pricingpage-3): parents 19.99 euro a month, 41.97 for three, 59.94 for
  six; sitters 4.99 to 9.99 a month.

### ProntoPro, Cronoshare, Instapro: pay-per-lead in Italy

- ProntoPro (https://www.prontopro.it/ripetizioni, HomeRun; 4,294 tutors listed): free for clients,
  each request goes to up to 5 professionals. Until December 2023 a reply cost 2 to 5 credits at
  about 2.25 euro; since then a dynamic euro price per request, typically 12 to 30 euro in reviews,
  outliers to 80. Refund only for "numeri inesistenti o non attivi", never for silence or for a
  client who chose someone else; balance never refunded in cash; ProntoPro tells professionals they
  are not consumers (official replies on Altroconsumo, 2023 to 2025). Trustpilot 3.3 on 12,579.
- Cronoshare (https://supporto.cronoshare.it/hc/it/articles/360006119674 and 360020411580): a lead
  costs 2 to 15% of the job value (average 6%), goes to up to 4 professionals, is priced before
  purchase, splits into a refundable "commissione" and a non-refundable "spese di gestione"; a
  verified phone raises the price, an unreachable number halves it; the commission is refunded on
  request within 60 days if not hired.
- Instapro (terms March 2018): price shown before replying, owed only when the client shares contact
  details, credit-only returns within a month, credits expire after a year, 1,000 euro penalty for
  contact misuse.
- Pronto Ripetizioni, First Tutors' Italian arm (7 or 14 euro to unlock a tutor), closed in July 2021.

### Free channels, the real competitor

Subito.it (posting in "Servizi" is paid, 60 days, 251 "ripetizioni" ads nationwide on 2026-09-06),
Bakeca.it (free posting, paid TopList from 4 euro), municipal Informagiovani boards (about 100 tutor
offers in Vicenza with phone numbers), Facebook groups and university notice boards. Kijiji closed
on 31 May 2022 and sent users to Subito.

### Dead or dormant since 2021

Tutored (18% commission, pivoted to student jobs by 2022), Trovaprof (free, origin down since April
2024), Docety (credit packs, maintenance page December 2025), Tenbuilders, Insegnalo, Tutoreasy,
Teacheo, Apprende, Pronto Ripetizioni. Schoolr (25% commission) was rebranded La Scuola360 in 2026.

Pattern: platforms that never touched lesson money survived (Superprof, Letuelezioni, OkRipetizioni,
Docenti.it, CheckTutor, ProntoPro, Cronoshare); agencies that own the whole transaction survived
(Tutornow, GoStudent, Tutio, Grandi Scuole); thin Italian commission marketplaces died or were sold.
The worst reviews of every subscription incumbent are about auto-renewal. Nobody in Italy sells a
one-off, transparent, refundable introduction.

## Pay-per-lead and introduction-fee models abroad

- First Tutors (UK): the student paid a finder's fee of 9.99 to 34.99 pounds, scaled to the tutor's
  rate, only after the tutor accepted in messaging; payment released the contact by email; tutors paid
  nothing; refunds were discretionary. Closed in spring 2026 after 20 years
  (https://www.firsttutors.com/uk/, Wayback FAQ of 14 March 2026).
- Tutor Hunt (UK, https://www.tutorhunt.com/about.asp via Wayback): a one-off 19.99 pounds plus VAT
  finder's fee until 2019, then a 20 to 25% commission (minimum 4 pounds) for tutors who joined
  after 1 April 2019, and by December 2021 commission only; the percentage is no longer published.
  Reviews on both sides turned negative after the switch.
- UK Tutors (https://www.uktutors.com/tutors/): 4.99 to 29.99 pounds per contact, computed as 8
  pounds plus 7% of the hourly rate for the first 5 hours and 3% for hours 6 to 10; the tutor fronts
  the fee and is told to recover it at the first lesson; no refund if the student vanishes.
- Tutorperch (https://tutorperch.com/): free messaging, 9.99 pounds once to unlock contact details,
  refunded if no lesson is agreed, no commission.
- Bark (https://www.bark.com/en/gb/terms/, help centre articles 13346288068892 and 19262438332060):
  professionals buy credits at 1.80 pounds; a lead costs an unpublished 5 to 20 credits; a request
  goes to up to 5 professionals; the price and badges ("verified phone", "1st to respond", "high
  hiring intent") are shown before purchase; refunds only for invalid phone or email within 7 days
  (terms) or 14 days (help centre), never for silence; credits expire after 3 months since November
  2025. Not present in Italy.
- Thumbtack (US): 10 to over 100 dollars per lead, charged the moment the customer contacts the
  professional, no refund for a customer who never replies. Trustpilot 2.1 on 6,607.
- Tutors.com (US): about 25 dollars per tutoring lead, reviews of six leads with zero replies.
- Wyzant (US): 25% platform fee from the tutor and 9% from the student, off-platform payment banned,
  first-hour "Good Fit Guarantee" is the carrot for staying on-platform.

Documented failure modes of pay-per-lead: silence is the dominant loss and no large platform refunds
it; fake, bot, minor or job-seeker requests; the same lead sold to several professionals so the
customer is flooded; evidence burdens for refunds; prepaid balances that expire; tutors resenting a
fee they must front. Safeguards that work: charge only after mutual acceptance, show the request and
the price before purchase, verify the phone, cap the number of buyers of one lead, refund invalid
data quickly, and, in the two small UK survivors, refund when no lesson follows.

## Legal and tax memo

Sapiens is a Danish sole proprietorship (CVR, Danish VAT, Danish Stripe) selling to Italian
consumers, many of them minors. "Settled" means statutory text or authority guidance on point;
"interpretation" means a reading with no ruling on tutoring specifically.

1. Not a regulated "intermediazione". Selling a contact for a contratto d'opera between private
   parties is not job brokering under art. 4 D.Lgs. 276/2003. The Ministry of Labour's Interpello
   12/2013 on crowdsourcing sites says no authorization is needed where the site promotes commercial
   contracts, only where it creates "posizioni di lavoro" inside an organization. Art. 6(1)(f) lets
   for-profit sites do intermediazione only if non-profit, and unauthorized brokering is a criminal
   offence (art. 18), so the service must be described as contact facilitation, never as selecting
   or placing tutors, and must not serve employers (schools, doposcuola businesses). Superprof,
   Letuelezioni and ProntoPro have run this way for a decade. Confidence high.
2. DAC7 (Directive 2021/514, Italy D.Lgs. 32/2023, Denmark BEK 1253/2022). A relevant activity is
   one "carried out for consideration" whose amount "is known or reasonably knowable by the platform
   operator" (Annex V Section I(A)(8) and (10)). A platform that never sees whether a lesson happened,
   how many hours or at what price has no reportable sellers. Annex V Section I(A)(1) also excludes
   software that only lets users list or advertise; whether a paid contact reveal is "further
   intervention" is untested, so rely on the first reason. Do not add features that record lesson
   hours or prices. A Danish-resident operator reports only to Skattestyrelsen, which exchanges with
   Italy; Skat's Q&A confirms it. Excluded Platform Operator status can be requested. A commission
   model triggers full reporting: registration, codice fiscale and IBAN collection for every tutor,
   annual report by 31 January, daily fines for delay. Confidence medium-high for the exclusion,
   high for the commission case. Sources: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021L0514,
   https://skat.dk/erhverv/ekapital/platformsoekonomi/qa-om-dac7,
   https://www.agenziaentrate.gov.it/portale/faq-gestori-di-piattaforme.
3. No liability for tutors' undeclared income. The obligation sits with the tutor and with sostituti
   d'imposta (arts. 23 to 25 DPR 600/1973), which a Danish sole trader paying nothing to tutors is
   not. Tutors' own rules: occasional lessons are redditi diversi (art. 67(1)(l) TUIR), no ritenuta
   when the payer is a family, 2 euro marca da bollo on receipts above 77.47 euro, INPS Gestione
   Separata only above 5,000 euro a year (art. 44(2) D.L. 269/2003), partita IVA and forfettario
   (L. 190/2014) when habitual, private lessons VAT-exempt (art. 10(1)(20) DPR 633/1972), 15% flat
   tax for docenti titolari di cattedra (L. 145/2018 art. 1 c. 13-16) who must notify their school.
   No duty to inform tutors; Superprof, Letuelezioni and GoStudent publish an informational page and
   a clause ("Eventuali imposte ... sono dichiarate e pagate dall'Insegnante stesso"). Marketing the
   service as "senza tasse" would be a misleading practice (arts. 21-22 Codice del Consumo).
   Confidence high.
4. VAT on the lead fee. An automated contact reveal is an electronically supplied service (art. 7
   Reg. 282/2011), taxed where the customer is. B2C (tutor without partita IVA): Italian VAT 22%,
   declared through the OSS Union scheme from Denmark, or exempt under the EU small-enterprise scheme
   of Directive 2020/285 (EX number from Skattestyrelsen, EU turnover under 100,000 euro, Italian
   turnover under 85,000 euro, no input-VAT deduction, covers the subscriptions too; Italy: D.Lgs.
   180/2024, Circ. 13/E 2025). B2B (tutor with partita IVA, forfettario included): reverse charge,
   VIES check at checkout, invoice with the customer's VAT number and "reverse charge", Danish EU
   sales list. Forfettari must self-assess the 22%, so a 5 euro lead costs them 6.10; say so on the
   tutor page. Confidence high.
5. Consumer law toward tutors. A tutor without partita IVA is a consumer (art. 3 Codice del Consumo;
   CJEU C-105/17 Kamenova). The 14-day withdrawal right on the lead fee is excluded under art.
   59(1)(a) or (o) only with the consumer's express request and acknowledgment (art. 51(7)-(8));
   without it the consumer owes nothing (art. 57(2)). Checkout: price "IVA inclusa" (art. 49(1)(e)),
   an unticked box reading "Chiedo espressamente che i dati di contatto dello studente mi vengano
   comunicati subito, prima della scadenza del periodo di recesso, e riconosco che, una volta
   ricevuti i dati, perderò il diritto di recesso", a button that states the payment obligation
   (art. 51(2)), and the same text in the confirmation email. P2B Regulation 2019/1150 applies to
   tutors acting professionally and a lead marketplace is its paradigm case: plain terms and
   suspension grounds (art. 3), 15 days' notice of changes, reasoned 30-day termination (art. 4),
   main ranking parameters (art. 5); a small enterprise is exempt from the complaint system and
   mediation. DSA: the site is an online platform, but micro and small enterprises are exempt from
   trader-traceability and most platform duties (arts. 19, 29); what remains is contact points
   (arts. 11-12), moderation rules in the terms (art. 14), notice-and-action (art. 16) and a
   statement of reasons on removals (art. 17). Confidence high on what to do.
6. GDPR. Basis for sharing the student's or parent's contact is art. 6(1)(b), the contract the data
   subject asked for. The tutor becomes an independent controller: bind them to purpose limitation
   (lessons only, no marketing, deletion if no lesson follows) and give them an art. 14 notice
   template. Minimise: first name, one channel, subject, level, city. Minors: below 14 only the
   parent can act (art. 2-quinquies Codice privacy) and minors cannot contract, so every contact
   request for a minor starts from the parent account and shares the parent's channel. Write a DPIA
   (vulnerable data subjects matched with adults for in-person meetings) and log every reveal. No
   Garante decision on tutoring or babysitting platforms was found; the 2025 decisions on schools
   publishing minors' data show the standard of care. Confidence high.
7. AGCM precedents. None against Superprof, Skuola.net, GoStudent, Preply, Letuelezioni or ProntoPro
   (bulletin PDFs returned 403, so "none found"). What AGCM fines elsewhere: pre-ticked recurring
   options (Amazon PS12585, 10 million euro, 2024), 60-day cancellation notice on auto-renewals
   (2013 decisions 24546 and 24547), review handling (Trustpilot PS12962, 2026). The Austrian
   GoStudent rulings show which consumer clauses fail: auto-renewal, unilateral price changes,
   expiry of prepaid units. Avoid: pre-ticked options, silently expiring credits, prices without VAT,
   fake scarcity of leads, earnings claims to tutors, curated reviews.
8. Anti-circumvention clauses. Against a consumer-tutor a ban on off-platform lessons with a money
   penalty is presumed unfair (art. 33(2) lett. f and t Codice del Consumo); Cass. 19565/2020 and
   Cass. ord. 34487/2024 strike broker penalties equal to the full commission; art. 1384 c.c. lets a
   judge cut any penalty. Against a business tutor the clause needs specific written approval (art.
   1341(2) c.c.) and a reasoned notice under P2B. Market practice uses account sanctions only. In
   the pay-per-lead model the point is moot; the only clauses needed are a ban on reselling or
   misusing contact data and a suspension remedy.

What the commission model would add, for the record: full DAC7 reporting; handling third-party
funds (the PSD2 commercial-agent exemption is read by the EBA as unavailable to a two-sided
marketplace, so Stripe Connect with the platform never holding funds, or a licence); "mercato online"
duties under art. 49-bis Codice del Consumo; refunds, chargebacks and no-shows in the middle; and an
anti-circumvention regime that is enforceable only through account sanctions.

## Economics

Per matched student, ex VAT, with a tutor at 20 euro an hour:

| Model | Platform take per match |
|---|---|
| 5 euro lead paid by the tutor, VAT included | 4.10 euro, about 3.75 after Stripe |
| Superprof pass | 23.77 euro, often double when a second month bills |
| Letuelezioni pass | 15.57 euro |
| OkRipetizioni pass | 7.38 to 23.77 euro |
| Skuola.net commission, 2-hour relationship | 15 euro |
| Skuola.net commission, 10-hour relationship | 58 euro |
| Preply, 10 hours (trial plus 33%) | 79 euro |

For the tutor a 5 euro lead is a gift: at a 50% lead-to-lesson conversion a student costs 10 euro
and a 10-hour relationship is worth 200, a 5% effective take against Skuola's 20 to 40%. ProntoPro
and Bark charge two to six times more for a lead sold to five people at once; an exclusive,
phone-verified lead where the student chose the tutor is worth more than 5 euro, so there is pricing
room upward. For Sapiens the lead fee alone will not be a revenue line until there are hundreds of
matches a month; with the student-side one-off fee and Tutor Pro the take per match rises to roughly
8 to 15 euro. The marketplace's value is that it sells subscriptions, keeps students inside the app
and gives tutors a reason to stay after the introduction.

## Recommended design

1. Match flow. The student (or parent, for a minor) opens a tutor profile or presses "Chiedi aiuto a
   un tutor" on a lesson, picks one tutor, writes a message; the phone is verified by OTP. The tutor
   sees subject, level, city, the message, the verified-phone badge and whether the student has
   other requests open, and accepts or declines within 48 hours. On acceptance both sides receive
   contact details (the parent's channel for minors) and the fees fire. Declined or expired requests
   cost nothing.
2. Student pricing. Base and Pro include a number of accepted requests a month (proposal three);
   Free and Lite pay a one-off 4.99 euro per accepted request, no subscription, no renewal. This is
   the positioning against the 29 euro auto-renewing pass.
3. Tutor pricing. 5 euro per accepted lead (8 for university subjects) or Tutor Pro at 9.99 euro a
   month or 79 a year with five included leads, verified badge, ranking boost and the student
   dashboard. Refund as credit if the number is invalid or the student has not replied within 7
   days, on the tutor's say-so, no screenshots.
4. Exclusivity. One lead, one tutor. Three open requests per student at most. A lead's "other
   requests open" flag is shown before acceptance.
5. Tutor tools after the introduction, with the student's consent: progress on the topics they were
   stuck on, the ability to assign exercises from the library, a shared session log without prices
   or hours (to stay outside DAC7).
6. Pro plan. The weekly 1-to-1 hour in the Pro plan (59.99 euro a month) can later be fulfilled by
   marketplace tutors paid by Sapiens; that is the agency model with its own obligations and is a
   separate decision.
7. Nothing else. No escrow, no booking with prices, no penalties, no contact-scrubbing of messages
   (there is nothing to protect), no "senza tasse" marketing.

## Launch checklist

- Checkout: price "IVA inclusa"; unticked express-request and loss-of-withdrawal box; button with
  the payment obligation; confirmation email repeating the acknowledgment; partita IVA field with a
  VIES check that switches the sale to reverse charge and prints the required mention.
- VAT: choose between the OSS Union scheme (Italian 22% on leads and subscriptions) and the EU
  small-enterprise scheme with an EX number (only while EU turnover stays under 100,000 euro; input
  VAT lost on Italian sales); Danish EU sales list for B2B leads; Stripe Tax configured for both.
- Tutor terms: written for consumers and for P2B at once; suspension grounds, 15-day change notice,
  ranking criteria, reasoned 30-day termination; a tax clause modelled on GoStudent's and an
  informational tax page; the refund rule; a ban on reselling or misusing contact data; no monetary
  penalties.
- Privacy: informativa updated (tutors as independent controllers, minimised data set, retention);
  minors' requests only from the parent account; tutor data clause and art. 14 template; DPIA on
  file; access log of every reveal.
- DSA: contact points for authorities and users, notice-and-action flow, statement of reasons on
  profile removals, moderation rules in the terms, monthly active recipients kept for the Danish
  coordinator.
- DAC7: a dated internal memo concluding no knowable consideration; no features recording lesson
  hours or prices; optionally request Excluded Platform Operator status or a bindende svar from
  Skattestyrelsen.
- Positioning: "facilitazione del contatto", never "selezioniamo" or "assegniamo" tutors; no
  employer customers.
- Product: phone OTP at request time; the 48-hour acceptance timer; the 7-day reply check and
  automatic credit; the contextual lead from the lesson page; the tutor dashboard.

## Open questions for the owner

- Price points: 5 or higher for the tutor lead, 4.99 for the student one-off, 9.99 or 79 for Tutor
  Pro, and how many requests Base and Pro include.
- Whether students aged 14 to 17 can request contact from their own account with the parent's
  channel shared, or only from the parent account (recommended).
- OSS versus the EU small-enterprise scheme, which depends on total EU turnover and on the input-VAT
  question already listed in `ROADMAP.md`.
- Whether to ask Skattestyrelsen for Excluded Platform Operator status before launch.
- When, if ever, to offer the optional payment rail, and whether the Pro plan's weekly hour should
  be fulfilled by marketplace tutors.

## Where the sources are

Every fee and clause above carries the URL it was read from. The Skuola contracts stay online at
lezioni.skuola.net until May 2027; for the platforms that closed (First Tutors, Tutor Hunt's old
model, Pronto Ripetizioni, Ripetizioni.it's help centre) the Wayback Machine holds the snapshots
cited. Reviews were read on Trustpilot and Altroconsumo's complaint board on 2026-09-06.
