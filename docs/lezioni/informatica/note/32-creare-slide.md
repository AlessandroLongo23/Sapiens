# Note: Slide efficaci: testo, immagini e grafici

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Documenti di testo e presentazioni", 3 ottobre
2026). `check.mts` passa su lezione, formulario e flashcard senza errori e senza avvisi.

## Struttura ed esempi

Poco testo; testo che si legge dal fondo dell'aula (dimensione e contrasto), con la tabella delle tre regole e la
figura della slide carica accanto a quella pulita; immagini e grafici che dicono una cosa sola; quanti pixel servono
a un'immagine, con il procedimento; lo schema delle diapositive, con la figura; animazioni e transizioni; le fonti
delle immagini e il diritto d'autore.

Sei esempi: da un paragrafo a tre punti; controllare una slide con le tre regole; tre conti dei pixel (tutta la
larghezza, metà, un terzo su uno schermo più grande); tre immagini di origine diversa. Tre avvisi: provare la
slide solo sul proprio schermo, stirare un'immagine, "l'ho trovata con il motore di ricerca"; l'errore di leggere le
slide è nel testo della prima sezione e nel formulario.

## Scelte

- Le soglie sono due numeri soli: al massimo $6$ righe, almeno $24$ punti. Sono regole pratiche, e la lezione lo dice.
  Negli esercizi le soglie sono scritte nel testo.
- Il contrasto è definito come differenza di luminosità, e la regola è "uno chiaro e uno scuro". Non uso il rapporto
  di contrasto delle linee guida per l'accessibilità del web (WCAG), che chiede un conto fuori portata. Non parlo dei
  colori che chi è daltonico non distingue: sarebbe un'aggiunta utile, in due righe, se Andrea la vuole.
- Non do una regola che leghi la dimensione dei caratteri alla distanza del pubblico. Ne esistono (altezza delle
  lettere pari a una frazione della distanza), ma non ne ho una con una fonte che potessi controllare, e per passare
  dai punti ai centimetri sullo schermo servirebbero le misure della slide, che cambiano da un programma all'altro. Al
  suo posto c'è la prova pratica (guardare la slide dal fondo della stanza). Il conto della lezione è quello dei
  pixel, che si appoggia alla lezione sulla codifica delle immagini.
- "Schema delle diapositive" per il modello comune (in PowerPoint "schema diapositiva", in Impress "schema", in
  Presentazioni Google "tema"): da confermare.
- Il diritto d'autore è detto con tre casi e una tabella. Non cito la legge e non parlo delle eccezioni per la
  didattica, vedi sotto.

## Numeri

Rifatti in Python (`/tmp/informatica-cap7/conti.py`): $1920 \cdot 1/2 = 960$; $3840 : 3 = 1280$; $1920 : 3 = 640$;
$120 : 2 = 60$ bottigliette nell'esempio 1.

## Fonti e cose da verificare

- "Al massimo 6 righe" e "almeno 24 punti": regole pratiche dei manuali sulle presentazioni (la "regola del 6 per
  6" e simili), senza una fonte unica; altri testi dicono 5 o 7 righe, 18 o 28 punti. Da confermare con Andrea.
- Full HD $1920 \times 1080$ pixel: definizione corrente. Gli schermi degli esercizi ($1280 \times 720$,
  $2560 \times 1440$, $3840 \times 2160$) sono formati diffusi; quale abbiano i proiettori delle scuole non lo so.
- Diritto d'autore: in Italia è la legge 22 aprile 1941, n. 633, e la protezione nasce con l'opera, senza bisogno di
  scritte. La legge prevede eccezioni per l'insegnamento (articolo 70): non sono nel testo, perché non so dire con
  sicurezza che cosa coprono per una presentazione di classe o pubblicata sul sito della scuola. Da verificare con chi
  segue la parte legale.
- Licenza Creative Commons CC BY: permette l'uso, anche modificato e anche commerciale, a patto di indicare l'autore
  e la licenza (testo della licenza CC BY 4.0, da verificare). La lezione non nomina le altre licenze (NC, ND, SA).
- "Sì, è tua" per una foto fatta dallo studente: vero per il diritto d'autore; se nella foto ci sono persone
  riconoscibili serve anche il loro consenso. Non è nel testo, da decidere se aggiungerlo.
- Esercizi, livello 3: "Il cratere dell'Etna è a più di tremila metri". La quota dell'Etna è di circa 3 350 metri e
  cambia con le eruzioni (INGV): "più di tremila" resta vero, da verificare.

## Figure

- `slide-carica-e-slide-pulita` (TikZ): due slide affiancate, una con nove righe fitte e tre immagini piccole, una con
  tre punti e un'immagine grande.
- `schema-delle-diapositive` (TikZ): lo schema in alto e tre slide sotto, con la stessa barra del titolo e lo stesso
  logo e contenuti diversi.

Guardate in chiaro e in scuro. Nel tema scuro i colori si invertono: per questo non c'è una figura sul contrasto,
che in scuro direbbe il contrario.

## Per il generatore

`creare-slide`, sei livelli (specifica in `specs/exercises/creare-slide.md`): la regola non rispettata, la slide che
rispetta le regole, l'immagine o il grafico giusto, i pixel di un'immagine (conto), schema slide animazione
transizione, le fonti delle immagini.

## Domande per Andrea

- Le soglie $6$ righe e $24$ punti vanno bene, o il libro in uso ne dà altre?
- Serve una regola sulla dimensione dei caratteri in funzione della distanza? Se sì, quale e da quale fonte.
- "Schema delle diapositive" è il nome che usate in classe?
- Sul diritto d'autore: va bene la regola generale (senza licenza serve il permesso), o volete citare l'eccezione per
  l'uso didattico?
- Aggiungere due righe sui colori che chi è daltonico confonde (rosso e verde)?
