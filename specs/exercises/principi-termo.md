# Il primo principio della termodinamica

Generatore: `principi-termo` (`src/lib/exercises/v2/generators/principi-termo.ts`, con
`src/lib/exercises/v2/fis-termo-pv.ts`). Verifica indipendente: `scripts/exercises/checkers/principi_termo.py` (con
`_fis_termo_pv.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/110-principi-termo.md`. Percorso nel database:
`high_school/physics/termodinamica/principi-termo`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Calore assorbito e lavoro compiuto
2. I segni di calore e lavoro
3. Trovare il calore o il lavoro
4. Il lavoro va calcolato
5. La variazione di temperatura
6. Cicli, recipienti rigidi, nessuno scambio di calore

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, l'unità nell'opzione, il segno nella risposta. Ai livelli 1, 2, 3 e 6 calori e lavori
sono interi di tre cifre che non finiscono per zero (da $105$ a $985\,\text{J}$) e la risposta è la somma o la differenza
esatta, mai con uno zero finale. Ai livelli 4 e 5 la risposta ha due cifre significative, mai un pari merito. La
convenzione è quella della lezione: $\Delta U = Q - W$, $Q > 0$ se assorbito, $W > 0$ se compiuto dal gas.

## Livello 1: calore assorbito e lavoro compiuto

- "Un gas assorbe $358\,\text{J}$ di calore e, espandendosi, compie $171\,\text{J}$ di lavoro. Di quanto varia la sua energia interna?"
  Risposta $187\,\text{J}$; distrattori $529\,\text{J}$ ($Q + W$), $-187\,\text{J}$ ($W - Q$), poi un valore vicino.
- "... assorbe $555\,\text{J}$ ... compie $571\,\text{J}$": $-16\,\text{J}$ (il gas spende più di quanto riceve).

## Livello 2: i segni di calore e lavoro

Tre casi in parti uguali: il gas cede calore e compie lavoro; assorbe calore e subisce lavoro; cede calore e subisce
lavoro. Il lavoro subito è scritto "l'ambiente compie su di esso un lavoro di". I distrattori sono le altre combinazioni
dei due segni.

- "Un gas assorbe $571\,\text{J}$ di calore, mentre l'ambiente compie su di esso un lavoro di $624\,\text{J}$. Di quanto varia la sua
  energia interna?" Risposta $1195\,\text{J}$; distrattori $-53\,\text{J}$, $53\,\text{J}$, $-1195\,\text{J}$.
- "Un gas cede $171\,\text{J}$ di calore, mentre compie $616\,\text{J}$ di lavoro.": $-787\,\text{J}$.

## Livello 3: trovare il calore o il lavoro

Si dà la variazione dell'energia interna ("aumenta di", "diminuisce di") e una delle altre due grandezze, con il suo verso
a parole. Metà dei casi chiede il calore, $Q = \Delta U + W$ (la consegna dice "positivo se assorbito"), metà il lavoro,
$W = Q - \Delta U$ ("negativo se lo subisce").

- "L'energia interna di un gas aumenta di $934\,\text{J}$, mentre l'ambiente compie sul gas un lavoro di $239\,\text{J}$. Quanto calore
  scambia il gas?" Risposta $695\,\text{J}$; distrattori $1173\,\text{J}$ ($\Delta U - W$), $-695\,\text{J}$, $-1173\,\text{J}$.
- "L'energia interna di un gas diminuisce di $578\,\text{J}$, mentre il gas cede $175\,\text{J}$ di calore. Quanto lavoro compie il gas?"
  Risposta $403\,\text{J}$.

## Livello 4: il lavoro va calcolato

Espansione a pressione costante ($1{,}1$-$5{,}5 \cdot 10^{5}\,\text{Pa}$, da $V_i$ tra $1{,}0$ e $5{,}0\,\text{L}$, con $\Delta V$ da $1{,}0$ a
$4{,}0\,\text{L}$) con un calore assorbito di due cifre in notazione scientifica, compreso tra due e quattro volte il lavoro
(come per un gas perfetto). $\Delta U = Q - p\,\Delta V$. La scena `piano-pv` disegna l'isobara, con il volume in litri e
la pressione in unità di $10^{5}\,\text{Pa}$.

- "Un gas in un cilindro con il pistone libero, alla pressione costante di $2{,}3 \cdot 10^{5}\,\text{Pa}$, assorbe
  $2{,}4 \cdot 10^{3}\,\text{J}$ di calore e si espande da $1{,}3\,\text{L}$ a $4{,}0\,\text{L}$. Di quanto varia la sua energia interna?"
  $W = 621\,\text{J}$, risposta $1{,}8 \cdot 10^{3}\,\text{J}$; distrattori $3{,}0 \cdot 10^{3}\,\text{J}$ ($Q + W$), $2{,}4 \cdot 10^{3}\,\text{J}$ (il lavoro
  dimenticato), $6{,}2 \cdot 10^{2}\,\text{J}$ (il lavoro da solo).

## Livello 5: la variazione di temperatura

Gas perfetto monoatomico, da $0{,}11$ a $0{,}99\,\text{mol}$ o da $1{,}1$ a $3{,}9\,\text{mol}$; calore e lavoro come al livello 2, con tutte
e quattro le combinazioni dei segni. $\Delta T = \frac{2\,\Delta U}{3\,n\,R}$ con $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$, scritto nel
testo; in valore assoluto tra $5$ e $400\,\text{K}$.

- "Un campione di $0{,}93\,\text{mol}$ di gas perfetto monoatomico assorbe $392\,\text{J}$ di calore, mentre compie $558\,\text{J}$ di lavoro.
  Di quanto varia la sua temperatura?" $\Delta U = -166\,\text{J}$, risposta $-14\,\text{K}$; distrattori $-21\,\text{K}$ (senza i
  $\tfrac{3}{2}$), $82\,\text{K}$ ($Q + W$), $14\,\text{K}$ (il segno).

## Livello 6: cicli, recipienti rigidi, nessuno scambio di calore

Tre casi in parti uguali, dalla tabella "Quattro casi semplici" della lezione.

- Ciclo: "In una trasformazione ciclica un gas assorbe in tutto $616\,\text{J}$ di calore e ne cede in tutto $934\,\text{J}$. Quanto
  lavoro compie in un ciclo?" Risposta $-318\,\text{J}$; distrattori $1550\,\text{J}$ (i calori sommati), $318\,\text{J}$, $616\,\text{J}$.
- Nessuno scambio di calore: "Un gas si espande senza scambiare calore con l'ambiente e compie $624\,\text{J}$ di lavoro. Di
  quanto varia la sua energia interna?" Risposta $-624\,\text{J}$. Nella compressione ("che compie su di esso un lavoro
  di") la risposta è positiva.
- Volume costante: "Un gas chiuso in un recipiente rigido cede $431\,\text{J}$ di calore. Di quanto varia la sua energia
  interna?" Risposta $-431\,\text{J}$.

Negli ultimi due casi il distrattore vero è il segno opposto; gli altri due sono valori vicini.

## Esercizi da evitare

- Risultati che finiscono con uno zero ($300\,\text{J}$), o nulli.
- Al livello 2 calore e lavoro con lo stesso valore (due combinazioni di segni darebbero la stessa risposta).
- Al livello 4 un calore che darebbe a un gas in espansione isobara un'energia interna che cala.

## Verifica

`principi_termo.py` rilegge il testo, ricava i segni dalle parole, controlla intervalli e formato, ricalcola con i
razionali e confronta l'opzione giusta e il formato delle altre. Al livello 3 controlla che la consegna dica la
convenzione del segno; al livello 4 che la scena sia l'isobara del testo.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, $1000$ esercizi per livello ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 97 px su 252). Errori piantati (seed 1, un campione ogni
25): bocciati tutti, 240 su 240 per tipo (indice, numero del testo, testo dell'opzione giusta, opzione doppia, parole
vietate). Esercizi diversi su 1000 (seed da 1): 1000, 999, 1000, 1000, 1000, 934.

## Domande per la revisione

- Al livello 3 la consegna dice "positivo se assorbito" e "negativo se lo subisce": basta, o la domanda va spezzata
  ("assorbe o cede? quanto?")?
- Il livello 6 mette insieme tre casi con un conto quasi nullo: sono domande di ragionamento. Va bene come ultimo
  livello, o meglio distribuirli?
