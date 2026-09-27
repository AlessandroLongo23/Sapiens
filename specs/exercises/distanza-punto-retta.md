# Distanza di un punto da una retta

Generatore: `distanza-punto-retta` (`src/lib/exercises/v2/generators/distanza-punto-retta.ts`).
Verifica indipendente: `scripts/exercises/checkers/distanza_punto_retta.py`. Lezione collegata:
`docs/lezioni/riscritte/85-distanza-punto-retta.md` (nota in `docs/lezioni/note/85-distanza-punto-retta.md`,
sezione "Per il generatore").

Sei livelli nell'ordine della lezione, gli stessi sei proposti dalla nota: rette parallele agli assi, la
formula con la retta in forma implicita, la retta in forma esplicita con il risultato da razionalizzare, i
coefficienti frazionari (e la distanza dall'origine), la distanza tra due rette parallele, l'altezza e
l'area di un triangolo. Ogni livello aggiunge una difficoltà al precedente.

## Forma della risposta

- Distanza razionale (livelli 1 e 2, il livello 5 con $a$, $b$ pitagorici, l'area del livello 6): `number`,
  `value` come `"5/2"`.
- Distanza irrazionale: `expression` con `form: "rationalized"`, `value` in SymPy (`8*sqrt(5)/5`) e `latex`
  il valore razionalizzato e semplificato ($\frac{8\sqrt{5}}{5}$, $\sqrt{10}$, $2\sqrt{5}$): radicando senza
  fattori quadrati, nessuna radice al denominatore, frazione ridotta.
- Sempre la variante a scelta multipla: la risposta giusta e tre distrattori distinti, presi in ordine da
  una lista di errori della lezione (`params.wrong`, ognuno con `why`), ordinati a caso.

La notazione è quella della lezione: $d(P, r)$, $d(O, r)$, $d(r, s)$, $\overline{AB}$, $h$, rette scritte
$r\colon 3x + 4y - 14 = 0$, punti separati da `\quad` perché la pagina li mandi a capo.

## Rappresentazione (`params`)

- `case`: il caso del livello (`orizzontale`/`verticale`/`asse`, `implicita`, `esplicita`,
  `frazionari`/`origine`, `implicite`/`esplicite`, `area`/`altezza`).
- `P`: il punto (livelli 1-4); `line`: la retta in forma implicita `[a, b, c]` come la scrivono i passaggi.
  Livelli 3-4 anche `m`, `q`. Livello 5: `r`, `s` in forma implicita, `k` e `point` (il punto scelto). Livello
  6: `A`, `B`, `C`, `line` (la retta $AB$).
- `distance`: il valore esatto della risposta; `wrong`: i distrattori candidati.

Il verificatore non ricalcola dai `params`: rilegge punti e rette dal testo del problema (al livello 1
l'asse dalla consegna), costruisce `Line` e `Point` di SymPy e calcola `Line.distance`, `Triangle.area`,
`Line(A, B).distance(C)`. I `params` si confrontano solo con quello che ha letto.

## Livello 1: rette parallele agli assi

$P$ a coordinate intere non nulle tra $-8$ e $8$. Retta $y = k$ (35 %), $x = h$ (35 %) o un asse (30 %), con
$h$, $k$ non nulli tra $-8$ e $8$. Il punto non sta sulla retta.

- $P(3, -2)$, $r\colon y = 4$: $d(P, r) = |-2 - 4| = 6$ (esempio 1).
- $P(-6, 7)$, distanza dall'asse $y$: $|-6| = 6$.

Distrattori: la coordinata sbagliata ($|-2 - (-1)| = 1$ dell'avviso "La coordinata sbagliata"), il valore
assoluto dimenticato (se la differenza è negativa), la somma al posto della differenza, la distanza
dall'asse invece che dalla retta; per gli assi la distanza dall'origine $\sqrt{x_0^2 + y_0^2}$ e la somma
$|x_0| + |y_0|$.

## Livello 2: la formula, retta in forma implicita

$a$, $b$ da una terna pitagorica ($3, 4$; $6, 8$; $5, 12$ e scambiati), $a > 0$, segno di $b$ a caso. Si
sceglie prima la distanza intera $d$ ($1$-$5$, $1$-$3$ con $10$, $1$-$2$ con $13$) e il segno del
numeratore, poi $c = \pm d\sqrt{a^2 + b^2} - ax_0 - by_0$. $P$ tra $-6$ e $6$, $c \neq 0$, $|c| \le 30$,
$a$, $b$, $c$ senza fattori comuni.

- $P(4, 3)$, $r\colon 3x + 4y - 14 = 0$: $\frac{|12 + 12 - 14|}{5} = 2$ (esempio 2).
- $P(-4, 4)$, $r\colon 5x + 12y - 15 = 0$: $\frac{13}{13} = 1$.

Distrattori (avvisi "Il denominatore" e "Dimenticare il valore assoluto"): numeratore senza valore assoluto,
$|a| + |b|$ al denominatore, denominatore $a^2 + b^2$ senza radice, $c$ sotto la radice,
$\sqrt{a^2 - b^2}$ (il quadrato di un negativo letto come negativo), $c$ dimenticato al numeratore.

## Livello 3: retta in forma esplicita, da razionalizzare

$y = mx + q$ con $m \in \{\pm 1, \pm 2, \pm 3, \pm 4\}$, $q$ intero non nullo tra $-6$ e $6$, $P$ tra $-5$ e
$5$, numeratore fino a 30. La forma implicita dei passaggi è $mx - y + q = 0$, come nella lezione; il
risultato è sempre irrazionale ($m^2 + 1$ non è mai un quadrato).

- $P(2, -1)$, $y = 2x + 3$: $\frac{8}{\sqrt{5}} = \frac{8\sqrt{5}}{5}$ (esempio 3).
- $P(0, 3)$, $y = 4x - 2$: $\frac{5}{\sqrt{17}} = \frac{5\sqrt{17}}{17}$.

Distrattori: $b = 1$ invece di $-1$ (avviso "Leggere i coefficienti dalla forma esplicita",
$\frac{6}{\sqrt{5}}$), valore assoluto dimenticato, $|m| + 1$ al denominatore, $\sqrt{m^2 - 1}$ ("il
quadrato di $-1$ è $1$, non $-1$"), denominatore senza radice, $c$ sotto la radice.

## Livello 4: coefficienti frazionari, numeratore negativo; la distanza dall'origine

$y = \frac{p}{s}x + \frac{t}{s}$ con $s \in \{2, 3, 4\}$, $p$ primo con $s$ e $|p| \le 5$, $p^2 + s^2$ non
quadrato (niente $\frac{3}{4}$, $\frac{4}{3}$), $t$ non nullo tra $-9$ e $9$. Moltiplicando per $s$:
$px - sy + t = 0$. Sette volte su dieci un punto $P \neq O$ tra $-5$ e $5$ sotto la retta, così il
numeratore $px_0 - sy_0 + t$ è negativo come nell'esempio 4 (il verificatore lo controlla come
$mx_0 + q - y_0 < 0$); tre volte su dieci l'origine, con il numeratore $|c|$ (riquadro "La distanza
dall'origine").

- $P(-3, 1)$, $y = \frac{1}{2}x - 1$: $x - 2y - 2 = 0$, $\frac{|-7|}{\sqrt{5}} = \frac{7\sqrt{5}}{5}$ (esempio 4).
- $O(0, 0)$, $y = -\frac{3}{2}x + \frac{7}{2}$: $-3x - 2y + 7 = 0$, $\frac{7}{\sqrt{13}} = \frac{7\sqrt{13}}{13}$.

Distrattori: valore assoluto dimenticato ($-\frac{7\sqrt{5}}{5}$), il termine noto non moltiplicato per $s$,
il numeratore dalla forma frazionaria con il denominatore della forma intera (l'osservazione della lezione:
moltiplicare cambia numeratore e denominatore insieme), $|a| + |b|$, denominatore senza radice, $c$ sotto la
radice.

## Livello 5: distanza tra due rette parallele

Sei volte su dieci due rette in forma implicita, una con i coefficienti di $x$ e $y$ multipli ($k \in \{2,
3\}$) di quelli dell'altra e il termine noto non multiplo (la trappola dell'avviso "La formula diretta con
coefficienti diversi"): si sceglie un punto su un asse della retta semplice e la retta passa per lui. In
quattro casi su dieci di queste $a$, $b$ sono $3$, $4$ e la distanza è razionale. Quattro volte su dieci due
rette esplicite con lo stesso $m \in \{\pm 1, \pm 2, \pm 3\}$ e $q$ diversi.

- $r\colon 3x - 4y + 8 = 0$, $s\colon 6x - 8y - 9 = 0$: $P(0, 2)$, $\frac{25}{10} = \frac{5}{2}$ (esempio 6).
- $r\colon y = 2x + 1$, $s\colon y = 2x - 4$: $\frac{5}{\sqrt{5}} = \sqrt{5}$ (dopo l'esempio 6).

Distrattori: la formula diretta senza rendere uguali $a$ e $b$ ($\frac{17}{5}$), la stessa con il
denominatore della seconda retta, il termine noto moltiplicato ma la radice no; per le esplicite la
differenza delle $q$ (avviso "La differenza delle q non è la distanza"), il segno di $c$ sbagliato,
$|m| + 1$, denominatore senza radice.

## Livello 6: altezza e area di un triangolo

Vertici interi ($A$ tra $-4$ e $4$, $B = A + (\Delta x, \Delta y)$ con $\Delta x$, $\Delta y$ non nulli
fino a 6, $C$ tra $-4$ e $6$), $AB$ non parallelo agli assi, area fino a 30. Sei volte su dieci si chiede
l'area, quattro l'altezza relativa ad $AB$. I passaggi seguono i quattro punti della lezione: $\overline{AB}$,
la retta $AB$ in forma implicita con $a > 0$, $h$ come distanza di $C$, l'area.

- $A(1, 1)$, $B(5, 3)$, $C(2, 6)$: $x - 2y + 1 = 0$, $h = \frac{9}{\sqrt{5}}$, area $9$ (esempio 7).
- $A(4, -4)$, $B(2, 0)$, $C(0, 3)$: $2x + y - 4 = 0$, $h = \frac{\sqrt{5}}{5}$.

Distrattori dell'area: il prodotto non diviso per 2, il segno di $b$ sbagliato al numeratore, $|a| + |b|$
nell'altezza, l'altezza senza radice. Dell'altezza: l'altezza relativa a $BC$ (avviso "Il vertice giusto"),
il segno di $b$, $|a| + |b|$, denominatore senza radice, valore assoluto dimenticato.

## Esercizi da evitare

- Punto sulla retta (distanza zero); rette coincidenti al livello 5; triangoli degeneri.
- Nel testo: `1x`, `0y`, `+ -`, `- -`, termini nulli. Frazioni non ridotte.
- Opzioni con lo stesso valore scritto in due modi: $\frac{16\sqrt{5}}{10}$ vale quanto $\frac{8\sqrt{5}}{5}$
  e non può fare da distrattore; il verificatore confronta i valori e controlla anche la forma di ogni
  opzione.

## Verifiche fatte

- `sample.mts distanza-punto-retta 1000 all 1 | verify.py`: PASS, 6.000 campioni. Con il seed 7001: PASS.
  Quote dei casi con il seed 1: livello 1 asse 359, orizzontale 309, verticale 332; livello 4 frazionari
  712, origine 288; livello 5 implicite 607, esplicite 393; livello 6 area 603, altezza 397.
- Esercizi diversi su 1.000 (consegna e problema) con il seed 1: livello 1: 845; livello 2: 915; livello 3:
  956; livello 4: 855; livello 5: 949; livello 6: 1.000.
- Errori piantati, tutti bocciati: risposta numerica cambiata (L2); risposta irrazionale cambiata (L3);
  `choice.correct` spostato (L5); risposta scritta $\frac{7}{\sqrt{10}}$, non razionalizzata (L3); frazione
  non ridotta $\frac{38\sqrt{10}}{20}$ (L3); radicando non semplificato $\frac{21\sqrt{68}}{34}$ (L3); un
  distrattore uguale alla risposta ma non semplificato (L4); $m = 5$ al livello 3; numeratore positivo al
  livello 4; rette non parallele al livello 5; opzione con il LaTeX diverso dai `values` (L1); consegna
  "altezza" con la risposta dell'area (L6); `1x` nel testo (L2).
- `review.mts` esce con 0; `width.mts` esce con 0 (problema al massimo 189 px su 350, opzioni al massimo 79
  px su 252); `steps-scan.mts` non segnala niente; `tsc` ed `eslint` senza errori nel generatore.

## Figure

Nessun livello ha una figura, e tutti si reggono sul testo. Ne gioverebbero soprattutto il livello 1 (il
segmento verticale o orizzontale da $P$ alla retta, come la figura dell'esempio 1), il livello 5 (le due
parallele con il segmento perpendicolare) e il livello 6 (il triangolo con l'altezza, come nell'esempio 7);
nei passaggi dei livelli 2-4 una figura con la proiezione $H$ aiuterebbe a capire che cosa misura il numero.

## Domande per la revisione

- Livello 4, retta con $p < 0$: i passaggi moltiplicano per $s$ e portano tutto a primo membro senza
  cambiare segno ($-5x - 4y - 2 = 0$). La lezione non ha un esempio con $m$ negativo e frazionario: si
  preferisce $5x + 4y + 2 = 0$?
- Livello 5: la domanda dà per scontato che le rette siano parallele ("Le rette r e s sono parallele.") e la
  verifica sta nel primo passaggio; con la sola scelta multipla la parte "verifica che" dell'esempio 6 non si
  può chiedere. Va bene così o serve un livello a parte ("parallele, incidenti o coincidenti?"), che però è
  della lezione 83?
- Alcuni distrattori sono numeri con radici poco probabili ($\frac{13\sqrt{394}}{394}$ per "$c$ sotto la
  radice", $\frac{7\sqrt{41}}{18}$ per "$|a| + |b|$ nell'altezza"): corrispondono a errori della lezione ma si
  riconoscono a occhio. Li teniamo, o si preferiscono errori con numeri più piccoli anche se meno legati agli
  avvisi?
- Livello 6: l'area è sempre intera o mezza intera e si può trovare anche con la formula del prodotto
  vettoriale o con il rettangolo circoscritto; la scelta multipla non obbliga a passare per la distanza. Il
  caso "altezza" la obbliga: si vuole alzarne la quota?
