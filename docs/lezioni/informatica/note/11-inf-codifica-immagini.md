# Note: La codifica delle immagini: pixel e colori

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "La codifica dell'informazione", 3 ottobre 2026).
`check.mts` passa senza errori sui tre file.

## Struttura ed esempi

Pixel e immagini raster (la griglia a 1 bit); risoluzione e megapixel; profondità di colore e $2^n$ colori; modello
RGB con la tabella dei colori e la scrittura esadecimale; dimensione di un'immagine non compressa in quattro passi;
cenno a compressione e immagini vettoriali.

Cinque esempi svolti: i pixel di $1920 \times 1080$; i bit per 16 e per 100 colori; $640 \times 480$ a 24 bit in byte e
kB; $800 \times 600$ a 1 bit; $1024 \times 768$ a 8 bit in KiB. Avvisi: le luci non si mescolano come le tempere; bit
per pixel e non byte per pixel.

## Conti

Rifatti in Python: $1920 \cdot 1080 = 2\,073\,600$; $640 \cdot 480 \cdot 24 : 8 = 921\,600$; $800 \cdot 600 : 8 =
60\,000$; $1024 \cdot 768 = 786\,432 = 768 \cdot 1024$; $2^{24} = 16\,777\,216$; $12\,000\,000 \cdot 3 = 36\,000\,000$;
$1800 : 300 = 6$ pollici, $15{,}24 \times 10{,}16\,\text{cm}$; `#FF8000` = 255, 128, 0.

## Scelte

- "Risoluzione" è il numero di pixel (larghezza per altezza), come nell'uso comune e in molti libri; la densità in
  dpi è in un riquadro `ad-note`, che si può saltare. Alcuni libri chiamano risoluzione solo la densità: domanda
  per Andrea.
- "Immagine raster", con "bitmap" tra parentesi una volta.
- La compressione e il vettoriale sono un cenno di due paragrafi, senza nomi di formati (JPEG, PNG, SVG): i formati
  sono di una lezione del terzo anno, che non si può ancora linkare.
- Scala di grigi e tavolozza sono solo nominate nella tabella della profondità.
- Convenzione non fissata dal README: la risoluzione si scrive `$1920 \times 1080$`, con `\times` e non con
  `\cdot`, perché è un nome e non un prodotto da calcolare; il prodotto dei pixel si scrive con `\cdot`.

## Figure

- `griglia-pixel-un-bit`: un cuore su una griglia $8 \times 8$ con i bit di ogni riga. I pixel accesi sono blu e non
  neri: nel tema scuro il sito inverte la luminosità delle figure, e un disegno in bianco e nero si scambierebbe con
  il suo negativo. Guardata in chiaro e in scuro.
- `cerchio-raster-e-vettoriale`: lo stesso cerchio su una griglia $10 \times 10$ e con il bordo liscio. Guardata in
  chiaro e in scuro.
- Una figura con i campioni dei colori RGB (rosso, verde, blu, giallo, ciano, magenta) l'ho disegnata e tolta: nel
  tema scuro il filtro del sito (inversione e rotazione della tinta) trasforma il rosso in rosa, il blu in un
  bianco azzurrino e il giallo in un colore quasi nero. Per una figura di colori serve un modo di escluderla
  dall'inversione; fino ad allora resta la tabella.

## Fonti da verificare

- "Un pollice è $2{,}54\,\text{cm}$": esatto per definizione.
- "$300\,\text{dpi}$" come densità di stampa è un valore tipico, usato qui solo come esempio di conto.
- Nessun numero che cambia nel tempo: la foto da 12 megapixel è un esempio, senza riferimento a un telefono.

## Domande per Andrea

- "Risoluzione" come numero di pixel oppure come densità (dpi, ppi): quale definizione usa il vostro libro?
- La scrittura esadecimale dei colori (`#FF8000`) va in questa lezione o la lasciate al web del terzo anno?
- Serve la tavolozza (immagini a colori indicizzati) con un esempio di conto?
- Il modello CMYK per la stampa: un cenno, o niente?
