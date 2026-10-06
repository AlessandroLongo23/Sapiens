# Note: La teoria cinetica dei gas

Lezione nuova (lotto del terzo anno, gruppo 40, 6 ottobre 2026). `check.mts`: 0 errori, 0 avvisi. Conti rifatti in
Python (`scratchpad/gruppo-40/conti105.py`):

- esempio 1: $2{,}0 \cdot 6{,}02 \cdot 10^{23} = 1{,}204 \cdot 10^{24}$; $4{,}00 \cdot 10^{-3} / 6{,}02 \cdot 10^{23} = 6{,}645 \cdot 10^{-27}$ kg;
  azoto $28{,}0 \cdot 10^{-3} / N_A = 4{,}651 \cdot 10^{-26}$ kg;
- esempio 2: $\Delta t = 0{,}20/400 = 5{,}0 \cdot 10^{-4}$ s, $2000$ urti al secondo, $F = 4{,}65 \cdot 10^{-26} \cdot 400^2 / 0{,}10 = 7{,}44 \cdot 10^{-20}$ N;
  molecole in un litro d'aria a 20 °C: $2{,}50 \cdot 10^{22}$;
- esempio 3: media $400$, media dei quadrati $1{,}8 \cdot 10^{5}$, $v_{qm} = 424{,}3$ m/s;
- esempio 4: $N m = 2{,}325 \cdot 10^{-3}$ kg, $p = 2{,}325 \cdot 10^{-3} \cdot 508^2 / (6{,}00 \cdot 10^{-3}) = 1{,}00000 \cdot 10^{5}$ Pa (con $508$ m/s scelto apposta);
- esempio 5: $\sqrt{3 \cdot 1{,}01 \cdot 10^{5} / 1{,}20} = 502{,}5$ m/s, cioè $1809$ km/h;
- esempio 6: $3 \cdot 2{,}00 \cdot 10^{5} \cdot 1{,}00 \cdot 10^{-2} / (1{,}37 \cdot 10^{3})^2 = 3{,}197 \cdot 10^{-3}$ kg, $N = 4{,}81 \cdot 10^{23}$, $0{,}80$ mol;
- grafico pressione-velocità: $p = 0{,}3875\,v^2$ Pa, cioè $y = 0{,}155\,x^2$ con 1 cm = 200 m/s e 1 cm = $10^5$ Pa; punti $(2{,}54; 1)$ e $(5{,}08; 4)$.

## Scelte

- Confine con la 104 (gruppo 39): la mole, $N_A$ e $pV = N k_B T$ sono della 104; qui si richiamano $N = n N_A$ e
  $m = M/N_A$ in un paragrafo con l'esempio 1, perché servono subito.
- Confine con la 106 (mia): la 105 arriva a $pV = \frac{1}{3} N m v_{qm}^2$ e alla forma con la densità,
  $v_{qm} = \sqrt{3p/d}$; l'energia cinetica media, $\frac{3}{2} k_B T$ e $v_{qm}$ dalla temperatura sono della 106.
  L'ultima sezione mette i due $pV$ uno accanto all'altro e rimanda.
- Dimostrazione: scatola cubica di lato $L$, una molecola, forza media $m v_x^2 / L$, somma, $\overline{v_x^2} = \frac{1}{3}\overline{v^2}$.
  Gli urti tra molecole si trascurano dicendo che il risultato non cambia (enunciato).
- Simboli: $m$ è sempre la massa di una molecola, $M$ la massa molare, $N m$ la massa del gas, $d$ la densità (come nel
  biennio). La quantità di moto si scrive per esteso, $m v_x$, senza la lettera $p$, che qui è la pressione: la lezione
  lo dice in una riga. L'impulso dato alla parete è scritto $2 m v_x$, senza il simbolo $\vec I$ del README.
- La velocità media si scrive $\bar v$, la media dei quadrati $\overline{v^2}$.
- La forma con la densità non è nell'elenco dei confini del brief: l'ho messa qui perché è una riscrittura della
  stessa formula e dà l'esempio più concreto (l'aria).

## Domande per Andrea

- La dimostrazione con la scatola cubica e la molecola che non urta le altre va bene così, o l'Amaldi del terzo anno
  la fa con le molecole divise in tre gruppi lungo i tre assi? (da verificare)
- $v_{qm}$ o $\langle v \rangle$ e $v_{qm}$: nel README c'è $v_{qm}$; per la velocità media ho usato $\bar v$. Va bene?
- La formula $p = \frac{1}{3} d\,v_{qm}^2$ sta qui o nella 106?
- La nota storica su Bernoulli (1738), Clausius, Maxwell e Boltzmann: tenerla?

## Da verificare

- Densità dell'aria a 20 °C e 1 atm: $1{,}20\,\text{kg/m}^3$ (valore corrente dei libri; a 0 °C è $1{,}29$).
- Masse molari: elio $4{,}00$, azoto $28{,}0$ g/mol.
- "Circa $2{,}5 \cdot 10^{22}$ molecole in un litro d'aria" (calcolato a 20 °C e $1{,}01 \cdot 10^5$ Pa).
- "Ogni molecola urta le altre miliardi di volte al secondo" (ordine di grandezza corrente, non calcolato qui).
- Daniel Bernoulli, "Hydrodynamica", 1738; Clausius, Maxwell e Boltzmann a metà Ottocento: scritti a memoria.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `gas-perfetto-molecole-in-moto`, `urto-elastico-molecola-parete`
(componenti tratteggiate, prima e dopo), `molecola-andata-ritorno-scatola`, `velocita-media-e-quadratica-media`
(1 cm = 125 m/s), `grafico-pressione-velocita-quadratica-media` (riga `% poi-interattivo`).

Interattiva `gas-scatola-urti-pressione` (`fisica/GasScatolaPressione.tsx`, con il pezzo mio `fisica/molecole.tsx`):
risponde a "che cosa succede alla pressione se raddoppi le molecole, se dimezzi il volume, se raddoppi la
temperatura?". Molecole in una scatola a tre dimensioni vista di fronte, urti elastici, segni arancioni sulle pareti a
ogni urto; cursori per $N$ (10-80), $V$ (1-2 L), $T$ (100-600 K). La pressione si legge due volte, come multiplo di
quella di partenza: dalla formula e contata dagli impulsi degli ultimi 4 secondi. Il valore contato oscilla di qualche
punto percentuale (le molecole sono poche decine), e la lezione lo dice. Il cursore della temperatura anticipa la 106:
il testo dice che scaldare vuol dire far correre di più le molecole e rimanda. Con il movimento ridotto un bottone fa
avanzare di un secondo.

## Esercizio guidato

L'esempio 4 (la pressione dal modello). Si fermerebbe: (1) sul volume, chiedendo di scriverlo in metri cubi; (2) sulla
massa di tutto il gas, $N m$; (3) sul risultato, chiedendo che cosa succede se la velocità raddoppia.

## Esercizi

Generatore `fis-teoria-cinetica`, sei livelli: Quante molecole ci sono; La massa di una molecola; La velocità
quadratica media di poche molecole (scena nuova `molecole-velocita`); La pressione dal modello; La velocità dalla
pressione e dalla densità; Come cambia la pressione. Restano senza esercizio l'esempio 2 (forza media di una molecola)
e l'esempio 6 (la massa del gas dalla pressione).

Prerequisiti proposti: fis-gas-perfetto, fis-impulso, fis-urti-elastici, fis-pressione
