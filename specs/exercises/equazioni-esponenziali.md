# Equazioni esponenziali

Generatore: `equazioni-esponenziali` (`src/lib/exercises/v2/generators/equazioni-esponenziali.ts`), con i pezzi
comuni del capitolo in `src/lib/exercises/v2/esponenziali.ts`. Verifica indipendente:
`scripts/exercises/checkers/equazioni_esponenziali.py` (aiuti comuni in `checkers/_esponenziali.py`). Lezione
collegata: `docs/lezioni/riscritte/122-equazioni-esponenziali.md`.

Lo studente riceve un'equazione esponenziale e ne trova le soluzioni. La consegna è sempre "Risolvi l'equazione.".
I passaggi seguono i procedimenti della lezione: scrivere il secondo membro come potenza della base, ridurre i due
membri a potenze della stessa base e uguagliare gli esponenti, raccogliere la potenza comune, porre $t = a^x$ con
$t > 0$ e scartare i valori negativi.

Nessun esercizio chiede un logaritmo: ogni valore di una potenza che compare è una potenza della base con
esponente intero. Le equazioni come $2^x = 5$ sono dei generatori delle lezioni 124-127.

## Tipo di risposta

`set` a tutti i livelli: i valori sono razionali esatti in ordine crescente (`"3"`, `"-4/3"`), la lista vuota è
l'equazione impossibile. `answer.latex` e `solution` sono l'insieme come lo scrive la lezione: $S = \{1, 2\}$,
$S = \left\{-\frac{4}{3}\right\}$ scritto `S = \{-\frac{4}{3}\}`, $S = \emptyset$.

`toChoice()` dà quattro opzioni: la risposta e i tre distrattori di `params.distractors`, ognuno un insieme
scritto nello stesso modo. A risposta aperta tutti i livelli si correggono sul valore (`V`).

## Costruzione all'indietro

Si scelgono prima le soluzioni (o gli esponenti, o i valori di $t$) e poi si scrive il testo. Ogni equazione è una
somma di termini $c \cdot a^{p \cdot e(x)}$ in ciascun membro, con una sola base prima $a$: `params.a` è la base,
`params.lhs` e `params.rhs` sono i termini, ognuno `{c, p, e}` con `e` i coefficienti dell'esponente per potenze
crescenti e `p = 0` per un numero. `params.case` è il caso del livello.

Il controllo Python non risolve con i metodi della lezione: rilegge l'equazione dal LaTeX del problema, verifica
che ogni valore della risposta renda uguali i due membri (40 cifre) e che il numero delle soluzioni sia il numero
dei cambi di segno di primo membro meno secondo membro su una griglia fitta tra $-13$ e $13$. Per questo le
soluzioni devono essere semplici: nessuna equazione ha una soluzione doppia.

## Regole comuni

- Base $a \in \{2, 3, 5\}$; al livello 1 anche $10$.
- I numeri che sono potenze di $a$ si scrivono come numeri: $81$, $\frac{1}{8}$, $1$. Gli esponenti ammessi sono
  da $-4$ a $6$ per $2$, da $-3$ a $4$ per $3$, da $-2$ a $3$ per $5$, da $-3$ a $3$ per $10$.
- Polinomi per potenze decrescenti; niente $1x$, $+ -$, esponente $1$, termini nulli.
- Tre distrattori distinti tra loro e dalla risposta; nessun distrattore è una risposta giusta.

## Livelli

### 1. Equazione elementare

$a^x = b$. In quattro casi su cinque $b$ è una potenza di $a$ (esponente negativo, zero o positivo); in uno su
cinque $b \leq 0$ e l'equazione è impossibile ($b = 0$ in un quarto di questi).

- $5^x = \frac{1}{5}$ → $S = \{-1\}$. Passaggi: $\frac{1}{5} = 5^{-1}$, $5^x = 5^{-1}$, $x = -1$.
- $5^x = -125$ → $S = \emptyset$: una potenza con la base positiva non vale mai un numero negativo.

Distrattori: l'esponente con il segno opposto (sempre presente quando la soluzione non è $0$), il numero diviso
per la base ($3^x = 81$ → $27$), il reciproco dell'esponente, $S = \emptyset$ quando $b$ è una frazione; per
l'impossibile $x = -n$ (da $7^x = -7$ a $x = -1$, l'avviso della lezione) e $x = n$.

### 2. Stessa base, esponente di primo grado

$a^{mx + k} = a^n$ con il secondo membro scritto come numero; $m$ tra $-3$ e $4$, non nullo, $|k| \leq 5$, non
$m = 1$ e $k = 0$. Soluzione razionale con denominatore fino a $4$ e numeratore fino a $9$ in valore assoluto.

- $3^{-3x} = 81$ → $S = \{-\frac{4}{3}\}$.
- $5^{-x - 3} = \frac{1}{25}$ → $S = \{-1\}$.

Distrattori: $k$ portato a secondo membro senza cambiare segno, l'esponente del secondo membro preso per soluzione
($x = n$), il segno sbagliato nella divisione.

### 3. Basi potenze dello stesso numero

$(a^p)^{m_1 x + k_1} = a^r$ scritto come numero (caso `un numero a secondo membro`), oppure
$(a^p)^{m_1 x + k_1} = (a^r)^{m_2 x + k_2}$ (caso `due potenze`), metà e metà. $p$ e $r$ tra $2$, $3$, $-1$, $-2$
(per $5$ non $3$), diversi tra loro: le basi sono $4$, $8$, $\frac{1}{2}$, $\frac{1}{4}$, $9$, $27$… Soluzione
razionale con denominatore fino a $6$.

- $25^{2x + 3} = 5$ → $5^{4x + 6} = 5^1$ → $S = \{-\frac{5}{4}\}$.
- $27^{2x - 1} = 9^{x - 3}$ → $6x - 3 = 2x - 6$ → $S = \{-\frac{3}{4}\}$.

Distrattori: l'esponente della base moltiplicato solo per il termine in $x$ (l'avviso "la potenza di potenza
moltiplica tutto l'esponente"), gli esponenti uguagliati come sono scritti, una base frazionaria presa per una
potenza positiva.

### 4. Esponente di secondo grado

$a^{x^2 + bx + c} = a^n$ scritto come numero, $n$ tra $-2$ e $3$. Due soluzioni intere distinte tra $-5$ e $5$.
Casi: `secondo membro 1`, `secondo membro frazione`, `secondo membro intero`.

- $3^{x^2 + 4x - 2} = 27$ → $x^2 + 4x - 5 = 0$ → $S = \{-5, 1\}$.
- $5^{x^2 + 5x - 2} = \frac{1}{25}$ → $x^2 + 5x = 0$ → $S = \{-5, 0\}$.

Distrattori: le soluzioni con i segni opposti (sempre presenti, se diverse dalla risposta), l'esponente uguagliato
a zero o a $n$ con il segno sbagliato, una sola delle due soluzioni.

### 5. Raccoglimento

$\pm a^{x + k_1} \pm a^{x + k_2} = N$, con $k_1 > k_2$ tra $-2$ e $3$, $N$ intero fino a $2000$ in valore
assoluto, soluzione intera tra $-2$ e $4$. Casi: `fattore positivo`, `fattore negativo` (il numero che resta dopo
il raccoglimento).

- $3^{x + 2} - 3^{x + 1} = 18$ → $3^{x + 1}(3 - 1) = 18$ → $3^{x + 1} = 9$ → $S = \{1\}$.
- $2^{x + 2} + 2^{x - 1} = 9$ → $2^{x - 1}(8 + 1) = 9$ → $2^{x - 1} = 1$ → $S = \{1\}$.

Distrattori: fermarsi all'esponente della potenza raccolta ($x + k_2$ al posto di $x$), l'altro esponente, la
soluzione più o meno $1$.

### 6. Sostituzione

$(a^2)^x + s \cdot a^x + p = 0$, cioè $t^2 + st + p = 0$ con $t = a^x$. Casi, metà e metà: `due soluzioni` (due
valori di $t$ potenze di $a$, con esponenti tra $0$ e $3$, fino a $2$ per la base $5$) e `un valore da scartare` (un valore negativo tra
$-9$ e $-1$ e una potenza di $a$). Le due radici in $t$ sono sempre distinte.

- $9^x - 30 \cdot 3^x + 81 = 0$ → $t_1 = 3$, $t_2 = 27$ → $S = \{1, 3\}$.
- $4^x - 2^x - 2 = 0$ → $t_1 = -1$ da scartare, $t_2 = 2$ → $S = \{1\}$.

Distrattori: i valori di $t$ dati come soluzioni (sempre presenti nel caso `due soluzioni`), una sola delle due
soluzioni, il valore negativo tenuto ($x = t$, oppure $x = -k$ quando $-t = a^k$).

### 7. Esponenti opposti

$a^x + a^{c - x} = N$ con due soluzioni intere (caso `due soluzioni`), oppure $a^x - a^{c - x} = N$, dove uno dei
due valori di $t$ è negativo (caso `un valore da scartare`). Passaggi: $a^{c - x} = \frac{a^c}{a^x}$, $t = a^x$,
moltiplicare per $t$.

- $3^x + 3^{2 - x} = 10$ → $t^2 - 10t + 9 = 0$ → $S = \{0, 2\}$.
- $2^x - 2^{3 - x} = -7$ → $t^2 + 7t - 8 = 0$ → $t_1 = -8$ da scartare, $t_2 = 1$ → $S = \{0\}$.

Distrattori: i valori di $t$, una sola soluzione, le soluzioni con i segni opposti, l'esponente dell'altro valore.

## Esercizi da evitare

- Equazioni che chiedono un logaritmo ($2^x = 5$, $t = 3$ con base $2$): mai.
- Soluzioni doppie ($4^x - 4 \cdot 2^x + 4 = 0$): il controllo conta i cambi di segno.
- Equazioni indeterminate o con i due membri identici.
- Al livello 3, basi uguali nei due membri ($\left(\frac{1}{9}\right)^{x - 3} = \frac{1}{9}$): sarebbe il livello 2.
- Numeri grandi: nessun secondo membro oltre $2000$, nessun esponente fuori dagli intervalli delle regole comuni.

## Limiti noti

- Non ci sono le basi diverse con lo stesso esponente ($2^x \cdot 5^x = 0{,}01$, $3^{x - 2} = 7^{x - 2}$), i
  radicali nelle basi ($4\sqrt{2}$) e la risoluzione grafica, che la lezione tratta.
- I livelli 1 e 7 hanno pochi esercizi diversi (circa 50 e circa 45).
