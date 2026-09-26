# Relazioni binarie

In una classe alcuni studenti hanno letto un certo libro e altri no; tra i numeri da 1 a 10, alcuni sono divisori di altri. In tutti e due i casi c'è un collegamento che lega certi elementi di un insieme a certi elementi di un altro, e non lega tutti gli altri. Una relazione binaria descrive proprio questo: quali coppie di elementi sono collegate. È il primo passo verso le funzioni, che sono relazioni di un tipo particolare.

## Che cos'è una relazione binaria

Per parlare di coppie ti serve il [prodotto cartesiano](/materiale/scuola-superiore/matematica/insiemi-e-logica/prodotto-cartesiano): $A \times B$ è l'insieme di tutte le coppie ordinate $(a, b)$ con $a \in A$ e $b \in B$. Una relazione sceglie alcune di queste coppie.

Dati due insiemi $A$ e $B$, una **relazione binaria** da $A$ a $B$ è un sottoinsieme $\mathcal{R}$ del prodotto cartesiano $A \times B$:

$$\mathcal{R} \subseteq A \times B$$

Di solito le coppie si scelgono con una proprietà: fanno parte di $\mathcal{R}$ le coppie $(a, b)$ per cui la proprietà è vera. Si dice "binaria" perché la proprietà riguarda due elementi alla volta.

Se la coppia $(a, b)$ appartiene a $\mathcal{R}$, si dice che $a$ **è in relazione** con $b$ e si scrive

$$a \mathrel{\mathcal{R}} b \quad \text{oppure} \quad (a, b) \in \mathcal{R}$$

L'elemento $b$ si chiama un **corrispondente** di $a$. Se invece $(a, b) \notin \mathcal{R}$, si scrive $a \mathrel{\not\mathcal{R}} b$.

Prendi $A = \{2,\ 3,\ 5,\ 7\}$, $B = \{4,\ 6,\ 9,\ 10\}$ e la proprietà "$a$ è un divisore di $b$". Il prodotto $A \times B$ ha $4 \cdot 4 = 16$ coppie; controllandole una per una, la proprietà è vera per sei:

$$
\begin{gathered}
\mathcal{R} = \{(2, 4),\ (2, 6),\ (2, 10), \\
(3, 6),\ (3, 9),\ (5, 10)\}
\end{gathered}
$$

Quindi $2 \mathrel{\mathcal{R}} 6$, perché $2$ divide $6$, mentre $3 \mathrel{\not\mathcal{R}} 4$, perché $4$ non è un multiplo di $3$. Il numero $7$ non divide nessun elemento di $B$, e infatti non compare in nessuna coppia.

```ad-warning
Scambiare l'ordine nella coppia
La relazione "$a$ è un divisore di $b$" contiene $(2, 6)$, non $(6, 2)$: il primo posto è per l'elemento di $A$, il secondo per quello di $B$. La coppia $(6, 2)$ non appartiene nemmeno ad $A \times B$, perché $6 \notin A$.
```

Ogni sottoinsieme di $A \times B$ è una relazione, anche se non corrisponde a una proprietà con un nome. Ci sono anche due casi estremi: la relazione vuota, $\mathcal{R} = \emptyset$, in cui nessun elemento è in relazione con nessuno, e la relazione $\mathcal{R} = A \times B$, in cui ogni elemento di $A$ è in relazione con ogni elemento di $B$.

## Relazione in un insieme

Quando l'insieme di partenza e quello di arrivo coincidono, la relazione è un sottoinsieme di $A \times A$ e si chiama **relazione in** $A$. Le relazioni che usi di più in matematica sono di questo tipo: "è minore di" tra numeri, "è parallela a" tra rette, "è sottoinsieme di" tra insiemi.

Per esempio, in $A = \{1,\ 2,\ 3,\ 4\}$ la relazione "$x$ è minore di $y$" è formata dalle coppie

$$
\begin{gathered}
\{(1, 2),\ (1, 3),\ (1, 4), \\
(2, 3),\ (2, 4),\ (3, 4)\}
\end{gathered}
$$

In una relazione in un insieme può succedere che un elemento sia in relazione con sé stesso, cioè che la coppia $(a, a)$ faccia parte della relazione. Con "$x$ è minore di $y$" non succede mai, perché nessun numero è minore di sé stesso; con "$x$ è un divisore di $y$" succede per ogni elemento, perché ogni numero diverso da zero divide sé stesso. Le proprietà che una relazione in un insieme può avere (riflessiva, simmetrica, transitiva e le altre) sono nella lezione [Relazioni di equivalenza e d'ordine](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/relazioni-di-equivalenza-e-d-ordine).

## Come si rappresenta una relazione

La stessa relazione si può dare in cinque modi. Qui li usiamo tutti per la relazione "$a$ è un divisore di $b$" da $A = \{2,\ 3,\ 5,\ 7\}$ a $B = \{4,\ 6,\ 9,\ 10\}$.

### Con una proprietà a parole

"$a$ è un divisore di $b$", insieme agli insiemi $A$ e $B$. Gli insiemi fanno parte della relazione: la stessa proprietà tra insiemi diversi dà una relazione diversa. È l'unico modo che funziona anche quando le coppie sono infinite, come per "$x$ è minore di $y$" in $\mathbb{N}$.

### Con l'elenco delle coppie

$$
\begin{gathered}
\mathcal{R} = \{(2, 4),\ (2, 6),\ (2, 10), \\
(3, 6),\ (3, 9),\ (5, 10)\}
\end{gathered}
$$

È la definizione stessa di relazione, scritta per esteso. Conviene quando le coppie sono poche.

### Con il diagramma a frecce

Gli elementi di $A$ in un ovale a sinistra, quelli di $B$ in un ovale a destra, e una freccia da $a$ a $b$ per ogni coppia $(a, b)$ della relazione. Il diagramma si chiama anche diagramma sagittale.

```tikz
% nome: diagramma-frecce-relazione-divisore
% alt: Diagramma a frecce della relazione "a è un divisore di b" da {2, 3, 5, 7} a {4, 6, 9, 10}: da 2 partono tre frecce, da 3 due, da 5 una, da 7 nessuna
% svg: diagramma-frecce-relazione-divisore-60715fba.svg 170x207
\begin{tikzpicture}
\draw (0,0) ellipse (0.7 and 2.4);
\draw (3,0) ellipse (0.7 and 2.4);
\node at (0,2.75) {$A$};
\node at (3,2.75) {$B$};
\node (a2) at (0,1.35) {$2$};
\node (a3) at (0,0.45) {$3$};
\node (a5) at (0,-0.45) {$5$};
\node (a7) at (0,-1.35) {$7$};
\node (b4) at (3,1.35) {$4$};
\node (b6) at (3,0.45) {$6$};
\node (b9) at (3,-0.45) {$9$};
\node (b10) at (3,-1.35) {$10$};
\draw[->, shorten >=2pt, shorten <=2pt] (a2) -- (b4);
\draw[->, shorten >=2pt, shorten <=2pt] (a2) -- (b6);
\draw[->, shorten >=2pt, shorten <=2pt] (a2) -- (b10);
\draw[->, shorten >=2pt, shorten <=2pt] (a3) -- (b6);
\draw[->, shorten >=2pt, shorten <=2pt] (a3) -- (b9);
\draw[->, shorten >=2pt, shorten <=2pt] (a5) -- (b10);
\end{tikzpicture}
```

Il diagramma mostra a colpo d'occhio cose che nell'elenco si vedono meno: da $2$ partono tre frecce, da $7$ nessuna; a $6$ e a $10$ ne arrivano due.

### Con la tabella a doppia entrata

Gli elementi di $A$ sulle righe, quelli di $B$ sulle colonne, e un segno nella casella di ogni coppia che fa parte della relazione. Le caselle della tabella sono tutte le coppie di $A \times B$; quelle segnate sono le coppie di $\mathcal{R}$.

| $a \backslash b$ | $4$ | $6$ | $9$ | $10$ |
|---|---|---|---|---|
| $2$ | $\bullet$ | $\bullet$ | | $\bullet$ |
| $3$ | | $\bullet$ | $\bullet$ | |
| $5$ | | | | $\bullet$ |
| $7$ | | | | |

Una riga vuota, come quella di $7$, è un elemento di $A$ senza corrispondenti; una colonna vuota sarebbe un elemento di $B$ che non è corrispondente di nessuno.

### Con il grafico cartesiano

Quando gli elementi sono numeri, si mettono quelli di $A$ sull'asse orizzontale e quelli di $B$ sull'asse verticale, e ogni coppia $(a, b)$ della relazione diventa il punto di coordinate $a$ e $b$. Nella figura i cerchietti vuoti sono le sedici coppie di $A \times B$, i punti pieni le sei coppie della relazione.

```tikz
% nome: grafico-cartesiano-relazione-divisore
% alt: Grafico cartesiano della relazione "a è un divisore di b": sui due assi i numeri 2, 3, 5, 7 e 4, 6, 9, 10, sedici cerchietti per le coppie del prodotto cartesiano e sei punti pieni per le coppie della relazione
% svg: grafico-cartesiano-relazione-divisore-3dbefadd.svg 237x235
\begin{tikzpicture}[x=0.6cm, y=0.45cm]
\draw[->] (0,0) -- (8.3,0) node[right] {$A$};
\draw[->] (0,0) -- (0,11.3) node[above] {$B$};
\foreach \a in {2,3,5,7} { \draw (\a,0.2) -- (\a,-0.2) node[below] {$\a$}; }
\foreach \b in {4,6,9,10} { \draw (0.15,\b) -- (-0.15,\b) node[left] {$\b$}; }
\foreach \a in {2,3,5,7} { \foreach \b in {4,6,9,10} { \draw[gray] (\a,\b) circle (2.5pt); } }
\foreach \a/\b in {2/4,2/6,2/10,3/6,3/9,5/10} { \fill (\a,\b) circle (2.5pt); }
\end{tikzpicture}
```

```ad-warning
Mettere gli assi al contrario
Il primo elemento della coppia va sull'asse orizzontale, il secondo su quello verticale, come per le coordinate di un punto. Se li scambi disegni un'altra relazione: quella inversa, che trovi più avanti.
```

## Insieme di partenza, insieme di arrivo e coppie

In una relazione da $A$ a $B$ ci sono tre insiemi, e conviene tenerli distinti:

- l'**insieme di partenza** $A$, detto anche **dominio** della relazione;
- l'**insieme di arrivo** $B$, detto anche **codominio** della relazione;
- l'insieme delle coppie in relazione, che è la relazione $\mathcal{R}$ stessa ed è contenuto in $A \times B$.

Nell'esempio dei divisori il dominio è $\{2,\ 3,\ 5,\ 7\}$, il codominio è $\{4,\ 6,\ 9,\ 10\}$ e l'insieme delle coppie ha sei elementi. Nel dominio può esserci un elemento senza corrispondenti, come $7$, e un elemento con più corrispondenti, come $2$. Una relazione in cui ogni elemento del dominio ha uno e un solo corrispondente è una funzione: la trovi nella lezione [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione), e i nomi dominio e codominio restano gli stessi anche per le funzioni.

```ad-note
Dominio e codominio in altri libri
Alcuni libri chiamano dominio della relazione solo gli elementi di $A$ che hanno almeno un corrispondente ($\{2,\ 3,\ 5\}$ nell'esempio) e codominio solo gli elementi di $B$ che sono corrispondenti di qualcuno; altri chiamano grafico della relazione l'insieme delle coppie. Qui dominio e codominio sono l'insieme di partenza e quello di arrivo, come nelle lezioni sulle funzioni. Controlla quale convenzione usa il tuo libro.
```

## Relazione inversa

Se leggi le frecce di una relazione al contrario ottieni un'altra relazione, che va da $B$ ad $A$. La **relazione inversa** di $\mathcal{R}$ si indica con $\mathcal{R}^{-1}$ ed è formata dalle coppie di $\mathcal{R}$ con i due elementi scambiati:

$$b \mathrel{\mathcal{R}^{-1}} a \iff a \mathrel{\mathcal{R}} b$$

La relazione inversa di "$a$ è un divisore di $b$", da $\{2,\ 3,\ 5,\ 7\}$ a $\{4,\ 6,\ 9,\ 10\}$, è "$b$ è un multiplo di $a$", da $\{4,\ 6,\ 9,\ 10\}$ a $\{2,\ 3,\ 5,\ 7\}$:

$$
\begin{gathered}
\mathcal{R}^{-1} = \{(4, 2),\ (6, 2),\ (10, 2), \\
(6, 3),\ (9, 3),\ (10, 5)\}
\end{gathered}
$$

Nel diagramma a frecce l'inversa ha le stesse frecce con il verso cambiato; qui l'ovale di $B$ è a sinistra, perché ora $B$ è l'insieme di partenza.

```tikz
% nome: diagramma-frecce-relazione-inversa-multiplo
% alt: Diagramma a frecce della relazione inversa "b è un multiplo di a" da {4, 6, 9, 10} a {2, 3, 5, 7}: le stesse frecce della relazione "è un divisore di" con il verso cambiato
% svg: diagramma-frecce-relazione-inversa-multiplo-f8f0eedc.svg 170x207
\begin{tikzpicture}
\draw (0,0) ellipse (0.7 and 2.4);
\draw (3,0) ellipse (0.7 and 2.4);
\node at (0,2.75) {$B$};
\node at (3,2.75) {$A$};
\node (b4) at (0,1.35) {$4$};
\node (b6) at (0,0.45) {$6$};
\node (b9) at (0,-0.45) {$9$};
\node (b10) at (0,-1.35) {$10$};
\node (a2) at (3,1.35) {$2$};
\node (a3) at (3,0.45) {$3$};
\node (a5) at (3,-0.45) {$5$};
\node (a7) at (3,-1.35) {$7$};
\draw[->, shorten >=2pt, shorten <=2pt] (b4) -- (a2);
\draw[->, shorten >=2pt, shorten <=2pt] (b6) -- (a2);
\draw[->, shorten >=2pt, shorten <=2pt] (b10) -- (a2);
\draw[->, shorten >=2pt, shorten <=2pt] (b6) -- (a3);
\draw[->, shorten >=2pt, shorten <=2pt] (b9) -- (a3);
\draw[->, shorten >=2pt, shorten <=2pt] (b10) -- (a5);
\end{tikzpicture}
```

Anche le altre rappresentazioni cambiano in modo prevedibile: nella tabella le righe diventano colonne, e nel grafico cartesiano ogni punto $(a, b)$ diventa il punto $(b, a)$, simmetrico rispetto alla bisettrice del primo e del terzo quadrante (la retta $y = x$). L'inversa dell'inversa è la relazione di partenza: $(\mathcal{R}^{-1})^{-1} = \mathcal{R}$.

Per le relazioni in un insieme l'inversa è ancora una relazione nello stesso insieme. In $A = \{1,\ 2,\ 3,\ 4\}$ l'inversa di "$x$ è minore di $y$" è "$x$ è maggiore di $y$", con le coppie $(2, 1)$, $(3, 1)$, $(4, 1)$, $(3, 2)$, $(4, 2)$, $(4, 3)$.

```ad-warning
Confondere l'inversa con la negazione
L'inversa di "$a$ è un divisore di $b$" è "$b$ è un multiplo di $a$", non "$a$ non è un divisore di $b$". L'inversa scambia i due elementi di ogni coppia e ha sempre lo stesso numero di coppie della relazione di partenza; la negazione prende invece le coppie di $A \times B$ che non stanno nella relazione, e qui sarebbero $16 - 6 = 10$.
```

## Esempi svolti

```ad-example
Esempio 1: dalla proprietà alle coppie
$A = \{1,\ 2,\ 3,\ 4\}$, $B = \{2,\ 3,\ 4,\ 5\}$ e la relazione "$a + b = 6$". Scrivi l'elenco delle coppie e la relazione inversa.

Per ogni $a$ di $A$ cerca i $b$ di $B$ che danno somma $6$, cioè $b = 6 - a$: per $a = 1$ serve $b = 5$, per $a = 2$ serve $4$, per $a = 3$ serve $3$, per $a = 4$ serve $2$. Tutti questi numeri stanno in $B$, quindi

$$
\begin{gathered}
\mathcal{R} = \{(1, 5),\ (2, 4), \\
(3, 3),\ (4, 2)\}
\end{gathered}
$$

La coppia $(3, 3)$ è ammessa: $3$ sta sia in $A$ sia in $B$, e la relazione va da $A$ a $B$, quindi non c'è niente di strano nel trovarlo ai due posti. Per l'inversa scambi i due elementi di ogni coppia:

$$
\begin{gathered}
\mathcal{R}^{-1} = \{(5, 1),\ (4, 2), \\
(3, 3),\ (2, 4)\}
\end{gathered}
$$

È la relazione "$b + a = 6$" da $B$ ad $A$: la somma non dipende dall'ordine, quindi la proprietà a parole è la stessa, ma cambiano gli insiemi di partenza e di arrivo.
```

```ad-example
Esempio 2: dal diagramma alla proprietà
Il diagramma rappresenta una relazione da $A = \{1,\ 2,\ 3\}$ a $B = \{1,\ 4,\ 6,\ 9\}$. Scrivi le coppie, trova una proprietà che la descriva e di' quale elemento di $B$ non è corrispondente di nessuno.

```tikz
% nome: diagramma-frecce-relazione-quadrato
% alt: Diagramma a frecce di una relazione da {1, 2, 3} a {1, 4, 6, 9}: 1 va in 1, 2 va in 4, 3 va in 9, e a 6 non arriva nessuna freccia
% svg: diagramma-frecce-relazione-quadrato-ee5b157d.svg 170x207
\begin{tikzpicture}
\draw (0,0) ellipse (0.7 and 2.4);
\draw (3,0) ellipse (0.7 and 2.4);
\node at (0,2.75) {$A$};
\node at (3,2.75) {$B$};
\node (a1) at (0,0.90) {$1$};
\node (a2) at (0,0.00) {$2$};
\node (a3) at (0,-0.90) {$3$};
\node (b1) at (3,1.35) {$1$};
\node (b4) at (3,0.45) {$4$};
\node (b6) at (3,-0.45) {$6$};
\node (b9) at (3,-1.35) {$9$};
\draw[->, shorten >=2pt, shorten <=2pt] (a1) -- (b1);
\draw[->, shorten >=2pt, shorten <=2pt] (a2) -- (b4);
\draw[->, shorten >=2pt, shorten <=2pt] (a3) -- (b9);
\end{tikzpicture}
```

Ogni freccia dà una coppia, con l'elemento da cui parte al primo posto:

$$\mathcal{R} = \{(1, 1),\ (2, 4),\ (3, 9)\}$$

In ogni coppia il secondo elemento è il quadrato del primo: $1^2 = 1$, $2^2 = 4$, $3^2 = 9$. La proprietà "$b = a^2$" descrive la relazione, e controlli che non ne escluda nessuna coppia: gli unici quadrati di elementi di $A$ sono proprio $1$, $4$ e $9$. A $6$ non arriva nessuna freccia, perché $6$ non è il quadrato di nessun elemento di $A$.
```

```ad-example
Esempio 3: una relazione tra persone e lingue
$A = \{\text{Anna},\ \text{Bruno},\ \text{Carla}\}$, $B = \{\text{inglese},\ \text{francese},\ \text{tedesco}\}$ e la relazione "$a$ parla $b$". Anna parla inglese e francese, Bruno solo inglese, Carla nessuna delle tre. Scrivi le coppie, poi la relazione inversa a parole e con le coppie.

Le coppie sono tre, e Carla non compare in nessuna:

$$
\begin{gathered}
\mathcal{R} = \{(\text{Anna},\ \text{inglese}), \\
(\text{Anna},\ \text{francese}), \\
(\text{Bruno},\ \text{inglese})\}
\end{gathered}
$$

La relazione inversa va da $B$ ad $A$ ed è "$b$ è parlata da $a$":

$$
\begin{gathered}
\mathcal{R}^{-1} = \{(\text{inglese},\ \text{Anna}), \\
(\text{francese},\ \text{Anna}), \\
(\text{inglese},\ \text{Bruno})\}
\end{gathered}
$$

Nell'inversa il tedesco non ha corrispondenti, perché nessuno lo parla, e l'inglese ne ha due. Né la relazione né la sua inversa sono funzioni: Carla non ha corrispondenti in $\mathcal{R}$, e l'inglese ne ha due in $\mathcal{R}^{-1}$.
```

```ad-example
Esempio 4: una relazione in un insieme, con i cappi
In $A = \{1,\ 2,\ 3,\ 4\}$ considera la relazione "$x$ è un divisore di $y$". Scrivi le coppie e disegna il diagramma a frecce.

Per ogni $x$ cerchi i suoi multipli in $A$, compreso $x$ stesso: $1$ divide tutti e quattro i numeri, $2$ divide $2$ e $4$, $3$ divide solo $3$, $4$ divide solo $4$. Le coppie sono otto:

$$
\begin{gathered}
\{(1, 1),\ (1, 2),\ (1, 3),\ (1, 4), \\
(2, 2),\ (2, 4),\ (3, 3),\ (4, 4)\}
\end{gathered}
$$

In una relazione in un insieme gli elementi si disegnano una volta sola, in un unico ovale. Le coppie come $(2, 2)$, con lo stesso elemento ai due posti, diventano una freccia che parte da $2$ e torna in $2$: si chiama **cappio**. Qui ogni elemento ha il suo cappio.

```tikz
% nome: diagramma-frecce-relazione-divisore-in-un-insieme
% alt: Diagramma a frecce della relazione "x è un divisore di y" in {1, 2, 3, 4}: un cappio su ogni elemento e le frecce da 1 a 2, da 1 a 3, da 1 a 4 e da 2 a 4
% svg: diagramma-frecce-relazione-divisore-in-un-insieme-cc4405e3.svg 163x169
\begin{tikzpicture}
\draw (0,0) ellipse (2.1 and 1.9);
\node at (0,2.25) {$A$};
\node (n1) at (-0.9,0.7) {$1$};
\node (n2) at (0.9,0.7) {$2$};
\node (n3) at (-0.9,-0.7) {$3$};
\node (n4) at (0.9,-0.7) {$4$};
\draw[->, shorten >=2pt, shorten <=2pt] (n1) -- (n2);
\draw[->, shorten >=2pt, shorten <=2pt] (n1) -- (n3);
\draw[->, shorten >=2pt, shorten <=2pt] (n1) -- (n4);
\draw[->, shorten >=2pt, shorten <=2pt] (n2) -- (n4);
\draw[->] (n1) to[out=150, in=210, looseness=6] (n1);
\draw[->] (n2) to[out=30, in=-30, looseness=6] (n2);
\draw[->] (n3) to[out=150, in=210, looseness=6] (n3);
\draw[->] (n4) to[out=30, in=-30, looseness=6] (n4);
\end{tikzpicture}
```

La relazione inversa, "$x$ è un multiplo di $y$", ha le stesse otto frecce con il verso cambiato: i cappi restano cappi, perché $(a, a)$ scambiato dà ancora $(a, a)$.
```

```ad-example
Esempio 5: una relazione in un insieme infinito
In $\mathbb{N}$ considera la relazione "$x \cdot y = 12$". Scrivi le coppie e la relazione inversa.

Le coppie si trovano con i divisori di $12$, che sono $1$, $2$, $3$, $4$, $6$, $12$: per ognuno di essi $y$ è il quoziente $12 : x$. Un $x$ che non divide $12$, come $5$, non ha corrispondenti, e nemmeno $0$, perché $0 \cdot y = 0$. Anche se $\mathbb{N}$ è infinito, le coppie sono sei:

$$
\begin{gathered}
\{(1, 12),\ (2, 6),\ (3, 4), \\
(4, 3),\ (6, 2),\ (12, 1)\}
\end{gathered}
$$

Le coppie $(3, 4)$ e $(4, 3)$ sono diverse, e ci sono tutte e due perché $3 \cdot 4$ e $4 \cdot 3$ fanno entrambi $12$. Scambiando gli elementi di ogni coppia ritrovi le stesse sei coppie: questa relazione coincide con la sua inversa. Succede ogni volta che la proprietà resta vera scambiando $x$ e $y$, come qui per la proprietà commutativa del prodotto.
```

## Errori frequenti

```ad-warning
Dimenticare gli insiemi
"$a$ è un divisore di $b$" da sola non determina la relazione: da $\{2,\ 3\}$ a $\{4,\ 6\}$ ha tre coppie, da $\{2,\ 3,\ 5,\ 7\}$ a $\{4,\ 6,\ 9,\ 10\}$ ne ha sei. Una relazione è data dalla proprietà e dagli insiemi di partenza e di arrivo.
```

```ad-warning
Pensare che ogni elemento debba avere un corrispondente
In una relazione un elemento del dominio può non avere corrispondenti o averne più di uno, e un elemento del codominio può non essere corrispondente di nessuno. La richiesta "uno e un solo corrispondente per ogni elemento" è quella delle funzioni, non delle relazioni.
```
