# Sottoinsiemi e uguaglianza

Generatore: `sottoinsiemi-ugualianza` (`src/lib/exercises/v2/generators/sottoinsiemi-ugualianza.ts`).
Verifica indipendente: `scripts/exercises/checkers/sottoinsiemi_ugualianza.py`. Lezione
collegata: "Sottoinsiemi e uguaglianza" (`docs/lezioni/riscritte/04-sottoinsiemi-ugualianza.md`).

Convenzioni della lezione: $\subseteq$ è l'inclusione, $\subset$ l'inclusione stretta; i
sottoinsiemi impropri di $A$ sono $\emptyset$ e $A$, gli altri sono propri; due insiemi sono
uguali quando hanno gli stessi elementi, in qualunque ordine. La lezione avverte che alcuni libri
chiamano proprio anche $\emptyset$: per questo nessun esercizio dipende da come si classifica
$\emptyset$ (niente "quanti sottoinsiemi propri", e $\emptyset$ mai tra le opzioni del livello 4).

## Rappresentazione

- Livello 1: `params.A`, `params.B` nell'ordine in cui il problema li mostra, `params.case`.
- Livelli 2 e 3: `params.ask` (`vera` / `falsa`), `params.sets` (nell'ordine mostrato); ogni
  opzione ha `values = [op, sinistra, destra]` con `op` tra `in`, `notin`, `subeq`, `sub`, `eq` e
  termini `A`, `B`, `N`, `Z`, `Q`, `e:<elemento>`, `s:<elementi>` (un insieme scritto nell'opzione,
  `s:` è $\emptyset$). Al livello 3 `params.case` è la relazione tra A e B.
- Livello 4: `params.variant` (`tutti`, `con k elementi`, `proprio`), `params.A`, `params.k`.
- Livello 5: `params.variant` (`parola`, `quadrato`, `naturali`) con `word` o `prop`.

Il verificatore riscrive ogni affermazione e ogni insieme e li confronta con il testo delle
opzioni; valuta $\in$, $\subseteq$, $\subset$ e $=$ con gli insiemi di Python e conta i
sottoinsiemi con `itertools.combinations`.

## Livello 1: controllare un'inclusione

Vero o falso (due opzioni, Vero e Falso, in quest'ordine): $A \subseteq B$ con $A$ e $B$
elencati, numeri da 1 a 12 (sette volte su dieci) o lettere. Quattro casi: $A$ incluso e diverso
da $B$ (circa 35%), $A$ e $B$ uguali ma scritti in ordine diverso (circa 15%), un elemento di $A$
fuori da $B$ (circa 35%), $B$ incluso in $A$ e più piccolo (circa 15%). Vere e false metà e metà.

Esempi: $A = \{5, 6, 7, 11\}$, $B = \{7, 5, 6, 11\}$: vero. $A = \{6, 8\}$, $B = \{2, 5, 6, 12\}$:
falso, perché $8 \in A$ ma $8 \notin B$.

## Livello 2: appartenenza o inclusione

$B$ elencato (3-5 numeri da 1 a 12) e quattro affermazioni, una sola vera o una sola falsa. Le
affermazioni vengono dall'errore frequente della lezione: $e \in B$, $\{e\} \subseteq B$,
$\{e\} \in B$ (falsa), $\emptyset \subseteq B$ (vera), $\emptyset \in B$ (falsa), $f \in B$ e
$\{f\} \subseteq B$ con $f \notin B$, $\{e, f\} \subseteq B$, $B \subseteq B$. Mai
$2 \subseteq B$, che non ha senso.

Esempi: $B = \{3, 4, 5, 8, 9\}$, vera tra $\{5, 12\} \subseteq B$, $\emptyset \in B$,
$\emptyset \subseteq B$, $\{8\} \in B$: la terza. $B = \{2, 5, 7, 11, 12\}$, falsa tra
$\{12\} \subseteq B$, $\{4, 11\} \subseteq B$, $B \subseteq B$, $\emptyset \subseteq B$: la seconda.

## Livello 3: inclusione stretta

$A$ e $B$ elencati con tre relazioni: $A \subset B$ (circa 50%), $A = B$ con $A$ scritto in un
altro ordine (circa 30%), $B \subset A$ (circa 20%). Quattro affermazioni tra $A \subseteq B$,
$A \subset B$, $B \subseteq A$, $B \subset A$, $A = B$, $A \subseteq A$, $A \subset A$, e a volte
(al massimo una) sugli insiemi numerici ($\mathbb{N} \subset \mathbb{Z}$,
$\mathbb{Z} \subseteq \mathbb{N}$, $\mathbb{Q} \subset \mathbb{Q}$, ...). Una sola vera o una sola
falsa, metà e metà. $A \subseteq A$ è la risposta giusta solo se non c'è altro.

Esempi: $A = \{9, 3, 7\}$, $B = \{3, 7, 9\}$, falsa tra $A = B$, $A \subseteq B$, $A \subseteq A$,
$B \subset A$: l'ultima, perché i due insiemi sono uguali. $A = \{g, h\}$, $B = \{g, h, u\}$,
falsa tra $A \subset A$, $A \subseteq B$, $A \subset B$, $\mathbb{Z} \subseteq \mathbb{Q}$: la prima.

## Livello 4: sottoinsiemi propri e impropri

Tre varianti. "Quanti sottoinsiemi ha questo insieme?" con 2 o 3 elementi (circa 35%, risposta
`number`), elencati per numero di elementi come nell'esempio 3 della lezione. "Quanti
sottoinsiemi di A hanno k elementi?" con 3 o 4 elementi e $1 \le k < |A|$ (circa 30%, `number`).
"Quale di questi insiemi è un sottoinsieme proprio di A?" (circa 35%, `choice`): la risposta è un
sottoinsieme non vuoto e diverso da $A$; tra le opzioni c'è sempre $A$ stesso (improprio), le
altre contengono un elemento fuori da $A$.

Esempi: $A = \{c, d, p\}$ ha $1 + 3 + 3 + 1 = 8$ sottoinsiemi. Per $A = \{1, 5, 8\}$ è proprio
$\{5, 8\}$, non $\{1, 5, 8\}$, $\{10\}$ o $\{1, 5, 8, 12\}$.

## Livello 5: uguaglianza tra insiemi

"Quale di questi insiemi è uguale ad A?" con $A$ dato come lettere di una parola con lettere
ripetute (circa 40%), come $\{x \in \mathbb{Z} \mid x^2 = k^2\}$ (circa 30%) o come
$\{x \in \mathbb{N} \mid x < n\}$ (circa 30%). Quattro insiemi elencati, uno solo uguale.

Esempi: le lettere di "nonna" danno $\{a, n, o\}$, non $\{a, n, r\}$ (le lettere di "bar") né
$\{n, o\}$. $\{x \in \mathbb{N} \mid x < 5\} = \{0, 1, 2, 3, 4\}$, non $\{1, 2, 3, 4\}$.

## Variante a scelta multipla

Livelli 1, 2, 3, 5 e la terza variante del 4 nascono a scelta multipla (il livello 1 con due
opzioni, Vero e Falso). Per i conteggi del livello 4: il conteggio senza $\emptyset$ o senza $A$
($2^n - 1$, $2^n - 2$), il numero degli elementi $n$, il doppio $2n$; per i sottoinsiemi con $k$
elementi: $k$, $n$, tutti i sottoinsiemi, un'unità in più. Poi ±1, ±2.

Livello 5: per le parole, le lettere di una parola simile (gatto e gatti), una lettera tolta o
sostituita; per $x^2 = k^2$: $\{k\}$, $\{k^2\}$, $\{-k^2, k^2\}$; per i naturali: senza lo 0, da 1 a
$n$, da 0 a $n$.

## Esercizi da evitare

- Qualunque domanda la cui risposta cambia se $\emptyset$ si considera proprio o improprio.
- Affermazioni senza senso come $2 \subseteq B$.
- Due affermazioni equivalenti nella stessa domanda ($A = B$ e $B = A$).

## Domande per la revisione

- Il livello 1 a vero o falso ha due sole opzioni: va bene, o preferiamo sempre quattro opzioni?
- Al livello 4 il numero dei sottoinsiemi si ricava elencandoli (la lezione non dà la formula con
  le potenze di 2): va bene così, o la formula va aggiunta alla lezione?
- Al livello 2 le trappole con l'insieme vuoto compaiono spesso: sono troppe?
