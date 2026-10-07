# Note: Grafica bitmap e grafica vettoriale

Lezione nuova (terzo anno, capitolo "Immagini, suoni e video digitali", gruppo 8, 7 ottobre 2026). `check.mts` passa
senza errori e senza avvisi su lezione, formulario e flashcard; `verifica.mts`: 1 esercizio con le prove, 0 errori, e
due pagine i cui controlli sono stati provati nel browser con la soluzione.

## Confini

- Con la 11: pixel, risoluzione come numero di pixel, profondità di colore e peso non compresso sono lì. La 11 ha
  già un cenno a raster e vettoriale con una figura statica, e una nota sui dpi: qui diventano l'argomento.
- Con la 82: i formati delle due famiglie stanno là, e qui c'è solo una riga della tabella con il link.
- Con la 84: "cambiare formato con perdita" è una riga della tabella delle operazioni, senza spiegare come.
- Con la 88 e seguenti: la pagina con l'SVG è fatta del solo elemento `svg`, senza `html`, `head` e `body`, e il
  testo dice che il linguaggio delle pagine arriva dopo. La 11 fa lo stesso con un `div`.
- Il capitolo dell'albero ha sotto questa lezione la voce `editing-base`: le operazioni di base (ritagliare,
  ridimensionare, cambiare formato) sono l'ultima sezione.

## Scelte

- "Bitmap" nel testo, con "raster" tra parentesi una volta (la 11 fa il contrario: "raster (o bitmap)").
- "Densità di stampa" in dpi, e "risoluzione" lasciata al numero di pixel come nella 11. La differenza tra dpi e ppi
  non è nominata.
- Le misure della stampa sono in pollici, con il passaggio ai centimetri negli esempi.
- "Rasterizzazione" è definita; "interpolazione" e "vettorializzare" no (si dice che cosa succede, senza il nome).
- In SVG: `rect`, `circle`, `polygon`, `fill`, `viewBox`, `width`. Niente `path`, `stroke`, `text`, `xmlns`.
- Il disegno della figura e quello della pagina SVG sono lo stesso (sole e due montagne, griglia di 96), così lo
  studente ritrova nel codice le tre forme che ha ingrandito.
- La lezione è lunga 249 righe, di cui 114 nei blocchi `codice` (la pagina SVG e i tre esercizi); il testo da
  leggere è di circa 135 righe.

## Elementi interattivi

- `inf-bitmap-vettoriale-zoom` (figura nuova): "che cosa succede ingrandendo la stessa figura salvata come bitmap e
  come disegno vettoriale?". Un cursore da 1 a 24. La bitmap è campionata dalle stesse tre forme, con i bordi
  sfumati come li farebbe un programma che esporta. Guardata in chiaro e in scuro, a 800 e a 390 px, a 1, 3, 8 e 24.
- Pagina `codice html` con l'SVG da modificare: "che cosa c'è scritto in un file vettoriale?". Eseguita nel
  browser.
- `inf-pixel-risoluzione-profondita` (figura del kit, già registrata): "che cosa si perde togliendo pixel?". Usata
  così com'è, con l'indicazione di mettere 8 bit e passare da 64 a 16 pixel per lato. Il testo dice che la figura
  sa tornare a 64 perché ha il disegno di partenza, mentre un programma di ritocco no.
- Tre esercizi: due pagine SVG con `%% controllo`, un programma con le prove.

## Da verificare

- "Per un foglio che si guarda da vicino si usano circa 300 dpi": valore tipico della stampa, usato come esempio.
- "Su uno schermo ogni pixel dell'immagine occupa di solito un pixel dello schermo": sugli schermi ad alta densità
  il sistema ne usa più di uno per pixel dell'immagine. Il testo dice "di solito" e non entra nel merito.
- Il peso del file vettoriale della figura (266 byte) è la lunghezza del testo SVG che la figura stessa compone; la
  lezione dice "meno di 300 byte".
- "Con 400 pixel su 4 pollici [...] ogni pixel è largo un quarto di millimetro": $25{,}4 : 100 = 0{,}254$ mm.

## Domande per Andrea

- Pollici e dpi: i libri in uso fanno questi conti in pollici o in centimetri?
- SVG in una lezione prima dell'HTML: va bene la pagina fatta del solo `svg`?
- Serve nominare dpi e ppi come due cose diverse?
- Le operazioni di base bastano in forma di tabella, o serve una lezione sua (la voce `editing-base` dell'albero)?

Prerequisiti proposti: inf-codifica-immagini, formati-multimediali

## Revisione del lotto (7 ottobre 2026)

- Aggiunto `return 0;` ai `main` in C++.
