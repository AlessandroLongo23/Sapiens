# La pressione dei gas

Generatore: `chim-pressione-gas` (`src/lib/exercises/v2/generators/chim-pressione-gas.ts`, con
`src/lib/exercises/v2/chim-gas.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_pressione_gas.py` (con
`_chim_gas.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/30-chim-pressione-gas.md`. Percorso nel database:
`high_school/chemistry/chim-gas/chim-pressione-gas`. Scena del livello 4: `manometro-aperto`
(`src/components/content/exercises/scenes/ManometroAperto.tsx`).

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Da un'unità all'altra
2. Millimetri di mercurio e kilopascal
3. Forza e pressione sul pistone
4. Il manometro a tubo aperto
5. Pressione assoluta e relativa

## Tipi di risposta

Scelta multipla, quattro opzioni con l'unità. $1\,\text{atm} = 760\,\text{mmHg} = 101{,}3\,\text{kPa}$, $1\,\text{bar} =
100\,\text{kPa}$, come la lezione. Risultati con le cifre significative dei dati (tre ai livelli 1, 2 e al secondo caso
del 5, due ai livelli 3 e al primo caso del 5), in notazione scientifica da $10^n$ in su; mai uno zero finale ambiguo
($240$ con tre cifre si scarta). Il livello 4 dà un intero in $\text{mmHg}$.

## Livello 1: da un'unità all'altra

Un quarto per ciascun verso: atm → mmHg ($0{,}100$-$0{,}999\,\text{atm}$), mmHg → atm ($101$-$999\,\text{mmHg}$), atm → kPa
($1{,}00$-$9{,}80\,\text{atm}$), kPa → atm ($101$-$999\,\text{kPa}$). Distrattori: diviso invece che moltiplicato (o il
contrario), il fattore dell'altra unità, uno scivolone di una cifra ($76$ o $1013$).

- "Un gas ha la pressione di $502\,\text{mmHg}$. Quanto vale la sua pressione in atmosfere?" Risposta
  $0{,}661\,\text{atm}$; distrattori $3{,}82 \cdot 10^{5}\,\text{atm}$, $4{,}96\,\text{atm}$, $0{,}0661\,\text{atm}$.
- "... $3{,}08\,\text{atm}$ ... in kilopascal?" Risposta $312\,\text{kPa}$.

## Livello 2: millimetri di mercurio e kilopascal

Metà mmHg → kPa ($101$-$999\,\text{mmHg}$), metà kPa → mmHg ($11{,}0$-$99{,}9\,\text{kPa}$), passando per l'atmosfera.
Distrattori: fermarsi alle atmosfere, i due fattori scambiati, un fattore solo.

- "Un manometro segna $502\,\text{mmHg}$. Quanto vale la pressione in kilopascal?" Risposta $66{,}9\,\text{kPa}$.
- "Un manometro segna $32{,}5\,\text{kPa}$ ..." Risposta in mmHg con tre cifre.

## Livello 3: forza e pressione sul pistone

Metà: pressione in atmosfere ($1{,}1$-$9{,}9$) e area in $\text{cm}^2$ ($11$-$99$), si chiede la forza,
$F = p \cdot S$ con $p$ in pascal e $S$ in $\text{m}^2$. Metà: forza ($1{,}1 \cdot 10^2$-$9{,}9 \cdot 10^3\,\text{N}$) e
area, si chiede la pressione in kPa. Distrattori: l'area lasciata in $\text{cm}^2$, i $\text{cm}^2$ convertiti come
centimetri ($10^{-2}$), la pressione lasciata in atmosfere, i pascal letti come kilopascal.

- "Un gas chiuso in un cilindro ha la pressione di $3{,}6\,\text{atm}$. Con quale forza spinge sul pistone, che ha l'area di
  $49\,\text{cm}^2$?" Risposta $1{,}8 \cdot 10^{3}\,\text{N}$; distrattori $1{,}8 \cdot 10^{7}\,\text{N}$,
  $1{,}8 \cdot 10^{5}\,\text{N}$, $0{,}018\,\text{N}$.
- "... area di $24\,\text{cm}^2$, con la forza di $3{,}7 \cdot 10^{2}\,\text{N}$ ..." Risposta $1{,}5 \cdot 10^{2}\,\text{kPa}$.

## Livello 4: il manometro a tubo aperto

Pressione atmosferica $740$-$775\,\text{mmHg}$, dislivello $12$-$250\,\text{mm}$, mercurio più alto nel ramo aperto (metà)
o dal lato del gas (metà), detto nel testo e disegnato nella scena. Risposta $p_0 \pm \Delta h$. Distrattori: il segno
sbagliato, il dislivello da solo, $760$ al posto della pressione del barometro.

- "... La pressione atmosferica è $755\,\text{mmHg}$, e il mercurio è $118\,\text{mm}$ più in alto nel ramo aperto ..."
  Risposta $873\,\text{mmHg}$; distrattori $637$, $118$, $878\,\text{mmHg}$.
- "... $740\,\text{mmHg}$ ... $26\,\text{mm}$ più in alto nel ramo collegato al gas ..." Risposta $714\,\text{mmHg}$.

## Livello 5: pressione assoluta e relativa

Metà: il manometro di un distributore segna $1{,}2$-$3{,}8\,\text{bar}$, l'aria è a $1{,}0\,\text{bar}$, si chiede la
pressione assoluta in kPa (due cifre). Metà: il manometro di una bombola segna $110$-$399\,\text{kPa}$, l'aria è a
$101{,}3\,\text{kPa}$, si chiede la pressione assoluta in atmosfere (tre cifre). Distrattori: la pressione atmosferica
dimenticata, sottratta, un fattore sbagliato.

- "... segna $2{,}4\,\text{bar}$ ..." Risposta $3{,}4 \cdot 10^{2}\,\text{kPa}$; distrattori $2{,}4 \cdot 10^{2}$,
  $1{,}4 \cdot 10^{2}$, $3{,}4 \cdot 10^{3}\,\text{kPa}$.
- "... segna $178\,\text{kPa}$ ..." Risposta $2{,}76\,\text{atm}$; distrattori $1{,}76$, $0{,}757$, $3{,}31\,\text{atm}$.

## Esercizi da evitare

- Dati con uno zero finale ambiguo ($750\,\text{mmHg}$ con tre cifre); risultati con uno zero finale ambiguo.
- Mercurio che esce dal disegno: la scena limita il dislivello disegnato a $1{,}4\,\text{cm}$.

## Verifica

`chim_pressione_gas.py` rilegge il testo, ricalcola con i razionali di SymPy e le costanti della lezione, controlla le
cifre significative dei dati, l'opzione giusta, le unità, e al livello 4 che la scena dica lo stesso dislivello e lo
stesso lato del testo.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, $5.000$ esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 143 px su 252).

### Errori piantati

Su 50 esercizi (seed da 300): indice, opzione doppia, cifra dell'opzione giusta, parole vietate bocciati 50 su 50; un dato
aumentato di uno bocciato 45 su 50. I cinque che passano sono conversioni e forze in cui il dato cambiato di un'unità
dà lo stesso risultato arrotondato (per esempio $502 \to 503\,\text{mmHg}$ con tre cifre), quindi non sono errori.

### Esercizi diversi su 1.000

Seed da 1: livello 1 857, livello 2 742, livello 3 976, livello 4 976, livello 5 255.

## Domande per la revisione

- Il manometro a tubo aperto è nel programma del secondo anno di chimica, o basta la pressione relativa delle gomme?
- La forza sul pistone (livello 3) è più fisica che chimica: tenerla?
