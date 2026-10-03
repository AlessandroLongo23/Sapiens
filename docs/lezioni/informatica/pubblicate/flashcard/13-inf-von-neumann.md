# Flashcard: La macchina di von Neumann

## programma-definizione
Che cos'è un programma?
---
Una sequenza di istruzioni, cioè di ordini elementari che la macchina sa eseguire.

## programma-memorizzato
Che cosa vuol dire "programma memorizzato"?
---
Che le istruzioni del programma sono scritte nella memoria, come sequenze di bit, accanto ai dati su cui lavorano.

## cambiare-programma
In una macchina a programma memorizzato, che cosa si fa per farle svolgere un altro lavoro?
---
Si carica in memoria un altro programma. I circuiti restano gli stessi.

## istruzioni-dove
Vero o falso: le istruzioni di un programma in esecuzione stanno nella CPU.
---
Falso. Stanno nella memoria centrale, insieme ai dati: la CPU le va a prendere lì, una alla volta.

## bit-dato-istruzione
Guardando i bit di una cella di memoria, si può dire se sono un dato o un'istruzione?
---
No. Dipende da come la macchina li usa: istruzioni e dati sono scritti nello stesso modo.

## quattro-blocchi
Quali sono i quattro blocchi della macchina di von Neumann?
---
CPU, memoria centrale, periferiche e bus.

## cpu-compito
Che cosa fa la CPU?
---
Esegue le istruzioni del programma: fa i calcoli, confronta i valori e decide quale istruzione viene dopo.

## cpu-sigla
Che cosa vuol dire la sigla CPU?
---
Central Processing Unit, in italiano unità centrale di elaborazione.

## memoria-centrale-compito
Che cosa conserva la memoria centrale?
---
Il programma in esecuzione e i dati su cui sta lavorando.

## periferiche-compito
A che cosa servono le periferiche?
---
A scambiare dati con l'esterno: quelle di ingresso li portano dentro, quelle di uscita portano fuori i risultati.

## bus-compito
Che cosa fa il bus?
---
Trasporta i bit da un blocco all'altro. Non calcola e non conserva niente.

## schermo-tattile
Lo schermo di un telefono è una periferica di ingresso o di uscita?
---
Tutte e due: di ingresso quando lo tocchi, di uscita quando mostra un'immagine.

## disco-blocco
Nello schema di von Neumann, a quale blocco appartiene il disco di un portatile?
---
Alle periferiche. È una memoria di massa, non la memoria centrale.

## ingresso-primo-viaggio
Un dato entra da una periferica di ingresso. Dove viene scritto per prima cosa?
---
Nella memoria centrale, dopo aver viaggiato sul bus.

## risultato-dove
La CPU ha appena calcolato una somma. Dove viene scritto il risultato?
---
Nella memoria centrale. Da lì può passare a una periferica di uscita.

## passi-che-si-ripetono
Quali passi si ripetono per ogni istruzione di un programma?
---
La CPU preleva dalla memoria l'istruzione e i dati, esegue l'istruzione, e il risultato viene scritto in memoria.

## chi-ha-calcolato
La calcolatrice del telefono mostra $7 + 5 = 12$. Quale blocco ha eseguito la somma?
---
La CPU. Lo schermo ha solo ricevuto i numeri e mostrato il risultato.

## lavatrice-periferiche
Nel piccolo computer di una lavatrice, il sensore di temperatura dell'acqua è una periferica di ingresso o di uscita?
---
Di ingresso: porta dentro un dato, la temperatura. Il motore del cestello è invece una periferica di uscita.
