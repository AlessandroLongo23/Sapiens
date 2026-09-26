# Note: Intersezione insiemistica

Lezione nuova, scritta da zero (lotto 6), con la 05 come modello di struttura. Tutti i conti di lezione, formulario e carte sono stati rifatti in Python con `set` (script `63-verifica.py` nello scratchpad del lotto): gli esempi da 1 a 10, le lettere di "scuola" e "classe", i multipli di $2$ e $3$, di $4$ e $6$ (fino a $200$), i divisori di $12$ e $18$ con il MCD, le condizioni $x \le 9$, $x \ge 6$, $x < 6$, l'inclusione dei multipli di $6$ nei pari, i tre insiemi a due a due non disgiunti con intersezione vuota, i numeri della gita ($8$; $10 + 8 + 8 + 4 = 30$; l'errore $18 + 16 - 30 = 4$) e il minimo $9$ e il massimo $17$ dell'esempio 10. Le proprietà della tabella, l'equivalenza $A \subseteq B \iff A \cap B = A$, $A \cap B \subseteq A$, la formula $|A \cap B| = |A| + |B| - |A \cup B|$ e $|A \cap B| \le \min(|A|, |B|)$ le ho controllate su tutte le terne di sottoinsiemi di $\{1, 2, 3, 4\}$.

## Scelte di convenzione

- Definizione con "sia ad $A$ sia a $B$" e, nella formula, "e", come nella 03; la "e" è collegata alla congiunzione $\wedge$ con il link alla 65, come la 05 fa con "oppure" e $\vee$. La 65 usa $\wedge$ per la congiunzione (convenzioni del lotto).
- Lettura "$A$ intersezione $B$", come "$A$ unione $B$" nella 05.
- Nomi delle proprietà: "Elemento neutro" per $A \cap U = A$ e "Intersezione con il vuoto" per $A \cap \emptyset = \emptyset$, in parallelo con la 05 ("Elemento neutro" $A \cup \emptyset = A$, "Unione con l'universo"). Alcuni libri chiamano $\emptyset$ "elemento assorbente" dell'intersezione: non l'ho usato, da verificare con il libro in uso.
- Il paragone con i numeri: $\emptyset$ come lo $0$ nella moltiplicazione, $U$ come l'$1$. La 05 paragona $\emptyset$ allo $0$ dell'addizione. Le due frasi sono coerenti tra loro, ma se si preferisce non insistere sull'analogia si possono togliere.
- MCD e MCM scritti così, con il link alla 07. La frase "i multipli comuni sono i multipli del MCM, i divisori comuni sono i divisori del MCD" è vera in $\mathbb{N}$ (anche con lo $0$ tra i multipli), ma la 07 non la dice in questa forma: definisce MCD e MCM come il più grande divisore comune e il più piccolo multiplo comune.
- Nella figura dei divisori il rettangolo porta la scritta "naturali" invece di $\mathbb{N}$: il motore TeX delle figure non compila `\mathbb{N}` (la compilazione si ferma). Se si trova il modo di caricare `amssymb`, conviene tornare a $\mathbb{N}$.

## Lasciato ad altre lezioni

- Distributiva e leggi di De Morgan: solo il link alla 03, come chiesto.
- Differenza e complementare: non nominati (sono la 64).
- Intervalli: un riquadro `ad-note` di due righe con il link a Sistemi di disequazioni (53), senza esempi con gli intervalli, perché nell'albero arrivano molto dopo. Si può togliere senza toccare il resto.
- Cardinalità: la notazione $|A|$ è richiamata in una riga (è definita nella 01, e la formula dell'unione è nella 05, con il link).
- Unione: la formula $|A \cup B| = |A| + |B| - |A \cap B|$ è ripresa dalla 05 e rigirata, non ridimostrata.

## Da cambiare nella lezione 03 (Proprietà delle operazioni tra insiemi)

La sezione "## Intersezione" della 03 oggi ha la definizione, l'esempio 2, l'avviso su $\cup$ e $\cap$, la figura, gli insiemi disgiunti, l'intersezione tra pari e multipli di $3$ in formula e la riga su $A \cap A$ e $A \cap \emptyset$. Propongo di ridurla a un riepilogo come quello già fatto per l'unione, tenendo il riquadro dell'esempio 2: così la numerazione degli esempi della 03 non cambia, e la proposta non si sovrappone a quella della 64 sulla differenza e sul complementare. Testo proposto:

> ## Intersezione
>
> L'**intersezione** di $A$ e $B$ è l'insieme degli elementi che appartengono sia ad $A$ sia a $B$:
>
> $$A \cap B = \{x \mid x \in A \text{ e } x \in B\}$$
>
> (qui resta il riquadro "Esempio 2: intersezione" così com'è, con $A \cap B = \{3, 4\}$, e poi la figura `intersezione-insiemi-diagramma-venn`)
>
> Due insiemi che non hanno elementi in comune, cioè tali che $A \cap B = \emptyset$, si dicono **disgiunti**. Con insiemi descritti da una proprietà, l'intersezione contiene gli elementi che le hanno tutte e due: i numeri naturali pari e multipli di $3$ sono i multipli di $6$, cioè $\{0, 6, 12, 18, \dots\}$. Qualunque sia $A$, valgono $A \cap A = A$ e $A \cap \emptyset = \emptyset$. Le altre proprietà, l'intersezione di tre insiemi e il numero di elementi di un'intersezione sono nella lezione [Intersezione insiemistica](/materiale/scuola-superiore/matematica/insiemi-e-logica/intersezione-insiemistica).

Si toglie l'avviso "Confondere $\cup$ e $\cap$", che è già nelle "Errori frequenti" della 05 e della 63, e la formula in evidenza con le due proprietà caratteristiche, che diventa una frase.

Le flashcard della 03 restano coperte se il riepilogo tiene queste frasi:
- `intersezione-definizione`: "l'insieme degli elementi che appartengono sia ad $A$ sia a $B$";
- `intersezione-calcolo`: il riquadro dell'esempio 2 con $\{1, 2, 3, 4\} \cap \{3, 4, 5, 6\} = \{3, 4\}$;
- `disgiunti-definizione`: la frase con $A \cap B = \emptyset$ e la parola "disgiunti";
- `intersezione-pari-multipli-tre`: la frase su pari e multipli di $3$ con $\{0, 6, 12, 18, \dots\}$.

Le carte `inclusione-unione` e `inclusione-differenza` dipendono dalla sezione "Operazioni e inclusione", che non cambia. Nessun altro riferimento incrociato della 03 punta alla sezione dell'intersezione: l'esempio 7 (distributiva) usa $A \cap B$ e $A \cap C$ senza rimandi.

## Figure

Sei, tutte compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro e con l'inversione del tema scuro (anteprima PNG). Tutte 231×155, con le misure della 03 e della 05 (rettangolo 6×4, cerchi di raggio 1,4, `blue!20`), tranne dove detto:
- `intersezione-insiemi-diagramma-venn`: la lente colorata, con lo stesso percorso ad archi della 03 ma le etichette come nella 05. Copiata anche nel formulario.
- `intersezione-insiemi-disgiunti`: due cerchi di raggio 1,1 separati, niente colore (come la figura dei disgiunti della 05, senza riempimento).
- `intersezione-divisori-12-18-diagramma-venn` (esempio 5): la lente con $1, 2, 3, 6$ in colonna, $4$ e $12$ a sinistra, $9$ e $18$ a destra. La lente è stretta ma i quattro numeri si leggono.
- `intersezione-insieme-incluso`: $B$ di raggio 1,7, $A$ di raggio 0,8 dentro, colorato.
- `intersezione-tre-insiemi-diagramma-venn`: tre cerchi di raggio 1,3 (con 1,4 non stavano nel rettangolo 6×4), zona centrale colorata con tre archi calcolati in Python (vertici $(0; -0{,}745)$, $(\pm 0{,}583; 0{,}562)$).
- `problema-gita-museo-castello-diagramma-venn` (esempio 9): numeri nelle zone, lente colorata, scritta "gita" come "classe" nella 05.

Niente `\clip`, niente riempimenti bianchi. Non le ho viste sul sito.

## Formulario e flashcard

- Il formulario segue la lezione; l'unica figura è la lente. Gli errori scelti sono il MCM, il totale al posto dell'unione e le coppie di tre insiemi.
- 20 carte. Alcuni id (`intersezione-definizione`, `intersezione-calcolo`, `disgiunti-definizione`, `idempotenza`, `elemento-neutro`, `formula-cardinalita`) coincidono con carte della 03 o della 05, come già succede tra la 03 e la 05: lo stile chiede id unici nel file, e lo sono.

## Prerequisiti

Oggi la riga è `insiemi-intersezione <- sottoinsiemi-ugualianza`. La cambierei in `insiemi-intersezione <- insiemi-unione`: la sezione sul numero di elementi parte dalla formula dell'unione della 05 e la rigira, e i due problemi (esempi 9 e 10) ragionano su $M \cup C$ e $B \cup M$. Senza la 05 metà della lezione non si segue. L'arco verso `sottoinsiemi-ugualianza` diventerebbe ridondante, perché la 05 lo ha già. MCD e MCM in ℕ è citata con un link ma non serve per seguire (bastano i multipli e i divisori delle medie): non la aggiungerei.

Resta un'asimmetria da sapere: la 05 usa $|A \cap B|$ nella formula dell'unione, rimandando all'intersezione con un link. Con l'arco 63 <- 05 lo studente arriva alla 05 prima di aver visto l'intersezione; la 05 la usa solo come "elementi comuni", che si capisce anche senza la lezione.

## Per il generatore

1. Intersezione di due insiemi dati per elencazione (numeri o lettere di parole), compreso il caso disgiunto con risultato $\emptyset$.
2. Insiemi descritti da una proprietà in $\mathbb{N}$: multipli comuni (con MCM, anche con numeri non primi tra loro come $4$ e $6$), divisori comuni, due condizioni su $x$ con gli estremi compresi o esclusi; da elencare o da descrivere.
3. Proprietà e inclusione: completare $A \cap \emptyset$, $A \cap U$, $A \cap A$; dato $A \subseteq B$ trovare $A \cap B$; vero o falso su $A \cap B \subseteq A$.
4. Intersezione di tre insiemi per elencazione, calcolata in due ordini, con qualche caso di coppie non disgiunte e intersezione vuota.
5. Numero di elementi: $|A \cap B|$ da $|A|$, $|B|$ e $|A \cup B|$; problemi con il totale e "nessuno dei due", con le quattro zone del diagramma.
6. Minimo e massimo di $|A \cap B|$ noti il totale, $|A|$ e $|B|$.
