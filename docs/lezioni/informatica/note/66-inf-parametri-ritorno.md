# Note: Parametri e valore di ritorno

Lezione nuova, scritta da zero il 7 ottobre 2026 (terzo anno, capitolo "Le funzioni"). Non pubblicata.

## Struttura

Apertura con i punti del torneo di calcetto (3 per la vittoria, 1 per il pareggio); parametri e argomenti con la
funzione `scheda(vinte, pareggi)`, che stampa, chiamata con gli stessi numeri in due ordini; `return` e valore di
ritorno con `punti(vinte, pareggi)`, lo schema della funzione come scatola, il programma e la figura passo per
passo; il risultato usato in un assegnamento, in una stampa, in una somma e in una condizione; stampare o
restituire, con una tabella e due errori; una funzione che ne chiama un'altra e restituisce vero o falso
(`qualificata`); due esercizi.

- 378 righe; circa 1350 parole di testo.
- Programmi da eseguire: 4, ciascuno in Python e in C++. Esercizi con le prove: 2.
- Figure interattive: 1. TikZ: 1 (`funzione-argomenti-valore-di-ritorno`). Diagrammi: 0.
- Riquadri `ad-warning`: 4. Riquadri `ad-note`: 2. Tabelle: 1.

## Confini

- Con la 65: la parola "parametro" arriva dalla 65 con `linea(n)`; qui si aggiunge "argomento" e si passa a più
  parametri.
- Con la 67: la figura mostra i riquadri con i parametri che nascono e spariscono, e il testo dice solo che "i
  parametri spariscono" con la funzione. La funzione `punti` non ha variabili proprie (`return 3 * vinte +
  pareggi`), per non anticipare le variabili locali. Che i parametri di `qualificata` e di `punti` abbiano lo stesso
  nome è detto in una riga, con il link alla 67.
- Con la 68: la figura fa vedere che gli argomenti sono copiati nei parametri, ma non si chiede che cosa succede
  alle variabili di chi chiama se la funzione modifica un parametro. Nessuna funzione della lezione assegna a un
  parametro.
- Una terza esercitazione, su una funzione che restituisce vero o falso (`sufficiente`), era scritta e provata ed è
  stata tolta per stare nelle 400 righe; il generatore ha un livello su questo.

## Scelte

- Stampare e restituire sono presentati con due funzioni diverse sugli stessi numeri (`scheda` e `punti`), e la
  sezione "Stampare non è restituire" li confronta in una tabella.
- `None` di Python compare solo nel riquadro sull'errore "print al posto di return", come deciso per il lotto.
- In C++ il `return` dimenticato in una funzione `int`: la lezione dice che il compilatore lo segnala e che il
  valore "non è definito". Non dice "comportamento indefinito".
- Più `return` in una funzione: una frase nella lezione, e il secondo esercizio (`maggiore`) li usa nei due rami di
  una selezione.
- `bool` in C++ è nominato come tipo delle funzioni che restituiscono vero o falso (la 53 lo ha nella tabella dei
  tipi). Nessun programma stampa un valore vero o falso, che in Python esce `True` e in C++ `1`.
- Il link alla lezione di matematica "Definizione di funzione" è una riga sola; non si fa il confronto tra le due
  idee di funzione.
- Lo sport è il calcetto e non la pallavolo, che non ha pareggi.

## Elementi interattivi

- `inf-parametri-ritorno-passi` (figura del kit, più due pezzi nuovi): "quale argomento finisce in quale parametro,
  e dove va il valore dopo `return`?". Segue il programma di `punti` riga per riga, in Python o in C++; un comando
  cambia la chiamata in `punti(p, v)` e fa vedere il risultato sbagliato senza nessun errore. Il testo prima fa la
  domanda, quello dopo risponde.
- `funzione-argomenti-valore-di-ritorno` (TikZ): la funzione come scatola con due frecce in entrata e una in
  uscita. Guardata in chiaro e in scuro.
- I quattro programmi da eseguire, ciascuno con una modifica chiesta e un risultato da prevedere.

## Verifiche

- `check.mts`: ok su lezione, formulario e flashcard, nessun avviso.
- `verifica.mts`: 2 esercizi, 0 errori (Python e C++).
- I quattro programmi senza prove eseguiti con `python3` e con `clang++ -Wall`: stessa uscita, nessun avviso.
- Provato davvero: `scheda(4)` dà `TypeError: scheda() missing 1 required positional argument: 'pareggi'` (Python
  3.9 del Mac); in C++ `error: no matching function for call to 'scheda'`; `int vinte, pareggi` tra i parametri non
  compila; con `print` al posto di `return` Python scrive `Tigri: None`, poi `12` e `Lupi: None`, e si ferma alla
  somma con `TypeError: unsupported operand type(s) for +: 'NoneType' and 'NoneType'`; in C++ la funzione `int`
  senza `return` compila con l'avviso `non-void function does not return a value` e sul Mac ha scritto `Tigri: 1`.
- Pagina di anteprima aperta a 1280 e a 390 px: nessun errore della pagina in console, nessuno scorrimento
  laterale. In Python i quattro programmi sono stati eseguiti e i due esercizi verificati con la soluzione. In C++,
  nel browser, sono stati eseguiti i primi tre programmi e verificato il primo esercizio; il quarto programma (che
  legge) e il secondo esercizio in C++ sono passati solo da `clang++` e da `verifica.mts`.

## Da verificare

- Il testo esatto del `TypeError` di Python per l'argomento mancante è quello di Python 3.9; l'editor del sito usa
  un Python più recente, in cui il messaggio dovrebbe essere lo stesso. Non l'ho provocato nel browser.
- Che cosa fa nell'editor del sito una funzione C++ `int` senza `return` (un numero a caso, o il programma che si
  ferma) non è stato provato; la lezione resta sul generico.

## Domande per Andrea

- Va bene presentare prima una funzione che stampa (`scheda`) e poi quella che restituisce (`punti`), o preferisci
  partire subito da `return`?
- "Valore di ritorno" e "restituire" sono le parole del lotto. In classe dici anche "la funzione ritorna 14"? La
  lezione non lo usa mai.
- Una funzione con più `return` va bene fin da qui, o preferisci un solo `return` in fondo con una variabile per
  il risultato?
- Le funzioni che restituiscono vero o falso: basta il nome che si legge come un'affermazione (`qualificata`), o
  vuoi una convenzione (`e_qualificata`, `isQualificata`)?
- In C++ il tipo `double` per una funzione compare solo in un riquadro. Serve un esempio con la media?

Prerequisiti proposti: inf-definire-funzioni, inf-espressioni, inf-condizioni, inf-selezione-due-vie

## Revisione del lotto (7 ottobre 2026)

- "una funzione dichiarata `int`" è diventato "definita con il tipo `int`" (parola del lotto: definire).
