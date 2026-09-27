# Disequazioni fratte e sistemi di secondo grado

La disequazione $\dfrac{x^2 - 2x - 3}{x - 2} \geq 0$ ha un trinomio di secondo grado al numeratore. Si risolve con lo studio del segno, come le [disequazioni fratte](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/studio-del-segno-e-disequazioni-fratte) che hai già visto: porti tutto a primo membro, studi il segno di ogni fattore e lo metti nella tabella dei segni. La novità è che un fattore può essere di secondo grado, e il suo segno si legge con il metodo delle [disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado).

Le disequazioni di secondo grado possono anche stare in un sistema, che si risolve con il grafico dei [sistemi di disequazioni](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/sistemi-di-disequazioni), e nascono dai problemi in cui una grandezza deve superare un valore, come l'area di un rettangolo che deve essere maggiore di $21\ \text{cm}^2$.

## Il segno di un fattore di secondo grado

Il segno del trinomio $ax^2 + bx + c$ dipende dal segno di $a$ e dal discriminante $\Delta = b^2 - 4ac$, come nella lezione [Disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado): il trinomio è positivo dove la [parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola) $y = ax^2 + bx + c$ sta sopra l'asse $x$, negativo dove sta sotto, e vale zero nelle soluzioni $x_1$ e $x_2$ dell'equazione $ax^2 + bx + c = 0$.

Nella tabella dei segni un fattore di secondo grado occupa una riga sola, con i suoi zeri. Per $x^2 - 2x - 3$ si ha $a = 1$ e $\Delta = 16$, le soluzioni sono $-1$ e $3$, e la parabola sta sopra l'asse fuori dalle soluzioni e sotto in mezzo:

```tikz
% nome: segno-trinomio-parabola-riga
% alt: Parabola di y uguale a x quadro meno 2x meno 3, che taglia l'asse x in meno 1 e in 3: è sopra l'asse prima di meno 1 e dopo 3, sotto l'asse in mezzo; sotto il grafico la riga dei segni del trinomio, continua dove è positivo e tratteggiata dove è negativo
% svg: segno-trinomio-parabola-riga-fbf0482e.svg 185x132
\begin{tikzpicture}
\draw[gray!25] (0.25,-0.95) -- (0.25,1.17);
\draw[gray!25] (0.87,-0.95) -- (0.87,1.17);
\draw[gray!25] (1.49,-0.95) -- (1.49,1.17);
\draw[gray!25] (2.11,-0.95) -- (2.11,1.17);
\draw[gray!25] (2.73,-0.95) -- (2.73,1.17);
\draw[gray!25] (3.35,-0.95) -- (3.35,1.17);
\draw[gray!25] (3.97,-0.95) -- (3.97,1.17);
\draw[gray!25] (0.00,-0.88) -- (4.22,-0.88);
\draw[gray!25] (0.00,-0.66) -- (4.22,-0.66);
\draw[gray!25] (0.00,-0.44) -- (4.22,-0.44);
\draw[gray!25] (0.00,-0.22) -- (4.22,-0.22);
\draw[gray!25] (0.00,0.00) -- (4.22,0.00);
\draw[gray!25] (0.00,0.22) -- (4.22,0.22);
\draw[gray!25] (0.00,0.44) -- (4.22,0.44);
\draw[gray!25] (0.00,0.66) -- (4.22,0.66);
\draw[gray!25] (0.00,0.88) -- (4.22,0.88);
\draw[gray!25] (0.00,1.10) -- (4.22,1.10);
\draw[->] (0.00,0) -- (4.34,0) node[right] {$x$};
\draw[->] (1.49,-0.99) -- (1.49,1.23) node[above] {$y$};
\draw[blue!55, line width=1.6pt] (0.25,1.10) -- (0.31,0.97) -- (0.37,0.84) -- (0.43,0.72) -- (0.50,0.61) -- (0.56,0.49) -- (0.62,0.39) -- (0.68,0.28) -- (0.74,0.18) -- (0.81,0.09) -- (0.87,0.00);
\draw[blue!55, line width=1.6pt] (3.35,0.00) -- (3.41,0.09) -- (3.47,0.18) -- (3.53,0.28) -- (3.60,0.39) -- (3.66,0.49) -- (3.72,0.61) -- (3.78,0.72) -- (3.84,0.84) -- (3.91,0.97) -- (3.97,1.10);
\draw[orange!60, line width=1.6pt, dashed] (0.87,0.00) -- (0.95,-0.11) -- (1.02,-0.21) -- (1.10,-0.30) -- (1.18,-0.39) -- (1.26,-0.46) -- (1.33,-0.54) -- (1.41,-0.60) -- (1.49,-0.66) -- (1.57,-0.71) -- (1.64,-0.76) -- (1.72,-0.79) -- (1.80,-0.82) -- (1.88,-0.85) -- (1.95,-0.87) -- (2.03,-0.88) -- (2.11,-0.88) -- (2.19,-0.88) -- (2.26,-0.87) -- (2.34,-0.85) -- (2.42,-0.82) -- (2.50,-0.79) -- (2.57,-0.76) -- (2.65,-0.71) -- (2.73,-0.66) -- (2.81,-0.60) -- (2.88,-0.54) -- (2.96,-0.46) -- (3.04,-0.39) -- (3.12,-0.30) -- (3.19,-0.21) -- (3.27,-0.11) -- (3.35,0.00);
\fill (0.87,0) circle (1.8pt);
\fill (3.35,0) circle (1.8pt);
\node[below left] at (0.87,0) {\small $-1$};
\node[below right] at (3.35,0) {\small $3$};
\draw[thick] (0.00,-1.50) -- (0.70,-1.50);
\draw[thick, dashed] (1.04,-1.50) -- (3.18,-1.50);
\draw[thick] (3.52,-1.50) -- (4.22,-1.50);
\node at (0.87,-1.50) {\small $0$};
\node at (3.35,-1.50) {\small $0$};
\node[above] at (0.43,-1.55) {\small $+$};
\node[above] at (2.11,-1.55) {\small $-$};
\node[above] at (3.78,-1.55) {\small $+$};
\end{tikzpicture}
```

Con $a > 0$ i casi sono tre:

| $\Delta$ | segno di $ax^2 + bx + c$ con $a > 0$ |
|---|---|
| $\Delta > 0$ | $+$ per $x < x_1$ o $x > x_2$, $-$ tra $x_1$ e $x_2$ |
| $\Delta = 0$ | $+$ per ogni $x \neq x_1$, $0$ in $x_1$ |
| $\Delta < 0$ | $+$ per ogni $x$ |

Con $a < 0$ i segni si scambiano: con $\Delta > 0$ il trinomio è positivo tra le soluzioni e negativo fuori, con $\Delta < 0$ è negativo per ogni $x$. Un fattore con $\Delta < 0$ non si annulla mai, e nella tabella non aggiunge nessun valore in alto.

```ad-tip
Scomporre il trinomio
Con $\Delta > 0$ puoi anche scomporre il trinomio in due fattori di primo grado, $ax^2 + bx + c = a(x - x_1)(x - x_2)$, come nella lezione [Relazioni tra soluzioni e coefficienti](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/relazioni-tra-soluzioni-e-coefficienti), e studiare le due righe come nelle disequazioni di primo grado. Il risultato è lo stesso; la riga unica è più corta, e serve comunque quando $\Delta \leq 0$.
```

## Disequazioni prodotto

Una disequazione prodotto ha a primo membro un prodotto di fattori di primo e di secondo grado e a secondo membro zero. Il procedimento è quello della lezione [Studio del segno e disequazioni fratte](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/studio-del-segno-e-disequazioni-fratte):

1. Porta tutti i termini a primo membro e scomponi in fattori.
2. Per ogni fattore di primo grado trova lo zero e dove è positivo.
3. Per ogni fattore di secondo grado calcola $\Delta$, trova gli zeri, se ci sono, e il segno con la tabella qui sopra.
4. Metti in alto tutti gli zeri in ordine crescente, disegna una riga per fattore e ricava il segno del prodotto colonna per colonna.
5. Scegli gli intervalli con il segno richiesto; con $\geq$ e $\leq$ aggiungi gli zeri del prodotto.

```ad-example
Esempio 1: un fattore di primo grado e un trinomio
$$(x + 1)(x^2 - 5x + 6) > 0$$

Il fattore $x + 1$ si annulla per $x = -1$ ed è positivo per $x > -1$.

Il trinomio $x^2 - 5x + 6$ ha $a = 1$ e $\Delta = 25 - 24 = 1$: le soluzioni sono $x_1 = 2$ e $x_2 = 3$, e il trinomio è positivo fuori da $2$ e $3$, negativo in mezzo.

```tikz
% nome: disequazione-prodotto-trinomio
% alt: Tabella dei segni di x più 1 per x quadro meno 5x più 6: il trinomio ha una riga sola, positiva prima di 2 e dopo 3 e negativa in mezzo; sotto, le soluzioni del prodotto maggiore di zero, tra meno 1 e 2 e dopo 3, estremi esclusi
% svg: disequazione-prodotto-trinomio-7a5bb98f.svg 271x115
\begin{tikzpicture}
\node at (1.12,0) {$-1$};
\node at (2.25,0) {$2$};
\node at (3.38,0) {$3$};
\node at (4.75,0) {$x$};
\draw[gray!60, densely dotted] (1.12,-0.20) -- (1.12,-0.45);
\draw[gray!60, densely dotted] (1.12,-0.82) -- (1.12,-1.07);
\draw[gray!60, densely dotted] (1.12,-1.44) -- (1.12,-1.69);
\draw[gray!60, densely dotted] (1.12,-2.06) -- (1.12,-2.31);
\draw[gray!60, densely dotted] (2.25,-0.20) -- (2.25,-0.45);
\draw[gray!60, densely dotted] (2.25,-0.82) -- (2.25,-1.07);
\draw[gray!60, densely dotted] (2.25,-1.44) -- (2.25,-1.69);
\draw[gray!60, densely dotted] (2.25,-2.06) -- (2.25,-2.31);
\draw[gray!60, densely dotted] (3.38,-0.20) -- (3.38,-0.45);
\draw[gray!60, densely dotted] (3.38,-0.82) -- (3.38,-1.07);
\draw[gray!60, densely dotted] (3.38,-1.44) -- (3.38,-1.69);
\draw[gray!60, densely dotted] (3.38,-2.06) -- (3.38,-2.31);
\node[left] at (-0.1,-0.62) {$x+1$};
\draw[thick, dashed] (0.00,-0.62) -- (0.95,-0.62);
\node[above] at (0.56,-0.67) {\small $-$};
\draw[thick] (1.29,-0.62) -- (2.25,-0.62);
\node[above] at (1.69,-0.67) {\small $+$};
\draw[thick] (2.25,-0.62) -- (3.38,-0.62);
\node[above] at (2.81,-0.67) {\small $+$};
\draw[thick] (3.38,-0.62) -- (4.50,-0.62);
\node[above] at (3.94,-0.67) {\small $+$};
\node at (1.12,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x^2-5x+6$};
\draw[thick] (0.00,-1.24) -- (1.12,-1.24);
\node[above] at (0.56,-1.29) {\small $+$};
\draw[thick] (1.12,-1.24) -- (2.08,-1.24);
\node[above] at (1.69,-1.29) {\small $+$};
\draw[thick, dashed] (2.42,-1.24) -- (3.21,-1.24);
\node[above] at (2.81,-1.29) {\small $-$};
\draw[thick] (3.54,-1.24) -- (4.50,-1.24);
\node[above] at (3.94,-1.29) {\small $+$};
\node at (2.25,-1.24) {\small $0$};
\node at (3.38,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.50,-1.55);
\node[left] at (-0.1,-1.86) {\small prodotto};
\node at (0.56,-1.86) {$-$};
\node at (1.69,-1.86) {$+$};
\node at (2.81,-1.86) {$-$};
\node at (3.94,-1.86) {$+$};
\node at (1.12,-1.86) {\small $0$};
\node at (2.25,-1.86) {\small $0$};
\node at (3.38,-1.86) {\small $0$};
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (1.23,-2.48) -- (2.15,-2.48);
\draw[blue!45, line width=2pt] (3.48,-2.48) -- (4.50,-2.48);
\draw[thick] (1.12,-2.48) circle (2.5pt);
\draw[thick] (2.25,-2.48) circle (2.5pt);
\draw[thick] (3.38,-2.48) circle (2.5pt);
\end{tikzpicture}
```

Il prodotto è positivo tra $-1$ e $2$ e dopo $3$. Il verso è $>$, quindi gli zeri sono esclusi:

$$-1 < x < 2 \ \text{ oppure } \ x > 3$$

$$S = \,\mathopen{]}-1, 2\mathclose{[}\, \cup \,\mathopen{]}3, +\infty\mathclose{[}$$
```

```ad-example
Esempio 2: un trinomio con il discriminante negativo
$$(x^2 + x + 1)(x - 2) \leq 0$$

Il trinomio $x^2 + x + 1$ ha $a = 1$ e $\Delta = 1 - 4 = -3$: è positivo per ogni $x$, e la sua riga è una linea continua senza zeri. Il fattore $x - 2$ si annulla per $x = 2$ ed è positivo per $x > 2$.

```tikz
% nome: disequazione-prodotto-delta-negativo
% alt: Tabella dei segni di x quadro più x più 1 per x meno 2: la riga del trinomio è continua su tutta la retta, perché è sempre positivo; il prodotto ha il segno di x meno 2, e le soluzioni del prodotto minore o uguale a zero sono tutti i numeri fino a 2 compreso
% svg: disequazione-prodotto-delta-negativo-29433350.svg 265x114
\begin{tikzpicture}
\node at (2.25,0) {$2$};
\node at (4.75,0) {$x$};
\draw[gray!60, densely dotted] (2.25,-0.20) -- (2.25,-0.45);
\draw[gray!60, densely dotted] (2.25,-0.82) -- (2.25,-1.07);
\draw[gray!60, densely dotted] (2.25,-1.44) -- (2.25,-1.69);
\draw[gray!60, densely dotted] (2.25,-2.06) -- (2.25,-2.31);
\node[left] at (-0.1,-0.62) {$x^2+x+1$};
\draw[thick] (0.00,-0.62) -- (2.25,-0.62);
\node[above] at (1.12,-0.67) {\small $+$};
\draw[thick] (2.25,-0.62) -- (4.50,-0.62);
\node[above] at (3.38,-0.67) {\small $+$};
\node[left] at (-0.1,-1.24) {$x-2$};
\draw[thick, dashed] (0.00,-1.24) -- (2.08,-1.24);
\node[above] at (1.12,-1.29) {\small $-$};
\draw[thick] (2.42,-1.24) -- (4.50,-1.24);
\node[above] at (3.38,-1.29) {\small $+$};
\node at (2.25,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.50,-1.55);
\node[left] at (-0.1,-1.86) {\small prodotto};
\node at (1.12,-1.86) {$-$};
\node at (3.38,-1.86) {$+$};
\node at (2.25,-1.86) {\small $0$};
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (0.00,-2.48) -- (2.25,-2.48);
\fill (2.25,-2.48) circle (2.5pt);
\end{tikzpicture}
```

Il prodotto ha lo stesso segno di $x - 2$: è negativo prima di $2$ e vale zero in $2$. Il verso è $\leq$, quindi $x \leq 2$:

$$S = \,\mathopen{]}-\infty, 2]$$
```

```ad-tip
Un fattore sempre positivo
Un fattore che è positivo per ogni $x$ non cambia il segno del prodotto. Nell'esempio 2 puoi dividere tutti e due i membri per $x^2 + x + 1$, che è positivo, senza cambiare il verso, e resta $x - 2 \leq 0$.
```

```ad-warning
Il trinomio senza soluzioni rende impossibile la disequazione
L'equazione $x^2 + x + 1 = 0$ non ha soluzioni, e c'è chi conclude che anche $(x^2 + x + 1)(x - 2) \leq 0$ non ne ha. Un fattore con $\Delta < 0$ non è mai zero, ma ha un segno, sempre lo stesso: per $x = 0$ il prodotto vale $1 \cdot (-2) = -2$, e $-2 \leq 0$ è vero.
```

```ad-example
Esempio 3: un trinomio con il discriminante nullo
$$(x - 3)(x^2 - 2x + 1) \geq 0$$

Il fattore $x - 3$ è positivo per $x > 3$. Il trinomio ha $\Delta = 4 - 4 = 0$ ed è il quadrato $(x - 1)^2$: vale zero in $1$ ed è positivo per ogni altro $x$.

```tikz
% nome: disequazione-prodotto-delta-nullo
% alt: Tabella dei segni di x meno 3 per x quadro meno 2x più 1: il trinomio è positivo prima e dopo 1 e vale zero in 1; il prodotto vale zero in 1 e in 3 ed è positivo solo dopo 3; le soluzioni del prodotto maggiore o uguale a zero sono il punto 1, isolato, e la semiretta da 3
% svg: disequazione-prodotto-delta-nullo-df89eedd.svg 271x114
\begin{tikzpicture}
\node at (1.50,0) {$1$};
\node at (3.00,0) {$3$};
\node at (4.75,0) {$x$};
\draw[gray!60, densely dotted] (1.50,-0.20) -- (1.50,-0.45);
\draw[gray!60, densely dotted] (1.50,-0.82) -- (1.50,-1.07);
\draw[gray!60, densely dotted] (1.50,-1.44) -- (1.50,-1.69);
\draw[gray!60, densely dotted] (1.50,-2.06) -- (1.50,-2.31);
\draw[gray!60, densely dotted] (3.00,-0.20) -- (3.00,-0.45);
\draw[gray!60, densely dotted] (3.00,-0.82) -- (3.00,-1.07);
\draw[gray!60, densely dotted] (3.00,-1.44) -- (3.00,-1.69);
\draw[gray!60, densely dotted] (3.00,-2.06) -- (3.00,-2.31);
\node[left] at (-0.1,-0.62) {$x-3$};
\draw[thick, dashed] (0.00,-0.62) -- (1.50,-0.62);
\node[above] at (0.75,-0.67) {\small $-$};
\draw[thick, dashed] (1.50,-0.62) -- (2.83,-0.62);
\node[above] at (2.25,-0.67) {\small $-$};
\draw[thick] (3.17,-0.62) -- (4.50,-0.62);
\node[above] at (3.75,-0.67) {\small $+$};
\node at (3.00,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x^2-2x+1$};
\draw[thick] (0.00,-1.24) -- (1.33,-1.24);
\node[above] at (0.75,-1.29) {\small $+$};
\draw[thick] (1.67,-1.24) -- (3.00,-1.24);
\node[above] at (2.25,-1.29) {\small $+$};
\draw[thick] (3.00,-1.24) -- (4.50,-1.24);
\node[above] at (3.75,-1.29) {\small $+$};
\node at (1.50,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.50,-1.55);
\node[left] at (-0.1,-1.86) {\small prodotto};
\node at (0.75,-1.86) {$-$};
\node at (2.25,-1.86) {$-$};
\node at (3.75,-1.86) {$+$};
\node at (1.50,-1.86) {\small $0$};
\node at (3.00,-1.86) {\small $0$};
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (3.00,-2.48) -- (4.50,-2.48);
\fill (1.50,-2.48) circle (2.5pt);
\fill (3.00,-2.48) circle (2.5pt);
\end{tikzpicture}
```

Il prodotto è positivo solo dopo $3$ e vale zero in $1$ e in $3$. Il verso è $\geq$, quindi entrano tutti e due gli zeri, anche $1$, che sta in mezzo a una zona negativa:

$$x = 1 \ \text{ oppure } \ x \geq 3$$

$$S = \{1\} \cup [3, +\infty\mathclose{[}$$

Con il verso $>$ il punto $1$ non sarebbe più una soluzione, perché lì il prodotto vale zero, e resterebbe $S = \,\mathopen{]}3, +\infty\mathclose{[}$.
```

```ad-warning
Perdere il punto isolato
Nell'esempio 3 chi guarda solo le colonne con il $+$ scrive $S = [3, +\infty\mathclose{[}$ e perde $x = 1$. Con $\geq$ e $\leq$ ogni zero del prodotto è una soluzione, anche quando intorno il prodotto ha il segno sbagliato: per $x = 1$ si ha $(1 - 3) \cdot 0 = 0$, e $0 \geq 0$ è vero.
```

## Disequazioni fratte

Nelle disequazioni fratte il numeratore e il denominatore possono contenere fattori di secondo grado. Il procedimento è quello del primo grado, con le condizioni di esistenza (C.E.):

1. Porta tutti i termini a primo membro e riduci a una frazione sola $\dfrac{N}{D}$.
2. Scrivi le C.E.: il denominatore diverso da zero.
3. Studia il segno di ogni fattore di $N$ e di $D$, di primo o di secondo grado, e disegna la tabella dei segni.
4. Scegli gli intervalli con il segno richiesto. Con $\geq$ e $\leq$ aggiungi gli zeri di $N$, mai quelli di $D$.

```ad-example
Esempio 4: il trinomio al numeratore
$$\frac{x^2 - 2x - 3}{x - 2} \geq 0$$

C.E.: $x \neq 2$. Il numeratore ha $a = 1$ e $\Delta = 4 + 12 = 16$, con le soluzioni

$$x = \frac{2 \pm 4}{2} \ \Rightarrow \ x_1 = -1, \ x_2 = 3$$

ed è positivo fuori da $-1$ e $3$ (è il trinomio della figura della parabola). Il denominatore è positivo per $x > 2$.

```tikz
% nome: disequazione-fratta-numeratore-trinomio
% alt: Tabella dei segni di x quadro meno 2x meno 3 fratto x meno 2, con un pallino vuoto in 2 dove il denominatore si annulla; sotto, le soluzioni della frazione maggiore o uguale a zero: da meno 1 compreso a 2 escluso, e da 3 compreso in poi
% svg: disequazione-fratta-numeratore-trinomio-b48cdd8e.svg 271x115
\begin{tikzpicture}
\node at (1.12,0) {$-1$};
\node at (2.25,0) {$2$};
\node at (3.38,0) {$3$};
\node at (4.75,0) {$x$};
\draw[gray!60, densely dotted] (1.12,-0.20) -- (1.12,-0.45);
\draw[gray!60, densely dotted] (1.12,-0.82) -- (1.12,-1.07);
\draw[gray!60, densely dotted] (1.12,-1.44) -- (1.12,-1.69);
\draw[gray!60, densely dotted] (1.12,-2.06) -- (1.12,-2.31);
\draw[gray!60, densely dotted] (2.25,-0.20) -- (2.25,-0.45);
\draw[gray!60, densely dotted] (2.25,-0.82) -- (2.25,-1.07);
\draw[gray!60, densely dotted] (2.25,-1.44) -- (2.25,-1.69);
\draw[gray!60, densely dotted] (2.25,-2.06) -- (2.25,-2.31);
\draw[gray!60, densely dotted] (3.38,-0.20) -- (3.38,-0.45);
\draw[gray!60, densely dotted] (3.38,-0.82) -- (3.38,-1.07);
\draw[gray!60, densely dotted] (3.38,-1.44) -- (3.38,-1.69);
\draw[gray!60, densely dotted] (3.38,-2.06) -- (3.38,-2.31);
\node[left] at (-0.1,-0.62) {$x^2-2x-3$};
\draw[thick] (0.00,-0.62) -- (0.95,-0.62);
\node[above] at (0.56,-0.67) {\small $+$};
\draw[thick, dashed] (1.29,-0.62) -- (2.25,-0.62);
\node[above] at (1.69,-0.67) {\small $-$};
\draw[thick, dashed] (2.25,-0.62) -- (3.21,-0.62);
\node[above] at (2.81,-0.67) {\small $-$};
\draw[thick] (3.54,-0.62) -- (4.50,-0.62);
\node[above] at (3.94,-0.67) {\small $+$};
\node at (1.12,-0.62) {\small $0$};
\node at (3.38,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x-2$};
\draw[thick, dashed] (0.00,-1.24) -- (1.12,-1.24);
\node[above] at (0.56,-1.29) {\small $-$};
\draw[thick, dashed] (1.12,-1.24) -- (2.08,-1.24);
\node[above] at (1.69,-1.29) {\small $-$};
\draw[thick] (2.42,-1.24) -- (3.38,-1.24);
\node[above] at (2.81,-1.29) {\small $+$};
\draw[thick] (3.38,-1.24) -- (4.50,-1.24);
\node[above] at (3.94,-1.29) {\small $+$};
\node at (2.25,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.50,-1.55);
\node[left] at (-0.1,-1.86) {\small frazione};
\node at (0.56,-1.86) {$-$};
\node at (1.69,-1.86) {$+$};
\node at (2.81,-1.86) {$-$};
\node at (3.94,-1.86) {$+$};
\node at (1.12,-1.86) {\small $0$};
\draw[thick] (2.25,-1.86) circle (2.5pt);
\node at (3.38,-1.86) {\small $0$};
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (1.12,-2.48) -- (2.15,-2.48);
\draw[blue!45, line width=2pt] (3.38,-2.48) -- (4.50,-2.48);
\fill (1.12,-2.48) circle (2.5pt);
\draw[thick] (2.25,-2.48) circle (2.5pt);
\fill (3.38,-2.48) circle (2.5pt);
\end{tikzpicture}
```

La frazione è positiva tra $-1$ e $2$ e dopo $3$. Si aggiungono gli zeri del numeratore, $-1$ e $3$, mentre $2$ resta escluso:

$$-1 \leq x < 2 \ \text{ oppure } \ x \geq 3$$

$$S = [-1, 2\mathclose{[}\, \cup [3, +\infty\mathclose{[}$$
```

```ad-example
Esempio 5: il coefficiente di $x^2$ negativo
$$\frac{4}{x} > x$$

C.E.: $x \neq 0$. Porta $x$ a primo membro e riduci al denominatore $x$:

$$
\begin{gathered}
\frac{4}{x} - x > 0 \\
\Rightarrow \frac{4 - x^2}{x} > 0
\end{gathered}
$$

Il numeratore $4 - x^2$ ha $a = -1$: si annulla in $-2$ e in $2$ e, con $a < 0$, è positivo tra le soluzioni e negativo fuori. Il denominatore $x$ è positivo per $x > 0$.

```tikz
% nome: disequazione-fratta-coefficiente-negativo
% alt: Tabella dei segni di 4 meno x quadro fratto x: il numeratore è positivo tra meno 2 e 2 e negativo fuori, il denominatore è positivo dopo 0; sotto, le soluzioni della frazione maggiore di zero: prima di meno 2 e tra 0 e 2, estremi esclusi
% svg: disequazione-fratta-coefficiente-negativo-d1edc0a9.svg 246x115
\begin{tikzpicture}
\node at (1.12,0) {$-2$};
\node at (2.25,0) {$0$};
\node at (3.38,0) {$2$};
\node at (4.75,0) {$x$};
\draw[gray!60, densely dotted] (1.12,-0.20) -- (1.12,-0.45);
\draw[gray!60, densely dotted] (1.12,-0.82) -- (1.12,-1.07);
\draw[gray!60, densely dotted] (1.12,-1.44) -- (1.12,-1.69);
\draw[gray!60, densely dotted] (1.12,-2.06) -- (1.12,-2.31);
\draw[gray!60, densely dotted] (2.25,-0.20) -- (2.25,-0.45);
\draw[gray!60, densely dotted] (2.25,-0.82) -- (2.25,-1.07);
\draw[gray!60, densely dotted] (2.25,-1.44) -- (2.25,-1.69);
\draw[gray!60, densely dotted] (2.25,-2.06) -- (2.25,-2.31);
\draw[gray!60, densely dotted] (3.38,-0.20) -- (3.38,-0.45);
\draw[gray!60, densely dotted] (3.38,-0.82) -- (3.38,-1.07);
\draw[gray!60, densely dotted] (3.38,-1.44) -- (3.38,-1.69);
\draw[gray!60, densely dotted] (3.38,-2.06) -- (3.38,-2.31);
\node[left] at (-0.1,-0.62) {$4-x^2$};
\draw[thick, dashed] (0.00,-0.62) -- (0.95,-0.62);
\node[above] at (0.56,-0.67) {\small $-$};
\draw[thick] (1.29,-0.62) -- (2.25,-0.62);
\node[above] at (1.69,-0.67) {\small $+$};
\draw[thick] (2.25,-0.62) -- (3.21,-0.62);
\node[above] at (2.81,-0.67) {\small $+$};
\draw[thick, dashed] (3.54,-0.62) -- (4.50,-0.62);
\node[above] at (3.94,-0.67) {\small $-$};
\node at (1.12,-0.62) {\small $0$};
\node at (3.38,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x$};
\draw[thick, dashed] (0.00,-1.24) -- (1.12,-1.24);
\node[above] at (0.56,-1.29) {\small $-$};
\draw[thick, dashed] (1.12,-1.24) -- (2.08,-1.24);
\node[above] at (1.69,-1.29) {\small $-$};
\draw[thick] (2.42,-1.24) -- (3.38,-1.24);
\node[above] at (2.81,-1.29) {\small $+$};
\draw[thick] (3.38,-1.24) -- (4.50,-1.24);
\node[above] at (3.94,-1.29) {\small $+$};
\node at (2.25,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.50,-1.55);
\node[left] at (-0.1,-1.86) {\small frazione};
\node at (0.56,-1.86) {$+$};
\node at (1.69,-1.86) {$-$};
\node at (2.81,-1.86) {$+$};
\node at (3.94,-1.86) {$-$};
\node at (1.12,-1.86) {\small $0$};
\draw[thick] (2.25,-1.86) circle (2.5pt);
\node at (3.38,-1.86) {\small $0$};
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (0.00,-2.48) -- (1.02,-2.48);
\draw[blue!45, line width=2pt] (2.35,-2.48) -- (3.27,-2.48);
\draw[thick] (1.12,-2.48) circle (2.5pt);
\draw[thick] (2.25,-2.48) circle (2.5pt);
\draw[thick] (3.38,-2.48) circle (2.5pt);
\end{tikzpicture}
```

La frazione è positiva prima di $-2$ e tra $0$ e $2$. Il verso è $>$, quindi gli estremi sono esclusi:

$$x < -2 \ \text{ oppure } \ 0 < x < 2$$

$$S = \,\mathopen{]}-\infty, -2\mathclose{[}\, \cup \,\mathopen{]}0, 2\mathclose{[}$$

Verifica con $x = 1$: $\dfrac{4}{1} = 4 > 1$, vero; con $x = -1$, che non è una soluzione: $-4 > -1$ è falso.
```

```ad-warning
Moltiplicare per $x$
Da $\dfrac{4}{x} > x$ viene da moltiplicare per $x$ e scrivere $4 > x^2$, che dà $-2 < x < 2$. Ma $x$ è negativo per metà di quei valori, e lì il verso andrebbe cambiato: per $x = -1$ si ha $-4 > -1$, falso. Il denominatore non si elimina, si studia il suo segno.
```

```ad-warning
Il segno con $a$ negativo
Il numeratore $4 - x^2$ ha il coefficiente di $x^2$ negativo, e chi usa la regola di $a > 0$ lo fa positivo fuori da $-2$ e $2$. Per evitarlo, controlla con un numero ($x = 0$ dà $4$, positivo, e $0$ sta tra le soluzioni) oppure raccogli il segno meno, come qui sotto.
```

Con $a < 0$ puoi anche raccogliere il segno meno: $\dfrac{4 - x^2}{x} > 0$ diventa $\dfrac{-(x^2 - 4)}{x} > 0$, e moltiplicando per $-1$, con il cambio di verso, $\dfrac{x^2 - 4}{x} < 0$. Il risultato è lo stesso, e tutti i trinomi hanno $a > 0$.

```ad-example
Esempio 6: un quadrato al numeratore e un trinomio al denominatore
$$\frac{x^2 - 6x + 9}{x^2 - 5x + 4} < 0$$

Il denominatore ha $\Delta = 25 - 16 = 9$ e si annulla in $1$ e in $4$: C.E. $x \neq 1$, $x \neq 4$. Con $a = 1$ è positivo fuori da $1$ e $4$, negativo in mezzo.

Il numeratore ha $\Delta = 36 - 36 = 0$ ed è il quadrato $(x - 3)^2$: vale zero in $3$ ed è positivo altrove.

```tikz
% nome: disequazione-fratta-quadrato-numeratore
% alt: Tabella dei segni di x quadro meno 6x più 9 fratto x quadro meno 5x più 4: il numeratore è positivo ovunque tranne in 3, dove vale zero; il denominatore è negativo tra 1 e 4; la frazione è negativa tra 1 e 4 tranne in 3, e le soluzioni della frazione minore di zero sono i due intervalli da 1 a 3 e da 3 a 4, estremi esclusi
% svg: disequazione-fratta-quadrato-numeratore-23d9c784.svg 271x114
\begin{tikzpicture}
\node at (1.12,0) {$1$};
\node at (2.25,0) {$3$};
\node at (3.38,0) {$4$};
\node at (4.75,0) {$x$};
\draw[gray!60, densely dotted] (1.12,-0.20) -- (1.12,-0.45);
\draw[gray!60, densely dotted] (1.12,-0.82) -- (1.12,-1.07);
\draw[gray!60, densely dotted] (1.12,-1.44) -- (1.12,-1.69);
\draw[gray!60, densely dotted] (1.12,-2.06) -- (1.12,-2.31);
\draw[gray!60, densely dotted] (2.25,-0.20) -- (2.25,-0.45);
\draw[gray!60, densely dotted] (2.25,-0.82) -- (2.25,-1.07);
\draw[gray!60, densely dotted] (2.25,-1.44) -- (2.25,-1.69);
\draw[gray!60, densely dotted] (2.25,-2.06) -- (2.25,-2.31);
\draw[gray!60, densely dotted] (3.38,-0.20) -- (3.38,-0.45);
\draw[gray!60, densely dotted] (3.38,-0.82) -- (3.38,-1.07);
\draw[gray!60, densely dotted] (3.38,-1.44) -- (3.38,-1.69);
\draw[gray!60, densely dotted] (3.38,-2.06) -- (3.38,-2.31);
\node[left] at (-0.1,-0.62) {$x^2-6x+9$};
\draw[thick] (0.00,-0.62) -- (1.12,-0.62);
\node[above] at (0.56,-0.67) {\small $+$};
\draw[thick] (1.12,-0.62) -- (2.08,-0.62);
\node[above] at (1.69,-0.67) {\small $+$};
\draw[thick] (2.42,-0.62) -- (3.38,-0.62);
\node[above] at (2.81,-0.67) {\small $+$};
\draw[thick] (3.38,-0.62) -- (4.50,-0.62);
\node[above] at (3.94,-0.67) {\small $+$};
\node at (2.25,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x^2-5x+4$};
\draw[thick] (0.00,-1.24) -- (0.95,-1.24);
\node[above] at (0.56,-1.29) {\small $+$};
\draw[thick, dashed] (1.29,-1.24) -- (2.25,-1.24);
\node[above] at (1.69,-1.29) {\small $-$};
\draw[thick, dashed] (2.25,-1.24) -- (3.21,-1.24);
\node[above] at (2.81,-1.29) {\small $-$};
\draw[thick] (3.54,-1.24) -- (4.50,-1.24);
\node[above] at (3.94,-1.29) {\small $+$};
\node at (1.12,-1.24) {\small $0$};
\node at (3.38,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.50,-1.55);
\node[left] at (-0.1,-1.86) {\small frazione};
\node at (0.56,-1.86) {$+$};
\node at (1.69,-1.86) {$-$};
\node at (2.81,-1.86) {$-$};
\node at (3.94,-1.86) {$+$};
\draw[thick] (1.12,-1.86) circle (2.5pt);
\node at (2.25,-1.86) {\small $0$};
\draw[thick] (3.38,-1.86) circle (2.5pt);
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (1.23,-2.48) -- (2.15,-2.48);
\draw[blue!45, line width=2pt] (2.35,-2.48) -- (3.27,-2.48);
\draw[thick] (1.12,-2.48) circle (2.5pt);
\draw[thick] (2.25,-2.48) circle (2.5pt);
\draw[thick] (3.38,-2.48) circle (2.5pt);
\end{tikzpicture}
```

La frazione è negativa tra $1$ e $4$, tranne in $3$, dove vale zero. Il verso è $<$, e lo zero non è minore di zero: il $3$ va tolto.

$$1 < x < 3 \ \text{ oppure } \ 3 < x < 4$$

$$S = \,\mathopen{]}1, 3\mathclose{[}\, \cup \,\mathopen{]}3, 4\mathclose{[}$$

Con il verso $\leq$ il $3$ tornerebbe tra le soluzioni, e sarebbe $S = \,\mathopen{]}1, 4\mathclose{[}$: gli estremi $1$ e $4$ restano esclusi, perché lì la frazione non esiste.
```

```ad-warning
Il quadrato che si annulla
Un numeratore come $(x - 3)^2$ è positivo quasi ovunque, e viene da ignorarlo. Con il verso stretto, però, il suo zero va tolto dalle soluzioni: nell'esempio 6, per $x = 3$ la frazione vale $\dfrac{0}{-2} = 0$, e $0 < 0$ è falso.
```

## Sistemi di disequazioni di secondo grado

Un sistema può contenere disequazioni di secondo grado, e anche fratte. Si risolve come i sistemi di primo grado: ogni disequazione per conto suo, poi l'intersezione delle soluzioni con il grafico del sistema.

1. Risolvi ogni disequazione: quelle di secondo grado con il segno del trinomio, quelle fratte con la tabella dei segni.
2. Segna sulla retta tutti gli estremi che hai trovato, in ordine crescente.
3. Disegna una riga per ogni disequazione, con la linea dove è vera; una disequazione può avere due pezzi di linea.
4. Le soluzioni del sistema sono le strisce in cui ci sono le linee di tutte le righe.

```ad-example
Esempio 7: due disequazioni di secondo grado
$$
\begin{cases}
x^2 - 4x + 3 \leq 0 \\
x^2 - 4 > 0
\end{cases}
$$

Prima disequazione: il trinomio ha $\Delta = 16 - 12 = 4$ e le soluzioni $1$ e $3$; con $a > 0$ è negativo tra le soluzioni, e con il verso $\leq$ si prendono anche gli estremi: $1 \leq x \leq 3$.

Seconda disequazione: $x^2 - 4$ si annulla in $-2$ e in $2$ ed è positivo fuori: $x < -2$ oppure $x > 2$. La sua riga ha due pezzi.

```tikz
% nome: sistema-secondo-grado
% alt: Grafico del sistema tra x quadro meno 4x più 3 minore o uguale a zero e x quadro meno 4 maggiore di zero: la prima riga va da 1 a 3 con i pallini pieni, la seconda è formata da due semirette, prima di meno 2 e dopo 2, con i pallini vuoti; è colorata la striscia tra 2 e 3, dove ci sono tutte e due le linee
% svg: sistema-secondo-grado-6d2e8015.svg 276x78
\begin{tikzpicture}
\fill[orange!20] (2.40,-0.1) rectangle (3.20,1.35);
\draw[gray!70, dashed] (0.80,-0.1) -- (0.80,1.35);
\draw[gray!70, dashed] (1.60,-0.1) -- (1.60,1.35);
\draw[gray!70, dashed] (2.40,-0.1) -- (2.40,1.35);
\draw[gray!70, dashed] (3.20,-0.1) -- (3.20,1.35);
\draw[->] (0,0) -- (4.30,0) node[right] {$x$};
\draw (0.80,-0.08) -- (0.80,0.08);
\node[below] at (0.80,-0.1) {$-2$};
\draw (1.60,-0.08) -- (1.60,0.08);
\node[below] at (1.60,-0.1) {$1$};
\draw (2.40,-0.08) -- (2.40,0.08);
\node[below] at (2.40,-0.1) {$2$};
\draw (3.20,-0.08) -- (3.20,0.08);
\node[below] at (3.20,-0.1) {$3$};
\node[left] at (0,1.10) {\small $x^2-4x+3 \le 0$};
\draw[blue!50, line width=1.8pt] (1.60,1.10) -- (3.20,1.10);
\fill (1.60,1.10) circle (2.2pt);
\fill (3.20,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x^2-4 > 0$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0.00,0.55) -- (0.80,0.55);
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (2.40,0.55) -- (4.00,0.55);
\draw[thick] (0.80,0.55) circle (2.2pt);
\draw[thick] (2.40,0.55) circle (2.2pt);
\end{tikzpicture}
```

Le linee delle due righe ci sono insieme solo tra $2$ e $3$. Il $2$ ha il pallino vuoto nella seconda riga, il $3$ il pallino pieno nella prima:

$$S = \,\mathopen{]}2, 3]$$
```

```ad-warning
Confondere il sistema con la tabella dei segni
In un sistema si cercano le strisce in cui ci sono tutte le linee; nella tabella dei segni si contano i segni meno. Se nell'esempio 7 moltiplichi i segni dei due trinomi, risolvi la disequazione $(x^2 - 4x + 3)(x^2 - 4) \leq 0$, che è un'altra disequazione, con altre soluzioni.
```

```ad-example
Esempio 8: tre disequazioni, una sempre vera
$$
\begin{cases}
x^2 + 2 > 2x \\
x^2 \leq 5x \\
x^2 + 9 > 6x
\end{cases}
$$

Prima disequazione: $x^2 - 2x + 2 > 0$, con $\Delta = 4 - 8 = -4$ e $a > 0$: il trinomio è positivo per ogni $x$, e la disequazione è sempre vera.

Seconda disequazione: $x^2 - 5x \leq 0$, cioè $x(x - 5) \leq 0$, che dà $0 \leq x \leq 5$.

Terza disequazione: $x^2 - 6x + 9 > 0$, cioè $(x - 3)^2 > 0$. Il quadrato è positivo per ogni $x$ tranne $3$, dove vale zero: la disequazione è vera per $x \neq 3$.

```tikz
% nome: sistema-secondo-grado-tre-disequazioni
% alt: Grafico di un sistema di tre disequazioni: la prima, sempre vera, copre tutta la retta; la seconda va da 0 a 5 con i pallini pieni; la terza copre tutta la retta tranne il punto 3, con il pallino vuoto; sono colorate le strisce tra 0 e 3 e tra 3 e 5
% svg: sistema-secondo-grado-tre-disequazioni-d2f5df00.svg 263x97
\begin{tikzpicture}
\fill[orange!20] (1.05,-0.1) rectangle (2.06,1.90);
\fill[orange!20] (2.14,-0.1) rectangle (3.15,1.90);
\draw[gray!70, dashed] (1.05,-0.1) -- (1.05,1.90);
\draw[gray!70, dashed] (2.10,-0.1) -- (2.10,1.90);
\draw[gray!70, dashed] (3.15,-0.1) -- (3.15,1.90);
\draw[->] (0,0) -- (4.50,0) node[right] {$x$};
\draw (1.05,-0.08) -- (1.05,0.08);
\node[below] at (1.05,-0.1) {$0$};
\draw (2.10,-0.08) -- (2.10,0.08);
\node[below] at (2.10,-0.1) {$3$};
\draw (3.15,-0.08) -- (3.15,0.08);
\node[below] at (3.15,-0.1) {$5$};
\node[left] at (0,1.65) {\small $x^2+2 > 2x$};
\draw[blue!50, line width=1.8pt] (0.00,1.65) -- (4.20,1.65);
\node[left] at (0,1.10) {\small $x^2 \le 5x$};
\draw[blue!50, line width=1.8pt] (1.05,1.10) -- (3.15,1.10);
\fill (1.05,1.10) circle (2.2pt);
\fill (3.15,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x^2+9 > 6x$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0.00,0.55) -- (2.10,0.55);
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (2.10,0.55) -- (4.20,0.55);
\draw[thick] (2.10,0.55) circle (2.2pt);
\end{tikzpicture}
```

La prima riga copre tutta la retta e non toglie niente; la terza toglie solo il punto $3$ dal segmento della seconda:

$$0 \leq x < 3 \ \text{ oppure } \ 3 < x \leq 5$$

$$S = [0, 3\mathclose{[}\, \cup \,\mathopen{]}3, 5]$$
```

Se nel sistema ci fosse una disequazione mai vera, come $x^2 + 1 < 0$, il sistema sarebbe impossibile, $S = \emptyset$, qualunque siano le altre, come nei sistemi di primo grado.

## Problemi con le disequazioni di secondo grado

Un problema porta a una disequazione quando chiede per quali valori una grandezza supera un certo valore, o resta sotto. Il procedimento è quello dei [problemi di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/problemi-di-secondo-grado), con la disequazione al posto dell'equazione: le limitazioni dell'incognita e la disequazione del testo formano un sistema.

```ad-example
Esempio 9: un'area che deve superare un valore
Un rettangolo ha il perimetro di $20$ cm. Per quali misure della base l'area è maggiore di $21\ \text{cm}^2$?

Chiama $x$ la misura della base, in centimetri. La somma di base e altezza è metà del perimetro, $10$ cm, quindi l'altezza misura $10 - x$. Base e altezza devono essere positive: $x > 0$ e $10 - x > 0$, cioè $0 < x < 10$.

L'area è $x(10 - x)$, e deve essere maggiore di $21$:

$$
\begin{gathered}
x(10 - x) > 21 \\
\Rightarrow -x^2 + 10x - 21 > 0 \\
\Rightarrow x^2 - 10x + 21 < 0
\end{gathered}
$$

dove all'ultimo passaggio si è moltiplicato per $-1$ e cambiato il verso. Il trinomio ha $\Delta = 100 - 84 = 16$ e le soluzioni $3$ e $7$, ed è negativo in mezzo: $3 < x < 7$. Questi valori rispettano tutti le limitazioni $0 < x < 10$, quindi la soluzione del sistema è $3 < x < 7$.

L'area supera $21\ \text{cm}^2$ quando la base misura più di $3$ cm e meno di $7$ cm. Verifica con $x = 5$: l'altezza è $5$ cm e l'area $25\ \text{cm}^2$, maggiore di $21$; con $x = 3$ l'area è $3 \cdot 7 = 21\ \text{cm}^2$, che non è maggiore di $21$.

Se il problema chiedesse un'area maggiore di $25\ \text{cm}^2$, si arriverebbe a $x^2 - 10x + 25 < 0$, cioè $(x - 5)^2 < 0$, che non è vera per nessun $x$: nessun rettangolo con quel perimetro ha un'area così grande.
```

```ad-warning
Dimenticare le limitazioni
Le soluzioni della disequazione non sono ancora la risposta: vanno intersecate con le limitazioni dell'incognita. Nell'esempio 9 stanno già tutte tra $0$ e $10$, ma se l'area dovesse essere minore di $16\ \text{cm}^2$ si arriverebbe a $x^2 - 10x + 16 > 0$, cioè $x < 2$ oppure $x > 8$: senza le limitazioni si accetterebbero anche una base negativa, come $x = -1$, o maggiore di $10$. La risposta giusta è $0 < x < 2$ oppure $8 < x < 10$.
```
