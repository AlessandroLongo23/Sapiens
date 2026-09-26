# Quantificatori

La frase "$x$ è un numero pari" non è né vera né falsa finché non sai chi è $x$: con $x = 4$ è vera, con $x = 7$ è falsa. Diventa una proposizione in due modi: sostituendo a $x$ un valore preciso, oppure dicendo per quanti valori deve valere, con parole come "per ogni" ed "esiste". Queste parole si chiamano quantificatori, e le trovi in quasi ogni definizione e teorema di matematica. Che cos'è una proposizione e come si nega è spiegato nella lezione [Proposizioni e connettivi logici](/materiale/scuola-superiore/matematica/insiemi-e-logica/proposizioni-e-connettivi-logici).

## Enunciati aperti

Un **enunciato aperto** (o predicato) è una frase che contiene una variabile, di solito $x$, e che diventa una proposizione, vera o falsa, quando al posto della variabile metti un elemento di un insieme fissato. Quell'insieme si chiama universo (o dominio) e si indica con $U$. Un enunciato aperto si indica con una lettera minuscola seguita dalla variabile tra parentesi, come $p(x)$, e si legge "$p$ di $x$".

Per esempio, nell'universo $U = \mathbb{N}$:

- $p(x)$: "$x$ è pari" è un enunciato aperto; $p(4)$ è la proposizione "$4$ è pari", vera, mentre $p(7)$ è falsa;
- $q(x)$: "$x + 3 = 5$" è un enunciato aperto; $q(2)$ è vera, $q(0)$ è falsa.

Anche "$x$ è la capitale della Francia", con $U$ l'insieme delle città europee, è un enunciato aperto: è vero solo per $x$ = Parigi.

```ad-warning
Scambiare un enunciato aperto per una proposizione
"$x > 3$" non è né vero né falso: è un enunciato aperto. Diventa una proposizione solo quando sostituisci un numero a $x$ ("$5 > 3$", vera) o quando usi un quantificatore ("esiste un naturale maggiore di 3", vera).
```

### Insieme di verità

Gli elementi dell'universo che rendono vero $p(x)$ formano l'**insieme di verità** di $p(x)$, che si indica con $V_p$:

$$V_p = \{x \in U \mid p(x)\}$$

È la stessa scrittura della rappresentazione per proprietà caratteristica, che trovi nella lezione [Rappresentazione degli insiemi](/materiale/scuola-superiore/matematica/insiemi-e-logica/rappresentazione-degli-insiemi): l'enunciato aperto è la proprietà, e $V_p$ è l'insieme che quella proprietà descrive dentro $U$.

```ad-example
Esempio 1: insiemi di verità in un universo finito
Sia $U = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}$.

- $p(x)$: "$x$ è un divisore di 12". I numeri di $U$ che dividono 12 senza resto sono $1, 2, 3, 4, 6$, quindi $V_p = \{1, 2, 3, 4, 6\}$.
- $q(x)$: "$x > 7$". $V_q = \{8, 9, 10\}$.
- $r(x)$: "$x + 1 > x$". È vero per ogni numero, quindi $V_r = U$.
- $s(x)$: "$x + 5 = 2$". Nessun elemento di $U$ lo rende vero, quindi $V_s = \emptyset$.

Nel diagramma di Eulero-Venn l'insieme di verità di $p(x)$ è la zona colorata; fuori ci sono gli elementi di $U$ che rendono falso $p(x)$.

```tikz
% nome: insieme-verita-divisori-12
% alt: Diagramma di Eulero-Venn con U formato dai numeri da 1 a 10: nell'insieme di verità colorato ci sono 1, 2, 3, 4 e 6, divisori di 12; fuori ci sono 5, 7, 8, 9 e 10
% svg: insieme-verita-divisori-12-68cbf63d.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (-1,0) circle (1.4);
\draw (-1,0) circle (1.4);
\node at (-2.3,1.45) {$V_p$};
\node at (-1.6,0.6) {$1$};
\node at (-0.4,0.6) {$2$};
\node at (-1,0) {$3$};
\node at (-1.6,-0.6) {$4$};
\node at (-0.4,-0.6) {$6$};
\node at (1.2,1) {$5$};
\node at (2.2,0.4) {$7$};
\node at (1.1,-0.2) {$8$};
\node at (2.2,-0.9) {$9$};
\node at (1.3,-1.4) {$10$};
\end{tikzpicture}
```
```

Come per la proprietà caratteristica, l'insieme di verità dipende dall'universo: "$x^2 = 4$" ha insieme di verità $\{2\}$ in $\mathbb{N}$ e $\{-2, 2\}$ in $\mathbb{Z}$.

## Quantificatore universale

Il **quantificatore universale** si scrive $\forall$ e si legge "per ogni". La proposizione

$$\forall x \in U,\ p(x)$$

si legge "per ogni $x$ appartenente a $U$, $p(x)$" ed è vera se $p(x)$ è vero per tutti gli elementi di $U$, nessuno escluso. In italiano la stessa cosa si dice con "tutti", "ogni", "qualunque sia".

Per esempio $\forall x \in \mathbb{N},\ x + 1 > x$ è vera: aggiungendo 1 a qualunque numero naturale si ottiene un numero più grande. Invece $\forall x \in \mathbb{N},\ x \text{ è pari}$ è falsa, perché $3$ è un naturale che non è pari.

### Il controesempio

Per mostrare che una proposizione con $\forall$ è falsa serve un solo elemento di $U$ per cui $p(x)$ è falso: si chiama **controesempio**. Per mostrare che è vera, invece, non bastano esempi, per quanti siano: bisogna ragionare su un elemento qualunque, come si fa in una dimostrazione.

```ad-example
Esempio 2: un controesempio che si vede poco
Stabilisci se è vera $\forall x \in \mathbb{N},\ 2x > x$.

Con $x = 1, 2, 3$ si ottiene $2 > 1$, $4 > 2$, $6 > 3$: tutto vero. Ma $0$ è un numero naturale, e con $x = 0$ si ha $2 \cdot 0 = 0$, e $0 > 0$ è falso. Lo $0$ è un controesempio, e la proposizione è falsa.

Con il segno $\ge$ le cose cambiano: $\forall x \in \mathbb{N},\ 2x \ge x$ è vera, perché $2x - x = x$ e ogni naturale è maggiore o uguale a $0$.
```

```ad-warning
Provare qualche valore e concludere "per ogni"
Controllare che $p(x)$ vale per alcuni numeri non dimostra che vale per tutti. Il numero $n^2 + n + 41$ è primo per $n = 0, 1, 2, \dots, 39$, ma per $n = 40$ vale $40^2 + 40 + 41 = 1681 = 41 \cdot 41$, che non è primo. Quaranta esempi non bastano; un controesempio basta.
```

## Quantificatore esistenziale

Il **quantificatore esistenziale** si scrive $\exists$ e si legge "esiste". La proposizione

$$\exists x \in U : p(x)$$

si legge "esiste un $x$ appartenente a $U$ tale che $p(x)$" ed è vera se c'è almeno un elemento di $U$ per cui $p(x)$ è vero. In italiano si dice anche "c'è almeno un", "qualche", "per almeno un". Alcuni libri scrivono la barra $\mid$ al posto dei due punti: il significato è lo stesso.

Qui il lavoro si inverte rispetto a $\forall$: per mostrare che una proposizione con $\exists$ è vera basta un esempio, mentre per mostrare che è falsa bisogna escludere tutti gli elementi di $U$.

```ad-example
Esempio 3: lo stesso "esiste" in due universi
Stabilisci se è vera $\exists x \in \mathbb{N} : x + 3 = 1$, e poi la stessa proposizione in $\mathbb{Z}$.

L'unico numero che sommato a 3 dà 1 è $-2$. In $\mathbb{N}$ non c'è: per ogni naturale $x$ si ha $x + 3 \ge 3$, quindi $x + 3$ non vale mai 1, e la proposizione è falsa.

In $\mathbb{Z}$ invece $-2$ c'è, e $-2 + 3 = 1$: la proposizione $\exists x \in \mathbb{Z} : x + 3 = 1$ è vera.
```

```ad-warning
Leggere "esiste" come "ne esiste uno solo"
$\exists x \in \mathbb{Z} : x^2 = 4$ è vera, anche se gli interi con quadrato 4 sono due, $-2$ e $2$. "Esiste" vuol dire almeno uno. Allo stesso modo, in matematica "qualche numero è pari" è vera anche se i numeri pari fossero tutti.
```

```ad-note
Esiste uno e un solo
Per dire che l'elemento esiste ed è unico si scrive $\exists!$, che si legge "esiste uno e un solo". $\exists! x \in \mathbb{N} : x + 3 = 5$ è vera, perché l'unico naturale è $2$. $\exists! x \in \mathbb{Z} : x^2 = 4$ è falsa, perché gli interi sono due.
```

## Il valore di verità dipende dall'universo

Come nell'esempio 3, la stessa proposizione può essere vera in un universo e falsa in un altro. Per questo l'universo va sempre scritto accanto al quantificatore.

| Proposizione | $\mathbb{N}$ | $\mathbb{Z}$ | $\mathbb{Q}$ |
|---|---|---|---|
| $\exists x : x + 3 = 1$ | F | V | V |
| $\forall x,\ x \ge 0$ | V | F | F |
| $\exists x : 2x = 1$ | F | F | V |

Nella seconda riga, in $\mathbb{Z}$ il controesempio è $-1$; nella terza, l'unico numero con doppio uguale a 1 è $\frac{1}{2}$, che è razionale ma non intero.

## Leggere e scrivere frasi con i quantificatori

Per tradurre una frase in simboli, cerca tre cose: l'universo (di quali oggetti si parla), il quantificatore ("tutti", "ogni" diventano $\forall$; "qualche", "almeno un", "c'è" diventano $\exists$) e la proprietà. Per il verso opposto, leggi i simboli da sinistra a destra: $\forall$ è "per ogni", $\exists$ è "esiste", la virgola dopo $\forall x \in U$ non si legge, i due punti dopo $\exists x \in U$ si leggono "tale che".

```ad-example
Esempio 4: dalle parole ai simboli
- "Il quadrato di un numero intero è sempre maggiore o uguale a 0": $\forall x \in \mathbb{Z},\ x^2 \ge 0$. È vera.
- "Qualche numero intero è negativo": $\exists x \in \mathbb{Z} : x < 0$. È vera, per esempio con $x = -1$.
- "Nessun numero naturale è negativo": $\forall x \in \mathbb{N},\ x \ge 0$. È vera. "Nessuno" è un "per ogni" seguito da una negazione: per ogni naturale non è vero che è negativo.
- "Non tutti i numeri naturali sono pari": è la negazione di $\forall x \in \mathbb{N},\ x \text{ è pari}$, e vuol dire $\exists x \in \mathbb{N} : x \text{ è dispari}$. È vera, per esempio con $x = 3$.
```

Molte frasi con "tutti" legano due proprietà: "ogni numero divisibile per 4 è pari" vuol dire che per ogni naturale $x$, se $x$ è divisibile per 4 allora $x$ è pari. Il "se... allora" è l'implicazione, spiegata nella lezione [Implicazione, condizioni necessarie e sufficienti](/materiale/scuola-superiore/matematica/insiemi-e-logica/implicazione-condizioni-necessarie-e-sufficienti).

## Negazione dei quantificatori

Negare "tutti gli studenti della classe hanno studiato" vuol dire affermare che la frase è falsa, cioè che c'è almeno uno studente che non ha studiato. Negare "qualche studente ha copiato" vuol dire affermare che nessuno ha copiato, cioè che ogni studente non ha copiato. In simboli, la negazione scambia $\forall$ con $\exists$ e porta il $\neg$ sull'enunciato aperto:

$$
\begin{gathered}
\neg\big(\forall x \in U,\ p(x)\big) \\
\text{equivale a} \\
\exists x \in U : \neg p(x)
\end{gathered}
$$

$$
\begin{gathered}
\neg\big(\exists x \in U : p(x)\big) \\
\text{equivale a} \\
\forall x \in U,\ \neg p(x)
\end{gathered}
$$

La prima regola è l'idea del controesempio: un "per ogni" è falso esattamente quando esiste un elemento per cui la proprietà è falsa.

```ad-warning
Negare "tutti" con "nessuno"
La negazione di "tutti gli studenti hanno studiato" non è "nessuno studente ha studiato", ma "almeno uno studente non ha studiato". Se hanno studiato in 20 su 25, la frase di partenza è falsa, ma anche "nessuno ha studiato" è falsa: le due frasi non sono una la negazione dell'altra.
```

```ad-example
Esempio 5: negare frasi del linguaggio comune
- "Tutti i treni sono partiti in orario". Negazione: "almeno un treno non è partito in orario".
- "Qualche esercizio è sbagliato". Negazione: "nessun esercizio è sbagliato", cioè "ogni esercizio è giusto".
- "Nessuno ha il telefono acceso". È un "per ogni" con la negazione dentro, quindi la negazione è "almeno una persona ha il telefono acceso".
- "Ogni numero primo è dispari". Negazione: "esiste un numero primo che non è dispari", cioè pari. La negazione è vera, perché $2$ è primo e pari; quindi la frase di partenza è falsa (i numeri primi sono nella lezione [Divisibilità e numeri primi](/materiale/scuola-superiore/matematica/numeri-naturali/divisibilita-e-numeri-primi)).
```

Quando l'enunciato aperto contiene una disuguaglianza, negarla vuol dire scegliere il simbolo opposto con attenzione: il contrario di $x > 0$ è $x \le 0$, il contrario di $x \ge 0$ è $x < 0$.

```ad-warning
Negare $>$ con $<$
Il contrario di "$x^2 > 0$" non è "$x^2 < 0$" ma "$x^2 \le 0$": un numero che non è maggiore di 0 può essere minore di 0 oppure uguale a 0.
```

```ad-example
Esempio 6: vero o falso, e la negazione
Per ogni proposizione, stabilisci se è vera e scrivi la negazione.

(a) $\forall x \in \mathbb{Z},\ x^2 > 0$. È falsa: $x = 0$ è un controesempio, perché $0^2 = 0$ e $0 > 0$ è falso. La negazione è $\exists x \in \mathbb{Z} : x^2 \le 0$, vera proprio con $x = 0$.

(b) $\exists x \in \mathbb{Z} : x^2 = 2$. È falsa: $0^2 = 0$, $1^2 = 1$, $2^2 = 4$, e per gli interi da $3$ in su il quadrato supera 4; i negativi hanno lo stesso quadrato dei loro opposti. Nessun intero ha quadrato 2. La negazione è $\forall x \in \mathbb{Z},\ x^2 \ne 2$, che è vera.

(c) $\forall x \in \mathbb{Z},\ x^2 \ge x$. È vera: per $x \le 0$ il quadrato è maggiore o uguale a 0, quindi maggiore o uguale a $x$; per $x \ge 1$ si ha $x^2 = x \cdot x \ge x \cdot 1 = x$. La negazione è $\exists x \in \mathbb{Z} : x^2 < x$, falsa.

In $\mathbb{Q}$ la (c) diventa falsa: con $x = \frac{1}{2}$ si ha $x^2 = \frac{1}{4}$, e $\frac{1}{4} < \frac{1}{2}$.
```

In ogni coppia una proposizione è vera e l'altra è falsa: è il controllo da fare ogni volta che scrivi una negazione.

## Quantificatori e insiemi

Con l'insieme di verità $V_p = \{x \in U \mid p(x)\}$ i due quantificatori diventano due domande sugli insiemi:

- $\forall x \in U,\ p(x)$ è vera se e solo se $V_p = U$, cioè se nessun elemento di $U$ resta fuori da $V_p$;
- $\exists x \in U : p(x)$ è vera se e solo se $V_p \ne \emptyset$, cioè se $V_p$ ha almeno un elemento.

L'insieme di verità di $\neg p(x)$ è il complementare di $V_p$ rispetto a $U$, cioè $\overline{V_p}$ (il complementare è nella lezione [Differenza e complementare](/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare)). Un controesempio è un elemento di $\overline{V_p}$: se ce n'è almeno uno, $V_p$ non riempie $U$ e il "per ogni" è falso.

```tikz
% nome: quantificatori-insieme-verita-controesempio
% alt: Diagramma di Eulero-Venn con l'insieme di verità V_p colorato dentro l'universo U e un elemento a nel complementare di V_p: il per ogni è falso e a è un controesempio, l'esiste è vero perché V_p non è vuoto
% svg: quantificatori-insieme-verita-controesempio-4617d97e.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (-0.8,0) circle (1.4);
\draw (-0.8,0) circle (1.4);
\node at (-0.8,0) {$V_p$};
\fill (1.9,-0.6) circle (0.06);
\node[above] at (1.9,-0.6) {$a$};
\node at (1.6,1.2) {$\overline{V_p}$};
\end{tikzpicture}
```

Nella figura $V_p$ non è vuoto, quindi $\exists x \in U : p(x)$ è vera; l'elemento $a$ sta fuori da $V_p$, quindi $p(a)$ è falsa, $a$ è un controesempio e $\forall x \in U,\ p(x)$ è falsa.

Nell'esempio 1 ($U = \{1, 2, \dots, 10\}$): $\forall x \in U,\ x + 1 > x$ è vera perché $V_r = U$; $\exists x \in U : x > 7$ è vera perché $V_q = \{8, 9, 10\}$ non è vuoto; $\exists x \in U : x + 5 = 2$ è falsa perché $V_s = \emptyset$.

## Due quantificatori

Una frase può contenere due variabili e due quantificatori. "Ogni numero naturale ha un successivo" si scrive

$$\forall x \in \mathbb{N},\ \exists y \in \mathbb{N} : y = x + 1$$

e si legge "per ogni naturale $x$ esiste un naturale $y$ tale che $y = x + 1$". È vera: dato $x$, il numero $y$ cercato è $x + 1$, e cambia al cambiare di $x$.

Se scambi l'ordine dei due quantificatori ottieni

$$\exists y \in \mathbb{N} : \forall x \in \mathbb{N},\ y = x + 1$$

che dice "esiste un naturale $y$ che è il successivo di tutti i naturali". È falsa: $y$ dovrebbe essere insieme $0 + 1 = 1$ e $1 + 1 = 2$.

```ad-warning
Scambiare un $\forall$ e un $\exists$
Quando i quantificatori sono diversi, l'ordine cambia il significato. "Per ogni naturale ne esiste uno più grande" ($\forall x \in \mathbb{N},\ \exists y \in \mathbb{N} : y > x$) è vera; "esiste un naturale più grande di tutti" ($\exists y \in \mathbb{N} : \forall x \in \mathbb{N},\ y > x$) è falsa, perché $y$ dovrebbe essere più grande anche di sé stesso. Due quantificatori uguali, invece, si possono scambiare.
```
