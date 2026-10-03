# Formulario: La codifica dei suoni

## Dal suono ai numeri

- Segnale analogico: cambia con continuità e può assumere qualunque valore. Segnale digitale: una sequenza di numeri.
- Due passaggi: campionamento (quando misurare) e quantizzazione (con quale precisione scrivere la misura).

## Campionamento

- Campione: una misura del segnale. Frequenza di campionamento: campioni presi in un secondo, in hertz; $1\,\text{kHz} = 1000\,\text{Hz}$.

$$\text{campioni} = \text{frequenza di campionamento} \cdot \text{secondi}$$

- Esempio: $8\,\text{kHz}$ per $3$ secondi sono $8000 \cdot 3 = 24\,000$ campioni.
- Regola del campionamento:

$$\text{frequenza di campionamento} \ge 2 \cdot \text{frequenza più alta del suono}$$

- Al contrario: la frequenza più alta registrata correttamente è la metà di quella di campionamento. Con $44{,}1\,\text{kHz}$ si arriva a $22{,}05\,\text{kHz}$.

## Quantizzazione

- Ogni campione diventa il numero del livello più vicino. Con $n$ bit per campione:

$$\text{livelli} = 2^n$$

| Bit per campione | Livelli |
|---|---|
| $8$ | $256$ |
| $16$ | $65\,536$ |

## Canali

- Mono: 1 canale. Stereo: 2 canali, e il doppio dei dati.

## Dimensione di un suono non compresso

$$\text{byte} = \frac{\text{frequenza} \cdot \text{secondi} \cdot \text{bit per campione} \cdot \text{canali}}{8}$$

1. Durata in secondi, frequenza in hertz.
2. Campioni per canale: frequenza per durata.
3. Bit: campioni per bit per campione per canali.
4. Byte: bit diviso $8$.
5. Multipli con il fattore scritto: $1\,\text{kB} = 1000\,\text{B}$, $1\,\text{MB} = 1\,000\,000\,\text{B}$, $1\,\text{KiB} = 1024\,\text{B}$.

Esempio: un minuto stereo a $44{,}1\,\text{kHz}$ e $16$ bit: $44\,100 \cdot 60 \cdot 16 \cdot 2 : 8 = 10\,584\,000\,\text{B} = 10{,}584\,\text{MB}$.

- Bit al secondo: frequenza per bit per campione per canali. Per l'esempio, $1\,411\,200$ bit al secondo, cioè $1411{,}2\,\text{kbit/s}$.

```ad-warning
kHz e minuti
$44{,}1\,\text{kHz}$ sono $44\,100$ campioni al secondo; i minuti vanno portati in secondi.
```

```ad-warning
Il doppio della frequenza più alta
Campionare alla stessa frequenza del suono non basta: serve almeno il doppio.
```

```ad-warning
I canali
In stereo i campioni sono il doppio: il fattore $2$ non va dimenticato.
```
