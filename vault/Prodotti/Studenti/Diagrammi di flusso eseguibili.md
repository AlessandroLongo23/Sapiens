---
stato: in produzione
release:
aggiornato: 2026-10-05
tag: [prodotto]
---
# Diagrammi di flusso eseguibili

Nelle lezioni di programmazione il diagramma di flusso si esegue un blocco alla volta, con la tabella delle variabili accanto.

## Stato attuale
Costruito il 5 ottobre 2026 su proposta di Alessandro, in due passi (esecuzione, poi modifica e codice). In produzione dalla sera del 5 ottobre (PR #37).

- Un blocco `diagramma` in una lezione contiene un programma di poche righe (`leggi`, `scrivi`, assegnamento, `se` con `altrimenti`, `finché`). La pagina lo disegna con le quattro forme dei libri e lo esegue. La sintassi è in `docs/lezioni/README.md`, sezione "Il diagramma di flusso da eseguire".
- Comandi: "Esegui" (va avanti da solo e si ferma a ogni "leggi"), "Passo", "Indietro", "Ricomincia".
- Il blocco in corso è acceso e la freccia appena percorsa è colorata. Accanto: una frase che dice cosa ha fatto il passo, la tabella delle variabili con segnate quelle lette o cambiate dal blocco, e l'uscita. Su un rombo la frase riscrive la condizione con i valori al posto dei nomi ("6 ≤ 5: è falsa").
- Un errore (variabile senza valore, divisione per zero, testo sommato a un numero) ferma l'esecuzione sul blocco e lo dice a parole. Un ciclo che non finisce viene fermato dopo 2000 passi.
- Accanto al diagramma c'è il suo programma in Python e in C++, generato dalla pagina, con la riga del blocco in corso accesa e un bottone per copiarlo. Il tipo delle variabili per il C++ è dedotto dai valori che prendono; un "leggi" può dichiarare che cosa legge (intero, decimale, testo).
- "Modifica" rende il diagramma modificabile, con i gesti chiesti da Alessandro la sera del 5 ottobre al posto dei campi nella colonna a destra:
  - sopra il diagramma c'è la fila dei cinque blocchi disegnati (leggi, scrivi, assegna, selezione, ciclo); un blocco si trascina su una freccia, che si accende nel punto dove andrà, e lasciandolo si inserisce lì;
  - un blocco del diagramma si trascina su un'altra freccia per spostarlo, con tutto quello che contiene; lasciato lontano dalle frecce resta dov'era;
  - un clic dentro un blocco lo apre per scriverlo sul posto; sotto compaiono il tipo per "leggi", il ramo «no» per la selezione e l'errore quando il testo non si legge;
  - il cestino all'angolo del blocco sotto il puntatore, o di quello che si sta scrivendo, lo elimina;
  - senza trascinare (tastiera, o chi preferisce due tocchi): si sceglie un blocco dalla fila e poi il «+» della freccia.
  La colonna a destra tiene solo il codice e, in esecuzione, variabili e uscita. Ci sono "Annulla" e "Ripristina". Un blocco `diagramma` con `% modifica: sì` si apre già così, anche vuoto.
- Le modifiche dello studente non si salvano: ricaricando la pagina torna il diagramma della lezione.
- Il disegno è calcolato dal programma, nessuno posiziona i blocchi. La pagina pubblicata lo contiene già come SVG, per la stampa e per chi non ha JavaScript.
- L'esecuzione è un interprete scritto da noi (`src/lib/diagramma/`), senza `eval`: il contenuto di un blocco non arriva mai al JavaScript della pagina.
- Le cinque lezioni di programmazione usano il blocco e sono pubblicate: dodici diagrammi da eseguire e uno da costruire ("Pari o dispari", in fondo a "I diagrammi di flusso"). Il testo dice cosa fare con ogni diagramma. Nei due esercizi in cui il programma va scritto guardando il diagramma, il codice accanto è tolto con `% codice: no`.
- Sul sito vero è stato eseguito fino in fondo il primo diagramma di ognuna delle cinque pagine, su Chromium.
- Prove: `tests/unit/diagramma.test.mjs` (21, una esegue con Pyodide il Python generato e lo confronta con il diagramma), `tests/e2e/diagramma.spec.ts` (10, solo Chromium in sviluppo, con il mouse). Il C++ generato è stato compilato a mano su quattro programmi, con la stessa uscita del diagramma; non c'è una prova automatica. Lo script di controllo delle lezioni esegue ogni diagramma con i valori di `% ingresso:`.

Codice: `src/lib/diagramma/` (`espressione.ts`, `blocco.ts`, `disegno.ts`, `esecuzione.ts`, `modifica.ts`, `codice.ts`), `src/components/diagramma/LessonChart.tsx`, `src/lib/utils/chart-figure.ts`.

## Obiettivo
Quello che manca dell'idea, non deciso:
- Dal codice al diagramma: lo studente scrive il programma e il diagramma si disegna. Serve leggere un sottoinsieme di Python e di C++.
- Un posto dove lo studente costruisce i suoi diagrammi e li salva, come l'editor di codice tra gli strumenti. Oggi il diagramma modificabile esiste solo dentro una lezione.
- Aprire il codice generato nell'editor di codice.

## Dettagli
- Non ci sono salti: ogni diagramma che si può scrivere ha un programma in Python e in C++ che fa lo stesso.
- `/` è la divisione della calcolatrice (7 / 2 fa 3,5); `//` e `%` sono quoziente e resto tra interi.
- Nel codice C++ una divisione `/` tra due interi diventa `(double) a / b`, perché nel diagramma non perde i decimali. `//` tra interi diventa `/`: con i numeri negativi il C++ tronca verso lo zero e il diagramma (come Python) verso il basso, e il resto ha segno diverso. Non è corretto nel codice generato.
- Un valore vero o falso scritto con `scrivi` esce come 1 o 0 in C++ e come True o False in Python.
- Le parole che uniscono due condizioni sono `E`, `O`, `NON` in maiuscolo, perché `e` e `o` servono come nomi di variabili (l'età nella lezione 47).

## Domande aperte
- Le figure in TikZ comparivano in Google Immagini; un SVG nel testo no. Da decidere se conta.
- Nella pagina di una lezione la colonna del testo è stretta (circa 650 px con indice e Sapiens AI aperti): al diagramma restano circa 350 px, e quelli più larghi scorrono di lato dentro il loro riquadro. Da decidere se sotto una certa larghezza della colonna il codice deve andare sotto il diagramma.
- Un diagramma costruito dallo studente non ha una verifica automatica, come ce l'hanno i programmi con "Verifica".
- Non provato su Safari, Firefox e su un telefono vero. Il trascinamento con il dito non è stato provato: su un blocco il dito trascina il blocco e non fa scorrere la pagina.
- Trascinare un blocco fuori dal diagramma non lo elimina: lo fa solo il cestino. Alessandro aveva indicato tutti e due i modi, preferendo il cestino.
- I tipi dedotti per il C++ possono non essere quelli che lo studente si aspetta (una variabile che parte da 0 e poi prende un decimale è `double` dall'inizio). Da guardare con Andrea.
- Una tabella con tutti i passi fatti (la tabella di traccia delle lezioni, compilata da sola) non c'è.
- Le domande per Andrea su parole e divisione sono in [[Domande per Andrea]], sezione del 5 ottobre.

## Collegamenti
- Attori: [[Studente]]
- [[Lezioni]], [[Editor di codice]], [[Pipeline lezioni]]
- [[2026-10-05 Prime lezioni di programmazione]]
