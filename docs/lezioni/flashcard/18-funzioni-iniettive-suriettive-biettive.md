# Flashcard: Funzioni iniettive, suriettive e biettive

## immagine-definizione
Che cos'è l'immagine $\mathrm{Im}(f)$ di una funzione $f: A \to B$?
---
L'insieme dei valori che la funzione assume davvero: $\mathrm{Im}(f) = \{f(x) \mid x \in A\}$.

## immagine-conto
Qual è l'immagine di $f(x) = x^2$ da $A = \{-1,\ 0,\ 1,\ 2\}$ a $B = \{0,\ 1,\ 2,\ 3,\ 4\}$?
---
$\{0,\ 1,\ 4\}$. I numeri $2$ e $3$ stanno nel codominio, ma nessun elemento di $A$ ci arriva.

## iniettiva-definizione
Quando una funzione $f: A \to B$ è iniettiva?
---
Quando elementi diversi del dominio hanno immagini diverse.

## iniettiva-implicazione
Completa la condizione di iniettività usata nelle dimostrazioni: $f(x_1) = f(x_2) \implies \ldots$
---
$x_1 = x_2$.

## suriettiva-definizione
Quando una funzione $f: A \to B$ è suriettiva?
---
Quando ogni elemento del codominio è immagine di almeno un elemento del dominio, cioè $\mathrm{Im}(f) = B$.

## biettiva-definizione
Quando una funzione è biettiva?
---
Quando è sia iniettiva sia suriettiva.

## frecce-iniettiva
In un diagramma a frecce di una funzione iniettiva, quante frecce arrivano a ogni elemento di $B$?
---
Al massimo una. Qualche elemento di $B$ può restare senza frecce.

## frecce-biettiva
Come si chiama una funzione in cui a ogni elemento di $B$ arriva esattamente una freccia?
---
Biettiva, o biunivoca.

## funzione-e-iniettivita
Vero o falso: se da ogni elemento di $A$ parte una sola freccia, la funzione è iniettiva.
---
Falso. Una sola freccia in partenza da ogni elemento di $A$ è la condizione per essere una funzione; l'iniettività riguarda le frecce che arrivano in $B$.

## esempio-non-suriettiva
$A = \{1,\ 2,\ 3\}$, $B = \{a,\ b,\ c,\ d\}$, con $1 \mapsto a$, $2 \mapsto b$, $3 \mapsto c$. La funzione è suriettiva?
---
No: a $d$ non arriva nessuna freccia.

## contare-elementi
$A$ ha $25$ elementi e $B$ ne ha $12$. Una funzione $f: A \to B$ può essere iniettiva?
---
No: con più elementi in $A$ che in $B$, qualche elemento di $B$ riceve per forza almeno due frecce.

## stesso-numero-elementi
Vero o falso: se $A$ e $B$ hanno lo stesso numero di elementi, ogni funzione $f: A \to B$ è biettiva.
---
Falso. La funzione $x \mapsto x^2$ da $\{-1,\ 0,\ 1\}$ a $\{-1,\ 0,\ 1\}$ non è né iniettiva né suriettiva.

## provare-valori
Vero o falso: se provi dieci valori di $x$ e trovi sempre immagini diverse, hai dimostrato che $f$ è iniettiva.
---
Falso. Provare qualche valore non dimostra l'iniettività: un esempio può solo smentirla.

## rette-orizzontali-iniettiva
Guardando il grafico di $f$, come riconosci che è iniettiva?
---
Ogni retta orizzontale incontra il grafico al massimo una volta.

## rette-verticali
A che cosa serve il controllo con le rette verticali?
---
A riconoscere se un grafico è quello di una funzione: ogni retta $x = k$, con $k$ nel dominio, deve incontrarlo esattamente una volta.

## quadrato-reali-iniettiva
La funzione $f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^2$, è iniettiva?
---
No: $f(-2) = f(2) = 4$, con $-2 \neq 2$.

## quadrato-codominio-ristretto
La funzione $f: \mathbb{R} \to [0, +\infty)$, $f(x) = x^2$, è suriettiva?
---
Sì: per ogni $y \geq 0$ l'equazione $x^2 = y$ ha la soluzione $x = \sqrt{y}$.

## doppio-interi
La funzione $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = 2x$, è suriettiva?
---
No: un dispari come $3$ non viene raggiunto, perché $2x = 3$ dà $x = \dfrac{3}{2}$, che non è intero.

## invertibile-biettiva
Quali funzioni sono invertibili?
---
Le funzioni biettive: $f$ è invertibile se e solo se è biettiva.

## inversa-lineare
Qual è l'inversa di $f: \mathbb{R} \to \mathbb{R}$, $f(x) = 2x + 1$?
---
$f^{-1}(y) = \dfrac{y - 1}{2}$, che si trova risolvendo $y = 2x + 1$ rispetto a $x$.
