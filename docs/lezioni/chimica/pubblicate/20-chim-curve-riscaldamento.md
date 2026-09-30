# Curve di riscaldamento e di raffreddamento

Se si scalda una sostanza con una fiamma sempre uguale e si legge un termometro ogni minuto, si ottiene una tabella di temperature; riportata in un grafico, con il tempo in orizzontale e la temperatura in verticale, diventa la **curva di riscaldamento** della sostanza. Lo stesso esperimento al contrario, lasciando raffreddare la sostanza, dà la **curva di raffreddamento**. Per un chimico queste curve sono uno strumento di riconoscimento: dicono a quali temperature la sostanza cambia stato, e se è una sostanza pura o un miscuglio.

## Come si ottiene una curva

In laboratorio si mette un solido in polvere in una provetta, con un termometro immerso nel solido, e si scalda la provetta a bagnomaria, cioè immersa in un becker d'acqua sopra una fiamma: così il riscaldamento è lento e uniforme. Ogni minuto si legge la temperatura e si osserva che cosa c'è nella provetta. Con le sostanze che fondono sopra i $100\,^\circ\text{C}$ al posto dell'acqua si usa un bagno d'olio, o un apparecchio elettrico per la temperatura di fusione.

```tikz
% nome: curve-bagnomaria-provetta
% alt: Una provetta con un solido bianco, in cui è immerso un termometro, è tenuta dentro un becker pieno d'acqua, scaldato da una fiamma. Le etichette indicano il termometro, la provetta con il solido e l'acqua del bagnomaria
% svg: curve-bagnomaria-provetta-a8f0e4d9.svg 250x171
\begin{tikzpicture}
\fill[cyan!20] (0.07,0.07) rectangle (2.43,1.9);
\draw[thin] (0.07,1.9) -- (2.43,1.9);
\fill[gray!15] (1.0,0.55) -- (1.0,1.2) -- (1.5,1.2) -- (1.5,0.55) arc[start angle=0, end angle=-180, radius=0.25] -- cycle;
\draw[thin] (1.0,1.2) -- (1.5,1.2);
\draw[thick] (1.0,2.9) -- (1.0,0.55) arc[start angle=180, end angle=360, radius=0.25] -- (1.5,2.9);
\draw[thick] (1.2,0.55) rectangle (1.3,3.5);
\fill[red!40] (1.22,0.55) rectangle (1.28,1.4);
\draw[thick, fill=red!40] (1.25,0.5) circle (0.07);
\draw[thick] (-0.1,2.5) -- (0,2.4) -- (0,0) -- (2.5,0) -- (2.5,2.4) -- (2.6,2.5);
\draw[thick, fill=gray!20] (1.15,-0.9) rectangle (1.35,-0.5);
\draw[thick, orange!90!black, fill=orange!25] (1.25,-0.5) .. controls (1.1,-0.28) and (1.18,-0.18) .. (1.25,-0.08) .. controls (1.32,-0.18) and (1.4,-0.28) .. (1.25,-0.5);
\draw[thick] (-0.4,-0.9) -- (3.2,-0.9);
\draw[thin] (1.35,3.3) -- (2.7,3.3);
\node[right] at (2.75,3.3) {\small termometro};
\draw[thin] (1.45,0.9) -- (2.7,0.9);
\node[right] at (2.75,0.9) {\small solido nella provetta};
\draw[thin] (2.2,1.6) -- (2.7,1.6);
\node[right] at (2.75,1.6) {\small acqua del bagnomaria};
\end{tikzpicture}
```

## La curva di riscaldamento di una sostanza pura

La figura mostra la curva di riscaldamento dell'acqua, partendo da ghiaccio a $-20\,^\circ\text{C}$, alla pressione normale. Ha cinque tratti, e ognuno corrisponde a una cosa diversa che succede nel recipiente.

```tikz
% nome: curve-riscaldamento-acqua-schema
% alt: Grafico della temperatura dell'acqua in funzione del tempo, da ghiaccio a meno 20 gradi fino a vapore sopra i 100 gradi. Cinque tratti: una salita (solido), un tratto orizzontale a 0 gradi (solido e liquido, fusione), una salita (liquido), un tratto orizzontale a 100 gradi (liquido e vapore, ebollizione), un'ultima salita (vapore). I due tratti orizzontali sono le soste termiche. Le lunghezze dei tratti non sono in scala
% svg: curve-riscaldamento-acqua-schema-81786b14.svg 317x203
\begin{tikzpicture}
\draw[->] (0,-0.8) -- (7.4,-0.8) node[below left] {\small tempo};
\draw[->] (0,-0.8) -- (0,3.4) node[above] {$t$ ($^\circ$C)};
\draw (0.06,0) -- (-0.06,0) node[left] {\small $0$};
\draw (0.06,2.5) -- (-0.06,2.5) node[left] {\small $100$};
\draw (0.06,-0.5) -- (-0.06,-0.5) node[left] {\small $-20$};
\draw[dashed, thin] (0,0) -- (1.0,0);
\draw[dashed, thin] (0,2.5) -- (3.4,2.5);
\draw[very thick, blue!70!black] (0,-0.5) -- (1.0,0) -- (2.4,0) -- (3.4,2.5) -- (6.2,2.5) -- (6.9,3.1);
\node[below right] at (0.45,-0.25) {\small S};
\node[above] at (1.7,0) {\small S + L};
\node[left] at (2.85,1.3) {\small L};
\node[above] at (4.8,2.5) {\small L + V};
\node[left] at (6.5,2.95) {\small V};
\node[below] at (1.7,-0.05) {\small fusione};
\node[below] at (4.8,2.45) {\small ebollizione};
\end{tikzpicture}
```

1. Il ghiaccio si scalda da $-20$ a $0\,^\circ\text{C}$: nel recipiente c'è solo solido (S), e l'energia fornita fa vibrare di più le sue particelle, cioè ne fa salire la temperatura.
2. A $0\,^\circ\text{C}$ il ghiaccio fonde. Nel recipiente ci sono solido e liquido insieme (S + L), e la temperatura resta ferma finché l'ultimo pezzo di ghiaccio non è fuso.
3. L'acqua liquida (L) si scalda da $0$ a $100\,^\circ\text{C}$.
4. A $100\,^\circ\text{C}$ l'acqua bolle. Ci sono liquido e vapore (L + V), e la temperatura resta ferma finché tutta l'acqua non è diventata vapore.
5. Il vapore (V), raccolto in un recipiente chiuso, si scalda sopra i $100\,^\circ\text{C}$.

I tratti orizzontali si chiamano **soste termiche**. Durante una sosta la fiamma continua a dare energia alla sostanza, ma la temperatura non sale: l'energia serve tutta ad allontanare le particelle, vincendo le forze di attrazione, cioè a far cambiare stato alla sostanza. Questa energia si chiama **calore latente**, dal latino "nascosto", perché entra nella sostanza senza che il termometro se ne accorga. La sua quantità per ogni chilogrammo di sostanza si calcola con $Q = L\,m$, come nella lezione di fisica sui [passaggi di stato e il calore latente](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/i-passaggi-di-stato-e-il-calore-latente).

```ad-warning
Durante la sosta la fiamma non è spenta
La temperatura ferma non vuol dire che la sostanza non stia ricevendo energia: la riceve allo stesso ritmo di prima, e la usa per cambiare stato. Se si spegnesse la fiamma durante la fusione, la fusione si fermerebbe, con il solido e il liquido ancora insieme.
```

Nei tratti in salita la sostanza è in un solo stato, e la pendenza dice quanto in fretta si scalda: più il tratto è ripido, meno energia serve per alzare la temperatura di un grado. Nella curva dell'acqua il tratto del liquido è meno ripido di quelli del ghiaccio e del vapore, perché l'acqua liquida ha un calore specifico circa doppio.

### Quanto dura una sosta

Con una fiamma che cede alla sostanza sempre la stessa energia ogni minuto, la durata di una sosta è proporzionale all'energia che serve per il passaggio, cioè al calore latente e alla massa della sostanza. Le temperature delle soste invece non dipendono dalla massa: una quantità doppia di ghiaccio fonde sempre a $0\,^\circ\text{C}$, ma la sua sosta dura il doppio.

```ad-example
Esempio 1: la durata delle soste
Con un fornello, $200\,\text{g}$ di ghiaccio a $0\,^\circ\text{C}$ fondono in $6{,}0\,\text{min}$. Con lo stesso fornello, quanto dura la fusione di $500\,\text{g}$ di ghiaccio? E quanto dura l'ebollizione dei primi $200\,\text{g}$ d'acqua, sapendo che il calore latente di fusione dell'acqua è $334\,\text{kJ/kg}$ e quello di vaporizzazione $2260\,\text{kJ/kg}$?

La durata è proporzionale alla massa: con una massa $2{,}5$ volte più grande la fusione dura $2{,}5$ volte di più,

$$6{,}0\,\text{min} \cdot \frac{500\,\text{g}}{200\,\text{g}} = 15\,\text{min}$$

A parità di massa, la durata è proporzionale al calore latente:

$$6{,}0\,\text{min} \cdot \frac{2260\,\text{kJ/kg}}{334\,\text{kJ/kg}} = 40{,}6\ldots\,\text{min} \approx 41\,\text{min}$$

L'ebollizione dura quasi sette volte la fusione. Nella figura delle soste le lunghezze non sono in scala: disegnata con questi tempi, la sosta dell'ebollizione occuperebbe quasi tutto il grafico.
```

## Sostanze pure e miscugli

Una sostanza pura fonde e bolle a temperatura costante: nella sua curva di riscaldamento ci sono soste termiche. Un miscuglio no. In un miscuglio i componenti hanno temperature di fusione e di ebollizione diverse, e mentre il miscuglio cambia stato cambia anche la sua composizione: quando l'acqua salata bolle, per esempio, se ne va solo l'acqua, la soluzione che resta è sempre più concentrata e bolle a una temperatura sempre più alta. Per questo un miscuglio fonde e bolle in un **intervallo di temperature**: nella curva, al posto del tratto orizzontale, c'è un tratto che sale più piano.

```tikz
% nome: curve-pura-miscuglio-confronto
% alt: Due grafici della temperatura in funzione del tempo, affiancati. A sinistra, una sostanza pura: la curva sale, ha un tratto orizzontale alla temperatura di fusione, poi risale. A destra, un miscuglio: la curva sale, poi sale più lentamente tra la temperatura di inizio e quella di fine della fusione, senza tratti orizzontali, e infine risale
% svg: curve-pura-miscuglio-confronto-33367b5d.svg 338x165
\begin{tikzpicture}
\draw[->] (0,0) -- (3.4,0) node[below left] {\small tempo};
\draw[->] (0,0) -- (0,3.0) node[above] {$t$};
\draw[very thick, blue!70!black] (0.1,0.3) -- (0.9,1.4) -- (2.2,1.4) -- (3.0,2.6);
\draw[dashed, thin] (0,1.4) -- (0.9,1.4);
\node[left] at (0,1.4) {\small $t_f$};
\node[above] at (1.55,1.4) {\small sosta};
\node[below] at (1.6,-0.3) {\small sostanza pura};
\begin{scope}[shift={(4.9,0)}]
\draw[->] (0,0) -- (3.4,0) node[below left] {\small tempo};
\draw[->] (0,0) -- (0,3.0) node[above] {$t$};
\draw[very thick, blue!70!black] (0.1,0.3) -- (0.8,1.2) -- (2.3,1.75) -- (3.0,2.7);
\draw[dashed, thin] (0,1.2) -- (0.8,1.2);
\draw[dashed, thin] (0,1.75) -- (2.3,1.75);
\node[left] at (0,1.2) {\small inizio};
\node[left] at (0,1.75) {\small fine};
\node[below right] at (1.2,1.3) {\small intervallo};
\node[below] at (1.6,-0.3) {\small miscuglio};
\end{scope}
\end{tikzpicture}
```

Questa differenza serve per riconoscere una sostanza pura da un miscuglio anche quando a occhio sono identici, come l'acqua distillata e l'acqua del rubinetto, che contiene sali disciolti. Serve anche a controllare la purezza di un solido: una piccola quantità di impurezze fa fondere il solido a una temperatura un po' più bassa di quella della sostanza pura, e in un intervallo di qualche grado. In laboratorio, un solido che fonde esattamente alla temperatura delle tabelle, senza intervallo, è puro.

```ad-example
Esempio 2: riconoscere la sostanza
Un solido bianco, scaldato, ha una sosta termica a $80\,^\circ\text{C}$; il liquido che si forma, scaldato in un bagno d'olio, ha una seconda sosta a $218\,^\circ\text{C}$. È una sostanza pura o un miscuglio? Quale sostanza potrebbe essere, tra quelle della tabella nella lezione sui [passaggi di stato](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/i-passaggi-di-stato)?

Le soste dicono che fonde e bolle a temperatura costante: è una sostanza pura. Fonde a $80\,^\circ\text{C}$ e bolle a $218\,^\circ\text{C}$, come il naftalene. Per esserne sicuri si confrontano più proprietà caratteristiche, per esempio anche la densità, perché due sostanze diverse possono avere per caso la stessa temperatura di fusione.
```

```ad-example
Esempio 3: la paraffina
La paraffina delle candele, scaldata, comincia a diventare liquida intorno a $50\,^\circ\text{C}$ e finisce di fondere intorno a $60\,^\circ\text{C}$, senza una sosta. Che cosa se ne deduce?

Fonde in un intervallo di temperature, quindi non è una sostanza pura: è un miscuglio. Infatti la paraffina è formata da molte sostanze diverse, idrocarburi con catene di atomi di carbonio di lunghezza diversa, ognuna con la sua temperatura di fusione.
```

Nella figura qui sotto scegli la sostanza da scaldare a bagnomaria: il termometro nella provetta segna la temperatura, il grafico si traccia nel tempo, e il disegno della provetta mostra quanto solido resta. Confronta la sosta del naftalene puro con l'intervallo del naftalene impuro e della paraffina.

```interattivo
% nome: fusione-sostanza-pura-miscuglio
% alt: Una provetta scaldata a bagnomaria accanto al grafico della sua temperatura nel tempo. Si sceglie la sostanza, naftalene puro, naftalene con qualche impurezza o paraffina, e un bottone avvia il riscaldamento: il solido nella provetta diventa liquido a poco a poco e il grafico si traccia. Il naftalene puro ha una sosta a 80 gradi, il naftalene impuro fonde tra 74 e 78 gradi, la paraffina tra 52 e 58 gradi, con la temperatura che sale lentamente durante la fusione. Sotto si leggono il tempo, la temperatura e la frazione di solido già fusa
```

```ad-note
Miscugli che si comportano come sostanze pure
Alcuni miscugli, con una composizione precisa, bollono o fondono a temperatura costante come una sostanza pura: si chiamano azeotropi quelli che bollono senza cambiare composizione (per esempio l'alcol al $96\%$ con l'acqua) ed eutettici quelli che fondono così (per esempio certe leghe per saldare). Sono eccezioni, e si riconoscono perché cambiando anche di poco la composizione la sosta sparisce.
```

## La curva di raffreddamento

Se si lascia raffreddare un liquido, la sua temperatura scende e la curva si legge al contrario: la sostanza pura ha una sosta termica mentre solidifica, e la temperatura di solidificazione è la stessa di fusione. Durante la sosta la sostanza cede all'ambiente il calore latente, e per questo la temperatura resta ferma anche se l'ambiente è più freddo.

```tikz
% nome: curve-raffreddamento-sopraffusione
% alt: Curva di raffreddamento di un liquido puro, temperatura in funzione del tempo. La curva scende, va un po' sotto la temperatura di fusione senza che il liquido solidifichi, poi risale di colpo fino alla temperatura di fusione, dove resta ferma per un tratto orizzontale, la solidificazione, e infine scende di nuovo. La piccola discesa sotto la temperatura di fusione è segnata come sopraffusione
% svg: curve-raffreddamento-sopraffusione-422c342d.svg 273x160
\begin{tikzpicture}
\draw[->] (0,0) -- (6.6,0) node[below left] {\small tempo};
\draw[->] (0,0) -- (0,3.2) node[above] {$t$};
\draw[dashed, thin] (0,1.5) -- (1.55,1.5);
\node[left] at (0,1.5) {\small $t_f$};
\draw[very thick, blue!70!black] (0.1,2.9) .. controls (0.6,2.2) and (1.1,1.6) .. (1.6,1.1) -- (1.75,1.5) -- (4.2,1.5) .. controls (4.7,1.0) and (5.4,0.55) .. (6.2,0.4);
\node[above] at (2.95,1.5) {\small solidificazione};
\draw[thin] (1.6,1.05) -- (2.3,0.6);
\node[right] at (2.3,0.6) {\small sopraffusione};
\node[right] at (0.5,2.6) {\small L};
\node[below] at (2.95,1.45) {\small L + S};
\node[above] at (5.3,0.85) {\small S};
\end{tikzpicture}
```

Spesso, prima della sosta, la temperatura scende un po' sotto quella di solidificazione senza che si formi solido: il liquido si trova in **sopraffusione**, uno stato instabile che dura finché non si forma il primo cristallo. Appena questo succede, la solidificazione parte in fretta, il calore latente ceduto riporta la temperatura alla temperatura di solidificazione, e da lì comincia la sosta. Gli scaldamani da tasca che si attivano piegando un dischetto di metallo contengono un liquido in sopraffusione: il dischetto fa nascere i primi cristalli, il liquido solidifica e cede il suo calore latente alle mani.

```ad-warning
La temperatura di solidificazione non è il punto più basso
In una curva con la sopraffusione, il punto più basso prima della sosta non è la temperatura di solidificazione: è solo il punto in cui è nato il primo cristallo, e cambia da una prova all'altra. La temperatura di solidificazione è quella della sosta, uguale alla temperatura di fusione.
```
