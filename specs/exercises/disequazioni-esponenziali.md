# Disequazioni esponenziali

Generatore: `disequazioni-esponenziali` (`src/lib/exercises/v2/generators/disequazioni-esponenziali.ts`), con i
pezzi comuni del capitolo in `src/lib/exercises/v2/esponenziali.ts`. Verifica indipendente:
`scripts/exercises/checkers/disequazioni_esponenziali.py` (aiuti comuni in `checkers/_esponenziali.py`). Lezione
collegata: `docs/lezioni/riscritte/123-disequazioni-esponenziali.md`.

Lo studente riceve una disequazione esponenziale e sceglie l'insieme delle soluzioni. La consegna è sempre
"Risolvi la disequazione.". I passaggi seguono la lezione: scrivere il secondo membro come potenza della base,
guardare la base (maggiore di $1$: il verso resta; tra $0$ e $1$: si inverte), passare agli esponenti; nel
raccoglimento dividere per il fattore, cambiando il verso se è negativo; nella sostituzione risolvere in $t$ e
riportare ogni condizione su $a^x$.

Nessun esercizio chiede un logaritmo. Le disequazioni come $2^x > 5$ sono dei generatori delle lezioni 124-127.

## Tipo di risposta

`choice` fin dall'inizio, a tutti i livelli, come in `disequazioni-secondo-grado`: la risposta è un'unione di
intervalli, e nessun tipo di oggi la contiene. `toChoice()` restituisce la risposta stessa. Nessun livello va a
risposta aperta.

Le quattro opzioni sono scritte tutte in una delle due forme della lezione, scelta a caso metà e metà
(`params.notation`):

- `disequazioni`: $x < -3$, $1 < x < 2$, $x < 0 \ \text{ oppure } \ x > 1$;
- `intervalli`: $S = \,\mathopen{]}-\infty, 0\mathclose{[}\, \cup \,\mathopen{]}1, +\infty\mathclose{[}$, con
  `\mathopen{]}` e `\mathclose{[}` per gli estremi esclusi e `\left]` … `\right[` quando un estremo è una
  frazione; due intervalli con una frazione vanno su due righe con `\begin{gathered}`.

$S = \mathbb{R}$, $S = \emptyset$ e gli insiemi di punti $S = \{1, 2\}$ si scrivono sempre come insiemi.
`solution` è la forma con gli intervalli; l'ultimo passaggio è la forma con "oppure", oppure "Ogni $x$ è
soluzione." e "Nessun $x$ è soluzione.". Valori delle opzioni: un intervallo per elemento, `["(-oo,0)", "(1,oo)"]`,
un punto come `"[1,1]"`, $\mathbb{R}$ come `"(-oo,oo)"`, $\emptyset$ come lista vuota.

## Costruzione all'indietro

Si scelgono prima gli estremi della soluzione e poi si scrive il testo. Ogni disequazione è una somma di termini
$c \cdot a^{p \cdot e(x)}$ in ciascun membro, con una sola base prima $a$ ($p = -1$ scrive la base
$\frac{1}{a}$): `params.a`, `params.lhs`, `params.rhs` come in `equazioni-esponenziali`, più `params.op` (`<`,
`>`, `<=`, `>=`), `params.notation`, `params.truth` (gli intervalli della risposta) e `params.case`.

Il controllo Python rilegge la disequazione dal LaTeX del problema e la valuta su una griglia fitta tra $-9$ e
$9$: deve essere vera esattamente nei punti che stanno negli intervalli della risposta. Ogni estremo finito deve
rendere uguali i due membri (40 cifre) ed è compreso solo con $\leq$ e $\geq$. Ogni opzione viene riscritta dai
suoi valori nella notazione del campione e confrontata con il suo LaTeX.

## Regole comuni

- Base $a \in \{2, 3, 5\}$; ai livelli 1-3 anche $10$. I numeri che sono potenze di $a$ si scrivono come numeri,
  con gli stessi esponenti di `equazioni-esponenziali`.
- I quattro versi, a caso.
- Estremi razionali con denominatore fino a $4$ e numeratore fino a $9$ in valore assoluto.
- La soluzione non è mai vuota né $\mathbb{R}$, tranne al livello 3.
- Quattro opzioni distinte, una sola giusta.

## Livelli

### 1. Elementare, base maggiore di 1

$a^x \gtrless b$ con $b = a^n$ scritto come numero. Casi: `esponente negativo`, `esponente non negativo`.

- $5^x \leq \frac{1}{25}$ → $x \leq -2$.
- $2^x > 8$ → $x > 3$.

Distrattori: la stessa semiretta con il verso girato (sempre presente), l'estremo compreso o escluso al contrario,
l'esponente con il segno opposto, il numero $b$ al posto dell'esponente.

### 2. Base tra 0 e 1

$\left(\frac{1}{a}\right)^x \gtrless b$ con $b = a^n$, $n \neq 0$: il verso si inverte. Casi: `secondo membro
frazione`, `secondo membro intero`.

- $\left(\frac{1}{5}\right)^x \leq \frac{1}{25}$ → $x \geq 2$.
- $\left(\frac{1}{2}\right)^x > 8$ → $x < -3$.

Distrattori: il verso non invertito (sempre presente: è l'avviso principale della lezione), il verso invertito con
l'esponente di segno sbagliato, tutti e due gli errori, l'estremo compreso o escluso al contrario.

### 3. Secondo membro negativo o nullo

$a^x \gtrless b$ oppure $\left(\frac{1}{a}\right)^x \gtrless b$. In sette casi su dieci $b \leq 0$ e la risposta è
$S = \mathbb{R}$ (versi $>$ e $\geq$, caso `sempre vera`) o $S = \emptyset$ (versi $<$ e $\leq$, caso
`impossibile`); in tre su dieci $b > 0$ (caso `secondo membro positivo`) e la risposta è una semiretta, perché lo
studente non risponda a memoria.

- $3^x > -9$ → $S = \mathbb{R}$.
- $\left(\frac{1}{5}\right)^x \leq -125$ → $S = \emptyset$.

Le opzioni sono sempre $S = \mathbb{R}$, $S = \emptyset$ e due semirette con i versi opposti: quelle con estremo
$\pm n$ che troverebbe chi cerca un esponente per il numero negativo (l'avviso "non cercare un esponente per un
numero negativo"), o la soluzione e il suo verso girato quando $b > 0$.

### 4. Stessa base, esponente di primo grado

$B^{mx + k} \gtrless a^n$ con $B = a$ oppure $B = \frac{1}{a}$, $m$ tra $-3$ e $4$ non nullo, $|k| \leq 5$. Casi:
le quattro combinazioni di `base maggiore di 1` / `base tra 0 e 1` e `m positivo` / `m negativo`. Con $m$
negativo il verso cambia una seconda volta, dividendo: è l'avviso "il verso dipende dalla base, non dal segno
dell'esponente".

- $3^{x + 5} > 81$ → $x + 5 > 4$ → $x > -1$.
- $5^{-3x + 3} > 1$ → $-3x + 3 > 0$ → $x < 1$.

Distrattori: la semiretta con il verso girato (sempre presente), l'estremo al contrario, l'estremo calcolato senza
cambiare il segno dell'esponente della base, $k$ portato dall'altra parte senza cambiare segno.

### 5. Esponente di secondo grado

$B^{x^2 + bx + c} \gtrless a^n$ con $B = a$ oppure $\frac{1}{a}$ e $n$ tra $-2$ e $3$: gli esponenti danno una
disequazione di secondo grado con due zeri interi distinti tra $-5$ e $5$. Casi: le quattro combinazioni di base e
di valori `interni` / `esterni`.

- $5^{x^2 + x - 3} \leq 125$ → $x^2 + x - 6 \leq 0$ → $-3 \leq x \leq 2$.
- $\left(\frac{1}{3}\right)^{x^2 - 2} \leq \frac{1}{9}$ → $x^2 - 2 \geq 2$ → $x^2 - 4 \geq 0$ → $x \leq -2$ oppure $x \geq 2$.

Distrattori: la risposta complementare (sempre presente: valori interni al posto degli esterni, cioè il verso non
invertito o invertito a torto), gli estremi al contrario, le due soluzioni dell'equazione, i due errori insieme.

### 6. Raccoglimento

$\pm a^{x + k_1} \pm a^{x + k_2} \gtrless N$, come al livello 5 di `equazioni-esponenziali`. Casi, metà e metà:
`fattore positivo` e `fattore negativo`; nel secondo, dividendo, il verso cambia.

- $2^{x + 2} + 2^{x - 1} \geq 9$ → $2^{x - 1} \geq 1$ → $x \geq 1$.
- $-3^{x + 2} + 3^{x + 1} < -18$ → $-2 \cdot 3^{x + 1} < -18$ → $3^{x + 1} > 9$ → $x > 1$.

Distrattori: la semiretta con il verso girato (sempre presente), l'estremo al contrario, l'esponente della potenza
raccolta al posto di $x$.

### 7. Sostituzione

$(a^2)^x + s \cdot a^x + p \gtrless 0$. Casi: `due valori positivi` di $t$ (potenze di $a$), con valori `interni`
o `esterni`; `un valore negativo` e una potenza di $a$, dove una condizione su $t$ è impossibile oppure sempre
vera e la risposta è una semiretta.

- $9^x - 36 \cdot 3^x + 243 < 0$ → $9 < t < 27$ → $2 < x < 3$.
- $9^x - 8 \cdot 3^x - 9 < 0$ → $-1 < t < 9$ → $x < 2$.

Distrattori: con due valori positivi, i valori di $t$ dati come soluzione (sempre presenti: l'avviso "rispondere
con i valori di $t$"), la risposta complementare, gli estremi al contrario; con un valore negativo, $S = \emptyset$
o $S = \mathbb{R}$ di chi butta via tutta la condizione (sempre presente: l'avviso "una condizione su $t$ negativa
non si butta sempre via"), la semiretta girata, la semiretta con il valore di $t$.

## Esercizi da evitare

- Disequazioni che chiedono un logaritmo: mai.
- Trinomi in $t$ con zeri coincidenti.
- Estremi con denominatori oltre $4$.
- Al livello 2, il secondo membro $1$ ($n = 0$): la risposta non distingue il segno dell'esponente.

## Limiti noti

- Non ci sono le disequazioni fratte né quelle con basi diverse e lo stesso esponente, che la lezione tratta con
  un esempio ciascuna.
- Le basi minori di $1$ sono solo $\frac{1}{a}$: non ci sono $\frac{2}{3}$ né i decimali.
