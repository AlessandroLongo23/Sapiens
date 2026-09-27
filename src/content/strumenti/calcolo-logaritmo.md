# Calcolo del logaritmo

## Che cos'è

Il logaritmo in base $b$ di un numero $a$ è l'esponente da dare a $b$ per ottenere $a$: $\log_2 8 = 3$ perché $2^3 = 8$.

Il numero $b$ si chiama base, il numero $a$ argomento. Il logaritmo esiste solo se la base è positiva e diversa da $1$ e l'argomento è positivo.

## Come si calcola a mano

Se base e argomento sono potenze dello stesso numero, il logaritmo è una frazione e si trova senza calcolatrice. Scrivi tutti e due come potenze di quel numero, poi confronta gli esponenti.

```ad-example
Esempio: log in base 4 di 8
Chiama $y$ il logaritmo: allora $4^y = 8$. Scrivi $4$ e $8$ come potenze di $2$ e uguaglia gli esponenti:

$$\begin{aligned}
\left(2^2\right)^y &= 2^3 \\
2^{2y} &= 2^3 \\
2y &= 3 \\
y &= \frac{3}{2}
\end{aligned}$$
```

Con le frazioni e le radici si fa lo stesso: $\frac{1}{8} = 2^{-3}$ e $\sqrt{2} = 2^{\frac{1}{2}}$.

Se invece base e argomento non sono potenze dello stesso numero, come $3$ e $5$, il logaritmo non è una frazione. Serve la formula del cambiamento di base, con il tasto ln della calcolatrice:

$$\log_3 5 = \frac{\ln 5}{\ln 3} \approx \frac{1{,}6094}{1{,}0986} \approx 1{,}4650$$

```ad-error
Errori frequenti
- Scambiare base e argomento: $\log_2 8$ è $3$, non $\frac{1}{3}$.
- Dimenticare il segno con una base minore di $1$: $\log_{\frac{1}{2}} 8 = -3$, perché $\left(\frac{1}{2}\right)^{-3} = 8$.
- Nel cambiamento di base, mettere il logaritmo della base sopra la frazione. La base va sotto.
- Cercare il logaritmo di zero o di un numero negativo: non esiste.
```

## Domande frequenti

### Perché la base non può essere 1?

Ogni potenza di $1$ vale $1$. Con base $1$ nessun esponente dà $8$, e per l'argomento $1$ andrebbero bene tutti: il logaritmo non sarebbe un numero solo.

### Che differenza c'è tra log e ln?

Sulla calcolatrice, log è il logaritmo in base $10$ e ln quello in base $e$, il numero di Nepero, circa $2{,}718$. Nel cambiamento di base puoi usare l'uno o l'altro: il risultato è lo stesso.

### Come scrivo una radice nel calcolatore?

Scrivi √2 oppure sqrt(2); per la radice cubica ∛4 oppure cbrt(4). Una frazione si scrive 1/2.
