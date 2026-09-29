# Gli strumenti di misura

Ogni misura si fa con uno strumento, e lo strumento decide quanto può essere precisa: con un righello non si distinguono i decimi di millimetro, con un calibro sì. Per scegliere lo strumento giusto e leggerlo bene servono tre caratteristiche, la portata, la sensibilità e la prontezza, e un po' di attenzione a come si guarda la scala.

## Strumenti analogici e digitali

Uno strumento **analogico** mostra la misura con la posizione di un indice, o di un bordo, su una scala graduata: il righello, il cilindro graduato, il termometro a liquido, la bilancia pesapersone con la lancetta. Uno strumento **digitale** mostra la misura direttamente in cifre, su un display: la bilancia elettronica, il cronometro del telefono, il termometro digitale. Negli strumenti analogici la lettura la fa chi misura, e può sbagliarla; in quelli digitali la fa lo strumento.

## Portata, sensibilità e prontezza

La **portata** di uno strumento è il valore più grande che può misurare. Un righello da $30\,\text{cm}$ ha la portata di $30\,\text{cm}$, una bilancia da cucina può avere la portata di $5\,\text{kg}$: un oggetto più pesante non si misura, e la bilancia si può rompere.

La **sensibilità** è la più piccola variazione della grandezza che lo strumento riesce a rilevare. In uno strumento analogico è il valore di una divisione della scala, cioè la distanza tra due tacche vicine: nel righello $1\,\text{mm}$. In uno strumento digitale è il valore di un'unità dell'ultima cifra: una bilancia che mostra $12{,}5\,\text{g}$ ha la sensibilità di $0{,}1\,\text{g}$.

Quando le tacche non sono numerate una per una, il valore di una divisione si calcola: si prendono due tacche numerate, si fa la differenza dei loro valori e la si divide per il numero di intervalli tra le due.

```ad-example
Esempio 1: portata e sensibilità di un cilindro graduato
Un cilindro graduato ha la tacca più alta con il numero $250$ e i numeri $0$, $50$, $100$, $150$, $200$, $250$, espressi in millilitri. Tra due numeri vicini ci sono $25$ intervalli. Quanto valgono la portata e la sensibilità?

La portata è il valore più alto della scala, $250\,\text{mL}$. Tra $0$ e $50$ ci sono $25$ intervalli, quindi una divisione vale

$$\frac{50\,\text{mL}}{25} = 2\,\text{mL}$$

e la sensibilità è $2\,\text{mL}$.
```

```ad-warning
Una tacca non vale sempre 1
Contare le tacche e leggere il loro numero come se ognuna valesse $1\,\text{mL}$ è l'errore più comune con i cilindri graduati. Prima di leggere, calcola quanto vale una divisione.
```

La **prontezza** dice quanto in fretta lo strumento dà la misura: un termometro digitale per la febbre risponde in pochi secondi, uno a liquido ha bisogno di qualche minuto per arrivare alla temperatura del corpo. Uno strumento poco pronto non segue una grandezza che cambia in fretta.

Uno strumento va scelto in base alla misura da fare: la portata deve essere più grande della grandezza, e la sensibilità abbastanza piccola per la precisione che serve. Per la lunghezza di una stanza serve un metro a nastro, non un righello da $30\,\text{cm}$ (portata troppo piccola); per il diametro di una moneta, circa $23\,\text{mm}$, un righello dà solo i millimetri, un calibro anche i decimi o i centesimi.

## Leggere una misura

Con uno strumento analogico si legge la tacca più vicina al bordo dell'oggetto, o all'indice. Una misura letta una volta sola si scrive con la sua **incertezza**, che per una misura singola si prende uguale alla sensibilità dello strumento:

$$\ell = (12{,}3 \pm 0{,}1)\,\text{cm}$$

Si legge "dodici virgola tre più o meno zero virgola uno centimetri", e vuol dire che la lunghezza sta tra $12{,}2\,\text{cm}$ e $12{,}4\,\text{cm}$. Il valore e l'incertezza si scrivono con lo stesso numero di decimali. Quando le misure sono più di una, l'incertezza si stima in un altro modo, spiegato nella lezione [Valore medio e incertezza di una serie di misure](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/valore-medio-e-incertezza-di-una-serie-di-misure).

```ad-note
Metà divisione o una divisione?
Alcuni libri prendono come incertezza di una lettura singola metà della sensibilità, quando il bordo cade tra due tacche e si riesce a stimare da che parte è più vicino. Qui si usa la sensibilità intera, che è la scelta più prudente.
```

### Il righello

Il righello ha la sensibilità di $1\,\text{mm}$. Si appoggia lungo l'oggetto, con lo zero allineato a un'estremità, e si legge la tacca all'altra estremità. Se lo zero è consumato o non si vede, si può partire da un'altra tacca e fare la differenza delle due letture.

```ad-example
Esempio 2: un righello che non parte da zero
Una matita è appoggiata sul righello da $2{,}0\,\text{cm}$ a $7{,}4\,\text{cm}$. Quanto è lunga?

```tikz
% nome: righello-lettura-differenza
% alt: Un righello graduato in millimetri da 1 a 8 centimetri e sopra una matita che va dalla tacca dei 2 centimetri a quella dei 7,4 centimetri: la lunghezza è la differenza delle due letture, 5,4 centimetri
% svg: righello-lettura-differenza-6c467274.svg 206x68
\begin{tikzpicture}
\fill[yellow!20] (0,0) rectangle (5.25,0.8);
\draw[thick] (0,0) rectangle (5.25,0.8);
\foreach \m in {0,...,70} \draw[thin] ({0.25+\m*0.07},0.8) -- ++(0,-0.15);
\foreach \m in {0,...,14} \draw[thin] ({0.25+\m*0.35},0.8) -- ++(0,-0.25);
\foreach \m in {0,...,7} \draw[thin] ({0.25+\m*0.7},0.8) -- ++(0,-0.36);
\foreach \c in {1,...,8} \node[font=\small] at ({0.25+(\c-1)*0.7},0.2) {\c};
\fill[orange!25] (0.95,0.8) rectangle (4.73,1.2);
\draw[thick] (0.95,0.8) -- (0.95,1.2) -- (4.73,1.2) -- (4.73,0.8);
\draw[thick] (4.73,1.2) -- (5.1,1.0) -- (4.73,0.8);
\node[font=\small] at (0.95,1.45) {$2{,}0$};
\node[font=\small] at (4.73,1.45) {$7{,}4$};
\end{tikzpicture}
```

La lunghezza è la differenza delle letture: $7{,}4\,\text{cm} - 2{,}0\,\text{cm} = 5{,}4\,\text{cm}$. Ognuna delle due letture ha l'incertezza di $0{,}1\,\text{cm}$, e in una differenza le incertezze si sommano, come spiega la lezione [Incertezza relativa e propagazione delle incertezze](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/incertezza-relativa-e-propagazione-delle-incertezze): la lunghezza è $(5{,}4 \pm 0{,}2)\,\text{cm}$.
```

```ad-warning
Leggere la tacca finale senza togliere quella iniziale
Se la matita parte da $2{,}0\,\text{cm}$, la sua lunghezza non è $7{,}4\,\text{cm}$: quello è solo il punto in cui finisce. La lunghezza è la differenza tra dove finisce e dove comincia.
```

### Il cilindro graduato e l'errore di parallasse

La superficie dell'acqua in un cilindro graduato non è piana: vicino al vetro si alza e forma una curva che si chiama **menisco**. Per l'acqua la lettura si fa sul fondo del menisco. L'occhio deve stare alla stessa altezza del fondo del menisco: se lo guardi dall'alto la lettura esce più grande, se lo guardi dal basso più piccola. Questo errore, che nasce dalla posizione dell'occhio, si chiama **errore di parallasse**, e vale per ogni scala graduata che si guarda di traverso.

```tikz
% nome: menisco-parallasse
% alt: Un cilindro graduato visto di lato con l'acqua che forma un menisco con il fondo a 36 millilitri: un occhio alla stessa altezza del fondo del menisco legge 36 millilitri, un occhio più in alto guarda di traverso e legge 37 millilitri
% svg: menisco-parallasse-735c0e1e.svg 181x118
\begin{tikzpicture}
\fill[blue!15] (0,0) -- (0,1.9) .. controls (0.25,1.76) and (0.5,1.75) .. (0.8,1.75) .. controls (1.1,1.75) and (1.35,1.76) .. (1.6,1.9) -- (1.6,0) -- cycle;
\draw[thin] (0,1.9) .. controls (0.25,1.76) and (0.5,1.75) .. (0.8,1.75) .. controls (1.1,1.75) and (1.35,1.76) .. (1.6,1.9);
\draw[thick] (0,3) -- (0,0) -- (1.6,0) -- (1.6,3);
\foreach \v in {30,...,40} \draw[thin] (0,{(\v-30)*0.25+0.25}) -- ++(0.15,0);
\foreach \v in {30,35,40} {
  \draw[thin] (0,{(\v-30)*0.25+0.25}) -- ++(0.3,0);
  \node[right, font=\scriptsize] at (0.3,{(\v-30)*0.25+0.25}) {$\v$};
}
\draw[dashed, thin] (-1.45,1.75) -- (0.8,1.75);
\draw[dashed, thin, red] (-1.45,2.453) -- (0.8,1.75);
\fill[red] (0,2) circle (1.3pt);
\fill (0,1.75) circle (1.3pt);
\draw[thick] (-1.85,1.75) .. controls (-1.7,1.9) .. (-1.5,1.75) .. controls (-1.7,1.6) .. (-1.85,1.75);
\fill (-1.6,1.75) circle (1.3pt);
\draw[thick, red] (-1.85,2.5) .. controls (-1.7,2.65) .. (-1.5,2.5) .. controls (-1.7,2.35) .. (-1.85,2.5);
\fill[red] (-1.6,2.5) circle (1.3pt);
\node[right, font=\small] at (1.7,1.75) {$36$ mL};
\node[right, font=\small, red] at (1.7,2.25) {$37$ mL};
\end{tikzpicture}
```

```ad-example
Esempio 3: la lettura di un cilindro graduato
Nel cilindro graduato della figura le tacche vanno da $30$ a $40$ millilitri, una per millilitro, e il fondo del menisco è sulla tacca $36$. Come si scrive la misura?

La sensibilità è di $1\,\text{mL}$, quindi il volume è $V = (36 \pm 1)\,\text{mL}$. Guardando il menisco dall'alto si leggerebbe $37\,\text{mL}$, che è sbagliato.
```

## Il calibro

Per misurare lunghezze piccole con più precisione del righello si usa il **calibro**, o calibro a corsoio. Ha un'asta fissa con la scala principale in millimetri e un cursore che scorre lungo l'asta, con una scala più corta, il **nonio**. I becchi in basso stringono l'oggetto da fuori (lo spessore di una moneta, il diametro di un tondino), quelli in alto misurano da dentro (il diametro di un foro), e l'asta che esce a destra misura le profondità.

```tikz
% nome: calibro-parti
% alt: Un calibro a corsoio: l'asta fissa con la scala principale, il cursore con il nonio che scorre sull'asta, i becchi in basso per le misure esterne che stringono un oggetto, i becchi in alto per le misure interne e l'asta di profondità che esce a destra
% svg: calibro-parti-770a234e.svg 221x115
\begin{tikzpicture}[scale=0.64]
\fill[gray!15] (-0.3,0) rectangle (6.2,0.55);
\draw[thick] (-0.3,0) rectangle (6.2,0.55);
\foreach \x in {0.35,0.55,...,6.1} \draw[thin] (\x,0.55) -- (\x,0.4);
\fill[gray!15] (-0.3,0) -- (0.35,0) -- (0.35,-1.8) -- (0.2,-1.8) -- (-0.3,-0.3) -- cycle;
\draw[thick] (-0.3,0) -- (-0.3,-0.3) -- (0.2,-1.8) -- (0.35,-1.8) -- (0.35,0);
\fill[gray!15] (0.05,0.55) -- (0.35,0.55) -- (0.35,1.3) -- (0.25,1.3) -- cycle;
\draw[thick] (0.05,0.55) -- (0.25,1.3) -- (0.35,1.3) -- (0.35,0.55);
\fill[orange!25] (0.35,-1.5) rectangle (1.9,-0.8);
\draw[thick] (0.35,-1.5) rectangle (1.9,-0.8);
\fill[blue!10] (1.9,-0.6) rectangle (3.7,0.8);
\draw[thick] (1.9,-0.6) rectangle (3.7,0.8);
\foreach \x in {1.9,2.08,...,3.55} \draw[thin] (\x,0) -- (\x,-0.15);
\draw[thin] (1.9,0) -- (3.7,0);
\fill[blue!10] (1.9,-0.6) -- (2.55,-0.6) -- (2.05,-1.8) -- (1.9,-1.8) -- cycle;
\draw[thick] (1.9,-0.6) -- (1.9,-1.8) -- (2.05,-1.8) -- (2.55,-0.6);
\fill[blue!10] (1.9,0.8) -- (2.2,0.8) -- (2.0,1.3) -- (1.9,1.3) -- cycle;
\draw[thick] (1.9,0.8) -- (1.9,1.3) -- (2.0,1.3) -- (2.2,0.8);
\fill[gray!15] (6.2,0.22) rectangle (7.75,0.33);
\draw[thin] (6.2,0.22) rectangle (7.75,0.33);
\node[above, font=\small] at (4.6,0.6) {scala principale};
\node[below, font=\small] at (3.1,-0.65) {nonio};
\node[below, font=\small] at (1.12,-1.85) {becchi esterni};
\node[above, font=\small] at (1.12,1.35) {becchi interni};
\node[below, font=\small, align=center] at (7.1,0.1) {asta di\\profondità};
\end{tikzpicture}
```

### Il nonio decimale

Nel **nonio decimale** la scala del cursore ha $10$ divisioni che occupano $9\,\text{mm}$, quindi ogni divisione del nonio è lunga $0{,}9\,\text{mm}$, un decimo di millimetro meno di una divisione della scala principale. Quando il calibro è chiuso, lo zero del nonio coincide con lo zero della scala principale e la tacca $10$ del nonio con la tacca dei $9\,\text{mm}$; la prima tacca del nonio è indietro di $0{,}1\,\text{mm}$ rispetto a quella del millimetro, la seconda di $0{,}2\,\text{mm}$, e così via. Se il cursore avanza di $0{,}1\,\text{mm}$, è la prima tacca del nonio a coincidere con una tacca della scala principale; se avanza di $0{,}7\,\text{mm}$, la settima. La sensibilità del calibro decimale è quindi $0{,}1\,\text{mm}$.

Per leggere il calibro:

1. guarda dove cade lo zero del nonio sulla scala principale: i millimetri interi sono quelli della tacca subito a sinistra dello zero;
2. cerca la tacca del nonio che coincide con una tacca qualsiasi della scala principale: il suo numero, moltiplicato per la sensibilità, dà la parte decimale;
3. somma le due parti.

```ad-example
Esempio 4: una lettura con il nonio decimale
Nella figura i numeri della scala principale sono i centimetri, e ogni tacca è un millimetro. Quanto misura l'oggetto?

```tikz
% nome: nonio-decimale-lettura
% alt: La scala principale del calibro, in millimetri con i numeri ai centimetri, e sotto il nonio decimale: lo zero del nonio sta tra 23 e 24 millimetri e la settima tacca del nonio, in arancione, coincide con la tacca dei 30 millimetri; la lettura è 23,7 millimetri
% svg: nonio-decimale-lettura-5458aa63.svg 219x76
\begin{tikzpicture}
\fill[gray!15] (-0.2,0) rectangle (5.48,0.95);
\draw[thick] (-0.2,0.95) -- (5.48,0.95);
\fill[blue!10] (0.821,-0.95) rectangle (4.591,0);
\draw[thick] (0.821,0) -- (0.821,-0.95) -- (4.591,-0.95) -- (4.591,0);
\draw[thick] (-0.2,0) -- (5.48,0);
\draw[thin] (0,0) -- (0,0.42);
\node[font=\small] at (0,0.68) {2};
\draw[thin] (0.33,0) -- (0.33,0.2);
\draw[thin] (0.66,0) -- (0.66,0.2);
\draw[thin] (0.99,0) -- (0.99,0.2);
\draw[thin] (1.32,0) -- (1.32,0.2);
\draw[thin] (1.65,0) -- (1.65,0.3);
\draw[thin] (1.98,0) -- (1.98,0.2);
\draw[thin] (2.31,0) -- (2.31,0.2);
\draw[thin] (2.64,0) -- (2.64,0.2);
\draw[thin] (2.97,0) -- (2.97,0.2);
\draw[thin] (3.3,0) -- (3.3,0.42);
\node[font=\small] at (3.3,0.68) {3};
\draw[thin] (3.63,0) -- (3.63,0.2);
\draw[thin] (3.96,0) -- (3.96,0.2);
\draw[thin] (4.29,0) -- (4.29,0.2);
\draw[thin] (4.62,0) -- (4.62,0.2);
\draw[thin] (4.95,0) -- (4.95,0.3);
\draw[thin] (5.28,0) -- (5.28,0.2);
\draw[thin] (1.221,0) -- (1.221,-0.3);
\node[font=\small] at (1.221,-0.55) {0};
\draw[thin] (1.518,0) -- (1.518,-0.2);
\draw[thin] (1.815,0) -- (1.815,-0.2);
\draw[thin] (2.112,0) -- (2.112,-0.2);
\draw[thin] (2.409,0) -- (2.409,-0.2);
\draw[thin] (2.706,0) -- (2.706,-0.3);
\node[font=\small] at (2.706,-0.55) {5};
\draw[thin] (3.003,0) -- (3.003,-0.2);
\draw[orange!90!black, thick] (3.3,0) -- (3.3,-0.2);
\draw[thin] (3.597,0) -- (3.597,-0.2);
\draw[thin] (3.894,0) -- (3.894,-0.2);
\draw[thin] (4.191,0) -- (4.191,-0.3);
\node[font=\small] at (4.191,-0.55) {10};
\fill[orange!90!black] (3.3,-0.36) -- ++(-0.08,-0.14) -- ++(0.16,0) -- cycle;
\end{tikzpicture}
```

Lo zero del nonio cade tra la tacca dei $23\,\text{mm}$ e quella dei $24\,\text{mm}$: i millimetri interi sono $23$. La tacca del nonio che coincide con una della scala principale, in arancione, è la settima (coincide con la tacca dei $30\,\text{mm}$). La lettura è

$$23\,\text{mm} + 7 \cdot 0{,}1\,\text{mm} = 23{,}7\,\text{mm}$$

e la misura si scrive $(23{,}7 \pm 0{,}1)\,\text{mm}$.
```

```ad-warning
Il numero sotto la tacca che coincide non è la misura
Nell'esempio 4 la tacca che coincide è sotto i $30\,\text{mm}$ della scala principale, ma l'oggetto non è lungo $30\,\text{mm}$: i millimetri interi si leggono allo zero del nonio, e la tacca che coincide dà solo i decimi.
```

Prova a muovere il cursore: guarda quale tacca del nonio coincide mentre lo zero avanza di un decimo di millimetro alla volta.

```interattivo
% nome: calibro-nonio
% alt: La scala principale di un calibro e il nonio sul cursore, visti da vicino; un cursore sposta il nonio da 0 a 10 millimetri, a passi di un decimo o di un ventesimo di millimetro, e la tacca del nonio che coincide con una tacca della scala principale si colora di arancione. Un bottone passa dal nonio decimale a quello ventesimale, un altro mostra la lettura, per esempio 3 millimetri più 7 per 0,1, uguale a 3,7 millimetri
```

### Il nonio ventesimale

Nel **nonio ventesimale** le divisioni del nonio sono $20$ e occupano $19\,\text{mm}$ (in molti calibri $39\,\text{mm}$, con lo stesso risultato): ogni divisione del nonio è più corta di una del millimetro di $\dfrac{1}{20}\,\text{mm} = 0{,}05\,\text{mm}$, e la sensibilità è $0{,}05\,\text{mm}$. Di solito il nonio porta i numeri da $0$ a $10$, uno ogni due divisioni: sono i decimi di millimetro. La lettura si fa allo stesso modo, moltiplicando per $0{,}05\,\text{mm}$ il numero della divisione che coincide, contato da zero una tacca alla volta. Esistono anche calibri con il nonio cinquantesimale, con la sensibilità di $0{,}02\,\text{mm}$.

```ad-example
Esempio 5: una lettura con il nonio ventesimale
Nella figura il nonio ha $20$ divisioni. Quanto misura l'oggetto?

```tikz
% nome: nonio-ventesimale-lettura
% alt: La scala principale del calibro e sotto il nonio ventesimale, con 20 divisioni numerate da 0 a 10 in decimi di millimetro: lo zero del nonio sta tra 12 e 13 millimetri e la settima tacca del nonio, in arancione, coincide con la tacca dei 19 millimetri; la lettura è 12,35 millimetri
% svg: nonio-ventesimale-lettura-6b17d446.svg 228x76
\begin{tikzpicture}
\fill[gray!15] (-0.2,0) rectangle (5.72,0.95);
\draw[thick] (-0.2,0.95) -- (5.72,0.95);
\fill[blue!10] (0.164,-0.95) rectangle (5.524,0);
\draw[thick] (0.164,0) -- (0.164,-0.95) -- (5.524,-0.95) -- (5.524,0);
\draw[thick] (-0.2,0) -- (5.72,0);
\draw[thin] (0,0) -- (0,0.42);
\node[font=\small] at (0,0.68) {1};
\draw[thin] (0.24,0) -- (0.24,0.2);
\draw[thin] (0.48,0) -- (0.48,0.2);
\draw[thin] (0.72,0) -- (0.72,0.2);
\draw[thin] (0.96,0) -- (0.96,0.2);
\draw[thin] (1.2,0) -- (1.2,0.3);
\draw[thin] (1.44,0) -- (1.44,0.2);
\draw[thin] (1.68,0) -- (1.68,0.2);
\draw[thin] (1.92,0) -- (1.92,0.2);
\draw[thin] (2.16,0) -- (2.16,0.2);
\draw[thin] (2.4,0) -- (2.4,0.42);
\node[font=\small] at (2.4,0.68) {2};
\draw[thin] (2.64,0) -- (2.64,0.2);
\draw[thin] (2.88,0) -- (2.88,0.2);
\draw[thin] (3.12,0) -- (3.12,0.2);
\draw[thin] (3.36,0) -- (3.36,0.2);
\draw[thin] (3.6,0) -- (3.6,0.3);
\draw[thin] (3.84,0) -- (3.84,0.2);
\draw[thin] (4.08,0) -- (4.08,0.2);
\draw[thin] (4.32,0) -- (4.32,0.2);
\draw[thin] (4.56,0) -- (4.56,0.2);
\draw[thin] (4.8,0) -- (4.8,0.42);
\node[font=\small] at (4.8,0.68) {3};
\draw[thin] (5.04,0) -- (5.04,0.2);
\draw[thin] (5.28,0) -- (5.28,0.2);
\draw[thin] (5.52,0) -- (5.52,0.2);
\draw[thin] (0.564,0) -- (0.564,-0.3);
\node[font=\small] at (0.564,-0.55) {0};
\draw[thin] (0.792,0) -- (0.792,-0.2);
\draw[thin] (1.02,0) -- (1.02,-0.2);
\draw[thin] (1.248,0) -- (1.248,-0.2);
\draw[thin] (1.476,0) -- (1.476,-0.2);
\draw[thin] (1.704,0) -- (1.704,-0.2);
\draw[thin] (1.932,0) -- (1.932,-0.2);
\draw[orange!90!black, thick] (2.16,0) -- (2.16,-0.2);
\draw[thin] (2.388,0) -- (2.388,-0.2);
\draw[thin] (2.616,0) -- (2.616,-0.2);
\draw[thin] (2.844,0) -- (2.844,-0.3);
\node[font=\small] at (2.844,-0.55) {5};
\draw[thin] (3.072,0) -- (3.072,-0.2);
\draw[thin] (3.3,0) -- (3.3,-0.2);
\draw[thin] (3.528,0) -- (3.528,-0.2);
\draw[thin] (3.756,0) -- (3.756,-0.2);
\draw[thin] (3.984,0) -- (3.984,-0.2);
\draw[thin] (4.212,0) -- (4.212,-0.2);
\draw[thin] (4.44,0) -- (4.44,-0.2);
\draw[thin] (4.668,0) -- (4.668,-0.2);
\draw[thin] (4.896,0) -- (4.896,-0.2);
\draw[thin] (5.124,0) -- (5.124,-0.3);
\node[font=\small] at (5.124,-0.55) {10};
\fill[orange!90!black] (2.16,-0.36) -- ++(-0.08,-0.14) -- ++(0.16,0) -- cycle;
\end{tikzpicture}
```

Lo zero del nonio cade tra $12\,\text{mm}$ e $13\,\text{mm}$. Coincide la settima divisione del nonio, in arancione (con la tacca dei $19\,\text{mm}$), quindi

$$12\,\text{mm} + 7 \cdot 0{,}05\,\text{mm} = 12\,\text{mm} + 0{,}35\,\text{mm} = 12{,}35\,\text{mm}$$

La misura è $(12{,}35 \pm 0{,}05)\,\text{mm}$.
```

```ad-warning
Con il ventesimale ogni divisione vale 0,05 mm
Nell'esempio 5 la settima divisione non dà $0{,}7\,\text{mm}$ ma $7 \cdot 0{,}05 = 0{,}35\,\text{mm}$. Prima di leggere, conta le divisioni del nonio: $10$ vuol dire $0{,}1\,\text{mm}$, $20$ vuol dire $0{,}05\,\text{mm}$.
```

## Il micrometro

Per lunghezze ancora più piccole, come il diametro di un filo o lo spessore di un foglio, si usa il **micrometro** (detto anche palmer). L'oggetto si stringe tra due superfici, una delle quali avanza girando una vite: a ogni giro completo la vite avanza di $0{,}5\,\text{mm}$, il suo passo. Sul cilindro fisso c'è una scala con i millimetri sopra la linea di riferimento e i mezzi millimetri sotto; sul tamburo che gira ci sono $50$ divisioni, e ognuna vale $\dfrac{0{,}5\,\text{mm}}{50} = 0{,}01\,\text{mm}$, la sensibilità del micrometro.

La lettura è la somma di quello che si legge sul cilindro fisso, fino al bordo del tamburo, e del numero della divisione del tamburo che sta sulla linea di riferimento, moltiplicato per $0{,}01\,\text{mm}$.

```ad-example
Esempio 6: una lettura con il micrometro
Quanto misura l'oggetto stretto nel micrometro della figura?

```tikz
% nome: micrometro-lettura
% alt: La scala di un micrometro: sul cilindro fisso sono scoperti 7 millimetri e la tacca del mezzo millimetro successivo, sotto la linea di riferimento; sul tamburo la divisione 23 è sulla linea di riferimento; la lettura è 7,5 più 0,23, cioè 7,73 millimetri
% svg: micrometro-lettura-a566cb73.svg 216x110
\begin{tikzpicture}
\fill[gray!15] (-0.4,-0.45) rectangle (3.48,0.45);
\draw[thick] (-0.4,0.45) -- (3.48,0.45);
\draw[thick] (-0.4,-0.45) -- (3.48,-0.45);
\draw[thin] (-0.4,0) -- (3.48,0);
\foreach \m in {0,...,7} \draw[thin] ({\m*0.45},0) -- ++(0,0.25);
\foreach \m in {0,5} \node[font=\small] at ({\m*0.45},0.62) {\m};
\foreach \m in {0,...,7} \draw[thin] ({\m*0.45+0.225},0) -- ++(0,-0.22);
\fill[blue!10] (3.48,-1.15) rectangle (5.2,1.15);
\draw[thick] (3.48,-1.15) rectangle (5.2,1.15);
\foreach \d in {19,...,27} \draw[thin] (3.48,{(\d-23)*0.25}) -- ++(0.2,0);
\foreach \d in {20,25} {
  \draw[thin] (3.48,{(\d-23)*0.25}) -- ++(0.32,0);
  \node[right, font=\scriptsize] at (3.8,{(\d-23)*0.25}) {\d};
}
\draw[orange!90!black, thick] (3.48,0) -- ++(0.32,0);
\node[below, font=\small] at (1.5,-0.5) {cilindro fisso};
\node[below, font=\small] at (4.34,-1.2) {tamburo};
\end{tikzpicture}
```

Sul cilindro fisso sono scoperti $7\,\text{mm}$ interi, e sotto la linea si vede anche la tacca del mezzo millimetro successivo: la parte letta sul cilindro è $7{,}5\,\text{mm}$. Sul tamburo la divisione sulla linea di riferimento è la $23$, che vale $0{,}23\,\text{mm}$. La lettura è

$$7{,}5\,\text{mm} + 0{,}23\,\text{mm} = 7{,}73\,\text{mm}$$

e la misura è $(7{,}73 \pm 0{,}01)\,\text{mm}$.
```

```ad-warning
Il mezzo millimetro dimenticato
Nell'esempio 6, senza la tacca del mezzo millimetro, si leggerebbe $7{,}23\,\text{mm}$. Guarda sempre se, prima del bordo del tamburo, sotto la linea è scoperta una tacca dopo l'ultimo millimetro intero.
```

## Bilance e cronometri

La bilancia a bracci confronta la massa di un oggetto con masse campione, ed è in equilibrio quando le masse sui due piatti sono uguali. La bilancia elettronica mostra la massa sul display; prima di misurare si fa la tara, cioè si azzera la bilancia con il contenitore sopra, così il display mostra solo la massa di quello che si aggiunge. Le bilance di laboratorio hanno la sensibilità di $0{,}1\,\text{g}$ o di $0{,}01\,\text{g}$.

Il cronometro digitale ha la sensibilità di $0{,}01\,\text{s}$, ma chi lo usa ha un tempo di reazione di circa un decimo o due di secondo, quando lo fa partire e quando lo ferma. In pratica l'incertezza di una misura di tempo fatta a mano è molto più grande della sensibilità dello strumento. Per questo, nell'esperimento del pendolo della lezione [Il metodo sperimentale](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/il-metodo-sperimentale), si misura il tempo di $10$ oscillazioni e lo si divide per $10$.

```ad-warning
La sensibilità del display non è l'incertezza
Un cronometro che mostra $2{,}07\,\text{s}$ non misura un tempo con l'incertezza di $0{,}01\,\text{s}$, se a premerlo è una persona: il tempo di reazione conta di più. Gli errori che dipendono da chi misura sono spiegati nella lezione [Errori casuali ed errori sistematici](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/errori-casuali-ed-errori-sistematici).
```

Anche le forze si misurano con uno strumento, il dinamometro, che è descritto nella lezione [Le forze e il dinamometro](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-e-il-dinamometro).
