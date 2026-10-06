# Note: Velocità angolare e accelerazione angolare

Lezione nuova (lotto del terzo anno, gruppo 34, 6 ottobre 2026). Conti rifatti in Python con i dati scritti come nella
lezione: $2\pi \cdot 900/60 = 94{,}25$ rad/s; $2\pi \cdot 1200/60 = 125{,}66$ rad/s, $125{,}66/8{,}0 = 15{,}71$ rad/s²;
$-12/6{,}0 = -2{,}0$ rad/s², $72 - 36 = 36$ rad, $36/2\pi = 5{,}73$ giri; $2\pi \cdot 5{,}0 = 31{,}42$ rad,
$(64 - 400)/62{,}83 = -5{,}348$ rad/s², $-12/(-5{,}348) = 2{,}24$ s; $3{,}0 \cdot 0{,}40 = 1{,}2$,
$9{,}0 \cdot 0{,}40 = 3{,}6$, $\sqrt{1{,}2^2 + 3{,}6^2} = 3{,}79$ m/s², e con $\omega = 6{,}0$ rad/s $a_c = 14{,}4$ m/s².
`check.mts`: 0 errori, 0 avvisi sui tre file.

## Confini

- Dal biennio (lezione 47) la lezione prende radianti, $\omega$, $v = \omega r$ e li richiama in una riga con il link;
  dalla 48 l'accelerazione centripeta. Qui di nuovo ci sono: il corpo rigido che ruota attorno a un asse fisso, la
  posizione e lo spostamento angolare con il segno, $\omega$ media e istantanea, $\alpha$, le tre leggi del moto
  circolare uniformemente accelerato, $a_t = \alpha r$ e l'accelerazione totale.
- Il vettore $\vec\omega$ è solo in un riquadro `ad-note` (direzione dell'asse, mano destra, link alla 71): con
  l'asse fisso serve solo il segno. Il vettore $\vec\alpha$ compare in una riga della 88.
- Niente dinamica: l'ultimo paragrafo rimanda alle lezioni 87 e 88. Niente rotolamento (lezione 89): la ruota
  dell'esempio 3 è quella di una bicicletta capovolta.

## Scelte

- Simboli del README: $\theta$, $\omega$, $\alpha$; $\omega_0$ e $\theta_0$ all'istante zero; $a_t$ e $a_c$. Angoli
  positivi in senso antiorario, come il segno del momento al primo anno.
- La legge $\theta = \theta_0 + \omega_0 t + \frac{1}{2}\alpha t^2$ è ricavata dall'area sotto il grafico di $\omega$
  (rettangolo più triangolo), come nel biennio per il moto rettilineo; la terza relazione per sostituzione, detta e non
  svolta (la lezione 42 ha già $v^2 = v_0^2 + 2a\,\Delta s$ come "relazione senza il tempo").
- La tabella delle corrispondenze tra moto rettilineo e rotazione sta in questa lezione; le lezioni 87 e 88 la
  continuano con massa e forza.
- Nell'esempio 1 i $1200$ giri al minuto sono un numero esatto (come nella 47), e il risultato ha le due cifre del
  tempo.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `spostamento-angolare-disco`, `grafico-velocita-angolare-tempo-area` (con
`% poi-interattivo`), `accelerazione-tangenziale-centripeta` (in scala con l'esempio 4: $0{,}4$ cm per m/s², quindi
$0{,}48$ e $1{,}44$ cm; il punto è a $40^\circ$ su una circonferenza di raggio $2$ cm).

Interattiva `disco-accelerazione-angolare` (`fisica/DiscoAccelerazioneAngolare.tsx`). Domanda: che cosa succede alle
due componenti dell'accelerazione mentre il disco prende velocità? Risposta nel testo subito dopo: la tangenziale resta
costante, la centripeta cresce con $\omega^2$, l'accelerazione totale ruota verso il centro. Cursori: $\alpha$ da
$0{,}5$ a $2$ rad/s², distanza del punto da $1$ a $2$ m (più vicino all'asse frecce e nomi si accavallavano sul centro); il moto si ferma a $\omega = 1{,}8$ rad/s, perché oltre la
freccia centripeta supererebbe il centro. Le due componenti sono frecce sottili continue e non tratteggiate, come
invece nella figura TikZ: sono corte, e il tratteggio non si leggeva. La velocità non è disegnata (sta sulla stessa
retta di $\vec a_t$ e la copriva): è nei valori sotto la figura.

## Esercizio guidato

L'esempio 3 (la ruota frenata senza il tempo). Si fermerebbe in tre punti: quale delle tre leggi serve se il tempo non
è tra i dati; quanti radianti sono $5{,}0$ giri; quale segno deve avere $\alpha$ e perché.

## Esercizi

Generatore `fis-cinematica-rotazionale`, sette livelli (specifica in `specs/exercises/fis-cinematica-rotazionale.md`),
senza scene. L'accelerazione totale dell'esempio 4 e il caso senza tempo con i giri dell'esempio 3 non hanno un
livello.

## Da verificare

- Il nome "moto circolare uniformemente accelerato" per il moto di un punto con $\alpha$ costante: è quello
  dell'Amaldi? (usato nel brief e nella lezione)
- I $900$ giri al minuto del trapano e i $1200$ della centrifuga in $8{,}0$ s sono valori plausibili scritti a
  memoria, non presi da una scheda tecnica.

## Domande per Andrea

- Il vettore velocità angolare va trattato per intero al terzo anno (con $\vec v = \vec\omega \times \vec r$), o basta
  il riquadro?
- L'accelerazione angolare istantanea è definita "su un intervallo brevissimo", come la velocità istantanea del
  biennio: va bene, o serve il grafico con la pendenza della tangente?
- L'angolo dell'accelerazione totale con il raggio ($\tan\beta = a_t/a_c$) è stato lasciato fuori: serve?

Prerequisiti proposti: fis-moto-circolare-uniforme, fis-accelerazione-centripeta, moto-uniforme-accelerato, fis-grafico-velocita-tempo
