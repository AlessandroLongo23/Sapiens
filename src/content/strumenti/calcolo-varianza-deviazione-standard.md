# Varianza e deviazione standard

## Che cos'è

La varianza misura quanto i dati si allontanano dalla loro media: è la media dei quadrati degli scarti. Si scrive $\sigma^2$ (sigma quadro).

Lo scarto di un dato è la differenza tra il dato e la media, $x_i - \bar{x}$. La deviazione standard, che i libri chiamano anche scarto quadratico medio, è la radice quadrata della varianza e si scrive $\sigma$. Ha la stessa unità di misura dei dati: se i dati sono in minuti, anche $\sigma$ è in minuti.

## Come si calcola a mano

```ad-example
I ritardi di un autobus
In quattro giorni un autobus arriva con $3$, $5$, $6$ e $8$ minuti di ritardo. La media è

$$\begin{aligned}
\bar{x} &= \frac{3 + 5 + 6 + 8}{4} \\[6pt]
&= \frac{22}{4} = 5{,}5
\end{aligned}$$

Gli scarti sono $-2{,}5$, $-0{,}5$, $0{,}5$ e $2{,}5$. I loro quadrati sono $6{,}25$, $0{,}25$, $0{,}25$ e $6{,}25$. Somma i quadrati e dividi per $4$:

$$\begin{aligned}
\sigma^2 &= \frac{6{,}25 + 0{,}25 + 0{,}25 + 6{,}25}{4} \\[6pt]
&= \frac{13}{4} = 3{,}25 \\[6pt]
\sigma &= \sqrt{3{,}25} \approx 1{,}80
\end{aligned}$$
```

La regola:

1. calcola la media $\bar{x}$;
2. per ogni dato calcola lo scarto $x_i - \bar{x}$ e il suo quadrato;
3. somma i quadrati e dividi per il numero dei dati $n$: è la varianza;
4. fai la radice quadrata: è la deviazione standard.

$$\sigma^2 = \frac{(x_1 - \bar{x})^2 + \dots + (x_n - \bar{x})^2}{n}$$

Il coefficiente di variazione è la deviazione standard divisa per la media, di solito in percentuale: $\text{CV} = \dfrac{\sigma}{|\bar{x}|}$. Serve a confrontare la dispersione di dati con medie molto diverse. Per l'autobus è $1{,}80 : 5{,}5 \approx 0{,}33$, cioè circa il $33\%$.

```ad-error
Errori frequenti
- Fermarsi alla varianza quando il problema chiede lo scarto quadratico medio: serve ancora la radice.
- Scrivere $(-2{,}5)^2 = -6{,}25$: il quadrato di un numero negativo è positivo.
- Fare la media degli scarti senza elevarli al quadrato: viene sempre $0$.
```

Un controllo utile: la somma degli scarti è sempre $0$. Se non ti viene zero, c'è un errore nella media o in uno scarto.

## Domande frequenti

### Si divide per n o per n − 1?

Nei libri delle superiori la varianza si calcola dividendo per $n$, il numero dei dati. Quando i dati sono un campione di una popolazione più grande, in statistica si divide per $n - 1$: è la varianza campionaria $s^2$, un po' più grande. Sulla calcolatrice il tasto $\sigma_x$ divide per $n$, il tasto $s_x$ per $n - 1$.

### La varianza può essere negativa?

No. È una somma di quadrati divisa per $n$, quindi è sempre positiva o zero. È zero solo quando tutti i dati sono uguali.
