# Scomposizione in fattori primi

## Che cos'è la scomposizione in fattori primi

Scomporre un numero in fattori primi vuol dire scriverlo come prodotto di numeri primi, cioè di numeri che hanno come divisori solo 1 e sé stessi: 2, 3, 5, 7, 11, 13 e così via. Ogni numero intero maggiore di 1 ha una sola scomposizione, a meno dell'ordine dei fattori. I fattori uguali si raccolgono in potenze: $360 = 2 \cdot 2 \cdot 2 \cdot 3 \cdot 3 \cdot 5 = 2^3 \cdot 3^2 \cdot 5$.

La scomposizione serve per calcolare mcm e MCD, per semplificare le frazioni e per portare fuori i fattori da una radice.

## Come si calcola a mano

Si usa la colonna delle divisioni:

1. scrivi il numero a sinistra di una linea verticale;
2. dividilo per il più piccolo numero primo che lo divide e scrivi il primo a destra, il quoziente sotto;
3. ripeti sul quoziente finché arrivi a 1;
4. i numeri a destra sono i fattori: conta quante volte compare ciascuno.

Per trovare il primo divisore aiutano i criteri di divisibilità: un numero è divisibile per 2 se è pari, per 3 se la somma delle cifre è divisibile per 3, per 5 se finisce con 0 o 5.

```ad-example
Esempio: scomposizione di 360
$$\begin{array}{r|l} 360 & 2 \\ 180 & 2 \\ 90 & 2 \\ 45 & 3 \\ 15 & 3 \\ 5 & 5 \\ 1 & \end{array}$$
Il 2 compare tre volte, il 3 due volte, il 5 una volta: $360 = 2^3 \cdot 3^2 \cdot 5$.
Controllo: $8 \cdot 9 \cdot 5 = 360$.
```

```ad-example
Esempio: 97 è primo?
$\sqrt{97} \approx 9{,}8$, quindi basta provare i primi 2, 3, 5 e 7. Nessuno divide 97: il numero è primo e la sua scomposizione è 97 stesso.
```

```ad-error
Errori frequenti
- Dividere per un numero che non è primo, come 4 o 6: nella colonna di destra devono comparire solo numeri primi.
- Fermarsi prima di arrivare a 1: l'ultimo quoziente va diviso ancora, anche quando è primo.
- Dimenticare un fattore quando si scrivono le potenze: conta le righe della colonna, e alla fine controlla moltiplicando.
```

## Domande frequenti

### 1 è un numero primo?

No. Un numero primo ha esattamente due divisori, 1 e sé stesso; 1 ne ha uno solo. Per questo 1 non compare mai in una scomposizione.

### Si può scomporre lo zero?

No: zero è multiplo di ogni numero, quindi non si può scrivere come prodotto di numeri primi.
