# Flashcard: Il web: ipertesti, URL e protocollo HTTP

## ipertesto
Che cos'è un ipertesto?
---
Un testo che contiene collegamenti ad altri testi, e che ognuno legge nell'ordine che preferisce.

## link
Che cos'è un link?
---
La parola, la frase o l'immagine su cui fai clic per aprire un altro documento.

## web
Che cos'è il web?
---
L'insieme dei documenti collegati tra loro da link e distribuiti sui server di tutto il mondo.

## browser-server-web
Tra browser e server web, quale dei due è il client?
---
Il browser: chiede le pagine. Il server web le conserva e le manda.

## pagina-file
Che cosa riceve il browser quando chiede una pagina web?
---
Un file di testo scritto in HTML, con le parole della pagina e le indicazioni per disegnarla.

## immagini-separate
Vero o falso: le fotografie di una pagina stanno dentro il file della pagina.
---
Falso. Sono file separati, che il browser chiede uno per uno.

## browser-motore
Vero o falso: il browser e il motore di ricerca sono la stessa cosa.
---
Falso. Il browser è il programma che apre le pagine; il motore di ricerca è un sito che aiuta a trovarle.

## url
Che cos'è un URL?
---
L'indirizzo di una risorsa del web: una pagina, un'immagine, un file da scaricare.

## url-tre-parti
Quali sono le tre parti di un URL, nell'ordine?
---
Il protocollo, il nome del server e il percorso.

## url-protocollo
Qual è il protocollo in `https://www.scuola.example/orario.html`?
---
`https`, quello che sta prima di `://`.

## url-server
Qual è il nome del server in `https://www.scuola.example/circolari/gita.pdf`?
---
`www.scuola.example`, da `://` fino alla prima barra.

## url-percorso
Qual è il percorso in `https://www.esempio.it/classi/2b/orario.html`?
---
`/classi/2b/orario.html`.

## url-senza-percorso
Che cosa manda il server se nell'URL il percorso manca?
---
La home page del sito.

## http
Che cos'è HTTP?
---
Il protocollo con cui un browser chiede una risorsa a un server web e il server gliela manda.

## get
Che cosa chiede il browser con `GET /orario.html`?
---
Di ricevere la risorsa che si trova al percorso `/orario.html`.

## codice-404
Scrivi a mano un URL e sbagli il nome della pagina. Che codice di stato risponde il server?
---
`404`: il server funziona, ma a quel percorso non ha niente.

## codice-prima-cifra
Un codice di stato comincia con 5. Di chi è l'errore, del browser o del server?
---
Del server. I codici che cominciano con 4 segnalano invece una richiesta sbagliata.

## quante-richieste
Una pagina ha del testo e due immagini. Quante richieste HTTP manda il browser?
---
Tre: una per il file della pagina e una per ciascuna immagine.

## https
Che cosa aggiunge HTTPS a HTTP?
---
I dati viaggiano cifrati, e il server prova con un certificato di essere quello del nome di dominio.

## lucchetto
Vero o falso: se c'è il lucchetto, il sito è affidabile.
---
Falso. Il lucchetto dice che la connessione è protetta, non chi ha registrato il nome: anche un sito truffa può averlo.
