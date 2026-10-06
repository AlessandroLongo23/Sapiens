# Note: Logaritmi e loro proprietà

Lezione nuova (lotto del terzo anno, gruppo F, 5 ottobre 2026). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`verifica.py` nella cartella temporanea `gruppo-f`, 150 controlli per le quattro lezioni del gruppo): i logaritmi delle tabelle e degli esempi, le verifiche con le potenze, gli sviluppi degli esempi 4 e 5 in forma simbolica, i valori approssimati ($\log 2$, $\log 3$, $\log 5$, $\log 6$, $\log 72$, $\ln 2$, $\ln 5$, $\log_2 5$, $\log \frac{5}{2}$) e le somme fatte con i valori arrotondati.

## Scelte

- Confine con la 121: la 124 non ridefinisce le potenze con esponente reale né il numero $e$; per l'esistenza e l'unicità dell'esponente rimanda alla 121, che dice che $a^x$ assume ogni valore positivo una volta sola (e che la dimostrazione è del quinto anno).
- Confine con la 125: qui solo il calcolo. Segno del logaritmo, confronto tra logaritmi, dominio e grafico di $\log_a x$ sono nella 125. La sola figura è il grafico di $2^x$ con le rette $y = 5$ e $y = 8$, per far vedere il logaritmo come ascissa.
- Confine con la 126: "trovare l'argomento o la base" (esempio 3) resta qui, perché è la definizione letta in un altro verso; le equazioni con l'incognita nell'argomento stanno nella 126.
- Notazione: $\log_a b$, $\log x$ per la base $10$, $\ln x$ per la base $e$, come chiede il brief. Un riquadro `ad-note` avverte delle altre scritture ($\text{Log}$, $\log$ per il naturale).
- Le tre proprietà sono dimostrate, con le posizioni $x = \log_a b$ e $y = \log_a c$; anche il cambiamento di base è dimostrato. La proprietà della potenza è enunciata per ogni esponente reale, perché la 121 dà le proprietà delle potenze con esponente reale.
- Radice, reciproco, $\log_a b = \frac{1}{\log_b a}$ e $\log_{a^n} b = \frac{1}{n}\log_a b$ sono presentati come conseguenze, non come proprietà da imparare a parte.
- $\log_a x^2 = 2\log_a |x|$ è in un `ad-warning`: serve nella 125 (dominio) e nella 126 (soluzioni perse).
- Un blocco `grafico`: $y = a^x$ e $y = b$ con i due cursori e il valore $\log_a b$ sotto il piano. Con $a = 1$ la curva diventa la retta $y = 1$ e il valore "non esiste": è la domanda del blocco.

## Domande per Andrea

- $\log x$ per la base $10$ e $\ln x$ per la base $e$: è la convenzione dei vostri libri? L'alternativa più comune è $\text{Log}\, x$ per il decimale e $\log x$ o $\ln x$ per il naturale.
- La proprietà della potenza è data per esponente reale qualunque. Va bene, o preferisci enunciarla per esponente razionale e dire che si estende?
- Serve una sezione sul passaggio inverso, "antilogaritmo" o cologaritmo? Non l'ho messa: nei libri di oggi quasi non compare.
- Negli esempi 4 e 5 le ipotesi $x > 0$ e $y > 0$ sono scritte nel testo. Preferisci che lo studente le ricavi come condizioni di esistenza?

## Convenzione delle coordinate

Coordinate dei punti con la virgola, $(1, 0)$, come nelle lezioni 80-87 pubblicate (correzione del coordinatore al brief, 5 ottobre 2026). Il punto e virgola resta solo dentro i blocchi `grafico`, dove è la sintassi del plotter.

## Da verificare

- Il blocco `grafico` passa `check.mts`, ma non l'ho visto nel browser (`/prova-grafico/lezione`): da guardare il comportamento a $a = 1$ e l'etichetta del valore $\log_a b$.
- La figura è stata guardata in chiaro e in scuro con `anteprima.mjs`, non sul sito.
- La frase iniziale di "Che cos'è un logaritmo" si appoggia a quello che dice la 121 (riga "Che i valori positivi siano presi tutti…"): se la 121 cambia, va riletta.

## Formulario e flashcard

- Formulario senza figure: definizione, quattro uguaglianze, procedimento, tabella delle proprietà con un esempio per riga, cambiamento di base, tre avvisi.
- 20 carte. Gli esempi numerici delle carte che non sono nella lezione ($\log_2 32$, $\log_3 81$, $\log_7 7$) applicano la definizione e sono nel controllo SymPy.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Due piani, aperti su `/prova-grafico/lezione` a 390 px con i cursori ai valori iniziali, agli estremi e nei casi limite.

- `logaritmo-come-esponente-cursori` (cambiato), sezione "Che cos'è un logaritmo", copertina `logaritmo-come-esponente-grafico`: $y = a^x$, la retta $y = b$, il punto $P$ e il valore $\log_a b$. Il cursore $b$ ora scende fino a $-2$: con $b \leq 0$ il punto sparisce e il valore dice "non esiste"; con $a = 1$ la curva è la retta $y = 1$. Il paragrafo dopo il piano dà le tre risposte, che sono le tre condizioni della definizione.
- `logaritmo-prodotto-cursore` (nuovo), sezione "Logaritmo di un prodotto", copertina nuova `logaritmo-prodotto-curva-alzata`: $y = \log_2 (kx)$ e $y = \log_2 x$ tratteggiata, con il valore $\log_2 k$. Mostra la proprietà del prodotto come spostamento verticale; $k = 1$ è il caso in cui le curve coincidono.

Scartati: un piano per il cambiamento di base ($\frac{\log_c x}{\log_c a}$ con il cursore $c$: la curva non si muove, e un piano in cui non succede niente non insegna); uno per la proprietà della potenza ($\log_2 x^n$), che con $n$ pari cambierebbe dominio e aprirebbe il discorso di $|x|$ in mezzo alla sezione.

Prerequisiti proposti: funzioni-esponenziali, radicali-esponente-razionale
