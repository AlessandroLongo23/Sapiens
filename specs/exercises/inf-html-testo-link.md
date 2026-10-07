# inf-html-testo-link: Testo, link e immagini

Esercizi della lezione 89 (`docs/lezioni/informatica/riscritte/89-inf-html-testo-link.md`). Tutti a scelta multipla
con quattro opzioni, su frammenti veri di HTML: sotto la domanda (al più 42 caratteri per riga e 18 righe) o come
opzioni (al più 34 caratteri e 10 righe). Non c'è niente da eseguire. I livelli 2 e 3 sono il conto della lezione:
un percorso relativo si risolve partendo dalla cartella della pagina, un pezzo alla volta, e ogni `..` sale di una
cartella.

## Livelli

1. **Enfasi e a capo.** Tre casi, un terzo ciascuno. `aspetto`: un paragrafo su due righe con una parola in
   `strong` e una in `em`; quale parola è in grassetto, in corsivo, segnata come importante, in enfasi. Distrattori:
   la parola nell'altro elemento e due parole senza tag. `righe`: un paragrafo scritto su 3-5 righe del file, con
   un `<br>` in fondo ad alcune (almeno uno, mai tutte); su quante righe lo scrive il browser in una finestra
   larga: i `<br>` più uno. Distrattori: le righe del file, il numero dei `<br>`, 1. `annidato`: quale frammento
   segna due parole con un elemento e la seconda, al suo interno, con l'altro; le opzioni sbagliate chiudono
   nell'ordine sbagliato, non chiudono un elemento, hanno un tag di chiusura senza barra.
   Esempio: `<strong>alle <em>18</em></strong>`.
2. **Dove porta un link.** La pagina di un sito (il suo percorso è nella domanda) contiene un link con un percorso
   relativo; quale file apre. Cinque forme, un quinto ciascuna: `accanto` (`date.html`), `giu`
   (`img/logo.png`), `su` (`../index.html`), `su-giu` (`../img/logo.png`), `due-su` (`../../index.html`).
   Distrattori: il percorso attaccato alla cartella della pagina senza contare i `..`, i `..` tolti e basta, un
   `..` di troppo, il nome della pagina usato come cartella, un'altra cartella del sito.
   Esempio: in `concerti/date.html`, `href="../img/palco.jpg"` apre `img/palco.jpg`.
3. **Scrivere un percorso relativo.** Sotto la domanda l'elenco dei file di un sito (da 6 a 7, con cartelle fino a
   due livelli). In una pagina serve un link a un'altra pagina (`href`) o un'immagine (`src`): quale attributo è
   scritto bene. La risposta giusta è il percorso più corto: tanti `../` quante le cartelle da cui uscire, poi le
   cartelle in cui entrare e il nome. Distrattori: il percorso dalla radice senza `..`, un `../` in più o in meno,
   il solo nome del file, le barre rovesciate. Nessun distrattore porta al file.
4. **Altri siti e punti della pagina.** Tre casi, un terzo ciascuno. `esterno`: che cosa va in `href` per una
   pagina di un altro sito (`https://liceo.example/orari.html`); distrattori: senza protocollo, con `www.` al posto
   del protocollo, `https//`, `https:` senza barre, `../` davanti. `ancora`: tre elementi con un `id`; quale
   attributo porta a uno di loro: `href="#id"`. Distrattori: senza cancelletto, con il punto, con il tag, con
   `.html`, con la maiuscola, `id="#…"`. `arrivo`: dato `<a href="#id">`, a quale dei tre elementi porta.
5. **Le immagini.** Tre casi, un terzo ciascuno. `alt`: un `img` con `src` e `alt`; che cosa compare se il file
   non c'è, o che cosa legge un programma a chi non vede: il testo di `alt`. Distrattori: il percorso, il nome del
   file, niente. `misure`: il file ha lati in un rapporto semplice (2:1, 3:2, 4:3, 1:1, ...), il tag dà solo
   `width` o solo `height`; quanto vale l'altro lato nella pagina. È sempre un numero intero. Distrattori: il lato
   del file, la misura data, la differenza tolta invece del rapporto, il rapporto rovesciato. `scritta`: quale tag
   mette un'immagine con il suo testo alternativo; le altre opzioni usano `href`, non hanno `alt`, scrivono il
   nome del file tra due tag, usano `<image>`, scambiano i due valori.
   Esempio: file 1200 × 400, `width="180"` → alta 60 pixel.

## Vincoli

- Quattro opzioni diverse; una sola è giusta.
- Livelli 2 e 3: pagina e file sono due file diversi dello stesso sito; il percorso giusto non comincia con `/`.
- Indirizzi inventati, con dominio `.example`.
- `params.fragment` è il frammento mostrato; `params.case` è il caso.

## Da evitare

Percorsi che escono dal sito tra le risposte giuste; due opzioni che portano allo stesso file; misure con la
virgola; domande su che cosa vuol dire `href` o `src` come sigla; `target`, `title` e gli altri attributi che la
lezione non ha.
