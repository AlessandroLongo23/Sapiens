# Composizione percentuale, formula minima e formula molecolare

Generatore: `chim-formula-minima` (`src/lib/exercises/v2/generators/chim-formula-minima.ts`, con
`src/lib/exercises/v2/chim-mole.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_formula_minima.py` (con
`_chim_mole.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/35-chim-formula-minima.md`. Percorso nel database:
`high_school/chemistry/chim-quantita-sostanza/chim-formula-minima`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Dalla formula molecolare
2. La percentuale in massa
3. Dalla composizione alla formula minima
4. Quando serve moltiplicare
5. La formula molecolare

## Tipi di risposta e dati

Scelta multipla, quattro opzioni. Nei livelli 1, 3, 4 e 5 le opzioni sono formule (`\mathrm{C_6H_{12}O_6}`), con il
carbonio per primo nei composti del carbonio e l'ordine tradizionale negli altri, come la lezione; nel livello 2 sono
percentuali con tre cifre significative ($38{,}7\,\%$). Masse atomiche della tavola della lezione 01. Le percentuali
dei livelli 3-5 sono quelle della formula vera, arrotondate a un decimale, come le dà un'analisi.

## Livello 1: dalla formula molecolare

Venti molecole con indici che hanno un divisore comune (glucosio, acqua ossigenata, etano, benzene, acido acetico,
butano, tetrossido di diazoto, anidride fosforica, ottano, etino, cicloesano, propene, butene, idrazina, etene,
naftalene, acido ascorbico, stirene, acido butanoico, glicole etilenico).

- "La formula molecolare del glucosio è $\mathrm{C_6H_{12}O_6}$. Qual è la sua formula minima?" Risposta
  $\mathrm{CH_2O}$; distrattori $\mathrm{C_6H_{12}O_6}$ (non ridotta), $\mathrm{C_3H_6O_3}$ (divisa solo per $2$),
  $\mathrm{C_2H_4O_2}$ (divisa per $3$) o $\mathrm{CH_{12}O_6}$ (diviso solo il primo indice).
- "La formula molecolare dell'etene è $\mathrm{C_2H_4}$..." Risposta $\mathrm{CH_2}$; distrattori
  $\mathrm{C_2H_4}$, $\mathrm{CH_4}$, $\mathrm{C_2H_2}$.

## Livello 2: la percentuale in massa

Un campione di $1{,}00$-$9{,}99\,\text{g}$ di un composto (binario o ternario, dai due elenchi dei livelli 3 e 4)
contiene una massa dell'elemento calcolata dalla formula e arrotondata a tre cifre, almeno $0{,}1\,\text{g}$.
Distrattori: il rapporto rovesciato (campione su elemento, sopra il $100\,\%$), la percentuale del resto del campione,
l'elemento diviso il resto.

- "Un campione di $3{,}56\,\text{g}$ di un composto di azoto e ossigeno contiene $1{,}31\,\text{g}$ di azoto..."
  Risposta $36{,}8\,\%$; distrattori $272\,\%$, $63{,}2\,\%$, $58{,}2\,\%$.
- "... $5{,}74\,\text{g}$ di un composto di potassio, azoto e ossigeno contiene $2{,}22\,\text{g}$ di potassio"
  Risposta $38{,}7\,\%$.

## Livello 3: dalla composizione alla formula minima

Trentasei formule minime in cui, divise per la più piccola, le moli di atomi sono intere a meno di $0{,}1$ (ossidi,
sali, idrocarburi e alcoli semplici: $\mathrm{CH_2O}$, $\mathrm{NO_2}$, $\mathrm{FeS_2}$, $\mathrm{Na_2SO_4}$,
$\mathrm{C_3H_8O}$...). Distrattori, solo formule già ridotte: le percentuali usate come atomi (rapporto delle
percentuali arrotondato), gli indici scambiati, un indice più o meno uno.

- "Un composto contiene $46{,}5\,\%$ di ferro e $53{,}5\,\%$ di zolfo. Qual è la sua formula minima?" Risposta
  $\mathrm{FeS_2}$; distrattori $\mathrm{FeS}$, $\mathrm{Fe_2S}$, un indice sbagliato.
- "... $15{,}8\,\%$ di carbonio e $84{,}2\,\%$ di zolfo" Risposta $\mathrm{CS_2}$.

## Livello 4: quando serve moltiplicare

Diciannove formule minime con un quoziente che finisce in $0{,}5$ ($\times 2$: $\mathrm{Fe_2O_3}$, $\mathrm{P_2O_5}$,
$\mathrm{C_2H_5}$, $\mathrm{Cl_2O_7}$...), in $0{,}33$ o $0{,}67$ ($\times 3$: $\mathrm{Fe_3O_4}$, $\mathrm{C_3H_8}$,
$\mathrm{C_3H_4O_3}$...) o in $0{,}25$ o $0{,}75$ ($\times 4$: $\mathrm{C_4H_5}$, $\mathrm{C_5H_4}$). Distrattori: il
quoziente arrotondato per difetto e per eccesso invece di moltiplicare (l'avviso della lezione), poi come il livello 3.

- "Un composto contiene $87{,}7\,\%$ di carbonio e $12{,}3\,\%$ di idrogeno." Risposta $\mathrm{C_3H_5}$;
  distrattori $\mathrm{CH_2}$ ($1{,}67$ arrotondato), $\mathrm{CH}$, $\mathrm{C_7H}$ (le percentuali come atomi).
- "... $40{,}9\,\%$ di carbonio, $4{,}6\,\%$ di idrogeno e $54{,}5\,\%$ di ossigeno" Risposta $\mathrm{C_3H_4O_3}$.

## Livello 5: la formula molecolare

Le venti molecole del livello 1: composizione e massa molare con tre cifre. Il rapporto $M / M_{\text{min}}$ è intero a
meno di $0{,}05$. Distrattori: la formula minima, una unità in più o in meno, il doppio delle unità.

- "Un composto contiene $85{,}6\,\%$ di carbonio e $14{,}4\,\%$ di idrogeno, e la sua massa molare è
  $56{,}1\,\text{g/mol}$." Risposta $\mathrm{C_4H_8}$; distrattori $\mathrm{CH_2}$, $\mathrm{C_3H_6}$,
  $\mathrm{C_5H_{10}}$.
- "... la sua massa molare è $28{,}1\,\text{g/mol}$" Risposta $\mathrm{C_2H_4}$.

## Esercizi da evitare

- Distrattori con la stessa composizione della risposta nei livelli 3 e 4 (il doppio della formula minima), che
  sarebbero giusti come rapporto.
- Masse dell'elemento sotto $0{,}1\,\text{g}$ (livello 2): tre cifre significative diventerebbero poche.
- Formule in cui il procedimento, con le percentuali a un decimale, non dà la formula vera (scartate dal generatore).

## Verifica

`chim_formula_minima.py` rilegge il testo, riconosce elementi e percentuali, rifà il procedimento della lezione con la
sua copia della tavola (moli in 100 g, divisione per la più piccola, moltiplicatore da 1 a 4 con tolleranza $0{,}1$),
controlla che la somma delle percentuali sia $100 \pm 0{,}2$, che il livello 3 non chieda moltiplicazioni e il 4 sì,
che nessun distrattore dei livelli 3-4 abbia la stessa composizione della risposta, che $n$ del livello 5 sia intero, e
per il livello 2 che la massa dell'elemento sia coerente con il composto a meno dell'arrotondamento del dato.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 98 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta, parole vietate
bocciati 60 su 60; primo dato raddoppiato bocciato 48 su 48; due dati scambiati bocciati 48 su 48 (i livelli 2-5; il
livello 1 ha un solo dato). Cambiare l'ultima cifra di un dato è bocciato solo quando cambia la risposta (livello 2, 10
su 12): nei livelli 3-5 una percentuale che cambia di $0{,}1$ dà la stessa formula, e l'esercizio resta giusto.

### Esercizi diversi su 1.000

Seed da 1: livello 1 20, livello 2 995, livello 3 33, livello 4 19, livello 5 20. I livelli 1, 3, 4 e 5 hanno un
esercizio per sostanza: per averne di più servono altre sostanze vere nelle liste.

## Domande per la revisione

- Le formule minime che non sono sostanze ($\mathrm{C_2H_5}$, $\mathrm{C_3H_5}$, $\mathrm{C_4H_5}$) vanno bene negli
  esercizi, come nei libri, o si preferiscono solo composti veri?
- La tolleranza "intero a meno di qualche centesimo" (qui $0{,}1$ sui quozienti) è quella che si insegna?
