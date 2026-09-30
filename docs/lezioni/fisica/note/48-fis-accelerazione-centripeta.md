# Note: L'accelerazione centripeta

Lezione nuova (terzo lotto di fisica, gruppo 14, 30 settembre 2026). Conti rifatti in Python: $54/3{,}6 = 15$,
$225/45 = 5{,}0$, $54^2/45 = 64{,}8$; $27{,}3 \cdot 86\,400 = 2{,}359 \cdot 10^6$ s, $4\pi^2 \cdot 3{,}84 \cdot 10^8/T^2 = 2{,}725
\cdot 10^{-3}$ m/s² ($9{,}8/0{,}002725 = 3597$); $464^2/6{,}38 \cdot 10^6 = 0{,}03374$; $3000/60 = 50$ Hz, $\omega = 314{,}16$,
$\omega^2 \cdot 0{,}080 = 7896$ ($806\,g$); giostra $1{,}047^2 \cdot 1{,}0 = 1{,}097$, $\cdot 2{,}5 = 2{,}742$, $2{,}62^2/2{,}5 =
2{,}75$; $\sqrt{4{,}0 \cdot 45} = 13{,}42$ m/s ($48{,}3$ km/h). Le coordinate della figura con i triangoli sono calcolate
($r = 1{,}6$, $v = 1{,}2$, $\Delta\theta = 50^\circ$, $|\Delta\vec{v}| = 1{,}01$). `check.mts` passa.

## Struttura

Perché c'è un'accelerazione ($\vec{a} = \Delta\vec{v}/\Delta t$, la figura con le velocità riportate in $Q$ e
$\Delta\vec{v}$ verso il centro); il modulo con i triangoli simili ($a_c = v^2/r = \omega^2 r = 4\pi^2 r/T^2$); direzione e
verso (figura), l'avviso "uniforme ma accelerato"; esempi 1 (auto, con l'avviso sui km/h), 2 (Luna), 3 (equatore),
4 (centrifuga); come cambia con $v$ e $r$ (esempio 5, la giostra), la velocità massima in curva (esempio 6), l'avviso
"velocità doppia, accelerazione quadrupla"; la figura interattiva; il rimando alla forza centripeta (lezione 57).

## Scelte

- La dimostrazione con i triangoli simili e la corda presa uguale all'arco, senza limiti: come nell'Amaldi (da
  verificare).
- Niente forze: l'attrito delle gomme, la tensione della fionda e la gravità della Luna sono solo nominati, con il link
  alla lezione 57 (gruppo 16). Niente forza centrifuga.
- L'esempio della Luna cita il confronto di Newton ($3600 = 60^2$), senza la gravitazione.

## Figure

Due TikZ, guardate in chiaro e in scuro: `variazione-velocita-moto-circolare`, `accelerazione-centripeta-verso-centro`.
Interattiva `moto-circolare-accelerazione` (`fisica/MotoCircolare.tsx`): raggio $0{,}5$-$2{,}0$ m, periodo $2$-$10$ s,
frecce in scala ($0{,}35$ cm per m/s, $0{,}1$ cm per m/s², che con $T \ge 2$ s non passa mai il centro), letti $v$,
$\omega$ e $a_c$.

## Esercizi

Generatore `fis-accelerazione-centripeta`, cinque livelli (specifica in `specs/exercises/fis-accelerazione-centripeta.md`),
senza scene.

## Domande per Andrea

- La dimostrazione di $a_c = v^2/r$ va tenuta, o al secondo anno basta la formula con la figura della direzione?
- Il simbolo $a_c$ per il modulo e $\vec{a}_c$ per il vettore vanno bene?
- I $4{,}0\,\text{m/s}^2$ delle gomme sull'asfalto bagnato sono un valore ragionevole? (da verificare)
