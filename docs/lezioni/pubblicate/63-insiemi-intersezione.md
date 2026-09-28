# Intersezione insiemistica

Se in una classe alcuni studenti giocano a calcio e altri a pallavolo, quelli che fanno tutti e due gli sport formano un nuovo insieme: l'intersezione dei due gruppi. L'intersezione tiene solo gli elementi comuni a due insiemi, e la userai ogni volta che più condizioni devono valere insieme, dai divisori comuni di due numeri ai problemi con i diagrammi. Qui trovi la definizione, le proprietà e il modo di contare gli elementi di un'intersezione; per un quadro di tutte le operazioni tra insiemi c'è [Proprietà delle operazioni tra insiemi](/materiale/scuola-superiore/matematica/insiemi-e-logica/proprieta-delle-operazioni-tra-insiemi).

## Definizione

Dati due insiemi $A$ e $B$, la loro **intersezione** è l'insieme degli elementi che appartengono sia ad $A$ sia a $B$. Si scrive $A \cap B$ e si legge "$A$ intersezione $B$":

$$A \cap B = \{x \mid x \in A \ \text{ e } \ x \in B\}$$

La "e" della definizione chiede che le due condizioni valgano insieme: un elemento che sta in uno solo dei due insiemi resta fuori. In logica questa "e" si indica con il simbolo $\wedge$ e si chiama congiunzione (la trovi in [Proposizioni e connettivi logici](/materiale/scuola-superiore/matematica/insiemi-e-logica/proposizioni-e-connettivi-logici)).

Per costruire l'intersezione di due insiemi scritti per elencazione, scorri gli elementi del primo e tieni solo quelli che compaiono anche nel secondo.

```ad-example
Esempio 1: insiemi con due elementi in comune
Siano $A = \{1, 2, 3, 4, 5\}$ e $B = \{2, 4, 6, 8\}$.

Scorriamo gli elementi di $A$: l'$1$ non sta in $B$, il $2$ sì, il $3$ no, il $4$ sì, il $5$ no. Restano $2$ e $4$:
$$A \cap B = \{2, 4\}$$
```

```ad-example
Esempio 2: lettere di due parole
Siano $A$ l'insieme delle lettere della parola "scuola" e $B$ l'insieme delle lettere della parola "classe".

$A = \{s, c, u, o, l, a\}$ e $B = \{c, l, a, s, e\}$: la $s$ di "classe" compare due volte nella parola, ma nell'insieme si scrive una volta sola. Le lettere comuni sono $s$, $c$, $l$ e $a$, mentre $u$ e $o$ stanno solo in $A$ ed $e$ solo in $B$:
$$A \cap B = \{a, c, l, s\}$$
```

## Diagramma di Eulero-Venn

Nel diagramma di Eulero-Venn l'intersezione è la zona in cui i due cerchi si sovrappongono: la parte che sta dentro $A$ e dentro $B$.

```tikz
% nome: intersezione-insiemi-diagramma-venn
% alt: Intersezione di due insiemi: nel diagramma di Eulero-Venn è colorata solo la zona in cui i cerchi A e B si sovrappongono
% svg: intersezione-insiemi-diagramma-venn-38085112.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (0,-0.98) arc[start angle=-44.42, end angle=44.42, radius=1.4] arc[start angle=135.58, end angle=224.42, radius=1.4] -- cycle;
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\end{tikzpicture}
```

Due insiemi che non hanno elementi in comune, cioè tali che $A \cap B = \emptyset$, si dicono **disgiunti**. Nel diagramma si disegnano separati, e non c'è nessuna zona da colorare. Sono disgiunti, per esempio, l'insieme dei numeri pari e quello dei numeri dispari.

```tikz
% nome: intersezione-insiemi-disgiunti
% alt: Due insiemi disgiunti: i cerchi A e B sono separati e non hanno zone in comune, quindi l'intersezione è vuota
% svg: intersezione-insiemi-disgiunti-99cd2899.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\draw (-1.5,0) circle (1.1);
\draw (1.5,0) circle (1.1);
\node at (-1.5,0) {$A$};
\node at (1.5,0) {$B$};
\end{tikzpicture}
```

```ad-example
Esempio 3: insiemi disgiunti
Siano $A = \{1, 3, 5\}$ e $B = \{2, 4\}$. Nessun elemento di $A$ compare in $B$, quindi i due insiemi sono disgiunti e la loro intersezione è l'insieme vuoto:
$$A \cap B = \emptyset$$
```

```ad-warning
Scrivere $\{0\}$ o $\{\emptyset\}$ al posto di $\emptyset$
Quando non ci sono elementi comuni, il risultato è $\emptyset$, che si può scrivere anche $\{\ \}$. L'insieme $\{0\}$ ha un elemento, il numero zero, e $\{\emptyset\}$ ha un elemento, l'insieme vuoto: nessuno dei due è vuoto (la differenza è spiegata in [Prime definizioni](/materiale/scuola-superiore/matematica/insiemi-e-logica/prime-definizioni)).
```

## Insiemi descritti da una proprietà

Quando gli insiemi sono descritti da una proprietà caratteristica, l'intersezione è l'insieme degli elementi che hanno tutte e due le proprietà. Per esempio, i numeri naturali che sono pari e anche multipli di $3$ sono i multipli di $6$:

$$
\begin{gathered}
\{x \in \mathbb{N} \mid x \text{ è pari}\} \\
\cap \, \{x \in \mathbb{N} \mid x \text{ è multiplo di } 3\} \\
= \{0, 6, 12, 18, \dots\}
\end{gathered}
$$

In generale i multipli comuni di due numeri sono i multipli del loro minimo comune multiplo, e i divisori comuni di due numeri sono i divisori del loro massimo comune divisore: con l'intersezione ritrovi le idee della lezione [MCD e MCM in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/mcd-e-mcm-in-n). Il simbolo della proprietà caratteristica, $\{x \in \mathbb{N} \mid \dots\}$, è spiegato in [Rappresentazione degli insiemi](/materiale/scuola-superiore/matematica/insiemi-e-logica/rappresentazione-degli-insiemi).

```ad-example
Esempio 4: multipli di 4 e multipli di 6
Siano $A$ l'insieme dei multipli di $4$ e $B$ l'insieme dei multipli di $6$ in $\mathbb{N}$.

Elenchiamo i primi elementi:
$$
\begin{gathered}
A = \{0, 4, 8, 12, 16, 20, 24, \dots\} \\
B = \{0, 6, 12, 18, 24, \dots\}
\end{gathered}
$$
Gli elementi comuni sono $0, 12, 24, 36, \dots$, cioè i multipli di $12$, che è il MCM tra $4$ e $6$:
$$A \cap B = \{0, 12, 24, 36, \dots\}$$
```

```ad-warning
Moltiplicare i due numeri invece di cercare il MCM
L'intersezione dei multipli di $4$ e dei multipli di $6$ non è l'insieme dei multipli di $4 \cdot 6 = 24$: il $12$ è multiplo di $4$ e di $6$, ma non di $24$. Il prodotto va bene solo quando i due numeri non hanno divisori comuni oltre a $1$, come $2$ e $3$.
```

```ad-example
Esempio 5: divisori comuni
Siano $A$ l'insieme dei divisori di $12$ e $B$ l'insieme dei divisori di $18$.

$A = \{1, 2, 3, 4, 6, 12\}$ e $B = \{1, 2, 3, 6, 9, 18\}$, quindi
$$A \cap B = \{1, 2, 3, 6\}$$
Sono i divisori comuni di $12$ e $18$, e il più grande, $6$, è il loro MCD. Nel diagramma ogni numero sta nella sua zona:

```tikz
% nome: intersezione-divisori-12-18-diagramma-venn
% alt: Diagramma di Eulero-Venn dei divisori di 12 e di 18: nella zona comune colorata ci sono 1, 2, 3 e 6; 4 e 12 stanno solo tra i divisori di 12, 9 e 18 solo tra i divisori di 18
% svg: intersezione-divisori-12-18-diagramma-venn-9671fa95.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=south east] at (3,-2) {naturali};
\fill[blue!20] (0,-0.98) arc[start angle=-44.42, end angle=44.42, radius=1.4] arc[start angle=135.58, end angle=224.42, radius=1.4] -- cycle;
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\node at (0,0.6) {$1$};
\node at (0,0.2) {$2$};
\node at (0,-0.2) {$3$};
\node at (0,-0.6) {$6$};
\node at (-1.5,0.35) {$4$};
\node at (-1.5,-0.35) {$12$};
\node at (1.5,0.35) {$9$};
\node at (1.5,-0.35) {$18$};
\end{tikzpicture}
```
```

```ad-example
Esempio 6: due condizioni sullo stesso numero
Siano $A = \{x \in \mathbb{N} \mid x \le 9\}$ e $B = \{x \in \mathbb{N} \mid x \ge 6\}$.

Un numero sta in $A \cap B$ se è minore o uguale a $9$ e, insieme, maggiore o uguale a $6$. Gli estremi $6$ e $9$ rispettano tutte e due le condizioni, quindi fanno parte dell'intersezione:
$$A \cap B = \{6, 7, 8, 9\}$$
Se invece $C = \{x \in \mathbb{N} \mid x < 6\}$, nessun numero può essere insieme minore di $6$ e maggiore o uguale a $6$: $C \cap B = \emptyset$, cioè $C$ e $B$ sono disgiunti.
```

```ad-note
Intersezione di intervalli
Con i numeri reali lo stesso ragionamento porta all'intersezione di intervalli, che serve per risolvere i [sistemi di disequazioni](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/sistemi-di-disequazioni): le soluzioni del sistema sono i numeri che rispettano tutte le disequazioni insieme.
```

## Proprietà dell'intersezione

Per insiemi qualunque $A$, $B$, $C$, contenuti in un insieme universo $U$, valgono queste proprietà.

| Proprietà | Enunciato |
|---|---|
| Commutativa | $A \cap B = B \cap A$ |
| Associativa | $(A \cap B) \cap C = A \cap (B \cap C)$ |
| Idempotenza | $A \cap A = A$ |
| Intersezione con il vuoto | $A \cap \emptyset = \emptyset$ |
| Elemento neutro | $A \cap U = A$ |

La proprietà commutativa dice che l'ordine dei due insiemi non conta: "pari e multipli di 3" e "multipli di 3 e pari" descrivono gli stessi numeri.

La proprietà associativa permette di intersecare tre insiemi senza parentesi, scrivendo $A \cap B \cap C$: ne parliamo più sotto, in una sezione apposta.

L'idempotenza dice che gli elementi comuni ad $A$ e ad $A$ stesso sono tutti quelli di $A$. L'insieme vuoto non ha elementi, quindi non ne ha nemmeno in comune con $A$: l'intersezione con il vuoto è sempre vuota, come il prodotto per $0$ è sempre $0$. L'universo invece contiene tutti gli elementi di $A$, e intersecare con $U$ lascia $A$ com'è: per l'intersezione l'universo fa la parte che ha il numero $1$ nella moltiplicazione.

Le proprietà che legano l'intersezione alle altre operazioni, la distributiva e le leggi di De Morgan, sono nella lezione [Proprietà delle operazioni tra insiemi](/materiale/scuola-superiore/matematica/insiemi-e-logica/proprieta-delle-operazioni-tra-insiemi).

## Intersezione e inclusione

L'intersezione è contenuta in ciascuno dei due insiemi, perché i suoi elementi stanno sia in $A$ sia in $B$:

$$A \cap B \subseteq A \qquad \text{e} \qquad A \cap B \subseteq B$$

Se poi un insieme è contenuto nell'altro, gli elementi comuni sono tutti quelli del più piccolo:

$$A \subseteq B \quad \text{se e solo se} \quad A \cap B = A$$

Infatti, se ogni elemento di $A$ sta anche in $B$, tutti gli elementi di $A$ sono comuni ai due insiemi. Viceversa, se $A \cap B = A$, ogni elemento di $A$ sta nell'intersezione, e quindi anche in $B$. I simboli $\subseteq$ e $\subset$ sono spiegati in [Sottoinsiemi e uguaglianza](/materiale/scuola-superiore/matematica/insiemi-e-logica/sottoinsiemi-e-uguaglianza).

```tikz
% nome: intersezione-insieme-incluso
% alt: Il cerchio A è tutto dentro il cerchio B ed è colorato: quando A è contenuto in B, l'intersezione tra A e B è A stesso
% svg: intersezione-insieme-incluso-2dbd7186.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (-0.4,-0.2) circle (0.8);
\draw (0,0) circle (1.7);
\draw (-0.4,-0.2) circle (0.8);
\node at (-0.4,-0.2) {$A$};
\node at (1.55,1.35) {$B$};
\end{tikzpicture}
```

```ad-example
Esempio 7: un insieme contenuto nell'altro
Siano $A$ l'insieme dei multipli di $6$ e $B$ l'insieme dei numeri pari, in $\mathbb{N}$.

Ogni multiplo di $6$ è pari, perché $6 = 2 \cdot 3$: quindi $A \subseteq B$, e gli elementi comuni sono tutti quelli di $A$:
$$A \cap B = A = \{0, 6, 12, 18, \dots\}$$
```

## Intersezione di tre insiemi

Grazie alla proprietà associativa, l'intersezione di tre insiemi si scrive $A \cap B \cap C$: è l'insieme degli elementi che appartengono a tutti e tre. Per calcolarla intersechi due insiemi e poi intersechi il risultato con il terzo, nell'ordine che preferisci.

```tikz
% nome: intersezione-tre-insiemi-diagramma-venn
% alt: Intersezione di tre insiemi: nel diagramma di Eulero-Venn con i cerchi A, B e C è colorata solo la zona centrale, comune a tutti e tre
% svg: intersezione-tre-insiemi-diagramma-venn-91d408d6.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (0,-0.745) arc[start angle=-57.42, end angle=9.39, radius=1.3] arc[start angle=63.38, end angle=116.62, radius=1.3] arc[start angle=170.61, end angle=237.42, radius=1.3] -- cycle;
\draw (-0.7,0.35) circle (1.3);
\draw (0.7,0.35) circle (1.3);
\draw (0,-0.6) circle (1.3);
\node at (-2.2,1.35) {$A$};
\node at (2.2,1.35) {$B$};
\node at (1.6,-1.6) {$C$};
\end{tikzpicture}
```

```ad-example
Esempio 8: tre insiemi
Siano $A = \{1, 2, 3, 4, 5, 6\}$, $B = \{2, 4, 6, 8\}$ e $C = \{3, 6, 9\}$.

Da una parte $A \cap B = \{2, 4, 6\}$, e intersecando con $C$ resta $(A \cap B) \cap C = \{6\}$.

Dall'altra $B \cap C = \{6\}$, e intersecando con $A$ resta $A \cap (B \cap C) = \{6\}$.

I due risultati coincidono, come dice la proprietà associativa:
$$A \cap B \cap C = \{6\}$$
```

```ad-warning
Pensare che basti controllare le coppie di insiemi
Tre insiemi possono avere elementi in comune a due a due senza averne nessuno in comune a tutti e tre. Con $A = \{1, 2\}$, $B = \{2, 3\}$ e $C = \{1, 3\}$ si ha $A \cap B = \{2\}$, $B \cap C = \{3\}$ e $A \cap C = \{1\}$, ma nessun numero sta in tutti e tre: $A \cap B \cap C = \emptyset$.
```

## Numero di elementi dell'intersezione

Il numero di elementi di un insieme finito $A$ è la sua cardinalità, che si indica con $|A|$. Nella lezione [Unione insiemistica](/materiale/scuola-superiore/matematica/insiemi-e-logica/unione-insiemistica) hai visto la formula per contare gli elementi di un'unione:

$$|A \cup B| = |A| + |B| - |A \cap B|$$

Portando $|A \cap B|$ a sinistra e $|A \cup B|$ a destra, la stessa formula conta gli elementi dell'intersezione quando conosci quelli dell'unione:

$$|A \cap B| = |A| + |B| - |A \cup B|$$

La somma $|A| + |B|$ conta due volte gli elementi comuni, una in $A$ e una in $B$, mentre $|A \cup B|$ li conta una volta sola: la differenza tra le due è proprio il numero degli elementi comuni. Per esempio, con $A = \{1, 2, 3, 4, 5\}$ e $B = \{2, 4, 6, 8\}$ dell'esempio 1 si ha $A \cup B = \{1, 2, 3, 4, 5, 6, 8\}$, con $7$ elementi, e infatti $|A \cap B| = 5 + 4 - 7 = 2$. La stessa idea dà la probabilità dell'unione di due eventi: vedi [Probabilità della somma e dell'evento contrario](/materiale/scuola-superiore/matematica/probabilita/probabilita-della-somma-e-dell-evento-contrario).

```ad-tip
Un controllo sul risultato
Poiché $A \cap B$ è contenuto sia in $A$ sia in $B$, non può avere più elementi del più piccolo dei due insiemi. Se trovi $|A \cap B|$ maggiore di $|A|$ o di $|B|$, c'è un errore nei conti.
```

```ad-example
Esempio 9: la gita
In una gita di $30$ studenti, $18$ hanno visitato il museo, $16$ il castello e $4$ nessuno dei due. Quanti studenti hanno visitato tutti e due?

Chiamiamo $M$ l'insieme di chi ha visitato il museo e $C$ quello di chi ha visitato il castello. Chi ha visitato almeno uno dei due sta in $M \cup C$: sono tutti tranne i $4$ che non hanno visitato niente, quindi $|M \cup C| = 30 - 4 = 26$. Dalla formula:
$$
\begin{aligned}
|M \cap C| &= 18 + 16 - 26 \\
&= 8
\end{aligned}
$$

Controllo con il diagramma: solo museo $18 - 8 = 10$, solo castello $16 - 8 = 8$, entrambi $8$, nessuno $4$. In tutto $10 + 8 + 8 + 4 = 30$, come gli studenti della gita.

```tikz
% nome: problema-gita-museo-castello-diagramma-venn
% alt: Problema con il diagramma di Eulero-Venn: 10 studenti hanno visitato solo il museo, 8 museo e castello, 8 solo il castello, 4 nessuno dei due
% svg: problema-gita-museo-castello-diagramma-venn-e85e02bc.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=south east] at (3,-2) {gita};
\fill[blue!20] (0,-0.98) arc[start angle=-44.42, end angle=44.42, radius=1.4] arc[start angle=135.58, end angle=224.42, radius=1.4] -- cycle;
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$M$};
\node at (2.1,1.35) {$C$};
\node at (-1.7,0) {$10$};
\node at (0,0) {$8$};
\node at (1.7,0) {$8$};
\node at (-2.5,-1.6) {$4$};
\end{tikzpicture}
```
```

```ad-warning
Dimenticare chi non sta in nessuno dei due insiemi
Nell'esempio 9 il $30$ è il numero di tutti gli studenti, non quello di $M \cup C$. Usando $30$ al posto di $26$ si trova $18 + 16 - 30 = 4$ invece di $8$: prima di usare la formula togli chi non ha visitato niente.
```

```ad-example
Esempio 10: il minimo e il massimo
In un gruppo di $30$ ragazzi, $22$ hanno la bicicletta e $17$ il monopattino. Quanti ragazzi hanno tutti e due, come minimo? E come massimo?

Chiamiamo $B$ e $M$ i due insiemi. Dalla formula $|B \cap M| = 22 + 17 - |B \cup M| = 39 - |B \cup M|$, e $B \cup M$ non può avere più dei $30$ ragazzi del gruppo. Quindi l'intersezione ha almeno $39 - 30 = 9$ elementi: il minimo è $9$, e si ha quando ogni ragazzo ha almeno uno dei due mezzi.

L'intersezione è contenuta in $M$, quindi non può avere più di $17$ elementi: il massimo è $17$, e si ha quando tutti i ragazzi con il monopattino hanno anche la bicicletta, cioè quando $M \subseteq B$.
```

## Errori frequenti

```ad-warning
Confondere intersezione e unione
L'intersezione ($\cap$) prende solo gli elementi che stanno in entrambi gli insiemi; l'[unione](/materiale/scuola-superiore/matematica/insiemi-e-logica/unione-insiemistica) ($\cup$) quelli che stanno in almeno uno. Per ricordarlo: $\cup$ si apre in alto come una coppa che raccoglie, $\cap$ è la stessa coppa rovesciata. Con $A = \{1, 2, 3\}$ e $B = \{3, 4, 5\}$ si ha $A \cap B = \{3\}$ ma $A \cup B = \{1, 2, 3, 4, 5\}$.
```

```ad-warning
Tradurre ogni "e" del linguaggio comune con $\cap$
Nella definizione "e" vuol dire che un elemento ha tutte e due le proprietà. Nel linguaggio di tutti i giorni "e" a volte mette insieme due gruppi: "i ragazzi e le ragazze della classe" sono tutti gli studenti, cioè un'unione, perché nessuno studente è insieme ragazzo e ragazza. Prima di scrivere $\cap$, chiediti se cerchi gli elementi che hanno entrambe le proprietà.
```
