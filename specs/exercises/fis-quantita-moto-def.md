# La quantità di moto

Generatore: `fis-quantita-moto-def` (`src/lib/exercises/v2/generators/fis-quantita-moto-def.ts`, con `fis-quantita-moto.ts`, `fis-energia.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_quantita_moto_def.py` (con `_fis_quantita_moto.py`, `_fis_energia.py` e `_vettori.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/80-fis-quantita-moto-def.md`. Percorso nel database: `high_school/physics/fis-quantita-moto/fis-quantita-moto-def`.

Sette livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La quantità di moto di un corpo
2. Con le unità da convertire
3. La stessa quantità di moto
4. La variazione in un rimbalzo
5. La quantità di moto totale su una retta
6. La quantità di moto totale nel piano
7. La forza dalla variazione della quantità di moto

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($\text{kg} \cdot \text{m/s}$, $\text{m/s}$, $\text{kN}$). Dati con due cifre
significative senza zeri finali ambigui (masse in grammi e massa dell'automobile intere, con tre o quattro cifre);
risposte a due cifre, nessun distrattore a meno dell'8%. Al livello 5 la risposta ha il segno.

## Livello 1: la quantità di moto di un corpo

Un carrello, un ciclista, una palla da bowling, un cane, uno skateboard, ognuno con masse e velocità plausibili;
$p = m v$ tra $1$ e $99\,\text{kg} \cdot \text{m/s}$. Distrattori: $m/v$, $v/m$, $\tfrac12 m v^2$.

- "Un cane di $34\,\text{kg}$ si muove a $2{,}8\,\text{m/s}$. Quanto vale la sua quantità di moto?" Risposta
  $95\,\text{kg} \cdot \text{m/s}$; distrattori $12\,\text{kg} \cdot \text{m/s}$ ($m/v$), $0{,}082\,\text{kg} \cdot \text{m/s}$ ($v/m$),
  $76\,\text{kg} \cdot \text{m/s}$ (di scorta: $\tfrac12 m v^2$ è fuori intervallo).

## Livello 2: con le unità da convertire

Metà con la massa in grammi (da $11$ a $999$, mai con lo zero finale) e la velocità da $2{,}1$ a $60\,\text{m/s}$;
distrattori con i grammi divisi per 100 o per 10. Metà con la massa da $0{,}11$ a $0{,}99\,\text{kg}$ e la velocità in
km/h, scelta tra $18$, $36$, $54$, $72$, $108$, $126$, $144$, $162$ (tutte un numero intero di m/s); distrattori con i
km/h lasciati così o moltiplicati per $3{,}6$.

## Livello 3: la stessa quantità di moto

Una palla da bowling ($2{,}1$-$9{,}9\,\text{kg}$, $1{,}1$-$9{,}9\,\text{m/s}$) e una palla più leggera ($0{,}11$-$1{,}9\,\text{kg}$):
$v_2 = m_1 v_1 / m_2$. Distrattori: il rapporto delle masse rovesciato, la quantità di moto letta come velocità.

## Livello 4: la variazione in un rimbalzo

Palla da $0{,}11$ a $0{,}99\,\text{kg}$, velocità di arrivo fino a $30\,\text{m/s}$, velocità dopo il rimbalzo minore di
almeno il 15%; $|\Delta p| = m (v_1 + v_2)$. Distrattori: $m (v_1 - v_2)$ (l'avviso della lezione), $m v_1$, $m v_2$.

## Livello 5: la quantità di moto totale su una retta

Due carrelli in versi opposti; $p_{tot,x} = m_1 v_1 - m_2 v_2$ con il segno, di modulo almeno $1$ e almeno il 15% della
somma dei moduli. Distrattori: la somma dei moduli, il segno, $(m_1 + m_2)(v_1 - v_2)$.

## Livello 6: la quantità di moto totale nel piano

Due dischi con velocità perpendicolari (est e nord); $p_{tot} = \sqrt{p_1^2 + p_2^2}$, con la più piccola delle due
almeno il 35% dell'altra. Scena `vettori-piano` con le due velocità in scala e i loro valori (i dati, non le quantità
di moto). Distrattori: $p_1 + p_2$, $|p_1 - p_2|$, $(m_1 + m_2)\sqrt{v_1^2 + v_2^2}$.

## Livello 7: la forza dalla variazione della quantità di moto

Un'automobile da $801$ a $1999\,\text{kg}$ che si ferma da $11$-$40\,\text{m/s}$ in $1{,}5$-$9{,}9\,\text{s}$;
$F = m v / \Delta t$ in kilonewton. Distrattori: moltiplicato per il tempo, la quantità di moto da sola, la massa
divisa per il tempo.

## Esercizi da evitare

- Quantità di moto che a due cifre andrebbero in notazione scientifica (per questo l'automobile compare solo al livello 7, in kilonewton).
- Al livello 5, due quantità di moto quasi uguali: la differenza perderebbe le cifre significative.

## Verifica

Il controllo rilegge il testo con un'espressione regolare per livello, controlla cifre significative e intervalli,
ricalcola con $g = 49/5$ e aritmetica esatta (SymPy), confronta la risposta e il formato delle quattro opzioni; dove c'è
una scena controlla che porti i dati del testo e niente di più.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 1.000 esercizi per livello, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 113 px su 252). `eslint` pulito.

### Errori piantati

Su 40 esercizi per livello (seed 777001): indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, parole
vietate e una cifra dei dati cambiata, bocciati tutti. Un numero della scena cambiato: 33 su 40; le 7 che passano spostano una freccia di meno dell'1%.

### Esercizi diversi su 1.000

Seed da 1: livello 1 943, livello 2 938, livello 3 998, livello 4 999, livello 5 1000, livello 6 1000, livello 7 1000.

## Domande per la revisione

- Manca un livello su $K = p^2/(2m)$, che la lezione ha in una sezione breve: serve?
- Manca un livello sull'angolo di $\vec p_{tot}$ (l'esempio 5 lo calcola con la tangente).
