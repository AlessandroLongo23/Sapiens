# Note: Addizione e moltiplicazione in binario

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "I sistemi di numerazione", 3 ottobre 2026).
`check.mts` passa sui tre file senza errori e senza avvisi.

## Struttura ed esempi

La tabella dell'addizione di due bit, il riporto e il caso 1 + 1 + 1; l'addizione in colonna in quattro passi; il
traboccamento su un numero fisso di bit, come riconoscerlo, la differenza tra riporto e traboccamento; la
moltiplicazione: per un bit, per una potenza di due (scorrimento), in colonna come somma di copie spostate; quanti
bit ha un prodotto; la sottrazione con il prestito in un paragrafo, con il link alla lezione 08.

Sette esempi svolti: $101_2 + 10_2$ senza riporti; $1011_2 + 110_2$ con i riporti in catena;
$1011\,0111_2 + 0101\,1101_2$ (183 + 93 = 276); 200 + 100 su 8 bit, che lascia 44; $1011_2 \cdot 100_2$;
$1011_2 \cdot 101_2$ (55); $1101_2 \cdot 1011_2$ (143). Avvisi: 1 + 1 non fa 2; un riporto non è un traboccamento;
ogni copia va spostata.

I conti sono stati rifatti in Python (`/tmp/informatica-cap2/conti.py`), colonna per colonna negli esempi 2 e 3.

## Scelte

- "Traboccamento" con "overflow" tra parentesi alla prima occorrenza, poi sempre traboccamento. Il README non fissava
  il termine: i libri usano spesso solo overflow.
- "Scorrimento" a sinistra per lo shift; "prestito" per il borrow.
- Il traboccamento è definito solo per i numeri senza segno: esce un riporto dall'ultima colonna. La versione con il
  segno è della lezione 08 (altro gruppo).
- La sottrazione ha un solo paragrafo e un solo conto, senza esempi nei riquadri e senza esercizi: il titolo della
  lezione è addizione e moltiplicazione, e i computer sottraggono con il complemento a due.
- Niente divisione.
- L'esempio di tutti i giorni per il traboccamento è il contachilometri a sei cifre che torna a zero: non è binario, ma
  è lo stesso meccanismo e non richiede fonti. Ho evitato gli aneddoti sui videogiochi (il livello 256 di Pac-Man), che
  andrebbero verificati.
- La lezione è lunga 206 righe, più delle 180 indicate: le quattro operazioni in colonna occupano da sole 40 righe.

## Figure

- `addizione-binaria-in-colonna` (TikZ, 276 x 153 px): $1011 + 0110$ in colonna con i tre riporti cerchiati e i valori
  in base dieci a destra.
- `traboccamento-otto-bit` (TikZ, 426 x 135 px): gli otto bit del registro con $0010\,1100$ e il nono bit fuori, in
  una casella tratteggiata, "riporto perso".

Guardate in chiaro e in scuro: niente sovrapposizioni. Le altre operazioni in colonna sono formule (`array` di KaTeX).

## Per il generatore

`inf-aritmetica-binaria`, cinque livelli (specifica in `specs/exercises/inf-aritmetica-binaria.md`): addizioni con il
riporto, riporti in catena, il traboccamento, per una potenza di due, moltiplicazioni in colonna.

## Domande per Andrea

- "Traboccamento" o "overflow"? In classe quale parola usi?
- La sottrazione in colonna con il prestito va insegnata davvero, con esempi ed esercizi, o basta il paragrafo?
- La moltiplicazione in colonna: fino a che dimensione (qui 5 bit per 4 bit)?
- Nella moltiplicazione le copie si sommano due alla volta, come nell'esempio 7, o tutte insieme in colonna?
