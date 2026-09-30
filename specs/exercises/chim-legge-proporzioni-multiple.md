# La legge di Dalton delle proporzioni multiple

Generatore: `chim-legge-proporzioni-multiple` (`src/lib/exercises/v2/generators/chim-legge-proporzioni-multiple.ts`, con
`src/lib/exercises/v2/chim-trasformazioni.ts`). Verifica indipendente:
`scripts/exercises/checkers/chim_legge_proporzioni_multiple.py` (con `_chim_trasformazioni.py`). Lezione collegata:
`docs/lezioni/chimica/riscritte/25-chim-legge-proporzioni-multiple.md`. Percorso nel database:
`high_school/chemistry/chim-trasformazioni-chimiche/chim-legge-proporzioni-multiple`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La stessa massa
2. Masse diverse
3. Dalla massa del composto
4. Dalle percentuali
5. La formula del secondo

## Composti e numeri

Coppie di composti veri degli stessi due elementi, con le masse atomiche della lezione 01: $\mathrm{CO}$ e $\mathrm{CO_2}$;
i cinque ossidi dell'azoto ($\mathrm{N_2O}$, $\mathrm{NO}$, $\mathrm{N_2O_3}$, $\mathrm{NO_2}$, $\mathrm{N_2O_5}$);
$\mathrm{SO_2}$ e $\mathrm{SO_3}$; $\mathrm{H_2O}$ e $\mathrm{H_2O_2}$; $\mathrm{FeO}$ e $\mathrm{Fe_2O_3}$; $\mathrm{P_2O_3}$ e
$\mathrm{P_2O_5}$; $\mathrm{Na_2O}$ e $\mathrm{Na_2O_2}$; quattro idrocarburi ($\mathrm{CH_4}$, $\mathrm{C_2H_6}$,
$\mathrm{C_2H_4}$, $\mathrm{C_2H_2}$). Prima si sceglie la coppia di elementi, poi due composti in ordine casuale.

Le masse dell'elemento fisso vanno da $1{,}00$ a $9{,}99\,\text{g}$; quelle dell'altro elemento si calcolano dalla
formula e si scrivono con tre cifre significative, mai vicino a un confine di arrotondamento. La domanda è sempre la
stessa: il rapporto tra la massa del secondo elemento nel secondo composto e quella nel primo, per la stessa massa
dell'elemento fisso. La risposta è un rapporto ridotto $p : q$ con $p, q \le 5$ (per le coppie dell'azoto e degli
idrocarburi può essere $5 : 4$ o $3 : 4$).

Opzioni: la risposta, il rapporto rovesciato, il rapporto semplice più vicino all'errore del livello, e i rapporti
semplici più vicini alla risposta. Il controllo esige che nessuna opzione sbagliata stia entro il $5\%$ del rapporto
misurato.

## Livello 1: la stessa massa

"... Nel primo $7{,}23\,\text{g}$ di fosforo sono uniti a $9{,}34\,\text{g}$ di ossigeno; nel secondo gli stessi
$7{,}23\,\text{g}$ di fosforo sono uniti a $5{,}60\,\text{g}$ di ossigeno. In che rapporto stanno ...?" Risposta
$3 : 5$; distrattori $5 : 3$ (rovesciato), $2 : 3$, $1 : 2$.

"... $5{,}87\,\text{g}$ di sodio ... $4{,}09\,\text{g}$ ... $2{,}04\,\text{g}$ di ossigeno ..." Risposta $1 : 2$.

## Livello 2: masse diverse

Le masse dell'elemento fisso differiscono di almeno il $25\%$, e il rapporto delle masse del secondo elemento prese
così come sono deve dare un rapporto semplice diverso dalla risposta (è il distrattore dell'avviso della lezione).

"... Nel primo $5{,}87\,\text{g}$ di sodio sono uniti a $4{,}09\,\text{g}$ di ossigeno; nel secondo $8{,}66\,\text{g}$
di sodio sono uniti a $3{,}01\,\text{g}$ di ossigeno ..." Risposta $1 : 2$; distrattori $2 : 1$, $3 : 4$ (le masse
di ossigeno confrontate senza riferirle a $1\,\text{g}$ di sodio), $3 : 5$.

"... $7{,}23\,\text{g}$ di fosforo ... $9{,}34\,\text{g}$ ...; ... $4{,}12\,\text{g}$ di fosforo ... $3{,}19\,\text{g}$ ..."
Risposta $3 : 5$.

## Livello 3: dalla massa del composto

Si danno la massa di un campione di ogni composto e la massa dell'elemento fisso che contiene; l'altro elemento si
trova per differenza. La massa del campione ha i decimali del dato che ne ha meno, e la differenza deve stare entro
l'$1\%$ della massa vera, perché l'arrotondamento non cambi la risposta. Il distrattore del livello è il rapporto
calcolato con la massa del campione al posto di quella dell'elemento (scartato quando darebbe la risposta giusta: per
questo la coppia idrogeno e ossigeno non compare).

"Un campione di $9{,}96\,\text{g}$ del primo contiene $5{,}87\,\text{g}$ di sodio; un campione di $11{,}67\,\text{g}$
del secondo contiene $8{,}66\,\text{g}$ di sodio ..." Risposta $1 : 2$.

"Un campione di $16{,}57\,\text{g}$ del primo contiene $7{,}23\,\text{g}$ di fosforo; un campione di $7{,}31\,\text{g}$ ..."
Risposta $3 : 5$.

## Livello 4: dalle percentuali

La percentuale in massa dell'elemento fisso nei due composti, con tre cifre. Distrattori: il rapporto delle
percentuali del secondo elemento e quello delle percentuali dell'elemento fisso, riportati al rapporto semplice più
vicino. I dati dipendono solo dalla coppia di composti: circa 480 esercizi diversi su 1.000.

"Il primo contiene il $43{,}6\%$ di fosforo, il secondo il $56{,}3\%$ ..." Risposta $3 : 5$.
"Il primo contiene il $59{,}0\%$ di sodio, il secondo il $74{,}2\%$ ..." Risposta $1 : 2$.

## Livello 5: la formula del secondo

Si dà la formula del primo composto, e i dati come al livello 2; si chiede la formula del secondo. Opzioni: la
formula vera; la formula con il rapporto rovesciato; le altre formule vere della serie con un rapporto diverso;
formule inventate con gli atomi dell'elemento fisso da 1 a 4 e dell'altro da 1 a 7, mai con lo stesso rapporto della
risposta (niente $\mathrm{N_2O_4}$ accanto a $\mathrm{NO_2}$).

"Il primo è $\mathrm{P_2O_5}$: $7{,}23\,\text{g}$ di fosforo sono uniti a $9{,}34\,\text{g}$ di ossigeno. Nel secondo
$4{,}12\,\text{g}$ di fosforo sono uniti a $3{,}19\,\text{g}$ di ossigeno." Risposta $\mathrm{P_2O_3}$; distrattori
$\mathrm{P_4O_3}$, $\mathrm{PO_3}$, $\mathrm{P_2O}$.

"Il primo è $\mathrm{Na_2O_2}$ ..." Risposta $\mathrm{Na_2O}$; distrattori $\mathrm{Na_4O}$, $\mathrm{NaO}$,
$\mathrm{NaO_2}$.

## Esercizi da evitare

- Masse con più o meno di tre cifre significative, o vicine a un confine di arrotondamento.
- Distrattori che valgono quanto la risposta (lo stesso rapporto scritto diversamente, una formula con lo stesso
  rapporto tra gli atomi).
- Al livello 3, totali arrotondati che cambiano la risposta.

## Verifica

Il controllo rilegge i dati dal testo, calcola la massa del secondo elemento per grammo del primo in ogni composto,
controlla che corrisponda (entro lo $0{,}5\%$; al livello 3 entro il $3\%$, al livello 4 con la tolleranza delle
percentuali a tre cifre) a un composto vero della sua lista, con le masse atomiche della lezione 01, e che l'opzione
giusta sia l'unica entro il $2\%$ del rapporto misurato. Al livello 5 moltiplica il rapporto degli atomi del primo
composto per il rapporto misurato e cerca la sola formula con quel rapporto, che deve essere un composto vero.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 52 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta spostato, opzione doppia, testo dell'opzione giusta
cambiato, parole vietate nei passaggi: bocciati 60 su 60. Una cifra del testo aumentata di uno: bocciati 58 su 60; i
due che passano cambiano $9{,}98$ in $9{,}99$, lo $0{,}1\%$, dentro l'arrotondamento dei dati.

### Esercizi diversi su 1.000

Seed da 1: livello 1 997, livelli 2, 3 e 5 1000, livello 4 483 (i dati sono le percentuali dei composti).
