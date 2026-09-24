# Grado di un monomio

Un [monomio](/materiale/scuola-superiore/matematica/monomi-e-polinomi/monomi) è un prodotto tra un numero, il **coefficiente**, e una o più lettere elevate a esponenti naturali, che formano la **parte letterale**. È in **forma normale** quando il coefficiente è scritto una volta sola, davanti, e ogni lettera compare una volta sola: $-3x^2y$ è in forma normale, $3x \cdot y \cdot (-x)$ no.

Il grado dice "quanto pesano" le lettere di un monomio, e si legge solo dagli esponenti. Servirà per confrontare monomi, per ordinarli dentro un polinomio e, più avanti, per classificare le equazioni (di primo grado, di secondo grado).

## Grado rispetto a una lettera

Il **grado rispetto a una lettera** è l'esponente con cui quella lettera compare nel monomio ridotto a forma normale. Se la lettera non compare, il grado rispetto a quella lettera è $0$, perché $x^0 = 1$.

```ad-example
Esempio 1: grado rispetto a ogni lettera
Nel monomio $-3x^2y$ il grado rispetto a $x$ è $2$.

Il grado rispetto a $y$ è $1$: una lettera scritta senza esponente ha esponente $1$.

Il grado rispetto a $z$ è $0$, perché $z$ non compare.
```

## Grado complessivo

Il **grado complessivo** (o solo grado) di un monomio è la somma degli esponenti di tutte le sue lettere, sempre dopo averlo ridotto a forma normale. Il coefficiente non conta: $100x$ e $\frac{1}{2}x$ hanno lo stesso grado, $1$.

```ad-example
Esempio 2: grado complessivo
Nel monomio $\frac{2}{5}a^3b^4c$ il grado rispetto ad $a$ è $3$, rispetto a $b$ è $4$, rispetto a $c$ è $1$.

Grado complessivo: $3 + 4 + 1 = 8$.
```

```ad-warning
Errore frequente: la lettera senza esponente
In $-5xy^3$ il grado è $1 + 3 = 4$, non $3$: la $x$ senza esponente conta $1$. Il segno meno e il $5$ non entrano nel grado.
```

```ad-example
Esempio 3: un esponente nel coefficiente
Nel monomio $2^3x^2$ l'esponente $3$ appartiene al coefficiente, che vale $8$: il monomio è $8x^2$ e ha grado $2$, non $5$.
```

```ad-example
Esempio 4: un monomio non ancora in forma normale
Per trovare il grado di $3a^2b \cdot a$ prima lo riduci a forma normale:

$$3a^2b \cdot a = 3a^3b$$

Il grado rispetto ad $a$ è $3$ (non $2$), il grado rispetto a $b$ è $1$, il grado complessivo è $3 + 1 = 4$.
```

## Costanti e monomio nullo

Un numero diverso da zero, come $-7$ o $\frac{3}{4}$, è un monomio senza lettere: il suo grado complessivo è $0$, e anche il grado rispetto a qualsiasi lettera è $0$. Puoi pensarlo come $-7 = -7x^0$.

Il monomio nullo, $0$, invece non ha grado. Infatti $0 = 0 \cdot x = 0 \cdot x^5 = 0 \cdot a^2b^3$, e così via: si può scrivere con qualsiasi parte letterale, quindi non esiste un esponente che lo descriva.

```ad-warning
Una costante e il monomio nullo non si comportano allo stesso modo
"Ha grado $0$" vale per le costanti diverse da zero, come $5$ o $-\frac{1}{2}$. Del monomio $0$ si dice che non ha grado. Allo stesso modo $0 \cdot x^3$ non ha grado $3$: è il monomio nullo.
```

## Il grado nelle operazioni

Quando fai un'operazione tra monomi, puoi prevedere il grado del risultato senza calcolarlo tutto. Le regole di calcolo sono nella lezione sulle [operazioni tra monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-monomi); qui conta solo che cosa succede al grado.

| Operazione | Grado del risultato | Esempio |
|---|---|---|
| Prodotto | somma dei gradi dei fattori | $(2x^3y)\cdot(-4xy^2) = -8x^4y^3$: $4 + 3 = 7$ |
| Quoziente, quando è un monomio | differenza dei gradi | $(6x^5y^2) : (-3x^2y) = -2x^3y$: $7 - 3 = 4$ |
| Potenza con esponente $n$ | grado della base per $n$ | $(-3x^2y)^3 = -27x^6y^3$: $3 \cdot 3 = 9$ |
| Somma di monomi simili | stesso grado, se il risultato non è $0$ | $3x^2y - 5x^2y = -2x^2y$: grado $3$ |

Nella somma c'è un caso limite: $4ab - 4ab = 0$ dà il monomio nullo, che non ha grado.

```ad-note
Il grado di un polinomio
Un polinomio è una somma di monomi non simili, e il suo grado si definisce a partire dai gradi dei suoi monomi. Lo trovi nella lezione sul [grado di un polinomio](/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio).
```
