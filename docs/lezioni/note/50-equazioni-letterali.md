# Note: Equazioni letterali

Lezione nuova, scritta da zero (lotto 4). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`solve` su ogni equazione, sostituzione dei valori particolari del parametro nella forma normale, i valori numerici delle formule inverse e il controllo dell'esempio 9 con $a = 0$).

## Scelte di convenzione e dubbi

- Nome della lettera. Il parametro negli esempi è $a$, come nella maggior parte dei libri, ma la forma normale $ax = b$ (presa dalla lezione 16) usa $a$ anche per il coefficiente. La lezione lo dice ("dove $a$ e $b$ ora sono espressioni con il parametro"), e negli esempi parla sempre di "coefficiente $a - 2$", non di "$a$". Resta un possibile inciampo: se si preferisce, il parametro si rinomina in $k$ in tutti gli esempi e nelle carte, senza altre conseguenze. Da decidere.
- Equazione indeterminata con $S = \mathbb{R}$, come nella lezione 16 (che ha già il riquadro su $\mathbb{Q}$ oppure $\mathbb{R}$); non l'ho ripetuto.
- "Discutere" definito come dire, per ogni valore del parametro, se l'equazione è determinata, impossibile o indeterminata. La risposta si scrive caso per caso con "se $a \neq \dots$, $S = \dots$". Alcuni libri scrivono la discussione in una tabella o con "per $a = 2$ l'equazione è indeterminata": è solo forma.
- "Intera" vuol dire: l'incognita non è a denominatore. Il parametro a denominatore è in un riquadro `ad-note` ($\dfrac{x}{a} = 3$, condizione $a \neq 0$ scritta prima di cominciare). Alcuni libri chiamano queste condizioni "condizioni sul parametro" e le distinguono dalla discussione; la lezione non usa il nome.
- Nelle formule inverse si divide per una lettera senza discutere lo zero, perché le lettere sono misure positive. La lezione lo dice una volta, all'inizio della sezione, e lo ripete nell'esempio 8 per la velocità.
- Le equazioni letterali fratte hanno un solo esempio (9), come chiede il brief. L'esempio mostra la cosa nuova: il confronto con la C.E. dà una condizione sul parametro ($a \neq 0$), e per quel valore l'equazione è impossibile.

## Lasciato ad altre lezioni

- Principi di equivalenza, forma normale, i tre casi delle equazioni numeriche: link alla 16, senza rispiegarli.
- Raccoglimento dell'incognita: link alla 34. Differenza di quadrati: link alla 35. Semplificazione del quoziente $\dfrac{b}{a}$: link alla 47 (nel passo 4 del procedimento).
- Equazioni fratte: link alla 49 nel cenno finale; C.E. scritte "C.E.: $x \neq 1$" come da convenzione di lotto.
- Problemi che portano a equazioni letterali: nessuno, sono della 51.

## Da togliere o cambiare in lezioni già scritte

- Nessuna lezione pubblicata tratta le equazioni letterali o le formule inverse, quindi non c'è niente da togliere.
- La 16 potrebbe dire, nella sezione "Equazioni determinate, impossibili e indeterminate", che gli stessi tre casi tornano nelle equazioni con un parametro, con un link a questa lezione.

## Figura

Una sola, `trapezio-basi-altezza`, dentro l'esempio 7: trapezio con $B$ in basso, $b$ in alto, altezza $h$ tratteggiata con il segno dell'angolo retto. Riempimento `blue!15`, niente `\clip` né riempimenti bianchi. Compilata con `compileFigure` di `scripts/figure/compile.mjs` (155×100) e guardata in chiaro; ho spostato l'etichetta $h$ a destra del tratteggio, dove non tocca il lato obliquo. Non l'ho vista sul sito in tema scuro. Non è nel formulario.

## Formulario e flashcard

- Il formulario ha la tabella dei casi, il procedimento in sei passi, l'esempio $(a - 2)x = (a - 2)(a + 2)$, le tre formule inverse della lezione e l'esempio fratto. Tre avvisi: dividere per il parametro, sostituire nella soluzione, dividere solo un pezzo.
- 19 carte, tutte con esempi della lezione. La carta `discussione-ax-uguale-3` usa la forma normale dell'esempio 2; `errore-termine-noto-zero` quella dell'esempio 5.

## Prerequisiti

La riga attuale è `equazioni-letterali <- equazioni-primo-grado`. La cambierei in

`equazioni-letterali <- equazioni-primo-grado, frazioni-algebriche-semplificazione`

perché la discussione non si segue senza scomporre il coefficiente ($a^2 - 1 = (a - 1)(a + 1)$, passo 2) e senza semplificare il quoziente ($\dfrac{(a - 2)(a + 2)}{a - 2} = a + 2$, passo 4), cioè senza la semplificazione delle frazioni algebriche, che a sua volta porta con sé la scomposizione (34-36) attraverso frazioni-algebriche-esistenza. Le equazioni fratte (49) non sono un prerequisito: il cenno finale le linka, ma il resto della lezione non le usa. Se si vuole la lezione raggiungibile prima delle frazioni algebriche, l'alternativa minima è `equazioni-primo-grado, scomposizione-prodotti-notevoli`, e allora l'esempio 4 resta l'unico punto che chiede di semplificare una frazione algebrica.

## Per il generatore

1. Coefficiente numerico, parametro solo nei termini noti, nessuna discussione: $3x - a = x + 5a$, $x = 3a$.
2. Coefficiente monomio nel parametro, un solo caso particolare (impossibile): $a(x - 1) = 3 - a$, cioè $ax = 3$.
3. Coefficiente binomio da raccogliere, termine noto multiplo del coefficiente, caso indeterminato: $(a - 2)x = a^2 - 4$.
4. Coefficiente con due fattori, tre casi (determinata, impossibile, indeterminata): $(a^2 - 1)x = a + 1$.
5. Denominatori numerici e coefficiente con il segno meno: $\dfrac{x}{2} - \dfrac{a}{3} = \dfrac{ax}{6}$, cioè $(3 - a)x = 2a$.
6. Formule inverse: ricavare una lettera data, anche quando moltiplica una somma: $h$ o $B$ da $A = \dfrac{(B + b)h}{2}$, $t$ da $s = s_0 + vt$.
