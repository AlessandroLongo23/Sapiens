# L'energia cinetica e il teorema dell'energia cinetica

Generatore: `fis-energia-cinetica` (`src/lib/exercises/v2/generators/fis-energia-cinetica.ts`, con
`src/lib/exercises/v2/fis-lavoro.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_energia_cinetica.py` (con
`_fis_lavoro.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/61-fis-energia-cinetica.md`. Percorso nel
database: `high_school/physics/lavoro-energia/fis-energia-cinetica`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'energia cinetica
2. La velocità in km/h
3. La velocità dall'energia
4. Il teorema dell'energia cinetica
5. Lo spazio di frenata

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, con l'unità nell'opzione (J, m/s, m). Dati con due cifre significative, mai un
intero che finisce con lo zero; $g = 9{,}8\,\text{m/s}^2$. Risultati con due cifre significative, scritti come nelle
lezioni (notazione scientifica da $100$ in su; modulo comune `fis-lavoro.ts`), mai a ridosso di un confine di
arrotondamento. Niente scene.

## Regole comuni

- Formule della lezione: $K = \tfrac{1}{2}m\,v^2$ con $v$ in m/s ($v = V/3{,}6$); $v = \sqrt{2K/m}$;
  $W_{tot} = \tfrac{1}{2}m\,v_f^2 - \tfrac{1}{2}m\,v_i^2$; $d = v^2 / (2\,\mu_d\,g)$, e quindi
  $d_2 = d_1\,(v_2/v_1)^2$ sulla stessa strada.
- Corpi: un carrello, una palla da bowling, un pacco, una slitta giocattolo (livelli 1 e 3); un pattinatore, una
  pattinatrice, un ciclista con la sua bici, una sciatrice (livello 4, con "su di lui" o "su di lei").

## Livello 1: l'energia cinetica

Massa e velocità da $1{,}1$ a $9{,}9$.

- "Un pacco di $5{,}8\,\text{kg}$ si muove a $6{,}5\,\text{m/s}$. Quanto vale la sua energia cinetica?" Risposta
  $1{,}2 \cdot 10^2\,\text{J}$; distrattori $2{,}5 \cdot 10^2\,\text{J}$ (senza il mezzo), $19\,\text{J}$ (senza il
  quadrato), $7{,}1 \cdot 10^3\,\text{J}$ ($\tfrac{1}{2}(m\,v)^2$).

## Livello 2: la velocità in km/h

Un'auto da $1{,}1 \cdot 10^3$ a $2{,}4 \cdot 10^3\,\text{kg}$, velocità da $11$ a $99\,\text{km/h}$.

- "Un'auto di $1{,}8 \cdot 10^3\,\text{kg}$ viaggia a $58\,\text{km/h}$. Quanto vale la sua energia cinetica?"
  Risposta $2{,}3 \cdot 10^5\,\text{J}$; distrattori $3{,}0 \cdot 10^6\,\text{J}$ (km/h non convertiti),
  $3{,}9 \cdot 10^7\,\text{J}$ (moltiplicati per $3{,}6$), $4{,}7 \cdot 10^5\,\text{J}$ (senza il mezzo).

## Livello 3: la velocità dall'energia

Massa da $1{,}1$ a $9{,}9\,\text{kg}$, energia da $11$ a $99\,\text{J}$.

- "Un pacco di $5{,}8\,\text{kg}$ ha un'energia cinetica di $65\,\text{J}$. Con quale velocità si muove?" Risposta
  $4{,}7\,\text{m/s}$; distrattori $3{,}3\,\text{m/s}$ (senza il 2), $22\,\text{m/s}$ (senza la radice),
  $11\,\text{m/s}$ ($K/m$).

## Livello 4: il teorema dell'energia cinetica

Massa da $11$ a $99\,\text{kg}$, velocità da $1{,}1$ a $9{,}9\,\text{m/s}$ che differiscono di almeno
$1\,\text{m/s}$; metà accelera, metà rallenta.

- "Un ciclista con la sua bici, in tutto $65\,\text{kg}$, passa da $8{,}6\,\text{m/s}$ a $6{,}3\,\text{m/s}$. Quanto
  lavoro compiono in tutto le forze che agiscono su di lui?" Risposta $-1{,}1 \cdot 10^3\,\text{J}$; distrattori
  $-1{,}7 \cdot 10^2\,\text{J}$ (il quadrato della differenza, con il segno), $1{,}1 \cdot 10^3\,\text{J}$ (il segno),
  $1{,}3 \cdot 10^3\,\text{J}$ (solo l'energia finale).

## Livello 5: lo spazio di frenata

Due casi, metà ciascuno.

- Da un'altra frenata: velocità da $21$ a $99\,\text{km/h}$, con rapporto tra $1{,}3$ e $3$ (o tra $1/3$ e $1/1{,}3$);
  il primo spazio è quello di un coefficiente tra $0{,}55$ e $0{,}80$, arrotondato a due cifre (da $1{,}1$ a $99\,\text{m}$).
  "Un'auto che frena a $56\,\text{km/h}$ si ferma in $17\,\text{m}$. In quanto spazio si ferma, sulla stessa strada, se
  frena a $77\,\text{km/h}$?" Risposta $32\,\text{m}$; distrattori $23\,\text{m}$ (proporzionale alla velocità),
  $9{,}0\,\text{m}$ (il rapporto dei quadrati rovesciato), $12\,\text{m}$ (il rapporto rovesciato).
- Dal coefficiente ($0{,}30$-$0{,}90$): "Un'auto frena a $58\,\text{km/h}$ su una strada orizzontale; il coefficiente di
  attrito dinamico tra le gomme e la strada è $\mu_d = 0{,}67$. In quanto spazio si ferma?" Risposta $20\,\text{m}$;
  distrattori $2{,}6 \cdot 10^2\,\text{m}$ (km/h non convertiti), $1{,}2\,\text{m}$ (senza il quadrato),
  $40\,\text{m}$ (senza il 2).

## Esercizi da evitare

- Due velocità quasi uguali (livelli 4 e 5): la differenza sparirebbe negli arrotondamenti.
- Auto troppo pesanti o troppo lente; una prima frenata con un coefficiente di attrito poco credibile.

## Verifica

`fis_energia_cinetica.py` rilegge il testo (con l'accordo di "lui" e "lei"), controlla cifre significative e
intervalli, ricalcola in aritmetica esatta con SymPy (radici esatte, $5/18$ per i km/h), controlla al livello 5 che la
prima frenata corrisponda a un coefficiente tra $0{,}50$ e $0{,}85$, arrotonda da sé e confronta l'opzione giusta;
controlla che ogni opzione sia scritta con due cifre significative e con l'unità giusta, e che non ci sia una scena.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 100 px su 252).

### Errori piantati

Su 200 esercizi (seed da 90001) bocciati tutti: indice dell'opzione giusta, testo dell'opzione giusta, un numero del
testo cambiato, opzione doppia, parole vietate.

### Esercizi diversi su 1.000

Seed da 1: livello 1 981, livello 2 645 (13 masse per 80 velocità: un migliaio di esercizi
possibili), livello 3 981, livello 4 1000, livello 5 975.

## Domande per la revisione

- $20\,\text{m}$ e $40\,\text{m}$ come risultati con due cifre significative: le lezioni evitano gli zeri finali
  ambigui, ma scrivere $2{,}0 \cdot 10^1\,\text{m}$ in un esercizio sembra peggio. Va bene così?
- Serve un livello con la velocità finale dal lavoro ($v_f = \sqrt{v_i^2 + 2W/m}$), come l'esempio 3 della lezione?
