# Note: Metodi di separazione dei miscugli

Lezione nuova (biennio di chimica, gruppo 23, 30 settembre 2026). Conti rifatti in Python: $R_f$ dell'esempio 2,
$2{,}4/8{,}0 = 0{,}30$, $3{,}6/8{,}0 = 0{,}45$, $6{,}0/8{,}0 = 0{,}75$; nella figura del cromatogramma le macchie sono a
$0{,}8 + 0{,}35\,d$ (scala $0{,}35$ per centimetro): $1{,}64$, $2{,}06$, $2{,}90$, il fronte a $3{,}60$. `check.mts` passa,
con un avviso sui grassetti (19, tutti sul termine nel punto in cui è definito: la lezione presenta molti metodi e
strumenti).

## Struttura

Apertura con tre esempi di tutti i giorni; la tabella metodo, miscuglio, proprietà sfruttata; poi un metodo per sezione
(filtrazione, decantazione con l'imbuto separatore, centrifugazione, evaporazione e cristallizzazione, distillazione con
la temperatura in testa alla colonna e la distillazione frazionata, estrazione con solvente, cromatografia con $R_f$,
separazione magnetica), ognuno con il suo apparecchio disegnato; infine la separazione in più passi (sabbia, sale e acqua;
ferro, sabbia e sale). Avvisi accanto alle regole: il filtro non ferma il disciolto, il termometro in alto, le distanze
dalla linea di partenza, separare non è trasformare.

## Scelte

- La decantazione comprende l'imbuto separatore per i liquidi che non si mescolano, come fa il Valitutti (da verificare
  sul capitolo 2 di "Chimica: concetti e modelli", Zanichelli; non ho letto i paragrafi, solo i titoli dei capitoli).
- Evaporazione e cristallizzazione sono in una sezione sola, perché sfruttano la stessa proprietà; la cristallizzazione
  è presentata anche come metodo di purificazione.
- La cromatografia arriva al fattore di ritenzione $R_f$: il DM 211/2010 non lo nomina, e non so se i libri del primo
  anno lo trattano (vedi le domande). Il livello 4 degli esercizi dipende da questa scelta.
- La distillazione di etanolo e acqua è nella figura interattiva con una prima frazione che "contiene ancora un po'
  d'acqua": etanolo e acqua formano un azeotropo al $95{,}6\%$ in massa (da verificare), e una distillazione semplice non
  li separa del tutto. La lezione di chimica 20 nomina gli azeotropi in un riquadro.
- Le temperature di ebollizione a $1\,\text{atm}$ (acetone $56$, metanolo $65$, etanolo $78$, acqua $100$, acido acetico
  $118$, glicole etilenico $197\,^\circ\text{C}$) sono valori arrotondati noti, non ricontrollati su una fonte in questa
  sessione: da verificare.
- Lo iodio si estrae con il cicloesano, non con il tetracloruro di carbonio dei libri più vecchi, che non si usa più nelle
  scuole perché tossico.

## Figure

Sei TikZ, guardate in chiaro e in scuro: `separazione-filtrazione` (imbuto con carta da filtro sopra un becker, residuo
e filtrato), `separazione-imbuto-separatore` (olio sopra acqua, rubinetto aperto; le superfici delle pareti sono
campionate dalla curva di Bézier, per riempire il liquido senza `\clip`), `separazione-centrifugazione` (provetta prima e
dopo), `separazione-evaporazione-capsula` (capsula su treppiede con fiamma e cristalli), `separazione-distillazione-apparato`
(pallone, termometro in testa, refrigerante inclinato con la camicia d'acqua, beuta di raccolta) e
`separazione-cromatografia-carta` (striscia prima e dopo, con le quote di $8{,}0$ e $2{,}4\,\text{cm}$).

Due interattive, guardate in chiaro, in scuro, sul telefono, all'inizio e durante la corsa:

- `distillazione-temperatura-colonna` (`chimica/DistillazioneColonna.tsx`): l'apparato accanto al grafico della
  temperatura in testa nel tempo; si sceglie acetone e acqua o etanolo e acqua, e con il cursore o con Avvia il liquido
  cala, il distillato gocciola nella beuta 1, la beuta si cambia quando la temperatura sale, l'acqua va nella beuta 2.
  Modello scritto a mano, a tratti (riscaldamento, prima sosta con una piccola deriva, salita, seconda sosta), fermo a
  $18$ minuti perché non si distilla a secco.
- `cromatografia-carta-macchie` (`chimica/CromatografiaCarta.tsx`): la striscia nel becker, tre inchiostri; il fronte sale
  come $\sqrt{t}$ e ogni colorante sta alla frazione $R_f$ del fronte. La striscia è disegnata fuori dall'inversione del
  tema scuro, come i colori di `PrismaDispersione.tsx`: la carta resta bianca e i coloranti restano del loro colore. I
  valori di $R_f$ sono inventati per la figura.

I pezzi di vetreria comuni alle figure del gruppo (fiamma, termometro, pallone con il liquido a una certa altezza, beuta)
sono in `chimica/vetreria.tsx`.

## Esercizi

Generatore `chim-separazione-miscugli`, cinque livelli (specifica in `specs/exercises/chim-separazione-miscugli.md`),
scena nuova `cromatogramma` (`exercises/scenes/Cromatogramma.tsx`) per il livello 4.

## Domande per Andrea

- Il fattore di ritenzione $R_f$ si fa al primo anno, o basta dire che le macchie salgono a altezze diverse? Se non si fa,
  il livello 4 degli esercizi va tolto o spostato.
- Decantazione e imbuto separatore: nei libri del biennio l'imbuto separatore è un metodo a sé o una forma di
  decantazione? Negli esercizi è un'opzione a sé ("Imbuto separatore").
- La cristallizzazione come metodo di purificazione, con la soluzione satura che si raffredda, va bene al primo anno, o
  basta "si fa evaporare lentamente il solvente"?
- Nella distillazione conviene insegnare subito che etanolo e acqua non si separano del tutto (l'azeotropo, senza il
  nome), o tenere l'esempio pulito dell'acetone e basta?
- Separazione magnetica, estrazione con solvente e centrifugazione: sono tutti nel programma del primo anno, o qualcuno è
  da togliere? (Il DM 211/2010 non elenca i metodi.)
- Lo iodio estratto con il cicloesano: nei laboratori delle scuole si usa questo solvente, o un altro (esano, olio)?
