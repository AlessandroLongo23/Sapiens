# Flashcard: I linguaggi di markup

## markup-definizione
Che cos'è un linguaggio di markup?
---
Un insieme di marcatori, scritti in mezzo al testo per dire che cos'è ogni sua parte, e di regole su come scriverli.

## struttura-o-aspetto
"Questa riga è il titolo della pagina" descrive la struttura o l'aspetto?
---
La struttura: dice che cos'è la riga, non come viene mostrata.

## aspetto-esempio
"Questa riga è in grassetto e centrata" descrive la struttura o l'aspetto?
---
L'aspetto. In una pagina web si decide nel foglio di stile, non con i tag.

## h1-per-farlo-grande
Vero o falso: se voglio una frase grande, la marco con `h1`.
---
Falso. `h1` dice che il testo è un titolo; se non lo è, la dimensione si cambia nel foglio di stile.

## tag-di-chiusura
Qual è il tag di chiusura di `<em>`?
---
`</em>`: lo stesso nome, preceduto dalla barra.

## elemento
In `<h1>I Fuori Tempo</h1>`, che cos'è l'elemento?
---
Tutto: il tag di apertura, il contenuto e il tag di chiusura insieme.

## contenuto
Qual è il contenuto dell'elemento `<li>Leo, batteria</li>`?
---
Leo, batteria: quello che sta tra i due tag.

## attributo-nome-valore
In `<a href="concerti.html">I concerti</a>`, quali sono il nome e il valore dell'attributo?
---
Il nome è `href`, il valore è `concerti.html`.

## attributo-dove
In quale dei due tag si scrivono gli attributi?
---
In quello di apertura, dopo il nome: `nome="valore"`.

## attributo-si-vede
Vero o falso: il valore di `href` compare nel testo della pagina.
---
Falso. Nella pagina si vede il contenuto dell'elemento; il valore dell'attributo serve al browser.

## genitore-figlio
In `<ul><li>Sara</li></ul>`, qual è il genitore e quale il figlio?
---
`ul` è il genitore, `li` il figlio: `li` sta per intero dentro `ul`.

## annidamento-regola
In che ordine si chiudono i tag annidati?
---
Nell'ordine inverso a quello in cui sono stati aperti: l'ultimo aperto è il primo che si chiude.

## accavallati
Che cosa c'è di sbagliato in `<p>Suoniamo <em>rock.</p></em>`?
---
`em` è aperto dentro `p` ma chiuso dopo `</p>`: i due elementi si accavallano. Prima va `</em>`, poi `</p>`.

## quanti-figli
In `<p>Suoniamo <em>rock</em> dal 2024.</p>`, quanti elementi ci sono?
---
Due: `p` ed `em`, il secondo dentro il primo.

## tag-non-chiuso
Che cosa fa il browser se manca `</h1>`?
---
Non si ferma e non avvisa: considera titolo anche quello che segue, che viene disegnato grande.

## spazi-a-capo
Vero o falso: andando a capo nel file HTML si va a capo anche nella pagina.
---
Falso. Spazi a inizio riga e a capo nel file non contano: decide la struttura degli elementi.

## markup-non-programma
Perché l'HTML non è un linguaggio di programmazione?
---
Perché non ha istruzioni da eseguire: niente variabili, calcoli, condizioni o cicli. Descrive che cosa c'è nella pagina.

## xml-tag
Chi decide i nomi dei tag in un file XML?
---
Chi lo scrive, secondo i dati da descrivere. L'HTML invece ha un insieme fisso di tag.

## markdown-titolo
Qual è l'HTML che corrisponde alla riga Markdown `# Concerti`?
---
`<h1>Concerti</h1>`.

## markdown-asterischi
In Markdown, che differenza c'è tra `*rock*` e `**rock**`?
---
Il primo diventa `<em>rock</em>`, un testo in evidenza; il secondo `<strong>rock</strong>`, un testo importante.
