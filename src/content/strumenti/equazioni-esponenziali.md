# Equazioni esponenziali

## Che cos'è

Un'equazione esponenziale ha la $x$ all'esponente di una potenza, come $2^{x+1} = 8$ oppure $3^x = 5$.

Quelle elementari si risolvono in due modi. Se i due membri sono potenze dello stesso numero, si uguagliano gli esponenti. Altrimenti si usa il logaritmo.

## Come si risolve a mano

```ad-example
Esempio: 4^(x − 1) = 8
Scrivi $4$ e $8$ come potenze di $2$. Due potenze con la stessa base sono uguali quando hanno lo stesso esponente:

$$\begin{aligned}
\left(2^2\right)^{x-1} &= 2^3 \\
2^{2(x-1)} &= 2^3 \\
2(x - 1) &= 3 \\
2x - 2 &= 3 \\
x &= \frac{5}{2}
\end{aligned}$$
```

```ad-example
Esempio: 3^x = 5
$5$ non è una potenza di $3$. La $x$ è allora l'esponente da dare a $3$ per avere $5$, cioè il logaritmo in base $3$ di $5$:

$$\begin{aligned}
x &= \log_3 5 \\
&= \frac{\ln 5}{\ln 3} \\
&\approx 1{,}4650
\end{aligned}$$
```

Con due basi diverse, come $2^x = 3^{x-1}$, si prende il logaritmo di tutti e due i membri. L'esponente passa davanti al logaritmo e resta un'equazione di primo grado.

```ad-error
Errori frequenti
- Uguagliare gli esponenti con basi diverse: da $2^x = 3^{x-1}$ non segue $x = x - 1$.
- Dimenticare le parentesi: $\left(2^2\right)^{x-1}$ dà $2^{2x-2}$, non $2^{2x-1}$.
- Cercare una soluzione di $2^x = -4$: una potenza con base positiva è sempre positiva, e l'equazione è impossibile.
- Dividere per il numero davanti alla potenza solo a sinistra: in $3 \cdot 2^x = 24$ si divide tutto per $3$ e si arriva a $2^x = 8$.
```

## Domande frequenti

### Come scrivo l'esponente?

Scrivi ^ e metti l'esponente tra parentesi quando ha più termini: 2^(x + 1). Se scrivi 2^x + 1, il calcolatore lo legge come $2^x + 1$. Una base frazionaria va tra parentesi: (1/2)^x.

### E se ci sono più potenze da sommare?

Equazioni come $2^x + 2^{x+1} = 12$ si risolvono raccogliendo la potenza più bassa, oppure con una sostituzione. Questo calcolatore risolve solo quelle con una potenza per membro.
