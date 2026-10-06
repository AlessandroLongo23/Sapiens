# L'energia potenziale gravitazionale e la velocità di fuga

Un sasso lanciato verso l'alto ricade. Una sonda come la Voyager, lanciata nel 1977, non tornerà mai: ha lasciato la Terra e poi il Sistema Solare. Tra i due casi non c'è una differenza di natura, solo di velocità, e per trovare la velocità che separa chi torna da chi non torna serve l'energia. Al biennio l'[energia potenziale gravitazionale](/materiale/scuola-superiore/fisica/lavoro-ed-energia/energia-potenziale-gravitazionale-ed-elastica) era $U = m g h$: una formula che dà per scontato che il peso $m g$ sia lo stesso a tutte le quote. Per una sonda che si allontana di migliaia di kilometri non lo è più, perché il [campo gravitazionale](/materiale/scuola-superiore/fisica/la-gravitazione/il-campo-gravitazionale) diminuisce con il quadrato della distanza. Serve una formula nuova, che contenga la vecchia come caso particolare.

## Il lavoro di una forza che cambia con la distanza

Un corpo di massa $m$ si allontana da un pianeta di massa $M$, dalla distanza $r_1$ alla distanza $r_2$ dal centro. La forza di gravità $F = G\,\dfrac{M\,m}{r^2}$ è rivolta verso il pianeta, contro lo spostamento: il suo lavoro è negativo. Ma quanto vale? La forza non è costante, e il prodotto "forza per spostamento" non si può usare.

Il [lavoro di una forza variabile](/materiale/scuola-superiore/fisica/il-lavoro-e-le-forze-conservative/il-lavoro-di-una-forza-variabile) è l'area sotto il grafico della forza in funzione della posizione. Qui il grafico è una curva che scende come $1/r^2$, e l'area non è un rettangolo né un triangolo.

```tikz
% nome: forza-gravitazionale-area-lavoro
% alt: Grafico della forza di gravità su un corpo in funzione della distanza r dal centro del pianeta: una curva che scende sempre più lentamente. L'area sotto la curva tra le distanze r con 1 e r con 2 è colorata: è il valore assoluto del lavoro della forza di gravità in quello spostamento
\begin{tikzpicture}
\fill[orange!25] (1.2,0) -- plot[domain=1.2:3.2, samples=40] (\x, {4.5/(\x*\x)}) -- (3.2,0) -- cycle;
\draw[->] (-0.2,0) -- (6,0) node[right] {$r$};
\draw[->] (0,-0.2) -- (0,3.8) node[above] {$F$};
\draw[thick, blue] plot[domain=1.2:5.6, samples=60] (\x, {4.5/(\x*\x)});
\draw[dashed, thin] (1.2,0) -- (1.2,3.125);
\draw[dashed, thin] (3.2,0) -- (3.2,0.439);
\node[below] at (1.2,0) {$r_1$};
\node[below] at (3.2,0) {$r_2$};
\node at (1.95,0.5) {$|W|$};
\end{tikzpicture}
```

Calcolare quest'area chiede strumenti di matematica del quinto anno. Il risultato è semplice, e lo prendiamo per buono: il lavoro della forza di gravità quando il corpo passa dalla distanza $r_1$ alla distanza $r_2$ è

$$W = G\,M\,m \left(\frac{1}{r_2} - \frac{1}{r_1}\right)$$

Se il corpo si allontana, $r_2 > r_1$, la parentesi è negativa e il lavoro è negativo, come ci aspettavamo; se si avvicina è positivo. Il lavoro dipende solo dalle due distanze, non dal cammino percorso tra l'una e l'altra: la forza di gravità è una [forza conservativa](/materiale/scuola-superiore/fisica/il-lavoro-e-le-forze-conservative/forze-conservative-ed-energia-potenziale), e le si può associare un'energia potenziale.

## L'energia potenziale gravitazionale

Per una forza conservativa il lavoro è l'opposto della variazione di energia potenziale, $W = -\Delta U = U_1 - U_2$. Confrontando con la formula del lavoro, $U_1 - U_2 = -\dfrac{G M m}{r_1} + \dfrac{G M m}{r_2}$: l'energia potenziale alla distanza $r$ deve essere $-G M m / r$, più una costante che si può scegliere. La scelta più comoda è prendere la costante uguale a zero.

L'**energia potenziale gravitazionale** di due corpi di masse $m_1$ e $m_2$, con i centri a distanza $r$, è

$$U = -G\,\frac{m_1\,m_2}{r}$$

Per un corpo di massa $m$ vicino a un pianeta di massa $M$ si scrive $U = -G M m / r$. La formula vale per corpi puntiformi o sferici, con $r$ misurata tra i centri, come la legge di gravitazione.

- Lo zero è all'infinito. Quando $r$ diventa grandissima la frazione tende a zero: due corpi lontanissimi, che non si attirano più in modo apprezzabile, hanno energia potenziale nulla. Con $U = m g h$ lo zero si sceglieva dove faceva comodo; qui lo zero è fissato una volta per tutte.
- L'energia potenziale è sempre negativa. Non è un errore di segno. Per allontanare i due corpi qualcuno deve compiere lavoro contro la gravità, e l'energia potenziale aumenta; se alla fine, all'infinito, vale zero, a ogni distanza finita deve valere meno di zero. Un corpo con energia potenziale negativa è un corpo "in una buca": gli manca energia per essere libero.
- Aumenta allontanandosi. Da $-10\,\text{J}$ a $-4\,\text{J}$ l'energia potenziale è cresciuta di $6\,\text{J}$: più lontano dal pianeta vuol dire energia potenziale più alta, cioè meno negativa, come nel biennio più in alto voleva dire $m g h$ più grande.

```tikz
% nome: grafico-energia-potenziale-gravitazionale
% alt: Grafico dell'energia potenziale gravitazionale di un corpo in funzione della distanza dal centro del pianeta, da R in poi: la curva sta tutta sotto l'asse orizzontale. Alla superficie, a distanza R, ha il valore più basso, U con zero, che è negativo; a distanza 2R vale la metà di U con zero, a 4R un quarto; allontanandosi sale verso lo zero senza raggiungerlo
\begin{tikzpicture}
\draw[gray!25, very thin] (0,-3.4) grid[xstep=1, ystep=0.8] (6.6,0.4);
\draw[->] (-0.2,0) -- (7,0) node[right] {$r$};
\draw[->] (0,-3.6) -- (0,0.9) node[above] {$U$};
\draw[dashed, thin] (1,0) -- (1,-3.2);
\draw[thick, blue] plot[domain=1:6.6, samples=60] (\x, {-3.2/\x});
\node[above] at (1,0) {\small $R$};
\node[above] at (2,0) {\small $2R$};
\node[above] at (4,0) {\small $4R$};
\node[above] at (6,0) {\small $6R$};
\fill (1,-3.2) circle (1.5pt) node[right] {\small $U_0$};
\fill (2,-1.6) circle (1.5pt) node[below right] {\small $\frac{1}{2} U_0$};
\fill (4,-0.8) circle (1.5pt) node[below right] {\small $\frac{1}{4} U_0$};
\node[left] at (0,0) {\small $0$};
\end{tikzpicture}
```

```ad-example
Esempio 1: l'energia potenziale di un satellite
Un satellite di $1{,}20 \cdot 10^3\,\text{kg}$ orbita a $400\,\text{km}$ di quota, cioè a $r = 6{,}77 \cdot 10^6\,\text{m}$ dal centro della Terra. Quanto vale la sua energia potenziale gravitazionale? E quanto valeva sulla rampa di lancio?

Conviene calcolare una volta il prodotto $G M_T = 6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2 \cdot 5{,}97 \cdot 10^{24}\,\text{kg} = 3{,}98 \cdot 10^{14}\,\text{N} \cdot \text{m}^2/\text{kg}$. In orbita:

$$U = -\frac{G\,M_T\,m}{r} = -\frac{3{,}98 \cdot 10^{14}\,\text{N} \cdot \text{m}^2/\text{kg} \cdot 1{,}20 \cdot 10^3\,\text{kg}}{6{,}77 \cdot 10^6\,\text{m}} = -7{,}06 \cdot 10^{10}\,\text{J}$$

Sulla rampa la distanza dal centro è il raggio terrestre, $R_T = 6{,}37 \cdot 10^6\,\text{m}$:

$$U_0 = -\frac{3{,}98 \cdot 10^{14}\,\text{N} \cdot \text{m}^2/\text{kg} \cdot 1{,}20 \cdot 10^3\,\text{kg}}{6{,}37 \cdot 10^6\,\text{m}} = -7{,}50 \cdot 10^{10}\,\text{J}$$

In orbita l'energia potenziale è più alta (meno negativa) che al suolo.
```

```ad-warning
Il segno meno e l'esponente
Due errori frequenti. Il primo è dimenticare il segno: $U$ è negativa, e scrivere $+7{,}06 \cdot 10^{10}\,\text{J}$ rovescia tutti i bilanci di energia. Il secondo è copiare il denominatore dalla legge della forza: nella forza c'è $r^2$, nell'energia potenziale c'è $r$. Le unità lo confermano: $\text{N} \cdot \text{m}^2/\text{kg}^2 \cdot \text{kg}^2/\text{m} = \text{N} \cdot \text{m} = \text{J}$.
```

### Quanto costa salire

Quello che conta nei problemi è la variazione di energia potenziale. Per portare un corpo dalla distanza $r_1$ alla distanza $r_2$ si deve compiere contro la gravità un lavoro uguale a

$$\Delta U = U_2 - U_1 = G\,M\,m \left(\frac{1}{r_1} - \frac{1}{r_2}\right)$$

positivo se $r_2 > r_1$.

```ad-example
Esempio 2: dal suolo alla quota dell'orbita
Di quanto aumenta l'energia potenziale del satellite dell'esempio 1 tra la rampa e la quota di $400\,\text{km}$? Che cosa darebbe la formula $m g h$?

Dai due valori già trovati:

$$\Delta U = U - U_0 = -7{,}06 \cdot 10^{10}\,\text{J} - (-7{,}50 \cdot 10^{10}\,\text{J}) = 0{,}44 \cdot 10^{10}\,\text{J} = 4{,}4 \cdot 10^9\,\text{J}$$

La differenza tra due numeri vicini fa perdere una cifra significativa. La formula con le due distanze, senza arrotondamenti intermedi, dà $4{,}43 \cdot 10^9\,\text{J}$.

Con la formula del biennio:

$$m\,g\,h = 1{,}20 \cdot 10^3\,\text{kg} \cdot 9{,}81\,\text{N/kg} \cdot 4{,}00 \cdot 10^5\,\text{m} = 4{,}71 \cdot 10^9\,\text{J}$$

È il $6\%$ in più del valore giusto: $m g h$ tratta il peso come costante, mentre salendo diminuisce, fino all'$89\%$ a $400\,\text{km}$.
```

### Da dove viene $m g h$

La formula del biennio non era sbagliata: è quello che la formula nuova diventa vicino al suolo. Per un corpo che sale dalla superficie di un pianeta di raggio $R$ fino alla quota $h$, le due distanze sono $r_1 = R$ e $r_2 = R + h$:

$$\Delta U = G\,M\,m \left(\frac{1}{R} - \frac{1}{R + h}\right) = G\,M\,m\,\frac{h}{R\,(R + h)}$$

Se la quota è molto più piccola del raggio, $R + h$ è praticamente $R$ e il denominatore diventa $R^2$:

$$\Delta U \approx m\,\frac{G\,M}{R^2}\,h = m\,g\,h$$

perché $G M / R^2$ è il campo $g$ alla superficie. Per un dislivello di $1\,\text{km}$ sulla Terra le due formule differiscono dello $0{,}02\%$; per $100\,\text{km}$ dell'$1{,}6\%$; per $1000\,\text{km}$ del $16\%$. Finché il moto resta entro qualche kilometro dal suolo si usa $m g h$, con lo zero dove fa comodo; quando le quote sono paragonabili al raggio del pianeta serve $-G M m / r$.

## La conservazione dell'energia

Su un corpo che si muove nello spazio vicino a un pianeta, lontano dall'atmosfera e con i motori spenti, lavora solo la gravità. L'[energia meccanica si conserva](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-conservazione-dell-energia-meccanica), come per il carrello delle montagne russe, con la nuova espressione dell'energia potenziale:

$$E = \frac{1}{2}\,m\,v^2 - G\,\frac{M\,m}{r} = \text{costante}$$

Tra due posizioni del moto:

$$\frac{1}{2}\,m\,v_1^2 - G\,\frac{M\,m}{r_1} = \frac{1}{2}\,m\,v_2^2 - G\,\frac{M\,m}{r_2}$$

La massa $m$ del corpo compare in tutti i termini e si semplifica: come nella caduta libera, velocità e distanze non dipendono dalla massa di chi si muove.

```ad-example
Esempio 3: fin dove arriva un proiettile lanciato in verticale
Dalla superficie della Terra un proiettile viene lanciato verso l'alto a $9{,}00 \cdot 10^3\,\text{m/s}$. Trascurando l'aria, a che distanza dal centro della Terra si ferma? A che quota?

```tikz
% nome: lancio-verticale-distanza-massima
% alt: La Terra, di raggio R con T, e un proiettile lanciato in verticale dalla superficie con velocità v con zero; il proiettile sale fino al punto in cui si ferma, a distanza r max dal centro della Terra e a quota h max sopra il suolo
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) circle (1);
\fill (0,0) circle (1.5pt);
\draw[dashed, thin] (0,0) -- (3.6,0);
\fill (1,0) circle (1.5pt);
\draw[-{Stealth}, thick, blue!60!black] (1,0) -- (2,0) node[above] {$\vec v_0$};
\draw[thick, fill=blue!10] (2.84,0) circle (2pt);
\node[above] at (3.1,0.05) {$v = 0$};
\draw[{Stealth}-{Stealth}, thin] (0,0.3) -- (1,0.3) node[midway, above] {$R_T$};
\draw[{Stealth}-{Stealth}, thin] (1,-0.4) -- (2.84,-0.4) node[midway, below] {$h_{max}$};
\draw[{Stealth}-{Stealth}, thin] (0,-1.4) -- (2.84,-1.4) node[midway, below] {$r_{max}$};
\draw[dashed, thin] (2.84,0) -- (2.84,-1.4);
\draw[dashed, thin] (0,0) -- (0,-1.4);
\end{tikzpicture}
```

Alla partenza $r_1 = R_T$ e $v_1 = v_0$; nel punto più alto $v_2 = 0$ e $r_2 = r_{max}$. Dopo aver semplificato $m$:

$$\frac{1}{2}\,v_0^2 - \frac{G\,M_T}{R_T} = -\frac{G\,M_T}{r_{max}}$$

I due termini noti sono energie per kilogrammo ($\text{m}^2/\text{s}^2 = \text{J/kg}$), e valgono

$$\frac{1}{2}\,v_0^2 = \frac{1}{2} \cdot (9{,}00 \cdot 10^3\,\text{m/s})^2 = 4{,}05 \cdot 10^7\,\text{J/kg} \qquad \frac{G\,M_T}{R_T} = \frac{3{,}98 \cdot 10^{14}}{6{,}37 \cdot 10^6}\,\text{J/kg} = 6{,}25 \cdot 10^7\,\text{J/kg}$$

quindi il primo membro è $4{,}05 \cdot 10^7 - 6{,}25 \cdot 10^7 = -2{,}20 \cdot 10^7\,\text{J/kg}$, e

$$r_{max} = \frac{G\,M_T}{2{,}20 \cdot 10^7\,\text{J/kg}} = \frac{3{,}98 \cdot 10^{14}}{2{,}20 \cdot 10^7}\,\text{m} = 1{,}81 \cdot 10^7\,\text{m}$$

La quota massima è $h_{max} = r_{max} - R_T = 18{,}1 \cdot 10^6\,\text{m} - 6{,}37 \cdot 10^6\,\text{m} = 1{,}17 \cdot 10^7\,\text{m}$: il proiettile sale di quasi due raggi terrestri, poi ricade. Con la formula del biennio, $h = v_0^2 / (2 g)$, si troverebbero $4{,}1 \cdot 10^6\,\text{m}$, poco più di un terzo: lontano dalla Terra la gravità frena di meno, e il proiettile va più in alto.
```

```ad-warning
Niente mgh quando la quota è grande
Se nel problema compaiono quote di centinaia o migliaia di kilometri, raggi di pianeti o velocità di kilometri al secondo, l'energia potenziale è $-G M m / r$ con $r$ dal centro. Usare $m g h$ con $g = 9{,}8\,\text{N/kg}$ dà risultati sbagliati anche di due o tre volte, come nell'esempio 3.
```

## L'energia di un satellite in orbita

Per un satellite di massa $m$ su un'orbita circolare di raggio $r$ la [velocità orbitale](/materiale/scuola-superiore/fisica/la-gravitazione/il-moto-dei-satelliti) è fissata dal raggio: $v^2 = G M / r$. La sua energia cinetica è quindi

$$K = \frac{1}{2}\,m\,v^2 = \frac{G\,M\,m}{2\,r}$$

che è esattamente la metà del valore assoluto dell'energia potenziale, $U = -G M m / r$. Sommando:

$$E = K + U = \frac{G\,M\,m}{2\,r} - \frac{G\,M\,m}{r} = -\frac{G\,M\,m}{2\,r}$$

L'**energia totale** di un satellite in orbita circolare è negativa, ed è la metà della sua energia potenziale. In un'orbita circolare valgono sempre le relazioni $K = -\tfrac{1}{2} U$ ed $E = \tfrac{1}{2} U = -K$.

```tikz
% nome: energie-satellite-orbita-barre
% alt: Tre barre orizzontali su un asse dell'energia con lo zero al centro, per un satellite in orbita circolare: l'energia potenziale U è una barra lunga verso sinistra, negativa; l'energia cinetica K è una barra verso destra lunga la metà; l'energia totale E è una barra verso sinistra lunga anch'essa la metà di quella di U
\begin{tikzpicture}
\draw[->] (-4.4,0) -- (2.9,0) node[right] {energia};
\draw[thin] (0,-0.1) -- (0,2.6);
\node[below] at (0,-0.1) {$0$};
\draw[thick, fill=orange!25] (-4,1.8) rectangle (0,2.3);
\node at (-2,2.05) {\small $U = -\frac{G M m}{r}$};
\draw[thick, fill=blue!10] (0,1.0) rectangle (2,1.5);
\node at (1,1.25) {\small $K = \frac{G M m}{2r}$};
\draw[thick, fill=green!15] (-2,0.2) rectangle (0,0.7);
\node at (-1,0.45) {\small $E = -\frac{G M m}{2r}$};
\draw[dashed, thin] (-2,0) -- (-2,1.8);
\draw[dashed, thin] (-4,0) -- (-4,1.8);
\end{tikzpicture}
```

Su un'orbita più larga l'energia totale è più alta (meno negativa), anche se il satellite va più piano: quello che perde in energia cinetica è la metà di quello che guadagna in energia potenziale. Per questo servono i motori per salire di orbita.

```ad-example
Esempio 4: l'energia per mettere in orbita un satellite
Il satellite degli esempi 1 e 2 ($m = 1{,}20 \cdot 10^3\,\text{kg}$) parte fermo dalla rampa e finisce in orbita circolare a $r = 6{,}77 \cdot 10^6\,\text{m}$. Quanta energia gli si deve dare in tutto? (Si trascurano l'aria e la rotazione della Terra.)

In orbita l'energia totale è la metà dell'energia potenziale trovata nell'esempio 1:

$$E = -\frac{G\,M_T\,m}{2\,r} = \frac{1}{2}\,U = \frac{-7{,}06 \cdot 10^{10}\,\text{J}}{2} = -3{,}53 \cdot 10^{10}\,\text{J}$$

Sulla rampa il satellite è fermo, e la sua energia è tutta potenziale: $E_0 = U_0 = -7{,}50 \cdot 10^{10}\,\text{J}$. L'energia da fornire è la differenza:

$$E - E_0 = -3{,}53 \cdot 10^{10}\,\text{J} - (-7{,}50 \cdot 10^{10}\,\text{J}) = 3{,}97 \cdot 10^{10}\,\text{J}$$

Di questi, solo $0{,}44 \cdot 10^{10}\,\text{J}$ servono a salire di quota (esempio 2). Gli altri $3{,}53 \cdot 10^{10}\,\text{J}$ sono l'energia cinetica dell'orbita: mettere in orbita un satellite basso vuol dire soprattutto dargli velocità, non altezza.
```

## La velocità di fuga

Torniamo al proiettile lanciato dalla superficie. Più è veloce, più lontano arriva prima di fermarsi. C'è una velocità di lancio per cui il punto di arresto si sposta all'infinito: il proiettile continua ad allontanarsi, sempre più piano, senza mai tornare indietro.

La **velocità di fuga** $v_f$ è la velocità minima con cui un corpo deve partire dalla superficie di un pianeta per allontanarsene indefinitamente, senza altre spinte. Si trova con la conservazione dell'energia. All'infinito l'energia potenziale è zero, e con la velocità minima il corpo ci arriva fermo: l'energia totale finale è zero. Allora deve essere zero anche alla partenza, dove $r = R$:

$$\frac{1}{2}\,m\,v_f^2 - G\,\frac{M\,m}{R} = 0 \quad\Rightarrow\quad v_f = \sqrt{\frac{2\,G\,M}{R}}$$

- Non dipende dalla massa del corpo: è la stessa per una molecola e per un'astronave.
- Non dipende dalla direzione di lancio, purché la traiettoria non incontri il pianeta: l'energia è uno scalare.
- È $\sqrt{2}$ volte la velocità orbitale di un satellite che sfiora la superficie, $\sqrt{G M / R}$: chi è in orbita bassa ha già il $71\%$ della velocità che serve per andarsene, cioè metà dell'energia cinetica.
- Partendo da una distanza $r$ dal centro più grande del raggio, al posto di $R$ si mette $r$: da più lontano fuggire è più facile.

```ad-example
Esempio 5: la velocità di fuga dalla Terra e dalla Luna
Calcola la velocità di fuga dalla superficie della Terra e da quella della Luna ($M_L = 7{,}35 \cdot 10^{22}\,\text{kg}$, $R_L = 1{,}74 \cdot 10^6\,\text{m}$).

Per la Terra:

$$v_f = \sqrt{\frac{2\,G\,M_T}{R_T}} = \sqrt{\frac{2 \cdot 3{,}98 \cdot 10^{14}\,\text{m}^3/\text{s}^2}{6{,}37 \cdot 10^6\,\text{m}}} = \sqrt{1{,}25 \cdot 10^8\,\text{m}^2/\text{s}^2} = 1{,}12 \cdot 10^4\,\text{m/s}$$

cioè $11{,}2\,\text{km/s}$, circa $40\,000\,\text{km/h}$. Per la Luna:

$$v_f = \sqrt{\frac{2 \cdot 6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2 \cdot 7{,}35 \cdot 10^{22}\,\text{kg}}{1{,}74 \cdot 10^6\,\text{m}}} = \sqrt{5{,}64 \cdot 10^6\,\text{m}^2/\text{s}^2} = 2{,}37 \cdot 10^3\,\text{m/s}$$

Dalla Luna si fugge con $2{,}37\,\text{km/s}$, quasi cinque volte meno: per ripartire dalla Luna agli astronauti delle missioni Apollo servì solo un piccolo modulo, mentre per lasciare la Terra era servito un razzo alto più di $100\,\text{m}$.
```

```ad-note
Che cosa non dice la velocità di fuga
La velocità di fuga vale per un corpo lanciato e poi lasciato a sé stesso, come un proiettile, e senza aria. Un razzo non deve raggiungere $11{,}2\,\text{km/s}$ al suolo: i motori continuano a spingerlo mentre sale, e potrebbe allontanarsi anche a velocità bassa, purché la spinta duri abbastanza. Il valore resta la misura di quanta energia serve: $\tfrac{1}{2} v_f^2 = 6{,}25 \cdot 10^7\,\text{J}$ per ogni kilogrammo portato fuori dalla portata della Terra.
```

La velocità di fuga spiega anche perché la Luna non ha atmosfera e la Terra sì. Le molecole di un gas si muovono tanto più in fretta quanto più alta è la temperatura ([Temperatura ed energia cinetica delle molecole](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/temperatura-ed-energia-cinetica-delle-molecole)), e alcune sono molto più veloci della media. Sulla Luna, in tempi lunghi, quelle che superano i $2{,}37\,\text{km/s}$ sono abbastanza da disperdere tutto il gas; sulla Terra quasi nessuna molecola di azoto o di ossigeno arriva a $11{,}2\,\text{km/s}$.

### Legato o libero: il segno dell'energia totale

L'energia totale $E = \tfrac{1}{2} m v^2 - G M m / r$ dice subito che cosa farà un corpo, senza seguirne il moto.

| Energia totale | Che cosa succede | Traiettoria |
|---|---|---|
| $E < 0$ | il corpo è legato al pianeta: non può superare la distanza a cui $U = E$ | circonferenza o ellisse (oppure ricade) |
| $E = 0$ | il corpo ha esattamente la velocità di fuga: si allontana e arriva all'infinito fermo | parabola |
| $E > 0$ | il corpo si allontana e all'infinito ha ancora velocità | iperbole |

Le tre curve sono le coniche che studi in matematica ([ellisse](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/ellisse), [parabola](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/la-parabola-nel-piano-cartesiano), [iperbole](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/iperbole)); che le orbite siano proprio coniche qui lo enunciamo soltanto. I pianeti, le lune e i satelliti hanno energia totale negativa; una sonda che lascia il Sistema Solare ha energia totale positiva rispetto al Sole.

```tikz
% nome: energia-totale-legato-libero
% alt: Il grafico dell'energia potenziale gravitazionale in funzione della distanza, sotto l'asse orizzontale, con tre rette orizzontali che rappresentano tre valori dell'energia totale. La retta più bassa, E minore di zero, incontra la curva in un punto: è la distanza massima che il corpo può raggiungere. La retta E uguale a zero coincide con l'asse. La retta più alta, E maggiore di zero, sta sopra l'asse e non incontra mai la curva
\begin{tikzpicture}
\draw[->] (-0.2,0) -- (7,0) node[right] {$r$};
\draw[->] (0,-3.6) -- (0,1.3) node[above] {energia};
\draw[dashed, thin] (1,0) -- (1,-3.2);
\node[above left] at (1,0) {\small $R$};
\draw[thick, blue] plot[domain=1:6.6, samples=60] (\x, {-3.2/\x});
\node[blue] at (1.75,-2.6) {$U$};
\draw[thick, red] (1,-1.28) -- (2.5,-1.28);
\fill[red] (2.5,-1.28) circle (1.5pt);
\draw[dashed, thin] (2.5,0) -- (2.5,-1.28);
\node[above] at (2.5,0) {\small $r_{max}$};
\node[red, right] at (2.6,-1.28) {\small $E < 0$};
\draw[thick, orange!90!black] (1,0.03) -- (6.6,0.03);
\node[orange!90!black, above] at (5.4,0.03) {\small $E = 0$};
\draw[thick, green!50!black] (1,0.8) -- (6.6,0.8);
\node[green!50!black, above] at (5.4,0.8) {\small $E > 0$};
\draw[{Stealth}-{Stealth}, thin] (1.5,-2.133) -- (1.5,-1.28);
\node[right] at (1.55,-1.7) {\small $K$};
\end{tikzpicture}
```

Nel grafico la distanza tra la retta dell'energia totale e la curva di $U$ è l'energia cinetica, che non può essere negativa: il corpo può stare solo dove la retta è sopra la curva. Nella figura qui sotto scegli la velocità con cui un proiettile parte in verticale dalla superficie della Terra, e leggi la sua energia totale e la distanza massima che raggiunge. Cerca la velocità con cui arriva a una quota uguale al raggio terrestre, e guarda che cosa succede vicino a $11{,}2\,\text{km/s}$.

```interattivo
% nome: lancio-verticale-energia-fuga
% alt: In alto il grafico dell'energia potenziale per kilogrammo di un proiettile in funzione della distanza dal centro della Terra, con la retta orizzontale dell'energia totale che sale quando si aumenta la velocità di lancio con un cursore, da 2 a 12 kilometri al secondo; il punto in cui la retta incontra la curva è la distanza massima. In basso la Terra e il proiettile, che un bottone fa salire fino alla distanza massima e ricadere. Sotto sono scritte la velocità di lancio, l'energia totale per kilogrammo, la distanza massima in raggi terrestri e la quota massima
```

A $7{,}9\,\text{km/s}$ il proiettile arriva a due raggi terrestri dal centro, cioè a una quota uguale al raggio della Terra: è la velocità orbitale al suolo, e non per caso, perché con quella velocità l'energia cinetica è metà di quella di fuga. Avvicinandosi a $11{,}2\,\text{km/s}$ la retta dell'energia sale verso lo zero e la distanza massima cresce senza limite: a $11\,\text{km/s}$ è già di $31$ raggi terrestri. Da $11{,}2\,\text{km/s}$ in su la retta non incontra più la curva, e il proiettile non torna.

```ad-note
I buchi neri
La velocità di fuga cresce se la stessa massa è concentrata in un raggio più piccolo. Già nel Settecento John Michell e Pierre-Simon Laplace si chiesero quanto dovrebbe essere compatto un corpo perché la velocità di fuga dalla sua superficie arrivi a quella della luce, $c = 3{,}00 \cdot 10^8\,\text{m/s}$. Ponendo $v_f = c$ nella formula si trova il raggio

$$R = \frac{2\,G\,M}{c^2}$$

Per il Sole viene $2{,}95\,\text{km}$ (il suo raggio vero è $696\,000\,\text{km}$); per la Terra meno di $9\,\text{mm}$. Un corpo compresso entro questo raggio è un **buco nero**: nemmeno la luce può uscirne. Il conto fatto con la meccanica di Newton non è corretto, perché vicino a masse così concentrate serve la relatività generale di Einstein; il raggio che si ottiene, detto raggio di Schwarzschild, è però lo stesso. I buchi neri esistono: nascono dal collasso delle stelle più grandi, e al centro della nostra galassia ce n'è uno con una massa di circa quattro milioni di Soli.
```
