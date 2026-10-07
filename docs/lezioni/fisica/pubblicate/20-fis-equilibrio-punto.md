# L'equilibrio di un punto materiale e le reazioni vincolari

Un lampadario appeso al soffitto, un libro sul banco, un quadro tenuto da due fili: sono fermi e restano fermi, anche se su ciascuno agisce il peso, che da solo li farebbe cadere. Restano fermi perché altre forze, quelle del filo, del banco, dei chiodi, bilanciano il peso. In questa situazione si dice che il corpo è in equilibrio, e la statica è la parte della fisica che studia quando succede. Si comincia dal caso più semplice, un corpo così piccolo, rispetto al problema, da essere trattato come un punto.

## Il punto materiale

Un **punto materiale** è un corpo di cui, nel problema che si studia, si possono trascurare le dimensioni: tutta la sua massa si pensa concentrata in un punto, e tutte le forze che agiscono su di esso sono applicate in quel punto. Una lampada appesa a un filo, un sasso, un'automobile vista da un satellite si possono trattare come punti materiali; lo stesso corpo non lo è più quando conta dove sono applicate le forze, perché queste possono farlo ruotare, come una porta che si apre o una scala appoggiata al muro. Quei casi sono l'argomento della lezione [L'equilibrio di un corpo rigido](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-corpo-rigido).

Nelle figure il punto materiale è un pallino, o un corpo disegnato con le forze che partono tutte dal suo centro.

## La condizione di equilibrio

Un corpo è in **equilibrio** quando è fermo e continua a restare fermo. Per un punto materiale la condizione è una sola: la [risultante](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-e-il-dinamometro) di tutte le forze che agiscono su di esso deve essere nulla.

$$\vec{R} = \vec{F}_1 + \vec{F}_2 + \vec{F}_3 + \ldots = \vec{0}$$

Se la risultante non è nulla, il punto comincia a muoversi nella direzione della risultante. Con due sole forze la condizione dice che le due forze hanno lo stesso modulo, la stessa direzione e versi opposti; con tre o più forze, che ciascuna è opposta alla risultante di tutte le altre.

```ad-note
Equilibrio e velocità costante
La risultante nulla non dice che il corpo è fermo, ma che non cambia la sua velocità: un corpo fermo resta fermo, e un corpo che si muove continua a muoversi in linea retta a velocità costante. È il [primo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali). In questo capitolo i corpi sono sempre fermi.
```

La forza che, aggiunta a quelle che ci sono già, rende nulla la risultante si chiama **forza equilibrante**, $\vec{F}_e$. Ha lo stesso modulo e la stessa direzione della risultante $\vec{R}$ delle altre forze, e verso opposto:

$$\vec{F}_e = -\vec{R}$$

```ad-example
Esempio 1: la forza equilibrante di due forze perpendicolari
Su un punto materiale agiscono una forza $\vec{F}_1$ di $12\,\text{N}$ verso est e una forza $\vec{F}_2$ di $5{,}0\,\text{N}$ verso nord. Quale forza bisogna aggiungere perché il punto sia in equilibrio?

La risultante delle due forze, perpendicolari, si trova con il teorema di Pitagora, come nella lezione [Le forze e il dinamometro](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-e-il-dinamometro):

$$R = \sqrt{12^2 + 5{,}0^2}\,\text{N} = \sqrt{169}\,\text{N} = 13\,\text{N}$$

La forza equilibrante vale anch'essa $13\,\text{N}$ e punta dalla parte opposta alla risultante, verso sud-ovest. L'angolo che forma con la direzione ovest è quello che la risultante forma con la direzione est, $\tan^{-1}(5{,}0/12) \approx 23^\circ$.

```tikz
% nome: forza-equilibrante-due-forze
% alt: Un punto con due forze, F1 di 12 newton verso destra e F2 di 5 newton verso l'alto; la risultante R, in arancione, è la diagonale del rettangolo tratteggiato che hanno per lati; la forza equilibrante Fe, in rosso, ha lo stesso modulo della risultante e verso opposto, verso il basso e verso sinistra; scala di 1 centimetro per 5 newton
% svg: forza-equilibrante-due-forze-48d308a1.svg 228x125
\begin{tikzpicture}
\draw[dashed, thin] (2.4,0) -- (2.4,1) -- (0,1);
\draw[-{Stealth}, thick, red] (0,0) -- (2.4,0) node[below] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,1) node[left] {$\vec{F}_2$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (2.4,1) node[above right] {$\vec{R}$};
\draw[-{Stealth}, thick, red] (0,0) -- (-2.4,-1) node[below left] {$\vec{F}_e$};
\fill (0,0) circle (1.5pt);
\end{tikzpicture}
```
```

## Vincoli e reazioni vincolari

Un **vincolo** è un corpo che limita i movimenti di un altro corpo: il pavimento non lascia sprofondare chi ci cammina, il filo non lascia cadere la lampada, il chiodo tiene il quadro. Per impedire un movimento il vincolo esercita sul corpo una forza, la **reazione vincolare**, che indichiamo con $\vec{F}_v$.

La reazione vincolare non ha un valore fisso, come il peso: si adatta alle altre forze, e vale quanto serve per impedire il movimento, entro i limiti di resistenza del vincolo. Un tavolo regge un libro e regge anche una pila di libri, con una reazione più grande; se il carico supera quello che il tavolo sopporta, il tavolo si rompe.

Da dove venga questa forza lo spiega il [terzo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-terzo-principio-della-dinamica): il corpo preme sul vincolo, e il vincolo risponde con una forza uguale e opposta sul corpo.

### Il piano d'appoggio

Un corpo appoggiato su un piano preme sul piano con la [forza premente](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito) $F_\perp$, e il piano lo spinge con la reazione vincolare. Se il piano è liscio, cioè senza attrito, la reazione è perpendicolare al piano e diretta verso il corpo, e ha lo stesso modulo della forza premente: $F_v = F_\perp$. Un piano con attrito esercita anche una forza parallela a sé stesso, l'attrito, che si studia a parte.

Un piano d'appoggio può solo spingere, mai tirare: se una forza solleva il corpo con più del suo peso, il corpo si stacca dal piano e la reazione diventa zero.

```ad-example
Esempio 2: un libro sul tavolo
Un libro di $1{,}5\,\text{kg}$ è fermo su un tavolo orizzontale. Quanto vale la reazione del tavolo? E se una mano preme il libro verso il basso con una forza di $6{,}0\,\text{N}$?

Il peso del libro è $P = m \cdot g = 1{,}5\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 14{,}7\,\text{N}$. Sul libro fermo agiscono solo il peso, verso il basso, e la reazione del tavolo, verso l'alto, che devono avere lo stesso modulo: $F_v = 14{,}7\,\text{N}$.

Con la mano, verso il basso le forze sono due, e la reazione del tavolo deve bilanciarle tutte e due:

$$F_v = P + F = 14{,}7\,\text{N} + 6{,}0\,\text{N} = 20{,}7\,\text{N}$$

Se invece un filo tirasse il libro verso l'alto con $5{,}0\,\text{N}$, la reazione scenderebbe a $14{,}7\,\text{N} - 5{,}0\,\text{N} = 9{,}7\,\text{N}$.

```tikz
% nome: reazione-piano-libro-mano
% alt: Due libri su un tavolo. Nel primo agiscono il peso P verso il basso e la reazione del tavolo Fv verso l'alto, frecce della stessa lunghezza. Nel secondo una mano preme sul libro con la forza F verso il basso, e la reazione Fv verso l'alto è più lunga del peso, quanto il peso e la spinta della mano insieme; scala di 1 centimetro per 14 newton circa
% svg: reazione-piano-libro-mano-aba488b6.svg 209x136
\begin{tikzpicture}
\draw[thick] (-1,0) -- (1.2,0);
\foreach \x in {-0.85,-0.7,...,1.2} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (-0.5,0) rectangle (0.5,0.5);
\draw[-{Stealth}, thick, red] (0,0.25) -- (0,-0.779) node[right] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (0,0.25) -- (0,1.279) node[right] {$\vec{F}_v$};
\fill (0,0.25) circle (1.5pt);
\node at (0.1,-1.25) {\small $F_v = P$};
\draw[thick] (2.2,0) -- (4.4,0);
\foreach \x in {2.35,2.5,...,4.4} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (2.7,0) rectangle (3.7,0.5);
\draw[-{Stealth}, thick, red] (3.5,0.92) -- (3.5,0.5) node[pos=0, right] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (3.2,0.25) -- (3.2,-0.779) node[right] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (3.2,0.25) -- (3.2,1.699) node[left] {$\vec{F}_v$};
\fill (3.2,0.25) circle (1.5pt);
\node at (3.3,-1.25) {\small $F_v = P + F$};
\end{tikzpicture}
```
```

```ad-warning
La reazione del piano non è sempre uguale al peso
$F_v = P$ vale solo per un corpo su un piano orizzontale, senza altre forze verticali. Con una mano che spinge o un filo che tira la reazione cambia, come nell'esempio 2, e su un [piano inclinato](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-sul-piano-inclinato) è più piccola del peso. Va trovata ogni volta dalla condizione di equilibrio.
```

```ad-warning
Il peso e la reazione del piano non sono azione e reazione
Nel libro fermo il peso e la reazione del tavolo sono uguali e opposti, ma non per il terzo principio: agiscono tutti e due sul libro, e sono uguali perché il libro è in equilibrio. Le coppie del terzo principio agiscono su corpi diversi: la reazione del tavolo sul libro va in coppia con la forza del libro sul tavolo, il peso del libro con la forza con cui il libro attira la Terra.
```

### Il filo e la tensione

Un filo teso tira il corpo a cui è legato con una forza diretta lungo il filo, verso il punto a cui il filo è attaccato: la **tensione** $\vec{T}$. Nei problemi il filo è ideale: non si allunga e ha una massa trascurabile, e allora la tensione ha lo stesso modulo in tutti i punti del filo. Un filo può solo tirare: se lo spingi, si piega.

```ad-example
Esempio 3: una lampada appesa
Una lampada di $2{,}4\,\text{kg}$ è appesa al soffitto con un filo verticale. Quanto vale la tensione del filo?

Sulla lampada agiscono il peso, verso il basso, e la tensione del filo, verso l'alto. In equilibrio hanno lo stesso modulo:

$$T = P = m \cdot g = 2{,}4\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 23{,}52\,\text{N} \approx 24\,\text{N}$$

```tikz
% nome: lampada-filo-tensione
% alt: Una lampada, disegnata come una pallina, appesa al soffitto con un filo verticale; dal centro della pallina partono la tensione T verso l'alto, lungo il filo, e il peso P verso il basso, due frecce della stessa lunghezza
% svg: lampada-filo-tensione-8dc24d80.svg 72x148
\begin{tikzpicture}
\draw[thick] (0.9,2.2) -- (-0.9,2.2);
\foreach \x in {0.75,0.6,...,-0.9} \draw[thin] (\x,2.2) -- ++(0.15,0.15);
\draw (0,2.2) -- (0,0.15);
\draw[thick, fill=blue!10] (0,0) circle (0.15);
\draw[-{Stealth}, thick, red] (0,0) -- (0,1.18) node[pos=0.75, right] {$\vec{T}$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,-1.18) node[right] {$\vec{P}$};
\end{tikzpicture}
```
```

Anche una molla è un vincolo: un corpo appeso a una molla si ferma quando la forza elastica bilancia il peso, $k \cdot \Delta l = m \cdot g$, come nella lezione [La forza elastica e la legge di Hooke](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-elastica-e-la-legge-di-hooke).

## L'equilibrio per componenti

Quando le forze hanno direzioni diverse, la condizione $\vec{R} = \vec{0}$ si scrive con le componenti, come nella lezione [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore). Un vettore è nullo quando sono nulle tutte e due le sue componenti, quindi l'unica equazione tra vettori diventa due equazioni tra numeri:

$$
\begin{gathered}
R_x = F_{1x} + F_{2x} + F_{3x} + \ldots = 0 \\
R_y = F_{1y} + F_{2y} + F_{3y} + \ldots = 0
\end{gathered}
$$

Il procedimento:

1. disegna il corpo come un punto con tutte le forze che agiscono su di esso: il peso, le reazioni dei vincoli, le tensioni dei fili, le altre forze;
2. scegli gli assi, di solito $x$ orizzontale e $y$ verticale;
3. scomponi ogni forza lungo gli assi, con il seno e il coseno e con il segno giusto;
4. scrivi le due equazioni: la somma delle componenti $x$ è zero, la somma delle componenti $y$ è zero;
5. risolvi le equazioni: le incognite, al massimo due, sono le forze che non conosci.

```ad-example
Esempio 4: un filo orizzontale e uno inclinato
Una lampada che pesa $20\,\text{N}$ è appesa al soffitto con un filo che forma un angolo di $30^\circ$ con la verticale; un secondo filo, orizzontale e legato alla parete, la tiene scostata. Quanto valgono le tensioni dei due fili?

```tikz
% nome: filo-orizzontale-filo-inclinato
% alt: Una lampada, disegnata come una pallina, tenuta da un filo che sale verso destra fino al soffitto, inclinato di 30 gradi rispetto alla verticale, e da un filo orizzontale legato a una parete a sinistra. Dal centro della pallina partono il peso P verso il basso, la tensione F del filo orizzontale verso sinistra e la tensione T lungo il filo inclinato; le componenti di T, tratteggiate, sono una orizzontale lunga quanto F e una verticale lunga quanto P; scala di 1 centimetro per 17 newton circa
% svg: filo-orizzontale-filo-inclinato-e1c9a4b2.svg 168x141
\begin{tikzpicture}
\draw[thick] (2,2) -- (-0.4,2);
\foreach \x in {1.85,1.7,...,-0.4} \draw[thin] (\x,2) -- ++(0.15,0.15);
\draw[thick] (-2.2,0.9) -- (-2.2,-0.9);
\foreach \y in {0.75,0.6,...,-0.9} \draw[thin] (-2.2,\y) -- ++(-0.15,0.15);
\draw (0,0) -- (1.1547,2);
\draw (0,0) -- (-2.2,0);
\draw[dashed, thin] (0.6928,1.2) -- (0.6928,0);
\draw[dashed, thin] (0.6928,1.2) -- (0,1.2);
\draw[-{Stealth}, thick, red, dashed] (0,0) -- (0.6928,0);
\draw[-{Stealth}, thick, red, dashed] (0,0) -- (0,1.2);
\draw[thick, fill=blue!10] (0,0) circle (0.12);
\draw[-{Stealth}, thick, red] (0,0) -- (0.6928,1.2) node[right] {$\vec{T}$};
\draw[-{Stealth}, thick, red] (0,0) -- (-0.6928,0) node[above] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,-1.2) node[right] {$\vec{P}$};
\draw (0,0.6) arc[start angle=90, end angle=60, radius=0.6];
\node at (0.3,0.85) {\scriptsize $30^\circ$};
\node[below] at (0.45,0) {\scriptsize $T_x$};
\node[left] at (0,1.05) {\scriptsize $T_y$};
\end{tikzpicture}
```

Le forze sulla lampada sono tre: il peso $\vec{P}$ verso il basso, la tensione $\vec{F}$ del filo orizzontale verso sinistra, la tensione $\vec{T}$ del filo inclinato. L'angolo di $30^\circ$ ha per lato la verticale, quindi la componente verticale di $\vec{T}$ va con il coseno e quella orizzontale con il seno:

$$
\begin{gathered}
T_x = T \sin 30^\circ \qquad T_y = T \cos 30^\circ
\end{gathered}
$$

Le due equazioni dell'equilibrio sono

$$
\begin{gathered}
x:\quad T \sin 30^\circ - F = 0 \\
y:\quad T \cos 30^\circ - P = 0
\end{gathered}
$$

Dalla seconda $T = \dfrac{P}{\cos 30^\circ} = \dfrac{20\,\text{N}}{0{,}866} = 23{,}09\ldots\,\text{N} \approx 23\,\text{N}$, e dalla prima $F = T \sin 30^\circ = 23{,}09\,\text{N} \cdot 0{,}5 = 11{,}54\ldots\,\text{N} \approx 12\,\text{N}$.
```

```ad-warning
Seno e coseno scambiati
Se l'angolo è dato con la verticale, come nell'esempio 4, la componente verticale va con il coseno e quella orizzontale con il seno; se è dato con l'orizzontale, il contrario. Prima di scrivere le componenti guarda quale lato ha l'angolo: il coseno va con il cateto adiacente. Un controllo veloce: con un filo quasi verticale la tensione deve reggere quasi tutto il peso.
```

Nella scena qui sotto la lampada dell'esempio 4 è già in equilibrio, e le tensioni sono calcolate dalle due equazioni. Cambia l'angolo del filo legato al soffitto e leggi come si dividono il lavoro i due fili.

```interattivo
% nome: scena-lampada-due-fili
% alt: La lampada di 20 newton dell'esempio 4, tenuta da un filo inclinato legato al soffitto e da un filo orizzontale legato alla parete, con le frecce del peso P e delle due tensioni T e F. Un cursore cambia l'angolo del filo inclinato con la verticale, da 5 a 60 gradi; accanto sono scritti i moduli delle tre forze e le due componenti di T. A 30 gradi T vale 23,09 newton e F 11,55 newton
```

## Un corpo appeso a due fili

Un quadro, un'insegna, un lampione appeso sopra una strada sono spesso tenuti da due fili che salgono da parti opposte. Se i due fili formano lo stesso angolo $\alpha$ con l'orizzontale, per simmetria hanno la stessa tensione $T$. Le componenti orizzontali, $T\cos\alpha$ verso sinistra e $T\cos\alpha$ verso destra, si annullano da sole; le componenti verticali, $T\sin\alpha$ ciascuna, devono insieme reggere il peso:

$$2\,T \sin\alpha = P \qquad\Rightarrow\qquad T = \frac{P}{2 \sin\alpha}$$

```ad-example
Esempio 5: un'insegna appesa a due fili
Un'insegna di $5{,}0\,\text{kg}$ è appesa a due fili, che formano ciascuno un angolo di $30^\circ$ con l'orizzontale. Quanto vale la tensione di ciascun filo?

```tikz
% nome: corpo-due-fili-simmetrici
% alt: Un corpo, disegnato come una pallina, appeso a due fili che salgono verso il soffitto a sinistra e a destra, formando ciascuno un angolo alfa di 30 gradi con la retta orizzontale tratteggiata; dal centro partono il peso P verso il basso e le due tensioni T1 e T2 lungo i fili, tutte e tre della stessa lunghezza
% svg: corpo-due-fili-simmetrici-6603f417.svg 231x123
\begin{tikzpicture}
\draw[thick] (3,1.5) -- (-3,1.5);
\foreach \x in {2.85,2.7,...,-3} \draw[thin] (\x,1.5) -- ++(0.15,0.15);
\draw (0,0) -- (-2.598,1.5);
\draw (0,0) -- (2.598,1.5);
\draw[dashed, thin] (-1.8,0) -- (1.8,0);
\draw[thick, fill=blue!10] (0,0) circle (0.12);
\draw[-{Stealth}, thick, red] (0,0) -- (-1.0609,0.6125) node[above] {$\vec{T}_1$};
\draw[-{Stealth}, thick, red] (0,0) -- (1.0609,0.6125) node[above] {$\vec{T}_2$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,-1.225) node[right] {$\vec{P}$};
\draw (1.6,0) arc[start angle=0, end angle=30, radius=1.6];
\node at (1.85,0.3) {\small $\alpha$};
\draw (-1.6,0) arc[start angle=180, end angle=150, radius=1.6];
\node at (-1.85,0.3) {\small $\alpha$};
\end{tikzpicture}
```

Il peso è $P = 5{,}0\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 49\,\text{N}$, e $\sin 30^\circ = 0{,}5$:

$$T = \frac{P}{2 \sin\alpha} = \frac{49\,\text{N}}{2 \cdot 0{,}5} = 49\,\text{N}$$

Ogni filo tira con $49\,\text{N}$, quanto l'intero peso dell'insegna, anche se i fili sono due.
```

```ad-warning
Le tensioni non si sommano come numeri
Nell'esempio 5 le due tensioni valgono $49\,\text{N}$ ciascuna e il peso $49\,\text{N}$: la somma dei moduli, $98\,\text{N}$, è il doppio del peso. I fili non si dividono il peso a metà, $T = P/2$, a meno che non siano verticali. Si sommano le forze come vettori, cioè le componenti: in verticale $2 \cdot 49 \cdot \sin 30^\circ = 49\,\text{N}$, proprio il peso.
```

Se i due fili formano angoli diversi, le tensioni sono diverse e servono tutte e due le equazioni.

```ad-example
Esempio 6: due fili con angoli diversi
Un lampadario che pesa $60\,\text{N}$ è appeso a due fili: il primo forma un angolo di $30^\circ$ con l'orizzontale, il secondo un angolo di $60^\circ$. Quanto valgono le due tensioni?

```tikz
% nome: corpo-fili-trenta-sessanta
% alt: Un lampadario, disegnato come una pallina, appeso a due fili che salgono al soffitto: quello di sinistra forma 30 gradi con la retta orizzontale tratteggiata, quello di destra 60 gradi. Dal centro partono il peso P verso il basso, la tensione T1 lungo il filo di sinistra, corta, e la tensione T2 lungo il filo di destra, più lunga; scala di 1 centimetro per 33 newton circa
% svg: corpo-fili-trenta-sessanta-418633e1.svg 190x156
\begin{tikzpicture}
\draw[thick] (1.5,1.8) -- (-3.4,1.8);
\foreach \x in {1.35,1.2,...,-3.4} \draw[thin] (\x,1.8) -- ++(0.15,0.15);
\draw (0,0) -- (-3.118,1.8);
\draw (0,0) -- (1.039,1.8);
\draw[dashed, thin] (-1.6,0) -- (1.4,0);
\draw[thick, fill=blue!10] (0,0) circle (0.12);
\draw[-{Stealth}, thick, red] (0,0) -- (-0.7794,0.45) node[above] {$\vec{T}_1$};
\draw[-{Stealth}, thick, red] (0,0) -- (0.7794,1.35) node[right] {$\vec{T}_2$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,-1.8) node[right] {$\vec{P}$};
\draw (-1.3,0) arc[start angle=180, end angle=150, radius=1.3];
\node at (-1.62,0.3) {\scriptsize $30^\circ$};
\draw (0.5,0) arc[start angle=0, end angle=60, radius=0.5];
\node at (0.78,0.3) {\scriptsize $60^\circ$};
\end{tikzpicture}
```

Il primo filo tira verso sinistra e verso l'alto, il secondo verso destra e verso l'alto. Gli angoli sono dati con l'orizzontale, quindi le componenti orizzontali vanno con il coseno e quelle verticali con il seno:

$$
\begin{gathered}
x:\quad -T_1 \cos 30^\circ + T_2 \cos 60^\circ = 0 \\
y:\quad T_1 \sin 30^\circ + T_2 \sin 60^\circ - P = 0
\end{gathered}
$$

Dalla prima $T_2 = T_1 \dfrac{\cos 30^\circ}{\cos 60^\circ} = 1{,}732\,T_1$. Sostituito nella seconda:

$$0{,}5\,T_1 + 1{,}732 \cdot 0{,}866\,T_1 = 0{,}5\,T_1 + 1{,}5\,T_1 = 2\,T_1 = 60\,\text{N}$$

quindi $T_1 = 30\,\text{N}$ e $T_2 = 1{,}732 \cdot 30\,\text{N} = 51{,}96\ldots\,\text{N} \approx 52\,\text{N}$. Il filo più vicino alla verticale regge la parte più grande del peso.
```

### Il paradosso del filo teso

La formula $T = \dfrac{P}{2\sin\alpha}$ nasconde una sorpresa. Più i fili sono vicini all'orizzontale, più $\sin\alpha$ è piccolo e più la tensione diventa grande:

| Angolo con l'orizzontale | $60^\circ$ | $30^\circ$ | $10^\circ$ | $5^\circ$ | $1^\circ$ |
|---|---|---|---|---|---|
| Tensione di ogni filo | $0{,}58\,P$ | $P$ | $2{,}9\,P$ | $5{,}7\,P$ | $29\,P$ |

Un filo perfettamente orizzontale, con un peso appeso nel mezzo, dovrebbe avere una tensione infinita: per questo non c'è modo di tendere un filo per stendere così tanto che resti dritto quando ci appendi una maglietta. Il filo si abbassa sempre un po', e se è troppo teso si spezza. Per la stessa ragione i cavi dell'alta tensione non sono mai tesi del tutto, e fanno una curva tra un traliccio e l'altro.

Nella figura qui sotto i due fili hanno sempre la stessa lunghezza. Allontana le pareti, oppure trascina i punti in cui i fili sono attaccati: il corpo sale o scende, e con lui cambiano gli angoli e le tensioni.

```interattivo
% nome: corpo-due-fili-tensioni
% alt: Un corpo di 2 chilogrammi appeso a due fili della stessa lunghezza, 1,85 metri, attaccati a due pareti ai lati. Un cursore cambia la distanza tra le pareti, da 1,6 a 3,65 metri: i fili non cambiano lunghezza, quindi avvicinando le pareti il corpo scende e i fili diventano più ripidi, allontanandole il corpo sale e i fili si tendono. I due punti di attacco si trascinano in su e in giù lungo le pareti. Dal corpo partono il peso P e le tensioni dei due fili, disegnate sempre nella stessa scala; sotto sono scritti gli angoli dei fili con l'orizzontale e le tensioni, che crescono molto quando i fili sono quasi tesi; si possono mostrare le componenti delle tensioni
```

```ad-example
Esempio 7: quanto si può tendere il filo
Un filo per stendere regge al massimo una tensione di $64\,\text{N}$. Al centro si appende una borsa di $2{,}0\,\text{kg}$. Qual è l'angolo più piccolo che i due tratti del filo possono formare con l'orizzontale?

Il peso della borsa è $P = 2{,}0 \cdot 9{,}8\,\text{N} = 19{,}6\,\text{N}$. Dalla formula dei due fili, con $T = 64\,\text{N}$:

$$\sin\alpha = \frac{P}{2T} = \frac{19{,}6\,\text{N}}{128\,\text{N}} = 0{,}153\ldots \qquad\Rightarrow\qquad \alpha = \sin^{-1} 0{,}153 \approx 9^\circ$$

Se il filo è teso di più, con un angolo più piccolo di $9^\circ$, la tensione supera $64\,\text{N}$ e il filo si rompe.
```
