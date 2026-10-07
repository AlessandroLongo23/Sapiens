# Note: L'ordinamento per inserimento

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "Ricerca e ordinamento", gruppo 6). Non pubblicata.

## Struttura

Apertura con le carte tenute in mano in ordine; l'idea su tre carte e una pescata (il 3 che arriva all'inizio, il 7 che si ferma prima); la figura passo per passo sulle sei carte 8, 5, 9, 3, 7, 4; la tabella con una riga per elemento inserito; il programma; due errori; confronti e spostamenti nel caso migliore e nel peggiore; due esercizi.

- 379 righe; circa 1000 parole fuori dai riquadri e dai programmi, in 26 paragrafi.
- Programmi da eseguire: 1, in Python e in C++.
- Esercizi con le prove: 2 (scrivere il `while` che fa posto a `x`; scrivere `inserisci`, che mette un punteggio nuovo in un vettore già ordinato).
- Figure interattive: 1 (`inf-insertion-sort-carte`). Tabelle: 1. Riquadri `ad-warning`: 2. Riquadri `ad-note`: 1.

## Scelte

- La lezione lavora per spostamenti e lo dice dalla prima sezione: "spostamento" è definito come il passaggio di un elemento nella cella alla sua destra, e non si usa mai "scambio" per l'inserimento. Non c'è la variante che inserisce a forza di scambi tra vicini.
- La variabile che tiene da parte l'elemento si chiama `x`. Il brief fissa `i`, `j`, `temp`, `imin` e `scambiato` ma non questo nome: `temp` avrebbe confuso con lo scambio, e la figura del kit dice "lo tengo da parte" senza un nome.
- Si conta un confronto ogni volta che `x` è confrontato con un elemento (`v[j] > x`), non i controlli `j >= 0`: è il conto della traccia del kit.
- Nella figura `j` è l'indice dell'elemento appena confrontato. Dopo uno spostamento la freccia `j` sta quindi sotto il posto libero, da cui l'elemento confrontato è appena uscito; nel programma a quel punto `j` è già diminuito di 1. La lezione descrive `j` come "l'indice dell'elemento con cui è appena stato confrontato" e non entra in questo dettaglio.
- Il riquadro sull'ordine delle due condizioni del `while` dice che, se la prima condizione di un `and` è falsa, la seconda non viene controllata. La lezione 58 sugli operatori logici non lo dice: qui è detto in una riga, perché senza non si spiega perché `j >= 0` vada per prima.
- Il secondo esercizio in Python fa posto con `v.append(x)`, già scritto nel programma di partenza; in C++ il vettore ha già posti liberi (`MAX = 100`).
- Il confronto con gli altri ordinamenti è della 78: qui restano la frase "uno spostamento è un assegnamento, uno scambio tre" e il rimando.

## Verifiche

- `check.mts`: 0 errori, 0 avvisi su lezione, formulario e flashcard.
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++ (compreso il caso con il vettore vuoto nel secondo).
- Il programma senza prove eseguito con `python3` e con `clang++ -Wall`: `3 4 5 7 8 9` in tutti e due.
- Nel browser: programma eseguito ed esercizi verificati con la soluzione, in Python a 390 px e in C++ a 1280 px, senza errori in console e senza scorrimento laterale.
- I numeri della tabella sono quelli della traccia `ordinamentoPerInserimento` (13 confronti e 10 spostamenti; 5 e 0 per il vettore in ordine; 15 e 15 per quello rovesciato).
- Controllato a mano: senza la copia in `x`, le carte 8, 5 diventano 8, 8.

## Da verificare

- Con le due condizioni del `while` scambiate, in C++ la lettura di `v[-1]` è un comportamento non definito: di solito il programma dà lo stesso il risultato giusto. La lezione dice solo che è una lettura fuori dal vettore.
- La lezione 70 non parla degli indici negativi di Python: il riquadro dice in mezza riga che `v[-1]` è l'ultimo elemento.

## Domande per Andrea

- Come chiami in classe l'elemento tenuto da parte: `x`, `temp`, `chiave`, `elemento`?
- Presenti l'inserimento per spostamenti, come qui, o prima la versione con gli scambi tra vicini, più corta da scrivere ma con più assegnamenti?
- La regola per cui la seconda condizione di un `and` non viene controllata quando la prima è falsa va detta qui, o va aggiunta alla lezione sugli operatori logici?
- Vuoi anche il conto del caso medio (circa metà del caso peggiore), o basta migliore e peggiore?

## Elementi interattivi

- `inf-insertion-sort-carte` (figura del kit, `InsertionSortCarte.tsx`): per ogni carta, quanti confronti servono prima di fermarsi e quanti elementi si spostano? Risposta nel testo: la tabella con una riga per elemento, e la regola "tanti confronti quanti spostamenti, o uno in più".
- Programma dell'inserimento (codice, due linguaggi): che cosa scrive, e che cosa esce aggiungendo `stampa` dopo ogni inserimento? Risposta: l'ultima colonna della tabella.

Prerequisiti proposti: inf-vettori, inf-selection-sort, inf-ciclo-while, inf-operatori-logici

## Revisione del lotto (7 ottobre 2026)

- Struttura allineata alla 75 e alla 76: la tabella degli inserimenti è scesa dopo il programma, in una sezione "La traccia sulle sei carte" con l'inserimento del 3 seguito riga per riga; dopo la figura resta la risposta alla sua domanda.
- `const int N` e `const int MAX` sono fuori da `main`, in cima al programma.
