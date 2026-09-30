# La teoria cinetico-molecolare

Generatore: `chim-teoria-cinetica` (`src/lib/exercises/v2/generators/chim-teoria-cinetica.ts`, con
`src/lib/exercises/v2/chim-gas.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_teoria_cinetica.py` (con
`_chim_gas.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/29-chim-teoria-cinetica.md`. Percorso nel database:
`high_school/chemistry/chim-gas/chim-teoria-cinetica`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Celsius e kelvin
2. Le ipotesi del modello
3. Temperatura ed energia
4. Particelle leggere e pesanti
5. Quale campione

## Tipi di risposta

Scelta multipla, quattro opzioni. Temperature intere con l'unità ($341\,\text{K}$, $-69\,^\circ\text{C}$), $T = t + 273$ come
la lezione. Rapporti senza unità: tre cifre significative al livello 3, due al livello 4. Affermazioni e campioni come
testo (al massimo 24 caratteri per riga, per il telefono). Masse relative dalla tavola della lezione 01 ($\mathrm{H}$
$1{,}01$, $\mathrm{C}$ $12{,}01$, $\mathrm{N}$ $14{,}01$, $\mathrm{O}$ $16{,}00$, $\mathrm{S}$ $32{,}07$, $\mathrm{Cl}$
$35{,}45$), più $\mathrm{He}$ $4{,}00$ e $\mathrm{Ar}$ $39{,}95$, scritte sempre nel testo.

## Livello 1: Celsius e kelvin

Metà da gradi Celsius ($-200$ a $400$, lontano da $0$ almeno $5$ gradi) a kelvin, metà da kelvin ($20$ a $800$) a gradi
Celsius. Distrattori: $273$ tolto invece che sommato, il segno perso, una costante sbagliata ($373$).

- "Quanto vale una temperatura di $68\,^\circ\text{C}$ nella scala Kelvin?" Risposta $341\,\text{K}$; distrattori
  $-205\,\text{K}$, $205\,\text{K}$, $441\,\text{K}$.
- "Quanto vale una temperatura di $204\,\text{K}$ in gradi Celsius?" Risposta $-69\,^\circ\text{C}$; distrattori
  $477\,^\circ\text{C}$, $69\,^\circ\text{C}$, $-169\,^\circ\text{C}$.

## Livello 2: le ipotesi del modello

Metà "Quale affermazione è vera per il modello del gas ideale?", metà "Quale è falsa?". Sette affermazioni vere (le
cinque ipotesi della lezione e due conseguenze) e otto false (errori degli studenti: particelle ferme, aria tra le
particelle, attrazioni forti, stessa velocità per tutte, energia proporzionale ai gradi Celsius, urti che fermano le
particelle, particelle che riempiono il recipiente, particelle che si dilatano scaldandosi).

- Vera: "Negli urti l'energia cinetica totale delle particelle non cambia."; le altre: "Le particelle di un gas sono
  ferme.", "Tra una particella e l'altra c'è aria.", "Negli urti le particelle perdono energia e si fermano."
- Falsa: "Tra una particella e l'altra c'è aria."; le altre sono tre ipotesi del modello.

## Livello 3: temperatura ed energia

Un gas passa da $t_1$ a $t_2$ gradi Celsius; il rapporto $T_2/T_1$ è uno di $0{,}5$, $0{,}75$, $1{,}25$, $1{,}5$, $2$,
$2{,}5$, $3$, $4$, con $T_1$ multiplo di $5$ tra $100$ e $450\,\text{K}$ e $T_2$ tra $100$ e $1500\,\text{K}$; le due
temperature ad almeno $5$ gradi da $0\,^\circ\text{C}$. Distrattori: il rapporto dei gradi Celsius (se positivo), il
rapporto rovesciato, la radice (è il rapporto delle velocità).

- "Un gas viene portato da $-23\,^\circ\text{C}$ a $102\,^\circ\text{C}$. Per quale numero viene moltiplicata l'energia
  cinetica media delle sue particelle?" Risposta $1{,}50$.
- "... da $47\,^\circ\text{C}$ a $-33\,^\circ\text{C}$ ..." Risposta $0{,}750$.

## Livello 4: particelle leggere e pesanti

Due gas diversi tra dieci ($\mathrm{H_2}$, $\mathrm{He}$, $\mathrm{CH_4}$, $\mathrm{NH_3}$, $\mathrm{N_2}$, $\mathrm{O_2}$,
$\mathrm{Ar}$, $\mathrm{CO_2}$, $\mathrm{SO_2}$, $\mathrm{Cl_2}$) alla stessa temperatura; si chiede quante volte le
particelle del più leggero sono più veloci: $\sqrt{M_2/M_1}$, almeno $1{,}15$. Distrattori: il rapporto delle masse
senza radice, la radice rovesciata.

- $\mathrm{H_2}$ e $\mathrm{O_2}$: risposta $4{,}0$; distrattori $16$, $0{,}25$.
- $\mathrm{H_2}$ e $\mathrm{NH_3}$: risposta $2{,}9$; distrattori $8{,}4$, $0{,}34$.

## Livello 5: quale campione

Quattro gas diversi a quattro temperature diverse ($150$-$900\,\text{K}$, multipli di $50$). Metà: in quale campione le
particelle hanno l'energia cinetica media più grande (la temperatura più alta, qualunque sia il gas); metà: la velocità
media più grande (il $\sqrt{T/M}$ più grande). Il vincitore stacca il secondo di almeno il $5\%$; la trappola è sempre
presente: per l'energia il gas più leggero non vince, per la velocità il campione più caldo non vince.

- "$\mathrm{CH_4}$ a $800\,\text{K}$, $\mathrm{NH_3}$ a $200\,\text{K}$, $\mathrm{H_2}$ a $650\,\text{K}$, $\mathrm{Ar}$ a
  $850\,\text{K}$: velocità media più grande?" Risposta $\mathrm{H_2}$ a $650\,\text{K}$.
- "... energia cinetica media più grande?" Risposta il campione più caldo.

## Esercizi da evitare

- Temperature vicine a $0\,^\circ\text{C}$ (il rapporto dei gradi Celsius esplode) o a $0\,\text{K}$.
- Rapporti di velocità quasi uguali a $1$; campioni con due vincitori quasi pari.

## Verifica

`chim_teoria_cinetica.py` rilegge il testo, ricalcola con i razionali di SymPy (le masse dalla tavola della lezione 01,
controllando quelle scritte nel testo), confronta l'opzione giusta, controlla che le affermazioni del livello 2 siano
nelle liste della specifica e che le opzioni del livello 5 siano i quattro campioni del testo.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, $5.000$ esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 193 px su 252).

### Errori piantati

Su 50 esercizi (seed da 300): indice dell'opzione giusta, opzione doppia, parole vietate bocciati 50 su 50; cifra
dell'opzione giusta cambiata bocciata 40 su 40 (i 10 del livello 2 non hanno cifre); un dato del testo aumentato di uno
bocciato 39 su 39 (gli 11 che passano sono testi senza numeri, livello 2).

### Esercizi diversi su 1.000

Seed da 1: livello 1 714, livello 3 306, livello 4 40 (le coppie di gas), livello 5 1000; il livello 2 ha due soli
testi, e varia nelle opzioni ($7 \cdot \binom{8}{3} + 8 \cdot \binom{7}{3}$ combinazioni).

## Domande per la revisione

- Il livello 4 (radice del rapporto delle masse) è alla portata del secondo anno, o è da togliere?
- Le affermazioni del livello 2 sono abbastanza nette? "Le particelle non hanno tutte la stessa velocità" potrebbe
  sembrare in contrasto con il modello più semplice di alcuni libri.
