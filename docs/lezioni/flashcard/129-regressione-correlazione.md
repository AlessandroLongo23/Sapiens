# Flashcard: Regressione e correlazione

## diagramma-dispersione-definizione
Che cos'è un diagramma a dispersione?
---
Il grafico in cui ogni coppia di dati $(x_i, y_i)$ è un punto del piano cartesiano.

## baricentro-definizione
Che cos'è il baricentro di una nuvola di punti?
---
Il punto $G(\bar{x}, \bar{y})$, che ha per coordinate le medie dei due caratteri.

## covarianza-definizione
Che cos'è la covarianza $\sigma_{xy}$?
---
La media aritmetica dei prodotti degli scarti $(x_i - \bar{x})(y_i - \bar{y})$.

## covarianza-prodotto-segno
Un punto ha scarti $x_i - \bar{x} = -4$ e $y_i - \bar{y} = -2$. Quanto vale il loro prodotto?
---
$8$. Il prodotto di due scarti negativi è positivo.

## covarianza-segno-positivo
Che cosa dice una covarianza positiva?
---
Che la nuvola sale: al crescere di $X$ in genere cresce anche $Y$. La correlazione è positiva.

## covarianza-unita-di-misura
Vero o falso: se le ore si scrivono in minuti la covarianza non cambia.
---
Falso. Si moltiplica per $60$: la covarianza dipende dalle unità di misura.

## residuo-definizione
Che cos'è il residuo di un punto rispetto a una retta $y = mx + q$?
---
La differenza $e_i = y_i - (m x_i + q)$ tra il valore osservato e il valore stimato dalla retta.

## minimi-quadrati-criterio
Che cosa rende minimo la retta di regressione?
---
La somma dei quadrati dei residui.

## regressione-coefficiente-angolare
Qual è il coefficiente angolare della retta di regressione di $Y$ rispetto a $X$?
---
$m = \dfrac{\sigma_{xy}}{\sigma_x^2}$: la covarianza divisa per la varianza di $X$.

## regressione-termine-noto
Trovato $m$, come si calcola $q$ nella retta di regressione?
---
$q = \bar{y} - m\bar{x}$.

## regressione-baricentro
Per quale punto passa sempre la retta di regressione?
---
Per il baricentro $G(\bar{x}, \bar{y})$.

## regressione-m-conto
Con $\sigma_{xy} = 4$ e $\sigma_x^2 = 8$, quanto vale $m$?
---
$0{,}5$, perché $\dfrac{4}{8} = 0{,}5$.

## regressione-significato-m
La retta di regressione tra ore di studio $x$ e voto $y$ è $y = 0{,}5x + 3{,}5$. Che cosa dice $m = 0{,}5$?
---
Che a ogni ora di studio in più corrisponde in media mezzo voto in più.

## regressione-fuori-dai-dati
Perché non si usa la retta di regressione per valori di $x$ lontani da quelli osservati?
---
Perché descrive i dati solo nel loro intervallo: fuori può dare risultati assurdi, come un voto di $13{,}5$.

## correlazione-formula
Qual è la formula del coefficiente di correlazione lineare $r$?
---
$r = \dfrac{\sigma_{xy}}{\sigma_x \cdot \sigma_y}$: la covarianza divisa per il prodotto dei due scarti quadratici medi.

## correlazione-intervallo
Tra quali valori è sempre compreso $r$?
---
Tra $-1$ e $1$: $-1 \leq r \leq 1$.

## correlazione-perfetta
Che cosa vuol dire $r = -1$?
---
Che tutti i punti stanno su una retta decrescente: correlazione negativa perfetta.

## correlazione-zero-legame
Vero o falso: se $r = 0$ tra i due caratteri non c'è nessun legame.
---
Falso. Non c'è un legame lineare, ma può essercene uno di altro tipo, per esempio punti disposti ad arco.

## correlazione-causa
Vero o falso: se $r$ è vicino a $1$, il carattere $X$ è la causa di $Y$.
---
Falso. Dice solo che i due caratteri variano insieme; la causa può essere un terzo fattore.

## correlazione-varianza-o-scarto
Con $\sigma_{xy} = 108$, $\sigma_x = 4$ e $\sigma_y = 30$, quanto vale $r$?
---
$0{,}9$, perché $\dfrac{108}{4 \cdot 30} = \dfrac{108}{120} = 0{,}9$.
