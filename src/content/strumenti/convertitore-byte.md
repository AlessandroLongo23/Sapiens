# Convertitore di byte: KB, MB, GB e GiB

## Che cos'è

Il bit è la più piccola unità di informazione: vale 0 oppure 1. Un byte è un gruppo di 8 bit. I multipli del byte hanno due famiglie. I prefissi kilo, mega, giga e tera valgono potenze di 1000, come nel Sistema Internazionale. I prefissi binari kibi, mebi, gibi e tebi valgono potenze di 1024, cioè di $2^{10}$: li ha introdotti la IEC (International Electrotechnical Commission) nel 1998, perché "kilobyte" si usava per tutti e due i valori.

| Decimale | Valore | Binario | Valore |
|---|---|---|---|
| 1 kB | $1000$ byte | 1 KiB | $1024$ byte |
| 1 MB | $1000^2$ byte | 1 MiB | $1024^2$ byte |
| 1 GB | $1000^3$ byte | 1 GiB | $1024^3$ byte |
| 1 TB | $1000^4$ byte | 1 TiB | $1024^4$ byte |

## Come si converte a mano

Nella stessa famiglia si moltiplica o si divide per 1000 (o per 1024) una volta per ogni gradino. Da una famiglia all'altra si passa per il byte.

```ad-example
Esempio: 500 GB in GiB
Scrivi i gigabyte in byte, poi dividi per il valore di un gibibyte:

$$\begin{aligned}
500\ \text{GB} &= 500 \cdot 1000^3\ \text{B} = 500\,000\,000\,000\ \text{B} \\[6pt]
500\,000\,000\,000 : 1024^3 &\approx 465{,}66\ \text{GiB}
\end{aligned}$$
```

Tra bit e byte il fattore è 8: $2\ \text{MB} = 16\ \text{Mbit}$.

```ad-error
Errori frequenti
- Usare 1024 per i GB: per la norma, 1 GB è un miliardo di byte esatto. Con 1024 si parla di GiB.
- Confondere b e B: 100 Mbit/s è una velocità in bit, che in byte fa $12{,}5$ MB/s.
- Dimenticare un gradino: da GB a kB i gradini sono due, quindi si moltiplica per $1000^2$.
```

## Domande frequenti

### Perché un disco da 1 TB sembra più piccolo?

Il produttore conta $1\ \text{TB} = 10^{12}$ byte. Windows divide per 1024 ma scrive "GB": mostra circa 931 GB, che sono in realtà 931 GiB. Lo spazio è lo stesso.

### Si scrive KB o kB?

Il simbolo del prefisso kilo è la k minuscola, quindi kB. Molti però scrivono KB, e il convertitore capisce anche quello.
