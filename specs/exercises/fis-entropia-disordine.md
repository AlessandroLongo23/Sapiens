# Entropia e disordine

Generatore: `fis-entropia-disordine` (`src/lib/exercises/v2/generators/fis-entropia-disordine.ts`, con
`src/lib/exercises/v2/fis-frigo-entropia.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_entropia_disordine.py` (con `_fis_frigo_entropia.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/119-fis-entropia-disordine.md`. Percorso nel database:
`high_school/physics/fis-secondo-principio/fis-entropia-disordine`.

Cinque livelli nell'ordine della lezione, ognuno con una difficoltà in più. La lezione è in buona parte qualitativa:
i livelli sono conti e ragionamenti su casi generati, non definizioni. Simboli della lezione: $N$ molecole, $N_s$ a
sinistra e $N_d$ a destra, molteplicità $\Omega$ (non $W$, che è il lavoro), $S = k_B \ln \Omega$.

## Nomi dei livelli

1. Contare i microstati
2. La probabilità di un macrostato
3. Il macrostato più probabile
4. L'entropia dai microstati
5. L'espansione libera

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni. Livello 1: un numero intero esatto, senza unità. Livello 2: una percentuale con tre
cifre significative ($10{,}9\,\%$). Livello 3: un macrostato, scritto $N_s = 27$. Livello 4: un'entropia in
$\text{J/K}$ con tre cifre (quelle di $k_B$), in notazione scientifica. Livello 5: una variazione di entropia in
$\text{J/K}$ con due cifre (quelle del numero di molecole). Nessun risultato arrotondato a meno di $10^{-6}$ da un
confine, e nessun risultato intero che finisca con uno zero ai livelli 4 e 5. $k_B = 1{,}38 \cdot 10^{-23}\,\text{J/K}$,
scritto nel testo.

La scena `scatola-molecole` (nuova, `scenes/ScatolaMolecole.tsx`) disegna ai livelli 1 e 2 la scatola con le due
metà e le molecole del macrostato: sono i dati, non la risposta.

## Livello 1: contare i microstati

Da $4$ a $10$ molecole, con almeno una molecola per parte: $\Omega = N!/(N_s!\,N_d!)$. Distrattori: tutti i
microstati della scatola ($2^N$), un fattoriale dimenticato al denominatore, $N_s \cdot N_d$, $N \cdot N_s$.

- "In una scatola divisa in due metà ci sono $8$ molecole. Quanti microstati ha il macrostato con $6$ molecole a
  sinistra e $2$ a destra?" Risposta $28$; distrattori $256$, $56$, $12$.
- "... $7$ molecole ... $1$ molecola a sinistra e $6$ a destra?" Risposta $7$; distrattori $128$, $6$, $14$.

## Livello 2: la probabilità di un macrostato

Da $4$ a $10$ molecole, anche con una metà vuota: $P = \Omega/2^N$, in percentuale. Distrattori: la frazione di
molecole a sinistra ($N_s/N$), la probabilità di un solo microstato ($1/2^N$), $\Omega/(2N)$ (il doppio al posto della
potenza, solo se non supera il $100\,\%$), $1/\Omega$.

- "... $8$ molecole, che si muovono a caso. Qual è la probabilità di trovarne $6$ a sinistra e $2$ a destra?" Risposta
  $10{,}9\,\%$; distrattori $75{,}0\,\%$, $0{,}391\,\%$, $3{,}57\,\%$.
- "... $7$ molecole ... $0$ a sinistra e $7$ a destra?" Risposta $0{,}781\,\%$.

## Livello 3: il macrostato più probabile

$20$, $30$, $40$, $50$, $60$, $80$ o $100$ molecole e quattro macrostati, a distanze tutte diverse dalla divisione a
metà e non tutti dalla stessa parte. Si chiede, senza contare, quale ha più microstati o l'entropia più grande (metà,
caso "massimo": il più vicino a $N/2$) oppure meno microstati o l'entropia più piccola (metà, caso "minimo": il più
lontano). Le opzioni sono i quattro macrostati.

- "In una scatola divisa in due metà $60$ molecole si muovono a caso. Quale di questi macrostati, indicati con il
  numero $N_s$ di molecole a sinistra, ha meno microstati?" Opzioni $N_s = 36$, $5$, $38$, $47$; risposta $N_s = 5$.
- "... $50$ molecole ... ha più microstati?" Opzioni $N_s = 10$, $0$, $33$, $27$; risposta $N_s = 27$.

## Livello 4: l'entropia dai microstati

Un macrostato con $\Omega = a \cdot 10^b$ microstati ($a$ da $1{,}1$ a $9{,}9$ senza zero finale, $b$ da $10$ a $60$):
$S = k_B \ln \Omega$. Distrattori: il logaritmo decimale, la costante dimenticata ($\ln \Omega$ come se fosse in
$\text{J/K}$), il logaritmo dimenticato ($k_B\,\Omega$).

- "Un macrostato di un sistema ha $\Omega = 7{,}2 \cdot 10^{49}$ microstati." Risposta $1{,}58 \cdot 10^{-21}\,\text{J/K}$;
  distrattori $6{,}88 \cdot 10^{-22}$, $115$, $9{,}94 \cdot 10^{26}$.
- "... $\Omega = 5{,}7 \cdot 10^{10}$ ..." Risposta $3{,}42 \cdot 10^{-22}\,\text{J/K}$.

## Livello 5: l'espansione libera

Un gas perfetto con $a \cdot 10^b$ molecole ($a$ come sopra, $b$ da $20$ a $24$) si espande liberamente e il volume
raddoppia, triplica, o diventa $4$ o $5$ volte più grande: $\Delta S = N\,k_B \ln(V_B/V_A)$ (l'esempio 4 della
lezione). Distrattori: il logaritmo dimenticato, il logaritmo decimale, il numero di molecole dimenticato, il rapporto
meno uno.

- "Un gas perfetto con $7{,}2 \cdot 10^{23}$ molecole si espande liberamente in un recipiente isolato, e il suo volume
  raddoppia." Risposta $6{,}9\,\text{J/K}$; distrattori $3{,}0$, $9{,}6 \cdot 10^{-24}$, e il valore senza logaritmo
  quando non finisce con uno zero.
- "... $5{,}7 \cdot 10^{20}$ molecole ... diventa $4$ volte più grande." Risposta $0{,}011\,\text{J/K}$.

## Esercizi da evitare

- Al livello 1 una metà vuota: la risposta sarebbe sempre $1$.
- Al livello 3 due macrostati alla stessa distanza dalla metà (stessa molteplicità), o tutti dalla stessa parte: la
  regola "il numero più grande" darebbe la risposta giusta per caso.
- Più di $10$ molecole ai livelli 1 e 2: i fattoriali non si fanno più a mano.

## Verifica

`fis_entropia_disordine.py` rilegge il testo, ricalcola i coefficienti binomiali e i logaritmi con SymPy e, al livello
3, confronta le molteplicità vere dei quattro macrostati (non la distanza dalla metà).

## Domande per la revisione

- Al livello 2 la probabilità in percentuale con tre cifre, o come frazione ($7/64$)?
- Serve un livello sulla freccia del tempo (quale di tre processi è irreversibile)? Oggi è solo nelle flashcard e
  nell'esempio 5 della lezione.
