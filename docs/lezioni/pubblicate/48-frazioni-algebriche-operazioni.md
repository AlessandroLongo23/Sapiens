# Operazioni con le frazioni algebriche

Le frazioni algebriche si sommano, si moltiplicano, si dividono e si elevano a potenza con le stesse regole delle [frazioni numeriche](/materiale/scuola-superiore/matematica/numeri-razionali/operazioni-in-q): per sommare serve un denominatore comune, per dividere si moltiplica per il reciproco. Cambiano due cose. I denominatori sono polinomi, quindi prima di ogni operazione si scompongono in fattori; e le lettere non possono assumere i valori che annullano un denominatore, quindi ogni esercizio comincia dalle condizioni di esistenza.

## Prima di ogni operazione

Ogni esercizio con le frazioni algebriche comincia con gli stessi due passi.

1. Scomponi in fattori tutti i denominatori, e anche i numeratori quando si può: con i fattori in vista si trovano il denominatore comune e le semplificazioni.
2. Scrivi le condizioni di esistenza (C.E.): ogni fattore di ogni denominatore deve essere diverso da zero. Il procedimento è nella lezione [Frazioni algebriche e condizioni di esistenza](/materiale/scuola-superiore/matematica/frazioni-algebriche/frazioni-algebriche-e-condizioni-di-esistenza).

Le C.E. si scrivono all'inizio, sull'espressione di partenza, e valgono fino al risultato, anche quando una semplificazione fa sparire il fattore da cui venivano. L'ultimo passo, dopo ogni operazione, è la [semplificazione](/materiale/scuola-superiore/matematica/frazioni-algebriche/semplificazione-delle-frazioni-algebriche) del risultato: si scompone il numeratore e si controlla se ha fattori in comune con il denominatore.

## Somma algebrica

### Frazioni con lo stesso denominatore

La somma algebrica di frazioni con lo stesso denominatore è la frazione che ha lo stesso denominatore e per numeratore la somma algebrica dei numeratori:

$$\frac{A}{D} + \frac{B}{D} - \frac{C}{D} = \frac{A + B - C}{D}$$

```ad-example
Esempio 1: stesso denominatore
Calcola $\dfrac{3x + 1}{x - 2} - \dfrac{x + 5}{x - 2}$.

C.E.: $x \neq 2$.

Il segno meno davanti alla seconda frazione vale per tutto il suo numeratore, che va tra parentesi:

$$
\begin{aligned}
&\frac{3x + 1 - (x + 5)}{x - 2} \\[4pt]
&= \frac{3x + 1 - x - 5}{x - 2} \\[4pt]
&= \frac{2x - 4}{x - 2}
\end{aligned}
$$

Il numeratore si scompone, $2x - 4 = 2(x - 2)$, e il fattore $x - 2$ si semplifica:

$$\frac{2(x - 2)}{x - 2} = 2$$

Il risultato è $2$ con C.E. $x \neq 2$: per $x = 2$ l'espressione di partenza non ha senso, anche se il risultato non ha più denominatori.
```

```ad-warning
Il meno davanti a una frazione
Scrivere $3x + 1 - x + 5$ al posto di $3x + 1 - x - 5$ è l'errore più comune nelle sottrazioni: il meno cambia il segno di tutti i termini del numeratore che segue, non solo del primo. Metti sempre il numeratore tra parentesi prima di togliere il meno.
```

### Frazioni con denominatori diversi

Con denominatori diversi si riducono prima le frazioni allo stesso denominatore, come nella lezione sulla [semplificazione](/materiale/scuola-superiore/matematica/frazioni-algebriche/semplificazione-delle-frazioni-algebriche). Il denominatore comune più semplice è il [MCM dei denominatori](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/mcd-e-mcm-di-polinomi).

1. Scomponi i denominatori e scrivi le C.E.
2. Se due denominatori hanno fattori opposti, come $x - 3$ e $3 - x$, riscrivi uno dei due portando il segno meno davanti alla frazione: $\dfrac{A}{3 - x} = -\dfrac{A}{x - 3}$.
3. Calcola il MCM dei denominatori: è il denominatore comune.
4. Per ogni frazione, dividi il MCM per il suo denominatore e moltiplica il quoziente per il numeratore.
5. Somma i numeratori ottenuti, con i loro segni, e riduci i termini simili.
6. Scomponi il numeratore e semplifica, se ha fattori in comune con il denominatore.

Il denominatore del risultato si lascia scomposto: così si vede subito se c'è qualcosa da semplificare, e servirà scomposto per le operazioni successive.

```ad-example
Esempio 2: denominatori primi tra loro
Calcola $\dfrac{1}{x - 3} + \dfrac{2}{x + 3}$.

C.E.: $x \neq 3$, $x \neq -3$.

I denominatori non hanno fattori comuni, quindi il MCM è il loro prodotto $(x - 3)(x + 3)$. Il MCM diviso per $x - 3$ dà $x + 3$, che moltiplica il primo numeratore; il MCM diviso per $x + 3$ dà $x - 3$, che moltiplica il secondo.

$$
\begin{aligned}
&\frac{1 \cdot (x + 3) + 2(x - 3)}{(x - 3)(x + 3)} \\[4pt]
&= \frac{x + 3 + 2x - 6}{(x - 3)(x + 3)} \\[4pt]
&= \frac{3x - 3}{(x - 3)(x + 3)}
\end{aligned}
$$

Il numeratore si scompone, $3x - 3 = 3(x - 1)$, ma $x - 1$ non compare al denominatore: non c'è niente da semplificare.

$$\frac{3(x - 1)}{(x - 3)(x + 3)}$$
```

```ad-example
Esempio 3: denominatori da scomporre
Calcola $\dfrac{3}{x^2 - 1} - \dfrac{1}{x^2 - x}$.

Scomposizione dei denominatori:

$$
\begin{gathered}
x^2 - 1 = (x - 1)(x + 1) \\
x^2 - x = x(x - 1)
\end{gathered}
$$

C.E.: $x \neq 0$, $x \neq 1$, $x \neq -1$.

Il fattore $x - 1$ è comune e compare una volta sola in ciascun denominatore; il MCM è $x(x - 1)(x + 1)$. Il MCM diviso per $(x - 1)(x + 1)$ dà $x$; diviso per $x(x - 1)$ dà $x + 1$.

$$
\begin{aligned}
&\frac{3x - (x + 1)}{x(x - 1)(x + 1)} \\[4pt]
&= \frac{2x - 1}{x(x - 1)(x + 1)}
\end{aligned}
$$

Il numeratore $2x - 1$ non ha fattori in comune con il denominatore.
```

```ad-warning
Sommare numeratori e denominatori
$\dfrac{1}{x} + \dfrac{1}{y}$ non fa $\dfrac{2}{x + y}$: con $x = y = 1$ la prima somma vale $2$, la seconda vale $1$. I denominatori non si sommano mai; si porta tutto al denominatore comune, e il risultato giusto è $\dfrac{x + y}{xy}$.
```

```ad-example
Esempio 4: fattori opposti
Calcola $\dfrac{x + 9}{x^2 - 9} + \dfrac{2}{3 - x}$.

Scomposizione: $x^2 - 9 = (x - 3)(x + 3)$. Il secondo denominatore $3 - x$ è l'opposto di $x - 3$, quindi si riscrive la seconda frazione con il segno meno davanti:

$$\frac{2}{3 - x} = -\frac{2}{x - 3}$$

C.E.: $x \neq 3$, $x \neq -3$.

Il MCM è $(x - 3)(x + 3)$:

$$
\begin{aligned}
&\frac{x + 9}{(x - 3)(x + 3)} - \frac{2}{x - 3} \\[4pt]
&= \frac{x + 9 - 2(x + 3)}{(x - 3)(x + 3)} \\[4pt]
&= \frac{x + 9 - 2x - 6}{(x - 3)(x + 3)} \\[4pt]
&= \frac{-x + 3}{(x - 3)(x + 3)}
\end{aligned}
$$

Il numeratore è $-x + 3 = -(x - 3)$, l'opposto di un fattore del denominatore:

$$\frac{-(x - 3)}{(x - 3)(x + 3)} = -\frac{1}{x + 3}$$

Con C.E. $x \neq 3$, $x \neq -3$: il fattore $x - 3$ è sparito, ma la sua condizione resta.
```

Lo stesso accorgimento dei fattori opposti vale con più lettere: in $\dfrac{x}{x - y} + \dfrac{y}{y - x}$, con C.E. $x \neq y$, la seconda frazione diventa $-\dfrac{y}{x - y}$, e la somma è $\dfrac{x - y}{x - y} = 1$.

### Un polinomio più una frazione

Un polinomio è una frazione con denominatore $1$, e il denominatore comune è quello della frazione:

$$
\begin{aligned}
1 - \frac{2}{x + 1} &= \frac{x + 1 - 2}{x + 1} \\[4pt]
&= \frac{x - 1}{x + 1}
\end{aligned}
$$

con C.E. $x \neq -1$.

## Prodotto

Il prodotto di due frazioni algebriche è la frazione che ha per numeratore il prodotto dei numeratori e per denominatore il prodotto dei denominatori:

$$\frac{A}{B} \cdot \frac{C}{D} = \frac{A \cdot C}{B \cdot D}$$

Le C.E. sono quelle di tutti e due i denominatori. Conviene scomporre numeratori e denominatori prima di moltiplicare e semplificare subito ogni fattore del numeratore di una frazione con lo stesso fattore al denominatore, suo o dell'altra frazione (la semplificazione in croce delle [frazioni numeriche](/materiale/scuola-superiore/matematica/numeri-razionali/operazioni-in-q)). I prodotti rimasti si lasciano indicati.

```ad-example
Esempio 5: prodotto con semplificazione in croce
Calcola $\dfrac{x^2 - 4}{3x} \cdot \dfrac{6x^2}{x^2 + 4x + 4}$.

Scomposizione: $x^2 - 4 = (x - 2)(x + 2)$ e $x^2 + 4x + 4 = (x + 2)^2$.

C.E.: $x \neq 0$, $x \neq -2$.

$$\frac{(x - 2)(x + 2)}{3x} \cdot \frac{6x^2}{(x + 2)^2}$$

Si semplificano $6x^2$ con $3x$, che dà $2x$ al numeratore, e $x + 2$ del primo numeratore con uno dei due fattori $x + 2$ del secondo denominatore:

$$\frac{x - 2}{1} \cdot \frac{2x}{x + 2} = \frac{2x(x - 2)}{x + 2}$$

Il risultato vale con C.E. $x \neq 0$, $x \neq -2$.
```

```ad-example
Esempio 6: prodotto con fattori opposti
Calcola $\dfrac{x - 1}{x + 3} \cdot \dfrac{x^2 + 3x}{1 - x^2}$.

Scomposizione: $x^2 + 3x = x(x + 3)$ e $1 - x^2 = (1 - x)(1 + x)$.

C.E.: $x \neq -3$, $x \neq 1$, $x \neq -1$.

Si semplifica $x + 3$. Resta $x - 1$ al numeratore e $1 - x$ al denominatore, che sono opposti: $\dfrac{x - 1}{1 - x} = -1$.

$$
\begin{aligned}
&\frac{x - 1}{x + 3} \cdot \frac{x(x + 3)}{(1 - x)(1 + x)} \\[4pt]
&= \frac{x(x - 1)}{(1 - x)(1 + x)} \\[4pt]
&= -\frac{x}{x + 1}
\end{aligned}
$$
```

## Quoziente

Per dividere una frazione algebrica per un'altra si moltiplica la prima per il reciproco della seconda:

$$\frac{A}{B} : \frac{C}{D} = \frac{A}{B} \cdot \frac{D}{C}$$

Le C.E. sono tre: $B \neq 0$, $D \neq 0$ e anche $C \neq 0$. Il numeratore $C$ del divisore diventa un denominatore quando si capovolge la frazione, e una frazione uguale a zero non ha reciproco, come il numero $0$.

```ad-example
Esempio 7: le C.E. del divisore
Calcola $\dfrac{x^2 - 1}{x^2 + 2x} : \dfrac{x - 1}{x}$.

Scomposizione: $x^2 - 1 = (x - 1)(x + 1)$ e $x^2 + 2x = x(x + 2)$.

C.E.: i denominatori danno $x \neq 0$ e $x \neq -2$; il numeratore del divisore dà $x - 1 \neq 0$, cioè $x \neq 1$.

$$
\begin{aligned}
&\frac{(x - 1)(x + 1)}{x(x + 2)} \cdot \frac{x}{x - 1} \\[4pt]
&= \frac{x + 1}{x + 2}
\end{aligned}
$$

Il risultato ha senso anche per $x = 0$ e per $x = 1$, ma l'espressione di partenza no: vale con C.E. $x \neq 0$, $x \neq -2$, $x \neq 1$.
```

```ad-warning
Dimenticare il numeratore del divisore
Nelle C.E. di una divisione si guardano i denominatori e anche il numeratore della frazione per cui si divide. Nell'esempio 7, senza la condizione $x \neq 1$, per $x = 1$ si starebbe dividendo per $\dfrac{0}{1} = 0$.
```

## Potenza

Per elevare una frazione algebrica a potenza si elevano numeratore e denominatore, con le regole delle [potenze in ℚ](/materiale/scuola-superiore/matematica/numeri-razionali/potenze-in-q):

$$\left(\frac{A}{B}\right)^n = \frac{A^n}{B^n}$$

La C.E. è $B \neq 0$. Il segno segue la regola dei numeri: con esponente pari il risultato è positivo, con esponente dispari il segno resta.

$$
\begin{gathered}
\left(\frac{x - 1}{2x}\right)^2 = \frac{(x - 1)^2}{4x^2} \\[6pt]
\left(-\frac{x}{x + 1}\right)^3 = -\frac{x^3}{(x + 1)^3}
\end{gathered}
$$

con C.E. $x \neq 0$ nella prima e $x \neq -1$ nella seconda. Il fattore $x - 1$ elevato al quadrato si lascia come $(x - 1)^2$: svilupparlo non aggiunge niente e nasconde il fattore.

Con un esponente negativo si prende la potenza del reciproco, quindi anche il numeratore diventa un denominatore e va messo nelle C.E.:

$$\left(\frac{x}{x - 2}\right)^{-2} = \frac{(x - 2)^2}{x^2}$$

con C.E. $x \neq 2$ e $x \neq 0$.

```ad-warning
Elevare solo il numeratore
$\left(\dfrac{x - 1}{2x}\right)^2$ non è $\dfrac{(x - 1)^2}{2x}$: l'esponente riguarda tutta la frazione, quindi anche il denominatore, compreso il suo coefficiente. $(2x)^2 = 4x^2$, non $2x^2$.
```

## Espressioni con le frazioni algebriche

Nelle espressioni valgono l'ordine delle operazioni e le parentesi delle [espressioni con le frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/espressioni-con-frazioni) numeriche: prima le potenze, poi moltiplicazioni e divisioni, infine somme e sottrazioni, dall'interno delle parentesi verso l'esterno.

1. Scomponi tutti i denominatori, e i numeratori delle frazioni per cui si divide.
2. Scrivi le C.E. dell'intera espressione: i fattori di tutti i denominatori, dei numeratori dei divisori e, se ci sono esponenti negativi, dei numeratori delle frazioni elevate a quegli esponenti.
3. Svolgi le operazioni nell'ordine giusto, semplificando a ogni passo.
4. Semplifica il risultato e riscrivi le C.E. accanto.

```ad-example
Esempio 8: una differenza divisa per una frazione
Calcola $\left(\dfrac{1}{x - 1} - \dfrac{1}{x + 1}\right) : \dfrac{2}{x^2 - 1}$.

Scomposizione: $x^2 - 1 = (x - 1)(x + 1)$. Il numeratore del divisore è $2$, che non si annulla mai.

C.E.: $x \neq 1$, $x \neq -1$.

Prima la parentesi, con denominatore comune $(x - 1)(x + 1)$:

$$
\begin{aligned}
&\frac{x + 1 - (x - 1)}{(x - 1)(x + 1)} \\[4pt]
&= \frac{2}{(x - 1)(x + 1)}
\end{aligned}
$$

Poi la divisione:

$$
\begin{aligned}
&\frac{2}{(x - 1)(x + 1)} \cdot \frac{(x - 1)(x + 1)}{2} \\[4pt]
&= 1
\end{aligned}
$$

Il risultato è $1$, con C.E. $x \neq 1$, $x \neq -1$.
```

```ad-example
Esempio 9: prodotti notevoli nella parentesi
Calcola $\left(\dfrac{x + 1}{x - 1} - \dfrac{x - 1}{x + 1}\right) : \dfrac{2x}{x^2 - 2x + 1}$.

Scomposizione: $x^2 - 2x + 1 = (x - 1)^2$.

C.E.: dai denominatori $x \neq 1$ e $x \neq -1$; dal numeratore del divisore $2x \neq 0$, cioè $x \neq 0$.

La parentesi, con denominatore comune $(x - 1)(x + 1)$. Al numeratore c'è una differenza di due quadrati di binomi:

$$
\begin{aligned}
&\frac{(x + 1)^2 - (x - 1)^2}{(x - 1)(x + 1)} \\[4pt]
&= \frac{x^2 + 2x + 1 - x^2 + 2x - 1}{(x - 1)(x + 1)} \\[4pt]
&= \frac{4x}{(x - 1)(x + 1)}
\end{aligned}
$$

La divisione: si moltiplica per il reciproco di $\dfrac{2x}{(x - 1)^2}$, poi si semplificano $4x$ con $2x$ e $x - 1$ con uno dei due fattori $x - 1$.

$$
\begin{aligned}
&\frac{4x}{(x - 1)(x + 1)} \cdot \frac{(x - 1)^2}{2x} \\[4pt]
&= \frac{2(x - 1)}{x + 1}
\end{aligned}
$$

Con C.E. $x \neq 0$, $x \neq 1$, $x \neq -1$.
```

```ad-warning
Semplificare i termini invece dei fattori
Nel numeratore $(x + 1)^2 - (x - 1)^2$ dell'esempio 9 non si può cancellare $(x + 1)^2$ con il fattore $x + 1$ del denominatore: $(x + 1)^2$ è un termine di una sottrazione, non un fattore di tutto il numeratore. Si semplifica solo dopo aver scritto il numeratore come prodotto, qui $4x$.
```

```ad-example
Esempio 10: potenza, quoziente e fattori opposti
Calcola $\left(1 - \dfrac{2}{x + 1}\right)^2 : \dfrac{x^2 - 2x + 1}{x^2 - 1} + \dfrac{4}{1 - x^2}$.

Scomposizione:

$$
\begin{gathered}
x^2 - 2x + 1 = (x - 1)^2 \\
x^2 - 1 = (x - 1)(x + 1) \\
1 - x^2 = -(x - 1)(x + 1)
\end{gathered}
$$

C.E.: dai denominatori $x \neq -1$ e $x \neq 1$; il numeratore del divisore, $(x - 1)^2$, dà di nuovo $x \neq 1$.

Prima la parentesi, poi la potenza:

$$
\begin{aligned}
1 - \frac{2}{x + 1} &= \frac{x - 1}{x + 1} \\[4pt]
\left(\frac{x - 1}{x + 1}\right)^2 &= \frac{(x - 1)^2}{(x + 1)^2}
\end{aligned}
$$

Poi la divisione, che viene prima della somma:

$$
\begin{aligned}
&\frac{(x - 1)^2}{(x + 1)^2} \cdot \frac{(x - 1)(x + 1)}{(x - 1)^2} \\[4pt]
&= \frac{x - 1}{x + 1}
\end{aligned}
$$

Infine la somma, con l'ultima frazione riscritta come $-\dfrac{4}{(x - 1)(x + 1)}$ e il denominatore comune $(x - 1)(x + 1)$:

$$
\begin{aligned}
&\frac{x - 1}{x + 1} - \frac{4}{(x - 1)(x + 1)} \\[4pt]
&= \frac{(x - 1)^2 - 4}{(x - 1)(x + 1)} \\[4pt]
&= \frac{x^2 - 2x - 3}{(x - 1)(x + 1)}
\end{aligned}
$$

Il numeratore è un [trinomio](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado) con somma $-2$ e prodotto $-3$: $x^2 - 2x - 3 = (x - 3)(x + 1)$. Si semplifica $x + 1$:

$$\frac{(x - 3)(x + 1)}{(x - 1)(x + 1)} = \frac{x - 3}{x - 1}$$

Con C.E. $x \neq 1$, $x \neq -1$.
```

```ad-tip
Un controllo con un numero
Scegli un valore che rispetti le C.E., sostituiscilo nell'espressione di partenza e nel risultato: devono venire uguali. Nell'esempio 10, con $x = 3$: la parentesi vale $1 - \dfrac{2}{4} = \dfrac{1}{2}$, il suo quadrato $\dfrac{1}{4}$; il divisore vale $\dfrac{4}{8} = \dfrac{1}{2}$, quindi il quoziente è $\dfrac{1}{2}$; l'ultima frazione vale $\dfrac{4}{-8} = -\dfrac{1}{2}$. Il totale è $0$, e anche $\dfrac{x - 3}{x - 1}$ per $x = 3$ vale $0$.
```
