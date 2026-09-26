# Formulario: Regola di Ruffini e teorema del resto

## Divisione per $x - a$

Quoziente $Q(x)$ con un grado in meno di $P(x)$, resto $R$ che è un numero:

$$P(x) = (x - a) \cdot Q(x) + R$$

$a$ è il numero che annulla il divisore: per $x - 3$ è $a = 3$, per $x + 2 = x - (-2)$ è $a = -2$.

## La tabella di Ruffini

1. Ordina il dividendo per potenze decrescenti e scrivi $0$ per ogni potenza che manca.
2. Coefficienti nella prima riga, termine noto separato da una linea; $a$ a sinistra, nella seconda riga.
3. Abbassa il primo coefficiente sotto la linea.
4. Moltiplica per $a$ l'ultimo numero sotto la linea, scrivilo nella colonna successiva e somma. Ripeti fino in fondo.
5. Ultimo numero: il resto. Gli altri: i coefficienti del quoziente.

$(2x^3 - 5x^2 + x + 7) : (x - 3)$:

$$\begin{array}{r|rrr|r} & 2 & -5 & 1 & 7 \\ 3 & & 6 & 3 & 12 \\ \hline & 2 & 1 & 4 & 19 \end{array}$$

$$Q(x) = 2x^2 + x + 4 \qquad R = 19$$

Controllo: $(x - a) \cdot Q(x) + R$ deve ridare il dividendo.

La regola vale solo per divisori $x - a$; per divisori di grado più alto serve la divisione in colonna.

## Divisore $ax - b$

Tabella con $\frac{b}{a}$, poi dividi per $a$ i coefficienti del quoziente; il resto resta quello della tabella.

$$
\begin{gathered}
(4x^3 - 2x^2 + 6x - 1) : (2x - 1) \\
\Rightarrow \qquad Q(x) = 2x^2 + 3, \qquad R = 2
\end{gathered}
$$

## Teorema del resto

Il resto della divisione di $P(x)$ per $x - a$ è

$$R = P(a)$$

Per un divisore $ax - b$ il resto è $P\left(\frac{b}{a}\right)$.

## Teorema di Ruffini

$a$ è uno zero di $P(x)$ se $P(a) = 0$.

$$
\begin{aligned}
&P(x) \text{ è divisibile per } x \\
&\quad - a \iff P(a) \\
&= 0
\end{aligned}
$$

In quel caso $P(x) = (x - a) \cdot Q(x)$. Esempio: $P(2) = 0$ per $x^3 - 7x + 6$, quindi $x^3 - 7x + 6 = (x - 2)(x^2 + 2x - 3)$.

```ad-warning
Termini mancanti
In $x^4 - 5x^2 + 3x - 2$ la prima riga è $1$, $0$, $-5$, $3$, $-2$: senza lo $0$ il risultato è sbagliato.
```

```ad-warning
Il segno di $a$
Per $x + 2$ nella tabella va $-2$, e per sapere se $x + 3$ divide $P(x)$ si calcola $P(-3)$.
```

```ad-warning
Divisore $ax - b$
Si dividono per $a$ i coefficienti del quoziente, non il resto.
```
