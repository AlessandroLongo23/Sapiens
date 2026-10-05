# http-html: Il web: ipertesti, URL e protocollo HTTP

Generatore: `src/lib/exercises/v2/generators/http-html.ts`, con gli aiuti di `src/lib/exercises/v2/inf-web1.ts`.
Verifica indipendente: `scripts/exercises/checkers/http_html.py`. Lezione:
`docs/lezioni/informatica/riscritte/36-http-html.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni di testo (`answer.kind = 'choice'`). I campioni sono testo
semplice (`format: 'text'`). La `solution` è sempre il testo dell'opzione giusta, e `params.case` dice il caso.

Gli URL si costruiscono dai loro pezzi: protocollo (`https`, a volte `http`), nome del server (`www.scuola.example`,
`orario.museo.example`, `www.esempio.it`), due cartelle e una risorsa (`/circolari/2026/gita.pdf`). Solo nomi riservati
agli esempi. Un URL lungo, nel testo e nelle opzioni, ha uno spazio di larghezza zero dopo ogni punto del nome e dopo
ogni barra del percorso, perché sul telefono possa andare a capo; `values` e `text` non lo hanno.

## Livello 1: le parole del web

Venti descrizioni, due per parola. Si chiede "Di che cosa si parla?". Opzioni: la parola giusta e tre delle altre nove,
tra Un ipertesto, Un link, Una pagina web, Un sito web, Il browser, Il server web, Un motore di ricerca, HTML, Un URL,
La home page.

Esempio: "È un sito che ti aiuta a trovare le altre pagine. Di che cosa si parla?" Risposta: Un motore di ricerca.
Distrattore tipico: Il browser (l'avviso "Il browser non è il motore di ricerca").

## Livello 2: le parti di un URL

"Nell'URL https://www.cinema.example/gite/foto/avviso.pdf, qual è il percorso della risorsa?" Cinque domande:

- il protocollo (`https`). Distrattori, tre tra: la prima parte del nome, l'ultima, l'estensione del file, `GET`.
- il nome del server (`www.cinema.example`). Distrattori: il nome con la prima cartella, il percorso, la risorsa.
- il percorso (`/gite/foto/avviso.pdf`). Distrattori: la sola risorsa, il nome del server con il percorso, le sole
  cartelle.
- la risorsa (`avviso.pdf`). Distrattori: l'ultima cartella, il nome del server, il protocollo.
- la cartella che contiene direttamente la risorsa (`foto`). Distrattori: la prima cartella, la risorsa, la prima
  parte del nome.

Nome del server e percorso escono più spesso delle altre (2 su 7 ciascuna).

## Livello 3: stesso sito o un altro sito

Dall'esempio 2. "Sei sulla pagina https://www.squadra.example/classi/menu.html." Due domande, metà ciascuna:

- "Quale di questi link porta su un altro sito?": tre link con lo stesso nome del server e uno con un nome diverso;
- "Quale di questi link porta a un'altra pagina dello stesso sito?": uno con lo stesso nome e tre con nomi diversi.

I nomi diversi somigliano a quello giusto: `squadra.esempio.it`, `www.squadra.example.area-utenti.example`, il sito di
un'altra parola (`www.museo.example`). Ogni link ha un percorso suo, così a distinguerli è solo il nome del server.

## Livello 4: richieste e codici di stato

- `situazione` (5 su 10): quindici situazioni con un nome, tre per codice. "Marta fa clic su un link vecchio, verso
  una pagina che è stata cancellata. Con quale codice di stato risponde il server?" Opzioni: il codice giusto e tre
  degli altri quattro, tra 200, 301, 403, 404, 500. L'errore tipico è scambiare 404 e 500 (esempio 4).
- `richiesta` (3 su 10): "Fai clic su un link che porta a https://www.scuola.example/2026/immagini/avviso.pdf. Quale
  richiesta manda il browser al server www.scuola.example?" Risposta: `GET /2026/immagini/avviso.pdf`. Distrattori:
  `POST` con il percorso, `GET` con il nome del server, `200` con il percorso, `GET https`.
- `cifra` (2 su 10): "Una risposta HTTP ha codice 503, che non hai mai incontrato. Che cosa ti dice la sua prima
  cifra?" Un codice che la lezione non nomina (201, 204, 302, 307, 400, 410, 502, 503…). Opzioni: i quattro tipi
  (successo, il server rimanda altrove, è sbagliata la richiesta, il guasto è del server).

## Livello 5: quante richieste per una pagina

Dall'esempio 3. "Una pagina contiene del testo, 7 fotografie, un video e 10 link ad altre pagine. Quante richieste HTTP
manda il browser per mostrarla?" Fotografie da 2 a 9, video da 0 a 2 (zero video non si scrive), link da 3 a 30.
Risposta: 1 + fotografie + video. Distrattori: senza il file della pagina, con i link in più, i soli file e link, una
sola richiesta, i soli link.

## Livello 6: vero o falso sul web

Dodici affermazioni vere (`t1`-`t12`) e dodici false (`f1`-`f12`), le false prese dagli avvisi (il lucchetto che
garantisce l'onestà del sito, il browser come motore di ricerca, il web come Internet, l'URL scritto "più o meno") e
dagli esempi (404 come guasto del server, i link che fanno partire richieste). Due domande, metà ciascuna.

## Da evitare

- Domande di memoria sulla storia (CERN, Berners-Lee, le date) e sulle sigle.
- URL con `?` e `#`: sono una nota della lezione.
- Al livello 3, sottodomini dello stesso nome registrato (`posta.scuola.example` rispetto a `www.scuola.example`): la
  lezione definisce il sito con il nome di dominio, e non dice se quello è lo stesso sito.
- Al livello 2, l'opzione con il protocollo attaccato al nome (`https://www.scuola.example`) per il nome del server:
  troppo vicina alla risposta.

## Verifica

`scripts/exercises/checkers/http_html.py` ricostruisce la risposta dal testo: classifica la descrizione del livello 1
e la situazione del livello 4 dalle parole che usano, e boccia quelle che vanno bene per zero o per due risposte;
divide l'URL in protocollo, nome e percorso; confronta i nomi del server dei link; legge la prima cifra del codice;
conta le richieste. Controlla anche che gli URL siano su nomi riservati agli esempi, che `params.url` sia l'URL del
testo, le quattro opzioni, la soluzione e la quota dei casi.

## Domande per la revisione

- Livello 4, caso `cifra`: si usano codici veri che la lezione non nomina, letti dalla prima cifra. Va bene, o si
  preferiscono solo i cinque della tabella?
- Livello 2: "la cartella che contiene direttamente la risorsa" è l'ultima del percorso. La formulazione è chiara?
- Livello 5: i video contano come file separati, uno per video, come le fotografie. Va bene?
