# Punto materiale, traiettoria e sistema di riferimento

Per descrivere il moto di un'auto, di un pallone o di un pianeta servono due informazioni: dove si trova il corpo e in quale istante ci si trova. La parte della fisica che risponde a queste domande, senza chiedersi quali forze causano il moto, si chiama **cinematica**. Prima di misurare velocità e accelerazioni bisogna mettersi d'accordo su tre cose: che cosa si segue del corpo, da dove si guarda e come si scrivono posizioni e tempi.

## Il punto materiale

Un'auto che va da Bologna a Firenze è lunga $4\,\text{m}$ e percorre più di $100\,\text{km}$: per sapere dove si trova basta un punto sulla cartina, e la sua forma non conta. Quando le dimensioni di un corpo sono piccole rispetto alle distanze che percorre, il corpo si può descrivere come un **punto materiale**: un punto che ha la massa del corpo, ma non ha dimensioni.

Lo stesso corpo può essere un punto materiale in un problema e non in un altro. L'auto che fa manovra per entrare in un parcheggio non è un punto materiale, perché conta dove sono il muso e la coda; la Terra che gira intorno al Sole lo è, perché il suo diametro, circa $13\,000\,\text{km}$, è piccolo rispetto alla distanza dal Sole, circa $150$ milioni di chilometri.

```ad-warning
Punto materiale non vuol dire corpo piccolo
Un corpo è un punto materiale quando le sue dimensioni sono trascurabili rispetto alle distanze del problema, non quando è piccolo in assoluto. Un'ape che gira dentro un barattolo di $10\,\text{cm}$ non è un punto materiale se interessa dove punta la testa; un treno di $200\,\text{m}$ in un viaggio di $600\,\text{km}$ lo è.
```

## La traiettoria

Mentre si muove, il punto materiale passa per una successione di posizioni. La linea che unisce tutte queste posizioni è la **traiettoria**. Se la traiettoria è una retta il moto è **rettilineo**, come quello di un'auto su un rettilineo o di un sasso che cade; se è una curva il moto è curvilineo, come quello di un pallone calciato o di una giostra. In questo capitolo i moti sono tutti rettilinei; quelli curvilinei sono nel capitolo [I moti nel piano](/materiale/scuola-superiore/fisica/i-moti-nel-piano).

## Il sistema di riferimento

Marco è seduto su un treno che viaggia a velocità costante su un binario dritto. Per la sua vicina di posto Marco è fermo; per chi aspetta sulla banchina Marco passa a $30\,\text{m/s}$. Le due affermazioni sono vere tutte e due, perché dire che un corpo si muove ha senso solo se si dice rispetto a che cosa. Il corpo o l'oggetto rispetto a cui si misurano le posizioni, con gli strumenti per misurarle, è il **sistema di riferimento**. Per un moto rettilineo il sistema di riferimento è fatto di:

- una retta orientata lungo la traiettoria, con un'origine $O$ e un verso positivo;
- un'unità di lunghezza, di solito il metro;
- un orologio, con un istante scelto come zero.

Moto e quiete sono quindi relativi: lo stesso corpo è fermo in un sistema di riferimento e in moto in un altro. Anche la traiettoria dipende dal sistema di riferimento. Marco lascia cadere una pallina: per lui, sul treno, la pallina scende in verticale; per chi è sulla banchina la pallina, mentre cade, viaggia in avanti con il treno, e la traiettoria è una curva.

```tikz
% nome: traiettoria-pallina-treno-banchina
% alt: Due disegni della stessa pallina che cade in un treno in moto verso destra. A sinistra, visto dal treno, le posizioni della pallina a intervalli di tempo uguali stanno su una retta verticale. A destra, visto dalla banchina, le stesse posizioni si spostano verso destra mentre scendono, e la traiettoria tratteggiata è una curva
% svg: traiettoria-pallina-treno-banchina-eff7fcfd.svg 312x147
\begin{tikzpicture}
\draw[thick] (-0.8,0) -- (0.8,0);
\foreach \x in {-0.65,-0.5,...,0.8} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[dashed, thin] (0,2.5) -- (0,0);
\foreach \y in {2.5,2.4,2.1,1.6,0.9,0} \fill (0,\y) circle (1.5pt);
\node[below] at (0,-0.25) {\small visto dal treno};
\begin{scope}[xshift=3.6cm]
\draw[thick] (-0.8,0) -- (3.4,0);
\foreach \x in {-0.65,-0.5,...,3.4} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[dashed, thin] plot[domain=0:2.5, samples=30] (\x,{2.5-0.4*\x*\x});
\foreach \x/\y in {0/2.5,0.5/2.4,1/2.1,1.5/1.6,2/0.9,2.5/0} \fill (\x,\y) circle (1.5pt);
\draw[-{Stealth}, thick, blue!60!black] (0,2.85) -- (0.8,2.85) node[right] {$\vec{v}$};
\node[below] at (1.3,-0.25) {\small vista dalla banchina};
\end{scope}
\end{tikzpicture}
```

## La posizione su una retta orientata

Nel moto rettilineo la traiettoria è la retta del sistema di riferimento, e la **posizione** del corpo è un numero solo: la sua coordinata $s$ sulla retta, cioè la distanza dall'origine con il segno. La posizione è positiva se il corpo sta dalla parte della freccia, negativa se sta dalla parte opposta. Si usa la lettera $s$, e $s_0$ per la posizione all'istante zero.

```tikz
% nome: posizione-retta-orientata
% alt: Una strada dritta con la retta orientata s, verso positivo a destra, l'origine O al semaforo e le tacche ogni 10 metri da meno 40 a 60. Un'auto si trova in s uguale a 30 metri, un ciclista in s uguale a meno 30 metri
% svg: posizione-retta-orientata-e6c55380.svg 397x47
\begin{tikzpicture}[scale=0.8]
\draw[->] (-4.6,0) -- (6.8,0) node[right] {$s$ (m)};
\foreach \x in {-4,-3,...,6} \draw (\x,0.08) -- (\x,-0.08);
\foreach \x/\t in {-4/-40,-2/-20,0/0,2/20,4/40,6/60} \node[below] at (\x,-0.1) {\small $\t$};
\node[above left] at (0,0.05) {$O$};
\fill (3,0) circle (2.5pt);
\node[above] at (3,0.1) {\small auto, $s = 30$ m};
\fill (-3,0) circle (2.5pt);
\node[above] at (-3,0.1) {\small ciclista, $s = -30$ m};
\end{tikzpicture}
```

Il segno non ha niente di strano: dice da che parte dell'origine sta il corpo. Chi sceglie il sistema di riferimento può mettere l'origine dove vuole e orientare la retta come vuole; i numeri cambiano, ma il moto è lo stesso.

## Istante e intervallo di tempo

Un **istante** è un momento preciso, come la lettura di un cronometro: $t = 12\,\text{s}$. Un **intervallo di tempo** è la durata tra due istanti $t_1$ e $t_2$, con $t_2$ dopo $t_1$:

$$\Delta t = t_2 - t_1$$

La lettera greca $\Delta$ (delta) davanti a una grandezza vuole dire sempre "valore finale meno valore iniziale". L'istante zero si sceglie quando fa comodo, di solito alla partenza; un intervallo di tempo non dipende da questa scelta, ed è sempre positivo.

```ad-warning
Ore e minuti non sono numeri decimali
Un autobus parte alle 8:52 e arriva alle 9:17. Scrivere $9{,}17 - 8{,}52 = 0{,}65$ e leggere "65 minuti" è sbagliato, perché un'ora ha $60$ minuti, non $100$. Si contano i minuti: dalle 8:52 alle 9:00 ne passano $8$, dalle 9:00 alle 9:17 ne passano $17$, in tutto $\Delta t = 25\,\text{min}$.
```

## Lo spostamento e la distanza percorsa

Se un corpo passa dalla posizione $s_1$ all'istante $t_1$ alla posizione $s_2$ all'istante $t_2$, il suo **spostamento** è

$$\Delta s = s_2 - s_1$$

Lo spostamento ha un segno: positivo se il corpo si è spostato nel verso della retta, negativo se si è spostato nel verso opposto. È il vettore spostamento della lezione [Grandezze scalari e grandezze vettoriali](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/grandezze-scalari-e-grandezze-vettoriali), scritto con un numero solo: su una retta la direzione è fissata, il modulo è il valore assoluto e il segno dice il verso.

```ad-example
Esempio 1: uno spostamento negativo
Sulla strada della figura, con l'origine al semaforo e il verso positivo a destra, un ciclista passa in $s_1 = 25\,\text{m}$ all'istante $t_1 = 3\,\text{s}$ e in $s_2 = -15\,\text{m}$ all'istante $t_2 = 11\,\text{s}$. Quanto valgono lo spostamento e l'intervallo di tempo?

$$\Delta s = s_2 - s_1 = -15\,\text{m} - 25\,\text{m} = -40\,\text{m} \qquad \Delta t = t_2 - t_1 = 11\,\text{s} - 3\,\text{s} = 8\,\text{s}$$

In $8\,\text{s}$ il ciclista si è spostato di $40\,\text{m}$ verso sinistra, cioè nel verso negativo, e ha superato il semaforo.
```

```ad-warning
L'ordine della sottrazione
Lo spostamento è la posizione finale meno quella iniziale, sempre. Nell'esempio 1 il conto $s_1 - s_2 = 40\,\text{m}$ dà il numero giusto con il segno sbagliato, e fa andare il ciclista nel verso opposto. Anche la somma $s_1 + s_2$ non ha senso: le posizioni non si sommano.
```

La **distanza percorsa** $d$ è invece la lunghezza di tutta la strada fatta, un numero sempre positivo. Se il corpo va sempre nello stesso verso, la distanza percorsa è il valore assoluto dello spostamento. Se torna indietro, i tratti si sommano tutti come lunghezze positive, e la distanza percorsa è più grande di $|\Delta s|$.

```ad-example
Esempio 2: andata e ritorno
Un'auto parte da $s = 0$, arriva fino a $s = 120\,\text{m}$ e poi torna indietro fino a $s = 50\,\text{m}$. Quanto valgono lo spostamento e la distanza percorsa?

```tikz
% nome: andata-ritorno-spostamento-distanza
% alt: Sulla retta orientata s, con le tacche ogni 10 metri da 0 a 120, l'auto va da 0 a 120 metri, tratto di andata di 120 metri, e torna da 120 a 50 metri, tratto di ritorno di 70 metri. Sotto, lo spostamento in blu va da 0 a 50 metri
% svg: andata-ritorno-spostamento-distanza-610971b5.svg 308x76
\begin{tikzpicture}[scale=0.5]
\draw[->] (-0.5,0) -- (13.4,0) node[right] {$s$ (m)};
\foreach \x in {0,1,...,12} \draw (\x,0.12) -- (\x,-0.12);
\foreach \x/\t in {0/0,5/50,10/100,12/120} \node[below] at (\x,-0.15) {\small $\t$};
\draw[-{Stealth}, thin] (0,1.8) -- (12,1.8);
\node[above] at (6,1.8) {\small andata, $120$ m};
\draw[-{Stealth}, thin] (12,1.1) -- (5,1.1);
\node[below] at (8.5,1.1) {\small ritorno, $70$ m};
\draw[-{Stealth}, thick, blue] (0,0.45) -- (5,0.45);
\node[above] at (2.5,0.45) {$\Delta s$};
\fill (0,0) circle (4pt);
\fill (5,0) circle (4pt);
\end{tikzpicture}
```

Lo spostamento dipende solo dalla partenza e dall'arrivo:

$$\Delta s = 50\,\text{m} - 0\,\text{m} = 50\,\text{m}$$

La distanza percorsa somma l'andata, $120\,\text{m}$, e il ritorno, $120\,\text{m} - 50\,\text{m} = 70\,\text{m}$:

$$d = 120\,\text{m} + 70\,\text{m} = 190\,\text{m}$$
```

```ad-warning
Il ritorno non si toglie dalla distanza percorsa
Nell'esempio 2 la risposta $120\,\text{m} - 70\,\text{m} = 50\,\text{m}$ per la distanza percorsa è sbagliata: è lo spostamento. Il contachilometri dell'auto, che misura la distanza percorsa, alla fine segna $190\,\text{m}$ in più, perché anche i metri fatti tornando indietro sono metri di strada.
```

Nella figura qui sotto fai partire l'auto, o sposta il tempo: la freccia blu è lo spostamento dalla partenza, la linea arancione è la strada fatta. Finché l'auto va avanti le due sono lunghe uguali; quando torna indietro lo spostamento si accorcia e la distanza percorsa continua a crescere.

```interattivo
% nome: andata-ritorno-distanza-spostamento
% alt: Un'auto su una strada dritta con la retta orientata s da 0 a 120 metri. L'auto va da 0 a 120 metri, si ferma e torna indietro fino a 50 metri; un cursore sposta il tempo e un bottone fa partire il moto. Sopra la strada una freccia blu va dalla partenza all'auto, lo spostamento, e una linea arancione ripercorre tutta la strada fatta, la distanza percorsa; sotto la figura sono scritti il tempo, la posizione, lo spostamento e la distanza percorsa
```

## La legge oraria come tabella

La **legge oraria** di un moto dice in quale posizione si trova il corpo in ogni istante. La forma più semplice è una tabella: si misura la posizione a istanti diversi, per esempio fotografando il corpo a intervalli regolari o leggendo un sensore di posizione.

```ad-example
Esempio 3: la tabella di un'automobilina
Un'automobilina telecomandata si muove su un corridoio dritto. Un sensore misura la sua posizione ogni $2\,\text{s}$:

| $t$ (s) | $0$ | $2$ | $4$ | $6$ | $8$ | $10$ |
|---|---|---|---|---|---|---|
| $s$ (m) | $4$ | $10$ | $16$ | $16$ | $8$ | $0$ |

Tra una misura e la successiva l'automobilina non cambia verso. Quanto vale lo spostamento tra $t = 0$ e $t = 4\,\text{s}$? E tra $t = 4\,\text{s}$ e $t = 10\,\text{s}$? Quanto vale la distanza percorsa in tutti i $10\,\text{s}$?

```tikz
% nome: automobilina-posizioni-istanti
% alt: Le posizioni dell'automobilina sulla retta orientata s, da 0 a 16 metri, con l'istante accanto a ogni punto. Nella riga di sopra l'andata: 4 metri a t uguale a 0, 10 metri a 2 secondi, 16 metri a 4 secondi. Nella riga di sotto il ritorno: 16 metri a 6 secondi, 8 metri a 8 secondi, 0 metri a 10 secondi
% svg: automobilina-posizioni-istanti-713a2a98.svg 356x80
\begin{tikzpicture}[scale=0.45]
\draw[->] (-0.5,0) -- (17.4,0) node[right] {$s$ (m)};
\foreach \x in {0,2,...,16} \draw (\x,0.15) -- (\x,-0.15);
\foreach \x in {0,4,8,12,16} \node[below] at (\x,-0.2) {\small $\x$};
\draw[-{Stealth}, thin, gray] (4,2.2) -- (15.7,2.2);
\foreach \x/\t in {4/0,10/2,16/4} {\fill (\x,2.2) circle (5pt); \node[above] at (\x,2.35) {\small $\t$ s};}
\draw[-{Stealth}, thin, gray] (16,1) -- (0.3,1);
\foreach \x/\t in {16/6,8/8,0/10} {\fill (\x,1) circle (5pt); \node[above] at (\x,1.15) {\small $\t$ s};}
\end{tikzpicture}
```

Nei primi $4\,\text{s}$ l'automobilina va avanti:

$$\Delta s = 16\,\text{m} - 4\,\text{m} = 12\,\text{m}$$

Tra $4\,\text{s}$ e $6\,\text{s}$ la posizione non cambia: l'automobilina è ferma. Poi torna indietro:

$$\Delta s = 0\,\text{m} - 16\,\text{m} = -16\,\text{m}$$

In tutto lo spostamento è $0\,\text{m} - 4\,\text{m} = -4\,\text{m}$, e la distanza percorsa è $12\,\text{m} + 16\,\text{m} = 28\,\text{m}$.
```

```ad-note
Una tabella dice solo quello che misura
La tabella dà la posizione negli istanti misurati e non dice niente di quello che succede in mezzo. Per questo l'esempio 3 dice che tra una misura e l'altra l'automobilina non cambia verso: senza quell'informazione non si potrebbe calcolare la distanza percorsa. Per vedere il moto in ogni istante si disegna la legge oraria come grafico, con il tempo in orizzontale e la posizione in verticale: è il grafico spazio-tempo della lezione [Il moto rettilineo uniforme e il grafico spazio-tempo](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-rettilineo-uniforme-e-il-grafico-spazio-tempo).
```

Con la tabella di un moto si calcolano anche le velocità: quanti metri il corpo percorre in ogni secondo, e con quale verso. È l'argomento della lezione [La velocità media e istantanea](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-velocita-media-e-istantanea).
