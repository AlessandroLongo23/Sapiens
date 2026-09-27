# Media quadratica

## Che cos'è

La media quadratica di $n$ numeri è la radice quadrata della media dei loro quadrati. Si scrive $Q$.

Conta la grandezza dei numeri senza badare al segno, perché ogni quadrato è positivo. Per questo si usa quando i valori positivi e negativi si compenserebbero: gli errori di una misura, gli scarti da un valore di riferimento, la corrente alternata in fisica (il valore efficace).

## Come si calcola a mano

```ad-example
Quattro numeri, uno negativo
La media quadratica di $-4$, $2$, $6$ e $8$. Eleva al quadrato ogni numero e somma:

$$\begin{aligned}
(-4)^2 + 2^2 + 6^2 + 8^2 &= 16 + 4 + 36 + 64 \\[6pt]
&= 120
\end{aligned}$$

Dividi per $4$, il numero dei valori, e fai la radice quadrata:

$$\begin{aligned}
Q &= \sqrt{\frac{120}{4}} \\[6pt]
&= \sqrt{30} \approx 5{,}48
\end{aligned}$$

La media aritmetica degli stessi numeri è $12 : 4 = 3$: il $-4$ si compensa in parte con gli altri, nella media quadratica no.
```

La regola:

$$Q = \sqrt{\frac{x_1^2 + x_2^2 + \dots + x_n^2}{n}}$$

Quando il numero sotto radice ha un fattore quadrato, la radice si semplifica: $\sqrt{40} = \sqrt{4 \cdot 10} = 2\sqrt{10}$.

```ad-error
Errori frequenti
- Scrivere $(-4)^2 = -16$: il quadrato di un numero negativo è positivo.
- Fare la radice di ogni quadrato prima di sommare: si torna ai numeri di partenza, e il risultato è sbagliato.
- Dimenticare di dividere per $n$ prima della radice.
```

## Domande frequenti

### La media quadratica è più grande della media aritmetica?

Sì, a meno che i numeri siano tutti uguali: allora le due medie coincidono. Con valori di segno diverso la differenza può essere grande, come nell'esempio.

### Che legame ha con lo scarto quadratico medio?

Lo scarto quadratico medio è la media quadratica degli scarti dalla media, $x_i - \bar{x}$. Per calcolarlo con tutti i passaggi c'è lo strumento della varianza e della deviazione standard.

### Si può calcolare con numeri negativi?

Sì. A differenza della media geometrica e di quella armonica, la media quadratica accetta anche lo zero e i numeri negativi.
