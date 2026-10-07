# Note: Le matrici

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "Vettori, matrici e stringhe"). Non pubblicata.

## Struttura

Apertura con il registro della classe (tre studenti, quattro verifiche); la matrice come tabella con due indici,
con la figura da toccare e il programma che crea la matrice, legge e corregge un elemento; i due cicli annidati
sulla somma di ogni riga, con la figura a passi e il programma dei totali e delle medie; la somma per colonne come
scambio dei due cicli, con lo schema a parole e la modifica del programma; la diagonale principale e quella
secondaria sul campo del tris; due esercizi.

- 400 righe, il limite; circa 1270 parole di testo, riquadri compresi.
- Programmi da eseguire: 3 (creare e usare la matrice; totale e media di ogni studente; tris sulla diagonale),
  ciascuno in Python e in C++.
- Esercizi con le prove: 2 (somma di ogni colonna di una matrice 2×3 letta da tastiera; le due diagonali di una
  3×3).
- Figure interattive: 2. Nessun diagramma di flusso (il linguaggio dei blocchi non ha vettori) e nessuna figura
  TikZ.
- Riquadri `ad-warning`: 3. Riquadri `ad-note`: 1.

## Elementi interattivi

| Nome | Tipo | Domanda a cui risponde |
|---|---|---|
| `inf-matrice-indici` | figura del kit (`Matrice`, `Variabili`, `Frase`) | Con quali due indici si scrive un elemento, e quale dei due viene prima? Il testo chiede di cercare `voti[1][2]`, `voti[2][1]` e l'elemento in basso a destra, e subito dopo dà le tre risposte. |
| `inf-matrice-somme` | figura del kit a passi (`Matrice`, `Legenda`, `Variabili`, `Frase`, `ComandiPassi`) | In che ordine i due cicli visitano i voti, quante volte `somma` torna a 0, e che cosa cambia tra righe e colonne? Il testo chiede una previsione prima di eseguire, poi dà l'ordine, il numero degli azzeramenti e le somme (30, 24, 36 e 20, 23, 22, 25). Toccando un voto si salta al passo in cui viene aggiunto. |
| programmi `codice` | tre programmi nei due linguaggi | Dopo ognuno il testo dice che cosa cambiare: l'azzeramento spostato, una quarta riga, i cicli scambiati, la diagonale secondaria con la O. |

## Confini decisi

- La 70 ha il vettore, l'indice fuori dal vettore e `append`: qui sono richiamati con un link, non rispiegati.
- La matrice passata a una funzione non c'è. In C++ il parametro si scrive `int m[][C]`, con la seconda dimensione
  obbligatoria, e spiegarlo porta fuori strada: nessun programma della lezione usa funzioni.
- La somma per colonne non ha un programma suo da eseguire: c'è lo schema a parole e la consegna di modificare il
  programma dei totali; il programma intero è la soluzione del primo esercizio. Con un quarto programma la lezione
  superava le 400 righe.
- La stampa della matrice come tabella (due cicli con `end=" "`) è stata tolta per lo stesso motivo: la 63 ha già
  la tavola pitagorica, che è la stessa cosa senza la matrice.
- Massimo di una riga, ricerca in una matrice, matrice trasposta, prodotto: non ci sono.
- La lettura di una matrice da tastiera è spiegata in tre righe all'inizio di "Prova tu", dove serve.

## Scelte che il brief non fissava

- In Python le dimensioni si mettono in due variabili, `R = len(voti)` e `C = len(voti[0])`, così i cicli si
  scrivono `range(R)` e `range(C)` e si leggono come quelli del C++, dove `R` e `C` sono costanti. La 70 usa
  `len(voti)` direttamente nel `range`.
- Il campo del tris è una matrice di stringhe (`"X"`, `"O"`), in C++ `string campo[N][N]`: evita di introdurre
  `char` prima della lezione sulle stringhe.
- La media di ogni studente è nel programma dei totali, con `double somma` in C++ come nella 64. Le uscite dei due
  linguaggi differiscono su una media intera (Python `6.0`, C++ `6`), come già detto nella 64.
- "Diagonale secondaria" per l'altra diagonale.

## Verifiche

- `check.mts`: nessun errore e nessun avviso su lezione, formulario e flashcard (18 carte).
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I tre programmi senza prove eseguiti con `python3` e con `clang++ -std=c++17 -Wall`: stesse uscite, tranne la
  media intera.
- Controllato sul Mac: con la matrice della lezione `voti[0][4]` in C++ stampa 5 e `voti[3][1]` un numero qualunque;
  i totali con l'azzeramento spostato sono 30, 54, 90 e 9, 6, 10.

## Da verificare

- `voti[0][4]` che stampa 5 dipende da come il C++ tiene in memoria la matrice (una riga dopo l'altra): è così per
  ogni compilatore, ma per la norma del linguaggio è comunque un accesso non definito. Sul Clang del sito non è
  stato provato a mano.

## Domande per Andrea

- In classe la matrice si passa a una funzione? Se sì, serve un paragrafo su `int m[][C]`, oppure una lezione a
  parte.
- In Python preferisci `R = len(voti)` e `C = len(voti[0])`, come qui, o `len` scritto direttamente nei `range`?
- "Diagonale secondaria" è il nome che usi, o "antidiagonale"?
- La trasposta e la ricerca del massimo in una matrice vanno aggiunte, magari come esercizi?

Prerequisiti proposti: inf-vettori, inf-cicli-annidati, inf-contatori-accumulatori
