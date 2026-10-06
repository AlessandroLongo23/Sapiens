# Gli urti elastici in una e in due dimensioni

Sul tavolo da biliardo la boccia bianca colpisce in pieno una boccia ferma: la bianca si arresta di colpo e l'altra parte con la velocità che aveva la bianca. Nel pendolo di Newton, la fila di sferette d'acciaio appese, una sfera che arriva da un lato ne fa partire una dall'altro. Le bocce e le sfere d'acciaio dopo lo scontro tornano alla forma di prima, senza ammaccature e quasi senza scaldarsi: l'energia cinetica non si perde. Sono urti elastici. Rispetto agli [urti anelastici](/materiale/scuola-superiore/fisica/la-quantita-di-moto/gli-urti-anelastici) c'è un'equazione in più, quella dell'energia cinetica, e lungo una retta le due equazioni insieme permettono di calcolare le velocità finali di tutti e due i corpi.

## Che cos'è un urto elastico

Un urto è **elastico** quando l'energia cinetica totale dei due corpi dopo l'urto è uguale a quella di prima. Come in ogni urto si conserva la quantità di moto totale; qui si conserva anche l'energia cinetica:

$$m_1\vec{v}_1 + m_2\vec{v}_2 = m_1\vec{V}_1 + m_2\vec{V}_2$$

$$\frac{1}{2} m_1 v_1^2 + \frac{1}{2} m_2 v_2^2 = \frac{1}{2} m_1 V_1^2 + \frac{1}{2} m_2 V_2^2$$

con $v_1$ e $v_2$ le velocità prima dell'urto, $V_1$ e $V_2$ quelle dopo. Durante il contatto i corpi si deformano e una parte dell'energia cinetica diventa energia elastica, come in una molla compressa; poi riprendono la loro forma e la restituiscono tutta.

Un urto perfettamente elastico tra oggetti di tutti i giorni è un modello: un po' di energia si perde sempre, e lo si sente dal rumore. Per le bocce da biliardo, le sfere d'acciaio e i carrelli con i respingenti a molla il modello descrive bene quello che si osserva.

## L'urto elastico lungo una retta

Se i due corpi si muovono sulla stessa retta prima e dopo l'urto (un urto **centrale**), le velocità sono numeri con un segno e le due leggi di conservazione formano un sistema di due equazioni nelle incognite $V_1$ e $V_2$:

$$\begin{cases} m_1 v_1 + m_2 v_2 = m_1 V_1 + m_2 V_2 \\ \frac{1}{2} m_1 v_1^2 + \frac{1}{2} m_2 v_2^2 = \frac{1}{2} m_1 V_1^2 + \frac{1}{2} m_2 V_2^2 \end{cases}$$

La seconda equazione è di secondo grado, ma c'è un modo per abbassarla di grado.

### Come si ricavano le velocità finali

In ciascuna equazione portiamo a sinistra i termini con $m_1$ e a destra quelli con $m_2$, e nella seconda moltiplichiamo per 2:

$$m_1 (v_1 - V_1) = m_2 (V_2 - v_2)$$

$$m_1 (v_1^2 - V_1^2) = m_2 (V_2^2 - v_2^2)$$

Nella seconda ci sono due [differenze di quadrati](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli):

$$m_1 (v_1 - V_1)(v_1 + V_1) = m_2 (V_2 - v_2)(V_2 + v_2)$$

Dividiamo questa equazione per la prima, membro a membro. Si può fare perché $v_1 - V_1$ non è zero: se lo fosse, il primo corpo non avrebbe cambiato velocità e non ci sarebbe stato nessun urto. Resta

$$v_1 + V_1 = V_2 + v_2 \quad\Rightarrow\quad v_1 - v_2 = -(V_1 - V_2)$$

La differenza $v_1 - v_2$ è la velocità del primo corpo rispetto al secondo. In un urto elastico centrale la **velocità relativa** dopo l'urto ha lo stesso modulo di prima e il verso opposto: i due corpi si allontanano con la stessa rapidità con cui si avvicinavano.

Ora il sistema è [di primo grado](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite). Dall'ultima equazione $V_2 = v_1 + V_1 - v_2$; sostituendo nella conservazione della quantità di moto,

$$m_1 v_1 + m_2 v_2 = m_1 V_1 + m_2 (v_1 + V_1 - v_2)$$

$$(m_1 + m_2)\,V_1 = (m_1 - m_2)\,v_1 + 2 m_2 v_2$$

e allo stesso modo per $V_2$. Le velocità finali sono

$$V_1 = \frac{(m_1 - m_2)\,v_1 + 2 m_2 v_2}{m_1 + m_2} \qquad V_2 = \frac{(m_2 - m_1)\,v_2 + 2 m_1 v_1}{m_1 + m_2}$$

La seconda formula è la prima con gli indici 1 e 2 scambiati. Le velocità entrano con il loro segno, positivo nel verso dell'asse e negativo nel verso opposto.

```ad-example
Esempio 1: due carrelli che si vengono incontro
Su una rotaia un carrello di $3{,}0\,\text{kg}$ si muove verso destra a $2{,}0\,\text{m/s}$; un carrello di $1{,}0\,\text{kg}$ gli viene incontro a $4{,}0\,\text{m/s}$. L'urto è elastico. Quali sono le velocità dei due carrelli dopo l'urto?

Con l'asse verso destra, $v_1 = 2{,}0\,\text{m/s}$ e $v_2 = -4{,}0\,\text{m/s}$.

$$V_1 = \frac{(3{,}0 - 1{,}0)\,\text{kg} \cdot 2{,}0\,\text{m/s} + 2 \cdot 1{,}0\,\text{kg} \cdot (-4{,}0\,\text{m/s})}{3{,}0\,\text{kg} + 1{,}0\,\text{kg}} = \frac{4{,}0 - 8{,}0}{4{,}0}\,\text{m/s} = -1{,}0\,\text{m/s}$$

$$V_2 = \frac{(1{,}0 - 3{,}0)\,\text{kg} \cdot (-4{,}0\,\text{m/s}) + 2 \cdot 3{,}0\,\text{kg} \cdot 2{,}0\,\text{m/s}}{3{,}0\,\text{kg} + 1{,}0\,\text{kg}} = \frac{8{,}0 + 12}{4{,}0}\,\text{m/s} = 5{,}0\,\text{m/s}$$

```tikz
% nome: urto-elastico-prima-dopo
% alt: Due righe. In alto, prima dell'urto, il carrello 1, grande, ha una velocità verso destra lunga 1 centimetro e il carrello 2, piccolo, una velocità verso sinistra lunga 2 centimetri. In basso, dopo l'urto, il carrello 1 ha una velocità verso sinistra lunga mezzo centimetro e il carrello 2 una velocità verso destra lunga 2,5 centimetri; le frecce sono in scala, mezzo centimetro per ogni metro al secondo
\begin{tikzpicture}
\node[left] at (-0.2,2.55) {\small prima};
\draw[thick] (0,2.2) -- (7.0,2.2);
\foreach \x in {0.15,0.3,...,7.0} \draw[thin] (\x,2.2) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0.8,2.2) rectangle ++(1.2,0.7);
\draw[thick, fill=orange!25] (4.6,2.2) rectangle ++(0.7,0.7);
\node at (1.4,2.55) {\small $1$};
\node at (4.95,2.55) {\small $2$};
\draw[-{Stealth}, thick, blue!60!black] (1.4,3.15) -- (2.4,3.15) node[midway, above] {$\vec{v}_1$};
\draw[-{Stealth}, thick, blue!60!black] (4.95,3.15) -- (2.95,3.15);
\node[above] at (4.2,3.15) {$\vec{v}_2$};
\node[left] at (-0.2,0.35) {\small dopo};
\draw[thick] (0,0) -- (7.0,0);
\foreach \x in {0.15,0.3,...,7.0} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (1.4,0) rectangle ++(1.2,0.7);
\draw[thick, fill=orange!25] (3.4,0) rectangle ++(0.7,0.7);
\node at (2.0,0.35) {\small $1$};
\node at (3.75,0.35) {\small $2$};
\draw[-{Stealth}, thick, blue!60!black] (2.0,0.95) -- (1.5,0.95) node[left] {$\vec{V}_1$};
\draw[-{Stealth}, thick, blue!60!black] (3.75,0.95) -- (6.25,0.95) node[right] {$\vec{V}_2$};
\draw[->] (5.8,-0.6) -- (6.9,-0.6) node[right] {$x$};
\end{tikzpicture}
```

Il carrello pesante torna indietro a $1{,}0\,\text{m/s}$, quello leggero riparte verso destra a $5{,}0\,\text{m/s}$. Tre controlli confermano il risultato.

- Quantità di moto: prima $3{,}0 \cdot 2{,}0 + 1{,}0 \cdot (-4{,}0) = 2{,}0\,\text{kg}\cdot\text{m/s}$, dopo $3{,}0 \cdot (-1{,}0) + 1{,}0 \cdot 5{,}0 = 2{,}0\,\text{kg}\cdot\text{m/s}$.
- Energia cinetica: prima $6{,}0\,\text{J} + 8{,}0\,\text{J} = 14\,\text{J}$, dopo $1{,}5\,\text{J} + 12{,}5\,\text{J} = 14\,\text{J}$.
- Velocità relativa: prima $v_1 - v_2 = 6{,}0\,\text{m/s}$, dopo $V_1 - V_2 = -6{,}0\,\text{m/s}$.
```

```ad-tip
Il controllo più veloce
Per verificare le velocità finali di un urto elastico centrale non serve rifare le energie: controlla che $v_1 - v_2$ e $V_1 - V_2$ siano opposte, e che la quantità di moto totale sia la stessa.
```

```ad-warning
Il segno di una velocità opposta all'asse
Nell'esempio 1, con $v_2 = +4{,}0\,\text{m/s}$ al posto di $-4{,}0\,\text{m/s}$ le formule danno $V_1 = 3{,}0\,\text{m/s}$ e $V_2 = 1{,}0\,\text{m/s}$: la soluzione di un altro problema, quello in cui il carrello leggero insegue quello pesante e lo tampona.
```

## Quando il bersaglio è fermo

Il caso che si incontra più spesso è quello di un corpo in moto, il proiettile, che ne urta uno fermo, il bersaglio. Con $v_2 = 0$ le formule diventano

$$V_1 = \frac{m_1 - m_2}{m_1 + m_2}\,v_1 \qquad V_2 = \frac{2 m_1}{m_1 + m_2}\,v_1$$

Il bersaglio parte sempre in avanti. Il proiettile prosegue in avanti se è più pesante del bersaglio, torna indietro se è più leggero.

```ad-example
Esempio 2: proiettile pesante, proiettile leggero
Un carrello di $2{,}0\,\text{kg}$ a $3{,}0\,\text{m/s}$ urta elasticamente un carrello fermo di $1{,}0\,\text{kg}$. Quali sono le velocità finali? E se le masse sono scambiate?

Con $m_1 = 2{,}0\,\text{kg}$ e $m_2 = 1{,}0\,\text{kg}$:

$$V_1 = \frac{2{,}0 - 1{,}0}{2{,}0 + 1{,}0} \cdot 3{,}0\,\text{m/s} = 1{,}0\,\text{m/s} \qquad V_2 = \frac{2 \cdot 2{,}0}{2{,}0 + 1{,}0} \cdot 3{,}0\,\text{m/s} = 4{,}0\,\text{m/s}$$

Il proiettile rallenta ma continua in avanti; il bersaglio parte più veloce di quanto andava il proiettile.

Con le masse scambiate, $m_1 = 1{,}0\,\text{kg}$ e $m_2 = 2{,}0\,\text{kg}$:

$$V_1 = \frac{1{,}0 - 2{,}0}{1{,}0 + 2{,}0} \cdot 3{,}0\,\text{m/s} = -1{,}0\,\text{m/s} \qquad V_2 = \frac{2 \cdot 1{,}0}{1{,}0 + 2{,}0} \cdot 3{,}0\,\text{m/s} = 2{,}0\,\text{m/s}$$

Il proiettile rimbalza all'indietro. In tutti e due i casi l'energia cinetica finale è quella iniziale: $\tfrac{1}{2} \cdot 2{,}0 \cdot 3{,}0^2 = 9{,}0\,\text{J} = 1{,}0\,\text{J} + 8{,}0\,\text{J}$ nel primo, $4{,}5\,\text{J} = 0{,}5\,\text{J} + 4{,}0\,\text{J}$ nel secondo.
```

### Tre casi particolari

| Masse | Proiettile | Bersaglio |
|---|---|---|
| $m_1 = m_2$ | $V_1 = 0$: si ferma | $V_2 = v_1$: parte con la velocità del proiettile |
| $m_1$ molto più grande di $m_2$ | $V_1 \approx v_1$: prosegue quasi indisturbato | $V_2 \approx 2 v_1$: parte a velocità doppia |
| $m_1$ molto più piccolo di $m_2$ | $V_1 \approx -v_1$: rimbalza con la stessa velocità | $V_2 \approx 0$: resta quasi fermo |

```tikz
% nome: urto-elastico-tre-casi
% alt: Tre righe, ognuna con due riquadri, prima e dopo l'urto contro un bersaglio fermo. Prima riga, masse uguali: prima la sfera 1 ha velocità v 1 e la sfera 2 è ferma; dopo la sfera 1 è ferma e la sfera 2 ha la stessa velocità. Seconda riga, proiettile molto più pesante: dopo l'urto la sfera grande prosegue con quasi la stessa velocità e la sfera piccola parte con una freccia lunga il doppio. Terza riga, proiettile molto più leggero: dopo l'urto la sfera piccola torna indietro con una freccia lunga come quella iniziale e la sfera grande resta ferma
\begin{tikzpicture}
\node at (1.55,5.75) {\small prima};
\node at (5.45,5.75) {\small dopo};
\foreach \y in {4.2,2.1,0} {
\draw[thick] (0,\y) -- (3.1,\y);
\draw[thick] (3.9,\y) -- (7.0,\y);
}
\node[left] at (-0.1,4.45) {\small $m_1 = m_2$};
\draw[thick, fill=blue!10] (0.7,4.45) circle (0.25);
\draw[thick, fill=orange!25] (2.2,4.45) circle (0.25);
\draw[-{Stealth}, thick, blue!60!black] (0.7,4.95) -- (1.6,4.95) node[midway, above] {$\vec{v}_1$};
\draw[thick, fill=blue!10] (4.9,4.45) circle (0.25);
\draw[thick, fill=orange!25] (5.6,4.45) circle (0.25);
\draw[-{Stealth}, thick, blue!60!black] (5.6,4.95) -- (6.5,4.95);
\node[left] at (-0.1,2.6) {\small $m_1 \gg m_2$};
\draw[thick, fill=blue!10] (0.7,2.5) circle (0.4);
\draw[thick, fill=orange!25] (2.2,2.25) circle (0.15);
\draw[-{Stealth}, thick, blue!60!black] (0.7,3.1) -- (1.6,3.1) node[midway, above] {$\vec{v}_1$};
\draw[thick, fill=blue!10] (4.6,2.5) circle (0.4);
\draw[thick, fill=orange!25] (5.2,2.25) circle (0.15);
\draw[-{Stealth}, thick, blue!60!black] (4.6,3.1) -- (5.45,3.1);
\draw[-{Stealth}, thick, blue!60!black] (5.2,2.6) -- (6.95,2.6);
\node[left] at (-0.1,0.5) {\small $m_1 \ll m_2$};
\draw[thick, fill=blue!10] (0.7,0.15) circle (0.15);
\draw[thick, fill=orange!25] (2.4,0.4) circle (0.4);
\draw[-{Stealth}, thick, blue!60!black] (0.7,0.5) -- (1.6,0.5) node[midway, above] {$\vec{v}_1$};
\draw[thick, fill=blue!10] (5.0,0.15) circle (0.15);
\draw[thick, fill=orange!25] (5.6,0.4) circle (0.4);
\draw[-{Stealth}, thick, blue!60!black] (5.0,0.5) -- (4.12,0.5);
\end{tikzpicture}
```

Il primo caso è quello delle bocce da biliardo e del pendolo di Newton: tra masse uguali l'urto elastico centrale scambia le velocità. Il terzo è quello di una palla che rimbalza contro un muro, o contro il pavimento: il muro, con la Terra a cui è fissato, ha una massa enormemente più grande e non si muove, mentre la palla torna indietro con la stessa velocità in modulo. La sua quantità di moto però è cambiata, da $m v_1$ a $-m v_1$: la differenza l'ha presa il muro, che con una massa così grande la porta a una velocità impercettibile.

Nella figura qui sotto un carrello ne urta elasticamente un altro. Cambia le due masse e guarda in che verso riparte il primo carrello.

```interattivo
% nome: urto-elastico-masse
% alt: Due carrelli su una rotaia che si urtano elasticamente. Tre cursori scelgono le due masse, da 0,5 a 4 chilogrammi, e la velocità del secondo carrello, da fermo fino a 2 metri al secondo verso il primo, che parte sempre a 2 metri al secondo; un bottone avvia l'urto. Sopra i carrelli sono disegnate le velocità, prima e dopo. Sotto sono scritte le velocità finali, la quantità di moto totale e l'energia cinetica totale, uguali prima e dopo l'urto
```

Con il secondo carrello fermo, il primo si arresta solo se le masse sono uguali; se è più pesante prosegue, se è più leggero torna indietro, e tanto più velocemente quanto più è leggero. La quantità di moto totale e l'energia cinetica totale scritte sotto la figura non cambiano mai con l'urto.

```ad-warning
Non tutta l'energia passa al bersaglio
Un urto elastico conserva l'energia cinetica totale, non quella di ogni corpo. Il proiettile cede al bersaglio tutta la sua energia solo se le masse sono uguali; nell'esempio 2 gliene cede $8{,}0\,\text{J}$ su $9{,}0$ in un caso e $4{,}0\,\text{J}$ su $4{,}5$ nell'altro.
```

## L'urto elastico nel piano

Se la boccia bianca non colpisce l'altra in pieno ma di striscio, dopo l'urto le due bocce partono in direzioni diverse: l'urto avviene in due dimensioni. La quantità di moto si conserva come vettore, quindi su ciascun asse. Con il bersaglio fermo e l'asse $x$ nella direzione del proiettile, chiamiamo $\theta_1$ e $\theta_2$ gli angoli che le velocità finali formano con l'asse $x$, uno da una parte e uno dall'altra:

$$\begin{cases} m_1 v_1 = m_1 V_1 \cos\theta_1 + m_2 V_2 \cos\theta_2 \\ 0 = m_1 V_1 \sin\theta_1 - m_2 V_2 \sin\theta_2 \\ \frac{1}{2} m_1 v_1^2 = \frac{1}{2} m_1 V_1^2 + \frac{1}{2} m_2 V_2^2 \end{cases}$$

Le [componenti](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore) lungo $y$ hanno segni opposti perché prima dell'urto la quantità di moto lungo $y$ è zero, e deve restare zero. Le equazioni sono tre, le incognite quattro ($V_1$, $V_2$, $\theta_1$, $\theta_2$): le leggi di conservazione da sole non bastano. Il dato che manca dipende da come avviene il contatto, cioè da quanto di striscio il proiettile colpisce il bersaglio, e nei problemi viene dato: di solito è uno dei due angoli.

```tikz
% nome: urto-biliardo-angoli
% alt: Una boccia arriva da sinistra lungo l'asse x con velocità v 1 e colpisce di striscio una boccia ferma nell'origine. Dopo l'urto la prima boccia parte verso l'alto a destra con velocità V 1, che forma l'angolo teta 1 di 30 gradi con l'asse x; la seconda parte verso il basso a destra con velocità V 2, che forma l'angolo teta 2 di 60 gradi con l'asse x. Le frecce sono in scala: v 1 è lunga 2,4 centimetri, V 1 2,08 e V 2 1,2
\begin{tikzpicture}
\draw[thin, dash dot] (-3.6,0) -- (3.2,0) node[right] {$x$};
\draw[thick, fill=blue!10] (-3.2,0) circle (0.2);
\draw[-{Stealth}, thick, blue!60!black] (-3.0,0) -- (-0.6,0) node[midway, above] {$\vec{v}_1$};
\draw[thick, fill=orange!25] (0,0) circle (0.2);
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (1.801,1.04) node[above right] {$\vec{V}_1$};
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (0.6,-1.039) node[below right] {$\vec{V}_2$};
\draw[thin] (0.8,0) arc[start angle=0, end angle=30, radius=0.8];
\node at (1.15,0.28) {\small $\theta_1$};
\draw[thin] (0.5,0) arc[start angle=0, end angle=-60, radius=0.5];
\node at (0.78,-0.35) {\small $\theta_2$};
\end{tikzpicture}
```

### Masse uguali: le direzioni finali sono perpendicolari

Quando le due masse sono uguali e il bersaglio è fermo, c'è una regola che fa da quarta equazione. Dividendo per $m$ la conservazione della quantità di moto e per $\tfrac{1}{2} m$ quella dell'energia cinetica restano

$$\vec{v}_1 = \vec{V}_1 + \vec{V}_2 \qquad v_1^2 = V_1^2 + V_2^2$$

La prima dice che i tre vettori formano un triangolo, con $\vec{v}_1$ somma degli altri due. La seconda dice che in quel triangolo il quadrato di un lato è la somma dei quadrati degli altri due: per l'inverso del [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide) il triangolo è rettangolo, con $\vec{v}_1$ come ipotenusa. Quindi $\vec{V}_1$ e $\vec{V}_2$ sono perpendicolari:

$$\theta_1 + \theta_2 = 90^\circ$$

```tikz
% nome: triangolo-velocita-urto
% alt: Un triangolo rettangolo fatto con tre vettori velocità: l'ipotenusa orizzontale è v 1, lunga 4 centimetri; dal suo primo estremo parte V 1, inclinata di 30 gradi verso l'alto, e dalla punta di V 1 parte V 2, che scende fino alla punta di v 1. Tra V 1 e V 2 c'è il simbolo dell'angolo retto, e tra v 1 e V 1 l'angolo teta 1
\begin{tikzpicture}
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (4,0) node[midway, below] {$\vec{v}_1$};
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (3,1.732) node[midway, above left] {$\vec{V}_1$};
\draw[-{Stealth}, thick, blue!60!black] (3,1.732) -- (4,0) node[midway, right] {$\vec{V}_2$};
\draw[thin] (2.827,1.632) -- (2.927,1.459) -- (3.1,1.559);
\draw[thin] (0.9,0) arc[start angle=0, end angle=30, radius=0.9];
\node at (1.25,0.3) {\small $\theta_1$};
\end{tikzpicture}
```

Dal triangolo si leggono anche i moduli: $V_1$ è il cateto adiacente all'angolo $\theta_1$ e $V_2$ quello opposto, quindi

$$V_1 = v_1 \cos\theta_1 \qquad V_2 = v_1 \sin\theta_1$$

Fa eccezione l'urto in pieno, in cui il proiettile si ferma: $V_1 = 0$ e non c'è nessun angolo da misurare.

```ad-example
Esempio 3: un colpo di striscio al biliardo
La boccia bianca, a $2{,}0\,\text{m/s}$, colpisce una boccia ferma della stessa massa. Dopo l'urto, elastico, la bianca si muove in una direzione che forma un angolo di $30^\circ$ con quella iniziale. In che direzione parte la seconda boccia? Con che velocità si muovono le due bocce?

Le masse sono uguali e il bersaglio è fermo: le direzioni finali sono perpendicolari, e la seconda boccia parte a $\theta_2 = 90^\circ - 30^\circ = 60^\circ$ dalla direzione iniziale, dall'altra parte. Le velocità:

$$V_1 = v_1 \cos\theta_1 = 2{,}0\,\text{m/s} \cdot \cos 30^\circ = 1{,}73\ldots\,\text{m/s} \approx 1{,}7\,\text{m/s}$$

$$V_2 = v_1 \sin\theta_1 = 2{,}0\,\text{m/s} \cdot \sin 30^\circ = 1{,}0\,\text{m/s}$$

È la situazione della figura con i due angoli. Controlliamo la conservazione della quantità di moto, divisa per la massa, sui due assi:

$$V_1 \cos 30^\circ + V_2 \cos 60^\circ = 1{,}73 \cdot 0{,}866 + 1{,}0 \cdot 0{,}500 = 2{,}0\,\text{m/s} = v_1$$

$$V_1 \sin 30^\circ - V_2 \sin 60^\circ = 1{,}73 \cdot 0{,}500 - 1{,}0 \cdot 0{,}866 = 0$$

La somma dei quadrati delle velocità finali è $3{,}0 + 1{,}0 = 4{,}0\,\text{m}^2/\text{s}^2$, uguale a $v_1^2$: l'energia cinetica è la stessa.
```

Nella figura qui sotto decidi quanto di striscio la boccia bianca colpisce quella ferma, e guardi le due direzioni dopo l'urto.

```interattivo
% nome: biliardo-urto-angoli
% alt: Un tavolo da biliardo visto dall'alto: la boccia bianca arriva da sinistra a 2 metri al secondo verso una boccia ferma della stessa massa. Un cursore sposta di lato la traiettoria della bianca, da un urto in pieno a un urto di striscio, e un bottone fa partire il colpo. Dopo l'urto sono disegnate le due velocità e i due angoli con la direzione iniziale; sotto sono scritti gli angoli, la loro somma, sempre 90 gradi, e le due velocità
```

Più il colpo è di striscio, più la bianca devia poco e conserva la sua velocità, mentre la boccia colpita parte piano e quasi di lato. Più il colpo è pieno, più la bianca devia e rallenta. La somma dei due angoli resta $90^\circ$ in ogni caso.

### Masse diverse

Con masse diverse la regola dei $90^\circ$ non vale più, e si lavora con le tre equazioni per componenti. Le stesse equazioni servono a stabilire se un urto di cui si sono misurate le velocità è stato elastico.

```ad-example
Esempio 4: l'urto è stato elastico?
Su un tavolo a cuscino d'aria un disco di $0{,}200\,\text{kg}$ si muove a $3{,}00\,\text{m/s}$ lungo l'asse $x$ e urta un disco fermo di $0{,}300\,\text{kg}$. Dopo l'urto il primo disco si muove lungo l'asse $y$ a $1{,}34\,\text{m/s}$. Qual è la velocità del secondo disco? L'urto è elastico?

Conservazione della quantità di moto sui due assi, con $V_{1x} = 0$ e $V_{1y} = 1{,}34\,\text{m/s}$:

$$m_1 v_1 = m_2 V_{2x} \quad\Rightarrow\quad V_{2x} = \frac{0{,}200\,\text{kg} \cdot 3{,}00\,\text{m/s}}{0{,}300\,\text{kg}} = 2{,}00\,\text{m/s}$$

$$0 = m_1 V_{1y} + m_2 V_{2y} \quad\Rightarrow\quad V_{2y} = -\frac{0{,}200\,\text{kg} \cdot 1{,}34\,\text{m/s}}{0{,}300\,\text{kg}} = -0{,}893\,\text{m/s}$$

Il secondo disco ha velocità

$$V_2 = \sqrt{(2{,}00)^2 + (0{,}893)^2}\,\text{m/s} = 2{,}19\,\text{m/s}$$

e si muove sotto l'asse $x$, a un angolo $\tan^{-1}(0{,}893/2{,}00) \approx 24{,}1^\circ$. Le energie cinetiche:

$$K_i = \frac{1}{2} \cdot 0{,}200\,\text{kg} \cdot (3{,}00\,\text{m/s})^2 = 0{,}900\,\text{J}$$

$$K_f = \frac{1}{2} \cdot 0{,}200\,\text{kg} \cdot (1{,}34\,\text{m/s})^2 + \frac{1}{2} \cdot 0{,}300\,\text{kg} \cdot (2{,}19\,\text{m/s})^2 = 0{,}180\,\text{J} + 0{,}719\,\text{J} = 0{,}899\,\text{J}$$

Entro l'arrotondamento dei dati le due energie coincidono: l'urto è elastico. Le due direzioni finali formano un angolo di $90^\circ + 24{,}1^\circ \approx 114^\circ$, non di $90^\circ$, perché le masse sono diverse.
```

```ad-warning
La regola dei 90 gradi ha tre condizioni
Le direzioni finali sono perpendicolari solo se l'urto è elastico, le masse sono uguali e il bersaglio è fermo. Se manca una delle tre, come nell'esempio 4, l'angolo tra le velocità finali è un altro.
```
