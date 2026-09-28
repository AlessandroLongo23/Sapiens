# Note: Equazioni e disequazioni con il valore assoluto

Lezione nuova, scritta da zero (lotto 9). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy nello stesso script della 90 (`verifica.py` nello scratchpad del lotto): `solveset` in $\mathbb{R}$ con `Abs` su ogni equazione (apertura, i tre casi di $|A(x)| = k$, esempi 1-6, gli avvisi, le carte), comprese le soluzioni scartate ($x = -5$ nell'esempio 4, $x = \dfrac{4}{3}$ dell'avviso sul segno) e i valori di controllo ($|-9| = 9$, $\dfrac{5}{3}$ e $\dfrac{11}{3}$); `solve_univariate_inequality` su ogni disequazione (figura dei valori interni ed esterni, esempi 7-11, le sei righe della tabella con $k \leq 0$, l'avviso con $k$ negativo, le due disequazioni dell'esempio 11 e la loro intersezione sbagliata $\,]-4, -1[$); la somma $|x - 1| + |x + 2|$ uguale a $3$ in quattro punti tra $-2$ e $1$. Le due regole $|A| < B \Leftrightarrow -B < A < B$ e $|A| > B \Leftrightarrow A < -B$ oppure $A > B$, dette senza condizione su $B$, sono controllate su 20 coppie $A$, $B$ di primo e di secondo grado (anche con $B$ sempre negativo) in 801 punti razionali ciascuna. Lo script delle figure (`91/fig91.py`) costruisce ogni riga dei grafici dall'insieme calcolato da SymPy per la disequazione dell'etichetta, e controlla che il sistema dell'esempio 9 e l'unione dell'esempio 11 diano le soluzioni della disequazione con il valore assoluto; per il piano cartesiano controlla che i vertici e gli estremi delle due spezzate stiano sui grafici. Il controllo `check.mts` passa sui tre file. Le formule in evidenza, misurate con KaTeX in Chromium a 17 px, sono larghe al massimo 231 px.

## Struttura ed esempi

Definizione a tratti di $|A(x)|$ (link alla 20), con $|x - 2|$ e $|x^2 - 4|$; tre proprietà (non negatività, $|A| = |-A|$, distanza); il grafico di $y = |x|$ e di $y = |x - 2|$ (link alla 80). Poi le equazioni in quattro sezioni ($|A| = k$ con la tabella dei tre casi, $|A| = |B|$, $|A| = B$, più valori assoluti) e le disequazioni in due ($|A| \lessgtr k$, con la tabella dei casi con $k \leq 0$, e $|A| \lessgtr B$).

Undici esempi svolti:

1. $|2x - 1| = 5$;
2. $|x^2 - 5| = 4$, due pure, quattro soluzioni;
3. $|x - 3| = |2x + 1|$, con una soluzione frazionaria;
4. $|x - 4| = 2x + 1$, una soluzione scartata dalla condizione (e rifatto nel riquadro con i due sistemi);
5. $|x^2 - 4| = 3x$, quattro candidati e due accettati;
6. $|x - 1| + |x + 2| = 5$, studio per intervalli in una tabella, con la lettura come somma di distanze;
7. $|2x - 3| \leq 5$, valori interni;
8. $|x + 1| > 2$, valori esterni;
9. $|x^2 - 5| < 4$, sistema di due disequazioni di secondo grado con il grafico;
10. $|x - 3| < 2x$, sistema di primo grado;
11. $|x^2 - 4| > 3x$, unione di due disequazioni di secondo grado con il grafico (stessa espressione dell'esempio 5, e il testo lo fa notare).

Avvisi, ognuno dopo il suo punto: togliere le sbarre senza guardare il segno; il secondo membro negativo; cambiare segno a un solo termine in $A = -B$; dimenticare la condizione; accettare una soluzione fuori dal suo intervallo; scrivere i valori esterni in una riga; applicare la regola con $k$ negativo; intersecare invece di unire. In fondo due generici: $|a + b| \neq |a| + |b|$ e il segno meno dentro e fuori le sbarre.

## Scelte di convenzione (da verificare con il libro in uso)

- Metodo principale per $|A(x)| = B(x)$: la condizione $B(x) \geq 0$ e le due equazioni $A = \pm B$. Il metodo dei due sistemi (togliere le sbarre con la definizione) è nel riquadro `ad-note`, come chiede il brief. Molti libri del biennio partono dai due sistemi: vedi le domande per Andrea.
- $|A(x)| < B(x)$ e $|A(x)| > B(x)$ risolte con il sistema e l'unione, senza condizione su $B(x)$; la lezione spiega in due righe perché la condizione non serve. Alcuni libri scrivono la condizione $B(x) > 0$ nel sistema, o studiano a parte il caso $B(x) < 0$ nella disequazione con $>$: il risultato è lo stesso.
- "Argomento" del valore assoluto e "condizione" (non "condizione di esistenza", perché l'equazione esiste per ogni $x$). "Valori interni" e "valori esterni" come nella 88, qui riferiti a $-k$ e $k$.
- Il simbolo $\Updownarrow$ nelle formule in evidenza per "equivale a", scelto perché le formule su una riga con $\Leftrightarrow$ superavano i 260 px; il formulario usa $\Leftrightarrow$ solo nella riga corta di $|A(x)| < B(x)$. Nessuna lezione già scritta usa $\Updownarrow$ (controllato con grep su `riscritte/`): se si preferisce, si scrive "equivale a" in parole.
- Studio per intervalli con gli zeri messi nell'intervallo alla loro destra ($-2 \leq x < 1$, $x \geq 1$).
- Barre dentro le tabelle scritte con `\lvert` e `\rvert`, perché `|` spezza le celle del Markdown.
- Intervalli con `\mathopen{]}` e `\mathclose{[}` come la 88 e la 89.

## Lasciato ad altre lezioni

- Valore assoluto di un numero e proprietà: link alla 20. $\sqrt{x^2} = |x|$ della 72 non è citata, perché la lezione non ne ha bisogno.
- Sistemi e doppie disequazioni: link alla 53; disequazioni di secondo grado e sistemi di secondo grado: link alla 88 e alla 89.
- Grafici di funzioni con il valore assoluto oltre a $y = |x|$ e $y = |x - 2|$ (per esempio $y = |x^2 - 4|$ o il metodo grafico per le equazioni): fuori. È un argomento del terzo anno in molti libri.
- Disequazioni con più valori assoluti: fuori; il procedimento per intervalli è lo stesso delle equazioni, e si può aggiungere un esempio se Andrea lo vuole.
- Valore assoluto in equazioni fratte o irrazionali: fuori (la 92 tratta le irrazionali).

## Figure

Quattro blocchi TikZ, generati da `91/fig91.py` (con `figlib.py`, le funzioni della 89) e compilati con `compileFigure`; guardati in PNG in chiaro e con il filtro di inversione su un riquadro bianco.

- `grafico-valore-assoluto-x-e-x-meno-2` (279 x 112): quadrettatura leggera, $y = |x|$ in blu e $y = |x - 2|$ in rosso, vertici segnati, etichette colorate. Ho tolto le etichette dell'asse $y$ perché la seconda V passa sopra il $2$; restano le etichette dell'asse $x$ da $-3$ a $5$.
- `valore-assoluto-valori-interni-esterni` (265 x 77): due righe, $|x - 2| < 3$ e $|x - 2| > 3$, nello stile dei grafici dei sistemi della 53, senza strisce colorate.
- `valore-assoluto-sistema-secondo-grado` (242 x 77): il sistema dell'esempio 9, con le strisce arancioni come nella 89.
- `valore-assoluto-unione-secondo-grado` (292 x 98): le due disequazioni dell'esempio 11 e una terza riga $S$ con l'unione, senza strisce (le strisce, nella 53 e nella 89, vogliono dire "tutte le righe", cioè l'intersezione). È la figura più larga della lezione, per l'etichetta $x^2 - 3x - 4 > 0$.

Niente `\clip`, niente riempimenti bianchi, niente `\mathbb`.

## Formulario e flashcard

- Formulario: definizione e proprietà, tabella delle equazioni con l'esempio 4, procedimento per più valori assoluti, regole con $k > 0$, tabella con $k \leq 0$, regole con $B(x)$, tre avvisi. Nessuna figura.
- 20 carte, nell'ordine della lezione; tutti i numeri vengono dalla lezione.

## Da cambiare nelle lezioni già scritte

- 20 (Numeri interi e valore assoluto), riquadro `ad-note` "Anche per frazioni e decimali": facoltativo. Dopo "$\left|-\dfrac{3}{4}\right| = \dfrac{3}{4}$ e $|-2{,}5| = 2{,}5$." si può aggiungere "Con le espressioni che contengono un'incognita, come $|x - 2|$, il valore assoluto si usa nelle [equazioni e disequazioni con il valore assoluto](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/equazioni-e-disequazioni-con-il-valore-assoluto)."
- 72 (Radicali e loro proprietà), dopo l'esempio con $\sqrt{(x - 3)^2} = |x - 3|$ ("Per $x \ge 3$ vale $x - 3$; per $x < 3$ vale $3 - x$."): nessun cambio necessario, la definizione a tratti è la stessa di questa lezione.

## Prerequisiti

La riga della bozza, `valore-assoluto-equazioni <- numeri-interi-valore-assoluto, disequazioni-secondo-grado, sistemi-di-disequazioni`, ha un arco ridondante: `numeri-interi-valore-assoluto` è già antenata di `disequazioni-secondo-grado` (e di `sistemi-di-disequazioni`). Gli altri due archi sono tutti e due già dentro `disequazioni-secondo-grado-fratte` (riga 147: `disequazioni-secondo-grado-fratte <- disequazioni-secondo-grado, sistemi-di-disequazioni`), e gli esempi 9 e 11 usano proprio i sistemi con disequazioni di secondo grado della 89. Proposta:

```
valore-assoluto-equazioni <- disequazioni-secondo-grado-fratte
```

Se si vuole che la 20 compaia come prerequisito diretto (è la lezione linkata nella prima riga), lo script dei prerequisiti la segnalerà come ridondante; la lascerei fuori.

## Per il generatore

1. $|A(x)| = k$ con $A$ di primo grado e $k$ positivo, nullo o negativo ($|2x - 1| = 5$, $|x - 4| = 0$, $|3x + 2| = -1$). Distrattori: una sola soluzione (solo $A = k$); $\pm$ con $k$ negativo.
2. $|A(x)| = k$ con $A$ di secondo grado ($|x^2 - 5| = 4$). Distrattore: solo $\pm 3$.
3. $|A(x)| = |B(x)|$ di primo grado ($|x - 3| = |2x + 1|$). Distrattore: $\dfrac{4}{3}$ (segno cambiato a un solo termine).
4. $|A(x)| = B(x)$ con $A$ e $B$ di primo grado ($|x - 4| = 2x + 1$). Distrattore: $\{-5, 1\}$ senza condizione.
5. $|A(x)| = B(x)$ con $A$ di secondo grado ($|x^2 - 4| = 3x$). Distrattore: le quattro soluzioni $\{-4, -1, 1, 4\}$.
6. Due valori assoluti di primo grado ($|x - 1| + |x + 2| = 5$). Distrattore: una soluzione fuori dal suo intervallo.
7. $|A(x)| < k$ e $|A(x)| > k$ con $A$ di primo grado ($|2x - 3| \leq 5$, $|x + 1| > 2$). Distrattori: interni ed esterni scambiati; estremi inclusi con il verso stretto.
8. $k \leq 0$ nei sei versi ($|x - 3| < -2$, $|x - 3| > 0$, ...). Distrattori: $\emptyset$ al posto di $\mathbb{R}$ e viceversa; $\mathbb{R}$ per $|x - 3| > 0$.
9. $|A(x)| < k$ con $A$ di secondo grado ($|x^2 - 5| < 4$). Distrattore: $-3 < x < 3$ (dimenticare la prima disequazione).
10. $|A(x)| < B(x)$ e $|A(x)| > B(x)$ ($|x - 3| < 2x$, $|x^2 - 4| > 3x$). Distrattore: intersezione al posto dell'unione ($-4 < x < -1$).

Il controllo del generatore deve verificare le soluzioni sostituendole nell'equazione di partenza, con il valore assoluto, e non nelle equazioni senza sbarre.

## Domande per Andrea

- Metodo principale per $|A(x)| = B(x)$: la condizione $B(x) \geq 0$ (come ora) o i due sistemi con la definizione? Nei libri che conosco si trovano tutti e due; ho scelto la condizione perché con un argomento di secondo grado evita di risolvere le disequazioni $A(x) \geq 0$ e $A(x) < 0$.
- Per $|A(x)| < B(x)$ e $|A(x)| > B(x)$ va bene la regola senza condizione su $B(x)$, oppure preferisci far scrivere la condizione $B(x) > 0$ nel sistema, come fanno alcuni libri?
- Il simbolo $\Updownarrow$ per "equivale a" nelle formule a più righe: va bene, o preferisci la scrittura in parole?
- Serve un esempio di disequazione con due valori assoluti (studio per intervalli con i sistemi)?
- Il grafico di $y = |x|$ e di $y = |x - 2|$ basta, o vuoi anche il metodo grafico per risolvere le equazioni (intersezione tra $y = |x - 4|$ e $y = 2x + 1$)?
