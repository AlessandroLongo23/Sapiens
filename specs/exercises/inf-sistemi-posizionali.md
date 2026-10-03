# I sistemi di numerazione posizionali

Generatore: `inf-sistemi-posizionali` (`src/lib/exercises/v2/generators/inf-sistemi-posizionali.ts`).
Verifica indipendente: `scripts/exercises/checkers/inf_sistemi_posizionali.py`. Lezione collegata:
"I sistemi di numerazione posizionali" (`docs/lezioni/informatica/riscritte/04-inf-sistemi-posizionali.md`).
Aiuti comuni del capitolo: `src/lib/exercises/v2/inf-basi.ts` e `scripts/exercises/checkers/_inf_basi.py`.

I livelli seguono l'ordine della lezione: numeri romani (un sistema additivo), le cifre ammesse in una
base, il valore di una cifra, la forma polinomiale, il valore in base dieci di un numero scritto in
un'altra base. Ogni numero è estratto per primo e il testo è scritto a partire da lui.

## Scrittura

- La base a pedice (`324_5`, `1101_2`), niente pedice in base dieci; cifre binarie a gruppi di quattro da
  destra con `\,` quando sono più di quattro.
- Numeri romani in tondo: `\mathrm{MCMXC}`.
- Risposta `number` ai livelli 1, 3 e 5 (con `toChoice`), `choice` ai livelli 2 e 4.

## Livello 1: leggere un numero romano

Un numero da 4 a 2100 scritto in forma canonica, con al massimo 7 simboli; da metà in su (tra il 50% e
il 90%) ha almeno una coppia che si sottrae (IV, IX, XL, XC, CD, CM). `params.roman`, `params.value`,
`params.case` (`sottrattivo` o `additivo`).

Esempi svolti:

1. `MCMXC`: M = 1000, CM = 900, XC = 90; somma 1990.
2. `MDXLIII`: 1000 + 500 + 40 + 3 = 1543.

## Livello 2: le cifre di una base

"Quale di queste scritture non può essere un numero in base b?" (circa due volte su tre) oppure
"Quale ... può essere ...?", con b da 2 a 8. Quattro scritture di 3 o 4 cifre senza zero iniziale: una
sola è la risposta. La cifra sbagliata è uguale alla base circa 7 volte su 10 (128 in base otto), più
grande nelle altre. Tra le scritture ammesse almeno una usa la cifra più grande, b - 1. Il campo
`problem` è vuoto: la domanda è nel testo e le scritture sono le opzioni.

Esempi svolti:

1. Base 6, non ammessa tra 456, 4555, 3145, 151: 456, perché contiene la cifra 6.
2. Base 5, ammessa tra 3540, 4031, 2615, 1750: 4031.

## Livello 3: il valore di una cifra

Un numero con una cifra sottolineata, diversa da zero: "Quanto vale, in base dieci, la cifra
sottolineata?". Base dieci circa 3 volte su 10 (3 o 4 cifre), altrimenti base da 2 a 9 (da 3 a 5 cifre,
da 4 a 8 in base due). Peso della posizione fino a 5000. La cifra delle unità compare poco (è il caso
facile). Risposta: cifra per base elevata alla posizione, contata da destra da 0. `params.digits`,
`params.base`, `params.index` (indice da sinistra della cifra sottolineata).

Esempi svolti:

1. `2\underline{3}203_4`: posizione 3, peso 4^3 = 64, valore 3 · 64 = 192.
2. `4\underline{7}28`: posizione 2, peso 100, valore 700.

## Livello 4: la forma polinomiale

Un numero di 3 o 4 cifre in base da 2 a 10, non palindromo (in base due con almeno uno zero). Si sceglie
la forma polinomiale giusta, con tutti i termini, anche quelli con cifra 0, e gli esponenti da n - 1 a 0.
Le forme di tre termini stanno su una riga; quelle di quattro vanno su due righe con
`\begin{gathered}` (due termini e `+ {}`, poi gli altri due), per stare in 252 px.

Esempi svolti:

1. `406_9 = 4 \cdot 9^2 + 0 \cdot 9^1 + 6 \cdot 9^0`.
2. `1011_2 = 1 \cdot 2^3 + 0 \cdot 2^2 + 1 \cdot 2^1 + 1 \cdot 2^0`.

## Livello 5: da una base alla base dieci

Un numero in base da 2 a 9 (5 e 8 più spesso): 3 cifre dalla base cinque in su, 3 o 4 in base tre e
quattro, da 3 a 5 in base due; non palindromo, con almeno due cifre diverse da zero e valore fino a 1000.
I passaggi: la tabella dei pesi sopra le cifre, i prodotti, la somma.

Esempi svolti:

1. `324_8`: pesi 64, 8, 1; 3 · 64 + 2 · 8 + 4 · 1 = 192 + 16 + 4 = 212.
2. `1101_2`: pesi 8, 4, 2, 1; 8 + 4 + 0 + 1 = 13.

## Esercizi "brutti" da evitare

- numeri romani non canonici (IIII, VV) o lunghissimi (MMDCCCLXXXVIII);
- al livello 2, due scritture giuste, o scritture con lo zero iniziale;
- al livello 3, la cifra sottolineata 0 (vale zero in ogni posizione);
- al livello 4, numeri palindromi: gli esponenti rovesciati darebbero lo stesso valore, e un distrattore
  che vale quanto il numero;
- al livello 5, numeri con una sola cifra diversa da zero o con valore oltre 1000.

## Variante a scelta multipla

Quattro opzioni distinte, una corretta.

- Livello 1: tutti i simboli sommati (IV letto 6); una coppia letta al contrario; l'ultimo simbolo
  dimenticato; numeri vicini.
- Livello 2: le altre tre scritture.
- Livello 3: posizioni contate da 1 (un peso in più); posizioni contate da sinistra; pesi della base
  dieci; la cifra da sola; il peso da solo; base per posizione al posto della potenza.
- Livello 4: esponenti da n a 1; esponenti da sinistra; potenze di dieci; cifra e base scambiate;
  base sbagliata di uno. Nessun distrattore vale quanto il numero.
- Livello 5: pesi da sinistra (il numero rovesciato); esponenti da 1 (valore per la base); la scrittura
  letta in base dieci; la somma delle cifre per la base; numeri vicini.

## Nomi dei livelli

Per `level-names.ts`:

1. Numeri romani
2. Le cifre di una base
3. Il valore di una cifra
4. La forma polinomiale
5. Da una base alla base dieci

## Domande per la revisione

- Il livello 1 chiede di leggere un numero romano: è un esercizio da tenere in una lezione sui sistemi posizionali, o basta l'esempio nel testo?
- Al livello 2 il campo `problem` è vuoto e le quattro scritture sono solo nelle opzioni: va bene così?
- Al livello 3 la cifra da valutare è sottolineata. Si legge bene sul telefono, o è meglio scrivere "la cifra 3 nella posizione 2"?
- Al livello 4 le forme di quattro termini vanno su due righe: si leggono bene nei bottoni delle risposte?
- Le basi usate sono tutte quelle da 2 a 9, non solo 2, 5 e 8 della lezione: restringere?
