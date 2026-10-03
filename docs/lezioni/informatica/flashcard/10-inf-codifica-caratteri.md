# Flashcard: La codifica dei caratteri: ASCII e Unicode

## codice-dei-caratteri
Che cos'è un codice dei caratteri?
---
Una tabella che fa corrispondere a ogni carattere un numero, così che un testo si possa memorizzare con i bit.

## ascii-bit
Quanti bit usa il codice ASCII, e quanti caratteri contiene?
---
7 bit, quindi $2^7 = 128$ caratteri, con i codici da $0$ a $127$.

## ascii-a-maiuscola
Qual è il codice ASCII della A maiuscola?
---
$65$.

## ascii-a-minuscola
Qual è il codice ASCII della a minuscola?
---
$97$.

## ascii-cifra-zero
Qual è il codice ASCII della cifra 0?
---
$48$. Le altre cifre seguono: la cifra 1 è $49$, la cifra 9 è $57$.

## ascii-spazio
Vero o falso: in un testo lo spazio non occupa memoria.
---
Falso. Lo spazio è un carattere, con codice ASCII $32$.

## ascii-contare
La A maiuscola ha codice $65$. Qual è il codice della D maiuscola?
---
$68$. La D è tre posti dopo la A, e le lettere hanno codici consecutivi.

## ascii-cifra-sette
Qual è il codice ASCII del carattere 7?
---
$55$, cioè $48 + 7$. Il codice $7$ è un carattere di controllo.

## maiuscole-minuscole-differenza
Di quanto differiscono i codici ASCII di una lettera minuscola e della sua maiuscola?
---
Di $32$: la minuscola ha il codice più grande.

## maiuscole-minuscole-conto
La M maiuscola ha codice $77$. Qual è il codice della m minuscola?
---
$109$, cioè $77 + 32$.

## maiuscole-minuscole-bit
Quanti bit cambiano tra il codice di una maiuscola e quello della sua minuscola?
---
Uno solo, quello di peso $32$.

## ordinamento
Ordinando le parole solo sui codici ASCII, viene prima "Zebra" o "ape"?
---
"Zebra": tutte le maiuscole ($65$-$90$) hanno codici più piccoli delle minuscole ($97$-$122$).

## estensioni-otto-bit
Che cosa cambia tra due estensioni dell'ASCII a 8 bit?
---
I caratteri con i codici da $128$ a $255$. I primi $128$ sono uguali, quelli dell'ASCII.

## unicode-definizione
Che cos'è Unicode?
---
Una tabella unica che dà un numero, il punto di codice, a ogni carattere di tutte le scritture.

## unicode-ascii
Vero o falso: in Unicode la A maiuscola ha un numero diverso da quello dell'ASCII.
---
Falso. I primi $128$ punti di codice di Unicode sono quelli dell'ASCII: la A è $65$, cioè U+0041.

## utf8-definizione
Che cosa fa UTF-8?
---
Scrive ogni punto di codice Unicode con un numero variabile di byte, da 1 a 4.

## utf8-ascii
Quanti byte occupa in UTF-8 un carattere ASCII?
---
Uno, lo stesso byte che avrebbe in ASCII.

## utf8-accentata
Quanti byte occupa in UTF-8 una lettera accentata come è?
---
2 byte.

## utf8-piu
Quanti byte occupa in UTF-8 la parola "più"?
---
4 byte: uno per la p, uno per la i, due per la ù.

## testo-ascii-byte
Quanti byte occupa in ASCII il messaggio "Va bene"?
---
7 byte: sei lettere e uno spazio.
