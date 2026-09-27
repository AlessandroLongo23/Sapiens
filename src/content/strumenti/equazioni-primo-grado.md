# Equazioni di primo grado

## Che cos'è un'equazione di primo grado

Un'equazione di primo grado è un'uguaglianza con un numero sconosciuto, la $x$, che dopo i calcoli compare solo come $x$, mai come $x^2$.

Risolverla vuol dire trovare il numero che, messo al posto della $x$, rende vera l'uguaglianza. Per esempio, in $2x + 3 = 7$ la soluzione è $2$, perché:

$$2 \cdot 2 + 3 = 7$$

Le due parti divise dall'uguale si chiamano membri: il primo membro è a sinistra, il secondo a destra.

## Un esempio svolto

```ad-example
Esempio: 3(x - 2) + 5 = 2x - 1
Togli le parentesi, moltiplicando il $3$ per ogni termine:

$$3x - 6 + 5 = 2x - 1$$

Porta i termini con la $x$ a sinistra e i numeri a destra. Chi passa dall'altra parte cambia segno:

$$3x - 2x = -1 + 6 - 5$$

Somma i termini simili: i termini con la $x$ tra loro, i numeri tra loro.

$$x = 0$$

Controlla sostituendo $0$ al posto della $x$. I due membri valgono entrambi $-1$:

$$3 \cdot (0 - 2) + 5 = -1$$
$$2 \cdot 0 - 1 = -1$$
```

## La regola generale

Ogni passaggio usa uno dei due principi di equivalenza, le regole che cambiano l'equazione senza cambiarne la soluzione.

Il primo principio dice che puoi aggiungere lo stesso termine a entrambi i membri. In pratica un termine passa dall'altra parte dell'uguale cambiando segno.

Il secondo principio dice che puoi moltiplicare o dividere entrambi i membri per lo stesso numero, purché non sia zero.

I passaggi sono sempre questi, e alcuni si saltano quando non servono:

1. togli le parentesi;
2. se ci sono denominatori, moltiplica tutti i termini per il loro mcm, il minimo comune multiplo;
3. porta i termini con la $x$ a sinistra e i numeri a destra, cambiando segno;
4. somma i termini simili fino ad avere $ax = b$;
5. dividi entrambi i membri per $a$, il numero davanti alla $x$.

```ad-example
Esempio con i denominatori: x/2 + 1/3 = x - 1
I denominatori sono $2$ e $3$, e il loro mcm è $6$. Moltiplica tutti i termini per $6$:

$$6 \cdot \dfrac{x}{2} + 6 \cdot \dfrac{1}{3} = 6 \cdot x - 6 \cdot 1$$
$$3x + 2 = 6x - 6$$

Porta i termini e somma quelli simili:

$$3x - 6x = -6 - 2$$
$$-3x = -8$$

Dividi entrambi i membri per $-3$. Meno diviso meno dà più:

$$x = \dfrac{8}{3}$$
```

## Quando non c'è una soluzione sola

A volte, sommando i termini simili, la $x$ sparisce e resta $0x$ a sinistra.

Se resta $0x = 3$, nessun numero va bene, perché ogni numero per zero dà zero. L'equazione è impossibile:

$$S = \emptyset$$

Se resta $0x = 0$, va bene qualunque numero. L'equazione è indeterminata:

$$S = \mathbb{R}$$

```ad-error
Errori frequenti
- Dimenticare di cambiare segno a un termine che passa dall'altra parte dell'uguale.
- Con un meno davanti a una parentesi, cambiare segno solo al primo termine. Il meno cambia segno a tutti: $-(x - 3) = -x + 3$.
- Moltiplicare per il mcm solo i termini con il denominatore. Vanno moltiplicati tutti, anche i numeri interi.
- Dividere nel verso sbagliato. Da $-3x = -8$ si ottiene $x = \dfrac{8}{3}$, non $\dfrac{3}{8}$.
```

## Domande frequenti

### Come faccio a sapere se ho sbagliato?

Sostituisci la soluzione nell'equazione di partenza: i due membri devono dare lo stesso numero. Il calcolatore lo fa nell'ultimo passaggio.

### E se compare $x^2$?

Se dopo i calcoli i termini con $x^2$ si cancellano, l'equazione è ancora di primo grado.

Se invece ne resta uno, è di secondo grado. Si risolve con la formula del discriminante, nel calcolatore delle equazioni di secondo grado.
