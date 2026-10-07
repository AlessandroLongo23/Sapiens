# Flashcard: Testo, link e immagini

## em-strong
Tra `<em>` e `<strong>`, quale segna un'informazione che il lettore non deve perdere?
---
`<strong>`, l'importanza. `<em>` segna l'enfasi, la parola su cui cade la voce.

## em-aspetto
Come mostra il browser il testo dentro `<em>`, e quello dentro `<strong>`?
---
Il primo in corsivo, il secondo in grassetto.

## br
Che cosa fa `<br>`, e come si chiude?
---
Manda il testo a capo dentro lo stesso paragrafo. Non ha contenuto, quindi non ha un tag di chiusura.

## br-spazio
Per allontanare due parti della pagina si mettono tre `<br>` di fila. Va bene?
---
No. Lo spazio tra gli elementi è aspetto, e si regola con i fogli di stile; due discorsi diversi stanno in due paragrafi.

## annidamento
Quale dei due è scritto bene: `<strong>molto <em>bene</em></strong>` oppure `<strong>molto <em>bene</strong></em>`?
---
Il primo: l'elemento aperto per ultimo si chiude per primo.

## a-href
In `<a href="concerti.html">Le date</a>`, su che cosa si fa clic e dove si arriva?
---
Si fa clic su "Le date" e si arriva al file `concerti.html`.

## assoluto-relativo
`https://www.scuola.example/orario.html` e `orario.html`: quale dei due funziona scritto in una pagina di un altro sito?
---
Il primo, l'indirizzo assoluto: ha il protocollo e il nome del server. Il secondo è relativo alla cartella della pagina in cui è scritto.

## relativo-stessa-cartella
La pagina `concerti/date.html` contiene `href="scaletta.html"`. Quale file apre il link?
---
`concerti/scaletta.html`: un percorso relativo parte dalla cartella della pagina.

## relativo-su
La pagina `concerti/date.html` deve portare a `index.html`, che sta nella cartella sopra. Che cosa va in `href`?
---
`../index.html`: i due punti salgono di una cartella.

## relativo-due-su
Dalla pagina `concerti/natale/scaletta.html` all'immagine `img/logo.png`: qual è il percorso relativo?
---
`../../img/logo.png`: si esce da `natale`, poi da `concerti`, e si entra in `img`.

## senza-protocollo
Che cosa fa il browser con `href="www.scuola.example"`?
---
Lo legge come un percorso relativo e cerca un file con quel nome nella cartella della pagina. Per un altro sito serve `https://` davanti.

## cancelletto
Dove porta `<a href="#contatti">`?
---
All'elemento della stessa pagina che ha `id="contatti"`.

## id-unico
Quanti elementi di una pagina possono avere `id="contatti"`?
---
Uno solo: un `id` è un nome unico nella pagina.

## testo-link
Tra "clicca qui" e "Le date dei concerti", quale è un buon testo per un link?
---
Il secondo: dice dove porta anche a chi legge solo i link.

## img-attributi
Quale attributo di `<img>` dice dove sta il file dell'immagine?
---
`src`: un percorso relativo o un indirizzo assoluto, come in `href`.

## alt-quando
Il file indicato da `src` non esiste. Che cosa vede il lettore al posto dell'immagine?
---
Il testo di `alt`, il testo alternativo.

## alt-chi
A chi serve `alt`, oltre a chi ha una connessione lenta?
---
A chi non vede e ascolta la pagina letta da un programma, e ai motori di ricerca.

## alt-decorativa
Che `alt` si scrive per un'immagine che fa solo da decorazione?
---
`alt=""`, vuoto: chi ascolta la pagina non viene interrotto.

## width-sola
Un'immagine di 400 per 200 pixel ha `width="200"` e nessun `height`. Quanto viene alta?
---
100 pixel: l'altezza è calcolata tenendo le proporzioni.

## width-file
Una foto di 4000 pixel di lato ha `width="200"`. Quanto pesa il file che il browser scarica?
---
Quanto prima: gli attributi cambiano la grandezza del disegno, non il file.
