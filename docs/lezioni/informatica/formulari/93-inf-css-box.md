# Formulario: Il modello a scatola

## Le quattro parti

Dal centro verso l'esterno:

1. contenuto: testo o immagine dell'elemento;
2. `padding`: spazio interno, tra contenuto e bordo, con lo sfondo dell'elemento;
3. `border`: la cornice;
4. `margin`: spazio esterno, sempre trasparente.

## Come si scrivono

| Scrittura | Che cosa vuol dire |
|---|---|
| `padding: 16px` | 16 px su tutti e quattro i lati |
| `padding: 8px 24px` | 8 px sopra e sotto, 24 px a sinistra e a destra |
| `padding-top`, `padding-right`, `padding-bottom`, `padding-left` | un lato solo |
| `margin: 20px`, `margin: 0 auto`, `margin-bottom: 24px` | come il padding; `auto` a sinistra e a destra centra un blocco che ha una larghezza |
| `border: 4px solid darkorange` | spessore, stile (`solid`, `dashed`, `dotted`), colore |
| `border-bottom: 2px solid navy` | il bordo di un lato solo |

## Quanto è larga una scatola

Con `box-sizing: content-box`, il valore di partenza, `width` è la larghezza del contenuto:

$$\begin{aligned}& \text{larghezza fino al bordo} \\ & \quad = \text{width} + 2 \cdot \text{padding} + 2 \cdot \text{border}\end{aligned}$$

$$\begin{aligned}& \text{spazio occupato} \\ & \quad = \text{larghezza fino al bordo} + 2 \cdot \text{margin}\end{aligned}$$

Con `width: 200px`, `padding: 16px`, `border: 4px`, `margin: 20px`: $200 + 32 + 8 = 240$ pixel fino al bordo, $240 + 40 = 280$ pixel occupati.

Con `box-sizing: border-box` `width` è la larghezza fino al bordo:

$$\begin{aligned}& \text{larghezza del contenuto} \\ & \quad = \text{width} - 2 \cdot \text{padding} - 2 \cdot \text{border}\end{aligned}$$

Con `width: 200px`, `padding: 20px`, `border: 4px`: la scatola è larga 200 px, il contenuto $200 - 40 - 8 = 152$ pixel.

In altezza i conti sono gli stessi con `height`. Senza `height` la scatola è alta quanto il suo contenuto.

## Blocco e in linea

| | Di blocco | In linea |
|---|---|---|
| Esempi | `h1`, `p`, `ul`, `li`, `div`, `header`, `nav`, `main`, `footer` | `a`, `em`, `strong`, `span` |
| Dove sta | su una riga nuova | dentro la riga di testo |
| Larghezza | tutta quella disponibile, o `width` | quella del contenuto |
| `width`, `height` | funzionano | non hanno effetto |
| Margini sopra e sotto | funzionano | non hanno effetto |

`display: block` fa comportare un elemento come un blocco; `display: inline-block` lo tiene nella riga ma con larghezza e margini che funzionano.

## Margini che si fondono

Tra due blocchi uno sotto l'altro la distanza è il più grande tra il margine inferiore del primo e il margine superiore del secondo, non la loro somma: con 30 px e 20 px sono 30 px.

```ad-warning
Padding e bordo valgono doppio
Stanno a sinistra e a destra: nella larghezza si sommano due volte ciascuno.
```

```ad-warning
Il bordo senza stile non si vede
`border: 4px darkorange` non disegna niente: serve `solid`, `dashed` o `dotted`.
```

```ad-warning
La larghezza di un elemento in linea
`width` su un `a` o su uno `span` non fa niente, finché non cambi `display`.
```
