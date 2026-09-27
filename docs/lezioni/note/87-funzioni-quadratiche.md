# Note: La parabola

Lezione nuova, scritta da zero (lotto 8). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`87-verifica.py` nello scratchpad): vertice, discriminante, soluzioni, intersezione con l'asse $y$ e simmetrico per le tredici parabole usate (esempi, avvisi, carte), l'identità $f\big(-\frac{b}{2a}\big) = -\frac{\Delta}{4a}$ in forma simbolica, le soluzioni della spuria $ax^2 + bx = 0$ della dimostrazione, le appartenenze ($(3, 0)$ sì e $(1, 2)$ no), il sistema della parabola per tre punti (`linsolve`, dà $a = 1$, $b = -4$, $c = 3$) e i valori approssimati $\frac{3 \pm \sqrt{5}}{2} \approx 0{,}38$ e $2{,}62$. Lo stesso script legge i blocchi TikZ e controlla che ogni punto disegnato stia sulla sua parabola: tutti a posto. La larghezza delle formule in evidenza, misurata con KaTeX a 17 px, arriva al massimo a 227 px nella lezione e a 82 px nel formulario.

## Scelte di convenzione

- "Concavità verso l'alto" per $a > 0$ e "verso il basso" per $a < 0$, con la frase "il vertice è il punto più basso / più alto" (niente "minimo" e "massimo", che hanno una lezione loro più avanti). "Apertura" legata a $|a|$, con "più stretta" e "più larga". Da verificare con il libro in uso.
- Vertice $V(x_V, y_V)$ con $x_V = -\frac{b}{2a}$; $y_V$ si calcola sostituendo, e $y_V = -\frac{\Delta}{4a}$ è in un `ad-tip` come controllo. Molti libri danno subito $V\big(-\frac{b}{2a}, -\frac{\Delta}{4a}\big)$: ho preferito una sola formula da ricordare.
- La formula del vertice è giustificata in un `ad-note` con i due punti alla stessa altezza di $(0, c)$ (equazione spuria), che non richiede il completamento del quadrato.
- Punti con le lettere maiuscole e le coordinate separate dalla virgola, come nella 80; frazioni nelle coordinate ($V\big(\frac{3}{2}, -\frac{5}{4}\big)$), con `\Big(` per non spezzare `\left( \right)`.
- "Tangente all'asse $x$" per $\Delta = 0$, spiegato in una frase ("lo tocca in un solo punto senza attraversarlo"), prima che la tangente sia definita in generale.
- Le convenzioni per le lezioni 88 e 89 sono in `87-convenzioni.md` nello scratchpad.

## Lasciato ad altre lezioni

- Formula risolutiva, casi del discriminante, soluzioni irrazionali: link alla 17. Somma delle soluzioni ($x_V$ a metà tra $x_1$ e $x_2$): link alla 77.
- Retta verticale $x = k$ per l'asse di simmetria: link alla 81, con una frase che la spiega.
- Sistema di tre equazioni per la parabola per tre punti: link alla 69 (sezione "Sistemi di tre equazioni in tre incognite"), risolto per riduzione dentro l'`ad-note`.
- Segno del trinomio e disequazioni: solo la frase finale con il link alla 88.
- Fuoco, direttrice, forma $y = a(x - h)^2 + k$, parabola con asse orizzontale, rette tangenti: sono della lezione del terzo anno "La parabola nel piano cartesiano" (capitolo Circonferenza e coniche), non ancora scritta e quindi non linkata.

## Da cambiare nelle lezioni già scritte

- 45 (Proporzionalità diretta e inversa), fine della sezione "La proporzionalità quadratica": oggi il link va alla lezione del terzo anno, che è una pagina vuota. Testo proposto: "Il grafico di $y = kx^2$ non è una retta: per $x \geq 0$ è metà di una parabola con il vertice nell'origine, la curva che trovi nella lezione [La parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola)."
- 42 (Definizione di funzione), esempio 7: in fondo alla frase "Unendoli si ottiene una curva a forma di U, che si chiama parabola" aggiungere ", e che studierai nella lezione [La parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola)".
- 17 (Equazioni di secondo grado), sezione "I tre casi del discriminante": dopo il paragrafo "Con $\Delta = 0$ la radice vale $0$…" si può aggiungere "Il significato grafico dei tre casi, con la parabola che taglia, tocca o non incontra l'asse $x$, è nella lezione [La parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola)." Facoltativo.

## Figure

Undici, tutte compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro e con il filtro del tema scuro (anteprime `87-a.png`…`87-d.png` nello scratchpad). Griglia `gray!25`, parabole `blue!60` (concavità verso il basso `orange!70`), asse di simmetria tratteggiato grigio, punti neri con le lettere.

- `parabola-y-uguale-x-quadro` (256×214), `parabole-y-uguale-a-x-quadro` (202×256, quattro parabole con le etichette colorate), `parabola-y-uguale-x-quadro-meno-3` (199×226), `parabola-casi-discriminante` (323×257, sei riquadri: due righe per il segno di $a$, tre colonne per $\Delta$), tutte fuori dai riquadri.
- Dentro i riquadri, tutte sotto i 200 px: esempio 1 (`parabola-un-mezzo-x-quadro-meno-2`), esempio 2 (`parabola-vertice-asse-x-quadro-meno-4x-piu-3`), esempi 3-7 (`parabola-x-quadro-meno-2x-meno-3`, `parabola-meno-x-quadro-meno-2x-piu-3`, `parabola-tangente-asse-x`, `parabola-senza-intersezioni-asse-x`, `parabola-vertice-frazionario`).
- La parabola per tre punti non ha figura: è la stessa dell'esempio 2, e il testo lo dice.
- Non le ho viste sul sito.

## Formulario e flashcard

- Formulario senza figure; tabella di concavità e apertura, tabella del discriminante, i sei passi del disegno, una riga sulla parabola per tre punti, tre avvisi (segno nella formula del vertice, meno davanti a $x^2$, apertura).
- 20 carte, tutte su regole ed esempi della lezione.

## Prerequisiti

La riga `funzioni-quadratiche <- il-piano-cartesiano, equazioni-secondo-grado` va bene così. La lezione usa le coordinate (80) e la formula risolutiva con i tre casi di $\Delta$ (17). L'asse di simmetria è la retta $x = x_V$, che viene dalla 81 (`equazione-di-una-retta`), ma la lezione spiega in una frase cosa vuol dire, quindi non la aggiungerei; se si vuole, `equazione-di-una-retta` può sostituire `il-piano-cartesiano` (che ne è antenato) senza aggiungere archi. La 69 serve solo nell'`ad-note` della parabola per tre punti, che si può saltare, e la 77 solo in un `ad-tip`: non sono prerequisiti.

## Per il generatore

1. Concavità e apertura: dato $y = ax^2$ o $y = ax^2 + c$, dire verso dove è la concavità, qual è il vertice e quale di due parabole è più stretta (con i distrattori con $a$ negativo).
2. Vertice e asse di $y = ax^2 + bx + c$ con coefficienti interi e vertice intero, anche con $a < 0$ ($y = -x^2 - 2x + 3$).
3. Vertice con coordinate frazionarie ($y = x^2 - 3x + 1$, $y = 2x^2 - 5x + 7$), con il controllo $y_V = -\frac{\Delta}{4a}$.
4. Intersezioni con gli assi: il punto $(0, c)$ e le intersezioni con l'asse $x$ nei tre casi di $\Delta$, con soluzioni intere, frazionarie o irrazionali.
5. Posizione rispetto all'asse $x$ senza disegnare: dal segno di $a$ e di $\Delta$ dire se la parabola taglia l'asse, è tangente o sta tutta sopra o sotto.
6. Appartenenza di un punto e parabola per tre punti (prima con un punto sull'asse $y$, poi con tre punti qualsiasi a coordinate intere).

## Domande per Andrea

- Concavità: la lezione dice "concavità verso l'alto / verso il basso" e "il vertice è il punto più basso / più alto"; l'alternativa è "concavità rivolta verso l'alto" o "verso le $y$ positive", e nominare già minimo e massimo.
- Vertice: la lezione dà solo $x_V = -\frac{b}{2a}$ e fa calcolare $y_V$ sostituendo ($-\frac{\Delta}{4a}$ è un controllo in un riquadro); l'alternativa, comune nei libri, è far imparare $V\big(-\frac{b}{2a}, -\frac{\Delta}{4a}\big)$ come formula unica.
- Parabola per tre punti: è in un riquadro facoltativo con un sistema di tre equazioni (lezione 69); l'alternativa è lasciarla alla lezione del terzo anno sulla parabola come conica.
- La lezione non tratta la forma $y = a(x - h)^2 + k$ né lo spostamento orizzontale; si può aggiungere se il vostro libro la fa al secondo anno.
- "Tangente all'asse $x$" usato per $\Delta = 0$ prima di definire la tangente in generale: va bene così, o meglio dire solo "tocca l'asse $x$ nel vertice"?
