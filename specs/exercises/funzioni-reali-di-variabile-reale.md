# Funzioni reali e dominio

Generatore: `funzioni-reali-di-variabile-reale` (`src/lib/exercises/v2/generators/funzioni-reali-di-variabile-reale.ts`).
Verifica indipendente: `scripts/exercises/checkers/funzioni_reali_di_variabile_reale.py`, con gli aiuti comuni
del capitolo in `scripts/exercises/checkers/_funzioni.py`. Modulo comune dei generatori del capitolo:
`src/lib/exercises/v2/funzioni.ts`. Lezione collegata: `docs/lezioni/riscritte/105-funzioni-reali-di-variabile-reale.md`.

Sette livelli nell'ordine della lezione: dominio di una funzione fratta; radice con radicando di primo grado;
radicando di secondo grado; radice e denominatore insieme; frazione sotto radice; zeri; segno. Notazione della
lezione: $D$ per il dominio, $\mathbb{R} \setminus \{2,\ 3\}$ per i valori esclusi, intervalli con le parentesi
quadre rovesciate ($\mathopen{]}-\infty, -2] \cup [2, +\infty\mathclose{[}$), "zeri" e "segno" di una funzione.

## Si costruisce dalla risposta

Si scelgono prima gli zeri del denominatore o del radicando (interi tra $-7$ e $7$) e poi si scrive il
polinomio sviluppato: $(x - r)(x - s)$, con il segno meno davanti quando servono i valori interni. Il testo non
contiene mai `1x`, `0x`, `+ -`, `- -`.

## Tipi di risposta

| Livello | Risposta | Scelta multipla | Risposta aperta |
|---|---|---|---|
| 1 | `set`: i due valori esclusi dal dominio | `toChoice`, opzioni $\mathbb{R} \setminus \{\dots\}$ | `EXCLUDED` |
| 2, 3, 4, 5 | `choice`: un'unione di intervalli | la risposta stessa | no |
| 6 | `set`: gli zeri (anche nessuno) | `toChoice`, opzioni "$x = \dots$" o "nessuno zero" | `V` |
| 7 | `choice`: un'unione di intervalli aperti | la risposta stessa | no |

Un'unione di intervalli non ha un tipo di risposta aperta: quei livelli restano a scelta multipla.

## Livello 1: dominio di una funzione fratta

Consegna: "Trova il dominio della funzione." Frazione con il denominatore $(x - r)(x - s)$ sviluppato, $r \neq s$
interi tra $-7$ e $7$ (completo, spurio o puro), numeratore un numero o $x + n$ che non si annulla in $r$ e $s$.

- $f(x) = \dfrac{1}{x^2 + 7x + 12}$: $\Delta = 1$, zeri $-4$ e $-3$, $D = \mathbb{R} \setminus \{-4,\ -3\}$.
- $f(x) = \dfrac{x + 2}{x^2 - 16}$: $x^2 = 16$, $D = \mathbb{R} \setminus \{-4,\ 4\}$.

Distrattori: i segni scambiati ($\{3,\ 4\}$); un solo valore; lo zero del numeratore al posto di quelli del
denominatore, o aggiunto a quelli (avviso "Escludere i numeri sbagliati" della lezione 43); i coefficienti $b$ e
$c$ al posto degli zeri; nessun valore escluso.

## Livello 2: radice con radicando di primo grado

$f(x) = \sqrt{ax + b}$ con $a \in \{1, -1, 2, -2, 3\}$, $b \neq 0$ tra $-9$ e $9$. Risposta: una semiretta con
l'estremo incluso; con $a < 0$ il verso cambia.

- $f(x) = \sqrt{2x - 9}$: $x \geq \frac{9}{2}$, $D = \left[\frac{9}{2}, +\infty\right[$.
- $f(x) = \sqrt{-2x - 3}$: $-2x \geq 3$, $x \leq -\frac{3}{2}$, $D = \left]-\infty, -\frac{3}{2}\right]$.

Distrattori: l'estremo escluso (avviso "Maggiore o uguale, non maggiore"); la semiretta dall'altra parte (verso
non cambiato); l'estremo con il segno sbagliato; $\mathbb{R}$ senza il punto.

## Livello 3: radicando di secondo grado

$f(x) = \sqrt{\pm(x - r)(x - s)}$ sviluppato. Con il più: valori esterni, estremi compresi; con il meno: valori
interni. I due casi in parti uguali.

- $f(x) = \sqrt{x^2 + 7x + 12}$: $D = \mathopen{]}-\infty, -4] \cup [-3, +\infty\mathclose{[}$.
- $f(x) = \sqrt{-x^2 + x}$: $D = [0, 1]$.

Distrattori: interni al posto di esterni e viceversa; gli estremi esclusi; $\mathbb{R} \setminus \{r,\ s\}$ (la
radice trattata come un denominatore); una sola semiretta.

## Livello 4: radice e denominatore insieme

Tre casi, circa un terzo ciascuno: $\dfrac{\sqrt{x - a}}{x - b}$ con $b > a$ (un punto da togliere dalla
semiretta); lo stesso con $b < a$ (il valore escluso è già fuori: resta la semiretta); una radice al
denominatore, $\dfrac{n}{\sqrt{\pm(x - r)(x - s)}}$, con gli estremi esclusi.

- $f(x) = \dfrac{\sqrt{x + 6}}{x}$: $x \geq -6$ e $x \neq 0$, $D = [-6, 0\mathclose{[} \cup \mathopen{]}0, +\infty\mathclose{[}$.
- $f(x) = \dfrac{x - 4}{\sqrt{-x^2 - 5x}}$: $-x^2 - 5x > 0$, $D = \mathopen{]}-5, 0\mathclose{[}$.

Distrattori: la sola condizione della radice, o la sola condizione del denominatore (avviso "Unire le
condizioni invece di intersecarle"); gli estremi inclusi con la radice al denominatore; interni ed esterni
scambiati.

## Livello 5: frazione sotto radice

$f(x) = \sqrt{\dfrac{x - a}{x - b}}$ (due casi su tre circa) oppure $\sqrt{\dfrac{a - x}{x - b}}$, $a \neq b$.
Lo zero del numeratore è incluso, quello del denominatore escluso.

- $f(x) = \sqrt{\dfrac{x - 1}{x}}$: $D = \mathopen{]}-\infty, 0\mathclose{[} \cup [1, +\infty\mathclose{[}$.
- $f(x) = \sqrt{\dfrac{-x - 4}{x + 3}}$: $D = [-4, -3\mathclose{[}$.

Distrattori: le due condizioni separate $x - a \geq 0$ e $x - b > 0$ (avviso sulla frazione sotto radice); tutti
e due gli estremi inclusi; dentro e fuori scambiati; $\mathbb{R} \setminus \{b\}$; gli estremi inclusi ed esclusi
scambiati.

## Livello 6: zeri

Consegna: "Trova gli zeri della funzione." Quattro casi: $\dfrac{x^2 - a^2}{x - b}$ (due zeri); 
$\dfrac{(x - r)(x - s)}{x - r}$ sviluppato (uno zero, l'altro è escluso dal dominio); $(x - m)\sqrt{x - b}$ (due
zeri se $m > b$, uno se $m < b$); $\dfrac{x^2 + k}{x - b}$ (nessuno zero).

- $f(x) = \dfrac{x^2 - 8x + 15}{x - 3}$: il numeratore si annulla in $3$ e in $5$, ma $3$ non è nel dominio: $x = 5$.
- $f(x) = (x + 3)\sqrt{x + 2}$: dominio $x \geq -2$, lo zero è solo $x = -2$.

Distrattori: lo zero escluso contato lo stesso (avviso "Uno zero deve stare nel dominio"); lo zero del
denominatore; un solo zero su due; "nessuno zero".

## Livello 7: segno

Consegna: "Per quali x la funzione è positiva?" oppure "negativa?", in parti uguali. $\dfrac{x - a}{x - b}$ oppure
$\dfrac{x^2 - a^2}{x - b}$, zeri e valore escluso tutti diversi. Risposta: intervalli aperti.

- $f(x) = \dfrac{x - 2}{x + 4}$, negativa: $\mathopen{]}-4, 2\mathclose{[}$.
- $f(x) = \dfrac{x^2 - 25}{x - 6}$, positiva: $\mathopen{]}-5, 5\mathclose{[} \cup \mathopen{]}6, +\infty\mathclose{[}$.

Distrattori: il segno contrario; gli zeri inclusi; il segno del solo numeratore (denominatore dimenticato);
tutti gli estremi inclusi; $\mathbb{R}$ senza il valore escluso.

## Esercizi da evitare

- Zeri irrazionali o frazionari del radicando di secondo grado: gli estremi sono interi.
- Risposta vuota o uguale a tutto $\mathbb{R}$ nei livelli 2-5 e 7.
- Al livello 7, uno zero del numeratore uguale al valore escluso (la frazione si semplificherebbe).
- Frazioni scritte già scomposte con un fattore uguale sopra e sotto.

## Verifiche fatte

- `sample.mts funzioni-reali-di-variabile-reale 1000 all <seed> | verify.py` con i seed 1, 50001 e 777001.
- Il controllo legge la formula dal LaTeX del problema, la confronta con quella dei parametri e ricalcola dominio,
  zeri e segno valutando la formula, in aritmetica esatta, in ogni punto critico e tra un punto e l'altro.
- Errori piantati (risposta cambiata, estremo aperto al posto di chiuso, formula cambiata): bocciati.

## Limiti

- Niente radici cubiche né valori assoluti nel dominio (la lezione li ha nell'esempio 6): non danno condizioni, e
  un esercizio dove la risposta è sempre "nessuna condizione" insegna poco. Si possono aggiungere come caso del
  livello 4.
- Il segno è solo di funzioni fratte; il segno di funzioni con il valore assoluto (esempio 8 della lezione) non c'è.
- Nessun esercizio di lettura dal grafico.

## Domande per la revisione

- Livello 1: la risposta aperta sono i valori esclusi ($x \neq 2$, $\mathbb{R} \setminus \{2, 3\}$), come nella
  lezione 43. Al terzo anno va accettata anche l'unione di tre intervalli?
- Livelli 2-5 e 7: restano a scelta multipla perché la risposta è un'unione di intervalli. Va bene, o serve un
  tipo di risposta aperta per gli intervalli?
- Livello 5: il numeratore $a - x$ è scritto $-x + a$ (per esempio $-x - 4$). Meglio $-4 - x$?
- Livello 7: si chiede solo "positiva" o "negativa". Serve anche "positiva o nulla", con gli zeri inclusi?
