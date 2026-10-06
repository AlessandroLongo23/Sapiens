# Il principio di relatività galileiana

Generatore: `fis-principio-relativita-galileo` (`src/lib/exercises/v2/generators/fis-principio-relativita-galileo.ts`, con
`src/lib/exercises/v2/fis-riferimenti.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_principio_relativita_galileo.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/74-fis-principio-relativita-galileo.md`. Percorso nel database:
`high_school/physics/fis-relativita-galileiana/fis-principio-relativita-galileo`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. La lezione è in parte qualitativa: i livelli 3
e 4 sono domande di ragionamento su casi generati.

## Nomi dei livelli

1. La stessa accelerazione
2. La stessa forza
3. Lo stesso esperimento sul treno
4. Invariante o relativa
5. Il sasso dall'albero visto dalla riva
6. L'energia cinetica vista da terra

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni. Grandezze con l'unità a due cifre significative, tranne il livello 3 (somme esatte con
un decimale) e il livello 4 (parole). $g = 9{,}8\,\text{m/s}^2$. Niente risultati con uno zero finale ambiguo; un
distrattore a meno dell'8% dalla risposta si scarta.

## Livello 1: la stessa accelerazione

Un'auto vista dalla strada passa da $v_1$ ($11$-$25\,\text{m/s}$) a $v_2 = v_1 + 2 \ldots 12\,\text{m/s}$ in $2{,}0$-$9{,}9\,\text{s}$;
un treno va nello stesso verso a $V$, tra $5\,\text{m/s}$ e $v_1 - 2\,\text{m/s}$. Si chiede l'accelerazione misurata dal
treno: $(v_2 - v_1)/\Delta t$.

- "Vista dalla strada, un'auto passa da $20\,\text{m/s}$ a $26\,\text{m/s}$ in $4{,}0\,\text{s}$..." non si genera ($20$ ha lo
  zero ambiguo); con $21$ e $31\,\text{m/s}$ in $3{,}7\,\text{s}$ e un treno a $14\,\text{m/s}$: $2{,}7\,\text{m/s}^2$. Distrattori
  $(v_2 - V)/\Delta t$, $v_2/\Delta t$, $(v_2 - v_1 + V)/\Delta t$, $(v_1 - V)/\Delta t$.
- Con $13$ e $19\,\text{m/s}$ in $2{,}5\,\text{s}$, treno a $7\,\text{m/s}$: $2{,}4\,\text{m/s}^2$.

## Livello 2: la stessa forza

Su un treno a $11$-$35\,\text{m/s}$ un carrello di $0{,}11$-$0{,}99\,\text{kg}$, fermo su un banco senza attrito, raggiunge
$1{,}1$-$5{,}0\,\text{m/s}$ rispetto al treno in $0{,}50$-$3{,}0\,\text{s}$. Forza totale per chi guarda da terra:
$m\,\Delta v'/\Delta t$.

- Con $V = 27\,\text{m/s}$, $m = 0{,}45\,\text{kg}$, $v' = 1{,}9\,\text{m/s}$, $\Delta t = 0{,}94\,\text{s}$: $0{,}91\,\text{N}$.
  Distrattori $m\,(V + v')/\Delta t$ (la velocità finale vista da terra, come se partisse da fermo), $m\,V/\Delta t$,
  $m\,v'\,\Delta t$, $m\,v'$.
- Con $m = 0{,}20\,\text{kg}$, $v' = 2{,}0\,\text{m/s}$, $\Delta t = 0{,}50\,\text{s}$: $0{,}80\,\text{N}$ (l'esempio 3 della lezione).

## Livello 3: lo stesso esperimento sul treno

Una molla lancia un carrello a $u = 1{,}1$-$4{,}9\,\text{m/s}$ rispetto al banco, a terra; l'esperimento si rifà su un treno
a $V = 5{,}1$-$9{,}9\,\text{m/s}$, nel verso di marcia. Metà: la velocità rispetto al banco del treno ($u$, la stessa);
metà: rispetto al suolo ($u + V$).

- "... che parte a $4{,}1\,\text{m/s}$ rispetto al banco... su un treno che viaggia a $6{,}1\,\text{m/s}$... Con quale velocità
  parte il carrello rispetto al suolo?" Risposta $10{,}2\,\text{m/s}$; distrattori $4{,}1$, $6{,}1$, $2\,\text{m/s}$.
- "... rispetto al banco del treno?" Risposta $4{,}1\,\text{m/s}$; distrattori $10{,}2$, $2$, $6{,}1\,\text{m/s}$. È la domanda
  che il principio di relatività decide: chi somma le velocità qui sbaglia.

## Livello 4: invariante o relativa

Due osservatori, sulla banchina e su un treno a velocità costante ($72$-$252\,\text{km/h}$), studiano un corpo (un
carrello che accelera nel treno, una valigia che scivola e si ferma, un'auto che accelera accanto ai binari). Metà:
"quale grandezza ha lo stesso valore per tutti e due?", con una invariante (l'accelerazione, la forza totale, la massa,
la durata del moto) tra tre relative (la velocità finale, lo spostamento, l'energia cinetica finale, la posizione
finale). Metà: "quale ha valori diversi?", con una relativa tra tre invarianti.

- Opzioni "la velocità finale", "la forza totale", "lo spostamento", "la posizione finale", domanda sull'invariante:
  "la forza totale".
- Opzioni "la massa", "l'energia cinetica finale", "la durata del moto", "l'accelerazione", domanda sulla relativa:
  "l'energia cinetica finale".

## Livello 5: il sasso dall'albero visto dalla riva

Nave a $2{,}0$-$9{,}9\,\text{m/s}$, albero alto $5{,}0$-$30\,\text{m}$. Metà: di quanto avanza il sasso rispetto alla riva,
$V\sqrt{2h/g}$. Metà: la velocità di arrivo per la riva, $\sqrt{V^2 + 2gh}$.

- "Una nave viaggia a $8{,}0\,\text{m/s}$ costanti. Dalla cima dell'albero, alta $19{,}6\,\text{m}$..." ha tre cifre e non si
  genera; con $8{,}1\,\text{m/s}$ e $6{,}4\,\text{m}$: velocità di arrivo $14\,\text{m/s}$, distrattori $11\,\text{m/s}$ (quella
  vista dalla nave), $19\,\text{m/s}$ (i moduli sommati), $8{,}1\,\text{m/s}$.
- Con $6{,}0\,\text{m/s}$ e $12\,\text{m}$: spostamento $9{,}4\,\text{m}$; distrattori $V \cdot 2h/g$, $V\sqrt{h/g}$, il tempo
  letto come metri, $V\,h/g$.

## Livello 6: l'energia cinetica vista da terra

Treno a $11$-$30\,\text{m/s}$, carrello di $0{,}11$-$0{,}99\,\text{kg}$ spinto da fermo fino a $1{,}1$-$5{,}0\,\text{m/s}$ rispetto
al treno, nel verso di marcia: $\Delta K = \tfrac{1}{2}m\,[(V + v')^2 - V^2]$, sotto $100\,\text{J}$.

- Con $V = 24\,\text{m/s}$, $m = 0{,}79\,\text{kg}$, $v' = 1{,}9\,\text{m/s}$: $37\,\text{J}$; distrattori $1{,}4\,\text{J}$ (il valore
  del passeggero), l'energia cinetica finale, quella del treno.
- Con $V = 30\,\text{m/s}$, $m = 0{,}20\,\text{kg}$, $v' = 2{,}0\,\text{m/s}$: $12{,}4 \approx 12\,\text{J}$ (l'esempio 3).

## Esercizi da evitare

- Un treno più veloce dell'auto al livello 1 (velocità negative viste dal treno).
- Al livello 4, "la forma della traiettoria" tra le opzioni: per un moto lungo i binari è una retta in tutti e due i
  sistemi, e non è né chiaramente relativa né invariante.
- Al livello 6 il distrattore $m\,V\,v'$, che dista pochi per cento dalla risposta.

## Verifica

`fis_principio_relativita_galileo.py` rilegge il testo, controlla intervalli e cifre, ricalcola con SymPy esatto e
confronta risposta e opzioni; al livello 4 controlla che le opzioni siano una di una famiglia e tre dell'altra e che
quella giusta sia l'unica della sua famiglia.

## Senza esercizio

L'esempio 4 (la velocità della Terra sull'orbita) non ha un livello: è un conto di moto circolare. Nessuna scena.

## Domande per la revisione

- Il livello 3 alterna la stessa situazione con due domande (rispetto al banco, rispetto al suolo): è il modo giusto di
  far ragionare sul principio, o confonde?
- Al livello 4 "la durata del moto" tra le invarianti: va bene il nome?
