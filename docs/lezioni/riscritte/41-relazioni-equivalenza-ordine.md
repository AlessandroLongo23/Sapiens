# Relazioni di equivalenza e d'ordine

Negli studenti di una classe, la relazione "essere nato nello stesso mese di" forma dei gruppi: quelli di gennaio, quelli di febbraio e così via, al massimo dodici gruppi che non si sovrappongono. La relazione "essere più alto di" invece non forma gruppi, ma mette gli studenti in fila dal più basso al più alto. La prima è una relazione di equivalenza, la seconda una relazione d'ordine. Per distinguerle si guardano quattro proprietà, che si controllano con le definizioni o direttamente sul diagramma della relazione.

## Relazioni in un insieme

Una relazione $\mathcal{R}$ in un insieme $A$ è un sottoinsieme del prodotto cartesiano $A \times A$: un insieme di coppie ordinate di elementi di $A$ (la definizione e i modi di rappresentarla sono nella lezione [Relazioni binarie](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/relazioni-binarie)). Quando la coppia $(a, b)$ appartiene a $\mathcal{R}$ si dice che $a$ è in relazione con $b$ e si scrive

$$a \mathrel{\mathcal{R}} b$$

Nel diagramma di una relazione in un insieme gli elementi di $A$ si disegnano come punti, e da $a$ parte una freccia verso $b$ ogni volta che $a \mathrel{\mathcal{R}} b$. Se un elemento è in relazione con sé stesso, la freccia parte da lui e torna a lui: è un anello che si chiama **cappio**.

## Proprietà riflessiva

Una relazione $\mathcal{R}$ in $A$ è **riflessiva** se ogni elemento è in relazione con sé stesso:

$$a \mathrel{\mathcal{R}} a \quad \text{per ogni } a \in A$$

Nel diagramma, una relazione è riflessiva quando c'è un cappio su ogni elemento. Qui sotto tutti e tre gli elementi hanno il cappio; la freccia da $a$ a $b$ non cambia nulla, perché la riflessiva guarda solo i cappi.

```tikz
% nome: proprieta-riflessiva-cappi
% alt: Diagramma di una relazione riflessiva sugli elementi a, b, c: ogni elemento ha un cappio, e c'è anche una freccia da a a b
% svg: proprieta-riflessiva-cappi-39b8a342.svg 182x130
\begin{tikzpicture}[>=stealth, scale=1.25]
\node (a) at (0,0) {$a$};
\node (b) at (2.4,0) {$b$};
\node (c) at (1.2,1.6) {$c$};
\draw[->] (a) to[out=210,in=150,looseness=8] (a);
\draw[->] (b) to[out=30,in=-30,looseness=8] (b);
\draw[->] (c) to[out=120,in=60,looseness=8] (c);
\draw[->, shorten >=2pt, shorten <=2pt] (a) -- (b);
\end{tikzpicture}
```

Sono riflessive "essere nato nello stesso mese di", perché ognuno è nato nello stesso mese di sé stesso, e $\leq$ tra numeri, perché $a \leq a$ per ogni numero $a$. Non è riflessiva $<$, perché $3 < 3$ è falso.

```ad-warning
Un cappio mancante basta
La riflessiva chiede il cappio su tutti gli elementi di $A$. Se anche un solo elemento non è in relazione con sé stesso, la relazione non è riflessiva, anche quando tutti gli altri hanno il cappio.
```

Una relazione è **antiriflessiva** se nessun elemento è in relazione con sé stesso: nel diagramma non c'è nessun cappio. La relazione $<$ è antiriflessiva, perché nessun numero è minore di sé stesso. Antiriflessiva non vuol dire "non riflessiva": in $A = \{1, 2\}$ la relazione $\mathcal{R} = \{(1, 1)\}$ non è riflessiva, perché manca $(2, 2)$, e non è antiriflessiva, perché c'è $(1, 1)$.

## Proprietà simmetrica

Una relazione $\mathcal{R}$ in $A$ è **simmetrica** se, ogni volta che $a$ è in relazione con $b$, anche $b$ è in relazione con $a$:

$$a \mathrel{\mathcal{R}} b \implies b \mathrel{\mathcal{R}} a$$

Nel diagramma, una relazione è simmetrica quando ogni freccia tra due elementi diversi ha la freccia di ritorno. I cappi non contano: un cappio è già la freccia di ritorno di sé stesso.

```tikz
% nome: proprieta-simmetrica-frecce-andata-ritorno
% alt: Diagramma di una relazione simmetrica sugli elementi a, b, c: tra a e b e tra b e c ci sono due frecce, una di andata e una di ritorno, e a ha un cappio
% svg: proprieta-simmetrica-frecce-andata-ritorno-a1865c4f.svg 158x106
\begin{tikzpicture}[>=stealth, scale=1.25]
\node (a) at (0,0) {$a$};
\node (b) at (2.4,0) {$b$};
\node (c) at (1.2,1.6) {$c$};
\draw[->] (a) to[out=210,in=150,looseness=8] (a);
\draw[->, shorten >=2pt, shorten <=2pt] (a) to[bend left=20] (b);
\draw[->, shorten >=2pt, shorten <=2pt] (b) to[bend left=20] (a);
\draw[->, shorten >=2pt, shorten <=2pt] (b) to[bend left=20] (c);
\draw[->, shorten >=2pt, shorten <=2pt] (c) to[bend left=20] (b);
\end{tikzpicture}
```

Quando le frecce sono tante, l'andata e il ritorno si disegnano spesso come una sola linea con la punta a tutti e due gli estremi.

Sono simmetriche "essere nato nello stesso mese di" e "essere compagno di banco di": se Luca è compagno di banco di Sara, Sara è compagna di banco di Luca. Non è simmetrica $\leq$, perché $2 \leq 5$ ma $5 \leq 2$ è falso.

## Proprietà antisimmetrica

Una relazione $\mathcal{R}$ in $A$ è **antisimmetrica** se due elementi in relazione in tutti e due i sensi sono per forza lo stesso elemento:

$$
\begin{gathered}
a \mathrel{\mathcal{R}} b \text{ e } b \mathrel{\mathcal{R}} a \\
\implies a = b
\end{gathered}
$$

Detto in un altro modo, se $a \neq b$ non possono valere insieme $a \mathrel{\mathcal{R}} b$ e $b \mathrel{\mathcal{R}} a$. Nel diagramma, una relazione è antisimmetrica quando tra due elementi diversi c'è al massimo una freccia: nessuna freccia ha quella di ritorno. I cappi sono ammessi.

```tikz
% nome: proprieta-antisimmetrica-una-freccia
% alt: Diagramma di una relazione antisimmetrica sugli elementi a, b, c: frecce da a a b, da b a c e da c ad a, nessuna con la freccia di ritorno, e un cappio su b
% svg: proprieta-antisimmetrica-una-freccia-c8ac45c5.svg 156x104
\begin{tikzpicture}[>=stealth, scale=1.25]
\node (a) at (0,0) {$a$};
\node (b) at (2.4,0) {$b$};
\node (c) at (1.2,1.6) {$c$};
\draw[->] (b) to[out=30,in=-30,looseness=8] (b);
\draw[->, shorten >=2pt, shorten <=2pt] (a) -- (b);
\draw[->, shorten >=2pt, shorten <=2pt] (b) -- (c);
\draw[->, shorten >=2pt, shorten <=2pt] (c) -- (a);
\end{tikzpicture}
```

La relazione $\leq$ tra numeri è antisimmetrica: se $a \leq b$ e $b \leq a$, allora $a = b$. Lo è anche l'inclusione tra insiemi: se $A \subseteq B$ e $B \subseteq A$, allora $A = B$ (è la doppia inclusione della lezione [Sottoinsiemi e uguaglianza](/materiale/scuola-superiore/matematica/insiemi-e-logica/sottoinsiemi-e-uguaglianza)). "Essere compagno di banco di" non è antisimmetrica: Luca e Sara sono compagni di banco l'uno dell'altra, ma non sono la stessa persona.

```ad-warning
Antisimmetrica non vuol dire "non simmetrica"
Una relazione può essere simmetrica e antisimmetrica insieme, oppure né l'una né l'altra. L'uguaglianza $a = b$ è simmetrica e anche antisimmetrica, perché non ha frecce tra elementi diversi. In $A = \{1, 2, 3\}$ la relazione $\mathcal{R} = \{(1, 2),\ (2, 1),\ (2, 3)\}$ non è simmetrica, perché manca $(3, 2)$, e non è antisimmetrica, perché ci sono $(1, 2)$ e $(2, 1)$ con $1 \neq 2$.
```

## Proprietà transitiva

Una relazione $\mathcal{R}$ in $A$ è **transitiva** se, quando $a$ è in relazione con $b$ e $b$ è in relazione con $c$, anche $a$ è in relazione con $c$:

$$
\begin{gathered}
a \mathrel{\mathcal{R}} b \text{ e } b \mathrel{\mathcal{R}} c \\
\implies a \mathrel{\mathcal{R}} c
\end{gathered}
$$

Nel diagramma, una relazione è transitiva quando ogni percorso di due frecce, da $a$ a $b$ e da $b$ a $c$, ha anche la scorciatoia: la freccia diretta da $a$ a $c$. Nella figura la scorciatoia è tratteggiata.

```tikz
% nome: proprieta-transitiva-scorciatoia
% alt: Diagramma di una relazione transitiva sugli elementi a, b, c: frecce da a a b e da b a c, e la freccia tratteggiata da a a c che fa da scorciatoia
% svg: proprieta-transitiva-scorciatoia-e3216f37.svg 132x95
\begin{tikzpicture}[>=stealth, scale=1.25]
\node (a) at (0,0) {$a$};
\node (b) at (1.2,1.6) {$b$};
\node (c) at (2.4,0) {$c$};
\draw[->, shorten >=2pt, shorten <=2pt] (a) -- (b);
\draw[->, shorten >=2pt, shorten <=2pt] (b) -- (c);
\draw[->, dashed, shorten >=2pt, shorten <=2pt] (a) -- (c);
\end{tikzpicture}
```

Sono transitive $<$ e $\leq$ tra numeri (da $2 < 5$ e $5 < 9$ segue $2 < 9$), l'inclusione tra insiemi e "essere nato nello stesso mese di". Non è transitiva "essere perpendicolare a" tra le rette del piano: se $r$ è perpendicolare a $s$ e $s$ è perpendicolare a $t$, la retta $r$ è parallela a $t$, non perpendicolare.

```ad-warning
Il percorso che torna indietro
Nella transitiva $c$ può essere lo stesso elemento $a$. Se $a \mathrel{\mathcal{R}} b$ e $b \mathrel{\mathcal{R}} a$, la transitiva chiede $a \mathrel{\mathcal{R}} a$. Per questo "essere compagno di banco di" non è transitiva: Luca è compagno di banco di Sara, Sara di Luca, ma Luca non è compagno di banco di sé stesso. Nel diagramma, ogni coppia di frecce di andata e ritorno tra $a$ e $b$ richiede i cappi su $a$ e su $b$.
```

## Come si controlla una proprietà

Per dire che una proprietà vale bisogna ragionare su tutti gli elementi: un esempio che funziona non basta. Per dire che non vale basta invece un solo controesempio, cioè uno o più elementi precisi per cui la condizione è falsa. Con un insieme finito si controlla tutto sul diagramma; con un insieme infinito si ragiona sulla definizione della relazione.

```ad-example
Esempio 1: una relazione data con l'elenco delle coppie
In $A = \{1, 2, 3\}$ considera la relazione
$$
\begin{aligned}
\mathcal{R} = \{&(1, 1),\ (2, 2),\ (3, 3), \\
&(1, 2),\ (2, 3)\}
\end{aligned}
$$

Il diagramma ha un cappio su ogni elemento e le frecce da $1$ a $2$ e da $2$ a $3$.

```tikz
% nome: relazione-cappi-frecce-uno-due-tre
% alt: Diagramma della relazione nell'insieme {1, 2, 3} con un cappio su ogni elemento, una freccia da 1 a 2 e una da 2 a 3
% svg: relazione-cappi-frecce-uno-due-tre-794fb60e.svg 250x112
\begin{tikzpicture}[>=stealth, scale=1.25]
\draw (1.8,0.35) ellipse (2.6 and 1.15);
\node at (-0.55,1.25) {$A$};
\node (u) at (0,0) {$1$};
\node (d) at (1.8,0) {$2$};
\node (t) at (3.6,0) {$3$};
\draw[->] (u) to[out=120,in=60,looseness=8] (u);
\draw[->] (d) to[out=120,in=60,looseness=8] (d);
\draw[->] (t) to[out=120,in=60,looseness=8] (t);
\draw[->, shorten >=2pt, shorten <=2pt] (u) -- (d);
\draw[->, shorten >=2pt, shorten <=2pt] (d) -- (t);
\end{tikzpicture}
```

Riflessiva: sì, ci sono tutti e tre i cappi.

Simmetrica: no, perché $1 \mathrel{\mathcal{R}} 2$ ma $(2, 1)$ non appartiene a $\mathcal{R}$.

Antisimmetrica: sì, nessuna freccia tra elementi diversi ha quella di ritorno.

Transitiva: no, perché $1 \mathrel{\mathcal{R}} 2$ e $2 \mathrel{\mathcal{R}} 3$, ma manca la scorciatoia $(1, 3)$.
```

La relazione dell'Esempio 1 è qui sotto, con una spia per ogni proprietà. Tocca un elemento e poi un altro per aggiungere o togliere la freccia tra i due, o lo stesso elemento due volte per il suo cappio: la spia scelta, o la prima spenta, mostra nel diagramma il controesempio, cioè le frecce che mancano (tratteggiate) o le due frecce che rompono l'antisimmetrica.

```interattivo
% nome: relazione-proprieta-spie
% alt: Diagramma della relazione dell'Esempio 1 in {1, 2, 3}, con i cappi su ogni elemento e le frecce da 1 a 2 e da 2 a 3, da modificare aggiungendo e togliendo frecce e cappi, anche con quattro elementi. Quattro spie dicono se la relazione è riflessiva, simmetrica, antisimmetrica e transitiva; per una proprietà che non vale il diagramma mostra tratteggiati i cappi, le frecce di ritorno o le scorciatoie mancanti, oppure in rosso le due frecce di andata e ritorno che rompono l'antisimmetrica. Sotto è scritto l'elenco delle coppie
```

```ad-example
Esempio 2: un solo elemento rompe la riflessiva
In $\mathbb{Z}$ considera la relazione "$a \mathrel{\mathcal{R}} b$ se $a \cdot b > 0$", cioè $a$ e $b$ sono diversi da zero e hanno lo stesso segno.

Riflessiva: no. Per quasi tutti gli interi $a \cdot a > 0$, ma per $a = 0$ si ha $0 \cdot 0 = 0$, che non è maggiore di zero: lo zero non è in relazione con sé stesso.

Simmetrica: sì, perché $a \cdot b = b \cdot a$.

Antisimmetrica: no, perché $2 \cdot 5 > 0$ e $5 \cdot 2 > 0$, ma $2 \neq 5$.

Transitiva: sì. Se $a \cdot b > 0$ e $b \cdot c > 0$, allora $a$ ha lo stesso segno di $b$ e $b$ ha lo stesso segno di $c$, quindi $a$ e $c$ hanno lo stesso segno e $a \cdot c > 0$.
```

```ad-example
Esempio 3: somma pari
In $\mathbb{N}$ considera la relazione "$a \mathrel{\mathcal{R}} b$ se $a + b$ è pari".

Riflessiva: sì, perché $a + a = 2a$ è sempre pari.

Simmetrica: sì, perché $a + b = b + a$.

Antisimmetrica: no, perché $1 + 3 = 4$ è pari, quindi $1 \mathrel{\mathcal{R}} 3$ e $3 \mathrel{\mathcal{R}} 1$, ma $1 \neq 3$.

Transitiva: sì. Se $a + b$ e $b + c$ sono pari, è pari anche la loro somma $a + 2b + c$; togliendo il numero pari $2b$ resta $a + c$, che quindi è pari.
```

## Relazioni di equivalenza

Una relazione in un insieme $A$ è una **relazione di equivalenza** se è riflessiva, simmetrica e transitiva. Due elementi in relazione si dicono equivalenti.

Sono relazioni di equivalenza "essere nato nello stesso mese di" e la relazione "$a + b$ è pari" dell'esempio 3, che mette in relazione due naturali quando sono tutti e due pari o tutti e due dispari. Altri esempi che incontrerai spesso:

- in $\mathbb{N}$, "$a$ e $b$ hanno lo stesso resto nella divisione per $3$" (la divisione con resto è nella lezione [Operazioni in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/operazioni-in-n));
- tra le rette del piano, "$r$ è parallela a $s$", se si considera ogni retta parallela a sé stessa, come fanno molti libri (due rette sono parallele se non hanno punti in comune oppure coincidono);
- tra le frazioni, "$\dfrac{a}{b}$ è equivalente a $\dfrac{c}{d}$", cioè $a \cdot d = b \cdot c$ (il controllo in croce della lezione [Frazioni e numeri razionali](/materiale/scuola-superiore/matematica/numeri-razionali/frazioni-e-numeri-razionali)).

La perpendicolarità tra rette invece non è una relazione di equivalenza: è simmetrica, ma non è riflessiva e non è transitiva.

### Classi di equivalenza

Data una relazione di equivalenza $\mathcal{R}$ in $A$ e un elemento $a$, la **classe di equivalenza** di $a$ è l'insieme degli elementi di $A$ equivalenti ad $a$:

$$[a] = \{x \in A \mid x \mathrel{\mathcal{R}} a\}$$

Con "essere nato nello stesso mese di", la classe di uno studente nato a marzo è l'insieme di tutti gli studenti della classe nati a marzo, lui compreso. Le classi di equivalenza hanno tre proprietà, che vengono dalle tre proprietà della relazione:

- ogni elemento sta nella sua classe, perché $a \mathrel{\mathcal{R}} a$ (riflessiva), quindi nessuna classe è vuota;
- se $a \mathrel{\mathcal{R}} b$, allora $[a] = [b]$: due elementi equivalenti hanno la stessa classe (per la simmetrica e la transitiva);
- se $a$ e $b$ non sono equivalenti, le classi $[a]$ e $[b]$ non hanno elementi in comune.

Quindi le classi dividono $A$ in gruppi che non si sovrappongono, e ogni elemento di $A$ sta in una e una sola classe. Un elemento qualsiasi di una classe si chiama **rappresentante** della classe: la classe si può indicare con uno qualunque dei suoi elementi.

### Insieme quoziente

L'insieme di tutte le classi di equivalenza si chiama **insieme quoziente** di $A$ rispetto a $\mathcal{R}$ e si indica con $A/\mathcal{R}$. I suoi elementi sono le classi, cioè degli insiemi, non gli elementi di $A$. Per "essere nato nello stesso mese di" l'insieme quoziente ha al massimo dodici elementi, uno per ogni mese in cui è nato almeno uno studente.

```ad-example
Esempio 4: stesso resto nella divisione per 3
In $\mathbb{N}$ considera la relazione "$a \mathrel{\mathcal{R}} b$ se $a$ e $b$ hanno lo stesso resto nella divisione per $3$".

È di equivalenza. Ogni numero ha lo stesso resto di sé stesso (riflessiva); se $a$ ha lo stesso resto di $b$, anche $b$ ha lo stesso resto di $a$ (simmetrica); se $a$ ha lo stesso resto di $b$ e $b$ lo stesso di $c$, allora $a$ e $c$ hanno lo stesso resto (transitiva).

Nella divisione per $3$ il resto può essere solo $0$, $1$ o $2$, quindi le classi sono tre:
$$
\begin{gathered}
[0] = \{0, 3, 6, 9, \ldots\} \\
[1] = \{1, 4, 7, 10, \ldots\} \\
[2] = \{2, 5, 8, 11, \ldots\}
\end{gathered}
$$

L'insieme quoziente ha tre elementi: $\mathbb{N}/\mathcal{R} = \{[0],\ [1],\ [2]\}$. Ogni classe ha infiniti rappresentanti: $[1]$, $[4]$ e $[100]$ sono la stessa classe, perché $100 = 3 \cdot 33 + 1$ ha resto $1$.
```

```ad-warning
Contare i nomi invece delle classi
$[0]$, $[3]$, $[6]$, … non sono infinite classi diverse: sono tanti nomi della stessa classe. Per contare le classi conta i gruppi di elementi, non i modi di chiamarli.
```

```ad-example
Esempio 5: le classi lette sul diagramma
In $A = \{1, 2, 3, 4, 5\}$ la relazione $\mathcal{R}$ ha il diagramma qui sotto: ogni elemento ha il cappio, e le linee con due punte valgono per due frecce, una di andata e una di ritorno.

```tikz
% nome: relazione-equivalenza-classi-diagramma
% alt: Diagramma di una relazione di equivalenza nell'insieme {1, 2, 3, 4, 5}: ogni elemento ha un cappio, 1 e 4 sono collegati tra loro in una zona colorata, 2, 3 e 5 sono collegati a due a due in un'altra zona colorata
% svg: relazione-equivalenza-classi-diagramma-4784f272.svg 242x192
\begin{tikzpicture}[>=stealth, scale=1.25]
\fill[blue!15] (-0.1,0) ellipse (0.9 and 1.6);
\fill[orange!20] (2.5,0) ellipse (1.55 and 2.0);
\node (u) at (0,0.8) {$1$};
\node (q) at (0,-0.8) {$4$};
\node (d) at (2.1,1.0) {$2$};
\node (t) at (3.3,0) {$3$};
\node (c) at (2.1,-1.0) {$5$};
\draw[->] (u) to[out=150,in=210,looseness=7] (u);
\draw[->] (q) to[out=150,in=210,looseness=7] (q);
\draw[->] (d) to[out=120,in=60,looseness=7] (d);
\draw[->] (t) to[out=30,in=-30,looseness=7] (t);
\draw[->] (c) to[out=-60,in=-120,looseness=7] (c);
\draw[<->, shorten >=2pt, shorten <=2pt] (u) -- (q);
\draw[<->, shorten >=2pt, shorten <=2pt] (d) -- (t);
\draw[<->, shorten >=2pt, shorten <=2pt] (t) -- (c);
\draw[<->, shorten >=2pt, shorten <=2pt] (d) -- (c);
\end{tikzpicture}
```

Riflessiva: sì, ci sono tutti i cappi. Simmetrica: sì, ogni collegamento va nei due sensi. Transitiva: sì, perché gli elementi collegati formano due gruppi, $\{1, 4\}$ e $\{2, 3, 5\}$, e dentro ogni gruppo ogni elemento è collegato a tutti gli altri, quindi ogni percorso di due frecce ha la scorciatoia. Nessuna freccia va da un gruppo all'altro.

La relazione è di equivalenza, le classi sono i due gruppi e l'insieme quoziente è
$$
A/\mathcal{R} = \{\{1, 4\},\ \{2, 3, 5\}\}
$$
Qui $[2] = [3] = [5] = \{2, 3, 5\}$ e $[1] = [4] = \{1, 4\}$.
```

```ad-example
Esempio 6: rette parallele e frazioni equivalenti
Con il parallelismo tra le rette del piano, la classe di una retta $r$ contiene $r$ e tutte le rette parallele a $r$. Rette di classi diverse si incontrano sempre, e ogni classe individua una direzione: l'insieme quoziente è l'insieme delle direzioni del piano.

Con l'equivalenza tra frazioni la classe di $\dfrac{2}{3}$ contiene tutte le frazioni equivalenti a $\dfrac{2}{3}$:
$$
\left[\frac{2}{3}\right] = \left\{\frac{2}{3},\ \frac{4}{6},\ \frac{6}{9},\ \ldots\right\}
$$
Per esempio $\dfrac{10}{15}$ sta nella classe, perché $2 \cdot 15 = 30 = 3 \cdot 10$. Tutte queste frazioni rappresentano lo stesso numero: un numero razionale è proprio una classe di frazioni equivalenti, e $\dfrac{2}{3}$ ne è il rappresentante ridotto ai minimi termini.
```

## Relazioni d'ordine

Una relazione in un insieme $A$ è una **relazione d'ordine** se è antisimmetrica e transitiva e in più riflessiva oppure antiriflessiva:

- è una relazione d'**ordine largo** se è riflessiva, antisimmetrica e transitiva, come $\leq$;
- è una relazione d'**ordine stretto** se è antiriflessiva, antisimmetrica e transitiva, come $<$.

Un ordine largo e uno stretto vanno spesso in coppia: $a \leq b$ vuol dire "$a < b$ oppure $a = b$", e allo stesso modo $A \subseteq B$ vuol dire "$A \subset B$ oppure $A = B$".

```ad-note
Nell'ordine stretto l'antisimmetrica viene gratis
Se una relazione è antiriflessiva e transitiva, non può avere $a \mathrel{\mathcal{R}} b$ e $b \mathrel{\mathcal{R}} a$ insieme: per la transitiva avrebbe $a \mathrel{\mathcal{R}} a$, che l'antiriflessiva vieta. Quindi è anche antisimmetrica, e alcuni libri definiscono l'ordine stretto solo con le prime due proprietà.
```

### Ordine totale e ordine parziale

Due elementi $a$ e $b$ sono **confrontabili** se $a \mathrel{\mathcal{R}} b$ oppure $b \mathrel{\mathcal{R}} a$. Una relazione d'ordine è **totale** se due elementi diversi qualsiasi di $A$ sono sempre confrontabili; è **parziale** se esistono almeno due elementi diversi non confrontabili.

- $\leq$ in $\mathbb{N}$ è un ordine largo totale: di due numeri diversi, uno è sempre minore dell'altro. Lo stesso vale per $<$, che è un ordine stretto totale.
- "$a$ è un divisore di $b$" tra i naturali diversi da zero è un ordine largo parziale: $2$ e $3$ non sono confrontabili, perché nessuno dei due è divisore dell'altro.
- L'inclusione $\subseteq$ tra i sottoinsiemi di un insieme è un ordine largo parziale: $\{1\}$ e $\{2\}$ non sono confrontabili, perché nessuno dei due è incluso nell'altro. L'inclusione stretta $\subset$ è un ordine stretto parziale.

Un ordine totale mette tutti gli elementi in fila, uno dopo l'altro; un ordine parziale li mette in fila solo in parte.

```ad-example
Esempio 7: i divisori di 6
In $A = \{1, 2, 3, 6\}$ considera la relazione "$a \mathrel{\mathcal{R}} b$ se $a$ è un divisore di $b$". Le coppie sono
$$
\begin{aligned}
\mathcal{R} = \{&(1, 1),\ (2, 2),\ (3, 3), \\
&(6, 6),\ (1, 2),\ (1, 3), \\
&(1, 6),\ (2, 6),\ (3, 6)\}
\end{aligned}
$$

```tikz
% nome: relazione-ordine-divisori-di-sei
% alt: Diagramma della relazione "è un divisore di" nell'insieme {1, 2, 3, 6}: ogni elemento ha un cappio, da 1 partono frecce verso 2, 3 e 6, da 2 e da 3 parte una freccia verso 6
% svg: relazione-ordine-divisori-di-sei-53517a47.svg 202x210
\begin{tikzpicture}[>=stealth, scale=1.25]
\node (u) at (0,0) {$1$};
\node (d) at (-1.4,1.4) {$2$};
\node (t) at (1.4,1.4) {$3$};
\node (s) at (0,2.8) {$6$};
\draw[->] (u) to[out=-60,in=-120,looseness=8] (u);
\draw[->] (d) to[out=210,in=150,looseness=8] (d);
\draw[->] (t) to[out=30,in=-30,looseness=8] (t);
\draw[->] (s) to[out=120,in=60,looseness=8] (s);
\draw[->, shorten >=2pt, shorten <=2pt] (u) -- (d);
\draw[->, shorten >=2pt, shorten <=2pt] (u) -- (t);
\draw[->, shorten >=2pt, shorten <=2pt] (u) -- (s);
\draw[->, shorten >=2pt, shorten <=2pt] (d) -- (s);
\draw[->, shorten >=2pt, shorten <=2pt] (t) -- (s);
\end{tikzpicture}
```

Riflessiva: sì, ogni numero è divisore di sé stesso.

Antisimmetrica: sì, nessuna freccia tra numeri diversi ha quella di ritorno.

Transitiva: sì, i percorsi di due frecce tra elementi diversi sono $1 \to 2 \to 6$ e $1 \to 3 \to 6$, e la scorciatoia $1 \to 6$ c'è; i percorsi che passano per un cappio portano dove porta già una freccia.

È un ordine largo, ed è parziale: tra $2$ e $3$ non c'è nessuna freccia, quindi non sono confrontabili.
```

```ad-example
Esempio 8: la divisibilità tra gli interi
Tra gli interi diversi da zero considera la relazione "$a \mathrel{\mathcal{R}} b$ se $a$ è un divisore di $b$", cioè se $b = a \cdot q$ con $q$ intero.

È riflessiva ($a = a \cdot 1$) e transitiva (se $b = a \cdot q$ e $c = b \cdot p$, allora $c = a \cdot (q \cdot p)$). Non è antisimmetrica: $-2 = 2 \cdot (-1)$ e $2 = (-2) \cdot (-1)$, quindi $2 \mathrel{\mathcal{R}} {-2}$ e ${-2} \mathrel{\mathcal{R}} 2$, ma $2 \neq -2$.

La stessa relazione che in $\mathbb{N}$ è un ordine, in $\mathbb{Z}$ non lo è: le proprietà dipendono anche dall'insieme.
```

```ad-example
Esempio 9: non essere più vecchio
Tra gli studenti di una classe considera "$x \mathrel{\mathcal{R}} y$ se $x$ non ha più anni di $y$", contando l'età in anni compiuti.

È riflessiva, perché ognuno ha gli stessi anni di sé stesso, ed è transitiva. Non è antisimmetrica: due studenti diversi che hanno tutti e due quindici anni sono in relazione in tutti e due i sensi. Quindi non è una relazione d'ordine, anche se somiglia a $\leq$: il $\leq$ confronta i numeri, e due numeri uguali sono lo stesso numero, mentre qui due persone diverse possono avere la stessa età.
```

## Le relazioni della lezione a confronto

| Relazione | Insieme | Rifl. | Simm. | Antis. | Trans. | Tipo |
|---|---|---|---|---|---|---|
| stesso resto per $3$ | $\mathbb{N}$ | sì | sì | no | sì | equivalenza |
| parallelismo | rette | sì | sì | no | sì | equivalenza |
| perpendicolarità | rette | no | sì | no | no | nessuno dei due |
| $\leq$ | $\mathbb{N}$ | sì | no | sì | sì | ordine largo totale |
| $<$ | $\mathbb{N}$ | no | no | sì | sì | ordine stretto totale |
| divisore di | naturali $\neq 0$ | sì | no | sì | sì | ordine largo parziale |
| $\subseteq$ | sottoinsiemi | sì | no | sì | sì | ordine largo parziale |
