# Temperatura ed energia cinetica delle molecole

Generatore: `fis-temperatura-microscopica` (`src/lib/exercises/v2/generators/fis-temperatura-microscopica.ts`, con
`src/lib/exercises/v2/fis-cinetica.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_temperatura_microscopica.py` (con `_fis_cinetica.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/106-fis-temperatura-microscopica.md`. Percorso nel database:
`high_school/physics/fis-gas/fis-temperatura-microscopica`.

Sei livelli, nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'energia cinetica media
2. Dai gradi Celsius
3. La temperatura dall'energia cinetica media
4. La velocità quadratica media
5. Il rapporto tra due velocità
6. La temperatura dalla velocità

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, l'unità nell'opzione (joule, kelvin, metri al secondo; al livello 5 un numero puro).
Costanti scritte nel testo dove servono: $k_B = 1{,}38 \cdot 10^{-23}\,\text{J/K}$, $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$;
$0\,^\circ\text{C} = 273\,\text{K}$. Risposte con tre cifre significative, mai a metà tra due arrotondamenti e mai intere con
lo zero finale. Temperature date: numeri interi che non finiscono con zero. I gas e le masse molari sono quelli della
specifica `fis-teoria-cinetica`.

## Livello 1: l'energia cinetica media

$K_m = \frac{3}{2}\,k_B\,T$, con $T$ da $101$ a $999\,\text{K}$.

- "Un gas è alla temperatura di $111\,\text{K}$. Quanto vale l'energia cinetica media di una sua molecola?
  ($k_B = 1{,}38 \cdot 10^{-23}\,\text{J/K}$)" Risposta $2{,}30 \cdot 10^{-21}\,\text{J}$; distrattori
  $1{,}53 \cdot 10^{-21}\,\text{J}$ (il $\frac{3}{2}$ dimenticato), $7{,}66 \cdot 10^{-22}\,\text{J}$ ($\frac{1}{2}$ al suo posto),
  $4{,}60 \cdot 10^{-21}\,\text{J}$ ($3$ al posto di $\frac{3}{2}$; sopra i $300\,\text{K}$ il terzo distrattore toglie $273$).
- "… $293\,\text{K}$ …" Risposta $6{,}07 \cdot 10^{-21}\,\text{J}$ (l'esempio 1 della lezione).

## Livello 2: dai gradi Celsius

La stessa domanda con la temperatura in gradi Celsius: da $11$ a $699\,^\circ\text{C}$ (caso "sopra zero", circa il 70%) o
da $-199$ a $-11\,^\circ\text{C}$ (caso "sotto zero", circa il 30%).

- "Un gas è alla temperatura di $-22\,^\circ\text{C}$. Quanto vale l'energia cinetica media di una sua molecola? (…)"
  Risposta $5{,}20 \cdot 10^{-21}\,\text{J}$ ($T = 251\,\text{K}$); distrattori $4{,}55 \cdot 10^{-22}\,\text{J}$ (i gradi Celsius
  nella formula, senza segno), $3{,}46 \cdot 10^{-21}\,\text{J}$ (il $\frac{3}{2}$ dimenticato), $6{,}11 \cdot 10^{-21}\,\text{J}$
  ($273$ tolto invece che aggiunto).
- "… $20\,^\circ\text{C}$ …" non ammesso (zero finale); "… $21\,^\circ\text{C}$ …" Risposta $6{,}09 \cdot 10^{-21}\,\text{J}$.

## Livello 3: la temperatura dall'energia cinetica media

$T = \dfrac{2\,K_m}{3\,k_B}$. L'energia è data con tre cifre in notazione scientifica e corrisponde a una temperatura tra
$150$ e $1500\,\text{K}$.

- "L'energia cinetica media delle molecole di un gas è $3{,}44 \cdot 10^{-21}\,\text{J}$. Qual è la temperatura del gas,
  in kelvin? (…)" Risposta $166\,\text{K}$; distrattori $249\,\text{K}$ (il $\frac{2}{3}$ dimenticato), $374\,\text{K}$
  ($\frac{3}{2}$ al suo posto), poi $273$ tolto ai kelvin se resta positivo, altrimenti un valore vicino.
- "… $6{,}21 \cdot 10^{-21}\,\text{J}$ …" Risposta $300\,\text{K}$ non ammessa (zero finale).

## Livello 4: la velocità quadratica media

$v_{qm} = \sqrt{3RT/M}$, con la massa molare da grammi a chilogrammi per mole. Uno dei quindici gas, $T$ da $151$ a
$999\,\text{K}$.

- "Un recipiente contiene idrogeno (massa molare $2{,}02\,\text{g/mol}$) a $203\,\text{K}$. Quanto vale la velocità quadratica
  media delle sue molecole? ($R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$)" Risposta $1{,}58 \cdot 10^{3}\,\text{m/s}$; distrattori
  $50{,}1\,\text{m/s}$ (la massa molare in grammi), $914\,\text{m/s}$ (il 3 dimenticato), $2{,}51 \cdot 10^{6}\,\text{m/s}$ (la
  radice dimenticata).
- "Un recipiente contiene azoto (massa molare $28{,}0\,\text{g/mol}$) a $293\,\text{K}$ …" Risposta $511\,\text{m/s}$ (esempio 3
  della lezione). Per i gas monoatomici il testo dice "particelle".

## Livello 5: il rapporto tra due velocità

Due casi, metà e metà.

- "due temperature": lo stesso gas scaldato da $t_1$ ($11$-$99\,^\circ\text{C}$) a $t_2$ (almeno $150$ gradi in più, al più
  $899\,^\circ\text{C}$); risposta $\sqrt{T_2 / T_1}$ con le temperature in kelvin. "Un gas viene scaldato da $16\,^\circ\text{C}$ a
  $883\,^\circ\text{C}$. Di quante volte aumenta la velocità quadratica media delle sue molecole?" Risposta $2{,}00$;
  distrattori $4{,}00$ (la radice dimenticata), $7{,}43$ (i gradi Celsius sotto radice), $55{,}2$ (il rapporto dei gradi
  Celsius).
- "due gas": due gas alla stessa temperatura, il secondo con massa molare almeno $1{,}3$ volte quella del primo;
  risposta $\sqrt{M_2 / M_1}$. "Due recipienti alla stessa temperatura contengono elio ($4{,}00\,\text{g/mol}$) e azoto
  ($28{,}0\,\text{g/mol}$). Quante volte è più grande la velocità quadratica media nel gas più leggero?" Risposta $2{,}65$;
  distrattori $7{,}00$ (la radice dimenticata), $0{,}378$ e $0{,}143$ (il rapporto rovesciato).

## Livello 6: la temperatura dalla velocità

$T = \dfrac{M\,v_{qm}^2}{3R}$. La velocità è data con tre cifre e corrisponde a una temperatura tra $150$ e
$1200\,\text{K}$ circa.

- "In un recipiente di idrogeno (massa molare $2{,}02\,\text{g/mol}$) la velocità quadratica media è
  $1{,}63 \cdot 10^{3}\,\text{m/s}$. Qual è la temperatura del gas, in kelvin? (…)" Risposta $215\,\text{K}$; distrattori
  $646\,\text{K}$ (il 3 dimenticato), $71{,}8\,\text{K}$ (il 3 usato due volte), poi $273$ tolto ai kelvin se resta positivo.
- "In un recipiente di elio (massa molare $4{,}00\,\text{g/mol}$) la velocità quadratica media è
  $1{,}37 \cdot 10^{3}\,\text{m/s}$ …" Risposta $301\,\text{K}$ (esempio 5 della lezione).

## Da evitare

- Temperature date con lo zero finale, risposte a metà tra due arrotondamenti o intere con lo zero finale.
- Al livello 5 due gas con masse molari troppo vicine (azoto e ossigeno), dove "il più leggero" conta poco.
- Trattini lunghi e "piuttosto che" nei testi.
