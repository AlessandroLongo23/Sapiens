# Il principio di Avogadro

Generatore: `chim-principio-avogadro` (`src/lib/exercises/v2/generators/chim-principio-avogadro.ts`, con
`src/lib/exercises/v2/chim-gas.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_principio_avogadro.py` (con
`_chim_gas.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/34-chim-principio-avogadro.md`. Percorso nel
database: `high_school/chemistry/chim-gas/chim-principio-avogadro`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. I volumi nelle reazioni
2. Stesso volume, stesse particelle
3. La massa delle molecole
4. Quale gas è
5. La formula dai volumi

## Tipi di risposta

Scelta multipla, quattro opzioni: volumi in litri (due cifre), numeri di particelle in notazione scientifica (due cifre),
masse molecolari relative senza unità (tre cifre), formule chimiche. Masse atomiche della lezione 01.

## Livello 1: i volumi nelle reazioni

Nove reazioni tra gas ($\mathrm{N_2} + 3\,\mathrm{H_2} \longrightarrow 2\,\mathrm{NH_3}$, $2\,\mathrm{H_2} + \mathrm{O_2}
\longrightarrow 2\,\mathrm{H_2O}$, $\mathrm{H_2} + \mathrm{Cl_2} \longrightarrow 2\,\mathrm{HCl}$, la combustione del metano
e del propano con l'acqua come vapore, $2\,\mathrm{CO} + \mathrm{O_2}$, $2\,\mathrm{SO_2} + \mathrm{O_2}$,
$\mathrm{N_2} + \mathrm{O_2}$, $2\,\mathrm{NO} + \mathrm{O_2}$); due specie con coefficienti diversi, un volume da
$1{,}1$ a $9{,}9\,\text{L}$. Il verbo dice se si chiede un reagente o un prodotto. Distrattori: il rapporto rovesciato,
lo stesso volume, la somma dei due volumi.

- "Nella reazione $2\,\mathrm{NO} + \mathrm{O_2} \longrightarrow 2\,\mathrm{NO_2}$ ... Quanti litri di $\mathrm{NO}$
  reagiscono con $2{,}7\,\text{L}$ di $\mathrm{O_2}$?" Risposta $5{,}4\,\text{L}$; distrattori $2{,}7$, $8{,}1\,\text{L}$.
- "Nella reazione $2\,\mathrm{SO_2} + \mathrm{O_2} \longrightarrow 2\,\mathrm{SO_3}$ ... Quanti litri di $\mathrm{SO_3}$
  si formano da $2{,}9\,\text{L}$ di $\mathrm{O_2}$?" Risposta $5{,}8\,\text{L}$.

## Livello 2: stesso volume, stesse particelle

$N_1$ da $1{,}1 \cdot 10^{21}$ a $9{,}9 \cdot 10^{23}$ particelle di un gas in $V_1$, e $V_2$ di un altro gas (i due
volumi differiscono almeno del $30\%$). Distrattori: il rapporto rovesciato, lo stesso numero, il numero corretto con le
masse delle molecole (l'idea sbagliata che molecole più pesanti siano meno).

- "Un recipiente di $2{,}7\,\text{L}$ contiene $4{,}1 \cdot 10^{22}$ particelle di $\mathrm{He}$. Quante particelle di
  $\mathrm{H_2}$ ci sono in $4{,}1\,\text{L}$ ...?" Risposta $6{,}2 \cdot 10^{22}$.
- "... $1{,}5\,\text{L}$ ... $4{,}8 \cdot 10^{21}$ particelle di $\mathrm{O_2}$ ... $6{,}7\,\text{L}$ di $\mathrm{NH_3}$
  ..." Risposta $2{,}1 \cdot 10^{22}$.

## Livello 3: la massa delle molecole

Volumi uguali ($1{,}00$, $2{,}00$ o $0{,}500\,\text{L}$) di un gas sconosciuto e di un gas di riferimento
($\mathrm{O_2}$, $\mathrm{N_2}$ o $\mathrm{H_2}$, un terzo ciascuno), con le masse in grammi a tre cifre (quelle vere in
condizioni normali), e la massa molecolare relativa del riferimento. Distrattori: il rapporto delle masse da solo, il
rapporto rovesciato, la differenza delle masse sommata.

- $1{,}00\,\text{L}$: $1{,}97\,\text{g}$ contro $1{,}25\,\text{g}$ di $\mathrm{N_2}$ ($28{,}02$): risposta $44{,}2$;
  distrattori $1{,}58$, $17{,}8$, $28{,}7$.
- $0{,}761\,\text{g}$ contro $1{,}25\,\text{g}$ di $\mathrm{N_2}$: risposta $17{,}1$.

## Livello 4: quale gas è

La massa di un volume del gas è $r$ volte quella di un ugual volume di ossigeno, azoto o idrogeno ($r$ con tre cifre);
le opzioni sono il gas giusto e tre gas con una massa molecolare lontana almeno $3$, tra $\mathrm{CO_2}$, $\mathrm{CH_4}$,
$\mathrm{NH_3}$, $\mathrm{SO_2}$, $\mathrm{Cl_2}$, $\mathrm{C_3H_8}$, $\mathrm{C_2H_6}$, $\mathrm{HCl}$, $\mathrm{H_2S}$,
$\mathrm{NO}$, $\mathrm{NO_2}$, $\mathrm{C_2H_4}$. Il testo dà le masse atomiche.

- $r = 1{,}57$ rispetto a $\mathrm{N_2}$: risposta $\mathrm{C_3H_8}$.
- $r = 0{,}608$ rispetto a $\mathrm{N_2}$: risposta $\mathrm{NH_3}$.

## Livello 5: la formula dai volumi

Due gas danno un solo prodotto gassoso, in dieci sintesi ($\mathrm{H_2} + \mathrm{Cl_2}$, $\mathrm{H_2} + \mathrm{O_2}$,
$\mathrm{N_2} + \mathrm{H_2}$, tre sintesi di ossidi di azoto, $\mathrm{H_2} + \mathrm{F_2}$, $\mathrm{CO} + \mathrm{O_2}$,
$\mathrm{NO} + \mathrm{O_2}$, $\mathrm{SO_2} + \mathrm{O_2}$), con i volumi moltiplicati per $1$-$4$. Distrattori: gli
atomi non divisi tra le molecole, i volumi presi come indici, la formula raddoppiata, un atomo in più.

- "$2\,\text{L}$ di $\mathrm{N_2}$ reagiscono con $4\,\text{L}$ di $\mathrm{O_2}$ e si formano $4\,\text{L}$ di un solo gas
  ..." Risposta $\mathrm{NO_2}$; distrattori $\mathrm{N_2O_4}$, $\mathrm{N_2O_2}$, $\mathrm{NO_3}$.
- "$1\,\text{L}$ di $\mathrm{H_2}$ reagisce con $1\,\text{L}$ di $\mathrm{F_2}$ ..." Risposta $\mathrm{HF}$.

## Esercizi da evitare

- Coefficienti uguali al livello 1 (il volume non cambia); volumi quasi uguali al livello 2; gas con masse vicine tra le
  opzioni del livello 4.

## Verifica

`chim_principio_avogadro.py` rilegge il testo, controlla che l'equazione del livello 1 sia bilanciata, ricalcola con i
razionali di SymPy, rifà le masse molecolari dalla tavola della lezione 01, al livello 4 cerca tra le opzioni il gas con
la massa più vicina a $r \cdot M_{rif}$, al livello 5 conta gli atomi e li divide tra le molecole del prodotto.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, $5.000$ esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 75 px su 252).

### Errori piantati

Su 50 esercizi (seed da 300): indice, opzione doppia, testo dell'opzione giusta, parole vietate, un dato aumentato di uno
bocciati 50 su 50.

### Esercizi diversi su 1.000

Seed da 1: livello 1 855, livello 2 1000, livello 3 105, livello 4 30, livello 5 40.

## Domande per la revisione

- I livelli 3 e 4 vengono prima della mole (il capitolo dei gas precede quello della mole nell'albero): va bene parlare
  di massa molecolare relativa senza la massa molare?
- La sintesi $2\,\mathrm{N_2} + \mathrm{O_2} \longrightarrow 2\,\mathrm{N_2O}$ non avviene davvero così: tenerla come
  esercizio sui volumi o toglierla?
