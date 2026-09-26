# Formulario: Equazioni letterali

## Incognita e parametri

- Equazione letterale: contiene, oltre all'incognita, altre lettere, i parametri.
- Parametro: un numero fissato ma non dato; nei conti si tratta come un numero.
- Se il testo non dice altro, l'incognita è $x$. I termini con solo il parametro sono termini noti.
- Coefficiente con il parametro: si raccoglie l'incognita, $ax - 2x = (a - 2)x$.

## Discussione di $ax = b$

| Caso | L'equazione è | Soluzioni |
|---|---|---|
| $a \neq 0$ | determinata | $S = \left\{\dfrac{b}{a}\right\}$ |
| $a = 0$ e $b \neq 0$ | impossibile | $S = \emptyset$ |
| $a = 0$ e $b = 0$ | indeterminata | $S = \mathbb{R}$ |

1. Porta l'equazione alla forma normale $ax = b$.
2. Scomponi in fattori $a$ e, se si può, $b$.
3. Trova i valori del parametro che annullano $a$.
4. Per gli altri valori dividi per $a$ e semplifica.
5. Sostituisci ogni valore che annulla $a$ nella forma normale: $0x = b$.
6. Scrivi la risposta caso per caso.

$$
\begin{gathered}
(a - 2)x = (a - 2)(a + 2) \\[6pt]
a \neq 2: \ S = \{a + 2\} \\
a = 2: \ 0x = 0, \ S = \mathbb{R}
\end{gathered}
$$

Parametro al denominatore, come in $\dfrac{x}{a} = 3$: la condizione $a \neq 0$ si scrive prima di cominciare.

## Formule inverse

Si ricava una lettera trattando le altre come parametri; le misure sono positive, quindi si divide senza discutere lo zero.

$$
\begin{gathered}
v = \frac{s}{t} \\[6pt]
\Rightarrow s = vt, \quad t = \frac{s}{v}
\end{gathered}
$$

$$
\begin{gathered}
A = \frac{(B + b)h}{2} \\[6pt]
\Rightarrow h = \frac{2A}{B + b} \\[6pt]
\Rightarrow B = \frac{2A}{h} - b
\end{gathered}
$$

$$s = s_0 + vt \ \Rightarrow \ t = \frac{s - s_0}{v}$$

## Equazioni letterali fratte

C.E. sull'incognita, poi si risolve l'equazione intera; la soluzione è accettabile solo per i valori del parametro che rispettano le C.E.

$$
\begin{gathered}
\frac{a}{x - 1} = 2, \quad \text{C.E.: } x \neq 1 \\[6pt]
x = \frac{a + 2}{2} \ \text{ se } a \neq 0
\end{gathered}
$$

Se $a = 0$ l'equazione è impossibile.

```ad-warning
Dividere per il parametro senza discutere
Da $ax = 3$ la soluzione $x = \dfrac{3}{a}$ vale solo per $a \neq 0$; per $a = 0$ l'equazione è impossibile.
```

```ad-warning
Sostituire nella soluzione
I valori che annullano il coefficiente si sostituiscono nella forma normale, non in $x = \dfrac{b}{a}$.
```

```ad-warning
Dividere solo un pezzo
Da $2A = (B + b)h$ si ottiene $h = \dfrac{2A}{B + b}$, non $h = \dfrac{2A}{B} + b$.
```
