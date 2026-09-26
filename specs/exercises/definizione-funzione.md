# Definizione di funzione

Generatore: `definizione-funzione` (`src/lib/exercises/v2/generators/definizione-funzione.ts`).
Verifica indipendente: `scripts/exercises/checkers/definizione_funzione.py`. Lezione collegata:
`docs/lezioni/riscritte/42-definizione-funzione.md`, con la sezione "Per il generatore" di
`docs/lezioni/note/42-definizione-funzione.md`.

Gli esercizi seguono la lezione nell'ordine: prima si riconosce una funzione in un elenco di coppie,
poi si calcola il valore di una funzione data con una legge (in un intero, in un intero negativo con
il quadrato, in una frazione), poi si completa una tabella di valori, infine si sostituisce
un'espressione con una lettera. Niente diagrammi a frecce e niente grafici: le relazioni si danno
come elenco di coppie, come nell'esempio 1 della lezione.

## Tipi di risposta

- Livello 1: `choice`. Ogni opzione dice se la relazione è una funzione e perché. Il codice in
  `values` è `funzione`, `due-immagini` con l'elemento, `senza-immagine` con l'elemento,
  `arrivo-piu` o `arrivo-nessuno` con l'elemento di $B$. `params.case` vale `funzione`,
  `due-immagini` o `senza-immagine`.
- Livelli 2, 3 e 4: `number`, il valore esatto `p` o `p/q`.
- Livello 5: `choice`, la riga di $f(x)$ della tabella; `values` sono i cinque valori in ordine.
- Livello 6: `expression` con `form: "expanded"`, un polinomio di primo grado nella lettera $a$
  leggibile da SymPy, per esempio `2*a + (5)`.

Tutti i livelli hanno la variante a scelta multipla: quattro opzioni distinte, una giusta.

## Regole comuni

- Notazione della lezione: $f(x) = 3x - 5$, $f(-1)$, $f\left(-\frac{1}{3}\right)$, $\cdot$ per il
  prodotto nei passaggi, polinomi ordinati per potenze decrescenti.
- Mai `1x`, `0x`, `+ -`, `- -`, termini nulli, esponente 1; al livello 6 mai `1a` o `0a`.
- Nei passaggi il numero si sostituisce tra parentesi quando è negativo, e tra parentesi anche
  quando è una frazione elevata al quadrato, come nell'esempio 4 della lezione.
- Il problema sta in un `gathered` di due righe: la legge (o gli insiemi) sopra, la domanda sotto.

## Livello 1: riconoscere una funzione da un elenco di coppie

$A$ di 3-5 numeri distinti tra $0$ e $6$, $B = \{a,\ b,\ c\}$ o $\{a,\ b,\ c,\ d\}$. Si sceglie prima
il caso, un terzo delle volte ciascuno: funzione; un elemento di $A$ con due immagini (compare in due
coppie con secondi elementi diversi); un elemento di $A$ senza immagine (non compare in nessuna
coppia). Mai più di un elemento difettoso. Le coppie sono in ordine, come nella lezione; con cinque
coppie o più $R$ va su due righe dentro le graffe.

Esempio: $A = \{1,\ 2,\ 5\}$, $B = \{a,\ b,\ c,\ d\}$, $R = \{(1, c),\ (2, b),\ (5, b)\}$. $1$, $2$ e
$5$ compaiono ciascuno in una sola coppia: è una funzione. Che $b$ sia immagine di più elementi non
conta.

Esempio: $A = \{1,\ 2,\ 5\}$, $B = \{a,\ b,\ c,\ d\}$,
$R = \{(1, a),\ (1, d),\ (2, c),\ (5, d)\}$. $1$ compare in $(1, a)$ e $(1, d)$: ha due immagini,
non è una funzione.

Opzioni: "Sì, è una funzione"; "No: $x$ ha due immagini"; "No: $x$ non ha immagine"; e sempre una
delle due frasi su $B$ dell'avviso "Contare le frecce che arrivano": "No: $y$ è immagine di più
elementi" oppure "No: $y$ non è immagine di nessun elemento". La frase su $B$ è vera (la verifica lo
controlla) ma non è mai il motivo giusto, perché sugli elementi di $B$ la definizione non chiede
niente. Le altre due opzioni sbagliate nominano elementi di $A$ per cui la frase è falsa.

## Livello 2: valore di una funzione di primo grado in un intero

$f(x) = ax + b$ con $2 \leq |a| \leq 6$, $b \neq 0$, $|b| \leq 9$; $x$ intero tra $-5$ e $5$, non
nullo, negativo sei volte su dieci (la verifica accetta tra il 50% e il 70%).

Esempio: $f(x) = 2x - 9$, $f(-1) = 2 \cdot (-1) - 9 = -2 - 9 = -11$.

Esempio: $f(x) = 3x - 3$, $f(-3) = 3 \cdot (-3) - 3 = -9 - 3 = -12$.

Distrattori: il prodotto con il negativo senza la regola dei segni ($3 \cdot (-3) = 9$, sempre
presente quando $x < 0$); il prodotto letto come somma ($3x$ con $x = -1$ scritto $3 - 1$); il termine
noto con il segno cambiato; poi valori vicini.

## Livello 3: valore di una funzione di secondo grado in un intero negativo

$f(x) = ax^2 + bx + c$ con $a \in \{1, 2, 3, -1, -2\}$, $|b| \leq 5$, $|c| \leq 6$, non $b$ e $c$
entrambi nulli; $x \in \{-1, -2, -3\}$; $|f(x)| \leq 60$.

Esempio: $f(x) = 3x^2 + 5x$, $f(-2) = 3 \cdot (-2)^2 + 5 \cdot (-2) = 12 - 10 = 2$.

Esempio: $f(x) = -x^2 - 2x + 5$, $f(-3) = -(-3)^2 - 2 \cdot (-3) + 5 = -9 + 6 + 5 = 2$.

Distrattori: sempre l'errore dell'avviso "Dimenticare le parentesi" ($-2^2 = -4$ al posto di
$(-2)^2 = 4$); il prodotto $bx$ con il segno sbagliato; i due errori insieme; il coefficiente elevato
al quadrato con $x$ ($2 \cdot (-2)^2$ calcolato come $(-4)^2$); il termine noto con il segno cambiato.

## Livello 4: valore in una frazione, anche negativa

$x = \pm \frac{p}{q}$ con $q$ da 2 a 5 (fino a 4 per il secondo grado) e $p \leq 3$, negativa sei
volte su dieci. Tre volte su dieci primo grado ($ax + b$, $2 \leq |a| \leq 6$, $b \neq 0$), le altre
secondo grado ($a \in \{1, 2, 3, -1\}$, $b \neq 0$, $|b|, |c| \leq 4$). Il risultato ha denominatore
al più 25 e numeratore al più 60 in valore assoluto.

Esempio: $f(x) = -x^2 - 2x + 2$,
$f\left(\frac{3}{2}\right) = -\left(\frac{3}{2}\right)^2 - 2 \cdot \frac{3}{2} + 2 = -\frac{9}{4} - 3 + 2 = -\frac{13}{4}$.

Esempio: $f(x) = -x^2 + x - 1$,
$f\left(-\frac{1}{2}\right) = -\left(-\frac{1}{2}\right)^2 + \left(-\frac{1}{2}\right) - 1 = -\frac{7}{4}$.

Distrattori: il quadrato del negativo preso negativo; il prodotto con il segno sbagliato; il quadrato
del solo numeratore ($\left(\frac{1}{3}\right)^2 = \frac{1}{3}$); nel primo grado numeratore e
denominatore moltiplicati tutti e due ($3 \cdot \frac{1}{3} = \frac{3}{9}$); il termine noto con il
segno cambiato; poi valori vicini.

## Livello 5: tabella di valori

Cinque interi consecutivi che contengono lo zero e almeno un negativo (da $-3$, $-2$ o $-1$ in su),
come nell'esempio 6. $f(x) = ax + b$ con $1 \leq |a| \leq 4$ quattro volte su dieci, altrimenti
$ax^2 + bx + c$ con $a \in \{1, 2, -1\}$, $|b| \leq 3$, $|c| \leq 5$. Tutti i valori tra $-30$ e $30$.
Il problema è la tabella con la riga di $f(x)$ fatta di punti di domanda; si sceglie la riga giusta.

Esempio: $f(x) = x^2 - 2x + 4$ per $x$ da $-1$ a $3$: $7,\ 4,\ 3,\ 4,\ 7$.

Esempio: $f(x) = 4x + 5$ per $x$ da $-2$ a $2$: $-3,\ 1,\ 5,\ 9,\ 13$.

Distrattori: la riga con il quadrato dei negativi preso negativo (sempre presente al secondo grado);
la riga con il prodotto dei negativi senza la regola dei segni (sempre presente al primo grado); i due
errori insieme; il coefficiente al quadrato; come riserva, la riga giusta con una casella sbagliata di
1 o 2.

## Livello 6: valore in un'espressione con una lettera

$f(x) = mx + k$ con $2 \leq |m| \leq 5$, $k \neq 0$, $|k| \leq 6$. L'argomento è $a + h$ (con
$h \neq 0$, $|h| \leq 3$) metà delle volte, $-a$ un quarto, $2a$ o $3a$ un quarto. Si sostituisce
tra parentesi e si usa la proprietà distributiva, come nell'esempio 5; l'ultimo passaggio è il
controllo con $a = 1$.

Esempio: $f(x) = 3x - 2$, $f(a + 3) = 3(a + 3) - 2 = 3a + 9 - 2 = 3a + 7$.

Esempio: $f(x) = -5x - 5$, $f(-a) = -5 \cdot (-a) - 5 = 5a - 5$.

Distrattori: per $a + h$ sempre $f(a) + h$ (l'avviso "Confondere $f(a + 1)$ con $f(a) + 1$", che è
anche il risultato di chi moltiplica solo la $a$), poi $mh$ con il segno sbagliato, solo $h$
moltiplicato ($a + mh + k$), $f(a)$; per $-a$: $f(a)$ (meno perso), $-f(a)$ (meno su tutto),
$m \cdot (-a)$ letto come $m - a$; per $2a$ e $3a$: sempre $2f(a)$ o $3f(a)$, poi $f(a)$,
$(m + 2)a + k$; come riserva il termine noto spostato di 1.

## Esercizi da evitare

- Una relazione con due difetti insieme (un elemento con due immagini e uno senza): il perché non
  sarebbe uno solo.
- Opzioni su $B$ false: lo studente scarterebbe la risposta per un motivo diverso dall'errore vero.
- $f(0)$ al livello 2, dove il valore è il termine noto e il conto non c'è.
- Coefficiente $\pm 1$ ai livelli 2, 4 (primo grado) e 6, dove il prodotto sparisce.
- Tabelle senza negativi, dove gli errori di segno non si vedono.

## Controlli fatti

- `sample.mts definizione-funzione 1000 all 1 | verify.py`: PASS; con il seed di partenza 7001:
  PASS. Quote del seed 1: livello 1 funzione 335, due immagini 340, senza immagine 325; livello 2
  negativi 630; livello 4 primo grado 322; livello 5 primo grado 387; livello 6 $a + h$ 528, $-a$ 245,
  $2a$ e $3a$ 227.
- Esercizi diversi su 1.000 per livello (testo del problema): 996, 752, 727, 902, 499, 562.
- Errori piantati a mano, 30 campioni per tipo, tutti bocciati: livello 1 risposta giusta spostata,
  una coppia aggiunta nel problema (la funzione non è più una funzione), l'opzione su $B$ resa falsa;
  livello 2 risposta cambiata, opzione giusta spostata, `1x` nel problema; livello 3 $x$ positivo,
  distrattori senza l'errore $-2^2 = -4$; livello 4 risposta cambiata, $x$ intero; livello 5 una
  casella sbagliata nella riga giusta, LaTeX di un'opzione diverso dai suoi valori; livello 6 risposta
  cambiata, risposta non sviluppata, opzione giusta spostata, distrattori senza $f(a) + h$.
- `width.mts definizione-funzione`: nessuna formula oltre i limiti. Massimi del problema 284, 123,
  174, 163, 256, 123 px (limite 350); delle opzioni 183, 30, 30, 45, 174, 79 px (limite 252).
- `review.mts`: codice 0; `tsc` ed `eslint` senza errori nel generatore.

## Domande per la revisione

- Il livello 6 usa le lettere, e nella nota della lezione c'è il dubbio che il calcolo letterale
  arrivi dopo. Lo teniamo, o lo togliamo insieme all'esempio 5?
- Al livello 1 le coppie sono sempre in ordine e $B$ è sempre fatto di lettere. Mescolare l'ordine
  delle coppie, o usare numeri anche in $B$ come nell'esempio 2, renderebbe il livello più difficile:
  meglio un livello in più o va bene così?
- Al livello 5 lo studente sceglie la riga intera. In alternativa si possono dare due o tre caselle
  già piene e chiedere solo le altre: quale delle due forme è più vicina a quello che si fa in classe?
