# Controllare i dati di un modulo

Per il concerto di beneficenza dei Fuori Tempo ci si iscrive con un [modulo](/materiale/scuola-superiore/informatica/il-linguaggio-html/i-moduli): nome, email, numero di biglietti. Prima o poi qualcuno lascerà il nome vuoto, scriverà l'email senza chiocciola o chiederà quaranta biglietti. Controllare i dati di un modulo, in inglese validation, vuol dire verificare che quello che è stato scritto abbia senso prima che parta, e dire subito a chi compila che cosa deve correggere, accanto al campo sbagliato.

## Leggere quello che è stato scritto

Un campo di un modulo è un nodo del [DOM](/materiale/scuola-superiore/informatica/pagine-web-interattive/il-dom-e-gli-eventi) come gli altri, e si seleziona con `querySelector`. Quello che contiene in questo momento sta nella sua proprietà `value`. Per una casella da spuntare la proprietà è `checked`, che vale `true` o `false`.

`value` è sempre una [stringa](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/le-stringhe), anche in un campo `type="number"`. Su una stringa servono tre cose: `trim()` restituisce il testo senza gli spazi all'inizio e alla fine, `length` è il numero dei suoi caratteri, e `Number(...)` la trasforma in un numero con cui fare i conti.

Nella pagina qui sotto niente viene inviato: lo script ascolta l'evento `input`, che nasce a ogni carattere scritto in un campo, e ricopia sotto il modulo quello che legge. Scrivi il tuo nome con qualche spazio davanti e guarda nella console quante lettere conta; poi togli `.trim()` e riprova.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Iscrizione</title>
    <script src="script.js" defer></script>
</head>
<body>
    <h1>Iscrizione al concerto</h1>
    <form id="iscrizione">
        <p>
            <label for="nome">Nome</label>
            <input id="nome" name="nome">
        </p>
        <p>
            <label for="biglietti">Biglietti</label>
            <input id="biglietti" name="biglietti" type="number" value="1">
        </p>
    </form>
    <p id="riepilogo"></p>
</body>
</html>
```

```codice js
const nome = document.querySelector("#nome");
const biglietti = document.querySelector("#biglietti");
const riepilogo = document.querySelector("#riepilogo");

function aggiorna() {
    const testo = nome.value.trim();
    const quanti = Number(biglietti.value);
    console.log("nome:", testo, "lettere:", testo.length);
    riepilogo.textContent = testo + ": " + quanti * 8 + " euro";
}

nome.addEventListener("input", aggiorna);
biglietti.addEventListener("input", aggiorna);
```

## I controlli

Un controllo è una condizione sul valore letto, e quasi tutti rientrano in quattro tipi.

| Controllo | Condizione dell'errore |
|---|---|
| Vuoto: non è stato scritto niente | `testo === ""` |
| Lunghezza: troppo corto, o troppo lungo | `testo.length < 2` |
| Forma: non è fatto come deve | `!testo.includes("@")` |
| Due campi uguali: la conferma è diversa | `conferma !== testo` |

`includes("@")` è una funzione delle stringhe: dice se il testo contiene quello tra parentesi. Per un numero la forma è un intervallo: `n < 1 || n > 4`. Con `Number.isInteger(n)` si chiede anche che sia un numero intero, e così si scartano `2.5` e quello che non è un numero. Il campo lasciato vuoto ha bisogno dell'intervallo: per `Number` vale 0, che è un intero, e a fermarlo è `n < 1`.

I controlli si fanno in ordine, dal più grossolano al più fine, e sul valore già passato da `trim()`. Segui nella figura il percorso di un nome: scegli "tre spazi" e vai avanti un passo alla volta, guardando quale controllo ferma il dato; poi scrivi nel campo un nome di una lettera, e infine uno giusto.

```interattivo
% nome: inf-modulo-percorso-dato
% alt: In alto il campo Nome di un modulo, con quattro bottoni che ci scrivono un valore di prova: vuoto, tre spazi, una lettera, Anna. Sotto, le tappe che il dato attraversa quando si preme Iscriviti: il valore letto dal campo, carattere per carattere con gli spazi in evidenza; il valore dopo trim; il controllo sul vuoto; il controllo sulla lunghezza; l'esito. Andando avanti un passo alla volta si accende una tappa per volta. Con tre spazi il dato si ferma al controllo sul vuoto, accanto al campo compare il messaggio Scrivi il tuo nome e l'invio è fermato; con una lettera si ferma al controllo sulla lunghezza; con Anna passa tutti i controlli e il modulo parte.
```

Tre spazi si fermano al primo controllo, quello sul vuoto: dopo `trim()` del valore non resta niente. Senza `trim()` sarebbero passati come un nome di tre caratteri. Una lettera sola supera il primo controllo e si ferma al secondo. Il percorso finisce sempre in uno di due modi: un messaggio accanto al campo e l'invio fermato, oppure nessun messaggio e il modulo che parte.

```ad-warning
Confrontare i campi invece dei valori
`conferma !== email` confronta due nodi del DOM, che sono sempre due oggetti diversi: la condizione è sempre vera e il messaggio compare anche quando le due email sono uguali. Si confronta quello che c'è scritto dentro: `conferma.value !== email.value`.
```

## Mostrare il messaggio accanto al campo

Un `alert()` che elenca gli errori costringe chi compila a ricordarseli dopo aver chiuso la finestra. Il messaggio va dove serve: subito dopo ogni campo l'HTML ha un elemento vuoto, per esempio `<span class="errore" id="errore-nome"></span>`, e lo script ci scrive dentro con `textContent`. Quando il campo è a posto ci scrive la stringa vuota, altrimenti il messaggio di prima resterebbe lì anche dopo la correzione.

Un buon messaggio dice che cosa fare: "Scrivi il tuo nome" aiuta, "Errore" o "Campo non valido" no. E non deve reggersi solo sul colore rosso, che non tutti distinguono: è una delle attenzioni di una [pagina accessibile](/materiale/scuola-superiore/informatica/i-fogli-di-stile/pagine-responsive-e-accessibili).

## Impedire l'invio

Quando si preme il bottone del modulo, o il tasto Invio dentro un campo, sul nodo `form` nasce l'evento `submit`, e subito dopo il browser spedisce i dati. L'ascoltatore di `submit` è quindi l'ultimo momento utile per i controlli. Si ascolta il modulo e non il clic sul bottone, perché un modulo si invia anche dalla tastiera.

Il browser passa a ogni ascoltatore un oggetto che descrive l'evento: per riceverlo si dà alla funzione un parametro, che qui chiamiamo `event`. La sua funzione `preventDefault()` chiede al browser di non fare quello che farebbe da solo dopo l'evento, cioè in questo caso l'invio.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Iscrizione</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>
    <h1>Iscrizione al concerto</h1>
    <form id="iscrizione">
        <p>
            <label for="nome">Nome</label>
            <input id="nome" name="nome">
            <span class="errore" id="errore-nome"></span>
        </p>
        <p>
            <label for="email">Email</label>
            <input id="email" name="email">
            <span class="errore" id="errore-email"></span>
        </p>
        <p>
            <label for="conferma">Ripeti l'email</label>
            <input id="conferma" name="conferma">
            <span class="errore" id="errore-conferma"></span>
        </p>
        <button>Iscriviti</button>
    </form>
</body>
</html>
```

```codice css
body {
    font-family: sans-serif;
    margin: 20px;
}

label, .errore {
    display: block;
}

.errore {
    color: crimson;
    font-size: 14px;
}

.sbagliato {
    border: 2px solid crimson;
}
```

```codice js
const form = document.querySelector("#iscrizione");
const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const conferma = document.querySelector("#conferma");

function segnala(campo, messaggio) {
    const errore = document.querySelector("#errore-" + campo.id);
    errore.textContent = messaggio;
    if (messaggio === "") {
        campo.classList.remove("sbagliato");
    } else {
        campo.classList.add("sbagliato");
    }
    return messaggio === "";
}

function controllaNome() {
    const testo = nome.value.trim();
    if (testo === "") {
        return segnala(nome, "Scrivi il tuo nome");
    }
    if (testo.length < 2) {
        return segnala(nome, "Il nome ha almeno 2 lettere");
    }
    return segnala(nome, "");
}

function controllaEmail() {
    if (!email.value.includes("@")) {
        return segnala(email, "Nell'email manca la chiocciola");
    }
    return segnala(email, "");
}

function controllaConferma() {
    if (conferma.value.trim() !== email.value.trim()) {
        return segnala(conferma, "Le due email non sono uguali");
    }
    return segnala(conferma, "");
}

function controlla(event) {
    const nomeValido = controllaNome();
    const emailValida = controllaEmail();
    const confermaValida = controllaConferma();
    if (!(nomeValido && emailValida && confermaValida)) {
        event.preventDefault();
    }
}

form.addEventListener("submit", controlla);
nome.addEventListener("change", controllaNome);
email.addEventListener("change", controllaEmail);
conferma.addEventListener("change", controllaConferma);
```

C'è una funzione per campo, che fa i suoi controlli in ordine e restituisce vero se il campo è a posto. Tutte passano da `segnala`, che scrive il messaggio nell'elemento giusto (il suo id è `errore-` seguito dall'id del campo), mette o toglie al campo la classe `sbagliato` e restituisce vero quando il messaggio è vuoto. `controlla` le chiama tutte e tre, e ferma l'invio se anche una sola ha risposto falso.

Le ultime tre righe registrano le stesse funzioni anche sull'evento `change`, che nasce quando chi compila lascia un campo dopo averne cambiato il contenuto: il messaggio arriva appena il campo è stato scritto, senza aspettare l'invio. Scrivi una sola lettera nel nome e passa al campo successivo. Poi premi "Iscriviti" con i campi vuoti e correggi un campo alla volta. Infine cancella la riga con `preventDefault()`: i messaggi vengono scritti lo stesso, ma niente ferma più l'invio: sotto l'anteprima compare la riga con i dati inviati, e su un sito vero quei dati sbagliati partirebbero verso il server.

```ad-warning
I controlli in fila con &&
Scrivere `if (!(controllaNome() && controllaEmail() && controllaConferma()))` sembra più breve, ma al primo controllo che risponde falso gli altri non vengono nemmeno chiamati, perché il risultato di `&&` è già deciso: chi compila vede un messaggio solo, lo corregge, e al secondo tentativo ne scopre un altro. Per mostrare tutti i messaggi insieme si chiamano prima tutte le funzioni, e si combinano dopo i risultati.
```

```ad-note
I controlli dell'HTML vengono prima
Con `required`, `type="email"`, `min` e `max` il browser fa da sé i controlli più comuni, e li fa prima dell'evento `submit`: se uno fallisce mostra un suo messaggio e l'ascoltatore non viene chiamato. Lo script serve per quello che l'HTML non sa dire, come due campi che devono essere uguali, e per scegliere le parole dei messaggi. In questa lezione i campi non hanno quegli attributi, così i controlli passano dallo script. Fa eccezione `type="number"` nel campo dei biglietti: le lettere e i numeri con la virgola li rifiuta già il browser.
```

## Perché il controllo nel browser non basta

Lo script [gira sul computer di chi visita la pagina](/materiale/scuola-superiore/informatica/pagine-web-interattive/gli-script-nella-pagina-web), e chi sta a quel computer può farne quello che vuole. Può spegnere JavaScript nelle impostazioni del browser, e allora nessun ascoltatore viene chiamato. Può cambiare la pagina con gli strumenti per sviluppatori. Può anche fare a meno della pagina e mandare al [server](/materiale/scuola-superiore/informatica/internet-e-il-web/il-modello-client-server) una richiesta scritta a mano, con dentro i dati che preferisce.

Il controllo nel browser è una cortesia verso chi compila in buona fede: risponde subito, senza aspettare il viaggio fino al server e ritorno. La sicurezza sta dall'altra parte. Il programma sul server deve rifare ogni controllo sui dati che riceve prima di usarli, perché è il solo punto da cui i dati passano di sicuro. I due controlli non sono uno la copia inutile dell'altro: il primo serve a chi scrive, il secondo a chi riceve.

## Prova tu

Nei due esercizi la pagina è già scritta e lavori su `script.js`. "Verifica" compila il modulo al posto tuo, lo invia e guarda se l'invio è partito e quali messaggi ci sono.

Il modulo ha solo il nome. Se il nome, tolti gli spazi, è vuoto, ferma l'invio e scrivi "Scrivi il tuo nome" nell'elemento `#errore-nome`; altrimenti lascia vuoto il messaggio e lascia partire il modulo. Nel programma di partenza la funzione ferma l'invio sempre: tocca a te fermarlo solo quando serve.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Iscrizione</title>
    <script src="script.js" defer></script>
</head>
<body>
    <form>
        <label for="nome">Nome</label>
        <input id="nome" name="nome">
        <span id="errore-nome"></span>
        <button>Iscriviti</button>
    </form>
</body>
</html>
%% controllo Con il nome vuoto il modulo non parte e c'è il messaggio
> scrivi #nome |
> invia form
form | non inviato
#errore-nome | testo = Scrivi il tuo nome
%% controllo Con il nome scritto il modulo parte, senza messaggi
> scrivi #nome | Giada
> invia form
form | inviato
#errore-nome | testo =
%% controllo Dopo la correzione il messaggio sparisce
> invia form
> scrivi #nome | Giada
> invia form
#errore-nome | testo =
form | inviato
```

```codice js
const form = document.querySelector("form");
const nome = document.querySelector("#nome");
const errore = document.querySelector("#errore-nome");

function controlla(event) {
    event.preventDefault();
    // scrivi qui
}

form.addEventListener("submit", controlla);
%% soluzione
const form = document.querySelector("form");
const nome = document.querySelector("#nome");
const errore = document.querySelector("#errore-nome");

function controlla(event) {
    if (nome.value.trim() === "") {
        errore.textContent = "Scrivi il tuo nome";
        event.preventDefault();
    } else {
        errore.textContent = "";
    }
}

form.addEventListener("submit", controlla);
```

Ora l'email va scritta due volte, e c'è il numero dei biglietti. Se le due email, tolti gli spazi, non sono uguali, in `#errore-conferma` va "Le due email non sono uguali". I biglietti devono essere un numero intero da 1 a 4, altrimenti in `#errore-biglietti` va "Da 1 a 4 biglietti". Se sono sbagliate tutte e due le cose devono comparire tutti e due i messaggi, e il modulo parte solo quando non ce n'è nessuno. Anche qui, in partenza, l'invio è fermato sempre.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Iscrizione</title>
    <script src="script.js" defer></script>
</head>
<body>
    <form>
        <label for="email">Email</label>
        <input id="email" name="email">
        <label for="conferma">Ripeti l'email</label>
        <input id="conferma" name="conferma">
        <span id="errore-conferma"></span>
        <label for="biglietti">Biglietti</label>
        <input id="biglietti" name="biglietti" type="number">
        <span id="errore-biglietti"></span>
        <button>Iscriviti</button>
    </form>
</body>
</html>
%% controllo Tutto giusto: il modulo parte, senza messaggi
> scrivi #email | samir@scuola.example
> scrivi #conferma | samir@scuola.example
> scrivi #biglietti | 2
> invia form
form | inviato
#errore-conferma | testo =
#errore-biglietti | testo =
%% controllo Con due email diverse il modulo non parte
> scrivi #email | samir@scuola.example
> scrivi #conferma | samir@scuola.exampel
> scrivi #biglietti | 2
> invia form
form | non inviato
#errore-conferma | testo = Le due email non sono uguali
#errore-biglietti | testo =
%% controllo Sette biglietti sono troppi
> scrivi #email | samir@scuola.example
> scrivi #conferma | samir@scuola.example
> scrivi #biglietti | 7
> invia form
form | non inviato
#errore-biglietti | testo = Da 1 a 4 biglietti
%% controllo Con due errori compaiono due messaggi
> scrivi #email | samir@scuola.example
> scrivi #conferma | samir
> scrivi #biglietti |
> invia form
form | non inviato
#errore-conferma | testo = Le due email non sono uguali
#errore-biglietti | testo = Da 1 a 4 biglietti
```

```codice js
const form = document.querySelector("form");
const email = document.querySelector("#email");
const conferma = document.querySelector("#conferma");
const biglietti = document.querySelector("#biglietti");

function controlla(event) {
    event.preventDefault();
    // scrivi qui
}

form.addEventListener("submit", controlla);
%% soluzione
const form = document.querySelector("form");
const email = document.querySelector("#email");
const conferma = document.querySelector("#conferma");
const biglietti = document.querySelector("#biglietti");

function controlla(event) {
    let valido = true;
    let messaggio = "";
    if (conferma.value.trim() !== email.value.trim()) {
        messaggio = "Le due email non sono uguali";
        valido = false;
    }
    document.querySelector("#errore-conferma").textContent = messaggio;

    const n = Number(biglietti.value);
    messaggio = "";
    if (!Number.isInteger(n) || n < 1 || n > 4) {
        messaggio = "Da 1 a 4 biglietti";
        valido = false;
    }
    document.querySelector("#errore-biglietti").textContent = messaggio;

    if (!valido) {
        event.preventDefault();
    }
}

form.addEventListener("submit", controlla);
```
