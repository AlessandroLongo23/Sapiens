# Potenze in ℚ

Elevare una frazione a potenza vuol dire moltiplicarla per sé stessa tante volte quante indica l'esponente, esattamente come si fa con i numeri naturali: $\left(\dfrac{2}{3}\right)^3 = \dfrac{2}{3} \cdot \dfrac{2}{3} \cdot \dfrac{2}{3}$. Base, esponente e proprietà sono quelli della lezione [Potenze in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/potenze-in-n); qui vedi cosa cambia quando la base è una frazione, quando è negativa e quando l'esponente è zero o un intero negativo.

## Potenza di una frazione

Per moltiplicare due frazioni si moltiplicano i numeratori tra loro e i denominatori tra loro. Moltiplicando $n$ volte la stessa frazione si ottiene quindi il numeratore elevato alla $n$ fratto il denominatore elevato alla $n$:

$$\left(\dfrac{a}{b}\right)^n = \dfrac{a^n}{b^n} \qquad (b \neq 0)$$

```ad-example
Esempio: elevare una frazione al quadrato e al cubo
$\left(\dfrac{2}{3}\right)^3 = \dfrac{2^3}{3^3} = \dfrac{8}{27}$

$\left(\dfrac{5}{2}\right)^2 = \dfrac{5^2}{2^2} = \dfrac{25}{4}$
```

L'esponente riguarda tutta la frazione solo se la frazione è chiusa tra parentesi. Senza parentesi, $\dfrac{2^2}{3}$ vuol dire che solo il numeratore è elevato al quadrato, e vale $\dfrac{4}{3}$, mentre $\left(\dfrac{2}{3}\right)^2 = \dfrac{4}{9}$.

## Il segno della potenza

Quando la base è negativa, il segno del risultato dipende dall'esponente, con la stessa regola dei [numeri interi](/materiale/scuola-superiore/matematica/numeri-interi/potenze-in-z): ogni coppia di fattori negativi dà un prodotto positivo, quindi

- con esponente pari il risultato è positivo;
- con esponente dispari il risultato è negativo.

```ad-example
Esempio: base negativa, esponente pari e dispari
$\left(-\dfrac{2}{3}\right)^2 = \left(-\dfrac{2}{3}\right) \cdot \left(-\dfrac{2}{3}\right) = +\dfrac{4}{9}$

$\left(-\dfrac{2}{3}\right)^3 = \left(-\dfrac{2}{3}\right) \cdot \left(-\dfrac{2}{3}\right) \cdot \left(-\dfrac{2}{3}\right) = -\dfrac{8}{27}$
```

### Le parentesi decidono qual è la base

In $\left(-\dfrac{2}{3}\right)^2$ la base è $-\dfrac{2}{3}$, segno compreso. In $-\left(\dfrac{2}{3}\right)^2$ la base è $\dfrac{2}{3}$: prima si calcola la potenza, poi si mette il segno meno davanti al risultato.

$$\left(-\dfrac{2}{3}\right)^2 = +\dfrac{4}{9} \qquad\qquad -\left(\dfrac{2}{3}\right)^2 = -\dfrac{4}{9}$$

Con esponente dispari le due scritture danno lo stesso numero, $-\dfrac{8}{27}$, ma per ragioni diverse. Nel dubbio conviene sempre chiedersi quale numero è moltiplicato per sé stesso.

```ad-warning
Dimenticare le parentesi
$-\left(\dfrac{2}{3}\right)^2 = -\dfrac{4}{9}$ mentre $\left(-\dfrac{2}{3}\right)^2 = \dfrac{4}{9}$; allo stesso modo $\dfrac{2^2}{3} = \dfrac{4}{3}$ mentre $\left(\dfrac{2}{3}\right)^2 = \dfrac{4}{9}$. L'esponente si applica solo a quello che gli sta immediatamente a sinistra: un numero o una parentesi.
```

## Esponente 1 ed esponente 0

Una potenza con esponente $1$ è uguale alla base: $\left(\dfrac{3}{4}\right)^1 = \dfrac{3}{4}$.

Una potenza con esponente $0$ e base diversa da zero vale $1$:

$$a^0 = 1 \qquad (a \neq 0)$$

Il motivo si vede dividendo una potenza per sé stessa. Da una parte $\left(\dfrac{3}{4}\right)^2 : \left(\dfrac{3}{4}\right)^2 = 1$, perché ogni numero diverso da zero diviso per sé stesso dà $1$; dall'altra, con la proprietà del quoziente di potenze con la stessa base, $\left(\dfrac{3}{4}\right)^{2-2} = \left(\dfrac{3}{4}\right)^0$. Perché la proprietà continui a valere, $\left(\dfrac{3}{4}\right)^0$ deve essere $1$. La scrittura $0^0$ invece non ha significato, perché questo ragionamento richiede di dividere per zero.

```ad-example
Esempio: esponente zero e segno
$\left(-\dfrac{5}{7}\right)^0 = 1$, perché la base è $-\dfrac{5}{7}$.

$-\left(\dfrac{5}{7}\right)^0 = -1$, perché la base è $\dfrac{5}{7}$ e il segno meno resta fuori.
```

## Esponente negativo

Una potenza con esponente intero negativo è il reciproco della potenza con l'esponente opposto:

$$a^{-n} = \dfrac{1}{a^n} \qquad (a \neq 0)$$

Anche questa definizione nasce dal quoziente di potenze. Da una parte $2^2 : 2^5 = \dfrac{2 \cdot 2}{2 \cdot 2 \cdot 2 \cdot 2 \cdot 2} = \dfrac{1}{2^3}$; dall'altra, con la proprietà, $2^{2-5} = 2^{-3}$. Quindi $2^{-3}$ deve valere $\dfrac{1}{2^3} = \dfrac{1}{8}$.

Quando la base è una frazione, il reciproco si ottiene scambiando numeratore e denominatore, perciò

$$\left(\dfrac{a}{b}\right)^{-n} = \left(\dfrac{b}{a}\right)^n \qquad (a \neq 0,\ b \neq 0)$$

In pratica: si scrive il reciproco della base e si cambia segno all'esponente. Il segno della base resta quello che era, e la regola di pari e dispari si applica all'esponente positivo che si ottiene.

```ad-example
Esempio: potenze con esponente negativo
$2^{-3} = \dfrac{1}{2^3} = \dfrac{1}{8}$

$\left(\dfrac{2}{3}\right)^{-2} = \left(\dfrac{3}{2}\right)^2 = \dfrac{9}{4}$

$\left(\dfrac{1}{7}\right)^{-1} = 7^1 = 7$

$\left(-\dfrac{1}{2}\right)^{-3} = (-2)^3 = -8$
```

```ad-warning
L'esponente negativo non rende negativo il risultato
$2^{-3}$ non vale $-8$ e nemmeno $-\dfrac{1}{8}$: vale $\dfrac{1}{8}$. L'esponente negativo dice di prendere il reciproco; il segno del risultato dipende solo dalla base e dall'esponente pari o dispari.
```

```ad-warning
Cambiare il segno della base insieme all'esponente
$\left(\dfrac{2}{3}\right)^{-3}$ è $\left(\dfrac{3}{2}\right)^3 = \dfrac{27}{8}$, non $\left(-\dfrac{3}{2}\right)^3 = -\dfrac{27}{8}$. Il reciproco di un numero positivo è positivo.
```

L'esponente $-1$ dà il reciproco del numero: $\left(\dfrac{4}{5}\right)^{-1} = \dfrac{5}{4}$. Lo zero non ha reciproco, per questo $0^{-n}$ non ha significato.

```ad-tip
Potenze di 10
Con base $10$ l'esponente negativo conta le cifre dopo la virgola: $10^{-1} = 0{,}1$, $10^{-2} = 0{,}01$, $10^{-3} = 0{,}001$. In $10^{-n}$ la cifra $1$ occupa l'$n$-esimo posto dopo la virgola.
```

## Le proprietà delle potenze

Le proprietà che conosci per i numeri naturali valgono anche in ℚ, con esponenti interi qualunque (positivi, negativi o zero), purché le basi siano diverse da zero.

| Proprietà | Formula | Esempio |
|---|---|---|
| Prodotto, stessa base | $a^m \cdot a^n = a^{m+n}$ | $\left(\frac{2}{3}\right)^2 \cdot \left(\frac{2}{3}\right)^{-5} = \left(\frac{2}{3}\right)^{-3}$ |
| Quoziente, stessa base | $a^m : a^n = a^{m-n}$ | $\left(\frac{3}{4}\right)^5 : \left(\frac{3}{4}\right)^2 = \left(\frac{3}{4}\right)^3$ |
| Potenza di potenza | $\left(a^m\right)^n = a^{m \cdot n}$ | $\left[\left(\frac{1}{2}\right)^3\right]^{-2} = \left(\frac{1}{2}\right)^{-6}$ |
| Prodotto, stesso esponente | $a^n \cdot b^n = (a \cdot b)^n$ | $\left(\frac{2}{3}\right)^3 \cdot \left(\frac{9}{4}\right)^3 = \left(\frac{3}{2}\right)^3$ |
| Quoziente, stesso esponente | $a^n : b^n = (a : b)^n$ | $\left(\frac{5}{6}\right)^2 : \left(\frac{5}{3}\right)^2 = \left(\frac{1}{2}\right)^2$ |

Nel quarto esempio $\dfrac{2}{3} \cdot \dfrac{9}{4} = \dfrac{18}{12} = \dfrac{3}{2}$; nel quinto $\dfrac{5}{6} : \dfrac{5}{3} = \dfrac{5}{6} \cdot \dfrac{3}{5} = \dfrac{1}{2}$.

Per la somma e la differenza di potenze non c'è nessuna proprietà: $\left(\dfrac{1}{2}\right)^2 + \left(\dfrac{1}{2}\right)^3$ si calcola facendo le due potenze e poi la somma.

```ad-warning
Sommare gli esponenti in una somma
$\left(\dfrac{1}{2}\right)^2 + \left(\dfrac{1}{2}\right)^3$ non è $\left(\dfrac{1}{2}\right)^5$. Vale $\dfrac{1}{4} + \dfrac{1}{8} = \dfrac{3}{8}$, mentre $\left(\dfrac{1}{2}\right)^5 = \dfrac{1}{32}$. Gli esponenti si sommano solo nel prodotto di potenze con la stessa base.
```

## Esempi svolti

```ad-example
Esempio 1: esponente negativo con base negativa
Calcola $\left(-\dfrac{3}{2}\right)^{-2} \cdot \left(\dfrac{2}{3}\right)^3$.

Il reciproco di $-\dfrac{3}{2}$ è $-\dfrac{2}{3}$, quindi $\left(-\dfrac{3}{2}\right)^{-2} = \left(-\dfrac{2}{3}\right)^2$. L'esponente è pari, perciò il segno sparisce: $\left(-\dfrac{2}{3}\right)^2 = \left(\dfrac{2}{3}\right)^2$.

Ora le basi sono uguali e si sommano gli esponenti:

$$\left(\dfrac{2}{3}\right)^2 \cdot \left(\dfrac{2}{3}\right)^3 = \left(\dfrac{2}{3}\right)^5 = \dfrac{32}{243}$$
```

```ad-example
Esempio 2: potenza di potenza e quoziente
Calcola $\left[\left(\dfrac{1}{2}\right)^{-3}\right]^2 : 2^4$.

Prima si porta tutto alla base $2$: $\left(\dfrac{1}{2}\right)^{-3} = 2^3$. Poi

$$\left(2^3\right)^2 : 2^4 = 2^6 : 2^4 = 2^2 = 4$$
```

```ad-example
Esempio 3: basi reciproche
Calcola $\left(\dfrac{5}{3}\right)^{-4} \cdot \left(\dfrac{5}{3}\right)^6 : \left(\dfrac{3}{5}\right)^{-1}$.

Il prodotto ha la stessa base: $\left(\dfrac{5}{3}\right)^{-4+6} = \left(\dfrac{5}{3}\right)^2$. Il divisore è $\left(\dfrac{3}{5}\right)^{-1} = \dfrac{5}{3}$, cioè $\left(\dfrac{5}{3}\right)^1$. Quindi

$$\left(\dfrac{5}{3}\right)^2 : \left(\dfrac{5}{3}\right)^1 = \left(\dfrac{5}{3}\right)^1 = \dfrac{5}{3}$$
```

```ad-example
Esempio 4: attenzione ai segni
Calcola $-\left(\dfrac{1}{2}\right)^2 + \left(-\dfrac{1}{2}\right)^{-2} - \left(-\dfrac{2}{3}\right)^0$.

Si calcolano i tre termini uno per uno:

- $-\left(\dfrac{1}{2}\right)^2 = -\dfrac{1}{4}$, perché il meno è fuori dalla parentesi;
- $\left(-\dfrac{1}{2}\right)^{-2} = (-2)^2 = 4$, perché l'esponente è pari;
- $\left(-\dfrac{2}{3}\right)^0 = 1$, quindi il terzo termine è $-1$.

$$-\dfrac{1}{4} + 4 - 1 = -\dfrac{1}{4} + 3 = \dfrac{11}{4}$$
```
