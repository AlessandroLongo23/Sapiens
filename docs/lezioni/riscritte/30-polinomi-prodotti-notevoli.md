# Prodotti notevoli

Alcune moltiplicazioni tra polinomi tornano così spesso che conviene conoscerne il risultato a memoria: si chiamano **prodotti notevoli**. Con la [proprietà distributiva](/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-polinomi) $(x + 5)^2$ richiede quattro prodotti e una riduzione; con la regola del quadrato di un binomio scrivi subito $x^2 + 10x + 25$.

In tutte le formule $a$, $b$ e $c$ stanno per monomi qualsiasi: numeri, lettere, oppure monomi come $-3x^2y$ o $\frac{1}{2}a$. Ogni formula si ricava moltiplicando, e il paragrafo "da dove viene" di ogni sezione fa proprio questo: se una formula ti sfugge in verifica, puoi sempre rifare il prodotto.

## Somma per differenza

Il prodotto della somma di due monomi per la loro differenza è uguale al quadrato del primo meno il quadrato del secondo:

$$(a + b)(a - b) = a^2 - b^2$$

Da dove viene: moltiplicando termine per termine, i due prodotti centrali sono opposti e si annullano.

$$
\begin{aligned}
(a + b)(a - b) &= a^2 - ab + ab - b^2 \\
&= a^2 - b^2
\end{aligned}
$$

Per riconoscerla guarda i due fattori: devono avere un termine uguale in entrambi e un termine che cambia segno. Il risultato è il quadrato del termine uguale meno il quadrato del termine che cambia segno.

```ad-example
Esempio 1: il caso più comune
$$(x + 3)(x - 3) = x^2 - 3^2 = x^2 - 9$$
```

```ad-example
Esempio 2: monomi con coefficiente e grado più alto
$$
\begin{aligned}
&(2x^2 - 5y)(2x^2 + 5y) \\
&= (2x^2)^2 - (5y)^2 \\
&= 4x^4 - 25y^2
\end{aligned}
$$

Ogni termine va elevato al quadrato tutto intero, coefficiente compreso: $(2x^2)^2 = 4x^4$, non $2x^4$.
```

```ad-example
Esempio 3: il termine uguale è negativo
$$
\begin{aligned}
&\left(-3a + \frac{1}{2}b\right)\left(-3a - \frac{1}{2}b\right) \\
&= (-3a)^2 - \left(\frac{1}{2}b\right)^2 \\
&= 9a^2 - \frac{1}{4}b^2
\end{aligned}
$$

Il termine uguale è $-3a$ e il suo quadrato è positivo. Il termine che cambia segno è $\frac{1}{2}b$.
```

```ad-example
Esempio 4: il termine che cambia segno viene prima
$$
\begin{aligned}
&(-x + 4)(x + 4) \\
&= 4^2 - x^2 \\
&= 16 - x^2 \\
&= -x^2 + 16
\end{aligned}
$$

Qui il termine uguale è $4$ e quello che cambia segno è $x$: il segno meno va davanti a $x^2$, non davanti a $16$. Se scrivi $x^2 - 16$ ottieni l'opposto del risultato.
```

```ad-warning
Scambiare i due termini
In $(a + b)(a - b)$ si sottrae il quadrato del termine che cambia segno. Prima di scrivere il risultato cerca quale termine è uguale nei due fattori, anche se non è il primo, come nell'esempio 4.
```

## Quadrato di un binomio

Il quadrato di un binomio è uguale al quadrato del primo termine, più il doppio prodotto del primo per il secondo, più il quadrato del secondo:

$$(a + b)^2 = a^2 + 2ab + b^2$$

$$(a - b)^2 = a^2 - 2ab + b^2$$

Da dove viene: elevare al quadrato vuol dire moltiplicare il binomio per se stesso, e i due prodotti centrali questa volta sono uguali e si sommano.

$$
\begin{aligned}
(a + b)^2 &= (a + b)(a + b) \\
&= a^2 + ab + ab + b^2 \\
&= a^2 + 2ab + b^2
\end{aligned}
$$

La figura mostra la stessa cosa con le aree, per $a$ e $b$ positivi. Il quadrato di lato $a + b$ ha area $(a + b)^2$ ed è diviso in quattro parti: il quadrato $a^2$, il quadrato $b^2$ e due rettangoli di area $ab$, colorati.

```tikz
% nome: quadrato-di-un-binomio-aree
% alt: Quadrato di lato a più b diviso in un quadrato di area a al quadrato, un quadrato di area b al quadrato e due rettangoli colorati di area a per b
% svg: quadrato-di-un-binomio-aree-f4bce59d.svg 194x196
\begin{tikzpicture}
\fill[blue!20] (3,1.6) rectangle (4.6,4.6);
\fill[blue!20] (0,0) rectangle (3,1.6);
\draw (0,0) rectangle (4.6,4.6);
\draw (3,0) -- (3,4.6);
\draw (0,1.6) -- (4.6,1.6);
\node at (1.5,3.1) {$a^2$};
\node at (3.8,3.1) {$ab$};
\node at (1.5,0.8) {$ab$};
\node at (3.8,0.8) {$b^2$};
\node[above] at (1.5,4.6) {$a$};
\node[above] at (3.8,4.6) {$b$};
\node[left] at (0,3.1) {$a$};
\node[left] at (0,0.8) {$b$};
\end{tikzpicture}
```

Il segno del doppio prodotto dipende dai segni dei due termini: è positivo se hanno lo stesso segno, negativo se hanno segni diversi. I due quadrati invece sono sempre positivi.

```ad-warning
Il quadrato di una somma non è la somma dei quadrati
$(a + b)^2 = a^2 + b^2$ è falso: manca il doppio prodotto $2ab$, cioè i due rettangoli della figura. Con i numeri si vede subito: $(3 + 4)^2 = 49$, mentre $3^2 + 4^2 = 25$. Allo stesso modo $(x - 3)^2$ non è $x^2 - 9$, e neppure $x^2 + 9$: è $x^2 - 6x + 9$.
```

### Come si sviluppa

1. Individua i due termini del binomio, ciascuno con il suo segno.
2. Scrivi il quadrato del primo termine.
3. Scrivi il doppio prodotto dei due termini, con il segno che viene dalla regola dei segni.
4. Scrivi il quadrato del secondo termine.
5. Ordina il risultato secondo le potenze decrescenti di una lettera.

```ad-example
Esempio 5: un binomio con un numero
$$
\begin{aligned}
(x + 5)^2 &= x^2 + 2 \cdot x \cdot 5 + 5^2 \\
&= x^2 + 10x + 25
\end{aligned}
$$
```

```ad-example
Esempio 6: segni diversi e due lettere
$$
\begin{aligned}
&(3x - 2y)^2 \\
&= (3x)^2 + 2 \cdot (3x) \cdot (-2y) \\
&\quad + (-2y)^2 \\
&= 9x^2 - 12xy + 4y^2
\end{aligned}
$$

I termini sono $3x$ e $-2y$, di segno diverso, quindi il doppio prodotto è negativo.
```

```ad-example
Esempio 7: coefficiente frazionario e grado più alto
$$
\begin{aligned}
&\left(\frac{1}{2}a^2 + 4b\right)^2 = \left(\frac{1}{2}a^2\right)^2 \\
&\quad + 2 \cdot \frac{1}{2}a^2 \cdot 4b + (4b)^2 \\
&= \frac{1}{4}a^4 + 4a^2b + 16b^2
\end{aligned}
$$

Nel doppio prodotto semplifica prima: $2 \cdot \frac{1}{2} \cdot 4 = 4$.
```

```ad-example
Esempio 8: una frazione come secondo termine
$$
\begin{aligned}
\left(x - \frac{1}{3}\right)^2 &= x^2 - 2 \cdot x \cdot \frac{1}{3} + \frac{1}{9} \\
&= x^2 - \frac{2}{3}x + \frac{1}{9}
\end{aligned}
$$
```

```ad-example
Esempio 9: due termini negativi
$$
\begin{aligned}
&(-2x - 3)^2 = (-2x)^2 \\
&\quad + 2 \cdot (-2x) \cdot (-3) \\
&\quad + (-3)^2 \\
&= 4x^2 + 12x + 9
\end{aligned}
$$

I due termini hanno lo stesso segno, quindi il doppio prodotto è positivo. Il risultato è lo stesso di $(2x + 3)^2$, perché $-2x - 3$ è l'opposto di $2x + 3$ e due numeri opposti hanno lo stesso quadrato.
```

Per lo stesso motivo $(a - b)^2 = (b - a)^2$: i binomi $a - b$ e $b - a$ sono opposti, e i loro quadrati coincidono. Per esempio $(3 - x)^2 = (x - 3)^2 = x^2 - 6x + 9$.

```ad-warning
Dimenticare il coefficiente nel quadrato
$(3x)^2 = 9x^2$, non $3x^2$: si eleva al quadrato tutto il termine, coefficiente e lettere. Lo stesso vale nel doppio prodotto, dove entra il coefficiente intero: in $(3x - 2y)^2$ il doppio prodotto è $2 \cdot 3x \cdot (-2y) = -12xy$.
```

## Quadrato di un trinomio

Il quadrato di un trinomio è uguale alla somma dei quadrati dei tre termini più i tre doppi prodotti di ogni termine per ciascuno dei successivi:

$$
\begin{aligned}
&(a + b + c)^2 = a^2 + b^2 + c^2 \\
&\quad + 2ab + 2ac + 2bc
\end{aligned}
$$

Da dove viene: moltiplicando $(a + b + c)(a + b + c)$ si ottengono nove prodotti. Tre sono i quadrati $a^2$, $b^2$, $c^2$; gli altri sei sono a coppie uguali ($ab$ e $ba$, $ac$ e $ca$, $bc$ e $cb$) e danno i tre doppi prodotti.

Come nel quadrato di un binomio, i quadrati sono sempre positivi e ogni doppio prodotto ha il segno che viene dalla regola dei segni: se il trinomio è $a - b + c$, i doppi prodotti sono $-2ab$, $+2ac$ e $-2bc$.

```ad-example
Esempio 10: tre termini positivi
$$
\begin{aligned}
&(x + y + 2)^2 \\
&= x^2 + y^2 + 4 + 2xy + 4x + 4y
\end{aligned}
$$

Ordinato secondo le potenze decrescenti di $x$: $x^2 + 2xy + 4x + y^2 + 4y + 4$.
```

```ad-example
Esempio 11: termini simili da ridurre
Sviluppa $(x^2 - 3x + 1)^2$. I termini sono $x^2$, $-3x$ e $1$.

Quadrati: $x^4$, $9x^2$, $1$.

Doppi prodotti: $2 \cdot x^2 \cdot (-3x) = -6x^3$, $2 \cdot x^2 \cdot 1 = 2x^2$, $2 \cdot (-3x) \cdot 1 = -6x$.

$$
\begin{aligned}
&(x^2 - 3x + 1)^2 \\
&= x^4 + 9x^2 + 1 \\
&\quad - 6x^3 + 2x^2 - 6x \\
&= x^4 - 6x^3 + 11x^2 - 6x + 1
\end{aligned}
$$

$9x^2$ e $2x^2$ sono simili: prima di ordinare, sommali.
```

```ad-example
Esempio 12: due termini negativi e una frazione
Sviluppa $\left(2a - b - \frac{1}{2}\right)^2$. I termini sono $2a$, $-b$ e $-\frac{1}{2}$.

Quadrati: $4a^2$, $b^2$, $\frac{1}{4}$.

Doppi prodotti: $2 \cdot 2a \cdot (-b) = -4ab$, $2 \cdot 2a \cdot \left(-\frac{1}{2}\right) = -2a$, $2 \cdot (-b) \cdot \left(-\frac{1}{2}\right) = b$.

$$
\begin{aligned}
&\left(2a - b - \frac{1}{2}\right)^2 \\
&= 4a^2 - 4ab - 2a + b^2 + b + \frac{1}{4}
\end{aligned}
$$

L'ultimo doppio prodotto è positivo perché $-b$ e $-\frac{1}{2}$ hanno lo stesso segno.
```

```ad-warning
Dimenticare un doppio prodotto
I doppi prodotti sono tre, uno per ogni coppia di termini: il primo con il secondo, il primo con il terzo, il secondo con il terzo. Contali sempre prima di chiudere: tre quadrati più tre doppi prodotti fanno sei termini, prima della riduzione.
```

## Cubo di un binomio

Il cubo di un binomio è uguale al cubo del primo termine, più il triplo prodotto del quadrato del primo per il secondo, più il triplo prodotto del primo per il quadrato del secondo, più il cubo del secondo:

$$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$$

$$(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$$

Da dove viene: $(a + b)^3 = (a + b)^2(a + b)$, e il quadrato lo conosci già.

$$
\begin{aligned}
&(a^2 + 2ab + b^2)(a + b) \\
&= a^3 + a^2b + 2a^2b + 2ab^2 + ab^2 + b^3 \\
&= a^3 + 3a^2b + 3ab^2 + b^3
\end{aligned}
$$

Nella formula gli esponenti di $a$ scendono da $3$ a $0$ e quelli di $b$ salgono da $0$ a $3$; i coefficienti sono $1$, $3$, $3$, $1$. Nel cubo di $a - b$ i segni si alternano, perché le potenze dispari di $-b$ sono negative.

```ad-example
Esempio 13: un binomio con un numero
$$
\begin{aligned}
&(x + 2)^3 = x^3 + 3 \cdot x^2 \cdot 2 \\
&\quad + 3 \cdot x \cdot 2^2 + 2^3 \\
&= x^3 + 6x^2 + 12x + 8
\end{aligned}
$$
```

```ad-example
Esempio 14: coefficiente e segno meno
$$
\begin{aligned}
&(2x - y)^3 \\
&= (2x)^3 - 3 \cdot (2x)^2 \cdot y \\
&\quad + 3 \cdot 2x \cdot y^2 - y^3 \\
&= 8x^3 - 12x^2y + 6xy^2 - y^3
\end{aligned}
$$

$(2x)^2 = 4x^2$, quindi il secondo termine è $3 \cdot 4x^2 \cdot y = 12x^2y$.
```

```ad-example
Esempio 15: frazione e monomio di grado più alto
$$
\begin{aligned}
&\left(\frac{1}{3}a - 3b^2\right)^3 \\
&= \frac{1}{27}a^3 - 3 \cdot \frac{1}{9}a^2 \cdot 3b^2 \\
&\quad + 3 \cdot \frac{1}{3}a \cdot 9b^4 - 27b^6 \\
&= \frac{1}{27}a^3 - a^2b^2 \\
&\quad + 9ab^4 - 27b^6
\end{aligned}
$$

I passaggi da tenere d'occhio sono le potenze dei termini: $\left(\frac{1}{3}a\right)^2 = \frac{1}{9}a^2$, $(3b^2)^2 = 9b^4$, $(3b^2)^3 = 27b^6$.
```

```ad-example
Esempio 16: due termini negativi
$$
\begin{aligned}
&(-x - 1)^3 \\
&= (-x)^3 + 3 \cdot (-x)^2 \cdot (-1) \\
&\quad + 3 \cdot (-x) \cdot (-1)^2 \\
&\quad + (-1)^3 \\
&= -x^3 - 3x^2 - 3x - 1
\end{aligned}
$$

Il risultato è l'opposto di $(x + 1)^3 = x^3 + 3x^2 + 3x + 1$: con il cubo il segno meno davanti a tutto il binomio non sparisce.
```

```ad-warning
Il cubo di una somma non è la somma dei cubi
$(a + b)^3 = a^3 + b^3$ è falso: mancano i due tripli prodotti. Con i numeri, $(1 + 1)^3 = 8$, mentre $1^3 + 1^3 = 2$.
```

```ad-warning
Scambiare i termini nel cubo
$(a - b)^2 = (b - a)^2$, ma $(a - b)^3$ e $(b - a)^3$ sono opposti, perché il cubo di un numero negativo è negativo. Per esempio $(1 - x)^3 = -x^3 + 3x^2 - 3x + 1$, che è l'opposto di $(x - 1)^3 = x^3 - 3x^2 + 3x - 1$.
```

## Potenza di un binomio e triangolo di Tartaglia

Anche le potenze successive di un binomio, $(a + b)^4$, $(a + b)^5$ e così via, seguono uno schema. Lo sviluppo di $(a + b)^n$ ha $n + 1$ termini; gli esponenti di $a$ scendono da $n$ a $0$, quelli di $b$ salgono da $0$ a $n$, e in ogni termine la somma dei due esponenti è $n$. I coefficienti si leggono nella riga $n$ del **triangolo di Tartaglia**.

Il triangolo comincia con un $1$ in cima (la riga $0$, perché $(a + b)^0 = 1$). Ogni riga comincia e finisce con $1$, e ogni altro numero è la somma dei due numeri che ha sopra: il $6$ della riga $4$ è $3 + 3$.

```tikz
% nome: triangolo-di-tartaglia
% alt: Triangolo di Tartaglia dalla riga 0 alla riga 6: ogni riga comincia e finisce con 1 e ogni altro numero è la somma dei due numeri sopra, come il 6 della riga 4 che è 3 più 3
% svg: triangolo-di-tartaglia-f85c37e1.svg 283x168
\begin{tikzpicture}
\node[anchor=east] at (-3.4,0) {$n = 0$};
\node at (0,0) {$1$};
\node[anchor=east] at (-3.4,-0.65) {$n = 1$};
\node at (-0.45,-0.65) {$1$};
\node at (0.45,-0.65) {$1$};
\node[anchor=east] at (-3.4,-1.3) {$n = 2$};
\node at (-0.9,-1.3) {$1$};
\node at (0,-1.3) {$2$};
\node at (0.9,-1.3) {$1$};
\node[anchor=east] at (-3.4,-1.95) {$n = 3$};
\node at (-1.35,-1.95) {$1$};
\node at (-0.45,-1.95) {$3$};
\node at (0.45,-1.95) {$3$};
\node at (1.35,-1.95) {$1$};
\node[anchor=east] at (-3.4,-2.6) {$n = 4$};
\node at (-1.8,-2.6) {$1$};
\node at (-0.9,-2.6) {$4$};
\node at (0,-2.6) {$6$};
\node at (0.9,-2.6) {$4$};
\node at (1.8,-2.6) {$1$};
\node[anchor=east] at (-3.4,-3.25) {$n = 5$};
\node at (-2.25,-3.25) {$1$};
\node at (-1.35,-3.25) {$5$};
\node at (-0.45,-3.25) {$10$};
\node at (0.45,-3.25) {$10$};
\node at (1.35,-3.25) {$5$};
\node at (2.25,-3.25) {$1$};
\node[anchor=east] at (-3.4,-3.9) {$n = 6$};
\node at (-2.7,-3.9) {$1$};
\node at (-1.8,-3.9) {$6$};
\node at (-0.9,-3.9) {$15$};
\node at (0,-3.9) {$20$};
\node at (0.9,-3.9) {$15$};
\node at (1.8,-3.9) {$6$};
\node at (2.7,-3.9) {$1$};
\draw[->] (-0.38,-2.15) -- (-0.1,-2.42);
\draw[->] (0.38,-2.15) -- (0.1,-2.42);
\end{tikzpicture}
```

Le righe $2$ e $3$ sono i coefficienti del quadrato e del cubo che hai già visto. La riga $4$ dà:

$$
\begin{aligned}
&(a + b)^4 \\
&= a^4 + 4a^3b + 6a^2b^2 \\
&\quad + 4ab^3 + b^4
\end{aligned}
$$

Con $a - b$ i segni si alternano, cominciando con $+$: $(a - b)^5 = a^5 - 5a^4b + 10a^3b^2 - 10a^2b^3 + 5ab^4 - b^5$.

```ad-example
Esempio 17: la quarta potenza con un segno meno
Sviluppa $(x - 2)^4$. I coefficienti della riga $4$ sono $1$, $4$, $6$, $4$, $1$; i termini sono $x$ e $-2$.

$$
\begin{aligned}
&(x - 2)^4 = x^4 + 4x^3(-2) \\
&\quad + 6x^2(-2)^2 \\
&\quad + 4x(-2)^3 + (-2)^4 \\
&= x^4 - 8x^3 + 24x^2 - 32x + 16
\end{aligned}
$$

Le potenze di $-2$ sono $-2$, $4$, $-8$, $16$: da qui i segni alterni.
```
