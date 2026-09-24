---
stato: in sviluppo
aggiornato: 2026-09-23
tag: [tecnica]
---
# Architettura

## Stato attuale
- Next.js 16 (App Router, React 19), TypeScript, Tailwind 4. Porting da SvelteKit completato il 7-8 settembre 2026.
- Supabase: autenticazione con email e password e sessioni in cookie, database Postgres con RLS.
- Stripe per gli abbonamenti, Resend per le email, Vercel per l'hosting, Vercel Analytics dopo il consenso.
- OpenAI per [[Sapiens AI]] e per le bozze delle lezioni.
- Quattro strati: token, token semantici, componenti (`src/components`), schermate (`src/app`). Regole per il codice in `.cursorrules` e `README.md`.
- Pagine del materiale in ISR, KaTeX sul server.
- Test end-to-end Playwright (desktop, iPhone, Pixel), hook husky prima di commit e push, CI su GitHub, deploy su Vercel solo da commit verdi.

## Domande aperte
- La fase scuole (registro, orari, turni) richiede servizi separati (per esempio un servizio Python per gli algoritmi di [[Orario e aule]])?
- Più scuole con i loro dati: come si separano i dati di ogni scuola nel database?
