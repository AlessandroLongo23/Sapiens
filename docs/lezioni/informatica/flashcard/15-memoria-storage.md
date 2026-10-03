# Flashcard: Memoria centrale e memorie di massa

## cella-indirizzo
Che cos'è l'indirizzo di una cella di memoria?
---
Il numero che la distingue dalle altre celle. La prima cella ha indirizzo $0$.

## ultimo-indirizzo
Una memoria ha $256$ celle. Qual è l'indirizzo dell'ultima?
---
$255$. Gli indirizzi partono da $0$, quindi l'ultimo è uno in meno del numero di celle.

## quante-celle
Gli indirizzi di una memoria vanno da $0$ a $1023$. Quante celle ha?
---
$1024$: anche lo $0$ è un indirizzo.

## capacita-kib
Quanti KiB sono $2048$ byte?
---
$2\,\text{KiB}$, perché $1\,\text{KiB} = 1024\,\text{B}$.

## ram-sigla
Che cosa vuol dire RAM, e che cosa significa "accesso casuale"?
---
Random Access Memory. Vuol dire che si può raggiungere direttamente una cella qualsiasi, senza scorrere le altre.

## volatile
Che cosa vuol dire che una memoria è volatile?
---
Che conserva il contenuto solo finché riceve corrente.

## ram-volatile
Vero o falso: quando spegni il computer, il contenuto della RAM resta dov'è.
---
Falso. La RAM è volatile: senza corrente perde tutto.

## rom
Che cosa contiene la ROM, e perché non può essere volatile?
---
Il programma che fa partire il computer. Deve esserci anche dopo lo spegnimento, quando la RAM è vuota.

## non-salvato
Scrivi un tema e va via la corrente prima che tu lo salvi. Dove si trovava il testo?
---
Solo nella RAM: per questo è perso.

## salvare
Che cosa succede ai dati quando salvi un documento?
---
Vengono copiati dalla RAM a una memoria di massa, che li conserva anche senza corrente.

## memoria-di-massa
Che cosa conserva una memoria di massa?
---
I file, i programmi installati e il sistema operativo, per lungo tempo e anche a computer spento.

## telefono-128
Un telefono ha "una memoria da $128\,\text{GB}$". È la RAM?
---
No, è la memoria di massa, dove restano foto e app. La RAM è un'altra memoria, molto più piccola.

## disco-magnetico
Perché un disco magnetico è più lento di una memoria a stato solido?
---
Perché ha parti in movimento: dischi che ruotano e una testina che si sposta.

## stato-solido
Quali sono un vantaggio e uno svantaggio di un SSD rispetto a un disco magnetico?
---
È molto più veloce, ma costa di più per ogni byte.

## cache
Che cos'è la cache?
---
Una memoria piccola e molto veloce accanto alla CPU, che tiene una copia dei dati e delle istruzioni usati più di recente.

## cache-perche
Perché la cache fa risparmiare tempo?
---
Perché i programmi tornano spesso sugli stessi dati: se sono nella cache, la CPU non deve aspettare la RAM.

## gerarchia-ordine
Metti in ordine dalla più veloce alla più lenta: RAM, cache, disco magnetico, registri.
---
Registri, cache, RAM, disco magnetico.

## gerarchia-scendendo
Scendendo nella gerarchia delle memorie, che cosa succede a velocità, capacità e costo per byte?
---
La velocità diminuisce, la capacità aumenta, il costo per byte diminuisce.

## quanti-file
Quante foto da $4\,\text{MB}$ stanno in $1\,\text{GB}$, se $1\,\text{GB} = 1000\,\text{MB}$?
---
$250$, cioè $1000 : 4$.
