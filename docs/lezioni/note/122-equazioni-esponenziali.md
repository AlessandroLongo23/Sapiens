# Note: Equazioni esponenziali

Lezione nuova del terzo anno, scritta da zero il 5 ottobre 2026 (gruppo E). Le dodici equazioni degli esempi, le verifiche scritte nel testo, le equazioni in $t$ e l'equazione grafica $2^x = 3 - x$ sono state rifatte con SymPy (`gruppo-e/verifica.py` nella cartella temporanea della sessione).

## Scelte

- Confine con la 121: la regola $a^{x_1} = a^{x_2} \iff x_1 = x_2$ viene dalla 121 e qui è ripresa in una frase.
- Confine con il gruppo F: la lezione risolve tutto quello che si riconduce alla stessa base o a una sostituzione $t = a^x$. Le equazioni che chiedono un logaritmo sono nominate in tre punti (l'elementare $2^x = 5$, la sostituzione che porta a $t = 3$, le basi diverse con esponenti diversi come $2^{x + 1} = 3^x$), con il link alla 124 e alla 126. Per $2^x = 5$ la lezione dice solo che la soluzione esiste, è unica e sta tra $2$ e $3$.
- Ordine dei metodi: elementare, stessa base, raccoglimento, sostituzione, basi diverse con lo stesso esponente, poi i due casi fuori metodo (logaritmo, grafico) e una tabella "quale metodo".
- La risoluzione grafica ($2^x = 3 - x$) ha una sezione breve con figura e blocco: l'unicità è giustificata con una funzione crescente e una decrescente.
- Ogni esempio ha la verifica per sostituzione, scritta.
- Insieme delle soluzioni $S = \{1, 2\}$ con la virgola, come nelle lezioni 90 e 91.
- Coordinate dei punti con la virgola, come nelle lezioni 80-87 (correzione di chi coordina al brief).

## Dubbi per Andrea

- "Equazione esponenziale elementare" per $a^x = b$: è il nome del vostro libro?
- La sostituzione usa sempre la lettera $t$, come nella 90. Va bene, o nel capitolo si usa $y$ o $z$?
- La condizione $t > 0$ è scritta al momento della sostituzione e i valori negativi sono scartati dopo. Preferite che il valore negativo sia scartato risolvendo $3^x = -1$ come equazione impossibile, senza la condizione iniziale?
- La risoluzione grafica di $2^x = 3 - x$ sta bene in questa lezione, o va lasciata a un'altra?
- Le equazioni con i radicali a esponente, come $\sqrt{2^x} = 4$ o $\sqrt[x]{8} = 2$, non ci sono. Servono?
- La lezione non parla di equazioni indeterminate (come $2^{x + 1} = 2 \cdot 2^x$, vera per ogni $x$). Serve un esempio?

## Da verificare

- Allineato con la 126 definitiva (5 ottobre 2026): la sezione "Quando serve un logaritmo" usa $4^x - 5 \cdot 2^x + 6 = 0$, la stessa equazione che la 126 risolve nella sezione "Equazioni esponenziali che si risolvono con i logaritmi" ($S = \{1, \log_2 3\}$), insieme a $2^x = 5$. La 126 risolve anche $2^{x + 1} = 3^x$ (esempio 12), che la 122 cita con la stessa scrittura.
- I blocchi `grafico` sono stati aperti nel browser il 5 ottobre 2026 (fase 3, vedi sotto), a 390 px su Chromium; non su un telefono vero.
- Le figure sono state guardate nelle anteprime PNG in chiaro e in scuro, non sul sito.

## Figure e blocchi

Due figure TikZ: `equazione-esponenziale-elementare` (le rette $y = 8$, $y = 5$, $y = -1$; il punto su $y = 5$ ha ascissa $2{,}3219$, cioè il numero per cui $2^x = 5$) e `equazione-esponenziale-grafica` (il punto $P(1, 2)$). Due blocchi `grafico`: `equazione-esponenziale-elementare-cursori` (cursori $a$ e $b$) e `equazione-esponenziale-grafica-cursore` (cursore $q$ della retta $y = q - x$).

## Formulario e flashcard

Formulario senza figure, con la tabella dei metodi e tre avvisi. 19 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Tre piani, tutti aperti su `/prova-grafico/lezione` a 390 px, con i cursori ai valori iniziali, agli estremi e nei casi limite.

- `equazione-esponenziale-elementare-cursori` (rivisto): sotto il piano ora c'è la soluzione $x$, che diventa "non esiste" per $b \leq 0$ e per $a = 1$. Il valore è calcolato dal plotter con $\frac{\ln b}{\ln a}$, ma lo studente vede solo "$x = \dots$". Il testo dopo il piano dà le risposte e nomina il caso $a = 1$. Il cursore $a$ parte da $0{,}2$ e $b$ ha passo $0{,}5$, per fermarsi sui numeri della lezione.
- `equazione-esponenziale-sostituzione-cursore` (nuovo, dopo l'esempio 10, con la figura nuova `equazione-esponenziale-sostituzione-grafico`): $y = 4^x - 6 \cdot 2^x + c$ con il cursore $c$ da $-6$ a $12$ e i due valori di $t$ scritti sotto. Mostra quando un valore di $t$ va scartato ($c \leq 0$), il caso limite $c = 9$ (un solo valore, curva tangente all'asse) e $c > 9$ (nessuna soluzione); il testo ha la tabella dei quattro casi.
- `equazione-esponenziale-grafica-cursore` (rivisto): domanda con una risposta precisa ($q = 6$ per la soluzione $x = 2$) e un paragrafo che la dà.

Scartati: un piano per il raccoglimento e uno per le basi diverse con lo stesso esponente, dove non c'è un parametro che cambia l'esito.

Prerequisiti proposti: funzioni-esponenziali, radicali-esponente-razionale, equazioni-secondo-grado, equazioni-binomie-trinomie
