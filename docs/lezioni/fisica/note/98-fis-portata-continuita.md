# Note: La portata e l'equazione di continuità

Lezione nuova (lotto del terzo anno di fisica, gruppo 38, 6 ottobre 2026). Conti rifatti in Python con i dati scritti come nella lezione:

- esempio 1: $12/40 = 0{,}30$ L/s, $150/0{,}30 = 500$ s;
- esempio 2: $\pi \cdot (1{,}0 \cdot 10^{-2})^2 = 3{,}142 \cdot 10^{-4}$ m², per $1{,}5$ fa $4{,}712 \cdot 10^{-4}$ m³/s, cioè $28{,}3$ L al minuto;
- esempio 3: $0{,}50 \cdot 4{,}0/1{,}0 = 2{,}0$ m/s;
- esempio 4: $1{,}2 \cdot 16 = 19{,}2$ m/s, $q = \pi \cdot (8{,}0 \cdot 10^{-3})^2 \cdot 1{,}2 = 2{,}413 \cdot 10^{-4}$ m³/s, $60/0{,}2413 = 248{,}7$ s;
- esempio 5: $0{,}30 \cdot 3{,}0/2000 = 4{,}5 \cdot 10^{-4}$ m/s, rapporto delle sezioni $667$;
- testo dopo l'interattiva: $\pi \cdot (0{,}02)^2 \cdot 0{,}50 = 6{,}28 \cdot 10^{-4}$ m³/s $= 0{,}63$ L/s.

`check.mts` passa senza errori e senza avvisi.

## Scelte

- Confine con la 99: qui solo cinematica del fluido (modello, portata, continuità, ramificazioni). La pressione non compare; l'ultima frase dice che per accelerare il fluido serve una differenza di pressione e rimanda a Bernoulli.
- Confine con la 101: il fluido ideale è definito qui (incomprimibile, non viscoso); la viscosità ha solo il link. Il profilo di velocità in un tubo vero è una riga ("$v$ è la velocità media sulla sezione").
- Simboli del README: portata $q$, sezione $S$, densità $d$. Il diametro è $D$ maiuscola, per non confonderlo con la densità $d$ (il README non lo fissa).
- La portata è definita come portata in volume. La portata in massa compare solo nel riquadro sui gas, come $d \cdot S \cdot v$, senza nome e senza simbolo.
- Litri al secondo e litri al minuto hanno un riquadro di errore: è la conversione che si sbaglia di più.
- Le ramificazioni ($q = q_1 + q_2$) stanno qui e non in una lezione a parte: sono la stessa legge, e l'esempio dei capillari è quello che i libri danno sempre.
- Le linee di flusso sono introdotte perché servono alla 99 (Bernoulli vale lungo una linea di flusso) e alla 100 (profilo alare).

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `linee-di-flusso-tubo-che-si-stringe`, `portata-cilindro-di-fluido`, `tubo-due-sezioni-continuita` (diametri 1,8 e 0,9 cm, frecce di 0,5 e 2,0 cm: rapporto 4 come le sezioni), `grafico-velocita-sezione-iperbole` ($v = 2/S$, i punti $(1; 2)$, $(2; 1)$, $(4; 0{,}5)$ sono quelli dell'esempio 3; riga `% poi-interattivo`), `tubo-che-si-divide-portate`.

Interattiva (registrata sotto il commento del gruppo 38 in `src/lib/utils/interactive.ts`):

- `tubo-continuita-diametro` (`fisica/TuboContinuita.tsx`): tubo con il primo tratto di 4 cm e il secondo regolabile da 1 a 4 cm (passo 0,5), velocità d'ingresso da 0,2 a 0,6 m/s. Domanda: se il diametro del tratto stretto si dimezza, di quanto cresce la velocità? Risposta nel testo: quattro volte. Le goccioline avanzano con la velocità locale $v_1 (D_1/D)^2$ (la posizione si ricava dal volume di tubo già percorso, che cresce a ritmo costante); le due frecce sono in scala, 0,45 cm per m/s, e stanno sopra il tubo perché nel tratto da 1 cm non c'è posto. Con il movimento ridotto il bottone Avvia non compare e le goccioline restano ferme.

## Esercizi

Generatore `fis-portata-continuita`, sei livelli (specifica in `specs/exercises/fis-portata-continuita.md`): La portata da volume e tempo, La portata da sezione e velocità, Il tubo che cambia sezione, Il tubo con i diametri, I litri al minuto di un tubo, Il tubo che si divide. Scena nuova `tubo-sezioni` (`scenes/TuboSezioni.tsx`) ai livelli 3 e 4. Senza esercizio: il tempo di riempimento dell'esempio 4 e i capillari dell'esempio 5.

## Esercizio guidato

L'esempio 4 (tubo da giardino con la lancia). Si fermerebbe in tre punti: "serve convertire i diametri in metri per trovare $v_2$?" (no, stanno in un rapporto); "in quale sezione conviene calcolare la portata?" (in quella di cui si conosce la velocità); "la lancia fa uscire più acqua al secondo?" (no).

## Domande per Andrea

- Il diametro si chiama $D$ per non confonderlo con la densità $d$: va bene, o l'Amaldi usa un altro simbolo? (da verificare)
- La portata in massa merita una definizione con il suo simbolo, o basta il riquadro sui gas?
- Le ramificazioni con rami diversi ($S \cdot v = S_1 v_1 + S_2 v_2$) hanno solo la formula e l'esempio dei capillari, che usa la sezione totale. Serve anche un esempio con due rami diversi?
- Il fluido ideale è definito con due proprietà (incomprimibile, non viscoso) e la corrente stazionaria a parte. Alcuni libri aggiungono "irrotazionale": l'ho lasciato fuori. Va bene?

## Da verificare

- Aorta: sezione $3{,}0$ cm², velocità media del sangue $0{,}30$ m/s a riposo. Capillari: sezione totale $2{,}0 \cdot 10^3$ cm². Valori correnti dei libri di testo (Cutnell, Walker danno numeri vicini), scritti a memoria.
- "Miliardi di capillari": ordine di grandezza a memoria.
- "L'aria si può trattare da incomprimibile a velocità molto più piccole di quella del suono": affermazione qualitativa, senza la soglia.

Prerequisiti proposti: fis-grandezze-derivate, fis-proporzionalita-inversa, velocita
