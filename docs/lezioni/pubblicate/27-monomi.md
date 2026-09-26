# Monomi

In algebra le lettere stanno al posto dei numeri. Un rettangolo con la base lunga $3a$ e l'altezza lunga $2b$ ha area $3a \cdot 2b = 6ab$, qualunque siano le misure $a$ e $b$: la scrittura $6ab$ vale per tutti i rettangoli di quella forma insieme. Le espressioni come $6ab$, fatte di un numero e di lettere moltiplicati tra loro, si chiamano monomi, e sono i mattoni di tutto il calcolo letterale.

```tikz
% nome: monomio-area-rettangolo
% alt: Rettangolo con base 3a e altezza 2b diviso in sei rettangoli uguali di lati a e b, ciascuno di area ab: l'area totale è 6ab
% svg: monomio-area-rettangolo-459f2c60.svg 220x125
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (4.8,2.4);
\draw (1.6,0) -- (1.6,2.4);
\draw (3.2,0) -- (3.2,2.4);
\draw (0,1.2) -- (4.8,1.2);
\node at (0.8,0.6) {$ab$};
\node at (2.4,0.6) {$ab$};
\node at (4.0,0.6) {$ab$};
\node at (0.8,1.8) {$ab$};
\node at (2.4,1.8) {$ab$};
\node at (4.0,1.8) {$ab$};
\draw[<->] (0,-0.3) -- (4.8,-0.3);
\node[below] at (2.4,-0.35) {$3a$};
\draw[<->] (5.1,0) -- (5.1,2.4);
\node[right] at (5.15,1.2) {$2b$};
\end{tikzpicture}
```

## Espressioni letterali

Un'**espressione letterale** è una scrittura in cui numeri e lettere sono legati dai segni delle operazioni, come $2a + 3b$, $\dfrac{x}{y}$ oppure $5x^2y$. Ogni lettera rappresenta un numero qualsiasi, e per questo un'espressione letterale descrive in una volta sola un calcolo che si può fare con tanti numeri diversi.

Tra un numero e una lettera, o tra due lettere, il segno di moltiplicazione di solito non si scrive: $5 \cdot x \cdot y$ si scrive $5xy$, e $a \cdot a$ si scrive $a^2$. Tra due numeri invece il $\cdot$ resta, perché $2 \cdot 3$ scritto $23$ diventerebbe un altro numero.

## Che cos'è un monomio

Un **monomio** è un'espressione letterale in cui tra numeri e lettere c'è solo la moltiplicazione, e ogni lettera ha per esponente un numero naturale. Sono monomi

$$
\begin{gathered}
-3x^2y \qquad \frac{1}{2}ab \qquad x \qquad -7 \\
4 \cdot a \cdot b \cdot a
\end{gathered}
$$

L'ultimo è un monomio anche se è scritto in modo scomodo: contiene solo prodotti, e con qualche passaggio diventa $4a^2b$.

### Coefficiente e parte letterale

Un monomio è in **forma normale** quando è scritto come un solo numero, davanti, seguito dalle lettere, ognuna scritta una volta sola con il suo esponente. Il numero si chiama **coefficiente**, l'insieme delle lettere con i loro esponenti si chiama **parte letterale**.

```ad-example
Esempio 1: coefficiente e parte letterale
In $-3x^2y$ il coefficiente è $-3$ e la parte letterale è $x^2y$.

In $\dfrac{1}{2}ab$ il coefficiente è $\dfrac{1}{2}$ e la parte letterale è $ab$.

In $x^3$ il coefficiente è $1$, in $-ab^2$ è $-1$: il coefficiente $1$ non si scrive, e di $-1$ si scrive solo il segno meno.
```

Il segno fa parte del coefficiente: in $-3x^2y$ il coefficiente è $-3$, non $3$. Anche una frazione con le lettere al numeratore è un monomio, perché dividere per un numero vuol dire moltiplicare per il suo reciproco: $\dfrac{x^2}{5} = \dfrac{1}{5}x^2$, con coefficiente $\dfrac{1}{5}$.

```ad-warning
La lettera senza numero davanti
Il coefficiente di $x$ è $1$, non $0$: $x = 1 \cdot x$. Allo stesso modo il coefficiente di $-x$ è $-1$.
```

Le lettere di solito si scrivono in ordine alfabetico, $3ab^2$ e non $3b^2a$. È un'abitudine, non una regola: il prodotto è commutativo e le due scritture indicano lo stesso monomio, ma nell'ordine alfabetico è più facile confrontare due monomi a colpo d'occhio.

### Ridurre un monomio a forma normale

Un monomio scritto come prodotto di più fattori si porta a forma normale con le proprietà della moltiplicazione e delle [potenze](/materiale/scuola-superiore/matematica/numeri-razionali/potenze-in-q):

1. Moltiplica tra loro tutti i numeri, con la regola dei segni: ottieni il coefficiente.
2. Raggruppa le potenze della stessa lettera e somma i loro esponenti, perché $x^m \cdot x^n = x^{m+n}$. Una lettera scritta senza esponente ha esponente $1$.
3. Scrivi il coefficiente e poi le lettere, in ordine alfabetico.

```ad-example
Esempio 2: numeri e lettere mescolati
$$3x \cdot y \cdot (-x)$$

I numeri sono $3$ e $-1$ (il meno davanti alla seconda $x$): il coefficiente è $3 \cdot (-1) = -3$.

La $x$ compare due volte, con esponente $1$ ogni volta: $x \cdot x = x^{1+1} = x^2$. La $y$ compare una volta.

$$3x \cdot y \cdot (-x) = -3x^2y$$
```

```ad-example
Esempio 3: coefficienti frazionari e due segni meno
$$-\frac{2}{3}a^2b \cdot \frac{9}{4}ab^3 \cdot (-b)$$

Il coefficiente è il prodotto dei numeri, $-\dfrac{2}{3}$, $\dfrac{9}{4}$ e $-1$. I segni meno sono due, quindi il risultato è positivo, e semplificando in croce:

$$\left(-\frac{2}{3}\right) \cdot \frac{9}{4} \cdot (-1) = \frac{2 \cdot 9}{3 \cdot 4} = \frac{3}{2}$$

Per le lettere: $a^2 \cdot a = a^3$ e $b \cdot b^3 \cdot b = b^{1+3+1} = b^5$.

$$-\frac{2}{3}a^2b \cdot \frac{9}{4}ab^3 \cdot (-b) = \frac{3}{2}a^3b^5$$
```

```ad-example
Esempio 4: una potenza nel coefficiente
$$(-2)^3 x \cdot y^2 \cdot \frac{1}{4}x^4y$$

La potenza $(-2)^3 = -8$ è un numero, e va nel coefficiente: $-8 \cdot \dfrac{1}{4} = -2$.

Per le lettere: $x \cdot x^4 = x^5$ e $y^2 \cdot y = y^3$.

$$(-2)^3 x \cdot y^2 \cdot \frac{1}{4}x^4y = -2x^5y^3$$
```

```ad-warning
Gli esponenti dei numeri e quelli delle lettere
Nell'esempio 4 l'esponente $3$ di $(-2)^3$ riguarda solo il numero: diventa parte del coefficiente e non si somma agli esponenti di $x$ e $y$. Allo stesso modo, in $3x \cdot 2x$ i numeri si moltiplicano, $3 \cdot 2 = 6$, e gli esponenti si sommano: $6x^2$, non $5x^2$ e nemmeno $6x$.
```

## Monomio nullo e costanti

Un monomio con coefficiente $0$ vale $0$ qualunque sia la sua parte letterale, perché $0 \cdot x^2y = 0$. Per questo si scrive $0$ e si chiama **monomio nullo**.

Un numero da solo, come $-7$ o $\dfrac{3}{4}$, è un monomio senza parte letterale, e si chiama anche **costante**: il suo valore non dipende da nessuna lettera.

Costanti e monomio nullo si distinguono anche per il grado: una costante diversa da zero ha grado $0$, il monomio nullo non ha grado. Il perché è nella lezione sul [grado di un monomio](/materiale/scuola-superiore/matematica/monomi-e-polinomi/grado-di-un-monomio).

```ad-note
Monomi simili, uguali e opposti
Due monomi con la stessa parte letterale, come $3x^2y$ e $-\frac{1}{2}x^2y$, si dicono simili. Questa definizione e quelle di monomi uguali e opposti sono nella lezione sulle [operazioni tra monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-monomi), perché servono per sommarli.
```

## Espressioni che non sono monomi

Un'espressione letterale non è un monomio in tre casi.

C'è un'addizione o una sottrazione tra termini che non hanno la stessa parte letterale, come in $2x + y$, $a^2 - b$ oppure $x^2 + x$. Queste espressioni sono [polinomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio): somme di più monomi.

C'è una lettera al denominatore, come in $\dfrac{3}{x}$ o $\dfrac{a}{b}$. Una divisione per un numero è ammessa, perché diventa una moltiplicazione per il reciproco; una divisione per una lettera no.

Una lettera ha un esponente che non è un numero naturale. Un esponente negativo porta la lettera al denominatore, perché $x^{-2} = \dfrac{1}{x^2}$, come nelle [potenze con esponente negativo](/materiale/scuola-superiore/matematica/numeri-razionali/potenze-in-q); un esponente frazionario, come in $x^{\frac{1}{2}}$, indica una radice, $x^{\frac{1}{2}} = \sqrt{x}$, e le lettere sotto radice non sono ammesse. Anche una lettera all'esponente, come in $2^x$, esclude il monomio: l'esponente deve essere un numero naturale fissato.

```ad-example
Esempio 5: monomio o no
$-\dfrac{x^2y}{5}$ è un monomio: è $-\dfrac{1}{5}x^2y$, con la divisione per $5$ che diventa il coefficiente.

$\dfrac{5}{x^2y}$ non è un monomio: le lettere sono al denominatore.

$3a^2b^{-1}$ non è un monomio: $b^{-1} = \dfrac{1}{b}$, quindi la $b$ è al denominatore.

$4 \cdot a \cdot b \cdot a$ è un monomio: in forma normale è $4a^2b$.

$x^2 - y$ non è un monomio: c'è una sottrazione tra termini con parti letterali diverse.

$\dfrac{2}{3}$ è un monomio: è una costante.
```

```ad-warning
Il numero al denominatore non esclude il monomio
$\dfrac{x}{3}$ è un monomio, con coefficiente $\dfrac{1}{3}$; $\dfrac{3}{x}$ non lo è. Conta dove sta la lettera, non se c'è una linea di frazione.
```

```ad-note
Somme che si riducono a un monomio
$3x + 2x$ contiene un'addizione, ma i due termini hanno la stessa parte letterale e la somma vale $5x$, che è un monomio. Come si sommano i monomi con la stessa parte letterale è spiegato nella lezione sulle [operazioni tra monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-monomi).
```

## Valore numerico di un monomio

Il **valore numerico** di un monomio è il numero che si ottiene sostituendo a ogni lettera un numero assegnato e facendo i calcoli. Lo stesso monomio ha valori diversi per numeri diversi: $6ab$, l'area del rettangolo dell'inizio, vale $6 \cdot 2 \cdot 5 = 60$ se $a = 2$ e $b = 5$, e $6 \cdot 1 \cdot 3 = 18$ se $a = 1$ e $b = 3$.

1. Riscrivi il monomio mettendo al posto di ogni lettera il suo valore, tra parentesi tonde.
2. Calcola le potenze.
3. Moltiplica tutto, con la regola dei segni.

Le parentesi servono soprattutto quando il numero è negativo o è una frazione, perché l'esponente deve riguardare tutto il numero sostituito.

```ad-example
Esempio 6: numeri interi positivi
Valore di $3x^2y$ per $x = 2$ e $y = 5$.

$$3 \cdot (2)^2 \cdot (5) = 3 \cdot 4 \cdot 5 = 60$$
```

```ad-example
Esempio 7: un numero negativo
Valore di $-2a^3b^2$ per $a = -1$ e $b = 3$.

$$
\begin{aligned}
&-2 \cdot (-1)^3 \cdot (3)^2 \\
&= -2 \cdot (-1) \cdot 9 \\
&= 18
\end{aligned}
$$

L'esponente di $(-1)^3$ è dispari, quindi la potenza è negativa; con il $-2$ davanti i segni meno diventano due e il risultato è positivo.
```

```ad-warning
Sostituire un numero negativo senza parentesi
Valore di $x^2$ per $x = -3$: si scrive $(-3)^2 = 9$. Senza parentesi si ottiene $-3^2 = -9$, che è sbagliato, perché lì l'esponente riguarda solo il $3$.
```

```ad-example
Esempio 8: il segno meno davanti a una potenza
Valore di $-x^2$ per $x = -3$.

$$-(-3)^2 = -9$$

Prima si calcola la potenza, $(-3)^2 = 9$, poi si applica il segno meno del coefficiente, che è $-1$. Il risultato è $-9$, anche se $x$ è negativo: nel monomio $-x^2$ l'esponente riguarda solo la $x$, non il segno meno.
```

```ad-example
Esempio 9: frazioni e segni
Valore di $\dfrac{3}{4}x^2y$ per $x = -\dfrac{2}{3}$ e $y = -6$.

$$\frac{3}{4} \cdot \left(-\frac{2}{3}\right)^2 \cdot (-6) = \frac{3}{4} \cdot \frac{4}{9} \cdot (-6)$$

Semplificando in croce, $\dfrac{3}{4} \cdot \dfrac{4}{9} = \dfrac{1}{3}$, e poi $\dfrac{1}{3} \cdot (-6) = -2$.
```

```ad-example
Esempio 10: una lettera che vale zero
Valore di $-\dfrac{5}{2}a^2bc^3$ per $a = 4$, $b = 0$, $c = -1$.

Uno dei fattori è $0$, quindi il prodotto è $0$ senza fare altri conti. Un monomio vale $0$ ogni volta che almeno una delle sue lettere vale $0$.
```

Quando un monomio non è in forma normale, conviene ridurlo prima di sostituire: $3x \cdot y \cdot (-x)$ diventa $-3x^2y$, e per $x = 2$, $y = 1$ vale $-3 \cdot 4 \cdot 1 = -12$, con meno conti che sostituendo nella scrittura lunga.
