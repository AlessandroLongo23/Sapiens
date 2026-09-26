# Formulario: Dominio, codominio e immagine

## Dominio e codominio

Per una funzione $f: A \to B$:

- dominio $D$: l'insieme di partenza $A$;
- codominio: l'insieme di arrivo $B$.

Una funzione è data da dominio, codominio e legge: con la stessa legge e insiemi diversi è un'altra funzione.

## Immagine e controimmagine

- Immagine di $x$: il numero $f(x)$; ogni $x$ del dominio ne ha una sola. Si trova sostituendo.
- Controimmagine di $y$: ogni $x$ per cui $f(x) = y$; possono essere nessuna, una o più. Si trova risolvendo l'equazione $f(x) = y$ nel dominio.

Con $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = 5 - 2x$: l'immagine di $3$ è $f(3) = -1$; la controimmagine di $9$ è $-2$, da $5 - 2x = 9$.

## Insieme immagine

I valori che la funzione assume davvero, scritto anche $\mathrm{Im}(f)$:

$$f(A) = \{f(x) \mid x \in A\}$$

$$f(A) \subseteq B$$

Un $y$ del codominio sta in $f(A)$ se ha almeno una controimmagine. Se $f(A) = B$, la funzione è suriettiva.

## Dominio naturale

Funzione data solo con la formula: il codominio è $\mathbb{R}$, il dominio è il più grande sottoinsieme di $\mathbb{R}$ in cui la formula ha senso (dominio naturale o campo di esistenza).

| Formula | Dominio |
|---|---|
| polinomio | $\mathbb{R}$ |
| frazione con la $x$ al denominatore | $\mathbb{R}$ senza gli zeri dei denominatori |

1. Prendi ogni denominatore che contiene la $x$.
2. Trova i valori che lo annullano; se è di grado più alto del primo, scomponilo e poni ogni fattore $\neq 0$.
3. Togli da $\mathbb{R}$ tutti i valori trovati.

$$
\begin{gathered}
f(x) = \frac{x + 1}{x^2 - 3x} \\[4pt]
x(x - 3) \neq 0 \\[4pt]
D = \mathbb{R} \setminus \{0,\ 3\}
\end{gathered}
$$

```ad-warning
Codominio e insieme immagine
Il codominio si sceglie, l'insieme immagine si calcola: $f(A)$ può essere più piccolo di $B$.
```

```ad-warning
Escludere gli zeri del numeratore
In $\dfrac{x - 3}{x + 1}$ si esclude solo $x = -1$: per $x = 3$ la frazione vale $0$.
```

```ad-warning
Semplificare prima
$\dfrac{x^2 - 1}{x - 1}$ ha dominio $\mathbb{R} \setminus \{1\}$ anche se, semplificata, diventa $x + 1$.
```
