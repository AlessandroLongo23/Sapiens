# Logaritmi e loro proprietà

Generatore: `logaritmi-proprieta` (`src/lib/exercises/v2/generators/logaritmi-proprieta.ts`), con il modulo
comune `src/lib/exercises/v2/logaritmi.ts`. Verifica indipendente:
`scripts/exercises/checkers/logaritmi_proprieta.py` (con `_logaritmi.py`). Lezione collegata:
`docs/lezioni/riscritte/124-logaritmi-proprieta.md`.

Lo studente calcola un logaritmo con la definizione, trova un argomento o una base, usa le proprietà per
calcolare, sviluppare e raccogliere, cambia base. I passaggi sono quelli della lezione: "chiama $x$ il
logaritmo, scrivi base e argomento come potenze dello stesso numero, uguaglia gli esponenti"; prodotto,
quoziente e potenza; la formula del cambiamento di base e le sue due conseguenze.

## Tipo di risposta

- Livelli 1, 2, 3, 4 e 7 (forme `prodotto` e `somma`): `number`, un razionale esatto. `toChoice()` costruisce le
  quattro opzioni da `params.cands`.
- Livelli 5, 6 e 7 (forma `calcolatrice`): `choice` fin dall'inizio, perché la risposta è un'espressione con
  logaritmi, che il correttore delle risposte aperte non legge.

Risposta aperta proposta: livelli 1, 2, 3, 4 e 7 a valore (`V`); 5 e 6 restano a scelta multipla; al livello 7
i campioni `calcolatrice` restano a scelta, come ogni campione la cui risposta è una scelta.

## Costruzione all'indietro e `params`

Si sceglie prima l'esponente (il risultato), poi si scrive il logaritmo. `params` contiene la forma (`form`), i
dati della forma e `cands`: le quattro opzioni, la giusta per prima con `tag: "giusta"`, le altre con il nome
dell'errore da cui vengono. I valori sono stringhe esatte: un razionale `"3/2"`, oppure un'espressione
`"log(13,6)"` (argomento, base), `"3+5*log(x,2)-(3)*log(y,2)"` per le opzioni che sono formule. Il controllo
riscrive il testo dai dati, ricalcola la risposta con SymPy e rifà ogni errore.

## Regole comuni

- $\log x$ senza base è in base $10$, $\ln x$ in base $e$; base intera a una cifra `\log_2`, frazionaria
  `\log_{\frac{1}{2}}`.
- Frazioni ridotte con il segno fuori; niente decimali.
- Quattro opzioni distinte per valore e per scrittura.

## Livello 1: logaritmo con la definizione

$\log_b b^n$ con $b \in \{2, 3, 4, 5, 10\}$ e $n$ intero, anche negativo o nullo (per $b = 2$ da $-5$ a $8$, per
$b = 3$ da $-4$ a $5$, per $4$, $5$ e $10$ da $-3$ a $4$). Nel 15% dei casi $\ln e^n$, con $n$ da $-3$ a $5$
diverso da $0$ e $1$. Forme: `esponente non negativo`, `esponente negativo`, `ln`.

- $\log_2 32 = 5$
- $\log_5 \frac{1}{5} = -1$

Distrattori: `quoziente` (argomento diviso per la base, $32 : 2 = 16$), `base` (il valore della base, per
$\log_b 1$ e $\log_b b$), `opposto`, `reciproco`, `vicino+`, `vicino-`.

## Livello 2: base e argomento potenze dello stesso numero

Base $b^m$ e argomento $b^n$ con $b \in \{2, 3, 5\}$, $m \in \{2, 3, -1, -2\}$ ($m \in \{2, -1\}$ per $b = 5$),
$n \neq 0$. Il risultato $\frac{n}{m}$ è frazionario, oppure è un intero negativo con la base minore di $1$: gli
interi che si leggono come al livello 1 sono esclusi. Forme metà e metà: `base maggiore di 1`, `base minore di 1`.

- $\log_{25} 125 = \frac{3}{2}$
- $\log_{\frac{1}{4}} 64 = -3$

Distrattori: `reciproco` ($\frac{m}{n}$), `opposto`, `solo argomento` ($n$), `differenza` ($n - m$), `vicino`.

## Livello 3: trovare l'argomento o la base

Forme metà e metà. `argomento`: $\log_b x = c$ con $b \in \{2, 3, 4, 5, 10, \frac{1}{2}, \frac{1}{3}\}$, $c$ da
$-3$ a $4$ diverso da $0$ e $1$. `base`: $\log_x B = c$ con $B = b^c$, $b$ da $2$ a $9$,
$c \in \{2, 3, -1, -2, -3\}$.

- $\log_{\frac{1}{2}} x = -1$, $x = 2$
- $\log_x \frac{1}{9} = -2$, $x = 3$

Distrattori. `argomento`: `prodotto` ($b \cdot c$), `segno` ($b^{-c}$), `scambiati` ($c^b$), `vicino`. `base`:
`reciproco`, `negativa` ($-b$, l'avviso della lezione sulla base positiva), `divisione` ($B : c$), `prodotto`.

## Livello 4: calcolare con le proprietà

Il risultato è un intero da $1$ a $5$, e nessun logaritmo del testo è intero da solo. Forme: `somma` (40%),
$\log_a p + \log_a q$ con $pq = a^k$, $a \in \{6, 10, 12, 15\}$; `differenza` (35%), $\log_a p - \log_a q$ con
$\frac{p}{q} = a^k$, $a \in \{2, 3, 5\}$; `coefficiente` (25%), $\log_a p + m\log_a q$ con $pq^m = a^k$.

- $\log_6 2 + \log_6 3 = 1$
- $\log_6 24 + 2\log_6 3 = 3$

Distrattori: `senza logaritmo` (il prodotto o il quoziente degli argomenti, $36$ invece di $2$),
`argomenti sommati` o `sottratti` ($\log_6 13$: il logaritmo di una somma), `prodotto dei logaritmi`,
`quoziente dei logaritmi`, `esponente dimenticato`, `vicino+`.

## Livello 5: sviluppare un logaritmo

$\log_a \frac{a^k x^m}{y^e}$ con $a \in \{2, 3, 5, 10\}$, $m$ da $2$ a $5$; forma `quoziente` (60%) con $e$ intero
da $2$ a $5$ diverso da $m$, forma `radice` (40%) con $\sqrt{y}$ o $\sqrt[3]{y}$.

- $\log_2 \frac{8x^5}{y^3} = 3 + 5\log_2 x - 3\log_2 y$
- $\log_5 \frac{5x^5}{\sqrt[3]{y}} = 1 + 5\log_5 x - \frac{1}{3}\log_5 y$

Distrattori: `numero senza logaritmo` ($8$ al posto di $3$), `segno` (più al posto di meno), `esponenti
dimenticati`.

## Livello 6: scrivere come un solo logaritmo

$m\log_a x + \log_a c - e\log_a y$, con $c \in \{2, 3, 5, 6, 7\}$ diverso da $a$, $m$ da $2$ a $4$, $e$ intero o
$\frac{1}{2}$.

- $4\log_2 x + \log_2 7 - 3\log_2 y = \log_2 \frac{7x^4}{y^3}$
- $4\log_5 x + \log_5 3 - \frac{1}{2}\log_5 y = \log_5 \frac{3x^4}{\sqrt{y}}$

Distrattori: `coefficienti come fattori` ($\log_2 \frac{28x}{3y}$), `segno` (tutto al numeratore), `somma`
($\log_2 (x^4 + 7 - y^3)$).

## Livello 7: cambiamento di base

Forme: `prodotto` (35%), $\log_a b \cdot \log_b a^k = k$; `somma` (40%), due logaritmi con basi potenze dello
stesso numero; `calcolatrice` (25%), quale espressione con $\log$ in base $10$ è uguale a $\log_a b$.

- $\log_5 3 \cdot \log_3 25 = 2$
- $\log_2 24 = \frac{\log 24}{\log 2}$

Distrattori. `prodotto`: `uno`, `argomento`, `argomenti moltiplicati`. `somma`: `differenza`, `reciproci`,
`senza basi`, `esponenti sommati`. `calcolatrice`: `rovesciata`, `logaritmo del quoziente` (l'avviso della
lezione), `prodotto`.

## Esercizi "brutti" da evitare

- Argomenti oltre $1024$, o frazioni con denominatore oltre $243$.
- Al livello 4, addendi che sono già potenze della base ($\log_2 8 + \log_2 4$): si risolvono senza proprietà.
- Al livello 7, $b$ potenza di $a$ o multiplo di $10$.

## Limiti noti

- Niente radicali nella base o nell'argomento numerico ($\log_{\sqrt{2}} 8$, esempio 2 della lezione).
- Niente "da due logaritmi noti agli altri" con i valori approssimati (esempio 7): servirebbero decimali.
- I livelli 5 e 6 hanno sempre tre fattori nella stessa disposizione.

## Verifiche fatte

Il 5 ottobre 2026:

- `sample.mts logaritmi-proprieta 1000 all <seed> | verify.py` con i seed 1, 50001 e 777001: PASS, 21.000 campioni, nessuno
  bocciato, quote delle forme negli intervalli di `CASE_RANGES`.
- 73 campioni con un errore piantato (opzione giusta scambiata dappertutto, risposta cambiata, indice della
  scelta spostato, un dato di `params` cambiato, testo cambiato, scrittura di un distrattore cambiata, errore
  sconosciuto, livello sbagliato): tutti bocciati.
- `review.mts`: codice 0. `width.mts`: codice 0. `npx eslint` sui file del generatore: pulito.
- Non provato: la risposta aperta con il correttore (`open-answers.mts`, `grade-check.mts`), perché il
  generatore non è nella tabella di `open-answers.ts`; l'esercizio sulla pagina del sito.

## Domande per la revisione

- Livello 1: il 15% di $\ln e^n$ va bene, o i logaritmi naturali meritano un livello loro?
- Livello 2: mancano i radicali ($\log_{\sqrt{2}} 8$, $\log_3 \sqrt{27}$). Li aggiungiamo qui o in un livello a parte?
- Livello 4, distrattore `senza logaritmo`: l'opzione è un numero grande ($36$) accanto a un numero piccolo ($2$). È un errore che vedete davvero?
- Livelli 5 e 6: sono a scelta multipla perché il correttore non legge i logaritmi. Serve la risposta aperta?
- Livello 7: tre tipi di esercizio nello stesso livello (prodotto, somma, calcolatrice). Meglio dividerli?
