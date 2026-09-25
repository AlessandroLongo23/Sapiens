# Note: La mole e la massa molare

Lezione nuova, scritta il 25 settembre 2026 per la prova di RDKit. Non c'è un originale da correggere.

## Cosa c'è

- Massa atomica relativa e unità di massa atomica, con la tavola delle masse della lezione (12 elementi, due decimali). La stessa tavola è copiata nel formulario, nel generatore (`MASSE`) e nel controllo indipendente (`TAVOLA`); se cambia un valore, va cambiato in tutti e quattro.
- Dalla formula scheletrica alla formula bruta, in quattro passi: è il pezzo che serve agli esercizi con la molecola disegnata. Ordine degli elementi di Hill (C, H, poi alfabetico) per i composti del carbonio; formule tradizionali per gli altri.
- Massa molecolare, mole e numero di Avogadro, massa molare, $n = m/M$, $N = n \cdot N_A$, composizione percentuale. Dodici esempi svolti, cinque riquadri di errori.
- Sette figure RDKit: etanolo scheletrico e completo affiancati; acido acetilsalicilico con i carboni evidenziati da contare; etanolo ed etere dimetilico (stessa formula, molecole diverse); glucosio in formula di struttura completa con gli ossigeni evidenziati; due tabelle di sostanze comuni con la massa molare in legenda (le piccole in formula completa, le grandi in formula scheletrica); caffeina con azoti e ossigeni evidenziati. Il formulario ha una copia della prima (`mole-formulario-etanolo`).
- Tutte le masse molari del testo sono calcolate con la tavola della lezione e ricontrollate con uno script. RDKit usa masse più precise e dà valori un po' diversi al secondo decimale (glucosio 180,16 invece di 180,18; caffeina 194,19 invece di 194,22; acido acetilsalicilico 180,16 invece di 180,17): nelle legende delle figure ci sono i valori della tavola, scritti a mano.

## Dubbi da decidere

- Zolfo: la tavola usa $32{,}07$, come il README di chimica. Il valore IUPAC convenzionale oggi è $32{,}06$ (da verificare quale usano i libri di testo italiani); nessun esercizio usa lo zolfo, quindi si può cambiare senza effetti.
- Massa atomica relativa: la lezione dice che è un numero puro e che la massa di un atomo si scrive in $\mathrm{u}$ ("un atomo di carbonio ha in media una massa di 12,01 u"). Molti libri italiani scrivono la massa atomica relativa direttamente con l'unità u; ho scelto la versione corretta, ma va confrontata con il libro più usato.
- Cifre significative: la lezione dà una regola sola (tante cifre quante il dato meno preciso) in un riquadro `ad-tip`. Se le cifre significative hanno già una lezione loro (per esempio in un capitolo sulle misure), il riquadro diventa un rimando.
- "Massa formula" per i composti ionici è in un riquadro `ad-note`: alcuni libri usano comunque "massa molecolare" anche per NaCl.
- Titolo "La mole e il numero di Avogadro": il controllo automatico lo segnala come maiuscola all'inglese, ma Avogadro è un nome proprio. Falso positivo.
- La frase d'apertura (un cucchiaino d'acqua ha circa $1{,}7 \cdot 10^{23}$ molecole) presuppone un cucchiaino da $5\ \mathrm{mL}$, cioè $5\ \mathrm{g}$: $5 / 18{,}02 \cdot 6{,}022 \cdot 10^{23} = 1{,}67 \cdot 10^{23}$.

## Esercizi

Generatore `scripts/chimica/esercizi/mole_massa_molare.py`, controllo `scripts/chimica/esercizi/verifica/mole_massa_molare.py`. Pool di 28 sostanze: 22 organiche (dall'etanolo all'ibuprofene, con farmaci, aromi e zuccheri) e 6 piccole (acqua, anidride carbonica, metano, ammoniaca, acqua ossigenata, urea), queste ultime solo dal livello 3 perché nel disegno non hanno idrogeni nascosti sul carbonio da contare.

1. Formula bruta dal disegno scheletrico. Distrattori: idrogeni sul carbonio dimenticati (sempre presente), idrogeni degli $\mathrm{OH}$ e $\mathrm{NH}$ dimenticati, un carbonio in più o in meno, due idrogeni in più o in meno.
2. Massa molare dal disegno. Distrattori: idrogeni nascosti dimenticati (sempre), ogni elemento contato una volta sola, un carbonio sbagliato, due idrogeni in più.
3. Moli da una massa data con tre cifre significative. Distrattori: $m \cdot M$, $M / m$, massa molare senza idrogeni nascosti.
4. Molecole, atomi di un elemento o atomi in tutto. Distrattori: diviso per $N_A$, massa moltiplicata per $N_A$ senza passare dalle moli, molecole contate al posto degli atomi (o viceversa).
5. Percentuale in massa di un elemento che compare almeno due volte. Distrattori: indice dimenticato ($A_X / M$), frazione di atomi al posto della massa, massa dell'elemento divisa per quella del resto; di riserva la percentuale di un altro elemento o il complemento a 100.

La massa data nei livelli 3 e 4 si ottiene da un numero di moli pulito ($0{,}250$, $1{,}50$...) moltiplicato per $M$ e arrotondato a tre cifre significative; si scartano le masse come $450\ \mathrm{g}$, dove non si capisce se lo zero è significativo. Il controllo indipendente conta gli atomi visitando il grafo (non usa `CalcMolFormula`), ricalcola le masse in frazioni esatte con la sua copia della tavola, legge le opzioni come numeri dal LaTeX e controlla che la giusta sia l'arrotondamento del valore esatto con le cifre richieste e che nessun distrattore valga lo stesso.

Un dubbio sul livello 4: la risposta è calcolata dalle moli esatte, mentre lo studente di solito arrotonda $n$ a tre cifre e poi moltiplica. In qualche caso le due strade possono differire di uno sull'ultima cifra; i distrattori sono lontani ordini di grandezza, quindi la scelta resta chiara, ma lo studente può vedere un'ultima cifra diversa dalla sua.

## Figure

- Il glucosio in formula di struttura completa è la figura più affollata. Con il SMILES scritto nell'ordine di PubChem, `C(C1C(C(C(C(O1)O)O)O)O)O`, RDKit lo dispone meglio che con `OCC1OC(O)...`; ho provato anche `ruota` e `scala`, senza miglioramenti.
- Le figure non mostrano la stereochimica (glucosio, mentolo, acido ascorbico, nicotina, ibuprofene sono scritti senza centri chirali): per contare gli atomi non serve, e il disegno resta più pulito.
- Nelle tabelle ` ```molecole ` le celle sono allineate in basso e alte come la molecola più alta: per questo le sostanze sono divise in due tabelle, piccole e grandi.
