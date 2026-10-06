# Funzioni periodiche

Generatore: `funzioni-periodiche` (`src/lib/exercises/v2/generators/funzioni-periodiche.ts`).
Verifica indipendente: `scripts/exercises/checkers/funzioni_periodiche.py` (aiuti comuni in
`checkers/_funzioni.py`). Lezione collegata: `docs/lezioni/riscritte/108-funzioni-periodiche.md`.

Sette livelli nell'ordine della lezione: le uguaglianze che dà il periodo; un numero positivo riportato nel primo
periodo; un numero negativo; un valore dalla formula su un periodo; parte intera e parte frazionaria; il periodo
dopo una trasformazione; gli zeri in un intervallo. Niente goniometria. Notazione della lezione: periodo $T$,
primo periodo $[0, T\mathclose{[}$, $\lfloor x \rfloor$ e $\operatorname{mant}(x)$, virgola decimale.

## Tipi di risposta

| Livello | Risposta | Scelta multipla | Risposta aperta |
|---|---|---|---|
| 1 | `choice`: un'uguaglianza | la risposta stessa | no |
| 2, 3, 4, 5, 6 | `number` | `toChoice` | `V` |
| 7 | `set`: gli zeri | `toChoice` | `V` |

## Livello 1: le uguaglianze del periodo

"La funzione $f$ ha periodo $T$." Consegna: "Quale uguaglianza vale di sicuro per ogni x?" $T$ tra 2 e 9. Giusta:
$f(x + kT) = f(x)$ con $k \in \{2, 3, 4, -1, -2\}$.

- $T = 7$: $f(x + 14) = f(x)$, tra $f(x + 13) = f(x)$, $f(2x) = f(x)$, $f(x + 15) = f(x)$.
- $T = 7$: $f(x - 7) = f(x)$, tra $f(x + 6) = f(x)$, $f(x + 8) = f(x)$, $f(3x) = f(x)$.

Distrattori: uno spostamento che non è un multiplo del periodo ($kT \pm 1$, $T \pm 1$, $\frac{T}{2}$); $f(kx) = f(x)$;
$f(x) + T = f(x)$.

## Livello 2: riportare un numero positivo

"Per quale numero $x_0$ dell'intervallo $[0, T\mathclose{[}$ si ha $f(n) = f(x_0)$?" $T$ tra 3 e 8, $n$ intero tra
$T + 1$ e $8T$.

- $T = 6$, $n = 7$: $x_0 = 1$.
- $T = 4$, $n = 28$: $x_0 = 0$.

Distrattori: il quoziente al posto del resto; un solo passo ($n - T$); $T$ meno il resto; il resto più o meno 1.

## Livello 3: riportare un numero negativo

Come il livello 2, con $n$ tra $-5T$ e $-1$.

- $T = 6$, $n = -1$: $x_0 = 5$.
- $T = 7$, $n = -28$: $x_0 = 0$.

Distrattori: il resto di $|n|$ (il segno ignorato) e il suo opposto; un solo passo ($n + T$); $T$ meno la risposta.

## Livello 4: un valore dalla formula su un periodo

"La funzione $f$ ha periodo $T$ e per $0 \leq x < T$ vale $f(x) = \dots$ Calcola $f(n)$." Formula $ax + b$,
$x^2 + b$ oppure $-x + T$; $T$ tra 2 e 6.

- $T = 5$, $f(x) = 3x + 5$, $f(35) = f(0) = 5$.
- $T = 2$, $f(x) = x^2 - 1$, $f(11) = f(1) = 0$.

Distrattori: la formula applicata a $n$ senza ridurre (l'errore principale); il numero ridotto al posto del
valore; la formula applicata dopo un solo passo.

## Livello 5: parte intera e parte frazionaria

$\lfloor x \rfloor$ oppure $\operatorname{mant}(x)$ con $x$ a una cifra decimale, positivo o negativo in parti
uguali.

- $\lfloor -9{,}7 \rfloor = -10$.
- $\operatorname{mant}(-5{,}9) = 0{,}1$.

Distrattori: il troncamento ($-9$) al posto della parte intera (avviso "La parte intera di un numero negativo");
per la parte frazionaria, le cifre dopo la virgola ($0{,}9$), il loro opposto, il numero senza segno.

## Livello 6: il periodo dopo una trasformazione

"La funzione $f$ ha periodo $T$. Qual è il periodo di $g$?" con $g(x) = f(kx)$, $f\left(\dfrac{x}{k}\right)$,
$a f(x) \pm b$, $f(x \pm b)$; $k$ tra 2 e 5.

- $T = 7$, $g(x) = f\left(\dfrac{x}{2}\right)$: $14$.
- $T = 5$, $g(x) = 4f(x) - 6$: $5$.

Distrattori: moltiplicare al posto di dividere (avviso "Moltiplicare la x per k divide il periodo"); cambiare il
periodo quando la trasformazione lo lascia uguale; sommare.

## Livello 7: gli zeri in un intervallo

"…nell'intervallo $[0, T\mathclose{[}$ si annulla solo per $x = a$. Quali sono i suoi zeri nell'intervallo
$[m, n]$?" Da due a quattro zeri.

- $T = 7$, $a = 2$, $[-2, 13]$: $\{2,\ 9\}$.
- $T = 3$, $a = 1$, $[7, 16]$: $\{7,\ 10,\ 13,\ 16\}$.

Distrattori: uno zero in meno (un estremo dimenticato) o in più (uno fuori dall'intervallo); il passo sbagliato
($T + 1$); gli zeri contati a partire da $m$.

## Esercizi da evitare

- $f(1x)$ e periodi uguali a 1.
- Al livello 4, una formula che dà lo stesso valore in $n$ e nel numero ridotto.
- Al livello 7, un solo zero o più di quattro.

## Verifiche fatte

- `sample.mts funzioni-periodiche 1000 all <seed> | verify.py` con i seed 1, 50001 e 777001.
- Il controllo legge tutto dalla frase del problema (periodo, numeri, formula, intervallo) e rifà i conti; non usa
  i parametri.
- Errori piantati (risposta spostata di 1, numero del testo cambiato, opzione giusta scambiata): bocciati.

## Limiti

- Nessun esercizio di lettura del periodo da un grafico.
- Nessuna dimostrazione che una funzione non è periodica.
- Al livello 6 il periodo può essere una frazione ($\frac{7}{2}$): nella risposta aperta va scritto come frazione o
  come decimale.

## Domande per la revisione

- Notazione: $\lfloor x \rfloor$ e $\operatorname{mant}(x)$ seguono la lezione. Se il libro scrive $[x]$ e
  "mantissa", cambiano lezione e generatore insieme.
- Livello 1: "vale di sicuro" è chiaro? Con $T = 4$, $f(x + 2) = f(x)$ è falsa perché il periodo è il più piccolo.
- Livello 5: parte intera e parte frazionaria insieme, positivi e negativi insieme. Meglio due livelli?
