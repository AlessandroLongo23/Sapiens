# Calcolo di espressioni

## Che cos'è un'espressione

Un'espressione numerica è una serie di numeri legati da operazioni e parentesi, come $2 + 3 \cdot (4 - 1)^2$. Perché il risultato sia uno solo, uguale per tutti, le operazioni si eseguono sempre nello stesso ordine.

## L'ordine delle operazioni

1. Prima le parentesi, dalle più interne: le tonde, poi le quadre, poi le graffe.
2. Dentro ogni parentesi, e poi fuori, le potenze.
3. Le moltiplicazioni e le divisioni, nell'ordine in cui si trovano, da sinistra a destra.
4. Le addizioni e le sottrazioni, da sinistra a destra.

Quando una parentesi è calcolata sparisce, e al suo posto resta il risultato. Un numero negativo dopo un'operazione si scrive tra parentesi tonde, come in $2 \cdot (-3)$, e con la regola dei segni $5 - (-3)$ diventa $5 + 3$.

```ad-example
Esempio con le parentesi
Calcola $\{[(2 + 3) \cdot 2 - 4] : 3\}^2$.
Tonde: $2 + 3 = 5$, resta $\{[5 \cdot 2 - 4] : 3\}^2$.
Quadre: $5 \cdot 2 - 4 = 10 - 4 = 6$, resta $\{6 : 3\}^2$.
Graffe: $6 : 3 = 2$, resta $2^2 = 4$.
```

```ad-example
Esempio con le frazioni
Calcola $\frac{1}{2} + \frac{2}{3} \cdot \frac{3}{4}$.
Prima la moltiplicazione: $\frac{2}{3} \cdot \frac{3}{4} = \frac{1}{2}$. Poi l'addizione: $\frac{1}{2} + \frac{1}{2} = 1$.
```

```ad-error
Errori frequenti
- Eseguire le operazioni da sinistra a destra senza guardare le priorità: $2 + 3 \cdot 4$ fa 14, non 20.
- Nelle divisioni in fila, partire da destra: $24 : 4 : 2 = 6 : 2 = 3$, non $24 : 2 = 12$.
- Confondere $-2^2$ con $(-2)^2$: nel primo la potenza riguarda solo il 2, quindi $-2^2 = -4$, mentre $(-2)^2 = 4$.
- Togliere una parentesi preceduta dal meno senza cambiare i segni dentro: $5 - (2 - 7) = 5 - 2 + 7 = 10$.
```

## Domande frequenti

### Viene prima la moltiplicazione o la divisione?

Nessuna delle due: hanno la stessa priorità e si eseguono nell'ordine in cui compaiono, da sinistra a destra. Lo stesso vale per addizione e sottrazione.

### Come si scrive un'espressione nel calcolatore?

Le frazioni come 3/4, i decimali con la virgola (0,5), * o x per moltiplicare, : o / per dividere, ^ per le potenze: $2^3$ si scrive 2^3 e $\left(\frac{2}{3}\right)^{-2}$ si scrive (2/3)^-2. Le parentesi sono ( ), [ ] e { }. Sotto il campo vedi come il calcolatore l'ha letta: se non è quella che volevi, aggiungi delle parentesi.

### Perché le parentesi hanno forme diverse?

Per leggere meglio: tonde dentro quadre dentro graffe mostrano subito quale parte calcolare prima. Il calcolatore accetta anche tonde dentro tonde.
