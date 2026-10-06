# Principio di induzione

Generatore: `principio-induzione` (`src/lib/exercises/v2/generators/principio-induzione.ts`), con i pezzi comuni
in `src/lib/exercises/v2/successioni.ts`. Verifica indipendente:
`scripts/exercises/checkers/principio_induzione.py`. Lezione collegata:
`docs/lezioni/riscritte/113-principio-induzione.md`.

Una dimostrazione intera non si corregge da sola, quindi i sei livelli ne chiedono i pezzi, nell'ordine della
lezione: da quale $n$ vale una disuguaglianza (la base da scegliere); i due membri di una formula per un $n$
dato (verificare un caso, e per $n = 1$ la base); il termine che si aggiunge al primo membro nel passo
induttivo; il secondo membro della tesi $P(k + 1)$; il pezzo che manca in un passo induttivo; l'errore in una
dimostrazione. Parole della lezione: base, passo induttivo, ipotesi induttiva, tesi, $P(k)$ e $P(k + 1)$.

## Le formule

I livelli 2, 3, 4 e 6 usano formule vere "primo membro = secondo membro", scritte su due righe (`... =` e
`= ...`), con il termine generale come ultimo addendo. Famiglie (`params.family`):

- `aritmetica` (40%, `a`, `d` da 1 a 5): $a + (a + d) + \dots + (dn + a - d)$, con il secondo membro $n^2$ o
  $cn^2$, $n(pn + q)$ oppure $\frac{n(dn + 2a - d)}{2}$ secondo la parità;
- `geometrica` (24%, `r` tra 2, 3, 4, 5, `m` da 1 a 3): tre termini, i puntini e $m(r - 1) \cdot r^{n-1}$,
  uguale a $m(r^n - 1)$;
- `quadrati` (12%): $1^2 + 2^2 + \dots + n^2 = \frac{n(n + 1)(2n + 1)}{6}$;
- `cubi` (12%): $1^3 + 2^3 + \dots + n^3 = \frac{n^2(n + 1)^2}{4}$;
- `prodotti` (12%): $1 \cdot 2 + 2 \cdot 3 + \dots + n(n + 1) = \frac{n(n + 1)(n + 2)}{3}$.

## Tipi di risposta

| Livello | Risposta | Scelta multipla |
|---|---|---|
| 1, 2 | `number` | costruita con l'esercizio |
| 3, 4, 5 | `choice` (espressioni in $k$; `values` è l'espressione in SymPy) | la risposta stessa |
| 6 | `choice` (quattro etichette fisse) | la risposta stessa |

Le opzioni che sono espressioni hanno tutte valore diverso (non solo scrittura diversa): si confrontano per
$k$ da 1 a 8.

## Livello 1: da quale n vale una disuguaglianza

Problema: una disuguaglianza. Si chiede il più piccolo $n$ da cui è sempre vera, che è tra 2 e 8. Casi
(`params.case`): `esponenziale e retta` ($b^n > an + c$, $b$ 2 o 3), `esponenziale e quadrato`
($b^n > n^2 + c$), `quadrato e retta` ($n^2 > an + c$). Da quel valore in poi la differenza tra i due membri
cresce sempre. I passaggi calcolano i casi da $n = 1$. Distrattori: il primo $n$ in cui la disuguaglianza è
vera, se poi torna falsa; il valore prima; il valore dopo; 1.

1. $2^n > n^2 + 3$: falsa per $n$ da 1 a 4 ($16 > 19$), vera per $n = 5$ ($32 > 28$): $n = 5$.
2. $3^n > 3n + 13$: $9 > 19$ falso, $27 > 22$ vero: $n = 3$.

## Livello 2: verificare un caso di una formula

Problema: la formula. Il prompt dà il valore: "Verifica l'uguaglianza per n = 4: quanto valgono i due
membri?", con $n$ da 1 a 4 (fino a 3 per i cubi). Risposta: il valore comune. `params`: la famiglia e `n`.
Distrattori: il solo ultimo termine (chi sostituisce $n$ nel termine generale e non somma), il valore per
$n + 1$, il valore più 1, il valore per $n - 1$.

1. $1^2 + 2^2 + \dots + n^2 = \frac{n(n + 1)(2n + 1)}{6}$, $n = 4$: $1 + 4 + 9 + 16 = 30$ e $\frac{4 \cdot 5 \cdot 9}{6} = 30$.
2. $4 + 6 + \dots + (2n + 2) = n(n + 3)$, $n = 4$: $4 + 6 + 8 + 10 = 28$ e $4 \cdot 7 = 28$.

## Livello 3: il termine che si aggiunge nel passo induttivo

Problema: la formula. Risposta: il termine di posto $k + 1$. Distrattori: il termine di posto $k$, $k + 1$
(avviso "Come si scrive P(k + 1) per una somma"), il termine di posto $k$ più 1, il termine di posto $k + 2$,
$1$, $k$.

1. $1^2 + 2^2 + \dots + n^2$: si aggiunge $(k + 1)^2$.
2. $4 + 6 + \dots + (2n + 2)$: si aggiunge $2k + 4$.

## Livello 4: il secondo membro della tesi P(k + 1)

Problema: la formula. Risposta: il secondo membro con $k + 1$ al posto di $n$, scritto in fattori. Distrattori:
il secondo membro di $P(k)$ più 1, più $k + 1$, da solo, più il termine di posto $k$, e il secondo membro per
$k + 2$.

1. $\frac{n(n + 1)(2n + 1)}{6}$ diventa $\frac{(k + 1)(k + 2)(2k + 3)}{6}$.
2. $n(n + 3)$ diventa $(k + 1)(k + 4)$.

## Livello 5: completare un passo induttivo

Tre righe: l'enunciato in una frase, poi il passaggio su due righe con il punto di domanda. Casi:

- `cubo` (30%): "Enunciato: $n^3 + cn$ è divisibile per $3$.", $c \in \{2, 5, 8, -1, -4, 11\}$;
  `(k + 1)^3 + c(k + 1) =` / `= (k^3 + ck) + 3 \cdot (\ ?\ )`; risposta $k^2 + k + \frac{1 + c}{3}$;
- `quadrato` (20%): "Enunciato: $n^2 + cn$ è divisibile per $2$.", $c$ dispari tra $-3$ e 9; risposta
  $k + \frac{1 + c}{2}$;
- `potenza` (25%): "Enunciato: $a^n - 1$ è divisibile per $a - 1$.", $a$ da 3 a 9; `a^{k+1} - 1 =` /
  `= a \cdot (a^k - 1) + \ ?`; risposta $a - 1$;
- `ricorsiva` (25%): "Enunciato: $a_n = p^n + c$, con $a_1 = p + c$ e $a_{n+1} = pa_n + r$.", $p$ 2 o 3, $c$ non
  nullo tra $-3$ e 3, $r = c(1 - p)$; `a_{k+1} = pa_k + r =` / `= p \cdot (p^k + c) + r = \ ?`; risposta
  $p^{k+1} + c$.

`params`: `case` e `c`, oppure `a`, oppure `p` e `c`. Distrattori: il fattore non raccolto ($3k^2 + 3k + 3$),
il termine noto non diviso, il termine noto dimenticato; per la potenza $a$, $1$, $a + 1$; per la ricorsiva
$p^{k+1} + pc$ (il termine $r$ dimenticato), $p^k + c$, il segno di $c$ cambiato.

1. $n^2 - 3n$ divisibile per 2: $(k + 1)^2 - 3(k + 1) = (k^2 - 3k) + 2 \cdot (k - 1)$.
2. $8^n - 1$ divisibile per 7: $8^{k+1} - 1 = 8 \cdot (8^k - 1) + 7$.

## Livello 6: riconoscere l'errore in una dimostrazione

Una dimostrazione in poche righe e quattro opzioni fisse, un quarto ciascuna (`params.case`):

- `corretta`: `\text{la dimostrazione è corretta}`;
- `un solo k`: `\begin{gathered} \text{il passo è dimostrato} \\ \text{per un solo valore di }k \end{gathered}`;
- `dalla tesi`: `\begin{gathered} \text{il passo parte dalla tesi} \\ \text{come se fosse vera} \end{gathered}`;
- `base falsa`: `\begin{gathered} \text{manca la base, e per }n = 1 \\ \text{l’enunciato è falso} \end{gathered}`.

Per i primi tre casi: "Enunciato, per ogni $n \geq 1$:", la formula di una famiglia, "Base: per $n = 1$ i due
membri valgono $v$.", e una di queste righe:

- "Passo: si suppone vera $P(k)$, si aggiunge ai due membri il termine di posto $k + 1$ e si arriva al secondo membro di $P(k + 1)$."
- "Passo: da $P(1)$ si ricava $P(2)$ con un conto; quindi il passo vale per ogni $k$."
- "Passo: si scrive $P(k + 1)$ come se fosse vera e la si trasforma fino a ottenere $0 = 0$."

Per `base falsa`: "Enunciato, per ogni $n \geq 1$: $n^2 + n + c$ è dispari." (con $c$ pari tra 0 e 8) oppure
"è pari." (con $c$ dispari), "Base: non è stata verificata.", e "Passo: $(k + 1)^2 + (k + 1) + c =
(k^2 + k + c) + 2(k + 1)$, e aggiungere un numero pari non cambia la parità." È l'esempio dell'avviso "Il passo
induttivo senza la base": il passo è giusto e l'enunciato è falso.

## Da evitare

Opzioni che sono due scritture della stessa espressione; disuguaglianze vere da $n = 1$ o con il primo valore
oltre 8; enunciati di divisibilità falsi; il fattoriale e la sommatoria, che la lezione non usa.

## Domande per la revisione

- Livello 1: "il più piccolo $n$ da cui la disuguaglianza è sempre vera" è una domanda di calcolo, non di
  induzione. Va bene come primo livello, o è meglio partire dal livello 2?
- Livelli 3 e 4: sono due domande vicine sulla stessa formula. Tenerle separate aiuta, o conviene unirle?
- Livello 6: le dimostrazioni sono riassunte a parole, e gli errori sono solo tre più il caso corretto. Quali
  altri errori vedete nei compiti (base verificata per il valore sbagliato, ipotesi induttiva mai usata)?
- Mancano le disuguaglianze nel passo induttivo (esempi 6 e 7 della lezione): come pezzo a scelta multipla non
  ho trovato una forma che non suggerisca la risposta. Avete un'idea?
