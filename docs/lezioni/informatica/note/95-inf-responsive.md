# Note: Pagine responsive e accessibili (95)

Lezione nuova, scritta il 7 ottobre 2026 dal gruppo 13 del lotto del terzo anno.

## Scelte

- Due argomenti in una lezione, come nel titolo. Ordine: viewport e unità relative, immagini, media query, prima il
  telefono, accessibilità. L'accessibilità occupa l'ultimo terzo, con una figura sul contrasto e quattro controlli
  da fare rileggendo l'HTML.
- Unità: `%`, `rem`, `em`, `vw`. Niente `vh`, `ch`, `clamp()`. `em` è detto "relativo al carattere dell'elemento
  stesso", che è vero per `padding`, `margin` e simili; per `font-size` l'`em` si riferisce al carattere del
  genitore, e la lezione non lo dice.
- Media query: solo `min-width` e `max-width`, con la forma `@media (min-width: 600px)`. Niente `and`, niente
  `screen`, niente la sintassi con `>=`, niente `orientation` o `prefers-color-scheme`.
- Soglie degli esempi: 600 e 900 px nella figura, 600 nella pagina, 700 nell'esercizio. Sono numeri di esempio, e
  la lezione non dice che esistono soglie "giuste".
- "Prima il telefono" è il nome italiano scelto per mobile first, con l'inglese tra parentesi una volta.
- Accessibilità: contrasto, testo alternativo, ordine dei titoli, tastiera, etichette. Niente ARIA. Il lettore di
  schermo è nominato così, senza prodotti.
- Le soglie del contrasto sono quelle del livello AA. Il livello AAA (7 e 4,5) non è nella lezione. "Linee guida
  internazionali per l'accessibilità" sta per WCAG, che la lezione non nomina per non mettere una sigla e una
  versione che invecchia.
- "Testo grande": la lezione dice "da 24 px in su, oppure da circa 19 px in su se è in grassetto". Le linee guida
  dicono 18 punti, o 14 punti in grassetto: 24 px e 18,66 px.
- Le immagini delle pagine sono scritte dentro `src` come `data:image/svg+xml,...`, perché in un blocco `codice`
  non si può mettere un file di immagine. La lezione lo dice in una frase. Da rivedere quando l'editor avrà le
  immagini.

## L'anteprima dell'editor e le media query (verificato il 7 ottobre 2026)

L'anteprima di una pagina dentro una lezione è un `iframe` largo quanto la colonna della lezione e alto 259 px. Le
media query della pagina dello studente guardano la larghezza dell'`iframe`, non quella dello schermo. Misurata con
Playwright sulla pagina di prova:

| Finestra del browser | Larghezza dell'anteprima |
|---|---|
| 1280 px | 894 px |
| 1024 px | 894 px |
| 768 px | 723 px |
| 390 px | 359 px |

Conseguenze:

- Su un computer `@media (min-width: 600px)` è sempre attiva, su un telefono mai, e lo studente non può cambiare la
  larghezza dell'anteprima (nell'editor dentro la lezione non c'è lo schermo intero né una maniglia). La lezione
  quindi fa cambiare la soglia (`2000px` al computer, `300px` al telefono) e dice che al computer si può
  restringere la finestra del browser.
- La riga `<meta name="viewport">` nell'anteprima non cambia niente, perché l'`iframe` ha già la sua larghezza
  vera. È nelle pagine perché deve esserci, e la lezione avverte che l'effetto si vede solo su un telefono.
- Un `%% controllo` con la regola `stile` legge lo stile calcolato a quella larghezza: una regola dentro una media
  query risulta applicata al computer e non al telefono. Per questo nessun controllo di questa lezione guarda una
  proprietà che la media query cambia: il secondo esercizio controlla la riga del viewport e le regole di base, e
  lo dice allo studente. La media query dell'esercizio non è corretta da nessuno.

Aggiornamento della revisione del lotto (7 ottobre 2026): l'editor ora ha tre tasti sopra il codice (telefono 375
px, tablet 768 px, tutto lo spazio; sotto i 640 px di schermo non ci sono) e i controlli hanno l'azione
`> larghezza N`. La lezione fa usare i tasti nella pagina di "Prima il telefono" e lascia il cambio di soglia solo a
chi legge dal telefono. Il secondo esercizio ora controlla la media query con due controlli, a 400 e a 900 px: una
soglia diversa da 700 px ma compresa tra 400 e 900 passa lo stesso.

## Fonti

- Contrasto: Web Content Accessibility Guidelines (WCAG) 2.2, W3C Recommendation del 12 dicembre 2024,
  `https://www.w3.org/TR/WCAG22/`, letta il 7 ottobre 2026. Definizione di "relative luminance":
  $L = 0{,}2126 \cdot R + 0{,}7152 \cdot G + 0{,}0722 \cdot B$, dove per ogni canale $c$ da 0 a 1 si prende
  $c / 12{,}92$ se $c \le 0{,}04045$ e $((c + 0{,}055) / 1{,}055)^{2{,}4}$ altrimenti. Una nota della definizione dice
  che prima di maggio 2021 la soglia era scritta 0,03928 e che la differenza non ha effetti pratici. Definizione di
  "contrast ratio": $(L_1 + 0{,}05) / (L_2 + 0{,}05)$ con $L_1$ il colore più chiaro, da 1 a 21.
- Soglie: criterio 1.4.3 "Contrast (Minimum)", livello AA: almeno 4,5 : 1, e almeno 3 : 1 per il testo grande.
  Criterio 1.4.6, livello AAA: 7 : 1 e 4,5 : 1. "Large scale": almeno 18 punti, o 14 punti in grassetto.
- La formula è in `src/lib/informatica/responsive.ts`, con i test in `tests/unit/informatica-responsive.test.mjs`
  su coppie note (nero e bianco 21; `#777777` su bianco 4,48; `#767676` su bianco 4,54). I numeri della lezione
  vengono da lì: `#999999` su bianco 2,84; bianco su `#f28c28` 2,45; `#595959` su bianco 7,00; `#1a1a1a` su
  `#ffd23f` 12,05.

## Dubbi per Andrea

- La lezione mette insieme pagine responsive e accessibilità, e l'accessibilità resta un elenco di quattro
  controlli più il contrasto. Basta, o preferisci due lezioni?
- `em` è spiegato solo per le proprietà diverse da `font-size`. Vuoi che si dica anche l'altro caso, o che `em`
  esca dalla lezione?
- Vuoi che la lezione nomini le WCAG e la legge italiana sull'accessibilità dei siti pubblici (la legge Stanca,
  n. 4 del 2004, da verificare), oppure va bene "linee guida internazionali"?
- "Lettore di schermo" o "screen reader"? Ho usato il primo.

## Da verificare

- "Su un telefono, se la pagina non dice niente, il browser finge che sia larga come quella di un computer": il
  valore abituale è 980 px, ma non l'ho controllato su una fonte e la lezione non scrive il numero.
- "Il carattere della pagina, di solito 16 px": è il valore di partenza dei browser più diffusi; non controllato
  su una fonte.
- Un elemento `a` senza `href` non prende il fuoco con Tab: usato come distrattore negli esercizi, corrisponde a
  quanto dice la specifica HTML, che non ho riletto oggi.
- La lezione ha 45 righe di testo (circa 1700 parole) contro le 50-90 del brief; 383 righe in tutto.

## Elementi interattivi

- Pagina da modificare, "unità e immagine": che cosa succede all'immagine senza `max-width: 100%`, e al blocco
  cambiando `30rem`?
- Figura `inf-media-query-larghezza` (`MediaQueryLarghezza.tsx`): a quale larghezza `main` e `aside` si
  affiancano, e che cosa succede esattamente a 600 px? Un cursore cambia la larghezza della finestra da 320 a 1000
  px; la pagina è disegnata a blocchi in scala, due linee segnano 600 e 900 px, e sotto ogni blocco del foglio di
  stile dice "vale sempre", "attiva" o "non attiva".
- Pagina da modificare, "prima il telefono": la soglia da cambiare per vedere l'altra disposizione.
- Figura `inf-contrasto-colori` (`ContrastoColori.tsx`): il grigio chiaro su bianco è sufficiente? E il bianco
  sull'arancione? Due colori da scegliere, il rapporto calcolato, le due soglie, quattro coppie pronte.
- Tre esercizi con `%% controllo`.

## Esercizi di "Prova tu"

Provati nel browser a 1280 e a 390 px: la pagina di partenza non supera nessun controllo, la soluzione li supera
tutti. Risposte sbagliate provate: `width` al posto di `max-width` (bocciata); le regole dei concerti solo dentro
la media query, con la regola di base sbagliata (bocciata); un grigio diverso da quello chiesto (bocciato). Nel
primo esercizio `font-size: 2em` sul titolo passa come `2rem`, perché danno lo stesso numero di pixel.

Prerequisiti proposti: inf-css-layout, inf-css-regole, inf-html-testo-link, inf-html-moduli

## Revisione del lotto (7 ottobre 2026)

- "Siamo cinque" è diventato "quattro".
- Le altre correzioni della revisione sono segnate nei punti della nota a cui si riferiscono.
