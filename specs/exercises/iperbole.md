# Iperbole

Generatore: `iperbole` (`src/lib/exercises/v2/generators/iperbole.ts`). Verifica indipendente:
`scripts/exercises/checkers/iperbole.py`. Lezione collegata: `docs/lezioni/riscritte/119-iperbole.md`. Pezzi
comuni: `src/lib/exercises/v2/ellisse-iperbole.ts` e `scripts/exercises/checkers/_ellisse_iperbole.py`.

Sette livelli nell'ordine della lezione: vertici reali, fuochi, asintoti, equazione da portare in forma canonica,
eccentricità, posizione di una retta, iperbole da due condizioni. Notazione della lezione:
$\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$ con i fuochi sull'asse $x$ e $= -1$ con i fuochi sull'asse $y$, $a$ sempre
sotto $x^2$; $c^2 = a^2 + b^2$; asintoti $y = \pm\frac{b}{a}x$ nei due casi; eccentricità $c$ diviso per il semiasse
trasverso ($a$ oppure $b$).

## Tipi di risposta

| Livello | Risposta | Scelta multipla |
|---|---|---|
| 1 | `choice`: `(\pm 3, 0)` oppure `(0, \pm 3)`, `values` l'asse e il quadrato del semiasse | la risposta stessa |
| 2, 4 | `choice`: `F(\pm 5, 0)` oppure `F(0, \pm 5)`, `values` l'asse e $c^2$ | la risposta stessa |
| 3 | `choice`: `y = \pm \frac{4}{3}x`, `values` la pendenza positiva | la risposta stessa |
| 5 | `number`: l'eccentricità, razionale esatto | costruita con l'esercizio |
| 6 | `choice` a quattro opzioni fisse: secante, tangente, esterna, parallela a un asintoto | la risposta stessa |
| 7 | `choice`: l'equazione canonica, `values` i due denominatori e il secondo membro | la risposta stessa |

## Livello 1: vertici reali

$a$ e $b$ interi distinti tra 2 e 9, secondo membro $1$ o $-1$ (metà e metà). Vertici reali: $(\pm a, 0)$ con il
secondo membro $1$, $(0, \pm b)$ con $-1$. Distrattori (avviso "Dove stanno i fuochi lo dice il segno"): i punti
sull'altro asse, i denominatori senza la radice.

1. $\frac{x^2}{36} - \frac{y^2}{16} = 1$: $(\pm 6, 0)$.
2. $\frac{x^2}{16} - \frac{y^2}{4} = -1$: $(0, \pm 2)$.

## Livello 2: fuochi

Stessa equazione. $c^2 = a^2 + b^2$, radicale semplificato. Distrattori (avviso "Nell'iperbole a² e b² si
sommano"): la differenza al posto della somma, l'asse sbagliato, $c = a^2 + b^2$ senza la radice.

1. $\frac{x^2}{9} - \frac{y^2}{16} = 1$: $F(\pm 5, 0)$.
2. $\frac{x^2}{16} - \frac{y^2}{4} = -1$: $F(0, \pm 2\sqrt{5})$.

## Livello 3: asintoti

$a$ e $b$ interi distinti tra 1 e 9, secondo membro $1$ o $-1$. Risposta $y = \pm\frac{b}{a}x$ con la frazione
ridotta (intero senza frazione). Distrattori: $\frac{a}{b}$, $\frac{b^2}{a^2}$, $\frac{a^2}{b^2}$.

1. $\frac{x^2}{36} - \frac{y^2}{16} = 1$: $y = \pm\frac{2}{3}x$.
2. $\frac{x^2}{9} - y^2 = -1$: $y = \pm\frac{1}{3}x$.

## Livello 4: equazione da portare in forma canonica

$px^2 - qy^2 = r$ con $p$, $q$ interi positivi primi tra loro, $r$ positivo o negativo, semiassi interi distinti
tra 1 e 6 ($a^2 = |r|/p$, $b^2 = |r|/q$). Si chiedono i fuochi. Ai distrattori del livello 2 si aggiunge
$c^2 = p + q$ (i coefficienti letti come denominatori).

1. $9x^2 - 16y^2 = 144$: $\frac{x^2}{16} - \frac{y^2}{9} = 1$, $F(\pm 5, 0)$.
2. $x^2 - 4y^2 = -4$: $\frac{x^2}{4} - y^2 = -1$, $F(0, \pm\sqrt{5})$.

## Livello 5: eccentricità

Semiassi e $c$ interi (terne pitagoriche con $c$ tra 5 e 17), secondo membro $1$ o $-1$. Risposta $e$, frazione
ridotta, sempre maggiore di 1. Distrattori: $c$ diviso per l'altro semiasse, il reciproco, il rapporto tra i
semiassi, $e^2$.

1. $\frac{x^2}{36} - \frac{y^2}{64} = 1$: $e = \frac{10}{6} = \frac{5}{3}$.
2. $\frac{x^2}{25} - \frac{y^2}{144} = -1$: $e = \frac{c}{b} = \frac{13}{12}$.

## Livello 6: posizione di una retta

Iperbole $\frac{x^2}{A} - \frac{y^2}{B} = 1$ e retta $y = mx + q$ con $q$ intero non nullo. Quattro casi, un quarto
ciascuno. `secante`, `tangente`, `esterna`: $m$ intero non nullo con $|m| \le 3$ e $Am^2 - B$ quadrato $t^2$ con
$t \ge 2$; tangente per $q = \pm t$, secante per $|q| > t$, esterna per $|q| < t$; la risolvente è di secondo grado e
i passaggi ne scrivono il discriminante. `parallela`: $A = a^2$, $B = b^2$ con $a$, $b$ interi distinti tra 1 e 6 e
$m = \pm\frac{b}{a}$: la risolvente è di primo grado, un solo punto comune, e la retta non è tangente (avviso "Un
solo punto comune non vuol dire tangente"). Opzioni fisse nell'ordine secante, tangente, esterna, parallela a un
asintoto.

1. $\frac{x^2}{5} - \frac{y^2}{4} = 1$, $y = -2x + 6$: $2x^2 - 15x + 25 = 0$, $\Delta = 25$, secante.
2. $\frac{x^2}{9} - \frac{y^2}{16} = 1$, $y = \frac{4}{3}x - 2$: parallela a un asintoto, un solo punto comune.

## Livello 7: l'iperbole da due condizioni

Due casi, metà ciascuno, e metà con i fuochi sull'asse $y$. `fuochi`: i fuochi $(\pm c, 0)$ o $(0, \pm c)$ con $c$
intero fino a 10 e un vertice reale con semiasse trasverso intero minore di $c$. `asintoti`: un vertice reale e gli
asintoti $y = \pm\frac{b}{a}x$, con $a$ e $b$ interi distinti tra 1 e 8. Risposta: l'equazione canonica.
Distrattori: il secondo membro con il segno sbagliato, i denominatori scambiati, la somma $c^2 + a^2$ o $c^2$ al
posto della differenza, i semiassi non elevati al quadrato.

1. $F(0, \pm 8)$, $B_2(0, 5)$: $\frac{x^2}{39} - \frac{y^2}{25} = -1$.
2. $A_2(5, 0)$, $y = \pm\frac{8}{5}x$: $\frac{x^2}{25} - \frac{y^2}{64} = 1$.

## Da evitare

- $a = b$ (iperbole equilatera, che ha il suo generatore).
- Rette per il centro ($q = 0$), e al livello 6 numeri della risolvente oltre le tre cifre nel coefficiente di $x$.
- Radicali non semplificati, pendenze scritte come frazioni non ridotte.

## Risposta aperta

Proposta: solo il livello 5 (`V`, un numero).
