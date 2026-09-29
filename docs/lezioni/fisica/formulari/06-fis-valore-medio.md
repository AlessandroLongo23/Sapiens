# Formulario: Valore medio e incertezza di una serie di misure

## Valore medio

$$\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}$$

È la stima migliore della grandezza: riduce gli errori casuali, non quelli sistematici.

## Incertezza assoluta

- Semidispersione, metà del campo di variazione:

$$\Delta x = \frac{x_{\max} - x_{\min}}{2}$$

- Una sola misura, misure tutte uguali, o semidispersione più piccola della sensibilità: $\Delta x$ è la sensibilità dello strumento.
- In breve: $\Delta x$ è la più grande tra la semidispersione e la sensibilità.

## Scrivere il risultato

$$x = (\bar{x} \pm \Delta x)\,\text{unità}$$

1. Arrotonda $\Delta x$ a una cifra significativa: $0{,}19 \to 0{,}2$; $0{,}0234 \to 0{,}02$.
2. Arrotonda $\bar{x}$ alla stessa posizione decimale di $\Delta x$: $2{,}508 \to 2{,}5$.
3. Se la prima cifra tolta è $5$ o più, l'ultima cifra che resta aumenta di uno.

Esempi: $(12{,}50 \pm 0{,}06)\,\text{s}$, $(2{,}5 \pm 0{,}2)\,\text{s}$, $(21{,}0 \pm 0{,}1)\,\text{cm}$.

## Confrontare due misure

- L'intervallo di una misura va da $\bar{x} - \Delta x$ a $\bar{x} + \Delta x$.
- Due misure sono compatibili se i loro intervalli si sovrappongono almeno in parte.
- Una misura è compatibile con un valore di riferimento se il valore sta nel suo intervallo.

```ad-warning
Il diviso due
La semidispersione di $12{,}44$ e $12{,}56$ è $\dfrac{0{,}12}{2} = 0{,}06$, non $0{,}12$.
```

```ad-warning
Troppe cifre
$(2{,}508 \pm 0{,}19)\,\text{s}$ si scrive $(2{,}5 \pm 0{,}2)\,\text{s}$.
```

```ad-warning
Lo zero finale
Con $\Delta t = 0{,}06$ s si scrive $12{,}50$ s, non $12{,}5$ s.
```
