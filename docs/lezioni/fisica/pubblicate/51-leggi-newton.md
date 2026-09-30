# Il secondo principio della dinamica

Con la stessa spinta un carrello della spesa vuoto parte svelto, uno pieno si avvia a fatica; e lo stesso carrello parte tanto più svelto quanto più forte lo spingi. Il [primo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali) dice che cosa succede quando la forza totale è nulla: la velocità non cambia. Il secondo principio dice che cosa succede quando non è nulla: la velocità cambia, cioè il corpo ha un'[accelerazione](/materiale/scuola-superiore/fisica/il-moto-rettilineo/l-accelerazione), e dice quanto vale.

## Forza, massa e accelerazione

Un carrello di laboratorio scorre su una rotaia quasi senza attrito, tirato da un filo con una forza costante $F$ che si legge su un dinamometro. Misurando posizioni e tempi si trova che il carrello si muove di [moto uniformemente accelerato](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato), e si ricava la sua accelerazione. Ripetendo la prova si vede che:

- con la stessa massa, se la forza raddoppia anche l'accelerazione raddoppia: l'accelerazione è [direttamente proporzionale](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare) alla forza;
- con la stessa forza, se la massa del carrello raddoppia l'accelerazione si dimezza: l'accelerazione è [inversamente proporzionale](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-inversa-e-quadratica) alla massa.

Nel grafico accelerazione-forza i punti di ogni carrello stanno su una retta che passa per l'origine, e la retta del carrello più pesante è meno ripida.

```tikz
% nome: grafico-accelerazione-forza
% alt: Grafico con la forza F in newton sull'asse orizzontale, da 0 a 4, e l'accelerazione a in metri al secondo quadrato sull'asse verticale, da 0 a 4. Due rette passano per l'origine: quella del carrello di 1 chilogrammo passa per i punti (1; 1), (2; 2), (3; 3) e (4; 4); quella del carrello di 2 chilogrammi, meno ripida, per (1; 0,5), (2; 1), (3; 1,5) e (4; 2)
% svg: grafico-accelerazione-forza-e869f3e6.svg 221x187
% poi-interattivo: cambiare la massa del carrello e vedere la pendenza della retta, uguale a 1/m
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid[step=0.8] (3.6,3.6);
\draw[->] (-0.2,0) -- (3.8,0) node[right] {$F$ (N)};
\draw[->] (0,-0.2) -- (0,3.8) node[above] {$a$ (m/s$^2$)};
\foreach \k in {1,2,3,4} \node[below] at (0.8*\k,0) {\small $\k$};
\foreach \k in {1,2,3,4} \node[left] at (0,0.8*\k) {\small $\k$};
\node[below left] at (0,0) {\small $0$};
\draw[thick, blue] (0,0) -- (3.5,3.5) node[right] {$1$ kg};
\draw[thick, orange!90!black] (0,0) -- (3.6,1.8) node[right] {$2$ kg};
\foreach \k in {1,2,3,4} \fill[blue] (0.8*\k,0.8*\k) circle (1.5pt);
\foreach \k in {1,2,3,4} \fill[orange!90!black] (0.8*\k,0.4*\k) circle (1.5pt);
\end{tikzpicture}
```

## L'enunciato

Le due proporzionalità insieme danno il **secondo principio della dinamica**, o legge fondamentale della dinamica:

> L'accelerazione di un corpo è direttamente proporzionale alla forza totale che agisce su di esso, inversamente proporzionale alla sua massa, e ha la direzione e il verso della forza totale.

$$\vec F_{tot} = m\,\vec a \qquad\qquad a = \frac{F_{tot}}{m}$$

La forza totale $\vec F_{tot}$ è la risultante di tutte le forze che agiscono sul corpo. È un'uguaglianza tra vettori: la massa è un numero positivo, quindi $\vec a$ ha sempre la stessa direzione e lo stesso verso di $\vec F_{tot}$. Se la forza totale è nulla anche l'accelerazione è nulla, e la velocità resta costante: il primo principio è il caso particolare $\vec F_{tot} = \vec 0$.

```tikz
% nome: carrello-forza-accelerazione
% alt: Un carrello su un piano orizzontale tirato verso destra da una forza F, rossa, applicata al centro. Sopra il carrello una freccia verde, l'accelerazione a, ha la stessa direzione e lo stesso verso della forza
% svg: carrello-forza-accelerazione-d20e805c.svg 216x69
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (5.3,0);
\foreach \x in {-0.15,0,...,5.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (1,0.3) rectangle (2.6,1);
\draw[thick, fill=gray!20] (1.35,0.15) circle (0.15);
\draw[thick, fill=gray!20] (2.25,0.15) circle (0.15);
\node at (1.8,0.65) {$m$};
\draw[-{Stealth}, thick, red] (2.6,0.65) -- (4.1,0.65) node[right] {$\vec{F}$};
\draw[-{Stealth}, thick, green!50!black] (1.3,1.35) -- (2.3,1.35) node[right] {$\vec{a}$};
\end{tikzpicture}
```

```ad-warning
L'accelerazione va con la forza, non con la velocità
La forza totale ha la direzione dell'accelerazione, non quella della velocità. Un'auto che frena va avanti, ma la forza totale su di lei è all'indietro, come la sua accelerazione; un sasso lanciato verso l'alto sale, ma su di lui agisce solo il peso, verso il basso.
```

## La massa inerziale

Dal secondo principio, $m = F_{tot}/a$: la massa è il rapporto tra la forza applicata a un corpo e l'accelerazione che ne risulta. Più la massa è grande, più forza serve per dare al corpo la stessa accelerazione, cioè per cambiarne la velocità: la massa misura l'inerzia del corpo, e per questo, misurata così, si chiama **massa inerziale**.

La stessa massa compare nel peso, $P = m\,g$. Anche questa formula è il secondo principio: un corpo in [caduta libera](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-caduta-libera-e-il-lancio-verticale) ha accelerazione $g$, e la sola forza che agisce su di lui è il peso, quindi $P = m\,g$. Che la massa che resiste alle forze e quella che la Terra attira siano la stessa cosa lo mostra il fatto che tutti i corpi, senza aria, cadono con la stessa accelerazione.

```ad-example
Esempio 1: misurare una massa con una forza
Un carrello tirato su una rotaia senza attrito con una forza di $1{,}2\,\text{N}$ ha un'accelerazione di $0{,}40\,\text{m/s}^2$. Quanto vale la sua massa?

$$m = \frac{F}{a} = \frac{1{,}2\,\text{N}}{0{,}40\,\text{m/s}^2} = 3{,}0\,\text{kg}$$
```

## Il newton

Il secondo principio definisce l'unità di misura della forza. Il **newton** è la forza che dà a un corpo di massa $1\,\text{kg}$ un'accelerazione di $1\,\text{m/s}^2$:

$$1\,\text{N} = 1\,\text{kg} \cdot 1\,\text{m/s}^2 = 1\,\text{kg} \cdot \text{m/s}^2$$

Il newton è quindi un'[unità derivata](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-fisiche-e-unita-del-sistema-internazionale) dalle tre unità di base chilogrammo, metro e secondo. Per usare $F = m\,a$ con i newton la massa va in chilogrammi e l'accelerazione in metri al secondo quadrato.

```ad-warning
La massa in grammi
Con la massa in grammi la formula dà un numero mille volte troppo grande. Un carrellino di $250\,\text{g}$ spinto con $0{,}50\,\text{N}$ ha $a = 0{,}50 / 0{,}250 = 2{,}0\,\text{m/s}^2$, non $0{,}50 / 250 = 0{,}0020\,\text{m/s}^2$.
```

## Una forza sola

Quando su un corpo agisce una forza sola, o le altre si bilanciano, la forza totale è quella forza, e la formula lega tre numeri: se ne conosci due trovi il terzo.

```ad-example
Esempio 2: l'accelerazione di un carrello
Un carrello di $2{,}5\,\text{kg}$ è tirato su un piano orizzontale senza attrito con una forza orizzontale di $10\,\text{N}$. Quanto vale la sua accelerazione?

In verticale il peso e la reazione del piano si bilanciano, quindi la forza totale è la forza orizzontale:

$$a = \frac{F}{m} = \frac{10\,\text{N}}{2{,}5\,\text{kg}} = 4{,}0\,\text{m/s}^2$$

nel verso della forza.
```

```ad-example
Esempio 3: la forza che serve
Un'auto di $1{,}2 \cdot 10^3\,\text{kg}$ accelera con $2{,}5\,\text{m/s}^2$. Quanto vale la forza totale sull'auto?

$$F_{tot} = m\,a = 1{,}2 \cdot 10^3\,\text{kg} \cdot 2{,}5\,\text{m/s}^2 = 3{,}0 \cdot 10^3\,\text{N}$$

È la forza con cui la strada spinge le ruote in avanti, meno l'attrito dell'aria e delle ruote: la forza totale, non la sola spinta.
```

## Più forze

Quando sul corpo agiscono più forze, prima si trova la forza totale sommandole come vettori, e poi si divide per la massa. Con forze lungo la stessa retta si sommano i moduli delle forze che hanno lo stesso verso e si sottraggono quelli delle forze che hanno verso opposto; con forze perpendicolari si usa il [teorema di Pitagora](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori).

```ad-example
Esempio 4: due forze opposte
Una cassa di $35\,\text{kg}$ sta su una lastra di ghiaccio, dove l'attrito si trascura. Un ragazzo la tira verso destra con una forza di $250\,\text{N}$, un altro verso sinistra con $180\,\text{N}$. Quanto vale l'accelerazione della cassa?

La forza totale è verso destra, di modulo $F_{tot} = 250\,\text{N} - 180\,\text{N} = 70\,\text{N}$:

$$a = \frac{F_{tot}}{m} = \frac{70\,\text{N}}{35\,\text{kg}} = 2{,}0\,\text{m/s}^2$$

verso destra, come la forza più grande.

```tikz
% nome: cassa-due-forze-opposte
% alt: Una cassa su una lastra di ghiaccio, tirata verso destra dalla forza F1, lunga 2,5 centimetri, e verso sinistra dalla forza F2, lunga 1,8 centimetri; scala di 1 centimetro per 100 newton. Sopra la cassa una freccia verde verso destra, l'accelerazione a
% svg: cassa-due-forze-opposte-80174fad.svg 239x61
\begin{tikzpicture}
\draw[thick] (-2.3,0) -- (3.9,0);
\foreach \x in {-2.15,-2,...,3.9} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0,0) rectangle (1.2,0.8);
\draw[-{Stealth}, thick, red] (0.6,0.4) -- (3.1,0.4) node[right] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (0.6,0.4) -- (-1.2,0.4) node[left] {$\vec{F}_2$};
\fill (0.6,0.4) circle (1.5pt);
\draw[-{Stealth}, thick, green!50!black] (0.3,1.15) -- (1.3,1.15) node[right] {$\vec{a}$};
\end{tikzpicture}
```
```

```ad-example
Esempio 5: due forze perpendicolari
Una slitta di $10\,\text{kg}$ sul ghiaccio è tirata da due funi orizzontali perpendicolari tra loro, con forze di $40\,\text{N}$ e $30\,\text{N}$; l'attrito si trascura. Quanto vale l'accelerazione?

$$F_{tot} = \sqrt{40^2 + 30^2}\,\text{N} = 50\,\text{N} \qquad a = \frac{50\,\text{N}}{10\,\text{kg}} = 5{,}0\,\text{m/s}^2$$

L'accelerazione ha la direzione della forza totale, a $\tan^{-1}(30/40) \approx 37^\circ$ dalla forza di $40\,\text{N}$.

```tikz
% nome: due-forze-perpendicolari-accelerazione
% alt: Due forze perpendicolari applicate a un punto: F1 verso destra, lunga 1,6 centimetri, e F2 verso l'alto, lunga 1,2 centimetri, con la loro risultante F tot, tratteggiata e arancione, lunga 2 centimetri; scala di 1 centimetro per 25 newton. Accanto, l'accelerazione a, verde, ha la stessa direzione della risultante
% svg: due-forze-perpendicolari-accelerazione-ad478a64.svg 172x97
\begin{tikzpicture}
\draw[dashed, thin] (1.6,0) -- (1.6,1.2) -- (0,1.2);
\draw[-{Stealth}, thick, orange!90!black, dashed] (0,0) -- (1.6,1.2) node[above right] {$\vec{F}_{tot}$};
\draw[-{Stealth}, thick, red] (0,0) -- (1.6,0) node[below] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,1.2) node[left] {$\vec{F}_2$};
\fill (0,0) circle (1.5pt);
\draw[-{Stealth}, thick, green!50!black] (2.6,0.2) -- (3.4,0.8) node[above right] {$\vec{a}$};
\end{tikzpicture}
```
```

## L'attrito nel secondo principio

Un corpo che striscia su un pavimento subisce l'[attrito dinamico](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito), opposto al moto, di modulo $F_d = \mu_d \cdot F_\perp$; su un pavimento orizzontale, senza altre forze verticali, la forza premente è il peso, $F_\perp = m\,g$. L'attrito entra nella forza totale come ogni altra forza.

```ad-example
Esempio 6: una cassa trascinata
Una cassa di $20\,\text{kg}$ è tirata sul pavimento con una forza orizzontale di $85\,\text{N}$; il coefficiente di attrito dinamico è $\mu_d = 0{,}25$. Quanto vale l'accelerazione della cassa?

L'attrito dinamico, con la forza premente uguale al peso, è

$$F_d = \mu_d\,m\,g = 0{,}25 \cdot 20\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 49\,\text{N}$$

La forza totale è la forza del tiro meno l'attrito, $85\,\text{N} - 49\,\text{N} = 36\,\text{N}$, e

$$a = \frac{36\,\text{N}}{20\,\text{kg}} = 1{,}8\,\text{m/s}^2$$

Senza attrito l'accelerazione sarebbe $85 / 20 = 4{,}25\,\text{m/s}^2$: più del doppio.

```tikz
% nome: cassa-trascinata-attrito
% alt: Una cassa su un pavimento con le quattro forze che agiscono su di essa, dal centro: la forza F verso destra, lunga 1,21 centimetri, l'attrito dinamico Fd verso sinistra, lungo 0,7 centimetri, il peso P verso il basso e la reazione del pavimento Fv verso l'alto, lunghi 2,8 centimetri; scala di 1 centimetro per 70 newton. Accanto, l'accelerazione a verso destra
% svg: cassa-trascinata-attrito-bb61b3ba.svg 164x238
\begin{tikzpicture}
\draw[thick] (-0.9,0) -- (3.3,0);
\foreach \x in {-0.75,-0.6,...,3.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0.6,0) rectangle (1.4,0.6);
\draw[-{Stealth}, thick, red] (1,0.3) -- (2.214,0.3) node[right] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (1,0.3) -- (0.3,0.3) node[left] {$\vec{F}_d$};
\draw[-{Stealth}, thick, red] (1,0.3) -- (1,-2.5) node[right] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (1,0.3) -- (1,3.1) node[right] {$\vec{F}_v$};
\fill (1,0.3) circle (1.5pt);
\draw[-{Stealth}, thick, green!50!black] (2,1.3) -- (2.9,1.3) node[right] {$\vec{a}$};
\end{tikzpicture}
```
```

```ad-warning
Da fermo l'attrito è statico
La formula $F_d = \mu_d F_\perp$ vale per un corpo che striscia. Se la cassa è ferma e la forza non supera l'attrito statico massimo, $\mu_s F_\perp$, la cassa non parte: l'attrito statico bilancia la forza, e l'accelerazione è zero, non negativa.
```

Nella figura qui sotto scegli la forza e la massa del carrello, e leggi l'accelerazione; con l'attrito acceso una parte della forza se ne va per vincerlo, e con una forza piccola il carrello non parte affatto.

```interattivo
% nome: carrello-forza-accelerazione
% alt: Un carrello su un piano orizzontale, tirato da una forza rossa verso destra. Due cursori cambiano la forza, da 0 a 20 newton, e la massa, da 1 a 5 chilogrammi; un interruttore accende l'attrito. Dal carrello partono la forza, l'attrito quando c'è e l'accelerazione, verde; sotto la figura sono scritte la forza totale e l'accelerazione, uguale alla forza totale divisa per la massa. Un bottone fa partire il carrello da fermo, che si muove di moto uniformemente accelerato e mostra la sua velocità; con l'attrito e una forza più piccola dell'attrito statico massimo il carrello resta fermo
```

## Forza e velocità che cambia

Con il secondo principio si trova l'accelerazione, e con l'accelerazione le leggi del [moto uniformemente accelerato](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato), come $v = v_0 + a\,t$, danno la velocità e la posizione del corpo in ogni istante. Vale anche il viceversa: dal modo in cui cambia la velocità si trova la forza.

```ad-example
Esempio 7: la forza della frenata
Un'auto di $1{,}2 \cdot 10^3\,\text{kg}$ viaggia a $25\,\text{m/s}$ e si ferma in $5{,}0\,\text{s}$, con accelerazione costante. Quanto vale la forza totale che la frena?

Con l'asse nel verso del moto, da $v = v_0 + a\,t$ con $v = 0$:

$$a = \frac{v - v_0}{t} = \frac{0 - 25\,\text{m/s}}{5{,}0\,\text{s}} = -5{,}0\,\text{m/s}^2$$

$$F_{tot} = m\,a = 1{,}2 \cdot 10^3\,\text{kg} \cdot (-5{,}0\,\text{m/s}^2) = -6{,}0 \cdot 10^3\,\text{N}$$

Il segno meno dice che la forza è opposta al moto: una forza frenante di $6{,}0 \cdot 10^3\,\text{N}$.
```
