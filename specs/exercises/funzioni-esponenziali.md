# Funzione esponenziale

Generatore: `funzioni-esponenziali` (`src/lib/exercises/v2/generators/funzioni-esponenziali.ts`), con i pezzi
comuni del capitolo in `src/lib/exercises/v2/esponenziali.ts`. Verifica indipendente:
`scripts/exercises/checkers/funzioni_esponenziali.py` (aiuti comuni in `checkers/_esponenziali.py`, i grafici in
`checkers/_grafici.py`). Lezione
collegata: `docs/lezioni/riscritte/121-funzioni-esponenziali.md`.

Nove livelli nell'ordine della lezione: i valori di $a^x$, crescente o decrescente dalla base, il confronto di
potenze con la stessa base, la base da un punto del grafico, asintoto e immagine di un grafico spostato o
ribaltato, dalla funzione al grafico, dal grafico alla funzione, il dominio, la crescita e il decadimento. I
livelli 6 e 7 mostrano grafici: sono il pilota degli esercizi con il piano cartesiano
(`scripts/exercises/README.md`, "Esercizi con i grafici"). Nessun esercizio chiede un logaritmo né un'equazione che non
sia $a^x = a^n$ letta a occhio.

## Tipo di risposta

| Livello | Risposta | A risposta aperta |
|---|---|---|
| 1 | `number`, razionale esatto | sì, sul valore (`V`) |
| 2 | `choice` tra quattro funzioni | no |
| 3 | `choice` tra quattro potenze | no |
| 4 | `number`, la base | sì, sul valore (`V`) |
| 5 | `choice` tra quattro rette o quattro intervalli | no |
| 6 | `choice` tra quattro grafici | no |
| 7 | `number`, la base, quando il grafico è quello di $a^x$; `choice` tra quattro funzioni negli altri casi | sì, sul valore (`V`), solo per la base |
| 8 | `set`, i valori esclusi dal dominio | sì, valori esclusi (`EXCLUDED`) |
| 9 | `number`, intero | sì, sul valore (`V`) |

Ai livelli 1, 4, 8 e 9, e al livello 7 quando si chiede la base, `toChoice()` dà quattro opzioni: la risposta e i
tre distrattori di `params.distractors`. Ai livelli 2, 3, 5 e 6, e negli altri casi del livello 7, la risposta è
già la scelta. Le coordinate dei punti si scrivono con la virgola, $P(2, 9)$,
i decimali con `{,}`.

Il controllo Python risponde di nuovo a ogni esercizio partendo dal testo, non dai parametri: sostituisce $k$ in
$f(x)$, confronta due valori di ogni funzione, calcola il valore numerico delle quattro potenze, verifica
$a^k = y$, legge asintoto e immagine dai valori della funzione lontano a sinistra e a destra, cerca i punti dove
la funzione non ha valore. Il livello 9, che è un problema a parole, si ricalcola dai numeri dei parametri, che
devono comparire tutti nel testo. Dove il testo lo permette, controlla anche che i parametri dicano la stessa
funzione.

## Livelli

### 1. Valori di una funzione esponenziale

Consegna "Calcola f(k)." con il problema $f(x) = a^x$. Base tra $2$, $3$, $4$, $5$, $10$, $\frac{1}{2}$,
$\frac{1}{3}$, $\frac{1}{4}$, $\frac{2}{3}$, $\frac{3}{2}$, $\frac{3}{4}$, $\frac{2}{5}$; $k$ intero tra $-3$ e
$3$, diverso da $1$: negativo in poco più di metà dei casi, zero in uno su dieci. Numeratore e denominatore del
risultato fino a $1000$. Casi: `esponente negativo`, `esponente zero`, `esponente positivo`.

- $f(x) = \left(\frac{1}{4}\right)^x$, $f(-2)$ → $16$.
- $f(x) = \left(\frac{2}{3}\right)^x$, $f(-3)$ → $\frac{27}{8}$.

Distrattori: con $k$ negativo, l'opposto di $a^{|k|}$ (sempre presente: l'avviso "l'esponenziale non è mai
negativa", $2^{-3} = -8$), $a^{|k|}$ senza il reciproco, l'opposto del risultato, il prodotto $a \cdot k$; con
$k = 0$, lo zero e la base; con $k$ positivo, $a \cdot k$ e il reciproco.

### 2. Crescente o decrescente

Consegna "Quale di queste funzioni è crescente?" (o "decrescente", metà e metà). Il problema elenca quattro
funzioni $y = a^x$ o $y = a^{-x}$, con basi intere, frazionarie o decimali ($0{,}7$, $1{,}5$): una sola ha
l'andamento chiesto. Almeno una delle quattro è scritta con $-x$, che nasconde la base (esempio 1 della lezione:
$3^{-x} = \left(\frac{1}{3}\right)^x$). Le opzioni sono le quattro funzioni. Casi: `crescente`, `decrescente`, con
`, con -x` quando la funzione giusta è scritta con $-x$.

- $y = \left(\frac{3}{2}\right)^{-x}$, $y = 0{,}7^x$, $y = 0{,}9^x$, $y = \left(\frac{3}{2}\right)^x$; crescente →
  $y = \left(\frac{3}{2}\right)^x$.
- $y = 1{,}5^x$, $y = \left(\frac{2}{3}\right)^{-x}$, $y = \left(\frac{1}{2}\right)^x$, $y = 2{,}5^x$; decrescente →
  $y = \left(\frac{1}{2}\right)^x$.

### 3. Confronto di potenze con la stessa base

Consegna "Qual è il più grande di questi numeri?" (o "il più piccolo"). Quattro potenze della stessa base, con
esponenti interi, frazionari, decimali o irrazionali ($\sqrt{2}$, $\sqrt{3}$, $\sqrt{5}$, $\pi$, $-\sqrt{2}$);
almeno uno irrazionale; due esponenti distano almeno $0{,}03$ (la coppia più vicina è $1{,}7$ e $\sqrt{3}$, quella
dell'esempio 2 della lezione). Base tra $2$, $3$, $5$, $10$, $\frac{3}{2}$, $\frac{1}{2}$, $\frac{1}{3}$,
$\frac{2}{3}$, $0{,}3$, $0{,}5$. Casi: base maggiore o minore di $1$ per più grande o più piccolo.

- $\left(\frac{1}{3}\right)^{\frac{1}{2}}$, $\left(\frac{1}{3}\right)^3$, $\left(\frac{1}{3}\right)^{-\sqrt{2}}$,
  $\left(\frac{1}{3}\right)^{\pi}$; il più grande → $\left(\frac{1}{3}\right)^{-\sqrt{2}}$.
- $3^{\frac{3}{2}}$, $3^{\sqrt{2}}$, $3^{-\frac{1}{2}}$, $3^{\frac{1}{2}}$; il più grande → $3^{\frac{3}{2}}$.

Le opzioni sono le quattro potenze: tra loro c'è sempre quella all'estremo opposto, la risposta di chi non rovescia
l'ordine con la base minore di $1$ (o lo rovescia con la base maggiore di $1$).

### 4. La base da un punto

Consegna "Trova la base a della funzione esponenziale y = a^x che passa per il punto P.", problema
$P(k, a^k)$ con $k$ tra $-3$, $-2$, $-1$, $2$, $3$ e le basi del livello 1 più $\frac{5}{2}$. Casi: `ascissa
negativa`, `ascissa positiva`.

- $P\left(-3, \frac{27}{8}\right)$ → $a = \frac{2}{3}$.
- $P\left(-1, \frac{2}{3}\right)$ → $a = \frac{3}{2}$.

Distrattori: il reciproco della base (sempre presente: il segno dell'esponente dimenticato), la base negativa
(l'esempio 3 della lezione: la base è positiva), l'ordinata divisa per l'ascissa, l'ordinata stessa.

### 5. Asintoto e immagine di un grafico trasformato

Problema $y = a^x + k$, $y = a^{x - h}$, $y = -a^x$, $y = a^{-x}$ oppure $y = a^{x - h} + k$ (le righe della
tabella della lezione e la loro combinazione), con $a$ tra $2$, $3$, $5$, $\frac{1}{2}$, $\frac{1}{3}$, $h$ tra
$-5$ e $5$, $k$ tra $-6$ e $6$, non nulli e diversi tra loro. Consegna, metà e metà: "Qual è l'asintoto
orizzontale del grafico della funzione?" (opzioni: rette $y = \dots$ o $x = \dots$) oppure "Qual è l'immagine
della funzione?" (opzioni: intervalli, o $\mathbb{R}$). Casi: `asintoto: ` o `immagine: ` seguito dalla forma.

- $y = \left(\frac{1}{2}\right)^x + 6$, asintoto → $y = 6$.
- $y = \left(\frac{1}{2}\right)^x - 1$, immagine → $\mathopen{]}-1, +\infty\mathclose{[}$.

Distrattori: quando c'è $k$, la risposta della funzione non spostata ($y = 0$, $\mathopen{]}0, +\infty\mathclose{[}$:
sempre presenti), il segno di $k$ sbagliato, la retta verticale $x = k$, l'estremo $k$ compreso; quando c'è solo
$h$, la retta $y = h$ o $x = h$ e l'intervallo $\mathopen{]}h, +\infty\mathclose{[}$; per $y = -a^x$,
l'immagine $\mathopen{]}0, +\infty\mathclose{[}$.

### 6. Dalla funzione al grafico

Consegna "Qual è il grafico della funzione?", problema $y = \dots$, quattro grafici come opzioni: piani piccoli
con la stessa finestra, la griglia di un'unità e i numeri ogni due. Ogni grafico esponenziale ha segnato il punto
dove $y = a^x$ ha $(0, 1)$ e, tratteggiato, l'asintoto quando non è l'asse $x$. Cinque forme (casi):

- `a^x`, poco più di un terzo: basi $2$, $3$, $4$, $\frac{1}{2}$, $\frac{1}{3}$, $\frac{1}{4}$, finestra $x$ da
  $-4$ a $4$, $y$ da $-3$ a $5$. Grafici sbagliati: la base scambiata con la reciproca (sempre), poi due tra la
  retta $y = 1$ (cioè $1^x$), $y = -a^x$ e la retta $y = ax$ di chi legge l'esponente come fattore. Per $y = 3^x$
  escono così la curva crescente, la retta costante e la curva decrescente.
- `in su o in giù`, $y = a^x + k$, e `a destra o a sinistra`, $y = a^{x - h}$, un quarto ciascuna: basi $2$, $3$,
  $\frac{1}{2}$, $\frac{1}{3}$, spostamento di $2$ o di $3$ (con $1$ due grafici si confondono in piccolo),
  finestra da $-5$ a $5$ sui due assi. Grafici sbagliati: lo spostamento dal lato opposto e lo spostamento lungo
  l'altro asse (sempre), poi il grafico non spostato oppure, per $a^x + k$, quello con la base reciproca.
- `ribaltata rispetto all'asse x`, $y = -a^x$, e `ribaltata rispetto all'asse y`, $y = a^{-x}$, il resto: finestra
  da $-4$ a $4$. Grafici sbagliati: il ribaltamento rispetto all'altro asse, nessun ribaltamento, tutti e due.

Esempi: $y = 3^x$ → la curva che sale e passa per $(0, 1)$ e $(1, 3)$; $y = 2^{x - 2}$ → la curva che sale e passa
per $(2, 1)$ e $(3, 2)$.

Due grafici qualsiasi dei quattro si distinguono in piccolo: letti in 41 ascisse della finestra e tagliati ai suoi
bordi, distano da qualche parte almeno il 15% dell'altezza, e almeno l'8% in sei ascisse. La soluzione dice a
parole quale curva è e mostra il grafico giusto in grande, con i due punti a coordinate intere e le loro
coordinate.

### 7. Dal grafico alla funzione

Il problema è un grafico, grande, con due punti segnati a coordinate intere da leggere sulla griglia (i numeri
sugli assi sono a ogni unità): quello a distanza $1$ dall'asintoto e quello un passo più in là, a destra per una
base maggiore di $1$ e a sinistra per una base $\frac{1}{n}$. Tre casi:

- `la base`, due su cinque: il grafico di $y = a^x$ con $a$ tra $2$, $3$, $4$, $5$ e i loro reciproci, finestra
  $x$ da $-4$ a $4$, $y$ da $-2$ a $6$. Consegna "Il grafico è quello di una funzione esponenziale $y = a^x$.
  Trova la base $a$.". La risposta è un numero, anche a risposta aperta. Distrattori: la reciproca (sempre), $1$
  (l'ordinata di $(0, 1)$), la base negativa.
- `in su o in giù`, il grafico di $y = a^x + k$ con l'asintoto $y = k$ tratteggiato, e `a destra o a sinistra`, il
  grafico di $y = a^{x - h}$: basi $2$, $3$, $\frac{1}{2}$, $\frac{1}{3}$, spostamento da $-3$ a $3$, non nullo.
  Consegna "Quale funzione ha questo grafico?", quattro funzioni come opzioni. Distrattori: lo spostamento con il
  segno opposto e lo spostamento lungo l'altro asse (sempre), poi la base reciproca.

Esempi: il grafico per $(0, 1)$ e $(-1, 3)$ → $a = \frac{1}{3}$; il grafico con asintoto $y = 3$ per $(0, 4)$ e
$(1, 5)$ → $y = 2^x + 3$.

### 8. Dominio

Consegna "Trova il dominio della funzione.". Due forme: `esponente fratto`, $y = a^{\frac{n}{x - c}}$ con $c$ tra
$-6$ e $6$; `esponenziale a denominatore`, $y = \frac{n}{a^x - b}$ con $b = a^m$ scritto come numero, oppure
$y = \frac{n}{a^{x - h} - b}$. Base tra $2$, $3$, $5$, $n$ tra $1$ e $3$. La risposta è il valore escluso,
$D = \mathbb{R} \setminus \{3\}$.

- $y = \frac{1}{3^x - 27}$ → $D = \mathbb{R} \setminus \{3\}$.
- $y = 5^{\frac{1}{x}}$ → $D = \mathbb{R} \setminus \{0\}$.

Distrattori: $D = \mathbb{R}$ (sempre presente: "l'esponenziale è definita ovunque"), il numero $b$ al posto del
suo esponente, il valore con il segno opposto, lo zero.

### 9. Crescita e decadimento

Consegna "Risolvi il problema.", problema a parole su righe di testo. Quattro storie: `aumento percentuale` e
`diminuzione percentuale` (un capitale, una popolazione, il valore di un'auto: $p\%$ all'anno per $2$ o $3$ anni,
$p$ tra $5$, $10$, $20$, $25$, $50$), `raddoppio` (batteri che raddoppiano ogni $T$ ore) e `dimezzamento` (un
farmaco che si dimezza ogni $T$ ore), dopo un numero intero di periodi da $2$ a $5$. Il risultato è intero.

- "Una coltura di 1000 batteri raddoppia ogni 2 ore. Quanti batteri ci sono dopo 8 ore?" → $16000$.
- "Un capitale di 1000 euro cresce del $10\%$ all'anno. Quanti euro vale dopo 2 anni?" → $1210$.

Distrattori: il valore della crescita lineare (sempre presente quando è intero e diverso dalla risposta: l'avviso
"crescita esponenziale e crescita lineare", il $2\%$ per $10$ anni non è il $20\%$), un periodo in più o in meno.

## Esercizi da evitare

- Risultati con numeratore o denominatore oltre $1000$ ai livelli 1 e 4.
- Ai livelli 6 e 7, un punto segnato fuori dalla finestra o a meno di mezza unità dal bordo, e al livello 6 due
  grafici che in piccolo sembrano uguali.
- Al livello 3, due potenze con valori quasi uguali o l'esponente $1$.
- Al livello 2, due funzioni con l'andamento chiesto.
- Al livello 9, risultati non interi e tempi che non sono multipli del periodo.

## Limiti noti

- Non ci sono esercizi sul numero $e$ e sul dominio di $f(x)^{g(x)}$.
- I grafici dei livelli 6 e 7 hanno un solo spostamento: $y = a^{x - h} + k$ non c'è. Al livello 7 la funzione
  spostata si sceglie tra quattro: scriverla a risposta aperta chiederebbe al correttore di leggere una funzione.
- Il livello 5 non chiede le intersezioni con gli assi, che la lezione trova nell'esempio 4 con un'equazione.
- I livelli 1 e 4 hanno pochi esercizi diversi (circa 70 e circa 60).
