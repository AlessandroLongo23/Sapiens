---
stato: in sviluppo
release: da decidere
aggiornato: 2026-10-01
tag: [prodotto, studenti, strumenti, chimica, seo]
---
# Tavola periodica interattiva

Una tavola periodica gratuita sotto `/strumenti`, con la scheda di ogni elemento, le viste sugli andamenti periodici e la versione da stampare, usata anche dentro le lezioni di chimica.

## Stato attuale
Scritta il 1° ottobre 2026 sul branch `tavola-periodica`, non committata e non pubblicata.

La pagina è `/strumenti/tavola-periodica` (`src/app/(site)/strumenti/tavola-periodica/page.tsx`, componenti in `src/components/tools/periodic/`). Nel registro degli strumenti ha `ownPage: true`: ha la carta nell'indice sotto Chimica e la riga nella sitemap, ma non passa dalla pagina dei calcolatori.

- La griglia: 18 colonne, i sette periodi, lantanidi e attinidi sotto, con i numeri dei gruppi e dei periodi. Ogni casella ha numero atomico, simbolo, nome e massa.
- Quattro viste, scelte con un selettore sopra la tavola: famiglie (dieci colori, con la legenda che evidenzia una famiglia), stato fisico (cursore da −273 a 6000 °C su una scala non lineare, sei temperature da provare, un campo per il valore esatto, il conteggio di solidi, liquidi e gas; l'elio non solidifica mai, carbonio e arsenico sublimano), andamenti (raggio covalente, elettronegatività, energia di ionizzazione, con una frase su come varia; il colore segue l'ordine dei valori, non la loro grandezza, perché l'elio schiaccerebbe tutti gli altri), blocchi (lantanio e attinio nel blocco d, 14 elementi per riga nel blocco f).
- Passando il mouse l'elemento compare in grande nello spazio sopra i metalli di transizione, con quello che dice la vista, la configurazione, la massa e i numeri di ossidazione su righe separate. Un clic apre la scheda, che si allarga con un'animazione: a destra della griglia da 1280 px in su, sotto la griglia negli schermi più stretti. Nella scheda: una foto dell'elemento per 96 elementi su 118, da Wikimedia Commons, con autore e licenza sotto (vedi [[2026-10-01 Nella scheda degli elementi vanno le foto, i modelli 3D restano per dopo]]); poi posizione, configurazione (nell'ordine di riempimento, `[Ar] 4s² 3d⁶`), numeri di ossidazione (segnati come previsti dal rutherfordio in poi), le tre proprietà periodiche, stato a 25 °C, punti di fusione e di ebollizione o di sublimazione, densità, isotopi in natura con l'abbondanza.
- Vista, proprietà, temperatura ed elemento stanno nell'indirizzo (`?vista=stato&t=1538&elemento=Fe`); il canonical è la pagina senza parametri.
- Da tastiera la tavola è un solo punto di tabulazione, le frecce passano da un elemento all'altro (dal bario al lantanio, dal lutezio all'afnio), Esc chiude la scheda e il fuoco torna alla casella. Ogni casella dice a un lettore di schermo anche quello che mostra la vista.
- Tema chiaro e scuro. Sul telefono la griglia scorre di lato e la scheda sta sotto.
- Sotto la tavola: i due PDF da scaricare, i link alle lezioni "La tavola periodica di Mendeleev" e "Numero atomico, numero di massa e isotopi" con i loro esercizi, un articolo breve (`src/content/strumenti/tavola-periodica.md`), l'elenco di tutti gli elementi in una tabella, dove un clic sul nome apre la scheda nella tavola.
- Il foglio da stampare: A4 orizzontale, a colori e in bianco e nero, con numero atomico, elettronegatività, simbolo, nome, massa e numeri di ossidazione per casella (non quelli previsti dal rutherfordio in poi), e i numeri dei gruppi e dei periodi. Le pagine sono `/strumenti/tavola-periodica/stampa/colori` e `/bianco-nero` (non indicizzate), i PDF sono in `public/tavola-periodica/` e li rifà `scripts/tavola-periodica/pdf.mjs`. In alto a destra portano il nome "Sapiens": vanno rifatti se il nome cambia.

I dati sono in `src/lib/tools/elementi.json`, scritto da `scripts/tavola-periodica/build.mjs`: nomi e masse da `chimica.ts`, il resto da PubChem, gli isotopi dal NIST, i raggi covalenti da una tabella di Wikipedia. Lo script riordina le configurazioni, mette il segno ai numeri di ossidazione e assegna i blocchi. Le foto le scarica `scripts/tavola-periodica/foto.mjs`, che scrive anche i crediti in `src/lib/tools/elementi-foto.json`. Nove test (`tests/unit/tools-tavola-periodica.test.mjs`) controllano tra l'altro che nomi e masse coincidano con lo strumento della massa molare, che gli elettroni di ogni configurazione sommino al numero atomico, che a 25 °C i liquidi siano solo bromo e mercurio. Come si lavora sui file: `docs/strumenti.md`, sezione "La tavola periodica".

Controlli fatti il 1° ottobre: `tsc`, ESLint sui file nuovi, 476 test unitari, la pagina guardata nel browser a 1440, 1280 e 1024 px (chiaro e scuro) e a 390 px, senza errori in console; `npm run build` è passato sulla prima versione e non è stato rilanciato dopo le correzioni, perché era acceso il server di sviluppo di Alessandro. La suite Playwright non è stata lanciata. Due giri di un agente critico hanno trovato e fatto correggere, tra l'altro: il PDF in bianco e nero che usciva a colori, i link dell'elenco che non aprivano la scheda, Safari che bloccava la pagina muovendo il cursore (la scrittura dell'indirizzo in `useToolState` ora aspetta 250 ms, per tutti gli strumenti), la scheda fuori schermo sotto i 1280 px, il blocco f con 30 elementi, le configurazioni in due ordini diversi.

Tolti perché la fonte non è affidabile: l'affinità elettronica (PubChem dà 322 kJ/mol per il fluoro contro i 328 accettati, e nessun valore dove l'anione non è stabile) e l'anno di scoperta (alluminio e calcio risultano "antichi").

Difetti noti: un indirizzo condiviso con la vista o l'elemento si apre prima sulla vista delle famiglie e poi salta a quella giusta, perché la pagina è statica e legge l'indirizzo nel browser (vale per tutti gli strumenti); a 1280 px con la scheda aperta le caselle perdono il nome; a 1440 × 900 il periodo 7 e le due serie restano sotto la piega; i numeri di ossidazione di PubChem hanno buchi che un insegnante noterebbe (vedi [[Domande per Andrea]]).

Non fatto: un test Playwright della pagina; la versione per telefono; il montaggio dentro le lezioni di chimica (il componente è pronto, ma le lezioni pubblicate non sono state toccate); la versione vuota da compilare tra quelle da stampare. La pagina pesa circa 1 MB di HTML, di cui 750 KB sono il payload di React, come le altre pagine del sito (vedi [[SEO]]).

## Obiettivo
Deciso il 1° ottobre 2026 (vedi [[2026-10-01 Tavola periodica]]).

- Sta all'indirizzo `/strumenti/tavola-periodica`, con una carta nell'indice degli strumenti sotto Chimica, ma con una pagina sua: lo scheletro dei calcolatori (input, risultato, passaggi) non le serve. Vedi [[2026-10-01 La tavola periodica sta tra gli strumenti, con una pagina sua]].
- Lo stesso componente si monta nelle lezioni di chimica.
- La scheda di un elemento si apre dentro la tavola. Non ci sono pagine indicizzate per elemento: l'elemento sta nell'indirizzo come parametro e il canonical resta la tavola. Vedi [[2026-10-01 La tavola periodica non ha pagine per elemento, per ora]].
- La prima versione è ampia come Ptable: griglia, scheda (numero atomico, massa, configurazione elettronica, elettronegatività, numeri di ossidazione, famiglia, stato), colori per famiglia, andamenti periodici colorati (raggio atomico, elettronegatività, energia di ionizzazione), cursore della temperatura per lo stato fisico, blocchi s, p, d, f, isotopi, e il PDF da stampare a colori e in bianco e nero. Vedi [[2026-10-01 La prima tavola periodica è ampia come Ptable e si fa subito]].
- Si fa subito, in una sessione, senza aspettare il dominio.
- Si disegna prima da computer: l'elemento sotto il mouse compare nello spazio vuoto in alto, la scheda si apre accanto alla griglia; sul telefono, per ora, la stessa griglia scorre di lato. Vedi [[2026-10-01 La tavola periodica si disegna prima da computer, con la scheda accanto alla griglia]].

## Dettagli
L'idea è di Alessandro, 28 settembre 2026: una tavola periodica interattiva fatta bene, come progetto a parte rispetto agli altri strumenti, perché tantissimi studenti la cercano e spesso è difficile trovarne una buona, e perché nelle lezioni di chimica prima o poi va messa comunque.

Ricerche. Dalla verifica del 28 settembre 2026 (Claude, con un motore di ricerca interrogato in italiano, non google.it, volumi da verificare con Keyword Planner) è la ricerca con il volume più alto tra i candidati strumenti. Verifica del 1° ottobre 2026 (Claude, ricerca web dagli Stati Uniti, ordine su google.it da verificare): per "tavola periodica degli elementi interattiva" escono Zanichelli (due pagine di `online.scuola.zanichelli.it`), Wikipedia, dsapp.it, chemgenius.it (sotto `/strumenti/tavola-periodica/`), ciroagizza.it e Ptable; per "tavola periodica da stampare pdf" escono chimica-online.it (anche in bianco e nero), YouMath (immagine, bianco e nero, PDF e vuota), periodni.com, testbuddy.it e laforgia.xyz. L'intento è da strumento in tutti e due i casi. Un dominio nuovo non prende la ricerca secca "tavola periodica" per mesi: le ricerche raggiungibili sono quelle lunghe (da stampare, con i numeri di ossidazione, con l'elettronegatività).

Traffico. Il sito non è indicizzato e il dominio non è scelto (vedi [[SEO]]): fino ad allora la tavola serve alle lezioni e a chi è già sul sito.

Dati. Alessandro, 1° ottobre 2026: sono dati scientifici, quindi pubblici. Claude concorda sul principio, con due limiti (non è un parere legale): i singoli valori sono fatti e non hanno diritto d'autore, ma nell'UE la direttiva 96/9/CE protegge chi ha costituito una banca dati dall'estrazione di una parte sostanziale, e restano protetti testi descrittivi, immagini e grafica. Quindi i valori si prendono da fonti primarie o pubbliche e non si copia l'archivio di un altro sito (Ptable, Zanichelli). Verifica del 1° ottobre 2026: PubChem espone la sua tavola come JSON (`pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON`), 118 elementi con 17 colonne: numero atomico, simbolo, nome inglese, massa, colore CPK, configurazione elettronica, elettronegatività, raggio atomico, energia di ionizzazione, affinità elettronica, stati di ossidazione, stato standard, punti di fusione e di ebollizione in kelvin, densità, famiglia, anno di scoperta. La pagina delle regole di NCBI (letta il 1° ottobre 2026) dice che NCBI non mette restrizioni all'uso e alla distribuzione dei dati, salvo i diritti di chi li ha depositati. Mancano gli isotopi, presi dal NIST (Atomic Weights and Isotopic Compositions, letto il 1° ottobre 2026). Il raggio di PubChem è quello di van der Waals, che non mostra l'andamento dei libri: la tavola usa il raggio covalente di legame singolo. Il problema che resta è di correttezza, non di licenza: le fonti non coincidono (il raggio atomico ha più definizioni; i numeri di ossidazione elencati cambiano da un libro all'altro), quindi la pagina dichiara fonte e data di ogni grandezza e i valori si confrontano con le masse già usate nelle lezioni.

Dispositivi. Alessandro, 1° ottobre 2026: per adesso si pensa alla pagina da computer. Il telefono viene dopo.

Proposte di Claude, non discusse: un solo archivio degli elementi in `src/lib`, da cui leggono lo strumento, il motore della massa molare, le lezioni e il catalogo delle sostanze dei [[Laboratori]]; la versione vuota da compilare tra quelle da stampare, perché YouMath la offre.

## Domande aperte
- La griglia sul telefono, rimandata il 1° ottobre: 18 colonne in 390 px danno caselle di circa 20 px. Scorrimento laterale con zoom, tavola ruotata, elenco per periodo o per gruppo. Da decidere anche cosa vede il telefono finché non c'è: Google indicizza la versione per telefono, quindi una pagina rotta lì pesa anche sulla ricerca.
- La fonte dei raggi covalenti: i valori vengono da una tabella di Wikipedia e sembrano quelli di Pyykkö e Atsumi (2009), da verificare sull'articolo.
- Le scelte sui contenuti (famiglie, blocco f, ordine della configurazione, segno dell'affinità, quali numeri di ossidazione) sono in [[Domande per Andrea]], sezione "Tavola periodica".
- In quali lezioni di chimica si monta, e se intera o ridotta (i primi periodi, un gruppo evidenziato).
- La tavola al posto delle due figure statiche della lezione 43, o accanto.
- Quando riaprire la scelta sulle pagine per elemento: quali dati di Search Console la fanno scattare.

## Collegamenti
- Attori: [[Studente]], [[Docente]]
- Release: da decidere; non è nella [[Release Beta]], che ha la sola matematica
- Decisioni: [[2026-10-01 La tavola periodica sta tra gli strumenti, con una pagina sua]], [[2026-10-01 La tavola periodica si disegna prima da computer, con la scheda accanto alla griglia]], [[2026-10-01 La tavola periodica non ha pagine per elemento, per ora]], [[2026-10-01 La prima tavola periodica è ampia come Ptable e si fa subito]], [[2026-09-26 La chimica si pubblica gratis accanto alla beta]]
- [[Calcolatori e convertitori]], [[Lezioni]], [[SEO]], [[Laboratori]]
- Idee: [[Foto e modelli 3D degli elementi]], [[Orbitali atomici interattivi]]
