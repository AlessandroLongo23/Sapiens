# La teoria cinetica dei gas

Generatore: `fis-teoria-cinetica` (`src/lib/exercises/v2/generators/fis-teoria-cinetica.ts`, con
`src/lib/exercises/v2/fis-cinetica.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_teoria_cinetica.py` (con
`_fis_cinetica.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/105-fis-teoria-cinetica.md`. Percorso nel database:
`high_school/physics/fis-gas/fis-teoria-cinetica`.

Sei livelli, nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Quante molecole ci sono
2. La massa di una molecola
3. La velocità quadratica media di poche molecole
4. La pressione dal modello
5. La velocità dalla pressione e dalla densità
6. Come cambia la pressione

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, l'unità nell'opzione. Costanti: $N_A = 6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$, scritta nel
testo dove serve. I numeri si scrivono come nella lezione: virgola decimale, notazione scientifica con $\cdot$ quando la
parte intera chiederebbe più cifre di quelle significative o il valore è sotto $0{,}001$. Le risposte hanno tre cifre
significative (due al livello 1, dove il dato ne ha due), non cadono mai a metà tra due arrotondamenti e non sono un
intero che finisce con zero ($320\,\text{m/s}$). Al livello 6 la risposta è un multiplo esatto di $p_0$.

I gas e le masse molari (g/mol): idrogeno $2{,}02$, elio $4{,}00$, metano $16{,}0$, ammoniaca $17{,}0$, neon $20{,}2$, azoto
$28{,}0$, ossigeno $32{,}0$, fluoro $38{,}0$, argon $39{,}9$, anidride carbonica $44{,}0$, ozono $48{,}0$, butano $58{,}1$,
cloro $70{,}9$, kripton $83{,}8$, xeno $131$. Elio, neon, argon, kripton e xeno sono fatti di atomi, gli altri di
molecole, e il testo usa la parola giusta.

## Livello 1: quante molecole ci sono

$N = n\,N_A$, con $n$ di due cifre significative senza zero finale: da $0{,}11$ a $0{,}99\,\text{mol}$ (caso "centesimi") o
da $1{,}1$ a $9{,}9\,\text{mol}$ (caso "decimi"), metà e metà. Risposta con due cifre, senza unità.

- "Un recipiente contiene $0{,}57\,\text{mol}$ di anidride carbonica. Quante molecole ci sono?
  ($N_A = 6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$)" Risposta $3{,}4 \cdot 10^{23}$; distrattori $1{,}1 \cdot 10^{24}$ ($N_A / n$),
  $9{,}5 \cdot 10^{-25}$ ($n / N_A$), $6{,}0 \cdot 10^{23}$ ($N_A$ da solo).
- "Un recipiente contiene $2{,}7\,\text{mol}$ di elio. Quanti atomi ci sono? (…)" Risposta $1{,}6 \cdot 10^{24}$.

## Livello 2: la massa di una molecola

$m = M / N_A$, con la massa molare da grammi a chilogrammi. Uno dei quindici gas.

- "La massa molare dell'anidride carbonica è $44{,}0\,\text{g/mol}$. Qual è la massa di una sua molecola? (…)" Risposta
  $7{,}31 \cdot 10^{-26}\,\text{kg}$; distrattori $7{,}31 \cdot 10^{-23}\,\text{kg}$ (i grammi non convertiti),
  $2{,}65 \cdot 10^{22}\,\text{kg}$ ($M \cdot N_A$), $1{,}37 \cdot 10^{25}\,\text{kg}$ ($N_A / M$).
- "La massa molare dell'elio è $4{,}00\,\text{g/mol}$. Qual è la massa di un suo atomo? (…)" Risposta
  $6{,}64 \cdot 10^{-27}\,\text{kg}$.

## Livello 3: la velocità quadratica media di poche molecole

Da tre a cinque molecole, con velocità tutte diverse, multiple di $10\,\text{m/s}$ tra $150$ e $950\,\text{m/s}$, e almeno
$250\,\text{m/s}$ tra la più lenta e la più veloce (così la velocità quadratica media si distingue dalla media). Scena
`molecole-velocita`: le molecole in un recipiente con le frecce delle velocità in scala e i valori scritti.

- "In un recipiente ci sono 5 molecole con velocità di modulo $410\,\text{m/s}$, $380\,\text{m/s}$, $580\,\text{m/s}$,
  $850\,\text{m/s}$ e $660\,\text{m/s}$. Quanto vale la loro velocità quadratica media?" Risposta $601\,\text{m/s}$;
  distrattori $576\,\text{m/s}$ (la media), $1{,}34 \cdot 10^{3}\,\text{m/s}$ (la somma dei quadrati non divisa), $615\,\text{m/s}$
  (a metà tra la più lenta e la più veloce).
- "… 3 molecole con velocità di modulo $200\,\text{m/s}$, $500\,\text{m/s}$ e $700\,\text{m/s}$ …" Risposta $510\,\text{m/s}$ non
  ammessa (zero finale): il generatore estrae di nuovo.

## Livello 4: la pressione dal modello

$p = \dfrac{N\,m\,v_{qm}^2}{3\,V}$. Volume in litri da una lista ($1{,}00$, $1{,}50$, $2{,}00$, $2{,}50$, $3{,}00$, $4{,}00$,
$5{,}00$, $6{,}00$, $8{,}00$), velocità quadratica media intera tra $151$ e $999\,\text{m/s}$ senza zero finale, massa della
molecola quella del gas con tre cifre ($M / N_A$ arrotondata), numero di molecole con tre cifre in notazione
scientifica, scelto in modo che la pressione stia tra $4 \cdot 10^{4}$ e $4{,}2 \cdot 10^{5}\,\text{Pa}$.

- "In un recipiente di $2{,}00\,\text{L}$ ci sono $9{,}58 \cdot 10^{22}$ molecole di butano, di massa
  $9{,}65 \cdot 10^{-26}\,\text{kg}$ ciascuna, con velocità quadratica media $393\,\text{m/s}$. Quanto vale la pressione del
  gas?" Risposta $2{,}38 \cdot 10^{5}\,\text{Pa}$; distrattori $238\,\text{Pa}$ (i litri non convertiti),
  $7{,}14 \cdot 10^{5}\,\text{Pa}$ (il fattore $\frac{1}{3}$ dimenticato), $606\,\text{Pa}$ (la velocità non elevata al quadrato).
- "In un recipiente di $1{,}00\,\text{L}$ ci sono $4{,}52 \cdot 10^{22}$ molecole di anidride carbonica, di massa
  $7{,}31 \cdot 10^{-26}\,\text{kg}$ ciascuna, con velocità quadratica media $598\,\text{m/s}$ …" Risposta
  $3{,}94 \cdot 10^{5}\,\text{Pa}$.

## Livello 5: la velocità dalla pressione e dalla densità

$v_{qm} = \sqrt{3p/d}$. Pressione da $6{,}1 \cdot 10^{4}$ a $2{,}99 \cdot 10^{5}\,\text{Pa}$ con tre cifre (kilopascal interi
senza zero finale), densità con tre cifre: da $0{,}101$ a $0{,}999\,\text{kg/m}^3$ (caso "gas leggero") o da $1{,}01$ a
$2{,}49\,\text{kg/m}^3$ (caso "gas denso"), metà e metà.

- "Un gas alla pressione di $1{,}38 \cdot 10^{5}\,\text{Pa}$ ha densità $1{,}43\,\text{kg/m}^3$. Quanto vale la velocità
  quadratica media delle sue molecole?" Risposta $538\,\text{m/s}$; distrattori $311\,\text{m/s}$ (il 3 dimenticato),
  $2{,}90 \cdot 10^{5}\,\text{m/s}$ (la radice dimenticata), $769\,\text{m/s}$ (pressione per densità).
- "… $2{,}03 \cdot 10^{5}\,\text{Pa}$ … $0{,}334\,\text{kg/m}^3$ …" Risposta $1{,}35 \cdot 10^{3}\,\text{m/s}$.

## Livello 6: come cambia la pressione

Il numero di molecole, il volume e la velocità quadratica media cambiano ciascuno di un fattore tra "raddoppia",
"triplica", "si dimezza", "non cambia"; la velocità cambia sempre e almeno due grandezze su tre cambiano. La pressione
finale è $p_0$ per il fattore di $N$, per il quadrato di quello di $v_{qm}$, diviso per quello di $V$, scritta come
multiplo esatto di $p_0$ ($\frac{3}{2}\,p_0$, $8\,p_0$, $p_0$). Casi: "più veloci", "più lente".

- "In un recipiente il numero di molecole si dimezza, il volume triplica e la velocità quadratica media triplica. La
  pressione iniziale è $p_0$: quanto vale quella finale?" Risposta $\frac{3}{2}\,p_0$; distrattori $\frac{1}{2}\,p_0$ (il
  quadrato dimenticato), $\frac{27}{2}\,p_0$ (il volume rovesciato), $\frac{9}{2}\,p_0$ (tutti e due).
- "… il numero di molecole si dimezza, il volume raddoppia e la velocità quadratica media si dimezza …" Risposta
  $\frac{1}{16}\,p_0$.

## Da evitare

- Risposte a metà tra due arrotondamenti, o intere con lo zero finale.
- Al livello 3 velocità ripetute o troppo vicine, per cui media e velocità quadratica media coincidono a tre cifre.
- Al livello 6 il caso in cui non cambia niente, o cambia una grandezza sola.
- Trattini lunghi e "piuttosto che" nei testi.
