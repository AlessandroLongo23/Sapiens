# Formulario: Dati, frequenze e grafici

## Popolazione e campione

- Popolazione: l'insieme di tutti gli elementi su cui si vuole sapere qualcosa. Ogni elemento è un'unità statistica.
- Censimento: si osservano tutte le unità della popolazione.
- Campione: la parte della popolazione che si osserva, con le unità scelte a caso.

## Caratteri e modalità

- Carattere: la caratteristica osservata; modalità: i valori che assume.

| Carattere | Modalità | Esempi |
|---|---|---|
| qualitativo | parole | sport preferito, colore degli occhi |
| quantitativo discreto | numeri isolati, si contano | numero di fratelli, gol |
| quantitativo continuo | qualunque numero in un intervallo, si misurano | altezza, peso, tempo |

Numero di maglia e CAP sono qualitativi: i conti con quei numeri non hanno senso.

## Frequenze

$N$ è il numero totale dei dati.

- Frequenza assoluta $f_a$: quante volte compare la modalità. Somma: $N$.
- Frequenza relativa, tra $0$ e $1$. Somma: $1$.

$$f_r = \dfrac{f_a}{N}$$

- Frequenza percentuale: $f_r \cdot 100$, con il segno $\%$. Somma: $100\%$.
- Frequenza cumulata: la frequenza della modalità più quelle delle modalità che la precedono. Solo per modalità con un ordine; l'ultima è $N$.

Esempio: $9$ dati su $20$ danno $f_r = \dfrac{9}{20} = 0{,}45$, cioè il $45\%$.

## Classi

- $150 \vdash 160$: da $150$ compreso a $160$ escluso.
- Ampiezza: estremo superiore meno estremo inferiore, qui $10$.
- Classi consecutive, senza sovrapposizioni e senza buchi; un dato sul confine va nella classe che comincia con lui.

## Grafici

| Dati | Grafico |
|---|---|
| carattere qualitativo | ortogramma (barre separate); aerogramma se conta la parte del totale |
| quantitativo discreto, poche modalità | ortogramma |
| dati raggruppati in classi | istogramma (rettangoli attaccati) |
| valori che cambiano nel tempo | diagramma cartesiano |

Angolo di un settore dell'aerogramma:

$$\alpha = f_r \cdot 360^\circ$$

Dall'angolo alla frequenza: $f_r = \dfrac{\alpha}{360^\circ}$, e $f_a = f_r \cdot N$.

```ad-warning
L'angolo non è la percentuale
Il $35\%$ non è un settore di $35^\circ$, ma di $0{,}35 \cdot 360^\circ = 126^\circ$.
```

```ad-warning
Il dato sul confine
$170$ va in $170 \vdash 180$, e solo lì: il totale delle frequenze deve essere $N$.
```

```ad-warning
Cumulare modalità senza ordine
Con lo sport preferito o il colore degli occhi la frequenza cumulata non ha significato.
```
