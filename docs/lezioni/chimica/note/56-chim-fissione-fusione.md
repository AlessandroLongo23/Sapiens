# Note: Fissione e fusione nucleare

Lezione nuova (terzo anno di chimica, gruppo C, 6 ottobre 2026), capitolo "Il nucleo e la radioattività", terza di
tre. Non pubblicata. `check.mts` passa su lezione, formulario e flashcard; resta l'avviso sul titolo "La fusione sulla
Terra", dove la maiuscola è del nome proprio. Conti degli esempi rifatti in Python (script nello scratchpad).

## Struttura

Il difetto di massa, con l'elio-4; $E = m\,c^2$ e l'energia di legame, con le conversioni (unità di massa atomica,
joule, megaelettronvolt) e l'esempio 1; l'energia di legame per nucleone, con il ferro-56 (esempio 2), la curva e la
regola "si libera energia salendo sulla curva", poi la figura interattiva; la fissione, con la scoperta, l'esempio 3,
la reazione a catena (figura, tre casi, massa critica, arricchimento) e le centrali; la fusione, con la reazione
deuterio-trizio (figura, esempio 4), le stelle (esempio 5) e la fusione sulla Terra; una tabella di confronto. Cinque
esempi svolti.

## Scelte e convenzioni

- Masse: da AME2020 (Wang e altri, "The AME 2020 atomic mass evaluation (II)", Chinese Physics C 45, 030003, 2021),
  scaricato dal sito dell'IAEA il 6 ottobre 2026, a cinque decimali di unità di massa atomica. Protone
  $1{,}00728\,\text{u}$, neutrone $1{,}00866\,\text{u}$. Molti libri scrivono $1{,}00867$ per il neutrone; il valore
  è $1{,}008665$ e a cinque decimali dà $1{,}00866$.
- Massa del nucleo e massa dell'atomo: negli esempi 1 e 2 la lezione dà la massa del nucleo (massa dell'atomo meno $Z$
  elettroni), così il conto è quello della definizione. Negli esempi 3 e 4 dà le masse degli atomi e dice che gli
  elettroni si cancellano. Alcuni libri usano la massa dell'atomo di idrogeno al posto di quella del protone.
- Unità: i conti sono in joule, come chiede il brief, con $1\,\text{u} = 1{,}6605 \cdot 10^{-27}\,\text{kg}$ e il
  numero pronto $1{,}494 \cdot 10^{-10}\,\text{J}$ per unità di massa atomica. Il megaelettronvolt è introdotto
  ($1\,\text{MeV} = 1{,}60 \cdot 10^{-13}\,\text{J}$) e usato per l'energia di legame per nucleone, perché la curva di
  tutti i libri è in megaelettronvolt. Il fattore $931{,}5\,\text{MeV}$ per unità di massa atomica non c'è.
- Con $c = 3{,}00 \cdot 10^8\,\text{m/s}$ e $1{,}60 \cdot 10^{-13}\,\text{J/MeV}$ l'energia di legame dell'elio-4
  viene $28{,}4\,\text{MeV}$; il valore di AME2020 è $28{,}3$. Per nucleone la lezione scrive $7{,}1$ e $8{,}8$.
- La curva dell'energia di legame, in TikZ e nella figura interattiva, è fatta con i valori veri di AME2020.
- Fissione: l'esempio usa bario-141 e kripton-92, la divisione dei libri. L'energia dal difetto di massa è
  $174\,\text{MeV}$; i "circa $200\,\text{MeV}$" comprendono i decadimenti dei frammenti, e la lezione lo dice.
- Il Sole è scritto come $4\,{}^{1}_{1}\mathrm{H} \longrightarrow {}^{4}_{2}\mathrm{He} + 2\,{}^{\ 0}_{+1}e$, senza i
  passaggi della catena protone-protone e senza neutrini.
- Niente sulla bomba oltre a due frasi; niente sul referendum italiano del 1987 e sulla storia delle centrali in
  Italia.

## Da verificare

- Hahn e Strassmann, Berlino, 1938; Meitner e Frisch, la spiegazione e il nome: a memoria.
- Einstein, 1905.
- Il potere calorifico del carbone, "circa $3 \cdot 10^7\,\text{J/kg}$".
- La potenza irraggiata dal Sole, $3{,}8 \cdot 10^{26}\,\text{W}$, la sua massa, $2{,}0 \cdot 10^{30}\,\text{kg}$, e la
  temperatura al centro, quindici milioni di gradi.
- Černobyl' 1986, Fukushima 2011; ITER in costruzione nel sud della Francia; "oggi nessun impianto a fusione produce
  più energia elettrica di quanta ne consuma" (vero a ottobre 2026 per quanto ne so: da ricontrollare alla
  pubblicazione).
- Moderatore e barre di controllo: cadmio e boro come materiali delle barre.
- "Scorie con tempi di dimezzamento di decine di migliaia di anni": il plutonio-239 ha $24\,100$ anni (NUBASE2020).

## Figure

Tre TikZ, guardate in chiaro e in scuro: `fissione-fusione-curva-energia-legame` (copiata nel formulario),
`fissione-fusione-reazione-catena`, `fissione-fusione-deuterio-trizio`.

Una interattiva, `fissione-fusione-curva-energia` (`FissioneFusioneCurva.tsx`): la curva vera dell'energia di legame
per nucleone, un cursore per il numero di massa (per ogni $A$ il nucleo più legato) e la scelta tra dividere il nucleo
in due parti uguali e fonderlo con un altro uguale. La figura segna il nucleo scelto e quello che si forma, disegna i
due livelli e la freccia tra loro (verde in su, energia liberata; rossa in giù, energia assorbita) e dà la reazione e
l'energia in megaelettronvolt. Quello che si deve vedere, e che il testo dice dopo: l'uranio-235 diviso libera più di
$200\,\text{MeV}$, il ferro-56 assorbe energia in tutti e due i modi, due nuclei di deuterio fusi liberano
$24\,\text{MeV}$. Guardata in chiaro, in scuro e a 390 px, ai valori iniziali e con altri nuclei: nessun errore in
console, nessuno scorrimento laterale. Limite dichiarato nel testo: i frammenti sono uguali e sono i nuclei più legati
con quel numero di massa, mentre una fissione vera dà frammenti diversi e neutroni.

## Esercizio guidato

L'esempio 3 (l'energia della fissione dell'uranio-235). Si fermerebbe in tre punti: quanti neutroni restano nel
bilancio delle masse; quanto vale il difetto di massa; quanti nuclei ci sono in un grammo.

Prerequisiti proposti: chim-radioattivita, numero-massa, mole-massa-molare

## Esercizi

Generatore `chim-fissione-fusione`, sei livelli (specifica in `specs/exercises/chim-fissione-fusione.md`): il difetto
di massa; l'energia di legame in joule; l'energia di legame per nucleone; il nucleo più stabile tra quattro; l'energia
di una fissione o di una fusione dalle masse; l'energia di una massa di combustibile. Tutte le masse sono vere
(AME2020). Tutto a scelta multipla: nessuna risposta è un numero puro.

## Dubbi per Andrea

- Joule o megaelettronvolt? La lezione calcola in joule e converte; i libri di fisica lavorano in megaelettronvolt
  con $931{,}5\,\text{MeV}$ per unità di massa atomica. Quale delle due strade vuoi negli esercizi?
- Massa del nucleo o massa dell'atomo negli esercizi sul difetto di massa? Qui il livello 1 dà la massa del nucleo.
- Il neutrone a $1{,}00866\,\text{u}$ (arrotondamento giusto) o a $1{,}00867$ (come molti libri)?
- Le centrali: bastano due paragrafi (moderatore, barre di controllo, scorie, incidenti), o serve di più, per esempio
  per educazione civica?
- La nucleosintesi nelle stelle (tre frasi) va tenuta in una lezione di chimica?
