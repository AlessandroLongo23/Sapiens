# Flashcard: La gestione della memoria

## assegnazione
Che cosa succede alla memoria di un processo quando il processo termina?
---
Torna libera: il sistema operativo la può assegnare ad altri processi.

## protezione
Che cos'è la protezione della memoria?
---
La regola per cui un processo può leggere e scrivere solo nella memoria che gli è stata assegnata.

## memoria-virtuale
Che cos'è la memoria virtuale?
---
La tecnica per cui ogni processo vede una memoria tutta sua, numerata da zero, mentre il sistema decide dove stanno davvero i dati.

## pagina
Che cos'è una pagina?
---
Uno dei blocchi di dimensione fissa in cui è divisa la memoria di un processo.

## frame
Che cos'è un frame?
---
Uno dei blocchi in cui è divisa la RAM, grande quanto una pagina.

## pagine-vicine
Vero o falso: le pagine di un processo devono stare in frame vicini.
---
Falso. Una pagina può stare in qualunque frame libero.

## tabella-pagine
Che cosa dice la tabella delle pagine?
---
Per ogni pagina di un processo, in quale frame si trova, oppure che è fuori dalla RAM.

## pagine-esatte
Un processo chiede $32\,\text{KiB}$ e le pagine sono di $4\,\text{KiB}$. Quante pagine servono?
---
$32 : 4 = 8$ pagine.

## pagine-eccesso
Un processo chiede $33\,\text{KiB}$ e le pagine sono di $4\,\text{KiB}$. Quante pagine servono?
---
$9$: otto pagine contengono $32\,\text{KiB}$, e per il kibibyte che resta serve una pagina intera.

## arrotondamento
Il numero di pagine si arrotonda per eccesso o per difetto?
---
Sempre per eccesso: non esistono mezze pagine.

## mebibyte
Quanti kibibyte sono $2\,\text{MiB}$?
---
$2 \cdot 1024 = 2048\,\text{KiB}$.

## inutilizzato
Un processo chiede $10\,\text{KiB}$ con pagine da $4\,\text{KiB}$. Quanti kibibyte restano inutilizzati?
---
$2\,\text{KiB}$: servono $3$ pagine, cioè $12\,\text{KiB}$.

## swap
Che cos'è l'area di swap?
---
La zona della memoria di massa in cui il sistema mette le pagine tolte dalla RAM.

## page-fault
Che cos'è un page fault?
---
L'evento che avviene quando un processo usa una pagina che non è nella RAM: il sistema la ricopia in un frame.

## swap-conto
La RAM ha $10$ frame liberi e i processi chiedono $13$ pagine. Quante pagine vanno nello swap?
---
$13 - 10 = 3$ pagine.

## swap-lento
Perché un computer che usa molto lo swap rallenta?
---
Perché la memoria di massa è molto più lenta della RAM, e ogni pagina va ricopiata prima di usarla.

## swap-ram
Vero o falso: la memoria virtuale aumenta la RAM del computer.
---
Falso. Usa la memoria di massa per far stare più programmi, ma la RAM resta quella.

## memoria-piena
Il telefono dice "memoria piena" perché hai troppe foto. Quale memoria è piena?
---
La memoria di massa, non la RAM.
