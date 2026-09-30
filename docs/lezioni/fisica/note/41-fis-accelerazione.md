# Note: L'accelerazione

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 12, 30 settembre 2026). Conti rifatti in Python:
$12 / 6{,}0 = 2{,}0$ m/s² e $16 / 6{,}0 = 2{,}7$ (esempio 1 e avviso); $100 / 3{,}6 = 27{,}78$ m/s, $27{,}78 / 8{,}0 = 3{,}47$
m/s², $100 / 8{,}0 = 12{,}5$ e $12{,}5 / 3{,}6 = 3{,}47$ (esempio 2 e avviso); tabella: $27{,}78 / 12 = 2{,}31$ e
$27{,}78 / 4{,}0 = 6{,}94$ m/s²; $-20 / 4{,}0 = -5{,}0$ m/s² (esempio 3); $(-4 + 12)/2 = 4{,}0$ e $(-4 - 12)/2 = -8{,}0$
(esempio 4 e avviso); $20 / 0{,}40 = 50$ s (esempio 5). Nella figura dei quattro casi le distanze tra i punti crescono
($1{,}1$, $1{,}35$, $1{,}6$ cm) o calano come le frecce della velocità. `check.mts` passa.

## Struttura ed esempi

Accelerazione media e unità (esempio 1, avviso sulla velocità finale, esempio 2 con i km/h e il suo avviso, tabella di
accelerazioni); il segno (esempio 3 della frenata, figura e tabella dei quattro casi, esempio 4 della frenata con
l'accelerazione positiva, avvisi su "negativa non vuol dire frenare" e sul meno davanti alla parentesi); le formule
inverse (esempio 5 del treno) con il rimando al moto uniformemente accelerato; l'accelerazione istantanea e la pendenza
nel grafico velocità-tempo (figura dello scooter, rimando alla lezione 43); avviso finale "velocità grande non vuol dire
accelerazione grande".

## Scelte

- Le formule inverse $\Delta v = a_m\,\Delta t$ e $\Delta t = \Delta v / a_m$ sono ricavate dalla definizione, senza la
  legge $v = v_0 + a\,t$, che è della lezione 42 (gruppo 13): la lezione le cita solo con un link.
- La parola "decelerazione" compare una volta, nell'avviso, per dire che il segno non basta a capire se il corpo frena.
- I tempi da $0$ a $100$ km/h ($12$ s per un'utilitaria, $4$ s per una sportiva) sono indicativi e arrotondati, da
  verificare se si vogliono citare modelli veri; le accelerazioni della tabella sono calcolate da quei tempi.
- La figura del grafico velocità-tempo dello scooter anticipa la lezione 43 con un grafico solo e un rimando.

## Figure

Due TikZ, guardate in chiaro e in scuro: `segno-velocita-accelerazione-quattro-casi` (velocità in blu scuro, accelerazione
in verde come da convenzione), `accelerazione-pendenza-velocita-tempo` ($0{,}8$ cm per secondo, $1$ cm ogni $4$ m/s).
Nessuna interattiva: la lezione è di definizioni e segni, e i grafici velocità-tempo animati stanno meglio nella lezione
43.

## Esercizi

Generatore `fis-accelerazione`, cinque livelli (specifica in `specs/exercises/fis-accelerazione.md`), senza scene.

## Domande per Andrea

- $a_m$ per l'accelerazione media e $a$ per quella istantanea: come l'Amaldi?
- "Metri al secondo quadrato" o "metri al secondo per secondo": quale si legge in classe?
- La frenata con l'accelerazione positiva (corpo che va nel verso negativo) è nel programma di seconda, o confonde?
- Il livello 4 del generatore usa $\Delta v = a\,\Delta t$: va bene qui o si sposta nella lezione 42?
