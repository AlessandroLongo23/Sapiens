# Note: Selezioni annidate e a più vie

Lezione nuova, scritta da zero il 5 ottobre 2026 secondo `brief-secondo-anno.md` (secondo anno, capitolo "La
selezione"), insieme alla 56 e alla 58. Non pubblicata.

## Struttura

Le selezioni annidate con il termometro (sopra lo zero, sotto, zero: diagramma con due rombi e programma); a quale
`if` appartiene un `else`; la selezione a più vie con `elif` e `else if` (dal voto al giudizio, quattro strade);
l'ordine delle condizioni, con la tabella del percorso del voto 7 e il riquadro sui tanti `if`; `switch` in C++ e
`match` in Python con il distributore; un diagramma da completare e due esercizi.

- Programmi da eseguire: 3 (termometro, giudizio, distributore), ciascuno in Python e in C++.
- Esercizi con le prove: 2 (prezzo del biglietto del museo per età, con i confini 6, 17, 18 e 65; tipo di
  triangolo, con gli operatori logici e l'ordine delle condizioni).
- Diagrammi: 2 (`diagramma-flusso-termometro-annidata`, da eseguire; `diagramma-flusso-da-completare-confronto`,
  con `% modifica: sì`, da completare con una seconda selezione nel ramo del no).
- Riquadri `ad-warning`: 3 (a quale `if` appartiene un `else`; tanti `if` al posto di `elif`; il `break`).
  `ad-note`: 1.
- Righe: 335. Testo da leggere, contato come nella nota della 56: 28 righe, circa 1190 parole. È sotto le 40 righe
  del brief, come la 57 pubblicata (29 righe): i paragrafi sono lunghi, e per restare sotto le 350 righe in tutto
  non c'era spazio per altro testo.

## Verifiche

- `check.mts`: ok su lezione, formulario e flashcard (17 carte).
- `verifica.mts`: le due soluzioni superano le prove in Python e in C++.
- I tre programmi senza prove eseguiti con Pyodide e con `@yowasp/clang` (-4, 0, 5; 5, 6, 7, 9; 1, 2, 3, 8); in C++
  compilati anche con `clang++ -Wall`, senza avvisi.
- Provato davvero: senza i `break` lo `switch` con 1 scrive tutti i casi che seguono; con `if` al posto di `elif` il
  voto 9 scrive "ottimo", "buono", "sufficiente"; in C++ un `else` senza graffe si attacca all'`if` più vicino
  (Clang avvisa con `-Wdangling-else`).
- I due diagrammi guardati nella pagina in sviluppo con un browser pilotato da Playwright, in chiaro e in scuro; il
  primo eseguito fino in fondo con -4 (si accendono i due rombi, esce "sotto"), e il codice accanto coincide con il
  programma della lezione, a parte la domanda di `input`. Il secondo si apre già in modifica, con il ramo del no
  vuoto; non è stato completato trascinando i blocchi.

### `match` di Python

- Serve Python 3.10 o successivo (PEP 634, "Structural Pattern Matching"). L'editor del sito usa Pyodide 314.0.7,
  cioè Python 3.14.2: il programma con `match` è stato eseguito lì e funziona. Il `python3` della macchina è 3.9.6 e
  non lo esegue: chi prova la lezione fuori dal sito con un Python vecchio ottiene `SyntaxError`.
- La lezione non scrive il numero della versione ("solo nelle versioni recenti del linguaggio").
- Di `match` si usa solo la forma con i valori fissi e `case _`. Niente `case 2 | 3`, niente schemi con variabili.

### Corretto dopo aver guardato i diagrammi

- Nella pagina il riquadro del disegno è largo 576 px, e più largo di così il diagramma scorre di lato. Il primo
  esempio era "positivo, negativo, zero" (595 px, con l'ultimo blocco tagliato): è diventato il termometro, con le
  scritte "sopra", "sotto", "zero" (549 px).
- Il diagramma del giudizio, con tre rombi in cascata, era largo 862 px, e anche con scritte di una lettera non
  scende sotto i 640: è stato tolto. La selezione a più vie è spiegata sul programma, e il testo dice come sarebbe
  il diagramma. Su un telefono (riquadro di circa 360 px) scorrono di lato tutti i diagrammi con due rami.
- Nel diagramma da completare la terza scritta era "uguali" (580 px a diagramma finito), ed è diventata "pari"
  (564 px).

## Scelte che il README non fissava

- "Selezione a più vie" per la catena `if`, `elif`, `else`; "annidate" per una selezione nel blocco di un'altra.
  Niente "selezione multipla" nel testo (è solo nello slug) e niente "a cascata".
- Lo `switch` e il `match` sono presentati come lo stesso programma nei due blocchi `codice`, con `default` e
  `case _` come corrispondenti. Non hanno un diagramma: il linguaggio dei diagrammi li scriverebbe come una catena
  di rombi con `==`.
- Dello `switch` non ci sono i casi raggruppati (`case 4: case 6:`) né l'uso voluto della caduta da un caso
  all'altro; `char` è nominato solo come "singoli caratteri".
- In C++ le graffe si mettono sempre; l'`else` senza graffe compare solo nel riquadro.
- L'operatore condizionale `? :` e l'espressione `a if c else b` di Python non ci sono.
- Il diagramma da completare non ha `% codice: no`: il codice accanto segue le modifiche dello studente, e con il
  ramo vuoto Python mostra `pass`, che la lezione non spiega.
- Variabile `gradi`, numero intero, senza unità di misura nel programma.

## Da verificare

- "Lo `switch` confronta solo numeri interi e singoli caratteri": è vero per i tipi interi e le enumerazioni; la
  lezione non nomina le enumerazioni.
- Il tasto "Verifica" degli esercizi non è stato premuto nel browser: le prove sono state eseguite solo con
  `verifica.mts`.

## Domande per Andrea

- Al secondo anno presenti lo `switch`? E in Python fai usare `match`, o solo `elif`?
- "Selezione a più vie" o "selezione multipla"? E per le annidate dici "annidate" o "nidificate"?
- Nei diagrammi la selezione a più vie è una cascata di rombi nel ramo del no: è il disegno del tuo libro, o usi un
  blocco solo con più uscite?
- L'esempio di apertura era "positivo, negativo, nullo", sostituito dal termometro per la larghezza del diagramma:
  preferisci il classico, con un diagramma che scorre di lato?
- Il triangolo equilatero, isoscele, scaleno come esercizio finale: va bene senza il controllo che i tre lati
  formino davvero un triangolo?

Le domande non sono state copiate in `vault/Contenuti/Domande per Andrea.md`, perché il brief vieta di modificare
file esistenti: vanno riportate lì da chi raccoglie il lotto.
