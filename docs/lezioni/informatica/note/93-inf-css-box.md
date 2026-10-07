# Note: Il modello a scatola

Lezione nuova, scritta da zero il 7 ottobre 2026 (terzo anno, capitolo "I fogli di stile", gruppo 12), insieme alla
92 su regole e selettori. Non pubblicata.

## Struttura

Apertura sulla pagina della 92, colorata ma senza spazi; le quattro parti della scatola con una pagina da
modificare; come si scrivono padding, bordo e margine (uno e due valori, un lato solo, i tre valori del bordo);
quanto spazio occupa una scatola, con la figura e il conto; `box-sizing` con la figura del confronto e una pagina
in cui il riquadro sporge; elementi di blocco e in linea, con `display` e una pagina; due riquadri (centrare un
blocco, i margini che si fondono); tre esercizi.

- 302 righe; testo da leggere circa 55 righe.
- Pagine da eseguire: 3 (il riquadro del concerto; il riquadro che sporge da `main`; il menu con i link in linea).
- Esercizi con `%% controllo`: 3 (padding, bordo e margine; il conto all'indietro della `width`; il menu a
  blocchi con `border-box`).
- Figure interattive: 2 (`inf-css-scatola-strati`, `inf-css-box-sizing-confronto`). Nessuna figura TikZ.
- Riquadri: `ad-warning` sul bordo senza stile e su padding e bordo contati una volta sola; `ad-tip` su
  `margin: 0 auto`; `ad-note` sui margini che si fondono.

## Elementi interattivi

| Elemento | Domanda a cui risponde |
|---|---|
| Pagina 1 (riquadro del concerto) | Che cosa succede al testo portando `padding` a 0, e al riquadro portando a 0 il margine? |
| `inf-css-scatola-strati` | Il riquadro ha `width: 200px`: quanto è largo davvero con padding, bordo e margine? |
| `inf-css-box-sizing-confronto` | Due riquadri con la stessa regola e `box-sizing` diverso: quale è largo davvero 200 px? |
| Pagina 2 (riquadro che sporge) | Perché un riquadro con la stessa `width` del suo contenitore ne esce, e che cosa cambia con `border-box`? |
| Pagina 3 (menu) | Perché `width` non fa niente su un link, e che cosa cambia con `display: block` e `inline-block`? |
| Tre esercizi | Scrivere padding, bordo e margine; calcolare `width` all'indietro; usare `display` e `box-sizing` insieme. |

`inf-css-scatola-strati` è `inf-css-modello-scatola` (`ModelloScatola.tsx`) copiata in un file del gruppo: stessi
pezzi del kit (`ScatolaCss`, `misure`), numeri della lezione (200, 16, 4, 20, quelli della prima pagina), un
cursore in più per `width`, e senza la scelta di `box-sizing`, che ha la sua figura. La figura originale resta
registrata e non è usata.

## Scelte

- `div` è già nella 88 ("lo userai con i fogli di stile"): qui è richiamato con un link e usato per il riquadro
  del concerto. `span` è introdotto qui, in una riga, come il suo corrispondente tra gli elementi in linea.
- Solo `px`. Percentuali, `em`, `max-width` sono della 95.
- Scritture brevi: un valore e due valori. Tre e quattro valori (`padding: 4px 8px 12px 16px`) non ci sono.
- `border`: i tre valori insieme, e i lati (`border-bottom`). Non ci sono `border-width`, `border-radius`.
- `height`: una frase su che cosa succede con un'altezza fissa; `overflow` non è nominato.
- `box-sizing`: `content-box` è "il valore di partenza". Non c'è l'abitudine di scrivere
  `* { box-sizing: border-box; }` in cima al foglio, perché la 92 non ha il selettore `*`.
- Blocco e in linea: `li` è tra i blocchi (per il browser è `list-item`, che si comporta allo stesso modo).
  `img` non è nell'elenco degli elementi in linea: è in linea ma accetta `width` e `height`, e avrebbe chiesto
  un'eccezione.
- `display`: `block` e `inline-block`, in tre frasi e in una pagina. `display: none` e `flex` non ci sono; `flex` è
  della 94, a cui la lezione rimanda con un link.
- I margini che si fondono stanno in un riquadro, come chiede il brief, solo per due blocchi uno sotto l'altro. Il
  caso del margine di un figlio che esce dal genitore non c'è.
- `margin: 0 auto` è in un riquadro `ad-tip`: è la prima cosa che serve per una pagina con una colonna centrata, e
  la 94 parte da lì.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso, su lezione, formulario e flashcard.
- `verifica.mts`: tre avvisi "pagina web, i controlli si provano nel browser", attesi.
- Nel browser, a 1280 e a 390 px, e a 1280 in scuro: le tre pagine eseguite; nei tre esercizi "Verifica" sul foglio
  di partenza (0 su 3, 2 su 3, 0 su 2 controlli superati) e sulla soluzione (tutti superati). Nessun errore in
  console, nessuno scorrimento laterale.
- Le prove fatte a mano sulle pagine (padding a 0, `display: block`, `box-sizing` aggiunto) non sono state rifatte
  una per una nel browser: le pagine sono state eseguite solo così come sono scritte.

## Limiti dei controlli

- La regola `stile` ora controlla anche lo spessore di un bordo (`border-top-width = 2px`), dopo la correzione di
  `web-checks.ts`. La revisione del lotto ha aggiunto al primo esercizio le due regole sullo spessore (sopra e a
  sinistra), accanto a stile e colore della linea.
- Nel secondo esercizio la `width` giusta (250 px) è controllata insieme a `box-sizing: content-box`, perché con
  `border-box` lo stile calcolato di `width` sarebbe 300 px e il controllo non distinguerebbe.

## Da verificare

Scritti a memoria, non ricontrollati in rete in questa sessione.

- Il valore iniziale di `border-style` è `none`, e con `none` lo spessore calcolato del bordo è 0 (CSS Backgrounds
  and Borders Level 3).
- Il valore iniziale di `box-sizing` è `content-box` (CSS Box Sizing Level 3; in origine CSS Basic User Interface
  Level 3).
- Su un elemento in linea non sostituito `width`, `height` e i margini verticali non si applicano; padding e bordo
  verticali si disegnano senza spostare le righe (CSS 2.1, sezioni 10.3.1 e 10.6.1).
- I margini verticali di due blocchi vicini si fondono e resta il più grande (CSS 2.1, sezione 8.3.1). Non si
  fondono i margini orizzontali, e nemmeno quelli degli elementi dentro un contenitore flex: la 94 potrebbe doverlo
  dire.
- Con un'altezza fissata il testo in più "esce dal fondo della scatola": è il comportamento di `overflow: visible`,
  il valore iniziale.

## Domande per Andrea

- `span` è introdotto qui in una riga: va bene, o lo volete nel capitolo sull'HTML accanto a `div` (88)?
- `box-sizing: border-box` va presentato come la scelta normale ("mettilo sempre") o come un'alternativa, come
  fa ora la lezione?
- I margini che si fondono: basta il riquadro, o è un argomento da verifica e serve un esempio da eseguire?
- `display: inline-block` va tenuto, visto che il menu della 94 si fa con flexbox?
- Tre e quattro valori per `padding` e `margin` (in senso orario) servono al terzo anno?

Prerequisiti proposti: inf-css-regole, inf-html-struttura

## Revisione del lotto (7 ottobre 2026)

- "Siamo cinque" è diventato "quattro". Con il margine a 0 il riquadro "si avvicina" al bordo e al paragrafo, che tengono i loro margini (prima "si attacca"). Su un elemento in linea `width` e `height` non hanno effetto, "le immagini fanno eccezione".
- Le altre correzioni della revisione sono segnate nei punti della nota a cui si riferiscono.
- Le formule in evidenza con i nomi scritti per esteso uscivano dalla colonna a 390 px e andavano scorse di lato: ora vanno a capo dopo l'uguale, nella lezione e nel formulario.
