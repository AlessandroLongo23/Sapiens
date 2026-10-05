---
stato: idea
aggiornato: 2026-10-05
tag: [idea]
---
# Diagramma e codice in corrispondenza

## L'idea
Proposta da Alessandro il 5 ottobre 2026. La prima parte, il diagramma che si esegue con la tabella delle variabili, è costruita: [[Diagrammi di flusso eseguibili]]. Qui resta quello che manca.

Il diagramma di flusso è modificabile: lo studente aggiunge blocchi con della logica vera, ed è un modo alternativo di scrivere un programma. Il diagramma e il codice si corrispondono uno a uno: lo studente costruisce un diagramma e, nella vista accanto, il codice si aggiorna per rispecchiarlo.

## Perché potrebbe valere
I libri del biennio insegnano i diagrammi prima del codice, e il passaggio dall'uno all'altro è il punto dove gli studenti si perdono.

## Dubbi e conflitti
Parere di Claude del 5 ottobre 2026, non discusso:
- La modifica deve inserire blocchi su una freccia, senza frecce disegnate a mano: è già così che il diagramma è fatto dentro, e ogni diagramma ha un programma corrispondente.
- Dal diagramma al codice è la direzione facile. Dal codice al diagramma serve un sottoinsieme del linguaggio (assegnamento, lettura, scrittura, selezione, cicli); funzioni e liste restano fuori.
- Per generare C++ ogni variabile deve avere un tipo, che in Python non si scrive.
- La divisione: nel diagramma `7 / 2` fa 3,5; in C++ tra interi fa 3. Il codice generato deve rispettare il diagramma.

## Collegamenti
- [[Diagrammi di flusso eseguibili]], [[Editor di codice]]
- [[2026-10-05 Prime lezioni di programmazione]]
