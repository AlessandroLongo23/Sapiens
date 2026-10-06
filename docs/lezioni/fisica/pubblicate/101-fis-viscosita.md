# L'attrito viscoso e la velocità limite

Il miele scende dal cucchiaio con una lentezza che l'acqua non ha; una goccia di nebbia resta sospesa per ore, mentre un sasso della stessa altezza arriva a terra in un secondo; un paracadutista, dopo i primi secondi di caduta, smette di accelerare. Nessuno di questi fatti si spiega con il fluido ideale delle lezioni precedenti, che scorre senza attrito. I fluidi veri hanno un attrito interno, la viscosità, che frena sia il fluido quando scorre sia i corpi che ci si muovono dentro.

## La viscosità

Quando un fluido scorre, i suoi strati non vanno tutti alla stessa velocità. Lo strato a contatto con una parete resta attaccato alla parete, quello subito sopra scivola un po', quello dopo un po' di più. Tra uno strato e l'altro c'è una forza di attrito, dovuta alle forze tra le molecole: lo strato più veloce trascina quello più lento, e quello più lento frena quello più veloce. Questo attrito interno si chiama **attrito viscoso**.

Per misurarlo si pensa a uno strato di fluido spesso $L$ chiuso tra due lastre piane di area $S$: quella di sotto è ferma, quella di sopra viene tirata a velocità costante $v$.

```tikz
% nome: lastre-strato-fluido-viscosita
% alt: Uno strato di fluido spesso L tra due lastre orizzontali: quella di sotto è ferma, quella di sopra si muove verso destra con velocità v, tirata da una forza F rappresentata da una freccia rossa. Dentro il fluido, frecce blu orizzontali mostrano la velocità degli strati: zero a contatto con la lastra ferma, via via più lunghe salendo, fino a v a contatto con la lastra in moto
% svg: lastre-strato-fluido-viscosita-1b1c0973.svg 262x130
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (5,2);
\draw[thick, fill=gray!20] (0,-0.2) rectangle (5,0);
\draw[thick, fill=gray!20] (0.6,2) rectangle (5.6,2.2);
\draw[thin] (1,0) -- (1,2);
\foreach \y/\l in {0.4/0.4, 0.8/0.8, 1.2/1.2, 1.6/1.6, 2/2}
  \draw[-{Stealth}, thick, blue!60!black] (1,\y) -- ({1+\l},\y);
\draw[thin, dashed] (1,0) -- (3,2);
\node[above] at (2.3,2.2) {$\vec{v}$};
\draw[-{Stealth}, thick, red] (5.6,2.1) -- (6.8,2.1) node[above, pos=0.6] {$\vec{F}$};
\draw[{Stealth}-{Stealth}, thin] (4.3,0) -- (4.3,2);
\node[right] at (4.3,1) {$L$};
\node[below] at (2.5,-0.2) {\small lastra ferma};
\end{tikzpicture}
```

Il fluido a contatto con ogni lastra si muove con la lastra, e in mezzo la velocità cresce in modo regolare da $0$ a $v$. Per mantenere la lastra in moto a velocità costante serve una forza $F$ che vinca l'attrito del fluido, e le misure dicono che questa forza è direttamente proporzionale all'area $S$ e alla velocità $v$, e inversamente proporzionale allo spessore $L$:

$$F = \eta\,\frac{S \cdot v}{L}$$

La costante $\eta$ (la lettera greca eta) dipende dal fluido e dalla sua temperatura, e si chiama **coefficiente di viscosità**, o più in breve **viscosità**. Ricavandola dalla formula, $\eta = F \cdot L / (S \cdot v)$, si trova la sua unità di misura:

$$[\eta] = \frac{\text{N} \cdot \text{m}}{\text{m}^2 \cdot \text{m/s}} = \frac{\text{N}}{\text{m}^2} \cdot \text{s} = \text{Pa} \cdot \text{s}$$

| Fluido | Viscosità $\eta$ ($\text{Pa} \cdot \text{s}$) |
|---|---|
| aria ($20\,^\circ\text{C}$) | $1{,}8 \cdot 10^{-5}$ |
| acqua ($20\,^\circ\text{C}$) | $1{,}0 \cdot 10^{-3}$ |
| sangue ($37\,^\circ\text{C}$) | $4 \cdot 10^{-3}$ |
| olio d'oliva ($20\,^\circ\text{C}$) | $8{,}4 \cdot 10^{-2}$ |
| glicerina ($20\,^\circ\text{C}$) | $1{,}5$ |
| miele ($20\,^\circ\text{C}$) | circa $10$ |

Tra l'aria e il miele ci sono quasi sei ordini di grandezza. La viscosità dei liquidi diminuisce molto quando la temperatura sale (il miele scaldato cola, l'olio del motore a freddo è denso), quella dei gas invece aumenta un poco.

```ad-warning
Viscoso non vuol dire denso
Nel parlare comune "denso" si usa per tutti e due, ma densità e viscosità sono grandezze diverse. L'olio d'oliva è meno denso dell'acqua ($920$ contro $1000\,\text{kg/m}^3$: infatti galleggia) ed è più di ottanta volte più viscoso. Il mercurio è tredici volte più denso dell'acqua e poco più viscoso.
```

## Moto laminare e moto turbolento

Finché un fluido scorre piano, i suoi strati scivolano l'uno sull'altro senza mescolarsi, e le linee di flusso sono regolari: è il **moto laminare**. In un tubo, il fluido a contatto con la parete è fermo e la velocità cresce verso il centro, dove è massima. La velocità $v$ che entra nella [portata](/materiale/scuola-superiore/fisica/la-meccanica-dei-fluidi/la-portata-e-l-equazione-di-continuita) $q = S \cdot v$ è la media di queste velocità sulla sezione.

Quando la velocità supera un certo valore il moto cambia carattere: gli strati si rompono, si formano vortici che nascono e spariscono senza regola, e in ogni punto la velocità cambia continuamente. È il **moto turbolento**. Il fumo che sale da un bastoncino d'incenso mostra tutti e due: per i primi centimetri è un filo liscio, poi di colpo si allarga in volute.

```tikz
% nome: tubo-laminare-turbolento
% alt: Due tratti di tubo visti in sezione. Nel primo, moto laminare: frecce blu parallele all'asse, corte vicino alle pareti e lunghe al centro, con le punte che disegnano un arco. Nel secondo, moto turbolento: linee di flusso che si attorcigliano in vortici disordinati
% svg: tubo-laminare-turbolento-60385955.svg 307x100
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (3.4,2);
\draw[thick] (0,0) -- (3.4,0);
\draw[thick] (0,2) -- (3.4,2);
\draw[thin] (0.6,0) -- (0.6,2);
\foreach \y/\l in {0.25/0.7, 0.5/1.2, 0.75/1.5, 1/1.6, 1.25/1.5, 1.5/1.2, 1.75/0.7}
  \draw[-{Stealth}, thick, blue!60!black] (0.6,\y) -- ({0.6+\l},\y);
\node[below] at (1.7,-0.1) {\small laminare};
\fill[cyan!20] (4.6,0) rectangle (8,2);
\draw[thick] (4.6,0) -- (8,0);
\draw[thick] (4.6,2) -- (8,2);
\draw[blue!60!black] (4.6,1.6) .. controls (5.2,1.9) and (5.4,1.0) .. (5.9,1.5) .. controls (6.3,1.9) and (6.1,1.1) .. (5.8,1.25) .. controls (5.6,1.4) and (6.6,1.9) .. (7.1,1.4) .. controls (7.4,1.1) and (7.6,1.8) .. (8,1.6);
\draw[blue!60!black] (4.6,1.0) .. controls (5.0,0.6) and (5.3,1.3) .. (5.5,0.9) .. controls (5.7,0.5) and (5.1,0.5) .. (5.3,0.8) .. controls (5.6,1.2) and (6.3,0.4) .. (6.8,0.9) .. controls (7.2,1.3) and (7.5,0.7) .. (8,1.0);
\draw[blue!60!black] (4.6,0.4) .. controls (5.3,0.1) and (5.9,0.7) .. (6.4,0.35) .. controls (6.8,0.1) and (7.0,0.7) .. (6.7,0.6) .. controls (6.4,0.5) and (7.3,0.1) .. (8,0.45);
\node[below] at (6.3,-0.1) {\small turbolento};
\end{tikzpicture}
```

Il passaggio dall'uno all'altro dipende da quattro cose: la velocità e la densità del fluido e le dimensioni del condotto, che favoriscono la turbolenza, e la viscosità, che la ostacola. L'acqua di un rubinetto appena aperto scende in un filo trasparente e liscio; aprendolo di più il getto diventa bianco e irregolare. Il miele, molto più viscoso, cola in modo laminare a qualsiasi velocità si riesca a versarlo.

```ad-note
Nei tubi veri la pressione cala lungo il percorso
Per l'[equazione di Bernoulli](/materiale/scuola-superiore/fisica/la-meccanica-dei-fluidi/l-equazione-di-bernoulli) un fluido ideale scorre in un tubo orizzontale di sezione costante senza che la pressione cambi. Un fluido viscoso no: per vincere l'attrito serve una differenza di pressione tra l'inizio e la fine del tubo, tanto più grande quanto più il tubo è lungo e stretto. È per questo che gli acquedotti hanno le pompe e che il cuore deve spingere il sangue.
```

## La legge di Stokes

Un corpo che si muove dentro un fluido trascina con sé lo strato di fluido che lo tocca, e questo strato scorre su quelli vicini: il risultato è una forza di attrito viscoso sul corpo, opposta alla sua velocità. Per una sfera di raggio $r$ che si muove a velocità $v$ in un fluido di viscosità $\eta$, se il moto del fluido attorno alla sfera è laminare, il modulo di questa forza è dato dalla **legge di Stokes** (dal fisico irlandese George Stokes, 1851):

$$F_v = 6\pi\,\eta\,r\,v$$

La dimostrazione chiede strumenti matematici dell'università; qui la si usa. La forza è direttamente proporzionale alla viscosità, al raggio e alla velocità: una sfera ferma non sente attrito viscoso, una che va al doppio della velocità ne sente il doppio. In questo l'attrito viscoso è diverso dall'[attrito radente](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito) tra due superfici solide, che non dipende dalla velocità.

```ad-example
Esempio 1: la forza su una sferetta
Una sferetta d'acciaio di raggio $1{,}0\,\text{mm}$ scende nella glicerina ($\eta = 1{,}5\,\text{Pa} \cdot \text{s}$) alla velocità di $2{,}0\,\text{cm/s}$. Quanto vale la forza di attrito viscoso?

Raggio e velocità vanno in unità del Sistema Internazionale: $r = 1{,}0 \cdot 10^{-3}\,\text{m}$, $v = 2{,}0 \cdot 10^{-2}\,\text{m/s}$.

$$F_v = 6\pi\,\eta\,r\,v = 6\pi \cdot 1{,}5\,\text{Pa} \cdot \text{s} \cdot 1{,}0 \cdot 10^{-3}\,\text{m} \cdot 2{,}0 \cdot 10^{-2}\,\frac{\text{m}}{\text{s}} = 5{,}7 \cdot 10^{-4}\,\text{N}$$

Le unità tornano: $\text{Pa} \cdot \text{s} \cdot \text{m} \cdot \text{m/s} = \text{Pa} \cdot \text{m}^2 = \text{N}$.
```

```ad-warning
La legge di Stokes vale per sfere piccole e lente
Vale finché il fluido scorre attorno alla sfera in modo laminare: goccioline di nebbia, polveri, granelli che si depositano in un liquido, bollicine, sferette in un liquido viscoso. Per un pallone, un'automobile o un paracadutista l'aria dietro il corpo è turbolenta, e la resistenza è molto più grande di quella della formula e cresce all'incirca con il quadrato della velocità.
```

## La velocità limite

Una sferetta lasciata cadere da ferma in un fluido all'inizio accelera, perché l'unica forza che conta è il suo peso. Ma più va veloce, più cresce la forza di attrito viscoso, che è diretta verso l'alto: la forza totale diminuisce, e con essa l'accelerazione. Quando l'attrito viscoso arriva a equilibrare il peso, la forza totale è zero e, per il [primo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali), la sferetta prosegue a velocità costante. Questa velocità si chiama **velocità limite**, $v_l$.

```tikz
% nome: grafico-velocita-tempo-velocita-limite
% alt: Grafico della velocità in funzione del tempo per una sferetta che cade in un fluido viscoso: la curva parte da zero con la stessa pendenza della retta tratteggiata della caduta libera, poi si piega e si avvicina sempre di più alla retta orizzontale tratteggiata della velocità limite, senza superarla
% svg: grafico-velocita-tempo-velocita-limite-c1fb7efa.svg 303x164
\begin{tikzpicture}[x=1.3cm, y=2.6cm]
\draw[gray!25, very thin, xstep=1, ystep=0.25] (0,0) grid (5,1.25);
\draw[->] (-0.15,0) -- (5.4,0) node[right] {$t$};
\draw[->] (0,-0.08) -- (0,1.4) node[above] {$v$};
\draw[dashed] (0,1) -- (5.2,1);
\node[left] at (0,1) {$v_l$};
\draw[dashed, thin] (0,0) -- (1.3,1.3) node[right] {\small senza attrito};
\draw[thick, blue, domain=0:5, samples=60] plot (\x,{1-exp(-\x)});
\end{tikzpicture}
```

Se la spinta di Archimede è trascurabile (un corpo molto più denso del fluido, come una goccia d'acqua nell'aria), la condizione di equilibrio è $F_v = m\,g$:

$$6\pi\,\eta\,r\,v_l = m\,g \qquad\Rightarrow\qquad v_l = \frac{m\,g}{6\pi\,\eta\,r}$$

La velocità limite cresce con la massa della sfera e diminuisce con la viscosità del fluido. Per una sfera di densità $d_s$ la massa è $m = d_s \cdot V$, con il volume $V = \tfrac{4}{3}\pi\,r^3$; sostituendo, $\pi$ e un fattore $r$ si semplificano:

$$v_l = \frac{2\,r^2\,g\,d_s}{9\,\eta}$$

```ad-example
Esempio 2: una gocciolina di nebbia
Le goccioline di una nebbia hanno un raggio di circa $10\,\mu\text{m}$. Con che velocità scendono nell'aria ($\eta = 1{,}8 \cdot 10^{-5}\,\text{Pa} \cdot \text{s}$)?

Il raggio in metri è $r = 10 \cdot 10^{-6}\,\text{m} = 1{,}0 \cdot 10^{-5}\,\text{m}$. La massa della gocciolina:

$$m = d_s \cdot \frac{4}{3}\pi\,r^3 = 1000\,\frac{\text{kg}}{\text{m}^3} \cdot \frac{4}{3}\pi \cdot (1{,}0 \cdot 10^{-5}\,\text{m})^3 = 4{,}2 \cdot 10^{-12}\,\text{kg}$$

$$v_l = \frac{m\,g}{6\pi\,\eta\,r} = \frac{4{,}2 \cdot 10^{-12}\,\text{kg} \cdot 9{,}8\,\text{m/s}^2}{6\pi \cdot 1{,}8 \cdot 10^{-5}\,\text{Pa} \cdot \text{s} \cdot 1{,}0 \cdot 10^{-5}\,\text{m}} = 1{,}2 \cdot 10^{-2}\,\frac{\text{m}}{\text{s}}$$

Poco più di un centimetro al secondo: per scendere di un metro la gocciolina impiega quasi un minuto e mezzo, e basta un soffio d'aria verso l'alto per tenerla sospesa. Ecco perché la nebbia non cade.
```

```ad-warning
La velocità limite va con il quadrato del raggio
Una sfera di raggio doppio, dello stesso materiale, ha massa otto volte più grande ($r^3$) e sente, a parità di velocità, un attrito solo doppio ($r$): la sua velocità limite è $8/2 = 4$ volte più grande. Per questo le gocce di pioggia cadono e quelle di nebbia no. Un altro errore comune è mettere nella formula il raggio in millimetri o in micrometri: $1\,\text{mm} = 10^{-3}\,\text{m}$ e $1\,\mu\text{m} = 10^{-6}\,\text{m}$, e il raggio è al quadrato.
```

### Con la spinta di Archimede

Se il fluido è un liquido, la [spinta di Archimede](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-spinta-di-archimede-e-il-galleggiamento) non si può trascurare. Sulla sfera agiscono tre forze: il peso $m\,g = d_s\,V\,g$ verso il basso, la spinta di Archimede $S_A = d_{fl}\,V\,g$ e l'attrito viscoso $F_v$ verso l'alto, dove $d_{fl}$ è la densità del fluido.

```tikz
% nome: sfera-forze-velocita-limite
% alt: Una sferetta che scende in un liquido alla velocità limite, con le tre forze applicate al suo centro: il peso, freccia rossa lunga verso il basso; verso l'alto la forza di attrito viscoso, freccia rossa lunga, e in cima a questa la spinta di Archimede, freccia rossa corta. Le due forze verso l'alto, messe in fila, sono lunghe quanto il peso. Una freccia blu a lato indica la velocità, verso il basso
% svg: sfera-forze-velocita-limite-9e8abf68.svg 155x190
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (4,4.6);
\draw[thick] (0,4.9) -- (0,0) -- (4,0) -- (4,4.9);
\draw[thin] (0,4.6) -- (4,4.6);
\draw[thick, fill=gray!20] (2,2.4) circle (0.3);
\draw[-{Stealth}, thick, red] (2,2.4) -- (2,0.8) node[right, pos=0.8] {$m\,\vec{g}$};
\draw[-{Stealth}, thick, red] (2,2.4) -- (2,3.74) node[left, pos=0.7] {$\vec{F}_v$};
\draw[-{Stealth}, thick, red] (2,3.74) -- (2,4.0);
\node[right, red] at (2,3.9) {$\vec{S}_A$};
\fill (2,2.4) circle (1.5pt);
\draw[-{Stealth}, thick, blue!60!black] (3.3,2.8) -- (3.3,2.0) node[right, pos=0.5] {$\vec{v}_l$};
\end{tikzpicture}
```

Alla velocità limite le forze si equilibrano, $F_v + S_A = m\,g$:

$$6\pi\,\eta\,r\,v_l = (d_s - d_{fl}) \cdot \frac{4}{3}\pi\,r^3 \cdot g \qquad\Rightarrow\qquad v_l = \frac{2\,r^2\,g\,(d_s - d_{fl})}{9\,\eta}$$

È la formula di prima con la differenza delle densità al posto della densità della sfera. Se $d_{fl}$ è molto più piccola di $d_s$ le due formule coincidono; se la sfera è meno densa del fluido (una bollicina d'aria nell'acqua) la differenza è negativa e la sfera sale, con una velocità limite che ha lo stesso modulo. Nella figura le forze sono in scala per la sferetta dell'esempio 3, e la spinta di Archimede è disegnata in cima all'attrito viscoso per far vedere che insieme equilibrano il peso.

```ad-example
Esempio 3: una sferetta d'acciaio nella glicerina
Una sferetta d'acciaio ($d_s = 7{,}8 \cdot 10^3\,\text{kg/m}^3$) di raggio $1{,}0\,\text{mm}$ viene lasciata cadere in un cilindro pieno di glicerina ($d_{fl} = 1{,}26 \cdot 10^3\,\text{kg/m}^3$, $\eta = 1{,}5\,\text{Pa} \cdot \text{s}$). Quanto vale la velocità limite?

$$v_l = \frac{2\,r^2\,g\,(d_s - d_{fl})}{9\,\eta} = \frac{2 \cdot (1{,}0 \cdot 10^{-3}\,\text{m})^2 \cdot 9{,}8\,\text{m/s}^2 \cdot (7{,}8 - 1{,}26) \cdot 10^3\,\text{kg/m}^3}{9 \cdot 1{,}5\,\text{Pa} \cdot \text{s}}$$

$$v_l = \frac{0{,}128}{13{,}5}\,\frac{\text{m}}{\text{s}} = 9{,}5 \cdot 10^{-3}\,\frac{\text{m}}{\text{s}}$$

cioè $9{,}5$ millimetri al secondo: per attraversare $20\,\text{cm}$ di glicerina la sferetta impiega $21$ secondi. Senza la spinta di Archimede il risultato sarebbe stato $11\,\text{mm/s}$, il $19\,\%$ in più.
```

Nella figura qui sotto due sferette d'acciaio cadono nella glicerina: la prima è quella dell'esempio 3, della seconda scegli tu il raggio. La domanda: se il raggio raddoppia, di quanto cambia la velocità limite?

```interattivo
% nome: sferette-glicerina-velocita-limite
% alt: Due cilindri di glicerina alti 20 centimetri, ognuno con una sferetta d'acciaio. La prima ha raggio 1 millimetro; il raggio della seconda si sceglie con un cursore tra 0,5 e 2 millimetri. Premendo Avvia le due sferette scendono, ciascuna alla sua velocità limite, finché la più veloce tocca il fondo. Sotto la figura si leggono le due velocità limite, il loro rapporto e il tempo trascorso
```

Diventa quattro volte più grande: con $2{,}0\,\text{mm}$ di raggio la seconda sferetta scende a $38\,\text{mm/s}$ e tocca il fondo in poco più di $5$ secondi, quando la prima ha percorso appena un quarto del cilindro. Con $0{,}5\,\text{mm}$ va a $2{,}4\,\text{mm/s}$, un quarto della velocità della prima.

### Quanto ci vuole per arrivarci

A rigore la sferetta non raggiunge mai la velocità limite: le si avvicina sempre di più, come nel grafico. Si dimostra che, partendo da ferma, la velocità cresce nel tempo secondo una [funzione esponenziale](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-esponenziale):

$$v(t) = v_l \left(1 - e^{-t/\tau}\right) \qquad \text{con} \qquad \tau = \frac{m}{6\pi\,\eta\,r}$$

Il tempo $\tau$ (tau) dice quanto in fretta succede: dopo un tempo $\tau$ la velocità è al $63\,\%$ di quella limite, dopo $5\,\tau$ a più del $99\,\%$. Per la sferetta dell'esempio 3 e per la gocciolina di nebbia $\tau$ vale poco più di un millesimo di secondo: in pratica viaggiano alla velocità limite fin dall'inizio.

## Misurare la viscosità con una sferetta

La formula della velocità limite si può leggere al contrario. Si lascia cadere una sferetta di raggio e densità noti in un cilindro pieno del liquido, si aspetta che abbia raggiunto la velocità limite e si cronometra il tempo che impiega a percorrere un tratto segnato sul vetro. Dalla velocità si ricava la viscosità:

$$\eta = \frac{2\,r^2\,g\,(d_s - d_{fl})}{9\,v_l}$$

Lo strumento si chiama viscosimetro a caduta di sfera.

```ad-example
Esempio 4: la viscosità di un olio lubrificante
In un cilindro pieno di olio lubrificante ($d_{fl} = 900\,\text{kg/m}^3$) una sferetta d'acciaio ($d_s = 7{,}8 \cdot 10^3\,\text{kg/m}^3$) di raggio $1{,}0\,\text{mm}$ percorre a velocità costante un tratto di $30\,\text{cm}$ in $6{,}0\,\text{s}$. Quanto vale la viscosità dell'olio?

La velocità limite è $v_l = 0{,}30\,\text{m} / 6{,}0\,\text{s} = 0{,}050\,\text{m/s}$.

$$\eta = \frac{2\,r^2\,g\,(d_s - d_{fl})}{9\,v_l} = \frac{2 \cdot (1{,}0 \cdot 10^{-3}\,\text{m})^2 \cdot 9{,}8\,\text{m/s}^2 \cdot 6{,}9 \cdot 10^3\,\text{kg/m}^3}{9 \cdot 0{,}050\,\text{m/s}} = 0{,}30\,\text{Pa} \cdot \text{s}$$

Trecento volte la viscosità dell'acqua.
```

## Quando Stokes non basta: la pioggia e il paracadutista

Per una goccia di pioggia di raggio $1{,}0\,\text{mm}$ la formula di Stokes darebbe una velocità limite di $1{,}2 \cdot 10^2\,\text{m/s}$, più di quattrocento chilometri all'ora. Le gocce vere arrivano a terra a $6$ o $7\,\text{m/s}$. La formula sbaglia perché a quelle velocità l'aria dietro la goccia è turbolenta, e la resistenza che ne nasce è molto più grande dell'attrito viscoso di Stokes.

L'idea di velocità limite però resta. Qualunque sia la legge con cui la resistenza del fluido cresce con la velocità, un corpo che cade accelera finché la resistenza non equilibra il peso, e poi prosegue a velocità costante. Un paracadutista in caduta libera, a braccia e gambe aperte, raggiunge in una decina di secondi circa $50\,\text{m/s}$ e non va oltre; quando apre il paracadute la resistenza dell'aria diventa molto più grande del peso, lui rallenta, e la nuova velocità limite è di circa $5\,\text{m/s}$, quella di un salto da poco più di un metro.

```ad-warning
Alla velocità limite la forza totale è zero, non l'attrito
Un corpo che scende alla velocità limite non è "senza forze": il peso c'è sempre, e l'attrito del fluido è grande quanto serve per equilibrarlo. Ed è sbagliato dire che il corpo "si ferma": smette di accelerare, e continua a scendere a velocità costante.
```
