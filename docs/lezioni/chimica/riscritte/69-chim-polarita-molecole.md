# Molecole polari e apolari

L'acqua scioglie il sale e lo zucchero ma non l'olio; un filo d'acqua che scende dal rubinetto si piega se gli avvicini un palloncino strofinato, un filo di benzina no. Dietro questi fatti c'è la stessa proprietà: le molecole d'acqua hanno un lato un po' positivo e un lato un po' negativo, quelle dell'olio e della benzina no. Per sapere se una molecola è fatta così servono due cose che conosci già, la polarità dei suoi legami e la sua forma, messe insieme con una somma di vettori.

## Il dipolo di un legame

Nel [legame covalente polare](/materiale/scuola-superiore/chimica/i-legami-chimici/legame-covalente-polare-e-legame-dativo) i due atomi hanno [elettronegatività](/materiale/scuola-superiore/chimica/il-sistema-periodico/affinita-elettronica-ed-elettronegativita) diversa: gli elettroni di legame stanno più vicini all'atomo più elettronegativo, che prende una carica parziale $\delta^-$, mentre l'altro prende una carica parziale $\delta^+$. Due cariche uguali e opposte, tenute a una certa distanza, formano un **dipolo**.

Quanto è forte un dipolo lo dice il **momento dipolare** $\mu$, il prodotto della carica parziale $\delta$ per la distanza $d$ tra le due cariche:

$$\mu = \delta \cdot d$$

Per le molecole si misura in debye, simbolo $\text{D}$: $1\,\text{D} = 3{,}34 \cdot 10^{-30}\,\text{C}\cdot\text{m}$.

Il momento dipolare è un vettore: oltre al valore ha una direzione, quella del legame, e un verso. In chimica si disegna con una freccia che parte dall'atomo $\delta^+$ e punta verso l'atomo $\delta^-$, cioè verso l'atomo più elettronegativo, con una piccola croce sulla coda, dalla parte di $\delta^+$.

```tikz
% nome: polarita-dipolo-legame-hcl
% alt: La molecola di cloruro di idrogeno: un cerchio piccolo per l'idrogeno a sinistra, con scritto sotto delta più, e un cerchio grande per il cloro a destra, con scritto sotto delta meno, uniti da un trattino. Sopra la molecola una freccia blu con una piccola croce sulla coda, il momento dipolare, parte dall'idrogeno e punta verso il cloro
% svg: polarita-dipolo-legame-hcl-d109d5c9.svg 99x104
\begin{tikzpicture}
\draw[thick] (0,0) -- (1.7,0);
\draw[thick, fill=blue!10] (0,0) circle (0.3);
\draw[thick, fill=green!20] (1.7,0) circle (0.5);
\node at (0,0) {H};
\node at (1.7,0) {Cl};
\node at (0,-0.7) {$\delta^+$};
\node at (1.7,-0.9) {$\delta^-$};
\draw[-{Stealth}, thick, blue] (0,0.9) -- (1.7,0.9);
\draw[thick, blue] (0.15,0.8) -- (0.15,1);
\node at (0.85,1.25) {$\vec{\mu}$};
\end{tikzpicture}
```

Nel cloruro di idrogeno, $\mathrm{HCl}$, il cloro ha elettronegatività $3{,}16$ e l'idrogeno $2{,}20$: la freccia punta verso il cloro. Più grande è la differenza di elettronegatività $\Delta\chi$, più carica si sposta e più grande è il momento dipolare, come si vede nei composti dell'idrogeno con gli alogeni (le elettronegatività sono quelle della [tavola periodica](/strumenti/tavola-periodica)):

| Molecola | $\Delta\chi$ | $\mu$ |
|---|---|---|
| $\mathrm{HF}$ | $1{,}78$ | $1{,}82\,\text{D}$ |
| $\mathrm{HCl}$ | $0{,}96$ | $1{,}08\,\text{D}$ |
| $\mathrm{HBr}$ | $0{,}76$ | $0{,}82\,\text{D}$ |
| $\mathrm{HI}$ | $0{,}46$ | $0{,}44\,\text{D}$ |

Una molecola fatta di due atomi uguali, come $\mathrm{H_2}$, $\mathrm{Cl_2}$ o $\mathrm{N_2}$, ha $\Delta\chi = 0$: nessuna carica si sposta e il momento dipolare è zero.

```ad-example
Esempio 1: quanto è parziale una carica parziale
Nella molecola di $\mathrm{HCl}$ il momento dipolare vale $1{,}08\,\text{D}$ e i due nuclei distano $127\,\text{pm}$. Quanto vale la carica parziale $\delta$?

Si portano i dati nelle unità del Sistema Internazionale:
$$\mu = 1{,}08 \cdot 3{,}34 \cdot 10^{-30}\,\text{C}\cdot\text{m} = 3{,}61 \cdot 10^{-30}\,\text{C}\cdot\text{m} \qquad d = 127\,\text{pm} = 1{,}27 \cdot 10^{-10}\,\text{m}$$
Dalla definizione $\mu = \delta \cdot d$:
$$\delta = \frac{\mu}{d} = \frac{3{,}61 \cdot 10^{-30}\,\text{C}\cdot\text{m}}{1{,}27 \cdot 10^{-10}\,\text{m}} = 2{,}84 \cdot 10^{-20}\,\text{C}$$
La carica di un elettrone è $1{,}60 \cdot 10^{-19}\,\text{C}$: la carica parziale è circa il $18\%$ di quella di un elettrone.
```

## Il momento dipolare di una molecola

Una molecola con più di due atomi ha più legami, e ogni legame polare ha il suo dipolo. Il **momento dipolare della molecola** è la somma vettoriale dei momenti dei suoi legami: le frecce si sommano come si sommano le forze in fisica, con la regola del parallelogramma o mettendole una in coda all'altra (lezione [Somma e differenza di vettori](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori)).

Una molecola è **polare** se questa somma è diversa da zero, **apolare** se è zero. Poiché le frecce hanno la direzione dei legami, per sommarle bisogna sapere come sono disposti i legami nello spazio: serve la geometria della molecola, che si trova con la [teoria VSEPR](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/la-geometria-delle-molecole).

Il diossido di carbonio e l'acqua hanno tutti e due un atomo centrale legato a due atomi uguali, con legami polari. Nel $\mathrm{CO_2}$ le frecce puntano verso gli ossigeni, più elettronegativi del carbonio; nell'acqua puntano verso l'ossigeno, che sta al centro.

```tikz
% nome: polarita-somma-co2-acqua
% alt: A sinistra il diossido di carbonio, lineare: due frecce blu uguali partono dal carbonio e puntano verso i due ossigeni, in versi opposti; sotto è scritto somma zero, apolare. A destra l'acqua, piegata, con l'ossigeno in alto: due frecce blu puntano dagli idrogeni verso l'ossigeno, e una freccia arancione verticale, la loro somma, punta verso l'alto; sotto è scritto polare
% svg: polarita-somma-co2-acqua-198e10b9.svg 293x137
\begin{tikzpicture}
% diossido di carbonio
\draw[thick] (-1.3,0.05) -- (1.3,0.05);
\draw[thick] (-1.3,-0.05) -- (1.3,-0.05);
\draw[thick, fill=red!20] (-1.3,0) circle (0.42);
\draw[thick, fill=gray!20] (0,0) circle (0.4);
\draw[thick, fill=red!20] (1.3,0) circle (0.42);
\node at (-1.3,0) {O};
\node at (0,0) {C};
\node at (1.3,0) {O};
\draw[-{Stealth}, thick, blue] (-0.15,0.75) -- (-1.3,0.75);
\draw[thick, blue] (-0.3,0.65) -- (-0.3,0.85);
\draw[-{Stealth}, thick, blue] (0.15,0.75) -- (1.3,0.75);
\draw[thick, blue] (0.3,0.65) -- (0.3,0.85);
\node at (0,-0.95) {\small somma zero};
\node at (0,-1.4) {\small apolare};
% acqua
\begin{scope}[shift={(4.6,0.15)}]
\draw[thick] (0,0) -- (-0.95,-0.73);
\draw[thick] (0,0) -- (0.95,-0.73);
\draw[thick, fill=red!20] (0,0) circle (0.45);
\draw[thick, fill=blue!10] (-0.95,-0.73) circle (0.3);
\draw[thick, fill=blue!10] (0.95,-0.73) circle (0.3);
\node at (0,0) {O};
\node at (-0.95,-0.73) {H};
\node at (0.95,-0.73) {H};
\draw[-{Stealth}, thick, blue] (-1.3,-0.2) -- (-0.6,0.34);
\draw[thick, blue] (-1.12,-0.187) -- (-1.242,-0.029);
\draw[-{Stealth}, thick, blue] (1.3,-0.2) -- (0.6,0.34);
\draw[thick, blue] (1.12,-0.187) -- (1.242,-0.029);
\draw[-{Stealth}, thick, orange!90!black] (0,0.65) -- (0,1.73);
\draw[thick, orange!90!black] (-0.1,0.8) -- (0.1,0.8);
\node at (0.4,1.3) {$\vec{\mu}$};
\node at (0,-1.55) {\small polare};
\end{scope}
\end{tikzpicture}
```

Nel $\mathrm{CO_2}$, lineare, le due frecce sono uguali e opposte: la somma è zero e la molecola è apolare, anche se i legami sono polari. Nell'acqua, che è piegata, le due frecce formano un angolo di $104{,}5^\circ$: le loro parti orizzontali si annullano, ma quelle verticali puntano dalla stessa parte e si sommano. L'acqua è polare, con il polo negativo sull'ossigeno e quello positivo dalla parte degli idrogeni.

Quando i due dipoli di legame sono uguali, di valore $\mu_{leg}$, e formano tra loro un angolo $\theta$, la somma sta sulla bisettrice dell'angolo. Ogni freccia contribuisce con la sua parte lungo la bisettrice, $\mu_{leg}\cos\frac{\theta}{2}$ (il coseno è quello della lezione [Seno, coseno e tangente nel triangolo rettangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/seno-coseno-e-tangente-nel-triangolo-rettangolo)), e le parti perpendicolari si annullano:

$$\mu = 2\,\mu_{leg}\cos\frac{\theta}{2}$$

Con $\theta = 180^\circ$ il coseno di $90^\circ$ è zero e la somma è nulla, come nel $\mathrm{CO_2}$.

Nella figura qui sotto puoi piegare tu la molecola: scegli $\mathrm{CO_2}$, $\mathrm{SO_2}$ o $\mathrm{H_2O}$ e poi cambia l'angolo tra i due legami con il cursore.

```interattivo
% nome: polarita-somma-dipoli
% alt: Una molecola con un atomo centrale e due atomi uguali, da scegliere tra diossido di carbonio, diossido di zolfo e acqua. Un cursore cambia l'angolo tra i legami da 180 a 90 gradi. Su ogni legame una freccia blu, il dipolo, punta verso l'atomo più elettronegativo; accanto, le due frecce sono sommate con il parallelogramma e una freccia arancione ne è la somma. Sotto si leggono l'angolo, il rapporto tra il dipolo della molecola e quello di un legame, e polare o apolare
```

A $180^\circ$ la freccia arancione sparisce; appena la molecola si piega compare, e cresce man mano che l'angolo si stringe. A $120^\circ$ è lunga quanto una delle frecce blu, perché $2\cos 60^\circ = 1$. Il $\mathrm{CO_2}$ piegato sarebbe polare: è la forma, e non il tipo di legami, a renderlo apolare.

```ad-example
Esempio 2: il dipolo del legame O–H
Il momento dipolare dell'acqua, misurato, è $1{,}85\,\text{D}$, e l'angolo tra i due legami è $104{,}5^\circ$. Quanto vale il dipolo di un singolo legame O–H?

Dalla formula della somma si ricava $\mu_{leg}$:
$$\mu_{leg} = \frac{\mu}{2\cos\frac{\theta}{2}} = \frac{1{,}85\,\text{D}}{2\cos 52{,}25^\circ} = \frac{1{,}85\,\text{D}}{2 \cdot 0{,}612} = 1{,}51\,\text{D}$$
I due legami insieme danno $1{,}85\,\text{D}$ e non $2 \cdot 1{,}51 = 3{,}02\,\text{D}$.
```

```ad-warning
Sommare i dipoli come numeri
I momenti dipolari sono vettori, non numeri: due legami da $1{,}51\,\text{D}$ non danno una molecola da $3{,}02\,\text{D}$. A seconda dell'angolo la somma va da zero (frecce opposte) al doppio (frecce parallele, che in una molecola non capita).
```

## Le geometrie simmetriche

Quando l'atomo centrale è legato ad atomi tutti uguali e non ha coppie solitarie, i dipoli di legame sono uguali e disposti in modo simmetrico, e la loro somma è zero. Succede in tutte e tre le geometrie senza coppie solitarie: lineare, triangolare planare e tetraedrica. Quando l'atomo centrale ha coppie solitarie la molecola è piegata o piramidale, gli atomi stanno tutti da una parte e i dipoli si sommano.

```tikz
% nome: polarita-geometrie-somma
% alt: Cinque molecole schematiche con un atomo centrale A e atomi X uguali; su ogni legame una freccia blu punta da A verso X. In alto le geometrie lineare, triangolare planare e tetraedrica, con scritto somma zero. In basso le geometrie piegata e piramidale triangolare, con le coppie solitarie segnate da puntini sull'atomo centrale: le frecce blu puntano tutte verso il basso e una freccia arancione ne mostra la somma, non nulla
% svg: polarita-geometrie-somma-a055640a.svg 375x274
\begin{tikzpicture}
% lineare
\begin{scope}[shift={(0,0)}]
\draw[-{Stealth}, thick, blue] (0.3,0) -- (0.95,0);
\draw[thick, blue] (0.45,-0.1) -- (0.45,0.1);
\draw[-{Stealth}, thick, blue] (-0.3,0) -- (-0.95,0);
\draw[thick, blue] (-0.45,-0.1) -- (-0.45,0.1);
\draw[thick, fill=gray!20] (0,0) circle (0.3);
\draw[thick, fill=green!20] (1.2,0) circle (0.25);
\draw[thick, fill=green!20] (-1.2,0) circle (0.25);
\node at (0,0) {\small A};
\node at (1.2,0) {\small X};
\node at (-1.2,0) {\small X};
\node at (0,-1.45) {\small lineare};
\node at (0,-1.9) {\small somma zero};
\end{scope}
% triangolare planare
\begin{scope}[shift={(3.5,0)}]
\foreach \a in {90,210,330} {
  \draw[-{Stealth}, thick, blue] (\a:0.3) -- (\a:0.95);
  \draw[thick, blue] ($(\a:0.45)+(\a+90:0.1)$) -- ($(\a:0.45)+(\a-90:0.1)$);
  \draw[thick, fill=green!20] (\a:1.2) circle (0.25);
  \node at (\a:1.2) {\small X};
}
\draw[thick, fill=gray!20] (0,0) circle (0.3);
\node at (0,0) {\small A};
\node at (0,-1.45) {\small triangolare planare};
\node at (0,-1.9) {\small somma zero};
\end{scope}
% tetraedrica
\begin{scope}[shift={(7,0)}]
\foreach \a/\r in {90/1.2,205/1.2,335/1.2,270/0.95} {
  \draw[-{Stealth}, thick, blue] (\a:0.3) -- (\a:\r-0.25);
  \draw[thick, blue] ($(\a:0.45)+(\a+90:0.1)$) -- ($(\a:0.45)+(\a-90:0.1)$);
  \draw[thick, fill=green!20] (\a:\r) circle (0.25);
  \node at (\a:\r) {\small X};
}
\draw[thick, fill=gray!20] (0,0) circle (0.3);
\node at (0,0) {\small A};
\node at (0,-1.45) {\small tetraedrica};
\node at (0,-1.9) {\small somma zero};
\end{scope}
% piegata
\begin{scope}[shift={(1.75,-3.4)}]
\foreach \a in {218,322} {
  \draw[-{Stealth}, thick, blue] (\a:0.3) -- (\a:0.95);
  \draw[thick, blue] ($(\a:0.45)+(\a+90:0.1)$) -- ($(\a:0.45)+(\a-90:0.1)$);
  \draw[thick, fill=green!20] (\a:1.2) circle (0.25);
  \node at (\a:1.2) {\small X};
}
\draw[thick, fill=gray!20] (0,0) circle (0.3);
\node at (0,0) {\small A};
\fill (-0.28,0.4) circle (1.2pt); \fill (-0.16,0.47) circle (1.2pt);
\fill (0.28,0.4) circle (1.2pt); \fill (0.16,0.47) circle (1.2pt);
\draw[-{Stealth}, thick, orange!90!black] (0,-0.45) -- (0,-1.25);
\draw[thick, orange!90!black] (-0.1,-0.6) -- (0.1,-0.6);
\node at (0,-1.6) {\small piegata};
\node at (0,-2.05) {\small somma non nulla};
\end{scope}
% piramidale triangolare
\begin{scope}[shift={(5.25,-3.4)}]
\foreach \a/\r in {205/1.2,335/1.2,283/0.95} {
  \draw[-{Stealth}, thick, blue] (\a:0.3) -- (\a:\r-0.25);
  \draw[thick, blue] ($(\a:0.45)+(\a+90:0.1)$) -- ($(\a:0.45)+(\a-90:0.1)$);
  \draw[thick, fill=green!20] (\a:\r) circle (0.25);
  \node at (\a:\r) {\small X};
}
\draw[thick, fill=gray!20] (0,0) circle (0.3);
\node at (0,0) {\small A};
\fill (-0.07,0.45) circle (1.2pt); \fill (0.07,0.45) circle (1.2pt);
\draw[-{Stealth}, thick, orange!90!black] (-0.42,-0.4) -- (-0.42,-1.2);
\draw[thick, orange!90!black] (-0.52,-0.55) -- (-0.32,-0.55);
\node at (0,-1.6) {\small piramidale triangolare};
\node at (0,-2.05) {\small somma non nulla};
\end{scope}
\end{tikzpicture}
```

Nella figura gli atomi X sono più elettronegativi di A e le frecce puntano verso l'esterno. Se è l'atomo centrale il più elettronegativo, come l'ossigeno dell'acqua o l'azoto dell'ammoniaca, tutte le frecce cambiano verso insieme e il risultato è lo stesso: zero nelle geometrie simmetriche, diverso da zero nelle altre.

Nella geometria triangolare planare la somma di due frecce a $120^\circ$ è una freccia della stessa lunghezza diretta lungo la bisettrice, e la terza freccia è proprio uguale e opposta a questa. Nella geometria tetraedrica vale lo stesso ragionamento con una freccia in più: la somma di tre frecce è uguale e opposta alla quarta.

| Geometria | Coppie solitarie sul centro | Atomi legati tutti uguali | Esempi |
|---|---|---|---|
| lineare | $0$ | apolare | $\mathrm{CO_2}$ |
| triangolare planare | $0$ | apolare | $\mathrm{BF_3}$, $\mathrm{SO_3}$ |
| tetraedrica | $0$ | apolare | $\mathrm{CH_4}$, $\mathrm{CCl_4}$ |
| piegata | $1$ o $2$ | polare | $\mathrm{SO_2}$, $\mathrm{H_2O}$ |
| piramidale triangolare | $1$ | polare | $\mathrm{NH_3}$ |

```ad-example
Esempio 3: triossido e diossido di zolfo
Il triossido di zolfo, $\mathrm{SO_3}$, e il diossido di zolfo, $\mathrm{SO_2}$, hanno gli stessi legami polari tra zolfo e ossigeno ($\Delta\chi = 3{,}44 - 2{,}58 = 0{,}86$). Quale dei due è polare?

Nell'$\mathrm{SO_3}$ lo zolfo è legato a tre ossigeni e non ha coppie solitarie: la geometria è triangolare planare, i tre dipoli sono uguali e a $120^\circ$ l'uno dall'altro, la somma è zero. La molecola è apolare.

Nell'$\mathrm{SO_2}$ lo zolfo è legato a due ossigeni e ha una coppia solitaria: la geometria è piegata, con un angolo di circa $119^\circ$, e i due dipoli non si annullano. La molecola è polare, e il suo momento dipolare misurato è $1{,}63\,\text{D}$.
```

```ad-warning
"Ha legami polari, quindi è polare"
I legami polari sono necessari, ma non bastano. $\mathrm{CO_2}$, $\mathrm{BF_3}$, $\mathrm{SO_3}$ e $\mathrm{CCl_4}$ hanno tutti legami polari e sono tutti apolari, perché la loro forma è simmetrica. La domanda giusta non è se i legami sono polari, ma se le frecce si annullano.
```

```ad-warning
Dimenticare le coppie solitarie
Chi disegna l'acqua in linea retta, H–O–H, conclude che è apolare come il $\mathrm{CO_2}$; chi disegna l'ammoniaca piatta la crede apolare come il $\mathrm{BF_3}$. Le coppie solitarie dell'atomo centrale piegano la molecola: prima di sommare le frecce va trovata la geometria vera, contando i domini.
```

## Quando gli atomi legati sono diversi

Una geometria simmetrica dà somma zero solo se le frecce sono tutte uguali. Se intorno all'atomo centrale ci sono atomi diversi, i dipoli di legame hanno valori diversi e di solito non si annullano più, anche in una molecola lineare o tetraedrica.

Il caso più chiaro è la serie che va dal metano al tetraclorometano, sostituendo un idrogeno alla volta con un cloro. Il legame C–H è quasi apolare ($\Delta\chi = 2{,}55 - 2{,}20 = 0{,}35$, sotto la soglia di $0{,}4$) e il suo dipolo si trascura; il legame C–Cl è polare ($\Delta\chi = 3{,}16 - 2{,}55 = 0{,}61$), con la freccia verso il cloro.

| Molecola | Nome | Legami C–Cl | $\mu$ misurato |
|---|---|---|---|
| $\mathrm{CH_4}$ | metano | $0$ | $0$ |
| $\mathrm{CH_3Cl}$ | clorometano | $1$ | $1{,}87\,\text{D}$ |
| $\mathrm{CH_2Cl_2}$ | diclorometano | $2$ | $1{,}60\,\text{D}$ |
| $\mathrm{CHCl_3}$ | triclorometano (cloroformio) | $3$ | $1{,}04\,\text{D}$ |
| $\mathrm{CCl_4}$ | tetraclorometano | $4$ | $0$ |

Le cinque molecole sono tutte tetraedriche. Agli estremi della serie i quattro atomi legati al carbonio sono uguali e la molecola è apolare; in mezzo la simmetria è rotta e la molecola è polare. Con la figura puoi sostituire tu gli atomi, uno alla volta.

```interattivo
% nome: polarita-sostituisci-atomi
% alt: Una molecola tetraedrica con il carbonio al centro, in prospettiva. Ogni atomo legato si cambia con un clic da idrogeno a cloro e viceversa, e cinque bottoni scelgono le molecole da metano a tetraclorometano. Su ogni legame carbonio-cloro una freccia blu punta verso il cloro; una freccia arancione dal carbonio mostra la somma dei dipoli, e manca quando è zero. Sotto si leggono formula, polare o apolare e momento dipolare misurato
```

Con un solo cloro la freccia arancione coincide con quella del legame C–Cl. Con due cloro punta a metà strada tra i due; con tre punta dalla parte opposta all'idrogeno rimasto, ed è lunga quanto una sola freccia blu, perché tre frecce di un tetraedro valgono quanto la quarta cambiata di verso. Con quattro sparisce.

```ad-warning
Il disegno piatto del diclorometano
Sul foglio il $\mathrm{CH_2Cl_2}$ si può disegnare con i due cloro da parti opposte del carbonio, e allora sembra che le due frecce si annullino. Nel tetraedro due posizioni opposte non esistono: due legami qualunque formano sempre un angolo di circa $109{,}5^\circ$. Il diclorometano è polare comunque lo si disegni.
```

I valori misurati non crescono con il numero di cloro, e il modello delle frecce uguali prevede lo stesso momento per $\mathrm{CH_3Cl}$ e $\mathrm{CHCl_3}$, che invece ne hanno di diversi. Sommare i dipoli di legame dice bene se una molecola è polare e da che parte punta il suo dipolo; per il valore esatto servono le misure, perché anche i legami C–H contano un poco e i legami vicini si influenzano.

```ad-example
Esempio 4: diossido di carbonio e cianuro di idrogeno
Il $\mathrm{CO_2}$ e il cianuro di idrogeno, $\mathrm{HCN}$, sono tutti e due lineari. Sono tutti e due apolari?

Nel $\mathrm{CO_2}$ i due legami sono uguali e opposti: apolare.

Nell'$\mathrm{HCN}$ il carbonio è legato da una parte a un idrogeno e dall'altra a un azoto. Il legame C–H è quasi apolare; il legame tra carbonio e azoto è polare ($\Delta\chi = 3{,}04 - 2{,}55 = 0{,}49$), con la freccia verso l'azoto, e dall'altra parte non c'è niente che la compensi. La molecola è polare: il suo momento dipolare misurato è $2{,}98\,\text{D}$, più grande di quello dell'acqua.
```

## Come si decide se una molecola è polare

1. Scrivi la [formula di Lewis](/materiale/scuola-superiore/chimica/i-legami-chimici/le-formule-di-lewis-delle-molecole) e trova la geometria con la VSEPR, contando anche le coppie solitarie dell'atomo centrale.
2. Guarda la differenza di elettronegatività di ogni legame: se nessun legame è polare, la molecola è apolare e hai finito.
3. Disegna una freccia su ogni legame polare, verso l'atomo più elettronegativo.
4. Somma le frecce. Se gli atomi legati sono tutti uguali e la geometria è lineare, triangolare planare o tetraedrica, la somma è zero e la molecola è apolare; negli altri casi di solito è polare.

```ad-example
Esempio 5: tre molecole con il fluoro
Sono polari il trifluoruro di boro $\mathrm{BF_3}$, il trifluoruro di azoto $\mathrm{NF_3}$ e il tetrafluorometano $\mathrm{CF_4}$?

Tutti e tre hanno legami polari con il fluoro, l'elemento più elettronegativo.

$\mathrm{BF_3}$: il boro ha $3$ elettroni di valenza, tutti nei legami, e nessuna coppia solitaria. Triangolare planare con tre atomi uguali: apolare.

$\mathrm{NF_3}$: l'azoto ha $5$ elettroni di valenza, $3$ nei legami e una coppia solitaria. Piramidale triangolare: i tre dipoli puntano tutti dalla parte dei fluori e non si annullano. Polare.

$\mathrm{CF_4}$: il carbonio ha $4$ elettroni di valenza, tutti nei legami. Tetraedrica con quattro atomi uguali: apolare.
```

Il passo 2 sistema subito gli idrocarburi: il metano, la benzina e gli oli sono fatti quasi solo di carbonio e idrogeno, i loro legami C–C e C–H sono apolari o quasi, e le molecole sono apolari qualunque forma abbiano.

## Che cosa cambia se una molecola è polare

### La solubilità

Le molecole polari si attirano tra loro, il polo positivo di una verso il polo negativo dell'altra. Per questo una sostanza polare si mescola bene con un'altra sostanza polare, mentre una sostanza apolare in un liquido polare resta fuori: le molecole polari si attirano tra loro più di quanto attirino le sue. La regola pratica, dalla lezione [L'acqua come solvente](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/l-acqua-come-solvente), è che il simile scioglie il simile.

| Sostanza | Molecola | In acqua (polare) | In esano (apolare) |
|---|---|---|---|
| ammoniaca $\mathrm{NH_3}$ | polare | molto solubile | poco solubile |
| cloruro di idrogeno $\mathrm{HCl}$ | polare | molto solubile | poco solubile |
| iodio $\mathrm{I_2}$ | apolare | pochissimo solubile | solubile |
| metano $\mathrm{CH_4}$ | apolare | pochissimo solubile | solubile |

L'esano, $\mathrm{C_6H_{14}}$, è un idrocarburo liquido, uno dei componenti della benzina: versato in un bicchiere d'acqua forma uno strato a parte, come l'olio.

### La bacchetta elettrizzata

Un corpo carico, per esempio una bacchetta di plastica strofinata con un panno di lana (lezione [La natura elettrica della materia](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/la-natura-elettrica-della-materia)), attira un filo sottile di liquido polare e lo fa deviare. Le molecole polari si girano con il polo di segno opposto verso la bacchetta: quel polo è più vicino alla bacchetta dell'altro, e l'attrazione vince sulla repulsione. Su un liquido apolare, come l'esano, l'effetto è molto più debole e il filo scende quasi diritto.

```tikz
% nome: polarita-filo-liquido-bacchetta
% alt: Due rubinetti con un filo sottile di liquido e, accanto, una bacchetta con tre segni meno. A sinistra il filo d'acqua si piega verso la bacchetta; a destra il filo di esano scende diritto
% svg: polarita-filo-liquido-bacchetta-16d43742.svg 311x169
\begin{tikzpicture}
% acqua
\draw[thick, fill=gray!20] (-0.35,3.2) rectangle (0.35,3.7);
\draw[very thick, blue!60] (0,3.2) .. controls (0,2.3) and (0.1,1.9) .. (0.5,1.3) .. controls (0.75,0.9) and (0.8,0.4) .. (0.8,0);
\draw[thick, fill=orange!25] (1.15,1.15) rectangle (3.05,1.5);
\node at (1.55,1.32) {$-$};
\node at (2.1,1.32) {$-$};
\node at (2.65,1.32) {$-$};
\node at (0.6,-0.4) {\small acqua, polare};
% esano
\begin{scope}[shift={(4.6,0)}]
\draw[thick, fill=gray!20] (-0.35,3.2) rectangle (0.35,3.7);
\draw[very thick, orange!70] (0,3.2) -- (0,0);
\draw[thick, fill=orange!25] (1.15,1.15) rectangle (3.05,1.5);
\node at (1.55,1.32) {$-$};
\node at (2.1,1.32) {$-$};
\node at (2.65,1.32) {$-$};
\node at (0.6,-0.4) {\small esano, apolare};
\end{scope}
\end{tikzpicture}
```

L'acqua devia verso la bacchetta qualunque sia il segno della carica: cambia solo il polo che le molecole le rivolgono.

```ad-warning
Polare non vuol dire carica
Una molecola polare è neutra: le sue cariche parziali, sommate, fanno zero. Uno ione, come $\mathrm{NH_4^+}$ o $\mathrm{SO_4^{2-}}$, ha una carica intera in più o in meno, e per lui la distinzione tra polare e apolare non si usa.
```

### Le attrazioni tra le molecole

Per separare molecole che si attirano serve energia: a parità di massa, una sostanza polare bolle di solito a temperatura più alta di una apolare. Come funzionano queste attrazioni, e perché si attirano anche le molecole apolari, lo trovi nella lezione [Forze dipolo-dipolo e forze di London](/materiale/scuola-superiore/chimica/forze-intermolecolari-e-stati-condensati/forze-dipolo-dipolo-e-forze-di-london).
