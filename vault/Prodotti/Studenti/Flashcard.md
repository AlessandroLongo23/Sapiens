---
stato: in sviluppo
release: beta
aggiornato: 2026-09-24
tag: [prodotto, studenti]
---
# Flashcard

## Stato attuale
Dal 24 settembre 2026 le 18 lezioni scritte hanno un mazzo ciascuna, 346 carte in tutto, scritte da Claude e da rileggere da Alessandro. Si scrivono in `docs/lezioni/flashcard/NN-slug.md` (una carta è `## id`, domanda, `---`, risposta; regole in `docs/lezioni/stile.md`) e `scripts/lezioni/publish.mts` le salva come JSON nella colonna `content_nodes.flashcards` (migrazione `20260924120000_flashcards.sql`, già applicata). L'id di ogni carta non cambia più dopo la pubblicazione, perché i progressi si attaccheranno a quello.

La pagina `.../flashcards` mostra le carte in ordine di lezione: domanda, "Mostra la risposta", poi "Da ripassare" o "La sapevo" (anche con i tasti 1 e 2). Alla fine si ripassano solo le carte sbagliate, finché non ne resta nessuna. La carta è una scheda a righe: domanda e risposta sono scritte sulle righe, anche con le frazioni (verificato su tutte le 346 carte). La risposta è coperta da un adesivo del colore della materia che si stacca: un tocco lo stacca con una breve tensione prima del distacco (risposta leggibile a circa 400 ms), trascinando lo si stacca a mano da qualunque lato e se lo si lascia presto si riattacca. Spazio e Invio lo tolgono subito, e con "riduci movimento" svanisce senza animazione. Il componente è `src/components/content/flashcards/PeelSticker.tsx`. Niente viene salvato. La pagina è per i piani con la funzione flashcard, come gli esercizi: agli altri mostra il paywall con la prima domanda. Le lezioni con un mazzo entrano nella sitemap. In produzione c'è ancora il segnaposto "in arrivo" fino al deploy.

## Obiettivo
Domande e risposte per lezione, con ripasso a intervalli crescenti. La [[ROADMAP]] prevedeva un campo `flashcards` accanto a `theory` e `formulary` nel modello dei contenuti.

## Domande aperte
- Ripasso a intervalli crescenti: serve una tabella dei progressi per carta, da progettare insieme a quella dei tentativi degli esercizi ([[Schema dati]]).
- Le flashcard restano a pagamento, o una parte è gratuita come richiamo?
