# Note: L'energia potenziale gravitazionale e la velocità di fuga

Lezione nuova (lotto del terzo anno, gruppo 37, 6 ottobre 2026). Conti rifatti in Python con i dati scritti come nella
lezione:

- esempio 1: $G M_T = 3{,}982 \cdot 10^{14}$; $U = -7{,}058 \cdot 10^{10}$ J in orbita, $U_0 = -7{,}501 \cdot 10^{10}$ J
  al suolo;
- esempio 2: $\Delta U = 4{,}432 \cdot 10^9$ J; $m g h = 1200 \cdot 9{,}81 \cdot 4{,}00 \cdot 10^5 = 4{,}709 \cdot
  10^9$ J, il $6{,}3\%$ in più;
- $m g h$ contro la formula esatta: il rapporto è $1 + h / R_T$, cioè $0{,}016\%$ in più a 1 km, $1{,}57\%$ a 100 km,
  $15{,}7\%$ a 1000 km;
- esempio 3: $\tfrac12 (9{,}00 \cdot 10^3)^2 = 4{,}05 \cdot 10^7$; $G M_T / R_T = 6{,}251 \cdot 10^7$; differenza
  $2{,}201 \cdot 10^7$; $r_{max} = 1{,}809 \cdot 10^7$ m ($2{,}84\,R_T$); quota $1{,}172 \cdot 10^7$ m; con il peso
  costante $8{,}1 \cdot 10^7 / 19{,}62 = 4{,}13 \cdot 10^6$ m;
- esempio 4: $E = -3{,}529 \cdot 10^{10}$ J; $E - E_0 = 3{,}972 \cdot 10^{10}$ J;
- esempio 5: $2 G M_T / R_T = 1{,}250 \cdot 10^8$, $v_f = 1{,}118 \cdot 10^4$ m/s ($40\,250$ km/h); Luna
  $5{,}635 \cdot 10^6$, $v_f = 2374$ m/s; rapporto $4{,}71$;
- $\tfrac12 v_f^2 = 6{,}25 \cdot 10^7$ J/kg; $1/\sqrt2 = 0{,}707$;
- figura interattiva: a $7{,}9$ km/s $r_{max} = 2{,}00\,R_T$; a $11$ km/s $31\,R_T$;
- buchi neri: $2 G M_S / c^2 = 2950$ m, per la Terra $8{,}85$ mm.

`check.mts` passa (lezione, formulario, flashcard).

## Scelte

- Confine con la 77 e la 78 (gruppi 30 e 32): il lavoro come area sotto il grafico forza-posizione e il legame
  $W = -\Delta U$ sono richiamati con il link; qui l'area sotto $1/r^2$ è enunciata, dicendo che la dimostrazione
  chiede strumenti del quinto anno.
- $U = -G M m / r$ con lo zero all'infinito è ricavata dal lavoro enunciato, non data per definizione; i tre punti
  (zero all'infinito, segno, crescita con la distanza) sono un elenco perché sono tre cose distinte da ricordare.
- $m g h$ è ritrovata come caso limite con un passaggio algebrico ($R + h \approx R$), senza limiti.
- Energia totale in orbita, con $K = -U/2$, e poi la velocità di fuga, come nell'elenco dei confini del brief.
- La classificazione delle orbite con il segno di $E$ (ellisse, parabola, iperbole) è enunciata, con i link alle
  lezioni di matematica sulle coniche.
- Buchi neri in un riquadro `ad-note` in fondo, con il raggio di Schwarzschild e l'avvertenza che il conto newtoniano
  dà il valore giusto ma non è una dimostrazione. Non c'è il link alla lezione sulla relatività generale, che è vuota.
- Simboli: $U_0$ ed $E_0$ per i valori sulla rampa di lancio (esempi 1, 2 e 4, e nel grafico di $U$), $v_f$ per la
  velocità di fuga come nel README, $r_{max}$ e $h_{max}$ nel lancio verticale.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `forza-gravitazionale-area-lavoro`,
`grafico-energia-potenziale-gravitazionale`, `lancio-verticale-distanza-massima` (in scala con l'esempio 3: Terra di
1 cm, arresto a 2,84 cm), `energie-satellite-orbita-barre` ($U$ lunga 4 cm, $K$ ed $E$ 2 cm),
`energia-totale-legato-libero` (la retta $E < 0$ a $-1{,}28$ incontra $U = -3{,}2 / r$ in $r = 2{,}5$).

Interattiva `lancio-verticale-energia-fuga` (`fisica/LancioVerticaleFuga.tsx`): cursore della velocità di lancio da 2 a
12 km/s; in alto il grafico di $U/m$ con la retta dell'energia totale, in basso la Terra e il proiettile sullo stesso
asse; il bottone lo fa salire e ricadere (passi di $r'' = -G M / r^2$, 1500 volte più veloce del vero). Risponde a:
"con quale velocità il proiettile arriva a una quota uguale al raggio terrestre, e che cosa succede vicino a
$11{,}2$ km/s?" Il testo dopo la figura dà le risposte.

## Da verificare

- Voyager lanciate nel 1977 e uscite dal Sistema Solare (dall'eliosfera: Voyager 1 nel 2012).
- Razzo Saturn V "alto più di 100 m" (110 m).
- Michell (1783) e Laplace (1796) per le "stelle oscure": il testo dice solo "nel Settecento".
- Raggio del Sole $696\,000$ km; $c = 3{,}00 \cdot 10^8$ m/s.
- Buco nero al centro della Galassia: circa quattro milioni di masse solari (Sagittarius A*).
- "Il raggio che si ottiene, detto raggio di Schwarzschild, è lo stesso" della relatività generale.
- L'atmosfera della Luna: la spiegazione con la velocità di fuga è quella dei libri, ma è semplificata (conta anche
  il vento solare).

## Domande per Andrea

- La formula del lavoro tra $r_1$ e $r_2$ enunciata senza dimostrazione va bene, o i libri in adozione la ricavano con
  la media geometrica della forza su tratti piccoli?
- Il lavoro "contro la gravità" per salire di quota (uguale a $\Delta U$): è la formulazione dell'Amaldi, o si parla
  solo di lavoro della forza di gravità, negativo?
- La tabella $E < 0$, $E = 0$, $E > 0$ con ellisse, parabola e iperbole è al livello del terzo anno?
- Il riquadro sui buchi neri: va bene qui, o si rimanda tutto alla lezione sulla relatività generale del quinto anno?

## Esercizio guidato

L'esempio 3 (fin dove arriva un proiettile lanciato in verticale) renderebbe di più come esercizio guidato. Si
fermerebbe in tre punti: "si può usare $m g h$?" (no, e perché); "quanto vale l'energia cinetica nel punto più alto, e
quale distanza è l'incognita?"; "il numero trovato è la quota o la distanza dal centro?".

## Esercizi

Generatore `fis-energia-gravitazionale`, cinque livelli (specifica in `specs/exercises/fis-energia-gravitazionale.md`):
L'energia potenziale, con il segno; Dalla superficie a una quota; Fin dove arriva un proiettile; L'energia di un
satellite in orbita; La velocità di fuga. Scena `orbita-pianeta` ai livelli 2 e 3. L'esempio 4 (l'energia per mettere
in orbita un satellite, differenza tra due energie totali) e il raggio di Schwarzschild non hanno un livello.

Prerequisiti proposti: fis-campo-gravitazionale, fis-satelliti, energia, fis-forze-conservative-energia
