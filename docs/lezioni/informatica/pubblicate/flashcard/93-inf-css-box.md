# Flashcard: Il modello a scatola

## quattro-parti
Quali sono le quattro parti della scatola di un elemento, dal centro verso l'esterno?
---
Contenuto, padding, bordo, margine.

## padding-o-margine
Vuoi allontanare il testo di un riquadro dalla sua cornice. Padding o margine?
---
Padding: è lo spazio tra il contenuto e il bordo. Il margine sta fuori dal bordo.

## sfondo-dove-arriva
Un riquadro ha `background-color: ivory`. Lo sfondo colora il padding? E il margine?
---
Il padding sì, il margine no: il margine è sempre trasparente.

## due-valori
Quanto vale il padding a sinistra con `padding: 8px 24px`?
---
24 px: il primo valore vale sopra e sotto, il secondo a sinistra e a destra.

## un-lato
Con quale proprietà si dà un margine solo sotto l'elemento?
---
`margin-bottom`.

## bordo-tre-valori
Che cosa indicano i tre valori di `border: 4px solid darkorange`?
---
Lo spessore, lo stile della linea e il colore.

## bordo-senza-stile
Che cosa disegna `border: 4px darkorange`?
---
Niente: senza lo stile (`solid`, `dashed`, `dotted`) il bordo non ha linea.

## width-che-cosa-misura
Senza `box-sizing`, che cosa misura `width`?
---
La larghezza del solo contenuto: padding e bordo si aggiungono.

## larghezza-content-box
Quanto è largo fino al bordo un riquadro con `width: 200px`, `padding: 10px` e `border: 5px solid`?
---
230 px: $200 + 2 \cdot 10 + 2 \cdot 5$.

## errore-una-volta
Un riquadro ha `width: 100px` e `padding: 20px`, senza bordo. Perché non è largo 120 px?
---
Perché il padding sta a sinistra e a destra: è largo $100 + 2 \cdot 20 = 140$ pixel.

## spazio-con-margini
Un riquadro largo 240 px fino al bordo ha `margin: 20px`. Quanto spazio occupa in larghezza?
---
280 px: $240 + 2 \cdot 20$.

## border-box-larghezza
Quanto è largo fino al bordo un riquadro con `box-sizing: border-box`, `width: 200px` e `padding: 20px`?
---
200 px: con `border-box` la larghezza comprende padding e bordo.

## border-box-contenuto
Con `box-sizing: border-box`, `width: 200px`, `padding: 20px` e `border: 5px solid`, quanto è largo il contenuto?
---
150 px: $200 - 2 \cdot 20 - 2 \cdot 5$.

## altezza-senza-height
Quanto è alta una scatola a cui non hai dato `height`?
---
Quanto serve al suo contenuto: cresce quando il testo va a capo.

## blocco-o-linea
Tra `p`, `a`, `div` e `strong`, quali sono elementi di blocco?
---
`p` e `div`. `a` e `strong` sono in linea.

## width-in-linea
Che effetto ha `width: 120px` su un link `a`?
---
Nessuno: su un elemento in linea `width` e `height` non hanno effetto.

## display-block
Che cosa cambia in un link con `display: block`?
---
Si comporta come un blocco: va su una riga sua, e larghezza, altezza e margini funzionano.

## margini-fusi
Un titolo ha `margin-bottom: 30px`, il paragrafo sotto ha `margin-top: 20px`. Quanto spazio c'è tra i due?
---
30 px: i margini verticali di due blocchi vicini si fondono, e resta il più grande.

## centrare
Come si mette al centro un blocco largo 300 px?
---
Con `margin: 0 auto`: il browser divide in parti uguali lo spazio a sinistra e a destra.
