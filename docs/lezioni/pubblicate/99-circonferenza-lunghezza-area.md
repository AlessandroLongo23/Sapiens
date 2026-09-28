# Lunghezza della circonferenza e area del cerchio

Una ruota di bicicletta con il diametro di $70$ cm, a ogni giro, avanza di circa $2{,}2$ metri: poco più di tre volte il suo diametro. Il numero che lega il diametro alla lunghezza della circonferenza è sempre lo stesso, per la ruota come per una moneta, e si chiama $\pi$. Con lui si calcolano la lunghezza della circonferenza, l'area del cerchio e quelle delle sue parti: archi, settori, corone.

I nomi (raggio, diametro, arco, settore e segmento circolare) sono quelli della lezione [Circonferenza e cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/circonferenza-e-cerchio).

## Il numero pi greco

Se misuri la circonferenza e il diametro di oggetti rotondi diversi, un bicchiere, una moneta, un piatto, e dividi la prima misura per la seconda, trovi sempre lo stesso numero, poco più di $3$. Il rapporto tra la lunghezza di una circonferenza e il suo diametro è lo stesso per tutte le circonferenze, e si chiama $\pi$ (pi greco):

$$
\begin{gathered}
\pi = \frac{\text{circonferenza}}{\text{diametro}} \\
\pi = 3{,}14159\ldots
\end{gathered}
$$

```tikz
% nome: circonferenza-srotolata-tre-diametri
% alt: Una circonferenza di diametro d e, sotto, la stessa circonferenza srotolata in un segmento: ci stanno tre diametri e ne avanza un pezzetto, perché la lunghezza è pi greco per d, poco più di 3 volte d
% svg: circonferenza-srotolata-tre-diametri-7311b6ce.svg 136x107
\begin{tikzpicture}
\draw[thick] (0.55,1.35) circle (0.55);
\draw[blue!70!black, thick] (0.00,1.35) -- (1.10,1.35);
\fill (0.55,1.35) circle (0.04);
\node[font=\small] at (0.55,1.55) {$d$};
\draw[very thick] (0,0) -- (3.46,0);
\draw[thin] (0.00,0.12) -- (0.00,-0.12);
\draw[thin] (1.10,0.12) -- (1.10,-0.12);
\draw[thin] (2.20,0.12) -- (2.20,-0.12);
\draw[thin] (3.30,0.12) -- (3.30,-0.12);
\draw[blue!70!black, thick] (0.03,0.22) -- (1.07,0.22);
\node[font=\small] at (0.55,0.42) {$d$};
\draw[blue!70!black, thick] (1.13,0.22) -- (2.17,0.22);
\node[font=\small] at (1.65,0.42) {$d$};
\draw[blue!70!black, thick] (2.23,0.22) -- (3.27,0.22);
\node[font=\small] at (2.75,0.42) {$d$};
\draw[thin] (3.46,0.12) -- (3.46,-0.12);
\draw[thin, <->] (0,-0.35) -- (3.46,-0.35);
\node[font=\small] at (1.73,-0.6) {circonferenza $= \pi d$};
\end{tikzpicture}
```

$\pi$ è un numero irrazionale: le sue cifre decimali sono infinite e non si ripetono con un periodo (lo trovi nella lezione [Numeri irrazionali e numeri reali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/numeri-irrazionali-e-numeri-reali)). Nei conti si lascia indicato, e il risultato esatto si scrive con $\pi$, come $12\pi$; quando serve un numero si usa un'approssimazione, di solito $\pi \approx 3{,}14$.

Il valore di $\pi$ si trova con i poligoni regolari. Un esagono regolare inscritto nella circonferenza ha il perimetro più corto della circonferenza, uno circoscritto ce l'ha più lungo, e la circonferenza sta in mezzo (i poligoni inscritti e circoscritti sono nella lezione [Poligoni inscritti e circoscritti](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/poligoni-inscritti-e-circoscritti)).

```tikz
% nome: esagoni-inscritto-circoscritto
% alt: Una circonferenza con un esagono regolare inscritto, che le sta dentro, e un esagono regolare circoscritto, che le sta fuori: la lunghezza della circonferenza è compresa tra i due perimetri
% svg: esagoni-inscritto-circoscritto-74b5f729.svg 118x135
\begin{tikzpicture}
\draw[thick, orange!80!black] (1.50,0.87) -- (0.00,1.73) -- (-1.50,0.87) -- (-1.50,-0.87) -- (0.00,-1.73) -- (1.50,-0.87) -- cycle;
\draw[thick] (0.00,0.00) circle (1.50);
\draw[thick, blue!70!black] (1.50,0.00) -- (0.75,1.30) -- (-0.75,1.30) -- (-1.50,0.00) -- (-0.75,-1.30) -- (0.75,-1.30) -- cycle;
\fill (0.00,0.00) circle (0.06);
\node at (0.00,-0.26) {$O$};
\end{tikzpicture}
```

Il lato dell'esagono inscritto è uguale al raggio, quindi il suo perimetro è $6r = 3d$: il rapporto con il diametro è $3$. Per l'esagono circoscritto il rapporto è $2\sqrt{3} \approx 3{,}464$. Quindi $3 < \pi < 3{,}465$. Raddoppiando i lati le due stime si avvicinano:

| Lati dei poligoni | Inscritto: perimetro / diametro | Circoscritto: perimetro / diametro |
|---|---|---|
| $6$ | $3$ | $3{,}465$ |
| $12$ | $3{,}105$ | $3{,}216$ |
| $24$ | $3{,}132$ | $3{,}160$ |
| $48$ | $3{,}139$ | $3{,}147$ |
| $96$ | $3{,}141$ | $3{,}143$ |

Archimede di Siracusa, nel III secolo a.C., arrivò proprio al poligono di $96$ lati e trovò $3 + \dfrac{10}{71} < \pi < 3 + \dfrac{1}{7}$, cioè $\pi$ compreso tra circa $3{,}1408$ e $3{,}1429$. Da qui viene l'approssimazione $\pi \approx \dfrac{22}{7}$, che alcuni libri usano ancora.

## Lunghezza della circonferenza

Dalla definizione di $\pi$ la circonferenza è $\pi$ volte il diametro. Il diametro è il doppio del raggio, quindi

$$C = 2\pi r = \pi d$$

```ad-example
Esempio 1: dal raggio alla circonferenza, e ritorno
(a) Quanto è lunga una circonferenza di raggio $5$ cm?

$$C = 2\pi \cdot 5 = 10\pi \text{ cm}$$

Con $\pi \approx 3{,}14$ è circa $31{,}4$ cm.

(b) Una circonferenza è lunga $18\pi$ cm. Quanto misura il raggio?

$$
\begin{gathered}
2\pi r = 18\pi \\
r = \frac{18\pi}{2\pi} = 9 \text{ cm}
\end{gathered}
$$

(c) Una circonferenza è lunga $62{,}8$ cm. Quanto misura il raggio, con $\pi \approx 3{,}14$?

$$
\begin{gathered}
d = 62{,}8 : 3{,}14 = 20 \text{ cm} \\
r = 20 : 2 = 10 \text{ cm}
\end{gathered}
$$
```

```ad-example
Esempio 2: i giri di una ruota
Una ruota di bicicletta ha il diametro di $70$ cm. Quanti giri fa per percorrere $1$ km?

A ogni giro la ruota avanza di una circonferenza, che con $\pi \approx 3{,}14$ è

$$C = \pi \cdot 70 = 70\pi \approx 219{,}8 \text{ cm}$$

Un chilometro sono $100\,000$ cm, quindi i giri sono

$$100\,000 : 219{,}8 \approx 455$$
```

```ad-warning
Il diametro al posto del raggio
$C = 2\pi r$ vuole il raggio. Con il diametro di $70$ cm il conto $2\pi \cdot 70$ dà il doppio della circonferenza vera: con il diametro si usa $C = \pi d$, senza il $2$.
```

## Area del cerchio

Anche l'area si trova con i poligoni regolari inscritti. L'area di un poligono regolare è il perimetro per l'apotema diviso $2$, come nella lezione [Equivalenza e aree](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/equivalenza-e-aree): i raggi lo dividono in triangoli che hanno per base un lato e per altezza l'apotema.

```tikz
% nome: cerchio-poligono-regolare-inscritto
% alt: Un cerchio con un poligono regolare inscritto di 12 lati, diviso dai raggi in 12 triangoli uguali; in uno dei triangoli è segnato l'apotema a, che va dal centro O al punto medio del lato
% svg: cerchio-poligono-regolare-inscritto-de05d1ca.svg 118x118
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.50);
\fill[blue!15] (0.00,0.00) -- (0.00,-1.50) -- (0.75,-1.30) -- cycle;
\draw[thick, blue!70!black] (1.50,0.00) -- (1.30,0.75) -- (0.75,1.30) -- (0.00,1.50) -- (-0.75,1.30) -- (-1.30,0.75) -- (-1.50,0.00) -- (-1.30,-0.75) -- (-0.75,-1.30) -- (0.00,-1.50) -- (0.75,-1.30) -- (1.30,-0.75) -- cycle;
\draw[thin, blue!70!black] (0.00,0.00) -- (1.50,0.00);
\draw[thin, blue!70!black] (0.00,0.00) -- (1.30,0.75);
\draw[thin, blue!70!black] (0.00,0.00) -- (0.75,1.30);
\draw[thin, blue!70!black] (0.00,0.00) -- (0.00,1.50);
\draw[thin, blue!70!black] (0.00,0.00) -- (-0.75,1.30);
\draw[thin, blue!70!black] (0.00,0.00) -- (-1.30,0.75);
\draw[thin, blue!70!black] (0.00,0.00) -- (-1.50,0.00);
\draw[thin, blue!70!black] (0.00,0.00) -- (-1.30,-0.75);
\draw[thin, blue!70!black] (0.00,0.00) -- (-0.75,-1.30);
\draw[thin, blue!70!black] (0.00,0.00) -- (0.00,-1.50);
\draw[thin, blue!70!black] (0.00,0.00) -- (0.75,-1.30);
\draw[thin, blue!70!black] (0.00,0.00) -- (1.30,-0.75);
\draw[very thick] (0.00,0.00) -- (0.38,-1.40);
\draw[thin] (0.50,-1.37) -- (0.47,-1.24) -- (0.34,-1.27);
\fill (0.00,0.00) circle (0.06);
\node at (-0.31,0.08) {$O$};
\node[font=\small] at (-0.01,-0.75) {$a$};
\end{tikzpicture}
```

Aumentando il numero dei lati il poligono riempie il cerchio sempre di più: il perimetro si avvicina alla circonferenza $2\pi r$, e l'apotema si avvicina al raggio $r$. L'area del poligono si avvicina quindi a

$$\frac{2\pi r \cdot r}{2} = \pi r^2$$

e questa è l'area del cerchio:

$$A = \pi r^2$$

Lo stesso risultato si vede tagliando il cerchio in tanti settori uguali e mettendoli uno accanto all'altro, alternati in su e in giù. Viene una figura che somiglia a un parallelogramma: la base è metà circonferenza, $\pi r$, e l'altezza è il raggio, quindi l'area è $\pi r \cdot r = \pi r^2$. Più i settori sono sottili, più la figura assomiglia a un parallelogramma vero.

```tikz
% nome: cerchio-settori-riordinati
% alt: Un cerchio diviso in 12 settori uguali, colorati a colori alterni, e gli stessi settori messi uno accanto all'altro, alternati in su e in giù: formano una figura simile a un parallelogramma con la base lunga metà circonferenza, pi greco per r, e l'altezza lunga r
% svg: cerchio-settori-riordinati-a98a1d7e.svg 234x87
\begin{tikzpicture}
\fill[blue!18] (0.00,0.45) -- (0.90,0.45) arc[start angle=0.00, end angle=30.00, radius=0.90] -- cycle;
\fill[orange!22] (0.00,0.45) -- (0.78,0.90) arc[start angle=30.00, end angle=60.00, radius=0.90] -- cycle;
\fill[blue!18] (0.00,0.45) -- (0.45,1.23) arc[start angle=60.00, end angle=90.00, radius=0.90] -- cycle;
\fill[orange!22] (0.00,0.45) -- (0.00,1.35) arc[start angle=90.00, end angle=120.00, radius=0.90] -- cycle;
\fill[blue!18] (0.00,0.45) -- (-0.45,1.23) arc[start angle=120.00, end angle=150.00, radius=0.90] -- cycle;
\fill[orange!22] (0.00,0.45) -- (-0.78,0.90) arc[start angle=150.00, end angle=180.00, radius=0.90] -- cycle;
\fill[blue!18] (0.00,0.45) -- (-0.90,0.45) arc[start angle=180.00, end angle=210.00, radius=0.90] -- cycle;
\fill[orange!22] (0.00,0.45) -- (-0.78,0.00) arc[start angle=210.00, end angle=240.00, radius=0.90] -- cycle;
\fill[blue!18] (0.00,0.45) -- (-0.45,-0.33) arc[start angle=240.00, end angle=270.00, radius=0.90] -- cycle;
\fill[orange!22] (0.00,0.45) -- (0.00,-0.45) arc[start angle=270.00, end angle=300.00, radius=0.90] -- cycle;
\fill[blue!18] (0.00,0.45) -- (0.45,-0.33) arc[start angle=300.00, end angle=330.00, radius=0.90] -- cycle;
\fill[orange!22] (0.00,0.45) -- (0.78,0.00) arc[start angle=330.00, end angle=360.00, radius=0.90] -- cycle;
\draw[thin] (0.00,0.45) -- (0.90,0.45);
\draw[thin] (0.00,0.45) -- (0.78,0.90);
\draw[thin] (0.00,0.45) -- (0.45,1.23);
\draw[thin] (0.00,0.45) -- (0.00,1.35);
\draw[thin] (0.00,0.45) -- (-0.45,1.23);
\draw[thin] (0.00,0.45) -- (-0.78,0.90);
\draw[thin] (0.00,0.45) -- (-0.90,0.45);
\draw[thin] (0.00,0.45) -- (-0.78,0.00);
\draw[thin] (0.00,0.45) -- (-0.45,-0.33);
\draw[thin] (0.00,0.45) -- (0.00,-0.45);
\draw[thin] (0.00,0.45) -- (0.45,-0.33);
\draw[thin] (0.00,0.45) -- (0.78,0.00);
\draw[thick] (0.00,0.45) circle (0.90);
\fill[blue!18] (1.55,0) -- (1.78,0.87) arc[start angle=75.00, end angle=105.00, radius=0.90] -- cycle;
\draw (1.55,0) -- (1.78,0.87) arc[start angle=75.00, end angle=105.00, radius=0.90] -- cycle;
\fill[orange!22] (1.78,0.87) -- (1.55,0) arc[start angle=255.00, end angle=285.00, radius=0.90] -- cycle;
\draw (1.78,0.87) -- (1.55,0) arc[start angle=255.00, end angle=285.00, radius=0.90] -- cycle;
\fill[blue!18] (2.02,0) -- (2.25,0.87) arc[start angle=75.00, end angle=105.00, radius=0.90] -- cycle;
\draw (2.02,0) -- (2.25,0.87) arc[start angle=75.00, end angle=105.00, radius=0.90] -- cycle;
\fill[orange!22] (2.25,0.87) -- (2.02,0) arc[start angle=255.00, end angle=285.00, radius=0.90] -- cycle;
\draw (2.25,0.87) -- (2.02,0) arc[start angle=255.00, end angle=285.00, radius=0.90] -- cycle;
\fill[blue!18] (2.48,0) -- (2.71,0.87) arc[start angle=75.00, end angle=105.00, radius=0.90] -- cycle;
\draw (2.48,0) -- (2.71,0.87) arc[start angle=75.00, end angle=105.00, radius=0.90] -- cycle;
\fill[orange!22] (2.71,0.87) -- (2.48,0) arc[start angle=255.00, end angle=285.00, radius=0.90] -- cycle;
\draw (2.71,0.87) -- (2.48,0) arc[start angle=255.00, end angle=285.00, radius=0.90] -- cycle;
\fill[blue!18] (2.95,0) -- (3.18,0.87) arc[start angle=75.00, end angle=105.00, radius=0.90] -- cycle;
\draw (2.95,0) -- (3.18,0.87) arc[start angle=75.00, end angle=105.00, radius=0.90] -- cycle;
\fill[orange!22] (3.18,0.87) -- (2.95,0) arc[start angle=255.00, end angle=285.00, radius=0.90] -- cycle;
\draw (3.18,0.87) -- (2.95,0) arc[start angle=255.00, end angle=285.00, radius=0.90] -- cycle;
\fill[blue!18] (3.41,0) -- (3.65,0.87) arc[start angle=75.00, end angle=105.00, radius=0.90] -- cycle;
\draw (3.41,0) -- (3.65,0.87) arc[start angle=75.00, end angle=105.00, radius=0.90] -- cycle;
\fill[orange!22] (3.65,0.87) -- (3.41,0) arc[start angle=255.00, end angle=285.00, radius=0.90] -- cycle;
\draw (3.65,0.87) -- (3.41,0) arc[start angle=255.00, end angle=285.00, radius=0.90] -- cycle;
\fill[blue!18] (3.88,0) -- (4.11,0.87) arc[start angle=75.00, end angle=105.00, radius=0.90] -- cycle;
\draw (3.88,0) -- (4.11,0.87) arc[start angle=75.00, end angle=105.00, radius=0.90] -- cycle;
\fill[orange!22] (4.11,0.87) -- (3.88,0) arc[start angle=255.00, end angle=285.00, radius=0.90] -- cycle;
\draw (4.11,0.87) -- (3.88,0) arc[start angle=255.00, end angle=285.00, radius=0.90] -- cycle;
\draw[thin, <->] (1.55,-0.35) -- (4.35,-0.35);
\node[font=\small] at (2.95,-0.6) {metà circonferenza, $\pi r$};
\draw[thin, <->] (4.78,-0.03) -- (4.78,0.87);
\node[font=\small, right] at (4.78,0.42) {$r$};
\end{tikzpicture}
```

```ad-example
Esempio 3: aree di cerchi
(a) Qual è l'area di un cerchio di raggio $4$ cm?

$$A = \pi \cdot 4^2 = 16\pi\ \text{cm}^2$$

Con $\pi \approx 3{,}14$ è circa $50{,}24\ \text{cm}^2$.

(b) Qual è l'area di un cerchio di diametro $10$ cm?

Il raggio è $10 : 2 = 5$ cm, quindi $A = \pi \cdot 5^2 = 25\pi\ \text{cm}^2$, circa $78{,}5\ \text{cm}^2$.

(c) Un cerchio ha l'area di $49\pi\ \text{cm}^2$. Quanto misura il raggio?

$$
\begin{gathered}
\pi r^2 = 49\pi \\
r^2 = 49 \\
r = 7 \text{ cm}
\end{gathered}
$$

Si prende solo la soluzione positiva, perché $r$ è una lunghezza.

(d) Una circonferenza è lunga $12\pi$ cm. Qual è l'area del cerchio?

Dalla circonferenza si ricava il raggio, $2\pi r = 12\pi$, quindi $r = 6$ cm, e poi l'area: $A = \pi \cdot 6^2 = 36\pi\ \text{cm}^2$.
```

```ad-warning
Il quadrato del raggio, non il doppio
$\pi r^2$ vuol dire $\pi \cdot r \cdot r$. Con $r = 4$ cm l'area è $16\pi\ \text{cm}^2$; il conto $\pi \cdot 2 \cdot 4 = 8\pi$ confonde l'area con la circonferenza. E con il diametro di $10$ cm, $\pi \cdot 10^2 = 100\pi$ è quattro volte l'area vera: prima si divide il diametro per $2$.
```

```ad-tip
Raggio doppio, area quadrupla
Se il raggio raddoppia, la circonferenza raddoppia ma l'area diventa quattro volte più grande: da $r = 3$ a $r = 6$ l'area passa da $9\pi$ a $36\pi$. Una pizza di $30$ cm di diametro ha più del doppio dell'area di una da $20$ cm: $225\pi$ contro $100\pi$.
```

## Lunghezza di un arco

Un arco è una parte della circonferenza, e la sua lunghezza $\ell$ è proporzionale all'angolo al centro $\alpha$ che insiste su di esso, misurato in gradi. L'intera circonferenza corrisponde all'angolo giro, $360^\circ$, quindi

$$\ell : 2\pi r = \alpha : 360^\circ$$

```tikz
% nome: arco-angolo-al-centro
% alt: Circonferenza di centro O e raggio r con l'arco AB evidenziato, di lunghezza l, e l'angolo al centro alfa che insiste su quell'arco
% svg: arco-angolo-al-centro-912bba25.svg 133x135
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.50);
\draw[blue!70!black, very thick] (1.41,0.51) arc[start angle=20, end angle=80, radius=1.50];
\draw (1.41,0.51) -- (0.00,0.00) -- (0.26,1.48);
\draw[thin] (0.33,0.12) arc[start angle=20.00, delta angle=60.00, radius=0.35];
\node[font=\small] at (0.35,0.42) {$\alpha$};
\node at (1.12,1.34) {$\ell$};
\fill (0.00,0.00) circle (0.06);
\node at (-0.17,-0.20) {$O$};
\fill (1.41,0.51) circle (0.06);
\node at (1.67,0.61) {$A$};
\fill (0.26,1.48) circle (0.06);
\node at (0.31,1.75) {$B$};
\node[font=\small] at (0.77,0.07) {$r$};
\end{tikzpicture}
```

Ricavando $\ell$:

$$\ell = \frac{2\pi r \cdot \alpha}{360^\circ}$$

Con $\alpha = 180^\circ$ la formula dà metà circonferenza, $\pi r$; con $\alpha = 90^\circ$ un quarto, $\dfrac{\pi r}{2}$.

```ad-example
Esempio 4: archi
(a) In una circonferenza di raggio $6$ cm, quanto è lungo l'arco che corrisponde a un angolo al centro di $60^\circ$?

$$\ell = \frac{2\pi \cdot 6 \cdot 60^\circ}{360^\circ} = 2\pi \text{ cm}$$

cioè circa $6{,}28$ cm. Controllo: $60^\circ$ è un sesto dell'angolo giro, e la circonferenza è $12\pi$ cm; un sesto è $2\pi$ cm.

(b) Raggio $9$ cm e angolo al centro di $120^\circ$:

$$\ell = \frac{2\pi \cdot 9 \cdot 120^\circ}{360^\circ} = 6\pi \text{ cm}$$

(c) In una circonferenza di raggio $10$ cm un arco è lungo $5\pi$ cm. Quanto misura l'angolo al centro?

La circonferenza è $20\pi$ cm, e l'arco ne è un quarto, perché $5\pi : 20\pi = \dfrac{1}{4}$. Quindi l'angolo è un quarto di $360^\circ$, cioè $90^\circ$. Con la proporzione:

$$\alpha = \frac{5\pi \cdot 360^\circ}{20\pi} = 90^\circ$$
```

```ad-warning
Arco e corda
L'arco è il pezzo di circonferenza, curvo; la corda è il segmento dritto che unisce i suoi estremi, ed è più corta. Con raggio $6$ cm e angolo di $60^\circ$ l'arco è $2\pi \approx 6{,}28$ cm, la corda è $6$ cm, perché il triangolo con i due raggi è equilatero.
```

## Area di un settore circolare

Il settore circolare è la parte di cerchio compresa tra due raggi e un arco. Anche la sua area è proporzionale all'angolo al centro:

$$A_{\text{settore}} : \pi r^2 = \alpha : 360^\circ$$

```tikz
% nome: settore-circolare-angolo
% alt: Cerchio di centro O e raggio r con il settore circolare AOB colorato, di angolo al centro alfa
% svg: settore-circolare-angolo-6db498b7.svg 133x135
\begin{tikzpicture}
\fill[blue!15] (0.00,0.00) -- (1.41,0.51) arc[start angle=20, end angle=80, radius=1.50] -- cycle;
\draw[thick] (0.00,0.00) circle (1.50);
\draw (1.41,0.51) -- (0.00,0.00) -- (0.26,1.48);
\draw[thin] (0.33,0.12) arc[start angle=20.00, delta angle=60.00, radius=0.35];
\node[font=\small] at (0.35,0.42) {$\alpha$};
\fill (0.00,0.00) circle (0.06);
\node at (-0.17,-0.20) {$O$};
\fill (1.41,0.51) circle (0.06);
\node at (1.67,0.61) {$A$};
\fill (0.26,1.48) circle (0.06);
\node at (0.31,1.75) {$B$};
\node[font=\small] at (0.77,0.07) {$r$};
\end{tikzpicture}
```

Ricavando l'area:

$$A_{\text{settore}} = \frac{\pi r^2 \cdot \alpha}{360^\circ}$$

Se conosci già la lunghezza $\ell$ dell'arco c'è una formula più corta, che somiglia a quella del triangolo, con l'arco come base e il raggio come altezza:

$$A_{\text{settore}} = \frac{\ell \cdot r}{2}$$

```ad-example
Esempio 5: settori
(a) Qual è l'area di un settore di raggio $6$ cm e angolo al centro di $60^\circ$?

$$
\begin{aligned}
A &= \frac{\pi \cdot 6^2 \cdot 60^\circ}{360^\circ} \\
&= \frac{36\pi}{6} = 6\pi\ \text{cm}^2
\end{aligned}
$$

Con l'arco dell'esempio 4, $\ell = 2\pi$ cm: $\dfrac{2\pi \cdot 6}{2} = 6\pi\ \text{cm}^2$, lo stesso risultato.

(b) Raggio $10$ cm e angolo di $72^\circ$, che è un quinto dell'angolo giro:

$$A = \frac{100\pi}{5} = 20\pi\ \text{cm}^2$$

cioè circa $62{,}8\ \text{cm}^2$.

(c) Un settore di raggio $6$ cm ha l'area di $12\pi\ \text{cm}^2$. Quanto misura l'angolo al centro?

Il cerchio intero ha l'area $36\pi\ \text{cm}^2$, e il settore ne è un terzo, perché $12\pi : 36\pi = \dfrac{1}{3}$. L'angolo è un terzo di $360^\circ$:

$$\alpha = 120^\circ$$
```

```ad-warning
Il settore con la formula dell'arco
Nella proporzione per il settore c'è l'area del cerchio, $\pi r^2$, non la circonferenza $2\pi r$. Con raggio $6$ cm e $60^\circ$, $\dfrac{2\pi \cdot 6 \cdot 60^\circ}{360^\circ} = 2\pi$ è la lunghezza dell'arco, in cm, non l'area del settore, che è $6\pi\ \text{cm}^2$.
```

## Corona circolare

La **corona circolare** è la parte di piano compresa tra due circonferenze concentriche. Se $R$ è il raggio maggiore e $r$ quello minore, la sua area è l'area del cerchio grande meno quella del cerchio piccolo:

$$
\begin{aligned}
A_{\text{corona}} &= \pi R^2 - \pi r^2 \\
&= \pi (R^2 - r^2)
\end{aligned}
$$

```tikz
% nome: corona-circolare
% alt: Due circonferenze concentriche di centro O, con i raggi R e r: la corona circolare è la parte colorata compresa tra le due
% svg: corona-circolare-af1dbe83.svg 118x118
\begin{tikzpicture}
\fill[blue!15, even odd rule] (0.00,0.00) circle (1.50) (0.00,0.00) circle (0.90);
\draw[thick] (0.00,0.00) circle (1.50);
\draw[thick] (0.00,0.00) circle (0.90);
\draw (0.00,0.00) -- (1.30,0.75);
\draw (0.00,0.00) -- (-0.78,0.45);
\node[font=\small] at (0.55,0.55) {$R$};
\node[font=\small] at (-0.29,0.40) {$r$};
\fill (0.00,0.00) circle (0.06);
\node at (0.00,-0.26) {$O$};
\end{tikzpicture}
```

```ad-example
Esempio 6: una corona
Due circonferenze concentriche hanno i raggi di $5$ cm e $3$ cm. Qual è l'area della corona circolare?

$$
\begin{aligned}
A &= \pi \cdot (5^2 - 3^2) \\
&= \pi \cdot (25 - 9) = 16\pi\ \text{cm}^2
\end{aligned}
$$

Con $\pi \approx 3{,}14$ è circa $50{,}24\ \text{cm}^2$.
```

```ad-warning
La differenza dei raggi al quadrato
$\pi (R^2 - r^2)$ non è $\pi (R - r)^2$. Con $R = 5$ e $r = 3$ il primo è $16\pi$, il secondo $4\pi$: il cerchio con il raggio uguale allo spessore della corona è molto più piccolo della corona.
```

## Segmento circolare

Un segmento circolare è la parte di cerchio compresa tra una corda e un arco. Quando l'angolo al centro è di $90^\circ$ o di $60^\circ$, la sua area si trova con una sottrazione: l'area del settore meno quella del triangolo che ha per lati i due raggi e la corda.

$$A_{\text{segmento}} = A_{\text{settore}} - A_{\text{triangolo}}$$

Con l'angolo di $90^\circ$ il triangolo $OAB$ è rettangolo, e i cateti sono due raggi.

```ad-example
Esempio 7: il segmento di 90°
In un cerchio di raggio $6$ cm, qual è l'area del segmento circolare che corrisponde a un angolo al centro di $90^\circ$?

```tikz
% nome: segmento-circolare-angolo-retto
% alt: Cerchio di centro O e raggio 6 con i raggi perpendicolari OA e OB: il settore di 90 gradi è diviso dalla corda AB nel triangolo rettangolo OAB e nel segmento circolare, colorato in blu
% svg: segmento-circolare-angolo-retto-c5bac84e.svg 137x137
\begin{tikzpicture}
\fill[blue!20] (1.50,0.00) arc[start angle=0, end angle=90, radius=1.50] -- cycle;
\fill[orange!15] (0.00,0.00) -- (1.50,0.00) -- (0.00,1.50) -- cycle;
\draw[thick] (0.00,0.00) circle (1.50);
\draw (1.50,0.00) -- (0.00,0.00) -- (0.00,1.50) -- cycle;
\draw[thin] (0.18,0.00) -- (0.18,0.18) -- (0.00,0.18);
\fill (0.00,0.00) circle (0.06);
\node at (-0.18,-0.18) {$O$};
\fill (1.50,0.00) circle (0.06);
\node at (1.78,0.00) {$A$};
\fill (0.00,1.50) circle (0.06);
\node at (0.00,1.78) {$B$};
\node[font=\small] at (0.75,-0.20) {$6$};
\node[font=\small] at (-0.20,0.75) {$6$};
\end{tikzpicture}
```

Il settore è un quarto del cerchio, il triangolo $OAB$ è rettangolo in $O$ con i cateti di $6$ cm:

$$
\begin{gathered}
A_{\text{settore}} = \frac{36\pi}{4} = 9\pi \\
A_{\text{triangolo}} = \frac{6 \cdot 6}{2} = 18
\end{gathered}
$$

L'area del segmento è $9\pi - 18\ \text{cm}^2$. Con $\pi \approx 3{,}14$ è circa $28{,}26 - 18 = 10{,}26\ \text{cm}^2$.
```

Con l'angolo di $60^\circ$ il triangolo $OAB$ ha due lati congruenti, i raggi, e l'angolo compreso di $60^\circ$: gli altri due angoli sono congruenti e misurano $(180^\circ - 60^\circ) : 2 = 60^\circ$, quindi il triangolo è equilatero, con il lato uguale al raggio. La sua altezza è $\dfrac{\sqrt{3}}{2}$ volte il lato, come si trova con il teorema di Pitagora nella lezione [Teoremi di Pitagora e di Euclide](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide).

```ad-example
Esempio 8: il segmento di 60°
In un cerchio di raggio $6$ cm, qual è l'area del segmento circolare che corrisponde a un angolo al centro di $60^\circ$?

```tikz
% nome: segmento-circolare-angolo-60
% alt: Cerchio di centro O e raggio 6 con il settore di 60 gradi AOB: la corda AB lo divide nel triangolo equilatero OAB, con l'altezza BH tratteggiata, e nel segmento circolare colorato in blu
% svg: segmento-circolare-angolo-60-c458c020.svg 137x128
\begin{tikzpicture}
\fill[blue!20] (1.50,0.00) arc[start angle=0, end angle=60, radius=1.50] -- cycle;
\fill[orange!15] (0.00,0.00) -- (1.50,0.00) -- (0.75,1.30) -- cycle;
\draw[thick] (0.00,0.00) circle (1.50);
\draw (1.50,0.00) -- (0.00,0.00) -- (0.75,1.30) -- cycle;
\draw[dashed] (0.75,1.30) -- (0.75,0.00);
\draw[thin] (0.89,0.00) -- (0.89,0.14) -- (0.75,0.14);
\draw[thin] (0.30,0.00) arc[start angle=0.00, delta angle=60.00, radius=0.30];
\node[font=\scriptsize] at (0.48,0.27) {$60^\circ$};
\fill (0.00,0.00) circle (0.06);
\node at (-0.24,-0.09) {$O$};
\fill (1.50,0.00) circle (0.06);
\node at (1.78,0.00) {$A$};
\fill (0.75,1.30) circle (0.06);
\node at (0.89,1.54) {$B$};
\node at (0.75,-0.26) {$H$};
\node[font=\small] at (0.20,0.75) {$6$};
\end{tikzpicture}
```

Il settore è un sesto del cerchio: $A_{\text{settore}} = \dfrac{36\pi}{6} = 6\pi\ \text{cm}^2$. Il triangolo $OAB$ è equilatero di lato $6$ cm, e la sua altezza $BH$ è

$$\overline{BH} = \frac{6\sqrt{3}}{2} = 3\sqrt{3} \text{ cm}$$

quindi

$$
\begin{aligned}
A_{\text{triangolo}} &= \frac{6 \cdot 3\sqrt{3}}{2} \\
&= 9\sqrt{3}\ \text{cm}^2
\end{aligned}
$$

L'area del segmento è $6\pi - 9\sqrt{3}\ \text{cm}^2$, che con la calcolatrice è circa $18{,}85 - 15{,}59 = 3{,}26\ \text{cm}^2$.
```

## Figure composte

Molti problemi chiedono l'area di una figura fatta di pezzi di cerchi e di poligoni: si scompone la figura in parti di cui si conosce la formula, e si sommano o si sottraggono le aree.

```ad-example
Esempio 9: il quadrato e il cerchio inscritto
Un quadrato ha il lato di $8$ cm, e dentro c'è il cerchio inscritto. Qual è l'area della parte del quadrato che resta fuori dal cerchio?

```tikz
% nome: quadrato-cerchio-inscritto-angoli
% alt: Quadrato di lato 8 con il cerchio inscritto di raggio 4: le quattro zone agli angoli, dentro il quadrato e fuori dal cerchio, sono colorate
% svg: quadrato-cerchio-inscritto-angoli-5635033e.svg 95x112
\begin{tikzpicture}
\fill[blue!20, even odd rule] (-1.20,-1.20) rectangle (1.20,1.20) (0.00,0.00) circle (1.20);
\draw[thick] (-1.20,-1.20) rectangle (1.20,1.20);
\draw[thick] (0.00,0.00) circle (1.20);
\fill (0.00,0.00) circle (0.06);
\draw (0.00,0.00) -- (1.20,0.00);
\node[font=\small] at (0.60,0.20) {$4$};
\node[font=\small] at (0.00,-1.45) {$8$};
\end{tikzpicture}
```

Il cerchio inscritto tocca i quattro lati, quindi il suo diametro è uguale al lato: $r = 8 : 2 = 4$ cm. L'area che resta è quella del quadrato meno quella del cerchio:

$$
\begin{aligned}
A &= 8^2 - \pi \cdot 4^2 \\
&= 64 - 16\pi\ \text{cm}^2
\end{aligned}
$$

Con $\pi \approx 3{,}14$ è circa $64 - 50{,}24 = 13{,}76\ \text{cm}^2$.
```

```ad-warning
Arrotondare troppo presto
Quando il problema chiede il risultato approssimato, conviene fare i conti con $\pi$ fino alla fine e sostituire $3{,}14$ solo nell'ultimo passaggio. Arrotondando i risultati intermedi gli errori si sommano, e il numero finale può uscire diverso da quello del libro.
```

## Errori frequenti

```ad-warning
Le unità di misura
La circonferenza e l'arco sono lunghezze e si misurano in cm; l'area del cerchio, del settore e della corona in $\text{cm}^2$. Un risultato come "$16\pi$ cm" per un'area, o "$10\pi\ \text{cm}^2$" per una circonferenza, ha sbagliato qualcosa oltre all'unità: di solito ha usato la formula dell'altra grandezza.
```
