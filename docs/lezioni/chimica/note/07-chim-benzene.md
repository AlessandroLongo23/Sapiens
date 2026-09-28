# Note: Il benzene e i composti aromatici

Lezione nuova, scritta il 28 settembre 2026 (RDKit 2026.03) per la lezione `chim-benzene` del capitolo `chim-idrocarburi` (quinto anno). Non c'è un originale da correggere. Lo scopo immediato era vedere come si impaginano molecole con anelli, di taglia crescente, nei disegni 2D e nei modelli 3D.

## Cosa c'è

- Apertura: $\mathrm{C_6H_6}$ ha pochi idrogeni ma non reagisce come un alchene.
- Formula di Kekulé, e i due fatti che non spiega: sei legami uguali (139 pm) e un solo 1,2-dibromobenzene.
- Risonanza: formule limite, ibrido di risonanza, elettroni delocalizzati negli orbitali $p$, il cerchio dei libri. Avviso sull'oscillazione tra le due formule.
- Stabilità: energia di risonanza dalle entalpie di idrogenazione; bromo che si somma al cicloesene e si sostituisce sul benzene (solo come confronto: la sostituzione elettrofila aromatica ha la sua lezione, `chim-sostituzione-aromatica`).
- Aromaticità: quattro condizioni con la regola di Hückel ($4n + 2$); controesempio del cicloottatetraene, con il modello 3D a vasca.
- Nomi: un sostituente (nomi tradizionali accettati dalla IUPAC: toluene, fenolo, anilina), fenile e $\mathrm{Ar}$, orto/meta/para, tre o più sostituenti. Tre esempi svolti (1-cloro-4-metilbenzene, acido 2-idrossibenzoico, 2,4,6-tribromofenolo).
- Idrocarburi policiclici: naftalene, antracene, fenantrene; riquadro sui limiti della regola di Hückel con più anelli.
- Eterocicli: piridina (base, coppia nel piano), pirrolo (coppia nella nuvola $\pi$, non basico), pirimidina, imidazolo, purina; esempio svolto sul furano.
- Molecole vere in 3D: paracetamolo, acido acetilsalicilico, caffeina, con la regola "anello e primi atomi legati nello stesso piano".
- Cinque avvisi di errori frequenti, un riquadro `ad-note`.

Tutti i nomi inglesi corrispondenti sono stati letti con OPSIN (py2opsin) e danno la molecola del SMILES: 1-chloro-4-methylbenzene, 1,3-dibromobenzene, 2-hydroxybenzoic acid, 2,4,6-tribromophenol, i tre dimetilbenzeni, 2,4,6-trinitrotoluene, ethenylbenzene, naphthalene, anthracene, phenanthrene, pyridine, pyrimidine, pyrrole, imidazole, furan, caffeine, 2-acetyloxybenzoic acid, N-(4-hydroxyphenyl)acetamide, cyclooctatetraene, cyclohexene, 1,2-dibromocyclohexane, bromobenzene.

Il controllo `scripts/lezioni/check.mts` dà un solo avviso: "La formula di Kekulé" come titolo con maiuscole all'inglese (falso positivo, è un nome proprio). 30.706 caratteri: è lunga, come la 05. Se serve accorciare, si possono togliere la sezione sui policiclici con più di due anelli e l'esempio del furano.

Non ci sono formulario né esercizi.

## Figure

20 figure, tutte compilate e guardate con `anteprima.mjs` in chiaro e in scuro: 8 `molecola3d`, 5 `molecola` (4 dentro gli esempi), 5 `molecole`, 2 `reazione`.

| Nome | Tipo | Molecola | Formula e dati da `figure.py` |
|---|---|---|---|
| benzene-kekule | molecola | benzene | $\mathrm{C_6H_6}$, 78,11 |
| benzene-formule-limite | molecole | le due formule limite | la seconda è la prima ruotata di 60° |
| benzene-3d | molecola3d | benzene | C–C–C 120,0°, H–C–C 120,0° |
| benzene-addizione-cicloesene | reazione | cicloesene + bromo | |
| benzene-bromurazione | reazione | benzene + bromo | |
| benzene-cicloottatetraene-3d | molecola3d | cicloottatetraene | $\mathrm{C_8H_8}$, C–C–C 127,2° |
| benzene-monosostituiti | molecole | clorobenzene, toluene, fenolo, anilina, benzaldeide, acido benzoico | |
| benzene-toluene-3d | molecola3d | toluene | anello 120,4°, H–C–H del metile 108,9° |
| benzene-orto-meta-para | molecole | i tre dimetilbenzeni, anello numerato | |
| benzene-esempio-clorotoluene | molecola | 1-cloro-4-metilbenzene | $\mathrm{C_7H_7Cl}$ |
| benzene-esempio-acido-salicilico | molecola | acido 2-idrossibenzoico | $\mathrm{C_7H_6O_3}$ |
| benzene-esempio-tribromofenolo | molecola | 2,4,6-tribromofenolo | $\mathrm{C_6H_3Br_3O}$ |
| benzene-naftalene-3d | molecola3d | naftalene | $\mathrm{C_{10}H_8}$ |
| benzene-policiclici | molecole | naftalene, antracene, fenantrene | antracene e fenantrene $\mathrm{C_{14}H_{10}}$ |
| benzene-piridina-3d | molecola3d | piridina | C–N–C 116,6°, C–C–C 118,2° |
| benzene-eterocicli | molecole | piridina, pirimidina, pirrolo, imidazolo | |
| benzene-esempio-furano | molecola | furano | $\mathrm{C_4H_4O}$ |
| benzene-paracetamolo-3d | molecola3d | paracetamolo | $\mathrm{C_8H_9NO_2}$ |
| benzene-aspirina-3d | molecola3d | acido acetilsalicilico | $\mathrm{C_9H_8O_4}$ |
| benzene-caffeina-3d | molecola3d | caffeina | $\mathrm{C_8H_{10}N_4O_2}$ |

Tutti i campi di forza sono MMFF94. Le righe `% svg`, `% xyz` e `% legami` sono scritte da `pubblica_figure.py`.

Correzioni fatte dopo l'anteprima:

- Le reazioni scritte in SMILES semplice (`C1=CCCCC1.BrBr>>...`) fanno fallire RDKit ("getNumImplicitHs() called without preceding call to calcImplicitValence()"): con gli atomi tra parentesi quadre e le mappe atomiche, come nell'esterificazione della 05, funzionano. Ora sono con `colora: si`, e il testo spiega i colori (blu l'idrocarburo, arancione il bromo).
- Il catalizzatore $\mathrm{FeBr_3}$ scritto come agente sopra la freccia usciva minuscolo e illeggibile: l'ho tolto dal disegno, e il testo dice che andrebbe sopra la freccia. L'opzione `sopra:` descritta in testa a `figure.py` non è implementata in `figure_reazione`.
- L'avviso su meta e para parlava di "un carbonio in alto", ma RDKit gira gli esagoni in modo diverso da una molecola all'altra (vertice in alto nell'orto, lato in alto nel para): riscritto senza riferimenti all'orientamento.

## Impaginazione: cosa si è visto

- Il ripiego 2D di ogni `molecola3d` è disegnato sempre con tutti gli idrogeni (`figure_molecola3d` forza `idrogeni: tutti`). Per le molecole piccole va bene; per aspirina (221×202), caffeina (196×190) e paracetamolo (258×144) il disegno è più affollato di quello scheletrico della 05, ma resta leggibile. Accanto al riquadro 3D da 220 px, un disegno largo 258 px fa 478 px più lo spazio tra i due: sul telefono il riquadro va a capo sotto il disegno (`flex-wrap`), da verificare sul sito.
- Le tabelle `molecole` più larghe sono `benzene-orto-meta-para` (759×126), `benzene-policiclici` (588×128) e `benzene-eterocicli` (472×108): sul telefono si rimpiccioliscono, e i numeri dei carboni dell'orto-meta-para diventano piccoli. Si può passare a `colonne: 1` o 2 se sul sito si leggono male.
- Nel tema scuro dell'anteprima i numeri della catena sullo sfondo giallo si leggono poco; sul sito però il tema scuro inverte la versione chiara, quindi va guardato lì.
- Tutti i modelli 3D mostrano il benzene con legami doppi e semplici alternati, perché `% legami` è in forma di Kekulé (scelta di `pubblica_figure.py`). La lezione lo dice due volte, ma per una lezione sulla delocalizzazione è un limite: sarebbe meglio poter disegnare i legami aromatici con un ordine 1,5 (in 3Dmol, un bastoncino pieno e uno tratteggiato) solo per questa lezione, o per tutte.
- Nella reazione di bromurazione anche l'H del bromuro di idrogeno è arancione, mentre viene dal benzene: l'idrogeno non ha una mappa atomica sua (è implicito). Correggerlo vorrebbe gli idrogeni espliciti nello SMILES di reazione.

## Numeri e dati

Formule, masse molari e angoli sono di RDKit e stanno nel manifesto `figure/riscritte-07-chim-benzene.json`. Tutto il resto è scritto a memoria e va controllato su una fonte:

- lunghezze di legame: benzene 139 pm, C–C dell'etano 154 pm, C=C dell'etene 134 pm (da verificare);
- entalpie di idrogenazione: cicloesene −120 kJ/mol, benzene −208 kJ/mol, energia di risonanza circa 150 kJ/mol (da verificare; i libri danno valori tra 150 e 152);
- storia: Faraday isola il benzene nel 1825 dal gas illuminante; Kekulé propone l'anello nel 1865 e l'oscillazione nel 1872; Hückel ricava la regola nel 1931 (da verificare);
- naftalene nelle palline antitarme; idrocarburi aromatici policiclici cancerogeni, nel fumo di sigaretta e nei cibi carbonizzati; benzene cancerogeno e sostituito dal toluene come solvente; piridina nella nicotina e nella vitamina B3; acido salicilico dalla corteccia del salice; xileni come solventi (da verificare, anche se sono dati diffusi);
- la frase sull'aspirina ("nel modello calcolato il gruppo estere è ruotato fuori dal piano dell'anello") viene da un diedro che ho misurato con RDKit sullo stesso conformero (circa 100° per l'estere, circa 4° per il carbossile), ma `figure.py` non stampa diedri: nella lezione non c'è nessun numero. Se cambiano seme o campo di forza, la frase va ricontrollata guardando il modello.

## Domande per Andrea

- Notazione del benzene: i disegni sono tutti formule di Kekulé (RDKit non disegna il cerchio), e il testo dice che il cerchio si usa nei libri. Basta, o serve un disegno con il cerchio fatto a mano (TikZ)?
- Nomi: "formule limite" con "strutture di risonanza" tra parentesi; "ibrido di risonanza"; "energia di risonanza". Sono i termini dei libri che usano le scuole?
- Le condizioni di aromaticità sono quattro (ciclico e piano, orbitale $p$ su ogni atomo, delocalizzazione, $4n + 2$). Molti libri ne danno tre, unendo le prime; e "$n$ numero naturale" include lo 0 (2 elettroni), che nella lezione non ha esempi.
- La lezione dice "orbitale $p$" e "triangolare planare", ma non "ibridazione $sp^2$", perché l'ibridazione è una lezione del terzo anno (`chim-ibridazione`) che non è ancora scritta. Si può dare per nota al quinto anno e usarla?
- Orto, meta, para in corsivo con l'iniziale (*o*-, *m*-, *p*-). Nel nome IUPAC con due sostituenti diversi: 1-cloro-4-metilbenzene (ordine alfabetico) con 4-clorotoluene come alternativa. È la regola che i libri insegnano, o partono sempre dal nome tradizionale?
- Caffeina: la lezione dice che l'anello a cinque atomi è aromatico e che lo scheletro è piano, senza dire se lo è anche l'anello a sei (con i due carbonili la risposta non è netta). La 05 diceva la stessa cosa: va bene così?
- Pirrolo "in pratica non è una base": semplificazione accettabile?
- La lezione ripete tre molecole della 05 (aspirina, paracetamolo, caffeina), qui per l'anello e il 3D. Ripetizione utile o da evitare?
- Il confronto cicloesene/benzene con il bromo anticipa la lezione `chim-sostituzione-aromatica`. Va bene come anticipazione, o il bromo va tolto da qui?
