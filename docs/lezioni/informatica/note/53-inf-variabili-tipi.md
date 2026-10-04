# Note: Variabili, assegnamento e tipi di dato

Lezione nuova, scritta da zero il 5 ottobre 2026 secondo `brief-programmazione.md` (capitolo "Linguaggi e primi
programmi", secondo anno). Solo lezione e note: niente formulario, flashcard e generatore.

## Che cosa c'è

Variabile come nome dato a un posto in memoria (la scatola con l'etichetta, link alla lezione 15); assegnamento in due
tempi, da destra a sinistra, con `punti = punti + 5` a confronto con $x = x + 1$ della matematica; regole e abitudini
per i nomi; i quattro tipi di base in una tabella con i nomi nei due linguaggi; perché il tipo conta (`3 + 4` e
`"3" + "4"`, la divisione tra interi in C++); lettura dalla tastiera e conversione; scambio di due variabili.

- Programmi da eseguire, tre, ciascuno in Python e in C++: i punti di Giulia (assegnamento); somma di numeri, somma di
  stringhe e divisione (tipi); prezzo per quantità (lettura e conversione).
- Esercizi con le prove, due: aggiungere il bonus ai punti (tre prove); scambiare due variabili (tre prove, una con due
  valori uguali e una con un negativo).
- Diagrammi di flusso, uno: `diagramma-flusso-totale-quaderni`, la sequenza leggi, leggi, calcola, scrivi del terzo
  programma, con gli stessi nomi (`prezzo`, `quantita`, `totale`).
- Tabelle di traccia, tre: i punti di Giulia; lo scambio sbagliato in due istruzioni; lo scambio con `temp`.
- Riquadri `ad-warning`, quattro: l'assegnamento va da destra a sinistra; la variabile usata prima di averle dato un
  valore; la media di due interi in C++; il numero letto senza conversione in Python. Un quinto errore, il prezzo
  scritto con la virgola, è nel testo dopo il terzo programma, come cosa da provare.
- Riquadri `ad-note`, tre, uno dopo ogni programma, per quello che cambia tra le due linguette: il tipo dichiarato, la
  divisione, chi fa la conversione.

## Verifiche

- `check.mts`: nessun errore e nessun avviso.
- `verifica.mts`: 2 esercizi controllati, 0 errori (Python e C++).
- I programmi senza prove sono stati eseguiti a mano con `python3` e compilati con `clang++ -std=c++17 -Wall`, compresi
  i programmi di partenza dei due esercizi. Uscite controllate: "Giulia ha 30 punti" nei due linguaggi; 7, 34, 3.5, 3 in
  Python e 7, 34, 3, 3.5 in C++; con 1.5 e 3 il totale è 4.5 nei due linguaggi.
- Le affermazioni sugli errori sono state provate: `a + s` (intero più stringa) è rifiutato da Python (`TypeError`) e
  dal compilatore C++; `"3" + 1` in Python dà errore e `"3" + "3"` dà `"33"`; con il prezzo `1,5` Python si ferma con
  `ValueError`, il C++ scrive "Totale: 0 euro" (legge 1, la lettura di `quantita` fallisce sulla virgola e la mette a 0).
- La figura è stata guardata in chiaro e in scuro con `anteprima.mjs` (221 x 384 px, sotto i 9 cm): nessuna freccia
  attraversa un blocco, i testi stanno dentro le forme. Non c'è stato niente da correggere.
- La pagina di anteprima sul sito in sviluppo non è stata vista: dalla mia sessione la porta 3001 non rispondeva
  (`curl` non si collega, e nessun processo risulta in ascolto), e non ho avviato un altro server. L'editor e le
  linguette nella pagina restano da guardare.

## Lunghezza

La lezione è lunga 348 righe, contro le 120-200 del brief. Di queste circa 210 sono codice e figura: tre programmi e
due esercizi, ognuno nei due linguaggi e con soluzione e prove, più il diagramma. Con i minimi del brief (tre
programmi, due esercizi con le prove, un diagramma) il solo codice supera le 170 righe, quindi il limite non si può
rispettare insieme ai minimi. Il testo da leggere è di circa 70 righe piene e sta nei 10-15 minuti. Da decidere se il
limite va contato senza i blocchi `codice`, o se va tolto qualcosa (candidati: il riquadro sulla media in C++, la
tabella dello scambio sbagliato).

## Scelte che il README non fissava

- Lo scambio non ha un programma di esempio: è spiegato con le due tabelle di traccia ed è il secondo esercizio, così lo
  studente lo scrive lui. In Python non si nomina `a, b = b, a`, perché nasconderebbe l'idea della variabile di appoggio.
- La variabile di appoggio si chiama `temp`.
- Nel diagramma i nomi delle variabili sono quelli del programma, in corsivo (`\textit{prezzo}`), e l'assegnamento è
  $\leftarrow$. Dalla macro del README ho copiato solo `\dati`: il rombo non serve.
- "Numero con la virgola" per `float` e `double`, non "numero reale"; "testo (stringa)" alla prima occorrenza, poi
  "stringa". In C++ si usa `double` e non `float`, e `string` con `#include <string>`.
- La tabella di traccia ha una riga per istruzione eseguita e una colonna "conto a destra dell'uguale", per far vedere i
  due tempi dell'assegnamento. Le istruzioni nella tabella sono scritte senza tipo e senza punto e virgola, valide per
  le due linguette.
- Il programma sui tipi non è identico nei due linguaggi nelle ultime due righe: Python scrive `7 / 2` e `7 // 2`, il C++
  `7 / 2` e `7.0 / 2`. Le uscite escono in ordine diverso (3.5 e 3, poi 3 e 3.5) e il riquadro subito sotto lo spiega.
- Lettere accentate nei nomi: sconsigliate ("non tutti i linguaggi le accettano"), senza entrare nel dettaglio di che
  cosa accetta Python 3 e che cosa i compilatori C++.
- Il valore booleano è solo nella tabella dei tipi e in una riga: le condizioni sono del capitolo dopo.
- Non ci sono: `const`, i tipi `char` e `long`, i limiti degli interi, il cast esplicito in C++, l'operatore `+=`.
  Sono di "Operatori ed espressioni" o di lezioni successive.
- Negli esempi con i decimali ho scelto valori che i due linguaggi scrivono uguali (1.5 per 3 fa 4.5). Con un totale
  intero Python scrive `10.0` e il C++ `10`: per questo negli esercizi con le prove ci sono solo interi.

## Domande per Andrea

Da copiare in `vault/Contenuti/Domande per Andrea.md` (non l'ho fatto perché il brief vieta di modificare file
esistenti).

- La variabile di appoggio nello scambio: `temp`, `aux`, `appoggio` o `scambio`? Quale usi in classe?
- "Numero con la virgola" o "numero reale" per `float` e `double`? E in C++ va bene presentare solo `double`?
- `string` in C++ già da questa lezione, o al biennio si lavora solo con `int`, `double`, `char` e `bool`?
- La tabella di traccia: la chiami così, o "tabella di tracciamento", "trace table"? E vuoi una riga per istruzione o
  una per numero di riga del programma?
- Nei diagrammi l'assegnamento è $\leftarrow$: il libro usa la freccia o l'uguale?
- La divisione intera di Python (`//`) compare qui in una riga del programma sui tipi: va bene anticiparla, o la
  lasciamo tutta a "Operatori ed espressioni"?
- Lo scambio come esercizio senza un programma svolto prima: va bene, o preferisci vederlo svolto nel testo e dare come
  esercizio la rotazione di tre variabili?

## Non fatto

- Un secondo diagramma di flusso (per lo scambio): la sequenza è già nel primo e le tabelle di traccia spiegano meglio.
- L'anteprima della lezione sul sito (`/prova-grafico/lezione?file=informatica/riscritte/53-inf-variabili-tipi.md`):
  la porta 3001 non rispondeva.
