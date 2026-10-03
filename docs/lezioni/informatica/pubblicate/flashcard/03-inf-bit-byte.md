# Flashcard: Bit, byte e unità di misura

## byte-definizione
Che cos'è un byte?
---
Un gruppo di 8 bit. Il suo simbolo è B, maiuscola.

## byte-in-bit
Quanti bit sono $5\,\text{B}$?
---
$40\,\text{bit}$: $5 \cdot 8 = 40$.

## bit-in-byte
Quanti byte sono $72\,\text{bit}$?
---
$9\,\text{B}$: $72 : 8 = 9$.

## mb-mbit
Vero o falso: $100\,\text{MB}$ e $100\,\text{Mbit}$ sono la stessa quantità.
---
Falso. La B maiuscola è il byte: $100\,\text{MB}$ sono otto volte $100\,\text{Mbit}$.

## valori-un-byte
Quanti valori diversi si rappresentano con 1 byte?
---
$2^8 = 256$.

## valori-due-byte
Quanti valori diversi si rappresentano con 2 byte?
---
$2^{16} = 65\,536$, cioè $256 \cdot 256$, non $512$.

## massimo-un-byte
Qual è il numero più grande che sta in 1 byte, contando da 0?
---
$255$, cioè $2^8 - 1$: i valori sono 256 e uno è lo zero.

## kb-definizione
Quanti byte sono $1\,\text{kB}$?
---
$1000\,\text{B}$: è un multiplo decimale, con il prefisso del Sistema Internazionale.

## kib-definizione
Quanti byte sono $1\,\text{KiB}$?
---
$1024\,\text{B}$, cioè $2^{10}\,\text{B}$: è un multiplo binario.

## ordine-multipli
Metti in ordine dal più piccolo al più grande: GB, kB, TB, MB.
---
kB, MB, GB, TB: ognuno vale 1000 volte il precedente.

## gb-in-byte
Quanti byte sono $1\,\text{GB}$?
---
$10^9\,\text{B}$, un miliardo di byte.

## gib-o-gb
È più grande $1\,\text{GiB}$ o $1\,\text{GB}$?
---
$1\,\text{GiB}$: vale $2^{30}\,\text{B}$, circa il $7\%$ in più di $10^9\,\text{B}$.

## moltiplicare-o-dividere
Per passare da MB a GB si moltiplica o si divide per 1000?
---
Si divide: il GB è l'unità più grande, quindi il numero diventa più piccolo.

## mb-in-kb
Quanti kB sono $3{,}5\,\text{MB}$?
---
$3500\,\text{kB}$: $3{,}5 \cdot 1000$.

## gib-in-mib
Quanti MiB sono $2\,\text{GiB}$?
---
$2048\,\text{MiB}$: $2 \cdot 1024$.

## velocita-unita
In che unità si misura la velocità di trasmissione?
---
In bit al secondo, $\text{bit/s}$, con i multipli decimali $\text{kbit/s}$, $\text{Mbit/s}$ e $\text{Gbit/s}$.

## tempo-formula
Come si calcola il tempo per trasferire una quantità di dati $D$ alla velocità $v$?
---
$t = \dfrac{D}{v}$, con $D$ in bit come la velocità.

## tempo-foto
Quanto tempo serve per scaricare $6\,\text{MB}$ a $16\,\text{Mbit/s}$?
---
$3\,\text{s}$: $6 \cdot 8 = 48\,\text{Mbit}$, e $48 : 16 = 3$.

## mbit-in-mb-al-secondo
Quanti MB al secondo scarica una connessione da $100\,\text{Mbit/s}$?
---
$12{,}5\,\text{MB}$ al secondo: $100 : 8$.

## disco-500
Perché un disco da $500\,\text{GB}$ compare sul computer con un numero vicino a 465?
---
Perché il computer conta in GiB: i byte sono gli stessi, ma ogni GiB ne contiene $2^{30}$ e non $10^9$.
