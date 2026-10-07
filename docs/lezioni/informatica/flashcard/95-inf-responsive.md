# Flashcard: Pagine responsive e accessibili

## responsive
Quando una pagina si dice responsive?
---
Quando cambia impaginazione secondo la larghezza che ha a disposizione, dal telefono al computer.

## viewport
Che cos'è il viewport?
---
La parte della finestra del browser in cui viene disegnata la pagina.

## meta-viewport
Che cosa succede su un telefono a una pagina senza `<meta name="viewport" content="width=device-width, initial-scale=1">`?
---
Il browser la disegna larga come su un computer e la rimpicciolisce: il testo è minuscolo e le media query non si attivano.

## rem
Il carattere della pagina è di $16\,\text{px}$. Quanti pixel sono `1.5rem`?
---
$24\,\text{px}$: $1{,}5 \cdot 16$.

## rem-perche
Perché la grandezza del testo si scrive in `rem` e non in `px`?
---
Perché segue la grandezza dei caratteri scelta da chi legge nel suo browser. Un testo in `px` resta com'è.

## percentuale
Un blocco ha `width: 25%` dentro un contenitore largo $800\,\text{px}$. Quanto è largo?
---
$200\,\text{px}$: un quarto del contenitore.

## vw
Il viewport è largo $500\,\text{px}$. Quanto misura `20vw`?
---
$100\,\text{px}$: `1vw` è un centesimo della larghezza del viewport.

## max-width
Un blocco ha `max-width: 30rem`. Quanto è largo in una finestra di $1200\,\text{px}$? E in una di $300\,\text{px}$?
---
$480\,\text{px}$ nella prima, perché si ferma al tetto; circa $300\,\text{px}$ nella seconda, perché segue la finestra.

## immagine-adatta
Quali due dichiarazioni impediscono a un'immagine di uscire dal suo contenitore senza deformarla?
---
`max-width: 100%` e `height: auto`.

## immagine-conto
Un'immagine di $600 \times 300$ con `max-width: 100%` e `height: auto` sta in una colonna di $200\,\text{px}$. Che dimensioni ha?
---
$200 \times 100$: la larghezza della colonna, e l'altezza in proporzione.

## immagine-tetto
La stessa immagine di $600 \times 300$, con `max-width: 100%`, sta in una colonna di $900\,\text{px}$. Si allarga a 900?
---
No, resta di $600 \times 300$: `max-width` è un tetto, non un ordine di allargarsi.

## media-query
Che cos'è una media query?
---
Una condizione sulla finestra scritta nel foglio di stile: le regole tra le sue graffe valgono solo quando è vera.

## min-width
A quali larghezze del viewport vale `@media (min-width: 700px)`?
---
Da $700\,\text{px}$ in su, compreso 700.

## limite-compreso
Il foglio ha `@media (min-width: 600px)`. A $600\,\text{px}$ esatti la media query è attiva?
---
Sì: "almeno 600" comprende 600. A $599\,\text{px}$ non lo è.

## max-width-query
Una regola deve valere solo sui telefoni, fino a $500\,\text{px}$. `min-width` o `max-width`?
---
`@media (max-width: 500px)`: vale quando il viewport è largo al più $500\,\text{px}$.

## prima-il-telefono
Che cosa vuol dire scrivere un foglio di stile "prima il telefono"?
---
Fuori dalle media query stanno le regole per lo schermo più stretto; con `min-width` si aggiunge quello che cambia sugli schermi più larghi.

## ordine-regole
La regola `.contenuto { flex-direction: column; }` è scritta sotto la media query che mette `row`. Che cosa si vede a $1000\,\text{px}$?
---
Una colonna. A parità di selettore vince la regola più in basso, anche contro una media query attiva.

## contrasto-soglie
Qual è il rapporto di contrasto minimo per il testo normale? E per il testo grande?
---
$4{,}5 : 1$ per il testo normale, $3 : 1$ per il testo grande.

## contrasto-caso
Una data scritta in grigio a $16\,\text{px}$ ha con lo sfondo un rapporto di $3{,}2 : 1$. Va bene?
---
No. È testo normale e serve almeno $4{,}5 : 1$. Lo stesso grigio andrebbe bene per un titolo di $24\,\text{px}$.

## titoli-ordine
In una pagina dopo `h1` viene un `h4`, scelto perché è più piccolo. Che cosa c'è di sbagliato?
---
Salta due livelli. Il titolo giusto è `h2`, e la grandezza si cambia nel CSS.
