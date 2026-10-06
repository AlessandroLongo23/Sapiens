# Funzioni pari e dispari

Generatore: `funzioni-dispari-pari` (`src/lib/exercises/v2/generators/funzioni-dispari-pari.ts`).
Verifica indipendente: `scripts/exercises/checkers/funzioni_dispari_pari.py` (aiuti comuni in
`checkers/_funzioni.py`). Lezione collegata: `docs/lezioni/riscritte/106-funzioni-dispari-pari.md`.

Sei livelli nell'ordine della lezione: calcolare $f(-x)$; riconoscere un polinomio dagli esponenti; frazioni,
radici e valore assoluto su un dominio simmetrico; i casi in cui decide il dominio; i valori che dà la
simmetria; le operazioni tra funzioni pari e dispari. Parole della lezione: "pari", "dispari", "né pari né
dispari", "dominio simmetrico rispetto allo zero".

## Si costruisce dalla risposta

Si sceglie prima la risposta (pari, dispari, né pari né dispari) e poi la funzione che la dà: i gradi dei termini
per i polinomi, una funzione di un elenco fisso per le altre.

## Tipi di risposta

| Livello | Risposta | Scelta multipla | Risposta aperta |
|---|---|---|---|
| 1 | `expression`, forma `expanded` | `toChoice`: quattro polinomi | `form('expanded')` |
| 2, 3, 4, 6 | `choice`: pari, dispari, né pari né dispari, sia pari sia dispari | la risposta stessa | no |
| 5 | `number` | `toChoice` | `V` |

Le quattro opzioni dei livelli 2, 3, 4 e 6 sono sempre le stesse, in ordine casuale. "Sia pari sia dispari" non è
mai la risposta giusta: vale solo per la funzione nulla, che non si propone.

## Livello 1: calcolare f(-x)

Consegna: "Calcola f(-x) e scrivi il risultato in forma normale." Polinomio con due o tre termini, coefficienti
interi, almeno un grado pari e almeno un grado dispari, grado massimo 5.

- $f(x) = 2x^5 - x^4$: $f(-x) = -2x^5 - x^4$.
- $f(x) = x^3 - 4x^2 + 5$: $f(-x) = -x^3 - 4x^2 + 5$.

Distrattori: $-f(x)$ (avviso "Il segno meno dentro e fuori"); $f(x)$ senza cambiamenti; il segno cambiato ai
termini di grado pari; il segno cambiato solo al primo termine; il segno cambiato a tutti i termini con la $x$.

## Livello 2: riconoscere un polinomio

Consegna: "La funzione è pari, dispari o nessuna delle due?" Soli gradi pari (il termine noto conta), soli gradi
dispari, o misti: un terzo ciascuno. Due o tre termini.

- $f(x) = 3x^4 - x^2 + 5$: pari.
- $f(x) = x^3 + 2x^2$: né pari né dispari.

## Livello 3: frazioni, radici e valore assoluto

Dominio naturale simmetrico rispetto allo zero. Funzioni dell'elenco: $\dfrac{x}{x^2 - a^2}$, $\dfrac{nx}{x^2 + k}$,
$\dfrac{x^3 + x}{x^2 + k}$, $\dfrac{x^2 + k}{x}$, $\dfrac{|x|}{x}$, $x\sqrt{a^2 - x^2}$, $x \cdot |x|$ (dispari);
$\dfrac{x^2}{x^2 + k}$, $\dfrac{n}{x^2 - a^2}$, $\sqrt{a^2 - x^2}$, $|x| + n$, $x^2 + n|x|$ (pari); $\dfrac{x + n}{x^2 + k}$,
$x + |x|$, $|x + n|$ (né pari né dispari). Un terzo per risposta.

- $f(x) = \dfrac{x^2 + 5}{x}$: numeratore pari, denominatore dispari, dispari.
- $f(x) = \lvert x \rvert - 3$: pari.

## Livello 4: il dominio decide

Metà dei casi: una funzione semplice ($x^2$, $x^3$, $|x|$, $nx$, $x^2 + n$) con il dominio dato come intervallo,
simmetrico (quattro volte su dieci: la risposta è quella della formula) o no (né pari né dispari). L'altra metà:
un denominatore $x - a$ o una radice $\sqrt{x - a}$ che rendono il dominio naturale non simmetrico.

- $f(x) = x^2 + 1$, $D = \mathopen{]}-1, 1\mathclose{[}$: pari.
- $f(x) = \dfrac{x^3}{x + 6}$: il dominio contiene $6$ ma non $-6$, né pari né dispari.

L'errore atteso è guardare solo la formula (esempio 5 della lezione).

## Livello 5: valori con la simmetria

"La funzione $f$ è pari (dispari), è definita su tutto $\mathbb{R}$ e $f(a) = v$. Quanto vale $f(-a)$?" Il valore
dato può essere in $a$ o in $-a$; per una funzione dispari, una volta su cinque circa si chiede $f(0)$.

- $f$ dispari, $f(5) = 7$: $f(-5) = -7$.
- $f$ pari, $f(-7) = -2$: $f(7) = -2$.

Distrattori: il valore con il segno sbagliato (pari e dispari scambiati); $0$; l'ascissa al posto del valore.

## Livello 6: operazioni

"$f$ è pari e $g$ è dispari… Com'è la funzione $h$?" con $h = f \cdot g$, $f + g$, $-f$, $|f|$, $[f]^2$. Le funzioni
sono definite su tutto $\mathbb{R}$ e non valgono sempre zero.

- $f$ pari, $g$ dispari, $h(x) = f(x) \cdot g(x)$: dispari.
- $f$ pari, $g$ dispari, $h(x) = f(x) + g(x)$: né pari né dispari.

## Esercizi da evitare

- La funzione nulla, e al livello 1 un polinomio solo pari o solo dispari (due opzioni coinciderebbero).
- Al livello 4, un dominio dato che esce dal dominio naturale della formula.
- Il quoziente di due funzioni al livello 6: una funzione dispari definita in zero lì si annulla, e il dominio del
  quoziente andrebbe discusso.

## Verifiche fatte

- `sample.mts funzioni-dispari-pari 1000 all <seed> | verify.py` con i seed 1, 50001 e 777001.
- Il controllo legge formula e dominio dal problema e decide la parità dalla definizione: il dominio deve
  coincidere con il suo simmetrico, e $f(-v)$ si confronta con $f(v)$ e $-f(v)$ in punti razionali del dominio.
- Errori piantati (etichetta giusta cambiata, $f(-x)$ con un segno sbagliato, dominio reso asimmetrico): bocciati.

## Limiti

- Le funzioni del livello 3 vengono da un elenco di quindici forme con i numeri che cambiano: dopo una ventina di
  esercizi le forme si ripetono.
- Nessun esercizio sul completare un grafico.

## Domande per la revisione

- Le quattro opzioni comprendono "sia pari sia dispari", che non è mai giusta. Meglio tre opzioni sole, se la
  pagina le accetta, o una quarta diversa ("non si può dire")?
- Livello 4: il dominio dato come intervallo ($D = [-2, 5]$) è un esercizio che i libri propongono, o è troppo
  artificiale?
- Livello 6: valore assoluto e quadrato di una funzione pari o dispari non sono nella tabella della lezione, ma si
  ricavano con lo stesso conto. Tenerli o limitarsi a prodotto e somma?
