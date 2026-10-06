# L'entropia

Generatore: `fis-entropia` (`src/lib/exercises/v2/generators/fis-entropia.ts`, con
`src/lib/exercises/v2/fis-frigo-entropia.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_entropia.py` (con
`_fis_frigo_entropia.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/118-fis-entropia.md`. Percorso nel database:
`high_school/physics/fis-secondo-principio/fis-entropia`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. La variazione di entropia è sempre scritta
con il segno, anche il più ($+3{,}34\,\text{J/K}$), perché il segno è metà della risposta.

## Nomi dei livelli

1. Una sorgente che scambia calore
2. L'entropia in un passaggio di stato
3. Un gas a temperatura costante
4. Un corpo che si scalda o si raffredda
5. L'entropia dell'universo
6. Una macchina reale

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni in $\text{J/K}$ con il segno. Ai livelli 1-4 i dati hanno tre cifre significative e
il risultato tre, in notazione scientifica da $1000$ in su ($-2{,}43 \cdot 10^3\,\text{J/K}$); i risultati interi che
finirebbero con uno zero ($+120\,\text{J/K}$) si scartano. Ai livelli 5 e 6 il risultato è una differenza tra due
termini compresi tra $1$ e $10\,\text{J/K}$, e si arrotonda a due decimali ($+0{,}92\,\text{J/K}$), calcolando la
differenza prima di arrotondare; non è mai sotto $0{,}10\,\text{J/K}$. Nessun risultato a meno di $10^{-6}$ da un
confine di arrotondamento. Costanti scritte nel testo: $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$,
$c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$, $L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$, $L_v = 2{,}26 \cdot 10^6\,\text{J/kg}$;
$0\,^\circ\text{C} = 273\,\text{K}$.

Scene: al livello 5 `sorgenti-calore` (nuova, `scenes/SorgentiFlussi.tsx`), due sorgenti affiancate collegate da una
sbarra con le temperature e il calore; al livello 6 `macchina-termica` del gruppo 43, con le temperature delle
sorgenti, $Q_c$ e $W$ sulle frecce e $Q_f$ senza valore. Nessuna scena ai livelli 1-4.

## Livello 1: una sorgente che scambia calore

Una sorgente a $T$ ($251$-$599\,\text{K}$, intero che non finisce con zero) assorbe (metà) o cede (metà) $Q$
($205$-$995\,\text{J}$, idem): $\Delta S = \pm Q/T$. Distrattori: il segno sbagliato, il rapporto rovesciato, $273$
aggiunto a una temperatura già in kelvin.

- "Una sorgente a $264\,\text{K}$ cede $565\,\text{J}$ di calore." Risposta $-2{,}14\,\text{J/K}$; distrattori
  $+2{,}14$, $-0{,}467$, $-1{,}05$.
- "Una sorgente a $367\,\text{K}$ cede $269\,\text{J}$ di calore." Risposta $-0{,}733\,\text{J/K}$.

## Livello 2: l'entropia in un passaggio di stato

Una massa d'acqua ($0{,}105$-$0{,}995\,\text{kg}$, tre cifre, l'ultima non zero) in uno dei quattro passaggi, un quarto
ciascuno: fusione e solidificazione a $0\,^\circ\text{C}$ con $L_f$, vaporizzazione e condensazione a
$100\,^\circ\text{C}$ con $L_v$. $\Delta S = \pm L\,m/T$ con $T = 273\,\text{K}$ o $373\,\text{K}$: positiva se la
sostanza assorbe calore (fusione, vaporizzazione), negativa se lo cede. Distrattori: il segno sbagliato, la massa
dimenticata, la temperatura sbagliata ($373\,\text{K}$ per la fusione, $100$ in gradi Celsius per l'ebollizione).

- "$0{,}139\,\text{kg}$ di acqua a $100\,^\circ\text{C}$ diventano vapore alla stessa temperatura." Risposta
  $+842\,\text{J/K}$; distrattori $-842$, $+6{,}06 \cdot 10^3$, $+3{,}14 \cdot 10^3$.
- "$0{,}401\,\text{kg}$ di vapore a $100\,^\circ\text{C}$ condensano in acqua alla stessa temperatura." Risposta
  $-2{,}43 \cdot 10^3\,\text{J/K}$.

## Livello 3: un gas a temperatura costante

$n$ moli ($1{,}05$-$4{,}95$) di gas perfetto si espandono (metà) o vengono compresse (metà) a temperatura costante
tra due volumi in litri ($10{,}5$-$99{,}5$, tre cifre), con il rapporto tra il maggiore e il minore tra $1{,}2$ e $6$:
$\Delta S = n\,R \ln(V_B/V_A)$. Distrattori: i volumi scambiati (il segno), le moli dimenticate, il logaritmo
decimale.

- "$2{,}83\,\text{mol}$ di gas perfetto vengono compresse a temperatura costante da $78{,}4\,\text{L}$ a
  $17{,}1\,\text{L}$." Risposta $-35{,}8\,\text{J/K}$; distrattori $+35{,}8$, $-12{,}7$, $-15{,}6$.
- "$2{,}35\,\text{mol}$ ... da $30{,}2\,\text{L}$ a $17{,}7\,\text{L}$." Risposta $-10{,}4\,\text{J/K}$.

## Livello 4: un corpo che si scalda o si raffredda

Una massa d'acqua come al livello 2 viene scaldata (metà) o si raffredda (metà) tra due temperature in gradi Celsius
($5$-$95$, almeno $15$ gradi di differenza): $\Delta S = m\,c \ln(T_B/T_A)$ con le temperature in kelvin. Distrattori:
i gradi Celsius nel logaritmo, il segno, il logaritmo decimale.

- "$0{,}139\,\text{kg}$ di acqua si raffreddano da $46\,^\circ\text{C}$ a $11\,^\circ\text{C}$." Risposta
  $-67{,}6\,\text{J/K}$; distrattori $+67{,}6$, $-832$, $-29{,}4$.
- "$0{,}558\,\text{kg}$ di acqua vengono scaldati da $12\,^\circ\text{C}$ a $93\,^\circ\text{C}$." Risposta
  $+584\,\text{J/K}$.

## Livello 5: l'entropia dell'universo

$Q$ ($605$-$2495\,\text{J}$) passa da una sorgente a $T_c$ ($351$-$599\,\text{K}$) a una a $T_f$ (da $251\,\text{K}$ ad
almeno $30\,\text{K}$ sotto $T_c$), tutti interi che non finiscono con zero, con $Q/T_c \ge 1\,\text{J/K}$ e
$Q/T_f < 10\,\text{J/K}$: $\Delta S_{univ} = Q/T_f - Q/T_c$ (l'esempio 4 della lezione). Distrattori: i segni
scambiati, $Q/(T_c - T_f)$, la somma dei due termini, la sola sorgente fredda.

- "$2047\,\text{J}$ di calore passano da una sorgente a $464\,\text{K}$ a una sorgente a $264\,\text{K}$." Risposta
  $+3{,}34\,\text{J/K}$; distrattori $-3{,}34$, $+12{,}17$, $+7{,}75$.
- "$759\,\text{J}$ ... $433\,\text{K}$ ... $284\,\text{K}$." Risposta $+0{,}92\,\text{J/K}$.

## Livello 6: una macchina reale

Una macchina termica tra $T_c$ ($401$-$699\,\text{K}$) e $T_f$ ($271$-$349\,\text{K}$) assorbe $Q_c$
($1005$-$4995\,\text{J}$) e compie un lavoro $W$ compreso tra il $40\,\%$ e l'$85\,\%$ di quello della macchina
reversibile, interi che non finiscono con zero: $Q_f = Q_c - W$ e $\Delta S_{univ} = Q_f/T_f - Q_c/T_c$, sempre
positiva (l'esempio 5 della lezione). Distrattori: il lavoro dimenticato ($Q_c$ al posto di $Q_f$), i segni scambiati,
le temperature scambiate, $W/T_f$.

- "Una macchina termica lavora tra una sorgente a $616\,\text{K}$ e una a $274\,\text{K}$. In ogni ciclo assorbe
  $2825\,\text{J}$ dalla sorgente calda e compie un lavoro di $674\,\text{J}$." Risposta $+3{,}26\,\text{J/K}$;
  distrattori $-3{,}26$, $+5{,}72$, $-6{,}82$.
- "... $677\,\text{K}$ ... $297\,\text{K}$ ... $1889\,\text{J}$ ... $456\,\text{J}$." Risposta $+2{,}03\,\text{J/K}$.

## Esercizi da evitare

- Variazioni di entropia dell'universo sotto $0{,}10\,\text{J/K}$, che con due decimali avrebbero una cifra sola.
- Macchine con un lavoro maggiore di quello reversibile: darebbero un'entropia dell'universo negativa.
- Temperature in gradi Celsius ai livelli 1, 5 e 6: lì la difficoltà è il segno, non la conversione.

## Verifica

`fis_entropia.py` rilegge il testo, controlla gli intervalli, ricalcola con SymPy (logaritmi simbolici) e controlla
opzioni, segno e dati delle scene.

## Domande per la revisione

- Il più davanti alle variazioni positive ($+584\,\text{J/K}$): va bene sempre, o solo dove c'è un distrattore con il
  segno opposto?
- Al livello 4 la formula $m\,c \ln(T_B/T_A)$ è enunciata nella lezione senza dimostrazione: tenerla come livello?
