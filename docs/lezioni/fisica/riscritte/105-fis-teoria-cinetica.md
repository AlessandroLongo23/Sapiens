# La teoria cinetica dei gas

Quando gonfi la ruota della bicicletta la gomma diventa dura: l'aria che hai spinto dentro preme sulle pareti da tutte le parti. L'[equazione di stato del gas perfetto](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto) dice quanto vale questa pressione, ma non da dove viene. La teoria cinetica risponde con un modello: il gas è fatto di un numero enorme di molecole che corrono in tutte le direzioni, e la pressione è l'effetto dei loro urti contro le pareti. Dalle leggi della meccanica, applicate a una molecola alla volta, esce una formula che lega la pressione alla velocità delle molecole.

## Il modello: molecole sempre in moto

La teoria cinetica descrive il gas perfetto con quattro ipotesi, le stesse che la chimica usa nella [teoria cinetico-molecolare](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-teoria-cinetico-molecolare):

1. il gas è formato da un numero enorme di molecole uguali, così piccole rispetto alle distanze che le separano da poterle trattare come punti materiali;
2. le molecole si muovono di continuo e in modo disordinato: nessuna direzione è favorita rispetto alle altre;
3. le molecole non si attraggono e non si respingono: tra un urto e l'altro ciascuna si muove di moto rettilineo uniforme (anche il peso si trascura, perché in un recipiente di laboratorio non fa in tempo a incurvare la traiettoria);
4. gli urti delle molecole tra loro e contro le pareti sono [elastici](/materiale/scuola-superiore/fisica/la-quantita-di-moto/gli-urti-elastici-in-una-e-in-due-dimensioni): l'energia cinetica totale non cambia.

```tikz
% nome: gas-perfetto-molecole-in-moto
% alt: Un recipiente rettangolare con dodici molecole disegnate come pallini, ciascuna con la freccia della sua velocità: le frecce puntano in tutte le direzioni e hanno lunghezze diverse
% svg: gas-perfetto-molecole-in-moto-979296da.svg 216x125
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (5.6,3.2);
\foreach \x/\y/\a/\l in {0.7/0.6/40/0.6, 2.1/0.55/170/0.4, 3.5/0.6/75/0.55, 4.9/0.7/200/0.6, 0.6/1.7/320/0.5, 2.0/1.6/100/0.6, 3.4/1.7/10/0.6, 4.8/1.6/250/0.45, 0.8/2.7/350/0.55, 2.2/2.6/150/0.35, 3.6/2.6/290/0.5, 5.0/2.5/130/0.5} {
  \draw[-{Stealth}, thick, blue!60!black] (\x,\y) -- ++(\a:\l);
  \fill[blue!30] (\x,\y) circle (0.09);
  \draw (\x,\y) circle (0.09);
}
\end{tikzpicture}
```

Le ipotesi descrivono bene un gas rarefatto e lontano dalla temperatura a cui diventa liquido: l'aria di una stanza, l'elio di un palloncino. In quelle condizioni lo spazio tra le molecole è quasi tutto vuoto.

### Quante molecole, e quanto piccole

I numeri in gioco sono lontani dall'esperienza. Il numero di molecole $N$ di un gas si trova dal numero di moli $n$ con il numero di Avogadro, $N_A = 6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$, e la massa $m$ di una molecola dalla [massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare) $M$, che è la massa di una mole:

$$N = n\,N_A \qquad\qquad m = \frac{M}{N_A}$$

In questa lezione $m$ è sempre la massa di una sola molecola, e $N\,m$ la massa di tutto il gas.

```ad-example
Esempio 1: le molecole di elio in una bombola
Una bombola contiene $2{,}0\,\text{mol}$ di elio, che ha massa molare $M = 4{,}00\,\text{g/mol}$. Quanti atomi ci sono? Qual è la massa di un atomo?

$$N = n\,N_A = 2{,}0\,\text{mol} \cdot 6{,}02 \cdot 10^{23}\,\text{mol}^{-1} = 1{,}204 \cdot 10^{24} \approx 1{,}2 \cdot 10^{24}$$

Per la massa serve la massa molare in chilogrammi, $M = 4{,}00 \cdot 10^{-3}\,\text{kg/mol}$:

$$m = \frac{M}{N_A} = \frac{4{,}00 \cdot 10^{-3}\,\text{kg/mol}}{6{,}02 \cdot 10^{23}\,\text{mol}^{-1}} = 6{,}644\ldots \cdot 10^{-27}\,\text{kg} \approx 6{,}64 \cdot 10^{-27}\,\text{kg}$$

L'elio è un gas monoatomico: le sue "molecole" sono atomi singoli. Con lo stesso conto una molecola di azoto $\mathrm{N_2}$, che ha $M = 28{,}0\,\text{g/mol}$, ha massa $4{,}65 \cdot 10^{-26}\,\text{kg}$.
```

```ad-warning
La massa molare va in chilogrammi
Le tabelle danno la massa molare in grammi per mole. Nelle formule di questa lezione le masse sono in chilogrammi: $28{,}0\,\text{g/mol}$ diventa $28{,}0 \cdot 10^{-3}\,\text{kg/mol}$. Chi dimentica la conversione trova una molecola mille volte più pesante.
```

## L'urto di una molecola contro una parete

Chiudiamo il gas in una scatola a forma di cubo, di lato $L$, e seguiamo una sola molecola, di massa $m$ e velocità $\vec v$ con componenti $v_x$, $v_y$ e $v_z$ lungo i tre spigoli. Guardiamo la parete di destra, perpendicolare all'asse $x$.

Quando la molecola arriva sulla parete, l'urto è elastico e la parete è liscia e ferma: la componente della velocità perpendicolare alla parete cambia verso, da $v_x$ a $-v_x$, e le altre due restano come sono. È lo stesso rimbalzo di una palla da biliardo contro la sponda.

```tikz
% nome: urto-elastico-molecola-parete
% alt: Una molecola urta la parete di destra di un recipiente. Prima dell'urto la velocità v punta in alto a destra, con le componenti tratteggiate v x verso la parete e v y verso l'alto; dopo l'urto la velocità v primo punta in alto a sinistra: la componente orizzontale è diventata meno v x, quella verticale v y è rimasta uguale
% svg: urto-elastico-molecola-parete-78e28511.svg 166x118
\begin{tikzpicture}
\draw[thick] (3,0.5) -- (3,3.5);
\foreach \y in {0.65,0.8,...,3.5} \draw[thin] (3,\y) -- ++(0.15,-0.15);
\draw[thin, dashed] (0.6,0.8) -- (3,2) -- (0.6,3.2);
\draw[-{Stealth}, thick, dashed, blue!60!black] (1.0,1.0) -- (2.2,1.0) node[below] {$v_x$};
\draw[-{Stealth}, thick, dashed, blue!60!black] (1.0,1.0) -- (1.0,1.6) node[left] {$v_y$};
\draw[-{Stealth}, thick, blue!60!black] (1.0,1.0) -- (2.2,1.6) node[below right, inner sep=1pt] {$\vec{v}$};
\fill[blue!30] (1.0,1.0) circle (0.09);
\draw (1.0,1.0) circle (0.09);
\draw[-{Stealth}, thick, dashed, blue!60!black] (2.2,2.4) -- (1.0,2.4) node[left] {$-v_x$};
\draw[-{Stealth}, thick, dashed, blue!60!black] (2.2,2.4) -- (2.2,3.0) node[right] {$v_y$};
\draw[-{Stealth}, thick, blue!60!black] (2.2,2.4) -- (1.0,3.0) node[above] {$\vec{v}\,'$};
\fill[blue!30] (2.2,2.4) circle (0.09);
\draw (2.2,2.4) circle (0.09);
\node[right] at (3.25,2) {parete};
\end{tikzpicture}
```

La [quantità di moto](/materiale/scuola-superiore/fisica/la-quantita-di-moto/la-quantita-di-moto) della molecola lungo $x$ passa da $m\,v_x$ a $-m\,v_x$. La sua variazione è

$$-m\,v_x - m\,v_x = -2\,m\,v_x$$

Per il [teorema dell'impulso](/materiale/scuola-superiore/fisica/la-quantita-di-moto/l-impulso-e-il-teorema-dell-impulso) questa variazione è l'impulso che la parete ha dato alla molecola. Per il [terzo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-terzo-principio-della-dinamica) la molecola ha dato alla parete un impulso uguale e opposto: a ogni urto la parete riceve una spinta verso l'esterno, di impulso

$$2\,m\,v_x$$

In questa lezione la lettera $p$ indica sempre la pressione; la quantità di moto la scriviamo per esteso, $m\,v$.

## La forza media di una molecola

Un urto solo dura pochissimo e spinge pochissimo. La molecola però torna: dopo l'urto attraversa la scatola, rimbalza sulla parete di sinistra e torna su quella di destra. Tra due urti successivi sulla stessa parete percorre lungo $x$ la distanza $2L$, andata e ritorno, sempre con una componente della velocità di modulo $v_x$. Gli urti sulle altre quattro pareti non contano, perché cambiano solo $v_y$ o $v_z$. L'intervallo di tempo tra due urti è

$$\Delta t = \frac{2L}{v_x}$$

```tikz
% nome: molecola-andata-ritorno-scatola
% alt: Una scatola quadrata di lato L vista di lato. Una molecola parte dalla parete di destra, attraversa la scatola, rimbalza sulla parete di sinistra e torna: tra due urti sulla parete di destra, segnata in arancione, percorre la distanza 2 L
% svg: molecola-andata-ritorno-scatola-f1f0e559.svg 242x156
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (3.2,3.2);
\draw[very thick, orange!90!black] (3.2,0) -- (3.2,3.2);
\draw[-{Stealth}, thick, blue!60!black] (3.05,1.85) -- (0.12,1.85);
\draw[-{Stealth}, thick, blue!60!black] (0.12,1.45) -- (3.05,1.45);
\node[above] at (1.6,1.85) {\small andata};
\node[below] at (1.6,1.45) {\small ritorno};
\fill[blue!30] (3.05,1.45) circle (0.09);
\draw (3.05,1.45) circle (0.09);
\draw[{Stealth}-{Stealth}, thin] (0,-0.35) -- (3.2,-0.35) node[midway, below] {$L$};
\node[right] at (3.3,1.65) {$2\,m\,v_x$ a ogni urto};
\end{tikzpicture}
```

In un tempo lungo, che contiene moltissimi urti, la parete riceve un impulso $2\,m\,v_x$ ogni $\Delta t$ secondi. La forza media che la molecola esercita sulla parete è l'impulso diviso per il tempo:

$$F = \frac{2\,m\,v_x}{\Delta t} = 2\,m\,v_x \cdot \frac{v_x}{2L} = \frac{m\,v_x^2}{L}$$

La velocità compare al quadrato per due motivi che si sommano: una molecola più veloce dà una spinta più forte a ogni urto, e torna sulla parete più spesso.

```ad-example
Esempio 2: una molecola di azoto in una scatola
Una molecola di azoto, di massa $m = 4{,}65 \cdot 10^{-26}\,\text{kg}$, si muove in una scatola cubica di lato $L = 0{,}10\,\text{m}$ con $v_x = 400\,\text{m/s}$. Quante volte al secondo urta la parete di destra? Quale forza media esercita su di essa?

Il tempo tra due urti sulla stessa parete è

$$\Delta t = \frac{2L}{v_x} = \frac{2 \cdot 0{,}10\,\text{m}}{400\,\text{m/s}} = 5{,}0 \cdot 10^{-4}\,\text{s}$$

quindi gli urti sono $1/\Delta t = 2{,}0 \cdot 10^{3}$ al secondo. La forza media è

$$F = \frac{m\,v_x^2}{L} = \frac{4{,}65 \cdot 10^{-26}\,\text{kg} \cdot (400\,\text{m/s})^2}{0{,}10\,\text{m}} = 7{,}44 \cdot 10^{-20}\,\text{N} \approx 7{,}4 \cdot 10^{-20}\,\text{N}$$

Una forza così non si potrebbe misurare con nessuno strumento. La pressione che senti sulla gomma è la somma di un numero enorme di contributi come questo: in un litro d'aria le molecole sono circa $2{,}5 \cdot 10^{22}$.
```

```ad-warning
Tra due urti la distanza è $2L$, non $L$
Dopo un urto sulla parete di destra la molecola deve andare fino alla parete opposta e tornare. Con $L$ al posto di $2L$ gli urti risultano il doppio, e la forza anche.
```

## Dalla forza di una molecola alla pressione del gas

Le molecole nella scatola sono $N$, tutte di massa $m$ e ognuna con la sua velocità. La forza totale sulla parete di destra è la somma delle forze medie di tutte:

$$F_{tot} = \frac{m}{L}\,\bigl(v_{x1}^2 + v_{x2}^2 + \ldots + v_{xN}^2\bigr)$$

La somma dei quadrati divisa per $N$ è la [media](/materiale/scuola-superiore/matematica/statistica/media-mediana-e-moda) dei quadrati delle componenti $x$, che indichiamo con $\overline{v_x^2}$. La somma vale quindi $N\,\overline{v_x^2}$, e

$$F_{tot} = \frac{N\,m\,\overline{v_x^2}}{L}$$

La [pressione](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione) è la forza divisa per l'area della parete, $L^2$. Al denominatore compare $L \cdot L^2 = L^3$, che è il volume $V$ della scatola:

$$p = \frac{F_{tot}}{L^2} = \frac{N\,m\,\overline{v_x^2}}{V}$$

Resta da togliere di mezzo la direzione $x$, che abbiamo scelto noi. Per ogni molecola il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide), usato due volte, dà $v^2 = v_x^2 + v_y^2 + v_z^2$, e la stessa relazione vale per le medie. Poiché nessuna direzione è favorita (ipotesi 2), le tre medie sono uguali, e ciascuna è un terzo del totale:

$$\overline{v_x^2} = \frac{1}{3}\,\overline{v^2}$$

### La velocità quadratica media

La **velocità quadratica media** $v_{qm}$ è la radice quadrata della media dei quadrati delle velocità delle molecole:

$$v_{qm} = \sqrt{\overline{v^2}} = \sqrt{\frac{v_1^2 + v_2^2 + \ldots + v_N^2}{N}}$$

Si misura in metri al secondo e dice quanto sono veloci, in media, le molecole. Con questa definizione $\overline{v^2} = v_{qm}^2$, e la pressione del gas diventa

$$p = \frac{N\,m\,v_{qm}^2}{3\,V} \qquad\text{cioè}\qquad p\,V = \frac{1}{3}\,N\,m\,v_{qm}^2$$

È il risultato della teoria cinetica: a sinistra ci sono due grandezze che si misurano con un manometro e con un metro, a destra il numero, la massa e la velocità di molecole che nessuno vede. Nel conto abbiamo trascurato gli urti tra le molecole; si dimostra, con strumenti che vanno oltre questa lezione, che tenerne conto non cambia il risultato.

```ad-example
Esempio 3: cinque molecole
Cinque molecole hanno velocità di modulo $200$, $300$, $400$, $500$ e $600\,\text{m/s}$. Quanto valgono la velocità media e la velocità quadratica media?

La velocità media è la media dei moduli:

$$\bar v = \frac{200 + 300 + 400 + 500 + 600}{5}\,\text{m/s} = 400\,\text{m/s}$$

Per la velocità quadratica media prima si elevano al quadrato le velocità, poi si fa la media, poi la radice:

$$\overline{v^2} = \frac{(4 + 9 + 16 + 25 + 36) \cdot 10^{4}}{5}\,\text{m}^2/\text{s}^2 = 18 \cdot 10^{4}\,\text{m}^2/\text{s}^2$$

$$v_{qm} = \sqrt{18 \cdot 10^{4}\,\text{m}^2/\text{s}^2} = 424{,}2\ldots\,\text{m/s} \approx 424\,\text{m/s}$$

La velocità quadratica media è un po' più grande della velocità media, perché nei quadrati le molecole veloci pesano di più. Sono uguali solo se tutte le molecole hanno la stessa velocità.
```

```tikz
% nome: velocita-media-e-quadratica-media
% alt: Un asse delle velocità da 0 a 700 metri al secondo con cinque pallini a 200, 300, 400, 500 e 600. Una linea tratteggiata segna la velocità media a 400 metri al secondo, una linea arancione poco più a destra la velocità quadratica media a 424 metri al secondo
% svg: velocita-media-e-quadratica-media-ae9c76da.svg 260x112
\begin{tikzpicture}[x=0.8cm]
\draw[->] (0,0) -- (7.7,0) node[right] {$v$};
\foreach \x/\t in {0/0,1/100,2/200,3/300,4/400,5/500,6/600,7/700} {
  \draw[thin] (\x,0.07) -- (\x,-0.07);
  \node[below] at (\x,-0.07) {\small $\t$};
}
\foreach \x in {2,3,4,5,6} {
  \fill[blue!30] (\x,0.35) circle[radius=0.09cm];
  \draw (\x,0.35) circle[radius=0.09cm];
}
\draw[dashed, thin] (4,0) -- (4,1.5) node[above left, inner sep=1pt] {\small $\bar v = 400$};
\draw[thick, orange!90!black] (4.24,0) -- (4.24,1.1) node[above right, inner sep=1pt] {\small $v_{qm} \approx 424$};
\node[below] at (3.8,-0.55) {\small velocità (m/s)};
\end{tikzpicture}
```

```ad-warning
Prima i quadrati, poi la media, poi la radice
La velocità quadratica media non è il quadrato della velocità media e nemmeno la media delle velocità. L'ordine delle operazioni è quello del nome letto al contrario: quadrati, media, radice. Nell'esempio 3 la media semplice dà $400\,\text{m/s}$, la quadratica $424\,\text{m/s}$.
```

## Che cosa dice la formula

Nella relazione $p = \dfrac{N\,m\,v_{qm}^2}{3\,V}$ si leggono tre dipendenze, ognuna con la sua spiegazione nel modello.

- La pressione è direttamente proporzionale al numero di molecole $N$: con il doppio delle molecole gli urti contro ogni parete sono il doppio. È quello che fai con la pompa della bicicletta.
- La pressione è inversamente proporzionale al volume $V$: in una scatola più piccola le molecole tornano prima sulla stessa parete, e la parete è meno estesa. Se le velocità non cambiano, il prodotto $p\,V$ resta costante: è la [legge di Boyle](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-legge-di-boyle), che il modello spiega.
- La pressione è proporzionale al quadrato della velocità quadratica media: con molecole due volte più veloci ogni urto spinge il doppio e gli urti sono il doppio, quindi la pressione è quattro volte più grande.

```tikz
% nome: grafico-pressione-velocita-quadratica-media
% alt: Grafico della pressione di un gas in funzione della velocità quadratica media delle sue molecole, a volume e numero di molecole fissati: un ramo di parabola che parte dall'origine. Sono segnati due punti: a 508 metri al secondo la pressione è 1,00 per 10 alla quinta pascal, a 1016 metri al secondo, il doppio, è 4,00 per 10 alla quinta pascal, il quadruplo
% svg: grafico-pressione-velocita-quadratica-media-5d3cc1b1.svg 252x238
% poi-interattivo: trascinare un punto lungo la parabola e leggere velocità e pressione, con il rapporto tra le due pressioni
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin] (0,0) grid (6,5);
\draw[->] (0,0) -- (6.4,0);
\node[below] at (5.6,-0.45) {$v_{qm}$ (m/s)};
\draw[->] (0,0) -- (0,5.4) node[above] {$p$ ($10^5$ Pa)};
\foreach \x/\t in {1/200,2/400,3/600,4/800,5/1000} \node[below] at (\x,0) {\small $\t$};
\foreach \y in {1,2,3,4,5} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue!60, domain=0:5.6, samples=60, smooth] plot (\x, {0.155*\x*\x});
\draw[dashed, thin] (2.54,0) -- (2.54,1) -- (0,1);
\draw[dashed, thin] (5.08,0) -- (5.08,4) -- (0,4);
\fill (2.54,1) circle (0.06);
\fill (5.08,4) circle (0.06);
\node[above left, inner sep=2pt] at (2.54,1) {\small $A$};
\node[above left, inner sep=2pt] at (5.08,4) {\small $B$};
\end{tikzpicture}
```

Il grafico è quello del gas dell'esempio 4: nel punto $A$ le molecole hanno $v_{qm} = 508\,\text{m/s}$, nel punto $B$ il doppio.

```ad-example
Esempio 4: la pressione dal modello
In un recipiente di $2{,}00\,\text{L}$ ci sono $5{,}00 \cdot 10^{22}$ molecole di azoto, di massa $m = 4{,}65 \cdot 10^{-26}\,\text{kg}$ ciascuna, con velocità quadratica media $v_{qm} = 508\,\text{m/s}$. Quanto vale la pressione?

Il volume va in metri cubi: $V = 2{,}00\,\text{L} = 2{,}00 \cdot 10^{-3}\,\text{m}^3$. La massa di tutto il gas è $N\,m = 5{,}00 \cdot 10^{22} \cdot 4{,}65 \cdot 10^{-26}\,\text{kg} = 2{,}325 \cdot 10^{-3}\,\text{kg}$, poco più di due grammi.

$$p = \frac{N\,m\,v_{qm}^2}{3\,V} = \frac{2{,}325 \cdot 10^{-3}\,\text{kg} \cdot (508\,\text{m/s})^2}{3 \cdot 2{,}00 \cdot 10^{-3}\,\text{m}^3} = 1{,}0000\ldots \cdot 10^{5}\,\text{Pa} \approx 1{,}00 \cdot 10^{5}\,\text{Pa}$$

È circa la pressione atmosferica: due grammi di azoto in una bottiglia da due litri, con le molecole a cinquecento metri al secondo, premono come l'aria che ci circonda.
```

```ad-warning
I litri non sono metri cubi
Nella formula il volume è in metri cubi: $1\,\text{L} = 10^{-3}\,\text{m}^3$. Con il volume lasciato in litri la pressione dell'esempio 4 verrebbe $100\,\text{Pa}$, mille volte più piccola.
```

Nella figura qui sotto la scatola è vista di fronte e le molecole si muovono al rallentatore. Puoi cambiare il numero di molecole, il volume e la temperatura, che agisce sulla velocità delle molecole: scaldare un gas vuol dire farle correre di più. La pressione si legge in due modi: contata dagli urti sulle pareti, e calcolata con la formula. Prova a rispondere prima di muovere i cursori: che cosa succede alla pressione se raddoppi le molecole? E se dimezzi il volume?

```interattivo
% nome: gas-scatola-urti-pressione
% alt: Una scatola vista di fronte con le molecole di un gas che si muovono in tutte le direzioni e rimbalzano sulle pareti; a ogni urto la parete si accende per un istante. Tre cursori cambiano il numero di molecole da 10 a 80, il volume della scatola spostando la parete di destra, e la temperatura da 100 a 600 kelvin, che cambia la velocità delle molecole. Sotto sono scritte la velocità quadratica media e la pressione rispetto a quella di partenza, contata dagli urti e calcolata con la formula
```

In tutti e due i casi la pressione raddoppia. Se invece porti la temperatura da $300\,\text{K}$ a $600\,\text{K}$ la velocità quadratica media non raddoppia: cresce di $\sqrt{2} \approx 1{,}41$ volte, e la pressione, che va con il suo quadrato, raddoppia. Il legame preciso tra temperatura e velocità delle molecole è l'argomento della lezione [Temperatura ed energia cinetica delle molecole](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/temperatura-ed-energia-cinetica-delle-molecole). Il valore contato dagli urti oscilla intorno a quello della formula, perché nella figura le molecole sono poche decine: in un gas vero sono così tante che le oscillazioni non si notano.

## La velocità delle molecole dalla pressione e dalla densità

Il prodotto $N\,m$ è la massa di tutto il gas, e diviso per il volume dà la [densità](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-derivate-area-volume-e-densita) $d$. La formula della pressione si può allora scrivere senza contare le molecole:

$$p = \frac{1}{3}\,d\,v_{qm}^2 \qquad\Rightarrow\qquad v_{qm} = \sqrt{\frac{3\,p}{d}}$$

Bastano un barometro e una bilancia per sapere a che velocità corrono le molecole.

```ad-example
Esempio 5: la velocità delle molecole dell'aria
A $20\,^\circ\text{C}$ e alla pressione atmosferica, $p = 1{,}01 \cdot 10^{5}\,\text{Pa}$, l'aria ha densità $d = 1{,}20\,\text{kg/m}^3$. Quanto vale la velocità quadratica media delle sue molecole?

$$v_{qm} = \sqrt{\frac{3\,p}{d}} = \sqrt{\frac{3 \cdot 1{,}01 \cdot 10^{5}\,\text{Pa}}{1{,}20\,\text{kg/m}^3}} = \sqrt{2{,}525 \cdot 10^{5}\,\text{m}^2/\text{s}^2} = 502{,}4\ldots\,\text{m/s} \approx 502\,\text{m/s}$$

Sono circa $1800\,\text{km/h}$, più della velocità del suono. L'aria è una miscela, e il risultato è la velocità quadratica media calcolata sull'insieme delle sue molecole.
```

Se le molecole corrono a cinquecento metri al secondo, perché un profumo impiega parecchi secondi ad attraversare una stanza? Perché nessuna molecola va dritta a lungo: nell'aria di una stanza ogni molecola urta le altre miliardi di volte al secondo e cambia direzione a ogni urto, così il suo cammino è una linea spezzata che avanza poco.

```ad-example
Esempio 6: quanto elio c'è nella bombola
Una bombola di $10{,}0\,\text{L}$ contiene elio alla pressione di $2{,}00 \cdot 10^{5}\,\text{Pa}$. La velocità quadratica media degli atomi è $1{,}37 \cdot 10^{3}\,\text{m/s}$ e la massa di un atomo è $6{,}64 \cdot 10^{-27}\,\text{kg}$. Qual è la massa dell'elio? Quanti atomi sono?

Dalla formula $p\,V = \frac{1}{3}\,N\,m\,v_{qm}^2$ si ricava la massa del gas, $N\,m$, con $V = 10{,}0 \cdot 10^{-3}\,\text{m}^3$:

$$N\,m = \frac{3\,p\,V}{v_{qm}^2} = \frac{3 \cdot 2{,}00 \cdot 10^{5}\,\text{Pa} \cdot 10{,}0 \cdot 10^{-3}\,\text{m}^3}{(1{,}37 \cdot 10^{3}\,\text{m/s})^2} = 3{,}196\ldots \cdot 10^{-3}\,\text{kg} \approx 3{,}20\,\text{g}$$

Il numero di atomi è la massa totale divisa per la massa di un atomo:

$$N = \frac{N\,m}{m} = \frac{3{,}197 \cdot 10^{-3}\,\text{kg}}{6{,}64 \cdot 10^{-27}\,\text{kg}} = 4{,}81\ldots \cdot 10^{23} \approx 4{,}81 \cdot 10^{23}$$

cioè $N / N_A \approx 0{,}80\,\text{mol}$ di elio.
```

## Verso la temperatura

La teoria cinetica dà $p\,V = \frac{1}{3}\,N\,m\,v_{qm}^2$; l'[equazione di stato](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto), scritta con il numero di molecole, dà $p\,V = N\,k_B\,T$. I due secondi membri descrivono lo stesso prodotto $p\,V$, e devono essere uguali. Da questo confronto, che è il punto di partenza della [prossima lezione](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/temperatura-ed-energia-cinetica-delle-molecole), esce il significato microscopico della temperatura.

```ad-note
Un'idea del Settecento
Il primo a spiegare la pressione di un gas con gli urti delle sue particelle fu Daniel Bernoulli, nel 1738, nel libro "Hydrodynamica". L'idea rimase quasi dimenticata per più di un secolo; la ripresero a metà dell'Ottocento Rudolf Clausius, James Clerk Maxwell e Ludwig Boltzmann, quando l'esistenza degli atomi era ancora discussa.
```
