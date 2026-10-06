# Il momento angolare

Una ruota di bicicletta che gira veloce, tenuta per il mozzo, si oppone a chi prova a inclinarla; una trottola resta in piedi finché gira e cade appena si ferma. Per descrivere quanto moto di rotazione ha un corpo non basta la [quantità di moto](/materiale/scuola-superiore/fisica/la-quantita-di-moto/la-quantita-di-moto): quella di una ruota che gira sul posto è zero, perché per ogni pezzetto che va in un verso ce n'è uno che va nel verso opposto. Serve una grandezza nuova, il momento angolare, che sta alla quantità di moto come il momento di una forza sta alla forza.

## Il momento angolare di una particella

Una particella di massa $m$ si muove con velocità $\vec{v}$, e quindi ha quantità di moto $\vec{p} = m\,\vec{v}$. Scegliamo un punto fisso $O$, il **polo**, e chiamiamo $\vec{r}$ il vettore che va da $O$ alla particella. Il **momento angolare** della particella rispetto a $O$ è il [prodotto vettoriale](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/prodotto-scalare-e-prodotto-vettoriale)

$$\vec{L} = \vec{r} \times \vec{p}$$

Il suo modulo è

$$L = r\,p\sin\varphi = r\,m\,v\sin\varphi$$

dove $\varphi$ è l'angolo tra $\vec{r}$ e $\vec{p}$. L'unità di misura è il $\text{kg}\cdot\text{m}^2/\text{s}$, che non ha un nome proprio.

```tikz
% nome: momento-angolare-particella-braccio
% alt: Un polo O e una particella P che si muove verso destra lungo una retta orizzontale. Il vettore r va da O a P, il vettore p parte da P lungo la retta; l'angolo phi è quello tra il prolungamento di r e p. Il braccio b è il segmento perpendicolare che va da O alla retta su cui si muove la particella
\begin{tikzpicture}
\draw[dashed, thin] (-1,1.5) -- (5,1.5);
\draw[dashed, thin] (2.598,1.5) -- (3.9,2.252);
\draw[dashed, thin] (0,0) -- (0,1.5);
\draw[thin] (0,1.3) -- (0.2,1.3) -- (0.2,1.5);
\node[left] at (0,0.75) {$b$};
\draw[-{Stealth}, thick, blue] (0,0) -- (2.598,1.5);
\node[below right] at (1.3,0.75) {$\vec{r}$};
\draw[-{Stealth}, thick, blue!60!black] (2.598,1.5) -- (4.4,1.5) node[below] {$\vec{p}$};
\draw (3.4,1.5) arc[start angle=0, end angle=30, radius=0.8];
\node at (3.72,1.72) {$\varphi$};
\fill (0,0) circle (1.5pt) node[below] {$O$};
\draw[thick, fill=blue!10] (2.598,1.5) circle (0.12);
\node[above] at (2.5,1.6) {$P$};
\end{tikzpicture}
```

Il prodotto $r\sin\varphi$ ha un significato geometrico che conosci dal [momento di una forza](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/il-momento-di-una-forza-e-di-una-coppia-di-forze): è il **braccio** $b$, la distanza del polo dalla retta lungo cui la particella si sta muovendo. Il modulo del momento angolare si può quindi scrivere anche

$$L = m\,v\,b$$

Le due scritture dicono la stessa cosa. Quella con il braccio è più comoda quando la distanza dalla retta si legge dalla figura, ed evita di calcolare il seno di un angolo ottuso (che comunque è uguale a quello dell'angolo che manca a $180^\circ$: $\sin 150^\circ = \sin 30^\circ$).

### Direzione e verso

Come ogni prodotto vettoriale, $\vec{L}$ è perpendicolare sia a $\vec{r}$ sia a $\vec{p}$, cioè al piano in cui la particella si muove. Il verso lo dà la regola della mano destra: con le dita che vanno da $\vec{r}$ verso $\vec{p}$, il pollice indica $\vec{L}$. Se il moto è disegnato sul foglio, restano solo due possibilità:

- la particella gira intorno a $O$ in senso antiorario: $\vec{L}$ esce dal foglio, e si disegna $\odot$;
- gira in senso orario: $\vec{L}$ entra nel foglio, $\otimes$.

Quando tutti i moti stanno nello stesso piano basta un segno: positivo per il verso antiorario, negativo per quello orario, la stessa convenzione dei momenti delle forze. Nella figura sopra la particella passa sopra $O$ andando verso destra, cioè gira intorno a $O$ in senso orario: $\vec{L}$ entra nel foglio.

```ad-warning
Il momento angolare dipende dal polo
La stessa particella, nello stesso istante, ha momenti angolari diversi rispetto a poli diversi, perché cambiano $\vec{r}$ e il braccio. Un valore di $L$ senza il polo a cui si riferisce non dice niente: in ogni problema il polo si sceglie all'inizio e non si cambia più.
```

## Due moti a confronto

### Il moto circolare

Una particella che percorre una circonferenza di raggio $r$, con il polo nel centro, ha la velocità sempre perpendicolare al raggio: $\varphi = 90^\circ$, $\sin\varphi = 1$ e il braccio è il raggio stesso. Quindi

$$L = m\,v\,r$$

e con $v = \omega\,r$ del [moto circolare](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-circolare-uniforme) si può anche scrivere $L = m\,r^2\,\omega$.

```tikz
% nome: momento-angolare-moto-circolare
% alt: Una particella percorre in senso antiorario una circonferenza di centro O. Il vettore r va dal centro alla particella, la velocità v è tangente e perpendicolare a r, con il quadratino dell'angolo retto. Nel centro un cerchietto con un punto indica che il momento angolare L esce dal foglio
\begin{tikzpicture}
\draw[dashed, thin] (0,0) circle (1.8);
\draw[-{Stealth}, thick, blue] (0,0) -- (40:1.8);
\node at (0.95,0.38) {$\vec{r}$};
\draw[-{Stealth}, thick, blue!60!black] (40:1.8) -- ++(130:1.4) node[left] {$\vec{v}$};
\draw[thin] (40:1.6) -- ++(130:0.2) -- ++(40:0.2);
\draw[thick, fill=blue!10] (40:1.8) circle (0.12);
\draw[thick] (0,0) circle (0.14);
\fill (0,0) circle (1.3pt);
\node[below left] at (-0.05,-0.05) {$\vec{L}$};
\node[below right] at (0.1,-0.05) {$O$};
\draw[-{Stealth}, thick] (-70:2.15) arc[start angle=-70, end angle=-25, radius=2.15];
\end{tikzpicture}
```

```ad-example
Esempio 1: un sasso nella fionda
Un sasso di $0{,}20\,\text{kg}$ gira in una fionda su una circonferenza di raggio $0{,}80\,\text{m}$ alla velocità di $5{,}0\,\text{m/s}$. Quanto vale il suo momento angolare rispetto al centro?

La velocità è perpendicolare al raggio:

$$L = m\,v\,r = 0{,}20\,\text{kg} \cdot 5{,}0\,\text{m/s} \cdot 0{,}80\,\text{m} = 0{,}80\,\text{kg}\cdot\text{m}^2/\text{s}$$

Se il sasso, visto dall'alto, gira in senso antiorario, $\vec{L}$ è verticale e punta verso l'alto.
```

### Il moto rettilineo

Per avere momento angolare non serve girare. Una particella che va dritta a velocità costante, lungo una retta che non passa per il polo, ha un momento angolare, e questo momento angolare non cambia mentre la particella avanza: la distanza $r$ dal polo cambia, l'angolo $\varphi$ cambia, ma il prodotto $r\sin\varphi$ è sempre il braccio $b$, la distanza del polo dalla retta.

```tikz
% nome: momento-angolare-moto-rettilineo
% alt: Una particella si muove verso destra lungo una retta orizzontale, disegnata in tre posizioni successive con la stessa quantità di moto p. Dal polo O, sotto la retta, partono i tre vettori posizione, di lunghezze e direzioni diverse. Il braccio b, la distanza di O dalla retta, è lo stesso per tutte e tre le posizioni
\begin{tikzpicture}
\draw[dashed, thin] (-2.6,1.4) -- (4.6,1.4);
\draw[dashed, thin] (0,0) -- (0,1.4);
\draw[thin] (0,1.2) -- (0.2,1.2) -- (0.2,1.4);
\node[right] at (0,0.6) {$b$};
\draw[-{Stealth}, thick, blue] (0,0) -- (-1.8,1.4);
\draw[-{Stealth}, thick, blue] (0,0) -- (1.0,1.4);
\draw[-{Stealth}, thick, blue] (0,0) -- (3.2,1.4);
\node at (-1.25,0.6) {$\vec{r}_1$};
\node at (0.95,0.85) {$\vec{r}_2$};
\node at (2.1,0.6) {$\vec{r}_3$};
\foreach \x in {-1.8,1.0,3.2} {
  \draw[-{Stealth}, thick, blue!60!black] (\x,1.4) -- ++(1.0,0);
  \draw[thick, fill=blue!10] (\x,1.4) circle (0.12);
}
\node[above] at (3.8,1.45) {$\vec{p}$};
\fill (0,0) circle (1.5pt) node[below] {$O$};
\end{tikzpicture}
```

```ad-example
Esempio 2: un gabbiano in volo rettilineo
Un gabbiano di $0{,}45\,\text{kg}$ vola in linea retta a $12\,\text{m/s}$. Tu sei fermo sulla spiaggia; in un certo istante il gabbiano è a $30\,\text{m}$ da te, e la sua velocità forma un angolo di $30^\circ$ con la retta che vi congiunge. Quanto vale il suo momento angolare rispetto a te?

La quantità di moto è $p = m\,v = 0{,}45\,\text{kg} \cdot 12\,\text{m/s} = 5{,}4\,\text{kg}\cdot\text{m/s}$. Con $\sin 30^\circ = 0{,}5$:

$$L = r\,p\sin\varphi = 30\,\text{m} \cdot 5{,}4\,\text{kg}\cdot\text{m/s} \cdot 0{,}5 = 81\,\text{kg}\cdot\text{m}^2/\text{s}$$

Il braccio è $b = r\sin\varphi = 15\,\text{m}$: il gabbiano passerà a $15\,\text{m}$ da te nel punto di minima distanza, e in quel momento $L = m\,v\,b = 0{,}45\,\text{kg} \cdot 12\,\text{m/s} \cdot 15\,\text{m}$ darà ancora $81\,\text{kg}\cdot\text{m}^2/\text{s}$.
```

Nella figura qui sotto una particella di $0{,}50\,\text{kg}$ corre a $2{,}0\,\text{m/s}$ lungo una retta, e tu scegli a che distanza dal polo passa la retta. La domanda è che cosa succede al momento angolare mentre la particella si avvicina a $O$ e poi si allontana.

```interattivo
% nome: momento-angolare-moto-rettilineo-braccio
% alt: Una particella di 0,50 chilogrammi si muove a 2,0 metri al secondo lungo una retta orizzontale, sopra un polo O. Un cursore sceglie il braccio, cioè la distanza della retta da O, da 0 a 3 metri, e un bottone fa partire la particella. Sono disegnati il vettore posizione r, la quantità di moto p, l'angolo phi tra i due e il braccio b. Sotto sono scritti r, phi, il prodotto r per seno di phi e il momento angolare L, che resta costante
```

Mentre la particella avanza, $r$ prima diminuisce e poi cresce e $\varphi$ passa da un angolo vicino a $180^\circ$ a uno piccolo, ma $r\sin\varphi$ resta uguale al braccio e $L$ non cambia. Con il braccio a zero la retta passa per il polo e il momento angolare è nullo.

```ad-warning
Anche chi va dritto ha un momento angolare
Pensare che $L$ sia zero perché "la particella non ruota" è un errore. È zero solo se la retta del moto passa per il polo, cioè se $\vec{r}$ e $\vec{p}$ sono paralleli: $\sin 0^\circ = \sin 180^\circ = 0$. L'errore opposto è scrivere sempre $L = m\,v\,r$: vale solo quando $\vec{v}$ è perpendicolare a $\vec{r}$.
```

## Il momento angolare di un corpo rigido

Un corpo rigido che ruota intorno a un asse fisso con velocità angolare $\omega$ è un insieme di pezzetti che percorrono circonferenze intorno all'asse. Il pezzetto di massa $m_i$ a distanza $r_i$ dall'asse ha velocità $v_i = \omega\,r_i$ e momento angolare $m_i v_i r_i = m_i r_i^2\,\omega$. Tutti girano nello stesso verso, quindi i momenti angolari si sommano:

$$L = m_1 r_1^2\,\omega + m_2 r_2^2\,\omega + \ldots = \left(m_1 r_1^2 + m_2 r_2^2 + \ldots\right)\omega$$

La somma tra parentesi è il [momento d'inerzia](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/il-momento-d-inerzia) $I$ del corpo rispetto all'asse. Il momento angolare di un corpo rigido che ruota intorno a un asse fisso è

$$L = I\,\omega$$

Il vettore $\vec{L}$ sta lungo l'asse di rotazione, con il verso della mano destra: se le dita si chiudono nel verso in cui il corpo gira, il pollice indica $\vec{L}$. Un disco che, visto dall'alto, gira in senso antiorario ha $\vec{L}$ verso l'alto.

```tikz
% nome: momento-angolare-disco-asse
% alt: Un disco orizzontale visto in prospettiva, che ruota intorno all'asse verticale passante per il centro. Una freccia curva sul bordo indica la rotazione antioraria vista dall'alto, con velocità angolare omega; il vettore momento angolare L parte dal centro ed è diretto lungo l'asse, verso l'alto
\begin{tikzpicture}
\draw[dashed, thin] (0,-1.3) -- (0,-0.6);
\draw[thick, fill=blue!10] (0,0) ellipse (2 and 0.6);
\draw[dashed, thin] (0,-0.6) -- (0,0);
\fill (0,0) circle (1.5pt);
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (0,1.9) node[right] {$\vec{L}$};
\draw[dashed, thin] (0,1.9) -- (0,2.4);
\draw[-{Stealth}, thick] (-1.3,-0.78) arc[start angle=225, end angle=315, x radius=1.84, y radius=0.55];
\node[right] at (1.45,-0.8) {$\omega$};
\end{tikzpicture}
```

```ad-example
Esempio 3: la ruota di una bicicletta
Una ruota di bicicletta ha massa $1{,}5\,\text{kg}$ e raggio $0{,}35\,\text{m}$, e quasi tutta la sua massa sta nel cerchione: la trattiamo come un anello. Quanto vale il suo momento angolare quando fa $3{,}0$ giri al secondo?

Il momento d'inerzia dell'anello:

$$I = m\,r^2 = 1{,}5\,\text{kg} \cdot (0{,}35\,\text{m})^2 = 0{,}183\ldots\,\text{kg}\cdot\text{m}^2$$

La velocità angolare: $\omega = 2\pi f = 2\pi \cdot 3{,}0\,\text{s}^{-1} = 18{,}8\ldots\,\text{rad/s}$. Quindi

$$L = I\,\omega = 0{,}184\,\text{kg}\cdot\text{m}^2 \cdot 18{,}8\,\text{rad/s} = 3{,}46\ldots\,\text{kg}\cdot\text{m}^2/\text{s} \approx 3{,}5\,\text{kg}\cdot\text{m}^2/\text{s}$$

Il radiante è un numero puro, quindi nell'unità del risultato non compare.
```

```ad-warning
Momento angolare ed energia di rotazione sono due cose diverse
$L = I\,\omega$ e $K_{rot} = \tfrac{1}{2} I\,\omega^2$ hanno gli stessi ingredienti ma non sono la stessa grandezza: la prima è un vettore e va con $\omega$, la seconda è uno scalare e va con $\omega^2$. Raddoppiando la velocità angolare il momento angolare raddoppia, l'[energia di rotazione](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/l-energia-cinetica-di-rotazione-e-il-rotolamento) diventa quattro volte più grande.
```

## Il momento delle forze fa cambiare il momento angolare

Per cambiare la quantità di moto di un corpo serve una forza: $\vec{F} = \Delta\vec{p}/\Delta t$. Per cambiare il suo momento angolare serve il momento di una forza. Lo si vede dalla [legge della dinamica delle rotazioni](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/momento-torcente-e-dinamica-delle-rotazioni), $M = I\,\alpha$: l'accelerazione angolare è $\alpha = \Delta\omega/\Delta t$, e se il momento d'inerzia non cambia

$$M = I\,\frac{\Delta\omega}{\Delta t} = \frac{\Delta(I\,\omega)}{\Delta t} = \frac{\Delta L}{\Delta t}$$

Il momento totale delle forze esterne è uguale alla variazione del momento angolare divisa per il tempo in cui avviene:

$$M = \frac{\Delta L}{\Delta t}$$

L'abbiamo ricavata per un corpo rigido con $I$ costante, ma la legge è più generale: vale per qualunque sistema, anche se cambia forma mentre ruota, e in forma vettoriale si scrive $\vec{M} = \Delta\vec{L}/\Delta t$, con $\vec{M}$ e $\vec{L}$ calcolati rispetto allo stesso polo (questa parte si enuncia senza dimostrazione). Se il momento varia nel tempo, $\Delta L/\Delta t$ dà il suo valore medio.

Riscritta come $\Delta L = M\,\Delta t$, la legge dice che un momento costante fa crescere il momento angolare in modo proporzionale al tempo: nel grafico di $L$ in funzione di $t$ è una retta, e la sua pendenza è il momento $M$.

```tikz
% nome: grafico-momento-angolare-tempo
% alt: Grafico del momento angolare L in funzione del tempo t per un volano che parte da fermo sotto un momento costante di 0,60 newton per metro. È una retta che parte dall'origine e passa per il punto di ascissa 4,0 secondi e ordinata 2,4 chilogrammi per metro quadrato al secondo; la pendenza della retta è il momento
% poi-interattivo: cambiare il momento e vedere la pendenza della retta
\begin{tikzpicture}[x=1cm, y=1cm]
\draw[gray!25, very thin] (0,0) grid (5,3.5);
\draw[->] (-0.3,0) -- (5.5,0) node[right] {$t$ (s)};
\draw[->] (0,-0.3) -- (0,4) node[above] {$L$ (kg$\cdot$m$^2$/s)};
\foreach \x in {1,2,3,4,5} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {1,2,3} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue] (0,0) -- (5,3);
\draw[dashed, thin] (4,0) -- (4,2.4) -- (0,2.4);
\fill (4,2.4) circle (1.5pt);
\node[left] at (0,2.4) {\small $2{,}4$};
\node at (2.6,0.7) {pendenza $= M$};
\end{tikzpicture}
```

```ad-example
Esempio 4: un motore avvia un volano
Un motore applica un momento costante di $0{,}60\,\text{N}\cdot\text{m}$ a un volano fermo, con momento d'inerzia $0{,}15\,\text{kg}\cdot\text{m}^2$. Quanto valgono il momento angolare e la velocità angolare del volano dopo $4{,}0\,\text{s}$?

Il volano parte da fermo, $L_i = 0$:

$$L = M\,\Delta t = 0{,}60\,\text{N}\cdot\text{m} \cdot 4{,}0\,\text{s} = 2{,}4\,\text{kg}\cdot\text{m}^2/\text{s}$$

(un $\text{N}\cdot\text{m}\cdot\text{s}$ è un $\text{kg}\cdot\text{m}^2/\text{s}$, perché $1\,\text{N} = 1\,\text{kg}\cdot\text{m/s}^2$). La velocità angolare:

$$\omega = \frac{L}{I} = \frac{2{,}4\,\text{kg}\cdot\text{m}^2/\text{s}}{0{,}15\,\text{kg}\cdot\text{m}^2} = 16\,\text{rad/s}$$

È il punto segnato sul grafico qui sopra.
```

```ad-example
Esempio 5: fermare la ruota con la mano
La ruota dell'esempio 3 gira con $L = 3{,}46\,\text{kg}\cdot\text{m}^2/\text{s}$. La fermi premendo la mano sul copertone, che è a $0{,}35\,\text{m}$ dall'asse, con una forza di attrito di $12\,\text{N}$ tangente alla ruota. Quanto tempo ci vuole?

La forza è perpendicolare al raggio, quindi il suo momento rispetto all'asse è

$$M = F\,r = 12\,\text{N} \cdot 0{,}35\,\text{m} = 4{,}2\,\text{N}\cdot\text{m}$$

ed è contrario alla rotazione: con il verso di rotazione positivo, $M = -4{,}2\,\text{N}\cdot\text{m}$. Il momento angolare deve passare da $3{,}46\,\text{kg}\cdot\text{m}^2/\text{s}$ a zero, $\Delta L = -3{,}46\,\text{kg}\cdot\text{m}^2/\text{s}$:

$$\Delta t = \frac{\Delta L}{M} = \frac{-3{,}46\,\text{kg}\cdot\text{m}^2/\text{s}}{-4{,}2\,\text{N}\cdot\text{m}} = 0{,}823\ldots\,\text{s} \approx 0{,}82\,\text{s}$$
```

```ad-warning
Il segno del momento
Un momento concorde con la rotazione fa crescere $L$, uno contrario lo fa diminuire. In una frenata $\Delta L$ è negativo e anche $M$ lo è: se ne dimentichi uno solo dei due, il tempo viene negativo.
```

## Traslazione e rotazione a confronto

Ogni grandezza del moto di un punto ha la sua corrispondente nelle rotazioni, e le leggi hanno la stessa forma:

| Traslazione | Rotazione |
|---|---|
| massa $m$ | momento d'inerzia $I$ |
| velocità $\vec{v}$ | velocità angolare $\omega$ |
| forza $\vec{F}$ | momento della forza $\vec{M}$ |
| quantità di moto $\vec{p} = m\,\vec{v}$ | momento angolare $L = I\,\omega$ |
| $\vec{F} = \dfrac{\Delta\vec{p}}{\Delta t}$ | $\vec{M} = \dfrac{\Delta\vec{L}}{\Delta t}$ |
| $K = \tfrac{1}{2} m v^2$ | $K_{rot} = \tfrac{1}{2} I\,\omega^2$ |

Alla tabella manca una riga, la più utile: se la forza totale è nulla, la quantità di moto [si conserva](/materiale/scuola-superiore/fisica/la-quantita-di-moto/la-conservazione-della-quantita-di-moto). La riga corrispondente per le rotazioni, con il momento totale nullo, è l'argomento della lezione sulla [conservazione del momento angolare](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/la-conservazione-del-momento-angolare).
