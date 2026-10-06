# Trasformazioni dei grafici

Dalla lezione [La parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola) sai che $y = x^2 - 3$ è la parabola $y = x^2$ spostata in giù di $3$, e che $y = -x^2$ è la stessa parabola ribaltata. Non hai rifatto la tabella dei valori: hai guardato che cosa era cambiato nella formula. Lo stesso si può fare con qualsiasi funzione. Se conosci il grafico di $y = f(x)$, i grafici di $y = f(x) + 2$, $y = f(x - 3)$, $y = -f(x)$, $y = 2f(x)$, $y = |f(x)|$ si ottengono spostando, ribaltando o deformando quello di partenza.

Ti servono pochi grafici di base, quelli di $y = x^2$, $y = |x|$, $y = \sqrt{x}$, $y = \dfrac{1}{x}$ e $y = x^3$, e le coordinate dei punti simmetrici della lezione [Il piano cartesiano: distanza e punto medio](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio). Le traslazioni, le simmetrie e le dilatazioni come trasformazioni del piano sono nella lezione [Trasformazioni geometriche](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/trasformazioni-geometriche): qui le applichiamo ai grafici.

Una regola tiene insieme tutta la lezione. Un'operazione fatta fuori da $f$, sul risultato, agisce sulle ordinate e muove il grafico in verticale, nel verso che ti aspetti. Un'operazione fatta dentro $f$, sulla $x$, agisce sulle ascisse e muove il grafico in orizzontale, nel verso contrario a quello che ti aspetti.

## Traslazioni

### In verticale: y = f(x) + b

Aggiungere $b$ al risultato aggiunge $b$ a ogni ordinata: il grafico di $y = f(x) + b$ è quello di $f$ spostato in su di $b$ se $b > 0$, in giù di $|b|$ se $b < 0$. Il punto $(x_0,\ y_0)$ va in $(x_0,\ y_0 + b)$.

### In orizzontale: y = f(x − a)

Il grafico di $y = f(x - a)$ è quello di $f$ spostato verso destra di $a$ se $a > 0$, verso sinistra di $|a|$ se $a < 0$. Il punto $(x_0,\ y_0)$ va in $(x_0 + a,\ y_0)$.

Il motivo è questo. Chiama $g(x) = f(x - a)$. Nel punto $x_0 + a$ la nuova funzione vale $g(x_0 + a) = f(x_0 + a - a) = f(x_0)$: prende il valore che $f$ aveva in $x_0$, cioè $a$ unità prima. Ogni valore arriva con un ritardo di $a$, e il grafico si ritrova spostato in avanti.

```ad-warning
Il segno nella traslazione orizzontale
$y = f(x - 3)$ sposta il grafico a destra di $3$, e $y = f(x + 3)$ lo sposta a sinistra di $3$. Per non sbagliare, chiediti dove finisce il punto che stava in $x = 0$: è il valore di $x$ che annulla la parentesi. Per $(x + 3)$ è $x = -3$, quindi a sinistra.
```

### Le due insieme: y = f(x − a) + b

Facendo tutti e due gli spostamenti, il punto $(x_0,\ y_0)$ va in $(x_0 + a,\ y_0 + b)$: è la traslazione di vettore $\vec{v}(a,\ b)$. Il grafico non cambia forma né orientamento.

Nella figura il grafico di $y = \sqrt{x}$, tratteggiato, e quello di $y = \sqrt{x - 2} + 1$: ogni punto si è spostato di $2$ a destra e di $1$ in su. Il punto di partenza della curva passa da $(0,\ 0)$ a $(2,\ 1)$, e il dominio da $x \geq 0$ a $x \geq 2$.

```tikz
% nome: traslazione-grafico-radice
% alt: Il grafico di y = radice di x, tratteggiato, e il grafico di y = radice di x meno 2, più 1: la stessa curva spostata di 2 a destra e di 1 in su; tre frecce uguali portano i punti (0, 0), (1, 1) e (4, 2) nei punti (2, 1), (3, 2) e (6, 3)
% svg: traslazione-grafico-radice-9e9ec0cb.svg 253x159
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-1,-1) grid (8,4);
\draw[->] (-1.3,0) -- (8.6,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,4.6) node[above] {$y$};
\foreach \x in {1,2,3,4,6} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {1,2,3} \node[left] at (0,\y) {\small $\y$};
\draw[thick, dashed, gray, domain=0:2.78, samples=40, smooth] plot ({\x*\x}, \x);
\draw[thick, blue!60, domain=0:2.4, samples=40, smooth] plot ({\x*\x + 2}, {\x + 1});
\draw[->, orange!80, thick] (0,0) -- (1.85,0.925);
\draw[->, orange!80, thick] (1,1) -- (2.85,1.925);
\draw[->, orange!80, thick] (4,2) -- (5.85,2.925);
\foreach \x/\y in {0/0, 1/1, 4/2} \fill[gray] (\x,\y) circle (0.1);
\foreach \x/\y in {2/1, 3/2, 6/3} \fill (\x,\y) circle (0.1);
\end{tikzpicture}
```
```grafico
% nome: traslazione-radice-cursori
% alt: Il grafico di y = radice di x meno a, più b, con i cursori di a e di b, e il grafico di y = radice di x tratteggiato: il punto di partenza della curva, P, ha coordinate (a, b) e si sposta a destra quando a aumenta, in su quando b aumenta
curva: y=\sqrt{x-a}+b
curva: y=\sqrt{x} | tratteggiata | grigio
curva: P=\left(a;b\right) | nero
cursore: a = 2 da -5 a 5 passo 0,5
cursore: b = 1 da -4 a 4 passo 0,5
finestra: x da -6 a 8, y da -5 a 6
valore: P = \left(a;b\right)
domanda: Porta il punto di partenza $P$ in $(-3,\ 2)$. Che formula hai ottenuto? Che segno ha il numero accanto alla $x$?
```

Per portare $P$ in $(-3,\ 2)$ servono $a = -3$ e $b = 2$: la formula è $y = \sqrt{x - (-3)} + 2 = \sqrt{x + 3} + 2$. Accanto alla $x$ c'è $+3$, anche se il grafico si è spostato a sinistra.

```ad-example
Esempio 1: una V traslata
Disegna il grafico di $y = |x + 3| - 2$.

La funzione di base è $f(x) = |x|$, una V con il vertice nell'origine. Scrivi $x + 3 = x - (-3)$: è $f(x - a) + b$ con $a = -3$ e $b = -2$, cioè la traslazione di vettore $\vec{v}(-3,\ -2)$. Il vertice va in $(-3,\ -2)$ e la V resta uguale, con i lati di pendenza $1$ e $-1$.

Controllo con due punti: per $x = -1$ viene $|2| - 2 = 0$ e per $x = 0$ viene $|3| - 2 = 1$. Il grafico taglia l'asse $x$ in $-5$ e in $-1$ e l'asse $y$ in $(0,\ 1)$.

```tikz
% nome: valore-assoluto-traslato
% alt: Il grafico di y = valore assoluto di x, tratteggiato, con il vertice nell'origine, e il grafico di y = valore assoluto di x più 3, meno 2: la stessa V con il vertice nel punto (-3, -2), che taglia l'asse x in -5 e in -1 e l'asse y in 1
% svg: valore-assoluto-traslato-5c750cc1.svg 249x185
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-7,-3) grid (3,4);
\draw[->] (-7.3,0) -- (3.7,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,4.6) node[above] {$y$};
\node[above right] at (-5,0) {\small $-5$};
\node[above] at (-3,0) {\small $-3$};
\node[below right] at (-1,0) {\small $-1$};
\node[right] at (0,-2) {\small $-2$};
\draw[thick, dashed, gray] (-3,3) -- (0,0) -- (3,3);
\draw[thick, blue!60] (-7,2) -- (-3,-2) -- (1.9,2.9);
\draw[dashed, gray] (-3,0) -- (-3,-2) -- (0,-2);
\foreach \x/\y in {-3/-2, -5/0, -1/0, 0/1} \fill (\x,\y) circle (0.11);
\end{tikzpicture}
```
```

```ad-example
Esempio 2: la parabola come traslazione
Mostra che $y = x^2 - 4x + 3$ è una traslazione di $y = x^2$.

Completa il quadrato: $x^2 - 4x$ sono i primi due termini di $(x - 2)^2 = x^2 - 4x + 4$, quindi

$$
\begin{aligned}
x^2 - 4x + 3 &= (x^2 - 4x + 4) - 4 + 3 \\
&= (x - 2)^2 - 1
\end{aligned}
$$

È $f(x - 2) - 1$ con $f(x) = x^2$: la parabola $y = x^2$ traslata del vettore $\vec{v}(2,\ -1)$. Il vertice, che era nell'origine, va in $(2,\ -1)$, lo stesso che dà la formula $x_V = -\dfrac{b}{2a}$.
```

Allo stesso modo $y = \dfrac{1}{x - 2} + 1$ è il grafico di $y = \dfrac{1}{x}$ traslato del vettore $\vec{v}(2,\ 1)$: è così che si disegna la funzione omografica nella lezione [Iperbole equilatera e funzione omografica](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/iperbole-equilatera-e-funzione-omografica).

## Simmetrie

Cambiare un segno ribalta il grafico:

- $y = -f(x)$ cambia segno a ogni ordinata: il punto $(x_0,\ y_0)$ va in $(x_0,\ -y_0)$, e il grafico è il simmetrico di quello di $f$ rispetto all'asse $x$;
- $y = f(-x)$ prende in $-x_0$ il valore che $f$ aveva in $x_0$: il punto $(x_0,\ y_0)$ va in $(-x_0,\ y_0)$, e il grafico è il simmetrico rispetto all'asse $y$;
- $y = -f(-x)$ fa tutte e due le cose: il punto $(x_0,\ y_0)$ va in $(-x_0,\ -y_0)$, e il grafico è il simmetrico rispetto all'origine.

Anche qui il meno fuori da $f$ agisce in verticale e il meno dentro in orizzontale. Nella figura le quattro curve che si ottengono da $y = \sqrt{x}$, con il punto $P(4,\ 2)$ e i suoi simmetrici.

```tikz
% nome: simmetrie-grafico-radice
% alt: Quattro curve uguali, una per quadrante: y = radice di x nel primo quadrante con il punto P(4, 2); y = meno radice di x nel quarto, simmetrica rispetto all'asse x; y = radice di meno x nel secondo, simmetrica rispetto all'asse y; y = meno radice di meno x nel terzo, simmetrica rispetto all'origine
% svg: simmetrie-grafico-radice-7cab8e9d.svg 278x185
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-5,-3) grid (5,3);
\draw[->] (-5.3,0) -- (5.7,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,3.7) node[above] {$y$};
\draw[thick, blue!60, domain=0:2.2, samples=40, smooth] plot ({\x*\x}, \x);
\draw[thick, orange!80, domain=0:2.2, samples=40, smooth] plot ({\x*\x}, {-\x});
\draw[thick, teal!70, domain=0:2.2, samples=40, smooth] plot ({-\x*\x}, \x);
\draw[thick, red!60, domain=0:2.2, samples=40, smooth] plot ({-\x*\x}, {-\x});
\foreach \x/\y in {4/2, 4/-2, -4/2, -4/-2} \fill (\x,\y) circle (0.1);
\node[below right] at (4,2) {\small $P$};
\node[blue!60!black, above] at (3.2,2.15) {\small $\sqrt{x}$};
\node[orange!80!black, below] at (3.2,-2.15) {\small $-\sqrt{x}$};
\node[teal!70!black, above] at (-3.2,2.15) {\small $\sqrt{-x}$};
\node[red!60!black, below] at (-3.2,-2.15) {\small $-\sqrt{-x}$};
\end{tikzpicture}
```

La simmetria rispetto all'asse $y$ ribalta anche il dominio: $y = \sqrt{-x}$ esiste per $-x \geq 0$, cioè per $x \leq 0$.

Queste simmetrie spiegano i nomi della lezione [Funzioni pari e dispari](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-pari-e-dispari). Una funzione è pari quando $f(-x) = f(x)$, cioè quando ribaltare il grafico rispetto all'asse $y$ lo lascia com'è; è dispari quando $-f(-x) = f(x)$, cioè quando lo lascia com'è la simmetria rispetto all'origine.

```ad-warning
Radice di meno x
$y = \sqrt{-x}$ non è una funzione "impossibile": il meno sta davanti alla $x$, non davanti al radicando intero. Per $x = -4$ il radicando vale $-(-4) = 4$ e la funzione vale $2$. E non è uguale a $y = -\sqrt{x}$: la prima è il simmetrico di $\sqrt{x}$ rispetto all'asse $y$, la seconda rispetto all'asse $x$.
```

## Dilatazioni e contrazioni

### In verticale: y = k f(x)

Con $k > 0$, moltiplicare il risultato per $k$ moltiplica per $k$ ogni ordinata: il punto $(x_0,\ y_0)$ va in $(x_0,\ k y_0)$. Se $k > 1$ il grafico si allunga in verticale, allontanandosi dall'asse $x$; se $0 < k < 1$ si schiaccia verso l'asse $x$. I punti sull'asse $x$ hanno ordinata zero e restano dove sono: gli zeri non cambiano.

Nella figura $f(x) = x^3 - 3x$, che ha gli zeri in $0$ e in $\pm\sqrt{3}$ e passa per $(-1,\ 2)$ e $(1,\ -2)$, con $y = 2f(x)$ e $y = \dfrac{1}{2}f(x)$: le tre curve tagliano l'asse $x$ negli stessi punti, e da una curva all'altra cambia solo l'altezza delle gobbe.

```tikz
% nome: dilatazione-verticale-grafico
% alt: Tre curve che tagliano l'asse x negli stessi tre punti: y = f(x), con f(x) = x al cubo meno 3x, che ha una gobba fino a 2 in x = -1 e una fino a -2 in x = 1; y = 2 f(x), con le gobbe fino a 4 e -4; y = un mezzo f(x), con le gobbe fino a 1 e -1
% svg: dilatazione-verticale-grafico-1a8d8468.svg 168x250
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-3,-5) grid (3,5);
\draw[->] (-3.3,0) -- (3.8,0) node[right] {$x$};
\draw[->] (0,-5.3) -- (0,5.7) node[above] {$y$};
\foreach \y in {2,4} \node[right] at (0,\y) {\small $\y$};
\node[below] at (-1,0) {\small $-1$};
\node[above] at (1,0) {\small $1$};
\draw[thick, orange!80, domain=-2.06:2.06, samples=70, smooth] plot (\x, {2*(\x*\x*\x - 3*\x)});
\draw[thick, teal!70, domain=-2.45:2.45, samples=70, smooth] plot (\x, {0.5*(\x*\x*\x - 3*\x)});
\draw[thick, blue!60, domain=-2.25:2.25, samples=70, smooth] plot (\x, {\x*\x*\x - 3*\x});
\foreach \x in {-1.732,0,1.732} \fill (\x,0) circle (0.11);
\foreach \y in {1,2,4} \fill (-1,\y) circle (0.09);
\node[blue!60!black, right] at (2.25,4.2) {\small $f$};
\node[orange!80!black, left] at (2.0,5) {\small $2f$};
\node[teal!70!black, right] at (2.45,3.3) {\small $\frac{1}{2}f$};
\end{tikzpicture}
```
```grafico
% nome: dilatazione-verticale-cursore
% alt: Il grafico di y = k per f(x), con f(x) = x al cubo meno 3x e il cursore di k, e il grafico di f tratteggiato: al variare di k le gobbe si alzano o si abbassano, gli zeri restano fermi, e con k negativo il grafico si ribalta rispetto all'asse x
curva: y=k\left(x^3-3x\right)
curva: y=x^3-3x | tratteggiata | grigio
cursore: k = 2 da -3 a 3 passo 0,1
finestra: x da -4 a 4, y da -6 a 6
domanda: Muovi $k$: quali punti del grafico non si spostano mai? Che cosa succede per $k = 0$ e per $k$ negativo?
```

Gli zeri non si spostano mai, perché $k \cdot 0 = 0$. Per $k = 0$ tutte le ordinate si annullano e il grafico si schiaccia sull'asse $x$: resta $y = 0$. Con $k$ negativo le due cose succedono insieme: $y = -2f(x)$ è il grafico di $f$ allungato di un fattore $2$ e poi ribaltato rispetto all'asse $x$.

### In orizzontale: y = f(kx)

Con $k > 0$, la funzione $g(x) = f(kx)$ prende in $\dfrac{x_0}{k}$ il valore che $f$ aveva in $x_0$: infatti $g\Big(\dfrac{x_0}{k}\Big) = f(x_0)$. Il punto $(x_0,\ y_0)$ va in $\Big(\dfrac{x_0}{k},\ y_0\Big)$: le ascisse sono divise per $k$. Se $k > 1$ il grafico si stringe verso l'asse $y$; se $0 < k < 1$ si allarga. Il punto sull'asse $y$ ha ascissa zero e resta dov'è.

Nella figura la stessa $f(x) = x^3 - 3x$ con $y = f(2x)$ e $y = f\Big(\dfrac{x}{2}\Big)$: le gobbe arrivano tutte alla stessa altezza, $2$ e $-2$, ma si trovano in ascisse diverse. La cima che $f$ ha in $x = -1$ passa in $x = -\dfrac{1}{2}$ per $f(2x)$ e in $x = -2$ per $f\Big(\dfrac{x}{2}\Big)$.

```tikz
% nome: dilatazione-orizzontale-grafico
% alt: Tre curve che passano per l'origine e hanno le gobbe alla stessa altezza, 2 e -2: y = f(x), con f(x) = x al cubo meno 3x, ha la cima in x = -1; y = f(2x), più stretta, ha la cima in x = -1/2; y = f(x/2), più larga, ha la cima in x = -2
% svg: dilatazione-orizzontale-grafico-99571efe.svg 251x208
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-5,-4) grid (5,4);
\draw[->] (-5.3,0) -- (5.8,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,4.7) node[above] {$y$};
\draw[dashed, gray] (-5,2) -- (5,2);
\draw[dashed, gray] (-5,-2) -- (5,-2);
\node[above right] at (0,2) {\small $2$};
\node[below left] at (0,-2) {\small $-2$};
\node[above] at (-2,2) {\small $-2$};
\node[above] at (-1,2) {\small $-1$};
\draw[thick, teal!70, domain=-4.4:4.4, samples=80, smooth] plot (\x, {\x*\x*\x/8 - 1.5*\x});
\draw[thick, orange!80, domain=-1.1:1.1, samples=70, smooth] plot (\x, {8*\x*\x*\x - 6*\x});
\draw[thick, blue!60, domain=-2.2:2.2, samples=70, smooth] plot (\x, {\x*\x*\x - 3*\x});
\foreach \x in {-2,-1,-0.5} \fill (\x,2) circle (0.1);
\foreach \x in {2,1,0.5} \fill (\x,-2) circle (0.1);
\node[blue!60!black, right] at (2.2,3.9) {\small $f(x)$};
\node[orange!80!black, above] at (1.1,4.05) {\small $f(2x)$};
\node[teal!70!black, right] at (4.45,3.3) {\small $f\big(\frac{x}{2}\big)$};
\end{tikzpicture}
```
```grafico
% nome: dilatazione-orizzontale-cursore
% alt: Il grafico di y = f(kx), con f(x) = x al cubo meno 3x e il cursore di k, e il grafico di f tratteggiato: al crescere di k il grafico si stringe verso l'asse y, le gobbe restano all'altezza 2 e -2 e gli zeri si avvicinano all'origine
curva: y=\left(kx\right)^3-3kx
curva: y=x^3-3x | tratteggiata | grigio
cursore: k = 2 da 0,2 a 4 passo 0,1
finestra: x da -5 a 5, y da -4 a 4
valore: x_0 = \frac{\sqrt{3}}{k}
domanda: Aumenta $k$: il grafico si allarga o si stringe? L'altezza delle gobbe cambia? Sotto il piano c'è lo zero che per $k = 1$ vale $\sqrt{3}$.
```

Aumentando $k$ il grafico si stringe verso l'asse $y$: lo zero passa da $\sqrt{3}$ a $\dfrac{\sqrt{3}}{k}$, mentre le gobbe restano all'altezza $2$ e $-2$. Con $k$ tra $0$ e $1$ il grafico si allarga. Il cursore non arriva a $k = 0$: lì $f(0 \cdot x) = f(0)$ sarebbe una funzione costante, e del grafico di partenza non resterebbe niente.

```ad-warning
f(2x) stringe, non allarga
Moltiplicare la $x$ per $2$ dimezza le ascisse: il grafico di $y = f(2x)$ è largo la metà. È lo stesso scambio di verso della traslazione orizzontale, e viene dalla stessa ragione: quello che si fa dentro $f$ va "disfatto" per ritrovare lo stesso valore.
```

```ad-note
Perché con la parabola non si vede la differenza
Per $f(x) = x^2$ si ha $f(2x) = 4x^2 = 4f(x)$: stringere la parabola in orizzontale di un fattore $2$ o allungarla in verticale di un fattore $4$ dà la stessa curva. È una particolarità delle potenze: per una funzione qualsiasi, come quella delle figure, le due dilatazioni danno grafici diversi.
```

```ad-example
Esempio 3: dove vanno tre punti
Il grafico di $f$ passa per $A(-2,\ 0)$, $B(0,\ 3)$ e $C(4,\ -6)$. Per quali punti passano i grafici di $y = 3f(x)$, di $y = f(2x)$ e di $y = -f(x) + 1$?

Per $y = 3f(x)$ le ordinate si moltiplicano per $3$: $(-2,\ 0)$, $(0,\ 9)$ e $(4,\ -18)$.

Per $y = f(2x)$ le ascisse si dividono per $2$: $(-1,\ 0)$, $(0,\ 3)$ e $(2,\ -6)$.

Per $y = -f(x) + 1$ le ordinate cambiano segno e poi aumentano di $1$: $(-2,\ 1)$, $(0,\ -2)$ e $(4,\ 7)$.
```

## Grafici con il valore assoluto

### y = |f(x)|

Il valore assoluto lascia com'è un'ordinata positiva o nulla e cambia segno a un'ordinata negativa. Per disegnare $y = |f(x)|$:

1. Tieni le parti del grafico di $f$ che stanno sopra l'asse $x$ o sull'asse.
2. Ribalta rispetto all'asse $x$ le parti che stanno sotto.

Il grafico che ottieni non scende mai sotto l'asse $x$.

### y = f(|x|)

Qui il valore assoluto sta dentro, sulla $x$. Per $x \geq 0$ è $|x| = x$ e la funzione coincide con $f$. Per $x < 0$ è $|x| = -x$, e la funzione vale quanto valeva nel punto opposto. Per disegnare $y = f(|x|)$:

1. Tieni la parte del grafico di $f$ con $x \geq 0$.
2. Cancella la parte con $x < 0$.
3. Al suo posto disegna la simmetrica rispetto all'asse $y$ della parte che hai tenuto.

La funzione che ottieni è sempre pari.

```ad-example
Esempio 4: i due valori assoluti sulla stessa parabola
Parti da $f(x) = x^2 - 2x - 3$ e disegna $y = |x^2 - 2x - 3|$ e $y = x^2 - 2|x| - 3$.

La parabola ha il vertice in $V(1,\ -4)$, taglia l'asse $x$ in $-1$ e in $3$ e l'asse $y$ in $(0,\ -3)$.

Per $y = |f(x)|$: la parabola sta sotto l'asse $x$ tra $-1$ e $3$. Quel tratto si ribalta, e il vertice va in $(1,\ 4)$; i due rami esterni restano dove sono.

Per $y = f(|x|)$, che è proprio $x^2 - 2|x| - 3$ perché $|x|^2 = x^2$: tieni la parte con $x \geq 0$, che scende da $(0,\ -3)$ al vertice $(1,\ -4)$ e risale tagliando l'asse $x$ in $3$, e la copi a sinistra. Il nuovo grafico ha due vertici, $(1,\ -4)$ e $(-1,\ -4)$, e taglia l'asse $x$ in $-3$ e in $3$. Lo zero $x = -1$ della parabola di partenza è sparito con la parte cancellata.

```tikz
% nome: valore-assoluto-fuori-e-dentro
% alt: A sinistra il grafico di y = valore assoluto di x al quadrato meno 2x meno 3: la parabola con il tratto tra -1 e 3 ribaltato sopra l'asse x, fino al punto (1, 4), e il tratto originale tratteggiato sotto. A destra il grafico di y = x al quadrato meno 2 per valore assoluto di x meno 3: la parte destra della parabola, con il vertice in (1, -4), copiata a sinistra con il vertice in (-1, -4), e la parte sinistra originale tratteggiata
% svg: valore-assoluto-fuori-e-dentro-b29fe785.svg 350x223
\begin{tikzpicture}[scale=0.42]
\begin{scope}
\draw[->] (-3.3,0) -- (5.6,0) node[right] {\small $x$};
\draw[->] (0,-4.8) -- (0,6.3) node[above] {\small $y$};
\draw[thick, dashed, gray, domain=-1:3, samples=40, smooth] plot (\x, {\x*\x - 2*\x - 3});
\draw[thick, blue!60, domain=-2:-1, samples=20, smooth] plot (\x, {\x*\x - 2*\x - 3});
\draw[thick, blue!60, domain=-1:3, samples=40, smooth] plot (\x, {-\x*\x + 2*\x + 3});
\draw[thick, blue!60, domain=3:4, samples=20, smooth] plot (\x, {\x*\x - 2*\x - 3});
\foreach \x/\y in {-1/0, 3/0, 1/4} \fill (\x,\y) circle (0.15);
\node[below left] at (-1,0) {\small $-1$};
\node[below right] at (3,0) {\small $3$};
\node[left] at (0,4.2) {\small $4$};
\node at (1,-5.8) {\small $y = |f(x)|$};
\end{scope}
\begin{scope}[shift={(12.5,0)}]
\draw[->] (-4.6,0) -- (5,0) node[right] {\small $x$};
\draw[->] (0,-4.8) -- (0,6.3) node[above] {\small $y$};
\draw[thick, dashed, gray, domain=-2:0, samples=30, smooth] plot (\x, {\x*\x - 2*\x - 3});
\draw[thick, blue!60, domain=0:4, samples=40, smooth] plot (\x, {\x*\x - 2*\x - 3});
\draw[thick, blue!60, domain=-4:0, samples=40, smooth] plot (\x, {\x*\x + 2*\x - 3});
\foreach \x/\y in {-3/0, 3/0, 1/-4, -1/-4, 0/-3} \fill (\x,\y) circle (0.15);
\node[above left] at (-3,0) {\small $-3$};
\node[above right] at (3,0) {\small $3$};
\node at (0,-5.8) {\small $y = f(|x|)$};
\end{scope}
\end{tikzpicture}
```
```grafico
% nome: valore-assoluto-fuori-e-dentro-cursore
% alt: La parabola y = x al quadrato meno 2x meno c, tratteggiata, con il cursore di c, e a scelta il grafico del valore assoluto di f(x) oppure quello di f del valore assoluto di x: nel primo il tratto sotto l'asse x è ribaltato, e sparisce quando il vertice sale fino all'asse; nel secondo la parte destra è copiata a sinistra
curva: y=x^2-2x-c | tratteggiata | grigio
scelta: \left|f(x)\right| :: y=\left|x^2-2x-c\right|
scelta: f\left(\left|x\right|\right) :: y=x^2-2\left|x\right|-c
cursore: c = 3 da -4 a 6 passo 0,5
finestra: x da -6 a 6, y da -7 a 7
valore: y_V = -1-c
domanda: Scegli $|f(x)|$ e abbassa $c$: la parabola tratteggiata sale. Da quale valore di $c$ il valore assoluto non cambia più niente?
```

Il vertice della parabola ha ordinata $y_V = -1 - c$. Finché è negativa c'è un tratto sotto l'asse $x$ da ribaltare; per $c = -1$ il vertice tocca l'asse, e per $c \leq -1$ la parabola non scende mai sotto: $|f(x)|$ e $f(x)$ sono la stessa funzione. Con $f(|x|)$, invece, $c$ sposta solo il grafico in verticale: i due vertici restano in $x = 1$ e in $x = -1$ per ogni $c$.
```

```ad-warning
Valore assoluto fuori o dentro
$|f(x)|$ ribalta in verticale quello che sta sotto l'asse $x$; $f(|x|)$ copia a sinistra quello che sta a destra dell'asse $y$. Con $f(x) = x - 2$ si vede subito che sono funzioni diverse: $|x - 2|$ è una V con il vertice in $(2,\ 0)$, $|x| - 2$ è una V con il vertice in $(0,\ -2)$.
```

## Più trasformazioni di seguito

Una formula come $y = -2\sqrt{x + 1} + 3$ contiene più trasformazioni. Si applicano una alla volta: prima quello che succede alla $x$, dentro, poi quello che succede al risultato, fuori, nell'ordine in cui si fanno i conti, cioè le moltiplicazioni prima delle addizioni. Quando dentro $f$ la $x$ è sia moltiplicata per un numero sia sommata a un numero serve una precauzione in più, che trovi nell'avviso dopo l'esempio.

```ad-example
Esempio 5: quattro passi dalla radice
Disegna il grafico di $y = -2\sqrt{x + 1} + 3$ partendo da $y = \sqrt{x}$.

Segui il punto di partenza $(0,\ 0)$ e il punto $(4,\ 2)$ della curva di base.

| Passo | Funzione | Che cosa fa | $(0,\ 0)$ va in | $(4,\ 2)$ va in |
|---|---|---|---|---|
| 1 | $\sqrt{x + 1}$ | sposta a sinistra di $1$ | $(-1,\ 0)$ | $(3,\ 2)$ |
| 2 | $2\sqrt{x + 1}$ | raddoppia le ordinate | $(-1,\ 0)$ | $(3,\ 4)$ |
| 3 | $-2\sqrt{x + 1}$ | ribalta rispetto all'asse $x$ | $(-1,\ 0)$ | $(3,\ -4)$ |
| 4 | $-2\sqrt{x + 1} + 3$ | sposta in su di $3$ | $(-1,\ 3)$ | $(3,\ -1)$ |

Il grafico parte da $(-1,\ 3)$ e scende verso destra. Controllo con la formula: per $x = 3$ viene $-2\sqrt{4} + 3 = -1$, e per $x = 0$ viene $-2 + 3 = 1$. Il dominio è $x \geq -1$.

```tikz
% nome: composizione-trasformazioni-radice
% alt: Il grafico di y = radice di x, tratteggiato, e il grafico di y = -2 per radice di x più 1, più 3: una curva che parte dal punto (-1, 3) e scende verso destra passando per (0, 1) e (3, -1)
% svg: composizione-trasformazioni-radice-824bfcbd.svg 253x206
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-2,-3) grid (7,4);
\draw[->] (-2.3,0) -- (7.6,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,4.6) node[above] {$y$};
\foreach \x in {-1,3,4} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {-1,3} \node[left] at (0,\y) {\small $\y$};
\draw[thick, dashed, gray, domain=0:2.6, samples=40, smooth] plot ({\x*\x}, \x);
\draw[thick, blue!60, domain=0:2.75, samples=40, smooth] plot ({\x*\x - 1}, {-2*\x + 3});
\draw[dashed, gray] (-1,0) -- (-1,3) -- (0,3);
\draw[dashed, gray] (3,0) -- (3,-1) -- (0,-1);
\foreach \x/\y in {-1/3, 0/1, 3/-1} \fill (\x,\y) circle (0.1);
\fill[gray] (0,0) circle (0.1);
\fill[gray] (4,2) circle (0.1);
\end{tikzpicture}
```
```

```ad-warning
L'ordine conta
$y = 2f(x) + 3$ è il grafico di $f$ prima allungato di un fattore $2$ e poi alzato di $3$. Se lo alzi prima e lo allunghi dopo ottieni $2\big(f(x) + 3\big) = 2f(x) + 6$, un'altra funzione. Dentro $f$ succede la stessa cosa: $f(2x - 4) = f\big(2(x - 2)\big)$ è il grafico di $f(2x)$ spostato a destra di $2$, non di $4$. Per leggere la traslazione orizzontale, raccogli prima il coefficiente della $x$.
```

```ad-example
Esempio 6: dalle trasformazioni alla formula
Il grafico di $y = |x|$ viene ribaltato rispetto all'asse $x$ e poi traslato del vettore $\vec{v}(2,\ 3)$. Scrivi l'equazione del nuovo grafico e trova i suoi zeri.

Il ribaltamento dà $y = -|x|$. La traslazione sostituisce $x$ con $x - 2$ e aggiunge $3$:

$$y = -|x - 2| + 3$$

È una V rovesciata con il vertice in $(2,\ 3)$. Gli zeri: $-|x - 2| + 3 = 0$ dà $|x - 2| = 3$, cioè $x = 5$ oppure $x = -1$.
```

## Tabella riassuntiva

| Equazione | Trasformazione del grafico di $f$ | $(x_0,\ y_0)$ va in |
|---|---|---|
| $y = f(x) + b$ | traslazione verticale di $b$ | $(x_0,\ y_0 + b)$ |
| $y = f(x - a)$ | traslazione orizzontale di $a$ | $(x_0 + a,\ y_0)$ |
| $y = -f(x)$ | simmetria rispetto all'asse $x$ | $(x_0,\ -y_0)$ |
| $y = f(-x)$ | simmetria rispetto all'asse $y$ | $(-x_0,\ y_0)$ |
| $y = -f(-x)$ | simmetria rispetto all'origine | $(-x_0,\ -y_0)$ |
| $y = k f(x)$, $k > 0$ | dilatazione verticale di fattore $k$ | $(x_0,\ k y_0)$ |
| $y = f(kx)$, $k > 0$ | dilatazione orizzontale di fattore $\dfrac{1}{k}$ | $\Big(\dfrac{x_0}{k},\ y_0\Big)$ |
| $y = \lvert f(x) \rvert$ | la parte sotto l'asse $x$ si ribalta | $(x_0,\ \lvert y_0 \rvert)$ |
| $y = f(\lvert x \rvert)$ | la parte con $x \geq 0$ si copia a sinistra | resta, e si aggiunge $(-x_0,\ y_0)$, se $x_0 \geq 0$ |

Con queste trasformazioni, dal grafico di una sola funzione ne ricavi un'intera famiglia. Le userai per la [funzione esponenziale](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-esponenziale) e per la [funzione logaritmica](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-logaritmica), e nella lezione [Funzioni periodiche](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-periodiche) hai già visto che $f(kx)$ divide il periodo per $k$.
