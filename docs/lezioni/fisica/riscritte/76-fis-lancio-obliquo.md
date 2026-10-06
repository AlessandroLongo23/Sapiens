# Il lancio obliquo e la gittata

Un pallone calciato da terra, il getto di una fontana, un peso lanciato da un'atleta: tutti partono con una velocità inclinata verso l'alto, salgono, raggiungono un punto più alto e ricadono. È il **lancio obliquo**. Nel biennio hai studiato il caso in cui la velocità iniziale è orizzontale, nella lezione sul [moto di un proiettile lanciato in orizzontale](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/il-moto-di-un-proiettile-lanciato-in-orizzontale); il metodo è lo stesso, due moti indipendenti che avvengono insieme, con una novità: adesso anche il moto verticale parte con una velocità.

## Le componenti della velocità iniziale

Il corpo parte con una velocità $\vec{v}_0$ che forma un angolo $\alpha$ con l'orizzontale, l'**angolo di lancio**. Si mette l'origine degli assi nel punto di lancio, l'asse $x$ orizzontale nel verso del lancio e l'asse $y$ verticale verso l'alto, e si scompone la velocità iniziale come ogni vettore, con [seno e coseno](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore):

$$v_{0x} = v_0\cos\alpha \qquad v_{0y} = v_0\sin\alpha$$

```tikz
% nome: lancio-obliquo-componenti-velocita
% alt: La velocità iniziale v zero di un corpo lanciato dall'origine degli assi, inclinata di un angolo alfa sull'asse x. Le sue componenti tratteggiate sono v zero x, lungo l'asse orizzontale, e v zero y, lungo l'asse verticale
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (4,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,3) node[above] {$y$};
\draw[dashed, thin] (2.6,2) -- (2.6,0);
\draw[dashed, thin] (2.6,2) -- (0,2);
\draw[-{Stealth}, thick, blue!60!black, dashed] (0,0) -- (2.6,0);
\node[below] at (1.3,-0.08) {$v_{0x} = v_0\cos\alpha$};
\draw[-{Stealth}, thick, blue!60!black, dashed] (0,0) -- (0,2);
\node[left] at (0,1) {$v_{0y} = v_0\sin\alpha$};
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (2.6,2) node[above right] {$\vec{v}_0$};
\draw (0.7,0) arc[start angle=0, end angle=37.6, radius=0.7];
\node at (0.95,0.3) {\small $\alpha$};
\draw[thick, fill=blue!10] (0,0) circle (3pt);
\end{tikzpicture}
```

Dopo il lancio l'unica forza sul corpo è il peso (la resistenza dell'aria si trascura), che è verticale. Per questo le due componenti hanno destini diversi: quella orizzontale non cambia più, quella verticale cambia come in un [lancio verticale](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-caduta-libera-e-il-lancio-verticale) verso l'alto.

## Le leggi del moto

Lungo $x$ non agisce nessuna forza e il moto è rettilineo uniforme con velocità $v_{0x}$. Lungo $y$ agisce il peso e il moto è [uniformemente accelerato](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato), con velocità iniziale $v_{0y}$ e accelerazione $-g$, perché l'asse punta verso l'alto e la gravità verso il basso. Le posizioni e le velocità all'istante $t$ sono

$$x = v_{0x}\,t \qquad y = v_{0y}\,t - \tfrac{1}{2}\,g\,t^2$$

$$v_x = v_{0x} \qquad v_y = v_{0y} - g\,t$$

La componente $v_y$ parte positiva, diminuisce di $9{,}8\,\text{m/s}$ ogni secondo, si annulla nel punto più alto e poi diventa negativa: il corpo scende. La velocità $\vec{v}$ è in ogni istante la somma vettoriale delle due componenti, è tangente alla traiettoria e ha modulo $v = \sqrt{v_x^2 + v_y^2}$.

```ad-example
Esempio 1: il pallone un secondo dopo il calcio
Un pallone viene calciato da terra con una velocità di $20\,\text{m/s}$, inclinata di $35^\circ$. Dove si trova dopo $1{,}0\,\text{s}$, e con quale velocità si muove?

Le componenti della velocità iniziale:

$$v_{0x} = v_0\cos\alpha = 20\,\text{m/s} \cdot \cos 35^\circ = 16{,}38\ldots\,\text{m/s} \qquad v_{0y} = v_0\sin\alpha = 20\,\text{m/s} \cdot \sin 35^\circ = 11{,}47\ldots\,\text{m/s}$$

La posizione dopo $1{,}0\,\text{s}$:

$$x = v_{0x}\,t = 16{,}38\,\text{m/s} \cdot 1{,}0\,\text{s} \approx 16\,\text{m}$$

$$y = v_{0y}\,t - \tfrac{1}{2}\,g\,t^2 = 11{,}47\,\text{m/s} \cdot 1{,}0\,\text{s} - \tfrac{1}{2} \cdot 9{,}8\,\text{m/s}^2 \cdot (1{,}0\,\text{s})^2 = 6{,}57\,\text{m} \approx 6{,}6\,\text{m}$$

La velocità: $v_x = 16{,}38\,\text{m/s}$ come all'inizio, e $v_y = 11{,}47\,\text{m/s} - 9{,}8\,\text{m/s}^2 \cdot 1{,}0\,\text{s} = 1{,}67\,\text{m/s}$. Il pallone sta ancora salendo, ma ormai quasi in orizzontale:

$$v = \sqrt{v_x^2 + v_y^2} = \sqrt{(16{,}38\,\text{m/s})^2 + (1{,}67\,\text{m/s})^2} = 16{,}46\ldots\,\text{m/s} \approx 16\,\text{m/s}$$
```

```ad-warning
Seno e coseno scambiati
Con l'angolo misurato dall'orizzontale il coseno va con la componente orizzontale e il seno con quella verticale. Se il testo dà l'angolo rispetto alla verticale, l'angolo di lancio $\alpha$ è il complementare, $90^\circ$ meno quello dato. Un controllo veloce: per un lancio poco inclinato $v_{0x}$ deve essere la componente più grande.
```

## La traiettoria è una parabola

Dalla legge del moto orizzontale si ricava il tempo, $t = \dfrac{x}{v_0\cos\alpha}$, e lo si sostituisce in quella del moto verticale:

$$y = v_0\sin\alpha \cdot \frac{x}{v_0\cos\alpha} - \frac{1}{2}\,g\,\frac{x^2}{v_0^2\cos^2\alpha}$$

Il rapporto tra seno e coseno è la tangente, e resta l'**equazione della traiettoria**:

$$y = x\tan\alpha - \frac{g}{2\,v_0^2\cos^2\alpha}\,x^2$$

È un'equazione del tipo $y = b\,x + a\,x^2$ con $a$ negativo: una [parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola) che passa per l'origine, con la concavità verso il basso. Il vertice è il punto più alto del volo, e la parabola è simmetrica rispetto alla verticale che passa per il vertice: la discesa è l'immagine speculare della salita.

```tikz
% nome: lancio-obliquo-traiettoria-velocita
% alt: La traiettoria parabolica del pallone dell'esempio 1, dall'origine fino al punto di ricaduta a 38 metri, con il vertice a 6,7 metri di altezza. La velocità è disegnata in tre punti con le sue componenti tratteggiate: alla partenza è inclinata verso l'alto, nel vertice è orizzontale, all'arrivo è inclinata verso il basso dello stesso angolo. La componente orizzontale è uguale nei tre punti. Sotto la traiettoria è segnata la gittata L, e al centro l'altezza massima
% poi-interattivo: trascinare un punto lungo la traiettoria e leggere le due componenti della velocità
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (9.2,0) node[above] {$x$};
\draw[->] (0,-0.3) -- (0,2.3) node[above] {$y$};
\draw[thick, gray] plot[domain=0:7.671, samples=50, smooth] (\x, {0.7002*\x-0.09128*\x*\x});
\draw[dashed, thin] (3.836,0) -- (3.836,1.343);
\node[right] at (3.836,0.55) {$h_{max}$};
\draw[-{Stealth}, thick, blue!60!black, dashed] (0,0) -- (1.311,0);
\draw[-{Stealth}, thick, blue!60!black, dashed] (0,0) -- (0,0.918);
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (1.311,0.918) node[above] {$\vec{v}_0$};
\draw[-{Stealth}, thick, blue!60!black] (3.836,1.343) -- (5.147,1.343) node[above] {$\vec{v}$};
\draw[-{Stealth}, thick, blue!60!black, dashed] (7.671,0) -- (8.982,0);
\draw[-{Stealth}, thick, blue!60!black, dashed] (7.671,0) -- (7.671,-0.918);
\draw[-{Stealth}, thick, blue!60!black] (7.671,0) -- (8.982,-0.918) node[below] {$\vec{v}$};
\draw[thick, fill=blue!10] (0,0) circle (3pt);
\draw[thick, fill=blue!10] (3.836,1.343) circle (3pt);
\draw[thick, fill=blue!10] (7.671,0) circle (3pt);
\draw[thin] (0,-1.1) -- (7.671,-1.1);
\draw[thin] (0,-1.0) -- (0,-1.2);
\draw[thin] (7.671,-1.0) -- (7.671,-1.2);
\node[below] at (3.836,-1.1) {$L$};
\end{tikzpicture}
```

## Il punto più alto

Nel vertice della parabola il corpo ha smesso di salire e non ha ancora cominciato a scendere: la componente verticale della velocità è zero. Da $v_y = v_{0y} - g\,t = 0$ si trova il **tempo di salita**

$$t_s = \frac{v_{0y}}{g} = \frac{v_0\sin\alpha}{g}$$

e, mettendo questo tempo nella legge di $y$, l'**altezza massima**:

$$h_{max} = v_{0y}\,t_s - \tfrac{1}{2}\,g\,t_s^2 = \frac{v_{0y}^2}{g} - \frac{v_{0y}^2}{2\,g} = \frac{v_{0y}^2}{2\,g} = \frac{v_0^2\sin^2\alpha}{2\,g}$$

È la stessa altezza che raggiungerebbe un corpo lanciato in verticale con velocità $v_{0y}$: il moto orizzontale non la cambia.

```ad-warning
Nel punto più alto la velocità non è zero
Si annulla solo la componente verticale. Il corpo continua ad avanzare con la velocità orizzontale $v_{0x}$, che è la più piccola di tutto il volo. La velocità sarebbe zero in cima solo in un lancio verticale, con $\alpha = 90^\circ$. Anche l'accelerazione nel punto più alto non è zero: è sempre $g$, verso il basso.
```

## Il tempo di volo e la gittata

Se il corpo ricade alla stessa quota da cui è partito, tocca terra quando $y$ torna a zero:

$$v_{0y}\,t - \tfrac{1}{2}\,g\,t^2 = 0 \qquad\Rightarrow\qquad t\left(v_{0y} - \tfrac{1}{2}\,g\,t\right) = 0$$

La soluzione $t = 0$ è l'istante del lancio; l'altra è il **tempo di volo**:

$$t_v = \frac{2\,v_{0y}}{g} = \frac{2\,v_0\sin\alpha}{g}$$

Il tempo di volo è il doppio del tempo di salita: il corpo impiega a scendere quanto ha impiegato a salire. Come nel lancio orizzontale, il tempo in aria dipende solo dal moto verticale.

La **gittata** $L$ è la distanza orizzontale tra il punto di lancio e il punto di ricaduta, cioè lo spazio percorso lungo $x$ nel tempo di volo:

$$L = v_{0x}\,t_v = \frac{2\,v_{0x}\,v_{0y}}{g} = \frac{2\,v_0^2\sin\alpha\cos\alpha}{g}$$

Il prodotto $2\sin\alpha\cos\alpha$ è uguale al seno dell'angolo doppio, $\sin 2\alpha$ (lo dimostrerai in goniometria, al quarto anno). La gittata si può quindi scrivere in una forma più corta, comoda con la calcolatrice:

$$L = \frac{v_0^2\sin 2\alpha}{g}$$

Per $\alpha = 35^\circ$, per esempio, si calcola $\sin 70^\circ$.

```ad-example
Esempio 2: altezza massima, tempo di volo e gittata del pallone
Per il pallone dell'esempio 1 ($v_0 = 20\,\text{m/s}$, $\alpha = 35^\circ$) trova l'altezza massima, il tempo di volo e la gittata.

Dall'esempio 1, $v_{0x} = 16{,}38\,\text{m/s}$ e $v_{0y} = 11{,}47\,\text{m/s}$.

$$h_{max} = \frac{v_{0y}^2}{2\,g} = \frac{(11{,}47\,\text{m/s})^2}{2 \cdot 9{,}8\,\text{m/s}^2} = 6{,}71\ldots\,\text{m} \approx 6{,}7\,\text{m}$$

$$t_v = \frac{2\,v_{0y}}{g} = \frac{2 \cdot 11{,}47\,\text{m/s}}{9{,}8\,\text{m/s}^2} = 2{,}34\ldots\,\text{s} \approx 2{,}3\,\text{s}$$

$$L = v_{0x}\,t_v = 16{,}38\,\text{m/s} \cdot 2{,}34\,\text{s} = 38{,}3\ldots\,\text{m} \approx 38\,\text{m}$$

Con la formula compatta si arriva allo stesso numero: $L = \dfrac{(20\,\text{m/s})^2 \cdot \sin 70^\circ}{9{,}8\,\text{m/s}^2} = 38{,}35\ldots\,\text{m} \approx 38\,\text{m}$. È la traiettoria della figura precedente.
```

```ad-warning
Seno di due alfa non è due volte il seno di alfa
$\sin 2\alpha$ è il seno dell'angolo doppio, non il doppio del seno: $\sin 70^\circ = 0{,}940$, mentre $2\sin 35^\circ = 1{,}147$, che non può nemmeno essere un seno perché supera $1$. Sulla calcolatrice raddoppia prima l'angolo e poi premi il tasto del seno.
```

## L'angolo di 45 gradi

Con la stessa velocità iniziale, la gittata cambia con l'angolo di lancio. Per trovare l'angolo migliore conviene la forma $L = 2\,v_{0x}\,v_{0y}/g$. Le due componenti non sono libere: per il teorema di Pitagora $v_{0x}^2 + v_{0y}^2 = v_0^2$, e dal quadrato di un binomio

$$2\,v_{0x}\,v_{0y} = v_{0x}^2 + v_{0y}^2 - (v_{0x} - v_{0y})^2 = v_0^2 - (v_{0x} - v_{0y})^2$$

Il secondo membro è il più grande possibile quando il quadrato che si sottrae è zero, cioè quando $v_{0x} = v_{0y}$: le due componenti sono uguali se la velocità è inclinata di $45^\circ$. A parità di velocità iniziale la **gittata massima** si ha per $\alpha = 45^\circ$, e vale

$$L_{max} = \frac{v_0^2}{g}$$

Con la formula compatta si vede la stessa cosa: $\sin 2\alpha$ vale al massimo $1$, quando $2\alpha = 90^\circ$.

Un lancio più teso di $45^\circ$ ha molta velocità orizzontale ma resta in aria poco; uno più alto resta in aria a lungo ma avanza piano. Le due cose si compensano esattamente per due **angoli complementari**, come $30^\circ$ e $60^\circ$: passando da un angolo all'altro $v_{0x}$ e $v_{0y}$ si scambiano, e il loro prodotto, quindi la gittata, non cambia.

```tikz
% nome: gittata-angoli-complementari
% alt: Cinque traiettorie paraboliche con la stessa velocità iniziale di 20 metri al secondo e angoli di lancio di 15, 30, 45, 60 e 75 gradi. Quella a 45 gradi arriva più lontano, a 41 metri. Quelle a 30 e a 60 gradi ricadono nello stesso punto, a 35 metri, e quelle a 15 e a 75 gradi nello stesso punto, a 20 metri; le traiettorie con l'angolo più grande salgono più in alto
% poi-interattivo: scegliere l'angolo e vedere la traiettoria e la sua complementare
\begin{tikzpicture}
\draw[gray!25, very thin, step=0.83333] (0,0) grid (7.5,3.3334);
\draw[->] (-0.3,0) -- (7.9,0) node[right] {$x$ (m)};
\draw[->] (0,-0.3) -- (0,3.7) node[above] {$y$ (m)};
\foreach \x/\t in {1.6667/10, 3.3333/20, 5/30, 6.6667/40} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\t$};
\foreach \y/\t in {1.6667/10, 3.3333/20} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\t$};
\draw[thick, blue!60!black] plot[domain=0:3.401, samples=40, smooth] (\x, {0.26795*\x-0.078777*\x*\x});
\draw[thick, blue!60!black] plot[domain=0:3.401, samples=40, smooth] (\x, {3.73205*\x-1.097223*\x*\x});
\draw[thick, green!50!black] plot[domain=0:5.891, samples=40, smooth] (\x, {0.57735*\x-0.098*\x*\x});
\draw[thick, green!50!black] plot[domain=0:5.891, samples=40, smooth] (\x, {1.73205*\x-0.294*\x*\x});
\draw[thick, orange!90!black] plot[domain=0:6.803, samples=40, smooth] (\x, {\x-0.147*\x*\x});
\node[above] at (1.7,3.17) {\small $75^\circ$};
\node[above] at (2.95,2.55) {\small $60^\circ$};
\node[above] at (3.9,1.67) {\small $45^\circ$};
\node at (4.3,1.0) {\small $30^\circ$};
\node at (2.6,0.42) {\small $15^\circ$};
\end{tikzpicture}
```

Nella figura qui sotto scegli l'angolo e la velocità, lanci la palla e confronti le traiettorie, che restano disegnate. Passando da $30^\circ$ a $60^\circ$ con la stessa velocità la palla sale tre volte più in alto e resta in aria più a lungo, ma ricade nello stesso punto; la gittata più lunga la ottieni a $45^\circ$, e raddoppiando la velocità la gittata diventa quattro volte più grande, perché dipende da $v_0^2$.

```interattivo
% nome: lancio-obliquo-angolo-gittata
% alt: Una palla lanciata da terra con un cursore per l'angolo di lancio, da 15 a 75 gradi, e uno per la velocità iniziale, da 7 a 14 metri al secondo. Alla partenza è disegnata la velocità iniziale con le sue componenti tratteggiate. Un bottone lancia la palla: la traiettoria parabolica si traccia sopra un suolo graduato in metri, e le traiettorie dei lanci precedenti restano disegnate con il loro angolo. Sotto la figura sono scritti le componenti della velocità, il tempo di volo, l'altezza massima e la gittata
```

Per la simmetria della parabola il corpo torna a terra con la stessa velocità in modulo con cui è partito, $v = v_0$, inclinata dello stesso angolo $\alpha$ ma sotto l'orizzontale: $v_x$ è rimasta $v_{0x}$, e $v_y$ dopo il tempo di volo vale $v_{0y} - g\,t_v = -v_{0y}$.

```ad-example
Esempio 3: la velocità del getto d'acqua
Il getto di un tubo da giardino, tenuto a livello del terreno e inclinato di $30^\circ$, ricade a $6{,}0\,\text{m}$ di distanza. Con quale velocità esce l'acqua? Con quale altro angolo il getto arriverebbe nello stesso punto?

Dalla formula della gittata si ricava la velocità:

$$L = \frac{v_0^2\sin 2\alpha}{g} \quad\Rightarrow\quad v_0 = \sqrt{\frac{g\,L}{\sin 2\alpha}} = \sqrt{\frac{9{,}8\,\text{m/s}^2 \cdot 6{,}0\,\text{m}}{\sin 60^\circ}} = \sqrt{67{,}89\ldots\,\text{m}^2/\text{s}^2} = 8{,}23\ldots\,\text{m/s} \approx 8{,}2\,\text{m/s}$$

Lo stesso punto si raggiunge con l'angolo complementare, $90^\circ - 30^\circ = 60^\circ$. Le due traiettorie sono però diverse: a $30^\circ$ l'acqua sale fino a $h_{max} = (8{,}24 \cdot \sin 30^\circ)^2 / (2 \cdot 9{,}8)\,\text{m} = 0{,}87\,\text{m}$, a $60^\circ$ fino a $2{,}6\,\text{m}$.
```

```ad-example
Esempio 4: il calcio di punizione
Un calciatore batte una punizione da $20\,\text{m}$ dalla porta: il pallone parte da terra a $18\,\text{m/s}$, inclinato di $25^\circ$. La barriera è a $9{,}15\,\text{m}$ e arriva a $1{,}9\,\text{m}$ di altezza; la traversa è a $2{,}44\,\text{m}$. Il pallone supera la barriera? Entra in porta sotto la traversa?

Serve l'altezza del pallone a due distanze note: è il lavoro dell'equazione della traiettoria. Il coefficiente di $x^2$ vale

$$\frac{g}{2\,v_0^2\cos^2\alpha} = \frac{9{,}8\,\text{m/s}^2}{2 \cdot (18\,\text{m/s})^2 \cdot \cos^2 25^\circ} = 0{,}01841\ldots\,\text{m}^{-1}$$

e $\tan 25^\circ = 0{,}4663\ldots$ Alla barriera, $x = 9{,}15\,\text{m}$:

$$y = 9{,}15\,\text{m} \cdot 0{,}4663 - 0{,}01841\,\text{m}^{-1} \cdot (9{,}15\,\text{m})^2 = 4{,}27\,\text{m} - 1{,}54\,\text{m} \approx 2{,}7\,\text{m}$$

Il pallone passa $0{,}8\,\text{m}$ sopra la barriera. Sulla linea di porta, $x = 20\,\text{m}$:

$$y = 20\,\text{m} \cdot 0{,}4663 - 0{,}01841\,\text{m}^{-1} \cdot (20\,\text{m})^2 = 9{,}33\,\text{m} - 7{,}36\,\text{m} \approx 2{,}0\,\text{m}$$

Il pallone è in fase di discesa ed entra in porta, circa mezzo metro sotto la traversa.

```tikz
% nome: punizione-barriera-porta
% alt: La traiettoria parabolica di un pallone calciato da terra: passa a 2,7 metri di altezza sopra la barriera, disegnata come un segmento verticale alto 1,9 metri a 9,15 metri dal pallone, e arriva sulla linea di porta, a 20 metri, a 2,0 metri di altezza, sotto la traversa che è a 2,44 metri
\begin{tikzpicture}
\draw[thick] (-0.4,0) -- (7.4,0);
\foreach \x in {-0.25,-0.1,...,7.4} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, blue!60!black] plot[domain=0:6.667, samples=40, smooth] (\x, {0.4663*\x-0.05523*\x*\x});
\draw[very thick] (3.05,0) -- (3.05,0.633);
\draw[very thick] (6.667,0) -- (6.667,0.813) -- (7.1,0.813);
\draw[dashed, thin] (3.05,0.633) -- (3.05,0.908);
\node[above] at (3.05,0.95) {\small $2{,}7$ m};
\node[below] at (3.05,-0.15) {\small $9{,}15$ m};
\node[below] at (6.667,-0.15) {\small $20$ m};
\node[left] at (6.6,0.45) {\small $2{,}0$ m};
\draw[thick, fill=blue!10] (0,0.06) circle (2.5pt);
\draw[thick, fill=blue!10] (3.05,0.908) circle (2.5pt);
\draw[thick, fill=blue!10] (6.667,0.654) circle (2.5pt);
\end{tikzpicture}
```
```

## Il lancio da una quota

Spesso il corpo non ricade alla quota di partenza: un peso lasciato dalla mano dell'atleta a due metri da terra, un sasso lanciato da un balcone. Se il punto di lancio è a un'altezza $h$ sopra il suolo e l'origine resta ai piedi della verticale di lancio, cambia solo la legge di $y$, che parte da $h$:

$$x = v_{0x}\,t \qquad y = h + v_{0y}\,t - \tfrac{1}{2}\,g\,t^2$$

Il corpo tocca il suolo quando $y = 0$, e il tempo di volo si trova risolvendo un'[equazione di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado) in $t$:

$$\tfrac{1}{2}\,g\,t^2 - v_{0y}\,t - h = 0 \qquad\Rightarrow\qquad t_v = \frac{v_{0y} + \sqrt{v_{0y}^2 + 2\,g\,h}}{g}$$

Delle due soluzioni vale quella con il segno più davanti alla radice; l'altra è negativa, un istante precedente al lancio. La gittata è ancora $L = v_{0x}\,t_v$. L'altezza massima sopra il punto di lancio resta $v_{0y}^2 / (2\,g)$, quindi sopra il suolo è $h + v_{0y}^2 / (2\,g)$.

Le stesse leggi valgono per un lancio verso il basso, con $\alpha$ sotto l'orizzontale: basta prendere $v_{0y}$ negativa. E con $\alpha = 0^\circ$ si ritrova il lancio orizzontale del biennio: $v_{0y} = 0$ e $t_v = \sqrt{2\,h/g}$.

```ad-warning
Le formule della gittata valgono solo alla stessa quota
$L = v_0^2\sin 2\alpha / g$ e $t_v = 2\,v_{0y}/g$ sono state ricavate imponendo che il corpo torni all'altezza di partenza. In un lancio da una quota il volo dura di più e il corpo arriva più lontano: si riparte dalle leggi del moto. Anche l'angolo migliore non è più $45^\circ$, ma un po' meno.
```

```ad-example
Esempio 5: il sasso lanciato dal balcone
Da un balcone a $12\,\text{m}$ dal suolo un sasso viene lanciato a $15\,\text{m/s}$ verso l'alto, con un angolo di $30^\circ$ sull'orizzontale. Dopo quanto tempo tocca il suolo, a che distanza dalla base del palazzo e con quale velocità?

```tikz
% nome: lancio-obliquo-da-quota
% alt: Un palazzo alto 12 metri sulla sinistra; dal suo bordo superiore parte un sasso con velocità v zero inclinata di 30 gradi verso l'alto. La traiettoria parabolica sale di poco, poi scende fino al suolo, che raggiunge a 33 metri dalla base del palazzo. Sono segnate l'altezza h del palazzo e la gittata L sul suolo
\begin{tikzpicture}
\draw[thick] (-1.5,0) -- (7.3,0);
\foreach \x in {-1.35,-1.2,...,7.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (-1.2,0) rectangle (0,2.4);
\draw[thick, gray] plot[domain=0:6.514, samples=40, smooth] (\x, {2.4+0.57735*\x-0.14519*\x*\x});
\draw[dashed, thin] (0,2.4) -- (1.4,2.4);
\draw[-{Stealth}, thick, blue!60!black] (0,2.4) -- (1.039,3.0) node[above] {$\vec{v}_0$};
\draw (0.7,2.4) arc[start angle=0, end angle=30, radius=0.7];
\node at (1.1,2.62) {\small $30^\circ$};
\draw[thick, fill=blue!10] (0,2.4) circle (3pt);
\draw[thick, fill=blue!10] (6.514,0.1) circle (3pt);
\node at (-0.6,1.2) {$h$};
\draw[thin] (0,-0.5) -- (6.514,-0.5);
\draw[thin] (0,-0.4) -- (0,-0.6);
\draw[thin] (6.514,-0.4) -- (6.514,-0.6);
\node[below] at (3.257,-0.5) {$L$};
\end{tikzpicture}
```

Le componenti della velocità iniziale:

$$v_{0x} = 15\,\text{m/s} \cdot \cos 30^\circ = 12{,}99\ldots\,\text{m/s} \qquad v_{0y} = 15\,\text{m/s} \cdot \sin 30^\circ = 7{,}5\,\text{m/s}$$

Il tempo di volo:

$$t_v = \frac{v_{0y} + \sqrt{v_{0y}^2 + 2\,g\,h}}{g} = \frac{7{,}5\,\text{m/s} + \sqrt{(7{,}5\,\text{m/s})^2 + 2 \cdot 9{,}8\,\text{m/s}^2 \cdot 12\,\text{m}}}{9{,}8\,\text{m/s}^2} = \frac{7{,}5 + 17{,}07}{9{,}8}\,\text{s} = 2{,}507\ldots\,\text{s} \approx 2{,}5\,\text{s}$$

La gittata:

$$L = v_{0x}\,t_v = 12{,}99\,\text{m/s} \cdot 2{,}507\,\text{s} = 32{,}5\ldots\,\text{m} \approx 33\,\text{m}$$

All'arrivo $v_x = 12{,}99\,\text{m/s}$ e $v_y = v_{0y} - g\,t_v = 7{,}5\,\text{m/s} - 9{,}8\,\text{m/s}^2 \cdot 2{,}507\,\text{s} = -17{,}07\,\text{m/s}$:

$$v = \sqrt{(12{,}99\,\text{m/s})^2 + (17{,}07\,\text{m/s})^2} = 21{,}45\ldots\,\text{m/s} \approx 21\,\text{m/s}$$

Il sasso arriva più veloce di come è partito, perché è sceso di $12\,\text{m}$. Lo stesso numero si trova con la [conservazione dell'energia meccanica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-conservazione-dell-energia-meccanica), senza passare dal tempo: $v = \sqrt{v_0^2 + 2\,g\,h} = \sqrt{225 + 235{,}2}\,\text{m/s} = 21\,\text{m/s}$. Con la formula della gittata alla stessa quota si troverebbero solo $20\,\text{m}$.
```

## Riepilogo delle formule

Per un lancio con velocità $v_0$ e angolo $\alpha$ che ricade alla quota di partenza:

| Grandezza | Formula |
|---|---|
| Componenti della velocità iniziale | $v_{0x} = v_0\cos\alpha$, $v_{0y} = v_0\sin\alpha$ |
| Tempo di salita | $t_s = \dfrac{v_{0y}}{g}$ |
| Altezza massima | $h_{max} = \dfrac{v_{0y}^2}{2\,g}$ |
| Tempo di volo | $t_v = \dfrac{2\,v_{0y}}{g}$ |
| Gittata | $L = \dfrac{2\,v_{0x}\,v_{0y}}{g} = \dfrac{v_0^2\sin 2\alpha}{g}$ |
| Gittata massima ($\alpha = 45^\circ$) | $L_{max} = \dfrac{v_0^2}{g}$ |

Tutte queste formule trascurano la resistenza dell'aria. Per un peso da atletica o un sasso l'errore è piccolo; per un pallone da calcio, una pallina da tennis o un volano l'aria conta, la gittata vera è più corta e la traiettoria non è più una parabola simmetrica.
