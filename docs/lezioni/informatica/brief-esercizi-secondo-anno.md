# Brief degli esercizi del secondo anno di informatica (5 ottobre 2026)

Per chi scrive i generatori di esercizi di un gruppo di lezioni del secondo anno di informatica (lezioni 33-64). Le
lezioni sono scritte e pubblicate; mancano gli esercizi. Il primo anno li ha già.

Alessandro ha chiesto che negli esercizi di programmazione entrino i diagrammi di flusso e il codice:

- a scelta multipla, le opzioni possono essere diagrammi di flusso, oppure programmi, tra cui scegliere quello giusto;
- a risposta aperta, lo studente costruisce il diagramma di flusso, oppure scrive il programma.

Il sito lo sa fare dal 5 ottobre. Il generatore di riferimento è `inf-ciclo-while`: leggilo per primo.

Non si pubblica nulla e non si collega nulla al sito: lo fa chi coordina.

## Da leggere prima di scrivere, in quest'ordine

1. `scripts/exercises/README.md`: la pipeline dei generatori.
2. `src/lib/exercises/v2/types.ts`: i tipi. Nuovi: `ChoiceOption.chart` e `.code`, `Sample.chart` e `.code`,
   `solutionChart`, `solutionCode`, `ChartAnswer`, `ProgramAnswer`.
3. `src/lib/exercises/v2/inf-programmi.ts`: gli aiuti comuni, da usare per tutti i generatori di questo lotto, anche
   quelli senza programmazione: `makeGenerator`, `choose`, `textOption`, `shuffle`, e per i programmi `lines`,
   `output`, `codes`, `plain`, `chartOption`, `codeOption`, `writtenOption`, `wrongPrograms`, `chartAnswer`,
   `programAnswer`.
4. Il riferimento, tre file: `specs/exercises/inf-ciclo-while.md`,
   `src/lib/exercises/v2/generators/inf-ciclo-while.ts`, `scripts/exercises/checkers/inf_ciclo_while.py`, e gli aiuti
   del controllo in `scripts/exercises/checkers/_inf_programmi.py`.
5. La lezione di ogni generatore, in `docs/lezioni/informatica/riscritte/NN-slug.md`, con formulario e flashcard: gli
   esercizi seguono la lezione, le sue parole e i suoi esempi, senza copiarli.
6. Per le lezioni senza programmazione, un generatore di concetto del primo anno come modello di come si compongono
   le domande: `src/lib/exercises/v2/generators/inf-funzioni-so.ts` con la sua specifica e il suo controllo (lì i
   testi sono in LaTeX con `\text{}`; in questo lotto si scrive in testo semplice, vedi sotto).

## Cosa consegnare per ogni lezione

`slug` è lo slug della lezione, che è anche l'id del generatore.

| File | Cosa |
|---|---|
| `specs/exercises/slug.md` | la specifica: livelli, vincoli, un esempio per livello, distrattori, cosa evitare |
| `src/lib/exercises/v2/generators/slug.ts` | il generatore, esportato come `default`, con `id` uguale allo slug |
| `scripts/exercises/checkers/slug_con_underscore.py` | il controllo indipendente in Python |

## Regole per tutti i generatori

- Si usa `makeGenerator` di `inf-programmi.ts`: i campioni sono in testo semplice (`format: 'text'`), con le formule
  in `$…$` solo dove servono; niente `\text{}`.
- Da 4 a 6 livelli, nell'ordine della lezione, ognuno con una sola difficoltà in più. Ogni livello ha un nome di
  poche parole nella lingua dello studente (`label`).
- Ogni esercizio ha la scelta multipla con quattro opzioni diverse. I distrattori vengono dagli errori veri degli
  studenti, quelli dei riquadri `ad-warning` della lezione.
- `steps` spiega come si arriva alla risposta in due o tre frasi, in italiano; `solution` è la risposta in una riga.
- Almeno un centinaio di esercizi diversi per livello su 1000 (si conta su `params`). Per le lezioni di concetto le
  domande si compongono da pezzi intercambiabili (situazioni, oggetti, affermazioni); niente domande di pura
  memoria su date o nomi.
- Scrittura: dai del tu; niente trattini lunghi, niente "piuttosto che"; niente marchi tranne dove la lezione li usa
  come esempio; indirizzi e nomi inventati come nella lezione (`esempio.it`, `192.0.2.x`).
- `params` porta tutto quello che serve al controllo per ricalcolare la risposta, e una chiave `case` (o simile) con
  il caso dell'esercizio, per le quote.

## Lezioni senza programmazione (33-44, 51)

Tutti i livelli sono a scelta multipla: `answer` è la scelta (`choose` con opzioni `textOption`). Dove la lezione ha
un conto (le combinazioni di una password, i byte di un indirizzo IP, le parti di un URL) almeno un livello è su quel
conto, costruito all'indietro. Il controllo Python ricostruisce la risposta dai pezzi (una tabella sua di che cosa è
vero), non dal testo.

## Lezioni con la programmazione (45-50, 52-64)

Un programma di un esercizio si scrive una volta sola, nel linguaggio dei blocchi `diagramma` (`leggi`, `scrivi`,
assegnamento, `se` / `altrimenti`, `finché`; `E`, `O`, `NON`; vedi `docs/lezioni/README.md`, "Il diagramma di flusso
da eseguire"). Da lì `inf-programmi.ts` ricava il diagramma, il programma in Python e in C++, e quello che scrive.

- **Che cosa si può usare**, perché diagramma, Python e C++ scrivano la stessa cosa (lo controlla `plain`, da
  chiamare nel `check()` su ogni programma mostrato o chiesto): numeri interi e testi; `+ - *`; `//` e `%` solo tra
  numeri mai negativi; confronti, `E`, `O`, `NON`. Niente `/`, niente decimali, niente valori vero o falso scritti
  con `scrivi`. Dove la lezione parla proprio di queste differenze (54, 56, 64) quei livelli sono a scelta multipla
  con opzioni di testo, costruite a mano per i due linguaggi, senza passare da `codes`.
- **Tipi di livello**, da combinare secondo la lezione:
  - che cosa scrive un programma o un diagramma (mostrato con `code` o `chart`; opzioni `writtenOption`);
  - quale programma corrisponde a un diagramma, o a una consegna (opzioni `codeOption`);
  - quale diagramma corrisponde a un programma, o a una consegna (opzioni `chartOption`);
  - costruire il diagramma (`answer: chartAnswer(...)`, con la scelta multipla di diagrammi in `choice`);
  - scrivere il programma (`answer: programAnswer(...)`, con la scelta multipla di programmi in `choice`);
  - domande di concetto sulla lezione, a scelta multipla di testo.
- **Quanti di ogni tipo.** Ogni generatore di queste lezioni ha almeno un livello con opzioni che sono diagrammi o
  programmi, e almeno un livello a risposta aperta. Le lezioni 45, 46, 48, 49, 50 vengono prima dei linguaggi: lì
  l'aperta è costruire il diagramma, e i programmi come opzioni si usano solo dove la lezione mostra del codice. Le
  lezioni 52-64 hanno sia "costruisci il diagramma" (dove la lezione ha un diagramma) sia "scrivi il programma".
- **Le prove di una risposta aperta.** Almeno due, su ingressi diversi che fanno percorrere rami diversi; un
  programma che non legge niente ha due prove uguali. Gli ingressi stanno in `params.tests`.
- **Di che cosa è fatta la risposta.** Correggere solo l'uscita lascia passare un `for` dove la consegna chiede un
  `while`, e sei `print` in fila dove serviva un ciclo. Un livello aperto dichiara i costrutti che la risposta deve
  contenere: `needing(chartAnswer(…), 'ciclo')`, `'selezione'`, `'annidati'` (un ciclo dentro un altro), e per un
  programma anche `'while'` o `'for'` quando la consegna lo nomina; `...structure(source)` chiede i cicli e le selezioni della soluzione, per chi traduce
  (dallo pseudocodice, dai salti, dai blocchi). Non si chiede un costrutto dove una risposta giusta può farne a
  meno (una selezione dentro un ciclo che cerca il massimo si può scrivere con `max`). Un livello che chiede un
  costrutto legge i suoi numeri e ha prove che scrivono cose diverse: senza, `check()` lo boccia.
- **I distrattori che sono programmi** devono essere davvero sbagliati: `wrongPrograms` tiene solo quelli che sulle
  prove scrivono altro dal giusto. Prepara più errori di quanti ne servono (almeno cinque), ognuno un errore diverso
  che uno studente fa.
- **Larghezza.** Le opzioni stanno due per riga quando ci stanno, altrimenti una per riga; su un telefono c'è posto
  per circa 330 px. Un'opzione che è un diagramma ha al più un ciclo o una selezione (due rombi in cascata sono
  troppo larghi); un programma ha righe di al più 34 caratteri e al più 9 righe in Python.
- **Il controllo Python** usa `checkers/_inf_programmi.py`: `common(sample)` fa i controlli generali (esegue con
  Python ogni programma, tradotto da sé, e confronta), e chiede in `params` la chiave `source` (il programma di
  riferimento) e `tests` (le liste di ingressi). Il controllo del generatore aggiunge quello che è proprio dei suoi
  livelli, ricalcolato in Python e non copiato dal generatore.

## Guardare gli esercizi

Il sito in sviluppo è acceso sulla porta 3000. Un esercizio si vede, e si prova fino al verdetto, a
`http://localhost:3000/prova-grafico/esercizio?g=<slug>&l=<livello>&seed=<seed>`; con `&open=1` è chiesto a risposta
aperta, dove il livello ne ha una. Funziona anche per un generatore non ancora collegato al sito. Guarda almeno due
semi per livello, e per i livelli aperti consegna una risposta giusta e una sbagliata. Non avviare altri server.

`review.mts` e `width.mts` sono fatti per i campioni in LaTeX e non servono in questo lotto.

## Verifiche, tutte da eseguire e da riportare

```sh
# 1000 esercizi per livello con tre seed: devono dare PASS
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts <slug> 1000 all 1 | python3 scripts/exercises/verify.py
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts <slug> 1000 all 50001 | python3 scripts/exercises/verify.py
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts <slug> 1000 all 777001 | python3 scripts/exercises/verify.py
npx tsc --noEmit -p .
npx eslint src/lib/exercises/v2/generators/<slug>.ts
```

Poi pianta apposta qualche errore in un campione (l'opzione giusta cambiata, un distrattore che fa quello che fa il
giusto, una prova con l'uscita sbagliata) e controlla che `verify.py` lo bocci. Conta quanti esercizi diversi escono
su 1000 per ogni livello.

## Regole di lavoro

- La cartella è condivisa con altre sessioni e con gli altri gruppi. Crea solo i file della tabella, per le lezioni
  che ti sono affidate, più eventuali moduli di aiuto tuoi con un nome che comincia con il prefisso che ti viene
  assegnato. Non modificare file esistenti: in particolare `inf-programmi.ts`, `_inf_programmi.py`, `types.ts`,
  `src/lib/exercises/index.ts`, `config.ts`, `level-names.ts`, `v2/open-answers.ts`, le lezioni, i README, il vault.
  Se a `inf-programmi.ts` manca qualcosa, scrivilo nel tuo modulo e segnalalo nel rapporto.
- Niente comandi git che cambiano qualcosa. Niente `rm` su file che non hai creato tu. Niente `pkill` o simili.
- Niente scritture nel database e niente pubblicazione.
- I file temporanei vanno in una cartella tua sotto `/tmp`, non nella repo.
- `tsc` non deve dare errori nei tuoi file; errori in file di altri gruppi, che stanno scrivendo nello stesso
  momento, non sono tuoi: segnalali e basta.

## Rapporto finale

Breve e fattuale, in italiano:

1. i file creati;
2. per ogni generatore: i livelli con il loro nome, di che tipo è ciascuno (testo, opzioni diagramma, opzioni
   programma, costruisci il diagramma, scrivi il programma) e quali hanno la risposta aperta; l'esito delle tre
   verifiche; quanti esercizi diversi su 1000 per livello;
3. l'esito di `tsc` ed ESLint; se gli errori piantati sono stati bocciati;
4. che cosa hai guardato nella pagina di prova, e che cosa hai corretto;
5. le domande per Andrea, una riga ciascuna;
6. quello che non sei riuscito a fare o che hai lasciato a metà, detto chiaramente.
