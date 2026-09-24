# Formulario: Funzioni iniettive, suriettive e biettive

## Dominio, codominio e immagine

In $f: A \to B$ il dominio è $A$, il codominio è $B$. L'immagine è l'insieme dei valori assunti davvero, contenuto nel codominio:

$$\mathrm{Im}(f) = \{f(x) \mid x \in A\}$$

## Le tre proprietà

Iniettiva: elementi diversi hanno immagini diverse.

$$f(x_1) = f(x_2) \implies x_1 = x_2$$

Suriettiva: ogni elemento del codominio è immagine di almeno un elemento del dominio.

$$\mathrm{Im}(f) = B$$

Biettiva (o biunivoca): iniettiva e suriettiva; ogni $y \in B$ è immagine di uno e un solo $x \in A$.

| Proprietà | Frecce che arrivano a ogni elemento di $B$ | Rette $y = k$, con $k \in B$, che incontrano il grafico |
|---|---|---|
| iniettiva | al massimo una | al massimo una volta |
| suriettiva | almeno una | almeno una volta |
| biettiva | esattamente una | esattamente una volta |

Con insiemi finiti: se $A$ ha più elementi di $B$, $f$ non è iniettiva; se ne ha meno, non è suriettiva. Per essere biettiva, $f$ richiede che $A$ e $B$ abbiano lo stesso numero di elementi, ma questo da solo non è sufficiente.

## Come si verifica

- Iniettiva: supponi $f(x_1) = f(x_2)$ e ricava $x_1 = x_2$.
- Non iniettiva: trova due numeri diversi del dominio con la stessa immagine.
- Suriettiva: preso un $y$ qualsiasi del codominio, risolvi $f(x) = y$ e controlla che la soluzione stia nel dominio.
- Non suriettiva: trova un $y$ del codominio per cui $f(x) = y$ non ha soluzioni nel dominio.

Provare qualche valore non dimostra l'iniettività o la suriettività: un esempio può solo smentirle.

## Stessa formula, insiemi diversi

| Funzione | Dominio e codominio | Iniettiva | Suriettiva | Biettiva |
|---|---|---|---|---|
| $2x + 1$ | $\mathbb{R} \to \mathbb{R}$ | sì | sì | sì |
| $x^2$ | $\mathbb{R} \to \mathbb{R}$ | no | no | no |
| $x^2$ | $\mathbb{R} \to [0, +\infty)$ | no | sì | no |
| $x^2$ | $[0, +\infty) \to \mathbb{R}$ | sì | no | no |
| $x^2$ | $[0, +\infty) \to [0, +\infty)$ | sì | sì | sì |

Restringere il dominio può rendere una funzione iniettiva, restringere il codominio può renderla suriettiva.

## Funzione inversa

$$f \text{ è invertibile} \iff f \text{ è biettiva}$$

L'inversa $f^{-1}: B \to A$ si trova risolvendo $y = f(x)$ rispetto a $x$: per $f(x) = 2x + 1$ su $\mathbb{R}$, $f^{-1}(y) = \dfrac{y - 1}{2}$.

```ad-warning
Suriettività senza codominio
"$x^2$ è suriettiva?" non ha risposta finché non si dice il codominio: scrivi sempre $f: A \to B$.
```

```ad-warning
Rette orizzontali e rette verticali
Le verticali dicono se un grafico è una funzione; le orizzontali se è iniettiva o suriettiva.
```

```ad-warning
Iniettiva non vuol dire crescente
$f(x) = \dfrac{1}{x}$, sui reali diversi da zero, è iniettiva ma né crescente né decrescente.
```
