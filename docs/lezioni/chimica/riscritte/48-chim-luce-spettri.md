# La luce e gli spettri atomici

Un fuoco d'artificio rosso contiene sali di stronzio, uno verde sali di bario, e i lampioni arancioni di certe strade sono pieni di vapori di sodio. Ogni elemento, scaldato o attraversato da una scarica elettrica, emette luce di colori suoi e di nessun altro. Da questa luce i chimici dell'Ottocento hanno imparato a riconoscere gli elementi, e quelli del Novecento a capire come sono disposti gli elettroni nell'atomo. Per leggerla servono due idee: la luce come onda, con la sua lunghezza d'onda, e la luce come insieme di pacchetti di energia, i fotoni.

## La luce è un'onda

Nel 1865 il fisico scozzese James Clerk Maxwell mostrò che la luce è un'**onda elettromagnetica**: un campo elettrico e un campo magnetico che oscillano e si propagano insieme, anche nel vuoto. Di un'onda contano tre grandezze.

La **lunghezza d'onda** $\lambda$ (lambda) è la distanza tra due creste vicine. Per la luce visibile è meno di un millesimo di millimetro, e si misura in nanometri: $1\,\text{nm} = 10^{-9}\,\text{m}$.

La **frequenza** $\nu$ (la lettera greca ni) è il numero di oscillazioni complete in un secondo. Si misura in hertz: $1\,\text{Hz} = 1\,\text{s}^{-1}$.

L'**ampiezza** è l'altezza della cresta. Da lei dipende l'intensità della luce, cioè quanto è forte, non il suo colore.

```tikz
% nome: luce-onde-lunghezza-frequenza
% alt: Due onde disegnate una sopra l'altra sullo stesso tratto. La prima ha tre oscillazioni: la distanza tra due creste vicine è segnata con una doppia freccia e la lettera lambda, e l'altezza della cresta è segnata come ampiezza. La seconda ha sei oscillazioni, con una lunghezza d'onda che è la metà: accanto è scritto che la frequenza è doppia
% svg: luce-onde-lunghezza-frequenza-ee3d70cf.svg 336x160
\begin{tikzpicture}
\draw[very thin, gray] (0,0) -- (6,0);
\draw[thick, blue, domain=0:6, samples=120, smooth] plot (\x, {0.6*sin(180*\x - 90)});
\draw[{Stealth}-{Stealth}, thin] (1,0.85) -- (3,0.85) node[midway, above] {$\lambda$};
\draw[thin, dashed] (1,0.6) -- (1,0.85);
\draw[thin, dashed] (3,0.6) -- (3,0.85);
\draw[{Stealth}-{Stealth}, thin] (5,0) -- (5,0.6);
\node[above] at (5,0.6) {\small ampiezza};
\node[right] at (6.2,0) {\small $\lambda$ lunga, $\nu$ bassa};
\draw[very thin, gray] (0,-2.2) -- (6,-2.2);
\draw[thick, blue, domain=0:6, samples=160, smooth] plot (\x, {-2.2 + 0.6*sin(360*\x - 90)});
\draw[{Stealth}-{Stealth}, thin] (0.5,-1.35) -- (1.5,-1.35) node[midway, above] {$\lambda$};
\draw[thin, dashed] (0.5,-1.6) -- (0.5,-1.35);
\draw[thin, dashed] (1.5,-1.6) -- (1.5,-1.35);
\node[right] at (6.2,-2.2) {\small $\lambda$ corta, $\nu$ alta};
\end{tikzpicture}
```

Tutte le onde elettromagnetiche viaggiano nel vuoto alla stessa velocità, la **velocità della luce**:

$$c = 3{,}00 \cdot 10^8\,\text{m/s}$$

In un secondo passano $\nu$ onde, ognuna lunga $\lambda$: la strada percorsa in un secondo è il loro prodotto.

$$c = \lambda\,\nu$$

Poiché $c$ è fissa, lunghezza d'onda e frequenza sono inversamente proporzionali: se una raddoppia, l'altra si dimezza. Nella figura la seconda onda ha la lunghezza d'onda che è la metà della prima, e quindi una frequenza doppia.

```ad-example
Esempio 1: la frequenza della luce verde
Una luce verde ha lunghezza d'onda $\lambda = 530\,\text{nm}$. Qual è la sua frequenza?

Prima si porta la lunghezza d'onda in metri: $530\,\text{nm} = 530 \cdot 10^{-9}\,\text{m} = 5{,}30 \cdot 10^{-7}\,\text{m}$.

Da $c = \lambda\,\nu$ si ricava la frequenza:

$$\nu = \frac{c}{\lambda} = \frac{3{,}00 \cdot 10^8\,\text{m/s}}{5{,}30 \cdot 10^{-7}\,\text{m}} = 5{,}66 \cdot 10^{14}\,\text{Hz}$$

Più di cinquecentomila miliardi di oscillazioni al secondo.
```

```ad-warning
I nanometri vanno portati in metri
La velocità della luce è in metri al secondo: se lasci $\lambda$ in nanometri, la frequenza esce sbagliata di un fattore $10^9$. Scrivi sempre $530\,\text{nm} = 5{,}30 \cdot 10^{-7}\,\text{m}$ prima di dividere.
```

## Lo spettro elettromagnetico

La luce che vediamo è solo una piccola parte delle onde elettromagnetiche. L'insieme di tutte, ordinate per lunghezza d'onda, è lo **spettro elettromagnetico**: va dalle onde radio, lunghe anche chilometri, ai raggi gamma, più corti di un nucleo atomico.

```tikz
% nome: luce-spettro-elettromagnetico
% alt: Lo spettro elettromagnetico come una fascia orizzontale divisa in sette regioni. Da sinistra a destra: onde radio, microonde, infrarosso, visibile, ultravioletto, raggi X, raggi gamma. Sotto la fascia sono scritte le lunghezze d'onda dei confini, da 10 centimetri a un centesimo di nanometro. La regione del visibile è stretta ed è ingrandita sotto: va da 700 nanometri, il rosso, a 400 nanometri, il violetto. Una freccia verso destra dice che frequenza ed energia dei fotoni crescono
% svg: luce-spettro-elettromagnetico-b650606a.svg 376x183
\begin{tikzpicture}[x=0.86cm]
\draw[thick] (0,0) rectangle (11.4,0.7);
\foreach \x in {1.5,3.5,5.4,5.9,8.2,9.8} \draw[thin] (\x,0) -- (\x,0.7);
\fill[gray!35] (5.4,0) rectangle (5.9,0.7);
\draw[thin] (5.4,0) rectangle (5.9,0.7);
\node at (0.75,0.35) {\footnotesize radio};
\node at (2.5,0.35) {\footnotesize microonde};
\node at (4.45,0.35) {\footnotesize infrarosso};
\node at (7.05,0.35) {\footnotesize ultravioletto};
\node at (9.0,0.35) {\footnotesize raggi X};
\node at (10.6,0.35) {\footnotesize raggi $\gamma$};
\node[above] at (5.65,0.7) {\footnotesize visibile};
\foreach \x/\l in {1.5/{$10$ cm}, 3.5/{$1$ mm}, 8.2/{$10$ nm}, 9.8/{$0{,}01$ nm}} {
  \draw[thin] (\x,0) -- (\x,-0.1);
  \node[below] at (\x,-0.1) {\footnotesize \l};
}
\draw[very thin] (5.4,0) -- (2.05,-1.3);
\draw[very thin] (5.9,0) -- (9.25,-1.3);
\draw[thick] (2.05,-1.9) rectangle (9.25,-1.3);
\foreach \x in {3.25,4.45,5.65,6.85,8.05} \draw[thin] (\x,-1.9) -- (\x,-1.3);
\node at (2.65,-1.6) {\scriptsize rosso};
\node at (3.85,-1.6) {\scriptsize arancio};
\node at (5.05,-1.6) {\scriptsize giallo};
\node at (6.25,-1.6) {\scriptsize verde};
\node at (7.45,-1.6) {\scriptsize blu};
\node at (8.65,-1.6) {\scriptsize violetto};
\node[below] at (2.05,-1.9) {\footnotesize $700$ nm};
\node[below] at (9.25,-1.9) {\footnotesize $400$ nm};
\draw[-{Stealth}, thick] (1.2,-3.1) -- (10.2,-3.1);
\node[below] at (5.7,-3.1) {\small frequenza ed energia dei fotoni crescono};
\node[above] at (5.7,-3.1) {\small la lunghezza d'onda diminuisce};
\end{tikzpicture}
```

| Regione | Lunghezza d'onda | Dove la incontri |
|---|---|---|
| Onde radio | più di $10\,\text{cm}$ | radio, televisione |
| Microonde | da $1\,\text{mm}$ a $10\,\text{cm}$ | forno a microonde, telefoni, wi-fi |
| Infrarosso | da $700\,\text{nm}$ a $1\,\text{mm}$ | il calore di una stufa, i telecomandi |
| Visibile | da $400$ a $700\,\text{nm}$ | la luce che l'occhio vede |
| Ultravioletto | da $10$ a $400\,\text{nm}$ | la parte della luce del Sole che abbronza e scotta |
| Raggi X | da $0{,}01$ a $10\,\text{nm}$ | radiografie |
| Raggi gamma | meno di $0{,}01\,\text{nm}$ | emessi dai nuclei radioattivi |

I confini tra le regioni sono convenzioni, e da un libro all'altro cambiano un po'. Dentro il visibile, a ogni lunghezza d'onda corrisponde un colore: il rosso è intorno a $700\,\text{nm}$, il violetto intorno a $400\,\text{nm}$. La **luce bianca**, come quella del Sole o di una lampadina a filamento, li contiene tutti: un prisma di vetro la separa nei suoi colori, come nella lezione di fisica [La dispersione della luce e i colori](/materiale/scuola-superiore/fisica/l-ottica-geometrica/la-dispersione-della-luce-e-i-colori).

## L'energia della luce arriva a pacchetti

Il modello dell'onda spiega bene come la luce si propaga. Non spiega come viene emessa e assorbita dalla materia. Nel 1900 il fisico tedesco Max Planck, studiando la luce emessa dai corpi caldi, dovette ammettere che la materia scambia energia con la luce solo a pacchetti di una grandezza precisa, che chiamò **quanti**. Nel 1905 Albert Einstein fece un passo in più: è la luce stessa a essere fatta di pacchetti di energia, che oggi si chiamano **fotoni**.

L'energia di un fotone dipende solo dalla frequenza della luce, secondo la **relazione di Planck**:

$$E = h\,\nu$$

dove $h$ è la **costante di Planck**:

$$h = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}$$

Mettendo insieme $E = h\,\nu$ e $c = \lambda\,\nu$ si ottiene l'energia del fotone dalla lunghezza d'onda:

$$E = \frac{h\,c}{\lambda}$$

Un fotone di luce violetta, che ha una frequenza alta, porta più energia di un fotone di luce rossa. Una luce più intensa non ha fotoni più energetici: ne ha di più.

```ad-example
Esempio 2: l'energia di un fotone giallo
La luce gialla delle lampade al sodio ha $\lambda = 589\,\text{nm}$. Quanta energia porta un suo fotone?

In metri, $\lambda = 5{,}89 \cdot 10^{-7}\,\text{m}$. Allora:

$$E = \frac{h\,c}{\lambda} = \frac{6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s} \cdot 3{,}00 \cdot 10^8\,\text{m/s}}{5{,}89 \cdot 10^{-7}\,\text{m}} = 3{,}38 \cdot 10^{-19}\,\text{J}$$

È un'energia piccolissima, perché è quella di un solo fotone: una lampada ne emette miliardi di miliardi al secondo.
```

```ad-example
Esempio 3: una mole di fotoni
Quanta energia porta una mole di fotoni di luce violetta, con $\lambda = 400\,\text{nm}$?

Un fotone ha energia

$$E = \frac{6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s} \cdot 3{,}00 \cdot 10^8\,\text{m/s}}{4{,}00 \cdot 10^{-7}\,\text{m}} = 4{,}97 \cdot 10^{-19}\,\text{J}$$

Una mole di fotoni sono $6{,}02 \cdot 10^{23}$ fotoni (il numero di Avogadro della lezione [La mole e la massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare)):

$$4{,}97 \cdot 10^{-19}\,\text{J} \cdot 6{,}02 \cdot 10^{23}\,\text{mol}^{-1} = 2{,}99 \cdot 10^5\,\text{J/mol} = 299\,\text{kJ/mol}$$

È l'ordine di grandezza dell'energia che tiene insieme gli atomi di una molecola. Per questo la luce violetta e ancora di più l'ultravioletto possono rompere i legami chimici, mentre l'infrarosso si limita a scaldare.
```

```ad-warning
Energia e lunghezza d'onda vanno al contrario
L'energia del fotone cresce con la frequenza e diminuisce con la lunghezza d'onda. Tra $400\,\text{nm}$ e $700\,\text{nm}$ il numero più grande è quello del rosso, ma il fotone con più energia è quello violetto.
```

Nella figura qui sotto scegli la lunghezza d'onda con il cursore e leggi il colore, la frequenza e l'energia del fotone, per uno solo e per una mole.

```interattivo
% nome: luce-lunghezza-onda-fotone
% alt: Una fascia con i colori dello spettro visibile, dal violetto a 400 nanometri al rosso a 700, prolungata a sinistra nell'ultravioletto e a destra nell'infrarosso, che sono scuri perché l'occhio non li vede. Un cursore sceglie la lunghezza d'onda tra 250 e 900 nanometri: un segno si sposta sulla fascia, sopra un'onda si allunga o si accorcia, e sotto si leggono il colore, la frequenza in hertz, l'energia di un fotone in joule e quella di una mole di fotoni in chilojoule per mole
```

Spostando il cursore da $700$ a $400\,\text{nm}$ la frequenza passa da $4{,}29 \cdot 10^{14}$ a $7{,}50 \cdot 10^{14}\,\text{Hz}$, e l'energia di una mole di fotoni da $171$ a $299\,\text{kJ/mol}$: quasi il doppio, senza che la luce diventi più intensa.

## L'effetto fotoelettrico

La prova che la luce è fatta di fotoni è un esperimento. Se si illumina la superficie di un metallo con luce adatta, il metallo emette elettroni: è l'**effetto fotoelettrico**. L'esperimento ha due risultati che l'onda non spiega.

1. Per ogni metallo esiste una **frequenza di soglia**: con luce di frequenza più bassa non esce nessun elettrone, per quanto intensa sia la luce e per quanto a lungo la si tenga accesa.
2. Sopra la soglia gli elettroni escono subito, anche con luce debolissima; aumentando l'intensità ne escono di più, ma non più veloci.

```tikz
% nome: luce-effetto-fotoelettrico
% alt: Due lastre di metallo affiancate. Sulla prima arrivano molte onde lunghe, con la scritta luce rossa intensa: nessun elettrone esce dalla lastra. Sulla seconda arrivano poche onde corte, con la scritta luce violetta debole: dalla lastra escono due elettroni, disegnati come palline con una freccia che si allontana
% svg: luce-effetto-fotoelettrico-9002143b.svg 322x123
\begin{tikzpicture}
\draw[thick, fill=gray!30] (0,0) rectangle (3.4,0.45);
\node at (1.7,0.22) {\small metallo};
\foreach \x in {0.3,0.8,1.3,1.8} \draw[thick, red!80!black, -{Stealth}, decorate, decoration={snake, amplitude=2.2pt, segment length=11pt, post length=4pt}] (\x,2.2) -- (\x+0.9,0.5);
\node[above] at (1.5,2.2) {\small luce rossa intensa};
\node[below] at (1.7,-0.05) {\small nessun elettrone};
\draw[thick, fill=gray!30] (5,0) rectangle (8.4,0.45);
\node at (6.7,0.22) {\small metallo};
\foreach \x in {5.1,5.75} \draw[thick, blue!70!black, -{Stealth}, decorate, decoration={snake, amplitude=2.2pt, segment length=5pt, post length=4pt}] (\x,2.2) -- (\x+0.9,0.5);
\node[above] at (6.1,2.2) {\small luce violetta debole};
\draw[thin, fill=blue!10] (7.0,0.75) circle (0.11);
\draw[-{Stealth}, thin] (7.1,0.85) -- (7.6,1.5);
\draw[thin, fill=blue!10] (7.7,0.75) circle (0.11);
\draw[-{Stealth}, thin] (7.8,0.85) -- (8.3,1.5);
\node[below] at (6.7,-0.05) {\small elettroni emessi};
\end{tikzpicture}
```

Con i fotoni tutto torna. Ogni elettrone è strappato da un solo fotone, e per uscire dal metallo gli serve una certa energia minima. Se il fotone ne porta di meno, l'elettrone resta dov'è, e non conta quanti fotoni arrivano: le loro energie non si sommano. Se ne porta di più, l'elettrone esce, e quello che avanza è la sua energia cinetica. L'intensità della luce è il numero dei fotoni, e decide quanti elettroni escono. Per questa spiegazione, del 1905, Einstein ricevette il premio Nobel.

```ad-example
Esempio 4: quale luce strappa elettroni al potassio
Per strappare un elettrone al potassio servono almeno $3{,}68 \cdot 10^{-19}\,\text{J}$. Ci riesce la luce rossa a $700\,\text{nm}$? E quella violetta a $400\,\text{nm}$?

Un fotone rosso ha energia

$$E = \frac{6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s} \cdot 3{,}00 \cdot 10^8\,\text{m/s}}{7{,}00 \cdot 10^{-7}\,\text{m}} = 2{,}84 \cdot 10^{-19}\,\text{J}$$

che è meno di $3{,}68 \cdot 10^{-19}\,\text{J}$: nessun elettrone esce, con qualunque intensità.

Un fotone violetto ha $4{,}97 \cdot 10^{-19}\,\text{J}$, come nell'esempio 3: gli elettroni escono, e a ognuno restano $4{,}97 \cdot 10^{-19} - 3{,}68 \cdot 10^{-19} = 1{,}29 \cdot 10^{-19}\,\text{J}$ di energia cinetica.
```

La luce, quindi, si comporta come un'onda quando si propaga e come un insieme di particelle quando scambia energia con la materia. Che cosa voglia dire lo racconta la lezione [Dualismo onda-particella e principio di indeterminazione](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/dualismo-onda-particella-e-principio-di-indeterminazione).

## Spettri continui e spettri a righe

Uno **spettroscopio** è lo strumento che separa una luce nelle sue lunghezze d'onda. La luce entra da una fenditura sottile, attraversa un prisma (o un reticolo), che devia ogni lunghezza d'onda di un angolo diverso, e arriva su uno schermo. Quello che compare sullo schermo è lo **spettro** di quella luce.

```tikz
% nome: luce-spettroscopio-schema
% alt: Schema di uno spettroscopio. Da sinistra: un tubo con un gas che emette luce, una lastra con una fenditura, un prisma triangolare e uno schermo. Dal prisma escono quattro raggi separati che arrivano sullo schermo in quattro punti diversi, dove lasciano quattro righe
% svg: luce-spettroscopio-schema-b81f5f73.svg 302x119
\begin{tikzpicture}
\draw[thick, fill=orange!25] (0,-0.25) rectangle (0.5,1.05);
\node[below] at (0.25,-0.3) {\small gas};
\draw[thick] (1.6,-0.6) -- (1.6,0.32);
\draw[thick] (1.6,0.48) -- (1.6,1.4);
\node[below] at (1.6,-0.65) {\small fenditura};
\draw[thick] (0.5,0.4) -- (3.55,0.4);
\draw[thick, fill=blue!10] (3.1,-0.4) -- (4.7,-0.4) -- (3.9,1.0) -- cycle;
\node[below] at (3.9,-0.45) {\small prisma};
\draw[thin] (3.55,0.4) -- (4.3,0.3);
\foreach \y in {0.0,-0.4,-0.75,-1.05} \draw[thin] (4.3,0.3) -- (7,\y);
\draw[thick] (7,-1.4) -- (7,1.2);
\foreach \y in {0.0,-0.4,-0.75,-1.05} \draw[very thick] (7,\y) -- (7.25,\y);
\node[above] at (7.1,1.2) {\small schermo};
\end{tikzpicture}
```

Gli spettri sono di due tipi, molto diversi.

Un solido o un liquido incandescente, come il filamento di una lampadina o il ferro rovente, dà uno **spettro continuo**: una fascia in cui i colori sfumano uno nell'altro, dal rosso al violetto, senza interruzioni. Ci sono tutte le lunghezze d'onda.

Un gas rarefatto di un elemento, scaldato o attraversato da una scarica elettrica, dà uno **spettro a righe**: su fondo nero compaiono solo poche righe luminose sottili, ognuna a una lunghezza d'onda precisa. È uno **spettro di emissione**, perché è la luce che il gas emette. L'idrogeno, per esempio, nel visibile ha quattro righe.

```tikz
% nome: luce-spettri-continuo-righe-assorbimento
% alt: Tre spettri uno sotto l'altro sulla stessa scala di lunghezze d'onda, da 400 a 700 nanometri. Il primo, lo spettro continuo, è una fascia piena. Il secondo, lo spettro di emissione dell'idrogeno, è una fascia vuota con quattro righe sottili a 410, 434, 486 e 656 nanometri. Il terzo, lo spettro di assorbimento dell'idrogeno, è una fascia piena interrotta da quattro righe mancanti alle stesse lunghezze d'onda
% svg: luce-spettri-continuo-righe-assorbimento-0e5cbd50.svg 327x166
\begin{tikzpicture}[x=0.02cm]
\fill[gray!45] (400,2.6) rectangle (700,3.2);
\draw[thin] (400,2.6) rectangle (700,3.2);
\node[right] at (705,2.9) {\small continuo};
\draw[thin] (400,1.3) rectangle (700,1.9);
\foreach \l in {410,434,486,656} \draw[very thick] (\l,1.3) -- (\l,1.9);
\node[right] at (705,1.6) {\small emissione};
\fill[gray!45] (400,0) rectangle (408.5,0.6);
\fill[gray!45] (411.5,0) rectangle (432.5,0.6);
\fill[gray!45] (435.5,0) rectangle (484.5,0.6);
\fill[gray!45] (487.5,0) rectangle (654.5,0.6);
\fill[gray!45] (657.5,0) rectangle (700,0.6);
\draw[thin] (400,0) rectangle (700,0.6);
\node[right] at (705,0.3) {\small assorbimento};
\foreach \l in {400,500,600,700} {
  \draw[thin] (\l,0) -- (\l,-0.1);
  \node[below] at (\l,-0.1) {\footnotesize $\l$};
}
\node[below] at (550,-0.55) {\small lunghezza d'onda (nm)};
\node[above] at (410,1.9) {\scriptsize $410$};
\node[above] at (436,1.9) {\scriptsize $434$};
\node[above] at (486,1.9) {\scriptsize $486$};
\node[above] at (656,1.9) {\scriptsize $656$};
\end{tikzpicture}
```

Le quattro righe dell'idrogeno sono a $656\,\text{nm}$ (rossa), $486\,\text{nm}$ (verde-azzurra), $434\,\text{nm}$ (blu) e $410\,\text{nm}$ (violetta).

## Lo spettro di assorbimento

Lo stesso gas, freddo, si può studiare al contrario. Se lo si mette tra una sorgente di luce bianca e lo spettroscopio, sullo schermo compare lo spettro continuo della sorgente interrotto da alcune righe scure: sono le lunghezze d'onda che il gas ha assorbito. È lo **spettro di assorbimento** del gas.

Le righe scure dell'assorbimento cadono esattamente alle stesse lunghezze d'onda delle righe luminose dell'emissione: un elemento assorbe la luce che è capace di emettere, come si vede nel terzo spettro della figura.

Nel 1814 l'ottico tedesco Joseph von Fraunhofer trovò centinaia di righe scure nello spettro del Sole. Sono righe di assorbimento: la luce che viene dall'interno del Sole attraversa i gas più freddi della sua superficie, e ogni elemento che c'è lì toglie le sue lunghezze d'onda. È così che conosciamo la composizione delle stelle, senza averne mai toccata una.

```ad-warning
Una riga scura non è un colore che la sorgente non emette
Nello spettro di assorbimento la sorgente emette tutte le lunghezze d'onda: quelle che mancano sono state tolte dal gas che la luce ha attraversato. Le righe dicono che cosa c'è nel gas, non nella sorgente.
```

## Ogni elemento ha il suo spettro

Le righe di un elemento sono sempre le stesse, in qualunque laboratorio e in qualunque stella, e nessun altro elemento le ha uguali. Lo spettro a righe è l'impronta digitale dell'elemento, e riconoscere gli elementi dalle righe è il lavoro dell'**analisi spettrale**, che i tedeschi Robert Bunsen e Gustav Kirchhoff misero a punto intorno al 1860. Con lo spettroscopio scoprirono due elementi nuovi, il cesio e il rubidio, dalle loro righe mai viste prima. Nel 1868, nello spettro del Sole, comparve una riga gialla che non era di nessun elemento conosciuto: il nuovo elemento fu chiamato elio, dal nome greco del Sole, e sulla Terra fu trovato solo nel 1895.

Nella figura scegli un elemento e guarda le sue righe, in emissione o in assorbimento. In alto c'è lo spettro di un campione sconosciuto: cambia elemento finché le righe coincidono tutte.

```interattivo
% nome: luce-spettri-righe-elementi
% alt: Due spettri a righe uno sopra l'altro, tra 400 e 700 nanometri, con i colori veri su fondo nero. Quello in alto è di un campione sconosciuto; quello in basso è dell'elemento scelto tra idrogeno, elio, litio, sodio, neon e mercurio. Un selettore passa dallo spettro di emissione, con le righe luminose, a quello di assorbimento, con le righe scure sulla fascia continua dei colori. Quando le righe dei due spettri coincidono una frase dice quale elemento contiene il campione, e un bottone ne propone un altro
```

Le righe del campione coincidono con quelle di un solo elemento: una sola riga fuori posto esclude tutti gli altri. Passando dall'emissione all'assorbimento le righe non si spostano.

Una versione povera dell'analisi spettrale è il **saggio alla fiamma**: si porta un po' di un sale sulla fiamma di un bruciatore e si guarda il colore che prende. Il colore è la somma delle righe più intense dell'elemento.

| Elemento | Colore della fiamma |
|---|---|
| Litio | rosso cremisi |
| Sodio | giallo intenso |
| Potassio | violetto |
| Calcio | rosso arancio |
| Stronzio | rosso |
| Bario | verde chiaro |
| Rame | verde azzurro |

```ad-example
Esempio 5: riconoscere una riga
Uno spettro di emissione ha una riga a $486\,\text{nm}$. Qual è la frequenza di quella luce, e quanta energia porta ogni suo fotone?

$$\nu = \frac{c}{\lambda} = \frac{3{,}00 \cdot 10^8\,\text{m/s}}{4{,}86 \cdot 10^{-7}\,\text{m}} = 6{,}17 \cdot 10^{14}\,\text{Hz}$$

$$E = h\,\nu = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s} \cdot 6{,}17 \cdot 10^{14}\,\text{Hz} = 4{,}09 \cdot 10^{-19}\,\text{J}$$

È la riga verde-azzurra dell'idrogeno. Ogni atomo di idrogeno che la emette perde esattamente $4{,}09 \cdot 10^{-19}\,\text{J}$, né di più né di meno.
```

Una riga a una lunghezza d'onda precisa vuol dire fotoni di un'energia precisa. Se un atomo emette solo fotoni di certe energie, vuol dire che può perdere energia solo in certe quantità fisse. Perché sia così, e perché le righe dell'idrogeno siano proprio quelle, lo spiega la lezione [Il modello atomico di Bohr](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/il-modello-atomico-di-bohr).
