# Media, mediana e moda

## Che cosa sono

Media, mediana e moda sono tre indici di posizione: riassumono una lista di dati con un solo numero, scelto in tre modi diversi.

- La media aritmetica $\bar{x}$ è la somma dei dati divisa per il loro numero.
- La mediana $\text{Me}$ è il valore che sta al centro quando i dati sono in ordine: metà dei dati è più piccola, metà più grande.
- La moda è il valore che compare più volte.

Accanto a loro si calcola spesso il campo di variazione, la differenza tra il dato più grande e il più piccolo, che dice quanto sono sparsi i dati.

## Come si calcola a mano

Per la media somma i dati e dividi per quanti sono. Per la mediana mettili prima in ordine crescente: con un numero dispari di dati è quello al posto $\frac{n + 1}{2}$, con un numero pari è la media dei due al centro.

```ad-example
Esempio con 8 dati: 12, 7, 15, 9, 7, 20, 11, 14
La somma è $95$, quindi $\bar{x} = \dfrac{95}{8} = 11{,}875$.
In ordine: $7, 7, 9, 11, 12, 14, 15, 20$. I dati sono 8, un numero pari: i due al centro sono il quarto e il quinto, $11$ e $12$, e $\text{Me} = \dfrac{11 + 12}{2} = 11{,}5$.
Il $7$ compare due volte, gli altri una: la moda è $7$. Il campo di variazione è $20 - 7 = 13$.
```

Nella media ponderata ogni valore conta quanto il suo peso: moltiplica ogni valore per il suo peso, somma i prodotti e dividi per la somma dei pesi.

```ad-example
Media ponderata
I valori $6$, $8$ e $5$ con pesi $2$, $2$ e $1$ danno $\bar{x} = \dfrac{6 \cdot 2 + 8 \cdot 2 + 5 \cdot 1}{2 + 2 + 1} = \dfrac{33}{5} = 6{,}6$.
```

```ad-error
Errori frequenti
- Prendere il dato al centro della lista senza metterla in ordine: la mediana si cerca sempre nei dati ordinati.
- Dare come moda il numero di volte che un valore compare: la moda è il valore, non la sua frequenza.
- Nella media ponderata dividere per il numero dei valori invece che per la somma dei pesi.
```

## Domande frequenti

### Che cosa succede se nessun valore si ripete?

Se tutti i valori compaiono lo stesso numero di volte, la distribuzione non ha moda, come dice la maggior parte dei libri. Se due valori compaiono più di tutti gli altri, le mode sono due e la distribuzione si dice bimodale.

### Quando conviene la mediana invece della media?

Quando c'è un valore anomalo, molto lontano dagli altri. Negli stipendi 1200, 1250, 1300, 1400 e 8000 euro la media è 2630 euro, più di quanto guadagnano quattro persone su cinque; la mediana, 1300 euro, descrive meglio il gruppo.
