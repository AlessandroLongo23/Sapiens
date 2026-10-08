# Gli script nella pagina web

La pagina del concerto di beneficenza dei Fuori Tempo, il gruppo musicale della scuola, dice "Posti liberi: 33". Quel numero è stato scritto a mano nel file HTML, ed è sbagliato dal momento in cui qualcuno compra un altro biglietto. L'HTML dice che cosa c'è nella pagina e il CSS che aspetto ha, ma nessuno dei due sa fare un conto, prendere una decisione o accorgersi di un clic. Per questo una pagina web ha un terzo linguaggio, che è un linguaggio di programmazione.

## Che cos'è uno script e dove gira

Uno **script** è un programma che fa parte di una pagina web e che il browser esegue quando apre la pagina. Il linguaggio in cui è scritto si chiama **JavaScript**, ed è il linguaggio di programmazione che ogni browser sa eseguire.

Lo script sta in un file di testo con estensione `.js`, che il browser chiede al server come chiede il foglio di stile e le immagini, con una [richiesta HTTP](/materiale/scuola-superiore/informatica/internet-e-il-web/il-web-ipertesti-url-e-protocollo-http) per ogni file. Una volta arrivato, però, il programma non gira sul server: lo esegue il browser, sul tuo dispositivo. Nel [modello client-server](/materiale/scuola-superiore/informatica/internet-e-il-web/il-modello-client-server) il browser è il client, e per questo si parla di script lato client.

Da qui vengono tre conseguenze. Lo script risponde subito, perché per fare un conto o cambiare una scritta non deve aspettare la rete. Chiunque apra la pagina può leggerlo, perché il file arriva sul suo computer: in uno script non si scrive niente di segreto. E il browser lo tiene chiuso dentro la pagina: uno script non può leggere i file del tuo disco né guardare le altre schede aperte.

```ad-note
JavaScript non è Java
Java è un altro linguaggio, che con le pagine web non ha a che fare. I due nomi si somigliano per una scelta commerciale degli anni in cui sono nati, e niente di più.
```

## Collegare lo script alla pagina

Lo script si collega dalla `head`, con un elemento `script` che porta il nome del file nell'attributo `src`. Il tag di chiusura ci vuole sempre, anche se tra i due tag non c'è niente.

Nella pagina qui sotto i posti liberi non sono più scritti a mano: li calcola lo script. Apri la linguetta `script.js` e leggilo: le prime tre righe fanno il conto, la successiva lo scrive nella console (la zona sotto la pagina, che per ora puoi pensare come lo schermo dei programmi che hai scritto finora), l'ultima cerca nella pagina l'elemento con `id="liberi"` e ci mette dentro il risultato. Di quest'ultima riga si occupa per intero la lezione sul [DOM](/materiale/scuola-superiore/informatica/pagine-web-interattive/il-dom-e-gli-eventi). Premi "Esegui", poi porta `venduti` a 100 ed esegui di nuovo: la pagina cambia senza che tu abbia toccato l'HTML.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Concerto di beneficenza, in palestra.</p>
    <p>Posti liberi: <span id="liberi">?</span></p>
</body>
</html>
```

```codice css
body {
    font-family: sans-serif;
    margin: 20px;
}

#liberi {
    font-weight: bold;
    color: teal;
}
```

```codice js
const posti = 120;
let venduti = 87;
const liberi = posti - venduti;

console.log("Posti liberi:", liberi);
document.querySelector("#liberi").textContent = liberi;
```

Ora togli la parola `defer` dal tag `script` ed esegui. Nella pagina resta il punto interrogativo, e nella console compare un errore. Che cosa è andato storto lo mostra la figura: scegli dove sta il tag, vai avanti un passo alla volta e guarda che cosa esiste già nella pagina nel momento in cui lo script parte.

```interattivo
% nome: inf-script-ordine-lettura
% alt: A sinistra le righe del file HTML di una pagina, con un segno sulla riga che il browser sta leggendo; a destra gli elementi che il browser ha già costruito e lo stato dello script. Tre bottoni scelgono dove sta il tag script: nella head, nella head con defer, in fondo al body. Andando avanti un passo alla volta si vede che lo script nella head senza defer parte quando l'elemento con id liberi non esiste ancora, e la sua ricerca dà null; con defer, o in fondo al body, parte quando il paragrafo c'è già.
```

Il browser legge il file HTML dall'alto verso il basso e costruisce gli elementi man mano che li incontra. Quando arriva a un tag `script` senza `defer` si ferma, esegue lo script fino in fondo, e solo dopo riprende a leggere. In quel momento il `body` non è ancora stato letto: lo script cerca un elemento che non c'è. L'attributo `defer` ("rimanda") dice al browser di continuare a leggere e di eseguire lo script quando la pagina è stata costruita tutta. Lo stesso risultato si ottiene mettendo il tag `script` in fondo al `body`, come ultima cosa prima di `</body>`: in queste lezioni usiamo sempre `defer` nella `head`.

```ad-warning
Lo script che gira prima che la pagina esista
Se la console dà un errore che parla di `null`, come `Cannot set properties of null`, e l'elemento nella pagina c'è, guarda il tag `script`: senza `defer` nella `head` lo script parte quando il `body` non è ancora stato letto, e ogni ricerca di un elemento dà `null`, cioè "niente".
```

## Un linguaggio nuovo per cose che sai già

JavaScript ha variabili, selezione, cicli e funzioni come Python e come il C++: cambia il modo di scriverli. Il programma qui sotto non ha una pagina intorno. Legge con `prompt()`, che fa una domanda e restituisce quello che viene scritto, e scrive con `console.log()`. Eseguilo con 2 interi e 3 ridotti.

```codice javascript
const interi = Number(prompt("Biglietti interi?"));
const ridotti = Number(prompt("Biglietti ridotti?"));

const persone = interi + ridotti;
let totale = 8 * interi + 5 * ridotti;
if (persone >= 5) {
    totale = totale - 4;
}

console.log("Persone:", persone);
console.log("Totale:", totale, "euro");
```

Una variabile si dichiara con `let` la prima volta che compare, senza dirne il tipo. Se il valore non cambierà più si usa `const`, e un assegnamento successivo è un errore: è il modo di dire a chi legge, e al browser, che quel nome vale sempre la stessa cosa. La selezione ha la condizione tra parentesi tonde e il blocco tra graffe, ogni istruzione finisce con il punto e virgola: come nel C++. I tipi però appartengono ai valori e non alle variabili, come in Python.

```ad-warning
Quello che arriva da prompt() è un testo
`prompt()` restituisce sempre una stringa, anche quando chi risponde scrive delle cifre, e tra due stringhe `+` vuol dire attaccare: `"2" + "3"` fa `"23"`. Togli i due `Number(...)` dal programma e rieseguilo con 2 e 3: le persone diventano 23. `Number()` trasforma il testo in un numero, come `int()` in Python.
```

Gli operatori logici sono quelli del C++: `&&`, `||` e `!`, dove Python scrive `and`, `or` e `not`. Anche i commenti sono quelli del C++, e cominciano con `//`. Cambia invece il confronto di uguaglianza.

```ad-warning
Tre segni di uguale
In JavaScript il confronto si scrive `===`. Esiste anche `==`, che prima di confrontare converte i valori e dà risposte sorprendenti: `"5" == 5` è vero, `"5" === 5` è falso. Usa sempre `===` e `!==`. Un solo `=`, come negli altri linguaggi, è l'assegnamento.
```

Il resto si capisce meglio con le tre forme una accanto all'altra. Nella figura scegli il ciclo `for`, poi la funzione, e cerca che cosa cambia tra la forma che conosci e quella di JavaScript.

```interattivo
% nome: inf-js-costrutti-confronto
% alt: Una fila di bottoni sceglie un costrutto: variabile, leggere e scrivere, confronti, selezione, ciclo while, ciclo for, funzione, vettore. Sotto, lo stesso frammento è scritto in tre riquadri affiancati, in Python, in C++ e in JavaScript, e una frase dice che cosa cambia nella forma di JavaScript. Per il ciclo for, JavaScript ha la forma del C++ con let al posto di int; per la funzione usa la parola function, senza tipi per i parametri e per il valore di ritorno.
```

Il ciclo `for` è quello del C++, con `let` dove il C++ scrive `int`; il `while` è identico. Una [funzione](/materiale/scuola-superiore/informatica/le-funzioni/parametri-e-valore-di-ritorno) si definisce con la parola `function`, senza scrivere il tipo dei parametri né quello del valore di ritorno, e si chiama come sempre. Un [vettore](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/i-vettori) si scrive tra parentesi quadre, come una lista di Python, e il numero dei suoi elementi è `v.length`.

Il programma che segue stampa il listino dei biglietti interi: cambia il 4 del ciclo e i prezzi dentro la funzione, e prevedi che cosa scriverà prima di eseguirlo.

```codice javascript
function costo(interi, ridotti) {
    return 8 * interi + 5 * ridotti;
}

for (let i = 1; i <= 4; i++) {
    console.log(i, "interi:", costo(i, 0), "euro");
}
console.log("Famiglia:", costo(2, 2), "euro");
```

## La console

La **console** è il posto dove uno script scrive con `console.log()` e dove il browser segnala gli errori dello script. Chi visita la pagina non la vede: in un browser si apre dagli strumenti per sviluppatori, di solito con il tasto F12 o con la voce "Ispeziona" del menu. Qui è la zona sotto la pagina.

Serve perché una pagina con uno script sbagliato non dice niente: resta ferma. Quando lo script incontra un [errore](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/errori-e-debug) si interrompe in quel punto, le righe successive non vengono eseguite e la pagina rimane com'era. Torna alla prima pagina della lezione, scrivi `venduto` al posto di `venduti` nella terza riga ed esegui: la pagina mostra ancora il punto interrogativo, e la console dice `ReferenceError: venduto is not defined`, con il nome del file e il numero della riga. Quando una pagina non fa quello che ti aspetti, la console è il primo posto dove guardare, e un `console.log()` messo nel punto giusto ti dice quanto vale una variabile in quel momento.

## Prova tu

Il primo programma legge il numero di biglietti comprati, che costano 8 euro l'uno. Chi ne compra almeno 5 ha uno sconto di 10 euro sul totale. Scrivi il totale da pagare.

```codice javascript
const biglietti = Number(prompt("Quanti biglietti?"));
// scrivi qui
%% soluzione
const biglietti = Number(prompt("Quanti biglietti?"));
let totale = 8 * biglietti;
if (biglietti >= 5) {
    totale = totale - 10;
}
console.log(totale);
%% prova
3
%% stampa
24
%% prova
5
%% stampa
30
%% prova
12
%% stampa
86
```

In palestra le sedie sono in file da 12. Il programma legge il numero di spettatori: scrivi una funzione `file(spettatori)` che restituisce quante file servono per farli sedere tutti, contandole con un ciclo, poi chiamala e scrivi il risultato.

```codice javascript
const spettatori = Number(prompt("Quanti spettatori?"));
// scrivi qui la funzione e la chiamata
%% soluzione
function file(spettatori) {
    let quante = 0;
    while (quante * 12 < spettatori) {
        quante = quante + 1;
    }
    return quante;
}

const spettatori = Number(prompt("Quanti spettatori?"));
console.log(file(spettatori));
%% prova
30
%% stampa
3
%% prova
12
%% stampa
1
%% prova
121
%% stampa
11
%% prova
0
%% stampa
0
```

In questa pagina lo script c'è, ma non fa niente: è collegato male e gli manca il conto. La palestra ha 8 file da 15 posti e i biglietti venduti sono 87. Sistema il tag `script`, poi nello script calcola i posti liberi e mettili nell'elemento con `id="liberi"`, come nella prima pagina della lezione.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
    <script src="script.js"></script>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Posti liberi: <span id="liberi">?</span></p>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
    <script src="script.js" defer></script>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Posti liberi: <span id="liberi">?</span></p>
</body>
</html>
%% controllo I posti liberi sono 33
#liberi | testo = 33
```

```codice js
const file = 8;
const venduti = 87;
// scrivi qui

document.querySelector("#liberi").textContent = "?";
%% soluzione
const file = 8;
const venduti = 87;
const liberi = file * 15 - venduti;

document.querySelector("#liberi").textContent = liberi;
```
