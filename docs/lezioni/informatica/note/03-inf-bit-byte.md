# Note: Bit, byte e unità di misura

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Informatica e informazione", 3 ottobre 2026).
`check.mts` passa senza errori e senza avvisi sulla lezione, sul formulario e sulle flashcard (20 carte).

## Struttura ed esempi

Il bit e il byte; quanti valori con $n$ bit (e il valore massimo $2^n - 1$); i multipli decimali e binari, con le due
tabelle e la figura; il procedimento di conversione in quattro passi; la velocità di trasmissione e il tempo di
scaricamento, in quattro passi.

Nove esempi svolti: il livello massimo in un byte; cinque conversioni (un passo, due passi verso l'unità più grande,
multipli binari, dai bit ai kB, da una famiglia all'altra con il disco da 500 GB); tre sulla velocità (il tempo in
secondi, il tempo in minuti con i GB, i dati scaricati in un certo tempo).

Avvisi: bit e byte non sono la stessa cosa; con 2 byte i valori non sono il doppio; 1 kB non sono 1024 byte;
moltiplicare quando si deve dividere; megabit al secondo, non megabyte al secondo.

La lezione è di 193 righe, poco sopra le 180 indicate: ci sono tre tabelle e due figure.

## Conti

Rifatti in Python (`/tmp/informatica-cap1/conti.py`): le potenze $2^{16}$, $2^{20}$, $2^{24}$, $2^{30}$; tutte le
conversioni degli esempi; $500 \cdot 10^9 : 2^{30} = 465{,}66$; le differenze del $2{,}4\%$ tra KiB e kB e del
$7{,}4\%$ tra GiB e GB (nella lezione "circa il 7%"); i tre esempi sulla velocità; $100 : 8 = 12{,}5$.

## Figure

Due figure TikZ, guardate in chiaro e in scuro:

- `un-byte-otto-bit`: otto caselle, una indicata come 1 bit, la fila come 1 byte;
- `multipli-del-byte`: le due file di multipli, con $\cdot 1000$ e $\cdot 1024$ sulle frecce.

## Scelte

- Le unità seguono il README: kB, MB, GB, TB da 1000; KiB, MiB, GiB, TiB da 1024; la lezione dice una volta che molti
  libri e alcuni sistemi operativi scrivono KB, MB e GB per i multipli da 1024.
- Il bit non ha simbolo, come dice il README. Per le quantità di bit grandi la lezione scrive Mbit (megabit), per
  coerenza con $\text{Mbit/s}$: il README non lo fissava.
- Lo spazio sottile ogni tre cifre parte dai numeri con cinque cifre intere ($65\,536$, ma $4096$), come in fisica.
- La divisione si scrive con i due punti ($72 : 8$), come nelle lezioni di matematica del biennio.
- I multipli della velocità sono solo decimali; il prefisso k di kbit/s è minuscolo.
- Il valore massimo $2^n - 1$ è spiegato contando da 0, senza la numerazione binaria, che è del capitolo dopo.
- Negli esercizi la risposta è un numero nell'unità che la domanda nomina ("Quanti kB sono…"), e il fattore è sempre
  nel testo.

## Lasciato ad altre lezioni

Le basi numeriche e le conversioni tra binario e decimale (lezioni 04-07); le dimensioni di un'immagine e di un suono
(lezioni 11 e 12); le capacità delle memorie (lezione 15). Nibble, word e i multipli oltre il tera non sono trattati.

## Fonti da verificare

- I prefissi binari kibi, mebi, gibi, tebi sono della norma IEC 60027-2 (emendamento del 1998, poi ISO/IEC 80000-13
  del 2008): la lezione dice solo "norma internazionale IEC", senza numero e senza anno. Da verificare.
- "Alcuni sistemi operativi scrivono GB per i multipli da 1024": è il caso di Windows; macOS dal 2009 e molte
  distribuzioni Linux usano i multipli da 1000. La lezione non fa nomi. Da verificare.
- Il byte di 8 bit è lo standard di fatto (ISO/IEC 2382); storicamente sono esistiti byte di altre lunghezze. La
  lezione non ne parla.
- Disco da 500 GB mostrato come 465: il conto è esatto ($465{,}66\,\text{GiB}$); che il numero a schermo sia proprio
  quello dipende dal sistema e dallo spazio riservato. Da verificare se si vuole un'immagine di esempio.

## Per il generatore

`inf-bit-byte`, sei livelli, tutti con risposta numerica e scelta multipla (specifica in
`specs/exercises/inf-bit-byte.md`).

## Domande per Andrea

- kB con la k minuscola e KiB per 1024: il vostro libro usa KB = 1024? Se sì, serve una frase in più per chi studia
  su quel libro?
- "Mbit" per i megabit, senza un simbolo per il bit: va bene, o preferite Mb e Mbps come si legge nelle offerte delle
  connessioni?
- Il passaggio da una famiglia all'altra (GB in GiB) è solo nell'esempio 6 e non negli esercizi: va bene?
- Gli esempi sulla velocità non parlano della differenza tra velocità nominale e reale: aggiungere una riga?
