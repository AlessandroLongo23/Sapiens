# Equazioni logaritmiche

Generatore: `equazioni-logaritmiche` (`src/lib/exercises/v2/generators/equazioni-logaritmiche.ts`), con il
modulo comune `src/lib/exercises/v2/logaritmi.ts`. Verifica indipendente:
`scripts/exercises/checkers/equazioni_logaritmiche.py` (con `_logaritmi.py`). Lezione collegata:
`docs/lezioni/riscritte/126-equazioni-logaritmiche.md`.

La consegna è sempre "Risolvi l'equazione.". I passaggi seguono il procedimento della lezione: condizioni di
esistenza (C.E.) sull'equazione di partenza, proprietà per arrivare a $\log_a f(x) = c$ oppure
$\log_a f(x) = \log_a g(x)$, passaggio agli argomenti, confronto con le C.E. I livelli 6 e 7 sono le equazioni
esponenziali che si risolvono solo con un logaritmo, che la lezione tratta nella sua sezione dedicata; quelle
che si riconducono alla stessa base stanno in `equazioni-esponenziali`.

## Tipo di risposta

- Livelli da 1 a 5: `set`, i valori razionali in ordine crescente, `"3"`, `"-1/3"`, e `latex` come
  $S = \left\{-1, 3\right\}$, $S = \emptyset$. `toChoice()` costruisce le quattro opzioni da `params.cands`.
- Livelli 6 e 7: `choice` fin dall'inizio. Le soluzioni sono logaritmi, `"log(7,2)"`, `"log(39,2)-4"`
  (argomento, base), che il correttore delle risposte aperte non legge (`fromSympy` si ferma su `log(39,7)-2`):
  un campione con `answer` di tipo `set` risulterebbe a risposta aperta senza poter essere corretto. Le opzioni
  sono scritte come insiemi, con gli stessi valori, e `params.cands` tiene la giusta per prima.

Risposta aperta: livelli da 1 a 5 a valore (`V`); 6 e 7 solo a scelta multipla.

## Costruzione all'indietro e `params`

Si scelgono prima le soluzioni e poi si scrive l'equazione. `params` contiene `form`, i dati e `cands` (la
giusta per prima). Il controllo procede in avanti: toglie i logaritmi, risolve con SymPy l'equazione che resta,
tiene le radici per cui ogni argomento è positivo, e rimette ogni soluzione nell'equazione di partenza.

## Livello 1: un logaritmo uguale a un numero

$\log_a (mx + n) = c$ con $a \in \{2, 3, 5, 10, \frac{1}{2}, \frac{1}{3}\}$, $c$ da $-2$ a $3$,
$m \in \{1, 2, 3, -1, -2\}$, $n$ da $-9$ a $9$ non nullo. Soluzione non nulla, anche negativa o frazionaria.

- $\log_3 (2x + 7) = 2$: $S = \{1\}$
- $\log_3 (-x - 1) = 2$: $S = \{-10\}$

Distrattori: `scartata perché negativa` ($S = \emptyset$, solo quando la soluzione è negativa: l'avviso "a dover
essere positivo è l'argomento"), `senza potenza` ($mx + n = c$), `prodotto` ($mx + n = a \cdot c$),
`esponente opposto`, `opposto`.

## Livello 2: argomento di secondo grado

$\log_a (x^2 + bx + c) = k$ con $a \in \{2, 3, 5, 10\}$, $k$ da $0$ a $3$, due soluzioni intere distinte, non
nulle e non opposte, tutte e due accettabili. Forme: `segni opposti` (70%), `stesso segno` (30%).

- $\log_5 (x^2 - 7x - 13) = 1$: $S = \{-2, 9\}$
- $\log_2 (x^2 - 15x + 64) = 3$: $S = \{7, 8\}$

Distrattori: `solo la maggiore`, `solo la minore`, `segni cambiati`, `vuoto`.

## Livello 3: due logaritmi con la stessa base

$\log_a (x^2 + bx + c) = \log_a (mx + n)$, base intera. L'equazione tra gli argomenti ha due radici intere; forme:
`una scartata` (60%), `due accettabili` (25%), `nessuna accettabile` (15%).

- $\log_5 (x^2 - 7x - 29) = \log_5 (-3x - 8)$: radici $-3$ e $7$, $S = \{-3\}$
- $\log_5 (x^2 + 5x - 4) = \log_5 (x - 4)$: radici $-4$ e $0$, $S = \emptyset$

Opzioni: i quattro sottoinsiemi delle due radici (`senza condizioni`, `solo la minore`, `solo la maggiore`,
`vuoto`).

## Livello 4: equazioni con le proprietà

Forme: `somma` (40%), $\log_a (x + p) + \log_a (x + q) = c$, due radici intere di cui una sola accettabile;
`differenza` (35%), $\log_a (x + p) - \log_a (x + q) = c$; `numero` (25%),
$\log_a (mx + n) = c + \log_a (x + q)$. Soluzione intera.

- $\log_{12} (x + 3) + \log_{12} (x + 14) = 1$: $S = \{-2\}$
- $\log_2 (5x + 19) = 3 + \log_2 (x + 2)$: $S = \{1\}$

Distrattori. `somma`: `senza condizioni` (tutte e due le radici: l'avviso sulle C.E. scritte dopo le
proprietà), `scartata la buona`, `argomenti sommati` (il logaritmo di una somma), `vuoto`. `differenza`:
`potenza dalla parte sbagliata`, `senza potenza`, `vuoto`, `opposto`, `vicino`. `numero`: `numero sommato`,
`senza potenza`, `vuoto`, `opposto`, `vicino`.

## Livello 5: equazioni con una sostituzione

$\log_a^2 x + B\log_a x + C = 0$ con $a \in \{2, 3, 10\}$ e $t_1 < t_2$ interi da $-3$ a $3$, non opposti. Forme:
`un valore negativo`, `valori non negativi`.

- $\log_2^2 x - 3\log_2 x + 2 = 0$: $S = \{2, 4\}$
- $\log^2 x - \log x - 2 = 0$: $S = \left\{\frac{1}{10}, 100\right\}$

Distrattori: `non torna alla x` ($\{t_1, t_2\}$), `valore negativo scartato` (l'errore di chi tratta $t$ come
nelle esponenziali), `prodotto`, `esponenti opposti`, `solo il maggiore`.

## Livello 6: esponenziali con i logaritmi

$a^{x + k} = b$ con $a \in \{2, 3, 5, 7, 10\}$. Forme: `esponente x` (30%), `esponente x + k` (55%, $k$ da $-4$ a
$4$), `impossibile` (15%, $b$ negativo). Con $b$ positivo, $b$ da $2$ a $40$ non è una potenza di $a$.

- $7^x = 16$: $S = \{\log_7 16\}$
- $2^{x + 2} = -7$: $S = \emptyset$

Distrattori: `base e argomento scambiati`, `segno di k`, `quoziente` ($\frac{b}{a} - k$), `vuoto`; per
`impossibile`: `segno ignorato`, `logaritmo del reciproco`, `quoziente`.

## Livello 7: esponenziali con sostituzione e logaritmo

$a^{2x} - (u + v)a^x + uv = 0$ con $a \in \{2, 3\}$, scritta con $4^x$ o $9^x$; $u = a^j$, $v$ non potenza di
$a$. Forme: `un logaritmo` (65%, $v > 0$), `un valore scartato` (35%, $v < 0$).

- $4^x - 15 \cdot 2^x + 56 = 0$: $S = \{\log_2 7, 3\}$
- $9^x + 4 \cdot 3^x - 21 = 0$: $S = \{1\}$

Distrattori: `non torna alla x`, `solo la soluzione intera`, `base e argomento scambiati`, `quoziente`,
`valore negativo non scartato`, `vuoto`.

## Esercizi "brutti" da evitare

- Coefficienti oltre $150$, soluzioni con denominatore oltre $12$.
- Al livello 3, un argomento che si annulla in una radice.
- Ai livelli 6 e 7, secondi membri che sono potenze della base: sono di `equazioni-esponenziali`.

## Limiti noti

- Le soluzioni con un logaritmo sono scritte $\log_a b - k$; non c'è la forma $\frac{\log b}{\log a}$.
- Mancano: l'esponente pari ($\log_2 x^2 = 4$), le basi diverse ($\log_2 x + \log_4 x = 3$), le esponenziali con
  basi diverse nei due membri ($2^{x + 1} = 3^x$), il metodo grafico.
- Al livello 4 `differenza` e `numero` hanno sempre la soluzione accettabile.

## Verifiche fatte

Il 5 ottobre 2026:

- `sample.mts equazioni-logaritmiche 1000 all <seed> | verify.py` con i seed 1, 50001 e 777001: PASS, 21.000 campioni, nessuno
  bocciato, quote delle forme negli intervalli di `CASE_RANGES`.
- 73 campioni con un errore piantato (opzione giusta scambiata dappertutto, risposta cambiata, indice della
  scelta spostato, un dato di `params` cambiato, testo cambiato, scrittura di un distrattore cambiata, errore
  sconosciuto, livello sbagliato): tutti bocciati.
- `review.mts`: codice 0. `width.mts`: codice 0. `npx eslint` sui file del generatore: pulito.
- Dopo il collegamento al sito, con i livelli 6 e 7 resi a scelta: `open-answers.mts` esce con 0 e
  `grade-check.mts 100 equazioni-logaritmiche` non ha fallimenti. Non provato: l'esercizio sulla pagina del sito.

## Domande per la revisione

- Livello 3: l'argomento di secondo grado sta sempre a sinistra. Serve anche il caso con due argomenti di primo grado, che può dare $S = \emptyset$?
- Livello 4: nella differenza la soluzione è sempre accettabile. Vuoi anche qui casi con $S = \emptyset$?
- Livelli 6 e 7: la soluzione resta $\log_2 39 - 4$. Va bene, o in verifica chiedete $\log_2 \frac{39}{16}$ oppure il valore approssimato?
- Mancano le equazioni con l'esponente pari e con basi diverse: un livello in più, o restano alla lezione?
- Insieme delle soluzioni scritto $S = \left\{\log_2 7, 3\right\}$, in ordine di valore: va bene mettere il logaritmo prima dell'intero quando è più piccolo?
