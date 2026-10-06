# La legge di Boyle

Tappa con un dito il foro di una pompa da bicicletta e spingi il manico: l'aria dentro si lascia comprimere, ma più la schiacci più spinge indietro, e a un certo punto non riesci ad andare oltre. Un liquido non si comporta così: una siringa piena d'acqua, tappata, non si accorcia nemmeno di un millimetro. Un gas invece cambia volume quando cambia la pressione, e la legge di Boyle dice di quanto, purché la temperatura resti la stessa. Se l'hai già incontrata in [chimica](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-legge-di-boyle), qui la ritrovi con le unità del Sistema Internazionale, con un pistone su cui agiscono delle forze e con il grafico che userai per tutta la termodinamica.

## Lo stato di un gas

Per descrivere una certa quantità di gas chiusa in un recipiente servono tre grandezze: il **volume** $V$ che occupa, la **pressione** $p$ che esercita sulle pareti e la **temperatura** $T$. Insieme formano lo **stato** del gas. In fisica si misurano nelle unità del Sistema Internazionale:

- il volume in metri cubi, con $1\,\text{L} = 10^{-3}\,\text{m}^3$ e $1\,\text{cm}^3 = 10^{-6}\,\text{m}^3$;
- la [pressione](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione) in pascal, con $1\,\text{atm} = 1{,}01 \cdot 10^5\,\text{Pa}$;
- la temperatura in kelvin, come spiega la lezione [La temperatura e le scale termometriche](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-temperatura-e-le-scale-termometriche).

Il recipiente più comodo per studiare un gas è un cilindro chiuso da un pistone che scorre senza attrito e senza lasciar passare il gas. Il volume è quello di un cilindro, $V = S \cdot h$, con $S$ l'area del pistone e $h$ l'altezza a cui si trova: per cambiare il volume si sposta il pistone, e per conoscerlo basta un righello.

Anche la pressione si legge dal pistone. Quando il pistone è fermo, le forze su di lui sono in equilibrio. Verso il basso spingono l'aria esterna, con la forza $p_0 \cdot S$ dovuta alla [pressione atmosferica](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione-atmosferica-e-la-sua-misura) $p_0$, e il peso $m g$ di quello che c'è appoggiato sopra (compreso il pistone, se la sua massa non è trascurabile). Verso l'alto spinge il gas, con la forza $p \cdot S$. Quindi $p\,S = p_0\,S + m\,g$, e dividendo per $S$:

$$p = p_0 + \frac{m\,g}{S}$$

```tikz
% nome: pistone-pesetto-pressione-gas
% alt: A sinistra un cilindro verticale con il gas chiuso da un pistone ad altezza h, e sopra il pistone un pesetto di massa m. A destra il pistone da solo con le tre forze che agiscono su di lui, in scala: verso l'alto la forza p per S del gas, verso il basso la forza p zero per S dell'aria esterna e, molto più corta, il peso m g del pesetto
\begin{tikzpicture}
\fill[blue!10] (0,0) rectangle (2.4,2.2);
\draw[thick] (0,3.7) -- (0,0) -- (2.4,0) -- (2.4,3.7);
\draw[thick, fill=gray!20] (0.03,2.2) rectangle (2.37,2.45);
\draw[thick, fill=gray!50] (0.7,2.45) rectangle (1.7,3.0);
\node at (1.2,2.72) {$m$};
\node at (1.2,1.1) {gas: $p$, $V$};
\draw[{Stealth}-{Stealth}, thin] (-0.35,0) -- (-0.35,2.2);
\node[left] at (-0.35,1.1) {$h$};
\node[below] at (1.2,-0.05) {area $S$};
\draw[thick, fill=gray!20] (4.2,2.2) rectangle (6.6,2.45);
\draw[-{Stealth}, thick, red] (5.4,2.33) -- (5.4,4.74);
\node[right, red] at (5.4,4.5) {$p\,S$};
\draw[-{Stealth}, thick, red] (4.8,2.33) -- (4.8,0.31);
\node[left, red] at (4.8,0.6) {$p_0\,S$};
\draw[-{Stealth}, thick, red] (6.0,2.33) -- (6.0,1.94);
\node[right, red] at (6.0,1.9) {$m\,g$};
\end{tikzpicture}
```

```ad-example
Esempio 1: la pressione del gas sotto il pistone
Un cilindro ha un pistone di massa trascurabile e di area $20\,\text{cm}^2$. Sul pistone è appoggiato un pesetto di $4{,}0\,\text{kg}$, e fuori c'è la pressione atmosferica $p_0 = 1{,}01 \cdot 10^5\,\text{Pa}$. Quanto vale la pressione del gas?

L'area va in metri quadrati: $S = 20\,\text{cm}^2 = 2{,}0 \cdot 10^{-3}\,\text{m}^2$. Il pesetto aggiunge alla pressione atmosferica

$$\frac{m\,g}{S} = \frac{4{,}0\,\text{kg} \cdot 9{,}8\,\text{m/s}^2}{2{,}0 \cdot 10^{-3}\,\text{m}^2} = 1{,}96 \cdot 10^4\,\text{Pa} = 0{,}196 \cdot 10^5\,\text{Pa}$$

e la pressione del gas è

$$p = p_0 + \frac{m\,g}{S} = 1{,}01 \cdot 10^5\,\text{Pa} + 0{,}196 \cdot 10^5\,\text{Pa} = 1{,}206 \cdot 10^5\,\text{Pa} \approx 1{,}21 \cdot 10^5\,\text{Pa}$$

Nella figura sopra le tre frecce sono in scala con questi numeri: $p\,S = 241\,\text{N}$, $p_0\,S = 202\,\text{N}$ e $m\,g = 39\,\text{N}$.
```

```ad-warning
Il gas sente anche l'aria che sta fuori
Senza pesetti la pressione del gas non è zero: è la pressione atmosferica, $1{,}01 \cdot 10^5\,\text{Pa}$. Il pesetto dell'esempio 1 aggiunge solo $0{,}196 \cdot 10^5\,\text{Pa}$, meno di un quinto. Chi scrive $p = m g / S$ dimentica più di quattro quinti della pressione.
```

## La legge di Boyle

Una trasformazione in cui la temperatura del gas resta costante si chiama **isoterma**. Per ottenerla si usa un cilindro con le pareti che lasciano passare bene il calore, immerso nell'aria della stanza o in una vasca d'acqua, e si sposta il pistone lentamente: così il gas ha il tempo di restare alla temperatura di quello che lo circonda.

In queste condizioni si aggiungono pesetti sul pistone, uno alla volta, e a ogni passo si misurano la pressione e il volume. Ecco le misure per una certa quantità di gas a temperatura ambiente:

| $V$ (L) | $1{,}0$ | $2{,}0$ | $3{,}0$ | $4{,}0$ | $6{,}0$ |
|---|---|---|---|---|---|
| $p$ (kPa) | $600$ | $300$ | $200$ | $150$ | $100$ |
| $p \cdot V$ (J) | $600$ | $600$ | $600$ | $600$ | $600$ |

Quando il volume raddoppia la pressione si dimezza, quando il volume triplica la pressione diventa un terzo: il prodotto non cambia. È la **legge di Boyle**, trovata da Robert Boyle nel 1662: a temperatura costante, la pressione di una data quantità di gas è [inversamente proporzionale](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-inversa-e-quadratica) al volume che occupa.

$$p \cdot V = \text{costante}$$

Il valore della costante dipende da quanto gas c'è nel cilindro e dalla sua temperatura. Tra due stati della stessa isoterma, uno iniziale e uno finale:

$$p_1\,V_1 = p_2\,V_2$$

Nell'ultima riga della tabella il prodotto è in joule, e non è un caso. Un pascal è un newton su metro quadrato, quindi $1\,\text{Pa} \cdot 1\,\text{m}^3 = 1\,\text{N} \cdot \text{m} = 1\,\text{J}$: il prodotto di una pressione per un volume è un'energia. Con i kilopascal e i litri i due fattori mille si compensano, $1\,\text{kPa} \cdot 1\,\text{L} = 10^3\,\text{Pa} \cdot 10^{-3}\,\text{m}^3 = 1\,\text{J}$. Il motivo fisico arriverà con il [lavoro di un gas](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-lavoro-in-una-trasformazione-termodinamica).

Nella formula $p_1 V_1 = p_2 V_2$ le unità possono anche non essere quelle del Sistema Internazionale, purché le due pressioni abbiano la stessa unità e i due volumi la stessa unità: i fattori di conversione stanno da tutte e due le parti e si semplificano. In un cilindro, dove $V = S \cdot h$, si semplifica anche l'area: $p_1\,h_1 = p_2\,h_2$, e al posto dei volumi bastano le altezze del pistone.

```ad-example
Esempio 2: di quanto scende il pistone
Il cilindro dell'esempio 1, senza pesetto, contiene gas alla pressione atmosferica, $p_1 = 1{,}01 \cdot 10^5\,\text{Pa}$, e il pistone è a $30{,}0\,\text{cm}$ dal fondo. Si appoggia il pesetto di $4{,}0\,\text{kg}$ e si aspetta che il gas torni alla temperatura della stanza. A che altezza si ferma il pistone?

La pressione finale è quella dell'esempio 1. In un passaggio intermedio si tiene una cifra in più, $p_2 = 1{,}206 \cdot 10^5\,\text{Pa}$, e si arrotonda solo alla fine. Da $p_1\,h_1 = p_2\,h_2$:

$$h_2 = \frac{p_1\,h_1}{p_2} = \frac{1{,}01 \cdot 10^5\,\text{Pa} \cdot 30{,}0\,\text{cm}}{1{,}206 \cdot 10^5\,\text{Pa}} = 25{,}12\ldots\,\text{cm} \approx 25{,}1\,\text{cm}$$

Il pistone scende di $4{,}9\,\text{cm}$. La pressione è cresciuta di circa un quinto e l'altezza è diminuita di circa un sesto: i due cambiamenti non sono uguali, perché è il prodotto a restare costante, non la somma.
```

```ad-warning
Il rapporto capovolto
Scrivendo $h_2 = h_1 \cdot p_2 / p_1$ nell'esempio 2 si trova $35{,}8\,\text{cm}$: un pistone che sale quando ci metti sopra un peso. Parti sempre da $p_1 V_1 = p_2 V_2$ e controlla il verso: se la pressione aumenta, il volume deve diminuire.
```

Nella figura qui sotto puoi rifare l'esperimento. Ogni pesetto è da $1{,}0\,\text{kg}$ e il pistone ha un'area di $10\,\text{cm}^2$, quindi ogni pesetto aggiunge sempre la stessa pressione, $9{,}8\,\text{kPa}$. Aggiungili uno alla volta e guarda di quanto scende il pistone a ogni passo: è sempre la stessa discesa?

```interattivo
% nome: boyle-pistone-pesetti
% alt: Un cilindro verticale con il gas chiuso da un pistone di area 10 centimetri quadrati, su cui si appoggiano da zero a dieci pesetti da un chilogrammo; accanto, il piano pressione-volume con l'isoterma del gas. Aggiungendo un pesetto la pressione cresce di 9,8 kilopascal, il pistone scende e il punto dello stato si sposta lungo l'isoterma, lasciando segnati gli stati già visitati; sotto si leggono pressione, volume, il loro prodotto, che resta 20,2 joule, e di quanto è sceso il pistone con l'ultimo pesetto
```

No: il primo pesetto fa scendere il pistone di $1{,}8\,\text{cm}$, il decimo di appena mezzo centimetro. La pressione cresce a passi uguali, ma il volume diminuisce a passi sempre più piccoli, perché a ogni passo il prodotto $p \cdot V$ deve restare $20{,}2\,\text{J}$. Un gas già compresso è più difficile da comprimere ancora: è quello che senti nel manico della pompa.

## L'isoterma nel piano pressione-volume

Gli stati di un gas si disegnano in un grafico con il volume sull'asse orizzontale e la pressione su quello verticale: il **piano pressione-volume**, o piano di Clapeyron. Ogni punto del piano è uno stato, e una trasformazione è una linea che porta da un punto a un altro. Questo grafico ti accompagnerà in tutta la termodinamica.

I cinque stati della tabella, riportati nel piano, stanno su un ramo di [iperbole equilatera](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/iperbole-equilatera-e-funzione-omografica), la curva di equazione $p = \dfrac{\text{costante}}{V}$. Questa curva è l'isoterma del gas alla temperatura dell'esperimento.

```tikz
% nome: boyle-isoterma-rettangoli-uguali
% alt: Il piano pressione-volume con l'isoterma che passa per i cinque stati della tabella. Per lo stato A, a 2,0 litri e 300 kilopascal, e per lo stato B, a 6,0 litri e 100 kilopascal, sono colorati i rettangoli che hanno un vertice nell'origine e quello opposto sul punto: uno è alto e stretto, l'altro basso e largo, ma hanno la stessa area, 600 joule
% poi-interattivo: trascinare un punto lungo l'isoterma e vedere il rettangolo cambiare forma con l'area che resta 600 J
\begin{tikzpicture}
\fill[orange!25] (0,0) rectangle (6,1);
\fill[blue!20] (0,0) rectangle (2,3);
\draw[gray!25, very thin] (0,0) grid (7,7);
\draw[->] (0,0) -- (7.5,0);
\node[below] at (7.3,-0.35) {$V$ (L)};
\draw[->] (0,0) -- (0,7.5) node[above] {$p$ (kPa)};
\foreach \x in {1,...,7} \node[below] at (\x,0) {\small $\x$};
\foreach \y/\t in {2/200,4/400,6/600} \node[left] at (0,\y) {\small $\t$};
\draw[dashed, thin] (0,3) -- (2,3) -- (2,0);
\draw[dashed, thin] (0,1) -- (6,1) -- (6,0);
\draw[thick, blue!60, domain=0.86:7, samples=60, smooth] plot (\x, {6/\x});
\foreach \x/\y in {1/6,2/3,3/2,4/1.5,6/1} \fill (\x,\y) circle (0.06);
\node[above right] at (2,3) {$A$};
\node[above right] at (6,1) {$B$};
\end{tikzpicture}
```

Il prodotto $p \cdot V$ di uno stato è l'area del rettangolo che ha un vertice nell'origine e quello opposto sul punto. La legge di Boyle, letta sul grafico, dice che tutti i punti di un'isoterma hanno rettangoli della stessa area: quello di $A$ è alto e stretto, quello di $B$ basso e largo, e tutti e due valgono $600\,\text{J}$. La curva si avvicina ai due assi senza toccarli, perché né la pressione né il volume possono diventare zero se il prodotto deve restare $600\,\text{J}$.

Se lo stesso gas viene portato a una temperatura più alta e si ripete l'esperimento, si trova di nuovo un prodotto costante, ma più grande: a parità di volume, il gas più caldo ha una pressione maggiore. Ogni temperatura ha la sua isoterma, e le isoterme delle temperature più alte stanno più lontane dagli assi. Due isoterme diverse non si incontrano mai: un punto in comune sarebbe uno stato con due temperature.

```tikz
% nome: boyle-famiglia-isoterme
% alt: Tre isoterme dello stesso gas nel piano pressione-volume, tre rami di iperbole uno dentro l'altro: la più vicina agli assi è alla temperatura più bassa T1, la più lontana alla più alta T3. Una freccia verticale a volume fissato le attraversa dal basso verso l'alto: a parità di volume, il gas più caldo ha la pressione più grande
\begin{tikzpicture}
\draw[->] (0,0) -- (5.6,0) node[right] {$V$};
\draw[->] (0,0) -- (0,4.4) node[above] {$p$};
\draw[thick, blue!60, domain=0.385:5, samples=60, smooth] plot (\x, {1.5/\x});
\draw[thick, orange!90!black, domain=0.77:5, samples=60, smooth] plot (\x, {3/\x});
\draw[thick, red!80!black, domain=1.155:5, samples=60, smooth] plot (\x, {4.5/\x});
\node[right, blue!60] at (5,0.3) {$T_1$};
\node[right, orange!90!black] at (5,0.65) {$T_2$};
\node[right, red!80!black] at (5,1.0) {$T_3$};
\draw[dashed, thin] (2,0) -- (2,0.75);
\draw[-{Stealth}, thin] (2,0.75) -- (2,2.25);
\foreach \y in {0.75,1.5,2.25} \fill (2,\y) circle (0.05);
\node[right] at (2.7,3.4) {$T_1 < T_2 < T_3$};
\end{tikzpicture}
```

```ad-example
Esempio 3: stessa isoterma oppure no
Il gas della tabella passa dallo stato $A$ ($2{,}0\,\text{L}$, $300\,\text{kPa}$) allo stato $B$ ($6{,}0\,\text{L}$, $100\,\text{kPa}$), e in un secondo esperimento dallo stato $A$ allo stato $C$ ($4{,}0\,\text{L}$, $120\,\text{kPa}$). In quale dei due stati finali il gas ha la stessa temperatura che aveva in $A$?

Due stati sono sulla stessa isoterma se hanno lo stesso prodotto $p \cdot V$:

$$p_A V_A = 300\,\text{kPa} \cdot 2{,}0\,\text{L} = 600\,\text{J} \qquad p_B V_B = 100\,\text{kPa} \cdot 6{,}0\,\text{L} = 600\,\text{J} \qquad p_C V_C = 120\,\text{kPa} \cdot 4{,}0\,\text{L} = 480\,\text{J}$$

$B$ è sull'isoterma di $A$: il gas ha la temperatura di partenza. $C$ ha un prodotto più piccolo, quindi sta su un'isoterma più vicina agli assi: in $C$ il gas è più freddo che in $A$. Alla temperatura di $A$, con un volume di $4{,}0\,\text{L}$, la pressione sarebbe $600\,\text{J} / 4{,}0\,\text{L} = 150\,\text{kPa}$, non $120\,\text{kPa}$.
```

```tikz
% nome: boyle-stati-a-b-c
% alt: Il piano pressione-volume con l'isoterma che passa per gli stati A, a 2,0 litri e 300 kilopascal, e B, a 6,0 litri e 100 kilopascal. Lo stato C, a 4,0 litri e 120 kilopascal, sta sotto questa curva, su un'altra isoterma tratteggiata più vicina agli assi
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid (7,5);
\draw[->] (0,0) -- (7.5,0);
\node[below] at (7.3,-0.35) {$V$ (L)};
\draw[->] (0,0) -- (0,5.5) node[above] {$p$ (kPa)};
\foreach \x in {1,...,7} \node[below] at (\x,0) {\small $\x$};
\foreach \y/\t in {1/100,2/200,3/300,4/400} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60, domain=1.2:7, samples=60, smooth] plot (\x, {6/\x});
\draw[thick, dashed, blue!60, domain=0.96:7, samples=60, smooth] plot (\x, {4.8/\x});
\fill (2,3) circle (0.06) node[above right] {$A$};
\fill (6,1) circle (0.06) node[above right] {$B$};
\fill (4,1.2) circle (0.06) node[below left] {$C$};
\node[right, blue!60] at (1.3,4.7) {$600$ J};
\node[left, blue!60] at (0.95,4.7) {$480$ J};
\end{tikzpicture}
```

## Perché vale

La spiegazione sta nelle molecole. La pressione di un gas viene dagli urti delle sue molecole contro le pareti, e a temperatura costante le molecole si muovono, in media, sempre con la stessa rapidità. Se il volume si dimezza, le stesse molecole stanno in metà dello spazio: ogni centimetro quadrato di parete ne riceve il doppio ogni secondo, e la pressione raddoppia. Il conto completo, che dagli urti arriva alla pressione, è nella lezione [La teoria cinetica dei gas](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-teoria-cinetica-dei-gas).

## Due problemi con la legge di Stevino

Spesso la pressione del gas non è data, e va trovata dall'equilibrio con un liquido. Lo strumento è la [legge di Stevino](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-legge-di-stevino-e-i-vasi-comunicanti): a profondità $h$ in un liquido di densità $d$ la pressione è $p = p_0 + d\,g\,h$.

```ad-example
Esempio 4: una bolla che sale dal fondo del lago
Sul fondo di un lago, a $15\,\text{m}$ di profondità, si stacca una bolla d'aria di $2{,}0\,\text{cm}^3$. Che volume ha quando arriva in superficie, se la temperatura dell'acqua è la stessa a tutte le profondità? ($d = 1000\,\text{kg/m}^3$, $p_0 = 1{,}01 \cdot 10^5\,\text{Pa}$)

L'aria della bolla ha la pressione dell'acqua che la circonda. Sul fondo:

$$p_1 = p_0 + d\,g\,h = 1{,}01 \cdot 10^5\,\text{Pa} + 1000\,\text{kg/m}^3 \cdot 9{,}8\,\text{m/s}^2 \cdot 15\,\text{m} = 1{,}01 \cdot 10^5\,\text{Pa} + 1{,}47 \cdot 10^5\,\text{Pa} = 2{,}48 \cdot 10^5\,\text{Pa}$$

In superficie $p_2 = p_0$. Da $p_1 V_1 = p_2 V_2$:

$$V_2 = \frac{p_1\,V_1}{p_2} = \frac{2{,}48 \cdot 10^5\,\text{Pa} \cdot 2{,}0\,\text{cm}^3}{1{,}01 \cdot 10^5\,\text{Pa}} = 4{,}91\ldots\,\text{cm}^3 \approx 4{,}9\,\text{cm}^3$$

Le pressioni sono in pascal tutte e due, e il volume può restare in centimetri cubi. La bolla, salendo, diventa quasi due volte e mezzo più grande.
```

```tikz
% nome: boyle-bolla-lago
% alt: La sezione di un lago profondo 15 metri. Sul fondo una bolla piccola, alla pressione p1 uguale a p zero più d g h; vicino alla superficie la stessa bolla, più grande, alla pressione atmosferica p zero. Una quota a destra segna la profondità h
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (5,3);
\draw[thin] (0,3) -- (5,3);
\draw[thick] (0,3.4) -- (0,0) -- (5,0) -- (5,3.4);
\foreach \x in {0.15,0.3,...,5} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=cyan!5] (1.3,0.35) circle (0.12);
\draw[thick, fill=cyan!5] (3.2,2.7) circle (0.16);
\draw[-{Stealth}, thin, dashed] (1.5,0.6) -- (3.0,2.45);
\node[right] at (1.5,0.35) {$p_1 = p_0 + d\,g\,h$};
\node[left] at (3.0,2.7) {$p_2 = p_0$};
\node[above] at (2.5,3.05) {$p_0$};
\draw[{Stealth}-{Stealth}, thin] (5.4,0) -- (5.4,3);
\node[right] at (5.4,1.5) {$h = 15$ m};
\end{tikzpicture}
```

```ad-warning
La pressione sul fondo comprende quella atmosferica
Con $p_1 = d\,g\,h = 1{,}47 \cdot 10^5\,\text{Pa}$, senza $p_0$, la bolla in superficie verrebbe di $2{,}9\,\text{cm}^3$ e non di $4{,}9\,\text{cm}^3$. Sopra l'acqua c'è l'aria, e la sua pressione si trasmette fino al fondo.
```

Nei tubi sottili di laboratorio le pressioni si misurano spesso in centimetri di mercurio, come nel [barometro di Torricelli](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione-atmosferica-e-la-sua-misura): la pressione atmosferica normale è quella di una colonna di mercurio alta $76{,}0\,\text{cm}$, e una colonna di mercurio alta $10{,}0\,\text{cm}$ aggiunge una pressione di $10{,}0\,\text{cmHg}$. Con questa unità la legge di Stevino diventa una somma di lunghezze.

```ad-example
Esempio 5: l'aria intrappolata da una goccia di mercurio
Un tubo di vetro sottile, chiuso a un'estremità, contiene una colonnina di mercurio lunga $10{,}0\,\text{cm}$ che intrappola dell'aria contro il fondo chiuso. Con il tubo orizzontale la colonna d'aria è lunga $20{,}0\,\text{cm}$. Quanto è lunga se si mette il tubo in verticale, con l'apertura in alto? La pressione atmosferica è $76{,}0\,\text{cmHg}$.

Con il tubo orizzontale il mercurio non pesa sull'aria: è in equilibrio tra l'aria intrappolata e quella esterna, quindi $p_1 = 76{,}0\,\text{cmHg}$. Con il tubo verticale la colonnina di mercurio sta sopra l'aria intrappolata e le aggiunge la sua pressione:

$$p_2 = 76{,}0\,\text{cmHg} + 10{,}0\,\text{cmHg} = 86{,}0\,\text{cmHg}$$

Il tubo ha sempre la stessa sezione, quindi al posto dei volumi si usano le lunghezze, $p_1\,l_1 = p_2\,l_2$:

$$l_2 = \frac{p_1\,l_1}{p_2} = \frac{76{,}0\,\text{cmHg} \cdot 20{,}0\,\text{cm}}{86{,}0\,\text{cmHg}} = 17{,}67\ldots\,\text{cm} \approx 17{,}7\,\text{cm}$$

Capovolgendo il tubo, con l'apertura in basso, il mercurio tirerebbe invece di spingere: $p = 76{,}0 - 10{,}0 = 66{,}0\,\text{cmHg}$, e la colonna d'aria si allungherebbe fino a $23{,}0\,\text{cm}$.
```

```tikz
% nome: boyle-tubo-mercurio-aria
% alt: Lo stesso tubo di vetro chiuso a un'estremità in due posizioni. In orizzontale l'aria intrappolata occupa 20,0 centimetri tra il fondo chiuso e una colonnina di mercurio lunga 10,0 centimetri. In verticale, con l'apertura in alto, la colonnina di mercurio sta sopra l'aria, che si è accorciata a 17,7 centimetri
\begin{tikzpicture}
\fill[blue!10] (0,0) rectangle (2,0.3);
\fill[gray!60] (2,0) rectangle (3,0.3);
\draw[thick] (3.8,0.3) -- (0,0.3) -- (0,0) -- (3.8,0);
\draw[{Stealth}-{Stealth}, thin] (0,-0.3) -- (2,-0.3);
\node[below] at (1,-0.3) {$20{,}0$ cm};
\draw[{Stealth}-{Stealth}, thin] (2,-0.3) -- (3,-0.3);
\node[below] at (2.9,-0.3) {$10{,}0$ cm};
\node[above] at (1,0.3) {aria, $p_1$};
\node[right] at (3.8,0.15) {$p_0$};
\fill[blue!10] (6,-0.9) rectangle (6.3,0.87);
\fill[gray!60] (6,0.87) rectangle (6.3,1.87);
\draw[thick] (6,2.9) -- (6,-0.9) -- (6.3,-0.9) -- (6.3,2.9);
\draw[{Stealth}-{Stealth}, thin] (6.6,-0.9) -- (6.6,0.87);
\node[right] at (6.6,0) {$17{,}7$ cm};
\draw[{Stealth}-{Stealth}, thin] (6.6,0.87) -- (6.6,1.87);
\node[right] at (6.6,1.37) {$10{,}0$ cm};
\node[left] at (6,0) {aria, $p_2$};
\node[above] at (6.15,2.9) {$p_0$};
\end{tikzpicture}
```

## Fino a dove vale

La legge di Boyle non è esatta per nessun gas vero: è la legge di un modello, il gas perfetto, a cui i gas veri assomigliano tanto più quanto più sono rarefatti e lontani dalla temperatura a cui diventano liquidi. L'aria a temperatura ambiente la segue molto bene fino a pressioni di parecchie atmosfere. A pressioni molto alte le molecole sono così vicine che contano il loro volume e le forze con cui si attirano, e il prodotto $p \cdot V$ non resta più costante; continuando a comprimere, sotto una certa temperatura il gas diventa liquido. Del modello parla la lezione [L'equazione di stato del gas perfetto](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto).

```ad-warning
Una compressione veloce non è un'isoterma
Dopo qualche pompata energica il fondo della pompa da bicicletta scotta: comprimendo il gas in fretta la sua temperatura sale, e la legge di Boyle non si può usare tra lo stato iniziale e quello finale. Vale solo se il gas, alla fine, è tornato alla temperatura di partenza. Per questo negli esempi si legge "lentamente" o "si aspetta che torni alla temperatura della stanza". Quello che succede quando il calore non fa in tempo a uscire è nella lezione [La trasformazione adiabatica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/la-trasformazione-adiabatica).
```
