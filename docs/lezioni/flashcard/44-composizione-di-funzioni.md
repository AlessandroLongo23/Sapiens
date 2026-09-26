# Flashcard: Composizione e funzione inversa

## composta-definizione
Date $f: A \to B$ e $g: B \to C$, a che cosa è uguale $(g \circ f)(x)$?
---
A $g(f(x))$: prima si applica $f$, poi $g$.

## composta-ordine
In $g \circ f$, quale funzione si applica per prima?
---
$f$, quella scritta a destra, la più vicina alla $x$ in $g(f(x))$.

## composta-condizione
Quando si può fare la composta $g \circ f$?
---
Quando l'immagine di $f$ è contenuta nel dominio di $g$, cioè ogni $f(x)$ sta nel dominio di $g$.

## composta-insiemi-finiti
Se $f(1) = b$ e $g(b) = 20$, quanto vale $(g \circ f)(1)$?
---
$20$. Segui la freccia di $f$ da $1$ a $b$, poi quella di $g$ da $b$ a $20$.

## composta-valore-in-un-punto
Con $f(x) = 2x + 1$ e $g(x) = x^2$, quanto vale $(g \circ f)(3)$?
---
$49$. Prima $f(3) = 7$, poi $g(7) = 49$.

## composta-formula
Con $f(x) = 2x + 1$ e $g(x) = x^2$, qual è la formula di $(f \circ g)(x)$?
---
$2x^2 + 1$. Nella formula di $f$ si mette $x^2$ al posto di $x$.

## composta-con-se-stessa
Con $f(x) = 3x - 1$, quanto vale $(f \circ f)(x)$?
---
$9x - 4$, perché $3(3x - 1) - 1 = 9x - 4$.

## composta-errore-parentesi
Con $g(x) = x^2$ e $f(x) = 2x + 1$, $g(f(x))$ è $2x + 1^2$?
---
No, è $(2x + 1)^2$: quello che prende il posto di $x$ va tra parentesi.

## composta-errore-prodotto
Vero o falso: $(g \circ f)(x) = g(x) \cdot f(x)$.
---
Falso. La composta è $g(f(x))$: una funzione entra dentro l'altra.

## composizione-commutativa
Vero o falso: la composizione di funzioni è commutativa.
---
Falso. Con $f(x) = 0{,}8x$ e $g(x) = x + 5$, $(g \circ f)(x) = 0{,}8x + 5$ e $(f \circ g)(x) = 0{,}8x + 4$.

## identita-definizione
Che cos'è la funzione identità $\mathrm{id}_A$?
---
La funzione da $A$ in $A$ che a ogni elemento associa l'elemento stesso: $\mathrm{id}_A(x) = x$.

## identita-composizione
Se $f: A \to B$, a che cosa è uguale $f \circ \mathrm{id}_A$?
---
A $f$: comporre con l'identità non cambia la funzione.

## inversa-esistenza
Quali funzioni hanno l'inversa?
---
Le funzioni biettive, e solo quelle.

## inversa-definizione
Completa: $f^{-1}(y) = x \iff \ldots$
---
$f(x) = y$.

## inversa-composizione
A che cosa è uguale $f^{-1} \circ f$, se $f: A \to B$ è biettiva?
---
All'identità $\mathrm{id}_A$: applicando $f$ e poi $f^{-1}$ si torna al punto di partenza.

## inversa-errore-reciproco
Vero o falso: $f^{-1}(x) = \dfrac{1}{f(x)}$.
---
Falso. Il $-1$ non è una potenza: per $f(x) = 2x + 1$ l'inversa è $\dfrac{x - 1}{2}$, il reciproco è $\dfrac{1}{2x + 1}$.

## inversa-lineare-conto
Qual è l'inversa di $f(x) = 3x - 6$?
---
$f^{-1}(x) = \dfrac{x + 6}{3}$. Da $y = 3x - 6$ si ricava $x = \dfrac{y + 6}{3}$ e si scambiano le lettere.

## inversa-costante
La funzione costante $f(x) = 5$, da $\mathbb{R}$ a $\mathbb{R}$, ha l'inversa?
---
No. Non è iniettiva: porta tutti i numeri in $5$.

## inversa-grafico
Che relazione c'è tra il grafico di $f$ e quello di $f^{-1}$?
---
Sono simmetrici rispetto alla bisettrice $y = x$: se $(p, q)$ sta sul primo, $(q, p)$ sta sul secondo.
