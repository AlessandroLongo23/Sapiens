# Numeri primi

## Che cos'è un numero primo

Un numero primo è un numero intero maggiore di 1 che ha esattamente due divisori: 1 e sé stesso.

Per esempio 13 è primo, perché si divide solo per 1 e per 13. Invece 15 si divide anche per 3 e per 5. Un numero maggiore di 1 che non è primo si dice composto.

I primi numeri primi sono 2, 3, 5, 7, 11, 13, 17, 19, 23 e 29. Il 2 è l'unico primo pari.

## Come si controlla a mano

Si divide il numero per i numeri primi 2, 3, 5, 7… in ordine e si guarda il resto. Se un resto è 0, il numero non è primo. Ci si può fermare alla radice quadrata del numero: i divisori vanno a coppie, e in ogni coppia uno dei due è minore o uguale alla radice.

```ad-example
Esempio: 91 è primo?
La radice quadrata di 91 è circa 9,5, quindi basta provare 2, 3, 5 e 7:

$$\begin{aligned} 91 : 2 &= 45 \text{ resto } 1 \\ 91 : 3 &= 30 \text{ resto } 1 \\ 91 : 5 &= 18 \text{ resto } 1 \\ 91 : 7 &= 13 \text{ resto } 0 \end{aligned}$$

Il resto è 0 con il 7, quindi 91 non è primo:

$$91 = 7 \cdot 13$$
```

Se nessun resto è 0 fino alla radice, il numero è primo.

## Tutti i primi fino a un numero

Per trovare tutti i primi fino a un numero N si usa il crivello di Eratostene. Si scrivono i numeri da 2 a N. Il 2 è primo: si cancellano i suoi multipli a partire da 4. Il primo numero non cancellato, il 3, è primo: si cancellano i suoi multipli a partire da 9. Si continua così, partendo ogni volta dal quadrato del primo, finché il quadrato supera N. I numeri rimasti sono tutti primi.

```ad-error
Errori frequenti
- Dire che 1 è primo: ha un solo divisore, quindi non è né primo né composto.
- Pensare che ogni dispari sia primo: 9, 15, 21 e 91 sono dispari ma composti.
- Fermarsi troppo presto: bisogna provare tutti i primi fino alla radice, non solo 2, 3 e 5.
```

## Domande frequenti

### Quanti sono i numeri primi?

Sono infiniti, come dimostrò Euclide più di 2000 anni fa. Fino a 100 ce ne sono 25, fino a 1000 ce ne sono 168.

### Perché si parte dal quadrato nel crivello?

Perché i multipli più piccoli sono già stati cancellati. Per esempio, 5 · 2, 5 · 3 e 5 · 4 sono multipli di 2 o di 3: il primo multiplo di 5 ancora da cancellare è 25.
