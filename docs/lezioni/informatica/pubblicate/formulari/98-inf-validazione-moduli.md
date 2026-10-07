# Formulario: Controllare i dati di un modulo

## Leggere un campo

| Scrittura | Che cosa dà |
|---|---|
| `campo.value` | quello che c'è scritto nel campo, sempre come stringa |
| `campo.value.trim()` | lo stesso testo senza gli spazi all'inizio e alla fine |
| `testo.length` | il numero dei caratteri |
| `Number(campo.value)` | il numero scritto nel campo; il campo vuoto dà `0` |
| `casella.checked` | `true` se la casella ha la spunta, altrimenti `false` |

L'evento `input` nasce a ogni carattere scritto in un campo, `change` quando si lascia un campo dopo averlo cambiato, `submit` sul `form` quando il modulo viene inviato.

## I quattro tipi di controllo

| Controllo | Condizione dell'errore |
|---|---|
| Vuoto | `testo === ""` |
| Lunghezza | `testo.length < 2` |
| Forma di un testo | `!testo.includes("@")` |
| Forma di un numero | `!Number.isInteger(n) \|\| n < 1 \|\| n > 4` |
| Due campi uguali | `conferma.value.trim() !== email.value.trim()` |

I controlli si fanno in ordine, sul valore già passato da `trim()`.

## Il messaggio accanto al campo

```html
<input id="nome" name="nome">
<span class="errore" id="errore-nome"></span>
```

- Lo script scrive il messaggio nello `span` con `textContent`, e la stringa vuota quando il campo è a posto.
- Il messaggio dice che cosa fare ("Scrivi il tuo nome"), e non si regge solo sul colore.

## Fermare l'invio

```js
function controlla(event) {
    const nomeValido = controllaNome();
    const emailValida = controllaEmail();
    if (!(nomeValido && emailValida)) {
        event.preventDefault();
    }
}

form.addEventListener("submit", controlla);
```

1. Si ascolta `submit` sul `form`, non il clic sul bottone: un modulo parte anche con il tasto Invio.
2. L'ascoltatore riceve l'oggetto dell'evento in un parametro.
3. Si chiamano tutti i controlli, uno per campo, e ognuno mostra o cancella il suo messaggio.
4. Se anche uno solo ha risposto falso, `event.preventDefault()` ferma l'invio.

I controlli dell'HTML (`required`, `type="email"`, `min`, `max`) vengono prima dell'evento `submit`: se falliscono, l'ascoltatore non viene chiamato.

## Browser e server

- Il controllo nel browser dà una risposta immediata a chi compila, ma si può aggirare: JavaScript si spegne, la pagina si modifica, la richiesta si può mandare senza la pagina.
- Il server rifà ogni controllo sui dati che riceve, prima di usarli.

```ad-warning
Confrontare i campi invece dei valori
`conferma !== email` confronta due nodi, ed è sempre vero. Si confrontano i `value`.
```

```ad-warning
I controlli in fila con &&
In `controllaNome() && controllaEmail()` il secondo controllo non viene chiamato se il primo risponde falso, e il suo messaggio non compare.
```

```ad-warning
preventDefault() dimenticata
Senza `event.preventDefault()` i messaggi compaiono, ma il modulo parte lo stesso.
```
