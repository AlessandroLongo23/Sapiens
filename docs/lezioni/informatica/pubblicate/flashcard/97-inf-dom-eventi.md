# Flashcard: Il DOM e gli eventi

## dom-definizione
Che cos'è il DOM?
---
L'albero di oggetti che il browser costruisce leggendo l'HTML, con un nodo per ogni elemento della pagina.

## dom-vivo
Uno script cambia il testo di un nodo del DOM. Che cosa succede alla pagina, e che cosa al file HTML?
---
La pagina cambia subito, perché è disegnata dal DOM. Il file HTML resta com'era.

## queryselector-primo
La pagina ha tre elementi `li`. Che cosa restituisce `document.querySelector("li")`?
---
Il primo dei tre: `querySelector` restituisce solo il primo elemento che corrisponde al selettore.

## queryselector-id-classe
Quale selettore prende l'elemento con `id="scaletta"`, e quale il primo con `class="brano"`?
---
`"#scaletta"` e `".brano"`: il cancelletto per l'id, il punto per la classe, come nei fogli di stile.

## queryselector-null
Nell'HTML c'è `<p id="stato">`. Che cosa restituisce `document.querySelector("stato")`?
---
`null`: senza il cancelletto il selettore cerca un tag `stato`, che non esiste.

## null-errore
La console dice `Cannot set properties of null (setting 'textContent')`. Che cosa è successo?
---
Lo script ha cercato un elemento che non ha trovato, e poi ha provato a cambiarne il testo.

## queryselectorall-length
La pagina ha un elenco `#scaletta` con tre `li`. Quanto vale `document.querySelectorAll("#scaletta li").length`?
---
3.

## textcontent
Quale riga scrive "Esaurito" dentro il nodo conservato nella costante `stato`?
---
`stato.textContent = "Esaurito";`

## classlist-toggle
Un elemento ha la classe `nascosto`. Che classi ha dopo due chiamate di `classList.toggle("nascosto")`?
---
Ha di nuovo `nascosto`: la prima chiamata la toglie, la seconda la rimette.

## classe-o-stile
Per colorare di rosso un messaggio, perché è meglio `classList.add("errore")` di `style.color = "red"`?
---
Perché l'aspetto resta nel foglio di stile, nella regola della classe, e lo script dice solo quando la classe c'è.

## evento-definizione
Che cos'è un evento?
---
Qualcosa che succede su un nodo della pagina e di cui il browser tiene nota: un clic, un carattere scritto in un campo, un modulo inviato.

## ascoltatore-definizione
Che cos'è un ascoltatore?
---
Una funzione registrata su un nodo per un tipo di evento: il browser la chiama ogni volta che quell'evento succede lì.

## addeventlistener-forma
Scrivi la riga che fa chiamare la funzione `vota` a ogni clic sul nodo `bottone`.
---
`bottone.addEventListener("click", vota);`

## parentesi-ascoltatore
Che cosa non va in `bottone.addEventListener("click", mostra());`?
---
Le parentesi: `mostra` viene chiamata subito, una volta, e al browser non resta nessuna funzione da chiamare al clic.

## script-finito
Vero o falso: lo script resta fermo sulla riga di `addEventListener` finché qualcuno non fa clic.
---
Falso. Lo script prosegue e finisce; la funzione registrata viene chiamata dopo, dal browser, a ogni clic.

## contatore-globale
Una funzione `vota`, chiamata a ogni clic, deve contare i clic. Dove va dichiarata la variabile che conta?
---
Fuori dalla funzione: una variabile locale ripartirebbe da capo a ogni chiamata.

## create-append
Dopo `const voce = document.createElement("li");` la voce si vede nella pagina?
---
No. Il nodo è stato creato ma è staccato dall'albero: compare quando `append` lo attacca a un nodo della pagina.

## clic-nodi
Un clic su un bottone fa comparire un elenco. Su quale nodo nasce l'evento, e quale nodo cambia?
---
L'evento nasce sul nodo del bottone; a cambiare è il nodo dell'elenco, che la funzione in ascolto modifica.
