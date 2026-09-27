# Calcolatrice binaria

## Che cos'è

Una calcolatrice binaria fa somma, sottrazione e moltiplicazione tra numeri scritti in base 2, cioè con le sole cifre 0 e 1. I conti si fanno in colonna come in base 10, con una differenza: il riporto scatta a 2, non a 10.

## Come si calcola a mano

Nella somma, colonna per colonna da destra: $0 + 1 = 1$, mentre $1 + 1 = 2$, che in binario si scrive $10$. Si scrive 0 e si porta 1 nella colonna a sinistra. Con il riporto, $1 + 1 + 1 = 3 = 11$: si scrive 1 e si porta 1.

```ad-example
Esempio: 1011 + 110
Da destra: $1 + 0 = 1$; $1 + 1 = 10$, scrivi 0 e riporta 1; $0 + 1 + 1 = 10$, scrivi 0 e riporta 1; $1 + 0 + 1 = 10$, scrivi 0 e riporta 1; l'ultimo riporto diventa la cifra a sinistra.

$$\begin{aligned}
1011_2 + 110_2 &= 10001_2 \\[6pt]
11 + 6 &= 17
\end{aligned}$$
```

Nella sottrazione, quando in una colonna devi fare $0 - 1$, prendi in prestito 1 dalla colonna a sinistra. In quella colonna il prestito vale 2, quindi $2 - 1 = 1$; alla colonna a sinistra togli 1.

```ad-example
Esempio: 1101 − 111
Da destra: $1 - 1 = 0$; $0 - 1$ chiede un prestito, $2 - 1 = 1$; $1 - 1 - 1$ chiede un altro prestito, $3 - 1 - 1 = 1$; nell'ultima colonna $1 - 1 = 0$.

$$\begin{aligned}
1101_2 - 111_2 &= 110_2 \\[6pt]
13 - 7 &= 6
\end{aligned}$$
```

Nella moltiplicazione si moltiplica solo per 0 o per 1: per ogni 1 del secondo numero si riscrive il primo, spostato di un posto a sinistra, e poi si sommano le righe.

```ad-error
Errori frequenti
- Scrivere 2 in una colonna: in binario la cifra 2 non esiste, si scrive 0 con il riporto.
- Dimenticare di togliere 1 alla colonna che ha dato il prestito.
- Incolonnare a sinistra: i numeri vanno allineati a destra, come in base 10.
```

## Domande frequenti

### Come controllo il risultato?

Converti i numeri in base 10 e rifai il conto: $1011_2 = 11$ e $110_2 = 6$, e infatti $10001_2 = 17$.

### E se il primo numero è più piccolo?

La differenza è negativa. I computer la scrivono in complemento a due, che ha uno strumento a parte.
