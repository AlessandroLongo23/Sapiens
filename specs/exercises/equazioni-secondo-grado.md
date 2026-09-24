# Equazioni di secondo grado

Generatore: `equazioni-secondo-grado` (`src/lib/exercises/v2/generators/equazioni-secondo-grado.ts`).
Verifica indipendente: `scripts/exercises/verify.py`.

Lo studente riceve un'equazione di secondo grado a coefficienti interi e deve trovare l'insieme
delle soluzioni reali. La risposta è un insieme di numeri esatti (`answer.kind = "set"`): razionali
come `3/2`, radicali come `(3-sqrt(5))/2`, vuoto quando non ci sono soluzioni reali. Ogni esercizio
ha anche una variante a scelta multipla con quattro opzioni distinte.

I livelli seguono l'ordine del libro e ognuno aggiunge una sola difficoltà al precedente (decisione
del 23 settembre 2026 nel vault, "Ogni livello aggiunge una sola difficoltà, nell'ordine del libro").

Dove le radici devono essere "belle", l'esercizio si costruisce all'indietro: si scelgono prima le
radici, poi si sviluppa il polinomio. Al livello 4 si scelgono invece coefficienti piccoli, perché
una radice irrazionale è leggibile quando il radicando è piccolo.

## Regole comuni a tutti i livelli

- Coefficienti interi, in valore assoluto al massimo 100, sia a primo sia a secondo membro.
- `lhs − rhs` ha grado esattamente 2.
- I radicali nella risposta sono semplificati: radicando senza fattori quadrati (`3*sqrt(2)`, non
  `sqrt(18)`), numeratore e denominatore senza fattori comuni.
- `params` contiene `lhs` e `rhs` come coefficienti esatti per grado (`[c, b, a]`), la forma normale
  risolta (`normal`), il discriminante (`delta`), le radici attese (`roots`) in ordine crescente e,
  nei livelli con più casi, il caso (`case`).
- Le equazioni incomplete si risolvono senza la formula, come nel libro: la pura isolando `x^2`, la
  spuria raccogliendo `x`. Le complete si risolvono con la formula risolutiva.

## Livello 1: equazioni incomplete

Vincoli:

- secondo membro nullo, `a > 0`, esattamente uno tra `b` e `c` uguale a zero (l'equazione monomia
  `ax^2 = 0` è esclusa);
- pura (`b = 0`), circa 40%: `k(t²x² − p²) = 0`, radici `±p/t` con `p` tra 1 e 9, `t` tra 1 e 3;
- pura impossibile, circa 15%: `k(t²x² + p²) = 0`, nessuna soluzione reale;
- spuria (`c = 0`), circa 45%: `k·x(tx − s) = 0`, radici `0` e `s/t` con `s` tra −9 e 9, non nullo;
- radici razionali con denominatore al massimo 3.

Esempi svolti:

1. `4x^2 - 49 = 0`. `4x^2 = 49`, `x^2 = 49/4`, `x = ±7/2`.
2. `2x^2 - 6x = 0`. Raccogli `2x`: `2x(x − 3) = 0`, quindi `x = 0` oppure `x = 3`.
3. `2x^2 + 8 = 0`. `x^2 = −4`: un quadrato non è mai negativo, `S = ∅`.

## Livello 2: coefficiente direttore 1, radici intere

Vincoli:

- forma `x^2 + bx + c = 0`, quindi `a = 1` e secondo membro nullo;
- due radici intere distinte in `[-9, 9]`, entrambe diverse da 0;
- `b ≠ 0` e `c ≠ 0`: l'equazione è completa.

Esempi svolti:

1. `x^2 - 5x + 6 = 0`. Δ = 25 − 24 = 1, x = (5 ± 1)/2, quindi x₁ = 2, x₂ = 3.
2. `x^2 - 3x - 28 = 0`. Δ = 9 + 112 = 121, x = (3 ± 11)/2, quindi x₁ = −4, x₂ = 7.

## Livello 3: coefficiente direttore qualsiasi, radici razionali

Nuova difficoltà: `a ≠ 1`, e quindi le radici possono essere frazioni.

Vincoli:

- forma `ax^2 + bx + c = 0` con `a ≥ 2`, completa, secondo membro nullo;
- due radici razionali distinte `p/q` ridotte, con `q ≤ 5` e `1 ≤ |p| ≤ 9`;
- circa tre esercizi su quattro hanno almeno una radice frazionaria (`k(q₁x − p₁)(q₂x − p₂)`);
  gli altri hanno radici intere e un fattore comune da dividere (`a(x − r₁)(x − r₂)`, `a` tra 2 e 5).

Esempi svolti:

1. `2x^2 + 5x - 3 = 0`. Δ = 25 + 24 = 49, x = (−5 ± 7)/4, quindi x₁ = −3, x₂ = 1/2.
2. `3x^2 + 12x - 15 = 0`. Dividi per 3: `x^2 + 4x - 5 = 0`. Δ = 36, x = (−4 ± 6)/2, quindi
   x₁ = −5, x₂ = 1.

## Livello 4: radici irrazionali

Nuova difficoltà: il discriminante non è un quadrato perfetto, e il radicale va semplificato.

Vincoli:

- secondo membro nullo, `a > 0`, Δ > 0 e non quadrato perfetto: due radici `(p ± q√r)/d`;
- circa quattro su cinque complete, con `a ≤ 3` e `|b|, |c| ≤ 10`, in modo che il radicando resti
  piccolo;
- le altre pure, `k(t²x² − n) = 0` con `n` non quadrato perfetto: radici `±√n/t`.

Esempi svolti:

1. `x^2 - 8x - 2 = 0`. Δ = 64 + 8 = 72, √72 = 6√2, x = (8 ± 6√2)/2 = 4 ± 3√2.
2. `x^2 - 5x + 1 = 0`. Δ = 25 − 4 = 21, x = (5 ± √21)/2.
3. `2x^2 - 30 = 0`. `x^2 = 15`, `x = ±√15`.

## Livello 5: termini in entrambi i membri

Nuova difficoltà: prima di risolvere bisogna portare tutto a primo membro, e a volte cambiare segno.

Vincoli:

- il polinomio base ha radici razionali come ai livelli 2 e 3 (metà radici intere, metà con almeno
  una frazione); si aggiunge lo stesso polinomio casuale `R(x)` a entrambi i membri (coefficienti di
  `R` tra −6 e 6, al più ±3 per `x^2`), e a caso il polinomio base sta a primo o a secondo membro;
- entrambi i membri contengono almeno un termine in `x` o `x^2`;
- dopo il trasporto l'equazione è completa; se il coefficiente di `x^2` risulta negativo, lo
  studente moltiplica per −1.

Esempi svolti:

1. `2x^2 + 4x + 1 = -x + 4`. A primo membro: `2x^2 + 5x - 3 = 0`. Δ = 49, x₁ = −3, x₂ = 1/2.
2. `x^2 + 2x - 1 = 7x^2 - 11x + 5`. A primo membro: `-6x^2 + 13x - 6 = 0`; per −1:
   `6x^2 - 13x + 6 = 0`. Δ = 25, x₁ = 2/3, x₂ = 3/2.

## Livello 6: discriminante nullo o negativo

Nuova difficoltà: riconoscere dal discriminante quante soluzioni ci sono.

Vincoli:

- circa metà degli esercizi con Δ = 0 e metà con Δ < 0 (il verificatore accetta tra 35% e 65%
  su almeno 100 campioni);
- Δ = 0: `k(qx − p)^2` con `k` in `[1, 3]`, `q` in `{1, 2, 3}` (più spesso 1), `p` in `[-9, 9]`
  diverso da 0; la risposta è l'insieme con la sola radice doppia `p/q`;
- Δ < 0: `a(x − h)^2 + m` con `a` in `[1, 4]`, `h` in `[-6, 6]` diverso da 0 (con `h = 0` sarebbe
  una pura), `m` in `[1, 9]`, a volte con tutti i segni cambiati; la risposta è l'insieme vuoto;
- equazione completa, secondo membro nullo.

Esempi svolti:

1. `4x^2 - 12x + 9 = 0`. Δ = 144 − 144 = 0, x₁ = x₂ = 12/8 = 3/2.
2. `2x^2 - 4x + 5 = 0`. Δ = 16 − 40 = −24 < 0: nessuna soluzione reale, S = ∅.

## Esercizi "brutti" da evitare

Un esercizio che contiene uno di questi difetti è sbagliato anche se la risposta è giusta. Il
generatore non li produce e `verify.py` li cerca nel testo LaTeX del problema:

- coefficiente 1 scritto esplicitamente: `1x`, `1x^2` (va scritto `x`, `x^2`), e lo stesso per −1;
- segni doppi: `+ -3`, `+-3`, `- -3`, `+ +3`;
- termini nulli mostrati: `0x`, `+ 0`, `- 0`;
- esponenti inutili: `x^{1}`, `x^1`, `x^0`;
- coefficienti enormi, oltre 100 in valore assoluto;
- equazioni fuori livello: incomplete dal livello 2 in poi, radici tutte intere al livello 3 senza
  un fattore comune, radici razionali al livello 4.

## Variante a scelta multipla

Quattro opzioni, tutte distinte come insiemi di valori, esattamente una corretta. I distrattori
riproducono errori tipici, in quest'ordine di preferenza: radici con il segno cambiato; formula
senza dividere per `2a`; divisione per `a` invece di `2a`; discriminante calcolato come `b^2 + 4ac`;
una sola delle due radici; "nessuna soluzione reale". Con Δ < 0: radici ottenute usando |Δ|, il
vertice `-b/2a` come radice doppia. Se servono altre opzioni si spostano le radici di ±1, ±2, ...

## Domande per la revisione

- Le proporzioni tra i casi (pure e spurie al livello 1, complete e pure al livello 4) sono quelle
  giuste?
- Al livello 4 servono anche radici con denominatore da razionalizzare, come `x^2 = 5/2`?
- Il livello 5 dovrebbe includere prodotti e quadrati da sviluppare, come `(x − 1)^2 = 2x + 3`?
