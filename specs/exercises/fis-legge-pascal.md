# La legge di Pascal e il torchio idraulico

Generatore: `fis-legge-pascal` (`src/lib/exercises/v2/generators/fis-legge-pascal.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_legge_pascal.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/27-fis-legge-pascal.md` (note in `docs/lezioni/fisica/note/27-fis-legge-pascal.md`). Parti
comuni ai tre generatori dei fluidi: `src/lib/exercises/v2/fis-fluidi.ts` e `scripts/exercises/checkers/_fis_fluidi.py`.

Cinque livelli, ognuno con una difficoltà in più: la pressione che si trasmette, la forza sul pistone grande, la forza
per reggere un carico (con il peso e, metà delle volte, aree in unità diverse), i diametri al posto delle aree, gli
spostamenti dei pistoni.

## Nomi dei livelli

1. La pressione trasmessa
2. La forza sul pistone grande
3. La forza per reggere un carico
4. I diametri dei pistoni
5. Gli spostamenti dei pistoni

## Tipi di risposta

Risposta `number`, il valore esatto arrotondato a due cifre significative (mezzo in su), in Pa, N o cm; un dato che
darebbe un arrotondamento a metà si scarta. Oltre $99$ in notazione scientifica. Scelta multipla (`toChoice`) con
l'unità nell'opzione: prima gli errori tipici, poi valori vicini, arrotondati allo stesso modo.

## Regole comuni

- $p = \dfrac{F}{S}$ uguale in tutto il liquido; torchio $\dfrac{F_1}{S_1} = \dfrac{F_2}{S_2}$;
  $\dfrac{S_2}{S_1} = \left(\dfrac{D_2}{D_1}\right)^2$ (il diametro è $D$, maiuscola, come nella lezione);
  $S_1 \cdot s_1 = S_2 \cdot s_2$; $g = 9{,}8\,\text{N/kg}$.
- Dati con due cifre significative; gli interi da $100$ in su scritti come sono ($350\,\text{cm}^2$, $1200\,\text{kg}$).
- Dal livello 2 una scena `torchio-idraulico` disegna il torchio con i dati: la larghezza dei cilindri segue le aree (la
  radice) o i diametri; le etichette sono quelle del testo ($S_1 = 44\,\text{cm}^2$), la forza nota ha la sua freccia, il
  carico è una cassa con la massa scritta. La scena non mostra mai la risposta (al livello 5 il pistone grande non si
  sposta nel disegno).

## Livello 1: la pressione trasmessa

Una siringa piena d'acqua con lo stantuffo di area da $1{,}0$ a $99\,\text{cm}^2$ e un tappo di area da $0{,}10$ a
$0{,}99\,\text{cm}^2$; si spinge con una forza da $1{,}0$ a $99\,\text{N}$. L'aumento di pressione vicino al tappo è
$\dfrac{F}{S_{\text{stantuffo}}}$ in Pa (esempio 1 della lezione). Distrattori: la forza divisa per l'area del tappo, i
$\text{cm}^2$ non convertiti, $F \cdot S$.

- "Una siringa piena d'acqua ha lo stantuffo di area $44\,\text{cm}^2$ e la punta chiusa da un tappo di area
  $0{,}63\,\text{cm}^2$. Si spinge lo stantuffo con una forza di $4{,}8\,\text{N}$. Di quanto aumenta la pressione
  dell'acqua vicino al tappo?" Risposta $1{,}1 \cdot 10^{3}\,\text{Pa}$; distrattori $7{,}6 \cdot 10^{4}\,\text{Pa}$
  (l'area del tappo), $0{,}11\,\text{Pa}$, $0{,}021\,\text{Pa}$.
- "… $13\,\text{cm}^2$ … $0{,}51\,\text{cm}^2$ … $7{,}8\,\text{N}$." Risposta $6{,}0 \cdot 10^{3}\,\text{Pa}$.

## Livello 2: la forza sul pistone grande

Aree in $\text{cm}^2$, $S_1$ da $1{,}0$ a $99$, $S_2$ da $10$ a $9900$, con $\dfrac{S_2}{S_1}$ tra $5$ e $200$; $F_1$ da
$10$ a $990\,\text{N}$. $F_2 = F_1 \cdot \dfrac{S_2}{S_1}$. Distrattori: il rapporto al contrario, $F_1$ stessa, la
pressione in $\text{N/cm}^2$ presa per la forza.

- "In un torchio idraulico il pistone piccolo ha l'area di $44\,\text{cm}^2$ e quello grande di $350\,\text{cm}^2$. Sul
  pistone piccolo si spinge con una forza di $27\,\text{N}$. Quanto vale la forza che il liquido esercita sul pistone
  grande?" Risposta $2{,}1 \cdot 10^{2}\,\text{N}$; distrattori $3{,}4\,\text{N}$, $27\,\text{N}$, $0{,}61\,\text{N}$.
- "… $13\,\text{cm}^2$ … $160\,\text{cm}^2$ … $530\,\text{N}$." Risposta $6{,}5 \cdot 10^{3}\,\text{N}$.

## Livello 3: la forza per reggere un carico

Un sollevatore regge un'auto ($800$-$2000\,\text{kg}$), un furgone ($2000$-$3500$), una cassa ($200$-$900$) o una moto
($150$-$300$), massa con due cifre; il pistone piccolo da $1{,}0$ a $99\,\text{cm}^2$, quello grande in $\text{cm}^2$ (da
$100$ a $990$) oppure, metà delle volte, in $\text{m}^2$ (da $0{,}010$ a $0{,}99$), con il rapporto tra $10$ e $500$.
$F_1 = m \cdot g \cdot \dfrac{S_1}{S_2}$ (esempio 3 della lezione). Distrattori: la massa presa per il peso, il rapporto al
contrario, con le unità diverse i numeri divisi come sono (altrimenti cento volte la risposta), il peso intero.

- "Un sollevatore idraulico regge una moto di $210\,\text{kg}$, appoggiata su un pistone di area $270\,\text{cm}^2$. Il
  pistone piccolo ha l'area di $4{,}8\,\text{cm}^2$. Con che forza bisogna spingere sul pistone piccolo?" Risposta
  $37\,\text{N}$; distrattori $3{,}7\,\text{N}$ (senza $g$), $1{,}2 \cdot 10^{5}\,\text{N}$, $3{,}7 \cdot 10^{3}\,\text{N}$.
- "… una cassa di $230\,\text{kg}$, appoggiata su un pistone di area $0{,}053\,\text{m}^2$ … $7{,}8\,\text{cm}^2$."
  Risposta $33\,\text{N}$; distrattore $3{,}3 \cdot 10^{5}\,\text{N}$ (le unità non convertite).

## Livello 4: i diametri dei pistoni

$D_1$ da $1{,}0$ a $9{,}9\,\text{cm}$, $D_2$ da $1{,}0$ a $99\,\text{cm}$, rapporto tra $2$ e $15$; $F_1$ da $10$ a
$990\,\text{N}$. $F_2 = F_1 \cdot \left(\dfrac{D_2}{D_1}\right)^2$. Distrattori: il rapporto dei diametri non al quadrato
(l'avviso della lezione), il rapporto al contrario, al quadrato o no.

- "In un torchio idraulico i pistoni hanno i diametri di $7{,}5\,\text{cm}$ e di $47\,\text{cm}$. Sul pistone piccolo
  agisce una forza di $320\,\text{N}$. Quanto vale la forza sul pistone grande?" Risposta $1{,}3 \cdot 10^{4}\,\text{N}$;
  distrattori $2{,}0 \cdot 10^{3}\,\text{N}$ ($F_1 \cdot D_2/D_1$), $51\,\text{N}$, $8{,}1\,\text{N}$.
- "… $2{,}3\,\text{cm}$ e $7{,}5\,\text{cm}$ … $10\,\text{N}$." Risposta $1{,}1 \cdot 10^{2}\,\text{N}$.

## Livello 5: gli spostamenti dei pistoni

Aree come al livello 2, con il rapporto fino a $50$. Metà e metà:

- quanto sale il pistone grande quando il piccolo scende di $s_1$ (da $10$ a $99\,\text{cm}$): $s_2 = s_1 \cdot
  \dfrac{S_1}{S_2}$;
- quanto deve scendere il piccolo perché il grande salga di $s_2$ (da $0{,}10$ a $9{,}9\,\text{cm}$): $s_1 = s_2 \cdot
  \dfrac{S_2}{S_1}$, al più $990\,\text{cm}$.

Distrattori: il rapporto al contrario, lo stesso spostamento, il rapporto delle aree da solo.

- "In un torchio idraulico il pistone piccolo ha l'area di $6{,}3\,\text{cm}^2$ e quello grande di $48\,\text{cm}^2$. Di
  quanto deve scendere il pistone piccolo perché quello grande salga di $0{,}75\,\text{cm}$?" Risposta
  $5{,}7\,\text{cm}$; distrattori $0{,}098\,\text{cm}$, $0{,}75\,\text{cm}$, $7{,}6\,\text{cm}$.
- "… $5{,}1\,\text{cm}^2$ … $78\,\text{cm}^2$. Il pistone piccolo scende di $20\,\text{cm}$. Di quanto sale il pistone
  grande?" Risposta $1{,}3\,\text{cm}$.

## Esercizi da evitare

- Arrotondamenti a metà; risposte o distrattori non positivi.
- Rapporti tra le aree vicini a $1$ (il torchio non moltiplica) o così grandi che la forza piccola diventa di pochi
  millesimi di newton.
- Carichi con masse non credibili; spostamenti del pistone piccolo di più di dieci metri.

## Verifica

`scripts/exercises/checkers/fis_legge_pascal.py` rilegge dal testo dati e unità (al più due cifre significative),
porta le aree nella stessa unità e ricalcola la risposta in aritmetica esatta; controlla arrotondamento e opzioni, i
rapporti ammessi, le masse dei carichi, le quote dei casi e che la scena abbia le etichette del testo, le aree o i
diametri nello stesso rapporto, la forza e il carico scritti come nel testo.

## Domande per la revisione

- Livello 5: la lezione dice che il volume spostato è lo stesso ($S_1 \cdot s_1 = S_2 \cdot s_2$) ma non parla di
  lavoro. Se l'Amaldi del biennio non tratta gli spostamenti dei pistoni, il livello 5 va tolto o reso facoltativo.
- Livello 1: il tappo più piccolo dello stantuffo è un distrattore voluto (la forza sul tappo è minore, la pressione è la
  stessa). È chiaro, o conviene chiedere anche la forza sul tappo, come nell'esempio 1?
