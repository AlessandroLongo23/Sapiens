# Note: La ricerca sequenziale

Lezione nuova, scritta da zero il 7 ottobre 2026 (terzo anno, capitolo "Vettori, matrici e stringhe"), gruppo 3 del
lotto del terzo anno. Non pubblicata.

Prerequisiti proposti: inf-vettori, inf-ciclo-while, inf-operatori-logici, inf-parametri-ritorno

## Struttura

Apertura con i pettorali della corsa campestre nell'ordine di arrivo; la ricerca sequenziale come dito che scorre
l'elenco; "c'è o non c'è" con `trovato` e un ciclo `for`, e l'errore dell'`else` che cancella; "dove" con
`posizione` che parte da -1; fermarsi appena lo si trova con un `while` a due condizioni, con la prima figura e
l'errore del ciclo senza `i < N`; la ricerca come funzione `cerca`, con `return` dentro il ciclo e l'errore di
`return -1` nell'`else`; contare quante volte, in un paragrafo che rimanda al primo esercizio; i confronti nel caso
migliore, peggiore e medio, con la seconda figura e una tabella; due esercizi.

- 376 righe; circa 950 parole di testo fuori dai riquadri, in 30 righe, più 3 riquadri e una tabella.
- Programmi da eseguire: 3, ciascuno in Python e in C++ (`trovato`; `posizione` con il `while`; la funzione `cerca`).
- Esercizi con le prove: 2 (quante volte compare un voto; la funzione `insufficiente`, indice del primo voto minore
  di 6 oppure -1).
- Riquadri `ad-warning`: 3. Tabelle: 1 (confronti per 8, 1000 e un milione di elementi).
- Diagrammi di flusso: nessuno. Figure TikZ: nessuna.

## Elementi interattivi

| Nome | Dove | Domanda a cui risponde |
|---|---|---|
| `inf-ricerca-sequenziale-posizione` | "Dire in che posto si trova" | Quanti elementi guarda la ricerca prima di rispondere, e che cosa cambia se il ciclo non si ferma al primo che trova? |
| `inf-ricerca-sequenziale-casi` | "Quanti confronti servono" | Quanti confronti fa la ricerca, a seconda del posto in cui sta il valore cercato? |
| 3 programmi `codice` | lungo la lezione | ogni programma ha subito dopo i valori da provare |

La prima è `inf-ricerca-sequenziale-passi` adattata in un file nuovo (`RicercaSequenzialePosizione.tsx`), con la
traccia `ricercaConPosizione` in `src/lib/informatica/tracce-vettori.ts`: il vettore si chiama `arrivi` come nel
programma, tra i contatori c'è la variabile `posizione` che parte da -1, e una scelta tra "Si ferma" e "Va avanti".
I valori di partenza sono quelli della lezione, con il 18 cercato. La seconda è nuova
(`RicercaSequenzialeCasi.tsx`): lo studente tocca la cella dove sta il valore, oppure dice che non c'è, e cambia il
numero degli elementi da 2 a 12; tre contatori mostrano i confronti, il caso migliore e il caso peggiore. Il testo
dopo ogni figura dà la risposta. La figura originale `inf-ricerca-sequenziale-passi` non è stata toccata e resta
registrata.

## Confini decisi tra la 70 e la 71

Vedi la nota della 70. In più: la 71 non ordina niente e non parla di vettori ordinati, se non nell'ultima frase,
che rimanda alla ricerca binaria (74). Il confronto generale tra algoritmi è della 78: qui c'è solo la tabella dei
confronti della ricerca sequenziale.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso, per lezione, formulario e flashcard (18 carte).
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I tre programmi senza prove eseguiti con `python3` e compilati con `clang++ -std=c++17 -Wall -Wextra` con 18, 20 e
  12 in ingresso: nessun avviso, uscite uguali.
- Sul sito di sviluppo, a 1280 px in Python e a 390 px in C++: i tre programmi eseguiti (con 18 e con 20), i due
  esercizi con "Verifica" sul programma di partenza e sulla soluzione. Nel secondo esercizio il programma di
  partenza supera una prova su tre (quella con tutti i voti sufficienti), perché restituisce -1.
- Provato sul sito: il ciclo con la sola condizione `arrivi[i] != x`, cercando il 20, in Python dà
  `IndexError: list index out of range`; in C++ non dà nessun errore e scrive 462, perché ha continuato a leggere la
  memoria dopo il vettore finché ha trovato un 20.
- Le due figure guardate in chiaro, in scuro e a 390 px, al primo passo, a metà e alla fine, nelle due versioni,
  con due 18, con un valore che non c'è, con 2 e con 12 elementi; provate da tastiera.

## Scelte che il brief non fissava

- L'ordine: prima `trovato` con un `for` che scorre tutto, poi `posizione`, poi il `while` che si ferma, poi la
  funzione con `return`. `break` non è usato: nel biennio compare solo nello `switch` della 59, e il `while` a due condizioni è la forma dei
  libri.
- "Non trovato" è -1 in tutta la lezione e negli esercizi, nei due linguaggi. In Python non compaiono `in`, `index`
  e `count`, che fanno lo stesso lavoro: la lezione è sull'algoritmo.
- Il caso medio è definito solo quando il valore c'è, con ogni posto ugualmente probabile: (n + 1) : 2. Il caso in
  cui il valore può anche mancare non è trattato.
- "Contare quante volte" non ha un programma nella lezione: è il primo esercizio, con la soluzione.
- Il valore cercato si chiama `x`; il vettore `arrivi` nei programmi e `v` nella funzione.
- La ricerca del primo elemento che rispetta una condizione (il primo voto insufficiente) è nel secondo esercizio.

## Da verificare

- "La ricerca binaria trova un valore tra un milione con una ventina di confronti": $\log_2 10^6 \approx 19{,}9$,
  quindi al più 20 confronti contando un confronto per elemento guardato, come fa la figura della 74. Da allineare
  con il numero che la 74 dichiara.
- Quello che fa il C++ uscendo dal vettore non è definito: il 462 è del Clang del sito, e la lezione non lo cita.

## Domande per Andrea

- In classe la ricerca che si ferma la scrivi con il `while` a due condizioni, come qui, con una bandierina
  `trovato` nella condizione, oppure con `break`?
- -1 come "non trovato" va bene anche in Python, dove qualcuno usa `None`?
- "Ricerca sequenziale" o "ricerca lineare" come nome principale?
- Il caso medio va lasciato, con la formula (n + 1) : 2, o al terzo anno bastano caso migliore e caso peggiore?
- In Python vuoi che la lezione dica che esistono `in` e `index`, almeno in un riquadro?

## Revisione del lotto (7 ottobre 2026)

- "un numero che non può essere un indice" è diventato "che non è l'indice di nessun elemento": la 70 dice che in Python `voti[-1]` esiste.
