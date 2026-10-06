# Note: I calori molari dei gas

Lezione nuova (lotto del terzo anno di fisica, gruppo 42, 6 ottobre 2026). Conti rifatti in Python, con $R = 8{,}31$:

- calori molari: $\tfrac32 R = 12{,}465$, $\tfrac52 R = 20{,}775$, $\tfrac72 R = 29{,}085$, $3R = 24{,}93$;
- esempio 1: $2{,}00 \cdot 12{,}465 \cdot 60{,}0 = 1495{,}8$ J;
- esempio 2: $2{,}00 \cdot 20{,}775 \cdot 60{,}0 = 2493$ J, $W = 2{,}00 \cdot 8{,}31 \cdot 60{,}0 = 997{,}2$ J, somma $1495{,}8 + 997{,}2 = 2493$;
- esempio 3: $730 / (0{,}500 \cdot 29{,}085) = 50{,}198$ K, $W = 208{,}57$ J, $\Delta U = 521{,}43$ J, a volume costante $70{,}28$ K;
- esempio 4: $56{,}0 / 28{,}0 = 2{,}00$ mol, $2{,}00 \cdot 20{,}775 \cdot 25{,}0 = 1038{,}75$ J, $20{,}775 / 0{,}0280 = 741{,}96$ J/(kg K), rapporto con
  l'acqua $742 / 4186 = 0{,}177$;
- esempio 5: $1870 / (3{,}00 \cdot 30{,}0) = 20{,}778$, diviso per $R$ dà $2{,}5003$;
- figura interattiva: con $1500$ J e una mole, $120{,}3$ K e $72{,}2$ K (monoatomico, lavoro $600$ J), $72{,}2$ K e $51{,}6$ K (biatomico).

`check.mts` passa senza avvisi su lezione, formulario e flashcard.

## Scelte

- Confine con la 108 (energia interna, gruppo 40): la 108 dà $U = \tfrac32 nRT$ per il gas monoatomico; i gradi di libertà,
  l'equipartizione e i gas biatomici stanno qui, come dice il brief.
- Confine con la 111 (gruppo 41): isocora e isobara con $Q$, $W$ e $\Delta U$ sono là. Qui le riprendo in due righe ciascuna, con
  il link, per ricavare $C_V$ e $C_p$; il lavoro dell'isobara lo scrivo $p\,\Delta V = nR\,\Delta T$.
- Confine con la 113: qui $\gamma$ è solo definito, con i suoi due valori e il link; la legge $pV^\gamma$ è nella 113.
- Simbolo dei gradi di libertà: $\ell$ (come l'Amaldi, da verificare). $U = \tfrac{\ell}{2} nRT$, $C_V = \tfrac{\ell}{2} R$.
- Il calore molare è definito con le moli e legato al calore specifico con $C = c\,M$; l'esempio 4 fa il passaggio dai grammi
  alle moli e torna al calore specifico per chilogrammo.
- $\Delta U = n\,C_V\,\Delta T$ per ogni trasformazione ha una sottosezione sua e un riquadro di avviso: serve alla 113 e alle
  macchine termiche.
- Le temperature degli esempi 1 e 2 sono in gradi Celsius apposta, per l'avviso sui 273 aggiunti a una differenza.
- Le vibrazioni e la rotazione attorno all'asse della molecola stanno in una nota che si può saltare, con il rimando alla
  fisica quantistica senza spiegazione.
- Mayer si ricava (primo principio più equazione di stato); l'equipartizione si enuncia, dicendolo.

## Domande per Andrea

- Il simbolo dei gradi di libertà: $\ell$, $f$ o $\nu$? Ho usato $\ell$.
- La riga del vapore d'acqua nella tabella ($\ell = 6$, accordo solo approssimato) aiuta o confonde? L'alternativa è fermarsi ai
  gas biatomici.
- Il calore specifico a volume costante per chilogrammo (esempio 4) serve al terzo anno, o basta il calore molare?
- Negli esercizi il testo dice sempre "gas monoatomico" o "gas biatomico" ma non dà $C_V$: lo studente deve ricordare
  $\tfrac32 R$ e $\tfrac52 R$. Va bene, o meglio scriverli nel testo ai primi livelli?
- L'aria trattata come gas biatomico: basta la frase che c'è, o serve un esempio con l'aria di una stanza?

## Da verificare

- Calori molari misurati della tabella, a 25 °C, scritti a memoria dai valori del NIST Chemistry WebBook ($C_p$) con
  $C_V = C_p - R$: He e Ar $12{,}5$ e $20{,}8$; H₂ $20{,}5$ e $28{,}8$; N₂ $20{,}8$ e $29{,}1$; O₂ $21{,}1$ e $29{,}4$; H₂O vapore
  $25{,}3$ e $33{,}6$ J/(mol K). I rapporti $\gamma$: $1{,}67$, $1{,}67$, $1{,}40$, $1{,}40$, $1{,}39$, $1{,}33$.
- Masse molari: azoto $28{,}0$ g/mol nella lezione; negli esercizi anche He $4{,}00$, Ne $20{,}2$, Ar $39{,}9$, O₂ $32{,}0$, H₂ $2{,}02$.
- "A temperature di migliaia di kelvin le vibrazioni cominciano a contare": ordine di grandezza per N₂ e O₂, a memoria.
- Il nome "relazione di Mayer" e "principio di equipartizione dell'energia" come li scrive il libro adottato.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `gas-volume-costante-pressione-costante` (i due cilindri),
`isocora-isobara-stesse-isoterme` (isoterme $p = 3/V$ e $p = 4{,}5/V$, $A(1{,}5; 2)$, $B(1{,}5; 3)$, $C(2{,}25; 2)$, controllate: $3/1{,}5 = 2$,
$4{,}5/1{,}5 = 3$, $4{,}5/2{,}25 = 2$; riga `% poi-interattivo`), `barre-calore-elio-due-trasformazioni` (in scala: 1 cm ogni
$498{,}6$ J, barre di 3 cm e di 3 + 2 cm), `gradi-liberta-monoatomico-biatomico`.

Interattiva `calori-molari-due-cilindri` (`fisica/CaloriMolariCilindri.tsx`, registrata sotto il commento del gruppo 42):
risponde a "con lo stesso calore, quale gas si scalda di più, quello a volume costante o quello a pressione costante, e dove va
il resto?". Una mole a 300 K, calore da 0 a 3000 J, gas monoatomico o biatomico; il pistone libero sale con $V \propto T$, e
accanto a ogni cilindro una barra divide il calore in $\Delta U$ e $W$. Il testo dopo la figura dà i numeri per 1500 J.

## Esercizio guidato

L'esempio 3 (l'azoto che solleva il pistone) renderebbe di più come esercizio guidato. Si fermerebbe in tre punti: prima della
formula ("quale calore molare serve qui, $C_V$ o $C_p$, e quanto vale per l'azoto?"), dopo $\Delta T$ ("quanto lavoro ha fatto
il gas sul pistone?") e alla fine ("con il pistone bloccato l'aumento di temperatura sarebbe stato più grande o più piccolo?").

## Esercizi

Generatore `fis-calori-molari`, sei livelli (specifica in `specs/exercises/fis-calori-molari.md`): Il calore a volume costante,
Il calore a pressione costante, I gas biatomici, L'aumento di temperatura, Lavoro ed energia interna, Dai grammi alle moli.
Nessuna scena: l'argomento non ha una geometria che cambi con i dati. L'esempio 5 (riconoscere il gas dal calore molare
misurato) non ha un livello: la risposta sarebbe un'etichetta e non una grandezza.

Prerequisiti proposti: fis-energia-interna, principi-termo, fis-trasformazioni-termodinamiche, fis-gas-perfetto
