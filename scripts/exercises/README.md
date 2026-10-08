# Pipeline dei generatori di esercizi (v2)

Prototipo, non collegato al sito. Un generatore produce esercizi deterministici a partire da un seed
e da un livello; un verificatore indipendente in Python (SymPy, aritmetica esatta) controlla ogni
campione; una pagina HTML mostra 10 esempi a un revisore umano.

- `specs/exercises/<id>.md`: la specifica leggibile (livelli, vincoli, esempi, cosa evitare).
- `src/lib/exercises/v2/`: interfaccia (`types.ts`), rng deterministico (`rng.ts`), razionali esatti
  (`rational.ts`), formattazione dei polinomi (`latex.ts`), generatori (`generators/`) e `registry.ts`.
- `scripts/exercises/`: `sample.mts` (stampa JSONL), `verify.py` (verifica), `review.mts` (HTML).

## Comandi

Dalla radice del repo. Il TypeScript gira con il jiti già presente in `node_modules`.

```sh
# 1000 esercizi per livello, seed da 1, verificati con SymPy
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts equazioni-secondo-grado 1000 all 1 \
  | python3 scripts/exercises/verify.py

# un solo livello, 5 esercizi a partire dal seed 42
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts equazioni-secondo-grado 5 3 42

# pagina di revisione (10 esempi, formule in MathML, pubblicabile come Artifact); il percorso di uscita è opzionale
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/review.mts equazioni-secondo-grado /percorso/review.html

# risposta aperta: la tabella dei livelli contro i generatori, il correttore su tutti i livelli
# (riferimento, altre scritture, distrattori bocciati, testo copiato bocciato) e i casi scritti a mano
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/open-answers.mts
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/grade-check.mts 100
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/grade-cases.mts

# controllo dei tipi (sull'intero progetto: compilati da soli, i file che importano abstract.ts
# danno falsi errori perché mancano i prototipi globali)
npx tsc --noEmit -p .
```

`sample.mts` esce con codice 1 se un campione viola il `check()` del generatore; se la generazione va
in errore, scrive comunque una riga `{"error": ...}`, così `verify.py` la conta come fallimento e non
come campione mancante. `verify.py` esce con codice 1 se un campione fallisce, se la quota di un caso
esce dall'intervallo della specifica, e stampa per livello conteggi e seed che non passano. Lo stesso
seed produce sempre lo stesso esercizio: per riprodurre un errore basta rigenerare quel seed.

## Esercizi con diagrammi di flusso e programmi

Dal 5 ottobre 2026 un esercizio può mostrare un diagramma di flusso o un programma, averne come opzioni, e chiedere
come risposta aperta un diagramma da costruire (`ChartAnswer`) o un programma da scrivere (`ProgramAnswer`); i tipi
sono in `types.ts`. I generatori delle lezioni di programmazione di informatica scrivono ogni programma una volta
sola, nel linguaggio dei blocchi `diagramma`, e ne ricavano diagramma, codice in Python e in C++ e prove:
`src/lib/exercises/v2/inf-programmi.ts`, con `inf-ciclo-while` come riferimento e il brief in
`docs/lezioni/informatica/brief-esercizi-secondo-anno.md`. Il controllo indipendente esegue ogni programma con
Python (`checkers/_inf_programmi.py`). Una risposta aperta si corregge su quello che scrive e poi, dove il livello
lo dichiara con `needs` (`needing(…, 'ciclo')`, `'selezione'`, `'while'`, `'for'`, `'annidati'`), su quello di cui è
fatta: il server cerca il costrutto nel diagramma o nel codice consegnato (`v2/costrutti.ts`) e, se manca, dà
sbagliato con un messaggio suo. Per un programma la pagina lo dice prima, sopra l'editor. Chi nomina un costrutto
nella consegna ("Usa un ciclo while") lo dichiara. Un livello che chiede un costrutto legge i suoi numeri e ha prove
che scrivono cose diverse, così l'uscita non si batte a mano: lo controllano `makeGenerator` e il controllo Python. I livelli a risposta aperta di questo tipo si dichiarano in `runAnswers`
(`v2/open-answers.ts`). Un esercizio si guarda e si prova, in sviluppo, a
`/prova-grafico/esercizio?g=<id>&l=<livello>&seed=<seed>` (con `&open=1` a risposta aperta); `review.mts` e
`width.mts` valgono solo per i campioni in LaTeX.

## Esercizi con programmi scritti a mano

Dal 7 ottobre 2026, per le lezioni che il linguaggio dei blocchi `diagramma` non copre (funzioni, vettori, stringhe,
file, HTML, CSS, JavaScript), un programma si scrive a mano nei due linguaggi con una funzione TypeScript che dice
che cosa scrive: `src/lib/exercises/v2/inf-codice.ts`, con `inf-vettori` come riferimento e il brief in
`docs/lezioni/informatica/brief-esercizi-codice.md`. Il controllo indipendente esegue il Python di ogni programma
(`checkers/_inf_codice.py`) e, con `INF_CPP=1`, compila ed esegue anche il C++. Un frammento che non è un programma
nei due linguaggi (HTML, CSS, JSON, CSV) va in `listing`: sotto la domanda (`Sample.listing`), con la soluzione
(`solutionListing`) o come opzione (`ChoiceOption.listing`), a larghezza fissa e con le sue righe. Una risposta aperta
può chiedere anche `funzione` (una funzione definita e chiamata dallo studente, non `main`) e `vettore`.

## Esercizi con i grafici

Dal 6 ottobre 2026 un esercizio di matematica può mostrare il piano cartesiano con una o più curve: sotto il
problema (`scene`), con la soluzione (`solutionScene`) e come opzione di una scelta multipla (`ChoiceOption.scene`,
quattro grafici piccoli, due per riga anche sul telefono). Il generatore di riferimento è `funzioni-esponenziali`,
livelli 6 (dalla funzione al grafico) e 7 (dal grafico alla funzione).

Il generatore non disegna: descrive il piano con `piano()` di `src/lib/exercises/v2/piano.ts`, e il server legge
le formule e fa il disegno (`v2/piano-svg.ts`, `src/lib/grafico/statico.ts`, con il campionamento del plotter).
Alla pagina arriva l'SVG finito, quindi nel browser non si carica né il lettore di LaTeX né il campionamento.

```ts
import { piano } from '../piano';

// sotto il problema: finestra x da -4 a 4 e y da -2 a 6, una curva, un asintoto, due punti da leggere sulla griglia
const scene = piano(
	{
		finestra: [-4, 4, -2, 6],
		curve: [{ formula: 'y = 2^x + 1' }, { formula: 'y = 1', tratto: 'tratteggiato' }],
		punti: [{ x: 0, y: 2 }, { x: 1, y: 3 }],
	},
	'Una curva che sale da sinistra verso destra, passa per il punto (0, 2) e a sinistra si avvicina alla retta tratteggiata y = 1 da sopra.',
);
return { ...sample, scene };

// come opzione: `latex` vuoto, la funzione in `values`, il testo per chi non vede uguale all'alt della scena
const option: ChoiceOption = { latex: '', values: ['2^x + 1'], scene, text: scene.alt };
```

- `finestra`: `[x0, x1, y0, y1]`. I due assi hanno la stessa scala, a meno di `forma` (larghezza su altezza). Le
  quattro opzioni di una domanda hanno la stessa finestra.
- `curve`: la formula è LaTeX come lo legge il plotter e come nei blocchi `grafico` delle lezioni: `y = …` per una
  funzione, `x = 2` per una retta verticale, `x^2 + y^2 = 4` per una curva data da un'equazione. Nessun parametro.
  `tratto: 'tratteggiato'` per asintoti e assi di simmetria (grigi), `colore` per cambiare colore.
- `punti`: segnati con un pallino; `etichetta` scrive accanto una lettera o le coordinate. Coordinate intere, a
  mezza unità almeno dal bordo, così si leggono sulla griglia.
- `passo`: ogni quanto scrivere i numeri sugli assi. Senza, li sceglie il disegno: a ogni unità in grande, più radi
  in piccolo. `assi`: i nomi degli assi.
- Il testo alternativo dice com'è fatto il disegno (verso, punti, asintoto), non qual è la funzione.

Regole per i grafici come opzioni: ogni grafico sbagliato è l'errore di uno studente (base reciproca, spostamento
dal lato opposto, simmetria sbagliata), e due grafici qualsiasi si distinguono in piccolo. Il controllo Python lo
verifica con `checkers/_grafici.py`, che rilegge le formule per conto suo: `check_plane` (curva nella finestra,
punti sulla curva e leggibili, asintoto tratteggiato) e `check_graph_options` (il grafico giusto è quello della
funzione del problema, gli altri sono funzioni diverse e lontane almeno il 15% dell'altezza della finestra). Una
spaziatura di 1 tra due curve non basta in una finestra alta 10: nel pilota gli spostamenti sono di 2 o di 3.

`review.mts` disegna i piani nella pagina di revisione ed esce con 1 se una formula non si legge; `width.mts` e
`grade-check.mts` saltano le opzioni che sono grafici. In sviluppo l'esercizio si prova a
`/prova-grafico/esercizio?g=<id>&l=<livello>&seed=<seed>` (con `&open=1` la risposta aperta, anche un numero o una
formula). La scheda giornaliera distingue due esercizi con lo stesso testo dal loro disegno. Quello che c'è oggi è
solo per funzioni e curve da equazione: regioni, punti di una successione e diagrammi a barre non ci sono ancora.

## Aggiungere un generatore

L'id del generatore è lo slug della lezione nel database (per esempio `monomi-mcm-mcd`). File da
scrivere, tutti nuovi, senza toccare quelli di altri generatori:

1. `specs/exercises/<id>.md`: la specifica. Livelli nell'ordine del libro, ognuno con una sola
   difficoltà in più (di solito da 3 a 6); vincoli verificabili; due esempi svolti per livello; gli
   esercizi "brutti" da evitare; i distrattori della scelta multipla. Deve seguire la lezione
   collegata (`docs/lezioni/riscritte/`) e le sue convenzioni (virgola decimale, `\cdot`, MCD e MCM).
2. `src/lib/exercises/v2/generators/<id>.ts`: implementa `Generator` e lo esporta come `default`
   con `id` uguale al nome del file (il registro lo carica da solo). Costruisce all'indietro, usa solo
   l'`Rng` ricevuto, mette in `params` tutto quello che serve per ricalcolare la risposta, scrive i
   passaggi in italiano, ha un `check()` con i vincoli della specifica. Tipo di risposta:
   `number`, `set`, `expression` oppure `choice` (vero o falso, scegli l'insieme giusto). Serve sempre
   una forma a scelta multipla: `toChoice()`, oppure la risposta stessa se è `choice`. Distrattori
   presi dagli errori veri degli studenti. Esempi da seguire: `equazioni-primo-grado.ts`,
   `equazioni-secondo-grado.ts`.
3. `scripts/exercises/checkers/<id con _ al posto di ->.py`: il controllo indipendente, scritto dalla
   specifica e non copiato dal generatore. Definisce `check(sample) -> (errori, caso)` e, se il
   livello ha più casi con quote fissate, `CASE_RANGES`. Gli aiuti comuni si importano con
   `from verify import ...` (`x`, `rat`, `exact`, `canon`, `same_set`, `FORBIDDEN`, SymPy).

Poi:

- `sample.mts <id> 1000 all 1 | verify.py` deve dare PASS;
- errori piantati apposta in qualche campione (risposta cambiata, vincolo violato, opzione giusta
  sbagliata) devono essere bocciati;
- `review.mts <id> <file>` deve uscire con codice 0 (tutto il LaTeX passa da KaTeX); la pagina si
  guarda.
- `width.mts <id>` deve uscire con codice 0: sul telefono il problema sta in 350 px a 18 px e ogni
  opzione in 252 px a 16 px. Un problema più largo va su più righe con `\begin{aligned}` (la pagina lo
  mostra una riga alla volta, vedi `src/lib/exercises/present.ts`); un'opzione più larga con
  `\begin{gathered}`. Il controllo Python deve ricomporre le righe.

Il collegamento alla lezione si fa per ultimo, in due righe: il generatore in
`src/lib/exercises/index.ts` e la lezione in `config.ts`, con il percorso nel database, l'id del
generatore e i livelli che la pagina offre. La pagina legge i campioni direttamente, salva ogni
tentativo in `exercise_attempts` e sceglie il livello dai tentativi.
