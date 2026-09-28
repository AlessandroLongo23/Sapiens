# Similitudine

Una foto ingrandita, una piantina in scala, il modellino di un'auto: la forma è la stessa dell'originale, cambiano le misure, e tutte nello stesso rapporto. In geometria due figure così si dicono simili. Con la similitudine si trovano lunghezze che non si possono misurare direttamente, come l'altezza di un albero dalla sua ombra, e si calcolano perimetri e aree di figure ingrandite o ridotte. Tutto si basa sul [teorema di Talete](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teorema-di-talete) e sulle [proporzioni](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali).

## Poligoni simili

Due poligoni con lo stesso numero di lati sono **simili** se si possono associare i vertici dell'uno a quelli dell'altro in modo che gli angoli corrispondenti siano congruenti e i lati corrispondenti siano in proporzione. I lati corrispondenti si chiamano **lati omologhi**, e il rapporto costante tra un lato del secondo poligono e il suo omologo nel primo è il **rapporto di similitudine**, che si indica con $k$:

$$
\begin{gathered}
\frac{A'B'}{AB} = \frac{B'C'}{BC} \\
= \frac{C'D'}{CD} = \frac{D'A'}{DA} = k
\end{gathered}
$$

Si scrive $ABCD \sim A'B'C'D'$, con i vertici corrispondenti nello stesso ordine. Nella figura $k = 1{,}5$: ogni lato di $A'B'C'D'$ è una volta e mezza il suo omologo in $ABCD$. Con $k > 1$ il secondo poligono è un ingrandimento del primo, con $k < 1$ una riduzione, con $k = 1$ i due poligoni sono congruenti.

```tikz
% nome: poligoni-simili-rapporto
% alt: Due quadrilateri simili ABCD e A'B'C'D': gli angoli corrispondenti hanno gli stessi archetti e ogni lato del secondo è una volta e mezza il lato corrispondente del primo
% svg: poligoni-simili-rapporto-7667f4b5.svg 243x108
\begin{tikzpicture}[scale=0.9]
\fill[blue!8] (0.00,0.00) -- (1.60,0.00) -- (2.00,1.10) -- (0.40,1.30) -- cycle;
\draw[thick] (0.00,0.00) -- (1.60,0.00) -- (2.00,1.10) -- (0.40,1.30) -- cycle;
\fill[blue!8] (2.80,0.00) -- (5.20,0.00) -- (5.80,1.65) -- (3.40,1.95) -- cycle;
\draw[thick] (2.80,0.00) -- (5.20,0.00) -- (5.80,1.65) -- (3.40,1.95) -- cycle;
\draw[black] (0.09,0.29) arc[start angle=72.90, delta angle=-72.90, radius=0.30];
\draw[black] (1.35,0.00) arc[start angle=180.00, delta angle=-109.98, radius=0.25];
\draw[black] (1.28,0.00) arc[start angle=180.00, delta angle=-109.98, radius=0.32];
\draw[black] (1.91,0.87) arc[start angle=-109.98, delta angle=-77.14, radius=0.25];
\draw[black] (1.89,0.80) arc[start angle=-109.98, delta angle=-77.14, radius=0.32];
\draw[black] (1.87,0.73) arc[start angle=-109.98, delta angle=-77.14, radius=0.39];
\draw[black] (0.70,1.26) arc[start angle=-7.13, delta angle=-99.98, radius=0.30];
\draw[black] (0.52,1.11) -- (0.60,0.99);
\draw[black] (2.89,0.29) arc[start angle=72.90, delta angle=-72.90, radius=0.30];
\draw[black] (4.95,0.00) arc[start angle=180.00, delta angle=-109.98, radius=0.25];
\draw[black] (4.88,0.00) arc[start angle=180.00, delta angle=-109.98, radius=0.32];
\draw[black] (5.71,1.42) arc[start angle=-109.98, delta angle=-77.14, radius=0.25];
\draw[black] (5.69,1.35) arc[start angle=-109.98, delta angle=-77.14, radius=0.32];
\draw[black] (5.67,1.28) arc[start angle=-109.98, delta angle=-77.14, radius=0.39];
\draw[black] (3.70,1.91) arc[start angle=-7.13, delta angle=-99.98, radius=0.30];
\draw[black] (3.52,1.76) -- (3.60,1.64);
\node[below left] at (0.00,0.00) {$A$};
\node[below right] at (1.60,0.00) {$B$};
\node[above right] at (2.00,1.10) {$C$};
\node[above left] at (0.40,1.30) {$D$};
\node[below left] at (2.80,0.00) {$A'$};
\node[below right] at (5.20,0.00) {$B'$};
\node[above right] at (5.80,1.65) {$C'$};
\node[above left] at (3.40,1.95) {$D'$};
\end{tikzpicture}
```

Nelle proporzioni compaiono i segmenti; quando si passa ai numeri si scrive la misura, $\overline{AB}$, come nella lezione sul [teorema di Talete](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teorema-di-talete).

```ad-example
Esempio 1: rettangoli simili
Il rettangolo $R_1$ ha i lati di $6$ cm e $4$ cm, $R_2$ di $9$ cm e $6$ cm, $R_3$ di $7$ cm e $5$ cm. Quali sono simili a $R_1$?

```tikz
% nome: rettangoli-simili-esempio
% alt: Tre rettangoli: R1 di 6 per 4, R2 di 9 per 6 e R3 di 7 per 5
% svg: rettangoli-simili-esempio-acd6a463.svg 251x75
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (1.44,0.00) -- (1.44,0.96) -- (0.00,0.96) -- cycle;
\draw[thick] (0.00,0.00) -- (1.44,0.00) -- (1.44,0.96) -- (0.00,0.96) -- cycle;
\node[below] at (0.72,0.00) {\small $6$};
\node[right] at (1.44,0.48) {\small $4$};
\fill[blue!8] (1.85,0.00) -- (4.01,0.00) -- (4.01,1.44) -- (1.85,1.44) -- cycle;
\draw[thick] (1.85,0.00) -- (4.01,0.00) -- (4.01,1.44) -- (1.85,1.44) -- cycle;
\node[below] at (2.93,0.00) {\small $9$};
\node[right] at (4.01,0.72) {\small $6$};
\fill[blue!8] (4.45,0.00) -- (6.13,0.00) -- (6.13,1.20) -- (4.45,1.20) -- cycle;
\draw[thick] (4.45,0.00) -- (6.13,0.00) -- (6.13,1.20) -- (4.45,1.20) -- cycle;
\node[below] at (5.29,0.00) {\small $7$};
\node[right] at (6.13,0.60) {\small $5$};
\node at (0.72,0.48) {\small $R_1$};
\node at (2.93,0.72) {\small $R_2$};
\node at (5.29,0.60) {\small $R_3$};
\end{tikzpicture}
```

Tutti i rettangoli hanno quattro angoli retti, quindi gli angoli sono sempre congruenti: resta da controllare i lati. Per $R_1$ e $R_2$ i rapporti tra i lati omologhi sono $\frac{9}{6} = 1{,}5$ e $\frac{6}{4} = 1{,}5$: sono uguali, quindi $R_2$ è simile a $R_1$ con $k = 1{,}5$.

Per $R_1$ e $R_3$ i rapporti sono $\frac{7}{6}$ e $\frac{5}{4}$, e $7 \cdot 4 = 28$ è diverso da $6 \cdot 5 = 30$: i lati non sono in proporzione e $R_3$ non è simile a $R_1$.
```

```ad-warning
Servono entrambe le condizioni
Per i poligoni con più di tre lati non basta una condizione sola. Un quadrato e un rombo con lo stesso lato hanno i lati in proporzione ($k = 1$), ma gli angoli diversi. Un quadrato e un rettangolo di $2$ cm per $3$ cm hanno gli angoli congruenti (tutti retti), ma i lati non in proporzione. In nessuno dei due casi le figure sono simili.

```tikz
% nome: quadrato-rombo-rettangolo-non-simili
% alt: Un quadrato, un rombo con lo stesso lato e gli angoli di 60 e 120 gradi, e un rettangolo con gli angoli retti ma i lati di lunghezze diverse: nessuno dei due è simile al quadrato
% svg: quadrato-rombo-rettangolo-non-simili-7ec10e4f.svg 230x68
\begin{tikzpicture}[scale=0.85]
\fill[blue!8] (0.00,0.00) -- (1.30,0.00) -- (1.30,1.30) -- (0.00,1.30) -- cycle;
\draw[thick] (0.00,0.00) -- (1.30,0.00) -- (1.30,1.30) -- (0.00,1.30) -- cycle;
\fill[blue!8] (1.80,0.00) -- (3.10,0.00) -- (3.75,1.13) -- (2.45,1.13) -- cycle;
\draw[thick] (1.80,0.00) -- (3.10,0.00) -- (3.75,1.13) -- (2.45,1.13) -- cycle;
\fill[blue!8] (4.60,0.00) -- (6.80,0.00) -- (6.80,1.30) -- (4.60,1.30) -- cycle;
\draw[thick] (4.60,0.00) -- (6.80,0.00) -- (6.80,1.30) -- (4.60,1.30) -- cycle;
\draw (0.00,0.18) -- (0.18,0.18) -- (0.18,0.00);
\draw (1.12,0.00) -- (1.12,0.18) -- (1.30,0.18);
\draw (1.30,1.12) -- (1.12,1.12) -- (1.12,1.30);
\draw (0.18,1.30) -- (0.18,1.12) -- (0.00,1.12);
\draw (4.60,0.18) -- (4.78,0.18) -- (4.78,0.00);
\draw (6.62,0.00) -- (6.62,0.18) -- (6.80,0.18);
\draw (6.80,1.12) -- (6.62,1.12) -- (6.62,1.30);
\draw (4.78,1.30) -- (4.78,1.12) -- (4.60,1.12);
\draw[black] (0.65,0.10) -- (0.65,-0.10);
\draw[black] (1.20,0.65) -- (1.40,0.65);
\draw[black] (0.65,1.20) -- (0.65,1.40);
\draw[black] (0.10,0.65) -- (-0.10,0.65);
\draw[black] (2.45,0.10) -- (2.45,-0.10);
\draw[black] (3.34,0.61) -- (3.51,0.51);
\draw[black] (3.10,1.03) -- (3.10,1.23);
\draw[black] (2.21,0.51) -- (2.04,0.61);
\node at (0.65,-0.30) {\small quadrato};
\node at (2.80,-0.30) {\small rombo};
\node at (5.70,-0.30) {\small rettangolo};
\end{tikzpicture}
```
```

Due poligoni regolari con lo stesso numero di lati sono sempre simili: gli angoli sono congruenti, perché dipendono solo dal numero di lati, e il rapporto tra i lati è lo stesso per tutte le coppie. Per esempio tutti i quadrati sono simili tra loro, e così tutti i triangoli equilateri.

## I criteri di similitudine dei triangoli

Per i triangoli basta meno della definizione: tre criteri dicono quando due triangoli sono simili controllando solo una parte degli angoli e dei lati, come i [criteri di congruenza](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/triangoli-e-criteri-di-congruenza) per i triangoli congruenti.

### Primo criterio: due angoli

Primo criterio di similitudine: se due triangoli hanno due angoli ordinatamente congruenti, allora sono simili.

```tikz
% nome: primo-criterio-similitudine
% alt: Due triangoli ABC e A'B'C' con gli angoli in A e in A' congruenti (un archetto) e gli angoli in B e in B' congruenti (due archetti)
% svg: primo-criterio-similitudine-41c13b9a.svg 257x102
\begin{tikzpicture}
\fill[blue!8] (0.72,1.07) -- (0.00,0.00) -- (1.77,0.00) -- cycle;
\draw[thick] (0.72,1.07) -- (0.00,0.00) -- (1.77,0.00) -- cycle;
\fill[blue!8] (3.98,1.61) -- (2.90,0.00) -- (5.55,0.00) -- cycle;
\draw[thick] (3.98,1.61) -- (2.90,0.00) -- (5.55,0.00) -- cycle;
\draw[black] (0.56,0.82) arc[start angle=-124.04, delta angle=78.34, radius=0.30];
\draw[black] (0.17,0.25) arc[start angle=55.96, delta angle=-55.96, radius=0.30];
\draw[black] (0.21,0.31) arc[start angle=55.96, delta angle=-55.96, radius=0.37];
\draw[black] (3.82,1.36) arc[start angle=-124.04, delta angle=78.34, radius=0.30];
\draw[black] (3.07,0.25) arc[start angle=55.96, delta angle=-55.96, radius=0.30];
\draw[black] (3.11,0.31) arc[start angle=55.96, delta angle=-55.96, radius=0.37];
\node[above] at (0.72,1.07) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (1.77,0.00) {$C$};
\node[above] at (3.98,1.61) {$A'$};
\node[below left] at (2.90,0.00) {$B'$};
\node[below right] at (5.55,0.00) {$C'$};
\end{tikzpicture}
```

Il terzo angolo viene da sé: la somma degli angoli è $180^\circ$ in tutti e due i triangoli, quindi anche $\hat{C} \cong \hat{C}'$. Il criterio dice che allora anche i lati sono in proporzione.

Ipotesi: nei triangoli $ABC$ e $A'B'C'$, $\hat{A} \cong \hat{A}'$ e $\hat{B} \cong \hat{B}'$.

Tesi: $\triangle ABC \sim \triangle A'B'C'$.

Se $A'B' \cong AB$, i triangoli sono congruenti per il secondo criterio di congruenza, e sono simili con $k = 1$. Altrimenti uno dei due lati è più corto: supponiamo che sia $A'B'$ (nell'altro caso si scambiano i nomi dei triangoli).

```tikz
% nome: primo-criterio-similitudine-dimostrazione
% alt: A sinistra il triangolo A'B'C', a destra il triangolo ABC con D su AB tale che AD è congruente ad A'B', DE parallelo a BC ed EF parallelo ad AB; il triangolo ADE è colorato
% svg: primo-criterio-similitudine-dimostrazione-3290925d.svg 271x116
\begin{tikzpicture}[scale=0.9]
\fill[blue!8] (0.82,1.33) -- (0.00,0.00) -- (2.04,0.00) -- cycle;
\draw[thick] (0.82,1.33) -- (0.00,0.00) -- (2.04,0.00) -- cycle;
\fill[blue!8] (4.57,2.21) -- (3.20,0.00) -- (6.60,0.00) -- cycle;
\draw[thick] (4.57,2.21) -- (3.20,0.00) -- (6.60,0.00) -- cycle;
\fill[blue!20] (4.57,2.21) -- (3.75,0.88) -- (5.79,0.88) -- cycle;
\draw[thick, blue!70!black] (3.75,0.88) -- (5.79,0.88);
\draw[densely dashed] (5.79,0.88) -- (5.24,0.00);
\draw[black] (0.66,1.07) arc[start angle=-121.81, delta angle=74.38, radius=0.30];
\draw[black] (0.15,0.24) arc[start angle=58.19, delta angle=-58.19, radius=0.28];
\draw[black] (0.18,0.30) arc[start angle=58.19, delta angle=-58.19, radius=0.35];
\draw[black] (4.41,1.95) arc[start angle=-121.81, delta angle=74.38, radius=0.30];
\draw[black] (3.90,1.12) arc[start angle=58.19, delta angle=-58.19, radius=0.28];
\draw[black] (3.93,1.18) arc[start angle=58.19, delta angle=-58.19, radius=0.35];
\draw[black] (3.35,0.24) arc[start angle=58.19, delta angle=-58.19, radius=0.28];
\draw[black] (3.38,0.30) arc[start angle=58.19, delta angle=-58.19, radius=0.35];
\draw[black] (0.50,0.61) -- (0.33,0.72);
\draw[black] (4.24,1.49) -- (4.07,1.60);
\node[above] at (0.82,1.33) {$A'$};
\node[below left] at (0.00,0.00) {$B'$};
\node[below right] at (2.04,0.00) {$C'$};
\node[above] at (4.57,2.21) {$A$};
\node[below left] at (3.20,0.00) {$B$};
\node[below right] at (6.60,0.00) {$C$};
\node[left] at (3.75,0.88) {$D$};
\node[right] at (5.79,0.88) {$E$};
\node[below] at (5.24,0.00) {$F$};
\fill (3.75,0.88) circle (0.05);
\fill (5.79,0.88) circle (0.05);
\fill (5.24,0.00) circle (0.05);
\end{tikzpicture}
```

1. Su $AB$ prendi il punto $D$ con $AD \cong A'B'$, e da $D$ traccia la parallela a $BC$, che incontra $AC$ in $E$.
2. $\widehat{ADE} \cong \hat{B}$, perché sono angoli corrispondenti formati dalle parallele $DE$ e $BC$ con la trasversale $AB$; per ipotesi $\hat{B} \cong \hat{B}'$, quindi $\widehat{ADE} \cong \hat{B}'$.
3. I triangoli $ADE$ e $A'B'C'$ hanno $AD \cong A'B'$, $\hat{A} \cong \hat{A}'$ e $\widehat{ADE} \cong \hat{B}'$: per il secondo criterio di congruenza sono congruenti, quindi $AE \cong A'C'$ e $DE \cong B'C'$.
4. Nel triangolo $ABC$ la retta $DE$ è parallela a $BC$: per il [teorema di Talete nel triangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teorema-di-talete), $AD : AB = AE : AC$.
5. Da $E$ traccia la parallela ad $AB$, che incontra $BC$ in $F$. Il quadrilatero $DBFE$ ha i lati opposti paralleli, quindi è un parallelogramma e $DE \cong BF$. La retta $EF$ è parallela al lato $AB$, quindi, sempre per il teorema di Talete nel triangolo, $AE : AC = BF : BC$, cioè $AE : AC = DE : BC$.
6. Dai passi 4 e 5, $AD : AB = AE : AC = DE : BC$. Per il passo 3 al posto di $AD$, $AE$, $DE$ si possono mettere $A'B'$, $A'C'$, $B'C'$: i lati di $A'B'C'$ sono in proporzione con quelli di $ABC$. Gli angoli sono congruenti, quindi i triangoli sono simili.

La dimostrazione dice anche un'altra cosa, che si usa spesso: una retta parallela a un lato di un triangolo stacca un triangolo simile a quello di partenza. Nella figura $\triangle ADE \sim \triangle ABC$, e quindi $DE : BC = AD : AB$.

```ad-example
Esempio 2: due angoli
Il triangolo $ABC$ ha $\hat{A} = 50^\circ$ e $\hat{B} = 70^\circ$; il triangolo $DEF$ ha $\hat{D} = 60^\circ$ ed $\hat{E} = 70^\circ$. Sono simili? Quali vertici si corrispondono?

```tikz
% nome: similitudine-esempio-due-angoli
% alt: Il triangolo ABC con gli angoli di 50 gradi in A e 70 gradi in B, e il triangolo DEF con gli angoli di 60 gradi in D e 70 gradi in E; gli archetti mostrano che A corrisponde a F, B a E, C a D
% svg: similitudine-esempio-due-angoli-eb8e928c.svg 265x156
\begin{tikzpicture}[scale=0.88]
\fill[blue!8] (0.00,0.00) -- (2.30,0.00) -- (1.60,1.91) -- cycle;
\draw[thick] (0.00,0.00) -- (2.30,0.00) -- (1.60,1.91) -- cycle;
\fill[blue!8] (3.40,0.00) -- (6.70,0.00) -- (5.42,3.51) -- cycle;
\draw[thick] (3.40,0.00) -- (6.70,0.00) -- (5.42,3.51) -- cycle;
\draw[black] (0.35,0.00) arc[start angle=0.00, delta angle=50.00, radius=0.35];
\draw[black] (2.00,0.00) arc[start angle=180.00, delta angle=-70.00, radius=0.30];
\draw[black] (1.93,0.00) arc[start angle=180.00, delta angle=-70.00, radius=0.37];
\draw[black] (1.41,1.68) arc[start angle=-130.00, delta angle=60.00, radius=0.30];
\draw[black] (1.37,1.63) arc[start angle=-130.00, delta angle=60.00, radius=0.37];
\draw[black] (1.32,1.57) arc[start angle=-130.00, delta angle=60.00, radius=0.44];
\draw[black] (5.25,3.20) arc[start angle=-120.00, delta angle=50.00, radius=0.35];
\draw[black] (6.40,0.00) arc[start angle=180.00, delta angle=-70.00, radius=0.30];
\draw[black] (6.33,0.00) arc[start angle=180.00, delta angle=-70.00, radius=0.37];
\draw[black] (3.70,0.00) arc[start angle=0.00, delta angle=60.00, radius=0.30];
\draw[black] (3.77,0.00) arc[start angle=0.00, delta angle=60.00, radius=0.37];
\draw[black] (3.84,0.00) arc[start angle=0.00, delta angle=60.00, radius=0.44];
\node at (0.62,0.22) {\scriptsize $50^\circ$};
\node at (1.68,0.22) {\scriptsize $70^\circ$};
\node at (4.06,0.22) {\scriptsize $60^\circ$};
\node at (6.06,0.22) {\scriptsize $70^\circ$};
\node[below left] at (0.00,0.00) {$A$};
\node[below right] at (2.30,0.00) {$B$};
\node[above] at (1.60,1.91) {$C$};
\node[below left] at (3.40,0.00) {$D$};
\node[below right] at (6.70,0.00) {$E$};
\node[above] at (5.42,3.51) {$F$};
\end{tikzpicture}
```

Il terzo angolo di $ABC$ è $\hat{C} = 180^\circ - 50^\circ - 70^\circ = 60^\circ$, quello di $DEF$ è $\hat{F} = 180^\circ - 60^\circ - 70^\circ = 50^\circ$. I due triangoli hanno gli angoli di $50^\circ$, $60^\circ$ e $70^\circ$: per il primo criterio sono simili. Si corrispondono i vertici con angoli congruenti, $A$ con $F$, $B$ con $E$, $C$ con $D$, e si scrive $\triangle ABC \sim \triangle FED$.
```

```ad-example
Esempio 3: una parallela a un lato
Nel triangolo $ABC$ il segmento $DE$ è parallelo a $BC$, con $D$ su $AB$ ed $E$ su $AC$. Sai che $\overline{AD} = 4$ cm, $\overline{DB} = 2$ cm e $\overline{BC} = 9$ cm. Trova $DE$.

```tikz
% nome: similitudine-parallela-lato-esempio
% alt: Triangolo ABC con DE parallelo a BC: AD misura 4, DB misura 2, BC misura 9 e DE è incognito; il triangolo ADE è colorato
% svg: similitudine-parallela-lato-esempio-9180146c.svg 172x126
\begin{tikzpicture}
\fill[blue!8] (1.00,2.30) -- (0.00,0.00) -- (3.42,0.00) -- cycle;
\draw[thick] (1.00,2.30) -- (0.00,0.00) -- (3.42,0.00) -- cycle;
\fill[blue!20] (1.00,2.30) -- (0.33,0.77) -- (2.61,0.77) -- cycle;
\draw[thick, blue!70!black] (0.33,0.77) -- (2.61,0.77);
\node at (0.44,1.63) {\small $4$};
\node at (-0.06,0.48) {\small $2$};
\node at (1.71,-0.25) {\small $9$};
\node[above] at (1.47,0.77) {\small $x$};
\node[above] at (1.00,2.30) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (3.42,0.00) {$C$};
\node[left] at (0.33,0.77) {$D$};
\node[right] at (2.61,0.77) {$E$};
\fill (0.33,0.77) circle (0.05);
\fill (2.61,0.77) circle (0.05);
\end{tikzpicture}
```

I triangoli $ADE$ e $ABC$ hanno l'angolo $\hat{A}$ in comune e $\widehat{ADE} \cong \widehat{ABC}$, perché sono corrispondenti rispetto alle parallele $DE$ e $BC$: per il primo criterio sono simili. I lati omologhi sono in proporzione, con il lato intero $\overline{AB} = 4 + 2 = 6$ cm:

$$
\begin{gathered}
DE : BC = AD : AB \\
x : 9 = 4 : 6 \\
x = \frac{9 \cdot 4}{6} = 6
\end{gathered}
$$

Quindi $\overline{DE} = 6$ cm. Con $DB$ al posto di $AB$ si avrebbe $x : 9 = 4 : 2$, cioè $x = 18$: più lungo di $BC$, che è impossibile.
```

### Secondo criterio: un angolo e i due lati che lo comprendono

Secondo criterio di similitudine: se due triangoli hanno un angolo congruente e i lati che lo comprendono in proporzione, allora sono simili.

```tikz
% nome: secondo-criterio-similitudine
% alt: Due triangoli con gli angoli in A e in A' congruenti; i lati che li comprendono misurano 4 e 6 nel primo, 6 e 9 nel secondo
% svg: secondo-criterio-similitudine-5b22a0bf.svg 245x115
\begin{tikzpicture}
\fill[blue!8] (0.80,1.50) -- (0.20,0.46) -- (1.83,0.03) -- cycle;
\draw[thick] (0.80,1.50) -- (0.20,0.46) -- (1.83,0.03) -- cycle;
\fill[blue!8] (3.90,2.25) -- (3.00,0.69) -- (5.45,0.04) -- cycle;
\draw[thick] (3.90,2.25) -- (3.00,0.69) -- (5.45,0.04) -- cycle;
\draw[black] (0.65,1.24) arc[start angle=-120.00, delta angle=65.00, radius=0.30];
\draw[black] (3.75,1.99) arc[start angle=-120.00, delta angle=65.00, radius=0.30];
\node at (0.28,1.11) {\small $4$};
\node at (1.52,0.91) {\small $6$};
\node at (3.23,1.60) {\small $6$};
\node at (4.88,1.29) {\small $9$};
\node[above] at (0.80,1.50) {$A$};
\node[below left] at (0.20,0.46) {$B$};
\node[right] at (1.83,0.03) {$C$};
\node[above] at (3.90,2.25) {$A'$};
\node[below left] at (3.00,0.69) {$B'$};
\node[right] at (5.45,0.04) {$C'$};
\end{tikzpicture}
```

Nella figura $\hat{A} \cong \hat{A}'$, e i lati che comprendono questi angoli sono in proporzione: $\frac{6}{4} = \frac{9}{6} = 1{,}5$. Per il secondo criterio i triangoli sono simili con $k = 1{,}5$, e anche il terzo lato $B'C'$ è una volta e mezza $BC$.

```ad-note
Perché vale il secondo criterio
Supponi $A'B' < AB$. Su $AB$ prendi $D$ con $AD \cong A'B'$ e traccia da $D$ la parallela a $BC$, che incontra $AC$ in $E$. Il triangolo $ADE$ è simile ad $ABC$ (primo criterio), quindi $AE : AC = AD : AB$. Per ipotesi $A'C' : AC = A'B' : AB$, e $AD \cong A'B'$: allora $AE : AC = A'C' : AC$, cioè $AE \cong A'C'$. I triangoli $ADE$ e $A'B'C'$ hanno due lati e l'angolo compreso congruenti, e per il primo criterio di congruenza sono congruenti. Quindi anche $A'B'C'$ è simile ad $ABC$.
```

```ad-example
Esempio 4: un angolo di 40 gradi
Tre triangoli hanno un angolo di $40^\circ$: in $ABC$ è compreso tra i lati di $5$ e $3$ cm, in $DEF$ tra i lati di $10$ e $6$ cm, in $GHK$ tra i lati di $9$ e $6$ cm. Quali sono simili ad $ABC$?

```tikz
% nome: similitudine-esempio-angolo-e-lati
% alt: Tre triangoli con un angolo di 40 gradi: nel primo è compreso tra i lati di 5 e 3, nel secondo tra 10 e 6, nel terzo tra 9 e 6
% svg: similitudine-esempio-angolo-e-lati-8c8c5c42.svg 260x161
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (1.50,0.00) -- (0.69,0.58) -- cycle;
\draw[thick] (0.00,0.00) -- (1.50,0.00) -- (0.69,0.58) -- cycle;
\draw[black] (0.35,0.00) arc[start angle=0.00, delta angle=40.00, radius=0.35];
\node[below] at (0.75,0.00) {\small $5$};
\node at (0.20,0.46) {\small $3$};
\node[left] at (0.00,0.00) {$A$};
\node[right] at (1.50,0.00) {$B$};
\node[above] at (0.69,0.58) {$C$};
\fill[blue!8] (2.75,0.00) -- (5.75,0.00) -- (4.13,1.16) -- cycle;
\draw[thick] (2.75,0.00) -- (5.75,0.00) -- (4.13,1.16) -- cycle;
\draw[black] (3.10,0.00) arc[start angle=0.00, delta angle=40.00, radius=0.35];
\node[below] at (4.25,0.00) {\small $10$};
\node at (3.30,0.75) {\small $6$};
\node[left] at (2.75,0.00) {$D$};
\node[right] at (5.75,0.00) {$E$};
\node[above] at (4.13,1.16) {$F$};
\fill[blue!8] (2.75,-2.10) -- (5.45,-2.10) -- (4.13,-0.94) -- cycle;
\draw[thick] (2.75,-2.10) -- (5.45,-2.10) -- (4.13,-0.94) -- cycle;
\draw[black] (3.10,-2.10) arc[start angle=0.00, delta angle=40.00, radius=0.35];
\node[below] at (4.10,-2.10) {\small $9$};
\node at (3.30,-1.35) {\small $6$};
\node[left] at (2.75,-2.10) {$G$};
\node[right] at (5.45,-2.10) {$H$};
\node[above] at (4.13,-0.94) {$K$};
\node at (0.62,0.20) {\scriptsize $40^\circ$};
\end{tikzpicture}
```

Per $ABC$ e $DEF$ i rapporti tra i lati che comprendono l'angolo sono $\frac{10}{5} = 2$ e $\frac{6}{3} = 2$: sono uguali, quindi per il secondo criterio $\triangle ABC \sim \triangle DEF$ con $k = 2$.

Per $ABC$ e $GHK$ i rapporti sono $\frac{9}{5} = 1{,}8$ e $\frac{6}{3} = 2$: diversi. L'angolo congruente c'è, ma i lati non sono in proporzione, e il secondo criterio non si può usare: $GHK$ non è simile ad $ABC$.
```

### Terzo criterio: i tre lati

Terzo criterio di similitudine: se due triangoli hanno i tre lati in proporzione, allora sono simili.

```tikz
% nome: terzo-criterio-similitudine
% alt: Due triangoli con i lati di 4, 6 e 8 e di 6, 9 e 12: i lati corrispondenti sono in proporzione
% svg: terzo-criterio-similitudine-2da20c82.svg 273x81
\begin{tikzpicture}
\fill[blue!8] (0.66,0.70) -- (0.00,0.00) -- (1.92,0.00) -- cycle;
\draw[thick] (0.66,0.70) -- (0.00,0.00) -- (1.92,0.00) -- cycle;
\fill[blue!8] (4.09,1.05) -- (3.10,0.00) -- (5.98,0.00) -- cycle;
\draw[thick] (4.09,1.05) -- (3.10,0.00) -- (5.98,0.00) -- cycle;
\node at (0.17,0.50) {\small $4$};
\node at (1.41,0.57) {\small $6$};
\node at (0.96,-0.25) {\small $8$};
\node at (3.44,0.67) {\small $6$};
\node at (5.16,0.74) {\small $9$};
\node at (4.54,-0.25) {\small $12$};
\node[above] at (0.66,0.70) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (1.92,0.00) {$C$};
\node[above] at (4.09,1.05) {$A'$};
\node[below left] at (3.10,0.00) {$B'$};
\node[below right] at (5.98,0.00) {$C'$};
\end{tikzpicture}
```

Nella figura $\frac{6}{4} = \frac{9}{6} = \frac{12}{8} = 1{,}5$: i triangoli sono simili, e quindi hanno anche gli angoli congruenti, senza bisogno di misurarli. Il criterio si dimostra con la stessa costruzione del secondo, usando alla fine il terzo criterio di congruenza.

Per controllare se tre lati sono in proporzione, metti in ordine i lati di ciascun triangolo, dal più corto al più lungo, e fai i rapporti tra il più corto e il più corto, il medio e il medio, il più lungo e il più lungo: i lati omologhi stanno nello stesso ordine, perché in un triangolo al lato più lungo sta opposto l'angolo più grande.

### Riconoscere i lati omologhi

In due triangoli simili i lati omologhi sono quelli opposti ad angoli congruenti. La posizione nel disegno non conta: uno dei due triangoli può essere girato o ribaltato.

```ad-example
Esempio 5: il triangolo girato
Il triangolo $ABC$ ha $\overline{AB} = 6$ cm, $\overline{BC} = 8$ cm e $\overline{CA} = 5$ cm. Il triangolo $DEF$ ha $\hat{E} \cong \hat{A}$, $\hat{F} \cong \hat{B}$ ed $\overline{EF} = 9$ cm. Trova gli altri due lati di $DEF$.

```tikz
% nome: similitudine-lati-omologhi
% alt: Il triangolo ABC con AB di 6, BC di 8 e CA di 5, e il triangolo DEF disegnato girato, con l'angolo in E congruente all'angolo in A (un archetto), l'angolo in F congruente all'angolo in B (due archetti) ed EF di 9
% svg: similitudine-lati-omologhi-5bb1cf2e.svg 299x118
\begin{tikzpicture}
\fill[blue!8] (1.41,1.12) -- (0.00,0.00) -- (2.40,0.00) -- cycle;
\draw[thick] (1.41,1.12) -- (0.00,0.00) -- (2.40,0.00) -- cycle;
\fill[blue!8] (3.40,0.00) -- (4.22,2.09) -- (6.78,1.23) -- cycle;
\draw[thick] (3.40,0.00) -- (4.22,2.09) -- (6.78,1.23) -- cycle;
\draw[black] (1.17,0.94) arc[start angle=-141.38, delta angle=92.87, radius=0.30];
\draw[black] (0.23,0.19) arc[start angle=38.62, delta angle=-38.62, radius=0.30];
\draw[black] (0.29,0.23) arc[start angle=38.62, delta angle=-38.62, radius=0.37];
\draw[black] (4.11,1.81) arc[start angle=-111.49, delta angle=92.87, radius=0.30];
\draw[black] (6.50,1.13) arc[start angle=-160.00, delta angle=-38.62, radius=0.30];
\draw[black] (6.44,1.10) arc[start angle=-160.00, delta angle=-38.62, radius=0.37];
\node at (0.55,0.75) {\small $6$};
\node at (2.08,0.72) {\small $5$};
\node at (1.20,-0.25) {\small $8$};
\node at (5.58,1.90) {\small $9$};
\node[above] at (1.41,1.12) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (2.40,0.00) {$C$};
\node at (3.20,-0.16) {$D$};
\node at (4.10,2.31) {$E$};
\node at (7.03,1.25) {$F$};
\end{tikzpicture}
```

Per il primo criterio i triangoli sono simili, e anche $\hat{D} \cong \hat{C}$. La corrispondenza è $A \to E$, $B \to F$, $C \to D$: si scrive $\triangle ABC \sim \triangle EFD$. I lati omologhi sono $AB$ ed $EF$, $BC$ ed $FD$, $CA$ e $DE$. Il rapporto di similitudine è $k = \frac{EF}{AB} = \frac{9}{6} = 1{,}5$, quindi

$$
\begin{gathered}
\overline{FD} = 1{,}5 \cdot 8 = 12 \\
\overline{DE} = 1{,}5 \cdot 5 = 7{,}5
\end{gathered}
$$

$\overline{FD} = 12$ cm e $\overline{DE} = 7{,}5$ cm.
```

```ad-warning
I lati omologhi non si scelgono dal disegno
Nell'esempio 5 il lato di $DEF$ disegnato in basso non è l'omologo di $BC$. Prima si trovano gli angoli congruenti, poi si prendono i lati opposti a quegli angoli. Scrivere la similitudine con i vertici nell'ordine giusto, $\triangle ABC \sim \triangle EFD$, dà subito le coppie: primo e secondo vertice ($AB$ ed $EF$), secondo e terzo ($BC$ ed $FD$), terzo e primo ($CA$ e $DE$).
```

```ad-example
Esempio 6: le diagonali del trapezio
Nel trapezio $ABCD$ la base maggiore $AB$ misura $12$ cm e la base minore $CD$ misura $8$ cm; le diagonali si incontrano in $O$, e la diagonale $AC$ misura $15$ cm. Trova $AO$ e $OC$.

```tikz
% nome: similitudine-trapezio-diagonali
% alt: Trapezio ABCD con la base maggiore AB di 12 e la base minore CD di 8; le diagonali si incontrano in O, e i triangoli colorati AOB e COD hanno gli angoli alterni interni congruenti
% svg: similitudine-trapezio-diagonali-58fe93df.svg 178x176
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (3.60,0.00) -- (2.70,3.60) -- (0.30,3.60) -- cycle;
\draw[thick] (0.00,0.00) -- (3.60,0.00) -- (2.70,3.60) -- (0.30,3.60) -- cycle;
\fill[blue!20] (0.00,0.00) -- (3.60,0.00) -- (1.62,2.16) -- cycle;
\fill[blue!20] (2.70,3.60) -- (0.30,3.60) -- (1.62,2.16) -- cycle;
\draw[thick] (0.00,0.00) -- (2.70,3.60);
\draw[thick] (3.60,0.00) -- (0.30,3.60);
\draw[black] (0.45,0.00) arc[start angle=0.00, delta angle=53.13, radius=0.45];
\draw[black] (2.25,3.60) arc[start angle=180.00, delta angle=53.13, radius=0.45];
\draw[black] (3.15,0.00) arc[start angle=180.00, delta angle=-47.49, radius=0.45];
\draw[black] (3.08,0.00) arc[start angle=180.00, delta angle=-47.49, radius=0.52];
\draw[black] (0.75,3.60) arc[start angle=0.00, delta angle=-47.49, radius=0.45];
\draw[black] (0.82,3.60) arc[start angle=0.00, delta angle=-47.49, radius=0.52];
\node[below] at (1.80,0.00) {\small $12$};
\node[above] at (1.50,3.60) {\small $8$};
\node[below left] at (0.00,0.00) {$A$};
\node[below right] at (3.60,0.00) {$B$};
\node[above right] at (2.70,3.60) {$C$};
\node[above left] at (0.30,3.60) {$D$};
\node[left=2pt] at (1.62,2.16) {$O$};
\fill (1.62,2.16) circle (0.05);
\end{tikzpicture}
```

Le basi sono parallele, quindi $\widehat{OAB} \cong \widehat{OCD}$ e $\widehat{OBA} \cong \widehat{ODC}$, perché sono angoli alterni interni rispetto alle trasversali $AC$ e $BD$. Per il primo criterio $\triangle AOB \sim \triangle COD$, e i lati omologhi $AB$ e $CD$ danno il rapporto $\frac{AB}{CD} = \frac{12}{8} = \frac{3}{2}$. Anche $AO$ e $OC$ sono omologhi (opposti agli angoli congruenti in $B$ e in $D$), quindi $AO : OC = 3 : 2$.

$AO$ e $OC$ si dividono i $15$ cm in parti proporzionali a $3$ e $2$: $\overline{AO} = \dfrac{15 \cdot 3}{5} = 9$ cm e $\overline{OC} = \dfrac{15 \cdot 2}{5} = 6$ cm. Anche la diagonale $BD$ è divisa da $O$ nel rapporto $3 : 2$.
```

## Perimetri, altezze e aree

Se due poligoni sono simili con rapporto $k$, ogni lato del secondo è $k$ volte il suo omologo, quindi anche il perimetro è $k$ volte:

$$\frac{2p'}{2p} = k$$

dove $2p$ e $2p'$ sono i due perimetri.

Nei triangoli simili anche le altezze corrispondenti stanno nel rapporto $k$. Se $AH$ e $A'H'$ sono le altezze relative ai lati omologhi $BC$ e $B'C'$, i triangoli $ABH$ e $A'B'H'$ hanno un angolo retto in $H$ e in $H'$ e $\hat{B} \cong \hat{B}'$: per il primo criterio sono simili, e quindi $A'H' : AH = A'B' : AB = k$.

```tikz
% nome: similitudine-altezze-corrispondenti
% alt: Due triangoli simili ABC e A'B'C' con le altezze AH e A'H' tratteggiate; i triangoli ABH e A'B'H' hanno un angolo retto e l'angolo in B congruente all'angolo in B'
% svg: similitudine-altezze-corrispondenti-6b9aaad6.svg 261x102
\begin{tikzpicture}
\fill[blue!8] (0.60,1.06) -- (0.00,0.00) -- (1.87,0.00) -- cycle;
\draw[thick] (0.60,1.06) -- (0.00,0.00) -- (1.87,0.00) -- cycle;
\fill[blue!8] (3.76,1.60) -- (2.85,0.00) -- (5.66,0.00) -- cycle;
\draw[thick] (3.76,1.60) -- (2.85,0.00) -- (5.66,0.00) -- cycle;
\draw[densely dashed] (0.60,1.06) -- (0.60,0.00);
\draw[densely dashed] (3.76,1.60) -- (3.76,0.00);
\draw (0.75,0.00) -- (0.75,0.15) -- (0.60,0.15);
\draw (3.91,0.00) -- (3.91,0.15) -- (3.76,0.15);
\draw[black] (0.15,0.26) arc[start angle=60.45, delta angle=-60.45, radius=0.30];
\draw[black] (3.00,0.26) arc[start angle=60.45, delta angle=-60.45, radius=0.30];
\node[above] at (0.60,1.06) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (1.87,0.00) {$C$};
\node[below] at (0.60,0.00) {$H$};
\node[above] at (3.76,1.60) {$A'$};
\node[below left] at (2.85,0.00) {$B'$};
\node[below right] at (5.66,0.00) {$C'$};
\node[below] at (3.76,0.00) {$H'$};
\end{tikzpicture}
```

L'area invece cambia con $k^2$. L'area di un triangolo è la base per l'altezza diviso $2$ (lezione [Equivalenza e aree](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/equivalenza-e-aree)); se il primo triangolo ha base $b$, altezza $h$ e area $\mathcal{A}$, nel triangolo simile la base e l'altezza sono entrambe moltiplicate per $k$, e la sua area $\mathcal{A}'$ è moltiplicata per $k \cdot k$:

$$
\begin{aligned}
\mathcal{A}' &= \frac{(k \cdot b)(k \cdot h)}{2} \\
&= k^2 \cdot \frac{b \cdot h}{2} = k^2 \cdot \mathcal{A}
\end{aligned}
$$

Con $k = 2$ il triangolo grande contiene $4$ copie del piccolo, con $k = 3$ ne contiene $9$. Lo stesso vale per i poligoni simili, che si dividono in triangoli simili: il rapporto tra le aree è $k^2$.

```tikz
% nome: similitudine-rapporto-aree
% alt: Tre triangoli simili con rapporto 1, 2 e 3 rispetto al più piccolo: il secondo si divide in 4 copie del primo, il terzo in 9
% svg: similitudine-rapporto-aree-6c24112d.svg 220x100
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (0.80,0.00) -- (0.35,0.70) -- cycle;
\draw[thick] (0.00,0.00) -- (0.80,0.00) -- (0.35,0.70) -- cycle;
\node[below] at (0.40,0.00) {\small $k = 1$};
\fill[blue!8] (1.20,0.00) -- (2.80,0.00) -- (1.90,1.40) -- cycle;
\draw[thick] (1.20,0.00) -- (2.80,0.00) -- (1.90,1.40) -- cycle;
\draw[thin] (1.55,0.70) -- (2.35,0.70);
\draw[thin] (2.00,0.00) -- (2.35,0.70);
\draw[thin] (2.00,0.00) -- (1.55,0.70);
\node[below] at (2.00,0.00) {\small $k = 2$};
\fill[blue!8] (3.20,0.00) -- (5.60,0.00) -- (4.25,2.10) -- cycle;
\draw[thick] (3.20,0.00) -- (5.60,0.00) -- (4.25,2.10) -- cycle;
\draw[thin] (3.55,0.70) -- (5.15,0.70);
\draw[thin] (4.00,0.00) -- (4.70,1.40);
\draw[thin] (4.00,0.00) -- (3.55,0.70);
\draw[thin] (3.90,1.40) -- (4.70,1.40);
\draw[thin] (4.80,0.00) -- (5.15,0.70);
\draw[thin] (4.80,0.00) -- (3.90,1.40);
\node[below] at (4.40,0.00) {\small $k = 3$};
\end{tikzpicture}
```

```ad-warning
Lati doppi, area quadrupla
Raddoppiando i lati di una figura l'area non raddoppia: diventa $2^2 = 4$ volte. Allo stesso modo, se il rapporto tra le aree è $9$, il rapporto tra i lati è $\sqrt{9} = 3$, non $9$.
```

```ad-example
Esempio 7: perimetro e area
Un triangolo ha perimetro $24$ cm e area $20\ \text{cm}^2$. Un triangolo simile ha i lati tre volte più lunghi. Trova il suo perimetro e la sua area.

Il rapporto di similitudine è $k = 3$. Il perimetro è $3 \cdot 24 = 72$ cm, l'area è $3^2 \cdot 20 = 9 \cdot 20 = 180\ \text{cm}^2$.

Al contrario: due triangoli simili hanno le aree di $50\ \text{cm}^2$ e $18\ \text{cm}^2$. Il rapporto tra le aree è $\frac{50}{18} = \frac{25}{9}$, quindi $k^2 = \frac{25}{9}$ e il rapporto tra i lati è $k = \frac{5}{3}$.
```

## I teoremi di Euclide con la similitudine

I [teoremi di Euclide](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide) si possono dimostrare anche con la similitudine. Nel triangolo $ABC$ rettangolo in $C$ traccia l'altezza $CH$ relativa all'ipotenusa $AB$: $AH$ e $HB$ sono le proiezioni dei cateti $AC$ e $BC$ sull'ipotenusa.

```tikz
% nome: similitudine-euclide-triangolo-rettangolo
% alt: Triangolo ABC rettangolo in C con l'altezza CH relativa all'ipotenusa AB; l'angolo in A e l'angolo HCB hanno un archetto, l'angolo in B e l'angolo ACH due archetti
% svg: similitudine-euclide-triangolo-rettangolo-957f8664.svg 219x121
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (4.68,0.00) -- (1.44,2.16) -- cycle;
\draw[thick] (0.00,0.00) -- (4.68,0.00) -- (1.44,2.16) -- cycle;
\draw[thick, blue!70!black] (1.44,2.16) -- (1.44,0.00);
\draw (1.34,2.01) -- (1.49,1.91) -- (1.59,2.06);
\draw (1.59,0.00) -- (1.59,0.15) -- (1.44,0.15);
\draw[black] (0.35,0.00) arc[start angle=0.00, delta angle=56.31, radius=0.35];
\draw[black] (4.35,0.22) arc[start angle=146.31, delta angle=33.69, radius=0.40];
\draw[black] (4.29,0.26) arc[start angle=146.31, delta angle=33.69, radius=0.47];
\draw[black] (1.19,1.79) arc[start angle=-123.69, delta angle=33.69, radius=0.45];
\draw[black] (1.15,1.73) arc[start angle=-123.69, delta angle=33.69, radius=0.52];
\draw[black] (1.44,1.71) arc[start angle=-90.00, delta angle=56.31, radius=0.45];
\node[below left] at (0.00,0.00) {$A$};
\node[below right] at (4.68,0.00) {$B$};
\node[above] at (1.44,2.16) {$C$};
\node[below] at (1.44,0.00) {$H$};
\end{tikzpicture}
```

L'altezza divide il triangolo in due triangoli rettangoli, $AHC$ e $CHB$, e tutti e tre sono simili tra loro:

- $AHC$ e $ACB$ hanno un angolo retto (in $H$ e in $C$) e l'angolo $\hat{A}$ in comune, quindi per il primo criterio sono simili: $\triangle AHC \sim \triangle ACB$;
- $CHB$ e $ACB$ hanno un angolo retto e l'angolo $\hat{B}$ in comune: $\triangle CHB \sim \triangle ACB$;
- quindi anche $AHC$ e $CHB$ sono simili tra loro, con $\widehat{ACH} \cong \hat{B}$ e $\widehat{HCB} \cong \hat{A}$.

Primo teorema di Euclide: in un triangolo rettangolo ogni cateto è medio proporzionale tra l'ipotenusa e la sua proiezione sull'ipotenusa. Nella similitudine $\triangle AHC \sim \triangle ACB$ sono omologhi $AH$ e $AC$, $AC$ e $AB$:

$$
\begin{gathered}
AB : AC = AC : AH \\
\overline{AC}^{\,2} = \overline{AB} \cdot \overline{AH}
\end{gathered}
$$

e allo stesso modo, da $\triangle CHB \sim \triangle ACB$, $\overline{BC}^{\,2} = \overline{AB} \cdot \overline{HB}$.

Secondo teorema di Euclide: l'altezza relativa all'ipotenusa è media proporzionale tra le proiezioni dei due cateti. Nella similitudine $\triangle AHC \sim \triangle CHB$ sono omologhi $AH$ e $CH$, $CH$ e $HB$:

$$
\begin{gathered}
AH : CH = CH : HB \\
\overline{CH}^{\,2} = \overline{AH} \cdot \overline{HB}
\end{gathered}
$$

Sommando le due uguaglianze del primo teorema si ritrova il teorema di Pitagora: $\overline{AC}^{\,2} + \overline{BC}^{\,2} = \overline{AB} \cdot (\overline{AH} + \overline{HB}) = \overline{AB}^{\,2}$.

```ad-example
Esempio 8: dalle proiezioni ai lati
Nel triangolo $ABC$ rettangolo in $C$ l'altezza $CH$ divide l'ipotenusa in $\overline{AH} = 4$ cm e $\overline{HB} = 9$ cm. Trova l'altezza e i cateti.

```tikz
% nome: euclide-esempio-proiezioni
% alt: Triangolo ABC rettangolo in C con l'altezza CH: le proiezioni dei cateti sull'ipotenusa misurano AH 4 e HB 9
% svg: euclide-esempio-proiezioni-bb0f3ef6.svg 219x121
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (4.68,0.00) -- (1.44,2.16) -- cycle;
\draw[thick] (0.00,0.00) -- (4.68,0.00) -- (1.44,2.16) -- cycle;
\draw[thick, blue!70!black] (1.44,2.16) -- (1.44,0.00);
\draw (1.34,2.01) -- (1.49,1.91) -- (1.59,2.06);
\draw (1.59,0.00) -- (1.59,0.15) -- (1.44,0.15);
\node[below] at (0.72,0.00) {\small $4$};
\node[below] at (3.06,0.00) {\small $9$};
\node[below left] at (0.00,0.00) {$A$};
\node[below right] at (4.68,0.00) {$B$};
\node[above] at (1.44,2.16) {$C$};
\node[below] at (1.44,0.00) {$H$};
\end{tikzpicture}
```

L'ipotenusa è $\overline{AB} = 4 + 9 = 13$ cm. Per il secondo teorema $\overline{CH}^{\,2} = 4 \cdot 9 = 36$, quindi $\overline{CH} = 6$ cm. Per il primo teorema

$$
\begin{gathered}
\overline{AC}^{\,2} = 13 \cdot 4 = 52 \\
\overline{AC} = \sqrt{52} = 2\sqrt{13} \approx 7{,}21 \\
\overline{BC}^{\,2} = 13 \cdot 9 = 117 \\
\overline{BC} = \sqrt{117} = 3\sqrt{13} \approx 10{,}82
\end{gathered}
$$

I radicali si semplificano come nella lezione sulle [operazioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali). Controllo con Pitagora: $52 + 117 = 169 = 13^2$.
```

## Misurare con la similitudine

Due triangoli rettangoli con un angolo acuto congruente sono simili per il primo criterio. Su questo si basano molte misure indirette: basta un triangolo piccolo, di cui si misura tutto, e uno grande con un angolo uguale.

```ad-example
Esempio 9: l'altezza di un albero dall'ombra
Un bastone verticale alto $1{,}5$ m fa un'ombra lunga $2$ m. Nello stesso momento l'ombra di un albero è lunga $10$ m. Quanto è alto l'albero?

```tikz
% nome: similitudine-altezza-con-ombra
% alt: Un albero di altezza incognita con un'ombra di 10 metri e un bastone alto 1,5 metri con un'ombra di 2 metri; i raggi del sole tratteggiati sono paralleli e formano due triangoli rettangoli simili
% svg: similitudine-altezza-con-ombra-eb3fdc05.svg 235x115
\begin{tikzpicture}
\fill[orange!15] (0.00,0.00) -- (0.00,2.48) -- (3.30,0.00) -- cycle;
\fill[orange!15] (4.60,0.00) -- (4.60,0.49) -- (5.26,0.00) -- cycle;
\draw[thin] (-0.30,0.00) -- (5.70,0.00);
\draw[line width=2pt, green!40!black] (0.00,0.00) -- (0.00,2.48);
\draw[line width=1.5pt, brown!70!black] (4.60,0.00) -- (4.60,0.49);
\draw[densely dashed] (0.00,2.48) -- (3.30,0.00);
\draw[densely dashed] (4.60,0.49) -- (5.26,0.00);
\draw (0.15,0.00) -- (0.15,0.15) -- (0.00,0.15);
\draw (4.72,0.00) -- (4.72,0.12) -- (4.60,0.12);
\node[left] at (0.00,1.24) {\small $x$};
\node[below] at (1.65,0.00) {\small $10$};
\node[left] at (4.60,0.25) {\small $1{,}5$};
\node[below] at (4.93,0.00) {\small $2$};
\end{tikzpicture}
```

I raggi del sole sono paralleli, quindi formano lo stesso angolo con il terreno: il triangolo formato dall'albero, dalla sua ombra e dal raggio e quello formato dal bastone hanno un angolo retto e un angolo acuto congruenti. Per il primo criterio sono simili, e l'altezza sta all'ombra nello stesso rapporto:

$$
\begin{gathered}
x : 10 = 1{,}5 : 2 \\
x = \frac{10 \cdot 1{,}5}{2} = 7{,}5
\end{gathered}
$$

L'albero è alto $7{,}5$ m.
```

```ad-example
Esempio 10: una mappa in scala
Su una mappa in scala $1 : 25\,000$ un parco è un rettangolo di $4$ cm per $6$ cm. Quali sono le misure vere del parco, e la sua area?

La scala dice che il parco vero è simile al disegno con $k = 25\,000$. I lati veri misurano $4 \cdot 25\,000 = 100\,000$ cm $= 1$ km e $6 \cdot 25\,000 = 150\,000$ cm $= 1{,}5$ km, quindi l'area è $1 \cdot 1{,}5 = 1{,}5\ \text{km}^2$.

Con le aree: il disegno ha area $4 \cdot 6 = 24\ \text{cm}^2$, e l'area vera è $k^2$ volte tanto, $24 \cdot 25\,000^2 = 1{,}5 \cdot 10^{10}\ \text{cm}^2$, cioè ancora $1{,}5\ \text{km}^2$ (in $1\ \text{km}^2$ ci sono $10^{10}\ \text{cm}^2$). Moltiplicare l'area del disegno per $25\,000$ darebbe un parco $25\,000$ volte più piccolo del vero.
```
