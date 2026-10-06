# Formulario: Disequazioni esponenziali

## Dalle potenze agli esponenti

$$
\begin{gathered}
a > 1: \quad a^{f(x)} > a^{g(x)} \iff f(x) > g(x) \\
0 < a < 1: \quad a^{f(x)} > a^{g(x)} \iff f(x) < g(x)
\end{gathered}
$$

Con la base maggiore di $1$ il verso resta, con la base tra $0$ e $1$ si inverte. Vale per tutti i versi.

Per esempio $2^x > 8$ dà $x > 3$, mentre $\left(\dfrac{1}{2}\right)^x > 8$ dà $x < -3$.

Una base tra $0$ e $1$ si può riscrivere con l'esponente opposto: $\left(\dfrac{1}{2}\right)^x = 2^{-x}$.

## Disequazioni elementari

| | $b > 0$ | $b \leq 0$ |
|---|---|---|
| $a^x > b$, $a^x \geq b$ | si scrive $b$ come potenza di $a$ | sempre vera, $S = \mathbb{R}$ |
| $a^x < b$, $a^x \leq b$ | si scrive $b$ come potenza di $a$ | impossibile, $S = \emptyset$ |

## Stessa base

1. Scrivi tutte le basi come potenze dello stesso numero e riduci ogni membro a una sola potenza.
2. Guarda la base: maggiore di $1$, il verso resta; tra $0$ e $1$, si inverte.
3. Scrivi la disequazione tra gli esponenti.
4. Risolvila e scrivi $S$.

Per esempio $\left(\dfrac{1}{3}\right)^{x + 1} < \left(\dfrac{1}{3}\right)^3$ dà $x + 1 > 3$, cioè $S = \,\mathopen{]}2, +\infty\mathclose{[}$.

## Raccoglimento

Dopo aver raccolto la potenza comune si divide per il numero che la moltiplica: se è negativo, il verso cambia.

$$3^x (1 - 9) > -72 \ \Rightarrow \ 3^x < 9 \ \Rightarrow \ x < 2$$

## Sostituzione

1. Poni $t = a^x$ e risolvi la disequazione in $t$.
2. Riscrivi ogni condizione su $t$ come condizione su $a^x$.
3. Risolvi le disequazioni elementari: $a^x$ è sempre positivo.
4. Condizione doppia: devono valere tutte e due. Condizioni con "oppure": unione.

| Disequazione | In $t$ | Soluzioni |
|---|---|---|
| $4^x - 6 \cdot 2^x + 8 < 0$ | $2 < t < 4$ | $1 < x < 2$ |
| $4^x - 3 \cdot 2^x + 2 > 0$ | $t < 1$ oppure $t > 2$ | $x < 0$ oppure $x > 1$ |
| $9^x - 8 \cdot 3^x - 9 \geq 0$ | $t \leq -1$ oppure $t \geq 9$ | $x \geq 2$ |
| $9^x - 8 \cdot 3^x - 9 < 0$ | $-1 < t < 9$ | $x < 2$ |

## Prodotti, quozienti e basi diverse

- Fratte e prodotti: segno di ogni fattore con una disequazione elementare, poi tabella dei segni.
- Basi diverse e stesso esponente: dividi per una delle potenze. $2^x > 3^x$ diventa $\left(\dfrac{2}{3}\right)^x > 1$, cioè $x < 0$.

## Il verso in ogni passaggio

| Passaggio | Il verso |
|---|---|
| dalle potenze agli esponenti, base maggiore di $1$ | resta |
| dalle potenze agli esponenti, base tra $0$ e $1$ | si inverte |
| moltiplicare o dividere per una potenza $a^x$ | resta, perché $a^x > 0$ |
| moltiplicare o dividere per un numero negativo | si inverte |

```ad-warning
Base minore di 1
Da $\left(\dfrac{1}{2}\right)^x > \left(\dfrac{1}{2}\right)^{-3}$ segue $x < -3$, non $x > -3$.
```

```ad-warning
Secondo membro negativo
$3^x > -9$ è vera per ogni $x$: non si cerca un esponente per $-9$.
```

```ad-warning
Rispondere con i valori di t
Da $2 < t < 4$, con $t = 2^x$, si ricava $1 < x < 2$, non $2 < x < 4$.
```
