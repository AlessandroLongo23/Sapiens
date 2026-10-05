# Formulario: Il web: ipertesti, URL e protocollo HTTP

## Ipertesti e web

- Ipertesto: un testo che contiene collegamenti ad altri testi, da leggere nell'ordine che si preferisce.
- Link: la parola, la frase o l'immagine su cui fai clic per aprire un altro documento.
- Web (World Wide Web): l'insieme dei documenti collegati tra loro da link e distribuiti sui server di tutto il mondo.
- Pagina web: uno di questi documenti. Sito web: le pagine di uno stesso proprietario, sotto lo stesso nome di dominio.
- Browser: il programma con cui chiedi e guardi le pagine, cioè il client. Server web: il programma che le conserva e le manda.
- Una pagina è un file di testo in HTML; le immagini sono file separati, che il browser chiede uno per uno.

## URL

URL (Uniform Resource Locator): l'indirizzo di una risorsa del web.

| Parte di `https://www.esempio.it/classi/2b/orario.html` | Nome | Che cosa dice |
|---|---|---|
| `https` | protocollo | come chiedere la risorsa |
| `www.esempio.it` | nome del server | a chi chiederla |
| `/classi/2b/orario.html` | percorso | che cosa chiedere |

- Senza percorso il server manda la home page.
- Dopo `?`: dati che il browser passa al server. Dopo `#`: un punto dentro la pagina.

## HTTP

- HTTP (HyperText Transfer Protocol): le regole con cui un browser chiede una risorsa a un server web e il server gliela manda.
- Richiesta: `GET` più il percorso per chiedere una risorsa; `POST` per consegnare i dati di un modulo.
- Risposta: un codice di stato di tre cifre, poi la risorsa.

| Codice | Significato |
|---|---|
| `200` | tutto bene, ecco la risorsa |
| `301` | la risorsa è stata spostata a un altro URL |
| `403` | non hai il permesso |
| `404` | a quel percorso non c'è niente |
| `500` | errore del server |

| Prima cifra | Tipo di risposta |
|---|---|
| 2 | successo |
| 3 | rimando a un altro URL |
| 4 | richiesta sbagliata |
| 5 | guasto del server |

## Dal clic alla pagina

1. Il browser separa le parti dell'URL.
2. Chiede al DNS l'indirizzo IP del server.
3. Manda la richiesta HTTP con il percorso.
4. Il server risponde con il codice di stato e il file della pagina.
5. Il browser manda un'altra richiesta per ogni immagine.
6. Il browser disegna la pagina.

Richieste per una pagina: una per il file della pagina più una per ogni immagine (con tre fotografie, $1 + 3 = 4$).

## HTTPS

- HTTPS: HTTP con i dati cifrati e con un certificato che prova che il server è quello del nome di dominio.
- Password e dati personali si scrivono solo in pagine il cui URL comincia con `https`.

```ad-warning
Il lucchetto non dice che il sito è onesto
Dice che la connessione è protetta: chi ha registrato il nome si capisce leggendo il nome del server.
```

```ad-warning
Il browser non è il motore di ricerca
Il browser è il programma che apre le pagine; il motore di ricerca è un sito.
```

```ad-warning
Un URL si scrive esatto
Una lettera diversa indica un'altra risorsa, e nel percorso possono contare le maiuscole.
```
