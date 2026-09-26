# Scomposizione con i prodotti notevoli

I [prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli) trasformano un prodotto in un polinomio: $(x+3)(x-3) = x^2 - 9$. Letti da destra a sinistra fanno il contrario, cioè trasformano un polinomio in un prodotto, e sono uno dei metodi per scomporre in fattori. Il lavoro sta nel riconoscere, dentro un polinomio come $x^2 - 9$ o $9a^2 - 12ab + 4b^2$, la forma di uno sviluppo che conosci già.

Che cosa vuol dire scomporre, che cos'è un polinomio irriducibile e come si raccoglie a fattor comune è spiegato nella lezione sul [raccoglimento totale e parziale](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale). Come in quella lezione, si scompone con coefficienti interi; gli esempi con le frazioni lo dicono.

## Differenza di quadrati

Un binomio che è la differenza tra due quadrati si scompone nel prodotto della somma per la differenza delle basi:

$$a^2 - b^2 = (a + b)(a - b)$$

Per riconoscerla guarda tre cose: i termini sono due, sono separati da un segno meno, e ognuno è il quadrato di qualcosa. Un monomio è un quadrato quando il coefficiente è un quadrato e tutti gli esponenti delle lettere sono pari: $25y^2 = (5y)^2$, $16a^4 = (4a^2)^2$, $x^6 = (x^3)^2$.

La formula si capisce anche con le aree. Da un quadrato di lato $a$ togli un quadrato di lato $b$: resta una figura a forma di L, di area $a^2 - b^2$. Se la tagli e ne sposti un pezzo, diventa un rettangolo con i lati $a + b$ e $a - b$.

```tikz
% nome: differenza-di-quadrati-con-le-aree
% alt: A sinistra un quadrato di lato a a cui manca, in un angolo, un quadrato di lato b; la parte colorata a forma di L ha area a al quadrato meno b al quadrato. A destra la stessa parte, tagliata e ricomposta, forma un rettangolo con i lati a più b e a meno b
% svg: differenza-di-quadrati-con-le-aree-53e122f3.svg 410x180
\begin{tikzpicture}
\fill[blue!20] (0,0) -- (3,0) -- (3,1.8) -- (1.8,1.8) -- (1.8,3) -- (0,3) -- cycle;
\draw (0,0) -- (3,0) -- (3,1.8) -- (1.8,1.8) -- (1.8,3) -- (0,3) -- cycle;
\draw[dashed] (1.8,1.8) -- (1.8,3) -- (3,3) -- (3,1.8);
\draw[dashed] (1.8,0) -- (1.8,1.8);
\node[below] at (1.5,0) {$a$};
\node[left] at (0,1.5) {$a$};
\node[above] at (2.4,3) {$b$};
\node[right] at (3,2.4) {$b$};
\node at (1.5,-0.9) {$a^2 - b^2$};
\draw[->, thick] (3.7,1.5) -- (4.6,1.5);
\fill[blue!20] (6.1,0.6) rectangle (10.3,2.4);
\draw (6.1,0.6) rectangle (10.3,2.4);
\draw[dashed] (9.1,0.6) -- (9.1,2.4);
\node[below] at (8.2,0.6) {$a + b$};
\node[left] at (6.1,1.5) {$a - b$};
\node at (8.2,-0.9) {$(a + b)(a - b)$};
\end{tikzpicture}
```

```ad-example
Esempio 1: coefficienti e due lettere
Scomponi $4x^2 - 25y^2$.

$4x^2 = (2x)^2$ e $25y^2 = (5y)^2$, quindi $a = 2x$ e $b = 5y$:

$$
\begin{aligned}
4x^2 - 25y^2 &= (2x)^2 - (5y)^2 \\
&= (2x + 5y)(2x - 5y)
\end{aligned}
$$
```

```ad-example
Esempio 2: una base che è un binomio
Scomponi $(x + 1)^2 - y^2$.

Qui $a = x + 1$ e $b = y$. La formula vale anche quando una base è un polinomio, purché tu la tenga tra parentesi:

$$
\begin{aligned}
&(x + 1)^2 - y^2 \\
&= \big((x + 1) + y\big)\big((x + 1) - y\big) \\
&= (x + y + 1)(x - y + 1)
\end{aligned}
$$
```

```ad-example
Esempio 3: con le frazioni
Scomponi $x^2 - \frac{1}{9}$.

Se ammetti coefficienti frazionari, $\frac{1}{9} = \left(\frac{1}{3}\right)^2$ e

$$x^2 - \frac{1}{9} = \left(x + \frac{1}{3}\right)\left(x - \frac{1}{3}\right)$$
```

```ad-warning
Differenza di quadrati e quadrato di una differenza
$a^2 - b^2$ è $(a + b)(a - b)$, non $(a - b)^2$. Per esempio $x^2 - 9 = (x + 3)(x - 3)$, mentre $(x - 3)^2 = x^2 - 6x + 9$.
```

Una somma di due quadrati non è un prodotto notevole: $x^2 + 9$ e $4a^2 + b^2$ sono irriducibili, e scrivere $x^2 + 9 = (x + 3)(x + 3)$ è sbagliato, perché $(x + 3)^2 = x^2 + 6x + 9$.

## Quadrato di un binomio

Un trinomio formato da due quadrati e dal loro doppio prodotto è il quadrato di un binomio:

$$
\begin{gathered}
a^2 + 2ab + b^2 = (a + b)^2 \\
a^2 - 2ab + b^2 = (a - b)^2
\end{gathered}
$$

Per riconoscerlo trova i due termini che sono quadrati, tutti e due con il segno più, e prendi le loro basi $a$ e $b$. Poi controlla il terzo termine: deve essere $2ab$, a meno del segno. Il segno del doppio prodotto decide il segno dentro la parentesi.

```ad-example
Esempio 4: il doppio prodotto negativo
Scomponi $9a^2 - 12ab + 4b^2$.

$9a^2 = (3a)^2$ e $4b^2 = (2b)^2$. Il doppio prodotto delle basi è $2 \cdot 3a \cdot 2b = 12ab$, e nel trinomio c'è $-12ab$:

$$9a^2 - 12ab + 4b^2 = (3a - 2b)^2$$

Anche $(2b - 3a)^2$ è giusto, perché due numeri opposti hanno lo stesso quadrato.
```

Le basi possono avere grado più alto: $x^4 + 2x^2 + 1 = (x^2)^2 + 2 \cdot x^2 \cdot 1 + 1^2 = (x^2 + 1)^2$.

```ad-example
Esempio 5: i quadrati con il segno meno
Scomponi $-x^2 + 10x - 25$.

I termini $-x^2$ e $-25$ non sono quadrati, perché sono negativi. Raccogli il segno meno:

$$
\begin{aligned}
&-x^2 + 10x - 25 \\
&= -(x^2 - 10x + 25)
\end{aligned}
$$

Dentro la parentesi $x^2 = (x)^2$, $25 = 5^2$ e $2 \cdot x \cdot 5 = 10x$, con il segno meno:

$$-x^2 + 10x - 25 = -(x - 5)^2$$
```

```ad-warning
Il doppio prodotto va controllato
$x^2 + 4x + 16$ non è $(x + 4)^2$: il doppio prodotto di $x$ e $4$ è $8x$, non $4x$. Due quadrati non sono sufficienti: se il terzo termine non è il doppio prodotto, il trinomio non è il quadrato di un binomio.
```

## Quadrato di un trinomio

Un polinomio di sei termini, formato da tre quadrati e dai tre doppi prodotti delle loro basi, è il quadrato di un trinomio:

$$
\begin{aligned}
&a^2 + b^2 + c^2 + 2ab + 2ac + 2bc \\
&= (a + b + c)^2
\end{aligned}
$$

Trova i tre termini che sono quadrati, con il segno più, e le loro basi. Poi scegli il segno di ogni base in modo che i tre doppi prodotti abbiano i segni che vedi nel polinomio.

```ad-example
Esempio 6: tutti i segni positivi
Scomponi $x^2 + 4y^2 + 1 + 4xy + 2x + 4y$.

I quadrati sono $x^2$, $4y^2 = (2y)^2$ e $1 = 1^2$, con basi $x$, $2y$ e $1$. I doppi prodotti sono $2 \cdot x \cdot 2y = 4xy$, $2 \cdot x \cdot 1 = 2x$ e $2 \cdot 2y \cdot 1 = 4y$: ci sono tutti, con il segno più.

$$
\begin{aligned}
&x^2 + 4y^2 + 1 + 4xy + 2x + 4y \\
&= (x + 2y + 1)^2
\end{aligned}
$$
```

```ad-example
Esempio 7: due doppi prodotti negativi
Scomponi $x^4 + y^2 + 4 - 2x^2y + 4x^2 - 4y$.

I quadrati sono $x^4 = (x^2)^2$, $y^2$ e $4 = 2^2$. I doppi prodotti negativi sono i due che contengono la $y$, cioè $-2x^2y$ e $-4y$, mentre $4x^2$, che non la contiene, è positivo: allora la base con il segno meno è $y$.

Controllo: $2 \cdot x^2 \cdot (-y) = -2x^2y$, $2 \cdot x^2 \cdot 2 = 4x^2$, $2 \cdot (-y) \cdot 2 = -4y$.

$$
\begin{aligned}
&x^4 + y^2 + 4 - 2x^2y + 4x^2 - 4y \\
&= (x^2 - y + 2)^2
\end{aligned}
$$
```

```ad-tip
Il controllo dei segni
Tra i tre doppi prodotti, quelli negativi sono zero oppure due. Se ne trovi uno solo, o tre, il polinomio non è il quadrato di un trinomio.
```

## Cubo di un binomio

Un polinomio di quattro termini, formato da due cubi e da due tripli prodotti, è il cubo di un binomio:

$$
\begin{gathered}
a^3 + 3a^2b + 3ab^2 + b^3 = (a + b)^3 \\
a^3 - 3a^2b + 3ab^2 - b^3 = (a - b)^3
\end{gathered}
$$

Un monomio è un cubo quando il coefficiente è un cubo (anche negativo, come $-8 = (-2)^3$) e gli esponenti delle lettere sono multipli di $3$. Trova i due cubi e le loro basi $a$ e $b$, ognuna con il segno del suo cubo (la base di $-27b^3$ è $-3b$), poi controlla i due termini rimasti: devono essere $3a^2b$ e $3ab^2$, segni compresi. Il risultato è $(a + b)^3$ con le basi che hai trovato. Quando il polinomio è ordinato, segni tutti positivi danno una somma nella parentesi, segni alterni $+ - + -$ una differenza.

```ad-example
Esempio 8: coefficienti diversi da 1
Scomponi $8a^3 - 36a^2b + 54ab^2 - 27b^3$.

$8a^3 = (2a)^3$ e $-27b^3 = (-3b)^3$: le basi sono $2a$ e $-3b$. I tripli prodotti:

$$
\begin{gathered}
3 \cdot (2a)^2 \cdot (-3b) = -36a^2b \\
3 \cdot 2a \cdot (-3b)^2 = 54ab^2
\end{gathered}
$$

Sono proprio i due termini di mezzo, con i loro segni, quindi

$$
\begin{aligned}
&8a^3 - 36a^2b + 54ab^2 - 27b^3 \\
&= (2a - 3b)^3
\end{aligned}
$$
```

```ad-example
Esempio 9: il primo termine negativo
Scomponi $-x^3 + 3x^2 - 3x + 1$.

$-x^3 = (-x)^3$ e $1 = 1^3$, quindi le basi sono $-x$ e $1$. I tripli prodotti sono $3 \cdot (-x)^2 \cdot 1 = 3x^2$ e $3 \cdot (-x) \cdot 1^2 = -3x$, come nel polinomio:

$$
\begin{aligned}
&-x^3 + 3x^2 - 3x + 1 \\
&= (-x + 1)^3 \\
&= (1 - x)^3
\end{aligned}
$$

Si può anche raccogliere il segno meno, $-(x^3 - 3x^2 + 3x - 1) = -(x - 1)^3$: è lo stesso risultato, perché $(1 - x)^3 = -(x - 1)^3$.
```

```ad-warning
Il segno fuori dal cubo
$(1 - x)^2 = (x - 1)^2$, ma $(1 - x)^3 = -(x - 1)^3$. Quando scambi i termini di una differenza, il quadrato non cambia, il cubo cambia segno.
```

## Somma e differenza di cubi

Anche un binomio fatto da due cubi si scompone, sia con il segno più sia con il segno meno:

$$a^3 + b^3 = (a + b)(a^2 - ab + b^2)$$

$$a^3 - b^3 = (a - b)(a^2 + ab + b^2)$$

Il primo fattore ha lo stesso segno del binomio. Il secondo si chiama **falso quadrato**: somiglia al quadrato di $a - b$ o di $a + b$, ma al posto del doppio prodotto $2ab$ ha il prodotto $ab$, con il segno opposto a quello del primo fattore. Le due formule si controllano moltiplicando: in $(a + b)(a^2 - ab + b^2) = a^3 - a^2b + ab^2 + a^2b - ab^2 + b^3$ i quattro termini di mezzo si cancellano e resta $a^3 + b^3$.

Il falso quadrato, nei casi che trovi negli esercizi, cioè con $a$ e $b$ monomi di primo grado come $x$ e $3y$ o numeri, è irriducibile: la scomposizione finisce lì.

```ad-example
Esempio 10: differenza di cubi
Scomponi $x^3 - 8$.

$8 = 2^3$, quindi $a = x$ e $b = 2$:

$$x^3 - 8 = (x - 2)(x^2 + 2x + 4)$$

$x^2 + 2x + 4$ non è $(x + 2)^2$, che ha $4x$ al centro: è il falso quadrato, irriducibile.
```

```ad-example
Esempio 11: somma di cubi con due lettere
Scomponi $27a^3 + b^3$.

$27a^3 = (3a)^3$, quindi $a$ diventa $3a$ e $b$ resta $b$:

$$
\begin{aligned}
&27a^3 + b^3 \\
&= (3a + b)\big((3a)^2 - 3a \cdot b + b^2\big) \\
&= (3a + b)(9a^2 - 3ab + b^2)
\end{aligned}
$$
```

```ad-warning
Il falso quadrato non è un quadrato
$x^2 + 2x + 4$ non si scrive come $(x + 2)^2$ e non si scompone come un quadrato. E la somma di cubi non è il cubo della somma: $a^3 + b^3 \neq (a + b)^3$.
```

## Come riconoscere il prodotto notevole

Il numero di termini dice quali prodotti notevoli cercare. Prima di contare, ordina il polinomio e riduci i termini simili.

| Termini | Cosa cercare | Formula |
|---|---|---|
| $2$ | differenza di quadrati | $a^2 - b^2 = (a + b)(a - b)$ |
| $2$ | somma o differenza di cubi | $a^3 \pm b^3 = (a \pm b)(a^2 \mp ab + b^2)$ |
| $3$ | quadrato di un binomio | $a^2 \pm 2ab + b^2 = (a \pm b)^2$ |
| $4$ | cubo di un binomio | $a^3 \pm 3a^2b + 3ab^2 \pm b^3 = (a \pm b)^3$ |
| $6$ | quadrato di un trinomio | $a^2 + b^2 + c^2 + 2ab + 2ac + 2bc = (a + b + c)^2$ |

Un binomio come $x^6 - 1$ è sia una differenza di quadrati sia una differenza di cubi; conviene partire dai quadrati (esempio 14). Un trinomio che non è un quadrato può scomporsi come [trinomio di secondo grado](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado), e un polinomio di quattro o sei termini che non è un cubo o un quadrato può scomporsi con un raccoglimento parziale.

## Raccogliere prima

Prima di cercare un prodotto notevole, guarda se i termini hanno un fattore comune e raccoglilo: spesso il prodotto notevole compare solo dopo. Ti accorgi che manca un raccoglimento quando i coefficienti non sono quadrati o cubi ma hanno un divisore comune, come in $3x^2 - 12$, o quando una lettera compare in tutti i termini.

$$
\begin{aligned}
3x^2 - 12 &= 3(x^2 - 4) \\
&= 3(x + 2)(x - 2)
\end{aligned}
$$

$$
\begin{aligned}
3a^3 + 24 &= 3(a^3 + 8) \\
&= 3(a + 2)(a^2 - 2a + 4)
\end{aligned}
$$

```ad-example
Esempio 12: raccoglimento e quadrato di un binomio
Scomponi $50x^3 - 20x^2 + 2x$.

$50$, $20$ e $2$ non sono quadrati, ma hanno il divisore comune $2$, e la $x$ compare in tutti i termini. Raccogli $2x$:

$$
\begin{aligned}
&50x^3 - 20x^2 + 2x \\
&= 2x(25x^2 - 10x + 1)
\end{aligned}
$$

Nella parentesi $25x^2 = (5x)^2$, $1 = 1^2$ e $2 \cdot 5x \cdot 1 = 10x$:

$$50x^3 - 20x^2 + 2x = 2x(5x - 1)^2$$
```

## Scomposizioni in più passi

Dopo ogni passo guarda i fattori che hai trovato: se uno si scompone ancora, continua. La scomposizione è finita quando ogni fattore è irriducibile. Il procedimento completo:

1. Ordina il polinomio e raccogli il fattore comune, se c'è (anche il segno meno, se il primo termine è negativo).
2. Conta i termini di quello che resta e cerca il prodotto notevole giusto.
3. Scomponi con la formula.
4. Per ogni fattore trovato, ricomincia dal passo 2.
5. Controlla il risultato moltiplicando i fattori.

```ad-example
Esempio 13: tre passi
Scomponi $2x^5 - 2x$.

Raccogli $2x$, poi scomponi $x^4 - 1$ come differenza di quadrati, con $x^4 = (x^2)^2$:

$$
\begin{aligned}
2x^5 - 2x &= 2x(x^4 - 1) \\
&= 2x(x^2 + 1)(x^2 - 1)
\end{aligned}
$$

$x^2 + 1$ è una somma di quadrati, irriducibile; $x^2 - 1$ è ancora una differenza di quadrati:

$$
\begin{aligned}
&2x^5 - 2x \\
&= 2x(x^2 + 1)(x + 1)(x - 1)
\end{aligned}
$$
```

```ad-warning
Fermarsi troppo presto
$x^4 - 16 = (x^2 + 4)(x^2 - 4)$ non è finita: $x^2 - 4 = (x + 2)(x - 2)$, quindi $x^4 - 16 = (x^2 + 4)(x + 2)(x - 2)$.
```

```ad-example
Esempio 14: quadrati o cubi
Scomponi $x^6 - 1$.

$x^6 = (x^3)^2 = (x^2)^3$, quindi è sia una differenza di quadrati sia una differenza di cubi. Parti dai quadrati:

$$x^6 - 1 = (x^3 + 1)(x^3 - 1)$$

Ogni fattore è una somma o una differenza di cubi:

$$
\begin{aligned}
&x^6 - 1 \\
&= (x + 1)(x^2 - x + 1) \\
&\quad \cdot (x - 1)(x^2 + x + 1)
\end{aligned}
$$

I due falsi quadrati sono irriducibili. Se parti dai cubi trovi $(x^2 - 1)(x^4 + x^2 + 1)$, e $x^4 + x^2 + 1$ non è un falso quadrato di primo grado: si scompone ancora, ma con un artificio che non si vede a colpo d'occhio. Per questo si comincia dalla differenza di quadrati.
```

```ad-example
Esempio 15: un quadrato nascosto in quattro termini
Scomponi $a^2 - 2ab + b^2 - c^2$.

I quattro termini non formano un cubo. I primi tre però sono un quadrato di binomio, $(a - b)^2$, e il polinomio diventa una differenza di quadrati con basi $a - b$ e $c$:

$$
\begin{aligned}
&a^2 - 2ab + b^2 - c^2 \\
&= (a - b)^2 - c^2 \\
&= (a - b + c)(a - b - c)
\end{aligned}
$$
```

```ad-example
Esempio 16: raccoglimento parziale e differenza di quadrati
Scomponi $x^3 - x^2 - x + 1$.

Raccogli a gruppi: $x^2$ dai primi due termini, $-1$ dagli ultimi due.

$$
\begin{aligned}
&x^3 - x^2 - x + 1 \\
&= x^2(x - 1) - (x - 1) \\
&= (x - 1)(x^2 - 1)
\end{aligned}
$$

$x^2 - 1 = (x + 1)(x - 1)$, e il fattore $x - 1$ compare due volte:

$$
\begin{aligned}
&x^3 - x^2 - x + 1 \\
&= (x - 1)(x + 1)(x - 1) \\
&= (x - 1)^2(x + 1)
\end{aligned}
$$
```

```ad-tip
Il controllo
Moltiplica i fattori e confronta con il polinomio di partenza. Un controllo più veloce è il valore numerico: con $x = 2$ il polinomio dell'esempio 16 vale $8 - 4 - 2 + 1 = 3$ e la scomposizione $(2 - 1)^2(2 + 1) = 3$. Se i due numeri sono diversi, c'è un errore.
```

Quando nessun prodotto notevole funziona, restano il [trinomio di secondo grado](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado) e la [regola di Ruffini](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-la-regola-di-ruffini); in fondo a quella lezione c'è l'ordine in cui provare i metodi.
