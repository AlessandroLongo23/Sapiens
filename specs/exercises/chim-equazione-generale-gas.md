# L'equazione generale dei gas

Generatore: `chim-equazione-generale-gas` (`src/lib/exercises/v2/generators/chim-equazione-generale-gas.ts`, con
`src/lib/exercises/v2/chim-gas.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_equazione_generale_gas.py`
(con `_chim_gas.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/33-chim-equazione-generale-gas.md`. Percorso
nel database: `high_school/chemistry/chim-gas/chim-equazione-generale-gas`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Quale legge
2. Cambia tutto
3. Gradi Celsius e millilitri
4. La temperatura finale
5. Le condizioni normali

## Tipi di risposta

Scelta multipla, quattro opzioni. Livello 1: le quattro leggi ("Legge di Boyle", "Legge di Charles", "Legge di
Gay-Lussac", "Equazione generale dei gas"). Negli altri $p_1 V_1/T_1 = p_2 V_2/T_2$, con l'unità nell'opzione e tre
cifre significative; al livello 4 la temperatura al grado Celsius. Condizioni normali $0\,^\circ\text{C}$
($273\,\text{K}$) e $1\,\text{atm}$ ($760\,\text{mmHg}$, $101{,}3\,\text{kPa}$).

## Livello 1: quale legge

Dodici situazioni, tre per legge, alcune con numeri generati: la siringa tappata a temperatura costante, la bolla del sub
in acqua a temperatura uniforme, il cilindro nella vasca (Boyle); il palloncino nel congelatore, il pistone libero, la
mongolfiera (Charles); la bombola al sole, la bomboletta nel fuoco, la gomma che si scalda (Gay-Lussac); il pallone
sonda, il gas compresso e scaldato, la bolla che sale in un lago più caldo in superficie (equazione generale).

- "Un gas viene compresso da $19\,\text{L}$ a $5\,\text{L}$ e intanto si scalda da $15\,^\circ\text{C}$ a
  $59\,^\circ\text{C}$. Quale legge descrive come cambia il gas?" Risposta: equazione generale dei gas.
- "L'aria dentro una mongolfiera, aperta in basso verso l'atmosfera, viene scaldata dal bruciatore ..." Risposta: legge
  di Charles.

## Livello 2: cambia tutto

$V_1$ da $1{,}00$ a $9{,}99\,\text{L}$, pressioni da $1{,}00$ a $5{,}00\,\text{atm}$, temperature in kelvin ($250$-$400$ e
$200$-$600$). Distrattori: le pressioni rovesciate, le temperature rovesciate, tutte e due.

- "Un gas occupa $4{,}89\,\text{L}$ a $2{,}79\,\text{atm}$ e $307\,\text{K}$. Viene portato a $2{,}13\,\text{atm}$ e
  $391\,\text{K}$ ..." Risposta $8{,}16\,\text{L}$.
- "... $6{,}59\,\text{L}$ a $1{,}94\,\text{atm}$ e $281\,\text{K}$ ... $1{,}90\,\text{atm}$ e $346\,\text{K}$ ..." Risposta
  $8{,}29\,\text{L}$.

## Livello 3: gradi Celsius e millilitri

$V_1$ in L, $V_2$ in mL ($101$-$999$), $p_1$ in kPa ($101$-$299$), temperature in gradi Celsius. Si chiede $p_2$ in kPa.
Distrattori: i gradi Celsius, millilitri e litri mescolati, le temperature rovesciate.

- "Un gas occupa $4{,}89\,\text{L}$ a $157\,\text{kPa}$ e $10\,^\circ\text{C}$. Viene compresso fino a $502\,\text{mL}$ e
  portato a $85\,^\circ\text{C}$ ..." Risposta $1{,}93 \cdot 10^{3}\,\text{kPa}$; distrattore $1{,}93\,\text{kPa}$ (unità
  mescolate).
- "... $9{,}07\,\text{L}$ a $234\,\text{kPa}$ e $40\,^\circ\text{C}$ ... $501\,\text{mL}$ ... $-17\,^\circ\text{C}$ ..."
  Risposta $3{,}46 \cdot 10^{3}\,\text{kPa}$.

## Livello 4: la temperatura finale

Pressioni e volumi con tre cifre, $t_1$ da $-20$ a $60\,^\circ\text{C}$; $T_2$ tra $200$ e $900\,\text{K}$, lontana almeno
$0{,}05$ da un mezzo grado e almeno $30\,\text{K}$ da $T_1$. Distrattori: i kelvin scritti come gradi Celsius, la
proporzione con i gradi Celsius, il rapporto rovesciato.

- "Un gas occupa $4{,}11\,\text{L}$ a $2{,}79\,\text{atm}$ e $42\,^\circ\text{C}$ ... $4{,}98\,\text{L}$ alla pressione di
  $4{,}48\,\text{atm}$ ..." Risposta $340\,^\circ\text{C}$; distrattori $613\,^\circ\text{C}$, $82$, $-111\,^\circ\text{C}$.
- "... $3{,}02\,\text{L}$ a $2{,}24\,\text{atm}$ e $9\,^\circ\text{C}$ ... $2{,}84\,\text{L}$ ... $1{,}94\,\text{atm}$ ..."
  Risposta $-43\,^\circ\text{C}$.

## Livello 5: le condizioni normali

$V_1$ da $101$ a $999\,\text{mL}$, $t_1$ da $10$ a $40\,^\circ\text{C}$, pressione in mmHg ($700$-$800$, metà) o in kPa
($90{,}0$-$110{,}0$, metà). Distrattori: la temperatura dimenticata, le temperature rovesciate, le pressioni rovesciate.

- "Si raccolgono $502\,\text{mL}$ di un gas a $21\,^\circ\text{C}$ e alla pressione di $728\,\text{mmHg}$ ..." Risposta
  $447\,\text{mL}$.
- "... $313\,\text{mL}$ ... $16\,^\circ\text{C}$ ... $94{,}5\,\text{kPa}$ ..." Risposta $276\,\text{mL}$.

## Esercizi da evitare

- Temperature vicine a $0\,^\circ\text{C}$; temperature finali su un mezzo grado; risultati con uno zero finale ambiguo.

## Verifica

`chim_equazione_generale_gas.py` riconosce le dodici situazioni del livello 1 con le sue espressioni regolari e sa quale
grandezza resta costante in ciascuna; negli altri livelli rilegge il testo e ricalcola con i razionali di SymPy.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, $5.000$ esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 181 px su 252).

### Errori piantati

Su 50 esercizi (seed da 300): indice, opzione doppia, parole vietate bocciati 50 su 50; cifra dell'opzione giusta
cambiata bocciata 44 su 44 (le 6 del livello 1 senza cifre restano uguali); un dato aumentato di uno bocciato 40 su 40
(i 10 del livello 1 cambiano un numero della situazione, che non cambia la legge).

### Esercizi diversi su 1.000

Seed da 1: livello 1 424, livelli 2-5 1000.

## Domande per la revisione

- Condizioni normali a $0\,^\circ\text{C}$ e $1\,\text{atm}$ (come il README di chimica): confermare con Andrea.
- La bolla che sale da un lago freddo a una superficie calda (equazione generale) è una situazione chiara, o confonde
  con la bolla del sub (Boyle)?
