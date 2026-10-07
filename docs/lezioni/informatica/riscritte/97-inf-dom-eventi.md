# Il DOM e gli eventi

Nella pagina dei Fuori Tempo c'è la scaletta del concerto, e sopra un bottone con scritto "Mostra la scaletta". Per ora il bottone non fa niente. Perché funzioni, lo script deve saper fare due cose: mettere le mani sugli elementi della pagina, per far comparire l'elenco, e accorgersi del momento in cui qualcuno preme il bottone. La prima cosa si fa attraverso il DOM, la seconda con gli eventi.

## Il DOM, l'albero vivo della pagina

Quando il browser legge un file HTML non lo tiene come testo: per ogni elemento costruisce in memoria un oggetto, e collega gli oggetti tra loro come sono annidati i tag. Ne esce l'[albero del documento](/materiale/scuola-superiore/informatica/il-linguaggio-html/struttura-di-una-pagina-html), con `html` in cima, sotto `head` e `body`, e dentro `body` i titoli, i paragrafi, gli elenchi. Questo albero di oggetti si chiama **DOM** (Document Object Model, modello a oggetti del documento), e ogni suo oggetto è un **nodo**.

La pagina che vedi è disegnata a partire dal DOM, non dal file. Per questo l'albero è vivo: se uno script cambia un nodo, il browser ridisegna subito quel pezzo di pagina. Il file HTML invece resta com'era, e ricaricando la pagina si riparte da lì. Lo script raggiunge l'albero attraverso `document`, un oggetto che il browser gli mette a disposizione e che rappresenta tutta la pagina.

## Selezionare un elemento

Prima di cambiare un elemento bisogna trovarlo. `document.querySelector("...")` riceve un selettore, scritto come nei [fogli di stile](/materiale/scuola-superiore/informatica/i-fogli-di-stile/regole-e-selettori-css), e restituisce il primo elemento della pagina che gli corrisponde: `"h1"` per il tag, `".brano"` per la classe, `"#scaletta"` per l'id, `"#scaletta li"` per un discendente. Il risultato si conserva in una costante, per usarlo più volte.

Quando gli elementi che interessano sono più di uno si usa `document.querySelectorAll("...")`, che li restituisce tutti, in ordine. Il risultato si usa come un [vettore](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/i-vettori): ha una lunghezza, `length`, e i suoi elementi si prendono con l'indice tra parentesi quadre, a partire da 0.

```ad-warning
Il selettore che non prende niente
Se nessun elemento corrisponde al selettore, `querySelector` restituisce `null`, e la riga dopo, che prova a usare quell'elemento, si ferma con un errore che parla di `null`, come `Cannot set properties of null` o `Cannot read properties of null`. Le cause sono quasi sempre tre: manca il `#` o il punto davanti al nome, il nome è scritto diverso da come sta nell'HTML, oppure lo script è partito [prima che la pagina esistesse](/materiale/scuola-superiore/informatica/pagine-web-interattive/gli-script-nella-pagina-web).
```

## Cambiare testo, classi e stile

Un nodo ha delle proprietà, che si leggono e si scrivono mettendo un punto dopo il suo nome. Per la maggior parte delle pagine ne servono tre.

- `textContent` è il testo dell'elemento. Assegnandogli una stringa il testo nella pagina cambia: `titolo.textContent = "Dal vivo"`.
- `classList` è l'elenco delle classi dell'elemento, con tre funzioni: `add("nome")` aggiunge una classe, `remove("nome")` la toglie, `toggle("nome")` la toglie se c'è e la aggiunge se non c'è.
- `style` porta le proprietà CSS dell'elemento: `titolo.style.color = "teal"`. Le proprietà con il trattino si scrivono attaccate, con la maiuscola al posto del trattino: `backgroundColor`.

Tra le ultime due è meglio la prima. L'aspetto resta scritto nel foglio di stile, in una regola per la classe, e lo script si limita a dire quando la classe c'è: così per cambiare un colore non si va a cercarlo dentro il programma.

Nella pagina qui sotto lo script lavora appena la pagina è pronta, senza aspettare nessuno: cambia il titolo, conta i brani e mette in evidenza il primo. Eseguila e confronta la pagina con il file `index.html`, dove il titolo è ancora quello vecchio. Poi scrivi `brani[2]` al posto di `brani[0]`, e infine `"h2"` al posto di `"h1"` nella prima riga: leggi nella console che cosa succede quando il selettore non prende niente.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>La scaletta</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <ul id="scaletta">
        <li>Controtempo</li>
        <li>Ultima campanella</li>
        <li>Fuori orario</li>
    </ul>
</body>
</html>
```

```codice css
body {
    font-family: sans-serif;
    margin: 20px;
}

.apertura {
    font-weight: bold;
    color: teal;
}
```

```codice js
const titolo = document.querySelector("h1");
titolo.textContent = "I Fuori Tempo dal vivo";

const brani = document.querySelectorAll("#scaletta li");
console.log("Brani in scaletta:", brani.length);
brani[0].classList.add("apertura");
```

## Gli eventi e le funzioni che li ascoltano

Un **evento** è qualcosa che succede nella pagina e di cui il browser tiene nota: un clic su un elemento (`click`), un carattere scritto in un campo (`input`), un modulo che viene inviato (`submit`). Ogni evento nasce su un nodo preciso del DOM, quello su cui è successo.

Lo script non può sapere quando arriverà un clic, e non resta fermo ad aspettarlo. Prepara una [funzione](/materiale/scuola-superiore/informatica/le-funzioni/definire-e-chiamare-una-funzione) e la consegna al browser, dicendo su quale elemento e per quale evento va chiamata. Una funzione registrata così si chiama **ascoltatore** (in inglese listener), e si registra con `addEventListener`:

```js
bottone.addEventListener("click", mostra);
```

Da quel momento, ogni volta che qualcuno preme il bottone, il browser chiama `mostra`. È un modo di programmare diverso da quello a cui sei abituato. Lo script viene eseguito dall'alto in basso una volta sola, in un attimo, e finisce; restano le funzioni registrate, che partono quando succede il loro evento, nell'ordine deciso da chi usa la pagina.

Che cosa succede tra il clic e la pagina che cambia lo mostra la figura. Premi il bottone nella pagina disegnata a sinistra, poi rifai il percorso un passo alla volta e guarda quale nodo dell'albero riceve l'evento e quale nodo viene cambiato.

```interattivo
% nome: inf-dom-albero-eventi
% alt: A sinistra una piccola pagina con il titolo I Fuori Tempo, un bottone Mostra la scaletta, un bottone Mi piace e un contatore; a destra l'albero del DOM della stessa pagina, con un nodo per ogni elemento e accanto ai due bottoni la funzione che ascolta il clic. Premendo il bottone Mostra la scaletta si accende il nodo del bottone, poi l'ascoltatore mostra, poi il nodo dell'elenco, che perde la classe nascosto, e nella pagina compare la scaletta. Premendo Mi piace si accende l'altro bottone, poi l'ascoltatore vota, poi il nodo del contatore, il cui testo aumenta di uno.
```

L'evento nasce sul nodo del bottone, e il nodo che cambia è un altro: l'elenco, che perde la classe `nascosto`, oppure il contatore, che riceve un testo nuovo. Tra i due c'è la funzione, che può cambiare qualunque nodo dell'albero. Il browser ridisegna la pagina solo dopo, guardando il DOM.

Questa è la pagina vera. La scaletta parte nascosta perché nel file HTML l'elenco ha la classe `nascosto`, e nel foglio di stile quella classe ha `display: none`, che toglie l'elemento dalla pagina. Premi i due bottoni più volte. Poi cambia `toggle` in `remove` e riprova: la scaletta compare, ma non si nasconde più.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>La scaletta</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <button id="mostra">Mostra la scaletta</button>
    <ul id="scaletta" class="nascosto">
        <li>Controtempo</li>
        <li>Ultima campanella</li>
        <li>Fuori orario</li>
    </ul>
    <p>
        <button id="vota">Mi piace</button>
        <span id="voti">0</span>
    </p>
</body>
</html>
```

```codice css
body {
    font-family: sans-serif;
    margin: 20px;
}

.nascosto {
    display: none;
}
```

```codice js
const bottone = document.querySelector("#mostra");
const scaletta = document.querySelector("#scaletta");

function mostra() {
    scaletta.classList.toggle("nascosto");
}

bottone.addEventListener("click", mostra);

const voti = document.querySelector("#voti");
let quanti = 0;

function vota() {
    quanti = quanti + 1;
    voti.textContent = quanti;
}

document.querySelector("#vota").addEventListener("click", vota);
```

La variabile `quanti` è dichiarata fuori dalla funzione, ed è quindi una [variabile globale](/materiale/scuola-superiore/informatica/le-funzioni/variabili-locali-e-globali): deve esserlo, perché il conto va ricordato tra un clic e il successivo, mentre una variabile locale di `vota` ripartirebbe da capo a ogni chiamata.

```ad-warning
Le parentesi che chiamano subito la funzione
In `addEventListener("click", mostra)` il nome della funzione va senza parentesi: stai consegnando la funzione al browser, che la chiamerà lui. Scrivendo `mostra()` la funzione viene chiamata subito, una volta, mentre lo script parte, e al browser arriva il suo valore di ritorno, che non è una funzione. La scaletta compare da sola, e il bottone non fa niente.
```

## Creare un elemento

Uno script può anche aggiungere all'albero nodi che nel file HTML non ci sono. Servono tre passi: `document.createElement("li")` crea un nodo nuovo, ancora staccato dall'albero e quindi invisibile; gli si dà un testo, o una classe; `append` lo attacca in fondo a un nodo che nell'albero c'è già, e solo allora compare nella pagina.

Nella pagina qui sotto ogni clic aggiunge un brano alla scaletta. Il `+` tra una stringa e un numero li attacca, e così il testo cambia a ogni clic. Prova a togliere l'ultima riga della funzione: i nodi vengono creati lo stesso, ma nessuno li vede.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>La scaletta</title>
    <script src="script.js" defer></script>
</head>
<body>
    <h1>La scaletta</h1>
    <ul id="scaletta">
        <li>Controtempo</li>
        <li>Fuori orario</li>
    </ul>
    <button id="bis">Chiedi un bis</button>
</body>
</html>
```

```codice js
const scaletta = document.querySelector("#scaletta");
let bis = 0;

function aggiungi() {
    bis = bis + 1;
    const voce = document.createElement("li");
    voce.textContent = "Bis numero " + bis;
    scaletta.append(voce);
}

document.querySelector("#bis").addEventListener("click", aggiungi);
```

## Prova tu

In ognuno dei tre esercizi la pagina è già scritta: lavori solo su `script.js`. "Verifica" carica la tua pagina, preme i bottoni al posto tuo e guarda che cosa è cambiato.

Quando i biglietti finiscono, chi gestisce il sito preme il bottone "Chiudi le vendite". Al clic il paragrafo con `id="stato"` deve dire "Biglietti esauriti" e ricevere la classe `esaurito`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Biglietti</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>
    <p id="stato">Biglietti disponibili</p>
    <button id="chiudi">Chiudi le vendite</button>
</body>
</html>
%% controllo Prima del clic la pagina dice ancora "Biglietti disponibili"
#stato | testo = Biglietti disponibili
#stato | senza classe esaurito
%% controllo Dopo il clic il testo dice "Biglietti esauriti"
> clic #chiudi
#stato | testo = Biglietti esauriti
%% controllo Dopo il clic il paragrafo ha la classe esaurito
> clic #chiudi
#stato | classe esaurito
```

```codice css
.esaurito {
    color: crimson;
    font-weight: bold;
}
```

```codice js
const stato = document.querySelector("#stato");
// scrivi qui la funzione e registrala sul bottone
%% soluzione
const stato = document.querySelector("#stato");

function chiudi() {
    stato.textContent = "Biglietti esauriti";
    stato.classList.add("esaurito");
}

document.querySelector("#chiudi").addEventListener("click", chiudi);
```

Chi si iscrive al concerto sceglie quanti biglietti vuole con due bottoni. Il bottone `#piu` ne aggiunge uno, ma non oltre 4; il bottone `#meno` ne toglie uno, ma non sotto 0. Il numero si legge nell'elemento con `id="quanti"`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Biglietti</title>
    <script src="script.js" defer></script>
</head>
<body>
    <p>Biglietti: <span id="quanti">0</span></p>
    <button id="meno">Uno in meno</button>
    <button id="piu">Uno in più</button>
</body>
</html>
%% controllo Dopo due clic su "Uno in più" i biglietti sono 2
> clic #piu
> clic #piu
#quanti | testo = 2
%% controllo Tre in più e uno in meno fanno 2
> clic #piu
> clic #piu
> clic #piu
> clic #meno
#quanti | testo = 2
%% controllo Non si va oltre 4
> clic #piu
> clic #piu
> clic #piu
> clic #piu
> clic #piu
> clic #piu
#quanti | testo = 4
%% controllo Non si scende sotto 0: uno in meno e poi uno in più fanno 1
> clic #meno
> clic #piu
#quanti | testo = 1
```

```codice js
const quanti = document.querySelector("#quanti");
let n = 0;
// scrivi qui le due funzioni e registrale sui bottoni
%% soluzione
const quanti = document.querySelector("#quanti");
let n = 0;

function aggiungi() {
    if (n < 4) {
        n = n + 1;
    }
    quanti.textContent = n;
}

function togli() {
    if (n > 0) {
        n = n - 1;
    }
    quanti.textContent = n;
}

document.querySelector("#piu").addEventListener("click", aggiungi);
document.querySelector("#meno").addEventListener("click", togli);
```

L'elenco di chi suona è vuoto. A ogni clic sul bottone `#entra` deve entrare in elenco il prossimo componente del gruppo, nell'ordine del vettore `nomi`; quando sono entrati tutti e quattro, altri clic non aggiungono niente.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Sul palco</title>
    <script src="script.js" defer></script>
</head>
<body>
    <h1>Sul palco</h1>
    <ul id="palco"></ul>
    <button id="entra">Entra il prossimo</button>
</body>
</html>
%% controllo Dopo un clic c'è Sara
> clic #entra
#palco li | quanti = 1
#palco li | testo = Sara
%% controllo Dopo quattro clic l'ultimo è Dario
> clic #entra
> clic #entra
> clic #entra
> clic #entra
#palco li | quanti = 4
#palco li:last-child | testo = Dario
%% controllo Dopo sei clic sono ancora in quattro
> clic #entra
> clic #entra
> clic #entra
> clic #entra
> clic #entra
> clic #entra
#palco li | quanti = 4
```

```codice js
const nomi = ["Sara", "Leo", "Marta", "Dario"];
const palco = document.querySelector("#palco");
let entrati = 0;
// scrivi qui la funzione e registrala sul bottone
%% soluzione
const nomi = ["Sara", "Leo", "Marta", "Dario"];
const palco = document.querySelector("#palco");
let entrati = 0;

function entra() {
    if (entrati < nomi.length) {
        const voce = document.createElement("li");
        voce.textContent = nomi[entrati];
        palco.append(voce);
        entrati = entrati + 1;
    }
}

document.querySelector("#entra").addEventListener("click", entra);
```
