# Flashcard: Grafica bitmap e grafica vettoriale

## bitmap
Che cosa contiene il file di un'immagine bitmap?
---
Il colore di ogni pixel di una griglia.

## vettoriale
Che cosa contiene il file di un'immagine vettoriale?
---
Un elenco di forme, con le loro posizioni e i loro colori.

## ingrandire-bitmap
Che cosa succede ingrandendo molto una bitmap?
---
Si sgrana: i pixel sono sempre gli stessi, e ognuno occupa più spazio fino a diventare un quadretto visibile.

## ingrandire-vettoriale
Perché un disegno vettoriale ingrandito resta netto?
---
Perché a ogni dimensione il calcolatore ricalcola i pixel dalle forme: è la rasterizzazione.

## foto-vettoriale
Vero o falso: una fotografia conviene salvarla in vettoriale, così si può ingrandire.
---
Falso. Una foto non è fatta di forme: resta bitmap.

## logo-striscione
Il logo della scuola deve andare su uno striscione di due metri. Bitmap o vettoriale?
---
Vettoriale: resta netto a qualunque dimensione.

## peso-bitmap
Da che cosa dipende il peso di una bitmap non compressa? E quello di un disegno vettoriale?
---
La bitmap dal numero dei pixel, il vettoriale dal numero delle forme.

## conversione-difficile
Tra bitmap e vettoriale, quale passaggio è facile e quale difficile?
---
Da vettoriale a bitmap è facile: si esporta. Da bitmap a vettoriale un programma deve indovinare le forme, e ci riesce solo con disegni semplici.

## svg-circle
Che cosa disegna `<circle cx="50" cy="20" r="10" fill="red"/>`?
---
Un cerchio rosso di raggio $10$ con il centro in $(50, 20)$.

## svg-y
In un disegno SVG alto $100$, un cerchio con `cy="90"` sta in alto o in basso?
---
In basso: la y cresce verso il basso, a partire dall'angolo in alto a sinistra.

## svg-ordine
In un file SVG un cerchio è scritto prima di un rettangolo che lo copre in parte. Quale dei due si vede intero?
---
Il rettangolo: le forme si disegnano nell'ordine in cui sono scritte, e l'ultima copre le altre.

## svg-width
In un SVG cambi `width="200"` in `width="400"`. Che cosa succede al disegno e al file?
---
Il disegno raddoppia e resta netto; il file è lungo quanto prima.

## pixel-per-la-stampa
Quanti pixel servono in larghezza per stampare una foto larga $5$ pollici a $300\,\text{dpi}$?
---
$5 \cdot 300 = 1500$ pixel.

## dimensione-stampa
Un'immagine larga $1200$ pixel è stampata a $300\,\text{dpi}$. Quanti pollici è larga?
---
$1200 : 300 = 4$ pollici, circa $10\,\text{cm}$.

## dpi-etichetta
Scrivi "300 dpi" nelle proprietà di un'immagine di $400$ pixel senza cambiare i pixel. Diventa più nitida?
---
No. Cambia solo quanto grande verrà stampata: i dettagli stanno nei pixel.

## ritagliare
Che cosa succede ai pixel quando ritagli un'immagine?
---
Quelli fuori dal ritaglio vengono eliminati; gli altri restano identici.

## rimpicciolire
Rimpicciolisci una foto, la salvi e poi la ingrandisci di nuovo. Riottieni l'originale?
---
No. Rimpicciolendo, più pixel si sono fusi in uno; ingrandendo, i pixel in più vengono inventati dai vicini.

## originale
Perché si ritaglia e si ridimensiona una copia, e non l'originale?
---
Perché i pixel eliminati o fusi non si recuperano: dall'originale si può sempre ripartire.
