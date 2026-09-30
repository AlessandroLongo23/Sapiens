---
aggiornato: 2026-09-30
tag: [sessione, laboratori, grafica]
---
# Laboratori, la fetta verticale

## Di cosa si è parlato
Alessandro ha provato `/laboratorio` con le braccia nuove: la demo funziona, ma sembra piatta e piena di interfaccia da pagina web (il pulsante per tornare indietro, il titolo, il selettore tra esperimento guidato e laboratorio libero, "Torna al banco" e "Ricomincia", la barra dei comandi e soprattutto la grande scheda delle istruzioni a destra). L'obiettivo è un videogioco in prima persona di genere survival, dove si maneggiano oggetti: un piccolo ambiente curato, con tanti oggetti e interazioni, uno stile morbido e pastello come Firewatch, Among Trees, The Long Dark e The Forest, e le mani al centro, con una presa e un gesto per ogni strumento. Ha chiesto se con Blender e Claude, lavorando per iterazioni e revisioni, si arriva a una resa così.

Claude ha risposto di sì per l'ambiente e lo stile, che dipendono da luce, palette e direzione artistica più che dal dettaglio, e con una riserva per le mani: una mano organica bella fatta solo da codice è al limite, meglio partire da una mesh già fatta. Ha proposto una fetta verticale: un banco, pochi oggetti, luce precalcolata, mani nuove e istruzioni nel mondo. Il risultato dipende dalle revisioni: Claude vede la scena solo per screenshot.

## Decisioni
- [[2026-09-30 I laboratori devono sembrare un videogioco, in uno stile pittorico e morbido]]
- [[2026-09-30 Il prototipo dei laboratori usa solo asset con licenza libera]]

## Cosa si è fatto
La fetta verticale è `/laboratorio/banco` (nel codice locale, non committata), descritta in [[Laboratori]]: stanza nuova con palette pastello e paesaggio dipinto fuori dalle finestre, luce del cielo precalcolata con Cycles e sole dal vivo, raggi di sole con la polvere, mani MIT di WebXR Input Profiles, un quaderno che si alza con Q al posto della scheda, un menu di pausa con Esc, e un piccolo lavoro da fare (sciogliere il solfato di rame mescolando, versare nella beuta). Il test automatico nel browser arriva in fondo; anche l'esperimento guidato di `/laboratorio` passa ancora dall'inizio alla fine con le mani nuove.

## Seconda parte: prese e ambiente
Alessandro ha trovato la resa "molto, molto meglio", con due problemi: le prese (compenetrazioni, presa a mano piena come una mano di Lego, mentre becher e beuta si prendono con i polpastrelli lasciando spazio sotto il palmo) e l'ambiente (troppo caldo per un laboratorio, un paesaggio naturale al posto di uno urbano, e dalla finestra si capiva che fuori c'era un piano dipinto).

Sulle prese Alessandro ha proposto un playground con uno slider per articolazione; Claude ha cercato come fanno gli strumenti per la VR (Meta Interaction SDK con le pose registrate e le superfici di aggancio cilindriche, HurricaneVR con l'editor di pose e la posa automatica solo come bozza). Visto che gli slider per venti articolazioni sono troppi, si è scelta una via di mezzo: pochi parametri che descrivono la presa e un risolutore che calcola le dita. Alessandro ha regolato a mano la presa del becher; Claude ne ha ricavato le regole per gli altri contenitori. Da qui in avanti Alessandro regola le prese nel playground e Claude le integra; per gli oggetti da prendere in più modi basta una variante.

Sull'ambiente: palette fredda, sole di tarda mattinata, città in 3D fuori dalle finestre (vedi [[Laboratori]]).

## Terza parte: l'esperimento completo
Alessandro ha chiesto di portare il lavoro del banco nella simulazione completa di `/laboratorio`, con tutti i passaggi e la stessa cura dell'interfaccia. Ora `/laboratorio` è l'esperimento del solfato di rame giocato con le mani, nella stanza nuova (vedi [[Laboratori]]); il vecchio esperimento guidato con i pannelli non è più usato (`Lab.tsx` ed `experiment.ts` sono ancora nella cartella, da decidere se toglierli). Provandolo sono venute fuori correzioni di gioco: il rubinetto del gas e la filtrazione spostati più avanti sul banco perché la mano ci arrivi; la portata misurata dalla spalla a busto dritto, che prima cambiava con dove si guardava; il versamento in un recipiente sul banco fatto di lato, girando l'avambraccio; la carta nell'imbuto che diventa parte dell'imbuto. Il test del banco passa ancora.

## Quarta parte: la sensazione dei controlli
Alessandro trovava i controlli rigidi. La causa era una camera che si comportava come un treppiede: velocità che inseguiva il tasto con una curva esponenziale (scatto nel primo istante), nessun movimento della testa, mani incollate alla visuale. Riferimenti usati: "Game Feel" di Steve Swink (2008) e il talk di Squirrel Eiserloh "Juicing Your Cameras With Math" (GDC 2016). Sono stati fatti sei interventi, ciascuno misurato con un test nel browser:
1. Le mani seguono la testa con una molla: girando restano indietro di circa 6° e tornano in 0,4 s; in partenza e in frenata si spostano di 3 cm per inerzia, a passo costante stanno al loro posto (prima restavano indietro di circa 10 cm).
2. La testa ruota sul collo: guardando il banco l'occhio avanza e scende di qualche centimetro, il corpo resta dov'è.
3. Passo (13 mm su e giù, 12 mm di lato), leggera inclinazione nei passi laterali, respiro da fermi. Si può spegnere dal menu di pausa, pensando alla LIM.
4. Partenza e frenata con molle a curva a S, la partenza un po' più lenta della frenata; accovacciarsi con un filo di assestamento.
5. Un clic dato mentre le mani sono occupate parte da solo se l'azione finisce entro 0,4 s; fermarsi per un'azione è una frenata breve e morbida.
6. Il mouse senza l'accelerazione del sistema, dove il browser lo consente, con la sensibilità regolabile nel menu di pausa.

Correzioni emerse nella stessa giornata: il riquadro invisibile per cliccare la pipetta era largo quasi un metro (il liquido veniva misurato come se fosse al centro della stanza) e il mirino passava attraverso il quaderno alzato.

## Rimasto aperto
- Il suono (passi, camice, vetro appoggiato), che manca del tutto e conta quanto il movimento.
- Il ruolo di Dario: moodboard e palette, o revisione di quello che c'è.
- Le prese degli oggetti che non sono solidi di rotazione (occhiali, capsula, carta da filtro, rubinetto del gas) non sono ancora nel playground.
- Le varianti delle prese salvate nel playground vanno collegate alle azioni del gioco (versare, mescolare, aspirare).
- Le maniche troppo grandi e luminose vicino alla camera, le mani che coprono il lavoro mentre si versa.
- Il banner dei cookie del sito sopra la schermata iniziale del laboratorio.
- Il badge "1 Issue" di Next in sviluppo, visto nello screenshot del 29 settembre e mai riprodotto.
- Togliere o tenere il vecchio esperimento guidato (`Lab.tsx`, `experiment.ts`), che nessuna pagina usa più.
- La presa dell'imbuto regolata per il gambo, mentre il gambo sta nel collo della beuta: da riguardare nel playground.
