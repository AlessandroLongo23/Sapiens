# Note: Struttura di un documento elettronico

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Documenti di testo e presentazioni", 3 ottobre
2026). Lo slug `word` è storico: la lezione parla della struttura di un documento, e i programmi (Word, LibreOffice
Writer, Documenti Google) compaiono una volta, nell'apertura. `check.mts` passa su lezione, formulario e flashcard
senza errori e senza avvisi.

## Struttura ed esempi

Contenuto e forma; i quattro pezzi a cui si applica la formattazione (carattere, paragrafo, pagina, sezione) con una
tabella; la pagina con margini, intestazione, piè di pagina e campi, e il conto dell'area del testo; i caratteri non
stampabili con tabella e figura; pagina nuova con l'interruzione di pagina; i formati dei file.

Sette esempi: contenuto o formattazione; a quale pezzo si applica una scelta; tre conti dell'area del testo (margini
uguali, margini diversi, foglio orizzontale); il titolo che scivola dopo i 14 Invii; quale formato per passare e per
consegnare una ricerca. Quattro avvisi: centrare con gli spazi, Invio alla fine di ogni riga, allineare con gli spazi,
consegnare la foto dello schermo; l'errore della pagina nuova a colpi di Invio è l'esempio 6.

La lezione è di 200 righe, sopra le 110-180 indicate: 50 sono le due figure. Se va accorciata, il primo candidato è
la sezione (quattro righe) oppure l'esempio 4.

## Scelte

- "Formattazione" e non "forma" come termine tecnico: è la parola dei programmi. "Contenuto e forma" resta nel titolo
  della sezione.
- I comandi sono descritti per quello che fanno. Dei tasti nomino solo Invio, Tab e la barra spaziatrice, che sono
  uguali ovunque; non dico come si inseriscono l'interruzione di riga e di pagina (Maiusc + Invio e Ctrl + Invio nei
  tre programmi citati: da verificare, e comunque fuori dalla regola "niente menu").
- I segni dei caratteri non stampabili sono quelli di Word e Writer: ¶, freccia piegata, freccia, puntino. Documenti
  Google li mostra in modo un po' diverso: da verificare.
- La sezione è definita in tre righe con un solo esempio (la pagina orizzontale per una tabella larga): le
  Indicazioni non la chiedono, ma senza di lei "tutte le pagine" dell'intestazione sarebbe falso.
- Il testo semplice sta tra i formati perché mostra il contenuto senza la forma, e richiama la lezione su ASCII e
  Unicode.
- Non parlo di modelli di documento, revisioni, commenti, stampa unione: sono strumenti di un programma, non la
  struttura del documento.

## Numeri

Rifatti in Python (`/tmp/informatica-cap7/conti.py`): le aree del testo degli esempi 3, 4 e 5 ($17$ e $25{,}7$; $16$;
$24{,}7$ centimetri); l'esempio 6 ($26 + 5 + 14 = 45$ righe, il titolo sulla riga $6$ della pagina 2). Un punto
tipografico è $1/72$ di pollice, cioè $0{,}3528\,\text{mm}$: "circa $0{,}35\,\text{mm}$".

## Fonti e cose da verificare

- A4 $210 \times 297\,\text{mm}$, A5 $148 \times 210$, A3 $297 \times 420$: norma ISO 216 (gli A5 e A3 solo negli esercizi).
- Punto tipografico di $1/72$ di pollice: è il punto dei programmi (punto PostScript); il punto Didot dei tipografi
  europei è diverso. Da verificare se Andrea vuole la precisazione.
- `.docx` è il formato Office Open XML (norma ISO/IEC 29500, 2008) e `.odt` è OpenDocument (ISO/IEC 26300, 2006): le
  sigle delle norme non sono nel testo, da verificare se si vogliono citare. "I programmi più diffusi li aprono
  entrambi": vero per Word, Writer e Documenti Google nelle versioni che conosco, da verificare.
- PDF: Portable Document Format, di Adobe (1993), poi norma ISO 32000 (2008). Nel testo c'è solo lo scioglimento della
  sigla. "Non è fatto per essere modificato": un PDF si può ritoccare con programmi appositi, la frase dice lo scopo
  del formato.
- "Il testo di una relazione è di solito di 11 o 12 punti": uso comune, non una norma.

## Figure

- `struttura-pagina-margini` (TikZ): foglio A4 in scala con le quote $21$ e $29{,}7$ cm, area del testo tratteggiata,
  intestazione, piè di pagina con il numero, un margine indicato.
- `caratteri-non-stampabili` (TikZ): cinque righe con puntini, tabulazioni, un'interruzione di riga, i segni di fine
  paragrafo e la linea dell'interruzione di pagina. Il segno ¶ è scritto in modalità matematica (`$\P$`): in testo
  node-tikzjax non trova il carattere.

Guardate tutte e due in chiaro e in scuro con `scripts/figure/anteprima.mjs`.

## Per il generatore

`word`, cinque livelli (specifica in `specs/exercises/word.md`): contenuto o formattazione, l'area del testo (conto), i
caratteri non stampabili, Invii o interruzione di pagina (conto), il formato del file.

## Domande per Andrea

- Va bene "formattazione" per l'aspetto, o il vostro libro usa "formato" o "layout"?
- La sezione: tenerla in questa lezione, o basta nominarla?
- I segni dei caratteri non stampabili (¶, freccia piegata, freccia, puntino) sono quelli che gli studenti vedono
  nei programmi usati a scuola?
- Tra i formati manca `.doc` (il vecchio formato di Word) e manca il formato di Documenti Google, che non è un file:
  vanno nominati?
- Il livello 5 degli esercizi ha come quarta opzione un'immagine della pagina, che non è mai la risposta giusta: va
  bene?
