---
stato: idea
aggiornato: 2026-10-05
tag: [idea]
---
# Diagrammi di flusso eseguibili

## L'idea
Proposta da Alessandro il 5 ottobre 2026, dopo aver visto le prime lezioni di programmazione con i diagrammi disegnati in TikZ.

Un componente per i diagrammi di flusso che sia interattivo e modificabile: lo studente aggiunge blocchi con della logica vera, che lavora sulle variabili del programma, e il diagramma si esegue come si esegue il codice. Durante l'esecuzione si accende un blocco alla volta, cosa utile soprattutto con i cicli e le selezioni.

Il diagramma e il codice si corrispondono uno a uno: lo studente costruisce un diagramma e, nella vista accanto, il codice si aggiorna per rispecchiarlo.

Accanto al diagramma, come lo schermo diviso tra codice e anteprima nell'editor, una tabella con le variabili e i loro valori. Quando l'esecuzione arriva a un blocco di selezione o alla condizione di un ciclo, nella tabella si evidenzia la variabile che si sta confrontando, così si capisce perché la condizione è vera o falsa.

## Perché potrebbe valere
Le lezioni di oggi hanno già tabelle che seguono i valori passo per passo, scritte a mano: il componente le produrrebbe da solo, per qualunque programma. I libri del biennio insegnano i diagrammi prima del codice, e il passaggio dall'uno all'altro è il punto dove gli studenti si perdono.

## Dubbi e conflitti
Parere di Claude del 5 ottobre 2026, non discusso:
- La corrispondenza uno a uno regge solo se il diagramma è strutturato: i blocchi si inseriscono su una freccia e le frecce non si disegnano a mano. Con frecce libere si può costruire un diagramma che non ha un programma Python o C++ corrispondente.
- Dal diagramma al codice è la direzione facile. Dal codice al diagramma serve un sottoinsieme del linguaggio (assegnamento, lettura, scrittura, selezione, cicli); funzioni e liste restano fuori.
- Per generare C++ ogni variabile deve avere un tipo, che in Python non si scrive.
- L'esecuzione passo per passo chiede un interprete nostro del linguaggio ridotto, scritto in JavaScript, senza `eval`.
- Le figure TikZ servono ancora per la stampa e per i motori di ricerca, come succede con il piano cartesiano.

## Collegamenti
- [[Editor di codice]], [[Grafici e simulazioni interattive]]
- [[2026-10-05 Prime lezioni di programmazione]]
