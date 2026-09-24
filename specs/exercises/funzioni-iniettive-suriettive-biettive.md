# Funzioni iniettive, suriettive e biettive

Generatore: `funzioni-iniettive-suriettive-biettive`
(`src/lib/exercises/v2/generators/funzioni-iniettive-suriettive-biettive.ts`). Verifica
indipendente: `scripts/exercises/checkers/funzioni_iniettive_suriettive_biettive.py`. Lezione
collegata: `docs/lezioni/riscritte/18-funzioni-iniettive-suriettive-biettive.md`.

Gli esercizi seguono la lezione nell'ordine e nella notazione: prima l'immagine di una funzione su
un dominio finito, poi la classificazione di funzioni tra insiemi finiti (date elemento per elemento,
poi con una formula), poi le funzioni tra insiemi di numeri, dove cambiare dominio o codominio cambia
la risposta, infine l'inversa di una funzione lineare biettiva. Niente diagrammi negli esercizi: le
funzioni finite si danno come elenco di assegnazioni ($1 \mapsto a$) o come tabella.

## Tipi di risposta

- Livello 1: `set`, l'immagine $\mathrm{Im}(f)$, interi in ordine crescente.
- Livelli da 2 a 5: `choice` con quattro opzioni fisse, sempre in quest'ordine: "iniettiva ma non
  suriettiva", "suriettiva ma non iniettiva", "biettiva", "né iniettiva né suriettiva". Il codice in
  `values` è `iniettiva-non-suriettiva`, `suriettiva-non-iniettiva`, `biettiva`,
  `ne-iniettiva-ne-suriettiva`. `params.case` vale `iniettiva`, `suriettiva`, `biettiva` o `nessuna`.
- Livello 6: `expression`, l'inversa come espressione in $y$ leggibile da SymPy, per esempio
  `(1*y + (9))/(2)`.

I livelli 1 e 6 hanno anche la variante a scelta multipla (quattro opzioni distinte, una giusta).

## Regole comuni

- La funzione è davvero una funzione da $A$ a $B$: ogni immagine sta nel codominio.
- Mai `1x`, `0x`, `+ -`, `- -`, termini nulli, esponente 1.
- Insiemi scritti come nella lezione: $\{-1,\ 0,\ 1\}$, $[0, +\infty)$, $\mathbb{R} \setminus \{0\}$.
- I passaggi dicono il perché: quale elemento ha due controimmagini, quale elemento del codominio
  non viene raggiunto, oppure la soluzione di $f(x) = y$ che dimostra la suriettività.
- Ai livelli da 2 a 5 si sceglie prima la risposta, con probabilità 1/4 ciascuna, e poi si costruisce
  la funzione: la verifica accetta per ogni caso una quota tra il 15% e il 35%.

## Livello 1: immagine su un dominio finito

$f: A \to B$ con $A$ di 3-5 interi distinti tra $-3$ e $3$ e $f(x)$ tra $ax + b$ ($a \neq 0$,
$|a| \leq 3$), $x^2 + bx + c$ e $|x + b| + c$ (coefficienti piccoli). $B$ contiene l'immagine e uno o
due numeri in più, perché lo studente veda che l'immagine può essere più piccola del codominio.

Esempio: $f(x) = x^2$, $A = \{-1,\ 0,\ 1,\ 2\}$, $B = \{0,\ 1,\ 2,\ 3,\ 4\}$. Si calcola
$f(-1) = 1$, $f(0) = 0$, $f(1) = 1$, $f(2) = 4$; $1$ si scrive una volta sola:
$\mathrm{Im}(f) = \{0,\ 1,\ 4\}$. $2$ e $3$ stanno in $B$ ma nessuno ci arriva.

Esempio: $f(x) = |x - 2| + 1$, $A = \{-3,\ -1,\ 2\}$, $B = \{1,\ 4,\ 5,\ 6,\ 7\}$. $f(-3) = 6$,
$f(-1) = 4$, $f(2) = 1$: $\mathrm{Im}(f) = \{1,\ 4,\ 6\}$.

Distrattori: il codominio $B$ al posto dell'immagine; l'immagine calcolata con un errore di segno sui
negativi ($(-2)^2 = -4$, $|-2| = -2$, $-3 \cdot (-1) = -3$); il dominio $A$; l'immagine con un
elemento di $B$ in più.

## Livello 2: insiemi finiti, funzione data elemento per elemento

$A = \{1, \dots, n\}$, $B$ di lettere $\{a, b, \dots\}$, da 3 a 5 elementi ciascuno. Sei volte su
dieci la funzione è un elenco di assegnazioni, le altre una tabella a due righe. Dimensioni per caso:
biettiva con $|A| = |B|$; iniettiva ma non suriettiva con $|A| < |B|$; suriettiva ma non iniettiva
con $|A| > |B|$; né l'una né l'altra con dimensioni qualsiasi, anche uguali, così il conteggio da
solo non basta. Il primo passaggio conta sempre gli elementi (con $|A| > |B|$ la funzione non può
essere iniettiva, con $|A| < |B|$ non può essere suriettiva).

Esempio: $A = \{1,\ 2,\ 3,\ 4\}$, $B = \{a,\ b,\ c\}$, $1 \mapsto a$, $2 \mapsto a$, $3 \mapsto b$,
$4 \mapsto c$. $A$ ha più elementi di $B$, quindi non può essere iniettiva; ad $a$ arrivano due
frecce (da $1$ e da $2$); ogni elemento di $B$ ne riceve almeno una: suriettiva ma non iniettiva.

Esempio: $A = \{1,\ 2,\ 3\}$, $B = \{a,\ b,\ c\}$, tabella $f(1) = c$, $f(2) = a$, $f(3) = c$. Stesso
numero di elementi; $c$ compare due volte e $b$ mai: né iniettiva né suriettiva.

## Livello 3: insiemi finiti di numeri, funzione data con una formula

Come il livello 1 (stesse formule, stessi domini), ma si classifica la funzione: lo studente deve
prima calcolare le immagini. $B$ è l'immagine stessa (per i casi suriettivi) oppure l'immagine con
uno o due numeri in più. Nei casi non iniettivi la formula non è lineare.

Esempio: $f(x) = x^2$, $A = \{-1,\ 0,\ 1\}$, $B = \{0,\ 1\}$. $f(-1) = f(1) = 1$: non iniettiva;
$\mathrm{Im}(f) = B$: suriettiva.

Esempio: $f(x) = 3x + 2$, $A = \{-3,\ 0,\ 1,\ 2\}$, $B = \{-7,\ -2,\ 0,\ 2,\ 5,\ 8\}$. Immagini tutte
diverse: iniettiva; $-2$ e $0$ non sono immagine di nessun elemento: non suriettiva.

## Livello 4: funzioni reali tra $\mathbb{R}$ e $[0, +\infty)$

Formule: $ax + b$ ($2 \leq |a| \leq 6$), $kx^2$ e $k|x + b|$ con $k$ da 1 a 4 (più spesso 1). Dominio
e codominio tra $\mathbb{R}$ e $[0, +\infty)$, sempre con $f(A) \subseteq B$. Le combinazioni:

| Caso | Funzioni |
|---|---|
| biettiva | $ax + b$ su $\mathbb{R} \to \mathbb{R}$; $kx^2$, $k|x|$, $ax$ ($a > 0$) su $[0, +\infty) \to [0, +\infty)$ |
| iniettiva ma non suriettiva | $ax + b$, $kx^2$, $k|x|$ su $[0, +\infty) \to \mathbb{R}$; $ax + b$ ($a, b > 0$) su $[0, +\infty) \to [0, +\infty)$ |
| suriettiva ma non iniettiva | $kx^2$, $k|x + b|$ su $\mathbb{R} \to [0, +\infty)$ |
| né l'una né l'altra | $kx^2$, $k|x + b|$ su $\mathbb{R} \to \mathbb{R}$ |

Esempio: $f: [0, +\infty) \to \mathbb{R}$, $f(x) = x^2$. Da $x_1^2 = x_2^2$ con $x_1, x_2 \geq 0$
segue $x_1 = x_2$: iniettiva. $-1$ sta nel codominio e $x^2 = -1$ non ha soluzioni: non suriettiva.

Esempio: $f: [0, +\infty) \to \mathbb{R}$, $f(x) = 6x + 4$. Iniettiva; $6x + 4 = -2$ dà $x = -1$,
fuori dal dominio: non suriettiva.

## Livello 5: $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{N}$ e $\mathbb{R} \setminus \{0\}$

| Caso | Funzioni |
|---|---|
| biettiva | $\pm x + b$ su $\mathbb{Z} \to \mathbb{Z}$; $ax + b$ su $\mathbb{Q} \to \mathbb{Q}$; $\frac{k}{x}$ su $\mathbb{R} \setminus \{0\} \to \mathbb{R} \setminus \{0\}$ |
| iniettiva ma non suriettiva | $ax + b$ ($|a| \geq 2$) su $\mathbb{Z} \to \mathbb{Z}$; $\frac{k}{x}$ su $\mathbb{R} \setminus \{0\} \to \mathbb{R}$ |
| suriettiva ma non iniettiva | $|x + b|$ su $\mathbb{Z} \to \mathbb{N}$ |
| né l'una né l'altra | $kx^2$ e $k|x + b|$ su $\mathbb{Z} \to \mathbb{Z}$ e su $\mathbb{Q} \to \mathbb{Q}$ |

Esempio: $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = 6x + 4$. Iniettiva; $5 \in \mathbb{Z}$ ma
$6x + 4 = 5$ dà $x = \frac{1}{6}$, non intero: non suriettiva. La stessa formula su
$\mathbb{Q} \to \mathbb{Q}$ è biettiva (esempio 8 della lezione).

Esempio: $f: \mathbb{R} \setminus \{0\} \to \mathbb{R}$, $f(x) = -\frac{3}{x}$. Da
$-\frac{3}{x_1} = -\frac{3}{x_2}$ segue $x_1 = x_2$: iniettiva. $0$ non viene mai raggiunto: non
suriettiva.

## Livello 6: inversa di una funzione lineare

$f: \mathbb{R} \to \mathbb{R}$, $f(x) = ax + b$ con $2 \leq |a| \leq 6$, $b \neq 0$, $|b| \leq 9$. Si
risolve $y = ax + b$ rispetto a $x$, come nella lezione, e la risposta si scrive
$f^{-1}(y) = \dots$. Con $a < 0$ il segno passa al numeratore: $\frac{4 - y}{3}$, non
$\frac{y - 4}{-3}$.

Esempio: $f(x) = 2x - 9$. $y + 9 = 2x$, $x = \frac{y + 9}{2}$: $f^{-1}(y) = \frac{y + 9}{2}$.

Esempio: $f(x) = -3x + 4$. $y - 4 = -3x$, $x = \frac{4 - y}{3}$.

Distrattori: $\frac{y + b}{a}$ (termine noto portato senza cambiare segno); $\frac{y}{a} - b$ (diviso
solo $y$); $\frac{1}{ay + b}$ ($f^{-1}$ letto come $\frac{1}{f}$); $\frac{b - y}{a}$ come riserva.
Con $|a| \geq 2$ e $b \neq 0$ i primi quattro sono sempre distinti.

## Esercizi da evitare

- Funzioni che non sono funzioni: un'immagine fuori dal codominio, $ax + b$ con $a < 0$ su
  $[0, +\infty) \to [0, +\infty)$, $\frac{k}{x}$ con lo zero nel dominio.
- Domande sulla suriettività senza codominio esplicito.
- Livello 1 con $B$ uguale all'immagine: la domanda diventa banale.
- $a = \pm 1$ al livello 6 ($\frac{y}{a} - b$ coinciderebbe con la risposta giusta).

## Domande per la revisione

- Il livello 5 usa $\mathbb{N}$ (con lo zero) per l'unico caso suriettivo non iniettivo, $|x + b|$
  da $\mathbb{Z}$ a $\mathbb{N}$: la lezione non lo nomina. Va bene o serve un altro caso?
- L'inversa si scrive in $y$, $f^{-1}(y)$, come nella lezione; la lezione "Composizione e funzione
  inversa" potrebbe usare $f^{-1}(x)$. Quale delle due?
- Al livello 2 le quattro risposte si presentano sempre nello stesso ordine: meglio così (sono sempre
  le stesse) o mescolate?
