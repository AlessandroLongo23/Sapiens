# Flashcard: La codifica delle immagini: pixel e colori

## immagine-raster
Che cos'è un'immagine raster?
---
Un'immagine descritta come una griglia di pixel, ognuno con il suo colore.

## pixel
Che cos'è un pixel?
---
Il punto più piccolo di un'immagine raster: al suo interno il colore è uno solo.

## risoluzione
Che cosa indica la scritta $1920 \times 1080$ per un'immagine?
---
La risoluzione: $1920$ pixel in ogni riga e $1080$ righe.

## pixel-conto
Quanti pixel ha un'immagine $100 \times 50$?
---
$5000$, cioè $100 \cdot 50$.

## megapixel
Quanti pixel sono un megapixel?
---
Un milione di pixel.

## profondita-di-colore
Che cos'è la profondità di colore?
---
Il numero di bit usati per ogni pixel.

## colori-formula
Quanti colori diversi può avere un pixel con $n$ bit?
---
$2^n$.

## colori-otto-bit
Quanti colori si possono avere con $8$ bit per pixel?
---
$256$, cioè $2^8$.

## bit-per-sedici-colori
Quanti bit per pixel servono per $16$ colori?
---
$4$, perché $2^4 = 16$.

## bit-per-cento-colori
Vero o falso: per $100$ colori bastano $6$ bit per pixel.
---
Falso. $2^6 = 64$ è meno di $100$: servono $7$ bit, che danno $128$ combinazioni.

## rgb-definizione
Che cosa indicano i tre numeri di un colore RGB?
---
L'intensità della luce rossa, della verde e della blu, ognuna da $0$ a $255$.

## rgb-giallo
Di che colore è il pixel con R $= 255$, G $= 255$, B $= 0$?
---
Giallo: luce rossa e luce verde al massimo, blu spenta.

## rgb-nero-bianco
Quali terne RGB danno il nero e il bianco?
---
Nero $0$, $0$, $0$ (nessuna luce); bianco $255$, $255$, $255$ (tutte le luci al massimo).

## rgb-grigio
Come si riconosce un grigio dalla sua terna RGB?
---
Le tre componenti sono uguali, come $128$, $128$, $128$.

## rgb-quanti-colori
Quanti bit per pixel usa il modello RGB con componenti da $0$ a $255$?
---
$24$ bit: $8$ per ogni componente.

## dimensione-formula
Come si calcolano i byte di un'immagine non compressa?
---
Larghezza per altezza per bit per pixel, diviso $8$.

## dimensione-conto
Quanti byte occupa un'immagine non compressa di $10 \times 10$ pixel a $24$ bit?
---
$300$ byte: $100$ pixel per $3$ byte ciascuno.

## dimensione-errore-bit
Un'immagine ha $1000$ pixel a $8$ bit per pixel. Occupa $8000$ byte?
---
No. $8000$ sono i bit: i byte sono $8000 : 8 = 1000$.

## compressione
A che cosa serve la compressione di un'immagine?
---
A ridurre i bit necessari per salvarla, così il file occupa meno spazio.

## vettoriale
Che cosa contiene un'immagine vettoriale al posto dei pixel?
---
Le istruzioni per disegnare le forme (linee, cerchi, colori di riempimento): per questo si ingrandisce restando nitida.
