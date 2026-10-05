# Flashcard: La programmazione a blocchi

## blocchi-definizione
Che cos'è la programmazione a blocchi?
---
Un modo di costruire un programma trascinando blocchi già pronti, ognuno dei quali è un'istruzione, e agganciandoli uno all'altro.

## blocchi-verso-lettura
In che verso si legge una pila di blocchi?
---
Dall'alto in basso: i blocchi si eseguono nell'ordine in cui sono agganciati.

## blocco-avvio
Come si riconosce il blocco di avvio, e dove sta?
---
Ha il bordo superiore arrotondato e sta in cima alla pila, senza niente sopra.

## blocco-c
Che cosa contiene un blocco a forma di C?
---
Altri blocchi: quelli di un ramo, se è una selezione, o quelli da ripetere, se è un'iterazione.

## forma-condizione
Perché una condizione non si può infilare nel foro di un numero?
---
Perché ha un'altra forma: un pezzo entra solo nel foro della sua stessa forma.

## errore-sintassi
Che cos'è un errore di sintassi?
---
Un errore nel modo di scrivere un'istruzione, come una parentesi dimenticata o una parola battuta male.

## sintassi-con-i-blocchi
Perché in un programma a blocchi non ci sono errori di sintassi?
---
Perché non si batte niente: i blocchi sono già scritti, e un pezzo della forma sbagliata non si aggancia.

## errore-logico
Che cos'è un errore logico?
---
Un errore di ragionamento: il programma parte, ma fa una cosa diversa da quella voluta.

## si-incastra-quindi-giusto
Vero o falso: se tutti i blocchi si incastrano, il programma è giusto.
---
Falso. I blocchi impediscono gli errori di scrittura, non quelli logici.

## quadrato-gradi
Nel programma del quadrato, 80 gradi al posto di 90. Che tipo di errore è?
---
Un errore logico: il programma parte, ma il personaggio non disegna un quadrato.

## sequenza-nei-blocchi
Come si scrive una sequenza con i blocchi?
---
Con una pila: un blocco agganciato sotto l'altro.

## iterazione-nei-blocchi
Quale struttura è il blocco "ripeti 4 volte"?
---
Un'iterazione, in cui il conto dei giri lo tiene il blocco.

## ripeti-quattro-diagramma
Come diventa "ripeti 4 volte" in un diagramma di flusso?
---
$i \leftarrow 1$; finché $i \leq 4$ si eseguono le istruzioni e poi $i \leftarrow i + 1$.

## quadrato-mosse
"Ripeti 4 volte: fai 50 passi, ruota di 90 gradi". Quante mosse fa il personaggio in tutto?
---
Otto: due mosse per ognuno dei quattro giri.

## triangolo
Per far disegnare un triangolo con i lati uguali al posto del quadrato, che cosa cambi?
---
I giri diventano 3 e i gradi 120.

## ripeti-fino-a-quando
"Ripeti fino a quando `passi` ≥ `obiettivo`". Qual è la condizione del ciclo nel diagramma?
---
`passi < obiettivo`: il blocco dice quando si esce, il rombo chiede quando si resta.

## conto-rovescia-ordine
Finché $n > 0$: prima $n \leftarrow n - 1$, poi scrivi $n$. Che cosa scrive con $n = 3$?
---
2, 1, 0: il numero viene diminuito prima di essere scritto.

## piu-pile
Vero o falso: un programma a blocchi può avere più pile, ognuna con il suo blocco di avvio.
---
Vero. Ogni pila parte quando succede la cosa scritta nel suo blocco di avvio.

## limiti-dei-blocchi
Perché i programmi lunghi non si scrivono a blocchi?
---
Perché una pila di centinaia di blocchi non sta sullo schermo, e trascinare è più lento che scrivere.
