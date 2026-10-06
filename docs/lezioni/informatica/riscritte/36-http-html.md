# Il web: ipertesti, URL e protocollo HTTP

Il web è nato per risolvere un problema pratico. Al CERN di Ginevra, un grande laboratorio di fisica, migliaia di ricercatori tenevano i loro documenti su computer diversi, e per leggerne uno bisognava sapere su quale macchina stava e con quale programma aprirlo. Tra il 1989 e il 1991 Tim Berners-Lee, un informatico del laboratorio, mise insieme tre idee: documenti collegati tra loro da link, un indirizzo unico per ogni documento e un protocollo per chiederli a distanza. Sono i tre argomenti di questa lezione.

## Ipertesti e pagine web

Un libro si legge dalla prima pagina all'ultima, nell'ordine scelto dall'autore. Un **ipertesto** è un testo che contiene collegamenti ad altri testi, e che quindi ognuno legge nell'ordine che preferisce, saltando da un documento all'altro. Il collegamento si chiama **link**: è una parola, una frase o un'immagine su cui fai clic per aprire un altro documento. Questa lezione è un ipertesto: i link che incontri nel testo portano ad altre lezioni.

Il **World Wide Web**, o più brevemente **web**, è l'insieme dei documenti collegati tra loro da link e distribuiti sui server di tutto il mondo. Il nome vuol dire "ragnatela grande quanto il mondo": i documenti sono i nodi, i link sono i fili.

Le parole che servono per parlarne sono poche:

- una **pagina web** è uno di questi documenti;
- un **sito web** è un insieme di pagine dello stesso proprietario, sotto lo stesso [nome di dominio](/materiale/scuola-superiore/informatica/internet-e-il-web/indirizzi-ip-e-nomi-di-dominio); la pagina da cui si parte è la home page;
- il **browser** è il programma con cui chiedi le pagine e le guardi, cioè il [client](/materiale/scuola-superiore/informatica/internet-e-il-web/il-modello-client-server) del web;
- il **server web** è il programma che conserva le pagine di un sito e le manda ai browser che le chiedono.

Una pagina web, quando viaggia dal server al browser, è un file di testo scritto in un linguaggio che si chiama HTML (HyperText Markup Language). Il file contiene le parole della pagina insieme a delle indicazioni: qui c'è un titolo, qui comincia un paragrafo, qui va un'immagine che si trova a quest'indirizzo, questa frase è un link che porta a quest'altro indirizzo. Il browser legge le indicazioni e disegna la pagina. Le immagini e i video non stanno dentro il file della pagina: sono file separati, che il browser chiede uno per uno.

Qui sotto ci sono i file di due pagine di un piccolo sito, e sotto i file la pagina come la disegna il browser. Le indicazioni sono le scritte tra `<` e `>`: `<h1>` apre un titolo, `<p>` un paragrafo, `<a href="...">` un link, e la stessa scritta con la barra, come `</h1>`, lo chiude. Fai clic sul link nella pagina: si apre l'altra, che ha il suo file nella seconda linguetta. Poi cambia le parole tra `<h1>` e `</h1>` e premi "Esegui": la pagina viene ridisegnata. Infine scrivi `voti.html` al posto di `orario.html` dentro `href` ed esegui: il link non si apre più, perché nel sito una pagina con quel nome non c'è.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Classe 2B</title>
</head>
<body>
    <h1>La classe 2B</h1>
    <p>Siamo in ventiquattro, nell'aula 14.</p>
    <a href="orario.html">Guarda l'orario</a>
</body>
</html>
```

```codice orario.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Orario</title>
</head>
<body>
    <h1>L'orario del lunedì</h1>
    <p>Matematica, italiano, informatica.</p>
    <a href="index.html">Torna alla classe</a>
</body>
</html>
```

```ad-warning
Il browser non è il motore di ricerca
Il browser è un programma installato sul tuo dispositivo, e serve ad aprire le pagine. Il motore di ricerca è un sito, cioè una pagina tra le tante, che ti aiuta a [trovare le altre](/materiale/scuola-superiore/informatica/internet-e-il-web/cercare-e-valutare-le-informazioni-in-rete). Si confondono perché molti browser si aprono proprio su quella pagina. E il web non è Internet: è uno dei [servizi](/materiale/scuola-superiore/informatica/internet-e-il-web/internet-la-rete-delle-reti) che la usano.
```

## L'URL, l'indirizzo di una risorsa

Perché un link possa portare a un documento qualunque, su un server qualunque, ogni documento deve avere un indirizzo diverso da tutti gli altri. Un **URL** (Uniform Resource Locator) è l'indirizzo di una risorsa del web: una pagina, un'immagine, un video, un file da scaricare. È quello che leggi nella barra in alto del browser.

```tikz
% nome: parti-di-un-url
% alt: L'URL https://www.esempio.it/classi/2b/orario.html diviso in tre caselle. Sotto la casella https c'è scritto protocollo; sotto la casella www.esempio.it c'è scritto nome del server; sotto la casella /classi/2b/orario.html c'è scritto percorso della risorsa. Tra la prima e la seconda casella ci sono i due punti e le due barre
% svg: parti-di-un-url-cc662e63.svg 334x54
\begin{tikzpicture}
\tikzset{
  parte/.style={draw, thick, minimum height=0.7cm, inner xsep=2pt, font=\small\ttfamily},
  et/.style={font=\footnotesize, align=center}}
\node[parte, fill=orange!25, minimum width=1.1cm] (p) at (0.6,0) {https};
\node[font=\small\ttfamily] at (1.5,0) {://};
\node[parte, fill=green!15, minimum width=2.7cm] (h) at (3.25,0) {www.esempio.it};
\node[parte, fill=blue!10, minimum width=4.0cm] (r) at (6.7,0) {/classi/2b/orario.html};
\node[et] at (0.75,-0.75) {protocollo};
\node[et] at (3.25,-0.75) {nome del server};
\node[et] at (6.7,-0.75) {percorso della risorsa};
\end{tikzpicture}
```

Un URL ha tre parti, e ognuna risponde a una domanda:

1. Il protocollo dice come chiedere la risorsa. Per il web è `http` oppure `https`, ed è seguito da `://`.
2. Il nome del server dice a chi chiederla. È un nome di dominio, e si legge come hai imparato: il proprietario si riconosce dalla fine.
3. Il percorso dice che cosa chiedere, tra tutto quello che il server conserva. Comincia con una barra e somiglia al [percorso di un file](/materiale/scuola-superiore/informatica/il-sistema-operativo/il-file-system-file-cartelle-e-percorsi): cartelle separate da barre e, in fondo, il nome della risorsa.

Quando il percorso manca, come in `https://www.esempio.it`, il server manda la home page.

```ad-example
Esempio 1: le parti di un URL
Quali sono il protocollo, il nome del server e il percorso in `https://www.scuola.example/circolari/2026/gita.pdf`?

Il protocollo è `https`, quello che sta prima di `://`. Il nome del server va da lì alla prima barra: `www.scuola.example`. Il resto è il percorso, `/circolari/2026/gita.pdf`: la risorsa si chiama `gita.pdf` e sta nella cartella `2026`, dentro la cartella `circolari`.
```

```ad-example
Esempio 2: stesso server o server diverso
Sei sulla pagina `https://www.scuola.example/orario.html`. Dei due link `https://www.scuola.example/classi/orario.html` e `https://scuola.esempio.it/orario.html`, quale porta su un altro sito?

Il secondo. Nel primo il nome del server è lo stesso, `www.scuola.example`, e cambia solo il percorso: è un'altra pagina dello stesso sito. Nel secondo il percorso è uguale a quello di partenza ma il nome del server è `scuola.esempio.it`, registrato da qualcun altro.
```

```ad-note
Il punto interrogativo e il cancelletto
In fondo a molti URL trovi altre due parti. Dopo un `?` ci sono dei dati che il browser passa al server, come le parole che hai cercato: `/cerca?parola=gita`. Dopo un `#` c'è il nome di un punto dentro la pagina, a cui il browser scorre da solo.
```

```ad-warning
Un URL si scrive esatto
Un URL indica una sola risorsa, e una lettera diversa indica un'altra risorsa, o nessuna. Nel percorso spesso contano anche le maiuscole: `/Orario.html` e `/orario.html` possono essere due file. Se nella barra del browser scrivi delle parole che non formano un URL, il browser le passa a un motore di ricerca: non stai aprendo una pagina, stai facendo una ricerca.
```

## Il protocollo HTTP

Browser e server web si parlano con un [protocollo](/materiale/scuola-superiore/informatica/internet-e-il-web/internet-la-rete-delle-reti) fatto apposta. **HTTP** (HyperText Transfer Protocol, protocollo per il trasferimento degli ipertesti) è l'insieme delle regole con cui un browser chiede una risorsa a un server web e il server gliela manda. Segue lo schema del modello client-server: una richiesta, una risposta.

La richiesta è un breve testo che dice che cosa fare e su quale risorsa. La più comune comincia con la parola `GET`, "dammi", seguita dal percorso: `GET /classi/2b/orario.html`. Quando invece compili un modulo e premi "Invia", il browser usa `POST`, che consegna al server i dati che hai scritto.

La risposta comincia con un **codice di stato**, un numero di tre cifre che dice com'è andata, e prosegue con la risorsa, se c'è.

| Codice | Significato | Quando lo incontri |
|---|---|---|
| `200` | tutto bene: ecco la risorsa | quasi sempre, senza vederlo |
| `301` | la risorsa è stata spostata a un altro URL | il browser ci va da solo |
| `403` | non hai il permesso di vederla | una pagina riservata |
| `404` | il server non ha niente a quel percorso | un link vecchio, un URL scritto male |
| `500` | il server ha avuto un errore mentre preparava la risposta | un guasto del sito |

La prima cifra dice già il tipo di risposta: i codici che cominciano con 2 sono successi, quelli con 3 rimandano altrove, quelli con 4 segnalano che è sbagliata la richiesta, quelli con 5 che il guasto è del server.

```tikz
% nome: richieste-http-per-una-pagina
% alt: Scambio di messaggi HTTP tra il browser, a sinistra, e il server web, a destra, dall'alto verso il basso. Prima il browser manda GET /classi/2b/orario.html e il server risponde 200 con la pagina. Poi il browser manda GET /immagini/logo.png e il server risponde 200 con l'immagine
% svg: richieste-http-per-una-pagina-54967705.svg 341x178
\begin{tikzpicture}
\tikzset{
  nodo/.style={draw, thick, rounded corners=4pt, minimum width=1.8cm, minimum height=0.8cm, font=\small},
  et/.style={font=\footnotesize}}
\node[nodo, fill=blue!10] (b) at (0.9,0) {browser};
\node[nodo, fill=green!15] (s) at (8.0,0) {server web};
\draw[thick] (0.9,-0.4) -- (0.9,-4.2);
\draw[thick] (8.0,-0.4) -- (8.0,-4.2);
\draw[-{Stealth}, thick] (0.9,-1.2) -- (8.0,-1.2);
\draw[-{Stealth}, thick] (8.0,-2.0) -- (0.9,-2.0);
\draw[-{Stealth}, thick] (0.9,-3.1) -- (8.0,-3.1);
\draw[-{Stealth}, thick] (8.0,-3.9) -- (0.9,-3.9);
\node[et] at (4.45,-0.92) {1. \texttt{GET /classi/2b/orario.html}};
\node[et] at (4.45,-1.72) {2. \texttt{200}, e il file della pagina};
\node[et] at (4.45,-2.82) {3. \texttt{GET /immagini/logo.png}};
\node[et] at (4.45,-3.62) {4. \texttt{200}, e il file dell'immagine};
\end{tikzpicture}
```

Mettendo insieme questa lezione e le precedenti, ecco che cosa succede tra il clic su un link e la pagina che compare:

1. Il browser legge l'URL del link e ne separa le tre parti.
2. Chiede al DNS l'indirizzo IP che corrisponde al nome del server.
3. Manda a quell'indirizzo la richiesta HTTP con il percorso.
4. Il server web cerca la risorsa e risponde con il codice di stato e il file della pagina.
5. Il browser legge il file, e per ogni immagine che la pagina nomina manda un'altra richiesta.
6. Man mano che i file arrivano, il browser disegna la pagina.

```ad-example
Esempio 3: quante richieste per una pagina
Una pagina contiene del testo, tre fotografie e venti link ad altre pagine. Quante richieste HTTP manda il browser per mostrarla?

Quattro: una per il file della pagina, che contiene il testo, e una per ciascuna delle tre fotografie. I link non contano, perché una pagina collegata viene chiesta solo quando ci fai clic.
```

```ad-example
Esempio 4: riconoscere il codice
Che codice riceve il browser in questi due casi? Nel primo scrivi a mano un URL e sbagli il nome della pagina. Nel secondo l'URL è giusto, ma il programma del server si blocca mentre prepara la pagina.

Nel primo caso `404`: il server funziona e ha capito la richiesta, ma a quel percorso non ha niente. Nel secondo `500`: la richiesta era corretta e l'errore è del server. Il primo problema lo risolvi tu correggendo l'URL; per il secondo puoi solo riprovare più tardi.
```

## HTTPS e il lucchetto

Con HTTP richieste e risposte viaggiano in chiaro. I pacchetti attraversano molte reti, e chi ne controlla una, per esempio chi gestisce un Wi-Fi pubblico, può leggere quello che contengono, comprese le password che scrivi in un modulo.

**HTTPS** (HTTP Secure) è HTTP con due protezioni in più. I dati vengono cifrati, cioè trasformati in modo che solo il browser e il server possano leggerli. E il server deve dimostrare al browser, con un certificato, di essere davvero quello a cui appartiene il nome di dominio scritto nell'URL. Quando la connessione è protetta l'URL comincia con `https`, e molti browser mostrano un lucchetto accanto all'indirizzo.

Da qui una regola da applicare sempre: una password, un numero di carta o qualunque dato personale si scrivono solo in una pagina il cui URL comincia con `https`.

```ad-warning
Il lucchetto non dice che il sito è onesto
HTTPS garantisce che nessuno legge i dati lungo la strada e che stai parlando con il server di quel nome. Non dice niente su chi ha registrato il nome. Anche un sito costruito per rubare le password può avere `https` e il lucchetto: per sapere dove sei devi leggere il nome del server, come nella lezione sul [phishing](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/phishing-e-truffe-in-rete).
```
