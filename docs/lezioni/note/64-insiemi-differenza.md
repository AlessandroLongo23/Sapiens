# Note: Differenza e complementare

Lezione nuova, scritta da zero (lotto 6). Tutti i conti di lezione, formulario e carte sono stati rifatti in Python con `set` (script `64-verifica.py` nello scratchpad): le differenze degli esempi 1-3 e del riquadro sulla differenza simmetrica, i complementari degli esempi 5-8, le due leggi di De Morgan dell'esempio 8, i conti dei problemi 4, 9, 10 e 11 (per l'11 ho costruito i tre insiemi zona per zona e ricontato tutti i dati). Le regole generali ($A \setminus \emptyset$, $A \setminus A$, $\emptyset \setminus A$, disgiunti, $A \setminus B = \emptyset \iff A \subseteq B$, $|A \setminus B| = |A| - |A \cap B|$, $A \setminus B = A \cap \overline{B}$, proprietà del complementare, De Morgan, commutatività della differenza simmetrica) le ho controllate su tutte le coppie di sottoinsiemi di $\{1, 2, 3, 4\}$.

## Scelte di convenzione

- Differenza $A \setminus B$, letta "$A$ meno $B$", con $A - B$ citato una volta; complementare $\overline{A}$ come nella 03, con $A^c$ e $\complement_U A$ citati. Non ho citato $A'$, che alcuni libri usano: da verificare con il libro in uso.
- Complementare rispetto a un insieme $\complement_A B$ definito solo per $B \subseteq A$, come nella 03. Alcuni libri lo definiscono per $B$ qualunque come $A \setminus B$: la lezione non lo dice, da verificare.
- Differenza simmetrica scritta $A \,\Delta\, B$, in un riquadro `ad-note` che si può togliere; non è nel formulario, e nessuna carta la chiede.
- Il titolo "Leggi di De Morgan" fa scattare l'avviso sulle maiuscole di `check.mts`: è un nome proprio, l'ho lasciato (la 03 lo scrive uguale nella tabella).
- "Doppio complementare" è nominato in una frase, perché il brief lo chiede; non ho usato "involuzione".
- La lezione è lunga (circa 21.500 caratteri, di cui otto figure): tratta due operazioni, De Morgan e i problemi. Se si vuole accorciarla, i candidati sono l'esempio 10 (problema inverso) e il riquadro sulla differenza simmetrica.

## Lasciato ad altre lezioni

- Unione e sua formula di cardinalità (05): l'esempio 10 la usa con il link in apertura, senza rispiegarla.
- Intersezione (63): usata in $|A \cap B|$, $A \cap \overline{B}$ e nei problemi, con il link in apertura.
- Leggi di De Morgan logiche (65): una frase sul linguaggio comune e il link. La 65 rimanda per le leggi insiemistiche alla 03; potrebbe rimandare alla 64, che ora le spiega (la 65 non è mia, lo segnalo soltanto).
- Distributiva e associativa della differenza: restano nella 03 (esempio 6 della 03).
- Inclusione: link a 04.

## Da cambiare nella lezione 03 (Proprietà delle operazioni tra insiemi)

Le sezioni "## Differenza" e "## Complementare" della 03 oggi hanno definizioni, esempi 3 e 4, due avvisi, due figure, i casi particolari, la dipendenza dall'universo, le proprietà e il riquadro sul complementare rispetto a un insieme. Propongo di ridurle a due riepiloghi e di tenere i riquadri degli esempi 3 e 4 così come sono: in questo modo la numerazione degli esempi della 03 non cambia, come nella proposta della nota 63 per l'intersezione, e restano validi i rimandi "nell'Esempio 3 hai visto che $A \setminus B \neq B \setminus A$" e "nell'Esempio 6 qui sotto" della sezione Proprietà.

> ## Differenza
>
> La **differenza** tra $A$ e $B$ è l'insieme degli elementi che appartengono ad $A$ e non appartengono a $B$:
>
> $$A \setminus B = \{x \mid x \in A \text{ e } x \notin B\}$$
>
> Si legge "$A$ meno $B$" e si scrive anche $A - B$.
>
> (qui resta il riquadro "Esempio 3: le due differenze" così com'è)
>
> Casi particolari, diagramma e numero di elementi della differenza sono nella lezione [Differenza e complementare](/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare).
>
> ## Complementare
>
> Il **complementare** di $A$ rispetto all'universo $U$ è l'insieme degli elementi di $U$ che non appartengono ad $A$:
>
> $$\overline{A} = \{x \in U \mid x \notin A\} = U \setminus A$$
>
> (qui resta il riquadro "Esempio 4: complementari" così com'è)
>
> Il complementare dipende dall'universo: il complementare di $\{2, 4\}$ è $\{1, 3\}$ rispetto a $U = \{1, 2, 3, 4\}$ e $\{1, 3, 5, 6\}$ rispetto a $U = \{1, 2, 3, 4, 5, 6\}$. Per ogni $A$ valgono $A \cup \overline{A} = U$ e $A \cap \overline{A} = \emptyset$. Le altre proprietà, il complementare rispetto a un insieme e le leggi di De Morgan spiegate con il diagramma sono nella lezione [Differenza e complementare](/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare).

Si tolgono: l'avviso "Pensare che $A \setminus B$ e $B \setminus A$ siano uguali" (l'esempio 3 lo dice già e la 64 ha l'avviso), l'avviso sul complementare senza universo, le figure `differenza-insiemi-diagramma-venn` e `complementare-insieme-diagramma-venn` (ci sono nella 64; quella della differenza nella 03 usa `\clip`, che lo stile vieta), la frase sui pari in $\mathbb{Q}$, il blocco con $\overline{\overline{A}}$, $\overline{U}$, $\overline{\emptyset}$ e il riquadro `ad-note` su $\complement_A B$. Il formulario della 03 non ha figure della differenza o del complementare, e la tabella "Le operazioni" resta giusta.

Le flashcard della 03 restano coperte se il riepilogo tiene queste frasi:
- `differenza-definizione`: "gli elementi che appartengono ad $A$ e non appartengono a $B$";
- `differenza-ordine` e `differenza-commutativa`: il riquadro dell'esempio 3 con $A \setminus B = \{1, 2\}$ e $B \setminus A = \{5, 6\}$ e la frase della sezione Proprietà "la differenza invece non è né commutativa né associativa";
- `complementare-definizione`: la formula con $U \setminus A$;
- `complementare-universo`: la frase sul complementare di $\{2, 4\}$ in $U = \{1, 2, 3, 4, 5, 6\}$;
- `complementare-intersezione`: la frase con $A \cap \overline{A} = \emptyset$.

Le carte `inclusione-differenza` e `de-morgan-unione` dipendono dalla sezione "Operazioni e inclusione" e dalla tabella delle proprietà, che non cambiano. Gli esempi 5 e 8 della 03 usano differenza e complementare senza rimandare alle sezioni ridotte: restano validi.

## Figure

Otto, tutte compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro e con l'inversione del tema scuro (anteprima PNG). Misure della 03 (rettangolo 6×4, cerchi di raggio 1,4, `blue!20`), 231×155, tranne dove detto:
- `differenza-a-meno-b-venn`: la parte di $A$ fuori da $B$, con lo stesso percorso ad archi della 03 ma senza `\clip`. Copiata nel formulario.
- `complementare-rispetto-universo-venn`: rettangolo colorato tranne il cerchio di $A$ (`even odd rule`), con l'etichetta $\overline{A}$.
- `complementare-rispetto-insieme-venn` (141×140): $B$ dentro $A$, colorata la corona. L'etichetta è $A \setminus B$ e non $\complement_A B$: il simbolo `\complement` non compila in TikZJax (manca `amssymb`).
- `complementare-unione-de-morgan-venn` e `complementare-intersezione-de-morgan-venn`: zona fuori dai due cerchi e tutto tranne la lente, con `even odd rule` e il contorno dell'unione ad archi.
- `differenza-simmetrica-venn`, nel riquadro `ad-note`: i due cerchi con `even odd rule`, così la lente resta bianca.
- `problema-calcio-nuoto-venn` (esempio 9) e `problema-tre-sport-venn` (esempio 11, 231×170): numeri nelle zone. Nella seconda i cerchi hanno raggio 1,3 e il rettangolo è alto 4,4, perché tre cerchi di raggio 1,4 non stanno in 6×4.

Niente `\clip`, niente riempimenti bianchi. Non le ho viste sul sito.

## Formulario e flashcard

- Il formulario ha una figura (la differenza), una tabella dei casi particolari, il procedimento dei problemi in sei passi e tre avvisi.
- 20 carte, nell'ordine della lezione. Gli id `differenza-definizione` e `complementare-definizione` coincidono con carte della 03, come già succede tra la 03 e la 05: sono unici nel file.

## Prerequisiti

La riga `insiemi-differenza <- insiemi-intersezione` va cambiata in

`insiemi-differenza <- insiemi-intersezione, insiemi-unione`

perché la lezione usa l'unione in modo sostanziale, non solo come citazione: le leggi di De Morgan e $A \cup \overline{A} = U$ contengono l'unione, e i problemi (esempi 9-11) calcolano $|A \cup B|$ con la formula della 05 per trovare chi non fa nessuno sport. L'arco non è ridondante: 05 e 63 dipendono entrambe solo da `sottoinsiemi-ugualianza`. Di conseguenza, nella riga della 03 l'arco `insiemi-unione` diventa ridondante (ci si arriva da `insiemi-differenza`) e lo script lo segnalerebbe: la riga diventa `insiemi-operazioni <- insiemi-differenza, insiemi-prodotto-cartesiano`.

## Per il generatore

1. Differenza per elencazione: $A \setminus B$ e $B \setminus A$ con insiemi di 3-6 elementi, compresi i casi disgiunti e $A \subseteq B$ (risultato $\emptyset$).
2. Differenza di insiemi descritti da una proprietà in $\mathbb{N}$ (pari, multipli, divisori, $x < n$), da elencare prima, con $0 \in \mathbb{N}$.
3. Numero di elementi: $|A \setminus B|$ da $|A|$ e $|A \cap B|$, e il problema a parole del tipo "suonano ma non cantano"; $|\overline{A}|$ da $|U|$ e $|A|$.
4. Complementare in un universo finito dato per elencazione, anche lo stesso insieme in due universi diversi, e $A \setminus B$ calcolato come $A \cap \overline{B}$.
5. Leggi di De Morgan: calcolare $\overline{A \cup B}$ e $\overline{A} \cap \overline{B}$ (o $\overline{A \cap B}$ e $\overline{A} \cup \overline{B}$) in un universo di 8-12 elementi e riconoscere che coincidono; vero o falso sulle forme sbagliate.
6. Problemi con due insiemi: solo uno, un solo insieme, almeno uno, nessuno; anche il caso inverso (dato "nessuno", trovare l'intersezione).
7. Problemi con tre insiemi: riempire le otto zone dai dati di insiemi, intersezioni a due e a tre, e rispondere su "un solo", "esattamente due", "nessuno".
