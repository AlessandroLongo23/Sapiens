# Note: Fasci di rette

Lezione nuova, scritta da zero (lotto 8). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (script `86-verifica.py` nello scratchpad): il valore di $m$ dell'esempio 1 e l'uguaglianza impossibile con $B(2, 4)$; le rette del fascio di centro $C(2, 1)$ per $m = 0, 2, -1, \frac{1}{2}$; $q = 4$ dell'esempio 2 e la forma implicita $x - 2y + 8 = 0$; l'uguaglianza tra $(1 + k)x + (1 - k)y - 3 - k$ e $x + y - 3 + k(x - y - 1)$ (`expand`), il centro con `linsolve`, la verifica che $C$ annulla l'equazione per ogni $k$; il raccoglimento degli esempi 4 e 5, il valore $k = -1$ che dà $-4 = 0$, $k = 3$ per l'origine e il fatto che il termine noto $\frac{k - 3}{1 + k}$ non vale mai $1$ (la retta esclusa $2x + y + 1 = 0$ non si ottiene); $k = 3$ dell'esempio 6 e l'equazione $2 = 0$ con $B(3, 2)$; $k = \frac{1}{2}$ e $k = \frac{1}{3}$ dell'esempio 7 con le rette $3x + y - 7 = 0$ e $2x + y - 5 = 0$ (anche `Line.is_perpendicular`); l'equazione impossibile dell'esempio 8 e le rette per $k = 1$ ($x = 2$) e $k = -1$ ($y = 1$). Ogni punto delle figure è stato controllato sulla sua retta. La larghezza delle formule in evidenza, misurata con KaTeX in Chromium a 17 px: la più larga è 244 px, nella lezione e nel formulario. `check.mts` passa sui tre file.

## Scelte di convenzione (da verificare con il libro in uso)

- Punti come $C(2, 1)$, rette con la minuscola ($r$, $s$), implicita $ax + by + c = 0$ e $a'x + b'y + c' = 0$ con gli apici, come la 68 e la 83. Centro del fascio $C$ con coordinate $(x_0, y_0)$, come $y - y_0 = m(x - x_0)$ della 82.
- Fascio generato scritto $r + k \cdot s = 0$, con il parametro $k$ come nelle lezioni 69 e 78. La retta esclusa è quella moltiplicata per $k$. Alcuni libri scrivono $\lambda r + \mu s = 0$ con due parametri, che non esclude nessuna retta; altri mettono il $k$ davanti alla prima. Ho scelto la forma con un parametro perché è quella degli esercizi.
- "Generatrici" come termine principale, "rette base" citato una volta. "Retta esclusa" per quella che il parametro non dà.
- Nel fascio improprio in forma implicita ho usato $c$ come termine noto che cambia ($x - 2y + c = 0$), e $h$ per le verticali $x = h$ come la 81; $k$ resta solo per la combinazione lineare, per non avere due significati.
- Per parallela e perpendicolare uso il coefficiente angolare del fascio, $m = -\frac{a}{b}$ in funzione di $k$, con il valore che annulla $b$ studiato a parte. La 83 ha anche le condizioni implicite $ab' = a'b$ e $aa' + bb' = 0$, che evitano la divisione; non le ho usate per non dare due metodi, ma darebbero gli stessi $k$ (controllato).
- Colori delle figure: rette del fascio `blue!60`, retta esclusa o verticale tratteggiata `red!60`, la retta trovata in `red!50`, griglia `gray!25`, punti neri.

## Lasciato ad altre lezioni

- Retta per un punto con $m$ dato e $m = -\frac{a}{b}$: 82 (link).
- Condizioni di parallelismo e perpendicolarità: 83 (link).
- Intersezione di due rette e sistema: 84 e 68 (link al sistema dentro la sezione sul fascio generato).
- Parametro trattato come un numero: 50 (link). La 69 e la 78 non sono linkate: le cito solo qui per la scelta della lettera.
- Fasci di rette con problemi di distanza (la retta del fascio a distanza data da un punto) e fasci che dipendono da $k$ in modo non lineare: non trattati. Il primo tipo usa la 85 e porta spesso a equazioni di secondo grado in $k$; si può aggiungere un esempio se Andrea lo vuole.

## Figure

Quattro, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in PNG in chiaro e con il filtro del tema scuro:
- `fascio-proprio-centro-2-1` (200×201): quattro rette per $C(2, 1)$ e la verticale $x = 2$ tratteggiata. Ho tolto l'etichetta $2$ dell'asse $x$ perché la tratteggiata la tagliava.
- `fascio-improprio-parallele` (205×227): $y = \frac{1}{2}x + q$ con $q = -2, 0, 2, 4$ e il punto $P(-2, 3)$.
- `fascio-generato-da-due-rette` (200×201): $r$, $s$ tratteggiata, $C$.
- `fascio-retta-per-un-punto` (200×230): $y = 2x - 3$ per $A$ e $C$, la retta esclusa tratteggiata con $B(3, 2)$.

Tutte fuori dai riquadri, sotto i 280 px. Non viste sul sito. Il formulario non ha figure.

## Formulario e flashcard

- Il formulario ha i tre tipi di fascio, i passi per studiare un fascio con $k$ nei coefficienti con l'esempio 3 in tre righe, una tabella delle condizioni e tre avvisi.
- 20 carte. La carta `fascio-proprio-centro-lettura` ($y + 3 = m(x - 5)$) usa numeri che non sono nella lezione, ma la stessa regola di lettura del centro.

## Prerequisiti

La riga della bozza, `retta-fasci <- rette-parallele-tra-loro, intersezione-tra-due-rette, equazioni-letterali`, va bene così. La 83 porta con sé la 82 (retta per un punto, $m = -\frac{a}{b}$), che quindi non va elencata; la 84 serve per il centro del fascio generato; la 50 per il parametro. La 68 arriva attraverso la 84. Non aggiungerei `sistemi-cramer` né `equazioni-parametriche`: la lezione usa solo la lettera $k$, non i loro metodi.

## Per il generatore

1. Fascio proprio: dato il centro, scrivere $y - y_0 = m(x - x_0)$ e trovare la retta per un punto (compreso il punto con la stessa ascissa del centro, risposta $x = x_0$).
2. Fascio improprio: la retta parallela a una retta data (esplicita o implicita) per un punto.
3. Fascio con $k$ nei coefficienti: raccogliere $k$, scrivere le generatrici, trovare il centro e la retta esclusa (anche con una generatrice verticale o orizzontale).
4. Riconoscere se il fascio è proprio o improprio, e nel caso improprio il valore di $k$ che non dà una retta.
5. La retta del fascio che passa per un punto, compreso il punto sulla retta esclusa (equazione in $k$ impossibile) e il centro (vera per ogni $k$).
6. La retta del fascio parallela o perpendicolare a una retta data, compresi i casi in cui la risposta è la retta esclusa o la verticale del fascio.

Il controllo del generatore deve verificare con SymPy che il centro annulli l'equazione per ogni $k$, che la retta trovata passi per il centro e abbia la proprietà richiesta, e nei casi scomodi che la retta esclusa sia davvero la risposta.

## Domande per Andrea

- Fascio generato: scritto $r + k \cdot s = 0$ con un solo parametro, e la retta $s$ esclusa; l'alternativa è $\lambda r + \mu s = 0$ con due parametri, che contiene tutte le rette per il centro.
- Nome delle due rette di partenza: "generatrici" (scelto), con "rette base" citato; alcuni libri dicono anche "rette fondamentali".
- Retta esclusa: nominata "retta esclusa"; alcuni libri non le danno un nome e dicono solo "la retta $s$ non appartiene al fascio al variare di $k$".
- Fascio improprio: definito come le parallele a una retta, comprese le rette verticali $x = h$ come fascio a sé; alcuni libri definiscono solo $y = mx + q$ con $m$ fisso.
- Parallela e perpendicolare nel fascio: con $m = -\frac{a}{b}$ in funzione di $k$ (scelto); l'alternativa sono le condizioni implicite $ab' = a'b$ e $aa' + bb' = 0$ della 83, che non richiedono di studiare a parte il valore che annulla $b$.
- Problemi di distanza con i fasci (retta del fascio a distanza data da un punto): non inclusi; si possono aggiungere qui o nella 85.
