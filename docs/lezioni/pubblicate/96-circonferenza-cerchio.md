# Circonferenza e cerchio

Con il compasso punti la punta metallica in un punto e fai girare la matita tenendo fissa l'apertura: la matita disegna una linea chiusa i cui punti sono tutti alla stessa distanza dalla punta. Quella linea è una circonferenza, e la parte di foglio che racchiude è un cerchio. Dalla distanza tra un punto e il centro, confrontata con il raggio, si capisce quasi tutto: dove sta un punto, come si comporta una retta, come stanno due circonferenze.

Qui si usano i triangoli isosceli e i criteri di congruenza della lezione [Triangoli e criteri di congruenza](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/triangoli-e-criteri-di-congruenza), la distanza di un punto da una retta della lezione [Rette perpendicolari e parallele](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele) e l'asse di un segmento come luogo di punti della lezione [Punti notevoli del triangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/punti-notevoli-del-triangolo).

## Circonferenza e cerchio

Dati un punto $O$ e un segmento $r$, la **circonferenza** di centro $O$ e raggio $r$ è il luogo dei punti del piano che hanno distanza $r$ da $O$: ci stanno tutti i punti a distanza $r$ dal centro, e solo quelli. Si chiama raggio anche ogni segmento che unisce il centro a un punto della circonferenza, come $OA$ nella figura, e tutti i raggi sono congruenti.

Il **cerchio** di centro $O$ e raggio $r$ è la figura formata dalla circonferenza e da tutti i punti che hanno distanza da $O$ minore di $r$. La circonferenza è una linea, il cerchio è una parte di piano: la circonferenza è il contorno del cerchio.

```tikz
% nome: circonferenza-cerchio-punti
% alt: Circonferenza di centro O e raggio r, con il cerchio colorato: il punto A sta sulla circonferenza, il punto P è interno e il punto Q è esterno
% svg: circonferenza-cerchio-punti-b6ff044e.svg 147x136
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) circle (1.60);
\draw[thick] (0.00,0.00) circle (1.60);
\draw (0.00,0.00) -- (1.39,0.80);
\node at (0.58,0.59) {$r$};
\fill (0.00,0.00) circle (0.06);
\node at (-0.10,-0.26) {$O$};
\fill (1.39,0.80) circle (0.06);
\node at (1.63,0.94) {$A$};
\fill (-0.80,-0.29) circle (0.06);
\node at (-1.06,-0.39) {$P$};
\fill (1.72,-1.45) circle (0.06);
\node at (1.94,-1.63) {$Q$};
\end{tikzpicture}
```

Un punto $P$ con $\overline{OP} < r$ è interno alla circonferenza, un punto $Q$ con $\overline{OQ} > r$ è esterno. Se la circonferenza ha raggio $5$ cm, un punto a $3$ cm dal centro è interno, uno a $7$ cm è esterno, uno a $5$ cm sta sulla circonferenza.

```ad-warning
Circonferenza e cerchio non sono la stessa cosa
La circonferenza è solo il bordo, e ha una lunghezza; il cerchio è tutta la regione, e ha un'area. "L'area della circonferenza" non ha senso: si dice area del cerchio e lunghezza della circonferenza.
```

## Corde, diametri e archi

Una **corda** è un segmento che ha gli estremi sulla circonferenza, come $AB$ nella figura. Una corda che passa per il centro si chiama **diametro**, come $CD$: è formata da due raggi, quindi è lunga il doppio del raggio:

$$\overline{CD} = 2r$$

```tikz
% nome: corda-diametro-arco
% alt: Circonferenza di centro O con la corda AB, il diametro CD che passa per il centro e l'arco AB evidenziato
% svg: corda-diametro-arco-07aab5fe.svg 165x140
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.60);
\draw[blue!70!black, very thick] (0.55,1.50) arc[start angle=70, end angle=150, radius=1.60];
\draw (-1.39,0.80) -- (0.55,1.50);
\draw (-1.60,0.00) -- (1.60,0.00);
\fill (0.00,0.00) circle (0.06);
\node at (0.00,-0.26) {$O$};
\fill (-1.39,0.80) circle (0.06);
\node at (-1.63,0.94) {$A$};
\fill (0.55,1.50) circle (0.06);
\node at (0.64,1.77) {$B$};
\fill (-1.60,0.00) circle (0.06);
\node at (-1.88,0.00) {$C$};
\fill (1.60,0.00) circle (0.06);
\node at (1.88,0.00) {$D$};
\end{tikzpicture}
```

Il diametro è la corda più lunga. Se $AB$ è una corda che non passa per il centro, $OAB$ è un triangolo, e per la disuguaglianza triangolare

$$\overline{AB} < \overline{OA} + \overline{OB} = 2r$$

Due punti $A$ e $B$ della circonferenza la dividono in due parti, e ognuna si chiama **arco** di estremi $A$ e $B$; nella figura è evidenziato quello più corto. Se $A$ e $B$ sono gli estremi di un diametro, i due archi sono congruenti e ognuno si chiama semicirconferenza.

Anche il cerchio si divide in parti con i raggi e con le corde. Un **settore circolare** è la parte di cerchio compresa tra due raggi e l'arco che ha per estremi i loro estremi; un **segmento circolare** è la parte di cerchio compresa tra una corda e uno dei due archi che la corda individua.

```tikz
% nome: settore-segmento-circolare
% alt: Due cerchi: a sinistra il settore circolare compreso tra i raggi OA e OB e l'arco AB; a destra il segmento circolare compreso tra la corda AB e l'arco AB
% svg: settore-segmento-circolare-bf652a2c.svg 236x133
\begin{tikzpicture}
\fill[blue!15] (0.00,0.00) -- (1.13,0.41) arc[start angle=20, end angle=110, radius=1.20] -- cycle;
\fill[blue!15] (4.43,0.41) arc[start angle=20, end angle=130, radius=1.20] -- cycle;
\draw[thick] (0.00,0.00) circle (1.20);
\draw[thick] (3.30,0.00) circle (1.20);
\draw (1.13,0.41) -- (0.00,0.00) -- (-0.41,1.13);
\draw (4.43,0.41) -- (2.53,0.92);
\fill (0.00,0.00) circle (0.06);
\node at (-0.09,-0.24) {$O$};
\fill (3.30,0.00) circle (0.06);
\node at (3.21,-0.24) {$O$};
\fill (1.13,0.41) circle (0.06);
\node at (1.39,0.51) {$A$};
\fill (-0.41,1.13) circle (0.06);
\node at (-0.51,1.39) {$B$};
\fill (4.43,0.41) circle (0.06);
\node at (4.69,0.51) {$A$};
\fill (2.53,0.92) circle (0.06);
\node at (2.35,1.13) {$B$};
\node[font=\small] at (0.00,-1.55) {settore};
\node[font=\small] at (3.30,-1.55) {segmento};
\end{tikzpicture}
```

Il settore è una fetta di torta, con la punta nel centro. Il segmento circolare è quello che si stacca tagliando il cerchio con un colpo dritto: una corda divide il cerchio in due segmenti circolari, quello dell'arco minore, che non contiene il centro, e quello dell'arco maggiore, che lo contiene. Se la corda è un diametro, i due segmenti sono congruenti e si chiamano semicerchi. Le loro aree si calcolano nella lezione [Lunghezza della circonferenza e area del cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/lunghezza-della-circonferenza-e-area-del-cerchio).

## Le proprietà delle corde

### La perpendicolare dal centro dimezza la corda

Teorema: la perpendicolare condotta dal centro a una corda la divide in due parti congruenti.

```tikz
% nome: perpendicolare-centro-dimezza-corda
% alt: Corda AB di una circonferenza di centro O: il segmento OH, perpendicolare ad AB, cade nel punto medio H della corda; i raggi OA e OB sono tratteggiati e congruenti
% svg: perpendicolare-centro-dimezza-corda-0867c7e0.svg 149x125
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.60);
\draw (-1.41,-0.75) -- (1.41,-0.75);
\draw[blue!70!black] (0.00,0.00) -- (0.00,-0.75);
\draw[dashed] (-1.41,-0.75) -- (0.00,0.00) -- (1.41,-0.75);
\draw[thin] (0.20,-0.75) -- (0.20,-0.55) -- (0.00,-0.55);
\draw[thin] (-0.71,-0.62) -- (-0.71,-0.88);
\draw[thin] (0.71,-0.62) -- (0.71,-0.88);
\draw[thin] (-0.61,-0.47) -- (-0.74,-0.24);
\draw[thin] (-0.68,-0.51) -- (-0.80,-0.28);
\draw[thin] (0.74,-0.24) -- (0.61,-0.47);
\draw[thin] (0.80,-0.28) -- (0.68,-0.51);
\fill (0.00,0.00) circle (0.06);
\node at (0.00,0.26) {$O$};
\fill (-1.41,-0.75) circle (0.06);
\node at (-1.68,-0.85) {$A$};
\fill (1.41,-0.75) circle (0.06);
\node at (1.68,-0.85) {$B$};
\fill (0.00,-0.75) circle (0.06);
\node at (0.00,-1.03) {$H$};
\end{tikzpicture}
```

Ipotesi: $AB$ è una corda della circonferenza di centro $O$; $OH \perp AB$, con $H$ su $AB$.

Tesi: $AH \cong HB$.

Dimostrazione. Se $AB$ è un diametro, $H$ coincide con $O$, che è il punto medio. Altrimenti:

1. $OA \cong OB$, perché sono raggi.
2. $O$ è equidistante da $A$ e da $B$, quindi sta sull'asse di $AB$, che è il luogo dei punti equidistanti dagli estremi.
3. L'asse di $AB$ passa per $O$ ed è perpendicolare ad $AB$. Da un punto si può condurre una sola perpendicolare a una retta, quindi l'asse è proprio la retta $OH$.
4. L'asse incontra $AB$ nel suo punto medio, quindi $H$ è il punto medio di $AB$: $AH \cong HB$.

Il passo 2 dice anche che l'asse di ogni corda passa per il centro. Per trovare il centro di una circonferenza disegnata si tracciano due corde non parallele e i loro assi: il centro è il punto in cui gli assi si incontrano.

Il triangolo $OHB$ è rettangolo in $H$, con l'ipotenusa $OB$ che è un raggio. Con il teorema di Pitagora, che conosci dalla scuola media e che si dimostra nella lezione [Teoremi di Pitagora e di Euclide](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide), si passa dal raggio e dalla distanza della corda dal centro alla lunghezza della corda, e viceversa.

```ad-example
Esempio 1: la corda dalla distanza
Una circonferenza ha raggio $5$ cm, e la corda $AB$ ha distanza $3$ cm dal centro. Quanto è lunga la corda?

```tikz
% nome: esempio-corda-distanza-centro
% alt: Circonferenza di centro O e raggio 5 con la corda AB a distanza 3 dal centro: il triangolo OHB è rettangolo in H, con OH lungo 3, HB lungo 4 e OB lungo 5
% svg: esempio-corda-distanza-centro-93dd250a.svg 133x118
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.50);
\draw (-1.20,-0.90) -- (1.20,-0.90);
\draw[blue!70!black] (0.00,0.00) -- (0.00,-0.90);
\draw (0.00,0.00) -- (1.20,-0.90);
\draw[thin] (0.16,-0.90) -- (0.16,-0.74) -- (0.00,-0.74);
\fill (0.00,0.00) circle (0.06);
\node at (0.00,0.26) {$O$};
\fill (-1.20,-0.90) circle (0.06);
\node at (-1.46,-1.00) {$A$};
\fill (1.20,-0.90) circle (0.06);
\node at (1.46,-1.00) {$B$};
\fill (0.00,-0.90) circle (0.06);
\node at (0.00,-1.18) {$H$};
\node[font=\small] at (-0.20,-0.45) {$3$};
\node[font=\small] at (0.60,-1.12) {$4$};
\node[font=\small] at (0.73,-0.27) {$5$};
\end{tikzpicture}
```

La distanza è il segmento $OH$ perpendicolare alla corda, e $H$ è il punto medio di $AB$. Nel triangolo $OHB$, rettangolo in $H$:

$$
\begin{aligned}
\overline{HB} &= \sqrt{5^2 - 3^2} \\
&= \sqrt{16} = 4 \text{ cm}
\end{aligned}
$$

La corda è il doppio: $\overline{AB} = 2 \cdot 4 = 8$ cm.

Al contrario: in una circonferenza di raggio $13$ cm una corda lunga $24$ cm ha la metà lunga $12$ cm, quindi la sua distanza dal centro è $\sqrt{13^2 - 12^2} = \sqrt{25} = 5$ cm.
```

```ad-warning
La corda intera nel triangolo rettangolo
Il cateto del triangolo $OHB$ è metà corda, non la corda intera. Con raggio $5$ e distanza $3$ la corda è $8$, non $4$; e partendo da una corda di $24$ nel triangolo va $12$, non $24$.
```

### Corde congruenti hanno la stessa distanza dal centro

Teorema: in una circonferenza due corde congruenti hanno la stessa distanza dal centro.

```tikz
% nome: corde-congruenti-stessa-distanza
% alt: Circonferenza di centro O con due corde congruenti AB e CD; le perpendicolari OH e OK dal centro alle corde sono congruenti, e i raggi OA e OC sono tratteggiati
% svg: corde-congruenti-stessa-distanza-ac145ee8.svg 150x144
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.60);
\draw (-1.29,0.95) -- (-0.88,-1.34);
\draw (0.10,-1.60) -- (1.59,0.18);
\draw[blue!70!black] (0.00,0.00) -- (-1.08,-0.19);
\draw[blue!70!black] (0.00,0.00) -- (0.84,-0.71);
\draw[dashed] (0.00,0.00) -- (-1.29,0.95);
\draw[dashed] (0.00,0.00) -- (0.10,-1.60);
\draw[thin] (-1.12,0.01) -- (-0.92,0.04) -- (-0.89,-0.16);
\draw[thin] (0.71,-0.86) -- (0.56,-0.73) -- (0.69,-0.58);
\draw[thin] (-1.06,0.40) -- (-1.31,0.36);
\draw[thin] (-0.85,-0.74) -- (-1.11,-0.79);
\draw[thin] (0.37,-1.07) -- (0.57,-1.24);
\draw[thin] (1.12,-0.18) -- (1.32,-0.35);
\draw[thin] (-0.48,-0.22) -- (-0.53,0.04);
\draw[thin] (-0.55,-0.23) -- (-0.60,0.03);
\draw[thin] (0.48,-0.23) -- (0.31,-0.43);
\draw[thin] (0.53,-0.28) -- (0.36,-0.48);
\fill (0.00,0.00) circle (0.06);
\node at (-0.14,0.24) {$O$};
\fill (-1.29,0.95) circle (0.06);
\node at (-1.51,1.12) {$A$};
\fill (-0.88,-1.34) circle (0.06);
\node at (-1.04,-1.57) {$B$};
\fill (0.10,-1.60) circle (0.06);
\node at (0.11,-1.88) {$C$};
\fill (1.59,0.18) circle (0.06);
\node at (1.87,0.22) {$D$};
\fill (-1.08,-0.19) circle (0.06);
\node at (-1.33,-0.23) {$H$};
\fill (0.84,-0.71) circle (0.06);
\node at (1.03,-0.87) {$K$};
\end{tikzpicture}
```

Ipotesi: $AB \cong CD$ sono corde della circonferenza di centro $O$; $OH \perp AB$ e $OK \perp CD$.

Tesi: $OH \cong OK$.

Dimostrazione.

1. I triangoli $OAB$ e $OCD$ hanno $OA \cong OC$ e $OB \cong OD$, perché sono raggi, e $AB \cong CD$ per ipotesi: per il terzo criterio di congruenza $\triangle OAB \cong \triangle OCD$, e quindi $\widehat{OAB} \cong \widehat{OCD}$.
2. Confronta ora i triangoli $OAH$ e $OCK$. Hanno $OA \cong OC$, perché sono raggi.
3. $\widehat{OAH} \cong \widehat{OCK}$, dal passo 1.
4. $\widehat{OHA} \cong \widehat{OKC}$, perché sono retti. Allora anche i terzi angoli sono congruenti, $\widehat{AOH} \cong \widehat{COK}$, perché la somma degli angoli di un triangolo è $180^\circ$.
5. Per il secondo criterio (il lato $OA$ e i due angoli adiacenti) $\triangle OAH \cong \triangle OCK$, quindi $OH \cong OK$.

Vale anche il teorema inverso: due corde che hanno la stessa distanza dal centro sono congruenti. Inoltre, tra due corde non congruenti, quella più vicina al centro è la più lunga: il diametro, che ha distanza zero, è la corda più lunga di tutte.

## Retta e circonferenza

Una retta e una circonferenza possono avere due punti in comune, uno solo o nessuno. Quale dei tre casi si presenta lo dice la distanza $d$ del centro dalla retta, confrontata con il raggio $r$. La distanza si misura sul segmento di perpendicolare condotto dal centro alla retta.

```tikz
% nome: retta-circonferenza-posizioni
% alt: Circonferenza di centro O e tre rette: la secante s, a distanza dal centro minore del raggio, la incontra in due punti; la tangente t, a distanza uguale al raggio, la tocca nel solo punto T; la retta esterna e, a distanza maggiore del raggio, non la incontra
% svg: retta-circonferenza-posizioni-d90769c3.svg 180x136
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.30);
\draw[blue!70!black] (-2.00,-0.60) -- (2.00,-0.60) node[right] {$s$};
\draw[blue!70!black] (0.00,1.84) -- (1.77,0.07) node[right] {$t$};
\draw[blue!70!black] (-2.27,-0.13) -- (-1.15,1.82) node[above] {$e$};
\draw[dashed] (0.00,0.00) -- (0.00,-0.60);
\draw[dashed] (0.00,0.00) -- (0.92,0.92);
\draw[dashed] (0.00,0.00) -- (-1.65,0.95);
\draw[thin] (0.16,-0.60) -- (0.16,-0.44) -- (0.00,-0.44);
\draw[thin] (0.81,1.03) -- (0.69,0.92) -- (0.81,0.81);
\draw[thin] (-1.73,0.81) -- (-1.59,0.73) -- (-1.51,0.87);
\fill (0.00,0.00) circle (0.06);
\node at (0.26,-0.15) {$O$};
\fill (-1.15,-0.60) circle (0.06);
\fill (1.15,-0.60) circle (0.06);
\fill (0.92,0.92) circle (0.06);
\node at (1.12,1.12) {$T$};
\end{tikzpicture}
```

| Distanza | Punti in comune | La retta è |
|---|---|---|
| $d < r$ | due | secante |
| $d = r$ | uno | tangente |
| $d > r$ | nessuno | esterna |

Una retta **secante** taglia la circonferenza in due punti, e la parte di retta tra i due punti è una corda. Una retta **tangente** ha con la circonferenza un solo punto in comune, il punto di contatto $T$. Una retta **esterna** non ha punti in comune con la circonferenza.

Con una circonferenza di raggio $6$ cm, una retta a distanza $4$ cm dal centro è secante, una a distanza $6$ cm è tangente, una a distanza $9$ cm è esterna. Una retta che passa per il centro ha $d = 0$ ed è sempre secante: la corda che stacca è un diametro.

### La tangente è perpendicolare al raggio

Teorema: la tangente a una circonferenza è perpendicolare al raggio che ha un estremo nel punto di contatto.

```tikz
% nome: tangente-perpendicolare-raggio
% alt: Circonferenza di centro O e retta t tangente nel punto T: il raggio OT è perpendicolare a t, e il segmento OP verso un altro punto P della tangente è più lungo del raggio
% svg: tangente-perpendicolare-raggio-0253837b.svg 142x153
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.50);
\draw[blue!70!black] (2.14,0.50) -- (-0.46,2.00) node[above] {$t$};
\draw (0.00,0.00) -- (0.75,1.30);
\draw[dashed] (0.00,0.00) -- (1.70,0.75);
\draw[thin] (0.91,1.21) -- (0.82,1.05) -- (0.66,1.14);
\fill (0.00,0.00) circle (0.06);
\node at (-0.14,-0.24) {$O$};
\fill (0.75,1.30) circle (0.06);
\node at (0.67,1.59) {$T$};
\fill (1.70,0.75) circle (0.06);
\node at (1.83,0.48) {$P$};
\end{tikzpicture}
```

Il perché viene dalla distanza. La tangente $t$ ha distanza $r$ dal centro, e la distanza si misura sulla perpendicolare: il piede $H$ della perpendicolare da $O$ a $t$ ha $\overline{OH} = r$, quindi sta sulla circonferenza. Ma l'unico punto di $t$ che sta sulla circonferenza è il punto di contatto: $H$ coincide con $T$, e $OT \perp t$. Ogni altro punto $P$ della tangente è esterno, e il segmento obliquo $OP$ è più lungo del raggio.

Vale anche il contrario: la retta perpendicolare a un raggio nel suo estremo sulla circonferenza è tangente. Così si disegna la tangente in un punto $T$: si traccia il raggio $OT$ e poi la perpendicolare a $OT$ passante per $T$.

### I segmenti di tangente da un punto esterno

Da un punto $P$ esterno alla circonferenza si possono condurre due tangenti, che toccano la circonferenza nei punti $A$ e $B$. I segmenti $PA$ e $PB$ si chiamano segmenti di tangente.

Teorema: i due segmenti di tangente condotti da un punto esterno sono congruenti.

```tikz
% nome: segmenti-tangenti-punto-esterno
% alt: Dal punto P esterno alla circonferenza di centro O partono le tangenti PA e PB, segnate come congruenti; i raggi OA e OB sono perpendicolari alle tangenti e OP divide a metà l'angolo in P
% svg: segmenti-tangenti-punto-esterno-bdf6810f.svg 190x126
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.20);
\draw[blue!70!black] (3.20,0.00) -- (0.45,1.11);
\draw[blue!70!black] (3.20,0.00) -- (0.45,-1.11);
\draw (0.00,0.00) -- (0.45,1.11);
\draw (0.00,0.00) -- (0.45,-1.11);
\draw[dashed] (0.00,0.00) -- (3.20,0.00);
\draw[thin] (0.39,0.96) -- (0.54,0.90) -- (0.60,1.05);
\draw[thin] (0.39,-0.96) -- (0.54,-0.90) -- (0.60,-1.05);
\draw[thin] (1.78,0.44) -- (1.87,0.68);
\draw[thin] (1.87,-0.68) -- (1.78,-0.44);
\draw[thin] (0.09,0.57) -- (0.33,0.48);
\draw[thin] (0.12,0.64) -- (0.36,0.54);
\draw[thin] (0.33,-0.48) -- (0.09,-0.57);
\draw[thin] (0.36,-0.54) -- (0.12,-0.64);
\draw[thin] (2.55,0.26) arc[start angle=157.98, delta angle=22.02, radius=0.70];
\draw[thin] (2.50,0.00) arc[start angle=180.00, delta angle=22.02, radius=0.70];
\fill (0.00,0.00) circle (0.06);
\node at (-0.28,0.00) {$O$};
\fill (3.20,0.00) circle (0.06);
\node at (3.48,0.00) {$P$};
\fill (0.45,1.11) circle (0.06);
\node at (0.45,1.39) {$A$};
\fill (0.45,-1.11) circle (0.06);
\node at (0.45,-1.39) {$B$};
\end{tikzpicture}
```

Ipotesi: $PA$ e $PB$ sono tangenti in $A$ e in $B$ alla circonferenza di centro $O$.

Tesi: $PA \cong PB$.

Dimostrazione.

1. $OA \perp PA$ e $OB \perp PB$, perché la tangente è perpendicolare al raggio nel punto di contatto. Quindi $\overline{OA}$ è la distanza di $O$ dalla retta $PA$, e $\overline{OB}$ la distanza di $O$ dalla retta $PB$.
2. $OA \cong OB$, perché sono raggi: $O$ è equidistante dai lati dell'angolo $\widehat{APB}$, quindi sta sulla sua bisettrice, e $\widehat{APO} \cong \widehat{BPO}$.
3. I triangoli $APO$ e $BPO$ hanno $OP$ in comune, $\widehat{APO} \cong \widehat{BPO}$ dal passo 2 e gli angoli in $A$ e in $B$ retti; allora anche i terzi angoli $\widehat{AOP}$ e $\widehat{BOP}$ sono congruenti.
4. Per il secondo criterio (il lato $OP$ e i due angoli adiacenti) $\triangle APO \cong \triangle BPO$, quindi $PA \cong PB$.

La dimostrazione dà anche due fatti che servono negli esercizi: $OP$ è la bisettrice dell'angolo $\widehat{APB}$ e dell'angolo $\widehat{AOB}$.

```ad-example
Esempio 2: l'angolo tra due tangenti
Da un punto $P$ si conducono le tangenti $PA$ e $PB$ a una circonferenza di centro $O$, e $\widehat{APB} = 50^\circ$. Quanto misura l'angolo $\widehat{AOB}$ tra i raggi?

```tikz
% nome: esempio-angolo-tra-tangenti
% alt: Le tangenti PA e PB alla circonferenza di centro O formano in P un angolo di 50 gradi; il quadrilatero OAPB ha gli angoli retti in A e in B
% svg: esempio-angolo-tra-tangenti-f2223df7.svg 164x118
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.10);
\draw[blue!70!black] (2.60,0.00) -- (0.46,1.00);
\draw[blue!70!black] (2.60,0.00) -- (0.46,-1.00);
\draw (0.00,0.00) -- (0.46,1.00);
\draw (0.00,0.00) -- (0.46,-1.00);
\draw[thin] (0.40,0.85) -- (0.54,0.78) -- (0.61,0.93);
\draw[thin] (0.40,-0.85) -- (0.54,-0.78) -- (0.61,-0.93);
\draw[thin] (2.10,0.23) arc[start angle=155.00, delta angle=50.00, radius=0.55];
\node[font=\small] at (1.75,0.00) {$50^\circ$};
\draw[thin] (0.13,-0.27) arc[start angle=-65.00, delta angle=130.00, radius=0.30];
\fill (0.00,0.00) circle (0.06);
\node at (-0.28,0.00) {$O$};
\fill (2.60,0.00) circle (0.06);
\node at (2.88,0.00) {$P$};
\fill (0.46,1.00) circle (0.06);
\node at (0.46,1.28) {$A$};
\fill (0.46,-1.00) circle (0.06);
\node at (0.46,-1.28) {$B$};
\end{tikzpicture}
```

Il quadrilatero $OAPB$ ha gli angoli in $A$ e in $B$ retti, perché le tangenti sono perpendicolari ai raggi. La somma degli angoli di un quadrilatero è $360^\circ$, e i tre angoli noti fanno insieme $90^\circ + 90^\circ + 50^\circ = 230^\circ$:

$$\widehat{AOB} = 360^\circ - 230^\circ = 130^\circ$$

In generale $\widehat{AOB}$ e $\widehat{APB}$ sono supplementari. E se il raggio è $5$ cm e $\overline{OP} = 13$ cm, nel triangolo $OAP$, rettangolo in $A$, il segmento di tangente è $\overline{PA} = \sqrt{13^2 - 5^2} = \sqrt{144} = 12$ cm, e anche $\overline{PB} = 12$ cm.
```

## Due circonferenze

Per due circonferenze conta la distanza $d$ tra i centri, confrontata con la somma e con la differenza dei raggi. Chiama $r$ il raggio maggiore e $r'$ quello minore.

```tikz
% nome: due-circonferenze-posizioni
% alt: Sei coppie di circonferenze, una grande e una piccola: esterne, tangenti esternamente, secanti, tangenti internamente, una interna all'altra, concentriche
% svg: due-circonferenze-posizioni-4ba8cc77.svg 268x163
\begin{tikzpicture}
\draw[thick] (-0.45,0.00) circle (0.65);
\draw[thick, blue!70!black] (0.80,0.00) circle (0.30);
\fill (-0.45,0.00) circle (0.04);
\fill (0.80,0.00) circle (0.04);
\node[align=center, font=\scriptsize] at (0.00,-0.98) {esterne};
\draw[thick] (2.20,0.00) circle (0.65);
\draw[thick, blue!70!black] (3.15,0.00) circle (0.30);
\fill (2.20,0.00) circle (0.04);
\fill (3.15,0.00) circle (0.04);
\node[align=center, font=\scriptsize] at (2.50,-0.98) {tangenti\\esternamente};
\draw[thick] (4.87,0.00) circle (0.65);
\draw[thick, blue!70!black] (5.49,0.00) circle (0.30);
\fill (4.87,0.00) circle (0.04);
\fill (5.49,0.00) circle (0.04);
\node[align=center, font=\scriptsize] at (5.00,-0.98) {secanti};
\draw[thick] (0.00,-2.25) circle (0.65);
\draw[thick, blue!70!black] (0.35,-2.25) circle (0.30);
\fill (0.00,-2.25) circle (0.04);
\fill (0.35,-2.25) circle (0.04);
\node[align=center, font=\scriptsize] at (0.00,-3.23) {tangenti\\internamente};
\draw[thick] (2.50,-2.25) circle (0.65);
\draw[thick, blue!70!black] (2.64,-2.25) circle (0.30);
\fill (2.50,-2.25) circle (0.04);
\fill (2.64,-2.25) circle (0.04);
\node[align=center, font=\scriptsize] at (2.50,-3.23) {interne};
\draw[thick] (5.00,-2.25) circle (0.65);
\draw[thick, blue!70!black] (5.00,-2.25) circle (0.30);
\fill (5.00,-2.25) circle (0.04);
\node[align=center, font=\scriptsize] at (5.00,-3.23) {concentriche};
\end{tikzpicture}
```

| Distanza dei centri | Le circonferenze sono | Punti in comune |
|---|---|---|
| $d > r + r'$ | esterne | nessuno |
| $d = r + r'$ | tangenti esternamente | uno |
| $r - r' < d < r + r'$ | secanti | due |
| $d = r - r'$ | tangenti internamente | uno |
| $d < r - r'$ | una interna all'altra | nessuno |

Il caso $d = 0$ è quello delle circonferenze concentriche, che hanno lo stesso centro: è un caso particolare dell'ultima riga, e la regione tra le due si chiama corona circolare. Quando le circonferenze sono tangenti, i due centri e il punto di contatto stanno sulla stessa retta.

```ad-example
Esempio 3: dalla distanza dei centri alla posizione
Due circonferenze hanno raggi $7$ cm e $3$ cm. Come sono se la distanza dei centri è $12$ cm, $10$ cm, $6$ cm, $4$ cm, $2$ cm?

La somma dei raggi è $7 + 3 = 10$ cm, la differenza $7 - 3 = 4$ cm.

- $d = 12$: maggiore di $10$, esterne.
- $d = 10$: uguale alla somma, tangenti esternamente.
- $d = 6$: tra $4$ e $10$, secanti.
- $d = 4$: uguale alla differenza, tangenti internamente.
- $d = 2$: minore di $4$, la più piccola è interna all'altra.
```

```ad-warning
Confrontare solo con la somma
Con $d < r + r'$ le circonferenze non sono per forza secanti: con raggi $7$ e $3$ e $d = 2$ la somma è $10$ e $2 < 10$, ma la piccola sta tutta dentro la grande. Il confronto va fatto anche con la differenza dei raggi.
```

## Angoli al centro e alla circonferenza

Un **angolo al centro** è un angolo che ha il vertice nel centro della circonferenza, come $\widehat{AOB}$ nella figura. Un **angolo alla circonferenza** ha il vertice sulla circonferenza e i due lati secanti, come $\widehat{AVB}$. Un angolo al centro o alla circonferenza insiste sull'arco che contiene al suo interno, con gli estremi sui lati: nella figura, tutti e due insistono sull'arco $AB$ evidenziato, e si dicono corrispondenti.

```tikz
% nome: angolo-al-centro-e-alla-circonferenza
% alt: Circonferenza di centro O con l'arco AB evidenziato: l'angolo al centro AOB e l'angolo alla circonferenza AVB, con il vertice V sulla circonferenza, insistono sullo stesso arco
% svg: angolo-al-centro-e-alla-circonferenza-aeaed97d.svg 139x145
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.60);
\draw[blue!70!black, very thick] (-1.31,-0.92) arc[start angle=215, end angle=325, radius=1.60];
\draw (-1.31,-0.92) -- (0.00,0.00) -- (1.31,-0.92);
\draw[blue!70!black] (-1.31,-0.92) -- (-0.28,1.58) -- (1.31,-0.92);
\draw[thin] (-0.29,-0.20) arc[start angle=-145.00, delta angle=110.00, radius=0.35];
\draw[thin] (-0.47,1.11) arc[start angle=-112.50, delta angle=55.00, radius=0.50];
\fill (0.00,0.00) circle (0.06);
\node at (0.00,0.28) {$O$};
\fill (-0.28,1.58) circle (0.06);
\node at (-0.33,1.85) {$V$};
\fill (-1.31,-0.92) circle (0.06);
\node at (-1.54,-1.08) {$A$};
\fill (1.31,-0.92) circle (0.06);
\node at (1.54,-1.08) {$B$};
\end{tikzpicture}
```

Teorema: un angolo alla circonferenza è la metà dell'angolo al centro corrispondente, cioè dell'angolo al centro che insiste sullo stesso arco.

$$\widehat{AVB} = \frac{1}{2}\,\widehat{AOB}$$

Nella figura $\widehat{AOB} = 110^\circ$, e ogni angolo alla circonferenza che insiste sull'arco $AB$ misura $55^\circ$.

Prova a spostare $V$ lungo la circonferenza: l'angolo in $V$ resta lo stesso. Con $A$ e $B$ cambi l'arco, e quando $AB$ diventa un diametro l'angolo in $V$ è retto. Porta anche $V$ tra $A$ e $B$, sull'arco minore, e guarda quale angolo al centro gli corrisponde.

```interattivo
% nome: angolo-alla-circonferenza
% alt: Circonferenza di centro O con tre punti trascinabili, A, B e V. L'angolo alla circonferenza AVB insiste sull'arco AB che non contiene V, evidenziato, e le sue misure sono scritte accanto a quelle dell'angolo al centro AOB: l'angolo in V è sempre la metà dell'angolo al centro, non cambia finché V resta sullo stesso arco, è retto quando AB è un diametro, e quando V sta sull'arco minore l'angolo al centro corrispondente è quello concavo
```

### La dimostrazione, con un lato che passa per il centro

Il caso più semplice è quello in cui uno dei due lati dell'angolo alla circonferenza passa per il centro.

```tikz
% nome: angolo-alla-circonferenza-lato-per-il-centro
% alt: Angolo alla circonferenza AVB con il lato VB che passa per il centro O: il triangolo VOA è isoscele, con i raggi OV e OA congruenti e gli angoli in V e in A congruenti, e l'angolo al centro AOB è il suo angolo esterno
% svg: angolo-alla-circonferenza-lato-per-il-centro-b85f1456.svg 132x144
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.60);
\draw[blue!70!black] (-1.31,-0.92) -- (-0.80,1.39) -- (0.80,-1.39);
\draw (0.00,0.00) -- (-1.31,-0.92);
\draw[thin] (-0.51,0.63) -- (-0.29,0.76);
\draw[thin] (-0.58,-0.57) -- (-0.73,-0.35);
\draw[thin] (-0.91,0.90) arc[start angle=-102.50, delta angle=42.50, radius=0.50];
\draw[thin] (-0.98,-0.69) arc[start angle=35.00, delta angle=42.50, radius=0.40];
\draw[thin] (-0.25,-0.17) arc[start angle=-145.00, delta angle=85.00, radius=0.30];
\draw[thin] (-0.31,-0.22) arc[start angle=-145.00, delta angle=85.00, radius=0.38];
\fill (0.00,0.00) circle (0.06);
\node at (0.28,0.10) {$O$};
\fill (-0.80,1.39) circle (0.06);
\node at (-0.94,1.63) {$V$};
\fill (-1.31,-0.92) circle (0.06);
\node at (-1.54,-1.08) {$A$};
\fill (0.80,-1.39) circle (0.06);
\node at (0.94,-1.63) {$B$};
\end{tikzpicture}
```

Ipotesi: $\widehat{AVB}$ è un angolo alla circonferenza, e il lato $VB$ passa per il centro $O$.

Tesi: $\widehat{AOB} = 2 \cdot \widehat{AVB}$.

Dimostrazione.

1. $OV \cong OA$, perché sono raggi: il triangolo $VOA$ è isoscele sulla base $VA$.
2. In un triangolo isoscele gli angoli alla base sono congruenti: $\widehat{OVA} \cong \widehat{OAV}$.
3. $V$, $O$ e $B$ stanno sulla stessa retta, quindi $\widehat{AOB}$ è un angolo esterno del triangolo $VOA$, e un angolo esterno è la somma dei due angoli interni non adiacenti: $\widehat{AOB} = \widehat{OVA} + \widehat{OAV}$.
4. Per il passo 2 i due addendi sono uguali: $\widehat{AOB} = 2 \cdot \widehat{OVA} = 2 \cdot \widehat{AVB}$.

Negli altri due casi si traccia il diametro $VD$ e ci si riporta a questo. Se il centro sta dentro l'angolo, il diametro divide $\widehat{AVB}$ in due angoli con un lato per il centro, e l'angolo al centro nei due corrispondenti: per ciascuna coppia vale il caso dimostrato, e si sommano. Se il centro sta fuori dall'angolo, $\widehat{AVB}$ è la differenza di due angoli con un lato per il centro, $\widehat{AVD}$ e $\widehat{BVD}$, e si sottraggono.

```tikz
% nome: angolo-alla-circonferenza-altri-casi
% alt: Gli altri due casi dell'angolo alla circonferenza AVB: a sinistra il centro O è dentro l'angolo, a destra è fuori; in tutti e due si traccia il diametro VD tratteggiato
% svg: angolo-alla-circonferenza-altri-casi-833efdeb.svg 232x128
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.15);
\draw[thick] (3.10,0.00) circle (1.15);
\draw[blue!70!black] (-0.81,-0.81) -- (-0.10,1.15) -- (0.88,-0.74);
\draw (-0.81,-0.81) -- (0.00,0.00) -- (0.88,-0.74);
\draw[dashed] (-0.10,1.15) -- (0.10,-1.15);
\fill (0.00,0.00) circle (0.06);
\fill (-0.10,1.15) circle (0.06);
\fill (-0.81,-0.81) circle (0.06);
\fill (0.88,-0.74) circle (0.06);
\fill (0.10,-1.15) circle (0.06);
\node at (-0.12,1.42) {$V$};
\node at (-1.01,-1.01) {$A$};
\node at (1.10,-0.92) {$B$};
\node at (0.12,-1.42) {$D$};
\draw[blue!70!black] (4.18,0.39) -- (1.95,0.00) -- (3.30,1.13);
\draw (4.18,0.39) -- (3.10,0.00) -- (3.30,1.13);
\draw[dashed] (1.95,0.00) -- (4.25,0.00);
\fill (3.10,0.00) circle (0.06);
\fill (1.95,0.00) circle (0.06);
\fill (4.18,0.39) circle (0.06);
\fill (3.30,1.13) circle (0.06);
\fill (4.25,0.00) circle (0.06);
\node at (1.67,0.00) {$V$};
\node at (4.44,0.49) {$A$};
\node at (3.35,1.41) {$B$};
\node at (4.53,0.00) {$D$};
\node at (-0.26,0.00) {$O$};
\node at (3.01,-0.24) {$O$};
\end{tikzpicture}
```

### Due conseguenze

Tutti gli angoli alla circonferenza che insistono sullo stesso arco sono congruenti, perché sono tutti la metà dello stesso angolo al centro.

```tikz
% nome: angoli-alla-circonferenza-stesso-arco
% alt: Tre angoli alla circonferenza con i vertici V1, V2 e V3 che insistono sullo stesso arco AB: hanno tutti la stessa ampiezza
% svg: angoli-alla-circonferenza-stesso-arco-b7b05ba5.svg 151x153
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.60);
\draw[blue!70!black, very thick] (-1.45,-0.68) arc[start angle=205, end angle=335, radius=1.60];
\draw[blue!70!black] (-1.45,-0.68) -- (0.80,1.39) -- (1.45,-0.68);
\draw[thin] (0.49,1.10) arc[start angle=-137.50, delta angle=65.00, radius=0.42];
\fill (0.80,1.39) circle (0.06);
\node at (0.96,1.66) {$V_1$};
\draw[blue!70!black] (-1.45,-0.68) -- (-0.41,1.55) -- (1.45,-0.68);
\draw[thin] (-0.59,1.16) arc[start angle=-115.00, delta angle=65.00, radius=0.42];
\fill (-0.41,1.55) circle (0.06);
\node at (-0.50,1.85) {$V_2$};
\draw[blue!70!black] (-1.45,-0.68) -- (-1.39,0.80) -- (1.45,-0.68);
\draw[thin] (-1.40,0.38) arc[start angle=-92.50, delta angle=65.00, radius=0.42];
\fill (-1.39,0.80) circle (0.06);
\node at (-1.66,0.96) {$V_3$};
\fill (-1.45,-0.68) circle (0.06);
\node at (-1.70,-0.79) {$A$};
\fill (1.45,-0.68) circle (0.06);
\node at (1.70,-0.79) {$B$};
\fill (0.00,0.00) circle (0.06);
\node at (0.00,0.26) {$O$};
\end{tikzpicture}
```

Un angolo alla circonferenza che insiste su una semicirconferenza è retto. L'angolo al centro corrispondente ha i lati sul diametro, quindi è un angolo piatto, e la metà di $180^\circ$ è $90^\circ$. Detto con i triangoli: se $AB$ è un diametro e $C$ è un altro punto della circonferenza, il triangolo $ABC$ è rettangolo in $C$.

```tikz
% nome: angolo-inscritto-semicirconferenza
% alt: Triangolo ABC con il lato AB diametro della circonferenza di centro O e il vertice C sulla circonferenza: l'angolo in C è retto
% svg: angolo-inscritto-semicirconferenza-cdd33324.svg 165x137
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.60);
\draw (-1.60,0.00) -- (1.60,0.00);
\draw[blue!70!black] (-1.60,0.00) -- (0.68,1.45) -- (1.60,0.00);
\draw[thin] (0.51,1.34) -- (0.61,1.17) -- (0.78,1.28);
\fill (0.00,0.00) circle (0.06);
\node at (0.00,-0.28) {$O$};
\fill (-1.60,0.00) circle (0.06);
\node at (-1.88,0.00) {$A$};
\fill (1.60,0.00) circle (0.06);
\node at (1.88,0.00) {$B$};
\fill (0.68,1.45) circle (0.06);
\node at (0.79,1.70) {$C$};
\end{tikzpicture}
```

```ad-example
Esempio 4: angoli al centro e alla circonferenza
(a) Un angolo al centro misura $110^\circ$. Quanto misura un angolo alla circonferenza che insiste sullo stesso arco?

$$110^\circ : 2 = 55^\circ$$

(b) Un angolo alla circonferenza misura $35^\circ$. Quanto misura l'angolo al centro corrispondente?

$$2 \cdot 35^\circ = 70^\circ$$

(c) Il triangolo $ABC$ è inscritto in una semicirconferenza di diametro $AB$, e $\hat{A} = 28^\circ$. Quanto misura $\hat{B}$?

L'angolo in $C$ è retto, quindi gli angoli acuti sono complementari:

$$\hat{B} = 90^\circ - 28^\circ = 62^\circ$$
```

```ad-warning
Il doppio e la metà scambiati
L'angolo alla circonferenza è quello più piccolo: è la metà dell'angolo al centro, non il doppio. Un controllo veloce sulla figura: il vertice sulla circonferenza è più lontano dall'arco, e vede l'arco sotto un angolo più stretto.
```

```ad-example
Esempio 5: un angolo alla circonferenza ottuso
L'angolo alla circonferenza $\widehat{AVB}$ misura $120^\circ$. Quanto misura l'angolo al centro corrispondente?

```tikz
% nome: esempio-angolo-al-centro-concavo
% alt: Angolo alla circonferenza AVB di 120 gradi, con il vertice V sull'arco minore: l'arco su cui insiste è quello maggiore, evidenziato, e l'angolo al centro corrispondente è l'angolo concavo AOB di 240 gradi
% svg: esempio-angolo-al-centro-concavo-30ad7c33.svg 140x143
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.50);
\draw[blue!70!black, very thick] (1.15,-0.96) arc[start angle=-40, end angle=200, radius=1.50];
\draw (-1.41,-0.51) -- (0.00,0.00) -- (1.15,-0.96);
\draw[blue!70!black] (-1.41,-0.51) -- (-0.26,-1.48) -- (1.15,-0.96);
\draw[thin] (0.23,-0.19) arc[start angle=-40, end angle=200, radius=0.30];
\draw[thin] (0.02,-1.37) arc[start angle=20.00, delta angle=120.00, radius=0.30];
\node[font=\small] at (0.00,0.55) {$240^\circ$};
\node[font=\small] at (-0.26,-0.93) {$120^\circ$};
\fill (0.00,0.00) circle (0.06);
\node at (0.00,-0.26) {$O$};
\fill (-0.26,-1.48) circle (0.06);
\node at (-0.31,-1.75) {$V$};
\fill (-1.41,-0.51) circle (0.06);
\node at (-1.67,-0.61) {$A$};
\fill (1.15,-0.96) circle (0.06);
\node at (1.36,-1.14) {$B$};
\end{tikzpicture}
```

Il vertice $V$ sta sull'arco minore $AB$, quindi l'angolo insiste sull'arco maggiore, quello che non contiene $V$. L'angolo al centro corrispondente è quello che contiene l'arco maggiore:

$$2 \cdot 120^\circ = 240^\circ$$

È un angolo concavo. L'angolo convesso $\widehat{AOB}$ misura $360^\circ - 240^\circ = 120^\circ$, e gli angoli alla circonferenza con il vertice sull'arco maggiore ne sono la metà, $60^\circ$.
```

```ad-example
Esempio 6: il diametro come ipotenusa
In una circonferenza di diametro $AB = 10$ cm il punto $C$ della circonferenza ha $\overline{AC} = 6$ cm. Quanto è lungo $BC$?

```tikz
% nome: esempio-triangolo-inscritto-semicirconferenza
% alt: Triangolo ABC inscritto in una semicirconferenza di diametro AB, con il cateto AC lungo 6 e il cateto BC lungo 8: l'angolo in C è retto
% svg: esempio-triangolo-inscritto-semicirconferenza-744eb8aa.svg 157x134
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.50);
\draw (-1.50,0.00) -- (1.50,0.00);
\draw[blue!70!black] (-1.50,0.00) -- (-0.42,1.44) -- (1.50,0.00);
\draw[thin] (-0.53,1.30) -- (-0.38,1.19) -- (-0.28,1.33);
\fill (0.00,0.00) circle (0.06);
\node at (0.00,-0.28) {$O$};
\fill (-1.50,0.00) circle (0.06);
\node at (-1.78,0.00) {$A$};
\fill (1.50,0.00) circle (0.06);
\node at (1.78,0.00) {$B$};
\fill (-0.42,1.44) circle (0.06);
\node at (-0.50,1.71) {$C$};
\node[font=\small] at (-1.14,0.85) {$6$};
\node[font=\small] at (0.67,0.90) {$8$};
\end{tikzpicture}
```

L'angolo in $C$ insiste su una semicirconferenza, quindi è retto, e $AB$ è l'ipotenusa del triangolo $ABC$. Per il teorema di Pitagora

$$
\begin{aligned}
\overline{BC} &= \sqrt{10^2 - 6^2} \\
&= \sqrt{64} = 8 \text{ cm}
\end{aligned}
$$
```

```ad-warning
Il lato opposto all'angolo retto
Nel triangolo inscritto in una semicirconferenza l'angolo retto è quello con il vertice sulla circonferenza, e l'ipotenusa è il diametro. Con $AB = 10$ e $AC = 6$ il conto $\sqrt{10^2 + 6^2}$ tratta il diametro come un cateto, e dà un lato più lungo del diametro, che è impossibile.
```
