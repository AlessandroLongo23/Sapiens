# Il campo gravitazionale

La Terra tiene la Luna sulla sua orbita da $384\,000\,\text{km}$ di distanza, senza un filo e senza toccarla. La [legge di gravitazione universale](/materiale/scuola-superiore/fisica/la-gravitazione/la-legge-di-gravitazione-universale) dice quanto vale la forza tra due masse, ma non dice come fa una massa a "sapere" che l'altra c'è. La fisica risponde con un'idea che tornerà con le cariche elettriche e con i magneti: una massa modifica lo spazio intorno a sé, in ogni punto, anche dove non c'è niente. Questa modifica è il campo gravitazionale, e un secondo corpo sente la forza del campo nel punto in cui si trova.

## Dalla forza al campo

Mettiamo un corpo di massa $m$ in un punto $P$ vicino a un pianeta. Il pianeta lo attira con una forza $\vec F$, che dipende da $m$: su una massa doppia la forza è doppia, su una tripla è tripla. Il rapporto tra la forza e la massa, invece, è sempre lo stesso, qualunque corpo si metta in $P$. Questo rapporto è una proprietà del punto, non del corpo.

Il **campo gravitazionale** nel punto $P$ è il vettore

$$\vec g = \frac{\vec F}{m}$$

dove $\vec F$ è la forza di gravità che agisce su un corpo di massa $m$ messo in $P$. Il corpo che serve a misurare il campo si chiama **massa di prova**; la massa che genera il campo (il pianeta) è la sorgente del campo.

- Il campo è un vettore: ha la direzione e il verso della forza sulla massa di prova, quindi punta verso la sorgente.
- Si misura in newton al kilogrammo, $\text{N/kg}$, che è la stessa unità dell'accelerazione: $\text{N/kg} = \text{kg} \cdot \text{m/s}^2 / \text{kg} = \text{m/s}^2$.
- Conosciuto il campo in un punto, la forza su un corpo qualsiasi messo lì è $\vec F = m\,\vec g$.

L'ultima formula è quella della [forza-peso](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa), $P = m g$: il $g = 9{,}8\,\text{N/kg}$ del primo anno è il modulo del campo gravitazionale della Terra vicino al suolo. Per il [secondo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica), un corpo su cui agisce solo la gravità ha accelerazione $\vec a = \vec F / m = \vec g$: il campo in un punto è anche l'accelerazione con cui cade un corpo lasciato libero in quel punto, la stessa per tutti i corpi.

```ad-example
Esempio 1: il campo da una forza misurata
Una sonda di $250\,\text{kg}$ si trova in un punto vicino a Marte, dove il pianeta la attira con una forza di $520\,\text{N}$. Quanto vale il campo gravitazionale in quel punto? Che forza agirebbe lì su un astronauta di $80\,\text{kg}$?

La sonda fa da massa di prova:

$$g = \frac{F}{m} = \frac{520\,\text{N}}{250\,\text{kg}} = 2{,}08\,\text{N/kg}$$

Il campo è del punto, non della sonda, e vale anche per l'astronauta:

$$F = m\,g = 80\,\text{kg} \cdot 2{,}08\,\text{N/kg} = 166{,}4\,\text{N} \approx 1{,}7 \cdot 10^2\,\text{N}$$

Il risultato ha due cifre significative, come la massa dell'astronauta.
```

```ad-warning
Il campo non dipende dalla massa di prova
Nella definizione $g = F/m$ la massa $m$ è quella del corpo che sente la forza, e si semplifica con quella contenuta in $F$. Raddoppiando la massa di prova raddoppia la forza, e il campo resta uguale. Il campo dipende solo dalla sorgente e dal punto.
```

## Il campo di un pianeta

Un pianeta, una stella o una luna, visti da fuori, attirano come se tutta la loro massa fosse nel centro (lo ha dimostrato Newton per i corpi a simmetria sferica; ne riparliamo più avanti). Una massa di prova $m$ a distanza $r$ dal centro di un corpo di massa $M$ sente la forza $F = G\,\dfrac{M\,m}{r^2}$. Dividendo per $m$:

$$g = G\,\frac{M}{r^2}$$

con $G = 6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2$. Il campo è **radiale**: in ogni punto è diretto lungo la retta che passa per il centro, verso il centro. Il suo modulo è lo stesso in tutti i punti alla stessa distanza $r$, e diminuisce con il quadrato della distanza: a distanza doppia il campo è un quarto, a distanza tripla un nono ([proporzionalità quadratica inversa](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-inversa-e-quadratica)).

```tikz
% nome: campo-gravitazionale-vettori-pianeta
% alt: Un pianeta al centro e, intorno, le frecce verdi del campo gravitazionale disegnate su tre circonferenze: tutte puntano verso il centro del pianeta. Sulla circonferenza di raggio doppio rispetto alla prima le frecce sono lunghe un quarto
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) circle (0.55);
\node at (0,0) {$M$};
\draw[thin, dashed, gray] (0,0) circle (1.6);
\draw[thin, dashed, gray] (0,0) circle (2.4);
\draw[thin, dashed, gray] (0,0) circle (3.2);
\foreach \a in {0,45,...,315} \draw[-{Stealth}, thick, green!50!black] (\a:1.6) -- (\a:0.6);
\foreach \a in {22.5,67.5,...,337.5} \draw[-{Stealth}, thick, green!50!black] (\a:2.4) -- (\a:1.956);
\foreach \a in {0,45,...,315} \draw[-{Stealth}, thick, green!50!black] (\a:3.2) -- (\a:2.95);
\node[green!50!black] at (1.15,0.3) {$\vec g$};
\end{tikzpicture}
```

Alla superficie della Terra, con $M_T = 5{,}97 \cdot 10^{24}\,\text{kg}$ e $r = R_T = 6{,}37 \cdot 10^6\,\text{m}$, la formula dà $9{,}81\,\text{N/kg}$: è il conto della lezione sulla legge di gravitazione, che ritrova il $g$ misurato con la caduta dei corpi. La stessa formula vale per ogni corpo celeste, con la sua massa e il suo raggio: per la Luna ($M_L = 7{,}35 \cdot 10^{22}\,\text{kg}$, $R_L = 1{,}74 \cdot 10^6\,\text{m}$) dà $1{,}62\,\text{N/kg}$, circa un sesto del valore terrestre.

```ad-example
Esempio 2: il campo della Terra dove passa la Luna
La Luna dista dal centro della Terra $3{,}84 \cdot 10^8\,\text{m}$. Quanto vale a quella distanza il campo gravitazionale della Terra?

$$g = G\,\frac{M_T}{r^2} = 6{,}67 \cdot 10^{-11}\,\frac{\text{N} \cdot \text{m}^2}{\text{kg}^2} \cdot \frac{5{,}97 \cdot 10^{24}\,\text{kg}}{(3{,}84 \cdot 10^8\,\text{m})^2} = 2{,}70 \cdot 10^{-3}\,\text{N/kg}$$

Con la calcolatrice conviene fare prima il quadrato della distanza, $1{,}475 \cdot 10^{17}\,\text{m}^2$, e poi il resto. Il risultato è circa $3600$ volte più piccolo di $9{,}8\,\text{N/kg}$, perché la Luna è circa $60$ volte più lontana dal centro della Terra di un sasso al suolo, e $60^2 = 3600$. È anche l'[accelerazione centripeta](/materiale/scuola-superiore/fisica/i-moti-nel-piano/l-accelerazione-centripeta) della Luna, che al secondo anno avevi trovato dal raggio e dal periodo dell'orbita ($2{,}72 \cdot 10^{-3}\,\text{m/s}^2$; la piccola differenza viene dai dati arrotondati): la Luna "cade" verso la Terra con l'accelerazione che il campo ha in quel punto.
```

### Le linee di campo

Disegnare una freccia in ogni punto è scomodo. Il campo si rappresenta di solito con le **linee di campo**: linee che in ogni punto hanno la direzione del campo, con una freccia che ne dà il verso. Per un pianeta sono semirette che arrivano da tutte le direzioni e finiscono sul pianeta. Dove le linee sono più fitte il campo è più intenso: vicino al pianeta si addensano, lontano si diradano.

```tikz
% nome: linee-campo-gravitazionale-radiale
% alt: Le linee del campo gravitazionale di un pianeta: dodici semirette che arrivano da tutte le direzioni, con le frecce rivolte verso il pianeta, più fitte vicino alla superficie e più rade lontano
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) circle (0.7);
\node at (0,0) {$M$};
\foreach \a in {0,30,...,330} \draw[green!50!black, postaction={decorate}, decoration={markings, mark=at position 0.45 with {\arrow{Stealth}}}] (\a:2.8) -- (\a:0.7);
\end{tikzpicture}
```

## Come cambia il campo con la quota

Nella formula $g = G M / r^2$ la distanza $r$ si misura dal centro del pianeta. Per un punto a **quota** $h$ sopra la superficie di un pianeta di raggio $R$, la distanza dal centro è $r = R + h$, e

$$g = G\,\frac{M}{(R + h)^2}$$

```tikz
% nome: quota-e-distanza-dal-centro
% alt: La Terra, di raggio R con T, e un punto P a quota h sopra la superficie. La distanza r di P dal centro della Terra è la somma del raggio e della quota. In P la freccia verde del campo g punta verso il centro
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) circle (2);
\fill (0,0) circle (1.5pt) node[below left] {$C$};
\draw[dashed, thin] (0,0) -- (3.3,0);
\fill (3.3,0) circle (1.5pt) node[right] {$P$};
\draw[{Stealth}-{Stealth}, thin] (0,-0.35) -- (2,-0.35) node[midway, below] {$R_T$};
\draw[{Stealth}-{Stealth}, thin] (2,-0.35) -- (3.3,-0.35) node[midway, below] {$h$};
\draw[{Stealth}-{Stealth}, thin] (0,2.3) -- (3.3,2.3) node[midway, above] {$r = R_T + h$};
\draw[dashed, thin] (3.3,0) -- (3.3,2.3);
\draw[dashed, thin] (0,0) -- (0,2.3);
\draw[-{Stealth}, thick, green!50!black] (3.3,0) -- (2.35,0) node[above right] {$\vec g$};
\end{tikzpicture}
```

Per la Terra conviene confrontare il campo a quota $h$ con il valore al suolo, $g_0 = G M_T / R_T^2 = 9{,}8\,\text{N/kg}$. Il rapporto tra i due non contiene più né $G$ né la massa:

$$g = g_0 \left(\frac{R_T}{R_T + h}\right)^2$$

Sulle quote della vita di tutti i giorni il campo cambia pochissimo, perché $h$ è piccola rispetto ai $6370\,\text{km}$ del raggio terrestre: in cima all'Everest, a $8{,}85\,\text{km}$, vale ancora il $99{,}7\%$ del valore al livello del mare. Per questo nei problemi del biennio $g$ era una costante. Su distanze paragonabili al raggio della Terra, invece, la diminuzione è forte.

```ad-example
Esempio 3: il campo alla quota della Stazione Spaziale
La Stazione Spaziale Internazionale orbita a $4{,}00 \cdot 10^5\,\text{m}$ dal suolo ($400\,\text{km}$). Quanto vale lì il campo gravitazionale della Terra? Quanto pesa a quella quota un astronauta di $70{,}0\,\text{kg}$?

La distanza dal centro della Terra è

$$r = R_T + h = 6{,}37 \cdot 10^6\,\text{m} + 0{,}400 \cdot 10^6\,\text{m} = 6{,}77 \cdot 10^6\,\text{m}$$

Il campo:

$$g = G\,\frac{M_T}{r^2} = 6{,}67 \cdot 10^{-11}\,\frac{\text{N} \cdot \text{m}^2}{\text{kg}^2} \cdot \frac{5{,}97 \cdot 10^{24}\,\text{kg}}{(6{,}77 \cdot 10^6\,\text{m})^2} = 8{,}69\,\text{N/kg}$$

Il peso dell'astronauta è $F = m\,g = 70{,}0\,\text{kg} \cdot 8{,}69\,\text{N/kg} = 608\,\text{N}$, contro i $687\,\text{N}$ che ha al suolo (con $g_0 = 9{,}81\,\text{N/kg}$). A $400\,\text{km}$ di quota la gravità è ancora l'$89\%$ di quella al suolo: gli astronauti galleggiano nella Stazione per un altro motivo, spiegato nella lezione [Il moto dei satelliti](/materiale/scuola-superiore/fisica/la-gravitazione/il-moto-dei-satelliti).
```

```ad-warning
La distanza si misura dal centro, non dal suolo
L'errore più frequente è mettere nella formula la quota $h$ al posto di $r$. Con $h = 4{,}00 \cdot 10^5\,\text{m}$ al denominatore l'esempio 3 darebbe $2{,}49 \cdot 10^3\,\text{N/kg}$, un campo $250$ volte più intenso che al suolo: un risultato così dice subito che manca il raggio del pianeta. Prima di ogni conto: $r = R + h$, con raggio e quota nella stessa unità.
```

Il grafico del campo della Terra in funzione della distanza dal centro, misurata in raggi terrestri, mostra la discesa: $9{,}8\,\text{N/kg}$ alla superficie, $2{,}45\,\text{N/kg}$ a due raggi dal centro, $1{,}09\,\text{N/kg}$ a tre, $0{,}61\,\text{N/kg}$ a quattro. Il campo diventa sempre più debole, ma non si annulla a nessuna distanza.

```tikz
% nome: grafico-campo-terra-distanza
% alt: Grafico del campo gravitazionale della Terra, in newton al kilogrammo, in funzione della distanza dal centro misurata in raggi terrestri: la curva parte da 9,8 alla superficie, a distanza 1, e scende a 2,45 a distanza 2, a 1,09 a distanza 3, a 0,61 a distanza 4, avvicinandosi all'asse orizzontale senza toccarlo
% poi-interattivo: spostare un punto lungo la curva e leggere distanza e campo
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid[xstep=1, ystep=0.8] (5.5,4.4);
\draw[->] (-0.2,0) -- (5.9,0) node[right] {$r$};
\draw[->] (0,-0.2) -- (0,4.8) node[above] {$g$ (N/kg)};
\node[below] at (1,0) {\small $R_T$};
\foreach \x in {2,3,4,5} \node[below] at (\x,0) {\small $\x R_T$};
\foreach \y/\l in {0.8/2,1.6/4,2.4/6,3.2/8,4/10} \node[left] at (0,\y) {\small $\l$};
\draw[dashed, thin] (1,0) -- (1,3.92);
\draw[thick, blue] plot[domain=1:5.5, samples=60] (\x, {3.92/(\x*\x)});
\fill (1,3.92) circle (1.5pt) node[right] {\small $9{,}8$};
\fill (2,0.98) circle (1.5pt) node[above right] {\small $2{,}45$};
\fill (3,0.436) circle (1.5pt) node[above right] {\small $1{,}09$};
\fill (4,0.245) circle (1.5pt) node[above right] {\small $0{,}61$};
\end{tikzpicture}
```

Nella figura qui sotto trascini una sonda intorno alla Terra e leggi la sua distanza dal centro, la quota e il campo in quel punto; la freccia verde è il campo, in scala. Prova a cercare a quale distanza il campo vale un quarto di quello al suolo, e a quale la metà.

```interattivo
% nome: campo-gravitazionale-sonda
% alt: La Terra al centro e una sonda che si trascina tutto intorno, fino a quattro raggi terrestri dal centro. Sulla sonda una freccia verde disegna il campo gravitazionale, sempre diretta verso il centro della Terra e più corta man mano che la sonda si allontana. Sotto sono scritti la distanza dal centro in raggi terrestri e in kilometri, la quota, il campo in newton al kilogrammo e la frazione rispetto al valore al suolo
```

Il campo vale un quarto di $g_0$ a due raggi terrestri dal centro, cioè a una quota uguale al raggio della Terra, $6370\,\text{km}$. Per dimezzarlo non serve raddoppiare la distanza: ci si arriva prima, come mostra il prossimo esempio.

```ad-example
Esempio 4: a che quota il campo si dimezza
A quale quota sopra il suolo il campo gravitazionale della Terra vale la metà di $g_0$?

Si parte dal rapporto con il valore al suolo, e si chiede che valga $\tfrac{1}{2}$:

$$\left(\frac{R_T}{r}\right)^2 = \frac{1}{2} \quad\Rightarrow\quad \frac{r}{R_T} = \sqrt{2} \quad\Rightarrow\quad r = \sqrt{2}\,R_T = 1{,}414 \cdot 6{,}37 \cdot 10^6\,\text{m} = 9{,}01 \cdot 10^6\,\text{m}$$

La quota è la distanza dal centro meno il raggio:

$$h = r - R_T = 9{,}01 \cdot 10^6\,\text{m} - 6{,}37 \cdot 10^6\,\text{m} = 2{,}64 \cdot 10^6\,\text{m}$$

cioè $2640\,\text{km}$. Né $G$ né la massa della Terra sono serviti.
```

```ad-tip
Ragionare con i rapporti
Quando un problema dà la distanza come multiplo del raggio, non servono le costanti: a $n$ raggi dal centro il campo è $g_0/n^2$. A $3 R_T$ dal centro vale $9{,}8/9 = 1{,}09\,\text{N/kg}$; a $10 R_T$ vale $0{,}098\,\text{N/kg}$.
```

## Il campo di più masse

Se le sorgenti sono due, ognuna genera il suo campo come se l'altra non ci fosse, e il campo in un punto è la [somma vettoriale](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori) dei due:

$$\vec g = \vec g_1 + \vec g_2$$

È il **principio di sovrapposizione**, e vale per un numero qualsiasi di masse. Sulla retta che unisce due corpi celesti, in un punto che sta in mezzo, i due campi hanno la stessa direzione e versi opposti, perché ognuno punta verso la propria sorgente: il modulo del campo totale è la differenza dei moduli, e il verso è quello del più intenso.

```ad-example
Esempio 5: dove la Terra e la Luna si bilanciano
Sulla retta che unisce la Terra e la Luna c'è un punto $P$ in cui il campo totale è nullo. A che distanza si trova dal centro della Terra? La distanza tra i due centri è $d = 3{,}84 \cdot 10^8\,\text{m}$, la massa della Luna è $M_L = 7{,}35 \cdot 10^{22}\,\text{kg}$.

Chiamiamo $x$ la distanza di $P$ dal centro della Terra; dal centro della Luna dista $d - x$. Il campo totale è nullo dove i due campi hanno lo stesso modulo:

$$G\,\frac{M_T}{x^2} = G\,\frac{M_L}{(d - x)^2}$$

$G$ si semplifica. Le distanze sono positive, quindi si può fare la radice quadrata dei due membri:

$$\frac{x}{d - x} = \sqrt{\frac{M_T}{M_L}} = \sqrt{\frac{5{,}97 \cdot 10^{24}\,\text{kg}}{7{,}35 \cdot 10^{22}\,\text{kg}}} = \sqrt{81{,}2} = 9{,}01$$

Da $x = 9{,}01\,(d - x)$ si ricava

$$x = \frac{9{,}01}{10{,}01}\,d = 0{,}900 \cdot 3{,}84 \cdot 10^8\,\text{m} = 3{,}46 \cdot 10^8\,\text{m}$$

Il punto è a nove decimi del cammino, molto più vicino alla Luna: la Terra ha una massa $81$ volte più grande e il suo campo arriva più lontano. In $P$ i due campi valgono entrambi $3{,}3 \cdot 10^{-3}\,\text{N/kg}$. Una navicella diretta verso la Luna, oltre questo punto, è attirata più dalla Luna che dalla Terra.

```tikz
% nome: terra-luna-campo-nullo
% alt: La Terra a sinistra e la Luna a destra, in scala con la loro distanza; il punto P sta sulla retta che le unisce, a nove decimi del cammino dalla Terra. In P due frecce verdi uguali e opposte: il campo della Terra verso sinistra e quello della Luna verso destra. Sotto sono segnate le distanze x, da P al centro della Terra, e d meno x, da P al centro della Luna
\begin{tikzpicture}
\draw[thin, dash dot] (-0.8,0) -- (8.3,0);
\draw[thick, fill=blue!10] (0,0) circle (0.45);
\node[above] at (0,0.45) {Terra};
\draw[thick, fill=gray!20] (7.68,0) circle (0.2);
\node[above] at (7.68,0.2) {Luna};
\fill (6.92,0) circle (1.5pt) node[above] {$P$};
\draw[-{Stealth}, thick, green!50!black] (6.92,0) -- (6.42,0) node[above] {$\vec g_T$};
\draw[-{Stealth}, thick, green!50!black] (6.92,0) -- (7.42,0);
\node[green!50!black] at (7.3,-0.35) {$\vec g_L$};
\draw[{Stealth}-{Stealth}, thin] (0,-0.9) -- (6.92,-0.9) node[midway, below] {$x$};
\draw[{Stealth}-{Stealth}, thin] (6.92,-0.9) -- (7.68,-0.9) node[midway, below] {$d - x$};
\draw[dashed, thin] (0,0) -- (0,-0.9);
\draw[dashed, thin] (6.92,0) -- (6.92,-0.9);
\draw[dashed, thin] (7.68,-0.2) -- (7.68,-0.9);
\end{tikzpicture}
```
```

## Dentro e fuori una sfera

Finora il pianeta è stato trattato come un punto con tutta la massa nel centro. Newton dimostrò che per un corpo a simmetria sferica (fatto a strati concentrici, ognuno con la sua densità) questo è esatto, purché il punto sia fuori dal corpo. La dimostrazione chiede strumenti di matematica del quinto anno; qui prendiamo i risultati.

- Fuori dalla sfera, a distanza $r \ge R$ dal centro, il campo è quello di una massa puntiforme $M$ messa nel centro: $g = G M / r^2$.
- Dentro un guscio sferico cavo il campo del guscio è nullo: le attrazioni delle sue parti, più vicine da un lato e più numerose dall'altro, si compensano in ogni punto interno.
- Dentro una sfera piena, a distanza $r < R$ dal centro, conta solo la massa che sta più vicina al centro del punto considerato: gli strati esterni sono gusci, e non contribuiscono.

Se la sfera è **omogenea** (stessa densità dappertutto), la massa racchiusa entro la distanza $r$ è proporzionale a $r^3$, e divisa per $r^2$ dà un campo proporzionale a $r$:

$$g = G\,\frac{M}{R^3}\,r \qquad (r \le R)$$

Il campo cresce in proporzione diretta dal centro, dove è nullo, fino alla superficie, dove raggiunge il massimo $G M / R^2$; poi diminuisce con il quadrato della distanza. A metà del raggio vale metà del valore in superficie.

```tikz
% nome: campo-dentro-fuori-sfera-omogenea
% alt: Grafico del campo gravitazionale di una sfera omogenea di raggio R in funzione della distanza dal centro: da zero, al centro, cresce lungo un segmento di retta fino al valore massimo sulla superficie, a distanza R, e poi scende lungo una curva, sempre più lentamente, a un quarto del massimo a distanza 2R
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid[xstep=1.5, ystep=0.75] (6,3.4);
\fill[blue!10] (0,0) rectangle (1.5,-0.12);
\draw[->] (-0.2,0) -- (6.4,0) node[right] {$r$};
\draw[->] (0,-0.2) -- (0,3.8) node[above] {$g$};
\draw[dashed, thin] (1.5,0) -- (1.5,3);
\draw[dashed, thin] (0,3) -- (1.5,3);
\draw[thick, blue] (0,0) -- (1.5,3);
\draw[thick, blue] plot[domain=1.5:6, samples=60] (\x, {6.75/(\x*\x)});
\node[below] at (1.5,-0.1) {\small $R$};
\node[below] at (3,-0.1) {\small $2R$};
\node[below] at (4.5,-0.1) {\small $3R$};
\node[left] at (0,3) {\small $\frac{G M}{R^2}$};
\fill (1.5,3) circle (1.5pt);
\fill (3,0.75) circle (1.5pt);
\fill (0.75,1.5) circle (1.5pt);
\node at (0.75,-0.4) {\small dentro};
\node at (5.3,0.6) {\small fuori};
\end{tikzpicture}
```

```ad-note
La Terra non è omogenea
Il nucleo della Terra è molto più denso della crosta, e la formula della sfera omogenea vale solo come primo modello. Scendendo in una miniera il campo non diminuisce subito: resta vicino a $10\,\text{N/kg}$ per quasi metà del raggio, e scende a zero solo avvicinandosi al centro. Al centro della Terra, in ogni modello, il campo è nullo: la massa attira da tutte le direzioni allo stesso modo.
```

## Campo e forza: che cosa usare

Il campo e la forza descrivono la stessa interazione da due punti di vista. La forza riguarda una coppia di corpi; il campo riguarda una sorgente e lo spazio che la circonda, e c'è anche quando nel punto non c'è nessun corpo a sentirlo.

| | Forza di gravità | Campo gravitazionale |
|---|---|---|
| Che cos'è | l'azione su un corpo di massa $m$ | la forza per unità di massa in un punto |
| Formula per un pianeta | $F = G\,\dfrac{M\,m}{r^2}$ | $g = G\,\dfrac{M}{r^2}$ |
| Unità | $\text{N}$ | $\text{N/kg} = \text{m/s}^2$ |
| Dipende da | sorgente, punto e corpo | sorgente e punto |

Nei problemi conviene il campo quando nello stesso punto passano corpi diversi (si calcola una volta sola, poi $F = m g$), e quando interessa l'accelerazione di un corpo in caduta o in orbita, che è $g$ e non dipende dalla sua massa. Su questo si basano le prossime due lezioni: la velocità di un satellite e la velocità con cui un corpo sfugge a un pianeta non dipendono dalla massa del corpo, perché dipendono solo dal campo.
