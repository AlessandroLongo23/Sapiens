# Formulario: Composizione e funzione inversa

## Funzione composta

Con $f: A \to B$ e $g: B \to C$, la composta $g \circ f$ ("g composto f") applica prima $f$, poi $g$:

$$
\begin{gathered}
g \circ f: A \to C \\
(g \circ f)(x) = g(f(x))
\end{gathered}
$$

Si può comporre se l'immagine di $f$ è contenuta nel dominio di $g$.

Con le formule: nella formula di $g$ metti $f(x)$, tra parentesi, al posto di ogni $x$. Esempio con $f(x) = 2x + 1$ e $g(x) = x^2$:

$$
\begin{gathered}
(g \circ f)(x) = (2x + 1)^2 \\
(f \circ g)(x) = 2x^2 + 1
\end{gathered}
$$

In un numero, per passi: $(g \circ f)(3) = g(f(3)) = g(7) = 49$.

La composizione non è commutativa: in generale $g \circ f \neq f \circ g$, e a volte una delle due non si può fare.

## Funzione identità

$$
\begin{gathered}
\mathrm{id}_A: A \to A, \quad \mathrm{id}_A(x) = x \\
f \circ \mathrm{id}_A = f, \quad \mathrm{id}_B \circ f = f
\end{gathered}
$$

Su $\mathbb{R}$ il grafico è la bisettrice $y = x$ del primo e del terzo quadrante.

## Funzione inversa

Esiste solo se $f: A \to B$ è biettiva. È la funzione $f^{-1}: B \to A$ tale che

$$f^{-1}(y) = x \iff f(x) = y$$

Nel diagramma a frecce: si rovesciano le frecce.

$$
\begin{gathered}
f^{-1} \circ f = \mathrm{id}_A \\
f \circ f^{-1} = \mathrm{id}_B
\end{gathered}
$$

## Inversa di una funzione lineare

$f(x) = ax + b$ da $\mathbb{R}$ a $\mathbb{R}$, con $a \neq 0$:

1. Scrivi $y = ax + b$.
2. Ricava $x$ in funzione di $y$.
3. Scambia le lettere: scrivi $x$ al posto di $y$.
4. Controlla: se $f(p) = q$, deve essere $f^{-1}(q) = p$.

$$f^{-1}(x) = \dfrac{x - b}{a}$$

Esempio: $f(x) = 3x - 6$ ha inversa $f^{-1}(x) = \dfrac{x + 6}{3}$. Con $a = 0$ la funzione è costante e non ha inversa.

## Grafico dell'inversa

Se $(p, q)$ sta sul grafico di $f$, allora $(q, p)$ sta sul grafico di $f^{-1}$: i due grafici sono simmetrici rispetto alla bisettrice $y = x$.

```ad-warning
L'ordine della composizione
In $g \circ f$ agisce prima $f$: riscrivi $(g \circ f)(x)$ come $g(f(x))$.
```

```ad-warning
Comporre non è moltiplicare
$(g \circ f)(x)$ è $g(f(x))$, non $g(x) \cdot f(x)$.
```

```ad-warning
L'inversa non è il reciproco
$f^{-1}(x)$ non è $\dfrac{1}{f(x)}$: per $f(x) = 2x + 1$, $f^{-1}(x) = \dfrac{x - 1}{2}$.
```
