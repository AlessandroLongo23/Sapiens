# Note: Operazioni e relazioni tra insiemi

## Errori nell'originale

- Il diagramma TikZ dell'intersezione è sbagliato. Il codice colora tutto $A$ di blu scuro e poi "buca" due cerchi bianchi in $(-1{,}7; 0)$ e $(1{,}7; 0)$ di raggio $0{,}9$: il risultato non è la zona comune, ma quasi tutto $A$ (tranne un buco a sinistra) più due lunette di $B$. L'ho rifatto con `\clip` sul cerchio di $A$ e riempimento del cerchio di $B$, che colora solo la zona comune. Gli altri tre diagrammi (unione, differenza, complementare) sono corretti e li ho tenuti come sono. Il codice corretto non l'ho potuto vedere renderizzato: va controllato sul sito.
- Mancava del tutto il prodotto cartesiano, che pure ha una lezione nell'albero del capitolo.
- "Unione ... $x \in A$ oppure $x \in B$" senza dire che l'"oppure" è inclusivo: è l'equivoco più comune.
- Complementare scritto solo come $A^c$: nei libri italiani la scrittura più diffusa è $\overline{A}$ (o $\complement_U A$).
- Il titolo interno era "Operazioni", e della parte "relazioni" del titolo non c'era niente.
- I conti degli esempi erano tutti giusti, leggi di De Morgan comprese.

## Scelte

- Le lezioni su intersezione, differenza, complementare e prodotto cartesiano esistono nell'albero ma sono vuote, quindi questa lezione tratta tutte le operazioni in modo autosufficiente e non le linka. Per l'unione rimanda alla lezione "Unione insiemistica" (tre insiemi, intervalli, formula $|A \cup B| = |A| + |B| - |A \cap B|$).
- Sovrapposizione da decidere: quando le quattro lezioni vuote verranno scritte, questa lezione ripeterà il loro contenuto. Due strade: tenerla come panoramica corta (una definizione, un esempio e un link per operazione, più proprietà ed esempi misti) oppure toglierla dall'albero. Anche "Unione insiemistica" ha una sezione "Unione e inclusione" che si sovrappone alla mia "Operazioni e inclusione".
- La parte "relazioni" del titolo l'ho interpretata come insiemi disgiunti e legame tra operazioni e inclusione ($A \subseteq B \iff A \cup B = B \iff A \cap B = A \iff A \setminus B = \emptyset$), con link a "Sottoinsiemi e uguaglianza" per l'inclusione.
- Un esempio continuo ($U = \{1, \dots, 8\}$, $A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5, 6\}$) per tutte le operazioni, poi quattro esempi svolti: tutte le operazioni su insiemi descritti a parole, differenza non associativa, verifica della distributiva, problema dei due sport con il diagramma.
- Il piano cartesiano è citato senza link perché la lezione "Il piano cartesiano" è ancora vuota.

## Dubbi da decidere

- Simbolo della differenza: ho usato $A \setminus B$ e citato $A - B$. Molti libri del biennio usano $A - B$ come scrittura principale.
- Complementare: $\overline{A}$ come scrittura principale, con $\complement_U A$ e $A^c$ citati. Il riquadro sul complementare rispetto a un insieme qualsiasi ($\complement_A B$ con $B \subseteq A$) si può saltare; se il sito non lo usa altrove, si può togliere.
- Precedenza tra le operazioni: ho scritto che non c'è un ordine condiviso da tutti i libri e che si usano le parentesi. Alcuni libri danno la precedenza all'intersezione sull'unione: se il sito vuole adottarla, va detto qui.
- Esempio del complementare dei pari in $\mathbb{Q}$: corretto, ma forse troppo per il primo anno; si può togliere lasciando solo gli esempi finiti.

## Figure

- Diagramma dell'esempio continuo con gli elementi: $1, 2$ solo in $A$; $3, 4$ nella zona comune; $5, 6$ solo in $B$; $7, 8$ fuori dai cerchi. Utile in apertura, prima dell'unione.
- Diagramma per l'esempio 9 (sport): due cerchi $C$ e $N$ con i numeri 10, 4, 5 nelle tre zone e 6 fuori dai cerchi, dentro il rettangolo "classe".
- Facoltativo: diagramma della differenza $B \setminus A$ accanto a quello di $A \setminus B$, per far vedere che sono zone diverse.

## Formulario e flashcard

- Il formulario non copia i diagrammi di Venn delle quattro operazioni: con quattro figure diventerebbe lungo il doppio, oltre le due schermate. Le operazioni stanno in una tabella con definizione ed esempio. Se Alessandro preferisce le figure, si possono aggiungere almeno unione e intersezione.
- Nessuna carta sul problema con il diagramma (Esempio 9): i conti sono pochi ma richiedono di tenere a mente quattro numeri, e un problema simile è già una carta nella lezione 05.
