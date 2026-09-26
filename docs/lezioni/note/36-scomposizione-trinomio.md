# Note: Trinomio di secondo grado

Lezione nuova, scritta da zero (lotto 3). Tutti i conti di lezione, formulario e carte (sviluppi, spezzamenti del termine di primo grado, raccoglimenti parziali, scomposizioni finali, irriducibilità dei trinomi dichiarati irriducibili, il controllo con $x = 1$) sono stati rifatti con SymPy (`expand` e `factor_list`).

## Scelte di convenzione

- Il nome del trinomio $x^2 + sx + p$: i libri lo chiamano in modi diversi ("trinomio caratteristico", "trinomio speciale", "trinomio notevole", "trinomio somma e prodotto"). Non ho usato nessuno di questi nomi, solo "il trinomio $x^2 + sx + p$", per non sceglierne uno a caso. Da decidere se citarne uno, dopo aver guardato un paio di libri in uso.
- Le lettere $s$ e $p$ per coefficiente e termine noto (somma e prodotto), $m$ e $n$ per i due numeri; $a$, $b$, $c$ per il trinomio generale. Le lettere $a$, $b$ qui sono coefficienti, non le basi dei prodotti notevoli: non si mescolano, perché la lezione non scrive formule di prodotti notevoli con $a$ e $b$.
- Scomposizione in ℤ, come da brief. La lezione dice che un trinomio senza coppia di interi è irriducibile; per $x^2 + sx + p$ questo è vero in senso stretto (i fattori di primo grado a coefficienti interi di un polinomio con primo coefficiente $1$ hanno la forma $x + m$). Per $ax^2 + bx + c$ ho scritto la frase più prudente "non si scompone in fattori di primo grado con coefficienti interi", perché $2x^2 + 4x + 6 = 2(x^2 + 2x + 3)$ ha comunque il fattore $2$.
- L'ordine dei fattori nel risultato segue l'ordine in cui escono dal procedimento ($(x - 3)(x + 5)$, $(2x + 1)(x + 3)$), senza una regola. Se si vuole una convenzione di lotto (per esempio fattori ordinati per termine noto crescente), va decisa per tutte le lezioni di scomposizione.
- Per $a \neq 1$ ho scelto il metodo dello spezzamento del termine di primo grado (somma $b$, prodotto $a \cdot c$) seguito dal raccoglimento parziale, come dice il brief. Alcuni libri al primo anno propongono invece di raccogliere $a$ e lavorare con le frazioni, oppure rimandano tutto alla formula del secondo anno: non li ho citati.
- La tabella dei segni è l'unica tabella, perché confronta tre casi.

## Lasciato ad altre lezioni

- Cosa vuol dire scomporre, polinomio irriducibile, raccoglimento totale e parziale: [Raccoglimento totale e parziale], con link nel secondo paragrafo. Qui "irriducibile" non è in grassetto perché la definizione è lì.
- Quadrato di un binomio, differenza di quadrati, somma e differenza di cubi: [Scomposizione con i prodotti notevoli]. Qui si usano solo nel suggerimento "Quando i due numeri sono uguali" e negli esempi 12 e 14, con il link.
- Formula risolutiva: solo il riquadro `ad-note` "Numeri non interi" con il link a [Equazioni di secondo grado], nessuna formula.
- Scomposizione quando il metodo non trova i due numeri e ordine in cui provare i metodi: [Scomposizione con la regola di Ruffini], con il link nell'ultima riga.

## Da togliere o controllare in lezioni già scritte

- Scomposizione con la regola di Ruffini (lotto 3) scrive, nell'esempio con $x^2 + x + 1$, "non ci sono due interi con somma $1$ e prodotto $1$": è coerente con questa lezione e potrebbe avere il link qui. Anche il caso $x^4 + 5x^2 + 6 = (x^2 + 2)(x^2 + 3)$ di quella lezione è un trinomio in $x^2$, trattato qui.
- Equazioni di secondo grado: nell'esempio con $4x^2 - 12x + 9$ c'è il quadrato di un binomio; si potrebbe aggiungere un link a questa lezione dove si dice che alcune equazioni si risolvono scomponendo, se la lezione lo dice (non l'ho verificato riga per riga).
- Nessuna lezione già pubblicata tratta il trinomio, quindi non c'è niente da togliere.

## Figura

Una: `trinomio-area-rettangolo`, il rettangolo di lati $x + 3$ e $x + 2$ diviso in $x^2$, $3x$, $2x$ e sei quadratini, nella sezione "Da dove viene la regola". Compilata con `scripts/figure/compile.mjs` (181 × 159) e guardata in chiaro: lettere e quadratini leggibili, etichette dei lati allineate. Niente `\clip`, niente riempimenti. Non l'ho vista sul sito in tema scuro. Non è nel formulario.

## Formulario e flashcard

- 18 carte. Tutte usano numeri della lezione.
- Il formulario ha i tre errori più costosi della lezione (segno del numero grande, numeri nelle parentesi con $a \neq 1$, fermarsi al primo passo nel quarto grado). Il riquadro sulla seconda lettera ("dimenticare la $y$") è rimasto solo nella lezione.

## Prerequisiti

La riga `scomposizione-trinomio <- scomposizione-raccoglimento` va bene così. Il metodo per $x^2 + sx + p$ usa solo il prodotto di polinomi (che arriva tramite il raccoglimento), il metodo per $a \neq 1$ usa il raccoglimento parziale. I prodotti notevoli servono solo negli esempi 12 e 14 e nel suggerimento sul quadrato, che rimandano con un link: sono un collegamento, non un prerequisito. Aggiungere `scomposizione-prodotti-notevoli` renderebbe ridondanti gli archi di `polinomi-mcd-mcm` e `frazioni-algebriche-esistenza`, che elencano già tutte e due le lezioni.

## Livelli per gli esercizi

1. $x^2 + sx + p$ con $p$ e $s$ positivi: $x^2 + 7x + 12 = (x + 3)(x + 4)$.
2. $x^2 + sx + p$ con $p$ positivo e $s$ negativo, o con $p$ negativo: $x^2 - 9x + 14 = (x - 2)(x - 7)$, $x^2 - x - 20 = (x - 5)(x + 4)$.
3. Raccoglimento prima del trinomio (fattore comune o segno meno), oppure riconoscere un trinomio irriducibile: $2x^3 - 4x^2 - 30x = 2x(x - 5)(x + 3)$, $x^2 + 4x + 2$ irriducibile.
4. $ax^2 + bx + c$ con $a \neq 1$: $6x^2 - x - 2 = (2x + 1)(3x - 2)$.
5. Trinomi in due lettere: $x^2 - 2xy - 15y^2 = (x - 5y)(x + 3y)$, $3x^2 - 7xy + 2y^2 = (3x - y)(x - 2y)$.
6. $x^4 + sx^2 + p$ con scomposizione completa dei fattori: $x^4 - 10x^2 + 9 = (x - 1)(x + 1)(x - 3)(x + 3)$.
