# Formulario: Bus e periferiche

## I tre bus

Un bus è un insieme di linee; ogni linea trasporta un bit alla volta.

| Bus | Che cosa trasporta | Verso |
|---|---|---|
| bus indirizzi | l'indirizzo della cella o della periferica | sempre dalla CPU |
| bus dati | il valore da leggere o da scrivere | verso la CPU in lettura, dalla CPU in scrittura |
| bus di controllo | i comandi, come lettura o scrittura | il comando di lettura o scrittura parte dalla CPU |

Lettura di una cella:

1. La CPU mette l'indirizzo sul bus indirizzi.
2. La CPU manda il segnale di lettura sul bus di controllo.
3. La memoria mette il contenuto sul bus dati.
4. La CPU lo preleva.

In scrittura la CPU mette sul bus dati il valore, e la memoria lo copia nella cella.

## La larghezza del bus indirizzi

Larghezza: il numero delle linee. Con $n$ linee:

$$\text{celle indirizzabili} = 2^n \qquad \text{indirizzo più grande} = 2^n - 1$$

- Per $N$ celle serve il più piccolo $n$ con $2^n \geq N$: per $1000$ celle, $2^9 = 512$ non arriva e $2^{10} = 1024$ sì, quindi $10$ linee.
- Una linea in più raddoppia le celle indirizzabili.
- Con celle da $1$ byte la memoria indirizzabile è $2^n\,\text{B}$:

$$2^{10}\,\text{B} = 1\,\text{KiB} \qquad 2^{20}\,\text{B} = 1\,\text{MiB} \qquad 2^{30}\,\text{B} = 1\,\text{GiB}$$

| Linee | Celle | Memoria con celle da 1 byte |
|---|---|---|
| $10$ | $1024$ | $1\,\text{KiB}$ |
| $16$ | $65\,536$ | $64\,\text{KiB}$ |
| $20$ | $1\,048\,576$ | $1\,\text{MiB}$ |
| $32$ | $4\,294\,967\,296$ | $4\,\text{GiB}$ |

- Larghezza del bus dati: i bit che viaggiano insieme in un trasferimento ($8$ linee, un byte alla volta).

## Le periferiche

| Tipo | Verso dei dati | Esempi |
|---|---|---|
| di ingresso | dall'esterno al computer | tastiera, mouse, microfono, webcam, scanner, sensori |
| di uscita | dal computer all'esterno | monitor, stampante, altoparlanti, cuffie, proiettore |
| di ingresso e di uscita | nei due versi | schermo tattile, memorie di massa, scheda di rete |

CPU, memoria centrale e bus non sono periferiche.

## Porte e interfacce

- Interfaccia: il circuito tra il bus e la periferica, che traduce i segnali dell'uno in quelli dell'altra.
- Porta: il connettore a cui si attacca il cavo della periferica (USB, HDMI, presa per le cuffie, porta di rete).
- Bluetooth e Wi-Fi sono interfacce senza fili: non hanno una porta.

```ad-warning
L'indirizzo e il contenuto sono due numeri diversi
L'indirizzo dice dove e viaggia sul bus indirizzi; il contenuto dice che cosa e viaggia sul bus dati.
```

```ad-warning
Una linea in più raddoppia, non aggiunge
Con $16$ linee le celle sono $2^{16}$, non $2 \cdot 16$ e non $16^2$.
```

```ad-warning
Il verso si guarda dal computer
Il microfono è di ingresso, le cuffie sono di uscita, lo schermo tattile è tutte e due le cose.
```
