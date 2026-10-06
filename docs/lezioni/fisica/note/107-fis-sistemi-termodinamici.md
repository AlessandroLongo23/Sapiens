# Note: Sistemi termodinamici e principio zero

Lezione nuova (lotto del terzo anno, gruppo 40, 6 ottobre 2026). `check.mts`: 0 errori, 1 avviso (14 grassetti: è una
lezione di vocabolario, e sono tutti termini nel punto in cui vengono definiti). Conti rifatti in Python:

- esempio 2: $1{,}01 \cdot 10^{5} \cdot 12{,}0 \cdot 10^{-3} = 1212$ J, $0{,}500 \cdot 8{,}31 = 4{,}155$ J/K, $T_A = 291{,}7$ K;
  $2{,}50 \cdot 10^{5} \cdot 6{,}00 \cdot 10^{-3} = 1500$ J, $T_B = 361{,}0$ K;
- esempio 3: $60{,}0 \cdot 2/5 = 24{,}0$ cm e $36{,}0$ cm;
- esempio 4: $(1{,}5 \cdot 2{,}0 + 1{,}0 \cdot 3{,}0)/5{,}0 = 1{,}2$, cioè $1{,}2 \cdot 10^{5}$ Pa;
- figura del piano pressione-volume: 1 cm = 2 L e 1 cm = $0{,}5 \cdot 10^5$ Pa, $A = (6; 2{,}02)$, $B = (3; 5)$, isoterme
  $x\,y = 12{,}12$ e $x\,y = 15$.

## Scelte

- Confine con la 68 del biennio: l'equilibrio termico e il principio zero ci sono già in un riquadro. Qui il principio
  zero ha il suo enunciato con i tre sistemi, il legame con la definizione di temperatura e l'esempio con il termometro;
  il calorimetro non si ripete.
- Confine con la 102 e la 111: le isoterme compaiono solo come curve tratteggiate "stessa temperatura" nella figura
  dell'esempio 2; i nomi isocora, isobara e isoterma sono rimandati alla 111 con il link.
- Confine con la 109 e la 110: calore e lavoro sono nominati come i due modi in cui passa l'energia, senza formule.
  Le trasformazioni reversibili non ci sono: sono della 116.
- Variabili estensive e intensive: le ho messe in un paragrafo, perché i libri del terzo anno le danno qui.
- "Parete diatermica, o conduttrice": negli esercizi uso "conduttrice" e "isolante", più vicine allo studente.
- L'esempio 4 (due bombole collegate) usa $n = pV/(RT)$ e serve a far vedere un equilibrio meccanico che manca; non è
  quasistatico, e lo dice.

## Domande per Andrea

- Estensive e intensive: tenerle qui?
- "Piano pressione-volume" o "piano di Clapeyron"? Ho usato il primo, come il README.
- L'equilibrio chimico: lo cito in una riga come terza condizione. Basta?
- Il principio zero enunciato con "sistemi" $A$, $B$, $C$ e non con "corpi": va bene?

## Da verificare

- Ralph Fowler e il nome "principio zero" negli anni Trenta del Novecento: scritto a memoria.
- "Le molecole sono dell'ordine di $10^{23}$" per il gas di un cilindro di laboratorio.

## Figure

Sei TikZ, guardate in chiaro e in scuro: `sistema-ambiente-universo`, `sistemi-aperto-chiuso-isolato`,
`piano-pressione-volume-due-stati`, `cilindro-due-gas-pistone-equilibrio`, `trasformazione-quasistatica-e-brusca`,
`principio-zero-tre-sistemi`. Quattro sono larghe poco più di 400 px: sul telefono si rimpiccioliscono un po'.

Interattiva `compressione-lenta-e-brusca` (`fisica/CompressioneLentaBrusca.tsx`): risponde a "perché una compressione
lenta si disegna con una linea nel piano pressione-volume e una brusca no?". Novanta molecole in un cilindro tenuto a
300 K, da 4,0 L a 2,0 L. Piano (7 s): le due metà del gas contengono sempre circa lo stesso numero di molecole e il
punto dello stato scorre lungo la curva, sotto il pistone (cilindro e grafico hanno la stessa scala dei volumi). Di
colpo (0,25 s): il pistone spazza le molecole, la metà vicina ne ha il doppio dell'altra, sul grafico c'è un punto
interrogativo, e il punto $B$ compare dopo 2,5 s. Nella compressione lenta le molecole rimbalzano davvero sul pistone
che avanza e le pareti riportano subito la velocità quadratica media al valore di 300 K (un termostato); in quella
brusca sono spinte dal pistone senza guadagnare velocità: è una semplificazione, scritta nel commento del file.

## Esercizio guidato

L'esempio 3 (dove si ferma il pistone). Si fermerebbe: (1) su che cosa è uguale nei due gas all'equilibrio e perché;
(2) sul rapporto dei volumi; (3) sulla lunghezza della parte di sinistra.

## Esercizi

Generatore `fis-sistemi-termodinamici`, cinque livelli: Aperto, chiuso o isolato; Lo stato nel piano pressione-volume
(scena `piano-pv` del gruppo 41); Due gas e una parete; Il principio zero; Dove si ferma il pistone. I livelli 1, 3 e
4 sono domande di ragionamento su casi generati. Resta senza esercizio l'esempio 4 (le due bombole).

Prerequisiti proposti: fis-gas-perfetto, fis-equilibrio-termico, fis-temperatura
