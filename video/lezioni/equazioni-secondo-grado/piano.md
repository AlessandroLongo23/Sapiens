# Equazioni di secondo grado: piano sequenza delle clip

Fonte: `docs/lezioni/pubblicate/17-equazioni-secondo-grado.md`. Ogni clip segue la lezione pubblicata: stessi esempi, stessi numeri, stessi errori frequenti, stesse parole quando si può. Formato 16:9, 1920x1080, voce in seconda persona come la lezione. Durata di ciascuna tra 1 e 2 minuti.

Regole comuni:
- Si apre con l'intestazione (etichetta in monospazio rosso matematica con lezione e numero della clip, titolo in Fraunces, tratto di penna rossa).
- Ogni passaggio di calcolo compare quando la voce lo dice (bookmark), mai prima.
- Penna rossa per ciò che il correttore segna: cerchio sul risultato, barra sull'errore, spunta sul giusto. Evidenziatore giallo per la regola da ricordare. Matita per le note a margine.
- Una sola idea sullo schermo alla volta: il blocco precedente si toglie o si rimpicciolisce in alto prima del nuovo.
- I simboli nel copione sono scritti a parole ("x al quadrato", "più o meno", "radice di"), perché la voce li legga bene.

## Clip 1. Pura e spuria, senza formula

| # | Cosa si vede | Voce |
|---|---|---|
| 1 | Intestazione. Sul foglio si disegna un quadrato di 7 x 7 quadretti, con "x" sul lato e "49 cm²" dentro. | Un quadrato ha l'area di quarantanove centimetri quadrati. Quanto misura il lato? |
| 2 | Accanto si scrive x² = 49, poi x = ±7. La penna barra −7 e cerchia 7. | Se chiami x il lato, devi risolvere x al quadrato uguale a quarantanove. I numeri che al quadrato danno quarantanove sono due, sette e meno sette; ma una lunghezza non può essere negativa, quindi il lato misura sette. |
| 3 | Si pulisce. Forma normale ax² + bx + c = 0, a ≠ 0, nel riquadro. Sotto, due schede: "pura" con ax² + c = 0 (manca bx) e "spuria" con ax² + bx = 0 (manca c). | Le equazioni in cui l'incognita compare al quadrato sono di secondo grado, e in forma normale si scrivono così. Se manca il termine in x o il termine noto, l'equazione è incompleta, e si risolve senza formula. |
| 4 | Pura: 4x² − 49 = 0, poi 4x² = 49, x² = 49/4, x = ±√(49/4) = ±7/2. Evidenziatore su ±. | Nella pura porti il termine noto a destra e dividi per a. Poi le soluzioni sono due, opposte: più o meno sette mezzi. |
| 5 | Pura senza soluzioni: 2x² + 8 = 0, x² = −4, S = ∅ cerchiato. Nota a matita: "nessun quadrato è negativo". | Attenzione al segno: in due x al quadrato più otto uguale a zero, x al quadrato viene meno quattro. Nessun numero reale ha il quadrato negativo, quindi non ci sono soluzioni. |
| 6 | Spuria: 2x² − 6x = 0, poi 2x(x − 3) = 0, poi x = 0 oppure x = 3, S = {0, 3} cerchiato. | Nella spuria raccogli x. Un prodotto vale zero se almeno un fattore vale zero: quindi x uguale a zero, oppure x uguale a tre. |
| 7 | Errore frequente: 2x − 6 = 0 barrato in rosso, nota a matita "hai perso x = 0". | Non dividere per x: così perdi la soluzione zero. Raccogli, sempre. |
| 8 | Riepilogo in due righe: pura, ricavi x²; spuria, raccogli x. | Pura: ricavi x al quadrato. Spuria: raccogli x. Per le equazioni complete serve la formula, ed è la prossima clip. |

## Clip 2. La formula risolutiva

| # | Cosa si vede | Voce |
|---|---|---|
| 1 | Intestazione. 3x² − x − 2 = 0; sotto, a = 3, b = −1, c = −2, con la penna che cerchia "−x" e "−2". | Prima di usare la formula devi leggere i coefficienti, e il segno fa parte del coefficiente. In tre x al quadrato meno x meno due, a è tre, b è meno uno, c è meno due. |
| 2 | Δ = b² − 4ac, con l'evidenziatore. | Poi calcoli il discriminante, delta, che è b al quadrato meno quattro a c. |
| 3 | La formula x₁,₂ = (−b ± √Δ)/2a nel riquadro. Nota a matita su ±: "due conti". | Le soluzioni sono meno b più o meno radice di delta, tutto diviso due a. Il più o meno vuol dire due conti: se a è positivo, con il meno trovi la soluzione più piccola e con il più la più grande. |
| 4 | Esempio: x² − 5x + 6 = 0, a = 1, b = −5, c = 6. | Proviamo con x al quadrato meno cinque x più sei. |
| 5 | Δ = (−5)² − 4·1·6 = 25 − 24 = 1, riga per riga. | Delta è meno cinque al quadrato, cioè venticinque, meno ventiquattro: uno. |
| 6 | x₁,₂ = (5 ± 1)/2, poi x₁ = 4/2 = 2, x₂ = 6/2 = 3, S = {2, 3} cerchiato. | Nella formula meno b diventa cinque. Cinque meno uno, diviso due, fa due; cinque più uno, diviso due, fa tre. |
| 7 | Errore frequente: −5² = −25 barrato, (−5)² = 25 con la spunta. Nota: "b tra parentesi". | Attento: se scrivi meno cinque al quadrato senza parentesi, l'esponente va solo sul cinque e ottieni meno venticinque. Quando b è negativo, mettilo sempre tra parentesi. |
| 8 | Resta la formula nel riquadro. | Il segno di delta dice anche quante soluzioni ci sono, prima ancora della formula: è la prossima clip. |

## Clip 3. Due, una o nessuna: il discriminante

Tre colonne che si costruiscono una alla volta; quelle già fatte restano, un po' più chiare.

| # | Cosa si vede | Voce |
|---|---|---|
| 1 | Intestazione. Δ = b² − 4ac in alto, con l'evidenziatore. | Il segno del discriminante ti dice quante soluzioni ha l'equazione, prima ancora di usare la formula. |
| 2 | Colonna 1, Δ > 0: x² − 5x + 6 = 0, Δ = 1. Piccolo grafico della parabola che taglia l'asse x in 2 e 3, i punti in rosso. "due soluzioni". | Se delta è positivo, le soluzioni sono due e distinte. Per x al quadrato meno cinque x più sei, delta è uno, e le soluzioni sono due e tre: sono i punti dove la parabola taglia l'asse x. |
| 3 | Colonna 2, Δ = 0: 4x² − 12x + 9 = 0, Δ = 144 − 144 = 0. Parabola che tocca l'asse in 3/2. "una soluzione doppia". | Se delta è zero, la radice vale zero e i due conti danno lo stesso numero. Per quattro x al quadrato meno dodici x più nove, la soluzione è tre mezzi, doppia: la parabola tocca l'asse in un punto solo. |
| 4 | Colonna 3, Δ < 0: 2x² − 4x + 5 = 0, Δ = 16 − 40 = −24. Parabola tutta sopra l'asse. S = ∅. | Se delta è negativo, la radice di un numero negativo non esiste tra i reali: nessuna soluzione. Per due x al quadrato meno quattro x più cinque, delta è meno ventiquattro, e la parabola non incontra l'asse. |
| 5 | Le tre colonne insieme; la penna cerchia "Δ < 0" e la nota a matita dice "hai già finito". | Per questo delta si calcola per primo: se è negativo, hai già finito. |

## Clip 4. Soluzioni con la radice

| # | Cosa si vede | Voce |
|---|---|---|
| 1 | Intestazione. x² − 8x − 2 = 0. | Quando delta non è un quadrato perfetto, le soluzioni sono irrazionali, e si lasciano scritte con la radice. Prendi x al quadrato meno otto x meno due. |
| 2 | Δ = (−8)² − 4·1·(−2) = 64 + 8 = 72, riga per riga; evidenziatore su "+ 8". | Delta è sessantaquattro meno quattro per uno per meno due. Meno per meno fa più: sessantaquattro più otto, settantadue. |
| 3 | √72 = √(36·2) = 6√2, con 36 cerchiato. | Settantadue non è un quadrato perfetto, ma contiene trentasei, che lo è. Radice di settantadue è sei radice di due. |
| 4 | x₁,₂ = (8 ± 6√2)/2; frecce rosse dal 2 del denominatore verso 8 e verso 6; poi 4 ± 3√2. | Ora dividi per due tutti e tre i numeri: l'otto, il sei davanti alla radice e il due sotto. Resta quattro più o meno tre radice di due. |
| 5 | Errore frequente: 4 ± 6√2 barrato. Nota a matita: "dividi tutti e tre". | L'errore più comune è dividere solo l'otto: quattro più o meno sei radice di due è sbagliato. |
| 6 | x₁ = 4 − 3√2, x₂ = 4 + 3√2, cerchiati. | Le soluzioni sono quattro meno tre radice di due e quattro più tre radice di due. Con la formula ridotta arrivi allo stesso risultato con meno conti: la trovi nella lezione. |
