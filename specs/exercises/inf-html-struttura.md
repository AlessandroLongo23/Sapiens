# inf-html-struttura: Struttura di una pagina HTML

Esercizi della lezione 88 (`docs/lezioni/informatica/riscritte/88-inf-html-struttura.md`). Tutti a scelta multipla
con quattro opzioni, su frammenti veri di HTML: sotto la domanda (al più 42 caratteri per riga e 18 righe) o come
opzioni (al più 34 caratteri e 10 righe). Rientro di due spazi. Non c'è niente da eseguire: la risposta giusta si
ricava leggendo il frammento come lo legge un browser, con le regole della lezione.

Le regole di lettura, usate dal controllo: un tag di apertura crea un elemento figlio dell'ultimo elemento ancora
aperto; un tag di chiusura chiude il suo elemento e quelli rimasti aperti al suo interno; un titolo chiude un titolo
ancora aperto; un commento viene saltato, fino alla fine del testo se non è chiuso.

## Livelli

1. **Lo scheletro della pagina.** Uno scheletro intero (doctype, `html lang="it"`, `head` con `meta charset` e
   `title`, `body` con un `h1` e uno o due paragrafi). Quattro casi, un quarto ciascuno.
   `scheda`: quale testo compare sulla scheda del browser (il testo di `title`; distrattori: il testo di `h1`, un
   paragrafo, `utf-8`, `it`). `finestra`: quale testo non compare nella finestra (ancora `title`; gli altri sono i
   testi del corpo). `compito`: quale riga dichiara l'HTML di oggi, la lingua, la codifica, il nome della scheda
   (opzioni: le quattro righe). `manca`: dallo scheletro è tolta una riga tra doctype, `<head>`, `</head>`,
   `<body>`, `</body>`, `</html>`; le opzioni sbagliate sono righe che nel file ci sono.
   Esempio: titolo "Cineforum", `h1` "Un film a settimana" → sulla scheda compare "Cineforum".
2. **Titoli e paragrafi.** Tre casi, un terzo ciascuno. `paragrafi`: due o tre `p` scritti su più righe del file
   (da 3 a 6 righe in tutto, sempre più righe che paragrafi); quanti paragrafi mostra il browser. Distrattori: le
   righe del file, uno in più, uno in meno. `livello`: sotto un `h1` e un `h2` (a volte un `h3`) c'è un titolo
   scritto `<??>`; la domanda dice di che cosa è il titolo (un'altra parte della pagina, una parte di quella con
   `h2`, una parte di quella con `h3`) e chiede il tag: `h2`, `h3` o `h4`. `regole`: quattro pagine di soli titoli,
   una sola con un solo `h1` e nessun livello saltato scendendo; le altre hanno due `h1`, oppure `h1` seguito da
   `h3`, oppure `h2` seguito da `h4`.
   Esempio: "Chitarre" è una parte di "Strumenti", che è un `h2` → `<h3>`.
3. **Le parti della pagina.** `quale` (poco più di metà): una pagina con `header`, `nav`, `main` e `footer` in cui
   il nome di una parte è sostituito con `???`; quale elemento è. Distrattori: le altre parti, `head`, `section`.
   `posto`: quattro pagine brevi; solo in una `title` è figlio di `head` e `h1` è figlio di `header`, figlio di
   `body`. Le altre hanno `h1` dentro `head`, `head` e `header` scambiati, `header` dentro `head`, `header` fuori
   da `body`.
4. **L'albero del documento.** Un `body` con `header`, `main` e, non sempre, `nav` e `footer` (al più 18 righe).
   Tre casi, un terzo ciascuno. `genitore`: il genitore di un elemento che non è figlio di `body`. `figli`: quanti
   figli ha un elemento che ne contiene altri; distrattori: tutti gli elementi che contiene, uno in più, uno in
   meno. `fratello`: quale delle quattro opzioni è un fratello dell'elemento; le altre sono il genitore, un figlio,
   elementi di un'altra parte. Paragrafi e link si nominano con il loro testo, gli altri elementi con il tag.
   Esempio: in `<main><h2>…</h2><p>…</p></main>` il genitore di `<h2>` è `<main>`.
5. **Commenti ed errori.** Tre casi, un terzo ciascuno. `commento`: da tre a cinque paragrafi, alcuni dentro un
   commento di una riga, a volte seguiti da un commento che non si chiude; quanti paragrafi mostra il browser (mai
   tutti, mai nessuno). `aperto`: un `h2` senza chiusura, uno o due paragrafi, un secondo `h2` chiuso e un
   paragrafo, dentro `main`, `section` o `body`; di quale elemento è figlio un paragrafo: `h2` se viene prima del
   secondo titolo, il contenitore se viene dopo. `sconosciuto`: un tag inventato (`<capitolo>`, `<riga>`); come
   viene mostrato il suo testo: come testo normale e senza avvisi. Distrattori: come un titolo, non mostrato, un
   messaggio di errore.

## Vincoli

- Quattro opzioni diverse; una sola è giusta secondo le regole di lettura qui sopra.
- Il testo di `title` è diverso da ogni testo del corpo.
- In una pagina due paragrafi non hanno lo stesso testo, e così due link.
- I casi di un livello escono nelle quote indicate.
- `params.fragment` è il frammento mostrato, dal livello 2 in poi; `params.case` è il caso.

## Da evitare

Domande su che cosa vuol dire una sigla o su chi ha definito l'HTML; frammenti che un browser vero leggerebbe in un
altro modo (testo fuori da `body`, `p` dentro `p`); pagine in cui un `p` del piè di pagina e uno del contenuto hanno
lo stesso testo; titoli scelti "per grandezza" come risposta giusta.
