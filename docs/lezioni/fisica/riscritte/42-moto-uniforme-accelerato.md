# Il moto uniformemente accelerato

Uno scooter parte al verde del semaforo e ogni secondo guadagna la stessa velocità; un'auto frena davanti a un ostacolo e ogni secondo perde la stessa velocità; un sasso lasciato cadere scende sempre più veloce, sempre allo stesso ritmo. Sono tutti moti in cui l'accelerazione non cambia. Con due leggi, una per la velocità e una per la posizione, si calcola dove si trova il corpo e quanto va veloce in ogni istante, e con una terza si trova lo spazio che serve per frenare.

## Accelerazione costante

Un **moto rettilineo uniformemente accelerato** è un moto lungo una retta con l'[accelerazione](/materiale/scuola-superiore/fisica/il-moto-rettilineo/l-accelerazione) costante: in intervalli di tempo uguali la velocità cambia di quantità uguali. Se lo scooter ha $a = 2{,}5\,\text{m/s}^2$, la sua velocità cresce di $2{,}5\,\text{m/s}$ ogni secondo: $0$, $2{,}5$, $5{,}0$, $7{,}5\,\text{m/s}$ e così via.

Come nel [moto rettilineo uniforme](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-rettilineo-uniforme-e-il-grafico-spazio-tempo), si fissa un asse lungo la traiettoria, con un'origine e un verso, e si fa partire il cronometro all'istante iniziale, $t = 0$. In quell'istante il corpo è nella posizione $s_0$ e ha la velocità $v_0$. Posizione, velocità e accelerazione hanno un segno: sono positive se puntano nel verso dell'asse, negative se puntano nel verso opposto.

```tikz
% nome: scooter-posizioni-ogni-secondo
% alt: Uno scooter parte da fermo con accelerazione 2,5 metri al secondo quadrato: le sue posizioni lungo la strada dopo 0, 1, 2 e 3 secondi sono a 0; 1,25; 5 e 11,25 metri dalla partenza, sempre più distanti tra loro; sopra ogni posizione la freccia della velocità, lunga 0, 2,5, 5 e 7,5 metri al secondo, cresce ogni volta della stessa quantità
% svg: scooter-posizioni-ogni-secondo-c664dffc.svg 277x71
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (6,0);
\foreach \x in {-0.15,0,...,6} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\foreach \x/\t in {0/0,0.5625/1,2.25/2,5.0625/3} {
  \fill[blue!60!black] (\x,0.25) circle (2pt);
  \node[below] at (\x,-0.2) {\small $\t$ s};
  \draw[thin] (\x,0.5) -- (\x,0.8);
}
\draw[-{Stealth}, thick, blue!60!black] (0.5625,0.25) -- (0.8125,0.25);
\draw[-{Stealth}, thick, blue!60!black] (2.25,0.25) -- (2.75,0.25);
\draw[-{Stealth}, thick, blue!60!black] (5.0625,0.25) -- (5.8125,0.25) node[above] {$\vec{v}$};
\draw[thin, <->] (0,0.65) -- (0.5625,0.65);
\node[left] at (0,0.65) {\small $1{,}25$ m};
\draw[thin, <->] (0.5625,0.65) -- (2.25,0.65) node[midway, above] {\small $3{,}75$ m};
\draw[thin, <->] (2.25,0.65) -- (5.0625,0.65) node[midway, above] {\small $6{,}25$ m};
\end{tikzpicture}
```

La velocità cresce in modo regolare, ma lo spazio percorso in ogni secondo no: $1{,}25\,\text{m}$ nel primo secondo, $3{,}75\,\text{m}$ nel secondo, $6{,}25\,\text{m}$ nel terzo. Gli spazi stanno tra loro come i numeri dispari $1$, $3$, $5$: è la regola che Galileo trovò facendo rotolare delle sfere lungo un piano inclinato.

## La legge della velocità

Se l'accelerazione è costante, la velocità cambia di $a$ ogni secondo, e in un tempo $t$ cambia di $a\,t$. Partendo da $v_0$:

$$v = v_0 + a\,t$$

È una legge lineare: il grafico della velocità in funzione del tempo è una retta, con pendenza $a$, che taglia l'asse delle velocità in $v_0$. Il [grafico velocità-tempo](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-grafico-velocita-tempo) ha una lezione tutta sua. Dalla stessa legge si ricavano le formule inverse:

$$a = \frac{v - v_0}{t} \qquad t = \frac{v - v_0}{a}$$

```ad-example
Esempio 1: lo scooter che parte
Uno scooter parte da fermo al semaforo e raggiunge $54\,\text{km/h}$ in $6{,}0\,\text{s}$, con accelerazione costante. Quanto vale l'accelerazione? Che velocità ha dopo $4{,}0\,\text{s}$?

Prima la velocità in metri al secondo: $54\,\text{km/h} = \dfrac{54}{3{,}6}\,\text{m/s} = 15\,\text{m/s}$. Lo scooter parte da fermo, quindi $v_0 = 0$:

$$a = \frac{v - v_0}{t} = \frac{15\,\text{m/s} - 0}{6{,}0\,\text{s}} = 2{,}5\,\text{m/s}^2$$

Dopo $4{,}0\,\text{s}$:

$$v = v_0 + a\,t = 0 + 2{,}5\,\text{m/s}^2 \cdot 4{,}0\,\text{s} = 10\,\text{m/s}$$
```

```ad-warning
I chilometri all'ora con i secondi
In $v = v_0 + a\,t$ le unità devono andare d'accordo: con $a$ in $\text{m/s}^2$ e $t$ in secondi, le velocità vanno in $\text{m/s}$. Chi divide $54\,\text{km/h}$ per $6{,}0\,\text{s}$ senza convertire trova $9{,}0$, un numero che non è un'accelerazione in $\text{m/s}^2$. Prima si divide per $3{,}6$.
```

## La legge oraria

Per la posizione serve un'idea in più. Nel moto uniformemente accelerato la velocità cresce in modo uniforme, e la velocità media in un intervallo è la media aritmetica tra la velocità iniziale e quella finale:

$$v_m = \frac{v_0 + v}{2}$$

Nel moto uniforme lo spostamento è la velocità per il tempo; qui è la velocità media per il tempo. Sul grafico velocità-tempo lo spostamento è l'area del trapezio sotto la retta, uguale all'area del rettangolo alto $v_m$.

```tikz
% nome: velocita-media-trapezio
% alt: Grafico velocità-tempo di un treno che accelera da 12 a 22 metri al secondo in 20 secondi: la velocità è una retta che sale; l'area sotto la retta è un trapezio colorato, e una linea tratteggiata orizzontale alla velocità media di 17 metri al secondo taglia dal trapezio un triangolo in alto a destra uguale a quello che manca in basso a sinistra, così il trapezio ha la stessa area del rettangolo alto 17
% svg: velocita-media-trapezio-5d3dd82d.svg 233x249
% poi-interattivo: spostare la velocità iniziale e quella finale e vedere che il trapezio ha sempre l'area del rettangolo alto quanto la loro media
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin] (0,0) grid (5.5,5.4);
\fill[blue!15] (0,0) -- (0,2.4) -- (5,4.4) -- (5,0) -- cycle;
\draw[->] (0,0) -- (6,0);
\node[below] at (5.8,-0.45) {$t$ (s)};
\draw[->] (0,0) -- (0,5.8) node[above] {$v$ (m/s)};
\foreach \x/\t in {1/4,2/8,3/12,4/16,5/20} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/5,2/10,3/15,4/20,5/25} \node[left] at (0,\y) {\small $\t$};
\draw[dashed, thin] (0,3.4) -- (5,3.4);
\draw[dashed, thin] (5,0) -- (5,4.4);
\draw[thick, blue!60!black] (0,2.4) -- (5,4.4);
\fill (0,2.4) circle (0.06);
\fill (5,4.4) circle (0.06);
\node[above left] at (0,2.4) {\small $v_0$};
\node[above] at (5,4.4) {\small $v$};
\node[right] at (5,3.4) {\small $v_m$};
\node at (2.5,1.3) {$\Delta s$};
\end{tikzpicture}
```

Con $v = v_0 + a\,t$, la velocità media diventa $v_m = \dfrac{v_0 + v_0 + a\,t}{2} = v_0 + \tfrac{1}{2}a\,t$, e lo spostamento è

$$\Delta s = v_m \cdot t = v_0\,t + \tfrac{1}{2}a\,t^2$$

Aggiungendo la posizione iniziale si ottiene la **legge oraria** del moto uniformemente accelerato:

$$s = s_0 + v_0\,t + \tfrac{1}{2}a\,t^2$$

Il termine $v_0\,t$ è lo spazio che il corpo farebbe se andasse sempre a $v_0$; il termine $\tfrac{1}{2}a\,t^2$ è quello che aggiunge l'accelerazione, o toglie se $a$ è negativa.

```ad-example
Esempio 2: il treno che accelera
Un treno viaggia a $12\,\text{m/s}$ e accelera con $a = 0{,}50\,\text{m/s}^2$ per $20\,\text{s}$. Che velocità raggiunge? Quanta strada fa in quei $20\,\text{s}$?

$$v = v_0 + a\,t = 12\,\text{m/s} + 0{,}50\,\text{m/s}^2 \cdot 20\,\text{s} = 22\,\text{m/s}$$

$$\Delta s = v_0\,t + \tfrac{1}{2}a\,t^2 = 12\,\text{m/s} \cdot 20\,\text{s} + \tfrac{1}{2} \cdot 0{,}50\,\text{m/s}^2 \cdot (20\,\text{s})^2 = 240\,\text{m} + 100\,\text{m} = 340\,\text{m}$$

Controllo con la velocità media: $v_m = (12 + 22)/2\,\text{m/s} = 17\,\text{m/s}$, e $17\,\text{m/s} \cdot 20\,\text{s} = 340\,\text{m}$. È il grafico della figura qui sopra.
```

```ad-warning
Il mezzo e il quadrato
Nel termine $\tfrac{1}{2}a\,t^2$ il quadrato è solo sul tempo, e il mezzo non si perde. Nell'esempio 2, chi scrive $a\,t^2$ trova $200\,\text{m}$ invece di $100\,\text{m}$; chi scrive $\tfrac{1}{2}a\,t$ trova $5\,\text{m}$, che non è nemmeno una lunghezza: $\text{m/s}^2 \cdot \text{s} = \text{m/s}$. Il controllo delle unità scopre il secondo errore.
```

## Partenza da fermo

Quando il corpo parte da fermo dall'origine, $v_0 = 0$ e $s_0 = 0$, le due leggi diventano

$$v = a\,t \qquad s = \tfrac{1}{2}a\,t^2$$

La velocità è direttamente proporzionale al tempo, la posizione al quadrato del tempo: è la [proporzionalità quadratica](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-inversa-e-quadratica), e il grafico spazio-tempo è un arco di [parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola) con il vertice nell'origine. In un tempo doppio il corpo percorre uno spazio quattro volte più grande.

```tikz
% nome: grafico-spazio-tempo-scooter
% alt: Grafico spazio-tempo dello scooter che parte da fermo con accelerazione 2,5 metri al secondo quadrato: i punti a 1, 2, 3, 4, 5 e 6 secondi, a 1,25; 5; 11,25; 20; 31,25 e 45 metri, stanno su un arco di parabola che parte orizzontale dall'origine e diventa sempre più ripido
% svg: grafico-spazio-tempo-scooter-1c2889cc.svg 254x233
% poi-interattivo: trascinare un punto lungo la curva e leggere il tempo, la posizione e il rapporto tra la posizione e il quadrato del tempo, sempre 1,25 metri al secondo quadrato
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin] (0,0) grid (6.4,4.9);
\draw[->] (0,0) -- (6.8,0);
\node[below] at (6.6,-0.45) {$t$ (s)};
\draw[->] (0,0) -- (0,5.3) node[above] {$s$ (m)};
\foreach \x in {1,2,3,4,5,6} \node[below] at (\x,0) {\small $\x$};
\foreach \y/\t in {1/10,2/20,3/30,4/40} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60!black, domain=0:6.2, samples=60, smooth] plot (\x, {0.125*\x*\x});
\foreach \x/\y in {1/0.125,2/0.5,3/1.125,4/2,5/3.125,6/4.5} \fill (\x,\y) circle (0.06);
\end{tikzpicture}
```

Dalla legge oraria si ricava il tempo che serve per percorrere uno spazio $s$, partendo da fermi:

$$t = \sqrt{\frac{2s}{a}}$$

```ad-example
Esempio 3: la biglia sul piano inclinato
Una biglia parte da ferma su un piano inclinato e scende con $a = 0{,}80\,\text{m/s}^2$. In quanto tempo percorre $1{,}6\,\text{m}$? Che velocità ha in quel momento?

$$t = \sqrt{\frac{2s}{a}} = \sqrt{\frac{2 \cdot 1{,}6\,\text{m}}{0{,}80\,\text{m/s}^2}} = \sqrt{4{,}0\,\text{s}^2} = 2{,}0\,\text{s}$$

$$v = a\,t = 0{,}80\,\text{m/s}^2 \cdot 2{,}0\,\text{s} = 1{,}6\,\text{m/s}$$

In un tempo doppio, $4{,}0\,\text{s}$, la biglia percorrerebbe $4 \cdot 1{,}6\,\text{m} = 6{,}4\,\text{m}$, se il piano fosse abbastanza lungo.
```

## La relazione senza il tempo

A volte il tempo non è dato e non è chiesto: si conoscono le velocità e lo spazio. Dalla legge della velocità $t = \dfrac{v - v_0}{a}$, e lo spostamento è la velocità media per il tempo:

$$\Delta s = \frac{v_0 + v}{2} \cdot \frac{v - v_0}{a} = \frac{v^2 - v_0^2}{2a}$$

Il prodotto $(v + v_0)(v - v_0)$ è una differenza di quadrati. Moltiplicando per $2a$ si ottiene la relazione tra velocità e spostamento, senza il tempo:

$$v^2 = v_0^2 + 2a\,\Delta s$$

```ad-example
Esempio 4: la pista di decollo
Un aereo parte da fermo sulla pista con un'accelerazione costante di $2{,}5\,\text{m/s}^2$ e decolla quando raggiunge $75\,\text{m/s}$. Quanto deve essere lunga, almeno, la pista?

Con $v_0 = 0$ la relazione diventa $v^2 = 2a\,\Delta s$:

$$\Delta s = \frac{v^2}{2a} = \frac{(75\,\text{m/s})^2}{2 \cdot 2{,}5\,\text{m/s}^2} = \frac{5625\,\text{m}^2/\text{s}^2}{5{,}0\,\text{m/s}^2} = 1125\,\text{m} \approx 1{,}1 \cdot 10^3\,\text{m}$$

Il tempo non serviva, ma si trova lo stesso: $t = v/a = 75 / 2{,}5\,\text{s} = 30\,\text{s}$.
```

```ad-warning
La radice alla fine
Per trovare la velocità dalla relazione senza il tempo si calcola prima $v_0^2 + 2a\,\Delta s$ e poi se ne fa la radice: $v = \sqrt{v_0^2 + 2a\,\Delta s}$. La radice di una somma non è la somma delle radici: con $v_0 = 3{,}0\,\text{m/s}$ e $2a\,\Delta s = 16\,\text{m}^2/\text{s}^2$ la velocità è $\sqrt{9{,}0 + 16}\,\text{m/s} = 5{,}0\,\text{m/s}$, non $3{,}0 + 4{,}0 = 7{,}0\,\text{m/s}$.
```

## La frenata

Un'auto che frena rallenta: la sua accelerazione ha il verso opposto alla velocità. Con l'asse nel verso del moto la velocità è positiva e l'accelerazione negativa. Le leggi sono le stesse, con $a < 0$, e valgono fino a quando l'auto si ferma: da lì in poi i freni la tengono ferma, non la spingono indietro.

L'auto si ferma quando $v = 0$. Il **tempo di frenata** viene dalla legge della velocità, $0 = v_0 + a\,t$, e lo **spazio di frenata** dalla relazione senza il tempo, $0 = v_0^2 + 2a\,\Delta s$. Scritti con il modulo dell'accelerazione, $|a|$, sono

$$t_f = \frac{v_0}{|a|} \qquad d_f = \frac{v_0^2}{2\,|a|}$$

Lo spazio di frenata è proporzionale al quadrato della velocità: a velocità doppia l'auto ha bisogno di uno spazio quattro volte più lungo per fermarsi.

```ad-example
Esempio 5: una frenata
Un'auto viaggia a $72\,\text{km/h}$ e frena con un'accelerazione di modulo $5{,}0\,\text{m/s}^2$. In quanto tempo si ferma? Quanta strada fa mentre frena?

$72\,\text{km/h} = 72/3{,}6\,\text{m/s} = 20\,\text{m/s}$. Con l'asse nel verso del moto, $a = -5{,}0\,\text{m/s}^2$:

$$t_f = \frac{v_0}{|a|} = \frac{20\,\text{m/s}}{5{,}0\,\text{m/s}^2} = 4{,}0\,\text{s} \qquad d_f = \frac{v_0^2}{2\,|a|} = \frac{(20\,\text{m/s})^2}{2 \cdot 5{,}0\,\text{m/s}^2} = 40\,\text{m}$$

Controllo con la legge oraria: $\Delta s = 20 \cdot 4{,}0 - \tfrac{1}{2} \cdot 5{,}0 \cdot 4{,}0^2 = 80 - 40 = 40\,\text{m}$.
```

```ad-warning
Il segno dell'accelerazione in frenata
Se nella legge oraria l'accelerazione di una frenata si scrive positiva, l'auto dell'esempio 5 dopo $4{,}0\,\text{s}$ avrebbe fatto $80 + 40 = 120\,\text{m}$ e andrebbe a $40\,\text{m/s}$: più veloce di prima. Quando il corpo rallenta, velocità e accelerazione hanno segni opposti.
```

```ad-note
Accelerazione negativa non vuol dire sempre rallentare
Il segno di $a$ dice il verso dell'accelerazione rispetto all'asse, non se il corpo rallenta. Un corpo che si muove nel verso negativo, con $v < 0$, e ha $a < 0$ va sempre più veloce: velocità e accelerazione hanno lo stesso verso. Il corpo rallenta quando $v$ e $a$ hanno segni opposti, accelera quando hanno lo stesso segno. È la regola della lezione sull'[accelerazione](/materiale/scuola-superiore/fisica/il-moto-rettilineo/l-accelerazione).
```

## Lo spazio di arresto

Chi guida non comincia a frenare nel momento in cui vede l'ostacolo: passa un **tempo di reazione**, di circa un secondo (da verificare: dipende dalla persona e dall'attenzione), in cui l'auto continua alla stessa velocità. Lo **spazio di arresto** è la somma dello spazio percorso in quel tempo, a velocità costante, e dello spazio di frenata:

$$d = v_0\,t_r + \frac{v_0^2}{2\,|a|}$$

```tikz
% nome: spazio-arresto-grafico
% alt: Grafico velocità-tempo di un'auto a 20 metri al secondo che si ferma: per il primo secondo, il tempo di reazione, la velocità resta 20 metri al secondo e l'area sotto il grafico è un rettangolo colorato di 20 metri; poi la velocità scende in linea retta fino a zero a 5 secondi, e l'area sotto è un triangolo di 40 metri, lo spazio di frenata
% svg: spazio-arresto-grafico-acd168b8.svg 233x220
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin] (0,0) grid (5.5,4.5);
\fill[orange!25] (0,0) rectangle (1,4);
\fill[blue!15] (1,0) -- (1,4) -- (5,0) -- cycle;
\draw[->] (0,0) -- (6,0);
\node[below] at (5.8,-0.45) {$t$ (s)};
\draw[->] (0,0) -- (0,4.9) node[above] {$v$ (m/s)};
\foreach \x in {1,2,3,4,5} \node[below] at (\x,0) {\small $\x$};
\foreach \y/\t in {1/5,2/10,3/15,4/20} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60!black] (0,4) -- (1,4) -- (5,0);
\node at (0.5,1.4) {\small $20$ m};
\node at (2.3,1.4) {\small $40$ m};
\node[above right] at (1,4) {\small inizio frenata};
\end{tikzpicture}
```

```ad-example
Esempio 6: a velocità doppia
Con un tempo di reazione di $1{,}0\,\text{s}$ e una frenata di modulo $5{,}0\,\text{m/s}^2$, quanto vale lo spazio di arresto a $36\,\text{km/h}$? E a $72\,\text{km/h}$?

A $36\,\text{km/h} = 10\,\text{m/s}$:

$$d = 10\,\text{m/s} \cdot 1{,}0\,\text{s} + \frac{(10\,\text{m/s})^2}{2 \cdot 5{,}0\,\text{m/s}^2} = 10\,\text{m} + 10\,\text{m} = 20\,\text{m}$$

A $72\,\text{km/h} = 20\,\text{m/s}$, la situazione del grafico qui sopra:

$$d = 20\,\text{m/s} \cdot 1{,}0\,\text{s} + \frac{(20\,\text{m/s})^2}{2 \cdot 5{,}0\,\text{m/s}^2} = 20\,\text{m} + 40\,\text{m} = 60\,\text{m}$$

La velocità è raddoppiata, lo spazio di reazione è raddoppiato e quello di frenata è diventato quattro volte più grande: lo spazio di arresto è triplicato.
```

```ad-warning
Lo spazio di arresto non è proporzionale alla velocità
Chi va al doppio della velocità non ha bisogno del doppio dello spazio per fermarsi, ma di più: lo spazio di frenata va con il quadrato della velocità. Per lo stesso motivo lo spazio di arresto non si trova con la proporzione "se a $36\,\text{km/h}$ servono $20\,\text{m}$, a $72\,\text{km/h}$ ne servono $40$".
```

Nella figura qui sotto scegli la velocità iniziale e l'accelerazione di un'auto e la fai partire: accanto alla strada si disegnano il grafico velocità-tempo, con l'area colorata che è lo spazio percorso, e il grafico spazio-tempo, un arco di parabola. Con l'accelerazione negativa l'auto frena e si ferma.

```interattivo
% nome: auto-accelerata-grafici
% alt: Un'auto su una strada, con due cursori per la velocità iniziale, da 0 a 20 metri al secondo, e per l'accelerazione, da meno 5 a più 3 metri al secondo quadrato, e un bottone che la fa partire. Accanto si tracciano, istante per istante, il grafico velocità-tempo, una retta con l'area sotto colorata, e il grafico spazio-tempo, un arco di parabola; sotto sono scritti il tempo, la velocità e la posizione. Con l'accelerazione negativa l'auto rallenta e si ferma, e da lì la velocità resta zero
```
