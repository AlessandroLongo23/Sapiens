# L'impulso e il teorema dell'impulso

Chi salta da un muretto piega le ginocchia quando tocca terra. Chi prende al volo una palla veloce ritira le mani mentre la afferra. In un'automobile l'airbag si gonfia davanti al passeggero in caso di urto. In tutti e tre i casi un corpo deve fermarsi, e lo si fa fermare in un tempo più lungo perché la forza sia più piccola. La grandezza che lega forza e tempo si chiama impulso, e il teorema dell'impulso dice che cosa produce: una variazione della [quantità di moto](/materiale/scuola-superiore/fisica/la-quantita-di-moto/la-quantita-di-moto).

## L'impulso di una forza costante

L'**impulso** di una forza costante $\vec F$ che agisce per un intervallo di tempo $\Delta t$ è il vettore

$$\vec I = \vec F\,\Delta t$$

Ha la direzione e il verso della forza, perché $\Delta t$ è un numero positivo. Si misura in newton per secondo, $\text{N} \cdot \text{s}$, che è la stessa unità della quantità di moto:

$$\text{N} \cdot \text{s} = \text{kg} \cdot \frac{\text{m}}{\text{s}^2} \cdot \text{s} = \text{kg} \cdot \text{m/s}$$

Una forza piccola che agisce a lungo e una forza grande che agisce per poco possono avere lo stesso impulso: $2\,\text{N}$ per $10\,\text{s}$ e $200\,\text{N}$ per un decimo di secondo danno tutte e due $20\,\text{N} \cdot \text{s}$.

## Il teorema dell'impulso

Nella lezione sulla quantità di moto il secondo principio della dinamica è stato scritto nella forma $\vec F_{tot} = \Delta\vec p / \Delta t$. Lo si ricava da $\vec F_{tot} = m\,\vec a$: se la forza totale è costante, l'accelerazione è $\vec a = \Delta\vec v / \Delta t$, e

$$\vec F_{tot}\,\Delta t = m\,\vec a\,\Delta t = m\,\Delta\vec v = m\,\vec v_f - m\,\vec v_i = \Delta\vec p$$

A sinistra c'è l'impulso della forza totale. È il **teorema dell'impulso**: l'impulso della forza totale che agisce su un corpo è uguale alla variazione della sua quantità di moto.

$$\vec I = \Delta\vec p = \vec p_f - \vec p_i$$

È un'uguaglianza tra vettori. Per un moto lungo una retta si sceglie un verso positivo e si usano le componenti con il loro segno: $F_x\,\Delta t = m\,v_{fx} - m\,v_{ix}$. Una forza nel verso del moto dà un impulso positivo e fa crescere la quantità di moto; una forza opposta al moto dà un impulso negativo e la fa diminuire.

```ad-example
Esempio 1: una spinta costante
Un carrello di $4{,}0\,\text{kg}$, fermo su una rotaia senza attrito, viene spinto per $3{,}0\,\text{s}$ da una forza costante di $12\,\text{N}$. Quanto vale l'impulso della forza? Che velocità raggiunge il carrello?

$$I = F\,\Delta t = 12\,\text{N} \cdot 3{,}0\,\text{s} = 36\,\text{N} \cdot \text{s}$$

La forza è la sola che agisce lungo la rotaia, e il carrello parte da fermo: per il teorema dell'impulso $I = m\,v_f - 0$, quindi

$$v_f = \frac{I}{m} = \frac{36\,\text{N} \cdot \text{s}}{4{,}0\,\text{kg}} = 9{,}0\,\text{m/s}$$

Lo stesso impulso su un carrello di massa doppia darebbe metà della velocità, ma la stessa quantità di moto, $36\,\text{kg} \cdot \text{m/s}$.
```

## Le forze negli urti

Una racchetta che colpisce una palla, un martello che batte su un chiodo, due automobili che si scontrano: in un urto le forze agiscono per un tempo brevissimo, qualche millesimo di secondo, e durante quel tempo cambiano di continuo, da zero a un valore massimo molto grande e di nuovo a zero. Forze così si chiamano **forze impulsive**. Seguirle istante per istante è difficile, ma il teorema dell'impulso permette di farne a meno: misurando la quantità di moto prima e dopo l'urto si conosce l'impulso, e dividendo per la durata dell'urto si ottiene la **forza media**

$$\vec F_m = \frac{\Delta\vec p}{\Delta t}$$

cioè la forza costante che in quello stesso tempo darebbe lo stesso impulso. Durante un urto le forze impulsive sono molto più grandi del peso e degli attriti, che di solito si possono trascurare.

```ad-example
Esempio 2: la racchetta e la palla
Una palla da tennis di $58\,\text{g}$ arriva sulla racchetta a $25\,\text{m/s}$ e riparte nel verso opposto a $35\,\text{m/s}$. Il contatto dura $4{,}0\,\text{ms}$. Quanto vale l'impulso che la racchetta dà alla palla? Qual è la forza media?

```tikz
% nome: racchetta-palla-prima-dopo
% alt: Una palla da tennis disegnata due volte davanti a una racchetta vista di taglio. Prima dell'urto la palla va verso la racchetta, a sinistra, con una velocità di 25 metri al secondo; dopo l'urto si allontana verso destra con una velocità di 35 metri al secondo, disegnata più lunga. L'asse x punta verso destra
% svg: racchetta-palla-prima-dopo-e5caf2da.svg 187x117
\begin{tikzpicture}
\draw[very thick] (0,0.2) -- (0,2.6);
\draw[thick, fill=blue!10] (2.6,2.0) circle (0.18);
\draw[-{Stealth}, thick, blue!60!black] (2.42,2.0) -- (0.92,2.0) node[midway, above] {\small $25$ m/s};
\draw[thick, fill=blue!10] (0.6,0.8) circle (0.18);
\draw[-{Stealth}, thick, blue!60!black] (0.78,0.8) -- (2.88,0.8) node[midway, above] {\small $35$ m/s};
\node[right] at (3.3,2.0) {\small prima};
\node[right] at (3.3,0.8) {\small dopo};
\draw[->] (0.3,-0.2) -- (4.4,-0.2) node[right] {$x$};
\end{tikzpicture}
```

Scegliamo come verso positivo quello in cui la palla riparte. La massa è $0{,}058\,\text{kg}$, le velocità $v_{ix} = -25\,\text{m/s}$ e $v_{fx} = +35\,\text{m/s}$:

$$\begin{aligned}I_x &= \Delta p_x = m\,v_{fx} - m\,v_{ix} \\ &= 0{,}058\,\text{kg} \cdot \left[35\,\text{m/s} - (-25\,\text{m/s})\right] \\ &= 0{,}058\,\text{kg} \cdot 60\,\text{m/s} = 3{,}48\,\text{N} \cdot \text{s} \approx 3{,}5\,\text{N} \cdot \text{s}\end{aligned}$$

Il contatto dura $\Delta t = 4{,}0 \cdot 10^{-3}\,\text{s}$:

$$F_m = \frac{I_x}{\Delta t} = \frac{3{,}48\,\text{N} \cdot \text{s}}{4{,}0 \cdot 10^{-3}\,\text{s}} = 870\,\text{N} = 8{,}7 \cdot 10^2\,\text{N}$$

più di millecinquecento volte il peso della palla, $0{,}57\,\text{N}$.
```

```ad-warning
Nel rimbalzo la variazione è la somma
La palla dell'esempio 2 inverte il verso, e la sua velocità cambia di $60\,\text{m/s}$, non di $10\,\text{m/s}$. Con $35 - 25$ la forza media verrebbe $145\,\text{N}$, sei volte più piccola. E i millisecondi vanno portati in secondi: $4{,}0\,\text{ms} = 0{,}0040\,\text{s}$.
```

## Lo stesso impulso in tempi diversi

Per fermare un corpo bisogna togliergli tutta la sua quantità di moto: l'impulso necessario è fissato, $F_m\,\Delta t = \Delta p$. Forza media e durata sono allora inversamente proporzionali: se l'arresto dura il doppio, la forza si dimezza. È il principio su cui lavorano gli airbag, le cinture di sicurezza, i caschi, i materassi del salto in alto, le ginocchia piegate di chi atterra: allungano il tempo dell'urto. Chi invece vuole una forza grande, come il martello sul chiodo, fa in modo che l'urto sia il più breve possibile, tra due corpi duri.

```ad-example
Esempio 3: l'airbag
In un urto frontale un passeggero di $72\,\text{kg}$ che viaggia a $15\,\text{m/s}$ viene fermato. Qual è la forza media su di lui se lo ferma il cruscotto, in $0{,}010\,\text{s}$? E se lo ferma l'airbag, in $0{,}15\,\text{s}$?

La variazione della quantità di moto è la stessa nei due casi. In modulo:

$$\Delta p = m\,v = 72\,\text{kg} \cdot 15\,\text{m/s} = 1080\,\text{kg} \cdot \text{m/s}$$

$$F_m = \frac{1080\,\text{kg} \cdot \text{m/s}}{0{,}010\,\text{s}} = 108\,000\,\text{N} \approx 1{,}1 \cdot 10^5\,\text{N}$$

$$F_m = \frac{1080\,\text{kg} \cdot \text{m/s}}{0{,}15\,\text{s}} = 7200\,\text{N} = 7{,}2 \cdot 10^3\,\text{N}$$

Con l'airbag il tempo è quindici volte più lungo e la forza quindici volte più piccola. In più l'airbag distribuisce la forza su una superficie grande.

```tikz
% nome: airbag-due-tempi-stessa-area
% alt: Un grafico della forza in funzione del tempo con due rettangoli della stessa area che partono dall'origine: uno stretto e alto, largo 0,010 secondi e alto 108 chilonewton, segnato cruscotto, e uno largo e basso, largo 0,15 secondi e alto 7,2 chilonewton, segnato airbag
% svg: airbag-due-tempi-stessa-area-0ce3ccf8.svg 279x195
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (5.6,0) node[right] {$t$ (s)};
\draw[->] (0,-0.3) -- (0,3.9) node[above] {$F$ (kN)};
\foreach \x/\l in {1.5/0{,}05, 3/0{,}10, 4.5/0{,}15} \draw (\x,0.06) -- (\x,-0.06) node[below] {\small $\l$};
\foreach \y/\l in {1.5/50, 3/100} \draw (0.06,\y) -- (-0.06,\y) node[left] {\small $\l$};
\draw[thick, fill=blue!10] (0,0) rectangle (4.5,0.216);
\draw[thick, fill=red!15] (0,0) rectangle (0.3,3.24);
\node[right] at (0.35,2.6) {\small cruscotto: $108$ kN per $0{,}010$ s};
\node[above] at (2.9,0.25) {\small airbag: $7{,}2$ kN per $0{,}15$ s};
\end{tikzpicture}
```
```

Nella figura qui sotto lo stesso passeggero, $72\,\text{kg}$ a $15\,\text{m/s}$, viene fermato in un tempo che scegli tu. Sul grafico della forza in funzione del tempo il rettangolo cambia forma ma non area: passando da $0{,}02\,\text{s}$ a $0{,}20\,\text{s}$ la forza media scende da $54\,\text{kN}$ a $5{,}4\,\text{kN}$, dieci volte più piccola, da circa $77$ volte il peso del passeggero a meno di $8$.

```interattivo
% nome: impulso-tempo-arresto-forza
% alt: Il grafico della forza media in funzione del tempo per un passeggero di 72 chilogrammi che viaggia a 15 metri al secondo e viene fermato. Un cursore sceglie la durata dell'arresto, da 0,02 a 0,30 secondi: il rettangolo sotto il grafico diventa più largo e più basso, o più stretto e più alto, ma la sua area resta 1080 newton per secondo. Sotto sono scritti l'impulso, la forza media e quante volte è più grande del peso del passeggero
```

## La forza variabile: l'area sotto il grafico

Per una forza costante l'impulso $F\,\Delta t$ è l'area del rettangolo sotto il grafico della forza in funzione del tempo, di base $\Delta t$ e altezza $F$. Come per il [lavoro di una forza variabile](/materiale/scuola-superiore/fisica/il-lavoro-e-le-forze-conservative/il-lavoro-di-una-forza-variabile), dove l'area è quella sotto il grafico forza-spostamento, lo stesso vale quando la forza cambia nel tempo: si divide l'intervallo in tanti intervalli brevi, in ognuno dei quali la forza è quasi costante, e si sommano i rettangoli. L'impulso di una forza variabile è l'area sotto il grafico forza-tempo.

Il teorema dell'impulso continua a valere: quell'area è uguale a $\Delta p$. E la forza media è l'altezza del rettangolo che ha la stessa base e la stessa area:

$$F_m = \frac{I}{\Delta t}$$

```ad-example
Esempio 4: un calcio al pallone
Il piede di un calciatore colpisce un pallone fermo di $0{,}40\,\text{kg}$. La forza cresce da zero fino a $600\,\text{N}$ e torna a zero, con il grafico a triangolo della figura, in $0{,}020\,\text{s}$. Con che velocità parte il pallone? Qual è la forza media?

```tikz
% nome: impulso-area-picco-triangolo
% alt: Il grafico della forza in funzione del tempo durante un calcio: un triangolo che parte da zero, sale fino a 600 newton a 0,010 secondi e torna a zero a 0,020 secondi, con l'area colorata. Un rettangolo tratteggiato con la stessa base e alto 300 newton, la forza media, ha la stessa area del triangolo
% svg: impulso-area-picco-triangolo-75c5301b.svg 279x195
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid[xstep=1, ystep=1] (5,3.5);
\draw[->] (-0.3,0) -- (5.6,0) node[right] {$t$ (s)};
\draw[->] (0,-0.3) -- (0,3.9) node[above] {$F$ (N)};
\foreach \x/\l in {2/0{,}010, 4/0{,}020} \draw (\x,0.06) -- (\x,-0.06) node[below] {\small $\l$};
\foreach \y/\l in {1/200, 2/400, 3/600} \draw (0.06,\y) -- (-0.06,\y) node[left] {\small $\l$};
\draw[thick, red, fill=orange!25] (0,0) -- (2,3) -- (4,0) -- cycle;
\draw[dashed, thick] (0,1.5) -- (4,1.5) -- (4,0);
\node[right] at (4,1.5) {\small $F_m$};
\end{tikzpicture}
```

L'impulso è l'area del triangolo, di base $0{,}020\,\text{s}$ e altezza $600\,\text{N}$:

$$I = \frac{1}{2} \cdot 0{,}020\,\text{s} \cdot 600\,\text{N} = 6{,}0\,\text{N} \cdot \text{s}$$

Il pallone parte da fermo, quindi $I = m\,v_f$:

$$v_f = \frac{I}{m} = \frac{6{,}0\,\text{N} \cdot \text{s}}{0{,}40\,\text{kg}} = 15\,\text{m/s}$$

La forza media è $F_m = I / \Delta t = 6{,}0\,\text{N} \cdot \text{s} : 0{,}020\,\text{s} = 300\,\text{N} = 3{,}0 \cdot 10^2\,\text{N}$, la metà della forza massima.
```

```ad-warning
La forza media non è la forza massima
Nell'esempio 4 la forza arriva a $600\,\text{N}$, ma l'impulso non è $600\,\text{N} \cdot 0{,}020\,\text{s} = 12\,\text{N} \cdot \text{s}$: quello sarebbe il rettangolo intero, il doppio del triangolo. Quando un problema dà la forza media, l'impulso è $F_m\,\Delta t$; quando dà il grafico, è l'area.
```

## L'impulso è della forza totale

Nel teorema dell'impulso la forza è quella totale. Negli urti brevi le altre forze contano poco, ma quando l'arresto dura qualche decimo di secondo il peso non si può più trascurare.

```ad-example
Esempio 5: atterrare con le ginocchia piegate
Una ragazza di $60\,\text{kg}$ salta da un muretto e tocca terra a $4{,}0\,\text{m/s}$. Con quale forza media il suolo la spinge se atterra a gambe rigide, fermandosi in $0{,}10\,\text{s}$? E se piega le ginocchia, fermandosi in $0{,}50\,\text{s}$?

```tikz
% nome: atterraggio-forze-suolo-peso
% alt: Una persona disegnata come un blocco appoggiato al suolo, con la velocità v verso il basso disegnata di lato. Dal centro del blocco partono due forze verticali: la forza del suolo F s, verso l'alto, lunga 3,0 chilonewton in scala, e il peso mg, verso il basso, lungo 0,59 chilonewton. L'asse y punta verso l'alto
% svg: atterraggio-forze-suolo-peso-b698b896.svg 155x157
\begin{tikzpicture}
\draw[thick] (-1.6,0) -- (2.4,0);
\foreach \x in {-1.45,-1.3,...,2.4} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (-0.35,0) rectangle (0.35,1.2);
\fill (0,0.6) circle (1.5pt);
\draw[-{Stealth}, thick, red] (0,0.6) -- (0,3.6) node[right] {$\vec{F}_s$};
\draw[-{Stealth}, thick, red] (0,0.6) -- (0,0.01);
\node[right, red] at (0.38,0.3) {$m\vec{g}$};
\draw[-{Stealth}, thick, blue!60!black] (-1.0,1.6) -- (-1.0,0.6) node[midway, left] {$\vec{v}$};
\draw[->] (1.8,0.4) -- (1.8,1.6) node[above] {$y$};
\end{tikzpicture}
```

Con l'asse $y$ verso l'alto, la velocità passa da $v_{iy} = -4{,}0\,\text{m/s}$ a zero:

$$\Delta p_y = 0 - 60\,\text{kg} \cdot (-4{,}0\,\text{m/s}) = +240\,\text{kg} \cdot \text{m/s}$$

Sulla ragazza agiscono la forza del suolo $F_s$, verso l'alto, e il peso $m g = 60\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 588\,\text{N}$, verso il basso. Il teorema dell'impulso, con la forza totale, dà $(F_s - m g)\,\Delta t = \Delta p_y$, cioè

$$F_s = \frac{\Delta p_y}{\Delta t} + m g$$

A gambe rigide: $F_s = 240\,\text{kg} \cdot \text{m/s} : 0{,}10\,\text{s} + 588\,\text{N} = 2988\,\text{N} \approx 3{,}0 \cdot 10^3\,\text{N}$, cinque volte il peso. Con le ginocchia piegate: $F_s = 240\,\text{kg} \cdot \text{m/s} : 0{,}50\,\text{s} + 588\,\text{N} = 1068\,\text{N} \approx 1{,}1 \cdot 10^3\,\text{N}$.
```

```ad-warning
Il peso c'è anche durante l'urto
$\Delta p / \Delta t$ è la forza totale, non la forza del suolo. Nell'esempio 5 chi si ferma a $480\,\text{N}$ per l'atterraggio morbido trova una forza del suolo più piccola del peso, e la ragazza continuerebbe ad accelerare verso il basso.
```

## Impulso e lavoro

L'impulso e il [lavoro](/materiale/scuola-superiore/fisica/lavoro-ed-energia/il-lavoro-di-una-forza) misurano tutti e due l'effetto di una forza, ma in due modi diversi.

| | impulso | lavoro |
|---|---|---|
| definizione (forza costante) | $\vec I = \vec F\,\Delta t$ | $W = F\,s\cos\alpha$ |
| la forza agisce per | un tempo | uno spostamento |
| tipo di grandezza | vettore | scalare |
| unità | $\text{N} \cdot \text{s}$ | $\text{J} = \text{N} \cdot \text{m}$ |
| che cosa cambia | la quantità di moto: $\vec I = \Delta\vec p$ | l'energia cinetica: $W = \Delta K$ |
| forza variabile | area sotto il grafico forza-tempo | area sotto il grafico forza-spostamento |

Una forza può dare un impulso senza compiere lavoro: il muro che fa rimbalzare una palla alla stessa velocità cambia la sua quantità di moto di $2\,m\,v$, ma non la sua energia cinetica.

Durante un urto tra due corpi le forze che si scambiano sono uguali e opposte e durano lo stesso tempo: i due impulsi sono opposti, e così le due variazioni di quantità di moto. È il punto di partenza della lezione [La conservazione della quantità di moto](/materiale/scuola-superiore/fisica/la-quantita-di-moto/la-conservazione-della-quantita-di-moto).
