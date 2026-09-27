# Distribuzione binomiale

## Che cos'è

La distribuzione binomiale dà la probabilità di ottenere esattamente $k$ successi ripetendo $n$ volte la stessa prova, quando ogni prova ha la stessa probabilità di successo $p$ e le prove sono indipendenti.

Si chiama anche schema di Bernoulli, dal matematico Jakob Bernoulli. Esempi: lanciare un dado dieci volte e contare i sei, rispondere a caso a un test e contare le risposte giuste. Il numero dei successi è una variabile aleatoria, che si indica con $X$.

## Come si calcola a mano

```ad-example
Due sei in dieci lanci
Lanci un dado $10$ volte. Qual è la probabilità di ottenere esattamente $2$ volte il sei? Qui $n = 10$, $k = 2$, $p = \frac{1}{6}$, e la probabilità di insuccesso è $1 - p = \frac{5}{6}$.

$$\begin{aligned}
P(X = 2) &= \binom{10}{2} \cdot \left(\frac{1}{6}\right)^2 \cdot \left(\frac{5}{6}\right)^8 \\[6pt]
&= 45 \cdot \frac{1}{36} \cdot \frac{390\,625}{1\,679\,616} \\[6pt]
&\approx 0{,}2907
\end{aligned}$$

È circa il $29\%$.
```

La formula generale:

$$P(X = k) = \binom{n}{k} \, p^k \, (1 - p)^{n - k}$$

Il coefficiente binomiale $\binom{n}{k}$ conta in quanti ordini possono arrivare i $k$ successi tra le $n$ prove. La potenza $p^k$ è la probabilità dei successi, $(1 - p)^{n - k}$ quella degli insuccessi.

Per "al massimo $k$" o "almeno $k$" si sommano più termini. Spesso conviene l'evento contrario, che ha meno termini:

$$\begin{aligned}
P(X \geq 1) &= 1 - P(X = 0) \\[6pt]
&= 1 - \left(\frac{5}{6}\right)^{10} \approx 0{,}8385
\end{aligned}$$

```ad-error
Errori frequenti
- Dimenticare il coefficiente binomiale: $p^k (1 - p)^{n - k}$ è la probabilità di un solo ordine dei successi.
- Usare $p$ anche per gli insuccessi: la loro probabilità è $1 - p$.
- Confondere "almeno $2$" con "più di $2$": almeno $2$ comprende anche $X = 2$.
```

## Domande frequenti

### Quando si può usare la distribuzione binomiale?

Quando le prove sono tutte uguali, ognuna ha solo due esiti (successo o insuccesso), la probabilità di successo non cambia e un esito non influenza gli altri. Le estrazioni da un'urna con reimmissione vanno bene; senza reimmissione, no, perché $p$ cambia a ogni estrazione.

### Qual è il valore medio?

Il valore atteso della distribuzione binomiale è $n \cdot p$. Con $10$ lanci di un dado ti aspetti in media $10 \cdot \frac{1}{6} \approx 1{,}67$ sei.
