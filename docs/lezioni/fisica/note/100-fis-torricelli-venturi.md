# Note: Il teorema di Torricelli e l'effetto Venturi

Lezione nuova (lotto del terzo anno di fisica, gruppo 38, 6 ottobre 2026). Conti rifatti in Python con i dati scritti come nella lezione:

- esempio 1: $\sqrt{2 \cdot 9{,}8 \cdot 0{,}80} = \sqrt{15{,}68} = 3{,}960$ m/s;
- esempio 2: $t = \sqrt{0{,}90/9{,}8} = 0{,}3030$ s, $x = 3{,}96 \cdot 0{,}303 = 1{,}200$ m, $2\sqrt{0{,}80 \cdot 0{,}45} = 1{,}2$ m, $q = \pi \cdot 25 \cdot 10^{-6} \cdot 3{,}96 = 3{,}110 \cdot 10^{-4}$ m³/s;
- testo dopo l'interattiva: $2\sqrt{0{,}5 \cdot 0{,}5} = 1{,}00$ m, $2\sqrt{0{,}2 \cdot 0{,}8} = 0{,}80$ m;
- esempio 3: $\sqrt{12\,000/3000} = 2{,}0$ m/s, controllo $500 \cdot (16 - 4) = 6000$ Pa, $q = 2{,}0 \cdot 10^{-3}$ m³/s;
- esempio 4: $\sqrt{4800/1{,}2} = 63{,}25$ m/s $= 227{,}7$ km/h; con $1000$ kg/m³ verrebbe $2{,}19$ m/s;
- esempio 5: $0{,}6 \cdot 1300 = 780$ Pa, $780 \cdot 20 = 15\,600$ N, $15\,600/9{,}8 = 1592$ kg; $780/101\,000 = 0{,}77\,\%$.

`check.mts` passa senza errori; restano gli avvisi "titolo con maiuscole all'inglese" sui titoli che contengono Torricelli, Venturi e Pitot, che sono nomi propri.

## Scelte

- La lezione è una raccolta di applicazioni della stessa equazione: ognuna dice quali due punti si confrontano e quali termini cadono. La tabella finale le mette in fila.
- Torricelli: dimostrato da Bernoulli con le due ipotesi ($p_1 = p_2 = p_0$, $v_1 \approx 0$). Il serbatoio chiuso in pressione è solo nominato in un riquadro.
- La gittata del getto ($x = 2\sqrt{h\,y}$) c'è perché lega la lezione al moto del proiettile (lezione 56, linkata) e dà all'interattiva una domanda con una risposta non ovvia. Il massimo a metà altezza è giustificato con "prodotto di due numeri di somma fissa", senza derivate.
- Venturi: la formula di $v_1$ è ricavata per sostituzione; il dislivello $\Delta h$ dei tubicini è collegato a Stevino. La differenza di pressione è scritta $p_1 - p_2$, positiva.
- Pitot: schema dell'aereo (presa sulla punta e presa sul fianco), con il punto di ristagno. Il manometro è indicato con una scritta e non disegnato.
- Portanza: la formula $F = \tfrac12 d (v_s^2 - v_i^2) S$ con le velocità sopra e sotto come dati. Un riquadro dice che Bernoulli non spiega perché l'aria sopra è più veloce e smentisce la spiegazione dei "tempi di transito uguali", che molti libri danno ancora. Pedici $s$ (sopra) e $i$ (sotto).
- L'esempio del tetto sta nella 99; qui non è ripetuto.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `torricelli-serbatoio-foro-profondita`, `botte-getto-gittata` (scala 2 cm per metro: livello a 1,25, foro a 0,45, parabola $y = 0{,}45 - 0{,}3125\,x^2$ che tocca terra a $x = 1{,}2$: $0{,}3125 \cdot 1{,}44 = 0{,}45$), `tubo-di-venturi-dislivello`, `tubo-di-pitot-prese-pressione`, `profilo-alare-linee-di-flusso` (qualitative le ultime tre).

Interattiva (registrata sotto il commento del gruppo 38):

- `serbatoio-foro-getto` (`fisica/SerbatoioGetto.tsx`): serbatoio pieno fino a 1,00 m, foro trascinabile lungo la parete (o con il cursore) da 10 a 90 cm dal suolo a passi di 5 cm; getto parabolico in scala (3,6 cm per metro), tacca sul suolo alla gittata massima. Domanda: da quale altezza il getto arriva più lontano? Risposta nel testo: da metà altezza, e due fori simmetrici rispetto alla metà hanno la stessa gittata. Nessuna animazione: il getto è stazionario.

Il venturimetro non ha un'interattiva sua: la figura della 99 (`bernoulli-tubo-barre`) con il dislivello a zero mostra già la pressione che scende nella strozzatura.

## Esercizi

Generatore `fis-torricelli-venturi`, sei livelli (specifica in `specs/exercises/fis-torricelli-venturi.md`): La velocità di uscita dal foro, La profondità del foro, Dove arriva il getto, Il tubo di Venturi, Il tubo di Pitot, La portanza. Scena nuova `serbatoio-foro` (`scenes/SerbatoioForo.tsx`) ai livelli 1, 2 e 3. Senza esercizio: la portata del foro e la formula inversa del venturimetro.

## Esercizio guidato

L'esempio 2 (il getto della botte). Si fermerebbe in tre punti: "quanto vale la profondità del foro?" (livello meno altezza dal suolo); "da quale altezza cade il getto?" ($y$, non $h$); "che moto fa l'acqua uscita dal foro?" (proiettile lanciato in orizzontale).

## Domande per Andrea

- La gittata del getto e il massimo a metà altezza: sono nel programma del terzo anno, o è meglio lasciarli a un riquadro?
- Il riquadro sulla portanza dice che la spiegazione dei tempi uguali è sbagliata. L'Amaldi che cosa dice? Se il libro di classe la dà, lo studente trova qui il contrario: va bene dirlo così netto?
- La formula del venturimetro con il rapporto delle sezioni: si dà come formula da ricordare o solo come procedimento (continuità più Bernoulli)?
- Il tubo di Pitot è disegnato come quello degli aerei. Alcuni libri disegnano la versione con due tubicini in un canale d'acqua: serve anche quella?

## Da verificare

- Torricelli allievo di Galileo, inventore del barometro; enunciato del teorema nel 1644 (*Opera geometrica*): a memoria.
- Giovanni Battista Venturi, studi sulla strozzatura alla fine del Settecento (1797): a memoria.
- Henri Pitot, francese, tubo inventato nel 1732 per misurare la velocità della Senna: a memoria; nella lezione c'è solo "nel Settecento".
- Densità dell'aria $1{,}2\,\text{kg/m}^3$.
- Velocità dell'aria sopra e sotto l'ala ($70$ e $60$ m/s) e superficie alare di $20\,\text{m}^2$: dati di esempio, plausibili per un aereo da turismo di $1{,}6$ tonnellate, non misurati.
- "Le due correnti non si ricongiungono" dietro l'ala: risultato noto delle misure in galleria del vento, scritto a memoria.

Prerequisiti proposti: fis-bernoulli, fis-portata-continuita, fis-moto-proiettili, fis-legge-stevino
