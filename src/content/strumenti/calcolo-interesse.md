# Calcolo dell'interesse semplice e composto

## Che cos'è l'interesse

L'interesse è il compenso che si riceve prestando un capitale, per esempio lasciandolo in banca, o che si paga prendendolo in prestito. Si indica con $I$; il capitale con $C$, il tasso annuo in percentuale con $r$, la durata in anni con $t$. Il montante $M$ è il capitale più l'interesse.

## Come si calcola a mano

Nell'interesse semplice ogni anno frutta la stessa somma, calcolata sul capitale di partenza:

$$I = \frac{C \cdot r \cdot t}{100}$$

```ad-example
Esempio: 1000 euro al 3% per 2 anni e 6 mesi
Sei mesi sono mezzo anno, quindi $t = 2{,}5$:

$$\begin{aligned}
I &= \frac{1000 \cdot 3 \cdot 2{,}5}{100} = 75 \\[6pt]
M &= 1000 + 75 = 1075
\end{aligned}$$
```

Nell'interesse composto l'interesse di ogni anno si aggiunge al capitale, e l'anno dopo frutta anche lui. Ogni anno il capitale si moltiplica per $1 + i$, dove $i = \frac{r}{100}$:

$$M = C \cdot (1 + i)^t$$

```ad-example
Esempio: 1000 euro al 3% composto per 5 anni

$$\begin{aligned}
M &= 1000 \cdot 1{,}03^5 \\[6pt]
&\approx 1159{,}27
\end{aligned}$$

L'interesse è $159{,}27$ euro, più dei $150$ dell'interesse semplice.
```

Dalla formula si ricava anche il capitale, $C = \frac{M}{(1 + i)^t}$, o il tasso, con la radice: $1 + i = \sqrt[t]{\frac{M}{C}}$. Lo strumento arrotonda gli importi al centesimo di euro. Con i mesi, nel composto usa la stessa formula con l'esponente non intero.

```ad-error
Errori frequenti
- Usare il tasso in percentuale nella formula del composto: $1{,}03$, non $1 + 3$.
- Scrivere 6 mesi come $t = 0{,}6$: un mese è un dodicesimo di anno, quindi 6 mesi sono $0{,}5$.
- Nel composto, calcolare l'interesse sempre sul capitale iniziale: quella è la regola dell'interesse semplice.
```

## Domande frequenti

### Conviene di più il semplice o il composto?

A chi riceve gli interessi conviene il composto quando la durata supera un anno. Per un anno solo i due danno lo stesso montante.

### Le banche calcolano così?

Lo schema è questo, ma i conti veri hanno anche tasse sugli interessi e spese, e spesso capitalizzano ogni trimestre o ogni mese.
