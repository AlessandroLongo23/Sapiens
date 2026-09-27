# Note: Operazioni con i radicali

Lezione nuova, scritta da zero (lotto 7). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (script `73-verifica.py` nello scratchpad: `simplify`, `expand`, `radsimp`, `real_root` per le radici cubiche di numeri negativi, lettere dichiarate `positive=True`): i prodotti e quozienti delle prime sezioni, i 17 esempi, gli avvisi ($\sqrt{2} \cdot \sqrt[3]{2}$ contro $\sqrt[6]{4}$ e $\sqrt[5]{4}$ anche in valore numerico, $-2\sqrt{3} = -\sqrt{12}$, $-2\sqrt[3]{3} = \sqrt[3]{-24}$, $\left(2\sqrt{3}\right)^2 = 12$, $3\sqrt{2} + \sqrt{2} = 4\sqrt{2}$), il confronto $2\sqrt{3} < 3\sqrt{2}$ e le risposte di tutte le carte. La larghezza delle formule in evidenza è stata misurata con KaTeX in Chromium a 17 px: dentro i riquadri la più larga è 238 px, fuori 262 px (la formula $3\sqrt{2} + 5\sqrt{2} = (3 + 5)\sqrt{2} = 8\sqrt{2}$, nel testo e non in un riquadro).

## Scelte di convenzione

- Lettere positive. La lezione lo dice una volta, all'inizio, con il link alla 72 per le condizioni di esistenza, e un riquadro `ad-note` nel trasporto fuori mostra il caso generale ($\sqrt{4x^2} = 2|x|$, $\sqrt{a^2b} = |a|\sqrt{b}$, $\sqrt{a^3} = a\sqrt{a}$ senza valore assoluto perché la C.E. dà $a \geq 0$). È la scelta di 74, 75 e 76; la 72 ha scelto le C.E. con i valori assoluti, che però sono il suo argomento. Il punto 5 della nota di convenzioni della 72 ("quando un esercizio vuole evitare i valori assoluti, lo dichiara nel testo") è rispettato, perché la 73 dichiara l'ipotesi. Da verificare con il libro in uso: molti libri del biennio fanno le operazioni con le C.E. e i valori assoluti anche qui.
- "Trasporto fuori dal segno di radice" e "trasporto dentro il segno di radice" come termini definiti; nel testo anche "portare fuori" e "portare dentro". Non uso "semplificare" per il trasporto fuori, perché nella 72 "semplificare un radicale" vuol dire dividere indice ed esponenti per un divisore comune. Il risultato con il radicando più piccolo si ottiene "portando fuori" e la lezione dice "ridurre il risultato". Il brief del lotto dice "si semplifica sempre il risultato ($2\sqrt{3}$, non $\sqrt{12}$)", e molti libri chiamano così anche il trasporto: se si preferisce, si cambiano due frasi.
- Il quoziente si scrive sia con $:$ sia con la frazione, come nei libri; la regola è enunciata con $:$.
- mcm degli indici in minuscolo, come nella 72.
- Il trasporto fuori è spiegato con la divisione dell'esponente per l'indice (quoziente fuori, resto dentro), che è il metodo dei libri; l'alternativa "scrivi il radicando come prodotto di potenze con esponente multiplo dell'indice" è implicita negli esempi 3 e 4.
- Il segno meno col trasporto dentro è in un avviso, con l'indice dispari come eccezione.
- L'ordine delle operazioni nelle espressioni è detto in una frase all'inizio degli "Esempi svolti"; le espressioni lunghe sono nella 75.

## Lasciato ad altre lezioni

- Definizione, C.E., $\sqrt{x^2} = |x|$, proprietà invariantiva, semplificazione, riduzione allo stesso indice, confronto: 72, con link. Il confronto torna qui solo per i radicali con il coefficiente (trasporto dentro), come la 72 annuncia alla riga 305.
- Razionalizzazione: 74, con link nella somma per differenza e in fondo. Nessun esempio della 73 lascia un radicale al denominatore.
- Espressioni lunghe, equazioni con coefficienti irrazionali, radicali doppi: 75.
- Esponenti razionali: 76, non citati.
- Prodotti notevoli: 30, con link; il cubo di un binomio compare solo nell'esempio 17, con la formula richiamata.

## Figure

Nessuna. L'argomento è di calcolo e il brief non ne chiede; la figura del quadrato di un binomio della 30 non aggiunge niente con i radicali.

## Formulario e flashcard

- Il formulario ripete la frase sulle lettere positive e la riga sul valore assoluto; tre avvisi (radice di una somma, indici diversi, doppio prodotto).
- 20 carte, nell'ordine della lezione. La carta `somma-dopo-trasporto` usa $\sqrt{12} + \sqrt{27}$, che non è un esempio della lezione ma usa $\sqrt{12} = 2\sqrt{3}$ e $\sqrt{27} = 3\sqrt{3}$, che ci sono.

## Prerequisiti

La riga `radicali-operazioni <- numeri-reali-radici, polinomi-prodotti-notevoli` va bene così. La lezione usa la riduzione allo stesso indice e la proprietà invariantiva della 72 in tutta la parte con indici diversi, e i prodotti notevoli della 30 nell'ultima sezione e negli esempi 10, 11, 14 e 17. Il valore assoluto (20) è solo nel riquadro `ad-note` e arriva comunque attraverso la 72. Le potenze e i monomi arrivano attraverso la 30.

Per la 17 propongo `equazioni-secondo-grado <- equazioni-primo-grado, scomposizione-raccoglimento, radicali-operazioni`, al posto di `numeri-reali-radici`. Quello che la 17 usa dei radicali è il trasporto fuori ($\sqrt{8} = 2\sqrt{2}$, $\sqrt{72} = 6\sqrt{2}$, $\sqrt{12} = 2\sqrt{3}$, $\sqrt{24} = 2\sqrt{6}$) e la divisione di $8 \pm 6\sqrt{2}$ per $2$, che sono in questa lezione; la definizione di radice quadrata arriva comunque attraverso la 73. Nessun ciclo: `radicali-operazioni` non discende da `scomposizione-raccoglimento` né da `equazioni-primo-grado`, quindi nessun arco diventa ridondante (non ho lanciato `prerequisiti.mts`, perché non devo toccare `prerequisiti.md`).

## Da cambiare nelle lezioni già scritte

17 (Equazioni di secondo grado), secondo paragrafo. Oggi:

> e la semplificazione dei radicali, che trovi in [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta).

Il link porta alla lezione sbagliata: nella 72 "semplificare" vuol dire dividere indice ed esponenti, mentre il $\sqrt{12} = 2\sqrt{3}$ della 17 è il trasporto fuori della 73. Proposta:

> e il trasporto di un fattore fuori dalla radice, come $\sqrt{12} = 2\sqrt{3}$, che trovi in [Operazioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali).

Nella sezione "Quando il discriminante non è un quadrato perfetto", passo 1, si può aggiungere lo stesso link: "semplifica $\sqrt{\Delta}$ portando fuori dalla radice i fattori quadrati (lo trovi in [Operazioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali)), per esempio ...". La 17 usa "semplificare il radicale" nel senso largo (esempio 3, esempio 12, il passo 1): lo lascerei, perché è l'uso comune nei libri, ma è l'incoerenza di termini da decidere insieme alla scelta sopra.

## Per il generatore

1. Prodotto e quoziente con lo stesso indice, con e senza coefficienti, risultato intero o radicale già ridotto: $\sqrt{3} \cdot \sqrt{12} = 6$, $6\sqrt{10} : 2\sqrt{5} = 3\sqrt{2}$, $\sqrt[3]{2} \cdot \sqrt[3]{4} = 2$.
2. Trasporto fuori con radicandi numerici, indice 2 e 3: $\sqrt{72} = 6\sqrt{2}$, $5\sqrt{20} = 10\sqrt{5}$, $\sqrt[3]{54} = 3\sqrt[3]{2}$.
3. Trasporto fuori con le lettere (positive), monomi con esponenti maggiori dell'indice: $\sqrt{a^5b^2} = a^2b\sqrt{a}$, $\sqrt[3]{16x^7} = 2x^2\sqrt[3]{2x}$.
4. Trasporto dentro e confronto di radicali con il coefficiente, compreso il segno meno: $2\sqrt{3}$ contro $3\sqrt{2}$, $-2\sqrt{3} = -\sqrt{12}$.
5. Indici diversi, potenza e radice di un radicale: $\sqrt{2} \cdot \sqrt[3]{2} = \sqrt[6]{32}$, $\sqrt[4]{a^3} : \sqrt{a} = \sqrt[4]{a}$, $\left(\sqrt[3]{2}\right)^4 = 2\sqrt[3]{2}$, $\sqrt{2\sqrt{2}} = \sqrt[4]{8}$.
6. Somma algebrica di radicali che diventano simili dopo il trasporto fuori, anche con due gruppi: $\sqrt{50} - \sqrt{18} + \sqrt{8} = 4\sqrt{2}$, $\sqrt{12} + \sqrt{20} - \sqrt{27} = -\sqrt{3} + 2\sqrt{5}$.
7. Prodotti notevoli e prodotti di binomi con radicali: $\left(\sqrt{5} - \sqrt{3}\right)^2 = 8 - 2\sqrt{15}$, $\left(\sqrt{2} + 3\right)\left(\sqrt{2} - 1\right) = -1 + 2\sqrt{2}$, $\left(\sqrt{3} - \sqrt{2}\right)^2 + 2\sqrt{6} = 5$.

Il controllo del generatore deve pretendere il risultato ridotto (radicando senza fattori con esponente $\geq$ indice, radicali simili sommati) e trattare come sbagliate le forme degli avvisi: $\sqrt{5}$ per $\sqrt{2} + \sqrt{3}$, $5 - 3$ per il quadrato di una differenza, $\sqrt{12}$ per $-2\sqrt{3}$. Nelle risposte a scelta sono buoni distrattori.
