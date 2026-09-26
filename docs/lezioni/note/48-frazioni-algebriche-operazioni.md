# Note: Operazioni con le frazioni algebriche

Lezione nuova, scritta da zero (lotto 4). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`simplify` della differenza tra espressione e risultato, `expand` e `factor` per i passaggi intermedi): i dieci esempi, le formule delle potenze, il controesempio $\dfrac{1}{x} + \dfrac{1}{y} \neq \dfrac{2}{x + y}$, il controllo numerico con $x = 3$ e le carte con un conto. Le formule in evidenza sono state rese con KaTeX e misurate: la più larga dentro un riquadro è 229 px (limite usato 280), fuori dai riquadri 201 px.

## Scelte di convenzione

- C.E. scritte come nel brief di lotto, una condizione per volta: "C.E.: $x \neq 3$, $x \neq -3$", senza $x \neq \pm 3$. Se la lezione 46 usa $\pm$, conviene allinearsi a quella.
- Forma del risultato: denominatore lasciato scomposto, numeratore ridotto (sviluppato) salvo quando è un prodotto già pronto ($\dfrac{3(x - 1)}{(x - 3)(x + 3)}$, $\dfrac{2x(x - 2)}{x + 2}$). Molti libri lasciano il numeratore sviluppato; la lezione lo dice solo per il denominatore. Da verificare con il libro in uso, e conviene che il generatore accetti tutte e due le forme del numeratore.
- Le C.E. si riscrivono accanto al risultato ("Con C.E. $x \neq 1$, $x \neq -1$"), anche quando il risultato è un numero (esempi 1 e 8). È la scelta dei libri più diffusi; alcuni scrivono solo le C.E. iniziali.
- Fattori opposti: si porta il segno meno davanti alla frazione ($\dfrac{2}{3 - x} = -\dfrac{2}{x - 3}$) prima del MCM, e si sceglie il fattore con il primo termine positivo, come nella lezione 38. Nell'esempio 6 invece i fattori opposti $x - 1$ e $1 - x$ si semplificano dando $-1$, perché compaiono uno al numeratore e uno al denominatore.
- Potenza con esponente negativo: inclusa, con la C.E. sul numeratore, perché la lezione 09 (Potenze in ℚ) tratta gli esponenti negativi. Si può togliere (un paragrafo, una carta, una riga del formulario) se al primo anno la si considera un di più.
- Una sola lettera ($x$) in quasi tutti gli esempi; due lettere solo nel paragrafo dopo l'esempio 4 ($\dfrac{x}{x - y} + \dfrac{y}{y - x} = 1$) e nell'avviso sui denominatori sommati.

## Lasciato ad altre lezioni

- Condizioni di esistenza e legge di annullamento del prodotto: link alla 46, qui solo "ogni fattore di ogni denominatore diverso da zero".
- Semplificazione e riduzione allo stesso denominatore: link alla 47. La 48 riprende il procedimento del denominatore comune in sei passi perché è il cuore della somma; se la 47 lo scrive già per intero, il passo 4 ("dividi il MCM per il denominatore e moltiplica per il numeratore") è un doppione accettabile, ma si può accorciare in un rimando.
- Calcolo del MCM di polinomi: link alla 38.
- Regole delle frazioni numeriche (reciproco, semplificazione in croce, ordine delle operazioni): link alle lezioni 24, 09 e 25.
- Le equazioni fratte (49) non sono citate: la lezione non ne ha bisogno.

## Da togliere o controllare in lezioni già scritte

- Lezione 38 (MCD e MCM di polinomi), apertura: "Il MCM di polinomi ti servirà come denominatore comune quando sommerai le frazioni con i polinomi al denominatore" potrebbe diventare un link a questa lezione, ora che esiste.
- Nessuna lezione pubblicata tratta le operazioni con le frazioni algebriche: niente da togliere.

## Figure

Nessuna. La lezione è di calcolo e il testo non si riferisce a diagrammi.

## Formulario e flashcard

- Il formulario ha i procedimenti (somma in sei passi, espressioni in quattro), le cinque regole con le C.E. e tre avvisi. Non ha esempi svolti, solo le righe di esempio delle potenze e di $1 - \dfrac{2}{x + 1}$.
- 19 carte. La carta `quoziente-ce-esempio` usa $\dfrac{x + 1}{x + 2} : \dfrac{x - 1}{x}$, che non è nella lezione (l'esempio 7 parte da una frazione non ancora semplificata); la regola sì.

## Prerequisiti

La riga `frazioni-algebriche-operazioni <- frazioni-algebriche-semplificazione, polinomi-mcd-mcm` va bene così. La somma si regge sul MCM di polinomi (38), tutto il resto sulla semplificazione (47), che porta con sé le C.E. (46) e le scomposizioni. Le regole delle frazioni numeriche (24, 25, 09) sono antenati lontani, già raggiunti attraverso le lezioni sui monomi e i polinomi: aggiungerle sarebbe un arco ridondante.

## Per il generatore

1. Somma algebrica con lo stesso denominatore, anche con il meno davanti alla frazione e un risultato che si semplifica: $\dfrac{3x + 1}{x - 2} - \dfrac{x + 5}{x - 2} = 2$.
2. Somma di due frazioni con denominatori di primo grado primi tra loro: $\dfrac{1}{x - 3} + \dfrac{2}{x + 3} = \dfrac{3(x - 1)}{(x - 3)(x + 3)}$.
3. Somma con denominatori da scomporre, anche con fattori opposti e semplificazione finale: $\dfrac{x + 9}{x^2 - 9} + \dfrac{2}{3 - x} = -\dfrac{1}{x + 3}$.
4. Prodotto con scomposizione e semplificazione in croce: $\dfrac{x^2 - 4}{3x} \cdot \dfrac{6x^2}{x^2 + 4x + 4} = \dfrac{2x(x - 2)}{x + 2}$.
5. Quoziente, con le C.E. da indicare compresa quella del numeratore del divisore: $\dfrac{x^2 - 1}{x^2 + 2x} : \dfrac{x - 1}{x} = \dfrac{x + 1}{x + 2}$, C.E. $x \neq 0$, $x \neq -2$, $x \neq 1$.
6. Espressione con una parentesi (somma) e una divisione: $\left(\dfrac{x + 1}{x - 1} - \dfrac{x - 1}{x + 1}\right) : \dfrac{2x}{x^2 - 2x + 1} = \dfrac{2(x - 1)}{x + 1}$.
7. Espressione con potenza, quoziente e somma finale con fattori opposti, come l'esempio 10.

Per i livelli 5-7 il generatore potrebbe chiedere a parte le C.E. (a scelta multipla), perché l'errore tipico è sul numeratore del divisore, e il risultato semplificato da solo non lo mostra.
