# Proprietà delle operazioni tra insiemi

Con due insiemi se ne possono costruire altri: quello degli elementi che stanno in almeno uno dei due, quello degli elementi comuni, quello degli elementi che stanno nel primo e non nel secondo. Queste costruzioni si chiamano operazioni tra insiemi, e le userai ogni volta che dovrai mettere insieme o confrontare condizioni, dai problemi con i diagrammi alle soluzioni delle disequazioni. Per seguire la lezione devi sapere come si scrive un insieme e come si disegna un diagramma di Eulero-Venn, argomenti della lezione [Rappresentazione degli insiemi](/materiale/scuola-superiore/matematica/insiemi-e-logica/rappresentazione-degli-insiemi).

In tutta la lezione gli insiemi sono presi dentro un insieme universo $U$, e negli esempi si usano questi tre insiemi:

$$
\begin{gathered}
U = \{1, 2, 3, 4, 5, 6, 7, 8\} \\
A = \{1, 2, 3, 4\} \\
B = \{3, 4, 5, 6\}
\end{gathered}
$$

Nel diagramma di Eulero-Venn, ogni elemento sta nella sua zona:

```tikz
% nome: insiemi-a-b-universo-elementi
% alt: Diagramma di Eulero-Venn con U da 1 a 8: 1 e 2 solo in A, 3 e 4 in A e in B, 5 e 6 solo in B, 7 e 8 fuori da entrambi
% svg: insiemi-a-b-universo-elementi-51f3bc65.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\node at (-1.8,0.4) {$1$};
\node at (-1.8,-0.4) {$2$};
\node at (0,0.4) {$3$};
\node at (0,-0.4) {$4$};
\node at (1.8,0.4) {$5$};
\node at (1.8,-0.4) {$6$};
\node at (-2.6,-1.6) {$7$};
\node at (2.6,-1.6) {$8$};
\end{tikzpicture}
```

## Unione

L'**unione** di $A$ e $B$ è l'insieme degli elementi che appartengono ad $A$ oppure a $B$, cioè ad almeno uno dei due:

$$A \cup B = \{x \mid x \in A \text{ oppure } x \in B\}$$

Il simbolo $\cup$ si legge "unione". La parola "oppure" qui non esclude il caso in cui l'elemento stia in tutti e due gli insiemi: anche gli elementi comuni fanno parte dell'unione, e si scrivono una volta sola.

```ad-example
Esempio 1: unione
Con $A = \{1, 2, 3, 4\}$ e $B = \{3, 4, 5, 6\}$ si prendono tutti gli elementi dei due insiemi, scrivendo $3$ e $4$ una volta:
$$A \cup B = \{1, 2, 3, 4, 5, 6\}$$
```

```ad-warning
Scrivere due volte gli elementi comuni nell'unione
$\{1, 2, 3\} \cup \{3, 4\}$ è $\{1, 2, 3, 4\}$, con 4 elementi. Scrivere $\{1, 2, 3, 3, 4\}$ fa pensare che gli elementi siano 5, e porta a sbagliare i conteggi nei problemi.
```

Nel diagramma di Eulero-Venn l'unione è tutta la zona coperta dai due cerchi:

```tikz
% nome: unione-insiemi-diagramma-venn
% alt: Unione di due insiemi: nel diagramma di Eulero-Venn è colorata tutta la zona coperta dai cerchi A e B
% svg: unione-insiemi-diagramma-venn-4fc60514.svg 231x155
\begin{tikzpicture}
  \begin{scope}
    \draw (-3,-2) rectangle (3,2) node[anchor=north east] {$U$};
    \begin{scope}
      \clip (-3,-2) rectangle (3,2);
      \fill[blue!20] ( -1,0) circle (1.4);
      \fill[blue!20] (  1,0) circle (1.4);
      \draw ( -1,0) circle (1.4) node[left] {$A$};
      \draw (  1,0) circle (1.4) node[right] {$B$};
    \end{scope}
  \end{scope}
\end{tikzpicture}
```

Qualunque sia $A$, valgono $A \cup A = A$ e $A \cup \emptyset = A$. Casi più complessi, come l'unione di tre insiemi o di intervalli di numeri reali, sono nella lezione [Unione insiemistica](/materiale/scuola-superiore/matematica/insiemi-e-logica/unione-insiemistica).

## Intersezione

L'**intersezione** di $A$ e $B$ è l'insieme degli elementi che appartengono sia ad $A$ sia a $B$:

$$A \cap B = \{x \mid x \in A \text{ e } x \in B\}$$

```ad-example
Esempio 2: intersezione
Gli elementi che stanno sia in $A = \{1, 2, 3, 4\}$ sia in $B = \{3, 4, 5, 6\}$ sono $3$ e $4$:
$$A \cap B = \{3, 4\}$$
```

Nel diagramma l'intersezione è la zona in cui i due cerchi si sovrappongono:

```tikz
% nome: intersezione-insiemi-diagramma-venn
% alt: Intersezione di due insiemi: nel diagramma di Eulero-Venn è colorata solo la zona in cui i cerchi A e B si sovrappongono
% svg: intersezione-insiemi-diagramma-venn-982b3796.svg 231x155
\begin{tikzpicture}
  \begin{scope}
    \draw (-3,-2) rectangle (3,2) node[anchor=north east] {$U$};
    \fill[blue!20] (0,-0.98) arc[start angle=-44.42, end angle=44.42, radius=1.4] arc[start angle=135.58, end angle=224.42, radius=1.4] -- cycle;
    \draw ( -1,0) circle (1.4) node[left] {$A$};
    \draw (  1,0) circle (1.4) node[right] {$B$};
  \end{scope}
\end{tikzpicture}
```

Due insiemi che non hanno elementi in comune, cioè tali che $A \cap B = \emptyset$, si dicono **disgiunti**. Con insiemi descritti da una proprietà, l'intersezione contiene gli elementi che le hanno tutte e due: i numeri naturali pari e multipli di $3$ sono i multipli di $6$, cioè $\{0, 6, 12, 18, \dots\}$. Qualunque sia $A$, valgono $A \cap A = A$ e $A \cap \emptyset = \emptyset$. Le altre proprietà, l'intersezione di tre insiemi e il numero di elementi di un'intersezione sono nella lezione [Intersezione insiemistica](/materiale/scuola-superiore/matematica/insiemi-e-logica/intersezione-insiemistica).

## Differenza

La **differenza** tra $A$ e $B$ è l'insieme degli elementi che appartengono ad $A$ e non appartengono a $B$:

$$A \setminus B = \{x \mid x \in A \text{ e } x \notin B\}$$

Si legge "$A$ meno $B$" e si scrive anche $A - B$.

```ad-example
Esempio 3: le due differenze
Da $A = \{1, 2, 3, 4\}$ si tolgono gli elementi che stanno anche in $B$, cioè $3$ e $4$:
$$A \setminus B = \{1, 2\}$$
Da $B = \{3, 4, 5, 6\}$ si tolgono gli elementi che stanno anche in $A$, cioè di nuovo $3$ e $4$:
$$B \setminus A = \{5, 6\}$$
I due risultati sono diversi: nella differenza l'ordine degli insiemi conta.
```

Casi particolari, diagramma e numero di elementi della differenza sono nella lezione [Differenza e complementare](/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare).

## Complementare

Il **complementare** di $A$ rispetto all'universo $U$ è l'insieme degli elementi di $U$ che non appartengono ad $A$:

$$\overline{A} = \{x \in U \mid x \notin A\} = U \setminus A$$

```ad-example
Esempio 4: complementari
Con $U = \{1, 2, 3, 4, 5, 6, 7, 8\}$:
$$
\begin{gathered}
\overline{A} = \{5, 6, 7, 8\} \\
\overline{B} = \{1, 2, 7, 8\}
\end{gathered}
$$
```

Il complementare dipende dall'universo: il complementare di $\{2, 4\}$ è $\{1, 3\}$ rispetto a $U = \{1, 2, 3, 4\}$ e $\{1, 3, 5, 6\}$ rispetto a $U = \{1, 2, 3, 4, 5, 6\}$. Per ogni $A$ valgono $A \cup \overline{A} = U$ e $A \cap \overline{A} = \emptyset$. Le altre proprietà, il complementare rispetto a un insieme e le leggi di De Morgan spiegate con il diagramma sono nella lezione [Differenza e complementare](/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare).

## Prodotto cartesiano

Le operazioni viste finora producono insiemi fatti degli stessi elementi di partenza. Il prodotto cartesiano $A \times B$ invece è l'insieme delle coppie ordinate $(a, b)$ con $a \in A$ e $b \in B$: con $A = \{1, 2\}$ e $B = \{a\}$ si ha $A \times B = \{(1, a), (2, a)\}$. L'ordine conta, perché $(1, 2) \neq (2, 1)$; il prodotto ha $|A| \cdot |B|$ elementi, non è commutativo e $A \times \emptyset = \emptyset$. Definizione, rappresentazioni e proprietà sono nella lezione [Prodotto cartesiano](/materiale/scuola-superiore/matematica/insiemi-e-logica/prodotto-cartesiano).

## Operazioni e inclusione

Le operazioni permettono di riconoscere se un insieme è contenuto in un altro, cioè se è un suo sottoinsieme (la relazione $A \subseteq B$, spiegata nella lezione [Sottoinsiemi e uguaglianza](/materiale/scuola-superiore/matematica/insiemi-e-logica/sottoinsiemi-e-uguaglianza)). Le seguenti affermazioni dicono tutte la stessa cosa: se ne vale una, valgono tutte.

- $A \subseteq B$: ogni elemento di $A$ sta in $B$.
- $A \cup B = B$: unendo $A$ a $B$ non si aggiunge niente.
- $A \cap B = A$: gli elementi comuni sono tutti quelli di $A$.
- $A \setminus B = \emptyset$: togliendo da $A$ gli elementi di $B$ non resta niente.

Per esempio, con $C = \{3, 4\}$ e $B = \{3, 4, 5, 6\}$ si ha $C \subseteq B$, e infatti $C \cup B = B$, $C \cap B = C$ e $C \setminus B = \emptyset$.

## Proprietà delle operazioni

Unione e intersezione hanno proprietà simili a quelle dell'addizione e della moltiplicazione tra numeri. Valgono per qualunque terna di insiemi $A$, $B$, $C$.

| Proprietà | Unione | Intersezione |
|---|---|---|
| Commutativa | $A \cup B = B \cup A$ | $A \cap B = B \cap A$ |
| Associativa | $(A \cup B) \cup C = A \cup (B \cup C)$ | $(A \cap B) \cap C = A \cap (B \cap C)$ |
| Distributiva | $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$ | $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ |
| Leggi di De Morgan | $\overline{A \cup B} = \overline{A} \cap \overline{B}$ | $\overline{A \cap B} = \overline{A} \cup \overline{B}$ |

A differenza dei numeri, qui la distributiva vale in tutti e due i sensi: l'intersezione si distribuisce rispetto all'unione e l'unione si distribuisce rispetto all'intersezione. Le leggi di De Morgan dicono che, passando al complementare, l'unione diventa intersezione e l'intersezione diventa unione.

La differenza invece non è né commutativa né associativa: nell'Esempio 3 hai visto che $A \setminus B \neq B \setminus A$, e nell'Esempio 6 qui sotto trovi un caso in cui $(A \setminus B) \setminus C \neq A \setminus (B \setminus C)$. Anche il prodotto cartesiano non è commutativo (lo trovi nella lezione [Prodotto cartesiano](/materiale/scuola-superiore/matematica/insiemi-e-logica/prodotto-cartesiano)).

Tra unione, intersezione e differenza non c'è un ordine di precedenza su cui tutti i libri siano d'accordo: nelle espressioni con più operazioni si usano le parentesi e si calcola partendo da quelle più interne.

## Esempi svolti

```ad-example
Esempio 5: tutte le operazioni su insiemi descritti a parole
Sia $U$ l'insieme dei numeri naturali da 1 a 12, $A$ l'insieme dei divisori di 12 e $B$ l'insieme dei numeri dispari di $U$. Calcola $A \cup B$, $A \cap B$, $A \setminus B$, $B \setminus A$, $\overline{A}$ e $\overline{A \cup B}$.

Prima si elencano gli elementi:
$$
\begin{gathered}
A = \{1, 2, 3, 4, 6, 12\} \\
B = \{1, 3, 5, 7, 9, 11\}
\end{gathered}
$$
Poi si calcola:
- $A \cup B = \{1, 2, 3, 4, 5, 6, 7, 9, 11, 12\}$
- $A \cap B = \{1, 3\}$
- $A \setminus B = \{2, 4, 6, 12\}$
- $B \setminus A = \{5, 7, 9, 11\}$
- $\overline{A} = \{5, 7, 8, 9, 10, 11\}$
- $\overline{A \cup B} = \{8, 10\}$

Controllo con la legge di De Morgan: $\overline{B} = \{2, 4, 6, 8, 10, 12\}$, quindi $\overline{A} \cap \overline{B} = \{8, 10\}$, uguale a $\overline{A \cup B}$.
```

```ad-example
Esempio 6: un'espressione con le parentesi
Con $A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5, 6\}$ e $C = \{2, 4, 6, 8\}$, calcola $(A \setminus B) \setminus C$ e $A \setminus (B \setminus C)$.

Primo calcolo: $A \setminus B = \{1, 2\}$, e togliendo gli elementi di $C$ resta
$$(A \setminus B) \setminus C = \{1\}$$
Secondo calcolo: $B \setminus C = \{3, 5\}$, e togliendo questi elementi da $A$ resta
$$A \setminus (B \setminus C) = \{1, 2, 4\}$$
I risultati sono diversi: spostare le parentesi in una differenza cambia il risultato.
```

```ad-example
Esempio 7: verificare la proprietà distributiva
Con gli stessi $A$, $B$, $C$ dell'Esempio 6, verifica che $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$.

Primo membro: $B \cup C = \{2, 3, 4, 5, 6, 8\}$, quindi $A \cap (B \cup C) = \{2, 3, 4\}$.

Secondo membro: $A \cap B = \{3, 4\}$ e $A \cap C = \{2, 4\}$, quindi $(A \cap B) \cup (A \cap C) = \{2, 3, 4\}$.

I due membri coincidono.
```

```ad-example
Esempio 8: un problema con il diagramma
In una classe di 25 studenti, 14 giocano a calcio, 9 fanno nuoto e 4 fanno tutti e due gli sport. Quanti studenti fanno solo calcio, quanti solo nuoto, quanti almeno uno dei due sport e quanti nessuno?

Chiama $C$ l'insieme di chi gioca a calcio e $N$ quello di chi fa nuoto; l'universo è la classe. Si riempie il diagramma partendo dalla zona comune:
- $C \cap N$ ha 4 studenti;
- solo calcio, cioè $C \setminus N$: $14 - 4 = 10$ studenti;
- solo nuoto, cioè $N \setminus C$: $9 - 4 = 5$ studenti;
- almeno uno sport, cioè $C \cup N$: $10 + 5 + 4 = 19$ studenti;
- nessuno sport, cioè $\overline{C \cup N}$: $25 - 19 = 6$ studenti.

Nota che $14 + 9 = 23$ non è il numero di studenti di $C \cup N$: i 4 che fanno entrambi gli sport verrebbero contati due volte. La formula per contare gli elementi di un'unione è nella lezione [Unione insiemistica](/materiale/scuola-superiore/matematica/insiemi-e-logica/unione-insiemistica).

Il diagramma, con il numero di studenti in ogni zona:

```tikz
% nome: problema-sport-diagramma-venn
% alt: Problema con il diagramma di Eulero-Venn: 10 studenti fanno solo calcio, 4 calcio e nuoto, 5 solo nuoto, 6 nessuno dei due sport
% svg: problema-sport-diagramma-venn-99125357.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=south east] at (3,-2) {classe};
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$C$};
\node at (2.1,1.35) {$N$};
\node at (-1.7,0) {$10$};
\node at (0,0) {$4$};
\node at (1.7,0) {$5$};
\node at (-2.5,-1.6) {$6$};
\end{tikzpicture}
```
```
