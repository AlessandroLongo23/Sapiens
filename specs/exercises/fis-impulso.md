# L'impulso e il teorema dell'impulso

Generatore: `fis-impulso` (`src/lib/exercises/v2/generators/fis-impulso.ts`, con `fis-quantita-moto.ts`, `fis-energia.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_impulso.py` (con `_fis_quantita_moto.py`, `_fis_energia.py` e `_vettori.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/81-fis-impulso.md`. Percorso nel database: `high_school/physics/fis-quantita-moto/fis-impulso`.

Sette livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'impulso di una forza costante
2. La velocità dopo una spinta
3. La forza media che ferma un corpo
4. La forza media in un rimbalzo
5. L'impulso dal grafico
6. La velocità dal grafico
7. La forza del suolo in un atterraggio

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($\text{N} \cdot \text{s}$, $\text{m/s}$, $\text{N}$, $\text{kN}$). Dati con due
cifre significative senza zeri finali ambigui; $g = 9{,}8\,\text{m/s}^2$ al livello 7; risposte a due cifre, nessun
distrattore a meno dell'8%. Al livello 5 l'area letta sul grafico è esatta.

## Livello 1: l'impulso di una forza costante

Forza da $1{,}1$ a $99\,\text{N}$, tempo da $0{,}11$ a $9{,}9\,\text{s}$; $I = F\,\Delta t$ tra $1$ e $99\,\text{N} \cdot \text{s}$.
Distrattori: $F/\Delta t$, $\Delta t/F$.

- "Una forza costante di $14\,\text{N}$ agisce su un carrello per $0{,}17\,\text{s}$. Quanto vale il modulo
  dell'impulso della forza?" Risposta $2{,}4\,\text{N} \cdot \text{s}$; distrattori $82\,\text{N} \cdot \text{s}$ ($F/\Delta t$),
  $0{,}012\,\text{N} \cdot \text{s}$ ($\Delta t/F$), $3{,}1\,\text{N} \cdot \text{s}$ (di scorta).

## Livello 2: la velocità dopo una spinta

Carrello fermo da $1{,}1$ a $25\,\text{kg}$; $v_f = F\,\Delta t / m$ tra $0{,}5$ e $40\,\text{m/s}$. Distrattori: l'impulso
letto come velocità, l'accelerazione $F/m$, l'impulso per la massa.

## Livello 3: la forza media che ferma un corpo

Palla, pallone o pallina da $0{,}11$ a $0{,}99\,\text{kg}$, velocità da $2{,}1$ a $25\,\text{m/s}$, arresto in $11$-$99\,\text{ms}$;
$F_m = m v / \Delta t$ tra $5$ e $99\,\text{N}$. Distrattori: i millisecondi non convertiti, la quantità di moto da sola,
moltiplicato per il tempo.

## Livello 4: la forza media in un rimbalzo

Come il livello 3, con la palla che rimbalza a una velocità minore di almeno il 15%:
$F_m = m (v_1 + v_2)/\Delta t$. Distrattori: $m (v_1 - v_2)/\Delta t$ (l'avviso della lezione), solo la velocità di
arrivo, i millisecondi non convertiti.

## Livello 5: l'impulso dal grafico

Scena `grafico-spezzata`: tempo in secondi (un quadretto $0{,}1\,\text{s}$), forza in newton (un quadretto $5$ o
$10\,\text{N}$); la forza sale da zero, può restare costante e torna a zero: metà triangoli, metà trapezi. L'area è
esatta, almeno $1{,}5\,\text{N} \cdot \text{s}$ e non multipla di 10. Distrattori: il rettangolo intero $F_{max}\,\Delta t$
(l'avviso della lezione), la formula del triangolo su un trapezio. La scena della soluzione colora l'area.

## Livello 6: la velocità dal grafico

Lo stesso grafico per un carrello fermo da $1{,}1$ a $9{,}9\,\text{kg}$: $v_f = I/m$, almeno $0{,}5\,\text{m/s}$. Distrattori:
il rettangolo intero diviso per la massa, l'impulso letto come velocità, la forza massima diviso la massa.

## Livello 7: la forza del suolo in un atterraggio

Massa da $41$ a $95\,\text{kg}$, velocità all'arrivo da $2{,}1$ a $6{,}9\,\text{m/s}$, arresto in $0{,}11$-$0{,}9\,\text{s}$;
$F_s = m v/\Delta t + m g$ in kilonewton, con $m v / \Delta t$ almeno il 30% del peso. Distrattori: il peso dimenticato
(l'avviso della lezione), il peso sottratto, il peso da solo.

## Esercizi da evitare

- Urti di pochi millisecondi con forze di migliaia di newton, che a due cifre andrebbero in notazione scientifica: i livelli 3 e 4 usano arresti da $11$ a $99\,\text{ms}$.
- Al livello 5, aree multiple di 10.

## Verifica

Il controllo rilegge il testo con un'espressione regolare per livello, controlla cifre significative e intervalli,
ricalcola con $g = 49/5$ e aritmetica esatta (SymPy), confronta la risposta e il formato delle quattro opzioni; dove c'è
una scena controlla che porti i dati del testo e niente di più.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 1.000 esercizi per livello, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 85 px su 252). `eslint` pulito.

### Errori piantati

Su 40 esercizi per livello (seed 777001): indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, parole
vietate e una cifra dei dati cambiata, bocciati tutti. Un numero della scena cambiato: 50 su 80; le 30 che passano toccano il numero di quadretti o delle etichette degli assi, che è solo di disegno.

### Esercizi diversi su 1.000

Seed da 1: livello 1 959, livello 2 998, livello 3 1000, livello 4 1000, livello 5 517, livello 6 988, livello 7 999.

## Domande per la revisione

- Il livello 5 ha circa 520 esercizi diversi su 1.000 (i grafici possibili sulla quadrettatura sono pochi): basta?
- Ai livelli 3 e 4 i tempi sono decine di millisecondi, più lunghi di un urto vero tra corpi duri, per tenere la forza sotto i $100\,\text{N}$: meglio i kilonewton con tempi realistici?
