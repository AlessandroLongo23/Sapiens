# La legge di Lavoisier

Generatore: `chim-legge-lavoisier` (`src/lib/exercises/v2/generators/chim-legge-lavoisier.ts`, con
`src/lib/exercises/v2/chim-leggi-ponderali.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_legge_lavoisier.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/23-chim-legge-lavoisier.md`. Percorso nel database:
`high_school/chemistry/chim-trasformazioni-chimiche/chim-legge-lavoisier`.

Cinque livelli, ognuno con una difficoltà in più. Scelta multipla, quattro opzioni in grammi.

## Tipi di risposta e cifre

Tutte le masse al centesimo di grammo, scritte con due decimali; somme e differenze sono esatte e la risposta ha due
decimali, come dice la lezione (i decimali del dato che ne ha meno). Le masse seguono le reazioni vere: sono
proporzionali alle masse dell'equazione bilanciata, calcolate con la tavola della lezione 01, arrotondate al centesimo;
la massa chiesta è la differenza esatta delle altre.

## Nomi dei livelli

1. Reagenti e prodotto
2. La massa mancante
3. Il recipiente aperto
4. Il becher e il vetrino
5. Il reagente che avanza

## Livello 1: reagenti e prodotto

Recipiente chiuso, due reagenti che reagiscono del tutto e un prodotto, da 8 sintesi (ferro e zolfo, magnesio e
ossigeno, carbonio e ossigeno, idrogeno e ossigeno, sodio e cloro, ossido di calcio e acqua, ferro e ossigeno, azoto e
idrogeno). Primo reagente da $1{,}00$ a $30{,}00\,\text{g}$. Distrattori: la differenza, uno dei due reagenti.

- "In un recipiente chiuso $2{,}12\,\text{g}$ di ossido di calcio reagiscono completamente con $0{,}68\,\text{g}$ di acqua
  ..." Risposta $2{,}80\,\text{g}$; distrattori $1{,}44$, $2{,}12$, $0{,}68\,\text{g}$.

## Livello 2: la massa mancante

Una reazione con almeno tre sostanze (le sintesi e 9 reazioni con più prodotti: decomposizioni del calcare, del
carbonato di magnesio, del clorato di potassio, dell'acqua ossigenata, del bicarbonato; metano, bicarbonato e aceto,
marmo e acido cloridrico, magnesio e acido cloridrico); manca un reagente o un prodotto ("una certa massa di ...").
Distrattori: tutte le masse note sommate, l'altro lato soltanto, un termine dello stesso lato dimenticato.

## Livello 3: il recipiente aperto

Metà un gas che esce (becher con acido cloridrico o aceto e un solido; crogiolo con calcare o clorato di potassio
scaldati): gas = lettura prima meno lettura dopo; distrattori il solido intero, il solido meno il gas, il doppio. Metà un
metallo che brucia all'aria (magnesio, calcio, ferro in polvere): ossigeno = dopo meno prima; distrattori l'ossido, il
metallo, la loro differenza. Solido da $0{,}50$ a $5{,}00\,\text{g}$, gas almeno $0{,}10\,\text{g}$.

## Livello 4: il becher e il vetrino

Il becher con il liquido e il vetrino con il solido pesati prima, il becher e il vetrino vuoto dopo:
gas $= (m_{becher} + m_{vetrino\ pieno}) - (m_{becher\ dopo} + m_{vetrino\ vuoto})$. Distrattori: il vetrino vuoto
dimenticato, la massa del solido, l'aumento del becher.

## Livello 5: il reagente che avanza

Una sintesi con un reagente in eccesso, in un recipiente chiuso. Metà: data la massa del prodotto, quanto avanza;
distrattori tutto il reagente in eccesso, la parte che ha reagito, la differenza dei due reagenti. Metà: data la massa
che avanza, quanto prodotto; distrattori tutti i reagenti, l'avanzo sommato invece che tolto, il reagente in eccesso
senza l'altro.

## Verifica

Il controllo rilegge le masse dal testo, rifà la conservazione con i razionali esatti, e confronta le masse con
l'equazione bilanciata, con masse molari ricalcolate dalle formule (tolleranza un centesimo, tre per il livello 2 dove si
arrotondano più masse); controlla che ogni massa abbia due decimali e il valore di ogni opzione.

Esito (30 settembre 2026): seed 1, 50001, 777001, 5.000 esercizi ciascuno, PASS. Errori piantati su 60 esercizi: indice,
opzione doppia, testo dell'opzione giusta bocciati 60 su 60; un dato aumentato di un centesimo bocciato 51 su 60 (passa
quando il dato cambiato è la massa del solido del livello 3, che non entra nel conto e resta dentro la tolleranza).
`review.mts` e `width.mts` con codice 0.
