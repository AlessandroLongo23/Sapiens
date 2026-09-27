# Convertitore binario, decimale ed esadecimale

## Che cos'è una base

La base di un sistema di numerazione è il numero di cifre che usa: il sistema decimale ha base 10, il binario base 2.

Per esempio, nel sistema decimale ogni posto vale 10 volte quello alla sua destra:

$$305 = 3 \cdot 10^2 + 0 \cdot 10^1 + 5 \cdot 10^0$$

Lo stesso vale in ogni base. In base 2, il sistema binario dei computer, ci sono solo le cifre 0 e 1, e ogni posto vale il doppio di quello alla sua destra.

In base 8 (ottale) le cifre vanno da 0 a 7. In base 16 (esadecimale) servono sedici cifre: dopo il 9 si usano le lettere, da $\text{A} = 10$ fino a $\text{F} = 15$.

## Da binario a decimale

```ad-example
Esempio: 11001 da binario a decimale
Numera i posti da destra, partendo da 0. Ogni cifra si moltiplica per la potenza di 2 del suo posto:

$$11001_2 = 1 \cdot 2^4 + 1 \cdot 2^3 + 0 \cdot 2^2 + 0 \cdot 2^1 + 1 \cdot 2^0$$

Calcola e somma:

$$16 + 8 + 1 = 25$$
```

La regola vale per ogni base: moltiplica ogni cifra per la potenza della base del suo posto, contando i posti da destra a partire da 0, poi somma.

## Da decimale a binario

```ad-example
Esempio: 25 da decimale a binario
Dividi 25 per 2 e scrivi il resto. Poi dividi il quoziente per 2, e continua finché arrivi a 0:

$$25 : 2 = 12 \quad \text{resto } 1$$
$$12 : 2 = 6 \quad \text{resto } 0$$
$$6 : 2 = 3 \quad \text{resto } 0$$
$$3 : 2 = 1 \quad \text{resto } 1$$
$$1 : 2 = 0 \quad \text{resto } 1$$

Leggi i resti dal basso verso l'alto:

$$25 = 11001_2$$
```

Questo metodo si chiama delle divisioni successive, e funziona con ogni base: si divide sempre per la base in cui si vuole scrivere il numero.

## Tra binario, ottale ed esadecimale

Qui c'è una scorciatoia, perché 8 e 16 sono potenze di 2:

$$8 = 2^3 \qquad 16 = 2^4$$

Ogni cifra ottale corrisponde a 3 cifre binarie, ogni cifra esadecimale a 4.

```ad-example
Esempio: 11110101 da binario a esadecimale
Dividi le cifre in gruppi di 4, partendo da destra: 1111 e 0101. Poi sostituisci ogni gruppo con la sua cifra, $1111_2 = 15 = \text{F}$ e $0101_2 = 5$:

$$11110101_2 = \text{F5}_{16}$$
```

```ad-error
Errori frequenti
- Leggere i resti dall'alto verso il basso: il primo resto è la cifra delle unità, quindi va scritto per ultimo.
- Contare le potenze da 1: la cifra più a destra si moltiplica per $2^0 = 1$.
- Fare i gruppi da sinistra: si parte sempre da destra, e se l'ultimo gruppo resta incompleto si aggiungono zeri davanti.
```

## Domande frequenti

### Perché i computer usano il binario?

Un circuito distingue facilmente due stati, acceso e spento, che corrispondono a 1 e 0. Ogni cifra binaria è un bit, e 8 bit fanno un byte.

### A che cosa serve l'esadecimale?

A scrivere in breve i numeri binari: un byte, 8 bit, sono esattamente due cifre esadecimali. Per questo si usa per i colori delle pagine web (#FF0000 è il rosso) e per gli indirizzi di memoria.
