# Trinomio di secondo grado

Se moltiplichi $(x + 2)(x + 3)$ ottieni $x^2 + 5x + 6$. Scomporre il trinomio vuol dire fare il cammino al contrario: partire da $x^2 + 5x + 6$ e ritrovare i due fattori $(x + 2)$ e $(x + 3)$. Per molti trinomi di secondo grado c'è un modo veloce per farlo, che si basa su due numeri: uno dà la somma, l'altro il prodotto.

Serve saper raccogliere a fattor comune e a gruppi, perché è il primo passo in molti esercizi e il cuore del metodo per i trinomi con il primo coefficiente diverso da $1$: se ti serve un ripasso, c'è la lezione sul [raccoglimento totale e parziale](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale). Come in tutto il capitolo, la scomposizione si fa con coefficienti interi.

## Il trinomio $x^2 + sx + p$

Un **trinomio di secondo grado** in $x$ è un polinomio della forma $ax^2 + bx + c$, con $a \neq 0$. Cominciamo dal caso in cui $a = 1$, cioè dai trinomi come $x^2 + 5x + 6$ o $x^2 - x - 20$. Si scrivono in generale

$$x^2 + sx + p$$

con la lettera $s$ per il coefficiente di $x$ e la lettera $p$ per il termine noto: tra poco si vede perché proprio queste.

### Da dove viene la regola

Moltiplica due binomi $(x + m)(x + n)$, dove $m$ e $n$ sono due numeri:

$$
\begin{aligned}
&(x + m)(x + n) \\
&= x^2 + nx + mx + mn \\
&= x^2 + (m + n)x + mn
\end{aligned}
$$

Il coefficiente di $x$ è la somma dei due numeri, il termine noto è il loro prodotto. Leggendo l'uguaglianza da destra a sinistra si ottiene la regola: se trovi due numeri $m$ e $n$ con somma $s$ e prodotto $p$, allora

$$x^2 + sx + p = (x + m)(x + n)$$

La figura mostra il caso $(x + 2)(x + 3)$ come area di un rettangolo di lati $x + 3$ e $x + 2$: dentro ci sono un quadrato $x^2$, due rettangoli $3x$ e $2x$ (insieme fanno $5x$, e $5 = 2 + 3$) e sei quadratini di lato $1$ ($6 = 2 \cdot 3$).

```tikz
% nome: trinomio-area-rettangolo
% alt: Rettangolo di lati x più 3 e x più 2 diviso in un quadrato x quadro, un rettangolo 3x, un rettangolo 2x e sei quadratini di lato 1, per un totale di x quadro più 5x più 6
% svg: trinomio-area-rettangolo-081088aa.svg 181x159
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (4.2,3.6);
\draw (2.4,0) -- (2.4,3.6);
\draw (0,2.4) -- (4.2,2.4);
\draw (3.0,2.4) -- (3.0,3.6);
\draw (3.6,2.4) -- (3.6,3.6);
\draw (2.4,3.0) -- (4.2,3.0);
\node at (1.2,1.2) {$x^2$};
\node at (3.3,1.2) {$3x$};
\node at (1.2,3.0) {$2x$};
\node[below, text height=1.5ex] at (1.2,-0.05) {$x$};
\node[below, text height=1.5ex] at (3.3,-0.05) {$3$};
\node[left] at (-0.05,1.2) {$x$};
\node[left] at (-0.05,3.0) {$2$};
\end{tikzpicture}
```

### Come trovare i due numeri

I due numeri si cercano tra le coppie di interi che danno per prodotto $p$, controllando per ognuna la somma. Il segno di $p$ e quello di $s$ dicono subito che segni devono avere:

| Termine noto $p$ | Coefficiente $s$ | I due numeri |
|---|---|---|
| positivo | positivo | tutti e due positivi |
| positivo | negativo | tutti e due negativi |
| negativo | positivo o negativo | di segno opposto: quello con il valore assoluto maggiore ha il segno di $s$ |

Il motivo è la regola dei segni: il prodotto è positivo solo se i due numeri hanno lo stesso segno, e in quel caso anche la somma ha quel segno.

1. Guarda i segni di $p$ e di $s$ e decidi, con la tabella, i segni dei due numeri.
2. Scrivi le coppie di numeri che moltiplicati danno $|p|$, partendo da $1 \cdot |p|$.
3. Dai alle coppie i segni del passo 1 e cerca quella con somma $s$.
4. Scrivi $(x + m)(x + n)$, con i segni dei due numeri dentro le parentesi.
5. Controlla moltiplicando, o almeno controllando che $m + n = s$ e $m \cdot n = p$.

```ad-example
Esempio 1: due numeri positivi
Scomponi $x^2 + 7x + 12$.

$p = 12$ e $s = 7$ sono positivi, quindi i due numeri sono tutti e due positivi. Le coppie con prodotto $12$ sono $1$ e $12$ (somma $13$), $2$ e $6$ (somma $8$), $3$ e $4$ (somma $7$). La coppia giusta è $3$ e $4$:

$$x^2 + 7x + 12 = (x + 3)(x + 4)$$
```

```ad-example
Esempio 2: due numeri negativi
Scomponi $x^2 - 9x + 14$.

$p = 14$ è positivo e $s = -9$ è negativo, quindi i due numeri sono negativi. Le coppie sono $-1$ e $-14$ (somma $-15$) e $-2$ e $-7$ (somma $-9$):

$$x^2 - 9x + 14 = (x - 2)(x - 7)$$

Controllo: $(-2) + (-7) = -9$ e $(-2) \cdot (-7) = 14$.
```

```ad-example
Esempio 3: termine noto negativo
Scomponi $x^2 + 2x - 15$.

$p = -15$ è negativo, quindi i due numeri hanno segno opposto, e quello con il valore assoluto maggiore è positivo come $s = 2$. Le coppie con prodotto $15$ sono $1$ e $15$, $3$ e $5$; con i segni diventano $-1$ e $15$ (somma $14$), $-3$ e $5$ (somma $2$):

$$x^2 + 2x - 15 = (x - 3)(x + 5)$$
```

```ad-warning
Sbagliare il segno del numero più grande
Per $x^2 - x - 20$ i due numeri sono $-5$ e $4$, perché la somma deve essere $-1$: quindi $x^2 - x - 20 = (x - 5)(x + 4)$. Scrivere $(x + 5)(x - 4)$ è sbagliato: moltiplicando si ottiene $x^2 + x - 20$. Con $p$ negativo, il numero con il valore assoluto maggiore prende il segno di $s$.
```

```ad-tip
Controllo con un numero
Dai a $x$ un valore comodo, per esempio $x = 1$, e calcola il trinomio e il prodotto. Nell'esempio 3: $1 + 2 - 15 = -12$ e $(1 - 3)(1 + 5) = -2 \cdot 6 = -12$. Se i due risultati sono diversi c'è un errore; se sono uguali, la scomposizione quasi certamente è giusta.
```

### Prima raccogli, poi scomponi

Spesso il trinomio compare dopo un raccoglimento a fattor comune, oppure con $-x^2$ al primo posto. In entrambi i casi prima si raccoglie (un fattore comune, o il segno meno), poi si scompone il trinomio che resta tra parentesi.

```ad-example
Esempio 4: raccoglimento a fattor comune
Scomponi $2x^3 - 4x^2 - 30x$.

I tre termini hanno in comune $2x$:

$$
\begin{aligned}
&2x^3 - 4x^2 - 30x \\
&= 2x(x^2 - 2x - 15)
\end{aligned}
$$

Nella parentesi $p = -15$ e $s = -2$: i due numeri hanno segno opposto e quello più grande in valore assoluto è negativo. La coppia è $-5$ e $3$, con somma $-2$:

$$
\begin{aligned}
&2x^3 - 4x^2 - 30x \\
&= 2x(x - 5)(x + 3)
\end{aligned}
$$
```

```ad-example
Esempio 5: il primo termine è negativo
Scomponi $-x^2 + x + 6$.

Raccogli il segno meno, cambiando il segno di tutti i termini nella parentesi:

$$-x^2 + x + 6 = -(x^2 - x - 6)$$

Per $x^2 - x - 6$ servono due numeri con somma $-1$ e prodotto $-6$: sono $-3$ e $2$.

$$-x^2 + x + 6 = -(x - 3)(x + 2)$$
```

### Quando il trinomio non si scompone

Se nessuna coppia di interi ha prodotto $p$ e somma $s$, il trinomio $x^2 + sx + p$ non si può scrivere come prodotto di due fattori di primo grado con coefficienti interi: è irriducibile. Le coppie da provare sono poche, perché i divisori di $p$ sono finiti, quindi si può esserne sicuri dopo averle provate tutte.

```ad-example
Esempio 6: un trinomio irriducibile
Scomponi, se possibile, $x^2 + 4x + 2$.

$p = 2$ e $s = 4$ sono positivi, quindi i due numeri sarebbero positivi. L'unica coppia di interi positivi con prodotto $2$ è $1$ e $2$, che ha somma $3$, non $4$. Il trinomio $x^2 + 4x + 2$ è irriducibile.
```

Allo stesso modo sono irriducibili $x^2 + x + 1$ (le coppie con prodotto $1$ sono $1$ e $1$, $-1$ e $-1$, con somma $2$ e $-2$) e anche il binomio $x^2 + 4$, che puoi vedere come $x^2 + 0x + 4$: le coppie con prodotto $4$ e segni uguali hanno somma $5$, $4$, $-5$ o $-4$, mai $0$.

```ad-note
Numeri non interi
Alcuni trinomi irriducibili con i coefficienti interi si scompongono se si ammettono numeri irrazionali: per esempio $x^2 + 4x + 2$. I due numeri si trovano con la formula delle [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado), che si studia al secondo anno.
```

```ad-tip
Quando i due numeri sono uguali
Per $x^2 - 6x + 9$ i due numeri sono $-3$ e $-3$, e il risultato è $(x - 3)(x - 3) = (x - 3)^2$. È il quadrato di un binomio, che si riconosce anche con i [prodotti notevoli](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli): i due metodi danno lo stesso risultato.
```

## Il trinomio $ax^2 + bx + c$ con $a$ diverso da 1

Quando il coefficiente di $x^2$ non è $1$, come in $2x^2 + 7x + 3$, i due numeri si cercano in un altro modo e poi si usa il raccoglimento parziale. Prima di tutto, però, raccogli un eventuale fattore comune: in $4x^2 + 14x + 6 = 2(2x^2 + 7x + 3)$ i numeri da cercare diventano più piccoli.

Il procedimento:

1. Calcola il prodotto $a \cdot c$ del primo coefficiente per il termine noto.
2. Cerca due numeri interi $m$ e $n$ con somma $b$ e prodotto $a \cdot c$, con la stessa tabella dei segni di prima.
3. Spezza il termine di primo grado: scrivi $bx$ come $mx + nx$.
4. Raccogli a gruppi: un fattore comune dai primi due termini, uno dagli ultimi due.
5. Raccogli il binomio che compare in entrambi i gruppi.

Se al passo 2 nessuna coppia funziona, il trinomio non si scompone in fattori di primo grado con coefficienti interi.

```ad-example
Esempio 7: coefficienti positivi
Scomponi $2x^2 + 7x + 3$.

$a \cdot c = 2 \cdot 3 = 6$ e $b = 7$. Due numeri positivi con prodotto $6$ e somma $7$: $1$ e $6$. Spezza $7x$ in $x + 6x$:

$$2x^2 + 7x + 3 = 2x^2 + x + 6x + 3$$

Dai primi due termini raccogli $x$, dagli ultimi due $3$:

$$= x(2x + 1) + 3(2x + 1)$$

Il binomio $(2x + 1)$ compare in entrambi i gruppi:

$$= (2x + 1)(x + 3)$$
```

```ad-warning
Usare i due numeri come nel caso a = 1
Per $2x^2 + 7x + 3$ i numeri $1$ e $6$ non danno $(x + 1)(x + 6)$: quel prodotto vale $x^2 + 7x + 6$, un altro trinomio. Quando $a \neq 1$ i due numeri servono a spezzare il termine $7x$, e i fattori si trovano solo dopo il raccoglimento parziale.
```

```ad-tip
L'ordine dei due numeri non conta
Nell'esempio 7 puoi spezzare anche $7x$ in $6x + x$: $2x^2 + 6x + x + 3 = 2x(x + 3) + (x + 3) = (x + 3)(2x + 1)$. Il risultato è lo stesso, con i fattori in un altro ordine.
```

Il metodo funziona per questo motivo. Se il trinomio si scompone in $(px + q)(rx + t)$, sviluppando si ottiene

$$
\begin{aligned}
&(px + q)(rx + t) \\
&= pr\,x^2 + pt\,x + qr\,x + qt
\end{aligned}
$$

quindi $a = pr$, $c = qt$ e il termine di primo grado è già spezzato in due parti, $pt\,x$ e $qr\,x$. I due numeri $pt$ e $qr$ hanno somma $b$ e prodotto $pt \cdot qr = pr \cdot qt = a \cdot c$: sono proprio quelli che cerchi al passo 2, e il raccoglimento parziale riporta ai due fattori.

```ad-example
Esempio 8: termine noto negativo
Scomponi $6x^2 - x - 2$.

$a \cdot c = 6 \cdot (-2) = -12$ e $b = -1$. Il prodotto è negativo, quindi i due numeri hanno segno opposto e quello più grande in valore assoluto è negativo, come $b$. Tra le coppie $1$ e $12$, $2$ e $6$, $3$ e $4$ la somma $-1$ viene solo con $3$ e $-4$:

$$
\begin{aligned}
&6x^2 - x - 2 \\
&= 6x^2 + 3x - 4x - 2 \\
&= 3x(2x + 1) - 2(2x + 1) \\
&= (2x + 1)(3x - 2)
\end{aligned}
$$
```

```ad-warning
Il segno nel secondo gruppo
In $-4x - 2$ si raccoglie $-2$, e dentro la parentesi i segni cambiano: $-4x - 2 = -2(2x + 1)$. Scrivere $-2(2x - 2)$ o $-2(2x - 1)$ è un errore, e ce ne si accorge perché il binomio non è più uguale a quello del primo gruppo. Se i due binomi non vengono uguali, controlla i segni prima di cambiare numeri.
```

```ad-example
Esempio 9: primo coefficiente negativo
Scomponi $-3x^2 + 5x + 2$.

Raccogli il segno meno: $-3x^2 + 5x + 2 = -(3x^2 - 5x - 2)$.

Per $3x^2 - 5x - 2$: $a \cdot c = 3 \cdot (-2) = -6$ e $b = -5$. I due numeri sono $-6$ e $1$:

$$
\begin{aligned}
&3x^2 - 5x - 2 \\
&= 3x^2 - 6x + x - 2 \\
&= 3x(x - 2) + 1 \cdot (x - 2) \\
&= (x - 2)(3x + 1)
\end{aligned}
$$

Quindi $-3x^2 + 5x + 2 = -(x - 2)(3x + 1)$.
```

Nell'esempio 9 il secondo gruppo è $x - 2$: non c'è niente da raccogliere, e si scrive $1 \cdot (x - 2)$ per vedere bene il fattore $1$ che finisce nel binomio $(3x + 1)$.

## Trinomi in due lettere

Un trinomio come $x^2 + 5xy + 6y^2$ è di secondo grado rispetto a $x$, e anche rispetto a $y$. Se pensi $y$ come un numero fisso, è un trinomio $x^2 + sx + p$ con $s = 5y$ e $p = 6y^2$: i due "numeri" da cercare sono monomi in $y$, della forma $my$ e $ny$, con $m + n = 5$ e $m \cdot n = 6$. In pratica si lavora sui coefficienti come prima e poi si aggiunge la $y$.

```ad-example
Esempio 10: primo coefficiente 1
Scomponi $x^2 + 5xy + 6y^2$.

Servono due numeri con somma $5$ e prodotto $6$: $2$ e $3$. I due termini sono $2y$ e $3y$:

$$
\begin{aligned}
&x^2 + 5xy + 6y^2 \\
&= (x + 2y)(x + 3y)
\end{aligned}
$$

Controllo: $(x + 2y)(x + 3y) = x^2 + 3xy + 2xy + 6y^2 = x^2 + 5xy + 6y^2$.
```

```ad-example
Esempio 11: primo coefficiente diverso da 1
Scomponi $3x^2 - 7xy + 2y^2$.

I coefficienti sono $a = 3$, $b = -7$, $c = 2$, quindi $a \cdot c = 6$. Due numeri negativi con somma $-7$ e prodotto $6$: $-1$ e $-6$. Spezza $-7xy$ in $-xy - 6xy$:

$$
\begin{aligned}
&3x^2 - 7xy + 2y^2 \\
&= 3x^2 - xy - 6xy + 2y^2 \\
&= x(3x - y) - 2y(3x - y) \\
&= (3x - y)(x - 2y)
\end{aligned}
$$
```

```ad-warning
Dimenticare la seconda lettera
$x^2 + 5xy + 6y^2$ non è $(x + 2)(x + 3)$: quel prodotto non contiene nessuna $y$. Ogni termine numerico dei fattori deve portarsi dietro la $y$, perché il termine noto $6y^2$ deve venire dal prodotto $2y \cdot 3y$.
```

Il ruolo della $x$ può averlo anche un monomio. In $x^2y^2 - 3xy - 10$ il primo termine è $(xy)^2$: con $xy$ al posto della $x$ i due numeri sono $-5$ e $2$, e $x^2y^2 - 3xy - 10 = (xy - 5)(xy + 2)$.

## Trinomi del tipo $x^4 + sx^2 + p$

In un trinomio come $x^4 - 5x^2 + 4$ l'esponente del primo termine è il doppio di quello del secondo, perché $x^4 = (x^2)^2$. Se al posto di $x$ metti $x^2$, il metodo resta lo stesso: cerchi due numeri $m$ e $n$ con somma $s$ e prodotto $p$, e

$$x^4 + sx^2 + p = (x^2 + m)(x^2 + n)$$

I fattori che ottieni sono di secondo grado, e spesso si scompongono ancora, per esempio come differenza di quadrati: la scomposizione è finita solo quando nessun fattore si può più scomporre.

```ad-example
Esempio 12: i fattori si scompongono ancora
Scomponi $x^4 - 5x^2 + 4$.

Due numeri con somma $-5$ e prodotto $4$: $-1$ e $-4$.

$$x^4 - 5x^2 + 4 = (x^2 - 1)(x^2 - 4)$$

Tutti e due i fattori sono differenze di quadrati: $x^2 - 1 = (x - 1)(x + 1)$ e $x^2 - 4 = (x - 2)(x + 2)$.

$$
\begin{aligned}
&x^4 - 5x^2 + 4 \\
&= (x - 1)(x + 1)(x - 2)(x + 2)
\end{aligned}
$$
```

```ad-warning
Fermarsi troppo presto
$(x^2 - 1)(x^2 - 4)$ è un prodotto giusto, ma non è la scomposizione completa di $x^4 - 5x^2 + 4$: dopo il trinomio, controlla sempre se i fattori si scompongono ancora.
```

```ad-example
Esempio 13: un fattore irriducibile
Scomponi $x^4 + x^2 - 12$.

Due numeri con somma $1$ e prodotto $-12$: $4$ e $-3$.

$$x^4 + x^2 - 12 = (x^2 + 4)(x^2 - 3)$$

$x^2 + 4$ è irriducibile, come si è visto sopra. Anche $x^2 - 3$ lo è: servirebbero due interi con somma $0$ e prodotto $-3$, e le coppie $1$ e $-3$, $-1$ e $3$ hanno somma $-2$ e $2$. La scomposizione è finita.
```

Lo stesso ragionamento vale con altri esponenti, purché il primo sia il doppio del secondo: $x^6 - 7x^3 - 8$ è un trinomio in $x^3$, perché $x^6 = (x^3)^2$.

```ad-example
Esempio 14: un trinomio in x³
Scomponi $x^6 - 7x^3 - 8$.

Due numeri con somma $-7$ e prodotto $-8$: $-8$ e $1$.

$$x^6 - 7x^3 - 8 = (x^3 - 8)(x^3 + 1)$$

Il primo fattore è una differenza di cubi e il secondo una somma di cubi, che si scompongono con i [prodotti notevoli](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli):

$$
\begin{gathered}
x^3 - 8 = (x - 2)(x^2 + 2x + 4) \\
x^3 + 1 = (x + 1)(x^2 - x + 1)
\end{gathered}
$$

I due trinomi $x^2 + 2x + 4$ e $x^2 - x + 1$ sono irriducibili: nessuna coppia di interi con prodotto $4$ ha somma $2$, e nessuna con prodotto $1$ ha somma $-1$.

$$
\begin{aligned}
&x^6 - 7x^3 - 8 \\
&= (x - 2)(x^2 + 2x + 4) \\
&\quad \cdot (x + 1)(x^2 - x + 1)
\end{aligned}
$$
```

Quando un polinomio non è un trinomio di questi tipi, o il metodo non trova i due numeri, può servire la [scomposizione con la regola di Ruffini](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-la-regola-di-ruffini), dove trovi anche in che ordine provare i diversi metodi.
