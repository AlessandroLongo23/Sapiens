# Note: Somma e differenza di vettori

Lezione nuova, primo lotto di fisica, gruppo 4, 29 settembre 2026. Numeri rifatti in Python con quelli delle altre
due lezioni del gruppo; `check.mts` passa sui tre file senza avvisi.

## Struttura ed esempi

Regola punta-coda (il cammino $3 + 4$ km dell'apertura), regola del parallelogramma e proprietà commutativa, somma di
più vettori, opposto e differenza (con la scorciatoia "dalla punta di $\vec{b}$ alla punta di $\vec{a}$"), prodotto per
un numero, vettori sulla stessa retta, vettori perpendicolari, somma per componenti sulla griglia. Esempi: quattro
spostamenti di un cane ($6$ E, $9$ N, $2$ O, $6$ S: $5\,\text{m}$ contro $23\,\text{m}$ di strada); i multipli di uno
spostamento di $4\,\text{m}$; due forze sulla stessa retta ($30$ e $12$ N); due forze perpendicolari ($6{,}0$ e
$8{,}0$ N, $10\,\text{N}$); somma e differenza con le componenti ($a = (3, 1)$, $b = (1, 2)$, somma $5$, differenza
$\sqrt{5} \approx 2{,}2$).

Avvisi: il modulo della somma non è la somma dei moduli, l'ordine nella differenza (con la differenza dei moduli, $1$,
contro il modulo della differenza, $5$), il segno meno che non va nel modulo, il verso della risultante.

## Scelte

- Gli esempi con le forze le usano solo come vettori (due corde, una cassa tirata): cosa sia una forza lo spiega la
  lezione successiva, e la lezione 13 già rimanda lì.
- Le componenti entrano qui in forma "da quadretti", intere e con il segno, e si chiamano $a_x$ e $a_y$. La lezione 15
  le riprende con seno e coseno. Non ho usato la scrittura a coppia $(3; 1)$ nel testo, per non introdurre una notazione
  che la 15 non usa.
- Il prodotto per un numero sta nella stessa lezione della differenza, come chiedeva la traccia del lotto; il titolo
  della lezione non lo nomina.
- Sig. fig.: gli esempi con dati misurati usano due cifre ($6{,}0$ e $8{,}0$ N), gli spostamenti sulla griglia sono
  numeri esatti.

## Figure

Statiche (chiaro e scuro): `somma-punta-coda`, `somma-parallelogramma`, `somma-quattro-spostamenti`,
`differenza-vettori` (a = (5, 1), b = (1, 4), −b tratteggiato, a − b = (4, −3) e la sua copia tra le punte),
`vettore-per-numero` ($a$, $3a$, $-2a$, $a/2$ in scala), `somma-vettori-stessa-direzione` (in scala 0,075 cm/N),
`somma-vettori-perpendicolari` (in scala 0,3 cm/N).

Interattive:

- `somma-vettori-parallelogramma` (`SommaVettori.tsx`): le punte di $\vec{a}$ e $\vec{b}$ si trascinano sugli incroci;
  parallelogramma tratteggiato e somma $\vec{s}$ in arancione; il bottone fa scorrere $\vec{b}$ sulla punta di
  $\vec{a}$ (regola punta-coda) e ritorno. Sotto, $a$, $b$, $|\vec{a} + \vec{b}|$ e $a + b$, con due decimali quando uno
  solo li farebbe sembrare uguali. Casi guardati: generale, punta-coda, stessa direzione e verso, quasi paralleli.
- `differenza-vettori-opposto` (`DifferenzaVettori.tsx`): come la figura statica, con le punte da trascinare; il
  vettore differenza si chiama $\vec{d}$.
- `vettore-per-scalare` (`VettorePerScalare.tsx`): $\vec{a}$ di $2\,\text{m}$ a $30^\circ$, un cursore per $k$ da $-3$
  a $3$ a passi di $0{,}5$; $k\vec{a}$ in arancione sulla retta tratteggiata della direzione di $\vec{a}$, con modulo e
  verso sotto. Guardata per $k = 3$, $0{,}5$, $0$, $-1{,}5$, $-3$.

Nella somma interattiva il vettore somma si chiama $\vec{s}$ perché `VecLabel` scrive una lettera sola con la freccia
(vedi i difetti del kit nel resoconto del lotto); la lezione lo dice nella frase prima della figura.

## Esercizi

Generatore `fis-operazioni-vettori`, sei livelli: stessa retta, prodotto per un numero, perpendicolari, somma, differenza
e tre forze sulla griglia. Tutti con la scena `vettori-piano`.

## Domande per Andrea

- Il nome "risultante" va bene per ogni somma di vettori o lo riservate alle forze?
- Regola punta-coda: il vostro libro la chiama così, "metodo punta-coda" o "regola del poligono"?
- Il prodotto per un numero: "prodotto di un vettore per uno scalare" (più comune) o "per un numero" (qui, più
  semplice)?
- Componenti sulla griglia già in questa lezione: vi sembra giusto, o le componenti vanno tutte nella 15?
- Il modulo della differenza nell'avviso ($\approx 5{,}1 - 4{,}1 = 1$ contro $5$): troppo per il primo anno?

## Verifiche

- `check.mts` su lezione, formulario e 17 carte: nessun errore, nessun avviso.
- Generatore: seed 1, 50001 e 777001, 6000 esercizi ciascuno, `verify.py` PASS; errori piantati tutti bocciati (90 su
  90 per tipo); `review.mts` e `width.mts` codice 0 (opzione più larga 172 px).
