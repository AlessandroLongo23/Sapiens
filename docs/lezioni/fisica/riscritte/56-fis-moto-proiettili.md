# Il moto di un proiettile lanciato in orizzontale

Una pallina che rotola fuori dal bordo di un tavolo non cade in verticale: descrive una curva, e tocca il pavimento a una certa distanza dal tavolo. Lo stesso fa l'acqua che esce da un tubo orizzontale, o un pacco lasciato cadere da un aereo in volo. Un corpo lanciato in orizzontale, che poi si muove soggetto solo al suo peso, si chiama **proiettile**, e il suo moto si capisce spezzandolo in due moti più semplici, uno orizzontale e uno verticale, come nella lezione sulla [composizione dei moti](/materiale/scuola-superiore/fisica/i-moti-nel-piano/la-composizione-dei-moti).

## I due moti del proiettile

Si mette l'origine degli assi ai piedi del tavolo, sotto il punto di lancio, con l'asse $x$ orizzontale nel verso del lancio e l'asse $y$ verticale verso l'alto. Il proiettile parte dall'altezza $h$ con una velocità orizzontale $v_0$, e da quel momento l'unica forza che agisce su di lui è il peso (la resistenza dell'aria si trascura). Il peso è verticale, quindi:

- lungo l'asse $x$ non c'è nessuna forza, e per il [primo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali) la velocità orizzontale resta $v_0$: il moto orizzontale è un [moto rettilineo uniforme](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-rettilineo-uniforme-e-il-grafico-spazio-tempo);
- lungo l'asse $y$ c'è il peso, e il proiettile parte con velocità verticale zero: il moto verticale è una [caduta libera](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-caduta-libera-e-il-lancio-verticale) da ferma, con accelerazione $g$ verso il basso.

I due moti avvengono insieme e non si disturbano. Le leggi orarie sono

$$x = v_0\,t \qquad y = h - \tfrac{1}{2}\,g\,t^2$$

```tikz
% nome: proiettile-orizzontale-due-moti
% alt: Una pallina lanciata in orizzontale dal bordo di un tavolo, fotografata a intervalli di tempo uguali: sei posizioni lungo una curva che scende sempre più ripida fino al pavimento. Sotto, sul pavimento, le ombre della pallina sono equidistanti, perché il moto orizzontale è uniforme; a destra, su una linea verticale, le altezze della pallina sono sempre più distanziate, come quelle di un corpo in caduta libera
% svg: proiettile-orizzontale-due-moti-3cd70c00.svg 286x235
\begin{tikzpicture}
\draw[thick] (-1.3,0) -- (5.3,0);
\foreach \x in {-1.15,-1,...,5.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (-1.2,0) rectangle (0,4.9);
\draw[->] (0,0) -- (0,5.5) node[left] {$y$};
\draw[->] (0,0) -- (5.6,0) node[below] {$x$};
\draw[thin] (4.9,0) -- (4.9,5.2);
\foreach \x/\y in {0/4.9, 0.8/4.704, 1.6/4.116, 2.4/3.136, 3.2/1.764, 4/0} {
  \draw[dashed, thin, gray] (\x,\y) -- (\x,0);
  \draw[dashed, thin, gray] (\x,\y) -- (4.9,\y);
  \draw[fill=white] (\x,0) circle (2pt);
  \draw[fill=white] (4.9,\y) circle (2pt);
  \draw[thick, fill=blue!10] (\x,\y) circle (3pt);
}
\draw[-{Stealth}, thick, blue!60!black] (0,4.9) -- (0.8,4.9) node[above] {$\vec{v}_0$};
\node[left] at (-1.2,4.9) {$h$};
\end{tikzpicture}
```

Nella figura la pallina parte a $2{,}0\,\text{m/s}$ da un'altezza di $1{,}225\,\text{m}$, ed è fotografata ogni $0{,}1\,\text{s}$. Le sue ombre sul pavimento avanzano sempre di $0{,}20\,\text{m}$, come un corpo in moto uniforme; le sue altezze, lette sulla linea di destra, scendono di tratti sempre più lunghi, come quelle di un sasso lasciato cadere. La pallina fa tutte e due le cose insieme.

```ad-example
Esempio 1: due palline che cadono insieme
Nello stesso istante, dal bordo dello stesso tavolo, una pallina viene lasciata cadere da ferma e un'altra viene lanciata in orizzontale. Quale arriva prima sul pavimento?

Arrivano insieme. Il moto verticale delle due palline è lo stesso: partono dalla stessa altezza, con velocità verticale zero, con la stessa accelerazione $g$. La velocità orizzontale della seconda pallina non cambia quanto tempo le serve per scendere: la porta solo più lontano. L'esperimento si fa con due monete sul bordo di un tavolo, una spinta via con un colpo secco e l'altra lasciata scivolare: si sente un solo colpo sul pavimento.
```

```ad-warning
Più veloce non vuol dire più tempo in aria
Il tempo di volo di un proiettile lanciato in orizzontale non dipende da $v_0$, ma solo dall'altezza. Una pallina lanciata più forte arriva più lontano nello stesso tempo. Il dubbio nasce perché la strada percorsa è più lunga; ma la strada in più è tutta orizzontale, e nel moto orizzontale non c'è niente che rallenti la discesa.
```

## Tempo di volo e gittata

Il proiettile tocca terra quando $y = 0$, cioè quando $h = \tfrac{1}{2}\,g\,t^2$. Il **tempo di volo** è

$$t_v = \sqrt{\frac{2\,h}{g}}$$

lo stesso della caduta libera dalla stessa altezza. In quel tempo il proiettile avanza in orizzontale della **gittata**, la distanza tra il piede della verticale del punto di lancio e il punto di arrivo:

$$x_G = v_0\,t_v = v_0\sqrt{\frac{2\,h}{g}}$$

La gittata è proporzionale alla velocità di lancio: con una velocità doppia la pallina arriva al doppio della distanza. Dall'altezza dipende come la radice quadrata: per raddoppiare la gittata con la stessa velocità serve un tavolo quattro volte più alto.

```ad-example
Esempio 2: la pallina che rotola giù dal tavolo
Una pallina rotola su un tavolo alto $0{,}80\,\text{m}$ e ne esce con una velocità orizzontale di $1{,}5\,\text{m/s}$. Dopo quanto tempo tocca il pavimento? A che distanza dal tavolo?

$$t_v = \sqrt{\frac{2\,h}{g}} = \sqrt{\frac{2 \cdot 0{,}80\,\text{m}}{9{,}8\,\text{m/s}^2}} = 0{,}404\ldots\,\text{s} \approx 0{,}40\,\text{s}$$

$$x_G = v_0\,t_v = 1{,}5\,\text{m/s} \cdot 0{,}404\,\text{s} = 0{,}606\ldots\,\text{m} \approx 0{,}61\,\text{m}$$
```

```ad-example
Esempio 3: la velocità del sasso dalla gittata
Un ragazzo lancia un sasso in orizzontale dalla cima di una scogliera alta $20\,\text{m}$, e il sasso cade in mare a $18\,\text{m}$ dalla base della scogliera. Con quale velocità l'ha lanciato?

Il tempo di volo dipende solo dall'altezza:

$$t_v = \sqrt{\frac{2 \cdot 20\,\text{m}}{9{,}8\,\text{m/s}^2}} = 2{,}020\ldots\,\text{s}$$

e nel moto orizzontale uniforme

$$v_0 = \frac{x_G}{t_v} = \frac{18\,\text{m}}{2{,}020\,\text{s}} = 8{,}909\ldots\,\text{m/s} \approx 8{,}9\,\text{m/s}$$
```

```ad-example
Esempio 4: il pacco lasciato cadere dall'aereo
Un aereo vola in orizzontale a $500\,\text{m}$ di quota, alla velocità di $180\,\text{km/h}$, e lascia cadere un pacco di viveri. Quanti metri prima del bersaglio deve sganciarlo?

Il pacco, appena sganciato, ha la velocità dell'aereo: $v_0 = 180 / 3{,}6\,\text{m/s} = 50\,\text{m/s}$, in orizzontale. Il tempo di caduta e la gittata:

$$t_v = \sqrt{\frac{2 \cdot 500\,\text{m}}{9{,}8\,\text{m/s}^2}} = 10{,}10\ldots\,\text{s} \qquad x_G = 50\,\text{m/s} \cdot 10{,}10\,\text{s} = 505\ldots\,\text{m} \approx 5{,}1 \cdot 10^2\,\text{m}$$

Durante la caduta il pacco resta sempre sulla verticale dell'aereo, perché ha la sua stessa velocità orizzontale: il pilota lo vede scendere dritto sotto di sé, e da terra lo si vede descrivere una curva.
```

## La traiettoria è una parabola

Dalla prima legge oraria $t = x / v_0$; messo nella seconda:

$$y = h - \frac{g}{2\,v_0^2}\,x^2$$

L'altezza è una funzione di secondo grado della distanza orizzontale: la traiettoria è un arco di [parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola), con il vertice nel punto di lancio e la concavità verso il basso. Più $v_0$ è grande, più la parabola è larga.

```ad-warning
L'altezza che scende in proporzione
L'altezza non cala dello stesso tratto a ogni tratto orizzontale: cala come il quadrato della distanza. Nella figura dei due moti la pallina avanza sempre di $0{,}20\,\text{m}$, ma nel primo decimo di secondo scende di $0{,}05\,\text{m}$ e nell'ultimo di $0{,}44\,\text{m}$. Per questo la traiettoria è curva e non una retta obliqua dal tavolo al punto di arrivo.
```

## La velocità durante il volo

La velocità del proiettile ha due componenti. Quella orizzontale non cambia mai; quella verticale cresce come nella caduta libera, verso il basso:

$$v_x = v_0 \qquad v_y = -g\,t$$

La velocità è la loro somma vettoriale, sempre tangente alla traiettoria, e il suo modulo si trova con il teorema di Pitagora, come per ogni [vettore scomposto](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore):

$$v = \sqrt{v_x^2 + v_y^2}$$

All'arrivo, dopo il tempo di volo, la componente verticale vale $|v_y| = g\,t_v = \sqrt{2\,g\,h}$, come per un sasso lasciato cadere da $h$, e quindi $v = \sqrt{v_0^2 + 2\,g\,h}$.

```tikz
% nome: proiettile-velocita-componenti
% alt: La traiettoria parabolica di un proiettile lanciato in orizzontale, con la velocità disegnata in tre punti: alla partenza è orizzontale; a metà del volo e all'arrivo ha la stessa componente orizzontale, tratteggiata, e una componente verticale verso il basso, tratteggiata, che all'arrivo è il doppio che a metà. La velocità, somma delle due, è tangente alla traiettoria e sempre più inclinata
% svg: proiettile-velocita-componenti-7a218174.svg 204x276
\begin{tikzpicture}
\draw[thin, gray] plot[domain=0:4, samples=40, smooth] (\x, {4.9-0.30625*\x*\x});
\draw[-{Stealth}, thick, blue!60!black] (0,4.9) -- (0.6,4.9) node[above] {$\vec{v}_0$};
\draw[-{Stealth}, thick, blue!60!black, dashed] (2,3.675) -- (2.6,3.675) node[right] {$\vec{v}_x$};
\draw[-{Stealth}, thick, blue!60!black, dashed] (2,3.675) -- (2,2.94) node[left] {$\vec{v}_y$};
\draw[-{Stealth}, thick, blue!60!black] (2,3.675) -- (2.6,2.94) node[right] {$\vec{v}$};
\draw[-{Stealth}, thick, blue!60!black, dashed] (4,0) -- (4.6,0) node[above right] {$\vec{v}_x$};
\draw[-{Stealth}, thick, blue!60!black, dashed] (4,0) -- (4,-1.47) node[left] {$\vec{v}_y$};
\draw[-{Stealth}, thick, blue!60!black] (4,0) -- (4.6,-1.47) node[right] {$\vec{v}$};
\draw[thick, fill=blue!10] (0,4.9) circle (3pt);
\draw[thick, fill=blue!10] (2,3.675) circle (3pt);
\draw[thick, fill=blue!10] (4,0) circle (3pt);
\end{tikzpicture}
```

L'angolo $\beta$ che la velocità forma con l'orizzontale, sotto l'orizzontale, ha la tangente uguale al rapporto tra le due componenti:

$$\tan\beta = \frac{|v_y|}{v_x}$$

```ad-example
Esempio 5: la pallina che arriva sul pavimento
Con quale velocità tocca il pavimento la pallina dell'esempio 2 ($h = 0{,}80\,\text{m}$, $v_0 = 1{,}5\,\text{m/s}$)?

All'arrivo, dopo $t_v = 0{,}404\,\text{s}$, la componente verticale ha il modulo

$$|v_y| = g\,t_v = 9{,}8\,\text{m/s}^2 \cdot 0{,}404\,\text{s} = 3{,}959\ldots\,\text{m/s}$$

e la velocità

$$v = \sqrt{(1{,}5\,\text{m/s})^2 + (3{,}96\,\text{m/s})^2} = 4{,}234\ldots\,\text{m/s} \approx 4{,}2\,\text{m/s}$$

La pallina arriva inclinata di $\beta = \tan^{-1}(3{,}96 / 1{,}5) \approx 69^\circ$ sotto l'orizzontale.
```

```ad-warning
Le componenti non si sommano come numeri
La velocità all'arrivo non è $v_0 + |v_y|$: nell'esempio 5 sarebbe $1{,}5 + 4{,}0 = 5{,}5\,\text{m/s}$, invece di $4{,}2\,\text{m/s}$. Le due componenti sono perpendicolari, e il modulo della somma si trova con il teorema di Pitagora.
```

Nella figura qui sotto cambi la velocità di lancio e fai partire la pallina dal tavolo. La traiettoria si traccia mentre la pallina vola; sul pavimento e sulla linea verticale a destra si muovono le sue ombre, che fanno i due moti separati. Con qualunque velocità la pallina impiega lo stesso tempo ad arrivare, e la gittata cresce in proporzione alla velocità.

```interattivo
% nome: proiettile-tavolo-gittata
% alt: Una pallina lanciata in orizzontale dal bordo di un tavolo alto 1,2 metri, con un cursore per la velocità di lancio da 0,5 a 4 metri al secondo. Un bottone fa partire la pallina: la traiettoria si traccia, un punto sul pavimento si muove di moto uniforme sotto la pallina e un punto sulla linea verticale a destra cade come in caduta libera alla sua stessa altezza. Le traiettorie dei lanci precedenti restano disegnate, e sotto sono scritti il tempo, le due coordinate, la gittata e il tempo di volo
```

Il lancio in una direzione qualunque, verso l'alto e in avanti, è il [lancio obliquo](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/il-lancio-obliquo-e-la-gittata), che si studia al terzo anno con lo stesso metodo: due moti indipendenti, uno uniforme in orizzontale e uno uniformemente accelerato in verticale.
