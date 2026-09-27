# Complemento a due

## Che cos'è

Il complemento a due è il modo in cui i computer scrivono i numeri interi con il segno, usando un numero fisso di bit.

Con $n$ bit il primo bit a sinistra dice il segno: 0 per i positivi, 1 per i negativi. I numeri positivi si scrivono come in binario, con gli zeri davanti. Per un numero negativo si fa un trucco: si scrive il valore assoluto, si invertono i bit e si aggiunge 1.

## Come si calcola a mano

```ad-example
Esempio: −14 su 8 bit
Scrivi 14 in binario e completa a 8 bit con gli zeri a sinistra. Poi inverti ogni bit e aggiungi 1:

$$\begin{aligned}
14 &= 0000\,1110 \\[6pt]
\text{bit invertiti} &= 1111\,0001 \\[6pt]
+1 &\to 1111\,0010
\end{aligned}$$

Quindi $-14$ su 8 bit si scrive $1111\,0010$.
```

Per controllare, ricorda che il primo bit pesa $-2^{n-1}$ e gli altri pesano come in binario:

$$\begin{aligned}
1111\,0010 &= -128 + 64 + 32 + 16 + 2 \\[6pt]
&= -128 + 114 \\[6pt]
&= -14
\end{aligned}$$

Per tornare da binario a decimale si fa lo stesso trucco al contrario. Se il primo bit è 1, inverti i bit, aggiungi 1, leggi il numero in binario e mettigli il segno meno.

## Quali numeri si scrivono con n bit

Con $n$ bit si scrivono i numeri da $-2^{n-1}$ a $2^{n-1} - 1$:

| Bit | Dal più piccolo | Al più grande |
|---|---|---|
| 8 | $-128$ | $127$ |
| 16 | $-32\,768$ | $32\,767$ |
| 32 | $-2\,147\,483\,648$ | $2\,147\,483\,647$ |

I negativi sono uno in più dei positivi, perché lo zero ha il primo bit uguale a 0.

```ad-error
Errori frequenti
- Dimenticare gli zeri a sinistra prima di invertire: con 8 bit si invertono tutti gli 8.
- Invertire i bit e basta: quello è il complemento a uno. Per il complemento a due si aggiunge anche 1.
- Leggere un numero che comincia con 1 come se fosse positivo: $1111\,1111$ su 8 bit vale $-1$, non $255$.
```

## Domande frequenti

### Perché non si usa semplicemente un bit per il segno?

Con il bit di segno e il modulo lo zero avrebbe due scritture, $+0$ e $-0$, e le somme tra positivi e negativi avrebbero bisogno di regole a parte. Con il complemento a due la somma si fa sempre allo stesso modo: $14 + (-14)$ dà $0000\,0000$, scartando il riporto finale.

### Che cosa succede se il numero non ci sta?

Serve un numero di bit più grande. Nei programmi un numero che esce dall'intervallo "trabocca" (overflow): $127 + 1$ su 8 bit diventa $-128$.
