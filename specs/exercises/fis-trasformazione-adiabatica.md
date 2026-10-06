# La trasformazione adiabatica

Generatore: `fis-trasformazione-adiabatica` (`src/lib/exercises/v2/generators/fis-trasformazione-adiabatica.ts`, con
`src/lib/exercises/v2/fis-calori-adiabatica.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_trasformazione_adiabatica.py` (con `_fis_calori_adiabatica.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/113-fis-trasformazione-adiabatica.md`. Percorso nel database:
`high_school/physics/termodinamica/fis-trasformazione-adiabatica`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il lavoro dalla temperatura
2. La pressione finale
3. La temperatura finale
4. Il volume finale
5. Temperature in gradi Celsius
6. Il lavoro da pressioni e volumi

## Dati, tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, sempre con l'unità: lavori in J con il segno, pressioni in atm, temperature in K (in
$^\circ\text{C}$ al livello 5), volumi in L. Il testo dice sempre se il gas è monoatomico ($\gamma = \tfrac{5}{3}$,
$C_V = \tfrac{3}{2} R$) o biatomico ($\gamma = 1{,}40$, $C_V = \tfrac{5}{2} R$); i valori di $\gamma$ e di $C_V$ non sono
nel testo. Gas: elio, neon, argon, azoto, ossigeno, idrogeno. Il recipiente è sempre "un cilindro con le pareti
isolanti".

I dati hanno tre cifre significative e il risultato tre (due al livello 6, dove una differenza di due numeri vicini ne
fa perdere una). Le potenze si calcolano esatte e si arrotonda solo alla fine. Mai un risultato a meno di $10^{-6}$ da
un confine di arrotondamento, mai un risultato intero che finisce con zero. Nelle espansioni e nelle compressioni dei
livelli 2, 3 e 6 il volume più piccolo va da $1{,}00$ a $3{,}00\,\text{L}$ a passi di $0{,}10$ e il più grande è $1{,}5$,
$2$, $2{,}5$, $3$ o $4$ volte tanto, sotto i $10\,\text{L}$. Metà espansioni e metà compressioni.

## Livello 1: il lavoro dalla temperatura

$W = n\,C_V\,(T_A - T_B)$, positivo nelle espansioni e negativo nelle compressioni. Da $1{,}00$ a $4{,}00\,\text{mol}$ a
passi di $0{,}05$; $T_A$ tra $280$ e $450\,\text{K}$; la temperatura cambia di $15$-$150\,\text{K}$. $R$ è nel testo.

- "In un cilindro con le pareti isolanti $2{,}35\,\text{mol}$ di elio, un gas monoatomico, vengono compresse: la
  temperatura passa da $292\,\text{K}$ a $410\,\text{K}$. Quanto lavoro compie il gas?" Risposta
  $-3{,}46 \cdot 10^3\,\text{J}$; distrattori $3{,}46 \cdot 10^3\,\text{J}$ (il segno), $-5{,}76 \cdot 10^3\,\text{J}$
  ($C_p$ al posto di $C_V$), $-2{,}30 \cdot 10^3\,\text{J}$ (solo $R$).
- "... $1{,}65\,\text{mol}$ di neon ... vengono compresse ... da $293\,\text{K}$ a $339\,\text{K}$ ..." Risposta
  $-946\,\text{J}$.

## Livello 2: la pressione finale

$p_B = p_A\,(V_A / V_B)^\gamma$, con $p_A$ tra $1{,}00$ e $5{,}00\,\text{atm}$. Scena `curve-pv`: l'adiabatica da $A$ a
$B$ con $V_A$, $p_A$ e $V_B$ scritti sugli assi; nella scena della soluzione c'è anche $p_B$.

- "In un cilindro con le pareti isolanti un campione di elio, un gas monoatomico, occupa $2{,}85\,\text{L}$ alla
  pressione di $4{,}05\,\text{atm}$. Il gas viene compresso adiabaticamente fino a $1{,}90\,\text{L}$. Qual è la pressione
  finale?" Risposta $7{,}96\,\text{atm}$; distrattori $6{,}08\,\text{atm}$ (la legge di Boyle),
  $2{,}06\,\text{atm}$ (il rapporto rovesciato), $7{,}14\,\text{atm}$ (il $\gamma$ di un gas biatomico).
- "... neon ... $2{,}10\,\text{L}$ ... $1{,}93\,\text{atm}$ ... compresso ... fino a $1{,}40\,\text{L}$ ..." Risposta
  $3{,}79\,\text{atm}$.

Il valore della legge di Boyle è un prodotto di due dati e può cadere esattamente su un confine di arrotondamento
($4{,}05 \cdot 1{,}5 = 6{,}075$): si arrotonda per eccesso e resta tra le opzioni. Lo stesso vale per i distrattori
"proporzione semplice" dei livelli 3 e 4.

## Livello 3: la temperatura finale

$T_B = T_A\,(V_A / V_B)^{\gamma - 1}$, con $T_A$ tra $250$ e $450\,\text{K}$ e $T_B$ sotto i $1000\,\text{K}$.

- "In un cilindro con le pareti isolanti un campione di elio, un gas monoatomico, a $403\,\text{K}$, occupa
  $2{,}85\,\text{L}$. Il gas viene compresso adiabaticamente fino a $1{,}90\,\text{L}$. Qual è la temperatura finale?"
  Risposta $528\,\text{K}$; distrattori $792\,\text{K}$ ($\gamma$ al posto di $\gamma - 1$), $308\,\text{K}$ (il rapporto
  rovesciato), $605\,\text{K}$ (una proporzione semplice, $T_A V_A / V_B$).
- "... neon ... a $297\,\text{K}$ ... $2{,}10\,\text{L}$ ... fino a $1{,}40\,\text{L}$ ..." Risposta $389\,\text{K}$.

## Livello 4: il volume finale

La legge rigirata: $V_B = V_A\,(p_A / p_B)^{1/\gamma}$. $V_A$ tra $1{,}00$ e $6{,}00\,\text{L}$; la pressione più bassa tra
$1{,}00$ e $2{,}00\,\text{atm}$ a passi di $0{,}10$, la più alta $1{,}5$, $2$, $2{,}5$, $3$, $4$ o $5$ volte tanto.

- "In un cilindro con le pareti isolanti un campione di elio, un gas monoatomico, occupa $4{,}80\,\text{L}$ alla
  pressione di $1{,}50\,\text{atm}$. Il gas viene compresso adiabaticamente finché la pressione sale a
  $2{,}25\,\text{atm}$. Qual è il volume finale?" Risposta $3{,}76\,\text{L}$; distrattori $3{,}20\,\text{L}$ (la legge di
  Boyle), $2{,}44\,\text{L}$ ($\gamma$ al posto di $1/\gamma$), $6{,}12\,\text{L}$ (il rapporto rovesciato).
- "... neon ... $2{,}10\,\text{L}$ ... $1{,}20\,\text{atm}$ ... sale a $1{,}80\,\text{atm}$ ..." Risposta $1{,}65\,\text{L}$.

## Livello 5: temperature in gradi Celsius

Solo compressioni. Temperatura iniziale intera tra $10$ e $40\,^\circ\text{C}$; il volume diventa $r$ volte più piccolo,
con $r$ tra $1{,}50$ e $9{,}00$ a passi di $0{,}10$. Si converte in kelvin con $273$, si calcola
$T_B = T_A \cdot r^{\gamma - 1}$, si arrotonda a tre cifre (sotto i $1000\,\text{K}$) e si tolgono $273$: la risposta è
un numero intero di gradi Celsius, che non finisce con zero.

- "In un cilindro con le pareti isolanti un campione di ossigeno, un gas biatomico, a $11\,^\circ\text{C}$, viene
  compresso adiabaticamente fino a un volume $4{,}90$ volte più piccolo. A quale temperatura arriva?" Risposta
  $263\,^\circ\text{C}$; distrattori $21\,^\circ\text{C}$ (i gradi Celsius nella formula), $536\,^\circ\text{C}$ (i kelvin
  non riconvertiti), $2355\,^\circ\text{C}$ ($\gamma$ al posto di $\gamma - 1$).
- "... idrogeno ... a $20\,^\circ\text{C}$ ... $3{,}10$ volte più piccolo ..." Risposta $188\,^\circ\text{C}$.

## Livello 6: il lavoro da pressioni e volumi

Due passaggi: prima $p_B$ con la legge di Poisson, poi $W = (p_A V_A - p_B V_B) / (\gamma - 1)$ con i volumi in metri
cubi. $p_A$ tra $1{,}00$ e $5{,}00 \cdot 10^5\,\text{Pa}$. Il risultato ha due cifre significative e il suo segno, e deve
essere lo stesso anche arrotondando $p_B$ a tre cifre prima del conto. Scena `curve-pv` come al livello 2, con la
pressione in $10^5\,\text{Pa}$.

- "In un cilindro con le pareti isolanti un campione di elio, un gas monoatomico, occupa $2{,}85\,\text{L}$ alla
  pressione di $4{,}05 \cdot 10^5\,\text{Pa}$. Il gas viene compresso adiabaticamente fino a $1{,}90\,\text{L}$. Quanto
  lavoro compie il gas?" Risposta $-5{,}4 \cdot 10^2\,\text{J}$; distrattori $5{,}4 \cdot 10^2\,\text{J}$ (il segno),
  $-3{,}6 \cdot 10^2\,\text{J}$ (senza dividere per $\gamma - 1$), $-5{,}4 \cdot 10^5\,\text{J}$ (i litri non convertiti
  in metri cubi).
- "... neon ... $2{,}10\,\text{L}$ ... $1{,}93 \cdot 10^5\,\text{Pa}$ ... fino a $1{,}40\,\text{L}$ ..." Risposta
  $-1{,}9 \cdot 10^2\,\text{J}$.

## Da evitare

- Rapporti dei volumi oltre 4: il punto $B$ finirebbe schiacciato sull'asse nella scena, e le temperature fuori scala.
- Temperature finali da $1000\,\text{K}$ in su, che con tre cifre andrebbero in notazione scientifica.
- La scena non deve dare la risposta: gli assi non hanno scala, e la pressione finale compare solo nella scena della
  soluzione.
- L'espansione libera, che è adiabatica ma non segue la legge di Poisson: resta nella lezione.
