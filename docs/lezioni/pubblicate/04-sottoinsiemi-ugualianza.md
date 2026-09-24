# Sottoinsiemi e uguaglianza

Tutti gli studenti della 1A sono iscritti alla tua scuola, ma non tutti gli iscritti sono della 1A: l'insieme degli studenti della 1A è contenuto in quello degli iscritti. In matematica questa relazione si chiama inclusione, e serve anche a dire con precisione quando due insiemi sono uguali. Per le definizioni di insieme, elemento e appartenenza ($\in$) parti da [Prime definizioni](/materiale/scuola-superiore/matematica/insiemi-e-logica/prime-definizioni).

## Sottoinsieme e inclusione

Dati due insiemi $A$ e $B$, si dice che $A$ è un **sottoinsieme** di $B$ se ogni elemento di $A$ è anche elemento di $B$. Si scrive

$$A \subseteq B$$

e si legge "$A$ è incluso in $B$" oppure "$A$ è contenuto in $B$". La relazione tra i due insiemi si chiama **inclusione**. Si può anche scrivere al contrario, $B \supseteq A$, che si legge "$B$ contiene $A$". Quando $A$ non è un sottoinsieme di $B$ si scrive $A \not\subseteq B$.

In un diagramma di Eulero-Venn il sottoinsieme si disegna tutto dentro l'insieme che lo contiene.

Con gli insiemi $A = \{1, 3\}$ e $B = \{1, 2, 3, 4, 5\}$ dell'esempio qui sotto:

```tikz
% nome: sottoinsieme-inclusione-diagramma-venn
% alt: Inclusione tra insiemi: nel diagramma di Eulero-Venn il cerchio A con gli elementi 1 e 3 è tutto dentro il cerchio B, che contiene anche 2, 4 e 5
% svg: sottoinsieme-inclusione-diagramma-venn-7d3281a5.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\draw (0.3,0) circle (1.75);
\draw (-0.4,0) circle (0.8);
\node at (-0.4,1.05) {$A$};
\node at (2.3,1.25) {$B$};
\node at (-0.65,0.25) {$1$};
\node at (-0.2,-0.3) {$3$};
\node at (1.0,0.95) {$2$};
\node at (1.45,0) {$4$};
\node at (0.9,-0.95) {$5$};
\end{tikzpicture}
```

Per decidere se $A \subseteq B$ devi controllare tutti gli elementi di $A$, uno per uno. Per dire che $A \not\subseteq B$, invece, ti serve un solo elemento di $A$ che non sta in $B$.

```ad-example
Esempio 1: controllare un'inclusione
Siano $A = \{1, 3\}$, $B = \{1, 2, 3, 4, 5\}$ e $C = \{1, 6\}$.

Gli elementi di $A$ sono $1$ e $3$, ed entrambi appartengono a $B$: quindi $A \subseteq B$.

In $C$ c'è il $6$, che non appartiene a $B$. Quel solo elemento è sufficiente: $C \not\subseteq B$, anche se l'altro elemento di $C$, cioè $1$, sta in $B$.
```

```ad-warning
Confondere appartenenza e inclusione
Il simbolo $\in$ lega un elemento a un insieme; il simbolo $\subseteq$ lega due insiemi. Con $B = \{2, 4, 6\}$:

- $2 \in B$ è vero: il numero $2$ è un elemento di $B$;
- $\{2\} \subseteq B$ è vero: l'insieme che contiene solo $2$ è un sottoinsieme di $B$;
- $\{2\} \in B$ è falso: gli elementi di $B$ sono numeri, e $\{2\}$ è un insieme;
- $2 \subseteq B$ non ha senso, perché $2$ non è un insieme.
```

Dalla definizione seguono due fatti che valgono per qualunque insieme $A$.

Ogni insieme è sottoinsieme di sé stesso, $A \subseteq A$, perché ogni elemento di $A$ appartiene ad $A$.

L'insieme vuoto è sottoinsieme di ogni insieme, $\emptyset \subseteq A$. Per smentire l'inclusione servirebbe un elemento di $\emptyset$ che non sta in $A$, ma $\emptyset$ non ha elementi: non c'è niente da smentire, quindi l'inclusione è vera.

```ad-warning
Credere che l'insieme vuoto sia un elemento di ogni insieme
L'insieme vuoto è sottoinsieme di ogni insieme, ma non è elemento di ogni insieme. Con $A = \{1, 2\}$ si ha $\emptyset \subseteq A$, mentre $\emptyset \in A$ è falso: gli elementi di $A$ sono solo i numeri $1$ e $2$. Non confondere nemmeno $\emptyset$ con $\{0\}$: $\{0\}$ ha un elemento, il numero zero (lo trovi in [Prime definizioni](/materiale/scuola-superiore/matematica/insiemi-e-logica/prime-definizioni)).
```

## Inclusione stretta

Se $A \subseteq B$ e in più $B$ ha almeno un elemento che non sta in $A$, cioè $A \neq B$, si parla di **inclusione stretta** e si scrive

$$A \subset B$$

Il simbolo $\subseteq$ ricorda $\le$ e il simbolo $\subset$ ricorda $<$: con $\subseteq$ i due insiemi possono coincidere, con $\subset$ no.

```ad-example
Esempio 2: inclusione larga o stretta
Nell'esempio 1, $A = \{1, 3\}$ e $B = \{1, 2, 3, 4, 5\}$. Sappiamo che $A \subseteq B$; inoltre $2 \in B$ ma $2 \notin A$, quindi $A \neq B$ e si può scrivere $A \subset B$.

Per $A$ con sé stesso vale $A \subseteq A$, ma non $A \subset A$.

Per gli insiemi numerici vale $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$: ogni naturale è intero, ogni intero è razionale, ogni razionale è reale, e ogni volta l'insieme più grande ha elementi in più (per esempio $-1 \in \mathbb{Z}$ ma $-1 \notin \mathbb{N}$).
```

```ad-warning
Usare l'inclusione stretta tra un insieme e sé stesso
$A \subset A$ è sempre falso, perché l'inclusione stretta richiede che i due insiemi siano diversi. Si scrive $A \subseteq A$.
```

```ad-note
Il simbolo ⊂ nei diversi libri
La notazione non è la stessa in tutti i libri. Nei libri di testo italiani di solito $\subseteq$ indica l'inclusione e $\subset$ l'inclusione stretta, come in questa lezione. Alcuni testi, soprattutto universitari o stranieri, usano invece $\subset$ per l'inclusione in generale e scrivono $\subsetneq$ per quella stretta. Quando trovi $\subset$ in un esercizio, controlla quale convenzione segue il tuo libro.
```

## Sottoinsiemi propri e impropri

Ogni insieme $A$ ha sempre almeno due sottoinsiemi: l'insieme vuoto e $A$ stesso. Questi due si chiamano **sottoinsiemi impropri** di $A$. Tutti gli altri sottoinsiemi, se ce ne sono, si chiamano **sottoinsiemi propri**.

```ad-example
Esempio 3: tutti i sottoinsiemi di un insieme
Scriviamo tutti i sottoinsiemi di $A = \{a, b, c\}$, ordinati per numero di elementi:

- con 0 elementi: $\emptyset$;
- con 1 elemento: $\{a\}$, $\{b\}$, $\{c\}$;
- con 2 elementi: $\{a, b\}$, $\{a, c\}$, $\{b, c\}$;
- con 3 elementi: $\{a, b, c\}$.

Sono 8 in tutto. I sottoinsiemi impropri sono $\emptyset$ e $\{a, b, c\}$; gli altri 6 sono propri.
```

```ad-note
Un'altra convenzione per i sottoinsiemi propri
Anche qui i libri non sono tutti d'accordo. Alcuni chiamano "proprio" ogni sottoinsieme diverso da $A$, e quindi considerano proprio anche $\emptyset$. Con quella convenzione "sottoinsieme proprio" e "inclusione stretta" vogliono dire la stessa cosa.
```

## Uguaglianza tra insiemi

Due insiemi sono **uguali** quando hanno esattamente gli stessi elementi. Con l'inclusione lo si dice così: $A = B$ quando ogni elemento di $A$ sta in $B$ e ogni elemento di $B$ sta in $A$, cioè

$$A = B \quad \text{se e solo se} \quad A \subseteq B \ \text{ e } \ B \subseteq A$$

Per questo, quando si deve dimostrare che due insiemi sono uguali, si controllano le due inclusioni una alla volta. Il metodo si chiama **doppia inclusione**.

Conta solo quali elementi ci sono, non come l'insieme è scritto. Ne seguono tre conseguenze:

- l'ordine in cui elenchi gli elementi non conta: $\{1, 2, 3\} = \{3, 1, 2\}$;
- scrivere due volte lo stesso elemento non aggiunge niente: $\{1, 1, 2, 3\}$ è lo stesso insieme di $\{1, 2, 3\}$, anche se di solito ogni elemento si scrive una volta sola;
- lo stesso insieme può essere descritto in modi diversi, per elencazione o con una proprietà (le due rappresentazioni sono spiegate in [Rappresentazione degli insiemi](/materiale/scuola-superiore/matematica/insiemi-e-logica/rappresentazione-degli-insiemi)).

```ad-example
Esempio 4: lettere di una parola
Sia $A$ l'insieme delle lettere della parola "casa" e $B$ l'insieme delle lettere della parola "sacca".

Le lettere di "casa" sono c, a, s, a: la a compare due volte, ma nell'insieme si conta una volta sola, quindi $A = \{c, a, s\}$. Le lettere di "sacca" danno $B = \{s, a, c\}$.

I due insiemi hanno gli stessi elementi in un ordine diverso, quindi $A = B$, anche se le due parole sono diverse e hanno un numero diverso di lettere.
```

```ad-warning
Credere che due insiemi con lo stesso numero di elementi siano uguali
Due insiemi sono uguali se hanno gli stessi elementi, non lo stesso numero di elementi. $\{1, 2, 3\}$ e $\{a, b, c\}$ hanno tre elementi ciascuno ma sono diversi.
```

```ad-example
Esempio 5: un insieme descritto da una proprietà
Siano $A = \{x \in \mathbb{Z} \mid x^2 = 1\}$ e $B = \{-1, 1\}$.

Gli interi il cui quadrato è $1$ sono $1$ e $-1$, perché $1^2 = 1$ e $(-1)^2 = 1$, mentre per ogni altro intero il quadrato è $0$ oppure almeno $4$. Quindi $A = \{-1, 1\}$ e $A = B$.

Se invece la proprietà fosse $x \in \mathbb{N}$, cioè $C = \{x \in \mathbb{N} \mid x^2 = 1\}$, resterebbe solo $1$, perché $-1$ non è un numero naturale: $C = \{1\}$ e $C \neq B$. In questo caso $C \subset B$.
```

```ad-example
Esempio 6: dimostrare un'uguaglianza con la doppia inclusione
Siano
$$A = \{x \in \mathbb{N} \mid x \text{ è un divisore pari di } 12\}, \qquad B = \{2k \mid k \text{ è un divisore di } 6\}.$$

Troviamo gli elementi. I divisori di $12$ sono $1, 2, 3, 4, 6, 12$ e quelli pari sono $2, 4, 6, 12$: quindi $A = \{2, 4, 6, 12\}$. I divisori di $6$ sono $1, 2, 3, 6$ e i loro doppi sono $2, 4, 6, 12$: quindi $B = \{2, 4, 6, 12\}$.

$A \subseteq B$: ciascuno degli elementi $2, 4, 6, 12$ di $A$ compare in $B$.

$B \subseteq A$: ciascuno degli elementi $2, 4, 6, 12$ di $B$ è un divisore pari di $12$, quindi sta in $A$.

Valgono entrambe le inclusioni, quindi $A = B$.
```

```ad-example
Esempio 7: quando lo zero fa la differenza
Siano $A = \{x \in \mathbb{N} \mid x < 4\}$ e $B = \{1, 2, 3\}$.

Poiché $0 \in \mathbb{N}$, si ha $A = \{0, 1, 2, 3\}$. Ogni elemento di $B$ sta in $A$, quindi $B \subseteq A$. Ma $0 \in A$ e $0 \notin B$, quindi $A \not\subseteq B$. Una delle due inclusioni non vale, perciò $A \neq B$; più precisamente $B \subset A$.
```

## Proprietà dell'inclusione

L'inclusione ha tre proprietà, valide per qualunque terna di insiemi $A$, $B$, $C$.

| Proprietà | Enunciato |
|---|---|
| Riflessiva | $A \subseteq A$ |
| Antisimmetrica | se $A \subseteq B$ e $B \subseteq A$, allora $A = B$ |
| Transitiva | se $A \subseteq B$ e $B \subseteq C$, allora $A \subseteq C$ |

La proprietà antisimmetrica è la doppia inclusione vista sopra. La transitiva dice che le inclusioni si possono mettere in catena: se ogni elemento di $A$ sta in $B$ e ogni elemento di $B$ sta in $C$, allora ogni elemento di $A$ sta in $C$. Dalla catena $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$ si ricava così, per esempio, $\mathbb{N} \subset \mathbb{R}$.

Se $A$ e $B$ sono insiemi finiti e $A \subseteq B$, allora $A$ ha al massimo tanti elementi quanti $B$. Il viceversa non vale: $\{1, 2\}$ e $\{3, 4\}$ hanno due elementi ciascuno, ma nessuno dei due è incluso nell'altro.

Con l'inclusione si descrivono anche le operazioni tra insiemi: per esempio ciascuno dei due insiemi è incluso nella loro [unione](/materiale/scuola-superiore/matematica/insiemi-e-logica/unione-insiemistica) e contiene la loro [intersezione](/materiale/scuola-superiore/matematica/insiemi-e-logica/intersezione-insiemistica).
