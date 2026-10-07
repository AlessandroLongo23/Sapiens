# Flashcard: Regole e selettori CSS

## foglio-di-stile
A che cosa serve un foglio di stile?
---
A decidere l'aspetto degli elementi di una pagina: l'HTML dice che cosa sono, il CSS come si presentano.

## collegare-foglio
Quale riga, dentro `head`, collega alla pagina il foglio `style.css`?
---
`<link rel="stylesheet" href="style.css">`.

## foglio-non-collegato
Il file `style.css` è corretto, ma la pagina non ha la riga con `<link>`. Che aspetto ha la pagina?
---
Quello di una pagina senza stile: il browser applica solo i fogli che la pagina gli chiede.

## parti-regola
Nella regola `h1 { color: crimson; }`, qual è il selettore, quale la proprietà e quale il valore?
---
Il selettore è `h1`, la proprietà è `color`, il valore è `crimson`.

## dichiarazione-sbagliata
Che cosa fa il browser con la dichiarazione `colour: red;`?
---
La salta senza dare errori: `colour` non è una proprietà che conosce.

## color-background
Quale proprietà cambia il colore del testo, e quale quello dello sfondo?
---
`color` il testo, `background-color` lo sfondo.

## unita-grandezza
Tra `font-size: 20px`, `font-size: 20` e `font-size: 20 px`, quale funziona?
---
Solo `font-size: 20px`: l'unità va scritta, attaccata al numero.

## selettore-classe
Quali elementi prende il selettore `.prossimo`?
---
Tutti gli elementi con `class="prossimo"`, di qualunque tipo.

## selettore-id
Come si scrive il selettore che prende l'elemento con `id="date"`?
---
`#date`.

## selettore-senza-punto
Nella pagina c'è `<li class="prossimo">`. Che cosa prende il selettore `prossimo`, scritto senza punto?
---
Niente: senza punto cerca un elemento `<prossimo>`, che nella pagina non c'è.

## selettore-discendente
La pagina ha due link dentro `nav` e uno dentro `main`. Quanti ne prende `nav a`?
---
Due: gli `a` che stanno dentro un `nav`.

## spazio-o-virgola
Che differenza c'è tra `h1 h2` e `h1, h2`?
---
`h1 h2` prende gli `h2` che stanno dentro un `h1`; `h1, h2` prende tutti gli `h1` e tutti gli `h2`.

## ereditarieta
La regola `body { font-family: sans-serif; }` non nomina i paragrafi. Con che carattere sono scritti?
---
Con `sans-serif`: il carattere si eredita da `body` a tutti gli elementi che contiene.

## sfondo-non-ereditato
Vero o falso: se un elenco `ul` ha `background-color: gold`, ogni sua voce `li` eredita quello sfondo.
---
Falso. Lo sfondo non si eredita: si vede dietro le voci perché di loro le voci non hanno sfondo.

## specificita-ordine
Tra un selettore di id, uno di classe e uno di elemento, quale pesa di più e quale di meno?
---
Pesa di più l'id, poi la classe, poi il nome di elemento.

## cascata-classe-elemento
Nel foglio c'è prima `.nota { color: teal; }` e più in basso `p { color: navy; }`. Di che colore è `<p class="nota">`?
---
`teal`: una classe pesa più di un nome di elemento, anche se la regola è scritta prima.

## cascata-ordine
Nel foglio c'è `p { color: navy; }` e più in basso `p { color: purple; }`. Di che colore sono i paragrafi?
---
`purple`: a parità di peso vince la regola scritta più in basso.

## cascata-ereditato
Nel foglio ci sono `#pagina { color: crimson; }` per `body` e `p { color: navy; }`. Di che colore è un paragrafo?
---
`navy`: una regola che prende l'elemento batte sempre un valore ereditato, anche se arriva da un id.

## link-colore-body
Perché un link resta blu anche con `body { color: black; }`?
---
Perché il foglio del browser ha una regola per `a`, e una regola sull'elemento batte il colore ereditato da `body`.
