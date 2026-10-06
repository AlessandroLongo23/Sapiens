# Successioni numeriche

Generatore: `successioni-numeriche` (`src/lib/exercises/v2/generators/successioni-numeriche.ts`), con i pezzi
comuni del capitolo in `src/lib/exercises/v2/successioni.ts`. Verifica indipendente:
`scripts/exercises/checkers/successioni_numeriche.py` (aiuti comuni in `checkers/_successioni.py`). Lezione
collegata: `docs/lezioni/riscritte/110-successioni-numeriche.md`.

Sei livelli nell'ordine della lezione: un termine dal termine generale; i segni alterni con $(-1)^n$; un
termine di una successione definita per ricorsione; il posto di un numero; crescente, decrescente o non
monotona; limitata o no. Il primo termine è $a_1$, come nella lezione. Niente limiti.

## Si costruisce dalla risposta

Si scelgono prima l'indice, le soluzioni dell'equazione o il comportamento, poi la successione. Al livello 4
l'equazione di secondo grado nasce dal prodotto $(n - n_0)(n - m)$ con $m$ negativo; ai livelli 5 e 6 si sceglie
il comportamento e poi una famiglia che lo ha. Il testo non contiene mai `1n`, `+ -`, `- -`, termini nulli.

## Tipi di risposta

| Livello | Risposta | Scelta multipla |
|---|---|---|
| 1, 2, 3 | `number` (il termine, intero o frazione) | costruita con l'esercizio |
| 4 | `number` (l'indice) | costruita con l'esercizio |
| 5, 6 | `choice` (quattro etichette fisse) | la risposta stessa |

Sempre quattro opzioni distinte. Per i numeri: prima gli errori elencati sotto, poi i numeri vicini alla
risposta finché sono quattro.

## Livello 1: un termine dal termine generale

Problema su due righe: `a_n = ...` e `a_{k} = \ ?`, con $k$ tra 3 e 10. Tre casi: `lineare` (30%, $pn + c$ con
$p$ e $c$ non nulli, $|p| \le 6$, $|c| \le 9$), `quadratica` (30%, $an^2 + bn + c$ con $a \in \{1, 2, -1\}$, $b$
non nullo), `fratta` (40%, $\frac{pn + c}{n + r}$ con $p$ da 1 a 5, $r$ da 1 a 4, non semplificabile).
`params`: `case`, `num` e `den` (coefficienti per grado crescente, `den` nullo se non c'è), `k`.
Distrattori: il termine di posto $k + 1$, $a_k + 1$ (avviso "Il termine successivo non è il termine più
uno"), il termine di posto $k - 1$, per la fratta il solo numeratore.

1. $a_n = \frac{4n - 6}{n + 2}$, $a_8 = \frac{26}{10} = \frac{13}{5}$.
2. $a_n = n^2 - 5n - 5$, $a_{10} = 100 - 50 - 5 = 45$.

## Livello 2: segni alterni

$a_n = (-1)^n \cdot (pn + c)$ oppure con l'esponente $n + 1$ (`prodotto`, 60%; $p$ da 1 a 4, $c$ tra $-5$ e 5,
senza parentesi se $c = 0$), oppure $a_n = \frac{(-1)^n}{pn + c}$ con denominatore sempre positivo (`fratta`,
40%). $k$ tra 2 e 9. `params`: `case`, `shift` (0 per $n$, 1 per $n + 1$), `p`, `c`, `k`. Distrattori: il
segno opposto, il termine successivo con uno dei due segni.

1. $a_n = (-1)^n \cdot (4n + 1)$, $a_8 = 1 \cdot 33 = 33$.
2. $a_n = \frac{(-1)^{n+1}}{n + 2}$, $a_8$: l'esponente $9$ è dispari, $a_8 = -\frac{1}{10}$.

## Livello 3: ricorsione

`un termine` (70%): $a_1$ tra $-4$ e 6, $a_{n+1} = pa_n + r$ con $p \in \{2, 3, -1, -2, 1\}$, $r$ tra $-5$ e 5
(non nullo se $p = 1$), successione non costante, $k$ da 3 a 5, termini in valore assoluto fino a 500.
`due termini` (30%): $a_1$ e $a_2$ tra 1 e 5, $a_{n+2} = a_{n+1} + a_n$, $k$ da 5 a 7. I passaggi calcolano un
termine alla volta. Distrattori: il termine prima, il termine dopo, la legge applicata all'indice ($pk + r$).

1. $a_1 = 5$, $a_{n+1} = -2a_n - 3$: $a_2 = -13$, $a_3 = 23$, $a_4 = -49$.
2. $a_1 = 2$, $a_2 = 3$, $a_{n+2} = a_{n+1} + a_n$: $5, 8, 13$, quindi $a_5 = 13$.

## Livello 4: il posto di un numero

Tre righe: `a_n = ...`, `a_n = N`, `n = \ ?`. `lineare` (40%): $pn + c$ con $2 \le |p| \le 9$, posto tra 5 e
30. `quadratica` (60%): $n^2 + bn + c$ con $b \ne 0$; l'equazione ha una soluzione naturale tra 3 e 12 e una
intera negativa tra $-6$ e $-1$, come nell'esempio 2 della lezione. `params`: `case`, `coefs`, `value`.
Distrattori: il valore assoluto della soluzione scartata, il posto prima e quello dopo; per la lineare,
$N : p$ senza togliere $c$.

1. $a_n = n^2 - 6n - 9$, $a_n = 46$: $n^2 - 6n - 55 = 0$, $n = -5$ oppure $n = 11$; si accetta $n = 11$.
2. $a_n = -4n + 7$, $a_n = -69$: $n = 19$.

## Livello 5: crescente, decrescente o non monotona

Problema: `a_n = ...`. Quote: `crescente` 30%, `decrescente` 30%, `non monotona` 30%, `costante` 10%.
Famiglie (`params.family`):

- `lineare` ($pn + c$, `p`, `c`): crescente se $p > 0$, decrescente se $p < 0$;
- `fratta` ($\frac{pn + c}{n}$, `p`, `c`): crescente se $c < 0$, decrescente se $c > 0$;
- `quadratica` ($an^2 + bn + c$ con $a = \pm 1$, `a`, `b`, `c`): monotona quando la differenza
  $2an + a + b$ ha lo stesso segno per ogni $n \ge 1$; non monotona con $b$ pari e $|b| \ge 4$ di segno opposto ad
  $a$, così la differenza non vale mai zero;
- `alterna` (`g`: `c` per $(-1)^n \cdot c$, `n`, `n^2`, `pn` con $p = c + 1$, `1/n` per $\frac{(-1)^n}{n}$): non
  monotona;
- `costante` (`c`, `forma`): il numero $c$ oppure $(-1)^{2n} \cdot c$.

Opzioni fisse: `\text{crescente}`, `\text{decrescente}`, `\text{costante}`, `\text{non monotona}`. I passaggi
scrivono $a_{n+1} - a_n$ e il suo segno, come nel procedimento della lezione.

1. $a_n = -n^2 + 10n - 9$: $a_{n+1} - a_n = -2n + 9$, positiva per $n < 5$ e negativa dopo: non monotona.
2. $a_n = \frac{2n - 3}{n}$: $a_{n+1} - a_n = \frac{3}{n(n + 1)} > 0$: crescente.

## Livello 6: limitata o no

Problema: `a_n = ...`, dalle stesse famiglie. Un quarto ciascuna: `limitata` (fratta o alterna con `c` o
`1/n`), `inferiormente` (lineare con $p > 0$, quadratica con $a = 1$), `superiormente` (lineare con $p < 0$,
quadratica con $a = -1$), `nessuna` (alterna con `n`, `n^2`, `pn`). Opzioni fisse: `\text{limitata}`,
`\text{limitata solo inferiormente}`, `\text{limitata solo superiormente}`, e su due righe
`\begin{gathered} \text{non limitata né superiormente} \\ \text{né inferiormente} \end{gathered}`.

1. $a_n = -n^2 + 4n - 2$: limitata solo superiormente.
2. $a_n = (-1)^n \cdot 3n$: non limitata né superiormente né inferiormente.

## Da evitare

Frazioni che si semplificano in un polinomio; successioni ricorsive costanti; equazioni con due indici
naturali o con nessuno; differenze $a_{n+1} - a_n$ che valgono zero per un indice (la risposta onesta sarebbe
"non decrescente"); termini oltre 500 nella ricorsione.

## Domande per la revisione

- Livello 4: il numero dato è sempre un termine. Serve anche il caso "non è un termine della successione",
  come nella seconda parte dell'esempio 2 della lezione?
- Livello 5: il caso `costante` usa $(-1)^{2n} \cdot c$ oppure un numero solo. È un trabocchetto utile o
  disturba?
- Livello 6: le quattro etichette ("limitata solo inferiormente", "non limitata né superiormente né
  inferiormente") sono quelle che usate in classe?
- Livelli 5 e 6: i passaggi della limitatezza sono a parole, senza dimostrazione. Va bene a questo livello?
