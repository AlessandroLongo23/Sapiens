---
data: 2026-09-24
tag: [sessione, tecnica, stripe]
---
# Pagamento in produzione

Andrea si è registrato e ha aperto una pagina delle flashcard. Cliccando "Prova Lite gratis per 7 giorni" ha ricevuto l'errore di creazione della sessione di pagamento. Nei log di Vercel Stripe rispondeva `No such price`: la `STRIPE_SECRET_KEY` di produzione era del vecchio account (`acct_1SFoJw3rCdcysfxg`), mentre i prezzi erano del sandbox `…PzIzktCGlH`.

## Cosa si è fatto

- Alessandro ha passato la chiave segreta di test del sandbox "Sapiens sandbox" (`acct_1UBjwAK9L252GFVi`), che non aveva prezzi. Si è deciso di usare questo sandbox e di lasciare `…PzI`.
- Creati tre prodotti (Sapiens Piano Lite, Base, Pro) con codice fiscale `txcd_10103000`, obbligatorio perché l'account ha i Managed Payments attivi, e sei prezzi in euro: 4,99, 19,99 e 59,99 al mese, 24,95, 99,95 e 299,95 ogni sei mesi.
- Creato il webhook `we_1UJFyIK9L252GFViUNtMtku2` su `https://sapiens-edu.vercel.app/api/stripe/webhook` con i nove eventi che gestisce il codice.
- Su Vercel (Production) aggiornate `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` e le sei `PUBLIC_STRIPE_PRICE_*`, poi fatto il redeploy.
- Verificato: una sessione di Checkout con prova di 7 giorni senza carta si apre, e il webhook di produzione accetta la firma degli eventi del sandbox. Gli oggetti di prova sono stati eliminati.

## Domande aperte

- Il `.env` locale punta ancora al sandbox `…PzI` con una chiave scaduta: da allineare.
- Le variabili `STRIPE_PRICE_*` senza `PUBLIC_` su Vercel sono del vecchio account e il codice non le legge: da cancellare.
- Il passaggio alla modalità live prima della beta di gennaio 2027.
