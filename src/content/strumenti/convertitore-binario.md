# Convertitore binario, decimale ed esadecimale

## Che cos'è una base

Nel sistema decimale ogni cifra vale dieci volte di più se si sposta di un posto a sinistra: $305 = 3 \cdot 10^2 + 0 \cdot 10^1 + 5 \cdot 10^0$. Lo stesso vale in qualunque base. In base 2, il sistema binario dei computer, ci sono solo le cifre 0 e 1 e ogni posto vale il doppio del precedente. In base 8 (ottale) le cifre vanno da 0 a 7; in base 16 (esadecimale) servono sedici cifre, e dopo il 9 si usano le lettere: $\text{A} = 10$, $\text{B} = 11$ e così via fino a $\text{F} = 15$.

## Come si fa a mano

Da una base qualunque al decimale moltiplica ogni cifra per la potenza della base del suo posto, contando i posti da destra a partire da 0, e somma.

```ad-example
Esempio: da binario a decimale
$11001_2 = 1 \cdot 2^4 + 1 \cdot 2^3 + 0 \cdot 2^2 + 0 \cdot 2^1 + 1 \cdot 2^0 = 16 + 8 + 1 = 25$.
```

Dal decimale a un'altra base usa le divisioni successive: dividi il numero per la base, scrivi il resto, dividi il quoziente e continua finché arrivi a 0. Il numero nella nuova base sono i resti letti dal basso verso l'alto.

```ad-example
Esempio: da decimale a binario
$25 : 2 = 12$ resto 1; $12 : 2 = 6$ resto 0; $6 : 2 = 3$ resto 0; $3 : 2 = 1$ resto 1; $1 : 2 = 0$ resto 1. Dal basso: $25 = 11001_2$.
```

Tra binario, ottale ed esadecimale c'è una scorciatoia, perché $8 = 2^3$ e $16 = 2^4$: ogni cifra ottale corrisponde a 3 cifre binarie e ogni cifra esadecimale a 4. Per passare dal binario all'esadecimale dividi le cifre in gruppi di 4 partendo da destra e sostituisci ogni gruppo con la sua cifra: $1111\,0101_2 = \text{F5}_{16}$.

```ad-error
Errori frequenti
- Leggere i resti dall'alto verso il basso: il primo resto è la cifra delle unità, quindi va scritto per ultimo.
- Contare le potenze da 1: la cifra più a destra si moltiplica per $2^0 = 1$.
- Fare i gruppi da sinistra: si parte sempre da destra, e se l'ultimo gruppo resta incompleto si aggiungono zeri davanti.
```

## Domande frequenti

### Perché i computer usano il binario?

Perché un circuito distingue facilmente due stati, acceso e spento, che corrispondono a 1 e 0. Ogni cifra binaria è un bit, e 8 bit fanno un byte.

### A che cosa serve l'esadecimale?

A scrivere in breve i numeri binari: un byte, 8 bit, sono esattamente due cifre esadecimali. Per questo si usa per i colori delle pagine web (#FF0000 è il rosso) e per gli indirizzi di memoria.
