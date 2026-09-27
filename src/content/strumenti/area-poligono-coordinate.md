# Area di un poligono dalle coordinate dei vertici

## Che cos'è

La formula dell'area di Gauss calcola l'area di un poligono a partire dalle coordinate dei suoi vertici, scritti in ordine.

Si chiama anche formula del laccio, perché i prodotti incrociati, disegnati sulla tabella delle coordinate, si allacciano come le stringhe di una scarpa. Funziona con qualunque poligono, anche non regolare, purché i lati non si incrocino.

## Come si calcola a mano

```ad-example
Il triangolo A(1, 1), B(5, 2), C(2, 6)
Per ogni lato moltiplica l'ascissa del primo vertice per l'ordinata del secondo, e sottrai il prodotto opposto. Il lato $CA$ chiude il giro tornando al primo vertice:

$$\begin{aligned}
AB &: 1 \cdot 2 - 5 \cdot 1 = -3 \\[6pt]
BC &: 5 \cdot 6 - 2 \cdot 2 = 26 \\[6pt]
CA &: 2 \cdot 1 - 1 \cdot 6 = -4 \\[6pt]
S &= -3 + 26 - 4 = 19 \\[6pt]
A &= \frac{|S|}{2} = \frac{19}{2} = 9{,}5
\end{aligned}$$
```

In generale, con i vertici $(x_1, y_1), (x_2, y_2), \dots, (x_n, y_n)$:

$$A = \frac{1}{2}\left|\,x_1 y_2 - x_2 y_1 + x_2 y_3 - x_3 y_2 + \dots + x_n y_1 - x_1 y_n\,\right|$$

Il segno della somma dice il verso: positivo se hai girato in senso antiorario, negativo in senso orario. Il valore assoluto lo toglie, perché un'area non è mai negativa.

Per il perimetro calcola ogni lato con la formula della distanza tra due punti e somma. Nell'esempio $\overline{AB} = \sqrt{17}$, $\overline{BC} = 5$ e $\overline{CA} = \sqrt{26}$.

```ad-error
Errori frequenti
- Scrivere i vertici in un ordine a caso: se i lati si incrociano, la formula dà un numero che non è l'area.
- Dimenticare l'ultimo lato, dall'ultimo vertice al primo.
- Non dividere per $2$, o tenere il segno meno nel risultato.
```

## Domande frequenti

### Da quale vertice devo partire?

Da uno qualsiasi. Conta solo l'ordine: i vertici vanno scritti come li incontri camminando lungo il bordo del poligono.

### Funziona anche per i poligoni concavi?

Sì, per ogni poligono i cui lati non si incrociano. Per un poligono intrecciato, come un otto, la formula non dà l'area.
