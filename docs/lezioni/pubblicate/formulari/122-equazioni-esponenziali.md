# Formulario: Equazioni esponenziali

## L'equazione elementare

$$a^x = b \qquad \text{con } a > 0 \text{ e } a \neq 1$$

| Secondo membro | Soluzioni |
|---|---|
| $b \leq 0$ | nessuna: equazione impossibile |
| $b > 0$ | una sola |

Se $b$ è una potenza di $a$ la soluzione si legge: $2^x = 8$ dà $x = 3$, $2^x = \dfrac{1}{8}$ dà $x = -3$, $5^x = 1$ dà $x = 0$. Se non lo è, come in $2^x = 5$, la soluzione si scrive con un logaritmo.

## Stessa base

$$a^{f(x)} = a^{g(x)} \iff f(x) = g(x)$$

1. Scrivi tutte le basi come potenze dello stesso numero: $4 = 2^2$, $\dfrac{1}{2} = 2^{-1}$, $\sqrt{2} = 2^{\frac{1}{2}}$.
2. Riduci ogni membro a una sola potenza.
3. Uguaglia gli esponenti.
4. Risolvi l'equazione ottenuta.

Per esempio $9^{x + 1} = 27^x$ diventa $3^{2x + 2} = 3^{3x}$, da cui $x = 2$.

## Raccoglimento

Si usa quando si sommano potenze come $a^{x + 2}$ e $a^x$: $a^{x + 2} = a^2 \cdot a^x$.

$$2^{x + 2} + 2^x = 40 \ \Rightarrow \ 2^x (4 + 1) = 40 \ \Rightarrow \ 2^x = 8$$

Conviene raccogliere la potenza con l'esponente più piccolo.

## Sostituzione

Si usa quando compaiono $a^{2x}$ e $a^x$, oppure $a^x$ e $a^{-x}$.

1. Poni $t = a^x$, con $t > 0$.
2. Risolvi l'equazione in $t$.
3. Scarta i valori di $t$ negativi o nulli.
4. Per ogni valore accettabile risolvi $a^x = t$.

Con $t = 2^x$:

$$4^x = t^2 \qquad 2^{x + 1} = 2t \qquad 2^{-x} = \frac{1}{t}$$

Per esempio $9^x - 8 \cdot 3^x - 9 = 0$ dà $t = -1$, da scartare, e $t = 9$, da cui $x = 2$.

## Basi diverse, stesso esponente

$$a^x \cdot b^x = (a \cdot b)^x \qquad a^x : b^x = (a : b)^x$$

$3^{x - 2} = 7^{x - 2}$ diventa $\left(\dfrac{3}{7}\right)^{x - 2} = 1$, da cui $x = 2$.

## Quale metodo

| Forma dell'equazione | Che cosa fai |
|---|---|
| $a^{f(x)} = b$, con $b \leq 0$ | impossibile |
| una potenza per membro | stessa base, poi uguagli gli esponenti |
| somma di potenze come $a^{x + 2}$ e $a^x$ | raccogli $a^x$ |
| $a^{2x}$ e $a^x$, oppure $a^x$ e $a^{-x}$ | poni $t = a^x$, con $t > 0$ |
| basi diverse, stesso esponente | una sola potenza |
| nessuna di queste, come $2^x = 5$ | serve il logaritmo |

```ad-warning
Secondo membro negativo
$7^x = -7$ è impossibile, non ha la soluzione $x = -1$: $7^{-1} = \dfrac{1}{7}$.
```

```ad-warning
Gli esponenti si uguagliano solo tra due potenze
Da $2^x + 2^3 = 2^5$ non segue $x + 3 = 5$: a primo membro c'è una somma.
```

```ad-warning
Fermarsi a t
I valori di $t$ non sono le soluzioni: da $t = 4$, con $t = 2^x$, si ricava $x = 2$.
```
