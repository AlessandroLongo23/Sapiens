# Note: L'attrito viscoso e la velocità limite

Lezione nuova (lotto del terzo anno di fisica, gruppo 38, 6 ottobre 2026). Conti rifatti in Python con i dati scritti come nella lezione:

- esempio 1: $6\pi \cdot 1{,}5 \cdot 1{,}0 \cdot 10^{-3} \cdot 2{,}0 \cdot 10^{-2} = 5{,}655 \cdot 10^{-4}$ N;
- esempio 2: $m = 1000 \cdot \tfrac43\pi \cdot 10^{-15} = 4{,}189 \cdot 10^{-12}$ kg, $v_l = 1{,}21 \cdot 10^{-2}$ m/s, un metro in $83$ s, $\tau = 1{,}23 \cdot 10^{-3}$ s;
- esempio 3: $2 \cdot 10^{-6} \cdot 9{,}8 \cdot 6540 = 0{,}1282$, diviso $13{,}5$ fa $9{,}495 \cdot 10^{-3}$ m/s; $20$ cm in $21{,}1$ s; senza Archimede $11{,}3$ mm/s ($+19\,\%$); $\tau = 1{,}16 \cdot 10^{-3}$ s; forze: peso $3{,}20 \cdot 10^{-4}$ N, Archimede $0{,}52 \cdot 10^{-4}$ N, attrito $2{,}68 \cdot 10^{-4}$ N;
- testo dopo l'interattiva: raggio $2{,}0$ mm, $38{,}0$ mm/s, fondo in $5{,}3$ s; raggio $0{,}5$ mm, $2{,}37$ mm/s;
- esempio 4: $2 \cdot 10^{-6} \cdot 9{,}8 \cdot 6900 / (9 \cdot 0{,}050) = 0{,}3005$ Pa·s;
- pioggia: $2 \cdot 10^{-6} \cdot 9{,}8 \cdot 1000 / (9 \cdot 1{,}8 \cdot 10^{-5}) = 121$ m/s $= 436$ km/h;
- $1 - e^{-1} = 0{,}632$, $1 - e^{-5} = 0{,}993$; $5^2/(2 \cdot 9{,}8) = 1{,}28$ m.

`check.mts` passa senza errori; restano gli avvisi "titolo con maiuscole all'inglese" sui titoli con Stokes e Archimede, che sono nomi propri.

## Scelte

- Simboli del README: viscosità $\eta$ in Pa·s, $F_v = 6\pi\,\eta\,r\,v$, velocità limite $v_l$. In più: densità della sfera $d_s$ e del fluido $d_{fl}$, spinta di Archimede $S_A$ e densità del fluido $d_{fl}$ come nella lezione 30 del biennio, tempo caratteristico $\tau$.
- La viscosità è definita con le due lastre ($F = \eta S v / L$), come fanno Walker e Cutnell; l'Amaldi la introduce direttamente con Stokes (da verificare). Senza quella formula l'unità Pa·s non avrebbe una giustificazione.
- La velocità limite è ricavata due volte: prima senza Archimede ($v_l = m g / 6\pi\eta r$, la forma dell'Amaldi), poi con Archimede. La seconda è la sola giusta nei liquidi, e l'esempio 3 dice di quanto si sbaglia a trascurarla.
- La legge $v(t)$ con l'esponenziale è enunciata ("si dimostra"), con il link alla lezione di matematica sulla funzione esponenziale e solo due numeri ($63\,\%$ dopo $\tau$, $99\,\%$ dopo $5\tau$). Niente esercizi su questo.
- Laminare e turbolento solo qualitativi, come chiede il brief: il numero di Reynolds non è nominato. La legge di Poiseuille non c'è; il riquadro "Nei tubi veri la pressione cala" dice a parole quello che servirebbe.
- La resistenza proporzionale al quadrato della velocità è solo nominata, con la pioggia e il paracadutista come casi in cui Stokes non vale.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `lastre-strato-fluido-viscosita` (profilo lineare, frecce da 0,4 a 2 cm), `tubo-laminare-turbolento` (profilo a parabola: $1{,}6 \cdot (1 - (y-1)^2)$ dà $1{,}5$, $1{,}2$, $0{,}7$), `grafico-velocita-tempo-velocita-limite` ($1 - e^{-t}$, la retta tratteggiata ha la pendenza iniziale della curva), `sfera-forze-velocita-limite` (forze in scala per l'esempio 3, 1 cm per $2 \cdot 10^{-4}$ N: peso 1,6 cm, attrito 1,34 cm, Archimede 0,26 cm, le ultime due in fila).

Interattiva (registrata sotto il commento del gruppo 38):

- `sferette-glicerina-velocita-limite` (`fisica/SferetteViscose.tsx`): due sferette d'acciaio in due cilindri di glicerina alti 20 cm; la prima ha raggio 1,0 mm, la seconda da 0,5 a 2,0 mm (passo 0,25). Avvia le fa scendere in tempo reale, ognuna con $v(t) = v_l(1 - e^{-t/\tau})$, e si ferma quando la più veloce tocca il fondo. Domanda: se il raggio raddoppia, di quanto cambia la velocità limite? Risposta nel testo: quattro volte. La caduta è in scala; le sferette sono disegnate dieci volte più grandi, e la didascalia lo dice. Con il raggio di 0,5 mm la gara dura 21 secondi. Con il movimento ridotto il bottone porta direttamente alla fine.

## Esercizi

Generatore `fis-viscosita`, cinque livelli (specifica in `specs/exercises/fis-viscosita.md`): La forza di Stokes, La velocità limite dalla massa, La gocciolina nella nebbia, La velocità limite con Archimede, La viscosità dalla velocità limite. Nessuna scena. Nel generatore c'è un liquido che la lezione non nomina, l'olio di ricino ($0{,}99$ Pa·s, $960$ kg/m³), scelto perché abbastanza viscoso da far valere Stokes. Senza esercizio: la forza tra le due lastre, il moto laminare e turbolento, la legge esponenziale.

## Esercizio guidato

L'esempio 3. Si fermerebbe in tre punti: "quali forze agiscono sulla sferetta, e con che verso?"; "quanto vale la forza totale alla velocità limite?" (zero); "in che unità va messo il raggio?" (metri, ed è al quadrato).

## Domande per Andrea

- La formula delle due lastre per definire $\eta$: va tenuta, o al terzo anno la viscosità si introduce solo con la legge di Stokes?
- La velocità limite con la spinta di Archimede è nel programma, o basta la forma $m g / 6\pi\eta r$?
- Il numero di Reynolds e la legge di Poiseuille sono fuori. Vanno almeno nominati?
- La legge $v(t)$ esponenziale: tenerla, visto che in matematica stanno facendo gli esponenziali, o toglierla?

## Da verificare

- Viscosità usate: aria $1{,}8 \cdot 10^{-5}$, acqua $1{,}0 \cdot 10^{-3}$, sangue a $37\,^\circ\text{C}$ $4 \cdot 10^{-3}$, olio d'oliva $8{,}4 \cdot 10^{-2}$, glicerina $1{,}5$, miele circa $10$ Pa·s (a $20\,^\circ\text{C}$ dove non detto). Valori correnti dei libri; quelli di olio, glicerina e miele cambiano molto con la temperatura e con la fonte.
- Densità: acciaio $7{,}8 \cdot 10^3$, glicerina $1{,}26 \cdot 10^3$, olio lubrificante $900$, olio d'oliva $920$ kg/m³.
- "Il mercurio è poco più viscoso dell'acqua" ($1{,}5 \cdot 10^{-3}$ Pa·s): a memoria.
- George Stokes, irlandese, legge del 1851: a memoria.
- Goccioline di nebbia di raggio $10\,\mu\text{m}$; gocce di pioggia di $1$ mm a $6$ o $7$ m/s; paracadutista a circa $50$ m/s in una decina di secondi, $5$ m/s con il paracadute aperto: valori correnti dei libri.
- "La viscosità dei gas aumenta un poco con la temperatura": vero, scritto a memoria.

Prerequisiti proposti: fis-archimede, fis-primo-principio, fis-attrito, fis-portata-continuita
