# Note: Stili, titoli, tabelle e indici automatici

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Documenti di testo e presentazioni", 3 ottobre
2026). `check.mts` passa su lezione, formulario e flashcard senza errori e senza avvisi.

## Struttura ed esempi

Che cos'è uno stile, con la figura del documento senza e con gli stili; modificare uno stile e la formattazione
diretta; i livelli dei titoli; l'indice automatico in quattro passi, con la figura; figure, tabelle e note
numerate, con didascalia e riferimento incrociato; le tabelle.

Sette esempi: quanti titoli cambiano quando si modifica uno stile; i livelli dei titoli di una ricerca; quante voci
ha l'indice; un titolo fatto a mano che non entra; l'indice dopo una modifica, aggiornato e no; una figura inserita in
mezzo; le celle di una tabella con una riga unita. Quattro avvisi: un titolo non è un testo grande e in grassetto,
scegliere il livello dall'aspetto, consegnare con l'indice non aggiornato, la tabella fatta di spazi.

## Scelte

- L'idea portante è "un titolo è un titolo, non un testo grande e in grassetto": lo stile dichiara che cosa è un
  paragrafo, e da lì vengono indice e numerazioni. Per questo l'indice e le didascalie sono presentati come
  conseguenze degli stili e come campi, lo stesso meccanismo del numero di pagina della lezione 29.
- Nomi degli stili: Titolo 1, Titolo 2, Titolo 3, Corpo del testo, Didascalia. Sono quelli di LibreOffice Writer in
  italiano; in Word il testo normale è "Normale", in Documenti Google "Testo normale". La lezione dice che i nomi
  "cambiano poco" da un programma all'altro e ne usa uno solo.
- Parlo solo di stili di paragrafo. Gli stili di carattere, di pagina e di elenco esistono ma non servono a questa
  lezione.
- "Indice" e non "sommario": la lezione dice una volta che alcuni programmi lo chiamano sommario.
- Le note a piè di pagina hanno tre righe: sono un altro esempio di numerazione automatica, non un argomento a sé.
- Non parlo di bibliografia automatica, indice analitico, numerazione automatica dei capitoli (1, 1.1): la seconda
  potrebbe stare qui, ma allunga la lezione senza aggiungere un'idea.

## Numeri

Rifatti in Python (`/tmp/informatica-cap7/conti.py`): $4 + 9 = 13$ e $4 + 9 + 6 = 19$ voci; $5 + 2 = 7$ per la
pagina; la rinumerazione delle figure (costruendo l'elenco e inserendo); $6 \cdot 3 = 18$, $7 \cdot 3 = 21$,
$21 - 2 = 19$ celle.

## Fonti e cose da verificare

- L'indice va aggiornato a mano in Word, in Writer e in Documenti Google: è quello che ricordo dei tre programmi, da
  verificare sulle versioni in uso. Se un programma lo aggiornasse da solo, l'esempio 5 andrebbe riscritto.
- "La nota resta sempre sulla stessa pagina del suo richiamo": una nota molto lunga può continuare sulla pagina
  seguente. Semplificazione voluta.
- Figure e tabelle con numerazioni separate: è il comportamento predefinito della didascalia in Word e Writer;
  Documenti Google non ha le didascalie automatiche (da verificare). La lezione dice "se la inserisci con il comando
  apposito".
- La ripetizione della riga di intestazione su ogni pagina esiste in Word e Writer; in Documenti Google è arrivata più
  tardi (da verificare).

## Figure

- `documento-senza-e-con-stili` (TikZ): una pagina con titoli e testo; a sinistra le etichette "testo normale" su
  ogni pezzo, a destra Titolo 1, Corpo del testo, Titolo 2.
- `indice-automatico-livelli` (TikZ): un indice con cinque voci su due livelli, puntini e numeri di pagina, e le
  etichette Titolo 1 e Titolo 2 che indicano da dove vengono le voci.

Guardate in chiaro e in scuro.

## Per il generatore

`inf-stili-indici`, sei livelli (specifica in `specs/exercises/inf-stili-indici.md`): lo stile giusto, modificare uno
stile (conto), le voci dell'indice (conto), l'indice dopo una modifica, la numerazione automatica (conto), le celle di
una tabella (conto).

## Domande per Andrea

- Quale nome usare per lo stile del testo normale: "Corpo del testo" (Writer), "Normale" (Word)?
- "Indice" o "sommario"? I libri italiani usano tutti e due.
- La numerazione automatica dei capitoli (1, 1.1, 1.2) va aggiunta a questa lezione?
- Le tabelle hanno qui poche righe (righe, colonne, celle, intestazione, celle unite). Bastano, o serve una lezione
  a parte con bordi, allineamento nelle celle, ordinamento?
- Il conto delle celle dopo un'unione (livello 6 degli esercizi) è un esercizio che dareste?
