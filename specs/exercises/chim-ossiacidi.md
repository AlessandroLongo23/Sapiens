# Gli ossiacidi

Generatore: `chim-ossiacidi` (`src/lib/exercises/v2/generators/chim-ossiacidi.ts`, con le tabelle di
`src/lib/exercises/v2/chim3-j.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_ossiacidi.py`, con
`_chim3_j.py`. Lezione collegata: `docs/lezioni/chimica/riscritte/80-chim-ossiacidi.md`. Percorso nel database:
`high_school/chemistry/chim-nomenclatura/chim-ossiacidi`.

Cinque livelli nell'ordine della lezione, ognuno con una difficoltà in più. Tutto a scelta multipla, quattro opzioni:
formule e nomi restano a scelta multipla (brief del terzo anno).

## Nomi dei livelli

1. Il numero di ossidazione del non metallo
2. Dalla formula al nome tradizionale
3. Dal nome tradizionale alla formula
4. Il nome IUPAC
5. Meta, piro e orto

## Dati

I diciassette ossiacidi delle tabelle della lezione, con un solo atomo di non metallo: $\mathrm{H_2CO_3}$,
$\mathrm{HNO_2}$, $\mathrm{HNO_3}$, $\mathrm{H_2SO_3}$, $\mathrm{H_2SO_4}$, $\mathrm{HClO}$, $\mathrm{HClO_2}$,
$\mathrm{HClO_3}$, $\mathrm{HClO_4}$, $\mathrm{HBrO}$, $\mathrm{HBrO_3}$, $\mathrm{HIO}$, $\mathrm{HIO_3}$,
$\mathrm{HIO_4}$, $\mathrm{H_3PO_4}$ (acido fosforico), $\mathrm{H_2CrO_4}$, $\mathrm{HMnO_4}$. Per il livello 5 gli
undici acidi con meta-, piro- e orto-: fosforo con $+5$ e con $+3$ (tre ciascuno), boro (tre), silicio (meta e orto).
I numeri di ossidazione sono quelli che la lezione usa: per bromo e iodio quelli di `src/lib/tools/elementi.json`
($+1$, $+5$, e $+7$ per lo iodio); per il cloro anche $+3$, che in `elementi.json` manca.

## Livello 1: il numero di ossidazione del non metallo

Una formula tra le diciassette; si chiede il numero di ossidazione del non metallo, scritto con il segno. Distrattori:
l'ossigeno contato senza togliere l'idrogeno ($2c$), l'idrogeno sommato ($2c + a$), l'ossigeno contato $-1$ ($c - a$),
il segno perso ($-x$), l'indice dell'ossigeno, il valore giusto più o meno $2$.

- "Quanto vale il numero di ossidazione dello zolfo in $\mathrm{H_2SO_4}$?" Risposta $+6$; distrattori $+8$, $+10$, $-6$.
- "Quanto vale il numero di ossidazione del cloro in $\mathrm{HClO_3}$?" Risposta $+5$; distrattori $+6$, $+7$, $+3$.

## Livello 2: dalla formula al nome tradizionale

Una formula tra le diciassette; si chiede il nome tradizionale. Distrattori: gli altri prefissi e suffissi dello
stesso elemento (ipo- e -oso, -oso, -ico, per- e -ico) e, dove esiste, l'idracido in -idrico.

- "Che nome tradizionale ha $\mathrm{HClO_3}$?" Risposta: acido clorico; distrattori: acido cloroso, acido perclorico,
  acido cloridrico.
- "Che nome tradizionale ha $\mathrm{H_2SO_3}$?" Risposta: acido solforoso; distrattori: acido solforico, acido
  solfidrico, acido iposolforoso.

## Livello 3: dal nome tradizionale alla formula

Un nome tra i sedici acidi che si ottengono con una sola molecola d'acqua (l'acido fosforico, che ne chiede tre, è del
livello 5); si chiede la formula. Distrattori: un altro acido dello stesso elemento (sempre presente quando esiste: è
lo scambio tra -oso e -ico), la somma non semplificata ($\mathrm{H_2N_2O_6}$), l'anidride, un idrogeno in più o in
meno, un ossigeno in più o in meno, l'idracido.

- "Qual è la formula dell'acido nitrico?" Risposta $\mathrm{HNO_3}$; distrattori $\mathrm{HNO_2}$,
  $\mathrm{H_2N_2O_6}$, $\mathrm{N_2O_5}$.
- "Qual è la formula dell'acido ipocloroso?" Risposta $\mathrm{HClO}$; distrattori $\mathrm{HClO_2}$, $\mathrm{HCl}$,
  $\mathrm{Cl_2O}$.

## Livello 4: il nome IUPAC

Metà dalla formula al nome, metà dal nome alla formula, sui diciassette acidi. Distrattori del nome: il numero romano
che conta gli ossigeni, un altro numero di ossidazione, il suffisso -oso, il prefisso dell'ossigeno sbagliato.
Distrattori della formula: un idrogeno o un ossigeno in più o in meno, un altro acido dello stesso elemento.

- "Che nome IUPAC ha $\mathrm{H_2SO_4}$?" Risposta: acido tetraossosolforico(VI); distrattori: acido
  tetraossosolforico(IV), acido triossosolforico(VI), acido tetraossosolforoso(VI).
- "Qual è la formula dell'acido triossoclorico(V)?" Risposta $\mathrm{HClO_3}$; distrattori $\mathrm{H_2ClO_3}$,
  $\mathrm{HClO_4}$, $\mathrm{HClO_2}$.

## Livello 5: meta, piro e orto

Quattro casi sugli undici acidi: dal nome alla formula (30%); dalla formula al nome, chiesto "con il prefisso che dice
quanta acqua contiene", perché acido fosforico e acido ortofosforico sono lo stesso composto (30%); quante molecole
d'acqua si aggiungono a una molecola di anidride (20%); il numero di ossidazione, che non cambia con il prefisso (20%).
Distrattori: gli altri prefissi, il suffisso scambiato, ipo- e per- al posto di meta- e orto-.

- "Qual è la formula dell'acido pirofosforico?" Risposta $\mathrm{H_4P_2O_7}$; distrattori $\mathrm{HPO_3}$,
  $\mathrm{H_3PO_4}$, $\mathrm{H_4P_2O_5}$.
- "Quante molecole d'acqua si aggiungono a una molecola di anidride silicica, $\mathrm{SiO_2}$, per ottenere l'acido
  ortosilicico?" Risposta $2$.

## Esercizi da evitare

- L'acido dicromico e l'acido manganico: la lezione li nomina in una riga, senza procedimento.
- Nomi IUPAC di acidi con due atomi di non metallo fuori dal livello 5.
- Tra le opzioni di un nome, un altro nome giusto dello stesso acido (acido fosforico accanto ad acido ortofosforico).

## Verifica

`chim_ossiacidi.py` ricava ogni risposta per conto suo: il numero di ossidazione dalla formula; il nome tradizionale
dal numero di ossidazione e dalla tabella dei suffissi; la formula di un nome sommando l'acqua all'anidride e
riducendo gli indici; il nome IUPAC dal conto degli ossigeni; l'acqua di meta-, piro- e orto- dagli idrogeni.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 213 px su 252).

### Errori piantati

Su 300 esercizi (60 per livello, seed da 300): indice dell'opzione giusta spostato, distrattore uguale alla risposta,
opzione giusta scambiata con un distrattore, opzione giusta alterata (290), parole vietate, solo tre opzioni, un
indice della formula del testo cambiato (172): tutti bocciati.

## Risposta aperta

Il livello 1 ha per risposta un numero puro e potrebbe andare a risposta aperta, corretta sul valore
(`{ grade: 'value' }`). Oggi il campione è a scelta multipla come tutti i generatori di chimica: serve la risposta di
tipo `number` con `toChoice`, e una decisione su come si scrive il segno. Proposta, non fatta.
