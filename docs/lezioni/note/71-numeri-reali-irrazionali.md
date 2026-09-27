# Note: Numeri irrazionali e numeri reali

Lezione nuova, scritta da zero (lotto 7). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`scratchpad/71-verifica.py`): i quadrati dei decimali ($1{,}4^2$, $1{,}41^2$, $1{,}414^2$, $2{,}64^2$, $2{,}65^2$ e gli altri), lo sviluppo di $(2k + 1)^2$, le sei radici dell'esempio 1, le cifre di $\sqrt{2}$, $\sqrt{3}$, $\sqrt{5}$, $\sqrt{7}$ e $\pi$, $0{,}\overline{27} = \frac{3}{11}$, $3{,}14 = \frac{157}{50}$, il periodo di sedici cifre di $\frac{1}{17}$, l'ordine dell'esempio 5, il confronto $\sqrt{2} + \sqrt{3} - \pi \approx 0{,}0047$ dell'esempio 6 e i quattro conti dell'esempio 7.

## Scelte di convenzione

- La radice quadrata si definisce in una frase all'inizio ("il numero non negativo che elevato al quadrato dà $a$"), con il link alla 72: la lezione ne ha bisogno per nominare $\sqrt{2}$, ma indice, radicando e proprietà restano alla 72. L'unica regola di calcolo usata è $\sqrt{a} \cdot \sqrt{a} = a$, che viene dalla definizione.
- Nessuna lettera sotto radice: la convenzione del lotto sulle lettere (72-76) qui non entra in gioco.
- Irrazionali indicati come $\mathbb{R} \setminus \mathbb{Q}$, con la notazione della lezione 64. Alcuni libri usano un simbolo apposito (per esempio $\mathbb{I}$): da verificare con il libro in uso, non l'ho introdotto.
- Approssimazioni "per difetto" e "per eccesso", "al decimo / al centesimo" e "a meno di $0{,}1$". Per i negativi la lezione segue la definizione (per difetto = minore), quindi l'approssimazione per difetto di $-\sqrt{7}$ è $-2{,}65$. Alcuni libri definiscono le approssimazioni solo per i positivi: da verificare. Arrotondamento e troncamento non sono nominati (tranne "togliere le cifre" nell'avviso sui negativi).
- La completezza della retta è detta come fatto ("a ogni punto corrisponde un reale e viceversa"), senza assiomi né classi contigue. Le classi contigue e la densità di $\mathbb{Q}$ in $\mathbb{R}$ sono fuori (la densità di $\mathbb{Q}$ è nella 23, citata tra parentesi).
- La data della dimostrazione di Lambert (1761, pubblicata nel 1768) è da verificare come dicitura; la frase si può togliere senza conseguenze.
- La regola "la radice di una frazione ridotta è razionale solo se numeratore e denominatore sono quadrati perfetti" è enunciata senza dimostrazione, come la generalizzazione a $\sqrt{n}$. È vera (se $\sqrt{a/b} = p/q$ ridotte, allora $aq^2 = bp^2$ e quindi $a = p^2$, $b = q^2$).
- Nel confronto tra radici la lezione usa "tra due positivi è maggiore quello con il quadrato maggiore" senza dimostrarlo.

## Lasciato ad altre lezioni

- Radicali, indice, radicando, proprietà, $\sqrt{8} = 2\sqrt{2}$: 72 e 73 (link alla fine e all'inizio).
- Prodotti notevoli: l'esempio 7 fa i conti con la proprietà distributiva e cita il prodotto notevole con un link alla 30, senza richiederlo.
- Pitagora usato senza link, come dice il brief.
- $\sqrt{x^2} = |x|$, radici di numeri negativi: solo una frase ("nessun reale al quadrato dà $-4$"), coerente con la 17.

## Figure

Quattro, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro (PNG in `scratchpad/71-fig*.svg.png`). Il PNG del tema scuro prodotto dal mio script con il filtro sul `body` è venuto vuoto o tagliato per tutte le figure (è un problema dello screenshot, non delle figure): in scuro vanno guardate sul sito. I colori sono quelli delle altre lezioni (`blue!10`, `blue!60`), niente bianchi né `\clip`.
- `diagonale-quadrato-lato-1` (110×114): quadrato di lato 1 con la diagonale $d$ e l'angolo retto segnato.
- `insiemi-numerici-n-z-q-r` (301×158): la figura della 23 estesa con $\mathbb{R}$; etichette in `\mathbf` perché il motore non compila `\mathbb`. Sta fuori dai riquadri.
- `costruzione-radice-2-retta` (231×84): quadrato sul segmento $[0, 1]$, diagonale e arco fino a $\sqrt{2}$.
- `costruzione-radice-5-retta` (158×66), dentro l'esempio 3: rettangolo $2 \times 1$ e arco fino a $\sqrt{5}$.

## Formulario e flashcard

- Il formulario non ha figure; tre avvisi (π, quadrati dei negativi, due irrazionali).
- 20 carte, nell'ordine della lezione. Tutte usano numeri che compaiono nella lezione.

## Prerequisiti

La riga della bozza `numeri-reali-irrazionali <- numeri-razionali-conversione, logica-implicazione` è quasi giusta, ma aggiungerei `numeri-razionali-potenze`:

```
numeri-reali-irrazionali <- numeri-razionali-conversione, numeri-razionali-potenze, logica-implicazione
```

La lezione eleva continuamente al quadrato frazioni e decimali: la dimostrazione passa da $\left(\frac{a}{b}\right)^2 = \frac{a^2}{b^2}$, l'esempio 1 da $\left(\frac{2}{3}\right)^2 = \frac{4}{9}$, le approssimazioni da $2{,}64^2$. Oggi Potenze in ℚ (09) non è antenata né della 11 né della 66, quindi l'arco non è ridondante. La 11 serve (decimali limitati, periodici, frazione generatrice) e la 66 anche (dimostrazione per assurdo e per contronominale).

Due conseguenze sulle righe degli altri, da controllare con lo script:
- `numeri-reali-radici <- numeri-reali-irrazionali, numeri-interi-valore-assoluto`: l'arco verso la 20 è già ridondante con la bozza di oggi, perché la 20 è antenata della 11 (11 ← 23 ← 21 ← 20). Lo segnalerà lo script; la 72 può tenere solo `numeri-reali-irrazionali`.
- Se si aggiunge la 09 alla mia riga, in `radicali-esponente-razionale <- numeri-reali-radici, numeri-razionali-potenze` l'arco verso la 09 diventa ridondante (ci si arriva da 72 ← 71 ← 09). Si può togliere, anche se per il ripasso quel collegamento conta.

## Per il generatore

1. Razionale o irrazionale: radici quadrate di naturali, di frazioni (anche non ridotte, come $\sqrt{\frac{8}{18}}$) e di decimali ($\sqrt{0{,}49}$), e decimali limitati, periodici o costruiti in modo non periodico.
2. Approssimazioni per difetto e per eccesso di $\sqrt{n}$ all'unità, al decimo e al centesimo, con i quadrati; anche di $-\sqrt{n}$.
3. Confronto tra due numeri: due radici, una radice e un intero o un decimale ($\sqrt{10}$ e $3$, $\sqrt{2}$ e $1{,}4\overline{1}$), anche con i segni negativi.
4. Mettere in ordine quattro o cinque numeri tra radici, frazioni, decimali periodici e $\pi$.
5. Operazioni: stabilire se il risultato di una somma o di un prodotto con radici è razionale, con conti del tipo $(a + \sqrt{b})(a - \sqrt{b})$, $\sqrt{b}(\sqrt{b} + c)$, $(a + \sqrt{b})^2$.
