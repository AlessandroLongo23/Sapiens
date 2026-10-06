# Coefficiente angolare e retta per due punti

Sui cartelli stradali una salita del $10\%$ vuol dire che la strada sale di $10$ metri ogni $100$ metri percorsi in orizzontale. Anche una retta del piano cartesiano ha una pendenza, e nell'equazione $y = mx + q$ la pendenza è il numero $m$. Da $m$ si capisce a colpo d'occhio se la retta sale o scende e quanto è ripida, e con $m$ si scrive l'equazione della retta che passa per un punto dato, o per due punti dati. La forma esplicita e la forma implicita dell'equazione, e i casi particolari, sono nella lezione [Equazione della retta e casi particolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari).

## La pendenza di una retta

Sulla retta $y = mx + q$, quando l'ascissa di un punto aumenta di $1$, l'ordinata aumenta di $m$. Con $y = 2x + 1$, per esempio, il punto di ascissa $0$ ha ordinata $1$, quello di ascissa $1$ ha ordinata $3$ e quello di ascissa $2$ ha ordinata $5$: a ogni passo di $1$ verso destra la retta sale di $2$. Il numero $m$ si chiama **coefficiente angolare** della retta e misura la sua pendenza.

Lo stesso vale per spostamenti di qualunque lunghezza. Prendi due punti $A(x_A, y_A)$ e $B(x_B, y_B)$ della retta, e chiama $\Delta x$ (si legge "delta $x$") lo spostamento in orizzontale da $A$ a $B$ e $\Delta y$ quello in verticale:

$$
\begin{gathered}
\Delta x = x_B - x_A \\
\Delta y = y_B - y_A
\end{gathered}
$$

Il rapporto tra i due spostamenti è sempre il coefficiente angolare:

$$m = \dfrac{\Delta y}{\Delta x}$$

La retta della figura, $y = \frac{2}{3}x + \frac{1}{3}$, passa per $A(1, 1)$ e per $B(4, 3)$. Da $A$ a $B$ ci si sposta di $3$ verso destra e di $2$ verso l'alto, e $\frac{2}{3}$ è proprio il coefficiente di $x$.

```tikz
% nome: coefficiente-angolare-delta-x-delta-y
% alt: La retta y = 2/3 x + 1/3 passa per i punti A(1, 1) e B(4, 3); da A a B lo spostamento orizzontale è 3 e quello verticale è 2, e il loro rapporto 2/3 è il coefficiente angolare
% svg: coefficiente-angolare-delta-x-delta-y-5ac16271.svg 179x157
\begin{tikzpicture}[scale=0.6]
\draw[gray!25, very thin] (-1,-1) grid (5,4);
\draw[->] (-1.4,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-1.4) -- (0,4.6) node[above] {$y$};
\foreach \x in {1,2,3,4} \draw (\x,0.1) -- (\x,-0.1) node[below] {\small $\x$};
\foreach \y in {1,2,3} \draw (0.1,\y) -- (-0.1,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (-1,-0.333) -- (5.3,3.867);
\draw[thick, red!50] (1,1) -- (4,1) -- (4,3);
\node[below, red!60!black] at (2.5,1) {$\Delta x = 3$};
\node[right, red!60!black] at (4,2) {$\Delta y = 2$};
\fill (1,1) circle (0.09) node[above left] {$A$};
\fill (4,3) circle (0.09) node[above left] {$B$};
\end{tikzpicture}
```
```grafico
% nome: coefficiente-angolare-due-punti-cursori
% alt: La retta y = 2/3 x + 1/3 con due punti A e B che scorrono sulla retta, mossi dai cursori delle loro ascisse u e v, e i due spostamenti da A a B in rosso: sotto il piano sono scritti lo spostamento orizzontale, quello verticale e il loro rapporto, che resta 2/3
curva: y=\frac{2}{3}x+\frac{1}{3}
curva: A=\left(u;\frac{2}{3}u+\frac{1}{3}\right) | nero
curva: B=\left(v;\frac{2}{3}v+\frac{1}{3}\right) | nero
curva: \left(u+t\left(v-u\right);\frac{2}{3}u+\frac{1}{3}\right) | rosso | t da 0 a 1
curva: \left(v;\frac{2}{3}u+\frac{1}{3}+\frac{2}{3}t\left(v-u\right)\right) | rosso | t da 0 a 1
cursore: u = 1 da -4 a 6 passo 0,5
cursore: v = 4 da -4 a 6 passo 0,5
finestra: x da -5 a 7, y da -3 a 5
valore: \Delta x = v-u
valore: \Delta y = \frac{2}{3}\left(v-u\right)
valore: \frac{\Delta y}{\Delta x} = \frac{\frac{2}{3}\left(v-u\right)}{v-u}
domanda: I cursori $u$ e $v$ sono le ascisse di $A$ e di $B$. Allontana i due punti, poi porta $B$ a sinistra di $A$: $\Delta x$ e $\Delta y$ cambiano, e il loro rapporto?
```

Il motivo è un conto. $A$ e $B$ stanno sulla retta, quindi le loro coordinate rispettano l'equazione: $y_A = mx_A + q$ e $y_B = mx_B + q$. Sottraendo la prima uguaglianza dalla seconda, $q$ se ne va:

$$
\begin{aligned}
y_B - y_A &= mx_B - mx_A \\
&= m(x_B - x_A)
\end{aligned}
$$

cioè $\Delta y = m \cdot \Delta x$. Il rapporto quindi non dipende dai due punti scelti: su una retta la pendenza è la stessa dappertutto.

### Il segno di $m$

Il segno del coefficiente angolare dice come va la retta, letta da sinistra a destra:

- se $m > 0$, quando $x$ aumenta aumenta anche $y$, e la retta sale;
- se $m < 0$, quando $x$ aumenta $y$ diminuisce, e la retta scende;
- se $m = 0$, $y$ non cambia mai, e la retta è orizzontale: la sua equazione è $y = q$.

Più $m$ è grande in valore assoluto, più la retta è ripida: $y = 3x$ è più ripida di $y = x$, che a sua volta lo è più di $y = \frac{1}{3}x$. La retta $y = -2x$ scende, e scende ripida quanto sale $y = 2x$. La retta $y = x$, con $m = 1$, è la bisettrice del primo e del terzo quadrante e forma con l'asse $x$ un angolo di $45^\circ$: il nome "coefficiente angolare" viene da qui, perché $m$ dice quanto la retta è inclinata rispetto all'asse $x$.

```tikz
% nome: coefficiente-angolare-rette-per-origine
% alt: Quattro rette per l'origine: m = 3 è la più ripida, m = 1 è la bisettrice, m = 1/3 è quasi orizzontale, e m = -2 scende da sinistra a destra
% svg: coefficiente-angolare-rette-per-origine-e3cbeab7.svg 193x180
\begin{tikzpicture}[scale=0.6]
\draw[gray!25, very thin] (-3,-3) grid (3,3);
\draw[->] (-3.4,0) -- (3.6,0) node[right] {$x$};
\draw[->] (0,-3.4) -- (0,3.6) node[above] {$y$};
\foreach \x in {-2,-1,1,2} \draw (\x,0.1) -- (\x,-0.1);
\foreach \y in {-2,-1,1,2} \draw (0.1,\y) -- (-0.1,\y);
\node[below left] at (0,0) {\small $O$};
\draw[thick, blue!60] (-1,-3) -- (1,3) node[above] {\small $m = 3$};
\draw[thick, teal!60] (-3,-3) -- (3,3) node[right] {\small $m = 1$};
\draw[thick, violet!50] (-3,-1) -- (3,1) node[right] {\small $m = \frac{1}{3}$};
\draw[thick, red!50] (-1.5,3) -- (1.5,-3) node[right] {\small $m = -2$};
\end{tikzpicture}
```

```ad-warning
Pendenza e ordinata all'origine
Il coefficiente angolare dice quanto la retta è inclinata, non dove taglia l'asse $y$: quello lo dice $q$. Le rette $y = 2x$ e $y = 2x + 5$ hanno la stessa pendenza e sono parallele, anche se la seconda sta più in alto.
```

### Rette orizzontali e rette verticali

Due punti di una retta orizzontale hanno la stessa ordinata, quindi $\Delta y = 0$ e il coefficiente angolare è $m = 0$. Due punti di una retta verticale hanno invece la stessa ascissa: $\Delta x = 0$, e il rapporto $\dfrac{\Delta y}{\Delta x}$ non si può calcolare, perché non si divide per zero. Una retta verticale non ha coefficiente angolare, e infatti la sua equazione, $x = h$, non si può scrivere nella forma $y = mx + q$.

```ad-warning
La retta verticale non ha $m = 0$
$m = 0$ è la retta orizzontale, quella che non sale e non scende. La retta verticale, che a prima vista sembrerebbe "la più ripida di tutte", non ha nessun coefficiente angolare: non esiste un numero $m$ che la descriva.
```

## Il coefficiente angolare da due punti

Se conosci due punti $A(x_A, y_A)$ e $B(x_B, y_B)$ di una retta, con $x_A \neq x_B$, il suo coefficiente angolare è

$$m = \dfrac{y_B - y_A}{x_B - x_A}$$

I due punti si possono prendere nell'ordine che vuoi: scambiando $A$ e $B$ cambiano segno sia il numeratore sia il denominatore, e il rapporto resta lo stesso. L'ordine però deve essere lo stesso sopra e sotto la linea di frazione.

```ad-example
Esempio 1: coordinate negative
Calcola il coefficiente angolare della retta che passa per $A(-1, 3)$ e $B(2, -3)$.

$$
\begin{aligned}
m &= \dfrac{-3 - 3}{2 - (-1)} \\
&= \dfrac{-6}{3} = -2
\end{aligned}
$$

La retta scende: da $A$ a $B$ ci si sposta di $3$ verso destra e di $6$ verso il basso. Con l'ordine scambiato il risultato è lo stesso: $\dfrac{3 - (-3)}{-1 - 2} = \dfrac{6}{-3} = -2$.
```

```ad-warning
Ordini diversi sopra e sotto
Con i punti dell'esempio 1, scrivere $\dfrac{y_B - y_A}{x_A - x_B}$ dà $\dfrac{-6}{-3} = 2$: il segno è sbagliato, e la retta sembrerebbe salire. Anche capovolgere la frazione è un errore frequente: $\dfrac{\Delta x}{\Delta y} = \dfrac{3}{-6} = -\dfrac{1}{2}$ non è il coefficiente angolare. Sopra va sempre la differenza delle $y$.
```

```ad-example
Esempio 2: coordinate frazionarie
Calcola il coefficiente angolare della retta che passa per $A\left(\frac{1}{2}, 1\right)$ e $B\left(-1, \frac{3}{2}\right)$.

Numeratore e denominatore si calcolano a parte, poi si fa la divisione:

$$
\begin{gathered}
y_B - y_A = \frac{3}{2} - 1 = \frac{1}{2} \\
x_B - x_A = -1 - \frac{1}{2} = -\frac{3}{2}
\end{gathered}
$$

$$
\begin{aligned}
m &= \frac{1}{2} : \Big({-\frac{3}{2}}\Big) \\
&= \frac{1}{2} \cdot \Big({-\frac{2}{3}}\Big) = -\frac{1}{3}
\end{aligned}
$$

La retta scende, e poco: per ogni $3$ passi verso destra scende di $1$.
```

```ad-example
Esempio 3: stessa ordinata, stessa ascissa
Calcola, se esiste, il coefficiente angolare della retta per $C(-3, 4)$ e $D(5, 4)$, e di quella per $E(2, 5)$ e $F(2, -1)$.

Per $C$ e $D$ il numeratore è zero:

$$m = \dfrac{4 - 4}{5 - (-3)} = \dfrac{0}{8} = 0$$

La retta è orizzontale, e la sua equazione è $y = 4$.

Per $E$ e $F$ è zero il denominatore: $x_F - x_E = 2 - 2 = 0$. Il coefficiente angolare non esiste, e la retta è la verticale $x = 2$.

```tikz
% nome: coefficiente-angolare-retta-orizzontale-verticale
% alt: La retta orizzontale y = 4 per i punti C(-3, 4) e D(5, 4), con coefficiente angolare 0, e la retta verticale x = 2 per i punti E(2, 5) e F(2, -1), che non ha coefficiente angolare
% svg: coefficiente-angolare-retta-orizzontale-verticale-fdf7350a.svg 188x159
\begin{tikzpicture}[scale=0.4]
\draw[gray!25, very thin] (-4,-2) grid (6,6);
\draw[->] (-4.5,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-2.5) -- (0,6.6) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2,3,4,5} \draw (\x,0.15) -- (\x,-0.15);
\foreach \x in {-3,5} \node[below] at (\x,-0.15) {\small $\x$};
\foreach \y in {-1,1,2,3,4,5} \draw (0.15,\y) -- (-0.15,\y);
\foreach \y in {-1,5} \node[left] at (-0.15,\y) {\small $\y$};
\draw[thick, blue!60] (-4,4) -- (6,4);
\draw[thick, red!50] (2,-2) -- (2,6);
\fill (-3,4) circle (0.15) node[above] {$C$};
\fill (5,4) circle (0.15) node[above] {$D$};
\fill (2,5) circle (0.15) node[right] {$E$};
\fill (2,-1) circle (0.15) node[right] {$F$};
\node[blue!70!black, below] at (-2.2,4) {\small $y = 4$};
\node[red!60!black, right] at (2,1.8) {\small $x = 2$};
\end{tikzpicture}
```
```

## Il coefficiente angolare dalla forma implicita

Quando la retta è scritta in forma implicita, $ax + by + c = 0$, con $b \neq 0$, per trovare $m$ si può ricavare $y$:

$$
\begin{aligned}
by &= -ax - c \\
y &= -\dfrac{a}{b}x - \dfrac{c}{b}
\end{aligned}
$$

Il coefficiente di $x$ è il coefficiente angolare, e il termine noto è l'ordinata all'origine:

$$m = -\dfrac{a}{b} \qquad q = -\dfrac{c}{b}$$

Se $b = 0$ l'equazione diventa $ax + c = 0$, cioè $x = -\frac{c}{a}$: la retta è verticale e non ha coefficiente angolare.

```ad-example
Esempio 4: $m$ senza ricavare $y$
Trova il coefficiente angolare delle rette $3x - 2y + 6 = 0$ e $4x + 2y - 5 = 0$.

Nella prima $a = 3$ e $b = -2$:

$$m = -\dfrac{3}{-2} = \dfrac{3}{2}$$

Controllo ricavando $y$: $2y = 3x + 6$, cioè $y = \frac{3}{2}x + 3$. Il coefficiente angolare è $\frac{3}{2}$, e l'ordinata all'origine è $3$.

Nella seconda $a = 4$ e $b = 2$, quindi $m = -\dfrac{4}{2} = -2$.
```

```ad-warning
Leggere $m$ nel posto sbagliato
$m$ è il coefficiente di $x$ solo quando l'equazione è in forma esplicita, $y = mx + q$. In $2y = 6x + 1$ il coefficiente angolare è $3$, non $6$, perché prima va divisa per $2$ tutta l'equazione. E la formula $m = -\frac{a}{b}$ vale solo con tutti i termini a primo membro: da $3x = 2y - 6$ si passa prima a $3x - 2y + 6 = 0$, e solo allora si leggono $a = 3$ e $b = -2$.
```

## Retta per un punto con coefficiente angolare dato

Per un punto $P(x_0, y_0)$ passano infinite rette, ma una sola ha coefficiente angolare $m$. Un punto $Q(x, y)$ diverso da $P$ sta su questa retta quando la pendenza da $P$ a $Q$ è $m$:

$$\dfrac{y - y_0}{x - x_0} = m$$

Moltiplicando per $x - x_0$ si ottiene l'equazione della retta:

$$y - y_0 = m(x - x_0)$$

Anche $P$ rispetta questa equazione, perché con $x = x_0$ e $y = y_0$ i due membri valgono $0$. Per usarla:

1. sostituisci $x_0$, $y_0$ e $m$, mettendo tra parentesi i numeri negativi;
2. svolgi i conti e scrivi l'equazione in forma esplicita, o in forma implicita se ti viene chiesta;
3. controlla che le coordinate di $P$ rispettino l'equazione trovata.

```ad-example
Esempio 5: un punto con l'ordinata negativa
Scrivi l'equazione della retta che passa per $P(2, -1)$ e ha coefficiente angolare $3$.

$$
\begin{aligned}
y - (-1) &= 3(x - 2) \\
y + 1 &= 3x - 6 \\
y &= 3x - 7
\end{aligned}
$$

Controllo con $P$: $3 \cdot 2 - 7 = -1$.
```

```ad-example
Esempio 6: m frazionario e forma implicita
Scrivi in forma esplicita e in forma implicita l'equazione della retta che passa per $P(-3, 4)$ e ha coefficiente angolare $-\frac{2}{3}$.

Qui $x_0 = -3$, quindi $x - x_0 = x - (-3) = x + 3$:

$$
\begin{aligned}
y - 4 &= -\dfrac{2}{3}(x + 3) \\
y - 4 &= -\dfrac{2}{3}x - 2 \\
y &= -\dfrac{2}{3}x + 2
\end{aligned}
$$

Per la forma implicita moltiplica tutto per $3$ e porta i termini a primo membro:

$$
\begin{gathered}
3y = -2x + 6 \\
2x + 3y - 6 = 0
\end{gathered}
$$

Controllo con $P$: $2 \cdot (-3) + 3 \cdot 4 - 6 = -6 + 12 - 6 = 0$.
```

```ad-warning
Il segno di $x_0$
Nella formula c'è $x - x_0$: con $x_0 = -3$ diventa $x + 3$. Scrivere $y - 4 = -\frac{2}{3}(x - 3)$ dà la retta che passa per $(3, 4)$, non per $(-3, 4)$. Il controllo finale con le coordinate di $P$ scopre subito l'errore.
```

```ad-note
Le rette per un punto
Con $m = 0$ la formula dà $y = y_0$, la retta orizzontale per $P$. La retta verticale per $P$, $x = x_0$, è l'unica retta per $P$ che la formula non dà, perché non ha coefficiente angolare. Tutte le rette che passano per uno stesso punto formano un fascio, che ha una lezione sua: [Fasci di rette](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/fasci-di-rette).
```

## Retta per due punti

Per due punti distinti passa una e una sola retta. Per scriverne l'equazione ci sono due strade: calcolare il coefficiente angolare e usare la formula della sezione precedente, oppure risolvere un sistema.

### Con il coefficiente angolare

Dati $A(x_A, y_A)$ e $B(x_B, y_B)$:

1. se $x_A = x_B$ la retta è verticale, e la sua equazione è $x = x_A$;
2. altrimenti calcola $m = \dfrac{y_B - y_A}{x_B - x_A}$;
3. scrivi $y - y_A = m(x - x_A)$ e porta l'equazione in forma esplicita;
4. controlla che anche le coordinate di $B$ rispettino l'equazione.

Al passo 3 puoi usare $B$ al posto di $A$: la retta è la stessa, e l'altro punto serve per il controllo.

```ad-example
Esempio 7: la retta per A(1, 3) e B(3, -1)
Le ascisse sono diverse, quindi la retta non è verticale.

$$m = \dfrac{-1 - 3}{3 - 1} = \dfrac{-4}{2} = -2$$

Con il punto $A$:

$$
\begin{aligned}
y - 3 &= -2(x - 1) \\
y - 3 &= -2x + 2 \\
y &= -2x + 5
\end{aligned}
$$

Controllo con $B$: $-2 \cdot 3 + 5 = -1$. Nella figura, da $A$ a $B$ ci si sposta di $2$ verso destra e di $4$ verso il basso.

```tikz
% nome: retta-per-due-punti-a-b
% alt: La retta y = -2x + 5 passa per A(1, 3) e B(3, -1); da A a B lo spostamento orizzontale è 2 e quello verticale è -4
% svg: retta-per-due-punti-a-b-b3c835a6.svg 145x191
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-1,-2) grid (4,6);
\draw[->] (-1.4,0) -- (4.6,0) node[right] {$x$};
\draw[->] (0,-2.4) -- (0,6.6) node[above] {$y$};
\foreach \x in {1,2,3} \draw (\x,0.12) -- (\x,-0.12);
\node[below] at (1,-0.12) {\small $1$};
\node[below right] at (3,0) {\small $3$};
\foreach \y in {-1,1,2,3,4,5} \draw (0.12,\y) -- (-0.12,\y);
\foreach \y in {-1,3,5} \node[left] at (-0.12,\y) {\small $\y$};
\draw[thick, blue!60] (-0.4,5.8) -- (3.6,-2.2);
\draw[dashed, red!50] (1,3) -- (3,3) -- (3,-1);
\node[above, red!60!black] at (2.6,3) {\small $\Delta x = 2$};
\node[right, red!60!black] at (3,1) {\small $\Delta y = -4$};
\fill (1,3) circle (0.12) node[left] {$A$};
\fill (3,-1) circle (0.12) node[left] {$B$};
\node[blue!70!black, right] at (0.1,5.4) {\small $y = -2x + 5$};
\end{tikzpicture}
```
```

```ad-example
Esempio 8: coordinate negative e forma implicita
Scrivi in forma implicita l'equazione della retta che passa per $A(-4, -1)$ e $B(2, 3)$.

$$
\begin{aligned}
m &= \dfrac{3 - (-1)}{2 - (-4)} \\
&= \dfrac{4}{6} = \dfrac{2}{3}
\end{aligned}
$$

Con il punto $A$, dove $x - (-4) = x + 4$ e $y - (-1) = y + 1$:

$$
\begin{aligned}
y + 1 &= \dfrac{2}{3}(x + 4) \\
3y + 3 &= 2x + 8 \\
2x - 3y + 5 &= 0
\end{aligned}
$$

Nel secondo passaggio si sono moltiplicati per $3$ i due membri, per togliere il denominatore. Controllo con $B$: $2 \cdot 2 - 3 \cdot 3 + 5 = 4 - 9 + 5 = 0$.
```

```ad-note
La formula della retta per due punti
Molti libri riuniscono i passi 2 e 3 in una formula sola, che vale quando $x_A \neq x_B$ e $y_A \neq y_B$:

$$\dfrac{y - y_A}{y_B - y_A} = \dfrac{x - x_A}{x_B - x_A}$$

Con i punti dell'esempio 7 diventa $\dfrac{y - 3}{-4} = \dfrac{x - 1}{2}$, e moltiplicando per $-4$ si ritrova $y - 3 = -2(x - 1)$. La retta è la stessa: la formula è solo un altro modo di scrivere gli stessi due passi.
```

### Con il sistema

Una retta che non è verticale ha equazione $y = mx + q$, con $m$ e $q$ da trovare. Ogni punto della retta, sostituito nell'equazione, dà un'equazione in $m$ e $q$: con due punti si ottiene un [sistema di due equazioni in due incognite](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite).

```ad-example
Esempio 9: la retta dell'esempio 7 con il sistema
Trova con un sistema la retta per $A(1, 3)$ e $B(3, -1)$.

Sostituisci in $y = mx + q$ le coordinate di $A$ e poi quelle di $B$:

$$
\begin{cases}
3 = m + q \\
-1 = 3m + q
\end{cases}
$$

Sottraendo la prima equazione dalla seconda, $q$ sparisce: $-4 = 2m$, quindi $m = -2$. Dalla prima, $q = 3 - m = 3 - (-2) = 5$. La retta è $y = -2x + 5$, la stessa dell'esempio 7.
```

Se i due punti hanno la stessa ascissa il sistema è impossibile. Con $A(2, 1)$ e $B(2, 5)$ si ottiene $1 = 2m + q$ e $5 = 2m + q$: la stessa espressione $2m + q$ dovrebbe valere sia $1$ sia $5$. Nessuna retta della forma $y = mx + q$ passa per i due punti, perché la retta che li unisce è la verticale $x = 2$.

Il metodo con il coefficiente angolare di solito è più veloce. Il sistema ha il vantaggio di funzionare nello stesso modo anche con altre curve: per esempio, [la parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola) che passa per tre punti si trova con un sistema di tre equazioni.

## Tre punti allineati

Tre punti sono **allineati** se stanno su una stessa retta. Se $A$, $B$ e $C$ hanno ascisse diverse, sono allineati quando

$$m_{AB} = m_{AC}$$

dove $m_{AB}$ è il coefficiente angolare della retta $AB$ e $m_{AC}$ quello della retta $AC$. Le due rette passano tutte e due per $A$ e hanno la stessa pendenza, quindi sono la stessa retta, e $C$ sta sulla retta $AB$. Se invece due dei tre punti hanno la stessa ascissa, la retta che li unisce è verticale, e il terzo punto è allineato con loro solo se ha anche lui quella ascissa.

Un altro modo di controllare è scrivere l'equazione della retta $AB$ e vedere se le coordinate di $C$ la rispettano.

```ad-example
Esempio 10: quasi allineati
I punti $A(0, 3)$, $B(2, 0)$ e $C(4, -2)$ sono allineati? E $A$, $B$ e $D(4, -3)$?

$$
\begin{gathered}
m_{AB} = \dfrac{0 - 3}{2 - 0} = -\dfrac{3}{2} \\
m_{AC} = \dfrac{-2 - 3}{4 - 0} = -\dfrac{5}{4}
\end{gathered}
$$

I due coefficienti sono diversi: $A$, $B$ e $C$ non sono allineati, anche se nel disegno ci manca poco. Per $D$:

$$m_{AD} = \dfrac{-3 - 3}{4 - 0} = \dfrac{-6}{4} = -\dfrac{3}{2}$$

È uguale a $m_{AB}$: $A$, $B$ e $D$ sono allineati.

```tikz
% nome: tre-punti-allineati-e-non
% alt: La retta per A(0, 3) e B(2, 0) passa anche per D(4, -3), che è allineato con A e B; il punto C(4, -2) sta un'unità più in alto e non è allineato
% svg: tre-punti-allineati-e-non-bf0983a6.svg 153x191
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-1,-4) grid (5,4);
\draw[->] (-1.4,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-4.4) -- (0,4.6) node[above] {$y$};
\foreach \x in {1,2,3,4} \draw (\x,0.12) -- (\x,-0.12);
\foreach \x in {2,4} \node[above right] at (\x,0) {\small $\x$};
\foreach \y in {-3,-2,-1,1,2,3} \draw (0.12,\y) -- (-0.12,\y);
\foreach \y in {-3,-2,3} \node[left] at (-0.12,\y) {\small $\y$};
\draw[thick, blue!60] (-0.6,3.9) -- (4.6,-3.9);
\fill (0,3) circle (0.12) node[above right] {$A$};
\fill (2,0) circle (0.12) node[below left] {$B$};
\fill (4,-3) circle (0.12) node[left] {$D$};
\fill[red!60] (4,-2) circle (0.12);
\node[red!60!black, right] at (4,-2) {$C$};
\end{tikzpicture}
```
```

```ad-example
Esempio 11: trovare la coordinata che manca
Per quale valore di $k$ i punti $A(1, 1)$, $B(3, 5)$ e $C(k, 11)$ sono allineati?

Se fosse $k = 1$, $C$ avrebbe la stessa ascissa di $A$ e i tre punti starebbero sulla verticale $x = 1$, che però non passa per $B$: quindi $k \neq 1$, e si possono confrontare i coefficienti angolari.

$$m_{AB} = \dfrac{5 - 1}{3 - 1} = \dfrac{4}{2} = 2$$

$$m_{AC} = \dfrac{11 - 1}{k - 1} = \dfrac{10}{k - 1}$$

I tre punti sono allineati quando $m_{AC} = 2$:

$$
\begin{gathered}
\dfrac{10}{k - 1} = 2 \\
10 = 2(k - 1) \\
k = 6
\end{gathered}
$$

Controllo: con $C(6, 11)$ si ha $m_{BC} = \dfrac{11 - 5}{6 - 3} = \dfrac{6}{3} = 2$.
```

```ad-warning
Due coefficienti uguali non bastano sempre
$m_{AB} = m_{AC}$ vuol dire che $A$, $B$ e $C$ sono allineati perché le due rette hanno in comune il punto $A$. Con quattro punti, invece, $m_{AB} = m_{CD}$ dice solo che le rette $AB$ e $CD$ hanno la stessa pendenza: possono essere [parallele](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari) e distinte, senza nessun punto in comune.
```
