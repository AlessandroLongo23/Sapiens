# Le trasformazioni isocora, isobara e isoterma

Un gas chiuso in un cilindro si può scaldare in modi diversi. Con il pistone bloccato il volume non cambia, e sale la pressione. Con il pistone libero di muoversi sotto un peso fisso la pressione non cambia, e aumenta il volume. Se poi il cilindro è immerso in una grande vasca d'acqua e il pistone si sposta lentamente, a restare fissa è la temperatura. Sono le tre trasformazioni più semplici di un gas, ciascuna con una grandezza che resta costante, e per ognuna il [primo principio della termodinamica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-primo-principio-della-termodinamica) dice come si dividono il calore, il lavoro e la variazione di energia interna.

```tikz
% nome: tre-cilindri-isocora-isobara-isoterma
% alt: Tre cilindri verticali con un gas e un pistone. Nel primo il pistone è bloccato da due fermi e sotto c'è una fiamma: il volume è costante. Nel secondo il pistone è libero, con un peso sopra, e sotto c'è una fiamma: la pressione è costante. Il terzo è immerso in una vasca d'acqua e una freccia mostra il pistone che viene spostato lentamente: la temperatura è costante
\begin{tikzpicture}
\fill[blue!10] (0,0) rectangle (1.4,1.3);
\draw[thick] (0,2.4) -- (0,0) -- (1.4,0) -- (1.4,2.4);
\draw[thick, fill=gray!20] (0.03,1.3) rectangle (1.37,1.48);
\fill (0,1.48) rectangle (0.2,1.6);
\fill (1.2,1.48) rectangle (1.4,1.6);
\draw[thick, fill=orange!25] (0.7,-0.75) .. controls (0.4,-0.62) and (0.57,-0.38) .. (0.7,-0.2) .. controls (0.83,-0.38) and (1.0,-0.62) .. (0.7,-0.75);
\node at (0.7,-1.15) {\small $V$ costante};
\fill[blue!10] (2.8,0) rectangle (4.2,1.3);
\draw[thick] (2.8,2.4) -- (2.8,0) -- (4.2,0) -- (4.2,2.4);
\draw[thick, fill=gray!20] (2.83,1.3) rectangle (4.17,1.48);
\draw[thick, fill=gray!60] (3.2,1.48) rectangle (3.8,1.85);
\draw[thick, fill=orange!25] (3.5,-0.75) .. controls (3.2,-0.62) and (3.37,-0.38) .. (3.5,-0.2) .. controls (3.63,-0.38) and (3.8,-0.62) .. (3.5,-0.75);
\node at (3.5,-1.15) {\small $p$ costante};
\fill[cyan!20] (5.3,-0.5) rectangle (7.7,1.7);
\draw[thin] (5.3,1.7) -- (7.7,1.7);
\draw[thick] (5.3,2.0) -- (5.3,-0.5) -- (7.7,-0.5) -- (7.7,2.0);
\fill[blue!10] (5.8,0) rectangle (7.2,1.3);
\draw[thick] (5.8,2.4) -- (5.8,0) -- (7.2,0) -- (7.2,2.4);
\draw[thick, fill=gray!20] (5.83,1.3) rectangle (7.17,1.48);
\draw[-{Stealth}, thick] (6.5,1.55) -- (6.5,2.3);
\node at (6.5,-1.15) {\small $T$ costante};
\end{tikzpicture}
```

## Che cosa serve dalle lezioni precedenti

In tutta la lezione il sistema è una quantità fissa di gas perfetto, $n$ moli, che passa da uno stato $A$ a uno stato $B$ con una trasformazione quasistatica. Gli strumenti sono quattro.

- L'[equazione di stato](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto) $p\,V = n\,R\,T$, con $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$ e la temperatura in kelvin.
- Il [lavoro](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-lavoro-in-una-trasformazione-termodinamica) compiuto dal gas, che è l'area sotto la linea della trasformazione nel piano pressione-volume.
- L'[energia interna](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/l-energia-interna) di un gas perfetto, che dipende solo dalla temperatura. Per un gas monoatomico (elio, neon, argon) $U = \tfrac{3}{2}\,n\,R\,T$, e quindi in qualunque trasformazione

$$\Delta U = \frac{3}{2}\,n\,R\,\Delta T$$

- Il primo principio, $\Delta U = Q - W$, con $Q$ positivo se il gas assorbe calore e $W$ positivo se il gas compie lavoro.

La formula di $\Delta U$ vale qualunque sia il cammino, perché l'energia interna è una funzione di stato: contano solo la temperatura iniziale e quella finale. Negli esempi il gas è sempre monoatomico; per gli altri gas cambia il coefficiente $\tfrac{3}{2}$, come spiega la lezione [I calori molari dei gas](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/i-calori-molari-dei-gas).

## La trasformazione isocora

Una trasformazione **isocora** avviene a volume costante: il gas è in un recipiente rigido, o in un cilindro con il pistone bloccato. Nel piano pressione-volume è un segmento verticale. Pressione e temperatura assoluta sono direttamente proporzionali, come dice la seconda delle [leggi di Gay-Lussac](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/le-leggi-di-gay-lussac): $\frac{p_A}{T_A} = \frac{p_B}{T_B}$.

Il volume non cambia, quindi il gas non compie lavoro, e il primo principio si riduce a un'uguaglianza tra due termini:

$$W = 0 \qquad Q = \Delta U = \frac{3}{2}\,n\,R\,\Delta T$$

Tutto il calore che il gas assorbe diventa energia interna, e la temperatura sale; se il gas cede calore, la sua energia interna diminuisce di altrettanto.

```ad-example
Esempio 1: una bombola scaldata
Una bombola rigida contiene $0{,}50\,\text{mol}$ di elio a $300\,\text{K}$. Quanto calore serve per portare il gas a $420\,\text{K}$? Di quanto aumenta la pressione?

Il volume è costante, $W = 0$, e con $\Delta T = 420\,\text{K} - 300\,\text{K} = 120\,\text{K}$

$$Q = \Delta U = \frac{3}{2}\,n\,R\,\Delta T = \frac{3}{2} \cdot 0{,}50\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 120\,\text{K} = 747{,}9\,\text{J} \approx 7{,}5 \cdot 10^2\,\text{J}$$

La pressione cresce come la temperatura assoluta: $\frac{p_B}{p_A} = \frac{T_B}{T_A} = \frac{420\,\text{K}}{300\,\text{K}} = 1{,}4$, cioè aumenta del $40\%$.
```

## La trasformazione isobara

Una trasformazione **isobara** avviene a pressione costante: il pistone è libero di scorrere, e a premere su di lui sono sempre lo stesso peso e la stessa aria esterna. Nel piano pressione-volume è un segmento orizzontale. Volume e temperatura assoluta sono direttamente proporzionali (prima legge di Gay-Lussac): $\frac{V_A}{T_A} = \frac{V_B}{T_B}$.

Il lavoro è l'area del rettangolo sotto il segmento, $W = p\,\Delta V$. Dall'equazione di stato scritta nei due stati, $p\,V_A = n\,R\,T_A$ e $p\,V_B = n\,R\,T_B$, sottraendo si ha $p\,\Delta V = n\,R\,\Delta T$. Il lavoro si può quindi calcolare dai volumi oppure dalle temperature:

$$W = p\,\Delta V = n\,R\,\Delta T$$

L'energia interna cambia di $\Delta U = \tfrac{3}{2}\,n\,R\,\Delta T$, e il calore viene dal primo principio:

$$Q = \Delta U + W = \frac{3}{2}\,n\,R\,\Delta T + n\,R\,\Delta T = \frac{5}{2}\,n\,R\,\Delta T$$

Quando un gas monoatomico si scalda a pressione costante, il calore assorbito si divide sempre nello stesso modo: tre quinti restano nel gas come energia interna e due quinti escono come lavoro. Per avere lo stesso aumento di temperatura serve quindi più calore che a volume costante, $\tfrac{5}{2}\,n\,R\,\Delta T$ contro $\tfrac{3}{2}\,n\,R\,\Delta T$, perché a pressione costante il gas deve anche sollevare il pistone.

```ad-example
Esempio 2: un gas scaldato con il pistone libero
In un cilindro con il pistone libero ci sono $0{,}20\,\text{mol}$ di argon. Il gas viene scaldato a pressione costante da $300\,\text{K}$ a $450\,\text{K}$. Quanto valgono il lavoro, la variazione di energia interna e il calore?

Con $\Delta T = 150\,\text{K}$:

$$W = n\,R\,\Delta T = 0{,}20\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 150\,\text{K} = 249{,}3\,\text{J} \approx 2{,}5 \cdot 10^2\,\text{J}$$

$$\Delta U = \frac{3}{2}\,n\,R\,\Delta T = \frac{3}{2} \cdot 249{,}3\,\text{J} = 373{,}95\,\text{J} \approx 3{,}7 \cdot 10^2\,\text{J}$$

$$Q = \Delta U + W = 373{,}95\,\text{J} + 249{,}3\,\text{J} = 623{,}25\,\text{J} \approx 6{,}2 \cdot 10^2\,\text{J}$$

Il gas assorbe circa $620\,\text{J}$: $370$ lo scaldano e $250$ sollevano il pistone.
```

```ad-warning
A pressione costante il calore non è tutto energia interna
$Q = \tfrac{3}{2}\,n\,R\,\Delta T$ vale solo a volume costante. A pressione costante quella formula dà $\Delta U$, e al calore manca il lavoro: $Q = \Delta U + W$.
```

## La trasformazione isoterma

Una trasformazione **isoterma** avviene a temperatura costante. Per ottenerla il gas deve restare in contatto con un corpo molto grande a temperatura fissa, per esempio una vasca d'acqua, e il pistone va spostato lentamente, così che il gas abbia il tempo di scambiare calore e di restare alla temperatura dell'acqua. Pressione e volume sono inversamente proporzionali, come dice la [legge di Boyle](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-legge-di-boyle): $p_A V_A = p_B V_B$. Nel piano pressione-volume l'isoterma è un ramo di iperbole.

La temperatura non cambia, quindi non cambia l'energia interna del gas perfetto, e il primo principio dice che calore e lavoro sono uguali:

$$\Delta U = 0 \qquad Q = W$$

In un'espansione isoterma tutto il calore che il gas assorbe dalla vasca esce come lavoro sul pistone. In una compressione isoterma tutto il lavoro che il gas subisce passa alla vasca come calore.

```ad-warning
Temperatura costante non vuol dire niente calore
In un'isoterma il gas scambia calore, e ne scambia esattamente quanto è il lavoro. È l'energia interna a non cambiare. La trasformazione senza scambi di calore è un'altra, l'[adiabatica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/la-trasformazione-adiabatica), e in quella la temperatura cambia.
```

Il lavoro è l'area sotto l'iperbole tra $V_A$ e $V_B$. Non è l'area di una figura della geometria elementare, e per calcolarla servono strumenti di matematica del quinto anno; il risultato è

$$W = n\,R\,T\,\ln\frac{V_B}{V_A}$$

dove $\ln$ è il logaritmo naturale, cioè il [logaritmo](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/logaritmi-e-loro-proprieta) in base $e = 2{,}718\ldots$, che sulla calcolatrice ha il tasto $\ln$. Il logaritmo di un numero maggiore di $1$ è positivo e quello di un numero tra $0$ e $1$ è negativo: la formula dà da sola il segno giusto, positivo in un'espansione ($V_B > V_A$) e negativo in una compressione.

```tikz
% nome: isoterma-lavoro-area-iperbole
% alt: Il piano pressione-volume con un ramo di iperbole, l'isoterma a temperatura T, che scende dallo stato A, a volume V con A e pressione p con A, allo stato B, a volume V con B e pressione p con B. La regione sotto la curva tra i due volumi è colorata, e dentro è scritto W uguale a n R T per il logaritmo naturale di V con B fratto V con A
\begin{tikzpicture}
\fill[orange!25] (1.2,0) -- (1.2,3.2) -- plot[domain=1.2:4.8, samples=40] (\x,{3.84/\x}) -- (4.8,0) -- cycle;
\draw[->] (-0.3,0) -- (6.0,0) node[right] {$V$};
\draw[->] (0,-0.3) -- (0,4.0) node[above] {$p$};
\draw[dashed, thin] plot[domain=1.0:5.6, samples=40] (\x,{3.84/\x});
\draw[thick, blue] plot[domain=1.2:4.8, samples=40] (\x,{3.84/\x});
\draw[-{Stealth}, thick, blue] (2.3,1.6696) -- (2.6,1.4769);
\draw[dashed, thin] (1.2,0) -- (1.2,3.2) -- (0,3.2);
\draw[dashed, thin] (4.8,0) -- (4.8,0.8) -- (0,0.8);
\fill (1.2,3.2) circle (1.5pt) node[above right] {$A$};
\fill (4.8,0.8) circle (1.5pt) node[above right] {$B$};
\node[below] at (1.2,0) {$V_A$};
\node[below] at (4.8,0) {$V_B$};
\node[left] at (0,3.2) {$p_A$};
\node[left] at (0,0.8) {$p_B$};
\node at (3.0,0.38) {\small $W = n\,R\,T\,\ln\frac{V_B}{V_A}$};
\node[right] at (5.6,0.75) {\small $T$};
\end{tikzpicture}
```

Poiché sull'isoterma $p_A V_A = p_B V_B = n\,R\,T$, la stessa formula si scrive con i dati che si hanno:

$$W = p_A V_A\,\ln\frac{V_B}{V_A} = n\,R\,T\,\ln\frac{p_A}{p_B}$$

Nella seconda forma le pressioni sono rovesciate rispetto ai volumi, iniziale su finale, perché quando il volume raddoppia la pressione si dimezza.

Si può controllare la formula con la curva della lezione sul lavoro, quella da $1\,\text{L}$ e $400\,\text{kPa}$ a $4\,\text{L}$ e $100\,\text{kPa}$: è un'isoterma, perché $p\,V$ vale $400\,\text{J}$ nei due stati. La formula dà $W = 400\,\text{J} \cdot \ln 4 = 554{,}5\ldots\,\text{J}$, e contando i quadretti si era trovato circa $550\,\text{J}$.

```ad-example
Esempio 3: un'espansione isoterma
Una mole di gas perfetto ($1{,}0\,\text{mol}$) si espande a $300\,\text{K}$ fino a raddoppiare il volume. Quanto lavoro compie? Quanto calore assorbe?

Il rapporto tra i volumi è $\frac{V_B}{V_A} = 2$, e $\ln 2 = 0{,}693\ldots$:

$$W = n\,R\,T\,\ln\frac{V_B}{V_A} = 1{,}0\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 300\,\text{K} \cdot \ln 2 = 1728{,}0\ldots\,\text{J} \approx 1{,}7 \cdot 10^3\,\text{J}$$

La temperatura è costante, $\Delta U = 0$ e $Q = W \approx 1{,}7 \cdot 10^3\,\text{J}$: il gas assorbe dall'ambiente tanto calore quanto è il lavoro che compie. Il risultato non dipende dal volume di partenza, solo dal rapporto: passare da $1\,\text{L}$ a $2\,\text{L}$ o da $10\,\text{L}$ a $20\,\text{L}$ richiede lo stesso lavoro.
```

```ad-example
Esempio 4: una compressione isoterma
$0{,}40\,\text{mol}$ di gas perfetto vengono compresse lentamente a $290\,\text{K}$, e la pressione passa da $1{,}0 \cdot 10^5\,\text{Pa}$ a $2{,}5 \cdot 10^5\,\text{Pa}$. Quanto lavoro compie il gas? Quanto calore scambia?

Con le pressioni, iniziale su finale: $\frac{p_A}{p_B} = \frac{1{,}0 \cdot 10^5\,\text{Pa}}{2{,}5 \cdot 10^5\,\text{Pa}} = 0{,}40$, e $\ln 0{,}40 = -0{,}916\ldots$

$$W = n\,R\,T\,\ln\frac{p_A}{p_B} = 0{,}40\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 290\,\text{K} \cdot \ln 0{,}40 = -883{,}2\ldots\,\text{J} \approx -8{,}8 \cdot 10^2\,\text{J}$$

Il lavoro del gas è negativo: chi comprime compie sul gas $8{,}8 \cdot 10^2\,\text{J}$. Poiché $\Delta U = 0$, anche $Q = W \approx -8{,}8 \cdot 10^2\,\text{J}$: il gas cede all'ambiente, come calore, tutto il lavoro che riceve.
```

```ad-warning
Kelvin, e il rapporto nel verso giusto
Nella formula dell'isoterma la temperatura è assoluta: $27\,^\circ\text{C}$ sono $300\,\text{K}$, e con $27$ il lavoro viene undici volte troppo piccolo. Il rapporto dentro il logaritmo è finale su iniziale per i volumi; rovesciarlo cambia il segno del lavoro, perché $\ln\frac{1}{x} = -\ln x$.
```

## Le tre trasformazioni a confronto

Dallo stesso stato $A$ partono un'isocora, un'isobara e un'isoterma: nel piano pressione-volume sono un segmento verticale, uno orizzontale e un ramo di iperbole.

```tikz
% nome: tre-trasformazioni-piano-pv
% alt: Il piano pressione-volume con uno stato A a 3 litri e 200 kilopascal, da cui partono tre trasformazioni. L'isocora è un segmento verticale che sale fino a 350 kilopascal. L'isobara è un segmento orizzontale che arriva a 5,5 litri. L'isoterma è una curva che scende verso destra fino a 6 litri e 100 kilopascal
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.8, ystep=0.9] (0,0) grid (5.6,3.6);
\draw[->] (-0.3,0) -- (6.1,0) node[right] {$V$ (L)};
\draw[->] (0,-0.3) -- (0,4.1) node[above] {$p$ (kPa)};
\foreach \x/\l in {0.8/1,1.6/2,2.4/3,3.2/4,4.0/5,4.8/6,5.6/7} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\l$};
\foreach \y/\l in {0.9/100,1.8/200,2.7/300,3.6/400} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\l$};
\draw[thick, red] (2.4,1.8) -- (2.4,3.15);
\draw[-{Stealth}, thick, red] (2.4,2.3) -- (2.4,2.7);
\draw[thick, blue] (2.4,1.8) -- (4.4,1.8);
\draw[-{Stealth}, thick, blue] (3.3,1.8) -- (3.7,1.8);
\draw[thick, green!50!black] plot[domain=2.4:4.8, samples=30] (\x,{4.32/\x});
\draw[-{Stealth}, thick, green!50!black] (3.5,1.2343) -- (3.8,1.1368);
\fill (2.4,1.8) circle (1.5pt) node[below left] {$A$};
\node[left] at (2.4,2.9) {\small isocora};
\node[above] at (3.9,1.8) {\small isobara};
\node[below left] at (4.3,1.0) {\small isoterma};
\end{tikzpicture}
```

Nella figura qui sotto un gas monoatomico parte dallo stato $A$ della figura, a $300\,\text{K}$, e segue la trasformazione che scegli. Dove finisce il calore in ciascuna delle tre?

```interattivo
% nome: trasformazioni-gas-bilancio
% alt: Un cilindro orizzontale con un pistone e, sotto, il piano pressione-volume con la stessa scala orizzontale. Il gas, monoatomico, parte dallo stato A, a 3 litri, 200 kilopascal e 300 kelvin. Si sceglie la trasformazione: isocora, con un cursore per la temperatura finale da 150 a 600 kelvin, oppure isobara o isoterma, con un cursore per il volume finale da 1,5 a 6 litri. La linea da A allo stato finale B è tracciata sul piano, con l'area sotto di essa colorata. Accanto, tre barre che salgono o scendono da una linea dello zero: il calore Q, il lavoro W e la variazione di energia interna. Sotto sono scritti i tre valori in joule e la temperatura finale
```

Nell'isocora la barra del lavoro è vuota e quelle di $Q$ e di $\Delta U$ sono uguali: il calore resta tutto nel gas. Nell'isobara le tre barre hanno lo stesso segno, e $Q$ è la somma delle altre due, sempre nel rapporto di tre a due. Nell'isoterma è vuota la barra di $\Delta U$, e calore e lavoro sono uguali: il calore attraversa il gas ed esce come lavoro. Portando il cursore dall'altra parte dello stato $A$ (raffreddamento, compressione) tutte le barre cambiano segno.

| | Isocora | Isobara | Isoterma |
|---|---|---|---|
| resta costante | $V$ | $p$ | $T$ |
| legge del gas | $\dfrac{p}{T}$ costante | $\dfrac{V}{T}$ costante | $p\,V$ costante |
| nel piano $p$-$V$ | segmento verticale | segmento orizzontale | ramo di iperbole |
| lavoro $W$ | $0$ | $p\,\Delta V = n\,R\,\Delta T$ | $n\,R\,T\,\ln\dfrac{V_B}{V_A}$ |
| $\Delta U$ (monoatomico) | $\tfrac{3}{2}\,n\,R\,\Delta T$ | $\tfrac{3}{2}\,n\,R\,\Delta T$ | $0$ |
| calore $Q$ | $\Delta U$ | $\Delta U + W = \tfrac{5}{2}\,n\,R\,\Delta T$ | $W$ |

## Le trasformazioni cicliche

Una **trasformazione ciclica** è una successione di trasformazioni che riporta il gas nello stato iniziale. L'energia interna è una funzione di stato, quindi alla fine del ciclo ha di nuovo il valore di partenza:

$$\Delta U_{ciclo} = 0 \qquad Q_{ciclo} = W_{ciclo}$$

dove $Q_{ciclo}$ è la somma dei calori scambiati nei vari tratti, ciascuno con il suo segno, e $W_{ciclo}$ la somma dei lavori, che nel piano pressione-volume è l'area racchiusa dal ciclo (positiva se il verso è orario). In un ciclo il lavoro totale compiuto dal gas è uguale al calore assorbito meno il calore ceduto.

Per studiare un ciclo si fa una tabella con una riga per tratto e le colonne $Q$, $W$ e $\Delta U$: in ogni riga vale $\Delta U = Q - W$, e la colonna di $\Delta U$ deve dare zero come somma.

```ad-example
Esempio 5: un ciclo con tre trasformazioni
$2{,}00\,\text{mol}$ di gas perfetto monoatomico partono dallo stato $A$, a $300\,\text{K}$ e $2{,}00 \cdot 10^5\,\text{Pa}$, e percorrono il ciclo della figura: un'espansione isobara $A \to B$ fino a volume doppio, un raffreddamento isocoro $B \to C$ fino a tornare a $300\,\text{K}$, una compressione isoterma $C \to A$. Trova $Q$, $W$ e $\Delta U$ in ogni tratto e in tutto il ciclo.

Nei passaggi teniamo i risultati al joule, e arrotondiamo a tre cifre solo alla fine. Sull'isobara il volume raddoppia, quindi raddoppia la temperatura assoluta: $T_B = 600\,\text{K}$. Il prodotto che torna in tutti i conti è $n\,R\,T_A = 2{,}00\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 300\,\text{K} = 4986\,\text{J}$.

Tratto $A \to B$, isobara con $\Delta T = +300\,\text{K}$:

$$W = n\,R\,\Delta T = 4986\,\text{J}$$

$$\Delta U = \frac{3}{2}\,n\,R\,\Delta T = 7479\,\text{J}$$

$$Q = \Delta U + W = 12\,465\,\text{J}$$

Tratto $B \to C$, isocora con $\Delta T = -300\,\text{K}$:

$$W = 0$$

$$\Delta U = \frac{3}{2}\,n\,R\,\Delta T = -7479\,\text{J}$$

$$Q = \Delta U = -7479\,\text{J}$$

Tratto $C \to A$, isoterma a $300\,\text{K}$ con il volume che si dimezza:

$$\Delta U = 0$$

$$W = n\,R\,T_A\,\ln\frac{V_A}{V_C} = 4986\,\text{J} \cdot \ln\frac{1}{2} = -3456\,\text{J}$$

$$Q = W = -3456\,\text{J}$$

| Tratto | $Q$ (J) | $W$ (J) | $\Delta U$ (J) |
|---|---|---|---|
| $A \to B$ | $12\,465$ | $4986$ | $7479$ |
| $B \to C$ | $-7479$ | $0$ | $-7479$ |
| $C \to A$ | $-3456$ | $-3456$ | $0$ |
| ciclo | $1530$ | $1530$ | $0$ |

In un ciclo il gas compie $W_{ciclo} \approx 1{,}53 \cdot 10^3\,\text{J}$ di lavoro. Assorbe $12\,465\,\text{J}$ di calore nel tratto $A \to B$ e ne cede in tutto $7479\,\text{J} + 3456\,\text{J} = 10\,935\,\text{J}$ negli altri due: la differenza è il lavoro.
```

```tikz
% nome: ciclo-isobara-isocora-isoterma
% alt: Il piano pressione-volume con il volume in litri e la pressione in kilopascal. Un ciclo percorso in senso orario: dallo stato A, a circa 25 litri e 200 kilopascal, un segmento orizzontale fino a B, a circa 50 litri; da B un segmento verticale giù fino a C, a 100 kilopascal; da C un ramo di iperbole, l'isoterma a 300 kelvin, che risale fino ad A. La regione racchiusa è colorata, e dentro è scritto W uguale a 1530 joule
\begin{tikzpicture}
\fill[orange!25] (2.2437,3.2) -- (4.4874,3.2) -- (4.4874,1.6) -- plot[domain=4.4874:2.2437, samples=30] (\x,{7.1798/\x}) -- cycle;
\draw[gray!25, very thin, xstep=0.9, ystep=0.8] (0,0) grid (5.4,4.0);
\draw[->] (-0.3,0) -- (5.9,0) node[right] {$V$ (L)};
\draw[->] (0,-0.3) -- (0,4.5) node[above] {$p$ (kPa)};
\foreach \x/\l in {0.9/10,1.8/20,2.7/30,3.6/40,4.5/50,5.4/60} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\l$};
\foreach \y/\l in {0.8/50,1.6/100,2.4/150,3.2/200,4.0/250} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\l$};
\draw[thick, blue] (2.2437,3.2) -- (4.4874,3.2) -- (4.4874,1.6);
\draw[thick, blue] plot[domain=2.2437:4.4874, samples=30] (\x,{7.1798/\x});
\draw[-{Stealth}, thick, blue] (3.2,3.2) -- (3.6,3.2);
\draw[-{Stealth}, thick, blue] (4.4874,2.6) -- (4.4874,2.2);
\draw[-{Stealth}, thick, blue] (3.3,2.1757) -- (3.0,2.3933);
\fill (2.2437,3.2) circle (1.5pt) node[above left] {$A$};
\fill (4.4874,3.2) circle (1.5pt) node[above right] {$B$};
\fill (4.4874,1.6) circle (1.5pt) node[below right] {$C$};
\node at (3.65,2.7) {\small $1530$ J};
\end{tikzpicture}
```

Un ciclo percorso in senso orario, come questo, assorbe calore e fornisce lavoro: è lo schema di una macchina termica. Quanta parte del calore assorbito diventi lavoro, e perché non possa diventarlo tutto, è l'argomento della lezione [Le macchine termiche e il rendimento](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/le-macchine-termiche-e-il-rendimento).

```ad-warning
In un ciclo è zero solo la variazione di energia interna
Tornare nello stato iniziale azzera $\Delta U$, non il calore e non il lavoro: questi due sono uguali tra loro, e di solito diversi da zero.
```

## Come si riconosce la trasformazione

1. Cerca nel testo che cosa resta costante: "recipiente rigido" o "pistone bloccato" vuol dire isocora; "pistone libero" o "a pressione atmosferica" vuol dire isobara; "lentamente, a contatto con un bagno a temperatura fissa" vuol dire isoterma.
2. Scrivi subito il termine che vale zero: $W$ nell'isocora, $\Delta U$ nell'isoterma. Nell'isobara non è zero nessuno dei tre.
3. Calcola gli altri con le formule della tabella, con le temperature in kelvin.
4. Controlla con il primo principio che $\Delta U = Q - W$, segni compresi.
