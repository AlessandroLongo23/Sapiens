# Le leggi di Gay-Lussac

Una pallina da ping-pong ammaccata torna tonda se la tieni un minuto nell'acqua bollente: l'aria chiusa dentro, scaldandosi, spinge fuori la parete. Una bottiglia di plastica vuota, tappata in una stanza calda e messa nel congelatore, si accartoccia. Scaldare un gas ha due effetti possibili, e quale dei due si vede dipende dal recipiente: se le pareti possono muoversi cresce il volume, se sono rigide cresce la pressione. Le due leggi di Gay-Lussac descrivono questi due casi, e messe insieme portano a una scoperta che va oltre i gas: esiste una temperatura sotto la quale non si può scendere.

In chimica le stesse leggi si chiamano [legge di Charles e legge di Gay-Lussac](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/le-leggi-di-charles-e-di-gay-lussac) e si scrivono subito con la temperatura in kelvin. Qui si parte dai gradi Celsius, come fecero gli sperimentatori dell'Ottocento, perché è da lì che il kelvin viene fuori.

## La prima legge: il volume a pressione costante

Si chiude una certa quantità di gas in un cilindro con un pistone libero di scorrere, e si immerge il cilindro in un bagno d'acqua di cui si può cambiare la temperatura. Sul pistone premono sempre le stesse forze, l'aria esterna e il suo peso, quindi la [pressione del gas](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-legge-di-boyle) resta la stessa qualunque cosa succeda dentro. Una trasformazione a pressione costante si chiama **isobara**.

Scaldando il bagno il pistone sale. Misurando il volume a diverse temperature si trova che cresce in modo regolare: a ogni grado in più il volume aumenta sempre della stessa quantità. È lo stesso comportamento dei solidi e dei liquidi nella [dilatazione termica](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-dilatazione-termica), $\Delta V = \alpha\,V_0\,\Delta t$, e si scrive allo stesso modo. Se $V_0$ è il volume del gas a $0\,^\circ\text{C}$ e $t$ la temperatura in gradi Celsius, allora $\Delta t = t - 0 = t$ e il volume a quella temperatura è $V_0 + \alpha\,V_0\,t$, cioè

$$V = V_0\,(1 + \alpha\,t)$$

È la **prima legge di Gay-Lussac**, pubblicata da Joseph Louis Gay-Lussac nel 1802: a pressione costante, il volume di una data quantità di gas cresce in modo [lineare](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare) con la temperatura.

Fin qui niente di nuovo rispetto a un liquido. La sorpresa è nel coefficiente. Per i solidi e i liquidi $\alpha$ cambia da una sostanza all'altra; per i gas è lo stesso per tutti, aria, elio o anidride carbonica, e a qualunque pressione si faccia l'esperimento:

$$\alpha = \frac{1}{273}\,^\circ\text{C}^{-1} = 3{,}66 \cdot 10^{-3}\,^\circ\text{C}^{-1}$$

Per ogni grado in più, un gas aumenta di $1/273$ del volume che ha a $0\,^\circ\text{C}$. È una dilatazione enorme rispetto a quella degli altri corpi: più di quindici volte quella dell'acqua e circa cento volte quella dell'acciaio.

```ad-example
Esempio 1: partendo da 0 °C
Un gas occupa $2{,}00\,\text{L}$ a $0\,^\circ\text{C}$. Lo si scalda a pressione costante fino a $80\,^\circ\text{C}$. Che volume occupa?

Il volume dato è proprio $V_0$:

$$V = V_0\,(1 + \alpha\,t) = 2{,}00\,\text{L} \cdot \left(1 + \frac{80}{273}\right) = 2{,}00\,\text{L} \cdot 1{,}293 = 2{,}586\ldots\,\text{L} \approx 2{,}59\,\text{L}$$

Il volume è cresciuto di $80/273$, poco meno del $30\%$.
```

```tikz
% nome: gay-lussac-volume-temperatura-celsius
% alt: Grafico del volume di un gas in funzione della temperatura in gradi Celsius, a pressione costante. La retta passa per il punto a 0 gradi con volume V zero uguale a 2,00 litri e per il punto dell'esempio 1, a 80 gradi con 2,59 litri; il suo prolungamento tratteggiato verso le temperature basse incontra l'asse orizzontale a meno 273 gradi Celsius
% svg: gay-lussac-volume-temperatura-celsius-b88363ba.svg 321x213
% poi-interattivo: cambiare V zero e vedere la retta ruotare attorno al punto a meno 273 gradi
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.8333, ystep=1] (0,0) grid (7.5,3.6);
\draw[->] (0,0) -- (8,0);
\node[below] at (7.8,-0.35) {$t$ ($^\circ$C)};
\draw[->] (5,0) -- (5,4) node[above] {$V$ (L)};
\foreach \x/\t in {1.667/-200,3.333/-100,6.667/100} \node[below] at (\x,0) {\small $\t$};
\node[below] at (5,0) {\small $0$};
\foreach \y in {1,3} \node[left] at (5,\y) {\small $\y$};
\draw[thick, dashed, blue!60] (0.45,0) -- (5,2);
\draw[thick, blue!60] (5,2) -- (7.5,3.099);
\fill (5,2) circle (0.06);
\fill (6.333,2.586) circle (0.06);
\node[above left] at (5,2) {$V_0$};
\fill[red] (0.45,0) circle (0.06);
\node[below, red] at (0.5,0) {\small $-273$};
\end{tikzpicture}
```

```ad-warning
$V_0$ è il volume a 0 °C, non il volume iniziale
Nella formula $V = V_0\,(1 + \alpha\,t)$ il volume $V_0$ è quello che il gas ha a $0\,^\circ\text{C}$. Se il gas parte da un'altra temperatura, il suo volume iniziale non si può mettere al posto di $V_0$: l'esempio 2 mostra quanto si sbaglia.
```

```ad-example
Esempio 2: partendo da un'altra temperatura
Un gas occupa $0{,}500\,\text{L}$ a $20\,^\circ\text{C}$. Lo si scalda a pressione costante fino a $100\,^\circ\text{C}$. Che volume occupa?

Prima serve $V_0$, che si ricava dallo stato iniziale:

$$V_0 = \frac{V_1}{1 + \alpha\,t_1} = \frac{0{,}500\,\text{L}}{1 + \dfrac{20}{273}} = 0{,}4659\,\text{L}$$

Poi la legge dà il volume a $100\,^\circ\text{C}$:

$$V_2 = V_0\,(1 + \alpha\,t_2) = 0{,}4659\,\text{L} \cdot \left(1 + \frac{100}{273}\right) = 0{,}6365\ldots\,\text{L} \approx 0{,}637\,\text{L}$$

Mettendo $0{,}500\,\text{L}$ al posto di $V_0$ si troverebbe $0{,}683\,\text{L}$, troppo. Due passaggi per un conto così sono scomodi: più avanti, con la temperatura in kelvin, ne basterà uno.
```

## La seconda legge: la pressione a volume costante

Ora il gas è chiuso in un recipiente rigido, un bulbo di vetro o una bombola, collegato a un manometro. Il volume non può cambiare: una trasformazione a volume costante si chiama **isocora**. Scaldando il gas la pressione sale, e le misure danno una legge con la stessa forma della prima. Se $p_0$ è la pressione del gas a $0\,^\circ\text{C}$:

$$p = p_0\,(1 + \alpha\,t)$$

È la **seconda legge di Gay-Lussac**: a volume costante, la pressione di una data quantità di gas cresce in modo lineare con la temperatura. Il coefficiente è lo stesso della prima legge, $\alpha = \dfrac{1}{273}\,^\circ\text{C}^{-1}$, e anche qui non dipende dal gas.

In questa lezione $p_0$ è la pressione a $0\,^\circ\text{C}$, come $V_0$ è il volume a $0\,^\circ\text{C}$: non è la pressione atmosferica, che nelle lezioni sui fluidi aveva lo stesso simbolo.

```ad-example
Esempio 3: a che temperatura si arriva a una certa pressione
Una bombola contiene gas alla pressione di $1{,}50 \cdot 10^5\,\text{Pa}$ quando è a $0\,^\circ\text{C}$. A quale temperatura la pressione raggiunge $2{,}00 \cdot 10^5\,\text{Pa}$?

Da $p = p_0\,(1 + \alpha\,t)$ si ricava la temperatura: $1 + \alpha\,t = \dfrac{p}{p_0}$, quindi

$$t = \frac{1}{\alpha}\left(\frac{p}{p_0} - 1\right) = 273\,^\circ\text{C} \cdot \left(\frac{2{,}00 \cdot 10^5\,\text{Pa}}{1{,}50 \cdot 10^5\,\text{Pa}} - 1\right) = 273\,^\circ\text{C} \cdot 0{,}3333 = 91\,^\circ\text{C}$$

La pressione è cresciuta di un terzo, e la temperatura è un terzo di $273\,^\circ\text{C}$.
```

Un recipiente rigido pieno di gas con il suo manometro è anche un termometro: basta leggere la pressione per conoscere la temperatura. Si chiama termometro a gas a volume costante, ed è stato per molto tempo lo strumento di riferimento per tarare gli altri. Nella figura qui sotto ne hai uno: cambia la temperatura del bagno, guarda i punti che si allineano sul grafico e poi prolunga la retta. A quale temperatura la pressione arriverebbe a zero? E che cosa cambia se nel bulbo c'è più gas, o meno?

```interattivo
% nome: termometro-gas-zero-assoluto
% alt: Un bulbo di vetro pieno di gas, immerso in un bagno di cui si sceglie la temperatura tra meno 100 e 150 gradi Celsius, è collegato a un manometro. Accanto, il grafico della pressione in funzione della temperatura in gradi Celsius: ogni temperatura provata lascia un punto, e i punti stanno su una retta. Un bottone prolunga la retta verso le temperature basse fino a pressione zero, che si raggiunge a meno 273 gradi; scegliendo poco, medio o tanto gas nel bulbo la retta cambia pendenza ma arriva sempre nello stesso punto
```

La retta arriva a pressione zero a $-273\,^\circ\text{C}$, e ci arriva con qualunque quantità di gas: con più gas la retta è più ripida, con meno gas è più bassa, ma tutte puntano lì.

```tikz
% nome: gay-lussac-pressione-temperatura-celsius
% alt: Grafico della pressione in funzione della temperatura in gradi Celsius per due quantità diverse di gas nello stesso recipiente rigido. Le due rette hanno pendenze diverse, una passa per 100 kilopascal a 0 gradi e l'altra per 60 kilopascal, ma i loro prolungamenti tratteggiati si incontrano sull'asse orizzontale nello stesso punto, a meno 273 gradi Celsius
% svg: gay-lussac-pressione-temperatura-celsius-0bdb575f.svg 351x213
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.8333, ystep=1] (0,0) grid (7.5,3.6);
\draw[->] (0,0) -- (8,0);
\node[below] at (7.8,-0.35) {$t$ ($^\circ$C)};
\draw[->] (5,0) -- (5,4) node[above] {$p$ (kPa)};
\foreach \x/\t in {1.667/-200,3.333/-100,6.667/100} \node[below] at (\x,0) {\small $\t$};
\node[below] at (5,0) {\small $0$};
\node[left] at (5,3) {\small $150$};
\node[below right] at (5,1.05) {\small $50$};
\draw (4.93,1) -- (5.07,1);
\draw[thick, dashed, blue!60] (0.45,0) -- (5,2);
\draw[thick, blue!60] (5,2) -- (7.5,3.099);
\draw[thick, dashed, orange!90!black] (0.45,0) -- (5,1.2);
\draw[thick, orange!90!black] (5,1.2) -- (7.5,1.859);
\fill (5,2) circle (0.06);
\fill (5,1.2) circle (0.06);
\node[right, blue!60] at (7.5,3.1) {più gas};
\node[right, orange!90!black] at (7.5,1.86) {meno gas};
\fill[red] (0.45,0) circle (0.06);
\node[below, red] at (0.5,0) {\small $-273$};
\end{tikzpicture}
```

## Lo zero assoluto

Le due leggi hanno lo stesso coefficiente, e questo ha una conseguenza. Il volume $V_0\,(1 + \alpha\,t)$ e la pressione $p_0\,(1 + \alpha\,t)$ si annullano tutti e due quando $1 + \alpha\,t = 0$, cioè alla temperatura

$$t = -\frac{1}{\alpha} = -273\,^\circ\text{C}$$

Con misure più precise il valore è $-273{,}15\,^\circ\text{C}$. Sotto questa temperatura le formule darebbero un volume negativo o una pressione negativa, che non hanno senso: un gas non può occupare meno di niente, né spingere sulle pareti meno di niente. Quella temperatura è un limite inferiore, lo **zero assoluto**.

Due precisazioni, perché il ragionamento non dica più di quello che può. La prima: nessun gas arriva allo zero assoluto restando un gas. Raffreddandolo, prima diventa liquido e poi solido, e a quel punto le leggi di Gay-Lussac non lo descrivono più: il tratto tratteggiato dei grafici è un prolungamento della retta, non una misura. La seconda: il fatto che il prolungamento finisca nello stesso punto per tutti i gas e per tutte le quantità è quello che rende credibile il limite. Non è una proprietà dell'aria o dell'elio, è una proprietà della temperatura. Il motivo si capisce guardando le molecole, nella lezione [Temperatura ed energia cinetica delle molecole](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/temperatura-ed-energia-cinetica-delle-molecole).

La lezione [La temperatura e le scale termometriche](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-temperatura-e-le-scale-termometriche) aveva presentato lo zero assoluto e la scala Kelvin come un dato di fatto. Ora sai da dove vengono: lord Kelvin, nel 1848, propose di contare le temperature a partire dal punto in cui le rette dei gas incontrano l'asse.

## Le due leggi con la temperatura assoluta

La **temperatura assoluta** $T$ si misura in kelvin e si ottiene da quella in gradi Celsius con $T = t + 273$. Lo zero assoluto è $T = 0\,\text{K}$, e $0\,^\circ\text{C}$ sono $T_0 = 273\,\text{K}$.

Con questa temperatura le leggi cambiano faccia. Nella prima legge, con $\alpha = 1/273$:

$$V = V_0\left(1 + \frac{t}{273}\right) = V_0 \cdot \frac{273 + t}{273} = V_0 \cdot \frac{T}{T_0}$$

Il termine $1 +$ è sparito: il volume è [direttamente proporzionale](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare) alla temperatura assoluta. Dividendo per $T$ si vede che il rapporto $V/T$ vale sempre $V_0/T_0$, e quindi è lo stesso in tutti gli stati della trasformazione. Lo stesso conto vale per la pressione. Tra uno stato iniziale e uno finale:

$$\frac{V_1}{T_1} = \frac{V_2}{T_2} \quad \text{(a pressione costante)} \qquad\qquad \frac{p_1}{T_1} = \frac{p_2}{T_2} \quad \text{(a volume costante)}$$

In questa forma non serve più conoscere il volume o la pressione a $0\,^\circ\text{C}$: bastano i due stati. Nel grafico, cambiare scala di temperatura vuol dire spostare l'origine nel punto in cui la retta incontra l'asse: la retta è la stessa di prima, ma ora passa per l'origine.

```tikz
% nome: gay-lussac-volume-temperatura-kelvin
% alt: Lo stesso grafico del volume del gas dell'esempio 1, con la temperatura assoluta in kelvin sull'asse orizzontale: la retta, tratteggiata sotto i 273 kelvin, passa per l'origine, per il punto a 273 kelvin con 2,00 litri e per il punto a 353 kelvin con 2,59 litri
% svg: gay-lussac-volume-temperatura-kelvin-3a4184bd.svg 342x213
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.8333, ystep=1] (0,0) grid (7.5,3.6);
\draw[->] (0,0) -- (8,0);
\node[below] at (7.8,-0.35) {$T$ (K)};
\draw[->] (0,0) -- (0,4) node[above] {$V$ (L)};
\foreach \x/\t in {1.667/100,3.333/200,5/300,6.667/400} \node[below] at (\x,0) {\small $\t$};
\foreach \y in {1,2,3} \node[left] at (0,\y) {\small $\y$};
\draw[thick, dashed, blue!60] (0,0) -- (4.55,2);
\draw[thick, blue!60] (4.55,2) -- (7.05,3.099);
\fill (4.55,2) circle (0.06);
\fill (5.883,2.586) circle (0.06);
\node[above left] at (4.55,2) {$V_0$};
\draw[dashed, thin] (4.55,0) -- (4.55,2);
\node[above] at (4.2,0) {\small $273$};
\end{tikzpicture}
```

L'esempio 2, rifatto in kelvin, è un solo passaggio: $T_1 = 20 + 273 = 293\,\text{K}$, $T_2 = 100 + 273 = 373\,\text{K}$ e

$$V_2 = V_1 \cdot \frac{T_2}{T_1} = 0{,}500\,\text{L} \cdot \frac{373\,\text{K}}{293\,\text{K}} = 0{,}637\,\text{L}$$

```ad-warning
Nei rapporti la temperatura va in kelvin
Le formule $V_1/T_1 = V_2/T_2$ e $p_1/T_1 = p_2/T_2$ valgono solo con la temperatura assoluta. Con i gradi Celsius, nell'esempio 2 si scriverebbe $V_2 = 0{,}500 \cdot 100/20 = 2{,}5\,\text{L}$: un volume quintuplicato, mentre è cresciuto del $27\%$. Passare da $20$ a $100\,^\circ\text{C}$ non vuol dire quintuplicare la temperatura: vuol dire passare da $293$ a $373\,\text{K}$.
```

```ad-example
Esempio 4: una bombola al sole
Una bombola di gas ha la pressione di $2{,}20 \cdot 10^5\,\text{Pa}$ al mattino, a $17\,^\circ\text{C}$. Lasciata al sole arriva a $60\,^\circ\text{C}$. Che pressione raggiunge?

La bombola è rigida: il volume è costante e vale la seconda legge. In kelvin $T_1 = 17 + 273 = 290\,\text{K}$ e $T_2 = 60 + 273 = 333\,\text{K}$. Da $p_1/T_1 = p_2/T_2$:

$$p_2 = p_1 \cdot \frac{T_2}{T_1} = 2{,}20 \cdot 10^5\,\text{Pa} \cdot \frac{333\,\text{K}}{290\,\text{K}} = 2{,}526\ldots \cdot 10^5\,\text{Pa} \approx 2{,}53 \cdot 10^5\,\text{Pa}$$

La pressione sale del $15\%$: è il motivo per cui le bombole non vanno lasciate al sole.
```

```ad-example
Esempio 5: di quanto sale il pistone
Un cilindro con un pistone libero contiene gas a $27\,^\circ\text{C}$, e il pistone è a $24{,}0\,\text{cm}$ dal fondo. Si scalda il gas fino a $127\,^\circ\text{C}$. Di quanto sale il pistone?

Il pistone è libero: la pressione è costante e vale la prima legge. Il volume è $V = S \cdot h$ e l'area $S$ si semplifica, quindi $h_1/T_1 = h_2/T_2$. Con $T_1 = 300\,\text{K}$ e $T_2 = 400\,\text{K}$:

$$h_2 = h_1 \cdot \frac{T_2}{T_1} = 24{,}0\,\text{cm} \cdot \frac{400\,\text{K}}{300\,\text{K}} = 32{,}0\,\text{cm}$$

Il pistone sale di $32{,}0 - 24{,}0 = 8{,}0\,\text{cm}$. La temperatura assoluta è cresciuta di un terzo, e così l'altezza.
```

```tikz
% nome: gay-lussac-pistone-riscaldato
% alt: Lo stesso cilindro con il pistone libero in due momenti. A sinistra il gas a 300 kelvin, con il pistone a 24,0 centimetri dal fondo; a destra il gas a 400 kelvin, più chiaro di colore, con il pistone salito a 32,0 centimetri. La pressione è la stessa nei due casi
% svg: gay-lussac-pistone-riscaldato-a743ccc4.svg 336x155
\begin{tikzpicture}
\fill[blue!10] (0,0) rectangle (2,2.4);
\draw[thick] (0,4) -- (0,0) -- (2,0) -- (2,4);
\draw[thick, fill=gray!20] (0.03,2.4) rectangle (1.97,2.6);
\draw[{Stealth}-{Stealth}, thin] (-0.35,0) -- (-0.35,2.4);
\node[left] at (-0.35,1.2) {$24{,}0$ cm};
\node at (1,1.2) {$300$ K};
\begin{scope}[xshift=5cm]
\fill[red!15] (0,0) rectangle (2,3.2);
\draw[thick] (0,4) -- (0,0) -- (2,0) -- (2,4);
\draw[thick, fill=gray!20] (0.03,3.2) rectangle (1.97,3.4);
\draw[{Stealth}-{Stealth}, thin] (-0.35,0) -- (-0.35,3.2);
\node[left] at (-0.35,1.6) {$32{,}0$ cm};
\node at (1,1.6) {$400$ K};
\draw[dashed, thin] (0,2.4) -- (2,2.4);
\end{scope}
\end{tikzpicture}
```

```ad-warning
Pistone libero o recipiente rigido
Prima di scrivere la formula decidi che cosa resta costante. Un pistone libero, un palloncino, una bolla hanno la pressione di quello che li circonda: resta costante la pressione e cambia il volume. Una bombola, un bulbo di vetro, una lattina chiusa non cambiano forma: resta costante il volume e cambia la pressione.
```

## Isobara e isocora nel piano pressione-volume

Nel [piano pressione-volume](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-legge-di-boyle) una trasformazione isobara è un segmento orizzontale, perché la pressione non cambia, e una isocora è un segmento verticale, perché non cambia il volume. La temperatura non ha un asse, ma si legge dalle isoterme: ogni punto sta su un'isoterma, e spostandosi verso destra o verso l'alto si passa su isoterme di temperatura più alta.

```tikz
% nome: gay-lussac-isobara-isocora-piano
% alt: Il piano pressione-volume con due isoterme, una alla temperatura T e una più lontana dagli assi alla temperatura doppia 2T. Dallo stato A sull'isoterma più bassa partono due frecce: una orizzontale verso destra, l'isobara, che arriva allo stato B sull'isoterma 2T con volume doppio; una verticale verso l'alto, l'isocora, che arriva allo stato C sull'isoterma 2T con pressione doppia
% svg: gay-lussac-isobara-isocora-piano-16b356cb.svg 266x230
\begin{tikzpicture}
\draw[->] (0,0) -- (5.6,0) node[right] {$V$};
\draw[->] (0,0) -- (0,5) node[above] {$p$};
\draw[thick, blue!60, domain=0.65:5, samples=60, smooth] plot (\x, {3/\x});
\draw[thick, red!80!black, domain=1.3:5, samples=60, smooth] plot (\x, {6/\x});
\node[right, blue!60] at (5,0.6) {$T$};
\node[right, red!80!black] at (5,1.2) {$2T$};
\draw[-{Stealth}, thick] (1.5,2) -- (2.94,2);
\draw[-{Stealth}, thick] (1.5,2) -- (1.5,3.94);
\fill (1.5,2) circle (0.06) node[below left] {$A$};
\fill (3,2) circle (0.06) node[above right] {$B$};
\fill (1.5,4) circle (0.06) node[above right] {$C$};
\node[right] at (3.1,4.4) {$A \to B$: isobara};
\node[right] at (3.1,3.85) {$A \to C$: isocora};
\draw[dashed, thin] (1.5,0) -- (1.5,2) (3,0) -- (3,2) (0,2) -- (1.5,2) (0,4) -- (1.5,4);
\node[below] at (1.5,0) {$V_A$};
\node[below] at (3,0) {$2V_A$};
\node[left] at (0,2) {$p_A$};
\node[left] at (0,4) {$2p_A$};
\end{tikzpicture}
```

Nella figura il gas parte dallo stato $A$, alla temperatura assoluta $T$, e viene portato alla temperatura $2T$ in due modi. Lungo l'isobara $AB$ il volume raddoppia, come vuole la prima legge. Lungo l'isocora $AC$ raddoppia la pressione, come vuole la seconda. $B$ e $C$ sono due stati diversi con la stessa temperatura, e infatti stanno sulla stessa isoterma: in tutti e due il prodotto $p \cdot V$ è il doppio di quello in $A$, come puoi controllare sugli assi.

Le tre trasformazioni viste finora tengono ferma una grandezza e ne legano due:

| Trasformazione | Resta costante | Legge | Nel piano pressione-volume |
|---|---|---|---|
| isoterma | $T$ | $p \cdot V = \text{costante}$ (Boyle) | ramo di iperbole |
| isobara | $p$ | $V / T = \text{costante}$ (prima di Gay-Lussac) | segmento orizzontale |
| isocora | $V$ | $p / T = \text{costante}$ (seconda di Gay-Lussac) | segmento verticale |

Che cosa succede quando pressione, volume e temperatura cambiano tutti insieme è l'argomento della lezione [L'equazione di stato del gas perfetto](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto).

```ad-note
I nomi delle leggi
I nomi cambiano da un libro all'altro. La legge del volume a pressione costante si trova come prima legge di Gay-Lussac, legge di Charles o legge di Volta e Gay-Lussac; quella della pressione a volume costante come seconda legge di Gay-Lussac o, nei libri di chimica, legge di Gay-Lussac senza numero. Jacques Charles aveva trovato la prima intorno al 1787 senza pubblicarla, e fu Gay-Lussac a darle la forma precisa. In un esercizio guarda che cosa resta costante, non il nome.
```
