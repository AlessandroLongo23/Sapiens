# Coefficiente angolare e retta per due punti

Generatore: `il-coefficiente-angolare` (`src/lib/exercises/v2/generators/il-coefficiente-angolare.ts`).
Verifica indipendente: `scripts/exercises/checkers/il_coefficiente_angolare.py`. Lezione collegata:
`docs/lezioni/riscritte/82-il-coefficiente-angolare.md` (nota in `docs/lezioni/note/82-il-coefficiente-angolare.md`,
sezione "Per il generatore", da cui vengono i livelli).

Le convenzioni sono quelle della lezione: punti $A(-1, 3)$ con la virgola, $A\left(\frac{1}{2}, 1\right)$ quando una
coordinata è una frazione; $m = \frac{y_B - y_A}{x_B - x_A}$ con i numeri negativi tra parentesi; la retta per un
punto $y - y_0 = m(x - x_0)$; la forma esplicita $y = mx + q$ e quella implicita $ax + by + c = 0$ con coefficienti
interi primi tra loro e $a > 0$ (come $2x - 3y + 5 = 0$ nell'esempio 8); la retta verticale "non ha coefficiente
angolare"; $m_{AB}$ per il coefficiente angolare della retta $AB$. Frazioni, mai decimali.

## Tipo di risposta

- `number`: il coefficiente angolare (livelli 1, 2, 3) e l'ascissa $k$ (livello 7).
- `expression`: la retta in forma esplicita (livelli 4 e 6), con `value` il secondo membro per SymPy (`-5*x/4 - 17/2`)
  e `latex` l'equazione intera (`y = -\frac{5}{4}x - \frac{17}{2}`); per la retta orizzontale `value` è il numero
  (`4`, `y = 4`).
- `choice`: il coefficiente angolare che non esiste (livello 1, retta verticale), la retta in forma implicita
  (livello 5), la retta verticale $x = h$ (livello 6), il punto allineato (livello 7).

Ogni esercizio ha la variante a scelta multipla con quattro opzioni. Valori delle opzioni: un razionale `"p/q"`;
`["none"]` per "non esiste" (scritto `\text{non esiste}`); `["line", a, b, c]` per la retta $ax + by + c = 0$
normalizzata (interi primi tra loro, $a > 0$, oppure $a = 0$ e $b > 0$), scritta in forma esplicita ai livelli 4 e 6
e implicita al livello 5; `["x", "y"]` per un punto, scritto $\left(4, -2\right)$.

## Costruzione all'indietro

Livelli 1, 2 e 6: si scelgono i due punti (e il caso, una volta per esercizio, prima dei tentativi: generica,
orizzontale, verticale), e si scarta la coppia se il coefficiente angolare ha un denominatore troppo grande.
Livello 3: si scelgono $a$, $b$, $c$ primi tra loro; $m$ segue. Livelli 4 e 5: si scelgono $m$ e il punto $P$, e
si calcola $q = y_0 - m x_0$. Livello 7: si scelgono $A$ e $B$, la direzione ridotta $(d, n)$ di $AB$ e un
multiplo intero $t \notin \{0\}$; il punto giusto è $C = A + t(d, n)$, e al caso "coordinata" $k = x_C$.

`params` contiene il caso (`case`), i punti (`A`, `B`, `C`, `P`), il coefficiente angolare dato (`m`) e al livello 3
i coefficienti `a`, `b`, `c`. Il controllo Python non li usa per ricalcolare la risposta: rilegge punti, $m$ ed
equazione dal LaTeX del problema, ricalcola con `Line`, `Point`, `slope`, `Point.is_collinear` e `solve`, e usa
`params.case` solo per confrontarlo con il caso che ricava da solo.

## Regole comuni

- Niente $1x$, $0x$, $1y$, $+ -$, $- -$, termini nulli nel testo.
- Le opzioni sono quattro, diverse nel valore e nel testo; due rette sono uguali se sono la stessa retta, anche
  scritte in modo diverso (una retta moltiplicata per 2 non può essere un distrattore).
- Ogni opzione e ogni risposta in forma esplicita è scritta nella forma ridotta: $y = \frac{2}{3}x + \frac{5}{3}$,
  $y = -x + 4$, $y = 4$, $x = -5$; la forma implicita con coefficienti interi primi tra loro e $a > 0$.
- Soluzione e passaggi senza ambienti (`aligned`, `gathered`), con `\text{}` per le parole.
- Sul telefono: il problema più largo misura 132 px a 18 px (livello 3), l'opzione più larga 127 px a 16 px
  (livello 5).

## Livello 1: coefficiente angolare da due punti

Coordinate intere da $-6$ a $6$, almeno una negativa (esempio 1). Sette volte su dieci la retta è obliqua, con
$m$ intero o frazionario (denominatore fino a 5); 15 su 100 orizzontale ($m = 0$), 15 su 100 verticale (esempio 3:
il coefficiente angolare non esiste, e la risposta è l'opzione "non esiste"). Passaggi: la formula, i numeri
sostituiti, il segno ("la retta sale" o "scende"), o la retta orizzontale $y = y_A$, o la verticale $x = x_A$.

1. $A(2, -5)$, $B(1, 3)$: $m = \frac{3 - (-5)}{1 - 2} = \frac{8}{-1} = -8$. Distrattori $8$ (ordine diverso sopra e
   sotto), $-\frac{1}{8}$ ($\frac{\Delta x}{\Delta y}$), $2$ (il segno di $-5$ perso: $\frac{3 - 5}{1 - 2}$).
2. $A(-5, 6)$, $B(-5, 5)$: non esiste, la retta è $x = -5$. Distrattori $0$ (avviso "La retta verticale non ha
   $m = 0$"), $-5$ (l'ascissa di $x = h$ letta come $m$), $-1$ ($\Delta y$).

Distrattori per la retta orizzontale: "non esiste" (lo zero al numeratore scambiato per lo zero al denominatore),
$y_A$ (l'ordinata della retta $y = q$ letta come pendenza, avviso "Pendenza e ordinata all'origine"), $\Delta x$.

## Livello 2: coordinate frazionarie

Ogni punto ha una o due coordinate frazionarie con lo stesso denominatore (2, 3 o 4 per esercizio), le intere da
$-4$ a $4$; $m$ esiste, non è nullo, ha denominatore fino a 6 (esempio 2). Passaggi come nella lezione: numeratore e
denominatore a parte, poi la divisione come moltiplicazione per l'inverso.

1. $A\left(1, \frac{3}{2}\right)$, $B\left(-\frac{1}{2}, 4\right)$: $\frac{5}{2} : \left(-\frac{3}{2}\right) = -\frac{5}{3}$.
   Distrattori $\frac{5}{3}$, $-\frac{3}{5}$, $\frac{3}{5}$.
2. $A\left(-\frac{1}{2}, 1\right)$, $B\left(\frac{1}{2}, \frac{1}{2}\right)$: $-\frac{1}{2} : 1 = -\frac{1}{2}$.
   Distrattori $-2$, $2$, $\frac{1}{2}$.

## Livello 3: coefficiente angolare da un'equazione non esplicita

Metà $ax + by + c = 0$ ($a$ da 1 a 6, $|b|$ da 2 a 6, $c$ non nullo, primi tra loro; esempio 4); un quarto
$by = ax + c$ con $b \geq 2$ e $m$ non intero ($2y = 6x + 1$ dell'avviso "Leggere $m$ nel posto sbagliato"); un
quarto $ax = by + c$ ($3x = 2y - 6$ dello stesso avviso), da portare prima a primo membro.

1. $4x - 5y + 2 = 0$: $m = -\frac{4}{-5} = \frac{4}{5}$. Distrattori $-\frac{4}{5}$ (il meno di $-\frac{a}{b}$
   dimenticato), $\frac{2}{5}$ ($q$ al posto di $m$), $\frac{5}{4}$ ($-\frac{b}{a}$), $4$ (il coefficiente di $x$).
2. $4y = 3x + 9$: $y = \frac{3}{4}x + \frac{9}{4}$, $m = \frac{3}{4}$. Distrattori $3$ (il coefficiente letto prima
   di dividere), $-\frac{3}{4}$ ($-\frac{a}{b}$ senza spostare i termini), $\frac{4}{3}$.

Per $x = 6y + 7$: $x - 6y - 7 = 0$, $m = \frac{1}{6}$; distrattori $-\frac{1}{6}$ ($a$ e $b$ letti senza spostare),
$6$, $1$.

## Livello 4: retta per un punto, $m$ intero, forma esplicita

$m$ intero da $-4$ a $4$ non nullo, $P$ con coordinate intere da $-6$ a $6$, $x_0 \neq 0$, almeno una negativa,
$|q| \leq 20$ (esempio 5). Passaggi: formula, numeri sostituiti, conti, forma esplicita, controllo con $P$.

1. $P(2, -5)$, $m = -3$: $y - (-5) = -3(x - 2)$, $y + 5 = -3x + 6$, $y = -3x + 1$. Distrattori $y = -3x - 11$ (il
   segno di $x_0$, avviso "Il segno di $x_0$"), $y = -3x + 11$ (il segno di $y_0$), $y = -3x - 7$
   ($y - y_0 = mx - x_0$, con $m$ non moltiplicato per $x_0$). Il quarto candidato è la pendenza $-m$.
2. $P(-4, 1)$, $m = 1$: $y - 1 = x + 4$, $y = x + 5$. Distrattori $y = x - 3$, $y = x + 3$, $y = -x - 3$.

## Livello 5: retta per un punto, $m$ frazionario, forma implicita

$m = \frac{n}{d}$ con $d$ da 2 a 5, $|n| \leq 5$, primi tra loro; $P$ con coordinate intere non nulle, almeno una
negativa (esempio 6, esempio 8). La risposta è la forma implicita con coefficienti interi, a scelta multipla.
Passaggi: formula, sostituzione, i due membri moltiplicati per $d$, tutto a primo membro, la forma esplicita per
confronto, il controllo con $P$.

1. $P(-5, 1)$, $m = \frac{1}{2}$: $2y - 2 = x + 5$, $x - 2y + 7 = 0$. Distrattori $x - 2y - 3 = 0$ (segno di $x_0$),
   $x - 2y + 3 = 0$ (segno di $y_0$), $x + 2y + 3 = 0$ (pendenza $-m$).
2. $P(1, -6)$, $m = -\frac{3}{4}$: $4y + 24 = -3x + 3$, $3x + 4y + 21 = 0$. Distrattori $3x + 4y - 27 = 0$
   (segno di $x_0$), $3x + 4y + 27 = 0$ (segno di $y_0$), $3x - 4y - 27 = 0$ (pendenza $-m$). Il quarto candidato,
   usato quando uno dei primi coincide con un altro, è la pendenza capovolta $\frac{d}{n}$.

## Livello 6: retta per due punti

Coordinate intere da $-6$ a $6$, almeno una negativa. Sette volte su dieci obliqua con $m$ intero o frazionario
(denominatore fino a 4, $|$numeratore$| \leq 6$), 15 su 100 orizzontale, 15 su 100 verticale (passo 1 del metodo
della lezione). Risposta in forma esplicita, o $x = x_A$ per la verticale (a scelta multipla). Passaggi: le
ascisse, $m$, la retta per $A$, il controllo con $B$ (esempio 7).

1. $A(-1, 5)$, $B(-4, 4)$: $m = \frac{1}{3}$, $y - 5 = \frac{1}{3}(x + 1)$, $y = \frac{1}{3}x + \frac{16}{3}$.
   Distrattori $y = 3x + 8$ ($\frac{\Delta x}{\Delta y}$), $y = -\frac{1}{3}x + \frac{14}{3}$ (ordine diverso sopra e
   sotto), $y = \frac{1}{3}x + \frac{14}{3}$ (segno di $x_A$).
2. $A(-5, 6)$, $B(-5, 5)$: $x = -5$. Distrattori $y = -5$ ($y = h$ al posto di $x = h$), $y = 6$, $y = 5$ (le
   orizzontali per $A$ e $B$). Per l'orizzontale $A(1, -4)$, $B(4, -4)$: $y = -4$, distrattori $x = -4$, $x = 1$, $x = 4$.

## Livello 7: tre punti allineati

$A$ e $B$ con coordinate intere da $-5$ a $5$, né sulla stessa verticale né sulla stessa orizzontale.

- Metà "quale punto" (esempio 10): quale tra quattro punti è allineato con $A$ e $B$. Il giusto è
  $C = A + t(d, n)$, coordinate fino a 12; i distrattori sono quasi allineati (un'unità sopra, sotto, a destra o a
  sinistra di $C$, come $C(4, -2)$ nell'esempio), il punto con le coordinate scambiate, il punto sulla retta per $A$
  con la pendenza opposta; mai $A$ o $B$, coordinate fino a 13.
- Metà "coordinata" (esempio 11): $C(k, y_C)$, trova $k$. Passaggi: $k \neq x_A$, $m_{AB}$, $m_{AC}$ con $k$,
  l'equazione $m_{AC} = m_{AB}$ risolta. Distrattori: $k$ con $m_{AC} = \frac{\Delta x}{\Delta y}$, il segno di $x_A$
  sbagliato ($k = x_A - \frac{\Delta y}{m}$), $x_A$ dimenticato ($k = \frac{\Delta y}{m}$).

1. $A(0, 4)$, $B(-3, 3)$: $m_{AB} = \frac{1}{3}$, allineato $\left(9, 7\right)$; distrattori $\left(9, 8\right)$,
   $\left(10, 7\right)$, $\left(7, 9\right)$.
2. $A(-5, -5)$, $B(-1, 3)$, $C(k, 1)$: $m_{AB} = 2$, $\frac{6}{k + 5} = 2$, $k + 5 = 3$, $k = -2$. Distrattori $7$,
   $-8$, $3$.

## Esercizi da evitare

- Due punti coincidenti; la verticale nei livelli 2, 3, 4, 5 (il livello 1 e il 6 la hanno apposta).
- Coefficienti non ridotti nel testo del livello 3 ($4x - 6y + 2 = 0$); $b = \pm 1$ nella forma implicita, che è
  già quasi esplicita.
- Al livello 7 un valore di $k$ che mette $C$ sulla verticale di $A$, un $C$ uguale ad $A$ o a $B$, un distrattore
  allineato.

## Verifica (27 settembre 2026)

- `sample.mts il-coefficiente-angolare 1000 all 1 | verify.py`: PASS, 7.000 esercizi. Con il seed di partenza 7001:
  PASS. Quote dei casi dentro gli intervalli di `CASE_RANGES` (per esempio livello 1: 702, 174, 124 su 1.000).
- Esercizi diversi su 1.000 (seed da 1): livello 1: 976; livello 2: 994; livello 3: 820; livello 4: 585;
  livello 5: 858; livello 6: 968; livello 7: 983.
- Errori piantati, tutti bocciati: risposta cambiata (livello 1); "non esiste" non giusta e $0$ giusta per la
  verticale; coordinate tutte intere al livello 2; problema già esplicito al livello 3; forma implicita non ridotta
  nel testo del livello 3; indice dell'opzione giusta spostato (livello 4); risposta con un termine nullo
  (`y = x - 4 + 0`); distrattore uguale alla retta giusta moltiplicata per 2 (livello 5); `value` diverso dal
  `latex` (livello 6); distrattore con la retta giusta scritta male; opzione con i valori diversi dal testo; due
  punti allineati tra le opzioni (livello 7); $k = x_A$; caso nei `params` diverso da quello dei punti.
- `review.mts`: esce con 0. `width.mts`: esce con 0 (problema al massimo 132 px, opzioni al massimo 127 px).
  `steps-scan.mts`: nessun errore. `tsc` ed `eslint`: nessun errore nel generatore.

## Figure che servirebbero

Il sito oggi non disegna figure negli esercizi, e questo generatore si regge sul testo. Una figura aiuterebbe:
livello 1 (i due punti e i cateti $\Delta x$, $\Delta y$, come la prima figura della lezione; per la verticale e
l'orizzontale, la retta), livello 6 (la retta per $A$ e $B$ nella soluzione), livello 7 (la retta $AB$ con il punto
allineato e quelli quasi allineati, come la figura dell'esempio 10). Utile ma meno necessaria al livello 4 e 5
(la retta per $P$ nella soluzione). Un livello "leggi $m$ dal grafico" sarebbe possibile solo con le figure.

## Domande per la revisione

- Il metodo con il sistema (esempio 9) non ha un livello: dà la stessa risposta del livello 6. Serve un livello
  che chieda il sistema in $m$ e $q$ (a scelta multipla, "quale sistema si imposta"), o basta il metodo con $m$?
- Al livello 6 la risposta è in forma esplicita anche con $m$ frazionario ($y = \frac{1}{3}x + \frac{16}{3}$),
  mentre l'esempio 8 chiede la forma implicita. Meglio chiedere la forma implicita quando $q$ è frazionario?
- Il livello 7 tiene insieme due domande (quale punto è allineato, e $k$) perché i livelli sono già sette. Va
  bene, o si separano togliendo un altro livello (per esempio fondendo 4 e 5)?
- Al livello 1 la retta orizzontale e quella verticale sono 15 esercizi su 100 ciascuna: la quota va bene?
