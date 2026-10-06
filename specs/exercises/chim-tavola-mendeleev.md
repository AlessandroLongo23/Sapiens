# La tavola periodica di Mendeleev

Generatore: `chim-tavola-mendeleev` (`src/lib/exercises/v2/generators/chim-tavola-mendeleev.ts`, con
`src/lib/exercises/v2/chim-atomo.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_tavola_mendeleev.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/43-chim-tavola-mendeleev.md`. Percorso nel database:
`high_school/chemistry/atomo-struttura/chim-tavola-mendeleev`.

Quattro livelli, ognuno con una difficoltà in più. La lezione è in gran parte storica e descrittiva: il livello 1 è a
domande fisse, gli altri hanno dati estratti da tabelle vere.

## Nomi dei livelli

1. Storia e struttura della tavola
2. Una massa che manca
3. Massa e numero atomico
4. Formule per analogia

## Dati

Masse atomiche IUPAC con due decimali (quelle della lezione 01 dove ci sono: $\mathrm{H}$, $\mathrm{C}$, $\mathrm{N}$,
$\mathrm{O}$, $\mathrm{Na}$, $\mathrm{Mg}$, $\mathrm{P}$, $\mathrm{S}$, $\mathrm{Cl}$, $\mathrm{K}$, $\mathrm{Ca}$,
$\mathrm{Fe}$). Scelta multipla, quattro opzioni.

## Livello 1: storia e struttura della tavola

Diciotto domande della lezione con la loro risposta e tre distrattori ciascuna: il criterio di Mendeleev (massa
atomica) e quello moderno (numero atomico), l'anno 1869 (distrattori 1829, 1865, 1913), Moseley, Döbereiner, i tre
eka-elementi, gruppi e periodi, le caselle vuote, l'inversione tellurio-iodio, i nomi dei gruppi 1, 2, 17 e 18, il
numero di gruppi e di periodi.

- "Quale elemento era l'eka-alluminio previsto da Mendeleev?" Risposta: il gallio.
- "Che cosa sono i gruppi della tavola periodica?" Risposta: le colonne.

## Livello 2: una massa che manca

Dieci terne di elementi dello stesso gruppo, uno sotto l'altro, in cui la media delle masse dell'elemento sopra e di
quello sotto sta entro il $3\%$ della massa vera di quello in mezzo: litio-sodio-potassio, potassio-rubidio-cesio,
berillio-magnesio-calcio, calcio-stronzio-bario, alluminio-gallio-indio, silicio-germanio-stagno,
fosforo-arsenico-antimonio, zolfo-selenio-tellurio, cloro-bromo-iodio, argon-kripton-xeno. Si stima la massa di quello in
mezzo, al decimo. Distrattori: la somma non dimezzata, metà della differenza, la differenza, la somma divisa per tre.

- "Immagina di non conoscere il germanio ... il silicio, $28{,}09$ ... lo stagno, $118{,}71$ ..." Risposta $73{,}4$.
- "... il sodio ... il litio, $6{,}94$ ... il potassio, $39{,}10$ ..." Risposta $23{,}0$; distrattori $46{,}0$, $16{,}1$,
  $32{,}2$.

## Livello 3: massa e numero atomico

Metà: una tabella con otto elementi, quattro coppie di elementi consecutivi, una delle tre invertite della lezione
(argon-potassio, cobalto-nichel, tellurio-iodio) e tre normali senza elementi in comune; si sceglie la coppia in cui il
primo ha massa maggiore. Metà: due elementi consecutivi con numero atomico e massa (tre volte su cinque una coppia
invertita), si chiede quale viene prima nella tavola moderna; distrattori: l'altro, "Hanno lo stesso posto", "Dipende
dalla densità".

- "Il cobalto ha numero atomico $27$ e massa atomica $58{,}93$; il nichel ... $28$ ... $58{,}69$. Quale dei due viene
  prima?" Risposta: il cobalto.

## Livello 4: formule per analogia

Un elemento e il suo composto con ossigeno, cloro, idrogeno, zolfo, sodio o magnesio; un altro elemento dello stesso
gruppo; si chiede il suo composto con lo stesso partner. Gruppi e composti: gruppo 1 ($\mathrm{M_2O}$, $\mathrm{MCl}$,
$\mathrm{MH}$), gruppo 2 ($\mathrm{MO}$, $\mathrm{MCl_2}$, $\mathrm{MS}$), gruppo 13 ($\mathrm{M_2O_3}$,
$\mathrm{MCl_3}$), gruppo 14 ($\mathrm{SiO_2}$ e $\mathrm{GeO_2}$; $\mathrm{MCl_4}$ e $\mathrm{MH_4}$ con il carbonio),
gruppo 15 ($\mathrm{MH_3}$), gruppo 16 ($\mathrm{H_2M}$, $\mathrm{Na_2M}$), gruppo 17 ($\mathrm{HM}$, $\mathrm{NaM}$,
$\mathrm{MgM_2}$). Distrattori: le stesse formule con altri indici.

- "Il silicio forma con l'ossigeno il composto $\mathrm{SiO_2}$. Il germanio sta nello stesso gruppo..." Risposta
  $\mathrm{GeO_2}$; distrattori $\mathrm{GeO}$, $\mathrm{Ge_2O_3}$, $\mathrm{GeO_3}$.

## Esercizi da evitare

- Terne in cui la media è lontana dalla massa vera (azoto-fosforo-arsenico dà $44{,}5$ contro $30{,}97$): la regola
  delle triadi non vale per il secondo periodo, e una stima sbagliata del $40\%$ insegna la cosa sbagliata.
- Composti per cui esiste un'altra formula comune per lo stesso elemento ($\mathrm{CO}$ accanto a $\mathrm{CO_2}$,
  $\mathrm{SnO}$ accanto a $\mathrm{SnO_2}$): il carbonio e lo stagno non compaiono con l'ossigeno.

## Verifica

`chim_tavola_mendeleev.py` ha una chiave delle risposte del livello 1 scritta dalla lezione; per gli altri livelli una
tabella sua di simboli, numeri atomici, masse e gruppi: controlla che le terne siano davvero dello stesso gruppo e che
le masse siano quelle vere, ricalcola la media, legge la tabella del livello 3 e trova la coppia invertita, e ricava le
formule del livello 4 dalle valenze dei gruppi.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 4.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 188 px su 252, tabella del livello 3 297 px su 350).

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta, parole vietate
bocciati 60 su 60; un numero del testo cambiato bocciato 32 su 32.
