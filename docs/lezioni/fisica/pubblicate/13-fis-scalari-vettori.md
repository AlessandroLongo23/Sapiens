# Grandezze scalari e grandezze vettoriali

Se il termometro della classe segna $21\,^\circ\text{C}$, quel numero con la sua unità dice tutto quello che c'è da sapere sulla temperatura. Se invece un amico ti scrive che si è spostato di $3\,\text{km}$, non sai dove sia: poteva andare verso il mare o verso la montagna. Per lo spostamento servono anche una direzione e un verso. Le grandezze fisiche si dividono così in due famiglie, gli scalari e i vettori, e con i vettori si descrivono spostamenti, velocità e forze.

## Grandezze scalari

Una grandezza è **scalare** quando la descrive completamente un numero con la sua unità di misura. Sono scalari la massa ($2{,}5\,\text{kg}$), il tempo ($45\,\text{s}$), la temperatura ($21\,^\circ\text{C}$), il volume ($1{,}5\,\text{L}$), la densità, la lunghezza di un percorso. Le unità sono quelle della lezione [Grandezze fisiche e unità del Sistema Internazionale](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-fisiche-e-unita-del-sistema-internazionale).

Gli scalari si sommano come i numeri, purché abbiano la stessa unità: un sacchetto di $2\,\text{kg}$ e uno di $3\,\text{kg}$ pesano insieme sulla bilancia $5\,\text{kg}$, comunque li metti sul piatto. Alcuni scalari possono essere negativi, come la temperatura di $-5\,^\circ\text{C}$: il segno meno indica un valore sotto lo zero della scala, non una direzione nello spazio.

## Grandezze vettoriali

Uno spostamento di $3\,\text{km}$ verso nord e uno di $3\,\text{km}$ verso est portano in due posti diversi, anche se il numero è lo stesso. Una grandezza è **vettoriale** quando per descriverla servono tre informazioni:

- il **modulo**, o intensità: quanto è grande, un numero positivo con la sua unità, per esempio $3\,\text{km}$;
- la **direzione**: la retta lungo cui agisce, per esempio la retta nord-sud, la verticale, una retta inclinata di $30^\circ$ sull'orizzontale;
- il **verso**: quale dei due modi di percorrere quella retta, per esempio verso nord oppure verso sud, verso l'alto oppure verso il basso.

Sono vettoriali lo spostamento, la [velocità](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-velocita-media-e-istantanea), l'[accelerazione](/materiale/scuola-superiore/fisica/il-moto-rettilineo/l-accelerazione) e la [forza](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-e-il-dinamometro). Spingere un carrello con una forza di $50\,\text{N}$ in avanti o all'indietro fa una bella differenza: il modulo da solo non basta.

```ad-warning
Direzione e verso non sono la stessa cosa
Nel linguaggio di tutti i giorni "in direzione di Milano" vuol dire anche verso dove si va. In fisica le due parole si separano: l'autostrada tra Roma e Milano è la direzione, e su quella stessa direzione si può andare nel verso di Milano o nel verso di Roma. Due vettori con la stessa direzione possono avere versi opposti.
```

## Come si disegna un vettore

Un vettore si disegna con una freccia. La freccia sta sulla retta della direzione, la punta indica il verso e la lunghezza rappresenta il modulo. Il punto da cui parte la freccia si chiama **origine**, o coda.

```tikz
% nome: vettore-origine-punta-direzione
% alt: Una freccia blu che parte dall'origine e sale verso destra fino alla punta, con il nome v con la freccia sopra; la retta tratteggiata che la contiene è la direzione, la punta indica il verso, la lunghezza della freccia è il modulo
% svg: vettore-origine-punta-direzione-badcc603.svg 215x119
\begin{tikzpicture}
\draw[dashed, thin, gray] (-0.9,-0.45) -- (4.4,2.2);
\draw[-{Stealth}, thick, blue] (0,0) -- (3,1.5) node[midway, above left] {$\vec{v}$};
\fill (0,0) circle (1.5pt);
\node[above left] at (0,0) {\small origine};
\node[above left] at (3,1.5) {\small punta};
\node[above left] at (4.3,2.15) {\small direzione};
\draw[<->, thin] (0.2,-0.4) -- (3.2,1.1);
\node[below right] at (1.7,0.35) {\small modulo};
\end{tikzpicture}
```

Il nome di un vettore è una lettera con una freccia sopra: $\vec{v}$, $\vec{s}$ per uno spostamento, $\vec{F}$ per una forza. Il modulo si scrive con la stessa lettera senza freccia, $v$, oppure con le sbarrette, $|\vec{v}|$, quando serve distinguerlo bene dal vettore. Molti libri scrivono i vettori in grassetto, $\mathbf{v}$: il significato è lo stesso.

### La scala

Per disegnare un vettore di $150\,\text{m}$ su un quaderno si sceglie una **scala**, cioè quanti metri (o newton, o chilometri) rappresenta ogni centimetro della freccia. La lunghezza della freccia e il modulo sono direttamente proporzionali, come nella lezione sulla [proporzionalità diretta](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare):

$$\text{lunghezza della freccia} = \frac{\text{modulo}}{\text{valore di } 1\,\text{cm}}$$

```ad-example
Esempio 1: disegnare in scala
Disegna uno spostamento di $150\,\text{m}$ verso est, in scala $1\,\text{cm} : 50\,\text{m}$.

Ogni centimetro vale $50\,\text{m}$, quindi la freccia è lunga $150 : 50 = 3\,\text{cm}$. Si disegna orizzontale, perché la direzione è quella est-ovest, con la punta a destra, verso est.

```tikz
% nome: spostamento-in-scala
% alt: Una freccia blu orizzontale lunga 3 centimetri, verso destra cioè verso est, che rappresenta uno spostamento di 150 metri; sotto, la scala: un segmento di 1 centimetro vale 50 metri
% svg: spostamento-in-scala-79618635.svg 140x56
\begin{tikzpicture}
\draw[-{Stealth}, thick, blue] (0,0) -- (3,0) node[midway, above] {$\vec{s}$};
\fill (0,0) circle (1.5pt);
\node[right] at (3.1,0) {\small E};
\draw[thin] (0,-0.7) -- (1,-0.7);
\draw[thin] (0,-0.62) -- (0,-0.78);
\draw[thin] (1,-0.62) -- (1,-0.78);
\node[right] at (1.1,-0.7) {\small $1$ cm $=$ $50$ m};
\end{tikzpicture}
```
```

```ad-example
Esempio 2: leggere un vettore in scala
In un disegno in scala $1\,\text{cm} : 20\,\text{N}$ una forza è rappresentata da una freccia lunga $4{,}5\,\text{cm}$. Quanto vale il suo modulo?

Ogni centimetro vale $20\,\text{N}$, quindi il modulo è $4{,}5 \cdot 20 = 90\,\text{N}$.
```

```ad-warning
Il modulo non è mai negativo
Il modulo è una lunghezza, quella della freccia: è positivo, oppure zero. Un vettore che punta verso il basso o verso ovest non ha un modulo negativo, ha un verso diverso. Scrivere $F = -30\,\text{N}$ per dire "$30\,\text{N}$ verso il basso" mescola il modulo con il verso.
```

## Vettori uguali e vettori opposti

Due vettori sono **uguali** quando hanno lo stesso modulo, la stessa direzione e lo stesso verso, anche se sono disegnati in punti diversi del foglio: uno è la copia dell'altro spostata senza girarla. Due vettori sono **opposti** quando hanno lo stesso modulo e la stessa direzione ma verso opposto. L'opposto di $\vec{a}$ si scrive $-\vec{a}$.

Sulla griglia della figura ogni vettore va da un incrocio a un altro. $\vec{b}$ fa gli stessi passi di $\vec{a}$, tre quadretti a destra e due in alto: è uguale ad $\vec{a}$. $\vec{c}$ fa i passi al contrario, tre a sinistra e due in basso: è l'opposto, $\vec{c} = -\vec{a}$. $\vec{d}$ è lungo quanto $\vec{a}$, perché fa due passi a destra e tre in alto, ma ha un'altra direzione: non è uguale ad $\vec{a}$.

```tikz
% nome: vettori-uguali-opposti-griglia
% alt: Su una griglia quattro vettori: a va di tre quadretti a destra e due in alto; b fa gli stessi passi partendo da un altro punto ed è uguale ad a; c fa tre quadretti a sinistra e due in basso ed è l'opposto di a; d va di due a destra e tre in alto, ha lo stesso modulo di a ma un'altra direzione
% svg: vettori-uguali-opposti-griglia-329bc225.svg 276x118
\begin{tikzpicture}[scale=0.6]
\draw[gray!25, very thin] (0,0) grid (12,5);
\draw[-{Stealth}, thick, blue] (0,1) -- (3,3) node[midway, above left] {$\vec{a}$};
\draw[-{Stealth}, thick, blue] (4,0) -- (7,2) node[midway, above left] {$\vec{b}$};
\draw[-{Stealth}, thick, blue] (7,5) -- (4,3) node[midway, above left] {$\vec{c}$};
\draw[-{Stealth}, thick, blue] (9,1) -- (11,4) node[midway, left] {$\vec{d}$};
\end{tikzpicture}
```

Il vettore che ha modulo zero si chiama **vettore nullo**, si scrive $\vec{0}$ e non ha né direzione né verso: è lo spostamento di chi torna al punto di partenza.

Prova a confrontare due vettori da solo: trascina l'origine e la punta di $\vec{b}$ e guarda quando è uguale ad $\vec{a}$, quando è opposto e quando ha solo il modulo in comune.

```interattivo
% nome: vettori-confronto-griglia
% alt: Su una griglia il vettore a è fisso e il vettore b ha l'origine e la punta da trascinare, che scattano sugli incroci; sotto sono scritti i moduli dei due vettori e se hanno la stessa direzione e lo stesso verso, e una frase dice se b è uguale ad a, opposto ad a, oppure diverso
```

```ad-warning
Stesso modulo non vuol dire vettori uguali
Due forze di $10\,\text{N}$ non sono per forza uguali: se una tira verso destra e l'altra verso l'alto hanno effetti diversi. Due vettori sono uguali solo se coincidono modulo, direzione e verso. Per le forze conta anche il punto in cui sono applicate, come spiega la lezione [Le forze e il dinamometro](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-e-il-dinamometro).
```

## Lo spostamento e la distanza percorsa

Lo **spostamento** è il vettore che va dal punto di partenza al punto di arrivo. Dipende solo da questi due punti, non dalla strada fatta in mezzo. La **distanza percorsa** invece è la lunghezza di tutta la strada, ed è uno scalare.

```ad-example
Esempio 3: avanti e indietro su una strada dritta
Un ciclista percorre $12\,\text{km}$ verso est lungo una strada dritta, poi torna indietro di $5\,\text{km}$. Trova la distanza percorsa e lo spostamento.

```tikz
% nome: distanza-spostamento-retta
% alt: Su una strada dritta orientata da ovest a est il ciclista parte da A, va di 12 chilometri verso est, poi torna indietro di 5 chilometri fino a B; lo spostamento, in blu, va da A a B ed è lungo 7 chilometri verso est
% svg: distanza-spostamento-retta-9b59a9ca.svg 295x72
\begin{tikzpicture}[scale=0.5]
\draw[thin] (-0.5,0) -- (13,0);
\node[left] at (-0.5,0) {\small O};
\node[right] at (13,0) {\small E};
\foreach \x in {0,1,...,12} \draw[thin] (\x,0.1) -- (\x,-0.1);
\draw[-{Stealth}, thin] (0,1.6) -- (12,1.6);
\draw[-{Stealth}, thin] (12,1.1) -- (7,1.1);
\node[above] at (6,1.6) {\small $12$ km};
\node[below] at (9.5,1.1) {\small $5$ km};
\draw[-{Stealth}, thick, blue] (0,0.45) -- (7,0.45);
\node[above] at (3.5,0.45) {$\vec{s}$};
\fill (0,0) circle (3pt);
\fill (7,0) circle (3pt);
\node[below] at (0,-0.15) {$A$};
\node[below] at (7,-0.15) {$B$};
\end{tikzpicture}
```

La distanza percorsa è la somma delle due tratte, perché è una lunghezza:

$$12\,\text{km} + 5\,\text{km} = 17\,\text{km}$$

Lo spostamento va dalla partenza $A$ all'arrivo $B$, che si trova a $12 - 5 = 7\,\text{km}$ a est di $A$. Quindi lo spostamento ha modulo $7\,\text{km}$, direzione est-ovest e verso est.
```

```ad-example
Esempio 4: un giro di pista
Una ragazza corre un giro completo di una pista di atletica lunga $400\,\text{m}$ e si ferma sulla linea da cui è partita. Trova la distanza percorsa e lo spostamento.

La distanza percorsa è $400\,\text{m}$. Lo spostamento è il vettore nullo, perché il punto di arrivo coincide con quello di partenza: il suo modulo è $0\,\text{m}$.
```

Quando la strada non è dritta, il modulo dello spostamento si trova misurando il segmento tra partenza e arrivo. Se la strada è fatta di due tratti perpendicolari, i due tratti e lo spostamento formano un triangolo rettangolo, e il modulo si calcola con il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide).

```ad-example
Esempio 5: a zigzag tra gli isolati
In una città con le strade a scacchiera ogni isolato è lungo $100\,\text{m}$. Luca parte da $A$, cammina per $3$ isolati verso est e poi per $4$ isolati verso nord, fino a $B$. Trova la distanza percorsa e il modulo dello spostamento.

```tikz
% nome: spostamento-isolati-pitagora
% alt: Su una griglia di isolati Luca va da A per 3 isolati verso est e poi per 4 verso nord fino a B; lo spostamento, in blu, va in diagonale da A a B e forma con i due tratti un triangolo rettangolo
% svg: spostamento-isolati-pitagora-a819fac8.svg 141x123
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-0.5,-0.5) grid (4.5,4.5);
\draw[-{Stealth}, thin] (0,0) -- (3,0);
\draw[-{Stealth}, thin] (3,0) -- (3,4);
\draw (2.7,0) -- (2.7,0.3) -- (3,0.3);
\node[below] at (1.5,0) {\small $300$ m};
\node[right] at (3,2) {\small $400$ m};
\draw[-{Stealth}, thick, blue] (0,0) -- (3,4);
\node[above left] at (1.5,2) {$\vec{s}$};
\fill (0,0) circle (2.5pt);
\fill (3,4) circle (2.5pt);
\node[below left] at (0,0) {$A$};
\node[above right] at (3,4) {$B$};
\draw[-{Stealth}, thin] (5.3,1.5) -- (5.3,2.5);
\node[above] at (5.3,2.5) {\small N};
\end{tikzpicture}
```

La distanza percorsa è la lunghezza della strada: $300\,\text{m} + 400\,\text{m} = 700\,\text{m}$.

Lo spostamento va da $A$ a $B$ in linea retta, ed è l'ipotenusa del triangolo rettangolo con i cateti di $300\,\text{m}$ e $400\,\text{m}$:

$$s = \sqrt{300^2 + 400^2} = \sqrt{250\,000} = 500\,\text{m}$$

Lo spostamento è più corto della strada fatta: Luca è a $500\,\text{m}$ in linea d'aria dal punto di partenza, verso nord-est. L'angolo esatto della direzione si calcola con la trigonometria, nella lezione [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore).
```

```ad-warning
Lo spostamento non è la strada fatta
La distanza percorsa si somma tratto per tratto; lo spostamento no. Nell'esempio 5 lo spostamento non è $700\,\text{m}$ ma $500\,\text{m}$, e nell'esempio 4 è zero anche dopo $400\,\text{m}$ di corsa. Il modulo dello spostamento è uguale alla distanza percorsa solo quando si va dritti, sempre nello stesso verso; negli altri casi è minore.
```

Negli esempi 3 e 5 i due tratti del percorso sono spostamenti, e lo spostamento totale si ottiene mettendoli uno dopo l'altro: è la somma di due vettori, che non si fa come la somma dei numeri. Come si fa in generale, con i vettori in qualsiasi direzione, lo spiega la lezione [Somma e differenza di vettori](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori).
