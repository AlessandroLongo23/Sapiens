# Riferimenti relativi e assoluti

Generatore: `inf-riferimenti-celle` (`src/lib/exercises/v2/generators/inf-riferimenti-celle.ts`). Verifica
indipendente: `scripts/exercises/checkers/inf_riferimenti_celle.py`. Lezione collegata: "Riferimenti relativi e
assoluti" (`docs/lezioni/informatica/riscritte/24-inf-riferimenti-celle.md`). Macchinario comune:
`src/lib/exercises/v2/inf-foglio.ts`, `scripts/exercises/checkers/_inf_foglio.py`; la scrittura di formule e tabelle è
quella descritta in `specs/exercises/excel.md`.

Sei livelli nell'ordine della lezione. Ai livelli 1-4 e 6 la risposta è una formula, quindi una scelta (`choice`) tra
quattro; al livello 5 è un numero.

## Nomi dei livelli

1. Copiare lungo la colonna
2. Copiare in un'altra colonna
3. Riferimenti assoluti
4. Riferimenti misti
5. Il valore dopo la copia
6. Quale formula scrivere

## La regola della copia

Una formula copiata da una cella a un'altra si sposta di un certo numero di colonne e di righe. In ogni riferimento
la lettera di colonna si sposta di quelle colonne e il numero di riga di quelle righe, tranne le parti che hanno il
dollaro davanti. Numeri, operatori e parentesi non cambiano. Nessun riferimento esce dal foglio, e la formula copiata
non usa mai la cella in cui arriva.

## Livelli 1-4: la formula dopo la copia

"La cella `C2` contiene la formula `=A2*B2`. La copi e la incolli nella cella `C5`. Che formula compare in `C5`?"
(oppure "La trascini fino alla cella…", solo quando la copia resta nella riga o nella colonna). La formula ha da uno
a tre riferimenti a celle diverse, in una di queste forme: `a+b`, `a-b`, `a*b`, `a/b`, `a*b+c`, `a+b+c`, `(a+b)*c`,
`a-b*c`, `a*2`, `a/b*100`, `(a+b)/2`, `a*b-c`. La cella di partenza sta nelle colonne da `C` a `F` e nelle righe da 2
a 6.

- Livello 1: tutti i riferimenti relativi; la copia resta nella colonna e scende da 1 a 5 righe (o sale di 1 o 2).
- Livello 2: tutti relativi; la copia cambia colonna (da 1 a 3 a destra, 1 o 2 a sinistra) e in metà dei casi anche
  riga.
- Livello 3: un riferimento assoluto (`$E$1`) e almeno uno relativo, nessuno misto; la copia va in basso, a destra o
  in diagonale.
- Livello 4: almeno un riferimento misto (`$A2`, `B$1`), gli altri di qualunque tipo; la copia cambia sia riga sia
  colonna.

Esempi:

1. Livello 1: `=D3/C3` da `E3` a `E5`: `=D5/C5`.
2. Livello 2: `=D2+B2+A2` da `E2` a `G3`: `=F3+D3+C3`.
3. Livello 3: `=F6/$A$7` da `E3` a `E6`: `=F9/$A$7`.
4. Livello 4: `=$F6/C3` da `E3` a `D5`: `=$F8/B5`.

## Livello 5: il valore dopo la copia

La colonna `A` contiene da 3 a 5 numeri interi diversi, da 2 a 40; una cella della colonna `C` o `D`, nella riga 1 o
2, contiene un fattore; `B1` contiene `=A1*fattore` o `=A1/fattore`, e viene copiata fino in fondo alla colonna. Si
chiede il valore di una cella da `B2` in giù. Il riferimento al fattore è scritto in uno di quattro modi:

- `$D$1` oppure `D$1`: la riga è bloccata, la copia funziona (caso "bloccato", circa 7 su 10);
- `D1` oppure `$D1`: la riga non è bloccata, il riferimento scende su una cella vuota e il risultato è 0 (caso "non
  bloccato"; solo con la moltiplicazione, perché con la divisione comparirebbe `#DIV/0!`).

Otto contesti: prezzi e cambio, prezzi e IVA, miglia e chilometri, masse e peso, minuti e secondi, pezzi venduti e
prezzo, punti e punteggio massimo, dollari ed euro. Risultato con al più due decimali.

Esempi:

1. `=A1*D$2` con `D2` = 1,5 e `A3` = 25: in `B3` c'è `=A3*D$2`, che vale 37,5.
2. `=A1*C2` con `C2` = 4 e `A2` = 26: in `B2` c'è `=A2*C3`, e `C3` è vuota: 0.

## Livello 6: quale formula scrivere

Tre situazioni, descritte a parole:

- colonna (circa 4 su 10): dati in una colonna, un valore fisso in una cella lontana, formula da copiare verso il
  basso. Giusta `=B2*$E$1` (7 su 10) oppure `=B2*E$1`;
- riga (3 su 10): dati in una riga, formula da copiare verso destra. Giusta `=C3*$A$5` oppure `=C3*$A5`;
- tabellina (3 su 10): numeri in una colonna e in una riga, formula da copiare in tutto il rettangolo. Giusta
  `=$A2*B$1` (con `*` o con `+`).

Tra le quattro opzioni una sola, copiata in ogni cella da riempire, punta ogni volta alle celle giuste. Il controllo
copia davvero ogni opzione in tutte le celle.

## Esercizi "brutti" da evitare

- copie che non cambiano la formula (tutti i riferimenti assoluti, o misti bloccati proprio nella direzione della
  copia);
- riferimenti che escono dal foglio (`A1` copiato a sinistra o in alto);
- al livello 5 una divisione per una cella vuota; al livello 6 due opzioni che funzionano entrambe.

## Variante a scelta multipla

Quattro opzioni distinte, una corretta. I distrattori sono la stessa copia fatta con una regola sbagliata:

- Livello 1: la formula non cambiata; le lettere spostate al posto dei numeri; solo il primo riferimento spostato;
  una riga in più o in meno.
- Livello 2: solo le righe o solo le colonne spostate; righe e colonne scambiate; la formula non cambiata.
- Livello 3: anche il riferimento assoluto si sposta (con o senza dollari); niente si sposta; si sposta solo
  l'assoluto; la formula giusta senza dollari.
- Livello 4: il dollaro letto dalla parte sbagliata (`$A2` come `A$2`); ogni riferimento con un dollaro trattato da
  assoluto; tutto si sposta; niente si sposta.
- Livello 5: 0 (o, se la risposta è 0, il valore che ci sarebbe con il riferimento bloccato); il valore della riga 1;
  il numero della colonna `A` senza il fattore; il valore di una riga vicina.
- Livello 6: nessun dollaro; dollari su tutto; il dollaro sul dato invece che sul valore fisso; il dollaro dalla
  parte sbagliata.

## Domande per la revisione

- Al livello 5 il caso "non bloccato" ha sempre risposta 0: è l'errore classico, ma dopo qualche esercizio si
  riconosce a colpo d'occhio. Va bene, o è meglio mettere altri numeri sotto la cella del fattore?
- Al livello 6 la formula giusta per la copia in colonna è a volte `=B2*E$1` (misto) e non `=B2*$E$1`: sono giuste
  entrambe, ma tra le opzioni ce n'è una sola. Meglio tenere solo la forma con due dollari?
- Le formule dei livelli 1-4 non hanno un contesto (prezzi, misure): servono delle storie anche lì?
