# Intersezione insiemistica

Generatore: `insiemi-intersezione` (`src/lib/exercises/v2/generators/insiemi-intersezione.ts`).
Verifica indipendente: `scripts/exercises/checkers/insiemi_intersezione.py`. Lezione collegata:
"Intersezione insiemistica" (`docs/lezioni/riscritte/63-insiemi-intersezione.md`), livelli presi
dalla sezione "Per il generatore" di `docs/lezioni/note/63-insiemi-intersezione.md`.

Convenzioni della lezione: $A \cap B$ si legge "$A$ intersezione $B$"; ℕ contiene lo $0$; insiemi
elencati in ordine crescente, le lettere in ordine alfabetico; l'insieme vuoto si scrive $\emptyset$;
$|A|$ è la cardinalità e $|A \cap B| = |A| + |B| - |A \cup B|$. Le risposte sono `set` quando sono
insiemi finiti di numeri, `number` per i conteggi, `choice` per le lettere, per gli insiemi infiniti
scritti con i puntini e per le affermazioni. Tutti gli esercizi hanno la variante a scelta multipla
con quattro opzioni distinte.

## Rappresentazione

- `params.case` è il caso dell'esercizio (le quote sono controllate da `CASE_RANGES`).
- Insiemi elencati: `params.A`, `params.B`, `params.C`, `params.U` come stringhe.
- Livello 1, lettere: `params.words`, le due parole; il controllo ne ricava le lettere da solo.
- Livello 2: multipli con `a`, `b`; divisori con `m`, `n`; condizioni con `A` e `B` come proprietà
  `{dom, conds}` (le stesse di `insiemi.ts`, rilette dal controllo con `prop_tex` e `prop_elements`).
- Livello 3, affermazioni: ogni opzione ha come valore l'affermazione in un piccolo linguaggio
  (`A`, `B`, `C`, `E` per $\emptyset$, `U`, `&` per $\cap$, `|` per $\cup$, `=` e `<=` per
  $\subseteq$): per esempio `A&B<=A` è $A \cap B \subseteq A$.
- Livello 2, multipli: ogni opzione ha un'etichetta, `mult:12` (i multipli di $12$) oppure
  `union:4,6` (i multipli di $4$ o di $6$); il LaTeX sono i primi elementi e $\dots$.
- Livelli 5 e 6: `context` (indice del contesto), `total`, `a`, `b`, e al livello 5 `both` e `none`.
- `params.wrong` (insiemi) e `params.mistakes` (numeri) sono i distrattori. Il valore `{vuoto}` è
  l'opzione $\{\emptyset\}$.

## Livello 1: intersezione di due insiemi elencati

Tre casi: numeri da 1 a 15 con da 1 a 3 elementi in comune (circa 55%), numeri disgiunti con
risultato $\emptyset$ (circa 15%), le lettere di due parole come nell'esempio 2 della lezione (circa
30%, a scelta multipla perché il tipo `set` non ha lettere). Le parole sono 36 nomi della scuola e
della vita quotidiana, senza accenti; le due parole hanno da 2 a 5 lettere in comune e nessuna ha
tutte le lettere dell'altra.

Esempi: $A = \{3, 8, 11, 14\}$, $B = \{9, 11\}$: $A \cap B = \{11\}$. Le lettere di “righello” e
“gelato”: $A \cap B = \{e, g, l, o\}$.

## Livello 2: insiemi descritti da una proprietà in ℕ

Quattro casi, come la sezione "Insiemi descritti da una proprietà":

- Multipli comuni (circa 30%): "Siano $A$ l'insieme dei multipli di $8$ e $B$ l'insieme dei multipli
  di $14$ in $\mathbb{N}$". Risposta $\{0, 56, 112, 168, \dots\}$, a scelta multipla. Circa il 75%
  delle coppie ha un divisore comune (4 e 6, 6 e 9, 8 e 14, …), così il prodotto non è il MCM.
- Divisori comuni (circa 35%): due numeri tra 12 e 60 con almeno 3 divisori comuni, nessuno dei due
  divisore dell'altro. Esempio: divisori di $12$ e di $16$, $\{1, 2, 4\}$.
- Due estremi (circa 20%): $\{x \in \mathbb{N} \mid x \le h\}$ e $\{x \in \mathbb{N} \mid x \ge l\}$,
  con $<$ o $\le$, $>$ o $\ge$ a caso, come l'esempio 6; circa un caso su cinque è disgiunto. Al
  massimo 8 elementi.
- Una proprietà e un estremo (circa 15%): pari, dispari, multipli di 3, 4 o 5, insieme a $x < h$ o
  $x \le h$; da 3 a 8 elementi. Esempio: dispari e $x \le 10$, $\{1, 3, 5, 7, 9\}$.

## Livello 3: proprietà e inclusione

- Un insieme incluso nell'altro (circa 30%): $A \cap B$ è il più piccolo dei due, che a caso si
  chiama $A$ o $B$.
- $A \cap U$ con $U = \{1, \dots, n\}$, $n$ da 7 a 10 (circa 20%): è $A$.
- $A \cap \emptyset$ (circa 15%): è $\emptyset$.
- Quale affermazione è sempre vera (circa 35%): una tra sette proprietà della lezione
  ($A \cap B \subseteq A$, $A \cap B \subseteq B$, commutativa, idempotenza, $A \cap \emptyset =
  \emptyset$, $A \cap U = A$, associativa) e tre tra dieci affermazioni che non valgono sempre
  ($A \subseteq A \cap B$, $A \cap B = A$, $A \cap \emptyset = A$, $A \cap U = U$, $A \cap A =
  \emptyset$, $A \cap B = A \cup B$, $A \cup B \subseteq A \cap B$, $A \cap B = \emptyset$,
  $B \subseteq A \cap B$, $A \cap B = B$). I passaggi danno il motivo della vera e, per ogni falsa,
  un controesempio con insiemi dentro $\{1, 2\}$.

## Livello 4: intersezione di tre insiemi

Tre insiemi di 3-5 numeri da 1 a 12. Circa il 70% ha risultato non vuoto, e $C$ toglie almeno un
elemento ad $A \cap B$ (altrimenti $C$ non servirebbe). Circa il 30% è il caso dell'avviso della
lezione: le tre coppie hanno elementi in comune, ma il risultato è $\emptyset$. I passaggi calcolano
l'intersezione nei due ordini, $(A \cap B) \cap C$ e $A \cap (B \cap C)$, come l'esempio 8.

Esempi: $\{2, 4, 8, 10, 12\} \cap \{4, 6, 8, 9, 11\} \cap \{2, 6, 8, 11, 12\} = \{8\}$;
$\{3, 9, 10, 11\} \cap \{5, 8, 10\} \cap \{3, 8, 9, 11\} = \emptyset$.

## Livello 5: quanti elementi ha l'intersezione

- Con la formula (circa 30%): $|A|$ e $|B|$ da 6 a 30, $1 \le |A \cap B| < \min(|A|, |B|)$, dati
  $|A|$, $|B|$, $|A \cup B|$.
- Problemi in cinque contesti (gita con museo e castello come l'esempio 9, calcio e pallavolo,
  bicicletta e monopattino, sufficienza in matematica e in fisica, libro e film), al massimo 60
  persone: quanti in tutti e due sapendo quanti in nessuno (circa 35%), quanti in tutti e due quando
  ognuno sta in almeno un gruppo (circa 15%), quanti solo nel primo gruppo sapendo quanti in nessuno
  (circa 20%). Nei casi con "nessuno" vale $1 \le$ nessuno $<$ tutti e due, così l'errore dell'avviso
  (usare il totale al posto di $|A \cup B|$) dà un numero positivo e plausibile. La risposta non è mai
  un numero del testo; l'ultimo passaggio è il controllo con le quattro zone.

Esempio: "In una gita di 36 studenti, 20 hanno visitato il museo, 20 hanno visitato il castello e 2
non hanno visitato nessuno dei due. Quanti studenti hanno visitato tutti e due?" 6.

## Livello 6: minimo e massimo

Come l'esempio 10: totale da 20 a 40, $|A| \ne |B|$, tutti e due almeno la metà del totale e minori
del totale, $|A| + |B| >$ totale. Si chiede il minimo ($|A| + |B| -$ totale) o il massimo
($\min(|A|, |B|)$), metà e metà. Il controllo ricava minimo e massimo anche contando tutte le
intersezioni possibili con le quattro zone.

Esempio: "In un gruppo di 26 amici, 15 hanno letto il libro e 14 hanno visto il film. Quanti amici,
come minimo, hanno sia letto il libro sia visto il film?" 3.

## Variante a scelta multipla

- Insiemi: l'unione al posto dell'intersezione, $A \setminus B$ o $B \setminus A$ (gli elementi di un
  solo insieme), per l'inclusione l'insieme più grande; per un risultato vuoto $\{0\}$ e
  $\{\emptyset\}$ (l'avviso della lezione); per tre insiemi $A \cap B$ (dimenticare $C$), gli elementi
  comuni ad almeno due insiemi, l'unione; per le condizioni gli estremi sbagliati (uno in più, uno in
  meno, lo $0$ dimenticato); per i divisori l'unione, il risultato senza $1$ o senza il MCD. Ultima
  risorsa: il risultato con un elemento in meno o in più.
- Multipli: i multipli del prodotto (l'avviso sul MCM), i multipli del MCD, i multipli dell'uno o
  dell'altro (l'unione), i multipli del numero più grande, i multipli del doppio del MCM.
- Affermazioni: le dieci che non valgono sempre, prese dagli errori della lezione ($\cup$ al posto di
  $\cap$, il vuoto confuso con l'elemento neutro, l'inclusione rovesciata).
- Numeri: il totale usato al posto di $|A \cup B|$, la somma senza togliere niente, la risposta a
  un'altra domanda dello stesso problema; al livello 6 il minimo al posto del massimo e viceversa,
  $|A| + |B|$, il più grande dei due; poi ±1, ±2.

## Righe sul telefono

Misura di `width.mts` (26 settembre 2026): problemi al massimo 270 px su 350 (livello 2, le due
proprietà sulla stessa riga), opzioni al massimo 247 px su 252 (livello 2, le unioni dei divisori;
`fitSetChoice` le manda su due righe quando servono). Nessuna formula oltre il limite.

## Figure

Nessuna figura: il sito oggi non ne genera per gli esercizi. Le vorrebbero il livello 1 (la lente
colorata), il livello 4 (i tre cerchi, soprattutto nel caso con coppie non disgiunte e intersezione
vuota) e i problemi dei livelli 5 e 6 (le quattro zone del diagramma con i numeri).

## Esercizi da evitare

- Elementi ripetuti negli elenchi del problema.
- Un terzo insieme che non toglie niente ad $A \cap B$.
- Problemi in cui la risposta è un numero del testo (tranne il massimo del livello 6, che è per
  costruzione $|A|$ o $|B|$, come nell'esempio 10).
- Divisori di due numeri di cui uno divide l'altro (l'intersezione sarebbe uno dei due insiemi).

## Verifica

- `sample.mts insiemi-intersezione 1000 all 1 | verify.py`: PASS (6.000 esercizi). Con seed di
  partenza 7001: PASS.
- Esercizi diversi su 1.000 (problema più opzioni, per le domande a scelta multipla), seed 1 e 7001:
  livello 1 968 e 975, livello 2 475 e 478, livello 3 909 e 920, livello 4 1.000 e 1.000, livello 5
  983 e 989, livello 6 993 e 988. Il caso dei multipli ne ha circa 50 (25 coppie in due ordini):
  sono le coppie con numeri da medie, e il livello nel complesso supera 400.
- Errori piantati, tutti bocciati (18): risposta senza un elemento; opzione giusta spostata;
  $\{\emptyset\}$ con i valori di $\emptyset$ (due opzioni uguali); parola cambiata nei params;
  prodotto al posto del MCM nell'etichetta dell'opzione giusta; numero dei divisori cambiato;
  estremo stretto invertito nei params; due affermazioni sempre vere tra le opzioni; LaTeX di
  un'affermazione diverso dal suo valore; insiemi dell'inclusione scambiati; caso "vuota" dato a
  un'intersezione piena; passaggi con un solo ordine; zone che non danno il totale; conteggio
  cambiato; totale cambiato nel testo; massimo al posto del minimo; domanda cambiata nei params;
  inclusione rovesciata nel passaggio del massimo.
- `review.mts` esce con 0; `width.mts` esce con 0; `steps-scan.mts` non trova errori; `tsc` ed
  `eslint` puliti sul generatore.

## Domande per la revisione

- Livello 2, multipli: la risposta è un insieme infinito scritto con i primi quattro elementi e i
  puntini. Va bene, o si preferisce chiedere i multipli comuni fino a un numero (per esempio fino a
  100), con risposta aperta?
- Livello 6: il minimo è sempre positivo ($|A| + |B| >$ totale). Serve anche il caso con minimo $0$,
  che la lezione non mostra?
- Livello 3: l'affermazione "sempre vera" con insiemi qualunque è astratta per il primo anno. Meglio
  tenerla, o sostituirla con un vero o falso su insiemi elencati?
