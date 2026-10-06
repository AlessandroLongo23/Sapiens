# Formulario: Il lavoro in una trasformazione termodinamica

## Lavoro a pressione costante

Forza del gas su un pistone di sezione $S$: $F = p\,S$.

$$W = p\,\Delta V = p\,(V_f - V_i)$$

- Unità: $\text{Pa} \cdot \text{m}^3 = \text{J}$, e anche $\text{kPa} \cdot \text{L} = \text{J}$.
- Conversioni: $1\,\text{L} = 10^{-3}\,\text{m}^3$, $1\,\text{atm} = 1{,}01 \cdot 10^5\,\text{Pa}$.

## Segno del lavoro

$W$ è il lavoro compiuto dal gas; il lavoro compiuto dall'ambiente sul gas è $-W$.

| Trasformazione | $\Delta V$ | $W$ |
|---|---|---|
| espansione | positivo | positivo: il gas compie lavoro |
| compressione | negativo | negativo: il gas subisce lavoro |
| volume costante | zero | zero |

## Lavoro come area nel piano pressione-volume

Il lavoro è l'area tra la linea della trasformazione e l'asse dei volumi: positiva se la linea va verso destra, negativa se va verso sinistra.

| Tratto | Area | Lavoro |
|---|---|---|
| orizzontale (pressione costante) | rettangolo | $p\,\Delta V$ |
| verticale (volume costante) | nessuna | $0$ |
| rettilineo obliquo | trapezio | $\dfrac{p_A + p_B}{2}\,(V_B - V_A)$ |
| curvo | quadretti contati | numero di quadretti per il valore di un quadretto |

## Dipendenza dal cammino

- Tra gli stessi stati $A$ e $B$ il lavoro cambia con la trasformazione: non è una funzione di stato.
- Esempio: da $(2{,}0\,\text{L};\ 300\,\text{kPa})$ a $(6{,}0\,\text{L};\ 100\,\text{kPa})$ il lavoro è $1200\,\text{J}$ passando in alto, $800\,\text{J}$ lungo il segmento, $400\,\text{J}$ passando in basso.

## Trasformazione ciclica

Il lavoro di un ciclo è l'area racchiusa dalla linea chiusa: positivo se il ciclo è percorso in senso orario, negativo se in senso antiorario.

## Procedimento sul grafico

1. Calcola quanto vale un quadretto (unità della pressione per unità del volume).
2. Dividi la trasformazione in tratti.
3. Trova l'area sotto ogni tratto.
4. Dai il segno: più verso destra, meno verso sinistra.
5. Somma i lavori dei tratti.

```ad-warning
Litri e atmosfere vanno convertiti
$1\,\text{atm} \cdot 1\,\text{L}$ non è $1\,\text{J}$ ma $101\,\text{J}$: prima pascal e metri cubi, poi il prodotto.
```

```ad-warning
Il volume finale meno quello iniziale
In una compressione $\Delta V$ è negativo e il lavoro del gas è negativo.
```

```ad-warning
In un ciclo il lavoro non è zero
Il gas torna nello stato iniziale, ma il lavoro totale è l'area racchiusa dal ciclo.
```
