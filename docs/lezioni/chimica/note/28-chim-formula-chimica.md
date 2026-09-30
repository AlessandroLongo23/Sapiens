# Note: La formula chimica e il suo significato

Lezione nuova (biennio di chimica, gruppo 25, 30 settembre 2026). Conteggi rifatti in Python: $\mathrm{Al_2(SO_4)_3}$
$2 + 3 + 12 = 17$; $\mathrm{(NH_4)_3PO_4}$ $3 + 12 + 1 + 4 = 20$; $\mathrm{NH_4NO_3}$ due azoti; $2\,\mathrm{Ca(NO_3)_2}$
dodici ossigeni; $\mathrm{CuSO_4 \cdot 5H_2O}$ $1 + 1 + 9 + 10 = 21$. `check.mts` passa.

## Struttura

Simboli e indici con quattro esempi e la figura RDKit (acido solforico ed etanolo, per ritrovare la formula dal
disegno); significato qualitativo e quantitativo (molecola e unità formula) con il link alla lezione 01 per la massa;
l'avviso sulle maiuscole ($\mathrm{Co}$ e $\mathrm{CO}$); le formule degli elementi; indici e coefficienti con la
figura TikZ di $\mathrm{H}$, $2\mathrm{H}$, $\mathrm{H_2}$, $2\mathrm{H_2}$ e l'avviso sul coefficiente; le formule degli
ioni con la tabella per carica; la formula di un composto ionico in quattro passi, l'esempio 1 con cinque composti e
gli avvisi sulle parentesi e sulla semplificazione; contare gli atomi in quattro passi con gli esempi 2, 3, 4 e la
figura interattiva; gli idrati con l'esempio 5 e l'avviso sull'ossigeno.

## Scelte

- Gli ioni e la loro carica sono sia nella lezione 27 (che cosa sono) sia qui (come si scrivono e come si mettono
  insieme in una formula): la sovrapposizione è voluta, perché la formula dei composti ionici è il punto dove gli
  studenti sbagliano di più.
- La formula dagli ioni si fa con il minimo comune multiplo delle cariche, non con la regola dell'"incrocio", che
  porta a $\mathrm{Mg_2O_2}$; l'avviso lo dice.
- Nessuna mole, come chiesto: la massa della molecola è solo un rimando alla lezione 01.
- Nomi dei composti con la nomenclatura tradizionale (solfato di alluminio, idrossido di calcio): la nomenclatura è
  al terzo anno.

## Figure

RDKit `formula-acido-solforico-etanolo` (con tutti gli atomi), guardata in chiaro e in scuro. TikZ `formula-h-2h-h2-2h2`
(le quattro scritture a sfere), guardata in chiaro e in scuro.

Interattiva `costruisci-formula-atomi` (`chimica/CostruisciFormula.tsx`, con `chimica/sfereDalton.tsx`): otto formule
($\mathrm{H_2O}$, $\mathrm{CO_2}$, $\mathrm{NH_3}$, $\mathrm{CH_4}$, $\mathrm{H_2SO_4}$, $\mathrm{Ca(OH)_2}$,
$\mathrm{Al_2(SO_4)_3}$, $\mathrm{CuSO_4 \cdot 5H_2O}$); per ogni elemento due bottoni aggiungono o tolgono atomi
(al più 13), che compaiono come sfere in una riga per elemento. "Controlla" scrive accanto a ogni riga "giusti",
"troppi" o "mancano", e sotto dà un suggerimento per l'elemento sbagliato (la parentesi, l'acqua dell'idrato) o, se è
tutto giusto, come si contano gli atomi. Guardata in chiaro, in scuro, sul telefono, dopo un conteggio sbagliato e
dopo uno giusto; nessun errore in console, niente scorrimento laterale.

## Esercizi

Generatore `chim-formula-chimica`, sei livelli (specifica in `specs/exercises/chim-formula-chimica.md`). Senza scene.

## Domande per Andrea

- La formula dei composti ionici si insegna al primo anno, o solo al terzo con la nomenclatura? La lezione la mette
  qui perché il programma (DM 211/2010) dice "la formula chimica" nel primo biennio, e perché serve per contare gli
  atomi con le parentesi.
- Il metodo del minimo comune multiplo delle cariche, o l'"incrocio" delle cariche con la semplificazione dopo?
- Gli idrati sono nel programma del primo anno? Negli esercizi c'è un livello intero.
- Il cloruro di cobalto esaidrato e il solfato di zinco eptaidrato negli esercizi hanno elementi ($\mathrm{Co}$,
  $\mathrm{Zn}$) che le lezioni non nominano: vanno bene, visto che si contano solo gli atomi?
