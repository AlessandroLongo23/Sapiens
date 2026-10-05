# Note: Il web: ipertesti, URL e protocollo HTTP

Lezione nuova, scritta da zero (lotto del secondo anno, capitolo "Internet e il web", 5 ottobre 2026). `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard. 152 righe, 2 figure, 4 esempi.

## Struttura

L'origine del web al CERN come apertura, con le tre idee che fanno da indice; ipertesto, link, web, pagina, sito, browser, server web; che cosa è una pagina quando viaggia (un file di testo in HTML); l'URL e le sue tre parti; HTTP con `GET`, `POST` e i codici di stato; i sei passi dal clic alla pagina; HTTPS e il lucchetto.

Avvisi: il browser non è il motore di ricerca (e il web non è Internet); un URL si scrive esatto; il lucchetto non dice che il sito è onesto. Una nota su `?` e `#`.

## Scelte

- HTML: la lezione dice che cosa contiene il file (parole e indicazioni) senza mostrare un tag, come chiede il confine con il terzo anno. Non c'è link al capitolo "Il linguaggio HTML", perché non è ancora scritto.
- Le parti dell'URL si chiamano "protocollo", "nome del server" e "percorso". I termini tecnici sono schema, host e path; i libri del biennio usano quasi sempre i primi. La porta non c'è; query e frammento sono nella nota, senza questi nomi.
- Codici di stato: cinque (`200`, `301`, `403`, `404`, `500`) e la regola della prima cifra. La famiglia 1xx non c'è.
- `GET` e `POST` in due frasi; niente intestazioni, niente versioni di HTTP.
- I cookie non ci sono. Servirebbero a spiegare perché un sito ti riconosce da una pagina all'altra; il posto giusto è forse la lezione sulla privacy (43). Da decidere.
- HTTPS: cifratura e certificato a parole, senza TLS e senza chiavi (la crittografia è del quinto anno). La regola pratica è una sola: i dati personali si scrivono solo in pagine `https`.
- "Molti browser mostrano un lucchetto": alcuni browser lo hanno sostituito con un'altra icona, per questo il testo dice "molti" e la regola si appoggia su `https` nell'URL.
- L'esempio 3 conta una richiesta per la pagina e una per ogni immagine. Una pagina vera chiede anche fogli di stile, script e caratteri: l'esempio dice "del testo, tre fotografie e venti link" e non nomina altro.
- I sei passi dal clic alla pagina ripetono, in una riga, il passo del DNS della lezione 35: è il punto in cui le quattro lezioni si mettono insieme.

## Fonti e cose da verificare

Scritti a memoria, non ricontrollati in rete in questa sessione.

- Tim Berners-Lee, CERN: proposta del marzo 1989, primo server e primo browser alla fine del 1990, sito pubblico nell'agosto 1991. Il testo dice "tra il 1989 e il 1991". Fonte da citare: CERN, "A short history of the Web" (home.cern).
- "Migliaia di ricercatori" al CERN e il problema dei documenti su computer diversi: è il motivo dichiarato nella proposta del 1989 ("Information Management: A Proposal"). Da verificare il numero, che nel testo è generico.
- "World Wide Web" tradotto "ragnatela grande quanto il mondo": traduzione corrente.
- Codici di stato e significati: RFC 9110 (giugno 2022).
- Nei percorsi degli URL maiuscole e minuscole "spesso contano": dipende dal server. Il testo dice "possono essere due file".
- "Se scrivi delle parole che non formano un URL, il browser le passa a un motore di ricerca": comportamento dei browser più diffusi nel 2026, da verificare.
- Un sito di phishing può avere `https` e il lucchetto: vero, i certificati si ottengono gratis e in automatico per qualunque dominio registrato.

## Figure

- `parti-di-un-url`: l'URL in tre caselle con i nomi sotto.
- `richieste-http-per-una-pagina`: browser e server web con due coppie di richiesta e risposta, dall'alto in basso.

Guardate in chiaro e in scuro. Corretto dopo la prima anteprima: la prima figura superava di poco i 9 cm.

## Domande per Andrea

- "Protocollo, nome del server, percorso" oppure "schema, host, path" per le parti dell'URL?
- I cookie: in questa lezione, nella lezione sulla privacy, o in nessuna delle due al secondo anno?
- Cinque codici di stato sono troppi? I due che servono davvero sono `200` e `404`.
- La lezione si chiama `http-html` come slug ma di HTML dice solo che esiste: va bene così?
