# Note: L'impulso e il teorema dell'impulso

Lezione nuova (lotto del terzo anno, gruppo 32, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $36$ N·s, $9{,}0$ m/s;
- esempio 2: $0{,}058 \cdot 60 = 3{,}48$ N·s, $870$ N, peso $0{,}568$ N (rapporto $1531$), con $35 - 25$ verrebbe $145$ N;
- esempio 3: $1080$ kg·m/s, $108\,000$ N e $7200$ N, rapporto $15$; nella figura interattiva $54$ kN e $5{,}4$ kN, $76{,}5$ e $7{,}65$ volte il peso ($705{,}6$ N);
- esempio 4: $\tfrac12 \cdot 0{,}020 \cdot 600 = 6{,}0$ N·s, $15$ m/s, $300$ N;
- esempio 5: $240$ kg·m/s, $2400 + 588 = 2988$ N, $480 + 588 = 1068$ N.

`check.mts`: 0 errori, 0 avvisi.

## Scelte

- Confine con la 80: la definizione di quantità di moto e $\vec F = \Delta\vec p/\Delta t$ sono là; qui il teorema è dimostrato da $\vec F_{tot} = m\,\vec a$, come chiede il brief, in tre righe.
- Confine con la 77: l'area sotto il grafico forza-tempo è presentata per analogia con quella sotto il grafico forza-spostamento, con il link.
- Confine con la 82: l'ultima riga dice che in un urto i due impulsi sono opposti, e rimanda.
- L'impulso è sempre $\vec I$ con la freccia o $I_x$, come nel README; negli esempi a una dimensione dove conta solo il modulo scrivo $I$.
- L'esempio 5 mette il peso nel teorema (la forza è quella totale): è l'errore più frequente e ha il suo riquadro.
- La tabella impulso e lavoro chiude la lezione: i due teoremi fianco a fianco.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `racchetta-palla-prima-dopo` (0,06 cm per m/s), `airbag-due-tempi-stessa-area` (30 cm per s, 0,03 cm per kN: rettangoli 0,3 × 3,24 e 4,5 × 0,216, stessa area), `impulso-area-picco-triangolo` (200 cm per s, 1 cm per 200 N), `atterraggio-forze-suolo-peso` (1 cm per kN: 3,0 e 0,59).

Interattiva (registrata sotto il commento del gruppo 32):

- `impulso-tempo-arresto-forza` (`fisica/ImpulsoTempoArresto.tsx`): che cosa succede alla forza media se il tempo dell'arresto passa da 0,02 s a 0,20 s? Un cursore; il rettangolo cambia forma e non area, e resta tratteggiato quello dell'airbag dell'esempio 3.

## Esercizio guidato

L'esempio 5 (l'atterraggio). Si fermerebbe in tre punti: $\Delta p_y$ con il segno; quali forze agiscono sulla ragazza; la forza del suolo, con $\Delta p/\Delta t$ da solo come errore previsto.

## Esercizi

Generatore `fis-impulso`, sette livelli. Scena `grafico-spezzata` ai livelli 5 e 6 (grafico forza-tempo, con l'area colorata nella soluzione).

## Domande per Andrea

- Il simbolo $\vec I$ per l'impulso va bene, visto che $I$ sarà anche il momento d'inerzia nel capitolo dopo? Il README li distingue con la freccia.
- La forza media definita come altezza del rettangolo con la stessa area: basta, o vuoi anche un grafico con un picco curvo e i quadretti da contare?
- L'esempio dell'airbag con tempi di $0{,}010$ s e $0{,}15$ s è realistico abbastanza?

## Da verificare

- Durata del contatto palla-racchetta $4{,}0$ ms, velocità $25$ e $35$ m/s: valori plausibili, a memoria.
- Tempi di arresto contro il cruscotto ($0{,}010$ s) e con l'airbag ($0{,}15$ s): ordini di grandezza, a memoria.
- Forza massima di un calcio $600$ N in $0{,}020$ s: valore di comodo.

Prerequisiti proposti: fis-quantita-moto-def, leggi-newton, fis-lavoro-forza-variabile
