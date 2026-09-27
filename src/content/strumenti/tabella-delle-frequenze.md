# Tabella delle frequenze

## Che cos'è

La tabella delle frequenze dice quante volte compare ogni modalità di un carattere, cioè ogni valore o categoria diversa dei dati. Le colonne di solito sono quattro:

- la frequenza assoluta $f_a$, quante volte compare la modalità;
- la frequenza relativa $f_r$, la frequenza assoluta divisa per il numero dei dati $N$;
- la percentuale, la frequenza relativa per $100$;
- la frequenza cumulata, la somma delle frequenze assolute fino a quella riga.

## Come si calcola a mano

```ad-example
I fratelli di 20 studenti
In una classe di $20$ studenti, $4$ non hanno fratelli, $9$ ne hanno uno, $5$ ne hanno due e $2$ ne hanno tre. Per la riga "un fratello":

$$\begin{aligned}
f_r &= \frac{9}{20} = 0{,}45 \\[6pt]
\text{percentuale} &= 0{,}45 \cdot 100 = 45\% \\[6pt]
\text{cumulata} &= 4 + 9 = 13
\end{aligned}$$

La cumulata dice che $13$ studenti hanno al massimo un fratello.
```

Con dati numerici molto diversi tra loro, come le altezze, si raggruppano i valori in classi della stessa ampiezza. La classe $160 \vdash 170$ contiene i valori da $160$ compreso a $170$ escluso: il trattino verticale sta dalla parte dell'estremo compreso. Lo strumento lo fa se scrivi l'ampiezza, per esempio $10$.

Il controllo finale: le frequenze assolute sommano a $N$, le relative a $1$, le percentuali a $100\%$, e l'ultima cumulata è $N$.

```ad-error
Errori frequenti
- Dividere per il numero delle modalità invece che per il numero dei dati.
- Contare due volte un dato sul confine tra due classi: $170$ va solo in $170 \vdash 180$.
- Calcolare la cumulata per modalità senza un ordine, come i colori o gli sport: non ha significato.
```

## Domande frequenti

### Perché le percentuali non sommano esattamente a 100?

Per gli arrotondamenti. Con $7$ dati divisi in quattro modalità, per esempio, le percentuali arrotondate a un decimale possono sommare a $100{,}1\%$. Non è un errore nei conteggi.

### Posso usare parole invece di numeri?

Sì: scrivi le modalità separate da uno spazio, come rosso blu rosso. Se una modalità ha più parole separale con la virgola. Maiuscole e minuscole contano come la stessa parola.

### Come scelgo l'ampiezza delle classi?

Di solito si scelgono da cinque a dieci classi. Dividi la differenza tra il dato più grande e il più piccolo per il numero di classi che vuoi, e arrotonda a un numero comodo.
