# Note: Il ciclo for

Lezione nuova, scritta da zero il 5 ottobre 2026 (secondo anno, capitolo "L'iterazione"), subito dopo la 60 sul
ciclo `while`, che richiama senza link. Non pubblicata.

## Struttura

Apertura con "dieci flessioni" contro "finché sei stanco"; contare da 1 a 5 con il `while` e le tre cose da gestire
(partenza, arrivo, passo), il contatore; lo stesso ciclo con il `for`, con un solo diagramma per i due programmi; i
valori del contatore, con la tabella dei tre modi di scrivere `range` accanto al `for` del C++; contare all'indietro
e a passi (conto alla rovescia); l'errore di un giro in più o in meno; il numero di giri letto da tastiera (somma da
1 a n, con diagramma e tabella di traccia); quando `for` e quando `while`; due esercizi.

- Programmi da eseguire: 4 (da 1 a 5 con `while`, da 1 a 5 con `for`, conto alla rovescia, somma da 1 a n), ciascuno
  in Python e in C++.
- Esercizi con le prove: 2 (la tabellina di n; la somma dei dispari da 1 a n).
- Diagrammi di flusso: 2 (`diagramma-flusso-contare-da-uno-a-cinque`, valido per il `while` e per il `for`;
  `diagramma-flusso-somma-da-uno-a-n`).
- Tabella di traccia: 1 (somma con $n = 4$).
- Riquadri `ad-warning`: i segni che si dimenticano (due punti e rientro in Python, punto e virgola in C++); un giro
  in più o in meno.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso.
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I quattro programmi senza prove sono stati eseguiti con `python3` e compilati con `clang++ -Wall` (nessun avviso);
  le uscite dei due linguaggi coincidono.
- Figure guardate in chiaro e in scuro con `anteprima.mjs` (279 px di larghezza al sito): nessuna freccia attraversa
  un blocco, "sì" e "no" leggibili. Non è servita nessuna correzione al disegno.
- Corretto dopo la rilettura: il riquadro sul punto e virgola dopo `for (...)` diceva che il blocco tra le graffe
  viene eseguito una volta; in realtà `i` lì non esiste più e il programma non si compila. Ora dice questo.
- La pagina sul sito in sviluppo non è stata aperta in un browser.

## Scelte che il README non fissava

- Lunghezza: 366 righe, sopra le 200 del brief, per la stessa ragione della 60 (quattro programmi e due esercizi nei
  due linguaggi, due diagrammi). Se serve accorciare, il primo candidato è il programma con il `while` in apertura,
  che può diventare un richiamo di due righe; ma è quello che permette il confronto chiesto.
- Il diagramma del `for` è quello del `while` equivalente, con il passo $i \leftarrow i + 1$ come ultimo blocco del
  corpo. Per il C++ è esatto. Per Python è una semplificazione: `range` produce i valori e il contatore non viene
  confrontato con l'arrivo, tanto che cambiare `i` nel corpo non cambia il numero dei giri. La lezione non lo dice.
- La tabella di `range` ha una colonna con il `for` del C++ scritto con `<` (`i < 6`), per far vedere che l'arrivo è
  escluso nei due linguaggi; nei programmi invece il C++ usa `i <= 5` e `i <= n`, che è la forma dei libri del
  biennio quando si conta da 1. Le due forme convivono e il riquadro sull'errore di uno le mette a confronto.
- `i++`, `i--` e `i += 2` sono spiegati qui in una frase, come scritture del passo. In Python resta `s = s + i`,
  senza `+=`, per avere la stessa riga nei due linguaggi.
- La somma da 1 a n è usata come esempio con la tabella di traccia, senza le parole "accumulatore" e
  "inizializzare": sono della lezione 62.
- "Contatore" è definito come la variabile del ciclo che parte da un valore e cambia della stessa quantità a ogni
  giro. La lezione 62 può dargli il senso più largo (contare quante volte succede una cosa).
- Il `for` di Python su una stringa o su una lista non c'è: solo `range`.
- Il contatore dichiarato dentro il `for` del C++ (`int i` tra le parentesi) non esiste dopo il ciclo: la lezione lo
  dice solo di passaggio, nel riquadro sul punto e virgola.

## Da verificare

- Nel testo dopo il conto alla rovescia: in C++ `for (int i = 5; i > 0; i++)` "va avanti finché l'editor non lo
  ferma". Con un compilatore vero il contatore prima o poi supera il massimo di `int` (comportamento non definito);
  nell'editor dovrebbe intervenire prima il limite sul testo stampato. Da provare nel browser.

## Domande per Andrea

- In C++ preferisci `for (int i = 0; i < n; i++)` (da 0, arrivo escluso, come `range(n)`) o `for (int i = 1; i <= n;
  i++)` come forma di base? La lezione usa la seconda nei programmi e mostra la prima nella tabella.
- Il contatore si dichiara dentro il `for` (`for (int i = ...`) o prima, come fanno alcuni libri del biennio?
- `i++` va bene dalla prima lezione sul `for`, o preferisci `i = i + 1` anche nel `for`?
- Il diagramma di flusso del `for`: va bene quello del `while` equivalente, o il tuo libro usa un blocco apposta
  (l'esagono con partenza, arrivo e passo)?
- L'errore di un giro in più o in meno: gli dai un nome in classe?
