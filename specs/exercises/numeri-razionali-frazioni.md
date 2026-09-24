# Frazioni e numeri razionali

Generatore: `numeri-razionali-frazioni`
(`src/lib/exercises/v2/generators/numeri-razionali-frazioni.ts`). Verifica indipendente:
`scripts/exercises/checkers/numeri_razionali_frazioni.py`. Lezione collegata: "Frazioni e numeri
razionali" (`docs/lezioni/riscritte/23-numeri-razionali-frazioni.md`).

Lo studente calcola la frazione di un numero, risale dalla parte all'intero, classifica una
frazione, riconosce due frazioni equivalenti con il prodotto in croce e riduce ai minimi termini,
prima con termini positivi e poi con il segno. I livelli seguono l'ordine della lezione.

## Rappresentazione

- Livelli 1 e 2: risposta `number` (un intero). `params.fraction` è `"a/b"`; `params.number` (livello
  1) è il numero di cui si prende la frazione, `params.part` (livello 2) il valore della parte,
  `params.story` la storia.
- Livelli 3 e 4: risposta `choice`. Al livello 3 le opzioni hanno `values` `["propria"]`,
  `["impropria", "k"]` (sta tra `k` e `k + 1`) o `["apparente", "k"]` (vale `k`). Al livello 4 ogni
  opzione è una coppia `["n1/d1", "n2/d2"]`, scritta `\frac{n1}{d1} \text{ e } \frac{n2}{d2}`.
- Livelli 5 e 6: risposta `expression` con `value` `"p/q"` e `form: "irriducibile"`.
  `params.fraction` è la frazione del testo com'è scritta (`"-36/-60"`), `params.mcd` il MCD,
  `params.case` il caso di segno. Le opzioni a scelta multipla sono costruite insieme all'esercizio
  (`params.options`, `params.correct`), perché alcune valgono quanto la risposta ma non sono nella
  forma richiesta.

## Regole comuni

- Virgola decimale, `\cdot` per il prodotto, `:` per la divisione, `\text{MCD}` come nella lezione.
- Nei livelli 1-4 frazioni con termini positivi.
- Una frazione negativa nella risposta ha il meno davanti (`-\frac{3}{4}`) e il denominatore
  positivo, come nella lezione.

## Livello 1: frazione di un numero

`\frac{a}{b} \text{ di } N`, con `a/b` propria e ridotta, `a ≥ 2` (con `a = 1` l'errore "solo diviso"
darebbe la risposta giusta), `b` da 3 a 10, `N = b · m` con `m` da 2 a 15. Risultato intero.

Esempi: `\frac{2}{5}` di `35` è `14`; `\frac{3}{8}` di `40` è `15`.

## Livello 2: dalla parte all'intero

Problema a parole: i `\frac{a}{b}` di una grandezza valgono `P`; quanto vale la grandezza? `a/b`
come al livello 1, l'intero `b · m` fino a 400 (una classe ha da 12 a 32 studenti). Storie: classe,
somma di denaro, pagine di un libro, percorso in km. Nei passaggi: una parte è `P : a`, l'intero è
`(P : a) · b`, poi il controllo diretto.

Esempi: i `\frac{4}{7}` di una somma sono `48` euro, la somma è `84` euro; i `\frac{3}{5}` degli
studenti sono `15`, la classe ha `25` studenti.

## Livello 3: propria, impropria, apparente

Una frazione `n/d` con termini positivi e `d` da 2 a 12, non necessariamente ridotta. Circa 25%
proprie, 45% improprie non apparenti (`n` fino a `8d`), 30% apparenti (`n = d · k`, con `k = 1` in
circa un caso su sette). Convenzione della lezione: impropria vuol dire `n ≥ d`, quindi
`\frac{5}{5}` è impropria e apparente. Si sceglie la descrizione giusta: "propria", "impropria, tra
`k` e `k + 1`" oppure "apparente, uguale a `k`".

Esempi: `\frac{17}{5}` è impropria, tra 3 e 4 (`17 = 5 · 3 + 2`); `\frac{18}{6}` è apparente, uguale a 3.

## Livello 4: frazioni equivalenti

"Quale coppia è formata da due frazioni equivalenti?" Quattro coppie di frazioni positive non
intere; una sola ha i prodotti in croce uguali: la stessa frazione ridotta moltiplicata per due
numeri diversi (da 1 a 6). Le altre tre coppie partono ognuna da una frazione diversa.

Esempi: `\frac{3}{21}` e `\frac{6}{42}` (`3 · 42 = 126 = 21 · 6`); `\frac{8}{14}` e `\frac{16}{28}`.

## Livello 5: riduzione ai minimi termini

Una frazione positiva `A/B = (p · g)/(q · g)` con `p/q` ridotta e non intera (`q` da 2 a 15), MCD
`g` composto (almeno due fattori primi contati con la molteplicità) tra 4 e 45, termini fino a 400
e il maggiore almeno 30. Passaggi: scomposizione, MCD, divisione per il MCD in un colpo solo.

Esempi: `\frac{60}{84} = \frac{5}{7}` (MCD 12); `\frac{150}{240} = \frac{5}{8}` (MCD 30).

## Livello 6: riduzione con il segno

Come il livello 5, con il meno al numeratore, al denominatore o a entrambi, circa un terzo ciascuno,
scritto dentro la frazione (`\frac{42}{-56}`). La risposta è ridotta, con il denominatore positivo
e il segno davanti.

Esempi: `\frac{-36}{-60} = \frac{3}{5}`; `\frac{42}{-56} = -\frac{3}{4}`.

## Da evitare

- Frazione di un numero con risultato non intero; unità frazionarie al livello 1 e 2.
- Classi con un numero di studenti poco credibile.
- Più di una coppia equivalente al livello 4, o una coppia con due frazioni scritte uguali.
- MCD primo ai livelli 5 e 6 (basta una divisione e l'errore "fermarsi troppo presto" non esiste);
  riduzioni che danno un intero.

## Variante a scelta multipla

- Livello 1: solo diviso per il denominatore (`N : b`); diviso per il numeratore e moltiplicato per
  il denominatore; la parte che resta (`N` meno la risposta); solo moltiplicato (`N · a`).
- Livello 2: la frazione della parte (`\frac{a}{b}` di `P`, l'errore del riquadro della lezione);
  una parte sola (`P : a`); il resto (intero meno parte); solo moltiplicato (`P · b`).
- Livello 3: impropria scambiata con apparente (l'errore "apparente = semplificabile"), la frazione
  letta al contrario, l'intervallo sbagliato di uno, propria per `\frac{5}{5}`.
- Livello 4: lo stesso numero sommato sopra e sotto (`\frac{a}{b}` e `\frac{a+j}{b+j}`),
  numeratore e denominatore moltiplicati per numeri diversi, prodotti in croce che differiscono di
  poco.
- Livello 5: fermarsi dopo la divisione per un solo primo (frazione equivalente ma non ridotta);
  un'altra divisione parziale; il denominatore diviso per un numero diverso; la frazione capovolta.
- Livello 6: il segno sbagliato; il denominatore lasciato negativo (`\frac{3}{-4}`) o i due meno
  lasciati (`\frac{-3}{-4}`), che valgono quanto la risposta ma non sono nella forma richiesta;
  fermarsi presto con il segno giusto; i due errori insieme.

## Differenze dalla proposta delle note

Le note della lezione proponevano: frazione di un numero, classificazione, riduzione con MCD
piccolo, riduzione con MCD grande oppure equivalenza, segno, problema inverso. Qui il problema
inverso sale al livello 2, dove sta nella lezione (esempio 2); l'equivalenza con il prodotto in
croce ha un livello suo (nella proposta divideva il livello 4 con la riduzione, e sarebbero state
due difficoltà diverse); le due riduzioni diventano una sola, con MCD composto.

## Domande per la revisione

- Il livello 1 della scelta multipla "confronto tra frazioni" chiede già di riconoscere una
  frazione equivalente: con il livello 4 di qui i due esercizi si somigliano.
- Al livello 3 conviene chiedere anche `\frac{0}{b}`? La lezione non la classifica, quindi qui manca.
- Al livello 6 le opzioni `\frac{3}{-4}` hanno il valore giusto e la forma sbagliata: va bene
  contarle come errore in una pagina che oggi valuta solo il valore?
