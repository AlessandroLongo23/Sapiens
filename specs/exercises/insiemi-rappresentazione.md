# Rappresentazione degli insiemi

Generatore: `insiemi-rappresentazione` (`src/lib/exercises/v2/generators/insiemi-rappresentazione.ts`).
Verifica indipendente: `scripts/exercises/checkers/insiemi_rappresentazione.py`. Lezione collegata:
"Rappresentazione degli insiemi" (`docs/lezioni/riscritte/02-insiemi-rappresentazione.md`).

Lo studente passa dalla proprietà caratteristica all'elencazione (livelli 1-4, risposta `set`)
e dall'elencazione alla proprietà (livello 5, risposta `choice`). Si segue il procedimento della
lezione: guardare l'insieme di partenza, provare i candidati dal più piccolo, controllare gli
estremi, scrivere gli elementi una volta. Convenzioni: $0 \in \mathbb{N}$; la barra $\mid$ si
legge "tale che"; $<$ esclude l'estremo e $\le$ lo include; l'insieme vuoto è $\emptyset$.

## Rappresentazione

`params.prop` è la proprietà: `{dom: "N" | "Z", conds: [...]}`, con numeri come stringhe. Le
condizioni possibili sono `range` (`lo`, `loStrict`, `hi`, `hiStrict`, un lato può mancare),
`pari`, `dispari`, `mult` (`k`), `div` (`n`), `lin` (`a·x + b rel c`) e `sq` (`x^2 rel c`), con
`rel` tra `<`, `<=`, `=`. Più condizioni sono unite da "e". Il testo del problema è esattamente
`A = \{x \in \mathbb{N} \mid ...\}` e il verificatore lo riscrive da `params.prop` per confrontarlo.
`params.wrong` elenca gli insiemi sbagliati da cui partono i distrattori.

Al livello 5 `params.E` è l'insieme elencato e ogni opzione ha in `values[0]` la proprietà in JSON.

## Regole comuni

- Al massimo 10 elementi nella risposta; ogni proprietà descrive un insieme finito.
- Gli elementi della risposta sono in ordine crescente, senza ripetizioni.
- Il verificatore trova gli elementi provando tutti gli interi da −1000 a 1000 (da 0 in
  $\mathbb{N}$), senza risolvere niente.

## Livello 1: gli estremi in ℕ

$x < n$ (circa 25%), $x \le n$ (circa 20%), oppure $a \ldots x \ldots b$ con ciascun estremo incluso
o escluso a caso (circa 55%), $a$ da 0 a 8, $b$ da $a + 3$ a $a + 6$. Insieme mai vuoto.

Esempi: $\{x \in \mathbb{N} \mid 0 < x \le 5\} = \{1, 2, 3, 4, 5\}$;
$\{x \in \mathbb{N} \mid x \le 4\} = \{0, 1, 2, 3, 4\}$.

## Livello 2: pari, dispari, multipli, divisori

In $\mathbb{N}$: pari o dispari con $x \le n$, $1 \le x \le n$ oppure $a < x < n$; multipli di $k$
(da 3 a 6) con $x \le n$, $1 \le x \le n$ oppure $x < n$; divisori di un numero tra 6, 8, 10, 12, 15,
16, 18, 20, 24, 28, 30, 36. La difficoltà è lo 0: è pari ed è multiplo di ogni numero (entra se
gli estremi lo permettono), ma non è un divisore.

Esempi: $\{x \in \mathbb{N} \mid x \text{ è multiplo di } 4 \text{ e } 1 \le x \le 30\} =
\{4, 8, 12, 16, 20, 24, 28\}$; $\{x \in \mathbb{N} \mid x \text{ è un divisore di } 28\} =
\{1, 2, 4, 7, 14, 28\}$.

## Livello 3: ℕ oppure ℤ

Intervalli in $\mathbb{Z}$ con estremo sinistro da −6 a −1 (circa 50%); $x^2 = k^2$ con $k$ da 1 a 6,
in $\mathbb{N}$ o in $\mathbb{Z}$ (circa 35%); intervalli in $\mathbb{N}$ con estremo sinistro
negativo (circa 15%), dove i negativi non entrano. Vincolo: la stessa condizione in $\mathbb{N}$ e
in $\mathbb{Z}$ dà insiemi diversi.

Esempi: $\{x \in \mathbb{Z} \mid -5 < x < 4\} = \{-4, -3, -2, -1, 0, 1, 2, 3\}$;
$\{x \in \mathbb{N} \mid x^2 = 36\} = \{6\}$.

## Livello 4: condizioni con un calcolo

In $\mathbb{N}$, circa 65% disuguaglianze $ax + b < c$ o $ax + b \le c$ con $a$ da 1 a 4, $b$ da −4
a 9, $c \ge 1$, da 1 a 6 elementi; circa 35% equazioni $x + a = b$ oppure $ax = c$, di cui circa 45
su 100 senza soluzioni naturali (risposta $\emptyset$): $a > b$, oppure $c$ non multiplo di $a$.

Esempi: $\{x \in \mathbb{N} \mid 2x - 3 < 9\} = \{0, 1, 2, 3, 4, 5\}$ (per $x = 6$ il valore è 9,
che non è minore di 9); $\{x \in \mathbb{N} \mid x + 8 = 5\} = \emptyset$, perché $x = -3$ non è
naturale.

## Livello 5: dall'elenco alla proprietà

"Quale proprietà caratteristica descrive $E$?" con $E$ elencato (da 2 a 10 elementi). La proprietà
giusta è di uno di cinque tipi, come negli esempi della lezione: multipli di $k$ con
$1 \le x \le n$ (circa 30%), pari o dispari tra due estremi (circa 20%), un intervallo di
$\mathbb{Z}$ con estremo negativo (circa 20%), $x^2 = k^2$ in $\mathbb{Z}$ (circa 15%), divisori di
$n$ (circa 15%). Le tre sbagliate danno ognuna un insieme diverso da $E$ e diverso dalle altre.

Esempi: $E = \{3, 6, 9, 12, 15, 18\}$ è
$\{x \in \mathbb{N} \mid x \text{ è multiplo di } 3 \text{ e } 1 \le x \le 18\}$, non la stessa
senza $1 \le x$ (entra lo 0). $E = \{-4, -3, -2, -1, 0, 1, 2\}$ è
$\{x \in \mathbb{Z} \mid -5 < x \le 2\}$, non la stessa in $\mathbb{N}$.

## Variante a scelta multipla

Livelli 1-4: quattro insiemi. Distrattori in ordine di preferenza: lo 0 tolto o aggiunto (0
dimenticato in $\mathbb{N}$, 0 contato tra i divisori), gli estremi scambiati (incluso invece di
escluso, da una parte o da entrambe), l'insieme in $\mathbb{N}$ invece che in $\mathbb{Z}$ o il
contrario, pari al posto di dispari, $\le$ al posto di $<$ nel calcolo; per le equazioni senza
soluzioni naturali, la soluzione negativa o frazionaria scritta come elemento ($\{-3\}$,
$\{\frac{7}{2}\}$) oppure $\{0\}$. Se non bastano, errori di uno agli estremi della progressione
(un termine in più o in meno, all'inizio o alla fine). Mai elementi tolti o aggiunti a caso nel
mezzo.

Livello 5: è già a scelta multipla; distrattori: la condizione $1 \le x$ dimenticata (entra lo 0),
un estremo incluso invece che escluso, $\mathbb{N}$ al posto di $\mathbb{Z}$, pari al posto di
dispari, un estremo spostato di un passo.

## Esercizi da evitare

- Proprietà che descrivono insiemi infiniti o con più di 10 elementi.
- Distrattori con elementi presi a caso ($\{0, 1, 3, 4\}$ per $x \le 4$).
- Al livello 3, condizioni che danno lo stesso insieme in $\mathbb{N}$ e in $\mathbb{Z}$.
- Al livello 5, due proprietà sbagliate con gli stessi elementi.

## Domande per la revisione

- Al livello 4 i passaggi seguono l'esempio 4 della lezione (si provano 0, 1, 2, ...): è la forma
  giusta anche quando gli elementi sono sei?
- Al livello 5 la proprietà con l'estremo negativo in ℕ (per esempio x in ℕ con −5 < x ≤ 2) è un
  distrattore utile o solo strano?
- Le equazioni senza soluzioni naturali (x + 8 = 5, 2x = 7) sono giuste qui, o appartengono alla
  lezione sulle equazioni?
