# La pressione

Generatore: `fis-pressione` (`src/lib/exercises/v2/generators/fis-pressione.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_pressione.py`. Lezione collegata: `docs/lezioni/fisica/riscritte/26-fis-pressione.md`
(note in `docs/lezioni/fisica/note/26-fis-pressione.md`). Parti comuni ai tre generatori dei fluidi:
`src/lib/exercises/v2/fis-fluidi.ts` e `scripts/exercises/checkers/_fis_fluidi.py`.

Cinque livelli, ognuno con una difficoltà in più: la pressione con l'area già in metri quadrati, l'area da convertire,
il peso come forza premente, la formula rovesciata, la faccia di un blocco da scegliere.

## Nomi dei livelli

1. La pressione dalla forza e dall'area
2. L'area in centimetri quadrati
3. Il peso come forza premente
4. La forza o l'area dalla pressione
5. Il blocco appoggiato su una faccia

## Tipi di risposta

Risposta `number`, il valore esatto arrotondato a due cifre significative (mezzo in su), come insegna la lezione "Le
cifre significative": i dati hanno due cifre. Un dato che darebbe un arrotondamento a metà si scarta. Oltre $99$ la
risposta si scrive in notazione scientifica ($1{,}5 \cdot 10^{4}\,\text{Pa}$). Scelta multipla (`toChoice`) con l'unità
nell'opzione, i distrattori arrotondati allo stesso modo; prima gli errori tipici, poi valori vicini.

## Regole comuni

- $p = \dfrac{F_\perp}{S}$ con $F_\perp$ in N, $S$ in $\text{m}^2$, $p$ in Pa; $1\,\text{cm}^2 = 10^{-4}\,\text{m}^2$,
  $1\,\text{mm}^2 = 10^{-6}\,\text{m}^2$; $g = 9{,}8\,\text{N/kg}$ come nella lezione 17.
- I dati hanno due cifre significative; gli interi da $100$ in su si scrivono come sono ($440\,\text{N}$,
  $350\,\text{cm}^2$), come nella lezione, e gli altri con le loro due cifre ($0{,}035\,\text{m}^2$, $4{,}8\,\text{cm}^2$).
- Passaggi con il valore esatto e poi "$\approx$" con due cifre, come gli esempi della lezione.

## Livello 1: la pressione dalla forza e dall'area

Una cassa, uno scatolone, una valigia, un baule, un mobiletto o una lavatrice premono sul pavimento con una forza da
$10$ a $990\,\text{N}$ su una superficie da $0{,}010$ a $0{,}99\,\text{m}^2$.

- "Una valigia preme sul pavimento con una forza di $440\,\text{N}$, distribuita su una superficie di
  $0{,}035\,\text{m}^2$. Quanto vale la pressione sul pavimento?" Risposta $1{,}3 \cdot 10^{4}\,\text{Pa}$ ($12\,571{,}4$);
  distrattori $15\,\text{Pa}$ ($F \cdot S$), $8{,}0 \cdot 10^{-5}\,\text{Pa}$ ($S/F$), $1{,}3 \cdot 10^{5}\,\text{Pa}$.
- "Una cassa … $79\,\text{N}$ … $0{,}66\,\text{m}^2$." Risposta $1{,}2 \cdot 10^{2}\,\text{Pa}$.

## Livello 2: l'area in centimetri quadrati

Forza da $1{,}0$ a $99\,\text{N}$; area in $\text{cm}^2$ (circa il 70%, da $1{,}0$ a $99$) o in $\text{mm}^2$ (circa il
30%, da $1{,}0$ a $990$). Distrattori: l'area non convertita, convertita con il fattore delle lunghezze ($10^{-2}$ per i
$\text{cm}^2$, $10^{-3}$ per i $\text{mm}^2$), $F \cdot S$.

- "Una forza di $6{,}3\,\text{N}$ agisce perpendicolarmente su una superficie di $4{,}8\,\text{cm}^2$. Quanto vale la
  pressione in pascal?" Risposta $1{,}3 \cdot 10^{4}\,\text{Pa}$; distrattori $1{,}3\,\text{Pa}$,
  $1{,}3 \cdot 10^{2}\,\text{Pa}$, $0{,}0030\,\text{Pa}$.
- "… $61\,\text{N}$ … $5{,}9\,\text{mm}^2$." Risposta $1{,}0 \cdot 10^{7}\,\text{Pa}$.

## Livello 3: il peso come forza premente

Un corpo appoggiato su un tavolo orizzontale, con la massa adatta al corpo (vaso, zaino, pila di libri da $1{,}0$ a
$9{,}9\,\text{kg}$; valigia e televisore fino a $30\,\text{kg}$; cassa da $10$ a $99\,\text{kg}$), e l'area di contatto da
$10$ a $990\,\text{cm}^2$. $F_\perp = m \cdot g$. Distrattori: la massa presa per la forza, l'area non convertita,
$F \cdot S$.

- "Un televisore di massa $15\,\text{kg}$ è appoggiato su un tavolo orizzontale e lo tocca su una superficie di
  $350\,\text{cm}^2$. Che pressione esercita sul tavolo?" Risposta $4{,}2 \cdot 10^{3}\,\text{Pa}$; distrattori
  $4{,}3 \cdot 10^{2}\,\text{Pa}$ (senza $g$), $0{,}42\,\text{Pa}$, $5{,}1\,\text{Pa}$.
- "Una cassa di massa $10\,\text{kg}$ … $280\,\text{cm}^2$." Risposta $3{,}5 \cdot 10^{3}\,\text{Pa}$.

## Livello 4: la forza o l'area dalla pressione

Metà e metà, pressione in kPa (da $10$ a $990$ nel caso della forza, da $1{,}0$ a $99$ in quello dell'area):

- la forza: $F_\perp = p \cdot S$ con l'area in $\text{cm}^2$ (da $1{,}0$ a $99$); distrattori i numeri moltiplicati come
  sono, i kPa convertiti e i $\text{cm}^2$ no, un fattore $10$, $S/p$;
- l'area: $S = \dfrac{F_\perp}{p}$ in $\text{cm}^2$ (risposta da $1$ a $999\,\text{cm}^2$), la forza da $10$ a
  $990\,\text{N}$; distrattori i kPa non convertiti, i $\text{m}^2$ scritti come $\text{cm}^2$, $p/F$.

- "Quale area deve avere una superficie perché una forza perpendicolare di $63\,\text{N}$ eserciti su di essa una
  pressione di $4{,}8\,\text{kPa}$? Scrivi il risultato in centimetri quadrati." Risposta
  $1{,}3 \cdot 10^{2}\,\text{cm}^2$; distrattori $13\,\text{cm}^2$, $0{,}013\,\text{cm}^2$, $0{,}076\,\text{cm}^2$.
- "Su una superficie di $5{,}9\,\text{cm}^2$ agisce una pressione di $610\,\text{kPa}$. Quanto vale la forza
  perpendicolare alla superficie?" Risposta $3{,}6 \cdot 10^{2}\,\text{N}$.

## Livello 5: il blocco appoggiato su una faccia

Un blocco a forma di parallelepipedo con tre spigoli diversi (da $2{,}0$ a $9{,}5\,\text{cm}$ a mezzi centimetri, o da
$10$ a $40\,\text{cm}$) e la massa ricavata da una densità credibile, da $0{,}5$ a $8{,}0\,\text{g/cm}^3$, arrotondata a due
cifre. Si chiede la pressione più alta (faccia più piccola) o più bassa (faccia più grande), metà e metà: prima si
sceglie la faccia. Distrattori le pressioni sulle altre due facce e l'area non convertita.

- "Un blocco di massa $1{,}7\,\text{kg}$ ha la forma di un parallelepipedo con gli spigoli di $6{,}5\,\text{cm}$,
  $5{,}0\,\text{cm}$ e $7{,}5\,\text{cm}$. Si può appoggiare sul pavimento su una qualunque delle sue facce. Qual è la
  pressione più bassa che può esercitare sul pavimento?" Risposta $3{,}4 \cdot 10^{3}\,\text{Pa}$ (faccia di
  $48{,}75\,\text{cm}^2$); distrattori $4{,}4 \cdot 10^{3}$ e $5{,}1 \cdot 10^{3}\,\text{Pa}$ (le altre facce),
  $0{,}34\,\text{Pa}$.
- "… $9{,}1\,\text{kg}$ … $16$, $12$ e $32\,\text{cm}$ … la pressione più bassa" Risposta $1{,}7 \cdot 10^{3}\,\text{Pa}$.

## Esercizi da evitare

- Arrotondamenti a metà; risposte o distrattori non positivi.
- Oggetti con masse o forze assurde (un vaso di $79\,\text{kg}$, un blocco più denso del piombo).
- Nel livello 5 due spigoli uguali (due facce con la stessa area).

## Verifica

`scripts/exercises/checkers/fis_pressione.py` rilegge dal testo dati e unità, controlla che abbiano al più due cifre
significative e siano scritti come dice la regola, porta le aree in $\text{m}^2$ e ricalcola la pressione in aritmetica
esatta; controlla l'arrotondamento, le opzioni (quattro, diverse, arrotondate a due cifre, con l'unità), i corpi e le loro
masse, la densità del blocco e le quote dei casi.

## Domande per la revisione

- Le aree dei dati da $100\,\text{cm}^2$ in su si scrivono come interi ($350\,\text{cm}^2$), come nella lezione, anche se
  lo zero finale è ambiguo: va bene, o si preferisce $3{,}5 \cdot 10^{2}\,\text{cm}^2$?
- Livello 5: la domanda "la pressione più alta" richiede di capire che conta la faccia più piccola. È troppo per il
  quinto livello di una lezione del primo anno?
