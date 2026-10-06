# Gruppi, periodi e blocchi

Generatore: `gruppi-periodi` (`src/lib/exercises/v2/generators/gruppi-periodi.ts`, con `src/lib/exercises/v2/chim3-b.ts`).
Verifica indipendente: `scripts/exercises/checkers/gruppi_periodi.py` (con `_chim3_b.py`). Lezione collegata:
`docs/lezioni/chimica/riscritte/57-gruppi-periodi.md`. Percorso nel database:
`high_school/chemistry/tavola-periodica/gruppi-periodi`.

Cinque livelli nell'ordine della lezione, ognuno con una difficoltà in più. Tutti a scelta multipla, quattro opzioni.

## Nomi dei livelli

1. Periodi, gruppi e blocchi
2. La configurazione esterna di un gruppo
3. Dalla configurazione alla posizione: blocchi s e p
4. Dalla configurazione alla posizione: blocco d
5. Dalla posizione alla configurazione

## Dati e scrittura

Configurazioni di `src/lib/tools/elementi.json`, scritte in forma abbreviata e nell'ordine di riempimento:
$[\text{Ar}]\,4s^2\,3d^{10}\,4p^5$. Gruppi numerati da $1$ a $18$. Una posizione si scrive "Periodo 4, gruppo 17".

## Livello 1: periodi, gruppi e blocchi

Cinque domande sulla struttura della tavola, ognuna tra il 12% e il 28% dei campioni:

- `lunghezza`: quanti elementi ha il periodo $n$, con $n$ da $1$ a $6$ ($2$, $8$, $8$, $18$, $18$, $32$). Tra i
  distrattori la capienza $2n^2$ del livello con lo stesso numero ($18$ per il terzo periodo).
- `sottolivelli`: quali sottolivelli si riempiono lungo il periodo $n$, da $2$ a $6$, nell'ordine ("$4s$, $3d$, $4p$").
  Distrattori: tutti i sottolivelli dello stesso livello ("$4s$, $4p$, $4d$"), il $d$ dello stesso livello, il $d$ o
  l'$f$ dimenticati, il periodo precedente.
- `blocco`: in quale blocco si trova il gruppo $g$. Opzioni: i quattro blocchi.
- `d`: quale sottolivello si riempie nel blocco $d$ del periodo $n$, da $4$ a $6$ ($(n-1)d$). Distrattori: $nd$,
  $(n-2)d$, $(n-1)p$.
- `colonne`: quante colonne occupa un blocco ($2$, $6$, $10$, $14$).

Esempi: "Quanti elementi ha il periodo $4$?" → $18$. "In quale blocco si trova il gruppo $15$?" → blocco $p$.

## Livello 2: la configurazione esterna di un gruppo

Solo gruppi principali ($1$, $2$, da $13$ a $18$), nei due sensi, metà e metà (ogni caso tra il 40% e il 60%):

- `dal-gruppo`: "Qual è la configurazione esterna degli elementi del gruppo $16$?" → $ns^2\,np^4$. Distrattori:
  $np$ con il numero del gruppo meno $10$ ($ns^2\,np^6$), un elettrone in più o in meno, $ns^1$ al posto di $ns^2$.
- `dalla-configurazione`: "A quale gruppo appartengono gli elementi con configurazione esterna $ns^2\,np^3$?" → $15$.
  Distrattori: gli elettroni del $p$ ($3$), la somma di $s$ e $p$ ($5$, il numero tradizionale), dieci più gli
  elettroni del $p$ ($13$).

## Livello 3: dalla configurazione alla posizione, blocchi s e p

Si dà la configurazione abbreviata di un elemento dei gruppi principali dei periodi da $2$ a $5$ e si chiedono periodo
e gruppo.

- $[\text{Ne}]\,3s^2\,3p^4$ → Periodo 3, gruppo 16.
- $[\text{Ar}]\,4s^2\,3d^{10}\,4p^1$ → Periodo 4, gruppo 13.

Distrattori nel blocco $p$: il gruppo uguale agli elettroni del $p$, alla somma di $s$ e $p$, a dieci più quelli del
$p$; il periodo sbagliato di uno. Nel blocco $s$: il periodo sbagliato di uno, il gruppo aumentato di dieci, periodo
e gruppo scambiati.

## Livello 4: dalla configurazione alla posizione, blocco d

Gli elementi del blocco $d$ del quarto periodo, compresi cromo e rame con la configurazione vera, più ittrio,
zirconio, tecnezio e cadmio (i soli del quinto periodo che seguono la regola della diagonale).

- $[\text{Ar}]\,4s^2\,3d^6$ → Periodo 4, gruppo 8.
- $[\text{Ar}]\,4s^1\,3d^{10}$ → Periodo 4, gruppo 11.

Distrattori: il periodo letto sul sottolivello $d$ (Periodo 3); il gruppo uguale ai soli elettroni del $d$; tutti e
due gli errori; dodici più gli elettroni del $d$, come nel blocco $p$.

## Livello 5: dalla posizione alla configurazione

Si danno periodo (da $2$ a $5$) e gruppo e si chiede la configurazione abbreviata. Solo elementi la cui configurazione
vera è quella del procedimento della lezione (niente cromo, rame, niobio, molibdeno, rutenio, rodio, palladio,
argento). Blocco $s$ tra il 12% e il 28% dei campioni, blocchi $p$ e $d$ tra il 32% e il 48% ciascuno.

- Periodo 3, gruppo 15 → $[\text{Ne}]\,3s^2\,3p^3$.
- Periodo 5, gruppo 16 → $[\text{Kr}]\,5s^2\,4d^{10}\,5p^4$.

Distrattori nel blocco $p$: il $d$ pieno dimenticato (dal quarto periodo); nel $np$ il gruppo meno $10$; un elettrone
in più o in meno; il gas nobile dello stesso periodo. Nel blocco $d$: nel $d$ il numero del gruppo senza togliere $2$;
il $d$ dello stesso livello ($4d$ nel quarto periodo); un elettrone in più o in meno. Nel blocco $s$: il gas nobile
dello stesso periodo, il livello sbagliato di uno, un $p$ al posto dell'$s$.

I passaggi finiscono con il nome dell'elemento.

## Da evitare

- Lantanidi, attinidi e sesto periodo: la lezione li nomina soltanto.
- Il palladio ($[\text{Kr}]\,4d^{10}$), dove la regola "il periodo è il valore più grande di $n$" non funziona.
- Posizioni che non corrispondono a un elemento (periodo 2, gruppo 5).
