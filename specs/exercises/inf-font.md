# Caratteri tipografici e font

Generatore: `inf-font` (`src/lib/exercises/v2/generators/inf-font.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_font.py`. Lezione collegata: `docs/lezioni/informatica/riscritte/86-inf-font.md`.

Cinque livelli nell'ordine della lezione, tutti a scelta multipla. I campioni sono in testo semplice
(`format: 'text'`); le regole CSS e le righe di codice stanno in `listing`, sotto la domanda.

## Nomi dei livelli

1. Carattere, glifo o font
2. Un font bitmap
3. Le famiglie di caratteri
4. Corpo e interlinea
5. Quale font usa il browser

## Livello 1: carattere, glifo o font

Una situazione, con una lettera maiuscola che cambia da un esercizio all'altro, e la domanda su che cosa è la cosa di
cui si parla. Le situazioni sono undici: tre sul carattere (quello che ha un codice, che viaggia in un messaggio,
che resta quando si copia e si incolla), tre sul glifo (due disegni della stessa lettera, i punti di un contorno, la
griglia di pixel), due sul font (il file con i disegni), due sulla famiglia (il nome nel menu, con le sue varianti),
una sul corpo. Le opzioni sono quattro tra: un carattere, un glifo, un font, una famiglia di caratteri, il corpo.

Esempio: "La R con i trattini alle estremità e la R tutta dritta hanno lo stesso codice. Che cosa sono, l'una
rispetto all'altra, due disegni diversi della stessa lettera?" Un glifo.

## Livello 2: un font bitmap

Glifi di 8 × 8, 8 × 16, 12 × 24, 16 × 16, 16 × 24, 16 × 32, 24 × 24, 24 × 48, 32 × 32 o 32 × 64 pixel, a 1 bit per
pixel.

- `glifo` (20%): i byte di un glifo, larghezza per altezza diviso 8.
- `font` (50%): i byte di tutti i glifi, che sono 26, 52, 62, 95, 96, 100, 128, 200 o 256.
- `ingrandito` (30%): la lettera è mostrata alta $k$ volte il suo disegno ($k$ tra 2, 3, 4, 5, 6, 8); si chiede
  quanti pixel dello schermo occupa ogni pixel del disegno, cioè $k^2$.

Esempio: 95 glifi di 8 × 16: $95 \cdot 128 : 8 = 1520$ B.

Distrattori: i bit non divisi per 8, un solo glifo, la somma dei lati, la metà; per `ingrandito` $k$, $2k$, l'altezza.

## Livello 3: le famiglie di caratteri

- `larghezza` (50%): una riga di codice (tra dodici, da 9 a 19 caratteri) in un font a spaziatura fissa con
  caratteri larghi 6, 7, 8, 9, 10 o 12 pixel; si chiede la larghezza della riga, caratteri per larghezza, spazi
  compresi. Distrattori: gli spazi non contati, solo le lettere, un carattere in meno o in più.
- `gruppo` (25%): la descrizione di un font (con le grazie, senza, a spaziatura fissa) e si chiede il nome generico:
  `serif`, `sans-serif`, `monospace`; le altre opzioni sono gli altri due e parole che non sono gruppi (`bold`,
  `italic`, `font-size`).
- `uso` (25%): quattro testi, uno solo dei quali vuole la spaziatura fissa (un listato, una tabella fatta con gli
  spazi, un elenco di file in colonna, un disegno fatto di caratteri).

## Livello 4: corpo e interlinea

Una regola CSS per `p`, `li` o `h2` con `font-size` (10, 12, 14, 15, 16, 18, 20, 24, 28, 30, 32, 36 o 40 px) e
`line-height` (1.2, 1.25, 1.4, 1.5, 1.6, 1.75 o 2), scelti in modo che il prodotto sia intero.

- `distanza`: la distanza tra due linee di base, corpo per interlinea.
- `altezza`: l'altezza di un testo di $n$ righe ($n$ da 2 a 8).
- `spazio`: di quanto la distanza supera il corpo.

Esempio: `font-size: 20px; line-height: 1.5;`: le linee di base distano 30 pixel, 4 righe sono alte 120 pixel, lo
spazio in più è 10 pixel.

Distrattori: il solo corpo, corpo più interlinea, una riga sola, le righe per il corpo, lo spazio in più al posto
della distanza.

## Livello 5: quale font usa il browser

Una regola con `font-family`: tre font dello stesso gruppo e in fondo il nome generico del gruppo, uno per riga. I
nomi con uno spazio sono tra virgolette. Il testo dice quali font sono installati sul dispositivo. Si chiede quale
font usa il browser: il primo dell'elenco che è installato, oppure, se non ce n'è nessuno, "il font (con le grazie,
senza grazie, a spaziatura fissa) scelto dal dispositivo".

- `primo` (25%): è installato il primo dell'elenco.
- `seguente` (45%): è installato il secondo o il terzo, e non quelli prima.
- `generico` (30%): non è installato nessuno dei tre.

Distrattori: il primo dell'elenco anche se non è installato; "nessuno: il testo non viene mostrato"; un font
installato che l'elenco non nomina; un font dell'elenco che viene dopo quello giusto.

I nomi dei font sono quelli veri più diffusi (Georgia, Verdana, Courier New...), perché un valore di `font-family`
inventato non insegnerebbe a leggerne uno vero.

## Da evitare

- Domande su chi ha disegnato un font, su date, su formati di file.
- Interlinee che danno distanze non intere.
- Elenchi di `font-family` con font di gruppi diversi.
