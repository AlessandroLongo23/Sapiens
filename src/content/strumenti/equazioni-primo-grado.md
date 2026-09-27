# Equazioni di primo grado

## Che cos'è un'equazione di primo grado

Un'equazione di primo grado in $x$ è un'uguaglianza che, dopo aver svolto i calcoli, si può scrivere nella forma $ax = b$ con $a \neq 0$. Risolverla vuol dire trovare il valore di $x$ che rende vera l'uguaglianza: per $2x + 3 = 7$ è $x = 2$, perché $2 \cdot 2 + 3 = 7$.

Per risolverla si usano i due principi di equivalenza. Il primo permette di aggiungere lo stesso termine a entrambi i membri: in pratica un termine passa dall'altra parte dell'uguale cambiando segno. Il secondo permette di moltiplicare o dividere entrambi i membri per lo stesso numero diverso da zero.

## Come si risolve a mano

1. togli le parentesi;
2. se ci sono denominatori, moltiplica tutti i termini per il loro mcm;
3. porta i termini con la $x$ a primo membro e i numeri a secondo membro, cambiando segno;
4. riduci i termini simili fino ad avere $ax = b$;
5. dividi entrambi i membri per $a$.

```ad-example
Esempio con le parentesi
L'equazione è $3(x - 2) + 5 = 2x - 1$. Togli le parentesi: $3x - 6 + 5 = 2x - 1$.
Porta i termini: $3x - 2x = -1 + 6 - 5$.
Riduci: $x = 0$. Controllo: $3 \cdot (0 - 2) + 5 = -1$ e $2 \cdot 0 - 1 = -1$.
```

```ad-example
Esempio con i denominatori
L'equazione è $\dfrac{x}{2} + \dfrac{1}{3} = x - 1$. Il mcm di 2 e 3 è 6: moltiplica tutti i termini per 6 e ottieni $3x + 2 = 6x - 6$.
Porta i termini: $3x - 6x = -6 - 2$, cioè $-3x = -8$.
Dividi per $-3$: $x = \dfrac{8}{3}$.
```

Se alla fine resta $0x = b$ con $b \neq 0$, nessun numero va bene e l'equazione è impossibile: $S = \emptyset$. Se resta $0x = 0$, va bene qualunque numero e l'equazione è indeterminata: $S = \mathbb{R}$.

```ad-error
Errori frequenti
- Dimenticare di cambiare segno a un termine che passa dall'altra parte dell'uguale.
- Con un meno davanti a una parentesi, cambiare segno solo al primo termine: $-(x - 3) = -x + 3$.
- Moltiplicare per il mcm solo i termini con il denominatore: vanno moltiplicati tutti, anche quelli interi.
- Dividere nel verso sbagliato: da $-3x = -8$ si ottiene $x = \dfrac{8}{3}$, non $\dfrac{3}{8}$.
```

## Domande frequenti

### Come faccio a sapere se ho sbagliato?

Sostituisci la soluzione nell'equazione di partenza: i due membri devono dare lo stesso numero. Il calcolatore lo fa nell'ultimo passaggio.

### E se compare $x^2$?

Se dopo i calcoli i termini con $x^2$ si cancellano, l'equazione è ancora di primo grado. Se invece ne resta uno, è di secondo grado e si risolve con la formula del discriminante.
