# La caduta libera e il lancio verticale

Un sasso lasciato cadere da un ponte parte da fermo e scende sempre più veloce; una palla lanciata verso l'alto rallenta, si ferma per un istante e torna giù. Se l'aria non frena in modo apprezzabile, tutti e due i moti sono uniformemente accelerati, con la stessa accelerazione diretta verso il basso, uguale per tutti i corpi: l'accelerazione di gravità. Le leggi sono quelle del [moto uniformemente accelerato](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato), con un'accelerazione che si conosce già.

## Tutti i corpi cadono allo stesso modo

Una piuma cade più lentamente di un sasso, e per duemila anni si è pensato, con Aristotele, che i corpi più pesanti cadessero più in fretta. Galileo Galilei sostenne il contrario: nei "Discorsi e dimostrazioni matematiche intorno a due nuove scienze" (1638) scrisse che, tolta la resistenza del mezzo, tutti i corpi cadono con lo stesso moto, e studiò questo moto facendo rotolare delle sfere su piani inclinati, dove la caduta è più lenta e si può misurare. Il racconto di Vincenzo Viviani, suo allievo, di pesi di materiali diversi lasciati cadere dalla torre di Pisa è famoso, ma gli storici dubitano che l'esperimento sia andato così (da verificare).

La differenza tra la piuma e il sasso la fa l'aria. Lo mostra il **tubo di Newton**: un tubo di vetro chiuso con dentro una piuma e una moneta. Con l'aria, capovolgendo il tubo, la moneta arriva in fondo molto prima della piuma; se con una pompa si toglie l'aria, piuma e moneta cadono insieme e arrivano insieme. Sulla Luna, che non ha atmosfera, l'astronauta David Scott ripeté la prova il 2 agosto 1971, durante la missione Apollo 15, con un martello e una piuma: toccarono il suolo nello stesso istante.

```tikz
% nome: tubo-di-newton
% alt: Due tubi di vetro verticali, uguali, ciascuno con una moneta e una piuma lasciate cadere dall'alto nello stesso istante. Nel tubo di sinistra, pieno d'aria, la moneta è già in fondo e la piuma è ancora in alto; nel tubo di destra, da cui è stata tolta l'aria, la moneta e la piuma sono alla stessa altezza, a metà del tubo
% svg: tubo-di-newton-08037d84.svg 154x176
\begin{tikzpicture}
\draw[thick, fill=blue!5] (0,0) rectangle (0.9,4);
\draw[thick, fill=white] (2.4,0) rectangle (3.3,4);
\draw[thick, fill=gray!30] (0.2,0.12) rectangle (0.7,0.24);
\draw[thin, fill=yellow!20, rotate around={25:(0.45,3.2)}] (0.45,3.2) ellipse (0.3 and 0.09);
\draw[thin, rotate around={25:(0.45,3.2)}] (0.1,3.2) -- (0.8,3.2);
\draw[thick, fill=gray!30] (2.5,1.9) rectangle (2.75,2.02);
\draw[thin, fill=yellow!20, rotate around={25:(3.02,1.96)}] (3.02,1.96) ellipse (0.2 and 0.07);
\draw[thin, rotate around={25:(3.02,1.96)}] (2.8,1.96) -- (3.24,1.96);
\node[below] at (0.45,-0.1) {\small con l'aria};
\node[below] at (2.85,-0.1) {\small senza aria};
\end{tikzpicture}
```

## L'accelerazione di gravità

Nel vuoto, e con buona approssimazione nell'aria per corpi compatti e non troppo veloci, un corpo lasciato libero cade con un moto uniformemente accelerato. La sua accelerazione è l'**accelerazione di gravità** $g$, diretta verso il basso, e vicino alla superficie terrestre vale

$$g = 9{,}8\,\text{m/s}^2$$

È lo stesso numero che nella lezione sulla [forza-peso](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa) compare come $9{,}8\,\text{N/kg}$: le due unità sono equivalenti, perché $1\,\text{N} = 1\,\text{kg} \cdot \text{m/s}^2$. Il valore cambia un poco da un posto all'altro della Terra (circa $9{,}78\,\text{m/s}^2$ all'equatore e $9{,}83\,\text{m/s}^2$ ai poli), e molto su altri corpi celesti: sulla Luna è circa $1{,}6\,\text{m/s}^2$.

Un corpo che si muove solo sotto l'effetto del suo peso, senza che l'aria lo freni, è in **caduta libera**: lo è il sasso lasciato cadere, ma anche la palla lanciata verso l'alto, mentre sale e mentre scende.

## Un asse verso l'alto

Il moto è lungo una retta verticale. In questa lezione si usa sempre la stessa convenzione:

- l'asse è verticale e rivolto verso l'alto, e la posizione si chiama $y$ (è la $s$ delle lezioni precedenti); l'origine si mette al suolo, o nel punto di lancio, e si dice ogni volta;
- una velocità verso l'alto è positiva, una verso il basso è negativa;
- l'accelerazione punta sempre verso il basso: vale $a = -g = -9{,}8\,\text{m/s}^2$, che il corpo salga, scenda o sia fermo in cima.

Con questa scelta le leggi del moto uniformemente accelerato diventano

$$v = v_0 - g\,t \qquad y = y_0 + v_0\,t - \tfrac{1}{2}g\,t^2 \qquad v^2 = v_0^2 - 2g\,(y - y_0)$$

dove $g = 9{,}8\,\text{m/s}^2$ è un numero positivo e il segno meno dice che l'accelerazione punta verso il basso.

```ad-note
L'asse verso il basso
Molti libri, per un corpo che cade soltanto, prendono l'asse verso il basso con l'origine nel punto di partenza: allora velocità e accelerazione sono positive e si scrive $h = \tfrac{1}{2}g\,t^2$, $v = g\,t$. È corretto, e i numeri sono gli stessi. Quello che non si fa è cambiare convenzione a metà di un problema: con un asse verso l'alto l'accelerazione è $-g$ anche quando il corpo scende.
```

## La caduta da ferma

Un corpo lasciato cadere da fermo da un'altezza $h$ ha $y_0 = h$ e $v_0 = 0$:

$$y = h - \tfrac{1}{2}g\,t^2 \qquad v = -g\,t$$

La velocità è negativa perché punta verso il basso, e il suo modulo cresce di $9{,}8\,\text{m/s}$ ogni secondo. Dopo un tempo $t$ il corpo è sceso di $\tfrac{1}{2}g\,t^2$: $4{,}9\,\text{m}$ nel primo secondo, $19{,}6\,\text{m}$ in due secondi, $44{,}1\,\text{m}$ in tre. Gli spazi percorsi in ogni secondo, $4{,}9$, $14{,}7$ e $24{,}5\,\text{m}$, stanno tra loro come $1$, $3$, $5$.

```tikz
% nome: caduta-libera-ogni-secondo
% alt: Un sasso che cade da fermo da una torre alta 44,1 metri, disegnato nelle sue posizioni a 0, 1, 2 e 3 secondi: a 44,1; 39,2; 24,5 metri e al suolo. Accanto sono segnati gli spazi percorsi in ogni secondo, 4,9, 14,7 e 24,5 metri, che crescono come 1, 3 e 5; la freccia verde dell'accelerazione g, verso il basso, è la stessa in ogni istante
% svg: caduta-libera-ogni-secondo-e51ab976.svg 160x219
\begin{tikzpicture}
\draw[thick] (-0.9,0) -- (1.8,0);
\foreach \x in {-0.75,-0.6,...,1.8} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[->] (-0.9,0) -- (-0.9,4.9) node[above] {$y$ (m)};
\foreach \y/\t in {0/0,2.45/24{,}5,3.92/39{,}2,4.41/44{,}1} {\draw[thin] (-0.97,\y) -- (-0.83,\y); \node[left] at (-0.97,\y) {\small $\t$};}
\foreach \y/\t in {4.41/0,3.92/1,2.45/2,0.12/3} {
  \draw[thick, fill=gray!30] (0,\y) circle (0.12);
  \node[right] at (0.15,\y) {\small $\t$ s};
}
\draw[dashed, thin] (-0.83,3.92) -- (-0.12,3.92);
\draw[dashed, thin] (-0.83,2.45) -- (-0.12,2.45);
\draw[dashed, thin] (-0.83,4.41) -- (-0.12,4.41);
\draw[thin, <->] (1.1,4.41) -- (1.1,3.92);
\draw[thin, <->] (1.1,3.92) -- (1.1,2.45);
\draw[thin, <->] (1.1,2.45) -- (1.1,0);
\node[right] at (1.15,4.17) {\small $4{,}9$ m};
\node[right] at (1.15,3.19) {\small $14{,}7$ m};
\node[right] at (1.15,1.22) {\small $24{,}5$ m};
\draw[-{Stealth}, thick, green!50!black] (-0.35,2.1) -- (-0.35,1.5) node[below] {$\vec{g}$};
\end{tikzpicture}
```

Il corpo arriva al suolo, $y = 0$, quando $\tfrac{1}{2}g\,t^2 = h$. Il **tempo di caduta** e il modulo della **velocità d'arrivo** sono

$$t = \sqrt{\frac{2h}{g}} \qquad v = g\,t = \sqrt{2g\,h}$$

Nessuno dei due dipende dalla massa: un sasso grande e uno piccolo, lasciati insieme dalla stessa altezza, arrivano insieme e alla stessa velocità.

```ad-example
Esempio 1: il sasso dal ponte
Un sasso viene lasciato cadere da fermo da un ponte alto $12\,\text{m}$ sull'acqua. Quanto tempo impiega ad arrivare all'acqua? Con che velocità ci arriva? L'aria si trascura.

Asse verso l'alto, origine sull'acqua: $y_0 = 12\,\text{m}$, $v_0 = 0$.

$$t = \sqrt{\frac{2h}{g}} = \sqrt{\frac{2 \cdot 12\,\text{m}}{9{,}8\,\text{m/s}^2}} = \sqrt{2{,}449\ldots\,\text{s}^2} = 1{,}56\ldots\,\text{s} \approx 1{,}6\,\text{s}$$

$$v = \sqrt{2g\,h} = \sqrt{2 \cdot 9{,}8\,\text{m/s}^2 \cdot 12\,\text{m}} = 15{,}3\ldots\,\text{m/s} \approx 15\,\text{m/s}$$

La velocità, con il segno, è $v = -15\,\text{m/s}$: verso il basso. In chilometri all'ora sono circa $55\,\text{km/h}$.
```

```ad-warning
La radice dimenticata
Il tempo di caduta è $\sqrt{2h/g}$, non $2h/g$: nell'esempio 1, senza radice, si troverebbe $2{,}4\,\text{s}$, e con un'unità sbagliata, $\text{s}^2$. Anche il controllo con i numeri aiuta: da un'altezza quattro volte più grande il tempo di caduta è solo doppio.
```

```ad-example
Esempio 2: quanto è profondo il pozzo
Un sasso lasciato cadere in un pozzo tocca l'acqua dopo $1{,}8\,\text{s}$. Quanto è profondo il pozzo, fino all'acqua? Il tempo che impiega il suono a risalire si trascura.

Il sasso scende di

$$h = \tfrac{1}{2}g\,t^2 = \tfrac{1}{2} \cdot 9{,}8\,\text{m/s}^2 \cdot (1{,}8\,\text{s})^2 = 15{,}876\,\text{m} \approx 16\,\text{m}$$

e arriva all'acqua a $g\,t = 9{,}8 \cdot 1{,}8\,\text{m/s} = 17{,}64\,\text{m/s} \approx 18\,\text{m/s}$.
```

```ad-tip
Misurare il tempo di reazione con un righello
Un compagno tiene un righello verticale per la cima, con lo zero tra le tue dita aperte, e lo lascia andare senza avvisarti. Se lo afferri dopo che è sceso di $15\,\text{cm}$, il tuo tempo di reazione è $t = \sqrt{2 \cdot 0{,}15\,\text{m} / 9{,}8\,\text{m/s}^2} \approx 0{,}17\,\text{s}$. È il tempo che conta nello [spazio di arresto](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato) di un'auto.
```

## Il lancio verso l'alto

Una palla lanciata verso l'alto con velocità $v_0$ parte con una velocità positiva e un'accelerazione negativa: rallenta, di $9{,}8\,\text{m/s}$ ogni secondo. Nel punto più alto la velocità è zero per un istante; poi diventa negativa, e la palla scende sempre più veloce. L'accelerazione non cambia mai: è $-g$ in salita, in cima e in discesa.

```tikz
% nome: lancio-verticale-frecce
% alt: Una palla lanciata verso l'alto a 19,6 metri al secondo, disegnata ogni secondo: a sinistra la salita, a 0 e 1 secondi, in alto il punto più alto a 2 secondi, a destra la discesa, a 3 e 4 secondi. Le frecce blu della velocità sono lunghe 19,6 e 9,8 metri al secondo verso l'alto in salita, zero in cima, 9,8 e 19,6 metri al secondo verso il basso in discesa; le frecce verdi dell'accelerazione sono tutte uguali e verso il basso, anche in cima. Le altezze sono 0; 14,7; 19,6; 14,7 e 0 metri
% svg: lancio-verticale-frecce-bff10113.svg 182x249
\begin{tikzpicture}
\draw[->] (-1.4,-1.3) -- (-1.4,4.6) node[above] {$y$ (m)};
\foreach \y/\t in {0/0,2.94/14{,}7,3.92/19{,}6} {\draw[thin] (-1.47,\y) -- (-1.33,\y); \node[left] at (-1.47,\y) {\small $\t$};}
\draw[dashed, thin] (-1.33,0) -- (2.2,0);
\draw[dashed, thin] (-1.33,2.94) -- (2.2,2.94);
\draw[dashed, thin] (-1.33,3.92) -- (2.2,3.92);
\foreach \x/\y in {0/0,0/2.94,0.75/3.92,1.5/2.94,1.5/0} \draw[thick, fill=gray!30] (\x,\y) circle (0.1);
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (0,1.18) node[left] {$\vec{v}$};
\draw[-{Stealth}, thick, blue!60!black] (0,2.94) -- (0,3.53);
\draw[-{Stealth}, thick, blue!60!black] (1.5,2.94) -- (1.5,2.35);
\draw[-{Stealth}, thick, blue!60!black] (1.5,0) -- (1.5,-1.18);
\foreach \x/\y in {0/0,0/2.94,0.75/3.92,1.5/2.94,1.5/0} \draw[-{Stealth}, thick, green!50!black] (\x+0.25,\y) -- (\x+0.25,\y-0.5);
\node[right] at (1.0,3.6) {\small $\vec{g}$};
\node[left] at (-0.12,-0.3) {\small $0$ s};
\node[left] at (-0.12,2.7) {\small $1$ s};
\node[above] at (0.75,4.02) {\small $2$ s, $v = 0$};
\node[right] at (1.8,2.7) {\small $3$ s};
\node[right] at (1.8,-0.3) {\small $4$ s};
\end{tikzpicture}
```

Il tempo di salita viene dalla legge della velocità, $0 = v_0 - g\,t$; l'**altezza massima** raggiunta sopra il punto di lancio dalla relazione senza il tempo, $0 = v_0^2 - 2g\,h_{max}$:

$$t_{salita} = \frac{v_0}{g} \qquad h_{max} = \frac{v_0^2}{2g}$$

Il moto è simmetrico: la palla impiega a scendere lo stesso tempo che ha impiegato a salire, passa a ogni altezza con la stessa velocità in modulo all'andata e al ritorno, e torna al punto di lancio con la velocità $-v_0$, uguale e opposta a quella di partenza. Il tempo di volo, dal lancio al ritorno nello stesso punto, è

$$t_{volo} = \frac{2v_0}{g}$$

```ad-warning
In cima l'accelerazione non è zero
Nel punto più alto è zero la velocità, non l'accelerazione. Se in quell'istante l'accelerazione fosse zero la palla, ferma, resterebbe lì sospesa; invece riparte verso il basso, perché il peso continua ad agire. Per tutto il volo $a = -9{,}8\,\text{m/s}^2$.
```

```ad-example
Esempio 3: la palla lanciata in alto
Una palla viene lanciata verticalmente verso l'alto a $12\,\text{m/s}$. Quanto sale sopra il punto di lancio? Dopo quanto tempo ci torna? Dove si trova, e con che velocità, dopo $2{,}0\,\text{s}$?

Asse verso l'alto, origine nel punto di lancio.

$$h_{max} = \frac{v_0^2}{2g} = \frac{(12\,\text{m/s})^2}{2 \cdot 9{,}8\,\text{m/s}^2} = 7{,}34\ldots\,\text{m} \approx 7{,}3\,\text{m} \qquad t_{volo} = \frac{2v_0}{g} = \frac{24\,\text{m/s}}{9{,}8\,\text{m/s}^2} = 2{,}44\ldots\,\text{s} \approx 2{,}4\,\text{s}$$

Dopo $2{,}0\,\text{s}$:

$$v = v_0 - g\,t = 12\,\text{m/s} - 9{,}8\,\text{m/s}^2 \cdot 2{,}0\,\text{s} = -7{,}6\,\text{m/s}$$

$$y = v_0\,t - \tfrac{1}{2}g\,t^2 = 12 \cdot 2{,}0\,\text{m} - \tfrac{1}{2} \cdot 9{,}8 \cdot 2{,}0^2\,\text{m} = 24\,\text{m} - 19{,}6\,\text{m} = 4{,}4\,\text{m}$$

La velocità è negativa: la palla sta già scendendo, ed è $4{,}4\,\text{m}$ sopra il punto di lancio.
```

```ad-example
Esempio 4: la velocità di lancio che serve
Con che velocità bisogna lanciare verso l'alto un mazzo di chiavi perché arrivi a un amico affacciato $5{,}0\,\text{m}$ più su, con velocità zero?

Dalla formula dell'altezza massima, $v_0^2 = 2g\,h_{max}$:

$$v_0 = \sqrt{2g\,h_{max}} = \sqrt{2 \cdot 9{,}8\,\text{m/s}^2 \cdot 5{,}0\,\text{m}} = 9{,}89\ldots\,\text{m/s} \approx 9{,}9\,\text{m/s}$$

È la stessa velocità con cui le chiavi, lasciate cadere dall'amico, arriverebbero giù: il lancio verso l'alto è la caduta vista al contrario.
```

## I grafici del lancio

Il grafico velocità-tempo del lancio è una retta che scende con pendenza $-g$: taglia l'asse dei tempi nell'istante del punto più alto e arriva a $-v_0$ al ritorno. Il grafico dell'altezza è un arco di parabola rivolto verso il basso, con il vertice nel punto più alto. L'area sotto la retta, come nella lezione [Il grafico velocità-tempo](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-grafico-velocita-tempo), è lo spostamento: positiva in salita, negativa e uguale in discesa, e in tutto zero.

```tikz
% nome: lancio-verticale-grafici
% alt: Due grafici uno sopra l'altro con lo stesso asse dei tempi, da 0 a 4 secondi, per la palla lanciata a 19,6 metri al secondo. Sopra il grafico velocità-tempo, una retta che scende da 19,6 a meno 19,6 metri al secondo e taglia l'asse dei tempi a 2 secondi; i due triangoli tra la retta e l'asse, sopra e sotto, sono uguali. Sotto il grafico altezza-tempo, un arco di parabola rivolto verso il basso che sale da 0 a 19,6 metri a 2 secondi e torna a 0 a 4 secondi
% svg: lancio-verticale-grafici-66dc63c1.svg 191x359
\begin{tikzpicture}[scale=0.75]
\fill[blue!15] (0,8) -- (0,9.96) -- (2,8) -- cycle;
\fill[red!15] (2,8) -- (4,6.04) -- (4,8) -- cycle;
\draw[->] (0,8) -- (4.7,8) node[right] {$t$};
\draw[->] (0,5.8) -- (0,10.5) node[above] {$v$ (m/s)};
\foreach \y/\t in {6.04/-19{,}6,7.02/-9{,}8,8.98/9{,}8,9.96/19{,}6} {\draw[thin] (-0.07,\y) -- (0.07,\y); \node[left] at (0,\y) {\small $\t$};}
\draw[thick, blue!60!black] (0,9.96) -- (4,6.04);
\draw[->] (0,0) -- (4.7,0);
\node[below] at (4.5,-0.45) {$t$ (s)};
\draw[->] (0,0) -- (0,4.6) node[above] {$y$ (m)};
\foreach \x in {1,2,3,4} \node[below] at (\x,0) {\small $\x$};
\foreach \y/\t in {2.94/14{,}7,3.92/19{,}6} {\draw[thin] (-0.07,\y) -- (0.07,\y); \node[left] at (0,\y) {\small $\t$};}
\draw[thick, blue!60!black, domain=0:4, samples=50, smooth] plot (\x, {(19.6*\x-4.9*\x*\x)/5});
\draw[dashed, thin] (2,0) -- (2,8);
\fill (2,3.92) circle (0.06);
\end{tikzpicture}
```

## Lanciare da un'altezza

Se la palla è lanciata verso l'alto da un balcone e cade fino al suolo, scende più in basso del punto di lancio, e il tempo di volo non è più $2v_0/g$. Si trova con la legge oraria, cercando l'istante in cui $y = 0$: è un'[equazione di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado) nel tempo. Si arriva allo stesso risultato anche in due passi, prima la salita e poi la caduta da ferma dal punto più alto.

```ad-example
Esempio 5: la palla dal balcone
Da un balcone alto $12\,\text{m}$ una palla viene lanciata verticalmente verso l'alto a $8{,}0\,\text{m/s}$, e poi cade fino al marciapiede. Dopo quanto tempo tocca il marciapiede? Con che velocità?

Asse verso l'alto, origine sul marciapiede: $y_0 = 12\,\text{m}$, $v_0 = 8{,}0\,\text{m/s}$. La palla tocca terra quando $y = 0$:

$$0 = 12 + 8{,}0\,t - 4{,}9\,t^2 \quad\Rightarrow\quad 4{,}9\,t^2 - 8{,}0\,t - 12 = 0$$

$$t = \frac{8{,}0 \pm \sqrt{8{,}0^2 + 4 \cdot 4{,}9 \cdot 12}}{2 \cdot 4{,}9} = \frac{8{,}0 \pm 17{,}29\ldots}{9{,}8}$$

La soluzione negativa si scarta, perché è prima del lancio: $t = 25{,}29\ldots / 9{,}8\,\text{s} = 2{,}58\ldots\,\text{s} \approx 2{,}6\,\text{s}$.

In due passi: la palla sale per $8{,}0/9{,}8\,\text{s} = 0{,}816\,\text{s}$ e di $8{,}0^2/(2 \cdot 9{,}8)\,\text{m} = 3{,}27\,\text{m}$, fino a $15{,}27\,\text{m}$ dal marciapiede; da lì cade da ferma in $\sqrt{2 \cdot 15{,}27/9{,}8}\,\text{s} = 1{,}765\,\text{s}$. In tutto $0{,}816 + 1{,}765 = 2{,}58\,\text{s}$.

La velocità d'arrivo, dalla relazione senza il tempo con $y - y_0 = -12\,\text{m}$:

$$v^2 = v_0^2 - 2g\,(y - y_0) = 8{,}0^2 + 2 \cdot 9{,}8 \cdot 12\,\text{m}^2/\text{s}^2 = 299{,}2\,\text{m}^2/\text{s}^2 \quad\Rightarrow\quad |v| = 17{,}29\ldots\,\text{m/s} \approx 17\,\text{m/s}$$

verso il basso.
```

```ad-warning
Il segno dello spostamento
Nell'esempio 5 la palla finisce $12\,\text{m}$ più in basso del punto di lancio: $y - y_0 = -12\,\text{m}$, negativo. Chi lo prende positivo trova $v^2 = 64 - 235{,}2$, un numero negativo di cui non esiste la radice: il segnale che un segno è sbagliato.
```

## L'aria trascurata

Le leggi di questa lezione valgono quando la resistenza dell'aria è piccola rispetto al peso: per un sasso, una palla pesante, un mazzo di chiavi, su altezze di qualche metro o qualche decina di metri. Non valgono per una piuma, un foglio, un paracadutista o una goccia di pioggia: la resistenza dell'aria cresce con la velocità e dopo un po' bilancia il peso, e da lì il corpo scende a velocità costante, la velocità limite della lezione [L'attrito viscoso e la velocità limite](/materiale/scuola-superiore/fisica/la-meccanica-dei-fluidi/l-attrito-viscoso-e-la-velocita-limite). Negli esercizi, se non è detto altro, l'aria si trascura.

Nella figura qui sotto scegli la velocità con cui lanci la palla verso l'alto e la fai partire: la freccia blu della velocità si accorcia in salita, sparisce in cima e si rovescia in discesa, mentre la freccia verde dell'accelerazione resta sempre la stessa.

```interattivo
% nome: lancio-verticale-velocita
% alt: Una palla lanciata verticalmente verso l'alto da terra, con un cursore per la velocità di lancio, da 5 a 20 metri al secondo, e un bottone che la lancia. Durante il volo la freccia blu della velocità si accorcia mentre la palla sale, si annulla nel punto più alto e poi punta verso il basso allungandosi; la freccia verde dell'accelerazione è sempre uguale e verso il basso. Una tacca segna l'altezza massima; sotto sono scritti il tempo, l'altezza, la velocità con il segno, l'altezza massima e il tempo di salita
```
