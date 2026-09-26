# Regola di Ruffini e teorema del resto

Generatore: `polinomi-ruffini` (`src/lib/exercises/v2/generators/polinomi-ruffini.ts`).
Verifica indipendente: `scripts/exercises/checkers/polinomi_ruffini.py`. Lezione collegata:
`docs/lezioni/riscritte/33-polinomi-ruffini.md` (nota in `docs/lezioni/note/33-polinomi-ruffini.md`).

Sette livelli nell'ordine della lezione: prima la divisione con la tabella (a intero positivo,
dividendo incompleto, a negativo, a frazionario), poi il teorema del resto, poi il teorema di
Ruffini (quale binomio divide il polinomio, e il valore di un parametro k). La scomposizione con
Ruffini ha un altro generatore (lezione 37).

## Forma della risposta

Nei livelli 1-4 la risposta è una coppia: il quoziente e il resto. Nessuno dei tipi di risposta di
oggi (`number`, `expression`, `set`) tiene due oggetti, e il sito mostra solo la scelta multipla;
quindi la risposta è direttamente una `choice` fra quattro coppie, con
`values = [quoziente in SymPy, resto]`. Ogni coppia sta su due righe, in un
`\begin{gathered} Q(x) = 2x^2 + x + 4 \\ R = 19 \end{gathered}`: su una riga sola un quoziente di
terzo o quarto grado con il suo resto supera i 252 px del pulsante di risposta sul telefono. Le due
righe valgono per tutte le opzioni, così le quattro risposte hanno la stessa forma. Se anche la riga
del quoziente supera la stima di 240 px (il generatore la calcola sui caratteri, con le misure di
KaTeX a 16 px e un margine del 10 per cento), il quoziente va a capo prima di un `+` o di un `-`, su
una riga che comincia con `\quad`: succede solo con il distrattore "segno di a" del livello 3, che ha
numeri grandi (circa 12 opzioni su 4.000). È la stessa soluzione
della divisione con resto dei naturali (`numeri-naturali-operazioni`, livello 2). Una coppia
sbagliata per un solo errore di tabella (il segno di a, lo zero dimenticato) sposta di solito sia
il quoziente sia il resto: chiedere la coppia intera costringe a fare la tabella, mentre chiedere il
solo resto si risolverebbe con il teorema del resto, che la lezione introduce dopo.

Livello 5 e livello 7: `number` (il resto, il valore di k), con la variante a scelta multipla fra
quattro numeri. Livello 6: `choice` fra quattro binomi.

## Rappresentazione

- Livelli 1-4: `params.dividend` (coefficienti dal grado più alto al termine noto, con gli zeri),
  `params.a`, `params.quotient`, `params.remainder`, `params.case` (`esatta` o `con resto`).
- Livello 5: `params.dividend`, `params.a`, `params.remainder`, `params.case` (`a positivo`,
  `a negativo`), `params.distractors`.
- Livello 6: `params.polynomial`, `params.zero` (lo zero r), `params.options` (i numeri c delle
  opzioni x - c, nell'ordine mostrato), `params.case` (`zero positivo`, `zero negativo`).
- Livello 7: `params.polynomial` (con `"k"` al posto del coefficiente incognito), `params.a`,
  `params.k`, `params.case` (`k coefficiente`, `k termine noto`), `params.distractors`.

Il testo è `(P(x)) : (x - a)`, con `\left( \right)` quando a è una frazione; al livello 6 è
`P(x) = ...`. Polinomi ordinati per potenze decrescenti, segni ripiegati, mai `1x`, `+ -`, `x^1`,
termini nulli.

## Costruzione all'indietro

- Divisione: si sceglie a, il coefficiente direttivo del quoziente e poi, dall'alto, ogni
  coefficiente del quoziente; il dividendo viene da $p_k = q_{k-1} - a q_k$. Un termine mancante nel
  dividendo si ottiene ponendo $q_{k-1} = a q_k$. Il termine noto del dividendo è scelto (da -9 a 9,
  mai 0), oppure è $-a q_0$ quando la divisione deve essere esatta (circa un quarto dei casi). Con a
  frazionario $\frac{n}{d}$ i coefficienti del quoziente, tranne l'ultimo, sono multipli di d: così il
  dividendo e il quoziente sono interi e il resto può essere una frazione, come nell'esempio 3.
- Teorema del resto: polinomio scelto e a scelto; il resto è $P(a)$.
- Divisibilità: $P(x) = (x - r)(lx^2 + bx + c)$ con r scelto; le altre tre opzioni sono $x + r$,
  $x - s$, $x + s$, scartate se per caso dividono anche loro.
- Parametro: si sceglie k e tutti i coefficienti tranne il termine noto, che si ricava da
  $P(a) = 0$; quando k è il termine noto, k stesso è il numero che annulla $P(a)$.

## Regole comuni

- Dividendo a coefficienti interi fino a 20, quoziente intero fino a 30, resto fino a 60 in valore
  assoluto (livelli 1-4).
- I passaggi sono quelli della lezione: i coefficienti (con gli zeri, detti a parole), il valore di
  a (con $x + 2 = x - (-2)$ quando a è negativo), la tabella in KaTeX con lo stesso `array` della
  lezione, quoziente e resto, e il controllo $P(a) = R$ del riquadro "Un controllo veloce". Il
  verificatore rilegge la tabella cella per cella e la confronta con la divisione di SymPy.

## Livello 1: a intero positivo, dividendo completo

a da 1 a 5, dividendo completo di grado 2 (circa 3 su 10) o 3, coefficiente direttivo da 1 a 3.

1. $(2x^3 - 5x^2 + x + 7) : (x - 3)$: $Q(x) = 2x^2 + x + 4$, $R = 19$ (la tabella della lezione).
2. $(x^2 + x - 2) : (x - 1)$: $Q(x) = x + 2$, $R = 0$.

## Livello 2: dividendo incompleto

a da 1 a 4, grado 3 o 4, uno o due termini mancanti (a volte il termine noto).

1. $(x^3 - 3x^2 + 4) : (x - 2)$: coefficienti $1, -3, 0, 4$; $Q(x) = x^2 - x - 2$, $R = 0$ (esempio 1).
2. $(2x^3 - 17x - 3) : (x - 3)$: coefficienti $2, 0, -17, -3$; $Q(x) = 2x^2 + 6x + 1$, $R = 0$.

## Livello 3: a negativo

Divisore $x + b$ con b da 1 a 5, grado 3 o 4, completo o con un termine mancante (metà e metà),
termine noto sempre presente.

1. $(x^4 - 5x^2 + 3x - 2) : (x + 2)$: $a = -2$, $Q(x) = x^3 - 2x^2 - x + 5$, $R = -12$ (esempio 2).
2. $(3x^3 + 13x^2 + 9x + 20) : (x + 4)$: $Q(x) = 3x^2 + x + 5$, $R = 0$.

## Livello 4: a frazionario

a tra $\pm\frac{1}{2}$, $\pm\frac{1}{3}$, $\pm\frac{2}{3}$, $\pm\frac{3}{2}$, dividendo completo di grado
2 o 3 a coefficienti interi, quoziente intero; il resto è quasi sempre una frazione, e in circa 1
caso su 10 è 0.

1. $(2x^3 + x^2 - 4x + 3) : \left(x - \frac{1}{2}\right)$: $Q(x) = 2x^2 + 2x - 3$, $R = \frac{3}{2}$
   (esempio 3).
2. $(4x^3 - 12x^2 + 8x - 4) : \left(x - \frac{3}{2}\right)$: $Q(x) = 4x^2 - 6x - 1$, $R = -\frac{11}{2}$.

## Livello 5: teorema del resto

"Trova il resto della divisione senza eseguirla." a intero: $\pm 1$ con grado da 4 a 6 e un
polinomio con pochi termini (come l'esempio 5), $\pm 2$ con grado 3 o 4, $\pm 3$ con grado 3.
Coefficienti fino a 5, almeno tre termini, resto fino a 99. a positivo e negativo metà e metà.

1. $(x^5 - 3x^3 + 2x - 1) : (x + 1)$: $P(-1) = -1 + 3 - 2 - 1 = -1$ (esempio 5).
2. $(2x^3 - 4x^2 + 3) : (x - 2)$: $P(2) = 16 - 16 + 3 = 3$.

## Livello 6: teorema di Ruffini, divisibilità

"Per quale di questi binomi il polinomio è divisibile?" Polinomio di terzo grado con uno zero r
intero da -3 a 3 (non 0); le opzioni sono $x - r$, $x + r$, $x - s$, $x + s$, e una sola divide.
I passaggi calcolano $P(c)$ per ogni opzione e scrivono il polinomio come prodotto (esempio 7).

1. $P(x) = x^3 - x^2 + 6x - 6$, opzioni $x - 1$, $x + 1$, $x - 3$, $x + 3$: è $x - 1$.
2. $P(x) = x^3 - 2x^2 - 17x - 6$, opzioni $x \pm 2$, $x \pm 3$: è $x + 3$.

## Livello 7: il parametro k

"Trova il valore di k per cui la divisione è esatta." Polinomio di terzo grado completo, k al posto
del coefficiente di $x^2$ o di $x$ (circa 8 su 10) o del termine noto; a intero da -3 a 3 (non 0);
k intero non nullo, tutti i coefficienti fino a 30.

1. $(x^3 + kx^2 - 4x + 4) : (x - 2)$: $P(2) = 4k + 4 = 0$, $k = -1$ (esempio 8).
2. $(x^3 + kx^2 + 2x - 28) : (x - 2)$: $P(2) = 4k - 16$, $k = 4$.

## Esercizi "brutti" da evitare

- divisore $x - 0$, cioè x; divisori con a oltre 5 (la lezione usa 2, 3, -2);
- quozienti con coefficienti frazionari (la lezione non ne ha: il resto sì);
- troppi zeri da inserire: al massimo due termini mancanti, così la tabella non diventa una fila di
  zeri;
- al livello 6, un secondo divisore tra le opzioni; al livello 7, k = 0 o un k frazionario.

## Variante a scelta multipla

Quattro opzioni distinte, una corretta. Distrattori dagli errori che la lezione nomina:

- livelli 1-4: la tabella fatta con $-a$ al posto di a (riquadro "Il segno di a"; il verificatore
  controlla che questa opzione ci sia sempre, quando è diversa dalla giusta); la tabella fatta
  senza gli zeri dei termini mancanti (riquadro "Dimenticare i termini mancanti"); il resto con il
  segno cambiato; il quoziente con lo stesso grado del dividendo (la regola "il quoziente ha un
  grado in meno"). Se non bastano: resto ±1, ultimo coefficiente del quoziente ±1.
- livello 5: $P(-a)$ (riquadro "Confondere il divisore con lo zero"), $-P(a)$ (resto con il segno
  cambiato), il valore calcolato con $(-m)^n$ letto come $-m^n$, il termine noto, la somma dei
  coefficienti $P(1)$.
- livello 6: $x + r$ al posto di $x - r$ (lo stesso riquadro), più $x \pm s$.
- livello 7: il k che si ottiene con lo zero di segno sbagliato, $-k$, il k che si ottiene
  dimenticando la potenza di a davanti a k ($k + 4 = 0$ al posto di $4k + 4 = 0$).

I distrattori della tabella con il segno sbagliato possono avere numeri grandi (con $a = -5$ il
quoziente cresce in fretta): sono i numeri che lo studente troverebbe davvero, e li ho lasciati.

## Verifiche fatte (26 settembre 2026)

- `sample.mts polinomi-ruffini 1000 all 1 | verify.py`: PASS, 7.000 su 7.000. Con il seed 7001:
  PASS, 7.000 su 7.000. Divisioni esatte ai livelli 1-3 tra il 19 e il 24 per cento (intervallo
  controllato dal verificatore: dal 10 al 45).
- Esercizi diversi su 1.000 (seed 1 / seed 7001): livello 1: 957 / 958; livello 2: 927 / 933;
  livello 3: 982 / 983; livello 4: 965 / 959; livello 5: 995 / 989; livello 6: 730 / 690;
  livello 7: 849 / 833.
- Errori piantati a mano sui campioni del seed 7001, tutti bocciati: indice della risposta giusta
  spostato (livelli 1, 5, 6); due opzioni uguali alla giusta (livello 1); resto con il segno
  cambiato nell'opzione giusta (livello 1); dividendo del livello 2 completato, cioè vincolo
  violato; una cella della tabella sbagliata (livello 4); divisore con a positivo al livello 3; a
  fuori intervallo (livello 1); opzione "segno di a" tolta (livello 1); risposta $P(-a)$ al posto di
  $P(a)$ (livello 5); binomio divisore ripetuto (livello 6); k cambiato e soluzione diversa dalla
  risposta (livello 7); controllo $P(a)$ sbagliato nei passaggi (livello 2).
- Larghezza delle opzioni (script `owidth.mts`, 600 opzioni per livello, 16 px): nessuna oltre
  252 px; le più larghe misurano 179, 234, 234, 174, 40, 38, 35 px dal livello 1 al 7. Su 6.000
  opzioni per livello il massimo resta 234 px. Problemi (`pwidth.mts`): nessuno oltre 350 px, i più
  larghi 278, 296, 319, 273, 264, 253, 256 px.
- Errori piantati sulle opzioni su due righe (livello 3, 300 esercizi), tutti bocciati: riga del
  resto persa, righe scambiate, riga di continuazione del quoziente persa.
- `review.mts` esce con 0: tutto il LaTeX, tabelle comprese, passa da KaTeX.
- `npx tsc --noEmit -p .`: nessun errore nei file di questo generatore.

## Domande per la revisione

- Il divisore $ax - b$ non c'è: la nota della lezione lo dà come estensione che si può togliere
  ("da verificare sui libri in uso"). Se la sezione resta nella lezione, si aggiunge un livello 8
  sull'esempio 4, con il distrattore "resto diviso anche lui per a" del riquadro "Dividere anche il
  resto".
- Nei livelli 1-4 la risposta è la coppia quoziente e resto, a scelta. Quando arriverà la risposta
  aperta servirà un tipo con due campi (un polinomio e un numero): va bene aspettare, o conviene
  chiedere solo il quoziente e far scrivere il resto a parte?
- La tabella nei passaggi usa lo stesso `array` della lezione, con il termine noto separato da una
  linea verticale; va controllato sul telefono con i dividendi di quarto grado (sei colonne) e con
  le frazioni del livello 4.
