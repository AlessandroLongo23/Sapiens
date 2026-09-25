# Note: Amminoacidi e legame peptidico

Lezione nuova, scritta il 25 settembre 2026 per la prova di RDKit. Non c'è un originale nel database: le note dicono le scelte fatte, cosa ha dato RDKit e cosa resta da decidere.

## Cosa mostra di RDKit

- Stereochimica calcolata: con `stereo: si` RDKit assegna S all'alanina e alla serina e R alla cisteina (`peptidi-configurazione-l`). La lezione usa il caso della cisteina per spiegare perché L e S non sono la stessa cosa.
- Schema di reazione con gli atomi colorati per reagente e mappe atomiche (`peptidi-reazione-gly-ala`): gli idrogeni che finiscono nell'acqua sono scritti come atomi espliciti mappati, così nell'acqua si vede che l'ossigeno e un H vengono dalla glicina (blu) e l'altro H dall'alanina (arancione).
- Cariche formali nei disegni (zwitterione, forme a pH 1 e 12, catene laterali cariche) ed evidenziazioni con SMARTS (legami peptidici, N-terminale, C-terminale, ponte disolfuro).
- Negli esercizi i peptidi e i dipeptidi sbagliati sono costruiti con `rdChemReactions`: una reazione per il legame peptidico e una per ogni errore tipico.

## Figure

13 figure nella lezione, 2 nel formulario (tutte `peptidi-*`), guardate in chiaro e in scuro:

- `peptidi-struttura-generale`, `peptidi-configurazione-l`, `peptidi-alanina-ph`
- `peptidi-apolari`, `peptidi-polari`, `peptidi-acide`, `peptidi-basiche` (a pH 7, catena laterale in verde)
- `peptidi-reazione-gly-ala`, `peptidi-risonanza`, `peptidi-gly-ala-ala-gly`, `peptidi-tripeptide`, `peptidi-gly-asn`, `peptidi-cistina`
- formulario: `peptidi-formulario-struttura` e `peptidi-formulario-reazione`, copie dei blocchi della lezione con un altro `% nome`, perché i nomi devono essere unici. Lo stile dei formulari chiede di copiare il blocco "così com'è": per le figure di chimica la regola va aggiornata.

Limiti trovati:

- Nello schema di reazione RDKit disegna sempre il dipeptide con la glicina a destra, cioè con l'N-terminale a destra, al contrario della convenzione. Non cambia con l'ordine degli atomi nello SMILES, con l'ordine dei reagenti né con `scala` (che nello schema di reazione non ha effetto visibile). Il testo lo dice ("Il dipeptide è disegnato girato"). Per sistemarlo servirebbe un'opzione `ruota:` per le singole molecole della reazione in `figure.py`, oppure un orientamento calcolato sull'asse N-terminale/C-terminale.
- Nei blocchi `molecole` e `reazione` lo schema resta piccolo dentro la tela (720x150): leggibile, ma le etichette sono più piccole che nelle altre figure.
- `ruota: 180` per riga in una tabella funziona: con quella Gly-Ala e il tripeptide vanno da sinistra (N-terminale) a destra.
- Le legende non mostrano i pedici Unicode (CH₃ esce "CH"): il font dei tracciati di RDKit non ha quei caratteri. Ho tolto le formule dalle legende.
- Una catena laterale generica R non si può disegnare: `*` esce come asterisco, e le etichette CXSMILES (`|$;;R$|`) non passano perché il `|` separa le colonne del blocco. La struttura generale è mostrata con tre amminoacidi veri e la catena laterale colorata.
- Nel campo `evidenzia:` il `;` separa le evidenziazioni, quindi negli SMARTS non si può usare `;` (`[NX3;H2]` va scritto `[NX3H2]`). Da scrivere nel README.
- La proiezione di Fischer, l'α-elica e il foglietto β non si possono disegnare con RDKit: la lezione li descrive a parole.

## Esercizi

Generatore `scripts/chimica/esercizi/amminoacidi_legame_peptidico.py`, controllo `scripts/chimica/esercizi/verifica/amminoacidi_legame_peptidico.py`. `campioni.py amminoacidi-legame-peptidico --n 200`: PASS, 200 su 200 per ognuno dei cinque livelli.

1. Le parti di un amminoacido: quale gruppo è evidenziato in giallo (amminico, carbossilico, carbonio α, catena laterale).
2. Le catene laterali: la classe di un amminoacido disegnato a pH 7, solo tra quelli che tutti i libri classificano allo stesso modo.
3. Il dipeptide giusto, dati i due amminoacidi e l'ordine. Distrattori: l'ordine inverso (sempre), il legame dalla catena laterale (Asp e Glu al primo posto, lisina al secondo), l'estere con l'OH di serina o treonina, il dipeptide senza perdita d'acqua, il legame tra i due carbossili (anidride), la dichetopiperazina (due legami ad anello).
4. Quanti legami peptidici, o quante molecole d'acqua, in un peptide di 3-5 amminoacidi; metà delle volte con asparagina o glutammina, e allora un distrattore conta anche le ammidi delle catene laterali.
5. La forma che prevale a pH 7, con quattro disegni dello stesso amminoacido. Per le catene laterali neutre i distrattori sono le forme neutra, cationica e anionica; per quelle acide e basiche la forma con la catena laterale non ionizzata, la neutra e quella con carica doppia.

Il controllo non usa niente del generatore: il dipeptide e il peptide giusti li ottiene sia da OPSIN, che legge il nome inglese ("glycyl-L-alanyl-L-serine"), sia da uno SMILES scritto con le regole di sequenza, e li confronta con l'InChI; conta i legami peptidici con uno SMARTS proprio; ricava la classe della catena laterale dal grafo; calcola la carica netta sommando le cariche formali e la confronta con (gruppi basici) − (gruppi acidi) della forma neutra letta da OPSIN.

Errori piantati, tutti bocciati: opzione giusta spostata (livello 1); atomi evidenziati diversi dal gruppo della risposta; metionina classificata polare; distrattore uguale alla risposta (livello 3); ordine inverso segnato come giusto; risposta $n$ invece di $n - 1$ (livello 4); peptide con il legame sulla lisina al posto del legame peptidico; acido aspartico con il carbossile laterale protonato segnato come forma a pH 7; D-alanina nella tabella del generatore (bocciata ai livelli 1 e 3); treonina messa tra le apolari nel generatore.

## Dubbi da decidere

- Classificazione delle catene laterali: i libri non sono d'accordo su glicina (apolare o polare), cisteina e tirosina (polari o apolari), istidina (basica, ma a pH 7 in gran parte neutra), metionina. Ho seguito lo schema più diffuso e l'ho detto in un riquadro; negli esercizi del livello 2 ci sono solo gli amminoacidi senza dubbi. Andrea dovrebbe controllare quale schema usa il libro più adottato.
- Numeri da verificare su una fonte: punto isoelettrico dell'alanina circa $6{,}0$ (Lehninger, Principi di biochimica, tabella degli amminoacidi, dà 6,01: da verificare nell'edizione italiana); pKa del gruppo imidazolico dell'istidina circa 6; il confine tra polipeptide e proteina "oltre la cinquantina di amminoacidi" (convenzione non fissata, da verificare).
- La lezione è lunga (circa 25.000 caratteri con i blocchi delle figure, contro i 9.000 della lezione 05 di matematica). Copre tutto quello che chiedeva il brief; se è troppo, i candidati da spostare sono il gruppo peptidico planare e i livelli di struttura, che potrebbero diventare una lezione sulle proteine.
- Il controllo automatico delle lezioni segnala 21 grassetti. Sono tutti termini nel punto in cui vengono definiti (D, L, zwitterione, pH fisiologico, i quattro livelli di struttura...); se sono troppi, si possono togliere D, L e pH fisiologico.
- Il livello 5 viene dopo il livello 4 come nel brief, ma la difficoltà non cresce davvero: sono due abilità diverse. Si può scambiarli, o fare del livello 5 una domanda sulla carica netta di un dipeptide.
- Gli amminoacidi nelle reazioni sono disegnati senza cariche, come nei libri; la lezione lo dice. Resta da decidere se la vetrina deve mostrarlo anche negli esercizi del livello 3.
- La lezione rimanda alla "lezione sull'isomeria" senza link, perché le lezioni di chimica non hanno ancora un URL.

## Figure da fare (fuori da RDKit)

- Proiezione di Fischer di un L-amminoacido accanto al D, nella sezione sulla configurazione L.
- α-elica e foglietto β, nella sezione sui livelli di struttura.
