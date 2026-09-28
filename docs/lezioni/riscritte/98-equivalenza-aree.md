# Equivalenza e aree

Un rettangolo lungo e stretto e un quadrato possono occupare la stessa porzione di piano pur avendo forme diverse: per pavimentarli servono le stesse piastrelle. Due figure così si dicono equivalenti, e la loro misura comune è l'area. Da questa idea vengono tutte le formule delle aree: si parte dal rettangolo e, tagliando e ricomponendo, si arriva al parallelogramma, al triangolo, al trapezio, al rombo e ai poligoni regolari.

Le figure di questa lezione sono quelle della lezione [Parallelogrammi e trapezi](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/parallelogrammi-e-trapezi), e le dimostrazioni usano i [criteri di congruenza dei triangoli](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/triangoli-e-criteri-di-congruenza).

## Superfici equivalenti

Ogni figura piana occupa una parte di piano, la sua **superficie**, e ogni superficie ha una sua **estensione**, cioè la quantità di piano che occupa. L'estensione è un concetto primitivo, come il punto e la retta: non si definisce, ma se ne danno le proprietà.

Due superfici sono **equivalenti** se hanno la stessa estensione. Per dire che le figure $F$ e $G$ sono equivalenti si scrive

$$F \doteq G$$

e si legge "$F$ è equivalente a $G$". Il rettangolo e il quadrato della figura sono formati entrambi da quattro quadretti uguali: sono equivalenti, ma non congruenti, perché non si possono sovrapporre.

```tikz
% nome: rettangolo-quadrato-equivalenti
% alt: Un rettangolo di 4 quadretti per 1 e un quadrato di 2 quadretti per 2: hanno forme diverse ma sono formati entrambi da 4 quadretti, quindi sono equivalenti
% svg: rettangolo-quadrato-equivalenti-41ace05e.svg 163x49
\begin{tikzpicture}
\fill[blue!12] (0,0) -- (2.4,0) -- (2.4,0.6) -- (0,0.6) -- cycle;
\fill[blue!12] (3,0) -- (4.2,0) -- (4.2,1.2) -- (3,1.2) -- cycle;
\draw[gray!60] (0.6,0) -- (0.6,0.6);
\draw[gray!60] (1.2,0) -- (1.2,0.6);
\draw[gray!60] (1.8,0) -- (1.8,0.6);
\draw[gray!60] (3.6,0) -- (3.6,1.2);
\draw[gray!60] (3,0.6) -- (4.2,0.6);
\draw[thick] (0,0) -- (2.4,0) -- (2.4,0.6) -- (0,0.6) -- cycle;
\draw[thick] (3,0) -- (4.2,0) -- (4.2,1.2) -- (3,1.2) -- cycle;
\end{tikzpicture}
```

Due figure congruenti sono sempre equivalenti: se si sovrappongono punto per punto, occupano la stessa quantità di piano. Il contrario non vale, e il rettangolo e il quadrato lo mostrano. Come la congruenza, l'equivalenza è una [relazione di equivalenza](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/relazioni-di-equivalenza-e-d-ordine): ogni figura è equivalente a se stessa, se $F \doteq G$ allora $G \doteq F$, e se $F \doteq G$ e $G \doteq H$ allora $F \doteq H$.

```ad-warning
Equivalente non vuol dire congruente
Due figure equivalenti hanno la stessa estensione, non la stessa forma: un triangolo può essere equivalente a un quadrato. Il simbolo $\cong$ è per le figure congruenti, il simbolo $\doteq$ per quelle equivalenti.
```

### Somme e differenze di superfici

Una figura è **somma** di due figure se è formata da quelle due, accostate senza sovrapporsi (possono avere in comune solo punti del contorno). Tutte le dimostrazioni sulle aree si reggono su due proprietà, che molti libri prendono come postulati:

1. se due figure sono somme di figure congruenti o equivalenti, sono equivalenti;
2. se due figure sono differenze di figure congruenti o equivalenti, sono equivalenti.

Da qui viene un modo pratico per riconoscere due figure equivalenti. Due poligoni sono **equiscomponibili** se si possono dividere nello stesso numero di parti a due a due congruenti. Due poligoni equiscomponibili sono equivalenti, per la prima proprietà: sono somme delle stesse parti.

```tikz
% nome: quadrato-triangolo-equiscomponibili
% alt: A sinistra un quadrato diviso dalla diagonale in due triangoli rettangoli isosceli, uno azzurro e uno arancione; a destra gli stessi due triangoli accostati lungo un cateto formano un triangolo isoscele con la base doppia del lato del quadrato
% svg: quadrato-triangolo-equiscomponibili-35baee54.svg 203x61
\begin{tikzpicture}
\fill[blue!15] (0,0) -- (1.5,0) -- (1.5,1.5) -- cycle;
\fill[orange!25] (0,0) -- (1.5,1.5) -- (0,1.5) -- cycle;
\fill[blue!15] (2.25,0) -- (3.75,0) -- (3.75,1.5) -- cycle;
\fill[orange!25] (3.75,0) -- (5.25,0) -- (3.75,1.5) -- cycle;
\draw[thick] (0,0) -- (1.5,0) -- (1.5,1.5) -- (0,1.5) -- cycle;
\draw[dashed] (0,0) -- (1.5,1.5);
\draw[thick] (2.25,0) -- (5.25,0) -- (3.75,1.5) -- cycle;
\draw[dashed] (3.75,0) -- (3.75,1.5);
\draw[thin] (1.32,0) -- (1.32,0.18) -- (1.5,0.18);
\draw[thin] (3.57,0) -- (3.57,0.18) -- (3.75,0.18);
\draw[thin] (3.93,0) -- (3.93,0.18) -- (3.75,0.18);
\end{tikzpicture}
```

Nella figura la diagonale divide il quadrato in due triangoli rettangoli isosceli, con i cateti congruenti al lato del quadrato. Accostati lungo un cateto, gli stessi due triangoli formano un triangolo isoscele che ha la base doppia del lato del quadrato e l'altezza uguale al lato. Il quadrato e il triangolo sono equiscomponibili, quindi equivalenti.

## L'area e le sue unità di misura

L'**area** di una superficie è la misura della sua estensione, cioè il numero che dice quante volte contiene l'unità di misura. L'unità è un quadrato: il **centimetro quadrato** ($\text{cm}^2$) è l'area di un quadrato con il lato di $1$ cm, il **metro quadrato** ($\text{m}^2$) quella di un quadrato con il lato di $1$ m. Due superfici equivalenti hanno la stessa area, e due superfici con la stessa area sono equivalenti.

Un rettangolo con la base di $5$ cm e l'altezza di $3$ cm contiene $3$ file da $5$ quadretti di $1\ \text{cm}^2$, quindi la sua area è $5 \cdot 3 = 15\ \text{cm}^2$.

```tikz
% nome: area-rettangolo-quadretti
% alt: Un rettangolo con la base di 5 centimetri e l'altezza di 3 centimetri diviso in 15 quadretti di un centimetro quadrato: 3 file da 5
% svg: area-rettangolo-quadretti-057eebcf.svg 175x103
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (2.75,0) -- (2.75,1.65) -- (0,1.65) -- cycle;
\draw[gray!60] (0.55,0) -- (0.55,1.65);
\draw[gray!60] (1.1,0) -- (1.1,1.65);
\draw[gray!60] (1.65,0) -- (1.65,1.65);
\draw[gray!60] (2.2,0) -- (2.2,1.65);
\draw[gray!60] (0,0.55) -- (2.75,0.55);
\draw[gray!60] (0,1.1) -- (2.75,1.1);
\draw[thick] (0,0) -- (2.75,0) -- (2.75,1.65) -- (0,1.65) -- cycle;
\node[below] at (1.38,-0.05) {\small $b = 5$ cm};
\node[right] at (2.8,0.83) {\small $h = 3$ cm};
\node[above] at (0.28,1.67) {\scriptsize $1$ cm$^2$};
\draw[->, thin] (0.28,1.77) -- (0.28,1.38);
\end{tikzpicture}
```

In generale l'area del rettangolo è il prodotto della base per l'altezza, e quella del quadrato di lato $\ell$ è il lato al quadrato:

$$
\begin{gathered}
A_{\text{rettangolo}} = b \cdot h \\
A_{\text{quadrato}} = \ell^2
\end{gathered}
$$

La formula vale anche quando le misure non sono numeri interi: un rettangolo di $2{,}5$ cm per $4$ cm ha l'area di $10\ \text{cm}^2$.

### Conversioni

Un centimetro è lungo $10$ millimetri, quindi un quadrato di $1$ cm di lato contiene $10$ file da $10$ quadretti di $1\ \text{mm}^2$: $1\ \text{cm}^2 = 100\ \text{mm}^2$.

```tikz
% nome: centimetro-quadrato-millimetri-quadrati
% alt: Un quadrato con il lato di 1 centimetro, cioè 10 millimetri, diviso in 10 file da 10 quadretti di un millimetro quadrato: in un centimetro quadrato stanno 100 millimetri quadrati; un quadretto è colorato
% svg: centimetro-quadrato-millimetri-quadrati-550bb9b7.svg 146x105
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (2.2,0) -- (2.2,2.2) -- (0,2.2) -- cycle;
\fill[orange!60] (0,0) -- (0.22,0) -- (0.22,0.22) -- (0,0.22) -- cycle;
\draw[gray!50, very thin] (0.22,0) -- (0.22,2.2);
\draw[gray!50, very thin] (0,0.22) -- (2.2,0.22);
\draw[gray!50, very thin] (0.44,0) -- (0.44,2.2);
\draw[gray!50, very thin] (0,0.44) -- (2.2,0.44);
\draw[gray!50, very thin] (0.66,0) -- (0.66,2.2);
\draw[gray!50, very thin] (0,0.66) -- (2.2,0.66);
\draw[gray!50, very thin] (0.88,0) -- (0.88,2.2);
\draw[gray!50, very thin] (0,0.88) -- (2.2,0.88);
\draw[gray!50, very thin] (1.1,0) -- (1.1,2.2);
\draw[gray!50, very thin] (0,1.1) -- (2.2,1.1);
\draw[gray!50, very thin] (1.32,0) -- (1.32,2.2);
\draw[gray!50, very thin] (0,1.32) -- (2.2,1.32);
\draw[gray!50, very thin] (1.54,0) -- (1.54,2.2);
\draw[gray!50, very thin] (0,1.54) -- (2.2,1.54);
\draw[gray!50, very thin] (1.76,0) -- (1.76,2.2);
\draw[gray!50, very thin] (0,1.76) -- (2.2,1.76);
\draw[gray!50, very thin] (1.98,0) -- (1.98,2.2);
\draw[gray!50, very thin] (0,1.98) -- (2.2,1.98);
\draw[thick] (0,0) -- (2.2,0) -- (2.2,2.2) -- (0,2.2) -- cycle;
\node[below] at (1.1,-0.05) {\small $1$ cm $= 10$ mm};
\draw[thin] (0.11,0.11) -- (2.55,0.55);
\node[right] at (2.5,0.55) {\small $1$ mm$^2$};
\end{tikzpicture}
```

Lo stesso vale a ogni passo: tra un'unità di superficie e quella subito più piccola il fattore è $10^2 = 100$, non $10$.

| Unità | $\text{m}^2$ | $\text{dm}^2$ | $\text{cm}^2$ | $\text{mm}^2$ |
|---|---|---|---|---|
| in $\text{cm}^2$ | $10\,000$ | $100$ | $1$ | $0{,}01$ |

Per passare a un'unità più piccola si moltiplica per $100$ a ogni passo, per passare a una più grande si divide per $100$.

```ad-example
Esempio 1: cambiare unità di misura
Esprimi $3{,}5\ \text{m}^2$ in $\text{cm}^2$ e $250\ \text{mm}^2$ in $\text{cm}^2$. Poi calcola l'area di un rettangolo con la base di $1{,}2$ m e l'altezza di $45$ cm.

Da $\text{m}^2$ a $\text{cm}^2$ ci sono due passi, quindi si moltiplica per $100 \cdot 100 = 10\,000$: $3{,}5\ \text{m}^2 = 35\,000\ \text{cm}^2$. Da $\text{mm}^2$ a $\text{cm}^2$ c'è un passo verso l'unità più grande: $250\ \text{mm}^2 = 250 : 100 = 2{,}5\ \text{cm}^2$.

Per il rettangolo le due misure devono essere nella stessa unità: $1{,}2$ m $= 120$ cm, quindi l'area è $120 \cdot 45 = 5400\ \text{cm}^2$, cioè $0{,}54\ \text{m}^2$.
```

```ad-warning
Un metro quadrato non è cento centimetri quadrati
$1$ m $= 100$ cm, ma $1\ \text{m}^2 = 100 \cdot 100\ \text{cm}^2 = 10\,000\ \text{cm}^2$: il quadrato di $1$ m di lato contiene $100$ file da $100$ quadretti di $1\ \text{cm}^2$. Per le aree il fattore tra due unità vicine è $100$.
```

## Il parallelogramma

Un parallelogramma è equivalente al rettangolo che ha la stessa base e la stessa altezza.

Ipotesi: $ABCD$ è un parallelogramma, $DH$ e $CK$ sono perpendicolari alla retta $AB$.

Tesi: $ABCD \doteq HKCD$.

```tikz
% nome: parallelogramma-equivalente-rettangolo
% alt: Il parallelogramma ABCD e il rettangolo HKCD con la stessa base e la stessa altezza: i triangoli AHD e BKC, colorati in arancione, sono congruenti, e la parte azzurra HBCD è in comune
% svg: parallelogramma-equivalente-rettangolo-972348a3.svg 229x116
\begin{tikzpicture}
\fill[blue!10] (1.14,0) -- (3.8,0) -- (4.94,2.09) -- (1.14,2.09) -- cycle;
\fill[orange!25] (0,0) -- (1.14,0) -- (1.14,2.09) -- cycle;
\fill[orange!25] (3.8,0) -- (4.94,0) -- (4.94,2.09) -- cycle;
\draw[thick] (0,0) -- (3.8,0) -- (4.94,2.09) -- (1.14,2.09) -- cycle;
\draw[dashed] (3.8,0) -- (4.94,0);
\draw[dashed] (1.14,2.09) -- (1.14,0);
\draw[dashed] (4.94,2.09) -- (4.94,0);
\draw[thin] (1.34,0) -- (1.34,0.2) -- (1.14,0.2);
\draw[thin] (4.74,0) -- (4.74,0.2) -- (4.94,0.2);
\draw (0.47,1.1) -- (0.67,0.99);
\draw (4.27,1.1) -- (4.47,0.99);
\draw (1.25,1.08) -- (1.03,1.08);
\draw (1.25,1.01) -- (1.03,1.01);
\draw (5.05,1.08) -- (4.83,1.08);
\draw (5.05,1.01) -- (4.83,1.01);
\draw[thin] (0.35,0) arc[start angle=0, delta angle=61.39, radius=0.35];
\draw[thin] (4.15,0) arc[start angle=0, delta angle=61.39, radius=0.35];
\node at (-0.26,-0.11) {$A$};
\node at (0.92,2.26) {$D$};
\node at (5.2,2.2) {$C$};
\node[below] at (3.8,0) {$B$};
\node[below] at (1.14,0) {$H$};
\node[below] at (4.94,0) {$K$};
\end{tikzpicture}
```

Dimostrazione.

1. $HKCD$ è un rettangolo: $DH$ e $CK$ sono perpendicolari alla retta $AB$, e $DC$ è parallela ad $AB$. Quindi $DH \cong CK$, perché sono lati opposti di un rettangolo.
2. Nei triangoli $AHD$ e $BKC$ si ha $AD \cong BC$, perché sono lati opposti del parallelogramma, e $\widehat{DAH} \cong \widehat{CBK}$, perché sono angoli corrispondenti formati dalle parallele $AD$ e $BC$ con la trasversale $AB$.
3. I due triangoli hanno anche un angolo retto, in $H$ e in $K$, quindi hanno congruenti anche i terzi angoli, $\widehat{ADH} \cong \widehat{BCK}$ (la somma degli angoli è $180^\circ$ in tutti e due). Per il secondo criterio, con il lato $AD$ e i suoi due angoli adiacenti, $AHD \cong BKC$.
4. Il trapezio $AKCD$ meno il triangolo $BKC$ è il parallelogramma $ABCD$; lo stesso trapezio meno il triangolo $AHD$ è il rettangolo $HKCD$. Sono differenze di figure congruenti, quindi $ABCD \doteq HKCD$.

Dal parallelogramma al rettangolo si passa anche con un movimento: il triangolo $AHD$ scorre lungo la base di un tratto lungo quanto $AB$ e va a coprire esattamente $BKC$. Prova a farlo tu, e cambia il parallelogramma con i cursori.

```interattivo
% nome: parallelogramma-rettangolo
% alt: Il parallelogramma ABCD con il triangolo AHD in arancione, da trascinare lungo la base fino alla posizione BKC, dove il parallelogramma diventa il rettangolo HKCD; un bottone fa lo stesso nei due versi, e i cursori cambiano la base, l'altezza e l'angolo in A, con l'area calcolata come base per altezza
```

Il rettangolo $HKCD$ ha la base $HK \cong DC$, perché sono lati opposti del rettangolo, e $DC \cong AB$, perché sono lati opposti del parallelogramma: quindi ha la stessa base del parallelogramma, $HK \cong AB$, e la stessa altezza $DH$. Per questo l'area del parallelogramma è base per altezza:

$$A = b \cdot h$$

Come base si può prendere un lato qualsiasi: l'altezza è la distanza del lato opposto dalla retta della base. Un parallelogramma ha quindi due altezze, una per ogni coppia di lati paralleli, e il prodotto di ciascun lato per la sua altezza dà la stessa area.

```ad-example
Esempio 2: le due altezze di un parallelogramma
Nel parallelogramma $ABCD$ la base $AB$ misura $12$ cm, il lato $AD$ misura $10$ cm e l'altezza $DH$ relativa ad $AB$ misura $8$ cm. Trova l'area e l'altezza $BK$ relativa al lato $AD$.

```tikz
% nome: parallelogramma-due-altezze
% alt: Il parallelogramma ABCD con la base AB di 12, il lato AD di 10, l'altezza DH di 8 relativa ad AB e l'altezza BK relativa al lato AD, da trovare
% svg: parallelogramma-due-altezze-85604d2f.svg 246x148
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (3.6,0) -- (5.4,2.4) -- (1.8,2.4) -- cycle;
\draw[thick] (0,0) -- (3.6,0) -- (5.4,2.4) -- (1.8,2.4) -- cycle;
\draw[dashed] (1.8,2.4) -- (1.8,0);
\draw[dashed] (3.6,0) -- (1.3,1.73);
\draw[thin] (2,0) -- (2,0.2) -- (1.8,0.2);
\draw[thin] (1.46,1.61) -- (1.34,1.45) -- (1.18,1.57);
\node[below left] at (0,0) {$A$};
\node[below right] at (3.6,0) {$B$};
\node[above right] at (5.4,2.4) {$C$};
\node[above] at (1.8,2.4) {$D$};
\node[below] at (1.8,0) {$H$};
\node[left] at (1.3,1.73) {$K$};
\draw[<->, thin] (0,-0.5) -- (3.6,-0.5);
\node[below] at (1.8,-0.5) {\small $12$};
\node[right] at (4.6,1.18) {\small $10$};
\node[left] at (1.8,0.66) {\small $8$};
\node[above right] at (2.45,0.86) {\small $h'$};
\end{tikzpicture}
```

L'area è la base $AB$ per la sua altezza: $A = 12 \cdot 8 = 96\ \text{cm}^2$. La stessa area si ottiene con il lato $AD$ e la sua altezza $BK$, quindi $10 \cdot \overline{BK} = 96$ e

$$\overline{BK} = \frac{96}{10} = 9{,}6\ \text{cm}$$

Controllo: $9{,}6$ cm è meno di $12$ cm, come deve essere, perché $BK$ è la perpendicolare da $B$ alla retta $AD$ e $BA$ è un segmento obliquo, più lungo.
```

```ad-warning
L'altezza non è il lato obliquo
L'area del parallelogramma dell'esempio 2 non è $12 \cdot 10 = 120\ \text{cm}^2$: il lato $AD$ è obliquo, e l'altezza $DH$ è più corta. Base e altezza devono essere perpendicolari.
```

## Il triangolo

Un triangolo è equivalente alla metà di un parallelogramma con la stessa base e la stessa altezza.

Dato il triangolo $ABC$, traccia da $C$ la parallela ad $AB$ e da $B$ la parallela ad $AC$: si incontrano in un punto $D$, e $ABDC$ è un parallelogramma, perché ha i lati opposti paralleli. La diagonale $BC$ lo divide in due triangoli congruenti (è una proprietà del parallelogramma), quindi il triangolo $ABC$ è metà del parallelogramma $ABDC$, che ha la stessa base $AB$ e la stessa altezza $CH$.

```tikz
% nome: triangolo-meta-parallelogramma
% alt: Il triangolo ABC, colorato, e il parallelogramma ABDC ottenuto con le parallele ai lati AB e AC: la diagonale BC divide il parallelogramma in due triangoli congruenti; CH è l'altezza
% svg: triangolo-meta-parallelogramma-2c7c8fd8.svg 233x116
\begin{tikzpicture}
\fill[blue!15] (0,0) -- (3.8,0) -- (1.23,2.09) -- cycle;
\draw[thick, dashed] (0,0) -- (3.8,0) -- (5.04,2.09) -- (1.23,2.09) -- cycle;
\draw[thick] (0,0) -- (3.8,0) -- (1.23,2.09) -- cycle;
\draw[dashed] (1.23,2.09) -- (1.23,0);
\draw[thin] (1.43,0) -- (1.43,0.2) -- (1.23,0.2);
\draw (0.52,1.1) -- (0.71,0.99);
\draw (4.32,1.1) -- (4.51,0.99);
\draw (3.1,2.2) -- (3.1,1.98);
\draw (3.17,2.2) -- (3.17,1.98);
\draw (1.86,0.11) -- (1.86,-0.11);
\draw (1.93,0.11) -- (1.93,-0.11);
\node at (-0.26,-0.11) {$A$};
\node at (4.02,-0.18) {$B$};
\node at (1.02,2.27) {$C$};
\node at (5.29,2.2) {$D$};
\node[below] at (1.23,0) {$H$};
\node[right] at (1.23,1.04) {\small $h$};
\end{tikzpicture}
```

L'area del triangolo è quindi base per altezza diviso due:

$$A = \frac{b \cdot h}{2}$$

Un triangolo con la base di $12$ cm e l'altezza di $5$ cm ha l'area di $\dfrac{12 \cdot 5}{2} = 30\ \text{cm}^2$. Anche qui la base può essere un lato qualsiasi, con l'altezza relativa a quel lato. In un triangolo ottusangolo l'altezza relativa a uno dei lati dell'angolo ottuso cade fuori dal triangolo, sul prolungamento della base, ma la formula non cambia: $h$ è la distanza del vertice dalla retta della base.

```tikz
% nome: triangolo-ottusangolo-altezza-esterna
% alt: Il triangolo ABC ottusangolo in B: l'altezza CH relativa alla base AB cade fuori dal triangolo, sul prolungamento di AB oltre B
% svg: triangolo-ottusangolo-altezza-esterna-023d1b3a.svg 197x115
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (2.6,0) -- (4.2,2) -- cycle;
\draw[thick] (0,0) -- (2.6,0) -- (4.2,2) -- cycle;
\draw[dashed] (2.6,0) -- (4.2,0);
\draw[dashed] (4.2,2) -- (4.2,0);
\draw[thin] (4,0) -- (4,0.2) -- (4.2,0.2);
\node[below left] at (0,0) {$A$};
\node[below] at (2.6,0) {$B$};
\node[above] at (4.2,2) {$C$};
\node[below] at (4.2,0) {$H$};
\node[right] at (4.2,1) {\small $h$};
\node[below] at (1.3,0) {\small $b$};
\end{tikzpicture}
```

In un triangolo rettangolo i due cateti sono perpendicolari, quindi uno è l'altezza relativa all'altro: l'area è il semiprodotto dei cateti.

```ad-example
Esempio 3: l'altezza relativa all'ipotenusa
Il triangolo $ABC$ è rettangolo in $C$, i cateti misurano $\overline{AC} = 6$ cm e $\overline{BC} = 8$ cm, l'ipotenusa $\overline{AB} = 10$ cm. Trova l'area e l'altezza $CH$ relativa all'ipotenusa.

```tikz
% nome: triangolo-rettangolo-altezza-ipotenusa
% alt: Il triangolo ABC rettangolo in C con i cateti AC di 6 e BC di 8, l'ipotenusa AB di 10 e l'altezza CH relativa all'ipotenusa
% svg: triangolo-rettangolo-altezza-ipotenusa-2f522646.svg 216x123
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4.6,0) -- (1.66,2.21) -- cycle;
\draw[thick] (0,0) -- (4.6,0) -- (1.66,2.21) -- cycle;
\draw[dashed] (1.66,2.21) -- (1.66,0);
\draw[thin] (1.54,2.05) -- (1.7,1.93) -- (1.82,2.09);
\draw[thin] (1.84,0) -- (1.84,0.18) -- (1.66,0.18);
\node[below left] at (0,0) {$A$};
\node[below right] at (4.6,0) {$B$};
\node[above] at (1.66,2.21) {$C$};
\node[below] at (1.66,0) {$H$};
\node[above left] at (0.78,1.15) {\small $6$};
\node[above right] at (3.18,1.15) {\small $8$};
\node[below] at (3.13,-0.02) {\small $10$};
\end{tikzpicture}
```

Con i cateti come base e altezza:

$$A = \frac{6 \cdot 8}{2} = 24\ \text{cm}^2$$

La stessa area si ottiene con l'ipotenusa come base e $CH$ come altezza: $\dfrac{10 \cdot \overline{CH}}{2} = 24$, quindi $10 \cdot \overline{CH} = 48$ e $\overline{CH} = 4{,}8$ cm.

In generale l'altezza relativa all'ipotenusa è il prodotto dei cateti diviso l'ipotenusa: $\overline{CH} = \dfrac{6 \cdot 8}{10}$.
```

```ad-warning
Dimenticare il diviso due
L'area del triangolo è metà del prodotto di base e altezza. Per trovare l'altezza dall'area si moltiplica l'area per $2$ prima di dividere per la base: con area $24$ e base $10$ l'altezza è $48 : 10 = 4{,}8$, non $24 : 10 = 2{,}4$.
```

## Il trapezio

Un trapezio è equivalente al triangolo che ha per base la somma delle due basi e la stessa altezza.

Ipotesi: $ABCD$ è un trapezio con le basi $AB$ e $DC$; $M$ è il punto medio del lato obliquo $BC$; la retta $DM$ incontra il prolungamento di $AB$ nel punto $E$.

Tesi: $ABCD \doteq AED$ e $AE \cong AB + DC$.

```tikz
% nome: trapezio-equivalente-triangolo
% alt: Il trapezio ABCD e il triangolo AED: la retta per D e per il punto medio M del lato obliquo BC incontra il prolungamento della base AB in E; i triangoli DMC e EMB, in arancione, sono congruenti, e BE è congruente alla base minore DC
% svg: trapezio-equivalente-triangolo-217b3c87.svg 246x107
\begin{tikzpicture}
\fill[blue!10] (0,0) -- (3.6,0) -- (3.15,0.9) -- (0.9,1.8) -- cycle;
\fill[orange!25] (0.9,1.8) -- (3.15,0.9) -- (2.7,1.8) -- cycle;
\fill[orange!25] (3.6,0) -- (5.4,0) -- (3.15,0.9) -- cycle;
\draw[thick] (0,0) -- (3.6,0) -- (2.7,1.8) -- (0.9,1.8) -- cycle;
\draw[dashed] (3.6,0) -- (5.4,0);
\draw[dashed] (3.15,0.9) -- (5.4,0);
\draw (0.9,1.8) -- (3.15,0.9);
\draw (3.28,0.4) -- (3.47,0.5);
\draw (2.83,1.3) -- (3.02,1.4);
\draw[thin] (2.4,1.8) arc[start angle=180, delta angle=116.57, radius=0.3];
\draw[thin] (3.9,0) arc[start angle=0, delta angle=116.57, radius=0.3];
\node[below left] at (0,0) {$A$};
\node[below] at (3.6,0) {$B$};
\node[above right] at (2.7,1.8) {$C$};
\node[above left] at (0.9,1.8) {$D$};
\node[below right] at (5.4,0) {$E$};
\node[right] at (3.15,0.9) {$M$};
\end{tikzpicture}
```

Dimostrazione.

1. Nei triangoli $DMC$ e $EMB$ si ha $MC \cong MB$, perché $M$ è il punto medio di $BC$.
2. $\widehat{DMC} \cong \widehat{EMB}$, perché sono angoli opposti al vertice.
3. $\widehat{DCM} \cong \widehat{EBM}$, perché sono angoli alterni interni formati dalle parallele $DC$ e $AE$ con la trasversale $BC$.
4. Per il secondo criterio $DMC \cong EMB$; in particolare $DC \cong BE$.
5. Il trapezio $ABCD$ è la somma del quadrilatero $ABMD$ e del triangolo $DMC$; il triangolo $AED$ è la somma dello stesso quadrilatero e del triangolo $EMB$. Sono somme di figure congruenti, quindi $ABCD \doteq AED$.
6. La base del triangolo è $AE = AB + BE$, e $BE \cong DC$ per il passo 4.

Il passo 4 dice anche come passare da una figura all'altra: il triangolo $DMC$ ruota di mezzo giro intorno a $M$ e va a coprire esattamente $EMB$. Prova a farlo tu, e cambia la forma del trapezio con i cursori.

```interattivo
% nome: trapezio-triangolo
% alt: Il trapezio ABCD con il triangolo DMC in arancione, da trascinare intorno al punto medio M del lato obliquo BC fino alla posizione BME, dove il trapezio diventa il triangolo AED; i cursori cambiano le basi, l'altezza e la posizione della base minore
```

Il triangolo $AED$ ha la base lunga quanto la somma delle basi del trapezio e la stessa altezza, quindi l'area del trapezio, con $B$ la base maggiore e $b$ la base minore, è

$$A = \frac{(B + b) \cdot h}{2}$$

Un trapezio con le basi di $14$ cm e $8$ cm e l'altezza di $5$ cm ha l'area di $\dfrac{(14 + 8) \cdot 5}{2} = \dfrac{22 \cdot 5}{2} = 55\ \text{cm}^2$.

```ad-example
Esempio 4: l'altezza del trapezio
Un trapezio ha l'area di $60\ \text{cm}^2$ e le basi di $9$ cm e di $6$ cm. Quanto misura l'altezza?

```tikz
% nome: trapezio-esempio-altezza
% alt: Il trapezio ABCD con la base maggiore AB di 9, la base minore DC di 6 e l'altezza DH da trovare
% svg: trapezio-esempio-altezza-e01d1c2d.svg 178x161
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (3.6,0) -- (3,3.2) -- (0.6,3.2) -- cycle;
\draw[thick] (0,0) -- (3.6,0) -- (3,3.2) -- (0.6,3.2) -- cycle;
\draw[dashed] (0.6,3.2) -- (0.6,0);
\draw[thin] (0.8,0) -- (0.8,0.2) -- (0.6,0.2);
\node[below left] at (0,0) {$A$};
\node[below right] at (3.6,0) {$B$};
\node[above right] at (3,3.2) {$C$};
\node[above left] at (0.6,3.2) {$D$};
\node[below] at (0.6,0) {$H$};
\node[below] at (2.1,0) {\small $9$};
\node[above] at (1.8,3.2) {\small $6$};
\node[right] at (0.6,1.6) {\small $h$};
\end{tikzpicture}
```

Nella formula dell'area si sostituiscono i dati:

$$\frac{(9 + 6) \cdot h}{2} = 60$$

Moltiplicando per $2$ si ha $15 \cdot h = 120$, quindi $h = 8$ cm. Controllo: $\dfrac{15 \cdot 8}{2} = 60$.
```

## Il rombo e i quadrilateri con le diagonali perpendicolari

Un quadrilatero con le diagonali perpendicolari, come il rombo, il quadrato o l'aquilone, è equivalente a metà del rettangolo che ha i lati congruenti alle due diagonali.

Nel quadrilatero $ABCD$ le diagonali $AC$ e $BD$ sono perpendicolari e si incontrano nel punto $O$. Dai vertici si tracciano le parallele alle diagonali: da $A$ e da $C$ le parallele a $BD$, da $B$ e da $D$ le parallele ad $AC$. Si forma un rettangolo con un lato congruente ad $AC$ e l'altro congruente a $BD$.

```tikz
% nome: quadrilatero-diagonali-perpendicolari
% alt: Il quadrilatero ABCD con le diagonali AC e BD perpendicolari in O, dentro il rettangolo tratteggiato che ha i lati paralleli e congruenti alle diagonali: ogni rettangolino è diviso da un lato del quadrilatero in due triangoli congruenti, uno dentro e uno fuori
% svg: quadrilatero-diagonali-perpendicolari-aad2dd9e.svg 231x153
\begin{tikzpicture}
\draw[dashed] (0,-1.3) -- (5,-1.3) -- (5,1.7) -- (0,1.7) -- cycle;
\fill[blue!15] (0,0) -- (1.8,-1.3) -- (5,0) -- (1.8,1.7) -- cycle;
\draw[thick] (0,0) -- (1.8,-1.3) -- (5,0) -- (1.8,1.7) -- cycle;
\draw (0,0) -- (5,0);
\draw (1.8,-1.3) -- (1.8,1.7);
\draw[thin] (1.98,0) -- (1.98,0.18) -- (1.8,0.18);
\node[left] at (0,0) {$A$};
\node[below] at (1.8,-1.3) {$B$};
\node[right] at (5,0) {$C$};
\node[above] at (1.8,1.7) {$D$};
\node[below right] at (1.8,0) {\small $O$};
\end{tikzpicture}
```

Le diagonali dividono il rettangolo grande in quattro rettangoli più piccoli, e ogni lato del quadrilatero è la diagonale di uno di questi: lo divide in due triangoli congruenti, uno dentro il quadrilatero e uno fuori. Quindi il quadrilatero è metà del rettangolo, e con $d_1$ e $d_2$ le misure delle diagonali la sua area è

$$A = \frac{d_1 \cdot d_2}{2}$$

La formula vale per il rombo, che ha sempre le diagonali perpendicolari, e per il quadrato, che ha le due diagonali congruenti: con la diagonale $d$, $A = \dfrac{d^2}{2}$. Un quadrato con la diagonale di $10$ cm ha l'area di $\dfrac{100}{2} = 50\ \text{cm}^2$. Il rombo è anche un parallelogramma, quindi la sua area si può calcolare pure come lato per altezza.

```ad-example
Esempio 5: la diagonale di un rombo
Un rombo ha l'area di $96\ \text{cm}^2$ e la diagonale $AC$ di $16$ cm. Quanto misura l'altra diagonale?

```tikz
% nome: rombo-esempio-diagonale
% alt: Il rombo ABCD con la diagonale AC di 16 e la diagonale BD, tratteggiata, da trovare
% svg: rombo-esempio-diagonale-7134c4cc.svg 224x176
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (2.4,-1.8) -- (4.8,0) -- (2.4,1.8) -- cycle;
\draw[thick] (0,0) -- (2.4,-1.8) -- (4.8,0) -- (2.4,1.8) -- cycle;
\draw (0,0) -- (4.8,0);
\draw[dashed] (2.4,-1.8) -- (2.4,1.8);
\draw[thin] (2.56,0) -- (2.56,0.16) -- (2.4,0.16);
\draw (1.27,-0.81) -- (1.13,-0.99);
\draw (3.53,-0.81) -- (3.67,-0.99);
\draw (3.53,0.81) -- (3.67,0.99);
\draw (1.27,0.81) -- (1.13,0.99);
\node[left] at (0,0) {$A$};
\node[below] at (2.4,-1.8) {$B$};
\node[right] at (4.8,0) {$C$};
\node[above] at (2.4,1.8) {$D$};
\node[above] at (1.2,0) {\scriptsize $16$};
\node[right] at (2.4,-0.9) {\small $d_2$};
\end{tikzpicture}
```

Dalla formula dell'area, $\dfrac{16 \cdot d_2}{2} = 96$, cioè $8 \cdot d_2 = 96$, e $d_2 = 12$ cm.
```

```ad-warning
Le diagonali di un quadrilatero qualsiasi
La formula $\dfrac{d_1 \cdot d_2}{2}$ vale solo se le diagonali sono perpendicolari. Per un rettangolo non quadrato, o per un parallelogramma qualsiasi, dà un numero sbagliato: si usa base per altezza.
```

## Il poligono regolare

Un poligono è **regolare** se ha tutti i lati congruenti e tutti gli angoli congruenti, come il triangolo equilatero, il quadrato e l'esagono regolare. Ogni poligono regolare ha un centro $O$, che ha la stessa distanza da tutti i vertici e la stessa distanza da tutti i lati; la distanza del centro da un lato si chiama **apotema**, e si indica con $a$. I poligoni regolari e il loro centro sono nella lezione [Poligoni inscritti e circoscritti](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/poligoni-inscritti-e-circoscritti).

Unendo il centro ai vertici, un poligono regolare di $n$ lati si divide in $n$ triangoli isosceli congruenti. Ognuno ha per base un lato $\ell$ e per altezza l'apotema $a$.

```tikz
% nome: poligono-regolare-triangoli-apotema
% alt: Un esagono regolare di centro O diviso in sei triangoli isosceli congruenti dai segmenti che uniscono O ai vertici; in uno dei triangoli, colorato, l'apotema a è l'altezza relativa al lato
% svg: poligono-regolare-triangoli-apotema-3266dcbf.svg 118x120
\begin{tikzpicture}
\fill[blue!6] (1.5,0) -- (0.75,1.3) -- (-0.75,1.3) -- (-1.5,0) -- (-0.75,-1.3) -- (0.75,-1.3) -- cycle;
\fill[blue!20] (0,0) -- (-0.75,-1.3) -- (0.75,-1.3) -- cycle;
\draw[gray] (0,0) -- (1.5,0);
\draw[gray] (0,0) -- (0.75,1.3);
\draw[gray] (0,0) -- (-0.75,1.3);
\draw[gray] (0,0) -- (-1.5,0);
\draw[gray] (0,0) -- (-0.75,-1.3);
\draw[gray] (0,0) -- (0.75,-1.3);
\draw[thick] (1.5,0) -- (0.75,1.3) -- (-0.75,1.3) -- (-1.5,0) -- (-0.75,-1.3) -- (0.75,-1.3) -- cycle;
\draw[thick, blue!60!black] (0,0) -- (0,-1.3);
\draw[thin] (0.16,-1.3) -- (0.16,-1.14) -- (0,-1.14);
\fill (0,0) circle (0.05);
\node[above] at (0,0) {\small $O$};
\node[right] at (0.02,-0.65) {\small $a$};
\node[below] at (0,-1.32) {\small $\ell$};
\end{tikzpicture}
```

L'area del poligono è la somma delle aree degli $n$ triangoli:

$$A = n \cdot \frac{\ell \cdot a}{2} = \frac{P \cdot a}{2}$$

dove $P = n \cdot \ell$ è il perimetro. L'area di un poligono regolare è quindi il perimetro per l'apotema diviso due. Per il quadrato di lato $8$ cm l'apotema è metà del lato, $4$ cm, e la formula dà $\dfrac{32 \cdot 4}{2} = 64\ \text{cm}^2$, cioè proprio $8^2$.

```ad-example
Esempio 6: l'area di un pentagono regolare
Un pentagono regolare ha il lato di $10$ cm e l'apotema di $6{,}88$ cm (arrotondato ai centesimi). Calcola l'area.

```tikz
% nome: pentagono-regolare-esempio
% alt: Un pentagono regolare di centro O con il lato di 10 centimetri e l'apotema di 6,88 centimetri, perpendicolare al lato nel suo punto medio
% svg: pentagono-regolare-esempio-b9ed8088.svg 127x137
\begin{tikzpicture}
\fill[blue!8] (1,-1.38) -- (1.62,0.53) -- (0,1.7) -- (-1.62,0.53) -- (-1,-1.38) -- cycle;
\draw[thick] (1,-1.38) -- (1.62,0.53) -- (0,1.7) -- (-1.62,0.53) -- (-1,-1.38) -- cycle;
\draw[thick, blue!60!black] (0,0) -- (0,-1.38);
\draw[gray] (0,0) -- (1,-1.38);
\draw[gray] (0,0) -- (-1,-1.38);
\draw[thin] (0.14,-1.38) -- (0.14,-1.24) -- (0,-1.24);
\fill (0,0) circle (0.05);
\node[above] at (0,0) {\small $O$};
\node[right] at (0,-0.69) {\scriptsize $6{,}88$};
\node[below] at (0,-1.38) {\small $10$};
\end{tikzpicture}
```

Il perimetro è $P = 5 \cdot 10 = 50$ cm, quindi

$$A = \frac{50 \cdot 6{,}88}{2} = 172\ \text{cm}^2$$

L'apotema è arrotondato, e anche l'area lo è: con l'apotema esatto, l'area arrotondata ai centesimi è $172{,}05\ \text{cm}^2$.
```

```ad-note
Apotema e numeri fissi
L'apotema di un poligono regolare è proporzionale al lato: nel pentagono è circa $0{,}688$ volte il lato, nel quadrato $0{,}5$ volte. Per i poligoni più comuni questi rapporti, che alcuni libri chiamano numeri fissi, si trovano in tabella; per il triangolo equilatero e l'esagono si calcolano con il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide).
```

## Riepilogo delle formule

| Figura | Area |
|---|---|
| rettangolo | $b \cdot h$ |
| quadrato | $\ell^2$ oppure $\dfrac{d^2}{2}$ |
| parallelogramma | $b \cdot h$ |
| triangolo | $\dfrac{b \cdot h}{2}$ |
| trapezio | $\dfrac{(B + b) \cdot h}{2}$ |
| rombo | $\dfrac{d_1 \cdot d_2}{2}$ |
| poligono regolare | $\dfrac{P \cdot a}{2}$ |

## Problemi con le aree

Nei problemi l'area è spesso un dato, e si cerca una misura: un'altezza, una base, una diagonale. Si scrive la formula dell'area della figura, si sostituiscono i numeri noti e si ricava la misura che manca, come in un'[equazione di primo grado](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere). Le figure più complicate si dividono in figure di cui si conosce l'area.

```ad-example
Esempio 7: una figura composta
La figura è formata dal rettangolo $ABCD$, con $\overline{AB} = 8$ cm e $\overline{BC} = 5$ cm, e dal triangolo $DCE$, che ha la base $DC$ e l'altezza di $3$ cm. Calcola l'area.

```tikz
% nome: figura-composta-rettangolo-triangolo
% alt: Una figura a forma di casetta: il rettangolo ABCD di 8 per 5 e sopra il triangolo isoscele DCE con l'altezza di 3
% svg: figura-composta-rettangolo-triangolo-4b795c96.svg 171x167
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (3.36,0) -- (3.36,2.1) -- (0,2.1) -- cycle;
\fill[orange!20] (0,2.1) -- (3.36,2.1) -- (1.68,3.36) -- cycle;
\draw[thick] (0,0) -- (3.36,0) -- (3.36,2.1) -- (1.68,3.36) -- (0,2.1) -- cycle;
\draw[dashed] (0,2.1) -- (3.36,2.1);
\draw[dashed] (1.68,3.36) -- (1.68,2.1);
\draw[thin] (1.83,2.1) -- (1.83,2.25) -- (1.68,2.25);
\draw[thin] (0.18,0) -- (0.18,0.18) -- (0,0.18);
\draw[thin] (3.36,0.18) -- (3.18,0.18) -- (3.18,0);
\node[below left] at (0,0) {$A$};
\node[below right] at (3.36,0) {$B$};
\node[right] at (3.36,2.1) {$C$};
\node[left] at (0,2.1) {$D$};
\node[above] at (1.68,3.36) {$E$};
\node[below] at (1.68,0) {\small $8$};
\node[right] at (3.36,1.05) {\small $5$};
\node[right] at (1.68,2.73) {\small $3$};
\end{tikzpicture}
```

La figura è la somma del rettangolo e del triangolo, e il triangolo ha per base $DC$, lato del rettangolo, lungo $8$ cm:

$$
\begin{aligned}
A &= 8 \cdot 5 + \frac{8 \cdot 3}{2} \\
&= 40 + 12 = 52\ \text{cm}^2
\end{aligned}
$$
```

```ad-example
Esempio 8: un triangolo equivalente a un rettangolo
Un triangolo con la base di $12$ cm è equivalente a un rettangolo di $8$ cm per $6$ cm. Quanto misura l'altezza del triangolo?

```tikz
% nome: triangolo-equivalente-rettangolo
% alt: A sinistra un rettangolo di 8 per 6, a destra un triangolo con la base di 12 e l'altezza h da trovare, equivalente al rettangolo
% svg: triangolo-equivalente-rettangolo-88d54b7e.svg 216x96
\begin{tikzpicture}
\fill[blue!12] (0,0) -- (2,0) -- (2,1.5) -- (0,1.5) -- cycle;
\draw[thick] (0,0) -- (2,0) -- (2,1.5) -- (0,1.5) -- cycle;
\fill[blue!12] (2.6,0) -- (5.6,0) -- (3.6,2) -- cycle;
\draw[thick] (2.6,0) -- (5.6,0) -- (3.6,2) -- cycle;
\draw[dashed] (3.6,2) -- (3.6,0);
\draw[thin] (3.75,0) -- (3.75,0.15) -- (3.6,0.15);
\node[below] at (1,0) {\small $8$};
\node[right] at (2,0.75) {\small $6$};
\node[below] at (4.1,0) {\small $12$};
\node[right] at (3.6,1) {\small $h$};
\end{tikzpicture}
```

Figure equivalenti hanno la stessa area. Il rettangolo ha l'area di $8 \cdot 6 = 48\ \text{cm}^2$, quindi

$$\frac{12 \cdot h}{2} = 48$$

cioè $6 \cdot h = 48$ e $h = 8$ cm.
```

```ad-warning
Unità di misura diverse nei dati
Se una misura è in metri e l'altra in centimetri, prima si portano alla stessa unità e poi si moltiplica. Il prodotto $1{,}2 \cdot 45 = 54$ non è un'area in nessuna unità: l'area giusta è $120 \cdot 45 = 5400\ \text{cm}^2$.
```
