# Resistenze in serie e in parallelo

## Che cos'è

La resistenza equivalente è la resistenza di un solo resistore che, al posto di un gruppo di resistori, fa passare la stessa corrente con la stessa tensione.

Due resistori sono in serie quando la corrente passa prima in uno e poi nell'altro. Sono in parallelo quando i loro capi sono collegati agli stessi due punti del circuito, i nodi.

## Come si calcola a mano

```ad-example
Tre resistori in parallelo
Tre resistori da 220 Ω, 330 Ω e 470 Ω sono in parallelo. Somma gli inversi: il denominatore comune è il mcm di 220, 330 e 470, cioè 31 020.

$$\begin{aligned}
\frac{1}{R_{eq}} &= \frac{1}{220\ \Omega} + \frac{1}{330\ \Omega} + \frac{1}{470\ \Omega} \\[6pt]
&= \frac{141 + 94 + 66}{31\,020\ \Omega} = \frac{301}{31\,020\ \Omega} \\[6pt]
R_{eq} &= \frac{31\,020}{301}\ \Omega \approx 103{,}06\ \Omega
\end{aligned}$$
```

L'ultimo passaggio è il più dimenticato: la somma dà $1/R_{eq}$, e per trovare $R_{eq}$ devi capovolgere la frazione.

In serie invece le resistenze si sommano e basta: $R_{eq} = R_1 + R_2 + R_3$. Gli stessi tre resistori in serie danno $1020\ \Omega$.

Con due soli resistori in parallelo c'è una scorciatoia, il prodotto diviso la somma:

$$R_{eq} = \frac{R_1 \cdot R_2}{R_1 + R_2}$$

```ad-example
Due resistori in parallelo
Con 6 Ω e 3 Ω:

$$\begin{aligned}
R_{eq} &= \frac{6\ \Omega \cdot 3\ \Omega}{6\ \Omega + 3\ \Omega} \\[6pt]
&= \frac{18\ \Omega^2}{9\ \Omega} = 2\ \Omega
\end{aligned}$$
```

Prima di sostituire, scrivi tutte le resistenze nella stessa unità: $4{,}7\ \text{k}\Omega = 4700\ \Omega$.

```ad-error
Errori frequenti
- Dimenticare di capovolgere la somma degli inversi: $1/R_{eq}$ non è $R_{eq}$.
- Sommare gli inversi e poi capovolgere ogni termine da solo: $\frac{1}{R_1 + R_2}$ non è $\frac{1}{R_1} + \frac{1}{R_2}$.
- Usare il prodotto diviso la somma con tre resistori: vale solo per due.
- Mescolare Ω e kΩ nella stessa somma.
```

## Domande frequenti

### Come faccio a controllare il risultato?

In serie la resistenza equivalente è maggiore della più grande. In parallelo è minore della più piccola: se trovi un valore più grande, hai sbagliato.

### E se i resistori in parallelo sono tutti uguali?

Con $n$ resistori uguali da $R$ la resistenza equivalente è $R/n$. Tre resistori da 1 kΩ in parallelo danno circa 333 Ω.
