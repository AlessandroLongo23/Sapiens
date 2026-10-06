# La legge di Boyle (fisica)

Generatore: `fis-legge-boyle` (`src/lib/exercises/v2/generators/fis-legge-boyle.ts`, con
`src/lib/exercises/v2/fis-gas-leggi.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_legge_boyle.py` (con
`_fis_gas_leggi.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/102-fis-legge-boyle.md`. Percorso nel database:
`high_school/physics/fis-gas/fis-legge-boyle`.

Cinque livelli, ognuno con una difficoltà in più, nell'ordine della lezione. La chimica ha già `chim-legge-boyle`
(atmosfere e litri, il grafico, la bolla del sub con "un'atmosfera ogni dieci metri"): qui la pressione viene dalle
forze sul pistone e dalla legge di Stevino, e le unità sono quelle del Sistema Internazionale.

## Nomi dei livelli

1. La pressione sotto il pistone
2. La pressione finale
3. Dove si ferma il pistone
4. Sulla stessa isoterma
5. La bolla nel lago

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, l'unità nell'opzione. Costanti della lezione, date nel testo dove servono:
$p_0 = 1{,}01 \cdot 10^5\,\text{Pa}$, $g = 9{,}8\,\text{m/s}^2$, $d = 1000\,\text{kg/m}^3$. I risultati si calcolano con i
razionali esatti e si arrotondano una volta sola, alla fine (tre cifre significative ai livelli 1, 2 e 3, due al
livello 5); un risultato a metà tra due arrotondamenti si scarta, e così un risultato intero che finisce con uno zero.

## Livello 1: la pressione sotto il pistone

Pistone di massa trascurabile e di area $10$, $20$, $25$, $40$ o $50\,\text{cm}^2$; sopra, un corpo da $1{,}0$ a
$9{,}5\,\text{kg}$ a passi di mezzo chilo. $p = p_0 + m g / S$, in pascal con tre cifre. Scena `cilindro-pistone` con il
corpo e le etichette di $m$ e $S$ (nessuna altezza).

- "Un cilindro è chiuso da un pistone di massa trascurabile e di area $10\,\text{cm}^2$, su cui è appoggiato un corpo di
  $1{,}5\,\text{kg}$. Fuori c'è la pressione atmosferica, $1{,}01 \cdot 10^5\,\text{Pa}$. Quanto vale la pressione del
  gas?" Risposta $1{,}16 \cdot 10^5\,\text{Pa}$; distrattori $1{,}47 \cdot 10^4\,\text{Pa}$ (la pressione atmosferica
  dimenticata, l'avviso della lezione), $1{,}03 \cdot 10^5\,\text{Pa}$ (la massa al posto del peso),
  $1{,}01 \cdot 10^5\,\text{Pa}$ (l'area lasciata in centimetri quadrati: il termine in più sparisce).
- Con $6{,}5\,\text{kg}$ sullo stesso pistone: $1{,}65 \cdot 10^5\,\text{Pa}$.

## Livello 2: la pressione finale

Volumi da $1{,}1$ a $9{,}9\,\text{L}$ con due cifre, pressione iniziale intera da $101$ a $299\,\text{kPa}$ che non
finisce per zero; rapporto dei volumi tra $1/4$ e $4$ e lontano da $1$ (fuori da $0{,}9$-$1{,}11$). Il verbo segue i
dati: "compresso" se il volume diminuisce, "lasciato espandere" se aumenta.

- "Un gas occupa $6{,}6\,\text{L}$ alla pressione di $132\,\text{kPa}$. A temperatura costante viene compresso
  lentamente fino al volume di $3{,}7\,\text{L}$. Quanto vale la pressione finale?" Risposta $235\,\text{kPa}$;
  distrattori $74{,}0\,\text{kPa}$ (il rapporto capovolto), $871\,\text{kPa}$ (la divisione dimenticata),
  $35{,}7\,\text{kPa}$ (il primo volume dimenticato).
- "$3{,}2\,\text{L}$ a $193\,\text{kPa}$, lasciato espandere fino a $6{,}0\,\text{L}$": $103\,\text{kPa}$.

## Livello 3: dove si ferma il pistone

I livelli 1 e 2 insieme: il gas parte alla pressione atmosferica con il pistone tra $20{,}0$ e $40{,}0\,\text{cm}$ dal
fondo (un decimale), poi si appoggia il corpo del livello 1. $h_2 = h_1\,p_0 / (p_0 + m g / S)$, in centimetri con tre
cifre; il pistone scende di almeno un centimetro. Scena `cilindro-pistone` con $h_1$ e senza corpo; nella soluzione la
stessa scena con il corpo, $h_2$ e la linea tratteggiata dell'altezza di prima.

- "... area $10\,\text{cm}^2$ ... il pistone è a $26{,}0\,\text{cm}$ dal fondo. Si appoggia sul pistone un corpo di
  $6{,}5\,\text{kg}$ ..." Risposta $15{,}9\,\text{cm}$; distrattori $42{,}4\,\text{cm}$ (il rapporto capovolto),
  $10{,}1\,\text{cm}$ (la discesa al posto dell'altezza), $41{,}2\,\text{cm}$ (la pressione atmosferica dimenticata in
  $p_2$).
- Con $39{,}6\,\text{cm}$ e $1{,}5\,\text{kg}$: $34{,}6\,\text{cm}$.

## Livello 4: sulla stessa isoterma

Stato $A$ con pressione tra $120$, $150$, $180$, $240$, $300$, $360$, $450$, $600\,\text{kPa}$ e volume tra $1{,}5$,
$2{,}0$, $2{,}4$, $3{,}0$, $4{,}0$, $6{,}0$, $8{,}0\,\text{L}$. Le quattro opzioni sono stati, scritti
"$p$ kPa; $V$ L": quello giusto ha la pressione moltiplicata per $k$ e il volume diviso per $k$ ($k$ tra $2$, $3$,
$4$, $3/2$ e i loro inversi). Distrattori: tutti e due moltiplicati per $k$; tutti e due divisi; il volume giusto con
un'altra pressione. Pressioni intere tra $30$ e $1800\,\text{kPa}$, volumi con un decimale tra $0{,}5$ e $30\,\text{L}$,
quattro prodotti diversi e uno solo uguale a quello di $A$.

- "Un gas è nello stato $A$, con pressione $150\,\text{kPa}$ e volume $4{,}0\,\text{L}$. In quale di questi stati lo
  stesso gas ha la temperatura che ha in $A$?" Risposta "$75\,\text{kPa}$; $8{,}0\,\text{L}$" ($600\,\text{J}$);
  distrattori "$150\,\text{kPa}$; $8{,}0\,\text{L}$", "$75\,\text{kPa}$; $2{,}0\,\text{L}$", "$300\,\text{kPa}$;
  $8{,}0\,\text{L}$".

## Livello 5: la bolla nel lago

Profondità intera da $4$ a $45\,\text{m}$ che non finisce per zero, bolla da $1{,}1$ a $9{,}9\,\text{cm}^3$.
$p_1 = p_0 + d\,g\,h$ e $V_2 = V_1\,p_1 / p_0$, in centimetri cubi con due cifre.

- "Sul fondo di un lago, a $16\,\text{m}$ di profondità, si stacca una bolla d'aria di $7{,}2\,\text{cm}^3$ ..." Risposta
  $18\,\text{cm}^3$; distrattori $11\,\text{cm}^3$ (la pressione atmosferica dimenticata sul fondo, l'avviso della
  lezione), $2{,}8\,\text{cm}^3$ (il rapporto capovolto), più un valore vicino.
- A $4\,\text{m}$ con $1{,}6\,\text{cm}^3$: $2{,}2\,\text{cm}^3$.

## Esercizi da evitare

- Rapporti dei volumi vicini a $1$, dove la risposta giusta e quella con il rapporto capovolto quasi coincidono.
- Risultati interi che finiscono con uno zero ($120\,\text{kPa}$, $10\,\text{cm}^3$).
- Pistoni che scendono di meno di un centimetro (livello 3).
- Nel livello 4, lo stato $A$ stesso tra le opzioni, o due opzioni con lo stesso prodotto.

## Verifica

`fis_legge_boyle.py` rilegge il testo, controlla aree, masse, intervalli, il verbo del livello 2, ricalcola con i
razionali, confronta l'opzione giusta e il formato delle altre; per i livelli 1 e 3 controlla che la scena disegni i
dati del testo (e nella soluzione l'altezza trovata); per il livello 4 ricalcola il prodotto di ogni stato e vuole che
uno solo, quello indicato, abbia il prodotto di $A$.

L'esito dei controlli (seed, errori piantati, `review.mts`, `width.mts`) è nel rapporto del gruppo 39 e nella nota della
lezione.

## Domande per la revisione

- Il livello 1 non usa ancora la legge di Boyle: è il primo passo della lezione (la pressione del gas dalle forze sul
  pistone) e serve al livello 3. Va bene come primo livello, o va spostato tra gli esercizi sulla pressione?
- L'esempio 5 della lezione (l'aria intrappolata dal mercurio in un tubo, pressioni in cmHg) non ha un livello.
