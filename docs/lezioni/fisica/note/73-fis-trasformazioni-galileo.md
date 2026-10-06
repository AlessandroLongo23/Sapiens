# Note: Le trasformazioni di Galileo e la composizione delle velocità

Lezione nuova (lotto del terzo anno di fisica, gruppo 31, 6 ottobre 2026). Conti rifatti in Python: $12 + 25 \cdot 4{,}0 = 112$
m, $200 - 25 \cdot 6{,}0 = 50$ m; $40/5 = 8{,}0$ s, $30 \cdot 8{,}0 = 240$ m, $55 \cdot 8{,}0 = 440$ m;
$\sqrt{8{,}0^2 + 15^2} = 17$ m/s, $\tan^{-1}(1{,}875) = 61{,}9^\circ$; $2 \cdot 4{,}9/9{,}8 = 1{,}0$ s, $4{,}9^2/19{,}6 = 1{,}225$ m,
$\sqrt{5{,}0^2 + 4{,}9^2} = 7{,}0007$ m/s; $\sqrt{2{,}0^2 + 4{,}0^2} = 4{,}47$ m/s, $\tan^{-1} 2{,}0 = 63{,}4^\circ$.
`check.mts` dà un avviso sul titolo "Le trasformazioni di Galileo per la posizione" (e su "Trasformazioni di Galileo" nel
formulario): la maiuscola è del nome proprio, e l'ho tenuta.

## Confini

- La 46 del biennio ha già $\vec v = \vec v_b + \vec v_c$ per il tapis roulant, la barca e l'aereo con il vento. Qui la
  barca è richiamata in due righe con il link, e gli esempi sono altri: posizioni (passeggero e semaforo), velocità di un
  veicolo vista da un altro (il sorpasso), la pioggia vista dall'auto ($\vec v\,' = \vec v - \vec V$, la formula letta al
  contrario, che nella 46 non c'è), la traiettoria nei due sistemi (palla sul treno), le componenti (radar).
- Nella 73 stanno posizione, tempo, invarianza di lunghezze e durate, velocità. L'accelerazione, le forze e il principio
  di relatività sono nella 74: qui c'è solo il link nell'ultima riga.
- La palla lanciata sul treno è vista dalla banchina come una parabola: il lancio obliquo ha la sua lezione (76, gruppo
  30), e qui si calcolano solo il tempo di volo, l'altezza (formule del lancio verticale del biennio) e lo spostamento
  orizzontale, con il link.
- Il limite alle alte velocità è in un riquadro `ad-note`, senza link: le lezioni di relatività del quinto anno sono
  vuote.

## Simboli

$S$ e $S'$, $\vec V$, $\vec v = \vec v\,' + \vec V$ come nel README. Per la posizione ho usato $x$ e $x'$ (e $\vec s$,
$\vec s\,'$ per il vettore posizione, perché nel biennio la posizione è $s$). I nomi "assoluta, relativa, di
trascinamento" sono dati una volta e nel formulario. L'angolo della pioggia con la verticale è $\beta$, quello del
motoscafo con l'est è $\gamma$.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `due-sistemi-s-s-primo`, `sorpasso-due-sistemi` (1 cm per 15 m/s: $2{,}0$,
$1{,}67$ e $0{,}33$ cm), `pioggia-vista-dall-auto` ($0{,}2$ cm per m/s: $1{,}6$, $3{,}0$, $3{,}4$ cm, angolo $61{,}9^\circ$),
`palla-treno-due-traiettorie` (1 cm per metro: parabola $x = 5t$, $y = 4{,}9t - 4{,}9t^2$; velocità a $0{,}2$ cm per m/s),
`motoscafo-radar-traghetto` ($0{,}5$ cm per m/s, sulla griglia).

Interattiva `trasformazioni-galileo-vagone` (`fisica/VagoneGalileo.tsx`). Domanda: come deve camminare il passeggero
perché chi sta sulla banchina lo veda fermo? Due cursori ($V$ da 0 a 8 m/s, $v'$ da $-4$ a 4 m/s), il moto dura 3 s;
sotto la banchina le quote $V\,t$, $x'$ e $x$, sopra il vagone le tre velocità. Parte da $V = 6$ m/s e $v' = 2$ m/s,
che non sono i numeri di un esempio: gli esempi della lezione hanno velocità da treno ($25$ m/s) che nella figura non
starebbero.

## Esercizio guidato

L'esempio 3 (la pioggia vista dall'auto). Tre fermate: (1) "chi è $S$, chi è $S'$, e la velocità di $8{,}0$ m/s è una
$\vec v$ o una $\vec v\,'$?"; (2) "quale formula ti serve, $\vec v = \vec v\,' + \vec V$ o $\vec v\,' = \vec v - \vec V$, e
verso dove punta $-\vec V$?"; (3) "nel triangolo, l'angolo con la verticale ha la tangente uguale a quale rapporto?".

## Esercizi

Generatore `fis-trasformazioni-galileo`, sei livelli (specifica in `specs/exercises/fis-trasformazioni-galileo.md`): la posizione da un sistema all'altro, la velocità di un veicolo vista da un altro, raggiungersi e incontrarsi, la pioggia vista dall'auto, le componenti (radar), la palla lanciata sul treno. Scena `vettori-piano` (già esistente) ai livelli 4 e 5, non guardata sul sito. Controlli: tre seed da 1000 campioni per livello con `verify.py` (PASS), errori piantati bocciati, `review.mts` e `width.mts` a 0.

## Da verificare

- Velocità di caduta della pioggia, $8{,}0$ m/s: ordine di grandezza per gocce grandi, a memoria.
- Lunghezza del camion ($16$ m) e distanze di sicurezza ($12$ m) nell'esempio del sorpasso: inventate, plausibili.
- "Velocità assoluta, relativa, di trascinamento": nomi dei libri italiani, a memoria (l'Amaldi li usa? da verificare).

## Domande per Andrea

- L'ipotesi $t' = t$ è detta in chiaro come ipotesi, con il riquadro sul limite alle alte velocità. Al terzo anno la
  dici, o la lasci implicita fino alla relatività?
- I nomi "assoluta" e "relativa": li vuoi come nomi principali (come su molti libri) o va bene che siano solo citati?
- L'esempio 5 per componenti con una componente negativa: è al livello giusto, o al terzo anno ci si ferma ai casi
  paralleli e perpendicolari?
- Nel sorpasso il risultato $240$ m è scritto anche come $2{,}4 \cdot 10^2$ m per le cifre significative: va bene la
  doppia scrittura?

Prerequisiti proposti: fis-composizione-moti, fis-operazioni-vettori, fis-moto-rettilineo-uniforme, fis-sistemi-non-inerziali
