# Formulario: Il DOM e gli eventi

## Il DOM

- DOM (Document Object Model): l'albero di oggetti che il browser costruisce leggendo l'HTML, un nodo per ogni elemento.
- La pagina è disegnata dal DOM: se lo script cambia un nodo la pagina cambia subito. Il file HTML resta com'era.
- `document` è l'oggetto da cui lo script raggiunge l'albero.

## Selezionare

| Scrittura | Che cosa restituisce |
|---|---|
| `document.querySelector("h1")` | il primo elemento `h1` |
| `document.querySelector(".brano")` | il primo elemento con classe `brano` |
| `document.querySelector("#scaletta")` | l'elemento con id `scaletta` |
| `document.querySelector("#scaletta li")` | il primo `li` dentro `#scaletta` |
| `document.querySelectorAll("li")` | tutti i `li`, in ordine: `length`, e `[0]`, `[1]`... |

Se nessun elemento corrisponde, `querySelector` restituisce `null`.

## Cambiare un nodo

| Scrittura | Effetto |
|---|---|
| `nodo.textContent = "Dal vivo"` | cambia il testo |
| `nodo.classList.add("apertura")` | aggiunge la classe |
| `nodo.classList.remove("apertura")` | toglie la classe |
| `nodo.classList.toggle("nascosto")` | la toglie se c'è, la aggiunge se non c'è |
| `nodo.style.color = "teal"` | cambia una proprietà CSS (`backgroundColor` per `background-color`) |

L'aspetto sta nel foglio di stile, in una regola per la classe; lo script mette e toglie la classe.

## Eventi e ascoltatori

- Evento: qualcosa che succede su un nodo e di cui il browser tiene nota. `click`, `input` (un carattere scritto in un campo), `submit` (un modulo inviato).
- Ascoltatore: una funzione registrata su un nodo per un tipo di evento. Il browser la chiama ogni volta che l'evento succede.

```js
const bottone = document.querySelector("#mostra");
const scaletta = document.querySelector("#scaletta");

function mostra() {
    scaletta.classList.toggle("nascosto");
}

bottone.addEventListener("click", mostra);
```

1. Seleziona il nodo che riceverà l'evento e quello da cambiare.
2. Definisci la funzione che fa il cambiamento.
3. Registra la funzione con `addEventListener`, scrivendone il nome senza parentesi.

Lo script gira una volta e finisce; le funzioni registrate partono dopo, a ogni evento. Quello che va ricordato tra un evento e l'altro sta in una variabile dichiarata fuori dalle funzioni.

## Creare un elemento

```js
const voce = document.createElement("li");
voce.textContent = "Bis";
scaletta.append(voce);
```

Il nodo creato è staccato dall'albero finché `append` non lo attacca in fondo a un nodo della pagina.

```ad-warning
Il selettore che non prende niente
Senza `#` o senza punto, o con un nome diverso da quello dell'HTML, `querySelector` dà `null` e la riga dopo si ferma con un errore che parla di `null`.
```

```ad-warning
Le parentesi dopo il nome della funzione
`addEventListener("click", mostra())` chiama `mostra` subito, una volta sola, e non registra niente.
```
