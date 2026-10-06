# Disequazioni logaritmiche

Generatore: `disequazioni-logaritmiche` (`src/lib/exercises/v2/generators/disequazioni-logaritmiche.ts`), con
il modulo comune `src/lib/exercises/v2/logaritmi.ts`. Verifica indipendente:
`scripts/exercises/checkers/disequazioni_logaritmiche.py` (con `_logaritmi.py`). Lezione collegata:
`docs/lezioni/riscritte/127-disequazioni-logaritmiche.md`.

La consegna è sempre "Risolvi la disequazione.". I passaggi seguono la lezione: il numero scritto come
logaritmo, il verso conservato con la base maggiore di $1$ e rovesciato con la base minore di $1$, le condizioni
di esistenza (C.E.) a sistema. Il livello 7 è la sezione della lezione sulle disequazioni esponenziali che si
risolvono con i logaritmi; quelle che si riconducono alla stessa base stanno in `disequazioni-esponenziali`.

## Tipo di risposta

`choice` fin dall'inizio, a tutti i livelli, come `disequazioni-secondo-grado`: la risposta è un'unione di
intervalli. Le opzioni sono scritte con gli intervalli della lezione, $S = \mathopen{]}2, 4\mathclose{[}$
(`\mathopen{]}`, `\mathclose{[}`; `\left]` e `\right[` intorno a frazioni e logaritmi), due intervalli con una
frazione su due righe; $S = \mathbb{R}$ e $S = \emptyset$. La forma con "oppure" compare solo nell'ultimo
passaggio. Valori: un intervallo per elemento, `"(2;4)"`, `"[-1;0)"`, `"(-oo;log(4,3)-4]"`, con il punto e
virgola tra gli estremi; $\mathbb{R}$ è `"(-oo;oo)"`, $\emptyset$ la lista vuota.

Risposta aperta: nessun livello, finché manca il tipo "unione di intervalli".

## Costruzione e `params`

La soluzione è calcolata sugli intervalli: C.E., disequazione tra gli argomenti, parte comune. `params`
contiene `form`, i dati, il verso (`op`: `<`, `>`, `<=`, `>=`) e `cands`. Il controllo rifà il calcolo in avanti
e poi prova la disequazione di partenza, con i logaritmi, su numeri tra gli estremi, accanto a ogni estremo e
lontano; ogni estremo finito è controllato a parte: fuori se lì un argomento si annulla, altrimenti dentro solo
con $\geq$ e $\leq$.

## Regole comuni

- I quattro versi con la stessa frequenza, salvo dove è detto.
- Gli estremi che vengono dalle C.E. sono sempre esclusi.
- La soluzione non è mai vuota, tranne nella forma `secondo membro negativo` del livello 7.

## Livello 1: un logaritmo e un numero, base maggiore di 1

$\log_a (mx + n)\ \text{op}\ c$ con $a \in \{2, 3, 5, 10\}$, $c$ da $-3$ a $3$, $m \in \{1, 2, 3, -1, -2\}$, $n$
non nullo. Forme: `verso maggiore` (la C.E. è già compresa), `verso minore` (serve la C.E.).

- $\log_5 (2 - x) > 2$: $S = \mathopen{]}-\infty, -23\mathclose{[}$
- $\log_5 (2x - 5) < 1$: $S = \left]\frac{5}{2}, 5\right[$

Distrattori: `senza C.E.` (l'avviso "la condizione di esistenza dimenticata"), `verso`, `estremi`,
`senza potenza` ($mx + n\ \text{op}\ c$), `verso senza C.E.`, `solo C.E.`.

## Livello 2: un logaritmo e un numero, base minore di 1

Come il livello 1 con $a \in \{\frac{1}{2}, \frac{1}{3}, \frac{1}{4}, \frac{1}{5}, \frac{1}{10}\}$: il verso si
rovescia.

- $\log_{\frac{1}{5}} (8 - 2x) > -1$: $S = \left]\frac{3}{2}, 4\right[$
- $\log_{\frac{1}{5}} (2x - 5) < 1$: $S = \left]\frac{13}{5}, +\infty\right[$

Distrattori: gli stessi; `verso` è qui l'errore di chi non rovescia il verso.

## Livello 3: argomento di secondo grado

$\log_a (x^2 + bx + c)\ \text{op}\ k$ con base maggiore o minore di $1$ e $a^k$ intero fino a $30$. L'argomento
ha zeri interi $s_1 < s_2$ e $x^2 + bx + c - a^k$ ha zeri interi $r_1 < s_1 < s_2 < r_2$. Forme: `valori esterni`
($x \leq r_1$ oppure $x \geq r_2$), `due intervalli` (tra $r_1$ e $s_1$ e tra $s_2$ e $r_2$).

- $\log_2 (x^2 - 3x) > 2$: $S = \mathopen{]}-\infty, -1\mathclose{[} \cup \mathopen{]}4, +\infty\mathclose{[}$
- $\log_{\frac{1}{3}} (x^2 + 2x - 15) \geq -2$: $S = [-6, -5\mathclose{[} \cup \mathopen{]}3, 4]$

Distrattori: `senza C.E.`, `verso`, `estremi`, `verso senza C.E.`, `solo C.E.`.

## Livello 4: due logaritmi con la stessa base

$\log_a (m_1 x + n_1)\ \text{op}\ \log_a (m_2 x + n_2)$, forme metà e metà per la base. Tre condizioni a sistema.

- $\log_2 (2 - x) > \log_2 (x + 5)$: $S = \left]-5, -\frac{3}{2}\right[$
- $\log_{\frac{1}{5}} (2x + 5) < \log_{\frac{1}{5}} (7 - 2x)$: $S = \left]\frac{1}{2}, \frac{7}{2}\right[$

Distrattori: `senza C.E.`, `verso`, `estremi`, `una sola C.E.`, `solo C.E.`.

## Livello 5: disequazioni con le proprietà

Base maggiore di $1$. Forme: `somma` (55%), $\log_a (x + p) + \log_a (x + q)\ \text{op}\ c$; `differenza` (45%),
$\log_a (x + p) - \log_a (x + q)\ \text{op}\ c$, solo con $>$ e $\geq$: con $<$ la soluzione coinciderebbe con
le sole C.E. o con la sola disequazione.

- $\log_2 x + \log_2 (x + 1) \leq 1$: $S = \mathopen{]}0, 1]$
- $\log_3 (x + 12) - \log_3 (x - 4) > 2$: $S = \mathopen{]}4, 6\mathclose{[}$

Distrattori: `senza C.E.`, `verso`, `estremi`, `argomenti sommati` (somma), `potenza dalla parte sbagliata`
(differenza), `solo C.E.`.

## Livello 6: disequazioni con una sostituzione

$\log_a^2 x + B\log_a x + C\ \text{op}\ 0$ con $a \in \{2, 3, 10, \frac{1}{2}\}$ e $t_1 < t_2$ interi. Forme:
`valori esterni`, `valori interni`.

- $\log^2 x - 2\log x - 3 > 0$: $S = \left]0, \frac{1}{10}\right[ \cup \mathopen{]}1000, +\infty\mathclose{[}$
- $\log^2 x - 3\log x + 2 < 0$: $S = \mathopen{]}10, 100\mathclose{[}$

Distrattori: `non torna alla x` (gli intervalli in $t$), `senza C.E.` (manca $x > 0$), `verso`, `estremi`,
`verso senza C.E.`.

## Livello 7: esponenziali con i logaritmi

$a^{x + k}\ \text{op}\ b$. Forme: `base maggiore di 1` (45%), `base minore di 1` (35%,
$a \in \{\frac{1}{2}, \frac{1}{3}\}$), `secondo membro negativo` (20%: $S = \mathbb{R}$ oppure $S = \emptyset$).
$|b|$ da $2$ a $30$ non è una potenza di $a$.

- $3^{x + 4} \leq 4$: $S = \left]-\infty, \log_3 4 - 4\right]$
- $\left(\frac{1}{3}\right)^{x + 4} < -25$: $S = \emptyset$

Distrattori: `verso`, `estremi`, `base e argomento scambiati`, `quoziente`, `segno di k`; per il secondo
membro negativo: `caso opposto`, `segno ignorato`, `segno ignorato e verso`.

## Esercizi "brutti" da evitare

- Estremi con denominatore oltre $6$ (oltre $4$ ai livelli 4 e 5).
- Soluzione vuota ai livelli da 1 a 6.
- Al livello 5, una differenza in cui C.E. o disequazione non contano.

## Limiti noti

- Una sola notazione per le opzioni (gli intervalli), non le disequazioni con "oppure".
- Mancano il quoziente con un logaritmo (esempio 10 della lezione), le esponenziali con basi diverse nei due
  membri (esempio 12) e con la sostituzione (esempio 13).
- Al livello 7 la base minore di $1$ dà l'estremo $\log_{\frac{1}{3}} 10 - 4$, non $-\log_3 10 - 4$.

## Verifiche fatte

Il 5 ottobre 2026:

- `sample.mts disequazioni-logaritmiche 1000 all <seed> | verify.py` con i seed 1, 50001 e 777001: PASS, 21.000 campioni, nessuno
  bocciato, quote delle forme negli intervalli di `CASE_RANGES`.
- 73 campioni con un errore piantato (opzione giusta scambiata dappertutto, risposta cambiata, indice della
  scelta spostato, un dato di `params` cambiato, testo cambiato, scrittura di un distrattore cambiata, errore
  sconosciuto, livello sbagliato): tutti bocciati.
- `review.mts`: codice 0. `width.mts`: codice 0. `npx eslint` sui file del generatore: pulito.
- Non provato: la risposta aperta con il correttore (`open-answers.mts`, `grade-check.mts`), perché il
  generatore non è nella tabella di `open-answers.ts`; l'esercizio sulla pagina del sito.

## Domande per la revisione

- Opzioni scritte solo con gli intervalli. Volete anche la forma $2 < x \leq 4$, metà e metà come in `disequazioni-secondo-grado`?
- Livello 3: basi maggiori e minori di $1$ insieme. Va bene, o la base minore di $1$ con l'argomento di secondo grado merita un livello suo?
- Livello 5: la differenza compare solo con $>$ e $\geq$. È un limite accettabile?
- Livello 7: l'estremo con la base minore di $1$ è scritto $\log_{\frac{1}{3}} 10 - 4$. Preferisci $-\log_3 10 - 4$?
- Serve un livello con lo studio del segno (quoziente con un logaritmo), come l'esempio 10 della lezione?
