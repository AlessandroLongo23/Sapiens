# Note: Leggere e scrivere un file di testo

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "I file", gruppo 7). Non pubblicata.

Prerequisiti proposti: inf-file-system, inf-massimo-minimo-media, inf-stringhe

## Struttura

Apertura con il record di un gioco e la rubrica (i dati che devono restare dopo la fine del programma), con il
rimando a memoria centrale e memorie di massa e al file system; file di testo e le tre mosse (aprire, leggere o
scrivere, chiudere); lettura riga per riga; i numeri di un file sono testo (figura e programma della media);
scrittura; accodamento e chiusura prima di rileggere; il file che non c'è; due esercizi.

- 399 righe in tutto, di cui circa 60 di testo da leggere.
- Programmi da eseguire: 5, ciascuno in Python e in C++, tutti con un file accanto (`iscritti.txt`, `voti.txt`,
  `tabellina.txt`).
- Esercizi: 2. Il primo legge `passi.txt` e conta; il secondo legge `voti.txt` e scrive `scelti.txt`, con due prove
  che controllano la stampa e il file (`%% file`).
- Figure interattive: 1 (`inf-file-lettura-righe`). Figure TikZ: nessuna. Diagrammi: nessuno, perché il
  linguaggio dei blocchi `diagramma` non ha i file.
- Riquadri `ad-warning`: 4. Riquadri `ad-note`: 3.

## Confini con le altre lezioni del gruppo

- Qui il file ha un dato per riga. Dividere una riga in più campi è della 80, che per questo introduce `split` e
  `getline` con il separatore; `strip()` e `readline()` compaiono già qui, perché la 80 li usa.
- Niente formati: la parola CSV non c'è.

## Scelte

- La conversione in C++ è `stoi(riga)` dopo `getline`, in parallelo con `int(riga)` di Python, così il testo vale
  per tutti e due i linguaggi e la figura mostra una sola storia (la riga è un testo, poi diventa un numero).
  `file >> voto` sta nel riquadro, come scrittura alternativa. `stod` è solo nominato.
- In Python sempre `with`. `file.close()` di Python non c'è; in C++ `file.close()` è scritto in ogni programma,
  anche dove il file si chiuderebbe da solo alla fine di `main`.
- Il file che non c'è: in Python `try` ed `except FileNotFoundError`, presentati come una forma da usare, senza
  spiegare le eccezioni; in C++ `if (!file)`. Il riquadro insiste sul fatto che in C++ un'apertura fallita non
  dà nessun messaggio.
- I modi sono tre: lettura, `"w"`, `"a"`. `"r"` scritto per esteso, `"r+"`, i file binari e i percorsi con le
  cartelle non ci sono.
- Due file aperti insieme (secondo esercizio): in Python due `with` uno dentro l'altro, non la forma con la
  virgola.
- Il programma della tabellina ha accanto un `tabellina.txt` con una riga di appunti: senza un file accanto
  l'editor non tiene il file scritto tra un'esecuzione e l'altra, e l'esperimento "esegui due volte" non si
  vedrebbe. Così la prima esecuzione mostra anche che la scrittura cancella.
- La memoria di appoggio (buffer) è nominata con queste parole, senza il termine inglese.
- `getline(cin, nome)` compare nel programma dell'accodamento per leggere un nome con lo spazio.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard).
- `verifica.mts`: 2 esercizi, 0 errori, in Python e in C++ con il Clang del sito.
- Ogni programma, anche quelli senza prove, è stato eseguito con il Pyodide e il Clang del sito (script nello
  scratchpad) e poi nel browser, nei due linguaggi, a 1280 e a 390 px: uscite uguali nei due linguaggi, file
  scritti e accodati come dice il testo, nessun errore in console, nessuno scorrimento laterale. I due esercizi:
  "Verifica" con il programma di partenza dà 0 prove superate, con la soluzione le supera tutte, nei due linguaggi.
- Provato davvero: senza `strip()` Python lascia le righe vuote; le righe attaccate senza conversione danno
  `81067`; un file riaperto in lettura prima di essere chiuso risulta vuoto (con `python3` sul Mac).
- La traccia della figura ha i suoi test (`tests/unit/informatica-file.test.mjs`).

## Elementi interattivi

- Programmi con file (5 esempi e 2 esercizi): il file è una linguetta accanto al programma, e lo studente lo
  modifica per vedere che il programma non cambia.
- `inf-file-lettura-righe` (figura a passi, fatta con `Celle`, `Variabili`, `Legenda`, `Frase` e `ComandiPassi`
  del kit): "che cosa finisce in `riga` a ogni giro, e da dove riparte la lettura al giro dopo?". Guardata sul sito
  in chiaro e in scuro, a 800 e a 390 px, al primo passo, a metà e alla fine, e dentro la lezione.

## Da verificare

- La frase del riquadro sulla chiusura ("rischi di non trovare le ultime righe") descrive quello che succede di
  solito; quanto resta nella memoria di appoggio dipende dal sistema e dalla quantità di dati. In C++ `endl`
  svuota la memoria di appoggio a ogni riga, quindi con i programmi della lezione il problema non si vede: il
  riquadro vale come regola.
- Nell'editor del sito un programma C++ che apre un file inesistente non stampa niente, come su un computer
  vero: provato con il primo programma.

## Domande per Andrea

- Per il file che non c'è in Python va bene `try` ed `except`, due anni prima delle eccezioni, oppure preferisci
  `os.path.exists` (più vicino a `if (!file)` del C++)?
- In C++ per leggere i numeri preferisci `getline` e `stoi`, come qui, o `file >> voto` come forma principale?
- `file.close()` in C++ va scritto sempre, come qui, anche quando il file si chiude da solo alla fine di `main`?
- Va bene chiamare "segnaposto" il punto del file a cui è arrivata la lettura, o in classe usi "cursore" o
  "puntatore"?
- La lettura dell'intero file in una volta (`read()`, `readlines()`) serve in questa lezione?

## Revisione del lotto (7 ottobre 2026)

- Nel riquadro sulla somma senza conversione: senza `strip()` le righe portano l'a capo, quindi non esce `81067` ma le quattro righe del file. Corretto.
