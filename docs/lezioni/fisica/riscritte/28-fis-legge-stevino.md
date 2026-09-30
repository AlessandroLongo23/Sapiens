# La legge di Stevino e i vasi comunicanti

Chi si tuffa sul fondo di una piscina profonda sente premere sulle orecchie, e più scende più la spinta aumenta. Le dighe sono più spesse alla base che in cima, e i sub che scendono a trenta metri devono respirare aria a una pressione di quattro volte quella che c'è in superficie. Tutto questo viene da una sola legge, che lega la pressione in un liquido alla profondità: la legge di Stevino, dal nome del matematico fiammingo Simon Stevin, che la enunciò alla fine del Cinquecento.

## La pressione dovuta al peso del liquido

In un liquido fermo, ogni strato regge il peso di tutto il liquido che ha sopra. Si immagini una colonna verticale di liquido, alta $h$, con la base orizzontale di area $S$ alla profondità $h$ sotto la superficie libera.

```tikz
% nome: colonna-liquido-stevino
% alt: Un recipiente pieno d'acqua; al suo interno è tratteggiata una colonna verticale di liquido che va dalla superficie libera fino a una base orizzontale di area S, alla profondità h. Il peso P della colonna è una freccia rossa verso il basso, e sulla superficie libera preme l'aria con la pressione p0
% svg: colonna-liquido-stevino-5c5b9066.svg 155x125
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (4,2.6);
\draw[thin] (0,2.6) -- (4,2.6);
\draw[thick] (0,3.2) -- (0,0) -- (4,0) -- (4,3.2);
\draw[dashed] (1.5,2.6) -- (1.5,0.9) -- (2.5,0.9) -- (2.5,2.6);
\draw[thick] (1.5,0.9) -- (2.5,0.9);
\draw[-{Stealth}, thick, red] (2,1.75) -- (2,0.95) node[pos=0.4, right] {$\vec{P}$};
\fill (2,1.75) circle (1.5pt);
\node[below] at (2,0.9) {\small $S$};
\draw[{Stealth}-{Stealth}, thin] (3.2,2.6) -- (3.2,0.9);
\node[right] at (3.2,1.75) {$h$};
\draw[dashed, thin] (2.5,0.9) -- (3.35,0.9);
\node[above] at (2,2.65) {$p_0$};
\end{tikzpicture}
```

La colonna ha il volume $V = S \cdot h$ e, se il liquido ha densità $d$, la massa $m = d \cdot V = d \cdot S \cdot h$ (vedi [Grandezze derivate: area, volume e densità](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-derivate-area-volume-e-densita)). Il suo peso è

$$P = m \cdot g = d \cdot S \cdot h \cdot g$$

e preme sulla base di area $S$ con la pressione

$$\frac{P}{S} = \frac{d \cdot S \cdot h \cdot g}{S} = d \cdot g \cdot h$$

L'area $S$ si semplifica: la pressione dovuta al peso del liquido, la **pressione idrostatica**, dipende solo dalla densità del liquido e dalla profondità.

## La legge di Stevino

Sulla superficie libera il liquido non è scarico: di solito ci preme sopra l'aria, con la pressione atmosferica $p_0$, e per la [legge di Pascal](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-legge-di-pascal-e-il-torchio-idraulico) questa pressione arriva uguale in ogni punto del liquido. La pressione alla profondità $h$ è quindi la somma delle due. È la **legge di Stevino**:

$$p = p_0 + d \cdot g \cdot h$$

dove $d$ è la densità del liquido, $g = 9{,}8\,\text{N/kg}$ e $h$ è la profondità, cioè la distanza in verticale dalla superficie libera. Con $d$ in $\text{kg/m}^3$ e $h$ in metri la pressione esce in pascal:

$$[d \cdot g \cdot h] = \frac{\text{kg}}{\text{m}^3} \cdot \frac{\text{N}}{\text{kg}} \cdot \text{m} = \frac{\text{N}}{\text{m}^2} = \text{Pa}$$

Al livello del mare $p_0$ vale circa $1{,}013 \cdot 10^5\,\text{Pa}$, che negli esempi di questa lezione si arrotonda a $1{,}01 \cdot 10^5\,\text{Pa}$; come si misura, e perché cambia con l'altitudine, lo spiega [La pressione atmosferica e la sua misura](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione-atmosferica-e-la-sua-misura).

La legge dice due cose. La prima: la pressione cresce in modo lineare con la profondità, e il grafico di $p$ in funzione di $h$ è una retta che parte da $p_0$ (una [dipendenza lineare](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare)); la pressione idrostatica da sola, $d \cdot g \cdot h$, è direttamente proporzionale a $h$. La seconda: tutti i punti alla stessa profondità hanno la stessa pressione, cioè in un liquido fermo le superfici alla stessa pressione sono piani orizzontali. Tra due punti alle profondità $h_1$ e $h_2$ la differenza di pressione è

$$p_2 - p_1 = d \cdot g \cdot (h_2 - h_1)$$

e non dipende da $p_0$.

```ad-warning
La profondità si misura dalla superficie
$h$ è la distanza dalla superficie libera verso il basso, non l'altezza dal fondo. In una vasca con $1{,}8\,\text{m}$ d'acqua, un rubinetto a $30\,\text{cm}$ dal fondo sta alla profondità $h = 1{,}8\,\text{m} - 0{,}30\,\text{m} = 1{,}5\,\text{m}$, e la pressione idrostatica lì è $1000 \cdot 9{,}8 \cdot 1{,}5 \approx 1{,}5 \cdot 10^4\,\text{Pa}$, non $1000 \cdot 9{,}8 \cdot 0{,}30 \approx 2{,}9 \cdot 10^3\,\text{Pa}$.
```

```ad-warning
La densità in grammi al centimetro cubo
Nella formula la densità va in $\text{kg/m}^3$. Con l'acqua a $1\,\text{g/cm}^3$ scritta come $1$, a $10\,\text{m}$ di profondità verrebbe $1 \cdot 9{,}8 \cdot 10 = 98$, mille volte meno dei $9{,}8 \cdot 10^4\,\text{Pa}$ giusti. Prima si scrive $d = 1000\,\text{kg/m}^3$, poi si moltiplica. Anche la profondità va in metri: $40\,\text{cm} = 0{,}40\,\text{m}$.
```

## Esempi con la legge di Stevino

```ad-example
Esempio 1: dieci metri d'acqua
Quanto vale la pressione idrostatica a $10\,\text{m}$ di profondità in un lago d'acqua dolce? E la pressione totale, se in superficie c'è la pressione atmosferica di $1{,}01 \cdot 10^5\,\text{Pa}$?

$$d \cdot g \cdot h = 1000\,\frac{\text{kg}}{\text{m}^3} \cdot 9{,}8\,\frac{\text{N}}{\text{kg}} \cdot 10\,\text{m} = 9{,}8 \cdot 10^4\,\text{Pa}$$

$$p = p_0 + d \cdot g \cdot h = 1{,}01 \cdot 10^5\,\text{Pa} + 0{,}98 \cdot 10^5\,\text{Pa} = 1{,}99 \cdot 10^5\,\text{Pa}$$

Dieci metri d'acqua fanno una pressione quasi uguale a quella di tutta l'atmosfera: a $10\,\text{m}$ di profondità la pressione è circa il doppio che in superficie, e ogni dieci metri in più aumenta ancora di circa $10^5\,\text{Pa}$, cioè di circa $1\,\text{bar}$.
```

```ad-example
Esempio 2: un sub nel mare
Un sub scende a $25\,\text{m}$ di profondità nel mare, dove l'acqua salata ha la densità di $1030\,\text{kg/m}^3$. Quanto vale la pressione dell'acqua intorno a lui?

$$d \cdot g \cdot h = 1030\,\frac{\text{kg}}{\text{m}^3} \cdot 9{,}8\,\frac{\text{N}}{\text{kg}} \cdot 25\,\text{m} = 252\,350\,\text{Pa} \approx 2{,}5 \cdot 10^5\,\text{Pa}$$

$$p = 1{,}01 \cdot 10^5\,\text{Pa} + 2{,}52 \cdot 10^5\,\text{Pa} \approx 3{,}5 \cdot 10^5\,\text{Pa}$$

Il risultato ha due cifre significative, come la profondità: è circa tre volte e mezzo la pressione in superficie.
```

```ad-example
Esempio 3: il tappo della vasca
Una vasca da bagno è piena d'acqua per $40\,\text{cm}$. Il tappo sul fondo ha l'area di $12\,\text{cm}^2$. Con che forza l'acqua spinge sul tappo?

Sopra il tappo c'è l'acqua, sotto c'è l'aria dello scarico: la pressione atmosferica preme su tutte e due le facce e i suoi effetti si annullano. Conta solo la pressione idrostatica, con la profondità in metri:

$$d \cdot g \cdot h = 1000 \cdot 9{,}8 \cdot 0{,}40\,\text{Pa} = 3920\,\text{Pa}$$

e la forza è la pressione per l'area, in metri quadrati:

$$F = p \cdot S = 3920\,\text{Pa} \cdot 12 \cdot 10^{-4}\,\text{m}^2 \approx 4{,}7\,\text{N}$$

Quasi mezzo chilo: si sente quando si tira la catenella.
```

La pressione idrostatica dipende dalla densità: nello stesso punto, un liquido più denso preme di più.

```ad-example
Esempio 4: acqua e mercurio
Il mercurio ha la densità di $13\,600\,\text{kg/m}^3$. A che profondità, in acqua, c'è la stessa pressione idrostatica che sotto $10\,\text{cm}$ di mercurio?

Le due pressioni idrostatiche devono essere uguali, $d_{\text{acqua}} \cdot g \cdot h_{\text{acqua}} = d_{\text{mercurio}} \cdot g \cdot h_{\text{mercurio}}$. Il fattore $g$ si semplifica:

$$h_{\text{acqua}} = h_{\text{mercurio}} \cdot \frac{d_{\text{mercurio}}}{d_{\text{acqua}}} = 10\,\text{cm} \cdot \frac{13\,600}{1000} = 136\,\text{cm}$$

Serve una colonna d'acqua $13{,}6$ volte più alta.
```

## Il paradosso idrostatico

La legge di Stevino non contiene né la forma del recipiente né la quantità di liquido. Tre recipienti con il fondo della stessa area, uno cilindrico, uno che si allarga verso l'alto e uno che si stringe, riempiti d'acqua fino alla stessa altezza, hanno sul fondo la stessa pressione e quindi la stessa forza, anche se contengono quantità d'acqua molto diverse. È il **paradosso idrostatico**: paradosso perché sembra contraddire l'idea che il fondo regga il peso di tutto il liquido.

```tikz
% nome: paradosso-idrostatico
% alt: Tre recipienti pieni d'acqua fino alla stessa altezza h, con il fondo della stessa larghezza: il primo è un cilindro, il secondo si allarga verso l'alto e contiene molta più acqua, il terzo si stringe verso l'alto e ne contiene meno. Una linea tratteggiata orizzontale unisce le tre superfici libere; sul fondo di tutti e tre c'è la stessa pressione
% svg: paradosso-idrostatico-f4c48875.svg 293x135
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (1.2,2);
\draw[thin] (0,2) -- (1.2,2);
\draw[thick] (0,2.5) -- (0,0) -- (1.2,0) -- (1.2,2.5);
\fill[cyan!20] (2.4,0) -- (3.6,0) -- (4.4,2) -- (1.6,2) -- cycle;
\draw[thin] (1.6,2) -- (4.4,2);
\draw[thick] (1.4,2.5) -- (2.4,0) -- (3.6,0) -- (4.6,2.5);
\fill[cyan!20] (5.2,0) -- (6.4,0) -- (6.4,0.5) -- (6.05,1.2) -- (6.05,2) -- (5.55,2) -- (5.55,1.2) -- (5.2,0.5) -- cycle;
\draw[thin] (5.55,2) -- (6.05,2);
\draw[thick] (5.55,2.5) -- (5.55,1.2) -- (5.2,0.5) -- (5.2,0) -- (6.4,0) -- (6.4,0.5) -- (6.05,1.2) -- (6.05,2.5);
\draw[dashed, thin] (-0.3,2) -- (6.9,2);
\draw[{Stealth}-{Stealth}, thin] (-0.3,0) -- (-0.3,2);
\node[left] at (-0.3,1) {$h$};
\foreach \x in {0.6,3,5.8} \draw[-{Stealth}, thick, red] (\x,0.35) -- (\x,-0.4);
\node[below] at (3.2,-0.45) {\small stessa pressione sul fondo};
\end{tikzpicture}
```

Il paradosso si scioglie guardando le pareti. Nel recipiente che si allarga, le pareti inclinate reggono una parte del peso dell'acqua, e sul fondo arriva solo il peso della colonna verticale sopra di esso; in quello che si stringe, le pareti spingono l'acqua verso il basso (la forza del liquido su una parete è perpendicolare alla parete, come si è visto nella lezione [La pressione](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione), e la parete spinge il liquido con una forza uguale e opposta), e il fondo riceve più del peso dell'acqua che c'è.

```ad-example
Esempio 5: la forza sul fondo dei tre recipienti
I tre recipienti della figura hanno il fondo di area $50\,\text{cm}^2$ e sono pieni d'acqua fino a $30\,\text{cm}$. Quanto vale la forza dell'acqua sul fondo di ciascuno?

La pressione idrostatica sul fondo è la stessa per tutti e tre:

$$d \cdot g \cdot h = 1000 \cdot 9{,}8 \cdot 0{,}30\,\text{Pa} = 2940\,\text{Pa}$$

e la forza è la stessa: $F = 2940\,\text{Pa} \cdot 50 \cdot 10^{-4}\,\text{m}^2 \approx 15\,\text{N}$. È il peso dell'acqua del recipiente cilindrico, che ha il volume di $50 \cdot 30 = 1500\,\text{cm}^3$, cioè $1{,}5\,\text{kg}$ d'acqua; non è il peso dell'acqua degli altri due.
```

Prova tu: trascina il sensore nel liquido e cambia la forma del recipiente. La pressione letta dipende solo da quanto il sensore è sotto la superficie.

```interattivo
% nome: pressione-profondita
% alt: Un recipiente pieno di liquido con un sensore di pressione da trascinare in ogni punto del liquido; tre bottoni cambiano la forma del recipiente (dritto, che si allarga verso l'alto, che si stringe) e altri tre il liquido (acqua, acqua di mare, olio). Sotto la figura si leggono la profondità h del sensore, misurata dalla superficie libera, la pressione idrostatica d per g per h e la pressione totale; spostando il sensore in orizzontale, o cambiando la forma del recipiente, la pressione non cambia
```

```ad-warning
Più liquido non vuol dire più pressione
Una piscina grande e un tubo sottile, pieni d'acqua per $2\,\text{m}$, hanno sul fondo la stessa pressione idrostatica, circa $2 \cdot 10^4\,\text{Pa}$. Nella legge di Stevino ci sono la densità e la profondità, non il volume né la massa del liquido.
```

## I vasi comunicanti

Si chiamano **vasi comunicanti** due o più recipienti aperti in alto e collegati tra loro in basso, in modo che il liquido possa passare dall'uno all'altro. Versando un liquido in uno solo dei vasi, il liquido raggiunge lo stesso livello in tutti, qualunque sia la loro forma.

```tikz
% nome: vasi-comunicanti
% alt: Quattro vasi di forme diverse, uno largo, uno stretto, uno inclinato e uno che si allarga verso l'alto, collegati in basso da un tubo orizzontale e pieni d'acqua: in tutti l'acqua arriva allo stesso livello, segnato da una linea tratteggiata orizzontale
% svg: vasi-comunicanti-11d747b2.svg 269x102
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (6.2,0.4);
\fill[cyan!20] (0,0.4) rectangle (1.2,2);
\fill[cyan!20] (2,0.4) rectangle (2.4,2);
\fill[cyan!20] (3.2,0.4) -- (3.6,0.4) -- (4.4,2) -- (4,2) -- cycle;
\fill[cyan!20] (5.3,0.4) -- (5.7,0.4) -- (6.14,2) -- (5.08,2) -- cycle;
\draw[thin] (0,2) -- (1.2,2);
\draw[thin] (2,2) -- (2.4,2);
\draw[thin] (4,2) -- (4.4,2);
\draw[thin] (5.08,2) -- (6.14,2);
\draw[thick] (0,2.6) -- (0,0) -- (6.2,0) -- (6.2,0.4) -- (5.7,0.4) -- (6.3,2.6);
\draw[thick] (1.2,2.6) -- (1.2,0.4) -- (2,0.4) -- (2,2.6);
\draw[thick] (2.4,2.6) -- (2.4,0.4) -- (3.2,0.4) -- (4.3,2.6);
\draw[thick] (4.7,2.6) -- (3.6,0.4) -- (5.3,0.4) -- (5,2.6);
\draw[dashed, thin] (-0.3,2) -- (6.7,2);
\end{tikzpicture}
```

Il motivo è la legge di Stevino. Nel tubo in basso il liquido è fermo, quindi in due punti del tubo alla stessa quota la pressione è la stessa; sopra ogni vaso preme la stessa pressione atmosferica $p_0$, e quindi la stessa pressione $p_0 + d \cdot g \cdot h$ richiede la stessa profondità $h$ sotto le superfici libere: le superfici stanno alla stessa altezza. Se in un vaso il livello fosse più alto, lì la pressione in basso sarebbe maggiore e spingerebbe il liquido verso gli altri vasi, finché i livelli tornano uguali.

I vasi comunicanti sono dappertutto. Nell'annaffiatoio e nella caffettiera il livello nel beccuccio è quello del recipiente, e per questo il beccuccio deve arrivare in alto almeno quanto il bordo. Gli acquedotti portano l'acqua a un serbatoio sopra una collina o su una torre, e da lì arriva nelle case fino ai piani più bassi del livello del serbatoio. I muratori usano la livella ad acqua, un tubo trasparente pieno d'acqua con le due estremità aperte, per segnare punti alla stessa altezza su due pareti lontane.

### Due liquidi che non si mescolano

In un tubo a U pieno d'acqua si versa, da un solo lato, un liquido che non si mescola con l'acqua ed è meno denso, per esempio olio. L'olio resta sopra l'acqua, e i due livelli non sono più alla stessa altezza: la superficie dell'olio sta più in alto di quella dell'acqua dell'altro ramo.

Per capire di quanto si guarda la **superficie di separazione** tra olio e acqua, e il piano orizzontale che passa per essa. Sotto quel piano c'è solo acqua, ferma e collegata, quindi nei due rami alla sua quota la pressione è la stessa. Sopra quel piano, in un ramo c'è una colonna d'olio alta $h_1$, nell'altro una colonna d'acqua alta $h_2$, tutte e due misurate dal piano di separazione fino alla loro superficie libera. Le due pressioni sono uguali:

$$p_0 + d_1 \cdot g \cdot h_1 = p_0 + d_2 \cdot g \cdot h_2 \qquad \text{cioè} \qquad d_1 \cdot h_1 = d_2 \cdot h_2$$

Le altezze sono inversamente proporzionali alle densità: il liquido meno denso sta più in alto.

```tikz
% nome: tubo-a-u-due-liquidi
% alt: Un tubo a U con acqua in basso e nel ramo destro, e olio versato nel ramo sinistro sopra l'acqua. Una linea tratteggiata orizzontale passa per la superficie di separazione tra olio e acqua; sopra di essa la colonna d'olio, alta h1, arriva più in alto della colonna d'acqua del ramo destro, alta h2
% svg: tubo-a-u-due-liquidi-86f6313b.svg 162x148
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (2.4,0.6);
\fill[cyan!20] (0,0.6) rectangle (0.6,1.2);
\fill[yellow!20] (0,1.2) rectangle (0.6,3.2);
\fill[cyan!20] (1.8,0.6) rectangle (2.4,3.04);
\draw[thin] (0,3.2) -- (0.6,3.2);
\draw[thin] (0,1.2) -- (0.6,1.2);
\draw[thin] (1.8,3.04) -- (2.4,3.04);
\draw[thick] (0,3.8) -- (0,0) -- (2.4,0) -- (2.4,3.8);
\draw[thick] (0.6,3.8) -- (0.6,0.6) -- (1.8,0.6) -- (1.8,3.8);
\draw[dashed, thin] (-0.4,1.2) -- (2.8,1.2);
\draw[{Stealth}-{Stealth}, thin] (-0.3,1.2) -- (-0.3,3.2);
\node[left] at (-0.3,2.2) {$h_1$};
\draw[{Stealth}-{Stealth}, thin] (2.7,1.2) -- (2.7,3.04);
\node[right] at (2.7,2.12) {$h_2$};
\node[rotate=90] at (0.3,2.2) {\small olio};
\node[rotate=90] at (2.1,2.1) {\small acqua};
\end{tikzpicture}
```

```ad-warning
Le altezze partono dalla superficie di separazione
Nella formula $d_1 \cdot h_1 = d_2 \cdot h_2$ le altezze si misurano dal piano orizzontale che passa per la superficie di separazione, non dal fondo del tubo. L'acqua che sta sotto quel piano, nei due rami, è in equilibrio da sola e non entra nel conto.
```

```ad-example
Esempio 6: olio e acqua nel tubo a U
In un tubo a U con dell'acqua si versa olio d'oliva, di densità $920\,\text{kg/m}^3$, finché nel ramo sinistro la colonna d'olio sopra la superficie di separazione è alta $10{,}0\,\text{cm}$. Quanto è alta, nel ramo destro, la colonna d'acqua sopra lo stesso piano? Quale superficie libera sta più in alto, e di quanto?

$$h_2 = h_1 \cdot \frac{d_1}{d_2} = 10{,}0\,\text{cm} \cdot \frac{920}{1000} = 9{,}20\,\text{cm}$$

La superficie dell'olio sta più in alto di quella dell'acqua di $10{,}0\,\text{cm} - 9{,}20\,\text{cm} = 0{,}80\,\text{cm}$.
```

Il tubo a U serve anche a misurare la densità di un liquido che non si mescola con l'acqua: si misurano le due altezze e si ricava $d_1 = d_2 \cdot \dfrac{h_2}{h_1}$.

```ad-example
Esempio 7: la densità di un liquido sconosciuto
In un tubo a U con acqua si versa un liquido che non si mescola con essa. Sopra il piano della superficie di separazione, la colonna del liquido è alta $12{,}0\,\text{cm}$ e quella dell'acqua $9{,}6\,\text{cm}$. Quanto vale la densità del liquido?

$$d_1 = d_{\text{acqua}} \cdot \frac{h_2}{h_1} = 1000\,\frac{\text{kg}}{\text{m}^3} \cdot \frac{9{,}6\,\text{cm}}{12{,}0\,\text{cm}} = 800\,\text{kg/m}^3$$

Le altezze stanno in un rapporto, quindi possono restare in centimetri.
```

Nella figura puoi versare olio sopra l'acqua o sopra il mercurio, oppure acqua sopra il mercurio, e guardare come si spostano i livelli.

```interattivo
% nome: tubo-a-u-liquidi
% alt: Un tubo a U con un liquido in basso; un cursore versa in un ramo un secondo liquido che non si mescola con il primo, fino a una colonna di 12 centimetri, e tre bottoni scelgono la coppia di liquidi: acqua e olio, mercurio e acqua, mercurio e olio. Mentre si versa, la superficie di separazione scende in un ramo e il primo liquido sale nell'altro; una linea tratteggiata segna il piano della superficie di separazione, e sotto la figura si leggono le due altezze h1 e h2 sopra quel piano e i prodotti d1 per h1 e d2 per h2, che restano uguali
```

Il valore di $p_0$, il modo in cui si misura e unità come il millimetro di mercurio sono nella lezione [La pressione atmosferica e la sua misura](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione-atmosferica-e-la-sua-misura). Sulla differenza di pressione tra la parte alta e la parte bassa di un corpo immerso si basa invece la [spinta di Archimede](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-spinta-di-archimede-e-il-galleggiamento).
