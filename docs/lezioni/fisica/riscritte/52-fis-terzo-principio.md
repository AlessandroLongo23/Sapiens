# Il terzo principio della dinamica

Se stai sui pattini e spingi un muro, sei tu a partire all'indietro: il muro ti ha spinto. Una forza non è mai un'azione di un solo corpo su un altro, ma un'interazione tra due corpi, e ognuno dei due agisce sull'altro. Il terzo principio della dinamica dice come sono fatte queste due forze.

## L'enunciato

Indichiamo con $\vec F_{AB}$ la forza che un corpo $A$ esercita su un corpo $B$, e con $\vec F_{BA}$ quella che $B$ esercita su $A$. Il **terzo principio della dinamica**, detto anche **principio di azione e reazione**, dice:

> Quando un corpo $A$ esercita una forza su un corpo $B$, il corpo $B$ esercita su $A$ una forza con lo stesso modulo, la stessa direzione e verso opposto.

$$\vec F_{BA} = -\vec F_{AB}$$

Le due forze si chiamano **azione** e **reazione**, ma i nomi si possono scambiare: nessuna delle due viene prima dell'altra, nascono e finiscono insieme. Il principio vale per le forze di contatto, come una spinta, e per quelle a distanza, come il peso: la Terra attira una mela, e la mela attira la Terra con una forza uguale e opposta.

```tikz
% nome: pattinatori-spinta
% alt: Due pattinatori, A a sinistra e B a destra, disegnati come due blocchi che si toccano con le mani. Sul blocco A agisce la forza F BA, verso sinistra; sul blocco B la forza F AB, verso destra. Le due frecce sono lunghe uguali e partono ciascuna dal centro del corpo su cui agiscono
% svg: pattinatori-spinta-39d63cc2.svg 247x70
\begin{tikzpicture}
\draw[thick] (-0.8,0) -- (5.6,0);
\foreach \x in {-0.65,-0.5,...,5.6} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (1,0) rectangle (2.4,1.6);
\draw[thick, fill=orange!25] (2.4,0) rectangle (3.8,1.6);
\node at (1.7,1.3) {$A$};
\node at (3.1,1.3) {$B$};
\draw[-{Stealth}, thick, red] (1.7,0.7) -- (0.1,0.7) node[above] {$\vec{F}_{BA}$};
\draw[-{Stealth}, thick, red] (3.1,0.7) -- (4.7,0.7) node[above] {$\vec{F}_{AB}$};
\fill (1.7,0.7) circle (1.5pt);
\fill (3.1,0.7) circle (1.5pt);
\end{tikzpicture}
```

## Azione e reazione agiscono su corpi diversi

Le due forze del terzo principio sono uguali e opposte, ma non si annullano, perché agiscono su due corpi diversi: $\vec F_{AB}$ agisce su $B$, $\vec F_{BA}$ agisce su $A$. Il moto di un corpo dipende solo dalle forze che agiscono su di esso, e la forza totale su $B$ non contiene $\vec F_{BA}$, che agisce su un altro corpo. Due forze si possono sommare per trovare la forza totale solo se agiscono sullo stesso corpo.

Un vecchio indovinello lo mostra bene. Un cavallo tira un carro; per il terzo principio il carro tira il cavallo all'indietro con una forza uguale, e allora sembra che nessuno dei due possa muoversi. Ma sul carro agisce solo la forza del cavallo (con l'attrito delle ruote), e il carro parte se questa forza supera l'attrito. Il cavallo invece parte perché spinge il terreno all'indietro con gli zoccoli, e il terreno spinge il cavallo in avanti più di quanto il carro lo tiri indietro.

```ad-warning
Uguali e opposte, ma non si annullano
Due forze uguali e opposte si annullano solo se agiscono sullo stesso corpo, come il peso e la reazione del tavolo su un libro fermo. Azione e reazione agiscono su corpi diversi: ciascuna va sommata alle altre forze del proprio corpo, mai all'altra.
```

## Stessa forza, accelerazioni diverse

Azione e reazione hanno lo stesso modulo, ma i loro effetti possono essere molto diversi, perché per il [secondo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica) l'accelerazione di un corpo è la forza divisa per la sua massa. Con la stessa forza, il corpo con meno massa accelera di più.

```ad-example
Esempio 1: due pattinatori
Anna, di $50\,\text{kg}$, e Bruno, di $75\,\text{kg}$, sono fermi sul ghiaccio uno di fronte all'altra. Anna spinge Bruno con una forza di $150\,\text{N}$. Quanto valgono le accelerazioni dei due mentre si spingono? L'attrito si trascura.

Per il terzo principio Bruno spinge Anna con $150\,\text{N}$, nel verso opposto. Le accelerazioni:

$$a_A = \frac{150\,\text{N}}{50\,\text{kg}} = 3{,}0\,\text{m/s}^2 \qquad a_B = \frac{150\,\text{N}}{75\,\text{kg}} = 2{,}0\,\text{m/s}^2$$

in versi opposti. Anna, che ha meno massa, accelera di più. Il rapporto tra le accelerazioni è il rapporto delle masse rovesciato: $a_A / a_B = m_B / m_A = 1{,}5$.
```

Nella figura qui sotto due pattinatori si spingono: cambi le masse e la forza, e guardi le due forze, sempre uguali, e le due accelerazioni, che cambiano con le masse.

```interattivo
% nome: pattinatori-spinta
% alt: Due pattinatori, A e B, disegnati come due blocchi sul ghiaccio, che si spingono per quattro decimi di secondo. Tre cursori cambiano la forza della spinta, da 50 a 200 newton, e le masse dei due, da 40 a 100 chilogrammi. Durante la spinta le due forze, rosse, sono uguali e opposte, e le accelerazioni, verdi, sono diverse: più grande per chi ha meno massa. Finita la spinta i due scivolano in versi opposti a velocità costante, con le velocità in blu; sotto la figura sono scritte la forza e le due accelerazioni
```

```ad-example
Esempio 2: la mela attira la Terra
Una mela di $0{,}20\,\text{kg}$ cade dall'albero. Con quale forza la mela attira la Terra, e quanto vale l'accelerazione che dà alla Terra? La massa della Terra è $5{,}97 \cdot 10^{24}\,\text{kg}$.

La Terra attira la mela con il suo peso, $P = 0{,}20\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 1{,}96\,\text{N}$, e la mela attira la Terra con una forza uguale, verso l'alto. L'accelerazione della Terra è

$$a_T = \frac{1{,}96\,\text{N}}{5{,}97 \cdot 10^{24}\,\text{kg}} = 3{,}28\ldots \cdot 10^{-25}\,\text{m/s}^2 \approx 3{,}3 \cdot 10^{-25}\,\text{m/s}^2$$

Un'accelerazione così piccola non si può misurare: per questo si dice che la mela cade sulla Terra, e non che la Terra sale verso la mela, anche se le due forze sono uguali.
```

Lo stesso succede in un incidente tra un'auto e un camion: le forze che i due si scambiano nell'urto sono uguali, ma il camion ha molta più massa, e l'accelerazione dell'auto, con i danni per chi ci sta dentro, è molto più grande.

## Il terzo principio intorno a noi

Molti movimenti si spiegano solo con il terzo principio, perché un corpo non può mettersi in moto da solo: la forza che lo fa partire gliela deve dare un altro corpo.

- Camminare. Il piede spinge il pavimento all'indietro, e il pavimento spinge il piede in avanti: è questa forza, un [attrito statico](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito), che ci porta avanti. Sul ghiaccio, dove l'attrito è piccolo, il piede non riesce a spingere il suolo e scivola all'indietro.
- Nuotare e remare. La mano o il remo spingono l'acqua all'indietro, e l'acqua spinge il nuotatore o la barca in avanti.
- Il razzo. Il motore spinge i gas di scarico verso il basso, a grande velocità, e i gas spingono il razzo verso l'alto. Il razzo non ha bisogno dell'aria su cui appoggiarsi, e per questo funziona anche nel vuoto dello spazio.

```tikz
% nome: razzo-gas-spinta
% alt: Un razzo verticale, con i gas di scarico sotto. Sul razzo agisce la spinta dei gas, F, una freccia rossa verso l'alto; sui gas agisce la forza del razzo, meno F, una freccia rossa della stessa lunghezza verso il basso
% svg: razzo-gas-spinta-2e4048b7.svg 54x203
\begin{tikzpicture}
\draw[thick, fill=blue!10] (-0.3,0) -- (0.3,0) -- (0.3,1.8) -- (0,2.3) -- (-0.3,1.8) -- cycle;
\draw[thick, fill=blue!10] (-0.3,0) -- (-0.55,-0.2) -- (-0.3,0.5);
\draw[thick, fill=blue!10] (0.3,0) -- (0.55,-0.2) -- (0.3,0.5);
\draw[thick, fill=orange!25] (-0.25,0) -- (0.25,0) -- (0.4,-1.2) -- (0,-1.5) -- (-0.4,-1.2) -- cycle;
\draw[-{Stealth}, thick, red] (0,1) -- (0,2.6) node[right] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (0,-0.5) -- (0,-2.1) node[right] {$-\vec{F}$};
\fill (0,1) circle (1.5pt);
\fill (0,-0.5) circle (1.5pt);
\end{tikzpicture}
```

```ad-example
Esempio 3: il decollo di un razzo modello
Un razzo modello di $0{,}50\,\text{kg}$ parte verticalmente; i gas lo spingono verso l'alto con una forza di $12\,\text{N}$. Quanto vale la sua accelerazione alla partenza?

Sul razzo agiscono la spinta dei gas, $12\,\text{N}$ verso l'alto, e il peso, $P = 0{,}50\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 4{,}9\,\text{N}$ verso il basso. La forza totale è $12\,\text{N} - 4{,}9\,\text{N} = 7{,}1\,\text{N}$ verso l'alto, e

$$a = \frac{7{,}1\,\text{N}}{0{,}50\,\text{kg}} = 14{,}2\,\text{m/s}^2 \approx 14\,\text{m/s}^2$$

Se la spinta fosse più piccola del peso, il razzo resterebbe sulla rampa.
```

## Il libro sul tavolo

Un libro è fermo su un tavolo. Sul libro agiscono due forze: il peso $\vec P$, cioè la Terra che attira il libro, e la [reazione vincolare](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-punto-materiale-e-le-reazioni-vincolari) $\vec F_v$ del tavolo, che spinge il libro verso l'alto. Le due forze sono uguali e opposte, ma non sono una coppia di azione e reazione: agiscono sullo stesso corpo, e sono uguali per il primo principio, perché il libro è fermo.

Le coppie del terzo principio sono altre due:

- il tavolo spinge il libro verso l'alto con $\vec F_v$, e il libro preme sul tavolo verso il basso con $-\vec F_v$ (è la [forza premente](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito));
- la Terra attira il libro verso il basso con $\vec P$, e il libro attira la Terra verso l'alto con $-\vec P$.

```tikz
% nome: libro-tavolo-coppie
% alt: Un libro disegnato un po' sollevato sopra il tavolo, per separare i corpi, e sotto una parte della superficie della Terra. Sul libro agiscono il peso P verso il basso e la reazione del tavolo Fv verso l'alto, frecce della stessa lunghezza. Sul tavolo agisce la forza del libro, meno Fv, verso il basso. Sulla Terra agisce la forza del libro, meno P, verso l'alto. Le coppie di azione e reazione sono Fv con meno Fv, e P con meno P
% svg: libro-tavolo-coppie-2164628f.svg 197x256
\begin{tikzpicture}
\draw[thick, fill=blue!10] (1.2,3.6) rectangle (2.8,4);
\node[left] at (1.2,3.8) {\small libro};
\draw[-{Stealth}, thick, red] (2,3.8) -- (2,4.9) node[right] {$\vec{F}_v$};
\draw[-{Stealth}, thick, red] (2,3.8) -- (2,2.7) node[right] {$\vec{P}$};
\fill (2,3.8) circle (1.5pt);
\draw[thick, fill=orange!25] (0.3,2.1) rectangle (3.7,2.3);
\node[right] at (3.7,2.2) {\small tavolo};
\draw[thick] (0.5,2.1) -- (0.5,0.6);
\draw[thick] (3.5,2.1) -- (3.5,0.6);
\draw[-{Stealth}, thick, red] (1.4,2.2) -- (1.4,1.1) node[right] {$-\vec{F}_v$};
\fill (1.4,2.2) circle (1.5pt);
\draw[thick] (-0.3,0.6) -- (4.3,0.6);
\foreach \x in {-0.15,0,...,4.3} \draw[thin] (\x,0.6) -- ++(-0.15,-0.15);
\node at (3.6,-0.5) {\small Terra};
\draw[-{Stealth}, thick, red] (2,-1.4) -- (2,-0.3) node[right] {$-\vec{P}$};
\fill (2,-1.4) circle (1.5pt);
\end{tikzpicture}
```

```ad-warning
Il peso e la reazione del tavolo non sono azione e reazione
Sono uguali e opposti, ma agiscono tutti e due sul libro, e sono uguali solo perché il libro è fermo: se una mano preme il libro, la reazione del tavolo cresce e il peso no. Le forze di una coppia di azione e reazione sono sempre della stessa natura (due forze di contatto, oppure due attrazioni a distanza) e agiscono su due corpi diversi.
```
