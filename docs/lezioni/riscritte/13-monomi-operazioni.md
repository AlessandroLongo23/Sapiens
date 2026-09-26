# Operazioni tra monomi

Con i monomi si fanno le stesse operazioni dei numeri: somma, sottrazione, prodotto, divisione e potenza. Le regole vengono tutte dalle proprietà delle potenze, ma le operazioni non danno sempre un monomio: il prodotto di due monomi è sempre un monomio, la somma lo è solo se i monomi sono simili, il quoziente solo a certe condizioni.

In tutta la lezione i monomi sono in forma normale, cioè con il coefficiente davanti e ogni lettera scritta una volta sola (se ti serve un ripasso, c'è la lezione sui [monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/monomi)).

## Monomi simili, uguali e opposti

Due monomi sono **simili** se hanno la stessa parte letterale, cioè le stesse lettere con gli stessi esponenti. Il coefficiente può essere diverso.

- $3x^2y$ e $-\frac{1}{2}x^2y$ sono simili.
- $5ab^2$ e $5a^2b$ non sono simili: le lettere sono le stesse, ma gli esponenti no.
- $4$ e $-\frac{2}{3}$ sono simili: nessuno dei due ha lettere.

Due monomi sono **uguali** se sono simili e hanno anche lo stesso coefficiente, come $\frac{3}{4}ab$ e $\frac{3}{4}ab$. Sono **opposti** se sono simili e hanno coefficienti opposti, come $-2x^3$ e $2x^3$: la loro somma è $0$.

## Somma algebrica

La somma e la sottrazione tra monomi si trattano insieme come **somma algebrica**, perché sottrarre un monomio vuol dire sommare il suo opposto: $3x - (-2x) = 3x + 2x = 5x$.

La somma algebrica di monomi simili è un monomio simile a quelli di partenza, che ha per coefficiente la somma algebrica dei coefficienti:

$$3x^2y - 5x^2y = (3 - 5)\,x^2y = -2x^2y$$

La parte letterale resta quella che era: gli esponenti non si sommano.

```ad-example
Esempio 1: coefficienti frazionari
$$
\begin{aligned}
\frac{2}{3}a^2b - \frac{3}{4}a^2b &= \left(\frac{2}{3} - \frac{3}{4}\right)a^2b \\
&= \left(\frac{8}{12} - \frac{9}{12}\right)a^2b \\
&= -\frac{1}{12}a^2b
\end{aligned}
$$
```

```ad-example
Esempio 2: monomi opposti
$$-5xy^2 + 5xy^2 = (-5 + 5)\,xy^2 = 0$$

Il risultato è il monomio nullo.
```

```ad-warning
Sommare gli esponenti in una somma
$x^2 + x^2 = 2x^2$, non $x^4$. Nella somma cambia solo il coefficiente; gli esponenti si sommano nel prodotto: $x^2 \cdot x^2 = x^4$.
```

Se i monomi non sono simili, la somma non si può ridurre a un solo monomio e resta indicata: il risultato è un [polinomio](/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio). Quando in una somma ci sono monomi simili e non simili, riduci solo quelli simili tra loro.

```ad-example
Esempio 3: una somma con monomi non simili
$$
\begin{aligned}
4ab - 3a + ab &= (4 + 1)\,ab - 3a \\
&= 5ab - 3a
\end{aligned}
$$

$ab$ e $a$ non sono simili, quindi $5ab - 3a$ è il risultato finale.
```

```ad-warning
Ridurre monomi non simili
$3x + 2y$ non è $5xy$, e $2x^2 + 3x$ non è $5x^2$ né $5x^3$: sono somme di monomi non simili e restano così.
```

## Prodotto

Il prodotto di due o più monomi è sempre un monomio. Moltiplichi i coefficienti tra loro, con la regola dei segni, e per ogni lettera sommi gli esponenti, perché $x^m \cdot x^n = x^{m+n}$. Le lettere che compaiono in un solo fattore passano al risultato così come sono.

$$
\begin{aligned}
&(2x^3y)\cdot(-4xy^2) \\
&= (2 \cdot (-4))\,x^{3+1}y^{1+2} \\
&= -8x^4y^3
\end{aligned}
$$

```ad-example
Esempio 4: coefficienti frazionari
$$
\begin{aligned}
&\left(-\frac{3}{5}ab^2\right)\cdot\left(\frac{10}{3}a^2b\right) \\
&= \left(-\frac{3}{5}\cdot\frac{10}{3}\right)a^{1+2}b^{2+1} \\
&= -2a^3b^3
\end{aligned}
$$

Prima di moltiplicare, semplifica in croce: il $3$ con il $3$, il $5$ con il $10$.
```

```ad-example
Esempio 5: tre fattori e due segni meno
$$
\begin{aligned}
&(-2x^2)\cdot\left(-\frac{1}{4}xy\right)\cdot(3y^3) \\
&= \left((-2)\cdot\left(-\frac{1}{4}\right)\cdot 3\right)x^{2+1}y^{1+3} \\
&= \frac{3}{2}x^3y^4
\end{aligned}
$$

I segni meno sono due, quindi il coefficiente è positivo.
```

```ad-warning
Moltiplicare gli esponenti in un prodotto
$x^2 \cdot x^3 = x^5$, non $x^6$. Gli esponenti si moltiplicano solo nella potenza: $(x^2)^3 = x^6$.
```

## Quoziente

Dividere il monomio $A$ per il monomio $B$ vuol dire cercare il monomio che, moltiplicato per $B$, dà $A$. Per prima cosa il divisore $B$ deve essere diverso da zero, perché per zero non si divide. Il quoziente poi è un monomio solo se ogni lettera del divisore compare anche nel dividendo, con un esponente maggiore o uguale. In questo caso si dice che $A$ è **divisibile** per $B$.

Quando la divisione si può fare, dividi i coefficienti e per ogni lettera sottrai gli esponenti, perché $x^m : x^n = x^{m-n}$. Una lettera con lo stesso esponente nel dividendo e nel divisore sparisce, perché $x^n : x^n = x^0 = 1$.

```ad-example
Esempio 6: coefficienti frazionari
$$
\begin{aligned}
&\left(-\frac{9}{4}x^5y^2\right) : \left(\frac{3}{2}x^2y\right) \\
&= \left(-\frac{9}{4}\cdot\frac{2}{3}\right)x^{5-2}y^{2-1} \\
&= -\frac{3}{2}x^3y
\end{aligned}
$$

Dividere per $\frac{3}{2}$ equivale a moltiplicare per il reciproco $\frac{2}{3}$.
```

```ad-example
Esempio 7: una lettera che sparisce
$$
\begin{aligned}
&(12a^3b^2) : (-4a^3b) \\
&= (12 : (-4))\,a^{3-3}b^{2-1} \\
&= -3b
\end{aligned}
$$

$a^0 = 1$, quindi nel risultato la $a$ non compare più.
```

```ad-warning
Scrivere 0 al posto di 1
$a^3 : a^3 = a^0 = 1$, non $0$. Per questo $(6a^3b) : (2a^3) = 3b$: la $a$ sparisce, ma il coefficiente non diventa zero.
```

```ad-example
Esempio 8: un quoziente che non è un monomio
$$(10x^2y) : (5xy^3) = \frac{10x^2y}{5xy^3} = \frac{2x}{y^2}$$

Nel divisore la $y$ ha esponente $3$, nel dividendo solo $1$: il risultato è una frazione con una lettera al denominatore, non un monomio. Lo stesso succede con $(8x^2) : (2y)$, perché nel dividendo la $y$ non c'è.
```

## Potenza

Per elevare a potenza un monomio elevi il coefficiente e moltiplichi ogni esponente per l'esponente della potenza, perché $(x^m)^n = x^{m \cdot n}$. Con un coefficiente negativo il segno del risultato dipende dall'esponente: pari dà un risultato positivo, dispari negativo.

```ad-example
Esempio 9: esponente dispari e coefficiente frazionario
$$
\begin{aligned}
\left(-\frac{2}{3}a^2b\right)^3 &= \left(-\frac{2}{3}\right)^3 a^{2\cdot 3}b^{1\cdot 3} \\
&= -\frac{8}{27}a^6b^3
\end{aligned}
$$
```

## Le quattro regole a confronto

| Operazione | Coefficienti | Esponenti di ogni lettera | Il risultato è un monomio? |
|---|---|---|---|
| Somma algebrica | si sommano | restano uguali | solo se i monomi sono simili |
| Prodotto | si moltiplicano | si sommano | sempre |
| Quoziente | si dividono | si sottraggono | se il divisore non è $0$ e nessun esponente diventa negativo |
| Potenza | si elevano a potenza | si moltiplicano per l'esponente | sempre |
