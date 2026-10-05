# Formulario: La programmazione a blocchi

## Che cos'è

- Programmazione a blocchi: un programma si costruisce trascinando blocchi già pronti, ognuno dei quali è un'istruzione, e agganciandoli uno all'altro.
- L'ambiente ha di solito tre zone: l'elenco dei blocchi, lo spazio in cui si compone il programma, la scena in cui si vede il risultato.
- Un programma a blocchi si legge dall'alto in basso; può avere più pile, ognuna con il suo blocco di avvio.

## Le forme

| Forma del blocco | Che cosa è | Dove si incastra |
|---|---|---|
| bordo superiore arrotondato, linguetta sotto | l'avvio del programma | in cima, senza niente sopra |
| incavo sopra e linguetta sotto | un'istruzione | sotto un altro blocco, in una pila |
| a forma di C | una selezione o un'iterazione | in una pila, con altri blocchi al suo interno |
| pezzo piccolo, arrotondato o a punta | un valore oppure una condizione | nel foro della stessa forma dentro un altro blocco |

## Le tre strutture

| Struttura | Nei blocchi | Nel diagramma di flusso |
|---|---|---|
| sequenza | la pila: un blocco sotto l'altro | blocchi in fila |
| selezione | "se ... allora ... altrimenti", con uno spazio per ramo | rombo con due rami |
| iterazione | blocco a C: "ripeti 4 volte", "ripeti fino a quando", "per sempre" | rombo con la freccia che risale |

## Dai blocchi al diagramma

| Blocco | Nel diagramma |
|---|---|
| "ripeti 4 volte" | $i \leftarrow 1$; finché $i \leq 4$: le istruzioni, poi $i \leftarrow i + 1$ |
| "ripeti fino a quando" con una condizione | finché vale la condizione contraria |
| "cambia punti di 10" | $\text{punti} \leftarrow \text{punti} + 10$ |

## Gli errori

| Errore | Che cos'è | Con i blocchi |
|---|---|---|
| di sintassi | un'istruzione scritta in un modo che il linguaggio non accetta | non può esserci: non si batte niente |
| logico | il programma parte, ma fa un'altra cosa | resta possibile: ordine sbagliato, condizione sbagliata |

Un errore logico si cerca eseguendo un passo alla volta e confrontando con quello che ci si aspettava.

```ad-warning
Un programma che parte non è un programma giusto
I blocchi impediscono gli errori di scrittura, non quelli di ragionamento.
```

```ad-warning
"Ripeti fino a quando" è il contrario di "finché"
Il blocco dice quando si esce dal giro, il rombo del ciclo chiede quando si resta.
```
