# Note: Incertezza relativa e propagazione delle incertezze

Lezione nuova, primo lotto di fisica, gruppo 2. Numeri rifatti in `g2/verifica.py`: incertezze relative del pendolo e
del foglio ($0{,}0048$ tutte e due), i due tavoli, il perimetro ($101{,}4$), le relative del volume per differenza
($2{,}9\%$, $2{,}1\%$, $17\%$), l'area del foglio con le relative a tre cifre ($0{,}00337 + 0{,}00476 = 0{,}00813$,
$\Delta A = 5{,}07$) e il caso peggiore ($628{,}78$ e $618{,}64$, metà differenza $5{,}07$), la velocità del corridore
($8$ m/s, $\varepsilon = 0{,}021$, $\Delta v = 0{,}168$), il cubetto ($V = 27{,}0$, $\varepsilon_V = 0{,}10$,
$\rho = 2{,}70$, $\Delta\rho = 0{,}27$). `check.mts` senza avvisi.

## Regole fissate (per tutte le lezioni di fisica)

| Operazione | Incertezza del risultato |
|---|---|
| $a + b$, $a - b$ | $\Delta a + \Delta b$ |
| $k \cdot a$, $k$ esatto | $k \cdot \Delta a$ |
| $a \cdot b$, $a / b$ | $\varepsilon_a + \varepsilon_b$ |
| $a^n$ | $n \cdot \varepsilon_a$ |

Incertezza relativa $\varepsilon = \Delta x / \bar{x}$, numero puro; percentuale con una o due cifre significative. Il
risultato finale si arrotonda con le regole della lezione 06 (incertezza a una cifra, valore alla stessa posizione);
nei passaggi si tengono una o due cifre in più.

## Struttura ed esempi

Incertezza relativa (definizione, percentuale, confronto di precisione, ritorno all'assoluta), somme e differenze
(spiegate con il caso peggiore), numero esatto (il periodo da dieci oscillazioni), prodotti e quozienti (spiegati con
il rettangolo e le strisce, figura statica e interattiva), potenze, riepilogo, `ad-note` sulla somma in quadratura.

Sei esempi: quale misura è più precisa; il perimetro di un foglio; il volume per differenza (l'incertezza relativa
che esplode); l'area del foglio con il controllo del caso peggiore; la velocità del corridore (quale dato pesa di
più); la densità di un cubetto, compatibile con l'alluminio (potenza più quoziente). Avvisi: il rapporto rovesciato,
nelle differenze le incertezze non si sottraggono, nei prodotti non si sommano le assolute né si moltiplicano,
l'esponente moltiplica l'incertezza relativa.

Un fatto che la lezione usa: nel rettangolo la regola $b\,\Delta a + a\,\Delta b$ è esattamente metà della
differenza tra il rettangolo più grande e il più piccolo (il quadratino $\Delta a\,\Delta b$ si aggiunge da una parte
e si toglie dall'altra). Per questo il controllo dell'esempio 4 dà lo stesso numero, $5{,}07$.

## Scelte e dubbi

- Propagazione "nel caso peggiore" (somma delle incertezze), come i libri del biennio. La somma in quadratura della
  Guida all'espressione dell'incertezza di misura (JCGM 100:2008, GUM) è citata solo nell'`ad-note`.
- La regola del quoziente è data senza dimostrazione ("qui non la dimostriamo"); quella del prodotto con le strisce
  del rettangolo. Una dimostrazione del quoziente con i casi estremi c'è in alcuni libri: da valutare se serve.
- Il simbolo $\varepsilon$ per l'incertezza relativa (alcuni libri scrivono $e_r$, $\Delta x / x$ o $\delta x$).
- La densità in $\text{g/cm}^3$ e il volume in mL con $1\ \text{mL} = 1\ \text{cm}^3$, come nella lezione 09.
- Nell'esempio 6 il volume si scrive $(27 \pm 3)\ \text{cm}^3$ ma nel quoziente si usa $27{,}0$: la lezione lo fa senza
  commentarlo; la regola "si arrotonda solo alla fine" è detta nell'esempio 4.

## Figure

- `rettangolo-incertezza-area` (TikZ, 291 px): il rettangolo $a \times b$ con le due strisce arancioni e il quadratino
  grigio d'angolo.
- `rettangolo-lati-incerti` (interattiva, `src/components/content/interactive/fisica/RettangoloIncerto.tsx`): cursori
  per $a$, $b$, $\Delta a$, $\Delta b$ (disegnati a $0{,}6$ della loro misura); rettangoli più grande e più piccolo
  tratteggiati; sotto, $A_{\max} - A$, $A - A_{\min}$, la regola $b\,\Delta a + a\,\Delta b$ (la loro media) e le
  incertezze relative. Guardata in chiaro, in scuro e a 390 px.

## Lasciato ad altre lezioni

- Densità come grandezza: lezione 03 (Grandezze derivate), linkata.
- Cifre significative come stima rapida della propagazione: lezione 08.

## Per il generatore

`specs/exercises/fis-incertezza-relativa.md`, sei livelli: incertezza relativa, dalla relativa all'assoluta, somme e
differenze, prodotti e quozienti, potenze e numeri esatti, formule con più passaggi.

## Domande per Andrea

- Propagazione con la somma delle incertezze (caso peggiore) in tutto il biennio, e la quadratura solo come cenno?
- Simbolo dell'incertezza relativa: $\varepsilon$, $e_r$ o $\dfrac{\Delta x}{x}$?
- La regola del quoziente va dimostrata, o basta darla con quella del prodotto?
- Negli esercizi i risultati sono costruiti perché l'arrotondamento non dipenda dalle cifre intermedie. Negli
  esercizi dei libri non è così: volete che la lezione dica esplicitamente quante cifre tenere nei passaggi
  (qui "una o due in più")?
