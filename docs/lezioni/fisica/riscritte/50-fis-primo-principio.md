# Il primo principio della dinamica e i sistemi inerziali

Un disco da hockey lanciato sul ghiaccio scivola per decine di metri, mentre un libro spinto sul tavolo si ferma dopo pochi centimetri. Per quasi duemila anni si è pensato che un corpo si muova solo finché qualcosa lo spinge; il primo principio della dinamica dice il contrario: per continuare a muoversi un corpo non ha bisogno di nessuna forza, e se si ferma è perché una forza lo frena.

## Perché i corpi si fermano

Per Aristotele (IV secolo a.C.) lo stato naturale di un corpo sulla Terra è la quiete: un carro si muove finché i buoi lo tirano e si ferma appena smettono. È quello che si vede ogni giorno, ma dipende da una forza che non si vede: l'[attrito](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito), che frena il carro, il libro e anche il disco sul ghiaccio, dove però è molto piccolo.

Galileo Galilei ragionò con due piani inclinati uno di fronte all'altro. Una pallina lasciata andare da un'altezza $h$ sul primo piano scende e risale sul secondo, fino quasi alla stessa altezza; tanto più vicino ad $h$ quanto più le superfici sono lisce. Se il secondo piano è meno ripido, la pallina percorre più strada per tornare all'altezza $h$. E se il secondo piano diventa orizzontale, la pallina non ritrova mai l'altezza da cui è partita: senza attrito continuerebbe a muoversi per sempre, con la stessa velocità.

```tikz
% nome: galileo-piano-doppio
% alt: Il piano inclinato doppio di Galileo. Una pallina parte da un'altezza h su un piano inclinato a sinistra; di fronte, tre piani sempre meno ripidi arrivano tutti alla stessa altezza h, segnata da una linea tratteggiata, e il piano meno ripido è il più lungo. L'ultimo piano è orizzontale, e una freccia dice che lì la pallina continua a muoversi senza fermarsi
% svg: galileo-piano-doppio-a95a64c6.svg 305x71
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (7.3,0);
\foreach \x in {-0.15,0,...,7.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[dashed, thin] (0,1.6) -- (7,1.6);
\draw[thick] (0,1.6) -- (1.6,0);
\draw[thick] (1.6,0) -- (2.8,1.6);
\draw[thick] (1.6,0) -- (4.4,1.6);
\draw[thick] (1.6,0) -- (6.4,1.6);
\draw[thick, fill=blue!10] (0.406,1.406) circle (0.15);
\fill (2.8,1.6) circle (1.5pt);
\fill (4.4,1.6) circle (1.5pt);
\fill (6.4,1.6) circle (1.5pt);
\draw[<->, thin] (-0.2,0) -- (-0.2,1.6);
\node[left] at (-0.2,0.8) {$h$};
\draw[-{Stealth}, thick, blue!60!black] (3.2,0.25) -- (5.2,0.25) node[right] {$\vec{v}$};
\node[above] at (4.2,0.3) {\small per sempre};
\end{tikzpicture}
```

Galileo racconta questo ragionamento nel "Dialogo sopra i due massimi sistemi del mondo" (1632) e nei "Discorsi e dimostrazioni matematiche intorno a due nuove scienze" (1638). Il passo decisivo è l'ultimo, che nessun laboratorio può realizzare del tutto: si immagina di togliere ogni attrito e si guarda che cosa resta. Resta un corpo che si muove in linea retta a velocità costante senza che niente lo spinga. Nella figura qui sotto cambi l'inclinazione del secondo piano e guardi fin dove arriva la pallina.

```interattivo
% nome: piano-doppio-galileo
% alt: Una pallina scende senza attrito da un piano inclinato a sinistra e risale su un secondo piano, la cui inclinazione si cambia con un cursore da 40 a 0 gradi. Una linea tratteggiata segna l'altezza di partenza: la pallina risale sempre fino a quella linea, e più il secondo piano è inclinato poco, più strada percorre. A 0 gradi il secondo piano è orizzontale, e la pallina continua ad andare avanti a velocità costante; sotto la figura sono scritti l'inclinazione, la velocità della pallina e la strada percorsa sul secondo piano
```

## L'inerzia

La tendenza di un corpo a conservare il suo stato di quiete o di moto rettilineo uniforme si chiama **inerzia**. Tutti i corpi hanno inerzia, e ne hanno di più quelli con più massa: un carrello della spesa pieno è più difficile da mettere in moto e da fermare di uno vuoto. Per questo la [massa](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa) si dice anche misura dell'inerzia di un corpo, come preciserà il [secondo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica).

L'inerzia si vede in molti fatti comuni. Si può sfilare con un colpo secco una tovaglia da sotto i piatti: i piatti, per inerzia, restano quasi dove sono. Una moneta appoggiata su un cartoncino sopra un bicchiere cade nel bicchiere quando il cartoncino viene tolto di scatto. In un'auto che frena i passeggeri continuano ad andare avanti e le cinture li trattengono.

## L'enunciato

Il **primo principio della dinamica**, detto anche **principio d'inerzia**, dice:

> Un corpo rimane in quiete, o si muove di moto rettilineo uniforme, se la forza totale che agisce su di esso è nulla.

La **forza totale** $\vec F_{tot}$ è la [risultante](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-e-il-dinamometro) di tutte le forze che agiscono sul corpo, sommate come vettori. Il principio vale anche al contrario: se un corpo è fermo, o si muove in linea retta a velocità costante, la forza totale su di esso è nulla.

$$\vec F_{tot} = \vec 0 \quad \Longleftrightarrow \quad \vec v \text{ costante}$$

"Velocità costante" vuol dire costante come vettore: stesso modulo, stessa direzione e stesso verso. Il corpo fermo è il caso $\vec v = \vec 0$, e la condizione è la stessa dell'[equilibrio di un punto materiale](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-punto-materiale-e-le-reazioni-vincolari). Il moto con velocità costante è il [moto rettilineo uniforme](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-rettilineo-uniforme-e-il-grafico-spazio-tempo). Un corpo che curva, anche senza cambiare il modulo della velocità, cambia direzione, e quindi la forza totale su di lui non è nulla: è il caso del [moto circolare uniforme](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-circolare-uniforme).

```ad-warning
Il moto non ha bisogno di una forza
Un corpo che si muove a velocità costante non ha "una forza nel verso del moto" che lo porta avanti: la forza totale su di lui è zero. Un'auto che viaggia a velocità costante in autostrada è spinta in avanti dalla strada, grazie al motore, ma la spinta è bilanciata dall'attrito e dalla resistenza dell'aria. Se il motore si spegne l'auto rallenta: non perché "finisce la forza", ma perché restano solo le forze che la frenano.
```

```ad-example
Esempio 1: una slitta a velocità costante
Una slitta di $30\,\text{kg}$ è tirata sulla neve con una fune orizzontale, con una forza di $45\,\text{N}$, e si muove a velocità costante. Quanto vale l'attrito? Quanto vale il coefficiente di attrito dinamico?

La velocità è costante, quindi la forza totale è nulla. In orizzontale agiscono la tensione della fune e l'attrito dinamico, che devono avere lo stesso modulo e versi opposti: $F_d = 45\,\text{N}$. In verticale il peso è bilanciato dalla reazione della neve, $F_v = P = 30\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 294\,\text{N}$, che è anche la forza premente. Dalla formula dell'attrito dinamico:

$$\mu_d = \frac{F_d}{F_\perp} = \frac{45\,\text{N}}{294\,\text{N}} = 0{,}153\ldots \approx 0{,}15$$

È il metodo della lezione sull'attrito per misurare $\mu_d$: si tira il corpo in modo che strisci a velocità costante, e la forza che serve è proprio l'attrito dinamico.
```

```ad-example
Esempio 2: un pacco con il paracadute
Un pacco di viveri di $8{,}5\,\text{kg}$ scende con il paracadute a velocità costante. Quanto vale la forza che l'aria esercita sul pacco e sul paracadute, la cui massa si trascura?

Il moto è rettilineo uniforme, quindi la forza totale è nulla: la resistenza dell'aria, verso l'alto, bilancia il peso, verso il basso.

$$R = P = 8{,}5\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 83{,}3\,\text{N} \approx 83\,\text{N}$$

Lo stesso vale per un corpo che sale a velocità costante: la fune di un ascensore che sale a velocità costante tira con una forza uguale al peso della cabina, né più né meno. Una forza più grande del peso serve solo nel tratto in cui l'ascensore parte, cioè accelera.
```

Quando le forze non sono tutte lungo la stessa retta, la forza totale nulla si scrive per componenti, come nella lezione [L'equilibrio di un punto materiale e le reazioni vincolari](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-punto-materiale-e-le-reazioni-vincolari): la somma delle componenti orizzontali è zero, e anche quella delle componenti verticali.

```ad-example
Esempio 3: la valigia tirata per la maniglia
Una valigia su rotelle viene tirata a velocità costante con una forza di $30\,\text{N}$, lungo la maniglia inclinata di $40^\circ$ sull'orizzontale. Quanto vale la forza che frena la valigia, parallela al pavimento?

La forza della maniglia ha una componente orizzontale e una verticale, che si trovano con il [seno e il coseno](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore):

$$F_x = F\cos 40^\circ = 30\,\text{N} \cdot 0{,}766 = 22{,}98\ldots\,\text{N} \qquad F_y = F\sin 40^\circ = 19{,}28\ldots\,\text{N}$$

In orizzontale la forza totale è nulla, quindi la forza che frena è uguale alla componente orizzontale: circa $23\,\text{N}$, non $30\,\text{N}$. La componente verticale, insieme alla reazione del pavimento, bilancia il peso.
```

```ad-example
Esempio 4: una cassa tirata da due funi
Due ragazzi tirano una cassa sul pavimento con due funi orizzontali perpendicolari tra loro: uno verso est con $48\,\text{N}$, l'altro verso nord con $36\,\text{N}$. La cassa striscia a velocità costante. Quanto vale l'attrito, e in che direzione agisce?

Le due forze delle funi hanno una risultante di modulo

$$R = \sqrt{48^2 + 36^2}\,\text{N} = 60\,\text{N}$$

diretta a $\tan^{-1}(36/48) \approx 37^\circ$ da est verso nord. La forza totale è nulla, quindi l'attrito ha lo stesso modulo della risultante, $60\,\text{N}$, e verso opposto: la cassa si muove nella direzione della risultante delle funi, e l'attrito si oppone al moto.

```tikz
% nome: cassa-due-funi-attrito
% alt: La cassa vista dall'alto, come un punto. Due forze rosse partono dal punto: F1 verso destra, lunga 1,92 centimetri, e F2 verso l'alto, lunga 1,44 centimetri. La loro risultante R, tratteggiata e arancione, è lunga 2,4 centimetri; l'attrito Fd, rosso, ha la stessa lunghezza e verso opposto. Scala di 1 centimetro per 25 newton
% svg: cassa-due-funi-attrito-7c1e0843.svg 192x159
\begin{tikzpicture}
\draw[dashed, thin] (1.92,0) -- (1.92,1.44) -- (0,1.44);
\draw[-{Stealth}, thick, orange!90!black, dashed] (0,0) -- (1.92,1.44) node[above right] {$\vec{R}$};
\draw[-{Stealth}, thick, red] (0,0) -- (1.92,0) node[below] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,1.44) node[left] {$\vec{F}_2$};
\draw[-{Stealth}, thick, red] (0,0) -- (-1.92,-1.44) node[below left] {$\vec{F}_d$};
\fill (0,0) circle (1.5pt);
\end{tikzpicture}
```
```

## I sistemi di riferimento inerziali

Il moto di un corpo si descrive sempre rispetto a un [sistema di riferimento](/materiale/scuola-superiore/fisica/il-moto-rettilineo/punto-materiale-traiettoria-e-sistema-di-riferimento), e il primo principio non vale in tutti.

Un pallone è appoggiato sul pavimento di un autobus che viaggia a velocità costante, e resta fermo rispetto all'autobus. Quando l'autobus frena, il pallone comincia a rotolare in avanti. Per un passeggero seduto il pallone parte da fermo senza che nessuno lo spinga: nel sistema di riferimento dell'autobus il primo principio non vale. Per chi guarda dal marciapiede, invece, non succede niente di strano: il pallone continua ad andare avanti con la velocità che aveva, perché il pavimento liscio non lo frena, ed è l'autobus che rallenta sotto di lui.

```tikz
% nome: autobus-frena-pallone
% alt: Un autobus visto di lato che viaggia verso destra e frena: la sua velocità v è una freccia verso destra, la sua accelerazione a una freccia verde verso sinistra. Sul pavimento dell'autobus c'è un pallone, con una freccia verso destra che indica la sua velocità, uguale a quella che aveva l'autobus prima di frenare
% svg: autobus-frena-pallone-9ee9cda0.svg 265x107
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (6.3,0);
\foreach \x in {-0.15,0,...,6.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=orange!25] (0.5,0.3) rectangle (5.3,2.1);
\foreach \x in {0.8,1.8,2.8,3.8} \draw[thick, fill=white] (\x,1.3) rectangle ++(0.75,0.55);
\draw[thick, fill=white] (4.75,0.6) rectangle (5.1,1.85);
\draw[thick, fill=gray!20] (1.4,0.3) circle (0.3);
\draw[thick, fill=gray!20] (4.4,0.3) circle (0.3);
\draw[thin] (0.5,0.62) -- (4.6,0.62);
\draw[thick, fill=blue!10] (2.6,0.82) circle (0.2);
\draw[-{Stealth}, thick, blue!60!black] (2.85,0.82) -- (3.75,0.82) node[right] {$\vec{v}$};
\draw[-{Stealth}, thick, blue!60!black] (5.5,1.7) -- (6.4,1.7) node[above] {$\vec{v}$};
\draw[-{Stealth}, thick, green!50!black] (1.8,2.35) -- (0.9,2.35) node[left] {$\vec{a}$};
\end{tikzpicture}
```

Un **sistema di riferimento inerziale** è un sistema di riferimento in cui vale il primo principio della dinamica. Il suolo terrestre lo è con ottima approssimazione per i moti di cui ci occupiamo: la Terra ruota su sé stessa e gira intorno al Sole, ma gli effetti di questi moti sui fenomeni di laboratorio sono molto piccoli. Ogni sistema che si muove di moto rettilineo uniforme rispetto a un sistema inerziale è anch'esso inerziale: nell'autobus che viaggia a velocità costante il pallone resta fermo, come a terra. Non sono inerziali i sistemi che accelerano, come l'autobus che frena o parte, o che ruotano, come una giostra.

In questo capitolo, e in tutto il secondo anno, i moti si descrivono rispetto al suolo, e i principi della dinamica si usano così come sono. I sistemi che accelerano si studiano al terzo anno, nella lezione [Sistemi di riferimento inerziali e non inerziali](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/sistemi-di-riferimento-inerziali-e-non-inerziali).

```ad-warning
In frenata nessuna forza spinge in avanti
Quando l'autobus frena ci si sente "spinti in avanti", ma non c'è nessuna forza che spinge: il corpo, per inerzia, continua a muoversi con la velocità che aveva, ed è l'autobus che rallenta. Per fermare il passeggero serve una forza all'indietro, quella della cintura o del sedile davanti.
```
