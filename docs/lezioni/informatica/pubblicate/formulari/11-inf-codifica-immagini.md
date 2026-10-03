# Formulario: La codifica delle immagini: pixel e colori

## Pixel e risoluzione

- Immagine raster (bitmap): una griglia di pixel, ognuno di un solo colore.
- Risoluzione: larghezza per altezza, in pixel. Numero di pixel:

$$\text{pixel} = \text{larghezza} \cdot \text{altezza}$$

- Esempio: $1920 \cdot 1080 = 2\,073\,600$ pixel, circa $2$ megapixel.

## Profondità di colore

- È il numero di bit per ogni pixel. Con $n$ bit:

$$\text{numero di colori} = 2^n$$

| Bit per pixel | Colori |
|---|---|
| $1$ | $2$ |
| $8$ | $256$ |
| $24$ | $16\,777\,216$ |

- Bit che servono per un certo numero di colori: il più piccolo $n$ con $2^n$ maggiore o uguale al numero. Per $100$ colori, $7$ bit.

## Modello RGB

- Tre componenti, rosso, verde e blu, ognuna da $0$ a $255$ (8 bit): in tutto $24$ bit per pixel.

| R | G | B | Colore |
|---|---|---|---|
| $255$ | $0$ | $0$ | rosso |
| $0$ | $255$ | $0$ | verde |
| $0$ | $0$ | $255$ | blu |
| $255$ | $255$ | $0$ | giallo |
| $0$ | $255$ | $255$ | ciano |
| $255$ | $0$ | $255$ | magenta |
| $0$ | $0$ | $0$ | nero |
| $255$ | $255$ | $255$ | bianco |

- Tre componenti uguali: un grigio.
- In esadecimale, due cifre per componente: `#FF8000` è R $= 255$, G $= 128$, B $= 0$.

## Dimensione di un'immagine non compressa

$$\text{byte} = \frac{\text{larghezza} \cdot \text{altezza} \cdot \text{bit per pixel}}{8}$$

1. Pixel: larghezza per altezza.
2. Bit: pixel per profondità di colore.
3. Byte: bit diviso $8$.
4. Multipli: $1\,\text{kB} = 1000\,\text{B}$, $1\,\text{MB} = 1\,000\,000\,\text{B}$; $1\,\text{KiB} = 1024\,\text{B}$, $1\,\text{MiB} = 1024\,\text{KiB}$.

Esempio: $640 \times 480$ a $24$ bit: $307\,200 \cdot 24 : 8 = 921\,600\,\text{B} = 921{,}6\,\text{kB}$.

## Compressione e immagini vettoriali

- Compressione: un procedimento che riduce i bit necessari per salvare l'immagine.
- Immagine vettoriale: le istruzioni per disegnare le forme, non i pixel; si ingrandisce senza perdere nitidezza.

```ad-warning
La profondità è in bit
Pixel per bit per pixel dà i bit: per i byte si divide per $8$.
```

```ad-warning
Le luci si sommano
Rosso e verde al massimo danno il giallo; tutte e tre al massimo il bianco; tutte a zero il nero.
```

```ad-warning
kB e KiB non sono lo stesso
$1\,\text{kB} = 1000\,\text{B}$, $1\,\text{KiB} = 1024\,\text{B}$: usa il fattore scritto nel testo.
```
