# La conservazione della quantità di moto

Due pattinatori fermi sul ghiaccio si spingono con le mani e partono in versi opposti, il più leggero più in fretta. Un fucile che spara dà un colpo all'indietro contro la spalla. In tutti e due i casi qualcosa che era fermo si divide in due parti che si allontanano, e le loro velocità non sono libere: sono legate dalle masse. La regola che le lega è la conservazione della [quantità di moto](/materiale/scuola-superiore/fisica/la-quantita-di-moto/la-quantita-di-moto), e vale ogni volta che un gruppo di corpi interagisce senza che dall'esterno arrivi una spinta.

## Sistema, forze interne e forze esterne

Un **sistema** è l'insieme dei corpi che decidi di studiare insieme: i due pattinatori, il fucile con il suo proiettile, due carrelli che si urtano. Scelto il sistema, le forze si dividono in due gruppi.

- Le **forze interne** sono quelle che i corpi del sistema esercitano l'uno sull'altro: la spinta delle mani tra i due pattinatori, la forza dei gas tra fucile e proiettile.
- Le **forze esterne** sono quelle esercitate da corpi che non fanno parte del sistema: il peso (lo esercita la Terra), la reazione del ghiaccio, l'attrito con il suolo.

La distinzione dipende dal sistema scelto. Se il sistema è il solo pattinatore A, la spinta di B è una forza esterna; se il sistema sono A e B insieme, la stessa spinta è interna.

```tikz
% nome: sistema-forze-interne-esterne
% alt: Due carrelli, 1 e 2, su un piano orizzontale, racchiusi da un contorno tratteggiato che indica il sistema. Tra i due carrelli agiscono due forze orizzontali uguali e opposte, in arancione: F 21 sul carrello 1 verso sinistra e F 12 sul carrello 2 verso destra, le forze interne. Su ciascun carrello agiscono in rosso il peso verso il basso e la reazione del piano verso l'alto, le forze esterne, che si bilanciano
\begin{tikzpicture}
\draw[thick] (-0.4,0) -- (6.4,0);
\foreach \x in {-0.25,-0.1,...,6.4} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (1.6,0) rectangle ++(1.2,0.8);
\draw[thick, fill=blue!10] (3.2,0) rectangle ++(1.2,0.8);
\node at (1.85,0.22) {\small $1$};
\node at (4.15,0.22) {\small $2$};
\draw[dashed, thin] (0.1,-0.75) rectangle (5.9,2.0);
\node[above] at (3,2.0) {\small sistema};
\draw[-{Stealth}, thick, orange!90!black] (2.2,0.5) -- (0.9,0.5) node[above] {$\vec{F}_{21}$};
\draw[-{Stealth}, thick, orange!90!black] (3.8,0.5) -- (5.1,0.5) node[above] {$\vec{F}_{12}$};
\draw[-{Stealth}, thick, red] (2.5,0.4) -- (2.5,-0.6);
\draw[-{Stealth}, thick, red] (2.5,0.8) -- (2.5,1.8);
\draw[-{Stealth}, thick, red] (3.5,0.4) -- (3.5,-0.6);
\draw[-{Stealth}, thick, red] (3.5,0.8) -- (3.5,1.8);
\end{tikzpicture}
```

Nella figura $\vec{F}_{21}$ è la forza che il carrello 2 esercita sul carrello 1, e $\vec{F}_{12}$ quella che 1 esercita su 2. Le forze interne compaiono sempre a coppie di questo tipo, e per il [terzo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-terzo-principio-della-dinamica) le due forze di una coppia sono uguali e opposte:

$$\vec{F}_{12} = -\vec{F}_{21}$$

## Perché la quantità di moto totale si conserva

La quantità di moto totale del sistema è la somma vettoriale di quelle dei suoi corpi, $\vec{p}_{tot} = \vec{p}_1 + \vec{p}_2$. Supponiamo che sui due carrelli agiscano solo le forze interne, per un intervallo di tempo $\Delta t$. Il [teorema dell'impulso](/materiale/scuola-superiore/fisica/la-quantita-di-moto/l-impulso-e-il-teorema-dell-impulso) dice di quanto cambia la quantità di moto di ciascuno:

$$\Delta\vec{p}_1 = \vec{F}_{21}\,\Delta t \qquad \Delta\vec{p}_2 = \vec{F}_{12}\,\Delta t$$

Le due forze sono opposte e durano lo stesso tempo, perché sono le due facce della stessa interazione. Quindi $\Delta\vec{p}_2 = -\Delta\vec{p}_1$: quello che un carrello guadagna, l'altro lo perde. Sommando,

$$\Delta\vec{p}_{tot} = \Delta\vec{p}_1 + \Delta\vec{p}_2 = \vec{0}$$

Le forze interne spostano quantità di moto da un corpo all'altro, ma non cambiano il totale. Se la forza non è costante il ragionamento si ripete su intervalli di tempo molto brevi, in ognuno dei quali le due forze sono comunque opposte, e il risultato è lo stesso.

Se agiscono anche forze esterne, sono le sole a contare. Chiamando $\vec{F}_{est}$ la loro risultante, la quantità di moto totale cambia così:

$$\Delta\vec{p}_{tot} = \vec{F}_{est}\,\Delta t$$

È il secondo principio scritto per l'intero sistema, e si ottiene come sopra: nella somma le forze interne si cancellano a coppie e restano le esterne.

## La legge di conservazione

Un sistema è **isolato** quando la risultante delle forze esterne è nulla. Dalla formula precedente, con $\vec{F}_{est} = \vec{0}$:

$$\vec{p}_{tot} = \text{costante}$$

È la **legge di conservazione della quantità di moto**: in un sistema isolato la quantità di moto totale non cambia, qualunque cosa succeda tra i corpi che lo formano. Per due corpi, con le velocità $\vec{v}_1$ e $\vec{v}_2$ prima dell'interazione e $\vec{V}_1$ e $\vec{V}_2$ dopo,

$$m_1\vec{v}_1 + m_2\vec{v}_2 = m_1\vec{V}_1 + m_2\vec{V}_2$$

La legge non chiede di sapere quanto valgono le forze interne né quanto durano: confronta solo il prima e il dopo. Per questo funziona negli urti e nelle esplosioni, dove le forze sono grandi, brevissime e quasi impossibili da misurare.

```ad-warning
Si conserva il totale, non la quantità di moto di ogni corpo
Nella spinta ogni pattinatore cambia la propria quantità di moto, e di molto. A restare uguale è la somma delle due. Se segui un corpo solo, la sua quantità di moto cambia come dice il teorema dell'impulso.
```

### Quando un sistema si può trattare come isolato

Nei problemi i sistemi sono isolati per uno di questi motivi.

- Le forze esterne si bilanciano. Sui pattinatori agiscono il peso e la reazione del ghiaccio, uguali e opposti: la loro risultante è zero. Serve che l'attrito sia trascurabile, ed è il motivo per cui gli esempi si svolgono sul ghiaccio, su rotaie a cuscino d'aria o su carrelli con ruote scorrevoli.
- L'interazione è molto breve. In uno sparo o in un'esplosione le forze interne sono enormi e durano pochi millesimi di secondo: in un tempo così corto l'impulso del peso e dell'attrito, $\vec{F}_{est}\,\Delta t$, è piccolissimo rispetto alle quantità di moto in gioco. La conservazione vale allora tra l'istante subito prima e l'istante subito dopo.
- Le forze esterne non esistono, come per un'astronauta lontana da tutto. È il caso ideale.

Poiché la quantità di moto è un vettore, la legge vale direzione per direzione. Se le forze esterne sono tutte verticali, come il peso e la reazione di un piano orizzontale, si conserva la componente orizzontale della quantità di moto totale anche quando quella verticale cambia.

## Come si risolve un problema

1. Scegli il sistema, in modo che le forze che non conosci siano interne, e controlla che si possa trattare come isolato.
2. Fissa un asse (due, se il moto è nel piano) e scegli il verso positivo.
3. Scrivi la quantità di moto totale prima, con il segno di ogni velocità.
4. Scrivi la quantità di moto totale dopo, con l'incognita.
5. Uguaglia le due espressioni e ricava l'incognita. Il segno del risultato dà il verso.

## Corpi fermi che si separano

Se all'inizio tutto è fermo, la quantità di moto totale è zero e resta zero. Per due corpi

$$0 = m_1 V_1 + m_2 V_2 \quad\Rightarrow\quad V_2 = -\frac{m_1}{m_2}\,V_1$$

Il segno meno dice che i due corpi partono in versi opposti. I moduli delle velocità sono inversamente proporzionali alle masse: il corpo con metà della massa parte a velocità doppia. Le due quantità di moto hanno sempre lo stesso modulo.

```ad-example
Esempio 1: i due pattinatori
Anna, di $50\,\text{kg}$, e Bruno, di $75\,\text{kg}$, sono fermi sul ghiaccio uno di fronte all'altra e si spingono con le mani. Dopo la spinta Anna si muove verso sinistra a $3{,}0\,\text{m/s}$. Con che velocità si muove Bruno?

```tikz
% nome: pattinatori-prima-dopo
% alt: Due righe. In alto, prima della spinta, i pattinatori A e B sono due blocchi fermi che si toccano. In basso, dopo la spinta, i due blocchi sono lontani: A ha una velocità verso sinistra lunga 1,5 centimetri, 3,0 metri al secondo, e B una velocità verso destra lunga 1,0 centimetri, da trovare; le frecce sono in scala, mezzo centimetro per ogni metro al secondo
\begin{tikzpicture}
\node[left] at (-0.2,2.25) {\small prima};
\draw[thick] (0,1.9) -- (6.4,1.9);
\foreach \x in {0.15,0.3,...,6.4} \draw[thin] (\x,1.9) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (2.5,1.9) rectangle ++(0.7,0.7);
\draw[thick, fill=orange!25] (3.2,1.9) rectangle ++(0.7,0.9);
\node at (2.85,2.25) {\small $A$};
\node at (3.55,2.3) {\small $B$};
\node[left] at (-0.2,0.35) {\small dopo};
\draw[thick] (0,0) -- (6.4,0);
\foreach \x in {0.15,0.3,...,6.4} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (1.5,0) rectangle ++(0.7,0.7);
\draw[thick, fill=orange!25] (4.3,0) rectangle ++(0.7,0.9);
\node at (1.85,0.35) {\small $A$};
\node at (4.65,0.4) {\small $B$};
\draw[-{Stealth}, thick, blue!60!black] (1.85,1.0) -- (0.35,1.0) node[above] {$\vec{V}_A$};
\draw[-{Stealth}, thick, blue!60!black] (4.65,1.2) -- (5.65,1.2) node[above] {$\vec{V}_B$};
\draw[->] (5.2,-0.6) -- (6.3,-0.6) node[right] {$x$};
\end{tikzpicture}
```

Il sistema è formato dai due pattinatori. Il peso e la reazione del ghiaccio si bilanciano e l'attrito è trascurabile: il sistema è isolato. Con l'asse $x$ verso destra, la velocità di Anna è $V_A = -3{,}0\,\text{m/s}$. Prima della spinta la quantità di moto totale è zero, quindi

$$0 = m_A V_A + m_B V_B$$

$$V_B = -\frac{m_A}{m_B}\,V_A = -\frac{50\,\text{kg}}{75\,\text{kg}} \cdot (-3{,}0\,\text{m/s}) = 2{,}0\,\text{m/s}$$

Bruno si muove verso destra a $2{,}0\,\text{m/s}$. Le due quantità di moto sono $-150\,\text{kg}\cdot\text{m/s}$ e $+150\,\text{kg}\cdot\text{m/s}$: la loro somma è zero, come prima della spinta.
```

Nella figura qui sotto due carrelli fermi hanno tra loro una molla compressa, che quando la liberi dà sempre la stessa energia, $6{,}0\,\text{J}$. Scegli le due masse e guarda che cosa cambia e che cosa no.

```interattivo
% nome: carrelli-molla-rinculo
% alt: Due carrelli fermi su una rotaia con una molla compressa in mezzo. Due cursori scelgono le masse, da 0,5 a 4 chilogrammi, e un bottone libera la molla: i carrelli partono in versi opposti. Sopra ogni carrello è disegnata la sua quantità di moto, e le due frecce sono sempre lunghe uguali; sotto sono scritte le due velocità, le due quantità di moto e la loro somma, che resta zero
```

Con masse uguali i due carrelli partono alla stessa velocità. Se raddoppi la massa di uno, quello parte a metà della velocità dell'altro: con $1{,}0\,\text{kg}$ e $2{,}0\,\text{kg}$ le velocità sono $2{,}8\,\text{m/s}$ e $1{,}4\,\text{m/s}$. Le due frecce della quantità di moto restano però lunghe uguali, e la loro somma è zero per qualunque coppia di masse.

## Il rinculo

Quando un'arma spara, il proiettile parte in avanti e l'arma arretra: è il **rinculo**. Prima dello sparo fucile e proiettile sono fermi e la quantità di moto totale è zero; i gas dell'esplosione spingono il proiettile in avanti e il fucile all'indietro con forze interne al sistema. Dopo lo sparo le due quantità di moto sono uguali e opposte.

```tikz
% nome: fucile-rinculo
% alt: Un fucile, disegnato come un rettangolo lungo, e un proiettile, un piccolo cerchio, appena uscito dalla canna verso destra. Dal proiettile parte la freccia della quantità di moto p p verso destra, dal fucile la freccia p f verso sinistra: le due frecce hanno la stessa lunghezza
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) rectangle (3.2,0.35);
\draw[thick, fill=gray!20] (0,0) -- (-0.9,-0.5) -- (-0.9,0.1) -- (0,0.35) -- cycle;
\draw[thick, fill=blue!10] (4.0,0.18) circle (0.1);
\draw[-{Stealth}, thick, blue] (4.1,0.18) -- (5.9,0.18) node[above] {$\vec{p}_p$};
\draw[-{Stealth}, thick, blue] (1.6,0.7) -- (-0.2,0.7) node[above] {$\vec{p}_f$};
\node[below] at (1.6,0) {\small fucile, $m_f$};
\node[below] at (4.0,0.05) {\small proiettile, $m_p$};
\end{tikzpicture}
```

```ad-example
Esempio 2: il rinculo di un fucile
Un fucile di $4{,}0\,\text{kg}$ spara un proiettile di $12\,\text{g}$, che esce dalla canna a $6{,}0 \cdot 10^2\,\text{m/s}$. Con che velocità arretra il fucile, se chi spara non lo trattiene?

La massa del proiettile va in kilogrammi: $m_p = 12\,\text{g} = 0{,}012\,\text{kg}$. Con l'asse nel verso del proiettile, $V_p = 6{,}0 \cdot 10^2\,\text{m/s}$, e

$$0 = m_p V_p + m_f V_f$$

$$V_f = -\frac{m_p V_p}{m_f} = -\frac{0{,}012\,\text{kg} \cdot 6{,}0 \cdot 10^2\,\text{m/s}}{4{,}0\,\text{kg}} = -1{,}8\,\text{m/s}$$

Il fucile arretra a $1{,}8\,\text{m/s}$. Le due quantità di moto hanno lo stesso modulo, $7{,}2\,\text{kg}\cdot\text{m/s}$; il fucile ha una massa circa 330 volte più grande di quella del proiettile, e una velocità 330 volte più piccola.
```

```ad-warning
Uguali sono le quantità di moto, non le velocità
Fucile e proiettile non partono alla stessa velocità, e nemmeno con la stessa energia cinetica. Nell'esempio 2 il proiettile ha $K = \tfrac{1}{2} \cdot 0{,}012 \cdot 600^2 \approx 2{,}2 \cdot 10^3\,\text{J}$, il fucile solo $\tfrac{1}{2} \cdot 4{,}0 \cdot 1{,}8^2 \approx 6{,}5\,\text{J}$: quasi tutta l'energia va al corpo più leggero.
```

```ad-warning
Le masse nella stessa unità
Se una massa è in grammi e l'altra in kilogrammi, il risultato è sbagliato di un fattore mille. Con $12$ al posto di $0{,}012$ il fucile dell'esempio 2 arretrerebbe a $1800\,\text{m/s}$.
```

Un razzo funziona allo stesso modo, senza bisogno di aria o di suolo su cui spingersi: espelle all'indietro i gas di scarico ad alta velocità, e la quantità di moto che i gas portano via in un verso il razzo la guadagna nel verso opposto.

## Un sistema già in moto

Se prima dell'interazione il sistema si muove, la quantità di moto totale non è zero, ma si conserva lo stesso. Il procedimento non cambia: totale prima uguale a totale dopo.

```ad-example
Esempio 3: lo zaino lanciato in avanti
Una pattinatrice di $60\,\text{kg}$ scivola sul ghiaccio a $2{,}0\,\text{m/s}$ con in mano uno zaino di $5{,}0\,\text{kg}$. A un certo punto lancia lo zaino in avanti, nella direzione del moto, e lo zaino parte a $8{,}0\,\text{m/s}$ rispetto al ghiaccio. Qual è la velocità della pattinatrice dopo il lancio?

```tikz
% nome: zaino-prima-dopo
% alt: Due righe. In alto, prima del lancio, la pattinatrice e lo zaino sono un blocco grande con un quadratino attaccato e si muovono insieme verso destra con velocità v, 2,0 metri al secondo. In basso, dopo il lancio, lo zaino è staccato e va verso destra a 8,0 metri al secondo, con una freccia lunga; la pattinatrice ha una velocità V più corta, da trovare
\begin{tikzpicture}
\node[left] at (-0.2,2.35) {\small prima};
\draw[thick] (0,1.9) -- (6.6,1.9);
\foreach \x in {0.15,0.3,...,6.6} \draw[thin] (\x,1.9) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (1.0,1.9) rectangle ++(0.7,0.9);
\draw[thick, fill=orange!25] (1.7,2.2) rectangle ++(0.3,0.3);
\draw[-{Stealth}, thick, blue!60!black] (1.35,3.05) -- (1.95,3.05) node[right] {$\vec{v}$};
\node[left] at (-0.2,0.45) {\small dopo};
\draw[thick] (0,0) -- (6.6,0);
\foreach \x in {0.15,0.3,...,6.6} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (1.6,0) rectangle ++(0.7,0.9);
\draw[thick, fill=orange!25] (3.6,0.3) rectangle ++(0.3,0.3);
\draw[-{Stealth}, thick, blue!60!black] (1.95,1.15) -- (2.4,1.15) node[right] {$\vec{V}$};
\draw[-{Stealth}, thick, blue!60!black] (3.75,0.85) -- (6.15,0.85) node[above] {\small $8{,}0$ m/s};
\end{tikzpicture}
```

Il sistema è formato dalla pattinatrice e dallo zaino; la forza del lancio è interna. Con l'asse nel verso del moto, prima del lancio i due si muovono insieme:

$$p_{tot} = (m + m_z)\,v = (60\,\text{kg} + 5{,}0\,\text{kg}) \cdot 2{,}0\,\text{m/s} = 130\,\text{kg}\cdot\text{m/s}$$

Dopo il lancio la pattinatrice ha velocità $V$ e lo zaino $V_z = 8{,}0\,\text{m/s}$:

$$m V + m_z V_z = p_{tot} \quad\Rightarrow\quad V = \frac{p_{tot} - m_z V_z}{m} = \frac{130\,\text{kg}\cdot\text{m/s} - 5{,}0\,\text{kg} \cdot 8{,}0\,\text{m/s}}{60\,\text{kg}} = 1{,}5\,\text{m/s}$$

La pattinatrice continua in avanti, ma più piano: ha ceduto allo zaino $30\,\text{kg}\cdot\text{m/s}$ della propria quantità di moto.
```

```ad-warning
Prima del lancio la massa è quella di tutto il sistema
Nell'esempio 3 la quantità di moto iniziale è $(60 + 5{,}0)\,\text{kg} \cdot 2{,}0\,\text{m/s}$, non $60\,\text{kg} \cdot 2{,}0\,\text{m/s}$: anche lo zaino si stava muovendo. Dimenticarlo dà $V = 1{,}3\,\text{m/s}$.
```

## Le esplosioni nel piano

Un corpo fermo che esplode in più frammenti ha quantità di moto totale zero prima e dopo: le quantità di moto dei frammenti, sommate come vettori, devono dare zero. Con due frammenti questo li obbliga a partire lungo la stessa retta, in versi opposti. Con tre frammenti i vettori possono avere direzioni diverse, e la conservazione si scrive [per componenti](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore), una equazione lungo $x$ e una lungo $y$:

$$p_{1x} + p_{2x} + p_{3x} = 0 \qquad p_{1y} + p_{2y} + p_{3y} = 0$$

```ad-example
Esempio 4: tre frammenti
Un oggetto fermo di $1{,}0\,\text{kg}$ esplode in tre frammenti, che si muovono su un piano orizzontale liscio. Il primo, di $0{,}20\,\text{kg}$, parte a $6{,}0\,\text{m/s}$ lungo l'asse $x$; il secondo, di $0{,}30\,\text{kg}$, a $3{,}0\,\text{m/s}$ lungo l'asse $y$. Con che velocità e in che direzione parte il terzo?

Il terzo frammento ha la massa che resta: $m_3 = 1{,}0\,\text{kg} - 0{,}20\,\text{kg} - 0{,}30\,\text{kg} = 0{,}50\,\text{kg}$. Le quantità di moto dei primi due sono

$$p_1 = 0{,}20\,\text{kg} \cdot 6{,}0\,\text{m/s} = 1{,}2\,\text{kg}\cdot\text{m/s} \qquad p_2 = 0{,}30\,\text{kg} \cdot 3{,}0\,\text{m/s} = 0{,}90\,\text{kg}\cdot\text{m/s}$$

la prima lungo $x$, la seconda lungo $y$. Perché la somma sia zero su ogni asse, il terzo frammento deve avere

$$p_{3x} = -1{,}2\,\text{kg}\cdot\text{m/s} \qquad p_{3y} = -0{,}90\,\text{kg}\cdot\text{m/s}$$

```tikz
% nome: esplosione-tre-frammenti
% alt: Un piano cartesiano con tre frecce che partono dall'origine, le quantità di moto dei tre frammenti, in scala: p 1 lungo l'asse x positivo, lunga 2,4 centimetri; p 2 lungo l'asse y positivo, lunga 1,8 centimetri; p 3 in arancione nel terzo quadrante, lunga 3 centimetri, opposta alla somma delle prime due, che è disegnata tratteggiata nel primo quadrante. Un arco segna l'angolo alfa tra p 3 e l'asse x negativo
\begin{tikzpicture}
\draw[->] (-3.2,0) -- (3.4,0) node[right] {$x$};
\draw[->] (0,-2.5) -- (0,2.6) node[above] {$y$};
\draw[dashed, thin] (2.4,0) -- (2.4,1.8) -- (0,1.8);
\draw[-{Stealth}, thick, blue, dashed] (0,0) -- (2.4,1.8);
\node[right] at (2.4,1.9) {\small $\vec{p}_1 + \vec{p}_2$};
\draw[-{Stealth}, thick, blue] (0,0) -- (2.4,0) node[below] {$\vec{p}_1$};
\draw[-{Stealth}, thick, blue] (0,0) -- (0,1.8) node[left] {$\vec{p}_2$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (-2.4,-1.8) node[below] {$\vec{p}_3$};
\draw[thin] (-0.9,0) arc[start angle=180, end angle=216.87, radius=0.9];
\node at (-1.25,-0.4) {$\alpha$};
\fill (0,0) circle (1.5pt);
\end{tikzpicture}
```

Il modulo viene dal teorema di Pitagora:

$$p_3 = \sqrt{(1{,}2)^2 + (0{,}90)^2}\,\text{kg}\cdot\text{m/s} = 1{,}5\,\text{kg}\cdot\text{m/s} \qquad V_3 = \frac{p_3}{m_3} = \frac{1{,}5\,\text{kg}\cdot\text{m/s}}{0{,}50\,\text{kg}} = 3{,}0\,\text{m/s}$$

Le due componenti sono negative: il frammento parte nel terzo quadrante, dalla parte opposta alla somma $\vec{p}_1 + \vec{p}_2$. L'angolo che forma con il semiasse negativo delle $x$ è

$$\alpha = \tan^{-1}\frac{0{,}90}{1{,}2} = 36{,}8\ldots^\circ \approx 37^\circ$$
```

## La quantità di moto si conserva, l'energia cinetica no

Nell'esempio 1 i pattinatori partono da fermi, con energia cinetica zero, e dopo la spinta ne hanno

$$K = \frac{1}{2} \cdot 50\,\text{kg} \cdot (3{,}0\,\text{m/s})^2 + \frac{1}{2} \cdot 75\,\text{kg} \cdot (2{,}0\,\text{m/s})^2 = 225\,\text{J} + 150\,\text{J} = 375\,\text{J}$$

La quantità di moto totale è rimasta zero, l'energia cinetica totale è passata da zero a $375\,\text{J}$. Non c'è contraddizione. La quantità di moto è un vettore, e due vettori opposti si cancellano; l'energia cinetica è uno scalare mai negativo, e i contributi dei due corpi si sommano sempre. I $375\,\text{J}$ vengono dall'energia chimica dei muscoli, come nello sparo vengono da quella della polvere e nei carrelli della figura da quella elastica della molla.

In un sistema isolato la quantità di moto totale si conserva sempre; l'energia cinetica totale può aumentare, come in una spinta o in un'esplosione, restare uguale o diminuire. Che cosa le succede quando due corpi si scontrano è l'argomento delle lezioni sugli [urti anelastici](/materiale/scuola-superiore/fisica/la-quantita-di-moto/gli-urti-anelastici) e sugli [urti elastici](/materiale/scuola-superiore/fisica/la-quantita-di-moto/gli-urti-elastici-in-una-e-in-due-dimensioni).
