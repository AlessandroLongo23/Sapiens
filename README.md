# Sapiens

Materiale didattico per medie, superiori e università: teoria, formulari, esercizi generati, un assistente di studio e un marketplace di ripetizioni. Next.js 16 (App Router, React 19), Tailwind 4, Supabase, Stripe.

## Sviluppo

```bash
npm install
cp .env.example .env   # poi compila i valori
npm run dev            # http://localhost:3000
npm run check          # tsc
npm run lint
npm run build          # next build + controlli su placeholder e credenziali
npm run preview        # next start sulla porta 4173, usata dai test end-to-end
npm run test:e2e       # Playwright: desktop Chromium, iPhone 14 (WebKit), Pixel 7
npm run test:smoke     # solo smoke.spec.ts su Chromium, senza webhook Stripe (usato dai hook e dalla CI)
```

Le variabili pubbliche mantengono i nomi `PUBLIC_*` (vengono inserite nel bundle da `next.config.ts` al momento della build: un cambio su Vercel richiede un nuovo deploy); le chiavi segrete si leggono solo sul server con `process.env`. Per le email servono `RESEND_API_KEY`, `MAIL_FROM` (un mittente su un dominio verificato in Resend) e `CONTACT_INBOX` (destinatario del modulo contatti); senza `MAIL_FROM` Resend consegna solo al proprietario dell'account. I test end-to-end richiedono la Stripe CLI (`stripe listen` parte da `tests/e2e/global-setup.ts`, il segreto del webhook che stampa va in `STRIPE_WEBHOOK_SECRET`) e la chiave service role di Supabase per creare utenti di prova.

Gli header di sicurezza (CSP, frame-ancestors, HSTS, nosniff, Referrer-Policy, Permissions-Policy) sono in `next.config.ts`. La CSP tiene `'unsafe-inline'` per gli script perché il payload React inline cambia a ogni pagina e un nonce costringerebbe a rendere dinamiche tutte le pagine in cache.

## Controlli prima del push

I hook git (husky, installati da `npm install` tramite lo script `prepare`) fermano i commit e i push che romperebbero la build:

- `pre-commit`: ESLint sui file in stage (lint-staged) e `npm run check`.
- `pre-push`: `npm run lint`, `npm run build` e `npm run test:smoke`, cioè la suite smoke di Playwright su Chromium contro la build di produzione.

`git push --no-verify` salta i hook una volta; `HUSKY=0` li disattiva. La suite avvia sempre un server nuovo sulla porta 4173, così testa la build appena fatta e non una vecchia: se la porta è occupata si ferma (chiudi quel server, o punta la suite a un server tuo con `E2E_BASE_URL`).

Su GitHub `.github/workflows/ci.yml` ripete gli stessi passi a ogni push, su una macchina pulita. Servono quattro secret del repository: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `STRIPE_SECRET_KEY` (sandbox) e `SUPABASE_SERVICE_ROLE_KEY`. Con la protezione del branch `master` che richiede il check `checks`, la produzione su Vercel riceve solo commit verdi.

La suite smoke fallisce anche per errori in console, eccezioni non gestite, richieste bloccate e risposte 4xx/5xx sulle pagine pubbliche: gli errori a runtime che `next build` non vede. In sviluppo la CSP aggiunge `'unsafe-eval'`, perché la build di sviluppo di React lo usa per ricostruire gli stack delle chiamate; in produzione no, e un test lo verifica.

Per riprodurre in locale la build di Vercel: `vercel login`, `vercel link` (scegli il progetto esistente), poi `vercel pull` e `vercel build`. Le variabili scaricate finiscono in `.vercel/` (ignorata da git) e non toccano `.env`; `vercel pull --environment=production` e `vercel build --prod` riproducono un deploy di produzione.

## Struttura

Il codice segue quattro strati, dal basso verso l'alto:

1. **Tokens** (`src/app/globals.css`, blocco `@theme`): la scala grezza, colore del marchio, tipografia compatta, spaziature, raggi.
2. **Semantic tokens** (stesso file, `:root` e `.dark` più `@theme inline`): cosa significa una superficie o un testo. I componenti usano `bg-surface`, `text-fg-muted`, `border-edge`, `bg-accent`, mai la scala grezza, così il tema scuro è un solo blocco e non una variante `dark:` su ogni classe.
3. **Components** (`src/components`): `ui/` sono le primitive (Button, Card, Field, Badge, Sheet, Modal, Latex); `shell/` è la cornice del sito (header, tab bar, ricerca, cookie, login); `content/`, `subscription/`, `tutoring/`, `admin/` sono i componenti di dominio.
4. **Screens** (`src/app`): le route. Le pagine caricano i dati sul server e compongono i componenti; la logica sta in `src/lib`.

`src/lib` contiene la configurazione (`config/`), SEO (`seo/`: slug, titoli, JSON-LD, metadata), gli accessi al server (`server/`: contenuti, auth, tutoring, sitemap, esercizi), gli store client (`state/`, zustand), gli hook (`hooks/`), il renderer markdown (`content/`), il catalogo esercizi (`exercises/`) e la libreria matematica (`math/`).

## Contenuti e SEO

Le pagine del materiale sono ISR (ogni pagina è generata alla prima richiesta e poi servita dalla cache, rigenerata ogni 10 minuti; `generateStaticParams` vuoto sulle route dinamiche è ciò che lo abilita), con titolo, descrizione, canonical, Open Graph e dati strutturati generati da `src/lib/seo`. Le formule sono tipografate con KaTeX sul server: il browser riceve HTML già pronto e carica KaTeX solo per la chat dell'assistente. Gli esercizi sono generati sul server a ogni richiesta e arrivano già tipografati. I vecchi URL `/wiki/...` e le varianti non canoniche fanno un redirect permanente.

## Test

La suite in `tests/e2e` usa il progetto Supabase reale (utenti usa e getta creati con la service role) e la sandbox Stripe: `.env` deve contenere `STRIPE_SECRET_KEY` sandbox, `STRIPE_WEBHOOK_SECRET` e `SUPABASE_SERVICE_ROLE_KEY`. `global-setup.ts` avvia `stripe listen` per consegnare i webhook al server locale. I tutor dimostrativi si caricano con `node scripts/seed-tutors.mjs`.

## App nativa

`capacitor.config.json` e `android/` restano per il wrapper Capacitor: il sito è renderizzato sul server, quindi `server.url` punta al deployment (tienilo uguale a `PUBLIC_SITE_URL`) e `webDir` è solo la cartella `public/`. I pacchetti Capacitor sono devDependencies: nessun codice dell'app li importa.
