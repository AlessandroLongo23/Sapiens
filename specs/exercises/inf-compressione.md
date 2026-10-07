# La compressione dei dati, con e senza perdita

Generatore: `inf-compressione` (`src/lib/exercises/v2/generators/inf-compressione.ts`, con gli aiuti di
`inf-programmi.ts` e di `inf-sic.ts`). Verifica indipendente: `scripts/exercises/checkers/inf_compressione.py`.
Lezione collegata: `docs/lezioni/informatica/riscritte/84-inf-compressione.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni di testo. I livelli 2, 3, 4 e 5 sono sui conti della
lezione: RLE a mano, i byte della codifica, il rapporto di compressione, i bit con i codici di lunghezza diversa.

## Nomi dei livelli

1. Che compressione è
2. RLE a mano
3. Quanti byte, e conviene?
4. Il rapporto di compressione
5. Codici di lunghezza diversa
6. Comprimere due volte

## Livello 1: che compressione è

Sedici scene con un nome estratto, quattro per risposta. Opzioni fisse: Una compressione senza perdita; Una
compressione con perdita; Una decompressione; Nessuna compressione (i dati scritti così come sono, un file
rinominato, una copia).

## Livello 2: RLE a mano

Una riga con le lettere B, N, R, V: da 3 a 5 sequenze lunghe da 1 a 6, al massimo 18 pixel, con lunghezze non tutte
uguali. Il numero sta prima della lettera, come nella lezione.

- codifica (metà): "Una riga di pixel è scritta con le lettere dei colori: BBBNNNNNRRRBBRR. Qual è la sua codifica
  RLE, con il numero prima della lettera?" Risposta: 3B5N3R2B2R. Sbagliate: la lettera prima del numero; l'ultima
  sequenza dimenticata; i pixel di ogni colore contati tutti insieme (5B5N5R); un conteggio sbagliato di uno.
- decodifica (metà): "La codifica RLE di una riga di pixel è 4B6V4B3V. Qual è la riga?" Sbagliate: i numeri dati
  alla lettera sbagliata; l'ultima coppia dimenticata; solo le lettere; una lettera in più.

## Livello 3: quanti byte, e conviene?

Una riga da 8 a 20 pixel con 2-9 sequenze, mai esattamente due pixel per sequenza. Il modello è scritto nel testo:
un byte per pixel, due byte per sequenza.

- byte (metà): "Quanti byte occupa la codifica RLE della riga?" Risposta: il doppio delle sequenze. Sbagliate: il
  numero delle sequenze, i pixel della riga, il doppio dei pixel.
- conviene, non conviene (metà): "Conviene codificare questa riga con RLE?" Risposta con i due numeri: "Sì: la
  codifica occupa 6 byte, la riga 16". Sbagliate: la conclusione opposta con gli stessi numeri; "una compressione
  senza perdita accorcia sempre i dati"; un byte per sequenza.

## Livello 4: il rapporto di compressione

Costruito all'indietro da rapporto e dimensione compressa, numeri interi, in kB, MB o GB.

- rapporto (4 su 10): le due dimensioni, e il rapporto $r : 1$. Sbagliate: la dimensione compressa, la differenza,
  il prodotto.
- compressa (35 su 100): dimensione originale e rapporto, e la dimensione compressa. Sbagliate: il prodotto, la
  differenza, il rapporto.
- percentuale, risparmio (25 su 100): con rapporto $2, 4, 5, 10, 20, 25, 50 : 1$, quale percentuale dell'originale
  occupa il file compresso, o quale percentuale si risparmia. Sbagliate: il rapporto letto come percentuale ($4 : 1$
  come il 4%), la percentuale complementare.

## Livello 5: codici di lunghezza diversa

I codici 0, 10, 110, 111 dati ai quattro colori in ordine estratto, scritti nel testo.

- bit (55 su 100): "Una riga di 22 pixel ha 13 pixel N, 5 pixel V, 2 pixel B, 2 pixel R. [...] Quanti bit occupa
  la riga?" Il colore più frequente, da solo al primo posto, ha il codice più corto. Sbagliate: 2 bit per pixel, un
  bit per pixel, 3 bit per pixel.
- leggi (45 su 100): una sequenza di bit di 3-5 pixel da dividere nei codici. Sbagliate: i bit letti a due a due,
  come con un codice fisso; l'ordine rovesciato; un pixel in meno.

## Livello 6: comprimere due volte

Affermazioni vere e false, otto e nove: comprimere due volte senza perdita, i salvataggi ripetuti con perdita, il
testo con perdita, il rapporto letto come percentuale, RLE che accorcia tutto, la conversione che "restituisce" la
qualità. Una vera tra tre false, o una falsa tra tre vere.

## Esercizi da evitare

- Sequenze più lunghe di 9, che in una codifica scritta come testo renderebbero ambigue le cifre.
- Righe con esattamente due pixel per sequenza nel livello 3: la codifica peserebbe quanto la riga.
- Rapporti che non danno numeri interi.

## Verifica

`inf_compressione.py` conta le sequenze della riga per conto suo e ne scrive la codifica (o decodifica il codice
del testo), ricalcola byte, rapporto e percentuali dai numeri del testo, legge i codici dal testo, controlla che
nessuno sia l'inizio di un altro e divide i bit. Scene e affermazioni hanno le loro tabelle.

## Domande per la revisione

- Il rapporto di compressione è originale diviso compresso, scritto $r : 1$. Alcuni libri usano il rapporto
  inverso o solo la percentuale: va bene così?
- Nella codifica il numero sta prima della lettera (6B). Va bene, o i libri in uso scrivono B6?
