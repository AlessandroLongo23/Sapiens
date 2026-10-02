---
stato: in sviluppo
aggiornato: 2026-10-02
tag: [tecnica]
---
# Architettura

## Stato attuale
- Next.js 16 (App Router, React 19), TypeScript, Tailwind 4. Porting da SvelteKit completato il 7-8 settembre 2026.
- Supabase: autenticazione con email e password e sessioni in cookie, database Postgres con RLS.
- Stripe per gli abbonamenti, Resend per le email, Vercel per l'hosting, Vercel Analytics dopo il consenso.
- OpenAI per [[Sapiens AI]] e per le bozze delle lezioni.
- Quattro strati: token, token semantici, componenti (`src/components`), schermate (`src/app`). Regole per il codice in `.cursorrules` e `README.md`.
- Pagine del materiale in ISR, KaTeX sul server. Dal 2 ottobre 2026, dopo l'avviso di Vercel sul 75% delle scritture ISR del piano gratuito (200.000 al mese, in unità da 8 KB), le pagine non hanno più un timer: si rigenerano alla prima visita dopo che uno script di pubblicazione ha chiamato `/api/revalidate` (`scripts/revalidate.mjs`, con `REVALIDATE_SECRET`), oppure dopo un deploy. La home tiene un timer di un giorno. Le calcolatrici sotto `/strumenti/[slug]` si aggiornano solo con un deploy.
- Perché senza timer: Vercel conta una scrittura ogni volta che una rigenerazione differisce di un byte, e lo stesso contenuto non dà sempre gli stessi byte. Prova locale del 2 ottobre 2026: l'ordine delle righe trasmesse e dei tag nell'head cambia a seconda che l'albero dei contenuti arrivi dalla cache in memoria (60 secondi) o dal database.
- L'intestazione disegna i tre livelli da una costante (`src/lib/content/levels.ts`), così nessun layout legge il database e le pagine statiche si costruiscono una volta per deploy. Il menu dei livelli e la ricerca scaricano l'albero intero da `/api/node/root` al primo uso: prima pesava circa 526 KB su ogni pagina.
- Test end-to-end Playwright (desktop, iPhone, Pixel), hook husky prima di commit e push, CI su GitHub, deploy su Vercel solo da commit verdi.

## Domande aperte
- La fase scuole (registro, orari, turni) richiede servizi separati (per esempio un servizio Python per gli algoritmi di [[Orario e aule]])?
- Più scuole con i loro dati: come si separano i dati di ogni scuola nel database?
