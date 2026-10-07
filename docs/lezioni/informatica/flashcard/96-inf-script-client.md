# Flashcard: Gli script nella pagina web

## script-definizione
Che cos'è uno script in una pagina web?
---
Un programma che fa parte della pagina, scritto in JavaScript, che il browser esegue quando apre la pagina.

## dove-gira
Il file `script.js` sta sul server del sito. Quale computer esegue il programma che contiene?
---
Quello di chi visita la pagina: il file arriva al browser, che è il client, ed è il browser a eseguirlo.

## segreto-nello-script
Vero o falso: una password scritta dentro uno script resta nascosta a chi visita la pagina.
---
Falso. Il file dello script arriva sul computer di chi apre la pagina, e chiunque può leggerlo.

## tag-script
Scrivi il tag che collega il file `script.js` dalla `head`, in modo che parta quando la pagina è pronta.
---
`<script src="script.js" defer></script>`

## senza-defer
Il tag `script` è nella `head`, senza `defer`. Che cosa dà la ricerca di un elemento del `body` fatta dallo script?
---
`null`: il browser esegue lo script appena incontra il tag, quando il `body` non è ancora stato letto.

## defer-significato
Che cosa dice al browser l'attributo `defer`?
---
Di continuare a leggere la pagina e di eseguire lo script solo quando è stata costruita tutta.

## let-const
Che differenza c'è tra `let` e `const`?
---
`let` dichiara una variabile, a cui si possono assegnare altri valori; `const` un valore che non cambia più, e assegnarlo di nuovo è un errore.

## prompt-somma
`const a = prompt();` e chi risponde scrive 2. Quanto vale `a + 3`?
---
`"23"`: `prompt()` restituisce una stringa, e tra una stringa e un numero `+` attacca.

## number-prompt
Come si legge un numero con `prompt()` per farci dei conti?
---
`Number(prompt())`: `Number()` trasforma in un numero il testo restituito da `prompt()`.

## tre-uguali
Quanto valgono `"5" == 5` e `"5" === 5`?
---
Il primo è vero, perché `==` converte i valori prima di confrontarli; il secondo è falso. Per questo si usa sempre `===`.

## console-log-spazi
Che cosa scrive `console.log("Totale:", 31, "euro");`?
---
`Totale: 31 euro`: i valori separati da virgole escono uno dopo l'altro con uno spazio in mezzo.

## for-javascript
Che cosa scrive `for (let i = 1; i <= 3; i++) { console.log(i * 2); }`?
---
2, 4 e 6, uno per riga.

## funzione-javascript
Con quale parola si definisce una funzione in JavaScript, e che cosa non si scrive rispetto al C++?
---
Con `function`. Non si scrive il tipo dei parametri né quello del valore di ritorno.

## funzione-chiamata
`function costo(n) { return 8 * n; }` Che cosa scrive `console.log(costo(3) + 1);`?
---
25: la funzione restituisce 24, a cui si aggiunge 1.

## console-a-che-serve
Uno script ha un errore alla terza riga. Che cosa si vede nella pagina, e dove si legge l'errore?
---
La pagina resta com'era, perché lo script si ferma in quel punto. L'errore si legge nella console.

## reference-error
La console dice `ReferenceError: venduto is not defined`. Qual è la causa più probabile?
---
Un nome scritto male: lo script usa `venduto`, ma la variabile dichiarata si chiama in un altro modo, per esempio `venduti`.
