# Flashcard: I moduli

## modulo
Che cos'è un modulo in una pagina web?
---
La parte della pagina in cui l'utente inserisce dei dati, che il browser spedisce a un server. Si scrive con `<form>`.

## action-method
Che cosa dicono gli attributi `action` e `method` di un `<form>`?
---
`action` è l'indirizzo a cui mandare i dati, `method` il modo di mandarli: `get` oppure `post`.

## label-for
Con che cosa deve coincidere il `for` di un `<label>`?
---
Con l'`id` del suo campo. Così un clic sull'etichetta porta il cursore nel campo.

## for-senza-id
Un'etichetta ha `for="email"` e il campo ha solo `name="email"`. Il clic sull'etichetta funziona?
---
No. `for` cerca un campo con quell'`id` e ignora il `name`.

## placeholder
Vero o falso: `placeholder` può sostituire l'etichetta di un campo.
---
Falso. Il testo d'esempio sparisce al primo carattere digitato, e l'utente non sa più che cosa stava compilando.

## tipo-password
Che cosa fa il browser con `<input type="password">`?
---
Nasconde i caratteri che scrivi.

## tipo-per-biglietti
Quale `type` scegli per chiedere quanti biglietti servono?
---
`number`: il campo rifiuta le lettere.

## checkbox-radio
Quando si usa `checkbox` e quando `radio`?
---
`checkbox` per un sì o un no; `radio` per una scelta sola tra poche risposte.

## gruppo-pallini
Che cosa lega due pallini `radio` in un gruppo, in modo che ne resti acceso uno solo?
---
Lo stesso `name`.

## select-textarea
Quale elemento serve per un menu a tendina, e quale per un testo di più righe?
---
`<select>`, con un `<option>` per ogni voce, e `<textarea>`.

## coppia
In che forma arrivano al server i dati di un modulo?
---
Come coppie di nome e valore, una per campo: il `name` del campo e quello che contiene, per esempio `nome=Anna`.

## senza-name
Un campo ha `id="classe"`, l'etichetta giusta e nessun `name`. L'utente scrive 3B e invia. Che cosa arriva al server?
---
Niente: un campo senza `name` non viene inviato.

## casella-non-spuntata
Che cosa manda una casella `checkbox` che non è stata spuntata?
---
Niente. Solo una casella spuntata viene inviata, con il suo `name` e il suo `value`.

## select-value
Nel menu l'utente sceglie `<option value="m">Media</option>`. Che valore parte?
---
`m`: parte il `value` dell'opzione, non il testo che si legge nel menu.

## get-indirizzo
Un modulo con `action="/cerca"` e `method="get"` ha un solo campo, `name="q"`, in cui scrivi rock. Che indirizzo chiede il browser?
---
`/cerca?q=rock`: con `get` le coppie si attaccano all'indirizzo dopo un punto interrogativo.

## post-dove
Con `method="post"`, dove viaggiano le coppie?
---
Nel corpo della richiesta. L'indirizzo resta quello di `action`.

## senza-method
Che metodo usa un `<form>` senza l'attributo `method`?
---
`get`: i dati finiscono nell'indirizzo.

## password-metodo
Con quale metodo si invia un modulo che contiene una password?
---
Con `post`, in una pagina `https`: con `get` la password resterebbe scritta nell'indirizzo e nella cronologia.

## required-vuoto
Un campo ha `required` ed è vuoto. Che cosa succede premendo il bottone di invio?
---
Il browser non invia il modulo e mostra un messaggio accanto al campo.

## min-max-estremi
Un campo ha `min="1" max="4"`. Il browser accetta 4? E 5?
---
4 sì, 5 no: gli estremi sono accettati, i valori fuori no.
