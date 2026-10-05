# Note: Errori e debug

Lezione nuova, scritta il 5 ottobre 2026 secondo `brief-secondo-anno.md`, con formulario e flashcard. Non pubblicata.

## Che cosa c'è

Bug e debug; i tre tipi di errore in una tabella; errori di sintassi, con i messaggi veri dei due linguaggi e come si
leggono (dove, il punto esatto, che cosa); i messaggi più frequenti; errori in esecuzione (divisione per zero, dato
scritto male); errori logici, con un diagramma sbagliato da correggere; stampe di controllo e tabella di traccia; il
procedimento in quattro passi; tre esercizi.

- 331 righe, circa 60 di testo. Figure TikZ: 0. Programmi da eseguire: 3 (la media con un errore di sintassi; la
  spesa divisa tra le persone; il prezzo scontato con un errore logico). Esercizi con le prove: 2 (tre errori di
  sintassi da togliere; quoziente e resto scambiati). Diagrammi: 2, tutti e due con un errore dentro, da correggere
  con "Modifica": `diagramma-flusso-media-con-errore` (mancano le parentesi) e `diagramma-flusso-somma-con-errore`
  (`i < n` al posto di `i <= n`).
- Riquadri: 2 `ad-note`, 3 `ad-warning`.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard: 19 carte).
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++, e i programmi di partenza no.
- I messaggi sono stati letti nella pagina di anteprima (`/prova-grafico/lezione?file=...`) con Chromium, pilotato da
  Playwright, nelle due linguette, e sono riportati come sono:
  - sintassi, Python: `File "programma.py", line 4`, la riga, `^`, `SyntaxError: '(' was never closed`;
  - sintassi, C++: `programma.cpp:6:29: error: expected ';' at end of declaration`, con il disegno e
    `1 error generated.`;
  - divisione per zero, Python: il `Traceback` con `ZeroDivisionError: division by zero` alla riga 4, dopo
    "Divido la spesa";
  - divisione per zero, C++: `Errore durante l'esecuzione: divisione intera per zero.`, dopo "Divido la spesa";
  - risposta "quattro": Python `ValueError: invalid literal for int() with base 10: 'quattro'`; il C++ mette 0 in
    `persone` e si ferma alla divisione;
  - prezzo scontato: 55 nei due linguaggi; in C++ compare prima `warning: unused variable 'risparmio'`;
  - primo esercizio: Python segnala un errore alla volta (per primo `unterminated string literal` alla riga 4, non
    la parentesi della riga 2); il C++ elenca i tre errori insieme.
- Gli altri messaggi della tabella (`unexpected indent`, `name 'x' is not defined`, `use of undeclared identifier`,
  `expected '}'`) sono stati provati con il Python e il Clang del sito, da riga di comando.
- Diagrammi provati nella pagina: il primo con 6 e 8 scrive 10; con "Modifica", un clic dentro il rettangolo e
  `(a + b) / 2` nel campo, poi "Prova il diagramma", scrive 7. Il secondo con 4 scrive 6. Guardati in chiaro e in
  scuro. La correzione del rombo del secondo non è stata provata a mano.
- La lezione è stata guardata nella pagina a 900 px: i messaggi nei blocchi di codice semplici tengono
  l'allineamento dell'accento.

## Scelte che il README non fissava

- I messaggi di errore stanno in blocchi di codice semplici (tre accenti gravi senza linguaggio), non in blocchi
  `codice`: non sono programmi.
- "Errore in esecuzione", non "errore di runtime"; "errore logico"; "stampe di controllo"; "avviso" per `warning`.
- Il diagramma della media non ha un blocco `codice` gemello: il suo programma è quello che la pagina scrive accanto,
  e l'algoritmo è la media di due voti del testo. In C++ quel codice è `double media = a + (double) b / 2;`.
- Il ciclo compare solo nel terzo esercizio, in un diagramma, con il link alla 47 e alla 60. Nessun programma dei
  blocchi `codice` usa selezione o cicli.
- Il secondo diagramma finisce senza errori (un diagramma che si ferma farebbe fallire `check.mts`): l'errore è solo
  nel risultato.
- La tabella di traccia ha una colonna "valore giusto" accanto a quella del valore calcolato, e le righe sono
  descritte a parole ("calcolo di `risparmio`"), perché l'istruzione è diversa nei due linguaggi (`//` e `/`).
- Niente storia della parola "bug" (la falena del 1947): è un aneddoto con una fonte da controllare.
- Il debugger passo passo degli ambienti di sviluppo non c'è: l'editor del sito non lo ha, e "Passo" dei diagrammi fa
  quel lavoro.

## Da segnalare a chi cura il sito

- In C++ il resto per zero (`8 % 0`) nell'editor dà `Errore durante l'esecuzione: RuntimeError: remainder by zero`,
  non tradotto: in `src/components/codice/wasi.ts` la funzione `trap` riconosce "divide by zero" e "division by
  zero", non "remainder by zero". Provato con Node, non nel browser. La lezione non usa questo caso.
- I messaggi dipendono dalle versioni: Python 3.14 di Pyodide e il Clang di `@yowasp/clang`. Se cambiano, vanno
  riletti i quattro messaggi citati per intero e la tabella.
- Il testo di `Errore durante l'esecuzione: divisione intera per zero.` viene da `wasi.ts`, che traduce la frase del
  motore del browser: è stato visto solo con Chromium.

## Domande per Andrea

- I tre nomi: "di sintassi", "in esecuzione" (o "di runtime"), "logici" (o "semantici")? Quali usi?
- Parli anche degli avvisi del compilatore al biennio?
- Per cercare un errore fai usare un debugger, o le stampe e la tabella di traccia bastano?
- Va bene che il terzo esercizio abbia un ciclo, visto solo nei diagrammi della 47, o lo sposto nel capitolo
  sull'iterazione?
