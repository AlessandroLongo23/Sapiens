# Equazioni parametriche

L'equazione $x^2 - 2x + k = 0$ non è una sola equazione, ma una famiglia: per $k = 0$ diventa $x^2 - 2x = 0$, che ha le soluzioni $0$ e $2$; per $k = 1$ diventa $x^2 - 2x + 1 = 0$, che ha la sola soluzione doppia $1$; per $k = 2$ non ha soluzioni reali. Gli esercizi sulle equazioni parametriche chiedono di scegliere il valore di $k$ giusto: quello per cui le soluzioni sono coincidenti, o opposte, o hanno una somma data.

Per seguire questa lezione ti servono le [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado), con il discriminante e la formula ridotta, e le [relazioni tra soluzioni e coefficienti](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/relazioni-tra-soluzioni-e-coefficienti), cioè la somma $-\dfrac{b}{a}$ e il prodotto $\dfrac{c}{a}$ delle soluzioni.

## Equazioni con un parametro

Un'**equazione parametrica** di secondo grado è un'equazione in cui i coefficienti $a$, $b$, $c$ dipendono da una lettera, il **parametro**. Come nelle [equazioni letterali](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-letterali), il parametro rappresenta un numero fissato ma non dato, e nei conti si tratta come un numero. Qui lo chiamiamo $k$, perché le lettere $a$, $b$ e $c$ servono già per i coefficienti.

Il primo passo è sempre portare l'equazione in forma normale e leggere i coefficienti, che ora sono espressioni in $k$. In tutta la lezione torna spesso questa equazione:

$$(k - 1)x^2 - 2kx + k + 3 = 0$$

I coefficienti sono $a = k - 1$, $b = -2k$ e $c = k + 3$. Il termine noto è tutto quello che non contiene la $x$, quindi $k + 3$ insieme.

## Il caso in cui a si annulla

Un'equazione è di secondo grado solo se $a \neq 0$. Quando anche $a$ dipende dal parametro, c'è un valore di $k$ (a volte più di uno) per cui il termine in $x^2$ sparisce e l'equazione diventa di primo grado. Quel valore si trova risolvendo $a = 0$ e si studia a parte, sostituendolo nell'equazione di partenza.

```ad-example
Esempio 1: quando l'equazione è di primo grado
Per quale valore di $k$ l'equazione $(k - 1)x^2 - 2kx + k + 3 = 0$ è di primo grado? Quale soluzione ha?

Il coefficiente di $x^2$ è $k - 1$, che si annulla per $k = 1$. Sostituisci $k = 1$ nell'equazione:

$$
\begin{gathered}
0 \cdot x^2 - 2x + 1 + 3 = 0 \\
\Rightarrow -2x + 4 = 0 \\
\Rightarrow x = 2
\end{gathered}
$$

Per $k = 1$ l'equazione è di primo grado e ha la sola soluzione $x = 2$. Per ogni $k \neq 1$ è di secondo grado.
```

Se per il valore che annulla $a$ si annulla anche $b$, l'equazione si riduce a $0x = c$, e si discute come nelle equazioni letterali: impossibile se $c \neq 0$, indeterminata se $c = 0$.

```ad-warning
Dimenticare il caso a = 0
Il discriminante, la formula risolutiva, la somma $-\dfrac{b}{a}$ e il prodotto $\dfrac{c}{a}$ valgono solo per le equazioni di secondo grado. Prima di usarli trova i valori di $k$ che annullano $a$ e tienili da parte: per quei valori l'equazione è un'altra, e va risolta a parte.
```

## Quante soluzioni: il discriminante

Per $a \neq 0$ il numero delle soluzioni dipende dal segno del discriminante, che adesso è un'espressione in $k$:

| Condizione | Discriminante |
|---|---|
| soluzioni reali | $\Delta \geq 0$ |
| reali e distinte | $\Delta > 0$ |
| reali e coincidenti | $\Delta = 0$ |
| nessuna soluzione reale | $\Delta < 0$ |

Quando $b$ è pari, come $-2k$, conviene la formula ridotta $\dfrac{\Delta}{4} = \left(\dfrac{b}{2}\right)^2 - ac$, che ha lo stesso segno di $\Delta$. Spesso, sviluppando, i termini in $k^2$ si cancellano e il discriminante diventa di primo grado in $k$: allora la condizione $\Delta \geq 0$ è una [disequazione di primo grado](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli).

```ad-example
Esempio 2: soluzioni reali, coincidenti, distinte
Studia il numero delle soluzioni di $(k - 1)x^2 - 2kx + k + 3 = 0$ al variare di $k$.

Con $a = k - 1$, $\dfrac{b}{2} = -k$ e $c = k + 3$:

$$
\begin{aligned}
\frac{\Delta}{4} &= (-k)^2 - (k - 1)(k + 3) \\
&= k^2 - (k^2 + 2k - 3) \\
&= 3 - 2k
\end{aligned}
$$

Le soluzioni sono reali quando $3 - 2k \geq 0$, cioè $k \leq \dfrac{3}{2}$.

Sono coincidenti quando $3 - 2k = 0$, cioè $k = \dfrac{3}{2}$. Con questo valore $a = \dfrac{1}{2}$ e $b = -3$, e la soluzione doppia è

$$x_1 = x_2 = -\frac{b}{2a} = \frac{3}{1} = 3$$

Sono distinte quando $k < \dfrac{3}{2}$, ma bisogna togliere $k = 1$, per cui l'equazione è di primo grado (esempio 1). Per $k > \dfrac{3}{2}$ non ci sono soluzioni reali.

La risposta: per $k < \dfrac{3}{2}$ e $k \neq 1$ due soluzioni distinte; per $k = 1$ una sola soluzione, $x = 2$; per $k = \dfrac{3}{2}$ due soluzioni coincidenti, $x = 3$; per $k > \dfrac{3}{2}$ nessuna soluzione reale.
```

```ad-warning
Il meno davanti al prodotto
In $(-k)^2 - (k - 1)(k + 3)$ il meno cambia segno a tutto il prodotto: prima si svolge $(k - 1)(k + 3) = k^2 + 2k - 3$ tra parentesi, poi si toglie. Scrivere $k^2 - k^2 + 2k - 3$ dà $2k - 3$, con il segno sbagliato.
```

Se invece il discriminante resta di secondo grado in $k$, la condizione $\Delta \geq 0$ è una [disequazione di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado). In alcuni esercizi, però, il discriminante è il quadrato di un binomio e il suo segno si legge subito, come nell'esempio 9.

## Condizioni sulle soluzioni

Molti esercizi chiedono che le soluzioni abbiano una proprietà. Ogni proprietà si traduce in una relazione tra i coefficienti, quasi sempre attraverso la somma $x_1 + x_2 = -\dfrac{b}{a}$ e il prodotto $x_1 \cdot x_2 = \dfrac{c}{a}$:

| Le soluzioni sono | Relazione |
|---|---|
| opposte | $b = 0$ |
| reciproche | $c = a$ |
| una nulla | $c = 0$ |
| con somma $s$ | $-\dfrac{b}{a} = s$ |
| con prodotto $p$ | $\dfrac{c}{a} = p$ |

Due soluzioni opposte hanno somma zero, quindi $-\dfrac{b}{a} = 0$, cioè $b = 0$. Due soluzioni reciproche hanno prodotto $1$, quindi $\dfrac{c}{a} = 1$, cioè $c = a$. Una soluzione vale zero quando il prodotto vale zero, cioè quando $c = 0$.

Se invece il testo dà una soluzione, per esempio $x = -1$, la si sostituisce nell'equazione: un numero è soluzione se rende vera l'uguaglianza.

La relazione dà un'equazione in $k$. I valori trovati non sono ancora la risposta, perché la relazione vale per le soluzioni solo se le soluzioni esistono: ogni valore va controllato.

```ad-tip
Il controllo di ogni valore
Per ogni valore di $k$ trovato, controlla che $a \neq 0$ e che $\Delta \geq 0$, sostituendo il numero nelle espressioni di $a$ e di $\Delta$. Se una delle due condizioni non vale, quel valore si scarta.
```

Per le condizioni "una soluzione nulla" e "una soluzione assegnata" il controllo del discriminante non serve: se un numero è soluzione, l'equazione ha soluzioni reali e $\Delta \geq 0$ di sicuro. Resta da controllare $a \neq 0$.

### Il procedimento

1. Porta l'equazione in forma normale e scrivi $a$, $b$ e $c$ in funzione di $k$.
2. Trova i valori di $k$ che annullano $a$ e studiali a parte.
3. Traduci la condizione del testo in un'equazione in $k$.
4. Risolvi l'equazione in $k$.
5. Controlla ogni valore trovato: $a \neq 0$ e $\Delta \geq 0$.
6. Scrivi i valori accettabili, oppure che nessun valore va bene.

## Esempi svolti

Gli esempi da 3 a 6 usano ancora $(k - 1)x^2 - 2kx + k + 3 = 0$, con $a = k - 1$, $b = -2k$, $c = k + 3$ e $\dfrac{\Delta}{4} = 3 - 2k$ (esempio 2).

```ad-example
Esempio 3: una soluzione assegnata
Trova $k$ in modo che una soluzione sia $x = -1$, e trova l'altra soluzione.

Sostituisci $x = -1$:

$$
\begin{gathered}
(k - 1) \cdot 1 + 2k + k + 3 = 0 \\
\Rightarrow 4k + 2 = 0 \\
\Rightarrow k = -\frac{1}{2}
\end{gathered}
$$

Con $k = -\dfrac{1}{2}$ il coefficiente $a = -\dfrac{3}{2}$ non è zero, e il discriminante è positivo di sicuro, perché $-1$ è una soluzione. Il termine noto è $c = \dfrac{5}{2}$.

L'altra soluzione si trova con il prodotto: $x_1 \cdot x_2 = \dfrac{c}{a}$, e

$$\frac{c}{a} = \frac{5}{2} \cdot \left(-\frac{2}{3}\right) = -\frac{5}{3}$$

Quindi $-1 \cdot x_2 = -\dfrac{5}{3}$, cioè $x_2 = \dfrac{5}{3}$. Controllo: con $k = -\dfrac{1}{2}$ l'equazione, moltiplicata per $-2$, è $3x^2 - 2x - 5 = 0$, che ha soluzioni $-1$ e $\dfrac{5}{3}$.
```

```ad-warning
Il quadrato di un numero negativo
Sostituendo $x = -1$, il termine $(k - 1)x^2$ diventa $(k - 1) \cdot 1$, perché $(-1)^2 = 1$, e il termine $-2kx$ diventa $+2k$. Metti sempre il numero tra parentesi quando è negativo.
```

```ad-example
Esempio 4: soluzioni opposte, una soluzione nulla
Trova $k$ in modo che le soluzioni siano opposte. Poi trova $k$ in modo che una soluzione sia nulla.

Soluzioni opposte: $b = 0$, cioè $-2k = 0$, quindi $k = 0$. Controllo: $a = -1 \neq 0$ e $\dfrac{\Delta}{4} = 3 > 0$. L'equazione diventa

$$-x^2 + 3 = 0 \ \Rightarrow \ x^2 = 3$$

e le soluzioni sono $x_1 = -\sqrt{3}$ e $x_2 = \sqrt{3}$, opposte.

Una soluzione nulla: $c = 0$, cioè $k + 3 = 0$, quindi $k = -3$. Controllo: $a = -4 \neq 0$. L'equazione diventa

$$
\begin{gathered}
-4x^2 + 6x = 0 \\
\Rightarrow -2x(2x - 3) = 0
\end{gathered}
$$

con soluzioni $x_1 = 0$ e $x_2 = \dfrac{3}{2}$.
```

```ad-warning
Opposte non vuol dire soltanto b = 0
La condizione $b = 0$ dice che la somma delle soluzioni è zero, ma solo se le soluzioni esistono. L'equazione $x^2 + 4 = 0$ ha $b = 0$ e non ha soluzioni reali. Dopo aver trovato $k$ con $b = 0$, controlla sempre il discriminante.
```

```ad-example
Esempio 5: soluzioni reciproche, nessun valore
Trova $k$ in modo che le soluzioni siano reciproche.

La condizione è $c = a$:

$$
\begin{gathered}
k + 3 = k - 1 \\
\Rightarrow 3 = -1
\end{gathered}
$$

L'uguaglianza è falsa per ogni $k$: l'equazione in $k$ è impossibile. Nessun valore di $k$ rende le soluzioni reciproche.
```

```ad-example
Esempio 6: somma e prodotto assegnati
Trova $k$ in modo che la somma delle soluzioni sia $4$. Poi trova $k$ in modo che il prodotto sia $-2$.

Somma: $-\dfrac{b}{a} = \dfrac{2k}{k - 1}$. L'equazione in $k$ è [fratta](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-fratte), con C.E. $k \neq 1$, che è proprio la condizione $a \neq 0$:

$$
\begin{gathered}
\frac{2k}{k - 1} = 4 \\
\Rightarrow 2k = 4k - 4 \\
\Rightarrow k = 2
\end{gathered}
$$

Controllo: $\dfrac{\Delta}{4} = 3 - 4 = -1 < 0$. Per $k = 2$ l'equazione non ha soluzioni reali, quindi il valore si scarta: nessun $k$ dà due soluzioni reali con somma $4$.

Prodotto: $\dfrac{c}{a} = \dfrac{k + 3}{k - 1}$, con C.E. $k \neq 1$:

$$
\begin{gathered}
\frac{k + 3}{k - 1} = -2 \\
\Rightarrow k + 3 = -2k + 2 \\
\Rightarrow k = -\frac{1}{3}
\end{gathered}
$$

Controllo: $a = -\dfrac{4}{3} \neq 0$ e $\dfrac{\Delta}{4} = 3 + \dfrac{2}{3} = \dfrac{11}{3} > 0$. Il valore $k = -\dfrac{1}{3}$ è accettabile.
```

```ad-warning
Fermarsi al valore di k
Nell'esempio 6 il conto $\dfrac{2k}{k - 1} = 4$ dà $k = 2$ senza errori, eppure la risposta giusta è "nessun valore". La somma $-\dfrac{b}{a}$ è la somma delle soluzioni solo quando le soluzioni esistono: senza il controllo del discriminante la risposta è sbagliata.
```

```ad-example
Esempio 7: soluzioni reciproche
Data $kx^2 - 5x + 2k - 2 = 0$, trova $k$ in modo che le soluzioni siano reciproche.

La condizione è $c = a$:

$$
\begin{gathered}
2k - 2 = k \\
\Rightarrow k = 2
\end{gathered}
$$

Controllo: $a = 2 \neq 0$, e con $k = 2$ l'equazione è $2x^2 - 5x + 2 = 0$, con $\Delta = 25 - 16 = 9 > 0$. Le soluzioni sono $\dfrac{1}{2}$ e $2$, che sono reciproche.
```

Con i numeri dell'esempio 7 cambiati di poco il controllo può fallire: in $kx^2 - 5x + 2k - 3 = 0$ la condizione $c = a$ dà $k = 3$, ma l'equazione $3x^2 - 5x + 3 = 0$ ha $\Delta = 25 - 36 < 0$, e quel valore si scarta.

### Somma dei quadrati

La somma dei quadrati delle soluzioni si esprime con la somma $s$ e il prodotto $p$, perché $(x_1 + x_2)^2 = x_1^2 + 2x_1x_2 + x_2^2$:

$$x_1^2 + x_2^2 = s^2 - 2p$$

```ad-example
Esempio 8: somma dei quadrati, un valore da scartare
Data $x^2 + (k - 2)x + 2k - 4 = 0$, trova $k$ in modo che $x_1^2 + x_2^2 = 5$.

Qui $a = 1$, che non si annulla mai. La somma è $s = -(k - 2) = 2 - k$ e il prodotto è $p = 2k - 4$:

$$
\begin{aligned}
x_1^2 + x_2^2 &= (2 - k)^2 - 2(2k - 4) \\
&= k^2 - 4k + 4 - 4k + 8 \\
&= k^2 - 8k + 12
\end{aligned}
$$

La condizione dà un'equazione di secondo grado in $k$:

$$
\begin{gathered}
k^2 - 8k + 12 = 5 \\
\Rightarrow k^2 - 8k + 7 = 0 \\
\Rightarrow k_1 = 1, \quad k_2 = 7
\end{gathered}
$$

Il discriminante dell'equazione in $x$ è $\Delta = (k - 2)^2 - 4(2k - 4)$. Controlla i due valori:

$$
\begin{gathered}
k = 1: \ \Delta = 1 + 8 = 9 > 0 \\
k = 7: \ \Delta = 25 - 40 < 0
\end{gathered}
$$

Il valore $k = 7$ si scarta. Con $k = 1$ l'equazione è $x^2 - x - 2 = 0$, con soluzioni $-1$ e $2$: infatti $1 + 4 = 5$.
```

```ad-warning
La somma dei quadrati non è il quadrato della somma
$x_1^2 + x_2^2$ è diverso da $(x_1 + x_2)^2$: manca il doppio prodotto. Con le soluzioni $-1$ e $2$ dell'esempio 8, la somma dei quadrati è $5$, il quadrato della somma è $1$.
```

### Un discriminante che è un quadrato

```ad-example
Esempio 9: soluzioni reali per ogni k
Studia le soluzioni di $kx^2 - (k + 1)x + 1 = 0$ al variare di $k$.

Il coefficiente $a = k$ si annulla per $k = 0$. Con $k = 0$ l'equazione diventa $-x + 1 = 0$, con la sola soluzione $x = 1$.

Per $k \neq 0$, con $b = -(k + 1)$ e $c = 1$:

$$
\begin{aligned}
\Delta &= (k + 1)^2 - 4k \\
&= k^2 - 2k + 1 \\
&= (k - 1)^2
\end{aligned}
$$

Un quadrato non è mai negativo, quindi $\Delta \geq 0$ per ogni $k$: le soluzioni sono sempre reali. Il discriminante vale zero solo per $k = 1$. Nella formula, $\sqrt{(k - 1)^2} = |k - 1|$ (lo trovi in [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta)), e con il $\pm$ davanti il valore assoluto non conta: $\pm|k - 1|$ e $\pm(k - 1)$ sono gli stessi due numeri.

$$
x = \frac{k + 1 \pm (k - 1)}{2k}
$$

cioè $x = \dfrac{2k}{2k} = 1$ e $x = \dfrac{2}{2k} = \dfrac{1}{k}$.

La risposta: per $k = 0$ la sola soluzione $x = 1$; per $k = 1$ due soluzioni coincidenti, $x = 1$; per gli altri valori di $k$ due soluzioni distinte, $1$ e $\dfrac{1}{k}$.
```

Le equazioni parametriche tornano nei [problemi di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/problemi-di-secondo-grado), quando un dato del problema resta una lettera.
