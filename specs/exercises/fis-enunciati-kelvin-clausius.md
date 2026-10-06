# Gli enunciati di Kelvin e di Clausius

Generatore: `fis-enunciati-kelvin-clausius` (`src/lib/exercises/v2/generators/fis-enunciati-kelvin-clausius.ts`, con
`src/lib/exercises/v2/fis-macchine.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_enunciati_kelvin_clausius.py` (con `_fis_macchine.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/115-fis-enunciati-kelvin-clausius.md`. Percorso nel database:
`high_school/physics/fis-secondo-principio/fis-enunciati-kelvin-clausius`.

Cinque livelli. La lezione è qualitativa: i primi tre livelli sono domande di ragionamento su un caso generato, gli ultimi
due sono le due metà della dimostrazione di equivalenza, con i numeri.

## Nomi dei livelli

1. Il verso del calore
2. Tutto il calore in lavoro?
3. Che cosa viola un dispositivo
4. Se fosse falso Clausius
5. Se fosse falso Kelvin

## Tipi di risposta

Livelli 1, 2 e 3: scelta multipla tra quattro frasi, sempre le stesse, in ordine casuale.

| Chiave | Frase |
|---|---|
| `possibile` | Sì, è possibile |
| `primo` | No: viola il primo principio |
| `clausius` | No: lo vieta Clausius |
| `kelvin` | No: lo vieta Kelvin |

Si seguono i due controlli della lezione, in quest'ordine: prima il bilancio dell'energia (se non torna, la risposta è il
primo principio, qualunque altra cosa succeda), poi il secondo principio. Livelli 4 e 5: scelta multipla numerica in joule,
interi che non finiscono con zero. I calori sono interi in joule che non finiscono con zero.

## Livello 1: il verso del calore

Due corpi $A$ e $B$ tra $5$ e $95\,^\circ\text{C}$, con almeno $10$ gradi di differenza, isolati dal resto; uno cede calore
(da $105$ a $895\,\text{J}$) e l'altro ne assorbe, senza lavoro. Tre casi, un terzo ciascuno:

- `spontaneo`: cede il più caldo, stessi joule. Risposta: sì.
- `inverso`: cede il più freddo, stessi joule. Risposta: lo vieta Clausius.
- `bilancio`: cede il più caldo, ma l'altro assorbe più joule di quelli ceduti. Risposta: primo principio.

Esempio: "Un corpo $A$ a $58\,^\circ\text{C}$ è messo a contatto con un corpo $B$ a $82\,^\circ\text{C}$, e i due sono
isolati dal resto. Il corpo $A$ cede $168\,\text{J}$ di calore e il corpo $B$ ne assorbe $168\,\text{J}$, senza che nessuno
compia lavoro. È possibile?" Risposta: lo vieta Clausius.

## Livello 2: tutto il calore in lavoro?

Cinque casi (quote: 30%, 20%, 20%, 10%, 20%):

- `una-sorgente`: una macchina ciclica assorbe $Q$ da un lago, dall'aria, da una caldaia o dal mare, compie $Q$ di lavoro e
  non cede calore. Risposta: lo vieta Kelvin.
- `due-sorgenti`: assorbe $Q_c$ da una caldaia, cede $Q_f$ all'aria, compie $W = Q_c - Q_f$. Risposta: sì.
- `isoterma`: un gas perfetto si espande una volta sola a temperatura costante, assorbe $Q$ e compie $Q$ di lavoro; alla
  fine ha un volume più grande. Risposta: sì (non è l'unico risultato).
- `attrito`: i freni trasformano tutto il lavoro in calore. Risposta: sì.
- `bilancio`: una macchina ciclica compie più lavoro del calore che assorbe. Risposta: primo principio.

Esempio: "Una macchina che lavora per cicli assorbe in ogni ciclo $264\,\text{J}$ di calore da una caldaia, compie
$264\,\text{J}$ di lavoro e non cede calore a nessun altro corpo. È possibile?" Risposta: lo vieta Kelvin.

## Livello 3: che cosa viola un dispositivo

Frigoriferi e motori con tre numeri: il bilancio va calcolato. Sei casi, un sesto ciascuno:

- `frigo`: assorbe $Q_f$, riceve $W$, cede $Q_c = Q_f + W$. Risposta: sì.
- `frigo-bilancio`: come sopra, ma il calore ceduto differisce da $Q_f + W$ di almeno $15\,\text{J}$. Risposta: primo
  principio.
- `frigo-senza-lavoro`: assorbe $Q$ da una cella fredda e cede $Q$ alla stanza, senza lavoro. Risposta: lo vieta Clausius.
- `macchina`: assorbe $Q_c$, cede $Q_f$, compie $W = Q_c - Q_f$. Risposta: sì.
- `macchina-bilancio`: il lavoro supera $Q_c - Q_f$ di almeno $15\,\text{J}$ (ma resta minore di $Q_c$). Risposta: primo
  principio.
- `macchina-una-sorgente`: come al livello 2. Risposta: lo vieta Kelvin.

Esempio: "Un frigorifero assorbe in ogni ciclo $624\,\text{J}$ di calore dal suo interno, riceve $118\,\text{J}$ di lavoro
dal motore e cede $742\,\text{J}$ di calore alla cucina. Può esistere?" Risposta: sì.

## Livello 4: se fosse falso Clausius

Una macchina termica ($Q_c$ da $405$ a $1495\,\text{J}$, $Q_f$ minore) e un dispositivo vietato che riporta $Q_f$ alla
sorgente calda. Si chiede il calore che la sorgente calda cede in tutto: $Q_c - Q_f$. Il lavoro non è nel testo, perché è
la risposta. Scena `macchina-termica` con i due dispositivi.

- "In ogni ciclo una macchina termica assorbe $963\,\text{J}$ dalla sorgente calda e cede $554\,\text{J}$ alla sorgente
  fredda. Un dispositivo che viola l'enunciato di Clausius riporta i $554\,\text{J}$ dalla sorgente fredda a quella calda,
  senza lavoro. Quanto calore cede in tutto la sorgente calda in un ciclo?" Risposta $409\,\text{J}$; distrattori
  $963\,\text{J}$ (solo quello che va alla macchina), $554\,\text{J}$, $1517\,\text{J}$ (sommati).

## Livello 5: se fosse falso Kelvin

Una macchina vietata trasforma $Q$ (da $105$ a $495\,\text{J}$) tutto in lavoro e aziona un frigorifero che assorbe $Q_f$ (da
$205$ a $995\,\text{J}$). Si chiede il calore che la sorgente calda riceve in tutto: $-Q + (Q_f + Q) = Q_f$. La scena non
scrive il valore di $Q_c$ del frigorifero.

- "Una macchina che viola l'enunciato di Kelvin assorbe in ogni ciclo $305\,\text{J}$ dalla sorgente calda e li trasforma
  tutti in lavoro. Con quel lavoro aziona un frigorifero, che assorbe $624\,\text{J}$ dalla sorgente fredda. Quanto calore
  riceve in tutto la sorgente calda in un ciclo?" Risposta $624\,\text{J}$; distrattori $929\,\text{J}$ (quello che cede il
  frigorifero, senza togliere quello preso dalla macchina: sempre presente), $305\,\text{J}$, $319\,\text{J}$.

## Esercizi da evitare

- Casi in cui sono violati tutti e due i principi insieme senza che la regola dell'ordine decida: il caso `bilancio` del
  livello 1 va sempre dal caldo al freddo.
- Squilibri di pochi joule, che sembrano un arrotondamento: almeno $15\,\text{J}$.
- Definizioni da ricordare ("Chi ha enunciato...?"): ogni domanda parte da un caso con i numeri.

## Verifica

`fis_enunciati_kelvin_clausius.py` rilegge il testo, riconosce il caso dai numeri (non dal campo `case`), applica i due
controlli della lezione e confronta la frase giusta; controlla che le quattro frasi siano quelle della tabella, le quote dei
casi, e ai livelli 4 e 5 il bilancio della sorgente calda, le etichette della scena e che la scena non dia la risposta.

## Domande per la revisione

- Le frasi brevi "lo vieta Clausius" e "lo vieta Kelvin" bastano, o serve "viola il secondo principio (Clausius)"?
- Al livello 5 la risposta coincide con un dato del testo ($Q_f$): è il senso della dimostrazione, ma va bene come esercizio?
