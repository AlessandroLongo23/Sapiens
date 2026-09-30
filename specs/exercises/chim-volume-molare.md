# Il volume molare

Generatore: `chim-volume-molare` (`src/lib/exercises/v2/generators/chim-volume-molare.ts`, con
`src/lib/exercises/v2/chim-mole.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_volume_molare.py` (con
`_chim_mole.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/36-chim-volume-molare.md`. Percorso nel database:
`high_school/chemistry/chim-quantita-sostanza/chim-volume-molare`.

Cinque livelli, ognuno con una difficoltà in più, tutti in condizioni normali ($0\,^\circ\text{C}$, $1\,\text{atm}$,
$V_m = 22{,}4\,\text{L/mol}$).

## Nomi dei livelli

1. Moli e volume
2. Massa e volume
3. Molecole e atomi in un volume
4. La densità di un gas
5. La formula di un gas

## Tipi di risposta e dati

Scelta multipla, quattro opzioni con l'unità: $\text{mol}$, $\text{L}$, $\text{g}$, $\text{g/L}$, $\text{g/mol}$,
"molecole" o "atomi"; nel livello 5 formule. Dati con tre cifre significative, risultati arrotondati a tre (in
notazione scientifica sotto $0{,}01$ e da $1000$ in su), mai a meno di $10^{-6}$ da un confine di arrotondamento.
Sedici gas (idrogeno, azoto, ossigeno, cloro, anidride carbonica, metano, ammoniaca, monossido di carbonio, anidride
solforosa, propano, etano, etene, etino, solfuro di idrogeno, protossido di azoto, monossido di azoto), masse molari
dalla tavola della lezione 01. Numero di Avogadro $6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$, scritto nel testo.

## Livello 1: moli e volume

Metà: le moli da un volume di $1{,}00$-$99{,}9\,\text{L}$; distrattori $V \cdot 22{,}4$ e $22{,}4 / V$. Metà: il volume
di $0{,}100$-$9{,}99\,\text{mol}$; distrattori $n / 22{,}4$ e $22{,}4 / n$.

- "Quante moli ci sono in $5{,}84\,\text{L}$ di etene, $\mathrm{C_2H_4}$, in condizioni normali?" Risposta
  $0{,}261\,\text{mol}$; distrattori $131\,\text{mol}$, $3{,}84\,\text{mol}$.
- "Che volume occupano $2{,}00\,\text{mol}$ di ..." Risposta $44{,}8\,\text{L}$.

## Livello 2: massa e volume

Metà: la massa di un volume ($1{,}00$-$99{,}9\,\text{L}$), $m = V / V_m \cdot M$; distrattori: le moli scritte come
grammi, $V \cdot M$ ($V_m$ dimenticato), per gli elementi biatomici la massa dell'atomo, $V \cdot 22{,}4 / M$. Metà: il
volume di una massa ($1{,}00$-$99{,}9\,\text{g}$); distrattori $m \cdot 22{,}4$ ($M$ dimenticata), le moli, la massa
dell'atomo per gli elementi.

- "Quanti grammi pesano $5{,}84\,\text{L}$ di etene, $\mathrm{C_2H_4}$, in condizioni normali?" Risposta
  $7{,}32\,\text{g}$; distrattori $0{,}261\,\text{g}$, $164\,\text{g}$, $4{,}66\,\text{g}$.
- "Che volume occupano $88{,}0\,\text{g}$ di anidride carbonica..." Risposta $44{,}8\,\text{L}$.

## Livello 3: molecole e atomi in un volume

Volume $0{,}100$-$99{,}9\,\text{L}$; metà chiede le molecole, metà gli atomi (molecole per il numero di atomi della
formula). Distrattori: molecole e atomi scambiati (se la molecola ha più atomi), $V \cdot N_A$ ($V_m$ dimenticato),
$V \cdot 22{,}4 \cdot N_A$, le moli divise per $N_A$.

- "Quanti atomi ci sono in $0{,}584\,\text{L}$ di etene..." Risposta $9{,}42 \cdot 10^{22}$ atomi; distrattori
  $1{,}57 \cdot 10^{22}$ (le molecole), $2{,}11 \cdot 10^{24}$, $4{,}73 \cdot 10^{25}$.
- "Quante molecole ci sono in $1{,}00\,\text{L}$ di azoto..." Risposta $2{,}69 \cdot 10^{22}$ molecole.

## Livello 4: la densità di un gas

Metà: la densità di uno dei sedici gas, $d = M / 22{,}4$; distrattori $22{,}4 / M$, $M \cdot 22{,}4$, per gli
elementi la massa dell'atomo. Metà: la massa molare da una densità di $0{,}500$-$4{,}99\,\text{g/L}$, $M = d \cdot 22{,}4$;
distrattori $d / 22{,}4$ e $22{,}4 / d$.

- "Qual è la densità dell'etene, $\mathrm{C_2H_4}$, in condizioni normali?" Risposta $1{,}25\,\text{g/L}$;
  distrattori $0{,}798\,\text{g/L}$, $629\,\text{g/L}$.
- "Un gas ha densità $1{,}96\,\text{g/L}$ in condizioni normali. Qual è la sua massa molare?" Risposta
  $43{,}9\,\text{g/mol}$.

## Livello 5: la formula di un gas

Sette idrocarburi gassosi con formula molecolare multipla della minima (etene, propene, butene, etino, etano, butano,
butadiene): formula minima e densità con tre cifre. Distrattori: la formula minima, una unità in più o in meno, il
doppio delle unità.

- "Un idrocarburo gassoso ha formula minima $\mathrm{CH_3}$, e in condizioni normali la sua densità è
  $1{,}34\,\text{g/L}$." Risposta $\mathrm{C_2H_6}$; distrattori $\mathrm{CH_3}$, $\mathrm{C_3H_9}$,
  $\mathrm{C_4H_{12}}$.
- "... formula minima $\mathrm{C_2H_5}$ ... $2{,}60\,\text{g/L}$" Risposta $\mathrm{C_4H_{10}}$.

## Esercizi da evitare

- Il volume molare usato fuori dalle condizioni normali: tutti i testi dicono "in condizioni normali".
- Distrattori con la stessa cifra della risposta: scartati (quattro valori diversi).

## Verifica

`chim_volume_molare.py` rilegge il testo, controlla intervalli e cifre dei dati, ricalcola con i razionali di SymPy e
la sua copia della tavola, arrotonda come la specifica e confronta con l'opzione giusta; nel livello 5 ricava $n$ dalla
densità e controlla che sia intero.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 167 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice, opzione doppia, testo dell'opzione giusta, parole vietate bocciati 60 su 60;
primo dato raddoppiato bocciato 54 su 54; due dati scambiati bocciati 48 su 48. L'ultima cifra di un dato cambiata di
uno è bocciata solo quando cambia il risultato arrotondato.

### Esercizi diversi su 1.000

Seed da 1: livelli 1-3 992; livello 4 409 (la metà con la densità di un gas della lista ne ha 16); livello 5 7,
uno per idrocarburo.

## Domande per la revisione

- Gli esercizi restano in condizioni normali ($22{,}4\,\text{L/mol}$): serve anche un livello con $24{,}5\,\text{L/mol}$
  a $25\,^\circ\text{C}$, come in alcuni libri?
