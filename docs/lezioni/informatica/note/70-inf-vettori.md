# Note: I vettori

Lezione nuova, scritta da zero il 7 ottobre 2026 (terzo anno, capitolo "Vettori, matrici e stringhe"), gruppo 3 del
lotto del terzo anno. Non pubblicata.

Prerequisiti proposti: inf-ciclo-for, inf-contatori-accumulatori, inf-massimo-minimo-media, inf-parametri-ritorno

## Struttura

Apertura dal programma della media della 64 e dalla domanda che non sa risolvere (quanti voti stanno sopra la media);
vettore, elemento, indice, dimensione, con gli indici da 0 e la prima figura; creare un vettore con i valori, leggere
e scrivere un elemento, l'indice fuori dal vettore; scorrere con un ciclo, con la seconda figura e l'errore del giro
di troppo; somma, media e conteggio sopra la media in due passate; riempire un vettore dalla tastiera e cercare il
massimo; un vettore come parametro di una funzione, che lo legge o lo modifica; due esercizi.

- 395 righe; circa 1000 parole di testo fuori dai riquadri, in 21 paragrafi, più 6 riquadri.
- Programmi da eseguire: 4, ciascuno in Python e in C++ (elementi letti e scritti; media e voti sopra la media;
  lettura di cinque voti e massimo; `somma` e `aumenta` su un vettore).
- Esercizi con le prove: 2 (cinque numeri al contrario; la funzione `escursione`, massimo meno minimo).
- Riquadri `ad-warning`: 3 (indice fuori dal vettore; giro di troppo e primo elemento saltato; elemento senza
  valore). Riquadri `ad-note`: 3 (differenze tra i linguaggi; `for voto in voti`; `vector`).
- Diagrammi di flusso: nessuno (il linguaggio dei blocchi non ha i vettori). Figure TikZ: nessuna.

## Elementi interattivi

| Nome | Dove | Domanda a cui risponde |
|---|---|---|
| `inf-vettore-indice-elemento` | "Tante variabili con un nome solo" | In un vettore di cinque elementi, quale elemento è `voti[3]`? E che cosa c'è in `voti[5]`? |
| `inf-vettore-scorri-passi` | "Scorrere un vettore con un ciclo" | Che cosa cambia giro dopo giro mentre il ciclo scorre il vettore, e che cosa succede all'ultimo giro con `i <= 5`? |
| 4 programmi `codice` | lungo la lezione | ogni programma ha subito dopo che cosa provare a cambiare |

La prima figura è fatta con `Celle`, `Legenda`, `Variabili` e `Frase` del kit; lo studente sposta `i` con due bottoni
o toccando una cella, aumenta di 1 l'elemento indicato, e dopo l'ultima cella trova una cella tratteggiata che non è
del vettore. La seconda usa la traccia `scorriVettore` (in `src/lib/informatica/tracce-vettori.ts`, con i test in
`tests/unit/informatica-tracce-vettori.test.mjs`) e `usePassi`, `ComandiPassi`, `Dati`: due scelte, che cosa calcola
il ciclo (somma o massimo) e la condizione (`i < 5` o `i <= 5`). Il testo dopo ogni figura dà la risposta, quindi
chi non le usa non perde niente.

## Confini decisi tra la 70 e la 71

- La 70 non cerca niente: niente "c'è o non c'è", niente posizione di un elemento. La posizione del massimo
  (l'indice, e non il valore) non compare: è della 75, con `imin`.
- La 70 ha il vettore come parametro, in lettura e in scrittura; la 71 lo usa per la funzione `cerca` senza
  rispiegarlo.
- L'indice fuori dal vettore è spiegato nella 70; la 71 lo richiama con un link nel riquadro sul ciclo senza
  `i < N`.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso, per lezione, formulario e flashcard (19 carte).
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I quattro programmi senza prove eseguiti con `python3` e compilati con `clang++ -std=c++17 -Wall -Wextra`: nessun
  avviso, uscite uguali nei due linguaggi (media 7.2, due voti sopra la media; somma 36 e poi 40).
- Sul sito di sviluppo, a 1280 px in Python e a 390 px in C++: tutti i programmi eseguiti, il terzo con cinque voti
  battuti; i due esercizi con "Verifica" prima sul programma di partenza (0 prove superate) e poi sulla soluzione
  (tutte superate). Nessuno scorrimento laterale, nessuna immagine mancante.
- Provato sul sito quello che dicono i riquadri: in Python `voti[5]` dà `IndexError: list index out of range`,
  `voti[-1]` dà 10, `voti[0] = 7` su una lista vuota dà `IndexError: list assignment index out of range`. In C++
  `cout << voti[5]` fa scrivere al compilatore `warning: array index 5 is past the end of the array` e poi il
  programma stampa 0 (con `voti[6]` 81660); il ciclo con `i <= N` non dà nessun avviso e la somma esce 36, giusta
  per caso, perché dopo il vettore c'è uno zero; la somma di un array non assegnato dà 81645.
- Le due figure guardate in chiaro, in scuro e a 390 px, al primo passo, a metà e alla fine, con ogni scelta, con
  otto valori e dopo Mescola; provate da tastiera (frecce, Inizio, Fine, Invio su una cella).

## Scelte che il brief non fissava

- Il vettore degli esempi è `voti = [7, 5, 8, 6, 10]`: la media è 7,2, così Python e C++ la scrivono allo stesso
  modo (con una media intera Python scrive `7.0` e il C++ `7`, come dice la 64).
- In C++ la costante `N` sta prima di `main`, fuori dalle funzioni, in tutti i programmi. La 67 sconsiglia le
  variabili globali: una costante non è una variabile, ma la lezione non lo dice.
- La dimensione è fissata anche quando i dati si leggono: i programmi leggono sempre cinque (o sei) valori. Non c'è
  il vettore "con una capienza massima e un numero di elementi usati", che richiede due numeri diversi per la
  dimensione.
- In Python il ciclo è `for i in range(len(voti))`, con l'indice, come in C++; `for voto in voti` è in un riquadro.
- Gli indici negativi di Python sono detti in mezza riga nel riquadro sull'indice fuori dal vettore, perché sono un
  errore che non si vede (`voti[i - 1]` con `i` uguale a 0).
- `vector` sta in un riquadro, con `push_back`, come chiede il brief.
- La stampa di tutto il vettore (`print(voti)` in Python, un ciclo in C++) non c'è: l'esercizio 1 stampa gli
  elementi uno per riga.
- Copiare un vettore in un altro, confrontare due vettori e i vettori di testi non ci sono.

## Da verificare

- Il comportamento del C++ con un indice fuori dal vettore non è definito dal linguaggio: quello descritto è ciò che
  fa il Clang del sito (provato il 7 ottobre 2026). Su un altro compilatore il numero stampato e l'avviso cambiano.
  La lezione dice "un numero che con i voti non c'entra" e "il risultato può perfino sembrare giusto".
- Il testo dell'avviso del compilatore non è citato nella lezione, che dice solo "un avviso (`warning`)".

## Domande per Andrea

- In C++ la dimensione nella costante `N` prima di `main`: va bene, o in classe la metti dentro `main`, o usi
  `#define`?
- Quando i dati sono "quanti ne vuole l'utente", in classe usi un array con una capienza massima e una variabile `n`
  per gli elementi usati? In questa lezione la dimensione è sempre fissa.
- In Python vuoi il ciclo con l'indice come qui, oppure `for voto in voti` come forma principale e l'indice solo
  quando serve?
- "Dimensione" del vettore, come nel brief, o "lunghezza"?
- Gli indici negativi di Python vanno nominati, come qui, o tolti?

## Revisione del lotto (7 ottobre 2026)

- "il compilatore se ne accorge" è diventato "molti compilatori se ne accorgono"; due "usiamo" sono diventati "si usa", "si usano".
