---
stato: decisa
aggiornato: 2026-09-26
tag: [decisione, esercizi, seo]
---
# Una scheda di esercizi gratuita e indicizzata per ogni lezione

## Decisione
Ogni pagina esercizi ha, oltre al percorso di livelli, una scheda da fare sul quaderno: 6 esercizi per livello presi dai generatori della lezione, numerati come in un libro, con la consegna scritta una volta per livello e il risultato piegato sotto ogni esercizio. La scheda 1 è la stessa per tutti, è gratuita e Google la indicizza. "Un'altra scheda" apre le schede da 2 a 20 (`?scheda=n`), che non si indicizzano. Chi non ha accesso al percorso vede prima la scheda e poi l'invito; chi ce l'ha vede il percorso in cima e la scheda sotto.

## Perché
Alessandro, 26 settembre 2026: gli esercizi servono in due modi. La prova veloce a scelta multipla si fa dal telefono, in qualsiasi momento, anche solo per non perdere la serie, come Duolingo. La scheda è l'altro modo, quello dell'eserciziario: lo studente si mette alla scrivania con il quaderno e fa gli esercizi uno alla volta, con tutto lo svolgimento. Nei libri, soprattutto all'università, ci sono pagine con decine o centinaia di esercizi, e interi libri che sono solo eserciziari.

La scheda è anche un aggancio per la ricerca. Chi cerca "esercizi equazioni di secondo grado" trova una lista di Sapiens, apre il sito e scopre il resto del materiale. Prima di questa decisione la pagina esercizi mostrava a Google circa 200 parole e nessun esercizio, perché gli esercizi li genera il browser; l'alternativa discussa era metterla in `noindex`, rinunciando alla ricerca.

Scelte sul come, proposte da Claude e approvate:
- Una pagina per lezione con qualche decina di esercizi, e non centinaia di pagine con un esercizio ciascuno. Dal 2024 Google tratta come spam le pagine prodotte in serie con poco valore ("scaled content abuse", nelle regole anti spam di Google Search); una pagina che fa quello che fa un eserciziario vero non rientra.
- Seed fisso, ricavato dalla lezione e dal numero di scheda: la pagina che Google indicizza è quella che legge lo studente. Numeri nuovi a ogni visita avrebbero dato a Google una pagina diversa da quella dei visitatori.
- Un solo indirizzo, `/esercizi`, e non una pagina `/scheda` separata, che si sarebbe contesa la stessa ricerca.
- Il risultato è gratis, come le soluzioni in fondo al libro. Lo svolgimento passo passo, il percorso con i progressi e la correzione restano del percorso: la scheda non toglie il motivo per iscriversi.
- Le schede successive sono al massimo 20, perché un numero illimitato di indirizzi sarebbe una trappola per il crawler.

## Conseguenze
- Nel codice il 26 settembre 2026 (commit `c170b79`), non ancora pubblicato: `src/lib/server/worksheet.ts` costruisce la scheda, `src/components/content/exercises/Worksheet.tsx` la mostra, la pagina esercizi la mette prima o dopo il percorso. Le parole per pagina nella sitemap (mediana) passano da 415 a 980.
- Aggiornate [[Esercizi]] e [[SEO]].
- Gli esercizi di oggi sono tarati per la scelta multipla. Per la scrivania servono livelli con esercizi più lunghi (espressioni, equazioni con più passaggi, problemi) e, per i problemi non parametrizzabili, la banca statica prevista in [[Esercizi]]. Non ancora discusso.
- La correzione dalla foto dello svolgimento è la funzione che completa la scheda: vedi [[Foto e soluzione]].

## Collegamenti
- [[Esercizi]], [[SEO]], [[Pipeline esercizi]]
- [[2026-09-25 Gli esercizi sono un percorso di livelli]]
- [[2026-09-26 SEO e scheda degli esercizi]]
