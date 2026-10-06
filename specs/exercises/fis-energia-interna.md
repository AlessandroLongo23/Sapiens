# L'energia interna

Generatore: `fis-energia-interna` (`src/lib/exercises/v2/generators/fis-energia-interna.ts`, con
`src/lib/exercises/v2/fis-cinetica.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_energia_interna.py` (con
`_fis_cinetica.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/108-fis-energia-interna.md`. Percorso nel database:
`high_school/physics/termodinamica/fis-energia-interna`.

Sei livelli, nell'ordine della lezione, ognuno con una difficoltà in più. Il gas è sempre monoatomico (elio, neon,
argon, kripton, xeno) e il testo lo dice, perché la formula della lezione vale per quello.

## Nomi dei livelli

1. L'energia interna di un gas
2. Di quanto cambia
3. Dalla pressione e dal volume
4. Da uno stato a un altro
5. La temperatura dall'energia interna
6. Due gas in un recipiente isolato

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, l'unità nell'opzione (joule o kelvin). $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$, scritta nel
testo dove serve. Moli con tre cifre da $1{,}01$ a $9{,}99$ senza zero finale; temperature in kelvin intere senza zero
finale. Risposte con tre cifre significative, mai a metà tra due arrotondamenti e mai intere con lo zero finale; ai
livelli 2 e 4 hanno il segno, e tra le opzioni ci sono valori negativi.

## Livello 1: l'energia interna di un gas

$U = \frac{3}{2}\,n\,R\,T$, con $T$ da $151$ a $999\,\text{K}$.

- "Un recipiente contiene $1{,}74\,\text{mol}$ di xeno, un gas monoatomico, a $349\,\text{K}$. Quanto vale l'energia interna
  del gas? ($R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$)" Risposta $7{,}57 \cdot 10^{3}\,\text{J}$; distrattori
  $5{,}05 \cdot 10^{3}\,\text{J}$ (il $\frac{3}{2}$ dimenticato), $2{,}52 \cdot 10^{3}\,\text{J}$ ($\frac{1}{2}$ al suo posto),
  $1{,}65 \cdot 10^{3}\,\text{J}$ ($273$ tolto ai kelvin; sotto i $300\,\text{K}$ è $3$ al posto di $\frac{3}{2}$).
- "… $2{,}01\,\text{mol}$ di elio … a $301\,\text{K}$ …" Risposta $7{,}54 \cdot 10^{3}\,\text{J}$.

## Livello 2: di quanto cambia

$\Delta U = \frac{3}{2}\,n\,R\,\Delta T$ con le temperature in gradi Celsius: la più bassa tra $-40$ e $60\,^\circ\text{C}$, la
differenza tra $21$ e $199$ gradi senza zero finale. Metà dei casi il gas si scalda ("riscaldamento"), metà si
raffredda ("raffreddamento") e la risposta è negativa.

- "In un recipiente $1{,}74\,\text{mol}$ di xeno, un gas monoatomico, passano da $95\,^\circ\text{C}$ a $-17\,^\circ\text{C}$. Di
  quanto cambia l'energia interna del gas? (…)" Risposta $-2{,}43 \cdot 10^{3}\,\text{J}$; distrattori
  $2{,}43 \cdot 10^{3}\,\text{J}$ (il segno), $3{,}49 \cdot 10^{3}\,\text{J}$ ($273$ aggiunto alla differenza),
  $-1{,}62 \cdot 10^{3}\,\text{J}$ (il $\frac{3}{2}$ dimenticato).
- "… $0{,}500\,\text{mol}$ …" non ammesso (le moli partono da $1{,}01$); "… $1{,}23\,\text{mol}$ di argon … da $20\,^\circ\text{C}$ a
  $81\,^\circ\text{C}$ …" Risposta $935\,\text{J}$.

## Livello 3: dalla pressione e dal volume

$U = \frac{3}{2}\,p\,V$. Volume da $1{,}01$ a $9{,}99\,\text{L}$, pressione da $6{,}1 \cdot 10^{4}$ a $4{,}99 \cdot 10^{5}\,\text{Pa}$
(kilopascal interi senza zero finale).

- "Una bombola di $1{,}74\,\text{L}$ contiene xeno, un gas monoatomico, alla pressione di $1{,}63 \cdot 10^{5}\,\text{Pa}$. Quanto
  vale l'energia interna del gas?" Risposta $425\,\text{J}$; distrattori $4{,}25 \cdot 10^{5}\,\text{J}$ (i litri non
  convertiti), $284\,\text{J}$ (il $\frac{3}{2}$ dimenticato), $189\,\text{J}$ ($\frac{2}{3}$ al suo posto).
- "Una bombola di $6{,}01\,\text{L}$ contiene elio … $1{,}01 \cdot 10^{5}\,\text{Pa}$ …" Risposta $911\,\text{J}$.

## Livello 4: da uno stato a un altro

Due stati $A$ e $B$ con il volume in litri (un decimale, da $1{,}1$ a $7{,}9$, almeno $1{,}5\,\text{L}$ di differenza) e la
pressione in kilopascal (intera, da $61$ a $399$ senza zero finale, almeno $60\,\text{kPa}$ di differenza).
$\Delta U = \frac{3}{2}\,(p_B V_B - p_A V_A)$, con $\text{kPa} \cdot \text{L} = \text{J}$, almeno $50\,\text{J}$ in valore assoluto. Scena
`piano-pv` (del gruppo 41): i due stati e un cammino che passa per $C$ (prima a pressione costante, poi a volume
costante), che non serve per il conto. La scena non colora aree.

- "Un gas perfetto monoatomico passa dallo stato A ($2{,}7\,\text{L}$, $87\,\text{kPa}$) allo stato B ($4{,}6\,\text{L}$,
  $391\,\text{kPa}$) lungo il cammino della figura, che passa per C. Di quanto cambia la sua energia interna?" Risposta
  $2{,}35 \cdot 10^{3}\,\text{J}$; distrattori $-2{,}35 \cdot 10^{3}\,\text{J}$ ($A$ e $B$ scambiati), $1{,}56 \cdot 10^{3}\,\text{J}$ (il
  $\frac{3}{2}$ dimenticato), $866\,\text{J}$ (il prodotto delle due differenze).
- "… stato A ($6{,}2\,\text{L}$, $311\,\text{kPa}$) … stato B ($2{,}1\,\text{L}$, $95\,\text{kPa}$) …" Risposta
  $-2{,}59 \cdot 10^{3}\,\text{J}$.

## Livello 5: la temperatura dall'energia interna

$T = \dfrac{2U}{3\,n\,R}$. L'energia interna è data con tre cifre e corrisponde a una temperatura tra $150$ e
$1000\,\text{K}$ (tra $148$ e $1005$ dopo l'arrotondamento del dato).

- "L'energia interna di $1{,}74\,\text{mol}$ di xeno, un gas monoatomico, è $7{,}57 \cdot 10^{3}\,\text{J}$. Qual è la
  temperatura del gas, in kelvin? (…)" Risposta $349\,\text{K}$; distrattori $524\,\text{K}$ (il $\frac{2}{3}$ dimenticato),
  $785\,\text{K}$ ($\frac{3}{2}$ al suo posto), $76{,}0\,\text{K}$ ($273$ tolto ai kelvin).
- "L'energia interna di $2{,}01\,\text{mol}$ di elio … è $7{,}54 \cdot 10^{3}\,\text{J}$ …" Risposta $301\,\text{K}$.

## Livello 6: due gas in un recipiente isolato

Due gas monoatomici diversi, con moli da $1{,}01$ a $5{,}99$ che differiscono di almeno $0{,}5$ e temperature da $201$ a
$599\,\text{K}$ che differiscono di almeno $80\,\text{K}$. $T_f = \dfrac{n_1 T_1 + n_2 T_2}{n_1 + n_2}$.

- "Un recipiente rigido e isolato è diviso in due da una parete che conduce il calore. Da una parte ci sono
  $2{,}11\,\text{mol}$ di xeno a $294\,\text{K}$, dall'altra $1{,}41\,\text{mol}$ di neon a $403\,\text{K}$. I due gas sono
  monoatomici. Quale temperatura raggiungono?" Risposta $338\,\text{K}$; distrattori $359\,\text{K}$ (i pesi scambiati),
  $697\,\text{K}$ (la somma), poi un valore vicino: la media semplice, $348{,}5\,\text{K}$, qui cade a metà tra due
  arrotondamenti e viene scartata; negli altri casi è il primo distrattore.
- "… $2{,}01\,\text{mol}$ di elio a $301\,\text{K}$ … $3{,}02\,\text{mol}$ di argon a $401\,\text{K}$ …" Risposta $361\,\text{K}$.

## Da evitare

- Gas non monoatomici: per loro la formula della lezione non vale.
- Risposte a metà tra due arrotondamenti o intere con lo zero finale; dati con lo zero finale ambiguo.
- Al livello 4 una scena con l'area colorata o con la risposta scritta.
- Trattini lunghi e "piuttosto che" nei testi.
