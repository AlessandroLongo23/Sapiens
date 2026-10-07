# I moduli

Per il concerto del 5 giugno in aula magna i posti sono contati, e i Fuori Tempo vogliono sapere prima chi viene. Le pagine costruite finora, con [elenchi e tabelle](/materiale/scuola-superiore/informatica/il-linguaggio-html/elenchi-e-tabelle), si possono solo leggere: adesso serve una pagina in cui chi legge scrive il suo nome e quanti posti vuole. Un **modulo** (in inglese form) è la parte di una pagina in cui l'utente inserisce dei dati, che il browser spedisce poi a un server.

## Il modulo, i campi e le etichette

Un modulo è fatto di quattro elementi:

- `<form>` racchiude tutto il modulo. I suoi attributi dicono dove e come spedire i dati: `action` è l'indirizzo a cui mandarli, `method` il modo, che trovi più sotto.
- `<input>` è un **campo**, cioè una casella in cui inserire un dato. È un elemento vuoto, senza tag di chiusura, e il suo attributo `type` dice che dato aspetta.
- `<label>` è l'**etichetta** del campo, il testo che dice che cosa scriverci. Si lega al campo con l'attributo `for`, che ripete l'`id` del campo.
- `<button type="submit">` è il bottone che invia il modulo.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Iscrizione al concerto</title>
</head>
<body>
    <h1>Concerto del 5 giugno</h1>
    <form action="/iscrizione" method="post">
        <p>
            <label for="nome">Nome</label>
            <input type="text" id="nome" name="nome">
        </p>
        <p>
            <label for="email">Email</label>
            <input type="email" id="email" name="email">
        </p>
        <p>
            <button type="submit">Iscrivimi</button>
        </p>
    </form>
</body>
</html>
```

Nella pagina fai clic sulla parola "Email": il cursore entra nel campo accanto. È l'effetto del legame tra `for` e `id`, comodo su un telefono, dove un campo è piccolo da toccare, e necessario a chi usa un lettore di schermo, che legge l'etichetta quando si entra nel campo. Cancella `for="email"` e riprova: il clic sull'etichetta non fa più niente.

Poi scrivi un nome e un'email e premi "Iscrivimi": la pagina resta dov'è, perché dietro questa anteprima non c'è un server che aspetta i dati, e la riga che compare sotto dice che cosa sarebbe partito, con quale metodo e verso quale indirizzo. Come sono fatti quei dati lo vedi tra poco.

```ad-warning
Il testo d'esempio non è un'etichetta
L'attributo `placeholder="Mario Rossi"` scrive in grigio dentro il campo un esempio, che sparisce al primo carattere digitato. Chi lo usa al posto di `<label>` lascia l'utente, a metà modulo, senza sapere che cosa stava compilando.
```

## I tipi di campo

L'attributo `type` di `<input>` cambia quello che il browser lascia inserire e come lo mostra.

| `type` | Che cosa si inserisce | Che cosa fa di solito il browser |
|---|---|---|
| `text` | una riga di testo | niente di particolare |
| `email` | un indirizzo email | controlla che ci sia la chiocciola |
| `number` | un numero | rifiuta le lettere |
| `date` | una data | apre un calendario |
| `password` | una password | nasconde i caratteri |
| `checkbox` | un sì o un no | mostra una casella da spuntare |
| `radio` | una scelta tra poche | mostra un pallino per ogni scelta |

Due elementi coprono i casi che `<input>` non copre. `<select>` è un menu a tendina, per una scelta tra tante: ogni voce è un `<option>`. `<textarea>` è un campo di testo di più righe, e a differenza di `<input>` ha il tag di chiusura.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Iscrizione al concerto</title>
</head>
<body>
    <form action="/iscrizione" method="post">
        <p>
            <label for="posti">Quanti posti</label>
            <input type="number" id="posti" name="posti" value="1">
        </p>
        <p>
            <label for="concerto">Concerto</label>
            <select id="concerto" name="concerto">
                <option value="maggio">3 maggio, Aula magna</option>
                <option value="giugno">5 giugno, Aula magna</option>
            </select>
        </p>
        <p>
            <input type="radio" id="studente" name="chi" value="studente">
            <label for="studente">Sono uno studente</label>
            <input type="radio" id="ospite" name="chi" value="ospite">
            <label for="ospite">Sono un ospite</label>
        </p>
        <p>
            <input type="checkbox" id="notizie" name="notizie" value="si">
            <label for="notizie">Voglio le notizie del gruppo</label>
        </p>
        <p>
            <label for="note">Note</label>
            <textarea id="note" name="note"></textarea>
        </p>
        <p>
            <button type="submit">Iscrivimi</button>
        </p>
    </form>
</body>
</html>
```

Scegli "Sono uno studente" e poi "Sono un ospite": il primo pallino si spegne. I due `<input>` formano un gruppo perché hanno lo stesso `name`, e in un gruppo ne resta acceso uno solo. Cambia `name="chi"` in `name="altro"` nel secondo e riprova: adesso restano accesi tutti e due, e la domanda "chi sei?" ha due risposte. Prova anche a scrivere una parola nel campo dei posti, e a cambiare `value="1"` in `value="2"`: su un campo in cui si scrive, `value` è il valore di partenza.

## Che cosa viene inviato

Quando premi il bottone, il browser passa in rassegna i campi e per ciascuno prepara una coppia: il `name` del campo e il valore che contiene, come `nome=Anna`. Al server arrivano le coppie, e il programma che le riceve riconosce ogni dato dal suo nome. L'`id` serve dentro la pagina, per legare l'etichetta; il `name` serve fuori, per il server. Le regole sono poche:

- un campo senza `name` non viene inviato, qualunque cosa ci sia scritto;
- una casella non spuntata non viene inviata; spuntata, manda il suo `value`;
- di un gruppo di pallini parte solo quello acceso, con il suo `value`;
- di un `<select>` parte il `value` dell'opzione scelta, non il testo che si legge nel menu.

Nel modulo della figura c'è un dato che il gruppo non riceverà mai, anche se chi si iscrive lo scrive. Compila i campi, spunta la casella e guarda quali coppie partono; poi passa da `get` a `post` e guarda dove vanno a finire.

```interattivo
% nome: inf-html-modulo-inviato
% alt: Un modulo di iscrizione con i campi Nome, Email e Classe, una casella per ricevere le notizie e la scelta tra i metodi get e post. Accanto, per ogni campo, la coppia di nome e valore che il browser invierebbe: il campo Classe non parte perché non ha l'attributo name, la casella parte solo quando è spuntata. Sotto c'è la richiesta: con get le coppie sono nell'indirizzo dopo il punto interrogativo, con post l'indirizzo resta /iscrizione e le coppie sono nel corpo della richiesta
```

Il dato perso è la classe: il campo ha la sua etichetta e si compila come gli altri, ma senza `name` il browser non sa con che nome spedirlo e lo lascia a terra. Nessun messaggio avvisa dell'errore, né chi scrive la pagina né chi la compila: se ne accorge il gruppo, quando legge le iscrizioni.

```ad-warning
Il for ripete l'id, il server legge il name
`for` cerca un campo con quell'`id`, e ignora il `name`. Spesso i due sono uguali, come in `id="email" name="email"`, e proprio per questo si finisce per scriverne uno solo: senza `id` l'etichetta non è legata, senza `name` il dato non parte.
```

## GET e POST

L'attributo `method` del modulo sceglie tra le due richieste del [protocollo HTTP](/materiale/scuola-superiore/informatica/internet-e-il-web/il-web-ipertesti-url-e-protocollo-http).

Con `method="get"` il browser attacca le coppie all'indirizzo di `action`, dopo un punto interrogativo e separate da `&`: chiede `/iscrizione?nome=Anna&posti=2`. I dati si leggono nella barra degli indirizzi, restano nella cronologia e finiscono in un link che si può copiare. È il metodo giusto per chiedere qualcosa, come in una ricerca.

Con `method="post"` l'indirizzo resta `/iscrizione`, e le coppie viaggiano nel corpo della richiesta, la parte che segue l'indirizzo e che nella barra non si vede. È il metodo giusto per consegnare qualcosa che il server deve registrare: un'iscrizione, un messaggio, e sempre una password.

Nella figura l'email è scritta `anna%40esempio.it`. In un indirizzo alcuni caratteri hanno già un compito, quindi il browser li riscrive: la chiocciola diventa `%40`, uno spazio diventa `+`. Il server li rimette a posto.

```ad-warning
Un modulo senza method usa get
Se dimentichi `method`, il browser sceglie `get`: in un modulo con una password, la password finisce scritta nell'indirizzo e nella cronologia. E `post` da solo non la protegge lungo la strada: per quello serve che la pagina sia in `https`.
```

## I controlli del browser

Alcuni attributi chiedono al browser di controllare i dati prima di spedirli:

- `required` rende il campo obbligatorio; si scrive da solo, senza valore;
- `min` e `max` fissano il più piccolo e il più grande valore accettato da un campo `number` o `date`;
- `minlength` e `maxlength` fissano quanti caratteri può avere un testo;
- lo stesso `type` è un controllo: un campo `email` non accetta un testo senza chiocciola.

Un campo senza `required` può restare vuoto anche se ha altri controlli: quelli valgono solo per quello che viene scritto.

Se un controllo fallisce, il browser non invia il modulo e mostra un messaggio accanto al primo campo sbagliato. Nella pagina qui sotto il foglio di stile della seconda linguetta fa vedere gli altri: colora di rosso il bordo di tutti i campi che in quel momento il browser rifiuterebbe.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Iscrizione al concerto</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <form action="/iscrizione" method="post">
        <p>
            <label for="nome">Nome</label>
            <input type="text" id="nome" name="nome" required>
        </p>
        <p>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </p>
        <p>
            <label for="posti">Posti (da 1 a 4)</label>
            <input type="number" id="posti" name="posti" min="1" max="4" value="1">
        </p>
        <p>
            <button type="submit">Iscrivimi</button>
        </p>
    </form>
</body>
</html>
```

```codice css
input:invalid { border: 2px solid red; }
```

All'inizio nome ed email sono rossi, perché sono obbligatori e vuoti. Premi subito "Iscrivimi": il modulo non parte, e il messaggio del browser compare accanto al nome, il primo campo che non va. Scrivi il nome: il bordo torna normale alla prima lettera. Scrivi `anna` nell'email: resta rossa finché non aggiungi la chiocciola e qualcosa dopo. Scrivi 5 nel campo dei posti: il bordo diventa rosso. Poi nel codice cambia `max="4"` in `max="6"` e riprova: adesso 5 è accettato. Quando nessun campo è più rosso premi di nuovo il bottone: solo adesso sotto la pagina compare la riga con i dati inviati.

```ad-warning
Il controllo del browser non basta
Questi attributi evitano a chi compila gli errori di distrazione, ma non proteggono il server: chiunque può toglierli dalla pagina, o spedire i dati senza passare dal modulo. Il programma che li riceve deve controllarli di nuovo. E per i controlli che l'HTML non sa fare, come due campi che devono essere uguali, serve [JavaScript](/materiale/scuola-superiore/informatica/pagine-web-interattive/controllare-i-dati-di-un-modulo).
```

## Prova tu

Al modulo qui sotto manca il campo per l'email: aggiungi un'etichetta "Email" legata a un campo di tipo `email`, con `id` e `name` uguali a `email`. Poi guarda il campo del nome: così com'è non verrebbe inviato. Sistemalo, con il nome `nome`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Lista d'attesa</title>
</head>
<body>
    <form action="/attesa" method="post">
        <p>
            <label for="nome">Nome</label>
            <input type="text" id="nome">
        </p>
        <p>
            <button type="submit">Avvisami</button>
        </p>
    </form>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Lista d'attesa</title>
</head>
<body>
    <form action="/attesa" method="post">
        <p>
            <label for="nome">Nome</label>
            <input type="text" id="nome" name="nome">
        </p>
        <p>
            <label for="email">Email</label>
            <input type="email" id="email" name="email">
        </p>
        <p>
            <button type="submit">Avvisami</button>
        </p>
    </form>
</body>
</html>
%% controllo C'è un campo di tipo email, con il name "email"
input#email | attributo type = email
input#email | attributo name = email
%% controllo L'etichetta "Email" è legata al suo campo
label[for="email"] | testo = Email
%% controllo Il campo del nome ha il name "nome"
input#nome | attributo name = nome
%% controllo Con un'email senza chiocciola il modulo non parte
> scrivi #nome | Anna
> scrivi #email | anna
> invia form
input#email | attributo type = email
form | non inviato
```

Il modulo per prenotare i posti ha tre difetti: il nome può restare vuoto, i posti possono essere 0 oppure 50, e i due pallini si possono accendere insieme. Rendi obbligatorio il nome, limita i posti tra 1 e 4, e dai ai due pallini lo stesso `name`, `chi`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Prenota i posti</title>
</head>
<body>
    <form action="/prenota" method="post">
        <p>
            <label for="nome">Nome</label>
            <input type="text" id="nome" name="nome">
        </p>
        <p>
            <label for="posti">Posti</label>
            <input type="number" id="posti" name="posti" value="1">
        </p>
        <p>
            <input type="radio" id="studente" name="studente" value="studente">
            <label for="studente">Studente</label>
            <input type="radio" id="ospite" name="ospite" value="ospite">
            <label for="ospite">Ospite</label>
        </p>
        <p>
            <button type="submit">Prenota</button>
        </p>
    </form>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Prenota i posti</title>
</head>
<body>
    <form action="/prenota" method="post">
        <p>
            <label for="nome">Nome</label>
            <input type="text" id="nome" name="nome" required>
        </p>
        <p>
            <label for="posti">Posti</label>
            <input type="number" id="posti" name="posti" min="1" max="4" value="1">
        </p>
        <p>
            <input type="radio" id="studente" name="chi" value="studente">
            <label for="studente">Studente</label>
            <input type="radio" id="ospite" name="chi" value="ospite">
            <label for="ospite">Ospite</label>
        </p>
        <p>
            <button type="submit">Prenota</button>
        </p>
    </form>
</body>
</html>
%% controllo Il nome è obbligatorio: vuoto, il modulo non parte
> scrivi #nome |
> invia form
#nome | attributo required
form | non inviato
%% controllo I posti vanno da 1 a 4: con 9 il modulo non parte
> scrivi #nome | Anna
> scrivi #posti | 9
> invia form
#posti | attributo min = 1
#posti | attributo max = 4
form | non inviato
%% controllo Acceso "Ospite", "Studente" si spegne
> spunta #studente
> spunta #ospite
input[type="radio"][name="chi"] | quanti = 2
#studente | non spuntato
%% controllo Con Anna e 2 posti il modulo parte
> scrivi #nome | Anna
> scrivi #posti | 2
> invia form
form | inviato
```
