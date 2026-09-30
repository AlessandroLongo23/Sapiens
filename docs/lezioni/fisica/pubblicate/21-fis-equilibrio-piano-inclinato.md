# L'equilibrio sul piano inclinato

Una scatola appoggiata su una rampa tende a scivolare verso il basso, e tende a scivolare di più quanto più la rampa è ripida. Il peso della scatola è sempre lo stesso, verticale, ma sul piano inclinato una parte del peso spinge la scatola contro il piano e un'altra parte la spinge lungo il piano. Per capire quando la scatola resta ferma, e quale forza serve per tenerla, si scompone il peso in queste due parti, con il seno e il coseno dell'inclinazione.

## Il piano inclinato

Un **piano inclinato** è una superficie piana che forma un angolo $\alpha$ con l'orizzontale, come una rampa, uno scivolo, una strada in salita. Visto di lato è un triangolo rettangolo: la **lunghezza** $l$ del piano è l'ipotenusa, l'**altezza** $h$ e la **base** $b$ sono i cateti, e $\alpha$ è l'angolo alla base, detto **inclinazione**.

```tikz
% nome: piano-inclinato-lunghezza-altezza
% alt: Un piano inclinato visto di lato, un triangolo rettangolo con l'angolo retto in basso a destra: l'ipotenusa è la lunghezza l del piano, il cateto verticale è l'altezza h, il cateto orizzontale è la base b, e l'angolo alfa alla base, tra la base e l'ipotenusa, è l'inclinazione
% svg: piano-inclinato-lunghezza-altezza-ea4860df.svg 183x115
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (4.3,0);
\foreach \x in {-0.15,0,...,4.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) -- (4,0) -- (4,2.309) -- cycle;
\draw (0.6,0) arc[start angle=0, end angle=30, radius=0.6];
\node at (0.85,0.22) {\small $\alpha$};
\draw (3.8,0) -- (3.8,0.2) -- (4,0.2);
\node[above left] at (2,1.155) {$l$};
\node[right] at (4,1.155) {$h$};
\node[below] at (2,-0.15) {$b$};
\end{tikzpicture}
```

Dalle definizioni di seno, coseno e tangente nel [triangolo rettangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/seno-coseno-e-tangente-nel-triangolo-rettangolo):

$$\sin\alpha = \frac{h}{l} \qquad \cos\alpha = \frac{b}{l} \qquad \tan\alpha = \frac{h}{b}$$

Un piano lungo $5{,}0\,\text{m}$ e alto $1{,}2\,\text{m}$, per esempio, ha $\sin\alpha = 1{,}2 / 5{,}0 = 0{,}24$, cioè un'inclinazione di circa $14^\circ$.

## Il peso scomposto lungo il piano

Su un corpo appoggiato al piano il peso $\vec{P}$ è verticale, ma è comodo scomporlo lungo due direzioni legate al piano, come nella lezione [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore):

- la **componente parallela** $\vec{P}_\parallel$, lungo il piano e verso il basso, che tende a far scivolare il corpo;
- la **componente perpendicolare** $\vec{P}_\perp$, perpendicolare al piano e diretta contro di esso, che preme il corpo sul piano.

```tikz
% nome: peso-scomposto-piano-inclinato
% alt: Un blocco su un piano inclinato di un angolo alfa. Dal centro del blocco parte il peso P, verticale verso il basso; le sue componenti, tratteggiate, sono P parallela, lungo il piano verso il basso, e P perpendicolare, perpendicolare al piano e verso il piano. L'angolo tra il peso e la componente perpendicolare è uguale all'inclinazione alfa, segnata anche alla base del piano
% svg: peso-scomposto-piano-inclinato-b4c76e74.svg 216x119
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (5.3,0);
\foreach \x in {-0.15,0,...,5.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) -- (5,0) -- (5,2.887) -- cycle;
\draw (0.6,0) arc[start angle=0, end angle=30, radius=0.6];
\node at (0.85,0.22) {\small $\alpha$};
\draw[thick, fill=blue!10, rotate around={30:(3.6373,2.1)}] (3.1373,2.1) rectangle ++(1,0.6);
\draw[dashed, thin] (3.4873,0.5598) -- (2.7079,1.9098);
\draw[dashed, thin] (3.4873,0.5598) -- (4.2667,1.0098);
\draw[-{Stealth}, thick, red, dashed] (3.4873,2.3598) -- (2.7079,1.9098) node[above left] {$\vec{P}_\parallel$};
\draw[-{Stealth}, thick, red, dashed] (3.4873,2.3598) -- (4.2667,1.0098) node[right] {$\vec{P}_\perp$};
\draw[-{Stealth}, thick, red] (3.4873,2.3598) -- (3.4873,0.5598) node[below left] {$\vec{P}$};
\draw (3.4873,1.6598) arc[start angle=-90, end angle=-60, radius=0.7];
\node at (3.7332,1.4422) {\scriptsize $\alpha$};
\fill (3.4873,2.3598) circle (1.5pt);
\end{tikzpicture}
```

L'angolo tra il peso e la componente perpendicolare è proprio l'inclinazione $\alpha$: il peso è perpendicolare alla base, la componente $\vec{P}_\perp$ è perpendicolare al piano, e due angoli che hanno i lati perpendicolari a due a due sono uguali. Nel triangolo rettangolo che ha per ipotenusa il peso, $P_\perp$ è il cateto adiacente ad $\alpha$ e $P_\parallel$ il cateto opposto:

$$P_\parallel = P \sin\alpha \qquad P_\perp = P \cos\alpha$$

Con la lunghezza, l'altezza e la base del piano, al posto del seno e del coseno:

$$P_\parallel = P \cdot \frac{h}{l} \qquad P_\perp = P \cdot \frac{b}{l}$$

Le stesse formule vengono dalla [similitudine](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/similitudine): il triangolo formato dal peso e dalle sue componenti ha gli stessi angoli del piano inclinato, quindi i suoi lati sono proporzionali ai lati del piano, con $P$ al posto di $l$, $P_\parallel$ al posto di $h$ e $P_\perp$ al posto di $b$.

```ad-warning
Seno e coseno scambiati
La componente lungo il piano va con il seno, quella perpendicolare con il coseno: il contrario di quello che molti si aspettano, perché il piano "sembra" il lato orizzontale. Controllo veloce con i casi limite: su un piano orizzontale, $\alpha = 0^\circ$, il corpo non tende a scivolare, e infatti $P_\parallel = P \sin 0^\circ = 0$; su una parete verticale, $\alpha = 90^\circ$, tutto il peso tira lungo la parete, e $P_\parallel = P \sin 90^\circ = P$.
```

```ad-warning
L'angolo del piano e l'angolo tra le forze
L'inclinazione $\alpha$ compare due volte nella figura: alla base del piano, e al centro del blocco tra il peso e la componente perpendicolare. L'angolo tra il peso e il piano, o tra il peso e la componente parallela, non è $\alpha$ ma $90^\circ - \alpha$: chi usa quello deve scambiare il seno con il coseno.
```

```ad-example
Esempio 1: le componenti del peso
Una cassa di $8{,}0\,\text{kg}$ è appoggiata su un piano inclinato di $30^\circ$. Quanto valgono le componenti del peso parallela e perpendicolare al piano?

Il peso è $P = m \cdot g = 8{,}0\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 78{,}4\,\text{N}$. Le componenti:

$$
\begin{gathered}
P_\parallel = P \sin 30^\circ = 78{,}4\,\text{N} \cdot 0{,}5 = 39{,}2\,\text{N} \approx 39\,\text{N} \\
P_\perp = P \cos 30^\circ = 78{,}4\,\text{N} \cdot 0{,}866 = 67{,}89\ldots\,\text{N} \approx 68\,\text{N}
\end{gathered}
$$

Controllo con il teorema di Pitagora: $\sqrt{39{,}2^2 + 67{,}9^2} \approx 78{,}4$, il peso. La somma dei moduli, $39 + 68 = 107\,\text{N}$, è più del peso: le componenti non si sommano come numeri.
```

## Il piano liscio: reazione vincolare e forza equilibrante

Su un piano liscio, senza attrito, il piano esercita solo la [reazione vincolare](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-punto-materiale-e-le-reazioni-vincolari) $\vec{F}_v$, perpendicolare al piano. La reazione bilancia la componente perpendicolare del peso, e il corpo non sprofonda nel piano:

$$F_v = P_\perp = P \cos\alpha$$

Nessuna forza bilancia invece la componente parallela: lasciato libero, il corpo scivola giù. Per tenerlo fermo serve una forza parallela al piano, rivolta verso l'alto, con lo stesso modulo di $P_\parallel$: è la **forza equilibrante**, che può essere la spinta di una mano o la tensione di un filo legato in cima al piano.

$$F = P_\parallel = P \sin\alpha = P \cdot \frac{h}{l}$$

```tikz
% nome: forze-piano-liscio-filo
% alt: Un blocco su un piano inclinato liscio, tenuto fermo da un filo parallelo al piano legato in cima. Dal centro del blocco partono il peso P verso il basso, la reazione vincolare Fv perpendicolare al piano e verso l'esterno, lunga quanto la componente perpendicolare del peso, e la tensione T del filo lungo il piano verso l'alto, lunga quanto la componente parallela del peso
% svg: forze-piano-liscio-filo-79054894.svg 216x174
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (5.3,0);
\foreach \x in {-0.15,0,...,5.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) -- (5,0) -- (5,2.887) -- cycle;
\draw (0.6,0) arc[start angle=0, end angle=30, radius=0.6];
\node at (0.85,0.22) {\small $\alpha$};
\draw[thick, fill=blue!10, rotate around={30:(3.6373,2.1)}] (3.1373,2.1) rectangle ++(1,0.6);
\draw (3.9203,2.6098) -- (4.6564,3.0348);
\draw[thick] (4.8064,2.775) -- (4.6564,3.0348);
\fill (4.6564,3.0348) circle (1.5pt);
\draw[-{Stealth}, thick, red] (3.4873,2.3598) -- (3.4873,0.5598) node[left] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (3.4873,2.3598) -- (2.7079,3.7098) node[above] {$\vec{F}_v$};
\draw[-{Stealth}, thick, red] (3.4873,2.3598) -- (4.2667,2.8098) node[above left] {$\vec{T}$};
\fill (3.4873,2.3598) circle (1.5pt);
\end{tikzpicture}
```

La forza equilibrante è più piccola del peso, tanto più piccola quanto più il piano è lungo rispetto alla sua altezza: per portare un carico in alto conviene spingerlo su una rampa invece di sollevarlo in verticale. Per questo il piano inclinato è una delle [macchine semplici](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/le-leve-e-le-macchine-semplici).

```ad-warning
La reazione del piano non è il peso
Su un piano inclinato la reazione vincolare bilancia solo la componente perpendicolare del peso, ed è più piccola del peso: $F_v = P\cos\alpha$, non $P$. La cassa dell'esempio 1 pesa $78\,\text{N}$, ma il piano la spinge con $68\,\text{N}$. Anche la [forza premente](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito), che serve per l'attrito, è $F_\perp = P\cos\alpha$.
```

```ad-example
Esempio 2: un carrello su una rampa
Una rampa è lunga $5{,}0\,\text{m}$ e alta $1{,}2\,\text{m}$. Un carrello di $25\,\text{kg}$, con le ruote così scorrevoli che l'attrito si può trascurare, è tenuto fermo sulla rampa da una forza parallela alla rampa. Quanto vale questa forza? E quanto vale la reazione della rampa?

Il peso del carrello è $P = 25\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 245\,\text{N}$. La forza equilibrante è

$$F = P \cdot \frac{h}{l} = 245\,\text{N} \cdot \frac{1{,}2\,\text{m}}{5{,}0\,\text{m}} = 58{,}8\,\text{N} \approx 59\,\text{N}$$

meno di un quarto del peso. Per la reazione serve la base della rampa, che si trova con il teorema di Pitagora:

$$b = \sqrt{l^2 - h^2} = \sqrt{5{,}0^2 - 1{,}2^2}\,\text{m} = 4{,}853\ldots\,\text{m}$$

$$F_v = P \cdot \frac{b}{l} = 245\,\text{N} \cdot \frac{4{,}853\,\text{m}}{5{,}0\,\text{m}} = 237{,}8\ldots\,\text{N} \approx 2{,}4 \cdot 10^2\,\text{N}$$

Il risultato ha due cifre significative, come i dati, e si scrive in notazione scientifica.
```

## Il piano inclinato con l'attrito

Un libro appoggiato su un leggio inclinato non scivola: lo tiene fermo l'[attrito statico](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito), che agisce lungo il piano verso l'alto e bilancia la componente parallela del peso. Come sul pavimento, l'attrito statico si adatta: vale quanto $P_\parallel$, finché non supera il suo massimo, $\mu_s$ per la forza premente. Sul piano inclinato la forza premente è $F_\perp = P\cos\alpha$, quindi il corpo resta fermo se

$$P\sin\alpha \le \mu_s \cdot P\cos\alpha$$

```tikz
% nome: forze-piano-attrito-statico
% alt: Un blocco fermo su un piano inclinato con attrito. Dal centro del blocco partono il peso P verso il basso, la reazione vincolare Fv perpendicolare al piano e verso l'esterno, e l'attrito statico Fs lungo il piano verso l'alto, che bilancia la componente parallela del peso
% svg: forze-piano-attrito-statico-cd0e0551.svg 216x148
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (5.3,0);
\foreach \x in {-0.15,0,...,5.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) -- (5,0) -- (5,1.82) -- cycle;
\draw (0.8,0) arc[start angle=0, end angle=20, radius=0.8];
\node at (1.05,0.18) {\small $\alpha$};
\draw[thick, fill=blue!10, rotate around={20:(4.1346,1.5049)}] (3.6346,1.5049) rectangle ++(1,0.6);
\draw[-{Stealth}, thick, red] (4.032,1.7868) -- (4.032,0.3868) node[left] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (4.032,1.7868) -- (3.5821,3.023) node[above] {$\vec{F}_v$};
\draw[-{Stealth}, thick, red] (4.032,1.7868) -- (4.482,1.9506) node[above right] {$\vec{F}_s$};
\fill (4.032,1.7868) circle (1.5pt);
\end{tikzpicture}
```

Il peso compare da tutte e due le parti e si semplifica, e $\sin\alpha / \cos\alpha = \tan\alpha$: il corpo resta fermo se

$$\tan\alpha \le \mu_s$$

La condizione non dipende dalla massa: su una stessa asse di legno un libro leggero e uno pesante cominciano a scivolare alla stessa inclinazione. L'inclinazione a cui il corpo sta per partire è l'**angolo limite** $\alpha_{lim}$, e si ha

$$\tan\alpha_{lim} = \mu_s$$

Questo dà un modo di misurare il coefficiente di attrito statico: si inclina piano piano l'asse con il corpo sopra, si legge l'angolo a cui il corpo parte, e se ne calcola la tangente, oppure il rapporto tra l'altezza e la base dell'asse in quel momento.

```ad-example
Esempio 3: misurare il coefficiente di attrito
Un libro è appoggiato su un'asse di legno, che viene inclinata sempre di più. Il libro comincia a scivolare quando l'asse forma un angolo di $22^\circ$ con l'orizzontale. Quanto vale il coefficiente di attrito statico tra il libro e l'asse?

A $22^\circ$ l'attrito statico è al massimo, quindi

$$\mu_s = \tan 22^\circ = 0{,}404\ldots \approx 0{,}40$$

Viceversa, con $\mu_s = 0{,}62$ (legno su legno) l'angolo limite è $\tan^{-1} 0{,}62 \approx 32^\circ$.
```

```ad-example
Esempio 4: la cassa resta ferma
Una cassa di $5{,}0\,\text{kg}$ è appoggiata su una rampa inclinata di $20^\circ$; tra cassa e rampa $\mu_s = 0{,}50$. La cassa scivola? Quanto vale la forza di attrito?

$\tan 20^\circ = 0{,}364$, minore di $0{,}50$: la cassa resta ferma. L'attrito statico bilancia la componente parallela del peso, con $P = 5{,}0 \cdot 9{,}8\,\text{N} = 49\,\text{N}$:

$$F_s = P \sin 20^\circ = 49\,\text{N} \cdot 0{,}342 = 16{,}75\ldots\,\text{N} \approx 17\,\text{N}$$

L'attrito massimo sarebbe $\mu_s \cdot P\cos 20^\circ = 0{,}50 \cdot 49\,\text{N} \cdot 0{,}940 = 23{,}02\ldots\,\text{N} \approx 23\,\text{N}$, ma la cassa non ne ha bisogno.
```

```ad-warning
L'attrito sul piano non è sempre $\mu_s P\cos\alpha$
Finché il corpo è fermo, l'attrito statico è uguale alla componente parallela del peso, $P\sin\alpha$, non al suo valore massimo. Nell'esempio 4 l'attrito vale $17\,\text{N}$, non $23\,\text{N}$: il massimo serve solo per decidere se il corpo scivola.
```

```ad-example
Esempio 5: la cassa scivola
La stessa cassa sta su una rampa inclinata di $30^\circ$; il coefficiente di attrito dinamico è $\mu_d = 0{,}35$. La cassa scivola? Quanto vale l'attrito?

$\tan 30^\circ = 0{,}577$, maggiore di $\mu_s = 0{,}50$: l'attrito statico non basta, e la cassa scivola. Mentre scivola l'attrito è dinamico, con la forza premente $P\cos 30^\circ$:

$$F_d = \mu_d \cdot P\cos 30^\circ = 0{,}35 \cdot 49\,\text{N} \cdot 0{,}866 = 14{,}85\ldots\,\text{N} \approx 15\,\text{N}$$

La componente parallela del peso, $P\sin 30^\circ = 24{,}5\,\text{N}$, è più grande dell'attrito: la cassa non è in equilibrio, e scende sempre più veloce.
```

Nella figura qui sotto cambi l'inclinazione del piano e guardi il peso che si scompone: la componente parallela cresce, quella perpendicolare cala. Senza attrito un filo tiene fermo il blocco; con l'attrito il blocco resta fermo da solo, finché la tangente dell'inclinazione non supera $\mu_s$.

```interattivo
% nome: piano-inclinato-scomposizione-peso
% alt: Un blocco di 5 chilogrammi su un piano inclinato, con un cursore che cambia l'inclinazione da 0 a 60 gradi. Dal blocco partono il peso, le sue componenti parallela e perpendicolare, tratteggiate, e la reazione del piano; sotto sono scritti l'angolo e i moduli delle forze. Senza attrito il blocco è tenuto da un filo parallelo al piano, con la tensione uguale alla componente parallela del peso; con l'attrito il blocco resta fermo finché la tangente dell'angolo non supera il coefficiente di attrito statico, e poi scivola lungo il piano; un bottone lo rimette in cima
```
