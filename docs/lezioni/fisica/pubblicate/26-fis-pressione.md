# La pressione

Sulla neve fresca chi cammina con le scarpe sprofonda fino al ginocchio, mentre chi ha gli sci ai piedi resta in superficie, anche se pesa lo stesso. Un chiodo entra nel legno dalla punta e non dalla testa, e un coltello affilato taglia il pane meglio di uno che ha perso il filo. In tutti questi casi conta come la forza è distribuita sulla superficie su cui agisce: la grandezza che lo misura è la pressione.

## La definizione di pressione

Una forza che preme su una superficie la schiaccia tanto di più quanto più è grande e quanto più è piccola la superficie su cui si distribuisce. La **pressione** $p$ è il rapporto tra il modulo della forza perpendicolare alla superficie, $F_\perp$, e l'area $S$ della superficie:

$$p = \frac{F_\perp}{S}$$

La forza perpendicolare è la stessa [forza premente](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito) che compare nell'attrito. Per un corpo appoggiato su un piano orizzontale, senza altre forze verticali, è il suo [peso](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa), $F_\perp = m \cdot g$ con $g = 9{,}8\,\text{N/kg}$.

A parità di forza, la pressione è inversamente proporzionale all'area: su una superficie doppia la stessa forza dà metà della pressione (vedi [Proporzionalità inversa e quadratica](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-inversa-e-quadratica)). Per questo gli sci, che hanno un'area molto più grande delle suole delle scarpe, affondano poco, e la punta del chiodo, che ha un'area piccolissima, entra nel legno.

### Conta solo la componente perpendicolare

Se la forza è obliqua, come quella di una mano che spinge un carrello verso il basso e in avanti, si scompone in una componente perpendicolare alla superficie e in una parallela (vedi [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore)). Solo la componente perpendicolare preme sulla superficie; quella parallela tende a farla scorrere e non entra nella pressione.

```tikz
% nome: forza-obliqua-componente-perpendicolare
% alt: Un blocco appoggiato sul pavimento e spinto sulla faccia superiore da una forza F obliqua, rivolta verso il basso e verso destra, con le sue due componenti tratteggiate che arrivano nello stesso punto: F perpendicolare, verticale verso il basso, che preme sulla faccia, e F parallela, orizzontale verso destra, che non entra nella pressione
% svg: forza-obliqua-componente-perpendicolare-37223a2a.svg 155x99
\begin{tikzpicture}
\draw[thick] (0,0) -- (4,0);
\foreach \x in {0.15,0.3,...,4} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (2.2,0) rectangle (3.8,0.7);
\draw[dashed, thin] (1.3,2.1) -- (2.5,2.1);
\draw[dashed, thin] (1.3,2.1) -- (1.3,0.7);
\draw[-{Stealth}, thick, red] (1.3,2.1) -- (2.5,0.7);
\draw[-{Stealth}, thick, red, dashed] (2.5,2.1) -- (2.5,0.7) node[pos=0.45, right] {$\vec{F}_\perp$};
\draw[-{Stealth}, thick, red, dashed] (1.3,0.7) -- (2.5,0.7) node[pos=0.35, above] {$\vec{F}_\parallel$};
\node[red, left] at (1.3,2.1) {$\vec{F}$};
\fill (2.5,0.7) circle (1.5pt);
\end{tikzpicture}
```

La pressione è una grandezza scalare: ha un valore e un'unità, ma non una direzione. La direzione ce l'ha la forza, che è un vettore.

```ad-warning
La pressione non è una forza
Una forza grande non dà per forza una pressione grande, e viceversa: dipende anche dall'area. Un elefante pesa molto più di una persona, ma la persona con il tacco a spillo preme sul pavimento con una pressione molto più alta (esempio 2). Pressione e forza hanno anche unità diverse: il pascal e il newton.
```

## L'unità di misura: il pascal

Nel Sistema Internazionale la forza si misura in newton e l'area in metri quadrati, quindi la pressione si misura in newton al metro quadrato. Questa unità si chiama **pascal** (Pa), in onore di Blaise Pascal:

$$1\,\text{Pa} = 1\,\frac{\text{N}}{\text{m}^2}$$

Il pascal è una pressione piccola: un foglio di carta A4 appoggiato su un tavolo, che ha la massa di circa $5\,\text{g}$ e l'area di circa $0{,}06\,\text{m}^2$, preme con meno di $1\,\text{Pa}$. Per questo si usano spesso i multipli:

| Unità | Simbolo | In pascal | Dove si usa |
|---|---|---|---|
| ettopascal | hPa | $10^2\,\text{Pa}$ | previsioni del tempo |
| kilopascal | kPa | $10^3\,\text{Pa}$ | manometri, pressione di un gas in una siringa |
| megapascal | MPa | $10^6\,\text{Pa}$ | resistenza dei materiali, impianti idraulici |
| bar | bar | $10^5\,\text{Pa}$ | pneumatici, bombole |

Il bar non è un'unità del SI, ma è molto diffuso: la pressione di un pneumatico d'auto è di circa $2{,}2\,\text{bar}$, cioè $2{,}2 \cdot 10^5\,\text{Pa}$. Altre due unità, l'atmosfera e il millimetro di mercurio, vengono dalla misura della pressione dell'aria e sono spiegate nella lezione [La pressione atmosferica e la sua misura](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione-atmosferica-e-la-sua-misura).

### Le aree vanno in metri quadrati

Per avere la pressione in pascal la forza va in newton e l'area in metri quadrati. Le aree dei problemi sono spesso in centimetri o in millimetri quadrati, e il fattore di conversione va al quadrato, come spiega [Grandezze derivate: area, volume e densità](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-derivate-area-volume-e-densita):

$$1\,\text{cm}^2 = (10^{-2}\,\text{m})^2 = 10^{-4}\,\text{m}^2 \qquad 1\,\text{mm}^2 = (10^{-3}\,\text{m})^2 = 10^{-6}\,\text{m}^2$$

```ad-warning
I centimetri quadrati non convertiti
Con $F = 20\,\text{N}$ e $S = 4{,}0\,\text{cm}^2$, la divisione $\dfrac{20}{4{,}0} = 5{,}0$ dà la pressione in $\text{N/cm}^2$, non in pascal. In pascal è $\dfrac{20\,\text{N}}{4{,}0 \cdot 10^{-4}\,\text{m}^2} = 5{,}0 \cdot 10^4\,\text{Pa}$, diecimila volte di più. E $1\,\text{cm}^2$ è $10^{-4}\,\text{m}^2$, non $10^{-2}\,\text{m}^2$: il fattore $100$ tra centimetri e metri va al quadrato.
```

## Esempi di pressione

```ad-example
Esempio 1: con le scarpe e con gli sci
Una ragazza di $60\,\text{kg}$ sta in piedi sulla neve. Le suole delle sue scarpe hanno in tutto l'area di $0{,}040\,\text{m}^2$; i due sci, lunghi $1{,}70\,\text{m}$ e larghi $0{,}10\,\text{m}$, hanno l'area di $2 \cdot 1{,}70 \cdot 0{,}10 = 0{,}34\,\text{m}^2$. Che pressione esercita sulla neve nei due casi?

La forza premente è il peso: $F_\perp = m \cdot g = 60\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 588\,\text{N}$. Con le scarpe

$$p = \frac{F_\perp}{S} = \frac{588\,\text{N}}{0{,}040\,\text{m}^2} = 14\,700\,\text{Pa} \approx 1{,}5 \cdot 10^4\,\text{Pa}$$

e con gli sci

$$p = \frac{588\,\text{N}}{0{,}34\,\text{m}^2} \approx 1{,}7 \cdot 10^3\,\text{Pa}$$

I risultati hanno due cifre significative, come la massa. L'area degli sci è $8{,}5$ volte quella delle suole, e la pressione è $8{,}5$ volte più piccola.
```

```ad-example
Esempio 2: il tacco a spillo e l'elefante
Mentre cammina, una donna di $60\,\text{kg}$ in un certo istante poggia tutto il peso su un tacco a spillo, che tocca il pavimento con l'area di $1{,}0\,\text{cm}^2$. Un elefante di $5{,}0$ tonnellate sta fermo su quattro zampe, ognuna delle quali tocca il suolo con l'area di circa $0{,}10\,\text{m}^2$. Chi esercita la pressione più alta?

L'area del tacco va in metri quadrati: $1{,}0\,\text{cm}^2 = 1{,}0 \cdot 10^{-4}\,\text{m}^2$. Quindi

$$p_{\text{tacco}} = \frac{588\,\text{N}}{1{,}0 \cdot 10^{-4}\,\text{m}^2} \approx 5{,}9 \cdot 10^6\,\text{Pa}$$

L'elefante ha la massa di $5{,}0 \cdot 10^3\,\text{kg}$ e pesa $5{,}0 \cdot 10^3 \cdot 9{,}8 = 4{,}9 \cdot 10^4\,\text{N}$, distribuiti su $4 \cdot 0{,}10 = 0{,}40\,\text{m}^2$:

$$p_{\text{elefante}} = \frac{4{,}9 \cdot 10^4\,\text{N}}{0{,}40\,\text{m}^2} \approx 1{,}2 \cdot 10^5\,\text{Pa}$$

Il tacco preme sul pavimento con una pressione circa $50$ volte più alta di quella della zampa dell'elefante, anche se la forza è circa $80$ volte più piccola. Per questo i tacchi a spillo lasciano il segno sui pavimenti di legno.
```

```ad-example
Esempio 3: la testa e la punta del chiodo
Un chiodo viene spinto contro una tavola con una forza di $20\,\text{N}$. La testa, su cui preme il pollice, ha l'area di $1{,}0\,\text{cm}^2$; la punta tocca il legno con l'area di $0{,}10\,\text{mm}^2$. Quanto vale la pressione sul pollice e quanto quella sul legno?

Il chiodo, che è un solido, trasmette la forza di $20\,\text{N}$ dalla testa alla punta. Sul pollice

$$p = \frac{20\,\text{N}}{1{,}0 \cdot 10^{-4}\,\text{m}^2} = 2{,}0 \cdot 10^5\,\text{Pa}$$

e sul legno, con $0{,}10\,\text{mm}^2 = 0{,}10 \cdot 10^{-6}\,\text{m}^2 = 1{,}0 \cdot 10^{-7}\,\text{m}^2$,

$$p = \frac{20\,\text{N}}{1{,}0 \cdot 10^{-7}\,\text{m}^2} = 2{,}0 \cdot 10^8\,\text{Pa}$$

La forza è la stessa, la pressione sul legno è mille volte quella sul pollice: il legno cede, il pollice no.

```tikz
% nome: chiodo-testa-punta
% alt: Un chiodo verticale con la punta appoggiata su una tavola di legno; un pollice spinge sulla testa con una forza F verso il basso. La testa ha l'area di 1,0 centimetri quadrati, la punta di 0,10 millimetri quadrati: la forza è la stessa, la pressione sulla punta è mille volte più alta
% svg: chiodo-testa-punta-997d6dad.svg 194x137
\begin{tikzpicture}
\draw[thick, fill=orange!25] (-1.6,-0.5) rectangle (1.6,0);
\draw[thick, fill=gray!20] (-0.06,1.9) -- (0.06,1.9) -- (0.06,0.25) -- (0,0) -- (-0.06,0.25) -- cycle;
\draw[thick, fill=gray!20] (-0.45,1.9) rectangle (0.45,2.05);
\draw[-{Stealth}, thick, red] (0,3.0) -- (0,2.1) node[pos=0.4, right] {$\vec{F}$};
\draw[thin] (0.45,1.97) -- (1.1,1.97) node[right] {\small testa: $1{,}0$ cm$^2$};
\draw[thin] (0.03,0.05) -- (0.75,0.55) node[right] {\small punta: $0{,}10$ mm$^2$};
\end{tikzpicture}
```
```

La pressione cambia anche con la faccia su cui un corpo è appoggiato: il peso resta lo stesso, l'area no.

```ad-example
Esempio 4: un blocco appoggiato su tre facce diverse
Un blocco di $2{,}0\,\text{kg}$ ha la forma di un parallelepipedo di $20\,\text{cm}$ per $10\,\text{cm}$ per $5{,}0\,\text{cm}$. Che pressione esercita sul tavolo quando è appoggiato su ciascuna delle tre facce?

Il peso è $P = 2{,}0\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 19{,}6\,\text{N}$. Le tre facce hanno le aree

$$20 \cdot 10 = 200\,\text{cm}^2 = 2{,}0 \cdot 10^{-2}\,\text{m}^2 \qquad 20 \cdot 5{,}0 = 100\,\text{cm}^2 = 1{,}0 \cdot 10^{-2}\,\text{m}^2 \qquad 10 \cdot 5{,}0 = 50\,\text{cm}^2 = 5{,}0 \cdot 10^{-3}\,\text{m}^2$$

e le pressioni

$$\frac{19{,}6\,\text{N}}{2{,}0 \cdot 10^{-2}\,\text{m}^2} = 980\,\text{Pa} \qquad \frac{19{,}6\,\text{N}}{1{,}0 \cdot 10^{-2}\,\text{m}^2} \approx 2{,}0 \cdot 10^3\,\text{Pa} \qquad \frac{19{,}6\,\text{N}}{5{,}0 \cdot 10^{-3}\,\text{m}^2} \approx 3{,}9 \cdot 10^3\,\text{Pa}$$

Il primo risultato ha tre cifre, $980$; con due cifre significative è $9{,}8 \cdot 10^2\,\text{Pa}$. Ogni volta che l'area si dimezza, la pressione raddoppia.

```tikz
% nome: blocco-tre-facce
% alt: Lo stesso blocco di 20 per 10 per 5 centimetri appoggiato sul tavolo in tre modi: disteso sulla faccia più grande, di 200 centimetri quadrati, poi su un fianco di 100 centimetri quadrati, poi in piedi sulla faccia più piccola, di 50 centimetri quadrati; sotto ogni blocco la pressione, 980 pascal, circa 2000 pascal e circa 3900 pascal
% svg: blocco-tre-facce-406a0cee.svg 345x137
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (8.7,0);
\foreach \x in {-0.15,0,...,8.7} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0,0) rectangle (2,0.5);
\draw[thick, fill=blue!10] (0,0.5) -- (0.5,0.8) -- (2.5,0.8) -- (2,0.5) -- cycle;
\draw[thick, fill=blue!10] (2,0) -- (2.5,0.3) -- (2.5,0.8) -- (2,0.5) -- cycle;
\draw[thick, fill=blue!10] (3.4,0) rectangle (5.4,1);
\draw[thick, fill=blue!10] (3.4,1) -- (3.65,1.15) -- (5.65,1.15) -- (5.4,1) -- cycle;
\draw[thick, fill=blue!10] (5.4,0) -- (5.65,0.15) -- (5.65,1.15) -- (5.4,1) -- cycle;
\draw[thick, fill=blue!10] (7,0) rectangle (7.5,2);
\draw[thick, fill=blue!10] (7,2) -- (7.5,2.3) -- (8,2.3) -- (7.5,2) -- cycle;
\draw[thick, fill=blue!10] (7.5,0) -- (8,0.3) -- (8,2.3) -- (7.5,2) -- cycle;
\node[below] at (1.2,-0.2) {\small $S = 200$ cm$^2$};
\node[below] at (1.2,-0.65) {\small $p = 980$ Pa};
\node[below] at (4.5,-0.2) {\small $S = 100$ cm$^2$};
\node[below] at (4.5,-0.65) {\small $p \approx 2{,}0 \cdot 10^3$ Pa};
\node[below] at (7.5,-0.2) {\small $S = 50$ cm$^2$};
\node[below] at (7.5,-0.65) {\small $p \approx 3{,}9 \cdot 10^3$ Pa};
\end{tikzpicture}
```
```

Dalla definizione si ricavano anche la forza e l'area, come da ogni formula con tre grandezze:

$$F_\perp = p \cdot S \qquad S = \frac{F_\perp}{p}$$

```ad-example
Esempio 5: quanto devono essere grandi gli sci
Una neve fresca regge senza cedere una pressione di $2{,}0\,\text{kPa}$. Quale area minima devono avere gli sci di un ragazzo di $70\,\text{kg}$ perché non affondi?

Il peso è $F_\perp = 70\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 686\,\text{N}$ e la pressione va in pascal, $2{,}0\,\text{kPa} = 2{,}0 \cdot 10^3\,\text{Pa}$:

$$S = \frac{F_\perp}{p} = \frac{686\,\text{N}}{2{,}0 \cdot 10^3\,\text{Pa}} \approx 0{,}34\,\text{m}^2$$

È proprio l'area degli sci dell'esempio 1.
```

## La pressione nei solidi e nei fluidi

Un solido ha una forma propria e trasmette la forza che riceve nella direzione in cui la riceve: il chiodo dell'esempio 3 porta la spinta del pollice fino alla punta, e la punta preme sul legno solo verso il basso.

Un **fluido**, cioè un liquido o un gas, non ha una forma propria: prende quella del recipiente che lo contiene. Un fluido fermo non riesce a sopportare forze parallele a una superficie, perché sotto una forza del genere scorrerebbe; per questo la forza che un fluido in equilibrio esercita su una parete, sul fondo o su un corpo immerso è sempre perpendicolare alla superficie, qualunque sia la sua inclinazione.

```tikz
% nome: forze-liquido-pareti
% alt: Un recipiente con una parete verticale a sinistra, il fondo orizzontale e una parete inclinata a destra, pieno d'acqua. Le forze dell'acqua sulle pareti sono frecce rosse perpendicolari a ciascuna parete e rivolte verso l'esterno, più lunghe in basso che in alto; sul fondo le frecce sono verticali verso il basso
% svg: forze-liquido-pareti-350550d2.svg 199x146
\begin{tikzpicture}
\fill[cyan!20] (0,0) -- (3,0) -- (4.2,2.4) -- (0,2.4) -- cycle;
\draw[thin] (0,2.4) -- (4.2,2.4);
\draw[thick] (0,3) -- (0,0) -- (3,0) -- (4.5,3);
\foreach \y/\l in {1.8/0.25, 1.2/0.45, 0.6/0.65} \draw[-{Stealth}, thick, red] (0,\y) -- ++(-\l,0);
\foreach \x in {0.6,1.5,2.4} \draw[-{Stealth}, thick, red] (\x,0) -- ++(0,-0.75);
\foreach \t/\l in {0.25/0.65, 0.5/0.45, 0.75/0.25} \draw[-{Stealth}, thick, red] ($(3,0)!\t!(4.2,2.4)$) -- ++(-26.57:\l);
\end{tikzpicture}
```

Nella figura le frecce sono più lunghe in basso: la pressione di un liquido cresce con la profondità, come spiega [La legge di Stevino e i vasi comunicanti](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-legge-di-stevino-e-i-vasi-comunicanti). In un punto del fluido, però, la pressione ha lo stesso valore in tutte le direzioni: una piccola superficie messa in quel punto riceve la stessa forza comunque sia orientata, verso l'alto, verso il basso o di lato. Per questo, parlando di un fluido, si dice "la pressione in un punto" senza dire in che direzione.

### Il fluido ideale

Nello studio dei fluidi in equilibrio si usa un modello semplice, il **fluido ideale**, che ha due proprietà:

- è incomprimibile: il suo volume non cambia quando cambia la pressione;
- non è viscoso: non ha attriti interni, e i suoi strati scorrono l'uno sull'altro senza opporsi.

I liquidi sono quasi incomprimibili: per ridurre di un centesimo il volume dell'acqua serve una pressione di circa $2 \cdot 10^7\,\text{Pa}$, duecento volte quella dell'aria che ci circonda. Per questo, nelle lezioni di questo capitolo, un liquido si tratta come un fluido ideale. I gas invece si comprimono con facilità, come l'aria della siringa chiusa della lezione sulla proporzionalità inversa; il loro comportamento è descritto dalla [legge di Boyle](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-legge-di-boyle).

Come un fluido trasmette la pressione che riceve lo spiega la [legge di Pascal](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-legge-di-pascal-e-il-torchio-idraulico).
