# Formulario: Grafica bitmap e grafica vettoriale

## Due modi di descrivere un'immagine

| | Bitmap | Vettoriale |
|---|---|---|
| Il file contiene | i colori dei pixel | le forme, con posizioni e colori |
| Ingrandendo | si sgrana | resta netta |
| Il peso dipende da | quanti pixel ha | quante forme ha |
| Va bene per | fotografie, schermate, dipinti | loghi, icone, grafici, mappe, caratteri |
| Formati | JPEG, PNG, GIF, WebP | SVG |

- Rasterizzazione: il calcolo dei pixel a partire dalle forme, rifatto a ogni dimensione.
- Da vettoriale a bitmap si passa esportando; da bitmap a vettoriale solo per disegni semplici.

## SVG

```
<svg viewBox="0 0 96 96" width="200">
    <rect width="96" height="96" fill="#e6f0fa"/>
    <circle cx="64" cy="32" r="18" fill="#f5a524"/>
    <polygon points="6,86 38,26 70,86" fill="#1f3b5c"/>
</svg>
```

| Scrittura | Che cosa vuol dire |
|---|---|
| `viewBox="0 0 96 96"` | la griglia del disegno: larga $96$, alta $96$ |
| `width="200"` | la larghezza sullo schermo |
| `rect` con `x`, `y`, `width`, `height` | un rettangolo |
| `circle` con `cx`, `cy`, `r` | un cerchio: centro e raggio |
| `polygon` con `points` | un poligono: i vertici, prima la x e poi la y |
| `fill` | il colore di riempimento |

- L'origine è in alto a sinistra: la x cresce verso destra, la y verso il basso.
- Le forme si disegnano nell'ordine in cui sono scritte: l'ultima copre le altre.

## Pixel, schermo e stampa

- Sullo schermo contano i pixel: un pixel dell'immagine occupa un pixel dello schermo.
- Sulla carta conta la densità di stampa, in punti per pollice (dpi). Un pollice è $2{,}54\,\text{cm}$.

$$\text{pixel} = \text{pollici} \cdot \text{dpi}$$

- Dimensione della stampa: $2400$ pixel a $300\,\text{dpi}$ sono $2400 : 300 = 8$ pollici, cioè $8 \cdot 2{,}54 = 20{,}32\,\text{cm}$.
- Pixel che servono: $4$ pollici a $300\,\text{dpi}$ chiedono $4 \cdot 300 = 1200$ pixel.

## Le operazioni su una bitmap

| Operazione | Che cosa succede ai pixel | Si torna indietro? |
|---|---|---|
| ritagliare | quelli fuori vengono eliminati, gli altri restano identici | no |
| rimpicciolire | ogni pixel nuovo è la media di più pixel vecchi | no |
| ingrandire | i pixel in più vengono inventati dai vicini | sì, ma non si guadagna niente |
| cambiare formato, senza perdita | restano gli stessi | sì |
| cambiare formato, con perdita | cambiano un po' | no |

L'originale non si tocca: si lavora su una copia e si rimpicciolisce una volta sola, alla fine.

```ad-warning
Ingrandire non aggiunge dettagli
I pixel in più sono medie dei vicini: l'immagine viene sfocata, non più ricca.
```

```ad-warning
La y cresce verso il basso
In SVG `cy="10"` è in alto e `cy="90"` è in basso.
```

```ad-warning
Cambiare il numero dei dpi non cambia i pixel
È un'etichetta che dice quanto grande stampare: i dettagli stanno nei pixel.
```
