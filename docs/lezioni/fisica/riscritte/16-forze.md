# Le forze e il dinamometro

Spingi un carrello, tiri una corda, schiacci una pallina di gomma, avvicini una calamita a un chiodo: in tutti questi casi un corpo agisce su un altro, e l'azione ha un effetto che si vede. In fisica un'azione di questo tipo si chiama forza. Le forze hanno un'intensità, che si misura in newton con il dinamometro, e una direzione e un verso: per questo si rappresentano con i vettori.

La lezione usa i vettori della lezione [Grandezze scalari e grandezze vettoriali](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/grandezze-scalari-e-grandezze-vettoriali) e la loro somma, spiegata in [Somma e differenza di vettori](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori).

## Che cos'è una forza

Una **forza** è l'azione di un corpo su un altro corpo, capace di cambiarne il movimento o di deformarlo. Una forza c'è sempre tra due corpi: la mano che spinge e il carrello, la Terra e la mela che cade, la calamita e il chiodo.

Gli effetti di una forza sono di due tipi:

- **effetto dinamico**: la forza cambia il movimento del corpo, cioè lo mette in moto, lo ferma, lo fa andare più veloce o più piano, gli fa cambiare direzione. Un calcio al pallone, i freni di una bicicletta.
- **effetto statico**: la forza deforma il corpo, che però resta fermo. Una molla che si allunga, un materasso che si schiaccia sotto chi ci si sdraia, una mensola che si piega sotto i libri.

Spesso i due effetti si vedono insieme: il pallone calciato si schiaccia per un attimo e parte. Come le forze cambiano il movimento lo spiegano i [principi della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica), al secondo anno; qui ci interessano soprattutto gli effetti statici, perché è con una deformazione che le forze si misurano.

## La forza è un vettore

Spingere un armadio verso destra o verso sinistra non è la stessa cosa, anche se la spinta è la stessa: l'effetto di una forza dipende dalla sua direzione e dal suo verso, non solo da quanto è intensa. La forza è quindi una grandezza vettoriale, e si disegna con una freccia. Per descriverla servono quattro cose:

1. il punto di applicazione, il punto del corpo su cui la forza agisce, da cui parte la freccia;
2. la direzione, cioè la retta su cui sta la freccia, detta anche retta d'azione della forza;
3. il verso, quello in cui punta la freccia;
4. il modulo (o intensità), un numero positivo con la sua unità di misura: nel disegno è la lunghezza della freccia, in una scala scelta.

Il vettore si scrive $\vec{F}$ e il suo modulo $F$, senza freccia.

```tikz
% nome: forza-caratteristiche
% alt: Un blocco con una forza F di 20 newton che parte dal suo centro, il punto di applicazione, e punta verso destra lungo una retta tratteggiata, la retta d'azione; nella scala del disegno 1 centimetro vale 10 newton, e la freccia è lunga 2 centimetri
% svg: forza-caratteristiche-884a10a5.svg 272x99
\begin{tikzpicture}
\draw[dashed, thin] (-1.3,0.35) -- (3.4,0.35);
\draw[thick, fill=blue!10] (-0.5,0) rectangle (0.5,0.7);
\draw[-{Stealth}, thick, red] (0,0.35) -- (2,0.35) node[above] {$\vec{F}$};
\fill (0,0.35) circle (1.5pt);
\draw[thin] (0,0.35) -- (-0.9,1.25) node[above] {\small punto di applicazione};
\node[left] at (-1.3,0.35) {\small retta d'azione};
\draw[|-|, thin] (0,-0.3) -- (2,-0.3);
\node[below] at (1,-0.3) {\small $F = 20$ N};
\draw[thick] (2.6,-0.3) -- (3.6,-0.3);
\draw[thin] (2.6,-0.38) -- (2.6,-0.22);
\draw[thin] (3.6,-0.38) -- (3.6,-0.22);
\node[below] at (3.1,-0.3) {\small $10$ N};
\end{tikzpicture}
```

Nella figura la scala è $1\,\text{cm}$ per $10\,\text{N}$: la freccia lunga $2\,\text{cm}$ rappresenta una forza di $20\,\text{N}$. In un disegno le frecce di forze diverse vanno nella stessa scala, così si confrontano a colpo d'occhio.

## Il newton

L'unità di misura della forza nel Sistema Internazionale è il **newton**, di simbolo N, dal nome di Isaac Newton. È un'unità derivata: la sua definizione, $1\,\text{N} = 1\,\text{kg} \cdot \text{m/s}^2$, viene dal [secondo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica). Per farsi un'idea:

- per tenere in mano una mela di circa $100\,\text{g}$ serve una forza di circa $1\,\text{N}$;
- una bottiglia d'acqua da un litro, cioè da $1\,\text{kg}$, pesa $9{,}8\,\text{N}$;
- una persona di $60\,\text{kg}$ pesa circa $590\,\text{N}$.

Come si passa dalla massa in chilogrammi al peso in newton lo spiega la lezione [La forza-peso e la massa](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa).

```ad-warning
La forza non si misura in chilogrammi
Nel linguaggio di tutti i giorni si dice "spingo con una forza di 10 chili", ma il chilogrammo è l'unità della massa. Una forza si scrive sempre in newton: $12\,\text{N}$, non $12\,\text{kg}$.
```

## Forze di contatto e forze a distanza

Molte forze agiscono solo quando due corpi si toccano: sono le **forze di contatto**. Sono di contatto la spinta di una mano, il tiro di una corda, la [forza elastica](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-elastica-e-la-legge-di-hooke) di una molla, le [forze di attrito](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito) tra due superfici che strisciano.

Altre forze agiscono anche tra corpi lontani, senza che si tocchino: sono le **forze a distanza**. La Terra attira una mela anche mentre cade e non la tocca (è la [forza-peso](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa)); una calamita attira un chiodo da qualche centimetro; un pettine strofinato sui capelli attira pezzetti di carta. Sono forze a distanza la forza di gravità, la forza magnetica e la forza elettrica.

## Il dinamometro

Per misurare una forza si usa un suo effetto statico: l'allungamento di una molla. Il **dinamometro** è una molla chiusa in un tubo, con un anello in alto per appenderlo o tenerlo fermo e un gancio in basso, a cui si applica la forza da misurare. Quando il gancio viene tirato la molla si allunga, e un indice attaccato alla sua estremità scorre lungo una scala graduata in newton.

```tikz
% nome: dinamometro-struttura
% alt: Un dinamometro appeso per l'anello, con un sacchetto al gancio: dentro il tubo la molla è allungata e l'indice, alla sua estremità, segna 1,3 newton sulla scala che va da 0 a 2 newton, divisa in 20 parti da 0,1 newton
% svg: dinamometro-struttura-3437f262.svg 122x311
\begin{tikzpicture}
\draw[thick] (-0.9,4.95) -- (0.9,4.95);
\foreach \x in {-0.75,-0.6,...,0.9} \draw[thin] (\x,4.95) -- ++(-0.15,0.15);
\draw[thick] (0,4.95) -- (0,4.75);
\draw[thick] (0,4.6) circle (0.15);
\draw[thick, fill=gray!20] (-0.3,0.4) rectangle (0.3,4.45);
\draw (0,4.45) -- (0,4.3);
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (0,4.3) -- (0,1.65);
\draw[thick] (0,1.65) -- (0,-1.85);
\draw[very thick] (-0.3,1.65) -- (0.3,1.65);
\foreach \i in {0,...,20} \draw[thin] (0.3,3.6-0.15*\i) -- (0.2,3.6-0.15*\i);
\foreach \i in {0,...,4} \draw (0.3,3.6-0.75*\i) -- (0.1,3.6-0.75*\i);
\node[right] at (0.3,3.6) {\scriptsize $0$};
\node[right] at (0.3,2.85) {\scriptsize $0{,}5$};
\node[right] at (0.3,2.1) {\scriptsize $1$};
\node[right] at (0.3,1.35) {\scriptsize $1{,}5$};
\node[right] at (0.3,0.6) {\scriptsize $2$};
\node[right] at (0.3,4.1) {\scriptsize N};
\draw[thick] (0,-1.85) arc[start angle=90, end angle=-200, radius=0.13];
\draw (0,-2.11) -- (0,-2.45);
\draw[thick, fill=blue!10] (-0.35,-3.0) rectangle (0.35,-2.45);
\draw[thin] (-0.15,4.6) -- (-1.1,4.6) node[left] {\small anello};
\draw[thin] (0,3.0) -- (-1.1,3.0) node[left] {\small molla};
\draw[thin] (-0.3,1.65) -- (-1.1,1.65) node[left] {\small indice};
\draw[thin] (-0.1,-1.95) -- (-1.1,-1.95) node[left] {\small gancio};
\end{tikzpicture}
```

La molla del dinamometro si allunga in proporzione alla forza: una forza doppia dà un allungamento doppio. Per questo le tacche della scala sono tutte alla stessa distanza. È la legge di Hooke, spiegata nella lezione [La forza elastica e la legge di Hooke](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-elastica-e-la-legge-di-hooke).

### Portata e sensibilità

Come ogni [strumento di misura](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/gli-strumenti-di-misura), il dinamometro ha una portata e una sensibilità:

- la **portata** è la forza più grande che può misurare, l'ultimo numero della scala;
- la **sensibilità** è la più piccola variazione di forza che si riesce a leggere: nel dinamometro è il valore di una divisione della scala, cioè la portata divisa per il numero delle divisioni.

Un dinamometro con la scala da $0$ a $10\,\text{N}$ divisa in $50$ parti ha la portata di $10\,\text{N}$ e la sensibilità di $10 : 50 = 0{,}2\,\text{N}$. Con una molla più rigida si costruiscono dinamometri con una portata più grande, che però hanno di solito una sensibilità peggiore: per misurare $0{,}3\,\text{N}$ si sceglie un dinamometro da $1\,\text{N}$, non uno da $100\,\text{N}$.

```ad-warning
Oltre la portata la molla si rovina
Una forza più grande della portata allunga la molla oltre il suo limite di elasticità: tolto il peso, la molla non torna più alla lunghezza di prima, e da quel momento il dinamometro misura male.
```

### Come si legge un dinamometro

1. Tieni il dinamometro nella posizione in cui lo userai (appeso, se misurerai un peso) e, senza niente al gancio, controlla che l'indice sia sullo zero; se non lo è, correggilo con la vite di regolazione.
2. Applica la forza lungo l'asse del dinamometro: una forza obliqua fa strisciare la molla contro il tubo.
3. Aspetta che l'indice sia fermo.
4. Leggi la tacca più vicina all'indice con l'occhio alla sua altezza, per non commettere l'errore di parallasse.
5. Scrivi la misura con la sua incertezza, che per una lettura sola è la sensibilità: $(1{,}3 \pm 0{,}1)\,\text{N}$.

```ad-example
Esempio 1: leggere il dinamometro
Il dinamometro della figura precedente ha la scala da $0$ a $2\,\text{N}$, con i numeri ogni $0{,}5\,\text{N}$. Quanto valgono la portata e la sensibilità, e quanto segna?

La portata è l'ultimo numero della scala, $2\,\text{N}$. Tra un numero e il successivo ci sono $5$ divisioni, quindi una divisione vale $0{,}5 : 5 = 0{,}1\,\text{N}$; lo stesso risultato si ha dividendo la portata per le $20$ divisioni della scala. La sensibilità è $0{,}1\,\text{N}$.

L'indice è $3$ tacche sotto il numero $1$: la misura è $1 + 3 \cdot 0{,}1 = 1{,}3\,\text{N}$, e con l'incertezza

$$F = (1{,}3 \pm 0{,}1)\,\text{N}$$
```

Nella figura qui sotto puoi appendere al gancio dei pesetti e leggere la scala, e passare da un dinamometro di portata piccola e sensibilità fine a uno di portata grande e sensibilità meno fine.

```interattivo
% nome: dinamometro-pesetti
% alt: Un dinamometro appeso, con i bottoni per appendere o togliere pesetti da 0,5 newton e da 0,2 newton: la molla si allunga e l'indice scende sulla scala in newton; si può scegliere tra un dinamometro con la portata di 2,5 newton e la sensibilità di 0,1 newton e uno con la portata di 10 newton e la sensibilità di 0,5 newton, e sotto compaiono la lettura con la sua incertezza e l'avviso quando la forza supera la portata
```

## Più forze sullo stesso corpo: la risultante

Su un corpo agiscono quasi sempre più forze insieme. La **risultante** è la forza unica che ha sullo stesso corpo lo stesso effetto di tutte quelle forze insieme, e si trova sommandole come vettori, con il metodo punta-coda o con la regola del parallelogramma della lezione [Somma e differenza di vettori](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori). Il suo modulo si trova facilmente in tre casi.

### Forze con la stessa direzione

Se due forze hanno la stessa direzione e lo stesso verso, la risultante ha quella direzione e quel verso, e il suo modulo è la somma dei moduli: $R = F_1 + F_2$.

Se hanno la stessa direzione e versi opposti, la risultante ha il verso della forza più grande, e il modulo è la differenza dei moduli: $R = F_1 - F_2$, con $F_1 > F_2$. Se le due forze hanno lo stesso modulo, la risultante è nulla.

```ad-example
Esempio 2: due ragazzi e una slitta
Anna tira una slitta con una forza di $120\,\text{N}$, Bruno con una forza di $80\,\text{N}$, lungo la stessa retta. Quanto vale la risultante se tirano tutti e due verso destra? E se Bruno tira verso sinistra?

```tikz
% nome: risultante-stessa-direzione
% alt: A sinistra due forze verso destra, di 120 e di 80 newton, applicate allo stesso punto, e sotto la risultante di 200 newton verso destra; a destra la forza di 120 newton verso destra e quella di 80 newton verso sinistra, e sotto la risultante di 40 newton verso destra; scala di 1 centimetro per 40 newton
% svg: risultante-stessa-direzione-45ac73ad.svg 434x90
\begin{tikzpicture}
\fill (0,0.45) circle (1.5pt);
\draw[-{Stealth}, thick, red] (0,0.45) -- (3,0.45) node[right] {$\vec{F}_1$};
\fill (0,0.1) circle (1.5pt);
\draw[-{Stealth}, thick, red] (0,0.1) -- (2,0.1) node[right] {$\vec{F}_2$};
\fill (0,-0.55) circle (1.5pt);
\draw[-{Stealth}, thick, orange!90!black] (0,-0.55) -- (5,-0.55) node[below left] {$\vec{R}$};
\node[below] at (2.5,-0.95) {\small $R = 200$ N};
\fill (8,0.25) circle (1.5pt);
\draw[-{Stealth}, thick, red] (8,0.25) -- (11,0.25) node[above] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (8,0.25) -- (6,0.25) node[above] {$\vec{F}_2$};
\fill (8,-0.55) circle (1.5pt);
\draw[-{Stealth}, thick, orange!90!black] (8,-0.55) -- (9,-0.55) node[right] {$\vec{R}$};
\node[below] at (8.5,-0.95) {\small $R = 40$ N};
\end{tikzpicture}
```

Nella figura le frecce sono in scala, $1\,\text{cm}$ per $40\,\text{N}$; le due forze partono dallo stesso punto, e sono disegnate una sopra l'altra solo per vederle tutte e due. Quando tirano nello stesso verso,

$$R = 120\,\text{N} + 80\,\text{N} = 200\,\text{N}$$

verso destra. Quando Bruno tira verso sinistra,

$$R = 120\,\text{N} - 80\,\text{N} = 40\,\text{N}$$

verso destra, il verso di Anna, che tira di più.
```

### Forze perpendicolari

Se due forze sono perpendicolari, la risultante è la diagonale del rettangolo che ha per lati le due forze. I due lati e la diagonale formano un triangolo rettangolo, quindi il modulo si trova con il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide):

$$R = \sqrt{F_1^2 + F_2^2}$$

```ad-example
Esempio 3: due forze perpendicolari
Su una cassa agiscono una forza di $40\,\text{N}$ verso est e una di $30\,\text{N}$ verso nord. Quanto vale la risultante?

```tikz
% nome: risultante-forze-perpendicolari
% alt: Due forze applicate allo stesso punto, una di 40 newton orizzontale e una di 30 newton verticale; il rettangolo che hanno per lati è completato con linee tratteggiate, e la sua diagonale è la risultante di 50 newton, che forma un angolo alfa con la forza di 40 newton; scala di 1 centimetro per 10 newton
% svg: risultante-forze-perpendicolari-33556c1c.svg 209x163
\begin{tikzpicture}
\draw[dashed, thin] (4,0) -- (4,3) -- (0,3);
\draw[-{Stealth}, thick, red] (0,0) -- (4,0) node[below] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,3) node[left] {$\vec{F}_2$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (4,3) node[above right] {$\vec{R}$};
\fill (0,0) circle (1.5pt);
\draw[thin] (0.8,0) arc[start angle=0, delta angle=36.87, radius=0.8];
\node at (1.05,0.33) {\small $\alpha$};
\node[below] at (2,0) {\small $40$ N};
\node[left] at (0,1.5) {\small $30$ N};
\end{tikzpicture}
```

Le forze sono perpendicolari, quindi

$$R = \sqrt{40^2 + 30^2}\,\text{N} = \sqrt{1600 + 900}\,\text{N} = \sqrt{2500}\,\text{N} = 50\,\text{N}$$

La risultante punta verso nord-est e forma con la forza di $40\,\text{N}$ un angolo $\alpha$ di circa $37^\circ$, che si calcola con seno e coseno nella lezione [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore).
```

```ad-warning
La risultante non è la somma dei moduli
Solo le forze con la stessa direzione e lo stesso verso si sommano come numeri. Le forze di $40\,\text{N}$ e $30\,\text{N}$ dell'esempio 3 hanno una risultante di $50\,\text{N}$, non di $70\,\text{N}$: il modulo della risultante è sempre compreso tra la differenza e la somma dei moduli.
```

### Più forze in direzioni diverse

Con più di due forze lungo due direzioni perpendicolari, si sommano prima le forze di ciascuna direzione, come nel caso della stessa direzione, e poi si combinano i due risultati con il teorema di Pitagora.

```ad-example
Esempio 4: tre forze
Su un corpo agiscono tre forze: $50\,\text{N}$ verso est, $20\,\text{N}$ verso ovest e $15\,\text{N}$ verso nord. Quanto vale la risultante?

```tikz
% nome: risultante-tre-forze
% alt: Tre forze applicate allo stesso punto: 50 newton verso est, 20 newton verso ovest e 15 newton verso nord; la risultante, di circa 34 newton, punta tra est e nord; scala di 1 centimetro per 10 newton
% svg: risultante-tre-forze-2e855df6.svg 292x106
\begin{tikzpicture}
\draw[-{Stealth}, thick, red] (0,0) -- (5,0) node[below] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (0,0) -- (-2,0) node[below] {$\vec{F}_2$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,1.5) node[left] {$\vec{F}_3$};
\draw[dashed, thin] (3,0) -- (3,1.5) -- (0,1.5);
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (3,1.5) node[above right] {$\vec{R}$};
\fill (0,0) circle (1.5pt);
\end{tikzpicture}
```

Lungo la direzione est-ovest le forze hanno versi opposti: $50\,\text{N} - 20\,\text{N} = 30\,\text{N}$ verso est. Lungo la direzione nord-sud c'è solo la forza di $15\,\text{N}$ verso nord. Le due somme sono perpendicolari, quindi

$$R = \sqrt{30^2 + 15^2}\,\text{N} = \sqrt{1125}\,\text{N} \approx 34\,\text{N}$$

Il risultato è arrotondato a due cifre, come i dati.
```

Quando la risultante di tutte le forze che agiscono su un corpo fermo è nulla, il corpo resta fermo: è in equilibrio. L'equilibrio è l'argomento del capitolo successivo, che comincia con [l'equilibrio di un punto materiale](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-punto-materiale-e-le-reazioni-vincolari).
