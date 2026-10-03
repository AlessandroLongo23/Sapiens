# Riferimenti relativi e assoluti

Una tabella vera ha decine di righe, e in ogni riga serve lo stesso conto: il prezzo per la quantità, la base per l'altezza, la massa per l'accelerazione di gravità. Nessuno riscrive la formula trenta volte: la si scrive nella prima riga e la si copia nelle altre. Quando una formula viene copiata, però, i suoi riferimenti cambiano. Sapere come cambiano, e come bloccarli quando non devono cambiare, è quello che distingue un foglio che funziona da uno pieno di zeri e di errori. Le formule e i riferimenti sono quelli della lezione [Celle, valori e formule](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/celle-valori-e-formule).

## Copiare una formula

Una formula si copia come qualunque altra cosa: si seleziona la cella, si copia e si incolla nella cella di arrivo. Per riempire molte celle vicine c'è un modo più rapido: si trascina con il mouse il quadratino che compare nell'angolo in basso a destra della cella selezionata, lungo la colonna o lungo la riga. Il risultato è lo stesso di tante copie una dopo l'altra.

In questo foglio la colonna `C` deve contenere l'area di tre rettangoli.

|   | A | B | C |
|---|---|---|---|
| 1 | Base | Altezza | Area |
| 2 | 3 | 5 | `=A2*B2` |
| 3 | 4 | 6 | |
| 4 | 10 | 2,5 | |

Copiando la formula di `C2` in `C3` non compare di nuovo `=A2*B2`: compare `=A3*B3`, che calcola l'area del secondo rettangolo. Il foglio ha adattato i riferimenti alla nuova riga.

## I riferimenti relativi

Un riferimento scritto senza altri simboli, come `A2`, è un **riferimento relativo**. Il foglio non lo ricorda come "la cella `A2`", ma come una posizione rispetto alla cella in cui sta la formula: per la formula di `C2`, il riferimento `A2` vuol dire "la cella due colonne a sinistra, nella mia stessa riga". Copiata in `C3`, la formula cerca ancora la cella due colonne a sinistra nella sua stessa riga, che adesso è `A3`.

```tikz
% nome: riferimenti-relativi-copia
% alt: Un foglio con le colonne A, B e C: la formula =A2*B2 nella cella C2 punta con due frecce alle celle A2 e B2 della sua riga; copiata nella cella C3 diventa =A3*B3 e punta con due frecce uguali alle celle A3 e B3
\begin{tikzpicture}
\fill[gray!20] (0,0) rectangle (4.9,0.6);
\fill[gray!20] (0,-2.4) rectangle (0.5,0);
\fill[blue!12] (2.9,-1.6) rectangle (4.9,-0.8);
\fill[orange!22] (2.9,-2.4) rectangle (4.9,-1.6);
\foreach \y in {0.6,0,-0.8,-1.6,-2.4} \draw[gray] (0,\y) -- (4.9,\y);
\foreach \x in {0,0.5,1.7,2.9,4.9} \draw[gray] (\x,0.6) -- (\x,-2.4);
\foreach \l/\x in {A/1.1,B/2.3,C/3.9} \node[font=\small\ttfamily] at (\x,0.3) {\l};
\foreach \r/\y in {1/-0.4,2/-1.2,3/-2} \node[font=\small\ttfamily] at (0.25,\y) {\r};
\node[font=\small, text height=1.5ex, text depth=0.4ex] at (1.1,-0.4) {Base};
\node[font=\small, text height=1.5ex, text depth=0.4ex] at (2.3,-0.4) {Altezza};
\node[font=\small, text height=1.5ex, text depth=0.4ex] at (3.9,-0.4) {Area};
\node[font=\small] at (0.9,-1.2) {3};
\node[font=\small] at (2.1,-1.2) {5};
\node[font=\small] at (0.9,-2) {4};
\node[font=\small] at (2.1,-2) {6};
\node[font=\small\ttfamily] at (4.05,-1.2) {=A2*B2};
\node[font=\small\ttfamily] at (4.05,-2) {=A3*B3};
\draw[-{Stealth}, thick, blue!70!black] (3.35,-1.12) -- (2.3,-1.12);
\draw[-{Stealth}, thick, blue!70!black] (3.35,-1.3) to[bend left=22] (1.1,-1.3);
\draw[-{Stealth}, thick, orange!80!black] (3.35,-1.92) -- (2.3,-1.92);
\draw[-{Stealth}, thick, orange!80!black] (3.35,-2.1) to[bend left=22] (1.1,-2.1);
\end{tikzpicture}
```

Da qui viene la regola per sapere che formula compare dopo una copia:

1. conta di quante righe e di quante colonne si sposta la formula, dalla cella di partenza a quella di arrivo;
2. in ogni riferimento relativo aggiungi al numero di riga le righe dello spostamento (toglile, se la copia va verso l'alto);
3. in ogni riferimento relativo sposta la lettera di colonna di altrettante colonne, avanti nell'alfabeto se la copia va a destra e indietro se va a sinistra;
4. numeri, operatori e parentesi restano come sono.

```ad-example
Esempio 1: copia verso il basso
La cella `C2` contiene `=A2*B2` e viene copiata in `C4`.

Da `C2` a `C4` la formula scende di 2 righe e non cambia colonna. I numeri di riga aumentano di 2 e le lettere restano uguali: `A2` diventa `A4`, `B2` diventa `B4`. In `C4` compare `=A4*B4`, che con i dati del foglio vale $10 \cdot 2{,}5 = 25$.
```

```ad-example
Esempio 2: copia verso destra
La cella `B5` contiene `=B2+B3+B4`, la somma dei tre numeri che ha sopra, e viene copiata in `C5`.

La formula si sposta di 1 colonna a destra e resta nella stessa riga. Le lettere avanzano di un posto e i numeri restano uguali: in `C5` compare `=C2+C3+C4`, la somma dei tre numeri sopra `C5`.
```

```ad-example
Esempio 3: copia in diagonale, e verso l'alto
La cella `D6` contiene `=(B6-C4)/2` e viene copiata in `F3`.

Da `D6` a `F3` la formula si sposta di 2 colonne a destra e di 3 righe in alto. `B6` diventa `D3`: la lettera avanza di due posti (da `B` a `D`) e il numero scende di 3. `C4` diventa `E1`. Il 2 è un numero e non cambia: in `F3` compare `=(D3-E1)/2`.
```

```ad-warning
La formula copiata non è uguale all'originale
Chi si aspetta di ritrovare `=A2*B2` anche in `C3` sbaglia: si copia il modo di raggiungere le celle, non i loro indirizzi. È proprio quello che di solito serve.
```

## Quando il riferimento non deve spostarsi

A volte tutte le formule di una colonna devono usare la stessa cella. In questo foglio l'aliquota dell'IVA è scritta una volta sola, nella cella `D1`, così se cambia la si corregge in un solo punto. La cella `D1` contiene il numero 0,22, mostrato come percentuale.

|   | A | B | C | D |
|---|---|---|---|---|
| 1 | Prezzo | IVA | Aliquota | 22% |
| 2 | 20 | `=A2*D1` | | |
| 3 | 35 | | | |
| 4 | 50 | | | |

In `B2` la formula `=A2*D1` funziona: $20 \cdot 0{,}22 = 4{,}4$. Copiata in `B3`, però, diventa `=A3*D2`. Il riferimento al prezzo è sceso di una riga, ed è giusto; anche il riferimento all'aliquota è sceso di una riga, e ora punta a `D2`, che è vuota. Una cella vuota vale 0, quindi in `B3` compare 0, e lo stesso succede in `B4`.

```ad-warning
Una colonna di zeri dopo la copia
Se la prima cella dà il risultato giusto e quelle copiate danno 0, oppure `#DIV/0!` quando la formula divide, quasi sempre un riferimento che doveva restare fermo si è spostato su celle vuote.
```

## I riferimenti assoluti

Un **riferimento assoluto** indica sempre la stessa cella, dovunque venga copiata la formula. Si scrive mettendo il simbolo del dollaro davanti alla lettera e davanti al numero: `$D$1`. Il dollaro non c'entra con i soldi: è un segno che vuol dire "questa parte è bloccata".

La formula giusta per `B2` è `=A2*$D$1`. Quando la copi verso il basso, `A2` è relativo e segue la riga, mentre `$D$1` resta com'è.

```tikz
% nome: riferimento-assoluto-copia
% alt: Un foglio con i prezzi nella colonna A e l'aliquota 22% nella cella D1: le formule =A2*$D$1, =A3*$D$1 e =A4*$D$1 della colonna B puntano tutte e tre, con una freccia ciascuna, alla stessa cella D1
\begin{tikzpicture}
\tikzset{testo/.style={font=\small, text height=1.5ex, text depth=0.4ex}}
\fill[gray!20] (0,0) rectangle (6,0.6);
\fill[gray!20] (0,-2.8) rectangle (0.5,0);
\fill[orange!30] (4.9,-0.7) rectangle (6,0);
\foreach \y in {0.6,0,-0.7,-1.4,-2.1,-2.8} \draw[gray] (0,\y) -- (6,\y);
\foreach \x in {0,0.5,1.6,3.6,4.9,6} \draw[gray] (\x,0.6) -- (\x,-2.8);
\foreach \l/\x in {A/1.05,B/2.6,C/4.25,D/5.45} \node[font=\small\ttfamily] at (\x,0.3) {\l};
\foreach \r/\y in {1/-0.35,2/-1.05,3/-1.75,4/-2.45} \node[font=\small\ttfamily] at (0.25,\y) {\r};
\node[testo] at (1.05,-0.35) {Prezzo};
\node[testo] at (2.6,-0.35) {IVA};
\node[testo] at (4.25,-0.35) {Aliquota};
\node[testo] at (5.45,-0.35) {22\%};
\node[testo] at (1.05,-1.05) {20};
\node[testo] at (1.05,-1.75) {35};
\node[testo] at (1.05,-2.45) {50};
\node[font=\small\ttfamily] at (2.6,-1.05) {=A2*\char36 D\char36 1};
\node[font=\small\ttfamily] at (2.6,-1.75) {=A3*\char36 D\char36 1};
\node[font=\small\ttfamily] at (2.6,-2.45) {=A4*\char36 D\char36 1};
\draw[thick, orange!80!black] (4.9,-0.7) rectangle (6,0);
\draw[-{Stealth}, thick, orange!80!black] (3.52,-1.05) -- (5.15,-0.72);
\draw[-{Stealth}, thick, orange!80!black] (3.52,-1.75) -- (5.4,-0.72);
\draw[-{Stealth}, thick, orange!80!black] (3.52,-2.45) -- (5.65,-0.72);
\end{tikzpicture}
```

```ad-example
Esempio 4: l'IVA con l'aliquota in una cella fissa
La cella `B2` contiene `=A2*$D$1` e viene copiata in `B3` e in `B4`.

In `B3` compare `=A3*$D$1`, che vale $35 \cdot 0{,}22 = 7{,}7$. In `B4` compare `=A4*$D$1`, che vale $50 \cdot 0{,}22 = 11$. Se un giorno l'aliquota cambia, si corregge solo `D1` e il foglio ricalcola tutta la colonna.
```

```ad-example
Esempio 5: una costante di fisica
In un foglio di misure la colonna `A` contiene le masse di tre oggetti in chilogrammi: 0,5 in `A2`, 1,2 in `A3` e 2 in `A4`. La cella `E1` contiene 9,8, cioè i newton che pesa un chilogrammo. Nella colonna `B` si vuole il peso di ogni oggetto.

In `B2` si scrive `=A2*$E$1`, che vale $0{,}5 \cdot 9{,}8 = 4{,}9$. Copiata in basso diventa `=A3*$E$1`, cioè $1{,}2 \cdot 9{,}8 = 11{,}76$, e `=A4*$E$1`, cioè $2 \cdot 9{,}8 = 19{,}6$.
```

## I riferimenti misti

Il dollaro si può mettere anche su una parte sola del riferimento. Si ottiene un **riferimento misto**, in cui è bloccata solo la colonna oppure solo la riga.

| Riferimento | Tipo | Che cosa è bloccato | Copiato da `C2` a `D5` diventa |
|---|---|---|---|
| `A1` | relativo | niente | `B4` |
| `$A$1` | assoluto | colonna e riga | `$A$1` |
| `$A1` | misto | la colonna `A` | `$A4` |
| `A$1` | misto | la riga 1 | `B$1` |

La regola è una sola: ogni dollaro blocca quello che ha subito dopo. Nella copia si sposta solo la parte del riferimento che non ha il dollaro davanti.

I riferimenti misti servono nelle tabelle a doppia entrata, in cui ogni cella combina un valore preso dall'inizio della sua riga con uno preso in cima alla sua colonna. L'esempio classico è la tavola pitagorica.

|   | A | B | C | D |
|---|---|---|---|---|
| 1 | | 1 | 2 | 3 |
| 2 | 1 | `=$A2*B$1` | | |
| 3 | 2 | | | |
| 4 | 3 | | | |

```ad-example
Esempio 6: la tavola pitagorica con una formula sola
La cella `B2` contiene `=$A2*B$1` e viene copiata in tutte le celle da `B2` a `D4`. Che formula compare in `D4`?

Da `B2` a `D4` la formula si sposta di 2 colonne a destra e di 2 righe in basso. In `$A2` la colonna è bloccata e la riga no: diventa `$A4`. In `B$1` la riga è bloccata e la colonna no: diventa `D$1`. In `D4` compare `=$A4*D$1`, che vale $3 \cdot 3 = 9$.

Con due riferimenti relativi la copia avrebbe dato `=C4*D3`, il prodotto di due celle interne alla tabella; con due riferimenti assoluti tutte le celle avrebbero mostrato $1 \cdot 1 = 1$.
```

```ad-example
Esempio 7: tre tipi di riferimento nella stessa formula
La cella `C3` contiene `=$B3+C$1-$F$2` e viene copiata in `E6`.

La formula si sposta di 2 colonne a destra e di 3 righe in basso. `$B3` diventa `$B6`: la colonna è bloccata, la riga scende di 3. `C$1` diventa `E$1`: la riga è bloccata, la lettera avanza di due posti. `$F$2` è assoluto e resta uguale. In `E6` compare `=$B6+E$1-$F$2`.
```

```ad-warning
Il dollaro sta davanti, non dietro
`$A1` blocca la colonna `A`; `A$1` blocca la riga 1. Chi li scambia ottiene una tabella in cui si sposta proprio la parte che doveva restare ferma.
```

## Scegliere il riferimento giusto

Prima di copiare una formula, per ogni riferimento chiediti se nelle copie deve seguire la formula oppure restare dov'è.

1. Guarda in che direzione copierai: verso il basso cambiano i numeri di riga, verso destra cambiano le lettere di colonna.
2. Se il riferimento deve seguire la formula, lascialo relativo.
3. Se deve indicare sempre la stessa cella, mettigli tutti e due i dollari.
4. Se deve restare nella stessa colonna ma cambiare riga, o il contrario, metti il dollaro solo davanti alla parte che resta ferma.
5. Dopo la copia controlla l'ultima cella: selezionala e leggi la formula che contiene.

```ad-note
Spostare non è copiare
Se una cella viene tagliata e incollata altrove, la formula si sposta senza cambiare: continua a puntare alle stesse celle di prima. I riferimenti si adattano solo nella copia.
```

La copia funziona allo stesso modo per le formule che usano una funzione su un intervallo, come `=SOMMA(B2:B6)`: si spostano tutti e due gli estremi dell'intervallo. Le funzioni sono l'argomento della lezione [Le funzioni del foglio di calcolo](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/le-funzioni-del-foglio-di-calcolo).
