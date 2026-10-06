# Note: Il bilancio dell'energia con le forze non conservative

Lezione nuova (lotto del terzo anno, gruppo 32, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $9{,}0 / 0{,}12 = 75$ m, $\sqrt{2 \cdot 9{,}8 \cdot 9{,}0} = 13{,}28$ m/s;
- esempio 2: $2{,}0$ J, $F_d = 1{,}225$ N, $d = 1{,}633$ m, senza attrito $2{,}83$ m/s;
- esempio 3: $29{,}4$ J, $-10{,}18$ J, $19{,}22$ J, $x = 0{,}2192$ m, senza attrito $0{,}271$ m;
- esempio 4: $480$ J, $-159{,}8$ J (con $\cos 25^\circ = 0{,}906$), $h = 1{,}69$ m e $248{,}4$ J, $K = 71{,}8$ J, $v = 3{,}09$ m/s, senza attrito $5{,}56$ m/s;
- esempio 5: $60 \cdot 9{,}8 \cdot 13 / 3{,}0 = 2548$ N, peso $588$ N, con $10$ m $1960$ N.

`check.mts`: 0 errori, 0 avvisi.

## Scelte

- Confine con la 64 del biennio: là $\Delta E = W_{attrito}$ su un tratto solo, il rendimento e la conservazione dell'energia totale. Qui la forma generale $W_{nc} = \Delta E$, le forze che aggiungono energia (fune, motore), i problemi con più tratti. L'energia interna è richiamata in due righe.
- Simbolo $W_{nc}$ come nel README; $W_c$ compare solo nella dimostrazione.
- Il bilancio si scrive sempre una volta sola, tra lo stato iniziale e quello finale: è la tesi della lezione, e l'esempio 5 (il tuffatore) la mostra senza passare dalla velocità all'ingresso in acqua.
- Nell'esempio 5 "la forza media con cui l'acqua frena" comprende resistenza e spinta di Archimede insieme: non le distinguo.
- Nell'esempio 4 seno e coseno di $25^\circ$ si prendono dalla calcolatrice con tre cifre.
- La potenza non c'è: è della 60.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `slitta-collina-prato-attrito`, `rampa-attrito-molla-in-fondo` ($30^\circ$, cateti 3,464 e 2), `cassa-fune-salita-attrito` (forze in scala, 0,015 cm per N: $F$ 1,8 cm, $F_d$ 0,6 cm, peso 2,205 cm), `bilancio-fune-barre-energia` (6 cm = 480 J), `tuffatore-piattaforma-profondita` (0,3 cm per m).

Interattiva (registrata sotto il commento del gruppo 32):

- `rampa-liscia-pavimento-attrito` (`fisica/RampaPavimentoAttrito.tsx`): dove si ferma il blocco se raddoppi l'altezza, o il coefficiente di attrito, o la massa? Tre cursori e un bottone; le barre sono quelle di `fisica/energia.tsx` (gruppo 18), usate senza modificarle e riscalate in modo che la somma sia sempre alta 2 cm.

## Esercizio guidato

L'esempio 3 (rampa con attrito e molla). Si fermerebbe in tre punti: scegliere lo stato iniziale e quello finale; scrivere il lavoro dell'attrito (chiedendo la forza premente); scrivere il bilancio e ricavare $x$.

## Esercizi

Generatore `fis-bilancio-energia`, sei livelli. Scene già esistenti: `pista-energia` (livello 2), `piano-inclinato` (livelli 4 e 5).

## Domande per Andrea

- $W_{nc}$ è il simbolo che vuoi, o preferisci $L_{nc}$ o "lavoro delle forze non conservative" scritto per esteso?
- Il tuffatore con la forza media dell'acqua è un esempio accettabile, visto che mette insieme resistenza e spinta di Archimede?
- Serve un esempio con la resistenza dell'aria (velocità di arrivo minore di $\sqrt{2gh}$), o basta l'esercizio della 64?

## Da verificare

- Piattaforma dei tuffi a $10$ m e profondità di arresto di $3{,}0$ m: valori plausibili, scritti a memoria.
- $\mu_d = 0{,}12$ per una slitta sulla neve fresca: valore di comodo.

Prerequisiti proposti: fis-forze-conservative-energia, fis-energia-totale, energia, fis-piano-inclinato
