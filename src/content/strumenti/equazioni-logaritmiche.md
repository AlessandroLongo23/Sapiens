# Equazioni logaritmiche

## Che cos'è

Un'equazione logaritmica ha la $x$ nell'argomento di un logaritmo, come $\log_2(x + 1) = 3$.

Prima di risolverla si scrivono le condizioni di esistenza: ogni argomento deve essere positivo. Alla fine si controlla che la soluzione le rispetti. Se non le rispetta, non è accettabile.

## Come si risolve a mano

Quando da una parte c'è un numero, usa la definizione di logaritmo: l'argomento è la base elevata a quel numero.

```ad-example
Esempio: log in base 2 di (x + 1) = 3
Condizione di esistenza: $x + 1 > 0$, cioè $x > -1$. Poi:

$$\begin{aligned}
x + 1 &= 2^3 \\
x + 1 &= 8 \\
x &= 7
\end{aligned}$$

$7$ è maggiore di $-1$: la soluzione è accettabile.
```

Quando i due membri sono logaritmi con la stessa base, uguaglia gli argomenti.

```ad-example
Esempio: log(x − 3) = log(2x + 1)
Condizioni di esistenza: $x - 3 > 0$ e $2x + 1 > 0$. Tutte e due valgono per $x > 3$. Poi:

$$\begin{aligned}
x - 3 &= 2x + 1 \\
-x &= 4 \\
x &= -4
\end{aligned}$$

$-4$ non è maggiore di $3$: la soluzione non è accettabile e l'equazione è impossibile.
```

```ad-error
Errori frequenti
- Saltare le condizioni di esistenza, e accettare una soluzione che rende negativo un argomento.
- Scrivere una sola condizione quando i logaritmi sono due: servono entrambe.
- Uguagliare gli argomenti di logaritmi con basi diverse, come $\log_2 x$ e $\log_3 x$.
- Invertire la definizione: da $\log_2 x = 3$ viene $x = 2^3$, non $x = 3^2$.
```

## Domande frequenti

### Come scrivo la base?

Scrivi log_2(x + 1) per la base $2$, log_(1/2)(x) per una base frazionaria, log(x) per la base $10$ e ln(x) per il logaritmo naturale, in base $e$.

### E se ci sono due logaritmi nello stesso membro?

Equazioni come $\log_2 x + \log_2(x - 1) = 1$ si risolvono prima con le proprietà dei logaritmi, e spesso portano a un'equazione di secondo grado. Questo calcolatore risolve solo quelle con un logaritmo per membro.
