# Grandezze e unità del Sistema Internazionale (chimica)

Generatore: `chim-grandezze-si` (`src/lib/exercises/v2/generators/chim-grandezze-si.ts`, con i pezzi comuni di
`src/lib/exercises/v2/chim-misure.ts` e `fis-grandezze.ts`). Verifica indipendente:
`scripts/exercises/checkers/chim_grandezze_si.py` (con `_chim_misure.py` e `_fis_grandezze.py`). Lezione collegata:
`docs/lezioni/chimica/riscritte/10-chim-grandezze-si.md`. Percorso nel database:
`high_school/chemistry/chim-misure/chim-grandezze-si`.

Sei livelli, ognuno con una difficoltà in più. Tutti a scelta multipla con quattro opzioni, l'unità dentro l'opzione.

## Nomi dei livelli

1. Unità e simboli
2. Un prefisso e l'unità
3. Notazione scientifica
4. Tra due prefissi
5. I volumi
6. Densità e concentrazioni

## Scrittura dei numeri

Come nella lezione: virgola decimale `{,}`, spazio sottile ogni tre cifre da cinque cifre intere in su
($35\,200$), notazione scientifica $a \cdot 10^{n}$, unità dopo uno spazio sottile ($0{,}0352\,\text{L}$,
$9{,}71\,\mu\text{mol}$, $1{,}2\,\text{kg/m}^3$). I dati hanno da una a tre cifre significative e nessuno zero finale dopo
la virgola: qui si convertono unità, le cifre significative sono della lezione 13. Una risposta si scrive in forma
decimale se ha al più quattro decimali ed è sotto il milione, altrimenti in notazione scientifica (livelli 5 e 6); al
livello 4 sempre in notazione scientifica.

## Livello 1: unità e simboli

Un terzo ciascuno:

- l'unità del SI di una delle sette grandezze fondamentali (la quantità di sostanza è una di loro); opzioni "nome
  (simbolo)", distrattori dalla stessa famiglia (per la mole: grammo, chilogrammo, litro, candela);
- quale misura è scritta correttamente, tra $\text{g}$, $\text{kg}$, $\text{mol}$, $\text{mL}$, $\text{K}$, $\text{s}$ e le
  scritture sbagliate della tabella della lezione (gr, Kg, moli, mL., °K, sec...);
- il valore di un prefisso (mega, kilo, deci, centi, milli, micro, nano, pico), con il segno sbagliato e tre o sei
  potenze di distanza tra i distrattori.

Esempi: "Qual è l'unità di misura del Sistema Internazionale per la quantità di sostanza?" Risposta mole (mol).
"Quale di queste misure è scritta correttamente?" $298\,\text{K}$ tra 298 °K, 298 K., 298 k.

## Livello 2: un prefisso e l'unità

Da $\text{g}$, $\text{L}$, $\text{mol}$ o $\text{J}$ a $\text{kg}$, $\text{mg}$, $\text{mL}$, $\text{mmol}$, $\text{kJ}$ o
viceversa, metà verso l'unità e metà dall'unità. Risposta decimale con al più quattro decimali, sotto il milione.
Distrattori: l'esponente con il segno sbagliato, una o due potenze di troppo o di meno.

- "Esprimi $0{,}971\,\text{mol}$ in $\text{mmol}$." Risposta $971\,\text{mmol}$; distrattori $0{,}000971$, $97{,}1$,
  $9710\,\text{mmol}$.
- "Esprimi $88\,\text{mmol}$ in $\text{mol}$." Risposta $0{,}088\,\text{mol}$.

## Livello 3: notazione scientifica

Il 60% chiede di scrivere una misura in notazione scientifica, con distrattori dagli zeri contati al posto dei posti
(l'avviso della lezione), l'esponente con il segno sbagliato e uno in più o in meno; il 40% chiede di riconoscerla tra
quattro scritture dello stesso numero, una sola con $1 \le a < 10$. Esponenti da $3$ a $9$ e da $-9$ a $-3$.

- "Scrivi in notazione scientifica la misura $0{,}0000074\,\text{m}$." Risposta $7{,}4 \cdot 10^{-6}\,\text{m}$.
- "Quale di queste scritture è la notazione scientifica della misura $3000\,\text{mol}$?" Risposta
  $3 \cdot 10^3\,\text{mol}$ tra $0{,}3 \cdot 10^4$, $30 \cdot 10^2$, $300 \cdot 10$.

## Livello 4: tra due prefissi

Tra due multipli o sottomultipli di $\text{g}$ ($\text{kg}$, $\text{mg}$, $\mu\text{g}$), $\text{L}$ ($\text{mL}$,
$\mu\text{L}$), $\text{mol}$ ($\text{mmol}$, $\mu\text{mol}$) o $\text{m}$ ($\mu\text{m}$, $\text{nm}$, $\text{pm}$),
distanti da $10^3$ a $10^9$; risposta in notazione scientifica con l'esponente tra $2$ e $12$ in valore assoluto. I
passaggi passano dall'unità, come l'esempio 3 della lezione. Distrattori: il fattore rovesciato, tre potenze di troppo
o di meno, una potenza di troppo o di meno.

- "Esprimi $88\,\text{mmol}$ in $\mu\text{mol}$, in notazione scientifica." Risposta $8{,}8 \cdot 10^4\,\mu\text{mol}$.
- "Esprimi $9{,}71\,\mu\text{mol}$ in $\text{mmol}$, in notazione scientifica." Risposta
  $9{,}71 \cdot 10^{-3}\,\text{mmol}$.

## Livello 5: i volumi

Tra $\text{m}^3$, $\text{dm}^3$, $\text{L}$, $\text{cm}^3$ e $\text{mL}$, due unità con fattore diverso da $1$ (le coppie
$\text{L}$-$\text{dm}^3$ e $\text{mL}$-$\text{cm}^3$ no). Distrattori dall'avviso della lezione: il fattore delle
lunghezze non elevato alla terza ($10$ invece di $1000$), elevato al quadrato, il fattore rovesciato, tre potenze di
troppo o di meno.

- "Esprimi il volume $35{,}2\,\text{mL}$ in $\text{L}$." Risposta $0{,}0352\,\text{L}$; distrattori $3{,}52$, $0{,}352$,
  $35\,200\,\text{L}$.
- "Esprimi il volume $2{,}5\,\text{m}^3$ in $\text{cm}^3$." Risposta $2{,}5 \cdot 10^6\,\text{cm}^3$.

## Livello 6: densità e concentrazioni

Undici coppie tra $\text{g/mL}$, $\text{g/cm}^3$, $\text{kg/m}^3$, $\text{g/L}$, $\text{mg/mL}$ e $\text{mg/L}$, circa un
terzo con fattore $1$ ($\text{g/L}$ e $\text{kg/m}^3$, $\text{mg/mL}$ e $\text{g/L}$). Nei passaggi si convertono la massa e
il volume separatamente, come l'esempio 5 della lezione. Distrattori: il fattore dalla parte sbagliata della frazione,
il numero lasciato com'è, un milione; con fattore $1$, mille in più o in meno e un milione.

- "Esprimi $500\,\text{kg/m}^3$ in $\text{g/L}$." Risposta $500\,\text{g/L}$; distrattori $0{,}5$, $500\,000$,
  $5 \cdot 10^8\,\text{g/L}$.
- "Esprimi $3\,\text{g/L}$ in $\text{mg/mL}$." Risposta $3\,\text{mg/mL}$.

## Esercizi da evitare

- Risposte con più di quattro decimali in forma decimale; numeri oltre $10^{12}$.
- Opzioni con lo stesso valore scritto in due modi.

## Verifica

`chim_grandezze_si.py` rilegge il testo, riconosce la grandezza, il prefisso o le unità, ricalcola con i razionali di
SymPy e controlla che l'opzione giusta sia una sola, al suo indice, scritta nel modo canonico.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 146 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta spostato e opzione copiata su un'altra bocciati 60 su 60; una
cifra dell'opzione giusta cambiata bocciata 58 su 60 (le due che passano sono domande sull'unità, senza cifre); una cifra
di un dato del testo cambiata bocciata 50 su 50 nei livelli 2-6 (il livello 1 non ha numeri nel testo).
