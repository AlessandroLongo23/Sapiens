# Note: Informazione, dati e codici

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Informatica e informazione", 3 ottobre 2026).
`check.mts` passa senza errori e senza avvisi sulla lezione, sul formulario e sulle flashcard (20 carte).

## Struttura ed esempi

Dati e informazioni (con l'elaborazione); che cos'è un codice (alfabeto, parola del codice, codifica e decodifica); il
codice binario e il bit, con $2^n$ sequenze; quanti bit servono per $N$ cose, in tre passi; analogico e digitale.

Sette esempi svolti: lo stesso dato in tre informazioni; codificare e decodificare con una tabella; poi i quattro del
procedimento "quanti bit servono" (4 semi, 7 giorni, 26 lettere, 64 e 65 livelli, cioè il caso della potenza esatta e
quello subito dopo); analogico o digitale.

Avvisi: un dato non è per forza un numero; decodificare senza dividere in gruppi; $2^n$ e non $2 \cdot n$; non serve
un bit per ogni cosa; digitale non vuol dire elettronico né più preciso.

La lezione è di 191 righe, poco sopra le 180 indicate: tre figure TikZ ne occupano 45.

## Conti

Rifatti in Python (`/tmp/informatica-cap1/conti.py`): le potenze di due, la codifica di CASA (01001100) e la decodifica
di 01101100 (COSA), i bit per 4, 7, 26, 64, 65, 8 e 256 cose, le carte OCA e SAS delle flashcard.

## Figure

Tre figure TikZ, guardate in chiaro e in scuro:

- `dati-elaborazione-informazioni`: tre blocchi con due frecce;
- `sequenze-di-tre-bit`: l'albero delle otto sequenze di 3 bit;
- `segnale-analogico-e-digitale`: una curva continua accanto agli stessi istanti su quattro livelli.

## Scelte

- "Codice" è definito come regola che associa significati a sequenze di simboli; "alfabeto" e "parola del codice" sono
  spiegati ma non in grassetto, per non caricare la lezione di termini.
- Il codice Morse è descritto a parole ("tre punti, tre linee, tre punti"), senza i segni.
- Il bit è definito qui come simbolo di un codice binario; la lezione 03 lo riprende come unità di misura.
- "Analogico" e "digitale" sono detti delle rappresentazioni, non dei segnali: campionamento e quantizzazione restano
  alle lezioni sulla codifica dei suoni e delle immagini.
- Negli esercizi i dati sono tra virgolette alte (“38,5”) e non tra caporali come nella lezione, perché KaTeX non
  disegna le caporali dentro `\text`.

## Lasciato ad altre lezioni

Byte e multipli (lezione 03); i numeri in base due (lezioni 04-07); ASCII e Unicode, immagini, suoni (lezioni 10-12),
con i link. Codici a lunghezza variabile, ridondanza e correzione degli errori non sono trattati.

## Fonti da verificare

- "Informatica" dal francese informatique, da information e automatique: la parola è attribuita a Philippe Dreyfus,
  1962. Nella lezione c'è solo l'etimologia, senza nome e data. Da verificare (Treccani, voce "informatica").
- "Bit" da binary digit: il termine è attribuito a John Tukey ed è usato da Claude Shannon in "A Mathematical Theory
  of Communication", 1948. Nella lezione c'è solo l'origine della parola. Da verificare.
- Codice Morse: S tre punti, O tre linee. Citato a memoria, da verificare.
- "Digit" vuol dire cifra: nella lezione non si dice che viene dal latino digitus, dito; si può aggiungere se piace.

## Per il generatore

`inf-informazione-dati`, sei livelli (specifica in `specs/exercises/inf-informazione-dati.md`). I livelli 4 e 5 hanno
una risposta numerica, gli altri sono a scelta multipla.

## Domande per Andrea

- La definizione di informazione ("un dato a cui è stato dato un significato") va bene, o il vostro libro usa quella
  con l'incertezza ("ciò che riduce l'incertezza")?
- I documenti e le foto sono chiamati "dati" anche nella lezione 02: va bene usare la stessa parola per il valore
  senza contesto e per il contenuto di un file?
- Pallottoliere e interruttore come esempi di digitale senza elettronica: sono chiari, o confondono?
- L'esempio della musicassetta (la copia di una copia peggiora): gli studenti di oggi la conoscono?
