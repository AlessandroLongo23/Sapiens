# Divisori di un numero

## Che cos'è un divisore

Un divisore di un numero è un numero intero che lo divide senza resto. Per esempio 6 è un divisore di 18, perché $18 : 6 = 3$ con resto 0.

I divisori vengono sempre a coppie: se $6$ divide $18$, anche il quoziente $3$ lo divide, e $6 \cdot 3 = 18$.

## Come si trovano a mano

Prova a dividere il numero per 1, 2, 3 e così via. Ogni divisione esatta ti dà una coppia: il divisore e il quoziente. Puoi fermarti alla radice quadrata del numero, perché dopo le coppie si ripetono scambiate.

```ad-example
Esempio: i divisori di 36
La radice di 36 è 6, quindi basta provare i numeri da 1 a 6:

$$\begin{aligned}
36 &= 1 \cdot 36 \\[6pt]
&= 2 \cdot 18 \\[6pt]
&= 3 \cdot 12 \\[6pt]
&= 4 \cdot 9 \\[6pt]
&= 6 \cdot 6
\end{aligned}$$

Il 5 non divide 36. In ordine i divisori sono 1, 2, 3, 4, 6, 9, 12, 18 e 36: sono 9. Il 6 fa coppia con sé stesso e si conta una volta sola.
```

Per sapere quanti sono senza elencarli, scomponi il numero in fattori primi, aggiungi 1 a ogni esponente e moltiplica. Con $360 = 2^3 \cdot 3^2 \cdot 5$:

$$\begin{aligned}
(3 + 1) \cdot (2 + 1) \cdot (1 + 1) &= 4 \cdot 3 \cdot 2 \\[6pt]
&= 24
\end{aligned}$$

Per la somma dei divisori, somma le potenze di ogni fattore, da quella con esponente 0, e moltiplica i risultati:

$$\begin{aligned}
(1 + 2 + 4 + 8) \cdot (1 + 3 + 9) \cdot (1 + 5) &= 15 \cdot 13 \cdot 6 \\[6pt]
&= 1170
\end{aligned}$$

```ad-error
Errori frequenti
- Dimenticare 1 e il numero stesso: sono sempre divisori.
- Contare due volte la radice di un quadrato perfetto, come il 6 per 36.
- Moltiplicare gli esponenti senza aggiungere 1: il fattore può comparire anche 0 volte.
```

## Domande frequenti

### Quali numeri hanno un numero dispari di divisori?

Solo i quadrati perfetti, come 36 o 100: la loro radice fa coppia con sé stessa.

### Che cos'è un numero perfetto?

Un numero uguale alla somma dei suoi divisori escluso sé stesso. Il primo è 6, perché $1 + 2 + 3 = 6$; il secondo è 28.

### Qual è la differenza tra divisori e multipli?

I divisori di 12 sono i numeri che stanno dentro 12 un numero intero di volte, e sono pochi. I multipli di 12 sono 12, 24, 36 e così via, e sono infiniti.
