# Flashcard: Relazioni di equivalenza e d'ordine

## cappio-significato
In un diagramma di una relazione, che cosa vuol dire un cappio sull'elemento $a$?
---
Che $a$ è in relazione con sé stesso: $a \mathrel{\mathcal{R}} a$.

## riflessiva-definizione
Quando una relazione $\mathcal{R}$ in $A$ è riflessiva?
---
Quando $a \mathrel{\mathcal{R}} a$ per ogni $a \in A$: nel diagramma c'è un cappio su ogni elemento.

## antiriflessiva-non-riflessiva
Vero o falso: una relazione che non è riflessiva è antiriflessiva.
---
Falso. In $\{1, 2\}$ la relazione $\{(1, 1)\}$ non è né riflessiva né antiriflessiva.

## simmetrica-diagramma
Come si riconosce nel diagramma una relazione simmetrica?
---
Ogni freccia tra due elementi diversi ha la freccia di ritorno.

## antisimmetrica-definizione
Completa: $\mathcal{R}$ è antisimmetrica se $a \mathrel{\mathcal{R}} b$ e $b \mathrel{\mathcal{R}} a$ implicano $\dots$
---
$a = b$.

## antisimmetrica-non-simmetrica
Vero o falso: una relazione antisimmetrica non può essere simmetrica.
---
Falso. L'uguaglianza è simmetrica e anche antisimmetrica.

## transitiva-definizione
Completa: $\mathcal{R}$ è transitiva se $a \mathrel{\mathcal{R}} b$ e $b \mathrel{\mathcal{R}} c$ implicano $\dots$
---
$a \mathrel{\mathcal{R}} c$.

## transitiva-andata-ritorno
Se una relazione è transitiva e $a \mathrel{\mathcal{R}} b$ e $b \mathrel{\mathcal{R}} a$, che cosa deve valere ancora?
---
$a \mathrel{\mathcal{R}} a$: il percorso da $a$ a $b$ e ritorno richiede il cappio su $a$.

## perpendicolarita-transitiva
Vero o falso: "essere perpendicolare a" tra le rette del piano è transitiva.
---
Falso. Se $r$ è perpendicolare a $s$ e $s$ a $t$, allora $r$ è parallela a $t$.

## prodotto-positivo-riflessiva
In $\mathbb{Z}$, la relazione "$a \cdot b > 0$" è riflessiva?
---
No: $0 \cdot 0 = 0$, quindi lo zero non è in relazione con sé stesso.

## equivalenza-definizione
Quali proprietà ha una relazione di equivalenza?
---
Riflessiva, simmetrica e transitiva.

## classe-equivalenza-definizione
Che cos'è la classe di equivalenza $[a]$?
---
L'insieme degli elementi equivalenti ad $a$: $[a] = \{x \in A \mid x \mathrel{\mathcal{R}} a\}$.

## classi-disgiunte
Due classi di equivalenza diverse possono avere un elemento in comune?
---
No. Due classi o coincidono o non hanno elementi in comune.

## resto-tre-classi
Quante classi ha la relazione "stesso resto nella divisione per $3$" in $\mathbb{N}$?
---
Tre: $[0]$, $[1]$ e $[2]$, perché il resto può essere solo $0$, $1$ o $2$.

## resto-tre-rappresentante
Con la relazione "stesso resto nella divisione per $3$", a quale classe tra $[0]$, $[1]$, $[2]$ è uguale $[100]$?
---
$[1]$, perché $100 = 3 \cdot 33 + 1$.

## insieme-quoziente
Che cosa sono gli elementi dell'insieme quoziente $A/\mathcal{R}$?
---
Le classi di equivalenza, cioè degli insiemi, non gli elementi di $A$.

## ordine-largo-stretto
Che differenza c'è tra un ordine largo e un ordine stretto?
---
Il largo è riflessivo, lo stretto è antiriflessivo; tutti e due sono antisimmetrici e transitivi.

## ordine-totale-parziale
"$a$ è un divisore di $b$" tra i naturali diversi da zero è un ordine totale o parziale?
---
Parziale: $2$ e $3$ non sono confrontabili.

## divisibilita-interi-ordine
Tra gli interi diversi da zero, "$a$ è un divisore di $b$" è una relazione d'ordine?
---
No. Non è antisimmetrica: $2$ divide $-2$ e $-2$ divide $2$, ma $2 \neq -2$.
