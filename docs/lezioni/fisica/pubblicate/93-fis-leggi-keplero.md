# Le leggi di Keplero

Il [sistema copernicano](/materiale/scuola-superiore/fisica/la-gravitazione/dal-sistema-tolemaico-al-sistema-copernicano) mette il Sole al centro, ma tiene le orbite circolari percorse a velocità costante, e con quelle non riesce a prevedere le posizioni dei pianeti meglio di Tolomeo. Giovanni Keplero (1571-1630), che aveva ereditato vent'anni di misure di Tycho Brahe, provò per anni a far passare un cerchio per le posizioni di Marte: lo scarto che restava, otto sessantesimi di grado, era piccolo ma più grande dell'incertezza delle misure di Tycho. Keplero si fidò delle misure e abbandonò il cerchio. Ne uscirono tre leggi, che descrivono come si muovono i pianeti: le prime due pubblicate nel 1609, la terza nel 1619.

## L'ellisse

L'**ellisse** è la curva formata dai punti del piano per i quali è costante la somma delle distanze da due punti fissi, i **fuochi** $F_1$ e $F_2$. La si disegna con due puntine e uno spago: fissati i capi dello spago alle puntine, una matita che lo tiene teso traccia un'ellisse. La sua equazione nel piano cartesiano si studia in matematica ([Ellisse](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/ellisse)); qui servono quattro lunghezze e un numero.

```tikz
% nome: ellisse-fuochi-semiassi
% alt: Un'ellisse con il centro O, i due fuochi F1 e F2 sull'asse maggiore, e un punto P della curva unito ai due fuochi da due segmenti. Sono segnati il semiasse maggiore a, dal centro all'estremo destro, il semiasse minore b, dal centro all'estremo in alto, e la distanza c tra il centro e un fuoco
% svg: ellisse-fuochi-semiassi-234eaad7.svg 231x191
\begin{tikzpicture}
\draw[thick] (0,0) ellipse (3 and 2.4);
\draw[thin, dashed] (-3,0) -- (3,0);
\draw[thin, dashed] (0,-2.4) -- (0,2.4);
\fill (0,0) circle (1.5pt) node[below left] {$O$};
\fill (-1.8,0) circle (1.5pt) node[below] {$F_1$};
\fill (1.8,0) circle (1.5pt) node[below] {$F_2$};
\draw[thin, blue] (-1.8,0) -- (1.5,2.078) -- (1.8,0);
\fill (1.5,2.078) circle (1.5pt) node[above right] {$P$};
\node[above] at (2.45,0) {$a$};
\node[right] at (0,-1.2) {$b$};
\node[above] at (-0.9,0) {$c$};
\end{tikzpicture}
```

- Il **semiasse maggiore** $a$ è metà della larghezza massima dell'ellisse, il **semiasse minore** $b$ metà della larghezza minima.
- La distanza di ciascun fuoco dal centro si indica con $c$.
- Per ogni punto $P$ della curva la somma delle distanze dai fuochi vale $2a$: $PF_1 + PF_2 = 2a$.
- L'**eccentricità** è il rapporto $e = \dfrac{c}{a}$, un numero tra $0$ e $1$ che dice quanto l'ellisse è schiacciata.

Con $e = 0$ i due fuochi coincidono con il centro e l'ellisse è una circonferenza di raggio $a$. Al crescere di $e$ i fuochi si allontanano dal centro e l'ellisse si allunga.

## La prima legge: la forma dell'orbita

**Prima legge di Keplero**: le orbite dei pianeti sono ellissi, e il Sole occupa uno dei due fuochi.

Nell'altro fuoco non c'è niente. Poiché il Sole non è al centro, la distanza del pianeta dal Sole cambia lungo l'orbita. Il punto dell'orbita più vicino al Sole si chiama **perielio**, quello più lontano **afelio**; stanno ai due estremi dell'asse maggiore.

```tikz
% nome: prima-legge-perielio-afelio
% alt: Un'orbita ellittica con il Sole S nel fuoco di sinistra e l'altro fuoco, vuoto, a destra. Il perielio è l'estremo sinistro dell'asse maggiore, l'afelio quello destro. Sotto l'asse sono segnate la distanza r con p dal perielio al Sole, più corta, e la distanza r con a dal Sole all'afelio, più lunga; più in basso una quota lunga quanto tutto l'asse maggiore vale 2a. Un pianeta è disegnato in un punto dell'orbita, unito al Sole dal raggio vettore r
% svg: prima-legge-perielio-afelio-526cf9da.svg 322x233
\begin{tikzpicture}
\draw[thick] (0,0) ellipse (3 and 2.598);
\draw[thin, dashed] (-3,0) -- (3,0);
\draw[thick, fill=yellow!40] (-1.5,0) circle (0.16);
\node[above left] at (-1.55,0.05) {$S$};
\draw[thin] (1.5,0) circle (1.5pt);
\fill (-3,0) circle (1.5pt) node[left] {perielio};
\fill (3,0) circle (1.5pt) node[right] {afelio};
\draw[thin] (-1.5,0) -- (-1.026,2.441) node[midway, right] {$r$};
\draw[thick, fill=blue!10] (-1.026,2.441) circle (0.1);
\draw[|-|, thin] (-3,-0.4) -- (-1.5,-0.4) node[midway, below] {$r_p$};
\draw[|-|, thin] (-1.5,-0.4) -- (3,-0.4) node[midway, below] {$r_a$};
\draw[|-|, thin] (-3,-3.0) -- (3,-3.0) node[midway, below] {$2a$};
\end{tikzpicture}
```

Il segmento che unisce il Sole al pianeta si chiama **raggio vettore**, e la sua lunghezza $r$ è la distanza del pianeta dal Sole. Dalla figura si leggono le distanze al perielio e all'afelio: il Sole dista $c = e\,a$ dal centro, quindi

$$r_p = a - c = a\,(1 - e) \qquad r_a = a + c = a\,(1 + e)$$

Sommando e sottraendo le due relazioni si ricavano il semiasse maggiore e l'eccentricità dalle due distanze, che sono le grandezze che si misurano:

$$a = \frac{r_p + r_a}{2} \qquad e = \frac{r_a - r_p}{r_a + r_p}$$

Il semiasse maggiore è la media tra la distanza minima e la distanza massima dal Sole: per questo si chiama anche distanza media.

```ad-example
Esempio 1: l'orbita della Terra
La Terra dista dal Sole $1{,}471 \cdot 10^{11}\,\text{m}$ al perielio e $1{,}521 \cdot 10^{11}\,\text{m}$ all'afelio. Trova il semiasse maggiore e l'eccentricità dell'orbita, e la distanza del Sole dal centro dell'orbita.

$$a = \frac{r_p + r_a}{2} = \frac{(1{,}471 + 1{,}521) \cdot 10^{11}\,\text{m}}{2} = 1{,}496 \cdot 10^{11}\,\text{m}$$

$$e = \frac{r_a - r_p}{r_a + r_p} = \frac{0{,}050 \cdot 10^{11}\,\text{m}}{2{,}992 \cdot 10^{11}\,\text{m}} = 0{,}01671\ldots \approx 0{,}017$$

La differenza $r_a - r_p$ ha solo due cifre significative, e così l'eccentricità. Il Sole dista dal centro dell'orbita

$$c = e\,a = 0{,}0167 \cdot 1{,}496 \cdot 10^{11}\,\text{m} \approx 2{,}5 \cdot 10^{9}\,\text{m}$$

cioè due milioni e mezzo di kilometri, meno del doppio del diametro del Sole. Il semiasse maggiore dell'orbita terrestre è l'unità astronomica: $1\,\text{UA} = 1{,}496 \cdot 10^{11}\,\text{m}$, che con tre cifre è $1{,}50 \cdot 10^{11}\,\text{m}$.
```

Le orbite dei pianeti sono ellissi poco schiacciate. Quella della Terra, disegnata in scala, non si distingue a occhio da una circonferenza; tra i pianeti la più schiacciata è quella di Mercurio, con $e = 0{,}21$. Le comete, invece, hanno spesso orbite molto allungate: quella della cometa di Halley ha $e = 0{,}97$.

```tikz
% nome: orbite-eccentricita-confronto
% alt: Tre orbite ellittiche disegnate con lo stesso semiasse maggiore, ognuna con il Sole in un fuoco. L'orbita della Terra, eccentricità 0,017, sembra una circonferenza con il Sole al centro. Quella di Mercurio, eccentricità 0,21, è appena schiacciata e il Sole è visibilmente spostato dal centro. Quella della cometa di Halley, eccentricità 0,97, è un'ellisse molto allungata con il Sole vicinissimo a un estremo
% svg: orbite-eccentricita-confronto-0486c8d7.svg 349x146
\begin{tikzpicture}
\draw[thick] (0,0) ellipse (1.3 and 1.3);
\draw[thick, fill=yellow!40] (-0.022,0) circle (0.09);
\node at (0,-1.75) {Terra};
\node at (0,-2.2) {$e = 0{,}017$};
\draw[thick] (3.2,0) ellipse (1.3 and 1.272);
\draw[thick, fill=yellow!40] (2.932,0) circle (0.09);
\node at (3.2,-1.75) {Mercurio};
\node at (3.2,-2.2) {$e = 0{,}21$};
\draw[thick] (6.4,0) ellipse (1.3 and 0.331);
\draw[thick, fill=yellow!40] (5.143,0) circle (0.045);
\node at (6.4,-1.75) {cometa di Halley};
\node at (6.4,-2.2) {$e = 0{,}97$};
\end{tikzpicture}
```

```ad-warning
Il Sole non è al centro dell'ellisse, e le figure esagerano
Il Sole sta in un fuoco, e l'altro fuoco è vuoto. Nelle figure dei libri, e in quelle di questa lezione, le orbite sono disegnate molto più schiacciate del vero per far vedere fuochi, perielio e afelio: non prenderle come un ritratto dell'orbita della Terra.
```

```ad-warning
Le stagioni non dipendono dalla distanza dal Sole
La Terra passa al perielio all'inizio di gennaio, quando nel nostro emisfero è inverno, e all'afelio all'inizio di luglio. La distanza cambia solo del $3\%$: le stagioni sono dovute all'inclinazione dell'asse terrestre.
```

## La seconda legge: la velocità lungo l'orbita

**Seconda legge di Keplero**: il raggio vettore che unisce il Sole al pianeta spazza aree uguali in intervalli di tempo uguali.

```tikz
% nome: seconda-legge-aree-uguali
% alt: Un'orbita ellittica con il Sole nel fuoco di sinistra. Due settori colorati hanno il vertice nel Sole: uno corto e largo vicino al perielio, a sinistra, e uno lungo e stretto vicino all'afelio, a destra. I due settori hanno la stessa area e sono percorsi nello stesso tempo: l'arco di orbita vicino al perielio è molto più lungo di quello vicino all'afelio
% svg: seconda-legge-aree-uguali-8c758a16.svg 280x186
\begin{tikzpicture}
\fill[orange!25] (-1.8,0) -- plot[domain=-38.67:38.67, samples=25, variable=\t] ({-3*cos(\t)},{2.4*sin(\t)}) -- cycle;
\fill[orange!25] (-1.8,0) -- plot[domain=169.23:190.77, samples=15, variable=\t] ({-3*cos(\t)},{2.4*sin(\t)}) -- cycle;
\draw[thin] (-2.342,1.5) -- (-1.8,0) -- (-2.342,-1.5);
\draw[thin] (2.947,0.449) -- (-1.8,0) -- (2.947,-0.449);
\draw[thick] (0,0) ellipse (3 and 2.4);
\draw[thick, fill=yellow!40] (-1.8,0) circle (0.16);
\node[below right] at (-1.75,-0.1) {$S$};
\node at (-2.5,0) {$A_1$};
\node at (1.5,0) {$A_2$};
\fill (-2.342,1.5) circle (1.5pt);
\fill (-2.342,-1.5) circle (1.5pt);
\fill (2.947,0.449) circle (1.5pt);
\fill (2.947,-0.449) circle (1.5pt);
\node[left] at (-3,0) {$\Delta t$};
\node[right] at (3,0) {$\Delta t$};
\end{tikzpicture}
```

Nella figura i due settori $A_1$ e $A_2$ hanno la stessa area e sono percorsi nello stesso intervallo $\Delta t$. Vicino al Sole il raggio vettore è corto, e per spazzare la stessa area il pianeta deve percorrere un arco lungo; lontano dal Sole il raggio vettore è lungo e serve solo un arco corto. Quindi il pianeta è più veloce quando è più vicino al Sole: la velocità è massima al perielio e minima all'afelio. Il moto lungo l'orbita non è uniforme, e cade così anche la seconda idea degli antichi, dopo quella del cerchio.

Nella figura qui sotto l'orbita è divisa in dodici settori percorsi in tempi uguali. Come cambiano i settori, e la velocità, quando l'orbita diventa più schiacciata?

```interattivo
% nome: orbita-ellittica-aree
% alt: Un'orbita ellittica con il Sole in un fuoco, divisa in dodici settori che il pianeta percorre in tempi uguali; il settore in cui si trova il pianeta è colorato. Il pianeta si muove lungo l'orbita con la freccia della velocità, più lunga vicino al Sole. Un cursore cambia l'eccentricità da 0 a 0,8, un bottone avvia e ferma il moto. Sotto la figura sono scritte la distanza dal Sole in unità astronomiche e la velocità in kilometri al secondo, per un'orbita con il semiasse maggiore di una unità astronomica
```

Con l'eccentricità a zero l'orbita è una circonferenza, i settori sono spicchi tutti uguali e la velocità è costante. Aumentando l'eccentricità i settori vicini al perielio diventano corti e larghi, quelli vicini all'afelio lunghi e stretti, ma hanno tutti la stessa area; la freccia della velocità si allunga al perielio e si accorcia all'afelio.

### Le velocità al perielio e all'afelio

Al perielio e all'afelio la velocità è perpendicolare al raggio vettore. In un intervallo di tempo $\Delta t$ molto breve il pianeta percorre un trattino lungo $v\,\Delta t$, e il raggio vettore spazza un triangolo sottile che ha per base quel trattino e per altezza la distanza dal Sole. Le due aree sono

$$A_p = \frac{1}{2}\,r_p\,v_p\,\Delta t \qquad A_a = \frac{1}{2}\,r_a\,v_a\,\Delta t$$

Per la seconda legge sono uguali, e semplificando resta

$$v_p\,r_p = v_a\,r_a$$

Al perielio e all'afelio velocità e distanza sono inversamente proporzionali. La seconda legge è un caso della [conservazione del momento angolare](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/la-conservazione-del-momento-angolare): il momento angolare del pianeta rispetto al Sole, che al perielio e all'afelio vale $m\,v\,r$, resta lo stesso lungo tutta l'orbita.

```ad-example
Esempio 2: la cometa di Halley all'afelio
La cometa di Halley passa al perielio a $0{,}586\,\text{UA}$ dal Sole, con una velocità di $54{,}5\,\text{km/s}$. Il suo afelio è a $35{,}1\,\text{UA}$. Con quale velocità si muove all'afelio?

Da $v_p\,r_p = v_a\,r_a$:

$$v_a = v_p \cdot \frac{r_p}{r_a} = 54{,}5\,\text{km/s} \cdot \frac{0{,}586\,\text{UA}}{35{,}1\,\text{UA}} = 0{,}9098\ldots\,\text{km/s} \approx 0{,}910\,\text{km/s}$$

Le distanze compaiono in un rapporto, quindi possono restare in unità astronomiche. All'afelio la cometa è sessanta volte più lontana che al perielio, e sessanta volte più lenta: per questo passa quasi tutto il suo tempo lontano dal Sole.
```

```ad-warning
La formula vale solo al perielio e all'afelio
$v\,r$ ha lo stesso valore solo nei due punti in cui la velocità è perpendicolare al raggio vettore. In un punto qualsiasi dell'orbita la seconda legge vale ancora, ma il conto delle aree non è più quello di un triangolo con base $v\,\Delta t$ e altezza $r$.
```

## La terza legge: periodi e distanze

Le prime due leggi riguardano un pianeta alla volta. La terza confronta i pianeti tra loro, e lega il periodo di rivoluzione $T$, cioè il tempo di un giro attorno al Sole, al semiasse maggiore $a$ dell'orbita.

**Terza legge di Keplero**: il rapporto tra il quadrato del periodo di rivoluzione e il cubo del semiasse maggiore dell'orbita è lo stesso per tutti i pianeti.

$$\frac{T^2}{a^3} = K$$

La tabella lo mostra con i sei pianeti noti a Keplero, misurando $a$ in unità astronomiche e $T$ in anni.

| Pianeta | $a$ (UA) | $T$ (anni) | $T^2/a^3$ (anni²/UA³) |
|---|---|---|---|
| Mercurio | $0{,}387$ | $0{,}241$ | $1{,}00$ |
| Venere | $0{,}723$ | $0{,}615$ | $1{,}00$ |
| Terra | $1{,}000$ | $1{,}000$ | $1{,}00$ |
| Marte | $1{,}524$ | $1{,}881$ | $1{,}00$ |
| Giove | $5{,}203$ | $11{,}86$ | $1{,}00$ |
| Saturno | $9{,}54$ | $29{,}46$ | $1{,}00$ |

Con queste unità la costante vale $1$, perché per la Terra $a = 1\,\text{UA}$ e $T = 1$ anno. Per i corpi che girano attorno al Sole la legge prende allora una forma comoda:

$$T^2 = a^3 \qquad (T \text{ in anni},\ a \text{ in UA})$$

Il periodo cresce più in fretta della distanza: un pianeta quattro volte più lontano impiega otto volte più tempo, perché $\sqrt{4^3} = 8$. I pianeti lontani non solo percorrono orbite più lunghe, ma sono anche più lenti.

```tikz
% nome: terza-legge-grafico-periodo-semiasse
% alt: Grafico cartesiano del periodo di rivoluzione T, in anni, in funzione del semiasse maggiore a, in unità astronomiche, per i pianeti fino a Marte. I quattro punti di Mercurio, Venere, Terra e Marte stanno su una curva che parte dall'origine e sale sempre più ripida: la curva T uguale a radice di a al cubo
% svg: terza-legge-grafico-periodo-semiasse-0ecc6f7c.svg 303x230
% poi-interattivo: aggiungere un pianeta scegliendo il semiasse e leggere il periodo sulla curva
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid[xstep=1.5, ystep=1] (5.4,4.4);
\draw[->] (-0.2,0) -- (5.8,0) node[right] {$a$ (UA)};
\draw[->] (0,-0.2) -- (0,4.8) node[above] {$T$ (anni)};
\foreach \x/\l in {1.5/{0{,}5}, 3/1, 4.5/{1{,}5}} \draw (\x,0.06) -- (\x,-0.06) node[below] {$\l$};
\foreach \y/\l in {1/{0{,}5}, 2/1, 3/{1{,}5}, 4/2} \draw (0.06,\y) -- (-0.06,\y) node[left] {$\l$};
\draw[thick, blue] plot[domain=0:1.75, samples=40, variable=\x] ({3*\x},{2*sqrt(\x*\x*\x)});
\fill (1.161,0.482) circle (1.6pt) node[below right] {Mercurio};
\fill (2.169,1.23) circle (1.6pt) node[below right] {Venere};
\fill (3,2) circle (1.6pt) node[below right] {Terra};
\fill (4.572,3.762) circle (1.6pt) node[left=3pt] {Marte};
\end{tikzpicture}
```

Per usare la legge servono due operazioni: trovare $T$ da $a$, cioè $T = \sqrt{a^3}$, e trovare $a$ da $T$, cioè $a = \sqrt[3]{T^2}$. Sono [potenze con esponente razionale](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/potenze-con-esponente-razionale): $T = a^{3/2}$ e $a = T^{2/3}$, e sulla calcolatrice si scrivono `a^1.5` e `T^(2/3)`.

```ad-example
Esempio 3: il periodo di Giove
Il semiasse maggiore dell'orbita di Giove è $5{,}20\,\text{UA}$. Quanto dura l'anno di Giove?

Giove gira attorno al Sole, quindi con $a$ in unità astronomiche e $T$ in anni vale $T^2 = a^3$:

$$T = \sqrt{a^3} = \sqrt{5{,}20^3} = \sqrt{140{,}608} = 11{,}857\ldots \approx 11{,}9\ \text{anni}$$

Giove è circa cinque volte più lontano dal Sole della Terra e impiega quasi dodici anni a fare un giro.
```

```ad-example
Esempio 4: dove arriva la cometa di Halley
La cometa di Halley torna vicino al Sole ogni $75{,}3$ anni e al perielio passa a $0{,}586\,\text{UA}$ dal Sole. Quanto si allontana dal Sole all'afelio?

La terza legge vale per tutti i corpi che girano attorno al Sole, comete comprese. Dal periodo si ricava il semiasse maggiore:

$$a = \sqrt[3]{T^2} = \sqrt[3]{75{,}3^2} = \sqrt[3]{5670{,}09} = 17{,}83\ldots\,\text{UA}$$

Dalla prima legge, $r_p + r_a = 2a$:

$$r_a = 2a - r_p = 2 \cdot 17{,}83\,\text{UA} - 0{,}586\,\text{UA} = 35{,}07\ldots\,\text{UA} \approx 35{,}1\,\text{UA}$$

All'afelio la cometa è oltre l'orbita di Nettuno, che dista dal Sole $30\,\text{UA}$.
```

```ad-warning
Nella terza legge c'è il semiasse maggiore, non una distanza qualsiasi
$a$ è il semiasse maggiore, cioè la media tra la distanza al perielio e quella all'afelio. Mettere nella formula la distanza al perielio o quella all'afelio dà un periodo sbagliato: per la cometa di Halley, con $0{,}586\,\text{UA}$ al posto di $17{,}8\,\text{UA}$ verrebbero cinque mesi invece di $75$ anni.
```

```ad-warning
Quadrato del periodo, cubo del semiasse
Gli scambi più frequenti sono $T^3 = a^2$ e $T = a$. Un controllo veloce: Giove è a circa $5\,\text{UA}$; con la legge giusta il periodo è $\sqrt{125} \approx 11$ anni, con gli esponenti scambiati verrebbe $\sqrt[3]{25} \approx 3$ anni.
```

### La costante dipende dal corpo centrale

Nel Sistema Internazionale il periodo si misura in secondi e il semiasse in metri. Per la Terra $T = 365{,}25$ giorni $= 3{,}156 \cdot 10^{7}\,\text{s}$ e $a = 1{,}496 \cdot 10^{11}\,\text{m}$, quindi per i corpi che girano attorno al Sole

$$K_S = \frac{T^2}{a^3} = \frac{(3{,}156 \cdot 10^{7}\,\text{s})^2}{(1{,}496 \cdot 10^{11}\,\text{m})^3} = 2{,}975 \cdot 10^{-19}\,\text{s}^2/\text{m}^3$$

La terza legge non vale solo per i pianeti. Vale per i satelliti di Giove scoperti da Galileo, per la Luna e per i satelliti artificiali della Terra: ogni volta che più corpi girano attorno allo stesso corpo centrale, $T^2/a^3$ è lo stesso per tutti. La costante però cambia da un corpo centrale all'altro: quella dei satelliti di Giove non è quella dei pianeti del Sole. Per confrontare due corpi che girano attorno allo stesso centro conviene scrivere la legge come un'uguaglianza di rapporti, in cui la costante non compare:

$$\frac{T_1^2}{a_1^3} = \frac{T_2^2}{a_2^3} \quad\Rightarrow\quad \left(\frac{T_2}{T_1}\right)^2 = \left(\frac{a_2}{a_1}\right)^3$$

```ad-example
Esempio 5: due lune di Giove
Io, la più interna delle quattro lune di Giove scoperte da Galileo, gira attorno a Giove su un'orbita di raggio $4{,}22 \cdot 10^{5}\,\text{km}$ in $1{,}77$ giorni. Europa gira su un'orbita di raggio $6{,}71 \cdot 10^{5}\,\text{km}$. Quanto dura un giro di Europa?

Le due lune girano attorno allo stesso corpo, Giove, su orbite quasi circolari: il semiasse maggiore è il raggio. Dall'uguaglianza dei rapporti:

$$T_2 = T_1 \cdot \sqrt{\left(\frac{a_2}{a_1}\right)^3} = 1{,}77\,\text{d} \cdot \sqrt{\left(\frac{6{,}71 \cdot 10^{5}\,\text{km}}{4{,}22 \cdot 10^{5}\,\text{km}}\right)^3}$$

Il rapporto tra i raggi vale $1{,}590\ldots$, il suo cubo $4{,}020\ldots$ e la radice $2{,}005\ldots$:

$$T_2 = 1{,}77\,\text{d} \cdot 2{,}005 = 3{,}548\ldots\,\text{d} \approx 3{,}55\,\text{d}$$

Il simbolo $\text{d}$ indica il giorno. Raggi e periodi possono restare in kilometri e in giorni, perché compaiono solo in rapporti. Qui non si può usare $T^2 = a^3$ con anni e unità astronomiche: quella forma vale solo attorno al Sole.
```

```ad-warning
Una costante per ogni corpo centrale
$T^2 = a^3$ in anni e unità astronomiche, e il valore $K_S$, valgono solo per i corpi che girano attorno al Sole. Per la Luna e per i satelliti artificiali il centro è la Terra, e la costante è un'altra: non si può confrontare con la terza legge il periodo della Luna con quello di un pianeta.
```

## Che cosa dicono le tre leggi, e che cosa non dicono

| Legge | Che cosa descrive | In formula |
|---|---|---|
| Prima | la forma dell'orbita | ellisse con il Sole in un fuoco; $r_p = a(1-e)$, $r_a = a(1+e)$ |
| Seconda | come cambia la velocità lungo l'orbita | aree uguali in tempi uguali; $v_p\,r_p = v_a\,r_a$ |
| Terza | come il periodo dipende dalla grandezza dell'orbita | $T^2/a^3 = K$ |

Le leggi di Keplero sono leggi empiriche: riassumono le misure, e dicono come si muovono i pianeti senza dire perché. Non spiegano perché le orbite siano ellissi, perché la costante $K$ sia la stessa per tutti i pianeti, né da che cosa dipenda il suo valore. La risposta è la [legge di gravitazione universale](/materiale/scuola-superiore/fisica/la-gravitazione/la-legge-di-gravitazione-universale) di Newton, da cui le tre leggi si ricavano; per le orbite circolari la terza legge si dimostra nella lezione sul [moto dei satelliti](/materiale/scuola-superiore/fisica/la-gravitazione/il-moto-dei-satelliti), dove si vede che $K$ dipende solo dalla massa del corpo centrale.
