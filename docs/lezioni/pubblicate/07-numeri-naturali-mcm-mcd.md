# MCD e MCM in ℕ

Il massimo comune divisore (MCD) e il minimo comune multiplo (MCM) servono ogni volta che due quantità devono "incastrarsi": il lato più grande di una piastrella che copre un pavimento senza tagli, il primo orario in cui due autobus ripartono insieme, il denominatore comune di due frazioni. Per calcolarli servono i divisori, i multipli e la scomposizione in fattori primi, spiegati nella lezione [Divisibilità e numeri primi](/materiale/scuola-superiore/matematica/numeri-naturali/divisibilita-e-numeri-primi).

## Massimo comune divisore

Il **massimo comune divisore** di due o più numeri naturali, non tutti nulli, è il più grande numero che li divide tutti. Si scrive $\text{MCD}(a, b)$.

Per esempio i divisori di $18$ sono $1, 2, 3, 6, 9, 18$ e quelli di $24$ sono $1, 2, 3, 4, 6, 8, 12, 24$. I divisori comuni sono $1, 2, 3, 6$, e il più grande è $6$: $\text{MCD}(18, 24) = 6$.

Elencare i divisori funziona con numeri piccoli. Con numeri più grandi si usa la [scomposizione in fattori primi](/materiale/scuola-superiore/matematica/numeri-naturali/divisibilita-e-numeri-primi):

1. Si scompongono i numeri in fattori primi.
2. Si prendono solo i fattori comuni a tutti i numeri, ciascuno con l'esponente più piccolo con cui compare.
3. Si moltiplicano. Se non ci sono fattori comuni, il MCD è $1$.

```ad-warning
Scomporre con fattori non primi
Per esempio $36 = 4 \cdot 9$ o $36 = 6^2$. Se la scomposizione contiene $4$, $6$ o $9$, il confronto dei fattori tra numeri diversi dà risultati sbagliati: bisogna arrivare a $36 = 2^2 \cdot 3^2$.
```

```ad-example
Esempio 1: MCD(84, 120)
$84 = 2^2 \cdot 3 \cdot 7$ e $120 = 2^3 \cdot 3 \cdot 5$.

I fattori comuni sono $2$ e $3$. L'esponente più piccolo del $2$ è $2$, quello del $3$ è $1$; il $7$ e il $5$ non sono comuni e si scartano.

$\text{MCD}(84, 120) = 2^2 \cdot 3 = 12$.
```

```ad-example
Esempio 2: MCD di tre numeri
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
Esempio 3: MCM(84, 120)
$84 = 2^2 \cdot 3 \cdot 7$ e $120 = 2^3 \cdot 3 \cdot 5$.

Tutti i fattori: $2$, $3$, $5$, $7$. Esponenti più grandi: $2^3$, $3^1$, $5^1$, $7^1$.

$\text{MCM}(84, 120) = 2^3 \cdot 3 \cdot 5 \cdot 7 = 840$.
```

```ad-example
Esempio 4: MCM di tre numeri
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
Esempio 5: MCD(252, 198) con Euclide
$$\begin{aligned} 252 &= 198 \cdot 1 + 54 \\ 198 &= 54 \cdot 3 + 36 \\ 54 &= 36 \cdot 1 + 18 \\ 36 &= 18 \cdot 2 + 0 \end{aligned}$$
L'ultima divisione, quella con resto zero, ha divisore $18$, quindi $\text{MCD}(252, 198) = 18$.

Controllo con la scomposizione: $252 = 2^2 \cdot 3^2 \cdot 7$ e $198 = 2 \cdot 3^2 \cdot 11$, e i fattori comuni con l'esponente più piccolo danno $2 \cdot 3^2 = 18$.
```

## Il legame tra MCD e MCM

Per due numeri $a$ e $b$ diversi da zero vale

$$\text{MCD}(a, b) \cdot \text{MCM}(a, b) = a \cdot b$$

Per questo, trovato il MCD, si ottiene il MCM con una divisione:

$$\text{MCM}(a, b) = \frac{a \cdot b}{\text{MCD}(a, b)}$$

Con i numeri dell'esempio 5: $\text{MCM}(252, 198) = 252 \cdot 198 : 18 = 49\,896 : 18 = 2772$.

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
Esempio 6: le piastrelle
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
Esempio 7: gli autobus
Dal capolinea partono due linee di autobus: la prima ogni $12$ minuti, la seconda ogni $18$ minuti. Alle $8{:}00$ partono insieme. A che ora ripartiranno di nuovo insieme?

Le partenze della prima linea avvengono dopo $12, 24, 36, \dots$ minuti, quelle della seconda dopo $18, 36, \dots$ minuti. Il primo istante comune è il MCM: con $12 = 2^2 \cdot 3$ e $18 = 2 \cdot 3^2$ si ha $\text{MCM}(12, 18) = 2^2 \cdot 3^2 = 36$.

Ripartono insieme dopo $36$ minuti, cioè alle $8{:}36$.
```
