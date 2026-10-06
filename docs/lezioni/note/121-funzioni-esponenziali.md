# Note: Funzione esponenziale

Lezione nuova del terzo anno, scritta da zero il 5 ottobre 2026 (gruppo E). I conti di lezione, formulario e carte sono stati rifatti con SymPy (`gruppo-e/verifica.py` nella cartella temporanea della sessione): le otto potenze della tabella di $2^{\sqrt{2}}$ e il valore $2{,}6651$, i confronti dell'esempio 2, le basi dell'esempio 3, i punti $A$, $B$, $C$ dell'esempio 4, i tre domini, $1000 \cdot 1{,}02^3 = 1061{,}208$ e $1000 \cdot 1{,}02^{10} \approx 1218{,}99$, $m(12) = 25$ e $m(2) = 100\sqrt{2} \approx 141{,}4$, i cinque valori di $\left(1 + \frac{1}{n}\right)^n$.

## Scelte

- Confine con la 76: la 76 chiude dicendo che $2^{\sqrt{2}}$ si definisce con esponenti razionali sempre più vicini. Qui la definizione è data con la tabella delle approssimazioni per difetto e per eccesso; che il numero esista e sia unico è dichiarato come fatto che si prende per buono.
- Confine con la 122 e la 123: la 121 dà le tre regole (uguaglianza e confronto di potenze con la stessa base) e le usa solo per confrontare numeri e per i passaggi $2^x = 4$ e $2^x \neq 8$ degli esempi 4 e 5. Le equazioni e le disequazioni stanno nelle due lezioni dopo.
- Confine con la 109: le trasformazioni di $y = a^x$ sono una tabella di quattro righe con un solo esempio svolto, e rimandano alla 109 per le regole.
- Confine con la 105: il dominio di $a^{f(x)}$ e di $f(x)^{g(x)}$ sta qui, come dice il brief.
- Confine con la 112: la crescita esponenziale cita la progressione geometrica con un link e non la rispiega.
- Il numero $e$ è presentato con l'interesse composto capitalizzato $n$ volte, con la tabella dei valori e senza la parola "limite"; che i valori si avvicinino a un numero è dichiarato come fatto dimostrato al quinto anno. Nome usato: "numero di Nepero".
- "Asintoto" è definito in una riga, per il solo asintoto orizzontale. La 119 lo introduce per l'iperbole come retta a cui il ramo "corre vicino" e la 120 dice che la curva "si accosta all'asse senza toccarlo": stessa idea informale, parole diverse, nessuna contraddizione.
- Monotonia e immagine $\mathopen{]}0, +\infty\mathclose{[}$ sono enunciate e lette dal grafico, non dimostrate. Per l'immagine la lezione dice che la dimostrazione è del quinto anno.
- Coordinate dei punti con la virgola, $(0, 1)$, come nelle lezioni 80-87 (correzione di chi coordina al brief, che indicava il punto e virgola). Il punto e virgola resta solo nei blocchi `grafico`.
- Intervalli con le quadre rovesciate e la virgola, come nella 88.

## Dubbi per Andrea

- La base $a = 1$: la lezione la esclude dalla definizione di funzione esponenziale. Alcuni libri la ammettono come caso degenere. Va bene escluderla?
- Il nome di $e$: "numero di Nepero" va bene, o preferite "numero di Eulero"?
- $e$ presentato con l'interesse composto: è la strada giusta per il terzo anno, o basta darne il valore e il tasto della calcolatrice?
- Il dominio di $y = f(x)^{g(x)}$: la lezione chiede $f(x) > 0$ e dice in un riquadro che valori isolati come $(-3)^{-2}$ restano fuori. È la convenzione del vostro libro?
- La scrittura $0{,}3^{2}$ senza parentesi attorno alla base decimale: va bene, o preferite $(0{,}3)^2$?
- Gli esempi di crescita (capitale al $2\%$, farmaco che si dimezza ogni $4$ ore): bastano, o serve anche il decadimento radioattivo con il tempo di dimezzamento?
- Notazione dei logaritmi, da confermare per tutto il capitolo: $\log_a x$, $\ln x$ per la base $e$, $\log x$ per la base $10$. La 121 non li usa, ma li nomina con un link alla 124.

## Da verificare

- Confrontato con la 107 definitiva: lì "crescente" senza altro vuol dire in senso stretto, e "in senso lato" è la variante con $\leq$. La 121 usa "crescente" nello stesso senso.
- I blocchi `grafico` sono stati aperti nel browser il 5 ottobre 2026 (fase 3, vedi sotto), a 390 px su Chromium; non su un telefono vero.
- Le figure sono state guardate nelle anteprime PNG in chiaro e in scuro, non sul sito.

## Figure e blocchi

Quattro figure TikZ: `grafico-esponenziale-base-2`, `grafici-esponenziali-base-2-e-un-mezzo`, `grafici-esponenziali-quattro-basi`, `grafico-esponenziale-traslata-in-giu` (dentro l'esempio 4). Le curve sono disegnate con `exp(0.693147*\x)` e `exp(1.098612*\x)`, cioè $2^x$ e $3^x$; i punti segnati hanno coordinate esatte. Due blocchi `grafico`: `esponenziale-base-cursore` (cursore $a$ da $0{,}1$ a $4$) e `esponenziale-traslata-cursori` (cursori $h$ e $k$, con l'asintoto).

## Formulario e flashcard

Formulario con una figura copiata dalla lezione (i due grafici simmetrici) e tre avvisi. 20 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Quattro piani, tutti aperti su `/prova-grafico/lezione` a 390 px, con i cursori ai valori iniziali, agli estremi e nei casi limite, in chiaro e (stato iniziale) in scuro.

- `esponenziali-basi-reciproche-cursore` (nuovo, sezione "Il grafico quando la base è tra 0 e 1", copertina `grafici-esponenziali-base-2-e-un-mezzo`): $a^x$ e $\left(\frac{1}{a}\right)^x$ con il cursore $a$ da $0{,}2$ a $4$ e il valore di $\frac{1}{a}$. Caso limite $a = 1$: le due curve coincidono nella retta $y = 1$, e il testo lo dice.
- `esponenziale-base-cursore` (rivisto, copertina `grafici-esponenziali-quattro-basi`): $a^x$ con $a$ da $0{,}1$ a $4$. Domanda riscritta, e sotto il piano un paragrafo che nomina i tre casi: crescente, costante per $a = 1$, decrescente.
- `esponenziale-traslata-cursori` (rivisto, esempio 4): $2^{x - h} + k$ con l'asintoto e il punto $P(h, 1 + k)$ scritti sotto. Caso limite $k = 0$: l'asintoto è l'asse $x$ e la curva non lo incontra.
- `decadimento-tempo-dimezzamento-cursore` (nuovo, esempio 7, con la figura nuova `decadimento-farmaco-dimezzamento`): $m = 200 \cdot \left(\frac{1}{2}\right)^{\frac{t}{T}}$ con il cursore $T$ da $1$ a $8$, i punti $(T, 100)$ e $(2T, 50)$ e il valore $m(12)$. Il cursore non arriva a $0$, dove la formula non ha senso.

Scartati: un piano per $\left(1 + \frac{1}{n}\right)^n$ (servono punti isolati, che il blocco non disegna); un fattore $k$ davanti a $a^{x - h}$ (la lezione non tratta $k \cdot a^x$, solo $-a^x$); il tempo di raddoppio di $C \cdot a^x$ come valore (è un logaritmo, che arriva nella 124).

## Esercizio guidato (6 ottobre 2026)

È il pilota dell'elemento nuovo, il blocco `guidato` (sintassi in `docs/lezioni/README.md`, come si scrive in `stile.md`). Sta nella sezione "Grafici che si ottengono da quello di aˣ", subito dopo l'esempio 4 e fuori dal suo riquadro.

- Esercizio scelto: $y = \left(\frac{1}{3}\right)^x - 3$, punti sugli assi e grafico. La proposta di chi ha scritto la lezione era l'esempio 4 stesso, $y = 2^x - 4$; per non ripetere parola per parola un esempio che sta poco sopra, l'esempio 4 resta com'è e il guidato fa lo stesso procedimento con numeri diversi e con la base tra $0$ e $1$, che aggiunge le due difficoltà dei riquadri di avviso: la curva scende, e lo zero ha l'esponente negativo.
- Quattro fermate. `cursore`: portare $k$ a $-3$ nel piano di $y = \left(\frac{1}{3}\right)^x + k$ (errori previsti: $k = 3$, il segno; $k = 0$, cursore non mosso). `scegli`: l'immagine, $\mathopen{]}-3, +\infty\mathclose{[}$, perché il correttore non legge gli intervalli (opzioni sbagliate: l'immagine prima dello spostamento, l'intervallo sotto l'asintoto, $\mathbb{R}$). `scrivi`: l'ordinata dell'intersezione con l'asse $y$, $-2$ (errori: $-3$ da $a^0 = 0$; $1$ senza il $-3$; $-\frac{8}{3}$ da $x = 1$). `scrivi`: l'ascissa dello zero, $-1$ (errori: $1$, esponente positivo; $0$; $3$).
- Conti rifatti con SymPy (`guidato/verifica.py` nella cartella temporanea della sessione): $f(0) = -2$, zero in $x = -1$, $f(-2) = 6$, $f(1) = -\frac{8}{3}$, immagine $\mathopen{]}-3, +\infty\mathclose{[}$, funzione decrescente. Il controllo automatico prova con il correttore le due risposte attese e i sei errori previsti delle fermate scritte, e controlla che il cursore arrivi a $-3$.
- Figura nuova in fondo all'esercizio: `grafico-esponenziale-decrescente-traslata-in-giu`, con l'asintoto $y = -3$ e i punti $A(0, -2)$, $B(-1, 0)$, $C(-2, 6)$. È quella che resta in stampa e senza JavaScript, dove il piano della prima fermata non c'è. Piano nuovo dentro la fermata: `esponenziale-decrescente-traslata-cursore` ($k$ da $-6$ a $6$, passo $1$).
- Provato nel browser il 6 ottobre 2026, a 390 px e a 1280 px, in chiaro e in scuro, su Chromium con Playwright e non su un telefono vero.

Da decidere con Alessandro: se l'esempio 4 resta accanto al guidato o se il guidato lo sostituisce; il nome dell'elemento ("Esercizio guidato").

Dubbio per Andrea: nel guidato la base è una frazione, $\frac{1}{3}$, e lo zero si trova scrivendo $3 = \left(\frac{1}{3}\right)^{-1}$. Va bene chiederlo nella 121, o è già un'equazione esponenziale da lasciare alla 122?

Prerequisiti proposti: radicali-esponente-razionale, funzioni-monotone, grafici-trasformazioni
