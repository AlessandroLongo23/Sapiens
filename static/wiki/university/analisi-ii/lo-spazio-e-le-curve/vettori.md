# Lo spazio e le curve 🌌

## 1.1 Lo spazio e la distanza

### 1.1.1 Vettori e norma nello spazio

In matematica, lo spazio può essere rappresentato in diverse dimensioni:

* **$\mathbb{R}^2$**: Indica l'insieme dei punti nel piano $(x, y)$, dove $x, y$ sono numeri reali.
* **$\mathbb{R}^3$**: Indica lo spazio dei vettori $\{(x, y, z) : x, y, z \in \mathbb{R}\}$.
* **$\mathbb{R}^n$**: Generalmente, rappresenta lo spazio dei vettori $(x_1, ..., x_n)$, con $x_1, ..., x_n \in \mathbb{R}$.

#### Definizione 1.1: Norma e Distanza

La **norma** di un vettore $x = (x_1, ..., x_n)$ è definita come:

$$|x| \coloneqq \sqrt{x_1^2 + \cdots + x_n^2}$$

**Rappresentazione della norma in $\mathbb{R}^2$:**

```tikz
\begin{tikzpicture}
\draw[->] (0,0) -- (4,0) node[below] {$x$};
\draw[->] (0,0) -- (0,3) node[left] {$y$};
\draw[thick] (0,0) -- (3,2) node[above right] {$\sqrt{x^2+y^2}$};
\draw[dashed] (3,0) node[below] {$x$} -- (3,2);
\draw[dashed] (0,2) node[left] {$y$} -- (3,2);
\end{tikzpicture}
```

La **distanza** tra due vettori $x, y \in\mathbb{R}^n$ è data da:

$$\text{dist}(x, y) := |x - y|$$

#### Proposizione 1.1: Disuguaglianza Triangolare

Per due vettori $x, y \in \mathbb{R}^n$, vale la seguente disuguaglianza:

$$|x + y| \le |x| + |y|$$

#### Palle (Dischi) e Sfera (Cerchi)

* Una **palla chiusa** (o disco se $n=2$) con centro $p \in \mathbb{R}^n$ e raggio $r > 0$ è definita come:
$$B(p, r] := {x \in \mathbb{R}^n : |x - p| \le r}$$

* Una **palla aperta** con lo stesso centro e raggio è:
$$B(p, r[ := {x \in \mathbb{R}^n : |x - p| < r}$$

* La **sfera** (o cerchio se $n=2$) con centro $p$ e raggio $r$ è:
$$\partial B(p, r] = \partial B(p, r[ := {x \in \mathbb{R}^n : |x - p| = r}$$

#### Cubi (Quadrati)

* Un **cubo chiuso** (o quadrato se $n=2$) con centro $p = (p_1, ..., p_n)$ e raggio $r$ è definito come:
$$Q(p, r] := {(x_1, ..., x_n) \in \mathbb{R}^n : |x_1 - p_1| \le r, ..., |x_n - p_n| \le r}$$

* Il **cubo aperto** con lo stesso centro e raggio è:
$$Q(p, r[ := {(x_1, ..., x_n) \in \mathbb{R}^n : |x_1 - p_1| < r, ..., |x_n - p_n| < r}$$

**Osservazione:** Un punto si trova in un disco quando la sua distanza dal centro è minore del raggio; si trova in un quadrato quando le sue componenti distano meno di $r$ dalle rispettive componenti del centro.

- - -

### 1.1.2 Inclusioni tra palle e cubi

#### Proposizione 1.2

Ogni palla contiene un cubo con lo stesso centro e viceversa. Questo significa che per ogni $p \in \mathbb{R}^n$ e $r > 0$, si ha:

$B(p, r] \subseteq Q(p, r]$

$Q(p, r] \subseteq B(p, r\sqrt{n}]$

**Dimostrazione:**
Se $x \in B(p, r]$, allora per ogni $i = 1, ..., n$, si ha $|x_i - p_i| \le |x - p| \le r$, da cui $x \in Q(p, r]$.
Viceversa, se $x \in Q(p, r]$, allora:

$|x - p|^2 = \sum_{i=1}^n |x_i - p_i|^2 \le \sum_{i=1}^n r^2 = n r^2$ 

quindi $x \in B(p, r\sqrt{n}]$.

**Rappresentazione delle inclusioni in $\mathbb{R}^2$:**

```tikz
\begin{tikzpicture}
\draw[thick] (0,0) circle (2cm); % Outer circle (palla)
\draw[thick] (-1.414,-1.414) rectangle (1.414,1.414); % Inner square (cubo) with side 2*r/sqrt(2) approx 1.414
\draw[thick] (0,0) circle (1cm); % Inner circle (palla)
\draw[thick] (-1,-1) rectangle (1,1); % Outer square (cubo) with side 2*r
\fill (0,0) circle (1.5pt) node[below right] {$p$};
\end{tikzpicture}
```

- - -

### 1.1.3 Intorni in $\mathbb{R}^n$

#### Definizione 1.2: Intorno di un punto

Un **intorno** di un punto $p \in \mathbb{R}^n$ è un insieme che contiene una palla centrata in $p$.

**Esempio 1.1:**
Sono intorni di $(0,0)$ gli insiemi $\mathbb{R}^2$ e $Q((0,0), \dfrac{1}{10^6}]$.
Invece, l'insieme ${(x,y) \in \mathbb{R}^2 : y \ge x}$ non è un intorno dell'origine.

I punti interni a un insieme sono quelli dai quali ci si può "allargare" un po' rimanendo dentro l'insieme.

#### Definizione 1.3: Punti interni - interno di un insieme

Sia $D \subset \mathbb{R}^n$. Un punto $p \in D$ è **interno** a $D$ se esiste $\delta > 0$ tale che $B(p, \delta[ \subset D$.
L'**interno** di $D$, indicato con $\text{int}(D)$, è l'insieme di tutti i punti interni a $D$.

- - -

### 1.1.4 Aperti e chiusi in $\mathbb{R}^n$

#### Definizione 1.4: Insiemi aperti e chiusi

* Un insieme $D \subset \mathbb{R}^n$ si dice **aperto** se ogni suo punto è interno.
* Un insieme è **chiuso** se il suo complementare è aperto.

L'insieme vuoto ($\emptyset$) e tutto $\mathbb{R}^n$ sono sia aperti che chiusi.

**Esempio 1.2:** Un disco aperto $D = B(q, r[$ è un insieme aperto.

**Esempio 1.3:** Un quadrato chiuso e un disco chiuso sono insiemi chiusi.

#### Definizione 1.5: Chiusura, bordo

* La **chiusura** $\overline{D}$ di un insieme $D \subset \mathbb{R}^n$ è il più piccolo insieme chiuso che contiene $D$.
* La **frontiera** o **bordo** di $D$ è $\partial D := \overline{D} \setminus \text{int}(D)$.

**Rappresentazione concettuale di D, int(D) e $\overline{D}$:**

```tikz
\begin{tikzpicture}
\draw[thick, red] (0,0) circle (2cm); % Represents D (boundary visible)
\fill[green, opacity=0.5] (0,0) circle (1.8cm); % Represents int(D)
\draw[thick, blue] (0,0) circle (2cm); % Represents D-bar (including boundary)
\node at (0,1) {$D$};
\node at (0,0.5) {$\text{int}(D)$};
\node at (0,1.5) {$\overline{D}$};
\end{tikzpicture}
```

#### Proposizione 1.3: Caratterizzazione della chiusura

Un punto $p$ appartiene alla chiusura di $D$ se e solo se ogni intorno di $p$ contiene punti di $D$.

- - -

### 1.1.5 Il prodotto scalare

Il **prodotto scalare** tra due vettori $x = (x_1, ..., x_n)$ e $y = (y_1, ..., y_n)$ di $\mathbb{R}^n$ è un numero reale dato da:

$x \cdot y = x_1 y_1 + \cdots + x_n y_n$

Due vettori $x$ e $y$ si dicono **ortogonali** se $x \cdot y = 0$.

#### Proposizione 1.4: Disuguaglianza di Cauchy-Schwarz

Siano $x, y \in \mathbb{R}^n$. Allora:

$|x \cdot y| \le |x||y|$

Si ha l'uguaglianza se e solo se $x$ e $y$ sono dipendenti. Più precisamente, se $x, y$ non sono nulli:

* $x \cdot y = |x||y| \iff y = \lambda x$ per qualche $\lambda > 0$
* $x \cdot y = -|x||y| \iff y = \lambda x$ per qualche $\lambda < 0$

**Rappresentazione della disuguaglianza di Cauchy-Schwarz:**

```tikz
\begin{tikzpicture}
\draw[->] (0,0) -- (2,1) node[above right] {$x$};
\draw[->] (0,0) -- (1.5, -1) node[below right] {$y$};
\draw[dashed] (0,0) circle (2.2cm); % Unit circle for context
\end{tikzpicture}
```

**Esempio 1.6:**
Siano $x, y$ due vettori di $\mathbb{R}^n$. Allora:

$|x+y|^2 = (x+y) \cdot (x+y) = x \cdot x + 2x \cdot y + y \cdot y = |x|^2 + 2x \cdot y + |y|^2$

- - -

### 1.1.6 Alcuni insiemi notevoli

Ricordiamo alcuni insiemi che incontreremo frequentemente:

* **Ellisse**: L'equazione di un'ellisse con centro $(a,b) \in \mathbb{R}^2$ e semiassi $A, B > 0$ è:
$$\Sigma \coloneq \left{(x,y) : \dfrac{(x-a)^2}{A^2} + \dfrac{(y-b)^2}{B^2} = 1\right}$$

Per riconoscere un'ellisse da un'equazione generale, si usa il metodo del completamento del quadrato.

**Esempio 1.8:** L'equazione $x^2 - 4x + 3y^2 + 18y + 6 = 0$ può essere riscritta come $\dfrac{(x-2)^2}{5^2} + \dfrac{(y+3)^2}{\left(\frac{5}{\sqrt{3}}\right)^2} = 1$, che è un'ellisse con centro $(2, -3)$ e semiassi $\left(5, \dfrac{5}{\sqrt{3}}\right)$.

* **Retta in $\mathbb{R}^2$**: L'equazione di una retta è del tipo $ax+by+c=0$. Questa retta è perpendicolare al vettore $(a, b)$.

* **Piano in $\mathbb{R}^3$**: L'equazione di un piano è del tipo $ax+by+cz+d=0$. Si tratta di un piano perpendicolare al vettore $(a,b,c)$.

* **Cilindro**: L'equazione di un cilindro con asse parallelo all'asse $z$ passante per $(a,b,0)$ è del tipo $(x-a)^2 + (y-b)^2 = r^2$, con $r \ge 0$.
