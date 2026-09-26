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

# controllo dei tipi (sull'intero progetto: compilati da soli, i file che importano abstract.ts
# danno falsi errori perché mancano i prototipi globali)
npx tsc --noEmit -p .
```

`sample.mts` esce con codice 1 se un campione viola il `check()` del generatore; se la generazione va
in errore, scrive comunque una riga `{"error": ...}`, così `verify.py` la conta come fallimento e non
come campione mancante. `verify.py` esce con codice 1 se un campione fallisce, se la quota di un caso
esce dall'intervallo della specifica, e stampa per livello conteggi e seed che non passano. Lo stesso
seed produce sempre lo stesso esercizio: per riprodurre un errore basta rigenerare quel seed.

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
