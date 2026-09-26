# Note: Semplificazione delle frazioni algebriche

Lezione nuova, scritta da zero (lotto 4). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`simplify` della differenza tra frazione data e risultato, `factor` dei denominatori per le C.E., `cancel` per controllare che il risultato sia irriducibile): i dieci esempi, gli avvisi, il controllo numerico con $x = 2$ e $x = -3$, le frazioni ridotte allo stesso denominatore e le carte con un conto. Le formule in evidenza sono state misurate con KaTeX a 19 px: la più larga dentro un riquadro è 227 px (esempio 4), fuori dai riquadri 268 px (formulario).

## Scelte di convenzione

- C.E. con più valori scritte "C.E.: $x \neq 0$, $x \neq -3$", con la virgola. Il brief di lotto dà solo il caso con un valore; conviene che 46, 48 e 49 facciano lo stesso (alcuni libri scrivono $x \neq 0 \land x \neq -3$ o $x \neq 0, -3$).
- Frazioni equivalenti: "hanno lo stesso valore per tutti i valori delle lettere per cui esistono tutte e due". Con questa definizione $\dfrac{x^2 - 9}{x^2 + 3x}$ e $\dfrac{x - 3}{x}$ sono equivalenti, e la lezione dice a parte che il risultato porta con sé le C.E. della frazione di partenza. Alcuni libri definiscono l'equivalenza solo "nel dominio comune" o scrivono l'uguaglianza con le C.E. accanto: è la stessa cosa detta in un altro modo.
- Irriducibile: nessun fattore comune, né polinomi di grado almeno $1$ né numeri diversi da $\pm 1$. Vale per coefficienti interi, gli unici della lezione; i coefficienti frazionari non compaiono.
- Fattori opposti: si porta fuori il segno meno con la stessa convenzione della 38 (forma con il primo termine positivo, $x - 2$ e non $2 - x$). Il segno che resta va davanti alla frazione ($-\dfrac{3}{x - 2}$); l'esempio 4 dice che $\dfrac{1 - x}{x + 1}$ è la stessa frazione, perché i libri usano tutte e due le forme.
- Il risultato si lascia con il denominatore scomposto (esempio 6), come il MCM nella 38.
- Nella riduzione allo stesso denominatore i numeratori restano scomposti ($3(x + 1)$, $5(x + 2)^2$); la lezione dice che si sviluppano quando vanno sommati, cosa che fa la 48.
- "Semplificare i fattori, non i termini": uso "termini" nel titolo dell'avviso e "addendi" nel formulario. Se si preferisce una parola sola, "termini" è quella della 38.

## Lasciato ad altre lezioni

- Condizioni di esistenza e legge di annullamento del prodotto: solo il link alla 46 in apertura. La lezione presuppone che lo studente sappia leggere le C.E. da un denominatore scomposto; l'esempio 7 ($x^2 + 1$) ripete in una frase perché il denominatore non si annulla mai, che è anche nella 46.
- Scomposizione: link a 34-37 nel passo 2 del procedimento, nessuna tecnica rispiegata. L'esempio 6 dice solo i due zeri del denominatore e dà la scomposizione di Ruffini senza tabella.
- MCM di polinomi: link alla 38, con il calcolo del MCM ridotto a una frase negli esempi 8-10.
- Somma, prodotto, quoziente e potenza di frazioni algebriche: solo il link alla 48 nella sezione sulla riduzione.
- Proprietà invariantiva delle frazioni di numeri: link a Frazioni e numeri razionali (lezione 23), che la tratta con lo stesso nome.

## Da togliere o controllare in lezioni già scritte

- MCD e MCM di polinomi (38), apertura: "Il MCM di polinomi ti servirà come denominatore comune quando sommerai le frazioni con i polinomi al denominatore" può diventare un link a questa lezione (sezione sulla riduzione) o alla 48.
- Raccoglimento (34) e Ruffini (37) citano "le frazioni algebriche" senza link: ora il link a 46 o a questa lezione si può mettere.
- Niente da togliere: nessuna lezione scritta tratta la semplificazione delle frazioni algebriche.

## Figure

Nessuna. L'argomento è di calcolo e nessun paragrafo parla di un diagramma; non ho trovato una figura che chiarisca più di un esempio.

## Formulario e flashcard

- Il formulario ha i due procedimenti, un esempio per la semplificazione e uno per la riduzione, le regole dei fattori opposti e tre avvisi (termini, C.E. scritte dopo, moltiplicare solo il denominatore). Non ha gli esempi 5-7.
- 18 carte. La carta `semplificazione-con-opposti` usa $\dfrac{3 - x}{x^2 - 9}$, che non è tra gli esempi della lezione; la regola sì (sezione "Fattori opposti" ed esempio 3).

## Dubbi

- Dove sta la riduzione allo stesso denominatore. Il brief la mette qui; molti libri la mettono all'inizio delle operazioni (la 48), subito prima della somma. Qui ha senso come applicazione della proprietà invariantiva letta da sinistra a destra, ma la 48 dovrà evitare di rispiegarla e limitarsi a un link.
- La lezione non parla di semplificazione con fattori comuni a più lettere oltre l'esempio 5 (due lettere, C.E. $x \neq y$, $x \neq -y$). Se la 46 non tratta le C.E. con due lettere, l'esempio 5 anticipa qualcosa: da controllare quando la 46 è scritta.

## Prerequisiti

Oggi la riga è `frazioni-algebriche-semplificazione <- frazioni-algebriche-esistenza`. La cambierei in

`frazioni-algebriche-semplificazione <- frazioni-algebriche-esistenza, polinomi-mcd-mcm`

perché la seconda metà della lezione (riduzione allo stesso denominatore) usa il MCM di polinomi in ogni esempio, e il passo 4 della semplificazione è la divisione per il MCD. Con questo arco, nella riga di `frazioni-algebriche-operazioni` l'arco verso `polinomi-mcd-mcm` diventa ridondante e va tolto: resterebbe `frazioni-algebriche-operazioni <- frazioni-algebriche-semplificazione`. La regola di Ruffini serve solo all'esempio 6 e non è un prerequisito: si segue la lezione anche saltando quell'esempio.

## Per il generatore

1. Semplificazione con un denominatore monomio e raccoglimento al numeratore, anche con fattori numerici: $\dfrac{4x^2 - 6x}{10x^2} = \dfrac{2x - 3}{5x}$, C.E.: $x \neq 0$.
2. Semplificazione con differenza di quadrati o trinomio sopra e sotto, un fattore comune: $\dfrac{x^2 - 4}{x^2 + x - 6} = \dfrac{x + 2}{x + 3}$, C.E.: $x \neq -3$, $x \neq 2$. Includere i casi in cui resta $1$ al numeratore o il risultato è un polinomio.
3. Semplificazione con fattori opposti, anche con esponenti diversi: $\dfrac{6 - 3x}{x^2 - 4x + 4} = -\dfrac{3}{x - 2}$, $\dfrac{x^2 - 2x + 1}{1 - x^2} = -\dfrac{x - 1}{x + 1}$.
4. Semplificazione con raccoglimento parziale, due lettere, cubi o Ruffini: $\dfrac{ax - ay + bx - by}{x^2 - y^2} = \dfrac{a + b}{x + y}$, $\dfrac{x^3 - 8}{x^3 - 3x^2 + 4}$.
5. Riduzione allo stesso denominatore di due frazioni: $\dfrac{3}{x^2 - x}$ e $\dfrac{2}{x^2 - 1}$, denominatore $x(x - 1)(x + 1)$.
6. Riduzione allo stesso denominatore di due o tre frazioni con un denominatore opposto o fattori numerici: $\dfrac{1}{x - 3}$ e $\dfrac{x}{9 - x^2}$; $\dfrac{1}{2x + 4}$, $\dfrac{x}{x^2 + 4x + 4}$, $\dfrac{5}{6x}$.

In ogni livello di semplificazione la risposta dovrebbe chiedere anche le C.E.: è l'errore su cui la lezione insiste di più. Il controllo può confrontare il risultato con `cancel` e le C.E. con gli zeri del denominatore di partenza.
