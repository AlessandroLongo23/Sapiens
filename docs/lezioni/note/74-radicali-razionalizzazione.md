# Note: Razionalizzazione

Lezione nuova, scritta da zero (lotto 7). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`radsimp`, `simplify` e confronto numerico a 30 cifre, script in `74-verifica.py` nello scratchpad): i 13 esempi, la somma $\frac{1}{\sqrt{2}} + \sqrt{2} = \frac{3\sqrt{2}}{2}$, i valori della calcolatrice negli avvisi ($\frac{\sqrt{6}}{3} \approx 0{,}816$, $\frac{1}{\sqrt{2} + \sqrt{3}} \approx 0{,}318$ contro $1{,}284$, $\frac{4}{\sqrt{5} - 1} \approx 3{,}236$), $(\sqrt{5} - 1)^2 = 6 - 2\sqrt{5}$, e i due riquadri `ad-note` (tre termini: $\frac{2 + \sqrt{2} - \sqrt{6}}{4}$; radici cubiche: $\sqrt[3]{4} + \sqrt[3]{2} + 1$). Gli esempi con le lettere sono stati controllati con simboli positivi e sostituendo valori razionali.

## Scelte di convenzione

- Lettere positive, come concordato con le note 73, 75 e 76 nello scratchpad: la 74 lo dice una volta in un riquadro `ad-note` all'inizio, con il link alla 72 per le condizioni di esistenza, e ogni esempio con le lettere ripete le condizioni ($x > 0$, $y > 0$). Dove un denominatore letterale potrebbe annullarsi la condizione è scritta ($a \neq b$, $a^2 \neq b$; nell'esempio 13 si ricava da $x > 0$). Da verificare con il libro in uso.
- Termini: "razionalizzare il denominatore", "fattore razionalizzante" (il nome più diffuso nei libri italiani, da verificare con il libro in uso), "coniugato" per il binomio con il segno del secondo termine cambiato (alcuni libri dicono "binomio coniugato"). Nella lezione il coniugato è il fattore razionalizzante del caso con il binomio.
- La formula generale $\frac{b}{\sqrt[n]{a^m}} = \frac{b\sqrt[n]{a^{n-m}}}{a}$ è scritta con $a > 0$ e $0 < m < n$; per $m \geq n$ si rimanda al trasporto fuori dalla radice (73).
- Formule con $\pm$ e $\mp$ per i quattro casi del coniugato, con una frase che spiega $\mp$. Se sembra troppo compatto, si possono scrivere i quattro casi separati.
- Le lettere delle formule del coniugato ($a$, $b$, $c$) sono numeri positivi; in $a \pm \sqrt{b}$ la $a$ negli esempi è sempre un intero positivo.

## Scelte di contenuto

- "Perché si razionalizza" ha tre motivi: forma unica del risultato, riconoscere i radicali simili, il conto a mano. Il terzo è detto come motivo storico, senza fonti; si può togliere.
- Due riquadri `ad-note` che si possono togliere senza toccare il resto: il denominatore con tre termini ($1 + \sqrt{2} + \sqrt{3}$) e il binomio con radici cubiche (con la differenza di cubi, link alla 35). Non sono nel formulario né nelle carte.
- L'avviso "Il segno meno solo sul primo termine" e l'avviso sul quadrato di $2\sqrt{2}$ sono errori di conto più che di razionalizzazione, ma sono quelli che si vedono di più sui coniugati.
- Il riquadro `ad-tip` "A volte si semplifica senza razionalizzare" mostra $\frac{a - b}{\sqrt{a} - \sqrt{b}} = \sqrt{a} + \sqrt{b}$ scomponendo il numeratore: lo cito perché alcuni libri lo propongono come esercizio.

## Lasciato ad altre lezioni

- Condizioni di esistenza e $\sqrt{x^2} = |x|$: 72, con link.
- Prodotto, semplificazione, trasporto fuori, radicali simili: 73, con link (tre volte, sempre alla stessa URL).
- Somma per differenza e quadrato di un binomio: 30, con link; differenza di cubi: 35, solo nel riquadro `ad-note`.
- Proprietà invariantiva delle frazioni: 23, con link.
- Espressioni che mettono insieme razionalizzazione e altre operazioni: 75. La 74 ha solo la somma $\frac{1}{\sqrt{2}} + \sqrt{2}$ per motivare.

## Figure

Nessuna. L'argomento è tutto di calcolo e il brief non chiede figure per la 74; una figura non renderebbe più chiaro nessun passaggio.

## Formulario e flashcard

- Il formulario riprende le quattro formule, un esempio per caso e tre avvisi (moltiplicare solo il denominatore, semplificare dentro e fuori dalla radice, spezzare il denominatore). Niente riquadri `ad-note`.
- 18 carte, tutte con esempi o regole della lezione. Nessuna carta sui casi dei riquadri `ad-note`.

## Da cambiare nelle lezioni già scritte

Niente. La 17 (Equazioni di secondo grado) semplifica i radicali ma non ha mai radicali al denominatore, quindi non razionalizza e non serve un link alla 74.

## Prerequisiti

La riga `radicali-razionalizzazione <- radicali-operazioni` va bene così. La lezione usa il prodotto e la semplificazione dei radicali in ogni esempio e il trasporto fuori (73). Usa anche la somma per differenza (30) in tutta la sezione del coniugato, ma la 30 è già prerequisito diretto della 73 (`radicali-operazioni <- numeri-reali-radici, polinomi-prodotti-notevoli`), quindi è un antenato: un arco diretto `polinomi-prodotti-notevoli` sarebbe ridondante. Se il ripasso dopo una prova guardasse solo i prerequisiti diretti, varrebbe la pena aggiungerlo, perché gli errori sul coniugato sono errori sulla somma per differenza.

## Per il generatore

1. Denominatore $\sqrt{a}$ con numeri: $\frac{b}{\sqrt{a}}$ e $\frac{b}{c\sqrt{a}}$, con risultato da semplificare ($\frac{6}{\sqrt{3}}$, $\frac{5}{2\sqrt{10}}$).
2. Denominatore $\sqrt{a}$ con radicando da semplificare prima ($\frac{3}{\sqrt{12}}$, $\frac{10}{\sqrt{50}}$) e con le lettere positive ($\frac{x}{\sqrt{xy}}$).
3. Denominatore $\sqrt[n]{p^m}$ con $p$ primo, $n$ da 3 a 5 ($\frac{10}{\sqrt[5]{8}}$, $\frac{2}{\sqrt[3]{2}}$).
4. Denominatore $\sqrt[n]{\ldots}$ con due fattori primi o con le lettere ($\frac{6}{\sqrt[3]{12}}$, $\frac{a}{\sqrt[4]{a^3b}}$).
5. Coniugato con $a \pm \sqrt{b}$ e $\sqrt{a} \pm \sqrt{b}$, denominatore positivo, numeratore numerico ($\frac{4}{\sqrt{5} - 1}$, $\frac{2}{\sqrt{7} + \sqrt{5}}$).
6. Coniugato con i casi scomodi: coefficiente davanti al radicale ($3 - 2\sqrt{2}$), denominatore che diventa negativo ($\frac{3}{2 - \sqrt{7}}$), radicale anche al numeratore ($\frac{\sqrt{3} + 1}{\sqrt{3} - 1}$).
7. Coniugato con le lettere positive ($\frac{x}{\sqrt{x + 1} - 1}$, $\frac{a - b}{\sqrt{a} - \sqrt{b}}$).

Per i livelli 5-7 conviene generare le frazioni partendo dal risultato, così che $a - b$ o $a^2 - b$ divida il numeratore e il risultato venga pulito.
