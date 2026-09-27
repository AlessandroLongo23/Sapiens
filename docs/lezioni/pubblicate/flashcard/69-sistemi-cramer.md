# Flashcard: Determinanti e regola di Cramer

## determinante-2x2-formula
Quanto vale $\begin{vmatrix} a & b \\ c & d \end{vmatrix}$?
---
$ad - bc$: il prodotto della diagonale principale meno quello della diagonale secondaria.

## determinante-2x2-conto
Quanto vale $\begin{vmatrix} 3 & 5 \\ 2 & 4 \end{vmatrix}$?
---
$2$. Infatti $3 \cdot 4 - 2 \cdot 5 = 12 - 10$.

## determinante-2x2-segni
Quanto vale $\begin{vmatrix} 2 & -3 \\ 4 & 1 \end{vmatrix}$?
---
$14$. Infatti $2 - (-3) \cdot 4 = 2 - (-12)$.

## determinante-matrice-differenza
Vero o falso: la matrice e il suo determinante sono la stessa cosa scritta in due modi.
---
Falso. La matrice è una tabella di numeri, il determinante è un numero.

## determinante-del-sistema
Nel sistema $ax + by = c$, $a'x + b'y = c'$, come si calcola il determinante del sistema $D$?
---
$D = ab' - a'b$: è il determinante dei coefficienti delle incognite.

## determinante-dx
Come si ottiene $D_x$ da $D$?
---
Mettendo la colonna dei termini noti al posto della colonna dei coefficienti di $x$.

## regola-cramer
Se $D \neq 0$, quanto valgono $x$ e $y$ con la regola di Cramer?
---
$x = \dfrac{D_x}{D}$ e $y = \dfrac{D_y}{D}$.

## cramer-conto
In un sistema $D = -5$, $D_x = -10$, $D_y = -5$. Qual è la soluzione?
---
La coppia $(2, 1)$.

## quoziente-rovesciato
Vero o falso: $x = \dfrac{D}{D_x}$.
---
Falso. Il determinante del sistema sta al denominatore: $x = \dfrac{D_x}{D}$.

## forma-normale-prima
Nel sistema $3x = 2y + 4$, $3x + 2y = 6$, qual è il coefficiente di $y$ nella prima riga di $D$?
---
$-2$. Prima si porta $2y$ a primo membro: $3x - 2y = 4$.

## incognita-mancante
Nel sistema $x = 3$, $x + y = 5$, qual è la prima riga di $D$?
---
$1$, $0$: l'incognita $y$ manca, quindi ha coefficiente $0$.

## discussione-d-diverso-zero
Se $D \neq 0$, com'è il sistema?
---
Determinato: ha una sola soluzione.

## discussione-impossibile
$D = 0$ e $D_x = -2$. Com'è il sistema?
---
Impossibile: $D \cdot x = D_x$ diventa $0 \cdot x = -2$.

## discussione-indeterminato
$D = D_x = D_y = 0$, e non tutti i coefficienti delle incognite sono zero. Com'è il sistema?
---
Indeterminato: ha infinite soluzioni.

## d-zero-impossibile
Vero o falso: se $D = 0$ il sistema è impossibile.
---
Falso. Può essere impossibile o indeterminato: lo dicono $D_x$ e $D_y$.

## caso-degenere-tutti-zero
Il sistema $0x + 0y = 3$, $0x + 0y = 0$ ha $D = D_x = D_y = 0$. Com'è?
---
Impossibile: la prima equazione dice $0 = 3$.

## letterale-valori-d-zero
Nel sistema $kx + y = 1$, $x + ky = 1$, per quali valori di $k$ il determinante $D$ vale zero?
---
Per $k = 1$ e $k = -1$: $D = k^2 - 1 = (k - 1)(k + 1)$.

## letterale-formula-semplificata
Nel sistema $kx + y = 1$, $x + ky = 1$ si trova $x = \dfrac{1}{k + 1}$. Vale anche per $k = 1$?
---
No. Per $k = 1$ il sistema è indeterminato: la formula vale solo dove $D \neq 0$.

## sarrus-formula
Con la regola di Sarrus, quanto vale $\begin{vmatrix} a & b & c \\ d & e & f \\ g & h & i \end{vmatrix}$?
---
$aei + bfg + cdh - ceg - afh - bdi$.

## sarrus-solo-3x3
Vero o falso: la regola di Sarrus vale anche per le matrici $4 \times 4$.
---
Falso. Vale solo per le matrici $3 \times 3$.
