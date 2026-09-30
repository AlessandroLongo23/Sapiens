# Le leggi di Charles e di Gay-Lussac

Generatore: `chim-legge-charles-gay-lussac` (`src/lib/exercises/v2/generators/chim-legge-charles-gay-lussac.ts`, con
`src/lib/exercises/v2/chim-gas.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_legge_charles_gay_lussac.py`
(con `_chim_gas.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/32-chim-legge-charles-gay-lussac.md`. Percorso
nel database: `high_school/chemistry/chim-gas/chim-legge-charles-gay-lussac`. Scena del livello 5: `grafico-dati`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Charles, in kelvin
2. Charles, in gradi Celsius
3. Gay-Lussac
4. La temperatura finale
5. Dal grafico volume-temperatura

## Tipi di risposta

Scelta multipla, quattro opzioni con l'unità. $V_1/T_1 = V_2/T_2$ e $p_1/T_1 = p_2/T_2$ con $T = t + 273$. Cifre
significative dei dati (due al livello 1, tre ai livelli 2, 3 e 5); al livello 4 temperature intere in gradi Celsius,
esatte per costruzione.

## Livello 1: Charles, in kelvin

$V_1$ da $1{,}1$ a $9{,}9\,\text{L}$, $T_1$ e $T_2$ da $200$ a $600\,\text{K}$, lontane almeno $20\,\text{K}$. Distrattori:
il rapporto rovesciato, $V_1 \cdot \Delta T / T_1$, $V_1 + \Delta T/100$.

- "Un gas occupa $4{,}9\,\text{L}$ alla temperatura di $379\,\text{K}$. A pressione costante viene portato a
  $313\,\text{K}$. Quale volume occupa?" Risposta $4{,}0\,\text{L}$; distrattori $5{,}9$, $0{,}85$, $4{,}2\,\text{L}$.
- "... $2{,}9\,\text{L}$ ... $346\,\text{K}$ ... $559\,\text{K}$ ..." Risposta $4{,}7\,\text{L}$.

## Livello 2: Charles, in gradi Celsius

Un palloncino, $V_1$ da $1{,}00$ a $9{,}99\,\text{L}$, temperature da $-40$ a $150\,^\circ\text{C}$ (almeno $5$ gradi da
zero, $10$ gradi tra loro). Distrattori: il rapporto dei gradi Celsius, il rapporto rovesciato, una sola temperatura in
kelvin.

- "Un palloncino contiene $4{,}89\,\text{L}$ d'aria a $45\,^\circ\text{C}$. La temperatura diventa $14\,^\circ\text{C}$ ..."
  Risposta $4{,}41\,\text{L}$; distrattori $1{,}52\,\text{L}$ (i gradi Celsius), $5{,}42$, $31{,}2\,\text{L}$.
- "... $6{,}59\,\text{L}$ ... $131\,^\circ\text{C}$ ... $45\,^\circ\text{C}$ ..." Risposta $5{,}19\,\text{L}$.

## Livello 3: Gay-Lussac

Un recipiente rigido (bombola, gomma, bomboletta, recipiente di vetro), pressione in atm ($1{,}00$-$5{,}00$) o in kPa
($101$-$499$), temperature da $-30$ a $400\,^\circ\text{C}$. Stessi distrattori del livello 2.

- "La gomma di un'auto contiene aria alla pressione di $279\,\text{kPa}$ e alla temperatura di $92\,^\circ\text{C}$ ...
  a $134\,^\circ\text{C}$?" Risposta $311\,\text{kPa}$.
- "Una bomboletta spray ... $1{,}94\,\text{atm}$ ... $127\,^\circ\text{C}$ ... $356\,^\circ\text{C}$?" Risposta
  $3{,}05\,\text{atm}$.

## Livello 4: la temperatura finale

Metà Charles (volumi interi in mL), metà Gay-Lussac (pressioni intere in kPa), da $100$ a $999$ senza zero finale;
$t_1$ da $-20$ a $60\,^\circ\text{C}$, $T_2$ intera da $200$ a $700\,\text{K}$, costruita all'indietro. Distrattori: i
kelvin scritti come gradi Celsius, la proporzione fatta con i gradi Celsius, il rapporto rovesciato.

- "Un gas occupa $455\,\text{mL}$ a $52\,^\circ\text{C}$ ... alla fine occupa $889\,\text{mL}$ ..." Risposta
  $362\,^\circ\text{C}$; distrattori $635\,^\circ\text{C}$ (i kelvin), $102$, $-107\,^\circ\text{C}$.
- "Un gas in un recipiente rigido ha la pressione di $939\,\text{kPa}$ a $40\,^\circ\text{C}$ ... $624\,\text{kPa}$ ..."
  Risposta $-65\,^\circ\text{C}$.

## Livello 5: dal grafico volume-temperatura

La scena disegna tre punti di una retta per l'origine ($V = c\,T$ con $c$ uguale a $0{,}0025$, $0{,}005$, $0{,}0075$ o
$0{,}01\,\text{L/K}$), sulla quadrettatura ($50\,\text{K}$ e $0{,}5\,\text{L}$ per quadretto), fino a $700\,\text{K}$. Si
chiede il volume a una temperatura data in gradi Celsius (multipla di $50\,\text{K}$ tra $150$ e $650\,\text{K}$, non tra
i punti). Distrattori: la temperatura in gradi Celsius letta sull'asse dei kelvin, il rapporto rovesciato, $273$
sommato due volte.

- Retta $V = 0{,}005\,T$, a $27\,^\circ\text{C}$, cioè $300\,\text{K}$: risposta $1{,}50\,\text{L}$; distrattore $0{,}135\,\text{L}$
  ($27$ letto sull'asse dei kelvin).
- $c = 0{,}0025$, a $-23\,^\circ\text{C}$: risposta $0{,}625\,\text{L}$.

## Esercizi da evitare

- Temperature vicine a $0\,^\circ\text{C}$; un volume chiesto a una temperatura già disegnata.

## Verifica

`chim_legge_charles_gay_lussac.py` rilegge il testo, ricalcola con i razionali di SymPy, al livello 4 controlla che
$T_2$ sia un numero intero di kelvin, al livello 5 legge i punti della scena e controlla che stiano su una retta per
l'origine e sulla quadrettatura.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, $5.000$ esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 110 px su 252).

### Errori piantati

Su 50 esercizi (seed da 300): indice, opzione doppia, cifra dell'opzione giusta, parole vietate, un dato aumentato di uno
bocciati 50 su 50.

### Esercizi diversi su 1.000

Seed da 1: livelli 1-4 998-1000, livello 5 428.

## Domande per la revisione

- Prima e seconda legge di Gay-Lussac o Charles e Gay-Lussac: quale nome usano i libri di chimica delle nostre scuole?
- Nel livello 5 il grafico è in kelvin; serve anche un grafico in gradi Celsius, con la retta che taglia l'asse a
  $-273$? La scena `grafico-dati` non disegna assi negativi.
