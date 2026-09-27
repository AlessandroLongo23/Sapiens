# Formulario: Radicali e loro proprietà

## Radice n-esima

- Radice quadrata, per $a \ge 0$: il numero $b \ge 0$ con $b^2 = a$. $\sqrt{49} = 7$, non $\pm 7$.
- Radice $n$-esima, per $n \ge 2$ e $a \ge 0$: il numero $b \ge 0$ con $b^n = a$.

$$\sqrt[n]{a} = b \quad \text{se } b \ge 0,\ b^n = a$$

- $n$ è l'indice, $a$ il radicando. Radicale aritmetico: radicando $\ge 0$.
- Per $a \ge 0$:

$$
\begin{gathered}
\left(\sqrt[n]{a}\right)^n = a \\
\sqrt[n]{a^n} = a
\end{gathered}
$$

## Indice pari e indice dispari

| Radicando | Indice pari | Indice dispari |
|---|---|---|
| positivo | esiste, positivo | esiste, positivo |
| zero | $0$ | $0$ |
| negativo | non esiste in $\mathbb{R}$ | esiste, negativo |

Con $n$ dispari il segno meno esce dalla radice:

$$\sqrt[n]{-a} = -\sqrt[n]{a}$$

$\sqrt[3]{-8} = -2$, $\sqrt[5]{-32} = -2$.

## Condizioni di esistenza

- Indice pari: radicando $\ge 0$. $\sqrt{x - 3}$ ha C.E.: $x \ge 3$.
- Indice dispari: solo i denominatori diversi da zero. $\sqrt[3]{x - 3}$ esiste per ogni $x$.
- Incognita al denominatore con indice pari: i valori che annullano il denominatore sono esclusi. $\sqrt{\dfrac{2}{x - 1}}$ ha C.E.: $x > 1$.

## La radice di un quadrato

$$\sqrt{x^2} = |x|$$

$$
\begin{gathered}
\sqrt[n]{x^n} = |x| \quad \text{con } n \text{ pari} \\
\sqrt[n]{x^n} = x \quad \text{con } n \text{ dispari}
\end{gathered}
$$

$\sqrt{(x - 3)^2} = |x - 3|$, $\sqrt[3]{(x - 3)^3} = x - 3$.

## Proprietà invariantiva e semplificazione

Per $a \ge 0$ e $p \ge 1$ naturale:

$$\sqrt[n]{a^m} = \sqrt[n \cdot p]{a^{m \cdot p}}$$

$\sqrt{2} = \sqrt[4]{4} = \sqrt[6]{8}$.

Semplificare: scomponi il radicando e dividi l'indice e tutti gli esponenti per il loro MCD.

$$\sqrt[10]{2^4 \cdot 3^6} = \sqrt[5]{2^2 \cdot 3^3}$$

Irriducibile: MCD tra indice ed esponenti uguale a $1$, come $\sqrt[6]{2^2 \cdot 3}$.

Con le lettere: indice di partenza pari ed esponente finale dispari, valore assoluto.

$$
\begin{gathered}
\sqrt[6]{x^2} = \sqrt[3]{|x|} \\
\sqrt[6]{a^4} = \sqrt[3]{a^2}
\end{gathered}
$$

## Riduzione allo stesso indice

1. Radicali aritmetici: C.E. con le lettere, segno meno fuori con l'indice dispari.
2. Semplifica i radicali.
3. Nuovo indice: il MCM degli indici.
4. Moltiplica l'esponente del radicando per MCM $:$ indice.

$$
\begin{gathered}
\sqrt{2} = \sqrt[12]{2^6} \\
\sqrt[3]{3} = \sqrt[12]{3^4} \\
\sqrt[4]{5} = \sqrt[12]{5^3}
\end{gathered}
$$

## Confronto

Per $a, b \ge 0$, con lo stesso indice:

$$a < b \ \Longleftrightarrow \ \sqrt[n]{a} < \sqrt[n]{b}$$

Con indici diversi, prima allo stesso indice: $\sqrt{3} = \sqrt[6]{27} > \sqrt[6]{25} = \sqrt[3]{5}$.

Tra radicali negativi l'ordine si rovescia: $\sqrt[3]{3} > \sqrt{2}$, quindi $-\sqrt[3]{3} < -\sqrt{2}$.

```ad-warning
La radice di x² non è x
$\sqrt{x^2} = |x|$: per $x = -5$ vale $5$, non $-5$.
```

```ad-warning
Proprietà invariantiva con radicando negativo
$\sqrt[3]{-2} \neq \sqrt[6]{4}$: prima il segno fuori, $\sqrt[3]{-2} = -\sqrt[6]{4}$.
```

```ad-warning
Confrontare i radicandi con indici diversi
$5 > 3$ ma $\sqrt[3]{5} < \sqrt{3}$: porta prima allo stesso indice.
```
