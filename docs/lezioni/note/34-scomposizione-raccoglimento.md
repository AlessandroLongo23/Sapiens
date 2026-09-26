# Note: Raccoglimento totale e parziale

Lezione nuova, scritta da zero (lotto 3). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`expand` della differenza tra polinomio e scomposizione, `factor` per i casi irriducibili): i dieci esempi, gli avvisi con i controesempi, il controllo numerico con $x = 3$ e le carte con un conto.

## Scelte di convenzione

- Scomposizione in ℤ, detta in un riquadro `ad-note` all'inizio. L'unica eccezione è un riquadro `ad-note` sui coefficienti frazionari ($\frac{1}{2}x^2 - \frac{3}{4}x = \frac{1}{4}x(2x - 3)$), che si può togliere senza toccare il resto. Non l'ho messo nel formulario né nelle carte.
- Definizione di irriducibile: "non si può scrivere come prodotto di due polinomi che abbiano entrambi grado almeno 1". Con questa definizione $6x - 9$ è irriducibile, eppure si scrive $3(2x - 3)$: la lezione lo dice esplicitamente ("un numero davanti non conta... ma si raccoglie lo stesso"). Alcuni libri dicono "prodotto di polinomi di grado inferiore", che lascia ambiguo il caso del fattore numerico. Da verificare con il libro in uso; conviene che 35, 36, 37 e 38 usino la stessa definizione.
- Il fattore raccolto nel raccoglimento totale è il MCD con la convenzione della lezione 14 (coefficiente MCD dei valori assoluti, positivo). Raccogliere l'opposto del MCD è presentato come scelta di comodo quando il primo termine è negativo, e l'esempio 2 dice che anche l'altra forma è giusta.
- Lettere: il raccoglimento parziale usa l'esempio classico $ax + ay + bx + by$ e l'esempio 6 $2ax - 6a - bx + 3b$, con $a$ e $b$ come lettere del polinomio, contro la convenzione di lotto (x, y per i polinomi, a, b per le formule). L'ho tenuto perché è l'esempio di tutti i libri; se si preferisce, si cambia in $xz + xw + yz + yw$ senza altre conseguenze.
- Risultati ordinati per potenze decrescenti di $x$; l'ordine dei fattori segue quello in cui escono dal raccoglimento ($(x - 2)(x^2 - 3)$, $(x - 3)(2a - b)$).
- "Raccoglimento totale" e "raccoglimento parziale" come termini principali, con "a fattor comune" e "a gruppi" citati una volta come sinonimi dei libri, poi mai più usati.

## Lasciato ad altre lezioni

- Calcolo del MCD tra monomi: solo il riassunto di una riga e il link a MCD e MCM tra monomi.
- Divisione monomio per monomio (per i quozienti dentro la parentesi) e prodotto monomio per polinomio (per il controllo): link a Operazioni tra monomi e Operazioni tra polinomi.
- Prodotti notevoli, trinomio, Ruffini: solo i link nell'apertura. L'esempio 10 ($x^3 + x^2 + x + 2$, dove il raccoglimento parziale non funziona) dice che il polinomio è irriducibile e rimanda a Ruffini per saperlo; l'ho verificato con SymPy (nessuno zero tra $\pm 1$, $\pm 2$).
- $x^2 - 3$ (esempio 5) e $x^2 + 3$ (esempio 9) sono dichiarati irriducibili in ℤ senza dimostrazione. Per $x^2 - 3$ la lezione dice "non si scompone con coefficienti interi", che è corretto; la 35 potrebbe tornarci come esempio di falsa differenza di quadrati.
- Il controllo con il valore numerico è in un riquadro `ad-tip`; il valore numerico come tecnica è nella lezione 31 (Espressioni con polinomi), non linkata qui perché il riquadro si capisce da solo.
- Applicazioni (frazioni algebriche, equazioni): citate nell'apertura senza link, come chiede il brief di lotto per le frazioni algebriche.

## Da togliere o controllare in lezioni già scritte

- MCD e MCM tra monomi, apertura: "Ti serviranno per semplificare le frazioni con le lettere e per trovare il denominatore comune" potrebbe aggiungere il raccoglimento a fattor comune, con un link a questa lezione.
- Nessuna lezione pubblicata oggi spiega la scomposizione dei polinomi, quindi non c'è altro da togliere.

## Figura

Una sola, `raccoglimento-totale-aree`: un quadrato $x \times x$ e un rettangolo $x \times 3$ affiancati, che formano il rettangolo $x \times (x + 3)$, per $x^2 + 3x = x(x + 3)$. Colori `blue!20` e `orange!30`, niente `\clip` né riempimenti bianchi. L'ho compilata con `compileFigure` di `scripts/figure/compile.mjs` (209×128) e guardata in chiaro: etichette leggibili, freccia della base sotto il rettangolo. Non l'ho vista sul sito in tema scuro. Non è nel formulario.

## Formulario e flashcard

- Il formulario non ha la figura né il riquadro sui coefficienti frazionari.
- 19 carte. La carta `errore-dimenticare-uno` usa $4x^2 + 2x$, che non è nella lezione; la regola sì (avviso "Dimenticare l'1").

## Prerequisiti

La riga `scomposizione-raccoglimento <- polinomi-operazioni, monomi-mcm-mcd` va bene così. Il raccoglimento totale si basa sul MCD tra monomi (passo 1 del procedimento) e sul prodotto monomio per polinomio letto al contrario (il controllo); la divisione tra monomi arriva già attraverso monomi-mcm-mcd, che dipende da monomi-operazioni. Non servono i prodotti notevoli: l'unico quadrato, $(x + 1)^2$ nell'esempio 3, non si sviluppa.

## Livelli per gli esercizi

1. Raccoglimento totale con un numero o una sola lettera: $6x - 9 = 3(2x - 3)$, $x^2 + 3x = x(x + 3)$.
2. Raccoglimento totale con MCD monomio e più lettere, un termine uguale al MCD: $6x^3y - 9x^2y^2 + 3x^2y = 3x^2y(2x - 3y + 1)$.
3. Raccoglimento di un segno meno: $-4x^3 + 8x^2 - 2x = -2x(2x^2 - 4x + 1)$.
4. Raccoglimento di un polinomio, anche con parentesi opposte: $(x + 1)^2 - 3(x + 1) = (x + 1)(x - 2)$, $x(a - b) + y(b - a) = (a - b)(x - y)$.
5. Raccoglimento parziale con quattro termini, anche con il segno meno nel secondo gruppo: $x^3 - 2x^2 - 3x + 6 = (x - 2)(x^2 - 3)$.
6. Raccoglimento parziale dopo un riordino, con sei termini, o preceduto da un raccoglimento totale: $2x^3 - 4x^2 + 6x - 12 = 2(x - 2)(x^2 + 3)$.
