---
stato: in sviluppo
release: beta
aggiornato: 2026-09-23
tag: [prodotto, studenti, contenuti]
---
# Lezioni

La teoria di Sapiens: una lezione per argomento, ordinata come il programma ministeriale, gratuita e indicizzata da Google.

## Stato attuale
- Matematica delle superiori riorganizzata il 24 settembre 2026 secondo le Indicazioni nazionali e l'ordine dei libri: 39 capitoli e 183 lezioni (104 nel biennio, 79 nel triennio), 18 scritte. L'albero è in `docs/lezioni/albero.md` e si applica con `scripts/lezioni/tree.mts`; 63 vecchi indirizzi reindirizzano ai nuovi (`PATH_ALIASES` in `src/lib/seo/slug.ts`). Vedi [[Programma ministeriale]].
- Albero livello → materia → capitolo → lezione nella tabella Supabase `content_nodes` (letta da `src/lib/server/content.ts`). La migrazione di questa tabella non è nella repo.
- 277 nodi: 3 livelli, 10 materie, 76 capitoli, 188 lezioni. Solo 18 lezioni hanno la teoria, tutte di matematica delle superiori; le altre 170 sono pagine vuote in `noindex`. Nessun nodo ha una descrizione (dati del 3 settembre 2026, `SEO-TODO.md`).
- Pagina lezione in `src/app/materiale/[level]/[subject]/[chapter]/[topic]/page.tsx`: teoria in markdown, formule KaTeX renderizzate sul server, indice, pannello di [[Sapiens AI]], blocco "Chiedi aiuto a un tutor", nota dello [[Zaino]] collegata.
- Revisione del 23 settembre 2026 (vedi [[2026-09-23 Revisione delle lezioni]]): 3 delle 18 lezioni sono troncate nel database a metà frase (Sottoinsiemi e uguaglianza, Unione insiemistica, Funzioni iniettive, suriettive e biettive), "Rappresentazione degli insiemi" è una copia di "Prime definizioni", e quasi tutte hanno errori di matematica. Le 18 lezioni sono state riscritte e caricate nel database lo stesso giorno, al posto degli originali, con `scripts/lezioni/publish.mts`; gli originali restano in `docs/lezioni/originali/`.
- Disegni TikZ: fino al 23 settembre 2026 non comparivano da nessuna parte, né in locale né in produzione. TikZJax v1 si avvia solo da `window.onload`, e il sito lo carica dopo quell'evento; in più la CSP bloccava il suo bucket S3. Corretti `src/lib/utils/tikzjax.ts` e `next.config.ts`, più un filtro per il tema scuro in `src/app/globals.css`. In produzione la correzione arriva con il prossimo deploy.
- Figure come file SVG (23-24 settembre 2026): lo script di pubblicazione compila ogni blocco TikZ in SVG con node-tikzjax (`scripts/figure/`), trasforma le lettere in tracciati, carica il file nel bucket `figure` di Supabase Storage con un nome descrittivo e il testo alternativo preso da `% alt`. Il sito mostra un `<img>`, indicizzabile da Google Immagini, senza caricare il motore TeX; TikZJax resta solo come ripiego per le figure modificate e non ancora ripubblicate. Compressa, una figura pesa circa 3 KB, meno della metà di un WebP equivalente. Dettagli in `src/lib/content/figures.ts`. 19 figure in 7 lezioni.
- Pagina formulario per lezione: esiste, ma c'è un solo formulario ed è incompleto.
- Area staff: `admin/wiki` modifica l'albero, `admin/desk` genera bozze con l'AI (vedi [[Pipeline lezioni]]).

## Obiettivo
- [[Release Beta]]: matematica delle superiori, tutti e cinque gli anni come obiettivo, almeno il biennio completo.
- [[Release v1.0]]: STEM del liceo scientifico (matematica, fisica, chimica, scienze, informatica).
- Ogni lezione ha teoria, esempi svolti, formulario, esercizi collegati e prerequisiti collegati ad altre lezioni.

## Dettagli
- Idee dal vecchio [[TODO]]: prerequisiti espliciti ("conoscenze pregresse"), molti link interni tra lezioni, esercizi a fine lezione e a fine capitolo, struttura simile a Khan Academy, link a una sezione della lezione.
- Ordine degli argomenti: da decidere se segue le Indicazioni nazionali o un libro di testo diffuso. Vedi [[Programma ministeriale]].

## Domande aperte
- Come si gestiscono le differenze tra indirizzi (liceo scientifico ordinario, scienze applicate, tecnici)?
- Le lezioni restano tutte gratuite? Oggi sì (piano Free), ed è la base della [[SEO]].

## Collegamenti
- [[Pipeline lezioni]], [[Standard di qualità]], [[Programma ministeriale]]
