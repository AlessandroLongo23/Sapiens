# Formulario: La compressione dei dati, con e senza perdita

## Comprimere

- Compressione: riscrivere dei dati con meno bit. Decompressione: il procedimento inverso.
- Ridondanza: la parte dei dati che si può ricavare dal resto.

$$\begin{aligned}& \text{rapporto di compressione} \\ & \quad = \frac{\text{dimensione originale}}{\text{dimensione compressa}}\end{aligned}$$

- Da $36\,\text{MB}$ a $3\,\text{MB}$: rapporto $36 : 3 = 12$, cioè $12 : 1$.
- Dimensione compressa: originale diviso rapporto ($30\,\text{MB}$ con rapporto $10$ diventano $3\,\text{MB}$).
- Spazio risparmiato: $(30 - 3) : 30 = 0{,}9$, cioè il $90\%$.

## Senza perdita e con perdita

| | Senza perdita | Con perdita |
|---|---|---|
| Decomprimendo si ottiene | l'originale esatto | qualcosa che gli somiglia |
| Che cosa toglie | la ridondanza | la ridondanza e i dettagli meno percepiti |
| Quanto comprime | poco: dipende dai dati | molto: lo decide chi salva, con la qualità |
| Si usa per | testi, programmi, dati, archivi, disegni | fotografie, musica, video |

## RLE

Al posto di una sequenza di valori uguali si scrive quanti sono, poi il valore.

1. Conta quanti valori uguali ci sono di fila a partire dal primo.
2. Scrivi il numero e il valore.
3. Riparti dal primo valore diverso, fino alla fine.

| Riga | Codifica | Byte della riga | Byte della codifica | Rapporto |
|---|---|---|---|---|
| `BBBBBBNNNNRRRRBB` | `6B4N4R2B` | $16$ | $4 \cdot 2 = 8$ | $2$ |
| `NNNBBBBBBBBBBNNN` | `3N10B3N` | $16$ | $3 \cdot 2 = 6$ | $2{,}67$ |
| `BNBNBNBNBNBNBNBN` | `1B1N1B1N...` | $16$ | $16 \cdot 2 = 32$ | $0{,}5$ |

Un pixel occupa un byte, una sequenza due: uno per il numero, uno per il colore.

## Dizionario e codici di lunghezza diversa

- Dizionario: i pezzi che si ripetono ricevono un numero, e nel testo si scrive il numero. È l'idea degli archivi ZIP e del formato PNG.
- Codici di lunghezza diversa: il valore più frequente riceve il codice più corto. Nessun codice è l'inizio di un altro.

| Colore | Quanti | Codice |
|---|---|---|
| B | $10$ | `0` |
| N | $3$ | `10` |
| R | $2$ | `110` |
| V | $1$ | `111` |

Bit in tutto: $10 \cdot 1 + 3 \cdot 2 + 2 \cdot 3 + 1 \cdot 3 = 25$, contro i $16 \cdot 2 = 32$ del codice fisso.

## Comprimere due volte

- Senza perdita: la seconda volta non si guadagna niente, e i dati possono allungarsi.
- Con perdita: ogni salvataggio butta via ancora qualcosa. Si conserva l'originale e si comprime una volta sola, alla fine.

```ad-warning
Una compressione senza perdita non accorcia tutto
RLE con più di una sequenza ogni due pixel allunga i dati.
```

```ad-warning
Con perdita solo ciò che si guarda o si ascolta
Testi, programmi e dati si comprimono senza perdita.
```

```ad-warning
Il rapporto si legge dalla parte giusta
$4 : 1$ vuol dire un quarto dell'originale, il $25\%$, non il $4\%$.
```
