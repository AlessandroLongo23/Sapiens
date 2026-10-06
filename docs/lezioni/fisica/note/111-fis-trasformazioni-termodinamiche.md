# Note: Le trasformazioni isocora, isobara e isoterma

Lezione nuova (lotto del terzo anno, gruppo 41, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $\tfrac{3}{2} \cdot 0{,}50 \cdot 8{,}31 \cdot 120 = 747{,}9$ J, $420/300 = 1{,}4$;
- esempio 2: $0{,}20 \cdot 8{,}31 \cdot 150 = 249{,}3$ J, $373{,}95$ J, $623{,}25$ J;
- esempio 3: $8{,}31 \cdot 300 \cdot \ln 2 = 1728{,}0$ J; esempio 4: $0{,}40 \cdot 8{,}31 \cdot 290 = 963{,}96$ J,
  $963{,}96 \cdot \ln 0{,}40 = -883{,}27$ J;
- controllo con la curva della 109: $400 \ln 4 = 554{,}5$ J; avviso sui kelvin: $300/27 = 11{,}1$;
- esempio 5: $n R T_A = 4986$ J; $A \to B$: $4986$, $7479$, $12\,465$ J; $B \to C$: $-7479$ J; $C \to A$:
  $4986 \ln\tfrac{1}{2} = -3456{,}0$ J; ciclo: $4986 - 3456 = 1530$ J e $12\,465 - 7479 - 3456 = 1530$ J;
  $V_A = 4986 / (2{,}00 \cdot 10^5) = 24{,}93$ L.

`check.mts`: 0 errori, 0 avvisi.

## Struttura ed esempi

I tre modi di scaldare un gas (figura dei tre cilindri); gli strumenti dalle lezioni precedenti; l'isocora (esempio 1);
l'isobara con $W = n R \Delta T$ ricavato dall'equazione di stato e $Q = \tfrac{5}{2} n R \Delta T$ (esempio 2, avviso);
l'isoterma con $\Delta U = 0$, $Q = W$, l'avviso "temperatura costante non vuol dire niente calore", il lavoro con il
logaritmo enunciato (figura), le forme con $p_A V_A$ e con le pressioni, il controllo con la curva della 109, esempi 3 e
4, avviso su kelvin e verso del rapporto; il confronto (figura, interattiva, tabella); le trasformazioni cicliche
(esempio 5 con la tabella per tratti, figura, avviso); come si riconosce la trasformazione.

## Scelte

- Confini. Le leggi dei gas (102, 103, 104, gruppo 39) si richiamano con il link e non si rispiegano. I calori molari
  $C_V$ e $C_p$ sono della 112 (gruppo 42): qui i coefficienti $\tfrac{3}{2}$ e $\tfrac{5}{2}$ compaiono solo per il gas
  monoatomico, senza dare un nome a $C_V$ e $C_p$, e la frase "a pressione costante serve più calore" prepara la 112.
  L'adiabatica è della 113: nominata in un avviso con il link. Il rendimento è della 114: il ciclo dell'esempio 5 dice
  solo quanto calore entra e quanto lavoro esce.
- Il lavoro dell'isoterma si enuncia: la dimostrazione chiede l'integrale. Il logaritmo naturale è un tasto della
  calcolatrice, con il link alla lezione di matematica.
- Nell'esempio 5 i passaggi sono al joule e si arrotonda a tre cifre solo alla fine, perché arrotondando ogni tratto la
  somma dei calori e quella dei lavori non coinciderebbero ($1{,}56$ contro $1{,}53 \cdot 10^3$ J).
- Niente blocco `grafico` con le isoterme al variare di $T$: è della 102 (legge di Boyle).

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `tre-cilindri-isocora-isobara-isoterma`, `isoterma-lavoro-area-iperbole`
($y = 3{,}84/x$), `tre-trasformazioni-piano-pv` (isoterma $y = 4{,}32/x$), `ciclo-isobara-isocora-isoterma` ($0{,}09$ cm
per litro, $0{,}016$ cm per kPa: $A$ a $(2{,}2437;\ 3{,}2)$, isoterma $y = 7{,}1798/x$).

Interattiva (registrata sotto il commento del gruppo 41):

- `trasformazioni-gas-bilancio` (`fisica/TrasformazioniGasBilancio.tsx`). Domanda: dove finisce il calore in ciascuna
  delle tre trasformazioni? Gas monoatomico con $n R = 2{,}0$ J/K (circa $0{,}24$ mol) da $A$ ($3{,}0$ L, $200$ kPa,
  $300$ K); si sceglie la trasformazione e lo stato finale (temperatura da $150$ a $600$ K per l'isocora, volume da $1{,}5$
  a $6{,}0$ L per le altre); cilindro sopra il piano, linea e area, barre di $Q$, $W$, $\Delta U$. Risposta nel testo.

## Esercizi

Generatore `fis-trasformazioni-termodinamiche`, sei livelli (specifica in
`specs/exercises/fis-trasformazioni-termodinamiche.md`). La scena `piano-pv` al livello 6.

## Esercizio guidato

L'esempio 5 (il ciclo). Si fermerebbe in tre punti: (1) "quanto vale $T_B$, se sull'isobara il volume raddoppia?";
(2) nel tratto $B \to C$, "quale dei tre termini è zero?"; (3) prima dell'ultima riga della tabella, "quanto deve fare la
somma della colonna di $\Delta U$?".

## Domande per Andrea

- La ripartizione "tre quinti e due quinti" del calore nell'isobara: la dici così, o aspetti i calori molari?
- Il lavoro dell'isoterma enunciato senza dimostrazione, con il controllo dei quadretti: basta al terzo anno?
- Gli esempi sono tutti con gas monoatomici. Serve già qui un esempio con un gas biatomico, o resta alla 112?
- Nell'esempio 5 i risultati intermedi al joule e l'arrotondamento solo alla fine: è la regola che vuoi per i cicli?
- "Bagno a temperatura fissa" o "termostato" o "sorgente di calore" (il termine della 114) per l'isoterma?

## Da verificare

- $R = 8{,}31$ J/(mol·K) (README); elio, neon, argon come gas monoatomici.
- Che la 103 chiami "prima" la legge a pressione costante e "seconda" quella a volume costante, come scrivo qui
  (gruppo 39).

Prerequisiti proposti: principi-termo, fis-lavoro-termodinamico, fis-energia-interna, fis-gas-perfetto
