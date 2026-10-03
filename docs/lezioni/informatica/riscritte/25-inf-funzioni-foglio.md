# Le funzioni del foglio di calcolo

Per sommare cinque misure si può scrivere `=B2+B3+B4+B5+B6`. Con trenta voti o trecento misure una formula così diventa lunghissima, e basta dimenticare una cella per sbagliare il totale. Le funzioni risolvono il problema: sono calcoli già pronti, a cui si dice solo su quali celle lavorare. Qui servono le formule della lezione [Celle, valori e formule](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/celle-valori-e-formule), in particolare gli intervalli come `B2:B6`.

## Come è fatta una funzione

Una **funzione** è un calcolo predefinito che ha un nome. Si scrive il nome, poi una parentesi tonda aperta, i dati su cui lavorare e la parentesi chiusa. I dati tra le parentesi si chiamano **argomenti**; quando sono più di uno si separano con il punto e virgola.

```tikz
% nome: funzione-nome-argomenti
% alt: La formula =SOMMA(B2:B6;10) divisa nelle sue parti: il segno uguale, il nome della funzione SOMMA, i due argomenti B2:B6 e 10 tra parentesi, e il punto e virgola che li separa
\begin{tikzpicture}
\tikzset{pezzo/.style={font=\ttfamily\large, inner sep=0pt, anchor=base west}, nota/.style={font=\small}}
\node[pezzo] (u) at (0,0) {=};
\node[pezzo] (n) at (u.base east) {SOMMA};
\node[pezzo] (a) at (n.base east) {(};
\node[pezzo] (r) at (a.base east) {B2:B6};
\node[pezzo] (s) at (r.base east) {;};
\node[pezzo] (d) at (s.base east) {10};
\node[pezzo] (c) at (d.base east) {)};
\draw[thick, blue!70!black] (n.south west) ++(0,-0.12) -- ($(n.south east)+(0,-0.12)$);
\draw[thick, blue!70!black] ($(n.south)+(0,-0.12)$) -- ++(0,-0.45);
\node[nota, below] at ($(n.south)+(-0.3,-0.55)$) {nome della funzione};
\draw[thick, orange!80!black] ($(r.north west)+(0,0.12)$) -- ($(r.north east)+(0,0.12)$);
\draw[thick, orange!80!black] ($(d.north west)+(0,0.12)$) -- ($(d.north east)+(0,0.12)$);
\draw[thick, orange!80!black] ($(r.north)+(0,0.12)$) -- ++(0,0.3) -| ($(d.north)+(0,0.12)$);
\node[nota, above] at ($(s.north)+(-0.2,0.45)$) {argomenti};
\draw[thick, gray] ($(s.south)+(0,-0.12)$) -- ++(0,-0.45);
\node[nota, below right] at ($(s.south)+(-0.4,-0.55)$) {separatore};
\end{tikzpicture}
```

Un argomento può essere un numero, un riferimento a una cella, un intervallo oppure un'altra formula. La funzione `=SOMMA(B2:B6;10)` della figura ha due argomenti: addiziona tutti i numeri dell'intervallo `B2:B6` e poi aggiunge 10.

Una funzione sta dentro una formula, quindi davanti ci vuole sempre il segno `=`. I nomi si possono scrivere in maiuscolo o in minuscolo: il foglio li riporta in maiuscolo.

```ad-note
I nomi cambiano con la lingua del programma
In un programma impostato in italiano le funzioni hanno nomi italiani: SOMMA, MEDIA, ARROTONDA. In uno impostato in inglese le stesse funzioni si chiamano SUM, AVERAGE, ROUND, e gli argomenti si separano con la virgola. In queste lezioni i nomi sono sempre quelli italiani.
```

## Le funzioni che servono più spesso

| Funzione | Che cosa calcola | Esempio |
|---|---|---|
| `SOMMA` | la somma dei numeri | `=SOMMA(B2:B6)` |
| `MEDIA` | la media aritmetica dei numeri | `=MEDIA(B2:B6)` |
| `MIN` | il numero più piccolo | `=MIN(B2:B6)` |
| `MAX` | il numero più grande | `=MAX(B2:B6)` |
| `CONTA.NUMERI` | quante celle contengono un numero | `=CONTA.NUMERI(B2:B6)` |
| `ARROTONDA` | un numero arrotondato alle cifre decimali indicate | `=ARROTONDA(B2;1)` |

La media aritmetica è la somma dei valori divisa per quanti sono, come nella lezione [Media, mediana e moda](/materiale/scuola-superiore/matematica/statistica/media-mediana-e-moda).

Per calcolare a mano il valore di una funzione su un intervallo:

1. trova le celle dell'intervallo, dalla prima all'ultima;
2. tieni solo quelle che contengono un numero;
3. applica a quei numeri il calcolo della funzione.

Gli esempi usano questo foglio, con cinque misure del periodo di un pendolo fatte in laboratorio.

|   | A | B |
|---|---|---|
| 1 | Prova | Periodo (s) |
| 2 | 1 | 1,42 |
| 3 | 2 | 1,38 |
| 4 | 3 | 1,45 |
| 5 | 4 | 1,40 |
| 6 | 5 | 1,41 |

```ad-example
Esempio 1: somma e media
Che cosa mostrano `=SOMMA(B2:B6)` e `=MEDIA(B2:B6)`?

L'intervallo `B2:B6` contiene 1,42, 1,38, 1,45, 1,40 e 1,41. La somma è $1{,}42 + 1{,}38 + 1{,}45 + 1{,}40 + 1{,}41 = 7{,}06$. La media divide la somma per il numero dei valori: $7{,}06 : 5 = 1{,}412$.
```

```ad-example
Esempio 2: minimo, massimo e quanti sono
Sullo stesso intervallo, `=MIN(B2:B6)` mostra 1,38 e `=MAX(B2:B6)` mostra 1,45: la misura più piccola e la più grande. `=CONTA.NUMERI(B2:B6)` mostra 5, il numero delle misure.

Le funzioni si usano anche dentro una formula più lunga. La differenza tra la misura più grande e la più piccola è `=MAX(B2:B6)-MIN(B2:B6)`, che vale $1{,}45 - 1{,}38 = 0{,}07$.
```

```ad-warning
I due punti non sono il punto e virgola
`=SOMMA(B2:B6)` addiziona le cinque celle da `B2` a `B6`. `=SOMMA(B2;B6)` ha due argomenti e addiziona solo `B2` e `B6`: nel foglio delle misure dà $1{,}42 + 1{,}41 = 2{,}83$ al posto di 7,06.
```

## Celle vuote e celle con un testo

Le funzioni di questa lezione lavorano solo sui numeri. Se nell'intervallo c'è una cella vuota o una cella che contiene un testo, la saltano. Per `SOMMA`, `MIN` e `MAX` non cambia niente; per `MEDIA` e `CONTA.NUMERI` sì, perché cambia quanti sono i valori.

```ad-example
Esempio 3: la media con un assente
Le celle da `B2` a `B6` di un altro foglio contengono i voti di cinque verifiche: 7, 8, la parola assente, 6,5 e 9. Che cosa mostra `=MEDIA(B2:B6)`?

La cella con il testo viene saltata: restano quattro numeri, e `=CONTA.NUMERI(B2:B6)` mostra infatti 4. La somma è $7 + 8 + 6{,}5 + 9 = 30{,}5$ e la media è $30{,}5 : 4 = 7{,}625$.
```

```ad-warning
Una cella vuota non è uno zero
Nell'esempio 3 la media si fa su quattro voti, non su cinque. Se al posto di assente scrivi 0, lo zero è un numero e conta: la media diventa $30{,}5 : 5 = 6{,}1$. Lascia vuota la cella di un dato che manca, e scrivi 0 solo quando il valore è davvero zero.
```

Con gli operatori è diverso. Una formula come `=B2+B4`, se `B4` contiene un testo, dà l'errore `#VALORE!`; la funzione `SOMMA` invece salta il testo e va avanti.

## Più argomenti e intervalli rettangolari

Un intervallo può prendere più colonne, e una funzione può avere più argomenti. Questo foglio contiene le spese di due mesi.

|   | A | B | C |
|---|---|---|---|
| 1 | Spesa | Gennaio | Febbraio |
| 2 | Trasporti | 30 | 25 |
| 3 | Merende | 18 | 22 |
| 4 | Cinema | 12 | 0 |

```ad-example
Esempio 4: un rettangolo, oppure due intervalli
`=SOMMA(B2:C4)` addiziona le sei celle del rettangolo che va da `B2` a `C4`: $30 + 25 + 18 + 22 + 12 + 0 = 107$.

`=SOMMA(B2:B4;C2:C4)` ha due argomenti, uno per mese, e addiziona le stesse sei celle: $60 + 47 = 107$. Con due argomenti si possono unire anche intervalli lontani tra loro.

`=MAX(B2:C4)` cerca il numero più grande in tutto il rettangolo e mostra 30.
```

## Arrotondare un risultato

La funzione `ARROTONDA` ha sempre due argomenti: il numero da arrotondare e quante cifre decimali tenere.

`=ARROTONDA(numero;cifre)`

Si guarda la prima cifra che viene tolta: se è 5 o più, l'ultima cifra tenuta aumenta di uno; se è 4 o meno, resta com'è.

```ad-example
Esempio 5: lo stesso numero con cifre diverse
La cella `B7` contiene 7,625.

`=ARROTONDA(B7;1)` tiene una cifra decimale. La prima cifra tolta è 2: il 6 resta, e il risultato è 7,6.

`=ARROTONDA(B7;2)` tiene due cifre decimali. La prima cifra tolta è 5: il 2 aumenta di uno, e il risultato è 7,63.

`=ARROTONDA(B7;0)` non tiene cifre decimali. La prima cifra tolta è 6: il 7 aumenta di uno, e il risultato è 8.
```

```ad-warning
Arrotondare non è tagliare
`=ARROTONDA(7,68;1)` dà 7,7 e non 7,6. Chi toglie le cifre in più senza guardare la prima che scarta sbaglia tutte le volte che quella cifra è 5 o più.
```

```ad-note
Mostrare meno cifre non cambia il numero
Con i comandi di formato si può far vedere un numero con meno cifre decimali: la cella mostra 1,41, ma continua a contenere 1,412 e nei calcoli usa quello. `ARROTONDA` invece cambia davvero il valore.
```

## Una funzione dentro un'altra

L'argomento di una funzione può essere il risultato di un'altra funzione. Si dice che le funzioni sono **annidate**. Il foglio le calcola dall'interno verso l'esterno, come le parentesi di un'espressione.

```ad-example
Esempio 6: la media arrotondata
Nel foglio delle misure, che cosa mostra `=ARROTONDA(MEDIA(B2:B6);2)`?

Prima la funzione interna: `MEDIA(B2:B6)` vale 1,412. Poi quella esterna lavora su questo valore: `ARROTONDA` con 2 cifre guarda la terza, che è 2, e lascia 1,41.

Le parentesi vanno contate: ogni funzione apre la sua e la chiude. Qui la prima parentesi chiusa appartiene a `MEDIA`, l'ultima ad `ARROTONDA`, e il `;2` sta tra le due perché è il secondo argomento di `ARROTONDA`.
```

```ad-example
Esempio 7: una funzione fatta con altre due
La media è la somma divisa per quanti sono i numeri. Nel foglio delle misure la formula `=SOMMA(B2:B6)/CONTA.NUMERI(B2:B6)` calcola $7{,}06 : 5 = 1{,}412$, lo stesso valore di `=MEDIA(B2:B6)`.
```

```ad-warning
Il nome va scritto giusto
Se scrivi `=SOMA(B2:B6)` o `=MEDIE(B2:B6)`, il foglio non riconosce il nome e mostra l'errore `#NOME?`. Lo stesso errore compare se usi il nome inglese in un programma impostato in italiano.
```

Le funzioni che prendono una decisione, come `SE`, e quelle che contano o sommano solo le celle che rispettano una condizione sono l'argomento della lezione [Condizioni e funzioni logiche](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/condizioni-e-funzioni-logiche). Per riassumere una tabella lunga con totali e medie per gruppo c'è la lezione [Ordinare, filtrare e riassumere i dati](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/ordinare-filtrare-e-riassumere-i-dati).
