# Idruri e idracidi

Generatore: `chim-idruri-idracidi` (`src/lib/exercises/v2/generators/chim-idruri-idracidi.ts`, con
`src/lib/exercises/v2/chim3-i.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_idruri_idracidi.py`, con
`scripts/exercises/checkers/_chim3_i.py`. Lezione collegata:
`docs/lezioni/chimica/riscritte/78-chim-idruri-idracidi.md`. Percorso nel database:
`high_school/chemistry/chim-nomenclatura/chim-idruri-idracidi`.

Cinque livelli, ognuno con una difficoltà in più. Il livello 2 ha come risposta un numero intero con il segno
(`number`, con la scelta multipla da `toChoice`); gli altri sono a scelta multipla, quattro opzioni.

## Nomi dei livelli

1. Idruro metallico, idruro covalente o idracido
2. I numeri di ossidazione
3. Idruri: dalla formula al nome
4. Idruri: dal nome alla formula
5. Idracidi: nomi e formule

## Dati e nomi

- Idruri metallici: $\mathrm{LiH}$, $\mathrm{NaH}$, $\mathrm{KH}$, $\mathrm{MgH_2}$, $\mathrm{CaH_2}$,
  $\mathrm{BaH_2}$, $\mathrm{AlH_3}$. Nome tradizionale e di Stock "idruro di" e il metallo; nome IUPAC con il
  prefisso che conta gli atomi di idrogeno (diidruro di calcio).
- Idruri covalenti, con il nome tradizionale (il loro nome proprio) e il nome IUPAC: $\mathrm{CH_4}$ metano, tetraidruro di carbonio;
  $\mathrm{SiH_4}$ silano, tetraidruro di silicio; $\mathrm{NH_3}$ ammoniaca, triidruro di azoto; $\mathrm{PH_3}$
  fosfina, triidruro di fosforo; $\mathrm{AsH_3}$ arsina, triidruro di arsenico.
- Idracidi, con il nome tradizionale e il nome IUPAC: $\mathrm{HF}$ acido fluoridrico, fluoruro di idrogeno;
  $\mathrm{HCl}$ acido cloridrico, cloruro di idrogeno; $\mathrm{HBr}$ acido bromidrico, bromuro di idrogeno;
  $\mathrm{HI}$ acido iodidrico, ioduro di idrogeno; $\mathrm{H_2S}$ acido solfidrico, solfuro di diidrogeno (Stock:
  solfuro di idrogeno).
- L'idrogeno ha $-1$ con i metalli e $+1$ con i non metalli più elettronegativi di lui; nella formula sta a destra negli
  idruri e a sinistra negli idracidi.

## Livello 1: la famiglia

Una formula, quattro risposte fisse: "Idruro metallico", "Idruro covalente", "Idracido", "Ossido". Quote: circa 30%,
25%, 25%, 20%. Gli ossidi ($\mathrm{Na_2O}$, $\mathrm{CaO}$, $\mathrm{SO_2}$, $\mathrm{CO_2}$...) sono i composti che
non contengono idrogeno.

- "A quale famiglia appartiene $\mathrm{CaH_2}$?" Risposta: idruro metallico.
- "A quale famiglia appartiene $\mathrm{H_2S}$?" Risposta: idracido.

## Livello 2: i numeri di ossidazione

Un idruro metallico, un idracido, $\mathrm{NH_3}$ o $\mathrm{CH_4}$; si chiede l'idrogeno o l'altro elemento.
Distrattori per l'idrogeno: tra $+1$, $-1$, $0$, $+2$, $-2$; per l'altro elemento: il segno cambiato, $0$, uno in più
o in meno, il doppio.

- "Qual è il numero di ossidazione dell'idrogeno in $\mathrm{BaH_2}$?" Risposta $-1$.
- "Qual è il numero di ossidazione dello zolfo in $\mathrm{H_2S}$?" Risposta $-2$.

## Livello 3: idruri, dalla formula al nome

Un idruro metallico (circa 55%) o covalente. Per i metallici il nome tradizionale o, se è diverso, quello IUPAC; per i
covalenti il nome tradizionale o quello IUPAC. Distrattori: per il nome tradizionale di un idruro metallico,
"idrossido", "ossido", "perossido" dello stesso metallo; per quello di un idruro covalente, i nomi degli altri idruri
covalenti; per il nome IUPAC, il prefisso messo sull'altro elemento, un atomo di idrogeno in più, "idrossido" e
"ossido" con lo stesso prefisso.

- "Qual è il nome IUPAC di $\mathrm{MgH_2}$?" Risposta: diidruro di magnesio; distrattori idruro di dimagnesio,
  triidruro di magnesio, diidrossido di magnesio.
- "Qual è il nome tradizionale di $\mathrm{PH_3}$?" Risposta: fosfina; distrattori metano, silano, ammoniaca.

## Livello 4: idruri, dal nome alla formula

Distrattori: un atomo di idrogeno in più o in meno, l'indice messo sull'altro elemento, l'idrossido dello stesso
metallo.

- "Qual è la formula del composto che ha questo nome: idruro di bario?" Risposta $\mathrm{BaH_2}$; distrattori
  $\mathrm{BaH}$, $\mathrm{Ba_2H}$, $\mathrm{BaH_3}$.
- "... triidruro di azoto?" Risposta $\mathrm{NH_3}$.

## Livello 5: idracidi, nomi e formule

Metà dalla formula al nome (tradizionale o IUPAC), metà dal nome alla formula. Distrattori dei nomi: -ico e -oso al
posto di -idrico (acido clorico, acido solforoso), "idruro di" e il non metallo, -ato e -ito al posto di -uro, il
prefisso sbagliato (cloruro di diidrogeno, disolfuro di idrogeno). Distrattori delle formule: un atomo di idrogeno in
più o in meno, l'ossiacido ($\mathrm{HClO_3}$, $\mathrm{H_2SO_4}$).

- "Qual è il nome tradizionale di $\mathrm{HCl}$?" Risposta: acido cloridrico; distrattori acido clorico, acido cloroso,
  idruro di cloro.
- "Qual è la formula del composto che ha questo nome: acido solfidrico?" Risposta $\mathrm{H_2S}$; distrattori
  $\mathrm{HS}$, $\mathrm{H_2SO_4}$, $\mathrm{HS_2}$.

## Esercizi da evitare

- Il numero di ossidazione in $\mathrm{SiH_4}$, $\mathrm{PH_3}$ e $\mathrm{AsH_3}$: è una convenzione (la nota della
  lezione).
- L'acqua, che non è in nessuna delle tre famiglie, e $\mathrm{H_2Se}$ e $\mathrm{HCN}$, che la lezione non mette in
  tabella.
- La stessa formula scritta al contrario tra i distrattori ($\mathrm{H_3N}$ per $\mathrm{NH_3}$): ha gli stessi atomi.
- "Solfuro di idrogeno" tra i distrattori del nome IUPAC di $\mathrm{H_2S}$: è il suo nome di Stock.

## Risposta aperta

Il livello 2 ha come risposta un numero intero: si può dare a risposta aperta, corretto sul valore.

## Verifica

`chim_idruri_idracidi.py` decide la famiglia dalla formula (l'altro elemento è un metallo; oppure è dei gruppi 14 e 15
con l'idrogeno a destra; oppure dei gruppi 16 e 17 con l'idrogeno a sinistra), ritrova i numeri di ossidazione con le
regole della lezione 76 e legge i nomi dalle sue tabelle; controlla che nessuna opzione sbagliata sia un altro nome
giusto del composto, che ogni nome porti a una sola formula e le quote dei casi.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 200 px su 252; il testo dei problemi è prosa e va a
capo da sé).

### Errori piantati

Su 60 esercizi per livello (seed da 300): risposta o indice dell'opzione giusta, opzione doppia, distrattore uguale alla
risposta, parole vietate, caso dichiarato bocciati 300 su 300; testo dell'opzione giusta 297 su 297; un altro nome
giusto tra i distrattori 80 su 80; un indice della formula del testo cambiato 121 su 124 (i tre che passano sono
$\mathrm{SO_2}$ diventato $\mathrm{SO_3}$ al livello 1, che resta un ossido).
