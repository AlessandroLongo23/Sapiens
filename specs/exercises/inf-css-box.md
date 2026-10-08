# inf-css-box: il modello a scatola

Esercizi della lezione `docs/lezioni/informatica/riscritte/93-inf-css-box.md`. Tutti a scelta multipla, con quattro
opzioni, su una regola CSS vera mostrata sotto la domanda. Generatore:
`src/lib/exercises/v2/generators/inf-css-box.ts`, con `makeCodeGenerator` di `inf-codice.ts`. Controllo:
`scripts/exercises/checkers/inf_css_box.py`, che rilegge la regola e rifà ogni conto.

Parole della lezione: scatola, contenuto, padding, bordo, margine; "largo fino al bordo", "spazio occupato";
elemento di blocco e in linea; i margini "si fondono". Misure in pixel: `px` attaccato nel CSS, "px" con lo spazio
nel testo.

Numeri: `width` tra 120 e 400 px, `padding` tra 5 e 30, `border` tra 1 e 8, `margin` tra 8 e 40; padding, bordo e
margine di una stessa regola sono tre numeri diversi.

## Livelli

1. **Le parti della scatola.** Una regola con `width`, `padding`, `border` e `margin`, in ordine qualunque. Due
   casi: `misura` (60%): "Quanti pixel di spazio ci sono tra il testo e il bordo?" (padding), "... tra il bordo del
   riquadro e gli elementi vicini?" (margine), "Quanti pixel è spessa la cornice?" (bordo); opzioni: quattro
   numeri, tra cui le altre due misure e una somma. `dichiarazione` (40%): "Quale dichiarazione va cambiata per
   allontanare il testo dalla cornice?" (e per allontanare il riquadro dagli elementi vicini, per rendere più
   spessa la cornice); opzioni: le quattro dichiarazioni della regola.
2. **Scritture brevi.** Due casi: `due-valori` (60%): `padding: 8px 24px` oppure `margin`, e il valore di un lato
   (sopra, sotto, a sinistra, a destra); distrattori: l'altro valore, la somma, il doppio. `linea` (40%):
   `border: 4px dashed navy`, oppure senza lo stile, e che cosa disegna il browser: linea continua, tratteggiata,
   a puntini, oppure nessuna linea (l'errore del riquadro della lezione).
3. **Quanto è larga una scatola.** Senza `box-sizing`. `bordo` (60%): la larghezza dal bordo sinistro al bordo
   destro, $\text{width} + 2 \cdot \text{padding} + 2 \cdot \text{border}$; metà delle volte la regola ha anche un
   margine, che non conta. `spazio` (40%): lo spazio occupato con i margini. Distrattori: padding e bordo sommati
   una volta sola (c'è sempre), la sola `width`, il bordo dimenticato, il margine contato o dimenticato.
   Esempio: `width: 180px; padding: 15px; border: 8px solid navy` → $180 + 30 + 16 = 226$.
4. **Con border-box.** La stessa regola, senza margine. `scatola` (30%): con `box-sizing: border-box`, la
   larghezza fino al bordo, che è `width`. `contenuto` (40%): con `border-box`, la larghezza del contenuto,
   $\text{width} - 2 \cdot \text{padding} - 2 \cdot \text{border}$. `senza` (30%): senza `box-sizing`, la larghezza
   del contenuto, che è `width`: serve a far guardare se la dichiarazione c'è. Distrattori: il conto dell'altro
   modo, e padding e bordo tolti o aggiunti una volta sola.
5. **Trovare la width.** Costruito all'indietro: "Il riquadro deve essere largo 300 px dal bordo sinistro al bordo
   destro. Che valore va scritto al posto del punto interrogativo?", con `width: ?;` nella regola. `content-box`
   (70%): la larghezza voluta meno due padding e due bordi. `border-box` (30%): la larghezza voluta. Opzioni
   scritte come valori CSS (`284px`). Distrattori: la larghezza voluta (o il conto dell'altro modo), padding e
   bordo tolti una volta sola, aggiunti invece che tolti, il bordo dimenticato.
6. **Blocchi, righe e margini.** Quattro casi. `blocco` (25%): quale di quattro elementi comincia su una riga
   nuova e occupa tutta la larghezza: uno di blocco tra tre in linea. `linea` (20%) e `larghezza` (25%): quale
   resta dentro la riga di testo, o su quale `width` non ha effetto: uno in linea tra tre di blocco. Elementi di
   blocco: `h1`, `h2`, `p`, `ul`, `li`, `div`, `header`, `nav`, `main`, `footer`; in linea: `a`, `em`, `strong`,
   `span`. `margini` (30%): due blocchi uno sotto l'altro, con il margine inferiore del primo e il superiore del
   secondo: lo spazio tra i due è il più grande; la somma è sempre tra le opzioni.

## Vincoli

- Quattro opzioni diverse, una sola giusta, tutte positive.
- Nel livello 3, caso `bordo`, tra le opzioni c'è sempre il risultato di chi somma padding e bordo una volta sola.
- La regola sotto la domanda ha una dichiarazione per riga, righe di al più 42 caratteri.
- Le quote dei casi sono quelle scritte sopra, con una tolleranza di 8 punti.
- Almeno cento esercizi diversi per livello su 1000 (contati su `params`).

## Da evitare

- Quattro valori per `padding` e `margin`, `border-width` da solo, unità diverse da `px`, percentuali: la lezione
  non li ha.
- `box-sizing: content-box` scritto nella regola: nella lezione è il valore di partenza, e si riconosce
  dall'assenza.
- Margini che si fondono tra un elemento e quello che lo contiene, e margini negativi.
- `img` tra gli elementi in linea: su un'immagine `width` funziona, e la domanda del caso `larghezza` avrebbe due
  letture.
- Domande sull'altezza: senza `height` dipende dal testo e dal carattere.
