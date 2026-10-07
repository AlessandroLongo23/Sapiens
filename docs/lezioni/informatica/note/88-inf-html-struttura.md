# Note: Struttura di una pagina HTML

Lezione nuova (lotto del terzo anno, capitolo "Il linguaggio HTML", 7 ottobre 2026). Circa 360 righe, di cui una settantina di testo: 4 pagine da modificare, 3 esercizi con `%% controllo`, 1 figura TikZ, 1 figura interattiva. `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard.

## Confini

- La 87 (gruppo 9) introduce tag, elementi, attributi e annidamento, e mostra una prima pagina senza spiegarne lo scheletro. Qui quelle parole si usano come note, con un link alla 87 nella prima frase.
- `em`, `strong`, `br`, i link e le immagini sono della 89. Nel menu della pagina con le parti ci sono due `<a href>`, perché un `nav` senza link non è un menu: il testo dice in una frase che i link sono della lezione dopo.
- Elenchi, tabelle e moduli (90, 91) non compaiono.
- Il DOM è della 97: qui l'albero del documento, con una riga che dice il nome DOM e porta alla 97.
- Niente CSS: gli elementi semantici sono presentati come elementi che non cambiano l'aspetto, e lo studente lo verifica togliendo `main`.

## Scelte

- Le pagine sono progetti di un file solo (`codice index.html`) e non blocchi `codice html`: con `codice html` l'editor mostra anche le linguette `style.css` e `script.js`, vuote, che in questa lezione non hanno senso. Con un progetto si vede solo `index.html`.
- Parole: "testa" e "corpo" per `head` e `body`, "scheda" per la tab del browser, "piè di pagina" per `footer`, "genitore", "figlio", "fratelli" per l'albero. "Elementi semantici" è definito una volta.
- Elementi semantici: `header`, `nav`, `main`, `footer` come dal brief, più `section` (una riga in tabella e nella pagina) e `div` in un riquadro `ad-note`, perché i capitoli sul CSS li useranno. `article` e `aside` non ci sono.
- Regole dei titoli: un solo `h1` per pagina e nessun livello saltato scendendo. Lo standard HTML ammette più `h1`; la regola di un solo `h1` è la raccomandazione corrente per l'accessibilità, ed è quella che un insegnante corregge.
- `lang` è spiegato con i lettori di schermo e i traduttori; `meta charset` con il link alla lezione 10. Togliere `meta charset` nell'anteprima non mostra l'errore (la pagina arriva all'anteprima già come testo), quindi il testo non invita a provarlo.
- "Che cosa fa il browser con un errore": quattro comportamenti, tutti provati (vedi "Da verificare"). Il validatore è nominato senza marchio.

## Elementi interattivi

1. Le quattro pagine da modificare. Domande: che cosa cambia cambiando `title` e che cosa cambiando `h1`; gli spazi e gli a capo del file contano; che cosa cambia togliendo `main`; che cosa fa il browser con `</h2>` mancante, un tag inventato, `</p>` mancante, un commento non chiuso.
2. `inf-html-albero-documento` (`AlberoDocumento.tsx`). Domanda: come fa il browser a ricavare un albero da un file scritto in fila, e che albero esce quando un tag non viene chiuso? Tre riquadri (file, albero, pagina a rettangoli annidati): toccando un elemento in uno si accende negli altri due; "Esegui" rilegge il file una riga alla volta con l'elenco degli elementi ancora aperti; la scelta "Senza `</h2>`" mostra il paragrafo che finisce dentro il titolo. È diversa dalla figura della 87 (`inf-markup-testo-albero-pagina`), che mostra testo marcato, albero e pagina senza la costruzione: qui c'è la lettura passo per passo, `html` e `head` nell'albero, e l'errore.
3. Figura TikZ `albero-documento-html-scheletro`: l'albero della prima pagina, per chi non usa la figura interattiva.
4. I tre esercizi di "Prova tu", corretti sull'albero della pagina.

## Dubbi per Andrea

- Va bene insegnare "un solo `h1` per pagina" come regola, sapendo che lo standard non la impone?
- `section` e `div` in questa lezione sono troppo, o è giusto averli prima del CSS?
- "Testa" e "corpo" in italiano accanto a `head` e `body`: i libri in adozione dicono così o lasciano l'inglese?
- Nominare il validatore senza mostrarne uno basta, o serve un esempio di messaggio?

## Da verificare

- Comportamento del browser davanti agli errori: provato il 7 ottobre 2026 con Chromium, WebKit e Firefox di Playwright su pagine di prova (i tre costruiscono lo stesso albero), e nell'anteprima del sito con Chromium. `<h2>` non chiuso seguito da `<p>`: il paragrafo diventa figlio di `h2`, fino al titolo successivo, che chiude il primo (regola "in body" dello standard HTML, WHATWG, "The rules for parsing tokens in HTML content"). Testo in `head`: la testa viene chiusa e il testo passa nel corpo. Tag sconosciuto: elemento `HTMLUnknownElement`, senza stile.
- "Senza `meta charset` il browser deve indovinare la codifica": vero per i file serviti senza l'intestazione HTTP che la dichiara; da precisare se Andrea vuole.
- "`title` compare tra i preferiti e nei risultati di un motore di ricerca": comportamento corrente, non garantito dai motori.

## Prova tu

Tre esercizi: completare lo scheletro; dividere una pagina piatta in `header`, `nav`, `main`, `footer`; correggere tre errori (titolo non chiuso, livello sbagliato, commento non chiuso). Provati nel browser con il file di partenza (nessun controllo passa), con una risposta sbagliata ciascuno (`title` nel corpo e due `h1`; `h1` in `head`; solo il commento chiuso) e con la soluzione (passano tutti).

Prerequisiti proposti: inf-markup, http-html, inf-file-system

## Revisione del lotto (7 ottobre 2026)

- Senza `</h2>` diventano titolo tutti i paragrafi che seguono, non uno solo: corretto.
