# Note: Regole e selettori CSS

Lezione nuova, scritta da zero il 7 ottobre 2026 (terzo anno, capitolo "I fogli di stile", gruppo 12), insieme alla
93 sul modello a scatola. Non pubblicata.

## Struttura

Apertura sulla pagina senza stile e sul perché il foglio sta in un file a parte; come si collega (`link` in `head`);
com'è fatta una regola (figura con selettore, proprietà, valore, dichiarazione); sei proprietà per colori e testo e
come si scrivono colori e grandezze; i quattro selettori (elemento, classe, id, discendente) con la figura e una
pagina; l'ereditarietà; la cascata con la figura e le tre regole; tre esercizi.

- 349 righe; testo da leggere circa 60 righe, il resto sono pagine e figure.
- Pagine da eseguire: 2 (la home con il primo foglio; la pagina dei concerti con i quattro selettori).
- Esercizi con `%% controllo`: 3 (scrivere una regola; scegliere due selettori; una regola che perde la cascata).
- Figura TikZ: 1 (`parti-di-una-regola-css`).
- Figure interattive: 2 (`inf-css-selettori`, `inf-css-cascata`).
- Riquadri `ad-warning`: il foglio non collegato, il CSS sbagliato che non dà errori, il selettore che non prende
  niente, la regola che perde. Un `ad-note` sulla virgola tra selettori.

## Elementi interattivi

| Elemento | Domanda a cui risponde |
|---|---|
| Pagina 1 (home e foglio) | Che cosa cambia nella pagina cambiando solo il foglio, e che cosa succede togliendo `<link>`? |
| `inf-css-selettori` | Quali elementi prende un selettore, e perché `nav a` ne prende meno di `a`? Che cosa prende `prossimo` senza punto? |
| Pagina 2 (concerti) | Che cosa succede aggiungendo una classe a un altro elemento, e togliendo il punto dal selettore? |
| `inf-css-cascata` | Cinque regole danno un colore allo stesso paragrafo: quale vince, e che cosa cambia spegnendone una o scambiandone due? |
| Tre esercizi | Scrivere una regola; scegliere i selettori; trovare la regola che vince e correggere il selettore. |

La pagina della figura dei selettori è la stessa della pagina 2, con gli stessi testi. Nella figura lo studente può
scrivere qualunque selettore dei quattro tipi, anche combinati (`li.prossimo`, `ul > li`, elenchi con la virgola):
le forme che la lezione non tratta (`a:hover`, attributi, `+`) danno la frase "usa una forma che la lezione non
tratta".

## Scelte

- Confine con la 93: qui solo colori e testo. Bordi, margini, padding, larghezze e `display` sono della 93; la 92
  dice soltanto che sfondo, bordi e margini non si ereditano.
- Sei proprietà: `color`, `background-color`, `font-family` (solo le tre famiglie generiche), `font-size` (solo
  `px`), `font-weight` (`normal`, `bold`), `text-align`. `font-style`, `text-decoration`, `line-height` non ci
  sono. Le unità relative sono della 95.
- Colori: nomi e `#RRGGBB`, con il rimando alla lezione 11, che ha già l'esadecimale. Niente `rgb()`, niente forma
  breve `#F80`.
- Selettori: elemento, classe, id, discendente, più la virgola in un riquadro. Non ci sono il selettore composto
  (`li.prossimo`), il figlio (`>`), le pseudo-classi (`a:hover`), `*`. Un elemento con due classi non compare.
- `class` e `id` sono introdotti qui come attributi per il CSS; `id` è richiamato dalla 89, che lo usa per i link.
- La specificità è spiegata come tre conti in ordine (id, poi classi, poi nomi di elemento), con il nome
  "specificità" dato una volta e "peso" usato nel resto. Niente numeri del tipo "100, 10, 1", che danno risposte
  sbagliate oltre le dieci classi.
- Il foglio di stile del browser è nominato per spiegare titoli grossi e link blu, e perché un link non eredita il
  colore di `body`. La lezione dice che le regole dell'autore "lo battono sempre, qualunque sia il loro peso".
- Non ci sono: lo stile nell'attributo `style` e l'elemento `<style>` (il lotto vuole il CSS in un file a parte),
  `!important`, i commenti CSS (un commento compare nel foglio del primo esercizio, senza spiegazione).
- Nomi dei file: `index.html` e `style.css`, quelli che l'editor dà ai blocchi `html` e `css`.
- Nelle pagine i link portano a `index.html` o a un punto della pagina (`#date`), così un clic nell'anteprima non
  apre una pagina che non c'è.
- Il terzo esercizio ha più di una soluzione (`#date .prossimo`, `#date li.prossimo`, `ul#date .prossimo`): i
  controlli guardano i colori, non il selettore.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso, su lezione, formulario e flashcard.
- `verifica.mts`: tre avvisi "pagina web, i controlli si provano nel browser", attesi.
- Nel browser, a 1280 e a 390 px: le due pagine eseguite; nei tre esercizi "Verifica" sul foglio di partenza (1 su
  3, 2 su 4, 1 su 2 controlli superati) e sulla soluzione (tutti superati). Nessun errore in console, nessuno
  scorrimento laterale.
- Figura TikZ guardata in chiaro e in scuro. Corretta dopo la prima prova nel browser: una lettera accentata
  dentro un nodo (`proprietà`) faceva fallire TikZJax nella pagina di anteprima con "unreachable", anche se
  `anteprima.mjs` la compilava. Ora è `propriet\`a`, e le graffe sono `\char123` e `\char125`.
- Figure interattive guardate in chiaro, in scuro e a 390 px, in più stati (vedi il rapporto del gruppo).

## Da verificare

Scritti a memoria, non ricontrollati in rete in questa sessione.

- I nomi di colore che il browser conosce sono "più di cento": sono 148 in CSS Color Module Level 4 (W3C). Da
  verificare il numero; il testo dice solo "più di cento".
- `crimson` è `#DC143C`, `ivory` è `#FFFFF0` (tabella dei colori con nome, CSS Color Module Level 4).
- Una dichiarazione non valida viene saltata, e senza il punto e virgola il browser attacca la riga alla seguente
  e le salta tutte e due (CSS Syntax Module Level 3, regole di recupero dagli errori).
- Le regole dell'autore battono quelle del foglio del browser qualunque sia la specificità (CSS Cascading and
  Inheritance Level 4, ordine delle origini). Vale senza `!important`, che la lezione non nomina.
- `text-align` è una proprietà ereditata; `background-color` no (stesso documento, e CSS Backgrounds and Borders
  Level 3).
- Nomi di classe e di id sono sensibili alle maiuscole nelle pagine con il doctype di HTML5. In una pagina senza
  doctype (quirks mode) non lo sono: la lezione ha sempre il doctype.

## Domande per Andrea

- La specificità come "si contano gli id, poi le classi, poi i nomi di elemento" va bene, o i libri che usate la
  presentano con i punteggi 100, 10, 1?
- Il selettore composto `li.prossimo` e le pseudo-classi come `a:hover` vanno in questa lezione? Ora non ci sono:
  `a:hover` è quello che gli studenti chiedono per primo.
- `class` e `id` sono introdotti qui. Vanno anticipati nel capitolo sull'HTML (la 89 ha già `id` per i link)?
- Serve dire che il CSS si può scrivere anche dentro la pagina (`<style>`, attributo `style`), almeno per
  riconoscerlo quando lo si incontra?
- Colori: bastano i nomi e l'esadecimale, o serve anche `rgb(255, 128, 0)`?

Prerequisiti proposti: inf-html-struttura, inf-html-testo-link, inf-html-elenchi-tabelle

## Revisione del lotto (7 ottobre 2026)

- "Siamo cinque della 3B" è diventato "quattro", come nelle lezioni 88-90.
