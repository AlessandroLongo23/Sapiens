# Le leggi di Keplero

Generatore: `fis-leggi-keplero` (`src/lib/exercises/v2/generators/fis-leggi-keplero.ts`, con
`src/lib/exercises/v2/fis-keplero-newton.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_leggi_keplero.py` (con `_fis_keplero_newton.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/93-fis-leggi-keplero.md`. Percorso nel database:
`high_school/physics/fis-gravitazione/fis-leggi-keplero`.

Sei livelli, nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il semiasse maggiore
2. L'eccentricità
3. Più veloce al perielio
4. Il periodo dal semiasse
5. Il semiasse dal periodo
6. Le lune di un pianeta

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($6{,}5\,\text{UA}$, $0{,}61$, $22\,\text{km/s}$, $52\,\text{anni}$,
$49\,\text{d}$). Il livello 1 ha un risultato esatto con un decimale; gli altri due cifre significative, mai a meno di
$10^{-6}$ da un confine di arrotondamento e mai in notazione scientifica, né nella risposta né nelle altre opzioni.

## Regole comuni

- Formule della lezione: $a = (r_p + r_a)/2$, $e = (r_a - r_p)/(r_a + r_p)$, $v_p\,r_p = v_a\,r_a$, $T^2 = a^3$ con $T$
  in anni e $a$ in unità astronomiche attorno al Sole, $(T_2/T_1)^2 = (a_2/a_1)^3$ attorno a un altro corpo.
- Nei livelli 1, 2 e 3 le distanze sono in unità astronomiche con un decimale: $r_p$ da $0{,}3$ a $4{,}9$, $r_a$ fino a
  $9{,}9$, con $r_a$ tra $1{,}3$ e $12$ volte $r_p$. Il corpo è un asteroide, una cometa o una sonda.
- Scena `orbita-perielio-afelio` nei livelli 1, 2 e 3: l'ellisse con l'eccentricità vera, il Sole nel fuoco, le due
  distanze quotate e scritte sotto; al livello 3 anche la velocità data, nel punto in cui è data. La velocità cercata
  non è disegnata.

## Livello 1: il semiasse maggiore

La somma delle due distanze, in decimi, è pari: il semiasse ha un decimale esatto.

- "Una sonda gira attorno al Sole su un'orbita ellittica: al perielio dista dal Sole $3{,}7\,\text{UA}$, all'afelio
  $9{,}3\,\text{UA}$. Quanto vale il semiasse maggiore dell'orbita?" Risposta $6{,}5\,\text{UA}$. Distrattori:
  $13{,}0\,\text{UA}$ (tutto l'asse), $5{,}6\,\text{UA}$ (la differenza), $2{,}8\,\text{UA}$ (metà della differenza,
  cioè $c$).
- $r_p = 3{,}5$, $r_a = 7{,}9$: $5{,}7\,\text{UA}$.

## Livello 2: l'eccentricità

- $r_p = 1{,}3\,\text{UA}$, $r_a = 5{,}4\,\text{UA}$: $4{,}1/6{,}7 = 0{,}6119 \approx 0{,}61$. Distrattori: $0{,}24$
  ($r_p/r_a$), $0{,}76$ (la differenza diviso l'afelio), $0{,}39$ ($1 - e$).
- $r_p = 3{,}5$, $r_a = 7{,}9$: $0{,}39$.

## Livello 3: più veloce al perielio

Metà: data la velocità al perielio (intera, da $11$ a $99\,\text{km/s}$), trovare quella all'afelio. Metà: data quella
all'afelio (da $1{,}1$ a $9{,}9\,\text{km/s}$), trovare quella al perielio. Risultato tra $0{,}5$ e $99\,\text{km/s}$.

- "Un asteroide gira attorno al Sole: all'afelio dista dal Sole $2{,}8\,\text{UA}$ e ha una velocità di
  $3{,}1\,\text{km/s}$; al perielio dista $1{,}8\,\text{UA}$. Con quale velocità passa al perielio?"
  $3{,}1 \cdot 2{,}8/1{,}8 = 4{,}822 \approx 4{,}8\,\text{km/s}$. Distrattori: $2{,}0\,\text{km/s}$ (il rapporto
  rovesciato), $7{,}5\,\text{km/s}$ (il rapporto al quadrato), $3{,}9\,\text{km/s}$ (il rapporto sotto radice).
- Perielio a $0{,}6\,\text{UA}$ con $54\,\text{km/s}$, afelio a $3{,}5\,\text{UA}$: $9{,}3\,\text{km/s}$.

## Livello 4: il periodo dal semiasse

Semiasse da $1{,}1$ a $9{,}9\,\text{UA}$ oppure intero da $11$ a $21\,\text{UA}$; periodo sotto $100$ anni.

- $a = 14\,\text{UA}$: $\sqrt{14^3} = \sqrt{2744} = 52{,}38 \approx 52$ anni. Distrattori: $5{,}8$ anni (esponenti
  scambiati, $a^{2/3}$), $14$ anni ($T = a$), e $a^2$ quando è sotto $100$.
- $a = 5{,}2\,\text{UA}$: $12$ anni (Giove).

## Livello 5: il semiasse dal periodo

Periodo da $1{,}1$ a $9{,}9$ anni oppure intero da $11$ a $99$ anni.

- $T = 18$ anni: $\sqrt[3]{18^2} = \sqrt[3]{324} = 6{,}868 \approx 6{,}9\,\text{UA}$. Distrattori: $76\,\text{UA}$
  (esponenti scambiati, $\sqrt{T^3}$), $18\,\text{UA}$ ($a = T$), $4{,}2\,\text{UA}$ ($\sqrt{T}$).
- $T = 79$ anni: $18\,\text{UA}$.

## Livello 6: le lune di un pianeta

Due lune dello stesso pianeta, con i raggi delle orbite in $10^{5}\,\text{km}$ (mantisse da $1{,}1$ a $9{,}9$, diversi
almeno del $25\%$) e il periodo della prima da $1{,}1$ a $9{,}9$ giorni; periodo della seconda tra $0{,}2$ e $99$
giorni. Qui $T^2 = a^3$ con anni e unità astronomiche non vale.

- $a_1 = 1{,}8 \cdot 10^{5}\,\text{km}$, $T_1 = 7{,}5\,\text{d}$, $a_2 = 6{,}3 \cdot 10^{5}\,\text{km}$:
  $7{,}5 \cdot \sqrt{3{,}5^3} = 49{,}11 \approx 49\,\text{d}$. Distrattori: $26\,\text{d}$ (periodi proporzionali ai
  raggi), $1{,}1\,\text{d}$ (il rapporto rovesciato), $17\,\text{d}$ (esponenti scambiati).
- $a_1 = 9{,}3 \cdot 10^{5}\,\text{km}$, $T_1 = 3{,}1\,\text{d}$, $a_2 = 1{,}8 \cdot 10^{5}\,\text{km}$: $0{,}26\,\text{d}$.

## Esercizi da evitare

- Orbite quasi circolari nei primi tre livelli ($r_a$ sotto $1{,}3\,r_p$): la figura non mostrerebbe niente.
- Periodi oltre $99$ anni, che chiederebbero la notazione scientifica o tre cifre.

## Verifica

`fis_leggi_keplero.py` rilegge il testo, controlla dati e intervalli, ricalcola con valori esatti (radici comprese,
con SymPy), arrotonda e confronta l'opzione giusta, la forma di tutte le opzioni e la fine della soluzione; nei livelli
1, 2 e 3 controlla la scena (distanze, eccentricità, la velocità data e solo quella).

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0. Errori piantati (indice, primo e ultimo dato, testo dell'opzione giusta, opzione doppia, parole vietate, scena,
unità): tutti bocciati.

## Domande per la revisione

- Il livello 3 usa la relazione $v_p r_p = v_a r_a$: se Andrea la sposta alla lezione 91, il livello va tolto.
- Serve un livello con la costante $K$ in unità SI (periodo in secondi, semiasse in metri)? La lezione la calcola una
  volta sola.
