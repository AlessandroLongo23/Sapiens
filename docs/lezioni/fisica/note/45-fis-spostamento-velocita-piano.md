# Note: Spostamento e velocità nel piano

Lezione nuova (terzo lotto di fisica, gruppo 14, 30 settembre 2026). Conti rifatti in Python: $\sqrt{30^2 + 40^2} = 50$,
$\tan^{-1}(40/30) = 53{,}13^\circ$; $240/5{,}0 = 48$ s, $180/5{,}0 = 36$ s, $\sqrt{240^2 + 180^2} = 300$, $300/84 = 3{,}571$,
$420/84 = 5{,}0$, $\tan^{-1}(180/240) = 36{,}87^\circ$; $75\cos 12^\circ = 73{,}36$, $75\sin 12^\circ = 15{,}59$, in $10$ s
$155{,}9$ m; $\sqrt{1{,}2^2 + 0{,}50^2} = 1{,}3$, $\tan^{-1}(-0{,}50/1{,}2) = -22{,}62^\circ$, $337{,}4^\circ$. Figure TikZ: la
tangente di $y = 0{,}2x^2$ in $x = 1$ ha pendenza $0{,}4$; la velocità dell'aereo è in scala ($4$ cm per $75$ m/s). `check.mts`
passa.

## Struttura

Il vettore posizione $\vec{s}$ (componenti uguali alle coordinate, dipende dall'origine); lo spostamento
$\Delta\vec{s} = \vec{s}_2 - \vec{s}_1$ con componenti e modulo, l'esempio 1 e l'avviso sullo spostamento che non è la
posizione né la strada; la velocità media vettoriale e la velocità scalare media, con l'esempio 2 del ciclista; la
velocità istantanea tangente (la corda che diventa tangente, le scintille della mola), la figura interattiva, l'avviso
sulla velocità che non va verso la meta; le componenti della velocità con gli esempi 3 (aereo) e 4 (quarto quadrante) e
l'avviso sul modulo che non è la somma.

## Scelte

- Notazioni del README del secondo anno: $\vec{s}$ per il vettore posizione, $\Delta\vec{s}$ per lo spostamento,
  $\vec{v}_m$ per la velocità media, $v_{m,x}$ e $v_{m,y}$ per le sue componenti. I gruppi 12 e 13 scrivono in parallelo
  le lezioni 38-44: la velocità media sulla retta potrebbe avere un altro simbolo, da allineare.
- "Velocità scalare media" per distanza percorsa diviso tempo: il nome non è in tutti i libri (vedi le domande).
- L'accelerazione nel piano non c'è: la introduce la lezione 48, con l'accelerazione centripeta.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `vettore-posizione-piano`, `spostamento-piano-due-posizioni`,
`ciclista-est-nord-velocita-media` (in scala, $1$ cm per $75$ m), `velocita-media-verso-tangente`,
`componenti-velocita-aereo`. Interattiva `velocita-media-tangente` (`fisica/VelocitaMediaTangente.tsx`): il punto si
muove su $x = 0{,}3 + t$, $y = 0{,}25\,t^2$; cursori per l'istante di $P$ e per $\Delta t$, e $Q$ si trascina lungo la
curva; letti $\Delta t$, $\Delta s$, $v_m$, $v$ e l'angolo tra velocità media e tangente.

## Esercizi

Generatore `fis-spostamento-velocita-piano`, cinque livelli (specifica in
`specs/exercises/fis-spostamento-velocita-piano.md`), scena `vettori-piano` del primo anno.

## Domande per Andrea

- La distanza percorsa divisa per il tempo: l'Amaldi la chiama "velocità scalare media", "velocità media sul percorso" o
  non la nomina? (da verificare)
- Il vettore posizione si scrive $\vec{s}$ (come lo spostamento $\Delta\vec{s}$) o $\vec{r}$, come in molti libri del
  triennio?
- La velocità istantanea come limite della velocità media è detta a parole, con la corda che diventa tangente, senza la
  parola "limite": basta al secondo anno?
