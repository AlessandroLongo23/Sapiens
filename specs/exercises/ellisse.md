# Ellisse

Generatore: `ellisse` (`src/lib/exercises/v2/generators/ellisse.ts`). Verifica indipendente:
`scripts/exercises/checkers/ellisse.py`. Lezione collegata: `docs/lezioni/riscritte/118-ellisse.md`. Pezzi comuni
alle lezioni 118-120: `src/lib/exercises/v2/ellisse-iperbole.ts` e `scripts/exercises/checkers/_ellisse_iperbole.py`.

Sette livelli nell'ordine della lezione: semiassi, fuochi, equazione da portare in forma canonica, eccentricità,
posizione di una retta, tangente in un punto, ellisse da due condizioni. Notazione della lezione: equazione
canonica $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ con $a$ sempre sotto $x^2$ (con i fuochi sull'asse $y$ è $b > a$);
$c^2$ è la differenza tra il denominatore più grande e il più piccolo; l'eccentricità è $c$ diviso per il semiasse
maggiore; "secante, tangente, esterna"; coordinate con la virgola.

## Si costruisce dalla risposta

Si scelgono prima i semiassi (o il punto di contatto, o il valore di $q$ che rende tangente la retta) e poi si
scrive l'equazione. Il centro è sempre l'origine. Il testo non contiene mai `1x`, `0x`, `+ -`, `- -`, denominatori
uguali a 1 scritti come frazione.

## Tipi di risposta

| Livello | Risposta | Scelta multipla |
|---|---|---|
| 1 | `choice`: `a = 5,\ b = 3`, `values` i due semiassi | la risposta stessa |
| 2, 3 | `choice`: `F(\pm 4, 0)` oppure `F(0, \pm 4)`, `values` l'asse e $c^2$ | la risposta stessa |
| 4 | `number`: l'eccentricità, razionale esatto | costruita con l'esercizio |
| 5 | `choice` a tre opzioni fisse: secante, tangente, esterna | la risposta stessa |
| 6 | `choice`: la retta `px + qy = r`, `values` $p$, $q$, $r$ interi primi tra loro con $r > 0$ | la risposta stessa |
| 7 | `choice`: l'equazione canonica, `values` i due denominatori | la risposta stessa |

Quattro opzioni distinte in tutti i livelli tranne il 5, che ne ha tre.

## Livello 1: semiassi dall'equazione canonica

$a$ e $b$ interi distinti tra 2 e 9; l'equazione è data in forma canonica. Si chiedono $a$ e $b$. Distrattori
(avviso "I denominatori sono i quadrati dei semiassi"): i denominatori presi come semiassi, i semiassi scambiati,
i denominatori scambiati.

1. $\frac{x^2}{49} + \frac{y^2}{4} = 1$: $a = 7$, $b = 2$.
2. $\frac{x^2}{9} + \frac{y^2}{25} = 1$: $a = 3$, $b = 5$.

## Livello 2: fuochi

Stessa equazione del livello 1. Si chiedono i fuochi: sull'asse del denominatore più grande, con
$c^2 = |a^2 - b^2|$ e $c$ scritto con il radicale semplificato quando non è intero. Circa metà con i fuochi
sull'asse $y$. Distrattori: l'asse sbagliato (avviso "Non sempre a è il semiasse maggiore"), $c^2 = a^2 + b^2$
(la formula dell'iperbole), $c = a^2 - b^2$ senza la radice.

1. $\frac{x^2}{49} + \frac{y^2}{4} = 1$: $F(\pm 3\sqrt{5}, 0)$.
2. $\frac{x^2}{9} + \frac{y^2}{25} = 1$: $F(0, \pm 4)$.

## Livello 3: equazione da portare in forma canonica

$px^2 + qy^2 = r$ con $p$, $q$ interi positivi primi tra loro e $r$ il loro multiplo che dà semiassi interi distinti
tra 1 e 6 ($a^2 = r/p$, $b^2 = r/q$). Si chiedono i fuochi. Ai distrattori del livello 2 si aggiunge l'errore di
leggere i coefficienti come denominatori ($c^2 = |p - q|$, sull'asse del coefficiente più grande).

1. $4x^2 + 25y^2 = 100$: $\frac{x^2}{25} + \frac{y^2}{4} = 1$, $F(\pm\sqrt{21}, 0)$.
2. $x^2 + 16y^2 = 16$: $F(\pm\sqrt{15}, 0)$.

## Livello 4: eccentricità

Semiasse maggiore, semiasse minore e $c$ interi, da una terna pitagorica con semiasse maggiore tra 5 e 17; metà
con i fuochi sull'asse $y$. Risposta: $e$, frazione ridotta. Distrattori (avviso "Il denominatore
dell'eccentricità"): $c$ diviso per il semiasse minore, il rapporto tra i semiassi, il reciproco, $e^2$.

1. $\frac{x^2}{225} + \frac{y^2}{81} = 1$: $c = 12$, $e = \frac{4}{5}$.
2. $\frac{x^2}{9} + \frac{y^2}{25} = 1$: $c = 4$, $e = \frac{c}{b} = \frac{4}{5}$.

## Livello 5: posizione di una retta

Ellisse $\frac{x^2}{A} + \frac{y^2}{B} = 1$ con $A$ tra 2 e 30 e $B$ tra 2 e 40, interi diversi; retta
$y = mx + q$ con $m \in \{\pm 1, \pm 2\}$ e $q$ intero non nullo. Costruita in modo che $Am^2 + B$ sia un quadrato
$t^2$: la retta è tangente per $q = \pm t$, secante per $|q| < t$, esterna per $|q| > t$. Un terzo ciascuna. Opzioni
fisse nell'ordine secante, tangente, esterna. I passaggi scrivono la risolvente e il suo discriminante.

1. $\frac{x^2}{30} + \frac{y^2}{6} = 1$, $y = x + 6$: risolvente $x^2 + 10x + 25 = 0$, $\Delta = 0$, tangente.
2. $\frac{x^2}{20} + \frac{y^2}{5} = 1$, $y = -x + 3$: $5x^2 - 24x + 16 = 0$, $\Delta = 256$, secante.

## Livello 6: tangente in un punto dell'ellisse

Ellisse con denominatori interi diversi tra 2 e 60 e un punto $P$ con coordinate intere non nulle (in valore
assoluto fino a 7) che le appartiene. Si chiede la tangente in $P$ con la formula di sdoppiamento, nella forma
$px + qy = r$ con coefficienti interi primi tra loro e $r > 0$. Distrattori: i denominatori dimenticati
($x_0x + y_0y = 1$), i denominatori scambiati, un segno sbagliato, le coordinate al quadrato.

1. $\frac{x^2}{20} + \frac{y^2}{5} = 1$, $P(4, 1)$: $x + y = 5$.
2. $\frac{x^2}{33} + \frac{y^2}{22} = 1$, $P(-3, 4)$: $-x + 2y = 11$.

## Livello 7: l'ellisse da due condizioni

Semiasse maggiore $M$ intero tra 3 e 9, $c$ intero tra 1 e $M - 1$; metà con i fuochi sull'asse $y$. Due casi, metà
ciascuno: `fuochi` (i fuochi e il vertice dell'asse maggiore) e `eccentricità` (il vertice dell'asse maggiore e
$e = c/M$, con l'asse dei fuochi detto nella consegna). Risposta: l'equazione canonica. Distrattori: la somma al
posto della differenza, i denominatori scambiati, $c^2$ come secondo denominatore.

1. $F(\pm 5, 0)$, $A_2(6, 0)$: $\frac{x^2}{36} + \frac{y^2}{11} = 1$.
2. Fuochi sull'asse $y$, $B_2(0, 5)$, $e = \frac{3}{5}$: $\frac{x^2}{16} + \frac{y^2}{25} = 1$.

## Da evitare

- $a = b$ (è una circonferenza), semiassi uguali a 1 nei livelli 1 e 2.
- Rette con $q = 0$ al livello 5; punti sugli assi al livello 6 (la tangente sarebbe parallela a un asse).
- Opzioni che dicono la stessa cosa con due scritture, radicali non semplificati.

## Risposta aperta

Proposta: solo il livello 4 (`V`, un numero). Gli altri livelli hanno per risposta una coppia, dei punti o
un'equazione, e restano a scelta multipla.
