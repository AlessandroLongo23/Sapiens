# Note: Prodotto cartesiano

Lezione nuova, scritta da zero (lotto 4). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy e con `itertools.product` in Python: l'uguaglianza di coppie dell'esempio 1, gli elenchi di $A \times B$, $B \times A$ e $A \times A$, le appartenenze dell'esempio 4, le coppie con somma 5 dell'esempio 5, l'intersezione $(A \times B) \cap (B \times A) = \{(2, 2)\}$ dell'esempio 7 (anche con `ProductSet`), i conteggi ($12$ menù, $24$ pasti, $100$ caselle, $|B| = 3$, $16$, $49 \to 7$) e il prodotto con il vuoto. L'affermazione "$A \times B = B \times A$ solo se $A = B$ o se uno dei due è vuoto" l'ho controllata su tutte le coppie di sottoinsiemi di $\{1, 2, 3\}$.

## Scelte di convenzione

- "Primo elemento" e "secondo elemento" della coppia come termini principali; "componenti" citato una volta. Molti libri dicono anche "prima coordinata" o "ascissa e ordinata": li ho lasciati al piano cartesiano del secondo anno.
- Lettura: "$A$ per $B$" oppure "$A$ cartesiano $B$"; $A^2$ letto "$A$ due" o "$A$ al quadrato". Da verificare con il libro in uso.
- Cardinalità con $|A|$, come nella lezione 01 e nella 05, con il link a Prime definizioni.
- Uguaglianza tra coppie scritta "se e solo se" in parole, non con $\iff$, perché l'implicazione logica ha la sua lezione più avanti nel capitolo.
- La quarta rappresentazione l'ho chiamata "reticolo di punti"; alcuni libri la chiamano "rappresentazione cartesiana" o "diagramma cartesiano". Il nome compare solo nel titolo della sezione e nel formulario, si cambia facilmente.
- La tabella a doppia entrata è una tabella Markdown, come nella lezione 03, e non una figura TikZ: resta testo, si legge a 390 px (tre colonne corte) e il motore di ricerca del sito la trova. Il brief parlava di "tabella o reticolo" in TikZ: il reticolo c'è.
- Il prodotto di tre insiemi (terne ordinate) è in un riquadro `ad-note`, che si può togliere senza toccare il resto. Non è nel formulario né nelle carte.
- L'apertura usa la battaglia navale (lettere da A a J, numeri da 1 a 10); la frase su Cartesio che dà il nome al prodotto e al piano è vera ma si può togliere.

## Lasciato ad altre lezioni

- Relazioni binarie (40): l'esempio 5 (coppie con somma 5) le anticipa senza nominarle se non con il link; il diagramma a frecce è presentato qui solo per il prodotto intero, e la sezione dice che serve soprattutto per le relazioni.
- Piano cartesiano: solo $\mathbb{R}^2$ come insieme di coppie e il link alla lezione del secondo anno. Nessun asse con i numeri negativi, niente coordinate.
- Cardinalità: link a Prime definizioni.
- Intersezione: l'esempio 7 usa $\cap$ tra due prodotti; l'avviso sul vuoto ricorda $A \cup \emptyset = A$. Non li rispiego.

## Da cambiare nella lezione 03 (Proprietà delle operazioni tra insiemi)

La sezione "## Prodotto cartesiano" della 03 oggi ha la definizione di coppia, la definizione del prodotto, l'esempio 5 con $P \times Q$ e $Q \times P$, l'avviso sulle graffe, il numero di elementi, $A \times \emptyset$, la tabella e $A^2$. Propongo di sostituirla con un riepilogo di questo tipo:

> ## Prodotto cartesiano
>
> Le operazioni viste finora producono insiemi fatti degli stessi elementi di partenza. Il prodotto cartesiano $A \times B$ invece è l'insieme delle coppie ordinate $(a, b)$ con $a \in A$ e $b \in B$: con $A = \{1, 2\}$ e $B = \{a\}$ si ha $A \times B = \{(1, a), (2, a)\}$. Ha $|A| \cdot |B|$ elementi e non è commutativo. Definizione, rappresentazioni e proprietà sono nella lezione [Prodotto cartesiano](/materiale/scuola-superiore/matematica/insiemi-e-logica/prodotto-cartesiano).

Con l'esempio 5 tolto vanno sistemati anche:
- nella sezione "Proprietà delle operazioni", la frase "Anche il prodotto cartesiano in generale non è commutativo, come nell'Esempio 5" diventa "Anche il prodotto cartesiano non è commutativo (lo trovi nella lezione [Prodotto cartesiano](...))";
- la numerazione degli esempi 6-9, che diventano 5-8, e il riferimento "nell'Esempio 7 qui sotto" nella stessa sezione, che diventa "nell'Esempio 6", insieme a "gli stessi $A$, $B$, $C$ dell'Esempio 7" nell'esempio 8 (che diventa 7).

La riga di `prerequisiti.md` della 03 (`insiemi-operazioni <- insiemi-unione, insiemi-differenza, insiemi-prodotto-cartesiano`) resta giusta anche con il riepilogo: la 03 cita il prodotto nella tabella delle proprietà.

## Figure

Tre, tutte compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro (anteprima PNG):
- `prodotto-cartesiano-diagramma-frecce` (178×169): $\{1, 2, 3\}$ e $\{a, b\}$ con le sei frecce. Le punte arrivano vicine su $a$ e su $b$ ma si distinguono.
- `prodotto-cartesiano-reticolo` (237×151): assi con $1, 2, 3$ e $a, b$, linee tratteggiate `gray!50`, sei punti con il nome della coppia.
- `quadrato-cartesiano-reticolo` (199×189): $\{1, 2, 3\}^2$, diagonale `blue!40`, etichette solo su $(1, 2)$, $(2, 1)$ e $(3, 3)$.

Niente `\clip`, niente riempimenti bianchi, i punti sono neri (nel tema scuro diventano bianchi). Non le ho viste sul sito in tema scuro. Nessuna figura nel formulario.

## Formulario e flashcard

- Il formulario non ha figure, né il riquadro sulle terne.
- 18 carte. Tutte le domande usano esempi o regole della lezione; la carta `prodotto-cartesiano-elenco` usa $\{1, 2\} \times \{a, b\}$, più corto dell'esempio 2 ma con la stessa regola.

## Prerequisiti

La riga `insiemi-prodotto-cartesiano <- insiemi-rappresentazione` va bene così. La lezione usa l'elencazione e la proprietà caratteristica (esempio 4) e la cardinalità, che arriva da prime-definizioni attraverso insiemi-rappresentazione. L'intersezione dell'esempio 7 e l'unione nell'avviso sul vuoto sono citate, non servono per seguire: non le aggiungerei. Anche l'esempio 1 chiede di risolvere $2x - 1 = 5$, che si fa a mente e non richiede la lezione sulle equazioni; se si vuole evitare anche questo, si sostituisce con $(x, 6) = (5, 3y)$ senza altre conseguenze.

## Per il generatore

1. Coppie ordinate: dire se due coppie sono uguali, trovare le incognite in un'uguaglianza semplice ($(x + 1, 6) = (5, 2y)$), dire se una coppia appartiene a $A \times B$ (anche con l'ordine scambiato).
2. Elencare $A \times B$ e $B \times A$ con insiemi di 2 o 3 elementi dati per elencazione.
3. Contare: $|A \times B|$ da $|A|$ e $|B|$, problemi del tipo menù o abbinamenti, il conto inverso ($|B|$ da $|A \times B|$ e $|A|$), $|A \times A|$ e $|A|$ da $|A \times A|$.
4. Cambiare rappresentazione: dalla tabella a doppia entrata o dal reticolo all'elenco, e dal prodotto ricavare $A$ e $B$ (esempio 6).
5. Insiemi descritti con una proprietà in $\mathbb{N}$ o $\mathbb{Z}$, da elencare prima di fare il prodotto, compreso il caso di un insieme vuoto.
6. Le coppie di $A \times B$ che rispettano una condizione (somma data, primo elemento minore del secondo) e le coppie comuni ad $A \times B$ e $B \times A$ (esempio 7).
