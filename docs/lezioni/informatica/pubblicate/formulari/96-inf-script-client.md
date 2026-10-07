# Formulario: Gli script nella pagina web

## Che cos'è uno script

- Script: un programma che fa parte di una pagina web, scritto in JavaScript, che il browser esegue quando apre la pagina.
- Arriva dal server come file `.js`, ma gira nel browser, cioè sul client.
- Risponde subito, chiunque può leggerlo, non esce dalla pagina: non legge i file del disco né le altre schede.

## Collegare lo script

```html
<head>
    <script src="script.js" defer></script>
</head>
```

- `src` porta il nome del file; il tag `</script>` ci vuole sempre.
- Il browser legge l'HTML dall'alto in basso. A un tag `script` senza `defer` si ferma ed esegue subito lo script.
- Con `defer` lo script parte quando la pagina è stata costruita tutta. Lo stesso succede con il tag in fondo al `body`.

## Le forme del linguaggio

| Che cosa | Come si scrive |
|---|---|
| Variabile | `let n = 5;` |
| Valore che non cambia | `const n = 5;` |
| Leggere un numero | `Number(prompt())` |
| Scrivere | `console.log(n);` |
| Uguale, diverso | `===`, `!==` |
| E, o, non | `&&`, `\|\|`, `!` |
| Vettore | `const v = [4, 7, 9];` |
| Quanti elementi | `v.length` |
| Commento | `// nota` |

Selezione, cicli e funzione:

```js
if (liberi === 0) {
    console.log("esaurito");
} else {
    console.log("aperto");
}

while (n > 0) {
    n = n - 1;
}

for (let i = 1; i <= 4; i++) {
    console.log(i);
}

function costo(interi, ridotti) {
    return 8 * interi + 5 * ridotti;
}
console.log(costo(2, 1));
```

- Parentesi tonde intorno alla condizione, graffe intorno al blocco, punto e virgola a fine istruzione: come nel C++.
- Nessun tipo da dichiarare, né per le variabili né per i parametri e il valore di ritorno: come in Python.
- `console.log(a, b)` scrive i valori separati da uno spazio.

## La console

- È dove lo script scrive con `console.log()` e dove il browser segnala gli errori. In un browser si apre con F12 o con "Ispeziona".
- A un errore lo script si ferma in quel punto: le righe dopo non vengono eseguite e la pagina resta com'era.
- `ReferenceError: x is not defined`: un nome scritto male o mai dichiarato.
- Un errore che parla di `null`, come `Cannot set properties of null`: lo script ha cercato un elemento che non c'era.

```ad-warning
Testo più numero
`prompt()` restituisce una stringa, e tra stringhe `+` attacca: `"2" + "3"` fa `"23"`. Prima di fare i conti si passa da `Number()`.
```

```ad-warning
Tre segni di uguale
Il confronto è `===`. `==` converte i valori prima di confrontarli (`"5" == 5` è vero), `=` è l'assegnamento.
```

```ad-warning
Lo script che parte troppo presto
Nella `head` senza `defer` lo script gira quando il `body` non è ancora stato letto, e ogni ricerca di un elemento dà `null`.
```
