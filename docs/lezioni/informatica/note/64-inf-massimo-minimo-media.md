# Note: Massimo, minimo e media di una sequenza

Lezione nuova, scritta da zero il 5 ottobre 2026 (secondo anno, capitolo "L'iterazione"), ultima del biennio. Non
pubblicata.

## Struttura

Apertura con il registro elettronico e il meteo; il massimo come "il più grande visto finora", con il primo dato
come valore di partenza (diagramma, tabella di traccia, programma con lunghezza nota) e l'errore di partire da 0; il
minimo, con lo stesso errore sui voti; la sequenza chiusa da un valore di fine (minimo dei voti chiusi da 0), con
l'invito ad aggiungere il massimo; la media con accumulatore e contatore, la divisione tra interi nei due linguaggi,
la divisione per zero; due esercizi.

- 350 righe, il limite; circa 1150 parole di testo.
- Programmi da eseguire: 3 (massimo di n temperature, minimo dei voti chiusi da 0, media dei voti chiusi da 0),
  ciascuno in Python e in C++.
- Esercizi con le prove: 2 (minimo di n temperature; media dei soli voti sufficienti, con il caso senza dati).
- Diagrammi: 1 (`diagramma-flusso-massimo-di-n-valori`, con ingresso 4, -3, -7, -1, -5).
- Tabelle di traccia: 1. Riquadri `ad-warning`: 3. Riquadri `ad-note`: 1.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso.
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I tre programmi senza prove sono stati eseguiti con `python3` e compilati con `clang++ -Wall` (nessun avviso). Le
  uscite coincidono tranne dove la lezione lo dice: con i voti 6 e 8 Python scrive `7.0` e il C++ `7`.
- Provato davvero: con `int somma` e i voti 7 e 8 il C++ scrive 7; senza la selezione finale e senza dati Python dà
  `ZeroDivisionError: division by zero` e il C++ con `double somma` scrive `nan` (anche con il Clang del sito). La
  divisione tra due `int` per zero nel Clang del sito ferma il programma con "Errore durante l'esecuzione: divisione
  intera per zero"; sul Mac, compilata con `clang++`, scrive 0 e prosegue.
- Il diagramma è stato eseguito con la libreria del sito: scrive −1 in 20 passi; il codice generato ha gli stessi
  nomi e lo stesso ordine del programma, con il `while` al posto del `for`.
- La pagina di anteprima risponde (HTTP 200) e contiene il disegno; non è stata aperta in un browser, quindi il
  diagramma non è stato eseguito a mano con "Passo".

## Scelte che il README non fissava

- Il valore di partenza di massimo e minimo è sempre il primo dato. Il "numero molto grande" o "molto piccolo" come
  partenza (per esempio -9999) non è presentato.
- "Valore di fine" è il nome del dato che chiude la sequenza; la 60 lo chiama "segnale di fine" e non usa
  "sentinella" (c'è una domanda aperta nella sua nota). Se Andrea sceglie un nome, va cambiato in tutte e due.
- Con la lunghezza nota e il primo dato letto prima del ciclo, il `for` parte da 2 e il programma chiede $n$ almeno
  1. Il caso $n = 0$ per il massimo non è trattato; per la media compare nel secondo esercizio.
- In C++ la media si ottiene dichiarando la somma `double`. Non ci sono il cast (`(double) somma`) né `* 1.0`. La 53
  usa `2.0` per lo stesso scopo, ma qui il divisore è una variabile.
- Le prove del secondo esercizio hanno solo medie con uno o due decimali (7.5, 7.25): una media intera si scrive
  `7.0` in Python e `7` in C++, e una con i decimali periodici ha più cifre in Python (7.333333333333333) che in C++
  (7.33333). Con questi dati le uscite dei due linguaggi sono uguali; un generatore di esercizi dovrà fare lo stesso.
  L'arrotondamento della media a due decimali non c'è.
- Il programma con il valore di fine cerca solo il minimo, e il massimo è lasciato come modifica: con tutti e due la
  lezione superava le 350 righe. Per lo stesso motivo la tabella di confronto tra lunghezza nota e valore di fine è
  solo nel formulario; nella lezione il confronto è nel testo.
- I vettori sono nominati una volta, in fondo, come lo strumento del terzo anno per conservare i dati, senza link
  (il brief permette i link solo alle lezioni 1-64).
- La posizione del massimo (in quale giro è arrivato) e il caso di più massimi uguali non ci sono.

## Da verificare

- La frase "con una divisione tra interi si ferma con un errore" descrive l'editor del sito. Su un computer vero la
  divisione intera per zero in C++ ha un comportamento non definito: di solito il programma si interrompe, ma su
  alcune macchine (provato su un Mac con processore ARM) scrive 0 e va avanti.
- `nan` è quello che scrive il Clang del sito e quello del Mac; altri compilatori possono scrivere `-nan`.

## Domande per Andrea

- Per massimo e minimo parti dal primo dato, come qui, o in classe usi anche un valore di partenza "impossibile"?
- Il dato che chiude la sequenza: "valore di fine", "sentinella", "tappo"? (La stessa domanda è nella nota della 60.)
- In C++ per la media preferisci la somma dichiarata `double`, il cast `(double) somma / quanti` o `somma * 1.0`?
- La media va stampata arrotondata a due decimali? In quel caso serve uno strumento in più nei due linguaggi.
