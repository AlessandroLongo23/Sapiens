# Relazioni tra soluzioni e coefficienti

L'equazione $x^2 - 5x + 6 = 0$ ha le soluzioni $2$ e $3$. La loro somma è $5$ e il loro prodotto è $6$: gli stessi numeri che compaiono nell'equazione, il primo con il segno cambiato. Non è un caso. In ogni equazione di secondo grado la somma e il prodotto delle soluzioni si leggono sui coefficienti, senza risolverla, e questo permette di controllare un risultato, di scrivere un'equazione che ha le soluzioni che vuoi, di scomporre un trinomio e di sapere il segno delle soluzioni prima di calcolarle.

Ti serve saper risolvere un'equazione con la formula, come nella lezione sulle [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado), e conoscere la scomposizione del [trinomio di secondo grado](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado) con somma e prodotto, che qui funziona anche quando i due numeri non sono interi.

## Somma e prodotto delle soluzioni

Se l'equazione $ax^2 + bx + c = 0$, con $a \neq 0$, ha discriminante $\Delta \geq 0$, le sue soluzioni $x_1$ e $x_2$ hanno

$$
\begin{gathered}
x_1 + x_2 = -\frac{b}{a} \\
x_1 \cdot x_2 = \frac{c}{a}
\end{gathered}
$$

Nel resto della lezione la **somma** delle soluzioni si indica con $s$ e il **prodotto** con $p$: $s = -\dfrac{b}{a}$ e $p = \dfrac{c}{a}$. Con $\Delta = 0$ le due soluzioni coincidono e le formule valgono lo stesso, contando la soluzione doppia due volte: in $x^2 - 6x + 9 = 0$ la soluzione è $3$, e infatti $3 + 3 = 6$ e $3 \cdot 3 = 9$.

Per dimostrarle, parti dalle due soluzioni date dalla formula risolutiva, $\dfrac{-b - \sqrt{\Delta}}{2a}$ e $\dfrac{-b + \sqrt{\Delta}}{2a}$. Sommandole, i due radicali opposti si cancellano:

$$
\begin{aligned}
&x_1 + x_2 \\
&= \frac{-b - \sqrt{\Delta}}{2a} + \frac{-b + \sqrt{\Delta}}{2a} \\
&= \frac{-2b}{2a} = -\frac{b}{a}
\end{aligned}
$$

Nel prodotto i due numeratori sono la somma e la differenza degli stessi termini, $-b$ e $\sqrt{\Delta}$, e danno una differenza di quadrati, come nei [prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli). Poi si sostituisce $\Delta = b^2 - 4ac$:

$$
\begin{aligned}
&x_1 \cdot x_2 \\
&= \frac{(-b - \sqrt{\Delta})(-b + \sqrt{\Delta})}{4a^2} \\
&= \frac{b^2 - \Delta}{4a^2} \\
&= \frac{b^2 - b^2 + 4ac}{4a^2} = \frac{c}{a}
\end{aligned}
$$

```ad-example
Esempio 1: somma e prodotto senza risolvere
Trova somma e prodotto delle soluzioni di $2x^2 - 7x + 3 = 0$.

Prima controlla che le soluzioni esistano: $\Delta = 49 - 24 = 25$, positivo. Con $a = 2$, $b = -7$ e $c = 3$:

$$
\begin{gathered}
s = -\frac{-7}{2} = \frac{7}{2} \\
p = \frac{3}{2}
\end{gathered}
$$

Controllo: con la formula le soluzioni sono $x_1 = \dfrac{1}{2}$ e $x_2 = 3$, e $\dfrac{1}{2} + 3 = \dfrac{7}{2}$, $\dfrac{1}{2} \cdot 3 = \dfrac{3}{2}$.
```

```ad-warning
Il segno della somma
La somma è $-\dfrac{b}{a}$, con il segno cambiato; il prodotto è $\dfrac{c}{a}$, senza cambiare niente. In $2x^2 - 7x + 3 = 0$ la somma è $\dfrac{7}{2}$, non $-\dfrac{7}{2}$.
```

```ad-warning
Somma e prodotto con il discriminante negativo
In $x^2 + x + 1 = 0$ i conti danno $-\dfrac{b}{a} = -1$ e $\dfrac{c}{a} = 1$, ma $\Delta = 1 - 4 = -3$ e l'equazione non ha soluzioni reali: quei due numeri non sono la somma e il prodotto di niente. Prima di usare le formule controlla che $\Delta \geq 0$.
```

Le formule valgono anche quando le soluzioni sono irrazionali, e in quel caso fanno risparmiare parecchi conti.

```ad-example
Esempio 2: soluzioni irrazionali
Trova somma e prodotto delle soluzioni di $x^2 - 4x + 1 = 0$.

$\Delta = 16 - 4 = 12$ è positivo. Qui $a = 1$, quindi $s = 4$ e $p = 1$.

Controllo: le soluzioni sono $2 - \sqrt{3}$ e $2 + \sqrt{3}$. Sommandole i radicali si cancellano e resta $4$; il prodotto è una differenza di quadrati:

$$
\begin{aligned}
&(2 - \sqrt{3})(2 + \sqrt{3}) \\
&= 4 - 3 = 1
\end{aligned}
$$
```

Se conosci una delle due soluzioni, l'altra si ricava dalla somma o dal prodotto, senza usare la formula.

```ad-example
Esempio 3: trovare l'altra soluzione
Il numero $2$ è una soluzione di $3x^2 - 5x - 2 = 0$. Trova l'altra.

Verifica che $2$ sia una soluzione: $3 \cdot 4 - 10 - 2 = 0$. Il prodotto delle soluzioni è $p = -\dfrac{2}{3}$, quindi

$$
\begin{gathered}
2 \cdot x_2 = -\frac{2}{3} \\
\Rightarrow x_2 = -\frac{1}{3}
\end{gathered}
$$

Controllo con la somma: $2 - \dfrac{1}{3} = \dfrac{5}{3}$, che è proprio $-\dfrac{b}{a} = \dfrac{5}{3}$. In ordine crescente, $x_1 = -\dfrac{1}{3}$ e $x_2 = 2$.
```

## Scrivere un'equazione date le soluzioni

Dividi tutti i termini di $ax^2 + bx + c = 0$ per $a$: ottieni $x^2 + \dfrac{b}{a}x + \dfrac{c}{a} = 0$. Il coefficiente di $x$ è l'opposto della somma e il termine noto è il prodotto, quindi l'equazione si può scrivere

$$x^2 - sx + p = 0$$

Letta al contrario, questa forma dà un'equazione che ha due soluzioni scelte da te: se vuoi le soluzioni $x_1$ e $x_2$, calcoli $s = x_1 + x_2$ e $p = x_1 \cdot x_2$ e li metti al loro posto. Le equazioni con quelle soluzioni sono infinite, perché puoi moltiplicare tutti i termini per qualunque numero diverso da zero: di solito si sceglie quella con i coefficienti interi più piccoli.

```ad-example
Esempio 4: soluzioni intere
Scrivi un'equazione di secondo grado che ha le soluzioni $-3$ e $5$.

$$
\begin{gathered}
s = -3 + 5 = 2 \\
p = (-3) \cdot 5 = -15
\end{gathered}
$$

L'equazione è $x^2 - 2x - 15 = 0$. Controllo: $(-3)^2 - 2 \cdot (-3) - 15 = 9 + 6 - 15 = 0$ e $25 - 10 - 15 = 0$.
```

```ad-warning
Il segno meno davanti a s
Nella forma $x^2 - sx + p = 0$ la somma entra con il segno cambiato. Con $s = 2$ e $p = -15$ l'equazione è $x^2 - 2x - 15 = 0$; l'equazione $x^2 + 2x - 15 = 0$ ha invece le soluzioni $-5$ e $3$.
```

```ad-example
Esempio 5: soluzioni frazionarie
Scrivi un'equazione con coefficienti interi che ha le soluzioni $-\dfrac{1}{2}$ e $\dfrac{2}{3}$.

$$
\begin{gathered}
s = -\frac{1}{2} + \frac{2}{3} = \frac{1}{6} \\
p = -\frac{1}{2} \cdot \frac{2}{3} = -\frac{1}{3}
\end{gathered}
$$

L'equazione è $x^2 - \dfrac{1}{6}x - \dfrac{1}{3} = 0$. Per avere coefficienti interi moltiplica tutti i termini per $6$, il denominatore comune:

$$6x^2 - x - 2 = 0$$

È l'equazione dell'esempio 9 della lezione sulle equazioni di secondo grado, che ha proprio queste soluzioni.
```

```ad-example
Esempio 6: soluzioni irrazionali
Scrivi un'equazione che ha le soluzioni $1 - \sqrt{2}$ e $1 + \sqrt{2}$.

Nella somma i radicali si cancellano, nel prodotto c'è una differenza di quadrati:

$$
\begin{gathered}
s = 1 - \sqrt{2} + 1 + \sqrt{2} = 2 \\
p = 1 - 2 = -1
\end{gathered}
$$

L'equazione è $x^2 - 2x - 1 = 0$, con coefficienti interi anche se le soluzioni sono irrazionali. Succede perché le due soluzioni sono nella forma $m - \sqrt{n}$ e $m + \sqrt{n}$, come quelle che dà la formula risolutiva.
```

## Due numeri di somma e prodotto dati

Lo stesso ragionamento risolve un problema classico: trovare due numeri conoscendo la loro somma $s$ e il loro prodotto $p$. I due numeri sono le soluzioni dell'equazione $x^2 - sx + p = 0$, quindi esistono se e solo se il discriminante $s^2 - 4p$ non è negativo.

```ad-example
Esempio 7: somma 10 e prodotto 21
Trova due numeri che hanno somma $10$ e prodotto $21$.

I numeri sono le soluzioni di $x^2 - 10x + 21 = 0$:

$$
\begin{gathered}
\Delta = 100 - 84 = 16 \\
x_{1,2} = \frac{10 \pm 4}{2}
\end{gathered}
$$

I due numeri sono $3$ e $7$: infatti $3 + 7 = 10$ e $3 \cdot 7 = 21$.
```

```ad-example
Esempio 8: un rettangolo
Un rettangolo ha perimetro $34\ \text{cm}$ e area $60\ \text{cm}^2$. Quanto misurano i lati?

Il perimetro è il doppio della somma dei due lati, quindi i lati hanno somma $17$ e prodotto $60$. Sono le soluzioni di $x^2 - 17x + 60 = 0$:

$$
\begin{gathered}
\Delta = 289 - 240 = 49 \\
x_{1,2} = \frac{17 \pm 7}{2}
\end{gathered}
$$

Le soluzioni sono $5$ e $12$: i lati misurano $5\ \text{cm}$ e $12\ \text{cm}$. Altri problemi di questo tipo sono nella lezione [Problemi di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/problemi-di-secondo-grado).
```

```ad-example
Esempio 9: due numeri che non esistono
Esistono due numeri reali con somma $5$ e prodotto $7$?

Dovrebbero essere le soluzioni di $x^2 - 5x + 7 = 0$, che ha $\Delta = 25 - 28 = -3$. Il discriminante è negativo: due numeri reali con somma $5$ e prodotto $7$ non esistono.
```

```ad-warning
Metà perimetro, non perimetro
Nell'esempio 8 la somma dei lati è metà del perimetro, $17$. Con $34$ si risolve $x^2 - 34x + 60 = 0$, che ha soluzioni irrazionali e porta a un rettangolo con perimetro $68\ \text{cm}$.
```

## Scomposizione del trinomio

Nella lezione sul [trinomio di secondo grado](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado) i due numeri di somma e prodotto dati si cercavano a tentativi, tra i divisori interi del termine noto. Con le soluzioni dell'equazione associata la scomposizione si trova sempre, anche quando i numeri non sono interi. Se l'equazione $ax^2 + bx + c = 0$ ha $\Delta \geq 0$ e soluzioni $x_1$ e $x_2$, allora

$$ax^2 + bx + c = a(x - x_1)(x - x_2)$$

Per verificarlo, sviluppa il prodotto e sostituisci la somma e il prodotto delle soluzioni:

$$
\begin{aligned}
&a(x - x_1)(x - x_2) \\
&= a\big[x^2 - (x_1 + x_2)x + x_1 x_2\big] \\
&= a\Big(x^2 + \frac{b}{a}x + \frac{c}{a}\Big) \\
&= ax^2 + bx + c
\end{aligned}
$$

Il procedimento:

1. Risolvi l'equazione associata $ax^2 + bx + c = 0$.
2. Se $\Delta > 0$, scrivi $a(x - x_1)(x - x_2)$, con il coefficiente $a$ davanti.
3. Se $\Delta = 0$, le soluzioni coincidono e il trinomio è $a(x - x_1)^2$.
4. Se $\Delta < 0$, il trinomio non si scompone in fattori di primo grado: è irriducibile.
5. Se ci sono frazioni, distribuisci i fattori di $a$ dentro le parentesi.

```ad-example
Esempio 10: soluzioni frazionarie
Scomponi $6x^2 - x - 2$.

L'equazione $6x^2 - x - 2 = 0$ ha le soluzioni $-\dfrac{1}{2}$ e $\dfrac{2}{3}$ (esempio 5). Quindi

$$
\begin{aligned}
&6x^2 - x - 2 \\
&= 6\Big(x + \frac{1}{2}\Big)\Big(x - \frac{2}{3}\Big)
\end{aligned}
$$

Scrivi $6 = 2 \cdot 3$ e moltiplica il $2$ per la prima parentesi e il $3$ per la seconda:

$$
\begin{aligned}
&6x^2 - x - 2 \\
&= (2x + 1)(3x - 2)
\end{aligned}
$$

È lo stesso risultato che si trova con il raccoglimento parziale nella lezione sul trinomio.
```

```ad-warning
Dimenticare il coefficiente a
$\Big(x + \dfrac{1}{2}\Big)\Big(x - \dfrac{2}{3}\Big)$ non è uguale a $6x^2 - x - 2$: sviluppando si ottiene $x^2 - \dfrac{1}{6}x - \dfrac{1}{3}$, cioè il trinomio diviso per $6$. Le soluzioni sono le stesse, ma i due polinomi sono diversi: davanti ai fattori va sempre $a$.
```

```ad-example
Esempio 11: soluzioni irrazionali
Scomponi $x^2 + 4x + 2$.

Nella lezione sul trinomio questo trinomio risultava irriducibile, perché nessuna coppia di interi ha somma $4$ e prodotto $2$. Le soluzioni dell'equazione associata però esistono:

$$
\begin{gathered}
\Delta = 16 - 8 = 8 \\
\sqrt{8} = 2\sqrt{2} \\
x_{1,2} = \frac{-4 \pm 2\sqrt{2}}{2} = -2 \pm \sqrt{2}
\end{gathered}
$$

Con $a = 1$, e con i segni cambiati dentro le parentesi:

$$
\begin{aligned}
&x^2 + 4x + 2 \\
&= (x + 2 - \sqrt{2})(x + 2 + \sqrt{2})
\end{aligned}
$$

Controllo: il prodotto è una differenza di quadrati, $(x + 2)^2 - 2 = x^2 + 4x + 2$.
```

```ad-note
Irriducibile con gli interi, scomponibile con i reali
Il trinomio $x^2 + 4x + 2$ è irriducibile se i coefficienti dei fattori devono essere interi, come nel capitolo sulla scomposizione, e si scompone se si ammettono i numeri reali. Un trinomio è irriducibile anche tra i reali solo quando $\Delta < 0$. Se l'esercizio non dice niente, segui quello che chiede il tuo libro.
```

```ad-example
Esempio 12: primo coefficiente negativo
Scomponi $-3x^2 + 5x + 2$.

Qui $a = -3$. L'equazione $-3x^2 + 5x + 2 = 0$ ha le stesse soluzioni di $3x^2 - 5x - 2 = 0$, che sono $-\dfrac{1}{3}$ e $2$ (esempio 3):

$$
\begin{aligned}
&-3x^2 + 5x + 2 \\
&= -3\Big(x + \frac{1}{3}\Big)(x - 2)
\end{aligned}
$$

Scrivi $-3 = -1 \cdot 3$ e porta il $3$ nella prima parentesi:

$$
\begin{aligned}
&-3x^2 + 5x + 2 \\
&= -(3x + 1)(x - 2)
\end{aligned}
$$
```

```ad-warning
Il coefficiente a viene dal trinomio
Per trovare le soluzioni puoi moltiplicare l'equazione per $-1$, ma nella scomposizione va l'$a$ del trinomio di partenza, $-3$, non il $3$ dell'equazione cambiata di segno. Con $3$ davanti ottieni $3x^2 - 5x - 2$, l'opposto del trinomio.
```

Con $\Delta = 0$ il trinomio è un quadrato, a meno del coefficiente $a$. Per esempio $4x^2 - 12x + 9$ ha la soluzione doppia $\dfrac{3}{2}$, quindi $4x^2 - 12x + 9 = 4\Big(x - \dfrac{3}{2}\Big)^2 = (2x - 3)^2$, perché $4 = 2^2$. Con $\Delta < 0$ non c'è niente da scomporre: $2x^2 - 4x + 5$ ha $\Delta = 16 - 40 = -24$ ed è irriducibile.

```ad-note
Il legame con la regola del trinomio
Con $a = 1$ la scomposizione è $(x - x_1)(x - x_2)$. Nella lezione sul trinomio si scriveva $x^2 + sx + p = (x + m)(x + n)$, dove la lettera $s$ indicava il coefficiente di $x$ e i due numeri $m$ e $n$ avevano somma uguale a quel coefficiente: le soluzioni dell'equazione sono $-m$ e $-n$, e la loro somma è l'opposto del coefficiente di $x$. Per questo nella forma $x^2 - sx + p = 0$ di questa lezione c'è il segno meno.
```

## Segni delle soluzioni senza risolvere

Dal segno di $p$ e da quello di $s$ si capisce il segno delle soluzioni, quando esistono. Se il prodotto è positivo le due soluzioni hanno lo stesso segno, che è il segno della somma; se il prodotto è negativo hanno segni opposti.

| Prodotto $p$ | Somma $s$ | Soluzioni |
|---|---|---|
| positivo | positiva | tutte e due positive |
| positivo | negativa | tutte e due negative |
| negativo | positiva | discordi, la positiva ha valore assoluto maggiore |
| negativo | negativa | discordi, la negativa ha valore assoluto maggiore |
| negativo | zero | opposte |
| zero | qualunque | una delle due è $0$ |

La tabella vale solo se $\Delta \geq 0$. C'è un caso in cui il controllo si può saltare: se $p < 0$, cioè se $a$ e $c$ hanno segni opposti, $-4ac$ è positivo e $\Delta = b^2 - 4ac$ è sicuramente positivo, quindi le soluzioni esistono sempre.

La stessa informazione si legge in un colpo solo sui segni dei coefficienti, con la **regola di Cartesio**. Scrivi i segni di $a$, $b$ e $c$ nell'ordine. Due segni vicini uguali formano una **permanenza**, due segni vicini diversi una **variazione**. Se $a$, $b$ e $c$ sono tutti diversi da zero e $\Delta \geq 0$:

- a ogni variazione corrisponde una soluzione positiva, a ogni permanenza una soluzione negativa;
- se c'è una variazione e una permanenza, le soluzioni sono discordi: ha valore assoluto maggiore la positiva se viene prima la variazione, la negativa se viene prima la permanenza.

La regola viene dalla tabella: con $a > 0$, due segni come $+\,-\,+$ vogliono dire $b < 0$ e $c > 0$, cioè somma e prodotto positivi. Moltiplicando l'equazione per $-1$ i segni si scambiano tutti, ma le permanenze e le variazioni restano le stesse, quindi la regola vale anche con $a < 0$.

```ad-example
Esempio 13: due variazioni
Che segno hanno le soluzioni di $3x^2 - 11x + 6 = 0$?

$\Delta = 121 - 72 = 49$, positivo. I segni dei coefficienti sono $+\,-\,+$: due variazioni, quindi due soluzioni positive.

Controllo: le soluzioni sono $\dfrac{2}{3}$ e $3$.
```

```ad-example
Esempio 14: una permanenza, poi una variazione
Che segno hanno le soluzioni di $2x^2 + x - 6 = 0$?

$a$ e $c$ hanno segni opposti, quindi $\Delta > 0$ senza fare il conto. I segni sono $+\,+\,-$: prima una permanenza, poi una variazione. Le soluzioni sono discordi, e ha valore assoluto maggiore la negativa.

Controllo: le soluzioni sono $-2$ e $\dfrac{3}{2}$, e $|-2| > \dfrac{3}{2}$.
```

```ad-example
Esempio 15: primo coefficiente negativo
Che segno hanno le soluzioni di $-x^2 + 4x + 5 = 0$?

$a = -1$ e $c = 5$ sono discordi: $\Delta > 0$. I segni sono $-\,+\,+$: prima una variazione, poi una permanenza. Le soluzioni sono discordi, e ha valore assoluto maggiore la positiva.

Controllo: con la somma e il prodotto, $s = 4$ e $p = -5$; le soluzioni sono $-1$ e $5$.
```

```ad-warning
Contare le variazioni senza guardare il discriminante
I segni di $x^2 - 2x + 5 = 0$ sono $+\,-\,+$, due variazioni, ma $\Delta = 4 - 20 = -16$: l'equazione non ha soluzioni, né positive né negative. La regola dice il segno delle soluzioni solo quando esistono.
```

Quando manca un termine la regola non si applica, ma l'equazione è incompleta e si risolve subito: in una spuria una soluzione è $0$, in una pura con soluzioni le due soluzioni sono opposte.

## Espressioni simmetriche delle soluzioni

Un'espressione in $x_1$ e $x_2$ è **simmetrica** se non cambia scambiando $x_1$ con $x_2$: lo sono $x_1^2 + x_2^2$ e $\dfrac{1}{x_1} + \dfrac{1}{x_2}$, non lo è $x_1 - x_2$. Le espressioni simmetriche che si incontrano negli esercizi si scrivono con $s$ e $p$, e quindi si calcolano dai coefficienti senza risolvere l'equazione.

Per la somma dei quadrati parti dal quadrato della somma, $(x_1 + x_2)^2 = x_1^2 + 2x_1x_2 + x_2^2$, e togli il doppio prodotto:

$$
\begin{aligned}
&x_1^2 + x_2^2 \\
&= (x_1 + x_2)^2 - 2x_1x_2 \\
&= s^2 - 2p
\end{aligned}
$$

Per la somma dei reciproci fai il denominatore comune: $\dfrac{1}{x_1} + \dfrac{1}{x_2} = \dfrac{x_2 + x_1}{x_1x_2} = \dfrac{s}{p}$, che ha senso solo se $p \neq 0$, cioè se nessuna soluzione è zero.

| Espressione | Con $s$ e $p$ |
|---|---|
| $x_1^2 + x_2^2$ | $s^2 - 2p$ |
| $\dfrac{1}{x_1} + \dfrac{1}{x_2}$ | $\dfrac{s}{p}$ |
| $x_1^2x_2 + x_1x_2^2$ | $ps$ |
| $(x_1 - x_2)^2$ | $s^2 - 4p$ |
| $x_1^3 + x_2^3$ | $s^3 - 3ps$ |
| $\dfrac{1}{x_1^2} + \dfrac{1}{x_2^2}$ | $\dfrac{s^2 - 2p}{p^2}$ |

Le formule della tabella non vanno imparate a memoria: ognuna si ricava con un raccoglimento o con un prodotto notevole. Per esempio $x_1^2x_2 + x_1x_2^2 = x_1x_2(x_1 + x_2)$, e $x_1^3 + x_2^3$ viene dal cubo del binomio, $(x_1 + x_2)^3 = x_1^3 + x_2^3 + 3x_1x_2(x_1 + x_2)$.

```ad-example
Esempio 16: somma dei quadrati e dei reciproci
Per l'equazione $2x^2 - 6x + 1 = 0$ calcola $x_1^2 + x_2^2$ e $\dfrac{1}{x_1} + \dfrac{1}{x_2}$.

$\Delta = 36 - 8 = 28$, positivo. La somma è $s = 3$ e il prodotto è $p = \dfrac{1}{2}$:

$$
\begin{gathered}
x_1^2 + x_2^2 = 9 - 2 \cdot \frac{1}{2} = 8 \\
\frac{1}{x_1} + \frac{1}{x_2} = 3 : \frac{1}{2} = 6
\end{gathered}
$$

Le soluzioni sono $\dfrac{3 \pm \sqrt{7}}{2}$: fare gli stessi conti con i radicali sarebbe molto più lungo.
```

```ad-warning
La somma dei quadrati non è il quadrato della somma
$x_1^2 + x_2^2$ non è $s^2$: nell'esempio 16 $s^2 = 9$, mentre $x_1^2 + x_2^2 = 8$. Il quadrato della somma contiene anche il doppio prodotto $2x_1x_2$, che va tolto.
```

```ad-example
Esempio 17: con i segni negativi
Per l'equazione $3x^2 + 5x - 1 = 0$ calcola $\dfrac{1}{x_1^2} + \dfrac{1}{x_2^2}$.

$a$ e $c$ hanno segni opposti, quindi $\Delta > 0$. La somma è $s = -\dfrac{5}{3}$ e il prodotto è $p = -\dfrac{1}{3}$, quindi $s^2 = \dfrac{25}{9}$ e $p^2 = \dfrac{1}{9}$:

$$
\begin{gathered}
s^2 - 2p = \frac{25}{9} + \frac{2}{3} = \frac{31}{9} \\
\frac{s^2 - 2p}{p^2} = \frac{31}{9} \cdot 9 = 31
\end{gathered}
$$
```

```ad-warning
Il meno davanti al doppio prodotto
Con $p$ negativo, $-2p$ è positivo: nell'esempio 17, $-2 \cdot \Big(-\dfrac{1}{3}\Big) = +\dfrac{2}{3}$. Scrivi $p$ tra parentesi quando lo sostituisci.
```

```ad-tip
Un risultato impossibile rivela un errore
Una somma di quadrati di numeri reali non è mai negativa. Se per $x^2 + x + 1 = 0$ calcoli $s^2 - 2p = 1 - 2 = -1$, il conto ti sta dicendo che le soluzioni reali non ci sono: infatti $\Delta = -3$. Controlla sempre il discriminante prima di cominciare.
```

Le relazioni tra soluzioni e coefficienti sono lo strumento principale delle [equazioni parametriche](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-parametriche), dove si cercano i valori di un parametro per cui le soluzioni hanno una proprietà data: somma assegnata, soluzioni opposte o reciproche, una soluzione nulla.
