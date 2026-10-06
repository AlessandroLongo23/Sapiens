# Note: Il primo principio della termodinamica

Lezione nuova (lotto del terzo anno, gruppo 41, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $500 - 200 = 300$ J; esempio 2: $-120 - (-350) = 230$ J (con il segno sbagliato $-470$ J);
- esempio 3: $p_A V_A = 3{,}0 \cdot 10^5 \cdot 2{,}0 \cdot 10^{-3} = 600$ J e $p_B V_B = 600$ J, quindi stessa temperatura e
  $Q = W$: $1200$ J e $400$ J;
- esempio 4: $1{,}5 \cdot 10^5 \cdot 4{,}0 \cdot 10^{-3} = 600$ J, $1500 - 600 = 900$ J;
- esempio 5: $2 \cdot 900 / (3 \cdot 0{,}20 \cdot 8{,}31) = 361{,}0$ K. I dati sono coerenti con un'isobara di un gas
  monoatomico: $T_i = 450 / (0{,}20 \cdot 8{,}31) = 270{,}8$ K, $T_f = 631{,}8$ K, e $Q = \tfrac{5}{2} W$;
- esempio 6: $300 + (-800) = -500$ J.

`check.mts`: 0 errori, 0 avvisi.

## Struttura ed esempi

L'acqua scaldata con la fiamma o con il mulinello (figura); calore e lavoro come due modi di scambiare energia;
l'enunciato con la tabella dei segni e lo schema (figura), il paragone con il conto in banca, esempio 1 (con la barra del
bilancio), esempio 2 (compressione con calore ceduto), avvisi sul segno del lavoro e sulle unità, nota sull'altra
convenzione, interattiva, avviso "la temperatura non segue il calore"; il principio come conservazione dell'energia e il
moto perpetuo di prima specie; funzioni di stato e cammino (esempio 3, figura); il procedimento, esempi 4, 5 e 6; i
quattro casi semplici in tabella, con i link alle lezioni che li sviluppano.

## Scelte

- Confini. L'energia interna e $U = \tfrac{3}{2} n R T$ sono della 108 (gruppo 40): qui si usano con il link (esempio 5).
  L'esperimento di Joule con il mulinello è nella 67 del biennio: richiamato in apertura con il link, non rifatto.
  Isocora, isobara, isoterma e cicli con i conti sono della 111; l'adiabatica della 113; le macchine della 114. Qui
  compaiono solo nella tabella finale dei casi in cui un termine è zero.
- Convenzione del README: $\Delta U = Q - W$. L'altra ($\Delta U = Q + W$) è in una nota, perché lo studente la trova sul
  libro di chimica.
- Il moto perpetuo di prima specie sta qui (quello di seconda specie è della 115).
- Il lavoro "compiuto sul gas" è sempre scritto così, mai con $W$ negativo dato nel testo: il segno lo mette lo studente.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `acqua-scaldata-calore-o-lavoro`, `primo-principio-schema-segni`,
`bilancio-calore-lavoro-energia-interna`, `due-cammini-calore-diverso` (isoterma tratteggiata $y = 4{,}32/x$, cioè
$p\,V = 600$ kPa·L).

Interattiva (registrata sotto il commento del gruppo 41):

- `primo-principio-bilancio` (`fisica/PrimoPrincipioBilancio.tsx`). Domanda: che cosa succede all'energia interna se il
  gas assorbe $300$ J e ne spende $300$ in lavoro? E se viene compresso senza scambiare calore? Due cursori per $Q$ e $W$
  (da $-600$ a $600$ J), frecce del calore e del lavoro sul cilindro, barre di $Q$, $W$ e $\Delta U$, temperatura di una
  mole di gas monoatomico ($\Delta T = \Delta U / 12{,}465$ K). Lo spostamento del pistone è solo indicativo del segno di
  $W$. Risposta nel testo.

## Esercizi

Generatore `principi-termo`, sei livelli (specifica in `specs/exercises/principi-termo.md`). La scena `piano-pv` al
livello 4.

## Esercizio guidato

L'esempio 2 (compressione con calore ceduto). Si fermerebbe in tre punti: (1) "che segno ha $W$ se il lavoro è compiuto
sul gas?"; (2) "che segno ha $Q$ se il gas cede calore?"; (3) prima del risultato, "ti aspetti che l'energia interna
aumenti o diminuisca? Il gas riceve $350$ J e ne restituisce $120$".

## Domande per Andrea

- Va bene dare il principio subito con $\Delta U = Q - W$, o preferisci partire da $Q = \Delta U + W$ ("dove finisce il
  calore")?
- La nota sull'altra convenzione ($\Delta U = Q + W$): la lasciamo, o confonde?
- L'esempio 5 usa $\Delta U = \tfrac{3}{2} n R \Delta T$ prima della lezione 111: va bene come ponte con la 108?
- La pompa della bicicletta come esempio di compressione quasi senza scambi di calore: è l'esempio che usi anche tu?

## Da verificare

- Date e nomi: il principio formulato "tra il 1842 e il 1850" da Julius Robert Mayer, James Prescott Joule e Hermann von
  Helmholtz (Mayer 1842, Helmholtz 1847, esperimenti di Joule 1843-1850), scritto a memoria.
- $1\,\text{cal} = 4{,}186$ J e i $4186$ J per scaldare di un grado un chilogrammo d'acqua (lezione 67).
- $R = 8{,}31$ J/(mol·K) (README).

Prerequisiti proposti: fis-lavoro-termodinamico, fis-energia-interna, calore, fis-energia-totale
