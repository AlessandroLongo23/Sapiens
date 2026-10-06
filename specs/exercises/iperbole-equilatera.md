# Iperbole equilatera e funzione omografica

Generatore: `iperbole-equilatera` (`src/lib/exercises/v2/generators/iperbole-equilatera.ts`). Verifica
indipendente: `scripts/exercises/checkers/iperbole_equilatera.py`. Lezione collegata:
`docs/lezioni/riscritte/120-iperbole-equilatera.md`. Pezzi comuni: `src/lib/exercises/v2/ellisse-iperbole.ts` e
`scripts/exercises/checkers/_ellisse_iperbole.py`.

Sei livelli nell'ordine della lezione: fuochi di $x^2 - y^2 = \pm a^2$; vertice di $xy = k$; fuoco di $xy = k$;
asintoti e centro di $y = \frac{ax + b}{x + d}$; centro con le frazioni; la funzione dagli asintoti e da un punto.
Notazione della lezione: $c = a\sqrt{2}$; per $xy = k$ vertici $(\pm\sqrt{|k|}, \pm\sqrt{|k|})$ e fuochi
$(\pm\sqrt{2|k|}, \pm\sqrt{2|k|})$ sulla bisettrice dei quadranti dei rami; asintoto verticale $x = -\frac{d}{c}$,
orizzontale $y = \frac{a}{c}$, centro $C\big(-\frac{d}{c}, \frac{a}{c}\big)$.

## Tipi di risposta

Tutti i livelli hanno risposta `choice` con quattro opzioni distinte.

| Livello | Opzioni | `values` |
|---|---|---|
| 1 | `F(\pm 3\sqrt{2}, 0)` oppure `F(0, \pm 3\sqrt{2})` | l'asse e $c^2$ |
| 2, 3 | un punto, `V(2, 2)` o `F(4, 4)` | le due coordinate |
| 4 | una retta `x = 1` o `y = 2`, oppure il centro `C(1, 2)` | la lettera e il valore, oppure le coordinate |
| 5 | il centro, con le frazioni | le coordinate |
| 6 | la funzione `y = \frac{-x + 5}{x - 2}` | $a$, $b$, $c = 1$, $d$ |

## Livello 1: fuochi di x² − y² = ±a²

$a^2$ preso da $1, 2, 4, 8, 9, 16, 18, 25, 32, 36, 49, 50$, secondo membro positivo o negativo (metà e metà).
Fuochi sull'asse $x$ se è positivo, sull'asse $y$ se è negativo, con $c^2 = 2a^2$ e il radicale semplificato.
Distrattori: i vertici al posto dei fuochi, l'asse sbagliato, $c = 2a^2$.

1. $x^2 - y^2 = 9$: $F(\pm 3\sqrt{2}, 0)$.
2. $x^2 - y^2 = -8$: $F(0, \pm 4)$.

## Livello 2: vertice di xy = k

$k = \pm n^2$ con $n$ intero tra 2 e 7. Si chiede il vertice con ascissa positiva: $(n, n)$ se $k > 0$, $(n, -n)$ se
$k < 0$. Distrattori (avviso "In xy = k il semiasse non è k"): il quadrante sbagliato, $(|k|, 0)$, $(0, |k|)$,
$(|k|, \pm|k|)$.

1. $xy = 16$: $V(4, 4)$.
2. $xy = -9$: $V(3, -3)$.

## Livello 3: fuoco di xy = k

$k = \pm 2m^2$ con $m$ intero tra 1 e 5, così che $\sqrt{2|k|} = 2m$ sia intero. Si chiede il fuoco con ascissa
positiva: $(2m, 2m)$ se $k > 0$, $(2m, -2m)$ se $k < 0$. Distrattori: il quadrante sbagliato, $(|k|, \pm|k|)$,
$(2|k|, \pm 2|k|)$ senza la radice, $(m, \pm m)$, un punto sull'asse $x$.

1. $xy = 18$: $F(6, 6)$.
2. $xy = -8$: $F(4, -4)$.

## Livello 4: asintoti e centro di y = (ax + b)/(x + d)

$a$ intero non nullo tra $-5$ e $5$, $d$ intero non nullo tra $-6$ e $6$, $b$ intero tra $-9$ e $9$ con $b \ne ad$,
e $a \ne -d$ (le due coordinate del centro diverse). Tre casi, un terzo ciascuno: `verticale` ($x = -d$),
`orizzontale` ($y = a$), `centro` ($C(-d, a)$). Distrattori (avviso "I segni e i coefficienti degli asintoti"): il
segno di $d$, $\frac{b}{d}$ al posto di $a$, la lettera sbagliata, le coordinate scambiate, lo zero del numeratore.

1. $y = \frac{2x + 1}{x - 1}$, asintoto verticale: $x = 1$.
2. $y = \frac{-x - 4}{x - 1}$, asintoto orizzontale: $y = -1$.

## Livello 5: centro con le frazioni

$c \in \{2, 3, 4, -2, -3\}$, $a$ e $d$ interi non nulli tra $-6$ e $6$, $b$ tra $-9$ e $9$, $ad - bc \ne 0$, i
quattro coefficienti senza divisori comuni, almeno una coordinata del centro non intera. Si chiede il centro.
Distrattori: i segni, $\frac{b}{d}$, le coordinate scambiate, $c$ dimenticato.

1. $y = \frac{x - 3}{2x + 4}$: $C\big(-2, \frac{1}{2}\big)$.
2. $y = \frac{5x + 3}{3x - 1}$: $C\big(\frac{1}{3}, \frac{5}{3}\big)$.

## Livello 6: la funzione dagli asintoti e da un punto

Asintoti $x = p$ e $y = q$ con $p$, $q$ interi non nulli tra $-5$ e $5$; $k$ intero non nullo tra $-6$ e $6$; punto
$P(p + h, q + k/h)$ con $h \in \{\pm 1, \pm 2, \pm 3\}$ divisore di $k$. Risposta
$y = \frac{qx + k - pq}{x - p}$, ridotta a una sola frazione. Distrattori: il segno di $p$ nel denominatore, $q$
dimenticato, $p$ e $q$ scambiati, il segno di $k$, $-pq$ dimenticato.

1. $x = 2$, $y = -1$, $P(3, 2)$: $k = 3$, $y = \frac{-x + 5}{x - 2}$.
2. $x = 4$, $y = 4$, $P(6, 3)$: $k = -2$, $y = \frac{4x - 18}{x - 4}$.

## Da evitare

- $k$ che non dà coordinate intere ai livelli 2 e 3.
- Frazioni con $ad - bc = 0$ (non sono funzioni omografiche), coefficienti con un divisore comune al livello 5.
- Al livello 6 un punto sugli asintoti.

## Risposta aperta

Nessun livello proposto: le risposte sono punti, rette o funzioni.
