# Note: Testo, link e immagini

Lezione nuova (lotto del terzo anno, capitolo "Il linguaggio HTML", 7 ottobre 2026). Circa 370 righe, di cui un'ottantina di testo: 4 pagine o siti da modificare (uno di tre pagine), 3 esercizi con `%% controllo` (uno su un sito di tre pagine), 1 figura interattiva. `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard.

## Confini

- Scheletro, titoli, paragrafi, parti della pagina e albero sono della 88: qui le pagine li usano senza spiegarli.
- Elenchi e tabelle sono della 90: il menu resta una fila di link dentro `nav`, senza `ul`.
- Niente CSS: `em` e `strong` sono presentati per quello che dicono, con l'aspetto come conseguenza. `b` e `i` non sono nominati.
- Accessibilità: `alt` e il testo dei link sono spiegati qui per quello che serve; il discorso generale è della 95.
- Formati delle immagini e ridimensionamento: link alle lezioni 82 e 83, senza ripeterle.

## Che cosa funziona nell'anteprima, per le immagini (provato il 7 ottobre 2026)

Un'immagine non si può scrivere in un blocco della lezione (`blocco.ts` lo rifiuta: "un'immagine non si scrive in un blocco"). Ho provato che cosa mostra l'anteprima con Chromium di Playwright; la riga del `data:` e i link a un punto della pagina anche con WebKit e Firefox:

| `src` | Che cosa succede |
|---|---|
| `data:image/svg+xml,<svg …>` scritto dentro l'attributo, senza codifica | l'immagine si vede, con `width` e `height` rispettati, in tutti e tre i browser; nessuna nota in console |
| `img/logo.png`, file che nel progetto non c'è | immagine rotta con il testo di `alt`; l'editor avvisa "img/logo.png non esiste nel progetto" |
| `/icon-192.png`, un file del sito | in sviluppo l'immagine si vede (la policy dell'iframe ammette l'origine del sito), ma l'editor avvisa lo stesso che il file "non esiste nel progetto": i due messaggi si contraddicono, quindi non lo uso |
| `https://www.esempio.it/logo.png` | la policy lo ammette (`img-src https:`), ma dipende dalla rete e da un file altrui: non lo uso |
| `<svg>` in linea nella pagina | si vede, ma non è un `img`: non serve a questa lezione |

Scelta: nella pagina delle immagini e nel terzo esercizio il disco è un SVG scritto in `src` come `data:`, di 150 caratteri. Il testo lo dice ("nell'editor di questa lezione non si possono aggiungere file di immagini") e chiede di lasciare quella parte com'è. Gli attributi da modificare (`alt`, `width`, `height`) sono scritti prima di `src`, così restano visibili senza scorrere la riga. Per mostrare a che cosa serve `alt` lo studente sostituisce `src` con `img/logo.png`, che non c'è: compare il testo alternativo.

Se in futuro i blocchi delle lezioni potessero portare un'immagine (come fanno già i progetti salvati dello strumento), la riga con `data:` andrebbe sostituita con un file vero: è l'unico punto debole della lezione.

## Che cosa funziona nell'anteprima, per i link

- Link tra le pagine di un progetto, anche in cartelle (`foto/palco.html`, `../index.html`): funzionano, e l'editor apre il file della pagina mostrata.
- Link a un file che non c'è, o a un altro sito: l'anteprima non lo segue e scrive "Nell'anteprima i link non si aprono: questo porta a …". Il messaggio è lo stesso nei due casi, quindi il testo della lezione dice quale dei due è.
- `href="#id"` nella stessa pagina: funziona (la pagina scorre).
- `href="pagina.html#id"`: dopo la correzione dell'editor apre la pagina e scorre al punto (riprovato dalla revisione del lotto il 7 ottobre). Il progetto della sezione ha ora una seconda pagina, `storia.html`, con il link `index.html#contatti`, e la lezione lo fa provare. Con un `id` che non c'è la console sotto l'anteprima lo dice ("Il link porta a #contatti, ma in index.html nessun elemento ha id=\"contatti\""), e la lezione lo cita.
- Un percorso che comincia con `/` parte dalla radice del progetto: funziona.
- Il disco della pagina delle immagini è un SVG con `viewBox`: dentro `<img>` un SVG così tiene le proporzioni anche con `width` e `height` in un rapporto diverso, e la frase "guarda il disco deformarsi" era falsa (provato dalla revisione del lotto). L'SVG di quella pagina ha ora `preserveAspectRatio='none'`, e con `width="240"` il disco si schiaccia come farebbe una fotografia.

## Scelte

- Parole: "indirizzo assoluto" per l'URL intero e "percorso relativo" per il resto, con il link alla lezione 22, che ha già `..`. Il percorso che comincia con `/` sta in un riquadro `ad-note`.
- Tre errori dei link in un solo riquadro: protocollo dimenticato, `../` contati male, maiuscole.
- `target="_blank"`, `mailto:`, `title` non ci sono.
- `width` e `height` come attributi: sono dimensioni del contenuto, e servono a riservare lo spazio. Il brief vieta gli attributi di presentazione; questi due li tengo perché sono nel confine della lezione ("dimensioni") e perché oggi sono raccomandati proprio per evitare i salti della pagina.
- Le pagine sono progetti (`codice index.html`), come nella 88.

## Elementi interattivi

1. Le pagine da modificare. Domande: che cosa cambia spostando `em`; che cosa succede togliendo i `br`; dove porta un link relativo se tolgo `../`; che cosa succede se nessun elemento ha l'`id` del link; come si deforma un'immagine con una misura sola cambiata, e che cosa compare se il file non c'è.
2. Il sito di tre pagine con una cartella: si gira con i link, e si rompe un link togliendo `../`.
3. `inf-html-percorsi-sito` (`PercorsiSito.tsx`). Domanda: che cosa cambia in un percorso relativo quando cambia la pagina in cui è scritto, e che cosa non cambia mai in un indirizzo assoluto? L'albero delle cartelle di un sito; si sceglie la pagina di partenza e il file di arrivo, la figura accende le cartelle attraversate e scrive il percorso relativo, quello dalla radice e l'indirizzo assoluto. Il percorso relativo è un campo: un percorso scritto a mano viene seguito, e uno sbagliato dice dove si ferma.
4. I tre esercizi di "Prova tu".

## Dubbi per Andrea

- `b` e `i`: vanno almeno nominati, visto che molti libri li usano ancora?
- Il percorso dalla radice (`/img/logo.png`) in un riquadro: basta, o va tolto del tutto per non confondere con l'indirizzo assoluto?
- `width` e `height` nell'HTML: d'accordo a tenerli, o li spostiamo al CSS (lezione 95, immagini che si adattano)?
- Serve `target="_blank"`? Molti insegnanti lo chiedono; io l'ho lasciato fuori.

## Da verificare

- "Con `width` e `height` il browser riserva il rettangolo prima che il file arrivi": comportamento dei browser correnti (rapporto calcolato dagli attributi), da ricontrollare su una fonte (MDN, "img: width", consultazione non fatta in questa sessione).
- "Su molti server maiuscole e minuscole nei percorsi contano": dipende dal server, come già detto nella lezione 36.
- Il secondo esercizio controlla `href`: dopo la correzione dell'editor due percorsi che portano allo stesso file sono uguali (`./scaletta.html` passa).
- I controlli di un progetto guardano la pagina del primo file: nel secondo esercizio le altre due pagine servono per provare i link con un clic, non vengono corrette.

## Prova tu

Tre esercizi: `strong`, `em` e `br` in un avviso; i tre link del menu di una pagina che sta in una cartella (su, accanto, altro sito); `alt`, `width`, `height` e un link a un punto della pagina. Provati nel browser con il file di partenza (nessun controllo passa), con risposte sbagliate (`b` e `i` e due paragrafi; `strong` sulla frase intera e due `br`; link senza `..` e senza protocollo; `alt` vuoto, `80px`, `id="#contatti"`) e con la soluzione (passano tutti).

Prerequisiti proposti: inf-html-struttura, inf-markup, inf-file-system, http-html

## Revisione del lotto (7 ottobre 2026)

- Il secondo concerto della pagina con i link interni è ora sabato 27 giugno: il 20 giugno, nella 90, ha ancora "luogo e ingresso da definire".
- Le altre correzioni della revisione sono segnate nei punti della nota a cui si riferiscono.
