# Note: La selezione a due vie

Lezione nuova, scritta da zero il 5 ottobre 2026 secondo `brief-programmazione.md` (secondo anno, capitolo "La
selezione"). Non pubblicata.

## Struttura

La condizione come domanda con risposta sì o no, con i sei operatori di confronto richiamati in un paragrafo; la
selezione a una via (`if`) con lo sconto di 10 euro sopra i 50; il blocco, con il rientro di Python e le graffe del
C++; la selezione a due vie (`if ... else`) con promosso o bocciato; pari o dispari come terzo programma; due
esercizi in "Prova tu"; una riga finale che nomina operatori logici e selezioni annidate.

- Programmi da eseguire: 3 (sconto, promosso o bocciato, pari o dispari), ciascuno in Python e in C++.
- Esercizi con le prove: 2 (il maggiore di due numeri, a due vie; la spedizione sotto i 30 euro, a una via), con
  quattro prove ciascuno, compresi i valori di confine (5 e 5; 30 e 29) e i numeri negativi.
- Diagrammi di flusso: 2 (`diagramma-flusso-sconto-una-via`, `diagramma-flusso-promosso-due-vie`), ciascuno con gli
  stessi nomi e gli stessi passi del programma che lo segue.
- Riquadri `ad-warning`: 4 (`=` al posto di `==`; i due punti e il rientro in Python; il punto e virgola e le graffe
  in C++; l'`else` con una condizione).

## Verifiche

- `check.mts`: "ok", nessun errore e nessun avviso.
- `verifica.mts`: "2 esercizi controllati, 0 errori" (Python e C++).
- I tre programmi di esempio compilati con `clang++ -std=c++17 -Wall` ed eseguiti insieme alle versioni Python con
  `python3`, sugli ingressi suggeriti nel testo (80, 30, 50; 8, 4, 6; 0, -7, 10): stessa uscita nei due linguaggi.
- Gli errori dei riquadri sono stati provati uno per uno. In C++: `if (spesa >= 50);` e l'`if` senza graffe
  compilano e con 30 stampano 20; `if (voto = 10)` compila e risulta sempre vera; `else voto < 6` non compila. In
  Python: `if voto = 10:`, i due punti mancanti e `else voto < 6:` danno `SyntaxError`, il rientro mancante
  `IndentationError`.
- Figure guardate in chiaro e in scuro con `anteprima.mjs` (cartella `/tmp/sapiens-lez57`). Corretto dopo il primo
  giro: nel secondo diagramma la scritta "non promosso" usciva dal parallelogramma, ed è diventata "bocciato" (anche
  nel programma); nel primo il parallelogramma del ramo sì è stato allargato a 4 cm per contenere la stessa scritta
  del programma, "sconto di 10 euro". Larghezze: 7,7 cm e 8,7 cm. Nessuna freccia attraversa blocchi o testi.
- La pagina sul sito in sviluppo (porta 3001) non è stata guardata: dalla shell di questa sessione la porta non
  rispondeva. Restano da vedere nel browser l'editor con le due linguette e i riquadri.

## Scelte che il README non fissava

- Lunghezza: 327 righe, contro le 120-200 del brief. Tre programmi e due esercizi nei due linguaggi, con soluzioni
  e prove, più due diagrammi, occupano da soli circa 230 righe; il testo da leggere è di circa 45 righe. Da decidere
  se il limite va contato senza i blocchi `codice` e `tikz`.
- Le differenze tra i linguaggi non stanno in un `ad-note` dopo il programma, come dice il README, ma nella sezione
  "Il blocco": in questa lezione rientro e graffe sono l'argomento, non una precisazione.
- Nomi delle variabili nei diagrammi: parole intere in corsivo matematico (`$\mathit{spesa}$`, `$\mathit{voto}$`),
  uguali a quelle del programma, al posto delle lettere singole del modello.
- Parallelogramma largo 4 cm nel primo diagramma, disegnato a mano con le stesse proporzioni della macro `\dati`.
- La selezione a una via ha il ramo sì a destra e il ramo no che scende dritto; i rami si riuniscono con una freccia
  che entra nella linea verticale.
- "Promosso" e "bocciato" con un voto intero e la soglia a 6, senza media e senza numeri con la virgola, che
  appartengono alla lezione sui tipi.
- Somme in euro intere, per la stessa ragione: sconto fisso di 10 euro, non in percentuale.
- Un solo link, alla funzione `SE` del foglio di calcolo (lezione 26), che è la stessa scelta a due vie. Le lezioni
  sui diagrammi di flusso, sui confronti, sugli operatori logici e sulle selezioni annidate sono nominate senza link.
- Il messaggio d'errore di Python non è citato alla lettera, perché cambia da una versione all'altra.

## Domande per Andrea

- "Selezione a una via" e "a due vie": sono i nomi che usi, o preferisci "selezione semplice" e "selezione doppia"
  (o "binaria")?
- "Bocciato" va bene, o vuoi "non promosso" (che chiede un diagramma più largo o un carattere più piccolo)?
- Il ramo sì nella selezione a una via: a destra, come qui, o in basso con il no di lato, come in alcuni libri?
- In C++ le graffe si mettono sempre, anche con una sola istruzione nel blocco? La lezione le mette sempre e
  presenta la loro assenza solo come errore, senza dire che con una sola istruzione sono facoltative.
- L'operatore `%` qui è richiamato in una riga: la lezione "Operatori ed espressioni" lo introduce prima, o va
  spiegato meglio in questa?
- Il resto di un numero negativo (`-7 % 2` vale 1 in Python e -1 in C++) non è nominato: il confronto con 0
  funziona in tutti e due. Serve una riga, qui o nella lezione sugli operatori?

Le domande non sono state copiate in `vault/Contenuti/Domande per Andrea.md`, perché il brief vieta di modificare
file esistenti: vanno riportate lì da chi raccoglie il lotto.
