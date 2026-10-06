# Formulario: Funzioni reali e dominio

## Funzioni reali di variabile reale

Funzione $f: D \to \mathbb{R}$ con $D \subseteq \mathbb{R}$: a ogni $x$ del dominio associa un solo numero reale $y = f(x)$.

| Funzione | Com'è fatta |
|---|---|
| razionale intera | un polinomio |
| razionale fratta | un quoziente di polinomi, con la $x$ al denominatore |
| irrazionale | la $x$ compare sotto una radice |

## Dominio naturale

Dominio naturale, o campo di esistenza: tutti gli $x$ reali per cui la formula si può calcolare.

| Nella formula c'è | Condizione |
|---|---|
| un polinomio | nessuna |
| un denominatore $B(x)$ | $B(x) \neq 0$ |
| una radice di indice pari, $\sqrt{A(x)}$ | $A(x) \geq 0$ |
| una radice di indice pari al denominatore | $A(x) > 0$ |
| una radice di indice dispari, $\sqrt[3]{A(x)}$ | nessuna |
| un valore assoluto, $\lvert A(x) \rvert$ | nessuna |

1. Cerca i denominatori e le radici di indice pari.
2. Scrivi una condizione per ognuno.
3. Se sono più di una, mettile a sistema.
4. Risolvi e scrivi il dominio con gli intervalli.

Esempi: $\sqrt{x^2 - 4}$ ha $D = \,\mathopen{]}-\infty, -2] \cup [2, +\infty\mathclose{[}$; $\dfrac{\sqrt{x + 3}}{x - 1}$ ha $D = [-3, 1\mathclose{[}\, \cup \,\mathopen{]}1, +\infty\mathclose{[}$.

## Zeri e intersezioni con gli assi

- Zeri: gli $x$ del dominio che risolvono $f(x) = 0$. Sono le ascisse dei punti del grafico sull'asse $x$.
- Asse $y$: il punto $(0, f(0))$, se $0$ appartiene al dominio; altrimenti nessuno.
- Una frazione vale zero dove si annulla il numeratore, se quel valore sta nel dominio.

## Segno

Si risolve $f(x) > 0$: dove è vera la funzione è positiva e il grafico sta sopra l'asse $x$; negli altri punti del dominio, tolti gli zeri, è negativa e il grafico sta sotto.

Per $f(x) = \dfrac{x^2 - 4}{x - 1}$: $D = \mathbb{R} \setminus \{1\}$, zeri $-2$ e $2$, positiva per $-2 < x < 1$ e per $x > 2$, negativa per $x < -2$ e per $1 < x < 2$.

## Dal grafico

- Dominio: le ascisse dei punti del grafico (si legge sull'asse $x$).
- Insieme immagine: le ordinate dei punti del grafico (si legge sull'asse $y$).
- Zeri: dove il grafico incontra l'asse $x$.
- Segno: positiva dove il grafico sta sopra l'asse $x$, negativa dove sta sotto.

```ad-warning
Maggiore o uguale, non maggiore
Per $\sqrt{x - 3}$ la condizione è $x - 3 \geq 0$: il $3$ è nel dominio. L'uguale si toglie solo se la radice è al denominatore.
```

```ad-warning
Una frazione sotto radice
Per $\sqrt{\dfrac{x - 1}{x + 2}}$ si risolve $\dfrac{x - 1}{x + 2} \geq 0$, non le due condizioni $x - 1 \geq 0$ e $x + 2 > 0$.
```

```ad-warning
Il dominio prima di tutto
Il dominio si trova sulla formula com'è scritta, prima di semplificare, e uno zero conta solo se sta nel dominio.
```
