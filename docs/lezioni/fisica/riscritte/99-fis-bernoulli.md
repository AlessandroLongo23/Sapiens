# L'equazione di Bernoulli

In un tubo che si stringe l'acqua accelera: lo dice l'[equazione di continuità](/materiale/scuola-superiore/fisica/la-meccanica-dei-fluidi/la-portata-e-l-equazione-di-continuita). Ma un corpo accelera solo se una forza lo spinge, e sull'acqua che entra nel tratto stretto l'unica cosa che può spingere è l'altra acqua: quella che sta dietro deve premere più di quella che sta davanti. Dove il fluido va più veloce, quindi, la pressione è più bassa. L'equazione di Bernoulli mette questa idea in una formula, e ci aggiunge l'effetto della quota. Porta il nome dello svizzero Daniel Bernoulli, che la pubblicò nel 1738, e non è una legge nuova: è la conservazione dell'energia scritta per un fluido che scorre.

## Che cosa lega l'equazione

Le ipotesi sono quelle della lezione precedente: un fluido ideale (incomprimibile e non viscoso) in una corrente stazionaria. Si guarda un tubo di flusso che cambia sezione e cambia quota, e in esso due sezioni, la 1 e la 2. In ognuna il fluido ha tre grandezze:

- la **pressione** $p$;
- la **velocità** $v$;
- la **quota** $h$, cioè l'altezza della sezione sopra un livello di riferimento scelto a piacere (il pavimento, il suolo).

L'equazione di continuità lega tra loro le due velocità. L'equazione di Bernoulli lega tutte e sei le grandezze.

```tikz
% nome: bernoulli-tubo-sezioni-quote
% alt: Un tubo pieno d'acqua con un tratto largo in basso a sinistra, sezione 1, e un tratto stretto in alto a destra, sezione 2. In ognuno è evidenziato un volumetto di fluido delta V: largo e corto nel tratto 1, lungo delta x1, stretto e lungo nel tratto 2, lungo delta x2. Una freccia rossa p1 S1 spinge il fluido da sinistra, una freccia rossa p2 S2 lo spinge indietro da destra; due frecce blu indicano le velocità v1, corta, e v2, lunga il doppio. Le quote h1 e h2 dei due tratti sono misurate da una linea di riferimento in basso
\begin{tikzpicture}
\fill[cyan!20] (0,0) -- (2.4,0) -- (4.2,2.2) -- (7.2,2.2) -- (7.2,2.7) -- (4.0,2.7) -- (2.2,1) -- (0,1) -- cycle;
\fill[cyan!45] (0.4,0) rectangle (1,1);
\fill[cyan!45] (5.7,2.2) rectangle (6.9,2.7);
\draw[thick] (0,0) -- (2.4,0) -- (4.2,2.2) -- (7.2,2.2);
\draw[thick] (0,1) -- (2.2,1) -- (4.0,2.7) -- (7.2,2.7);
\draw[thin] (0.4,0) -- (0.4,1);
\draw[thin] (1,0) -- (1,1);
\draw[thin] (5.7,2.2) -- (5.7,2.7);
\draw[thin] (6.9,2.2) -- (6.9,2.7);
\draw[-{Stealth}, thick, red] (-0.9,0.5) -- (0.35,0.5) node[above, pos=0.35] {$p_1 S_1$};
\draw[-{Stealth}, thick, red] (8.3,2.45) -- (6.95,2.45) node[above, pos=0.3] {$p_2 S_2$};
\draw[-{Stealth}, thick, blue!60!black] (1.3,0.5) -- (1.9,0.5) node[above] {$\vec{v}_1$};
\draw[-{Stealth}, thick, blue!60!black] (4.35,2.45) -- (5.55,2.45);
\node[above, blue!60!black] at (4.95,2.7) {$\vec{v}_2$};
\draw[{Stealth}-{Stealth}, thin] (0.4,-0.25) -- (1,-0.25);
\node[below] at (0.7,-0.25) {\small $\Delta x_1$};
\draw[{Stealth}-{Stealth}, thin] (5.7,1.95) -- (6.9,1.95);
\node[below] at (6.3,1.95) {\small $\Delta x_2$};
\draw[dashed, thin] (-0.9,-1.1) -- (9,-1.1);
\draw[{Stealth}-{Stealth}, thin] (2.9,-1.1) -- (2.9,0.5);
\draw[dashed, thin] (1.9,0.5) -- (3.0,0.5);
\node[right] at (2.9,-0.5) {$h_1$};
\draw[dashed, thin] (8.3,2.45) -- (8.8,2.45);
\draw[{Stealth}-{Stealth}, thin] (8.7,-1.1) -- (8.7,2.45);
\node[left] at (8.7,0.6) {$h_2$};
\end{tikzpicture}
```

## Da dove viene: il bilancio dell'energia

In un breve intervallo di tempo $\Delta t$ nella sezione 1 entra un volumetto di fluido $\Delta V$, e poiché il fluido è incomprimibile dalla sezione 2 ne esce uno uguale. Tra le due sezioni non è cambiato niente: il risultato è lo stesso che si avrebbe prendendo il volumetto $\Delta V$, di massa $\Delta m = d \cdot \Delta V$, e portandolo dalla sezione 1, dove ha velocità $v_1$ e quota $h_1$, alla sezione 2, dove ha velocità $v_2$ e quota $h_2$.

Chi fa lavoro su questo fluido? Il fluido che sta dietro lo spinge in avanti con la forza $F_1 = p_1 \cdot S_1$ (la [pressione](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione) è forza diviso superficie) per uno spostamento $\Delta x_1$, e compie un lavoro positivo:

$$W_1 = p_1 \cdot S_1 \cdot \Delta x_1 = p_1 \cdot \Delta V$$

perché $S_1 \cdot \Delta x_1$ è proprio il volumetto entrato. Il fluido che sta davanti lo spinge all'indietro con la forza $F_2 = p_2 \cdot S_2$, contro lo spostamento $\Delta x_2$, e compie un lavoro negativo:

$$W_2 = -p_2 \cdot S_2 \cdot \Delta x_2 = -p_2 \cdot \Delta V$$

Le pareti del tubo spingono in direzione perpendicolare al moto e non lavorano; attriti non ce ne sono, perché il fluido è ideale. Il lavoro delle forze di pressione, che non sono il peso, è uguale alla variazione dell'energia meccanica del fluido (è il [bilancio dell'energia](/materiale/scuola-superiore/fisica/il-lavoro-e-le-forze-conservative/il-bilancio-dell-energia-con-le-forze-non-conservative), $W_{nc} = \Delta E$):

$$p_1 \cdot \Delta V - p_2 \cdot \Delta V = \left(\frac{1}{2}\,\Delta m\,v_2^2 - \frac{1}{2}\,\Delta m\,v_1^2\right) + \left(\Delta m\,g\,h_2 - \Delta m\,g\,h_1\right)$$

Si sostituisce $\Delta m = d \cdot \Delta V$, si divide tutto per $\Delta V$ e si portano a sinistra i termini con l'indice 1 e a destra quelli con l'indice 2:

$$p_1 + \frac{1}{2}\,d\,v_1^2 + d\,g\,h_1 = p_2 + \frac{1}{2}\,d\,v_2^2 + d\,g\,h_2$$

## L'equazione di Bernoulli

Le sezioni 1 e 2 sono due sezioni qualsiasi. Quindi, lungo una linea di flusso di un fluido ideale in corrente stazionaria, la somma dei tre termini ha lo stesso valore in ogni punto. È l'**equazione di Bernoulli**:

$$p + \frac{1}{2}\,d\,v^2 + d\,g\,h = \text{costante}$$

dove $p$ è la pressione, $d$ la densità del fluido, $v$ la sua velocità, $h$ la quota e $g = 9{,}8\,\text{m/s}^2$.

I tre termini sono tutti pressioni e si misurano in pascal. Per il secondo e il terzo si controlla così:

$$\left[d\,v^2\right] = \frac{\text{kg}}{\text{m}^3} \cdot \frac{\text{m}^2}{\text{s}^2} = \frac{\text{kg}}{\text{m} \cdot \text{s}^2} = \frac{\text{N}}{\text{m}^2} = \text{Pa} \qquad\qquad \left[d\,g\,h\right] = \frac{\text{kg}}{\text{m}^3} \cdot \frac{\text{m}}{\text{s}^2} \cdot \text{m} = \text{Pa}$$

Il pascal è anche un joule al metro cubo, $\text{N/m}^2 = \text{J/m}^3$, e questo dice che cosa sono i tre termini: $\tfrac{1}{2} d\,v^2$ è l'[energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica) di un metro cubo di fluido, $d\,g\,h$ la sua [energia potenziale gravitazionale](/materiale/scuola-superiore/fisica/lavoro-ed-energia/energia-potenziale-gravitazionale-ed-elastica), e $p$ il lavoro che le forze di pressione fanno per spingere avanti un metro cubo di fluido. Lungo il tubo l'energia passa da un termine all'altro, ma la somma non cambia.

Per avere un'idea delle grandezze: per l'acqua, che ha $d = 1000\,\text{kg/m}^3$, a $2{,}0\,\text{m/s}$ il termine cinetico vale $\tfrac{1}{2} \cdot 1000 \cdot 2{,}0^2 = 2{,}0 \cdot 10^3\,\text{Pa}$, e un dislivello di $1{,}0\,\text{m}$ vale $1000 \cdot 9{,}8 \cdot 1{,}0 = 9{,}8 \cdot 10^3\,\text{Pa}$. La pressione atmosferica, $1{,}01 \cdot 10^5\,\text{Pa}$, è molto più grande di tutti e due.

```ad-warning
La quota non è la profondità
Nella [legge di Stevino](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-legge-di-stevino-e-i-vasi-comunicanti) $h$ è la profondità e si misura dalla superficie verso il basso. Qui $h$ è la quota e si misura da un livello di riferimento verso l'alto: una sezione più in alto ha $h$ più grande e, a parità del resto, pressione più bassa. Il livello di riferimento si sceglie come conviene, di solito alla quota della sezione più bassa, che così ha $h = 0$.
```

```ad-note
Quando vale
L'equazione vale per un fluido ideale in corrente stazionaria, e confronta punti sulla stessa linea di flusso. In un tubo vero l'attrito interno del fluido fa perdere pressione lungo il percorso anche se sezione e quota non cambiano: è l'argomento della lezione [L'attrito viscoso e la velocità limite](/materiale/scuola-superiore/fisica/la-meccanica-dei-fluidi/l-attrito-viscoso-e-la-velocita-limite). Per tubi corti e fluidi poco viscosi come l'acqua e l'aria, l'equazione di Bernoulli dà risultati vicini a quelli misurati.
```

## Tre casi particolari

### Il fluido è fermo

Se il fluido non si muove, $v_1 = v_2 = 0$ e restano solo due termini:

$$p_1 + d\,g\,h_1 = p_2 + d\,g\,h_2 \qquad \text{cioè} \qquad p_1 - p_2 = d\,g\,(h_2 - h_1)$$

Il punto più basso ha la pressione più alta, e la differenza è $d \cdot g$ per il dislivello: è la legge di Stevino. L'equazione di Bernoulli la contiene come caso particolare.

### Il tubo è orizzontale

Se le due sezioni sono alla stessa quota, $h_1 = h_2$ e i termini con $d\,g\,h$ si semplificano:

$$p_1 + \frac{1}{2}\,d\,v_1^2 = p_2 + \frac{1}{2}\,d\,v_2^2$$

Dove la velocità è più grande la pressione è più piccola, e viceversa. Messa insieme all'equazione di continuità: in una strozzatura il fluido accelera e la sua pressione scende; quando il tubo si riallarga il fluido rallenta e la pressione risale. Lo si vede montando sul tubo dei tubicini verticali aperti in alto: l'acqua vi sale tanto più in alto quanto più grande è la pressione nel punto sotto.

```tikz
% nome: tubo-orizzontale-strozzatura-tubicini
% alt: Un tubo orizzontale pieno d'acqua con una strozzatura al centro. Su ognuno dei tre tratti è montato un tubicino verticale aperto in alto: nei due tratti larghi, dove l'acqua è lenta, l'acqua nel tubicino sale in alto; nel tratto stretto, dove l'acqua è veloce, sale molto meno. Frecce blu indicano la velocità, corta nei tratti larghi e lunga nella strozzatura
\begin{tikzpicture}
\fill[cyan!20] (0,-0.6) -- (2,-0.6) -- (3,-0.3) -- (5,-0.3) -- (6,-0.6) -- (8,-0.6) -- (8,0.6) -- (6,0.6) -- (5,0.3) -- (3,0.3) -- (2,0.6) -- (0,0.6) -- cycle;
\fill[cyan!20] (0.85,0.6) rectangle (1.15,2.6);
\fill[cyan!20] (3.85,0.3) rectangle (4.15,1.3);
\fill[cyan!20] (6.85,0.6) rectangle (7.15,2.6);
\draw[thick] (0,-0.6) -- (2,-0.6) -- (3,-0.3) -- (5,-0.3) -- (6,-0.6) -- (8,-0.6);
\draw[thick] (0,0.6) -- (0.85,0.6) -- (0.85,3.1);
\draw[thick] (1.15,3.1) -- (1.15,0.6) -- (2,0.6) -- (3,0.3) -- (3.85,0.3) -- (3.85,3.1);
\draw[thick] (4.15,3.1) -- (4.15,0.3) -- (5,0.3) -- (6,0.6) -- (6.85,0.6) -- (6.85,3.1);
\draw[thick] (7.15,3.1) -- (7.15,0.6) -- (8,0.6);
\draw[thin] (0.85,2.6) -- (1.15,2.6);
\draw[thin] (3.85,1.3) -- (4.15,1.3);
\draw[thin] (6.85,2.6) -- (7.15,2.6);
\draw[-{Stealth}, thick, blue!60!black] (0.3,0) -- (0.8,0);
\draw[-{Stealth}, thick, blue!60!black] (3.1,0) -- (5.1,0);
\draw[-{Stealth}, thick, blue!60!black] (6.9,0) -- (7.4,0);
\node[below] at (1,-0.65) {\small lenta, $p$ alta};
\node[below] at (4,-0.35) {\small veloce, $p$ bassa};
\node[below] at (7,-0.65) {\small lenta, $p$ alta};
\end{tikzpicture}
```

```ad-warning
Nella strozzatura la pressione scende, non sale
Viene spontaneo pensare che dove il tubo si stringe il fluido sia "più schiacciato" e quindi a pressione più alta. È il contrario: il fluido arriva alla strozzatura spinto dalla pressione più alta che ha alle spalle, e proprio perché davanti la pressione è più bassa accelera. Pressione alta dove il fluido è lento, pressione bassa dove è veloce.
```

### La sezione non cambia

Se il tubo ha la stessa sezione dappertutto, per la continuità $v_1 = v_2$ e i termini cinetici si semplificano:

$$p_1 + d\,g\,h_1 = p_2 + d\,g\,h_2$$

La formula è quella del fluido fermo: in un tubo di sezione costante la pressione cambia con la quota come in un liquido in quiete, anche se il liquido scorre.

## Come si usa

1. Scegli le due sezioni: una dove conosci tutto, l'altra dove sta l'incognita.
2. Scegli il livello di riferimento per le quote, di solito alla sezione più bassa.
3. Se manca una velocità, trovala con l'equazione di continuità, $S_1 v_1 = S_2 v_2$.
4. Scrivi l'equazione di Bernoulli tra le due sezioni e togli i termini uguali (quote uguali, velocità uguali).
5. Ricava l'incognita, con tutte le grandezze nelle unità del Sistema Internazionale.

```ad-example
Esempio 1: un tubo orizzontale che si stringe
In un tubo orizzontale l'acqua scorre a $2{,}0\,\text{m/s}$ con una pressione di $1{,}50 \cdot 10^5\,\text{Pa}$. In una strozzatura la velocità sale a $8{,}0\,\text{m/s}$. Quanto vale lì la pressione?

Le quote sono uguali, e resta $p_1 + \tfrac{1}{2} d\,v_1^2 = p_2 + \tfrac{1}{2} d\,v_2^2$. Si ricava $p_2$:

$$p_2 = p_1 - \frac{1}{2}\,d\,(v_2^2 - v_1^2)$$

$$\frac{1}{2}\,d\,(v_2^2 - v_1^2) = \frac{1}{2} \cdot 1000\,\frac{\text{kg}}{\text{m}^3} \cdot \left(64 - 4{,}0\right)\frac{\text{m}^2}{\text{s}^2} = 3{,}0 \cdot 10^4\,\text{Pa}$$

$$p_2 = 1{,}50 \cdot 10^5\,\text{Pa} - 0{,}30 \cdot 10^5\,\text{Pa} = 1{,}20 \cdot 10^5\,\text{Pa}$$

La velocità è diventata quattro volte più grande e la pressione è scesa di un quinto.
```

```ad-warning
Si sottraggono i quadrati, non si eleva la differenza
$v_2^2 - v_1^2$ non è $(v_2 - v_1)^2$. Con $8{,}0$ e $2{,}0\,\text{m/s}$ il primo vale $64 - 4{,}0 = 60\,\text{m}^2/\text{s}^2$, il secondo $36\,\text{m}^2/\text{s}^2$. È lo stesso errore di chi somma le velocità al posto delle energie nella [conservazione dell'energia meccanica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-conservazione-dell-energia-meccanica).
```

```ad-example
Esempio 2: l'acqua che sale al terzo piano
All'ingresso di un palazzo, al livello della strada, l'acqua nella tubatura ha una pressione di $3{,}00 \cdot 10^5\,\text{Pa}$. Il tubo sale, sempre con la stessa sezione, fino a un rubinetto del terzo piano, $9{,}0\,\text{m}$ più in alto. Quanto vale la pressione dell'acqua che scorre in quel punto?

La sezione è la stessa, quindi $v_1 = v_2$. Con il riferimento alla strada, $h_1 = 0$ e $h_2 = 9{,}0\,\text{m}$:

$$p_2 = p_1 - d\,g\,h_2 = 3{,}00 \cdot 10^5\,\text{Pa} - 1000\,\frac{\text{kg}}{\text{m}^3} \cdot 9{,}8\,\frac{\text{m}}{\text{s}^2} \cdot 9{,}0\,\text{m}$$

$$p_2 = 3{,}00 \cdot 10^5\,\text{Pa} - 0{,}88 \cdot 10^5\,\text{Pa} = 2{,}12 \cdot 10^5\,\text{Pa}$$

Ogni metro di salita costa all'acqua circa $10^4\,\text{Pa}$, un decimo di atmosfera: per questo nei palazzi alti servono le pompe.
```

Nell'ultimo esempio cambiano insieme sezione e quota, e i tre termini entrano tutti.

```ad-example
Esempio 3: più in alto e più stretto
In cantina un tubo dell'acqua di diametro $4{,}0\,\text{cm}$ porta acqua a $1{,}5\,\text{m/s}$ con una pressione di $3{,}00 \cdot 10^5\,\text{Pa}$. Il tubo sale di $5{,}0\,\text{m}$ e si stringe fino a un diametro di $2{,}0\,\text{cm}$. Quanto valgono la velocità e la pressione dell'acqua nel tratto in alto?

La velocità viene dalla continuità. Il diametro si dimezza, quindi la sezione diventa un quarto:

$$v_2 = v_1 \cdot \left(\frac{D_1}{D_2}\right)^2 = 1{,}5\,\frac{\text{m}}{\text{s}} \cdot \left(\frac{4{,}0\,\text{cm}}{2{,}0\,\text{cm}}\right)^2 = 6{,}0\,\frac{\text{m}}{\text{s}}$$

Con il riferimento in cantina ($h_1 = 0$, $h_2 = 5{,}0\,\text{m}$) l'equazione di Bernoulli dà

$$p_2 = p_1 - \frac{1}{2}\,d\,(v_2^2 - v_1^2) - d\,g\,h_2$$

$$\frac{1}{2}\,d\,(v_2^2 - v_1^2) = \frac{1}{2} \cdot 1000\,\frac{\text{kg}}{\text{m}^3} \cdot (36 - 2{,}25)\,\frac{\text{m}^2}{\text{s}^2} \approx 0{,}17 \cdot 10^5\,\text{Pa}$$

$$d\,g\,h_2 = 1000\,\frac{\text{kg}}{\text{m}^3} \cdot 9{,}8\,\frac{\text{m}}{\text{s}^2} \cdot 5{,}0\,\text{m} = 0{,}49 \cdot 10^5\,\text{Pa}$$

$$p_2 = (3{,}00 - 0{,}17 - 0{,}49) \cdot 10^5\,\text{Pa} = 2{,}34 \cdot 10^5\,\text{Pa}$$

La pressione è scesa per due motivi: una parte è servita a far salire l'acqua, una parte più piccola a farla accelerare.
```

La figura mostra il bilancio dell'esempio 3: le due colonne sono alte uguali, ma in alto una fetta di pressione è diventata energia cinetica e un'altra energia potenziale. I numeri sono in unità di $10^5\,\text{Pa}$.

```tikz
% nome: bernoulli-barre-esempio-tre-termini
% alt: Due colonne della stessa altezza, una per la sezione 1 in cantina e una per la sezione 2 in alto. La prima è quasi tutta pressione, 3,00 per dieci alla quinta pascal, con una fetta sottilissima di termine cinetico. La seconda è divisa in tre fette: pressione 2,34, termine cinetico 0,18 e termine della quota 0,49, in unità di dieci alla quinta pascal. Una linea tratteggiata segna la cima comune
\begin{tikzpicture}
\draw[thick] (0,0) -- (6.2,0);
\draw[thick, fill=blue!10] (0.8,0) rectangle (1.8,3.6);
\draw[thick, fill=orange!25] (0.8,3.6) rectangle (1.8,3.614);
\draw[thick, fill=blue!10] (3.6,0) rectangle (4.6,2.81);
\draw[thick, fill=orange!25] (3.6,2.81) rectangle (4.6,3.026);
\draw[thick, fill=green!15] (3.6,3.026) rectangle (4.6,3.614);
\draw[dashed, thin] (0.4,3.614) -- (6.2,3.614);
\node[below] at (1.3,0) {sezione 1};
\node[below] at (4.1,0) {sezione 2};
\node at (1.3,1.8) {$p_1$};
\node at (4.1,1.4) {$p_2$};
\node[right] at (1.8,3.3) {\small $3{,}00$};
\node[right] at (4.6,1.4) {\small $2{,}34$};
\node[right] at (4.6,2.9) {\small $0{,}18$: $\frac{1}{2} d\,v^2$};
\node[right] at (4.6,3.33) {\small $0{,}49$: $d\,g\,h$};
\node[above] at (3.1,3.65) {\small totale $3{,}01 \cdot 10^5$ Pa};
\end{tikzpicture}
```

Nella figura qui sotto il tubo è quello dell'esempio 3, e puoi cambiare la velocità d'ingresso, il dislivello e il diametro del tratto in alto. La domanda: che cosa costa più pressione, salire di cinque metri o dimezzare il diametro?

```interattivo
% nome: bernoulli-tubo-barre
% alt: Un tubo che parte largo in basso e arriva a un tratto in alto, con tre cursori: la velocità dell'acqua all'ingresso, il dislivello da 0 a 8 metri e il diametro del tratto in alto da 2 a 4 centimetri. Accanto, due colonne della stessa altezza mostrano per le due sezioni la pressione, il termine cinetico e il termine della quota; sotto si leggono la velocità e la pressione nel tratto in alto
```

Con i dati dell'esempio 3 costa di più la salita: $0{,}49 \cdot 10^5\,\text{Pa}$ contro $0{,}17 \cdot 10^5\,\text{Pa}$. Ma il termine cinetico cresce con il quadrato della velocità: se l'acqua entra a $2{,}0\,\text{m/s}$, nel tratto stretto va a $8{,}0\,\text{m/s}$ e l'accelerazione costa $0{,}30 \cdot 10^5\,\text{Pa}$. In ogni caso le due colonne restano alte uguali: quello che la pressione perde lo guadagnano gli altri due termini.

## L'equazione vale anche per l'aria

L'aria, finché si muove a velocità molto più piccole di quella del suono, si comporta come un fluido incomprimibile di densità $d \approx 1{,}2\,\text{kg/m}^3$ (a temperatura ambiente e al livello del mare). La sua densità è circa ottocento volte più piccola di quella dell'acqua, e per questo il termine $d\,g\,h$ su dislivelli di qualche metro è trascurabile; il termine cinetico invece, con il vento forte, basta a fare danni.

```ad-example
Esempio 4: il vento sul tetto
Durante una tempesta il vento soffia a $30\,\text{m/s}$ sopra un tetto piano di $100\,\text{m}^2$. In casa, sotto il tetto, l'aria è ferma. Quale forza spinge il tetto verso l'alto?

L'aria sopra e sotto il tetto è praticamente alla stessa quota. Lontano dalla casa l'aria ferma e quella in moto hanno la stessa pressione totale, quindi tra l'aria ferma all'interno ($v_1 = 0$) e quella veloce sopra il tetto ($v_2 = 30\,\text{m/s}$):

$$p_1 - p_2 = \frac{1}{2}\,d\,v_2^2 = \frac{1}{2} \cdot 1{,}2\,\frac{\text{kg}}{\text{m}^3} \cdot \left(30\,\frac{\text{m}}{\text{s}}\right)^2 = 5{,}4 \cdot 10^2\,\text{Pa}$$

La pressione dentro casa è più grande di quella fuori, e la forza risultante sul tetto è

$$F = (p_1 - p_2) \cdot S = 5{,}4 \cdot 10^2\,\text{Pa} \cdot 100\,\text{m}^2 = 5{,}4 \cdot 10^4\,\text{N}$$

quanto il peso di una massa di cinque tonnellate e mezza. Una differenza di pressione di appena mezzo centesimo di atmosfera, su una superficie grande, può scoperchiare una casa: i tetti non vengono schiacciati dal vento, vengono sollevati.
```

Lo stesso effetto alza il foglio di carta quando soffi sopra di esso, avvicina due navi che procedono affiancate e tiene in aria gli aerei. Queste applicazioni, con il teorema di Torricelli e il tubo di Venturi, sono nella lezione [Il teorema di Torricelli e l'effetto Venturi](/materiale/scuola-superiore/fisica/la-meccanica-dei-fluidi/il-teorema-di-torricelli-e-l-effetto-venturi).
