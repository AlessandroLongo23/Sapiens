# Calcolo del MCD

## Che cos'è il MCD

Il massimo comune divisore di due o più numeri è il più grande numero che li divide tutti senza resto. I divisori di 12 sono 1, 2, 3, 4, 6, 12 e quelli di 18 sono 1, 2, 3, 6, 9, 18: il più grande che compare in tutte e due le liste è 6, quindi $\text{MCD}(12, 18) = 6$.

Serve per semplificare le frazioni: dividendo numeratore e denominatore di $\frac{12}{18}$ per il loro MCD si arriva subito a $\frac{2}{3}$.

## Come si calcola a mano

1. Scomponi ogni numero in fattori primi.
2. Prendi solo i fattori comuni a tutti i numeri.
3. Per ogni fattore comune scegli l'esponente più piccolo.
4. Moltiplica. Se non c'è nessun fattore comune, il MCD è 1 e i numeri si dicono primi tra loro.

```ad-example
Esempio: MCD di 36, 48 e 60
Le scomposizioni sono $36 = 2^2 \cdot 3^2$, $48 = 2^4 \cdot 3$, $60 = 2^2 \cdot 3 \cdot 5$.
Sono comuni il 2, con esponente più piccolo 2, e il 3, con esponente più piccolo 1. Il 5 non è comune.
Quindi $\text{MCD}(36, 48, 60) = 2^2 \cdot 3 = 12$.
```

Per due numeri si può usare anche l'algoritmo di Euclide: si divide il più grande per il più piccolo, poi il divisore per il resto, e così via finché il resto è zero. L'ultimo resto diverso da zero è il MCD. Per 48 e 18: $48 = 2 \cdot 18 + 12$, $18 = 1 \cdot 12 + 6$, $12 = 2 \cdot 6 + 0$, quindi il MCD è 6.

```ad-error
Errori frequenti
- Prendere anche i fattori non comuni: quella è la regola del mcm.
- Scegliere l'esponente più grande: per il MCD si prende sempre il più piccolo.
- Dire che il MCD di due numeri senza fattori comuni è 0: è 1, perché 1 divide ogni numero.
```

## Domande frequenti

### Il MCD può essere uguale a uno dei numeri?

Sì, quando quel numero divide tutti gli altri: $\text{MCD}(6, 18) = 6$.

### Che differenza c'è tra MCD e mcm?

Il MCD è il più grande divisore comune ed è minore o uguale al più piccolo dei numeri; il mcm è il più piccolo multiplo comune ed è maggiore o uguale al più grande.
