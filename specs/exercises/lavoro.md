# Il lavoro di una forza

Generatore: `lavoro` (`src/lib/exercises/v2/generators/lavoro.ts`, con `src/lib/exercises/v2/fis-lavoro.ts`).
Verifica indipendente: `scripts/exercises/checkers/lavoro.py` (con `_fis_lavoro.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/59-lavoro.md`. Percorso nel database: `high_school/physics/lavoro-energia/lavoro`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Forza e spostamento paralleli
2. La forza inclinata
3. Il segno del lavoro
4. Il lavoro totale
5. La fune inclinata con l'attrito
6. L'area sotto il grafico

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, lavori in joule con l'unità nell'opzione. Dati con due cifre significative: masse da
$11$ a $99\,\text{kg}$ (da $1{,}1$ a $9{,}9\,\text{kg}$ per gli oggetti piccoli del livello 3), forze da $11$ a
$99\,\text{N}$, spostamenti e altezze da $1{,}1$ a $9{,}9\,\text{m}$, angoli in gradi interi, coefficienti con due
decimali, costanti elastiche da $11$ a $99\,\text{N/m}$, allungamenti in centimetri da $11$ a $39$; mai un intero
che finisce con lo zero. $g = 9{,}8\,\text{m/s}^2$. Risultati con due cifre significative, scritti come nelle lezioni:
decimali da $0{,}01$ a $99$, notazione scientifica fuori ($7{,}1 \cdot 10^2\,\text{J}$, $-2{,}5 \cdot 10^3\,\text{J}$);
arrotondamento per eccesso da 5 in su, mai a meno di $10^{-6}$ (relativo) da un confine.

## Regole comuni

- Formule della lezione: $W = F\,s$; $W = F\,s\cos\alpha$; $W_P = \pm m g h$; $W_P = 0$ per uno spostamento
  orizzontale; $W_{att} = -\mu_d F_\perp s$ con $F_\perp = m g$ sul pavimento e $F_\perp = m g - F\sin\alpha$ con la
  fune inclinata; $W_{tot}$ somma dei lavori; per la molla $W = \tfrac{1}{2}k\,x^2$ e, tra due allungamenti,
  $\tfrac{1}{2}k\,(x_2^2 - x_1^2)$.
- Scena `cassa-fune` (nuova, `scenes/CassaFune.tsx`) ai livelli 1, 2, 4, 5 e nel caso "nullo" del livello 3: la
  cassa, la forza lungo la fune all'angolo del testo con la scritta $F = \ldots$, l'angolo scritto, lo spostamento
  sotto il pavimento con la scritta $s = \ldots$. Niente lavoro nella scena. Livello 6: scena `grafico-dati` con la
  retta $F = k\,x$ (allungamento in cm, forza in N), senza punti né aree. Gli altri casi del livello 3 non hanno scena.
- Corpi: una cassa, uno scatolone, un baule, una valigia (livello 3: uno zaino, una borsa, un vaso, una scatola di
  libri), con l'accordo giusto.

## Livello 1: forza e spostamento paralleli

- "Una cassa di $16\,\text{kg}$ viene spinta sul pavimento con una forza orizzontale di $97\,\text{N}$, per un tratto
  rettilineo di $7{,}3\,\text{m}$. Quanto lavoro compie la forza?" Risposta $7{,}1 \cdot 10^2\,\text{J}$; distrattore
  principale $m g s = 1{,}1 \cdot 10^3\,\text{J}$ (il peso che "lavora"), poi $1{,}2$ e $0{,}8$ volte la risposta.
- La massa serve solo al distrattore: il controllo verifica che $m g s$ sia tra le opzioni.

## Livello 2: la forza inclinata

Fune da $10^\circ$ a $80^\circ$ rispetto all'orizzontale.

- "Una cassa viene trascinata sul pavimento per $9{,}7\,\text{m}$ con una fune inclinata di $59^\circ$ rispetto
  all'orizzontale, che tira con una forza di $16\,\text{N}$. Quanto lavoro compie la forza della fune?" Risposta
  $80\,\text{J}$; distrattori $1{,}3 \cdot 10^2\,\text{J}$ (il seno), $1{,}6 \cdot 10^2\,\text{J}$ (tutta la forza).

## Livello 3: il segno del lavoro

Tre casi, un terzo ciascuno:

- attrito: "Una cassa di $97\,\text{kg}$ scivola per $7{,}3\,\text{m}$ su un pavimento orizzontale; il coefficiente di
  attrito dinamico è $\mu_d = 0{,}36$. Quanto vale il lavoro della forza di attrito?" Risposta
  $-2{,}5 \cdot 10^3\,\text{J}$; distrattori $2{,}5 \cdot 10^3\,\text{J}$ (il segno), $-6{,}9 \cdot 10^3\,\text{J}$
  (senza $\mu_d$), $-2{,}5 \cdot 10^2\,\text{J}$ (la massa al posto del peso). $\mu_d$ da $0{,}10$ a $0{,}60$.
- peso, in salita ("viene portato su per le scale, fino a un piano $h$ più in alto", $-m g h$) o in discesa ("cade da
  un'altezza di $h$", $+m g h$), metà ciascuno; distrattori il segno opposto e $\pm m h$.
- nullo: una cassa spinta in orizzontale, "Quanto lavoro compie il peso?" Risposta $0\,\text{J}$; distrattori
  $m g s$, $-m g s$, $F\,s$. Solo in questo caso un'opzione vale zero.

## Livello 4: il lavoro totale

Forza orizzontale e attrito, con $F \ge 1{,}2\,\mu_d m g$ (lavoro totale positivo).

- "Una cassa di $16\,\text{kg}$ viene tirata per $7{,}3\,\text{m}$ sul pavimento con una forza orizzontale di
  $97\,\text{N}$; il coefficiente di attrito dinamico è $\mu_d = 0{,}36$. Quanto vale il lavoro totale delle forze?"
  Risposta $3{,}0 \cdot 10^2\,\text{J}$; distrattori $7{,}1 \cdot 10^2\,\text{J}$ (solo la forza),
  $1{,}1 \cdot 10^3\,\text{J}$ (l'attrito sommato), $-4{,}1 \cdot 10^2\,\text{J}$ (solo l'attrito).

## Livello 5: la fune inclinata con l'attrito

Fune da $10^\circ$ a $60^\circ$, $\mu_d$ da $0{,}10$ a $0{,}50$; la fune solleva al più l'$80\%$ del peso, e la forza
netta lungo il pavimento è almeno il $20\%$ di $F\cos\alpha$. È l'esempio 5 della lezione.

- "Una cassa di $16\,\text{kg}$ viene trascinata per $7{,}3\,\text{m}$ sul pavimento con una fune inclinata di
  $30^\circ$ rispetto all'orizzontale, che tira con $97\,\text{N}$; il coefficiente di attrito dinamico è
  $\mu_d = 0{,}31$. Quanto vale il lavoro totale delle forze?" Risposta $3{,}7 \cdot 10^2\,\text{J}$; distrattori
  $2{,}6 \cdot 10^2\,\text{J}$ (la fune che non alleggerisce, $F_\perp = m g$), $6{,}1 \cdot 10^2\,\text{J}$ (solo la
  fune), $1{,}5 \cdot 10^2\,\text{J}$ ($F_\perp = m g + F\sin\alpha$).

## Livello 6: l'area sotto il grafico

Metà da riposo ($x$ da $11$ a $39\,\text{cm}$), metà tra due allungamenti ($x_1$ da $11$ a $25$, $x_2$ da $x_1 + 6$ a
$39\,\text{cm}$).

- "Una molla ha costante elastica $k = 12\,\text{N/m}$. Quanto lavoro serve per allungarla di $39\,\text{cm}$,
  partendo dalla sua lunghezza a riposo?" Risposta $0{,}91\,\text{J}$; distrattori $1{,}8\,\text{J}$ (senza il
  mezzo), $9{,}1 \cdot 10^3\,\text{J}$ (i centimetri non convertiti), $4{,}7\,\text{J}$ (la forza $k\,x$).
- Tra due allungamenti i distrattori sono $\tfrac{1}{2}k\,(x_2 - x_1)^2$ (il quadrato della differenza),
  $\tfrac{1}{2}k\,x_2^2$ (tutto il triangolo), $k\,(x_2^2 - x_1^2)$ (senza il mezzo).

## Esercizi da evitare

- Lavoro totale negativo o quasi nullo (livelli 4 e 5): la domanda diventerebbe un'altra.
- Una fune che solleva la cassa da terra ($F\sin\alpha \ge m g$).
- Risultati a ridosso di un confine di arrotondamento.

## Verifica

`lavoro.py` rilegge il testo (con l'accordo), controlla le cifre significative dei dati e gli intervalli, ricalcola con
SymPy in aritmetica esatta (trigonometria esatta), arrotonda da sé e confronta l'opzione giusta; controlla che ogni
opzione sia scritta con due cifre significative e con l'unità, che solo il caso "nullo" abbia un'opzione zero, che ai
livelli 1 e "nullo" ci sia il distrattore $m g s$; controlla la scena (angolo, scritte, retta $F = k\,x$ che arriva
all'allungamento, niente punti), e che i casi senza scena non ne abbiano.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 90 px su 252).

### Errori piantati

Su 240 esercizi (seed da 90001) bocciati tutti: indice dell'opzione giusta, testo dell'opzione giusta, un numero del
testo cambiato, opzione doppia, parole vietate, angolo della scena spostato di $2^\circ$, scritta della forza nella
scena, scena tolta, pendenza della retta del grafico.

### Esercizi diversi su 1.000

Seed da 1: livello 1 998, livello 2 999, livello 3 998, livello 4 1000, livello 5 1000, livello 6 946.

## Domande per la revisione

- Il livello 5 (fune inclinata con l'attrito) è da verifica del secondo anno o da tenere per chi vuole di più?
- Il livello 6 usa la retta $F = k\,x$ disegnata: meglio dare solo il grafico, con la costante da leggere sulla retta?
