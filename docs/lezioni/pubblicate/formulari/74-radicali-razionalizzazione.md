# Formulario: Razionalizzazione

## Che cosa vuol dire razionalizzare

- Razionalizzare il denominatore: scrivere una frazione equivalente senza radicali al denominatore.
- Si moltiplicano numeratore e denominatore per lo stesso numero, il fattore razionalizzante.
- Il risultato va sempre semplificato: radicali semplificati, frazione ridotta.
- Le lettere indicano numeri positivi.

$$
\begin{aligned}
\frac{1}{\sqrt{2}} &= \frac{1}{\sqrt{2}} \cdot \frac{\sqrt{2}}{\sqrt{2}} \\
&= \frac{\sqrt{2}}{2}
\end{aligned}
$$

## Denominatore con una radice quadrata

Fattore razionalizzante: $\sqrt{a}$.

$$\frac{b}{\sqrt{a}} = \frac{b\sqrt{a}}{a}$$

- Esempio: $\dfrac{6}{\sqrt{3}} = \dfrac{6\sqrt{3}}{3} = 2\sqrt{3}$.
- Un numero davanti alla radice resta fuori: $\dfrac{5}{2\sqrt{10}} = \dfrac{5\sqrt{10}}{20} = \dfrac{\sqrt{10}}{4}$.
- Semplifica prima il radicale: $\dfrac{3}{\sqrt{12}} = \dfrac{3}{2\sqrt{3}} = \dfrac{\sqrt{3}}{2}$.

## Denominatore con una radice di indice n

Fattore razionalizzante: $\sqrt[n]{a^{n - m}}$, che completa l'esponente fino all'indice ($a > 0$, $0 < m < n$).

$$\frac{b}{\sqrt[n]{a^m}} = \frac{b\sqrt[n]{a^{n - m}}}{a}$$

- Esempio: $8 = 2^3$, quindi $\dfrac{10}{\sqrt[5]{8}} = \dfrac{10\sqrt[5]{4}}{2} = 5\sqrt[5]{4}$.
- Con più fattori primi si completa ognuno: $\dfrac{6}{\sqrt[3]{12}} = \dfrac{6\sqrt[3]{18}}{6} = \sqrt[3]{18}$.

## Denominatore con un binomio

Fattore razionalizzante: il coniugato, stessi termini con il segno del secondo cambiato. Si usa la somma per differenza.

$$
\begin{gathered}
(\sqrt{a} + \sqrt{b})(\sqrt{a} - \sqrt{b}) = a - b \\
(a + \sqrt{b})(a - \sqrt{b}) = a^2 - b
\end{gathered}
$$

$$
\begin{gathered}
\frac{c}{\sqrt{a} \pm \sqrt{b}} = \frac{c(\sqrt{a} \mp \sqrt{b})}{a - b} \\[1ex]
\frac{c}{a \pm \sqrt{b}} = \frac{c(a \mp \sqrt{b})}{a^2 - b}
\end{gathered}
$$

- Esempio: $\dfrac{4}{\sqrt{5} - 1} = \dfrac{4(\sqrt{5} + 1)}{4} = \sqrt{5} + 1$.
- Denominatore negativo: $\dfrac{3}{2 - \sqrt{7}} = \dfrac{3(2 + \sqrt{7})}{-3} = -2 - \sqrt{7}$.
- Controllo: la frazione di partenza e il risultato danno lo stesso numero con la calcolatrice.

```ad-warning
Moltiplicare solo il denominatore
Il fattore razionalizzante va sopra e sotto: $\dfrac{6}{\sqrt{3}}$ non è $\dfrac{6}{3}$.
```

```ad-warning
Semplificare dentro e fuori dalla radice
$\dfrac{\sqrt{6}}{3}$ non è $\sqrt{2}$: si semplificano solo numeri che stanno entrambi fuori.
```

```ad-warning
Spezzare il denominatore
$\dfrac{1}{\sqrt{2} + \sqrt{3}}$ non è $\dfrac{1}{\sqrt{2}} + \dfrac{1}{\sqrt{3}}$: si usa il coniugato.
```
