---
aggiornato: 2026-10-07
tag: [sessione, contenuti, università]
---
# Programmi dei corsi di base di ingegneria

Sessione del 7 ottobre 2026. Alessandro ha notato che Analisi matematica II ha 3 lezioni, e numeri simili gli altri corsi di base, e ha chiesto di ricontrollare gli esami comuni a tutte le ingegnerie sui programmi degli atenei e di stilare capitoli e lezioni per ciascuno.

## Cosa è stato fatto
- Controllato l'albero in produzione: Analisi I 8 lezioni, Analisi II 3, Fisica I 5, Fisica II 5, Fondamenti di informatica 5, tutte vuote. Chimica e Geometria e algebra lineare non esistono.
- Cinque agenti di ricerca hanno letto i syllabus ufficiali (Politecnico di Milano, Politecnico di Torino, Bologna, Padova, Pisa, Sapienza, Napoli, Genova, Firenze, Trento) e proposto capitoli e lezioni. Le note: [[Programma di Analisi matematica I e II]], [[Programma di Fisica I e II]], [[Programma di Geometria e algebra lineare]], [[Programma di Chimica per ingegneria]], [[Programma di Fondamenti di informatica]]. Il riepilogo è in [[Corsi universitari da aggiungere]].
- Le proposte sono state scritte dagli agenti e lette da Claude solo a campione (Analisi I per intero). I punti "da verificare" sono in fondo a ogni nota.

## Decisioni di Alessandro
- Niente mappa per ateneo: [[2026-10-07 I corsi universitari non hanno una mappa per ateneo]].
- Analisi II divisa in Analisi II e Metodi matematici; numeri complessi in Analisi I; in Fondamenti di informatica il linguaggio lo sceglie lo studente. Sono registrate in [[Corsi universitari da aggiungere]], senza una nota a testa in `Decisioni/`.

## Caricato nel database
- Su richiesta di Alessandro, gli alberi dei cinque corsi esistenti sono in produzione dal 7 ottobre 2026, con `scripts/lezioni/tree.mts` e i file in `docs/lezioni/universita/corsi-di-base/alberi/`: 72 capitoli e 572 lezioni vuote al posto di 20 capitoli e 26 lezioni vuote. Copia dei nodi cancellati in `docs/lezioni/backup/content_nodes-universita-2026-10-07.json`. Controllato sul sito.
- Lo slug `serie-di-Taylor` di un vecchio capitolo è stato messo in minuscolo prima di cancellarlo, perché lo script accetta solo minuscole. Lo script va lanciato con `JITI_ALIAS='{"@":"<repo>/src"}'`, altrimenti non risolve `@/lib/config/site`.
- I prefissi degli slug: `an1`, `an2`, `mm`, `fis1`, `fis2`, `gal`, `chu` (Chimica), `fdi` (Fondamenti di informatica); `chim` e `inf` sono già usati dalle superiori.

## Le tre materie nuove
- Su richiesta di Alessandro, Metodi matematici, Geometria e algebra lineare e Chimica hanno un oggetto in tre dimensioni con l'animazione (`epicycles`, `basis` e `flask` in `scripts/materie/icons.py`, file in `public/materie/`), il tono in `icons.ts`, la scheda in `LibraryCovers.tsx` e, per Chimica, un'area tra i filtri. Dopo il deploy gli alberi sono stati caricati nel database.
- Aggiornati i testi dei cinque corsi rifatti in `LibraryCovers.tsx` e `subject-copy.ts`, e la figura della guida di Fisica II (`scripts/figure/guides.mjs`): la legge di Gauss al posto del ciclo termodinamico.

## Rimasto da fare
- Alessandro guarda i tre oggetti nuovi e le loro animazioni: sono una prima versione.
- Estendere il blocco `codice` per il testo che cambia con il linguaggio.
- Rileggere le proposte: Claude ha letto per intero solo Analisi I.
