# MCD e MCM in ℕ

Il massimo comune divisore (MCD) e il minimo comune multiplo (MCM) servono ogni volta che due quantità devono "incastrarsi": il lato più grande di una piastrella che copre un pavimento senza tagli, il primo orario in cui due autobus ripartono insieme, il denominatore comune di due frazioni. Per calcolarli servono prima i divisori, i multipli e i numeri primi.

## Divisori e multipli

Dati due numeri naturali $a$ e $b$, con $b \neq 0$, si dice che $b$ è un **divisore** di $a$ (o che $a$ è **divisibile** per $b$) quando la divisione $a : b$ ha resto $0$, cioè quando esiste un naturale $q$ tale che $a = b \cdot q$. In questo caso si dice anche che $a$ è un **multiplo** di $b$. La divisione con resto è spiegata nella lezione sulle [operazioni in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/operazioni-in-n).

I divisori di $12$ sono $1, 2, 3, 4, 6, 12$: sono finiti, e nessuno supera $12$. I multipli di $7$ sono invece infiniti: $0, 7, 14, 21, 28, \dots$, cioè $7 \cdot 0, 7 \cdot 1, 7 \cdot 2, \dots$

Ogni numero è divisibile per $1$ e per sé stesso, e $0$ è multiplo di qualunque numero, perché $0 = b \cdot 0$.

## Numeri primi

Un numero naturale maggiore di $1$ è **primo** se ha esattamente due divisori, cioè $1$ e sé stesso. Un numero maggiore di $1$ che non è primo si chiama **composto**.

I numeri primi minori di $50$ sono

$$2,\ 3,\ 5,\ 7,\ 11,\ 13,\ 17,\ 19,\ 23,\ 29,\ 31,\ 37,\ 41,\ 43,\ 47$$

Il numero $1$ non è primo, perché ha un solo divisore; $0$ non è primo, perché è divisibile per ogni numero diverso da zero. Il $2$ è l'unico primo pari.

## Criteri di divisibilità

Per sapere se un numero è divisibile per un altro senza fare la divisione si usano i criteri di divisibilità. Un numero è divisibile:

| per | se |
|---|---|
| $2$ | l'ultima cifra è pari ($0, 2, 4, 6, 8$) |
| $3$ | la somma delle cifre è divisibile per $3$ |
| $4$ | le ultime due cifre sono $00$ o formano un numero divisibile per $4$ |
| $5$ | l'ultima cifra è $0$ o $5$ |
| $9$ | la somma delle cifre è divisibile per $9$ |
| $10$ | l'ultima cifra è $0$ |
| $11$ | la differenza tra la somma delle cifre di posto dispari e quella delle cifre di posto pari (contando da destra) è $0$ o un multiplo di $11$ |
| $25$ | le ultime due cifre sono $00$, $25$, $50$ o $75$ |

Per il criterio dell'$11$ si sottrae la somma più piccola dalla più grande, così il risultato resta un numero naturale.

```ad-example
Esempio 1: i criteri applicati a 7128
L'ultima cifra, $8$, è pari: divisibile per $2$.

La somma delle cifre è $7 + 1 + 2 + 8 = 18$, che è multiplo di $9$ (e quindi anche di $3$): divisibile per $3$ e per $9$.

Le ultime due cifre formano $28 = 4 \cdot 7$: divisibile per $4$.

L'ultima cifra non è $0$ né $5$: non divisibile per $5$, per $10$ e per $25$.

Per l'$11$, contando da destra, le cifre di posto dispari sono $8$ e $1$ (somma $9$), quelle di posto pari sono $2$ e $7$ (somma $9$). La differenza è $9 - 9 = 0$: divisibile per $11$.
```

```ad-example
Esempio 2: 9152 e il criterio dell'11
Da destra, le cifre di posto dispari sono $2$ e $1$ (somma $3$), quelle di posto pari $5$ e $9$ (somma $14$). La differenza è $14 - 3 = 11$, che è multiplo di $11$: $9152$ è divisibile per $11$. Infatti $9152 = 11 \cdot 832$.
```

## Scomposizione in fattori primi

Ogni numero naturale maggiore di $1$ si può scrivere come prodotto di numeri primi, e in un solo modo se non si tiene conto dell'ordine dei fattori (è il **teorema fondamentale dell'aritmetica**). Trovare questo prodotto si dice **scomporre in fattori primi**.

Il procedimento:

1. Si divide il numero per il più piccolo primo che lo divide (con i criteri di divisibilità si prova $2$, poi $3$, poi $5$, poi $7$, e così via).
2. Si ripete sul quoziente, finché si arriva a $1$.
3. Si scrive il numero come prodotto dei divisori trovati, raccogliendo i fattori uguali in potenze.

```ad-example
Esempio 3: scomporre 360
Nella colonna di sinistra c'è il numero da dividere, in quella di destra il primo per cui lo dividi.
$$\begin{array}{r|l} 360 & 2 \\ 180 & 2 \\ 90 & 2 \\ 45 & 3 \\ 15 & 3 \\ 5 & 5 \\ 1 & \end{array}$$
Quindi $360 = 2 \cdot 2 \cdot 2 \cdot 3 \cdot 3 \cdot 5 = 2^3 \cdot 3^2 \cdot 5$.
```

```ad-warning
Scomporre con fattori non primi
Per esempio $36 = 4 \cdot 9$ o $36 = 6^2$. Se la scomposizione contiene $4$, $6$ o $9$, il confronto dei fattori tra numeri diversi dà risultati sbagliati: bisogna arrivare a $36 = 2^2 \cdot 3^2$.
```

## Massimo comune divisore

Il **massimo comune divisore** di due o più numeri naturali, non tutti nulli, è il più grande numero che li divide tutti. Si scrive $\text{MCD}(a, b)$.

Per esempio i divisori di $18$ sono $1, 2, 3, 6, 9, 18$ e quelli di $24$ sono $1, 2, 3, 4, 6, 8, 12, 24$. I divisori comuni sono $1, 2, 3, 6$, e il più grande è $6$: $\text{MCD}(18, 24) = 6$.

Elencare i divisori funziona con numeri piccoli. Con numeri più grandi si usa la scomposizione:

1. Si scompongono i numeri in fattori primi.
2. Si prendono solo i fattori comuni a tutti i numeri, ciascuno con l'esponente più piccolo con cui compare.
3. Si moltiplicano. Se non ci sono fattori comuni, il MCD è $1$.

```ad-example
Esempio 4: MCD(84, 120)
$84 = 2^2 \cdot 3 \cdot 7$ e $120 = 2^3 \cdot 3 \cdot 5$.

I fattori comuni sono $2$ e $3$. L'esponente più piccolo del $2$ è $2$, quello del $3$ è $1$; il $7$ e il $5$ non sono comuni e si scartano.

$\text{MCD}(84, 120) = 2^2 \cdot 3 = 12$.
```

```ad-example
Esempio 5: MCD di tre numeri
$36 = 2^2 \cdot 3^2$, $60 = 2^2 \cdot 3 \cdot 5$, $90 = 2 \cdot 3^2 \cdot 5$.

Il $2$ e il $3$ compaiono in tutti e tre, il $5$ no. Esponenti più piccoli: $2^1$ e $3^1$.

$\text{MCD}(36, 60, 90) = 2 \cdot 3 = 6$.
```

## Minimo comune multiplo

Il **minimo comune multiplo** di due o più numeri naturali diversi da zero è il più piccolo numero diverso da zero che è multiplo di tutti. Si scrive $\text{MCM}(a, b)$. Si esclude lo zero perché è multiplo di tutti i numeri: se lo contassimo, il minimo comune multiplo sarebbe sempre $0$.

Per esempio i multipli di $6$ diversi da zero sono $6, 12, 18, 24, \dots$ e quelli di $8$ sono $8, 16, 24, \dots$: il primo comune è $24$, quindi $\text{MCM}(6, 8) = 24$.

Con la scomposizione:

1. Si scompongono i numeri in fattori primi.
2. Si prendono tutti i fattori, comuni e non comuni, ciascuno una volta sola con l'esponente più grande con cui compare.
3. Si moltiplicano.

```ad-example
Esempio 6: MCM(84, 120)
$84 = 2^2 \cdot 3 \cdot 7$ e $120 = 2^3 \cdot 3 \cdot 5$.

Tutti i fattori: $2$, $3$, $5$, $7$. Esponenti più grandi: $2^3$, $3^1$, $5^1$, $7^1$.

$\text{MCM}(84, 120) = 2^3 \cdot 3 \cdot 5 \cdot 7 = 840$.
```

```ad-example
Esempio 7: MCM di tre numeri
Con $36 = 2^2 \cdot 3^2$, $60 = 2^2 \cdot 3 \cdot 5$, $90 = 2 \cdot 3^2 \cdot 5$ si prendono $2^2$, $3^2$ e $5$:

$\text{MCM}(36, 60, 90) = 4 \cdot 9 \cdot 5 = 180$.
```

```ad-warning
Scambiare le regole di MCD e MCM
Per il MCD si prendono solo i fattori comuni con l'esponente più piccolo, per il MCM tutti i fattori con l'esponente più grande. Un controllo veloce: il MCD non supera il più piccolo dei numeri, il MCM non è più piccolo del più grande.
```

## Algoritmo di Euclide

L'algoritmo di Euclide trova il MCD di due numeri senza scomporli, e conviene quando la scomposizione è lunga. Si basa su un fatto: se $a = b \cdot q + r$ è la divisione con resto di $a$ per $b$, allora i divisori comuni di $a$ e $b$ sono gli stessi divisori comuni di $b$ e $r$, e quindi $\text{MCD}(a, b) = \text{MCD}(b, r)$.

Dati due numeri $a \geq b > 0$:

1. Si divide $a$ per $b$ e si trova il resto $r$.
2. Se $r = 0$, il MCD è $b$ e ci si ferma.
3. Se $r \neq 0$, si sostituisce la coppia $(a, b)$ con la coppia $(b, r)$, cioè il divisore diventa il nuovo dividendo e il resto diventa il nuovo divisore, e si torna al passo 1.

Il MCD è quindi il divisore dell'ultima divisione, quella con resto zero. Il procedimento finisce sempre, perché i resti diminuiscono a ogni passo.

```ad-example
Esempio 8: MCD(252, 198) con Euclide
$$\begin{aligned} 252 &= 198 \cdot 1 + 54 \\ 198 &= 54 \cdot 3 + 36 \\ 54 &= 36 \cdot 1 + 18 \\ 36 &= 18 \cdot 2 + 0 \end{aligned}$$
L'ultima divisione, quella con resto zero, ha divisore $18$, quindi $\text{MCD}(252, 198) = 18$.

Controllo con la scomposizione: $252 = 2^2 \cdot 3^2 \cdot 7$ e $198 = 2 \cdot 3^2 \cdot 11$, e i fattori comuni con l'esponente più piccolo danno $2 \cdot 3^2 = 18$.
```

## Il legame tra MCD e MCM

Per due numeri $a$ e $b$ diversi da zero vale

$$\text{MCD}(a, b) \cdot \text{MCM}(a, b) = a \cdot b$$

Per questo, trovato il MCD, si ottiene il MCM con una divisione:

$$\text{MCM}(a, b) = \frac{a \cdot b}{\text{MCD}(a, b)}$$

Con i numeri dell'esempio 8: $\text{MCM}(252, 198) = 252 \cdot 198 : 18 = 49\,896 : 18 = 2772$.

```ad-warning
Usare la formula con tre numeri
La formula vale solo per due numeri. Con $2$, $4$ e $6$ si ha $\text{MCD} = 2$ e $\text{MCM} = 12$, quindi $\text{MCD} \cdot \text{MCM} = 24$, mentre $2 \cdot 4 \cdot 6 = 48$.
```

## Numeri primi tra loro

Due numeri si dicono **primi tra loro** (o coprimi) quando il loro MCD è $1$, cioè quando non hanno divisori comuni oltre a $1$. Non devono essere primi: $8 = 2^3$ e $15 = 3 \cdot 5$ sono entrambi composti, ma non hanno fattori primi in comune, quindi $\text{MCD}(8, 15) = 1$.

```ad-warning
Confondere "primi tra loro" con "primi"
"Primi tra loro" non vuol dire "entrambi primi": $8$ e $15$ sono primi tra loro senza essere primi; e due primi diversi sono sempre primi tra loro, ma non è vero il contrario.
```

Quando due numeri sono primi tra loro, il loro MCM è il prodotto: $\text{MCM}(8, 15) = 8 \cdot 15 = 120$. È la formula della sezione precedente con $\text{MCD} = 1$.

## Problemi con MCD e MCM

Nei problemi la domanda dice quale dei due serve. Se si cerca la misura più grande che sta un numero intero di volte in due quantità (dividere, suddividere, tagliare in parti uguali), serve il MCD. Se si cerca il primo momento in cui due fenomeni ripetuti si ritrovano insieme, serve il MCM.

```ad-example
Esempio 9: le piastrelle
Un pavimento rettangolare misura $360$ cm per $264$ cm. Lo si vuole coprire con piastrelle quadrate tutte uguali, le più grandi possibili, senza tagliarne nessuna. Quanto deve misurare il lato e quante piastrelle servono?

Il lato deve stare un numero intero di volte sia in $360$ sia in $264$, ed essere il più grande possibile: è il MCD. Con $360 = 2^3 \cdot 3^2 \cdot 5$ e $264 = 2^3 \cdot 3 \cdot 11$ si ha $\text{MCD}(360, 264) = 2^3 \cdot 3 = 24$.

Le piastrelle hanno il lato di $24$ cm. In lunghezza ne stanno $360 : 24 = 15$, in larghezza $264 : 24 = 11$, in tutto $15 \cdot 11 = 165$ piastrelle.

Il pavimento coperto dalle piastrelle:

```tikz
% nome: problema-piastrelle-mcd
% alt: Pavimento rettangolare di 360 per 264 centimetri diviso in una griglia di 15 per 11 piastrelle quadrate di lato 24 centimetri
% svg: problema-piastrelle-mcd-d1a3d100.svg 306x219
\begin{tikzpicture}
\draw[step=0.4, gray] (0,0) grid (6,4.4);
\draw[thick] (0,0) rectangle (6,4.4);
\node[below] at (3,0) {$360$ cm};
\node[left] at (0,2.2) {$264$ cm};
\path (-1.6,-0.9) rectangle (6.4,4.8);
\end{tikzpicture}
```
```

```ad-example
Esempio 10: gli autobus
Dal capolinea partono due linee di autobus: la prima ogni $12$ minuti, la seconda ogni $18$ minuti. Alle $8{:}00$ partono insieme. A che ora ripartiranno di nuovo insieme?

Le partenze della prima linea avvengono dopo $12, 24, 36, \dots$ minuti, quelle della seconda dopo $18, 36, \dots$ minuti. Il primo istante comune è il MCM: con $12 = 2^2 \cdot 3$ e $18 = 2 \cdot 3^2$ si ha $\text{MCM}(12, 18) = 2^2 \cdot 3^2 = 36$.

Ripartono insieme dopo $36$ minuti, cioè alle $8{:}36$.
```
