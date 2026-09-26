# Espressioni con polinomi

Un'espressione con polinomi è una catena di operazioni tra polinomi (somme algebriche, prodotti, potenze, divisioni per un monomio), spesso con parentesi, da ridurre a un solo polinomio in forma normale, ordinato secondo le potenze decrescenti di una lettera. Le regole delle singole operazioni sono nelle lezioni [Operazioni tra polinomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-polinomi) e [Prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli); qui si mettono in fila, si riconoscono i prodotti notevoli nascosti e si controlla il risultato.

## L'ordine delle operazioni

L'ordine è lo stesso delle [espressioni con monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/espressioni-con-monomi):

1. Si parte dalle parentesi più interne: prima le tonde, poi le quadre, poi le graffe.
2. Dentro ogni parentesi, e poi fuori, si calcolano prima le potenze. La potenza di un binomio o di un trinomio si sviluppa con il prodotto notevole, quando c'è.
3. Poi i prodotti e le divisioni per un monomio, nell'ordine in cui compaiono, da sinistra verso destra.
4. Per ultime le somme algebriche: si tolgono le parentesi, cambiando il segno di ogni termine quando davanti c'è un meno, e si sommano i termini simili.
5. Alla fine si ordina il risultato secondo le potenze decrescenti di una lettera.

La differenza con i monomi è che una parentesi non si riduce quasi mai a un solo termine. In $(x + 1)^2$ dentro la tonda non c'è niente da calcolare: $x$ e $1$ non sono simili. La parentesi resta finché non fai l'operazione che la riguarda, qui la potenza, e dopo lo sviluppo il risultato si scrive ancora tra parentesi, $(x^2 + 2x + 1)$, fino a quando non tocca a lui.

```ad-warning
Il meno davanti a un prodotto
In $-(x + 2)(x - 2)$ il meno vale per tutto il prodotto. Prima si sviluppa il prodotto tenendolo tra parentesi, poi si cambiano i segni:

$$
\begin{aligned}
&-(x + 2)(x - 2) \\
&= -(x^2 - 4) \\
&= -x^2 + 4
\end{aligned}
$$

Se togli la parentesi troppo presto scrivi $-x^2 - 4$, con il segno del $4$ sbagliato.
```

```ad-warning
Il numero davanti a una potenza
In $2(x + 3)^2$ la potenza viene prima del prodotto: $2(x^2 + 6x + 9) = 2x^2 + 12x + 18$. Portare il $2$ dentro la parentesi prima di elevare al quadrato dà $(2x + 6)^2 = 4x^2 + 24x + 36$, che è un altro polinomio.
```

## Riconoscere un prodotto notevole

Un prodotto notevole si sviluppa in una riga, mentre la proprietà distributiva richiede di moltiplicare ogni termine per ogni termine e poi di ridurre. Dentro un'espressione, però, i prodotti notevoli raramente compaiono nella forma del formulario: i termini sono in un altro ordine, hanno un segno meno davanti, sono a loro volta dei binomi. Prima di sviluppare un prodotto, guarda se è uno di questi casi.

### Somma per differenza con i termini in disordine

Due binomi formati dagli stessi due termini, a meno del segno, danno una somma per differenza quando un termine compare con lo stesso segno in tutti e due i fattori e l'altro con segni opposti. Il termine con lo stesso segno è $a$, quello con i segni opposti è $b$, e il prodotto vale $a^2 - b^2$.

In $(3x + y)(y - 3x)$ il termine $y$ ha lo stesso segno nei due fattori, mentre $3x$ compare una volta con il più e una con il meno:

$$
\begin{aligned}
&(3x + y)(y - 3x) \\
&= y^2 - 9x^2 \\
&= -9x^2 + y^2
\end{aligned}
$$

In $(-x - y)(x - y)$ il termine con lo stesso segno è $-y$, quello con i segni opposti è $x$:

$$
\begin{aligned}
&(-x - y)(x - y) \\
&= (-y)^2 - x^2 \\
&= -x^2 + y^2
\end{aligned}
$$

### Quadrati con i segni negativi

Un binomio e il suo opposto hanno lo stesso quadrato, perché $(-A)^2 = A^2$ per qualunque polinomio $A$. Quindi

$$
\begin{gathered}
(-x - 3)^2 = (x + 3)^2 = x^2 + 6x + 9 \\
(3 - x)^2 = (x - 3)^2 = x^2 - 6x + 9
\end{gathered}
$$

Quando invece due fattori sono opposti, il prodotto è il quadrato con un meno davanti. In $(2x - 1)(1 - 2x)$ il secondo fattore è $-(2x - 1)$:

$$
\begin{aligned}
&(2x - 1)(1 - 2x) \\
&= -(2x - 1)^2 \\
&= -(4x^2 - 4x + 1) \\
&= -4x^2 + 4x - 1
\end{aligned}
$$

### Tre fattori

In un prodotto di tre o più fattori puoi moltiplicarli nell'ordine che vuoi. Conviene cominciare dalla coppia che forma un prodotto notevole:

$$
\begin{aligned}
&(x - 2)(x + 3)(x + 2) \\
&= (x^2 - 4)(x + 3) \\
&= x^3 + 3x^2 - 4x - 12
\end{aligned}
$$

A volte il primo prodotto notevole ne prepara un altro:

$$
\begin{aligned}
&(x - 1)(x + 1)(x^2 + 1) \\
&= (x^2 - 1)(x^2 + 1) \\
&= x^4 - 1
\end{aligned}
$$

### Un binomio al posto di un termine

In un prodotto di due trinomi, due termini possono formare un blocco che si ripete. In $(x + y - 1)(x - y + 1)$ il termine $x$ ha lo stesso segno nei due fattori, mentre $y$ e $1$ hanno tutti e due segni opposti: raccogliendo $y - 1$ tra parentesi, il prodotto diventa una somma per differenza con $a = x$ e $b = y - 1$:

$$
\begin{aligned}
&(x + y - 1)(x - y + 1) \\
&= [x + (y - 1)][x - (y - 1)] \\
&= x^2 - (y - 1)^2 \\
&= x^2 - y^2 + 2y - 1
\end{aligned}
$$

Con la proprietà distributiva sarebbero stati nove prodotti da ridurre.

```ad-warning
Un prodotto notevole che non c'è
$(x + 2)(x - 3)$ non è una somma per differenza, perché i secondi termini sono diversi. Si usa la proprietà distributiva: $x^2 - 3x + 2x - 6 = x^2 - x - 6$, non $x^2 - 6$.
```

## Come controllare il risultato

Un'espressione e il polinomio che ne esce devono avere lo stesso [valore numerico](/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio) per qualunque valore delle lettere. Per controllare, scegli un valore, calcola l'espressione di partenza e il risultato, e confronta i due numeri: se sono diversi c'è un errore; se sono uguali, il risultato con buona probabilità è giusto.

Il valore va scelto con un po' di cura:

- non $0$, che controlla solo il termine noto, e non $1$, che rende uguali tutte le potenze di $x$ e nasconde gli errori sugli esponenti;
- non un valore che annulla un fattore o un divisore, perché quel pezzo di espressione vale $0$ e i suoi errori non si vedono (con la divisione per un monomio, il monomio non deve valere $0$);
- un numero piccolo, come $2$, $-1$ o $3$, perché i conti vanno fatti a mano.

```ad-example
Controllo: un errore che il valore numerico scopre
Nell'esempio 2 qui sotto l'espressione $(x - 3)^2 - (x + 2)(x - 2) - 2(x - 1)^2$ dà $-2x^2 - 2x + 11$. Con $x = -1$ l'espressione di partenza vale

$$
\begin{aligned}
&(-4)^2 - (1)(-3) - 2 \cdot (-2)^2 \\
&= 16 + 3 - 8 \\
&= 11
\end{aligned}
$$

e il risultato vale $-2 + 2 + 11 = 11$. Chi scrive $-(x^2 - 4) = -x^2 - 4$ ottiene invece $-2x^2 - 2x + 3$, che per $x = -1$ vale $3$: i due numeri non tornano, e l'errore è scoperto.
```

Un valore solo non basta a dimostrare che il risultato è giusto, perché due polinomi diversi possono avere lo stesso valore in qualche punto. Se il controllo passa con un valore e vuoi più sicurezza, rifallo con un secondo valore. Con due lettere si sceglie un valore per ciascuna, per esempio $x = 2$ e $y = -1$.

```ad-tip
Il termine noto a mente
Il termine noto del risultato è il valore dell'espressione per $x = 0$, e spesso si calcola a mente. Nell'esempio 2: $(-3)^2 - 2 \cdot (-2) - 2 \cdot (-1)^2 = 9 + 4 - 2 = 11$.
```

## Esempi svolti

```ad-example
Esempio 1: prodotti e somma
$$3x(x - 2) - (x + 1)(x - 5)$$

Non ci sono potenze. I prodotti vengono prima della differenza; il secondo si tiene tra parentesi, perché davanti c'è un meno:

$$
\begin{aligned}
&3x(x - 2) = 3x^2 - 6x \\[6pt]
&(x + 1)(x - 5) \\
&= x^2 - 5x + x - 5 = x^2 - 4x - 5
\end{aligned}
$$

Si toglie la parentesi cambiando i segni e si sommano i termini simili:

$$
\begin{aligned}
&3x^2 - 6x - (x^2 - 4x - 5) \\
&= 3x^2 - 6x - x^2 + 4x + 5 \\
&= 2x^2 - 2x + 5
\end{aligned}
$$
```

```ad-example
Esempio 2: prodotti notevoli con il meno davanti
$$
\begin{aligned}
&(x - 3)^2 - (x + 2)(x - 2) \\
&\quad - 2(x - 1)^2
\end{aligned}
$$

Il primo termine è il quadrato di un binomio, il secondo una somma per differenza, il terzo un quadrato moltiplicato per $2$. Prima le potenze e il prodotto, tutti tra parentesi:

$$
\begin{aligned}
&(x^2 - 6x + 9) - (x^2 - 4) \\
&\quad - 2(x^2 - 2x + 1)
\end{aligned}
$$

Poi il prodotto per $2$, che si tiene ancora tra parentesi per via del meno:

$$
\begin{aligned}
&(x^2 - 6x + 9) - (x^2 - 4) \\
&\quad - (2x^2 - 4x + 2)
\end{aligned}
$$

Si tolgono le parentesi e si sommano i termini simili:

$$
\begin{aligned}
&x^2 - 6x + 9 - x^2 \\
&\quad + 4 - 2x^2 + 4x - 2 \\
&= -2x^2 - 2x + 11
\end{aligned}
$$
```

```ad-example
Esempio 3: due lettere e monomi di grado più alto
$$
\begin{aligned}
&(2x^2 - y)^2 - (2x^2 + y)(2x^2 - y) \\
&\quad + 4x^2(y - 1)
\end{aligned}
$$

Il quadrato di un binomio con $a = 2x^2$ e $b = y$, poi una somma per differenza con gli stessi termini:

$$
\begin{gathered}
(2x^2 - y)^2 = 4x^4 - 4x^2y + y^2 \\
(2x^2 + y)(2x^2 - y) = 4x^4 - y^2
\end{gathered}
$$

Il terzo termine è un monomio per un binomio: $4x^2(y - 1) = 4x^2y - 4x^2$. Tolte le parentesi:

$$
\begin{aligned}
&4x^4 - 4x^2y + y^2 - 4x^4 \\
&\quad + y^2 + 4x^2y - 4x^2
\end{aligned}
$$

I termini in $x^4$ e in $x^2y$ si annullano, e restano

$$-4x^2 + 2y^2$$
```

```ad-warning
Il quadrato di un monomio dentro il binomio
In $(2x^2 - y)^2$ il primo quadrato è $(2x^2)^2 = 4x^4$: si eleva anche il coefficiente, e l'esponente $2$ si moltiplica per $2$. Scrivere $2x^4$ o $4x^2$ sono i due errori più comuni.
```

```ad-example
Esempio 4: coefficienti frazionari
$$
\begin{aligned}
&\left(\frac{1}{2}x - \frac{2}{3}\right)^2 \\
&\quad - \left(\frac{1}{3}x + 1\right)\left(\frac{1}{3}x - 1\right) + \frac{2}{3}x
\end{aligned}
$$

Il quadrato del binomio, con il doppio prodotto $2 \cdot \frac{1}{2}x \cdot \frac{2}{3} = \frac{2}{3}x$:

$$\left(\frac{1}{2}x - \frac{2}{3}\right)^2 = \frac{1}{4}x^2 - \frac{2}{3}x + \frac{4}{9}$$

La somma per differenza:

$$\left(\frac{1}{3}x + 1\right)\left(\frac{1}{3}x - 1\right) = \frac{1}{9}x^2 - 1$$

Tolte le parentesi, l'espressione diventa

$$\frac{1}{4}x^2 - \frac{2}{3}x + \frac{4}{9} - \frac{1}{9}x^2 + 1 + \frac{2}{3}x$$

I termini in $x$ si annullano. Per gli altri serve il denominatore comune:

$$
\begin{aligned}
&\left(\frac{9}{36} - \frac{4}{36}\right)x^2 + \frac{4}{9} + \frac{9}{9} \\
&= \frac{5}{36}x^2 + \frac{13}{9}
\end{aligned}
$$
```

```ad-example
Esempio 5: un cubo e una potenza dentro un prodotto
$$
\begin{aligned}
&(x - 2)^3 - x(x - 3)^2 \\
&\quad + 3(x + 1)(x - 1)
\end{aligned}
$$

Il cubo del binomio:

$$(x - 2)^3 = x^3 - 6x^2 + 12x - 8$$

In $x(x - 3)^2$ viene prima la potenza, poi il prodotto per $x$:

$$
\begin{aligned}
x(x - 3)^2 &= x(x^2 - 6x + 9) \\
&= x^3 - 6x^2 + 9x
\end{aligned}
$$

Nell'ultimo termine la somma per differenza, poi il prodotto per $3$: $3(x^2 - 1) = 3x^2 - 3$. Mettendo tutto insieme:

$$
\begin{aligned}
&x^3 - 6x^2 + 12x - 8 \\
&\quad - (x^3 - 6x^2 + 9x) + 3x^2 - 3
\end{aligned}
$$

$$
\begin{aligned}
&= x^3 - 6x^2 + 12x - 8 - x^3 \\
&\quad + 6x^2 - 9x + 3x^2 - 3 \\
&= 3x^2 + 3x - 11
\end{aligned}
$$
```

```ad-warning
Moltiplicare prima di elevare
In $x(x - 3)^2$ la potenza viene prima del prodotto. Calcolare prima $x(x - 3) = x^2 - 3x$ e poi elevarlo al quadrato dà $x^4 - 6x^3 + 9x^2$, che è $x^2(x - 3)^2$ e non $x(x - 3)^2$.
```

```ad-example
Esempio 6: un binomio al posto di un termine
$$(x + y - 3)(x + y + 3) - (x - y)^2$$

Nel primo prodotto $x + y$ compare uguale nei due fattori, mentre $3$ compare con segni opposti. È una somma per differenza con $a = x + y$ e $b = 3$:

$$
\begin{aligned}
&(x + y - 3)(x + y + 3) \\
&= (x + y)^2 - 9 \\
&= x^2 + 2xy + y^2 - 9
\end{aligned}
$$

Poi il quadrato del binomio, tra parentesi per via del meno:

$$
\begin{aligned}
&x^2 + 2xy + y^2 - 9 \\
&\quad - (x^2 - 2xy + y^2) \\
&= x^2 + 2xy + y^2 - 9 \\
&\quad - x^2 + 2xy - y^2 \\
&= 4xy - 9
\end{aligned}
$$

Con la proprietà distributiva il primo prodotto avrebbe dato nove termini, da ridurre prima di andare avanti.
```

```ad-example
Esempio 7: tonde, quadre e graffe
$$
\begin{aligned}
&\Big\{(x - y + 2)^2 \\
&\quad - \Big[(x + y)^2 \\
&\qquad - (6x^2y - 4xy^2) : (2xy)\Big]\Big\} \\
&\quad \cdot \left(-\frac{1}{2}x\right)
\end{aligned}
$$

Si comincia dalla quadra. Dentro ci sono una potenza, una divisione e una differenza, in quest'ordine. La potenza è il quadrato di un binomio; nella divisione ogni termine del polinomio si divide per il monomio:

$$
\begin{gathered}
(x + y)^2 = x^2 + 2xy + y^2 \\
(6x^2y - 4xy^2) : (2xy) = 3x - 2y
\end{gathered}
$$

La quadra vale quindi

$$
\begin{aligned}
&x^2 + 2xy + y^2 - (3x - 2y) \\
&= x^2 + 2xy + y^2 - 3x + 2y
\end{aligned}
$$

Nella graffa c'è il quadrato del trinomio $x - y + 2$: i quadrati dei tre termini, più i doppi prodotti di ogni coppia, ognuno con il segno che viene dal prodotto dei segni:

$$
\begin{aligned}
&(x - y + 2)^2 \\
&= x^2 + y^2 + 4 - 2xy + 4x - 4y
\end{aligned}
$$

Poi la differenza con la quadra, che si tiene tra parentesi finché non si cambiano i segni:

$$
\begin{aligned}
&x^2 + y^2 + 4 - 2xy + 4x - 4y \\
&\quad - (x^2 + 2xy + y^2 - 3x + 2y)
\end{aligned}
$$

$$
\begin{aligned}
&= x^2 + y^2 + 4 - 2xy + 4x - 4y \\
&\quad - x^2 - 2xy - y^2 + 3x - 2y \\
&= -4xy + 7x - 6y + 4
\end{aligned}
$$

Resta il prodotto per il monomio, termine per termine:

$$
\begin{aligned}
&(-4xy + 7x - 6y + 4) \cdot \left(-\frac{1}{2}x\right) \\
&= 2x^2y - \frac{7}{2}x^2 + 3xy - 2x
\end{aligned}
$$

Controllo con $x = 2$ e $y = 1$, che non annullano il divisore $2xy$. Dentro la quadra $(x + y)^2 = 9$ e $(24 - 8) : 4 = 4$, quindi la quadra vale $5$; la graffa vale $3^2 - 5 = 4$, e l'espressione $4 \cdot (-1) = -4$. Il risultato vale $8 - 14 + 6 - 4 = -4$: i due numeri tornano.
```

```ad-warning
Dividere solo il primo termine
$(6x^2y - 4xy^2) : (2xy) = 3x - 2y$: il monomio divide ogni termine del polinomio. Scrivere $3x - 4xy^2$ vuol dire aver diviso solo il primo.
```

```ad-warning
I segni nel quadrato di un trinomio
In $(x - y + 2)^2$ ogni doppio prodotto prende il segno del prodotto dei suoi due termini: $2 \cdot x \cdot (-y) = -2xy$, $2 \cdot x \cdot 2 = 4x$, $2 \cdot (-y) \cdot 2 = -4y$. I tre quadrati invece sono sempre positivi.
```
