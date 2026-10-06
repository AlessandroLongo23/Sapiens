# Note: I sali ternari

Lezione nuova (6 ottobre 2026), terzo anno, capitolo "Classificazione e nomenclatura dei composti", ultima lezione.
Gruppo J del lotto del terzo anno. `check.mts` passa su lezione, formulario e flashcard senza avvisi. Non pubblicata.

## Struttura e confini

Che cosa sono; gli anioni degli ossiacidi, con i suffissi (figura TikZ) e la tabella dei dodici anioni con nome
tradizionale e IUPAC; dagli ioni alla formula, con le parentesi; i tre nomi, con la tabella e lo ione ammonio; dalla
formula al nome; dal nome alla formula, con la figura interattiva; i sali acidi; i sali idrati; come si formano.

Gli ossiacidi e i loro nomi sono della 80, cationi e incrocio della 81: richiamati con un link. I sali idrati sono già
nella lezione 28 del biennio per la formula; qui c'è il nome. Fuori: sali basici, sali doppi, idrolisi (quarto anno).

## Scelte e convenzioni

- Notazione di Stock dei sali ternari: nome tradizionale dell'anione e numero romano del metallo, "solfato di
  ferro(III)". È la forma che si trova sulle etichette. L'alternativa "solfato(VI) di ferro(III)" non è usata.
- Nome IUPAC nella forma chiesta dal brief: "tetraossosolfato(VI) di disodio", con il prefisso sul metallo. Quando
  l'anione compare più volte ho scritto "bis[triossonitrato(V)] di calcio" e "tris[tetraossosolfato(VI)] di diferro",
  con le parentesi quadre. Il brief non dà questo caso: è una scelta mia, da confermare. In rete si trova anche
  "tetraossosolfato(VI) di ferro(III)", con il numero romano sul metallo e senza prefissi (impariamoinsieme.com,
  "Nomenclatura dei sali ternari", letto il 6 ottobre 2026).
- Sali acidi: nome tradizionale "idrogenocarbonato di sodio", come la lezione 47 del biennio; "bicarbonato" e
  "carbonato acido" sono citati come nomi d'uso. Nome IUPAC "idrogenotriossocarbonato(IV) di sodio".
- Idrati: la parola che conta l'acqua va in fondo ai tre nomi. Prefissi fino a deca-; non ci sono idrati con 9, 12 o
  18 molecole d'acqua.
- Il fosfito non c'è, né nella lezione né negli esercizi: vedi la nota della 80 sull'acido fosforoso.
- $\mathrm{Cu(NO_2)_2}$ (esempio 3) e $\mathrm{Cu(ClO_4)_2}$ (esempio 5) sono scelti perché obbligano a distinguere
  nitrito da nitrato e a mettere le parentesi; il nitrito di rame(II) è un composto poco stabile.
- Negli esercizi una tabella di "sali ammessi" (nella specifica) evita i composti che non esistono: carbonato
  ferrico, solfito stannico, permanganato ferroso.

## Dubbi per Andrea

- Nome IUPAC con più anioni: "tris[tetraossosolfato(VI)] di diferro" va bene? Parentesi quadre o tonde? O preferisci
  la forma con il numero romano sul metallo, "tetraossosolfato(VI) di ferro(III)"?
- Notazione di Stock: "solfato di ferro(III)", con il nome tradizionale dell'anione. Confermi?
- Sali acidi: quale nome metti nella colonna "tradizionale", idrogenocarbonato o bicarbonato (o carbonato acido)?
- Il nome IUPAC dei sali acidi, "idrogenotriossocarbonato(IV) di sodio", è quello che usi?
- La tabella dei sali ammessi negli esercizi è troppo prudente o troppo larga? L'ho scritta a memoria.

## Da verificare

- Gli usi citati: solfato di rame pentaidrato contro i funghi della vite, gesso come solfato di calcio diidrato, soda
  da bucato come carbonato di sodio decaidrato, sale inglese come solfato di magnesio eptaidrato, candeggina come
  soluzione di ipoclorito di sodio, calce viva che assorbe anidride carbonica. Scritti a memoria.
- Gli idrati degli esercizi (specifica, "Dati"): numeri di molecole d'acqua a memoria.
- La soluzione di bicarbonato "leggermente basica": coerente con la lezione 47.

## Figure

Una TikZ, guardata in chiaro e in scuro: `sali-ternari-suffissi-acido-anione` (i quattro acidi del cloro e i loro
anioni, con il cambio di suffisso sopra ogni freccia).

Una interattiva, `sali-ternari-acido-metallo`
(`src/components/content/interactive/chimica/SaliTernariAcidoMetallo.tsx`): si scelgono un ossiacido, quanti idrogeni
togliere e il catione; tre riquadri uno sotto l'altro mostrano l'acido, l'anione con la carica e il nome, il sale con
la formula; sotto, il conto delle cariche e i tre nomi; se all'anione resta idrogeno dice che è un sale acido.
Guardata a 800 px in chiaro dopo aver scelto lo ione ammonio (compare $\mathrm{(NH_4)_2SO_4}$) e in scuro dopo aver
scelto il ferro(III); a 390 px in chiaro dopo aver tolto un solo idrogeno (compare $\mathrm{NaHSO_4}$) e in scuro con
l'acido fosforico, senza scorrimento laterale. La figura lascia costruire anche sali che non esistono (carbonato ferrico): non avvisa.

Le formule dentro i disegni sono scritte con `chim3-J-formula.tsx`, un pezzo del gruppo che disegna indici e cariche
in SVG.

## Esercizio guidato

L'esempio 2 ($\mathrm{Fe_2(SO_4)_3}$): si fermerebbe sul riconoscimento dell'anione con la sua carica (solfato,
$2-$), sulla carica negativa totale ($-6$) e sul numero di ossidazione del ferro ($+3$), prima dei tre nomi.

## Esercizi

Generatore `chim-sali-ternari`, sei livelli (specifica in `specs/exercises/chim-sali-ternari.md`), tutto a scelta
multipla. PASS con i seed 1, 50001 e 777001; errori piantati tutti bocciati; `review.mts` e `width.mts` con codice 0.

Prerequisiti proposti: chim-ossiacidi, chim-sali-binari, numero-ossidazione
