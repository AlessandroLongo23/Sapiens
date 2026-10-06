# Il lavoro in una trasformazione termodinamica

Generatore: `fis-lavoro-termodinamico` (`src/lib/exercises/v2/generators/fis-lavoro-termodinamico.ts`, con
`src/lib/exercises/v2/fis-termo-pv.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_lavoro_termodinamico.py`
(con `_fis_termo_pv.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/109-fis-lavoro-termodinamico.md`. Percorso nel
database: `high_school/physics/termodinamica/fis-lavoro-termodinamico`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il lavoro a pressione costante
2. Litri, kilopascal e atmosfere
3. Una compressione: il segno del lavoro
4. Il lavoro dal grafico: un segmento
5. Il lavoro dal grafico: due tratti
6. Il lavoro di un ciclo

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, l'unità nell'opzione: joule con due cifre significative, in notazione scientifica da
$100$ in su ($3{,}0 \cdot 10^{2}\,\text{J}$). Il segno fa parte della risposta ($-5{,}3 \cdot 10^{2}\,\text{J}$). Mai un pari
merito tra due arrotondamenti, mai una risposta sotto $100$ che finisce con uno zero. Pressioni con due cifre
($1{,}1$-$5{,}9 \cdot 10^{5}\,\text{Pa}$), volumi con una cifra decimale. $W$ è il lavoro compiuto dal gas, come nella lezione.

## Livello 1: il lavoro a pressione costante

Espansione, pressione in pascal e volumi in metri cubi, in notazione scientifica: $V_i$ da $1{,}0$ a $6{,}0 \cdot 10^{-3}\,\text{m}^3$,
$\Delta V$ da $1{,}0$ a $5{,}0 \cdot 10^{-3}\,\text{m}^3$, $V_f$ sotto $10 \cdot 10^{-3}\,\text{m}^3$. $W = p\,(V_f - V_i)$.

- "Un gas si espande alla pressione costante di $1{,}8 \cdot 10^{5}\,\text{Pa}$: il suo volume passa da $4{,}1 \cdot 10^{-3}\,\text{m}^3$ a
  $6{,}3 \cdot 10^{-3}\,\text{m}^3$. Quanto lavoro compie?" Risposta $4{,}0 \cdot 10^{2}\,\text{J}$ ($396\,\text{J}$); distrattori
  $1{,}1 \cdot 10^{3}\,\text{J}$ (il volume finale al posto di $\Delta V$), $7{,}4 \cdot 10^{2}\,\text{J}$ (il volume iniziale),
  $1{,}9 \cdot 10^{3}\,\text{J}$ (la somma dei volumi).
- "... $1{,}1 \cdot 10^{5}\,\text{Pa}$ ... da $1{,}3 \cdot 10^{-3}\,\text{m}^3$ a $6{,}3 \cdot 10^{-3}\,\text{m}^3$": $5{,}5 \cdot 10^{2}\,\text{J}$.

## Livello 2: litri, kilopascal e atmosfere

Espansione, volumi in litri ($V_i$ da $1{,}2$ a $6{,}0\,\text{L}$, $\Delta V$ da $1{,}0$ a $5{,}0\,\text{L}$). Metà dei casi con la pressione in
atmosfere ($1{,}1$-$4{,}9\,\text{atm}$, con $1\,\text{atm} = 1{,}01 \cdot 10^{5}\,\text{Pa}$ scritto nel testo), metà in kilopascal (un intero di
tre cifre che finisce per $5$, da $105$ a $495$).

- "Un gas si espande alla pressione costante di $3{,}8\,\text{atm}$: il suo volume passa da $1{,}5\,\text{L}$ a $6{,}5\,\text{L}$. Quanto lavoro
  compie? Usa $1\,\text{atm} = 1{,}01 \cdot 10^{5}\,\text{Pa}$." Risposta $1{,}9 \cdot 10^{3}\,\text{J}$ ($1919\,\text{J}$); distrattori $19\,\text{J}$
  (niente convertito), $1{,}9 \cdot 10^{6}\,\text{J}$ (i litri non convertiti), $2{,}5 \cdot 10^{3}\,\text{J}$ (il volume finale).
- Con i kilopascal i distrattori sono i litri non convertiti ($\times 1000$), i kilopascal non convertiti ($: 1000$), il
  volume finale.

## Livello 3: una compressione, il segno del lavoro

Compressione a pressione costante (pascal, litri: $V_f$ da $1{,}0$ a $5{,}0\,\text{L}$, $V_i$ più grande di $1{,}0$-$5{,}0\,\text{L}$). Metà dei casi
chiede il lavoro del gas (negativo), metà il lavoro dell'ambiente sul gas (l'opposto, positivo).

- "Un gas viene compresso alla pressione costante di $1{,}4 \cdot 10^{5}\,\text{Pa}$: il suo volume passa da $8{,}8\,\text{L}$ a $5{,}0\,\text{L}$.
  Quanto lavoro compie l'ambiente sul gas?" Risposta $5{,}3 \cdot 10^{2}\,\text{J}$; distrattori $-5{,}3 \cdot 10^{2}\,\text{J}$ (il segno),
  $7{,}0 \cdot 10^{2}\,\text{J}$ e $1{,}2 \cdot 10^{3}\,\text{J}$ (il volume finale o quello iniziale al posto di $\Delta V$).
- Con "Quanto lavoro compie il gas?" la risposta è $-5{,}3 \cdot 10^{2}\,\text{J}$.

## Livello 4: il lavoro dal grafico, un segmento

Scena `piano-pv`: volume in litri (quadretti da $1\,\text{L}$, fino a $8$), pressione in kilopascal (quadretti da $50\,\text{kPa}$, fino a
$400$). Due stati sui nodi della griglia: $B$ almeno $2\,\text{L}$ a destra di $A$ e a un'altra pressione. Il gas va da $A$ a $B$
lungo il segmento: $W = \frac{p_A + p_B}{2}\,(V_B - V_A)$, in joule perché $1\,\text{kPa} \cdot 1\,\text{L} = 1\,\text{J}$.

- $A$ ($1\,\text{L}$, $150\,\text{kPa}$), $B$ ($6\,\text{L}$, $300\,\text{kPa}$): $1125\,\text{J}$, risposta $1{,}1 \cdot 10^{3}\,\text{J}$; distrattori
  $7{,}5 \cdot 10^{2}\,\text{J}$ (il rettangolo con $p_A$), $1{,}5 \cdot 10^{3}\,\text{J}$ (con $p_B$), $3{,}8 \cdot 10^{2}\,\text{J}$ (solo il triangolo).
- $A$ ($1\,\text{L}$, $400\,\text{kPa}$), $B$ ($3\,\text{L}$, $300\,\text{kPa}$): $7{,}0 \cdot 10^{2}\,\text{J}$.

La scena della soluzione colora il trapezio.

## Livello 5: il lavoro dal grafico, due tratti

Stessi assi e stessi stati $A$ e $B$ del livello 4, ma il gas passa per $C$: metà dei casi prima a pressione costante e poi a
volume costante ($C$ sopra o sotto $B$), metà al contrario ($C$ sopra o sotto $A$). Il lavoro è quello del tratto orizzontale.

- $A$ ($1\,\text{L}$, $300\,\text{kPa}$), $C$ ($7\,\text{L}$, $300\,\text{kPa}$), $B$ ($7\,\text{L}$, $250\,\text{kPa}$): $1{,}8 \cdot 10^{3}\,\text{J}$; distrattori
  $1{,}5 \cdot 10^{3}\,\text{J}$ (l'altro cammino), $1{,}7 \cdot 10^{3}\,\text{J}$ (il segmento diretto), $3{,}3 \cdot 10^{3}\,\text{J}$ (i due rettangoli
  sommati).

## Livello 6: il lavoro di un ciclo

Stessi assi. Un ciclo rettangolare (quattro stati) o triangolare (tre stati, con l'angolo retto in alto a destra), con i
lati lungo gli assi, largo almeno $2\,\text{L}$ e alto almeno $100\,\text{kPa}$; $A$ è lo stato in alto a sinistra e gli altri seguono
nel verso di percorrenza, orario o antiorario. Il lavoro è l'area racchiusa, positiva se il verso è orario. I quattro casi
(rettangolo o triangolo, orario o antiorario) hanno un quarto degli esercizi ciascuno.

- Triangolo $A$ ($2\,\text{L}$, $350\,\text{kPa}$), $B$ ($4\,\text{L}$, $350\,\text{kPa}$), $C$ ($4\,\text{L}$, $150\,\text{kPa}$), orario: $2{,}0 \cdot 10^{2}\,\text{J}$;
  distrattori $-2{,}0 \cdot 10^{2}\,\text{J}$ (il verso), $4{,}0 \cdot 10^{2}\,\text{J}$ (il rettangolo), $7{,}0 \cdot 10^{2}\,\text{J}$ (l'area sotto il
  lato alto).
- Lo stesso triangolo percorso $A \to C \to B$: $-2{,}0 \cdot 10^{2}\,\text{J}$.

## Esercizi da evitare

- Risposte a pari merito tra due arrotondamenti a due cifre ($1250\,\text{J}$), o sotto $100\,\text{J}$ con uno zero finale.
- Segmenti orizzontali al livello 4 (sarebbe il livello 1) e stati fuori dai nodi della griglia.
- Cicli con un lato curvo: sono il livello 6 di `fis-trasformazioni-termodinamiche`.

## Verifica

`fis_lavoro_termodinamico.py` rilegge il testo (livelli 1-3) o i dati della scena (livelli 4-6), controlla intervalli,
formato e unità, ricalcola con i razionali (per il ciclo con la formula dell'area di Gauss, positiva in senso orario) e
confronta l'opzione giusta e il formato delle altre. Controlla che la scena del problema non colori l'area e che quella
della soluzione sia la stessa figura con l'area.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, $1000$ esercizi per livello ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 90 px su 252). Errori piantati (seed 1, un campione ogni
25): bocciati tutti per indice dell'opzione giusta, numero del testo, testo dell'opzione giusta, opzione doppia, parole
vietate; un dato della scena cambiato è bocciato 104 volte su 120, e i 16 casi passati sono al livello 5 con l'isocora per
prima, dove la pressione di $A$ non entra nel lavoro e l'esercizio cambiato resta giusto. Esercizi diversi su 1000 (seed
da 1): 994, 997, 998, 467, 676, 562. Il controllo ha trovato un errore del generatore (volumi scritti
$10{,}4 \cdot 10^{-3}$ al livello 1), corretto.

## Domande per la revisione

- Al livello 3 metà degli esercizi chiede il lavoro dell'ambiente sul gas: va bene, o confonde chi sta imparando il segno?
- Ai livelli 4-6 i dati si leggono solo dal grafico (kilopascal e litri): serve anche una riga di testo con le coordinate?
