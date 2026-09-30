# Note: Il moto armonico

Lezione nuova (terzo lotto di fisica, gruppo 14, 30 settembre 2026). Conti rifatti in Python: $5{,}0\cos(0{,}25\pi) =
3{,}536$, $5{,}0\cos(0{,}40\pi) = 1{,}545$, $5{,}0\cos(1{,}5\pi) = 0$, in gradi $5{,}0\cos(0{,}785^\circ) = 4{,}9995$;
$2\pi/1{,}5 = 4{,}189$, $4{,}189 \cdot 0{,}12 = 0{,}5027$, $4{,}189^2 \cdot 0{,}12 = 2{,}106$; $2\pi \cdot 440 = 2764{,}6$,
$\cdot 10^{-3} = 2{,}765$, $2764{,}6^2 \cdot 10^{-3} = 7643$ ($780\,g$); $1{,}8/0{,}60 = 3{,}0$, $0{,}60/3{,}0 = 0{,}20$,
$2\pi/3{,}0 = 2{,}094$. Figure: $P$ a $50^\circ$ e a $40^\circ$ su raggi $1{,}6$ e $1{,}3$, con le proiezioni calcolate; il
grafico è $\cos(180^\circ x)$, periodo $2$ cm. `check.mts` passa.

## Struttura

L'ombra del moto circolare (definizione, figura); ampiezza, periodo, frequenza, pulsazione, avviso sull'ampiezza; la
legge oraria $x = A\cos(\omega t)$ con la tabella e il grafico, l'esempio 1 e l'avviso sulla calcolatrice in gradi; la
velocità come componente della velocità di $P$ ($v = -\omega A\sin\omega t$, figura con le due circonferenze),
$v_{max} = \omega A$; l'accelerazione ($a = -\omega^2 x$), $a_{max}$, il legame con la molla (lezione 58), la tabella
centro-estremità, l'avviso; esempi 2, 3 (diapason), 4 (dai massimi al periodo); la figura interattiva.

## Scelte

- Partenza da $x = A$ e legge con il coseno; la fase iniziale non c'è.
- La velocità e l'accelerazione con il seno e il coseno vengono dalle componenti della lezione 15, non da derivate.
- La molla e il pendolo sono della lezione 58 (gruppo 16): qui solo il perché la molla dà un moto armonico, in una frase.
- L'ampiezza del diapason, $1{,}0$ mm, è un ordine di grandezza (da verificare).

## Figure

Tre TikZ, guardate in chiaro e in scuro: `moto-armonico-proiezione-diametro`, `legge-oraria-moto-armonico` (con la riga
`% poi-interattivo:`), `velocita-accelerazione-moto-armonico`. Interattiva `moto-armonico-ombra`
(`fisica/MotoArmonicoOmbra.tsx`): $P$ gira, un tratteggio scende alla sua ombra $Q$ su un binario sotto la
circonferenza, con la velocità sopra il binario e l'accelerazione sotto; ampiezza $0{,}05$-$0{,}20$ m, periodo $2$-$6$ s;
letti $t$, $x$, $v$, $a$, $v_{max}$ e $a_{max}$.

## Esercizi

Generatore `fis-moto-armonico`, cinque livelli (specifica in `specs/exercises/fis-moto-armonico.md`), senza scene.

## Domande per Andrea

- L'Amaldi usa $x = A\cos(\omega t)$ con la partenza dall'estremità, o $s = r\cos(\omega t)$, o il seno? (da verificare)
- "Pulsazione" per $\omega$ nel moto armonico si usa al secondo anno?
- Le formule $v = -\omega A\sin\omega t$ e $a = -\omega^2 A\cos\omega t$ vanno date, o bastano $v_{max}$, $a_{max}$ e
  $a = -\omega^2 x$?
