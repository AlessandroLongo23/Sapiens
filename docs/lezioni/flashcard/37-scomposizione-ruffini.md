# Flashcard: Scomposizione con la regola di Ruffini

## zero-definizione
Quando un numero $a$ è uno zero del polinomio $P(x)$?
---
Quando $P(a) = 0$.

## zero-fattore
Se $P(a) = 0$, quale fattore ha sicuramente $P(x)$?
---
$x - a$, per il teorema di Ruffini: $P(x) = (x - a) \cdot Q(x)$.

## zero-negativo-fattore
$P(-3) = 0$. Quale fattore di primo grado ha $P(x)$?
---
$x + 3$, cioè $x - (-3)$. Non $x - 3$.

## grado-quoziente
Dividi un polinomio di grado $5$ per $x - a$. Di che grado è il quoziente?
---
$4$: il quoziente ha un grado in meno del dividendo.

## candidati-interi
Tra quali numeri si cercano gli zeri interi di un polinomio a coefficienti interi?
---
Tra i divisori del termine noto, positivi e negativi.

## candidati-conto
Quali sono i candidati zeri di $x^3 - 2x^2 - 5x + 6$?
---
$\pm 1, \pm 2, \pm 3, \pm 6$: i divisori di $6$ con i due segni.

## coefficiente-direttore
Che cos'è il coefficiente direttore di un polinomio?
---
Il coefficiente del termine di grado più alto. In $4x^3 - 5x + 6$ è $4$.

## candidati-frazioni
Quali frazioni $\frac{p}{q}$ possono essere zeri di un polinomio a coefficienti interi?
---
Quelle ridotte ai minimi termini con $p$ divisore del termine noto e $q$ divisore del coefficiente direttore.

## coefficiente-direttore-uno
Vero o falso: se il coefficiente direttore è $1$, gli zeri razionali possono essere frazioni come $\frac{1}{2}$.
---
Falso. Con coefficiente direttore $\pm 1$ gli zeri razionali sono tutti interi.

## valore-in-uno
Come si calcola a colpo d'occhio $P(1)$?
---
È la somma dei coefficienti.

## zero-in-uno-conto
$1$ è uno zero di $x^3 - 2x^2 - 5x + 6$?
---
Sì: $1 - 2 - 5 + 6 = 0$.

## termine-noto-nullo
Il termine noto del polinomio è $0$. Che cosa fai prima di cercare gli zeri?
---
Raccogli la $x$: $0$ è uno zero e il fattore è $x$.

## tabella-potenze-mancanti
Quali numeri vanno nella prima riga della tabella di Ruffini per $x^3 - 13x - 12$?
---
$1, 0, -13, -12$: il termine in $x^2$ manca e al suo posto va $0$.

## quando-fermarsi
Vero o falso: $(x - 1)(x^2 - x - 6)$ è la scomposizione completa di $x^3 - 2x^2 - 5x + 6$.
---
Falso. Il quoziente si scompone ancora: $(x - 1)(x + 2)(x - 3)$.

## zero-frazionario-fattore
$\frac{1}{2}$ è uno zero di $P(x)$. Quale fattore a coefficienti interi ha $P(x)$?
---
$2x - 1$. Allo zero $\frac{p}{q}$ corrisponde il fattore $qx - p$.

## errore-coefficiente-perso
Vero o falso: $2x^3 + x^2 + x - 1 = \left(x - \frac{1}{2}\right)(x^2 + x + 1)$.
---
Falso: manca il $2$. Il risultato giusto è $(2x - 1)(x^2 + x + 1)$.

## candidati-scartati
Vero o falso: un candidato già scartato per $P(x)$ può essere uno zero del quoziente $Q(x)$.
---
Falso. Ogni zero di $Q(x)$ è anche zero di $P(x) = (x - a) \cdot Q(x)$.

## zero-ripetuto
Vero o falso: lo zero appena trovato può essere anche uno zero del quoziente.
---
Vero. Per esempio $x^4 - x^3 - 3x^2 + 5x - 2 = (x - 1)^3(x + 2)$.

## nessuno-zero-terzo-grado
Un polinomio di terzo grado non ha zeri razionali. Si scompone?
---
No. Se si scomponesse, uno dei fattori sarebbe di primo grado e darebbe uno zero.

## ordine-metodi
Quale metodo di scomposizione si prova per primo, e quale per ultimo?
---
Per primo il raccoglimento totale, per ultimo Ruffini.
