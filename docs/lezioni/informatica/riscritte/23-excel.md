# Celle, valori e formule

Un foglio di calcolo è una grande tabella in cui ogni casella può contenere un dato oppure una formula che il programma calcola da solo. Serve ogni volta che ci sono numeri da mettere in ordine e conti da ripetere: la media dei voti, le spese di una gita, le misure di un esperimento di fisica. I programmi più diffusi sono Excel, LibreOffice Calc e Fogli Google: cambiano i menu, ma celle e formule funzionano allo stesso modo in tutti e tre.

## Righe, colonne e celle

Il foglio è diviso in **colonne**, indicate da lettere (`A`, `B`, `C`, ...), e in **righe**, indicate da numeri (1, 2, 3, ...). Dopo la colonna `Z` le lettere diventano due: `AA`, `AB`, `AC` e così via.

L'incrocio di una colonna con una riga è una **cella**. Ogni cella ha un **indirizzo**, fatto dalla lettera della colonna seguita dal numero della riga: `B3` è la cella della colonna `B` nella riga 3. Si scrive sempre prima la lettera e poi il numero.

Un **intervallo** è un rettangolo di celle vicine. Si indica con l'indirizzo della cella in alto a sinistra e quello della cella in basso a destra, separati dai due punti: `C2:D4` contiene le celle `C2`, `D2`, `C3`, `D3`, `C4` e `D4`.

```tikz
% nome: foglio-celle-intervallo
% alt: Una griglia con le colonne A, B, C, D e le righe da 1 a 5: è evidenziata la cella B3, all'incrocio della colonna B con la riga 3, ed è evidenziato l'intervallo C2:D4, un rettangolo di sei celle
\begin{tikzpicture}
\fill[gray!20] (0,0) rectangle (4.7,0.6);
\fill[gray!20] (0,-3) rectangle (0.7,0);
\fill[blue!20] (1.7,-1.8) rectangle (2.7,-1.2);
\fill[orange!30] (2.7,-2.4) rectangle (4.7,-0.6);
\foreach \y in {0.6,0,-0.6,-1.2,-1.8,-2.4,-3} \draw[gray] (0,\y) -- (4.7,\y);
\foreach \x in {0,0.7,1.7,2.7,3.7,4.7} \draw[gray] (\x,0.6) -- (\x,-3);
\foreach \l/\x in {A/1.2,B/2.2,C/3.2,D/4.2} \node[font=\small\ttfamily] at (\x,0.3) {\l};
\foreach \r/\y in {1/-0.3,2/-0.9,3/-1.5,4/-2.1,5/-2.7} \node[font=\small\ttfamily] at (0.35,\y) {\r};
\node[font=\small\ttfamily] at (2.2,-1.5) {B3};
\node[font=\small\ttfamily, right, orange!60!black] at (4.75,-1.5) {C2:D4};
\draw[thick, blue!70!black] (1.7,-1.8) rectangle (2.7,-1.2);
\draw[thick, orange!80!black] (2.7,-2.4) rectangle (4.7,-0.6);
\end{tikzpicture}
```

Per sapere quante celle ha un intervallo si contano le colonne e le righe e si moltiplica: `C2:D4` prende 2 colonne (`C` e `D`) e 3 righe (2, 3 e 4), quindi $2 \cdot 3 = 6$ celle. Un intervallo può stare anche in una sola colonna, come `B2:B6`, o in una sola riga, come `A1:D1`.

```ad-warning
Le righe di un intervallo si contano tutte
Da 2 a 6 le righe sono 5, non 4: si contano anche la prima e l'ultima. Il conto giusto è $6 - 2 + 1 = 5$.
```

## Che cosa può contenere una cella

In una cella si può scrivere una di queste quattro cose.

| Contenuto | Esempio | Come lo tratta il foglio |
|---|---|---|
| testo | Quaderno | lo mostra così com'è, di solito allineato a sinistra |
| numero | 2,5 | lo usa nei calcoli, di solito allineato a destra |
| data | 03/10/2026 | la conserva come un numero di giorni |
| formula | `=B2*C2` | la calcola e mostra il risultato |

I numeri decimali si scrivono con la virgola, come sul quaderno: 2,5 e non 2.5. In un programma impostato in italiano un numero scritto con il punto può essere letto come un testo o come una data, e allora nei calcoli non funziona più.

Una data è conservata come il numero di giorni passati da un giorno di partenza scelto dal programma. Per questo con le date si possono fare conti: se `A1` contiene 03/10/2026 e `B1` contiene 25/12/2026, la formula `=B1-A1` dà 83, i giorni che mancano a Natale.

```ad-tip
Un controllo a colpo d'occhio
Se un numero resta allineato a sinistra, il foglio lo ha preso per un testo. Di solito c'è un carattere di troppo: uno spazio, una lettera, un punto al posto della virgola.
```

## Le formule

Una **formula** è un'espressione che il foglio calcola. Comincia sempre con il segno `=`, e al posto dei numeri può avere gli indirizzi delle celle in cui i numeri si trovano. Un indirizzo scritto dentro una formula si chiama **riferimento**.

Nella cella si vede il risultato; la formula resta scritta dentro la cella e ricompare nella barra della formula, la riga sopra il foglio, quando la cella è selezionata. Contenuto e valore mostrato sono quindi due cose diverse: la cella `D2` può contenere `=B2*C2` e mostrare 10.

```ad-warning
Senza il segno = non è una formula
Se scrivi `B2*C2` oppure `5+3` senza l'uguale davanti, il foglio lo prende per un testo e lo mostra così com'è, senza calcolare niente.
```

Gli operatori sono cinque. Due non sono quelli del quaderno: la moltiplicazione si scrive con l'asterisco e la divisione con la barra.

| Operazione | Operatore | Esempio | Con `A1` uguale a 6 e `B1` uguale a 3 |
|---|---|---|---|
| addizione | `+` | `=A1+B1` | 9 |
| sottrazione | `-` | `=A1-B1` | 3 |
| moltiplicazione | `*` | `=A1*B1` | 18 |
| divisione | `/` | `=A1/B1` | 2 |
| potenza | `^` | `=A1^2` | 36 |

Una cella vuota, in un calcolo, vale 0. Gli operatori che confrontano due valori, come `>` e `<=`, sono l'argomento della lezione [Condizioni e funzioni logiche](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/condizioni-e-funzioni-logiche).

## L'ordine delle operazioni

Il foglio rispetta le precedenze che conosci dalle espressioni di matematica (lezione [Operazioni in $\mathbb{N}$](/materiale/scuola-superiore/matematica/numeri-naturali/operazioni-in-n)). Per calcolare a mano il valore di una formula:

1. sostituisci a ogni riferimento il valore della sua cella;
2. calcola quello che sta dentro le parentesi, partendo dalle più interne;
3. calcola le potenze;
4. calcola moltiplicazioni e divisioni, da sinistra a destra;
5. calcola addizioni e sottrazioni, da sinistra a destra.

Nelle formule esistono solo le parentesi tonde. Dove sul quaderno useresti le quadre e le graffe, qui metti altre tonde, una dentro l'altra: `=((A1+B1)*2-C1)/4`.

Gli esempi usano questo foglio, con la spesa per il materiale di scuola.

|   | A | B | C |
|---|---|---|---|
| 1 | Prodotto | Prezzo | Quantità |
| 2 | Quaderno | 2,5 | 4 |
| 3 | Penna | 1,2 | 10 |
| 4 | Zaino | 35 | 1 |

```ad-example
Esempio 1: una sola operazione
Nella cella `D2` si scrive `=B2*C2`, per sapere quanto costano i quaderni.

`B2` vale 2,5 e `C2` vale 4, quindi la formula calcola $2{,}5 \cdot 4 = 10$. Nella cella `D2` compare 10.
```

```ad-example
Esempio 2: prima le moltiplicazioni
Nella cella `D5` si scrive `=B2*C2+B3*C3+B4*C4`, per avere la spesa totale.

Con i valori delle celle la formula diventa $2{,}5 \cdot 4 + 1{,}2 \cdot 10 + 35 \cdot 1$. Prima le tre moltiplicazioni, poi le addizioni: $10 + 12 + 35 = 57$. Nella cella compare 57.
```

```ad-example
Esempio 3: le parentesi che servono
Le celle `B1`, `B2` e `B3` di un altro foglio contengono i voti 7, 8 e 6. Per la media si scrive `=(B1+B2+B3)/3`.

Le parentesi fanno calcolare prima la somma: $(7 + 8 + 6) : 3 = 21 : 3 = 7$.

Senza le parentesi la formula `=B1+B2+B3/3` divide per 3 solo l'ultimo voto: $7 + 8 + 6 : 3 = 7 + 8 + 2 = 17$, che non può essere la media di tre voti.
```

```ad-example
Esempio 4: una potenza, con le misure di fisica
Un cubetto di alluminio ha massa $21{,}6\,\text{g}$ e lato $2\,\text{cm}$. Nel foglio la massa è nella cella `B1` e il lato nella cella `B2`. La densità è la massa divisa per il volume, e il volume del cubo è il lato alla terza: si scrive `=B1/B2^3`.

La potenza viene prima della divisione: $2^3 = 8$, poi $21{,}6 : 8 = 2{,}7$. La densità è $2{,}7\,\text{g/cm}^3$.
```

```ad-warning
Asterisco e barra, non il per e i due punti
Dentro una formula la x è una lettera come le altre, e i due punti servono per gli intervalli. Per moltiplicare si scrive `=B2*C2`, per dividere `=B2/C2`.
```

## Il ricalcolo automatico

Una formula non conserva i numeri che ha usato: conserva i riferimenti. Ogni volta che cambia il contenuto di una cella, il foglio ricalcola da solo tutte le formule che la usano, e poi le formule che usano quelle, a catena.

```ad-example
Esempio 5: cambia un dato, cambiano i risultati
Nel foglio della spesa le celle `D2`, `D3` e `D4` contengono `=B2*C2`, `=B3*C3` e `=B4*C4`, e mostrano 10, 12 e 35. La cella `D5` contiene `=D2+D3+D4` e mostra 57.

Se in `C2` scrivi 6 al posto di 4, il foglio ricalcola `D2`: $2{,}5 \cdot 6 = 15$. Poi ricalcola `D5`, che usa `D2`: $15 + 12 + 35 = 62$. Non hai toccato nessuna formula.
```

È il motivo per cui in una formula conviene scrivere i riferimenti e non i numeri. La formula `=2,5*4` dà lo stesso 10 di `=B2*C2`, ma quando il prezzo cambia va riscritta a mano.

## Gli errori nelle formule

Quando una formula non si può calcolare, nella cella compare un codice di errore che comincia con il cancelletto. I più frequenti sono tre.

| Errore | Che cosa è successo | Esempio |
|---|---|---|
| `#DIV/0!` | una divisione per zero, o per una cella vuota | `=B2/C5` con `C5` vuota |
| `#VALORE!` | un calcolo con una cella che contiene un testo | `=A2+B2` con `A2` uguale a Quaderno |
| `#NOME?` | nella formula c'è una parola che il foglio non riconosce | `=B2*prezzo`, oppure `=B2+C` |

Un quarto errore è il **riferimento circolare**: una formula che usa, direttamente o attraverso altre celle, la cella in cui è scritta. Se in `D2` scrivi `=B2+D2`, per calcolare `D2` servirebbe il valore di `D2`: il conto non può finire, e il programma lo segnala con un avviso.

Un errore si propaga: una formula che usa una cella con un errore mostra anche lei quell'errore. Si corregge la prima cella sbagliata e le altre tornano a posto da sole.

```ad-warning
Un risultato senza errori può essere sbagliato lo stesso
Il foglio segnala solo i conti che non riesce a fare. Se scrivi `=B2+C2` al posto di `=B2*C2`, calcola senza protestare un numero che non ti serve. Controlla sempre un risultato con un conto fatto a mente.
```

Finora ogni formula è stata scritta in una cella sola. Per ripeterla su molte righe la si copia, come spiega la lezione [Riferimenti relativi e assoluti](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/riferimenti-relativi-e-assoluti); per sommare o fare la media di un intero intervallo ci sono le funzioni, nella lezione [Le funzioni del foglio di calcolo](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/le-funzioni-del-foglio-di-calcolo).
