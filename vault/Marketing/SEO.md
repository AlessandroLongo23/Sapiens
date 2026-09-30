---
stato: in sviluppo
aggiornato: 2026-09-28
tag: [marketing]
---
# SEO

Le lezioni gratuite sono il primo canale di acquisizione: lo studente cerca un argomento su Google e trova Sapiens.

## Stato attuale
Revisione SEO completa a settembre 2026: URL derivati dai titoli sotto `/materiale/...`, sitemap, dati strutturati, pagine vuote in `noindex`, verifica di Search Console. Il registro dettagliato è in `SEO-TODO.md` e la mappa del sito in `SITEMAP.md`, nella root della repo; entrambi risalgono al sito SvelteKit del 3 settembre.

Verifica del 26 settembre 2026 sulla produzione (`sapiens-edu.vercel.app`, sito Next.js), con richieste da Googlebot:
- Il sito non risulta indicizzato e Search Console non è collegato: la variabile `PUBLIC_GSC_VERIFICATION` non è impostata su Vercel.
- `robots.txt` si genera da `PRIVATE_PATH_PREFIXES` in `src/lib/config/site.ts`; la sitemap è dinamica, con `lastmod`. Le lezioni sono renderizzate sul server, con title, description dal testo, canonical e JSON-LD (`LearningResource`, `BreadcrumbList`).
- Problemi trovati: i capitoli senza lezioni (fisica, informatica, chimica, medie, università e i capitoli di matematica ancora da scrivere) erano indicizzabili, nella sitemap e con descrizioni che promettevano lezioni inesistenti; esercizi e flashcard indicizzati con circa 200 parole; le 404 dentro `/materiale` e `/ripetizioni` prendevano `index, follow` e il canonical della home; pagine pesanti (una lezione 1,5 MB di HTML, di cui 1,15 MB di payload React che ripete il testo; la home 584 KB).
- `scripts/check-seo.mjs` apre ogni URL della sitemap come Googlebot e segnala status diverso da 200, `noindex`, canonical sbagliato, title o description mancanti o duplicati, più di un `h1`, meno di 100 parole, percorsi bloccati da `robots.txt`. Uso: `node scripts/check-seo.mjs [url]`. In produzione, il 26 settembre: 25 pagine su 469 con problemi, mediana 129 parole.

Corretto nel codice il 26 settembre 2026, non ancora pubblicato:
- 404 annidate con i meta giusti (`noindex, nofollow`, niente canonical), commit `59d7154`.
- Livelli, materie e capitoli senza lezioni pubblicate restano sul sito ma sono `noindex` e fuori dalla sitemap; le descrizioni contano solo le lezioni con la teoria. Flashcard sempre `noindex`. La sitemap passa da 469 a 232 URL. Commit `a54a507`.
- Scheda di esercizi indicizzata per ogni lezione ([[2026-09-26 Una scheda di esercizi gratuita e indicizzata per ogni lezione]]), commit `c170b79`, dal 27 settembre su una pagina sua (`…/esercizi/scheda`, commit `c59c518`); la pagina del percorso (`…/esercizi`) è `noindex, follow` e fuori dalla sitemap. Dal 27 settembre (non pubblicato) la scheda cambia ogni giorno: si indicizza solo quella di oggi, all'indirizzo semplice, con una description che non nomina la data; i giorni passati (`?giorno=AAAA-MM-GG`) sono `noindex, follow`, fuori dalla sitemap e collegati con link `nofollow`. Vedi [[2026-09-27 La scheda degli esercizi è giornaliera]]. Build di produzione del 27 settembre: 258 pagine su 258 passano il controllo, mediana 868 parole.

## Dominio
Consiglio di Claude, 26 settembre 2026, non ancora deciso: un dominio `.it` col nome del marchio, corto e senza parole chiave dentro, comprato e collegato prima di chiedere l'indicizzazione. I link guadagnati su `vercel.app` andrebbero persi in parte con un trasloco successivo, e per un pubblico italiano il `.it` è l'unico segnale geografico che Google legge dal dominio. Se `sapiens.it` è preso (da verificare), varianti come `sapiensscuola.it` o `studiasapiens.it`. Dal 27 settembre il nome stesso è in discussione (vedi [[Azioni SEO]]); dal 28 settembre il candidato principale è `articolo34.it`, da confermare con una prova (vedi [[2026-09-28 Il nome si sceglie con una prova a voce, Articolo34 contro Sapiens e Volevasi]]). Vercel non vende domini `.it`: si comprano da un registrar italiano e si puntano i DNS a Vercel. Il codice è pronto: si imposta `PUBLIC_SITE_URL` su Vercel, si rifà il deploy, si mette un 301 da `sapiens-edu.vercel.app` e si verifica il dominio in Search Console come proprietà DNS.

## Strumenti
Prima del lancio si misurano la salute tecnica, la velocità e la domanda di ricerca; dopo, la fonte che conta è Search Console.
- Google Search Console: impressioni, clic, posizione, pagine indicizzate e perché le altre no.
- Unlighthouse (npm): Lighthouse su tutte le pagine del sito. Lighthouse CI (`@lhci/cli`): soglie nei test.
- Vercel Speed Insights: Core Web Vitals degli utenti veri; già installato, parte solo col consenso ai cookie.
- Screaming Frog SEO Spider (gratis fino a 500 URL): scansione come Googlebot.
- Google Keyword Planner e Google Trends per i volumi e la stagionalità; Ahrefs Webmaster Tools (gratis sui siti verificati) per i link in entrata.

## Aperto
- Scegliere e comprare il dominio, collegarlo a Vercel e a Search Console.
- Inviare la sitemap solo dopo che Andrea ha riletto almeno il primo anno: una lezione indicizzata con un errore diventa pubblica.
- Peso delle pagine: misurare i Core Web Vitals su telefono.
- 7 capitoli di matematica hanno 106-116 parole: manca un paragrafo introduttivo per capitolo. Le descrizioni dei nodi sono vuote.
- Una pagina di ricerca `/cerca?q=` con URL propria, da usare come `SearchAction` nei dati strutturati.
- Sulle ricerche generiche competono YouMath, Matematicamente e Skuola.net; un dominio nuovo parte dalla coda lunga. Indicare chi ha riletto ogni lezione (Andrea, con un profilo) darebbe a Google un responsabile identificabile. Non discusso.

## Collegamenti
- [[Azioni SEO]]: la lista delle cose da fare, in ordine
- [[Pipeline lezioni]], [[Esercizi]], [[2026-09-26 SEO e scheda degli esercizi]]
