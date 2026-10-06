# Momento torcente e dinamica delle rotazioni

Per far partire la giostrina dei giardinetti la spingi sul bordo, lungo la tangente, e non vicino al perno; e una giostrina carica di bambini, con la stessa spinta, prende velocità molto più lentamente di una vuota. Nella prima osservazione c'è il momento della forza, nella seconda il momento d'inerzia. Messi insieme danno la legge che governa le rotazioni, la sorella di $\vec F_{tot} = m\,\vec a$: dice quale accelerazione angolare prende un corpo rigido quando le forze che agiscono su di esso tendono a farlo ruotare.

La lezione mette insieme tre cose già viste: il [momento di una forza](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/il-momento-di-una-forza-e-di-una-coppia-di-forze) del primo anno, l'[accelerazione angolare](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/velocita-angolare-e-accelerazione-angolare) e il [momento d'inerzia](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/il-momento-d-inerzia).

## Il momento torcente

L'effetto di una forza su un corpo che può ruotare attorno a un asse fisso si misura con il suo momento rispetto all'asse, che nelle rotazioni si chiama spesso **momento torcente**: è la stessa grandezza che al primo anno serviva per l'equilibrio delle aste e delle leve. Se la forza $\vec F$ è applicata in un punto $P$ a distanza $r$ dall'asse, e forma un angolo $\varphi$ con il segmento che va dall'asse a $P$, il momento vale

$$M = F\,b = r\,F \sin\varphi$$

dove $b = r \sin\varphi$ è il braccio, la distanza dell'asse dalla retta d'azione della forza. Il momento si misura in $\text{N} \cdot \text{m}$ ed è positivo se la forza tende a far ruotare il corpo in senso antiorario, negativo se tende a farlo ruotare in senso orario.

Qui consideriamo forze che stanno in un piano perpendicolare all'asse, come la spinta sulla giostra. Due casi danno momento nullo: una forza la cui retta d'azione passa per l'asse, perché il braccio è zero, e una forza applicata proprio sull'asse. Il peso di una ruota appesa per il centro e la forza con cui il perno la sostiene sono di questo tipo: tengono la ruota al suo posto, ma non la fanno girare.

## Il secondo principio per le rotazioni

Per una pallina di massa $m$ che gira a distanza $r$ dall'asse, la lezione sul momento d'inerzia ha mostrato che il momento della forza e l'accelerazione angolare sono legati da $M = (m\,r^2)\,\alpha$. Un corpo rigido è un insieme di tantissimi pezzetti, ognuno con la sua massa $m_i$ e la sua distanza $r_i$ dall'asse, e tutti con la stessa accelerazione angolare $\alpha$. Per ogni pezzetto vale la relazione della pallina, con il momento $M_i$ delle forze che agiscono su di lui; sommandole tutte si ottiene

$$M_1 + M_2 + \ldots = (m_1 r_1^2 + m_2 r_2^2 + \ldots)\,\alpha = I\,\alpha$$

A sinistra ci sono i momenti di tutte le forze che agiscono sui pezzetti: quelle esterne, applicate al corpo da fuori, e quelle interne, con cui ogni pezzetto tiene legati a sé i vicini. Le forze interne, però, si presentano a coppie. Per il [terzo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-terzo-principio-della-dinamica) la forza che un pezzetto esercita su un altro e quella che riceve da lui sono uguali e opposte; nei corpi rigidi, poi, le due forze agiscono lungo la stessa retta, quella che congiunge i due pezzetti. Hanno quindi lo stesso braccio e versi di rotazione opposti, e i loro momenti si cancellano. Nella somma restano solo i momenti delle forze esterne:

$$M_{tot} = I\,\alpha$$

È il **secondo principio della dinamica per le rotazioni**: il momento totale delle forze esterne rispetto all'asse di rotazione è uguale al prodotto del momento d'inerzia del corpo rispetto allo stesso asse per la sua accelerazione angolare. L'unità torna: $\text{kg} \cdot \text{m}^2 \cdot \text{rad/s}^2 = \text{kg} \cdot \text{m/s}^2 \cdot \text{m} = \text{N} \cdot \text{m}$, perché il radiante è un numero puro.

La corrispondenza con il moto su una retta è completa:

| Moto su una retta | Rotazione attorno a un asse |
|---|---|
| forza totale $F_{tot}$ | momento totale $M_{tot}$ |
| massa $m$ | momento d'inerzia $I$ |
| accelerazione $a$ | accelerazione angolare $\alpha$ |
| $F_{tot} = m\,a$ | $M_{tot} = I\,\alpha$ |

Come l'accelerazione ha il verso della forza totale, l'accelerazione angolare ha il segno del momento totale: un momento positivo dà $\alpha$ positiva. Se il corpo sta già girando in senso antiorario accelera, se sta girando in senso orario rallenta.

```ad-example
Esempio 1: una mola messa in moto
Una mola è un disco pieno di massa $2{,}0\,\text{kg}$ e raggio $0{,}25\,\text{m}$, libero di ruotare senza attrito attorno al suo asse. Una forza di $4{,}5\,\text{N}$ agisce sul bordo, tangente al disco. Quanto vale l'accelerazione angolare? Partendo da ferma, a quale velocità angolare arriva la mola in $3{,}0\,\text{s}$?

```tikz
% nome: mola-forza-tangente
% alt: Un disco visto di fronte, con il centro O e il raggio R di 0,25 metri disegnato fino a un punto del bordo, a destra; in quel punto una forza F di 4,5 newton, in rosso, è tangente al disco e diretta verso l'alto, e una freccia curva indica la rotazione in senso antiorario
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) circle (1.6);
\draw[thin] (0,0) -- (1.6,0);
\node[below] at (0.8,0) {\small $R$};
\draw[-{Stealth}, thick, red] (1.6,0) -- (1.6,1.5) node[right] {$\vec{F}$};
\fill (1.6,0) circle (1.5pt);
\fill (0,0) circle (1.5pt) node[below left] {$O$};
\draw[-{Stealth}, thin] (60:0.9) arc[start angle=60, end angle=150, radius=0.9];
\end{tikzpicture}
```

La forza è tangente, quindi perpendicolare al raggio: $\varphi = 90^\circ$ e il braccio è il raggio.

$$M = F\,R = 4{,}5\,\text{N} \cdot 0{,}25\,\text{m} = 1{,}125\,\text{N} \cdot \text{m}$$

Il momento d'inerzia del disco rispetto al suo asse è

$$I = \frac{1}{2}\,m R^2 = \frac{1}{2} \cdot 2{,}0\,\text{kg} \cdot (0{,}25\,\text{m})^2 = 0{,}0625\,\text{kg} \cdot \text{m}^2$$

Peso e reazione del perno passano per l'asse e non danno momento, quindi il momento totale è quello della forza:

$$\alpha = \frac{M_{tot}}{I} = \frac{1{,}125\,\text{N} \cdot \text{m}}{0{,}0625\,\text{kg} \cdot \text{m}^2} = 18\,\text{rad/s}^2$$

Con accelerazione angolare costante, dopo $3{,}0\,\text{s}$:

$$\omega = \omega_0 + \alpha\,t = 0 + 18\,\text{rad/s}^2 \cdot 3{,}0\,\text{s} = 54\,\text{rad/s}$$

circa $8{,}6$ giri al secondo.
```

```ad-warning
Momento e momento d'inerzia rispetto allo stesso asse
In $M_{tot} = I\,\alpha$ i momenti delle forze e il momento d'inerzia si calcolano tutti rispetto all'asse di rotazione. Per una porta che gira sui cardini il braccio si misura dai cardini e il momento d'inerzia è quello rispetto ai cardini, $\frac{1}{3} M a^2$, non quello rispetto al centro.
```

```ad-example
Esempio 2: una spinta obliqua sulla porta
Una porta ha momento d'inerzia $3{,}8\,\text{kg} \cdot \text{m}^2$ rispetto ai cardini. La spingi in un punto a $0{,}75\,\text{m}$ dai cardini con una forza di $12\,\text{N}$, che forma un angolo di $60^\circ$ con il piano della porta. Con quale accelerazione angolare parte la porta, se l'attrito dei cardini è trascurabile?

```tikz
% nome: porta-spinta-obliqua
% alt: Una porta vista dall'alto, disegnata come un'asta orizzontale con i cardini nel punto O a sinistra. In un punto P a 0,75 metri da O è applicata una forza F di 12 newton, in rosso, che forma un angolo di 60 gradi con la porta; la sua componente perpendicolare alla porta è tratteggiata. Scala di 1 centimetro per 0,2 metri e di 1 centimetro per 6 newton
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,-0.06) rectangle (4,0.06);
\draw[dashed, thin] (3.75,0) -- (5,0);
\draw[-{Stealth}, thick, dashed, red] (3.75,0) -- (3.75,1.732);
\draw[dashed, thin, red] (3.75,1.732) -- (4.75,1.732);
\draw[-{Stealth}, thick, red] (3.75,0) -- (4.75,1.732) node[right] {$\vec{F}$};
\node[red, left] at (3.75,1.1) {\small $F \sin\varphi$};
\draw[thin] (4.3,0) arc[start angle=0, end angle=60, radius=0.55];
\node at (4.62,0.3) {\small $60^\circ$};
\fill (3.75,0) circle (1.5pt) node[below] {$P$};
\draw[|-|, thin] (0,-0.55) -- (3.75,-0.55);
\node[below] at (1.875,-0.55) {\small $r = 0{,}75$ m};
\draw[thick, fill=white] (0,0) circle (2pt);
\node[left] at (-0.1,0) {$O$};
\end{tikzpicture}
```

Il segmento che va dai cardini al punto $P$ sta nel piano della porta, quindi l'angolo tra questo segmento e la forza è $\varphi = 60^\circ$. Solo la componente della forza perpendicolare alla porta, $F \sin\varphi$, la fa ruotare.

$$M = r\,F \sin\varphi = 0{,}75\,\text{m} \cdot 12\,\text{N} \cdot \sin 60^\circ = 7{,}79\ldots\,\text{N} \cdot \text{m}$$

$$\alpha = \frac{M}{I} = \frac{7{,}794\,\text{N} \cdot \text{m}}{3{,}8\,\text{kg} \cdot \text{m}^2} = 2{,}05\ldots\,\text{rad/s}^2 \approx 2{,}1\,\text{rad/s}^2$$

Spingendo perpendicolarmente alla porta, con la stessa forza, il momento sarebbe $0{,}75 \cdot 12 = 9{,}0\,\text{N} \cdot \text{m}$ e l'accelerazione angolare $2{,}4\,\text{rad/s}^2$.
```

Il secondo principio per le rotazioni funziona anche al contrario: se si conosce come cambia la velocità angolare, si ricava il momento che l'ha fatta cambiare.

```ad-example
Esempio 3: la ruota frenata
La ruota anteriore di una bicicletta sollevata da terra ha momento d'inerzia $0{,}12\,\text{kg} \cdot \text{m}^2$ e gira a $15\,\text{rad/s}$. Tirando il freno, i pattini la fermano in $2{,}5\,\text{s}$ con accelerazione angolare costante. Quanto vale il momento frenante? I pattini premono sul cerchione a $0{,}31\,\text{m}$ dall'asse: quanto vale la forza di attrito che esercitano in tutto?

Prendiamo come positivo il verso in cui gira la ruota. L'accelerazione angolare è

$$\alpha = \frac{\omega - \omega_0}{t} = \frac{0 - 15\,\text{rad/s}}{2{,}5\,\text{s}} = -6{,}0\,\text{rad/s}^2$$

e il momento totale

$$M_{tot} = I\,\alpha = 0{,}12\,\text{kg} \cdot \text{m}^2 \cdot (-6{,}0\,\text{rad/s}^2) = -0{,}72\,\text{N} \cdot \text{m}$$

Il segno meno dice che il momento è opposto alla rotazione. La forza di attrito dei pattini è tangente al cerchione, quindi il suo braccio è la distanza dall'asse:

$$F = \frac{|M_{tot}|}{r} = \frac{0{,}72\,\text{N} \cdot \text{m}}{0{,}31\,\text{m}} = 2{,}32\ldots\,\text{N} \approx 2{,}3\,\text{N}$$
```

```ad-warning
Il momento totale, non quello di una forza sola
In $M_{tot} = I\,\alpha$ entra la somma dei momenti di tutte le forze esterne, ciascuno con il suo segno. Se sulla mola dell'esempio 1 agisse anche un attrito con momento $-0{,}225\,\text{N} \cdot \text{m}$, il momento totale sarebbe $1{,}125 - 0{,}225 = 0{,}90\,\text{N} \cdot \text{m}$ e l'accelerazione angolare $14{,}4\,\text{rad/s}^2$, non $18$.
```

### L'equilibrio come caso particolare

Se il momento totale è nullo, $\alpha = 0$: la velocità angolare non cambia. Un corpo fermo resta fermo, ed è la condizione sui momenti della lezione [L'equilibrio di un corpo rigido](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-corpo-rigido); un corpo che già gira continua a girare con la stessa velocità angolare, come una ruota ben lubrificata che resta in moto a lungo dopo l'ultima spinta. È il primo principio della dinamica, detto per le rotazioni.

## La carrucola con massa

Nella lezione [Corpi collegati e tensione dei fili](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/corpi-collegati-e-tensione-dei-fili) la carrucola era ideale: così leggera che per farla girare non serviva nessun momento, e il filo aveva la stessa tensione dalle due parti. Una carrucola vera ha una massa, quindi un momento d'inerzia, e per farle prendere velocità angolare serve un momento totale diverso da zero. Il problema si risolve scrivendo il secondo principio per ogni corpo che trasla e il secondo principio per le rotazioni per la carrucola, e legando le accelerazioni tra loro.

Il legame viene dal filo. Se il filo non slitta sulla carrucola, un suo punto si muove quanto il bordo della carrucola che tocca: l'accelerazione $a$ dei corpi appesi è l'accelerazione tangenziale del bordo,

$$a = \alpha\,R$$

con $R$ raggio della carrucola.

```ad-example
Esempio 4: il secchio del pozzo
Un secchio di massa $m = 2{,}0\,\text{kg}$ è appeso a una fune avvolta attorno alla carrucola di un pozzo, un disco pieno di massa $M = 4{,}0\,\text{kg}$ e raggio $R = 0{,}10\,\text{m}$ che ruota senza attrito attorno al suo asse. Il secchio viene lasciato libero da fermo. Quanto valgono la sua accelerazione e la tensione della fune?

```tikz
% nome: secchio-carrucola-con-massa
% alt: Una carrucola a disco appesa al soffitto con una fune avvolta sul bordo, che scende dal lato destro e regge un secchio. Sul secchio agiscono la tensione T verso l'alto e il peso m g verso il basso, lungo il doppio della tensione; sul bordo destro della carrucola la fune tira verso il basso con una forza T uguale. Una freccia verde accanto al secchio indica l'accelerazione verso il basso e una freccia curva sulla carrucola la rotazione in senso orario
\begin{tikzpicture}
\draw[thick] (-1.2,1.5) -- (1.2,1.5);
\foreach \x in {-1.05,-0.9,...,1.2} \draw[thin] (\x,1.5) -- ++(0.15,0.15);
\draw[thick] (0,1.5) -- (0,0);
\draw[thick, fill=gray!20] (0,0) circle (0.8);
\fill (0,0) circle (1.5pt);
\draw (0.8,0) -- (0.8,-2.6);
\draw[thick, fill=blue!10] (0.45,-3.3) rectangle (1.15,-2.6);
\draw[-{Stealth}, thick, red] (0.8,0) -- (0.8,-0.98);
\node[red, right] at (0.8,-0.6) {$\vec{T}$};
\draw[-{Stealth}, thick, red] (0.8,-2.95) -- (0.8,-1.97);
\node[red, right] at (0.8,-2.2) {$\vec{T}$};
\draw[-{Stealth}, thick, red] (0.8,-2.95) -- (0.8,-4.91);
\node[red, right] at (0.8,-4.6) {$m\,\vec{g}$};
\draw[-{Stealth}, thick, green!50!black] (1.9,-2.6) -- (1.9,-3.4) node[right] {$\vec{a}$};
\draw[-{Stealth}, thin] (150:0.5) arc[start angle=150, end angle=40, radius=0.5];
\node[left] at (-0.8,0) {$M$};
\draw[thin] (0,0) -- (-0.8,0);
\node[below] at (-0.4,0) {\small $R$};
\end{tikzpicture}
```

Prendiamo come positivo il verso del moto: verso il basso per il secchio, e per la carrucola il verso in cui la fune la fa girare. Sul secchio agiscono il peso $m\,g$ e la tensione $T$:

$$m\,g - T = m\,a$$

Sulla carrucola la fune tira il bordo con la forza $T$, tangente, quindi con braccio $R$; il peso della carrucola e la reazione del perno passano per l'asse e non danno momento. Con $I = \frac{1}{2} M R^2$ e $\alpha = a/R$:

$$T\,R = I\,\alpha = \frac{1}{2}\,M R^2 \cdot \frac{a}{R} \qquad\text{cioè}\qquad T = \frac{1}{2}\,M\,a$$

Sostituendo $T$ nella prima equazione:

$$m\,g - \frac{1}{2}\,M\,a = m\,a \qquad a = \frac{m\,g}{m + \frac{1}{2}M}$$

Il raggio della carrucola si è semplificato. Con i numeri:

$$a = \frac{2{,}0\,\text{kg} \cdot 9{,}8\,\text{m/s}^2}{2{,}0\,\text{kg} + \frac{1}{2} \cdot 4{,}0\,\text{kg}} = \frac{19{,}6\,\text{N}}{4{,}0\,\text{kg}} = 4{,}9\,\text{m/s}^2$$

$$T = \frac{1}{2}\,M\,a = \frac{1}{2} \cdot 4{,}0\,\text{kg} \cdot 4{,}9\,\text{m/s}^2 = 9{,}8\,\text{N}$$

Il secchio scende con metà dell'accelerazione di gravità, e la fune è tesa con metà del peso del secchio, che è $19{,}6\,\text{N}$. Nella figura le frecce sono in scala, $1\,\text{cm}$ ogni $10\,\text{N}$. L'accelerazione angolare della carrucola è $\alpha = a/R = 4{,}9\,\text{m/s}^2 / 0{,}10\,\text{m} = 49\,\text{rad/s}^2$.
```

Nella figura qui sotto scegli la massa della carrucola e quella del secchio, e lasci andare il secchio. Guarda che cosa succede all'accelerazione quando la carrucola diventa più pesante.

```interattivo
% nome: carrucola-massa-secchio
% alt: Una carrucola a disco appesa al soffitto, con una fune avvolta che regge un secchio; sul secchio sono disegnati il peso e la tensione della fune, in scala. Due cursori cambiano la massa della carrucola, da 0 a 8 chilogrammi, e la massa del secchio, da 1 a 4 chilogrammi. Un bottone lascia andare il secchio, che scende di un metro e mezzo mentre la carrucola gira. Sotto si leggono l'accelerazione del secchio, la tensione della fune, il peso del secchio e l'accelerazione angolare della carrucola
```

Con una carrucola di massa trascurabile la tensione è nulla e il secchio cade con $a = g = 9{,}8\,\text{m/s}^2$, in caduta libera. Più la carrucola è pesante, più la fune deve tirare per farla girare: la tensione cresce verso il peso del secchio e l'accelerazione diminuisce. Quando la massa della carrucola è il doppio di quella del secchio l'accelerazione è $g/2$, quando è sei volte tanto è $g/4$. Conta solo il rapporto tra le due masse: un secchio da $4\,\text{kg}$ con una carrucola da $8\,\text{kg}$ scende come uno da $2\,\text{kg}$ con una carrucola da $4\,\text{kg}$.

```ad-warning
Con la carrucola pesante la tensione non è il peso
La fune regge il secchio con una tensione più piccola del peso, altrimenti il secchio non accelererebbe. Nell'esempio 4 il momento sulla carrucola è $T\,R$ con $T = 9{,}8\,\text{N}$, non $m\,g\,R$ con $19{,}6\,\text{N}$: mettere il peso al posto della tensione dà un'accelerazione angolare doppia di quella vera.
```

### La macchina di Atwood con la carrucola pesante

Quando il filo passa sopra la carrucola e porta un corpo per parte, la carrucola gira solo se i due tratti di filo la tirano con forze diverse: la tensione non è più la stessa dalle due parti. Le incognite diventano tre, $a$, $T_1$ e $T_2$, e tre sono le equazioni.

```ad-example
Esempio 5: due masse e una carrucola da un chilogrammo
Una macchina di Atwood porta due masse $m_1 = 1{,}0\,\text{kg}$ e $m_2 = 2{,}0\,\text{kg}$. La carrucola è un disco pieno di massa $M = 1{,}0\,\text{kg}$ e raggio $R = 0{,}15\,\text{m}$, senza attrito sull'asse, e il filo non slitta. Quanto valgono l'accelerazione e le due tensioni?

```tikz
% nome: atwood-carrucola-con-massa
% alt: Una macchina di Atwood con la carrucola a disco di massa M appesa al soffitto: a sinistra il blocco m1, più leggero, a destra il blocco m2, più pesante. Su m1 agiscono la tensione T1 verso l'alto e il peso verso il basso; su m2 la tensione T2 verso l'alto, più lunga di T1, e il peso verso il basso, più lungo ancora. Le accelerazioni, verdi, sono verso l'alto per m1 e verso il basso per m2, e una freccia curva sulla carrucola indica la rotazione in senso orario. Frecce delle forze in scala, 1 centimetro ogni 10 newton
\begin{tikzpicture}
\draw[thick] (-1.5,1.4) -- (1.5,1.4);
\foreach \x in {-1.35,-1.2,...,1.5} \draw[thin] (\x,1.4) -- ++(0.15,0.15);
\draw[thick] (0,1.4) -- (0,0);
\draw[thick, fill=gray!20] (0,0) circle (0.7);
\fill (0,0) circle (1.5pt);
\node[above right] at (0.5,0.5) {$M$};
\draw (-0.7,0) -- (-0.7,-2.2);
\draw (0.7,0) -- (0.7,-2.2);
\draw[thick, fill=blue!10] (-1.0,-2.7) rectangle (-0.4,-2.2);
\draw[thick, fill=blue!10] (0.35,-2.9) rectangle (1.05,-2.2);
\draw[-{Stealth}, thick, red] (-0.7,-2.45) -- (-0.7,-1.19);
\node[red, left] at (-0.7,-1.5) {$\vec{T}_1$};
\draw[-{Stealth}, thick, red] (-0.7,-2.45) -- (-0.7,-3.43);
\node[red, left] at (-0.7,-3.3) {$m_1\vec{g}$};
\draw[-{Stealth}, thick, red] (0.7,-2.55) -- (0.7,-1.15);
\node[red, right] at (0.7,-1.5) {$\vec{T}_2$};
\draw[-{Stealth}, thick, red] (0.7,-2.55) -- (0.7,-4.51);
\node[red, right] at (0.7,-4.2) {$m_2\vec{g}$};
\draw[-{Stealth}, thick, green!50!black] (-2.1,-2.8) -- (-2.1,-2.1) node[left] {$\vec{a}$};
\draw[-{Stealth}, thick, green!50!black] (2.1,-2.1) -- (2.1,-2.8) node[right] {$\vec{a}$};
\draw[-{Stealth}, thin] (150:0.42) arc[start angle=150, end angle=40, radius=0.42];
\end{tikzpicture}
```

La massa $m_2$ è più pesante e scende, $m_1$ sale, e la carrucola gira dalla parte di $m_2$. Prendendo per ogni corpo come positivo il verso del suo moto:

$$
\begin{gathered}
T_1 - m_1 g = m_1 a \\
m_2 g - T_2 = m_2 a \\
(T_2 - T_1)\,R = I\,\alpha = \frac{1}{2}\,M R^2 \cdot \frac{a}{R}
\end{gathered}
$$

Nella terza equazione $T_2$ fa girare la carrucola nel verso del moto e $T_1$ nel verso opposto; semplificando $R$ diventa $T_2 - T_1 = \frac{1}{2} M a$. Sommando le prime due si trova $T_2 - T_1 = (m_2 - m_1)\,g - (m_1 + m_2)\,a$, e uguagliando le due espressioni:

$$
\begin{gathered}
a = \frac{(m_2 - m_1)\,g}{m_1 + m_2 + \frac{1}{2}M} = \frac{(2{,}0\,\text{kg} - 1{,}0\,\text{kg}) \cdot 9{,}8\,\text{m/s}^2}{1{,}0\,\text{kg} + 2{,}0\,\text{kg} + 0{,}50\,\text{kg}} \\
= \frac{9{,}8\,\text{N}}{3{,}5\,\text{kg}} = 2{,}8\,\text{m/s}^2
\end{gathered}
$$

Le tensioni vengono dalle prime due equazioni:

$$
\begin{gathered}
T_1 = m_1 (g + a) = 1{,}0\,\text{kg} \cdot (9{,}8 + 2{,}8)\,\text{m/s}^2 = 12{,}6\,\text{N} \approx 13\,\text{N} \\
T_2 = m_2 (g - a) = 2{,}0\,\text{kg} \cdot (9{,}8 - 2{,}8)\,\text{m/s}^2 = 14\,\text{N}
\end{gathered}
$$

Controllo sulla carrucola: $T_2 - T_1 = 14{,}0\,\text{N} - 12{,}6\,\text{N} = 1{,}4\,\text{N}$, e $\frac{1}{2} M a = 0{,}50\,\text{kg} \cdot 2{,}8\,\text{m/s}^2 = 1{,}4\,\text{N}$. Con una carrucola ideale l'accelerazione sarebbe $9{,}8/3{,}0 = 3{,}27\,\text{m/s}^2$ e la tensione $13{,}1\,\text{N}$ da tutte e due le parti: la carrucola pesante rallenta il sistema, e si comporta nel denominatore come una massa in più, pari a metà della sua.
```

```ad-warning
Due tensioni, non una
Con una carrucola che ha massa, il filo ha tensioni diverse dalle due parti: più grande dal lato verso cui la carrucola accelera. Scrivere una sola $T$ nelle tre equazioni porta a $T_2 - T_1 = 0$, cioè a un momento nullo sulla carrucola, che così non potrebbe prendere velocità.
```

## Il momento come vettore

Finora al momento è bastato un segno, perché l'asse era fisso. In generale il momento di una forza rispetto a un punto $O$ è un vettore, definito con il [prodotto vettoriale](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/prodotto-scalare-e-prodotto-vettoriale):

$$\vec M = \vec r \times \vec F$$

dove $\vec r$ è il vettore che va da $O$ al punto di applicazione della forza. Dalle proprietà del prodotto vettoriale:

- il modulo è $M = r\,F \sin\varphi$, con $\varphi$ angolo tra $\vec r$ e $\vec F$: è la formula usata fin qui;
- la direzione è perpendicolare al piano che contiene $\vec r$ e $\vec F$, cioè è la direzione dell'asse attorno a cui la forza tende a far ruotare il corpo;
- il verso è dato dalla regola della mano destra: se le dita chiuse girano da $\vec r$ verso $\vec F$, il pollice indica $\vec M$.

```tikz
% nome: momento-prodotto-vettoriale
% alt: Nel piano del foglio il vettore r, blu, va dal punto O al punto P; in P è applicata la forza F, rossa, che forma l'angolo fi con il prolungamento tratteggiato di r. La forza tende a far ruotare in senso antiorario attorno a O, e il momento M, perpendicolare al foglio e uscente, è indicato in O da un cerchietto arancione con un punto al centro
\begin{tikzpicture}
\draw[-{Stealth}, thick, blue] (0,0) -- (3,1) node[midway, below right] {$\vec{r}$};
\draw[dashed, thin] (3,1) -- (4.5,1.5);
\draw[-{Stealth}, thick, red] (3,1) -- (3.4,2.9) node[right] {$\vec{F}$};
\draw[thin] (3.66,1.22) arc[start angle=18.4, end angle=78.1, radius=0.7];
\node at (3.85,1.75) {\small $\varphi$};
\fill (3,1) circle (1.5pt) node[below right] {$P$};
\draw[thick, orange!90!black] (0,0) circle (0.2);
\fill[orange!90!black] (0,0) circle (1.5pt);
\node[orange!90!black, above left] at (-0.1,0.1) {$\vec{M}$};
\node[below] at (0,-0.2) {$O$};
\draw[-{Stealth}, thin] (0.9,-0.1) arc[start angle=-6, end angle=60, radius=0.9];
\end{tikzpicture}
```

Se $\vec r$ e $\vec F$ stanno nel piano del foglio, $\vec M$ è perpendicolare al foglio: esce dal foglio ($\odot$) quando la forza tende a far ruotare in senso antiorario, entra ($\otimes$) quando tende a far ruotare in senso orario. Il segno usato finora è la componente di $\vec M$ lungo l'asse che esce dal foglio, e con le componenti di $\vec r$ e $\vec F$ si calcola così:

$$M_z = r_x F_y - r_y F_x$$

Anche l'accelerazione angolare ha un vettore, diretto lungo l'asse come la velocità angolare, e il secondo principio per le rotazioni attorno a un asse fisso si scrive $\vec M_{tot} = I\,\vec\alpha$.

```ad-example
Esempio 6: il momento dalle componenti
Una forza $\vec F$ di componenti $F_x = 10\,\text{N}$ e $F_y = 20\,\text{N}$ è applicata nel punto $P$ di coordinate $(0{,}40\,\text{m};\ 0{,}30\,\text{m})$. Trova il momento della forza rispetto all'origine $O$.

Il vettore $\vec r$ va da $O$ a $P$, quindi $r_x = 0{,}40\,\text{m}$ e $r_y = 0{,}30\,\text{m}$.

$$
\begin{gathered}
M_z = r_x F_y - r_y F_x = 0{,}40\,\text{m} \cdot 20\,\text{N} - 0{,}30\,\text{m} \cdot 10\,\text{N} \\
= 8{,}0\,\text{N} \cdot \text{m} - 3{,}0\,\text{N} \cdot \text{m} = 5{,}0\,\text{N} \cdot \text{m}
\end{gathered}
$$

Il risultato è positivo: $\vec M$ esce dal foglio, e la forza tende a far ruotare in senso antiorario attorno a $O$. Si può controllare con il modulo: $r = 0{,}50\,\text{m}$, $F = \sqrt{10^2 + 20^2}\,\text{N} = 22{,}4\,\text{N}$, e l'angolo tra i due vettori è $\varphi = 26{,}6^\circ$, da cui $r\,F \sin\varphi = 0{,}50 \cdot 22{,}4 \cdot 0{,}447 = 5{,}0\,\text{N} \cdot \text{m}$.
```

```ad-warning
L'ordine dei fattori conta
Il prodotto vettoriale non è commutativo: $\vec F \times \vec r = -\,\vec r \times \vec F$. Scambiando i due vettori, o i due termini di $M_z$, il momento cambia verso, e una rotazione antioraria diventa oraria.
```

Il momento di una forza cambia la velocità angolare di un corpo come la forza cambia la sua velocità. Che cosa ne è del lavoro e dell'energia in una rotazione lo racconta la lezione [L'energia cinetica di rotazione e il rotolamento](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/l-energia-cinetica-di-rotazione-e-il-rotolamento); la grandezza che nelle rotazioni fa la parte della quantità di moto è nella lezione [Il momento angolare](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/il-momento-angolare).
