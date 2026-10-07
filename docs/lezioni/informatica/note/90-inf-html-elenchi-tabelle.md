# Note: Elenchi e tabelle

Lezione nuova, scritta da zero il 7 ottobre 2026 (terzo anno, capitolo "Il linguaggio HTML", gruppo 11), insieme alla
91 sui moduli. Non pubblicata. 397 righe: 6 pagine da modificare (3 di esempio, 3 esercizi), 1 figura interattiva, 1
figura TikZ, 6 riquadri `ad-warning`.

## Struttura

Apertura con le tre cose della pagina dei Fuori Tempo che non sono paragrafi (componenti, scaletta, calendario);
`<ul>`, `<ol>`, `<li>` e la domanda per scegliere tra i due; l'elenco annidato, con l'albero; la tabella una riga
alla volta, `<th>`, `<td>`, `<caption>`; le celle unite con `colspan` e `rowspan` e il conto dei posti; tre esercizi.

## Scelte

- Confine con la 91: tutto quello che l'utente legge qui, tutto quello che l'utente scrive là. Nessun elemento dei
  moduli compare nella 90, e la 91 non ha tabelle.
- Confine con la 88 e la 89: l'albero del documento è della 88 (qui solo richiamato con un link, per spiegare dove
  sta l'elenco interno); link e immagini dentro le celle non ci sono.
- I nomi sono quelli delle lezioni del gruppo 10: Sara (voce), Marta (chitarra), Dario (basso), Leo (batteria); i
  pezzi Controtempo, Ultima campanella, Fuori orario (89), più "Ora buca"; il concerto di fine anno è il 5 giugno
  in aula magna (89). Le altre date (12 aprile al Parco Verdi, 3 maggio in aula magna, 20 giugno da definire) sono
  nostre.
- `<ul>` o `<ol>`: una sola domanda, "se scambio due voci cambia il significato?". Gli attributi di `<ol>` (`start`,
  `reversed`, `type`) e l'elenco di definizioni (`<dl>`) non ci sono.
- Tabelle: `<table>`, `<tr>`, `<th>`, `<td>`, `<caption>`, come nel confine fissato. `<thead>`, `<tbody>`, `<tfoot>`
  e l'attributo `scope` non ci sono: il browser aggiunge `<tbody>` da sé, e lo studente lo vedrà nell'ispettore (97).
  `<th>` è detto "titolo di una colonna o di una riga", ma gli esempi hanno solo intestazioni di colonna.
- I bordi delle tabelle: l'HTML non ne ha, e il lotto vieta gli attributi di presentazione. Le pagine con una tabella
  hanno un `style.css` di due righe, che la lezione dice di usare senza leggerlo, con il link alla 92. È scritto con
  una regola per riga (`table { border-collapse: collapse; }`) per stare nelle 400 righe: la 92 le scrive su più
  righe.
- Celle unite: l'idea che regge la sezione è che la cella assorbita non si scrive più, e il "conto dei posti" (i
  `colspan` della riga più i posti presi da sopra danno le colonne). È un nome nostro, non dei libri.
- La tabella per impaginare: un avviso, come chiede il lotto, con la ragione (lo screen reader la legge come dati) e
  il link alla 94.
- Le pagine sono documenti interi (doctype, `lang`, `charset`, `title`), anche negli esercizi: costano righe ma lo
  studente ritrova sempre la struttura della 88.

## Elementi interattivi

- Pagina "Chi siamo e scaletta" (`codice html`). Domanda: che cosa cambia tra `<ul>` e `<ol>`, e chi scrive i
  numeri? Il testo dopo dice che cosa spostare e che cosa aspettarsi.
- Pagina "La scaletta in due tempi" (`codice html`). Domanda: dove si scrive l'elenco interno, e da che numero
  riparte?
- Pagina "I concerti" (`codice html` con `css`). Domanda: come si scrive una tabella, e che cosa succede a una riga
  con una cella in meno?
- Figura `inf-html-celle-unite` (kit, `CelleUnite.tsx`). Domanda: quando una cella ne prende due, quale cella
  sparisce dal codice, e da quale riga? Lo studente sceglie una cella e la unisce a destra o in basso: la riga del
  codice della cella assorbita viene barrata, e una frase fa il conto dei posti.
- Figura TikZ `albero-elenco-annidato`: l'elenco interno come figlio della voce.
- Tre esercizi con `%% controllo`: elenco numerato con uno annidato; didascalia e riga nuova; `rowspan` e `colspan`.

## Verifiche

- `check.mts`: nessun errore e nessun avviso su lezione, formulario e flashcard (20 carte).
- `verifica.mts`: tre pagine, i controlli si provano nel browser (avviso atteso).
- Nel browser (Chromium, con Playwright), a 1280 e a 390 px, in chiaro e in scuro: nessun errore in console, nessuna
  immagine mancante, nessuno scorrimento laterale. Ogni esercizio è stato verificato con la pagina di partenza (tutti
  i controlli falliti), con la soluzione (tutti superati), con la soluzione riscritta a mano e con tre risposte
  sbagliate ciascuno (l'elenco interno dopo `</li>`, `<ul>` al posto di `<ol>`, un paragrafo rimasto; la didascalia
  fuori dalla tabella, una riga con due celle; `rowspan` e `colspan` senza cancellare la cella assorbita, `rowspan`
  al posto di `colspan`): ogni errore fa fallire il controllo giusto.
- Una risposta sbagliata passa: le celle della riga nuova scritte senza `<tr>`. Il browser aggiunge la riga da sé, e
  la pagina che ne esce è giusta; il controllo guarda la pagina, non il codice.
- La figura è stata guardata a 800, 390 e 330 px, in chiaro e in scuro, in dieci stati (inizio, `colspan`,
  `rowspan`, due `rowspan`, blocco di due per due, intestazioni unite, cella senza vicine, separa, ricomincia,
  tastiera): l'altezza non cambia mai. A 330 px di schermo, più stretto del telefono di riferimento, la riga più lunga
  del codice (una cella con `colspan` e `rowspan` insieme) scorre dentro il suo riquadro.

## Da verificare

- "Per un elenco annidato il browser usa un pallino diverso": vero nei fogli di stile predefiniti dei browser
  (cerchio vuoto al secondo livello, quadrato al terzo); visto in Chromium.
- "Il testo scritto tra una riga e l'altra il browser lo sposta fuori dalla tabella, di solito sopra": è la regola
  del parser HTML ("foster parenting", HTML Living Standard, WHATWG, sezione sul parsing delle tabelle), che lo
  mette prima della tabella. "Di solito" è una cautela.
- "Lo screen reader legge una tabella una cella dopo l'altra come dati": descrizione generale, non provata con uno
  screen reader.
- Una `<caption>` scritta in fondo alla tabella viene mostrata comunque sopra: la lezione dà solo la regola
  ("subito dopo `<table>`") e gli esercizi non usano quel caso come errore.

## Domande per Andrea

- `<thead>` e `<tbody>`: li vuoi già qui, o bastano `<tr>`, `<th>` e `<td>` come nei libri del terzo anno?
- `<th>` come intestazione di riga e l'attributo `scope`: qui o nella 95, con l'accessibilità?
- L'elenco di definizioni (`<dl>`, `<dt>`, `<dd>`) è nel programma? La lezione non lo nomina.
- "Conto dei posti" per controllare una riga con celle unite: va bene come nome, o ne usi un altro in classe?
- Tre esercizi sono troppi per una lezione sola? Il terzo (celle unite) è quello che si può togliere.

Prerequisiti proposti: inf-html-struttura, inf-html-testo-link

## Revisione del lotto (7 ottobre 2026)

- "Screen reader" è diventato "lettore di schermo, il programma che la legge ad alta voce", la parola della 95.
- Esercizio 2, celle senza `<tr>`: un controllo sul numero di righe non lo chiude, perché il browser crea da sé il `<tr>` mancante e l'albero è identico a quello della soluzione. Resta aperto.
