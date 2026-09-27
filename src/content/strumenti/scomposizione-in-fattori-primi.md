# Scomposizione in fattori primi

## Che cos'è la scomposizione in fattori primi

Scomporre un numero in fattori primi vuol dire scriverlo come prodotto di numeri primi.

Un numero primo è un numero che ha solo due divisori, 1 e sé stesso: 2, 3, 5, 7, 11, 13 e così via. Per esempio 360 si scrive così:

$$360 = 2 \cdot 2 \cdot 2 \cdot 3 \cdot 3 \cdot 5$$

I fattori uguali si raccolgono in potenze, cioè si scrive una volta sola il fattore e in alto quante volte compare:

$$360 = 2^3 \cdot 3^2 \cdot 5$$

Ogni numero intero maggiore di 1 ha una sola scomposizione, a meno dell'ordine dei fattori. Serve per calcolare mcm e MCD, per semplificare le frazioni e per portare fuori i fattori da una radice.

## Come si calcola a mano

Si dividono il numero e i suoi quozienti, cioè i risultati delle divisioni, sempre per il più piccolo numero primo possibile. Ecco come si fa con 360.

```ad-example
Esempio: scomposizione di 360
360 è pari: dividi per 2 finché puoi.

$$360 : 2 = 180$$
$$180 : 2 = 90$$
$$90 : 2 = 45$$

La somma delle cifre di 45 è 9, divisibile per 3: dividi per 3.

$$45 : 3 = 15$$
$$15 : 3 = 5$$

5 è primo: dividilo per sé stesso e arrivi a 1.

$$5 : 5 = 1$$

In colonna, i numeri a sinistra e i divisori a destra:

$$\begin{array}{r|l} 360 & 2 \\ 180 & 2 \\ 90 & 2 \\ 45 & 3 \\ 15 & 3 \\ 5 & 5 \\ 1 & \end{array}$$

Il 2 compare tre volte, il 3 due volte, il 5 una volta:

$$360 = 2^3 \cdot 3^2 \cdot 5$$

Controllo:

$$2^3 \cdot 3^2 \cdot 5 = 8 \cdot 9 \cdot 5 = 360$$
```

La regola generale, per qualunque numero:

1. scrivi il numero a sinistra di una linea verticale;
2. dividilo per il più piccolo numero primo che lo divide; scrivi il primo a destra e il quoziente sotto;
3. ripeti sul quoziente finché arrivi a 1;
4. conta quante volte compare ogni primo a destra e scrivilo come potenza.

Per trovare il divisore aiutano i criteri di divisibilità. Un numero si divide per 2 se è pari, per 3 se la somma delle sue cifre si divide per 3, per 5 se finisce con 0 o con 5.

```ad-example
Esempio: 97 è primo?
Basta provare i primi fino alla radice quadrata di 97:

$$\sqrt{97} \approx 9{,}8$$

Quindi si provano 2, 3, 5 e 7. Le divisioni danno sempre un resto:

$$97 : 2 = 48 \text{ resto } 1$$
$$97 : 3 = 32 \text{ resto } 1$$
$$97 : 5 = 19 \text{ resto } 2$$
$$97 : 7 = 13 \text{ resto } 6$$

Nessun primo divide 97: il numero è primo, e la sua scomposizione è 97 stesso.
```

Ci si ferma alla radice quadrata perché i divisori vanno a coppie. Se 97 avesse un divisore più grande di 9,8, il suo compagno nella coppia sarebbe più piccolo di 9,8, e l'avresti già trovato.

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

No. Zero è multiplo di ogni numero, quindi non si può scrivere come prodotto di numeri primi.
