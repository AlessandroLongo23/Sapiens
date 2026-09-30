---
stato: decisa
aggiornato: 2026-09-30
tag: [idea, laboratori, chimica, fisica, 3d]
---
# Laboratori

## L'idea
Alessandro, 29 settembre 2026. Ambienti 3D esplorabili in prima persona, uno per area: chimica, fisica, ottica, elettronica. Si gira come in un videogioco (WASD e mouse), ma lo scopo è imparare. Per la chimica un laboratorio molto completo, a cui aggiungere esperimenti nel tempo.

Il punto chiave è come si costruiscono gli esperimenti. Scriverli uno per uno non scala, è difficile da mantenere, frustra lo studente (può fare solo le azioni previste) e sembra vecchio. Invece il laboratorio è modulare: ogni oggetto, strumento e sostanza ha le sue azioni possibili, e quello che succede segue le regole vere della chimica. Un esperimento allora è solo un insieme di passi e obiettivi; il resto lo fa l'infrastruttura.

## Da dove nasce
Il 29 settembre 2026 Claude ha costruito in una sessione un prototipo: `/laboratorio`, la preparazione dei cristalli di solfato di rame da ossido di rame(II) e acido solforico. La scena è modellata in Blender da codice (`scripts/lab/build_lab.py`, un GLB da 2,5 MB) e animata con three.js (`src/components/lab/`). Ha già una piccola simulazione sotto i passi: bilancio termico sulla reticella, ebollizione ed evaporazione, velocità di dissoluzione che dipende da temperatura e mescolamento, moli di acido e rame, filtrazione, travaso guidato dal livello del liquido nel recipiente inclinato. Poi ha avuto i controlli in prima persona. È solo nel codice locale, non committato, sul branch `fisica-primo-lotto`.

## Stato del prototipo
Aggiornato il 30 settembre 2026. Il laboratorio ha un corpo: una figura in camice con guanti in nitrile (`scripts/lab/build_avatar.py`, `public/lab/avatar.glb`, 360 KB). Le mani sono la maglia della "generic hand" di WebXR Input Profiles (licenza MIT), con le ossa delle dita adattate alle sue articolazioni; le maniche sono generate in Blender con il modificatore Skin e legate alle ossa con i pesi automatici. L'avambraccio ha un osso di torsione, e ogni articolazione si flette sull'asse X locale.

Sulla pagina (`src/components/lab/engine/avatar.ts`, `grasp.ts`, `hands.ts`):
- cinematica inversa a due ossa con la rotazione del gomito calcolata come in VRArmIK (da dove sta la mano rispetto alla spalla e da come è girata), clavicola che si alza e si porta avanti, busto che si piega sul banco fino a 45° per le prese lontane;
- torsione del polso divisa tra avambraccio (60%) e polso (40%), e polso tenuto nei limiti anatomici (flessione 73°, estensione 65°, deviazione radiale 19° e ulnare 33°);
- la presa di un oggetto cilindrico non è scritta a mano: si provano 32 posizioni intorno all'asse e si tiene quella con il polso più comodo; le dita si chiudono finché i polpastrelli toccano la superficie dell'oggetto;
- il gesto segue il modello del minimo jerk: la mano si apre durante il trasporto, si ferma a qualche centimetro dall'oggetto e si chiude avvicinandosi; poi l'oggetto segue la mano, non il contrario.

Due modalità, scelte in alto sulla pagina:
- Esperimento guidato: i passi di prima; la mano dal lato dell'oggetto lo va a prendere, lo accompagna durante l'azione e poi lo lascia. Troppo lontano, un avviso chiede di avvicinarsi.
- Laboratorio libero (`src/components/lab/engine/free.ts`): clic sinistro per la mano sinistra, clic destro per la destra; con una mano vuota si prende l'oggetto puntato, con un oggetto in mano si appoggia sul piano puntato. F usa insieme le due mani: mescola con la bacchetta nel recipiente dell'altra mano, o versa da un recipiente all'altro girando l'avambraccio. Lo zoom è su Z e sul tasto centrale.

Non c'è ancora chimica nella modalità libera: si versa e si mescola, ma le reazioni, il calore e il gas restano nell'esperimento guidato finché non c'è il motore. Da migliorare: le braccia occupano molto dell'inquadratura quando lavorano vicino agli occhi; accovacciandosi il corpo scende nel pavimento.

### La fetta verticale: `/laboratorio/banco`
Aggiornato il 30 settembre 2026, dopo la decisione sullo stile ([[2026-09-30 I laboratori devono sembrare un videogioco, in uno stile pittorico e morbido]]). Una pagina accanto al prototipo, per provare la resa da videogioco su un banco solo:
- la stanza (`scripts/lab/build_banco.py`) riusa l'attrezzatura di `build_lab.py` con una palette pastello: pareti crema e salvia, ante corallo, piano ardesia, pavimento a piastrelle verde acqua. Due finestre a sinistra danno su un paesaggio dipinto da codice (cielo al tramonto, creste di abeti che sfumano nella foschia) con il sole basso;
- la luce del cielo e tutti i rimbalzi sono calcolati una volta con Cycles in una lightmap (`public/lab/banco-luce.png`); il sole è dal vivo nella pagina, così gli oggetti spostati fanno ombra. Nella pagina (`src/components/lab/engine/look.ts`) si aggiungono raggi di sole con la polvere dentro, ombre di contatto sotto gli oggetti mobili, un po' di bloom e un grading (neri alzati verso il viola, luci calde, vignettatura);
- le mani sono la "generic hand" di WebXR Input Profiles (licenza MIT, [[2026-09-30 Il prototipo dei laboratori usa solo asset con licenza libera]]) con i suoi pesi, sullo scheletro dell'avatar adattato alle sue articolazioni; in prima persona si vedono solo braccia e mani, il busto è nascosto;
- niente interfaccia da pagina web: un puntino come mirino, il nome di quello che si punta, una riga di sottotitoli. Le istruzioni sono in un quaderno che si alza con Q e spunta da solo i passi fatti; Esc apre un menu di pausa con i comandi;
- il lavoro è piccolo: sciogliere mescolando i cristalli di solfato di rame in acqua (l'acqua diventa azzurra), versare la soluzione nella beuta e rimettere tutto sul banco. Il test nel browser senza schermo arriva in fondo ai sei passi.

Aggiornato ancora il 30 settembre 2026, dopo due revisioni di Alessandro:
- l'ambiente è più freddo e urbano: pareti bianche e verde acqua, ante blu acciaio, sole di tarda mattinata più bianco e più alto. Fuori dalle finestre, con i vetri, c'è una città in 3D al posto del piano dipinto: il cortile della scuola con prati, alberi e recinzione, una strada con lampioni e auto, le case di fronte con persiane verdi e tetti di coppi, e più indietro altri palazzi e un campanile nella foschia. Il laboratorio è a piano rialzato, 1,3 m sopra la strada. La città ha una sua lightmap, con dentro anche il sole, ed è disegnata senza luci (`public/lab/banco-esterno.png`); il cielo è una cupola con gradiente e nuvole morbide;
- le prese non sono più calcolate chiudendo le dita finché toccano: c'è un risolutore (`src/components/lab/engine/grip.ts`) che a partire da pochi parametri (tipo di presa, altezza, profondità e posizione della mano, inclinazione, dove arrivano dita e pollice, quante dita toccano) porta i polpastrelli su punti della superficie con una cinematica inversa per dito, tenendo fuori dall'oggetto tutti i vertici del guanto. Il pollice ha un grado di libertà in più, l'abduzione. I tipi di presa vengono dalla tassonomia GRASP (Feix e altri, IEEE THMS 2016); le falangi distali seguono le medie a due terzi e le dita che non toccano si chiudono insieme, come nelle sinergie posturali (Santello, Flanders, Soechting, J Neurosci 1998);
- un playground in sviluppo, `/laboratorio/mani`, mostra la mano e il braccio veri su un oggetto alla volta, con gli slider di questi parametri, i vertici che entrano nell'oggetto in rosso e i punti di contatto in verde. "Salva nella tabella" scrive `grips.json`, che il gioco legge; un oggetto può avere più prese (per esempio il becher per versare), salvate come `Oggetto@variante`. Alessandro regola le prese a mano, oggetto per oggetto; la presa del becher è la sua, e da quella vengono le regole automatiche per gli altri contenitori (mano indietro di raggio più 21 mm, palmo a 12 mm, presa a un terzo dell'altezza, pollice a 138° dall'altra parte, dita 15° in giù).

Poi, sempre il 30 settembre, l'interazione: un oggetto si evidenzia solo quando una mano libera ci arriva davvero; mentre si tiene qualcosa, una copia trasparente mostra dove verrà posato, rossa se il punto è troppo lontano o già occupato da un altro oggetto; sotto il mirino ci sono le azioni come in un videogioco (il pulsante del mouse o il tasto, un'icona e il verbo: prendi, posa, versa, mescola; accendi e gira sono pronte per quando ci saranno). Posando, gli ultimi centimetri l'oggetto si assesta da solo nella posa giusta, così non entra più nel banco. Il guanto finisce al polso con un bordino arrotolato, e tra il guanto e la manica del camice (accorciata) si vede l'avambraccio color pelle, che entra in tutti e due. Le luci del soffitto sono plafoniere a feritoia da 120 × 30 cm con due tubi fluorescenti e le lamelle, come nelle scuole e negli ospedali, accese nella lightmap a 4000 K.

In fondo alla giornata l'esperimento completo è passato su `/laboratorio`, con tutto quello costruito per il banco: la stessa stanza e la stessa luce, con sul banco il kit dell'esperimento (becco Bunsen, treppiede, rubinetto del gas, pipetta, imbuto, capsula; `scripts/lab/build_banco.py` con `BANCO_KIT=esperimento`, che scrive `public/lab/esperimento.glb`). Gli undici passi del solfato di rame sono gli stessi dell'esperimento guidato, con la stessa simulazione sotto (calore, reazione, filtrazione, evaporazione, resa), ma si fanno con le mani: uno strumento in mano agisce su quello che si guarda con F (la pipetta pesca dall'acido, l'accendigas accende il becco, la bacchetta mescola, la spatola prende e versa l'ossido, la carta si piega nell'imbuto, si versa in un recipiente sul banco); il rubinetto si gira con un clic della mano libera; la ghiera dell'aria, la fiamma e la propipetta si regolano con la rotella del mouse, con una lente sulla tacca mentre la pipetta si riempie. Non c'è un pannello: l'obiettivo del momento compare in alto a sinistra quando cambia e poi sfuma, sotto ci sono solo le letture che servono (termometro, fiamma, livello nella capsula), e i passi con il loro perché sono nel quaderno, che li spunta quando il banco ci arriva, in qualunque modo ci arrivi. Il becher caldo scotta e non si prende finché non si raffredda; il gas aperto senza fiamma, la fiamma gialla sotto il becher e l'acido che bolle finiscono tra gli errori. Alla fine passano due giorni in pochi secondi (fuori si fa notte e poi giorno, l'orologio corre) e il quaderno si apre sui risultati: la resa e come è andata. Un test automatico nel browser lo fa dall'inizio alla fine.

Le prese non sono mai uguali due volte: a ogni presa il gioco sceglie una delle prese salvate per quell'oggetto (nel playground si caricano, aggiornano, salvano come alternative ed eliminano, per ogni oggetto e per ogni uso) e la varia un poco: per la presa con i polpastrelli altezza ±6 mm, giro ±15°, inclinazione ±7°, chiusura delle altre dita ±0,25, ventaglio ±5°, intervalli scelti da Alessandro su due tavole del becher. Mentre un oggetto è solo tenuto in mano, ogni 5-12 secondi le dita si assestano: si sollevano appena una dopo l'altra (il pollice per ultimo) e si richiudono su una nuova variazione della stessa presa; il palmo resta fermo e l'oggetto si risistema nella mano (`src/components/lab/engine/settle.ts`).

Da migliorare: le maniche vicino alla camera sono grandi e molto illuminate dal sole; mentre si versa le mani coprono il lavoro; la presa delle dita è ancora calcolata, non una posa scritta per ogni strumento; il banner dei cookie del sito compare sopra la schermata iniziale. Le mani nuove valgono anche per `/laboratorio`.

## Il menu dei laboratori (30 settembre 2026)
Su richiesta di Alessandro, nel codice locale e non ancora pubblicato. `/laboratorio` non apre più direttamente l'esperimento: è una pagina del sito, nello stile del quaderno, in tre passi (`src/components/lab/menu/LabMenu.tsx`, catalogo in `src/lib/lab/catalog.ts`):
- il laboratorio, come le copertine dei libri della biblioteca: Chimica aperta, Fisica ed Elettronica con il timbro "Presto" (quale laboratorio viene dopo la chimica resta una domanda aperta);
- l'esperimento, un indice con accanto la scheda di laboratorio (cosa impari, cosa c'è sul banco, sicurezza). Pronto solo il solfato di rame; saggi alla fiamma, titolazione acido-base, pila Daniell e laboratorio libero sono segnaposto, non ancora scelti con Andrea;
- come si lavora: da solo (aula con la classe simulata o banco singolo, qualità grafica) o con la classe, solo per i docenti: postazioni 12 o 24, gruppi in coppia, per banco o da soli, avatar che si urtano o si attraversano, banchi solo propri o di tutti, segnali accesi o spenti. Gli studenti entreranno con un codice (campo presente ma disattivato).

La sessione ha tutto nell'indirizzo (`/laboratorio/chimica/solfato-di-rame?modo=…`), così un docente può salvarla o proiettarla. Da solo si entra dalla schermata del titolo; con la classe prima c'è la sala d'attesa, a schermo intero nei colori del gioco (`Lobby.tsx`): il codice della stanza, le regole scelte e la pianta dell'aula vista dall'alto, dove i posti si riempiono di volti man mano che gli studenti entrano. È un'anteprima dichiarata: la stanza condivisa non c'è ancora, gli arrivi sono simulati. I volti sono 24 ritratti del kit degli avatar (`scripts/lab/render_faces.py`, `public/lab/volti/`). Stesso giorno, su proposta di Alessandro per legare lo stile del quaderno a quello del videogioco: la pagina è piena di foto prese dal gioco e fissate con lo scotch, un po' storte (`TapedPhoto.tsx`, immagini in `public/lab/copertine/`). Una sulla copertina di ogni laboratorio, una accanto a ogni esperimento e una grande sulla scheda, una per ciascun modo di lavorare (il banco in prima persona, la classe vista dal docente), e le scelte della stanza e della grafica sono foto da scegliere (la grafica leggera è la stessa foto a pixel grossi). Dove una foto non c'è ancora (fisica, elettronica, gli esperimenti in arrivo) c'è uno schizzo a matita su carta a quadretti con la scritta "foto in arrivo" (`LabSketches.tsx`).

Sul telefono la pagina mostra solo come aprirla sul computer, vedi [[2026-09-30 Le funzioni dipendono dal dispositivo, con un passaggio tra telefono e computer]]. Il vecchio `/laboratorio` (l'esperimento sul banco singolo) è ora la scelta "Banco singolo".

## Prestazioni (30 settembre 2026)
In vista di una scena con più persone insieme, la scena è stata misurata e ottimizzata. Un banco di prova (`scripts/lab/bench.mjs`) la carica con 1, 5, 13 e 25 studenti (gli altri simulati: avatar interi intorno al banco, con le braccia mosse dalla stessa cinematica inversa e un becher in mano) e misura il tempo di un fotogramma e il costo di ogni aspetto, spegnendoli uno alla volta. Mediane di tre giri alternati prima e dopo, su un Mac M5 in sviluppo:

| Studenti | Prima | Dopo | Draw call |
|---|---|---|---|
| 1 | 4,5 ms | 1,0 ms | 400 → 307 |
| 5 | 9,1 ms | 2,4 ms | 550 → 345 |
| 13 | 12,7 ms | 7,6 ms | 852 → 423 |
| 25 | 14,3 ms | 10,5 ms | 1304 → 539 |

Cosa è cambiato: il vetro e i liquidi erano materiali trasparenti a due facce, che three.js disegna in due passaggi segnandoli come modificati, e ogni fotogramma ricalcolava il loro shader (il 18% del tempo); ora sono due mesh, dentro e fuori. Tutto ciò che non si muove (stanza, città, scaffale, oggetti di arredo) viene unito per materiale e le sue matrici si calcolano una volta sola (`optimize.ts`); i pezzi minuscoli non proiettano più ombre dal vivo. Il contorno di ciò che si guarda ridisegnava tutta la scena e ricalcolava le ombre; ora guarda solo gli oggetti del banco e le braccia (`outline.ts`). La cinematica inversa del braccio ricalcolava le dita dieci volte per fotogramma; ora le calcola una volta (stesso risultato, 2,4 volte più veloce). L'avatar passa da circa 18 mesh a 4 (corpo, braccia, i due guanti). Grading e uscita sono un solo passaggio a tutto schermo. La risoluzione si adatta da sola: sotto i 45 fotogrammi al secondo scende, fino a 0,75 volte i pixel della finestra. La scena dell'esperimento è compressa (`scripts/lab/compress.py`): da 9,5 MB a 2 MB tra geometria, texture e lightmap. A vista la scena è identica a prima.

I tempi valgono per un M5, molto più veloce di un computer di scuola; il costo su un PC con grafica integrata è da verificare. Restano da fare, quando ci saranno davvero altre persone in scena: il livello di dettaglio degli avatar lontani (niente dita, ombre semplici), lo stato separato dalla grafica e la rete.

## L'aula e gli avatar (30 settembre 2026)
Una seconda pagina, `/laboratorio/aula`, mette l'esperimento in un laboratorio scolastico intero, con i compagni e il docente. La pianta (`scripts/lab/build_aula.py`, che riusa la stanza, la città, la luce e l'esportazione di `build_banco.py`) segue la guida britannica sui laboratori di scienze (DfE, Building Bulletin 80; CLEAPSS G14, 2009): tutti guardano la parete della lavagna, a 90° da quella delle finestre; due colonne di banchi doppi in tre file, con un corridoio centrale di 1,4 m; il banco del docente davanti, con lo spazio per radunarsi intorno a una dimostrazione e la cappa aspirante accanto, in vista della classe e lontana dalle porte; la doccia di emergenza, il lavaocchi, gli estintori, il pronto soccorso e il pulsante di emergenza vicino al docente; gli armadi sulla parete lunga di fronte alle finestre, il banco degli strumenti contro la parete di fondo, due porte. L'aula misura 10 × 10,1 m, la misura che CLEAPSS indica come buona per 25-30 studenti. Ogni banco ha una canalina sul retro con il rubinetto del gas e le prese di ogni studente e un lavandino in mezzo.

Ci sono anche le cose che molte scuole non hanno (le cappe, per esempio, CLEAPSS le prevede solo in metà dei laboratori): la cappa con dentro una reazione che si fa solo lì (biossido di azoto), la doccia e il lavaocchi, gli armadi ventilati per infiammabili e corrosivi, e un banco di strumenti: bilancia analitica, spettrofotometro UV-Vis, pH-metro, centrifuga, piastra con agitatore magnetico, distillazione, stufa. Per ora sono arredo con il nome in sovrimpressione; da usare nel motore. Quante scuole italiane abbiano un laboratorio di chimica funzionante o una cappa è da verificare: la Fondazione Agnelli (2019) conta il 40,6% degli edifici scolastici con sole aule e uffici.

La postazione del giocatore è la metà sinistra del banco della seconda fila vicino alle finestre, con il kit dell'esperimento in 1,3 m. Negli altri posti stanno undici compagni e il docente, con i corpi clonati da un solo avatar e le teste dal kit degli avatar ([[2026-09-30 Gli avatar sono un kit di forme semplici, opachi nel laboratorio e adesivi nel sito]]): lavorano al banco con la stessa cinematica inversa del giocatore, il docente fa gesti e si gira verso la classe (`src/components/lab/engine/classroom.ts`). Il giocatore gira intorno ai banchi e agli armadi (`fps.ts`), le ombre del sole coprono tutta l'aula e le ombre di contatto valgono su ogni banco (`look.ts`). Il test automatico fa tutti gli undici passi dell'esperimento anche nell'aula (25,0 mL di acido, 24,9 mL di filtrato, cristalli). Una bozza senza luce calcolata è su `/laboratorio/aula-bozza`.

Il kit degli avatar (`scripts/lab/avatar_kit.py`, `public/lab/avatar-kit.glb`, 1,6 MB compresso) ha una forma del viso, tre tipi di occhi, sopracciglia, naso e bocca, otto colori della pelle, otto acconciature (corti, rasati, ricci, afro, caschetto, lunghi, coda, chignon) anche in versione da portare sotto il berretto e il cappellino, berretto, cappellino, hijab e turbante, barba, baffi e pizzetto, occhiali tondi e rettangolari. Ogni testa è una sola mesh colorata nei vertici. L'avatar di prima perde la testa, che ora è una mesh a parte.

Misure del 30 settembre, sul Mac M5 in sviluppo e con il computer carico (la cottura della luce in corso): l'aula con le sue 12 persone e il giocatore disegna un fotogramma in 2,9 ms, con 24 persone simulate in più (37 in tutto) in 5,6 ms; 438 draw call, di cui 109 per il vetro trasparente, e 786 mila triangoli; da scaricare 6,1 MB. Cuocere la luce sul processore del Mac M5, con il computer libero, richiede 10 minuti in bassa qualità (lightmap da 1024, quasi tutti per aprire le UV) e 11 minuti e mezzo in media (2048); l'alta (4096) ha richiesto 2 ore e 33 minuti, ma in parte insieme ad altre cotture, che rallentavano tutte. Messe a confronto, anche ingrandite, media e alta sono praticamente uguali: Alessandro ha scelto la media, che ora è quella predefinita.

Da migliorare: le teste pesano da 12 a 18 mila triangoli ciascuna, i livelli di dettaglio per le persone lontane non ci sono ancora, il vetro degli arredi si può semplificare, i compagni non tengono oggetti e non si muovono dal posto.

## Perché potrebbe valere
- Molte scuole fanno poco laboratorio; un laboratorio sul browser serve allo studente a casa e al docente sulla LIM (quanto poco laboratorio si fa, e in quante scuole, è da verificare).
- Gli esperimenti sono il materiale ideale per i [[Video brevi]]: colori, fiamme, cristalli.
- Nessun concorrente italiano diretto lo ha (da verificare).

Precedenti (ricerca di Claude, 29 settembre 2026):
- ChemCollective Virtual Lab, Carnegie Mellon (David Yaron): gratuito, in HTML5 dal 2016 circa. È già l'idea modulare in 2D: centinaia di reagenti in soluzione acquosa, si mescolano liberamente e il programma calcola i prodotti per acido-base, termochimica, solubilità e redox. Serve come riferimento per il modello chimico. Fonte: chemcollective.org/vlabs.
- Labster, azienda di Copenaghen: oltre 300 simulazioni di laboratorio vendute a scuole e università, a esperimenti scritti uno per uno. È il modello che l'idea vuole superare. Prezzi non pubblici. Fonte: labster.com/simulations.

## Decisioni del 30 settembre 2026
- [[2026-09-30 I laboratori devono sembrare un videogioco, in uno stile pittorico e morbido]]
- [[2026-09-30 Il prototipo dei laboratori usa solo asset con licenza libera]]
- [[2026-09-30 Gli avatar sono un kit di forme semplici, opachi nel laboratorio e adesivi nel sito]]
- [[2026-09-30 Nel laboratorio condiviso la postazione è l'unità, per gruppi da 1 a 3]]
- [[2026-09-30 L'aula si sceglie all'avvio dai presenti, e si ottimizza per la classe intera]]
- [[2026-09-30 Le funzioni dipendono dal dispositivo, con un passaggio tra telefono e computer]]

## Decisioni del 29 settembre 2026
Discussa in [[2026-09-29 Laboratori]]. Si fa, e subito:
- [[2026-09-29 I laboratori 3D partono subito, in parallelo ai lotti]]
- [[2026-09-29 I laboratori sono da computer, per i docenti alla LIM e gli studenti al pc]]
- [[2026-09-29 Il laboratorio di chimica è un motore modulare su un catalogo ricavato dal programma]]
- [[2026-09-29 Il primo traguardo dei laboratori è il motore, in un laboratorio libero senza esperimenti]]
- [[2026-09-29 Il prototipo del laboratorio va su master, fuori dall'indice e senza link]]

## Domande aperte
- Il secondo laboratorio dopo la chimica: elettronica, meccanica o ottica. Si decide dopo aver visto la chimica.
- L'elenco degli esperimenti classici del programma di chimica, da cui ricavare il catalogo.
- Se e quando i laboratori entrano in un piano a pagamento o nell'offerta alle scuole.
- Che cosa mostra la pagina a chi la apre dal telefono.

## Dubbi e conflitti
- "Tutto è possibile secondo le regole vere" non si può fare alla lettera: prevedere i prodotti di una reazione qualsiasi è un problema aperto anche per la ricerca. Si può fare in un mondo chiuso: un catalogo curato di sostanze e di tipi di reazione (acido-base, precipitazione dalla tabella di solubilità, redox da una tabella, gas che si liberano, dissoluzione, riscaldamento e cambi di stato, indicatori, saggi alla fiamma). È quello che fa ChemCollective.
- Il modello modulare è realistico per l'elettronica (le leggi di Kirchhoff sono esatte e chiuse) e per l'ottica geometrica; per la chimica serve il catalogo; per la meccanica un motore fisico.
- Tempi: la beta di gennaio 2027 ha solo la matematica, e la chimica e la fisica si pubblicano gratis ([[2026-09-27 Dopo la matematica delle superiori le altre materie, poi le medie]], [[2026-09-29 La fisica si pubblica gratis accanto alla beta]]). Una persona sviluppa: i laboratori competono con i lotti, il legale e il marketing di ottobre.
- Il prototipo gira solo da computer, mentre gli studenti usano soprattutto il telefono ([[App mobile]]).
- I dati chimici del catalogo sono contenuto di riferimento: valgono i [[Principi]] sulla verifica da parte di una persona.
- Le figure interattive di fisica sono state decise come 2D con il kit, senza motore fisico ([[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]]): un laboratorio di fisica 3D è un'altra cosa e non le sostituisce.

## Collegamenti
- [[Grafici e simulazioni interattive]], [[Tavola periodica interattiva]], [[Video brevi]], [[Lezioni]]
