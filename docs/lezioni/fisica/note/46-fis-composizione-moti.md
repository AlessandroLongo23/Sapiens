# Note: La composizione dei moti

Lezione nuova (terzo lotto di fisica, gruppo 14, 30 settembre 2026). Conti rifatti in Python: $\sqrt{0{,}40^2 + 0{,}30^2}
= 0{,}50$; $1{,}2 + 0{,}80 = 2{,}0$, $1{,}2 - 0{,}80 = 0{,}40$, $30/0{,}40 = 75$ s, $30/2{,}0 = 15$ s; $\sqrt{1{,}2^2 + 0{,}80^2}
= 1{,}44$; $48/1{,}6 = 30$ s, $1{,}2 \cdot 30 = 36$ m, $\sqrt{1{,}6^2 + 1{,}2^2} = 2{,}0$, $\tan^{-1}0{,}75 = 36{,}87^\circ$,
$\sqrt{48^2 + 36^2} = 60$; $\sin^{-1}0{,}60 = 36{,}87^\circ$, $\sqrt{2{,}5^2 - 1{,}5^2} = 2{,}0$, $48/2{,}0 = 24$ s,
$48/2{,}5 = 19{,}2$ s, $1{,}5 \cdot 19{,}2 = 28{,}8$ m; $\sqrt{240^2 + 70^2} = 250$, $\tan^{-1}(70/240) = 16{,}26^\circ$. Le
figure dei fiumi sono in scala per le velocità ($1$ cm per m/s) e per la traiettoria. `check.mts` passa.

## Struttura

I moti indipendenti lungo gli assi (la gru, con la figura delle posizioni secondo per secondo), il rimando al proiettile
(lezione 55); la velocità che dipende dal riferimento (tapis roulant), con l'esempio 1 e l'avviso sulla somma
vettoriale; la barca sul fiume con le tre velocità, la prua perpendicolare (esempio 2, avviso sul tempo), la prua
controcorrente (esempio 3, avviso seno o tangente), la figura interattiva; l'aereo con il vento (esempio 4); in fondo un
rimando alla lezione del terzo anno sulle trasformazioni di Galileo, senza anticiparle.

## Scelte

- Nomi $\vec{v}_b$ (barca rispetto all'acqua), $\vec{v}_c$ (corrente), $\vec{v}$ (barca rispetto alla riva); gli angoli
  $\beta$ (traiettoria con la prua dritta) e $\alpha$ (prua controcorrente), misurati dalla perpendicolare alla riva.
- La regola generale $\vec{v}_{A,C} = \vec{v}_{A,B} + \vec{v}_{B,C}$ non è scritta con gli indici: è scritta in parole
  per il tapis roulant, per non anticipare il terzo anno.
- Il proiettile è solo nominato, con il link alla lezione 55 (gruppo 16).

## Figure

Tre TikZ, guardate in chiaro e in scuro: `gru-moti-indipendenti`, `barca-fiume-prua-perpendicolare`,
`barca-fiume-prua-controcorrente`. Interattiva `barca-fiume-correnti` (`fisica/BarcaFiume.tsx`, con i pezzi nuovi
`fisica/fiume.tsx`): fiume largo $48$ m, cursori per la barca ($1{,}5$-$3{,}0$ m/s), la corrente ($0$-$2{,}0$ m/s) e la prua
controcorrente ($0^\circ$-$50^\circ$); triangolo delle velocità in $A$, traiettoria, barca che attraversa; letti $v$, il
tempo e il punto d'arrivo rispetto a $B$.

## Esercizi

Generatore `fis-composizione-moti`, cinque livelli (specifica in `specs/exercises/fis-composizione-moti.md`), scena
nuova `fiume-barca` (`scenes/FiumeBarca.tsx`).

## Domande per Andrea

- Gli angoli della barca si misurano dalla perpendicolare alla riva (come qui) o dalla riva?
- Il tapis roulant e il traghetto bastano come esempi di velocità relativa al secondo anno, o l'Amaldi usa altro (il
  treno, la scala mobile)? (da verificare)
- La frase finale che rimanda alle trasformazioni di Galileo va bene, o è meglio non citarle affatto?
