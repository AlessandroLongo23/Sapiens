# Flashcard: Il ciclo while

## ciclo-giro
Che cos'è un ciclo, e che cos'è un giro?
---
Un ciclo è un blocco di istruzioni che il programma esegue più volte di seguito; un giro è una di queste esecuzioni.

## condizione-corpo
Quali sono le due parti di un ciclo `while`?
---
La condizione, una domanda con risposta vero o falso, e il corpo, cioè le istruzioni da ripetere.

## condizione-falsa
Che cosa fa il computer quando la condizione di un `while` è falsa?
---
Salta il corpo e prosegue con l'istruzione che viene dopo il ciclo.

## diagramma-freccia
In un diagramma di flusso, da che cosa si riconosce un ciclo?
---
Dalla freccia che risale: dopo l'ultima istruzione del corpo si torna sopra il rombo della condizione.

## corpo-python-cpp
Come si capisce quali istruzioni fanno parte del corpo, in Python e in C++?
---
In Python sono le righe rientrate sotto la riga del `while`; in C++ sono quelle tra le parentesi graffe.

## conto-rovescia-giri
`i` parte da $5$; finché `i > 0` il programma stampa `i` e poi le toglie $1$. Quanti giri fa il ciclo?
---
Cinque: stampa $5$, $4$, $3$, $2$, $1$, poi `i` vale $0$ e la condizione è falsa.

## controlli-e-giri
Un ciclo `while` fa $3$ giri. Quante volte viene controllata la condizione?
---
Quattro volte: tre con risposta vero e un'ultima, con risposta falso, che fa uscire dal ciclo.

## valore-dopo-ciclo
`i` parte da $3$ e il ciclo ripete `i = i - 1` finché `i > 0`. Quanto vale `i` dopo il ciclo?
---
$0$: è il primo valore che rende falsa la condizione.

## tabella-traccia
Che cos'è una tabella di traccia di un ciclo?
---
Una tabella con una riga per ogni controllo della condizione e, accanto, i valori delle variabili: serve a eseguire il ciclo sulla carta.

## ciclo-infinito
`i` parte da $5$ e il corpo del ciclo, con condizione `i > 0`, stampa `i` senza cambiarla. Che cosa succede?
---
Il ciclo non finisce mai: `i` resta $5$, la condizione è sempre vera e il programma stampa $5$ senza fermarsi.

## regola-fine
Che cosa deve fare il corpo di un `while` perché il ciclo finisca?
---
Cambiare almeno una variabile della condizione, nella direzione che porta la condizione a diventare falsa.

## zero-giri
Vero o falso: il corpo di un ciclo `while` viene eseguito sempre almeno una volta.
---
Falso. La condizione si controlla prima del primo giro: se è falsa subito, il corpo non viene eseguito nemmeno una volta.

## verso-confronto
`i` parte da $5$ e la condizione del ciclo è `i < 0`. Quanti giri fa?
---
Nessuno: $5 < 0$ è falso già al primo controllo.

## rimbalzi
`h` parte da $200$; finché `h > 10` il programma la dimezza con la divisione intera. Quanti giri fa?
---
Cinque: `h` diventa $100$, $50$, $25$, $12$, $6$, e $6$ non supera $10$.

## quando-while
Quando serve il `while` più di ogni altro ciclo?
---
Quando il numero dei giri non si conosce in partenza, perché dipende dai conti o da quello che scrive chi usa il programma.

## due-letture
Nel programma che somma i numeri letti fino allo $0$ la lettura compare due volte. Dove, e perché?
---
Prima del ciclo, per dare a `n` un valore prima del primo controllo, e in fondo al corpo, per cambiare `n` e poter uscire dal ciclo.

## somma-fino-a-zero
Il programma che somma i numeri letti fino allo $0$ riceve $4$, $7$, $-2$, $0$. Che cosa scrive?
---
$9$, cioè $4 + 7 - 2$: lo $0$ ferma il ciclo.

## leggere-intero
Come si legge un numero intero e lo si mette in `n`, in Python e in C++?
---
`n = int(input())` in Python, `cin >> n;` in C++.
