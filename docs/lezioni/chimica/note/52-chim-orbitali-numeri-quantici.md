# Note: Orbitali e numeri quantici

Lezione nuova (1° ottobre 2026), la prima del terzo anno di chimica: capitolo "La struttura elettronica dell'atomo",
quinta lezione su sei. Non è pubblicata: aspetta il via di Alessandro, e le sue figure interattive devono essere in
produzione prima del testo. `check.mts` passa su lezione, formulario e flashcard; l'avviso "riempitivo" è su "stato
fondamentale", che è il termine; i 14 grassetti sono tutti termini nel punto in cui sono definiti.

## Struttura

L'idea viene da due video che Alessandro ha indicato come riferimento (FloatHeadPhysics, "We finally understood orbital
shapes intuitively!", 30 gennaio 2025, per l'ordine della spiegazione; minutephysics, "A Better Way To Picture Atoms", 19
maggio 2021, per la nuvola di punti in moto): l'analisi è nel vault, in `Prodotti/Studenti/Orbitali atomici interattivi.md`. Testo,
esempi e figure sono nostri.

L'onda chiusa e la corda (figura TikZ), con i nodi e l'energia; l'orbitale come mappa di probabilità, con i puntini e
l'avviso "orbitale non vuol dire orbita"; i nodi radiali e gli orbitali $s$; il nodo angolare e i tre orbitali $p$; due
nodi angolari e i cinque orbitali $d$; i tre numeri quantici letti sui nodi, con due tabelle e tre esempi; le dimensioni
al crescere di $n$; lo spin e il principio di Pauli, con una tabella e un esempio; perché l'idrogeno ha tanti orbitali
(domanda di Alessandro); un approfondimento sugli stati con $m_l$ definito e su che cosa rappresenta la velocità dei
puntini; il visualizzatore completo.

## Scelte e fonti

- I numeri quantici sono presentati a partire dai nodi: $n - 1$ nodi in tutto, $l$ angolari. È corretto ed è il filo
  della lezione, ma non è il modo dei libri di scuola, che danno le regole senza i nodi. Da confermare con Andrea.
- Nomi: "numero quantico secondario" per $l$ (altri libri: angolare, azimutale), $m_l$ per il magnetico (altri: $m$),
  $m_s$ per lo spin.
- Definizione di orbitale: "la mappa della probabilità di trovare l'elettrone", con la superficie al 90% come disegno
  dei libri. Alcuni libri dicono 95%.
- Numeri, calcolati: raggio di Bohr $52{,}9\,\text{pm}$ (distanza più probabile nell'$1s$); distanza media
  $\frac{3}{2}n^2 a_0$ per gli orbitali $s$, cioè $79$, $318$, $714$ e $1270\,\text{pm}$ per $n$ da $1$ a $4$. Il test
  `tests/unit/orbitali-idrogeno.test.mjs` controlla che le nuvole disegnate abbiano questi raggi medi entro il 3%.
- "Una carica che gira perde energia e cadrebbe sul nucleo in una frazione di secondo": è l'argomento classico; il tempo
  non è dato.
- L'energia dell'idrogeno dipende solo da $n$ ($2s$ e $2p$ hanno la stessa energia): detto, senza la formula, che è
  della lezione sui livelli.
- Approfondimento: la velocità dei puntini è la corrente di probabilità divisa per la densità (formulazione di de
  Broglie e Bohm). Il testo dice che è il momento angolare attorno all'asse e che non è la velocità misurabile
  dell'elettrone. Il nome di Bohm non compare. $2p_x$ e $2p_y$ come somme di $m_l = +1$ e $-1$: vero per le combinazioni
  reali.
- Niente link alle altre lezioni del capitolo (spettri, Bohr, livelli, dualismo, configurazione elettronica): non sono
  ancora scritte. Vanno aggiunti quando ci saranno, insieme a un link allo strumento della tavola periodica.
- Il grafo dei prerequisiti (`docs/lezioni/prerequisiti.md`) copre solo la matematica: per la chimica non c'è.

## Figure

Una TikZ, guardata in chiaro e in scuro: `orbitali-corda-onde-stazionarie` (tre modi della corda, nodi in rosso).

Otto interattive, tutte lo stesso componente (`src/components/orbitali/`) con i parametri fissati per il paragrafo, in
`src/components/content/interactive/chimica/orbitali.tsx`:

| Nome | Paragrafo | Che cosa mostra |
|---|---|---|
| `orbitale-1s-mappa-probabilita` | la mappa di probabilità | sezione dell'$1s$, a puntini |
| `orbitali-s-nodi-radiali` | i nodi radiali | sezioni di $1s$, $2s$, $3s$ con i nodi |
| `orbitale-2p-nodo-angolare` | il nodo come piano | sezioni di $2s$ e $2p$ con i nodi |
| `orbitali-2p-tre-direzioni` | i tre orbitali $p$ | nuvole 3D di $2p_x$, $2p_y$, $2p_z$, nodi a scelta |
| `orbitali-3d-cinque-forme` | gli orbitali $d$ | nuvole 3D dei cinque $3d$, nodi a scelta |
| `orbitali-livelli-stessa-scala` | più energia, più spazio | $1s$-$4s$ alla stessa scala, aperti |
| `orbitali-2p-in-moto` | l'approfondimento | i tre stati $2p$ con $m_l$ definito, in moto |
| `orbitali-esplora` | l'ultima sezione | il visualizzatore completo: tabella dei sottolivelli a caselle come selettore, configurazione di un elemento a frecce, regola della diagonale |

Guardate sulla pagina di prova (`/prova-fisica?figura=<nome>`) a 820 px e, per le due più larghe, a 390 px, senza
errori in console e senza scorrimento laterale. Il disegno 3D è stato provato solo con il rendering via software: la
fluidità su un computer e su un telefono veri è da controllare, e sette figure 3D nella stessa pagina sono sette scene
three.js (si montano solo quando si avvicinano allo schermo, ma restano accese).

Le figure a puntini sono dell'idrogeno. Per i lobi i colori sono rosso e blu, i due segni della funzione d'onda; negli
stati in moto blu e arancio, senza significato di segno.

## Esercizi

Generatore `chim-orbitali-numeri-quantici`, cinque livelli (specifica in
`specs/exercises/chim-orbitali-numeri-quantici.md`): valori di $l$ e nomi; valori di $m_l$ e numero di orbitali; terne
che esistono; nodi; elettroni. Tutto a scelta multipla. Controllo indipendente
`scripts/exercises/checkers/chim_orbitali_numeri_quantici.py`: PASS su 1000 esercizi per livello con i seed 1, 50001 e
777001; 200 errori piantati (indice sbagliato, distrattore uguale alla risposta, opzione giusta cambiata) tutti
bocciati; `review.mts` e `width.mts` escono con 0.

## Dubbi per Andrea

- Nell'ultima figura la tabella dei sottolivelli mostra la configurazione di qualunque elemento, con le eccezioni (cromo, rame) e la regola di Hund: anticipa la lezione successiva. Va bene, o in questa lezione la figura deve fermarsi agli orbitali?

- La lezione va bene nel programma al posto di "Orbitali e numeri quantici", o è troppo per una terza? In alternativa
  l'approfondimento e i nodi diventano una lezione a parte e questa si accorcia.
- I nodi come chiave per i numeri quantici.
- Il livello 4 degli esercizi (i nodi) va tenuto?
- "Secondario" o "angolare" per $l$; $m_l$ o $m$.
- La frase sul segno della funzione d'onda ("conterà quando studierai i legami") anticipa gli orbitali molecolari, che
  il programma lascia fuori: toglierla?
