# Note: I linguaggi di markup

Lezione nuova, la prima del capitolo "Il linguaggio HTML" (lotto del terzo anno, 7 ottobre 2026). `check.mts` passa senza errori e senza avvisi di stile; i controlli delle tre pagine si provano solo nel browser, e lì le tre soluzioni passano e le tre partenze no. 305 righe: circa 150 di testo, il resto sono le quattro pagine HTML con le soluzioni e una figura TikZ.

## Scelte

- Confine con la 36: lì l'HTML è "un file di testo con delle indicazioni". Qui le indicazioni prendono il nome di tag, elemento, attributo.
- Confine con la 88: la prima pagina è completa (doctype, `html`, `head`, `body`), ma il testo dice solo che le prime righe servono al browser e che le spiega la lezione dopo. L'albero qui è quello del contenuto di `body`, usato per spiegare l'annidamento; l'albero dell'intero documento resta alla 88.
- Confine con la 81: XML è un paragrafo con un esempio di quattro righe e il link.
- Elementi usati: `h1`, `p`, `em`, `strong`, `ul`, `li`, `a` (solo nella figura delle parti di un elemento), `br` (solo nominato come elemento senza contenuto). `em` e `strong` sono presentati per il significato (in evidenza, importante), non come corsivo e grassetto.
- "Marcatore" è la parola generale; "tag" è il marcatore dell'HTML.
- La separazione tra struttura e aspetto ha tre motivi concreti (dispositivi diversi e sintesi vocale, un solo posto dove cambiare l'aspetto, i programmi che cercano i titoli).
- Markdown: quattro segni soltanto (`#`, `*`, `**`, `-`). LaTeX non è nominato.
- Il sito dei Fuori Tempo comincia qui: nome del gruppo, una riga, l'elenco di chi suona. I nomi (Sara, Leo, Amir, Giulia) sono gli stessi della 86.
- La figura dei tag è in TikZ con i segni `<` e `>` disegnati come due tratti: scritti come testo rompono l'SVG prodotto da node-tikzjax.

## Elementi interattivi

- `inf-markup-testo-albero-pagina` (figura): che cosa hanno in comune il testo marcato, l'albero e la pagina? Si sceglie un elemento in una delle tre viste e si accende nelle altre due; un comando riscrive il testo in Markdown, e albero e pagina non cambiano.
- La prima pagina (`codice html`): che cosa succede cambiando il testo, aggiungendo un elemento, togliendo un tag di chiusura?
- Tre esercizi con `%% controllo`: marcare un testo, correggere tre errori nei tag, tradurre da Markdown.
- Una figura TikZ: le parti di un elemento.

## Da verificare

- HTML sta per HyperText Markup Language, XML per eXtensible Markup Language.
- "Un file XML con un tag non chiuso viene rifiutato per intero": è quello che la specifica XML chiede a un lettore (errore fatale per un documento non ben formato).
- Markdown è di John Gruber, 2004: la lezione non lo dice, ed è qui solo per completezza.
- "Molte chat, i programmi per gli appunti e i siti di documentazione usano Markdown": vero nel 2026, senza nomi di prodotti.
- Che cosa fa il browser senza `</h1>`: provato con Chromium nella pagina della lezione, il paragrafo e l'elenco finiscono dentro il titolo. Il secondo esercizio conta su questo, e sulla correzione automatica dei `<p>` non chiusi: con la pagina di partenza `body > p` ne trova 0.
- Negli esercizi `p | testo = …` confronta il testo senza contare gli spazi ripetuti: una soluzione con gli a capo dentro il paragrafo passa.

## Domande per Andrea

- "Marcatore" e "tag": va bene tenere tutte e due le parole, la prima generale e la seconda per l'HTML?
- `em` e `strong` presentati come "in evidenza" e "importante": la 89 li riprende, va bene anticiparli qui?
- L'albero con `body` come radice anticipa troppo la 88?
- Il confronto con i linguaggi di programmazione è una tabella di quattro righe: basta?
- Markdown come secondo esempio va bene, o i libri che usi mettono LaTeX?

Prerequisiti proposti: http-html, inf-file-system, inf-font

## Revisione del lotto (7 ottobre 2026)

- Sara salva il file come `pagina.html` prima di aprirlo: un `.txt` nel browser terrebbe gli a capo. "Il browser li ignora" è diventato "una fila di spazi e di a capo vale quanto uno spazio solo", come nella 88. XML: "Extensible" come nella 81, e "oggi si usa per i dati più che per i documenti" (non "è nato per i dati"). "Dove provate" è diventato "dove prova il gruppo".
