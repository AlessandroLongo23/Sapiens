# Energia di legame e regola dell'ottetto

Generatore: `chim-regola-ottetto` (`src/lib/exercises/v2/generators/chim-regola-ottetto.ts`, con
`src/lib/exercises/v2/chim3-e.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_regola_ottetto.py` (con
`_chim3_e.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/62-chim-regola-ottetto.md`. Percorso nel database:
`high_school/chemistry/legami-chimici/chim-regola-ottetto`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più: prima l'energia (i fatti, la lettura della
tabella, un prodotto, un bilancio), poi l'ottetto (il conto degli elettroni, lo ione con il suo gas nobile).

## Nomi dei livelli

1. Energia e stabilità
2. Confrontare i legami in tabella
3. L'energia per rompere i legami
4. Il bilancio di energia di una reazione
5. Quanti elettroni per l'ottetto
6. Lo ione e il gas nobile

## Dati

La tabella della lezione, lunghezza in pm ed energia in kJ/mol: $\mathrm{H{-}H}$ $74$ e $436$; $\mathrm{F{-}F}$ $141$ e
$159$; $\mathrm{Cl{-}Cl}$ $199$ e $243$; $\mathrm{Br{-}Br}$ $228$ e $193$; $\mathrm{I{-}I}$ $267$ e $151$;
$\mathrm{H{-}F}$ $92$ e $567$; $\mathrm{H{-}Cl}$ $127$ e $431$; $\mathrm{H{-}Br}$ $141$ e $366$; $\mathrm{H{-}I}$ $161$
e $298$. Gruppi e numeri atomici da `src/lib/tools/elementi.json`. Scelta multipla con quattro opzioni; il livello 5
chiede un numero intero e va anche a risposta aperta.

## Livello 1: energia e stabilità

Sedici domande della lezione, ognuna con la risposta e tre distrattori: che cosa succede all'energia quando due atomi
si legano, che cosa indicano la distanza e la profondità del minimo della curva, perché l'energia risale a breve
distanza, che cosa succede all'energia quando un legame si rompe e quando si forma, le unità di misura, quali
elettroni fanno i legami, gli elettroni esterni del neon e dell'elio, perché i gas nobili non si legano, che cos'è
l'ottetto, il duetto dell'idrogeno, lo ione $\mathrm{Na^+}$ che resta sodio.

- "Che cosa succede quando un legame chimico si rompe?" Risposta: si assorbe energia. Distrattori: si libera energia
  (l'errore del riquadro della lezione), l'energia non cambia, si crea energia dal nulla.
- "Nella curva dell'energia di due atomi in funzione della distanza, che cosa indica la profondità del minimo?"
  Risposta: l'energia di legame. Distrattori: la lunghezza di legame, il numero di elettroni, la carica dei nuclei.

## Livello 2: confrontare i legami in tabella

Una tabella con quattro legami della lezione, lunghezza ed energia; si chiede il più forte, il più debole, il più
corto o il più lungo. I quattro valori della colonna che serve sono tutti diversi ($\mathrm{F{-}F}$ e
$\mathrm{H{-}Br}$ hanno la stessa lunghezza e non compaiono insieme se si chiede la lunghezza). Le opzioni sono i
quattro legami: chi confonde "più forte" con "più lungo", o legge la colonna sbagliata, trova la sua risposta.

- $\mathrm{H{-}Cl}$ ($127$, $431$), $\mathrm{H{-}F}$ ($92$, $567$), $\mathrm{H{-}I}$ ($161$, $298$), $\mathrm{F{-}F}$
  ($141$, $159$): il più forte è $\mathrm{H{-}F}$.
- $\mathrm{H{-}H}$ ($74$, $436$), $\mathrm{Cl{-}Cl}$ ($199$, $243$), $\mathrm{I{-}I}$ ($267$, $151$),
  $\mathrm{H{-}Br}$ ($141$, $366$): il più lungo è $\mathrm{I{-}I}$.

## Livello 3: l'energia per rompere i legami

Un legame della tabella e una quantità di sostanza $n$ tra $0{,}250$, $0{,}500$, $0{,}750$, $1{,}25$, $1{,}50$,
$1{,}75$, $2{,}00$, $2{,}25$, $2{,}50\,\text{mol}$; si chiede $E = n \cdot E_{\text{legame}}$, arrotondata all'unità.
Vincoli: il risultato è un intero tra $100$ e $999\,\text{kJ}$ che non finisce con zero, e il prodotto non cade a metà
tra due interi. Distrattori: l'energia divisa per le moli, l'energia di legame da sola, il doppio (le moli di atomi al
posto delle moli di legami), la metà.

- $\mathrm{Cl{-}Cl}$, $243\,\text{kJ/mol}$, $2{,}25\,\text{mol}$ di cloro: $547\,\text{kJ}$. Distrattori $108$, $243$,
  $273\,\text{kJ}$.
- $\mathrm{H{-}F}$, $567\,\text{kJ/mol}$, $1{,}25\,\text{mol}$ di fluoruro di idrogeno: $709\,\text{kJ}$. Distrattori
  $454$, $567$, $354\,\text{kJ}$.

## Livello 4: il bilancio di energia di una reazione

La reazione dell'esempio 4 della lezione, $\mathrm{H_2} + \mathrm{X_2} \to 2\,\mathrm{HX}$, con $\mathrm{X}$ tra
fluoro, cloro, bromo e iodio e da $1$ a $4$ moli di ciascun reagente. Tre domande: l'energia assorbita per rompere i
legami (un quarto dei casi), l'energia ceduta dai legami che si formano (un quarto), il bilancio (metà). Il bilancio è
sempre "cede". Distrattori: per l'energia assorbita quella ceduta, un solo tipo di legame, una sola mole; per quella
ceduta la metà (il $2$ di $2\,\mathrm{HX}$ dimenticato), quella assorbita, il bilancio; per il bilancio lo stesso
numero con "assorbe", il bilancio con il $2$ dimenticato, la somma di tutto.

- Una mole di $\mathrm{H_2}$ e una di $\mathrm{F_2}$: rotti $436 + 159 = 595\,\text{kJ}$, formati
  $2 \cdot 567 = 1134\,\text{kJ}$, la reazione cede $539\,\text{kJ}$.
- $3$ moli di $\mathrm{H_2}$ e $3$ di $\mathrm{F_2}$, energia ceduta: $6 \cdot 567 = 3402\,\text{kJ}$. Distrattori
  $1701$, $1785$, $1617\,\text{kJ}$.

## Livello 5: quanti elettroni per l'ottetto

Un elemento con il suo gruppo. Per i gruppi 1, 2 e 13 (litio, sodio, potassio, rubidio, berillio, magnesio, calcio,
stronzio, alluminio) si chiede quanti elettroni cede; per i gruppi 15, 16 e 17 (azoto, fosforo, ossigeno, zolfo,
selenio, fluoro, cloro, bromo, iodio) quanti ne acquista. Risposta: un numero intero. Distrattori: l'altro conto (gli
elettroni di valenza al posto di quelli che mancano, e viceversa), $8$, la cifra delle unità del gruppo.

- "Il magnesio è nel gruppo $2$. Quanti elettroni deve cedere un suo atomo per restare con il livello più esterno
  completo?" Risposta $2$; distrattori $6$, $8$, $3$.
- "Lo zolfo è nel gruppo $16$. Quanti elettroni deve acquistare un suo atomo per completare l'ottetto?" Risposta $2$;
  distrattori $6$, $8$, $3$.

## Livello 6: lo ione e il gas nobile

Gli stessi elementi del livello 5. Si chiede lo ione che l'elemento forma e il gas nobile con la stessa configurazione.
Le opzioni sono quattro coppie: lo ione giusto con il gas giusto; lo ione giusto con il gas dall'altra parte (il
successivo per chi cede, il precedente per chi acquista); la carica con il segno sbagliato, con l'uno e con l'altro
gas. Nessun distrattore ha davvero gli elettroni del gas che nomina.

- "Il magnesio è nel gruppo $2$..." Risposta: $\mathrm{Mg^{2+}}$, come il neon. Distrattori: $\mathrm{Mg^{2+}}$ come
  l'argon, $\mathrm{Mg^{2-}}$ come il neon, $\mathrm{Mg^{2-}}$ come l'argon.
- "Il cloro è nel gruppo $17$..." Risposta: $\mathrm{Cl^-}$, come l'argon. Distrattori: $\mathrm{Cl^-}$ come il neon,
  $\mathrm{Cl^+}$ come l'argon, $\mathrm{Cl^+}$ come il neon.

## Esercizi da evitare

- Elementi del gruppo 14 e idrogeno nei livelli 5 e 6: il carbonio non cede né acquista, e l'idrogeno segue il
  duetto. Elementi di transizione: non seguono la regola.
- Distrattori del livello 6 che sarebbero veri sul conto degli elettroni, come $\mathrm{Mg^{6-}}$ con l'argon.
- Risultati del livello 3 che finiscono con zero ($320\,\text{kJ}$) o sopra $999\,\text{kJ}$: le cifre significative
  non sarebbero chiare.
- Bilanci di reazioni diverse da $\mathrm{H_2} + \mathrm{X_2}$: con molecole di più atomi servono energie medie, e i
  risultati si allontanano dai valori veri.

## Risposta aperta

Livello 5: un numero intero, classificazione `value`. Gli altri livelli restano a scelta multipla (testo, formule,
valori con unità).

## Verifica

`chim_regola_ottetto.py` ha una chiave delle risposte del livello 1 scritta dalla lezione; rilegge la tabella del
livello 2 e la confronta con i valori della lezione; rifà il prodotto del livello 3 in aritmetica esatta e controlla i
vincoli sul risultato; ricava dall'equazione i legami rotti e formati del livello 4; calcola dal gruppo gli elettroni
del livello 5; nel livello 6 conta gli elettroni di ogni opzione e accetta solo quella con il segno giusto e gli
elettroni del gas nobile nominato.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0.

### Errori piantati

Su 60 esercizi per livello (seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta, un
dato del testo cambiato, parole vietate, risposta numerica cambiata (anche insieme alle opzioni): tutti bocciati.
