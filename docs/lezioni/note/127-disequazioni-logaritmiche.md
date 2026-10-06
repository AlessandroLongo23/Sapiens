# Note: Disequazioni logaritmiche

Lezione nuova (lotto del terzo anno, gruppo F, 5 ottobre 2026). Conti rifatti con SymPy (`verifica.py` nella cartella temporanea `gruppo-f`): per ogni esempio l'insieme delle soluzioni è calcolato per via algebrica (condizioni di esistenza più disequazione tra gli argomenti) e poi confrontato, su valori dentro, fuori e agli estremi, con la disequazione logaritmica di partenza valutata numericamente.

## Scelte

- La regola del verso viene dalla crescenza e decrescenza della 125, con una figura a due grafici sulla stessa richiesta $\log_a x > -1$.
- $\log_a f(x) > c$ in una tabella a quattro casi, con la condizione di esistenza scritta solo dove serve ($0 < f(x) < a^c$). Per due logaritmi, il sistema a tre righe; non ho tolto la condizione ridondante ($f > g > 0$ rende inutile $f > 0$), per avere un solo schema.
- Le figure dei sistemi sono "grafici del sistema" nello stile della 53 (righe con linee e pallini, striscia colorata), generate con uno script (`sistema.py` nella cartella temporanea).
- Differenza di logaritmi (esempio 8): invece della disequazione fratta, si porta un logaritmo dall'altra parte. Le fratte con i logaritmi compaiono solo nell'esempio 10, con una tabella dei segni in markdown e non in TikZ.
- Sezione sulle esponenziali, secondo il confine con il gruppo E: $a^{f(x)} > b$ in una tabella, il caso $b \leq 0$, basi diverse con il logaritmo dei due membri (e l'avviso sul dividere per un logaritmo negativo), la sostituzione che finisce in $2 < 2^x < 3$, il capitale che supera il doppio.
- Due blocchi `grafico`: $\log_a x$ contro $y = c$ con la scelta tra $>$ e $<$; $a^x$ contro $y = b$ con la stessa scelta, dove $b$ negativo mostra "sempre vera" e "impossibile".
- L'apertura usa il pH ($-\log x < 7$) solo come esempio di dove nasce una disequazione logaritmica; non la risolve.

## Domande per Andrea

- Nel sistema per $\log_a f(x) > \log_a g(x)$ la lezione scrive sempre tutte e due le condizioni di esistenza. I vostri libri tolgono quella ridondante: preferisci lo schema completo o quello corto?
- Per $\log_a f(x) > c$ la lezione usa la tabella a quattro casi. In alternativa: sempre il sistema con la C.E., anche quando è superflua. Quale dei due modi volete in verifica?
- La tabella dei segni dell'esempio 10 è una tabella di testo, diversa dalle figure della 54 (linee continue e tratteggiate). Va ridisegnata nello stile della 54?
- Mancano le disequazioni con l'incognita nella base e quelle con il valore assoluto del logaritmo: restano fuori dal terzo anno?
- Nell'esempio 12 si dividono i due membri per $\log 2 - \log 3$, negativo, e il verso cambia. Preferisci che si raccolga in modo da avere un coefficiente positivo ($x(\log 3 - \log 2) \leq \log 2$), evitando il cambio di verso?

## Da verificare

- I due blocchi `grafico` passano `check.mts` ma non sono stati aperti nel browser: da controllare che la regione di una disequazione nella sola $x$ ($\log_a x > c$) sia colorata come nella 88, e che per $x \leq 0$ non compaia niente.
- La tabella dentro il riquadro dell'esempio 10: le tabelle dentro `ad-example` esistono già nelle lezioni 42 e 43, ma questa ha sei colonne e va guardata sul telefono.
- Figure guardate in chiaro e in scuro con `anteprima.mjs`, non sul sito.

## Formulario e flashcard

- Formulario senza figure, con le due tabelle del verso e il procedimento. 18 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Tre piani, aperti su `/prova-grafico/lezione` a 390 px ai valori iniziali, agli estremi, nei casi limite e con tutte e due le scelte.

- `disequazione-logaritmica-cursori` (cambiato): aggiunto il punto $P(a^c, \log_a a^c)$ con le coordinate sotto il piano e il paragrafo con le risposte. Con $a = 1$ il plotter colorava la zona $x > 1$ senza nessuna curva: le due formule della scelta sono ora scritte $\log_a x \cdot \log_a a$, che per $a = 1$ non ha valore, e la zona sparisce. È un accorgimento che lo studente non vede (le etichette della scelta sono "$> c$" e "$< c$"), da togliere se il plotter smette di colorare dove la funzione non esiste.
- `disequazione-esponenziale-cursori` (cambiato): aggiunto il valore $\log_a b$ ("non esiste" con $b \leq 0$ e con $a = 1$), la domanda sul verso con $a$ sotto $1$ e il paragrafo con le risposte.
- `disequazione-due-logaritmi-cursore` (nuovo), dopo l'esempio 6, copertina nuova `disequazione-due-logaritmi-curve`: i due membri dell'esempio 5 con il cursore della base. Il punto di incontro resta in $x = 4$; con la base sotto $1$ le soluzioni passano da $\frac{1}{2} < x < 4$ a $x > 4$.

Scartati: un piano per l'argomento di secondo grado (servirebbe colorare due intervalli e insieme mostrare la C.E.: una sola scelta per piano); uno per la sostituzione.

Tabella dei segni dell'esempio 10: a 390 px le intestazioni andavano a capo e l'ultima colonna usciva dallo schermo. Ora le colonne sono intervalli ($\mathopen{]}0, 1\mathclose{[}$, $1$, …), l'ultima riga ha la frazione e $\nexists$ al posto di "non esiste": la tabella sta in 328 px.

Prerequisiti proposti: funzioni-logaritmiche, equazioni-logaritmiche, disequazioni-secondo-grado, disequazioni-esponenziali
