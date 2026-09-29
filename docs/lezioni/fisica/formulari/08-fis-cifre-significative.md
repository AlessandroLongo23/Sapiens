# Formulario: Le cifre significative

## Che cosa sono

Le cifre certe più la prima incerta. Una misura scritta senza incertezza è incerta sull'ultima cifra: $4{,}3$ cm ha due cifre significative, $4{,}30$ cm tre.

## Come si contano

1. Le cifre diverse da zero contano: $4{,}37 \to 3$.
2. Gli zeri in mezzo contano: $305 \to 3$, $1{,}02 \to 3$.
3. Gli zeri all'inizio non contano: $0{,}0045 \to 2$.
4. Gli zeri finali dopo la virgola contano: $2{,}50 \to 3$.
5. Gli zeri finali di un intero sono ambigui: $1200$ si scrive $1{,}2 \cdot 10^3$ (due), $1{,}20 \cdot 10^3$ (tre), $1{,}200 \cdot 10^3$ (quattro).

Cambiare unità non cambia le cifre significative: $12{,}3\ \text{cm} = 0{,}123\ \text{m} = 1{,}23 \cdot 10^5\ \mu\text{m}$.

## Arrotondare

Si guarda solo la prima cifra tolta: $5$ o più, l'ultima che resta sale di uno; meno di $5$, resta com'è.

| Numero | Cifre | Risultato |
|---|---|---|
| $3{,}14159$ | $3$ | $3{,}14$ |
| $0{,}004567$ | $2$ | $0{,}0046$ |
| $9{,}97$ | $2$ | $10$, cioè $1{,}0 \cdot 10^1$ |
| $46\,280$ | $2$ | $4{,}6 \cdot 10^4$ |

## Nei calcoli

| Operazione | Il risultato ha |
|---|---|
| somme e differenze | i decimali del dato che ne ha meno |
| prodotti e quozienti | le cifre significative del dato che ne ha meno |

- Numeri esatti (conteggi, fattori delle formule, conversioni definite) non limitano il risultato: $4 \cdot 2{,}35 = 9{,}40$.
- Nei passaggi intermedi si tengono una o due cifre in più; si arrotonda solo alla fine.
- Se la misura ha l'incertezza scritta, decide l'incertezza: l'ultima cifra del valore è nella sua posizione.

```ad-warning
Arrotondare a passi
$2{,}4499$ a due cifre è $2{,}4$, non $2{,}5$.
```

```ad-warning
Le differenze contano i decimali
$45{,}82 - 45{,}7 = 0{,}1$: una sola cifra significativa.
```

```ad-warning
Gli zeri che servono
$100{,}0 : 12{,}5 = 8{,}00$, con tre cifre: gli zeri si aggiungono.
```
