# Note: L'equilibrio di un punto materiale e le reazioni vincolari

Lezione nuova (secondo lotto di fisica, gruppo 6, 30 settembre 2026). Conti rifatti in Python: $\sqrt{12^2 + 5^2} = 13$ e
$\tan^{-1}(5/12) = 22{,}6^\circ$; $1{,}5 \cdot 9{,}8 = 14{,}7$, $20{,}7$ e $9{,}7$ N; $2{,}4 \cdot 9{,}8 = 23{,}52 \approx 24$ N;
$20 / \cos 30^\circ = 23{,}09$ e $20 \tan 30^\circ = 11{,}547$ N; $5{,}0 \cdot 9{,}8 = 49$ N e $49 / (2 \cdot 0{,}5) = 49$ N;
la tabella $1 / (2\sin\alpha)$ ($0{,}577$, $1$, $2{,}879$, $5{,}737$, $28{,}65$); $T_1 = 30$ N e $T_2 = 51{,}96$ N con i fili
a $30^\circ$ e $60^\circ$ ($\sqrt{30^2 + 51{,}96^2} = 60$); $\sin^{-1}(19{,}6/128) = 8{,}81^\circ \approx 9^\circ$. Le frecce
delle figure sono in scala (scala scritta nell'`alt`), controllate con gli stessi numeri. `check.mts` passa.

## Struttura ed esempi

Il punto materiale (con il rimando al corpo rigido per le rotazioni), la condizione di equilibrio $\vec{R} = \vec{0}$ con
una nota sul primo principio, la forza equilibrante (esempio 1); vincoli e reazioni vincolari, il piano d'appoggio
(esempio 2, lo stesso libro della lezione sull'attrito), due avvisi (reazione non sempre uguale al peso; peso e reazione
non sono azione e reazione), il filo e la tensione (esempio 3), la molla come vincolo con il link; l'equilibrio per
componenti in cinque passi, l'esempio 4 (filo orizzontale e filo inclinato, angolo dalla verticale) con l'avviso su seno
e coseno scambiati; il corpo appeso a due fili simmetrici (esempio 5), l'avviso sulle tensioni che non si dividono il
peso, i due fili a $30^\circ$ e $60^\circ$ (esempio 6), il paradosso del filo teso con la tabella, la figura interattiva e
l'esempio 7 (l'angolo minimo di un filo per stendere).

## Scelte

- Reazione vincolare $\vec{F}_v$ (mi pare la notazione dell'Amaldi, da verificare); $\vec{N}$ si confonde con il newton e
  $\vec{R}$ è già la risultante. Tensione $\vec{T}$, forza equilibrante $\vec{F}_e$.
- La reazione del piano è introdotta con il terzo principio, citato con il link (è del secondo anno): serve solo per dire
  da dove viene la forza. $F_v = F_\perp$ lega la lezione a quella sull'attrito.
- Piani lisci: l'attrito sul piano inclinato è nella lezione successiva.
- L'equilibrio vale "fermo e resta fermo"; la velocità costante è in una nota, con il link al primo principio.
- Nei fili le forze partono dal corpo, disegnato come una pallina (`\draw[thick, fill=blue!10] circle (0.12)`): il README
  ha il punto materiale come pallino, ma una lampada appesa si legge meglio così. Da confermare.
- La formula generale per due fili con angoli diversi non c'è: l'esempio 6 risolve il sistema, e la figura interattiva
  usa la formula chiusa (scritta nel commento del componente).

## Figure

Sei TikZ, guardate in chiaro e in scuro: `forza-equilibrante-due-forze` (1 cm per 5 N), `reazione-piano-libro-mano`
(frecce di $1{,}03$, $0{,}42$, $1{,}45$ cm), `lampada-filo-tensione`, `filo-orizzontale-filo-inclinato` (componenti di
$\vec{T}$ tratteggiate, lunghe come $\vec{F}$ e $\vec{P}$), `corpo-due-fili-simmetrici` (tre frecce uguali),
`corpo-fili-trenta-sessanta` ($0{,}9$, $1{,}56$, $1{,}8$ cm). Interattiva `corpo-due-fili-tensioni`
(`fisica/CorpoDueFili.tsx`): corpo di $2{,}0$ kg, i due attacchi si trascinano lungo due pareti (angoli da $7{,}1^\circ$ a
$43{,}2^\circ$), tensioni in scala fino a $79$ N ($4$ volte il peso), bottoni "Tendi i fili" e "Ricomincia", le componenti
a richiesta.

## Esercizi

Generatore `fis-equilibrio-punto`, sei livelli (specifica in `specs/exercises/fis-equilibrio-punto.md`), scene
`punto-forze` e `fili-corpo` (nuova, `scenes/FiliCorpo.tsx`).

## Domande per Andrea

- $\vec{F}_v$, $\vec{N}$ o $\vec{R}$ per la reazione vincolare? E "reazione vincolare" o "forza vincolare"?
- Il terzo principio va citato qui (con il link al secondo anno), o la reazione si presenta senza spiegarne l'origine?
- La nota sulla velocità costante (equilibrio e primo principio) è utile al primo anno, o confonde?
- L'esempio 6 (due fili con angoli diversi, un sistema di due equazioni) è da primo anno? Il livello 5 del generatore lo
  usa.
- Il paradosso del filo teso e l'esempio del filo per stendere: l'Amaldi ne parla?
- Il corpo appeso disegnato come una pallina con le forze dal centro, o come un punto?
