# Frigoriferi e pompe di calore

Generatore: `fis-frigoriferi` (`src/lib/exercises/v2/generators/fis-frigoriferi.ts`, con
`src/lib/exercises/v2/fis-frigo-entropia.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_frigoriferi.py`
(con `_fis_frigo_entropia.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/117-fis-frigoriferi.md`. Percorso nel
database: `high_school/physics/fis-secondo-principio/fis-frigoriferi`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. Simboli della lezione: $Q_f$ il calore tolto
alla sorgente fredda, $Q_c$ quello ceduto alla calda, $W$ il lavoro, tutti in valore assoluto, con $Q_c = Q_f + W$;
$\text{COP}_f = Q_f / W$ per il frigorifero, $\text{COP}_p = Q_c / W$ per la pompa di calore.

## Nomi dei livelli

1. Il coefficiente di un frigorifero
2. Dal calore ceduto
3. La pompa di calore
4. Il coefficiente massimo
5. Il lavoro per raffreddare
6. Fare il ghiaccio

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni. Il coefficiente di prestazione è un numero puro, senza unità; il lavoro è in joule,
in notazione scientifica. Ai livelli 1-3 calori e lavori sono interi di tre cifre che non finiscono con zero, e il
coefficiente ha tre cifre significative; al livello 4 le temperature sono gradi Celsius interi e il coefficiente ha
due cifre (la differenza di temperatura ne ha due); ai livelli 3 (lavoro), 5 e 6 i dati hanno due cifre e il lavoro
due. Nessun risultato a meno di $10^{-6}$ da un confine di arrotondamento. Acqua: $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$,
$L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$, scritti nel testo; $0\,^\circ\text{C} = 273\,\text{K}$.

La scena è `macchina-termica` del gruppo 43 (`scenes/MacchinaTermica.tsx`), con un solo dispositivo percorso al
contrario: il calore $Q_f$ entra dalla sorgente fredda, il lavoro $W$ entra, il calore $Q_c$ esce verso la sorgente
calda. Nel cerchio c'è scritto "frigorifero", "pompa" o, per congelatore e condizionatore, "macchina" (i nomi lunghi non ci stanno). Sulle frecce ci sono i dati (`Qf = 598 J`); la grandezza che non è data porta solo la lettera. Al livello 4 non
ci sono numeri sulle frecce e le sorgenti portano le due temperature in gradi Celsius. Nessuna scena al livello 3
quando si chiede il lavoro, e ai livelli 5 e 6.

## Livello 1: il coefficiente di un frigorifero

Un frigorifero, un congelatore o un condizionatore (un terzo ciascuno) toglie $Q_f$ ($151$-$999\,\text{J}$) con il
lavoro $W$ ($101$-$399\,\text{J}$), con $Q_f / W$ tra $1{,}5$ e $6$. Si chiede $\text{COP}_f = Q_f / W$.

- "In un ciclo un congelatore toglie $598\,\text{J}$ di calore al suo interno, e il suo motore compie un lavoro di
  $101\,\text{J}$." Risposta $5{,}92$; distrattori $0{,}169$ (rapporto rovesciato), $6{,}92$ (il coefficiente della pompa
  di calore), $0{,}856$ ($Q_f / Q_c$).
- "In un ciclo un condizionatore toglie $393\,\text{J}$ di calore a una stanza, e il suo motore compie un lavoro di
  $198\,\text{J}$." Risposta $1{,}98$.

## Livello 2: dal calore ceduto

Gli stessi numeri, con $Q_c = Q_f + W$ al più $999\,\text{J}$ e non multiplo di dieci. Metà ("calori"): dati $Q_f$ e
$Q_c$, il lavoro si trova per differenza; distrattori $Q_f / Q_c$, $Q_c / W$, $W / Q_f$. Metà ("lavoro"): dati $W$ e
$Q_c$, si trova $Q_f = Q_c - W$; distrattori $Q_c / W$ (senza la sottrazione), $W / Q_f$, $Q_f / Q_c$.

- "In un ciclo il motore di un frigorifero compie un lavoro di $101\,\text{J}$, e il frigorifero cede $699\,\text{J}$ di
  calore alla cucina." Risposta $5{,}92$; distrattori $6{,}92$, $0{,}169$, $0{,}856$.
- "In un ciclo un frigorifero toglie $393\,\text{J}$ di calore al suo interno e ne cede $591\,\text{J}$ alla cucina."
  Risposta $1{,}98$.

## Livello 3: la pompa di calore

Metà ("coefficiente"): una pompa di calore prende $Q_f$ dall'aria esterna con il lavoro $W$ (numeri del livello 1);
si chiede $\text{COP}_p = (Q_f + W) / W$. Distrattori: $Q_f / W$ (il coefficiente del frigorifero), $W / Q_c$,
$Q_c / Q_f$. Metà ("lavoro"): dato $\text{COP}_p$ ($2{,}1$-$5{,}9$, senza zero finale) e il calore da cedere alla casa
($1{,}1$-$9{,}9 \cdot 10^6$ o $10^7\,\text{J}$), si chiede $W = Q_c / \text{COP}_p$ con due cifre. Distrattori:
$Q_c \cdot \text{COP}_p$, $Q_c / (\text{COP}_p - 1)$, $Q_c - W$ (il calore preso da fuori).

- "In un ciclo una pompa di calore prende $598\,\text{J}$ di calore dall'aria esterna, e il suo compressore compie un
  lavoro di $101\,\text{J}$." Risposta $6{,}92$.
- "Una pompa di calore con coefficiente di prestazione $2{,}1$ deve cedere a una casa $5{,}7 \cdot 10^7\,\text{J}$ di
  calore." Risposta $2{,}7 \cdot 10^7\,\text{J}$; distrattori $1{,}2 \cdot 10^8\,\text{J}$, $5{,}2 \cdot 10^7\,\text{J}$,
  $3{,}0 \cdot 10^7\,\text{J}$.

## Livello 4: il coefficiente massimo

Metà: un frigorifero con l'interno tra $-25$ e $8\,^\circ\text{C}$ in una stanza tra $18$ e $38\,^\circ\text{C}$,
$\text{COP}_{f,max} = T_f / (T_c - T_f)$. Metà: una pompa di calore con la casa tra $18$ e $24\,^\circ\text{C}$ e
l'esterno tra $-15$ e $8\,^\circ\text{C}$, $\text{COP}_{p,max} = T_c / (T_c - T_f)$. Mai $0\,^\circ\text{C}$ per la
sorgente fredda (il distrattore in gradi Celsius sarebbe zero) e differenza di almeno $10$ gradi. Distrattori: le
temperature in gradi Celsius (anche negativo), il coefficiente dell'altra macchina, il rapporto rovesciato, il
rendimento di Carnot.

- "Una pompa di calore tiene una casa a $21\,^\circ\text{C}$ quando fuori ci sono $-15\,^\circ\text{C}$." Risposta
  $8{,}2$ ($294/36$); distrattori $0{,}58$ ($21/36$), $7{,}2$, $0{,}12$.
- "Un frigorifero tiene l'interno a $-18\,^\circ\text{C}$ in una stanza a $25\,^\circ\text{C}$." Risposta $5{,}9$;
  distrattori $-0{,}42$, $6{,}9$, $0{,}17$.

## Livello 5: il lavoro per raffreddare

Un frigorifero con $\text{COP}_f$ tra $2{,}1$ e $4{,}9$ raffredda una massa d'acqua ($0{,}11$-$0{,}99\,\text{kg}$ o
$1{,}1$-$4{,}9\,\text{kg}$) da $18$-$35\,^\circ\text{C}$ a $2$-$8\,^\circ\text{C}$: $Q_f = c\,m\,\Delta t$,
$W = Q_f / \text{COP}_f$. Distrattori: il coefficiente moltiplicato, il coefficiente dimenticato ($Q_f$), la
temperatura iniziale al posto della differenza, la divisione per $\text{COP}_f + 1$.

- "Un frigorifero con coefficiente di prestazione $3{,}6$ raffredda $1{,}1\,\text{kg}$ di acqua da $35\,^\circ\text{C}$ a
  $8\,^\circ\text{C}$." Risposta $3{,}5 \cdot 10^4\,\text{J}$; distrattori $4{,}5 \cdot 10^5\,\text{J}$,
  $1{,}2 \cdot 10^5\,\text{J}$, $4{,}5 \cdot 10^4\,\text{J}$.
- "... $2{,}9$ ... $2{,}3\,\text{kg}$ ... da $27\,^\circ\text{C}$ a $8\,^\circ\text{C}$." Risposta $6{,}3 \cdot 10^4\,\text{J}$.

## Livello 6: fare il ghiaccio

Un congelatore trasforma la stessa massa d'acqua, a $10$-$30\,^\circ\text{C}$, in ghiaccio a $0\,^\circ\text{C}$:
$Q_f = c\,m\,\Delta t + L_f\,m$ (l'esempio 4 della lezione, senza il tempo). Distrattori: solo la solidificazione,
solo il raffreddamento, il coefficiente dimenticato, il coefficiente moltiplicato.

- "Un congelatore con coefficiente di prestazione $3{,}6$ trasforma $1{,}1\,\text{kg}$ di acqua a $30\,^\circ\text{C}$ in
  ghiaccio a $0\,^\circ\text{C}$." Risposta $1{,}4 \cdot 10^5\,\text{J}$; distrattori $1{,}0 \cdot 10^5\,\text{J}$,
  $3{,}8 \cdot 10^4\,\text{J}$, $5{,}1 \cdot 10^5\,\text{J}$.
- "... $2{,}9$ ... $2{,}3\,\text{kg}$ ... a $21\,^\circ\text{C}$." Risposta $3{,}3 \cdot 10^5\,\text{J}$.

## Esercizi da evitare

- Calori e lavori che finiscono con uno zero ($450\,\text{J}$): tre cifre senza zero finale.
- Rapporti $Q_f / W$ sotto $1{,}5$ o sopra $6$, lontani da quelli di una macchina vera.
- Al livello 4 una sorgente fredda a $0\,^\circ\text{C}$ e differenze sotto i $10$ gradi, che darebbero coefficienti
  con una sola cifra significativa.

## Verifica

`fis_frigoriferi.py` rilegge il testo, controlla gli intervalli dei dati, ricalcola con SymPy e controlla le opzioni e
i testi sulle frecce della scena.

## Domande per la revisione

- Il coefficiente con tre cifre ai livelli 1-3 e con due al livello 4: va bene, o sempre due?
- Serve un livello con la potenza del motore e il tempo (seconda parte dell'esempio 4 della lezione)? Oggi non c'è.
