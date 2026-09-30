# L'energia cinetica e il teorema dell'energia cinetica

Un martello che cade su un chiodo lo pianta nel legno, una palla lanciata contro un barattolo lo sposta: un corpo in movimento può compiere lavoro su un altro corpo, e ne compie tanto di più quanto più è pesante e quanto più è veloce. Questa capacità di compiere lavoro legata al moto si chiama energia cinetica. Il teorema dell'energia cinetica dice come la cambia il lavoro delle forze, e spiega per esempio perché a velocità doppia un'auto ha bisogno di uno spazio quattro volte più lungo per fermarsi.

## L'energia cinetica

Si chiama **energia** di un corpo la sua capacità di compiere lavoro; si misura in joule, come il lavoro. L'**energia cinetica** è l'energia che un corpo ha perché si muove. Un corpo di massa $m$ che si muove con velocità di modulo $v$ ha energia cinetica

$$K = \frac{1}{2} m \, v^2$$

Con la massa in chilogrammi e la velocità in metri al secondo, $K$ esce in $\text{kg} \cdot \text{m}^2/\text{s}^2$, che è proprio il joule: $1\,\text{J} = 1\,\text{N} \cdot \text{m} = 1\,\text{kg} \cdot \text{m/s}^2 \cdot \text{m}$.

La formula viene dal lavoro che serve per mettere in moto il corpo. Un corpo fermo, spinto da una forza costante $F$ nella direzione del moto (e da nessun'altra forza lungo quella direzione), si muove di [moto uniformemente accelerato](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato) con accelerazione $a = F/m$, per il [secondo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica). Dopo un tempo $t$ ha velocità $v = a\,t$ e ha percorso $s = \tfrac{1}{2}a\,t^2$; ricavando $t = v/a$ dalla prima e sostituendolo nella seconda, $s = v^2/(2a)$. Il lavoro della forza è allora

$$W = F \cdot s = m a \cdot \frac{v^2}{2a} = \frac{1}{2} m \, v^2$$

Il lavoro speso per portare il corpo da fermo alla velocità $v$ è la sua energia cinetica, e il corpo, fermandosi, può restituire un lavoro uguale.

L'energia cinetica è uno scalare e non è mai negativa: non dipende dalla direzione del moto, ma solo dal modulo della velocità. È direttamente proporzionale alla massa, e cresce con il quadrato della velocità, come nella [proporzionalità quadratica](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-inversa-e-quadratica): a velocità doppia l'energia cinetica è quattro volte più grande, a velocità tripla nove volte.

```ad-warning
Il quadrato va solo sulla velocità
In $\tfrac{1}{2}m\,v^2$ si eleva al quadrato solo $v$: prima il quadrato, poi il prodotto per la massa e per un mezzo. E la velocità va in metri al secondo: una velocità in km/h lasciata così dà un'energia $3{,}6^2 \approx 13$ volte troppo grande.
```

```ad-example
Esempio 1: un pallone e un'auto
Un pallone da calcio di $0{,}45\,\text{kg}$ viene calciato a $12\,\text{m/s}$; un'auto di $1{,}1 \cdot 10^3\,\text{kg}$ viaggia a $90\,\text{km/h}$. Quanto vale la loro energia cinetica?

$$K_{pallone} = \frac{1}{2} \cdot 0{,}45\,\text{kg} \cdot (12\,\text{m/s})^2 = \frac{1}{2} \cdot 0{,}45 \cdot 144\,\text{J} = 32{,}4\,\text{J} \approx 32\,\text{J}$$

Per l'auto la velocità va in metri al secondo, $90\,\text{km/h} = 90 / 3{,}6\,\text{m/s} = 25\,\text{m/s}$:

$$K_{auto} = \frac{1}{2} \cdot 1{,}1 \cdot 10^3\,\text{kg} \cdot (25\,\text{m/s})^2 = 343\,750\,\text{J} \approx 3{,}4 \cdot 10^5\,\text{J}$$

A $45\,\text{km/h}$, metà velocità, la stessa auto avrebbe un quarto dell'energia cinetica, circa $8{,}6 \cdot 10^4\,\text{J}$.
```

## Il teorema dell'energia cinetica

Lo stesso ragionamento vale per un corpo che parte già con una velocità $v_i$ e arriva a una velocità $v_f$: il lavoro della forza totale è la differenza tra l'energia cinetica finale e quella iniziale. Vale anche quando le forze sono più di una e non sono costanti, e si chiama **teorema dell'energia cinetica**:

$$W_{tot} = K_f - K_i = \Delta K$$

dove $W_{tot}$ è il [lavoro totale](/materiale/scuola-superiore/fisica/lavoro-ed-energia/il-lavoro-di-una-forza) di tutte le forze che agiscono sul corpo, cioè il lavoro della forza totale $\vec F_{tot}$. Il segno del lavoro totale dice che cosa succede alla velocità:

- se $W_{tot} > 0$ l'energia cinetica aumenta, e il corpo accelera;
- se $W_{tot} < 0$ l'energia cinetica diminuisce, e il corpo rallenta;
- se $W_{tot} = 0$ l'energia cinetica resta la stessa, e con lei il modulo della velocità: è il caso del moto circolare uniforme, dove la forza centripeta non compie lavoro.

```ad-warning
Il lavoro di tutte le forze
Nel teorema entra il lavoro totale, non quello di una forza sola. Se spingi una cassa con una forza che compie $100\,\text{J}$ e l'attrito ne compie $-80$, l'energia cinetica della cassa aumenta di $20\,\text{J}$, non di $100$.
```

```ad-example
Esempio 2: il lavoro che accelera un carrello
Un carrello di $0{,}50\,\text{kg}$ passa da $2{,}0\,\text{m/s}$ a $6{,}0\,\text{m/s}$. Quanto lavoro hanno compiuto in tutto le forze che agiscono su di lui?

$$W_{tot} = \frac{1}{2} m\,v_f^2 - \frac{1}{2} m\,v_i^2 = \frac{1}{2} \cdot 0{,}50\,\text{kg} \cdot (6{,}0^2 - 2{,}0^2)\,\text{m}^2/\text{s}^2 = 0{,}25 \cdot 32\,\text{J} = 8{,}0\,\text{J}$$
```

```ad-warning
La differenza dei quadrati, non il quadrato della differenza
$\Delta K$ si calcola con $v_f^2 - v_i^2$, non con $(v_f - v_i)^2$. Nell'esempio 2 il secondo modo darebbe $\tfrac{1}{2} \cdot 0{,}50 \cdot 4{,}0^2 = 4{,}0\,\text{J}$, la metà del valore giusto: aumentare la velocità di $4\,\text{m/s}$ costa di più quando il corpo va già veloce.
```

```ad-example
Esempio 3: la velocità della cassa
La cassa di $20\,\text{kg}$ dell'esempio 5 della lezione sul lavoro parte da ferma, e lungo gli $8{,}0\,\text{m}$ le forze compiono in tutto un lavoro di $72{,}8\,\text{J}$. Con quale velocità arriva in fondo?

La cassa parte da ferma, $K_i = 0$, e il teorema dà $K_f = W_{tot}$:

$$\frac{1}{2} m\,v_f^2 = 72{,}8\,\text{J} \quad\Rightarrow\quad v_f = \sqrt{\frac{2 \cdot 72{,}8\,\text{J}}{20\,\text{kg}}} = \sqrt{7{,}28}\,\text{m/s} = 2{,}69\ldots\,\text{m/s} \approx 2{,}7\,\text{m/s}$$

Senza il teorema servirebbero l'accelerazione e il tempo; con il teorema servono solo il lavoro e la massa.
```

## Lo spazio di frenata

Un'auto di massa $m$ che viaggia a velocità $v$ frena bloccando le ruote su una strada orizzontale. Sulle ruote agisce l'attrito dinamico, $\mu_d\,m g$, opposto allo spostamento; peso e reazione della strada sono verticali e non compiono lavoro. Lungo lo spazio di frenata $d$ il lavoro totale è quello dell'attrito, $-\mu_d\,m g\,d$, e l'auto passa da $K_i = \tfrac{1}{2}m\,v^2$ a $K_f = 0$:

$$-\mu_d\,m g\,d = 0 - \frac{1}{2} m\,v^2 \quad\Rightarrow\quad d = \frac{v^2}{2\,\mu_d\,g}$$

La massa si semplifica: in questo modello un camion e un'utilitaria con le stesse gomme sulla stessa strada si fermano nello stesso spazio. La velocità invece compare al quadrato: a velocità doppia lo spazio di frenata è quattro volte più lungo, perché l'energia cinetica da togliere è quattro volte più grande e la forza che la toglie è la stessa.

```ad-example
Esempio 4: a 36 e a 72 km/h
Su asfalto asciutto il coefficiente di attrito tra gomme e strada è circa $\mu_d = 0{,}70$. In quanto spazio si ferma un'auto che frena a $36\,\text{km/h}$? E a $72\,\text{km/h}$?

Le velocità in metri al secondo sono $10\,\text{m/s}$ e $20\,\text{m/s}$.

$$d_{36} = \frac{(10\,\text{m/s})^2}{2 \cdot 0{,}70 \cdot 9{,}8\,\text{m/s}^2} = \frac{100}{13{,}72}\,\text{m} = 7{,}28\ldots\,\text{m} \approx 7{,}3\,\text{m}$$

$$d_{72} = \frac{(20\,\text{m/s})^2}{13{,}72\,\text{m/s}^2} = 29{,}15\ldots\,\text{m} \approx 29\,\text{m}$$

Il doppio della velocità, quattro volte lo spazio: $29{,}15 / 7{,}29 = 4{,}0$.

```tikz
% nome: spazio-frenata-velocita-grafico
% alt: Il grafico dello spazio di frenata in funzione della velocità, per un coefficiente di attrito di 0,70: un arco di parabola che parte dall'origine e sale sempre più ripido. Sono segnati due punti: a 36 chilometri orari lo spazio è circa 7 metri, a 72 chilometri orari circa 29 metri, quattro volte tanto
% svg: spazio-frenata-velocita-grafico-8d330da4.svg 291x196
% poi-interattivo: scegliere la velocità e il coefficiente di attrito, e leggere lo spazio di frenata sulla parabola
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid[xstep=0.6, ystep=0.4] (4.8,3.6);
\draw[->] (-0.3,0) -- (5.3,0) node[right] {$v$ (km/h)};
\draw[->] (0,-0.3) -- (0,4.0) node[above] {$d$ (m)};
\draw[thick, red, domain=0:120, samples=60] plot ({\x*0.04}, {(\x/3.6)^2/13.72*0.04});
\foreach \x in {30,60,90,120} \draw (\x*0.04,0.07) -- (\x*0.04,-0.07) node[below] {\small $\x$};
\foreach \y in {20,40,60,80} \draw (0.07,\y*0.04) -- (-0.07,\y*0.04) node[left] {\small $\y$};
\draw[dashed, thin] (1.44,0) -- (1.44,0.2915) -- (0,0.2915);
\draw[dashed, thin] (2.88,0) -- (2.88,1.1662) -- (0,1.1662);
\fill (1.44,0.2915) circle (1.5pt);
\fill (2.88,1.1662) circle (1.5pt);
\node[above left] at (1.44,0.2915) {\small $7{,}3$ m};
\node[above left] at (2.88,1.1662) {\small $29$ m};
\end{tikzpicture}
```
```

```ad-note
Lo spazio di arresto
Il valore di $0{,}70$ è indicativo: sull'asfalto bagnato il coefficiente è molto più basso, e lo spazio di frenata più lungo. Lo spazio che serve davvero per fermarsi, lo spazio di arresto, comprende anche il tratto percorso a velocità costante nel tempo di reazione del guidatore, prima di premere il freno: circa un secondo, cioè $10\,\text{m}$ a $36\,\text{km/h}$ e $20\,\text{m}$ a $72\,\text{km/h}$. Questo tratto è solo il doppio, perché va con la velocità e non con il suo quadrato.
```

```ad-example
Esempio 5: la forza frenante
Un'auto di $1{,}1 \cdot 10^3\,\text{kg}$ che viaggia a $72\,\text{km/h}$ si ferma in $32\,\text{m}$. Quanto vale, in media, la forza frenante?

La forza frenante è opposta allo spostamento, e il suo lavoro toglie tutta l'energia cinetica:

$$-F \cdot d = 0 - \frac{1}{2}m\,v^2 \quad\Rightarrow\quad F = \frac{m\,v^2}{2\,d} = \frac{1{,}1 \cdot 10^3\,\text{kg} \cdot (20\,\text{m/s})^2}{2 \cdot 32\,\text{m}} = 6875\,\text{N} \approx 6{,}9 \cdot 10^3\,\text{N}$$
```

Nella figura qui sotto due auto frenano sulla stessa strada nello stesso istante, una con velocità doppia dell'altra. Scegli la velocità e la strada, premi Frena, e confronta dove si fermano.

```interattivo
% nome: frenata-spazio-velocita
% alt: Due automobili su due corsie della stessa strada, allineate sulla linea dove cominciano a frenare; quella in basso va al doppio della velocità di quella in alto. Un cursore sceglie la velocità dell'auto in alto, da 10 a 65 chilometri orari, e un selettore l'asfalto asciutto o bagnato. Con il bottone Frena le due auto rallentano e si fermano; sulla strada, con i metri segnati, restano le linee dove si sono fermate, e sotto sono scritti i due spazi di frenata, il secondo quattro volte il primo
```

Il teorema dell'energia cinetica è il primo passo verso la conservazione dell'energia: quando il lavoro lo compiono il peso o la forza elastica, lo si può scrivere come una differenza di energia potenziale, come nella lezione [Energia potenziale gravitazionale ed elastica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/energia-potenziale-gravitazionale-ed-elastica), e si arriva a [La conservazione dell'energia meccanica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-conservazione-dell-energia-meccanica).
