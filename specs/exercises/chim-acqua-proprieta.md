# Le proprietà fisiche dell'acqua

Generatore: `chim-acqua-proprieta` (`src/lib/exercises/v2/generators/chim-acqua-proprieta.ts`, con
`src/lib/exercises/v2/chim-acqua.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_acqua_proprieta.py` (con
`_chim_acqua.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/45-chim-acqua-proprieta.md`. Percorso nel
database: `high_school/chemistry/chim-acqua/chim-acqua-proprieta`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La proprietà giusta
2. Il volume del ghiaccio
3. Il ghiaccio che galleggia
4. Scaldare l'acqua
5. Lo stesso calore

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni. Livello 1 di testo; gli altri quantità con l'unità: $\text{mL}$, $\text{cm}^3$,
$\text{kJ}$, $^\circ\text{C}$. Dati della lezione, scritti nel testo: ghiaccio $0{,}917\,\text{g/mL}$, acqua
$1{,}00\,\text{g/mL}$, acqua di mare $1{,}03\,\text{g/cm}^3$, calori specifici in $\text{J/(g}\cdot{}^\circ\text{C)}$ (acqua
$4{,}186$, etanolo $2{,}44$, olio d'oliva $1{,}97$, alluminio $0{,}897$, vetro $0{,}84$, ferro $0{,}449$, rame $0{,}385$,
come la lezione 12 di chimica). Tre cifre significative; due per la parte emersa del livello 3 (è una differenza) e per
il vetro al livello 5.

## Livello 1: la proprietà giusta

Diciotto fenomeni quotidiani, ognuno legato a una di sei proprietà: il ghiaccio meno denso (galleggia, bottiglia nel
congelatore, rocce spaccate, iceberg), il massimo di densità a $4\,^\circ\text{C}$ (il lago che gela dall'alto), il calore
specifico alto (mare e sabbia, clima delle città sul mare, termosifoni, borsa dell'acqua calda), la tensione superficiale
(insetto, graffetta, goccia sferica), la capillarità (tovagliolo, zolletta, tubicino), il calore di evaporazione (sudore,
vento dopo il bagno). Distrattori: tre delle altre proprietà.

## Livello 2: il volume del ghiaccio

Metà da una massa d'acqua, metà da un volume con densità $1{,}00\,\text{g/mL}$, $101$-$999$ senza zero finale;
$V = m/0{,}917$. Distrattori: il volume moltiplicato per la densità, il volume che non cambia, il solo aumento.

- "Una massa di $502\,\text{g}$ d'acqua ghiaccia. Che volume occupa il ghiaccio?" Risposta $547\,\text{mL}$; distrattori
  $460$, $502$, $45{,}4\,\text{mL}$.
- "In un contenitore ci sono $313\,\text{mL}$ d'acqua ..." Risposta $341\,\text{mL}$.

## Livello 3: il ghiaccio che galleggia

Blocco di $101$-$999\,\text{cm}^3$ in acqua dolce o di mare; si chiede la parte sotto ($V \cdot 0{,}917/d$, tre cifre) o
sopra la superficie ($V$ meno quella, due cifre), un quarto dei casi ciascuno. Distrattori: l'altra parte, il rapporto
delle densità rovesciato, la densità dell'altro liquido.

- "Un blocco di ghiaccio di $355\,\text{cm}^3$ galleggia nell'acqua di mare. Quanti centimetri cubi stanno sotto la
  superficie?" Risposta $316\,\text{cm}^3$; distrattori $38{,}9$ (la parte sopra), $399$ (rapporto rovesciato), $326$
  (acqua dolce).
- "... $303\,\text{cm}^3$ ... acqua dolce ... sotto" Risposta $278\,\text{cm}^3$.

## Livello 4: scaldare l'acqua

$Q = c\,m\,\Delta t$ con $m$ da $101$ a $999\,\text{g}$, temperature da $8{,}0$ a $95{,}0\,^\circ\text{C}$ scritte con un
decimale, aumento di almeno $10\,^\circ\text{C}$; risultato in kJ. Distrattori: i joule letti come kilojoule, il calore
specifico dimenticato, la temperatura finale al posto della differenza.

- "Quanti kilojoule servono per scaldare $489\,\text{g}$ d'acqua da $18{,}0$ a $42{,}0\,^\circ\text{C}$?" Risposta
  $49{,}1\,\text{kJ}$; distrattori $4{,}91 \cdot 10^4\,\text{kJ}$, $11{,}7\,\text{kJ}$, $86{,}0\,\text{kJ}$.

## Livello 5: lo stesso calore

Masse uguali, stesso calore: $\Delta t_x = \Delta t_{acqua} \cdot 4{,}186/c_x$. Metà dà l'aumento dell'acqua
($10{,}0$-$19{,}9\,^\circ\text{C}$) e chiede quello dell'altra sostanza, metà il contrario ($10{,}0$-$99{,}9\,^\circ\text{C}$);
risultati tra $0{,}5$ e $400\,^\circ\text{C}$. Distrattori: il rapporto rovesciato, lo stesso aumento, il solo prodotto per
$4{,}186$.

- "... acqua e alluminio. Il campione di alluminio si scalda di $35{,}4\,^\circ\text{C}$. Di quanto si scalda l'acqua?"
  Risposta $7{,}59\,^\circ\text{C}$; distrattori $165$ (rapporto rovesciato), $35{,}4$, $148\,^\circ\text{C}$.
- "... acqua e olio d'oliva. L'acqua si scalda di $12{,}2\,^\circ\text{C}$ ..." Risposta $25{,}9\,^\circ\text{C}$.

## Esercizi da evitare

- Risultati interi con uno zero finale; aumenti di temperatura sotto $10\,^\circ\text{C}$ al livello 4 (il dato avrebbe
  meno cifre del risultato).

## Verifica

`chim_acqua_proprieta.py` classifica il fenomeno del livello 1 dalle sue parole, rilegge i dati degli altri livelli, li
controlla (intervalli, cifre, densità e calori specifici della lezione) e ricalcola con i razionali.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 208 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice, opzione doppia, testo dell'opzione giusta, parole vietate bocciati 60 su 60; un
dato aumentato di uno bocciato 48 su 48.

### Esercizi diversi su 1.000

Seed da 1: livello 1 179, livello 2 736, livello 3 850, livello 4 1000, livello 5 810.

## Domande per la revisione

- Il calore specifico in $\text{J/(g}\cdot{}^\circ\text{C)}$, come la lezione 12 di chimica, o in
  $\text{J/(kg}\cdot{}^\circ\text{C)}$ come la fisica?
