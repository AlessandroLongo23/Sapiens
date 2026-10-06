# Note: Regressione e correlazione

Lezione nuova, scritta da zero (lotto del terzo anno, gruppo G). Tutti i conti di lezione, formulario e carte sono stati rifatti con Python (frazioni esatte e SymPy, script `verifica.py` nella cartella temporanea del gruppo): medie, scarti, prodotti, quadrati, covarianze, varianze, $m$, $q$, $r$, valori stimati, residui e somme dei loro quadrati per tutti gli insiemi di dati; l'identità $\frac{1}{n}(e_1^2 + \dots + e_n^2) = \sigma_x^2 m^2 - 2\sigma_{xy} m + \sigma_y^2$ per una retta per il baricentro, il valore minimo $\sigma_y^2(1 - r^2)$ e la formula della covarianza con la media dei prodotti (verificate in forma simbolica con $n = 6$); il polinomio del blocco `grafico`, che è la somma dei quadrati dei residui dei cinque punti e ha il minimo $6$ in $m = 0{,}5$, $q = 3{,}5$. Le figure sono generate dallo stesso script dei dati (`gen.py`): i punti sono quelli delle tabelle e le rette quelle calcolate.

## Scelte

- Confine con la 128: qui solo dati in coppie $(x_i, y_i)$, senza tabelle a doppia entrata con frequenze. La covarianza da una tabella di correlazione (con le frequenze congiunte come pesi) non c'è.
- Varianza, covarianza e scarto quadratico medio dividono per $n$, come nella 57. Simboli: $\sigma_{xy}$, $\sigma_x^2$, $\sigma_y^2$, $\sigma_x$, $\sigma_y$, $r$; retta $y = mx + q$ come nella 81.
- Niente sommatoria: non compare nel biennio né, al momento, nelle lezioni 110-112. La covarianza è scritta come media dei prodotti $p_i = (x_i - \bar{x})(y_i - \bar{y})$, su due righe, per stare nella larghezza del telefono. Negli esempi 1 e 2 gli scarti hanno le lettere $a_i$ e $b_i$ solo per avere tabelle strette.
- Esempio guida per tutta la teoria: cinque studenti, ore di studio $1, 3, 5, 7, 9$ e voti $4, 5, 7, 5, 9$. Ha un prodotto negativo (D), un punto con scarto zero (C), retta $y = 0{,}5x + 3{,}5$ con valori stimati interi e residui $0, 0, 1, -2, 1$.
- Dimostrazioni. La formula con la media dei prodotti è dimostrata (riquadro `ad-note`). Per la retta dei minimi quadrati: che esista, sia unica e passi per il baricentro è enunciato; dato questo, la formula di $m$ è ricavata come vertice di una parabola (lezione 87), in un riquadro `ad-note`. Che $-1 \leq r \leq 1$ è ricavato dal valore minimo della media dei quadrati dei residui, in un altro `ad-note`. I due riquadri si possono togliere senza altre conseguenze.
- Tre blocchi `grafico` (elenco nella sezione "I piani con i cursori").
- Nessuna soglia per "correlazione forte" o "debole": i libri danno soglie diverse, e la lezione dice solo "più $r$ è vicino a $1$ o a $-1$". Negli esempi non uso più gli aggettivi, tranne "abbastanza stretto" per $r \approx 0{,}79$.
- $r$ arrotondato al centesimo con $\approx$.
- Per stare sotto i 30.000 caratteri ho tolto una figura con tre nuvole (crescente, decrescente, nessuna direzione) dalla sezione sul diagramma a dispersione: le stesse forme si vedono nella galleria di sei nuvole con il loro $r$. Ho tolto anche un riquadro sulla retta di regressione di $X$ rispetto a $Y$ (vedi la domanda 1).
- Coordinate e coppie con la virgola, $G(5, 6)$, dopo la correzione al brief; non ci sono coordinate con la virgola decimale nel testo. Nella figura dell'esempio 2 il punto fuori dai dati ha solo l'etichetta dell'ordinata, $-2{,}2$.

## I piani con i cursori (fase 3, 5 ottobre 2026)

1. `retta-minimi-quadrati-cursori` (c'era già), sezione "La retta di regressione", dopo la figura della retta con i residui. I cinque punti, la retta $y = mx + q$ con i cursori $m$ e $q$, e $S$, la somma dei quadrati dei residui. Domanda: partendo da $y = 6$, per quali valori $S$ è la più piccola? Il testo dopo la tabella dei residui ora dà la risposta ($S$ da $16$ a $6$, solo per $m = 0{,}5$ e $q = 3{,}5$).
2. `correlazione-dispersione-attorno-alla-retta-cursore` (nuovo), sezione su $r$, dopo la galleria delle sei nuvole, che fa da copertina. Il cursore $d$ allontana C, D ed E dalla retta con residui $d$, $-2d$, $d$: la retta di regressione resta $y = 0{,}5x + 3{,}5$ per ogni $d$ (i residui hanno somma zero e covarianza zero con $x$), e $r = 5 / \sqrt{25 + 15d^2}$. Caso limite $d = 0$: punti allineati, $r = 1$. Con $d = 1$ sono i dati della lezione. La lettera non è $t$ perché il blocco la riserva alle curve parametriche.
3. `punto-anomalo-retta-e-correlazione-cursore` (nuovo), stessa sezione, dopo una figura di copertina nuova (`punto-anomalo-retta-regressione-orizzontale`: E scende da $9$ a $4$ e la retta diventa $y = 5$). Il cursore $k$ è il voto di E; la retta è $y = \frac{k - 4}{10}x + \frac{62 - 3k}{10}$, con $m$ e $r = (k - 4) / \sqrt{2k^2 - 21k + 67}$ scritti sotto. Caso limite $k = 4$: retta orizzontale e $r = 0$; sotto il $4$ il segno di $r$ si capovolge.

Le formule dei due piani nuovi sono verificate in forma simbolica con SymPy (`verifica.py`), e i piani sono stati aperti a 390 px, in chiaro e in scuro, con i cursori ai valori iniziali, agli estremi e nei casi limite: i valori letti sotto il piano coincidono con quelli calcolati. Sotto il piano i valori arrotondati sono scritti con $=$ (per esempio $r = 0{,}79$), come fa il blocco; nel testo della lezione hanno $\approx$.

Scartati: la retta vincolata a passare per $G$ con il solo cursore $m$ (ripete il primo piano con un grado di libertà in meno, e starebbe dentro un riquadro `ad-note` che si può saltare); un piano nell'esempio 2 con l'età dell'auto come cursore (è una lettura su una curva ferma, e la figura con il prolungamento tratteggiato dice già tutto); un piano nell'esempio 4 (i punti stanno su una parabola, ma muoverla non insegna niente su $r$).

## Domande per Andrea

1. La seconda retta di regressione ($X$ rispetto a $Y$, $m' = \sigma_{xy} / \sigma_y^2$, con $r^2 = m \cdot m'$) va nella lezione? Molti libri del terzo anno la danno e ci costruiscono esercizi. L'ho tolta per la lunghezza; rimetterla richiede di tagliare altrove, per esempio un esempio svolto.
2. Vuoi delle soglie per leggere $r$ (per esempio forte sopra $0{,}7$)? E il nome "coefficiente di Bravais-Pearson" va bene accanto a "coefficiente di correlazione lineare"?
3. Serve il coefficiente di determinazione $r^2$ con il suo significato? Compare solo dentro il riquadro sul perché $-1 \leq r \leq 1$, senza nome.
4. La covarianza e la regressione a partire da una tabella a doppia entrata con frequenze (tabella di correlazione della 128) vanno aggiunte, qui o in un esempio?
5. L'esempio 4 ($r = 0$ con i punti ad arco) usa un lancio verticale a $20$ m/s con $g = 10$ m/s² e senza aria: $h = 20t - 5t^2$ dà $0, 15, 20, 15, 0$ metri a $t = 0, 1, 2, 3, 4$ s. Va bene il contesto di fisica, con $g$ arrotondato a $10$, o si preferisce un esempio astratto ($y = x^2$)?

## Da verificare

- Il blocco `grafico` passa `check.mts` ed è stato provato con il sito in sviluppo (`/prova-grafico/lezione`), in chiaro e in scuro, muovendo i cursori: $S = 16$ per $m = 0$, $q = 6$; $S = 6$ per $m = 0{,}5$, $q = 3{,}5$; $S = 816$ e $S = 701$ ai due estremi ($m = 2$, $q = 8$ e $m = -1$, $q = 0$), come dà il polinomio. I cursori sono stati mossi da uno script, non con il dito su un telefono.
- I dati sono tutti inventati, scelti per dare conti che si seguono a mano (medie intere, $m$ con una cifra decimale).
- Con i due piani della fase 3 la lezione è a circa 34.200 caratteri, sopra i 30.000 del brief della fase 1: i due blocchi, la figura di copertina nuova e le frasi attorno pesano circa 4.300 caratteri. Per rientrare bisognerebbe togliere un esempio svolto; non l'ho fatto, perché la fase 3 chiede di non cambiare il resto.

Prerequisiti proposti: statistica-variabilita, statistica-medie, equazione-di-una-retta, il-piano-cartesiano
