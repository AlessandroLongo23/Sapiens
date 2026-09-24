# Unione insiemistica

Se in una classe alcuni studenti giocano a calcio e altri a pallavolo, gli studenti che fanno almeno uno dei due sport formano un nuovo insieme: l'unione dei due gruppi. L'unione mette insieme gli elementi di due insiemi, e chi fa entrambi gli sport si conta una volta sola. Qui trovi la definizione, le proprietà e il modo di contare gli elementi di un'unione; per un quadro di tutte le operazioni tra insiemi c'è [Proprietà delle operazioni tra insiemi](/materiale/scuola-superiore/matematica/insiemi-e-logica/proprieta-delle-operazioni-tra-insiemi).

## Definizione

Dati due insiemi $A$ e $B$, la loro **unione** è l'insieme degli elementi che appartengono ad $A$ oppure a $B$, cioè ad almeno uno dei due. Si scrive $A \cup B$ e si legge "$A$ unione $B$":

$$A \cup B = \{x \mid x \in A \ \text{ oppure } \ x \in B\}$$

In questa definizione "oppure" ha il senso inclusivo: un elemento che appartiene sia ad $A$ sia a $B$ fa parte dell'unione. È il senso del latino vel, e in logica si indica con il simbolo $\vee$. Nel linguaggio di tutti i giorni "o" ha spesso il senso esclusivo ("o mangi la minestra o salti dalla finestra"), ma nell'unione non è così.

Per costruire l'unione di due insiemi scritti per elencazione, scrivi tutti gli elementi del primo e poi aggiungi quelli del secondo che non hai ancora scritto.

```ad-example
Esempio 1: insiemi con un elemento in comune
Siano $A = \{1, 2, 3\}$ e $B = \{3, 4, 5\}$.

Scriviamo gli elementi di $A$, cioè $1, 2, 3$, e aggiungiamo quelli di $B$ che mancano, cioè $4$ e $5$. Il $3$ c'è già e non si riscrive:
$$A \cup B = \{1, 2, 3, 4, 5\}$$
```

```ad-warning
Scrivere due volte gli elementi comuni
Scrivere $\{1, 2, 3\} \cup \{3, 4\} = \{1, 2, 3, 3, 4\}$ non è sbagliato come insieme, ma mostra che hai sommato le liste invece di unire gli insiemi: l'unione è $\{1, 2, 3, 4\}$. Lo sbaglio pesa quando devi contare gli elementi, perché con il $3$ scritto due volte ne conteresti $5$ invece di $4$.
```

```ad-example
Esempio 2: insiemi descritti da una proprietà
Siano $A$ l'insieme dei numeri pari da $1$ a $10$ e $B$ l'insieme dei multipli di $3$ da $1$ a $10$.

Per elencazione $A = \{2, 4, 6, 8, 10\}$ e $B = \{3, 6, 9\}$. L'unione contiene i numeri da $1$ a $10$ che sono pari oppure multipli di $3$, compreso il $6$, che è l'uno e l'altro:
$$A \cup B = \{2, 3, 4, 6, 8, 9, 10\}$$
```

```ad-warning
Leggere "oppure" come esclusivo
Un elemento che sta in tutti e due gli insiemi appartiene all'unione. Nell'esempio 2 il $6$, pari e multiplo di $3$, fa parte di $A \cup B$.
```

```ad-example
Esempio 3: insiemi senza elementi in comune
Siano $A = \{1, 3, 5\}$ e $B = \{2, 4\}$. I due insiemi non hanno elementi in comune, cioè sono **disgiunti**, e l'unione li mette uno accanto all'altro:
$$A \cup B = \{1, 2, 3, 4, 5\}$$
```

## Diagramma di Eulero-Venn

Nel diagramma di Eulero-Venn l'unione è tutta la zona coperta da almeno uno dei due insiemi: la parte che sta solo in $A$, la parte che sta solo in $B$ e la parte comune.

```tikz
% nome: unione-insiemi-diagramma-venn
% alt: Unione di due insiemi: nel diagramma di Eulero-Venn è colorata tutta la zona coperta dai cerchi A e B, compresa la parte comune
% svg: unione-insiemi-diagramma-venn-5d641e0c.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (-1,0) circle (1.4);
\fill[blue!20] (1,0) circle (1.4);
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\end{tikzpicture}
```

Se $A$ e $B$ sono disgiunti, i due insiemi si disegnano separati e l'unione è formata da due zone staccate.

```tikz
% nome: unione-insiemi-disgiunti
% alt: Unione di due insiemi disgiunti: i cerchi A e B sono separati e colorati tutti e due
% svg: unione-insiemi-disgiunti-6e6a96a4.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (-1.5,0) circle (1.1);
\fill[blue!20] (1.5,0) circle (1.1);
\draw (-1.5,0) circle (1.1);
\draw (1.5,0) circle (1.1);
\node at (-1.5,0) {$A$};
\node at (1.5,0) {$B$};
\end{tikzpicture}
```

## Proprietà dell'unione

Per insiemi qualunque $A$, $B$, $C$, contenuti in un insieme universo $U$, valgono queste proprietà.

| Proprietà | Enunciato |
|---|---|
| Commutativa | $A \cup B = B \cup A$ |
| Associativa | $(A \cup B) \cup C = A \cup (B \cup C)$ |
| Idempotenza | $A \cup A = A$ |
| Elemento neutro | $A \cup \emptyset = A$ |
| Unione con l'universo | $A \cup U = U$ |

La proprietà commutativa dice che l'ordine dei due insiemi non conta: "pari oppure multipli di 3" e "multipli di 3 oppure pari" descrivono gli stessi numeri.

La proprietà associativa permette di unire tre insiemi senza parentesi, scrivendo $A \cup B \cup C$: è l'insieme degli elementi che stanno in almeno uno dei tre.

L'idempotenza dice che unire un insieme con sé stesso non cambia niente, perché ogni elemento si conta una volta sola. Con i numeri è diverso: $a + a = 2a$, che è uguale ad $a$ solo se $a = 0$.

L'insieme vuoto è l'elemento neutro dell'unione, come lo $0$ per l'addizione: non aggiunge elementi. All'opposto, l'unione con l'universo dà sempre l'universo, perché $A$ è contenuto in $U$ e quindi non aggiunge niente a $U$.

```ad-example
Esempio 4: la proprietà associativa
Siano $A = \{1, 2\}$, $B = \{2, 3\}$ e $C = \{3, 4\}$.

Da una parte $A \cup B = \{1, 2, 3\}$ e quindi $(A \cup B) \cup C = \{1, 2, 3, 4\}$.

Dall'altra $B \cup C = \{2, 3, 4\}$ e quindi $A \cup (B \cup C) = \{1, 2, 3, 4\}$.

I due risultati coincidono, e si può scrivere $A \cup B \cup C = \{1, 2, 3, 4\}$.
```

## Unione e inclusione

Ciascuno dei due insiemi è incluso nella loro unione:

$$A \subseteq A \cup B \qquad \text{e} \qquad B \subseteq A \cup B$$

Se poi un insieme è già contenuto nell'altro, l'unione non aggiunge niente al più grande:

$$A \subseteq B \quad \text{se e solo se} \quad A \cup B = B$$

Infatti, se ogni elemento di $A$ sta già in $B$, unendo $A$ a $B$ non entra nessun elemento nuovo. Viceversa, se $A \cup B = B$, ogni elemento di $A$, che sta nell'unione, sta anche in $B$. I simboli $\subseteq$ e $\subset$ sono spiegati in [Sottoinsiemi e uguaglianza](/materiale/scuola-superiore/matematica/insiemi-e-logica/sottoinsiemi-e-uguaglianza).

```ad-example
Esempio 5: un insieme contenuto nell'altro
Siano $A$ l'insieme delle lettere della parola "roma" e $B$ l'insieme delle lettere della parola "amore".

$A = \{r, o, m, a\}$ e $B = \{a, m, o, r, e\}$. Ogni lettera di $A$ compare in $B$, quindi $A \subseteq B$, e l'unione è $B$ stesso:
$$A \cup B = \{a, e, m, o, r\} = B$$
```

## Numero di elementi dell'unione

Il numero di elementi di un insieme finito $A$ è la sua cardinalità, che si indica con $|A|$ (la trovi in [Prime definizioni](/materiale/scuola-superiore/matematica/insiemi-e-logica/prime-definizioni)).

Se sommi $|A|$ e $|B|$, gli elementi comuni ai due insiemi li conti due volte, una in $A$ e una in $B$. Per contarli una volta sola devi togliere il numero di elementi dell'[intersezione](/materiale/scuola-superiore/matematica/insiemi-e-logica/intersezione-insiemistica) $A \cap B$:

$$|A \cup B| = |A| + |B| - |A \cap B|$$

Se $A$ e $B$ sono disgiunti, $A \cap B = \emptyset$ e la formula diventa $|A \cup B| = |A| + |B|$.

```ad-example
Esempio 6: controllare la formula
Nell'esempio 2, $A = \{2, 4, 6, 8, 10\}$ e $B = \{3, 6, 9\}$, quindi $|A| = 5$ e $|B| = 3$. L'unico elemento comune è il $6$, quindi $|A \cap B| = 1$.
$$|A \cup B| = 5 + 3 - 1 = 7$$
Contando direttamente gli elementi di $A \cup B = \{2, 3, 4, 6, 8, 9, 10\}$ si trovano proprio $7$ elementi.
```

```ad-example
Esempio 7: calcio e pallavolo
In una classe di $28$ studenti, $15$ giocano a calcio, $12$ a pallavolo e $5$ fanno tutti e due gli sport. Quanti studenti fanno almeno uno dei due sport? Quanti non ne fanno nessuno?

Chiamiamo $C$ l'insieme di chi gioca a calcio e $P$ quello di chi gioca a pallavolo. Chi fa almeno uno dei due sport sta in $C \cup P$, chi li fa tutti e due sta in $C \cap P$. Quindi $|C| = 15$, $|P| = 12$ e $|C \cap P| = 5$:
$$|C \cup P| = 15 + 12 - 5 = 22$$
Gli studenti che non fanno nessuno dei due sport sono $28 - 22 = 6$.

Controllo con il diagramma: solo calcio $15 - 5 = 10$, solo pallavolo $12 - 5 = 7$, entrambi $5$, nessuno $6$. In tutto $10 + 7 + 5 + 6 = 28$, come gli studenti della classe.

```tikz
% nome: problema-calcio-pallavolo-diagramma-venn
% alt: Problema con il diagramma di Eulero-Venn: 10 studenti giocano solo a calcio, 5 a calcio e pallavolo, 7 solo a pallavolo, 6 a nessuno dei due
% svg: problema-calcio-pallavolo-diagramma-venn-191f115e.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=south east] at (3,-2) {classe};
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$C$};
\node at (2.1,1.35) {$P$};
\node at (-1.7,0) {$10$};
\node at (0,0) {$5$};
\node at (1.7,0) {$7$};
\node at (-2.5,-1.6) {$6$};
\end{tikzpicture}
```
```

```ad-warning
Sommare le cardinalità senza togliere l'intersezione
$|A \cup B| = |A| + |B|$ vale solo quando $A$ e $B$ sono disgiunti. Nell'esempio 7, sommando $15 + 12 = 27$ si contano due volte i $5$ studenti che fanno entrambi gli sport.
```

```ad-example
Esempio 8: trovare gli elementi comuni
In una classe di $25$ studenti ognuno studia almeno una lingua tra inglese e spagnolo: $20$ studiano inglese e $9$ spagnolo. Quanti studiano tutte e due le lingue?

Siano $I$ e $S$ gli insiemi di chi studia inglese e di chi studia spagnolo. Poiché ogni studente studia almeno una delle due lingue, $I \cup S$ è tutta la classe e $|I \cup S| = 25$. Dalla formula
$$25 = 20 + 9 - |I \cap S|$$
si ricava $|I \cap S| = 29 - 25 = 4$.

Controllo: solo inglese $20 - 4 = 16$, solo spagnolo $9 - 4 = 5$, entrambe $4$; in tutto $16 + 5 + 4 = 25$.
```

```ad-note
Unione di intervalli
L'unione si usa anche con gli intervalli di numeri reali, che incontrerai con le [disequazioni di primo grado](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli). Per esempio $[0, 2) \cup (1, 5] = [0, 5]$: il primo intervallo va da $0$ (compreso) a $2$ (escluso), il secondo da $1$ (escluso) a $5$ (compreso), e insieme coprono tutti i numeri da $0$ a $5$, estremi compresi. Invece $(-\infty, -2) \cup (2, +\infty)$ non si può scrivere come un solo intervallo, perché i numeri da $-2$ a $2$ restano fuori.
```

## Errori frequenti

```ad-warning
Confondere unione e intersezione
L'unione ($\cup$) prende gli elementi che stanno in almeno uno dei due insiemi; l'[intersezione](/materiale/scuola-superiore/matematica/insiemi-e-logica/intersezione-insiemistica) ($\cap$) solo quelli che stanno in entrambi. Per ricordarlo: $\cup$ si apre in alto come una coppa che raccoglie, $\cap$ è la stessa coppa rovesciata. Con $A = \{1, 2, 3\}$ e $B = \{3, 4, 5\}$ si ha $A \cup B = \{1, 2, 3, 4, 5\}$ ma $A \cap B = \{3\}$.
```
