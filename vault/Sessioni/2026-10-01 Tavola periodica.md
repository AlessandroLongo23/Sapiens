---
data: 2026-10-01
tag: [sessione, strumenti, chimica, seo]
---
# Tavola periodica

## Di cosa si è parlato
Alessandro ha fatto notare che manca uno strumento fondamentale per la ricerca organica, la tavola periodica degli elementi, e ha chiesto se aggiungerla tra gli strumenti o da un'altra parte. L'idea era già nel vault dal 28 settembre, ferma come progetto a parte.

Claude ha risposto che il posto giusto sono gli strumenti, con una pagina sua: l'intento di ricerca è da strumento, la sezione ha già 7 pagine di chimica, ma lo scheletro dei calcolatori (input, risultato, passaggi) non le serve. Ha portato tre obiezioni. Oggi la tavola non porta traffico, perché il sito non è indicizzato e il dominio non è scelto. La ricerca secca "tavola periodica" non si prende per mesi con un dominio nuovo, mentre quelle lunghe (da stampare in PDF, con i numeri di ossidazione) sono raggiungibili. Il lavoro vero è la griglia sul telefono, 18 colonne in 390 px.

Alessandro ha scelto: tra gli strumenti con una pagina sua; niente pagine per elemento per ora; una prima versione ampia come Ptable, contro il consiglio di Claude che era la versione base con la stampa; subito, in una sessione.

## Decisioni
- [[2026-10-01 La tavola periodica sta tra gli strumenti, con una pagina sua]]
- [[2026-10-01 La tavola periodica non ha pagine per elemento, per ora]]
- [[2026-10-01 La prima tavola periodica è ampia come Ptable e si fa subito]]
- [[2026-10-01 La tavola periodica si disegna prima da computer, con la scheda accanto alla griglia]]
- [[2026-10-01 Nella scheda degli elementi vanno le foto, i modelli 3D restano per dopo]]
- [[2026-10-01 Gli orbitali hanno una lezione dedicata e un visualizzatore in tre dimensioni]]

## Informazioni nuove
- Ricerca web del 1° ottobre 2026 (Claude, dagli Stati Uniti, ordine su google.it da verificare). Per "tavola periodica degli elementi interattiva": Zanichelli, Wikipedia, dsapp.it, chemgenius.it, ciroagizza.it, Ptable. Per "tavola periodica da stampare pdf": chimica-online.it, YouMath, periodni.com, testbuddy.it, laforgia.xyz.
- chemgenius.it tiene la sua tavola sotto `/strumenti/tavola-periodica/`, lo stesso indirizzo scelto qui.
- YouMath offre la tavola da stampare in quattro versioni: immagine, bianco e nero, PDF e vuota.
- Nel codice i 118 elementi hanno già nome italiano, simbolo e massa (`src/lib/tools/chimica.ts`, IUPAC CIAAW 2021). Tutti gli altri dati mancano.
- L'idea è diventata una nota di prodotto: [[Tavola periodica interattiva]].

## Secondo giro
Alessandro ha detto di pensare per adesso alla pagina da computer, e ha chiesto se i dati, essendo scientifici, non siano pubblici. Claude: sì, i singoli valori sono fatti; il limite è non copiare l'archivio o i testi di un altro sito. PubChem dà in un file JSON 17 grandezze per i 118 elementi, senza restrizioni d'uso da parte di NCBI; mancano solo gli isotopi. Il nodo che resta è la correttezza dei valori, perché le fonti non coincidono. Il dettaglio è in [[Tavola periodica interattiva]].

## Cosa si è costruito
Alessandro ha scelto la scheda nello spazio vuoto in alto con il pannello a lato, la griglia che scorre sul telefono, e di partire subito su un branch. Sul branch `tavola-periodica` Claude ha scritto, senza committare:
- l'archivio degli elementi (`src/lib/tools/elementi.json`, fatto da `scripts/tavola-periodica/build.mjs`) e la sua logica, con 9 test;
- la pagina `/strumenti/tavola-periodica` con le quattro viste, l'anteprima, la scheda, la tastiera, il tema scuro;
- il foglio A4 da stampare e i due PDF in `public/tavola-periodica/`;
- l'articolo sotto la tavola, l'elenco degli elementi, la carta nell'indice degli strumenti, la riga nella sitemap;
- la sezione "La tavola periodica" in `docs/strumenti.md` e le domande in [[Domande per Andrea]].

Passano `tsc` e i 476 test unitari; `npm run build` è passato sulla prima versione e non è stato rilanciato dopo le correzioni; la suite Playwright non è stata lanciata. ESLint segnala un solo avviso, in un generatore che questa sessione non ha toccato (`funzioni-iniettive-suriettive-biettive.ts`, riga 795). Il dettaglio è in "Stato attuale" di [[Tavola periodica interattiva]].

Scoperte durante il lavoro:
- il raggio di PubChem è quello di van der Waals, che non scende lungo il periodo come nei libri: la tavola usa il raggio covalente, da una tabella di Wikipedia con fonte da verificare;
- PubChem scrive alcuni numeri di ossidazione senza il segno più: lo script lo aggiunge;
- per 25 elementi manca il punto di fusione o di ebollizione, e lì lo stato a una temperatura non si può dire;
- i punti di fusione di elio, carbonio e arsenico in PubChem sono sotto pressione: a 1 atm l'elio non solidifica e gli altri due sublimano;
- i PDF portano il nome "Sapiens": vanno rifatti se il nome cambia.

## Critica e correzioni
Alessandro ha guardato la pagina sul suo server e ha chiesto tre cose: le caselle sul bordo non devono essere tagliate quando si ingrandiscono sotto il mouse, la scheda deve aprirsi e chiudersi con un'animazione, e un paio di giri con un agente critico. Poi ha chiesto i numeri di ossidazione su una riga loro nell'anteprima.

Il primo giro ha trovato, tra l'altro: il PDF in bianco e nero che usciva a colori, i nomi dell'elenco che non aprivano la scheda, Safari che bloccava la pagina muovendo il cursore della temperatura, la scheda che a 1024 px copriva cinque gruppi, 30 elementi nel blocco f, le configurazioni in due ordini, gli anni di scoperta e le affinità elettroniche di PubChem sbagliati. Il secondo giro ha confermato le correzioni e ha trovato il cursore bloccato da tastiera vicino allo zero assoluto, la scheda fuori schermo sotto i 1280 px, uno spazio vuoto dopo la chiusura, le frecce che saltavano i lantanidi, la scala dell'energia di ionizzazione appiattita dall'elio. Tutto corretto; quello che resta è in "Stato attuale" di [[Tavola periodica interattiva]], alla voce dei difetti noti.

Affinità elettronica e anno di scoperta sono stati tolti: la fonte non regge. I buchi nei numeri di ossidazione di PubChem sono in [[Domande per Andrea]].

## Idee nuove
Alessandro ha proposto una foto e un modello 3D per ogni elemento, e la forma degli orbitali con due video come riferimento. Registrate senza decidere: [[Foto e modelli 3D degli elementi]] e [[Orbitali atomici interattivi]], con la valutazione di Claude.

## Foto e video sugli orbitali
Alessandro ha deciso: per adesso foto, i modelli 3D restano un progetto futuro ([[2026-10-01 Nella scheda degli elementi vanno le foto, i modelli 3D restano per dopo]]). Le foto sono nella scheda: 96 elementi, da Wikimedia Commons, con i crediti.

Sui due video ha chiarito che l'intenzione era estrarre fotogrammi e trascrizione per capire come ricreare le grafiche e l'algoritmo. Fatto: l'analisi e la proposta su come ridisegnare gli orbitali sono in [[Orbitali atomici interattivi]]. In breve, i puntini si estraggono in modo esatto dalla funzione d'onda dell'idrogeno e, negli stati con m definito, girano attorno all'asse con velocità angolare proporzionale a m e inversa al quadrato della distanza dall'asse. Dove mettere il componente (lezioni, tavola, o tutti e due) si decide quando c'è.

## Prototipo degli orbitali
Alessandro ha deciso di partire dal prototipo e, in ogni caso, di fare una lezione specifica che spieghi tutto il percorso dei due video ([[2026-10-01 Gli orbitali hanno una lezione dedicata e un visualizzatore in tre dimensioni]]). Il prototipo è scritto: `/strumenti/orbitali-atomici`, con la matematica in `src/lib/orbitali/idrogeno.ts` e sei test. Lo stato è in [[Orbitali atomici interattivi]].

## La lezione sugli orbitali
Dopo altri giri sul visualizzatore (nodi, scala comune, sezione a due dimensioni, taglio che segue la simmetria, due colori che si alternano, la spiegazione di che cosa rappresenta la velocità), Alessandro ha chiesto di scrivere la lezione, con il componente agganciato ai paragrafi a parametri fissati. Scritta: "Orbitali e numeri quantici", al suo posto nel programma del terzo anno, con otto figure, formulario, flashcard, note ed esercizi. Non pubblicata. Stato e passi per pubblicarla in [[Orbitali atomici interattivi]]; le domande sui contenuti in [[Domande per Andrea]].

Durante il lavoro è stato corretto un difetto di `ToggleGroup` (il riquadro non si riposizionava quando cambiava il numero di opzioni), che vale per tutti i selettori del sito.

## Ultimi giri prima della pubblicazione
Su proposta di un amico di Alessandro il visualizzatore ha avuto la tabella dei sottolivelli a caselle, come selettore; poi le frecce degli elettroni di un elemento e la regola della diagonale. Le orientazioni hanno lo stesso ordine nel selettore e nella tabella. Alessandro ha scelto di spostare il visualizzatore tra gli strumenti, a `/strumenti/orbitali-atomici`, e di pubblicare: commit, merge su master, push, e la lezione nel database a deploy finito. La pagina di anteprima `/prova-lezione`, fatta per leggere la lezione prima della pubblicazione, è stata tolta: portava nel pacchetto di produzione 18.786 file di `docs/lezioni`.

## Rimasto aperto
- La versione per telefono.
- Il montaggio nelle lezioni di chimica, e che fine fanno le due figure statiche della lezione 43.
- La fonte dei raggi covalenti.
- Le scelte sui contenuti, in [[Domande per Andrea]].
- Un solo archivio degli elementi anche per il laboratorio, e la versione vuota da stampare: proposte di Claude, non discusse. Per ora un test tiene allineati la tavola e lo strumento della massa molare.
- Commit, PR e pubblicazione, quando Alessandro lo chiede.

## Prossimo argomento
Alessandro guarda la tavola e il prototipo degli orbitali sul branch e decide se pubblicarli; poi la versione per telefono della tavola e il montaggio nelle lezioni (punto 14 dell'[[Agenda]]), e la lezione sugli orbitali (punto 15). Nella coda generale resta primo il legale e fiscale.
