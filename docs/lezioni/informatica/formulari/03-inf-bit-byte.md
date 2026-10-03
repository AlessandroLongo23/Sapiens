# Formulario: Bit, byte e unità di misura

## Bit e byte

- Bit: la più piccola quantità di informazione, 0 oppure 1. Si scrive per esteso.
- Byte: un gruppo di 8 bit. Simbolo B.

$$1\,\text{B} = 8\,\text{bit}$$

- Dai byte ai bit si moltiplica per 8, dai bit ai byte si divide per 8: $5\,\text{B} = 40\,\text{bit}$, $72\,\text{bit} = 9\,\text{B}$.

## Quanti valori con n bit

$$2^n$$

- 1 byte: $2^8 = 256$ valori; 2 byte: $2^{16} = 65\,536$; 3 byte: $2^{24} = 16\,777\,216$.
- Contando da 0, il valore più grande è $2^n - 1$: in 1 byte, da 0 a 255.

## I multipli del byte

| Decimali (SI) | Byte | Binari (IEC) | Byte |
|---|---|---|---|
| kB | $10^3 = 1000$ | KiB | $2^{10} = 1024$ |
| MB | $10^6$ | MiB | $2^{20} = 1\,048\,576$ |
| GB | $10^9$ | GiB | $2^{30} = 1\,073\,741\,824$ |
| TB | $10^{12}$ | TiB | $2^{40}$ |

- Ogni multiplo decimale vale 1000 volte il precedente, ogni multiplo binario 1024 volte.
- Molti libri e alcuni sistemi operativi scrivono KB, MB, GB intendendo i multipli da 1024.

## Convertire

1. Fattore: 8 tra bit e byte, 1000 tra multipli decimali vicini, 1024 tra multipli binari vicini.
2. Verso l'unità più piccola si moltiplica, verso la più grande si divide.
3. Più passi, un fattore per ogni passo.
4. Controllo: con l'unità più piccola il numero è più grande.

Esempi: $3{,}5\,\text{MB} = 3500\,\text{kB}$; $250\,000\,\text{kB} = 0{,}25\,\text{GB}$; $4096\,\text{B} = 4\,\text{KiB}$; $16\,000\,\text{bit} = 2000\,\text{B} = 2\,\text{kB}$.

## Velocità di trasmissione

- Si misura in $\text{bit/s}$; multipli sempre decimali: $1\,\text{kbit/s} = 1000\,\text{bit/s}$, $1\,\text{Mbit/s} = 1000\,\text{kbit/s}$, $1\,\text{Gbit/s} = 1000\,\text{Mbit/s}$.
- Tempo per trasferire la quantità di dati $D$ alla velocità $v$:

$$t = \frac{D}{v}$$

1. Porta $D$ nello stesso multiplo della velocità (MB con $\text{Mbit/s}$).
2. Moltiplica per 8: i MB diventano Mbit.
3. Dividi per la velocità: il tempo è in secondi.
4. Per i minuti dividi per 60.

Esempio: $6\,\text{MB}$ a $16\,\text{Mbit/s}$: $6 \cdot 8 = 48\,\text{Mbit}$, $t = 48 : 16 = 3\,\text{s}$.

```ad-warning
1 kB non sono 1024 byte
$1\,\text{kB} = 1000\,\text{B}$, $1\,\text{KiB} = 1024\,\text{B}$: con la "i" il fattore è 1024.
```

```ad-warning
Megabit al secondo, non megabyte
$100\,\text{Mbit/s}$ sono $100 : 8 = 12{,}5\,\text{MB}$ ogni secondo: il fattore 8 non si dimentica.
```

```ad-warning
Due byte non danno il doppio dei valori
Da 1 a 2 byte i valori passano da $256$ a $65\,536 = 256 \cdot 256$, non a $512$.
```
