# Formulario: Potenze con esponente razionale

## Definizione

Con $a > 0$, $m$ intero e $n$ naturale maggiore di $1$: il denominatore diventa l'indice, il numeratore l'esponente del radicando.

$$a^{\frac{m}{n}} = \sqrt[n]{a^m} = \left(\sqrt[n]{a}\right)^m$$

Con i numeri conviene fare prima la radice: $8^{\frac{2}{3}} = \left(\sqrt[3]{8}\right)^2 = 4$.

Esponente negativo, reciproco:

$$a^{-\frac{m}{n}} = \frac{1}{a^{\frac{m}{n}}} \qquad (a > 0)$$

Esempi: $16^{-\frac{3}{4}} = \dfrac{1}{8}$, $\left(\dfrac{4}{9}\right)^{-\frac{1}{2}} = \dfrac{3}{2}$. Esponente decimale: prima in frazione, $32^{0{,}4} = 32^{\frac{2}{5}} = 4$.

## La base deve essere positiva

Con una base negativa, frazioni equivalenti darebbero risultati diversi:

$$
\begin{aligned}
(-8)^{\frac{1}{3}} &= \sqrt[3]{-8} = -2 \\
(-8)^{\frac{2}{6}} &= \sqrt[6]{64} = 2
\end{aligned}
$$

Quindi $(-8)^{\frac{1}{3}}$ non ha significato. Un radicale di indice dispari con radicando negativo si scrive portando fuori il segno: $\sqrt[3]{-8} = -8^{\frac{1}{3}}$.

## Proprietà

Con $a > 0$, $b > 0$ e $r$, $s$ razionali:

| Proprietà | Formula |
|---|---|
| Prodotto, stessa base | $a^r \cdot a^s = a^{r+s}$ |
| Quoziente, stessa base | $a^r : a^s = a^{r-s}$ |
| Potenza di potenza | $\left(a^r\right)^s = a^{r \cdot s}$ |
| Prodotto, stesso esponente | $a^r \cdot b^r = (a \cdot b)^r$ |
| Quoziente, stesso esponente | $a^r : b^r = (a : b)^r$ |

Per la somma non c'è nessuna proprietà.

## Da radicali a potenze e ritorno

1. Scrivi ogni radicale come potenza, se puoi con la stessa base ($4 = 2^2$).
2. Somma, sottrai o moltiplica gli esponenti come frazioni.
3. Torna al radicale; se l'esponente supera $1$, separa la parte intera.
4. Semplifica e razionalizza il risultato.

$$
\begin{gathered}
\sqrt{2} \cdot \sqrt[3]{2} = 2^{\frac{5}{6}} = \sqrt[6]{32} \\
\sqrt{a \sqrt[3]{a}} = a^{\frac{2}{3}} = \sqrt[3]{a^2} \\
a^{\frac{17}{12}} = a \sqrt[12]{a^5}
\end{gathered}
$$

```ad-warning
Numeratore e denominatore scambiati
$8^{\frac{2}{3}} = \sqrt[3]{8^2} = 4$, non $\sqrt{8^3}$: il denominatore è l'indice.
```

```ad-warning
Esponenti sbagliati nel prodotto
$\sqrt{2} \cdot \sqrt[3]{2} = 2^{\frac{1}{2} + \frac{1}{3}} = 2^{\frac{5}{6}}$: si sommano, non si moltiplicano.
```

```ad-warning
Proprietà solo con basi positive
$\left[(-2)^2\right]^{\frac{1}{2}} = 2$, non $(-2)^1 = -2$.
```
