# Testo, link e immagini

La pagina dei Fuori Tempo ha il suo [scheletro](/materiale/scuola-superiore/informatica/il-linguaggio-html/struttura-di-una-pagina-html), i titoli e i paragrafi, ma è ancora un foglio da leggere dall'alto in basso: nessuna parola pesa più delle altre, non c'è niente su cui fare clic e niente da guardare. Mancano le tre cose che fanno di un testo una pagina del [web](/materiale/scuola-superiore/informatica/internet-e-il-web/il-web-ipertesti-url-e-protocollo-http): le parole messe in evidenza, i link verso altre pagine e le immagini.

## Dare peso alle parole

Dentro un paragrafo due elementi marcano le parole che contano. `<em>` (da emphasis) segna l'**enfasi**: la parola su cui, leggendo ad alta voce, appoggeresti la voce. `<strong>` segna l'**importanza**: un'informazione che il lettore non deve perdere, come una data o un avviso. Il browser scrive il primo in corsivo e il secondo in grassetto, ma come per i titoli l'aspetto è una conseguenza: si sceglie l'elemento per quello che dice, e chi ascolta la pagina letta da un programma sente la differenza nella voce.

Un terzo elemento manda il testo a capo senza chiudere il paragrafo: `<br>` (da break). Non ha contenuto e quindi non ha un tag di chiusura. Serve dove l'a capo fa parte del testo, come nei versi di una canzone o in un indirizzo; per staccare due discorsi si aprono due paragrafi.

Nella pagina qui sotto sposta `<em>` e `</em>` attorno a "insieme" e rileggi la frase: l'accento cade su un'altra parola e il senso cambia. Poi cancella i due `<br>`: i versi diventano una riga sola, perché gli a capo scritti nel file per il browser non contano.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Suoniamo <em>solo</em> canzoni scritte insieme da noi.</p>
    <p>Il concerto è <strong>venerdì 5 giugno alle 18</strong>, in aula magna.</p>
    <h2>Ultima campanella</h2>
    <p>Suona l'ultima campanella,<br>
       si svuota il corridoio,<br>
       noi restiamo qui a suonare.</p>
</body>
</html>
```

Un elemento può stare dentro l'altro: `<strong>ingresso <em>gratuito</em></strong>` è una frase importante con una parola in enfasi. Vale la regola di sempre: l'elemento aperto per ultimo si chiude per primo.

```ad-warning
Andare a capo per fare spazio
Una fila di `<br>` per allontanare due pezzi di pagina è un errore: lo spazio tra gli elementi è aspetto, e si regola con i [fogli di stile](/materiale/scuola-superiore/informatica/i-fogli-di-stile/il-modello-a-scatola). Lo stesso vale per `<strong>` usato per avere il grassetto su un testo che non è più importante del resto, e per un titolo finto fatto con un paragrafo tutto in `<strong>`.
```

## I link

Un link si scrive con l'elemento `<a>` (da anchor, àncora). Tra i due tag sta il testo su cui si fa clic; l'attributo `href` porta la destinazione.

```html
<a href="concerti.html">Le date dei concerti</a>
```

La destinazione si scrive in due modi. Un **indirizzo assoluto** è un URL intero, con il protocollo e il nome del server: `https://www.scuola.example/orario.html`. Dice da solo dove andare, ed è l'unico modo per puntare a un altro sito. Un **percorso relativo** indica un file dello stesso sito partendo dalla cartella della pagina in cui è scritto, con le regole dei [percorsi relativi](/materiale/scuola-superiore/informatica/il-sistema-operativo/il-file-system-file-cartelle-e-percorsi) del file system: `concerti.html` è un file nella stessa cartella, `foto/palco.html` scende nella cartella `foto`, `../index.html` sale di una cartella.

Il sito qui sotto ha tre pagine, e una sta nella cartella `foto`. Esegui e gira tra le pagine con i link: nell'editor si apre ogni volta il file della pagina in cui sei. Il link alla scuola l'anteprima non lo segue, e te lo dice. Poi in `foto/palco.html` togli `../` da `../index.html` e riprova il link: il browser cerca `index.html` dentro `foto`, dove non c'è.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <nav>
        <a href="concerti.html">Concerti</a>
        <a href="foto/palco.html">Foto</a>
    </nav>
    <p>Siamo il gruppo musicale della 3B del
       <a href="https://www.scuola.example">nostro liceo</a>.</p>
</body>
</html>
```

```codice concerti.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Concerti</title>
</head>
<body>
    <h1>Concerti</h1>
    <p>Venerdì 5 giugno alle 18, in aula magna.</p>
    <p><a href="index.html">Torna alla home</a></p>
</body>
</html>
```

```codice foto/palco.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Foto</title>
</head>
<body>
    <h1>Sul palco</h1>
    <p>Le foto del concerto di Natale arrivano presto.</p>
    <p><a href="../index.html">Torna alla home</a></p>
</body>
</html>
```

Lo stesso file si raggiunge con percorsi diversi a seconda della pagina da cui parti. La figura ha le cartelle di un sito un po' più grande. Scegli come arrivo `logo.png`, poi cambia la partenza da `date.html` a `index.html` e a `scaletta.html`: guarda quale delle tre scritte cambia (percorso relativo, percorso dalla radice, indirizzo assoluto) e quali restano uguali. Infine scrivi tu nel campo un percorso sbagliato, per esempio senza un `../`, e leggi dove si ferma.

```interattivo
% nome: inf-html-percorsi-sito
% alt: L'albero delle cartelle di un sito: nella radice index.html e contatti.html, la cartella concerti con date.html e la cartella natale che contiene scaletta.html, la cartella img con logo.png e palco.jpg. Si sceglie la pagina di partenza e il file di arrivo; la figura accende le cartelle attraversate e scrive il percorso relativo, il percorso dalla radice del sito e l'indirizzo assoluto. Cambiando la pagina di partenza cambia solo il percorso relativo. Il percorso relativo si può anche scrivere a mano, e la figura dice dove porta o dove si interrompe
```

Il percorso relativo dipende da dove parti: per ogni cartella da cui devi uscire c'è un `..`, poi vengono le cartelle in cui entri e il nome del file. Da `date.html` il logo è `../img/logo.png`, da `index.html` è `img/logo.png`, da `scaletta.html` è `../../img/logo.png`. L'indirizzo assoluto è uno solo, da qualunque pagina. Dentro il proprio sito si usano comunque i percorsi relativi: sono corti, e continuano a funzionare se il sito cambia nome di dominio o se lo provi sul tuo computer prima di pubblicarlo.

```ad-note
La barra all'inizio
Un percorso che comincia con `/`, come `/img/logo.png`, parte dalla radice del sito invece che dalla cartella della pagina. È lo stesso da tutte le pagine del sito, ma senza il nome del server: funziona solo quando il sito sta su un server, alla radice.
```

```ad-warning
Gli errori che rompono un link
- Dimenticare il protocollo: `href="www.scuola.example"` non è un indirizzo assoluto. Senza `https://` il browser lo legge come un percorso relativo, e cerca un file con quel nome nella cartella della pagina.
- Contare male le cartelle: un `../` in più o in meno porta in un'altra cartella, e il server risponde `404`.
- Cambiare una maiuscola: su molti server `Foto/Palco.html` e `foto/palco.html` sono due file diversi. Conviene scrivere i nomi dei file tutti in minuscolo e senza spazi.
```

### Un link a un punto della pagina

Un link può portare a un punto preciso di una pagina lunga. Il punto di arrivo è un elemento con l'attributo `id`, un nome che in tutta la pagina può avere un solo elemento; il link lo indica con il cancelletto, `href="#nome"`. Nella pagina qui sotto fai clic sui link del menu e poi su "Torna su". Cambia `id="contatti"` in `id="scrivici"` e riprova il secondo link: la pagina non si muove, perché nessun elemento ha più quel nome, e la riga che compare sotto l'anteprima te lo dice. Un browser vero non avvisa: il link resta fermo e basta.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1 id="inizio">I Fuori Tempo</h1>
    <nav>
        <a href="#concerti">Concerti</a>
        <a href="#contatti">Contatti</a>
        <a href="storia.html">Storia</a>
    </nav>
    <h2>Chi siamo</h2>
    <p>Sara canta, Leo sta alla batteria.</p>
    <p>Marta suona la chitarra, Dario il basso.</p>
    <p>Proviamo il martedì e il giovedì.</p>
    <p>La sala prove è l'aula di musica.</p>
    <h2 id="concerti">Concerti</h2>
    <p>Venerdì 5 giugno alle 18, in aula magna.</p>
    <p>Sabato 27 giugno alle 21, alla festa del quartiere.</p>
    <p>Per tutti e due l'ingresso è gratuito.</p>
    <h2 id="contatti">Contatti</h2>
    <p>Ci trovi in 3B, a ogni intervallo.</p>
    <p>Per suonare con noi parla con Sara.</p>
    <p>Per le foto del concerto chiedi a Leo.</p>
    <p><a href="#inizio">Torna su</a></p>
</body>
</html>
```

```codice storia.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>La nostra storia</title>
</head>
<body>
    <h1>La nostra storia</h1>
    <p>Abbiamo cominciato in prima, con due chitarre prestate.</p>
    <p><a href="index.html#contatti">Scrivici</a></p>
</body>
</html>
```

Le due scritture si combinano: `index.html#contatti` apre un'altra pagina e la fa scorrere fino all'elemento con quell'`id`. Dal menu vai alla pagina "Storia" e fai clic su "Scrivici": torni alla home, già ferma sui contatti.

```ad-tip
Il testo del link dice dove porta
"Le date dei concerti" è un buon testo per un link; "clicca qui" no. Chi scorre la pagina con gli occhi, o se la fa leggere saltando da un link all'altro, deve capire la destinazione dalle sole parole del link.
```

## Le immagini

Un'immagine non sta dentro il file della pagina: è un altro file, che il browser chiede a parte. L'elemento `<img>` dice dove prenderla e che cosa mettere al suo posto se non arriva. Non ha contenuto e non ha un tag di chiusura; il lavoro lo fanno gli attributi.

| Attributo | Che cosa dice |
|---|---|
| `src` | dove sta il file: un percorso relativo o un indirizzo assoluto, come in `href` |
| `alt` | il **testo alternativo**: quello che l'immagine comunica, detto a parole |
| `width`, `height` | larghezza e altezza in pixel con cui disegnarla, senza unità |

```html
<img src="img/logo.png" alt="Il logo dei Fuori Tempo: un disco in vinile" width="120" height="120">
```

Il testo di `alt` prende il posto dell'immagine ogni volta che l'immagine non c'è: quando il percorso è sbagliato o la connessione è lenta, per chi non vede e ascolta la pagina, per un motore di ricerca, che le immagini non le guarda. Per questo descrive quello che l'immagine dice in quel punto della pagina, con poche parole e senza cominciare con "immagine di". Un'immagine che fa solo da decorazione ha `alt=""`, vuoto, e chi ascolta la pagina non viene interrotto.

Con `width` e `height` il browser riserva il rettangolo prima che il file arrivi, e il testo sotto non salta quando l'immagine compare. Se ne scrivi una sola, l'altra viene calcolata tenendo le proporzioni; se le scrivi tutte e due con un rapporto diverso da quello del file, l'immagine si deforma.

Nell'editor di questa lezione non si possono aggiungere file di immagini. Nella pagina qui sotto il disco è quindi scritto dentro `src`, con un indirizzo che comincia con `data:` e contiene il disegno stesso, un [SVG](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/grafica-bitmap-e-grafica-vettoriale): lascia quella parte com'è. Cambia `width` in 240 e guarda il disco deformarsi; cancella `height` e torna rotondo. Poi sostituisci tutto il valore di `src` con `img/logo.png`, un file che in questo sito non esiste: al posto del disco compare il testo di `alt`.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <img alt="Il logo dei Fuori Tempo: un disco in vinile" width="120" height="120" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80' preserveAspectRatio='none'><circle cx='40' cy='40' r='38'/><circle cx='40' cy='40' r='12' fill='gold'/></svg>">
    <p>Il gruppo musicale della 3B.</p>
</body>
</html>
```

Un'immagine può fare da link: basta metterla tra `<a>` e `</a>` al posto del testo, e allora il suo `alt` è anche il testo del link.

```ad-warning
Rimpicciolire una foto con width e height
Gli attributi cambiano la grandezza del disegno, non il file. Una foto di 4000 pixel di lato mostrata con `width="200"` viene scaricata intera e poi rimpicciolita: la pagina è lenta e consuma dati per niente. L'immagine si [ridimensiona](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/grafica-bitmap-e-grafica-vettoriale) prima, con un programma di grafica, e si salva nel [formato](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/i-formati-dei-file-multimediali) adatto. L'altro errore è lasciare `alt` fuori, o copiarci il nome del file: `alt="IMG_2041.jpg"` non dice niente a nessuno.
```

## Prova tu

"Verifica" guarda gli elementi della tua pagina e i loro attributi: il testo va lasciato com'è, si aggiungono solo i tag.

Nel paragrafo dell'avviso segna come importante "venerdì 5 giugno alle 18" e metti l'enfasi su "gratuito". Poi manda a capo l'indirizzo dopo "Liceo di Borgo Alto", senza aprire un altro paragrafo.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Il concerto</title>
</head>
<body>
    <h1>Il concerto di fine anno</h1>
    <p>Suoniamo venerdì 5 giugno alle 18. L'ingresso è gratuito.</p>
    <p>Liceo di Borgo Alto, via dei Tigli 4</p>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Il concerto</title>
</head>
<body>
    <h1>Il concerto di fine anno</h1>
    <p>Suoniamo <strong>venerdì 5 giugno alle 18</strong>. L'ingresso è <em>gratuito</em>.</p>
    <p>Liceo di Borgo Alto,<br>via dei Tigli 4</p>
</body>
</html>
%% controllo La data e l'ora sono segnate come importanti
p strong | testo = venerdì 5 giugno alle 18
%% controllo L'enfasi è sulla parola "gratuito"
p em | testo = gratuito
%% controllo L'indirizzo va a capo dentro lo stesso paragrafo
p br | quanti = 1
p | quanti = 2
p:nth-of-type(2) | testo contiene Borgo Alto
p:nth-of-type(2) | testo contiene via dei Tigli 4
```

La pagina `date.html` sta nella cartella `concerti`. Trasforma in link le tre voci del menu: "Home" porta a `index.html`, che sta nella cartella sopra; "Scaletta" porta a `scaletta.html`, che sta nella stessa cartella; "La scuola" porta al sito `https://www.scuola.example`. Usa percorsi relativi per le pagine del sito. I primi due link li puoi anche provare con un clic.

```codice concerti/date.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Le date</title>
</head>
<body>
    <nav>
        Home
        Scaletta
        La scuola
    </nav>
    <h1>Le date</h1>
    <p>Venerdì 5 giugno alle 18, in aula magna.</p>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Le date</title>
</head>
<body>
    <nav>
        <a href="../index.html">Home</a>
        <a href="scaletta.html">Scaletta</a>
        <a href="https://www.scuola.example">La scuola</a>
    </nav>
    <h1>Le date</h1>
    <p>Venerdì 5 giugno alle 18, in aula magna.</p>
</body>
</html>
%% controllo "Home" è un link che sale di una cartella e arriva a index.html
nav a:nth-of-type(1) | testo = Home
nav a:nth-of-type(1) | attributo href = ../index.html
%% controllo "Scaletta" è un link al file nella stessa cartella
nav a:nth-of-type(2) | testo = Scaletta
nav a:nth-of-type(2) | attributo href = scaletta.html
%% controllo "La scuola" è un link con l'indirizzo assoluto, protocollo compreso
nav a:nth-of-type(3) | testo = La scuola
nav a:nth-of-type(3) | attributo href = https://www.scuola.example
%% controllo Nel menu ci sono tre link
nav a | quanti = 3
```

```codice concerti/scaletta.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>La scaletta</title>
</head>
<body>
    <h1>La scaletta</h1>
    <p>Controtempo, Ultima campanella, Fuori orario.</p>
    <p><a href="date.html">Torna alle date</a></p>
</body>
</html>
```

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p><a href="concerti/date.html">Le date dei concerti</a></p>
</body>
</html>
```

All'immagine mancano tre attributi. Scrivi il testo alternativo "Il logo dei Fuori Tempo", e falla disegnare larga 80 pixel e alta 80. Poi dai al titolo "Contatti" il nome `contatti` e trasforma la scritta "Scrivici" in un link che porta a quel punto della pagina.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><circle cx='40' cy='40' r='38'/><circle cx='40' cy='40' r='12' fill='gold'/></svg>">
    <p>Scrivici</p>
    <h2>Contatti</h2>
    <p>Ci trovi in 3B, a ogni intervallo.</p>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <img alt="Il logo dei Fuori Tempo" width="80" height="80" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><circle cx='40' cy='40' r='38'/><circle cx='40' cy='40' r='12' fill='gold'/></svg>">
    <p><a href="#contatti">Scrivici</a></p>
    <h2 id="contatti">Contatti</h2>
    <p>Ci trovi in 3B, a ogni intervallo.</p>
</body>
</html>
%% controllo L'immagine ha il testo alternativo "Il logo dei Fuori Tempo"
img | attributo alt = Il logo dei Fuori Tempo
%% controllo L'immagine è larga 80 pixel e alta 80
img | attributo width = 80
img | attributo height = 80
%% controllo Il titolo "Contatti" ha il nome contatti
h2#contatti | testo = Contatti
%% controllo "Scrivici" è un link al punto della pagina con quel nome
p > a | testo = Scrivici
p > a | attributo href = #contatti
```
