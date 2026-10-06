# Note: Funzione logaritmica

Lezione nuova (lotto del terzo anno, gruppo F, 5 ottobre 2026). Conti rifatti con SymPy (`verifica.py` nella cartella temporanea `gruppo-f`): le due tabelle di valori, i segni, i confronti e i valori approssimati degli esempi 1-3, i quattro domini (con `solve_univariate_inequality`), lo zero e l'intersezione con l'asse $y$ dell'esempio 7.

## Scelte

- Ordine: prima il grafico per punti e le sue proprietà, poi la base minore di $1$, poi l'inversa dell'esponenziale. L'alternativa dei libri è partire dall'inversa e ricavare il grafico per simmetria; ho preferito far disegnare la curva dalla tabella, e usare la simmetria come conferma.
- "Asintoto" è definito nella 121; qui si richiama e si aggiunge "asintoto verticale". Niente limiti, niente $\to$.
- L'insieme immagine $\mathbb{R}$ è giustificato con "il valore $c$ è raggiunto in $x = a^c$", senza parlare di continuità.
- Crescenza e decrescenza sono enunciate e ricondotte a quelle della funzione esponenziale (121), con il link alla 107 per la definizione. La frase "una funzione e la sua inversa hanno lo stesso andamento" è enunciata senza dimostrazione.
- Il confronto tra logaritmi e l'iniettività sono qui, come base della 126 e della 127, che li richiamano.
- Il dominio delle funzioni con un logaritmo è qui (il brief lo assegna alla 125): argomento di primo e secondo grado, fratto, logaritmo al denominatore e sotto radice. La base variabile ($\log_x 2$) non c'è.
- Trasformazioni: solo la traslazione $\log_a (x - h) + k$ con un esempio; simmetrie in una frase, con il link alla 109. Valore assoluto e dilatazioni restano alla 109.
- Le scale logaritmiche (pH, decibel, magnitudo) sono in un `ad-note` finale, senza formule oltre a quella del pH.
- Tre blocchi `grafico`: $\log_a x$ con il cursore $a$; $a^x$, $\log_a x$ e $y = x$ con il cursore $a$; $\log_2 (x - h) + k$ con l'asintoto. Il cursore di $a$ parte da $0{,}1$: sotto $e^{-e} \approx 0{,}066$ le curve $a^x$ e $\log_a x$ si incontrano in tre punti, due dei quali fuori dalla bisettrice, e la domanda del blocco ("su quale retta sta il punto in cui si incontrano?") non avrebbe più una risposta sola.

## Domande per Andrea

- Va bene dare l'asintoto verticale a parole ("la curva si accosta all'asse $y$ senza toccarlo"), o preferisci non usare la parola prima del quinto anno?
- Il dominio con il logaritmo sotto radice ($\sqrt{\log_2 x}$) richiede $\log_2 x \geq 0$, cioè una disequazione logaritmica elementare, letta dal segno. Lo lasceresti qui o lo sposteresti nella 127?
- Funzioni con la base variabile, $\log_x (x + 2)$: le aggiungiamo al dominio o restano fuori dal terzo anno?
- Nel riquadro sulle scale logaritmiche c'è il pH come $-\log$ della concentrazione in moli per litro. Vuoi un rimando alla lezione di chimica, o un esempio diverso (decibel)?
- Il confronto tra grafici con basi diverse maggiori di $1$ ($\log_2 x$ sopra $\log_3 x$ per $x > 1$) è lasciato al cursore: serve dirlo nel testo?

## Da verificare

- I tre blocchi `grafico` passano `check.mts` ma non sono stati aperti nel browser. Da guardare: la curva che sparisce per $a = 1$, il punto $A(a, 1)$, il valore $A = (1 + h, k)$ nel terzo blocco.
- Nella figura dell'esempio 7 la curva tratteggiata $y = \log_2 x$ incontra quella traslata in $(4, 2)$: è vero (controllato), ma il testo non lo dice.
- I titoli di sezione usano il carattere "ₐ" (pedice Unicode) in "y = logₐ x", come la 87 usa "x²": da guardare sul sito e nel sommario.
- Figure guardate in chiaro e in scuro con `anteprima.mjs`, non sul sito.

## Formulario e flashcard

- Il formulario copia una figura della lezione, i due grafici con base $2$ e $\frac{1}{2}$: è quella che si riapre prima della verifica.
- 19 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Cinque piani, il massimo del brief, tutti aperti su `/prova-grafico/lezione` a 390 px ai valori iniziali, agli estremi e nei casi limite.

- `funzione-logaritmica-cursore-base` (cambiato): il punto è ora $A(a, \log_a a)$, con le coordinate sotto il piano; per $a = 1$ spariscono curva e punto, e il valore dice "A non esiste". Aggiunto il paragrafo con le risposte.
- `esponenziale-logaritmo-cursore-base` (cambiato): la domanda chiede anche che cosa resta per $a = 1$ (la retta $y = 1$, senza inversa); aggiunto il paragrafo con le risposte.
- `confronto-logaritmi-cursore-base` (nuovo), sezione "Confrontare due logaritmi", copertina nuova `confronto-logaritmi-due-punti`: i punti $P$ e $Q$ di ascissa $3$ e $5$ sulla curva $y = \log_a x$, con i due logaritmi scritti sotto.
- `dominio-logaritmo-cursore` (nuovo), dopo l'esempio 4, copertina nuova `dominio-logaritmo-striscia`: $y = \ln (c - x^2)$ con le rette $x = \pm\sqrt{c}$; per $c \leq 0$ il dominio è vuoto e la curva sparisce.
- `logaritmo-traslato-cursori` (cambiato), nell'esempio 7: sotto il piano l'asintoto $x = h$ e lo zero $Z(h + 2^{-k}, 0)$, al posto del punto $(1 + h, k)$; i cursori sono ristretti ($h$ da $-5$ a $3$, $k$ da $-2$ a $4$) perché lo zero resti nella finestra.

Scartati: un cursore sul primo grafico per punti (è una figura da leggere); il confronto tra basi diverse maggiori di $1$ (lo mostra già il primo piano); $\lvert \log_2 x \rvert$ e le dilatazioni, che sono della 109.

Da sapere: nel secondo piano, per $a$ tra $1$ e circa $1{,}44$ le due curve si incontrano in due punti della bisettrice. Il testo non lo dice, e la domanda parte da $a = 2$.

Titoli con "logₐ": sulla pagina si leggono, con la "a" in pedice presa da un carattere di riserva, un po' più leggera del resto del titolo.

Prerequisiti proposti: logaritmi-proprieta, funzioni-esponenziali, composizione-di-funzioni, funzioni-monotone
