# Le trasformazioni di Galileo e la composizione delle velocità

Un passeggero cammina nel corridoio di un treno verso la carrozza bar. Per chi è seduto accanto a lui fa pochi passi a $1\,\text{m/s}$; per chi aspetta sulla banchina sfreccia a più di $100\,\text{km/h}$ insieme al treno. Le due descrizioni sono giuste tutte e due, e si può passare dall'una all'altra con un conto: le formule che lo fanno si chiamano trasformazioni di Galileo. Nel biennio le hai già usate senza il nome, per la barca sul fiume della lezione [La composizione dei moti](/materiale/scuola-superiore/fisica/i-moti-nel-piano/la-composizione-dei-moti); qui diventano una regola generale, che vale per qualunque coppia di [sistemi di riferimento inerziali](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/sistemi-di-riferimento-inerziali-e-non-inerziali).

## Due sistemi di riferimento in moto uno rispetto all'altro

Chiamiamo $S$ il sistema di riferimento della banchina, con gli assi $x$ e $y$, e $S'$ (si legge "esse primo") quello del treno, con gli assi $x'$ e $y'$ paralleli ai primi. Il treno si muove lungo l'asse $x$ con velocità costante $\vec V$ rispetto alla banchina. Le grandezze misurate in $S'$ si scrivono con l'apice: $x'$, $v'$.

Per confrontare le misure servono due accordi. Il primo è sull'origine dei tempi: i due osservatori fanno partire i cronometri nell'istante in cui le origini $O$ e $O'$ dei due sistemi coincidono. Il secondo è un'ipotesi fisica, che sembra ovvia e che per le velocità di tutti i giorni è verificata con grande precisione: i due cronometri, una volta partiti insieme, segnano sempre lo stesso tempo.

$$t' = t$$

Con questi accordi, all'istante $t$ l'origine $O'$ del treno si trova, rispetto alla banchina, in $x = V\,t$.

```tikz
% nome: due-sistemi-s-s-primo
% alt: Due sistemi di assi cartesiani con gli assi paralleli. Il sistema S, con origine O e assi x e y, è fermo; il sistema S primo, con origine O primo e assi x primo e y primo, è spostato verso destra di un tratto V per t e ha una freccia V che indica la sua velocità. Un punto P è segnato in alto a destra: una quota orizzontale lunga va da O fino a sotto P ed è la coordinata x, una più corta va da O primo fino a sotto P ed è la coordinata x primo, e la terza, da O a O primo, è V per t
% svg: due-sistemi-s-s-primo-4fd72357.svg 327x206
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (7.6,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,3.2) node[above] {$y$};
\node[below left] at (0,0) {$O$};
\draw[->, blue!60!black] (3,0.6) -- (7.4,0.6) node[right] {$x'$};
\draw[->, blue!60!black] (3,0.3) -- (3,3.2) node[above] {$y'$};
\node[below left, blue!60!black] at (3,0.6) {$O'$};
\draw[-{Stealth}, thick, blue!60!black] (3.3,2.7) -- (4.5,2.7) node[right] {$\vec{V}$};
\fill (5.8,2.1) circle (1.5pt) node[above right] {$P$};
\draw[dashed, thin] (5.8,2.1) -- (5.8,-1.3);
\draw[dashed, thin] (3,0.3) -- (3,-0.8);
\draw[dashed, thin] (0,-0.3) -- (0,-1.3);
\draw[{Stealth}-{Stealth}, thin] (0,-0.7) -- (3,-0.7);
\node[above] at (1.5,-0.7) {\small $V\,t$};
\draw[{Stealth}-{Stealth}, thin] (3,-0.7) -- (5.8,-0.7);
\node[above] at (4.4,-0.7) {\small $x'$};
\draw[{Stealth}-{Stealth}, thin] (0,-1.2) -- (5.8,-1.2);
\node[below] at (2.9,-1.2) {\small $x$};
\end{tikzpicture}
```

## Le trasformazioni di Galileo per la posizione

Un punto $P$, per esempio il passeggero, ha coordinata $x'$ rispetto al treno e coordinata $x$ rispetto alla banchina. La figura mostra come sono legate: per andare da $O$ a $P$ si va prima da $O$ a $O'$, che è il tratto $V\,t$ percorso dal treno, e poi da $O'$ a $P$, che è $x'$. La coordinata $y$ è la stessa nei due sistemi, perché il treno non si sposta in quella direzione. Sono le **trasformazioni di Galileo**:

$$x = x' + V\,t \qquad y = y' \qquad t = t'$$

Lette al contrario, per passare dalla banchina al treno:

$$x' = x - V\,t \qquad y' = y \qquad t' = t$$

Se il sistema $S'$ si muove in una direzione qualunque le due righe diventano una sola, scritta con i vettori. Indicando con $\vec s$ e $\vec s\,'$ i vettori che vanno dalle due origini al punto $P$:

$$\vec s = \vec s\,' + \vec V\,t$$

```ad-example
Esempio 1: il passeggero e il semaforo
Un treno lungo passa accanto a una banchina a $25\,\text{m/s}$. L'origine di $S'$ è la coda del treno, quella di $S$ è l'inizio della banchina, e i cronometri partono quando la coda passa per l'inizio della banchina. Un passeggero è seduto a $12\,\text{m}$ dalla coda; un semaforo si trova a $200\,\text{m}$ dall'inizio della banchina. Dov'è il passeggero rispetto alla banchina dopo $4{,}0\,\text{s}$? Dov'è il semaforo rispetto al treno dopo $6{,}0\,\text{s}$?

Per il passeggero si conosce la coordinata nel treno, $x' = 12\,\text{m}$, e si cerca quella sulla banchina:

$$x = x' + V\,t = 12\,\text{m} + 25\,\text{m/s} \cdot 4{,}0\,\text{s} = 112\,\text{m}$$

Per il semaforo si conosce la coordinata sulla banchina, $x = 200\,\text{m}$, e si cerca quella nel treno:

$$x' = x - V\,t = 200\,\text{m} - 25\,\text{m/s} \cdot 6{,}0\,\text{s} = 50\,\text{m}$$

Dopo $6{,}0\,\text{s}$ il semaforo è $50\,\text{m}$ davanti alla coda del treno. Rispetto al treno la sua coordinata diminuisce di $25\,\text{m}$ ogni secondo: il semaforo, fermo per la banchina, visto dal treno viaggia all'indietro, e dopo $8{,}0\,\text{s}$ ha $x' = 0$, cioè è accanto alla coda.
```

```ad-warning
Il segno davanti a V t
Quale delle due formule usare si decide chiedendosi dove si misura quello che si conosce. Dal treno alla banchina si aggiunge il tratto percorso dal treno, $x = x' + V\,t$; dalla banchina al treno lo si toglie, $x' = x - V\,t$. Un controllo veloce: un oggetto fermo sul treno ($x'$ costante) per la banchina deve avanzare, quindi la sua $x$ deve crescere nel tempo.
```

### Che cosa non cambia

Le coordinate di un punto sono diverse nei due sistemi, ma la distanza tra due punti misurata nello stesso istante no. Se $A$ e $B$ sono le estremità di un vagone,

$$x'_B - x'_A = (x_B - V\,t) - (x_A - V\,t) = x_B - x_A$$

perché il termine $V\,t$ è lo stesso per i due punti e nella differenza se ne va. Il vagone è lungo uguale per chi è a bordo e per chi è sulla banchina. Anche la durata di un fenomeno è la stessa, perché $t' = t$. Lunghezze e intervalli di tempo sono **invarianti** per le trasformazioni di Galileo: hanno lo stesso valore in tutti i sistemi di riferimento.

```ad-note
Fin dove valgono
Che il tempo scorra uguale per tutti gli osservatori è un'ipotesi, e quando le velocità si avvicinano a quella della luce, $3{,}0 \cdot 10^8\,\text{m/s}$, gli esperimenti la smentiscono. Lì le trasformazioni di Galileo vanno sostituite con altre, che si studiano al quinto anno con la relatività ristretta. Per treni, aerei e satelliti l'errore che si commette usando quelle di Galileo è troppo piccolo per accorgersene senza strumenti di altissima precisione.
```

## La composizione delle velocità

Se il punto $P$ si muove, le sue coordinate cambiano in tutti e due i sistemi. In un intervallo di tempo $\Delta t$, che è lo stesso per i due osservatori, la prima trasformazione dà

$$\Delta x = \Delta x' + V\,\Delta t$$

e dividendo tutto per $\Delta t$ si ottengono le [velocità](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-velocita-media-e-istantanea): $\Delta x/\Delta t$ è la velocità $v$ del punto rispetto alla banchina, $\Delta x'/\Delta t$ è la sua velocità $v'$ rispetto al treno.

$$v = v' + V$$

La stessa cosa vale per ogni componente, e quindi per i vettori. È la **legge di composizione delle velocità**:

$$\vec v = \vec v\,' + \vec V$$

- $\vec v$ è la velocità del corpo rispetto a $S$ (la banchina);
- $\vec v\,'$ è la velocità del corpo rispetto a $S'$ (il treno);
- $\vec V$ è la velocità di $S'$ rispetto a $S$ (del treno rispetto alla banchina).

Molti libri chiamano $\vec v$ velocità assoluta, $\vec v\,'$ velocità relativa e $\vec V$ velocità di trascinamento. Sono nomi di comodo: nessuno dei due sistemi è più "assoluto" dell'altro, e si può sempre scambiare il ruolo di $S$ e $S'$. Visto dal treno è la banchina che si muove, con velocità $-\vec V$.

Per passare da $S$ a $S'$ la formula si legge al contrario:

$$\vec v\,' = \vec v - \vec V$$

Nella barca sul fiume $S$ è la riva, $S'$ è l'acqua, $\vec V$ è la velocità della corrente e $\vec v\,'$ quella della barca rispetto all'acqua: la formula $\vec v = \vec v_b + \vec v_c$ del biennio è questa.

Nella figura qui sotto un passeggero cammina in un vagone che entra in stazione; scegli la velocità del vagone e quella del passeggero rispetto al vagone, e guarda le sue coordinate nei due sistemi. La domanda è: come deve camminare il passeggero perché chi sta sulla banchina lo veda fermo?

```interattivo
% nome: trasformazioni-galileo-vagone
% alt: Un vagone lungo 30 metri si muove verso destra lungo una banchina graduata in metri; dentro il vagone, che ha la sua scala graduata con lo zero in coda, cammina un passeggero. Due cursori scelgono la velocità del vagone, da 0 a 8 metri al secondo, e quella del passeggero rispetto al vagone, da meno 4 a 4 metri al secondo; un bottone fa partire il moto per 3 secondi. Sotto la banchina tre quote mostrano il tratto V per t percorso dal vagone, la coordinata x primo del passeggero nel vagone e la loro somma x; sopra il vagone le frecce delle velocità V, v primo e v. Sotto la figura sono scritti il tempo, x primo, x e la velocità rispetto alla banchina
```

Rispetto alla banchina il passeggero è fermo quando $v = v' + V = 0$, cioè quando cammina verso la coda con la stessa velocità con cui il vagone avanza: con $V = 4\,\text{m/s}$ serve $v' = -4\,\text{m/s}$. La sua coordinata $x'$ nel vagone diminuisce di $4\,\text{m}$ al secondo, il tratto $V\,t$ cresce di altrettanto, e la somma $x$ non cambia.

### Velocità sulla stessa retta

Quando $\vec v\,'$ e $\vec V$ hanno la stessa direzione si lavora con i numeri, dopo aver scelto un verso positivo: una velocità è positiva se va in quel verso, negativa se va nell'altro. È quello che la lezione sulla composizione dei moti diceva con "nello stesso verso si sommano, in versi opposti si sottraggono".

Il caso più utile è la velocità di un veicolo rispetto a un altro. Se due auto $A$ e $B$ viaggiano sulla stessa strada con velocità $v_A$ e $v_B$ rispetto all'asfalto, il sistema $S'$ è l'auto $B$, con $V = v_B$, e la velocità di $A$ vista da $B$ è

$$v'_A = v_A - v_B$$

```ad-example
Esempio 2: il sorpasso
In autostrada un'auto viaggia a $108\,\text{km/h}$ e raggiunge un camion che va a $90\,\text{km/h}$. Per completare il sorpasso l'auto deve guadagnare $40\,\text{m}$ sul camion ($12\,\text{m}$ di distanza prima, i $16\,\text{m}$ del camion, $12\,\text{m}$ dopo). Quanto dura il sorpasso? Quanta strada percorre l'auto nel frattempo?

Le velocità in metri al secondo: $108\,\text{km/h} = 30\,\text{m/s}$ e $90\,\text{km/h} = 25\,\text{m/s}$. Nel sistema del camion il camion è fermo e l'auto avanza con

$$v' = v - V = 30\,\text{m/s} - 25\,\text{m/s} = 5\,\text{m/s}$$

In quel sistema il sorpasso è un moto uniforme su $40\,\text{m}$:

$$t = \frac{40\,\text{m}}{5\,\text{m/s}} = 8{,}0\,\text{s}$$

Il tempo è lo stesso per chi guarda dalla strada, dove l'auto intanto percorre

$$\Delta x = v\,t = 30\,\text{m/s} \cdot 8{,}0\,\text{s} = 240\,\text{m} = 2{,}4 \cdot 10^2\,\text{m}$$

Controllo con le trasformazioni: $\Delta x = \Delta x' + V\,t = 40\,\text{m} + 25\,\text{m/s} \cdot 8{,}0\,\text{s} = 240\,\text{m}$.

```tikz
% nome: sorpasso-due-sistemi
% alt: Il sorpasso visto da due sistemi. In alto, dalla strada: il camion ha una freccia di velocità lunga, 25 metri al secondo, e l'auto dietro di lui una freccia un po' più lunga, 30 metri al secondo. In basso, dal camion: il camion non ha freccia, perché è fermo, e l'auto ha una freccia corta, 5 metri al secondo. Scala di 1 centimetro per 15 metri al secondo
% svg: sorpasso-due-sistemi-586dee43.svg 349x135
\begin{tikzpicture}
\draw[thick] (-0.3,2.2) -- (8.3,2.2);
\draw[thick, fill=blue!10] (0.3,2.2) rectangle ++(0.9,0.45);
\draw[thick, fill=gray!20] (3.4,2.2) rectangle ++(1.6,0.8);
\draw[-{Stealth}, thick, blue!60!black] (1.2,2.42) -- (3.2,2.42);
\node[above] at (2.2,2.42) {\small $30$ m/s};
\draw[-{Stealth}, thick, blue!60!black] (5,2.6) -- (6.67,2.6);
\node[above] at (5.85,2.6) {\small $25$ m/s};
\node[right] at (6.9,3.2) {\small dalla strada};
\draw[thick] (-0.3,0) -- (8.3,0);
\draw[thick, fill=blue!10] (0.3,0) rectangle ++(0.9,0.45);
\draw[thick, fill=gray!20] (3.4,0) rectangle ++(1.6,0.8);
\draw[-{Stealth}, thick, blue!60!black] (1.2,0.22) -- (1.53,0.22);
\node[right] at (1.55,0.22) {\small $5$ m/s};
\node at (4.2,0.4) {\small fermo};
\node[right] at (6.9,1.0) {\small dal camion};
\end{tikzpicture}
```
```

Se dalla corsia opposta arriva un'altra auto a $25\,\text{m/s}$, la sua velocità sulla strada, con il verso positivo scelto prima, è $-25\,\text{m/s}$, e vista dall'auto che sorpassa vale $-25 - 30 = -55\,\text{m/s}$: le due auto si avvicinano di $55\,\text{m}$ ogni secondo, cioè di $440\,\text{m}$ negli $8{,}0\,\text{s}$ del sorpasso. È il motivo per cui un sorpasso su una strada a due corsie chiede tanta strada libera.

```ad-warning
Velocità relativa: differenza, non somma
La velocità di $A$ vista da $B$ è $v_A - v_B$, con i segni. Due veicoli nello stesso verso hanno velocità dello stesso segno, e la differenza è piccola; due veicoli che si vengono incontro hanno segni opposti, e la differenza diventa la somma dei moduli. L'errore tipico è sommare i moduli di due veicoli che vanno nello stesso verso.
```

### Velocità con direzioni diverse

Quando $\vec v\,'$ e $\vec V$ non stanno sulla stessa retta la somma è una [somma di vettori](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori). Se sono perpendicolari, il modulo si trova con il teorema di Pitagora e la direzione con la tangente; negli altri casi si lavora per componenti.

```ad-example
Esempio 3: la pioggia vista dall'auto
Non c'è vento e la pioggia cade in verticale a $8{,}0\,\text{m/s}$. Con quale velocità e con quale inclinazione la vede cadere chi viaggia in auto a $54\,\text{km/h}$?

$S$ è la strada e $S'$ l'auto, con $V = 54\,\text{km/h} = 15\,\text{m/s}$ in orizzontale. La velocità della pioggia rispetto all'auto è $\vec v\,' = \vec v - \vec V$: alla velocità verticale $\vec v$ si somma il vettore $-\vec V$, orizzontale e diretto all'indietro.

```tikz
% nome: pioggia-vista-dall-auto
% alt: Il triangolo delle velocità della pioggia, in scala di 0,2 centimetri per metro al secondo. Da un punto parte verso il basso la velocità v della pioggia rispetto alla strada, lunga 1,6 centimetri; dalla sua punta parte verso sinistra il vettore meno V, lungo 3 centimetri; la velocità v primo della pioggia rispetto all'auto, in arancione, va dal punto di partenza alla punta di meno V, in diagonale verso il basso e all'indietro, ed è lunga 3,4 centimetri. L'angolo beta tra v e v primo è segnato in alto
% svg: pioggia-vista-dall-auto-92764801.svg 297x89
\begin{tikzpicture}
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (0,-1.6);
\node[right] at (0,-0.8) {$\vec{v}$};
\draw[-{Stealth}, thick, blue!60!black] (0,-1.6) -- (-3,-1.6);
\node[below] at (-1.5,-1.6) {$-\vec{V}$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (-3,-1.6);
\node[above] at (-1.7,-0.75) {$\vec{v}\,'$};
\draw (0,-0.6) arc[start angle=270, end angle=208.07, radius=0.6];
\node at (-0.22,-0.4) {\scriptsize $\beta$};
\fill (0,0) circle (1.5pt);
\draw[-{Stealth}, thick, blue!60!black] (1.2,-0.3) -- (4.2,-0.3) node[right] {$\vec{V}$};
\draw[thick, fill=blue!10] (1.2,-1.2) rectangle ++(1.3,0.5);
\draw[thick, fill=gray!20] (1.5,-1.2) circle (0.15);
\draw[thick, fill=gray!20] (2.2,-1.2) circle (0.15);
\end{tikzpicture}
```

I due vettori sono perpendicolari:

$$v' = \sqrt{v^2 + V^2} = \sqrt{8{,}0^2 + 15^2}\,\text{m/s} = \sqrt{289}\,\text{m/s} = 17\,\text{m/s}$$

$$\tan\beta = \frac{V}{v} = \frac{15}{8{,}0} = 1{,}875 \quad\Rightarrow\quad \beta = 61{,}9\ldots^\circ \approx 62^\circ$$

Vista dall'auto la pioggia arriva dal davanti, inclinata di $62^\circ$ rispetto alla verticale, ed è più veloce: per questo bagna il parabrezza molto più del lunotto, e le gocce rigano i finestrini laterali in diagonale.
```

```ad-example
Esempio 4: la palla lanciata in alto sul treno
Su un treno che entra in stazione a $5{,}0\,\text{m/s}$ una ragazza lancia una palla verso l'alto, in verticale rispetto al treno, a $4{,}9\,\text{m/s}$, e la riprende alla stessa altezza. Quanto dura il volo? Che traiettoria vede la ragazza, e quale chi sta sulla banchina?

Rispetto al treno è un [lancio verticale](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-caduta-libera-e-il-lancio-verticale): la palla sale, si ferma e ricade nella mano.

$$t = \frac{2\,v'_0}{g} = \frac{2 \cdot 4{,}9\,\text{m/s}}{9{,}8\,\text{m/s}^2} = 1{,}0\,\text{s} \qquad h_{max} = \frac{v'^2_0}{2\,g} = \frac{(4{,}9\,\text{m/s})^2}{2 \cdot 9{,}8\,\text{m/s}^2} = 1{,}225\,\text{m} \approx 1{,}2\,\text{m}$$

Rispetto alla banchina la palla parte con una velocità che ha due componenti: quella verticale, $4{,}9\,\text{m/s}$, e quella orizzontale del treno, $5{,}0\,\text{m/s}$, che la palla conserva per tutto il volo.

$$v_0 = \sqrt{5{,}0^2 + 4{,}9^2}\,\text{m/s} = 7{,}00\ldots\,\text{m/s} \approx 7{,}0\,\text{m/s}$$

Il tempo di volo è lo stesso, $1{,}0\,\text{s}$, e in quel tempo la palla avanza di $5{,}0\,\text{m/s} \cdot 1{,}0\,\text{s} = 5{,}0\,\text{m}$: la traiettoria è un arco di parabola largo $5{,}0\,\text{m}$ e alto $1{,}2\,\text{m}$. Anche la ragazza è avanzata di $5{,}0\,\text{m}$, e per questo la palla le torna in mano.

```tikz
% nome: palla-treno-due-traiettorie
% alt: La traiettoria della palla nei due sistemi, in scala di 1 centimetro per metro. A sinistra, vista dal treno: un segmento verticale alto 1,2 centimetri, percorso in salita e in discesa. A destra, vista dalla banchina: un arco di parabola largo 5 centimetri e alto 1,2 centimetri, con il punto di partenza e quello di arrivo alla stessa altezza; alla partenza sono disegnate la componente orizzontale e quella verticale della velocità, tratteggiate, e la velocità v zero in diagonale
% svg: palla-treno-due-traiettorie-34e5352f.svg 350x107
\begin{tikzpicture}
\draw[thin] (-0.8,0) -- (0.8,0);
\draw[thick, blue!60!black, {Stealth}-{Stealth}] (0,0) -- (0,1.225);
\fill (0,0) circle (1.5pt);
\node[below] at (0,-0.1) {\small dal treno};
\draw[thin] (2,0) -- (8,0);
\draw[thick, blue!60!black] plot[domain=0:1, samples=30, variable=\t] ({2.5 + 5*\t}, {4.9*\t - 4.9*\t*\t});
\draw[-{Stealth}, thick, blue!60!black, dashed] (2.5,0) -- (3.5,0);
\draw[-{Stealth}, thick, blue!60!black, dashed] (2.5,0) -- (2.5,0.98);
\draw[-{Stealth}, thick, blue!60!black] (2.5,0) -- (3.5,0.98);
\node at (3.25,1.3) {\small $\vec{v}_0$};
\draw[dashed, thin] (5,0) -- (5,1.225);
\node[right] at (5,0.6) {\small $1{,}2$ m};
\draw[{Stealth}-{Stealth}, thin] (2.5,-0.3) -- (7.5,-0.3);
\node[below] at (5,-0.3) {\small $5{,}0$ m};
\fill (2.5,0) circle (1.5pt);
\fill (7.5,0) circle (1.5pt);
\node[below] at (7.2,-0.75) {\small dalla banchina};
\end{tikzpicture}
```

La traiettoria dipende dal sistema di riferimento; il tempo di volo e l'altezza massima no. Il moto visto dalla banchina è un lancio con un angolo, che si studia nella lezione [Il lancio obliquo e la gittata](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/il-lancio-obliquo-e-la-gittata).
```

Quando le due velocità formano un angolo qualunque si sommano le componenti, come nella lezione [Spostamento e velocità nel piano](/materiale/scuola-superiore/fisica/i-moti-nel-piano/spostamento-e-velocita-nel-piano):

$$v_x = v'_x + V_x \qquad v_y = v'_y + V_y$$

```ad-example
Esempio 5: il motoscafo sul radar del traghetto
Un traghetto naviga verso est a $5{,}0\,\text{m/s}$. Sul suo radar un motoscafo si muove con velocità di componenti $v'_x = -3{,}0\,\text{m/s}$ e $v'_y = 4{,}0\,\text{m/s}$, con l'asse $x$ verso est e l'asse $y$ verso nord. Qual è la velocità del motoscafo rispetto al mare?

Il radar è fermo rispetto al traghetto, quindi misura $\vec v\,'$; il traghetto è $S'$, con $V_x = 5{,}0\,\text{m/s}$ e $V_y = 0$.

$$v_x = v'_x + V_x = -3{,}0\,\text{m/s} + 5{,}0\,\text{m/s} = 2{,}0\,\text{m/s} \qquad v_y = v'_y + V_y = 4{,}0\,\text{m/s}$$

$$v = \sqrt{2{,}0^2 + 4{,}0^2}\,\text{m/s} = 4{,}47\ldots\,\text{m/s} \approx 4{,}5\,\text{m/s} \qquad \tan\gamma = \frac{v_y}{v_x} = 2{,}0 \quad\Rightarrow\quad \gamma \approx 63^\circ$$

Rispetto al mare il motoscafo va a $4{,}5\,\text{m/s}$, a $63^\circ$ da est verso nord. Sul radar sembrava andare verso nord-ovest a $5{,}0\,\text{m/s}$: la componente verso ovest era dovuta al moto del traghetto.

```tikz
% nome: motoscafo-radar-traghetto
% alt: Una griglia con gli assi x verso est e y verso nord, in scala di mezzo centimetro per metro al secondo. Dall'origine parte verso destra la velocità V del traghetto, di componenti 5 e 0; dalla sua punta parte la velocità v primo del motoscafo vista dal radar, di componenti meno 3 e 4; la velocità v del motoscafo rispetto al mare, in arancione, va dall'origine alla punta di v primo e ha componenti 2 e 4
% svg: motoscafo-radar-traghetto-06394d16.svg 160x145
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-1,-1) grid (6,5);
\draw[->] (-1,0) -- (6.4,0) node[right] {$x$};
\draw[->] (0,-1) -- (0,5.4) node[above] {$y$};
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (5,0);
\node[below] at (3,0) {$\vec{V}$};
\draw[-{Stealth}, thick, blue!60!black] (5,0) -- (2,4);
\node[right] at (3.7,2.2) {$\vec{v}\,'$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (2,4);
\node[left] at (0.9,2.2) {$\vec{v}$};
\end{tikzpicture}
```
```

```ad-warning
I moduli non si sommano
$v = v' + V$ tra i moduli vale solo se le due velocità hanno la stessa direzione e lo stesso verso. Nell'esempio del motoscafo $v' = 5{,}0\,\text{m/s}$ e $V = 5{,}0\,\text{m/s}$, ma $v$ vale $4{,}5\,\text{m/s}$, non $10\,\text{m/s}$. Prima si sommano le componenti, poi si calcola il modulo.
```

## Come si imposta un problema con due sistemi

1. Si decide chi è $S$ (di solito il suolo, la riva, la strada) e chi è $S'$ (il veicolo, l'acqua, l'aria), e si scrive $\vec V$, la velocità di $S'$ rispetto a $S$.
2. Per ogni velocità del testo ci si chiede rispetto a che cosa è misurata: se è rispetto a $S$ è una $\vec v$, se è rispetto a $S'$ è una $\vec v\,'$.
3. Si scelgono gli assi, uguali per i due sistemi, e si scrive $\vec v = \vec v\,' + \vec V$ per componenti, con i segni.
4. Si ricava quello che manca, e solo alla fine si calcolano modulo e direzione.

Che cosa succede all'accelerazione, e alle leggi della dinamica, quando si passa da un sistema inerziale a un altro è l'argomento della lezione [Il principio di relatività galileiana](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/il-principio-di-relativita-galileiana).
