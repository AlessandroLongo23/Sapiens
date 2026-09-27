# Note: Rette parallele e perpendicolari

Lezione nuova, scritta da zero (lotto 8). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (script `83-verifica.py` nello scratchpad): le forme esplicite e i prodotti dei coefficienti angolari dell'esempio 1 e degli esempi in forma implicita ($ab' = a'b$, $aa' + bb' = 0$), i valori di $k$ dell'esempio 2 (`solve`), le rette per un punto degli esempi 3-5 con il controllo del passaggio per il punto, i due assi degli esempi 6-7 con `Segment.perpendicular_bisector` e con lo sviluppo di $\overline{PA}^2 - \overline{PB}^2$, le proiezioni degli esempi 8-9 con `Line.projection` e con `solve` sul sistema. Anche le figure: ogni estremo di segmento e ogni punto disegnato sta sulla sua retta (controllo numerico nello stesso script). La formula in evidenza più larga misura 228 px in KaTeX a 17 px di base (il sito usa 15 px). `check.mts` passa sui tre file.

## Scelte di convenzione (da verificare con il libro in uso)

- Parallele comprese le coincidenti, come la lezione 60. Con questa definizione $m_1 = m_2$ è "se e solo se" senza eccezioni; chi usa la definizione stretta deve aggiungere $q_1 \neq q_2$.
- Condizioni in forma implicita $ab' = a'b$ e $aa' + bb' = 0$, con gli apici della 68. Molti libri le scrivono con $\frac{a}{a'} = \frac{b}{b'}$ o con $a_1, a_2$; ho scelto la forma senza frazioni perché vale anche con le rette verticali, e la lezione lo dice.
- "Antireciproco" per $-\frac{1}{m}$, termine dei libri italiani più diffusi; alcuni dicono "reciproco dell'opposto" o "inverso e opposto".
- Distanza $\overline{PA}$, come deciso dalla 80 (`80-convenzioni.md`). Le mie scelte sono in `83-convenzioni.md` nello scratchpad.
- Simboli $r \parallel s$ e $r \perp s$; proiezione $H$ come la 60; retta per un punto $y - y_0 = m(x - x_0)$ come nel brief della 82.
- La giustificazione di $m_1 \cdot m_2 = -1$ usa la rotazione di un angolo retto del triangolo $O$, $Q(1, 0)$, $P(1, m_1)$. È più corta di quella con Pitagora o con il secondo teorema di Euclide che usano alcuni libri, ma presuppone che lo studente accetti che la rotazione porti $(1, m_1)$ in $(-m_1, 1)$ guardando i triangoli. Detta con $m_1 > 0$ e con la frase "funziona anche con $m_1$ negativo" senza dimostrazione.

## Lasciato ad altre lezioni

- Coefficiente angolare, $m = -\frac{a}{b}$, retta per un punto: 82 (link).
- Rette parallele agli assi: 81 (link). Punto medio e distanza: 80 (link).
- Intersezione di due rette: 84 (link nel procedimento della proiezione); il sistema si risolve con confronto e sostituzione, già noti dalla 68 (link nella sezione sul parallelismo).
- Distanza punto-retta: 85 (link, niente formula). Il simmetrico di un punto rispetto a una retta non c'è: non era nel brief; se serve, è un'aggiunta di due righe dopo l'esempio 8 ($H$ punto medio di $PP'$).
- Rette di un fascio parallele o perpendicolari a una retta data: 86. L'esempio 2 con il parametro $k$ resta al livello "uguaglia i coefficienti angolari", senza fasci.
- Asse: definizione dalla 60, proprietà di luogo dalla 61. Il brief diceva "luogo di punti equidistanti, link alla 60", ma nella 60 c'è solo la definizione e la proprietà di luogo è nella 61 ("Asse e bisettrice come luoghi di punti"): ho linkato tutte e due.

## Figure

Cinque, compilate con `compileFigure` e guardate in PNG in chiaro e con il filtro del tema scuro. Griglia `gray!25 very thin`, rette `blue!60` e `red!50`, etichette `blue!70!black` e `red!60!black`, punti neri, riempimenti `blue!15` e `red!15`.
- `rette-parallele-stesso-coefficiente-angolare` (189×235): $y = 2x + 1$ e $y = 2x - 3$ con i due gradini "1 a destra, 2 in su".
- `rette-perpendicolari-rotazione-triangolo` (226×163): $y = 2x$, $y = -\frac{1}{2}x$ e i due triangoli ruotati.
- `retta-parallela-perpendicolare-per-punto` (195×196, nell'esempio 3): $r$, parallela tratteggiata, perpendicolare rossa; le rette non hanno etichette con l'equazione (non ci stanno), il testo dell'esempio dice quale è quale.
- `asse-segmento-piano-cartesiano` (181×196, nell'esempio 6).
- `proiezione-punto-su-retta` (181×175, nell'esempio 8).
Tutte sotto i 280 px. Non viste sul sito.

## Formulario e flashcard

- Il formulario ha la tabella delle condizioni, i due procedimenti, l'asse nei due modi, la proiezione e tre avvisi. Per poter scrivere nel formulario il caso del segmento verticale ($y = y_M$) ho aggiunto una frase alla fine dell'esempio 7.
- 20 carte, tutte su regole ed esempi della lezione.

## Prerequisiti

La bozza `rette-parallele-tra-loro <- il-coefficiente-angolare` è corta di un arco. La cambierei in

```
rette-parallele-tra-loro <- il-coefficiente-angolare, sistemi-di-equazioni
```

perché la proiezione (esempi 8 e 9) si trova risolvendo un sistema di due equazioni, e la 82 nella bozza non ha i sistemi tra gli antenati (80 e 81 portano a funzioni-lineari, non a sistemi-di-equazioni). Se la 82 aggiunge `sistemi-di-equazioni` per la retta per due punti "con il sistema", la riga della bozza va bene così. Non metterei `intersezione-tra-due-rette` (84): il sistema della proiezione è sempre determinato e non serve discutere i casi. Non metterei nemmeno `geometria-perpendicolari-parallele` e `geometria-punti-notevoli`: la lezione ripete in una frase le definizioni di parallele, asse e proiezione, e la proprietà di luogo dell'asse è enunciata, non dimostrata.

## Per il generatore

1. Riconoscere: date due rette (esplicite o implicite, anche parallele agli assi), dire se sono parallele, perpendicolari o nessuna delle due. Coefficienti interi, distrattori con l'opposto o il reciproco.
2. Antireciproco e parametro: dato $m$ (intero o frazione) trovare il coefficiente della perpendicolare; trovare $k$ perché $y = (ak + b)x + c$ sia parallela o perpendicolare a una retta data (esempio 2).
3. Retta per un punto parallela o perpendicolare a una retta in forma esplicita, coordinate intere (esempio 3).
4. Lo stesso con la retta in forma implicita, punto con coordinate negative, risposta in forma implicita (esempio 4), e i casi con la retta data parallela a un asse (esempio 5).
5. Asse di un segmento: estremi interi con punto medio intero, poi coordinate negative e segmenti orizzontali o verticali (esempi 6-7).
6. Proiezione di un punto su una retta, prima con $H$ intero, poi con $H$ frazionario (esempi 8-9), e il caso della retta parallela a un asse.

Il controllo del generatore deve verificare le risposte con `Line.is_parallel`, `Line.is_perpendicular`, `perpendicular_bisector` e `projection` di SymPy, e nei livelli 3-4 che il punto dato stia sulla retta trovata.

## Da cambiare nelle lezioni già scritte

Niente di necessario. La 60 ("Rette perpendicolari e parallele") e la 61 non linkano la geometria analitica; se si vuole, alla fine della sezione "Asse di un segmento" della 60 si può aggiungere: "Nel piano cartesiano l'asse si trova con le coordinate: lo vedi nella lezione [Rette parallele e perpendicolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari)."

## Domande per Andrea

- Parallele: ho contato tra le parallele anche le rette coincidenti (come la lezione 60), così $m_1 = m_2$ vale senza eccezioni; l'alternativa è la definizione stretta (solo rette distinte) con la condizione $m_1 = m_2$ e $q_1 \neq q_2$.
- Condizioni in forma implicita: ho scritto $ab' = a'b$ e $aa' + bb' = 0$, che valgono anche con le rette verticali; l'alternativa è la forma con i rapporti $\frac{a}{a'} = \frac{b}{b'}$, più vicina ad alcuni libri ma che non funziona con i coefficienti nulli.
- Perché $m_1 \cdot m_2 = -1$: ho giustificato la regola ruotando di un angolo retto il triangolo con i vertici $(0, 0)$, $(1, 0)$, $(1, m)$; l'alternativa è la dimostrazione con il teorema di Pitagora (o con il secondo teorema di Euclide) sul triangolo formato dalle due rette e da una verticale, più lunga ma più comune nei libri.
- Asse di un segmento: ho dato i due metodi (perpendicolare nel punto medio e punti equidistanti con i quadrati da sviluppare); l'alternativa è tenere solo il primo al biennio e lasciare il secondo come riquadro facoltativo.
- Termine "antireciproco" per $-\frac{1}{m}$: l'alternativa è evitare il nome e dire sempre "reciproco cambiato di segno".
