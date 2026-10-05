# Note: Operatori ed espressioni

Lezione nuova, scritta il 5 ottobre 2026 secondo `brief-secondo-anno.md`, con formulario e flashcard. Non pubblicata.

## Che cosa c'è

Espressione, operatore, operandi; la tabella degli operatori aritmetici nei due linguaggi; precedenze e parentesi;
divisione, quoziente e resto, con gli usi del resto; il resto dei numeri negativi; le potenze; le forme brevi
dell'assegnamento; un rimando a confronti e operatori logici.

- 346 righe, circa 55 di testo. Figure TikZ: 0. Programmi da eseguire: 5 (il perimetro in tre modi; 17 caramelle e 5
  amici; ore e minuti; quoziente e resto di $-7$ e 2; le potenze). Esercizi con le prove: 2 (perimetro e area; ore,
  minuti e secondi). Diagrammi: 2 (`diagramma-flusso-ore-e-minuti`; `diagramma-flusso-da-costruire-somma-cifre`, con
  `% modifica: sì`).
- Un riquadro `ad-note` per ogni differenza tra Python e C++: la divisione tra interi; la stampa di un numero con la
  virgola; quoziente e resto con un negativo; le potenze. `ad-warning`: 3 (moltiplicazione sottintesa; la linea di
  frazione; l'accento circonflesso).

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard: 20 carte).
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- Ogni risultato scritto nel testo è stato ottenuto eseguendo i due programmi con il Python e il Clang del sito
  (Pyodide 3.14 e `@yowasp/clang`, gli stessi di `verifica.mts`), e una parte anche nella pagina di anteprima:
  - perimetro: 13, 16, 11 nei due linguaggi;
  - caramelle: 3.4, 3, 2 nei due linguaggi; con 20 la prima riga è `4.0` in Python e `4` in C++;
  - `10 / 3` è `3.3333333333333335` in Python, `10.0 / 3` è `3.33333` in C++; `0.1 + 0.2` è `0.30000000000000004` in
    Python e `0.3` in C++ (non è nel testo, sta qui come riserva);
  - `-7 // 2` e `-7 % 2` in Python: $-4$ e $1$; `-7 / 2` e `-7 % 2` in C++: $-3$ e $-1$; i diagrammi danno $-4$ e $1$;
  - `2 ** 10`, `3 ** 2`, `2 ** 30` in Python: 1024, 9, 1073741824; `pow` in C++: 1024, 9, `1.07374e+09`;
    `int p = pow(2, 30);` stampa 1073741824;
  - `5 ^ 2` dà 7 nei due linguaggi;
  - `2(a + b)`: Python si ferma con `TypeError: 'int' object is not callable`, il C++ non compila;
  - in C++ `2000000000 + 2000000000` dà $-294967296$, con un avviso del compilatore.
- Diagramma eseguito fino in fondo nella pagina con 135; guardati in chiaro e in scuro. Dalla pagina ho aggiunto una
  frase: nel disegno `//` e `%` sono scritti "div" e "mod".
- La costruzione del diagramma del terzo esercizio non è stata provata trascinando i blocchi: ho controllato solo che
  si apra in modifica, vuoto.

## Scelte che il README non fissava

- "Quoziente della divisione intera" e "resto"; "numero con la virgola" come nella 53.
- In C++ la divisione con la virgola tra due variabili intere si scrive `(double) a / b`, che è anche la forma che la
  pagina scrive nel codice accanto ai diagrammi. `static_cast` non c'è.
- La divisione tra interi è già in un riquadro della 53: qui c'è un richiamo breve dentro il discorso su quoziente e
  resto, con un esempio diverso.
- Gli esercizi con le prove usano solo interi positivi, così le due linguette stampano lo stesso.
- Il massimo di un `int` ($2^{31} - 1$) è detto in una riga nel riquadro delle potenze, con il link alla lezione 8.
  L'overflow non ha una sezione sua.
- `pow` per le potenze in C++, e `a * a` per i quadrati. `sqrt` e le altre funzioni di `cmath` non ci sono.
- Forme brevi: `+=`, `-=`, `*=`; `i++` e `i--` solo nominati, con il link alla 61. `/=` e `%=` non ci sono.
- Per riconoscere un dispari la lezione consiglia "resto diverso da 0", perché in C++ `-7 % 2` è $-1$.
- Lunghezza: la prima stesura era di 369 righe. Ho tolto una prova da ciascun esercizio, un `ad-warning` (la
  divisione tra interi in C++ che non avvisa, diventato una frase) e la tabella delle forme brevi.

## Da verificare

- `5 ^ 2` non dà avvisi, ma per `2 ^ 10` il Clang del sito scrive
  `warning: result of '2 ^ 10' is 8; did you mean '1 << 10' (1024)?`. La lezione dice che nessuno dei due linguaggi
  "lo considera un errore", che resta vero.
- Il comportamento di un `int` che supera il massimo in C++ non è definito dallo standard: la lezione dice solo "dà un
  risultato sbagliato".
- Nella stampa di `cout`, "sei cifre in tutto" è la precisione predefinita (6 cifre significative).

## Domande per Andrea

- Il resto dei negativi lo tratti al biennio, o preferisci che la lezione dica solo "con i negativi i due linguaggi
  non coincidono" e rimandi?
- In C++ per le potenze usi `pow` o fai scrivere il prodotto finché non ci sono i cicli?
- La conversione `(double) a / b` è quella che insegni, o preferisci `a * 1.0 / b`?
- Le forme brevi (`+=`, `i++`) vanno in questa lezione o le introduci con i cicli?
