# Il modello particellare della materia

Generatore: `chim-modello-particellare` (`src/lib/exercises/v2/generators/chim-modello-particellare.ts`, con
`src/lib/exercises/v2/chim-materia.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_modello_particellare.py`
(con `_chim_stati_soluzioni.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/15-chim-modello-particellare.md`.
Percorso nel database: `high_school/chemistry/chim-materia/chim-modello-particellare`.

Quattro livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Le particelle nei tre stati
2. Spiegare un fenomeno
3. Dai gradi Celsius ai kelvin
4. Chi si agita di più

## Tipi di risposta

Scelta multipla, quattro opzioni. Livelli 1 e 2: frasi (su due o tre righe quando sono lunghe); livello 3: una
temperatura con l'unità; livello 4: un campione con la sua temperatura. Conversione $T = t + 273$, come la lezione.

## Livello 1: le particelle nei tre stati

Un campione in uno stato (cubetto di ghiaccio, acqua di un bicchiere, aria di una stanza...). La risposta è una frase
vera solo per le particelle di quello stato (solido: vibrano attorno a posizioni fisse, non possono cambiare posto;
liquido: a contatto ma scorrono, restano a contatto ma cambiano posto; aeriforme: lontane e in corsa in tutte le
direzioni, moltissimo spazio vuoto, si attraggono pochissimo). I distrattori sono una o due frasi mai vere (sono
ferme, diventano più grandi quando si scaldano, tra loro c'è aria, si fondono quando il solido fonde), gli errori degli
avvisi della lezione, e frasi vere per gli altri due stati.

- "L'aria di una stanza è un aeriforme. Quale frase descrive le sue particelle?" Risposta: tra loro c'è moltissimo
  spazio vuoto; distrattori: sono a contatto ma scorrono le une sulle altre, tra loro c'è aria, non possono cambiare
  posto.

## Livello 2: spiegare un fenomeno

Dieci fenomeni della lezione (siringa d'aria e d'acqua, profumo, inchiostro in acqua calda e fredda, acqua che prende
la forma del bicchiere, ghiaccio che tiene la forma, sfera e anello, alcol e acqua che danno meno di 100 mL, pallone
gonfio, moto browniano, pozzanghera che si asciuga). Per ognuno la spiegazione della lezione e quattro spiegazioni
sbagliate prese dagli errori veri (particelle che si ingrandiscono, si schiacciano, si fermano, aria tra le
particelle); se ne usano tre.

- "Un pallone gonfiato resta gonfio. Quale spiegazione dà il modello particellare?" Risposta: le particelle dell'aria
  urtano di continuo la parete interna.

## Livello 3: dai gradi Celsius ai kelvin

Metà: da $t$ tra $-260$ e $500\,^\circ\text{C}$ a kelvin; metà: da $T$ tra $10$ e $800\,\text{K}$ a gradi Celsius; mai a
meno di 5 gradi da $0\,^\circ\text{C}$. Distrattori: $273$ tolto invece che aggiunto (o il contrario), la differenza al
contrario ($273 - t$), il numero non convertito, uno scarto di 10 o 100.

- "Scrivi in gradi Celsius la temperatura $40\,\text{K}$." Risposta $-233\,^\circ\text{C}$; distrattori
  $233\,^\circ\text{C}$, $40\,^\circ\text{C}$, $313\,^\circ\text{C}$.

## Livello 4: chi si agita di più

Quattro campioni di sostanze diverse, temperature assolute tra $60$ e $700\,\text{K}$ ad almeno 8 K l'una dall'altra,
ognuna scritta in kelvin o in gradi Celsius (tutte e due le scale ci sono sempre). Metà delle volte si chiede
l'agitazione media più grande, metà la più piccola. In sette casi su dieci il campione con il numero più grande (o più
piccolo) non è quello giusto ("trappola"), perché le scale sono diverse.

- "Quattro campioni: elio a $406\,\text{K}$, etanolo a $-28\,^\circ\text{C}$, azoto a $356\,\text{K}$, ferro a
  $157\,^\circ\text{C}$. In quale le particelle hanno l'agitazione media più piccola?" Risposta: etanolo.

## Esercizi da evitare

- Frasi vere per più di uno stato al livello 1 (per esempio "hanno volume proprio").
- Spiegazioni sbagliate che siano vere anche solo in parte al livello 2.
- Temperature troppo vicine al livello 4.

## Verifica

`chim_modello_particellare.py` ha le sue tabelle delle frasi (per ogni frase gli stati in cui è vera) e delle
spiegazioni di ogni fenomeno, rifà le conversioni e porta in kelvin i quattro campioni del livello 4.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 4.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 226 px su 252).

### Errori piantati

Su 48 esercizi (seed da 300): indice, opzione doppia, testo dell'opzione giusta, parole vietate bocciati 48 su 48; un
numero del testo aumentato di uno bocciato 24 su 26 (i due che passano sono temperature del livello 4 che non cambiano
l'ordine).

### Esercizi diversi su 1.000

Seed da 1: livello 1 712, livello 2 40 (dieci fenomeni, tre spiegazioni sbagliate su quattro), livello 3 747,
livello 4 1000.

## Domande per la revisione

- Il livello 2 ha solo 40 esercizi diversi: aggiungere fenomeni (il tè che si raffredda, la bottiglia di plastica che
  si schiaccia in aereo)?
- Nel livello 4 i campioni sono sostanze diverse: la lezione dice che l'agitazione media dipende solo dalla
  temperatura. Va bene al primo anno, o meglio confrontare solo campioni della stessa sostanza?
