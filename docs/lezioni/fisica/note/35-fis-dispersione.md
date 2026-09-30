# Note: La dispersione della luce e i colori

Lezione nuova, secondo lotto di fisica, gruppo 11, 30 settembre 2026. Numeri rifatti in Python (angoli di rifrazione del
rosso e del violetto, raggi del prisma e della goccia); `check.mts` passa sui tre file.

## Struttura ed esempi

Newton e il prisma; lo spettro e la dispersione; luce monocromatica e ricomposizione; l'indice che dipende dal colore
(tabella per un vetro ottico comune); arcobaleno; colore dei corpi (diffusione e assorbimento, luce colorata); sintesi
additiva e sottrattiva, con il colore dei corpi gialli, ciano e magenta. Esempi: rosso e violetto nel vetro a
$60^\circ$ ($34{,}9^\circ$ e $34{,}5^\circ$); maglietta rossa in luce blu; banana in luce rossa e blu. Avvisi: il prisma
non colora la luce; chi devia di più; il colore non è solo dell'oggetto; giallo e blu con le luci e con le tempere.

## Scelte

- Le lunghezze d'onda non ci sono: la luce come onda è nel quarto anno ("La natura ondulatoria della luce").
- I colori dei corpi e dei filtri sono spiegati con i tre primari additivi (giallo = rosso + verde), perché serve alla
  sintesi sottrattiva. È una semplificazione: un corpo giallo vero può diffondere anche il giallo "puro" dello spettro.
- Sette colori dello spettro "per tradizione", come Newton; lo spettro è continuo.

## Dati e fonti

- Newton: esperimenti del 1666 e lettera "New Theory about Light and Colours", Philosophical Transactions of the Royal
  Society, 1672. Date che cito a memoria: da verificare.
- Indici del vetro della tabella: sono quelli del vetro ottico N-BK7 del catalogo Schott (rosso 656 nm $1{,}514$, giallo
  589 nm $1{,}517$, azzurro 486 nm $1{,}522$, violetto 405 nm $1{,}530$), citati a memoria: da verificare sulla scheda
  Schott.
- Acqua: rosso $1{,}331$, violetto $1{,}343$, a memoria: da verificare.
- Figura interattiva: vetro flint F2 dello stesso catalogo, $n_C = 1{,}61503$ (656 nm), $n_d = 1{,}62004$ (589 nm),
  $n_F = 1{,}63208$ (486 nm), con la formula di Cauchy $n = A + B/\lambda^2$ ricavata da $n_C$ e $n_F$ ($A = 1{,}59431$,
  $B = 0{,}008924\,\mu\text{m}^2$), che ridà $n_d$ alla quinta cifra. Valori a memoria: da verificare.
- Arcobaleno: $42{,}4^\circ$ per il rosso e $40{,}6^\circ$ per il violetto, calcolati con la deviazione minima e gli
  indici dell'acqua qui sopra; secondo arco "circa $51^\circ$" a memoria: da verificare.

## Figure

Statiche: `prisma-dispersione-luce-bianca` (prisma equilatero, raggi calcolati con Snell con indici esagerati, $1{,}48$ e
$1{,}62$, e la lezione lo dice), `arcobaleno-goccia` (rifrazione, riflessione, rifrazione calcolate con $1{,}33$ e $1{,}40$,
esagerato). Il rosso e il violetto sono colori definiti con `\definecolor` (RGB 184,46,46 e 166,94,237), scelti perché
nel tema scuro, invertito con `invert` e `hue-rotate`, restano un rosso e un viola distinti; `red` e `violet` di xcolor
diventavano due rosa quasi uguali. La luce bianca è una freccia nera (bianca nel tema scuro).

Interattive:

- `prisma-dispersione-colori` (`PrismaDispersione.tsx`): sei colori tracciati con Snell attraverso un prisma di F2,
  angolo da trascinare o con il cursore, schermo, deviazioni del rosso e del violetto; un interruttore allarga di tre
  volte le differenze tra gli indici (la separazione vera è di circa $3^\circ$). Riflessione totale sulla seconda faccia
  sotto i $30^\circ$ circa. I raggi colorati sono in un secondo SVG sopra il disegno, fuori dall'inversione del tema
  scuro, così lo spettro resta uno spettro. Guardata in chiaro, in scuro, sul telefono, a $30^\circ$ e a $76^\circ$.
- `sintesi-additiva-sottrattiva` (`SintesiColori.tsx`): tre cerchi che si sommano (`mix-blend-mode: screen`, su schermo
  scuro) o si sottraggono (`multiply`, su foglio bianco), ognuno da accendere e spegnere. Non usa `Drawing` del kit, per
  la stessa ragione: i colori non si devono invertire.

## Esercizi

Generatore `fis-dispersione`, sei livelli: i colori nel prisma; corpi in luce colorata; sintesi additiva; sintesi
sottrattiva (filtri o inchiostri); corpi gialli, ciano e magenta; separazione tra rosso e violetto al decimo di grado.
Nessuna scena.

## Domande per Andrea

- Il colore dei corpi con i tre primari (un corpo giallo diffonde rosso e verde): va bene per il primo anno?
- Sette colori con l'indaco (qui, per tradizione) o sei?
- Sintesi sottrattiva: primari ciano, magenta, giallo (qui) o rosso, giallo, blu come nell'educazione artistica?
- Serve un esercizio numerico sulla dispersione (livello 6), o bastano le domande qualitative?
- L'arcobaleno secondario va tenuto?
