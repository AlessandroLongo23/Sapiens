# Prodotto cartesiano

Nella battaglia navale ogni casella ha un nome fatto di una lettera e di un numero: B7 è la casella che sta nella colonna B e nella riga 7. Con le lettere da A a J e i numeri da 1 a 10 si ottengono cento caselle, una per ogni modo di abbinare una lettera a un numero, e l'ordine è fisso: prima la lettera, poi il numero. Il prodotto cartesiano di due insiemi è l'insieme di tutti questi abbinamenti. Da qui partono le [relazioni binarie](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/relazioni-binarie) e le [funzioni](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione), e il piano cartesiano ne è l'esempio più noto. Per seguire la lezione devi sapere come si scrive un insieme, argomento della lezione [Rappresentazione degli insiemi](/materiale/scuola-superiore/matematica/insiemi-e-logica/rappresentazione-degli-insiemi).

## Coppia ordinata

Una **coppia ordinata** è formata da due elementi presi in un ordine preciso. Si scrive con le parentesi tonde, $(a, b)$: $a$ è il primo elemento della coppia e $b$ il secondo. I due elementi si chiamano anche componenti della coppia.

Due coppie ordinate sono uguali quando hanno lo stesso primo elemento e lo stesso secondo elemento:

$$
\begin{gathered}
(a, b) = (c, d) \\
\text{se e solo se } a = c \text{ e } b = d
\end{gathered}
$$

Per questo $(1, 2)$ e $(2, 1)$ sono coppie diverse: il primo elemento della prima coppia è $1$, quello della seconda è $2$. Con gli insiemi invece l'ordine non conta, e $\{1, 2\}$ e $\{2, 1\}$ sono lo stesso insieme. C'è un'altra differenza: in una coppia i due elementi possono essere uguali, e $(3, 3)$ è una coppia a tutti gli effetti, mentre $\{3, 3\}$ è l'insieme $\{3\}$, con un elemento solo. Scambiando gli elementi di una coppia $(a, b)$ si ottiene la stessa coppia solo quando $a = b$.

```ad-example
Esempio 1: due coppie uguali
Trova $x$ e $y$ in modo che valga
$$(2x - 1, 6) = (5, 3y)$$
Le due coppie sono uguali se hanno uguali i primi elementi e uguali i secondi elementi, quindi servono tutte e due le uguaglianze:
$$2x - 1 = 5 \quad \text{e} \quad 6 = 3y$$
Dalla prima $2x = 6$, cioè $x = 3$; dalla seconda $y = 2$. Controllo: con $x = 3$ e $y = 2$ la coppia a sinistra è $(5, 6)$ e quella a destra è $(5, 6)$.
```

```ad-warning
Scrivere le coppie con le graffe
La coppia ordinata si scrive con le parentesi tonde: $(1, a)$. Con le graffe, $\{1, a\}$ è un insieme di due elementi, in cui l'ordine non conta, e non è la stessa cosa.
```

## Il prodotto cartesiano di due insiemi

Il **prodotto cartesiano** di due insiemi $A$ e $B$ è l'insieme di tutte le coppie ordinate che hanno il primo elemento in $A$ e il secondo elemento in $B$:

$$
\begin{gathered}
A \times B = \{(a, b) \mid \\
a \in A \text{ e } b \in B\}
\end{gathered}
$$

Si legge "$A$ per $B$" oppure "$A$ cartesiano $B$". Per elencare le coppie senza dimenticarne nessuna si procede con ordine:

1. prendi il primo elemento di $A$ e abbinalo, uno alla volta, a tutti gli elementi di $B$;
2. fai lo stesso con il secondo elemento di $A$, poi con il terzo, fino all'ultimo;
3. scrivi tutte le coppie tra graffe, tenendo sempre l'elemento di $A$ al primo posto.

```ad-example
Esempio 2: elencare le coppie
Siano $A = \{1, 2, 3\}$ e $B = \{a, b\}$. Si abbina $1$ ad $a$ e a $b$, poi $2$, poi $3$:
$$
\begin{gathered}
A \times B = \{(1, a), (1, b), \\
(2, a), (2, b), \\
(3, a), (3, b)\}
\end{gathered}
$$
Le coppie sono $6$: ognuno dei $3$ elementi di $A$ compare in $2$ coppie, una per ogni elemento di $B$.
```

```ad-warning
Scambiare l'ordine dentro le coppie
In $A \times B$ il primo elemento viene sempre da $A$ e il secondo da $B$. Con gli insiemi dell'esempio 2, la coppia $(a, 1)$ non appartiene ad $A \times B$, perché $a$ non è un elemento di $A$.
```

## Quattro modi di rappresentarlo

Il prodotto cartesiano di due insiemi finiti si può scrivere come elenco di coppie, come nell'esempio 2, oppure disegnare in tre modi diversi. Negli esercizi ti verrà chiesto di passare dall'uno all'altro, e ciascuno fa vedere qualcosa che gli altri nascondono.

### Tabella a doppia entrata

Nella tabella a doppia entrata gli elementi del primo insieme stanno sulle righe e quelli del secondo sulle colonne; nella casella in cui si incontrano la riga di $a$ e la colonna di $b$ si scrive la coppia $(a, b)$. Questa è la tabella di $A \times B$ dell'esempio 2:

| $A \times B$ | $a$ | $b$ |
|---|---|---|
| $1$ | $(1, a)$ | $(1, b)$ |
| $2$ | $(2, a)$ | $(2, b)$ |
| $3$ | $(3, a)$ | $(3, b)$ |

Le righe sono tante quanti gli elementi di $A$ e le colonne tante quanti gli elementi di $B$: la tabella fa vedere subito quante sono le coppie, $3 \cdot 2 = 6$.

### Diagramma a frecce

Nel diagramma a frecce si disegnano i due insiemi con i loro elementi, $A$ a sinistra e $B$ a destra, e ogni coppia $(a, b)$ è una freccia che parte da $a$ e arriva a $b$. Nel prodotto cartesiano ci sono tutte le frecce possibili: da ogni elemento di $A$ parte una freccia verso ciascun elemento di $B$.

```tikz
% nome: prodotto-cartesiano-diagramma-frecce
% alt: Diagramma a frecce del prodotto cartesiano di A uguale a 1, 2, 3 e B uguale ad a, b: da ciascuno dei tre elementi di A partono due frecce, una verso a e una verso b, per un totale di sei frecce
% svg: prodotto-cartesiano-diagramma-frecce-f69b3e63.svg 178x169
\begin{tikzpicture}
\draw (0,0) ellipse (0.7 and 1.9);
\draw (3.2,0) ellipse (0.7 and 1.9);
\node at (0,2.25) {$A$};
\node at (3.2,2.25) {$B$};
\node (l1) at (0,0.9) {$1$};
\node (l2) at (0,0) {$2$};
\node (l3) at (0,-0.9) {$3$};
\node (ra) at (3.2,0.7) {$a$};
\node (rb) at (3.2,-0.7) {$b$};
\draw[->, shorten >=2pt, shorten <=2pt] (l1) -- (ra);
\draw[->, shorten >=2pt, shorten <=2pt] (l1) -- (rb);
\draw[->, shorten >=2pt, shorten <=2pt] (l2) -- (ra);
\draw[->, shorten >=2pt, shorten <=2pt] (l2) -- (rb);
\draw[->, shorten >=2pt, shorten <=2pt] (l3) -- (ra);
\draw[->, shorten >=2pt, shorten <=2pt] (l3) -- (rb);
\end{tikzpicture}
```

Con insiemi di qualche elemento in più le frecce diventano troppe e il disegno si confonde; il diagramma a frecce serve soprattutto quando si prendono solo alcune coppie, come nelle [relazioni binarie](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/relazioni-binarie).

### Reticolo di punti

Si disegnano due semirette perpendicolari, come gli assi di un grafico: sulla semiretta orizzontale si segnano gli elementi di $A$, su quella verticale gli elementi di $B$. Da ogni elemento si traccia una linea, verticale o orizzontale, e ogni coppia $(a, b)$ è il punto in cui la linea che parte da $a$ incontra quella che parte da $b$. I punti formano un reticolo, come le caselle della battaglia navale.

```tikz
% nome: prodotto-cartesiano-reticolo
% alt: Reticolo del prodotto cartesiano di A uguale a 1, 2, 3 e B uguale ad a, b: sull'asse orizzontale gli elementi 1, 2, 3, sull'asse verticale a e b, e sei punti nelle intersezioni, ciascuno con il nome della sua coppia
% svg: prodotto-cartesiano-reticolo-2f65ee4b.svg 237x151
\begin{tikzpicture}
\draw[->] (0,0) -- (5.4,0);
\draw[->] (0,0) -- (0,3.2);
\foreach \x in {1,2,3} {
  \draw[gray!50, dashed] (1.5*\x,0) -- (1.5*\x,2.6);
  \node[below] at (1.5*\x,0) {$\x$};
}
\foreach \y/\l in {1/a,2/b} {
  \draw[gray!50, dashed] (0,1.1*\y) -- (5.0,1.1*\y);
  \node[left] at (0,1.1*\y) {$\l$};
}
\foreach \x in {1,2,3} {
  \foreach \y/\l in {1/a,2/b} {
    \fill (1.5*\x,1.1*\y) circle (2.2pt);
    \node[above right, inner sep=1.5pt, font=\small] at (1.5*\x,1.1*\y) {$(\x, \l)$};
  }
}
\node[below] at (5.4,0) {$A$};
\node[left] at (0,3.2) {$B$};
\end{tikzpicture}
```

Il primo elemento della coppia dice in quale colonna sta il punto, il secondo in quale riga: la coppia $(1, b)$ è il punto nella colonna di $1$ e nella riga di $b$.

## Numero di elementi del prodotto

Se $A$ ha $m$ elementi e $B$ ne ha $n$, ogni elemento di $A$ forma $n$ coppie, una per ogni elemento di $B$, e gli elementi di $A$ sono $m$: le coppie in tutto sono $m \cdot n$. Con la cardinalità, cioè il numero degli elementi di un insieme (spiegata in [Prime definizioni](/materiale/scuola-superiore/matematica/insiemi-e-logica/prime-definizioni)):

$$|A \times B| = |A| \cdot |B|$$

È il numero delle caselle della tabella a doppia entrata, righe per colonne. Nella battaglia navale le lettere sono $10$ e i numeri sono $10$, quindi le caselle sono $10 \cdot 10 = 100$.

```ad-example
Esempio 3: quanti menù diversi
Una mensa offre ogni giorno 3 primi (pasta, riso, minestra) e 4 secondi (pollo, pesce, uova, formaggio). Un menù è formato da un primo e da un secondo. Quanti menù diversi si possono comporre?

Chiama $P$ l'insieme dei primi e $S$ quello dei secondi. Ogni menù è una coppia (primo, secondo), cioè un elemento di $P \times S$:
$$|P \times S| = 3 \cdot 4 = 12$$
I menù diversi sono $12$.
```

```ad-warning
Sommare invece di moltiplicare
Con 3 primi e 4 secondi i menù non sono $3 + 4 = 7$: ognuno dei 3 primi si abbina con tutti e 4 i secondi, e i menù sono $3 \cdot 4 = 12$. La somma conta i piatti, non i menù.
```

La formula si usa anche al contrario: se sai quanti elementi hanno il prodotto e uno dei due insiemi, trovi quanti ne ha l'altro. Se $|A \times B| = 15$ e $|A| = 5$, allora $5 \cdot |B| = 15$ e $|B| = 3$.

## Il prodotto cartesiano non è commutativo

Scambiando i due insiemi, in $B \times A$ al primo posto va l'elemento di $B$. Con $A = \{1, 2, 3\}$ e $B = \{a, b\}$ dell'esempio 2:

$$
\begin{gathered}
B \times A = \{(a, 1), (a, 2), \\
(a, 3), (b, 1), \\
(b, 2), (b, 3)\}
\end{gathered}
$$

Nessuna di queste coppie sta in $A \times B$, quindi $A \times B \neq B \times A$: il prodotto cartesiano non è commutativo. I due prodotti hanno però lo stesso numero di elementi, perché $|A| \cdot |B| = |B| \cdot |A|$.

$A \times B$ e $B \times A$ sono uguali solo in due casi: quando $A = B$, perché allora sono lo stesso prodotto, e quando uno dei due insiemi è vuoto, perché allora sono vuoti tutti e due (lo vedi più avanti in questa lezione).

```ad-warning
Scambiare $A \times B$ con $B \times A$
Avere lo stesso numero di elementi non vuol dire avere gli stessi elementi. $A \times B$ e $B \times A$ hanno sempre la stessa cardinalità, ma le loro coppie hanno gli elementi in ordine inverso.
```

## Il prodotto di un insieme per sé stesso

Si può fare il prodotto cartesiano di un insieme per sé stesso: $A \times A$ è l'insieme delle coppie ordinate con tutti e due gli elementi in $A$, e si scrive anche $A^2$ (si legge "$A$ due" o "$A$ al quadrato"). Il numero di elementi è

$$|A \times A| = |A|^2$$

Con $A = \{1, 2, 3\}$ le coppie sono $3^2 = 9$:

$$
\begin{gathered}
A \times A = \{(1, 1), (1, 2), (1, 3), \\
(2, 1), (2, 2), (2, 3), \\
(3, 1), (3, 2), (3, 3)\}
\end{gathered}
$$

In $A \times A$ ci sono sia $(1, 2)$ sia $(2, 1)$, e sono due elementi diversi. Nel reticolo sono due punti distinti, simmetrici rispetto alla diagonale su cui stanno le coppie con i due elementi uguali, $(1, 1)$, $(2, 2)$ e $(3, 3)$.

```tikz
% nome: quadrato-cartesiano-reticolo
% alt: Reticolo di A per A con A uguale a 1, 2, 3: nove punti, i tre punti della diagonale sono le coppie con elementi uguali, e i punti (1, 2) e (2, 1) sono distinti e simmetrici rispetto alla diagonale
% svg: quadrato-cartesiano-reticolo-a8675526.svg 199x189
\begin{tikzpicture}
\draw[->] (0,0) -- (4.2,0);
\draw[->] (0,0) -- (0,4.2);
\foreach \k in {1,2,3} {
  \draw[gray!50, dashed] (1.2*\k,0) -- (1.2*\k,3.8);
  \draw[gray!50, dashed] (0,1.2*\k) -- (3.8,1.2*\k);
  \node[below] at (1.2*\k,0) {$\k$};
  \node[left] at (0,1.2*\k) {$\k$};
}
\draw[blue!40, thick] (0.6,0.6) -- (3.9,3.9);
\foreach \x in {1,2,3} {
  \foreach \y in {1,2,3} {
    \fill (1.2*\x,1.2*\y) circle (2.2pt);
  }
}
\node[above left, inner sep=2pt, font=\small] at (1.2,2.4) {$(1, 2)$};
\node[below right, inner sep=2pt, font=\small] at (2.4,1.2) {$(2, 1)$};
\node[right, font=\small] at (3.7,3.5) {$(3, 3)$};
\node[below] at (4.2,0) {$A$};
\node[left] at (0,4.2) {$A$};
\end{tikzpicture}
```

Il prodotto di un insieme per sé stesso si fa anche con gli insiemi infiniti. $\mathbb{N} \times \mathbb{N}$ è l'insieme delle coppie di numeri naturali, e nel reticolo diventa una griglia di punti che continua senza fine verso destra e verso l'alto. $\mathbb{R} \times \mathbb{R}$, cioè $\mathbb{R}^2$, è l'insieme delle coppie di numeri reali: ogni coppia $(x, y)$ corrisponde a un punto del piano, e questo è il [piano cartesiano](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio), che prende il nome dallo stesso Cartesio (René Descartes) del prodotto cartesiano. Qui la regola che dice che $(1, 2)$ e $(2, 1)$ sono diverse diventa visibile: sono due punti diversi del piano.

## Prodotto con l'insieme vuoto

Se uno dei due insiemi è vuoto, non si può formare nessuna coppia, perché manca l'elemento da mettere al primo o al secondo posto. Per ogni insieme $A$:

$$A \times \emptyset = \emptyset \times A = \emptyset$$

Il risultato va d'accordo con la formula del numero di elementi: $|A| \cdot 0 = 0$.

```ad-warning
Pensare che $A \times \emptyset$ sia $A$
Nell'unione l'insieme vuoto non cambia niente, $A \cup \emptyset = A$. Nel prodotto cartesiano invece lo annulla, come lo zero nella moltiplicazione: $\{1, 2, 3\} \times \emptyset = \emptyset$.
```

```ad-note
Prodotto di tre insiemi
Allo stesso modo si definisce il prodotto di tre insiemi: $A \times B \times C$ è l'insieme delle terne ordinate $(a, b, c)$ con $a \in A$, $b \in B$ e $c \in C$. Il numero di elementi è $|A| \cdot |B| \cdot |C|$: aggiungendo al menù dell'esempio 3 due dolci, i pasti completi diventano $3 \cdot 4 \cdot 2 = 24$.
```

## Esempi svolti

```ad-example
Esempio 4: insiemi descritti con una proprietà
Siano $A = \{x \in \mathbb{N} \mid x < 2\}$ e $B = \{x \in \mathbb{Z} \mid -1 \le x \le 1\}$. Scrivi $A \times B$ e di' se le coppie $(1, -1)$, $(-1, 1)$ e $(2, 0)$ gli appartengono.

Prima si elencano gli elementi: $A = \{0, 1\}$ e $B = \{-1, 0, 1\}$. Il prodotto ha $2 \cdot 3 = 6$ coppie:
$$
\begin{gathered}
A \times B = \{(0, -1), (0, 0), \\
(0, 1), (1, -1), \\
(1, 0), (1, 1)\}
\end{gathered}
$$
- $(1, -1) \in A \times B$: $1 \in A$ e $-1 \in B$.
- $(-1, 1) \notin A \times B$: il primo elemento $-1$ non appartiene ad $A$, anche se appartiene a $B$.
- $(2, 0) \notin A \times B$: $2$ non appartiene ad $A$.
```

```ad-example
Esempio 5: le coppie che rispettano una condizione
Siano $A = \{1, 2, 3\}$ e $B = \{1, 2, 3, 4\}$. Quali coppie di $A \times B$ hanno la somma dei due elementi uguale a $5$?

Il prodotto ha $3 \cdot 4 = 12$ coppie. Per ogni elemento $a$ di $A$ il secondo elemento deve essere $5 - a$, e deve stare in $B$:
- $a = 1$: serve $4$, che sta in $B$, quindi $(1, 4)$;
- $a = 2$: serve $3$, quindi $(2, 3)$;
- $a = 3$: serve $2$, quindi $(3, 2)$.

Le coppie sono $(1, 4)$, $(2, 3)$ e $(3, 2)$. Anche $4 + 1 = 5$, ma la coppia $(4, 1)$ non appartiene ad $A \times B$, perché $4$ non è un elemento di $A$. Un insieme di coppie scelte dentro un prodotto cartesiano con una regola come questa si chiama [relazione binaria](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/relazioni-binarie).
```

```ad-example
Esempio 6: dal prodotto ai due insiemi
Sapendo che
$$
\begin{gathered}
A \times B = \{(2, p), (2, q), \\
(5, p), (5, q), \\
(7, p), (7, q)\}
\end{gathered}
$$
trova $A$ e $B$.

Gli elementi di $A$ sono i primi elementi delle coppie e quelli di $B$ i secondi, ognuno scritto una volta:
$$A = \{2, 5, 7\} \qquad B = \{p, q\}$$
Controllo: $|A| \cdot |B| = 3 \cdot 2 = 6$, proprio il numero di coppie date.
```

```ad-example
Esempio 7: due prodotti con un elemento in comune
Siano $A = \{1, 2\}$ e $B = \{2, 3\}$. Scrivi $A \times B$ e $B \times A$ e trova le coppie che stanno in tutti e due i prodotti.

$$
\begin{gathered}
A \times B = \{(1, 2), (1, 3), \\
(2, 2), (2, 3)\} \\[4pt]
B \times A = \{(2, 1), (2, 2), \\
(3, 1), (3, 2)\}
\end{gathered}
$$
Le coppie $(1, 2)$ e $(2, 1)$ contengono gli stessi numeri ma in ordine diverso, quindi sono diverse; lo stesso vale per $(2, 3)$ e $(3, 2)$. L'unica coppia comune è $(2, 2)$:
$$(A \times B) \cap (B \times A) = \{(2, 2)\}$$
Una coppia comune deve avere il primo elemento sia in $A$ sia in $B$, e anche il secondo: l'unico elemento comune ai due insiemi è $2$, quindi resta solo $(2, 2)$.
```

```ad-example
Esempio 8: contare senza elencare
Un insieme $A$ ha $4$ elementi. Quanti elementi ha $A \times A$? E se $|A \times A| = 49$, quanti elementi ha $A$?

Nel primo caso $|A \times A| = 4^2 = 16$. Nel secondo serve un numero naturale che al quadrato dia $49$: è $7$, quindi $|A| = 7$.
```

## Errori frequenti

```ad-warning
Confondere il prodotto cartesiano con l'intersezione o con l'unione
Il prodotto cartesiano non contiene gli elementi di $A$ e di $B$, ma coppie: $\{1, 2\} \times \{3\} = \{(1, 3), (2, 3)\}$, non $\{1, 2, 3\}$. Il simbolo $\times$ si legge "per", come nella moltiplicazione, e il numero di elementi si ottiene proprio moltiplicando.
```
