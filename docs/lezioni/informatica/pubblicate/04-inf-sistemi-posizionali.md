# I sistemi di numerazione posizionali

Dodici uova restano dodici comunque le scrivi: $12$, XII come sul quadrante di un orologio, oppure $1100_2$ come le conta un computer. Il numero è una quantità; la sua scrittura dipende dal **sistema di numerazione**, cioè dall'insieme dei simboli e delle regole che si usano per scrivere i numeri. Quello di tutti i giorni è posizionale e in base dieci, quello dei computer è posizionale e in base due: per passare dall'uno all'altro serve capire che cosa vuol dire "posizionale".

## Un sistema additivo: i numeri romani

I Romani usavano sette simboli, ognuno con un valore fisso:

| Simbolo | I | V | X | L | C | D | M |
|---|---|---|---|---|---|---|---|
| Valore | $1$ | $5$ | $10$ | $50$ | $100$ | $500$ | $1000$ |

Il valore di un numero romano si ottiene sommando i valori dei simboli, e per questo il sistema si dice **additivo**. C'è una sola eccezione: un simbolo scritto prima di uno più grande si sottrae, così IV vale $5 - 1 = 4$ e XC vale $100 - 10 = 90$.

```ad-example
Esempio 1: leggere un numero romano
Quanto vale MCMXC?

Si leggono i simboli da sinistra, tenendo insieme le coppie in cui il primo è più piccolo del secondo: M vale $1000$, CM vale $1000 - 100 = 900$, XC vale $100 - 10 = 90$.

$$
1000 + 900 + 90 = 1990
$$
```

In un sistema additivo un simbolo vale sempre lo stesso: la X di XII e la X di XC valgono tutte e due dieci, in qualunque punto si trovino. Il prezzo è alto. Per i numeri grandi servono simboli sempre nuovi, manca un simbolo per lo zero, e una moltiplicazione come XLVII per XIX non si può fare in colonna.

## Nei sistemi posizionali conta il posto

Nel numero $555$ la stessa cifra compare tre volte e vale ogni volta una cosa diversa: cinquecento, cinquanta, cinque. Un sistema di numerazione è **posizionale** quando il valore di una cifra dipende dal posto che occupa nel numero.

Un sistema posizionale ha una **base**, che è il numero di simboli diversi che usa; questi simboli sono le **cifre**. Il nostro sistema è in base dieci: le cifre sono dieci, da $0$ a $9$, e ogni posto vale dieci volte quello alla sua destra.

Le posizioni si contano da destra, partendo da $0$. Il **peso** di una posizione è la base elevata al numero della posizione: in base dieci la posizione $0$ pesa $10^0 = 1$, la posizione $1$ pesa $10^1 = 10$, la posizione $2$ pesa $10^2 = 100$, e così via. Il valore di una cifra è la cifra moltiplicata per il peso della sua posizione.

```tikz
% nome: pesi-posizioni-base-dieci
% alt: Il numero 4728 con una casella per cifra; sopra ogni cifra la posizione, da 3 a 0 contando da destra, e il peso, da dieci alla terza a dieci alla zero; sotto, il valore di ogni cifra: 4000, 700, 20 e 8
% svg: pesi-posizioni-base-dieci-7672890f.svg 270x114
\begin{tikzpicture}[font=\small]
\foreach \c/\p/\v [count=\i from 0] in {4/3/4000, 7/2/700, 2/1/20, 8/0/8} {
  \node[draw, thick, fill=blue!10, minimum width=1.2cm, minimum height=0.85cm, font=\large] at (1.35*\i,0) {$\c$};
  \node at (1.35*\i,1.55) {$\p$};
  \node at (1.35*\i,0.9) {$10^{\p}$};
  \node at (1.35*\i,-0.9) {$\v$};
}
\node[left] at (-0.85,1.55) {posizione};
\node[left] at (-0.85,0.9) {peso};
\node[left] at (-0.85,0) {cifra};
\node[left] at (-0.85,-0.9) {valore};
\end{tikzpicture}
```

Lo zero ha un compito preciso: tiene occupato un posto vuoto. In $407$ non ci sono decine, ma senza lo zero il $4$ scivolerebbe nella posizione $1$ e il numero diventerebbe $47$.

```ad-note
Da dove viene il nostro sistema
Le cifre che usiamo e la scrittura posizionale in base dieci sono nate in India e sono arrivate in Europa attraverso i matematici arabi. In Italia le fece conoscere Leonardo Pisano, detto Fibonacci, con il Liber abaci del 1202.
```

## La forma polinomiale

Scrivere un numero come somma delle sue cifre, ognuna moltiplicata per il peso della sua posizione, vuol dire scriverlo in **forma polinomiale**:

$$
4728 = 4 \cdot 10^3 + 7 \cdot 10^2 + 2 \cdot 10^1 + 8 \cdot 10^0
$$

Gli esponenti scendono di uno alla volta e l'ultimo è sempre $0$, perché l'ultima cifra a destra è quella delle unità e $10^0 = 1$ (lo trovi nella lezione [Potenze in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/potenze-in-n)). Un numero di quattro cifre ha quindi gli esponenti $3$, $2$, $1$, $0$.

```ad-warning
L'esponente più alto è il numero delle cifre meno uno
Le posizioni partono da $0$, non da $1$. Scrivere $4 \cdot 10^4 + 7 \cdot 10^3 + 2 \cdot 10^2 + 8 \cdot 10^1$ dà $47\,280$: ogni cifra è finita un posto più a sinistra.
```

## Cambiare base

Il dieci non ha niente di speciale, a parte le dita delle mani. Con le stesse regole si costruisce un sistema posizionale in qualunque base $b$ maggiore di $1$:

- le cifre sono $b$, da $0$ a $b - 1$;
- il peso della posizione $k$ è $b^k$;
- il valore del numero è la somma delle cifre, ognuna moltiplicata per il suo peso.

| Base | Nome | Cifre | Pesi, da destra |
|---|---|---|---|
| $2$ | binario | $0, 1$ | $1, 2, 4, 8, 16, \dots$ |
| $5$ | in base cinque | $0, 1, 2, 3, 4$ | $1, 5, 25, 125, \dots$ |
| $8$ | ottale | da $0$ a $7$ | $1, 8, 64, 512, \dots$ |
| $10$ | decimale | da $0$ a $9$ | $1, 10, 100, 1000, \dots$ |

Per dire in che base è scritto un numero, la base si mette in piccolo in basso a destra: $1101_2$ è un numero in base due, $324_5$ in base cinque, $207_8$ in base otto. Un numero senza indicazione è in base dieci; quando nella stessa riga compaiono più basi si scrive anche $13_{10}$. Le cifre si leggono una alla volta: $1101_2$ è "uno uno zero uno in base due", non "millecentouno".

```ad-warning
Una cifra non può essere uguale alla base
In base $b$ la cifra più grande è $b - 1$. La scrittura $128_8$ non è un numero in base otto, perché la cifra $8$ in base otto non esiste; allo stesso modo in base due non esiste la cifra $2$.
```

### Dal numero in base b al suo valore in base dieci

La forma polinomiale è anche il modo per sapere quanto vale un numero scritto in un'altra base.

1. Numera le posizioni da destra, partendo da $0$.
2. Scrivi sopra ogni cifra il peso della sua posizione: $b^0 = 1$, poi $b^1$, $b^2$ e così via.
3. Moltiplica ogni cifra per il suo peso.
4. Somma i prodotti: il risultato è il valore in base dieci.

```ad-example
Esempio 2: un numero in base due
Quanto vale $1101_2$?

Le cifre sono quattro, quindi i pesi, da sinistra, sono $2^3 = 8$, $2^2 = 4$, $2^1 = 2$, $2^0 = 1$.

$$
1101_2 = 1 \cdot 8 + 1 \cdot 4 + 0 \cdot 2 + 1 \cdot 1 = 8 + 4 + 0 + 1 = 13
$$
```

```tikz
% nome: pesi-posizioni-base-due
% alt: Il numero binario 1101 con una casella per cifra; sopra ogni cifra la posizione, da 3 a 0 contando da destra, e il peso, cioè 8, 4, 2 e 1; sotto, il valore di ogni cifra: 8, 4, 0 e 1, la cui somma è 13
% svg: pesi-posizioni-base-due-8248bc23.svg 270x141
\begin{tikzpicture}[font=\small]
\foreach \c/\p/\w/\v [count=\i from 0] in {1/3/8/8, 1/2/4/4, 0/1/2/0, 1/0/1/1} {
  \node[draw, thick, fill=blue!10, minimum width=1.2cm, minimum height=0.85cm, font=\large] at (1.35*\i,0) {$\c$};
  \node at (1.35*\i,1.55) {$\p$};
  \node at (1.35*\i,0.9) {$2^{\p} = \w$};
  \node at (1.35*\i,-0.9) {$\v$};
}
\node[left] at (-0.85,1.55) {posizione};
\node[left] at (-0.85,0.9) {peso};
\node[left] at (-0.85,0) {cifra};
\node[left] at (-0.85,-0.9) {valore};
\node at (2.02,-1.6) {$8 + 4 + 0 + 1 = 13$};
\end{tikzpicture}
```

```ad-example
Esempio 3: un numero in base cinque
Quanto vale $324_5$?

I pesi sono $5^2 = 25$, $5^1 = 5$, $5^0 = 1$.

$$
324_5 = 3 \cdot 25 + 2 \cdot 5 + 4 \cdot 1 = 75 + 10 + 4 = 89
$$
```

```ad-example
Esempio 4: una cifra zero in mezzo
Quanto vale $207_8$?

I pesi sono $8^2 = 64$, $8^1 = 8$, $8^0 = 1$. Lo zero occupa la posizione $1$: non aggiunge niente alla somma, ma tiene il $2$ nella posizione $2$.

$$
207_8 = 2 \cdot 64 + 0 \cdot 8 + 7 \cdot 1 = 128 + 0 + 7 = 135
$$
```

```ad-warning
Le stesse cifre, in basi diverse, sono numeri diversi
$101_2 = 5$, $101_5 = 26$, $101_8 = 65$ e $101_{10} = 101$. Senza la base la scrittura $101$ non dice quale numero è, e leggerla "centouno" è giusto solo in base dieci.
```

## Contare in un'altra base

In base dieci, dopo il $9$ le cifre sono finite: la posizione $0$ torna a $0$ e la posizione $1$ aumenta di uno, e si scrive $10$. In ogni base succede lo stesso, appena si arriva alla cifra più grande.

| Base dieci | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ | $9$ | $10$ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Base due | $0$ | $1$ | $10$ | $11$ | $100$ | $101$ | $110$ | $111$ | $1000$ | $1001$ | $1010$ |
| Base cinque | $0$ | $1$ | $2$ | $3$ | $4$ | $10$ | $11$ | $12$ | $13$ | $14$ | $20$ |
| Base otto | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $10$ | $11$ | $12$ |

In ogni base la scrittura $10$ indica la base stessa: $10_2$ è due, $10_5$ è cinque, $10_8$ è otto. Più la base è piccola, più cifre servono per lo stesso numero: dieci si scrive con due cifre in base dieci e con quattro in base due.

```ad-tip
Quanti numeri si scrivono con n cifre
Con $n$ cifre in base $b$ si scrivono $b^n$ numeri, da $0$ a $b^n - 1$. Con tre cifre decimali sono $10^3 = 1000$, da $0$ a $999$; con tre cifre binarie sono $2^3 = 8$, da $0$ a $111_2 = 7$.
```

## Perché i computer usano la base due

Un circuito elettronico distingue con sicurezza due sole condizioni, per esempio una tensione alta e una bassa. Due condizioni bastano per due cifre, $0$ e $1$: sono i bit di cui parla la lezione [Bit, byte e unità di misura](/materiale/scuola-superiore/informatica/informatica-e-informazione/bit-byte-e-unita-di-misura). Poiché il binario è un sistema posizionale come il nostro, tutto quello che sai fare in base dieci si può rifare in base due: passare da una base all'altra è l'argomento della lezione [Conversioni tra binario e decimale](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/conversioni-tra-binario-e-decimale), le operazioni in colonna quello di [Addizione e moltiplicazione in binario](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/addizione-e-moltiplicazione-in-binario).
