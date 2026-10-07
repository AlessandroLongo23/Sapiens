# inf-insertion-sort: l'ordinamento per inserimento

Esercizi della lezione 77, "L'ordinamento per inserimento" (informatica, terzo anno, ricerca e ordinamento):
`docs/lezioni/informatica/riscritte/77-inf-insertion-sort.md`. Generatore:
`src/lib/exercises/v2/generators/inf-insertion-sort.ts`; controllo:
`scripts/exercises/checkers/inf_insertion_sort.py`. I programmi sono scritti a mano nei due linguaggi con
`src/lib/exercises/v2/inf-codice.ts` (`docs/lezioni/informatica/brief-esercizi-codice.md`).

## Parole e conti della lezione

- Il vettore si chiama `v` e ha `n` elementi; l'ordine è crescente, tranne dove la consegna dice decrescente.
- La funzione è `def ordina(v):` in Python e `void ordina(int v[], int n)` in C++: `i` è l'indice del ciclo esterno
  e parte da 1, `x` è l'elemento tenuto da parte, `j` torna indietro, il ciclo interno è
  `while j >= 0 and v[j] > x`, il posto libero è la cella `j + 1`.
- In C++ si usano gli array (`int carte[N] = {...}` con `const int N`), mai `vector`.
- Gli elementi si spostano, non si scambiano. Un confronto è ogni volta che `x` viene confrontato con un elemento
  `v[j]`; il controllo `j >= 0` non conta. Uno spostamento è un elemento copiato di un posto a destra. In un
  inserimento i confronti sono quanti gli spostamenti, oppure uno in più: quello con l'elemento che ferma la
  ricerca, che manca quando si arriva all'inizio del vettore.
- Niente notazione O grande.

## Livelli

1. **Inserire un elemento** (testo). Un vettore di 5 o 6 numeri diversi tra 1 e 20; i primi k (da 2 a n − 1) sono
   già in ordine. Com'è il vettore dopo l'inserimento dell'elemento di indice k? Tre casi: `inizio` (l'elemento
   arriva all'indice 0, un quarto), `mezzo` (si ferma dopo almeno uno spostamento, metà), `fermo` (resta dov'è, un
   quarto). Opzioni: quattro vettori. Distrattori: l'elemento scambiato con il vicino; scambiato con quello che
   occupa il suo posto (come farebbe la selezione); l'elemento perso, con un doppione al suo posto; gli elementi
   spostati e l'elemento mai rientrato; l'elemento messo all'inizio; tutto il vettore ordinato; il vettore non
   toccato.
   Esempio: primi 3 in ordine in 6, 13, 20, 15, 9, indice 3 → 6, 13, 15, 20, 9.
2. **Confronti e spostamenti** (testo, la risposta è un numero). Quattro casi, un quarto ciascuno:
   `inserimento: confronti` e `inserimento: spostamenti` (un vettore come nel livello 1, un solo inserimento),
   `vettore: confronti` e `vettore: spostamenti` (tutto l'ordinamento di un vettore di 4, 5 o 6 numeri diversi).
   Distrattori: l'altro conto (confronti al posto degli spostamenti), il confronto che ferma contato in più o
   dimenticato, il numero di elementi a sinistra, n(n − 1)/2, n − 1.
   Esempio: 11, 20, 6, 13 → 5 confronti (1 + 2 + 2) e 3 spostamenti (0 + 2 + 1).
3. **Che cosa scrive il programma** (programma intero sotto la domanda, opzioni che sono uscite). Un vettore di
   cifre diverse da 1 a 9, non in ordine, con un nome (`carte`, `voti`, `punti`, `tempi`, `pesi`, `prezzi`).
   Quattro casi, un quarto ciascuno:
   - `posti`: 5 o 6 elementi; dopo ogni inserimento `ordina` scrive `j + 1`, l'indice in cui è entrato `x` (almeno
     tre indici diversi);
   - `conta`: 5 o 6 elementi; `ordina` conta gli spostamenti in `s` e lo restituisce (almeno 2);
   - `giri`: 4 elementi; dopo ogni inserimento `ordina` scrive tutto il vettore su una riga, come l'ultima colonna
     della tabella della lezione (opzioni su tre righe a larghezza fissa);
   - `senza x`: 4 o 5 elementi; la funzione è quella del riquadro "L'elemento non copiato va perso", e la domanda
     lo dice: il programma scrive un vettore con dei doppioni.
   Distrattori: quello che scrive lo stesso programma con un errore in più (`j` al posto di `j + 1`, il confronto
   al contrario, `j > 0`, `if` al posto di `while`, il contatore fuori dal ciclo interno o che parte da 1) e, per
   `senza x`, quello che scrive la funzione giusta; poi i confronti al posto degli spostamenti, n(n − 1)/2, il
   vettore di partenza.
4. **Quale ciclo ordina** (opzioni che sono programmi). La consegna dice l'ordine, `crescente` o `decrescente`,
   metà ciascuno. Ogni opzione mostra solo il ciclo esterno di `ordina`: la funzione intera con la sua riga `def`
   o `void` avrebbe in C++ una riga di 36 caratteri, più delle 34 di un'opzione. Il programma intero di ogni
   opzione ordina due vettori, di 5 e di 6 cifre diverse, e li scrive. Nove errori, tre per esercizio:
   - `v[j + 1] = v[i]` alla fine: l'elemento non è preso da `x` e va perso;
   - `v[i] = x` alla fine: `x` torna da dove è partito;
   - il confronto al contrario;
   - `j > 0` al posto di `j >= 0`: il primo elemento non viene mai confrontato;
   - `if` al posto di `while`: un solo spostamento;
   - il ciclo esterno da 2: il secondo elemento è saltato;
   - il ciclo esterno fino a `n - 1`: l'ultimo elemento è saltato;
   - `v[j + 1] = v[j]` mancante;
   - lo spostamento scritto al contrario, `v[j] = v[j + 1]`.
5. **Scrivere l'inserimento** (risposta aperta, con la scelta multipla di programmi). Il programma legge `n` e
   poi `n` numeri interi, uno per riga; la lettura c'è già. Quattro casi, un quarto ciascuno:
   - `crescente`, `decrescente`: scrivere la funzione `ordina` e chiamarla; la scrittura dei numeri c'è già. Prove:
     un vettore di 5 o 6 numeri non in ordine, uno di 4 con un numero ripetuto, uno di 3 o 4 già in ordine;
   - `spostamenti`: `ordina` restituisce il numero di spostamenti e il programma scrive quel numero. Prove: tre
     vettori con tre numeri di spostamenti diversi, almeno 2;
   - `inserisci`: il secondo esercizio della lezione. Il vettore arriva già in ordine crescente, seguito da un
     numero nuovo; scrivere la funzione `inserisci` e chiamarla; il programma scrive gli n + 1 numeri. Prove: il
     numero nuovo va in mezzo dopo almeno due spostamenti, prima di tutti, dopo tutti.
   La risposta deve contenere una funzione definita e chiamata dallo studente (`funzione`). Il programma di
   partenza ha la lettura, la scrittura e due commenti `scrivi qui`: la funzione e la sua chiamata. A scelta
   multipla le opzioni mostrano il ciclo di `ordina` (con `s = 0` e `return s` per `spostamenti`) o il corpo di
   `inserisci`; gli errori sono quelli del livello 4, più il contatore fuori dal ciclo interno o che parte da 1,
   e per `inserisci`: il confronto al contrario, `if`, `j > 0`, l'elemento solo aggiunto in fondo, l'elemento
   rimesso in fondo dopo gli spostamenti.

## Vincoli

- Quattro opzioni diverse. I distrattori che sono programmi scrivono altro dal giusto su almeno una prova.
- Nessun programma, giusto o sbagliato, legge o scrive fuori dal vettore: `v[-1]` in Python è l'ultimo elemento,
  in C++ non è definito. Per questo `v[j] = x` alla fine e le due condizioni del `while` scambiate non sono tra
  gli errori. In `inserisci` nessun programma legge la cella in fondo prima di averla scritta: in Python contiene
  `x` dopo `append`, in C++ niente.
- Righe di al più 34 caratteri nelle opzioni, di al più 42 nei programmi sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor;
  un programma intero ha al più 18 righe in Python e 28 in C++. Per restare in 28 righe il C++ dei
  programmi che leggono dichiara `int carte[100];` senza la costante `MAX` della lezione.
- `steps` di due o tre frasi; `solution` di una riga.
- I casi di un livello escono nelle quote scritte sopra.

## Da evitare

Vettori già in ordine nei livelli 3 e 5 (nessun errore si vedrebbe); vettori con cui due errori lasciano lo stesso
risultato (i numeri si estraggono di nuovo, il caso no); numeri a due cifre nei programmi mostrati, che
allargherebbero la riga del vettore oltre le 42 colonne; `vector` in C++; la parola "scambio" per quello che fa
questo ordinamento.
