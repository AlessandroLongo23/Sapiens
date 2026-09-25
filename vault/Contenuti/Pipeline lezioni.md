---
stato: bozza
release: beta
aggiornato: 2026-09-25
tag: [contenuti, ai]
---
# Pipeline lezioni

Come si produce una lezione pronta da pubblicare.

## Stato attuale
- `src/app/api/generate-draft`: generatore di bozze con due ruoli, uno scrive e uno critica, su `gpt-4o`, solo per lo staff, usato da `admin/desk`.
- Una bozza di esempio: `docs/drafts/moto-parabolico.md`.
- 18 lezioni pubblicate, scritte con un altro modello e caricate tutte il 30 novembre 2025.
- 23 settembre 2026: le 18 lezioni riscritte da Claude (Opus 5.5) con un brief di stile (`docs/lezioni/stile.md`), sei agenti in parallelo, ogni conto verificato con SymPy e ogni lezione riletta. Tempo: circa 10 minuti di esecuzione più la rilettura. Controllo automatico in `scripts/lezioni/check.mts`. Dettagli e decisioni da prendere in `docs/lezioni/README.md`.
- 24 settembre 2026: formulari e flashcard delle 18 lezioni, cinque agenti in parallelo sulle regole aggiunte a `docs/lezioni/stile.md`, circa 4 minuti di esecuzione. File in `docs/lezioni/formulari/` e `docs/lezioni/flashcard/`, stesso controllo automatico; `scripts/lezioni/publish.mts` pubblica teoria, formulario e flashcard, e non sovrascrive mai un contenuto cambiato nel database dopo l'ultima pubblicazione.

## Obiettivo
Claude produce le lezioni alla velocità che può e Andrea le rilegge con i suoi tempi, entro la scadenza della beta (vedi [[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]), a lotti completi di teoria, esercizi, formulario e flashcard (vedi [[2026-09-24 Si lavora a lotti completi]]); servono abbastanza per la matematica dei cinque anni entro gennaio 2027 (150-200 lezioni). Il minimo per il lancio è il biennio.

Flusso proposto:
1. Scaletta dell'argomento dal [[Programma ministeriale]]: prerequisiti, obiettivi, cosa includere.
2. Bozza generata dall'AI.
3. Controllo automatico (`scripts/lezioni/check.mts`) e rilettura di Andrea secondo lo [[Standard di qualità]]: correttezza, ordine, esempi, notazione.
4. Formulario, flashcard e collegamenti agli esercizi generati insieme alla lezione.
5. Pubblicazione: la pagina diventa indicizzabile.

## Domande aperte
- Quanto tempo richiede davvero una lezione con questo flusso? Misurarlo sulle prime 10.
- Figure e grafici: chi li fa e con quale strumento (TikZ, SVG, manim)? Il vecchio [[TODO]] parlava di convertire TikZ in WebP. Per la chimica è stato provato RDKit il 25 settembre 2026, con sei lezioni di prova: vedi [[2026-09-25 Chimica con RDKit]].
- Claude invece di `gpt-4o` per le bozze? La riscrittura del 23 settembre 2026 è un primo termine di paragone. Vedi [[Provider AI]].
- Come arrivano le lezioni nel database: oggi a mano da `admin/wiki`, domani con uno script che carica i file di `docs/lezioni/`?
