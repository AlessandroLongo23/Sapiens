# Note: L'ordinamento a bolle

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "Ricerca e ordinamento", gruppo 6). Non pubblicata.

## Struttura

Apertura con i tempi della corsa campestre, gli stessi sei della lezione 75 (15, 12, 19, 13, 17, 14, in minuti); l'idea con la fila per la foto di classe e la parola "giro"; la figura passo per passo; la tabella con un giro per riga; il programma con `ordina` e `stampa`; confronti e scambi; la versione con la bandierina `scambiato`; due esercizi.

- 398 righe; circa 1150 parole fuori dai riquadri e dai programmi, in una trentina di paragrafi.
- Programmi da eseguire: 2 (le bolle semplici; la versione con la bandierina, che scrive quanti giri ha fatto), ciascuno in Python e in C++.
- Esercizi con le prove: 2 (scrivere confronto e scambio dentro i due cicli già dati; scrivere tutta la funzione, che restituisce il numero di scambi).
- Figure interattive: 1 (`inf-bubble-sort-giri`). Tabelle: 1. Riquadri `ad-warning`: 2. Riquadri `ad-note`: 1.

## Scelte

- Confini con le lezioni vicine: lo scambio con `temp` è della 75 e qui è solo richiamato con un link; il confronto con selezione e inserimento è della 78, con una riga di rimando in fondo e una sola frase sui sei tempi (15 confronti e 3 scambi per la selezione).
- "Giro" è la parola per una passata, come nella figura del kit e nella 75. Il ciclo esterno conta i giri con `i` da 0, il ciclo interno scorre le coppie con `j` fino a `n - 2 - i`.
- La versione con la bandierina ha un `while i < n - 1 and scambiato`: tiene tutte e due le condizioni, così il numero di confronti è quello della traccia del kit (`ordinamentoABolle` con `bandierina`) e il programma non fa mai un giro a vuoto in più. `scambiato` parte da vero solo per far entrare nel ciclo, e la lezione lo dice.
- Il secondo programma scrive solo "giri fatti", senza stampare il vettore: con la funzione `stampa` anche lì la lezione superava le 400 righe.
- Negli esercizi il vettore in C++ è `int tempi[MAX]` con `const int MAX = 100` e si usano solo i primi `n` posti; i valori si leggono uno per riga e si scrivono uno per riga, così le uscite dei due linguaggi coincidono.
- Il secondo esercizio chiede una `ordina` che restituisce un numero, diversa dalla `void ordina` del lotto: la consegna lo dice.
- La figura usa la traccia comune senza modifiche. I puntatori sono `j` e `j+1`; `i` non compare come puntatore perché non è l'indice di una cella: il giro è scritto nella frase ("Giro 2.").

## Verifiche

- `check.mts`: 0 errori, 0 avvisi su lezione, formulario e flashcard.
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I due programmi senza prove eseguiti con `python3` e con `clang++ -Wall`: stessa uscita nei due linguaggi (`12 13 14 15 17 19`, `giri fatti: 2`).
- Nel browser, sulla pagina di prova: tutti i programmi eseguiti in Python a 390 px e in C++ a 1280 px, "Verifica" con la soluzione in tutti e due gli esercizi, nessun errore in console, nessuno scorrimento laterale.
- I numeri della tabella e dei riquadri sono quelli della traccia `ordinamentoABolle` (15 e 7; con la bandierina 14; 9 confronti e 2 scambi per 12, 15, 13, 14, 17, 19; 15 e 15 per il vettore rovesciato).

## Da verificare

- Il riquadro sull'indice fuori dal vettore dice che il C++ "legge quello che trova in memoria dopo il vettore": è un comportamento non definito, e nell'editor del sito non è stato provato che cosa succede davvero.
- L'origine del nome ("le bolle che salgono") è quella dei libri di testo; non ho una fonte con nome e data.

## Domande per Andrea

- Le bolle in classe le fai portando il più grande in fondo, come qui, o il più piccolo in cima scorrendo da destra?
- La bandierina la scrivi con un `while` a due condizioni, come qui, o con un `for` e un'uscita anticipata? E la chiami "bandierina", "flag" o in un altro modo?
- Il ciclo interno accorciato a ogni giro (`n - 1 - i`) va bene come versione di base, o preferisci partire da quella che arriva sempre a `n - 1` e accorciarla dopo?
- Negli esercizi con i vettori letti da tastiera in C++ va bene `int v[MAX]` con `MAX = 100`, o serve un'altra forma concordata con la lezione 70?

## Elementi interattivi

- `inf-bubble-sort-giri` (figura del kit, `BubbleSortGiri.tsx`): quanti confronti e quanti scambi servono per i sei tempi, e che cosa risparmia la bandierina? Risposta nel testo: la tabella dei giri, poi i tre casi della sezione sulla bandierina.
- Programma delle bolle (codice, due linguaggi): che cosa scrive, e che cosa esce aggiungendo `stampa` alla fine di ogni giro? Risposta: le cinque righe della tabella.
- Programma con la bandierina (codice, due linguaggi): quanti giri servono per un vettore quasi in ordine? Risposta: due, con 9 confronti al posto di 15.

Prerequisiti proposti: inf-selection-sort, inf-vettori, inf-cicli-annidati, inf-parametri-ritorno

## Revisione del lotto (7 ottobre 2026)

- Struttura allineata alla 75 e al brief (idea, figura, programma, traccia, conteggio): la tabella dei giri è scesa dopo il programma, in una sezione "La traccia sui sei tempi" con il primo giro seguito riga per riga; dopo la figura resta la risposta alla sua domanda (15 confronti e 7 scambi).
- `const int N` e `const int MAX` sono fuori da `main`, in cima al programma, come nelle lezioni 70-75.
- La lezione è ora a 408 righe (era 398): otto in più del limite, per le costanti e per la sezione della traccia.
- La formula in evidenza della somma è accorciata in $(n - 1) + \dots + 1$, nella lezione e nel formulario: a 390 px usciva dalla colonna di pochi pixel.
