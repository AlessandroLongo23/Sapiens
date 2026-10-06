# Note: Le macchine termiche e il rendimento

Lezione nuova (lotto del terzo anno di fisica, gruppo 43, 6 ottobre 2026). Conti rifatti in Python:

- esempi 1 e 2: $1200 - 780 = 420$ J, $1 - 780/1200 = 0{,}35$, $420/1200 = 0{,}35$, $420/780 = 0{,}538$;
- esempio 3: $3{,}6/0{,}30 = 12$ kJ, $12 - 3{,}6 = 8{,}4$ kJ, $0{,}70 \cdot 12 = 8{,}4$ kJ, $3{,}6 \cdot 0{,}30 = 1{,}08$ kJ;
- esempio 4: $3{,}3 \cdot 10^4 / 0{,}30 = 1{,}1 \cdot 10^5$ J, $1{,}1 \cdot 10^5 - 3{,}3 \cdot 10^4 = 7{,}7 \cdot 10^4$ J,
  $1{,}1 \cdot 10^5 \cdot 3600 = 3{,}96 \cdot 10^8$ J, $3{,}96 \cdot 10^8 / 3{,}2 \cdot 10^7 = 12{,}375$ L;
- esempio 5: $2{,}0 \cdot 10^5 \cdot 3{,}0 \cdot 10^{-3} = 600$ J, $600/2850 = 0{,}2105$, $2850 - 600 = 2250$ J;
  $\tfrac32 \cdot 2{,}0 \cdot 10^{-3} \cdot 2{,}0 \cdot 10^5 = 600$ J e $\tfrac52 \cdot 3{,}0 \cdot 10^5 \cdot 3{,}0 \cdot 10^{-3} = 2250$ J;
- figura interattiva: $1000 - 700 = 300$ J e $0{,}30$; $1000 - 500 = 500$ J e $0{,}50$.

`check.mts`: 0 errori, 0 avvisi (lezione, formulario, flashcard).

## Struttura ed esempi

Dal calore al lavoro con un ciclo ($\Delta U = 0$, quindi $W = Q$; il ciclo nel piano pressione-volume e l'area); com'è
fatta una macchina termica (sorgenti, tabella di tre macchine, bilancio $W = Q_c - Q_f$, schema con le frecce in scala,
esempio 1); il rendimento nelle due forme (esempio 2, formule inverse, esempio 3, figura interattiva); la potenza (esempio 4,
il motore di un'auto con il consumo di benzina); il lavoro dal ciclo (esempio 5, il ciclo rettangolare); i rendimenti delle
macchine vere e il rimando alle lezioni 115 e 116.

## Scelte

- Confine con la 115: qui il secondo principio non si enuncia. La lezione dice solo che $\eta = 1$ vorrebbe $Q_f = 0$ e che
  una legge lo vieta, con il link. Confine con la 116: niente temperature nelle formule, niente rendimento massimo.
- Confine con le lezioni 109-111 (gruppo 41): il lavoro come area e la trasformazione ciclica si richiamano con il link,
  in poche righe. Il ciclo rettangolare dell'esempio 5 usa solo l'area di un rettangolo; il calore assorbito è dato nel
  testo, e un riquadro `ad-note` dice da dove viene, con il link alla lezione 112.
- Simboli del README: $Q_c$ e $Q_f$ in valore assoluto, $W = Q_c - Q_f$, $\eta = W/Q_c$. Un riquadro `ad-note` spiega il
  rapporto con la convenzione dei segni del primo principio.
- Il rendimento è scritto come numero ($0{,}35$) e, a parole, in percentuale. Il rendimento della lezione 64 (energia utile
  diviso energia spesa) è richiamato con il link: è lo stesso.
- "Sorgente di calore" è definita qui, perché serve a tutte le lezioni del capitolo.
- Le frecce dello schema sono larghe in proporzione all'energia (1 cm = 1000 J): lo stesso disegno torna nelle lezioni 115
  e 116, nelle figure interattive e nella scena degli esercizi.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `ciclo-piano-pv-area-lavoro` (ciclo generico, qualitativo),
`macchina-termica-schema-flussi` (in scala con l'esempio 1: larghezze 1,2 cm, 0,78 cm, 0,42 cm),
`ciclo-rettangolare-pv-esempio` (0,8 cm per litro, 1 cm per $10^5$ Pa: $A$ in (1,6; 3), $B$ in (4,0; 3)).

Interattiva `macchina-termica-flussi` (`fisica/MacchinaTermicaFlussi.tsx`): risponde a "che cosa succede al lavoro e al
rendimento se, a parità di calore assorbito, la macchina cede meno calore? E se i due calori raddoppiano?". Due cursori
($Q_c$ da 200 a 1000 J, $Q_f$ da 100 J a $Q_c$), frecce in scala, lavoro e rendimento sotto. Il calore ceduto non può
superare quello assorbito: il cursore si ferma. La figura lascia arrivare a rendimenti irrealistici ($0{,}90$): è un
bilancio, non una macchina vera, e il limite è l'argomento delle due lezioni dopo.

I pezzi dello schema (sorgente, macchina, freccia larga, nome con pedice) sono in un file mio,
`fisica/flussiCalore.tsx`, perché il kit non li ha.

## Esercizio guidato

L'esempio 4 (il motore di un'auto) renderebbe di più come esercizio guidato. Si fermerebbe in tre punti: (1) "quanto lavoro
compie il motore in un secondo?" (dalla potenza); (2) "per trovare il calore assorbito si moltiplica o si divide per il
rendimento?"; (3) "quanti secondi ci sono in un'ora, e quanto calore serve in un'ora?" prima della divisione per l'energia
di un litro di benzina.

## Da verificare

- Energia fornita da un litro di benzina: $3{,}2 \cdot 10^7$ J/L (valore corrente, potere calorifico inferiore circa
  32 MJ/L; scritto a memoria).
- Tabella dei rendimenti tipici (scritta a memoria, valori indicativi): locomotiva a vapore meno del 10%, motore a benzina
  25-35%, diesel 35-45%, centrale termoelettrica a vapore circa 40%, ciclo combinato fino al 60%.
- Le sorgenti della tabella delle tre macchine sono una semplificazione (nel motore a scoppio la "sorgente calda" è la
  combustione dentro il cilindro).

## Domande per Andrea

- Il rendimento negli esempi e negli esercizi va come numero ($0{,}35$) o in percentuale ($35\%$)? Qui numero, con la
  percentuale a parole.
- L'esempio 5 dà il calore assorbito senza calcolarlo (il conto con i calori molari è in un riquadro): va bene, o è meglio
  calcolarlo per intero ora che la lezione 112 viene prima?
- L'esempio con la benzina (litri all'ora) piace, o è fuori tema rispetto ai libri del terzo anno?
- La tabella dei rendimenti delle macchine vere: tenerla con valori indicativi, o toglierla finché non ha una fonte?

Prerequisiti proposti: principi-termo, fis-trasformazioni-termodinamiche, fis-lavoro-termodinamico, fis-potenza
