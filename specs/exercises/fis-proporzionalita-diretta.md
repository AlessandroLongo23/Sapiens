# Proporzionalità diretta e dipendenza lineare

Generatore: `fis-proporzionalita-diretta` (`src/lib/exercises/v2/generators/fis-proporzionalita-diretta.ts`). Verifica
indipendente: `scripts/exercises/checkers/fis_proporzionalita_diretta.py` (con `_fis_grafici.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/11-fis-proporzionalita-diretta.md` (note in
`docs/lezioni/fisica/note/11-fis-proporzionalita-diretta.md`).

Cinque livelli. Il livello 3 ha il grafico `grafico-dati` con i punti e la retta per l'origine. Il generatore di
matematica `funzioni-lineari` copre già il riconoscimento con i numeri puri; qui ogni numero ha la sua unità e ogni
costante un significato.

## Tipi di risposta

Scelta multipla. Livelli 1, 2, 3 e 5: quattro opzioni, numero con unità (`0{,}040\ \text{cm/g}`). Livello 4: tre
opzioni in parole, sempre nello stesso ordine: "proporzionalità diretta", "lineare con termine noto", "nessuna delle
due" ("lineare" da sola sarebbe giusta anche per la diretta, che ne è un caso particolare).

## Regole comuni

- Esperimenti in proporzionalità diretta: molla (allungamento e massa, $k$ in $\text{cm/g}$ da $0{,}020$ a $0{,}080$),
  cilindri di uno stesso materiale (massa e volume, $k$ la densità: $2{,}7$, $7{,}9$, $8{,}9$, $11{,}3\ \text{g/cm}^3$),
  rubinetto (volume e tempo, da $1{,}5$ a $12$ L/min), carrello a velocità costante (distanza e tempo, da $12$ a
  $40$ cm/s).
- Esperimenti lineari: lunghezza della molla, acqua sul fornello, posizione del carrello, vasca che si riempie.
- La costante si scrive con almeno due cifre significative, come la lezione: $0{,}040\ \text{cm/g}$, $6{,}0$ L/min.
- I valori delle tabelle sono esatti (costruiti dalla costante) e hanno un decimale.

## Livello 1: la costante con la sua unità

Tabella di 4 o 5 righe, grandezze dichiarate proporzionali; si chiede $k = y/x$.

- Molla, $120$ g $7{,}2$ cm ... $280$ g $16{,}8$ cm. Risposta $0{,}060\ \text{cm/g}$; distrattori $17\ \text{g/cm}$ (il
  rapporto rovesciato, con la sua unità), $0{,}060\ \text{g/cm}$ (l'unità rovesciata), $0{,}60\ \text{cm/g}$.
- Rubinetto, $4$ min $18{,}0$ L ... Risposta $4{,}5$ L/min; distrattori $4{,}5$ min/L, $45$ L/min, $0{,}22$ min/L.

## Livello 2: prevedere un valore

Una coppia di valori e un nuovo valore di $x$, in una frase ("Una molla si allunga di $9{,}6$ cm quando le si
appendono $160$ g ... Di quanto si allunga con $200$ g?"). Risposta esatta con un decimale ($12{,}0$ cm).
Distrattori: la proporzione rovesciata ($7{,}7$ cm), solo la variazione ($2{,}4$ cm), il fattore $10$ ($120{,}0$ cm),
la somma dei due valori.

## Livello 3: la pendenza dal grafico

Il grafico con cinque punti e la retta per l'origine, che passa per un incrocio della griglia a $8$ o $10$ quadretti
dall'asse verticale. Pendenza con la sua unità, in un intervallo plausibile per l'esperimento.

- Molla: risposta $0{,}028\ \text{cm/g}$; distrattori $0{,}028\ \text{g/cm}$, $36\ \text{g/cm}$, $0{,}7\ \text{cm/g}$
  (i quadretti contati: $7$ in su per $10$ di lato).
- Rubinetto: risposta $6{,}0$ L/min; distrattori $0{,}17$ min/L, $6{,}0$ min/L, $1{,}2$ L/min.

Distrattori: il rapporto rovesciato, l'unità rovesciata, i quadretti contati al posto dei valori (l'avviso "La
pendenza non è l'angolo"), un fattore $10$.

## Livello 4: riconoscere il legame

Tabella di 4 o 5 righe, circa un terzo per caso: proporzionalità diretta (carrello, vasca), lineare con termine noto
(tutti e quattro), nessuna delle due (una curva che sale: le variazioni crescono ogni volta della stessa quantità).
La molla non è mai "diretta" nella lunghezza: una molla lunga zero senza pesetti non esiste.

## Livello 5: il termine noto

Tabella lineare senza la riga $x = 0$, con il primo $x$ diverso dal passo (così togliere un passo non basta). Si
chiede il termine noto con il suo significato: la lunghezza della molla senza pesetti, la temperatura iniziale
dell'acqua, la posizione del carrello per $t = 0$, l'acqua nella vasca all'inizio.

- Molla: $60$ g $15{,}5$ cm, $80$ g $16{,}5$ cm, ... Risposta $12{,}5$ cm; distrattori $15{,}5$ cm (il primo valore),
  $14{,}5$ cm (un passo indietro), altri vicini.
- Carrello: risposta $60{,}0$ cm; distrattori $90{,}0$, $80{,}0$, $20{,}0$ cm (la pendenza presa per termine noto).

## Esercizi da evitare

- Costanti fuori dall'esperimento (una densità di $30\ \text{g/cm}^3$, un carrello a $200$ cm/s).
- Una molla "direttamente proporzionale" nella lunghezza totale.
- Un carrello "a velocità costante" in una tabella che non è lineare (per questo le tabelle dei livelli 4 e 5 dicono
  solo "un carrello su una rotaia").
- Valori da arrotondare: tutti i risultati sono esatti con i decimali dei dati.

## Verifica

`scripts/exercises/checkers/fis_proporzionalita_diretta.py` rilegge testo, tabella e scena: ricalcola i rapporti
riga per riga, le variazioni, la previsione $y_2 = y_1 x_2 / x_1$ (che deve essere esatta con un decimale), la
pendenza della retta della scena (che deve passare per un incrocio ad almeno otto quadretti), il tipo di legame e il
termine noto. Controlla la plausibilità della costante, l'unità e le cifre significative dell'opzione giusta.

Esito: seed 1, 50001 e 777001, 5000 esercizi ciascuno, PASS; quote del livello 4 nei limiti. `review.mts` 0,
`width.mts` 0 (problema al massimo 167 px, opzioni al massimo 189 px).

Errori piantati, su 30 esercizi per livello: 826 su 840 bocciati; i 14 non bocciati sono cambi di un numero in una
tabella "nessuna delle due", che resta "nessuna delle due" (non sono errori).

Esercizi diversi su 1.000 (seed da 1): livello 1 549, livello 2 571, livello 3 356, livello 4 589, livello 5 651.

## Nomi dei livelli

1. La costante con la sua unità
2. Prevedere un valore
3. La pendenza dal grafico
4. Riconoscere il legame
5. Il termine noto

## Domande per la revisione

- I dati delle tabelle sono esatti (rapporti identici). La lezione insiste su "uguali entro l'incertezza": servono
  tabelle con piccoli errori e la domanda "sono proporzionali entro l'incertezza"?
- Livello 4: tre opzioni invece di quattro. Va bene, o si aggiunge "proporzionalità inversa" come distrattore?
- Livello 3: la pendenza di un materiale va da $0{,}5$ a $20\ \text{g/cm}^3$ e il materiale non è nominato. Meglio
  chiedere anche quale materiale è, con una tabella di densità?
