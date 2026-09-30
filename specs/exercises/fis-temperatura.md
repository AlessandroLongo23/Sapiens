# La temperatura e le scale termometriche

Generatore: `fis-temperatura` (`src/lib/exercises/v2/generators/fis-temperatura.ts`, con il modulo comune del gruppo 19
`src/lib/exercises/v2/fis-termologia.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_temperatura.py` (con
`_fis_termologia.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/65-fis-temperatura.md`. Percorso nel database:
`high_school/physics/fis-temperatura-calore/fis-temperatura`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Celsius e kelvin
2. Le differenze di temperatura
3. Da Celsius a Fahrenheit
4. Da Fahrenheit a Celsius
5. La taratura del termometro

## Tipi di risposta

Scelta multipla, quattro opzioni, l'unità nell'opzione: temperature in gradi interi ($-122\,^\circ\text{C}$,
$296\,\text{K}$, $98\,^\circ\text{F}$, con il segno meno sotto lo zero), lunghezze della colonna in centimetri con un
decimale ($12{,}1\,\text{cm}$). I numeri sono costruiti all'indietro: tutte le risposte sono esatte, senza arrotondamenti.
Si usa $273$ al posto di $273{,}15$, come dice la lezione per i dati interi (i passaggi lo ricordano).

## Livello 1: Celsius e kelvin

Metà dei casi da Celsius a kelvin ($t$ da $-60$ a $300\,^\circ\text{C}$, non zero), metà da kelvin a Celsius ($T$ da $150$ a
$600\,\text{K}$, non $273$).

- "Un termometro segna $-17\,^\circ\text{C}$. Quanto vale la temperatura assoluta?" Risposta $256\,\text{K}$; distrattori
  $290\,\text{K}$ ($273 - t$, e anche il segno perso: $|t| + 273$), $356\,\text{K}$ ($373$ al posto di $273$), poi valori
  vicini a passi di $10$.
- "Un corpo è alla temperatura assoluta di $151\,\text{K}$. Quanto vale la sua temperatura in gradi Celsius?" Risposta
  $-122\,^\circ\text{C}$; distrattori $424\,^\circ\text{C}$ ($273$ aggiunto), $122\,^\circ\text{C}$ (il segno), $-222\,^\circ\text{C}$
  ($373$), $151\,^\circ\text{C}$ (nessuna conversione).

## Livello 2: le differenze di temperatura

Metà: due temperature Celsius ($t_1$ da $-30$ a $60$, aumento da $5$ a $120$), si chiede l'aumento in kelvin. Metà: la
prima in kelvin ($250$-$330\,\text{K}$), la seconda in Celsius, si chiede l'aumento in gradi Celsius.

- "L'aria di una stanza passa da $-5\,^\circ\text{C}$ a $37\,^\circ\text{C}$. Di quanti kelvin è aumentata la sua
  temperatura?" Risposta $42\,\text{K}$; distrattori $315\,\text{K}$ ($273$ aggiunto alla differenza), $310\,\text{K}$ (la
  temperatura finale in kelvin), $32\,\text{K}$ (le due temperature sommate).
- "Un gas passa da $283\,\text{K}$ a $45\,^\circ\text{C}$. Di quanti gradi Celsius è aumentata la sua temperatura?" Risposta
  $35\,^\circ\text{C}$; distrattori $238\,^\circ\text{C}$ (sottratte senza convertire), $308\,^\circ\text{C}$ ($273$ aggiunto),
  $511\,^\circ\text{C}$ ($273$ aggiunto dalla parte sbagliata).

## Livello 3: da Celsius a Fahrenheit

$t$ multiplo di $5$ tra $-40$ e $250\,^\circ\text{C}$ (non zero), così $t_F = \frac{9}{5}t + 32$ è intero. Il contesto dipende
dalla temperatura: il forno da $150\,^\circ\text{C}$ in su, le previsioni del tempo tra $-20$ e $40\,^\circ\text{C}$, altrimenti "un
termometro".

- "Un termometro segna $140\,^\circ\text{C}$. Quanto vale questa temperatura in gradi Fahrenheit?" Risposta
  $284\,^\circ\text{F}$; distrattori $252\,^\circ\text{F}$ (il $32$ dimenticato), $110\,^\circ\text{F}$ ($\frac{5}{9}$ al posto di
  $\frac{9}{5}$), $310\,^\circ\text{F}$ (il $32$ aggiunto prima di moltiplicare).

Il livello ha pochi esercizi diversi (una sessantina): il dato è un numero solo.

## Livello 4: da Fahrenheit a Celsius

$t_F = 32 + 9k$, con la risposta $5k$ intera tra $-40$ e $150\,^\circ\text{C}$ (non zero); contesti come al livello 3 (forno da
$120\,^\circ\text{C}$).

- "Un termometro americano segna $176\,^\circ\text{F}$. Quanto vale questa temperatura in gradi Celsius?" Risposta
  $80\,^\circ\text{C}$; distrattori $66\,^\circ\text{C}$ ($\frac{5}{9}t_F - 32$, l'avviso della lezione), $98\,^\circ\text{C}$ (il $32$
  dimenticato), $144\,^\circ\text{C}$ (solo il $32$ tolto).

Pochi esercizi diversi (una quarantina), come al livello 3.

## Livello 5: la taratura del termometro

Colonna nel ghiaccio fondente $L_0$ da $1{,}0$ a $5{,}0\,\text{cm}$; tra i due punti fissi $10{,}0$, $12{,}0$, $15{,}0$, $16{,}0$, $20{,}0$
o $25{,}0\,\text{cm}$; temperatura intera da $5$ a $95\,^\circ\text{C}$ scelta perché la colonna abbia un decimale solo. Metà dei
casi dalla colonna alla temperatura, metà dalla temperatura alla colonna.

- "Nel ghiaccio fondente la colonna di un termometro è lunga $3{,}0\,\text{cm}$, nell'acqua bollente $18{,}0\,\text{cm}$,
  misurate dalla base del capillare. In una stanza la colonna è lunga $7{,}2\,\text{cm}$. Che temperatura c'è nella
  stanza?" Risposta $28\,^\circ\text{C}$; distrattori $40\,^\circ\text{C}$ (la colonna dalla base del capillare, $L/L_{100}$),
  $23\,^\circ\text{C}$ ($(L - L_0)/L_{100}$), $48\,^\circ\text{C}$ ($L/(L_{100} - L_0)$).
- Dalla temperatura alla colonna i distrattori sono $\frac{t}{100}L_{100}$, il solo aumento $\frac{t}{100}(L_{100} - L_0)$ e
  $L_0 + \frac{t}{100}L_{100}$.

## Esercizi da evitare

- La temperatura zero nei livelli 1, 3 e 4 (la conversione sarebbe banale o l'opzione giusta coinciderebbe con un errore).
- Temperature sotto lo zero assoluto: i dati restano sopra $150\,\text{K}$.

## Verifica

`fis_temperatura.py` rilegge il testo, controlla intervalli, contesti e cifre, ricalcola con i razionali di SymPy e
confronta l'opzione giusta e il formato delle altre (numero intero o con un decimale, l'unità, quattro valori diversi).

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, $1000$ esercizi per livello ciascuno, PASS, quote dei casi dentro
gli intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 62 px su 252).

### Errori piantati

Bocciati tutti (200 su 200 per tipo, 40 esercizi per livello): indice dell'opzione giusta, un numero del testo cambiato,
testo dell'opzione giusta, opzione doppia, parole vietate.

### Esercizi diversi su 1.000

Seed da 1: livello 1 576, livello 2 992, livello 3 58, livello 4 38, livello 5 989.

## Domande per la revisione

- Negli esercizi $273$ o $273{,}15$? Qui $273$, con i dati interi.
- I livelli 3 e 4 hanno pochi esercizi diversi: si possono aprire a temperature che danno un decimale ($37\,^\circ\text{C} =
  98{,}6\,^\circ\text{F}$), se le risposte con un decimale vanno bene.
