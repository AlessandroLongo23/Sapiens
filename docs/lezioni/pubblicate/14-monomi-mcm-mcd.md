# MCD e MCM tra monomi

Come tra i numeri naturali, anche tra i monomi si cercano il massimo comune divisore e il minimo comune multiplo. Si calcolano con lo stesso ragionamento che conosci dalla lezione su [MCD e MCM in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/mcd-e-mcm-in-n): lì si confrontano gli esponenti dei fattori primi, qui gli esponenti delle lettere. Ti serviranno per semplificare le frazioni con le lettere e per trovare il denominatore comune quando le sommi.

## Divisori e multipli di un monomio

Un monomio $A$ è **divisibile** per un monomio $B$ diverso da zero se il quoziente $A : B$ è ancora un monomio, cioè se ogni lettera di $B$ compare in $A$ con un esponente maggiore o uguale (lo trovi nella lezione sulle [operazioni tra monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-monomi)). In questo caso $B$ è un divisore di $A$ e $A$ è un multiplo di $B$.

Per esempio $12x^3y$ è divisibile per $4x^2$, perché $12x^3y : 4x^2 = 3xy$. Non è divisibile per $x^2y^2$, perché nel divisore la $y$ ha esponente $2$ e nel dividendo solo $1$.

## Definizioni

Dati due o più monomi diversi da zero:

- il **massimo comune divisore** (MCD) è il monomio di grado più alto tra quelli che li dividono tutti;
- il **minimo comune multiplo** (MCM) è il monomio di grado più basso tra quelli che sono multipli di tutti.

Queste definizioni fissano la parte letterale, ma non il coefficiente: se $2x$ divide un monomio, lo dividono anche $5x$, $-x$ e $\frac{1}{3}x$, perché si può dividere per qualsiasi numero diverso da zero. Per avere un risultato unico si segue una convenzione sul coefficiente.

## La regola di calcolo

Coefficiente e parte letterale si trattano separatamente.

Per il coefficiente:

- se tutti i coefficienti sono numeri interi, il coefficiente del MCD è il MCD dei loro valori assoluti e il coefficiente del MCM è il MCM dei loro valori assoluti;
- se almeno un coefficiente è una frazione, il coefficiente sia del MCD sia del MCM è $1$.

In entrambi i casi il coefficiente è positivo: i segni dei monomi di partenza non contano.

Per la parte letterale:

- nel MCD vanno le lettere comuni a tutti i monomi, ognuna con l'esponente più piccolo con cui compare;
- nel MCM vanno tutte le lettere, comuni e non comuni, ognuna con l'esponente più grande con cui compare.

```ad-note
La convenzione sul coefficiente
I libri di testo non fanno tutti la stessa scelta. Quella di questa lezione è la più diffusa; alcuni testi mettono sempre coefficiente $1$, anche con coefficienti interi. Se il tuo libro o il tuo insegnante usano un'altra convenzione, segui quella: la parte letterale non cambia.
```

## Procedimento

1. Scrivi ogni monomio in forma normale.
2. Guarda i coefficienti: se sono tutti interi calcola MCD e MCM dei loro valori assoluti, altrimenti il coefficiente è $1$.
3. Per il MCD, prendi le lettere che compaiono in tutti i monomi, con l'esponente minimo.
4. Per il MCM, prendi tutte le lettere che compaiono almeno una volta, con l'esponente massimo.
5. Scrivi il risultato con coefficiente positivo.

## Esempi svolti

```ad-example
Esempio 1: due monomi con le stesse lettere
Trova MCD e MCM di $12x^3y^2$ e $18x^2y^5$.

Coefficienti interi: $\text{MCD}(12, 18) = 6$ e $\text{MCM}(12, 18) = 36$.

Lettera $x$: esponenti $3$ e $2$, il minimo è $2$ e il massimo è $3$.

Lettera $y$: esponenti $2$ e $5$, il minimo è $2$ e il massimo è $5$.

$$
\begin{gathered}
\text{MCD} = 6x^2y^2 \\
\text{MCM} = 36x^3y^5
\end{gathered}
$$
```

```ad-warning
Scambiare esponente minimo e massimo
Il MCD divide tutti i monomi, quindi non può avere una lettera con un esponente più alto di quello che ha in uno dei monomi: prende il minimo. Il MCM è multiplo di tutti, quindi prende il massimo.
```

```ad-example
Esempio 2: segni negativi e lettere non comuni
Trova MCD e MCM di $-8a^3b$, $12a^2c^2$ e $20ab^4c$.

Coefficienti interi: si usano i valori assoluti $8$, $12$, $20$. $\text{MCD}(8, 12, 20) = 4$ e $\text{MCM}(8, 12, 20) = 120$.

Solo la $a$ compare in tutti e tre i monomi, con esponente minimo $1$: la $b$ manca nel secondo, la $c$ nel primo, quindi nel MCD non entrano.

Nel MCM entrano tutte e tre le lettere con l'esponente massimo: $a^3$, $b^4$, $c^2$.

$$\text{MCD} = 4a \qquad \text{MCM} = 120a^3b^4c^2$$

Il primo monomio è negativo, ma MCD e MCM hanno coefficiente positivo.
```

```ad-warning
Mettere nel MCD una lettera che non è in tutti i monomi
Nell'esempio 2 la $b$ compare nel primo e nel terzo monomio, ma non nel secondo: nel MCD non va. Nel MCD entrano solo le lettere comuni a tutti.
```

```ad-warning
Dare il segno meno al risultato
Se tutti i monomi sono negativi, come $-4x$ e $-6x^2$, il MCD è comunque $2x$ e il MCM è $12x^2$.
```

```ad-example
Esempio 3: coefficienti frazionari
Trova MCD e MCM di $\frac{3}{2}a^4b$, $-\frac{9}{4}a^2b^3$ e $\frac{1}{8}ab$.

I coefficienti sono frazioni, quindi il coefficiente è $1$ sia per il MCD sia per il MCM.

Lettera $a$: esponenti $4$, $2$, $1$. Lettera $b$: esponenti $1$, $3$, $1$.

$$\text{MCD} = ab \qquad \text{MCM} = a^4b^3$$
```

```ad-warning
Calcolare MCD e MCM delle frazioni
Con coefficienti come $\frac{3}{2}$ e $\frac{9}{4}$ non si cerca "il MCD delle frazioni": con la convenzione di questa lezione il coefficiente è $1$.
```

```ad-example
Esempio 4: nessuna lettera in comune
Trova MCD e MCM di $6x^2$ e $15y$.

Coefficienti: $\text{MCD}(6, 15) = 3$ e $\text{MCM}(6, 15) = 30$.

Non ci sono lettere comuni, quindi il MCD è solo un numero. Nel MCM entrano sia $x^2$ sia $y$.

$$\text{MCD} = 3 \qquad \text{MCM} = 30x^2y$$
```

```ad-tip
Un controllo per due monomi
Con due monomi a coefficienti interi, il prodotto di MCD e MCM è uguale al prodotto dei due monomi, a meno del segno. Nell'esempio 1: $6x^2y^2 \cdot 36x^3y^5 = 216x^5y^7$ e $12x^3y^2 \cdot 18x^2y^5 = 216x^5y^7$. Il controllo funziona perché per ogni lettera il minimo più il massimo dei due esponenti è uguale alla loro somma. Con tre o più monomi non vale.
```
