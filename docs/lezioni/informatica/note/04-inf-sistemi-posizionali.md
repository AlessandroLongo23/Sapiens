# Note: I sistemi di numerazione posizionali

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "I sistemi di numerazione", 3 ottobre 2026).
`check.mts` passa sui tre file senza errori e senza avvisi.

## Struttura ed esempi

Numero e scrittura del numero; i numeri romani come sistema additivo (tabella dei simboli, regola della sottrazione,
perché è scomodo); sistema posizionale, base, cifre, posizioni contate da destra da 0, peso; lo zero come segnaposto;
la forma polinomiale; il cambio di base con la tabella delle basi 2, 5, 8, 10 e il procedimento in quattro passi per
trovare il valore in base dieci; contare in un'altra base (tabella da 0 a 10 nelle quattro basi); quanti numeri con n
cifre; perché i computer usano la base due, con i link alle lezioni 03, 05 e 07.

Quattro esempi svolti: MCMXC (1990), $1101_2$ (13), $324_5$ (89), $207_8$ (135, con lo zero in mezzo). Avvisi:
l'esponente più alto è il numero delle cifre meno uno; una cifra non può essere uguale alla base; le stesse cifre in
basi diverse sono numeri diversi.

I conti sono stati rifatti in Python (`/tmp/informatica-cap2/conti.py`): valori nelle varie basi, tabella del contare,
$47\,280$ dell'avviso sugli esponenti.

## Scelte

- La conversione da base dieci a un'altra base non c'è: è l'argomento della lezione 05 per la base due e della 06 per
  la base sedici. Qui si va solo da una base alla base dieci, che è la forma polinomiale applicata.
- La base sedici è solo nominata nel link finale; la tabella delle basi si ferma a 2, 5, 8, 10, come chiesto.
- Il termine è "peso" della posizione (Hoepli e Atlas lo usano); "valore posizionale" non compare.
- Lettura dei numeri in altre basi: "uno uno zero uno in base due".
- La lezione è lunga 181 righe, al limite: le tabelle e i quattro esempi contano molte righe ma poco testo.

## Fonti da verificare

- Fibonacci e il Liber abaci, 1202: data nota e ripetuta dai libri di testo; la formula "nate in India, arrivate in
  Europa attraverso i matematici arabi" è la versione scolastica. Da verificare su una fonte (per esempio la voce
  "Fibonacci" dell'Enciclopedia Treccani) prima della pubblicazione.
- I numeri romani "senza zero" e la regola della sottrazione: la forma canonica moderna (IV, IX, XL, XC, CD, CM) è
  quella dei libri; nell'antichità si trovava anche IIII. La lezione non lo dice. Da decidere se serve una riga.

## Figure

- `pesi-posizioni-base-dieci` (TikZ, 405 x 171 px): le cifre di 4728 con posizione, peso e valore.
- `pesi-posizioni-base-due` (TikZ, 405 x 212 px): lo stesso per $1101_2$, con la somma 13.

Guardate in chiaro e in scuro con `scripts/figure/anteprima.mjs`: niente sovrapposizioni.

## Per il generatore

`inf-sistemi-posizionali`, cinque livelli (specifica in `specs/exercises/inf-sistemi-posizionali.md`): numeri romani,
le cifre di una base, il valore di una cifra, la forma polinomiale, da una base alla base dieci.

## Domande per Andrea

- Numeri romani: bastano come esempio di sistema additivo, o il libro ne usa un altro (i geroglifici egizi)?
  E serve un livello di esercizi sulla loro lettura?
- Basi degli esercizi: tutte quelle da 2 a 9, o solo 2, 5 e 8 come negli esempi della lezione?
- "Peso" della posizione: è il termine che usi in classe, o preferisci "valore posizionale"?
- La forma polinomiale si scrive con tutti i termini, anche $0 \cdot 8^1$ e l'esponente $0$ sull'ultima cifra: va bene?
