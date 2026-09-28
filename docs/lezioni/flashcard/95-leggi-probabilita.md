# Flashcard: Probabilità della somma e dell'evento contrario

## contrario-formula
Quanto vale $p(\overline{E})$ se conosci $p(E)$?
---
$p(\overline{E}) = 1 - p(E)$.

## contrario-dado
Qual è la probabilità che un dado non dia $6$?
---
$\dfrac{5}{6}$, cioè $1 - \dfrac{1}{6}$.

## contrario-figura
Qual è la probabilità di pescare dal mazzo di $40$ carte una carta che non è una figura?
---
$\dfrac{7}{10}$, cioè $1 - \dfrac{3}{10}$.

## contrario-almeno-uno
Qual è l'evento contrario di "esce almeno un $6$"?
---
"Non esce nessun $6$".

## contrario-almeno-uno-errore
Vero o falso: il contrario di "esce almeno un $6$" è "esce esattamente un $6$".
---
Falso. Il contrario deve contenere tutti gli altri esiti: è "non esce nessun $6$".

## almeno-un-sei-due-dadi
Lanciando due dadi, $p(\text{nessun } 6) = \dfrac{25}{36}$. Quanto vale $p(\text{almeno un } 6)$?
---
$\dfrac{11}{36}$, cioè $1 - \dfrac{25}{36}$.

## almeno-una-testa-tre-monete
Qual è la probabilità di almeno una testa lanciando tre monete?
---
$\dfrac{7}{8}$: il contrario, $CCC$, ha probabilità $\dfrac{1}{8}$.

## unione-incompatibili
Quanto vale $p(A \cup B)$ se $A$ e $B$ sono incompatibili?
---
$p(A) + p(B)$.

## asso-o-re
Qual è la probabilità di pescare un asso o un re dal mazzo di $40$ carte?
---
$\dfrac{8}{40} = \dfrac{1}{5}$: gli eventi sono incompatibili, e si sommano $\dfrac{4}{40}$ e $\dfrac{4}{40}$.

## unione-compatibili
Completa: $p(A \cup B) = p(A) + p(B) - \ldots$
---
$p(A \cap B)$: gli esiti comuni sono stati contati due volte.

## perche-si-toglie
Perché nella probabilità dell'unione si toglie $p(A \cap B)$?
---
Perché gli esiti comuni ad $A$ e $B$ sono contati una volta in $p(A)$ e una volta in $p(B)$.

## coppe-o-figura
Carte di coppe $10$, figure $12$, figure di coppe $3$, su $40$. Quanto vale $p(\text{coppe o figura})$?
---
$\dfrac{19}{40}$, cioè $\dfrac{10}{40} + \dfrac{12}{40} - \dfrac{3}{40}$.

## pari-o-maggiore-di-3
Vero o falso: con un dado, $p(\text{pari o maggiore di } 3) = \dfrac{1}{2} + \dfrac{1}{2} = 1$.
---
Falso. $4$ e $6$ sono in comune: gli esiti favorevoli sono $2$, $4$, $5$, $6$, e $p = \dfrac{2}{3}$.

## intersezione-si-conta
Come si trova $p(A \cap B)$ in questa lezione?
---
Contando gli esiti che stanno in tutti e due gli eventi e dividendo per i casi possibili.

## doppio-e-somma-8
Lanciando due dadi, qual è la probabilità di un doppio con somma $8$?
---
$\dfrac{1}{36}$: l'unico esito è $(4, 4)$.

## incompatibili-non-contrari
Vero o falso: due eventi incompatibili sono sempre uno il contrario dell'altro.
---
Falso. Con un dado, "esce $1$" ed "esce $2$" sono incompatibili, ma può uscire $3$.

## contrari-incompatibili
Vero o falso: un evento e il suo contrario sono incompatibili.
---
Vero. Non hanno esiti in comune, e la loro unione è $\Omega$.

## incompatibili-indipendenti
Vero o falso: "incompatibili" e "indipendenti" vogliono dire la stessa cosa.
---
Falso. Incompatibili vuol dire che non possono verificarsi insieme; l'indipendenza è un'altra proprietà, che si studia più avanti.
