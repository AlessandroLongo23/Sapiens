# Sostanze pure, miscugli omogenei ed eterogenei

Generatore: `chim-sostanze-miscugli` (`src/lib/exercises/v2/generators/chim-sostanze-miscugli.ts`, con
`src/lib/exercises/v2/chim-materia.ts`). Scena del livello 3: `particelle-riquadri`
(`src/components/content/exercises/scenes/ParticelleRiquadri.tsx`). Verifica indipendente:
`scripts/exercises/checkers/chim_sostanze_miscugli.py` (con `_chim_stati_soluzioni.py`). Lezione collegata:
`docs/lezioni/chimica/riscritte/16-chim-sostanze-miscugli.md`. Percorso nel database:
`high_school/chemistry/chim-materia/chim-sostanze-miscugli`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Sostanza pura o miscuglio
2. Omogeneo o eterogeneo
3. Le particelle
4. La prova della fusione
5. Fasi e componenti

## Tipi di risposta

Scelta multipla, quattro opzioni in parole: un materiale, un riquadro (A-D), un campione (A-D), un numero di fasi o di
componenti. I materiali sono 31, divisi come nella lezione: 11 sostanze pure, 9 miscugli omogenei, 11 eterogenei
(latte e maionese sono eterogenei, colloidi visibili al microscopio; ottone e bronzo omogenei, leghe).

## Livello 1: sostanza pura o miscuglio

Sei volte su dieci "Quale di questi materiali è una sostanza pura?", con tre miscugli (omogenei o eterogenei) come
distrattori; le altre "Quale è un miscuglio?", con tre sostanze pure. I distrattori omogenei (aceto, acqua minerale, tè
filtrato) sono la trappola dell'avviso "trasparente vuol dire puro".

## Livello 2: omogeneo o eterogeneo

"Quale di questi materiali è un miscuglio omogeneo (eterogeneo)?": due distrattori dell'altra famiglia e una sostanza
pura, che è omogenea ma non è un miscuglio.

## Livello 3: le particelle

La scena `particelle-riquadri` disegna quattro riquadri di particelle, un colore per tipo. Sostanza pura: un colore,
come gas (9-12 particelle sparse), liquido (a contatto sul fondo) o solido (reticolo). Miscuglio omogeneo: due colori
mescolati a caso (dal 30 al 45 % del secondo), gas, liquido o solido (lega); almeno metà delle particelle ha come
vicina più prossima una particella dell'altro colore. Miscuglio eterogeneo: due liquidi a strati o un granello solido
(reticolo 3 per 3) sul fondo di un liquido; al più l'8 % delle particelle ha come vicina più prossima una particella
dell'altro colore. Niente miscugli eterogenei di gas, che si mescolano sempre. Un riquadro del tipo chiesto, gli altri
tre dei due tipi rimasti (tutti e due presenti). La scena e il suo testo alternativo descrivono solo le particelle.

## Livello 4: la prova della fusione

Una tabella con quattro polveri bianche e le temperature di inizio e di fine della fusione ($20$-$300\,^\circ\text{C}$).
Sei volte su dieci si chiede quale può essere una sostanza pura (una sola fonde a temperatura costante, le altre in un
intervallo di 3-15 gradi), le altre quale è di sicuro un miscuglio (una sola fonde in un intervallo).

## Livello 5: fasi e componenti

Un bicchiere d'acqua con da due a quattro aggiunte: due cubetti di ghiaccio, uno strato d'olio, sale o zucchero che si
sciolgono tutti, alcol che si mescola, limatura di ferro, monetine di rame, gocce di mercurio. Sei volte su dieci si
chiedono le fasi (l'acqua con quello che vi è sciolto, più una per ogni cosa che resta separata; il ghiaccio è una
fase, i due cubetti una sola), le altre i componenti (le sostanze; il ghiaccio è acqua; senza l'olio, che è a sua volta
un miscuglio). Distrattori: i componenti al posto delle fasi (e il contrario), il numero delle cose elencate, uno in
più o in meno.

- "In un bicchiere d'acqua si mettono due cubetti di ghiaccio, uno strato d'olio e un cucchiaino di zucchero, che si
  scioglie tutto. Quante fasi ha il sistema?" Risposta: 3 fasi.

## Esercizi da evitare

- Riquadri né chiaramente mescolati né chiaramente separati (livello 3).
- Materiali discussi tra i libri (sangue, acqua del rubinetto, acciaio): fuori dall'elenco.

## Verifica

`chim_sostanze_miscugli.py` ha il suo elenco dei materiali, classifica i riquadri della scena guardando per ogni
particella le due più vicine (omogeneo fino al 75 % di coppie dello stesso colore, eterogeneo dal 78 %), controlla che
le particelle non si sovrappongano, rilegge la tabella della fusione e conta fasi e componenti con la sua tabella.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (tabella del livello 4 al più 265 px, opzioni al più 190 px).

### Errori piantati

Su 60 esercizi (seed da 300): indice, opzione doppia, testo dell'opzione giusta, parole vietate bocciati 60 su 60; un
numero della tabella del livello 4 aumentato di uno bocciato 5 su 12: negli altri casi un intervallo resta un
intervallo, e la risposta non cambia.

### Esercizi diversi su 1.000

Seed da 1: livello 1 965, livello 2 955, livello 3 1000, livello 4 1000, livello 5 679.

## Domande per la revisione

- Latte e maionese tra i miscugli eterogenei (colloidi): è la classificazione dei libri del primo anno?
- "Componenti" nel livello 5: l'olio è tolto dalle domande sui componenti perché è a sua volta un miscuglio. Va bene,
  o i libri contano l'olio come un componente?
