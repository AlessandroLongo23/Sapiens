# Il principio di relatività galileiana

Su un aereo in crociera a $900\,\text{km/h}$ l'assistente di volo versa il caffè nella tazza con lo stesso gesto che farebbe al bar dell'aeroporto: il caffè cade dritto, la tazza resta sul tavolino, una penna che sfugge di mano finisce ai piedi di chi l'ha persa. A bordo niente tradisce la velocità. Non è un caso fortunato: è una legge della natura, che Galileo ha enunciato per primo e che oggi porta il suo nome. Per arrivarci servono le [trasformazioni di Galileo](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/le-trasformazioni-di-galileo-e-la-composizione-delle-velocita) e la legge $\vec v = \vec v\,' + \vec V$ della lezione precedente.

## La nave di Galileo

Nel "Dialogo sopra i due massimi sistemi del mondo", pubblicato nel 1632, Galileo fa proporre a uno dei personaggi, Salviati, un esperimento. Ci si chiude con qualche amico nella stanza più grande sotto coperta di una grande nave, portando con sé mosche e farfalle, una vasca con dei pesci e un secchio appeso che gocciola in un vaso dal collo stretto posato sotto. A nave ferma si osserva: gli insetti volano con la stessa facilità in tutte le direzioni, i pesci nuotano senza preferire un lato, le gocce cadono tutte nel vaso, e per lanciare un oggetto a un amico serve la stessa forza verso prua e verso poppa.

Poi la nave si mette in viaggio, con la velocità che si vuole, purché il moto sia uniforme e senza scossoni. Salviati afferma che non cambia niente: le gocce continuano a cadere nel vaso senza spostarsi verso poppa, anche se mentre sono in aria la nave avanza di parecchio, e da nessuno di questi fatti si può capire se la nave cammina o sta ferma.

Galileo aveva bisogno di questo argomento per difendere l'idea che la Terra si muove: chi la negava obiettava che, se la Terra corresse, un sasso lasciato cadere da una torre dovrebbe restare indietro e toccare il suolo lontano dalla base. La nave risponde che non è così, e la fisica di questa lezione spiega perché.

## L'accelerazione è la stessa nei due sistemi

Riprendiamo i due sistemi della lezione precedente: $S$, per esempio la riva, e $S'$, la nave, che si muove rispetto a $S$ con velocità costante $\vec V$. Un corpo ha velocità $\vec v$ rispetto a $S$ e $\vec v\,'$ rispetto a $S'$, legate da

$$\vec v = \vec v\,' + \vec V$$

Guardiamo il corpo in due istanti, separati da un intervallo $\Delta t$ che è lo stesso per i due osservatori. All'inizio le velocità sono $\vec v_1 = \vec v\,'_1 + \vec V$, alla fine $\vec v_2 = \vec v\,'_2 + \vec V$. Sottraendo, il termine $\vec V$ se ne va, perché è lo stesso nei due istanti:

$$\vec v_2 - \vec v_1 = \vec v\,'_2 - \vec v\,'_1 \qquad \text{cioè} \qquad \Delta\vec v = \Delta\vec v\,'$$

Le velocità sono diverse nei due sistemi, ma le loro variazioni sono uguali. Dividendo per $\Delta t$ si ottiene l'[accelerazione](/materiale/scuola-superiore/fisica/il-moto-rettilineo/l-accelerazione):

$$\vec a = \vec a\,'$$

> L'accelerazione di un corpo è la stessa in tutti i sistemi di riferimento che si muovono di moto rettilineo uniforme l'uno rispetto all'altro.

Si dice che l'accelerazione è **invariante** per le trasformazioni di Galileo, come le lunghezze e gli intervalli di tempo. Il passaggio che conta è che $\vec V$ sia costante: se la nave accelerasse, $\vec V$ non sarebbe la stessa nei due istanti e non si potrebbe semplificare.

```ad-example
Esempio 1: l'auto vista dal treno
Su una strada che corre accanto alla ferrovia un'auto di $1200\,\text{kg}$ accelera da $20\,\text{m/s}$ a $26\,\text{m/s}$ in $4{,}0\,\text{s}$. Un treno viaggia nello stesso verso a $15\,\text{m/s}$ costanti. Quali velocità e quale accelerazione dell'auto misura un passeggero del treno? Quale forza totale agisce sull'auto?

Rispetto alla strada:

$$a = \frac{\Delta v}{\Delta t} = \frac{26\,\text{m/s} - 20\,\text{m/s}}{4{,}0\,\text{s}} = 1{,}5\,\text{m/s}^2$$

Rispetto al treno le velocità dell'auto sono $v' = v - V$: all'inizio $20 - 15 = 5\,\text{m/s}$, alla fine $26 - 15 = 11\,\text{m/s}$.

$$a' = \frac{\Delta v'}{\Delta t} = \frac{11\,\text{m/s} - 5\,\text{m/s}}{4{,}0\,\text{s}} = 1{,}5\,\text{m/s}^2$$

Velocità diverse, stessa accelerazione. Nel grafico velocità-tempo i due osservatori disegnano due rette diverse ma parallele: la pendenza, che è l'accelerazione, è la stessa.

```tikz
% nome: velocita-tempo-due-sistemi
% alt: Grafico velocità-tempo dell'auto nei due sistemi, con il tempo da 0 a 4 secondi in ascissa e la velocità da 0 a 30 metri al secondo in ordinata. La retta in alto, vista dalla strada, va da 20 a 26 metri al secondo; la retta in basso, vista dal treno, va da 5 a 11 metri al secondo. Le due rette sono parallele, e la distanza verticale tra loro, 15 metri al secondo, è la velocità del treno
% svg: velocita-tempo-due-sistemi-befbfc17.svg 258x205
% poi-interattivo: cambiare la velocità del treno e vedere la retta in basso che trasla senza cambiare pendenza
\begin{tikzpicture}[x=1cm, y=0.13cm]
\draw[gray!25, very thin, xstep=1, ystep=5] (0,0) grid (4.4,31);
\draw[->] (-0.2,0) -- (4.8,0) node[right] {$t$ (s)};
\draw[->] (0,-1.5) -- (0,33) node[above] {$v$ (m/s)};
\foreach \x in {1,2,3,4} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {10,20,30} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue!60!black] (0,20) -- (4,26);
\draw[thick, orange!90!black] (0,5) -- (4,11);
\fill[blue!60!black] (0,20) circle (1.5pt);
\fill[blue!60!black] (4,26) circle (1.5pt);
\fill[orange!90!black] (0,5) circle (1.5pt);
\fill[orange!90!black] (4,11) circle (1.5pt);
\node[right] at (4.1,26) {\small dalla strada};
\node[right] at (4.1,11) {\small dal treno};
\draw[{Stealth}-{Stealth}, thin] (2,8) -- (2,23);
\node[right] at (2,15.5) {\small $V = 15$ m/s};
\end{tikzpicture}
```

La forza totale sull'auto è $F_{tot} = m\,a = 1200\,\text{kg} \cdot 1{,}5\,\text{m/s}^2 = 1{,}8 \cdot 10^3\,\text{N}$, e i due osservatori, che misurano la stessa massa e la stessa accelerazione, sono d'accordo.
```

## Le leggi della dinamica sono le stesse

Il [secondo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica), $\vec F_{tot} = m\,\vec a$, lega tre grandezze. Che cosa succede a ciascuna quando si passa da $S$ a $S'$?

- L'accelerazione non cambia: lo abbiamo appena dimostrato.
- La massa non cambia: è una proprietà del corpo, e non dipende da chi lo osserva.
- Le forze non cambiano. Le forze che conosci dipendono da grandezze che sono le stesse nei due sistemi: la forza elastica dall'allungamento della molla, che è una lunghezza; il peso dalla massa; l'attrito dalla forza premente; la tensione di un filo si legge su un dinamometro, che segna lo stesso numero per chiunque lo guardi.

Se in $S$ vale $\vec F_{tot} = m\,\vec a$, e ognuno dei tre pezzi ha lo stesso valore in $S'$, allora in $S'$ vale $\vec F_{tot} = m\,\vec a\,'$: la stessa legge, scritta nello stesso modo. Lo stesso succede al [primo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali), perché un corpo con forza totale nulla ha $\vec a = \vec a\,' = \vec 0$ in tutti e due i sistemi (ed è per questo che $S'$ è inerziale se lo è $S$), e al [terzo](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-terzo-principio-della-dinamica), che parla solo di forze.

## L'enunciato del principio

Il **principio di relatività galileiana** dice:

> Le leggi della meccanica sono le stesse in tutti i sistemi di riferimento inerziali.

Ha due conseguenze, che sono due modi di dire la stessa cosa.

La prima: un esperimento di meccanica, preparato nello stesso modo, dà lo stesso risultato in tutti i sistemi inerziali. Un pendolo lungo un metro oscilla con lo stesso periodo in un laboratorio a terra e su un treno a $300\,\text{km/h}$ costanti; una molla lancia un carrello con la stessa velocità rispetto al banco su cui è montata; una palla lasciata cadere impiega lo stesso tempo per arrivare al pavimento.

La seconda: stando dentro un sistema inerziale, con nessun esperimento di meccanica si può stabilire se il sistema è fermo o si muove di moto rettilineo uniforme. Non esiste quindi un sistema "davvero fermo" rispetto al quale misurare le velocità "vere": si può dire solo che un corpo è fermo o in moto rispetto a un altro. Tra tutti i sistemi inerziali nessuno è privilegiato.

```ad-warning
Uniforme sì, accelerato no
Il principio riguarda il moto rettilineo uniforme. Che un sistema accelera, invece, da dentro si capisce benissimo: i corpi liberi partono da soli, i pendoli si inclinano, ci si sente spinti contro il sedile. È la differenza tra sistemi inerziali e [non inerziali](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/sistemi-di-riferimento-inerziali-e-non-inerziali): la velocità è relativa, l'accelerazione no.
```

## Il sasso lasciato cadere dall'albero

L'esperimento che chiude la discussione sulla torre si fa su una nave: un marinaio in cima all'albero lascia cadere un sasso. Per il principio di relatività, sulla nave che viaggia a velocità costante il sasso deve cadere come sulla nave ferma, cioè in verticale lungo l'albero, e toccare il ponte ai suoi piedi. Controlliamolo con i conti nei due sistemi, trascurando la resistenza dell'aria.

```ad-example
Esempio 2: la caduta vista dalla nave e dalla riva
Una nave viaggia a $8{,}0\,\text{m/s}$. Dalla cima dell'albero, alta $19{,}6\,\text{m}$ sul ponte, viene lasciato cadere un sasso. Dove tocca il ponte? Con quale velocità arriva, per un marinaio e per chi guarda dalla riva?

Nel sistema della nave il sasso parte da fermo ed è in [caduta libera](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-caduta-libera-e-il-lancio-verticale):

$$t = \sqrt{\frac{2h}{g}} = \sqrt{\frac{2 \cdot 19{,}6\,\text{m}}{9{,}8\,\text{m/s}^2}} = 2{,}0\,\text{s} \qquad v' = g\,t = 9{,}8\,\text{m/s}^2 \cdot 2{,}0\,\text{s} = 19{,}6\,\text{m/s}$$

Cade in verticale e tocca il ponte ai piedi dell'albero.

Nel sistema della riva il sasso, nell'istante in cui viene lasciato, ha già la velocità della nave, $8{,}0\,\text{m/s}$ in orizzontale: il suo è il [moto di un proiettile lanciato in orizzontale](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/il-moto-di-un-proiettile-lanciato-in-orizzontale). La caduta dura lo stesso tempo, $2{,}0\,\text{s}$, e intanto il sasso avanza di

$$\Delta x = V\,t = 8{,}0\,\text{m/s} \cdot 2{,}0\,\text{s} = 16\,\text{m}$$

Nello stesso tempo anche la nave, e con lei l'albero, è avanzata di $16\,\text{m}$: il sasso tocca il ponte ai piedi dell'albero, come prima. La traiettoria però è un arco di parabola, e la velocità di arrivo è più grande:

$$v = \sqrt{V^2 + v'^2} = \sqrt{8{,}0^2 + 19{,}6^2}\,\text{m/s} = 21{,}1\ldots\,\text{m/s} \approx 21\,\text{m/s}$$

```tikz
% nome: sasso-albero-nave-due-osservatori
% alt: A sinistra la nave vista da un marinaio: il sasso cade dalla cima dell'albero lungo una linea verticale fino al ponte, ai piedi dell'albero. A destra la stessa caduta vista dalla riva: la nave è disegnata tratteggiata nella posizione di partenza e piena in quella di arrivo, 16 metri più avanti, e il sasso percorre un arco di parabola dalla cima dell'albero nella prima posizione ai piedi dell'albero nella seconda. Scala di 0,2 centimetri per metro
% svg: sasso-albero-nave-due-osservatori-a6de450b.svg 415x241
\begin{tikzpicture}
\fill[cyan!20] (-0.5,-0.3) rectangle (2.9,0.2);
\draw[thick, fill=orange!25] (0.2,0) -- (2.2,0) -- (2.6,0.5) -- (-0.2,0.5) -- cycle;
\draw[thick] (1.2,0.5) -- (1.2,4.42);
\draw[-{Stealth}, thick, blue!60!black] (1.32,4.42) -- (1.32,0.5);
\fill (1.32,4.42) circle (1.5pt);
\node[below] at (1.2,-0.3) {\small dalla nave};
\fill[cyan!20] (3.6,-0.3) rectangle (10.3,0.2);
\draw[thin, dashed] (4.2,0) -- (6.2,0) -- (6.6,0.5) -- (3.8,0.5) -- cycle;
\draw[thin, dashed] (5.2,0.5) -- (5.2,4.42);
\draw[thick, fill=orange!25] (7.4,0) -- (9.4,0) -- (9.8,0.5) -- (7,0.5) -- cycle;
\draw[thick] (8.4,0.5) -- (8.4,4.42);
\draw[-{Stealth}, thick, blue!60!black] plot[domain=0:2, samples=30, variable=\t] ({5.32 + 1.6*\t}, {4.42 - 0.98*\t*\t});
\fill (5.32,4.42) circle (1.5pt);
\draw[-{Stealth}, thick, blue!60!black] (5.6,5.0) -- (7.2,5.0) node[right] {$\vec{V}$};
\draw[{Stealth}-{Stealth}, thin] (5.2,-0.55) -- (8.4,-0.55);
\node[below] at (6.8,-0.55) {\small $16$ m};
\node[below] at (9.6,-0.3) {\small dalla riva};
\end{tikzpicture}
```

I due osservatori non sono d'accordo sulla traiettoria e sulla velocità, ma sono d'accordo sul tempo di caduta, sull'accelerazione ($g$ verso il basso per tutti e due) e sul punto del ponte in cui il sasso arriva.
```

Nella figura qui sotto lasci cadere il sasso e scegli da dove guardare e quanto veloce va la nave. La domanda è: se la nave va più veloce, il sasso cade più indietro?

```interattivo
% nome: nave-galileo-sasso
% alt: Una nave con un albero alto 19,6 metri naviga verso destra tra alcune boe; un cursore sceglie la sua velocità, da 0 a 8 metri al secondo, e un selettore il punto di vista, dalla riva o dalla nave. Un bottone lascia cadere un sasso dalla cima dell'albero. Vista dalla riva la nave avanza e il sasso disegna un arco di parabola; vista dalla nave le boe scorrono all'indietro e il sasso scende in verticale. In tutti e due i casi il sasso tocca il ponte ai piedi dell'albero dopo 2 secondi. Sotto la figura sono scritti il tempo, le componenti della velocità del sasso nel sistema scelto e la sua accelerazione
```

No: qualunque sia la velocità della nave, il sasso arriva ai piedi dell'albero dopo $2{,}0\,\text{s}$. Vista dalla riva la parabola si allarga quando la nave va più veloce, ma si allarga di quanto avanza la nave; vista dalla nave la caduta è sempre la stessa linea verticale, e la velocità della nave non compare da nessuna parte.

## Che cosa cambia e che cosa non cambia

"Relatività" non vuol dire che tutto dipende dall'osservatore. Alcune grandezze sono relative, cioè hanno valori diversi in $S$ e in $S'$; altre sono invarianti; e le leggi che le legano sono le stesse.

| Relative: cambiano da un sistema all'altro | Invarianti: uguali in tutti i sistemi inerziali |
|---|---|
| posizione | intervallo di tempo |
| velocità | distanza tra due punti, lunghezza di un oggetto |
| spostamento | massa |
| forma della traiettoria | accelerazione |
| energia cinetica, lavoro di una forza | forza |

L'[energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica) sta nella colonna di sinistra perché dipende dalla velocità, e il lavoro perché dipende dallo spostamento. Eppure il teorema dell'energia cinetica, $W = \Delta K$, vale in tutti e due i sistemi: ognuno dei due osservatori trova i propri valori, e per ognuno i conti tornano.

```ad-example
Esempio 3: stessa legge, numeri diversi
Su un treno che viaggia a $30\,\text{m/s}$ un carrello di $0{,}20\,\text{kg}$, fermo su un banco senza attrito, viene spinto per $0{,}50\,\text{s}$ con una forza costante di $0{,}80\,\text{N}$, nel verso di marcia. Calcola lavoro e variazione di energia cinetica per un passeggero e per chi sta a terra.

L'accelerazione è la stessa per tutti e due: $a = F/m = 0{,}80\,\text{N} / 0{,}20\,\text{kg} = 4{,}0\,\text{m/s}^2$.

Per il passeggero il carrello parte da fermo:

$$v' = a\,t = 2{,}0\,\text{m/s} \qquad \Delta s\,' = \tfrac{1}{2}a\,t^2 = \tfrac{1}{2} \cdot 4{,}0\,\text{m/s}^2 \cdot (0{,}50\,\text{s})^2 = 0{,}50\,\text{m}$$

$$W' = F\,\Delta s\,' = 0{,}80\,\text{N} \cdot 0{,}50\,\text{m} = 0{,}40\,\text{J} \qquad \Delta K' = \tfrac{1}{2} \cdot 0{,}20\,\text{kg} \cdot (2{,}0\,\text{m/s})^2 - 0 = 0{,}40\,\text{J}$$

Per chi sta a terra il carrello passa da $30\,\text{m/s}$ a $32\,\text{m/s}$, e intanto percorre anche la strada fatta dal treno:

$$\Delta s = \Delta s\,' + V\,t = 0{,}50\,\text{m} + 30\,\text{m/s} \cdot 0{,}50\,\text{s} = 15{,}5\,\text{m}$$

$$W = F\,\Delta s = 0{,}80\,\text{N} \cdot 15{,}5\,\text{m} = 12{,}4\,\text{J} \qquad \Delta K = \tfrac{1}{2} \cdot 0{,}20\,\text{kg} \cdot \left[(32\,\text{m/s})^2 - (30\,\text{m/s})^2\right] = 12{,}4\,\text{J}$$

Il lavoro vale $0{,}40\,\text{J}$ per uno e circa $12\,\text{J}$ per l'altro, e lo stesso la variazione di energia cinetica. Ma per tutti e due il lavoro è uguale alla variazione di energia cinetica: è questo che il principio di relatività garantisce.
```

```ad-warning
Stesse leggi non vuol dire stessi numeri
Il principio non dice che i due osservatori misurano gli stessi valori: velocità, spostamenti ed energie cinetiche sono diversi. Dice che usano le stesse formule, e che le grandezze della dinamica (forza, massa, accelerazione) coincidono. Quando in un problema compaiono due sistemi, ogni conto va fatto con le grandezze di un solo sistema: mescolare lo spostamento visto dal treno con la velocità vista da terra dà risultati senza senso.
```

## Anche la Terra è una nave

Il laboratorio in cui si fanno gli esperimenti non è fermo: gira con la Terra intorno al Sole.

```ad-example
Esempio 4: la velocità della Terra intorno al Sole
Con quale velocità la Terra percorre la sua orbita? La distanza media dal Sole è $1{,}50 \cdot 10^{11}\,\text{m}$ e il periodo è un anno, $3{,}15 \cdot 10^7\,\text{s}$.

L'orbita è quasi una circonferenza, percorsa a velocità quasi costante in modulo:

$$v = \frac{2\pi\,r}{T} = \frac{2\pi \cdot 1{,}50 \cdot 10^{11}\,\text{m}}{3{,}15 \cdot 10^7\,\text{s}} = 2{,}99 \cdot 10^4\,\text{m/s}$$

Sono circa $30\,\text{km/s}$, più di $100\,000\,\text{km/h}$.
```

Eppure nessuno si accorge di viaggiare a $30\,\text{km/s}$, e il sasso lasciato cadere dalla torre arriva alla base. In un secondo, o nei pochi minuti di un esperimento, il tratto di orbita percorso è così poco curvo che il moto della Terra è con ottima approssimazione rettilineo uniforme: il laboratorio è la stanza sotto coperta, e la Terra è la nave. Le piccole accelerazioni dovute alla curvatura dell'orbita e alla rotazione, calcolate nella lezione sui sistemi non inerziali, si rivelano solo con esperimenti molto sensibili o su moti che durano ore.

## Fin dove vale il principio

Il principio di Galileo ha due confini.

Il primo è scritto nell'enunciato: riguarda i sistemi inerziali. In un sistema che accelera le leggi della meccanica, scritte con le sole forze vere, non valgono; per usarle bisogna aggiungere le [forze apparenti](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/le-forze-apparenti-forza-centrifuga-e-forza-di-coriolis).

Il secondo è che parla delle leggi della meccanica. Alla fine dell'Ottocento ci si chiese se valesse anche per la luce e per i fenomeni elettrici e magnetici, e la risposta sembrava no: per la legge di composizione delle velocità, la luce dovrebbe avere velocità diverse per osservatori diversi, e gli esperimenti non trovavano questa differenza. Nel 1905 Albert Einstein risolse la questione estendendo il principio di relatività a tutte le leggi della fisica, e sostituendo le trasformazioni di Galileo con altre, che danno gli stessi risultati alle velocità ordinarie e risultati diversi vicino alla velocità della luce. È la relatività ristretta, che si studia al quinto anno. Per i moti di questa parte del corso, da un carrello a un satellite, il principio di Galileo e le sue trasformazioni restano lo strumento giusto.
