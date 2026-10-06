# Funzione logaritmica

Generatore: `funzioni-logaritmiche` (`src/lib/exercises/v2/generators/funzioni-logaritmiche.ts`), con il
modulo comune `src/lib/exercises/v2/logaritmi.ts`. Verifica indipendente:
`scripts/exercises/checkers/funzioni_logaritmiche.py` (con `_logaritmi.py`). Lezione collegata:
`docs/lezioni/riscritte/125-funzioni-logaritmiche.md`.

Gli esercizi seguono le sezioni della lezione: il grafico per punti, il segno del logaritmo da base e argomento,
il confronto tra logaritmi con la stessa base, tra quali interi sta un logaritmo, il dominio, il grafico
traslato. Non ci sono figure: ogni esercizio si risolve dalle proprietà, senza leggere un disegno.

## Tipo di risposta

- Livelli 1 e 4: `number`, con `toChoice()` che costruisce le opzioni da `params.cands`.
- Livelli 2, 3, 5, 6 e 7: `choice` fin dall'inizio (un'etichetta, una catena di disuguaglianze, un insieme
  scritto con gli intervalli, una coppia asintoto e punto).

Risposta aperta proposta: livelli 1 e 4 a valore (`V`). I domini (5 e 6) sono intervalli, non "valori esclusi":
`EXCLUDED` non si applica, e restano a scelta multipla.

## Costruzione e `params`

`params` contiene `form`, i dati e `cands` (le quattro opzioni, la giusta per prima). Punti con la virgola,
$P(8, k)$, come nella lezione. I domini si scrivono $D = \dots$ con le parentesi quadre rovesciate
(`\mathopen{]}`, `\mathclose{[}`; `\left]` e `\right[` intorno alle frazioni); due intervalli con una frazione
vanno su due righe. Valori di un intervallo: `"(3/2;oo)"`, `"[-1;4)"`, con il punto e virgola tra gli estremi.

## Livello 1: un punto del grafico

$y = \log_b x$ con $b \in \{2, 3, 4, 5, 10, \frac{1}{2}, \frac{1}{3}\}$ e un punto $P$ con una coordinata da
trovare. Forme metà e metà: `ordinata` ($P(b^n, k)$, trova $k$), `ascissa` ($P(h, n)$, trova $h$), con $n$ da $-3$
a $4$ diverso da $0$ (e da $1$ per l'ascissa).

- $y = \log_{\frac{1}{2}} x$, $P(2, k)$: $k = -1$
- $y = \log_3 x$, $P(h, 3)$: $h = 27$

Distrattori. `ordinata`: `quoziente`, `opposto`, `ascissa` (la coordinata data), `reciproco`, `vicino`.
`ascissa`: `prodotto` ($b \cdot n$), `segno` ($b^{-n}$), `scambiati` ($n^b$), `ordinata`.

## Livello 2: il segno di un logaritmo

$\log_b a$ con $b \in \{2, 3, 5, 10, \frac{1}{2}, \frac{1}{3}, \frac{1}{5}\}$. Quattro opzioni fisse: positivo,
negativo, nullo, non esiste. Forme: `base maggiore di 1` e `base minore di 1` (80% in tutto, argomento sopra o
sotto $1$ metà e metà), `argomento 1` (10%), `argomento non positivo` (10%). Mai argomento uguale alla base o al
suo reciproco.

- $\log_{\frac{1}{3}} \frac{9}{2}$: negativo
- $\log_3 \frac{3}{7}$: negativo

## Livello 3: ordinare tre logaritmi

Tre logaritmi con la stessa base ($2$, $3$, $5$ oppure $\frac{1}{2}$, $\frac{1}{3}$) e tre argomenti interi
distinti da $2$ a $40$, dati in ordine casuale. Forme metà e metà per la base.

- $\log_5 16 < \log_5 35 < \log_5 38$
- $\log_{\frac{1}{2}} 38 < \log_{\frac{1}{2}} 32 < \log_{\frac{1}{2}} 21$

Distrattori: `verso` (l'ordine rovesciato: l'avviso della lezione sulla base minore di $1$), `primi scambiati`,
`ultimi scambiati`.

## Livello 4: tra quali interi sta un logaritmo

$n < \log_a b < n + 1$ con $a \in \{2, 3, 5, 10\}$; $b$ intero che non è una potenza di $a$ (65%, forma
`argomento maggiore di 1`) oppure reciproco di un tale intero (35%, `argomento minore di 1`).

- $n < \log_5 184 < n + 1$: $n = 3$
- $n < \log_2 \frac{1}{155} < n + 1$: $n = -8$

Distrattori: `superiore` ($n + 1$, per gli argomenti minori di $1$ è l'errore di chi prende $-7$), `opposto`,
`inferiore`, `quoziente`.

## Livello 5: dominio con argomento di primo grado

$f(x) = \log(mx + n)$ con base tra $2$, $3$, $10$, $e$, $\frac{1}{2}$, $m$ da $-4$ a $4$, $n$ da $-9$ a $9$ non
nulli, estremo con denominatore fino a $4$. Forme metà e metà per il segno di $m$.

- $f(x) = \log_3 (2x - 3)$: $D = \left]\frac{3}{2}, +\infty\right[$
- $f(x) = \log_{\frac{1}{2}} (5 - 3x)$: $D = \left]-\infty, \frac{5}{3}\right[$

Distrattori: `chiuso` (estremo compreso: l'avviso "verso $>$, mai $\geq$"), `verso`, `segno` (estremo con il
segno sbagliato), `verso chiuso`.

## Livello 6: dominio con argomento di secondo grado o fratto

Forme metà e metà. `secondo grado`: $\pm(x - r_1)(x - r_2)$ sviluppato, zeri interi distinti da $-6$ a $6$.
`fratto`: $\frac{x - r_1}{x - r_2}$ oppure $\frac{r_1 - x}{x - r_2}$, zeri da $-7$ a $7$ non nulli.

- $f(x) = \log_2 (-x^2 + 11x - 30)$: $D = \mathopen{]}5, 6\mathclose{[}$
- $f(x) = \ln \frac{x - 6}{x - 7}$: $D = \mathopen{]}-\infty, 6\mathclose{[} \cup \mathopen{]}7, +\infty\mathclose{[}$

Distrattori. `secondo grado`: `scambiati` (interni al posto di esterni), `chiuso`, `scambiati chiuso`. `fratto`:
`scambiati`, `solo numeratore`, `zero compreso` (lo zero del numeratore incluso).

## Livello 7: grafico traslato

$y = \log_a (x - h) + k$ con $a \in \{2, 3\}$, $h$ da $-6$ a $6$ e $k$ da $-2$ a $2$, non nulli. Si chiedono
l'asintoto verticale e il punto sull'asse $x$; le opzioni sono su due righe.

- $y = \log_2 (x - 3) - 1$: asintoto $x = 3$, punto $(5, 0)$
- $y = \log_3 (x + 4) + 1$: asintoto $x = -4$, punto $\left(-\frac{11}{3}, 0\right)$

Distrattori: `segno` ($x = -h$: l'avviso "il più dentro l'argomento sposta a sinistra"), `senza k` (il punto
$(1 + h, 0)$), `esponente` ($h + a^{k}$ al posto di $h + a^{-k}$).

## Esercizi "brutti" da evitare

- Al livello 2, logaritmi che valgono $1$ o $-1$ a vista.
- Al livello 4, argomenti che sono potenze della base.
- Al livello 7, $k$ oltre $2$ in valore assoluto: il punto avrebbe denominatore $27$.

## Limiti noti

- Nessuna lettura dal grafico e nessun esercizio sull'inversa o sulla simmetria con $y = a^x$.
- Il dominio con il logaritmo al denominatore o sotto radice (esempio 6 della lezione) manca.
- Al livello 6 l'argomento con $a$ negativo è scritto $-x^2 + 11x - 30$, non $11x - x^2 - 30$.

## Verifiche fatte

Il 5 ottobre 2026:

- `sample.mts funzioni-logaritmiche 1000 all <seed> | verify.py` con i seed 1, 50001 e 777001: PASS, 21.000 campioni, nessuno
  bocciato, quote delle forme negli intervalli di `CASE_RANGES`.
- 73 campioni con un errore piantato (opzione giusta scambiata dappertutto, risposta cambiata, indice della
  scelta spostato, un dato di `params` cambiato, testo cambiato, scrittura di un distrattore cambiata, errore
  sconosciuto, livello sbagliato): tutti bocciati.
- `review.mts`: codice 0. `width.mts`: codice 0. `npx eslint` sui file del generatore: pulito.
- Non provato: la risposta aperta con il correttore (`open-answers.mts`, `grade-check.mts`), perché il
  generatore non è nella tabella di `open-answers.ts`; l'esercizio sulla pagina del sito.

## Domande per la revisione

- Livello 1: assomiglia al livello 1 di `logaritmi-proprieta`, detto con le coordinate. Va bene come ingresso, o meglio una lettura da un grafico disegnato?
- Livello 2: le opzioni sono sempre le stesse quattro. È accettabile, o preferisci un confronto con $0$ scritto in simboli?
- Livello 3: tre logaritmi con argomenti a due cifre. Aggiungiamo argomenti frazionari?
- Livello 6: serve anche il dominio di $\frac{1}{\ln x}$ e $\sqrt{\log_2 x}$, che la lezione ha nell'esempio 6?
- Livello 7: asintoto e punto insieme in una risposta sola, su due righe. Meglio due livelli separati?
