---
stato: bozza
release: beta
aggiornato: 2026-10-07
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
- 3 ottobre 2026: per la chimica c'è una lista di controllo degli argomenti, `docs/lezioni/chimica/confronto-atzeni.md`, ricavata dai titoli dei video del prof. Atzeni: ogni lezione si confronta con la sua riga prima di chiuderla. Non è una fonte. L'albero di chimica ha due lezioni in più (159). Vedi [[2026-10-03 Video del prof. Atzeni]].
- 5 ottobre 2026: il terzo anno di matematica, 25 lezioni (file 105-129) con formulari, flashcard e 25 generatori, scritto da sette gruppi in parallelo sul brief `docs/lezioni/brief-terzo-anno.md`, in due fasi (lezioni, poi generatori). Scritto e verificato, non ancora pubblicato. `publish.mts` non ha un filtro per numero: con modifiche di più sessioni nella cartella pubblica tutto quello che trova. Vedi [[2026-10-05 Terzo anno di matematica]].
- 6 ottobre 2026: il terzo anno di chimica, 33 lezioni (file 48-82) con formulari, flashcard, figure interattive e 33 generatori, scritto da dieci gruppi in parallelo sul brief `docs/lezioni/chimica/brief-terzo-anno.md`; ogni gruppo ha fatto le due fasi di seguito. Pubblicato lo stesso giorno da un worktree pulito di `origin/master`, che lascia fuori le modifiche di altre sessioni. Vedi [[2026-10-06 Terzo anno di chimica]].
- 7 ottobre 2026: il terzo anno di informatica, 34 lezioni (file 65-98) con formulari, flashcard, 46 figure interattive e 34 generatori, scritto da quattordici gruppi in parallelo sul brief `docs/lezioni/informatica/brief-terzo-anno.md`, dentro un worktree suo (`Sapiens-informatica-terzo`) per non toccare la cartella dove lavorano le altre sessioni. Prima dei gruppi tre agenti hanno preparato quello che al sito mancava (file nei programmi, modulo degli esercizi con il codice, kit delle figure); durante il lotto l'editor è stato corretto su segnalazione dei gruppi; alla fine due revisori rileggono testi ed esercizi. Scritto e non ancora committato né pubblicato. Da ricordare per i prossimi lotti in una cartella condivisa: su un disco che non distingue maiuscole e minuscole un gruppo ha sovrascritto il file di un altro (`Listato.tsx` su `listato.tsx`, ripristinato dalle source map), e in un worktree nuovo `scripts/figure/` va installato a parte, altrimenti le figure TikZ non si possono guardare. Vedi [[2026-10-07 Terzo anno di informatica]] e [[Informatica terzo anno, da sistemare]].

## Obiettivo
Claude produce le lezioni alla velocità che può e Andrea le rilegge con i suoi tempi, entro la scadenza della beta (vedi [[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]); dal 27 settembre 2026 rilegge anche Alessandro ([[2026-09-27 I contenuti li rileggono Andrea e Alessandro]]). Dopo la matematica delle superiori vengono le altre materie delle superiori, poi le medie a partire dalla matematica ([[2026-09-27 Dopo la matematica delle superiori le altre materie, poi le medie]]), a lotti completi di teoria, esercizi, formulario e flashcard (vedi [[2026-09-24 Si lavora a lotti completi]]); servono abbastanza per la matematica dei cinque anni entro gennaio 2027 (150-200 lezioni). Il minimo per il lancio è il biennio.

Flusso proposto:
1. Scaletta dell'argomento dal [[Programma ministeriale]]: prerequisiti, obiettivi, cosa includere.
2. Bozza generata dall'AI.
3. Controllo automatico (`scripts/lezioni/check.mts`) e rilettura di Andrea secondo lo [[Standard di qualità]]: correttezza, ordine, esempi, notazione. Le domande principali di ogni lotto vanno in [[Domande per Andrea]], dove si segnano anche le risposte.
4. Formulario, flashcard e collegamenti agli esercizi generati insieme alla lezione.
5. Pubblicazione: la pagina diventa indicizzabile.

## Domande aperte
- Quanto tempo richiede davvero una lezione con questo flusso? Misurarlo sulle prime 10.
- Figure e grafici: chi li fa e con quale strumento (TikZ, SVG, manim)? Il vecchio [[TODO]] parlava di convertire TikZ in WebP. Per la chimica è stato provato RDKit il 25 settembre 2026, con sei lezioni di prova: vedi [[2026-09-25 Chimica con RDKit]]. Per la fisica deciso il 29 settembre 2026: TikZ per le statiche, il kit per le interattive, i grafici in TikZ, come quelli di matematica, finché non c'è il piano cartesiano del kit (vedi [[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]]).
- Claude invece di `gpt-4o` per le bozze? La riscrittura del 23 settembre 2026 è un primo termine di paragone. Vedi [[Provider AI]].
- Come arrivano le lezioni nel database: oggi a mano da `admin/wiki`, domani con uno script che carica i file di `docs/lezioni/`?
