# Note: Dualismo onda-particella e principio di indeterminazione

Lezione nuova (terzo anno di chimica, gruppo A, 6 ottobre 2026). Non pubblicata. Conti rifatti in Python (`conti.py`
nello scratchpad del gruppo): esempio 1, $3{,}32 \cdot 10^{-10}\,\text{m}$; esempio 2, $2{,}3 \cdot 10^{-34}\,\text{m}$;
esempio 3, $1{,}81 \cdot 10^{-13}\,\text{m}$; esempio 4, $5{,}8 \cdot 10^5\,\text{m/s}$; esempio 5,
$9{,}3 \cdot 10^{-28}\,\text{m/s}$; circonferenza della prima orbita $2\pi \cdot 52{,}9 = 332\,\text{pm}$. `check.mts`
passa senza errori e senza avvisi.

## Struttura

La domanda lasciata aperta da Bohr; la luce come onda e come particella, e che cosa vuol dire dualismo; l'ipotesi di de
Broglie con tre esempi (elettrone, pallina da tennis, protone) e la figura interattiva; l'onda che si chiude su se
stessa, che spiega le orbite permesse; la diffrazione degli elettroni; il principio di indeterminazione con due esempi
e la seconda figura interattiva; dall'orbita all'orbitale.

## Scelte

- Confine con la 52: qui si arriva alla definizione di orbitale come regione di probabilità, con una figura e un
  avviso; forme, nodi e numeri quantici sono là. La 52 comincia proprio dall'onda chiusa e dalla corda, e questa
  lezione la prepara con l'onda sulla circonferenza.
- Definizione di orbitale: "la regione attorno al nucleo in cui è alta la probabilità di trovare l'elettrone", con la
  superficie al $90\%$ come nella 52, che dice "la mappa della probabilità". Le due frasi non si contraddicono, ma non
  sono identiche.
- Principio di indeterminazione nella forma $\Delta x \cdot m\,\Delta v \geq h/(4\pi)$, come il Valitutti. Non uso
  $\Delta p$ né $\hbar$.
- L'elettrone della prima orbita di Bohr a $2{,}19 \cdot 10^6\,\text{m/s}$: con questo dato la lunghezza d'onda
  dell'esempio 1, $332\,\text{pm}$, è la circonferenza dell'orbita, e la sezione successiva lo usa.
- Il dualismo è detto così: la luce e l'elettrone non sono né onde né palline, e onda e particella sono i due modelli
  con cui li descriviamo. È una scelta di linguaggio.
- La diffrazione è spiegata in tre righe, senza la legge di Bragg: la fisica delle onde è al quarto anno.
- L'aneddoto dei due Thomson: il testo dice che ebbero tutti e due il Nobel, non che il padre lo ebbe "per aver
  mostrato che l'elettrone è una particella" (la motivazione del 1906 parla della conduzione nei gas).

## Figure

Tre TikZ, guardate in chiaro e in scuro: `onda-particella-onda-orbita`, `onda-particella-diffrazione-elettroni`,
`onda-particella-orbita-orbitale` (i puntini sono un campione dell'orbitale $1s$ generato con uno script, e il cerchio
tratteggiato è al $90\%$).

Due interattive:

| Nome | File | Che cosa fa |
|---|---|---|
| `onda-particella-de-broglie` | `OndaDeBroglie.tsx` | si sceglie l'oggetto (elettrone, protone, atomo di elio, fullerene, granello di polvere, pallina da tennis) e la velocità; l'onda è disegnata accanto a un atomo alla stessa scala, e un segno indica $\lambda$ su una scala di lunghezze da $10^{-36}$ a $10^{-6}\,\text{m}$ |
| `onda-particella-indeterminazione` | `OndaIndeterminazione.tsx` | un cursore cambia $\Delta x$ da $10$ a $1000\,\text{pm}$ per un elettrone: il pacchetto di onde si stringe e la campana delle velocità si allarga; si legge $\Delta v$ minimo |

Nella prima il cursore della velocità dà l'esponente di dieci, per coprire sette ordini di grandezza con un cursore
solo: l'etichetta è "Velocità (10ˣ m/s)". Nella seconda le larghezze delle due curve sono schematiche, una l'inverso
dell'altra.

## Da verificare

- Date e nomi: de Broglie 1924 (tesi); Davisson e Germer 1927, cristallo di nichel; George Paget Thomson 1927, lamina
  di metallo; Heisenberg 1927; Schrödinger 1926; Born e l'interpretazione di probabilità, 1926.
- La velocità dell'elettrone nella prima orbita di Bohr, $2{,}19 \cdot 10^6\,\text{m/s}$.
- Nella figura interattiva: massa dell'atomo di elio $6{,}65 \cdot 10^{-27}\,\text{kg}$, del fullerene
  $\mathrm{C_{60}}$ $1{,}20 \cdot 10^{-24}\,\text{kg}$ (la diffrazione del fullerene è di Arndt e Zeilinger, 1999, a
  circa $200\,\text{m/s}$), granello di polvere di un microgrammo.
- "Gli elettroni veloci hanno una lunghezza d'onda migliaia di volte più corta di quella della luce visibile": in un
  microscopio elettronico è anche centomila volte; "migliaia" è prudente.

## Dubbi per Andrea

- $\Delta x \cdot m\,\Delta v \geq h/(4\pi)$: è la forma che usi, o preferisci $\Delta x \cdot \Delta p \geq h/(4\pi)$?
- I conti con il principio di indeterminazione (esempi 4 e 5, livello 5 degli esercizi) si fanno in terza, o basta
  l'enunciato?
- La sezione sull'onda che si chiude sull'orbita ($2\pi r = n\,\lambda$): è nel Valitutti, ma non in tutti i libri.
  Tenerla?
- La figura interattiva sull'indeterminazione usa un pacchetto di onde, che il testo non spiega: è chiara lo stesso?

## Esercizio guidato

L'esempio 1 (la lunghezza d'onda di un elettrone). Punti in cui fermarsi: la formula e le unità (chilogrammi, metri al
secondo); il risultato in metri; il passaggio ai picometri e il confronto con le dimensioni di un atomo.

## Esercizi

Generatore `chim-onda-particella`, sei livelli (specifica in `specs/exercises/chim-onda-particella.md`), tutto a scelta
multipla. Controllo indipendente `scripts/exercises/checkers/chim_onda_particella.py`.

Prerequisiti proposti: chim-luce-spettri, chim-modello-bohr, particelle-fondamentali
