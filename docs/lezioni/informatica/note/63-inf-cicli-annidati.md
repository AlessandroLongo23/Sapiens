# Note: Cicli annidati

Lezione nuova, scritta da zero il 5 ottobre 2026 (secondo anno, capitolo "L'iterazione"). Non pubblicata.

## Struttura

Apertura con ore e minuti dell'orologio; ciclo esterno e ciclo interno, con i posti di una sala di 2 file per 3
(diagramma da eseguire, programma, tabella di traccia con due contatori); quante volte gira il corpo interno, con la
tavola pitagorica; i disegni di asterischi, rettangolo e triangolo, e un secondo diagramma in cui il ciclo interno
dipende da quello esterno; due esercizi.

- 348 righe; circa 1060 parole di testo.
- Programmi da eseguire: 4 (posti della sala, tavola pitagorica, rettangolo, triangolo), ciascuno in Python e in C++.
- Esercizi con le prove: 2 (triangolo rovesciato; cornice di un rettangolo, con una selezione nel corpo interno).
- Diagrammi: 2 (`diagramma-flusso-due-cicli-annidati`, 2 per 3; `diagramma-flusso-ciclo-interno-che-dipende-da-i`,
  con `i` fino a 3). Nessuno ha valori in ingresso.
- Tabelle di traccia: 1, con una colonna per contatore. Riquadri `ad-warning`: 3. Riquadri `ad-note`: 1.

## Verifiche

- `check.mts`: nessun errore, tre avvisi "separatore ---" alle righe 178, 212 e 224. Sono falsi allarmi: sono righe
  di tre asterischi dentro un blocco di codice (il disegno del triangolo e le uscite attese delle prove), che il
  controllo scambia per una riga di separazione.
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I quattro programmi senza prove sono stati eseguiti con `python3` e compilati con `clang++ -Wall` (nessun avviso);
  le uscite dei due linguaggi coincidono.
- I due diagrammi sono stati eseguiti con la libreria del sito: il primo scrive le sei righe della tabella di traccia
  in 29 passi e finisce con `i` = 3 e `j` = 4; il secondo scrive sei righe in 33 passi.
- La pagina di anteprima risponde (HTTP 200) e contiene i disegni; non è stata aperta in un browser, quindi i due
  diagrammi non sono stati guardati né eseguiti a mano. Sono alti (660 unità del disegno): da controllare su un
  telefono che si seguano senza perdere di vista la tabella delle variabili.

## Scelte che il README non fissava

- Contatori `i` (esterno, righe) e `j` (interno, colonne), come nel riquadro della 61.
- Il primo diagramma è quello dei due `while`; i programmi usano due `for`. La differenza serve al riquadro sul
  contatore interno che riparte: con il `while` l'errore si può fare, con il `for` no.
- Scrivere senza andare a capo (`end=""` e `end=" "` in Python, `cout` senza `endl` in C++) è spiegato qui in un
  `ad-note`, perché non sapevo se la 52 lo tratta. Se lo tratta, il riquadro diventa un richiamo.
- Nella tavola pitagorica i numeri sono separati da uno spazio, quindi le colonne non sono allineate. Con la
  tabulazione le dieci colonne non stanno nello schermo di un telefono (il riquadro dell'uscita va a capo). La
  lezione propone `"\t"` come prova su uno schermo largo. `setw` e le stringhe formattate non ci sono.
- Ogni riga della tavola finisce con uno spazio prima dell'a capo. Negli esercizi i disegni non hanno separatori.
- Il disegno del triangolo è in un blocco di codice senza linguaggio. È l'unico punto in cui la lezione mostra
  un'uscita senza farla eseguire.
- In Python un rettangolo si scrive anche con `print("*" * colonne)`: la lezione non lo dice, perché toglie il ciclo
  interno che è l'argomento.
- Il numero dei giri quando il ciclo interno dipende da quello esterno è dato come somma ($1 + 2 + \ldots + n$),
  senza la formula $n(n + 1)/2$.
- La frase "due cicli da mille giri eseguono il corpo un milione di volte" è l'unico accenno al costo: il confronto
  tra algoritmi è al terzo anno.
- Il secondo esercizio usa `or` e `||` e rimanda alla lezione 58 sugli operatori logici.

## Da verificare

- Il riquadro "Due contatori, due nomi" dice che con lo stesso nome il programma dei posti scrive due volte il numero
  del posto. Provato: in Python e in C++ (dove il secondo `int i` nasconde il primo) escono `1 1`, `2 2`, `3 3` per
  ogni fila. Con due `while` e una sola variabile il comportamento è diverso (il ciclo esterno finisce prima): la
  lezione non entra nel caso.

## Domande per Andrea

- I disegni di asterischi li fai al secondo anno? E quali oltre a rettangolo e triangolo (triangolo allineato a
  destra, piramide)?
- La tavola pitagorica va allineata in colonna? In quel caso serve uno strumento in più (tabulazione, `setw`,
  stringhe formattate): quale usi?
- `end=""` di Python lo presenti nella lezione sull'output o quando serve?
- Nella tabella di traccia di due cicli annidati metti anche le righe dei controlli che danno falso, o solo i giri
  del corpo interno come qui?
