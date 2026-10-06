# Note: Iperbole

Lezione nuova, scritta da zero (lotto del terzo anno, gruppo D, 5 ottobre 2026). Non pubblicata. Conti rifatti con SymPy nello stesso script della 118 (`gruppo-d/verifica.py`): le distanze $\frac{37}{4}$ e $\frac{13}{4}$, il passaggio al quadrato della dimostrazione, l'identità della distanza dall'asintoto e i tre valori della tabella ($1{,}33$, $0{,}61$, $0{,}06$), le tre risolventi dell'esempio 4, il discriminante in funzione di $q$, la risolvente di primo grado dell'esempio 5, lo sdoppiamento dell'esempio 6, la risolvente e $\frac{\Delta}{4}$ dell'esempio 7 con $m = -2$ e $m = 1$, il punto $T_2(-5, -4)$, i sistemi degli esempi 8 e 9. `check.mts` passa sui tre file senza errori né avvisi.

## Scelte

- Fuochi sull'asse $y$: equazione $\frac{x^2}{a^2} - \frac{y^2}{b^2} = -1$, con $a$ sempre sotto $x^2$. Così gli asintoti sono $y = \pm\frac{b}{a}x$ nei due casi, e il semiasse trasverso è $b$. L'altra convenzione ($\frac{y^2}{a^2} - \frac{x^2}{b^2} = 1$, con asintoti $y = \pm\frac{a}{b}x$) è nominata solo come scrittura equivalente.
- Nomi: "vertici reali", "vertici non reali" (senza grassetto, detti una volta), "asse trasverso" e "asse non trasverso".
- Asintoti senza limiti: la distanza in verticale tra retta e ramo è $\frac{ab}{x + \sqrt{x^2 - a^2}}$, con una tabella di tre valori. La lezione dice che la definizione precisa usa i limiti del quinto anno.
- La dimostrazione dell'equazione canonica riporta solo i passaggi dopo il primo quadrato e rimanda alla 118 per gli altri.
- Lo sdoppiamento è enunciato senza dimostrazione (quella breve della 118 non vale per l'iperbole, per via delle rette parallele agli asintoti), e controllato nell'esempio 6 sulla retta che nell'esempio 4 aveva $\Delta = 0$.
- Le rette parallele a un asintoto hanno una sezione, un esempio e un avviso: è l'errore più frequente sulla regola "un punto solo, quindi tangente".
- Per le tangenti da un punto la lezione non parla di punto "esterno": dice che possono essere due, una o nessuna, e fa un esempio con due tangenti che toccano rami diversi.
- Coordinate con la virgola (correzione al brief), punto e virgola solo nei blocchi `grafico`.

## Lasciato fuori

- L'iperbole traslata, le direttrici, le iperboli coniugate come termine (la lezione dice solo che le due iperboli con gli stessi $a$ e $b$ hanno gli stessi asintoti).
- L'iperbole equilatera: una frase finale con il link alla 120.

## Dubbi per Andrea

1. Fuochi sull'asse $y$: va bene $\frac{x^2}{a^2} - \frac{y^2}{b^2} = -1$, o il libro in uso scrive $\frac{y^2}{a^2} - \frac{x^2}{b^2} = 1$? Cambia la formula degli asintoti e quella dell'eccentricità.
2. "Asse trasverso" e "asse non trasverso", "vertici reali" e "non reali": sono i nomi che vuoi?
3. Per una retta che non incontra l'iperbole va bene "esterna", anche quando passa tra i due rami?
4. La giustificazione degli asintoti con la distanza in verticale è sufficiente, o preferisci solo l'enunciato?

## Da verificare

- I due blocchi `grafico` sono stati visti nel browser il 5 ottobre 2026 (Chromium a 420 px, tema chiaro): la `scelta` su tutte e due le voci ($= -1$ e $= 1$, scritte bene dal controllo a segmenti) con $a$ e $b$ agli estremi, e la retta con $q = 6$, $4$, $0$, $-8$, $8$. Funzionano. La voce $= -1$ è la prima, perché la copertina è la figura dell'esempio 3. I due blocchi ora stanno dentro i riquadri degli esempi, dopo la figura. Non visti in scuro né su un telefono vero.
- Figure guardate nelle anteprime, in chiaro e in scuro, e nella pagina di prova in chiaro.
- Larghezza delle formule in evidenza non misurata.
- Nomi e notazioni confrontati con le lezioni 115 e 117 del gruppo C: coincidono.

## Figure

Sei, in TikZ, con i rami disegnati in forma parametrica rispetto a $y$ (o a $x$ per i fuochi sull'asse $y$), per avere i vertici arrotondati. Coordinate controllate: fuochi $(\pm 5, 0)$ e asintoti di pendenza $\frac{4}{3}$ per $a = 3$, $b = 4$; rettangolo $(\pm 3, \pm 4)$; per i fuochi sull'asse $y$ asintoti di pendenza $\frac{3}{4}$ e rettangolo $(\pm 4, \pm 3)$; semiasse $2{,}236$ per $a^2 = 5$; le rette per due punti ciascuna; i punti $(\frac{5}{2}, 1)$, $(5, -4)$, $(\frac{5}{2}, -1)$, $(-5, -4)$ e $(\frac{15}{4}, 3)$ controllati sull'equazione con SymPy.

- `iperbole-luogo-differenza-distanze`, `iperbole-vertici-fuochi-asintoti` (copiata nel formulario), `iperbole-fuochi-asse-y`, `iperbole-rette-secante-tangente-esterna`, `iperbole-retta-parallela-asintoto`, `iperbole-tangenti-da-un-punto`.
- Blocchi `grafico`: `iperbole-semiassi-cursori`, `iperbole-fascio-rette-parallele`.

## Formulario e flashcard

- Il formulario riunisce in una tabella i due casi (compresa l'eccentricità) e copia la figura del rettangolo con gli asintoti.
- 19 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Quattro piani, ognuno dopo una figura che fa da copertina e seguito dal testo con la risposta. Visti su `/prova-grafico/lezione` con Chromium a 390 px, in chiaro, ai valori iniziali, agli estremi e nei casi limite.

- `iperbole-semiassi-cursori` (esempio 3), cambiato: aggiunto il valore $\frac{b}{a}$ e, nella domanda, il caso $a = b$ (asintoti perpendicolari).
- `iperbole-eccentricita-cursore` (sezione "L'eccentricità"), nuovo, con la figura nuova `iperboli-eccentricita` (tre iperboli con gli stessi vertici ed $e = \frac{5}{4}, \frac{5}{3}, 3$): $a = 3$ fermo, cursore $c$ da $3{,}1$ a $9$, fuochi e asintoti. L'intervallo evita $c = 3$, dove l'equazione non ha senso.
- `iperbole-fascio-rette-parallele` (esempio 4): domanda riscritta, risposta nel testo ($q = \pm 4$, esterna tra i due).
- `iperbole-parallela-asintoto-cursore` (esempio 5), nuovo: la retta $y = \frac{4}{3}x + q$ parallela all'asintoto, con l'ascissa del punto comune scritta sotto. Per $q$ vicino a $0$ il punto scappa lontano; per $q = 0$ il valore è "non esiste".

La figura `iperboli-eccentricita` è stata guardata in anteprima, in chiaro e in scuro. La lezione è arrivata a 29.900 caratteri, al limite dei 30.000.

Scartati: il fascio per $P(1, 2)$ con il cursore $m$ (sarebbe il quinto piano e ripete quello della 118; in più tra le rette del fascio ci sono le due parallele agli asintoti, che chiedono una spiegazione a parte); un piano per il luogo geometrico (servirebbe un punto da trascinare).

Prerequisiti proposti: ellisse, il-piano-cartesiano, sistemi-secondo-grado, retta-fasci
