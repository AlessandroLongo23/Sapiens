# Note: Le funzioni del foglio di calcolo

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Il foglio di calcolo", prima metà, 3 ottobre
2026). `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard.

## Struttura ed esempi

Che cos'è una funzione: nome, parentesi, argomenti separati dal punto e virgola, con la figura delle parti di
`=SOMMA(B2:B6;10)`; i nomi in italiano e, una volta, quelli in inglese; la tabella di `SOMMA`, `MEDIA`, `MIN`, `MAX`,
`CONTA.NUMERI`, `ARROTONDA`; il procedimento in tre passi per il valore di una funzione su un intervallo; celle
vuote e testi; più argomenti e intervalli rettangolari; `ARROTONDA`; le funzioni annidate.

Sette esempi svolti: somma e media di cinque misure del periodo di un pendolo; minimo, massimo, conteggio e la
differenza `MAX - MIN`; la media con un assente; un rettangolo e due intervalli (spese di due mesi); lo stesso numero
arrotondato a 1, 2 e 0 cifre; la media arrotondata; `SOMMA / CONTA.NUMERI` uguale a `MEDIA`.

Avvisi: i due punti non sono il punto e virgola; una cella vuota non è uno zero; arrotondare non è tagliare; il nome
va scritto giusto.

`SE`, `CONTA.SE`, `SOMMA.SE` e le funzioni logiche non sono trattate: c'è il link alla lezione 26. In fondo c'è anche
il link alla lezione 28 per i riepiloghi.

## Conti

Rifatti con il valutatore del controllo Python (`scripts/exercises/checkers/_inf_foglio.py`): somma 7,06, media
1,412, minimo 1,38, massimo 1,45, differenza 0,07, `SOMMA(B2;B6)` = 2,83; voti con un assente: somma 30,5, media
7,625, con lo zero 6,1; spese: 107, 60 e 47, massimo 30; 7,625 arrotondato a 1, 2, 0 cifre: 7,6, 7,63, 8; 7,68 a una
cifra: 7,7; media arrotondata 1,41.

## Scelte

- Le cinque misure del pendolo (1,42 1,38 1,45 1,40 1,41 s) sono inventate, vicine a quelle della lezione di fisica
  sul metodo sperimentale.
- "ARROTONDA e simili" del brief: sono rimaste fuori `ARROTONDA.PER.DIF` e `ARROTONDA.PER.ECC`, perché in italiano
  hanno nomi diversi nei programmi (in LibreOffice, a quanto ricordo, `ARROTONDA.DIFETTO` e `ARROTONDA.ECCESSO`), e
  `CONTA.VALORI`, `RADQ`, `OGGI`, per non allungare. La lezione nomina solo le sei funzioni della tabella.
- L'arrotondamento è quello dei programmi: il 5 va per eccesso (7,625 a due cifre dà 7,63). I numeri degli esempi
  sono decimali esatti, così il risultato non dipende da come il programma conserva il numero in binario.
- Le cifre negative di `ARROTONDA` (arrotondare alle decine) non ci sono.

## Da verificare

- I nomi italiani `SOMMA`, `MEDIA`, `MIN`, `MAX`, `CONTA.NUMERI`, `ARROTONDA` valgono in Excel, LibreOffice Calc e
  Fogli Google in italiano (sono quelli del README; ricordati, non controllati su un programma installato).
- In un programma in inglese gli argomenti si separano con la virgola: vero con le impostazioni inglesi o americane;
  il separatore dipende in realtà dalle impostazioni regionali, non dalla lingua dei menu. La nota lo dice in modo
  semplificato.
- "I nomi si possono scrivere in minuscolo: il foglio li riporta in maiuscolo": da controllare su Fogli Google.
- `MIN` e `MAX` su un intervallo senza numeri danno 0 nei programmi: nella lezione non è detto; gli esercizi non lo
  chiedono mai (c'è sempre almeno un numero).

## Domande per Andrea

- Aggiungere `CONTA.VALORI` (conta le celle non vuote) accanto a `CONTA.NUMERI`?
- Le misure del pendolo come esempio principale: va bene, o meglio i voti, che sono l'esempio della lezione 26?
- La nota sul formato che "mostra meno cifre" parla di un comando che la lezione non spiega: tenerla?
