# Note: Il ciclo while

Lezione nuova, scritta da zero il 5 ottobre 2026 (secondo anno, capitolo "L'iterazione"), insieme alla 61 sul ciclo
`for`. Non pubblicata.

## Struttura

Apertura con i piatti da lavare; ciclo, giro, iterare, condizione e corpo, con il conto alla rovescia (diagramma e
programma); la tabella di traccia del conto alla rovescia da 3, con la distinzione tra giri e controlli; la variabile
che fa finire il ciclo, il ciclo infinito (con l'invito a provarlo e il limite dell'editor), il ciclo che non parte
mai; il numero di giri non noto in partenza, con la pallina che rimbalza (dimezzare sopra una soglia) e la somma dei
numeri letti fino allo zero (diagramma e programma); due esercizi.

- Programmi da eseguire: 3 (conto alla rovescia, rimbalzi, somma fino allo zero), ciascuno in Python e in C++.
- Esercizi con le prove: 2 (stampare i numeri da 1 a n; contare le cifre di n).
- Diagrammi di flusso: 2 (`diagramma-flusso-conto-alla-rovescia`, `diagramma-flusso-somma-fino-a-zero`).
- Tabella di traccia: 1.
- Riquadri `ad-warning`: ciclo che non finisce, verso del confronto, variabile usata prima di averle dato un valore.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso.
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I tre programmi senza prove sono stati eseguiti con `python3` e compilati con `clang++ -Wall` (nessun avviso); le
  uscite dei due linguaggi coincidono. La somma è stata provata con 4, 7, -2, 0 (dà 9), i rimbalzi danno 100, 50, 25,
  12, 6.
- Figure guardate in chiaro e in scuro con `anteprima.mjs` (279 px di larghezza al sito, circa 6,6 cm): nessuna
  freccia attraversa un blocco, "sì" e "no" leggibili. Non è servita nessuna correzione.
- La pagina sul sito in sviluppo non è stata aperta in un browser: l'editor e le linguette non sono stati provati a
  mano.

## Scelte che il README non fissava

- Lunghezza: 330 righe, sopra le 200 del brief. Tre programmi e due esercizi nei due linguaggi, con le soluzioni e le
  prove, più due diagrammi, occupano da soli circa 250 righe; il testo da leggere è di circa 40 righe (paragrafi di
  una riga) e sta nei 10-15 minuti. Da decidere se il limite va contato senza i blocchi `codice` e `tikz`.
- Forma del ciclo nel diagramma: la freccia di ritorno esce dal fondo dell'ultimo blocco del corpo, passa a sinistra
  e rientra con la punta sulla freccia sopra il rombo; il ramo "sì" scende, il ramo "no" esce a destra, scende a lato
  del corpo e rientra al centro sotto il ciclo. La 61 usa lo stesso disegno.
- Nomi: `i` per la variabile che conta, `n` per il dato letto, `s` per la somma. Gli stessi nella 61.
- Aggiornamento scritto per esteso (`i = i - 1`, `s = s + n`), senza `-=`, `+=` e `i--`: le forme brevi compaiono
  nella 61, dove servono per il `for` del C++.
- Divisione intera: `//` in Python e `/` tra `int` in C++, spiegata in un `ad-note` di due righe. Se la lezione
  "Operatori ed espressioni" la tratta, il riquadro si può accorciare.
- Termini: "ciclo", "giro" per la singola esecuzione del corpo, "iterare" nominato una volta, "corpo", "condizione".
  "Ciclo infinito" è il nome dato nel riquadro. Non c'è "sentinella" per lo zero che chiude la lettura: il testo dice
  "segnale di fine".
- Il `do-while` del C++ non c'è: non ha un corrispondente in Python e l'albero non gli dà una lezione.
- `break` e `while True` non ci sono.
- Il messaggio dell'editor sul ciclo infinito è descritto senza citarlo alla lettera ("ferma il programma dopo 10
  secondi o quando ha stampato troppo testo, e ti avvisa"); il limite di tempo è `TIME_LIMIT` in
  `src/components/codice/runtime.ts`. Se cambia, va cambiata la frase.
- La prova con $n = 0$ del primo esercizio ha una `%% stampa` vuota: `verifica.mts` la accetta.

## Da verificare

- In C++ il conto alla rovescia senza `i = i - 1` stampa molto in fretta: l'editor dovrebbe fermarlo per il troppo
  testo e non per il tempo. Da provare nel browser, anche per vedere che la pagina resta usabile.
- Il riquadro sulla variabile senza valore dice che in C++ il programma "parte lo stesso, con dentro `n` un numero
  qualunque": è vero con un compilatore vero; da controllare che cosa fa il C++ dell'editor (potrebbe dare sempre 0).

## Domande per Andrea

- Il ciclo con il controllo in fondo (`do-while`) va presentato al biennio, almeno nel diagramma di flusso, o si
  salta perché Python non lo ha?
- "Giro" per una ripetizione del corpo va bene, o in classe usi "iterazione"?
- Lo zero che chiude la lettura: lo chiami "sentinella", "tappo", o non gli dai un nome?
- Nei diagrammi il ramo "sì" scende e il ramo "no" esce di lato: è la disposizione del tuo libro?
- La tabella di traccia ha una riga per ogni controllo della condizione, compreso l'ultimo che dà falso: la fai così
  o una riga per giro?
