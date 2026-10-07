# Flashcard: La compressione dei dati, con e senza perdita

## compressione
Che cos'è la compressione?
---
Un procedimento che riscrive dei dati con meno bit.

## ridondanza
Quando un dato è ridondante?
---
Quando una sua parte si può ricavare dal resto, come un pixel azzurro dopo molti pixel azzurri.

## senza-perdita
Che cosa si riottiene decomprimendo un file compresso senza perdita?
---
I dati di partenza esatti, bit per bit.

## con-perdita
Che cosa butta via una compressione con perdita?
---
Le informazioni che occhio e orecchio percepiscono meno, e non si possono più recuperare.

## testo-con-perdita
Vero o falso: un programma si può comprimere con perdita, se la perdita è piccola.
---
Falso. Un solo carattere diverso lo cambia: testi, programmi e dati si comprimono senza perdita.

## rle-codifica
Qual è la codifica RLE di `AAAABBBAA`?
---
`4A3B2A`.

## rle-decodifica
Quale riga corrisponde alla codifica RLE `2N5B1R`?
---
`NNBBBBBR`.

## rle-byte
Una riga di $16$ pixel ha $5$ sequenze. Quanti byte occupa la codifica RLE, con due byte per sequenza?
---
$5 \cdot 2 = 10$ byte, contro i $16$ della riga.

## rle-peggiora
Qual è la codifica RLE di `BNBN`? È più corta della riga?
---
`1B1N1B1N`: è lunga il doppio. Senza sequenze lunghe RLE allunga i dati.

## rapporto
Come si calcola il rapporto di compressione?
---
Dimensione originale diviso dimensione compressa.

## rapporto-conto
Un file da $20\,\text{MB}$ compresso ne occupa $4$. Qual è il rapporto di compressione?
---
$20 : 4 = 5$, cioè $5 : 1$.

## rapporto-inverso
Un video da $600\,\text{MB}$ è compresso con rapporto $20 : 1$. Quanto occupa?
---
$600 : 20 = 30\,\text{MB}$.

## rapporto-percentuale
Con un rapporto $4 : 1$, quale percentuale dell'originale occupa il file compresso?
---
Il $25\%$: un quarto, non il $4\%$.

## dizionario
Qual è l'idea della compressione con il dizionario?
---
I pezzi che si ripetono ricevono un numero, e nel testo si scrive il numero al posto del pezzo.

## codici-diversi
Con i codici di lunghezza diversa, quale valore riceve il codice più corto?
---
Il più frequente.

## codici-decodifica
Con i codici B = `0`, N = `10`, R = `110`, quali colori sono `10010`?
---
N, B, N: i bit si dividono in `10`, `0`, `10`.

## zip-di-jpeg
Metti cento foto JPEG in un archivio ZIP. L'archivio è molto più piccolo delle foto?
---
No. Le foto sono già compresse: non c'è più ridondanza da togliere.

## salvare-piu-volte
Apri una foto JPEG, la ritocchi e la salvi, per dieci volte. Che cosa succede alla qualità?
---
Peggiora a ogni salvataggio: la compressione con perdita butta via ogni volta qualcosa.

## qualita-bassa
In un'immagine compressa con perdita a qualità molto bassa, che cosa si vede?
---
Blocchi quadrati nelle zone sfumate e aloni attorno ai bordi netti.
