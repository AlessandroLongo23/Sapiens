# I sali ternari

Generatore: `chim-sali-ternari` (`src/lib/exercises/v2/generators/chim-sali-ternari.ts`, con le tabelle di
`src/lib/exercises/v2/chim3-j.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_sali_ternari.py`, con
`_chim3_j.py`. Lezione collegata: `docs/lezioni/chimica/riscritte/82-chim-sali-ternari.md`. Percorso nel database:
`high_school/chemistry/chim-nomenclatura/chim-sali-ternari`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. Tutto a scelta multipla, quattro opzioni.

## Nomi dei livelli

1. Dall'acido all'anione
2. Dagli ioni alla formula
3. Dalla formula al nome tradizionale e di Stock
4. Il nome IUPAC
5. I sali acidi
6. I sali idrati

## Dati

Quattordici acidi e i loro anioni: carbonico, nitroso, nitrico, solforoso, solforico, fosforico, ipocloroso, cloroso,
clorico, perclorico, bromico, iodico, cromico, permanganico. Cationi: quelli dei sali binari (`chim-sali-binari`) e lo
ione ammonio.

### Sali ammessi

Per non chiedere il nome di composti che non esistono, alcuni cationi si usano solo con alcuni acidi; gli altri
(litio, sodio, potassio, magnesio, calcio, bario, zinco) con tutti e quattordici.

| Catione | Acidi |
|---|---|
| $\mathrm{Cu^+}$ | solforico |
| $\mathrm{Cu^{2+}}$ | carbonico, nitroso, nitrico, solforico, fosforico, clorico, perclorico, cromico |
| $\mathrm{Fe^{2+}}$ | solforico, nitrico, carbonico, fosforico, solforoso, perclorico |
| $\mathrm{Fe^{3+}}$ | solforico, nitrico, fosforico, perclorico |
| $\mathrm{Sn^{2+}}$ | solforico, nitrico, fosforico |
| $\mathrm{Sn^{4+}}$ | solforico, nitrico |
| $\mathrm{Pb^{2+}}$ | carbonico, nitrico, solforoso, solforico, fosforico, clorico, perclorico, bromico, iodico, cromico |
| $\mathrm{Pb^{4+}}$ | solforico |
| $\mathrm{Al^{3+}}$ | solforico, nitrico, fosforico, clorico, perclorico |
| $\mathrm{Ag^+}$ | tutti tranne ipocloroso e cloroso |
| $\mathrm{NH_4^+}$ | carbonico, nitroso, nitrico, solforoso, solforico, fosforico, clorico, perclorico, cromico |

Sali acidi: idrogenocarbonati di sodio, potassio, calcio, magnesio, bario, ammonio; idrogenosolfiti di sodio,
potassio, calcio, ammonio; idrogenosolfati di sodio, potassio, ammonio; idrogenofosfati di sodio, potassio, calcio,
magnesio, ammonio; diidrogenofosfati di sodio, potassio, calcio, ammonio; idrogenosolfuri di sodio, potassio, ammonio.

Idrati: $\mathrm{CuSO_4 \cdot 5H_2O}$, $\mathrm{CaSO_4 \cdot 2H_2O}$, $\mathrm{Na_2CO_3 \cdot 10H_2O}$,
$\mathrm{MgSO_4 \cdot 7H_2O}$, $\mathrm{FeSO_4 \cdot 7H_2O}$, $\mathrm{ZnSO_4 \cdot 7H_2O}$,
$\mathrm{Na_2SO_4 \cdot 10H_2O}$, $\mathrm{Cu(NO_3)_2 \cdot 3H_2O}$, $\mathrm{Ca(NO_3)_2 \cdot 4H_2O}$,
$\mathrm{Mg(NO_3)_2 \cdot 6H_2O}$, $\mathrm{Zn(NO_3)_2 \cdot 6H_2O}$, $\mathrm{Na_2SO_3 \cdot 7H_2O}$,
$\mathrm{Na_2CrO_4 \cdot 4H_2O}$ (da verificare con Andrea).

## Livello 1: dall'acido all'anione

Tre casi, un terzo ciascuno: il nome dell'anione dal nome dell'acido; la formula dell'anione, con la carica, dal suo
nome; l'acido da cui un anione deriva. Distrattori: -ito e -ato scambiati (sempre presente), -uro, la radice non
accorciata (solforato, fosforato), ipo- e per- aggiunti o tolti, la carica sbagliata, l'anione dell'altro acido.

- "Come si chiama l'anione che deriva dall'acido solforoso?" Risposta: ione solfito; distrattori: ione solfato, ione
  solfuro, ione solforito.
- "Qual è la formula dello ione fosfato?" Risposta $\mathrm{PO_4^{3-}}$; distrattori $\mathrm{PO_4^{2-}}$,
  $\mathrm{PO_4^{4-}}$, $\mathrm{PO_4^{3+}}$.

## Livello 2: dagli ioni alla formula

Un catione e un anione poliatomico con le loro cariche, tra i sali ammessi; si chiede la formula. Distrattori: le
parentesi moltiplicate ($\mathrm{CaN_2O_6}$), l'incrocio non semplificato ($\mathrm{Ca_2(CO_3)_2}$), gli indici
scambiati, uno a uno, un indice in più.

- "Qual è la formula del sale formato dagli ioni $\mathrm{Ca^{2+}}$ e $\mathrm{NO_3^-}$?" Risposta
  $\mathrm{Ca(NO_3)_2}$; distrattori $\mathrm{CaN_2O_6}$, $\mathrm{Ca_2NO_3}$, $\mathrm{CaNO_3}$.
- "... $\mathrm{Al^{3+}}$ e $\mathrm{SO_4^{2-}}$?" Risposta $\mathrm{Al_2(SO_4)_3}$.

## Livello 3: dalla formula al nome tradizionale e di Stock

Sei volte su dieci un metallo con due cariche (metà nome tradizionale, metà Stock), le altre un catione con una sola
carica (nome tradizionale). Distrattori: l'altro numero di ossidazione del metallo e -ito e -ato scambiati (sempre
presenti con i metalli a due cariche), -uro, ipo- e per-, la radice lunga, il numero romano preso da un indice o dal
numero di ossidazione del non metallo.

- "Che nome ha $\mathrm{Fe_2(SO_4)_3}$ nella nomenclatura tradizionale?" Risposta: solfato ferrico; distrattori:
  solfato ferroso, solfito ferrico, solfuro ferrico.
- "Che nome ha $\mathrm{Cu(NO_3)_2}$ nella notazione di Stock?" Risposta: nitrato di rame(II); distrattori: nitrato
  di rame(I), nitrito di rame(II), nitrato di rame(V).

## Livello 4: il nome IUPAC

Metà dalla formula al nome, metà dal nome alla formula, su tutti i sali ammessi. Distrattori del nome: un altro
numero romano, il numero romano che conta gli ossigeni, il prefisso dell'ossigeno sbagliato, bis o tris dimenticati o
aggiunti, il prefisso del metallo, -ito. Distrattori della formula: l'anione di un altro acido dello stesso elemento
(sempre presente quando esiste), parentesi moltiplicate, indici scambiati.

- "Che nome IUPAC ha $\mathrm{Ca(NO_3)_2}$?" Risposta: bis[triossonitrato(V)] di calcio; distrattori:
  triossonitrato(V) di calcio, bis[triossonitrato(III)] di calcio, bis[triossonitrato(V)] di dicalcio.
- "Il nome IUPAC di un sale è tetraossosolfato(VI) di disodio. Qual è la sua formula?" Risposta
  $\mathrm{Na_2SO_4}$; distrattori $\mathrm{Na_2SO_3}$, $\mathrm{NaSO_4}$, $\mathrm{Na(SO_4)_2}$.

## Livello 5: i sali acidi

Un sale acido dell'elenco; metà dal nome tradizionale alla formula, metà dalla formula al nome. Distrattori della
formula: il sale neutro, l'anione con la carica del sale neutro ($\mathrm{Na_2HCO_3}$), un idrogeno in più o in meno,
un indice in più. Distrattori del nome: l'idrogeno dimenticato, idrogeno- e diidrogeno- scambiati, il suffisso
scambiato, idrossi- al posto di idrogeno-, l'idrogeno letto come acqua (monoidrato).

- "Il nome tradizionale di un sale è idrogenocarbonato di calcio. Qual è la sua formula?" Risposta
  $\mathrm{Ca(HCO_3)_2}$; distrattori $\mathrm{CaCO_3}$, $\mathrm{CaHCO_3}$, $\mathrm{Ca(HCO_3)_3}$.
- "Che nome tradizionale ha $\mathrm{NaH_2PO_4}$?" Risposta: diidrogenofosfato di sodio; distrattori: idrogenofosfato
  di sodio, fosfato di sodio, diidrogenofosfito di sodio.

## Livello 6: i sali idrati

Un idrato dell'elenco, nelle tre nomenclature (dichiarata nel testo); metà dal nome alla formula, metà dalla formula
al nome. Distrattori: un altro numero di molecole d'acqua (sempre presente), l'acqua dimenticata o "anidro", il sale
dell'altro numero di ossidazione, il coefficiente spostato sull'idrogeno ($\mathrm{H_{10}O}$), -idrossido al posto di
-idrato.

- "Il nome di Stock di un sale idrato è solfato di rame(II) pentaidrato. Qual è la sua formula?" Risposta
  $\mathrm{CuSO_4 \cdot 5H_2O}$; distrattori $\mathrm{CuSO_4 \cdot 4H_2O}$, $\mathrm{CuSO_4}$,
  $\mathrm{Cu_2SO_4 \cdot 5H_2O}$.
- "Che nome tradizionale ha $\mathrm{Na_2CO_3 \cdot 10H_2O}$?" Risposta: carbonato di sodio decaidrato.

## Esercizi da evitare

- I sali fuori dalla tabella dei sali ammessi (carbonato ferrico, solfito stannico, permanganato ferroso).
- Tra le opzioni di un nome, un nome giusto dello stesso sale in un'altra nomenclatura, o un nome d'uso (bicarbonato,
  carbonato acido).
- Il fosfito: l'acido fosforoso ha solo due idrogeni acidi, e lo ione $\mathrm{PO_3^{3-}}$ dei vecchi eserciziari non
  esiste.
- Sali basici e sali doppi: la lezione non li tratta.

## Verifica

`chim_sali_ternari.py` ricava l'anione togliendo gli idrogeni all'acido e gli dà il nome dal numero di ossidazione
dell'atomo centrale; ricava la formula dalle cariche con il minimo comune multiplo e i nomi dalla formula; trova la
formula di un nome dando il nome a tutti i sali ammessi; ha le sue tabelle dei sali ammessi, dei sali acidi e degli
idrati, scritte da questa specifica.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 229 px su 252).

### Errori piantati

Su 360 esercizi (60 per livello, seed da 300): indice dell'opzione giusta spostato, distrattore uguale alla risposta,
opzione giusta scambiata con un distrattore, opzione giusta alterata (348), parole vietate, solo tre opzioni, un
indice della formula del testo cambiato (191): tutti bocciati.
