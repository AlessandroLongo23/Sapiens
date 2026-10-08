# Flashcard: Struttura di una pagina HTML

## doctype
Che cosa dice al browser la riga `<!DOCTYPE html>`, e dove sta?
---
Che il file è scritto nell'HTML di oggi. Sta nella prima riga, e non si chiude.

## head-body
Quale dei due figli di `<html>` contiene quello che si vede nella finestra del browser?
---
`<body>`, il corpo. `<head>` raccoglie informazioni sulla pagina, che il browser usa ma non disegna.

## title-dove-compare
Cambi il testo tra `<title>` e `</title>`. Che cosa cambia nella pagina?
---
Niente. Il titolo del documento compare sulla scheda del browser, tra i preferiti e nei risultati di ricerca, non nella pagina.

## title-h1
Vero o falso: `<title>` e `<h1>` sono due modi di scrivere il titolo che si vede in cima alla pagina.
---
Falso. `<title>` sta nella testa e dà il nome alla scheda; `<h1>` sta nel corpo ed è il titolo nella pagina.

## meta-charset
A che cosa serve `<meta charset="utf-8">`?
---
Dichiara la codifica dei caratteri del file. Senza, il browser deve indovinarla, e le lettere accentate possono diventare simboli sbagliati.

## lang
In `<html lang="it">`, chi usa l'attributo `lang`?
---
I programmi che leggono la pagina ad alta voce, per scegliere la pronuncia, e i traduttori automatici.

## spazi-a-capo
In un file un paragrafo `<p>` è scritto su tre righe. Su quante righe lo mostra il browser?
---
Dipende solo dalla larghezza della finestra. Gli a capo e gli spazi ripetuti del file contano come uno spazio solo.

## livelli-titoli
Sotto un `<h2>` serve il titolo di una sua parte. Quale elemento si usa?
---
`<h3>`: scendendo non si salta un livello.

## titolo-grandezza
`<h2>` "viene troppo grande". È una buona ragione per usare `<h4>` al suo posto?
---
No. Il livello dice la struttura; la grandezza si cambia con i fogli di stile.

## quanti-h1
Quanti `<h1>` ha una pagina?
---
Uno solo: è il titolo di tutta la pagina.

## semantici-quale
Quale elemento contiene il menu con i link per muoversi nel sito?
---
`<nav>`.

## main-aspetto
Togli `<main>` e `</main>` da una pagina senza fogli di stile. Che cosa cambia nell'aspetto?
---
Niente. Gli elementi semantici dicono che cosa è una parte, non che aspetto ha.

## head-header
Qual è la differenza tra `<head>` e `<header>`?
---
`<head>` è la testa del documento e non si vede. `<header>` è l'intestazione che si vede in cima alla pagina, e sta dentro `<body>`.

## albero-genitore
In `<main><h2>Chi siamo</h2><p>Quattro amici.</p></main>`, chi è il genitore di `<p>`, e chi è suo fratello?
---
Il genitore è `<main>`, il fratello è `<h2>`.

## albero-radice
Qual è la radice dell'albero del documento, e quali sono i suoi figli?
---
`<html>`. I suoi figli sono `<head>` e `<body>`.

## albero-apertura
Il browser legge `<p>` mentre `<main>` è l'ultimo elemento ancora aperto. Dove finisce `<p>` nell'albero?
---
Diventa figlio di `<main>`: un tag di apertura aggiunge un figlio all'ultimo elemento rimasto aperto.

## h2-non-chiuso
Nel file c'è `<h2>Chi siamo` senza `</h2>`, e sotto `<p>Quattro amici.</p>`. Come viene scritto il paragrafo?
---
Come un titolo: `<h2>` è ancora aperto, quindi `<p>` diventa suo figlio.

## commento
Che cosa mostra il browser di `<!-- <p>Ingresso libero.</p> -->`?
---
Niente: è un commento, e il browser lo salta.

## commento-segreto
Vero o falso: quello che scrivi in un commento lo vedi solo tu.
---
Falso. Il commento arriva con il resto del file, e chiunque lo legge guardando il sorgente della pagina.

## errore-browser
Che cosa fa il browser quando trova un tag che non esiste, come `<titolo>`?
---
Non si ferma e non avvisa: lo tiene come elemento senza aspetto e senza significato, e il testo resta testo normale.
