# Flashcard: Controllare i dati di un modulo

## validazione-definizione
Che cosa vuol dire controllare i dati di un modulo?
---
Verificare, prima che il modulo parta, che quello che è stato scritto abbia senso, e dire a chi compila che cosa correggere.

## value-tipo
In un campo `type="number"` qualcuno scrive 3. Di che tipo è `campo.value`?
---
È una stringa, `"3"`: `value` è sempre una stringa, e per fare i conti serve `Number()`.

## trim
Nel campo c'è scritto `"  Anna "`, con due spazi davanti e uno dietro. Quanto vale `campo.value.trim().length`?
---
4: `trim()` toglie gli spazi all'inizio e alla fine, e restano le quattro lettere.

## tre-spazi
Nel campo ci sono solo tre spazi. La condizione `campo.value === ""` è vera o falsa? E con `trim()`?
---
Falsa: la stringa ha tre caratteri. Con `campo.value.trim() === ""` è vera.

## checked
Come si legge se una casella da spuntare ha la spunta?
---
Con la proprietà `checked`, che vale `true` o `false`.

## controllo-lunghezza
Scrivi la condizione che è vera quando `testo` ha meno di 8 caratteri.
---
`testo.length < 8`

## controllo-forma
Che cosa dice `testo.includes("@")`?
---
Se la stringa `testo` contiene una chiocciola: vale `true` o `false`.

## controllo-intervallo
`n` deve stare tra 1 e 4. Quale condizione è vera quando `n` è sbagliato: `n < 1 && n > 4` oppure `n < 1 || n > 4`?
---
`n < 1 || n > 4`. Con `&&` la condizione non è mai vera: nessun numero è insieme minore di 1 e maggiore di 4.

## campi-uguali
Che cosa non va in `if (conferma !== email)`, dove `conferma` ed `email` sono due campi?
---
Confronta i due nodi, che sono sempre diversi. Vanno confrontati i valori: `conferma.value !== email.value`.

## messaggio-dove
Dove va scritto il messaggio di errore di un campo?
---
In un elemento messo subito dopo il campo, con `textContent`: chi compila lo legge accanto a quello che deve correggere.

## messaggio-cancellare
Il campo era sbagliato e adesso è giusto. Che cosa deve fare lo script con il messaggio?
---
Scrivere la stringa vuota nel suo elemento, altrimenti il messaggio di prima resta lì.

## submit-evento
Su quale nodo e con quale evento si fanno i controlli prima dell'invio?
---
Sul nodo `form`, con l'evento `submit`, che nasce comunque parta il modulo: dal bottone o dal tasto Invio.

## prevent-default
Che cosa fa `event.preventDefault()` nell'ascoltatore di `submit`?
---
Chiede al browser di non fare quello che farebbe dopo l'evento, cioè di non inviare il modulo.

## senza-prevent-default
L'ascoltatore di `submit` scrive i messaggi di errore ma non chiama `preventDefault()`. Che cosa succede con un campo sbagliato?
---
Il messaggio compare, ma il modulo parte lo stesso.

## controlli-con-and
Perché `if (!(controllaNome() && controllaEmail()))` può mostrare un solo messaggio quando i campi sbagliati sono due?
---
Perché se `controllaNome()` risponde falso, `controllaEmail()` non viene chiamata, e non scrive il suo messaggio.

## required-prima
Un campo ha `required` ed è vuoto. L'ascoltatore di `submit` viene chiamato?
---
No. I controlli dell'HTML vengono prima dell'evento `submit`: il browser mostra il suo messaggio e si ferma lì.

## server-ripete
Vero o falso: se lo script controlla tutti i campi, il server può fidarsi dei dati che riceve.
---
Falso. Il controllo nel browser si può aggirare, per esempio spegnendo JavaScript: il server deve rifare ogni controllo.
