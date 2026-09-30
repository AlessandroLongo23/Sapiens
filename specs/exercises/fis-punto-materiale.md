# Punto materiale, traiettoria e sistema di riferimento

Generatore: `fis-punto-materiale` (`src/lib/exercises/v2/generators/fis-punto-materiale.ts`, con
`src/lib/exercises/v2/cinematica.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_punto_materiale.py` (con
`_cinematica.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/38-fis-punto-materiale.md`. Percorso nel database:
`high_school/physics/cinematica/fis-punto-materiale`.

Quattro livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Lo spostamento
2. L'intervallo di tempo
3. Andata e ritorno
4. La tabella della legge oraria

## Tipi di risposta

Scelta multipla, quattro opzioni, con l'unità nell'opzione ($-40\,\text{m}$, $25\,\text{min}$). Posizioni in metri interi,
quindi ogni risposta è esatta, senza arrotondamenti.

## Regole comuni

- Formule della lezione: $\Delta s = s_2 - s_1$ con il segno; distanza percorsa $d$ come somma delle lunghezze dei tratti;
  $\Delta t = t_2 - t_1$ con $60$ minuti in un'ora.
- Scena `strada-posizioni` (nuova, `src/components/content/exercises/scenes/StradaPosizioni.tsx`): la retta orientata $s$
  con le tacche numerate, l'origine $O$, i punti del testo con la loro etichetta, i tratti del percorso come frecce
  sottili. Lo spostamento (freccia blu) c'è solo nella scena della soluzione.
- Corpi: un ciclista, un pedone, un carrello, un cane, un monopattino (tutti maschili: "passa", "parte").

## Livello 1: lo spostamento

Due posizioni multiple di $5$, da $-90$ a $150\,\text{m}$, diverse e non nulle; metà degli spostamenti positivi e metà
negativi; quasi sempre almeno una posizione negativa.

- "Un pedone si muove su una strada dritta e passa dalla posizione $s_1 = 15\,\text{m}$ alla posizione $s_2 = -25\,\text{m}$.
  Quanto vale il suo spostamento?" Risposta $-40\,\text{m}$; distrattori $40\,\text{m}$ ($s_1 - s_2$, l'ordine della
  sottrazione), $-10\,\text{m}$ ($s_1 + s_2$), $10\,\text{m}$ ($|s_2| - |s_1|$ o $-(s_1 + s_2)$).

## Livello 2: l'intervallo di tempo

Due orari a cavallo dell'ora (i minuti di partenza da $31$ a $59$), durata da $12$ a $95$ minuti. Tre contesti: autobus,
treno, gara di corsa.

- "Un treno parte alle 13:43 e arriva alla stazione successiva alle 14:18. Quanto dura il viaggio?" Risposta
  $35\,\text{min}$; distrattori $75\,\text{min}$ ($14{,}18 - 13{,}43$ come numeri decimali), $25\,\text{min}$ ($43 - 18$),
  $95\,\text{min}$ (un'ora di troppo).

## Livello 3: andata e ritorno

Partenza multipla di $5$ tra $-60$ e $100\,\text{m}$, primo tratto da $30$ a $200\,\text{m}$ (di solito nel verso
positivo), ritorno da $10\,\text{m}$ fino a $60\,\text{m}$ oltre la partenza, mai uguale all'andata. Metà chiedono la
distanza percorsa, metà lo spostamento.

- "Un monopattino parte da $s = 10\,\text{m}$, arriva fino a $s = 105\,\text{m}$ e poi torna indietro fino a
  $s = 25\,\text{m}$, sempre sulla stessa strada dritta. Quanto vale la distanza percorsa?" Risposta $175\,\text{m}$;
  distrattori $15\,\text{m}$ (lo spostamento), $95\,\text{m}$ (solo l'andata), $25\,\text{m}$ (la posizione finale).
- Per lo spostamento i distrattori sono la distanza con il segno dell'andata, l'andata da sola, la posizione finale e
  l'ordine della sottrazione rovesciato.

## Livello 4: la tabella della legge oraria

Una tabella di sei posizioni (in colonna, per il telefono), ogni $2$ o $5\,\text{s}$, con un solo cambio di verso e a
volte una sosta; il testo dice che tra una misura e l'altra l'automobilina non cambia verso. Metà chiedono la distanza
percorsa in tutto, metà lo spostamento tra due istanti che stanno a cavallo del cambio di verso.

- Tabella $t$: $0, 2, 4, 6, 8, 10\,\text{s}$; $s$: $4, 16, 21, 29, 18, 11\,\text{m}$; "Quanto vale lo spostamento tra
  $t = 2\,\text{s}$ e $t = 8\,\text{s}$?" Risposta $2\,\text{m}$; distrattori $18\,\text{m}$ (la posizione finale),
  $-2\,\text{m}$ (l'ordine rovesciato), $24\,\text{m}$ (la distanza percorsa in mezzo).
- Per la distanza i distrattori sono lo spostamento totale, l'ultima posizione, la sola andata, andata meno ritorno.

## Esercizi da evitare

- Spostamento nullo, posizioni uguali, somma delle posizioni nulla (il distrattore coinciderebbe con zero).
- Al livello 2 orari nella stessa ora: l'errore dei decimali non si vedrebbe.
- Al livello 4 intervalli che non attraversano il cambio di verso.

## Verifica

`fis_punto_materiale.py` rilegge il testo, ricalcola con numeri esatti, controlla gli intervalli dei dati, il cambio di
verso (livelli 3 e 4), che l'intervallo del livello 4 stia a cavallo del cambio di verso, che la scena abbia i punti del
testo e niente spostamento, e che la scena della soluzione abbia lo spostamento giusto.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 4.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (tabella al più 125 px, opzioni al più 62 px).

### Errori piantati

Su 160 esercizi (40 per livello) bocciati tutti: indice dell'opzione giusta spostato, un numero del testo cambiato,
testo dell'opzione giusta cambiato, opzione doppia, parole vietate, un punto della scena spostato (80 su 80).

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 953 (956), livello 2 998 (993), livello 3 1000 (1000), livello 4 1000 (1000).

## Domande per la revisione

- Il livello 2 (gli orari) è più aritmetica che fisica: va bene come gradino, o meglio un intervallo letto su un
  cronometro con i decimi?
