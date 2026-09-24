# Prime definizioni sugli insiemi

Generatore: `prime-definizioni` (`src/lib/exercises/v2/generators/prime-definizioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/prime_definizioni.py`. Lezione collegata:
"Prime definizioni" (`docs/lezioni/riscritte/01-prime-definizioni.md`).

Gli esercizi seguono le sezioni della lezione: che cos'è un insieme, appartenenza, l'insieme vuoto,
cardinalità, insiemi finiti e infiniti. Convenzioni della lezione: $0 \in \mathbb{N}$; la
cardinalità si scrive $|A|$; l'insieme vuoto $\emptyset$; gli elementi si elencano tra graffe,
separati da virgola e spazio.

Cinque livelli su sei nascono a scelta multipla (risposta `choice`, quattro opzioni, una sola
giusta); il livello 5 ha risposta `number` e una variante a scelta multipla con quattro numeri.

## Rappresentazione

- `params.ask`: la domanda (`è` / `non è` al livello 1, `vera` / `falsa` ai livelli 2 e 3,
  `infinito` / `finito` al livello 6).
- Livelli 2 e 3: `params.sets` (al livello 2 solo `A`, elementi come stringhe) e
  `params.statements`; ogni opzione ha `values = [op, sinistra, destra]`, con `op` tra `in` e
  `notin`, a sinistra `e:<elemento>` e a destra `A`, `N`, `Z` o `Q`.
- Livello 1: `values = [id]` della collezione; il verificatore ha una sua tabella testo → ben
  definita sì o no.
- Livello 4: `values` descrive il candidato: `["lt", k]` (naturali minori di k),
  `["eq", a, b]` (naturali con x + a = b), `["btw", n, m]` (naturali maggiori di n e minori di m),
  `["lit0"]` ($\{0\}$), `["litE"]` ($\{\emptyset\}$), `["mesi", d]` (mesi con d giorni).
- Livello 5: `params.variant` (`parola`, `ripetuti`, `lt`, `le`, `pari`, `vuoto`, `zero`,
  `insvuoto`) con `word`, `list` o `n`; `params.mistakes` sono i distrattori.
- Livello 6: `values = [tipo, parametri]`, per esempio `["mult", "7"]`, `["div", "24"]`.

## Regole comuni

- Quattro opzioni distinte, una sola corretta; nessuna opzione ripetuta nel testo o nei valori.
- Frazioni sempre ridotte e mai intere; niente graffe vuote (si scrive $\emptyset$).
- Un insieme elencato non ripete elementi, tranne nella variante `ripetuti` del livello 5, dove la
  ripetizione è proprio la difficoltà (la lezione scrive $\{1, 2, 2, 3\}$ e dice che ha 3 elementi).
- Il testo lungo va a capo in righe di circa 46 caratteri, per il telefono.

## Livello 1: insieme o no

"Quale di queste collezioni è un insieme?" (tre collezioni non ben definite e una ben definita)
oppure "Quale di queste collezioni non è un insieme?" (il contrario), metà e metà. Le collezioni
vengono da due elenchi chiusi, scritti come negli esempi della lezione: "I giorni della
settimana", "I numeri naturali minori di 10" da una parte; "I ragazzi simpatici della tua classe",
"I numeri grandi" dall'altra. Ogni passaggio dice perché la collezione è o non è ben definita.

Esempi: tra "I mesi dell'anno che hanno 30 giorni", "Le canzoni famose", "I film più belli
dell'anno", "Le città più belle d'Italia" l'insieme è il primo. Tra "Le stagioni dell'anno", "I
numeri naturali minori di 10", "Gli studenti bravi in matematica", "Le vocali dell'alfabeto
italiano" non è un insieme il terzo.

## Livello 2: appartenenza con ∈ e ∉

$A$ elencato con 4-6 elementi, numeri da 0 a 15 (sette volte su dieci) o lettere. Quattro
affermazioni $x \in A$ o $x \notin A$, ognuna su un elemento diverso; una sola vera ("Quale
affermazione è vera?") o una sola falsa ("... è falsa?"), metà e metà. Gli elementi fuori da $A$
sono scelti vicini a quelli di $A$ (un'unità prima o dopo) oppure lo 0, perché sembrino dentro.

Esempi: $A = \{2, 7, 10, 11, 15\}$, falsa tra $7 \in A$, $3 \notin A$, $9 \in A$, $10 \in A$: è
$9 \in A$. $A = \{a, b, e, h, o, r\}$, vera tra $u \in A$, $c \in A$, $s \notin A$, $h \notin A$:
è $s \notin A$.

## Livello 3: appartenenza a ℕ, ℤ, ℚ

Quattro affermazioni $x \in X$ o $x \notin X$ con $X$ tra $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$
e $x$ tra: 0, interi da 1 a 20, interi da −20 a −1, frazioni ridotte non intere con denominatore
da 2 a 5. Una sola vera o una sola falsa, metà e metà, ogni affermazione su un numero diverso. Le
trappole della lezione: $0 \in \mathbb{N}$, $-2 \notin \mathbb{N}$, $\frac{1}{2} \notin \mathbb{Z}$,
ogni intero è in $\mathbb{Q}$.

Esempi: vera tra $0 \in \mathbb{Z}$, $-12 \in \mathbb{N}$, $-\frac{9}{5} \in \mathbb{N}$,
$\frac{1}{3} \in \mathbb{N}$: la prima. Falsa tra $9 \in \mathbb{Z}$, $0 \in \mathbb{N}$,
$6 \in \mathbb{N}$, $-13 \notin \mathbb{Z}$: l'ultima.

## Livello 4: l'insieme vuoto

"Quale di questi insiemi è vuoto?" Un solo candidato vuoto: naturali minori di 0, naturali con
$x + a = b$ e $a > b$, naturali maggiori di $n$ e minori di $n + 1$, mesi con 32 giorni. Tre
candidati non vuoti, presi dagli errori della lezione: $\{0\}$, $\{\emptyset\}$, naturali minori
di 1 (che è $\{0\}$), $x + a = a$ (soluzione 0, naturale), naturali tra $n$ e $n + 2$, mesi con 30
o 31 giorni.

Esempi: tra "i naturali $x$ tali che $x + 3 = 8$", "i naturali minori di 1", "i naturali $x$ tali
che $x + 8 = 7$", "i naturali minori di 3" è vuoto il terzo. Tra $\{\emptyset\}$, "i naturali
maggiori di 0 e minori di 1", "$x + 1 = 4$", "i naturali minori di 2" è vuoto il secondo.

## Livello 5: cardinalità

Risposta `number`. Quattro varianti, con queste quote: lettere di una parola con lettere ripetute
(circa 40%), un elenco con 1 o 2 elementi ripetuti (circa 20%), naturali minori di $n$, minori o
uguali a $n$, pari minori di $n$, con $n$ da 5 a 15 (circa 30%), e i casi $\emptyset$, $\{0\}$,
$\{\emptyset\}$ (circa 10%).

Esempi: le lettere di "rossetto" sono $\{r, o, s, e, t\}$, $|A| = 5$. $A = \{7, 7, 2, 8, 12, 2\}$
ha 4 elementi. I naturali minori di 9 sono 9, perché c'è anche lo 0.

## Livello 6: finito o infinito

"Quale di questi insiemi è infinito?" (tre finiti) o "... è finito?" (tre infiniti), metà e metà.
Infiniti: naturali pari, naturali dispari, multipli di $k$ in $\mathbb{N}$, interi negativi,
naturali maggiori di $n$, razionali tra 0 e 1. Finiti: naturali minori di un milione, divisori di
$n$, $\emptyset$, naturali minori di $n$, lettere dell'alfabeto italiano, multipli di $k$ minori
di $n$, lettere di una parola.

Esempi: infinito tra "naturali minori di un milione", "naturali dispari", "lettere dell'alfabeto",
"lettere di “scuola”": il secondo. Finito tra "interi negativi", "naturali maggiori di 1000",
"razionali tra 0 e 1", $\emptyset$: l'ultimo.

## Variante a scelta multipla

Livelli 1-4 e 6: sono già a scelta multipla, e i distrattori sono quelli descritti sopra.
Livello 5: la cardinalità contando le ripetizioni (lunghezza della parola o dell'elenco),
dimenticando o aggiungendo lo 0 ($n - 1$, $n + 1$), $|\emptyset| = 1$ o $|\{0\}| = 0$; poi ±1, ±2.

## Esercizi da evitare

- Collezioni discutibili ("i pianeti del sistema solare", "i granelli di sabbia"): non sono negli
  elenchi.
- Una parola senza lettere ripetute al livello 5, o un elenco senza ripetizioni nella variante
  `ripetuti`: la difficoltà sparisce.
- Frazioni non ridotte ($-\frac{15}{6}$) o apparenti ($\frac{6}{3}$) al livello 3.
- Due affermazioni sullo stesso elemento, che si tradiscono a vicenda.

## Domande per la revisione

- Le collezioni del livello 1 sono tutte indiscutibili? Qualcuna (per esempio "I colori della
  bandiera italiana") potrebbe far discutere in classe?
- Al livello 2 gli insiemi di lettere prese a caso (per esempio a, b, e, h, o, r) vanno bene, o meglio le
  lettere di una parola?
- Al livello 5 la variante con gli elementi ripetuti (per esempio A = {7, 7, 2, 8, 12, 2}) è una scrittura che
  vogliamo mostrare?
