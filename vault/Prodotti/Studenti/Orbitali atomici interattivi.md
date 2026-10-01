---
stato: in sviluppo
release: da decidere
aggiornato: 2026-10-01
tag: [prodotto, studenti, strumenti, chimica, lezioni]
---
# Orbitali atomici interattivi

## L'idea
Alessandro, 1° ottobre 2026. Mostrare la forma degli orbitali, a partire dalla scheda di un elemento della [[Tavola periodica interattiva]]. Due riferimenti: il video "We finally understood orbital shapes intuitively!" di FloatHeadPhysics (`youtube.com/watch?v=M--6_0F62pQ`), per la spiegazione, che Alessandro trova molto chiara e intuitiva; il video "A Better Way To Picture Atoms" di minutephysics (`youtube.com/watch?v=W2Xb2GFK2yc`), per le grafiche e le visualizzazioni.

## Perché potrebbe valere
Gli orbitali sono il punto in cui la chimica del terzo anno perde molti studenti: i libri mostrano palloncini statici senza dire da dove vengono. Una figura che si può girare, legata alla configurazione dell'elemento che si sta guardando, è il tipo di cosa che Sapiens fa già con le figure interattive.

## Dubbi e conflitti
Valutazione di Claude, 1° ottobre 2026.
- La forma di un orbitale dipende dal sottolivello (s, p, d, f), non dall'elemento: quello che cambia da un elemento all'altro è quali orbitali sono occupati. Quindi serve un solo visualizzatore, usato in due posti: la lezione sulla struttura elettronica, dove sta la spiegazione, e la scheda dell'elemento, dove un clic su `3d` nella configurazione apre la forma di quell'orbitale.
- Nella scheda la cosa che la scuola chiede davvero è il diagramma a caselle con le frecce (regola di Hund), che si ricava dalla configurazione già nei dati e costa poco.
- Le immagini e il testo dei video sono protetti e non si riusano. Alessandro, 1° ottobre 2026: l'intenzione è capire come sono fatte le grafiche e l'algoritmo, per ricrearli. Le forme sono matematica (le funzioni d'onda dell'atomo di idrogeno), quindi si ridisegnano da zero con lo stile di Sapiens.
- La spiegazione va scritta come una lezione e riletta da Andrea; la configurazione elettronica è nel terzo anno di chimica, che non è ancora scritto.
- Tecnica: nuvola di punti o superficie in three.js, caricata solo a richiesta. Il kit delle figure interattive oggi è in SVG a due dimensioni: da decidere se gli orbitali entrano nel kit o stanno a parte, con il motore dei laboratori.

## Cosa c'è nei due video
Analisi di Claude del 1° ottobre 2026, su richiesta di Alessandro: trascrizione automatica dei sottotitoli e fotogrammi presi a intervalli regolari. I file scaricati sono rimasti fuori dalla repo. Qui c'è solo la descrizione, con parole nostre.

**FloatHeadPhysics, "We finally understood orbital shapes intuitively!" (30 gennaio 2025, 33 minuti).** È una spiegazione, e l'ordine degli argomenti è il suo valore.
1. Perché il modello planetario non regge: una carica che gira irradia e cadrebbe sul nucleo, e non spiega le righe dello spettro (minuti 1-2).
2. L'elettrone come onda: il quadrato dell'ampiezza è la probabilità di trovarlo lì (2-3).
3. La corda fissata agli estremi: un'onda confinata ammette solo certe frequenze. Ogni stato più alto ha un nodo in più, e un nodo in più vuol dire elettrone più confinato, quindi più energia (3-6).
4. Lo stato fondamentale costruito a puntini: la corda diventa il raggio, dal nucleo all'infinito; per ogni raggio si mette un anello di puntini, pochi vicino al nucleo, un massimo, poi sempre meno. Un contatore mostra quanti puntini ha ogni anello (6-9).
5. Perché il centro sembra luminoso anche se lì la probabilità è bassa: conta il numero di puntini a un dato raggio, non quanto sono fitti (9-10).
6. Che cos'è un orbitale: una mappa di probabilità. L'esempio è un bambino fotografato ogni giorno alle 14: dopo molte foto si vede dove sta di solito, senza sapere che strada fa (10-12).
7. Il primo stato eccitato ha un nodo, ed è una sfera vuota tra due gusci: nodo radiale (13-16).
8. Un nodo può anche essere un piano che taglia la nuvola a metà: nodo angolare. Ne esce la forma a due lobi dell'orbitale p, e i tagli possibili sono tre, uno per asse (16-20).
9. Con due nodi: due radiali, uno radiale e uno angolare (un p con un guscio in più), due angolari (due piani, quattro lobi: l'orbitale d). Perché i d siano cinque non si ricava a intuito, e lo dice (20-24).
10. I numeri quantici letti sui nodi: n è il livello di energia (n − 1 nodi in tutto), l è il numero di nodi angolari e dà la forma, m è l'orientazione, da −l a +l. Per m usa una sfera che ruota con le linee dei nodi all'equatore o da polo a polo (24-30).
11. Lo spettro dell'idrogeno e lo spin, per il principio di Pauli (30-32).

Le grafiche sono semplici: fondo nero, puntini gialli in due dimensioni, la curva dell'onda radiale sotto, una scala dell'energia con le miniature degli orbitali raggruppate per tipo di nodo, una tabella dei numeri quantici che si riempie.

**minutephysics, "A Better Way To Picture Atoms" (19 maggio 2021, 5 minuti e mezzo).** Qui il valore è l'immagine. Ogni orbitale dell'idrogeno è una nuvola di decine di migliaia di palline in tre dimensioni, su fondo chiaro, con luce e ombre. La densità delle palline è la probabilità. Le palline si muovono: girano attorno a un asse, più veloci vicino all'asse. Il video dice da dove viene il moto: è la formulazione di de Broglie e Bohm, in cui la funzione d'onda è come acqua e la particella un granello portato dalla corrente; sullo schermo compare la formula della velocità, $\vec v = \frac{\hbar}{2mi}\frac{\psi^*\nabla\psi - \psi\nabla\psi^*}{\psi^*\psi}$, cioè la corrente di probabilità divisa per la densità. Altri dettagli visti nei fotogrammi: l'etichetta "hydrogen n=5, l=2, m=1" in un angolo; uno spicchio tolto dalla nuvola per vedere i gusci interni; il colore che cambia con n (verde acqua, verde, giallo-verde, arancio); quattro orbitali in fila dal più piccolo al più grande, per dire che più energia vuol dire più lontano dal nucleo; i tre orbitali p affiancati con m = −1, 0, +1, dove quello con m = 0 è fermo. In coda dice che nelle figure "a ciambella arcobaleno" il colore è la fase, che lui rende con il moto.

## Come si ridisegna
Proposta di Claude, 1° ottobre 2026. Niente viene preso dai video: le forme sono le funzioni d'onda dell'atomo di idrogeno, che sono nei libri di chimica fisica.

1. La funzione d'onda è $\psi_{nlm} = R_{nl}(r)\,Y_{lm}(\theta, \varphi)$: una parte radiale (polinomi di Laguerre per un esponenziale) e un'armonica sferica. Per n fino a 4 o 5 si scrivono in poche righe di codice.
2. I puntini si estraggono in modo esatto, senza tentativi a vuoto, perché la probabilità si separa in tre fattori: il raggio dalla distribuzione $r^2 R_{nl}^2$, l'angolo $\theta$ da $\Theta_{lm}^2 \sin\theta$, l'angolo $\varphi$ uniforme per gli orbitali con m definito, oppure da $\cos^2(m\varphi)$ o $\sin^2(m\varphi)$ per gli orbitali reali dei libri ($p_x$, $d_{xy}$). Per raggio e $\theta$ basta una tabella della funzione cumulativa. Trentamila puntini si estraggono in pochi millisecondi.
3. Il moto di minutephysics è semplice per questi stati: la velocità è solo attorno all'asse z, e la velocità angolare di un puntino vale $\omega = \frac{\hbar\, m}{m_e\, \rho^2}$, con $\rho$ la distanza dall'asse. Ogni puntino gira su un cerchio, più svelto vicino all'asse, nel verso dato dal segno di m; con m = 0 sta fermo. La nuvola nel suo insieme non cambia. Vicino all'asse la velocità va limitata, o i puntini schizzano.
4. Gli orbitali reali della scuola ($p_x$, $p_y$, $d_{xy}$) sono somme di m e −m: lì la corrente è zero e i puntini stanno fermi. Quindi il componente ha due modi che dicono cose diverse: le forme dei libri, ferme, con i due segni della funzione d'onda in due colori; gli stati con m definito, che girano.
5. Il disegno: una nuvola di punti in WebGL (three.js è già nella repo per i laboratori), con puntini tondi, più piccoli e più chiari se lontani, la nuvola che si ruota trascinando, e uno spicchio che si può togliere per vedere i gusci e i nodi. Sul quaderno a quadretti e con i colori di Sapiens, non con il fondo da studio fotografico del video. Per le lezioni basta anche una versione a due dimensioni, come FloatHeadPhysics, che è una sezione della stessa nuvola.
6. I controlli: n, l e m con i loro vincoli (l da 0 a n − 1, m da −l a +l), i nodi radiali e angolari che si accendono, il confronto di grandezza tra livelli.

Limiti da dire nella pagina: sono gli orbitali dell'idrogeno. Negli altri atomi la forma angolare resta quella, le dimensioni cambiano, e l'orbitale è un'approssimazione.

Per la lezione il percorso di FloatHeadPhysics (corda, nodi, puntini per raggio, taglio con un piano) si presta a figure interattive nostre: il cursore del raggio con il conteggio dei puntini, il piano che taglia la sfera. Il testo si scrive da capo e lo rilegge Andrea.

## Stato del prototipo
Scritto il 1° ottobre 2026. Vedi [[2026-10-01 Gli orbitali hanno una lezione dedicata e un visualizzatore in tre dimensioni]].

- Dal 1° ottobre 2026 è uno strumento: `/strumenti/orbitali-atomici` (`src/app/(site)/strumenti/orbitali-atomici/page.tsx`, pagina in `src/components/orbitali/OrbitalPage.tsx`), con la carta nell'indice degli strumenti sotto Chimica, la riga nella sitemap e il link alla lezione. Alessandro ha scelto di spostarlo subito tra gli strumenti e di non tenerlo come prototipo nascosto a `/prova-orbitali`. L'articolo sotto la figura è `src/content/strumenti/orbitali-atomici.md`.
- La matematica è in `src/lib/orbitali/idrogeno.ts`: parte radiale, funzioni di Legendre, estrazione esatta dei puntini dalle tre distribuzioni, segno della funzione d'onda, velocità del flusso, superfici dei nodi (sfere, coni, piani), sezione della nuvola con un piano. Otto test (`tests/unit/orbitali-idrogeno.test.mjs`) controllano il numero dei nodi, che il raggio medio di ogni nuvola sia $[3n^2 - l(l+1)]/2$ raggi di Bohr entro il 3 per cento, che $p_x$, $p_y$, $p_z$, $d_{xy}$ e $d_{z^2}$ puntino dove dicono i libri con i segni giusti, che i nodi siano dove devono (la sfera del 2s a 2 raggi di Bohr, i coni del $d_{z^2}$ a 54,7° dall'asse), che una sezione sia vuota quando il piano è un nodo.
- I componenti sono in `src/components/orbitali/`: `OrbitalViewer` (i controlli), `OrbitalCloud` (la nuvola in tre dimensioni, con three.js caricato solo qui), `OrbitalSection` (la sezione, su un canvas a due dimensioni, senza three.js).
- La nuvola: 36 000 puntini disegnati come palline illuminate; i puntini lontani sfumano verso il colore della pagina. Si sceglie n da 1 a 7, l e m con i loro vincoli. "Dei libri" mostra l'orbitale reale, fermo, con i due segni in rosso e blu; "In moto" mostra lo stato con m definito, con i puntini che girano attorno all'asse (il moto è calcolato nella scheda grafica). C'è lo spicchio da togliere, la pausa, la rotazione trascinando o con le frecce, il tema scuro.
- I nodi (1° ottobre, secondo giro): "Mostra i nodi" disegna le sfere, i coni e i piani dove la funzione d'onda è zero, come superfici pallide con il bordo; una riga dice quali sono ("1 sfera, il piano orizzontale").
- La scala (1° ottobre, secondo giro): una barra in picometri in basso a destra. Con "Stessa scala per tutti i livelli" il riquadro è quello del livello 6 e il tempo è lo stesso per tutti: un 2p diventa piccolo e gira svelto, un 6h riempie il riquadro e gira pianissimo.
- Il taglio (1° ottobre, terzo giro, chiesto da Alessandro): quello che si toglie per guardare dentro segue la simmetria dell'orbitale. Un orbitale s perde un ottavo; un orbitale uguale tutto attorno all'asse (m = 0, o in moto) perde uno spicchio di un quarto di giro; un orbitale reale con i lobi attorno all'asse si taglia a metà lungo il piano verticale che passa per un lobo. La regola è `cutFor` in `idrogeno.ts`, con un test.
- I colori (1° ottobre, deciso da Alessandro dopo una prova con sei tinte): bastano due colori, purché due gusci o due lobi vicini non abbiano lo stesso. Negli orbitali dei libri sono rosso e blu, i due segni della funzione d'onda, che cambia segno a ogni nodo. Negli stati in moto, che non hanno un segno, sono un'altra coppia (blu e arancio) che si alterna attraverso le sfere e i coni dei nodi: prima erano tutti di un colore e con n alto i gusci non si distinguevano. L'etichetta del taglio è generica: "Seziona la nuvola per vedere dentro".
- Le orientazioni hanno lo stesso ordine nel selettore e nella tabella (x, y, z; xy, xz, yz, x²−y², z²): `orientationOrder` in `idrogeno.ts`.
- La tabella dei sottolivelli (1° ottobre, proposta da un amico di Alessandro): sotto la figura c'è lo schema a caselle della configurazione elettronica, da 1s a 7p, con una casella per orbitale (una per s, tre per p, cinque per d, sette per f) nei colori dei blocchi della tavola periodica. Ogni casella è un bottone che mostra quell'orbitale: un selettore che studenti e docenti conoscono già. Per arrivare al 7s e al 7p i livelli sono passati da sei a sette. Il componente è `src/components/orbitali/OrbitalGrid.tsx`; da tastiera è un solo punto di tabulazione e le frecce passano da una casella all'altra. I selettori di n, l e m restano, e servono per gli orbitali che la tabella non ha (5g, 6f e simili).
- La configurazione nella tabella (1° ottobre, proposta di Claude accettata da Alessandro): scelto un elemento dal menu, o scorrendo con più e meno, le caselle si riempiono con i suoi elettroni come frecce, secondo la regola di Hund, e ogni sottolivello mostra il suo numero di elettroni. Sotto si leggono la configurazione, gli elettroni spaiati e, per le eccezioni come cromo e rame, che cosa darebbe la regola della diagonale. "Ordine di riempimento" mostra il disegno della regola della diagonale, con i sottolivelli occupati in evidenza. Le configurazioni sono quelle dei dati della tavola periodica. La logica è in `src/lib/orbitali/configurazione.ts` (quattro test: l'ordine dei libri, gli elettroni di ogni elemento che sommano a Z, le eccezioni note, la regola di Hund), il disegno in `FillingOrder.tsx`.
- La sezione (1° ottobre, secondo giro): 14 000 puntini nel piano xz, yz o xy, con i nodi come linee tratteggiate. Nel piano xy i puntini di uno stato in moto girano; nei piani verticali stanno fermi. Se il piano è un nodo la figura lo dice.
- Controlli fatti: `tsc`, ESLint, i test, la pagina guardata in un browser senza scheda grafica (25 fotogrammi al secondo con il disegno via software, da misurare su un computer e su un telefono veri).

Non fatto: una prova su telefono e su un computer con la scheda grafica.

## La lezione
Scritta il 1° ottobre 2026, non pubblicata: `docs/lezioni/chimica/riscritte/52-chim-orbitali-numeri-quantici.md`, con formulario, 20 flashcard, note e il generatore di esercizi `chim-orbitali-numeri-quantici` (cinque livelli, PASS su 3000 esercizi per livello). Sta nel programma, al posto di "Orbitali e numeri quantici" del terzo anno, e non come approfondimento separato: l'albero aveva già quella lezione.

Il componente si aggancia ai paragrafi con i parametri fissati (richiesta di Alessandro): `src/components/orbitali/OrbitalFigure.tsx` prende un elenco di orbitali tra cui scegliere, la vista (nuvola o sezione), il piano, i nodi e il taglio accesi, spenti o a scelta, e la scala comune. Le otto figure della lezione sono in `src/components/content/interactive/chimica/orbitali.tsx` e sono registrate con i loro nomi in `src/lib/utils/interactive.ts`; l'ultima è il visualizzatore completo, che nella lezione tiene le scelte per sé e non le scrive nell'indirizzo. Una figura TikZ mostra la corda con i nodi.

Per pubblicare: prima il codice in produzione (le figure), poi `publish.mts --dir docs/lezioni/chimica --per-slug --apply`. Restano da fare, se servono, le figure dei puntini contati per raggio e del piano che taglia la sfera, che la lezione oggi sostituisce con le sezioni.

## Domande che la lezione deve sciogliere
- Alessandro, 1° ottobre 2026: come fa l'idrogeno ad avere tutti questi orbitali, se ha un solo elettrone? Un orbitale è uno stato in cui l'elettrone può stare, non una cosa che l'atomo possiede. L'unico elettrone dell'idrogeno di solito sta nell'1s; se assorbe energia passa a uno degli altri (stati eccitati) e tornando indietro emette luce: sono le righe dello spettro. La domanda viene spontanea guardando il visualizzatore, quindi la lezione la deve affrontare presto.

- Alessandro, 1° ottobre 2026: se la densità dei puntini è la probabilità di trovare l'elettrone, che cosa rappresenta la velocità? È il flusso della probabilità (la corrente di probabilità divisa per la densità). In uno stato con m definito la nuvola non cambia ma la probabilità circola attorno all'asse z, e questa circolazione è il momento angolare dell'elettrone attorno all'asse, $m\hbar$: ogni puntino ne porta la stessa quantità, quindi la velocità è inversamente proporzionale alla distanza dall'asse. Una carica che circola è una corrente e si comporta da calamita, da cui il nome di numero quantico magnetico. Non è la velocità che si misurerebbe sull'elettrone (nell'1s i puntini sono fermi e l'energia cinetica non è zero), e solo nella lettura di de Broglie e Bohm è la sua velocità vera. Gli orbitali dei libri sono fermi perché sommano m e −m. Scritto sulla pagina del prototipo nella sezione "Che cosa dice la velocità"; va nella lezione.

## Da decidere
- Oltre alla lezione dedicata, se il componente va anche nella scheda della tavola periodica (un clic su `3d` nella configurazione). Ora che la tabella dei sottolivelli mostra la configurazione di un elemento, il collegamento più semplice è un link dalla scheda a `/strumenti/orbitali-atomici?el=Fe`. Alessandro, 1° ottobre: si decide dopo aver visto il prototipo.
- Dove sta la lezione nell'albero di chimica, e se è nel programma o di approfondimento.

## Collegamenti
- [[Tavola periodica interattiva]], [[Lezioni]], [[Grafici e simulazioni interattive]], [[Foto e modelli 3D degli elementi]]
