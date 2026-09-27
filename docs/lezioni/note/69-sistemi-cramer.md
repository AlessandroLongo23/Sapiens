# Note: Determinanti e regola di Cramer

Lezione nuova, scritta da zero (lotto 7). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`scratchpad/69-verifica.py`): i determinanti $2 \times 2$ con `Matrix.det`, i sette esempi con `linsolve` o `solve`, i determinanti letterali fattorizzati con `factor`, i valori $k = \pm 1$ e $k = 0$ sostituiti nei sistemi, i singoli prodotti di Sarrus dell'esempio 7 (per $D$, $D_x$, $D_y$, $D_z$), la formula di Sarrus in generale, la formula di Cramer in generale (sostituita nel sistema dà zero) e l'esempio $x + y + z = 1, 2, 3$ con tutti i determinanti nulli e nessuna soluzione.

## Scelte di convenzione e dubbi

- Parametro $k$, non $a$. La lezione 50 usa $a$, ma qui $a$, $b$, $c$, $a'$, $b'$, $c'$ sono i coefficienti del sistema generale, e $D = ab' - a'b$ con un parametro $a$ confonderebbe. La lezione lo dice in una frase. Se la 68 o la 78 scelgono diversamente, si rinomina senza altre conseguenze. Da verificare con il libro in uso.
- Coppie scritte $(x, y)$ con la virgola, come nella 39 e nella 42; terne $(x, y, z)$. La risposta si scrive "la soluzione è la coppia $(2, 1)$", e $S = \emptyset$ per i sistemi impossibili. Da allineare con la 68 quando sarà scritta (se lì le soluzioni sono $S = \{(2, 1)\}$, vanno cambiate sette frasi).
- Nomi: $D$ "determinante del sistema", $D_x$, $D_y$, $D_z$. Non ho introdotto "matrice incompleta" e "matrice completa", che alcuni libri usano; né "minori" o sviluppo di Laplace, che non sono del biennio.
- Matrice con le tonde, determinante con le barre; la lezione dice che non sono intercambiabili.
- La discussione. La tabella a tre righe è quella dei libri. L'avvertenza sui casi degeneri l'ho resa esatta: per due equazioni, $D = D_x = D_y = 0$ vuol dire indeterminato in tutti i casi tranne quando i quattro coefficienti delle incognite sono zero (l'ho dimostrato a parte: se un coefficiente, per esempio $a$, non è zero, $D = 0$ e $D_y = 0$ rendono la seconda equazione un multiplo della prima). Sta in un `ad-note`, con l'esempio 5 che mostra il caso vero, nei sistemi letterali ($k = 0$ annulla tutti i coefficienti).
- Per tre incognite la lezione dice che con $D = 0$ Cramer non decide e la tabella non si estende (controesempio delle tre equazioni $x + y + z = 1, 2, 3$). Alcuni libri danno la stessa tabella anche per tre incognite: è sbagliato, e l'ho evitato.
- La regola di Cramer è ricavata con la riduzione ($D \cdot x = D_x$, $D \cdot y = D_y$), perché le stesse due uguaglianze spiegano la discussione. Il passo "sostituendola si controlla che lo risolve" non è svolto in lettere: è una verifica lunga e poco utile a quest'età.
- I titoli "La regola di Cramer" e "regola di Sarrus" danno l'avviso sulle maiuscole di `check.mts`: sono nomi propri.

## Lasciato ad altre lezioni

- Metodi di sostituzione, confronto e riduzione, forma normale, criterio con i rapporti $\frac{a}{a'}$, $\frac{b}{b'}$ e interpretazione grafica: tutto nella 68, con link. Qui c'è una frase che collega $D = 0$ ai rapporti e alle rette parallele o coincidenti, senza figura.
- Parametro e discussione: link alla 50. Scomposizione di $k^2 - 1$: link alla 35. Semplificazione: link alla 47 nel procedimento.
- Problemi: nessuno, sono della 70.
- Sistemi di tre equazioni: solo sostituzione e Cramer, come chiede il brief; la riduzione è citata solo per il caso $D = 0$.

## Figure

Due, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in PNG in chiaro e con il filtro del tema scuro:
- `determinante-2x2-diagonali` (116×68): le quattro lettere tra due barre, diagonale principale blu con "$+ad$", secondaria rossa con "$-bc$".
- `regola-di-sarrus` (160×131): matrice $a \dots i$ con le prime due colonne ricopiate in grigio, tre diagonali blu continue con i "+" in basso, tre rosse tratteggiate con i "−" in alto. Le linee si interrompono sulle lettere, com'è normale nei nodi TikZ. Tinte `blue!60` e `red!55`, niente `\clip` né riempimenti bianchi.

Non le ho viste sul sito. Nessuna figura nel formulario. Tutte le formule in evidenza stanno sotto i 240 px (misurate con KaTeX a 17 px; la più larga è 237 px).

## Formulario e flashcard

- Formulario: determinante $2 \times 2$, i tre determinanti, Cramer e procedimento, tabella della discussione con l'eccezione, sistemi letterali con l'esempio 4, tre incognite con Sarrus e Cramer. Tre avvisi.
- 20 carte. `forma-normale-prima` usa $3x = 2y + 4$, una versione già semplificata della prima equazione dell'esempio 2; `caso-degenere-tutti-zero` usa il sistema dell'esempio 5 con $k = 0$.

## Da cambiare nelle lezioni già scritte

Niente di obbligatorio. Nessuna lezione pubblicata tratta i determinanti.

## Prerequisiti

La riga della bozza `sistemi-cramer <- sistemi-di-equazioni, equazioni-letterali` va bene così. La lezione parte dalla forma normale e dalla riduzione della 68, e la parte sui sistemi letterali usa parametro e discussione della 50. La scomposizione (35) e la semplificazione delle frazioni algebriche (47) servono negli esempi letterali, ma sono già antenati della 50: aggiungerle darebbe archi ridondanti.

## Per il generatore

1. Determinante di una matrice $2 \times 2$ con interi, anche negativi (il segno di $-(-bc)$).
2. Regola di Cramer su un sistema già in forma normale, soluzione intera.
3. Sistema da portare in forma normale (parentesi, denominatori, un'incognita mancante), soluzione anche frazionaria.
4. Discussione numerica: dato un sistema con $D = 0$, dire se è impossibile o indeterminato calcolando $D_x$ e $D_y$; oppure trovare il valore di un coefficiente che rende $D = 0$.
5. Sistemi letterali con un parametro $k$: valori che annullano $D$, soluzione per gli altri valori, caso per caso (compreso, ogni tanto, il caso con tutti i coefficienti nulli).
6. Determinante di una matrice $3 \times 3$ con la regola di Sarrus.
7. Sistema di tre equazioni in tre incognite, con sostituzione o Cramer, soluzione intera.
