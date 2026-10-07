# Note: L'impaginazione di una pagina web (94)

Lezione nuova, scritta il 7 ottobre 2026 dal gruppo 13 del lotto del terzo anno.

## Scelte

- Flexbox è l'unico strumento spiegato. La griglia e `position` sono nominate in un riquadro `ad-note` in fondo, come
  chiede il brief; `float` non compare.
- Ordine: contenitore ed elementi (con l'errore dei figli diretti), poi direzione e i due assi, poi lo spazio che
  avanza e l'andare a capo, poi la pagina intera. "Asse principale" e "asse trasversale" sono i due termini
  introdotti; `main axis` e `cross axis` non sono citati.
- Valori insegnati: `flex-direction` solo `row` e `column` (niente `row-reverse`); `justify-content` con
  `flex-start`, `center`, `flex-end`, `space-between`, `space-around` (niente `space-evenly`); `align-items` con
  `stretch`, `flex-start`, `center`, `flex-end` (niente `baseline`); `gap`; `flex-wrap` con `nowrap` e `wrap`.
- Degli elementi flex si insegna solo `flex: 1`, detto come "prende lo spazio che avanza". `flex-grow`,
  `flex-shrink` e `flex-basis` non sono nominati. Il terzo esercizio controlla `flex-grow`, ma lo studente scrive
  `flex: 1` e il nome `flex-grow` lo vede solo se sbaglia, nel messaggio del controllo.
- Che con `nowrap` gli elementi "si stringono" è detto senza nominare `flex-shrink`.
- Il menu della prima pagina è un elenco di nomi (`ul.gruppo`), perché i link `a` sono in linea e starebbero in
  riga anche senza flexbox: con un elenco si vede la differenza. Nella pagina classica il menu è `nav` con dei
  link, come nella 92.
- La pagina classica usa un `div class="contenuto"` attorno a `main` e `aside`: è l'unico `div` della lezione.
- Confine con la 93: gli elementi di blocco e in linea si danno per noti (un link in apertura). Confine con la 95:
  la lezione si chiude dicendo che `flex-direction: column` serve sugli schermi stretti, e rimanda.
- Nomi del filo: Sara, Leo, Marta, Dario (quattro della 3B, come nelle lezioni 88-90); concerto di venerdì 12 dicembre. La prima stesura ne aveva cinque (con Pietro ed Emma): la revisione del lotto ha uniformato a quattro le lezioni 92-95.

## Dubbi per Andrea

- Va bene presentare `flex: 1` come una dichiarazione sola, senza le tre proprietà che riassume? Il conto della
  lezione (un elemento con `flex: 1` prende tutto l'avanzo; tutti con `flex: 1` si dividono lo spazio in parti
  uguali) è vero in questi due casi, non quando gli elementi hanno `flex` con numeri diversi o un contenuto più
  largo della loro parte.
- `space-evenly` e `align-content` sono fuori: li vuoi almeno in un riquadro?
- La griglia è solo nominata, come dice il brief. Nei libri del liceo che usate è trattata?
- "Asse trasversale" è il nome che usi in classe, o preferisci "asse secondario"?

## Da verificare

- Il riquadro sulle tabelle per impaginare dice "per anni è stata usata": è storia nota del web, senza una fonte
  citata.
- La lezione ha 40 righe di testo (circa 1400 parole) contro le 50-90 indicate dal brief: i paragrafi sono lunghi.
  Le righe in tutto sono 360.

## Elementi interattivi

- Pagina da modificare, "elenco del gruppo": che cosa cambia togliendo `display: flex`, e spostandolo su `body`?
  Risposta nel testo: arriva solo ai figli diretti.
- Figura `inf-css-flexbox` (`Flexbox.tsx`): con `flex-direction: column`, `justify-content: center` centra in
  orizzontale o in verticale? E che cosa succede a cinque elementi che non ci stanno? Lo studente sceglie direzione,
  `justify-content`, `align-items`, `flex-wrap`, `gap` e numero di elementi; gli elementi scivolano al nuovo posto e
  accanto c'è la regola composta.
- Figura statica TikZ `pagina-classica-flexbox`: lo schema della pagina con i due contenitori.
- Pagina da modificare, "pagina classica": che cosa fa `flex: 1`, da che cosa dipende l'ordine, che cosa fa
  `column`.
- Tre esercizi con `%% controllo` e la regola `stile`.

## Esercizi di "Prova tu"

Provati nel browser a 1280 e a 390 px: la pagina di partenza non supera nessun controllo, la soluzione li supera
tutti, e una risposta sbagliata per esercizio viene bocciata (`display: flex` su `nav` al posto di `ul`; i valori
di `justify-content` e `align-items` scambiati; `flex: 1` lasciato sul contenitore).

Prerequisiti proposti: inf-css-box, inf-css-regole, inf-html-struttura, inf-html-elenchi-tabelle

## Revisione del lotto (7 ottobre 2026)

- Aggiunte due mezze frasi: `aside` è nominato accanto agli elementi semantici della 88, che non lo elenca; la consegna del primo esercizio dice che il pallino si toglie con `list-style: none`. "Sintesi vocale" è diventato "lettore di schermo".
- Le altre correzioni della revisione sono segnate nei punti della nota a cui si riferiscono.
