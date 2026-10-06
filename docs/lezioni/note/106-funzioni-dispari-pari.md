# Note: Funzioni pari e dispari

Lezione nuova (lotto del terzo anno, gruppo A, 5 ottobre 2026). I conti sono stati rifatti con SymPy (`gruppo-a/verifica.py` nello scratchpad): $f(-x)$ per le due funzioni delle definizioni e per gli esempi 1, 2, 3, 4 e 6, i valori numerici degli avvisi, il dominio dell'esempio 4.

## Scelte

- Il dominio simmetrico è dentro la definizione ("anche $-x$ appartiene al dominio"), ed è il primo passo del procedimento.
- Simmetria rispetto all'origine spiegata con le coordinate opposte e con il punto medio, con il link alla simmetria centrale della 104.
- Regola sui polinomi (soli gradi pari, soli gradi dispari) data come scorciatoia, con l'avvertenza che non vale per frazioni e radici.
- Dimostrate: $f(0) = 0$ per una dispari definita in zero; il prodotto di due dispari è pari; l'unica funzione pari e dispari insieme è la nulla (in un `ad-note`). Gli altri casi della tabella sono enunciati.
- La somma di una pari e di una dispari "non è né pari né dispari se nessuna delle due è la funzione nulla": è vero, e la dimostrazione (se $p + d$ fosse pari, $d$ sarebbe pari e dispari insieme) non è nella lezione.
- Confine con la 109: qui le simmetrie servono a riconoscere e a completare un grafico; $f(-x)$ e $-f(x)$ come trasformazioni di un grafico qualsiasi sono nella 109, che rimanda qui.
- Niente scomposizione di una funzione in parte pari e parte dispari.
- Coordinate con la virgola, come nelle lezioni 80-87 (correzione di chi coordina al brief).

## Domande per Andrea

- Il dominio simmetrico dentro la definizione: il libro in uso lo chiede in modo esplicito, o dà solo $f(-x) = f(x)$? Cambia la risposta a esercizi come $y = \dfrac{x^2}{x - 1}$.
- La tabella su prodotto, quoziente e somma di funzioni pari e dispari è nel programma della classe, o è un di più da spostare in un riquadro facoltativo?
- "Simmetrico rispetto all'origine" è spiegato anche come "mezzo giro attorno a $O$": va bene, o confonde chi non ha fatto la 104?
- Nell'esempio 2 chiedo un controesempio numerico anche se $f(-x)$ ha già una forma diversa da $f(x)$ e da $-f(x)$: in verifica lo si pretende, o ci si ferma al confronto delle due espressioni?

## Da verificare

- Figure guardate in anteprima, in chiaro e in scuro, non sul sito pubblicato.
- I due blocchi `grafico` sono stati aperti sulla pagina di prova con i cursori ai due estremi ($n = 1$ e $n = 8$; $c = -3$ e $c = 3$): disegnano bene.
- Nel blocco $y = x^3 - 3x + c$ la curva resta simmetrica rispetto al punto $(0, c)$ per ogni $c$: la domanda chiede solo quando coincide con la simmetrica rispetto all'origine, ma uno studente attento può chiedere perché "sembra sempre simmetrica".

## Figure

Quattro TikZ: `funzione-pari-simmetria-asse-y`, `funzione-dispari-simmetria-origine` (copertina), `potenze-pari-e-potenze-dispari` (copertina), `completare-grafico-pari-e-dispari`. Due blocchi `grafico`: `funzione-dispari-termine-noto-cursore`, `potenza-x-alla-n-cursore`.

## Formulario e flashcard

Formulario senza figure, con la colonna della somma aggiunta alla tabella delle operazioni (nella lezione è nel testo). 20 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Tre piani.
- `funzione-pari-termine-dispari-cursore` (nuovo, dopo la figura della funzione pari): $y = x^4 - 3x^2 + bx + 1$ e la sua simmetrica rispetto all'asse $y$, tratteggiata, con $f(1)$ e $f(-1)$ sotto il piano. Parte da $b = 0$, lo stato della copertina.
- `funzione-dispari-termine-noto-cursore` (c'era già): aggiunti i valori $f(1)$ e $f(-1)$ e il paragrafo con la risposta ($c = 0$).
- `potenza-x-alla-n-cursore` (c'era già): aggiunto il paragrafo con la risposta, che nomina il caso $n = 1$.

Scartati: $y = \frac{x^2}{x - a}$ con il cursore $a$ (per $a = 0$ diventa $y = x$ senza un punto: un caso limite che confonde più di quanto spieghi); il completamento del grafico per simmetria, che non ha un parametro.

Prerequisiti proposti: funzioni-reali-di-variabile-reale, il-piano-cartesiano
