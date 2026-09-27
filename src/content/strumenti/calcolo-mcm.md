# Calcolo del mcm

## Che cos'è il mcm

Il minimo comune multiplo di due o più numeri è il più piccolo numero, diverso da zero, che è multiplo di tutti. Per esempio i multipli di 4 sono 4, 8, 12, 16, 20, 24… e quelli di 6 sono 6, 12, 18, 24…: il primo che compare in tutte e due le liste è 12, quindi $\text{mcm}(4, 6) = 12$.

Serve soprattutto con le frazioni: per sommare $\frac{1}{4} + \frac{1}{6}$ si portano le due frazioni allo stesso denominatore, e il denominatore più comodo è proprio il mcm, 12.

## Come si calcola a mano

Con numeri piccoli basta elencare i multipli. Con numeri grandi si usa la scomposizione in fattori primi:

1. scomponi ogni numero in fattori primi;
2. prendi tutti i fattori che compaiono, comuni e non comuni, ognuno una volta sola;
3. per ogni fattore scegli l'esponente più grande con cui compare;
4. moltiplica.

```ad-example
Esempio: mcm di 12, 18 e 30
Le scomposizioni sono $12 = 2^2 \cdot 3$, $18 = 2 \cdot 3^2$, $30 = 2 \cdot 3 \cdot 5$.
I fattori sono 2, 3 e 5. Il 2 compare al massimo con esponente 2, il 3 con esponente 2, il 5 con esponente 1.
Quindi $\text{mcm}(12, 18, 30) = 2^2 \cdot 3^2 \cdot 5 = 180$.
```

Per due numeri c'è anche una scorciatoia: il prodotto dei due numeri è uguale al prodotto di mcm e MCD. Se conosci il MCD, $\text{mcm}(a, b) = \dfrac{a \cdot b}{\text{MCD}(a, b)}$.

```ad-error
Errori frequenti
- Prendere solo i fattori comuni: quella è la regola del MCD. Per il mcm servono anche i fattori non comuni.
- Scegliere l'esponente più piccolo: per il mcm si prende sempre il più grande.
- Moltiplicare semplicemente i numeri tra loro: $4 \cdot 6 = 24$ è un multiplo comune, ma non il minimo, che è 12.
```

## Domande frequenti

### Il mcm può essere uguale a uno dei numeri?

Sì, quando quel numero è multiplo di tutti gli altri: $\text{mcm}(5, 15) = 15$.

### Qual è il mcm di due numeri primi tra loro?

Il loro prodotto, perché non hanno fattori in comune: $\text{mcm}(8, 15) = 120$.
