# Le cifre significative

Generatore: `fis-cifre-significative` (`src/lib/exercises/v2/generators/fis-cifre-significative.ts`).
Verifica indipendente: `scripts/exercises/checkers/fis_cifre_significative.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/08-fis-cifre-significative.md` (note in
`docs/lezioni/fisica/note/08-fis-cifre-significative.md`).

Cinque livelli nell'ordine della lezione: contare, arrotondare, somme e differenze, prodotti e quozienti, numeri esatti
e calcoli in più passaggi.

## Nomi dei livelli

1. Contare le cifre
2. Arrotondare
3. Somme e differenze
4. Prodotti e quozienti
5. Numeri esatti e più passaggi

## Le regole della lezione (le stesse per tutti i gruppi di fisica)

- Cifre significative: le cifre certe più la prima incerta. Contano le cifre diverse da zero, gli zeri in mezzo, gli
  zeri finali dopo la virgola; non contano gli zeri iniziali; gli zeri finali di un intero sono ambigui, e si evita
  di scriverli con la notazione scientifica ($1{,}20 \cdot 10^3$).
- Arrotondare: si guarda solo la prima cifra tolta; $5$ o più, l'ultima cifra che resta aumenta di uno.
- Somme e differenze: i decimali del dato che ne ha meno. Prodotti e quozienti: le cifre significative del dato che
  ne ha meno. I numeri esatti non limitano. Si arrotonda solo alla fine.

## Tipi di risposta

Risposte `choice` con quattro opzioni, senza `toChoice`. Livello 1: un numero intero di cifre, `\text{3}`. Livelli
2-5: un numero con la sua unità, scritto come la lezione (`20{,}0\,\text{cm}`, `7{,}9\ \text{m}^2`,
`4{,}6 \cdot 10^{4}\,\text{m}`). `values` è la scrittura senza LaTeX (`"20,0 cm"`, `"4,6e4 m"`), perché qui la
scrittura è la risposta: $8$ e $8{,}00$ sono opzioni diverse. Quattro scritture diverse.

## Regole comuni

- Un numero si scrive in notazione scientifica quando la sua ultima cifra significativa sta a sinistra delle unità
  (non si scrive $46\,000$ per due cifre significative) o quando è uno zero nelle unità ($1{,}0 \cdot 10^1$, non
  $10$); altrimenti in forma decimale. La mantissa sta tra $1$ e $10$, con `\cdot 10^{k}`.
- Virgola decimale `{,}`, separatore `\,` delle migliaia da cinque cifre in su, unità dopo `\,` (o `\ ` prima di un
  esponente).
- Dati costruiti in modo che la prima cifra tolta non sia un $5$ seguito solo da zeri (niente casi a metà), salvo il
  caso dell'arrotondamento a passi, che è costruito apposta.
- Niente trattini lunghi e niente "piuttosto che".

## Livello 1: contare le cifre

"Quante cifre significative ha la misura $x$ unità?" Cinque tipi, circa un quinto ciascuno:

- nessuno zero: $7{,}25$ g, $483$ m;
- zeri iniziali: $0{,}082$ s, $0{,}0045$ m;
- zeri in mezzo: $40{,}07$ cm, $305$ g, $1{,}002$ kg;
- zeri finali dopo la virgola: $3{,}00$ m, $12{,}0$ s, $0{,}0500$ L;
- notazione scientifica: $5{,}0 \cdot 10^{4}$ kg, $3{,}20 \cdot 10^{-3}$ m.

Mai un intero con zeri finali (ambiguo). Risposta da $1$ a $5$. Distrattori: il conto con gli zeri iniziali; il conto
senza gli zeri finali; tutte le cifre scritte, contando anche quelle di $10$ (per $5{,}0 \cdot 10^4$, che ha due cifre
significative, il distrattore è "quattro": $5$, $0$, $1$, $0$); poi i numeri vicini.

Esempi:

- "$0{,}0500$ L." Risposta $3$; distrattori $5$ (gli zeri iniziali), $1$ (senza gli zeri finali), $4$.
- "$40{,}07$ cm." Risposta $4$; distrattori $2$ (senza gli zeri), $3$, $5$.

## Livello 2: arrotondare

"Arrotonda $x$ unità a $n$ cifre significative." Numeri con da quattro a sette cifre significative, $n$ da $1$ a $4$.
Casi:

- numeri decimali qualunque (circa metà);
- numeri che, arrotondati, danno zeri finali da scrivere ($9{,}97 \to 1{,}0 \cdot 10^1$, $2{,}996 \to 3{,}00$), circa un
  sesto;
- numeri grandi da scrivere in notazione scientifica ($46\,781 \to 4{,}7 \cdot 10^{4}$), circa un sesto;
- l'arrotondamento a passi ($2{,}4499 \to 2{,}4$), circa un sesto: le cifre tolte cominciano con $4$ e continuano con
  $5$ o più.

Distrattori: il troncamento; l'arrotondamento a $n$ decimali invece che a $n$ cifre; l'arrotondamento a passi;
l'ordine di grandezza perso ($46$ al posto di $4{,}6 \cdot 10^4$); lo zero finale tolto ($3{,}0$ al posto di
$3{,}00$). Si prendono i primi tre diversi.

Esempi:

- "Arrotonda $26{,}48$ s a tre cifre significative." Risposta $26{,}5$ s; distrattori $26{,}4$ (troncamento),
  $26{,}480$ (tre decimali), $26$.
- "Arrotonda $46\,781$ m a due cifre significative." Risposta $4{,}7 \cdot 10^4$ m; distrattori $47$ m (l'ordine
  di grandezza perso), $4{,}6 \cdot 10^4$ m (il troncamento), $46\,781{,}00$ m (due decimali).

## Livello 3: somme e differenze

Due o tre misure con la stessa unità e un numero diverso di decimali; "Quanto vale la somma?" o "Quanto vale la
differenza?". Contesti: lunghezze in fila, masse su un piatto, tempi di tratti successivi, una massa tolta da un'altra.
Circa una volta su quattro è una differenza di valori vicini, che perde cifre significative ($45{,}82 - 45{,}7 =
0{,}1$).

Distrattori: il risultato della calcolatrice; il risultato con le cifre significative del dato che ne ha meno (la
regola dei prodotti, quando dà un'altra scrittura); il risultato con un decimale in più.

Esempi:

- "$12{,}3$ cm $+\ 0{,}456$ cm $+\ 7{,}25$ cm." Risposta $20{,}0$ cm; distrattori $20{,}006$ cm, $20{,}01$ cm, $20{,}1$ cm.
- "$45{,}82$ g $-\ 45{,}7$ g." Risposta $0{,}1$ g; distrattori $0{,}12$ g, $0{,}120$ g, e il vicino.

## Livello 4: prodotti e quozienti

Due misure; "Quanto vale l'area?", "Quanto vale la velocità?", "Quanto vale la densità?". Il risultato ha le cifre
significative del dato che ne ha meno. Circa una volta su quattro servono zeri finali ($100{,}0 : 12{,}5 = 8{,}00$),
circa una volta su sei la notazione scientifica.

Distrattori: il risultato della calcolatrice (con al più sei cifre); il risultato con i decimali del dato che ne ha
meno (la regola delle somme); una cifra significativa in più; il troncamento.

Esempi:

- "Un rettangolo ha i lati di $2{,}5$ m e di $3{,}17$ m." Risposta $7{,}9\ \text{m}^2$; distrattori $7{,}925$,
  $7{,}93$, e un vicino.
- "Un corridore percorre $100{,}0$ m in $12{,}5$ s." Risposta $8{,}00$ m/s; distrattori $8$ m/s (gli zeri non
  scritti), $8{,}0$ m/s, $8{,}000$ m/s.

## Livello 5: numeri esatti e più passaggi

Quattro casi, circa un quarto ciascuno:

- $n$ oggetti uguali ($n$ da $6$ a $40$), ognuno con la massa $m$: la massa totale ha le cifre di $m$;
- il perimetro di un poligono regolare di $k$ lati: $k \cdot l$, con le cifre di $l$;
- il valore medio di tre o quattro misure: somma, poi divisione per il numero esatto delle misure;
- due passaggi, somma e poi prodotto, come l'esempio 2 della lezione: il risultato intermedio non si arrotonda. I dati
  sono scelti in modo che arrotondare troppo presto cambi l'ultima cifra.

Distrattori: il numero esatto trattato come misura ($4 \cdot 2{,}35 = 9$, con una cifra); l'arrotondamento
intermedio; il risultato della calcolatrice.

Esempi:

- "Il perimetro di un quadrato con il lato di $2{,}35$ cm." Risposta $9{,}40$ cm; distrattori $9$ cm, $9{,}4$ cm,
  $9{,}400$ cm.
- "Due pezzi lunghi $1{,}25$ m e $0{,}6$ m, larghi $0{,}482$ m: l'area della lastra." Risposta $0{,}89\ \text{m}^2$;
  distrattore $0{,}92\ \text{m}^2$ (la lunghezza arrotondata a $1{,}9$ prima del prodotto).

## Esercizi da evitare

- Interi con zeri finali nei dati (ambigui), salvo quando la lezione li usa come esempio di ambiguità (qui mai).
- Risultati con la prima cifra tolta uguale a $5$ seguito da zeri, fuori dal caso costruito apposta.
- Distrattori che, scritti in un'altra forma, sono la risposta.

## Verifica

`scripts/exercises/checkers/fis_cifre_significative.py` rilegge i numeri dal testo come stringhe (per vedere gli zeri),
conta le cifre significative con le regole della lezione, ricalcola somme, prodotti e medie con `Decimal` esatti,
arrotonda con la regola del $5$ al numero di cifre o di decimali giusto, riscrive il risultato con la regola della
notazione scientifica e lo confronta con l'opzione giusta; controlla che le quattro opzioni abbiano scritture
diverse e che nessuna sia la risposta scritta in un altro modo, e la quota dei casi.

Esito: `sample.mts fis-cifre-significative 1000 all` con i seed iniziali 1, 50001 e 777001, 5.000 esercizi ciascuno,
PASS, con le quote dei casi dentro gli intervalli (`CASE_RANGES` su tutti i livelli). `review.mts` esce con codice 0
(tutte le formule passano da KaTeX) e `width.mts` pure: nessuna opzione supera i 252 px (la più larga, al livello 4,
arriva a 124 px); il problema è tutto prosa, spezzata con `textBlock`.

### Errori piantati

74 su 74 bocciati:

- opzione giusta spostata su un'altra, due opzioni con la stessa scrittura, un dato del testo cambiato con la
  risposta lasciata com'era (tre per livello, livelli 1-5);
- uno zero finale tolto dall'opzione giusta ($2{,}30 \to 2{,}3$, $50{,}0 \to 50$; dodici, livelli 2-5);
- la risposta in notazione scientifica scritta per intero come distrattore ($2{,}8 \cdot 10^2$ e $280$; sei,
  livelli 2 e 4);
- un conteggio sbagliato al livello 1 (tutte le opzioni spostate di uno, o l'opzione giusta sostituita);
- un arrotondamento a metà fuori dal caso apposito: al livello 2 il numero cambiato in modo che le cifre tolte
  siano $5$ seguito da zeri, con le opzioni adattate all'arrotondamento per eccesso; $2{,}5\,\text{cm} \cdot
  3{,}1\,\text{cm} = 7{,}75\ \text{cm}^2$ al livello 4 e $12{,}3\,\text{cm} + 4{,}45\,\text{cm}$ al livello 3. Gli
  stessi esercizi con $3{,}17$ e $4{,}46$ passano.

### Esercizi diversi su 1.000

Testi diversi, seed da 1 (tra parentesi da 50001 e da 777001): livello 1 983 (973, 978), livello 2 1.000 (1.000,
999), livello 3 1.000 (1.000, 1.000), livello 4 1.000 (1.000, 1.000), livello 5 997 (993, 998).
