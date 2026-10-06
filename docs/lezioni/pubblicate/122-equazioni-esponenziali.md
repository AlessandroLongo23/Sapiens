# Equazioni esponenziali

Una coltura di batteri raddoppia ogni ora: dopo quante ore è $32$ volte quella iniziale? La risposta è il numero $x$ per cui $2^x = 32$, cioè $x = 5$, perché $2^5 = 32$. In questa equazione l'incognita sta all'esponente: prima delle regole delle equazioni di primo e di secondo grado, per risolverla serve una proprietà della funzione esponenziale.

Per seguire la lezione ti servono la [funzione esponenziale](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-esponenziale), le proprietà delle potenze fino alle [potenze con esponente razionale](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/potenze-con-esponente-razionale) e le [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado).

## Che cos'è un'equazione esponenziale

Un'equazione è **esponenziale** quando l'incognita compare nell'esponente di almeno una potenza. Sono esponenziali

$$
\begin{gathered}
2^x = 32 \\
3^{2x - 1} = 27 \\
4^x - 6 \cdot 2^x + 8 = 0
\end{gathered}
$$

mentre $x^2 = 32$ non lo è, perché l'incognita è la base. Le basi delle potenze sono numeri positivi e diversi da $1$, come nella funzione esponenziale.

## L'equazione elementare

La più semplice è l'**equazione esponenziale elementare**

$$a^x = b \qquad \text{con } a > 0 \text{ e } a \neq 1$$

Risolverla vuol dire cercare i punti in cui il grafico di $y = a^x$ incontra la retta orizzontale $y = b$. Il grafico sta tutto sopra l'asse $x$, è crescente oppure decrescente, e la funzione assume ogni valore positivo. Quindi i casi sono due.

- Se $b \leq 0$ la retta non incontra il grafico: l'equazione è impossibile.
- Se $b > 0$ la retta incontra il grafico in un solo punto: l'equazione ha una sola soluzione.

```tikz
% nome: equazione-esponenziale-elementare
% alt: Il grafico di y = 2 alla x con tre rette orizzontali: y = 8 lo incontra nel punto di ascissa 3, y = 5 in un punto di ascissa compresa tra 2 e 3, y = -1 non lo incontra
% svg: equazione-esponenziale-elementare-467e94e3.svg 187x246
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-2) grid (4,9);
\draw[->] (-4.3,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,9.6) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2,3} \node[below] at (\x,0) {\small $\x$};
\draw[orange!70] (-4,8) -- (4,8);
\draw[teal!60] (-4,5) -- (4,5);
\draw[red!50] (-4,-1) -- (4,-1);
\draw[thick, blue!60, domain=-4:3.1, samples=60, smooth] plot (\x, {exp(0.693147*\x)});
\draw[dashed, gray] (3,8) -- (3,0);
\draw[dashed, gray] (2.3219,5) -- (2.3219,0);
\fill (3,8) circle (0.13);
\fill (2.3219,5) circle (0.13);
\node[orange!70!black, above] at (-2.6,8) {$y = 8$};
\node[teal!60!black, above] at (-2.6,5) {$y = 5$};
\node[red!50!black, below] at (-2.5,-1) {$y = -1$};
\end{tikzpicture}
```
```grafico
% nome: equazione-esponenziale-elementare-cursori
% alt: Il grafico di y = a alla x e la retta orizzontale y = b, con i cursori di a e di b: con b positivo la retta incontra la curva in un solo punto, con b negativo o nullo non la incontra
curva: y=a^x
curva: y=b | arancione
cursore: a = 2 da 0,2 a 4 passo 0,1
cursore: b = 5 da -3 a 8 passo 0,5
finestra: x da -6 a 6, y da -3 a 9
valore: x = \frac{\ln b}{\ln a}
domanda: Con $a = 2$ porta $b$ a $8$: quanto vale la soluzione $x$? Poi abbassa $b$ fino a $0$ e sotto: la soluzione c'è ancora?
```

Sotto il piano è scritta la soluzione $x$, l'ascissa del punto in cui la retta incontra la curva. Con $a = 2$ e $b = 8$ vale $3$. Abbassando $b$ il punto scivola verso sinistra, sempre più lontano; per $b = 0$ e per $b$ negativo la retta non incontra più la curva, e la soluzione non esiste. Con $b$ positivo, qualunque base scegli, il punto è sempre uno solo. Fa eccezione $a = 1$, che non è una base ammessa: la curva diventa la retta $y = 1$, e l'equazione $1^x = b$ non ha soluzioni, oppure, se $b = 1$, è vera per ogni $x$.

Quando $b$ è una potenza di $a$, la soluzione si legge: $2^x = 8$ ha la soluzione $x = 3$, perché $8 = 2^3$. Quando non lo è, come in $2^x = 5$, la soluzione esiste lo stesso ed è una sola, ma non è un numero che sai già scrivere: dato che $2^2 = 4 < 5 < 8 = 2^3$, sta tra $2$ e $3$. Per scriverla serve il logaritmo, che trovi nella lezione [Logaritmi e loro proprietà](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/logaritmi-e-loro-proprieta). In questa lezione le equazioni si riconducono tutte a potenze della stessa base.

```ad-example
Esempio 1: equazioni elementari
Risolvi $3^x = 81$, $2^x = \dfrac{1}{8}$, $5^x = 1$, $10^x = 0{,}001$ e $7^x = -7$.

Scrivi il secondo membro come potenza della base che sta a primo membro.

- $81 = 3^4$, quindi $x = 4$.
- $\dfrac{1}{8} = \dfrac{1}{2^3} = 2^{-3}$, quindi $x = -3$.
- $1 = 5^0$, quindi $x = 0$.
- $0{,}001 = \dfrac{1}{1000} = 10^{-3}$, quindi $x = -3$.
- $7^x$ è positivo per ogni $x$ e non può valere $-7$: l'equazione è impossibile, $S = \emptyset$.
```

```ad-warning
Un secondo membro negativo non dà un esponente negativo
$7^x = -7$ non ha la soluzione $x = -1$: $7^{-1} = \dfrac{1}{7}$, che è positivo. Un esponente negativo dà il reciproco della potenza, non il suo opposto. Lo stesso vale per $2^x = 0$: nessun esponente rende nulla una potenza.
```

## Equazioni con la stessa base

La funzione esponenziale non assume mai due volte lo stesso valore. Per questo due potenze con la stessa base, positiva e diversa da $1$, sono uguali solo se sono uguali gli esponenti:

$$a^{f(x)} = a^{g(x)} \iff f(x) = g(x)$$

Qui $f(x)$ e $g(x)$ sono due espressioni qualunque che contengono l'incognita. L'equazione esponenziale diventa un'equazione tra gli esponenti, che è di un tipo che conosci. Il procedimento è questo.

1. Scrivi tutte le basi come potenze dello stesso numero: $4 = 2^2$, $27 = 3^3$, $\dfrac{1}{2} = 2^{-1}$, $\sqrt{2} = 2^{\frac{1}{2}}$.
2. Con le proprietà delle potenze riduci ogni membro a una sola potenza di quella base.
3. Uguaglia gli esponenti.
4. Risolvi l'equazione ottenuta.

```ad-example
Esempio 2: il secondo membro è una potenza della base
$$3^{2x - 1} = 27$$

Dato che $27 = 3^3$, l'equazione è $3^{2x - 1} = 3^3$. Le basi sono uguali, quindi lo sono gli esponenti:

$$
\begin{gathered}
2x - 1 = 3 \\
\Rightarrow 2x = 4 \\
\Rightarrow x = 2
\end{gathered}
$$

Verifica: $3^{2 \cdot 2 - 1} = 3^3 = 27$. Quindi $S = \{2\}$.
```

```ad-example
Esempio 3: basi diverse, potenze dello stesso numero
Risolvi $4^x = 8$ e $9^{x + 1} = 27^x$.

Nella prima $4$ e $8$ sono potenze di $2$. Con la potenza di potenza, $4^x = \left(2^2\right)^x = 2^{2x}$:

$$
\begin{gathered}
2^{2x} = 2^3 \\
\Rightarrow 2x = 3 \\
\Rightarrow x = \frac{3}{2}
\end{gathered}
$$

Verifica: $4^{\frac{3}{2}} = \left(\sqrt{4}\right)^3 = 8$.

Nella seconda $9 = 3^2$ e $27 = 3^3$:

$$
\begin{gathered}
\left(3^2\right)^{x + 1} = \left(3^3\right)^x \\
\Rightarrow 3^{2x + 2} = 3^{3x} \\
\Rightarrow 2x + 2 = 3x \\
\Rightarrow x = 2
\end{gathered}
$$

Verifica: $9^3 = 729$ e $27^2 = 729$.
```

```ad-warning
La potenza di potenza moltiplica tutto l'esponente
$9^{x + 1} = \left(3^2\right)^{x + 1} = 3^{2(x + 1)} = 3^{2x + 2}$, non $3^{2x + 1}$. Il $2$ moltiplica tutto l'esponente $x + 1$: metti le parentesi prima di fare il prodotto.
```

```ad-example
Esempio 4: frazioni e radicali
$$\left(\frac{1}{2}\right)^{x - 1} = 4\sqrt{2}$$

Tutto si scrive in base $2$. A primo membro $\dfrac{1}{2} = 2^{-1}$, quindi $\left(2^{-1}\right)^{x - 1} = 2^{-x + 1}$. A secondo membro $4\sqrt{2} = 2^2 \cdot 2^{\frac{1}{2}} = 2^{\frac{5}{2}}$.

$$
\begin{gathered}
2^{-x + 1} = 2^{\frac{5}{2}} \\
\Rightarrow -x + 1 = \frac{5}{2} \\
\Rightarrow x = -\frac{3}{2}
\end{gathered}
$$

Verifica: l'esponente vale $-\dfrac{3}{2} - 1 = -\dfrac{5}{2}$, e $\left(\dfrac{1}{2}\right)^{-\frac{5}{2}} = 2^{\frac{5}{2}} = 4\sqrt{2}$.
```

```ad-example
Esempio 5: l'esponente è di secondo grado
$$5^{x^2 - 3x} = \frac{1}{25}$$

Dato che $\dfrac{1}{25} = 5^{-2}$:

$$
\begin{gathered}
x^2 - 3x = -2 \\
\Rightarrow x^2 - 3x + 2 = 0
\end{gathered}
$$

Due numeri con somma $3$ e prodotto $2$ sono $1$ e $2$: $x_1 = 1$ e $x_2 = 2$. Verifica: per $x = 1$ l'esponente vale $1 - 3 = -2$, per $x = 2$ vale $4 - 6 = -2$, e $5^{-2} = \dfrac{1}{25}$. Quindi $S = \{1, 2\}$.
```

```ad-example
Esempio 6: prodotti e quozienti di potenze
$$3^x \cdot 9^{x - 1} = \frac{27}{3^x}$$

Prima riduci ogni membro a una sola potenza di $3$. A primo membro gli esponenti si sommano, a secondo membro si sottraggono:

$$
\begin{aligned}
3^x \cdot 9^{x - 1} &= 3^x \cdot 3^{2x - 2} = 3^{3x - 2} \\
\frac{27}{3^x} &= 3^3 : 3^x = 3^{3 - x}
\end{aligned}
$$

Ora uguaglia gli esponenti:

$$
\begin{gathered}
3x - 2 = 3 - x \\
\Rightarrow 4x = 5 \\
\Rightarrow x = \frac{5}{4}
\end{gathered}
$$

Verifica sugli esponenti: per $x = \dfrac{5}{4}$ il primo vale $\dfrac{15}{4} - 2 = \dfrac{7}{4}$ e il secondo $3 - \dfrac{5}{4} = \dfrac{7}{4}$.
```

```ad-warning
Gli esponenti si uguagliano solo tra due potenze
La regola vale quando ogni membro è una sola potenza. In $2^x + 2^3 = 2^5$ a primo membro c'è una somma, e non si può scrivere $x + 3 = 5$: per $x = 2$ si avrebbe $4 + 8 = 12$, non $32$. L'equazione è $2^x = 32 - 8 = 24$, che non ha per soluzione un numero intero. Le proprietà delle potenze riguardano prodotti e quozienti, non somme.
```

## Somme di potenze con la stessa base: il raccoglimento

Quando in un membro si sommano potenze della stessa base i cui esponenti differiscono per un numero, come $2^{x + 2}$ e $2^x$, si usa la proprietà del prodotto al contrario: $2^{x + 2} = 2^x \cdot 2^2$. Così ogni termine contiene il fattore $2^x$, che si raccoglie.

```ad-example
Esempio 7: raccogliere la potenza
$$2^{x + 2} + 2^x = 40$$

Scrivi $2^{x + 2} = 4 \cdot 2^x$ e raccogli $2^x$:

$$
\begin{gathered}
4 \cdot 2^x + 2^x = 40 \\
\Rightarrow 2^x (4 + 1) = 40 \\
\Rightarrow 2^x = 8 \\
\Rightarrow x = 3
\end{gathered}
$$

Verifica: $2^5 + 2^3 = 32 + 8 = 40$.
```

```ad-example
Esempio 8: raccogliere la potenza con l'esponente più piccolo
$$3^{x + 1} - 3^{x - 1} = 24$$

Per non avere frazioni conviene raccogliere la potenza con l'esponente più piccolo, $3^{x - 1}$. Dato che $x + 1 = (x - 1) + 2$, si ha $3^{x + 1} = 3^{x - 1} \cdot 3^2$:

$$
\begin{gathered}
9 \cdot 3^{x - 1} - 3^{x - 1} = 24 \\
\Rightarrow 3^{x - 1} (9 - 1) = 24 \\
\Rightarrow 3^{x - 1} = 3 \\
\Rightarrow x - 1 = 1 \\
\Rightarrow x = 2
\end{gathered}
$$

Verifica: $3^3 - 3^1 = 27 - 3 = 24$.
```

## Equazioni che diventano di secondo grado: la sostituzione

In $4^x - 6 \cdot 2^x + 8 = 0$ le due potenze non si raccolgono, ma una è il quadrato dell'altra: $4^x = \left(2^2\right)^x = \left(2^x\right)^2$. Ponendo $t = 2^x$ l'equazione diventa di secondo grado nell'incognita $t$, come nelle [equazioni trinomie](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/equazioni-binomie-trinomie-e-scomponibili). Il procedimento è questo.

1. Scrivi tutte le potenze con la stessa base $a$ e poni $t = a^x$. Dato che $a^x$ è sempre positivo, deve essere $t > 0$.
2. Risolvi l'equazione in $t$.
3. Scarta i valori di $t$ negativi o nulli.
4. Per ogni valore accettabile torna all'incognita $x$, risolvendo l'equazione elementare $a^x = t$.

```ad-example
Esempio 9: due valori accettabili
$$4^x - 6 \cdot 2^x + 8 = 0$$

Con $t = 2^x$ si ha $4^x = t^2$, e l'equazione diventa

$$t^2 - 6t + 8 = 0$$

Due numeri con somma $6$ e prodotto $8$ sono $2$ e $4$: $t_1 = 2$ e $t_2 = 4$, tutti e due positivi. Torna a $x$:

$$
\begin{gathered}
2^x = 2 \ \Rightarrow \ x = 1 \\
2^x = 4 \ \Rightarrow \ x = 2
\end{gathered}
$$

Verifica: per $x = 1$, $4 - 12 + 8 = 0$; per $x = 2$, $16 - 24 + 8 = 0$. Quindi $S = \{1, 2\}$.
```

```ad-example
Esempio 10: un valore da scartare
$$9^x - 8 \cdot 3^x - 9 = 0$$

Con $t = 3^x$ si ha $9^x = t^2$:

$$t^2 - 8t - 9 = 0$$

Due numeri con somma $8$ e prodotto $-9$ sono $-1$ e $9$: $t_1 = -1$ e $t_2 = 9$. Il valore $t = -1$ va scartato, perché $3^x = -1$ è impossibile. Resta

$$3^x = 9 \ \Rightarrow \ x = 2$$

Verifica: $81 - 72 - 9 = 0$. Quindi $S = \{2\}$.
```

Quante soluzioni ha un'equazione di questo tipo dipende dai valori di $t$ che restano dopo aver scartato quelli non positivi. Lo si vede sul grafico di $y = 4^x - 6 \cdot 2^x + c$, che incontra l'asse $x$ nelle soluzioni dell'equazione $4^x - 6 \cdot 2^x + c = 0$: con $c = 8$ è l'esempio 9.

```tikz
% nome: equazione-esponenziale-sostituzione-grafico
% alt: Il grafico di y = 4 alla x meno 6 per 2 alla x più 8: incontra l'asse x nei punti di ascissa 1 e 2, le due soluzioni dell'equazione, e a sinistra si avvicina alla retta y = 8
% svg: equazione-esponenziale-sostituzione-grafico-a6a95ce4.svg 244x175
\begin{tikzpicture}[xscale=0.75, yscale=0.3]
\draw[gray!25, very thin] (-4,-2) grid (3,10);
\draw[->] (-4.3,0) -- (3.6,0) node[right] {$x$};
\draw[->] (0,-2.6) -- (0,11) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {3,8} \node[left] at (0,\y) {\small $\y$};
\draw[dashed, gray] (-4,8) -- (3,8);
\draw[thick, blue!60, domain=-4:2.52, samples=80, smooth] plot (\x, {exp(1.386294*\x) - 6*exp(0.693147*\x) + 8});
\foreach \x/\y in {1/0, 2/0, 0/3} \fill (\x,\y) ellipse (0.09 and 0.225);
\end{tikzpicture}
```
```grafico
% nome: equazione-esponenziale-sostituzione-cursore
% alt: Il grafico di y = 4 alla x meno 6 per 2 alla x più c con il cursore di c e i due valori di t scritti sotto: incontra l'asse x in due punti, in uno o in nessuno secondo il valore di c
curva: y=4^x-6\cdot2^x+c
cursore: c = 8 da -6 a 12 passo 0,5
finestra: x da -5 a 5, y da -8 a 12
forma: 1:1
valore: t_1 = 3-\sqrt{9-c}
valore: t_2 = 3+\sqrt{9-c}
domanda: Abbassa $c$ sotto zero: quante soluzioni restano, e perché? Poi alzalo fino a $9$ e oltre.
```

Con $t = 2^x$ l'equazione è $t^2 - 6t + c = 0$, e le soluzioni in $t$ sono $3 - \sqrt{9 - c}$ e $3 + \sqrt{9 - c}$. I casi sono quattro.

| Valore di $c$ | Valori di $t$ | Soluzioni in $x$ |
|---|---|---|
| $c \leq 0$ | $t_1 \leq 0$, da scartare, e $t_2 > 0$ | una |
| $0 < c < 9$ | due positivi | due |
| $c = 9$ | $t_1 = t_2 = 3$ | una |
| $c > 9$ | nessuno | nessuna |

Con $c = 9$ la curva tocca l'asse $x$ in un solo punto, quello in cui $2^x = 3$. Le soluzioni in $x$ sono tutte numeri interi solo quando i valori di $t$ accettabili sono potenze di $2$, come per $c = 8$; negli altri casi almeno una si scrive con un logaritmo.

```ad-warning
Fermarsi a t, o tenere un t negativo
I valori di $t$ non sono le soluzioni: nell'esempio 9 la risposta non è "$2$ e $4$" ma $x = 1$ e $x = 2$. E un valore di $t$ negativo non dà nessuna soluzione: nell'esempio 10 da $t = -1$ non si ricava $x = -1$ né altro.
```

```ad-warning
Che cosa diventa ogni potenza con t
Con $t = 2^x$: $4^x = t^2$ e non $2t$; $2^{x + 1} = 2 \cdot 2^x = 2t$ e non $t + 1$; $2^{-x} = \dfrac{1}{t}$ e non $-t$. Un numero sommato all'esponente diventa un fattore, un numero che moltiplica l'esponente diventa un esponente di $t$.
```

```ad-example
Esempio 11: esponenti opposti
$$3^x + 3^{2 - x} = 10$$

La seconda potenza si scrive $3^{2 - x} = 3^2 : 3^x = \dfrac{9}{3^x}$. Con $t = 3^x$:

$$t + \frac{9}{t} = 10$$

Dato che $t > 0$, puoi moltiplicare tutti e due i membri per $t$:

$$
\begin{gathered}
t^2 + 9 = 10t \\
\Rightarrow t^2 - 10t + 9 = 0
\end{gathered}
$$

Le soluzioni sono $t_1 = 1$ e $t_2 = 9$, tutte e due positive:

$$
\begin{gathered}
3^x = 1 \ \Rightarrow \ x = 0 \\
3^x = 9 \ \Rightarrow \ x = 2
\end{gathered}
$$

Verifica: per $x = 0$, $1 + 9 = 10$; per $x = 2$, $9 + 1 = 10$. Quindi $S = \{0, 2\}$.
```

## Basi diverse con lo stesso esponente

Quando le basi non sono potenze dello stesso numero ma gli esponenti sono uguali, si usano le proprietà del prodotto e del quoziente con lo stesso esponente: $a^x \cdot b^x = (a \cdot b)^x$ e $a^x : b^x = (a : b)^x$.

```ad-example
Esempio 12: stesso esponente
Risolvi $2^x \cdot 5^x = 0{,}01$ e $3^{x - 2} = 7^{x - 2}$.

Nella prima il prodotto è una sola potenza, $2^x \cdot 5^x = 10^x$, e $0{,}01 = 10^{-2}$:

$$10^x = 10^{-2} \ \Rightarrow \ x = -2$$

Nella seconda dividi tutti e due i membri per $7^{x - 2}$, che non è mai nullo:

$$
\begin{gathered}
\frac{3^{x - 2}}{7^{x - 2}} = 1 \\
\Rightarrow \left(\frac{3}{7}\right)^{x - 2} = \left(\frac{3}{7}\right)^0 \\
\Rightarrow x - 2 = 0 \\
\Rightarrow x = 2
\end{gathered}
$$

Verifica: $3^0 = 7^0 = 1$. Due potenze con basi diverse e lo stesso esponente sono uguali solo quando l'esponente è zero.
```

## Quando serve un logaritmo

Non tutte le equazioni esponenziali si riconducono alla stessa base. Con $2^x = 5$ non si può, perché $5$ non è una potenza di $2$ con esponente razionale. Lo stesso succede a metà di un procedimento:

$$4^x - 5 \cdot 2^x + 6 = 0$$

Con $t = 2^x$ si ottiene $t^2 - 5t + 6 = 0$, con le soluzioni $t_1 = 2$ e $t_2 = 3$, tutte e due accettabili. Da $2^x = 2$ viene $x = 1$. Da $2^x = 3$ viene una seconda soluzione, compresa tra $1$ e $2$, che c'è e non va dimenticata: si scrive con un logaritmo. Questa equazione e $2^x = 5$ sono risolte fino in fondo nella lezione [Equazioni logaritmiche](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/equazioni-logaritmiche), nella sezione sulle equazioni esponenziali che si risolvono con i logaritmi, dove trovi anche le equazioni con basi diverse ed esponenti diversi, come $2^{x + 1} = 3^x$.

## Quando serve il grafico

In un'equazione come $2^x = 3 - x$ l'incognita compare sia all'esponente sia fuori: nessuno dei metodi visti la risolve con i conti. Si può però disegnare il grafico dei due membri, $y = 2^x$ e $y = 3 - x$, e cercare i punti in comune.

```tikz
% nome: equazione-esponenziale-grafica
% alt: Il grafico di y = 2 alla x, crescente, e la retta y = 3 - x, decrescente: si incontrano in un solo punto, P (1, 2)
% svg: equazione-esponenziale-grafica-1cd295db.svg 206x189
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-1) grid (5,7);
\draw[->] (-4.3,0) -- (5.5,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,7.6) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2,3,4} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {2,3} \node[left] at (0,\y) {\small $\y$};
\draw[thick, orange!70] (-3.6,6.6) -- (4,-1);
\draw[thick, blue!60, domain=-4:2.75, samples=60, smooth] plot (\x, {exp(0.693147*\x)});
\draw[dashed, gray] (1,2) -- (1,0);
\fill (1,2) circle (0.13);
\node[right] at (1.1,2.1) {$P$};
\node[blue!60!black, right] at (2.75,6.6) {$y = 2^x$};
\node[orange!70!black, above right] at (-3.6,6.6) {$y = 3 - x$};
\end{tikzpicture}
```
```grafico
% nome: equazione-esponenziale-grafica-cursore
% alt: Il grafico di y = 2 alla x e la retta y = q - x con il cursore di q: la retta scende, la curva sale, e si incontrano sempre in un solo punto
curva: y=2^x
curva: y=q-x | arancione
cursore: q = 3 da -4 a 8 passo 0,1
finestra: x da -6 a 6, y da -3 a 9
domanda: Per quale $q$ la soluzione è $x = 2$? Muovendo $q$, la retta e la curva possono incontrarsi in due punti, o non incontrarsi?
```

Qualunque sia $q$, la retta resta decrescente e la curva crescente: si incontrano sempre, e in un punto solo. La soluzione è $x = 2$ quando la retta passa per $(2, 4)$, cioè per $q = 4 + 2 = 6$; per $q = 3$ torna la figura.

I due grafici si incontrano in $P(1, 2)$: infatti $2^1 = 2$ e $3 - 1 = 2$, quindi $x = 1$ è una soluzione. Non ce ne sono altre, perché $y = 2^x$ è crescente e $y = 3 - x$ è decrescente: a destra di $1$ il primo membro è maggiore di $2$ e il secondo è minore, a sinistra succede il contrario. Il grafico suggerisce la soluzione, la sostituzione la conferma: quando il punto in comune non ha coordinate comode, dal grafico si legge solo un valore approssimato.

## Quale metodo usare

| Forma dell'equazione | Che cosa fai |
|---|---|
| $a^{f(x)} = b$, con $b \leq 0$ | impossibile |
| una potenza per membro, basi potenze dello stesso numero | stessa base, poi uguagli gli esponenti |
| somma di potenze come $a^{x + 2}$ e $a^x$ | raccogli $a^x$ |
| potenze come $a^{2x}$ e $a^x$, oppure $a^x$ e $a^{-x}$ | poni $t = a^x$, con $t > 0$ |
| basi diverse, stesso esponente | una sola potenza con il prodotto o il quoziente delle basi |
| nessuna di queste, come $2^x = 5$ | serve il logaritmo |
