# Elementi, composti e simboli chimici

Generatore: `chim-elementi-composti` (`src/lib/exercises/v2/generators/chim-elementi-composti.ts`, con
`src/lib/exercises/v2/chim-leggi-ponderali.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_elementi_composti.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/22-chim-elementi-composti.md`. Percorso nel database:
`high_school/chemistry/chim-trasformazioni-chimiche/chim-elementi-composti`.

Quattro livelli, a scelta multipla con quattro opzioni.

## Nomi dei livelli

1. I simboli chimici
2. Elemento o composto
3. Elemento, composto o miscuglio
4. Gli elementi di una formula

## Livello 1: i simboli chimici

Uno dei 24 elementi della tabella della lezione (più cobalto e manganese, che la lezione nomina negli avvisi). Metà dal
nome al simbolo, metà dal simbolo al nome. Distrattori scritti a mano per ogni elemento dagli errori veri: la lettera del
nome italiano ($\mathrm{S}$ o $\mathrm{So}$ per il sodio, $\mathrm{P}$ per il potassio, $\mathrm{F}$ per il ferro), le
coppie simili ($\mathrm{Mg}$ e $\mathrm{Mn}$, $\mathrm{Ag}$ e $\mathrm{Au}$, $\mathrm{Co}$ e $\mathrm{Cu}$); dal simbolo
al nome, elementi con simboli vicini (per $\mathrm{Na}$: azoto, neon, nichel).

- "Qual è il simbolo chimico del potassio?" Risposta $\mathrm{K}$; distrattori $\mathrm{P}$, $\mathrm{Po}$, $\mathrm{Pt}$.

## Livello 2: elemento o composto

Metà "Quale di queste sostanze è un composto?" (un composto e tre elementi), metà "... un elemento?", da 18 elementi e
12 composti con il loro nome (acqua, cloruro di sodio, diossido e monossido di carbonio, ammoniaca, metano, glucosio,
carbonato di calcio, ossido di magnesio, solfuro di ferro, ossido di mercurio, bicarbonato di sodio).

## Livello 3: elemento, composto o miscuglio

Un materiale descritto da come si comporta, tre descrizioni per tipo, con colore e temperatura di fusione estratti; le
opzioni sono sempre "Un elemento", "Un composto", "Un miscuglio omogeneo", "Un miscuglio eterogeneo", ognuna circa un
quarto dei casi. Elemento: non si scompone con nessuna reazione. Composto: si scompone con il calore o con la corrente,
sempre nella stessa proporzione. Miscuglio omogeneo: uniforme, ma si separa con metodi fisici e la composizione cambia da
un campione all'altro. Miscuglio eterogeneo: granelli diversi, filtrazione, strati.

- "Un liquido incolore bolle sempre alla stessa temperatura; con la corrente elettrica si scompone in due gas diversi.
  Che cos'è?" Risposta "Un composto".

## Livello 4: gli elementi di una formula

"Quanti elementi diversi ci sono nella sostanza $\mathrm{CaCO_3}$?" su 24 formule della lezione e del biennio (con
$\mathrm{Co}$ e $\mathrm{CO}$, $\mathrm{C_2H_5OH}$ con l'idrogeno ripetuto). Distrattori: le lettere contate come
elementi, i simboli contati con le ripetizioni, gli atomi, uno in più o in meno. Non chiede che cosa dicano gli indici:
lo spiega la lezione 28.

## Verifica

Il controllo ha la sua tabella di nomi e simboli (e i simboli veri dei nomi usati come distrattori), i suoi elenchi di
elementi e composti, regole di parole per le descrizioni del livello 3 (una sola deve valere) e conta le maiuscole della
formula; controlla che il valore di ogni opzione sia quello che mostra.

Esito (30 settembre 2026): seed 1, 50001, 777001, 4.000 esercizi ciascuno, PASS. Errori piantati su 60 esercizi: indice,
opzione doppia, testo dell'opzione giusta bocciati 60 su 60 (una temperatura cambiata nel livello 3 passa, e va bene: non
cambia la risposta). `review.mts` e `width.mts` con codice 0.
