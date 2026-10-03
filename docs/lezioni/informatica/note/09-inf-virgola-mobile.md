# Note: Numeri reali in virgola mobile

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "La codifica dell'informazione", 3 ottobre 2026).
`check.mts` passa senza errori sui tre file.

## Struttura ed esempi

Numeri binari con la virgola (pesi, lettura, conversione con le moltiplicazioni per 2); perché $0{,}1$ non è esatto,
con la regola del denominatore; la notazione scientifica in base due (forma normalizzata, segno, mantissa,
esponente); lo standard IEEE 754 con i campi a 32 e 64 bit e un solo esempio di codifica ($-6{,}5$); gli errori di
arrotondamento.

Sei esempi svolti: $101{,}011_2 = 5{,}375$; $0{,}625$; $6{,}75$; $0{,}1$ che non finisce; $0{,}00101_2$ normalizzato;
i 32 bit di $-6{,}5$. Avvisi: le cifre dopo la virgola lette come intero; il segno dell'esponente e il conteggio
degli spostamenti; virgola mobile e numeri reali.

## Conti

Rifatti in Python (`fractions`, `decimal`, `struct`): $0{,}1$ in binario ($0{,}0001\,1001\,1001\ldots$); il valore a
64 bit di $0{,}1$ ($0{,}1000000000000000055511151231257827\ldots$); $0{,}1 + 0{,}2 = 0{,}30000000000000004$; dieci
volte $0{,}1$ dà $0{,}9999999999999999$; $4{,}1 + 8{,}2 = 12{,}299999999999999$; i 32 bit di $-6{,}5$
(`1 10000001 1010…0`); $16\,777\,216 + 1$ a 32 bit resta $16\,777\,216$.

## Scelte

- Al livello di una prima: del formato a 32 bit si spiegano i tre campi e l'eccesso 127, con un solo esempio.
  Restano fuori: l'eccesso 1023 dei 64 bit, i numeri denormalizzati, infinito e NaN, lo zero con segno, i modi di
  arrotondamento.
- "Mantissa" e non "significando": è la parola dei libri italiani.
- "Cifre decimali affidabili": circa 7 a 32 bit, 15 o 16 a 64 bit (24 e 53 cifre binarie corrispondono a 7,2 e
  15,95 cifre decimali).
- La notazione scientifica in base dieci è richiamata con due esempi, senza link: nell'elenco delle lezioni di
  matematica e di fisica non c'è una lezione con quel titolo.
- Convenzione non fissata dal README: i numeri binari con la virgola hanno la virgola decimale e il pedice 2
  ($101{,}011_2$), senza raggruppare le cifre; nella sola scrittura periodica di $0{,}1$ le cifre dopo la virgola
  sono a gruppi di quattro.

## Figure

- `pesi-binario-con-la-virgola`: le cifre di $101{,}011_2$ con i pesi. Guardata in chiaro e in scuro.
- `campi-virgola-mobile-32-bit`: i tre campi dei 32 bit di $-6{,}5$. Guardata in chiaro e in scuro.

## Fonti da verificare

- IEEE 754: prima edizione del 1985 (IEEE Std 754-1985), revisioni nel 2008 e nel 2019. Nella lezione non c'è la
  data; ricordata a memoria, da verificare se la si vuole aggiungere.
- "Nei programmi che gestiscono denaro i centesimi si contano spesso con numeri interi": pratica comune, senza una
  fonte precisa; da verificare o togliere.
- "Quasi tutti i calcolatori" seguono IEEE 754: vero per i processori di uso comune; da verificare se si vuole
  essere più precisi.

## Domande per Andrea

- Il formato a 32 bit con l'eccesso 127: è troppo per una prima, o è quello che fate in classe?
- La regola "denominatore potenza di 2" per capire se un numero è esatto in base due: la usate, o basta l'esempio di $0{,}1$?
- "Mantissa" va bene, o il libro usa un altro termine?
- Serve un cenno a infinito e NaN, che gli studenti vedono nel foglio di calcolo e nelle calcolatrici?
