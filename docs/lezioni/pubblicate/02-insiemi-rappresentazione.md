# Rappresentazione degli insiemi

Lo stesso insieme si può descrivere in tre modi: elencando i suoi elementi, dicendo quale proprietà li accomuna, oppure disegnandolo con un diagramma di Eulero-Venn. Ciascun modo è comodo in situazioni diverse, e negli esercizi ti verrà chiesto spesso di passare dall'uno all'altro. Cosa sono un insieme e i suoi elementi, e cosa vogliono dire i simboli $\in$ e $\notin$, è spiegato nella lezione [Prime definizioni](/materiale/scuola-superiore/matematica/insiemi-e-logica/prime-definizioni).

## Rappresentazione per elencazione

Nella **rappresentazione per elencazione** (detta anche estensiva o tabulare) si scrivono tutti gli elementi dell'insieme tra parentesi graffe, separati da virgole:

$$A = \{a, e, i, o, u\} \qquad B = \{2, 4, 6, 8\}$$

Quando elenchi gli elementi valgono due regole:

- ogni elemento si scrive una volta sola: le lettere della parola "sasso" formano l'insieme $\{s, a, o\}$;
- l'ordine non conta: $\{2, 4, 6, 8\}$ e $\{8, 2, 6, 4\}$ sono lo stesso insieme (il perché è nella lezione [Sottoinsiemi e uguaglianza](/materiale/scuola-superiore/matematica/insiemi-e-logica/sottoinsiemi-e-uguaglianza)).

```ad-warning
Ripetere gli elementi nell'elenco
$\{1, 2, 2, 3\}$ non è sbagliato come insieme, ma è lo stesso insieme di $\{1, 2, 3\}$ e ha 3 elementi, non 4. Nell'elencazione ogni elemento si scrive una volta sola.
```

Per un insieme con molti elementi, o con infiniti elementi, si usano i puntini, ma solo quando la regola con cui gli elementi continuano è evidente:

$$\{1, 2, 3, \dots, 100\} \qquad \{0, 2, 4, 6, \dots\}$$

Il primo è l'insieme dei numeri da 1 a 100, il secondo quello dei numeri naturali pari. Per insiemi come i numeri reali compresi tra 0 e 1 l'elencazione non funziona: non esiste un "numero successivo" a 0 da scrivere subito dopo.

## Rappresentazione per proprietà caratteristica

Nella **rappresentazione per proprietà caratteristica** (detta anche intensiva) si scrive la proprietà che hanno tutti gli elementi dell'insieme e che non ha nessun altro oggetto:

$$B = \{x \in \mathbb{N} \mid x \text{ è pari e } 1 \le x \le 9\}$$

Si legge: "$B$ è l'insieme degli $x$ appartenenti a $\mathbb{N}$ tali che $x$ è pari e compreso tra 1 e 9". La barra verticale $\mid$ si legge "tale che"; alcuni libri usano al suo posto i due punti.

La scrittura ha due parti, e contano tutte e due:

1. prima della barra, l'insieme da cui si prendono gli elementi ($x \in \mathbb{N}$, $x \in \mathbb{Z}$, ...);
2. dopo la barra, la condizione che gli elementi devono soddisfare.

Se cambi l'insieme di partenza, con la stessa condizione ottieni un insieme diverso.

```ad-example
Esempio 1: la stessa condizione in insiemi diversi
- $\{x \in \mathbb{N} \mid x < 3\} = \{0, 1, 2\}$
- $\{x \in \mathbb{Z} \mid x < 3\} = \{\dots, -2, -1, 0, 1, 2\}$, che è infinito.
- $\{x \in \mathbb{N} \mid x^2 = 4\} = \{2\}$
- $\{x \in \mathbb{Z} \mid x^2 = 4\} = \{-2, 2\}$, perché anche $(-2)^2 = 4$.
```

```ad-warning
Dimenticare l'insieme di partenza
$\{x \mid x < 3\}$ è ambiguo finché non dici se $x$ è un naturale, un intero o un reale: le risposte sono tre insiemi diversi.
```

La proprietà caratteristica è l'unico modo pratico per descrivere molti insiemi infiniti, e il modo in cui scriverai gli insiemi di soluzioni di equazioni e disequazioni. Per esempio $\{x \in \mathbb{R} \mid 0 < x < 1\}$ descrive i numeri reali tra 0 e 1, che non si possono elencare.

## Diagrammi di Eulero-Venn

Un **diagramma di Eulero-Venn** rappresenta un insieme con una linea chiusa: gli elementi dell'insieme sono punti disegnati dentro la linea, gli oggetti che non gli appartengono sono punti fuori. Accanto a ogni punto si scrive il nome dell'elemento, e accanto alla linea il nome dell'insieme.

Quando si lavora con più insiemi, si disegna di solito un rettangolo che rappresenta l'insieme universo $U$, e dentro il rettangolo le linee chiuse dei vari insiemi. Nella figura qui sotto ci sono due insiemi $A$ e $B$: la zona in cui i due cerchi si sovrappongono contiene gli elementi che stanno sia in $A$ sia in $B$, la parte del rettangolo fuori da entrambi i cerchi contiene gli elementi di $U$ che non stanno in nessuno dei due.

```tikz
% nome: diagramma-venn-due-insiemi
% alt: Diagramma di Eulero-Venn: un rettangolo per l'insieme universo U e due cerchi che si sovrappongono per gli insiemi A e B
% svg: diagramma-venn-due-insiemi-23b0b4a7.svg 231x155
\begin{tikzpicture}
\begin{scope}[shift={(0,0)}]
\draw (-3,-2) rectangle (3,2) node[anchor=north east] {$U$};
\begin{scope}
\clip (-3,-2) rectangle (3,2);
\draw ( -1,0) circle (1.4) node[left] {$A$};
\draw (  1,0) circle (1.4) node[right] {$B$};
\end{scope}
\end{scope}
\end{tikzpicture}
```

Il diagramma è comodo per insiemi finiti con pochi elementi e per vedere a colpo d'occhio che cosa hanno in comune due o più insiemi; per questo lo userai molto con le [operazioni tra insiemi](/materiale/scuola-superiore/matematica/insiemi-e-logica/proprieta-delle-operazioni-tra-insiemi). Per un insieme infinito, come $\mathbb{N}$, si può disegnare la linea chiusa ma non tutti i punti.

## Passare da una rappresentazione all'altra

### Dalla proprietà all'elencazione

Per elencare gli elementi di un insieme descritto con una proprietà:

1. guarda da quale insieme si prendono gli elementi ($\mathbb{N}$, $\mathbb{Z}$, ...);
2. prova i candidati uno per uno, partendo dai più piccoli, e tieni quelli che soddisfano la condizione;
3. controlla gli estremi: se la condizione dice $<$ l'estremo è escluso, se dice $\le$ è incluso;
4. scrivi gli elementi trovati tra graffe, ognuno una volta.

```ad-example
Esempio 2: divisori di 12
$$A = \{x \in \mathbb{N} \mid x \text{ è un divisore di } 12\}$$
I divisori di 12 sono i numeri che dividono 12 senza resto: $1, 2, 3, 4, 6, 12$. Lo $0$ non è un divisore di 12, perché non si può dividere per 0. Quindi
$$A = \{1, 2, 3, 4, 6, 12\}$$
```

```ad-example
Esempio 3: interi con estremi
$$B = \{x \in \mathbb{Z} \mid -3 < x \le 2\}$$
Gli elementi sono interi, anche negativi. $-3$ è escluso ($<$), $2$ è incluso ($\le$):
$$B = \{-2, -1, 0, 1, 2\}$$
```

```ad-warning
Sbagliare gli estremi
$\{x \in \mathbb{N} \mid 2 < x < 6\}$ è $\{3, 4, 5\}$, non $\{2, 3, 4, 5, 6\}$. Con il segno $<$ l'estremo resta fuori, con $\le$ è dentro.
```

```ad-example
Esempio 4: una condizione con un calcolo
$$C = \{x \in \mathbb{N} \mid 2x + 1 < 9\}$$
Si provano i naturali partendo da 0: per $x = 0, 1, 2, 3$ il valore di $2x + 1$ è $1, 3, 5, 7$, tutti minori di 9; per $x = 4$ è $9$, che non è minore di 9; per $x$ più grandi il risultato cresce ancora. Quindi
$$C = \{0, 1, 2, 3\}$$
```

```ad-example
Esempio 5: un insieme vuoto
$$D = \{x \in \mathbb{N} \mid x + 5 = 2\}$$
L'unico numero che soddisfa $x + 5 = 2$ è $x = -3$, che non è un numero naturale. Nessun elemento di $\mathbb{N}$ soddisfa la condizione, quindi $D = \emptyset$.
```

### Dall'elencazione alla proprietà

Qui il lavoro è trovare che cosa hanno in comune gli elementi, e poi controllare che la proprietà scritta non faccia entrare anche altri numeri.

```ad-example
Esempio 6: multipli di 3
$$E = \{3, 6, 9, 12, 15\}$$
Sono i multipli di 3 da 3 a 15:
$$E = \{x \in \mathbb{N} \mid x \text{ è multiplo di } 3 \text{ e } 1 \le x \le 15\}$$
Serve la condizione $1 \le x$: anche $0$ è multiplo di 3 ($0 = 3 \cdot 0$), e senza quella condizione entrerebbe nell'insieme.
```

```ad-warning
Dimenticare lo 0 in $\mathbb{N}$
$\{x \in \mathbb{N} \mid x \text{ è pari e } x \le 8\}$ è $\{0, 2, 4, 6, 8\}$: lo 0 è naturale ed è pari. Se vuoi $\{2, 4, 6, 8\}$ devi aggiungere una condizione che escluda lo 0, come $x \ge 1$.
```

```ad-example
Esempio 7: quadrati
$$F = \{1, 4, 9, 16, 25\}$$
Sono i quadrati dei numeri da 1 a 5: $1^2, 2^2, 3^2, 4^2, 5^2$. Una proprietà caratteristica è
$$F = \{x \in \mathbb{N} \mid x = n^2 \text{ con } n \in \mathbb{N} \text{ e } 1 \le n \le 5\}$$
```

```ad-example
Esempio 8: numeri opposti
$$G = \{-1, 1\}$$
Sono i due numeri interi il cui quadrato è 1:
$$G = \{x \in \mathbb{Z} \mid x^2 = 1\}$$
Se scrivessi $x \in \mathbb{N}$ otterresti solo $\{1\}$.
```

Per uno stesso insieme vanno bene più proprietà diverse: $\{2, 4, 6, 8\}$ è sia $\{x \in \mathbb{N} \mid x \text{ è pari e } 1 \le x \le 9\}$ sia $\{x \in \mathbb{N} \mid x \text{ è pari e } 0 < x < 10\}$. Va bene qualunque proprietà che dia esattamente quegli elementi, né uno in più né uno in meno.

### Tra elencazione e diagramma

Per disegnare un diagramma di Eulero-Venn partendo dagli elenchi, parti dagli elementi comuni: li metti nella zona in cui le linee si sovrappongono, poi aggiungi gli elementi che stanno in un solo insieme e infine, dentro il rettangolo ma fuori da tutte le linee, quelli dell'universo che non stanno in nessun insieme. Per leggere un diagramma fai il contrario: gli elementi di un insieme sono tutti i punti dentro la sua linea, compresi quelli nella zona comune.

```ad-example
Esempio 9: dagli elenchi al diagramma
Siano $U = \{1, 2, 3, 4, 5, 6\}$, $A = \{1, 2, 3\}$ e $B = \{3, 4\}$.
- $3$ sta sia in $A$ sia in $B$: va nella zona in cui i due cerchi si sovrappongono.
- $1$ e $2$ stanno solo in $A$: vanno nella parte di $A$ fuori da $B$.
- $4$ sta solo in $B$: va nella parte di $B$ fuori da $A$.
- $5$ e $6$ non stanno né in $A$ né in $B$: vanno nel rettangolo, fuori da entrambi i cerchi.

Rileggendo il diagramma, dentro il cerchio di $A$ trovi $1, 2, 3$ e dentro quello di $B$ trovi $3, 4$: sono proprio gli elenchi di partenza.

Il diagramma che si ottiene:

```tikz
% nome: diagramma-venn-con-elementi
% alt: Diagramma di Eulero-Venn con gli elementi: 1 e 2 solo in A, 3 in A e in B, 4 solo in B, 5 e 6 fuori da entrambi gli insiemi
% svg: diagramma-venn-con-elementi-baff00d7.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\node at (-1.8,0.4) {$1$};
\node at (-1.8,-0.4) {$2$};
\node at (0,0) {$3$};
\node at (1.8,0) {$4$};
\node at (-2.6,-1.6) {$5$};
\node at (2.6,-1.6) {$6$};
\end{tikzpicture}
```
```

```ad-warning
Mettere i punti comuni in un solo cerchio
Nel diagramma di Eulero-Venn un elemento che appartiene a due insiemi va nella zona in cui le linee si sovrappongono. Se lo disegni dentro uno solo dei due cerchi, il diagramma dice che non appartiene all'altro.
```
