# Forze dipolo-dipolo e forze di London

A temperatura ambiente il cloro è un gas, il bromo un liquido e lo iodio un solido. Eppure sono tre sostanze molto simili: molecole di due atomi uguali, $\mathrm{Cl_2}$, $\mathrm{Br_2}$ e $\mathrm{I_2}$, tutte apolari. La differenza non sta nei legami dentro le molecole, ma nelle attrazioni tra una molecola e l'altra, che nello iodio sono abbastanza forti da tenere le molecole ferme in un cristallo e nel cloro non riescono nemmeno a tenerle vicine. Queste attrazioni sono le forze intermolecolari, e decidono se una sostanza fatta di molecole è solida, liquida o gassosa.

## Forze dentro la molecola e forze tra le molecole

In una sostanza molecolare ci sono due tipi di attrazione, e conviene tenerli separati fin dall'inizio.

- I legami covalenti tengono uniti gli atomi dentro una molecola: sono forze **intramolecolari**. Rompendoli la molecola non esiste più, e si ha una trasformazione chimica.
- Le **forze intermolecolari** sono le attrazioni tra molecole diverse, ognuna delle quali resta intera. Vincendole le molecole si allontanano, e si ha un passaggio di stato, che è una trasformazione fisica.

Le forze intermolecolari sono molto più deboli dei legami covalenti. Per il cloruro di idrogeno, $\mathrm{HCl}$, servono circa $16\,\text{kJ}$ per far passare una mole di liquido allo stato di vapore, cioè per allontanare le molecole l'una dall'altra, e $431\,\text{kJ}$ per rompere una mole di legami $\mathrm{H{-}Cl}$: quasi trenta volte di più. Per questo l'$\mathrm{HCl}$ bolle già a $-85\,^\circ\text{C}$, mentre le sue molecole restano intere anche a centinaia di gradi.

```ad-warning
Quando una sostanza bolle i legami covalenti restano
Nell'ebollizione e nella fusione di una sostanza molecolare si vincono le forze tra le molecole, non i legami dentro le molecole. Il vapore di bromo è fatto di molecole $\mathrm{Br_2}$ intere, come il bromo liquido.
```

Tutte le forze intermolecolari hanno la stessa origine: l'attrazione tra cariche elettriche di segno opposto. Cambia da dove vengono le cariche. In questa lezione ne incontri tre tipi, le forze dipolo-dipolo, le forze di London e le forze ione-dipolo; il quarto, il legame a idrogeno, ha una lezione sua: [Il legame a idrogeno](/materiale/scuola-superiore/chimica/forze-intermolecolari-e-stati-condensati/il-legame-a-idrogeno).

## Le forze dipolo-dipolo

Una molecola polare ha un lato con una carica parziale positiva, $\delta^+$, e un lato con una carica parziale negativa, $\delta^-$: è un dipolo, come spiega la lezione [Molecole polari e apolari](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/molecole-polari-e-apolari). Nel cloruro di idrogeno il cloro, più elettronegativo, è il lato $\delta^-$ e l'idrogeno il lato $\delta^+$.

Quando due molecole polari sono vicine, il lato $\delta^+$ di una attira il lato $\delta^-$ dell'altra. Le molecole tendono quindi a orientarsi in modo che le cariche opposte si trovino di fronte, testa contro coda oppure affiancate e capovolte. L'attrazione tra i poli opposti di due molecole polari si chiama **forza dipolo-dipolo**.

```tikz
% nome: forze-dipolo-dipolo-cloruro-idrogeno
% alt: Sei molecole di cloruro di idrogeno, con l'idrogeno parzialmente positivo e il cloro parzialmente negativo, su due file: in alto orientate testa contro coda, in basso capovolte. Linee tratteggiate uniscono il cloro di ogni molecola all'idrogeno delle vicine: sono le attrazioni dipolo-dipolo
\begin{tikzpicture}
\newcommand{\hcl}[3]{%
\begin{scope}[shift={(#1,#2)}, rotate=#3]
\draw[thick] (-0.32,0) -- (0.22,0);
\draw[thick, fill=blue!10] (-0.32,0) circle (0.2);
\draw[thick, fill=green!20] (0.22,0) circle (0.36);
\end{scope}}
\foreach \x in {0,2,4} {
\hcl{\x}{0}{0}
\node at (\x-0.32,0) {\scriptsize H};
\node at (\x+0.22,0) {\scriptsize Cl};
\hcl{\x-0.05}{-1.3}{180}
\node at (\x+0.27,-1.3) {\scriptsize H};
\node at (\x-0.27,-1.3) {\scriptsize Cl};
\draw[thick, dashed, gray] (\x-0.32,-0.24) -- (\x-0.29,-0.9);
\draw[thick, dashed, gray] (\x+0.23,-0.4) -- (\x+0.27,-1.06);
}
\foreach \x in {0,2} \draw[thick, dashed, gray] (\x+0.62,0) -- (\x+1.44,0);
\foreach \x in {0,2} \draw[thick, dashed, gray] (\x+0.51,-1.3) -- (\x+1.55,-1.3);
\node at (-0.32,0.5) {\small $\delta^+$};
\node at (0.25,0.62) {\small $\delta^-$};
\node[right] at (4.75,-0.65) {\small attrazione};
\node[right] at (4.75,-1.0) {\small dipolo-dipolo};
\end{tikzpicture}
```

In un liquido le molecole si muovono e ruotano di continuo, e l'ordine della figura non è mai perfetto. Le disposizioni in cui i poli opposti si affacciano sono però le più frequenti, e nel complesso le molecole si attraggono.

La forza dipolo-dipolo è tanto più intensa quanto più la molecola è polare, cioè quanto più grande è il suo momento dipolare $\mu$. Per vederne l'effetto si confrontano sostanze con molecole di dimensioni simili, una polare e una no. Il fluoro, $\mathrm{F_2}$, e il cloruro di idrogeno hanno tutti e due $18$ elettroni e quasi la stessa massa molare ($38{,}00$ e $36{,}46\,\text{g/mol}$), ma il fluoro, apolare, bolle a $-188\,^\circ\text{C}$ e l'$\mathrm{HCl}$, polare, a $-85\,^\circ\text{C}$: cento gradi più in alto.

## Le forze di London

Anche le sostanze fatte di molecole apolari, o di atomi singoli come i gas nobili, diventano liquide e poi solide se le si raffredda abbastanza: l'elio a $-269\,^\circ\text{C}$, l'azoto a $-196\,^\circ\text{C}$. Tra le loro particelle deve quindi esserci un'attrazione, anche se non hanno poli.

La spiegazione sta nel movimento degli elettroni. In un atomo di argon la nube elettronica è, in media, perfettamente simmetrica attorno al nucleo. Gli elettroni però si muovono, e in un certo istante possono trovarsi un po' di più da una parte: per quell'istante l'atomo ha un lato più negativo e un lato più positivo, ed è un **dipolo istantaneo**. Questo dipolo dura pochissimo, ma mentre c'è agisce sull'atomo vicino: il suo lato negativo respinge gli elettroni del vicino e li spinge dalla parte opposta, creando anche lì un dipolo, che si chiama **dipolo indotto**. I due dipoli hanno i poli opposti affacciati e si attraggono. Un istante dopo i dipoli sono cambiati, ma si riformano in continuazione, sempre accordati tra loro.

```tikz
% nome: forze-london-dipolo-istantaneo-indotto
% alt: Due atomi vicini in tre momenti. Nel primo le nubi elettroniche sono cerchi centrati sul nucleo. Nel secondo la nube dell'atomo di sinistra è spostata verso destra: l'atomo è un dipolo istantaneo, positivo a sinistra e negativo a destra. Nel terzo anche la nube dell'atomo di destra si è spostata, respinta: è un dipolo indotto, e una linea tratteggiata segna l'attrazione tra il lato negativo del primo e il lato positivo del secondo
\begin{tikzpicture}
% 1: nubi simmetriche
\draw[thick, fill=gray!20] (0,0) circle (0.6);
\draw[thick, fill=gray!20] (2.2,0) circle (0.6);
\fill (0,0) circle (1.5pt); \fill (2.2,0) circle (1.5pt);
\node[right] at (3.3,0) {\small nubi simmetriche};
% 2: dipolo istantaneo
\begin{scope}[shift={(0,-1.9)}]
\draw[thick, fill=gray!20] (0.16,0) ellipse (0.68 and 0.56);
\draw[thick, fill=gray!20] (2.2,0) circle (0.6);
\fill (0,0) circle (1.5pt); \fill (2.2,0) circle (1.5pt);
\node at (-0.3,0.82) {\small $\delta^+$};
\node at (0.62,0.82) {\small $\delta^-$};
\node[right] at (3.3,0) {\small dipolo istantaneo};
\end{scope}
% 3: dipolo indotto
\begin{scope}[shift={(0,-3.8)}]
\draw[thick, fill=gray!20] (0.16,0) ellipse (0.68 and 0.56);
\draw[thick, fill=gray!20] (2.36,0) ellipse (0.68 and 0.56);
\fill (0,0) circle (1.5pt); \fill (2.2,0) circle (1.5pt);
\node at (-0.3,0.82) {\small $\delta^+$};
\node at (0.62,0.82) {\small $\delta^-$};
\node at (1.9,0.82) {\small $\delta^+$};
\node at (2.82,0.82) {\small $\delta^-$};
\draw[thick, dashed, gray] (0.9,0) -- (1.62,0);
\node[right] at (3.3,0) {\small dipolo indotto};
\end{scope}
\end{tikzpicture}
```

L'attrazione tra un dipolo istantaneo e il dipolo che esso induce nella particella vicina si chiama **forza di London**, dal nome del fisico Fritz London, che la spiegò nel 1930; molti libri la chiamano anche forza di dispersione. Presa da sola è la più debole delle forze intermolecolari, ma ha una proprietà che le altre non hanno: agisce tra tutte le particelle, perché tutte hanno elettroni in movimento. C'è tra gli atomi dei gas nobili, tra le molecole apolari e anche tra le molecole polari, dove si somma alle forze dipolo-dipolo.

```ad-warning
Le forze di London non sono riservate alle molecole apolari
Nelle sostanze apolari le forze di London sono le sole forze intermolecolari. Nelle sostanze polari ci sono anche loro, insieme alle forze dipolo-dipolo, e spesso contano di più.
```

### La polarizzabilità

Quanto è intensa la forza di London dipende da quanto facilmente la nube elettronica si lascia deformare. Questa proprietà si chiama **polarizzabilità**. Una nube piccola, con pochi elettroni tenuti stretti dal nucleo, si deforma poco. Una nube grande, con molti elettroni lontani dal nucleo, si deforma con facilità, forma dipoli istantanei più grandi e dà forze di London più intense.

In pratica la polarizzabilità cresce con il numero di elettroni della particella, e quindi di solito con la massa molare. Lo si vede bene nei gas nobili e negli alogeni, che sono tutti apolari: scendendo lungo il gruppo gli elettroni aumentano e la temperatura di ebollizione sale.

| Sostanza | Elettroni | Massa molare ($\text{g/mol}$) | Temperatura di ebollizione ($^\circ\text{C}$) |
|---|---|---|---|
| $\mathrm{He}$ | $2$ | $4{,}00$ | $-269$ |
| $\mathrm{Ne}$ | $10$ | $20{,}18$ | $-246$ |
| $\mathrm{Ar}$ | $18$ | $39{,}95$ | $-186$ |
| $\mathrm{Kr}$ | $36$ | $83{,}80$ | $-153$ |
| $\mathrm{Xe}$ | $54$ | $131{,}29$ | $-108$ |
| $\mathrm{F_2}$ | $18$ | $38{,}00$ | $-188$ |
| $\mathrm{Cl_2}$ | $34$ | $70{,}90$ | $-34$ |
| $\mathrm{Br_2}$ | $70$ | $159{,}80$ | $59$ |
| $\mathrm{I_2}$ | $106$ | $253{,}80$ | $184$ |

Gli elettroni di una molecola si contano sommando i numeri atomici dei suoi atomi: il cloro ha $Z = 17$, e una molecola $\mathrm{Cl_2}$ ha $2 \cdot 17 = 34$ elettroni. I numeri atomici si leggono sulla [tavola periodica](/strumenti/tavola-periodica).

```tikz
% nome: forze-london-ebollizione-elettroni
% alt: Grafico della temperatura di ebollizione, da meno 280 a più 200 gradi Celsius, in funzione del numero di elettroni della particella, da 0 a 110. I gas nobili salgono da meno 269 gradi per l'elio, con 2 elettroni, a meno 108 per lo xeno, con 54. Gli alogeni salgono dal fluoro, 18 elettroni e meno 188 gradi, allo iodio, 106 elettroni e 184 gradi. Una linea tratteggiata orizzontale a 25 gradi, la temperatura ambiente, lascia sotto di sé i gas nobili, il fluoro e il cloro, e sopra il bromo e lo iodio
\begin{tikzpicture}[x=0.05cm, y=0.01cm]
\foreach \x in {20,40,60,80,100} \draw[gray!25, very thin] (\x,-280) -- (\x,200);
\foreach \y in {-200,-120,-40,40,120,200} \draw[gray!25, very thin] (0,\y) -- (110,\y);
\draw[->] (0,-280) -- (118,-280) node[right] {\small elettroni};
\draw[->] (0,-280) -- (0,225) node[above] {\small $t_{eb}$ ($^\circ$C)};
\foreach \x in {20,40,60,80,100} \draw (\x,-280) -- (\x,-288) node[below] {\small $\x$};
\foreach \y in {-280,-200,-120,-40,40,120,200} \draw (0,\y) -- (-1.6,\y) node[left] {\small $\y$};
\draw[thin, dashed] (0,25) -- (110,25);
\node[above right] at (0,25) {\small $25\,^\circ$C};
\draw[thick, gray] (2,-269) -- (10,-246) -- (18,-186) -- (36,-153) -- (54,-108);
\foreach \x/\y in {2/-269, 10/-246, 18/-186, 36/-153, 54/-108} \fill[gray] (\x,\y) circle (2pt);
\draw[thick, blue] (18,-188) -- (34,-34) -- (70,59) -- (106,184);
\foreach \x/\y in {18/-188, 34/-34, 70/59, 106/184} \fill[blue] (\x,\y) circle (2pt);
\node[above] at (4,-266) {\small He};
\node[below right] at (11,-248) {\small Ne};
\node[below right] at (18,-192) {\small Ar, $\mathrm{F_2}$};
\node[below right] at (36,-153) {\small Kr};
\node[right] at (55,-112) {\small Xe};
\node[right] at (35,-42) {\small $\mathrm{Cl_2}$};
\node[below right] at (70,59) {\small $\mathrm{Br_2}$};
\node[left] at (104,184) {\small $\mathrm{I_2}$};
\end{tikzpicture}
```

La linea tratteggiata è la temperatura ambiente: le sostanze che bollono sotto quella linea sono gas, e così si spiega la domanda dell'inizio. Il cloro ($34$ elettroni) bolle a $-34\,^\circ\text{C}$ ed è un gas; il bromo ($70$ elettroni) bolle a $59\,^\circ\text{C}$ ed è liquido; lo iodio ($106$ elettroni) ha forze di London così intense da essere solido, e fonde solo a $114\,^\circ\text{C}$.

Nella figura qui sotto scegli una famiglia di sostanze e poi una sostanza: vedi quanto è grande la nube elettronica delle sue particelle, a che temperatura bolle e in che stato si trova a $25\,^\circ\text{C}$.

```interattivo
% nome: forze-ebollizione-scegli-molecola
% alt: A sinistra due particelle della sostanza scelta, disegnate come nubi elettroniche tanto più grandi quanti più elettroni hanno, con i poli di un dipolo istantaneo. A destra una scala di temperature da meno 280 a 200 gradi Celsius con una tacca per ogni sostanza della famiglia, quella scelta in evidenza, e il segno dei 25 gradi. Si scelgono la famiglia (gas nobili, alogeni, alcani, i composti HCl, HBr e HI) e la sostanza; sotto si leggono elettroni, massa molare, temperatura di ebollizione e stato a 25 gradi
```

In tutte e quattro le famiglie la temperatura di ebollizione sale insieme al numero di elettroni. Negli alcani si passa dal metano, $\mathrm{CH_4}$, che con $10$ elettroni bolle a $-162\,^\circ\text{C}$, al pentano, $\mathrm{C_5H_{12}}$, che con $42$ elettroni bolle a $36\,^\circ\text{C}$ ed è il primo della serie a essere liquido a temperatura ambiente.

```ad-note
La massa è un indizio, la causa sono gli elettroni
Dire che "le molecole più pesanti bollono a temperature più alte" funziona quasi sempre, perché una molecola più pesante ha di solito più elettroni. La causa però non è il peso: la gravità tra due molecole è trascurabile. Conta la nube elettronica, più grande e più facile da deformare.
```

### La forma della molecola

Le forze di London agiscono solo a distanze molto piccole, quindi contano le zone in cui due molecole riescono a stare a contatto. Una molecola allungata tocca le vicine lungo tutta la sua lunghezza; una molecola compatta, quasi sferica, le tocca in una zona piccola. Il pentano e il 2,2-dimetilpropano hanno la stessa formula, $\mathrm{C_5H_{12}}$, e quindi gli stessi $42$ elettroni, ma nel pentano i cinque atomi di carbonio sono in fila, nel 2,2-dimetilpropano quattro carboni stanno attorno a uno centrale. Il primo bolle a $36\,^\circ\text{C}$, il secondo a $9{,}5\,^\circ\text{C}$.

```tikz
% nome: forze-london-forma-contatto
% alt: A sinistra due molecole allungate, disegnate come ovali lunghi e affiancati, che si toccano per tutta la lunghezza: è il pentano, che bolle a 36 gradi. A destra due molecole compatte, disegnate come cerchi, che si toccano in un punto solo: è il 2,2-dimetilpropano, che bolle a 9,5 gradi. La zona di contatto è segnata in arancione, lunga nel primo caso e corta nel secondo
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0.36) ellipse (1.3 and 0.34);
\draw[thick, fill=gray!20] (0,-0.36) ellipse (1.3 and 0.34);
\draw[very thick, orange!90!black] (-0.85,0) -- (0.85,0);
\node at (0,-1.65) {\small pentano, $36\,^\circ$C};
\begin{scope}[shift={(4.2,0)}]
\draw[thick, fill=gray!20] (0,0.62) circle (0.6);
\draw[thick, fill=gray!20] (0,-0.62) circle (0.6);
\draw[very thick, orange!90!black] (-0.17,0) -- (0.17,0);
\node at (0,-1.65) {\small 2,2-dimetilpropano, $9{,}5\,^\circ$C};
\end{scope}
\end{tikzpicture}
```

## Quale forza conta di più

Una molecola polare ha una forza in più, ma bolle più in alto di una apolare solo se le due hanno nubi elettroniche simili. Quando le dimensioni sono diverse, le forze di London possono pesare più delle forze dipolo-dipolo. Lo mostrano i tre composti dell'idrogeno con cloro, bromo e iodio.

| Sostanza | Differenza di elettronegatività | Elettroni | Temperatura di ebollizione ($^\circ\text{C}$) |
|---|---|---|---|
| $\mathrm{HCl}$ | $0{,}96$ | $18$ | $-85$ |
| $\mathrm{HBr}$ | $0{,}76$ | $36$ | $-67$ |
| $\mathrm{HI}$ | $0{,}46$ | $54$ | $-35$ |

Da $\mathrm{HCl}$ a $\mathrm{HI}$ la molecola diventa meno polare, perché la differenza di elettronegatività $\Delta\chi$ tra i due atomi diminuisce, e le forze dipolo-dipolo si indeboliscono. Se contassero solo quelle, la temperatura di ebollizione dovrebbe scendere. Invece sale, perché gli elettroni triplicano e le forze di London crescono più di quanto calino le altre.

Le forze dipolo-dipolo e le forze di London, prese insieme, si chiamano spesso **forze di van der Waals**.

```ad-warning
Polare non vuol dire "bolle più in alto"
Il confronto tra una sostanza polare e una apolare ha senso solo a parità di dimensioni. Il tetracloruro di carbonio, $\mathrm{CCl_4}$, è apolare ma ha $74$ elettroni e bolle a $77\,^\circ\text{C}$; il clorometano, $\mathrm{CH_3Cl}$, è polare ma ha $26$ elettroni e bolle a $-24\,^\circ\text{C}$.
```

## Le forze ione-dipolo

Il terzo tipo di forza non agisce tra due molecole, ma tra uno ione e una molecola polare. Uno ione positivo attira il lato $\delta^-$ delle molecole polari che ha intorno, uno ione negativo il lato $\delta^+$: questa attrazione è la **forza ione-dipolo**.

```tikz
% nome: forze-ione-dipolo-sodio-cloruro
% alt: A sinistra uno ione sodio, un cerchio con il segno più, e accanto una molecola d'acqua che gli rivolge l'ossigeno, con carica parziale negativa; i due idrogeni, con carica parziale positiva, puntano dalla parte opposta. A destra uno ione cloruro, un cerchio più grande con il segno meno, e accanto una molecola d'acqua che gli rivolge un idrogeno. In tutti e due i casi una linea tratteggiata segna l'attrazione ione-dipolo
\begin{tikzpicture}
% Na+ e acqua
\draw[thick, fill=violet!15] (0,0) circle (0.3);
\node at (0,0) {$+$};
\draw[thick] (1.25,0) -- ++(-52.25:0.5); \draw[thick] (1.25,0) -- ++(52.25:0.5);
\draw[thick, fill=blue!10] (1.25,0) ++(-52.25:0.5) circle (0.16);
\draw[thick, fill=blue!10] (1.25,0) ++(52.25:0.5) circle (0.16);
\draw[thick, fill=red!20] (1.25,0) circle (0.26);
\draw[thick, dashed, gray] (0.34,0) -- (0.95,0);
\node at (1.2,0.5) {\small $\delta^-$};
\node at (2.0,0.62) {\small $\delta^+$};
\node at (2.0,-0.62) {\small $\delta^+$};
\node at (0.8,-1.15) {\small $\mathrm{Na^+}$ e $\mathrm{H_2O}$};
% Cl- e acqua
\begin{scope}[shift={(4.2,0)}]
\draw[thick, fill=green!15] (0,0) circle (0.45);
\node at (0,0) {$-$};
\draw[thick] (1.6,0) -- (1.1,0); \draw[thick] (1.6,0) -- ++(75.5:0.5);
\draw[thick, fill=blue!10] (1.1,0) circle (0.16);
\draw[thick, fill=blue!10] (1.6,0) ++(75.5:0.5) circle (0.16);
\draw[thick, fill=red!20] (1.6,0) circle (0.26);
\draw[thick, dashed, gray] (0.49,0) -- (0.9,0);
\node at (1.05,-0.42) {\small $\delta^+$};
\node at (2.1,-0.1) {\small $\delta^-$};
\node at (1.0,-1.15) {\small $\mathrm{Cl^-}$ e $\mathrm{H_2O}$};
\end{scope}
\end{tikzpicture}
```

È la forza che scioglie il sale da cucina nell'acqua. Le molecole d'acqua circondano gli ioni $\mathrm{Na^+}$ rivolgendo loro l'ossigeno e gli ioni $\mathrm{Cl^-}$ rivolgendo loro gli idrogeni, e tutte insieme riescono a staccarli dal cristallo: è l'idratazione degli ioni, descritta nella lezione [L'acqua come solvente](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/l-acqua-come-solvente).

La forza ione-dipolo è più intensa della forza dipolo-dipolo, perché uno ione ha una carica intera e non una carica parziale. Cresce quando la carica dello ione è più grande e quando lo ione è più piccolo, perché la molecola polare gli arriva più vicino: uno ione $\mathrm{Mg^{2+}}$ trattiene le molecole d'acqua più di uno ione $\mathrm{Na^+}$.

```ad-warning
Ione-dipolo non è un legame ionico
Nel [legame ionico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-ionico) si attraggono due ioni, cioè due cariche intere. Nella forza ione-dipolo uno ione attira una molecola neutra, dal suo lato di carica opposta. La molecola resta intera e neutra.
```

## Riconoscere le forze e prevedere l'ebollizione

Per una sostanza fatta di molecole, o di atomi singoli come i gas nobili, si procede così.

1. Le forze di London ci sono sempre.
2. Se la molecola è polare ci sono anche le forze dipolo-dipolo. Se in più ha un idrogeno legato a fluoro, ossigeno o azoto forma legami a idrogeno, che sono l'argomento della prossima lezione.
3. Per confrontare due sostanze con un numero di elettroni simile, bolle a temperatura più alta quella polare.
4. Per confrontare due sostanze con un numero di elettroni molto diverso, bolle di solito a temperatura più alta quella che ne ha di più, se nessuna delle due forma legami a idrogeno.
5. A parità di formula, bolle a temperatura più alta la molecola più allungata.

Le forze ione-dipolo compaiono solo nei miscugli, quando un composto ionico è sciolto in un liquido polare.

```ad-example
Esempio 1: quali forze agiscono
Quali forze intermolecolari agiscono tra le molecole di ciascuna sostanza: metano $\mathrm{CH_4}$, diossido di carbonio $\mathrm{CO_2}$, diossido di zolfo $\mathrm{SO_2}$, bromuro di idrogeno $\mathrm{HBr}$?

Il metano è tetraedrico con quattro legami uguali, il diossido di carbonio è lineare con due legami uguali: tutte e due le molecole sono apolari, e tra loro agiscono solo forze di London.

Il diossido di zolfo ha la molecola piegata, come mostra la lezione sulla [geometria delle molecole](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/la-geometria-delle-molecole), e i suoi due legami polari non si compensano: è polare. Il bromuro di idrogeno ha un solo legame, polare ($\Delta\chi = 2{,}96 - 2{,}20 = 0{,}76$). Tra le molecole di $\mathrm{SO_2}$ e tra quelle di $\mathrm{HBr}$ agiscono forze di London e forze dipolo-dipolo.
```

```ad-example
Esempio 2: ordinare tre gas nobili
Metti in ordine di temperatura di ebollizione crescente neon, kripton e argon, senza guardare la tabella.

Sono atomi singoli e apolari: tra loro ci sono solo forze di London, che crescono con il numero di elettroni. In un atomo neutro gli elettroni sono tanti quanti i protoni, cioè $Z$: il neon ne ha $10$, l'argon $18$, il kripton $36$.

L'ordine è neon, argon, kripton, come confermano i valori della tabella.
```

```ad-example
Esempio 3: stessi elettroni, polarità diversa
Il bromo, $\mathrm{Br_2}$, e il cloruro di iodio, $\mathrm{ICl}$, hanno quasi la stessa massa molare. Quale dei due bolle a temperatura più alta?

Si contano gli elettroni: $\mathrm{Br_2}$ ne ha $2 \cdot 35 = 70$, $\mathrm{ICl}$ ne ha $53 + 17 = 70$. Le nubi elettroniche hanno le stesse dimensioni, e le forze di London sono simili.

La molecola $\mathrm{Br_2}$ è apolare, perché i due atomi sono uguali. Nella molecola $\mathrm{ICl}$ il cloro è più elettronegativo dello iodio, $\Delta\chi = 3{,}16 - 2{,}66 = 0{,}50$: il legame è polare e la molecola, che ha un legame solo, è polare. Tra le molecole di $\mathrm{ICl}$ ci sono anche forze dipolo-dipolo.

Bolle più in alto il cloruro di iodio: a $97\,^\circ\text{C}$, contro i $59\,^\circ\text{C}$ del bromo.
```

```ad-example
Esempio 4: quando vince London
Il triclorometano, $\mathrm{CHCl_3}$, è polare; il tetracloruro di carbonio, $\mathrm{CCl_4}$, è apolare. Quale ti aspetti che bolla a temperatura più alta?

Qui le dimensioni non sono simili, e bisogna contare gli elettroni prima di guardare la polarità:

$$\mathrm{CHCl_3}: \ 6 + 1 + 3 \cdot 17 = 58 \qquad \mathrm{CCl_4}: \ 6 + 4 \cdot 17 = 74$$

Il tetracloruro di carbonio ha $16$ elettroni in più, e forze di London più intense; il triclorometano ha in più le forze dipolo-dipolo. I due effetti vanno in versi opposti, e la regola da sola non decide: serve il dato sperimentale. Il $\mathrm{CCl_4}$ bolle a $77\,^\circ\text{C}$ e il $\mathrm{CHCl_3}$ a $61\,^\circ\text{C}$: prevalgono le forze di London.
```

## Le tre forze a confronto

| Forza | Tra quali particelle | Da che cosa dipende | Esempio |
|---|---|---|---|
| London | tutte: atomi, molecole apolari e polari | polarizzabilità (numero di elettroni, forma) | $\mathrm{Ar}$, $\mathrm{I_2}$, $\mathrm{CH_4}$ |
| Dipolo-dipolo | molecole polari | momento dipolare $\mu$ | $\mathrm{HCl}$, $\mathrm{SO_2}$ |
| Ione-dipolo | uno ione e una molecola polare | carica e dimensione dello ione, momento dipolare | $\mathrm{Na^+}$ in acqua |

Tutte e tre si fanno sentire solo quando le particelle sono vicine: per questo contano nei liquidi e nei solidi, e quasi per niente nei gas. Come le forze intermolecolari determinano le proprietà dei liquidi e dei solidi è l'argomento delle lezioni [Lo stato liquido e la tensione di vapore](/materiale/scuola-superiore/chimica/forze-intermolecolari-e-stati-condensati/lo-stato-liquido-e-la-tensione-di-vapore) e [I solidi: ionici, molecolari, covalenti e metallici](/materiale/scuola-superiore/chimica/forze-intermolecolari-e-stati-condensati/i-solidi-ionici-molecolari-covalenti-e-metallici).
