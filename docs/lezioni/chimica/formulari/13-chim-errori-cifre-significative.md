# Formulario: Errori di misura e cifre significative

## Errori

- Sistematici: sempre dalla stessa parte (bilancia non azzerata, menisco letto dall'alto). Non si vedono ripetendo; si correggono lo strumento o il metodo.
- Casuali: a volte in eccesso, a volte in difetto; si riducono con la media di più misure.
- Sbaglio: una misura lontanissima dalle altre, da scartare.
- Precisione: misure vicine tra loro. Accuratezza: media vicina al valore vero.

## Incertezza di una misura

- Sensibilità: la più piccola variazione che lo strumento mostra. Portata: il valore più grande che misura.
- Misura singola: l'incertezza è la sensibilità; vetreria tarata: la tolleranza.

Serie di misure: valore medio e semidispersione (o la sensibilità, se la semidispersione è più piccola).

$$\bar x = \frac{x_1 + \ldots + x_n}{n} \qquad \Delta x = \frac{x_{\max} - x_{\min}}{2}$$

- Risultato $x = (\bar x \pm \Delta x)\,\text{unità}$: $\Delta x$ con una cifra significativa, $\bar x$ alla stessa posizione.

## Incertezza relativa e propagazione

$$\varepsilon = \frac{\Delta x}{\bar x} \qquad \varepsilon_\% = \varepsilon \cdot 100\%$$

- Somme e differenze: si sommano le incertezze assolute (buretta: $0{,}1 + 0{,}1 = 0{,}2\,\text{mL}$).
- Prodotti e quozienti: si sommano le incertezze relative ($\varepsilon_d = \varepsilon_m + \varepsilon_V$).
- Compatibile: il valore di tabella cade tra $\bar x - \Delta x$ e $\bar x + \Delta x$.

## Cifre significative

1. Le cifre diverse da zero contano: $18{,}7$ ne ha $3$.
2. Gli zeri in mezzo contano: $1{,}020$ ne ha $4$.
3. Gli zeri iniziali no: $0{,}0250$ ne ha $3$.
4. Gli zeri finali dopo la virgola sì: $25{,}00$ ne ha $4$.
5. Gli zeri finali di un intero sono ambigui: $1{,}50 \cdot 10^{3}$ ne ha $3$.

- Arrotondare: si guarda la prima cifra tolta, da $5$ in su per eccesso: $0{,}24972 \to 0{,}250$.
- Somme e differenze: i decimali del dato che ne ha meno: $48{,}62 + 5{,}3 = 53{,}9$.
- Prodotti e quozienti: le cifre del dato che ne ha meno: $19{,}73 : 25{,}0 = 0{,}789$.
- Numeri esatti (conteggi, fattori di conversione) non limitano. Si arrotonda solo alla fine.

```ad-warning
Metà della differenza
La semidispersione è metà di $x_{\max} - x_{\min}$.
```

```ad-warning
Lo zero finale si scrive
$0{,}250\,\text{mol}$ non è $0{,}25\,\text{mol}$.
```

```ad-warning
Arrotondare, non troncare
$0{,}7892$ con due cifre è $0{,}79$.
```
