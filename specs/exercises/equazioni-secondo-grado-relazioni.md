# Relazioni tra soluzioni e coefficienti

Generatore: `equazioni-secondo-grado-relazioni`
(`src/lib/exercises/v2/generators/equazioni-secondo-grado-relazioni.ts`). Verifica indipendente:
`scripts/exercises/checkers/equazioni_secondo_grado_relazioni.py`. Lezione collegata:
`docs/lezioni/riscritte/77-equazioni-secondo-grado-relazioni.md` (note in `docs/lezioni/note/`).

Sette livelli nell'ordine della lezione: somma e prodotto letti sui coefficienti, l'altra soluzione
nota una, l'equazione con soluzioni date, due numeri di somma e prodotto dati, la scomposizione del
trinomio, il segno delle soluzioni senza risolvere, le espressioni simmetriche. Notazione della
lezione: $s$ la somma, $p$ il prodotto, $x_1 < x_2$, $\Delta$, forma $x^2 - sx + p = 0$, "permanenza"
e "variazione".

## Si costruisce dalla risposta

Si scelgono prima le soluzioni (intere, frazionarie $p/q$ oppure $m \pm \sqrt{n}$) o la somma e il
prodotto, poi si sviluppa l'equazione. I coefficienti sono interi, al massimo 100 in valore assoluto,
e il testo non contiene mai `1x`, `0x`, `+ -`, `- -`, termini nulli. Ai livelli 1 e 7 si scelgono
invece coefficienti piccoli (le soluzioni possono essere irrazionali: il punto è non calcolarle).

## Tipi di risposta

| Livello | Risposta | Scelta multipla |
|---|---|---|
| 1 | `choice` (la coppia $s$, $p$ oppure "nessuna soluzione reale") | la risposta stessa |
| 2 | `number` | `toChoice` |
| 3 | `choice` (un'equazione: nessun tipo ha tre coefficienti) | la risposta stessa |
| 4 | `set` (vuoto se i numeri non esistono) | `toChoice` |
| 5 | `expression`, `form = "factored"` (per l'irriducibile, il trinomio stesso con `params.irreducible`) | `toChoice` |
| 6 | `choice` (cinque casi) | la risposta stessa |
| 7 | `number` | `toChoice` |

Quattro opzioni distinte, i distrattori presi dagli errori dei riquadri `ad-warning` della lezione.

## Livello 1: somma e prodotto dai coefficienti

$ax^2 + bx + c = 0$ con $a$ tra 1 e 5, $b$ e $c$ non nulli con $|b|, |c| \le 10$, senza fattori
comuni. Circa 80% con $\Delta \ge 0$ (caso `reali`), 20% con $\Delta < 0$ (`delta<0`, risposta
"Nessuna soluzione reale"). Distrattori: $s = \frac{b}{a}$ (segno della somma), "nessuna soluzione",
$p = -\frac{c}{a}$, $s$ e $p$ scambiati; con $\Delta < 0$, i valori $-\frac{b}{a}$ e $\frac{c}{a}$
calcolati lo stesso (avviso "Somma e prodotto con il discriminante negativo").

1. $2x^2 - 7x + 3 = 0$: $\Delta = 25$, $s = \frac{7}{2}$, $p = \frac{3}{2}$.
2. $x^2 + x + 5 = 0$: $\Delta = -19$, nessuna soluzione reale.

## Livello 2: l'altra soluzione, nota una

La soluzione data è intera, non nulla, tra $-6$ e $6$; l'altra è $p/q$ con $q \le 3$, $|p| \le 9$,
diversa e non opposta (l'equazione è completa). Si ricava dal prodotto e si controlla con la somma,
come nell'esempio 3. Distrattori: $\frac{b}{a} - x_1$ (segno della somma), $p \cdot x_1$ (moltiplicato
invece di diviso), $-x_2$, $-\frac{p}{x_1}$, poi valori vicini.

1. Il numero $2$ è una soluzione di $3x^2 - 5x - 2 = 0$: $p = -\frac{2}{3}$, $x_2 = -\frac{1}{3}$.
2. Il numero $5$ è una soluzione di $x^2 - 7x + 10 = 0$: $p = 10$, $x_2 = 2$.

## Livello 3: l'equazione con soluzioni date

Soluzioni intere (40%, in $[-9, 9]$), frazionarie (35%, $p/q$ con $q \le 5$, $|p| \le 7$, almeno una
non intera) o $m \pm \sqrt{n}$ (25%, $m$ tra $-5$ e $5$ non nullo, $n \in \{2, 3, 5, 6, 7\}$). Mai
opposte, mai nulle. Risposta: $x^2 - sx + p = 0$ moltiplicata per il denominatore comune, con
coefficienti interi primitivi e $a > 0$. Distrattori: segno di $s$ non cambiato ($x^2 + sx + p$,
avviso "Il segno meno davanti a s"), segno di $p$ cambiato, tutti e due, $s$ e $p$ scambiati; con i
radicali, $p = m^2 + n$ (differenza di quadrati sbagliata). Il controllo verifica che nessun
distrattore abbia le soluzioni date.

1. $x_1 = -\frac{1}{2}$, $x_2 = \frac{2}{3}$: $s = \frac{1}{6}$, $p = -\frac{1}{3}$, $6x^2 - x - 2 = 0$.
2. $x_1 = -2 - \sqrt{3}$, $x_2 = -2 + \sqrt{3}$: $s = -4$, $p = 4 - 3 = 1$, $x^2 + 4x + 1 = 0$.

## Livello 4: due numeri di somma e prodotto dati

Problema in prosa. Tre casi: `numeri` (45%, due interi distinti non nulli in $[-12, 15]$ con somma
non nulla), `non esistono` (20%, $p > \frac{s^2}{4}$: risposta vuota), `rettangolo` (35%, lati interi
distinti tra 2 e 20, dati perimetro e area). Distrattori: le soluzioni di $x^2 + sx + p$ (segno),
per il rettangolo il perimetro usato come somma (avviso "Metà perimetro, non perimetro"), una coppia
con il prodotto giusto e la somma sbagliata (i tentativi della lezione 36), "Non esistono"; quando i
numeri non esistono, i valori $\frac{s \pm \sqrt{|\Delta|}}{2}$ (il discriminante preso come
positivo) e coppie con il prodotto giusto. Le coppie con i radicali vanno su due righe.

1. Somma $10$ e prodotto $21$: $x^2 - 10x + 21 = 0$, $\Delta = 16$, i numeri sono $3$ e $7$.
2. Perimetro $34\ \text{cm}$, area $60\ \text{cm}^2$: somma $17$, $x^2 - 17x + 60 = 0$, lati $5$ e $12$.

## Livello 5: scomporre il trinomio con le soluzioni

Consegna: fattori di primo grado, anche con i radicali, altrimenti "irriducibile". Casi:
`frazionarie` (30%, $a > 0$, almeno una soluzione non intera), `a negativo` (20%, $|a| \ge 2$),
`irrazionali` (20%, $a = 1$, soluzioni $m \pm \sqrt{n}$), `delta=0` (15%, $\pm(qx - p)^2$),
`irriducibile` (15%, $\Delta < 0$). Scomposta fino in fondo vuol dire: un intero davanti (anche
$-1$), poi fattori di primo grado; se razionali, a coefficienti interi primitivi; se con i radicali,
nella forma $x - m \mp \sqrt{n}$. Il controllo lo verifica sull'espressione scritta, senza lasciare
che SymPy distribuisca il numero davanti, sia nel valore sia nel LaTeX. Distrattori: $a$ dimenticato
($\left(x + \frac{1}{2}\right)\left(x - \frac{2}{3}\right)$, avviso "Dimenticare il coefficiente a"),
segni cambiati nelle parentesi, $3$ davanti invece di $-3$ (avviso "Il coefficiente a viene dal
trinomio"), denominatori scambiati tra le parentesi, $m \pm 2\sqrt{n}$ ($\sqrt{\Delta}$ non diviso),
"irriducibile" quando non lo è; per l'irriducibile, coppie con il prodotto giusto e la somma sbagliata.

1. $6x^2 - x - 2 = (2x + 1)(3x - 2)$.
2. $x^2 + 10x + 20 = (x + 5 - \sqrt{5})(x + 5 + \sqrt{5})$.
3. $2x^2 - 4x + 5$: $\Delta = -24$, irriducibile.

## Livello 6: segno delle soluzioni senza risolvere

$a$, $b$, $c$ tutti diversi da zero; cinque casi in parti uguali: due positive, due negative,
discordi con la positiva maggiore in valore assoluto, discordi con la negativa maggiore, nessuna
soluzione reale. Un terzo circa con $a < 0$. Le equazioni senza soluzioni hanno metà delle volte i
segni $+\,-\,+$ (due variazioni: la trappola dell'avviso "Contare le variazioni senza guardare il
discriminante"). Soluzioni $p/q$ con $q \le 3$, mai opposte né coincidenti. Distrattori: la regola
dei segni letta senza discriminante, $s$ con il segno sbagliato, $a$ ignorato ($s = -b$, $p = c$),
poi gli altri casi.

1. $3x^2 - 11x + 6 = 0$: $\Delta = 49$, segni $+\,-\,+$, due soluzioni positive.
2. $-x^2 + 4x + 5 = 0$: $a$ e $c$ discordi, segni $-\,+\,+$, discordi con la positiva maggiore.

## Livello 7: espressioni simmetriche

$a \in \{1, 2, 3\}$, $b$ e $c$ non nulli con $|b|, |c| \le 9$, $\Delta > 0$ (le soluzioni possono
essere irrazionali). Espressioni della tabella della lezione: $x_1^2 + x_2^2$ e
$\frac{1}{x_1} + \frac{1}{x_2}$ (un quarto ciascuna), $(x_1 - x_2)^2$ e
$\frac{1}{x_1^2} + \frac{1}{x_2^2}$ (un sesto), $x_1^2x_2 + x_1x_2^2$ e $x_1^3 + x_2^3$ (un
dodicesimo). Valore razionale non nullo, denominatore al massimo 81, numeratore al massimo 400. Il
controllo sostituisce le soluzioni esatte nell'espressione. Distrattori: $s^2$ (avviso "La somma dei
quadrati non è il quadrato della somma"), $s^2 + 2p$ (avviso "Il meno davanti al doppio prodotto"),
$\frac{p}{s}$, $\frac{s^2 - 2p}{p}$, $s^3$, segni di $s$ sbagliati, poi valori vicini.

1. $2x^2 - 6x + 1 = 0$, $x_1^2 + x_2^2$: $s = 3$, $p = \frac{1}{2}$, $9 - 1 = 8$.
2. $3x^2 + 5x - 1 = 0$, $\frac{1}{x_1^2} + \frac{1}{x_2^2}$: $\frac{31}{9} : \frac{1}{9} = 31$.

## Verifiche fatte

- `sample.mts … 1000 all 1 | verify.py`: PASS; con seed di partenza 7001: PASS.
- Esercizi diversi su 1.000 per livello (seed 1): L1 724, L2 512, L3 464, L4 533, L5 605, L6 680,
  L7 813.
- `width.mts`: esce con 0; problema più largo 174 px (livello 6), opzione più larga 216 px
  (livello 6, le due righe dei "discordi").
- `review.mts` esce con 0; lo script dei passaggi (`presentStep` + KaTeX) non trova errori.
- Errori piantati a mano, tutti bocciati: opzione giusta spostata (tutti i livelli); al livello 1
  "s, p" al posto di "nessuna soluzione" e LaTeX dell'opzione diverso dai valori; al livello 2
  risposta cambiata e numero dato che non è una soluzione; al livello 3 equazione giusta ma con i
  coefficienti raddoppiati (non primitiva) e un distrattore con le stesse soluzioni; al livello 4
  risposta cambiata, "non esistono" con due numeri, perimetro cambiato nel testo, coppia con i radicali su una riga; al livello 5
  risposta con $a$ davanti e le frazioni nelle parentesi (valore giusto, non semplificata), opzione
  giusta scritta così, distrattore uguale al trinomio non scomposto, radicale cambiato,
  irriducibile segnato come scomponibile, caso sbagliato; al livello 6 etichette scambiate e un
  coefficiente nullo; al livello 7 risposta ed espressione cambiate; un trattino lungo nei passaggi.

## Figure

Nessun livello ne ha bisogno. L'unico candidato è il rettangolo del livello 4, che il testo descrive
già per intero.

## Domande per la revisione

- Livello 5: la consegna chiede la scomposizione "anche con i radicali", quindi
  $x^2 + 4x + 2$ non è irriducibile. La lezione dice di seguire il libro: va bene questa scelta, o
  le soluzioni irrazionali vanno tolte dal livello?
- Livello 3: la risposta è sempre l'equazione con i coefficienti interi più piccoli e $a > 0$. Un
  multiplo (per esempio $-6x^2 + x + 2 = 0$) è giusto ma non compare mai tra le opzioni: serve dirlo
  nella consegna in modo più esplicito?
- Livello 7: con $a = 1$, $(x_1 - x_2)^2 = s^2 - 4p$ coincide con $\Delta$, che è già nel primo
  passaggio. Lo teniamo (è un'osservazione utile) o togliamo quell'espressione quando $a = 1$?
