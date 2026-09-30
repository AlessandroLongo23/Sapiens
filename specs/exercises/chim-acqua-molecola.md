# La molecola d'acqua e il legame a idrogeno

Generatore: `chim-acqua-molecola` (`src/lib/exercises/v2/generators/chim-acqua-molecola.ts`, con
`src/lib/exercises/v2/chim-acqua.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_acqua_molecola.py` (con
`_chim_acqua.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/44-chim-acqua-molecola.md`. Percorso nel database:
`high_school/chemistry/chim-acqua/chim-acqua-molecola`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La composizione
2. L'acqua dal suo elemento
3. Forma e polarità
4. Chi forma legami a idrogeno
5. Che cosa si rompe

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni. Livelli 1-2: masse in grammi con l'unità nell'opzione, masse atomiche della lezione 01
($\mathrm{H} = 1{,}01$, $\mathrm{O} = 16{,}00$, acqua $18{,}02\,\text{g/mol}$) scritte nel testo; il risultato ha le cifre
significative del dato (tre, due per le masse di idrogeno del livello 2), in notazione scientifica quando serve
($3{,}2 \cdot 10^2\,\text{g}$), mai un intero che finisce con uno zero ambiguo. Livelli 3-5: opzioni di testo.

## Livello 1: la composizione

Massa d'acqua da $101$ a $999\,\text{g}$ senza zero finale; metà chiede l'idrogeno ($m \cdot 2{,}02/18{,}02$), metà
l'ossigeno ($m \cdot 16{,}00/18{,}02$). Distrattori: un idrogeno solo ($1{,}01$ al posto di $2{,}02$), gli atomi contati
come masse (due terzi o un terzo), l'altro elemento, e per l'ossigeno la formula con un idrogeno solo.

- "Quanti grammi di idrogeno ci sono in $502\,\text{g}$ d'acqua?" Risposta $56{,}3\,\text{g}$; distrattori
  $28{,}1\,\text{g}$ (un idrogeno), $335\,\text{g}$ (due atomi su tre), $446\,\text{g}$ (l'ossigeno).
- "Quanti grammi di ossigeno ci sono in $313\,\text{g}$ d'acqua?" Risposta $278\,\text{g}$; distrattori $35{,}1$, $104$,
  $294\,\text{g}$.

## Livello 2: l'acqua dal suo elemento

Il contrario: la massa d'acqua che contiene $11$-$99\,\text{g}$ di idrogeno (risultato con due cifre) o
$101$-$999\,\text{g}$ di ossigeno (tre cifre). Distrattori: la formula diretta al posto di quella inversa, un idrogeno
solo, gli atomi contati come masse.

- "Quanti grammi d'acqua contengono $36\,\text{g}$ di idrogeno?" Risposta $3{,}2 \cdot 10^2\,\text{g}$; distrattori
  $4{,}0\,\text{g}$ (formula diretta), $6{,}4 \cdot 10^2\,\text{g}$ (un idrogeno), $54\,\text{g}$ (tre atomi su due).
- "Quanti grammi d'acqua contengono $313\,\text{g}$ di ossigeno?" Risposta $353\,\text{g}$.

## Livello 3: forma e polarità

Otto domande della lezione, con tre distrattori scelti a caso tra quelli scritti per ciascuna: l'angolo ($104{,}5^\circ$;
$180$, $90$, $120$, $109{,}5^\circ$), la forma (piegata), la carica parziale negativa (l'ossigeno), le coppie solitarie
(due), perché l'acqua è polare, perché $\mathrm{CO_2}$ è apolare, la carica totale (zero), il filo d'acqua e il
palloncino. Pochi esercizi diversi (11 su 1000): il livello controlla i fatti della lezione, non fa conti.

## Livello 4: chi forma legami a idrogeno

Metà "quale forma legami a idrogeno" (una sostanza tra acqua, ammoniaca, fluoruro di idrogeno, metanolo, etanolo, con tre
tra metano, solfuro di idrogeno, anidride carbonica, ossigeno, azoto, idrogeno, etano), metà "quale non ne forma" (il
contrario). Ogni opzione è "nome, formula". Regola della lezione: idrogeno legato a ossigeno, azoto o fluoro.

- "Quale di queste sostanze forma legami a idrogeno tra le sue molecole?" Etanolo, tra metano, anidride carbonica,
  ossigeno.
- "Tre di queste sostanze formano legami a idrogeno. Quale non ne forma?" Ossigeno, tra ammoniaca, etanolo, acqua.

## Livello 5: che cosa si rompe

Sette situazioni: fusione del ghiaccio, ebollizione, sudore che evapora, brina che sublima (si rompono legami a
idrogeno, le molecole restano intere); vapore che condensa, acqua che ghiaccia (si formano legami a idrogeno); acqua
decomposta dalla corrente (si rompono i legami covalenti). Le quattro opzioni sono sempre le stesse: le tre risposte e
"non si rompe e non si forma nessun legame".

## Esercizi da evitare

- Risultati interi che finiscono con uno zero ($120\,\text{g}$): scartati.
- Due opzioni con lo stesso valore arrotondato: il generatore ne prende un'altra tra i ripieghi ($\times 1{,}2$,
  $\times 0{,}8$, $\times 1{,}5$).

## Verifica

`chim_acqua_molecola.py` rilegge il testo, ricalcola con i razionali di SymPy (quota dell'idrogeno $202/1802$,
dell'ossigeno $1600/1802$), arrotonda e confronta l'opzione giusta; per il livello 3 ha le risposte giuste riscritte
dalla lezione; per il livello 4 decide dalla formula (idrogeno più ossigeno, azoto o fluoro) e controlla che nome e
formula corrispondano; per il livello 5 classifica la situazione dai verbi.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 217 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta, parole vietate
bocciati 60 su 60; un dato del testo aumentato di uno bocciato 24 su 24 (i livelli con un numero nel testo).

### Esercizi diversi su 1.000

Seed da 1: livello 1 740, livello 2 443, livello 3 11, livello 4 239, livello 5 7.

## Domande per la revisione

- Il livello 3 e il livello 5 sono domande di teoria con poche varianti: vanno bene come livelli, o si preferisce
  toglierli e lasciare i conti?
- Il metanolo e il fluoruro di idrogeno del livello 4 non sono nominati nella lezione, che dà la regola (idrogeno legato a
  ossigeno, azoto o fluoro): si possono chiedere?
