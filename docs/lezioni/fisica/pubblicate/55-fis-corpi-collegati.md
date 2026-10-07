# Corpi collegati e tensione dei fili

Un trattore che traina un rimorchio, due vagoni agganciati, un carrello da laboratorio tirato da un pesetto che pende da una carrucola: sono corpi collegati da un filo, da una fune o da un gancio, che si muovono insieme. Per ciascuno vale il [secondo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica), ma tra le forze c'è anche la tensione del filo, che non si conosce: la si trova insieme all'accelerazione, scrivendo il secondo principio per un corpo alla volta.

## Il filo ideale e la tensione

Un filo teso tira i corpi a cui è legato, ciascuno verso l'altro, lungo il filo. Il modulo di questa forza è la **tensione** $T$ del filo. Nei problemi il filo è ideale:

- **inestensibile**: non si allunga, quindi i corpi collegati percorrono gli stessi spazi negli stessi tempi, e hanno la stessa velocità e la stessa accelerazione in modulo;
- **di massa trascurabile**: allora la tensione è la stessa a tutti e due i capi, perché la forza totale su un filo senza massa deve essere zero (con $m = 0$, $F_{tot} = m\,a$ dà zero qualunque sia $a$).

Una **carrucola ideale**, leggera e senza attrito, cambia la direzione del filo senza cambiarne la tensione: il filo che passa sopra la carrucola tira con la stessa $T$ il corpo sul tavolo, in orizzontale, e il pesetto appeso, in verticale.

Nel [terzo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-terzo-principio-della-dinamica) le due forze di un filo su due corpi sembrano una coppia di azione e reazione, ma non lo sono: agiscono su due corpi diversi e sono uguali solo perché il filo è ideale. Le coppie vere sono quelle tra ciascun corpo e il filo.

## Due corpi trainati su un piano

Due carrelli, di masse $m_1$ e $m_2$, sono collegati da un filo e stanno su un piano orizzontale liscio. Una forza orizzontale $\vec{F}$ tira il primo carrello; il filo tira il secondo in avanti e il primo indietro, con la stessa tensione $T$.

```tikz
% nome: due-carrelli-trainati-forze
% alt: Due blocchi su un piano orizzontale liscio collegati da un filo: a sinistra il blocco di massa m2, a destra quello di massa m1, tirato verso destra dalla forza F. Sul blocco di sinistra la tensione T tira verso destra; sul blocco di destra la tensione T tira verso sinistra e la forza F, più lunga, verso destra. In alto l'accelerazione a, comune ai due blocchi, verso destra. Il peso e la reazione del piano, che si bilanciano, non sono disegnati
% svg: due-carrelli-trainati-forze-075697c9.svg 254x69
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (6.3,0);
\foreach \x in {-0.15,0,...,6.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0.5,0) rectangle (1.7,0.8);
\draw[thick, fill=blue!10] (3.3,0) rectangle (4.5,0.8);
\draw (1.7,0.2) -- (3.3,0.2);
\node at (1.1,1.1) {$m_2$};
\node at (3.9,1.1) {$m_1$};
\draw[-{Stealth}, thick, red] (1.1,0.4) -- (2,0.4) node[above] {$\vec{T}$};
\draw[-{Stealth}, thick, red] (3.9,0.4) -- (3,0.4) node[above] {$\vec{T}$};
\draw[-{Stealth}, thick, red] (3.9,0.4) -- (5.4,0.4) node[above] {$\vec{F}$};
\draw[-{Stealth}, thick, green!50!black] (2.1,1.35) -- (2.9,1.35) node[right] {$\vec{a}$};
\fill (1.1,0.4) circle (1.5pt);
\fill (3.9,0.4) circle (1.5pt);
\end{tikzpicture}
```

Il peso di ciascun carrello è bilanciato dalla reazione del piano, e le forze che contano sono quelle orizzontali. Con il verso positivo nel verso di $\vec{F}$, il secondo principio per ciascun carrello dice:

$$
\begin{aligned}
&\text{primo carrello:} && F - T = m_1\,a \\
&\text{secondo carrello:} && T = m_2\,a
\end{aligned}
$$

Sommando le due equazioni la tensione sparisce, e resta $F = (m_1 + m_2)\,a$:

$$a = \frac{F}{m_1 + m_2} \qquad T = m_2\,a = \frac{m_2}{m_1 + m_2}\,F$$

La prima formula ha un senso che si vede subito: la forza $F$ accelera tutti e due i carrelli, cioè una massa $m_1 + m_2$. Le tensioni sono forze tra parti dello stesso sistema, e nel sistema intero si cancellano. La seconda dice che il filo trasmette al secondo carrello solo la parte di $F$ che serve ad accelerare lui.

```ad-example
Esempio 1: due carrelli tirati da una forza
Due carrelli, di $2{,}0\,\text{kg}$ e $3{,}0\,\text{kg}$, sono collegati da un filo su un piano liscio. Il carrello di $2{,}0\,\text{kg}$ è tirato in avanti da una forza orizzontale di $15\,\text{N}$. Quanto valgono l'accelerazione e la tensione del filo?

$$a = \frac{F}{m_1 + m_2} = \frac{15\,\text{N}}{2{,}0\,\text{kg} + 3{,}0\,\text{kg}} = 3{,}0\,\text{m/s}^2$$

Il filo tira il carrello di dietro, che è quello di $3{,}0\,\text{kg}$:

$$T = m_2\,a = 3{,}0\,\text{kg} \cdot 3{,}0\,\text{m/s}^2 = 9{,}0\,\text{N}$$

Controllo con il carrello davanti: $F - T = 15\,\text{N} - 9{,}0\,\text{N} = 6{,}0\,\text{N}$, e $m_1\,a = 2{,}0 \cdot 3{,}0\,\text{N} = 6{,}0\,\text{N}$. Se la forza tirasse invece il carrello di $3{,}0\,\text{kg}$, l'accelerazione sarebbe la stessa e la tensione $2{,}0 \cdot 3{,}0 = 6{,}0\,\text{N}$.
```

```ad-warning
La tensione non è la forza che tira
Il filo non trasmette tutta la forza $F$: nell'esempio 1 la forza è $15\,\text{N}$ e la tensione $9{,}0\,\text{N}$. Sarebbero uguali solo se il primo carrello non avesse massa. E l'accelerazione non è $F/m_1$: la forza tira anche il secondo carrello, attraverso il filo.
```

## Il carrello sul tavolo e il pesetto appeso

Un carrello di massa $m_1$ sta su un tavolo orizzontale liscio; un filo lo collega, passando per una carrucola sul bordo del tavolo, a un pesetto di massa $m_2$ che pende nel vuoto. Il pesetto scende, il carrello va verso la carrucola, con accelerazioni uguali in modulo.

```tikz
% nome: carrello-tavolo-pesetto-forze
% alt: Un carrello di massa m1 su un tavolo orizzontale liscio, collegato da un filo che passa per una carrucola sul bordo del tavolo a un pesetto di massa m2 appeso. Sul carrello agisce la tensione T verso la carrucola; sul pesetto agiscono la tensione T verso l'alto e il peso m2 g verso il basso, più lungo della tensione. Le accelerazioni, verdi, sono verso destra per il carrello e verso il basso per il pesetto
% svg: carrello-tavolo-pesetto-forze-cb59c1e9.svg 255x162
\begin{tikzpicture}
\draw[thick] (-0.3,2) -- (4,2) -- (4,0);
\foreach \x in {-0.15,0,...,4} \draw[thin] (\x,2) -- ++(-0.15,-0.15);
\draw[thick] (4,2) -- (4.3,2);
\draw[thick, fill=blue!10] (1,2) rectangle (2.2,2.6);
\node at (1.6,2.9) {$m_1$};
\draw (2.2,2.3) -- (4.3,2.3);
\draw (4.6,2) -- (4.6,0.9);
\draw[thick, fill=gray!20] (4.3,2) circle (0.3); \fill (4.3,2) circle (1pt);
\draw[thick, fill=blue!10] (4.3,0.3) rectangle (4.9,0.9);
\node[right] at (4.9,0.6) {$m_2$};
\draw[-{Stealth}, thick, red] (1.6,2.3) -- (2.384,2.3) node[above] {$\vec{T}$};
\draw[-{Stealth}, thick, red] (4.6,0.6) -- (4.6,1.384) node[left] {$\vec{T}$};
\draw[-{Stealth}, thick, red] (4.6,0.6) -- (4.6,-0.38) node[left] {$m_2\vec{g}$};
\draw[-{Stealth}, thick, green!50!black] (1.2,3.3) -- (2,3.3) node[right] {$\vec{a}$};
\draw[-{Stealth}, thick, green!50!black] (5.9,1.4) -- (5.9,0.6) node[right] {$\vec{a}$};
\fill (1.6,2.3) circle (1.5pt);
\fill (4.6,0.6) circle (1.5pt);
\end{tikzpicture}
```

Qui ogni corpo ha il suo verso del moto, e conviene prendere come positivo quello: verso la carrucola per il carrello, verso il basso per il pesetto. Sul carrello la sola forza lungo il moto è la tensione; sul pesetto agiscono il peso, verso il basso, e la tensione, verso l'alto:

$$
\begin{aligned}
&\text{carrello:} && T = m_1\,a \\
&\text{pesetto:} && m_2\,g - T = m_2\,a
\end{aligned}
$$

Sommando, $m_2\,g = (m_1 + m_2)\,a$: il peso del pesetto accelera tutte e due le masse.

$$a = \frac{m_2}{m_1 + m_2}\,g \qquad T = m_1\,a = \frac{m_1\,m_2}{m_1 + m_2}\,g$$

L'accelerazione è sempre più piccola di $g$, e la tensione è sempre più piccola del peso del pesetto: se fosse uguale, il pesetto sarebbe in equilibrio e non scenderebbe accelerando.

```ad-example
Esempio 2: il carrello tirato dal pesetto
Un carrello di $4{,}0\,\text{kg}$ scorre senza attrito su un tavolo, collegato come in figura a un pesetto di $1{,}0\,\text{kg}$. Quanto valgono l'accelerazione e la tensione del filo?

$$a = \frac{m_2}{m_1 + m_2}\,g = \frac{1{,}0\,\text{kg}}{5{,}0\,\text{kg}} \cdot 9{,}8\,\text{m/s}^2 = 1{,}96\,\text{m/s}^2 \approx 2{,}0\,\text{m/s}^2$$

$$T = m_1\,a = 4{,}0\,\text{kg} \cdot 1{,}96\,\text{m/s}^2 = 7{,}84\,\text{N} \approx 7{,}8\,\text{N}$$

Il pesetto pesa $9{,}8\,\text{N}$, ma il filo lo tira in su con $7{,}8\,\text{N}$: la differenza, $2{,}0\,\text{N}$, è la forza totale che lo accelera, $m_2\,a = 1{,}0 \cdot 1{,}96\,\text{N}$.
```

```ad-warning
La tensione uguale al peso appeso
Scrivere $T = m_2\,g$ è l'errore più comune: vale solo se il pesetto è fermo o si muove a velocità costante. Quando il pesetto accelera verso il basso, il filo lo tira meno del suo peso. Nell'esempio 2 lo sbaglio darebbe al carrello un'accelerazione di $9{,}8 / 4{,}0 = 2{,}45\,\text{m/s}^2$, come se il pesetto non avesse massa da accelerare.
```

### Con l'attrito sul tavolo

Se tra carrello e tavolo c'è attrito, sul carrello che si muove agisce anche l'[attrito dinamico](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito) $\mu_d\,m_1\,g$, opposto al moto. L'equazione del carrello diventa $T - \mu_d\,m_1\,g = m_1\,a$, e sommando con quella del pesetto:

$$a = \frac{m_2 - \mu_d\,m_1}{m_1 + m_2}\,g$$

Prima però bisogna chiedersi se il sistema parte: da fermo, l'attrito statico sul blocco può arrivare a $\mu_s\,m_1\,g$, e il pesetto lo trascina solo se il suo peso è più grande, $m_2 > \mu_s\,m_1$.

```ad-example
Esempio 3: il blocco con l'attrito
Un blocco di $4{,}0\,\text{kg}$ sta su un tavolo, con $\mu_s = 0{,}35$ e $\mu_d = 0{,}25$, ed è collegato attraverso la carrucola a un pesetto di $2{,}0\,\text{kg}$. Il sistema parte? Con quale accelerazione? Quanto vale la tensione?

Il peso del pesetto, $2{,}0 \cdot 9{,}8 = 19{,}6\,\text{N}$, supera l'attrito statico massimo, $0{,}35 \cdot 4{,}0 \cdot 9{,}8 = 13{,}7\,\text{N}$: il sistema parte.

$$a = \frac{m_2 - \mu_d\,m_1}{m_1 + m_2}\,g = \frac{2{,}0 - 0{,}25 \cdot 4{,}0}{6{,}0} \cdot 9{,}8\,\text{m/s}^2 = 1{,}633\ldots\,\text{m/s}^2 \approx 1{,}6\,\text{m/s}^2$$

La tensione si trova più in fretta dal pesetto, dove non c'è attrito:

$$T = m_2\,(g - a) = 2{,}0\,\text{kg} \cdot (9{,}8 - 1{,}633)\,\text{m/s}^2 = 16{,}33\ldots\,\text{N} \approx 16\,\text{N}$$

Controllo con il blocco: $T - \mu_d\,m_1\,g = 16{,}33 - 9{,}8 = 6{,}53\,\text{N}$, e $m_1\,a = 4{,}0 \cdot 1{,}633 = 6{,}53\,\text{N}$.
```

La scena qui sotto è il blocco dell'esempio 3, con il suo pesetto. Avviala, poi scegli un corpo per leggere le forze che agiscono su di lui: la tensione è la stessa ai due capi del filo. Senza attrito e con un pesetto di $1{,}0\,\text{kg}$ ritrovi i numeri dell'esempio 2.

```interattivo
% nome: scena-carrello-pesetto
% alt: Un blocco di 4 chilogrammi su un tavolo, legato con un filo che passa per una carrucola sul bordo a un pesetto appeso, con le frecce delle forze su tutti e due. Un cursore cambia la massa del pesetto da 0,5 a 3 chilogrammi e un selettore toglie o mette l'attrito sul tavolo. Avviando la scena il pesetto scende e il blocco va verso la carrucola; accanto ci sono le forze sul corpo scelto, l'accelerazione e il grafico della velocità del blocco nel tempo. Con l'attrito e un pesetto di 2 chilogrammi l'accelerazione è 1,63 metri al secondo quadrato e la tensione 16,33 newton; sotto 1,4 chilogrammi il sistema non parte
```

## La macchina di Atwood

La **macchina di Atwood** è una carrucola appesa al soffitto, con un filo che porta due masse $m_1$ e $m_2$, una per parte. George Atwood la descrisse nel 1784 per studiare la caduta dei corpi rallentata: la massa più pesante scende, l'altra sale, e l'accelerazione è piccola quando le masse sono quasi uguali.

```tikz
% nome: macchina-atwood-forze
% alt: Una carrucola appesa al soffitto con un filo che porta due blocchi: a sinistra quello di massa m1, più leggero, a destra quello di massa m2, più pesante. Su ciascun blocco agiscono la tensione T verso l'alto, uguale per i due, e il peso verso il basso: sul blocco di sinistra il peso è più corto della tensione, su quello di destra più lungo. Le accelerazioni, verdi, sono verso l'alto per il blocco di sinistra e verso il basso per quello di destra
% svg: macchina-atwood-forze-972089d7.svg 129x198
\begin{tikzpicture}
\draw[thick] (3,4.6) -- (1,4.6);
\foreach \x in {1.15,1.3,...,3} \draw[thin] (\x,4.6) -- ++(-0.15,0.15);
\draw[thick] (2,4.6) -- (2,4);
\draw[thick, fill=gray!20] (2,4) circle (0.4); \fill (2,4) circle (1pt);
\draw (1.6,4) -- (1.6,2.3);
\draw (2.4,4) -- (2.4,1.5);
\draw[thick, fill=blue!10] (1.35,1.8) rectangle (1.85,2.3);
\draw[thick, fill=blue!10] (2.15,0.9) rectangle (2.65,1.5);
\node[left] at (1.3,2.05) {$m_1$};
\node[right] at (2.7,1.2) {$m_2$};
\draw[-{Stealth}, thick, red] (1.6,2.05) -- (1.6,2.965) node[left] {$\vec{T}$};
\draw[-{Stealth}, thick, red] (1.6,2.05) -- (1.6,1.227) node[below] {$m_1\vec{g}$};
\draw[-{Stealth}, thick, red] (2.4,1.2) -- (2.4,2.115) node[right] {$\vec{T}$};
\draw[-{Stealth}, thick, red] (2.4,1.2) -- (2.4,0.171) node[below] {$m_2\vec{g}$};
\draw[-{Stealth}, thick, green!50!black] (0.6,2.7) -- (0.6,3.3) node[above] {$\vec{a}$};
\draw[-{Stealth}, thick, green!50!black] (3.5,2.7) -- (3.5,2.1) node[below] {$\vec{a}$};
\fill (1.6,2.05) circle (1.5pt);
\fill (2.4,1.2) circle (1.5pt);
\end{tikzpicture}
```

Con $m_2 > m_1$, il verso positivo è verso il basso per $m_2$ e verso l'alto per $m_1$:

$$
\begin{aligned}
&\text{massa che scende:} && m_2\,g - T = m_2\,a \\
&\text{massa che sale:} && T - m_1\,g = m_1\,a
\end{aligned}
$$

Sommando, $(m_2 - m_1)\,g = (m_1 + m_2)\,a$, e dalla seconda $T = m_1\,(g + a)$:

$$a = \frac{m_2 - m_1}{m_1 + m_2}\,g \qquad T = \frac{2\,m_1\,m_2}{m_1 + m_2}\,g$$

La tensione sta tra i due pesi: più del peso della massa che sale, che deve essere accelerata verso l'alto, e meno del peso di quella che scende. Con le masse uguali l'accelerazione è zero, e il sistema resta fermo o si muove a velocità costante, con la tensione uguale a ciascuno dei due pesi.

```ad-example
Esempio 4: la macchina di Atwood
Una macchina di Atwood porta due masse di $1{,}2\,\text{kg}$ e $1{,}5\,\text{kg}$, lasciate libere da ferme. Quanto valgono l'accelerazione e la tensione? Quanto tempo impiega la massa più pesante a scendere di $50\,\text{cm}$?

$$a = \frac{m_2 - m_1}{m_1 + m_2}\,g = \frac{1{,}5 - 1{,}2}{2{,}7} \cdot 9{,}8\,\text{m/s}^2 = 1{,}088\ldots\,\text{m/s}^2 \approx 1{,}1\,\text{m/s}^2$$

$$T = \frac{2\,m_1\,m_2}{m_1 + m_2}\,g = \frac{2 \cdot 1{,}2 \cdot 1{,}5}{2{,}7} \cdot 9{,}8\,\text{N} = 13{,}06\ldots\,\text{N} \approx 13\,\text{N}$$

La tensione sta tra i pesi, $11{,}8\,\text{N}$ e $14{,}7\,\text{N}$. Partendo da ferma, la massa scende di $s = 0{,}50\,\text{m}$ nel tempo

$$t = \sqrt{\frac{2\,s}{a}} = \sqrt{\frac{2 \cdot 0{,}50\,\text{m}}{1{,}089\,\text{m/s}^2}} = 0{,}958\ldots\,\text{s} \approx 0{,}96\,\text{s}$$

In caduta libera le sarebbero bastati $0{,}32\,\text{s}$.
```

Nella figura qui sotto cambi le due masse e lasci andare il sistema: guardi quale massa scende, come l'accelerazione cresce con la differenza tra le masse, e come la tensione resta sempre tra i due pesi.

```interattivo
% nome: macchina-atwood-masse
% alt: Una macchina di Atwood con due cursori per le masse, da 0,1 a 2 chilogrammi. Su ogni massa sono disegnati il peso e la tensione del filo, in scala; un bottone lascia andare il sistema, e la massa più pesante scende mentre l'altra sale, con le posizioni calcolate dall'accelerazione. Sotto la figura sono scritti l'accelerazione, la tensione e i due pesi
```

## Il metodo in breve

1. Si disegna il [diagramma delle forze](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-diagramma-delle-forze) di ogni corpo, con la tensione del filo su tutti e due.
2. Per ogni corpo si prende come positivo il verso in cui si muove, così tutte le accelerazioni hanno lo stesso segno e lo stesso modulo $a$.
3. Si scrive $F_{tot} = m\,a$ per ogni corpo, lungo la direzione del suo moto.
4. Si sommano le equazioni: le tensioni si cancellano e resta l'accelerazione.
5. Si ricava la tensione da una delle equazioni, e si controlla con l'altra.

```ad-tip
Il sistema come un corpo solo
Per l'accelerazione basta guardare il sistema intero: la forza che lo fa muovere (la forza che tira, il peso del pesetto, la differenza dei pesi, meno l'attrito) divisa per la massa totale. Le tensioni sono forze interne e non contano. Per la tensione, invece, bisogna isolare un corpo.
```
