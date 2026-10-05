# Note: Il primo programma: input e output

Lezione nuova, scritta il 5 ottobre 2026 secondo `brief-secondo-anno.md`, con formulario e flashcard. Non pubblicata.

## Che cosa c'è

Input e output; il programma di una istruzione e la cornice del C++; la sequenza; stampare testi, numeri e conti, più
cose in una istruzione; i commenti; leggere dalla tastiera un testo e ristamparlo; tre esercizi.

- 283 righe, circa 45 di testo. Figure TikZ: 0. Programmi da eseguire: 3 (saluto, scontrino del cinema, saluto con
  il nome). Esercizi con le prove: 3 (le tre righe del cartello; "Ciao" e "Buona giornata"; nome e città, da scrivere
  guardando il diagramma). Diagrammi: 2 (`diagramma-flusso-saluto-con-nome`; `diagramma-flusso-nome-e-citta`, con
  `% codice: no`).
- Riquadri: 4 `ad-note` (la cornice del C++; spazi e a capo; domanda e lettura; una riga o una parola), 3 `ad-warning`
  (virgolette dimenticate; maiuscole e punto e virgola; il verso delle frecce in C++).

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard: 18 carte).
- `verifica.mts`: le soluzioni dei tre esercizi superano le prove in Python e in C++. Il primo esercizio ha una
  `%% prova` vuota (il programma non legge niente): `verifica.mts` e la pagina la accettano.
- Programmi provati nella pagina di anteprima con Chromium (Playwright), nelle due linguette. Uscite controllate:
  "Ciao, mondo!"; lo scontrino, uguale nei due linguaggi; senza `<< endl` nella prima istruzione il C++ scrive
  "Cinema AstraBiglietti: 3"; con la risposta "Anna Maria" Python scrive "Ciao Anna Maria" e il C++ "Ciao Anna".
- Messaggi citati nel testo, provati: `name 'Ciao' is not defined`, `use of undeclared identifier`, `expected ';'`;
  `cin << eta` produce due errori seguiti da decine di righe `note: candidate template ignored`.
- Diagrammi eseguiti fino in fondo nella pagina con i valori di `% ingresso:`, guardati in chiaro e in scuro.
- Dalla pagina ho corretto una frase: la risposta a `input()` non si scrive in una casella sotto la domanda ma su una
  riga accanto alla domanda, nel riquadro dell'uscita, con "Aspetta una risposta" in alto.

## Scelte che il README non fissava

- Le variabili compaiono solo quanto serve per leggere e ristampare un testo: `nome`, `citta`, senza conti. La lettura
  di un numero (`int(input())`, `cin >>` in un `int`) resta alla 53, a cui il testo rimanda due volte.
- In C++ il testo si legge in una `string` con `#include <string>`, come nella 53.
- La cornice del C++ è spiegata riga per riga in un `ad-note`, una volta; la 47 la accenna in due righe.
- Solo virgolette doppie per i testi, anche in Python: così i due linguaggi si scrivono uguale. Le virgolette singole
  di Python non sono nominate.
- `endl` per andare a capo; `"\n"` non c'è. In Python non ci sono `end=` e `sep=`.
- Negli esercizi le risposte sono di una parola, perché `cin >>` si ferma al primo spazio; `getline` non c'è.
- Il codice che la pagina scrive accanto al primo diagramma è `cout << "Ciao" << " " << nome`, quello della lezione è
  `cout << "Ciao " << nome`: fanno lo stesso, ma non sono identici. La lezione non lo commenta.
- Commenti: solo quello di una riga (`#`, `//`); il commento su più righe del C++ non c'è.

## Domande per Andrea

- In C++ presenti `string` già dal primo programma che legge, o preferisci che la prima lettura sia di un numero?
- `endl` o `"\n"`? Quale usi in classe?
- `return 0;` lo fai scrivere sempre? La lezione lo spiega come "il programma è arrivato alla fine senza problemi".
- I commenti vanno qui, o li tratti più avanti?
