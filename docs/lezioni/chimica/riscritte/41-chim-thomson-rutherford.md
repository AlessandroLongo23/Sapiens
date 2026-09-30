# I modelli atomici di Thomson e di Rutherford

Dopo la scoperta dell'elettrone, nel 1897, l'atomo non poteva più essere la pallina indivisibile di Dalton: conteneva elettroni negativi, e per essere neutro doveva contenere anche una carica positiva uguale. Restava da capire come fossero disposte le cariche. Un **modello atomico** è proprio questo, una descrizione di come è fatto l'atomo che spiega i fatti osservati; quando un esperimento lo smentisce, si cambia modello. Questa lezione racconta i primi due modelli con le cariche, quello di Thomson e quello di Rutherford, e l'esperimento che ha fatto passare dal primo al secondo.

## Il modello di Thomson

Nel 1904 J. J. Thomson, lo scopritore dell'elettrone, propose che l'atomo fosse una sfera di carica positiva distribuita in modo uniforme, grande quanto l'atomo, con gli elettroni sparsi al suo interno in numero sufficiente a renderlo neutro. In inglese è il modello *plum pudding*, un dolce con l'uvetta; nei libri italiani è il **modello a panettone**: la pasta è la carica positiva, l'uvetta sono gli elettroni.

```tikz
% nome: thomson-rutherford-due-modelli
% alt: Due modelli dell'atomo affiancati. A sinistra il modello di Thomson: un cerchio rosato pieno di segni più, con otto piccoli elettroni azzurri sparsi dentro. A destra il modello di Rutherford: un nucleo piccolissimo al centro, con il segno più, e alcuni elettroni lontani che gli girano intorno su orbite tratteggiate; lo spazio tra il nucleo e gli elettroni è vuoto
% svg: thomson-rutherford-due-modelli-5a363952.svg 306x129
\begin{tikzpicture}
\draw[thick, fill=red!15] (0,0) circle (1.3);
\foreach \p in {(-0.7,0.55),(0.1,0.85),(0.75,0.4),(-0.35,-0.05),(0.45,-0.35),(-0.8,-0.6),(0.05,-0.95),(0.9,-0.75),(-0.3,0.35),(0.4,0.05)} \node[red!60!black] at \p {\small $+$};
\foreach \p in {(-0.3,0.8),(0.5,0.75),(-0.95,0.1),(0.15,0.25),(1.0,-0.1),(-0.45,-0.45),(0.35,-0.75),(-0.6,-1.0)} \draw[thin, fill=blue!10] \p circle (0.11);
\node at (0,-1.75) {Thomson, 1904};
\draw[thin, dashed] (4.6,0) ellipse (1.3 and 0.55);
\draw[thin, dashed, rotate around={60:(4.6,0)}] (4.6,0) ellipse (1.3 and 0.55);
\draw[thin, dashed, rotate around={-60:(4.6,0)}] (4.6,0) ellipse (1.3 and 0.55);
\fill[red!70!black] (4.6,0) circle (0.07);
\draw[thin, fill=blue!10] (5.9,0) circle (0.11);
\draw[thin, fill=blue!10] (3.95,1.126) circle (0.11);
\draw[thin, fill=blue!10] (5.25,-1.126) circle (0.11);
\draw[thin] (4.66,0.05) -- (5.6,0.95);
\node[right] at (5.55,1.05) {\small nucleo};
\node at (4.6,-1.75) {Rutherford, 1911};
\end{tikzpicture}
```

Il modello spiegava due fatti: l'atomo è neutro, e può perdere o acquistare qualche elettrone diventando uno ione. Non diceva però dove stesse la massa, né quanto spazio occupassero davvero le cariche.

## L'esperimento della lamina d'oro

Nel 1909, nel laboratorio di Ernest Rutherford all'università di Manchester, Hans Geiger e il giovane Ernest Marsden spararono particelle alfa contro una lamina d'oro sottilissima, spessa meno di un millesimo di millimetro. Le **particelle alfa** sono emesse da alcune sostanze radioattive, come il radio: hanno carica $+2e$, una massa di circa $4\,\text{u}$, più di settemila volte quella dell'elettrone, e viaggiano a circa ventimila chilometri al secondo. Oggi sappiamo che sono nuclei di elio.

Il fascio di particelle alfa, uscito da un blocco di piombo con un piccolo foro, colpiva la lamina. Intorno alla lamina uno schermo ricoperto di solfuro di zinco faceva un piccolo lampo di luce in ogni punto in cui arrivava una particella, e i lampi si contavano uno per uno, al buio, con un microscopio che si poteva spostare tutto intorno.

```tikz
% nome: thomson-rutherford-apparato
% alt: Schema dell'esperimento visto dall'alto. A sinistra un blocco di piombo con la sorgente di particelle alfa manda un fascio verso destra, contro una lamina d'oro verticale al centro. Intorno alla lamina uno schermo circolare. Quasi tutte le traiettorie attraversano la lamina e arrivano dritte sullo schermo a destra; due sono deviate di un angolo grande, una torna indietro verso sinistra. Dove le particelle colpiscono lo schermo ci sono dei lampi verdi
% svg: thomson-rutherford-apparato-84a091c0.svg 291x186
\begin{tikzpicture}
\draw[thick, green!50!black] (-168:2.2) arc (-168:168:2.2);
\draw[thick, fill=gray!40] (-4.3,-0.45) rectangle (-3.3,0.45);
\fill[red!60!black] (-3.95,0) circle (0.1);
\draw[thick, blue!60!black] (-3.3,0.06) -- (0,0.06);
\draw[thick, blue!60!black] (-3.3,-0.06) -- (0,-0.06);
\draw[thick, fill=yellow!40] (-0.04,-0.9) rectangle (0.04,0.9);
\draw[thin, blue!60!black] (0,0.06) -- (2.2,0.06);
\draw[thin, blue!60!black] (0,-0.06) -- (2.2,-0.06);
\draw[thin, blue!60!black] (0,0.03) -- (8:2.2);
\draw[thin, blue!60!black] (0,-0.03) -- (-6:2.2);
\draw[thin, blue!60!black] (0,0) -- (40:2.2);
\draw[thin, blue!60!black] (0,0) -- (-65:2.2);
\draw[thin, blue!60!black] (0,0) -- (150:2.2);
\foreach \a in {0,8,-6,40,-65,150} \fill[green!60!black] (\a:2.2) circle (2pt);
\node[below] at (-3.8,-0.5) {\small sorgente};
\node[above] at (0,0.95) {\small lamina d'oro};
\node[right] at (1.7,-1.9) {\small schermo};
\end{tikzpicture}
```

Con il modello di Thomson il risultato era prevedibile. La carica positiva, sparsa su tutto l'atomo, fa su una particella alfa che l'attraversa forze deboli, e gli elettroni sono troppo leggeri per spostarla: le particelle alfa dovevano attraversare la lamina quasi dritte, deviate al massimo di una frazione di grado.

Le misure dissero un'altra cosa:

- quasi tutte le particelle attraversavano la lamina senza deviare, come se non ci fosse;
- alcune venivano deviate di angoli grandi;
- pochissime tornavano indietro: Geiger e Marsden stimarono che, con una lamina di platino, circa una particella su ottomila rimbalzava all'indietro.

Rutherford raccontò anni dopo che era stata la cosa più incredibile della sua vita: "quasi come se si sparasse un proiettile d'artiglieria contro un foglio di carta velina, e quello tornasse indietro a colpirci".

```ad-example
Esempio 1: perché gli elettroni non fermano una particella alfa
La massa di una particella alfa è $6{,}64 \cdot 10^{-27}\,\text{kg}$, quella dell'elettrone $9{,}11 \cdot 10^{-31}\,\text{kg}$. Quante volte la particella alfa è più pesante?

$$\frac{m_\alpha}{m_e} = \frac{6{,}64 \cdot 10^{-27}\,\text{kg}}{9{,}11 \cdot 10^{-31}\,\text{kg}} = 7{,}29 \cdot 10^3$$

Circa settemila volte: un elettrone contro una particella alfa è come una pallina da ping pong contro una palla da bowling. Gli elettroni della lamina non possono deviarla di molto, e tanto meno rimandarla indietro: quello che la rimanda indietro deve avere una massa più grande della sua.
```

## Il modello di Rutherford

Nel 1911 Rutherford spiegò i risultati con un nuovo modello, il **modello nucleare** dell'atomo. Ogni osservazione ha la sua spiegazione:

1. Quasi tutte le particelle passano dritte: l'atomo è quasi tutto vuoto, e quasi sempre la particella alfa non incontra niente che la possa deviare.
2. Alcune particelle sono deviate di molto: la carica positiva non è sparsa, ma concentrata in una regione piccolissima al centro dell'atomo, il **nucleo**. Una particella alfa che ci passa vicino è respinta con una forza intensa, perché la forza tra due cariche cresce molto quando si avvicinano.
3. Pochissime tornano indietro: il nucleo contiene quasi tutta la massa dell'atomo, e le particelle che arrivano quasi dritte contro un nucleo rimbalzano. Sono pochissime perché il nucleo è così piccolo che è raro colpirlo quasi in pieno.

Gli elettroni si muovono intorno al nucleo, a grande distanza da lui, come i pianeti intorno al Sole: per questo il modello di Rutherford si chiama anche **modello planetario**. Oggi sappiamo che il nucleo contiene i protoni e i neutroni della lezione [Elettroni, protoni e neutroni](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/elettroni-protoni-e-neutroni); Rutherford sapeva solo che era piccolo, positivo e pesante.

Nella figura qui sotto spari particelle alfa contro gli atomi di una lamina e scegli il modello: con quello di Thomson passano tutte dritte, con quello di Rutherford quelle che sfiorano un nucleo sono deviate, e quelle che lo puntano quasi in pieno tornano indietro.

```interattivo
% nome: rutherford-lamina-oro
% alt: Tre atomi di una lamina d'oro, uno sopra l'altro, colpiti da particelle alfa che arrivano da sinistra con traiettorie parallele. Si sceglie il modello dell'atomo, Thomson o Rutherford, e si sparano le particelle: con il modello di Thomson attraversano tutte la lamina senza deviare; con il modello di Rutherford quasi tutte passano dritte, alcune, quelle che passano vicino a un nucleo, sono deviate di angoli grandi, e poche tornano indietro. Sotto si contano le particelle passate dritte, deviate e tornate indietro
```

## Quanto è piccolo il nucleo

Dagli angoli di deviazione Rutherford calcolò anche le dimensioni del nucleo. Un atomo ha un raggio dell'ordine di $10^{-10}\,\text{m}$, un nucleo dell'ordine di $10^{-15}$-$10^{-14}\,\text{m}$: il nucleo è da diecimila a centomila volte più piccolo dell'atomo.

```ad-example
Esempio 2: l'atomo d'oro in scala
Il raggio di un atomo d'oro è circa $1{,}4 \cdot 10^{-10}\,\text{m}$, quello del suo nucleo circa $7{,}0 \cdot 10^{-15}\,\text{m}$. Quante volte l'atomo è più grande del nucleo? Se il nucleo fosse una biglia di $1{,}0\,\text{cm}$ di diametro, quanto sarebbe grande l'atomo?

$$\frac{r_{atomo}}{r_{nucleo}} = \frac{1{,}4 \cdot 10^{-10}\,\text{m}}{7{,}0 \cdot 10^{-15}\,\text{m}} = 2{,}0 \cdot 10^4$$

In scala tutte le lunghezze si moltiplicano per lo stesso numero: l'atomo avrebbe un diametro di $2{,}0 \cdot 10^4 \cdot 1{,}0\,\text{cm} = 2{,}0 \cdot 10^4\,\text{cm} = 200\,\text{m}$. Una biglia al centro di uno spazio largo due campi da calcio, con qualche elettrone ai bordi.
```

```ad-example
Esempio 3: quanto spazio occupa il nucleo
Con i dati dell'esempio 2, quale frazione del volume dell'atomo è occupata dal nucleo?

Il volume di una sfera è proporzionale al cubo del raggio, quindi il rapporto dei volumi è il cubo del rapporto dei raggi:

$$\frac{V_{nucleo}}{V_{atomo}} = \left(\frac{r_{nucleo}}{r_{atomo}}\right)^3 = \left(\frac{1}{2{,}0 \cdot 10^4}\right)^3 = 1{,}25 \cdot 10^{-13} \approx 1{,}3 \cdot 10^{-13}$$

Il nucleo occupa circa un decimillesimo di miliardesimo del volume dell'atomo, e contiene più del $99{,}9\%$ della sua massa.
```

```ad-warning
Il rapporto dei volumi non è il rapporto dei raggi
Un nucleo ventimila volte più piccolo nel raggio non occupa un ventimillesimo del volume: il volume va con il cubo del raggio, e la frazione è $1/(2{,}0 \cdot 10^4)^3$, circa $10^{-13}$. Lo stesso vale per le scale: in un modello in scala le lunghezze si moltiplicano tutte per lo stesso numero, i volumi per il suo cubo.
```

```ad-warning
Vuoto non vuol dire che non c'è niente
Dire che l'atomo è "quasi tutto vuoto" significa che la sua massa sta quasi tutta nel nucleo. Lo spazio intorno è quello in cui si muovono gli elettroni, e sono loro a dare all'atomo le sue dimensioni: due atomi non si possono sovrapporre, perché i loro elettroni si respingono.
```

## I limiti del modello di Rutherford

Il modello planetario spiegava l'esperimento della lamina, ma aveva un problema grave. Secondo le leggi della fisica dell'Ottocento, una carica elettrica che gira intorno a un'altra perde energia emettendo luce: l'elettrone avrebbe dovuto avvicinarsi al nucleo a spirale e cadervi sopra in una piccolissima frazione di secondo. Gli atomi, invece, sono stabili. Il modello non spiegava neppure perché ogni elemento emette luce solo di certi colori. Nel 1913 il fisico danese Niels Bohr, allievo di Rutherford, propose un modello nuovo, che si studia al terzo anno nella lezione [Il modello atomico di Bohr](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/il-modello-atomico-di-bohr).
