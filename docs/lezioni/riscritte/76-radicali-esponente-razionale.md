# Potenze con esponente razionale

Un radicale si può scrivere come una potenza con l'esponente frazionario: $\sqrt{5} = 5^{\frac{1}{2}}$ e $\sqrt[3]{7^2} = 7^{\frac{2}{3}}$. Con questa scrittura i conti sui radicali diventano conti sulle potenze, e per le potenze valgono le proprietà che conosci dalla lezione [Potenze in ℚ](/materiale/scuola-superiore/matematica/numeri-razionali/potenze-in-q): un prodotto come $\sqrt{2} \cdot \sqrt[3]{2}$ si fa sommando due frazioni, $\frac{1}{2} + \frac{1}{3} = \frac{5}{6}$.

## Da dove viene la definizione

Finora l'esponente era un numero intero. Per dare un significato a $5^{\frac{1}{2}}$ si chiede che la proprietà della potenza di potenza continui a valere. Se vale, elevando al quadrato si ottiene

$$\left(5^{\frac{1}{2}}\right)^2 = 5^{\frac{1}{2} \cdot 2} = 5^1 = 5$$

quindi $5^{\frac{1}{2}}$ deve essere un numero positivo che elevato al quadrato dà $5$, cioè $\sqrt{5}$. Allo stesso modo $\left(7^{\frac{2}{3}}\right)^3 = 7^2$, quindi $7^{\frac{2}{3}}$ deve essere $\sqrt[3]{7^2}$.

## La definizione

Sia $a$ un numero reale positivo, $m$ un numero intero e $n$ un numero naturale maggiore di $1$. La **potenza con esponente razionale** $a^{\frac{m}{n}}$ è il radicale che ha per indice il denominatore $n$ e per radicando $a^m$:

$$a^{\frac{m}{n}} = \sqrt[n]{a^m} \qquad (a > 0)$$

Il denominatore dell'esponente diventa l'indice della radice, il numeratore diventa l'esponente del radicando. Si può anche fare prima la radice e poi la potenza, perché $\sqrt[n]{a^m} = \left(\sqrt[n]{a}\right)^m$: il risultato è lo stesso, e con i numeri conviene quasi sempre, perché i conti restano piccoli.

```ad-example
Esempio: dalla potenza al numero
$9^{\frac{1}{2}} = \sqrt{9} = 3$

$8^{\frac{2}{3}} = \left(\sqrt[3]{8}\right)^2 = 2^2 = 4$

$16^{\frac{3}{4}} = \left(\sqrt[4]{16}\right)^3 = 2^3 = 8$

Con l'ordine opposto, $8^{\frac{2}{3}} = \sqrt[3]{8^2} = \sqrt[3]{64} = 4$: stesso risultato, con un numero più grande sotto radice.
```

Quando l'esponente è negativo vale la regola degli esponenti interi negativi: la potenza è il reciproco della potenza con l'esponente opposto.

$$a^{-\frac{m}{n}} = \frac{1}{a^{\frac{m}{n}}} \qquad (a > 0)$$

Per esempio $8^{-\frac{2}{3}} = \dfrac{1}{8^{\frac{2}{3}}} = \dfrac{1}{4}$. Come con gli esponenti interi, l'esponente negativo non rende negativo il risultato: con la base positiva, una potenza con esponente razionale è sempre positiva.

```ad-note
La base zero
Alcuni libri ammettono anche la base $0$ quando l'esponente è positivo, e pongono $0^{\frac{m}{n}} = 0$. Con esponente zero o negativo, invece, $0^{\frac{m}{n}}$ non ha significato, come $0^0$ e $0^{-n}$.
```

## Perché la base deve essere positiva

Lo stesso numero razionale si scrive con infinite frazioni equivalenti: $\frac{1}{3} = \frac{2}{6} = \frac{3}{9}$. Una potenza con esponente razionale ha senso solo se il risultato non dipende dalla frazione che si sceglie. Con una base negativa questo non succede. Prendi $-8$ e i due esponenti $\frac{1}{3}$ e $\frac{2}{6}$, che sono lo stesso numero:

$$
\begin{aligned}
(-8)^{\frac{1}{3}} &= \sqrt[3]{-8} = -2 \\
(-8)^{\frac{2}{6}} &= \sqrt[6]{(-8)^2} \\
&= \sqrt[6]{64} = 2
\end{aligned}
$$

Lo stesso esponente darebbe due risultati diversi. Per questo la definizione chiede $a > 0$, e scritture come $(-8)^{\frac{1}{3}}$ non hanno significato.

Con la base positiva il problema non c'è: frazioni equivalenti danno lo stesso radicale grazie alla proprietà invariantiva, che trovi nella lezione [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta). Per esempio $4^{\frac{2}{4}} = \sqrt[4]{4^2} = \sqrt[4]{16} = 2$, proprio come $4^{\frac{1}{2}} = \sqrt{4} = 2$.

```ad-warning
Il radicale con radicando negativo non diventa una potenza
$\sqrt[3]{-8} = -2$ ha significato, perché l'indice è dispari; $(-8)^{\frac{1}{3}}$ no. Per scrivere come potenza un radicale di indice dispari con radicando negativo, porta prima fuori il segno meno: $\sqrt[3]{-8} = -\sqrt[3]{8} = -8^{\frac{1}{3}}$. In $-8^{\frac{1}{3}}$ la base è $8$ e il meno resta davanti, come in $-2^2$.
```

## Le proprietà delle potenze

Con basi positive, le proprietà delle potenze valgono anche quando gli esponenti sono razionali. Qui $a$ e $b$ sono positivi, $r$ e $s$ sono numeri razionali qualunque.

| Proprietà | Formula | Esempio |
|---|---|---|
| Prodotto, stessa base | $a^r \cdot a^s = a^{r+s}$ | $2^{\frac{1}{2}} \cdot 2^{\frac{1}{3}} = 2^{\frac{5}{6}}$ |
| Quoziente, stessa base | $a^r : a^s = a^{r-s}$ | $3^{\frac{5}{4}} : 3^{\frac{1}{4}} = 3$ |
| Potenza di potenza | $\left(a^r\right)^s = a^{r \cdot s}$ | $\left(5^{\frac{2}{3}}\right)^{\frac{3}{2}} = 5$ |
| Prodotto, stesso esponente | $a^r \cdot b^r = (a \cdot b)^r$ | $2^{\frac{1}{3}} \cdot 4^{\frac{1}{3}} = 8^{\frac{1}{3}}$ |
| Quoziente, stesso esponente | $a^r : b^r = (a : b)^r$ | $18^{\frac{1}{2}} : 2^{\frac{1}{2}} = 9^{\frac{1}{2}}$ |

Nell'esempio del prodotto $\frac{1}{2} + \frac{1}{3} = \frac{5}{6}$; nel quarto $8^{\frac{1}{3}} = \sqrt[3]{8} = 2$, nel quinto $9^{\frac{1}{2}} = 3$. I conti sugli esponenti sono conti tra frazioni, con le regole della lezione [Operazioni in ℚ](/materiale/scuola-superiore/matematica/numeri-razionali/operazioni-in-q).

```ad-warning
Le proprietà chiedono basi positive
$\left[(-2)^2\right]^{\frac{1}{2}} = 4^{\frac{1}{2}} = 2$, mentre moltiplicando gli esponenti si otterrebbe $(-2)^1 = -2$. La proprietà della potenza di potenza non si applica, perché la base $-2$ è negativa. È lo stesso motivo per cui $\sqrt{x^2} = |x|$ e non $x$.
```

```ad-warning
Niente proprietà per la somma
$(9 + 16)^{\frac{1}{2}} = 25^{\frac{1}{2}} = 5$, mentre $9^{\frac{1}{2}} + 16^{\frac{1}{2}} = 3 + 4 = 7$. L'esponente non si distribuisce sugli addendi, come $\sqrt{9 + 16}$ non è $\sqrt{9} + \sqrt{16}$.
```

## Da radicali a potenze e ritorno

Le potenze servono soprattutto a fare i conti tra radicali con indici diversi, o annidati uno dentro l'altro. Il procedimento è sempre lo stesso:

1. Scrivi ogni radicale come potenza, con $\sqrt[n]{a^m} = a^{\frac{m}{n}}$; se i radicandi sono numeri diversi, scrivili come potenze della stessa base quando si può ($4 = 2^2$, $27 = 3^3$).
2. Applica le proprietà delle potenze: gli esponenti si sommano, si sottraggono o si moltiplicano come frazioni.
3. Riscrivi il risultato come radicale, con $a^{\frac{m}{n}} = \sqrt[n]{a^m}$. Se l'esponente è maggiore di $1$, separa prima la parte intera: $a^{\frac{7}{6}} = a^{1 + \frac{1}{6}} = a \cdot \sqrt[6]{a}$.

Il risultato si semplifica sempre e, se ha un radicale al denominatore, si razionalizza, come nella lezione [Razionalizzazione](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/razionalizzazione).

In tutti gli esempi con le lettere, le lettere indicano numeri positivi: è la condizione della definizione, e con le basi positive le proprietà valgono senza eccezioni.

## Esempi svolti

```ad-example
Esempio 1: calcolare potenze con esponente frazionario
Calcola $27^{\frac{2}{3}}$, $16^{-\frac{3}{4}}$ e $\left(\dfrac{4}{9}\right)^{-\frac{1}{2}}$.

Prima la radice, poi la potenza: $27^{\frac{2}{3}} = \left(\sqrt[3]{27}\right)^2 = 3^2 = 9$.

Con l'esponente negativo si prende il reciproco:

$$
\begin{aligned}
16^{-\frac{3}{4}} &= \frac{1}{16^{\frac{3}{4}}} = \frac{1}{\left(\sqrt[4]{16}\right)^3} \\
&= \frac{1}{2^3} = \frac{1}{8}
\end{aligned}
$$

Con una frazione per base, il reciproco scambia numeratore e denominatore:

$$
\begin{aligned}
\left(\frac{4}{9}\right)^{-\frac{1}{2}} &= \left(\frac{9}{4}\right)^{\frac{1}{2}} \\
&= \sqrt{\frac{9}{4}} = \frac{3}{2}
\end{aligned}
$$
```

```ad-example
Esempio 2: esponente decimale
Calcola $32^{0{,}4}$ e $2^{-0{,}5}$.

Un esponente decimale limitato si scrive prima come frazione, come nella lezione [Numeri decimali e frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/numeri-decimali-e-frazioni): $0{,}4 = \dfrac{4}{10} = \dfrac{2}{5}$. Poi

$$32^{\frac{2}{5}} = \left(\sqrt[5]{32}\right)^2 = 2^2 = 4$$

Allo stesso modo $-0{,}5 = -\dfrac{1}{2}$, e il risultato ha un radicale al denominatore, che si razionalizza:

$$
\begin{aligned}
2^{-\frac{1}{2}} &= \frac{1}{\sqrt{2}} \\
&= \frac{\sqrt{2}}{2}
\end{aligned}
$$
```

```ad-example
Esempio 3: radicali con indici diversi
Scrivi come un solo radicale $\sqrt{2} \cdot \sqrt[3]{2}$ e $\sqrt[3]{4} : \sqrt{2}$.

Nel primo prodotto la base è la stessa, quindi si sommano gli esponenti, $\frac{1}{2} + \frac{1}{3} = \frac{3}{6} + \frac{2}{6} = \frac{5}{6}$:

$$\sqrt{2} \cdot \sqrt[3]{2} = 2^{\frac{5}{6}} = \sqrt[6]{2^5} = \sqrt[6]{32}$$

Nel quoziente scrivi prima $4 = 2^2$, così anche qui la base è $2$, e poi sottrai gli esponenti, $\frac{2}{3} - \frac{1}{2} = \frac{4}{6} - \frac{3}{6} = \frac{1}{6}$:

$$
\begin{aligned}
\sqrt[3]{4} : \sqrt{2} &= 2^{\frac{2}{3}} : 2^{\frac{1}{2}} \\
&= 2^{\frac{1}{6}} = \sqrt[6]{2}
\end{aligned}
$$
```

```ad-example
Esempio 4: lettere ed esponente maggiore di 1
Scrivi come un solo radicale $\sqrt{a} \cdot \sqrt[3]{a^2} \cdot \sqrt[4]{a}$, con $a > 0$.

Gli esponenti sono $\frac{1}{2}$, $\frac{2}{3}$ e $\frac{1}{4}$, con denominatore comune $12$:

$$\frac{6}{12} + \frac{8}{12} + \frac{3}{12} = \frac{17}{12}$$

L'esponente è maggiore di $1$: separa la parte intera, $\frac{17}{12} = 1 + \frac{5}{12}$.

$$
\begin{aligned}
a^{\frac{17}{12}} &= a^1 \cdot a^{\frac{5}{12}} \\
&= a \sqrt[12]{a^5}
\end{aligned}
$$
```

```ad-example
Esempio 5: radicali annidati
Scrivi come un solo radicale $\sqrt{a \sqrt[3]{a}}$, con $a > 0$, e calcola $\sqrt[3]{2\sqrt{2}}$.

Dentro la radice quadrata c'è $a \cdot a^{\frac{1}{3}} = a^{1 + \frac{1}{3}} = a^{\frac{4}{3}}$. La radice quadrata è l'esponente $\frac{1}{2}$, e si applica la potenza di potenza:

$$
\begin{aligned}
\sqrt{a \sqrt[3]{a}} &= \left(a^{\frac{4}{3}}\right)^{\frac{1}{2}} \\
&= a^{\frac{2}{3}} = \sqrt[3]{a^2}
\end{aligned}
$$

Nel secondo, $2\sqrt{2} = 2^1 \cdot 2^{\frac{1}{2}} = 2^{\frac{3}{2}}$, quindi

$$
\begin{aligned}
\sqrt[3]{2\sqrt{2}} &= \left(2^{\frac{3}{2}}\right)^{\frac{1}{3}} \\
&= 2^{\frac{1}{2}} = \sqrt{2}
\end{aligned}
$$
```

```ad-example
Esempio 6: tutto nella stessa base
Calcola $8^{\frac{2}{3}} \cdot 4^{-\frac{1}{2}} : 16^{\frac{3}{4}}$.

Le tre basi sono potenze di $2$: $8 = 2^3$, $4 = 2^2$, $16 = 2^4$. Con la potenza di potenza:

$$
\begin{gathered}
8^{\frac{2}{3}} = \left(2^3\right)^{\frac{2}{3}} = 2^2 \\
4^{-\frac{1}{2}} = \left(2^2\right)^{-\frac{1}{2}} = 2^{-1} \\
16^{\frac{3}{4}} = \left(2^4\right)^{\frac{3}{4}} = 2^3
\end{gathered}
$$

Quindi l'espressione vale $2^{2 - 1 - 3} = 2^{-2} = \dfrac{1}{4}$. Controllo con i singoli valori: $4 \cdot \dfrac{1}{2} : 8 = \dfrac{1}{4}$.
```

```ad-example
Esempio 7: un radicando negativo
Scrivi come un solo radicale $\sqrt[3]{-4} \cdot \sqrt[6]{2}$.

La base $-4$ non si può mettere sotto un esponente frazionario. L'indice $3$ è dispari, quindi porta fuori il segno: $\sqrt[3]{-4} = -\sqrt[3]{4} = -2^{\frac{2}{3}}$. Ora

$$
\begin{aligned}
-2^{\frac{2}{3}} \cdot 2^{\frac{1}{6}} &= -2^{\frac{4}{6} + \frac{1}{6}} \\
&= -2^{\frac{5}{6}} = -\sqrt[6]{32}
\end{aligned}
$$

Il risultato è negativo, come deve essere: un numero negativo per uno positivo.
```

```ad-warning
Sommare o moltiplicare gli esponenti sbagliati
Nel prodotto $\sqrt{2} \cdot \sqrt[3]{2}$ gli esponenti si sommano: $2^{\frac{5}{6}}$, non $2^{\frac{1}{6}}$ (il prodotto degli esponenti) e nemmeno $2^{\frac{2}{5}}$ (numeratori e denominatori sommati tra loro). Gli esponenti si moltiplicano solo nella potenza di potenza, cioè nei radicali annidati.
```

```ad-warning
Numeratore e denominatore scambiati
$8^{\frac{2}{3}}$ è $\sqrt[3]{8^2} = 4$, non $\sqrt{8^3} = \sqrt{512}$. Il denominatore dell'esponente è l'indice della radice.
```

## Verso gli esponenti reali

Con le potenze a esponente razionale ha significato $a^r$ per ogni $r$ razionale, con $a > 0$. Resta fuori un esponente irrazionale come $\sqrt{2}$: il numero $2^{\sqrt{2}}$ si definisce avvicinandosi a $\sqrt{2}$ con esponenti razionali sempre più vicini ($2^{1{,}4}$, $2^{1{,}41}$, $2^{1{,}414}$, …), che si calcolano con i radicali di questa lezione. È il punto di partenza della funzione esponenziale, che si studia al terzo anno; anche lì la base resta positiva, per lo stesso motivo visto con $(-8)^{\frac{1}{3}}$.
