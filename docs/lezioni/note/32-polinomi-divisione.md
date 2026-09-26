# Note: Divisione tra polinomi

Lezione nuova, scritta da zero (lotto 3). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: le cinque divisioni degli esempi passo per passo (ogni termine del quoziente, ogni opposto del prodotto, ogni resto parziale), l'esempio iniziale $x^2 + 3x + 5 = (x + 1)(x + 2) + 3$, il resto sbagliato dell'avviso sui segni ($-7x^2 + 4x - 5$), la verifica per moltiplicazione e quella con $x = 1$, $x^2 - y^2$ diviso $x - y$ e i due conti dei livelli per gli esercizi.

## Scelte di convenzione

- Schema all'italiana: dividendo a sinistra, divisore a destra oltre una linea verticale, quoziente sotto il divisore, resti parziali in colonna sotto il dividendo.
- Al passo 3 si scrive l'opposto del prodotto e si somma, come fa la maggior parte dei libri italiani; alcuni scrivono il prodotto e sottraggono. La lezione dice che il risultato è lo stesso.
- Si completa il dividendo con i termini $0x^n$; il divisore si ordina ma non si completa (l'esempio 5 mostra un divisore incompleto, $x^2 + 2$). Qualche libro consiglia di completare anche il divisore: da verificare se vale la pena dirlo.
- "Resto parziale" come unico nome per i resti intermedi (alcuni libri dicono "dividendo parziale").
- L'enunciato dice "esistono e sono unici" senza nominare l'insieme dei coefficienti: l'esempio 4 mostra che con coefficienti interi il quoziente può avere frazioni. Non ho parlato di divisione in ℤ[x].
- La condizione sul resto è "polinomio nullo oppure grado minore del divisore", per non dare un grado al polinomio nullo.
- Il ":" compare solo nei passi del tipo $2x^3 : x = 2x^2$, come nella lezione 13.

## Lo schema e le figure

- Una figura TikZ, `schema-divisione-in-colonna-polinomi`, dentro l'esempio 1: la divisione completa di $2x^3 - 3x^2 + 4x - 5$ per $x - 2$ con le etichette dividendo, divisore, quoziente e resto. L'ho compilata con `scripts/figure/compile.mjs` (409x195) e guardata in chiaro: colonne allineate, linee sotto i prodotti al posto giusto. Non l'ho vista in tema scuro sul sito; non usa riempimenti né `\clip`.
- Gli esempi 2-5 usano un `array` di KaTeX, perché KaTeX non ha `\cline`: le linee di somma sono `\underline` sulle singole celle (con un piccolo stacco tra una cella e l'altra), le celle vuote sottolineate dell'esempio 5 sono `\underline{\hphantom{...}}`, e `\def\arraystretch{1.5}` distanzia le righe. Li ho resi con KaTeX e guardati: leggibili. Da controllare sul telefono: gli array con cinque colonne (esempi 3 e 5) sono larghi e forse scorrono in orizzontale. Se non vanno, si possono ridisegnare in TikZ come l'esempio 1, a costo di quattro figure in più.
- Il formulario ripete l'array dell'esempio 2 (non è una figura nuova, è una formula).

## Lasciato ad altre lezioni

- Divisione di un polinomio per un monomio: link a Operazioni tra polinomi (29).
- Regola di Ruffini e teorema del resto: solo l'ultimo paragrafo con il link alla 33. Il controllo con $x = 1$ nel riquadro `ad-tip` è un valore numerico e non cita il teorema del resto.
- Scomposizione: una frase e il link a Raccoglimento totale e parziale (34), la prima lezione del capitolo, perché la lista degli URL non ha una pagina di lezione sulla scomposizione in generale.
- Il riquadro `ad-note` sui polinomi in più lettere ($x^2 - y^2$ diviso $x - y$) va oltre la riga del brief, che dice "polinomi in una variabile". L'ho messo perché i libri fanno qualche esercizio di questo tipo; si può togliere senza toccare il resto.

## Da controllare in lezioni già scritte

- Operazioni tra monomi (13), sezione "Potenza": il link "potenza di un monomio" punta alla lezione stessa (`operazioni-tra-monomi`). Non riguarda questa lezione, l'ho visto rileggendo il modello.
- Nessuna lezione scritta tratta la divisione tra polinomi, quindi non c'è altro da togliere. Quando si scrive la 29, la divisione per un monomio deve fermarsi lì e rimandare qui per i divisori con più termini.

## Formulario e flashcard

- 18 carte. `grado-quoziente` usa gradi $5$ e $2$, che non sono nella lezione (la lezione usa $4$ e $2$); la regola sì. `quoziente-con-frazioni` usa la divisione dell'esempio 4.
- Nel formulario i tre avvisi sono le tre cose che fanno sbagliare di più: potenze mancanti, segni del prodotto, quando fermarsi.

## Livelli per gli esercizi

1. Dividendo di secondo grado completo per $x + a$ o $x - a$, coefficienti interi: $(x^2 + 5x + 7) : (x + 2)$, $Q = x + 3$, $R = 1$.
2. Dividendo di terzo grado completo per $x - a$: $(2x^3 - 3x^2 + 4x - 5) : (x - 2)$, $Q = 2x^2 + x + 6$, $R = 7$.
3. Dividendo incompleto per un divisore di primo grado: $(x^3 - 7x + 6) : (x - 2)$, $Q = x^2 + 2x - 3$, $R = 0$.
4. Divisore di secondo grado con primo coefficiente $1$, anche incompleto: $(x^4 + 2x^3 - x + 3) : (x^2 - x + 1)$, $Q = x^2 + 3x + 2$, $R = -2x + 1$.
5. Divisore con primo coefficiente diverso da $1$ (quoziente con frazioni) o dividendo da ordinare: $(4 - x^2 + 6x^3) : (2x - 1)$, $Q = 3x^2 + x + \frac{1}{2}$, $R = \frac{9}{2}$.
6. Divisibilità: dire se $A$ è divisibile per $B$ e, se lo è, scrivere $A = B \cdot Q$: $2x^3 + 3x^2 - 9x - 10 = (x^2 - x - 2)(2x + 5)$.

Per il generatore conviene costruire gli esercizi partendo da $B$, $Q$ e $R$ e calcolando $A = B \cdot Q + R$, così i coefficienti restano piccoli.

## Prerequisiti

La riga `polinomi-divisione <- polinomi-operazioni` va bene così. La lezione usa il prodotto di un monomio per un polinomio, la somma algebrica in colonna, i polinomi ordinati e completi e il grado: tutto è in Operazioni tra polinomi o nelle lezioni che la precedono (Polinomi, Operazioni tra monomi), che la 29 ha già come prerequisiti, quindi aggiungerle sarebbe un arco ridondante. I prodotti notevoli non servono. Anche `polinomi-ruffini <- polinomi-divisione` è giusta: Ruffini è una scorciatoia di questa divisione.
