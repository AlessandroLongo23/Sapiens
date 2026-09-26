# Frazioni algebriche e condizioni di esistenza

Per $x = 5$ l'espressione $\dfrac{3}{x - 2}$ vale $\dfrac{3}{3} = 1$, per $x = 0$ vale $-\dfrac{3}{2}$, ma per $x = 2$ non vale niente: il denominatore diventa $0$, e per zero non si divide. Le frazioni con le lettere al denominatore si chiamano frazioni algebriche, e prima di fare qualunque conto con una di esse si scrive per quali valori delle lettere ha senso. Quei valori si trovano scomponendo il denominatore in fattori, con i metodi del capitolo sulla [scomposizione](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale).

## La frazione algebrica

Una **frazione algebrica** è il quoziente di due polinomi $A$ e $B$, scritto $\dfrac{A}{B}$, con $B$ diverso dal polinomio nullo. Come nelle [frazioni numeriche](/materiale/scuola-superiore/matematica/numeri-razionali/frazioni-e-numeri-razionali), $A$ è il numeratore e $B$ il denominatore. Sono frazioni algebriche, per esempio,

$$\frac{x + 1}{x - 3} \qquad \frac{5}{x} \qquad \frac{2a}{a^2 - b^2}$$

Si parla di frazione algebrica quando il denominatore contiene almeno una lettera. Se il denominatore è un numero, l'espressione è un polinomio con i coefficienti frazionari, per esempio $\dfrac{x + 1}{3} = \dfrac{1}{3}x + \dfrac{1}{3}$, e si calcola per qualunque valore di $x$. Allo stesso modo ogni polinomio si può pensare come una frazione algebrica con denominatore $1$: $x^2 - 3 = \dfrac{x^2 - 3}{1}$.

## Il valore di una frazione algebrica

Il valore di una frazione algebrica si calcola come il [valore numerico di un polinomio](/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio): sostituisci i numeri alle lettere, calcoli il numeratore e il denominatore, e dividi il primo per il secondo. Se il denominatore vale $0$, la divisione non si può fare e la frazione, per quei valori, non ha un valore: si dice che non esiste.

```ad-example
Esempio 1: tre valori di x
Calcola il valore di $\dfrac{x^2 - 1}{x + 3}$ per $x = 2$, per $x = 1$ e per $x = -3$.

Per $x = 2$ il numeratore vale $4 - 1 = 3$ e il denominatore $2 + 3 = 5$:

$$\frac{2^2 - 1}{2 + 3} = \frac{3}{5}$$

Per $x = 1$ il numeratore vale $1 - 1 = 0$ e il denominatore $1 + 3 = 4$, quindi la frazione vale $\dfrac{0}{4} = 0$.

Per $x = -3$ il numeratore vale $9 - 1 = 8$ e il denominatore $-3 + 3 = 0$: $\dfrac{8}{0}$ non è un numero, e per $x = -3$ la frazione non esiste.
```

```ad-warning
Numeratore zero e denominatore zero
Un numeratore uguale a zero non crea problemi: $\dfrac{0}{4} = 0$, e la frazione esiste e vale $0$. È il denominatore che non può essere zero. Neanche $\dfrac{0}{0}$ è un numero: $\dfrac{x^2 - 1}{x - 1}$ per $x = 1$ non esiste, anche se il numeratore si annulla insieme al denominatore.
```

```ad-example
Esempio 2: due lettere e numeri negativi
Calcola il valore di $\dfrac{a + 2b}{a - b}$ per $a = 1$ e $b = -2$, e poi per $a = 3$ e $b = 3$.

Metti i numeri negativi tra parentesi quando li sostituisci:

$$
\begin{aligned}
\frac{1 + 2 \cdot (-2)}{1 - (-2)} &= \frac{1 - 4}{1 + 2} \\
&= \frac{-3}{3} = -1
\end{aligned}
$$

Per $a = 3$ e $b = 3$ il denominatore vale $3 - 3 = 0$: la frazione non esiste. Lo stesso succede ogni volta che $a$ e $b$ hanno lo stesso valore.
```

## Le condizioni di esistenza

Le **condizioni di esistenza** (C.E.) di una frazione algebrica sono le condizioni che le lettere devono rispettare perché il denominatore sia diverso da zero. Si scrivono prima di fare qualunque altra cosa con la frazione. Per la frazione dell'apertura:

$$\frac{3}{x - 2} \qquad \text{C.E.: } x \neq 2$$

Il numeratore non entra nelle condizioni di esistenza, perché può valere zero.

Quando il denominatore è di primo grado, il valore da escludere è quello che lo annulla. Per $x + 5$ è $-5$, quindi C.E.: $x \neq -5$. Per $2x - 3$ il valore si trova come si risolve un'[equazione di primo grado](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere): $2x - 3$ vale zero quando $2x = 3$, cioè per $x = \dfrac{3}{2}$. Con il simbolo $\neq$ al posto di $=$ i passaggi sono gli stessi:

$$
\begin{aligned}
2x - 3 &\neq 0 \\
2x &\neq 3 \\
x &\neq \frac{3}{2}
\end{aligned}
$$

```ad-warning
Il segno del valore escluso
$3 - x \neq 0$ dà $x \neq 3$, non $x \neq -3$: per $x = 3$ si ha $3 - 3 = 0$. Il valore da escludere è quello che, messo al posto di $x$, fa venire zero, e si controlla sostituendolo.
```

Se il denominatore è di grado più alto, come $x^2 - 5x + 6$, il valore che lo annulla non si legge a colpo d'occhio. Si legge invece quando il denominatore è scritto come prodotto, $(x - 2)(x - 3)$, grazie alla legge di annullamento del prodotto.

## La legge di annullamento del prodotto

Un prodotto vale zero se e solo se almeno uno dei fattori vale zero. È la **legge di annullamento del prodotto**:

$$a \cdot b = 0 \iff a = 0 \text{ oppure } b = 0$$

In un verso la conosci già: se uno dei fattori è zero, il prodotto è zero, perché lo zero è l'elemento assorbente della [moltiplicazione](/materiale/scuola-superiore/matematica/numeri-naturali/operazioni-in-n). Nell'altro verso, supponi che $a \cdot b = 0$ e che $a$ non sia zero: dividendo per $a$ i due lati dell'uguaglianza ottieni $b = 0$. Quindi almeno uno dei due fattori è zero. Lo stesso vale con tre o più fattori.

Per le condizioni di esistenza serve la stessa legge letta al contrario: un prodotto è diverso da zero se e solo se tutti i fattori sono diversi da zero.

$$a \cdot b \neq 0 \iff a \neq 0 \text{ e } b \neq 0$$

Per il denominatore $(x - 2)(x - 3)$ le condizioni sono quindi due, $x - 2 \neq 0$ e $x - 3 \neq 0$, e si scrivono insieme separate da una virgola, che vuol dire "e":

$$\text{C.E.: } x \neq 2, \ x \neq 3$$

Anche un monomio è un prodotto. Per $\dfrac{x - y}{3x^2y}$ il denominatore è $3 \cdot x \cdot x \cdot y$: il $3$ non è mai zero, e le condizioni sono C.E.: $x \neq 0$, $y \neq 0$.

```ad-warning
"E", non "oppure"
Le condizioni di esistenza valgono tutte insieme. "$x \neq 2$ oppure $x \neq 3$" sarebbe vera anche per $x = 2$ (perché $2 \neq 3$), e lascerebbe entrare proprio il valore che annulla il denominatore. Il valore di $x$ deve essere diverso da $2$ e anche diverso da $3$.
```

```ad-warning
La legge vale per i prodotti, non per le somme
$x^2 + x \neq 0$ non vuol dire "$x^2 \neq 0$ e $x \neq 0$": la legge riguarda i fattori, non i termini di una somma. Prima si scompone, $x^2 + x = x(x + 1)$, e le condizioni sono $x \neq 0$, $x \neq -1$.
```

### Procedimento

1. Guarda solo il denominatore.
2. Scomponi il denominatore in fattori fino in fondo, con [raccoglimento](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale), [prodotti notevoli](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli), [trinomio di secondo grado](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado) o [regola di Ruffini](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-la-regola-di-ruffini).
3. Tralascia i fattori numerici, che non sono mai zero.
4. Per ogni fattore con le lettere scrivi che è diverso da zero e trova il valore da escludere. Un fattore che compare più volte, o al quadrato, dà una condizione sola.
5. Scrivi tutte le condizioni insieme dopo "C.E.:".

## Esempi svolti

```ad-example
Esempio 3: differenza di quadrati
Scrivi le condizioni di esistenza di $\dfrac{x + 5}{x^2 - 9}$.

Il denominatore è una differenza di quadrati: $x^2 - 9 = (x - 3)(x + 3)$. Il primo fattore si annulla per $x = 3$, il secondo per $x = -3$.

$$\text{C.E.: } x \neq 3, \ x \neq -3$$

Due valori opposti si scrivono anche insieme: C.E.: $x \neq \pm 3$. La frazione esiste per tutti i numeri tranne $-3$ e $3$, i due punti vuoti nella figura.

```tikz
% nome: condizioni-esistenza-retta
% alt: Retta dei numeri colorata tutta tranne due punti vuoti in meno 3 e in 3, i valori esclusi dalle condizioni di esistenza di x più 5 fratto x al quadrato meno 9
% svg: condizioni-esistenza-retta-c6b9120a.svg 270x35
\begin{tikzpicture}[x=0.7cm]
\draw[blue!45, line width=2pt] (-4.6,0) -- (-3.14,0);
\draw[blue!45, line width=2pt] (-2.86,0) -- (2.86,0);
\draw[blue!45, line width=2pt, ->] (3.14,0) -- (4.8,0);
\draw[thick] (-3,0) circle (2.5pt);
\draw[thick] (3,0) circle (2.5pt);
\draw (0,-0.12) -- (0,0.12);
\node[below] at (-3,-0.15) {$-3$};
\node[below] at (0,-0.15) {$0$};
\node[below] at (3,-0.15) {$3$};
\node[right] at (4.8,0) {$x$};
\end{tikzpicture}
```
```

```ad-warning
Dimenticare il valore negativo
Da $x^2 - 9 \neq 0$ si arriva a $x^2 \neq 9$, e viene da scrivere solo $x \neq 3$. Ma anche $(-3)^2 = 9$: il valore $-3$ annulla il denominatore come $3$. Scomponendo in $(x - 3)(x + 3)$ i due valori escono tutti e due.
```

```ad-example
Esempio 4: un trinomio
Scrivi le condizioni di esistenza di $\dfrac{3x}{x^2 - 5x + 6}$.

Il denominatore è un trinomio con somma $-5$ e prodotto $6$: i due numeri sono $-2$ e $-3$.

$$
\begin{aligned}
&x^2 - 5x + 6 \\
&= (x - 2)(x - 3)
\end{aligned}
$$

$$\text{C.E.: } x \neq 2, \ x \neq 3$$

Controllo: per $x = 2$ il denominatore vale $4 - 10 + 6 = 0$, per $x = 3$ vale $9 - 15 + 6 = 0$.
```

```ad-example
Esempio 5: un raccoglimento con un fattore numerico
Scrivi le condizioni di esistenza di $\dfrac{x - 1}{2x^2 + 6x}$.

Raccogli $2x$: $2x^2 + 6x = 2x(x + 3)$. I fattori sono $2$, $x$ e $x + 3$; il $2$ non è mai zero e non dà condizioni.

$$\text{C.E.: } x \neq 0, \ x \neq -3$$

Il numeratore $x - 1$ si annulla per $x = 1$, ma questo non esclude niente: per $x = 1$ la frazione vale $0$.
```

```ad-example
Esempio 6: un quadrato
Scrivi le condizioni di esistenza di $\dfrac{x}{x^2 - 4x + 4}$.

Il denominatore è il quadrato di un binomio: $x^2 - 4x + 4 = (x - 2)^2$. Il fattore $x - 2$ compare due volte, ma si annulla per un solo valore.

$$\text{C.E.: } x \neq 2$$
```

```ad-example
Esempio 7: valori frazionari e un fattore scritto al contrario
Scrivi le condizioni di esistenza di $\dfrac{x + 1}{9x - 4x^3}$.

Raccogli $x$, poi scomponi la differenza di quadrati che resta:

$$
\begin{aligned}
9x - 4x^3 &= x(9 - 4x^2) \\
&= x(3 - 2x)(3 + 2x)
\end{aligned}
$$

Il fattore $x$ dà $x \neq 0$. Il fattore $3 - 2x$ vale zero quando $2x = 3$, cioè per $x = \dfrac{3}{2}$. Il fattore $3 + 2x$ vale zero quando $2x = -3$, cioè per $x = -\dfrac{3}{2}$.

$$\text{C.E.: } x \neq 0, \ x \neq \pm\frac{3}{2}$$

Controllo con $x = \dfrac{3}{2}$: $3 - 2 \cdot \dfrac{3}{2} = 3 - 3 = 0$.
```

```ad-example
Esempio 8: lo stesso fattore sopra e sotto
Scrivi le condizioni di esistenza di $\dfrac{x^2 - 1}{x^2 - x}$.

Il denominatore è $x^2 - x = x(x - 1)$, quindi C.E.: $x \neq 0$, $x \neq 1$.

Anche il numeratore si scompone, $x^2 - 1 = (x - 1)(x + 1)$, e contiene lo stesso fattore $x - 1$. La condizione $x \neq 1$ resta: per $x = 1$ la frazione diventa $\dfrac{0}{0}$, che non esiste. Le condizioni di esistenza si scrivono prima di [semplificare la frazione](/materiale/scuola-superiore/matematica/frazioni-algebriche/semplificazione-delle-frazioni-algebriche), e restano valide anche dopo.
```

```ad-example
Esempio 9: due lettere
Scrivi le condizioni di esistenza di $\dfrac{a + b}{a^2 - ab}$.

Raccogli $a$: $a^2 - ab = a(a - b)$. Il fattore $a$ dà $a \neq 0$. Il fattore $a - b$ vale zero quando $a$ e $b$ sono uguali, quindi la condizione lega le due lettere:

$$\text{C.E.: } a \neq 0, \ a \neq b$$

La frazione non esiste per $a = 0$, qualunque sia $b$, e non esiste quando $a = b$, qualunque sia il loro valore: per esempio per $a = 5$ e $b = 5$.
```

## Denominatori che non si annullano mai

Il quadrato di un numero non è mai negativo: $x^2 \geq 0$ per ogni $x$. Allora $x^2 + 1$ vale almeno $1$, e non è mai zero. Una frazione con questo denominatore esiste per ogni valore di $x$, e le condizioni di esistenza non escludono niente:

$$\frac{x}{x^2 + 1} \qquad \text{C.E.: nessuna condizione}$$

Lo stesso vale per ogni somma di potenze pari delle lettere con i coefficienti positivi, più un numero positivo, come $x^2 + 4$, $3x^2 + 2$ o $x^4 + x^2 + 5$: ogni termine con le lettere è maggiore o uguale a zero, e il numero aggiunto rende la somma positiva.

```ad-warning
Denominatori che sembrano positivi
Il ragionamento funziona solo con le potenze pari, i coefficienti positivi e il numero positivo, tutti insieme. $x^2 - 1$ si annulla per $x = \pm 1$; $x^2 + x = x(x + 1)$ si annulla per $x = 0$ e $x = -1$, perché $x$ ha esponente dispari e può essere negativo; $x^2$ da solo si annulla per $x = 0$.
```

Un fattore che non si annulla mai può comparire in mezzo agli altri: si scompone come al solito, e quel fattore non dà condizioni.

```ad-example
Esempio 10: un fattore che non si annulla mai
Scrivi le condizioni di esistenza di $\dfrac{2}{x^3 + x^2 + 4x + 4}$.

Raccogli a gruppi, $x^2$ dai primi due termini e $4$ dagli ultimi due:

$$
\begin{aligned}
&x^3 + x^2 + 4x + 4 \\
&= x^2(x + 1) + 4(x + 1) \\
&= (x + 1)(x^2 + 4)
\end{aligned}
$$

Il fattore $x + 1$ dà $x \neq -1$. Il fattore $x^2 + 4$ vale almeno $4$ e non si annulla mai.

$$\text{C.E.: } x \neq -1$$
```

```ad-note
Irriducibile non vuol dire mai zero
Un fattore irriducibile con coefficienti interi può annullarsi lo stesso: $x^2 - 3$ è irriducibile, ma vale zero per $x = \sqrt{3}$ e per $x = -\sqrt{3}$, due numeri irrazionali. Negli esercizi del primo anno i denominatori di secondo grado irriducibili sono di solito come $x^2 + 4$, che non si annullano mai; per gli altri servono i radicali e le [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado).
```

## Più frazioni nella stessa espressione

Quando in un'espressione compaiono più frazioni algebriche, le condizioni di esistenza sono quelle di tutti i denominatori insieme. Per esempio in

$$\frac{1}{x} + \frac{2}{x - 1} - \frac{x}{x^2 + 1}$$

il primo denominatore dà $x \neq 0$, il secondo $x \neq 1$ e il terzo nessuna condizione: C.E.: $x \neq 0$, $x \neq 1$. Se nell'espressione c'è una divisione per una frazione algebrica, anche il numeratore del divisore deve essere diverso da zero; come si fa lo trovi nelle [operazioni con le frazioni algebriche](/materiale/scuola-superiore/matematica/frazioni-algebriche/operazioni-con-le-frazioni-algebriche).

```ad-note
Condizioni di esistenza e dominio
Se una frazione algebrica è la formula di una funzione, come $f(x) = \dfrac{3}{x - 2}$, i valori che rispettano le condizioni di esistenza formano il suo dominio naturale: ne parla la lezione su [dominio, codominio e immagine](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/dominio-codominio-e-immagine).
```
