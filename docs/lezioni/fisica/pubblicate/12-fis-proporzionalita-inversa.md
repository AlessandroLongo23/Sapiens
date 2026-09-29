# Proporzionalità inversa e quadratica

Se chiudi con il dito il foro di una siringa piena d'aria e spingi lo stantuffo fino a metà, l'aria dentro ha metà del volume e spinge sul dito con una pressione doppia. Se lasci scendere un carrello da fermo lungo una rotaia inclinata, in un tempo doppio non percorre il doppio della strada, ma quattro volte tanto. Sono le altre due leggi che si incontrano più spesso in fisica dopo la proporzionalità diretta: la proporzionalità inversa e la proporzionalità quadratica.

Le formule $y = \dfrac{k}{x}$ e $y = kx^2$ e le loro proprietà sono nella lezione di matematica [Proporzionalità diretta e inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa); i grafici sono il ramo di iperbole e la parabola di [La parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola). Qui si riconoscono queste leggi in dati misurati, con le unità e le incertezze di [Proporzionalità diretta e dipendenza lineare](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare).

## La proporzionalità inversa

Due grandezze $x$ e $y$ sono **inversamente proporzionali** se il loro prodotto è costante:

$$x \cdot y = k \qquad y = \frac{k}{x}$$

Quando $x$ raddoppia, $y$ si dimezza; quando $x$ triplica, $y$ diventa un terzo. La costante $k$ si ottiene moltiplicando una misura di $x$ per una misura di $y$, quindi la sua unità è il **prodotto** delle due unità.

```ad-example
Esempio 1: l'aria nella siringa
Una siringa è collegata a un manometro, uno strumento che misura la pressione dell'aria chiusa dentro. Sposti lo stantuffo, aspetti che la temperatura torni quella della stanza e leggi volume e pressione:

| $V$ ($\text{cm}^3$) | $p$ (kPa) | $p \cdot V$ ($\text{kPa} \cdot \text{cm}^3$) |
|---|---|---|
| $20$ | $151$ | $3020$ |
| $25$ | $119$ | $2975$ |
| $30$ | $100$ | $3000$ |
| $40$ | $76$ | $3040$ |
| $50$ | $60$ | $3000$ |
| $60$ | $50$ | $3000$ |

I prodotti differiscono al massimo di circa l'$1\%$ dalla loro media, meno dell'incertezza delle letture (il manometro si legge a $1$ kPa, cioè al $2\%$ quando segna $50$ kPa). Pressione e volume sono inversamente proporzionali:

$$p \cdot V \approx 3{,}0 \cdot 10^3\ \text{kPa} \cdot \text{cm}^3$$

È la legge di Boyle, che vale per un gas a temperatura costante: la trovi in [La legge di Boyle](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-legge-di-boyle). La costante dipende da quanta aria c'è nella siringa: con più aria, a ogni volume la pressione sarebbe più alta.
```

Prova tu: sposta lo stantuffo e guarda come cambiano la pressione e il prodotto $p \cdot V$.

```interattivo
% nome: siringa-pressione-volume
% alt: Una siringa chiusa, piena d'aria, con un manometro collegato alla punta; un cursore sposta lo stantuffo e cambia il volume dell'aria da 20 a 60 centimetri cubi. La lancetta del manometro e i valori sotto la figura mostrano la pressione, 3000 diviso il volume in kilopascal: 150 kPa a 20 centimetri cubi, 100 kPa a 30, 50 kPa a 60. Il prodotto p per V resta sempre 3000 kPa per centimetro cubo, e a metà volume corrisponde il doppio della pressione.
```

### Il grafico: un ramo di iperbole

Il grafico della pressione in funzione del volume è una curva che scende: più piccolo è il volume, più alta è la pressione. Si avvicina ai due assi senza toccarli, perché nessuna delle due grandezze può diventare zero finché l'altra resta finita. Anche qui la curva si traccia tra i punti, non da un punto all'altro.

```tikz
% nome: grafico-pressione-volume
% alt: Grafico della pressione dell'aria nella siringa in funzione del volume: i sei punti misurati, da 151 kilopascal a 20 centimetri cubi a 50 kilopascal a 60 centimetri cubi, stanno su un ramo di iperbole che scende e si avvicina agli assi
% svg: grafico-pressione-volume-aff6db81.svg 244x236
% poi-interattivo: trascinare un punto lungo la curva e leggere p, V e il loro prodotto, che resta 3000 kPa per centimetro cubo
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin, xstep=0.8, ystep=1] (0,0) grid (5.6,5.6);
\draw[->] (0,0) -- (6,0);
\node[above] at (5.75,0.05) {$V$ (cm$^3$)};
\draw[->] (0,0) -- (0,6) node[above] {$p$ (kPa)};
\foreach \x/\t in {0.8/10,1.6/20,2.4/30,3.2/40,4.0/50,4.8/60} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/30,2/60,3/90,4/120,5/150} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60, domain=1.43:5.6, samples=60, smooth] plot (\x, {8/\x});
\foreach \x/\y in {1.6/5.033,2.0/3.967,2.4/3.333,3.2/2.533,4.0/2.0,4.8/1.667} \fill (\x,\y) circle (0.06);
\end{tikzpicture}
```

Dalla sola forma, però, una proporzionalità inversa non si riconosce con sicurezza: anche la temperatura del tè che si raffredda, in [Tabelle e grafici cartesiani](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/tabelle-e-grafici-cartesiani), dà una curva che scende, e non è una proporzionalità inversa. Il controllo è il prodotto, riga per riga.

```ad-warning
Una curva che scende non basta
"Quando una cresce l'altra diminuisce" vale per la proporzionalità inversa, ma anche per una dipendenza lineare con la pendenza negativa e per il tè che si raffredda. Si parla di proporzionalità inversa solo se il prodotto $x \cdot y$ è costante entro l'incertezza.
```

```ad-example
Esempio 2: il carrello e la rotaia
Un carrello percorre tutta una rotaia a velocità costante; la velocità si cambia con la spinta iniziale. Per ogni prova si misura la velocità $v$ con un sensore e il tempo $t$ per arrivare in fondo con un cronometro:

| $v$ (m/s) | $t$ (s) |
|---|---|
| $0{,}20$ | $6{,}1$ |
| $0{,}30$ | $4{,}0$ |
| $0{,}40$ | $3{,}0$ |
| $0{,}60$ | $2{,}0$ |
| $0{,}80$ | $1{,}5$ |

I prodotti $v \cdot t$ valgono $1{,}22$ m e poi sempre $1{,}20$ m: velocità e tempo sono inversamente proporzionali, con $k = 1{,}2$ m. L'unità è $\text{m/s} \cdot \text{s} = \text{m}$: la costante è una lunghezza, quella della rotaia. A $0{,}50$ m/s il carrello impiega $\dfrac{1{,}2\ \text{m}}{0{,}50\ \text{m/s}} = 2{,}4$ s.
```

### Prevedere un valore

Con la costante: $y = \dfrac{k}{x}$. Oppure con la proprietà: se $x$ viene moltiplicato per un numero, $y$ viene diviso per lo stesso numero.

```ad-example
Esempio 3: la siringa schiacciata
Nella siringa dell'esempio 1, a $30\ \text{cm}^3$ la pressione è di $100$ kPa. Quale pressione c'è a $12\ \text{cm}^3$? E a quale volume la pressione arriva a $120$ kPa?

Il volume passa da $30$ a $12\ \text{cm}^3$, cioè viene diviso per $2{,}5$: la pressione viene moltiplicata per $2{,}5$ e diventa $250$ kPa. Con la costante:

$$
\begin{gathered}
p = \frac{3{,}0 \cdot 10^3\ \text{kPa} \cdot \text{cm}^3}{12\ \text{cm}^3} = 250\ \text{kPa} \\
V = \frac{3{,}0 \cdot 10^3\ \text{kPa} \cdot \text{cm}^3}{120\ \text{kPa}} = 25\ \text{cm}^3
\end{gathered}
$$

Il valore $25\ \text{cm}^3$ si ritrova anche nella tabella, dove la pressione misurata è $119$ kPa. Il primo invece è un'estrapolazione: a $12\ \text{cm}^3$ non si è misurato, e la legge vale solo finché l'aria resta alla temperatura della stanza e la siringa non perde.
```

```ad-warning
La proporzione diretta al posto dell'inversa
Da "a $30\ \text{cm}^3$ la pressione è $100$ kPa" non segue che a $60\ \text{cm}^3$ sia $200$ kPa: con il doppio del volume la pressione si dimezza, e diventa $50$ kPa. Prima di fare il conto chiediti che cosa succede a una grandezza quando l'altra raddoppia.
```

## La proporzionalità quadratica

Una grandezza $y$ è **proporzionale al quadrato** di $x$ se è costante il rapporto tra $y$ e $x^2$:

$$\frac{y}{x^2} = k \qquad y = kx^2$$

Quando $x$ raddoppia, $y$ diventa quattro volte più grande; quando $x$ triplica, nove volte. L'unità di $k$ è l'unità di $y$ divisa per il quadrato dell'unità di $x$.

```ad-example
Esempio 4: il carrello sul piano inclinato
Un carrello parte da fermo in cima a una rotaia leggermente inclinata. Un sensore registra la distanza $s$ percorsa dopo un tempo $t$:

| $t$ (s) | $s$ (cm) | $s/t^2$ ($\text{cm/s}^2$) |
|---|---|---|
| $0{,}5$ | $3{,}1$ | $12{,}4$ |
| $1{,}0$ | $11{,}8$ | $11{,}8$ |
| $1{,}5$ | $27{,}2$ | $12{,}1$ |
| $2{,}0$ | $47{,}9$ | $12{,}0$ |
| $2{,}5$ | $74{,}6$ | $11{,}9$ |

I rapporti $s/t$ ($6{,}2$, $11{,}8$, $18{,}1$, $24{,}0$, $29{,}8\ \text{cm/s}$) crescono sempre: la distanza non è proporzionale al tempo. I rapporti $s/t^2$ invece sono uguali entro l'incertezza (la prima misura, la più piccola, è anche la meno precisa), e la loro media è circa $12\ \text{cm/s}^2$. La distanza è proporzionale al quadrato del tempo:

$$s = 12\ \text{cm/s}^2 \cdot t^2$$

Da $1{,}0$ s a $2{,}0$ s il tempo raddoppia e la distanza passa da circa $12$ cm a circa $48$ cm, quattro volte tanto. Galileo trovò questa legge con un esperimento simile, facendo rotolare delle sfere lungo un piano inclinato, e la pubblicò nel 1638 nei "Discorsi e dimostrazioni matematiche intorno a due nuove scienze": gli spazi percorsi stanno tra loro come i quadrati dei tempi. È il moto di [Il moto uniformemente accelerato](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato).
```

Il grafico di una proporzionalità quadratica, per $x \geq 0$, è metà di una parabola con il vertice nell'origine: parte orizzontale e diventa sempre più ripida.

```tikz
% nome: grafico-distanza-tempo-piano-inclinato
% alt: Grafico della distanza percorsa dal carrello in funzione del tempo: i cinque punti misurati, da 3,1 centimetri a 0,5 secondi a 74,6 centimetri a 2,5 secondi, stanno su mezza parabola che parte dall'origine e diventa sempre più ripida
% svg: grafico-distanza-tempo-piano-inclinato-ebc51c73.svg 230x236
% poi-interattivo: trascinare un punto lungo la curva e vedere che a tempo doppio corrisponde una distanza quattro volte più grande
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin] (0,0) grid (5.4,5.4);
\draw[->] (0,0) -- (5.8,0);
\node[below] at (5.8,-0.05) {$t$ (s)};
\draw[->] (0,0) -- (0,5.8) node[above] {$s$ (cm)};
\foreach \x/\t in {1/0{,}5,2/1{,}0,3/1{,}5,4/2{,}0,5/2{,}5} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/15,2/30,3/45,4/60,5/75} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60, domain=0:5.2, samples=60, smooth] plot (\x, {0.2*\x*\x});
\foreach \x/\y in {1/0.2067,2/0.7867,3/1.8133,4/3.1933,5/4.9733} \fill (\x,\y) circle (0.06);
\end{tikzpicture}
```

```ad-warning
Il doppio al posto del quadruplo
Se in $1{,}0$ s il carrello percorre $12$ cm, in $3{,}0$ s non ne percorre $36$, cioè il triplo, ma $12 \cdot 3^2 = 108$ cm, cioè nove volte tanto. Nella proporzionalità quadratica il fattore che moltiplica $x$ va elevato al quadrato.
```

```ad-note
La proporzionalità inversa al quadrato
Una terza legge compare spesso più avanti: $y = \dfrac{k}{x^2}$, in cui è costante il prodotto $x^2 \cdot y$. Quando $x$ raddoppia, $y$ diventa un quarto. La luce di una lampadina che arriva su un foglio segue questa legge al variare della distanza, e la seguono anche la forza di gravità e la forza tra due cariche elettriche.
```

## Trasformare la curva in una retta

Una curva disegnata a mano tra i punti non basta per dire se è un ramo di iperbole o mezza parabola: tante curve diverse si somigliano. I fisici usano un altro metodo, che sfrutta il fatto che una retta si riconosce a occhio. Se $y = \dfrac{k}{x}$, allora $y$ è direttamente proporzionale a $\dfrac{1}{x}$; se $y = kx^2$, allora $y$ è direttamente proporzionale a $x^2$. Basta quindi aggiungere alla tabella una colonna con $\dfrac{1}{x}$, oppure con $x^2$, e disegnare $y$ in funzione di questa nuova grandezza:

- se i punti stanno su una retta per l'origine, la legge è confermata;
- la pendenza della retta è la costante $k$, con la sua unità.

```tikz
% nome: pressione-in-funzione-inverso-volume
% alt: Grafico della pressione in funzione dell'inverso del volume: sull'asse orizzontale 1 su V da 0 a 0,05 centimetri cubi alla meno uno, sull'asse verticale p in kilopascal; i sei punti della siringa stanno su una retta che passa per l'origine
% svg: pressione-in-funzione-inverso-volume-f4c86f97.svg 251x258
% poi-interattivo: passare con un bottone dal grafico di p in funzione di V a quello di p in funzione di 1/V, con i punti che si spostano sulla retta
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin] (0,0) grid (5.5,5.5);
\draw[->] (0,0) -- (6,0);
\node[below] at (5.8,-0.45) {$\frac{1}{V}$ (cm$^{-3}$)};
\draw[->] (0,0) -- (0,6) node[above] {$p$ (kPa)};
\foreach \x/\t in {1/0{,}01,2/0{,}02,3/0{,}03,4/0{,}04,5/0{,}05} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/30,2/60,3/90,4/120,5/150} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,0) -- (5.5,5.5);
\foreach \x/\y in {5/5.033,4/3.967,3.333/3.333,2.5/2.533,2/2.0,1.667/1.667} \fill (\x,\y) circle (0.06);
\end{tikzpicture}
```

Per la siringa, con $\dfrac{1}{V}$ in orizzontale, i punti si mettono in fila su una retta per l'origine. La retta passa per il punto $(0{,}050\ \text{cm}^{-3}; 150\ \text{kPa})$, quindi la sua pendenza è

$$k = \frac{150\ \text{kPa}}{0{,}050\ \text{cm}^{-3}} = 3{,}0 \cdot 10^3\ \text{kPa} \cdot \text{cm}^3$$

la stessa costante trovata con i prodotti. L'unità torna: dividere per $\text{cm}^{-3}$ è come moltiplicare per $\text{cm}^3$.

```ad-example
Esempio 5: la distanza in funzione del quadrato del tempo
Per il carrello dell'esempio 4 aggiungi alla tabella la colonna $t^2$: $0{,}25$, $1{,}00$, $2{,}25$, $4{,}00$ e $6{,}25\ \text{s}^2$. Il grafico di $s$ in funzione di $t^2$ è una retta per l'origine, e la sua pendenza, letta tra l'origine e il punto della retta a $6{,}25\ \text{s}^2$ e $75$ cm, è

$$k = \frac{75\ \text{cm}}{6{,}25\ \text{s}^2} = 12\ \text{cm/s}^2$$

```tikz
% nome: distanza-in-funzione-quadrato-tempo
% alt: Grafico della distanza percorsa dal carrello in funzione del quadrato del tempo: sull'asse orizzontale t al quadrato in secondi al quadrato da 0 a 6, sull'asse verticale s in centimetri da 0 a 75; i cinque punti stanno su una retta che passa per l'origine
% svg: distanza-in-funzione-quadrato-tempo-230b58f2.svg 238x237
% poi-interattivo: passare dal grafico di s in funzione di t a quello di s in funzione di t al quadrato, e leggere la pendenza della retta
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin, xstep=0.8, ystep=1] (0,0) grid (5.4,5.4);
\draw[->] (0,0) -- (5.8,0);
\node[below] at (5.85,-0.05) {$t^2$ (s$^2$)};
\draw[->] (0,0) -- (0,5.8) node[above] {$s$ (cm)};
\foreach \x/\t in {0.8/1,1.6/2,2.4/3,3.2/4,4.0/5,4.8/6} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/15,2/30,3/45,4/60,5/75} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,0) -- (5.3,5.3);
\foreach \x/\y in {0.2/0.2067,0.8/0.7867,1.8/1.8133,3.2/3.1933,5/4.9733} \fill (\x,\y) circle (0.06);
\end{tikzpicture}
```
```

## Riconoscere la legge

Davanti a una tabella di misure, si calcolano per ogni riga le grandezze che una legge vuole costanti, e si tiene la legge per cui lo sono entro l'incertezza:

| Legge | Costante | Se $x$ raddoppia, $y$... | Grafico |
|---|---|---|---|
| diretta, $y = kx$ | $\dfrac{y}{x}$ | raddoppia | retta per l'origine |
| lineare, $y = mx + q$ | $\dfrac{\Delta y}{\Delta x}$ | cresce di $m \cdot x$ | retta che taglia l'asse $y$ in $q$ |
| inversa, $y = \dfrac{k}{x}$ | $x \cdot y$ | si dimezza | ramo di iperbole |
| quadratica, $y = kx^2$ | $\dfrac{y}{x^2}$ | quadruplica | mezza parabola |

Un modo veloce per scegliere da quale controllo partire è guardare due righe della tabella in cui $x$ raddoppia, se ci sono. Nella siringa, da $30$ a $60\ \text{cm}^3$ la pressione passa da $100$ a $50$ kPa: si dimezza, e il controllo da fare è il prodotto. Nel carrello, da $1{,}0$ a $2{,}0$ s la distanza passa da $11{,}8$ a $47{,}9$ cm: circa quattro volte, e il controllo da fare è $s/t^2$. Due righe suggeriscono la legge; per confermarla servono tutte.

Il procedimento con i numeri esatti, senza incertezze, è nella lezione di matematica [Proporzionalità diretta e inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa).

## Errori frequenti

```ad-warning
Estrapolare fino all'asse
Nella legge $p = \dfrac{k}{V}$, con $V$ sempre più piccolo la pressione dovrebbe crescere senza limite. In una siringa vera, molto prima l'aria si scalda, lo stantuffo perde o il vetro si rompe. Il ramo di iperbole descrive i dati nell'intervallo in cui sono stati misurati, e non dice niente di sicuro vicino agli assi.
```

```ad-warning
Il quadrato dimenticato nell'unità
La costante di $s = kt^2$ si misura in $\text{cm/s}^2$, non in $\text{cm/s}$: nel rapporto $s/t^2$ il tempo compare al quadrato, e così la sua unità. Allo stesso modo la costante di una proporzionalità inversa ha il prodotto delle unità, come $\text{kPa} \cdot \text{cm}^3$, non il loro rapporto.
```
