# Differenza e complementare

In una classe, gli studenti che giocano a calcio ma non fanno nuoto si trovano partendo da chi gioca a calcio e togliendo chi fa anche nuoto: è la differenza tra due insiemi. Gli studenti che non fanno nessuno sport sono invece tutti quelli della classe tranne gli sportivi: è il complementare. Qui trovi le due operazioni, il modo di contarne gli elementi e le leggi di De Morgan, che legano il complementare all'[unione](/materiale/scuola-superiore/matematica/insiemi-e-logica/unione-insiemistica) e all'[intersezione](/materiale/scuola-superiore/matematica/insiemi-e-logica/intersezione-insiemistica). Il quadro di tutte le operazioni è in [Proprietà delle operazioni tra insiemi](/materiale/scuola-superiore/matematica/insiemi-e-logica/proprieta-delle-operazioni-tra-insiemi).

## Differenza tra due insiemi

Dati due insiemi $A$ e $B$, la **differenza** tra $A$ e $B$ è l'insieme degli elementi che appartengono ad $A$ e non appartengono a $B$. Si scrive $A \setminus B$ e si legge "$A$ meno $B$"; molti libri la scrivono anche $A - B$.

$$A \setminus B = \{x \mid x \in A \text{ e } x \notin B\}$$

Per calcolare la differenza di due insiemi scritti per elencazione, parti dagli elementi di $A$ e cancella quelli che stanno anche in $B$: quelli che restano formano $A \setminus B$. Gli elementi di $B$ che non stanno in $A$ non entrano nel conto, né per aggiungere né per togliere.

```ad-example
Esempio 1: le due differenze
Siano $A = \{1, 2, 3, 4, 5\}$ e $B = \{4, 5, 6, 7\}$.

Da $A$ si tolgono $4$ e $5$, che stanno anche in $B$:
$$A \setminus B = \{1, 2, 3\}$$
Da $B$ si tolgono gli elementi che stanno anche in $A$, cioè di nuovo $4$ e $5$:
$$B \setminus A = \{6, 7\}$$
I due risultati sono diversi: la differenza non è commutativa, e l'ordine in cui scrivi gli insiemi conta.
```

```ad-warning
Mettere nella differenza gli elementi del secondo insieme
In $A \setminus B$ ci sono solo elementi di $A$. Con $A = \{1, 2\}$ e $B = \{2, 3\}$ si ha $A \setminus B = \{1\}$: il $3$ sta in $B$, non in $A$, e nella differenza non entra. Scrivere $\{1, 3\}$ vuol dire aver preso gli elementi che stanno in uno solo dei due insiemi, che è un'altra operazione.
```

Nel diagramma di Eulero-Venn, $A \setminus B$ è la parte del cerchio di $A$ che resta fuori dal cerchio di $B$. La zona comune ai due cerchi non ne fa parte, e nemmeno la parte di $B$ fuori da $A$, che è invece $B \setminus A$.

```tikz
% nome: differenza-a-meno-b-venn
% alt: Differenza A meno B: nel diagramma di Eulero-Venn è colorata la parte del cerchio A che resta fuori dal cerchio B
% svg: differenza-a-meno-b-venn-8e2a76be.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (0,0.98) arc[start angle=44.42, end angle=315.58, radius=1.4] arc[start angle=224.42, end angle=135.58, radius=1.4] -- cycle;
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\end{tikzpicture}
```

Siccome si parte da $A$ e si toglie qualcosa, la differenza è sempre contenuta nel primo insieme: $A \setminus B \subseteq A$.

```ad-example
Esempio 2: insiemi descritti da una proprietà
Siano $A$ l'insieme dei numeri naturali pari e $B$ quello dei multipli di $4$:
$$
\begin{gathered}
A = \{0, 2, 4, 6, 8, 10, \dots\} \\
B = \{0, 4, 8, 12, \dots\}
\end{gathered}
$$
$A \setminus B$ contiene i numeri pari che non sono multipli di $4$:
$$A \setminus B = \{2, 6, 10, 14, \dots\}$$
Per $B \setminus A$ bisogna cercare i multipli di $4$ che non sono pari, ma ogni multiplo di $4$ è pari: non ce n'è nessuno, e $B \setminus A = \emptyset$.
```

### Casi particolari

Alcune differenze si calcolano senza guardare gli elementi, qualunque sia l'insieme $A$:

- $A \setminus \emptyset = A$, perché dall'insieme vuoto non c'è niente da togliere;
- $A \setminus A = \emptyset$, perché ogni elemento di $A$ sta in $A$ e viene tolto;
- $\emptyset \setminus A = \emptyset$, perché dal vuoto non si ricava niente;
- se $A$ e $B$ sono disgiunti, cioè $A \cap B = \emptyset$, allora $A \setminus B = A$: nessun elemento di $A$ sta in $B$, quindi non si toglie niente.

Il caso dell'Esempio 2, in cui una differenza viene vuota, ha una regola precisa:

$$A \setminus B = \emptyset \quad \text{se e solo se} \quad A \subseteq B$$

Se ogni elemento di $A$ sta in $B$, togliendoli non resta niente. Viceversa, se non resta niente, ogni elemento di $A$ è stato tolto, quindi stava in $B$. L'inclusione $A \subseteq B$ è spiegata in [Sottoinsiemi e uguaglianza](/materiale/scuola-superiore/matematica/insiemi-e-logica/sottoinsiemi-e-uguaglianza).

```ad-example
Esempio 3: un insieme contenuto nell'altro
Siano $A = \{x \in \mathbb{N} \mid x < 4\}$ e $B = \{x \in \mathbb{N} \mid x < 7\}$. Per elencazione, ricordando che $0 \in \mathbb{N}$:
$$
\begin{gathered}
A = \{0, 1, 2, 3\} \\
B = \{0, 1, 2, 3, 4, 5, 6\}
\end{gathered}
$$
Ogni elemento di $A$ sta in $B$, quindi $A \subseteq B$ e
$$A \setminus B = \emptyset$$
Nell'altro ordine restano gli elementi di $B$ che non stanno in $A$:
$$B \setminus A = \{4, 5, 6\}$$
```

```ad-warning
Scrivere $0$ o $\{0\}$ al posto di $\emptyset$
La differenza tra insiemi è un insieme. $A \setminus A$ è l'insieme vuoto $\emptyset$, non il numero $0$, e neppure $\{0\}$, che è un insieme con un elemento.
```

### Numero di elementi della differenza

Il numero di elementi di un insieme finito $A$ si indica con $|A|$ (la cardinalità, in [Prime definizioni](/materiale/scuola-superiore/matematica/insiemi-e-logica/prime-definizioni)). Gli elementi di $A$ si dividono in due gruppi senza elementi in comune: quelli che stanno anche in $B$, cioè $A \cap B$, e quelli che non ci stanno, cioè $A \setminus B$. Quindi $|A| = |A \setminus B| + |A \cap B|$, e:

$$|A \setminus B| = |A| - |A \cap B|$$

Se $B \subseteq A$, l'intersezione $A \cap B$ è $B$ stesso e la formula diventa $|A \setminus B| = |A| - |B|$. Solo in questo caso.

```ad-example
Esempio 4: strumento e coro
In una classe $14$ studenti suonano uno strumento, $9$ cantano nel coro e $5$ fanno tutte e due le cose. Quanti suonano ma non cantano?

Chiamiamo $S$ l'insieme di chi suona e $K$ quello di chi canta. Chi suona e non canta sta in $S \setminus K$, e chi fa entrambe le cose sta in $S \cap K$:
$$|S \setminus K| = 14 - 5 = 9$$
```

```ad-warning
Sottrarre $|B|$ invece di $|A \cap B|$
Nell'Esempio 4 il conto $14 - 9 = 5$ è sbagliato: tra i $9$ del coro ci sono anche studenti che non suonano, e quelli non vanno tolti da $S$. In generale $|A \setminus B| = |A| - |B|$ vale solo quando $B \subseteq A$.
```

## Complementare di un insieme

Quando tutti gli insiemi di cui si parla sono presi dentro un insieme universo $U$, il **complementare** di $A$ è l'insieme degli elementi di $U$ che non appartengono ad $A$. Si scrive $\overline{A}$ e si legge "complementare di $A$"; alcuni libri scrivono $A^c$ oppure $\complement_U A$.

$$
\begin{gathered}
\overline{A} = \{x \in U \mid x \notin A\} \\
\overline{A} = U \setminus A
\end{gathered}
$$

Nel diagramma il complementare di $A$ è tutto il rettangolo dell'universo tranne il cerchio di $A$:

```tikz
% nome: complementare-rispetto-universo-venn
% alt: Complementare di A: nel diagramma di Eulero-Venn è colorato tutto il rettangolo dell'universo U tranne il cerchio A
% svg: complementare-rispetto-universo-venn-347c6c62.svg 231x155
\begin{tikzpicture}
\fill[blue!20, even odd rule] (-3,-2) rectangle (3,2) (-0.5,0) circle (1.4);
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\draw (-0.5,0) circle (1.4);
\node at (-0.5,0) {$A$};
\node at (1.9,-1.2) {$\overline{A}$};
\end{tikzpicture}
```

Siccome $\overline{A} = U \setminus A$ e $A$ è contenuto in $U$, il numero di elementi del complementare si ricava dalla formula della differenza:

$$|\overline{A}| = |U| - |A|$$

```ad-example
Esempio 5: numeri pari fino a 10
Sia $U = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}$ e sia $A$ l'insieme dei numeri pari di $U$, cioè $A = \{2, 4, 6, 8, 10\}$. Il complementare contiene i numeri di $U$ che non sono pari:
$$\overline{A} = \{1, 3, 5, 7, 9\}$$
Controllo con il numero di elementi: $|\overline{A}| = 10 - 5 = 5$.
```

### Il complementare dipende dall'universo

Lo stesso insieme ha complementari diversi in universi diversi. Se $A = \{2, 4\}$, rispetto a $U = \{1, 2, 3, 4\}$ il complementare è $\{1, 3\}$, mentre rispetto a $U = \{1, 2, 3, 4, 5, 6\}$ è $\{1, 3, 5, 6\}$.

```ad-example
Esempio 6: il complementare dei numeri pari
Sia $P$ l'insieme dei numeri pari. Il suo complementare cambia con l'universo.

- In $\mathbb{N}$: $\overline{P} = \{1, 3, 5, 7, \dots\}$, i naturali dispari.
- In $\mathbb{Z}$: $\overline{P} = \{\dots, -3, -1, 1, 3, \dots\}$, i dispari, anche negativi.
- In $\mathbb{Q}$: $\overline{P}$ contiene i dispari e tutte le frazioni come $\frac{1}{2}$, che non sono né pari né dispari. Qui il complementare dei pari non è l'insieme dei dispari.
```

```ad-warning
Calcolare il complementare senza guardare l'universo
Il complementare di $\{2, 4\}$ non esiste finché non sai qual è $U$. Prima di calcolarlo, scrivi l'universo per esteso, e nei problemi chiediti chi è "tutti": la classe, la scuola, i numeri da 1 a 10.
```

### Complementare rispetto a un insieme

Si può prendere il complementare anche rispetto a un insieme diverso dall'universo. Se $B$ è contenuto in $A$, il **complementare di $B$ rispetto ad $A$** è l'insieme degli elementi di $A$ che non stanno in $B$:

$$\complement_A B = A \setminus B$$

Per esempio, se $A$ è l'insieme delle lettere della parola "matematica", cioè $A = \{m, a, t, e, i, c\}$, e $B = \{a, e, i\}$ è l'insieme delle sue vocali, allora $\complement_A B = \{m, t, c\}$, l'insieme delle consonanti. Il complementare rispetto all'universo è il caso in cui al posto di $A$ c'è $U$: $\overline{A} = \complement_U A$.

```tikz
% nome: complementare-rispetto-insieme-venn
% alt: Complementare di B rispetto ad A: il cerchio B è dentro il cerchio A ed è colorata la parte di A che resta fuori da B
% svg: complementare-rispetto-insieme-venn-573e2216.svg 141x140
\begin{tikzpicture}
\fill[blue!20, even odd rule] (0,0) circle (1.8) (0.5,0) circle (0.8);
\draw (0,0) circle (1.8);
\draw (0.5,0) circle (0.8);
\node at (-1.6,1.45) {$A$};
\node at (0.5,0) {$B$};
\node at (-0.95,0) {$A \setminus B$};
\end{tikzpicture}
```

### Proprietà del complementare

Per ogni insieme $A$ contenuto nell'universo $U$ valgono queste uguaglianze:

$$
\begin{gathered}
A \cup \overline{A} = U \qquad A \cap \overline{A} = \emptyset \\
\overline{\overline{A}} = A \qquad \overline{U} = \emptyset \qquad \overline{\emptyset} = U
\end{gathered}
$$

Ogni elemento di $U$ o sta in $A$ o sta fuori da $A$: per questo $A$ e $\overline{A}$ insieme danno tutto l'universo, e non hanno elementi in comune. Il complementare del complementare, detto doppio complementare, è di nuovo $A$: ciò che sta fuori da ciò che sta fuori da $A$ è $A$ stesso. Nell'Esempio 5, $A \cup \overline{A}$ contiene tutti i numeri da $1$ a $10$ e $A \cap \overline{A} = \emptyset$, perché nessun numero è pari e dispari insieme.

## Differenza e complementare insieme

Un elemento sta in $A \setminus B$ se sta in $A$ e non sta in $B$, cioè se sta in $A$ e in $\overline{B}$. Quindi ogni differenza si può scrivere come un'intersezione:

$$A \setminus B = A \cap \overline{B}$$

Nel diagramma della differenza lo vedi subito: la zona colorata sta dentro il cerchio di $A$ e fuori dal cerchio di $B$. Questa scrittura permette di usare per la differenza le proprietà dell'intersezione.

```ad-example
Esempio 7: la differenza come intersezione
Siano $U = \{1, 2, \dots, 10\}$, $A = \{2, 4, 6, 8, 10\}$ i numeri pari e $B = \{3, 6, 9\}$ i multipli di $3$.

Da $A$ si toglie il $6$, l'unico elemento che sta anche in $B$:
$$A \setminus B = \{2, 4, 8, 10\}$$
Ora con il complementare: $\overline{B} = \{1, 2, 4, 5, 7, 8, 10\}$, e gli elementi comuni ad $A$ e $\overline{B}$ sono
$$A \cap \overline{B} = \{2, 4, 8, 10\}$$
I due risultati coincidono.
```

## Leggi di De Morgan

Le leggi di De Morgan dicono come si calcola il complementare di un'unione e di un'intersezione:

$$
\begin{gathered}
\overline{A \cup B} = \overline{A} \cap \overline{B} \\
\overline{A \cap B} = \overline{A} \cup \overline{B}
\end{gathered}
$$

Passando al complementare, l'unione diventa intersezione, l'intersezione diventa unione, e ogni insieme viene sostituito dal suo complementare.

La prima legge si capisce così: un elemento che non sta in $A \cup B$ non sta in nessuno dei due insiemi, quindi non sta in $A$ e non sta in $B$, cioè sta sia in $\overline{A}$ sia in $\overline{B}$. Nel diagramma, $\overline{A \cup B}$ è la zona del rettangolo fuori da tutti e due i cerchi. $\overline{A}$ è tutto ciò che sta fuori dal cerchio di $A$, $\overline{B}$ tutto ciò che sta fuori dal cerchio di $B$, e la parte che hanno in comune è ancora la zona fuori da entrambi i cerchi.

```tikz
% nome: complementare-unione-de-morgan-venn
% alt: Complementare dell'unione di A e B: nel diagramma di Eulero-Venn è colorata la parte del rettangolo che resta fuori da tutti e due i cerchi
% svg: complementare-unione-de-morgan-venn-6e877187.svg 231x155
\begin{tikzpicture}
\fill[blue!20, even odd rule] (-3,-2) rectangle (3,2) (0,0.98) arc[start angle=44.42, end angle=315.58, radius=1.4] arc[start angle=-135.58, end angle=135.58, radius=1.4] -- cycle;
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\end{tikzpicture}
```

La seconda legge funziona allo stesso modo: un elemento che non sta in $A \cap B$ manca da almeno uno dei due insiemi, quindi sta fuori da $A$ oppure fuori da $B$, cioè in $\overline{A} \cup \overline{B}$. Nel diagramma è tutto il rettangolo tranne la zona comune ai due cerchi.

```tikz
% nome: complementare-intersezione-de-morgan-venn
% alt: Complementare dell'intersezione di A e B: nel diagramma di Eulero-Venn è colorato tutto il rettangolo tranne la zona comune ai cerchi A e B
% svg: complementare-intersezione-de-morgan-venn-30699f5e.svg 231x155
\begin{tikzpicture}
\fill[blue!20, even odd rule] (-3,-2) rectangle (3,2) (0,-0.98) arc[start angle=-44.42, end angle=44.42, radius=1.4] arc[start angle=135.58, end angle=224.42, radius=1.4] -- cycle;
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\end{tikzpicture}
```

Prova a verificare tu le due leggi. Colora il primo membro toccando le zone del primo diagramma e premi «Controlla»; nel secondo il secondo membro si costruisce a passi, tratteggiando $\overline{A}$ e $\overline{B}$ uno sopra l'altro. Con lo stesso diagramma puoi controllare anche $A \setminus B = A \cap \overline{B}$ e la differenza simmetrica della nota più avanti.

```interattivo
% nome: venn-de-morgan-colora
% alt: Due diagrammi di Eulero-Venn affiancati per le leggi di De Morgan, per la differenza scritta come intersezione e per la differenza simmetrica. Nel primo lo studente colora le zone del primo membro, per esempio il complementare di A ∪ B, e le controlla: le zone sbagliate hanno una croce. Nel secondo il secondo membro si costruisce a passi, tratteggiando il complementare di A e quello di B e poi colorando la zona dove i tratteggi si incrociano, che è la stessa zona del primo
```

Le stesse leggi le usi quando parli. "Non è vero che il numero è pari o multiplo di 3" vuol dire "il numero non è pari e non è multiplo di 3"; "non è vero che il numero è pari e multiplo di 3" vuol dire "il numero non è pari oppure non è multiplo di 3". La versione con le proposizioni è nella lezione [Proposizioni e connettivi logici](/materiale/scuola-superiore/matematica/insiemi-e-logica/proposizioni-e-connettivi-logici).

```ad-example
Esempio 8: verificare le leggi di De Morgan
Con $U = \{1, 2, \dots, 10\}$, $A = \{2, 4, 6, 8, 10\}$ e $B = \{3, 6, 9\}$, come nell'Esempio 7, verifica le due leggi.

Prima legge. $A \cup B = \{2, 3, 4, 6, 8, 9, 10\}$, e i numeri di $U$ che restano fuori sono
$$\overline{A \cup B} = \{1, 5, 7\}$$
Dall'altra parte $\overline{A} = \{1, 3, 5, 7, 9\}$ e $\overline{B} = \{1, 2, 4, 5, 7, 8, 10\}$, che hanno in comune
$$\overline{A} \cap \overline{B} = \{1, 5, 7\}$$
Seconda legge. $A \cap B = \{6\}$, quindi $\overline{A \cap B}$ contiene tutti i numeri di $U$ tranne il $6$. Unendo $\overline{A}$ e $\overline{B}$ si trovano anche lì tutti i numeri da $1$ a $10$ tranne il $6$, che non sta in nessuno dei due:
$$\overline{A} \cup \overline{B} = U \setminus \{6\}$$
In tutti e due i casi i membri coincidono.
```

```ad-warning
Portare la sbarra su ogni insieme senza cambiare l'operazione
$\overline{A \cup B}$ non è $\overline{A} \cup \overline{B}$. Nell'Esempio 8, $\overline{A \cup B}$ ha $3$ elementi, mentre $\overline{A} \cup \overline{B}$ ne ha $9$. Quando la sbarra si spezza sui due insiemi, $\cup$ diventa $\cap$ e $\cap$ diventa $\cup$.
```

```ad-note
Differenza simmetrica
Alcuni libri definiscono anche la **differenza simmetrica** di $A$ e $B$, che si scrive $A \,\Delta\, B$: è l'insieme degli elementi che stanno in uno solo dei due insiemi.
$$
\begin{aligned}
A \,\Delta\, B &= (A \setminus B) \cup (B \setminus A) \\
&= (A \cup B) \setminus (A \cap B)
\end{aligned}
$$
Al contrario della differenza, è commutativa: $A \,\Delta\, B = B \,\Delta\, A$. Con gli insiemi dell'Esempio 1, $A = \{1, 2, 3, 4, 5\}$ e $B = \{4, 5, 6, 7\}$, si ha $A \,\Delta\, B = \{1, 2, 3, 6, 7\}$. Nel diagramma sono le due parti dei cerchi fuori dalla zona comune.

```tikz
% nome: differenza-simmetrica-venn
% alt: Differenza simmetrica di A e B: nel diagramma di Eulero-Venn sono colorate le parti dei due cerchi che restano fuori dalla zona comune
% svg: differenza-simmetrica-venn-115bf694.svg 231x155
\begin{tikzpicture}
\fill[blue!20, even odd rule] (-1,0) circle (1.4) (1,0) circle (1.4);
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\end{tikzpicture}
```
```

## Problemi con il diagramma

Nei problemi con gli insiemi, di solito i dati sono il numero di elementi di ciascun insieme e delle intersezioni, e le domande chiedono quanti stanno in una sola zona del diagramma. Il procedimento è questo:

1. Dai un nome agli insiemi e disegna il diagramma dentro il rettangolo dell'universo (la classe, la scuola).
2. Parti dalla zona più interna, l'intersezione di tutti gli insiemi, e scrivi il suo numero.
3. Riempi le altre zone andando verso l'esterno: in ogni zona scrivi il dato meno i numeri già scritti dentro quell'insieme.
4. La somma dei numeri dentro i cerchi è il numero di elementi dell'unione.
5. Chi non sta in nessun insieme sta nel complementare dell'unione: è il totale meno quella somma.
6. Controlla che i numeri di tutte le zone, sommati, diano il totale.

```ad-example
Esempio 9: due sport
In una classe di $30$ studenti, $18$ giocano a calcio, $12$ fanno nuoto e $5$ fanno tutti e due gli sport. Quanti fanno solo calcio, quanti un solo sport e quanti nessuno?

Siano $C$ e $N$ gli insiemi di chi gioca a calcio e di chi fa nuoto. Si parte da $|C \cap N| = 5$:
- solo calcio, cioè $C \setminus N$: $18 - 5 = 13$;
- solo nuoto, cioè $N \setminus C$: $12 - 5 = 7$;
- almeno uno sport, cioè $C \cup N$: $13 + 5 + 7 = 25$;
- nessuno sport, cioè $\overline{C \cup N}$: $30 - 25 = 5$.

Un solo sport lo fanno $13 + 7 = 20$ studenti. Controllo: $13 + 5 + 7 + 5 = 30$.

```tikz
% nome: problema-calcio-nuoto-venn
% alt: Problema con il diagramma di Eulero-Venn: 13 studenti fanno solo calcio, 5 calcio e nuoto, 7 solo nuoto, 5 nessuno dei due sport
% svg: problema-calcio-nuoto-venn-3f5e08d0.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=south east] at (3,-2) {classe};
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$C$};
\node at (2.1,1.35) {$N$};
\node at (-1.7,0) {$13$};
\node at (0,0) {$5$};
\node at (1.7,0) {$7$};
\node at (-2.5,-1.6) {$5$};
\end{tikzpicture}
```
```

```ad-example
Esempio 10: dai "nessuno" agli elementi comuni
In una classe di $26$ studenti, $15$ hanno un cane, $10$ un gatto e $4$ non hanno né cane né gatto. Quanti hanno sia un cane sia un gatto? Quanti hanno solo un cane?

Siano $K$ e $G$ gli insiemi di chi ha un cane e di chi ha un gatto. I $4$ senza animali formano $\overline{K \cup G}$, quindi gli altri stanno nell'unione:
$$|K \cup G| = 26 - 4 = 22$$
Dalla formula dell'unione, $22 = 15 + 10 - |K \cap G|$, e quindi
$$|K \cap G| = 25 - 22 = 3$$
Solo un cane: $|K \setminus G| = 15 - 3 = 12$. Controllo: solo gatto $10 - 3 = 7$, e $12 + 3 + 7 + 4 = 26$.
```

```ad-example
Esempio 11: tre sport
In una classe di $40$ studenti, $20$ giocano a calcio, $15$ fanno nuoto e $12$ giocano a pallavolo. $6$ fanno calcio e nuoto, $5$ calcio e pallavolo, $4$ nuoto e pallavolo, e $2$ fanno tutti e tre gli sport. Quanti fanno un solo sport? Quanti nessuno?

Siano $C$, $N$ e $P$ i tre insiemi. Si parte dal centro, dove ci sono i $2$ che fanno tutti e tre gli sport. Poi le zone con due sport soltanto:
- calcio e nuoto ma non pallavolo: $6 - 2 = 4$;
- calcio e pallavolo ma non nuoto: $5 - 2 = 3$;
- nuoto e pallavolo ma non calcio: $4 - 2 = 2$.

Poi le zone con un solo sport, togliendo dal totale di ogni sport i numeri già scritti nel suo cerchio:
- solo calcio: $20 - 4 - 3 - 2 = 11$;
- solo nuoto: $15 - 4 - 2 - 2 = 7$;
- solo pallavolo: $12 - 3 - 2 - 2 = 5$.

Un solo sport lo fanno $11 + 7 + 5 = 23$ studenti. Dentro i cerchi ci sono $23 + 4 + 3 + 2 + 2 = 34$ studenti, quindi nessuno sport lo fanno $40 - 34 = 6$ studenti.

```tikz
% nome: problema-tre-sport-venn
% alt: Problema con tre insiemi nel diagramma di Eulero-Venn: 11 solo calcio, 7 solo nuoto, 5 solo pallavolo, 4 calcio e nuoto, 3 calcio e pallavolo, 2 nuoto e pallavolo, 2 tutti e tre, 6 nessuno
% svg: problema-tre-sport-venn-64ca435d.svg 231x170
\begin{tikzpicture}
\draw (-3,-2.4) rectangle (3,2);
\node[anchor=south east] at (3,-2.4) {classe};
\draw (-0.75,0.35) circle (1.3);
\draw (0.75,0.35) circle (1.3);
\draw (0,-0.9) circle (1.3);
\node at (-2.2,1.55) {$C$};
\node at (2.2,1.55) {$N$};
\node at (-1.3,-1.95) {$P$};
\node at (-1.35,0.6) {$11$};
\node at (1.35,0.6) {$7$};
\node at (0,-1.6) {$5$};
\node at (0,0.95) {$4$};
\node at (-0.75,-0.5) {$3$};
\node at (0.75,-0.5) {$2$};
\node at (0,-0.05) {$2$};
\node at (-2.5,-2.0) {$6$};
\end{tikzpicture}
```
```

```ad-warning
Togliere le intersezioni senza partire dal centro
Nell'Esempio 11, calcolare "solo calcio" come $20 - 6 - 5 = 9$ è sbagliato: i $2$ che fanno tutti e tre gli sport stanno sia tra i $6$ sia tra i $5$, e così vengono tolti due volte. Riempi prima il centro, poi le zone con due insiemi, e solo alla fine quelle con uno.
```
