# Formulario: Distribuzioni doppie

## La tabella a doppia entrata

- Distribuzione doppia: su ogni unità due caratteri $X$ e $Y$; i dati sono coppie di modalità.
- Righe: modalità di $X$. Colonne: modalità di $Y$. In ogni casella la frequenza congiunta: quante unità hanno insieme quelle due modalità.
- La somma di tutte le frequenze congiunte è $n$, il numero delle unità.

| | a piedi | autobus | motorino | totale |
|---|---|---|---|---|
| centro | $15$ | $9$ | $6$ | $30$ |
| periferia | $1$ | $13$ | $6$ | $20$ |
| totale | $16$ | $22$ | $12$ | $50$ |

## Distribuzioni marginali

- Totali di riga: distribuzione del solo $X$ ($30$, $20$). Totali di colonna: distribuzione del solo $Y$ ($16$, $22$, $12$).
- Controllo: i totali di riga e i totali di colonna sommano tutti e due a $n$.
- Frequenza relativa congiunta: frequenza congiunta divisa per $n$. Esempio: $\dfrac{13}{50} = 26\%$.
- Dalle frequenze congiunte si ricavano le marginali; dalle marginali non si ricavano le congiunte.

## Distribuzioni condizionate

- $Y \mid X = \text{periferia}$: la riga "periferia", cioè $Y$ tra le sole unità con quella modalità di $X$. Le colonne sono le distribuzioni condizionate di $X$.
- Frequenze relative condizionate: si divide per il totale della riga (o della colonna), non per $n$.

| | a piedi | autobus | motorino |
|---|---|---|---|
| $Y \mid X = \text{centro}$ | $50\%$ | $30\%$ | $20\%$ |
| $Y \mid X = \text{periferia}$ | $5\%$ | $65\%$ | $30\%$ |
| tutti | $32\%$ | $44\%$ | $24\%$ |

- Media condizionata: la media di $Y$ calcolata su una sola riga, dividendo per il totale di quella riga.

## Indipendenza

- $X$ e $Y$ sono indipendenti se le distribuzioni condizionate di $Y$ hanno le stesse frequenze relative per tutte le modalità di $X$. Altrimenti sono dipendenti.
- Con $f_{ij}$ frequenza congiunta, $r_i$ totale di riga, $c_j$ totale di colonna, sono indipendenti quando in ogni casella

$$f_{ij} = \frac{r_i \cdot c_j}{n}$$

- Frequenza teorica di una casella: $\dfrac{r_i \cdot c_j}{n}$. Esempio: $\dfrac{30 \cdot 16}{50} = 9{,}6$.
- Contingenza: frequenza osservata meno frequenza teorica. Esempio: $15 - 9{,}6 = 5{,}4$. In ogni riga e in ogni colonna le contingenze sommano a zero.

Come si controlla:

1. Calcola i totali di riga, di colonna e $n$.
2. Calcola la frequenza teorica di ogni casella.
3. Tutte uguali alle frequenze osservate: indipendenti. Una sola diversa: dipendenti.

```ad-warning
Il denominatore sbagliato
Tra tutti gli studenti si divide per $n$; tra quelli di una riga per il totale di riga; tra quelli di una colonna per il totale di colonna: $13 : 50$, $13 : 20$ e $13 : 22$ sono tre percentuali diverse.
```

```ad-warning
Arrotondare le frequenze teoriche
Una frequenza teorica come $9{,}6$ resta con la virgola: non è un conteggio.
```

```ad-warning
Dipendenza non è causa
Due caratteri dipendenti variano insieme, ma la tabella non dice quale dei due causa l'altro, né se uno causa l'altro.
```
