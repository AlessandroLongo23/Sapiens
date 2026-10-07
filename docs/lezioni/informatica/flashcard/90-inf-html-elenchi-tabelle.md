# Flashcard: Elenchi e tabelle

## ul-ol-differenza
Che differenza c'è tra `<ul>` e `<ol>`?
---
`<ul>` è un elenco puntato, `<ol>` un elenco numerato. In tutti e due le voci sono elementi `<li>`.

## scegliere-elenco
La scaletta di un concerto va in un `<ul>` o in un `<ol>`?
---
In un `<ol>`: scambiando due pezzi cambia il significato, quindi l'ordine conta.

## componenti-gruppo
I nomi dei quattro componenti di un gruppo vanno in un `<ul>` o in un `<ol>`?
---
In un `<ul>`: si possono elencare in qualunque ordine.

## numeri-a-mano
Che cosa mostra il browser per `<li>1. Controtempo</li>` dentro un `<ol>`?
---
"1. 1. Controtempo": il browser aggiunge il suo numero a quello scritto a mano.

## spostare-voce
In un `<ol>` sposti l'ultima voce al primo posto. Che cosa succede ai numeri?
---
Si sistemano da soli: nel file non sono scritti, li conta il browser.

## testo-fuori-voce
Vero o falso: dentro un `<ul>` si può scrivere del testo tra una voce e l'altra.
---
Falso. Tra `<ul>` e `</ul>` stanno solo elementi `<li>`: ogni parola va dentro una voce.

## annidato-dove
Dove si scrive un elenco annidato?
---
Dentro la voce a cui appartiene: dopo il suo testo e prima del suo `</li>`.

## annidato-numeri
Un `<ol>` di tre voci ne contiene un altro dentro la seconda voce. Da che numero parte l'elenco interno?
---
Da 1. Ogni `<ol>` conta le sue voci per conto suo.

## annidato-errore
Che cosa c'è di sbagliato in `<li>Primo tempo</li>` seguito da un `<ol>` e poi da un altro `<li>`?
---
L'elenco interno è finito tra due voci, dove possono stare solo dei `<li>`: la voce va chiusa dopo l'elenco.

## tr-th-td
A che cosa servono `<tr>`, `<th>` e `<td>`?
---
`<tr>` è una riga della tabella, `<th>` una cella di intestazione, `<td>` una cella con un dato.

## tabella-ordine
In che ordine si scrive una tabella?
---
Una riga alla volta, dall'alto in basso, e in ogni riga una cella alla volta, da sinistra a destra.

## colonne-contare
Una tabella ha tre `<tr>`, ognuno con quattro celle. Quante colonne ha?
---
Quattro: tante quante le celle di una riga. Le colonne non hanno un loro elemento.

## caption-dove
Che cos'è `<caption>` e dove si scrive?
---
La didascalia della tabella. Si scrive subito dopo `<table>`, prima della prima riga.

## cella-in-meno
In una tabella di tre colonne una riga ha solo due celle senza attributi. Che cosa si vede?
---
La riga resta più corta: le sue celle scivolano a sinistra e l'ultima colonna rimane senza dato.

## bordi-tabella
Vero o falso: le linee tra le celle di una tabella le disegna l'HTML.
---
Falso. Vengono dal foglio di stile; l'HTML dice solo quali sono le righe e le celle.

## colspan
Che cosa fa `colspan="2"` su una cella?
---
La fa occupare due colonne. La cella alla sua destra non si scrive più.

## rowspan-riga-sotto
In una tabella di tre colonne una cella ha `rowspan="2"`. Quante celle si scrivono nella riga sotto?
---
Due: un posto è già occupato dalla cella che scende da sopra.

## conto-posti
Una riga ha tre celle: una con `colspan="3"` e due senza attributi. Quante colonne occupa?
---
Cinque: 3 + 1 + 1.

## unire-senza-cancellare
In una tabella di tre colonne aggiungi `colspan="2"` a una cella e non cancelli quella accanto. Che cosa succede?
---
La riga occupa quattro posti: l'ultima cella sporge a destra, fuori dalle intestazioni.

## tabella-impaginare
Vero o falso: una tabella è il modo giusto per mettere il menu a sinistra e il testo a destra.
---
Falso. Una tabella è per dati con righe e colonne; per disporre le parti di una pagina c'è il CSS.
