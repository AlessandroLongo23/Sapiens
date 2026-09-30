# Curve di riscaldamento e di raffreddamento

Generatore: `chim-curve-riscaldamento` (`src/lib/exercises/v2/generators/chim-curve-riscaldamento.ts`, con
`src/lib/exercises/v2/chim-materia2.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_curve_riscaldamento.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/20-chim-curve-riscaldamento.md`. Percorso nel database:
`high_school/chemistry/chim-materia/chim-curve-riscaldamento`.

Sei livelli, ognuno con una difficoltà in più. Sempre scelta multipla a quattro opzioni. I livelli 1-5 hanno la scena
`curva-temperatura-tempo` (`exercises/scenes/CurvaTemperaturaTempo.tsx`): il tempo in minuti in orizzontale, la
temperatura in verticale, una griglia con le tacche numerate, e le temperature delle soste segnate sull'asse quando non
sono sulla griglia (livello 4). La scena disegna la curva, non dice quale sosta è quale.

## Nomi dei livelli

1. Le soste termiche
2. Che cosa c'è nel recipiente
3. Sostanza pura o miscuglio
4. Riconoscere la sostanza
5. La curva di raffreddamento
6. La durata della sosta

## Livello 1: le soste termiche

Curva di riscaldamento di una sostanza pura in cinque tratti, minuti interi, temperature multiple di $20$ (fusione da
$-40$ a $120$, ebollizione da $60$ a $120$ gradi sopra), griglia di $20\,^\circ\text{C}$. Metà si chiede la temperatura di
fusione, metà quella di ebollizione. Distrattori: l'altra sosta, la temperatura iniziale, quella finale.

- Soste a $60$ e $140\,^\circ\text{C}$, "temperatura di fusione": $60\,^\circ\text{C}$; distrattori $140$, $40$, $160$.

## Livello 2: che cosa c'è nel recipiente

La stessa curva e un minuto intero dentro uno dei cinque tratti (lungo almeno due minuti): solo solido, solido e
liquido, solo liquido, liquido e vapore, solo vapore. I primi distrattori sono i tratti vicini.

- "... al minuto 15?" in una sosta alla temperatura più alta: Liquido e vapore.

## Livello 3: sostanza pura o miscuglio

Una curva di tre tratti per la fusione o per l'ebollizione (metà ciascuna): una sosta (sostanza pura) o un intervallo di
$10$ o $20\,^\circ\text{C}$ (miscuglio), che sale al massimo alla metà della velocità dei tratti prima e dopo. Le quattro
opzioni combinano pura o miscuglio con temperatura costante o intervallo.

- Tratto da $120$ a $140\,^\circ\text{C}$ in quattro minuti: "È un miscuglio: fonde in un intervallo di temperature".

## Livello 4: riconoscere la sostanza

Quattro sostanze con le temperature di fusione e di ebollizione nel testo (acqua, etanolo, acetone, naftalene, mercurio,
acido acetico, cicloesano, metanolo, glicole etilenico); la curva ha le soste della prima, e nessun'altra ha tutte e due le
temperature a meno di $5\,^\circ\text{C}$. Griglia di $10$, $20$, $50$ o $100\,^\circ\text{C}$ secondo l'ampiezza.

- Soste a $7$ e $81\,^\circ\text{C}$ tra mercurio, metanolo, cicloesano, acqua: Cicloesano.

## Livello 5: la curva di raffreddamento

Un liquido puro che si raffredda, scende di $4$-$8\,^\circ\text{C}$ sotto la temperatura di solidificazione (sopraffusione),
risale in un minuto, resta nella sosta da $4$ a $8$ minuti e poi scende; temperature multiple di $10$ tranne il punto
più basso. Metà: la temperatura di solidificazione (distrattori il punto più basso, la temperatura iniziale, quella
finale). Metà: dopo quanti minuti è tutto solido (la fine della sosta; distrattori l'inizio della sosta, il punto più
basso, la fine del grafico).

- Sosta a $70\,^\circ\text{C}$ dopo un minimo a $65\,^\circ\text{C}$: $70\,^\circ\text{C}$.

## Livello 6: la durata della sosta

Senza scena. Due cifre significative, mai a meno di $10^{-6}$ da un confine di arrotondamento, mai uno zero ambiguo
($20\,\text{min}$) né tre cifre ($10{,}0\,\text{min}$).

- Metà, la massa: "Con un fornello, $250\,\text{g}$ di ghiaccio a $0\,^\circ\text{C}$ fondono in $8{,}9\,\text{min}$ ...
  quanto dura la fusione di $800\,\text{g}$?" $28\,\text{min}$; distrattori il rapporto rovesciato ($2{,}8$), la stessa
  durata ($8{,}9$), la sola massa in più ($19{,}58$, che darebbe uno zero ambiguo: allora il doppio o la metà della
  risposta). Anche l'ebollizione di una massa d'acqua.
- Metà, il calore latente: dalla fusione all'ebollizione della stessa massa, o al contrario, per l'acqua
  ($334$ e $2260\,\text{kJ/kg}$) o l'etanolo ($108$ e $855\,\text{kJ/kg}$), valori scritti nel testo. "La fusione ...
  dura $1{,}6\,\text{min}$ ... l'ebollizione?" $11\,\text{min}$; distrattori $0{,}24$ (rapporto rovesciato), $1{,}6$,
  $9{,}2$ ($L_v/L_f - 1$).

## Esercizi da evitare

- Una curva con troppe righe della griglia per leggere le tacche (al massimo dieci intervalli con numeri su tutte).
- Un intervallo di miscuglio che sembra una salita normale (livello 3).
- Risposte con zero ambiguo o vicine a un arrotondamento (livello 6).

## Verifica

`chim_curve_riscaldamento.py` legge la curva dalla scena e ne trova i tratti: le soste (stessa temperatura agli estremi)
sono fusione ed ebollizione, in quest'ordine; il tratto che contiene il minuto dà il contenuto del recipiente; un tratto
che sale al massimo alla metà dei vicini è un intervallo; le soste si confrontano con la tabella del testo, controllata
sui valori della lezione; nel raffreddamento la sosta dopo il minimo è la solidificazione. Le temperature citate nella
soluzione devono essere punti della curva. Il livello 6 rifà il conto con le frazioni esatte e arrotonda a due cifre.
Errori piantati (opzione giusta cambiata, distrattore uguale alla risposta, un punto della curva spostato) bocciati.
