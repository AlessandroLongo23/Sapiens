# Calcolo combinatorio

## Che cos'è

Il calcolo combinatorio conta in quanti modi si possono scegliere o ordinare degli oggetti, senza elencarli uno per uno.

Le domande da farsi sono due. Conta l'ordine? Un podio con Anna prima e Bea seconda è diverso da quello con Bea prima e Anna seconda; una squadra con Anna e Bea è la stessa comunque le elenchi. E un oggetto si può ripetere? In un PIN la stessa cifra può tornare, in un podio la stessa persona no.

| | L'ordine conta | L'ordine non conta |
|---|---|---|
| Senza ripetizione | disposizioni $D_{n,k}$ | combinazioni $C_{n,k}$ |
| Con ripetizione | disposizioni $D'_{n,k}$ | combinazioni $C'_{n,k}$ |

Qui $n$ è il numero degli oggetti e $k$, la classe, è quanti ne scegli. Le permutazioni sono le disposizioni di tutti gli $n$ oggetti: $P_n = n!$.

## Come si calcola a mano

```ad-example
Il podio e la squadra
Otto corridori, tre posti sul podio. L'ordine conta: per il primo posto ci sono $8$ scelte, per il secondo $7$, per il terzo $6$.

$$D_{8,3} = 8 \cdot 7 \cdot 6 = 336$$

Se invece scegli tre corridori per una staffetta, l'ordine non conta. Ogni gruppo di tre compare $3! = 6$ volte tra le disposizioni, quindi dividi:

$$\begin{aligned}
C_{8,3} &= \frac{D_{8,3}}{3!} \\[6pt]
&= \frac{336}{6} = 56
\end{aligned}$$
```

Le formule:

$$D_{n,k} = n \cdot (n - 1) \cdot \ldots \cdot (n - k + 1) \qquad D'_{n,k} = n^k$$

$$C_{n,k} = \binom{n}{k} = \frac{n!}{k! \, (n - k)!} \qquad C'_{n,k} = \binom{n + k - 1}{k}$$

Il simbolo $\binom{n}{k}$ è il coefficiente binomiale e si legge "$n$ su $k$". Quando gli oggetti non sono tutti diversi, come le lettere di MATEMATICA, si contano le permutazioni con ripetizione: si divide $n!$ per il fattoriale di ogni ripetizione.

$$\frac{10!}{2! \cdot 3! \cdot 2!} = \frac{3\,628\,800}{24} = 151\,200$$

```ad-error
Errori frequenti
- Usare le combinazioni quando l'ordine conta, come per un podio o una password.
- Scrivere $D'_{n,k} = k^n$: la base è il numero degli oggetti, $n^k$.
- Dimenticare di dividere per le ripetizioni negli anagrammi di una parola con lettere uguali.
```

## Domande frequenti

### Quante sono le combinazioni del Superenalotto?

Si estraggono $6$ numeri su $90$ e l'ordine non conta: $C_{90,6} = 622\,614\,630$.

### Come si calcola 10 su 8?

Scegliere $8$ oggetti su $10$ equivale a scartarne $2$, quindi $\binom{10}{8} = \binom{10}{2} = 45$. Conviene sempre usare il numero più piccolo tra $k$ e $n - k$.
