# L'accelerazione centripeta

Un'auto percorre una rotonda con il tachimetro fermo a $30\,\text{km/h}$. Il modulo della velocità non cambia, eppure l'auto accelera: la sua velocità, che è un vettore tangente alla traiettoria, cambia direzione in ogni istante. Nel [moto circolare uniforme](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-circolare-uniforme) questa accelerazione è sempre diretta verso il centro della circonferenza, e per questo si chiama **accelerazione centripeta**, "che cerca il centro".

## Perché c'è un'accelerazione

Nella lezione [L'accelerazione](/materiale/scuola-superiore/fisica/il-moto-rettilineo/l-accelerazione) l'accelerazione è il rapporto tra la variazione della velocità e l'intervallo di tempo. Nel piano la velocità è un vettore, e anche la sua variazione lo è:

$$\vec{a} = \frac{\Delta\vec{v}}{\Delta t} \qquad \text{con} \qquad \Delta\vec{v} = \vec{v}_2 - \vec{v}_1$$

dove l'intervallo $\Delta t$ è molto breve, come per la [velocità istantanea](/materiale/scuola-superiore/fisica/i-moti-nel-piano/spostamento-e-velocita-nel-piano). La velocità cambia se cambia il modulo, oppure se cambia la direzione, oppure tutti e due. Nel moto circolare uniforme cambia solo la direzione, ma basta: $\vec{v}_2$ è diverso da $\vec{v}_1$, $\Delta\vec{v}$ non è zero, e c'è un'accelerazione.

Per vedere dove va $\Delta\vec{v}$ si prendono le velocità in due punti vicini $P_1$ e $P_2$ e si portano con l'origine nello stesso punto $Q$, senza cambiarle. La differenza $\Delta\vec{v}$ va dalla punta di $\vec{v}_1$ alla punta di $\vec{v}_2$, come nella lezione [Somma e differenza di vettori](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori).

```tikz
% nome: variazione-velocita-moto-circolare
% alt: A sinistra una circonferenza di centro O con due punti P1 e P2 vicini; le velocità v1 e v2, in blu scuro, sono tangenti e hanno la stessa lunghezza; i raggi tratteggiati verso P1 e P2 formano al centro l'angolo delta theta. A destra le due velocità sono riportate con l'origine nello stesso punto Q, e formano anche loro l'angolo delta theta; la loro differenza delta v, in verde, va dalla punta di v1 alla punta di v2. Una copia tratteggiata di delta v, a metà dell'arco tra P1 e P2, punta verso il centro O
% svg: variazione-velocita-moto-circolare-c7654180.svg 278x160
\begin{tikzpicture}
\draw[thick, gray!60] (0,0) circle (1.6);
\fill (0,0) circle (1.5pt) node[below] {$O$};
\draw[dashed, thin] (0,0) -- (0.9177,1.3106);
\draw[dashed, thin] (0,0) -- (-0.4141,1.5455);
\draw (0.1606,0.2294) arc[start angle=55, end angle=105, radius=0.28];
\node at (0.0764,0.4333) {\scriptsize $\Delta\theta$};
\draw[-{Stealth}, thick, blue!60!black] (0.9177,1.3106) -- (-0.0653,1.9989);
\draw[-{Stealth}, thick, blue!60!black] (-0.4141,1.5455) -- (-1.5732,1.2349);
\node[right] at (0.9177,1.3106) {$P_1$};
\node[below left] at (-0.4141,1.5455) {$P_2$};
\node[above right] at (-0.0653,1.9989) {$\vec{v}_1$};
\node[left] at (-1.5732,1.2349) {$\vec{v}_2$};
\fill (0.9177,1.3106) circle (1.5pt);
\fill (-0.4141,1.5455) circle (1.5pt);
\draw[-{Stealth}, thick, green!50!black, dashed] (0.2778,1.5757) -- (0.1017,0.5768);
\fill (4.6,0.4) circle (1.5pt) node[right] {$Q$};
\draw[-{Stealth}, thick, blue!60!black] (4.6,0.4) -- (3.617,1.0883);
\draw[-{Stealth}, thick, blue!60!black] (4.6,0.4) -- (3.4409,0.0894);
\draw[-{Stealth}, thick, green!50!black] (3.617,1.0883) -- (3.4409,0.0894);
\node[above right] at (4.1,0.75) {$\vec{v}_1$};
\node[below] at (4.0,0.23) {$\vec{v}_2$};
\node[left] at (3.5,0.6) {$\Delta\vec{v}$};
\draw (4.2314,0.6581) arc[start angle=145, end angle=195, radius=0.45];
\node at (3.8909,0.525) {\scriptsize $\Delta\theta$};
\end{tikzpicture}
```

L'angolo tra $\vec{v}_1$ e $\vec{v}_2$ è uguale all'angolo $\Delta\theta$ tra i due raggi, perché ogni velocità è perpendicolare al suo raggio. E $\Delta\vec{v}$, riportato a metà dell'arco tra $P_1$ e $P_2$, punta verso il centro. Più i due punti sono vicini, più questo è esatto: l'accelerazione istantanea è diretta lungo il raggio, verso il centro.

## Il modulo dell'accelerazione centripeta

Il modulo si trova confrontando due triangoli della figura. Il triangolo $O P_1 P_2$ ha due lati uguali al raggio $r$ e l'angolo $\Delta\theta$ tra loro; quando l'intervallo $\Delta t$ è breve la corda $P_1 P_2$ è lunga quasi quanto l'arco, cioè quanto la strada fatta nel tempo $\Delta t$, $v\,\Delta t$. Il triangolo delle velocità ha due lati uguali a $v$ e lo stesso angolo $\Delta\theta$ tra loro, e il terzo lato è $\Delta v$.

I due triangoli sono isosceli con lo stesso angolo al vertice, quindi sono [simili](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/similitudine), e i lati sono in proporzione:

$$\frac{\Delta v}{v} = \frac{v\,\Delta t}{r} \qquad\Rightarrow\qquad \frac{\Delta v}{\Delta t} = \frac{v^2}{r}$$

L'accelerazione centripeta ha quindi modulo

$$a_c = \frac{v^2}{r}$$

Con la velocità angolare, $v = \omega\,r$, e con il periodo, $\omega = 2\pi/T$, la stessa formula si scrive

$$a_c = \omega^2\,r = \frac{4\pi^2 r}{T^2}$$

Le unità tornano: $(\text{m/s})^2 / \text{m} = \text{m/s}^2$, e $(\text{rad/s})^2 \cdot \text{m} = \text{m/s}^2$, perché il radiante è un numero puro.

## Direzione e verso

L'accelerazione centripeta $\vec{a}_c$:

- è diretta lungo il raggio, verso il centro della circonferenza;
- è perpendicolare alla velocità, che è tangente;
- ha modulo costante, $v^2/r$, ma cambia direzione insieme al punto: come vettore non è costante.

```tikz
% nome: accelerazione-centripeta-verso-centro
% alt: Una circonferenza di centro O con un punto disegnato in tre posizioni; in ognuna la velocità v, in blu scuro, è tangente alla circonferenza, e l'accelerazione centripeta ac, in verde, è diretta lungo il raggio verso il centro, perpendicolare alla velocità
% svg: accelerazione-centripeta-verso-centro-c53f89a4.svg 153x167
\begin{tikzpicture}
\draw[thick, gray!60] (0,0) circle (1.6);
\fill (0,0) circle (1.5pt) node[below] {$O$};
\foreach \a in {30,150,270} {
  \fill (\a:1.6) circle (1.5pt);
  \draw[-{Stealth}, thick, blue!60!black] (\a:1.6) -- ($(\a:1.6)+(\a+90:1.1)$);
  \draw[-{Stealth}, thick, green!50!black] (\a:1.6) -- (\a:0.75);
}
\node[above right] at ($(30:1.6)+(120:1.1)$) {$\vec{v}$};
\node[left] at ($(150:1.6)+(240:1.1)$) {$\vec{v}$};
\node[below] at ($(270:1.6)+(0:1.1)$) {$\vec{v}$};
\node[below right] at (30:1.1) {$\vec{a}_c$};
\node[above] at (150:1.05) {$\vec{a}_c$};
\node[left] at (270:1.15) {$\vec{a}_c$};
\end{tikzpicture}
```

```ad-warning
Velocità costante in modulo, ma accelerazione non nulla
Nel moto circolare uniforme "uniforme" vuol dire che il modulo della velocità è costante, non il vettore. Dire che l'accelerazione è zero perché "la velocità non cambia" è sbagliato: cambia la direzione della velocità, e l'accelerazione è $v^2/r$, verso il centro. Un moto ha accelerazione nulla solo se è rettilineo uniforme.
```

```ad-example
Esempio 1: un'auto in curva
Un'auto percorre una curva di raggio $45\,\text{m}$ alla velocità costante di $54\,\text{km/h}$. Quanto vale la sua accelerazione centripeta?

Prima la velocità in metri al secondo: $v = 54 / 3{,}6\,\text{m/s} = 15\,\text{m/s}$. Poi

$$a_c = \frac{v^2}{r} = \frac{(15\,\text{m/s})^2}{45\,\text{m}} = \frac{225}{45}\,\text{m/s}^2 = 5{,}0\,\text{m/s}^2$$

circa metà dell'accelerazione di gravità, $g = 9{,}8\,\text{m/s}^2$.
```

```ad-warning
Prima i metri al secondo
Con la velocità in $\text{km/h}$ la formula dà un numero senza senso: $54^2 / 45 = 64{,}8$, che non è un'accelerazione in $\text{m/s}^2$. La velocità va convertita prima di elevarla al quadrato, dividendo per $3{,}6$.
```

```ad-example
Esempio 2: la Luna
La Luna gira attorno alla Terra su un'orbita quasi circolare di raggio $3{,}84 \cdot 10^8\,\text{m}$, con un periodo di $27{,}3$ giorni. Quanto vale la sua accelerazione centripeta?

Il periodo in secondi è $T = 27{,}3 \cdot 86\,400\,\text{s} = 2{,}358\ldots \cdot 10^6\,\text{s}$. Con il periodo:

$$a_c = \frac{4\pi^2 r}{T^2} = \frac{4\pi^2 \cdot 3{,}84 \cdot 10^8\,\text{m}}{(2{,}359 \cdot 10^6\,\text{s})^2} = 2{,}72\ldots \cdot 10^{-3}\,\text{m/s}^2 \approx 2{,}72 \cdot 10^{-3}\,\text{m/s}^2$$

Circa $3600$ volte meno di $g$: Newton usò proprio questo numero per capire che la forza che tiene la Luna in orbita è la stessa che fa cadere i corpi sulla Terra, indebolita dalla distanza.
```

```ad-example
Esempio 3: all'equatore
Un punto dell'equatore gira con la Terra a $464\,\text{m/s}$ su una circonferenza di raggio $6{,}38 \cdot 10^6\,\text{m}$, come nella lezione [Il moto circolare uniforme](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-circolare-uniforme). Quanto vale la sua accelerazione centripeta?

$$a_c = \frac{v^2}{r} = \frac{(464\,\text{m/s})^2}{6{,}38 \cdot 10^6\,\text{m}} = 0{,}0337\ldots\,\text{m/s}^2 \approx 0{,}0337\,\text{m/s}^2$$

Meno di mezzo centesimo di $g$: per questo non ci accorgiamo della rotazione della Terra.
```

```ad-example
Esempio 4: una centrifuga da laboratorio
Una centrifuga fa girare le provette a $3{,}0 \cdot 10^3$ giri al minuto, con il fondo delle provette a $8{,}0\,\text{cm}$ dall'asse. Quanto vale l'accelerazione centripeta sul fondo delle provette?

La frequenza è $f = 3{,}0 \cdot 10^3 / 60\,\text{Hz} = 50\,\text{Hz}$, la velocità angolare $\omega = 2\pi f = 314{,}1\ldots\,\text{rad/s}$, e con il raggio in metri:

$$a_c = \omega^2\,r = (314{,}16\,\text{rad/s})^2 \cdot 0{,}080\,\text{m} = 7895{,}6\ldots\,\text{m/s}^2 \approx 7{,}9 \cdot 10^3\,\text{m/s}^2$$

circa $800$ volte l'accelerazione di gravità. È questa accelerazione enorme che separa in pochi minuti le parti del sangue.
```

## Come cambia l'accelerazione con la velocità e con il raggio

Le due forme della formula dicono cose diverse, a seconda di che cosa resta fisso.

- A raggio fisso, $a_c = v^2/r$ è proporzionale al quadrato della velocità: in una curva, a velocità doppia l'accelerazione è quattro volte più grande. È la [proporzionalità quadratica](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-inversa-e-quadratica).
- A velocità fissa, $a_c = v^2/r$ è inversamente proporzionale al raggio: una curva stretta, a parità di velocità, richiede un'accelerazione più grande.
- A periodo fisso, come per i punti di una stessa giostra, $a_c = \omega^2\,r$ è direttamente proporzionale al raggio: chi sta sul bordo ha l'accelerazione più grande.

```ad-example
Esempio 5: di nuovo la giostra
Sulla giostra della lezione precedente, che fa un giro in $6{,}0\,\text{s}$, Anna è a $1{,}0\,\text{m}$ dal centro e Bruno a $2{,}5\,\text{m}$. Trova le accelerazioni centripete.

La velocità angolare è la stessa, $\omega = 2\pi / 6{,}0\,\text{s} = 1{,}047\,\text{rad/s}$:

$$
\begin{gathered}
a_A = \omega^2\,r_A = (1{,}047\,\text{rad/s})^2 \cdot 1{,}0\,\text{m} = 1{,}09\ldots\,\text{m/s}^2 \approx 1{,}1\,\text{m/s}^2 \\
a_B = \omega^2\,r_B = (1{,}047\,\text{rad/s})^2 \cdot 2{,}5\,\text{m} = 2{,}74\ldots\,\text{m/s}^2 \approx 2{,}7\,\text{m/s}^2
\end{gathered}
$$

Il rapporto è $2{,}5$, come quello dei raggi. Con $a_c = v^2/r$ si trova lo stesso: $v_B = 2{,}62\,\text{m/s}$ e $2{,}62^2 / 2{,}5 \approx 2{,}7\,\text{m/s}^2$. La formula $v^2/r$ non dice che $a_c$ cala con il raggio, perché anche $v$ cresce con il raggio.
```

Letta al contrario, la formula dice quanto si può andare veloci in una curva. Se le gomme di un'auto riescono a dare al massimo un'accelerazione centripeta $a$, in una curva di raggio $r$ la velocità non può superare quella per cui $v^2/r = a$, cioè

$$v = \sqrt{a\,r}$$

```ad-example
Esempio 6: la velocità massima in curva
Su un asfalto bagnato le gomme di un'auto danno al massimo un'accelerazione centripeta di $4{,}0\,\text{m/s}^2$. Con quale velocità massima l'auto può percorrere una curva di raggio $45\,\text{m}$?

$$v = \sqrt{a\,r} = \sqrt{4{,}0\,\text{m/s}^2 \cdot 45\,\text{m}} = \sqrt{180}\,\text{m/s} = 13{,}4\ldots\,\text{m/s} \approx 13\,\text{m/s}$$

cioè circa $48\,\text{km/h}$. Una curva di raggio quattro volte più grande permette una velocità doppia, perché la velocità va con la radice quadrata del raggio.
```

```ad-warning
Velocità doppia, accelerazione quadrupla
L'accelerazione centripeta è proporzionale al quadrato della velocità: raddoppiando la velocità in una stessa curva l'accelerazione diventa $2^2 = 4$ volte più grande, non il doppio. Un'auto che passa da $50$ a $100\,\text{km/h}$ nella stessa curva ha bisogno di un'accelerazione quattro volte maggiore.
```

Nella figura qui sotto un punto gira su una circonferenza, e le frecce della velocità e dell'accelerazione lo seguono: la velocità è sempre tangente, l'accelerazione sempre verso il centro. Cambiando il raggio e il periodo leggi come cambiano $v$ e $a_c$.

```interattivo
% nome: moto-circolare-accelerazione
% alt: Un punto che gira in senso antiorario su una circonferenza; la velocità, in blu scuro, è tangente alla circonferenza, e l'accelerazione centripeta, in verde, punta verso il centro. Due cursori cambiano il raggio e il periodo, e le lunghezze delle frecce seguono i valori; un bottone avvia o ferma il moto. Sotto sono scritti la velocità tangenziale, la velocità angolare e l'accelerazione centripeta
```

Che cosa produce l'accelerazione centripeta è una questione di forze: una forza diretta verso il centro, l'attrito delle gomme sull'asfalto per l'auto, la tensione del filo per un sasso fatto girare con una fionda, l'attrazione della Terra per la Luna. È l'argomento della lezione [La forza centripeta](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/la-forza-centripeta).
