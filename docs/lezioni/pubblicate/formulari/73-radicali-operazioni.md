# Formulario: Operazioni con i radicali

Le lettere sotto radice rappresentano numeri positivi.

## Prodotto e quoziente

Stesso indice, con $a \geq 0$ e $b \geq 0$ (per il quoziente $b > 0$):

$$
\begin{gathered}
\sqrt[n]{a} \cdot \sqrt[n]{b} = \sqrt[n]{a \cdot b} \\
\sqrt[n]{a} : \sqrt[n]{b} = \sqrt[n]{a : b}
\end{gathered}
$$

- Coefficienti con coefficienti, radicali con radicali: $2\sqrt{3} \cdot 5\sqrt{2} = 10\sqrt{6}$.
- Indici diversi: prima si riduce all'indice comune, il mcm degli indici.

$$
\begin{aligned}
\sqrt{2} \cdot \sqrt[3]{2} &= \sqrt[6]{8} \cdot \sqrt[6]{4} \\
&= \sqrt[6]{32}
\end{aligned}
$$

## Trasporto fuori e dentro

Fuori dal segno di radice, per ridurre il risultato:

$$\sqrt[n]{a^n \cdot b} = a\sqrt[n]{b}$$

1. Scomponi il radicando in potenze di fattori primi.
2. Dividi ogni esponente per l'indice.
3. Il quoziente è l'esponente fuori, il resto l'esponente dentro.

$$
\begin{gathered}
\sqrt{72} = \sqrt{2^3 \cdot 3^2} = 6\sqrt{2} \\
\sqrt[3]{16x^7} = 2x^2\sqrt[3]{2x}
\end{gathered}
$$

Dentro il segno di radice, per un fattore positivo:

$$a\sqrt[n]{b} = \sqrt[n]{a^n \cdot b}$$

Per esempio $2\sqrt{3} = \sqrt{12}$; un segno meno resta fuori: $-2\sqrt{3} = -\sqrt{12}$.

Con lettere di segno qualsiasi e indice pari, il fattore che esce va in valore assoluto: $\sqrt{a^2b} = |a|\sqrt{b}$.

## Potenza e radice di un radicale

$$
\begin{gathered}
\left(\sqrt[n]{a}\right)^m = \sqrt[n]{a^m} \\
\sqrt[m]{\sqrt[n]{a}} = \sqrt[m \cdot n]{a}
\end{gathered}
$$

$\left(\sqrt{5}\right)^2 = 5$, $\left(2\sqrt{3}\right)^2 = 12$, $\sqrt{\sqrt[3]{5}} = \sqrt[6]{5}$.

## Radicali simili e somma algebrica

Simili: stesso indice e stesso radicando. Si sommano i coefficienti:

$$3\sqrt{2} + 5\sqrt{2} = 8\sqrt{2}$$

Prima si porta fuori tutto quello che si può:

$$
\begin{aligned}
&\sqrt{50} - \sqrt{18} + \sqrt{8} \\
&= 5\sqrt{2} - 3\sqrt{2} + 2\sqrt{2} = 4\sqrt{2}
\end{aligned}
$$

## Prodotti notevoli

$$
\begin{gathered}
\left(\sqrt{a} + \sqrt{b}\right)^2 = a + 2\sqrt{ab} + b \\
\left(\sqrt{a} + \sqrt{b}\right)\left(\sqrt{a} - \sqrt{b}\right) = a - b
\end{gathered}
$$

$\left(\sqrt{5} - \sqrt{3}\right)^2 = 8 - 2\sqrt{15}$, $\left(\sqrt{7} + \sqrt{2}\right)\left(\sqrt{7} - \sqrt{2}\right) = 5$.

```ad-warning
La radice di una somma
$\sqrt{9 + 16} = 5$, non $3 + 4$; e $\sqrt{2} + \sqrt{3}$ non è $\sqrt{5}$.
```

```ad-warning
Indici diversi
$\sqrt{2} \cdot \sqrt[3]{2}$ non è $\sqrt[6]{4}$: prima si riduce allo stesso indice.
```

```ad-warning
Il doppio prodotto
$\left(\sqrt{5} - \sqrt{3}\right)^2$ non è $5 - 3$: è $8 - 2\sqrt{15}$.
```
