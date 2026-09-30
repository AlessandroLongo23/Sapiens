# La spinta di Archimede e il galleggiamento

Generatore: `fis-archimede` (`src/lib/exercises/v2/generators/fis-archimede.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_archimede.py` (aiuti in `_fis_atmosfera.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/30-fis-archimede.md` (note in `docs/lezioni/fisica/note/30-fis-archimede.md`).

Sei livelli, ognuno con una difficoltà in più: la spinta su un corpo tutto immerso, il peso apparente (una
sottrazione in più), il volume o la densità dalle letture di due dinamometri disegnati (le letture da leggere e la
formula da rovesciare), la parte immersa di un corpo che galleggia (il rapporto delle densità), la densità dalla linea
di galleggiamento disegnata (il rapporto al contrario), il carico massimo di una zattera o di una mongolfiera (la
spinta, il peso proprio e, per la mongolfiera, l'aria calda).

## Nomi dei livelli

1. La spinta su un corpo immerso
2. Il peso apparente
3. Dalle letture dei due dinamometri
4. La parte immersa di un corpo che galleggia
5. La densità dalla linea di galleggiamento
6. Il carico massimo

## Tipi di risposta

Risposta `number` con due cifre significative (mezzo in su), a scelta multipla con l'unità nell'opzione: N,
$\text{cm}^3$, $\text{dm}^3$, cm, $\text{kg/m}^3$, kg. Oltre $99$ in notazione scientifica ($6{,}3 \cdot
10^{3}\,\text{kg/m}^3$), come nelle lezioni del primo lotto. Un dato che darebbe un arrotondamento a metà si scarta.

## Regole comuni

- $g = 9{,}8\,\text{N/kg}$; densità delle tabelle delle lezioni 03 e 30, sempre scritte nel testo tra parentesi:
  acqua $1000$, acqua di mare $1030$, olio d'oliva $920$, alcol etilico $790$, glicerina $1260$; ferro $7870$,
  alluminio $2700$, rame $8960$, piombo $11\,300$; ghiaccio $917$; legno da $300$ a $900\,\text{kg/m}^3$ (multipli di
  $10$, dati nel testo); aria fuori dalla mongolfiera $1{,}20$, aria calda da $0{,}90$ a $0{,}99\,\text{kg/m}^3$.
- L'aria esterna è scritta $1{,}20$ (tre cifre) perché la differenza con l'aria calda abbia due cifre significative
  anche per la regola delle somme e differenze; la tabella della lezione 03 dà $1{,}2$.
- Nei passaggi i conti intermedi non arrotondati, poi "$\approx$" con due cifre.

## Livello 1: la spinta su un corpo immerso

Un blocco di metallo tutto immerso; volume in $\text{dm}^3$ (da $0{,}10$ a $9{,}9$, due cifre) o in $\text{cm}^3$
(da $100$ a $990$, multiplo di $10$), metà e metà; liquido a caso tra i cinque.

- "Un blocco di ferro (densità $7870\,\text{kg/m}^3$) ha il volume di $0{,}50\,\text{dm}^3$ ed è tutto immerso in
  acqua (densità $1000\,\text{kg/m}^3$). Quanto vale la spinta di Archimede sul blocco?" Risposta $4{,}9$ N;
  distrattori $39$ N (la densità del ferro, l'avviso della lezione), $4{,}9 \cdot 10^{3}$ N (i $\text{dm}^3$ presi per
  $\text{m}^3$), $0{,}50$ N (senza $g$).
- Con $250\,\text{cm}^3$ di rame nell'olio: risposta $2{,}3$ N ($2{,}254$); il secondo distrattore prende i
  $\text{cm}^3$ per $\text{dm}^3$.

## Livello 2: il peso apparente

Un corpo che pesa da $2{,}0$ a $9{,}9$ N in aria, con volume da $50$ a $500\,\text{cm}^3$ (multiplo di $10$), tutto
immerso in acqua, acqua di mare, olio o alcol. La densità del corpo, che il testo non dice, sta tra $1500$ e $12\,000
\,\text{kg/m}^3$ (il corpo affonda) e il peso apparente è almeno $1{,}0$ N. Il risultato ha un decimale come il peso,
per la regola delle differenze, cioè due cifre significative.

- "Un sasso pesa $4{,}5$ N in aria e ha il volume di $150\,\text{cm}^3$. Quanto segna il dinamometro a cui è appeso
  quando è tutto immerso in acqua?" $S_A = 1{,}47$ N, risposta $3{,}0$ N; distrattori $6{,}0$ N (spinta sommata),
  $1{,}5$ N (la spinta), $4{,}5$ N (il peso).
- Come l'esempio 2 della lezione, con il peso già in newton.

## Livello 3: dalle letture dei due dinamometri

Scena `dinamometri-archimede`: due dinamometri uguali, uno con il corpo in aria e uno con il corpo tutto immerso;
il testo ripete le letture. Due scale: $5$ N in $25$ divisioni ($0{,}2$ N) e $10$ N in $25$ divisioni ($0{,}4$ N),
numeri ogni $5$ divisioni. Peso e spinta (differenza delle letture) almeno $1{,}0$ N. Liquido: acqua, olio o alcol.
Metà dei casi si chiede il volume (in $\text{cm}^3$), metà la densità (tra $1500$ e $12\,000\,\text{kg/m}^3$); il caso
si sceglie prima dei dati, così gli scarti non cambiano le quote.

- "Un corpo appeso ai dinamometri della figura segna $7{,}6$ N in aria e $6{,}4$ N quando è tutto immerso in acqua.
  Qual è la densità del corpo?" Risposta $6{,}3 \cdot 10^{3}\,\text{kg/m}^3$; distrattori il rapporto rovesciato
  ($1{,}6 \cdot 10^{2}$), la lettura in acqua al posto del peso ($5{,}3 \cdot 10^{3}$), $P / P_{app}$ ($1{,}2 \cdot
  10^{3}$).
- Stesse letture, "Qual è il volume del corpo?": risposta $1{,}2 \cdot 10^{2}\,\text{cm}^3$ ($122{,}4$); distrattori
  il peso in aria al posto della spinta, la lettura in acqua, $g$ dimenticato.

## Livello 4: la parte immersa di un corpo che galleggia

Un blocco di legno (densità data) o di ghiaccio ($917$, un caso su cinque) in acqua, acqua di mare, olio o glicerina,
con la densità del corpo al massimo il $95\%$ di quella del liquido. Metà dei casi l'altezza immersa di un blocco alto
da $10$ a $60$ cm, metà il volume immerso di un corpo da $1{,}0$ a $9{,}9\,\text{dm}^3$.

- "Un blocco di legno (densità $600\,\text{kg/m}^3$) alto $10$ cm galleggia in acqua con le facce orizzontali.
  Quanti centimetri della sua altezza sono sotto la superficie?" Risposta $6{,}0$ cm (esempio 4); distrattori $17$ cm
  (rapporto rovesciato, più del blocco), $4{,}0$ cm (la parte fuori), $10$ cm (il blocco intero).
- "Un blocco di ghiaccio ($917$) ha il volume di $2{,}0\,\text{dm}^3$ e galleggia in acqua di mare ($1030$)."
  Risposta $1{,}8\,\text{dm}^3$; con un liquido diverso dall'acqua il terzo distrattore usa la densità dell'acqua.

## Livello 5: la densità dalla linea di galleggiamento

Scena `galleggiante-quote`: un blocco che galleggia, con l'altezza $h$ (intera, da $10$ a $30$ cm) e l'altezza
immersa $h_{imm}$ (due cifre, tra il $15\%$ e il $95\%$ di $h$) segnate sulla figura; il testo non le ripete. Metà dei
casi si chiede la densità del blocco (liquido dato), metà quella del liquido (legno di densità data; il liquido tra
$700$ e $1600\,\text{kg/m}^3$).

- Figura con $h = 10$ cm e $h_{imm} = 6{,}0$ cm, "Il blocco della figura galleggia in acqua (densità $1000\,
  \text{kg/m}^3$). Qual è la densità del blocco?" Risposta $6{,}0 \cdot 10^{2}\,\text{kg/m}^3$; distrattori il
  rapporto rovesciato ($1{,}7 \cdot 10^{3}$), la parte fuori ($4{,}0 \cdot 10^{2}$), la densità del liquido.
- Figura con $h = 20$ cm e $h_{imm} = 12$ cm, legno di $600\,\text{kg/m}^3$: la densità del liquido è $1{,}0 \cdot
  10^{3}\,\text{kg/m}^3$.

## Livello 6: il carico massimo

Metà dei casi una zattera (volume da $0{,}50$ a $0{,}99$ o da $1{,}0$ a $3{,}0\,\text{m}^3$, massa da $80$ a $400$ kg,
al massimo il $60\%$ dell'acqua che sposta tutta sotto) in acqua o in mare; metà una mongolfiera (volume da $1500$ a
$3000\,\text{m}^3$, multiplo di $100$; massa propria da $200$ a $400$ kg; carico almeno $50$ kg).

- "Una zattera ha il volume di $0{,}80\,\text{m}^3$ e la massa di $120$ kg. Quale massa può portare al massimo senza
  andare sotto, in acqua?" Risposta $6{,}8 \cdot 10^{2}$ kg; distrattori $8{,}0 \cdot 10^{2}$ kg (la massa della
  zattera dimenticata), $9{,}2 \cdot 10^{2}$ kg (sommata), $6{,}7 \cdot 10^{3}$ kg (il carico come peso in newton).
- Mongolfiera di $2400\,\text{m}^3$, aria calda $0{,}95$, massa propria $400$ kg: risposta $2{,}0 \cdot 10^{2}$ kg
  (come l'esempio 6 della lezione, che dà $600$ kg prima di togliere l'involucro); distrattori l'aria calda
  dimenticata, la massa propria dimenticata, il peso in newton.

## Esercizi da evitare

- Arrotondamenti a metà; corpi che al livello 2 o 3 galleggerebbero (densità sotto $1500$).
- Letture del livello 3 fuori dalle tacche, o una spinta sotto $1{,}0$ N (una cifra significativa sola).
- Corpi del livello 4 con densità vicina a quella del liquido (sopra il $95\%$) e altezze immerse del livello 5
  troppo piccole o troppo vicine all'altezza intera per leggerle sulla figura.

## Verifica

`fis_archimede.py` rilegge il testo, controlla che le densità scritte siano quelle delle tabelle, gli intervalli e le
cifre significative dei dati, ricalcola il valore esatto con i razionali di SymPy e lo arrotonda; al livello 3 le
letture del testo devono essere quelle della scena e cadere su una tacca di una delle due scale, al livello 5 le
altezze della scena devono avere le etichette giuste. Poi la risposta, le opzioni, la soluzione, la quota dei casi.

Esito: seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con codice 0 (opzioni
larghe al massimo 119 px).

### Errori piantati

Su 240 esercizi, tutti bocciati: risposta cambiata, opzione giusta spostata, due opzioni uguali, opzione senza lo
spazio sottile, un dato del testo cambiato; su 80 esercizi dei livelli 3 e 5, la scena cambiata (una lettura o
l'altezza immersa).

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 900 (910), livello 2 990 (990), livello 3 719 (731), livello 4 962 (959), livello 5
960 contando anche la scena (65 testi diversi: le altezze sono solo nella figura), livello 6 925 (935).

## Domande per la revisione

- Acqua di mare $1030\,\text{kg/m}^3$ o $1025$? I libri usano l'uno o l'altro.
- Il livello 2 dà il peso in newton; si può dare la massa in grammi e chiedere prima il peso.
- Il livello 5 non ripete le altezze nel testo: lo studente deve leggerle sulla figura. Va bene, o come al livello 3
  le si scrive anche nel testo?
- Il carico come massa (kg) e non come peso: è più naturale, ma la lezione ragiona con le forze.
