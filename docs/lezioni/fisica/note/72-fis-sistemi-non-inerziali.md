# Note: Sistemi di riferimento inerziali e non inerziali

Lezione nuova (lotto del terzo anno di fisica, gruppo 31, 6 ottobre 2026). Conti rifatti in Python con i dati scritti come
nella lezione: $\sqrt{2 \cdot 6{,}0/3{,}0} = 2{,}0$ s, $12 \cdot 2{,}0 - \tfrac{1}{2} \cdot 3{,}0 \cdot 4{,}0 = 18$ m;
$\tan^{-1}(3{,}0/9{,}8) = 17{,}02^\circ$, $0{,}10 \cdot \sqrt{9{,}8^2 + 3{,}0^2} = 1{,}025$ N; $9{,}8 \tan 5^\circ = 0{,}857$
m/s²; $\sqrt{3{,}0/9{,}8} = 0{,}553$ s, $\sqrt{3{,}0/11{,}0} = 0{,}522$ s, $\sqrt{3{,}0/8{,}6} = 0{,}591$ s;
$\omega = 2\pi/86\,400 = 7{,}27 \cdot 10^{-5}$ rad/s, $\omega^2 R_T = 0{,}0337$ m/s² ($0{,}34\%$ di $g$); per l'orbita
$\omega = 1{,}99 \cdot 10^{-7}$ rad/s, $\omega^2 r = 5{,}9 \cdot 10^{-3}$ m/s² ($0{,}06\%$ di $g$).

## Confini

- La 50 del biennio ha già la definizione di sistema inerziale, l'autobus che frena con il pallone e il suolo come sistema
  quasi inerziale, in una sezione. Qui si riparte dallo stesso autobus (il link è nella prima riga) e si va oltre: i due
  osservatori, la prova del corpo libero, l'accelerazione relativa $\vec a\,' = -\vec A$ ricavata dalle leggi orarie, il
  pendolo come accelerometro, la caduta in ascensore, la piattaforma che ruota, il conto sulla Terra.
- Tutti i conti si fanno dal sistema inerziale. La forza apparente si nomina una volta sola, con il link alla 75, dove
  il pendolo torna risolto dall'interno del veicolo (stesso risultato, $\tan\theta = A/g$).
- La bilancia in ascensore è nella 53 (con la figura interattiva `ascensore-bilancia`): qui c'è solo il link, e l'esempio
  è la pallina lasciata cadere, che nella 53 non c'è.
- Che un sistema in moto rettilineo uniforme rispetto a uno inerziale sia inerziale qui è enunciato con una riga di
  motivazione; il conto è nella 73 (velocità) e nella 74 (accelerazione).
- La piattaforma che ruota è solo la prova del corpo libero che curva; centrifuga e Coriolis sono nella 75.

## Simboli

$\vec A$ accelerazione del sistema (README), $\vec a\,'$ accelerazione di un corpo rispetto al sistema che accelera,
$\Delta s\,'$ e $v'$ spostamento e velocità rispetto a quel sistema, $\theta$ l'angolo del pendolo con la verticale
(come nella 58 del biennio).

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `autobus-frena-visto-dalla-strada` (tre istanti, $0{,}3$ cm per metro,
velocità a 1 cm per $12$ m/s: pallone a $0$, $12$, $24$ m, parete a $6$, $16{,}5$, $24$ m), `autobus-frena-visto-da-dentro`
($0{,}6$ cm per metro: $0$, $1{,}5$, $6{,}0$ m; velocità $3$ e $6$ m/s a $0{,}15$ cm per m/s), `pendolo-auto-accelera`
(filo a $17{,}02^\circ$, forze a 2 cm per newton: $P = 1{,}96$ cm, $T = (0{,}60; 1{,}96)$ cm, somma $0{,}60$ cm),
`ascensore-pallina-cade`, `giostra-palla-due-osservatori` (la curva è $r = 2t$, angolo $-0{,}40\,t$ rad, a $0{,}5$ cm per
metro: i numeri dell'esempio 8 della 75).

Interattiva `autobus-frena-due-osservatori` (`fisica/AutobusFrena.tsx`). Domanda: che cosa fa il pallone per chi sta
sulla strada, e che cosa fa per chi sta a bordo? Parte dai numeri dell'esempio 1 ($12$ m/s, $3{,}0$ m/s², $6{,}0$ m);
il cursore cambia la frenata da $1{,}5$ a $4{,}0$ m/s², il selettore il punto di vista. Finisce quando il pallone tocca
la parete, sempre prima che l'autobus si fermi.

## Esercizio guidato

L'esempio 4 (la pallina in ascensore) renderebbe di più come esercizio guidato. Tre fermate: (1) "vista dal palazzo, con
quale accelerazione cade la pallina?" (sempre $g$); (2) "il pavimento le va incontro o le scappa?" con l'ascensore che
accelera verso l'alto; (3) "quale accelerazione metti nella formula del tempo?" ($g + A$), prima del conto.

## Esercizi

Generatore `fis-sistemi-non-inerziali`, cinque livelli (specifica in `specs/exercises/fis-sistemi-non-inerziali.md`): inerziale o no (a parole), il pallone visto dall'autobus, il tempo per arrivare alla parete, il pendolo nel veicolo che accelera, la caduta in ascensore. Nessuna scena. L'esempio 5 (la Terra) non ha un livello. Controlli: tre seed da 1000 campioni per livello con `verify.py` (PASS), errori piantati bocciati, `review.mts` e `width.mts` a 0.

## Da verificare

- Raggio della Terra $6{,}37 \cdot 10^6$ m e distanza Terra-Sole $1{,}50 \cdot 10^{11}$ m: dal README.
- Giorno di $24$ h per la rotazione (il giorno siderale è $86\,164$ s: cambia la terza cifra, $0{,}0339$ m/s²); anno di
  $365$ giorni.
- "Un aereo in crociera a $900$ km/h": valore tipico, a memoria.

## Domande per Andrea

- La lezione ricava $\vec a\,' = -\vec A$ dalle leggi orarie già qui, senza le forze apparenti: va bene, o preferisci
  che la 72 resti qualitativa e il conto stia tutto nella 75?
- Il pendolo nel veicolo è risolto qui dal suolo e nella 75 da bordo. È una ripetizione voluta (stesso problema, due
  osservatori): la tieni?
- "Corpo libero" per "corpo su cui la forza totale è nulla": è il termine che usi in classe?
- La tabella finale di confronto: utile, o è un riepilogo di troppo?

Prerequisiti proposti: fis-primo-principio, leggi-newton, moto-uniforme-accelerato, fis-seno-coseno
