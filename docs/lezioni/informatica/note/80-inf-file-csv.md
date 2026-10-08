# Note: File di dati in formato CSV

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "I file", gruppo 7). Non pubblicata.

Prerequisiti proposti: inf-file-testo, inf-vettori, inf-stringhe, inf-analisi-dati

## Struttura

Apertura con i dati che passano dal foglio di calcolo a un programma; il formato (campo, separatore, riga di
intestazione) con una figura TikZ; che cosa resta di un foglio salvato in CSV; dividere una riga nei campi (figura
interattiva e programma); calcolare su una colonna (media, e la media di un solo studente come modifica); scrivere
un file CSV (dal torneo alla classifica); il campo che contiene il separatore e il modulo `csv`; due esercizi.

- 386 righe in tutto, di cui circa 55 di testo da leggere.
- Programmi da eseguire: 3, ciascuno in Python e in C++, con `voti.csv` e `torneo.csv` accanto.
- Esercizi: 2. Il primo legge `spese.csv` e stampa due numeri; il secondo legge `verifiche.csv` e scrive
  `ammessi.csv`, controllato con `%% file` su due soglie.
- Figure TikZ: 1 (`struttura-file-csv`). Figure interattive: 1 (`inf-csv-campi`).
- Riquadri `ad-warning`: 2. Riquadri `ad-note`: 2.

## Confini con le altre lezioni del gruppo

- Aprire, chiudere, convertire e i modi di apertura sono della 79 e qui si usano senza rispiegarli.
- La 81 riparte da quello che una tabella non sa dire (una lista dentro un record): qui i dati sono sempre una
  tabella.

## Scelte

- "Record" è usato una volta, nella figura TikZ ("un record per riga"), perché è la parola della lezione 28 sulla
  tabella di dati, a cui la lezione rimanda. Nel testo si dice "riga".
- I campi si contano da 0 ("il campo 0 è il nome"), come gli indici della lista che `split` restituisce.
- In Python `riga.strip().split(",")`; in C++ `getline(file, campo, ',')` per ogni campo e `getline(file, campo)`
  per l'ultimo, una variabile per campo, senza `stringstream`. La differenza (una lista contro tre variabili) sta
  nel riquadro.
- L'intestazione si salta con `file.readline()` e con un `getline` prima del ciclo.
- La media è calcolata su voti scelti perché Python e C++ scrivano lo stesso numero (6.8, e 8.5 per Anna).
- Il separatore italiano: la lezione dice che "i programmi in italiano salvano spesso" con il punto e virgola, e
  spiega il perché con la virgola decimale, senza nominare prodotti.
- Le virgolette intorno a un campo che contiene il separatore sono dette in un riquadro, e il modulo `csv` è solo
  nominato, come chiede il brief.
- La figura interattiva ha due file: `voti.csv` (quello della lezione) e `medie.csv`, con il punto e virgola e i
  numeri con la virgola, che serve solo lì.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard).
- `verifica.mts`: 2 esercizi, 0 errori, nei due linguaggi.
- I tre programmi di esempio eseguiti con il Pyodide e il Clang del sito e poi nel browser, nei due linguaggi, a
  1280 e a 390 px: stesse uscite, `classifica.csv` creato e mostrato tra le linguette. I due esercizi: il programma
  di partenza non supera le prove, la soluzione le supera tutte.
- La figura TikZ guardata in chiaro e in scuro (435 px di larghezza).
- La traccia della figura interattiva ha i suoi test (`tests/unit/informatica-file.test.mjs`).

## Elementi interattivi

- Programmi con il file CSV accanto (3 esempi e 2 esercizi): lo studente cambia il file, toglie il salto
  dell'intestazione, cambia il separatore.
- `inf-csv-campi` (figura a passi): "dove taglia il programma una riga, e che cosa succede se il separatore non è
  quello del file?". Due scelte (il file, il carattere a cui tagliare), i campi numerati da 0, la tabella che si
  riempie; con il separatore sbagliato la riga resta in un campo, e la virgola di `8,5` taglia un numero in due.
  Guardata in chiaro e in scuro, a 800 e a 390 px, in tutte e quattro le combinazioni, e dentro la lezione.

## Da verificare

- CSV non ha uno standard unico: la descrizione più citata è la RFC 4180 (Y. Shafranovich, ottobre 2005), che
  prevede la virgola, la riga di intestazione facoltativa e le virgolette doppie intorno ai campi che contengono
  virgole o a capo. La lezione non la nomina.
- Il punto e virgola nelle versioni italiane dei fogli di calcolo: il separatore viene dalle impostazioni
  internazionali del sistema (separatore di elenco), che con la virgola decimale è il punto e virgola. Da
  controllare sulla documentazione dei programmi prima di pubblicare, se si vuole una frase più precisa.
- Provato con il Pyodide e il Clang del sito: con il separatore sbagliato Python si ferma con `IndexError` e il
  C++ stampa tutto il file seguito da " ha preso "; senza il salto dell'intestazione, nel programma della media,
  Python si ferma con `ValueError` e il C++ con "stoi: no conversion" e l'interruzione del programma.

## Domande per Andrea

- In C++ va bene leggere i campi con `getline` e il separatore, una variabile per campo, oppure preferisci
  leggere la riga intera e dividerla con `stringstream`?
- I campi contati da 0 vanno bene anche a parole ("il campo 0"), o nel testo preferisci "il primo campo"?
- Il modulo `csv` di Python va solo nominato, come qui, o vuoi un esempio con `csv.reader`?
- Nei file della lezione il separatore è la virgola e il punto e virgola compare solo nella figura e nel riquadro:
  preferisci il contrario, visto che i file esportati a scuola hanno quasi sempre il punto e virgola?
- La scrittura con il formato allineato (`f"{nome},{punti}"`) serve, o resta la concatenazione con `+` e `str`?

## Revisione del lotto (7 ottobre 2026)

- "Record" compariva solo nella figura e in una flashcard, senza definizione: sostituito con "un voto per riga".
