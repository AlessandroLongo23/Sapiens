# Polinomi e grado di un polinomio

Quando due monomi non sono simili, la loro somma non si riduce a un monomio solo e resta scritta come somma: $3x^2 - 5x + 2$ è fatto di tre monomi che non si possono unire. Espressioni di questo tipo si chiamano polinomi, e con loro si scrivono quasi tutte le formule dell'algebra: se un rettangolo ha i lati lunghi $x$ e $y$, la somma della sua area e del suo perimetro è $xy + 2x + 2y$.

In tutta la lezione servono i [monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/monomi), il loro [grado](/materiale/scuola-superiore/matematica/monomi-e-polinomi/grado-di-un-monomio) e la somma di monomi simili, che è nella lezione sulle [operazioni tra monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-monomi).

## Che cos'è un polinomio

Un **polinomio** è una somma algebrica di monomi. I monomi che lo compongono si chiamano **termini** del polinomio, e ognuno si prende con il segno che ha davanti.

$$2x^3 - x + 7$$

è un polinomio con tre termini: $2x^3$, $-x$ e $7$. Anche un monomio da solo, come $-4ab^2$, è un polinomio: ha un solo termine.

I polinomi con pochi termini hanno un nome, che si dà dopo aver ridotto il polinomio a forma normale (lo vedi nella prossima sezione):

- con due termini è un binomio, come $x + 5$ o $a^2 - b^2$;
- con tre termini è un trinomio, come $x^2 - 3x + 2$;
- con quattro termini è un quadrinomio, come $a^3 + a^2 - 2a + 1$.

Oltre i quattro termini non c'è un nome apposta: si dice polinomio.

```ad-warning
Che cosa non è un polinomio
Ogni termine deve essere un monomio. $\frac{2}{x} + 1$ e $x^{-1} + 3$ non sono polinomi, perché $\frac{2}{x}$ ha la lettera al denominatore e $x^{-1}$ ha un esponente negativo, che è lo stesso: $x^{-1} = \frac{1}{x}$. $\frac{x}{2} + 1$ invece lo è: $\frac{x}{2} = \frac{1}{2}x$, un monomio con coefficiente frazionario.
```

## Forma normale di un polinomio

Un polinomio è in **forma normale** (o ridotto) quando ogni termine è un monomio in forma normale e non ci sono due termini simili. Per ridurlo:

1. scrivi in forma normale ogni monomio che non lo è;
2. cerca i termini simili, cioè con la stessa parte letterale;
3. sommali, sommando i coefficienti con il loro segno;
4. cancella i termini che hanno coefficiente $0$;
5. ordina il risultato secondo le potenze decrescenti di una lettera (non cambia il polinomio, ma lo rende più facile da leggere: vedi più sotto).

```ad-example
Esempio 1: una lettera sola
$$3x^2 - 2x + 5 - x^2 + 4x - 7$$

I termini simili sono $3x^2$ e $-x^2$, poi $-2x$ e $4x$, poi $5$ e $-7$:

$$
\begin{aligned}
&(3 - 1)x^2 + (-2 + 4)x + (5 - 7) \\
&= 2x^2 + 2x - 2
\end{aligned}
$$

Il polinomio sembrava di sei termini, ma in forma normale è un trinomio.
```

```ad-example
Esempio 2: due lettere, frazioni e un monomio da ridurre
$$\frac{1}{2}a^2b + 2ab^2 - 3a \cdot ab + \frac{2}{3}ab^2 - b^3$$

Prima il monomio che non è in forma normale: $-3a \cdot ab = -3a^2b$. Poi i simili:

$$
\begin{aligned}
&\left(\frac{1}{2} - 3\right)a^2b + \left(2 + \frac{2}{3}\right)ab^2 - b^3 \\
&= -\frac{5}{2}a^2b + \frac{8}{3}ab^2 - b^3
\end{aligned}
$$
```

```ad-example
Esempio 3: termini che si annullano
$$4xy - 3x^2 + 2 - 4xy + x^2 + 5$$

$4xy$ e $-4xy$ sono opposti e la loro somma è $0$, quindi spariscono:

$$(-3 + 1)x^2 + (2 + 5) = -2x^2 + 7$$

Il risultato è un binomio.
```

```ad-warning
Il segno viaggia con il termine
Quando riordini i termini, ognuno si porta dietro il segno che ha davanti. In $5 - 2x^2 + 3x - 4x^2$ i termini simili sono $-2x^2$ e $-4x^2$, che danno $-6x^2$: il risultato è $-6x^2 + 3x + 5$, non $2x^2 + 3x + 5$.
```

## Termine noto

Il **termine noto** è il termine senza lettere di un polinomio in forma normale. In $2x^2 + 2x - 2$ il termine noto è $-2$; in $-\frac{5}{2}a^2b + \frac{8}{3}ab^2 - b^3$ non c'è un termine senza lettere, e si dice che il termine noto è $0$.

## Grado di un polinomio

Il **grado** (o grado complessivo) di un polinomio in forma normale è il grado più alto tra quelli dei suoi termini. Si calcola il grado di ogni termine, come per i monomi, e si prende il massimo.

Il **grado rispetto a una lettera** è l'esponente più alto con cui quella lettera compare nel polinomio in forma normale. Se la lettera non compare, il grado rispetto a quella lettera è $0$.

```ad-example
Esempio 4: grado complessivo e grado rispetto a ogni lettera
$$3x^2y^3 - 5x^4 + 2xy - 1$$

I gradi dei termini sono $5$, $4$, $2$ e $0$, quindi il polinomio ha grado $5$.

Rispetto a $x$ il grado è $4$ (da $-5x^4$), rispetto a $y$ è $3$ (da $3x^2y^3$). Il termine di grado più alto, $3x^2y^3$, non è quello con l'esponente di $x$ più alto: i tre gradi si cercano ognuno per conto suo.
```

```ad-example
Esempio 5: due termini di grado massimo
$$\frac{2}{3}a^3b^2 - a^4 + 7ab^4 - \frac{1}{2}$$

I gradi dei termini sono $5$, $4$, $5$ e $0$: il grado è $5$, anche se due termini lo raggiungono. Rispetto ad $a$ il grado è $4$, rispetto a $b$ è $4$. I coefficienti frazionari non contano.
```

```ad-warning
Il grado non è la somma dei gradi
Il grado di $x^3 + x^2$ è $3$, non $3 + 2 = 5$: si prende il grado più alto. E va calcolato sul polinomio ridotto: $x^3 + 2x - x^3$ è $2x$, che ha grado $1$, non $3$.
```

Un polinomio fatto da un numero diverso da zero, come $7$, ha grado $0$, come le costanti tra i monomi. Il **polinomio nullo** è il polinomio $0$, quello che in forma normale non ha termini, e come il monomio nullo non ha grado. Si ottiene, per esempio, riducendo $2x - 3 - 2x + 3$.

## Polinomi ordinati

Un polinomio è **ordinato** secondo le potenze decrescenti di una lettera se, leggendolo da sinistra a destra, gli esponenti di quella lettera diminuiscono; secondo le potenze crescenti se aumentano. Un termine in cui la lettera non compare conta come esponente $0$.

- $5x^4 - 2x^3 + x - 6$ è ordinato secondo le potenze decrescenti di $x$.
- $-6 + x - 2x^3 + 5x^4$ è lo stesso polinomio, ordinato secondo le potenze crescenti di $x$.
- $x^3 - 2x^2y + 5xy^2 - y^3$ è ordinato secondo le potenze decrescenti di $x$ e, insieme, secondo le potenze crescenti di $y$.

In queste lezioni, come nella maggior parte dei libri, i risultati si scrivono ordinati secondo le potenze decrescenti.

```ad-example
Esempio 6: ordinare un polinomio
$$3x - x^3 + 2 + 4x^2$$

Gli esponenti di $x$ sono $1$, $3$, $0$ e $2$. In ordine decrescente:

$$-x^3 + 4x^2 + 3x + 2$$
```

## Polinomi completi

Un polinomio è **completo** rispetto a una lettera se contiene tutte le potenze di quella lettera, dalla più alta fino alla potenza $0$, cioè fino al termine senza quella lettera.

- $x^3 - 2x^2 + x - 5$ è completo rispetto a $x$: ci sono $x^3$, $x^2$, $x$ e il termine noto.
- $x^3 + 2x - 1$ non è completo: manca il termine in $x^2$.
- $x^2 + 3xy - y^2$ è completo sia rispetto a $x$ sia rispetto a $y$.

Un polinomio incompleto si può scrivere come completo aggiungendo i termini che mancano con coefficiente $0$: $x^3 + 2x - 1 = x^3 + 0x^2 + 2x - 1$. Serve nella [divisione tra polinomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/divisione-tra-polinomi).

```ad-warning
Anche il termine noto conta
$x^3 + x^2 + x$ non è completo rispetto a $x$, perché manca la potenza $0$: il termine noto è $0$. Completato si scrive $x^3 + x^2 + x + 0$.
```

## Polinomi omogenei

Un polinomio è **omogeneo** se tutti i suoi termini hanno lo stesso grado.

- $x^3 - 2x^2y + 5y^3$ è omogeneo di grado $3$: ogni termine ha grado $3$.
- $a^2 + ab + b$ non è omogeneo: i primi due termini hanno grado $2$, l'ultimo $1$.

Un polinomio in una sola lettera con due o più termini non è mai omogeneo, perché in forma normale i suoi termini hanno esponenti tutti diversi.

## Valore numerico

Il **valore numerico** di un polinomio è il numero che ottieni sostituendo alle lettere dei numeri e facendo i conti. Si procede come per il valore numerico di un [monomio](/materiale/scuola-superiore/matematica/monomi-e-polinomi/monomi):

1. scrivi al posto di ogni lettera il suo numero, tra parentesi se è negativo o è una frazione;
2. calcola prima le potenze, poi i prodotti, per ultime le somme.

```ad-example
Esempio 7: una lettera e un numero negativo
Valore di $2x^2 - 3x + 1$ per $x = -2$:

$$
\begin{aligned}
&2(-2)^2 - 3(-2) + 1 \\
&= 2 \cdot 4 + 6 + 1 \\
&= 15
\end{aligned}
$$
```

```ad-example
Esempio 8: due lettere e una frazione
Valore di $x^2y - 2xy^2 + 3$ per $x = \frac{1}{2}$ e $y = -2$:

$$
\begin{aligned}
&\left(\frac{1}{2}\right)^2(-2) - 2\left(\frac{1}{2}\right)(-2)^2 + 3 \\
&= \frac{1}{4}\cdot(-2) - 2 \cdot \frac{1}{2} \cdot 4 + 3 \\
&= -\frac{1}{2} - 4 + 3 \\
&= -\frac{3}{2}
\end{aligned}
$$
```

```ad-warning
Il meno davanti alla potenza
Per $x = -3$, $x^2$ vale $(-3)^2 = 9$, mentre $-x^2$ vale $-(-3)^2 = -9$: prima la potenza, poi il meno davanti. Se sostituisci senza parentesi, $x^2$ diventa $-3^2 = -9$, che è sbagliato.
```

```ad-tip
Due valori che si leggono subito
Se tutte le lettere valgono $0$, il valore del polinomio è il termine noto. Se tutte valgono $1$, il valore è la somma dei coefficienti: $2x^2 - 3x + 1$ per $x = 1$ vale $2 - 3 + 1 = 0$.
```

Due polinomi che hanno la stessa forma normale hanno lo stesso valore numerico per qualsiasi numero. Il contrario non vale se provi un numero solo: $x^2$ e $x$ per $x = 1$ valgono entrambi $1$, ma sono polinomi diversi. Per questo il valore in un punto serve a scoprire un errore in un conto, come nelle [espressioni con polinomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/espressioni-con-polinomi), ma non a dimostrare che il conto è giusto.

## Polinomi in una variabile: la scrittura $P(x)$

Un polinomio che contiene una sola lettera, di solito $x$, si chiama polinomio in una variabile e si indica con una lettera maiuscola seguita dalla variabile tra parentesi:

$$P(x) = 2x^3 - x + 4$$

Il coefficiente del termine di grado più alto si chiama **coefficiente direttore**: qui è $2$. Il termine noto è $4$.

La scrittura $P(2)$ vuol dire "il valore numerico di $P(x)$ per $x = 2$":

$$
\begin{aligned}
P(2) &= 2 \cdot 2^3 - 2 + 4 \\
&= 16 - 2 + 4 \\
&= 18
\end{aligned}
$$

$$
\begin{aligned}
P(-1) &= 2(-1)^3 - (-1) + 4 \\
&= -2 + 1 + 4 \\
&= 3
\end{aligned}
$$

e $P(0) = 4$ è il termine noto. Allo stesso modo un polinomio in due lettere si può scrivere $P(x, y)$.

```ad-example
Esempio 9: $P(x)$ con una frazione
Con $P(x) = x^2 - \frac{3}{2}x + 1$:

$$
\begin{aligned}
P\left(\frac{1}{2}\right) &= \left(\frac{1}{2}\right)^2 - \frac{3}{2}\cdot\frac{1}{2} + 1 \\
&= \frac{1}{4} - \frac{3}{4} + 1 \\
&= \frac{1}{2}
\end{aligned}
$$
```

```ad-warning
P(2) non è un prodotto
$P(2)$ non vuol dire "$P$ per $2$": è il numero che ottieni mettendo $2$ al posto di $x$ nel polinomio $P(x)$.
```
