# Formulario: Numeri interi con segno e complemento a due

## Modulo e segno

- Il bit più significativo (MSB) è il segno: $0$ positivo, $1$ negativo. Gli altri bit sono il modulo in binario.
- Su 8 bit: da $-127$ a $+127$. Esempio: $-37$ si scrive $1010\,0101$.
- Difetti: due zeri ($0000\,0000$ e $1000\,0000$); l'addizione binaria dà risultati sbagliati.

## Complemento a due

- I pesi sono quelli del binario, ma l'MSB ha il peso negativo. Su 8 bit: $-128$, $64$, $32$, $16$, $8$, $4$, $2$, $1$.
- MSB a $0$: numero positivo o nullo, si legge come in binario. MSB a $1$: numero negativo.
- Esempio: $1110\,1100 = -128 + 64 + 32 + 8 + 4 = -20$.

Scrivere $-x$ su 8 bit:

1. Scrivi $x$ in binario su 8 bit, con gli zeri a sinistra.
2. Inverti tutti i bit.
3. Somma $1$.

Esempio: $20$ è $0001\,0100$; invertito $1110\,1011$; più $1$ fa $1110\,1100$, cioè $-20$.

L'opposto di un numero si trova nello stesso modo (inverti e somma $1$), in tutti e due i versi.

## Intervallo dei valori

Con $n$ bit in complemento a due:

$$\text{da } -2^{n-1} \text{ a } 2^{n-1} - 1$$

| Bit | Numero più piccolo | Numero più grande |
|---|---|---|
| $4$ | $-8$ | $7$ |
| $8$ | $-128$ | $127$ |
| $16$ | $-32\,768$ | $32\,767$ |

- Lo zero si scrive in un modo solo; $-128$ non ha l'opposto su 8 bit.

## Somma e traboccamento

- Si somma con l'addizione binaria, senza guardare i segni; il riporto che esce dall'ultimo bit a sinistra si scarta.
- Traboccamento: il risultato vero è fuori dall'intervallo, e nei bit resta un numero spostato di $2^n$ ($256$ su 8 bit). Esempio: $100 + 50$ dà $1001\,0110 = -106 = 150 - 256$.
- Addendi di segno diverso: mai traboccamento. Addendi dello stesso segno e risultato di segno opposto: traboccamento.

```ad-warning
Inverti e poi somma 1
Fermarsi all'inversione dà un numero sbagliato di uno: $1110\,1011$ è $-21$, non $-20$.
```

```ad-warning
Prima porta il numero a 8 bit
Gli zeri a sinistra vanno scritti prima di invertire, altrimenti mancano gli $1$ a sinistra del risultato.
```

```ad-warning
Riporto e traboccamento sono cose diverse
Un riporto scartato non rende sbagliato il risultato; il traboccamento si riconosce dai segni.
```
