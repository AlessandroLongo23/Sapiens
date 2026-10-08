# Flashcard: Le matrici

## matrice-definizione
Che cos'è una matrice?
---
Una tabella di elementi dello stesso tipo, disposti in righe e colonne, con un nome solo.

## due-indici
In `m[i][j]` quale indice dice la riga e quale la colonna?
---
Il primo, `i`, dice la riga; il secondo, `j`, la colonna.

## indici-da-zero
Una matrice ha $3$ righe e $4$ colonne. Come si scrive l'elemento in basso a destra?
---
`m[2][3]`: gli indici di riga vanno da $0$ a $2$, quelli di colonna da $0$ a $3$.

## quanti-elementi
Quanti elementi ha una matrice di $3$ righe e $4$ colonne?
---
$12$, cioè $3 \cdot 4$.

## leggere-elemento
Le righe di `voti` sono 7, 8, 6, 9 poi 5, 6, 7, 6 poi 8, 9, 9, 10. Quanto vale `voti[1][2]`?
---
$7$: riga di indice $1$, colonna di indice $2$.

## indici-scambiati
Con la stessa matrice `voti`, quanto vale `voti[2][1]`? È lo stesso elemento di `voti[1][2]`?
---
Vale $9$. No: scambiando i due indici si arriva a un altro elemento.

## indice-fuori
`voti` ha $3$ righe e $4$ colonne. Che cosa succede in Python con `voti[3][1]`?
---
Il programma si ferma con `IndexError`: la riga di indice $3$ non esiste.

## python-lista-di-liste
In Python, con `voti` di $3$ righe e $4$ colonne, che cosa danno `len(voti)` e `len(voti[0])`?
---
$3$ e $4$: il numero delle righe e la lunghezza di una riga, cioè il numero delle colonne.

## cpp-dichiarazione
In `int voti[R][C];` che cosa indicano `R` e `C`?
---
Il numero delle righe e quello delle colonne, in quest'ordine.

## cicli-ruoli
Nei due cicli annidati che sommano per righe, che cosa fa il ciclo esterno e che cosa quello interno?
---
Quello esterno sceglie la riga con `i`; quello interno la percorre con `j`.

## quante-volte-corpo
Quante volte viene eseguito il corpo interno su una matrice di $R$ righe e $C$ colonne?
---
$R \cdot C$ volte, una per elemento.

## dove-azzerare
Nella somma per righe, dove va l'istruzione `somma = 0`?
---
Dentro il ciclo esterno, prima di quello interno: la somma riparte a ogni riga.

## azzerare-fuori
Le somme delle righe sono $30$, $24$ e $36$. Che cosa scrive il programma se `somma = 0` sta sopra il ciclo esterno?
---
$30$, $54$ e $90$: ogni riga si aggiunge a quelle di prima.

## per-colonne
Che cosa cambia nei due cicli per sommare per colonne?
---
I cicli si scambiano di posto: quello esterno muove `j`, quello interno `i`. L'elemento resta `m[i][j]`.

## somme-colonne
Le righe di `m` sono 1, 2, 3 e 4, 5, 6. Quali sono le somme delle colonne?
---
$5$, $7$ e $9$.

## diagonale-principale
Come si scrive l'elemento della diagonale principale che sta nella riga `i`?
---
`m[i][i]`: i due indici sono uguali.

## diagonale-secondaria
In una matrice quadrata di $N$ righe, qual è l'elemento della diagonale secondaria nella riga `i`?
---
`m[i][N - 1 - i]`: i due indici hanno somma $N - 1$.

## diagonale-conto
Le righe di `m` sono 2, 0, 1 poi 0, 3, 0 poi 5, 0, 4. Quanto vale la somma della diagonale principale?
---
$9$, cioè $2 + 3 + 4$.
