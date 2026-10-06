# Note: Trasformazioni dei grafici

Lezione nuova (lotto del terzo anno, gruppo A, 5 ottobre 2026). Con SymPy (`gruppo-a/verifica.py` nello scratchpad) sono stati rifatti zeri e intersezioni degli esempi 1, 4 e 6, il completamento del quadrato dell'esempio 2, zeri e punti di $x^3 - 3x$, di $f(2x)$ e di $f\big(\frac{x}{2}\big)$ usati nelle due figure delle dilatazioni, i punti dell'esempio 5. I punti dell'esempio 3 sono conti a mente, ricontrollati a mano.

## Scelte

- Confine con la 104: lì le trasformazioni del piano con le loro equazioni; qui solo l'effetto sul grafico di una funzione, detto con "il punto $(x_0, y_0)$ va in". Non si ricavano le equazioni sostituendo $x'$ e $y'$.
- Una regola sola in apertura (fuori da $f$: verticale e nel verso atteso; dentro $f$: orizzontale e al contrario), ripresa in ogni sezione.
- $y = f(x - a) + b$ come traslazione di vettore $\vec{v}(a, b)$, con la notazione della 104.
- Dilatazioni solo con $k > 0$; il caso $k < 0$ è detto in una frase (dilatazione più simmetria). "Dilatazione orizzontale di fattore $\frac{1}{k}$" per $f(kx)$.
- Le due figure delle dilatazioni usano $f(x) = x^3 - 3x$, perché con una parabola $k f(x)$ e $f(kx)$ danno la stessa famiglia di curve: un `ad-note` lo dice. I punti più alti e più bassi delle gobbe sono chiamati "cime" e "gobbe", non massimi e minimi.
- $y = x^2 - 4x + 3$ come traslazione di $y = x^2$ con il completamento del quadrato (la 87 non dà la forma $a(x - h)^2 + k$). La funzione omografica è solo nominata, con il link alla 120.
- Collegamenti in avanti alle lezioni 121 e 125 e indietro alle 106 e 108.
- Coordinate con la virgola, come nelle lezioni 80-87 (correzione di chi coordina al brief). Dentro i blocchi `grafico` resta il punto e virgola, che è la sintassi del plotter.

## Domande per Andrea

- Ordine delle trasformazioni composte: la lezione dice "prima quello che succede alla $x$, poi quello che succede al risultato, moltiplicazioni prima delle addizioni", e per $f(2x - 4)$ fa raccogliere il $2$. È il procedimento che insegni, o preferisci l'altro ordine (prima la traslazione di $4$, poi la contrazione)?
- Nomi: "dilatazione" per $k > 1$ e "contrazione" per $0 < k < 1$, e nella tabella sempre "dilatazione di fattore $k$". Il libro in uso usa questi nomi o "stiramento" e "compressione"?
- Completamento del quadrato nell'esempio 2: gli studenti lo conoscono dal biennio (la 17 lo usa per la formula risolutiva), o qui va spiegato con più passaggi?
- $f(kx)$ e $k f(x)$ sono mostrati su $x^3 - 3x$, una cubica che gli studenti non hanno mai disegnato. Va bene come "funzione qualsiasi", o è meglio una spezzata data per punti?

## Da verificare

- Figure guardate in anteprima, in chiaro e in scuro, non sul sito pubblicato. Le tre figure ritoccate per ultime (`valore-assoluto-traslato`, `dilatazione-verticale-grafico`, `dilatazione-orizzontale-grafico`) sono state riguardate anche in chiaro; l'etichetta "$f(2x)$" della terza è stata spostata sopra la sua curva.
- I tre blocchi `grafico` sono stati aperti sulla pagina di prova con i cursori ai due estremi: disegnano bene. Nessuno provato sul telefono.
- Nel terzo blocco il valore sotto il piano si chiama $x_0$ ed è $\frac{\sqrt{3}}{k}$: la domanda lo spiega, ma il nome è lo stesso usato nel testo per un punto generico.

## Figure

Sette TikZ: `traslazione-grafico-radice` (copertina), `valore-assoluto-traslato`, `simmetrie-grafico-radice`, `dilatazione-verticale-grafico` (copertina), `dilatazione-orizzontale-grafico` (copertina), `valore-assoluto-fuori-e-dentro`, `composizione-trasformazioni-radice`. Tre blocchi `grafico`: `traslazione-radice-cursori`, `dilatazione-verticale-cursore`, `dilatazione-orizzontale-cursore`.

## Formulario e flashcard

Formulario senza figure, con la tabella riassuntiva della lezione più la riga della traslazione di vettore. 20 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Quattro piani.
- `traslazione-radice-cursori`, `dilatazione-verticale-cursore`, `dilatazione-orizzontale-cursore` (c'erano già): aggiunto dopo ognuno il paragrafo con la risposta. Nel secondo la domanda nomina $k = 0$ (il grafico si schiaccia sull'asse $x$); nel terzo il cursore parte da $0{,}2$ e il testo dice perché non arriva a zero.
- `valore-assoluto-fuori-e-dentro-cursore` (esempio 4, nuovo, copertina la figura a due riquadri): la parabola $y = x^2 - 2x - c$ tratteggiata e, a scelta, $|f(x)|$ oppure $f(|x|)$, con $y_V = -1 - c$ sotto il piano. Caso limite $c = -1$: da lì in giù il valore assoluto fuori non cambia niente. È l'unico piano del gruppo che usa `scelta`.

Scartati: le simmetrie (non hanno un parametro); l'ordine delle trasformazioni, $2\sqrt{x} + q$ contro $2(\sqrt{x} + q)$ (servirebbe una figura nuova per un avviso che il conto spiega in una riga, e sarebbe il quinto piano).

Prerequisiti proposti: funzioni-reali-di-variabile-reale, trasformazioni-geometriche, funzioni-dispari-pari, valore-assoluto-equazioni
