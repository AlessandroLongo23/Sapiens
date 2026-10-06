# Note: L'energia interna

Lezione nuova (lotto del terzo anno, gruppo 40, 6 ottobre 2026). `check.mts`: 0 errori, 0 avvisi. Conti rifatti in
Python:

- esempio 1: $\frac{3}{2} \cdot 2{,}00 \cdot 8{,}31 \cdot 300 = 7479$ J; $\frac{1}{2} \cdot 8{,}00 \cdot 10^{-3} \cdot 30^2 = 3{,}6$ J; con $27$ al posto di $300$, $673$ J;
- esempio 2: $\frac{3}{2} \cdot 1{,}01 \cdot 10^{5} \cdot 6{,}00 \cdot 10^{-3} = 909$ J;
- esempio 3: $\frac{3}{2} \cdot 0{,}500 \cdot 8{,}31 \cdot 60 = 373{,}95$ J e, con $-90$, $-560{,}9$ J;
- esempio 4: $U_A = 900$ J, $U_B = 1800$ J, $\Delta U = 900$ J;
- esempio 5: $p_i = 1{,}2465 \cdot 10^{5}$ Pa, $p_f = 6{,}2325 \cdot 10^{4}$ Pa, $U = 373{,}95$ J;
- esempio 6: $T_f = (600 + 1200)/5 = 360$ K, $\Delta U = \pm 1495{,}8$ J;
- grafico $U$-$T$: 1 cm = 100 K e 1 cm = 3 kJ, rette $y = 0{,}831\,x$ (2 mol) e $y = 0{,}4155\,x$ (1 mol), punto $(3; 2{,}493)$.

## Scelte

- Confine con la 106: $K_m = \frac{3}{2} k_B T$ arriva da lì; qui si moltiplica per $N$ e si dà il nome.
- Confine con la 109 e la 110 (gruppo 41): il lavoro e il primo principio non ci sono. La sezione "Come cambia
  l'energia interna" dice solo che i modi sono due, calore e lavoro, e rimanda. Nell'espansione libera dico che il gas
  "non compie lavoro perché non spinge niente", senza formula.
- Confine con la 112 (gruppo 42): la lezione usa solo gas monoatomici e lo dice; il fattore dei biatomici è rimandato
  in una nota. Tutti gli esercizi dicono "un gas monoatomico".
- "Esperienza di Joule" del brief: l'ho letta come l'espansione libera (1845), che è quella che mostra che $U$ dipende
  solo da $T$. Il mulinello è già nella 67 e qui è richiamato in una riga.
- $U = \frac{3}{2} p V$: l'ho aggiunta perché è il modo più diretto di leggere $U$ nel piano pressione-volume e serve
  all'esempio 4 sulla funzione di stato.
- L'esempio 6 (due gas in un recipiente isolato) usa la conservazione dell'energia interna totale senza chiamarla
  primo principio.
- Simbolo $U$: una riga avverte che in meccanica era l'energia potenziale.

## Domande per Andrea

- L'energia interna definita con "energie cinetiche delle molecole più energie potenziali delle forze tra le molecole":
  va bene, o l'Amaldi ci mette anche altro (energia chimica, nucleare)? (da verificare)
- La trasformazione ciclica è definita qui in una riga, perché serve a $\Delta U = 0$; la 111 la tratta per esteso.
  Va bene?
- L'interattiva mette l'espansione contro un pistone accanto a quella libera, e il gas si raffredda: anticipa la 113
  (adiabatica) senza nominarla. È troppo?
- La nota sui gas reali che si raffreddano (Joule e Thomson): tenerla?

## Da verificare

- Joule, espansione libera, 1845; Joule e Thomson "pochi anni dopo" (le misure sono dei primi anni Cinquanta
  dell'Ottocento): scritti a memoria.
- "Un gas reale che si espande liberamente di solito si raffredda leggermente": vero per i gas comuni a temperatura
  ambiente nell'espansione libera; l'effetto Joule-Thomson (attraverso un setto) per idrogeno ed elio a temperatura
  ambiente ha il segno opposto, ed è un'altra esperienza. Ho scritto "di solito".
- Massa di due moli di elio: $8{,}00$ g.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `energia-cinetica-ordinata-ed-energia-interna`,
`grafico-energia-interna-temperatura`, `piano-pv-due-cammini-stessa-variazione`, `joule-espansione-libera-schema`,
`due-gas-recipiente-isolato`.

Interattiva `espansione-libera-gas` (`fisica/EspansioneLibera.tsx`): risponde a "quando il gas si espande nel vuoto, le
molecole sono più lente, più veloci o veloci come prima?". Cinquanta molecole nella metà sinistra di un recipiente;
"Togli la parete" le lascia espandere: volume doppio, pressione dimezzata, temperatura (letta dalle velocità) e barra
di $U$ ferme. Il secondo modo, "Contro un pistone", fa arretrare la parete a 0,3 cm/s: le molecole che la urtano
rimbalzano più lente e il gas si raffredda (da 500 K a circa 340 K; il valore limite, per un pistone lentissimo,
sarebbe $500 \cdot 2^{-2/3} = 315$ K). Cursore per la temperatura iniziale (200-500 K).

## Esercizio guidato

L'esempio 4 (da A a B per due strade). Si fermerebbe: (1) chiedendo se serve conoscere il cammino; (2) su $U_A$ e
$U_B$ con i volumi in metri cubi; (3) sulla variazione sull'intero ciclo.

## Esercizi

Generatore `fis-energia-interna`, sei livelli: L'energia interna di un gas; Di quanto cambia; Dalla pressione e dal
volume; Da uno stato a un altro (scena `piano-pv` del gruppo 41); La temperatura dall'energia interna; Due gas in un
recipiente isolato. Resta senza esercizio l'esempio 5 (l'espansione libera), che sarebbe una domanda di ragionamento.

Prerequisiti proposti: fis-temperatura-microscopica, fis-gas-perfetto, fis-sistemi-termodinamici, fis-energia-totale
