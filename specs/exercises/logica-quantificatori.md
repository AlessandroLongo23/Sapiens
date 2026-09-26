# Quantificatori

Generatore: `logica-quantificatori` (`src/lib/exercises/v2/generators/logica-quantificatori.ts`).
Verifica indipendente: `scripts/exercises/checkers/logica_quantificatori.py`. Lezione collegata:
"Quantificatori" (`docs/lezioni/riscritte/67-logica-quantificatori.md`), con i livelli proposti
nella sezione "Per il generatore" di `docs/lezioni/note/67-logica-quantificatori.md`.

Convenzioni della lezione: $\forall x \in U,\ p(x)$ con la virgola, $\exists x \in U : p(x)$ con i
due punti; $\mathbb{N}$ contiene lo $0$; l'insieme di verità è $V_p$; la negazione non si scrive con
$\neg$ ma negando la proprietà ($x > 3$ diventa $x \le 3$, "è pari" diventa "è dispari", "è multiplo
di 3" diventa "non è multiplo di 3"). Insiemi in ordine crescente.

## Rappresentazione

Una proprietà di $x$ sta in `params` e nei `values` delle opzioni come chiave: `pari`, `dispari`,
`mult|k`, `nmult|k`, `div|n`, oppure `cmp|c0,c1,c2|rel|d0,d1,d2` per
$c_0 + c_1 x + c_2 x^2 \mathrel{rel} d_0 + d_1 x + d_2 x^2$, con `rel` tra `<`, `<=`, `=`, `>`,
`>=`, `!=`. Le frasi in italiano sono chiavi di pezzi: l'attacco (`tutti`, `ogni`, `qualche`,
`almeno`, `esiste`, `nessuno`, `nonesiste`, `nontutti`, `almenonon`, `qualchenon`), l'universo (`N`
o `Z`) e la proprietà a parole (`pari`, `dispari`, `mult|k`, `gt|k`, `lt|k`, `neg`).

- Livello 1: `variant` (`valore` o `enunciato`), `ask`, e `dom`, `pred` oppure `value`. Opzioni
  `values = [a]` (per $p(a)$) o `[tipo, proprietà, valore]` con tipo `aperto`, `valore`, `esiste`,
  `perogni`.
- Livello 2: `U`, `ushape` (`1-n`, `0-n` o `elenco`), `pred`, `case` (`normale`, `vuoto`, `tutto`),
  `wrong` (i distrattori). Risposta `set`.
- Livello 3: `variant` `quale` (`ask`, `U`; opzioni `[quantificatore, proprietà]`) o
  `controesempio` (`dom`, `pred`; opzioni `[numero]`).
- Livello 4: `q` (`A` o `E`), `pred`, `family`, `pattern`. Opzioni `[NZQ]`, `[ZQ]`, `[Q]`, `[NZ]`,
  `[N]`, `[none]`.
- Livello 5 e 6: `variant` (`simboli` o `parole`), `form` (`Ap`, `Ep`, `An`, `En`: $\forall$ o
  $\exists$, proprietà o sua negazione), `dom`, `words`, `phr`, `truth`; al 6 in simboli `q` e
  `pred`.
- Livello 7: `ask`, `dom`, `trap`. Opzioni `[AE o EA, relazione]`.

Il verificatore riscrive ogni proprietà, ogni proposizione e ogni frase dai pezzi e le confronta con
il testo; valuta le proposizioni sugli universi finiti elemento per elemento, su $\mathbb{N}$ e
$\mathbb{Z}$ da $-1000$ a $1000$ (le proprietà hanno coefficienti piccoli, e i punti in cui cambiano
valore stanno dentro), e al livello 4 in $\mathbb{N}$, $\mathbb{Z}$ e $\mathbb{Q}$ in modo esatto con
`solveset` di SymPy. Il valore di verità di una frase lo ricava dall'attacco e dalla proprietà, non
dal testo. Le opzioni su due righe (`gathered`) vengono ricomposte prima del confronto.

## Livello 1: enunciati aperti e proposizioni

Due varianti. "Quale di queste proposizioni è vera?" (o "falsa", metà e metà; circa 70%): $U$ è
$\mathbb{N}$ (60%) o $\mathbb{Z}$, $p(x)$ una proprietà (pari o dispari, multiplo di $k$, divisore di
$n$ solo in $\mathbb{N}$, $ax + b = c$, $ax + b$ con $<$, $\le$, $>$, $\ge$, $x^2$ confrontato con un
quadrato in $\mathbb{Z}$) e le opzioni sono $p(a)$ per quattro valori (da 0 a 12 in $\mathbb{N}$, da
$-6$ a $6$ in $\mathbb{Z}$), uno solo vero (o falso). "Quale di queste è un enunciato aperto?" o
"Quale di queste è una proposizione?" (circa 30%): con una disuguaglianza o un'equazione di primo
grado, l'enunciato aperto $2x + 1 > 7$ sta accanto a $2 \cdot 3 + 1 > 7$, a
$\exists x \in \mathbb{N} : 2x + 1 > 7$ e a $\forall x \in \mathbb{N},\ 2x + 1 > 7$; per la domanda
opposta, una sola proposizione tra tre enunciati aperti. È l'errore del primo riquadro della lezione:
scambiare un enunciato aperto per una proposizione.

Esempi: $U = \mathbb{N}$, $p(x): 3x - 2 = 25$, vera tra $p(3)$, $p(6)$, $p(9)$, $p(8)$: $p(9)$,
perché $3 \cdot 9 - 2 = 25$. Quale è una proposizione tra $x + 3 \ge 9$, $3x > 15$, $2x + 5 < 13$ e
$\exists x \in \mathbb{N} : x + 3 \ge 9$: l'ultima.

## Livello 2: insieme di verità

"Trova l'insieme di verità di $p(x)$ in $U$": $U$ è $\{1, 2, \dots, n\}$ con $n$ da 8 a 12 (35%),
$\{0, 1, \dots, n\}$ con $n$ da 7 a 10 (20%) o un elenco di 6-8 numeri da 0 a 20 (45%). Le proprietà
sono quelle del livello 1. $V_p$ vuoto circa 10% ($x + 7 = 3$, $x > $ un numero oltre $U$,
$4x = 10$), $V_p = U$ circa 10% ($x + 1 > x$, $2x \ge x$, $x^2 \ge 0$, $x > $ un numero sotto $U$), il
resto con $V_p$ né vuoto né uguale a $U$. Risposta `set`.

Esempi: $U = \{1, 2, \dots, 8\}$, $p(x): 2x - 1 < 7$, $V_p = \{1, 2, 3\}$.
$U = \{0, 7, 8, 9, 14, 15\}$, $p(x): x > 18$, $V_p = \emptyset$.

## Livello 3: vero o falso con $\forall$ ed $\exists$, e il controesempio

Due varianti, metà e metà. "Quale di queste proposizioni è vera?" (o "falsa"): $U$ è un elenco di 5-7
numeri da 0 a 12 e le opzioni sono quattro proposizioni $\forall x \in U,\ p(x)$ o
$\exists x \in U : p(x)$, una sola vera (o falsa). "La proposizione è falsa. Quale di questi numeri è
un controesempio?": un $\forall$ falso in $\mathbb{N}$ (70%) o $\mathbb{Z}$, un solo controesempio
tra le opzioni e tre valori per cui la proprietà vale. Le proprietà sono quelle dell'esempio 2 e del
riquadro "provare qualche valore": $kx > x$ (lo $0$), $x^2 > x$, $x^2 + k^2 > 2kx$ (falsa solo per
$x = k$, un controesempio che si vede poco), $x + b > c$, pari, dispari, multiplo di 2 o 3; in
$\mathbb{Z}$ $x^2 > 0$, $x^2 \ge c$. Quando lo $0$ è un controesempio, è la risposta sei volte su
dieci.

Esempi: $\forall x \in \mathbb{N},\ x^2 + 9 > 6x$, controesempio $3$ tra $9$, $5$, $11$, $3$
($3^2 + 9 = 18$ e $18 > 18$ è falsa). $U = \{0, 2, 6, 7, 10\}$, falsa tra
$\exists x \in U : x + 4 < 6$, $\exists x \in U : x \text{ è un divisore di } 12$,
$\exists x \in U : x \text{ è un divisore di } 20$ e $\forall x \in U,\ x \text{ è pari}$: l'ultima,
con il controesempio $7$.

## Livello 4: lo stesso enunciato in $\mathbb{N}$, $\mathbb{Z}$ e $\mathbb{Q}$

"Per quali universi $U$, tra ℕ, ℤ e ℚ, la proposizione è vera?", come la tabella della lezione. Metà
con $\exists$ e metà con $\forall$. Poiché $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q}$, un
$\exists$ vero in un universo è vero in quelli più grandi e un $\forall$ vero in un universo è vero
in quelli più piccoli: le risposte possibili sono quattro, e sono le quattro opzioni, sempre nello
stesso ordine. Per $\exists$: in tutti e tre, solo in $\mathbb{Z}$ e $\mathbb{Q}$, solo in
$\mathbb{Q}$, in nessuno. Per $\forall$: in tutti e tre, solo in $\mathbb{N}$ e $\mathbb{Z}$, solo in
$\mathbb{N}$, in nessuno. Ognuna delle otto risposte circa un ottavo delle volte.

Famiglie: $\exists x \in U : ax + b = c$ con la soluzione naturale, intera negativa o frazionaria
($a$ da 1 a 5); $\forall x \in U,\ ax + b \ne c$ (la stessa, negata); $x^2 = k^2$ e $x^2 \ne k^2$;
$x + b < c$ e $x + b \ge c$ con la soglia minore o uguale a 0; $x^2 = -k$, $x^2 + a < c$ con
$c \le a$ e le loro negazioni (un quadrato non è mai negativo); $\forall x,\ x^2 \ge x$ e
$\forall x,\ x^2 + x \ge 0$ (vere in $\mathbb{N}$ e $\mathbb{Z}$, false in $\mathbb{Q}$ con
$\frac{1}{2}$ e $-\frac{1}{2}$, come l'esempio 6); $\forall x,\ x^2 > 0$ e $\forall x,\ 2x > x$
(false ovunque per lo $0$). Niente $x^2 = 2$ in $\mathbb{Q}$: l'irrazionalità di $\sqrt{2}$ non è
nella lezione.

Esempi: $\exists x \in U : 3x + 2 = -22$: solo in $\mathbb{Z}$ e $\mathbb{Q}$ ($x = -8$).
$\forall x \in U,\ x^2 + 7 \ge 4$: in tutti e tre.

## Livello 5: dalle parole ai simboli

Nei due versi. "Quale scrittura in simboli dice la stessa cosa della frase?" (60%): una frase come
"Nessun numero naturale è negativo" e quattro scritture, le quattro forme con quella proprietà:
$\forall x,\ p(x)$, $\exists x : p(x)$, $\forall x$ con la proprietà negata, $\exists x$ con la
proprietà negata. "Quale frase dice la stessa cosa della proposizione?" (40%): la proposizione in
simboli e quattro frasi, una per forma. Attacchi: "Tutti i", "Ogni" ($\forall$); "Qualche", "Almeno
un", "Esiste un ... che" ($\exists$); "Nessun", "Non esiste un ... che sia" ($\forall$ con la
negazione); "Non tutti i", "Almeno un ... non", "Qualche ... non" ($\exists$ con la negazione).
Proprietà: pari, dispari, multiplo di $k$ (da 3 a 9), maggiore di $k$, minore di $k$, negativo; in
$\mathbb{N}$ o $\mathbb{Z}$. I passaggi dicono anche se la proposizione è vera o falsa, con il
controesempio o l'esempio.

Esempi: "Esiste un numero naturale che è dispari" è $\exists x \in \mathbb{N} : x \text{ è dispari}$,
non $\forall x \in \mathbb{N},\ x \text{ è dispari}$. $\exists x \in \mathbb{Z} : x \text{ è dispari}$
è "Non tutti i numeri interi sono pari", non "Nessun numero intero è pari".

## Livello 6: negare un quantificatore

"Qual è la negazione della proposizione?" in simboli (60%) o "Qual è la negazione della frase?" a
parole (40%). In simboli la proprietà è una disuguaglianza ($x^2$ confrontato con un numero da 0 a 9,
$ax + b$ con un numero, $kx$ con $x$, $x^2$ con $x$) in $\mathbb{N}$ o $\mathbb{Z}$; la negazione
scambia il quantificatore e il segno ($>$ con $\le$, $\ge$ con $<$). Distrattori, tre tra quattro:
lo stesso quantificatore con la proprietà negata (è "tutti" negato con "nessuno"), il quantificatore
scambiato con il segno sbagliato ($>$ negato con $<$, il riquadro della lezione), il quantificatore
scambiato senza negare la proprietà, lo stesso quantificatore con il segno sbagliato. I due membri
devono essere uguali per qualche elemento dell'universo: altrimenti, per esempio con $x^2 > 5$ in
$\mathbb{N}$, $x^2 < 5$ e $x^2 \le 5$ dicono la stessa cosa e il "segno sbagliato" sarebbe giusto. A
parole: le frasi del livello 5; la frase stessa non è mai tra le opzioni, la sua forma sì, con un
altro attacco. I passaggi controllano che una delle due sia vera e l'altra falsa.

Esempi: la negazione di $\forall x \in \mathbb{Z},\ 3x < x$ è $\exists x \in \mathbb{Z} : 3x \ge x$,
non $\exists x \in \mathbb{Z} : 3x < x$, $\forall x \in \mathbb{Z},\ 3x \ge x$ o
$\forall x \in \mathbb{Z},\ 3x > x$. La negazione di "Non tutti i numeri interi sono maggiori di 12" è
"Ogni numero intero è maggiore di 12", non "Nessun numero intero è maggiore di 12".

## Livello 7: due quantificatori

"Quale di queste proposizioni è vera?" (o "falsa", metà e metà) con $x, y \in \mathbb{N}$ o
$\mathbb{Z}$ e quattro proposizioni $\forall x \in U,\ \exists y \in U : R$ o
$\exists y \in U : \forall x \in U,\ R$, con $R$ tra $y = x + 1$, $y = x - 1$, $y > x$, $y \ge x$,
$y < x$, $y \le x$, $x + y = 0$, $y = 2x$, $x = 2y$, $x + y = x$, $x \cdot y = 0$, $x \cdot y = x$.
Tra le opzioni c'è sempre una relazione che cambia valore scambiando i quantificatori, nell'ordine
sbagliato; circa metà delle volte la risposta è la stessa relazione nell'altro ordine.

Esempi: $x, y \in \mathbb{N}$, falsa: $\exists y \in \mathbb{N} : \forall x \in \mathbb{N},\ y > x$
($y$ dovrebbe essere maggiore anche di sé stesso), tra tre vere come
$\forall x \in \mathbb{N},\ \exists y \in \mathbb{N} : y \ge x$. $x, y \in \mathbb{Z}$, falsa:
$\exists y \in \mathbb{Z} : \forall x \in \mathbb{Z},\ y = 2x$, mentre
$\forall x \in \mathbb{Z},\ \exists y \in \mathbb{Z} : y = 2x$ è vera.

## Variante a scelta multipla

Tutti i livelli nascono a scelta multipla con quattro opzioni, tranne il 2. Al livello 2 i
distrattori sono il complementare di $V_p$ in $U$ (gli elementi che rendono falsa $p(x)$), lo stesso
insieme con il bordo sbagliato ($<$ letto come $\le$ e viceversa), i divisori senza 1 o senza $n$, i
multipli o i pari senza lo $0$; per $V_p$ vuoto la soluzione fuori da $U$ e $U$ stesso; per
$V_p = U$ l'insieme vuoto e $U$ senza il primo elemento; poi un elemento tolto o aggiunto.

## Esercizi da evitare

- Frasi del linguaggio comune senza un valore di verità certo ("tutti i treni sono partiti in
  orario"): le frasi parlano solo di numeri, e il loro valore di verità si ricava dai pezzi.
- "Tutti i numeri naturali non sono pari": in italiano è ambigua. Le negazioni usano "almeno un ...
  non", "qualche ... non", "non tutti".
- Una negazione in cui il segno sbagliato è equivalente a quello giusto nell'universo (vedi livello 6).
- Il livello 4 con risposte che dipendono da numeri irrazionali.

## Figure

Nessun livello usa figure. Il livello 2 e la variante "quale è vera" del livello 3 starebbero bene
con il diagramma di Eulero-Venn della lezione ($V_p$ colorato dentro $U$, il controesempio fuori),
quando il sito saprà disegnarlo.

## Verifica (26 settembre 2026)

- `sample.mts logica-quantificatori 1000 all 1 | verify.py`: PASS, 7.000 esercizi su 7.000. Con il
  seed di partenza 7001: PASS, 7.000 su 7.000. Le quote dei casi stanno negli intervalli di
  `CASE_RANGES`.
- Esercizi diversi su 1.000 (prompt, problema e opzioni): 971 al livello 1, 982 al 2, 961 al 3, 638
  al 4, 681 al 5, 732 al 6, 853 al 7. Il livello 7 ha solo quattro testi del problema ("$x, y \in$"
  e l'universo, per vera o falsa): gli esercizi cambiano nelle opzioni.
- `width.mts`: 0 formule oltre 350 px e 0 opzioni oltre 252 px; le più larghe sono 269 px (problema,
  livello 2) e 249 px (opzione, livello 6).
- `review.mts`: esce con 0. Controllo dei passaggi con `presentStep`: nessun errore KaTeX.
- Errori piantati, tutti bocciati: opzione giusta spostata (livelli 1, 2, 3, 4, 5, 7); problema che
  non mostra la proprietà; tipo di frase scambiato al livello 1 (un enunciato aperto etichettato come
  proposizione); insieme di verità senza un elemento; caso vuoto dichiarato normale; $U$ con 13
  elementi; controesempio chiesto per un $\forall$ vero; equazione del livello 4 cambiata in modo
  coerente con la risposta vecchia; frase di un'opzione cambiata; valore di verità sbagliato nei
  parametri; due negazioni giuste tra le opzioni; $x^2 > 5$ in $\mathbb{N}$ con opzioni coerenti
  (il segno sbagliato dice la stessa cosa della negazione); la frase stessa tra le opzioni al livello
  6; ordine dei quantificatori scambiato in un'opzione; domanda vera o falsa scambiata al livello 7.

## Domande per la revisione

- Livello 1, variante "quale è un enunciato aperto": il problema ricorda la definizione (un enunciato
  aperto non è né vero né falso finché non si sceglie il valore). Aiuta o toglie la domanda? Senza,
  il problema resterebbe vuoto.
- Livello 4: le opzioni sono sempre le quattro risposte possibili, nello stesso ordine, e l'ordine
  fa capire che per $\exists$ si guadagnano universi e per $\forall$ si perdono. È una cosa che si
  vuole insegnare o un aiuto di troppo? L'alternativa è mettere tra le opzioni anche combinazioni
  impossibili come "solo in $\mathbb{Z}$".
- Livello 5 e 6: "Esiste un numero naturale che è pari" usa l'indicativo, "Non esiste un numero
  naturale che sia pari" il congiuntivo. Va bene così o si preferisce il congiuntivo anche nella
  prima? E "Qualche numero intero non è dispari" come negazione di "Tutti i numeri interi sono
  dispari" suona naturale a uno studente?
- Livello 7: le relazioni $x + y = x$, $x \cdot y = 0$ e $x \cdot y = x$ sono vere in tutti e due gli
  ordini (lo stesso $y$ va bene per ogni $x$). La lezione parla solo di relazioni che cambiano con
  l'ordine: queste tre servono a mostrare che non sempre cambia, ma la lezione non le cita.
